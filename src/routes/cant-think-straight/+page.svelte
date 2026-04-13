<script lang="ts">
	import { onMount } from 'svelte';
	import posthog from 'posthog-js';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Features from '$lib/components/Features.svelte';
	import Download from '$lib/components/Download.svelte';

	const REPO = 'ThatXliner/quillium-releases';

	let { data } = $props();

	function findAsset(pattern: string): string {
		const match = data.release.assets.find((a: { url: string }) => a.url.includes(pattern));
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

	let useFullFeatures = $state(false);

	onMount(() => {
		const ua = navigator.userAgent.toLowerCase();
		if (ua.includes('mac')) detected = 'mac';
		else if (ua.includes('win')) detected = 'windows';
		else if (ua.includes('linux')) detected = 'linux';

		posthog.register({ campaign: 'cant-think-straight' });

		posthog.onFeatureFlags(() => {
			const variant = posthog.getFeatureFlag('campaign-features-style');
			useFullFeatures = variant === 'full-features';
		});

		return () => {
			posthog.unregister('campaign');
		};
	});
</script>

<svelte:head>
	<title>Can't Think Straight? — Quillium</title>
	<meta
		name="description"
		content="Your thoughts don't go in a straight line. Quillium works with that. Branch any sentence, keep every version, never lose a revision."
	/>
	<link rel="canonical" href="https://quillium.bryanhu.com/cant-think-straight" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://quillium.bryanhu.com/cant-think-straight" />
	<meta property="og:title" content="Can't Think Straight? — Quillium" />
	<meta
		property="og:description"
		content="Your thoughts don't go in a straight line. Quillium works with that. Branch any sentence, keep every version, never lose a revision."
	/>
	<meta property="og:site_name" content="Quillium" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Can't Think Straight? — Quillium" />
	<meta
		name="twitter:description"
		content="Your thoughts don't go in a straight line. Quillium works with that."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Newsreader:ital,wght@0,400;0,500;1,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<Nav />

<!-- HERO -->
<section
	class="relative flex min-h-screen flex-col items-center justify-center px-6 pt-32 pb-16 text-center"
>
	<!-- Subtle background gradients -->
	<div
		class="pointer-events-none absolute inset-0"
		style="background:
			radial-gradient(ellipse 600px 400px at 30% 60%, rgba(168,85,247,0.04), transparent),
			radial-gradient(ellipse 500px 350px at 70% 40%, rgba(59,130,246,0.04), transparent),
			radial-gradient(ellipse 400px 300px at 50% 80%, rgba(34,197,94,0.03), transparent);"
	></div>

	<div
		class="relative mb-8 flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.15em] text-black/35 uppercase"
	>
		<div class="flex gap-1">
			<span class="block h-1.5 w-1.5 rounded-full bg-[#3b82f6]"></span>
			<span class="block h-1.5 w-1.5 rounded-full bg-[#a855f7]"></span>
			<span class="block h-1.5 w-1.5 rounded-full bg-[#22c55e]"></span>
			<span class="block h-1.5 w-1.5 rounded-full bg-[#fcbc05]"></span>
		</div>
		The Non-Linear Writing App
	</div>

	<h1
		class="relative mb-6 max-w-[700px] font-[Newsreader,Georgia,serif] text-[clamp(2.8rem,6vw,5rem)] leading-[1.1] font-normal tracking-[-0.03em] text-black/88"
	>
		Can't think <em class="text-[#3b82f6]">straight?</em>
	</h1>

	<p class="relative mb-12 max-w-[500px] text-[1.15rem] leading-[1.7] text-black/50">
		Quillium works with that. Branch any sentence, keep every version, and never lose a revision.
		Your thoughts don't go in a straight line and your writing app shouldn't either.
	</p>

	<div class="relative mb-8 flex flex-wrap items-center justify-center gap-4">
		<a
			href={downloadUrl}
			class="btn-primary"
			onclick={() => posthog.capture('cta_clicked', { cta: 'download', location: 'campaign-hero' })}
		>
			Download Now
		</a>
		<a
			href="#why"
			class="inline-flex items-center gap-2 rounded-[10px] bg-white/50 px-7 py-3.5 text-[0.95rem] font-medium text-black/88 shadow-[0_1px_3px_rgba(0,0,0,0.08)] backdrop-blur-[12px] transition-all duration-300 hover:-translate-y-px hover:bg-white/70"
		>
			Why?
		</a>
	</div>

	<p class="relative text-[0.75rem] text-black/30">
		<a
			href="/pricing?utm_source=campaign&utm_medium=landing&utm_campaign=cant-think-straight"
			class="text-black/40 underline underline-offset-2">Free forever</a
		>.
		<a
			href="/blog/quillium-is-not-an-ai-app?utm_source=campaign&utm_medium=landing&utm_campaign=cant-think-straight"
			class="text-black/40 underline underline-offset-2">Not more AI slop</a
		>.
		<a
			href="/blog/quillium-privacy?utm_source=campaign&utm_medium=landing&utm_campaign=cant-think-straight"
			class="text-black/40 underline underline-offset-2">Privacy first</a
		>.
	</p>

	<!-- Branch visualization -->
	<div class="relative mt-16 w-full max-w-[680px]">
		<svg class="h-auto w-full" viewBox="0 0 680 180" fill="none" xmlns="http://www.w3.org/2000/svg">
			<!-- Main trunk -->
			<path
				d="M 40 90 L 200 90"
				stroke="rgba(0,0,0,0.12)"
				stroke-width="2"
				stroke-linecap="round"
			/>
			<!-- Branch point -->
			<circle cx="200" cy="90" r="6" fill="#3b82f6" opacity="0.8" />
			<!-- Upper branch -->
			<path
				d="M 200 90 C 260 90, 280 40, 340 40"
				stroke="#a855f7"
				stroke-width="2"
				stroke-linecap="round"
				opacity="0.5"
			/>
			<path
				d="M 340 40 L 520 40"
				stroke="#a855f7"
				stroke-width="2"
				stroke-linecap="round"
				opacity="0.5"
			/>
			<!-- Middle branch (main) -->
			<path
				d="M 200 90 L 520 90"
				stroke="#3b82f6"
				stroke-width="2"
				stroke-linecap="round"
				opacity="0.6"
			/>
			<!-- Lower branch -->
			<path
				d="M 200 90 C 260 90, 280 140, 340 140"
				stroke="#22c55e"
				stroke-width="2"
				stroke-linecap="round"
				opacity="0.5"
			/>
			<path
				d="M 340 140 L 520 140"
				stroke="#22c55e"
				stroke-width="2"
				stroke-linecap="round"
				opacity="0.5"
			/>
			<!-- Second branch point on upper -->
			<circle cx="420" cy="40" r="4" fill="#a855f7" opacity="0.6" />
			<path
				d="M 420 40 C 450 40, 460 20, 520 20"
				stroke="#fcbc05"
				stroke-width="1.5"
				stroke-linecap="round"
				opacity="0.4"
			/>
			<!-- End dots -->
			<circle cx="520" cy="20" r="3" fill="#fcbc05" opacity="0.5" />
			<circle cx="520" cy="40" r="3" fill="#a855f7" opacity="0.5" />
			<circle cx="520" cy="90" r="3" fill="#3b82f6" opacity="0.6" />
			<circle cx="520" cy="140" r="3" fill="#22c55e" opacity="0.5" />
			<!-- Text labels -->
			<text
				x="530"
				y="24"
				font-family="Inter, sans-serif"
				font-size="11"
				fill="rgba(0,0,0,0.25)"
				font-weight="500">revision c</text
			>
			<text
				x="530"
				y="44"
				font-family="Inter, sans-serif"
				font-size="11"
				fill="rgba(0,0,0,0.25)"
				font-weight="500">revision b</text
			>
			<text
				x="530"
				y="94"
				font-family="Inter, sans-serif"
				font-size="11"
				fill="rgba(0,0,0,0.3)"
				font-weight="600">revision a</text
			>
			<text
				x="530"
				y="144"
				font-family="Inter, sans-serif"
				font-size="11"
				fill="rgba(0,0,0,0.25)"
				font-weight="500">revision d</text
			>
			<!-- Starting label -->
			<text
				x="20"
				y="78"
				font-family="Inter, sans-serif"
				font-size="9"
				fill="rgba(0,0,0,0.2)"
				font-weight="600"
				letter-spacing="0.08em">YOUR IDEA</text
			>
		</svg>
	</div>
</section>

<!-- DIVIDER -->
<div class="section-divider px-8"><div class="warm-divider"></div></div>

<!-- VALUE PROP -->
<section id="why" class="mx-auto max-w-[900px] scroll-mt-24 px-6 py-20">
	<p class="section-eyebrow">Why Quillium</p>
	<h2
		class="mb-6 font-[Newsreader,Georgia,serif] text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.15] font-normal tracking-[-0.02em] text-black/88"
	>
		Most writing apps assume you know what you want to say.
	</h2>
	<p class="max-w-[640px] text-[1.05rem] leading-[1.8] text-black/50">
		...that your ideas arrive fully formed, in order, ready to be typed out, but that's not how it
		works. Quillium was built for the way writers actually think: in loops, in branches, in "wait,
		what if I said it this way instead?"
	</p>
</section>

<!-- FEATURES (A/B: card grid vs full Features component) -->
{#if useFullFeatures}
	<Features />
{:else}
	<div class="mx-auto grid max-w-250 grid-cols-1 gap-6 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-3">
		<div class="feature-card">
			<div
				class="mb-5 flex h-10 w-10 items-center justify-center rounded-[10px] bg-[rgba(168,85,247,0.1)] text-[1.2rem] text-[#a855f7]"
			>
				&#x2387;
			</div>
			<h3 class="mb-2 font-[Newsreader,Georgia,serif] text-[1.25rem] font-normal text-black/88">
				Write in Branches
			</h3>
			<p class="text-[0.9rem] leading-[1.65] text-black/50">
				Fork any sentence. Explore three different openings. Keep them all. Decide later — or never.
				Your revisions, your rules.
			</p>
		</div>

		<div class="feature-card">
			<div
				class="mb-5 flex h-10 w-10 items-center justify-center rounded-[10px] bg-[rgba(59,130,246,0.1)] text-[1.2rem] text-[#3b82f6]"
			>
				&#x270D;
			</div>
			<h3 class="mb-2 font-[Newsreader,Georgia,serif] text-[1.25rem] font-normal text-black/88">
				Annotations That Float
			</h3>
			<p class="text-[0.9rem] leading-[1.65] text-black/50">
				Leave notes beside your text, not buried in comments. See your thinking alongside your
				writing, the way it actually happens in your head.
			</p>
		</div>

		<div class="feature-card">
			<div
				class="mb-5 flex h-10 w-10 items-center justify-center rounded-[10px] bg-[rgba(34,197,94,0.1)] text-[1.2rem] text-[#22c55e]"
			>
				&#x1F512;
			</div>
			<h3 class="mb-2 font-[Newsreader,Georgia,serif] text-[1.25rem] font-normal text-black/88">
				Never Lose Work
			</h3>
			<p class="text-[0.9rem] leading-[1.65] text-black/50">
				Offline-first. SQLite-backed. Crash-resistant. Every keystroke is saved locally before
				anything else. Your words are yours.
			</p>
		</div>
	</div>
{/if}

<!-- MANIFESTO -->
<section class="mx-auto max-w-175 px-6 py-20 text-center">
	<div
		class="warm-divider mx-auto mb-12"
		style="max-width: 80px; height: 2px; background: linear-gradient(90deg, #3b82f6, #a855f7, #22c55e, #fcbc05); opacity: 0.5;"
	></div>
	<blockquote
		class="mb-8 border-none p-0 font-[Newsreader,Georgia,serif] text-[clamp(1.25rem,3vw,1.75rem)] leading-[1.6] text-black/65 italic"
	>
		"Your thoughts don't go in a straight line. Why should your writing app?"
	</blockquote>
	<p class="text-[0.8rem] font-medium tracking-[0.05em] text-black/35">The Quillium Manifesto</p>
</section>

<!-- DOWNLOAD -->
<Download release={data.release} />

<Footer />

<style>
	.feature-card {
		background: white;
		border: 1px solid rgba(0, 0, 0, 0.06);
		border-radius: 16px;
		padding: 2rem;
		transition:
			transform 0.3s,
			box-shadow 0.3s;
	}
	.feature-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);
	}
</style>
