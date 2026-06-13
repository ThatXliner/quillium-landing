<script lang="ts">
	import { onMount, tick } from 'svelte';
	import posthog from 'posthog-js';
	import { initReveal } from '$lib/reveal';
	import Nav from '$lib/components/Nav.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Hero3DV2 from '$lib/components/Hero3DV2.svelte';
	import VideoOrCarousel from '$lib/components/VideoOrCarousel.svelte';
	import Features from '$lib/components/Features.svelte';
	import Download from '$lib/components/Download.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { MOBILE_BREAKPOINT } from '$lib/breakpoints';

	// The marketing demo (YouTube video id) shown above the feature list.
	const HERO_VIDEO_ID: string = 'YKsJSmKGITA';

	let { data } = $props();

	// Single landing layout (the hero-layout A/B test ended 2026-06-13; PostHog
	// experiment 376508 stopped, flag `hero-layout` kept only as a dormant QA
	// override). The page is now one fixed composition that diverges by device:
	//   DESKTOP: Hero3DV2 scroll-driven flight (the "airplane" intro) → the
	//     marketing video (VideoOrCarousel, → Showcase carousel on spotty links) →
	//     Features → Download.
	//   MOBILE: the plain static Hero (logo + headline + CTA) → Features → Download.
	//     No flight (the 520vh sticky scene is desktop-pointer territory) and NO
	//     video — watching a video embed on mobile is a poor experience, so the
	//     static hero takes its place.
	// `isMobile` defaults true so SSR renders the lightweight static-hero path; on
	// mount the real value resolves and desktop swaps in the flight + video.
	let isMobile = $state(true);

	// Desktop gets the flight + video; mobile gets the static hero and skips both.
	// The flight already carries its own finale download CTA, but we still render
	// the standalone Download section at the very bottom so there's a closing
	// call-to-action after the feature list for everyone.
	let showFlight = $derived(!isMobile);

	// isMobile resolves on the client and swaps the desktop (flight + video) and
	// mobile (static hero) paths, which changes the DOM *after* SSR. Re-run the
	// reveal animations once the new DOM has flushed so freshly-rendered `.reveal`
	// sections (the static Hero's copy, Features, etc.) fade in instead of staying
	// stuck at opacity:0. initReveal() is idempotent.
	$effect(() => {
		// Read showFlight so the effect re-runs when the layout flips; JSON.stringify
		// keeps the read from being dead-code-eliminated.
		JSON.stringify([showFlight]);
		tick().then(() => initReveal());
	});

	onMount(() => {
		if (data.release.version) {
			posthog.register({ app_version: data.release.version.replace(/^v/, '') });
		}

		const mql = matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
		isMobile = mql.matches;
		mql.addEventListener('change', (e) => (isMobile = e.matches));

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
	<!-- 1. Top hero, by device: desktop gets the scroll-driven paper-plane flight,
	     mobile gets the plain static hero. -->
	{#if showFlight}
		<Hero3DV2 release={data.release} />
	{:else}
		<Hero release={data.release} />
	{/if}

	<!-- 2. Desktop only: the marketing video (→ Showcase carousel on spotty links).
	        Mobile skips it — a video embed is a poor mobile experience.
	     3. Then for both: the feature list, then the closing Download CTA.
	     A divider precedes any section that follows another. -->
	<div class="post-hero">
		{#if showFlight}
			<div class="warm-divider section-divider"></div>
			<VideoOrCarousel videoId={HERO_VIDEO_ID} location="hero-video" />
		{/if}

		<div class="warm-divider section-divider"></div>
		<Features />

		<div class="warm-divider section-divider"></div>
		<Download release={data.release} />
	</div>
</main>

<Footer />
