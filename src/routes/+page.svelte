<svelte:head>
	<title>Quillium — Next Generation Prose</title>
	<meta
		name="description"
		content="The world's first non-linear editor for prose. Write in branches, get contextual AI assistance, and keep every version alive."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Newsreader:ital,wght@0,400;0,500;1,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<script lang="ts">
	import { onMount } from 'svelte';
	import Nav from '$lib/components/Nav.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Features from '$lib/components/Features.svelte';
	import Manifesto from '$lib/components/Manifesto.svelte';
	import Waitlist from '$lib/components/Waitlist.svelte';
	import Footer from '$lib/components/Footer.svelte';

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
			{ threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
		);
		revealEls.forEach((el) => revealObserver.observe(el));

		// Make elements already in viewport visible immediately
		document.querySelectorAll('.reveal').forEach((el) => {
			const rect = el.getBoundingClientRect();
			if (rect.top < window.innerHeight) el.classList.add('visible');
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

<Nav />
<Hero />

<div class="warm-divider section-divider"></div>

<Features />

<div class="warm-divider section-divider"></div>

<Manifesto />

<div class="warm-divider"></div>

<Waitlist />

<Footer />
