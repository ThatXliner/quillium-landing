<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { data } = $props();
	const site = 'https://quillium.bryanhu.com';
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
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Blog",
		"name": "Quillium Blog",
		"description": "Thoughts on writing, collaboration, and building Quillium.",
		"url": `${site}/blog`,
		"publisher": {
			"@type": "Organization",
			"name": "Quillium",
			"url": site
		}
	})}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "ItemList",
		"name": "Quillium Blog Posts",
		"itemListElement": data.posts.map((post, index) => ({
			"@type": "ListItem",
			"position": index + 1,
			"url": `${site}/blog/${post.slug}`,
			"name": post.title
		}))
	})}</script>`}
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Newsreader:ital,wght@0,400;0,500;1,400&display=swap"
	/>
</svelte:head>

<Nav />

<main class="mx-auto max-w-[48rem] px-6 pt-32 pb-24">
	<h1 class="mb-2 font-[Newsreader,Georgia,serif] text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.15] font-normal tracking-[-0.02em] text-[color:var(--text-strong)] italic">Blog</h1>
	<p class="mb-12 text-[color:var(--text-soft)]">Thoughts on writing, collaboration, and building Quillium.</p>

	{#each data.posts as post, i}
		{#if post.featured}
			<section class="mb-12">
				<h2 class="mb-4 text-sm font-semibold tracking-[0.08em] text-[color:var(--text-faint)] uppercase">
					Featured
				</h2>
				<a
					href="/blog/{post.slug}"
					class="group block rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-6 no-underline"
				>
					<time class="font-mono text-xs text-[color:var(--text-faint)]">{post.date}</time>
					<h3
						class="mt-1 mb-1 text-xl font-semibold tracking-tight transition-colors group-hover:text-[color:var(--text-soft)]"
					>
						{post.title}
					</h3>
					<p class="text-sm text-[color:var(--text-soft)]">{post.description}</p>
				</a>
			</section>
			{#if i === 0 && data.posts.length > 1}
				<h2 class="mb-6 text-sm font-semibold tracking-[0.08em] text-[color:var(--text-faint)] uppercase">
					All posts
				</h2>
			{/if}
		{:else}
			<a href="/blog/{post.slug}" class="group mb-8 block no-underline">
				<time class="font-mono text-xs text-[color:var(--text-faint)]">{post.date}</time>
				<h3
					class="mt-1 mb-1 text-lg font-semibold tracking-tight transition-colors group-hover:text-[color:var(--text-soft)]"
				>
					{post.title}
				</h3>
				<p class="text-sm text-[color:var(--text-soft)]">{post.description}</p>
			</a>
		{/if}
	{/each}
</main>

<Footer />
