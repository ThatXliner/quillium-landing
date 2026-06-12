<script lang="ts">
	import { onMount } from 'svelte';
	import posthog from 'posthog-js';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

	let wrapperEl = $state<HTMLDivElement>();
	let sceneEl = $state<HTMLDivElement>();
	let chapterEls: HTMLDivElement[] = $state([]);
	let staticMode = $state(false); // reduced motion or WebGL failure

	// The same three drafts as Hero3D — continuity across variants
	const DRAFTS = [
		'The rain found her before the door did.',
		'She stepped out into the waiting rain.',
		'Rain met her at the threshold.'
	];

	const CREAM = '#f7f1e3';

	// Scroll progress windows for the four copy chapters
	// Last chapter's end sits past 1 so it never fades back out
	const CHAPTERS: [number, number][] = [
		[0.0, 0.2],
		[0.26, 0.46],
		[0.52, 0.74],
		[0.82, 1.2]
	];

	onMount(() => {
		const ua = navigator.userAgent.toLowerCase();
		if (ua.includes('mac')) detected = 'mac';
		else if (ua.includes('win')) detected = 'windows';
		else if (ua.includes('linux')) detected = 'linux';

		const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduceMotion) staticMode = true;

		// Dark navbar while this dark section is under it; the observed strip is
		// the top sliver of the viewport, so it flips back once the hero scrolls past.
		const navIo = new IntersectionObserver(
			([entry]) => {
				document.documentElement.toggleAttribute('data-nav-dark', entry.isIntersecting);
			},
			{ rootMargin: '0px 0px -99% 0px' }
		);
		if (wrapperEl) navIo.observe(wrapperEl);

		let destroyed = false;
		let cleanupScene: (() => void) | undefined;

		initScene(reduceMotion)
			.then((cleanup) => {
				if (destroyed) cleanup?.();
				else cleanupScene = cleanup;
			})
			.catch(() => {
				staticMode = true;
			});

		return () => {
			destroyed = true;
			navIo.disconnect();
			document.documentElement.removeAttribute('data-nav-dark');
			cleanupScene?.();
		};
	});

	async function initScene(reduceMotion: boolean): Promise<() => void> {
		const THREE = await import('three');
		const host = sceneEl;
		const wrapper = wrapperEl;
		if (!host || !wrapper) throw new Error('scene host missing');

		const isMobile = innerWidth < 768;

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
		host.appendChild(renderer.domElement);

		const scene = new THREE.Scene();
		scene.background = new THREE.Color('#171310');
		scene.fog = new THREE.Fog('#171310', 14, 34);
		const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);

		scene.add(new THREE.AmbientLight(0xfff3df, 0.5));
		const key = new THREE.DirectionalLight(0xfff3df, 2.2);
		key.position.set(3, 5, 6);
		scene.add(key);

		const disposables: { dispose(): void }[] = [];
		const track = <T extends { dispose(): void }>(d: T): T => (disposables.push(d), d);

		// ── Flight paths: one shared trunk that splits into three ────
		const trunk: [number, number, number][] = [
			[-15, 2.4, 0],
			[-11, 0.8, -1.0],
			[-7, 1.8, 0.8],
			[-2.5, 0.4, 0]
		];
		const tails: [number, number, number][][] = [
			[
				[0.5, 1.6, -0.9],
				[4, 2.6, -1.8],
				[8.5, 2.0, -2.2],
				[12.5, 3.0, -1.4],
				[16, 2.4, -2.0]
			],
			[
				[0.5, 0.2, 0.6],
				[4, 0.5, 1.3],
				[8.5, -0.2, 1.8],
				[12.5, 0.6, 1.2],
				[16, 0.0, 1.6]
			],
			[
				[0.5, -0.9, -0.3],
				[4, -2.0, -0.6],
				[8.5, -2.6, -1.0],
				[12.5, -1.8, -0.2],
				[16, -2.6, -0.8]
			]
		];
		const flightCurves = tails.map(
			(tail) =>
				new THREE.CatmullRomCurve3(
					[...trunk, ...tail].map((p) => new THREE.Vector3(...p)),
					false,
					'catmullrom',
					0.5
				)
		);

		// ── Glowing trails (revealed behind each plane) ──────────────
		const makeTrailMaterial = (opacity: number) =>
			track(
				new THREE.ShaderMaterial({
					transparent: true,
					depthWrite: false,
					blending: THREE.AdditiveBlending,
					uniforms: {
						uHead: { value: 0 },
						uTaper: { value: 0.38 },
						uColor: { value: new THREE.Color('#fff6e0') },
						uOpacity: { value: opacity }
					},
					vertexShader: /* glsl */ `
						varying float vT;
						void main() {
							vT = uv.x;
							gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
						}`,
					fragmentShader: /* glsl */ `
						uniform float uHead;
						uniform float uTaper;
						uniform vec3 uColor;
						uniform float uOpacity;
						varying float vT;
						void main() {
							float ahead = 1.0 - smoothstep(uHead - 0.005, uHead, vT);
							float tail = smoothstep(uHead - uTaper, uHead - uTaper * 0.2, vT);
							float a = ahead * tail * uOpacity;
							if (a < 0.003) discard;
							gl_FragColor = vec4(uColor, a);
						}`
				})
			);

		const trails = flightCurves.map((curve) => {
			const core = makeTrailMaterial(0.95);
			const halo = makeTrailMaterial(0.16);
			const coreMesh = new THREE.Mesh(track(new THREE.TubeGeometry(curve, 300, 0.035, 8)), core);
			const haloMesh = new THREE.Mesh(track(new THREE.TubeGeometry(curve, 300, 0.13, 8)), halo);
			scene.add(coreMesh, haloMesh);
			return { core, halo };
		});

		// ── Paper planes (the doves) ─────────────────────────────────
		const planeGeo = track(makePaperPlaneGeometry(THREE));
		const planeMat = track(
			new THREE.MeshStandardMaterial({
				color: CREAM,
				roughness: 0.85,
				flatShading: true,
				side: THREE.DoubleSide,
				transparent: true
			})
		);
		const planes = flightCurves.map((curve, i) => {
			const mesh = new THREE.Mesh(planeGeo, planeMat);
			mesh.scale.setScalar(isMobile ? 0.8 : 1);
			scene.add(mesh);
			return { mesh, curve, stagger: (i - 1) * 0.026, phase: i * 2.4 };
		});

		// ── Drifting paper motes ─────────────────────────────────────
		const moteCount = isMobile ? 600 : 1400;
		const motePos = new Float32Array(moteCount * 3);
		for (let i = 0; i < moteCount; i++) {
			motePos[i * 3] = (Math.random() - 0.5) * 36;
			motePos[i * 3 + 1] = (Math.random() - 0.5) * 14;
			motePos[i * 3 + 2] = (Math.random() - 0.5) * 14;
		}
		const moteGeo = track(new THREE.BufferGeometry());
		moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
		const moteTex = track(makeMoteTexture(THREE));
		const moteMat = track(
			new THREE.PointsMaterial({
				color: 0xfff6e0,
				size: 0.07,
				map: moteTex,
				transparent: true,
				opacity: 0.45,
				sizeAttenuation: true,
				depthWrite: false,
				blending: THREE.AdditiveBlending
			})
		);
		const motes = new THREE.Points(moteGeo, moteMat);
		scene.add(motes);

		// ── Draft sentences floating beside each stream ──────────────
		const sprites = DRAFTS.map((text, i) => {
			const tex = track(makeTextTexture(THREE, text));
			tex.colorSpace = THREE.SRGBColorSpace;
			const mat = track(
				new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0, depthWrite: false })
			);
			const sprite = new THREE.Sprite(mat);
			sprite.scale.set(4.5, 0.9, 1);
			const anchor = flightCurves[i].getPoint(0.78);
			sprite.position.set(anchor.x, anchor.y + 0.75, anchor.z);
			scene.add(sprite);
			return mat;
		});

		// ── Camera path ──────────────────────────────────────────────
		const camCurve = new THREE.CatmullRomCurve3(
			[
				[-12.5, 3.2, 8.5],
				[-8.5, 1.8, 9.5],
				[-3, 1.2, 10.5],
				[3, 0.6, 12],
				[9, 0.2, 14.5]
			].map((p) => new THREE.Vector3(...p))
		);
		const lookTarget = new THREE.Vector3(-12, 2, 0);

		let dolly = 1; // narrow viewports watch from further back
		const fitCamera = () => {
			const w = host.clientWidth || 1;
			const h = host.clientHeight || 1;
			renderer.setSize(w, h);
			camera.aspect = w / h;
			dolly = camera.aspect < 0.8 ? 1.5 : camera.aspect < 1.1 ? 1.25 : 1;
			camera.updateProjectionMatrix();
		};
		const ro = new ResizeObserver(fitCamera);
		ro.observe(host);
		fitCamera();

		// ── Scroll plumbing ──────────────────────────────────────────
		let target = reduceMotion ? 0.62 : 0;
		let progress = target;
		let st: ScrollTrigger | undefined;
		if (!reduceMotion) {
			gsap.registerPlugin(ScrollTrigger);
			st = ScrollTrigger.create({
				trigger: wrapper,
				start: 'top top',
				end: 'bottom bottom',
				onUpdate: (self) => (target = self.progress)
			});
			ScrollTrigger.refresh();
		}

		// Map scroll progress to flight progress along the curves
		const flightT = (p: number) => 0.06 + p * 0.91;
		const tmpTan = new THREE.Vector3();
		const tmpUp = new THREE.Vector3(0, 1, 0);
		const tmpMat = new THREE.Matrix4();
		const centroid = new THREE.Vector3();

		const applyFrame = (t: number) => {
			const ft = flightT(progress);
			centroid.set(0, 0, 0);
			planes.forEach(({ mesh, curve, stagger, phase }) => {
				const pt = THREE.MathUtils.clamp(ft + stagger, 0.02, 0.985);
				curve.getPoint(pt, mesh.position);
				mesh.position.y += Math.sin(t * 1.4 + phase) * 0.06;
				curve.getTangent(pt, tmpTan);
				tmpMat.lookAt(mesh.position, tmpTan.add(mesh.position), tmpUp);
				mesh.quaternion.setFromRotationMatrix(tmpMat);
				mesh.rotateZ(Math.sin(t * 1.1 + phase) * 0.12);
				centroid.add(mesh.position);
			});
			centroid.divideScalar(planes.length);

			// Final chapter: on wide screens the camera pans so the flight owns the
			// left half and the copy the right; the scene dims only slightly. On
			// narrow screens the copy sits over the scene, so dim harder instead.
			const wide = camera.aspect > 1.1;
			const finale = window01(progress, 0.76, 0.9);
			const dim = 1 - (wide ? 0.3 : 0.72) * finale;
			planeMat.opacity = dim;
			trails.forEach(({ core, halo }) => {
				core.uniforms.uHead.value = ft;
				halo.uniforms.uHead.value = ft;
				core.uniforms.uOpacity.value = 0.95 * dim;
				halo.uniforms.uOpacity.value = 0.16 * dim;
			});

			camCurve.getPoint(progress, camera.position);
			camera.position.z *= dolly;
			lookTarget.lerp(centroid, reduceMotion ? 1 : 0.08);
			// Looking right of the planes frames them left, under the closing copy
			camera.lookAt(lookTarget.x + (wide ? finale * 3.4 : 0), lookTarget.y, lookTarget.z);

			// Draft sentences appear in chapter 3
			const spriteAlpha = window01(progress, 0.55, 0.8) * (1 - window01(progress, 0.95, 1.0));
			sprites.forEach((m) => (m.opacity = spriteAlpha * 0.92));

			motes.rotation.y = t * 0.01;
			motes.rotation.z = t * 0.004;

			renderer.render(scene, camera);
		};

		const updateChapters = () => {
			chapterEls.forEach((el, i) => {
				if (!el) return;
				const [a, b] = CHAPTERS[i];
				const alphaIn = i === 0 ? 1 : window01(progress, a, a + 0.05);
				const alpha = alphaIn * (1 - window01(progress, b - 0.04, b + 0.01));
				el.style.opacity = String(alpha);
				el.style.setProperty('--off', `${(1 - alpha) * 28}px`);
				el.style.pointerEvents = alpha > 0.5 && i === 3 ? 'auto' : 'none';
			});
		};

		let rafId = 0;
		const clock = new THREE.Clock();
		const tick = () => {
			rafId = requestAnimationFrame(tick);
			progress += (target - progress) * 0.075;
			applyFrame(clock.getElapsedTime());
			updateChapters();
		};

		const io = new IntersectionObserver(([entry]) => {
			if (reduceMotion) return;
			if (entry.isIntersecting && !rafId) tick();
			else if (!entry.isIntersecting && rafId) {
				cancelAnimationFrame(rafId);
				rafId = 0;
			}
		});
		io.observe(wrapper);

		if (reduceMotion) applyFrame(0);
		else tick();

		return () => {
			st?.kill();
			io.disconnect();
			ro.disconnect();
			if (rafId) cancelAnimationFrame(rafId);
			disposables.forEach((d) => d.dispose());
			renderer.dispose();
			renderer.domElement.remove();
		};
	}

	function window01(v: number, a: number, b: number) {
		return Math.min(1, Math.max(0, (v - a) / (b - a)));
	}

	type ThreeNS = typeof import('three');

	// A classic paper dart: nose at +x, two swept wings with dihedral, center keel
	function makePaperPlaneGeometry(THREE: ThreeNS) {
		const nose: [number, number, number] = [0.55, 0, 0];
		const tailTop: [number, number, number] = [-0.45, 0.06, 0];
		const wingL: [number, number, number] = [-0.5, 0.22, -0.42];
		const wingR: [number, number, number] = [-0.5, 0.22, 0.42];
		const keel: [number, number, number] = [-0.45, -0.18, 0];
		const tri = (a: number[], b: number[], c: number[]) => [...a, ...b, ...c];
		const verts = new Float32Array([
			...tri(nose, wingL, tailTop),
			...tri(nose, tailTop, wingR),
			...tri(nose, tailTop, keel)
		]);
		const geo = new THREE.BufferGeometry();
		geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
		geo.computeVertexNormals();
		// Geometry nose points +x; lookAt orients meshes with -z forward, so pre-rotate
		geo.rotateY(Math.PI / 2);
		return geo;
	}

	function makeMoteTexture(THREE: ThreeNS) {
		const c = document.createElement('canvas');
		c.width = c.height = 64;
		const ctx = c.getContext('2d')!;
		const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
		g.addColorStop(0, 'rgba(255, 246, 224, 1)');
		g.addColorStop(0.4, 'rgba(255, 246, 224, 0.4)');
		g.addColorStop(1, 'rgba(255, 246, 224, 0)');
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, 64, 64);
		return new THREE.CanvasTexture(c);
	}

	function makeTextTexture(THREE: ThreeNS, text: string) {
		const c = document.createElement('canvas');
		c.width = 1280;
		c.height = 256;
		const ctx = c.getContext('2d')!;
		ctx.fillStyle = 'rgba(255, 250, 235, 0.96)';
		const quoted = `“${text}”`;
		let size = 60;
		do {
			ctx.font = `italic ${size}px Newsreader, Georgia, serif`;
			size -= 2;
		} while (ctx.measureText(quoted).width > 1200 && size > 30);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.shadowColor = 'rgba(255, 240, 200, 0.5)';
		ctx.shadowBlur = 18;
		ctx.fillText(quoted, 640, 128);
		return new THREE.CanvasTexture(c);
	}
</script>

<!-- ==================== HERO (3D v2 — scroll flight) ==================== -->
<div bind:this={wrapperEl} class="hero-flight" class:static-mode={staticMode}>
	<div class="stage">
		<div bind:this={sceneEl} class="scene-host" aria-hidden="true"></div>

		{#if staticMode}
			<!-- Reduced motion / no WebGL: one static composition, full copy + CTA -->
			<div class="chapter chapter-static">
				<p class="eyebrow">The Non-Linear Writing App</p>
				<h1 class="headline">Prose for <span class="italic">Pros</span>.</h1>
				<p class="subhead">
					Write a sentence three different ways, and decide which to pick later. Branch any phrase
					without losing a single word.
				</p>
				<div class="cta-row">
					<a
						href={downloadUrl}
						class="btn-primary"
						onclick={() => posthog.capture('cta_clicked', { cta: 'download', location: 'hero' })}
					>
						Download Now
					</a>
					<a href="#features" class="btn-ghost">See how it works</a>
				</div>
				<p class="fine-print">
					By downloading, you agree to the <a href="/terms">Terms of Service</a>
				</p>
			</div>
		{:else}
			<div bind:this={chapterEls[0]} class="chapter chapter-1">
				<p class="eyebrow">The Non-Linear Writing App</p>
				<h1 class="headline">Prose for <span class="italic">Pros</span>.</h1>
				<p class="subhead">Every great sentence takes flight more than one way.</p>
				<p class="scroll-hint" aria-hidden="true">Scroll ↓</p>
			</div>

			<div bind:this={chapterEls[1]} class="chapter chapter-2">
				<h2 class="chapter-heading">Fork any sentence.</h2>
				<p class="chapter-sub">One draft becomes three. Nothing is overwritten.</p>
			</div>

			<div bind:this={chapterEls[2]} class="chapter chapter-3">
				<h2 class="chapter-heading">Keep every version.</h2>
				<p class="chapter-sub">Each branch keeps its own words, its own voice.</p>
			</div>

			<div bind:this={chapterEls[3]} class="chapter chapter-4">
				<h2 class="chapter-heading">Decide later.</h2>
				<p class="chapter-sub">
					Write a sentence three different ways, and pick the one that lands.
				</p>
				<div class="cta-row">
					<a
						href={downloadUrl}
						class="btn-primary"
						onclick={() => posthog.capture('cta_clicked', { cta: 'download', location: 'hero' })}
					>
						Download Now
					</a>
					<a href="#features" class="btn-ghost">See how it works</a>
				</div>
				<p class="fine-print">
					By downloading, you agree to the <a href="/terms">Terms of Service</a>
				</p>
			</div>
		{/if}
	</div>
	<span class="sr-only">
		Three paper planes fly through a dark sky of drifting paper motes, one glowing ink trail
		splitting into three — each carrying a different draft of the same sentence: {DRAFTS.map(
			(d) => `“${d}”`
		).join(', ')}
	</span>
</div>

<style>
	.hero-flight {
		position: relative;
		height: 380vh;
		background: #171310;
	}
	.hero-flight.static-mode {
		height: 100vh;
		min-height: 640px;
	}
	.stage {
		position: sticky;
		top: 0;
		height: 100vh;
		min-height: 640px;
		overflow: hidden;
	}
	.scene-host,
	.scene-host :global(canvas) {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
	}
	.static-mode .scene-host::after {
		/* darken behind the static copy for contrast */
		content: '';
		position: absolute;
		inset: 0;
		background: rgba(23, 19, 16, 0.45);
	}

	/* ── Chapters ── */
	.chapter {
		position: absolute;
		max-width: 560px;
		padding: 0 2rem;
		opacity: 0;
		pointer-events: none;
		will-change: opacity, transform;
	}
	/* Soft scrim so copy stays readable where it crosses a glowing trail */
	.chapter::before {
		content: '';
		position: absolute;
		inset: -2.5rem -3.5rem;
		background: radial-gradient(ellipse at center, rgba(23, 19, 16, 0.72), transparent 72%);
		z-index: -1;
	}
	.chapter-static {
		opacity: 1;
		pointer-events: auto;
		position: relative;
		margin: 0 auto;
		top: 50%;
		transform: translateY(-50%);
		text-align: center;
	}
	.chapter-1 {
		left: clamp(1rem, 8vw, 9rem);
		top: 50%;
		transform: translateY(-50%) translateY(var(--off, 28px));
	}
	.chapter-2 {
		right: clamp(1rem, 9vw, 11rem);
		top: 44%;
		text-align: right;
		transform: translateY(var(--off, 28px));
	}
	.chapter-3 {
		left: clamp(1rem, 9vw, 11rem);
		top: 58%;
		transform: translateY(var(--off, 28px));
	}
	.chapter-4 {
		right: clamp(1rem, 8vw, 9rem);
		top: 50%;
		transform: translateY(-50%) translateY(var(--off, 28px));
		text-align: right;
	}
	.chapter-4 .cta-row {
		justify-content: flex-end;
	}
	.chapter-4 .fine-print {
		text-align: right;
	}

	.eyebrow {
		margin: 0 0 1rem;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(247, 241, 227, 0.72);
	}
	.headline {
		margin: 0 0 1.1rem;
		font-family: 'Newsreader', Georgia, serif;
		font-size: clamp(2.8rem, 6vw, 4.6rem);
		line-height: 1.08;
		letter-spacing: -0.03em;
		font-weight: 400;
		color: #f7f1e3;
		text-wrap: balance;
	}
	.headline .italic {
		font-style: italic;
	}
	.chapter-heading {
		margin: 0 0 0.9rem;
		font-family: 'Newsreader', Georgia, serif;
		font-size: clamp(2.1rem, 4.5vw, 3.4rem);
		line-height: 1.1;
		letter-spacing: -0.025em;
		font-weight: 400;
		color: #f7f1e3;
		text-wrap: balance;
	}
	.subhead,
	.chapter-sub {
		margin: 0;
		font-size: 1.08rem;
		line-height: 1.7;
		color: rgba(247, 241, 227, 0.78);
	}
	.scroll-hint {
		margin: 2.4rem 0 0;
		font-size: 0.8rem;
		letter-spacing: 0.08em;
		color: rgba(247, 241, 227, 0.55);
		animation: hint-bob 2.4s ease-in-out infinite;
	}
	@keyframes hint-bob {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(6px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.scroll-hint {
			animation: none;
		}
	}

	.cta-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem;
		margin-top: 1.8rem;
	}
	.btn-ghost {
		display: inline-flex;
		align-items: center;
		padding: 0.75rem 1.5rem;
		border-radius: 10px;
		border: 1px solid rgba(247, 241, 227, 0.35);
		color: #f7f1e3;
		font-size: 0.95rem;
		font-weight: 500;
		text-decoration: none;
		transition:
			border-color 300ms ease,
			background 300ms ease;
	}
	.btn-ghost:hover {
		border-color: rgba(247, 241, 227, 0.7);
		background: rgba(247, 241, 227, 0.08);
	}
	.fine-print {
		margin: 1rem 0 0;
		font-size: 0.7rem;
		color: rgba(247, 241, 227, 0.55);
	}
	.fine-print a {
		color: rgba(247, 241, 227, 0.7);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@media (max-width: 767px) {
		.chapter-1,
		.chapter-2,
		.chapter-3,
		.chapter-4 {
			left: 50%;
			right: auto;
			width: 100%;
			max-width: 26rem;
			text-align: center;
			transform: translateX(-50%) translateY(var(--off, 28px));
		}
		.chapter-1,
		.chapter-4 {
			transform: translate(-50%, -50%) translateY(var(--off, 28px));
		}
		.chapter-1 {
			top: 42%;
		}
		.chapter-2 {
			top: 36%;
		}
		.chapter-3 {
			top: 54%;
		}
		.chapter-4 {
			top: 50%;
		}
		.chapter-4 .cta-row {
			justify-content: center;
		}
		.chapter-4 .fine-print {
			text-align: center;
		}
	}
</style>
