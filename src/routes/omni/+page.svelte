<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import posthog from 'posthog-js';
	import { initReveal } from '$lib/reveal';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import {
		Cloud,
		MessageSquare,
		GitBranch,
		WifiOff,
		Smartphone,
		Laptop,
		Monitor,
		Check,
		ArrowRight
	} from '@lucide/svelte';

	let email = $state('');
	let submitting = $state(false);
	let submitted = $state(false);
	let error = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!email || submitting) return;

		submitting = true;
		error = '';

		posthog.capture('omni_waitlist_submitted', { email });

		try {
			const res = await fetch('/api/omni-waitlist', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			});

			if (!res.ok) {
				const data = await res.json();
				if (data.error === 'already_subscribed') {
					error = "You're already on the waitlist.";
				} else {
					error = 'Something went wrong. Please try again.';
				}
				posthog.capture('omni_waitlist_failed', { email, error: data.error });
			} else {
				posthog.capture('omni_waitlist_succeeded');
				submitted = true;
			}
		} catch (err) {
			error = 'Something went wrong. Please try again.';
			posthog.captureException(err);
		}

		submitting = false;
	}

	onMount(() => {
		initReveal();

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) return;

		gsap.registerPlugin(ScrollTrigger);

		const demo = document.querySelector('.devices-demo');
		if (!demo) return;

		const ENDPOINTS: Record<string, { x: number; y: number }> = {
			laptop: { x: 78, y: 82 },
			desktop: { x: 222, y: 82 },
			phone: { x: 150, y: 232 }
		};
		const HUB = { x: 150, y: 150 };

		const branches = demo.querySelectorAll<SVGPathElement>('.branch');
		const rails = demo.querySelectorAll<SVGLineElement>('.rails line');
		const leaves = demo.querySelectorAll<SVGCircleElement>('.leaf');
		const packets = demo.querySelectorAll<SVGCircleElement>('.packet');

		const packetTweens: gsap.core.Tween[] = [];

		// GSAP needs explicit initial state for SVG transform animations
		gsap.set(leaves, { scale: 0, opacity: 0, transformOrigin: 'center center' });
		gsap.set(branches, { strokeDashoffset: 150, opacity: 0 });
		gsap.set(rails, { opacity: 0 });
		gsap.set(packets, { opacity: 0 });

		function flyPacket(el: SVGCircleElement) {
			const branch = el.dataset.branch as keyof typeof ENDPOINTS;
			const outbound = el.dataset.dir === 'out';
			const device = ENDPOINTS[branch];
			const from = outbound ? HUB : device;
			const to = outbound ? device : HUB;
			const duration = gsap.utils.random(1.6, 2.6);

			el.setAttribute('cx', String(from.x));
			el.setAttribute('cy', String(from.y));
			gsap.set(el, { opacity: 0 });

			const tl = gsap.timeline({
				onComplete: () => {
					gsap.delayedCall(gsap.utils.random(4, 10), () => flyPacket(el));
				}
			});
			tl.to(el, {
				attr: { cx: to.x, cy: to.y },
				duration,
				ease: 'power1.inOut'
			});
			tl.to(el, { opacity: 1, duration: duration * 0.15, ease: 'power1.out' }, 0);
			tl.to(el, { opacity: 0, duration: duration * 0.2, ease: 'power1.in' }, duration * 0.8);
			packetTweens.push(tl as unknown as gsap.core.Tween);
		}

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: demo,
				start: 'top 80%',
				once: true
			}
		});

		// Phase 1: branches sprout from hub outward
		tl.to(branches, {
			strokeDashoffset: 0,
			opacity: 1,
			duration: 0.9,
			ease: 'power2.out',
			stagger: 0.18
		});

		// Leaves pop at endpoints
		tl.to(
			leaves,
			{
				scale: 1,
				opacity: 1,
				duration: 0.4,
				ease: 'back.out(2.4)',
				stagger: 0.12
			},
			'-=0.3'
		);

		// Rails fade in underneath
		tl.to(
			rails,
			{
				opacity: 1,
				duration: 0.6,
				ease: 'power1.out'
			},
			'-=0.2'
		);

		// Phase 2: stagger initial packet starts widely so activity isn't clustered
		tl.call(() => {
			packets.forEach((el) => {
				gsap.delayedCall(gsap.utils.random(0, 8), () => flyPacket(el));
			});
		});

		return () => {
			packetTweens.forEach((t) => t.kill());
			gsap.killTweensOf(packets);
			tl.scrollTrigger?.kill();
			tl.kill();
		};
	});
</script>

<svelte:head>
	<title>Quillium Omni — Collaboration for writers, on your terms</title>
	<meta
		name="description"
		content="Quillium Omni brings your documents to every device and lets collaborators work alongside you without getting in your way. Join the waitlist."
	/>
	<link rel="canonical" href="https://quillium.bryanhu.com/omni" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://quillium.bryanhu.com/omni" />
	<meta property="og:title" content="Quillium Omni — Collaboration for writers, on your terms" />
	<meta
		property="og:description"
		content="Shared text, independent views. Cloud sync and real-time collaboration for Quillium — join the waitlist."
	/>
	<meta property="og:site_name" content="Quillium" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Quillium Omni — Collaboration for writers, on your terms" />
	<meta
		name="twitter:description"
		content="Shared text, independent views. Cloud sync and real-time collaboration for Quillium — join the waitlist."
	/>

	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Newsreader:ital,wght@0,400;0,500;1,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<Nav />

<main class="min-h-screen px-6 pt-32 pb-20">
	<!-- ============ HERO ============ -->
	<section class="mx-auto max-w-3xl text-center">
		<p class="eyebrow">
			<span class="eyebrow-dot"></span>
			Quillium Omni · Coming soon
		</p>
		<h1 class="hero-heading">
			Write Anywhere.<br /><span class="italic">Think Together.</span>
		</h1>
		<p class="hero-lead">
			Cloud sync across all your devices.<br />Real-time collaboration that just works.
		</p>

		<!-- Waitlist form -->
		<div class="mx-auto mt-10 max-w-[28rem]">
			{#if !submitted}
				<form onsubmit={handleSubmit} class="flex gap-2 max-[440px]:flex-col">
					<input
						type="email"
						placeholder="your@email.com"
						bind:value={email}
						required
						class="waitlist-input"
						aria-label="Email address"
					/>
					<button type="submit" class="btn-primary" disabled={!email || submitting}>
						{submitting ? 'Joining…' : 'Join the waitlist'}
						{#if !submitting}
							<ArrowRight size={16} strokeWidth={2} />
						{/if}
					</button>
				</form>
				{#if error}
					<p class="mt-3 text-[0.8rem] text-[#ef4444]">{error}</p>
				{/if}
				<p class="mt-4 text-[0.72rem] text-black/35">
					No spam. You'll hear from us when Omni is ready for early testers.
				</p>
			{:else}
				<div class="success-card">
					<Check size={18} strokeWidth={2} />
					<p>You're on the list. We'll be in touch when Omni opens up.</p>
				</div>
			{/if}
		</div>
	</section>

	<!-- <div class="warm-divider mx-auto my-24 max-w-5xl"></div> -->

	<!-- ============ PRINCIPLE ============ -->
	<!-- <section class="mx-auto max-w-2xl text-center">
		<p class="section-eyebrow section-eyebrow--centered">The idea</p>
		<h2 class="section-heading mb-6">
			Shared text, <span class="italic">independent views</span>.
		</h2>
		<p class="mx-auto max-w-xl text-[1rem] leading-[1.8] text-black/55">
			Google Docs assumes everyone wants to watch the same cursor move. Writers don't work that way.
			Omni is designed so two people can think about the same document in their own time, own way —
			with annotations that flow between them in real time.
		</p>
	</section> -->

	<div class="warm-divider mx-auto my-24 max-w-5xl"></div>

	<!-- ============ FEATURES ============ -->
	<section class="mx-auto max-w-5xl">
		<div class="reveal mb-16 max-w-xl">
			<p class="section-eyebrow">What Omni adds</p>
			<h2 class="section-heading">Two things, bundled.</h2>
			<p class="mt-4 text-[0.95rem] leading-[1.7] text-black/55">
				Cloud sync across your devices, and real-time collaboration with other people. One
				subscription, both included.
			</p>
		</div>

		<!-- ─── Group A: Cloud sync ─── -->
		<div class="reveal feature-group-label">
			<span class="feature-group-dot" style="background:#3b82f6;"></span>
			<p class="feature-group-heading">Across your devices</p>
		</div>

		<!-- Feature 1: Device sync (mocked visual) -->
		<div class="reveal feature-row">
			<div class="feature-visual">
				<div class="devices-demo">
					<svg class="sync-lines" viewBox="0 0 300 300" aria-hidden="true">
						<!-- Growing branches (drawn once) -->
						<g class="branches">
							<path class="branch branch--laptop" d="M 150 150 L 78 82" />
							<path class="branch branch--desktop" d="M 150 150 L 222 82" />
							<path class="branch branch--phone" d="M 150 150 L 150 232" />
						</g>
						<!-- Settled rails (dotted) -->
						<g class="rails">
							<line x1="78" y1="82" x2="150" y2="150" />
							<line x1="222" y1="82" x2="150" y2="150" />
							<line x1="150" y1="232" x2="150" y2="150" />
						</g>
						<!-- Leaf pops at device endpoints -->
						<circle class="leaf leaf--laptop" cx="78" cy="82" r="4" />
						<circle class="leaf leaf--desktop" cx="222" cy="82" r="4" />
						<circle class="leaf leaf--phone" cx="150" cy="232" r="4" />
						<!-- Packet pool: 2 per branch (one each direction) -->
						<circle class="packet" data-branch="laptop" data-dir="out" cx="150" cy="150" r="3.5" />
						<circle class="packet" data-branch="laptop" data-dir="in" cx="78" cy="82" r="3" />
						<circle class="packet" data-branch="desktop" data-dir="out" cx="150" cy="150" r="3.5" />
						<circle class="packet" data-branch="desktop" data-dir="in" cx="222" cy="82" r="3" />
						<circle class="packet" data-branch="phone" data-dir="out" cx="150" cy="150" r="3.5" />
						<circle class="packet" data-branch="phone" data-dir="in" cx="150" cy="232" r="3" />
					</svg>

					<div class="device device--laptop">
						<Laptop size={36} strokeWidth={1.3} />
						<span class="device-label">MacBook</span>
					</div>
					<div class="device device--desktop">
						<Monitor size={36} strokeWidth={1.3} />
						<span class="device-label">Studio</span>
					</div>
					<div class="device device--phone">
						<Smartphone size={28} strokeWidth={1.3} />
						<span class="device-label">iPhone<sup>*</sup></span>
					</div>

					<div class="sync-hub">
						<Cloud size={24} strokeWidth={1.5} />
						<span class="sync-hub-pulse"></span>
					</div>
				</div>
			</div>
			<div class="feature-text">
				<div class="feature-icon-wrap" style="background:rgba(59,130,246,0.08);">
					<Cloud size={24} strokeWidth={1.5} color="#3b82f6" />
				</div>
				<h3 class="feature-heading">Every device, one document</h3>
				<p class="feature-lead">
					Start a draft on your laptop. Edit a paragraph from your phone on the train. Pick up on
					your desktop at home—even mid-sentence, with your revision history intact. Omni is fast,
					background, and invisible.
				</p>
				<div class="tag-list">
					<span class="tag tag--blue">macOS</span>
					<span class="tag tag--blue">Windows</span>
					<span class="tag tag--blue">Linux</span>
					<!-- <span class="tag tag--blue">iOS</span>
					<span class="tag tag--blue">Android</span> -->
				</div>
				<p class="feature-footnote"><sup>*</sup>Quillium is not yet available for mobile.</p>
			</div>
		</div>

		<!-- Feature 4 (moved): Offline/reconnect — part of Cloud sync group -->
		<div class="reveal feature-row feature-row--reversed">
			<div class="feature-text">
				<div class="feature-icon-wrap" style="background:rgba(34,197,94,0.08);">
					<WifiOff size={24} strokeWidth={1.5} color="#22c55e" />
				</div>
				<h3 class="feature-heading">Offline-first, always</h3>
				<p class="feature-lead">
					Lose Wi-Fi, crash the app, yank the power: Quillium keeps going. Every keystroke lands on
					the device in front of you first. The cloud is just where they meet.
				</p>
			</div>

			<div class="feature-visual">
				<div class="offline-demo">
					<div class="offline-badge">
						<WifiOff size={16} strokeWidth={1.5} />
						<span>Offline</span>
					</div>
					<div class="offline-lines">
						<div class="offline-line"></div>
						<div class="offline-line offline-line--short"></div>
						<div class="offline-line"></div>
						<div class="offline-line offline-line--shorter"></div>
						<div class="offline-cursor"></div>
					</div>
					<p class="offline-status">
						<Check size={14} strokeWidth={2} />
						Saved locally · will sync when online
					</p>
				</div>
			</div>
		</div>

		<!-- ─── Group B: Collaboration ─── -->
		<div class="reveal feature-group-label feature-group-label--spaced">
			<span class="feature-group-dot" style="background:#a855f7;"></span>
			<p class="feature-group-heading">With other people</p>
		</div>

		<!-- Feature 2: Annotations -->
		<div class="reveal feature-row feature-row--reversed">
			<div class="feature-visual">
				<div class="annotations-demo">
					<div class="doc-snippet">
						<p>
							The lighthouse <span class="highlight-yellow">cast its beam</span> across the water,
							<span class="highlight-blue">indifferent to the storm</span>.
						</p>
					</div>
					<div class="annotation annotation--editor">
						<div class="annotation-avatar" style="background:#f59e0b;">R</div>
						<div class="annotation-body">
							<p class="annotation-author">Rena · editor</p>
							<p class="annotation-text">Can we try "swept" here? More active.</p>
						</div>
					</div>
					<div class="annotation annotation--you">
						<div class="annotation-avatar" style="background:#3b82f6;">Y</div>
						<div class="annotation-body">
							<p class="annotation-author">You · just now</p>
							<p class="annotation-text">Yeah — also wondering if "storm" is too tidy.</p>
						</div>
					</div>
				</div>
			</div>
			<div class="feature-text">
				<div class="feature-icon-wrap" style="background:rgba(252,188,5,0.1);">
					<MessageSquare size={24} strokeWidth={1.5} color="#d97706" />
				</div>
				<h3 class="feature-heading">Annotations that move in real time</h3>
				<p class="feature-lead">
					Comments, suggestions, and revisions sync live, anchored to the exact words they
					reference.
				</p>
				<!-- <div class="tag-list">
					<span class="tag tag--amber">Threaded comments</span>
					<span class="tag tag--amber">Inline suggestions</span>
					<span class="tag tag--amber">Full attribution</span>
				</div> -->
			</div>
		</div>

		<!-- Feature 3: Shared text, independent views -->
		<div class="reveal feature-row">
			<div class="feature-visual">
				<div class="branches-demo">
					<p class="branch-label">One document · two views</p>
					<div class="branch-tree">
						<div class="branch-row">
							<div class="branch-node branch-node--active">main</div>
							<div class="viewer-badge">
								<span class="viewer-dot" style="background:#f59e0b;"></span>
								Rena viewing
							</div>
						</div>
						<div class="branch-line"></div>
						<div class="branch-row">
							<div class="branch-node">drafting-ch3</div>
						</div>
						<div class="branch-line branch-line--fork"></div>
						<div class="branch-row">
							<div class="branch-node branch-node--you">opening-v2</div>
							<div class="viewer-badge">
								<span class="viewer-dot" style="background:#3b82f6;"></span>
								You viewing
							</div>
						</div>
					</div>
					<p class="branch-caption">
						Same branches, same annotations — each of you decides which revision to look at.
					</p>
				</div>
			</div>
			<div class="feature-text">
				<div class="feature-icon-wrap" style="background:rgba(168,85,247,0.08);">
					<GitBranch size={24} strokeWidth={1.5} color="#a855f7" />
				</div>
				<h3 class="feature-heading">Shared text, independent views</h3>
				<p class="feature-lead">
					Read one revision while your friend edits another, or opt into follow mode when you
					actually want to sit beside them.
				</p>
				<!-- <div class="tag-list">
					<span class="tag tag--purple">Independent scroll</span>
					<span class="tag tag--purple">Per-user revision view</span>
					<span class="tag tag--purple">Opt-in follow mode</span>
				</div> -->
			</div>
		</div>
	</section>

	<div class="warm-divider mx-auto my-24 max-w-5xl"></div>

	<!-- ============ PRICING CALLOUT ============ -->
	<section class="mx-auto max-w-2xl">
		<div class="mb-6">
			<p class="section-eyebrow">Pricing</p>
			<h2 class="section-heading">Only owners pay.</h2>
		</div>

		<div class="flex h-full flex-col overflow-hidden rounded-xl border border-black/6 bg-white/60">
			<div class="border-b border-black/5 px-5 py-4">
				<p class="mb-1 text-[0.65rem] font-semibold tracking-[0.08em] text-black/30 uppercase">
					Quillium Omni
				</p>
				<p class="font-[Newsreader,Georgia,serif] text-[1.4rem] leading-none text-black/65 italic">
					~$20<span class="text-[0.85rem] text-black/30">/month</span>
				</p>
				<p class="mt-1 text-[0.7rem] text-black/28">
					Price TBD. The more users, the cheaper it gets.
				</p>
			</div>
			<div class="flex flex-1 flex-col px-5 py-4">
				<ul class="space-y-2">
					<li class="check-item">Collaborators you invite don't need a subscription</li>
					<li class="check-item">Mobile apps stay free — sync just makes them better</li>
					<li class="check-item">Cancel anytime; your local documents stay yours</li>
					<li class="check-item">The writing app is free forever. Omni is always optional</li>
				</ul>
				<a
					href="/pricing#paid"
					class="mt-auto inline-flex items-center gap-1.5 pt-3 text-[0.75rem] font-medium text-[#3b82f6] no-underline hover:underline"
				>
					See the full pricing story
					<ArrowRight size={12} strokeWidth={2} />
				</a>
			</div>
		</div>
	</section>

	<div class="warm-divider mx-auto my-24 max-w-5xl"></div>

	<!-- ============ FAQ ============ -->
	<section class="mx-auto max-w-2xl">
		<h2 class="section-heading">FAQ</h2>

		<div class="mt-12 space-y-8">
			<div class="faq-row">
				<p class="faq-q">When will Omni ship?</p>
				<p class="faq-a">
					Soon-ish. Auth, the relay server, and the sync protocol are in progress. We're not giving
					a date because we'd miss it, but it's the next major feature after the current round of
					editor improvements.
				</p>
			</div>
			<div class="faq-row">
				<p class="faq-q">Why is this a paid add-on?</p>
				<p class="faq-a">
					Running a real-time relay server costs real money. We'd rather charge honestly for
					infrastructure than mine your data. The free app stays free because it doesn't rely on our
					servers.
				</p>
			</div>
			<div class="faq-row">
				<p class="faq-q">Can I try it before paying?</p>
				<p class="faq-a">
					Yes: waitlist members get early access. Pricing won't kick in until Omni is stable.
					(Free!)
				</p>
			</div>
			<div class="faq-row">
				<p class="faq-q">What if I cancel?</p>
				<p class="faq-a">
					Your documents were always stored on your local device first. Omni is only a layer on top,
					not a replacement.
				</p>
			</div>
		</div>
	</section>

	<div class="warm-divider mx-auto my-24 max-w-5xl"></div>

	<!-- ============ FINAL CTA ============ -->
	<section class="mx-auto max-w-2xl text-center">
		<h2
			class="mb-4 font-[Newsreader,Georgia,serif] text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.15] font-normal tracking-[-0.02em] text-black/88"
		>
			Be first in line.
		</h2>
		<p class="mb-8 text-[0.95rem] text-black/50">
			Join the waitlist and we'll reach out when early access opens.
		</p>

		{#if !submitted}
			<form onsubmit={handleSubmit} class="mx-auto flex max-w-[28rem] gap-2 max-[440px]:flex-col">
				<input
					type="email"
					placeholder="your@email.com"
					bind:value={email}
					required
					class="waitlist-input"
					aria-label="Email address"
				/>
				<button type="submit" class="btn-primary" disabled={!email || submitting}>
					{submitting ? 'Joining…' : 'Join the waitlist'}
					{#if !submitting}
						<ArrowRight size={16} strokeWidth={2} />
					{/if}
				</button>
			</form>
			{#if error}
				<p class="mt-3 text-[0.8rem] text-[#ef4444]">{error}</p>
			{/if}
		{:else}
			<div class="mx-auto max-w-[28rem]">
				<div class="success-card">
					<Check size={18} strokeWidth={2} />
					<p>You're on the list. We'll be in touch when Omni opens up.</p>
				</div>
			</div>
		{/if}
	</section>
</main>

<Footer />

<style>
	/* ── Hero ── */
	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 5px 14px;
		border-radius: 9999px;
		background: rgba(59, 130, 246, 0.08);
		border: 1px solid rgba(59, 130, 246, 0.18);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		color: #2563eb;
		margin-bottom: 28px;
	}
	.eyebrow-dot {
		width: 6px;
		height: 6px;
		border-radius: 9999px;
		background: #3b82f6;
		box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
		animation: pulse 2s ease-in-out infinite;
	}
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
	}
	.hero-heading {
		font-family: 'Newsreader', Georgia, serif;
		font-size: clamp(2.5rem, 7vw, 4.5rem);
		line-height: 1.05;
		font-weight: 400;
		letter-spacing: -0.03em;
		color: rgba(0, 0, 0, 0.9);
		margin: 0 0 28px 0;
	}
	.hero-heading .italic {
		font-style: italic;
		color: rgba(0, 0, 0, 0.55);
	}
	.hero-lead {
		font-size: 1.05rem;
		line-height: 1.8;
		color: rgba(0, 0, 0, 0.55);
		max-width: 38rem;
		margin: 0 auto;
	}

	/* ── Waitlist form ── */
	.waitlist-input {
		min-width: 0;
		flex: 1;
		border-radius: 10px;
		border: 1px solid rgba(0, 0, 0, 0.1);
		background: rgba(255, 255, 255, 0.7);
		padding: 12px 16px;
		font-family: 'Inter', sans-serif;
		font-size: 0.9rem;
		color: rgba(0, 0, 0, 0.88);
		transition:
			border-color 200ms,
			box-shadow 200ms;
	}
	.waitlist-input::placeholder {
		color: rgba(0, 0, 0, 0.3);
	}
	.waitlist-input:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.success-card {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 14px 18px;
		border-radius: 10px;
		background: rgba(34, 197, 94, 0.08);
		border: 1px solid rgba(34, 197, 94, 0.2);
		color: #15803d;
		font-size: 0.85rem;
	}
	.success-card p {
		margin: 0;
		line-height: 1.5;
	}

	/* ── Feature group labels ── */
	.feature-group-label {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 36px;
	}
	.feature-group-label--spaced {
		margin-top: 32px;
	}
	.feature-group-dot {
		width: 8px;
		height: 8px;
		border-radius: 9999px;
	}
	.feature-group-heading {
		margin: 0;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(0, 0, 0, 0.5);
	}

	/* ── Feature rows ── */
	.feature-row {
		display: grid;
		grid-template-columns: 1fr;
		gap: 48px;
		margin-bottom: 96px;
		align-items: center;
	}
	@media (min-width: 768px) {
		.feature-row {
			grid-template-columns: 3fr 2fr;
			gap: 80px;
		}
		.feature-row--reversed {
			grid-template-columns: 2fr 3fr;
		}
		.feature-row--reversed .feature-text {
			order: -1;
		}
	}
	.feature-row:last-child {
		margin-bottom: 0;
	}
	.feature-icon-wrap {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20px;
	}
	.feature-heading {
		font-family: 'Newsreader', Georgia, serif;
		font-size: 1.65rem;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.88);
		margin: 0 0 12px 0;
		line-height: 1.2;
		letter-spacing: -0.01em;
	}
	.feature-lead {
		font-size: 15.5px;
		color: rgba(0, 0, 0, 0.6);
		line-height: 1.8;
		margin: 0;
	}
	.tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 20px;
	}
	.feature-footnote {
		margin: 12px 0 0 0;
		font-size: 0.72rem;
		line-height: 1.55;
		color: rgba(0, 0, 0, 0.4);
	}
	.feature-footnote sup,
	.feature-lead sup {
		font-size: 0.9em;
		margin-right: 1px;
		vertical-align: baseline;
		position: relative;
		top: -0.35em;
		line-height: 0;
	}
	.tag {
		border-radius: 9999px;
		padding: 3px 11px;
		font-size: 12px;
		font-family: 'Inter', sans-serif;
		font-weight: 500;
	}
	.tag--purple {
		background: rgba(168, 85, 247, 0.08);
		border: 1px solid rgba(168, 85, 247, 0.2);
		color: #7c3aed;
	}
	.tag--green {
		background: rgba(34, 197, 94, 0.08);
		border: 1px solid rgba(34, 197, 94, 0.2);
		color: #16a34a;
	}
	.tag--blue {
		background: rgba(59, 130, 246, 0.08);
		border: 1px solid rgba(59, 130, 246, 0.2);
		color: #2563eb;
	}
	.tag--amber {
		background: rgba(245, 158, 11, 0.1);
		border: 1px solid rgba(245, 158, 11, 0.22);
		color: #b45309;
	}

	/* ── Devices demo ── */
	.feature-visual {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.devices-demo {
		position: relative;
		width: 100%;
		max-width: 400px;
		aspect-ratio: 1 / 1;
		padding: 12px;
		border-radius: 18px;
		background:
			radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08), transparent 65%),
			rgba(255, 255, 255, 0.5);
		border: 1px solid rgba(0, 0, 0, 0.05);
	}
	.sync-lines {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		fill: none;
		pointer-events: none;
	}
	.sync-lines .branches path {
		fill: none;
		stroke: #3b82f6;
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-dasharray: 150;
		stroke-dashoffset: 150;
		opacity: 0;
	}
	.sync-lines .rails line {
		stroke: rgba(59, 130, 246, 0.35);
		stroke-width: 1.25;
		stroke-dasharray: 4 4;
		opacity: 0;
	}
	.sync-lines .leaf {
		fill: #3b82f6;
		opacity: 0;
	}
	.sync-lines .packet {
		fill: #3b82f6;
		opacity: 0;
		filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.6));
	}
	.sync-lines .packet[data-dir='in'] {
		fill: #60a5fa;
	}
	@media (prefers-reduced-motion: reduce) {
		.sync-lines .branches path {
			display: none;
		}
		.sync-lines .rails line {
			opacity: 0.35;
		}
		.sync-lines .leaf,
		.sync-lines .packet {
			display: none;
		}
	}
	.device {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 20px 22px;
		min-width: 112px;
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.95);
		border: 1px solid rgba(0, 0, 0, 0.06);
		color: rgba(0, 0, 0, 0.65);
		box-shadow: 0 4px 14px rgba(44, 42, 39, 0.06);
		transform-origin: center;
		animation: sprout 900ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
	}
	.device--laptop {
		top: 14%;
		left: 10%;
		--sprout-x: 40%;
		--sprout-y: 40%;
		animation-delay: 200ms;
	}
	.device--desktop {
		top: 14%;
		right: 10%;
		--sprout-x: -40%;
		--sprout-y: 40%;
		animation-delay: 380ms;
	}
	.device--phone {
		bottom: 10%;
		left: 50%;
		--sprout-x: 0%;
		--sprout-y: -50%;
		animation-delay: 560ms;
	}
	.device--phone {
		transform: translateX(-50%);
	}
	@keyframes sprout {
		0% {
			opacity: 0;
			transform: translate(var(--sprout-x, 0), var(--sprout-y, 0)) scale(0.3);
		}
		60% {
			opacity: 1;
		}
		100% {
			opacity: 1;
			transform: translate(0, 0) scale(1);
		}
	}
	.device--phone {
		animation-name: sprout-phone;
	}
	@keyframes sprout-phone {
		0% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.3);
		}
		60% {
			opacity: 1;
		}
		100% {
			opacity: 1;
			transform: translate(-50%, 0) scale(1);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.device {
			animation: none;
		}
	}
	.device-label {
		font-size: 10.5px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: rgba(0, 0, 0, 0.4);
	}
	.device-label sup {
		font-size: 0.85em;
		margin-left: 1px;
		vertical-align: baseline;
		position: relative;
		top: -0.35em;
		line-height: 0;
	}
	.sync-hub {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 60px;
		height: 60px;
		border-radius: 9999px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: white;
		border: 1px solid rgba(59, 130, 246, 0.25);
		color: #3b82f6;
		box-shadow: 0 6px 18px rgba(59, 130, 246, 0.18);
		z-index: 1;
	}
	.sync-hub-pulse {
		position: absolute;
		inset: -4px;
		border-radius: 9999px;
		border: 2px solid rgba(59, 130, 246, 0.4);
		animation: hub-ripple 2.4s ease-out infinite;
	}
	@keyframes hub-ripple {
		0% {
			transform: scale(0.9);
			opacity: 0.8;
		}
		100% {
			transform: scale(1.6);
			opacity: 0;
		}
	}

	/* ── Annotations demo ── */
	.annotations-demo {
		width: 100%;
		max-width: 420px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 20px;
		border-radius: 16px;
		background: rgba(255, 255, 255, 0.7);
		border: 1px solid rgba(0, 0, 0, 0.05);
	}
	.doc-snippet {
		padding: 16px 18px;
		border-radius: 10px;
		background: #fdfcfa;
		border: 1px solid rgba(0, 0, 0, 0.04);
	}
	.doc-snippet p {
		margin: 0;
		font-family: 'Newsreader', Georgia, serif;
		font-size: 0.95rem;
		line-height: 1.7;
		color: rgba(0, 0, 0, 0.75);
	}
	.highlight-yellow {
		background: rgba(245, 158, 11, 0.22);
		padding: 1px 3px;
		border-radius: 3px;
	}
	.highlight-blue {
		background: rgba(59, 130, 246, 0.18);
		padding: 1px 3px;
		border-radius: 3px;
	}
	.annotation {
		display: flex;
		gap: 10px;
		padding: 10px 12px;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.8);
		border: 1px solid rgba(0, 0, 0, 0.05);
	}
	.annotation--you {
		margin-left: 20px;
	}
	.annotation-avatar {
		width: 26px;
		height: 26px;
		border-radius: 9999px;
		color: white;
		font-size: 0.72rem;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.annotation-body {
		flex: 1;
		min-width: 0;
	}
	.annotation-author {
		font-size: 0.68rem;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.5);
		margin: 0 0 2px 0;
		letter-spacing: 0.02em;
	}
	.annotation-text {
		font-size: 0.82rem;
		color: rgba(0, 0, 0, 0.7);
		margin: 0;
		line-height: 1.5;
	}

	/* ── Branches demo ── */
	.branches-demo {
		width: 100%;
		max-width: 420px;
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 24px;
		border-radius: 16px;
		background: rgba(255, 255, 255, 0.7);
		border: 1px solid rgba(0, 0, 0, 0.05);
	}
	.branch-label {
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(0, 0, 0, 0.4);
		margin: 0 0 4px 0;
	}
	.branch-tree {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0;
	}
	.branch-node {
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.72rem;
		padding: 4px 10px;
		border-radius: 6px;
		background: rgba(0, 0, 0, 0.04);
		color: rgba(0, 0, 0, 0.55);
		border: 1px solid rgba(0, 0, 0, 0.05);
	}
	.branch-node--active {
		background: rgba(0, 0, 0, 0.06);
		color: rgba(0, 0, 0, 0.7);
		font-weight: 600;
	}
	.branch-node--you {
		background: rgba(168, 85, 247, 0.1);
		border-color: rgba(168, 85, 247, 0.25);
		color: #7c3aed;
	}
	.branch-line {
		width: 2px;
		height: 16px;
		background: rgba(0, 0, 0, 0.1);
		margin-left: 14px;
	}
	.branch-line--fork {
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(168, 85, 247, 0.3));
	}
	.branch-row {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
	}
	.viewer-badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 3px 9px;
		border-radius: 9999px;
		background: rgba(0, 0, 0, 0.03);
		border: 1px solid rgba(0, 0, 0, 0.06);
		font-size: 0.68rem;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.5);
	}
	.viewer-dot {
		width: 6px;
		height: 6px;
		border-radius: 9999px;
	}
	.branch-caption {
		margin: 8px 0 0 0;
		font-size: 0.72rem;
		line-height: 1.55;
		color: rgba(0, 0, 0, 0.45);
	}

	/* ── Offline demo ── */
	.offline-demo {
		width: 100%;
		max-width: 360px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 24px;
		border-radius: 16px;
		background: rgba(255, 255, 255, 0.7);
		border: 1px solid rgba(0, 0, 0, 0.05);
	}
	.offline-badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		align-self: flex-start;
		padding: 4px 10px;
		border-radius: 9999px;
		background: rgba(0, 0, 0, 0.05);
		color: rgba(0, 0, 0, 0.5);
		font-size: 0.72rem;
		font-weight: 500;
	}
	.offline-lines {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 6px 0;
	}
	.offline-line {
		height: 8px;
		border-radius: 4px;
		background: rgba(0, 0, 0, 0.08);
		width: 100%;
	}
	.offline-line--short {
		width: 70%;
	}
	.offline-line--shorter {
		width: 45%;
	}
	.offline-cursor {
		width: 2px;
		height: 14px;
		background: #3b82f6;
		margin-top: 4px;
		animation: blink 1s step-end infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
	.offline-status {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 0.72rem;
		color: #16a34a;
		margin: 0;
		padding-top: 10px;
		border-top: 1px dashed rgba(0, 0, 0, 0.08);
	}

	/* ── Check items (shared with /pricing card style) ── */
	.check-item {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		font-size: 0.8rem;
		color: rgba(0, 0, 0, 0.55);
	}
	.check-item::before {
		content: '';
		display: block;
		width: 12px;
		height: 12px;
		margin-top: 3px;
		flex-shrink: 0;
		background: url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2.5 7l3 3 6-6' stroke='%2316a34a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")
			no-repeat center;
		background-size: contain;
	}

	/* ── FAQ ── */
	.faq-row {
		padding-bottom: 24px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
	}
	.faq-row:last-child {
		border-bottom: none;
	}
	.faq-q {
		font-family: 'Newsreader', Georgia, serif;
		font-size: 1.1rem;
		color: rgba(0, 0, 0, 0.85);
		margin: 0 0 8px 0;
		font-weight: 500;
	}
	.faq-a {
		font-size: 0.92rem;
		color: rgba(0, 0, 0, 0.55);
		line-height: 1.75;
		margin: 0;
	}

	/* ── Section utilities ── */
	.section-heading .italic {
		font-style: italic;
		color: rgba(0, 0, 0, 0.55);
	}
</style>
