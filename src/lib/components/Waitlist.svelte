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
			<p class="waitlist-sub">Quillium is in private early access. Join the waitlist and we'll reach out when we're ready for you.</p>
		</div>

		<div class="reveal reveal-delay-1">
			<p class="waitlist-terms-title">Early Access Preview Terms</p>
			<div class="waitlist-terms" aria-label="Early Access Preview terms">
				<div class="waitlist-terms-section">
					<p class="waitlist-terms-heading">Early Access Status</p>
					<ul>
						<li>Quillium is an experimental preview.</li>
						<li>Features are incomplete and may change or be removed at any time.</li>
						<li>Documents may not migrate cleanly between versions.</li>
						<li>Data loss is possible. Do not use it for critical or irreplaceable work.</li>
						<li>Not for production or commercial use.</li>
					</ul>
				</div>
				<div class="waitlist-terms-section">
					<p class="waitlist-terms-heading">Closed Beta &amp; Confidentiality</p>
					<ul>
						<li>Access is invitation-only and non-transferable.</li>
						<li>Do not share screenshots, recordings, internal features, or roadmap details publicly.</li>
						<li>Do not publicly review or discuss the product during beta.</li>
						<li>Keep feedback and discussion within official beta channels.</li>
					</ul>
				</div>
				<div class="waitlist-terms-section">
					<p class="waitlist-terms-heading">Participation Expectations</p>
					<ul>
						<li>Active use and honest feedback are expected.</li>
						<li>You may be removed from the beta if inactive.</li>
						<li>Feedback should be candid, specific, and constructive.</li>
					</ul>
				</div>
				<div class="waitlist-terms-section">
					<p class="waitlist-terms-heading">License</p>
					<ul>
						<li>You are granted a limited, non-exclusive, non-transferable, revocable license to use Quillium only for beta evaluation.</li>
						<li>All rights not expressly granted are reserved.</li>
					</ul>
				</div>
				<div class="waitlist-terms-section">
					<p class="waitlist-terms-heading">Restrictions</p>
					<ul>
						<li>Do not reverse engineer, decompile, or attempt to extract source code.</li>
						<li>Do not recreate, clone, or build derivative tools from Quillium's structure or features.</li>
						<li>Do not scrape, automate access, or probe for vulnerabilities.</li>
						<li>Do not use the product for unlawful purposes.</li>
					</ul>
				</div>
				<div class="waitlist-terms-section">
					<p class="waitlist-terms-heading">Feedback</p>
					<ul>
						<li>Feedback, suggestions, and ideas may be used without restriction or compensation.</li>
						<li>Quillium may independently build features similar to your feedback.</li>
					</ul>
				</div>
				<div class="waitlist-terms-section">
					<p class="waitlist-terms-heading">Termination</p>
					<ul>
						<li>Access may be suspended or revoked at any time, for any reason.</li>
						<li>Upon termination, access to documents may be removed.</li>
					</ul>
				</div>
			</div>
			<form id="waitlist-form" onsubmit={handleWaitlistSubmit} class="waitlist-form">
				<label class="waitlist-consent">
					<input type="checkbox" required bind:checked={hasAgreedToTerms} aria-label="I agree to the Early Access Preview terms" />
					<span>I agree to the Early Access Preview terms above.</span>
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
		padding: 96px 24px;
	}
	@media (min-width: 768px) {
		.waitlist-section {
			padding: 128px 24px;
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
	.waitlist-terms-section {
		margin-top: 14px;
	}
	.waitlist-terms-heading {
		margin: 0 0 6px 0;
		font-family: 'Inter', sans-serif;
		font-size: 12.5px;
		font-weight: 600;
		color: #2c2a27;
	}
	.waitlist-terms ul {
		margin: 0;
		padding-left: 18px;
		display: grid;
		gap: 6px;
	}
	.waitlist-terms li {
		font-family: 'Inter', sans-serif;
		font-size: 12.5px;
		color: #5a554f;
		line-height: 1.5;
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
