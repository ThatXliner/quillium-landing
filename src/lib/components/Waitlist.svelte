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
<section id="waitlist" class="cta-section">
	<div class="cta-card reveal">
		<h2 class="cta-heading">Start writing sideways.</h2>
		<p class="cta-sub">Join the beta. We'll send you the app link and stay out of your way.</p>

		<p class="waitlist-terms-title">Waitlist Terms</p>
		<div class="waitlist-terms" aria-label="Waitlist terms">
			<div class="terms-grid">
				<div class="term-card">
					<div class="term-icon">
						<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
							<path d="M9 2a7 7 0 100 14A7 7 0 009 2z" stroke="#f59e0b" stroke-width="1.4" />
							<path
								d="M9 6v4M9 12v.5"
								stroke="#f59e0b"
								stroke-width="1.4"
								stroke-linecap="round"
							/>
						</svg>
					</div>
					<div>
						<p class="term-heading">Beta Status</p>
						<p class="term-body">
							This is an unstable beta. Features may change or be removed at any time. Not
							intended for production or critical work.
						</p>
					</div>
				</div>

				<div class="term-card">
					<div class="term-icon">
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
						<p class="term-heading">No Liability</p>
						<p class="term-body">
							The Service is provided "as-is" with no warranties. Data loss is possible — back up
							important content. We are not liable for any damages arising from beta use.
						</p>
					</div>
				</div>

				<div class="term-card">
					<div class="term-icon">
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
						<p class="term-heading">Feedback</p>
						<p class="term-body">
							Any feedback you share may be used to improve the Service without compensation.
							Using the beta does not grant any ownership rights over the app or its features.
						</p>
					</div>
				</div>

				<div class="term-card">
					<div class="term-icon">
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
						<p class="term-heading">No Replication</p>
						<p class="term-body">
							You may not use insights from the beta to build competing products or replicate
							Quillium's features, design, or workflows.
						</p>
					</div>
				</div>
			</div>
		</div>

		<form id="beta-form" onsubmit={handleBetaSubmit} class="beta-form">
			<div class="beta-email-group">
				<input
					type="email"
					placeholder="your@email.com"
					bind:value={email}
					required
					class="beta-email-input"
					aria-label="Email address"
				/>
				<button type="submit" class="btn-primary" disabled={!hasAgreedToTerms || !email}
					>Sign me up!</button
				>
			</div>
			<label class="beta-consent">
				<input
					type="checkbox"
					required
					bind:checked={hasAgreedToTerms}
					aria-label="I agree to the terms"
				/>
				<span>I agree to the terms above.</span>
			</label>
		</form>
		<p class="beta-note">We'll send you the app link when it's time to access the beta.</p>
	</div>

	<div id="beta-success" class="beta-success reveal hidden">
		<p>You're on the waitlist. Check your email when it's time to join the beta.</p>
	</div>
</section>

<style>
	.cta-section {
		text-align: center;
		padding: 6rem 2rem 8rem;
	}
	.cta-card {
		max-width: 36rem;
		margin: 0 auto;
	}
	.cta-heading {
		font-family: 'Newsreader', Georgia, serif;
		font-size: clamp(1.9rem, 5vw, 3rem);
		font-weight: 400;
		letter-spacing: -0.01em;
		color: rgba(0, 0, 0, 0.88);
		margin: 0 0 0.75rem 0;
	}
	.cta-sub {
		font-size: 0.95rem;
		color: rgba(0, 0, 0, 0.5);
		margin: 0 0 2rem 0;
		line-height: 1.7;
	}

	/* ── Terms ── */
	.waitlist-terms-title {
		font-family: 'Inter', sans-serif;
		font-size: 13px;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.88);
		margin: 0 0 12px 0;
		text-align: left;
	}
	.waitlist-terms {
		margin-top: 0;
		padding: 16px;
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.5);
		text-align: left;
		margin-bottom: 20px;
	}
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
		background: rgba(0, 0, 0, 0.03);
	}
	.term-icon {
		flex-shrink: 0;
		width: 32px;
		height: 32px;
		border-radius: 8px;
		background: rgba(0, 0, 0, 0.03);
		border: 1px solid rgba(0, 0, 0, 0.06);
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
		color: rgba(0, 0, 0, 0.88);
	}
	.term-body {
		margin: 0;
		font-family: 'Inter', sans-serif;
		font-size: 12px;
		color: rgba(0, 0, 0, 0.5);
		line-height: 1.55;
	}

	/* ── Form ── */
	.beta-form {
		display: grid;
		gap: 12px;
		margin-bottom: 12px;
	}
	.beta-email-group {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 12px;
	}
	@media (max-width: 480px) {
		.beta-email-group {
			grid-template-columns: 1fr;
		}
	}
	.beta-email-input {
		padding: 11px 14px;
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 8px;
		font-family: 'Inter', sans-serif;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.88);
		background: white;
		transition: border-color 0.2s;
	}
	.beta-email-input::placeholder {
		color: rgba(0, 0, 0, 0.28);
	}
	.beta-email-input:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}
	.beta-consent {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		text-align: left;
		font-family: 'Inter', sans-serif;
		font-size: 13px;
		color: rgba(0, 0, 0, 0.5);
		line-height: 1.5;
	}
	.beta-consent input {
		margin-top: 2px;
		accent-color: #3b82f6;
	}
	.beta-form button:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}
	.beta-note {
		font-size: 12.5px;
		color: rgba(0, 0, 0, 0.28);
		font-family: 'Inter', sans-serif;
		margin: 0;
	}
	.beta-success {
		background: rgba(34, 197, 94, 0.08);
		border: 1px solid rgba(34, 197, 94, 0.25);
		border-radius: 12px;
		padding: 18px 24px;
		margin-top: 16px;
		max-width: 36rem;
		margin-left: auto;
		margin-right: auto;
	}
	.beta-success p {
		font-family: 'Newsreader', Georgia, serif;
		font-style: italic;
		font-size: 16px;
		color: #15803d;
		margin: 0;
	}
</style>
