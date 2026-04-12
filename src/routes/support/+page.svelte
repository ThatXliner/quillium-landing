<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>Support – Quillium</title>
	<meta name="description" content="Need help with Quillium? Get in touch with us." />
	<link rel="canonical" href="https://quillium.bryanhu.com/support" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://quillium.bryanhu.com/support" />
	<meta property="og:title" content="Support – Quillium" />
	<meta property="og:description" content="Need help with Quillium? Get in touch with us." />
	<meta property="og:site_name" content="Quillium" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Support – Quillium" />
	<meta name="twitter:description" content="Need help with Quillium? Get in touch with us." />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Newsreader:ital,wght@0,400;0,500;1,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<Nav />

<main class="min-h-screen px-6 pt-32 pb-20">
	<div class="mx-auto max-w-2xl">
		<header>
			<h1
				class="mb-4 font-[Newsreader,Georgia,serif] text-[clamp(2.5rem,6vw,3.75rem)] leading-[1.05] font-normal tracking-[-0.03em] text-black/90"
			>
				Need help?
			</h1>
			<p class="max-w-xl text-[0.95rem] leading-relaxed text-black/45">
				Quillium is in public beta. If you run into a bug, have a question, or just want to say hi —
				email us at <a
					href="mailto:support@quillium.bryanhu.com"
					class="text-[#3b82f6] no-underline hover:underline">support@quillium.bryanhu.com</a
				>.
			</p>
		</header>

		<div class="mt-10">
			<a
				href="/"
				class="text-[0.8rem] font-medium text-black/40 no-underline transition-colors duration-200 hover:text-black/70"
			>
				&larr; Back to Home Page
			</a>
		</div>
	</div>
</main>

<Footer />
