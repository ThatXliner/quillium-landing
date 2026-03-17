<script lang="ts">
	let hasAgreedToTerms = false;

	function handleWaitlistSubmit(e: Event) {
		e.preventDefault();
		const form = document.getElementById('waitlist-form');
		const success = document.getElementById('waitlist-success');
		if (hasAgreedToTerms && form && success) {
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
<section id="waitlist" class="waitlist-section">
	<div class="waitlist-inner">
		<div class="reveal">
			<div class="waitlist-icon">
				<svg width="26" height="26" viewBox="0 0 26 26" fill="none">
					<path d="M21 3.5C21 3.5 16.5 6 12.5 11C9.5 15 8 19.5 8 19.5" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
					<path d="M8 19.5L10.5 17" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" />
					<path d="M10.5 17C10.5 17 12.5 20.5 9.5 22.5" stroke="#2563eb" stroke-width="1.3" stroke-linecap="round" />
				</svg>
			</div>
			<h2 class="waitlist-heading">Be among the first<br />writers in.</h2>
			<p class="waitlist-sub">Quillium is in public beta. Join the waitlist and we'll reach out when we're ready for you.</p>
		</div>

		<div class="reveal reveal-delay-1">
			<p class="waitlist-terms-title">Public Beta Terms</p>
			<div class="waitlist-terms" aria-label="Public Beta terms">
				<div class="terms-grid">
					<div class="term-card">
						<div class="term-icon">
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
								<path d="M9 2L11 7H16L12 10.5L13.5 16L9 13L4.5 16L6 10.5L2 7H7L9 2Z" stroke="#f59e0b" stroke-width="1.4" stroke-linejoin="round" />
							</svg>
						</div>
						<div>
							<p class="term-heading">Beta Status</p>
							<p class="term-body">Features are incomplete and may change. Documents may not migrate cleanly between versions. Not for production use.</p>
						</div>
					</div>

					<div class="term-card">
						<div class="term-icon">
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
								<path d="M9 2a7 7 0 100 14A7 7 0 009 2z" stroke="#ef4444" stroke-width="1.4" />
								<path d="M9 6v4M9 12v.5" stroke="#ef4444" stroke-width="1.4" stroke-linecap="round" />
							</svg>
						</div>
						<div>
							<p class="term-heading">Data Loss Risk</p>
							<p class="term-body">Data loss is possible. Do not use Quillium for critical or irreplaceable work during the beta period.</p>
						</div>
					</div>

					<div class="term-card">
						<div class="term-icon">
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
								<rect x="2" y="5" width="14" height="10" rx="2" stroke="#8b5cf6" stroke-width="1.4" />
								<path d="M6 5V4a3 3 0 016 0v1" stroke="#8b5cf6" stroke-width="1.4" stroke-linecap="round" />
							</svg>
						</div>
						<div>
							<p class="term-heading">Confidentiality</p>
							<p class="term-body">Don't share screenshots, recordings, or roadmap details publicly. Keep feedback within official beta channels.</p>
						</div>
					</div>

					<div class="term-card">
						<div class="term-icon">
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
								<path d="M9 2C5.134 2 2 5.134 2 9s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z" stroke="#3b82f6" stroke-width="1.4" />
								<path d="M6 9l2 2 4-4" stroke="#3b82f6" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						</div>
						<div>
							<p class="term-heading">Participation</p>
							<p class="term-body">Active use and honest feedback are expected. Inactive accounts may be removed. Feedback may be used to improve the product without compensation.</p>
						</div>
					</div>

					<div class="term-card">
						<div class="term-icon">
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
								<path d="M3 4h12M3 9h12M3 14h7" stroke="#6b7280" stroke-width="1.4" stroke-linecap="round" />
							</svg>
						</div>
						<div>
							<p class="term-heading">License</p>
							<p class="term-body">You receive a limited, non-transferable license for beta evaluation only. No reverse engineering, cloning, or scraping.</p>
						</div>
					</div>

					<div class="term-card">
						<div class="term-icon">
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
								<circle cx="9" cy="9" r="7" stroke="#10b981" stroke-width="1.4" />
								<path d="M9 5v5l3 2" stroke="#10b981" stroke-width="1.4" stroke-linecap="round" />
							</svg>
						</div>
						<div>
							<p class="term-heading">Termination</p>
							<p class="term-body">Access may be suspended at any time for any reason. Upon termination, access to documents may be removed.</p>
						</div>
					</div>
				</div>
			</div>
			<form id="waitlist-form" onsubmit={handleWaitlistSubmit} class="waitlist-form">
				<label class="waitlist-consent">
					<input type="checkbox" required bind:checked={hasAgreedToTerms} aria-label="I agree to the Public Beta terms" />
					<span>I agree to the Public Beta terms above.</span>
				</label>
				<button type="submit" class="btn-primary btn-large" disabled={!hasAgreedToTerms}>Join Waitlist</button>
			</form>
			<p class="waitlist-privacy">No spam. No marketing cadences. Just a quiet note when the doors open.</p>
		</div>

		<div id="waitlist-success" class="hidden waitlist-success reveal">
			<p>You're on the list. We'll be in touch soon.</p>
		</div>
	</div>
</section>

<style>
	/* ── Waitlist ── */
	.waitlist-section {
		background: #f7f4ef;
		background-image: radial-gradient(circle at 50% 0%, rgba(252, 188, 5, 0.07) 0%, transparent 60%);
		padding: 64px 24px;
	}
	@media (min-width: 768px) {
		.waitlist-section {
			padding: 96px 24px;
		}
	}
	.waitlist-inner {
		max-width: 36rem;
		margin: 0 auto;
		text-align: center;
	}
	.waitlist-icon {
		width: 52px;
		height: 52px;
		border-radius: 14px;
		background: rgba(59, 130, 246, 0.08);
		border: 1px solid rgba(59, 130, 246, 0.18);
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 24px auto;
	}
	.waitlist-heading {
		font-family: 'Lora', Georgia, serif;
		font-size: clamp(1.9rem, 5vw, 3rem);
		font-weight: 700;
		line-height: 1.2;
		color: #1e1c1a;
		margin: 0 0 16px 0;
	}
	.waitlist-sub {
		font-size: 16px;
		color: #5a554f;
		line-height: 1.75;
		margin: 0 0 32px 0;
		max-width: 28rem;
		margin-left: auto;
		margin-right: auto;
	}
	.waitlist-form {
		display: grid;
		gap: 14px;
		margin-bottom: 16px;
		justify-items: center;
	}
	.waitlist-privacy {
		font-size: 12.5px;
		color: #a89e94;
		font-family: 'Inter', sans-serif;
		margin: 0;
	}
	.waitlist-consent {
		padding-top: 12px;
		display: flex;
		align-items: flex-start;
		gap: 10px;
		text-align: left;
		font-family: 'Inter', sans-serif;
		font-size: 13px;
		color: #5a554f;
		line-height: 1.5;
	}
	.waitlist-consent input {
		margin-top: 2px;
		accent-color: #3b82f6;
	}
	.waitlist-form button:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}
	.waitlist-terms {
		margin-top: 18px;
		padding: 16px;
		border: 1px solid #d6cfc5;
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.7);
		text-align: left;
	}
	.waitlist-terms-title {
		font-family: 'Inter', sans-serif;
		font-size: 13px;
		font-weight: 600;
		color: #2c2a27;
		margin: 18px 0 8px 0;
		text-align: left;
	}
	/* ── Terms grid ── */
	.terms-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2px;
	}
	@media (min-width: 480px) {
		.terms-grid {
			grid-template-columns: 1fr 1fr;
		}
	}
	.term-card {
		display: flex;
		gap: 12px;
		padding: 12px;
		border-radius: 8px;
		transition: background 0.15s;
	}
	.term-card:hover {
		background: rgba(44, 42, 39, 0.03);
	}
	.term-icon {
		flex-shrink: 0;
		width: 32px;
		height: 32px;
		border-radius: 8px;
		background: #f7f5f2;
		border: 1px solid #e8e3db;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 1px;
	}
	.term-heading {
		margin: 0 0 3px 0;
		font-family: 'Inter', sans-serif;
		font-size: 12.5px;
		font-weight: 600;
		color: #2c2a27;
	}
	.term-body {
		margin: 0;
		font-family: 'Inter', sans-serif;
		font-size: 12px;
		color: #6b6560;
		line-height: 1.55;
	}
	.waitlist-success {
		background: rgba(34, 197, 94, 0.08);
		border: 1px solid rgba(34, 197, 94, 0.25);
		border-radius: 12px;
		padding: 18px 24px;
		margin-top: 16px;
	}
	.waitlist-success p {
		font-family: 'Lora', Georgia, serif;
		font-style: italic;
		font-size: 16px;
		color: #15803d;
		margin: 0;
	}
</style>
