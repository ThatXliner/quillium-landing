<script lang="ts">
	import posthog from 'posthog-js';

	let email = $state('');
	let submitting = $state(false);
	let submitted = $state(false);
	let error = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!email || submitting) return;

		submitting = true;
		error = '';

		posthog.capture('updates_signup_submitted', { email });

		try {
			const res = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			});

			if (!res.ok) {
				const data = await res.json();
				if (data.error === 'already_subscribed') {
					error = "You're already signed up!";
				} else {
					error = 'Something went wrong. Please try again.';
				}
				posthog.capture('updates_signup_failed', { email, error: data.error });
			} else {
				posthog.capture('updates_signup_succeeded');
				submitted = true;
			}
		} catch (err) {
			error = 'Something went wrong. Please try again.';
			posthog.captureException(err);
		}

		submitting = false;
	}
</script>

<!-- ==================== FOOTER ==================== -->
<footer class="py-12 px-8 text-center border-t border-black/4">
	<!-- Email signup -->
	<div class="mx-auto max-w-[20rem] mb-8">
		{#if !submitted}
			<p class="mb-3 text-[0.75rem] text-black/40 contrast-more:text-black/55">Get release notes &amp; updates</p>
			<form onsubmit={handleSubmit} class="flex gap-2 max-[400px]:flex-col">
				<input
					type="email"
					placeholder="your@email.com"
					bind:value={email}
					required
					class="min-w-0 flex-1 rounded-lg border border-black/8 bg-white/60 px-3 py-2 font-[Inter,sans-serif] text-[0.8rem] text-black/88 transition-[border-color] duration-200 placeholder:text-black/25 contrast-more:placeholder:text-black/40 focus:border-[#3b82f6] focus:ring-[3px] focus:ring-[rgba(59,130,246,0.1)] focus:outline-none"
					aria-label="Email address"
				/>
				<button
					type="submit"
					class="shrink-0 rounded-lg border border-black/10 bg-white/70 px-4 py-2 font-[Inter,sans-serif] text-[0.75rem] font-medium text-black/60 contrast-more:text-black/65 transition-colors duration-200 hover:bg-white hover:text-black/88 disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={!email || submitting}
				>
					{submitting ? 'Sending...' : 'Subscribe'}
				</button>
			</form>
			{#if error}
				<p class="mt-2 text-[0.7rem] text-[#ef4444]">{error}</p>
			{/if}
		{:else}
			<p class="text-[0.75rem] text-[#15803d]">Subscribed. We'll keep you posted.</p>
		{/if}
	</div>

	<div class="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-6">
		<a href="mailto:support@quillium.bryanhu.com" class="text-[0.75rem] text-black/50 contrast-more:text-black/60 no-underline transition-colors duration-300 hover:text-black/88">Contact</a>
		<a href="/terms" class="text-[0.75rem] text-black/50 contrast-more:text-black/60 no-underline transition-colors duration-300 hover:text-black/88">Terms</a>
		<a href="/privacy" class="text-[0.75rem] text-black/50 contrast-more:text-black/60 no-underline transition-colors duration-300 hover:text-black/88">Privacy</a>
		<button onclick={() => window.dispatchEvent(new Event('open-cookie-consent'))} class="text-[0.75rem] text-black/50 contrast-more:text-black/60 bg-transparent border-none cursor-pointer p-0 transition-colors duration-300 hover:text-black/88">Cookie Settings</button>
		<a href="/rss.xml" class="text-[0.75rem] text-black/50 contrast-more:text-black/60 no-underline transition-colors duration-300 hover:text-black/88">RSS</a>
	</div>
	<p class="text-[0.7rem] text-black/28 contrast-more:text-black/50 m-0">&copy; 2026 Quillium</p>
</footer>
