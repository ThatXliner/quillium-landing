<script lang="ts">
	import { onMount } from 'svelte';
	import { initReveal } from '$lib/reveal';
	import Nav from '$lib/components/Nav.svelte';
	import Manifesto from '$lib/components/Manifesto.svelte';
	import Footer from '$lib/components/Footer.svelte';

	onMount(() => {
		initReveal();
	});
</script>

<svelte:head>
	<title>Manifesto — Quillium</title>
	<meta
		name="description"
		content="Writing is thinking, and thinking is non-linear. The Quillium manifesto on treating non-linearity as a feature, not a problem to manage."
	/>
	<link rel="canonical" href="https://quillium.bryanhu.com/manifesto" />

	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://quillium.bryanhu.com/manifesto" />
	<meta property="og:title" content="Manifesto — Quillium" />
	<meta
		property="og:description"
		content="Writing is thinking, and thinking is non-linear. The Quillium manifesto on treating non-linearity as a feature, not a problem to manage."
	/>
	<meta property="og:site_name" content="Quillium" />
	<meta property="og:image" content="https://quillium.bryanhu.com/og-image.png" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Manifesto — Quillium" />
	<meta
		name="twitter:description"
		content="Writing is thinking, and thinking is non-linear. The Quillium manifesto on treating non-linearity as a feature, not a problem to manage."
	/>
	<meta name="twitter:image" content="https://quillium.bryanhu.com/og-image.png" />

	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Newsreader:ital,wght@0,400;0,500;1,400&display=swap"
		rel="stylesheet"
		media="print"
		onload={(e) => {
			e.currentTarget.media = 'all';
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
<main class="pt-16 pb-20">
	<Manifesto />
</main>

<Footer />
