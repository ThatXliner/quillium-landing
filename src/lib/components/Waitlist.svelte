<script lang="ts">
	let email = $state('');
	let hasAgreedToTerms = $state(false);
	let submitting = $state(false);
	let submitted = $state(false);
	let error = $state('');

	async function handleBetaSubmit(e: Event) {
		e.preventDefault();
		if (!hasAgreedToTerms || !email || submitting) return;

		submitting = true;
		error = '';

		try {
			const data = new FormData(e.target as HTMLFormElement);
			const res = await fetch('https://formspree.io/f/mwvrdbey', {
				method: 'POST',
				body: data,
				headers: { Accept: 'application/json' }
			});

			if (res.ok) {
				submitted = true;
			} else {
				const json = await res.json();
				if (Object.hasOwn(json, 'errors')) {
					error = json.errors.map((err: { message: string }) => err.message).join(', ');
				} else {
					error = 'Something went wrong. Please try again.';
				}
			}
		} catch {
			error = 'Network error. Please try again.';
		} finally {
			submitting = false;
		}
	}
</script>

<!-- ==================== WAITLIST CTA ==================== -->
<section id="waitlist" class="px-8 py-16 text-center">
	<div class="reveal mx-auto max-w-[36rem]">
		<h2
			class="mb-3 font-[Newsreader,Georgia,serif] text-[clamp(1.9rem,5vw,3rem)] font-normal tracking-[-0.01em] text-black/88"
		>
			Start writing sideways.
		</h2>
		<p class="mb-8 text-[0.95rem] leading-[1.7] text-black/50">
			Join the beta. We'll send you the app link and stay out of your way.
		</p>

		<p class="mb-3 text-left font-[Inter,sans-serif] text-[13px] font-semibold text-black/88">
			Waitlist Terms
		</p>
		<div
			class="mb-5 rounded-[14px] border border-black/8 bg-white/50 p-4 text-left backdrop-blur-md"
			aria-label="Waitlist terms"
		>
			<div class="grid grid-cols-1 gap-0.5 min-[480px]:grid-cols-2">
				<div class="flex gap-3 rounded-lg p-3 transition-colors">
					<div
						class="mt-px flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/35 bg-white/50 shadow-sm inset-shadow-sm inset-shadow-white"
					>
						<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
							<path d="M9 2a7 7 0 100 14A7 7 0 009 2z" stroke="#f59e0b" stroke-width="1.4" />
							<path d="M9 6v4M9 12v.5" stroke="#f59e0b" stroke-width="1.4" stroke-linecap="round" />
						</svg>
					</div>
					<div>
						<p class="m-0 mb-0.5 font-[Inter,sans-serif] text-[12.5px] font-semibold text-black/88">
							Beta Status
						</p>
						<p class="m-0 font-[Inter,sans-serif] text-[12px] leading-[1.55] text-black/50">
							This is an unstable beta. Features may change or be removed at any time. Not intended
							for production or critical work.
						</p>
					</div>
				</div>

				<div class="flex gap-3 rounded-lg p-3 transition-colors">
					<div
						class="mt-px flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/35 bg-white/50 shadow-sm inset-shadow-sm inset-shadow-white"
					>
						<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
							<path d="M3 9a6 6 0 1012 0A6 6 0 003 9z" stroke="#ef4444" stroke-width="1.4" />
							<path
								d="M9 6v3.5M11.5 12L9 9.5"
								stroke="#ef4444"
								stroke-width="1.4"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
					<div>
						<p class="m-0 mb-0.5 font-[Inter,sans-serif] text-[12.5px] font-semibold text-black/88">
							No Liability
						</p>
						<p class="m-0 font-[Inter,sans-serif] text-[12px] leading-[1.55] text-black/50">
							The Service is provided "as-is" with no warranties. Data loss is possible — back up
							important content. We are not liable for any damages arising from beta use.
						</p>
					</div>
				</div>

				<div class="flex gap-3 rounded-lg p-3 transition-colors">
					<div
						class="mt-px flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/35 bg-white/50 shadow-sm inset-shadow-sm inset-shadow-white"
					>
						<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
							<path
								d="M9 2C5.134 2 2 5.134 2 9s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z"
								stroke="#3b82f6"
								stroke-width="1.4"
							/>
							<path
								d="M6 9l2 2 4-4"
								stroke="#3b82f6"
								stroke-width="1.4"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
					<div>
						<p class="m-0 mb-0.5 font-[Inter,sans-serif] text-[12.5px] font-semibold text-black/88">
							Feedback
						</p>
						<p class="m-0 font-[Inter,sans-serif] text-[12px] leading-[1.55] text-black/50">
							Any feedback you share may be used to improve the Service without compensation. Using
							the beta does not grant any ownership rights over the app or its features.
						</p>
					</div>
				</div>

				<div class="flex gap-3 rounded-lg p-3 transition-colors">
					<div
						class="mt-px flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/35 bg-white/50 shadow-sm inset-shadow-sm inset-shadow-white"
					>
						<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
							<path
								d="M3 3l12 12M15 3L3 15"
								stroke="#10b981"
								stroke-width="1.4"
								stroke-linecap="round"
							/>
						</svg>
					</div>
					<div>
						<p class="m-0 mb-0.5 font-[Inter,sans-serif] text-[12.5px] font-semibold text-black/88">
							No Replication
						</p>
						<p class="m-0 font-[Inter,sans-serif] text-[12px] leading-[1.55] text-black/50">
							You may not use insights from the beta to build competing products or replicate
							Quillium's features, design, or workflows.
						</p>
					</div>
				</div>
			</div>
		</div>

		{#if !submitted}
			<form onsubmit={handleBetaSubmit} class="mb-3 grid gap-3">
				<div class="grid grid-cols-[1fr_auto] gap-3 max-[480px]:grid-cols-1">
					<input
						type="email"
						name="email"
						placeholder="your@email.com"
						bind:value={email}
						required
						class="rounded-lg border border-black/10 bg-white px-3.5 py-2.5 font-[Inter,sans-serif] text-sm text-black/88 transition-[border-color] duration-200 placeholder:text-black/28 focus:border-[#3b82f6] focus:ring-[3px] focus:ring-[rgba(59,130,246,0.1)] focus:outline-none"
						aria-label="Email address"
					/>
					<button type="submit" class="btn-primary" disabled={!hasAgreedToTerms || !email || submitting}>
						{submitting ? 'Signing up…' : 'Sign me up!'}
					</button>
				</div>
				<label
					class="flex items-start gap-2.5 text-left font-[Inter,sans-serif] text-[13px] leading-normal text-black/50"
				>
					<input
						type="checkbox"
						required
						bind:checked={hasAgreedToTerms}
						class="mt-0.5 accent-[#3b82f6]"
						aria-label="I agree to the terms"
					/>
					<span>I agree to the terms above.</span>
				</label>
			</form>
			{#if error}
				<p class="m-0 font-[Inter,sans-serif] text-[12.5px] text-[#ef4444]">{error}</p>
			{:else}
				<p class="m-0 font-[Inter,sans-serif] text-[12.5px] text-black/28">
					We'll send you the app link when it's time to access the beta.
				</p>
			{/if}
		{:else}
			<div class="rounded-xl border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.08)] px-6 py-4.5">
				<p class="m-0 font-[Newsreader,Georgia,serif] text-base text-[#15803d] italic">
					You're on the waitlist. Check your email when it's time to join the beta.
				</p>
			</div>
		{/if}
</section>

<style>
	.btn-primary:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}
</style>
