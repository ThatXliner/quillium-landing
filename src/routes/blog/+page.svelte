<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Blog — Quillium</title>
	<meta name="description" content="Thoughts on writing, collaboration, and building Quillium." />
	<link rel="canonical" href="https://quillium.bryanhu.com/blog" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://quillium.bryanhu.com/blog" />
	<meta property="og:title" content="Blog — Quillium" />
	<meta
		property="og:description"
		content="Thoughts on writing, collaboration, and building Quillium."
	/>
	<meta property="og:site_name" content="Quillium" />
	<meta property="og:image" content="https://quillium.bryanhu.com/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Blog — Quillium" />
	<meta
		name="twitter:description"
		content="Thoughts on writing, collaboration, and building Quillium."
	/>
	<meta name="twitter:image" content="https://quillium.bryanhu.com/og-image.png" />
</svelte:head>

<Nav />

<main class="mx-auto max-w-[48rem] px-6 pt-32 pb-24">
	<h1 class="mb-2 text-3xl font-semibold tracking-tight" style="view-transition-name: blog-title">Blog</h1>
	<p class="mb-12 text-black/50">Thoughts on writing, collaboration, and building Quillium.</p>

	{#each data.posts as post, i}
		{#if post.featured}
			<section class="mb-12">
				<h2 class="mb-4 text-sm font-semibold tracking-[0.08em] text-black/40 uppercase">
					Featured
				</h2>
				<a
					href="/blog/{post.slug}"
					class="group block rounded-xl border border-black/10 bg-white/40 p-6 no-underline"
				>
					<time class="font-mono text-xs text-black/40">{post.date}</time>
					<h3
						class="mt-1 mb-1 text-xl font-semibold tracking-tight transition-colors group-hover:text-black/60"
					>
						{post.title}
					</h3>
					<p class="text-sm text-black/60">{post.description}</p>
				</a>
			</section>
			{#if i === 0 && data.posts.length > 1}
				<h2 class="mb-6 text-sm font-semibold tracking-[0.08em] text-black/40 uppercase">
					All posts
				</h2>
			{/if}
		{:else}
			<a href="/blog/{post.slug}" class="group mb-8 block no-underline">
				<time class="font-mono text-xs text-black/40">{post.date}</time>
				<h3
					class="mt-1 mb-1 text-lg font-semibold tracking-tight transition-colors group-hover:text-black/60"
				>
					{post.title}
				</h3>
				<p class="text-sm text-black/60">{post.description}</p>
			</a>
		{/if}
	{/each}
</main>

<Footer />
