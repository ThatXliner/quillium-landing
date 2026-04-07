<script lang="ts">
	import { onMount } from 'svelte';
	import Nav from '$lib/components/Nav.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Showcase from '$lib/components/Showcase.svelte';
	import Features from '$lib/components/Features.svelte';
	import Manifesto from '$lib/components/Manifesto.svelte';
	import Download from '$lib/components/Download.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { data } = $props();

	onMount(() => {
		// Scroll reveal with Intersection Observer
		const revealEls = document.querySelectorAll('.reveal');
		const revealObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible');
						revealObserver.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0, rootMargin: '0px 0px -20px 0px' }
		);
		revealEls.forEach((el) => {
			const rect = el.getBoundingClientRect();
			// Already in or above the viewport — show immediately
			if (rect.bottom > 0 && rect.top < window.innerHeight) {
				el.classList.add('visible');
			} else {
				revealObserver.observe(el);
			}
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
		operatingSystem: 'Web',
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
		onload={(e) => { e.currentTarget.media = 'all'; }}
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
	<Hero release={data.release} />

	<Showcase />

	<div class="warm-divider section-divider"></div>

	<Features />

	<div class="warm-divider section-divider"></div>

	<Manifesto />

	<div class="warm-divider"></div>

	<Download release={data.release} />
</main>

<Footer />
