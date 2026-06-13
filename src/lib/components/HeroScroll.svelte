<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { Pen, Lock, ShieldCheck } from '@lucide/svelte';
	import { browser } from '$app/environment';
	import { isMobile } from '$lib/breakpoints';
	if (browser) gsap.registerPlugin(ScrollTrigger);

	import revisionImg from '$lib/assets/screenshots/05-revision-active.png';
	import commentImg from '$lib/assets/screenshots/04-comment-active.png';
	import inlineImg from '$lib/assets/screenshots/13-inline-nested-revision.png';
	import libraryImg from '$lib/assets/screenshots/06-library.png';

	let { release }: { release: { assets: { name: string; url: string }[] } } = $props();

	function findAsset(pattern: string): string {
		const match = release.assets.find((a: { url: string }) => a.url.includes(pattern));
		if (match) return match.url;
		return `https://github.com/ThatXliner/quillium-releases/releases/latest`;
	}

	let detected = $state('unknown');
	let downloadUrl = $derived.by(() => {
		if (detected === 'mac') return findAsset('_aarch64.dmg');
		if (detected === 'windows') return findAsset('_x64-setup.exe');
		if (detected === 'linux') return findAsset('_amd64.deb');
		return '#download';
	});

	let displayText = $state('');
	let showPros = $state(false);
	let showPeriod = $state(false);
	let showCursor = $state(true);
	let scrollCtx: ScrollTrigger | null = null;

	onMount(() => {
		const mobile = isMobile();

		const ua = navigator.userAgent.toLowerCase();
		if (ua.includes('mac')) detected = 'mac';
		else if (ua.includes('win')) detected = 'windows';
		else if (ua.includes('linux')) detected = 'linux';

		const fullText = 'Prose for ';
		let i = 0;
		const interval = setInterval(() => {
			if (i < fullText.length) {
				displayText = fullText.slice(0, i + 1);
				i++;
			} else {
				showPros = true;
				clearInterval(interval);
				setTimeout(() => {
					showPeriod = true;
					setTimeout(() => (showCursor = false), 600);
				}, 100);
			}
		}, 100);

		// Mobile: skip all GSAP setup, ensure elements visible
		if (mobile) {
			document.querySelectorAll<HTMLElement>('#shot-editor, #shot-revision, #shot-comment, #shot-inline, #shot-library').forEach(el => {
				el.style.opacity = '1';
				el.style.transform = 'none';
			});
			document.querySelectorAll<HTMLElement>('#copy-editor, #copy-branches, #copy-comments, #copy-inline, #copy-safety').forEach(el => {
				el.style.opacity = '1';
				el.style.transform = 'none';
				el.style.pointerEvents = 'auto';
			});
			return () => clearInterval(interval);
		}

		const stage = document.getElementById('features');
		if (!stage) return () => clearInterval(interval);

		const textCol = document.getElementById('text-col')!;
		const shotWrap = document.getElementById('shot-wrap')!;

		const shots = [
			document.getElementById('shot-editor')!,
			document.getElementById('shot-revision')!,
			document.getElementById('shot-comment')!,
			document.getElementById('shot-inline')!,
			document.getElementById('shot-library')!
		].filter(Boolean);

		const callouts = [
			{ el: document.getElementById('callout-1')!, line: document.getElementById('line-1')! },
			{ el: document.getElementById('callout-2')!, line: document.getElementById('line-2')! },
			{ el: document.getElementById('callout-3')!, line: document.getElementById('line-3')! },
			{ el: document.getElementById('callout-4')!, line: document.getElementById('line-4')! }
		].filter((c) => c.el && c.line);

		const copies = [
			document.getElementById('copy-editor')!,
			document.getElementById('copy-branches')!,
			document.getElementById('copy-comments')!,
			document.getElementById('copy-inline')!,
			document.getElementById('copy-safety')!
		].filter(Boolean);

		const dots = document.querySelectorAll<HTMLElement>('.progress-dot');

		// Initial state: hide non-first shots, callouts, non-first copies
		shots.forEach((s, idx) => {
			if (idx > 0) gsap.set(s, { opacity: 0 });
		});
		callouts.forEach((c) => {
			gsap.set(c.el, { opacity: 0, y: 12 });
			gsap.set(c.line, { strokeDashoffset: 200 });
		});
		copies.forEach((c, idx) => {
			gsap.set(c, { pointerEvents: idx === 0 ? 'auto' : 'none' });
			if (idx > 0) gsap.set(c, { opacity: 0, y: 16 });
		});
		dots.forEach((d, idx) => {
			if (idx > 0) gsap.set(d, { opacity: 0.25 });
		});

		// Measure where the shot naturally sits (in the right grid column), calculate center offset
		const stageRect = stage.getBoundingClientRect();
		const shotRect = shotWrap.getBoundingClientRect();
		const vw = window.innerWidth;
		const targetW = Math.min(vw * 0.88, 960);
		const targetScale = targetW / shotRect.width;
		const targetCenterX = vw / 2;
		const currentCenterX = shotRect.left + shotRect.width / 2;
		const moveX = targetCenterX - currentCenterX;
		const currentCenterY = shotRect.top - stageRect.top + shotRect.height / 2;
		const moveY = window.innerHeight / 2 - currentCenterY;

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: stage,
				start: 'top top',
				end: '+=600%',
				pin: true,
				scrub: 1.2,
				onUpdate(self) {
					const p = self.progress;
					dots.forEach((dot, idx) => {
						const threshold = idx / (dots.length - 1);
						const active = p >= threshold - 0.02;
						gsap.to(dot, {
							opacity: active ? 0.9 : 0.25,
							scale: active ? 1.4 : 1,
							duration: 0.08,
							overwrite: true
						});
					});
				}
			}
		});

		// Phase 0: text fades, screenshot slides to center + scales up (0%–18%)
		tl.to(textCol, { opacity: 0, x: -40, duration: 0.12 }, 0.06);
		tl.to(shotWrap, { x: moveX, y: moveY, scale: targetScale, duration: 0.15 }, 0.06);
		tl.to(copies[0], { opacity: 0, y: -14, pointerEvents: 'none', duration: 0.04 }, 0.15);

		// Phase 1: Branches (18%–34%)
		tl.set(shots[1], { opacity: 1 }, 0.18);
		tl.to(copies[1], { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.05 }, 0.2);
		tl.to(callouts[0].el, { opacity: 1, y: 0, duration: 0.04 }, 0.22);
		tl.to(callouts[0].line, { strokeDashoffset: 0, duration: 0.04 }, 0.22);

		// Phase 2: Comments (34%–50%)
		tl.to([shots[0], shots[1]], { opacity: 0, duration: 0.05 }, 0.34);
		tl.to(copies[1], { opacity: 0, y: -14, pointerEvents: 'none', duration: 0.03 }, 0.34);
		tl.to(callouts[0].el, { opacity: 0, y: -10, duration: 0.03 }, 0.34);
		tl.to(callouts[0].line, { strokeDashoffset: 200, duration: 0.03 }, 0.34);
		tl.to(shots[2], { opacity: 1, duration: 0.05 }, 0.36);
		tl.to(copies[2], { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.05 }, 0.36);
		tl.to(callouts[1].el, { opacity: 1, y: 0, duration: 0.04 }, 0.38);
		tl.to(callouts[1].line, { strokeDashoffset: 0, duration: 0.04 }, 0.38);

		// Phase 3: Nestable revisions (50%–66%)
		tl.to(shots[2], { opacity: 0, duration: 0.05 }, 0.5);
		tl.to(copies[2], { opacity: 0, y: -14, pointerEvents: 'none', duration: 0.03 }, 0.5);
		tl.to(callouts[1].el, { opacity: 0, y: -10, duration: 0.03 }, 0.5);
		tl.to(callouts[1].line, { strokeDashoffset: 200, duration: 0.03 }, 0.5);
		tl.to(shots[3], { opacity: 1, duration: 0.05 }, 0.52);
		tl.to(copies[3], { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.05 }, 0.52);
		tl.to(callouts[2].el, { opacity: 1, y: 0, duration: 0.04 }, 0.54);
		tl.to(callouts[2].line, { strokeDashoffset: 0, duration: 0.04 }, 0.54);

		// Phase 4: Safety (66%–82%)
		tl.to(shots[3], { opacity: 0, duration: 0.05 }, 0.66);
		tl.to(copies[3], { opacity: 0, y: -14, pointerEvents: 'none', duration: 0.03 }, 0.66);
		tl.to(callouts[2].el, { opacity: 0, y: -10, duration: 0.03 }, 0.66);
		tl.to(callouts[2].line, { strokeDashoffset: 200, duration: 0.03 }, 0.66);
		tl.to(shots[4], { opacity: 1, duration: 0.05 }, 0.68);
		tl.to(copies[4], { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.05 }, 0.68);
		tl.to(callouts[3].el, { opacity: 1, y: 0, duration: 0.04 }, 0.7);
		tl.to(callouts[3].line, { strokeDashoffset: 0, duration: 0.04 }, 0.7);

		// CTA (92%–100%)
		tl.to(shots[4], { opacity: 0.3, duration: 0.07 }, 0.92);
		tl.to(copies[4], { opacity: 0, y: -14, pointerEvents: 'none', duration: 0.04 }, 0.9);
		tl.to(callouts[3].el, { opacity: 0, y: -10, duration: 0.03 }, 0.9);
		tl.to(callouts[3].line, { strokeDashoffset: 200, duration: 0.03 }, 0.9);

		scrollCtx = tl.scrollTrigger!;
		return () => clearInterval(interval);
	});

	onDestroy(() => {
		scrollCtx?.kill();
	});
</script>

<section class="w-full bg-[color:var(--bg)]">
	<div id="features" class="relative w-full overflow-hidden bg-[color:var(--bg)] max-md:overflow-visible">
		<div
			class="flex h-screen w-full items-center justify-center max-md:h-auto max-md:px-5 max-md:py-8"
		>
			<div
				class="stage-inner grid w-[min(94vw,1150px)] grid-cols-2 items-center gap-[clamp(2rem,5vw,5rem)] px-8 max-md:grid-cols-1"
			>
				<!-- Text column (grid left) -->
				<div id="text-col" class="flex flex-col pl-[clamp(0px,2vw,2rem)]">
					<div
						class="mb-4 flex h-20 w-20 items-center justify-center rounded-[22px] border border-white/35 bg-[radial-gradient(at_40%_35%,#eceef2,#cdd1d9)]"
					>
						<img src="/logo.svg" alt="Quillium mark" width="72" height="72" />
					</div>
					<p class="m-0 mb-3 text-[0.7rem] font-semibold tracking-[0.13em] text-[color:var(--text-faint)] uppercase">
						The Non-Linear Writing App
					</p>
					<h1
						class="m-0 mb-4 font-serif text-[clamp(2rem,4vw,3.2rem)] leading-[1.15] font-normal tracking-[-0.03em] text-[color:var(--text-strong)]"
						style="font-family: 'Newsreader', Georgia, serif;"
					>
						{displayText}{#if showPros}<span class="italic">Pros</span
							>{/if}{#if showPeriod}.{/if}<span class="animate-blink" class:hidden={!showCursor}
							>|</span
						>
					</h1>
					<p class="m-0 mb-5 text-[1.1rem] leading-[1.6] text-[color:var(--text-soft)]">
						Write a sentence three different ways, and decide which to pick later. Branch any phrase
						without losing a single word.
					</p>
					<div
						class="flex flex-wrap gap-[0.85rem] border-t-2 pt-4"
						style="border-image: linear-gradient(90deg, transparent, #3b82f6, #a855f7, #22c55e, #fcbc05, transparent) 1;"
					>
						<a href="/blog/quillium-is-not-an-ai-app" class="trust-link"
							><Pen size={14} strokeWidth={2} class="opacity-60" /> Write every word (No AI bs).</a
						>
						<a href="/blog/quillium-privacy" class="trust-link"
							><Lock size={14} strokeWidth={2} class="opacity-60" /> Fully private.</a
						>
						<a href="/blog/how-quillium-keeps-your-writing-safe" class="trust-link"
							><ShieldCheck size={14} strokeWidth={2} class="opacity-60" /> Safe and secure.</a
						>
					</div>

					<div id="hero-scroll-cta" class="flex justify-center bg-[color:var(--bg)] px-8 pt-6">
						<a href={downloadUrl} class="btn-primary">Download Now</a>
					</div>
				</div>

				<!-- Screenshot (grid right, GSAP animates it to center) -->
				<div id="shot-wrap" class="will-change-transform">
					<div class="relative w-full">
						<div class="relative aspect-[8/5] w-full">
							<img
								src={revisionImg}
								alt=""
								id="shot-editor"
								class="absolute inset-0 h-full w-full rounded-xl object-contain shadow-[0_16px_64px_rgba(var(--shadow-color),0.1),0_4px_16px_rgba(var(--shadow-color),0.05)]"
							/>
							<img
								src={revisionImg}
								alt=""
								id="shot-revision"
								class="absolute inset-0 h-full w-full rounded-xl object-contain opacity-0 shadow-[0_16px_64px_rgba(var(--shadow-color),0.1),0_4px_16px_rgba(var(--shadow-color),0.05)]"
							/>
							<img
								src={commentImg}
								alt=""
								id="shot-comment"
								class="absolute inset-0 h-full w-full rounded-xl object-contain opacity-0 shadow-[0_16px_64px_rgba(var(--shadow-color),0.1),0_4px_16px_rgba(var(--shadow-color),0.05)]"
							/>
							<img
								src={inlineImg}
								alt=""
								id="shot-inline"
								class="absolute inset-0 h-full w-full rounded-xl object-contain opacity-0 shadow-[0_16px_64px_rgba(var(--shadow-color),0.1),0_4px_16px_rgba(var(--shadow-color),0.05)]"
							/>
							<img
								src={libraryImg}
								alt=""
								id="shot-library"
								class="absolute inset-0 h-full w-full rounded-xl object-contain opacity-0 shadow-[0_16px_64px_rgba(var(--shadow-color),0.1),0_4px_16px_rgba(var(--shadow-color),0.05)]"
							/>
						</div>
						<div id="callouts-wrap" class="pointer-events-none absolute inset-0">
							<div id="callout-1" class="absolute inset-0 opacity-0">
								<svg
									viewBox="0 0 100 100"
									preserveAspectRatio="none"
									class="absolute inset-0 h-full w-full"
								>
									<path
										id="line-1"
										d="M 27 32 C 39 35 50 40 58.5 47.5"
										fill="none"
										stroke="#a855f7"
										stroke-width="0.35"
										stroke-dasharray="200"
										stroke-dashoffset="200"
										stroke-linecap="round"
										vector-effect="non-scaling-stroke"
									/>
								</svg>
								<span
									class="callout-label"
									style="top:28%;left:11%;color:#a855f7;font-family:'Inter',sans-serif;"
									>Write in Branches</span
								>
								<span class="callout-dot bg-[#a855f7]" style="top:47.5%;left:58.5%;"></span>
							</div>
							<div id="callout-2" class="absolute inset-0 opacity-0">
								<svg
									viewBox="0 0 100 100"
									preserveAspectRatio="none"
									class="absolute inset-0 h-full w-full"
								>
									<path
										id="line-2"
										d="M 74 26 C 79 28 84 31 88.5 34"
										fill="none"
										stroke="#d97706"
										stroke-width="0.35"
										stroke-dasharray="200"
										stroke-dashoffset="200"
										stroke-linecap="round"
										vector-effect="non-scaling-stroke"
									/>
								</svg>
								<span
									class="callout-label"
									style="top:19%;left:63%;color:#d97706;font-family:'Inter',sans-serif;"
									>Great Minds Think Together</span
								>
								<span class="callout-dot bg-[#d97706]" style="top:34%;left:88.5%;"></span>
							</div>
							<div id="callout-3" class="absolute inset-0 opacity-0">
								<svg
									viewBox="0 0 100 100"
									preserveAspectRatio="none"
									class="absolute inset-0 h-full w-full"
								>
									<path
										id="line-3"
										d="M 45 62 C 57 58 66 54 78 49"
										fill="none"
										stroke="#22c55e"
										stroke-width="0.35"
										stroke-dasharray="200"
										stroke-dashoffset="200"
										stroke-linecap="round"
										vector-effect="non-scaling-stroke"
									/>
								</svg>
								<span
									class="callout-label"
									style="top:62%;left:30%;color:#22c55e;font-family:'Inter',sans-serif;"
									>Nested annotations</span
								>
								<span class="callout-dot bg-[#22c55e]" style="top:49%;left:78%;"></span>
							</div>
							<div id="callout-4" class="absolute inset-0 opacity-0">
								<svg
									viewBox="0 0 100 100"
									preserveAspectRatio="none"
									class="absolute inset-0 h-full w-full"
								>
									<path
										id="line-4"
										d="M 60 74 C 48 62 37 47 25 36"
										fill="none"
										stroke="#3b82f6"
										stroke-width="0.35"
										stroke-dasharray="200"
										stroke-dashoffset="200"
										stroke-linecap="round"
										vector-effect="non-scaling-stroke"
									/>
								</svg>
								<span
									class="callout-label"
									style="top:70%;left:56%;color:#3b82f6;font-family:'Inter',sans-serif;"
									>Never Lose Your Work</span
								>
								<span class="callout-dot bg-[#3b82f6]" style="top:36%;left:25%;"></span>
							</div>
						</div>
					</div>
					<div class="relative mt-4 min-h-[56px] w-full">
						<div
							id="copy-editor"
							class="absolute inset-0 flex flex-col items-center justify-center text-center"
						>
							<p
								class="m-0 max-w-[500px] font-serif text-base leading-[1.6] text-[color:var(--text-soft)] italic"
								style="font-family:'Newsreader',Georgia,serif;"
							>
								Scroll to learn more.
							</p>
						</div>
						<div
							id="copy-branches"
							class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center opacity-0"
						>
							<p
								class="m-0 max-w-[500px] font-serif text-base leading-[1.6] text-[color:var(--text-soft)] italic"
								style="font-family:'Newsreader',Georgia,serif;"
							>
								Fork any sentence. Keep every version. Navigate your creative decisions freely and
								try what might work.
							</p>
						</div>
						<div
							id="copy-comments"
							class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center opacity-0"
						>
							<p
								class="m-0 max-w-[500px] font-serif text-base leading-[1.6] text-[color:var(--text-soft)] italic"
								style="font-family:'Newsreader',Georgia,serif;"
							>
								Comments, revisions, and suggestions float beside the text they're about.
								<a
									href="/omni"
									class="text-[color:var(--text-faint)] underline underline-offset-2 hover:text-[color:var(--text-soft)]"
									>Collaborate with your editor, anytime and anywhere.</a
								>
							</p>
						</div>
						<div
							id="copy-inline"
							class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center opacity-0"
						>
							<p
								class="m-0 max-w-[500px] font-serif text-base leading-[1.6] text-[color:var(--text-soft)] italic"
								style="font-family:'Newsreader',Georgia,serif;"
							>
								Revisions can hold revisions of their own. Follow an idea inward without losing the
								draft around it.
							</p>
						</div>
						<div
							id="copy-safety"
							class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center opacity-0"
						>
							<p
								class="m-0 max-w-[500px] font-serif text-base leading-[1.6] text-[color:var(--text-soft)] italic"
								style="font-family:'Newsreader',Georgia,serif;"
							>
								Your work is saved locally — durable, reliable, instant. Even if your computer
								crashes mid-sentence, nothing is lost.
							</p>
						</div>
					</div>
				</div>
			</div>
			<div
				id="hero-scroll-progress"
				class="absolute top-1/2 right-4 z-10 flex -translate-y-1/2 flex-col gap-[14px]"
			>
				{#each [0, 1, 2, 3, 4] as i}
					<span
						class="progress-dot h-[7px] w-[7px] rounded-full bg-[color:var(--border-strong)] transition-transform duration-300"
						data-slide={i}
					></span>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
	.animate-blink {
		animation: blink 0.6s step-end infinite;
	}

	.trust-link {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.9rem;
		color: var(--text-soft);
		text-decoration: underline;
		text-underline-offset: 3px;
		transition: color 0.3s;
	}
	.trust-link:hover {
		color: var(--text);
	}

	.callout-label {
		position: absolute;
		transform: translate(-50%, -50%);
		border-radius: 0.5rem;
		background: var(--surface);
		padding: 5px 0.75rem;
		font-size: 0.78rem;
		font-weight: 700;
		line-height: 1.2;
		white-space: nowrap;
		box-shadow: 0 1px 10px rgba(var(--shadow-color), 0.08);
		backdrop-filter: blur(16px);
	}

	.callout-dot {
		position: absolute;
		width: 7px;
		height: 7px;
		transform: translate(-50%, -50%);
		border-radius: 9999px;
		box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.85);
	}

	@media (max-width: 767px) {
		:global(#shot-editor),
		:global(#shot-revision),
		:global(#shot-comment),
		:global(#shot-inline),
		:global(#shot-library),
		:global(#copy-editor),
		:global(#copy-branches),
		:global(#copy-comments),
		:global(#copy-inline),
		:global(#copy-safety) {
			position: relative !important;
			opacity: 1 !important;
		}
		:global(#callouts-wrap),
		:global(#hero-scroll-progress) {
			display: none !important;
		}
	}
</style>
