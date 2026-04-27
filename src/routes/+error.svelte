<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';

	let { error, status } = $props();

	type ErrorCopy = {
		title: string;
		body: string;
	};

	function errorCopyForStatus(status: number): ErrorCopy {
		switch (status) {
			case 400:
				return {
					title: 'Bad request',
					body: "That request couldn't be processed as written."
				};
			case 401:
				return {
					title: 'Sign in required',
					body: 'You need to be signed in to view this page.'
				};
			case 403:
				return {
					title: 'Access denied',
					body: "You don't have permission to view this page."
				};
			case 404:
				return {
					title: 'Page not found',
					body: "The page you're looking for doesn't exist or is no longer available."
				};
			case 408:
				return {
					title: 'Request timed out',
					body: 'The page took too long to respond. Please try again.'
				};
			case 429:
				return {
					title: 'Too many requests',
					body: 'You have made too many requests in a short period. Please try again soon.'
				};
			case 500:
				return {
					title: 'Server error',
					body: 'Something broke on our side while loading this page.'
				};
			case 502:
				return {
					title: 'Bad gateway',
					body: 'A service Quillium depends on returned an invalid response.'
				};
			case 503:
				return {
					title: 'Service unavailable',
					body: 'This page is temporarily unavailable. Please try again in a moment.'
				};
			case 504:
				return {
					title: 'Gateway timeout',
					body: 'A service Quillium depends on took too long to respond.'
				};
			default:
				if (status >= 400 && status < 500) {
					return {
						title: 'Request failed',
						body: 'This page could not be loaded because the request was invalid or not allowed.'
					};
				}

				return {
					title: 'Something went wrong',
					body: 'An unexpected error occurred while loading this page.'
				};
		}
	}

	const errorCopy = $derived(errorCopyForStatus(status));
	const title = $derived(errorCopy.title);
	const body = $derived(errorCopy.body);
</script>

<svelte:head>
	<title>{status} · Quillium</title>
</svelte:head>

<Nav />

<main class="min-h-screen px-6 pt-32 pb-20">
	<section class="mx-auto max-w-3xl rounded-[32px] border border-black/6 bg-white/65 px-8 py-14 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
		<p class="section-eyebrow mb-3">{status}</p>
		<h1 class="font-[Newsreader,Georgia,serif] text-[clamp(2.8rem,7vw,4.8rem)] leading-none text-black/88">
			{title}
		</h1>
		<p class="mx-auto mt-5 max-w-xl text-[1rem] leading-8 text-black/52">
			{body}
		</p>
		{#if error?.message}
			<p class="mx-auto mt-4 max-w-lg text-[0.85rem] leading-7 text-black/38">
				{error.message}
			</p>
		{/if}

		<div class="mt-8 flex flex-wrap justify-center gap-3">
			<a href="/" class="btn-primary">Back to Quillium</a>
			<a
				href="/#download"
				class="inline-flex items-center rounded-[10px] bg-white/70 px-6 py-3 text-[0.95rem] font-medium text-black/70 no-underline shadow-md inset-shadow-sm inset-shadow-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:text-black/88"
			>
				Download the app
			</a>
		</div>
	</section>
</main>

<Footer />
