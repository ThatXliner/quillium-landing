<script lang="ts">
	import posthog from 'posthog-js';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { dev } from '$app/environment';

	let visible = $state(false);

	onMount(() => {
		if (!dev && !localStorage.getItem('cookie_consent')) {
			visible = true;
		}

		window.addEventListener('open-cookie-consent', () => {
			visible = true;
		});
	});

	function accept() {
		localStorage.setItem('cookie_consent', 'accepted');
		posthog.opt_in_capturing();
		visible = false;
	}

	function decline() {
		localStorage.setItem('cookie_consent', 'declined');
		posthog.opt_out_capturing();
		visible = false;
	}
</script>

{#if visible}
	<div
		class="fixed bottom-0 left-0 right-0 z-[200] border-t border-[color:var(--border)] bg-[color:var(--surface)]/90 px-5 py-4 shadow-lg backdrop-blur-xl sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-md sm:rounded-2xl sm:border sm:px-6 sm:py-5"
		transition:fly={{ y: 40, duration: 300 }}
	>
		<p class="m-0 mb-4 text-sm leading-relaxed text-[color:var(--text-soft)] contrast-more:text-[color:var(--text)] sm:text-[0.8rem]">
			We use cookies only for anonymous analytics — no tracking, no profiling, no personalized ads. Ever.
			<a href="/privacy" class="text-[color:var(--accent-blue)] no-underline hover:underline">Privacy policy</a>
		</p>
		<div class="flex gap-2">
			<button
				onclick={accept}
				class="min-h-[44px] rounded-full bg-[color:var(--text-strong)] px-5 py-2 text-[0.75rem] font-medium text-[color:var(--surface)] transition-opacity hover:opacity-85 sm:min-h-0"
			>
				Accept
			</button>
			<button
				onclick={decline}
				class="min-h-[44px] rounded-full bg-[color:var(--border)] px-5 py-2 text-[0.75rem] font-medium text-[color:var(--text-soft)] transition-colors hover:bg-[color:var(--border-strong)] hover:text-[color:var(--text)] sm:min-h-0"
			>
				Decline
			</button>
		</div>
	</div>
{/if}
