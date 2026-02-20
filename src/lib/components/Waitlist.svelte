<script lang="ts">
	function handleWaitlistSubmit(e: Event) {
		e.preventDefault();
		const email = (document.getElementById('waitlist-email') as HTMLInputElement)?.value;
		const form = document.getElementById('waitlist-form');
		const success = document.getElementById('waitlist-success');
		if (email && email.includes('@') && form && success) {
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
			<p class="waitlist-sub">Quillium is in private early access. Leave your email and we'll reach out when we're ready for you.</p>
		</div>

		<div class="reveal reveal-delay-1">
			<form id="waitlist-form" onsubmit={handleWaitlistSubmit} class="waitlist-form">
				<input
					type="email"
					id="waitlist-email"
					class="waitlist-input"
					placeholder="your@email.com"
					required
					aria-label="Email address"
				/>
				<button type="submit" class="btn-primary btn-large">Join Waitlist</button>
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
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 16px;
	}
	@media (min-width: 640px) {
		.waitlist-form {
			flex-direction: row;
		}
	}
	.waitlist-input {
		background: #fefefe;
		border: 1px solid #d6cfc5;
		border-radius: 9999px;
		padding: 12px 20px;
		font-family: 'Inter', sans-serif;
		font-size: 15px;
		color: #2c2a27;
		outline: none;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
		flex: 1;
	}
	.waitlist-input:focus {
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
	}
	.waitlist-input::placeholder {
		color: #a89e94;
	}
	.waitlist-privacy {
		font-size: 12.5px;
		color: #a89e94;
		font-family: 'Inter', sans-serif;
		margin: 0;
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
