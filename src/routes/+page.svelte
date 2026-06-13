<script lang="ts">
	import { onMount, tick } from 'svelte';
	import posthog from 'posthog-js';
	import { initReveal } from '$lib/reveal';
	import Nav from '$lib/components/Nav.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import HeroScroll from '$lib/components/HeroScroll.svelte';
	import HeroVideo from '$lib/components/HeroVideo.svelte';
	import Hero3DV2 from '$lib/components/Hero3DV2.svelte';
	import Showcase from '$lib/components/Showcase.svelte';
	import Features from '$lib/components/Features.svelte';
	import Download from '$lib/components/Download.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { MOBILE_BREAKPOINT } from '$lib/breakpoints';

	// Set this once the marketing video is uploaded (YouTube video id).
	const HERO_VIDEO_ID: string = 'YKsJSmKGITA';

	let { data } = $props();

	let isMobile = $state(true);
	// `hero-layout` experiment: 'video' => video-first hero, '3d-variant-2' =>
	// scroll-driven flight scene, else current scroll hero. Falls back to the
	// scroll hero until the flag loads or if no video id is set.
	let heroVariant = $state('control');
	let showVideoHero = $derived(heroVariant === 'video' && HERO_VIDEO_ID !== '');
	let show3DV2Hero = $derived(heroVariant === '3d-variant-2');
	let showScrollHero = $derived(!isMobile && !showVideoHero && !show3DV2Hero);

	// Post-hero sections, gated per variant:
	// - scroll hero: self-contained, shows nothing below.
	// - 3D flight hero: chapters demo the branching story (skip Showcase) and the
	//   chapter-5 finale is the download CTA (skip Download), but keep Features.
	// - video hero: the marketing video replaces the Showcase carousel, so it skips
	//   Showcase but keeps Features + Download below.
	// - control / mobile: the full Showcase → Features → Download stack.
	let showShowcase = $derived(!showScrollHero && !show3DV2Hero && !showVideoHero);
	let showFeatures = $derived(!showScrollHero);
	let showDownload = $derived(!showScrollHero && !show3DV2Hero);

	// The hero variant resolves on the client (URL override or PostHog flag), which
	// swaps the post-hero layout *after* SSR. Re-wire the reveal animations once the
	// new DOM has flushed so freshly-rendered `.reveal` sections (e.g. the Features
	// list under hero=video) fade in instead of staying stuck at opacity:0.
	// initReveal() is idempotent, so re-running it only picks up new nodes.
	$effect(() => {
		// Reading the flags registers them as dependencies, so the effect re-runs
		// whenever the post-hero layout changes; JSON.stringify keeps the read from
		// being dead-code-eliminated.
		JSON.stringify([showShowcase, showFeatures, showDownload, showVideoHero, show3DV2Hero]);
		tick().then(() => initReveal());
	});

	onMount(() => {
		if (data.release.version) {
			posthog.register({ app_version: data.release.version.replace(/^v/, '') });
		}

		const mql = matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
		isMobile = mql.matches;
		mql.addEventListener('change', (e) => (isMobile = e.matches));

		// `?hero=video|3d-variant-2|control` forces a variant (QA / dev, where flags don't load)
		const heroOverride = new URLSearchParams(location.search).get('hero');
		if (heroOverride) heroVariant = heroOverride;

		posthog.onFeatureFlags(() => {
			if (heroOverride) return;
			const variant = posthog.getFeatureFlag('hero-layout');
			if (typeof variant === 'string') heroVariant = variant;
		});

		// Smooth scroll for anchor links
		document.querySelectorAll('a[href^="#"]').forEach((link) => {
			link.addEventListener('click', (e) => {
				const href = (link as HTMLAnchorElement).getAttribute('href');
				if (!href) return;
				const target = document.querySelector(href);
				if (target) {
					e.preventDefault();
					target.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
			});
		});
	});
</script>

<svelte:head>
	<title>Quillium — The Non-Linear Writing App</title>
	<meta name="msvalidate.01" content="64D60FCC52EFEF1A4B0D43527C8FB4C3" />
	<meta
		name="keywords"
		content="non-linear writing, writing app, branching text editor, version control for writing, writing in branches, revision branches, draft management, writing tool, distraction-free writing, prose editor"
	/>
	<meta
		name="description"
		content="A writing app that lets you write in branches. Fork any sentence, keep every version, and never lose a draft."
	/>
	<link rel="canonical" href="https://quillium.bryanhu.com/" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://quillium.bryanhu.com/" />
	<meta property="og:title" content="Quillium — The Non-Linear Writing App" />
	<meta
		property="og:description"
		content="A writing app that lets you write in branches. Fork any sentence, keep every version, and never lose a draft."
	/>
	<meta property="og:site_name" content="Quillium" />
	<meta property="og:image" content="https://quillium.bryanhu.com/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@quillium" />
	<meta name="twitter:title" content="Quillium — The Non-Linear Writing App" />
	<meta
		name="twitter:description"
		content="A writing app that lets you write in branches. Fork any sentence, keep every version, and never lose a draft."
	/>
	<meta name="twitter:image" content="https://quillium.bryanhu.com/og-image.png" />

	<!-- Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'Quillium',
		description:
			'A writing app that lets you write in branches. Fork any sentence, keep every version, and never lose a draft.',
		url: 'https://quillium.bryanhu.com',
		applicationCategory: 'ProductivityApplication',
		operatingSystem: 'macOS, Windows, Linux',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD',
			availability: 'https://schema.org/InStock'
		}
	})}</script>`}

	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Newsreader:ital,wght@0,400;0,500;1,400&display=swap"
		rel="stylesheet"
		media="print"
		onload={(e) => {
			(e.currentTarget as HTMLLinkElement).media = 'all';
		}}
	/>
	<noscript>
		<link
			href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Newsreader:ital,wght@0,400;0,500;1,400&display=swap"
			rel="stylesheet"
		/>
	</noscript>
</svelte:head>

<Nav />
<main>
	{#if showVideoHero}
		<HeroVideo videoId={HERO_VIDEO_ID} />
	{:else if show3DV2Hero}
		<Hero3DV2 release={data.release} />
	{:else if showScrollHero}
		<HeroScroll release={data.release} />
	{:else}
		<Hero release={data.release} />
	{/if}

	<!-- Post-hero demo sections. Which ones show is gated per variant by the
	     showShowcase / showFeatures / showDownload flags (see <script>); a divider
	     is rendered before any section that follows another. -->
	<div class="post-hero">
		{#if showShowcase}
			<Showcase />
		{/if}

		{#if showFeatures}
			{#if showShowcase}
				<div class="warm-divider section-divider"></div>
			{/if}
			<Features />
		{/if}

		{#if showDownload}
			{#if showShowcase || showFeatures}
				<div class="warm-divider section-divider"></div>
			{/if}
			<Download release={data.release} />
		{/if}
	</div>
</main>

<Footer />
