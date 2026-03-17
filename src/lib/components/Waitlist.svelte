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
<section id="waitlist" class="waitlist-section">
	<div class="waitlist-inner">
		<div class="reveal">
			<div class="waitlist-icon">
				<svg width="26" height="26" viewBox="0 0 26 26" fill="none">
					<path
						d="M21 3.5C21 3.5 16.5 6 12.5 11C9.5 15 8 19.5 8 19.5"
						stroke="#3b82f6"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path d="M8 19.5L10.5 17" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" />
					<path
						d="M10.5 17C10.5 17 12.5 20.5 9.5 22.5"
						stroke="#2563eb"
						stroke-width="1.3"
						stroke-linecap="round"
					/>
				</svg>
			</div>
			<h2 class="waitlist-heading">Join the waitlist.</h2>
			<p class="waitlist-sub">
				Quillium is in public beta. Join the waitlist and we'll send you the app link and release
				notes.
			</p>
		</div>

		<div class="reveal reveal-delay-1">
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
	</div>
</section>

<style>
	/* ── Waitlist ── */
	.waitlist-section {
		background: #f7f4ef;
		background-image: radial-gradient(
			circle at 50% 0%,
			rgba(252, 188, 5, 0.07) 0%,
			transparent 60%
		);
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
		margin: 0 0 20px 0;
		max-width: 28rem;
		margin-left: auto;
		margin-right: auto;
	}
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
		border: 1px solid #d6cfc5;
		border-radius: 8px;
		font-family: 'Inter', sans-serif;
		font-size: 14px;
		color: #2c2a27;
		background: white;
		transition: border-color 0.2s;
	}
	.beta-email-input::placeholder {
		color: #a89e94;
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
		color: #5a554f;
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
		color: #a89e94;
		font-family: 'Inter', sans-serif;
		margin: 0;
	}
	.waitlist-terms {
		margin-top: 0;
		padding: 16px;
		border: 1px solid #d6cfc5;
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.7);
		text-align: left;
		margin-bottom: 20px;
	}
	.waitlist-terms-title {
		font-family: 'Inter', sans-serif;
		font-size: 13px;
		font-weight: 600;
		color: #2c2a27;
		margin: 0 0 12px 0;
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
	.term-link {
		color: #3b82f6;
		text-decoration: none;
	}
	.term-link:hover {
		text-decoration: underline;
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
