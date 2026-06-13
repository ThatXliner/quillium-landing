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
		return `https://github.com/${REPO}/releases/latest`;
	});

	// Per-platform binaries, mirroring the retired Download section: each
	// platform name opens an accordion with its primary + alternate builds
	const PLATFORM_ORDER = ['mac', 'windows', 'linux'] as const;
	type PlatformKey = (typeof PLATFORM_ORDER)[number];
	const DOWNLOADS: Record<
		PlatformKey,
		{ label: string; primary: { name: string; url: string }; alt: { name: string; url: string }[] }
	> = {
		mac: {
			label: 'macOS',
			primary: { name: '.dmg', url: findAsset('_aarch64.dmg') },
			alt: [{ name: '.app.tar.gz', url: findAsset('_aarch64.app.tar.gz') }]
		},
		windows: {
			label: 'Windows',
			primary: { name: '.exe', url: findAsset('_x64-setup.exe') },
			alt: [{ name: '.msi', url: findAsset('_x64_en-US.msi') }]
		},
		linux: {
			label: 'Linux',
			primary: { name: '.deb', url: findAsset('_amd64.deb') },
			alt: [
				{ name: '.rpm', url: findAsset('.x86_64.rpm') },
				{ name: '.AppImage', url: findAsset('_amd64.AppImage') }
			]
		}
	};
	let openPlatform = $state<PlatformKey | null>(null);

	// download_clicked is the experiment's primary funnel metric — every real
	// download link here must fire it, exactly like the old Download section
	function trackDownload(url: string) {
		posthog.capture('download_clicked', { url, platform: detected });
	}

	let wrapperEl = $state<HTMLDivElement>();
	let sceneEl = $state<HTMLDivElement>();
	let chapterEls: HTMLDivElement[] = $state([]);
	let staticMode = $state(false); // reduced motion or WebGL failure

	// `hero-3d-smoke` experiment (a sub-split of the 3d-variant-2 arm of the
	// hero-layout experiment): 'smoke' => curl-noise smoke trails behind the
	// planes, 'none' => clean smokeless flight. Read once before the scene is
	// built so the renderer can skip the whole particle system on 'none'.
	// `?smoke=on|off` forces it for QA, where flags don't load.
	function resolveSmoke(): boolean {
		const override = new URLSearchParams(location.search).get('smoke');
		if (override === 'on') return true;
		if (override === 'off') return false;
		const variant = posthog.getFeatureFlag('hero-3d-smoke');
		// Default to smoke until the flag resolves or for anyone not in the test
		return variant !== 'none';
	}

	// Theme: light by default, dark only under `prefers-color-scheme: dark`. The
	// whole rest of the app is light-only, so a dark hero would sit under a light
	// nav/footer — to keep them in step we flip the same `data-nav-dark` attribute
	// the dark hero originally used (nav, footer and this component's CSS all key
	// off it). It's set whenever the dark media query matches while the hero is
	// mounted, and cleared on unmount.
	let heroVisible = false;
	let darkApplied: boolean | undefined;
	function applyTheme(dark: boolean) {
		if (dark === darkApplied) return;
		darkApplied = dark;
		document.documentElement.toggleAttribute('data-nav-dark', dark);
	}
	function syncNav() {}

	// The three drafts of one sentence — the product story
	const DRAFTS = [
		'The rain found her before the door did.',
		'She stepped out into the waiting rain.',
		'Rain met her at the threshold.'
	];

	// The planes are always cream — folded paper reads on either sky. Everything
	// else swaps with the OS theme. `sky` matches each mode's app background
	// (#f5f4f1 light / #171310 dark) so the hero is seamless with the sections
	// around it. `mote` carries colour + how the dust blends: additive glow on the
	// dark sky, normal-blended ink dust on the light one (additive would vanish).
	//
	// Smoke is built per theme from each draft's identity hue (#3b82f6 / #a855f7 /
	// #22c55e): on dark it's a faint tint of cream → light wisps; on light it's
	// the hue darkened toward neutral grey → ink wisps that paint onto the paper.
	const CREAM = '#f7f1e3';
	const THEMES = {
		light: {
			sky: '#f5f4f1',
			mote: { color: 0x726f6a, opacity: 0.28, additive: false },
			smoke: { base: '#676360', toward: 'hue', mix: 0.3 }
		},
		dark: {
			sky: '#171310',
			mote: { color: 0xfff6e0, opacity: 0.45, additive: true },
			smoke: { base: '#f3ecdd', toward: 'pastel', mix: 0.16 }
		}
	} as const;
	type Theme = (typeof THEMES)[keyof typeof THEMES];
	// Draft identity hues and their pale tints (used by the dark smoke recipe)
	const DRAFT_HUES = ['#3b82f6', '#a855f7', '#22c55e'];
	const DRAFT_PASTELS = ['#cfe0ff', '#ecd6ff', '#d6ffe0'];

	// Scroll progress windows for the five chapters — the full product story
	// lives in the flight; this variant has no separate feature or download
	// sections. The journey ENDS on chapter 5: it carries the CTA and the
	// platform picker, never fades out (end > 1), and the planes keep gliding.
	const CHAPTERS: [number, number][] = [
		[0.0, 0.15],
		[0.2, 0.38],
		[0.45, 0.56],
		[0.61, 0.73],
		[0.8, 1.2]
	];
	// Chapters with interactive fragments (and the CTA) accept pointer events
	const INTERACTIVE = new Set([1, 3, 4]);

	// Interactive fragment state: chapter 2's fork card and chapter 4's
	// nested-revision card (outer take + the nest that lives inside Take 2)
	let activeDraft = $state(0);
	const NESTED = ['waiting rain', "storm's first breath"];
	let nestedOuter = $state(1); // Take 2 active by default so the nest is visible
	let activeNested = $state(0);

	const CHIP_COLORS = ['#3b82f6', '#a855f7', '#22c55e'];
	let chipEls: HTMLDivElement[] = $state([]);

	onMount(() => {
		const ua = navigator.userAgent.toLowerCase();
		if (ua.includes('mac')) detected = 'mac';
		else if (ua.includes('win')) detected = 'windows';
		else if (ua.includes('linux')) detected = 'linux';

		const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduceMotion) staticMode = true;

		// Theme follows the OS. Apply the CSS flip right away (before the scene
		// builds) so the chapters/cards/nav/footer never flash the wrong palette,
		// and keep the matchMedia around to react if the user toggles theme live.
		const darkMq = matchMedia('(prefers-color-scheme: dark)');
		applyTheme(darkMq.matches);

		// The observer is retained (cheap, harmless) in case we want hero-presence
		// signals later; syncNav is a no-op now that theme is OS-driven.
		const navIo = new IntersectionObserver(
			([entry]) => {
				heroVisible = entry.isIntersecting;
				syncNav();
			},
			{ rootMargin: '0px 0px -99% 0px' }
		);
		if (wrapperEl) navIo.observe(wrapperEl);

		let destroyed = false;
		let cleanupScene: (() => void) | undefined;
		// Set once the scene is built; lets a live theme flip recolour the running
		// scene (sky, fog, smoke, dust) without tearing the whole thing down.
		let recolorScene: ((theme: Theme) => void) | undefined;
		const onThemeChange = (e: MediaQueryListEvent) => {
			applyTheme(e.matches);
			recolorScene?.(e.matches ? THEMES.dark : THEMES.light);
		};
		darkMq.addEventListener('change', onThemeChange);

		const smoke = resolveSmoke();
		// Surface which trail treatment this view got, so the experiment can read
		// it off pageviews/events without re-deriving the flag downstream.
		posthog.capture('hero_3d_smoke_variant', { smoke: smoke ? 'smoke' : 'none' });

		initScene(reduceMotion, smoke, darkMq.matches ? THEMES.dark : THEMES.light)
			.then(({ cleanup, recolor }) => {
				if (destroyed) cleanup();
				else {
					cleanupScene = cleanup;
					recolorScene = recolor;
				}
			})
			.catch(() => {
				staticMode = true;
			});

		return () => {
			destroyed = true;
			navIo.disconnect();
			darkMq.removeEventListener('change', onThemeChange);
			applyTheme(false);
			cleanupScene?.();
		};
	});

	async function initScene(
		reduceMotion: boolean,
		smokeOn: boolean,
		theme: Theme
	): Promise<{ cleanup: () => void; recolor: (t: Theme) => void }> {
		const THREE = await import('three');
		const host = sceneEl;
		const wrapper = wrapperEl;
		if (!host || !wrapper) throw new Error('scene host missing');

		const isMobile = innerWidth < 768;

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
		host.appendChild(renderer.domElement);

		const scene = new THREE.Scene();
		scene.background = new THREE.Color(theme.sky);
		// Fog matches the sky so distant planes melt into it, just hazier.
		scene.fog = new THREE.Fog(theme.sky, 16, 38);
		const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);

		// Warm daylight — the lighting rig is the same in both themes; only the
		// colours of the sky, smoke and dust swap. The cream planes pick up the
		// key the same way whether they fly on a light or dark sky.
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

		const planeCount = flightCurves.length;

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

		// ── Wispy smoke trails — scroll-revealed ribbons behind each plane ──
		// A soft tube swept along each flight curve. It is REVEALED up to the
		// scroll-driven flight head (uHead): scroll down draws more of the trail,
		// scroll back up and it's still there — scrubbing a video of smoke being
		// laid down. It trails the exact path the plane flew.
		//
		// The organic look comes from DOMAIN-WARPED fbm: the noise coordinates are
		// themselves displaced by noise, which turns regular noise into flowing,
		// marbled, vapor-like shapes that carve soft wisps out of the ribbon.
		const smokeTrailVert = /* glsl */ `
			varying vec2 vUv;
			void main() {
				vUv = uv;                 // x = along the flight path, y = around the tube
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}`;
		const smokeTrailFrag = /* glsl */ `
			precision highp float;
			varying vec2 vUv;
			uniform float uHead;     // revealed extent along the path (scroll position)
			uniform float uTime;     // only drifts the warp so the smoke breathes
			uniform float uDim;      // finale dim
			uniform float uOpacity;  // layer base opacity
			uniform vec3 uColor;
			uniform float uScale;    // wisp frequency along the ribbon

			// Cheap sin-free hash (integer bit-mix) — far cheaper than the
				// classic fract(sin(...)) and good enough for smoke.
				vec3 hash3(vec3 p) {
					p = fract(p * vec3(0.1031, 0.1030, 0.0973));
					p += dot(p, p.yxz + 33.33);
					return fract((p.xxy + p.yxx) * p.zyx) * 2.0 - 1.0;
				}
				float vnoise(vec3 p) {
					vec3 i = floor(p), f = fract(p);
					vec3 u = f * f * (3.0 - 2.0 * f);
					return mix(
						mix(mix(dot(hash3(i + vec3(0,0,0)), f - vec3(0,0,0)),
						        dot(hash3(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
						    mix(dot(hash3(i + vec3(0,1,0)), f - vec3(0,1,0)),
						        dot(hash3(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
						mix(mix(dot(hash3(i + vec3(0,0,1)), f - vec3(0,0,1)),
						        dot(hash3(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
						    mix(dot(hash3(i + vec3(0,1,1)), f - vec3(0,1,1)),
						        dot(hash3(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y),
						u.z);
				}
				// 3 octaves is plenty once domain warping adds apparent detail.
				float fbm(vec3 p) {
					float a = 0.5, s = 0.0;
					for (int i = 0; i < 3; i++) { s += a * vnoise(p); p *= 2.03; a *= 0.5; }
					return s;
				}

				void main() {
					// reveal: only the path behind the flight head is drawn, and it STAYS
					// (no time term here, so scrolling scrubs the trail in/out)
					float revealed = 1.0 - smoothstep(uHead - 0.015, uHead + 0.02, vUv.x);
					if (revealed <= 0.0) discard;
					float birth = smoothstep(0.0, 0.05, vUv.x); // feather the very start

					// AGE-DRIVEN SPREAD: how far this point sits behind the flight head,
					// 0 right at the plane → 1 at the oldest, most-trailed smoke. The tube
					// geometry is a fixed-radius envelope; we shrink the *effective*
					// cross-section near the head so the trail emerges thin from the
					// airplane and billows out to the full tube width as it ages.
					float age = clamp((uHead - vUv.x) / max(uHead, 0.001), 0.0, 1.0);
					// ease so it pinches tightly at the nozzle then opens up smoothly
					float spread = mix(0.16, 1.0, age * age * (3.0 - 2.0 * age));

					// soft cross-section — fade hard toward the tube surface, no rim.
					// Normalize the radial distance by spread: a small spread means only
					// the very centre of the tube is opaque (a thin jet), a full spread
					// fills the whole cross-section (billowing smoke).
					float radial = 1.0 - clamp(abs(vUv.y - 0.5) * 2.0 / spread, 0.0, 1.0);
					radial = pow(radial, 1.3);

					// Single-pass domain warp: warp the lookup by one noise vector, then
					// sample fbm there. 3 fbm calls total (was 14) but keeps the flowing,
					// marbled, torn-wisp look. uTime only drifts it (breathing).
					vec3 sp = vec3(vUv.x * uScale, vUv.y * 2.2, uTime * 0.08);
					vec3 q = vec3(fbm(sp), fbm(sp + vec3(3.1, 1.7, 8.2)), fbm(sp + vec3(6.3, 4.4, 2.5)));
					float d = fbm(sp + 3.2 * q);

					// remap into soft, torn wisps with holes (negatives vanish); reuse q.x
					// for a cheap finer-detail tear (no extra noise call)
					float wisp = smoothstep(-0.15, 0.55, d);
					wisp *= 0.6 + 0.4 * smoothstep(-0.3, 0.5, q.x);

					float a = revealed * birth * radial * wisp * uOpacity * uDim;
					if (a < 0.003) discard;
					gl_FragColor = vec4(uColor, a);
				}`;

		// Per-theme trail colour for draft i. Dark: a faint draft-tinted cream that
		// glows as light vapour. Light: the draft's hue darkened toward neutral
		// grey, so it reads as a colour-true ink wisp painted onto the paper.
		const smokeColor = (i: number, t: Theme) =>
			t.smoke.toward === 'pastel'
				? new THREE.Color(t.smoke.base).lerp(new THREE.Color(DRAFT_PASTELS[i]), t.smoke.mix)
				: new THREE.Color(DRAFT_HUES[i]).lerp(new THREE.Color(t.smoke.base), t.smoke.mix);

		const tubeSegments = isMobile ? 240 : 400;
		const makeSmokeMaterial = (color: InstanceType<ThreeNS['Color']>, opacity: number, scale: number) =>
			track(
				new THREE.ShaderMaterial({
					transparent: true,
					depthWrite: false,
					blending: THREE.NormalBlending,
					side: THREE.DoubleSide,
					vertexShader: smokeTrailVert,
					fragmentShader: smokeTrailFrag,
					uniforms: {
						uHead: { value: 0 },
						uTime: { value: 0 },
						uDim: { value: 1 },
						uOpacity: { value: opacity },
						uColor: { value: color },
						uScale: { value: scale }
					}
				})
			);

		// Two coaxial tubes per plane: a tighter brighter core + a broad faint
		// haze, so the smoke has depth and a soft outer falloff. Both are fixed-
		// radius *envelopes*; the shader tapers the filled cross-section by age so
		// the trail starts thin at the plane and spreads out behind it.
		const smokeTrails: { mat: InstanceType<ThreeNS['ShaderMaterial']>; draft: number }[] = [];
		if (smokeOn) {
			flightCurves.forEach((curve, i) => {
				const core = makeSmokeMaterial(smokeColor(i, theme), 0.5, 5.5);
				const haze = makeSmokeMaterial(smokeColor(i, theme), 0.16, 3.5);
				const coreMesh = new THREE.Mesh(
					track(new THREE.TubeGeometry(curve, tubeSegments, 0.28, 14, false)),
					core
				);
				const hazeMesh = new THREE.Mesh(
					track(new THREE.TubeGeometry(curve, tubeSegments, 0.85, 14, false)),
					haze
				);
				scene.add(coreMesh, hazeMesh);
				smokeTrails.push({ mat: core, draft: i }, { mat: haze, draft: i });
			});
		}

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
		// Drifting dust. Dark: warm-white motes that glow against the night sky
		// (AdditiveBlending). Light: dark ink specks painted onto the paper
		// (NormalBlending) — additive would simply vanish on a bright background.
		const moteMat = track(
			new THREE.PointsMaterial({
				color: theme.mote.color,
				size: 0.07,
				map: moteTex,
				transparent: true,
				opacity: theme.mote.opacity,
				sizeAttenuation: true,
				depthWrite: false,
				blending: theme.mote.additive ? THREE.AdditiveBlending : THREE.NormalBlending
			})
		);
		const motes = new THREE.Points(moteGeo, moteMat);
		scene.add(motes);

		// Scratch vector for projecting the DOM draft chips onto the planes
		const chipV = new THREE.Vector3();

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
			const finale = window01(progress, 0.72, 0.84);
			const dim = 1 - (wide ? 0.3 : 0.72) * finale;

			planeMat.opacity = dim;

			// Smoke trails: uHead = the flight head (scroll position), so the ribbon
			// is revealed/scrubbed in and out with scroll and trails the flown path.
			// uTime only drifts the warp so the smoke breathes; it never dissipates.
			smokeTrails.forEach(({ mat }) => {
				mat.uniforms.uHead.value = ft;
				mat.uniforms.uTime.value = t;
				mat.uniforms.uDim.value = dim;
			});

			camCurve.getPoint(progress, camera.position);
			camera.position.z *= dolly;
			lookTarget.lerp(centroid, reduceMotion ? 1 : 0.08);
			// Looking right of the planes frames them left, under the closing copy
			camera.lookAt(lookTarget.x + (wide ? finale * 3.4 : 0), lookTarget.y, lookTarget.z);

			// Draft chips: DOM fragments pinned above each plane — projected every
			// frame, so they ride the flight (and bob) with their plane
			const [c3a, c3b] = CHAPTERS[2];
			const chipAlpha =
				window01(progress, c3a, c3a + 0.05) * (1 - window01(progress, c3b - 0.04, c3b + 0.01));
			chipEls.forEach((el, i) => {
				if (!el) return;
				chipV.copy(planes[i].mesh.position);
				chipV.y += 0.55;
				chipV.project(camera);
				el.style.left = `${(chipV.x * 0.5 + 0.5) * (host.clientWidth || 1)}px`;
				el.style.top = `${(-chipV.y * 0.5 + 0.5) * (host.clientHeight || 1)}px`;
				el.style.opacity = String(chipAlpha);
			});

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
				el.style.pointerEvents = alpha > 0.5 && INTERACTIVE.has(i) ? 'auto' : 'none';
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

		if (reduceMotion) {
			applyFrame(0);
			updateChapters();
		} else {
			tick();
		}

		// Live theme flip: recolour the sky/fog/smoke/dust in place. Geometry,
		// camera and motion are theme-agnostic, so there's nothing to rebuild.
		const recolor = (t: Theme) => {
			(scene.background as InstanceType<ThreeNS['Color']>).set(t.sky);
			scene.fog!.color.set(t.sky);
			smokeTrails.forEach(({ mat, draft }) =>
				mat.uniforms.uColor.value.copy(smokeColor(draft, t))
			);
			moteMat.color.set(t.mote.color);
			moteMat.opacity = t.mote.opacity;
			moteMat.blending = t.mote.additive ? THREE.AdditiveBlending : THREE.NormalBlending;
			moteMat.needsUpdate = true; // blending mode change needs a recompile
			if (reduceMotion) renderer.render(scene, camera); // static view won't redraw itself
		};

		const cleanup = () => {
			st?.kill();
			io.disconnect();
			ro.disconnect();
			if (rafId) cancelAnimationFrame(rafId);
			disposables.forEach((d) => d.dispose());
			renderer.dispose();
			renderer.domElement.remove();
		};

		return { cleanup, recolor };
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
		// White-alpha falloff; the PointsMaterial.color tints it (dark ink dust)
		const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
		g.addColorStop(0, 'rgba(255, 255, 255, 1)');
		g.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
		g.addColorStop(1, 'rgba(255, 255, 255, 0)');
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, 64, 64);
		return new THREE.CanvasTexture(c);
	}
</script>

{#snippet platformPicker(centered: boolean)}
	<p class="platforms-row" class:platforms-row--centered={centered}>
		{#each PLATFORM_ORDER as key (key)}
			<button
				class="platform-toggle"
				class:platform--detected={detected === key}
				class:platform--open={openPlatform === key}
				aria-expanded={openPlatform === key}
				onclick={() => (openPlatform = openPlatform === key ? null : key)}
			>
				{DOWNLOADS[key].label}<span aria-hidden="true">{openPlatform === key ? ' ▴' : ' ▾'}</span>
			</button>
		{/each}
	</p>
	{#if openPlatform}
		{@const p = DOWNLOADS[openPlatform]}
		<div class="platform-binaries" class:platform-binaries--centered={centered}>
			<a
				href={p.primary.url}
				class="binary binary--primary"
				onclick={() => trackDownload(p.primary.url)}>{p.primary.name}</a
			>
			{#each p.alt as alt (alt.name)}
				<a href={alt.url} class="binary" onclick={() => trackDownload(alt.url)}>{alt.name}</a>
			{/each}
			{#if openPlatform === 'windows'}
				<p class="binary-note">Not code-signed. Windows may show a warning.</p>
			{/if}
		</div>
	{/if}
{/snippet}

<!-- ==================== HERO (3D v2 — the flight IS the page) ==================== -->
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
						onclick={() => {
							posthog.capture('cta_clicked', { cta: 'download', location: 'hero' });
							trackDownload(downloadUrl);
						}}
					>
						Download Now
					</a>
				</div>
				{@render platformPicker(true)}
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
				<div class="demo-duo" role="group" aria-label="Revision demo — pick a version">
					<div class="demo-doc">
						<p>The evening had been threatening for hours.</p>
						<p><mark class="demo-highlight">{DRAFTS[activeDraft]}</mark></p>
						<p>She did not reach for the umbrella.</p>
					</div>
					<div class="demo-card demo-card--annotation">
						<p class="demo-label">Revision</p>
						<div class="demo-pills">
							{#each ['Original', 'Take 2', 'Take 3'] as label, i (label)}
								<button
									class="demo-pill"
									class:demo-pill--active={activeDraft === i}
									onclick={() => (activeDraft = i)}
								>
									{label}
								</button>
							{/each}
						</div>
						<p class="demo-new" aria-hidden="true">+ New version</p>
					</div>
				</div>
				<div class="chapter-copy">
					<h2 class="chapter-heading">Fork any sentence.</h2>
					<p class="chapter-sub">Because you have more than just one idea in your head</p>
				</div>
			</div>

			<div bind:this={chapterEls[2]} class="chapter chapter-3">
				<h2 class="chapter-heading">Keep every version.</h2>
				<p class="chapter-sub">
					Write a sentence three different ways, and pick the one that lands.
				</p>
			</div>

			<div bind:this={chapterEls[3]} class="chapter chapter-4">
				<div class="chapter-copy">
					<h2 class="chapter-heading">Branch inside a branch.</h2>
					<p class="chapter-sub">Let the rabbit hole go deep.</p>
				</div>
				<div
					class="demo-duo"
					role="group"
					aria-label="Nested revision demo — pick a take, then a phrase"
				>
					<div class="demo-doc">
						<p>The evening had been threatening for hours.</p>
						<p>
							{#if nestedOuter === 1}
								<mark class="demo-highlight"
									>She stepped out into the <mark class="demo-nest">{NESTED[activeNested]}</mark
									>.</mark
								>
							{:else}
								<mark class="demo-highlight">{DRAFTS[nestedOuter]}</mark>
							{/if}
						</p>
						<p>She did not reach for the umbrella.</p>
					</div>
					<div class="demo-card demo-card--annotation">
						<p class="demo-label">Revision</p>
						<div class="demo-pills">
							{#each ['Original', 'Take 2', 'Take 3'] as label, i (label)}
								<button
									class="demo-pill"
									class:demo-pill--active={nestedOuter === i}
									onclick={() => (nestedOuter = i)}
								>
									{label}
								</button>
							{/each}
						</div>
						{#if nestedOuter === 1}
							<div class="demo-card demo-card--nested">
								<p class="demo-label">Nested revision</p>
								<div class="demo-pills">
									{#each NESTED as phrase, i (phrase)}
										<button
											class="demo-pill"
											class:demo-pill--active={activeNested === i}
											onclick={() => (activeNested = i)}
										>
											v{i + 1}
										</button>
									{/each}
								</div>
							</div>
						{:else}
							<p class="demo-new" aria-hidden="true">+ New version</p>
						{/if}
					</div>
				</div>
			</div>

			<div bind:this={chapterEls[4]} class="chapter chapter-5">
				<h2 class="chapter-heading mb-10">Start writing sideways.</h2>
				<!-- <p class="chapter-sub">
					Write a sentence three different ways, and pick the one that lands.
				</p> -->
				<div class="cta-row">
					<a
						href={downloadUrl}
						class="btn-primary"
						onclick={() => {
							posthog.capture('cta_clicked', { cta: 'download', location: 'hero' });
							trackDownload(downloadUrl);
						}}
					>
						Download Now
					</a>
				</div>
				{@render platformPicker(true)}
				<p class="fine-print">
					By downloading, you agree to the <a href="/terms">Terms of Service</a>
				</p>
				<p class="trust-row">
					<a href="/blog/quillium-is-not-an-ai-app">Write every word (No AI bs).</a>
					<a href="/blog/quillium-privacy">Fully private.</a>
					<a href="/blog/how-quillium-keeps-your-writing-safe">Safe and secure.</a>
				</p>
			</div>

			{#each DRAFTS as draft, i (draft)}
				<div bind:this={chipEls[i]} class="draft-chip" aria-hidden="true">
					<span class="chip-pill" style="background: {CHIP_COLORS[i]}">Draft {'ABC'[i]}</span>
					<span class="chip-text">“{draft}”</span>
				</div>
			{/each}
		{/if}
	</div>
	<span class="sr-only">
		Three paper planes fly across a bright paper sky of drifting ink dust, one ink trail
		splitting into three — each carrying a different draft of the same sentence: {DRAFTS.map(
			(d) => `“${d}”`
		).join(', ')}. Pieces of the Quillium interface accompany the flight: a revision card with
		version pills that swap between the three takes, and a nested revision card that swaps a phrase
		inside one of them.
	</span>
</div>

<style>
	.hero-flight {
		position: relative;
		height: 520vh;
		background: #f5f4f1;
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
		/* lighten behind the static copy so dark text stays legible */
		content: '';
		position: absolute;
		inset: 0;
		background: rgba(245, 244, 241, 0.55);
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
	/* Soft scrim so copy stays readable where it crosses an ink trail */
	.chapter::before {
		content: '';
		position: absolute;
		inset: -2.5rem -3.5rem;
		background: radial-gradient(ellipse at center, rgba(245, 244, 241, 0.82), transparent 72%);
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
	/* Fork chapter: interactive card left, copy right; the fork animates in
	   the gap between them */
	.chapter-2 {
		left: 50%;
		top: 46%;
		transform: translate(-50%, -50%) translateY(var(--off, 28px));
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: clamp(1.5rem, 6vw, 7rem);
		width: min(92vw, 1180px);
		max-width: none;
	}
	.chapter-2 .chapter-copy {
		flex: 0 1 30rem;
		min-width: min(100%, 24rem);
		text-align: center;
	}
	.chapter-2 .chapter-sub {
		max-width: 24rem;
		margin-inline: auto;
		text-wrap: balance;
	}
	.chapter-3 {
		left: clamp(1rem, 9vw, 11rem);
		top: 58%;
		transform: translateY(var(--off, 28px));
	}
	/* Nested chapter: mirror of the fork chapter */
	.chapter-4 {
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%) translateY(var(--off, 28px));
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: clamp(2rem, 10vw, 9rem);
		width: min(92vw, 1060px);
		max-width: none;
	}
	.chapter-5 {
		right: clamp(1rem, 8vw, 9rem);
		top: 50%;
		transform: translateY(-50%) translateY(var(--off, 28px));
		text-align: center;
	}
	.chapter-5 .cta-row {
		justify-content: center;
	}
	.chapter-5 .fine-print {
		text-align: center;
	}

	.eyebrow {
		margin: 0 0 1rem;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(0, 0, 0, 0.5);
	}
	.headline {
		margin: 0 0 1.1rem;
		font-family: 'Newsreader', Georgia, serif;
		font-size: clamp(2.8rem, 6vw, 4.6rem);
		line-height: 1.08;
		letter-spacing: -0.03em;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.9);
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
		color: rgba(0, 0, 0, 0.9);
		text-wrap: balance;
	}
	.subhead,
	.chapter-sub {
		margin: 0;
		font-size: 1.08rem;
		line-height: 1.7;
		color: rgba(0, 0, 0, 0.66);
	}
	.scroll-hint {
		margin: 2.4rem 0 0;
		font-size: 0.8rem;
		letter-spacing: 0.08em;
		color: rgba(0, 0, 0, 0.45);
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
	.fine-print {
		margin: 1rem 0 0;
		font-size: 0.7rem;
		color: rgba(0, 0, 0, 0.45);
	}
	.fine-print a {
		color: rgba(0, 0, 0, 0.6);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	/* ── UI fragments (re-rendered app pieces, Linear-style) ── */
	/* Mini document + annotation card, mimicking the app's annotation layout */
	.demo-duo {
		display: flex;
		align-items: flex-start;
		flex-shrink: 0;
	}
	/* Sit below the flight line so the planes pass above, not behind */
	.chapter-2 .demo-duo {
		margin-top: clamp(4rem, 18vh, 11rem);
	}
	.chapter-4 .demo-duo {
		margin-top: clamp(1rem, 6vh, 3.5rem);
	}
	.demo-doc {
		width: min(56vw, 300px);
		padding: 1.05rem 1.15rem;
		border-radius: 10px;
		background: #fffefb;
		border: 1px solid rgba(0, 0, 0, 0.05);
		box-shadow:
			0 18px 44px rgba(44, 38, 34, 0.14),
			0 3px 10px rgba(44, 38, 34, 0.08);
		font-family: Georgia, serif;
		font-size: 0.88rem;
		line-height: 1.65;
		color: rgba(0, 0, 0, 0.82);
		text-align: left;
	}
	.demo-doc p {
		margin: 0 0 0.55em;
	}
	.demo-doc p:last-child {
		margin-bottom: 0;
	}
	.demo-highlight {
		background: rgba(168, 85, 247, 0.16);
		border-radius: 3px;
		padding: 0 0.12em;
		color: inherit;
	}
	/* The nested phrase inside an already-highlighted sentence: one tier deeper */
	.demo-doc .demo-nest {
		background: rgba(168, 85, 247, 0.34);
		border-radius: 3px;
		padding: 0 0.1em;
		color: inherit;
	}
	.demo-card.demo-card--annotation {
		width: min(40vw, 215px);
		margin-left: -1.4rem;
		margin-top: 2.6rem;
	}
	.demo-new {
		margin: 0.65rem 0 0;
		font-size: 0.68rem;
		font-weight: 500;
		font-family: 'Inter', sans-serif;
		color: rgba(168, 85, 247, 0.65);
	}
	.demo-card {
		flex-shrink: 0;
		width: min(86vw, 330px);
		padding: 1.1rem 1.2rem 1.2rem;
		border-radius: 14px;
		background: #fffefb;
		border: 1px solid rgba(0, 0, 0, 0.05);
		box-shadow:
			0 18px 44px rgba(44, 38, 34, 0.14),
			0 3px 10px rgba(44, 38, 34, 0.08);
		text-align: left;
	}
	.demo-card--nested {
		width: auto;
		margin-top: 0.9rem;
		padding: 0.7rem 0.85rem 0.8rem;
		border: 1px solid rgba(168, 85, 247, 0.25);
		background: rgba(168, 85, 247, 0.05);
		box-shadow: none;
	}
	.demo-label {
		margin: 0 0 0.6rem;
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #a855f7;
	}
	.demo-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-bottom: 0.75rem;
	}
	.demo-card--nested .demo-pills {
		margin-bottom: 0;
	}
	.demo-pill {
		padding: 0.25rem 0.7rem;
		border: none;
		border-radius: 9999px;
		font-size: 0.72rem;
		font-weight: 500;
		font-family: 'Inter', sans-serif;
		background: rgba(0, 0, 0, 0.06);
		color: rgba(0, 0, 0, 0.6);
		cursor: pointer;
		transition:
			background 200ms ease,
			color 200ms ease;
	}
	.demo-pill:hover {
		background: rgba(0, 0, 0, 0.1);
	}
	.demo-pill--active {
		background: #a855f7;
		color: #fff;
	}
	.demo-pill--active:hover {
		background: #9333ea;
	}
	.demo-nest {
		background: rgba(168, 85, 247, 0.14);
		border-radius: 4px;
		padding: 0 0.15em;
	}

	/* ── Draft chips pinned to the 3D streams ── */
	.draft-chip {
		position: absolute;
		left: -9999px;
		top: -9999px;
		transform: translate(-50%, -50%);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		max-width: 300px;
		padding: 0.45rem 0.7rem;
		border-radius: 10px;
		background: #fffefb;
		border: 1px solid rgba(0, 0, 0, 0.05);
		box-shadow: 0 10px 26px rgba(44, 38, 34, 0.16);
		opacity: 0;
		pointer-events: none;
		white-space: nowrap;
	}
	.chip-pill {
		flex-shrink: 0;
		padding: 0.12rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.62rem;
		font-weight: 600;
		color: #fff;
	}
	.chip-text {
		font-family: Georgia, serif;
		font-style: italic;
		font-size: 0.82rem;
		color: rgba(0, 0, 0, 0.8);
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* Compact platform picker, folded into the finale: names toggle an
	   accordion listing that platform's binaries */
	.platforms-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.4rem 1.4rem;
		margin: 0.9rem 0 0;
		font-size: 0.82rem;
	}
	.platforms-row--centered {
		justify-content: center;
	}
	.platform-toggle {
		padding: 0;
		border: none;
		background: none;
		font: inherit;
		font-family: 'Inter', sans-serif;
		color: rgba(0, 0, 0, 0.5);
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
		transition: color 300ms ease;
	}
	.platform-toggle:hover {
		color: rgba(0, 0, 0, 0.85);
	}
	.platform-toggle.platform--detected {
		color: rgba(0, 0, 0, 0.82);
		font-weight: 600;
	}
	.platform-toggle.platform--open {
		color: rgba(0, 0, 0, 0.9);
	}
	.platform-binaries {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: baseline;
		gap: 0.45rem 1.3rem;
		width: fit-content;
		margin: 0.8rem auto 0;
		padding: 0.65rem 0.95rem;
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.5);
		font-size: 0.8rem;
	}
	.platform-binaries--centered {
		justify-content: center;
		margin-inline: auto;
	}
	.binary {
		color: rgba(0, 0, 0, 0.6);
		text-decoration: underline;
		text-underline-offset: 3px;
		transition: color 300ms ease;
	}
	.binary:hover {
		color: rgba(0, 0, 0, 0.9);
	}
	.binary--primary {
		color: rgba(0, 0, 0, 0.9);
		font-weight: 600;
	}
	.binary-note {
		flex-basis: 100%;
		margin: 0;
		font-size: 0.65rem;
		color: rgba(180, 83, 9, 0.9);
		text-align: right;
	}
	.platform-binaries--centered .binary-note {
		text-align: center;
	}

	.trust-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem 1.2rem;
		margin: 1.6rem 0 0;
		padding-top: 1rem;
		border-top: 2px solid;
		border-image: linear-gradient(90deg, transparent, #3b82f6, #a855f7, #22c55e, #fcbc05, transparent) 1;
		font-size: 0.82rem;
	}
	.trust-row a {
		color: rgba(0, 0, 0, 0.55);
		text-decoration: underline;
		text-underline-offset: 3px;
		transition: color 300ms ease;
	}
	.trust-row a:hover {
		color: rgba(0, 0, 0, 0.9);
	}

	/* ── Dark mode (OS preference) ──
	   Restores the original night-flight palette: dark sky, cream copy, dark
	   scrims, heavier card shadows. The Three.js scene swaps its own colours in
	   JS; this only covers the DOM layer over the canvas. Nav and footer flip via
	   the shared [data-nav-dark] attribute (set by this component in dark mode). */
	@media (prefers-color-scheme: dark) {
		.hero-flight {
			background: #171310;
		}
		.static-mode .scene-host::after {
			background: rgba(23, 19, 16, 0.45);
		}
		.chapter::before {
			background: radial-gradient(ellipse at center, rgba(23, 19, 16, 0.72), transparent 72%);
		}
		.eyebrow {
			color: rgba(247, 241, 227, 0.72);
		}
		.headline,
		.chapter-heading {
			color: #f7f1e3;
		}
		.subhead,
		.chapter-sub {
			color: rgba(247, 241, 227, 0.78);
		}
		.scroll-hint {
			color: rgba(247, 241, 227, 0.55);
		}
		.fine-print {
			color: rgba(247, 241, 227, 0.55);
		}
		.fine-print a {
			color: rgba(247, 241, 227, 0.7);
		}
		/* Cards stay light paper, but go back to the deeper drop-shadow that read
		   well against the night sky */
		.demo-doc,
		.demo-card {
			background: #fffdf8;
			border-color: transparent;
			box-shadow:
				0 24px 64px rgba(0, 0, 0, 0.5),
				0 4px 12px rgba(0, 0, 0, 0.3);
		}
		.draft-chip {
			background: #fffdf8;
			border-color: transparent;
			box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
		}
		.platform-toggle {
			color: rgba(247, 241, 227, 0.55);
		}
		.platform-toggle:hover {
			color: rgba(247, 241, 227, 0.95);
		}
		.platform-toggle.platform--detected {
			color: rgba(247, 241, 227, 0.92);
		}
		.platform-toggle.platform--open {
			color: rgba(247, 241, 227, 0.98);
		}
		.platform-binaries {
			border-color: rgba(247, 241, 227, 0.16);
			background: rgba(247, 241, 227, 0.05);
		}
		.binary {
			color: rgba(247, 241, 227, 0.65);
		}
		.binary:hover {
			color: rgba(247, 241, 227, 0.95);
		}
		.binary--primary {
			color: rgba(247, 241, 227, 0.95);
		}
		.binary-note {
			color: rgba(245, 158, 11, 0.75);
		}
		.trust-row a {
			color: rgba(247, 241, 227, 0.6);
		}
		.trust-row a:hover {
			color: rgba(247, 241, 227, 0.95);
		}
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
		.chapter-4,
		.chapter-5 {
			left: 50%;
			right: auto;
			width: 100%;
			max-width: 26rem;
			text-align: center;
			transform: translate(-50%, -50%) translateY(var(--off, 28px));
		}
		.chapter-1 {
			top: 42%;
		}
		.chapter-2,
		.chapter-4 {
			top: 50%;
			flex-direction: column;
			gap: 1.4rem;
		}
		.chapter-2 {
			flex-direction: column-reverse;
		}
		.demo-duo {
			margin-top: 0;
		}
		.chapter-2 .chapter-copy,
		.chapter-4 .chapter-copy {
			flex-basis: auto;
			min-width: 0;
			width: 100%;
			text-align: center;
		}
		.chapter-3 {
			top: 40%;
			transform: translateX(-50%) translateY(var(--off, 28px));
		}
		.chapter-5 {
			top: 50%;
		}
		.chapter-5 .cta-row {
			justify-content: center;
		}
		.chapter-5 .fine-print {
			text-align: center;
		}
		.chapter-5 .trust-row,
		.chapter-5 .platforms-row,
		.chapter-5 .platform-binaries {
			justify-content: center;
		}
		.chapter-5 .platform-binaries {
			margin-inline: auto;
		}
		.draft-chip {
			max-width: 230px;
		}
		.chip-text {
			font-size: 0.72rem;
		}
	}
</style>
