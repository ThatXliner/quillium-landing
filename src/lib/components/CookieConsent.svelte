<script lang="ts">
	import posthog from 'posthog-js';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let visible = $state(false);

	onMount(() => {
		if (!posthog.has_opted_in_capturing() && !posthog.has_opted_out_capturing()) {
			// Start cookieless capturing immediately while waiting for consent
			posthog.opt_out_capturing();
			visible = true;
		}
	});

	function accept() {
		posthog.opt_in_capturing();
		visible = false;
	}

	function decline() {
		posthog.opt_out_capturing();
		visible = false;
	}
</script>

{#if visible}
	<div
		class="fixed bottom-6 right-6 z-[200] max-w-md rounded-2xl border border-black/[0.04] bg-white/80 px-6 py-5 shadow-lg backdrop-blur-xl"
		transition:fly={{ y: 40, duration: 300 }}
	>
		<p class="m-0 mb-4 text-[0.8rem] leading-relaxed text-black/60">
			We use cookies only for anonymous analytics — no tracking, no profiling, no personalized ads. Ever.
			<a href="/privacy" class="text-[#3b82f6] no-underline hover:underline">Privacy policy</a>
		</p>
		<div class="flex gap-2">
			<button
				onclick={accept}
				class="rounded-full bg-black/88 px-5 py-2 text-[0.75rem] font-medium text-white transition-colors hover:bg-black"
			>
				Accept
			</button>
			<button
				onclick={decline}
				class="rounded-full bg-black/[0.04] px-5 py-2 text-[0.75rem] font-medium text-black/50 transition-colors hover:bg-black/[0.08] hover:text-black/70"
			>
				Decline
			</button>
		</div>
	</div>
{/if}
