<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Blog — Quillium</title>
	<meta name="description" content="Thoughts on writing, collaboration, and building Quillium." />
</svelte:head>

<Nav />

<main class="max-w-[48rem] mx-auto px-6 pt-32 pb-24">
	<h1 class="text-3xl font-semibold tracking-tight mb-2">Blog</h1>
	<p class="text-black/50 mb-12">Thoughts on writing, collaboration, and building Quillium.</p>

	<ul class="space-y-8 list-none p-0">
		{#each data.posts as post}
			<li>
				<a href="/blog/{post.slug}" class="group block no-underline">
					<time class="text-xs text-black/40 font-mono">{post.date}</time>
					<h2 class="text-lg font-semibold tracking-tight mt-1 mb-1 group-hover:text-black/60 transition-colors">{post.title}</h2>
					<p class="text-sm text-black/60">{post.description}</p>
				</a>
			</li>
		{/each}
	</ul>
</main>

<Footer />
