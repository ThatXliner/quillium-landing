<script lang="ts">
	let email = '';
	let hasAgreedToTerms = false;

	function handleBetaSubmit(e: Event) {
		e.preventDefault();
		const form = document.getElementById('beta-form');
		const success = document.getElementById('beta-success');
		if (hasAgreedToTerms && email && form && success) {
			form.style.opacity = '0';
			form.style.transition = 'opacity 0.3s';
			setTimeout(() => {
				form.style.display = 'none';
				success.classList.remove('hidden');
				success.classList.add('visible');
			}, 300);
		}
	}
</script>

<!-- ==================== WAITLIST CTA ==================== -->
<section id="waitlist" class="text-center py-24 px-8">
	<div class="max-w-[36rem] mx-auto reveal">
		<h2 class="font-[Newsreader,Georgia,serif] text-[clamp(1.9rem,5vw,3rem)] font-normal tracking-[-0.01em] text-black/88 mb-3">
			Start writing sideways.
		</h2>
		<p class="text-[0.95rem] text-black/50 mb-8 leading-[1.7]">
			Join the beta. We'll send you the app link and stay out of your way.
		</p>

		<p class="font-[Inter,sans-serif] text-[13px] font-semibold text-black/88 mb-3 text-left">Waitlist Terms</p>
		<div class="p-4 border border-black/8 rounded-[14px] bg-white/50 backdrop-blur-md text-left mb-5" aria-label="Waitlist terms">
			<div class="grid grid-cols-1 min-[480px]:grid-cols-2 gap-0.5">
				<div class="flex gap-3 p-3 rounded-lg transition-colors hover:bg-black/3">
					<div class="shrink-0 w-8 h-8 rounded-lg bg-black/3 border border-black/6 flex items-center justify-center mt-px">
						<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
							<path d="M9 2a7 7 0 100 14A7 7 0 009 2z" stroke="#f59e0b" stroke-width="1.4" />
							<path d="M9 6v4M9 12v.5" stroke="#f59e0b" stroke-width="1.4" stroke-linecap="round" />
						</svg>
					</div>
					<div>
						<p class="m-0 mb-0.5 font-[Inter,sans-serif] text-[12.5px] font-semibold text-black/88">Beta Status</p>
						<p class="m-0 font-[Inter,sans-serif] text-[12px] text-black/50 leading-[1.55]">
							This is an unstable beta. Features may change or be removed at any time. Not
							intended for production or critical work.
						</p>
					</div>
				</div>

				<div class="flex gap-3 p-3 rounded-lg transition-colors hover:bg-black/3">
					<div class="shrink-0 w-8 h-8 rounded-lg bg-black/3 border border-black/6 flex items-center justify-center mt-px">
						<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
							<path d="M3 9a6 6 0 1012 0A6 6 0 003 9z" stroke="#ef4444" stroke-width="1.4" />
							<path d="M9 6v3.5M11.5 12L9 9.5" stroke="#ef4444" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</div>
					<div>
						<p class="m-0 mb-0.5 font-[Inter,sans-serif] text-[12.5px] font-semibold text-black/88">No Liability</p>
						<p class="m-0 font-[Inter,sans-serif] text-[12px] text-black/50 leading-[1.55]">
							The Service is provided "as-is" with no warranties. Data loss is possible — back up
							important content. We are not liable for any damages arising from beta use.
						</p>
					</div>
				</div>

				<div class="flex gap-3 p-3 rounded-lg transition-colors hover:bg-black/3">
					<div class="shrink-0 w-8 h-8 rounded-lg bg-black/3 border border-black/6 flex items-center justify-center mt-px">
						<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
							<path d="M9 2C5.134 2 2 5.134 2 9s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z" stroke="#3b82f6" stroke-width="1.4" />
							<path d="M6 9l2 2 4-4" stroke="#3b82f6" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</div>
					<div>
						<p class="m-0 mb-0.5 font-[Inter,sans-serif] text-[12.5px] font-semibold text-black/88">Feedback</p>
						<p class="m-0 font-[Inter,sans-serif] text-[12px] text-black/50 leading-[1.55]">
							Any feedback you share may be used to improve the Service without compensation.
							Using the beta does not grant any ownership rights over the app or its features.
						</p>
					</div>
				</div>

				<div class="flex gap-3 p-3 rounded-lg transition-colors hover:bg-black/3">
					<div class="shrink-0 w-8 h-8 rounded-lg bg-black/3 border border-black/6 flex items-center justify-center mt-px">
						<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
							<path d="M3 3l12 12M15 3L3 15" stroke="#10b981" stroke-width="1.4" stroke-linecap="round" />
						</svg>
					</div>
					<div>
						<p class="m-0 mb-0.5 font-[Inter,sans-serif] text-[12.5px] font-semibold text-black/88">No Replication</p>
						<p class="m-0 font-[Inter,sans-serif] text-[12px] text-black/50 leading-[1.55]">
							You may not use insights from the beta to build competing products or replicate
							Quillium's features, design, or workflows.
						</p>
					</div>
				</div>
			</div>
		</div>

		<form id="beta-form" onsubmit={handleBetaSubmit} class="grid gap-3 mb-3">
			<div class="grid grid-cols-[1fr_auto] max-[480px]:grid-cols-1 gap-3">
				<input
					type="email"
					placeholder="your@email.com"
					bind:value={email}
					required
					class="py-2.5 px-3.5 border border-black/10 rounded-lg font-[Inter,sans-serif] text-sm text-black/88 bg-white transition-[border-color] duration-200 placeholder:text-black/28 focus:outline-none focus:border-[#3b82f6] focus:ring-[3px] focus:ring-[rgba(59,130,246,0.1)]"
					aria-label="Email address"
				/>
				<button type="submit" class="btn-primary" disabled={!hasAgreedToTerms || !email}>Sign me up!</button>
			</div>
			<label class="flex items-start gap-2.5 text-left font-[Inter,sans-serif] text-[13px] text-black/50 leading-normal">
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
		<p class="text-[12.5px] text-black/28 font-[Inter,sans-serif] m-0">We'll send you the app link when it's time to access the beta.</p>
	</div>

	<div id="beta-success" class="bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.25)] rounded-xl py-4.5 px-6 mt-4 max-w-[36rem] mx-auto reveal hidden">
		<p class="font-[Newsreader,Georgia,serif] italic text-base text-[#15803d] m-0">You're on the waitlist. Check your email when it's time to join the beta.</p>
	</div>
</section>

<style>
	.btn-primary:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}
</style>
