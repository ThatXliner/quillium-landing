<script lang="ts">
	import { onMount } from 'svelte';
	import { Pen, Lock, ShieldCheck } from '@lucide/svelte';
	import posthog from 'posthog-js';
	import { gsap } from 'gsap';

	const REPO = 'ThatXliner/quillium-releases';

	let { release }: { release: { assets: { name: string; url: string }[] } } = $props();

	function findAsset(pattern: string): string {
		const match = release.assets.find((a: { url: string }) => a.url.includes(pattern));
		if (match) return match.url;
		return `https://github.com/${REPO}/releases/latest`;
	}

	let detected = $state('unknown');
	let downloadUrl = $derived.by(() => {
		if (detected === 'mac') return findAsset('_aarch64.dmg');
		if (detected === 'windows') return findAsset('_x64-setup.exe');
		if (detected === 'linux') return findAsset('_amd64.deb');
		return '#download';
	});

	let copyEl: HTMLDivElement;
	let sceneEl = $state<HTMLDivElement>();
	let webglFailed = $state(false);

	// The three drafts shown on the floating pages. One sentence, three ways —
	// this is the product pitch rendered literally.
	const DRAFTS = [
		{ pill: 'Draft A', color: '#3b82f6', text: 'The rain found her before the door did.' },
		{ pill: 'Draft B', color: '#a855f7', text: 'She stepped out into the waiting rain.' },
		{ pill: 'Draft C', color: '#22c55e', text: 'Rain met her at the threshold.' }
	];

	const INK = '#2b2926';
	const PAGE_W = 1.32;
	const PAGE_H = 1.72;

	onMount(() => {
		const ua = navigator.userAgent.toLowerCase();
		if (ua.includes('mac')) detected = 'mac';
		else if (ua.includes('win')) detected = 'windows';
		else if (ua.includes('linux')) detected = 'linux';

		const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (!reduceMotion && copyEl) {
			gsap.from(copyEl.children, {
				opacity: 0,
				y: 32,
				duration: 0.9,
				stagger: 0.1,
				ease: 'power3.out'
			});
		}

		let destroyed = false;
		let cleanupScene: (() => void) | undefined;

		initScene(reduceMotion)
			.then((cleanup) => {
				if (destroyed) cleanup?.();
				else cleanupScene = cleanup;
			})
			.catch(() => {
				webglFailed = true;
			});

		return () => {
			destroyed = true;
			cleanupScene?.();
		};
	});

	async function initScene(reduceMotion: boolean): Promise<() => void> {
		const THREE = await import('three');
		const host = sceneEl;
		if (!host) throw new Error('scene host missing');

		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setClearColor(0x000000, 0);
		renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
		host.appendChild(renderer.domElement);

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
		const root = new THREE.Group();
		scene.add(root);

		scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d2c8, 1.15));
		const sun = new THREE.DirectionalLight(0xfff1e0, 1.2);
		sun.position.set(3, 5, 4);
		scene.add(sun);

		const disposables: { dispose(): void }[] = [];
		const track = <T extends { dispose(): void }>(d: T): T => (disposables.push(d), d);

		// ── Ink strands ──────────────────────────────────────────────
		const fork = new THREE.Vector3(-0.55, 0, 0);
		const trunkCurve = new THREE.CatmullRomCurve3([
			new THREE.Vector3(-3.6, -0.35, -0.2),
			new THREE.Vector3(-2.4, 0.1, 0.05),
			new THREE.Vector3(-1.4, -0.1, 0.1),
			fork
		]);
		const pagePos = [
			new THREE.Vector3(1.4, 1.45, -0.25),
			new THREE.Vector3(2.25, 0, 0.15),
			new THREE.Vector3(1.4, -1.5, -0.1)
		];
		const branchCurves = pagePos.map((p) => {
			const end = new THREE.Vector3(p.x - PAGE_W / 2 - 0.15, p.y * 0.97, p.z + 0.05);
			const run = end.x - fork.x;
			return new THREE.CatmullRomCurve3([
				fork,
				new THREE.Vector3(fork.x + run * 0.38, p.y * 0.42, p.z * 0.5),
				new THREE.Vector3(fork.x + run * 0.74, p.y * 0.82, p.z * 0.8),
				end
			]);
		});

		const inkMat = track(new THREE.MeshBasicMaterial({ color: INK }));
		const makeStrand = (curve: InstanceType<typeof THREE.CatmullRomCurve3>, radius: number) => {
			const geo = track(new THREE.TubeGeometry(curve, 90, radius, 8));
			const mesh = new THREE.Mesh(geo, inkMat);
			root.add(mesh);
			return geo;
		};
		const trunkGeo = makeStrand(trunkCurve, 0.034);
		const branchGeos = branchCurves.map((c) => makeStrand(c, 0.021));

		// Pen touch-down dot at the trunk's origin
		const dot = new THREE.Mesh(track(new THREE.SphereGeometry(0.05, 16, 16)), inkMat);
		dot.position.copy(trunkCurve.getPoint(0));
		root.add(dot);

		// Fork node — a version pill, the brand's revise purple
		const pill = new THREE.Mesh(
			track(new THREE.CapsuleGeometry(0.055, 0.13, 4, 14)),
			track(new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.5 }))
		);
		pill.rotation.z = Math.PI / 2;
		pill.position.copy(fork);
		root.add(pill);

		// ── Pages ────────────────────────────────────────────────────
		const shadowTex = track(makeShadowTexture(THREE));
		const pages = DRAFTS.map((draft, i) => {
			const group = new THREE.Group();
			group.position.copy(pagePos[i]);
			group.rotation.set(-0.04 + i * 0.03, -0.16 + i * 0.05, (i - 1) * 0.04);

			const geo = track(new THREE.PlaneGeometry(PAGE_W, PAGE_H, 10, 10));
			// Gentle paper curl along x
			const pos = geo.attributes.position;
			for (let v = 0; v < pos.count; v++) {
				const t = (pos.getX(v) + PAGE_W / 2) / PAGE_W;
				pos.setZ(v, t * t * 0.1 - 0.03);
			}
			geo.computeVertexNormals();

			const tex = track(makePageTexture(THREE, draft, i));
			tex.colorSpace = THREE.SRGBColorSpace;
			tex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
			// Unlit: paper stays exactly as drawn, crisp against the warm page bg
			const mat = track(
				new THREE.MeshBasicMaterial({
					map: tex,
					side: THREE.DoubleSide,
					transparent: true,
					opacity: reduceMotion ? 1 : 0
				})
			);
			const mesh = new THREE.Mesh(geo, mat);

			const shadowMat = track(
				new THREE.MeshBasicMaterial({
					map: shadowTex,
					transparent: true,
					depthWrite: false,
					opacity: reduceMotion ? 0.2 : 0
				})
			);
			const shadow = new THREE.Mesh(
				track(new THREE.PlaneGeometry(PAGE_W * 1.5, PAGE_H * 1.4)),
				shadowMat
			);
			shadow.position.z = -0.09;

			group.add(shadow, mesh);
			if (!reduceMotion) group.scale.setScalar(0.92);
			root.add(group);
			return { group, mat, shadowMat, phase: i * 2.1 };
		});

		// ── Sizing ───────────────────────────────────────────────────
		const fitCamera = () => {
			const w = host.clientWidth || 1;
			const h = host.clientHeight || 1;
			renderer.setSize(w, h);
			const aspect = w / h;
			camera.aspect = aspect;
			// Frame the whole strand when there's room; on narrow canvases crop
			// the trunk off-left and center on the fork + pages. Fit both axes.
			const wide = aspect > 0.9;
			const focusW = wide ? 7.0 : 4.7;
			const focusH = 5.0;
			const cx = wide ? -0.35 : 0.65;
			const halfTan = Math.tan((camera.fov * Math.PI) / 360);
			const z = THREE.MathUtils.clamp(
				Math.max(focusW / (2 * halfTan * aspect), focusH / (2 * halfTan)),
				5,
				16
			);
			camera.position.set(cx, 0.1, z);
			camera.lookAt(cx, 0, 0);
			camera.updateProjectionMatrix();
			if (reduceMotion) renderer.render(scene, camera);
		};
		const ro = new ResizeObserver(fitCamera);
		ro.observe(host);
		fitCamera();

		// ── Entrance ─────────────────────────────────────────────────
		const setStrand = (geo: InstanceType<typeof THREE.TubeGeometry>, p: number) => {
			const total = geo.index!.count;
			geo.setDrawRange(0, Math.floor((total * p) / 3) * 3);
		};
		const tl = gsap.timeline({ paused: true });
		if (reduceMotion) {
			setStrand(trunkGeo, 1);
			branchGeos.forEach((g) => setStrand(g, 1));
		} else {
			setStrand(trunkGeo, 0);
			branchGeos.forEach((g) => setStrand(g, 0));
			pill.scale.setScalar(0.001);
			dot.scale.setScalar(0.001);

			const trunk = { p: 0 };
			tl.to(dot.scale, { x: 1, y: 1, z: 1, duration: 0.25, ease: 'back.out(2.5)' }, 0.1)
				.to(
					trunk,
					{
						p: 1,
						duration: 1.0,
						ease: 'power2.inOut',
						onUpdate: () => setStrand(trunkGeo, trunk.p)
					},
					0.15
				)
				.to(pill.scale, { x: 1, y: 1, z: 1, duration: 0.45, ease: 'back.out(2)' }, 1.0);
			branchGeos.forEach((geo, i) => {
				const b = { p: 0 };
				tl.to(
					b,
					{ p: 1, duration: 0.85, ease: 'power2.out', onUpdate: () => setStrand(geo, b.p) },
					1.15 + i * 0.14
				);
			});
			pages.forEach(({ group, mat, shadowMat }, i) => {
				const at = 1.6 + i * 0.14;
				tl.to(mat, { opacity: 1, duration: 0.8, ease: 'power3.out' }, at)
					.to(shadowMat, { opacity: 0.2, duration: 0.8, ease: 'power3.out' }, at)
					.to(group.scale, { x: 1, y: 1, z: 1, duration: 0.9, ease: 'power3.out' }, at);
			});
		}

		// ── Idle loop ────────────────────────────────────────────────
		const pointer = { x: 0, y: 0 };
		const onPointer = (e: PointerEvent) => {
			pointer.x = (e.clientX / innerWidth) * 2 - 1;
			pointer.y = (e.clientY / innerHeight) * 2 - 1;
		};
		if (!reduceMotion) addEventListener('pointermove', onPointer, { passive: true });

		let rafId = 0;
		let inView = true;
		const clock = new THREE.Clock();
		const tick = () => {
			rafId = requestAnimationFrame(tick);
			const t = clock.getElapsedTime();
			root.rotation.y += (pointer.x * 0.07 - root.rotation.y) * 0.05;
			root.rotation.x += (-pointer.y * 0.04 - root.rotation.x) * 0.05;
			pages.forEach(({ group, phase }, i) => {
				group.position.y = pagePos[i].y + Math.sin(t * 0.55 + phase) * 0.035;
				group.rotation.z = (i - 1) * 0.04 + Math.sin(t * 0.4 + phase) * 0.012;
			});
			renderer.render(scene, camera);
		};

		// Entrance waits until the canvas is actually on screen (it starts
		// below the fold on mobile); the render loop pauses off screen.
		let played = reduceMotion;
		const io = new IntersectionObserver(([entry]) => {
			inView = entry.isIntersecting;
			if (reduceMotion) return;
			if (inView && !played) {
				played = true;
				tl.play();
			}
			if (inView && !rafId) tick();
			else if (!inView && rafId) {
				cancelAnimationFrame(rafId);
				rafId = 0;
			}
		});
		io.observe(host);
		if (!reduceMotion) tick();
		else renderer.render(scene, camera);

		return () => {
			tl.kill();
			io.disconnect();
			ro.disconnect();
			if (rafId) cancelAnimationFrame(rafId);
			removeEventListener('pointermove', onPointer);
			disposables.forEach((d) => d.dispose());
			renderer.dispose();
			renderer.domElement.remove();
		};
	}

	type ThreeNS = typeof import('three');

	function makeShadowTexture(THREE: ThreeNS) {
		const c = document.createElement('canvas');
		c.width = c.height = 128;
		const ctx = c.getContext('2d')!;
		const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 64);
		g.addColorStop(0, 'rgba(40, 35, 25, 1)');
		g.addColorStop(1, 'rgba(40, 35, 25, 0)');
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, 128, 128);
		return new THREE.CanvasTexture(c);
	}

	function makePageTexture(
		THREE: ThreeNS,
		draft: { pill: string; color: string; text: string },
		seed: number
	) {
		const W = 768;
		const H = 998; // matches PAGE_W : PAGE_H
		const c = document.createElement('canvas');
		c.width = W;
		c.height = H;
		const ctx = c.getContext('2d')!;

		ctx.fillStyle = '#fffdf8';
		ctx.fillRect(0, 0, W, H);

		// Version pill
		const pillH = 52;
		ctx.font = '600 30px Inter, system-ui, sans-serif';
		const pillW = ctx.measureText(draft.pill).width + 56;
		ctx.fillStyle = draft.color;
		ctx.beginPath();
		ctx.roundRect(72, 78, pillW, pillH, pillH / 2);
		ctx.fill();
		ctx.fillStyle = '#ffffff';
		ctx.textBaseline = 'middle';
		ctx.fillText(draft.pill, 100, 78 + pillH / 2 + 2);

		// The sentence, wrapped
		ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
		ctx.font = '52px Georgia, serif';
		ctx.textBaseline = 'alphabetic';
		const maxW = W - 144;
		let line = '';
		let y = 230;
		for (const word of draft.text.split(' ')) {
			const test = line ? `${line} ${word}` : word;
			if (ctx.measureText(test).width > maxW && line) {
				ctx.fillText(line, 72, y);
				line = word;
				y += 74;
			} else {
				line = test;
			}
		}
		ctx.fillText(line, 72, y);

		// Faint bars suggesting the rest of the manuscript
		const widths = [0.92, 0.68, 0.84, 0.58, 0.78, 0.9, 0.5, 0.86, 0.72];
		ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
		let barY = y + 96;
		for (let i = 0; i < widths.length && barY < H - 80; i++) {
			const w = widths[(i + seed * 3) % widths.length] * maxW;
			ctx.beginPath();
			ctx.roundRect(72, barY, w, 22, 11);
			ctx.fill();
			barY += 58;
		}

		return new THREE.CanvasTexture(c);
	}
</script>

<!-- ==================== HERO (3D) ==================== -->
<section
	class="relative mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-6 overflow-hidden px-8 pt-28 pb-6 lg:flex-row lg:items-center lg:gap-2 lg:pt-20"
>
	<div
		bind:this={copyEl}
		class="relative z-10 flex shrink-0 flex-col items-center text-center lg:w-[46%] lg:items-start lg:text-left"
	>
		<div
			class="mb-4 flex h-[96px] w-[96px] items-center justify-center rounded-[26px] border-[1.5px] border-white/35 bg-radial-[at_40%_35%] from-[#eceef2] to-[#cdd1d9] transition-transform duration-400 hover:scale-105 hover:-rotate-2"
		>
			<img src="/logo.svg" alt="Quillium mark" width="76" height="76" />
		</div>

		<p
			class="mb-4 text-[0.75rem] font-semibold tracking-[0.15em] text-black/35 uppercase contrast-more:text-black/55"
		>
			The Non-Linear Writing App
		</p>

		<h1
			class="mb-5 max-w-[700px] font-[Newsreader,Georgia,serif] text-[clamp(2.6rem,4.8vw,3.8rem)] leading-[1.12] font-normal tracking-[-0.03em] text-black/88"
		>
			Prose for <span class="italic">Pros</span>.
		</h1>

		<p
			class="mb-8 max-w-[520px] text-[1.1rem] leading-[1.7] text-black/50 contrast-more:text-black/60"
		>
			Write a sentence three different ways, and decide which to pick later. Branch any phrase
			without losing a single word.
		</p>

		<div class="flex flex-col items-center gap-3 lg:items-start">
			<div class="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
				<a
					href={downloadUrl}
					class="btn-primary inline-flex items-center gap-2"
					onclick={() => posthog.capture('cta_clicked', { cta: 'download', location: 'hero' })}
				>
					Download Now
				</a>
				<a
					href="#features"
					class="inline-flex items-center gap-2 rounded-[10px] bg-white/50 px-6 py-3 text-[0.95rem] font-medium text-black/88 no-underline shadow-md inset-shadow-sm inset-shadow-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-50/30"
				>
					See how it works
				</a>
			</div>
			<p class="text-[0.7rem] text-black/30 contrast-more:text-black/50">
				By downloading, you agree to the <a
					href="/terms"
					class="text-black/40 underline underline-offset-2 hover:text-black/55 contrast-more:text-black/55 contrast-more:hover:text-black/70"
					>Terms of Service</a
				>
			</p>
		</div>

		<p
			class="mt-6 mb-0 flex flex-wrap items-center justify-center gap-x-5 border-t-2 pt-4 text-[0.9rem] tracking-wide text-black/50 lg:justify-start"
			style="border-image: linear-gradient(90deg, transparent, #3b82f6, #a855f7, #22c55e, #fcbc05, transparent) 1;"
		>
			<a
				href="/blog/quillium-is-not-an-ai-app"
				class="inline-flex items-center gap-1 text-black/50 underline transition-colors duration-300 hover:text-black/70"
				><Pen size={15} strokeWidth={2} class="opacity-50" />Write every word (No AI bs).</a
			>
			<a
				href="/blog/quillium-privacy"
				class="inline-flex items-center gap-1 text-black/50 underline transition-colors duration-300 hover:text-black/70"
				><Lock size={15} strokeWidth={2} class="opacity-50" />Fully private.</a
			>
			<a
				href="/blog/how-quillium-keeps-your-writing-safe"
				class="inline-flex items-center gap-1 text-black/50 underline transition-colors duration-300 hover:text-black/70"
				><ShieldCheck size={15} strokeWidth={2} class="opacity-50" />Safe and secure.</a
			>
		</p>
	</div>

	{#if !webglFailed}
		<div
			bind:this={sceneEl}
			class="scene-host relative h-[52vh] min-h-[380px] w-full lg:h-auto lg:min-h-[560px] lg:flex-1 lg:self-stretch"
			role="img"
			aria-label="A line of ink branches into three floating manuscript pages, each holding a different draft of the same sentence: {DRAFTS.map(
				(d) => `“${d.text}”`
			).join(', ')}"
		></div>
	{/if}
</section>

<style>
	.scene-host :global(canvas) {
		position: absolute;
		inset: 0;
		display: block;
	}
</style>
