<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { data } = $props();
	const Content = $derived(data.content);
</script>

<svelte:head>
	<title>{data.meta.title} — Quillium</title>
	<meta name="description" content={data.meta.description} />
	<link rel="canonical" href="https://quillium.bryanhu.com/blog/{data.slug}" />

	<!-- Open Graph -->
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://quillium.bryanhu.com/blog/{data.slug}" />
	<meta property="og:title" content="{data.meta.title} — Quillium" />
	<meta property="og:description" content={data.meta.description} />
	<meta property="og:site_name" content="Quillium" />
	<meta property="og:image" content="https://quillium.bryanhu.com/og/{data.slug}.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="article:published_time" content={data.meta.date} />
	{#if data.meta.author}<meta property="article:author" content={data.meta.author} />{/if}

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{data.meta.title} — Quillium" />
	<meta name="twitter:description" content={data.meta.description} />
	<meta name="twitter:image" content="https://quillium.bryanhu.com/og/{data.slug}.png" />

	<!-- Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		"headline": data.meta.title,
		"description": data.meta.description,
		"datePublished": data.meta.date,
		"author": {
			"@type": "Person",
			"name": data.meta.author ?? "Quillium"
		},
		"publisher": {
			"@type": "Organization",
			"name": "Quillium",
			"url": "https://quillium.bryanhu.com"
		},
		"url": `https://quillium.bryanhu.com/blog/${data.slug}`,
		"mainEntityOfPage": `https://quillium.bryanhu.com/blog/${data.slug}`
	})}</script>`}
</svelte:head>

<Nav />

<main class="max-w-[48rem] mx-auto px-6 pt-32 pb-24">
	<a href="/blog" class="text-xs text-black/40 no-underline hover:text-black/60 transition-colors">← Blog</a>

	<article class="mt-8">
		<header class="mb-10">
			<time class="text-xs text-black/40 font-mono">{data.meta.date}</time>
			<h1 class="text-3xl font-semibold tracking-tight mt-2" style="view-transition-name: blog-title">{data.meta.title}</h1>
			<p class="text-black/50 mt-2">{data.meta.description}</p>
		</header>

		<div class="prose prose-neutral max-w-none" style="view-transition-name: blog-content">
			<Content />
		</div>
	</article>
</main>

<Footer />

<style>
	:global(.prose) {
		line-height: 1.75;
		color: rgba(0, 0, 0, 0.75);
		overflow-wrap: break-word;
	}
	:global(.prose h2) {
		font-size: 1.25rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		margin-top: 2rem;
		margin-bottom: 0.5rem;
		color: rgba(0, 0, 0, 0.88);
	}
	:global(.prose h3) {
		font-size: 1rem;
		font-weight: 600;
		margin-top: 1.5rem;
		margin-bottom: 0.25rem;
		color: rgba(0, 0, 0, 0.88);
	}
	:global(.prose p) {
		margin-bottom: 1.25rem;
	}
	:global(.prose strong) {
		font-weight: 600;
		color: rgba(0, 0, 0, 0.88);
	}
	:global(.prose a) {
		color: rgba(0, 0, 0, 0.88);
		text-decoration: underline;
		text-decoration-color: rgba(0, 0, 0, 0.25);
		text-underline-offset: 3px;
		text-decoration-thickness: 1px;
		transition: text-decoration-color 0.15s;
	}
	:global(.prose a:hover) {
		text-decoration-color: rgba(0, 0, 0, 0.75);
	}
	:global(.prose ul) {
		list-style: disc;
		padding-left: 1.5rem;
		margin-bottom: 1.25rem;
	}
	:global(.prose ol) {
		list-style: decimal;
		padding-left: 1.5rem;
		margin-bottom: 1.25rem;
	}
	:global(.prose li) {
		margin-bottom: 0.25rem;
	}
	:global(.prose blockquote) {
		border-left: 2px solid rgba(0, 0, 0, 0.15);
		padding-left: 1rem;
		color: rgba(0, 0, 0, 0.5);
		margin: 1.5rem 0;
	}
	:global(.prose code) {
		font-size: 0.875em;
		background: rgba(0, 0, 0, 0.05);
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
	}
	:global(.prose pre) {
		background: rgba(0, 0, 0, 0.05);
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin-bottom: 1.25rem;
	}
	:global(.prose pre code) {
		background: none;
		padding: 0;
	}
</style>
