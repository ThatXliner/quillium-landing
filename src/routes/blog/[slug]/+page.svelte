<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { data } = $props();
	const Content = data.content;
</script>

<svelte:head>
	<title>{data.meta.title} — Quillium</title>
	<meta name="description" content={data.meta.description} />
</svelte:head>

<Nav />

<main class="max-w-[48rem] mx-auto px-6 pt-32 pb-24">
	<a href="/blog" class="text-xs text-black/40 no-underline hover:text-black/60 transition-colors">← Blog</a>

	<article class="mt-8">
		<header class="mb-10">
			<time class="text-xs text-black/40 font-mono">{data.meta.date}</time>
			<h1 class="text-3xl font-semibold tracking-tight mt-2">{data.meta.title}</h1>
			<p class="text-black/50 mt-2">{data.meta.description}</p>
		</header>

		<div class="prose prose-neutral max-w-none">
			<Content />
		</div>
	</article>
</main>

<Footer />

<style>
	:global(.prose) {
		line-height: 1.75;
		color: rgba(0, 0, 0, 0.75);
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
