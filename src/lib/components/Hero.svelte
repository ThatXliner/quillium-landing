<!-- ==================== HERO ==================== -->
<section class="hero-section">
	<div class="hero-text">
		<div class="reveal eyebrow-row">
			<span class="status-dot"></span>
			<span class="eyebrow-text">Now accepting early access</span>
		</div>

		<h1 class="reveal reveal-delay-1 hero-headline">
			Writing isn't<br />a straight&nbsp;line.
		</h1>

		<p class="reveal reveal-delay-2 hero-sub">
			For the novelist who writes the same chapter four different ways. For the essayist who can't
			commit to a thesis until they've argued three. Quillium is the editor that treats
			non-linearity as a feature — not a problem to manage.
		</p>

		<div class="reveal reveal-delay-3 cta-row">
			<a href="#waitlist" class="btn-primary btn-large">Join the Waitlist</a>
			<a href="#features" class="btn-ghost">
				Learn more
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="arrow-icon">
					<path
						d="M3 8H13M13 8L9 4M13 8L9 12"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</a>
		</div>
	</div>

	<!-- EDITOR SCREENSHOT -->
	<div class="reveal reveal-delay-4 hero-mockup-container">
		<div class="mockup-wrap">
			<!-- Replace src with actual screenshot -->
			<img
				src=""
				alt="Quillium editor showing branched writing versions"
				class="hero-screenshot"
				width="800"
				height="500"
			/>
		</div>
	</div>

	<!-- Mobile hint -->
	<div class="mobile-hint">
		<p>
			<span class="mobile-hint-accent">Non-linear editing.</span> Multiple versions of every sentence.
			AI that annotates, not interrupts.
		</p>
	</div>
</section>

<style>
	/* ── Hero ── */
	.hero-section {
		padding-top: 112px;
		padding-bottom: 64px;
		padding-left: 24px;
		padding-right: 24px;
		max-width: 72rem;
		margin: 0 auto;
	}
	@media (min-width: 768px) {
		.hero-section {
			padding-top: 144px;
			padding-bottom: 96px;
		}
	}
	.hero-text {
		max-width: 42rem;
	}
	.eyebrow-row {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 28px;
	}
	.eyebrow-text {
		font-size: 13px;
		font-weight: 500;
		color: #6b6560;
		letter-spacing: 0.025em;
	}
	.hero-headline {
		font-family: 'Lora', Georgia, serif;
		font-size: clamp(2.6rem, 6vw, 4.2rem);
		font-weight: 700;
		line-height: 1.12;
		letter-spacing: -0.02em;
		color: #1e1c1a;
		margin: 0 0 24px 0;
	}
	.hero-sub {
		font-size: clamp(1rem, 2vw, 1.175rem);
		color: #5a554f;
		line-height: 1.8;
		max-width: 36rem;
		margin: 0 0 36px 0;
	}
	.cta-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 16px;
		margin-bottom: 56px;
	}

	/* ── Hero screenshot ── */
	.hero-mockup-container {
		display: none;
		position: relative;
	}
	@media (min-width: 768px) {
		.hero-mockup-container {
			display: block;
		}
	}
	.mockup-wrap {
		position: relative;
		max-width: 80rem;
		margin: 0 auto;
	}
	.hero-screenshot {
		width: 100%;
		height: auto;
		border-radius: 12px;
		box-shadow:
			0 20px 60px rgba(44, 42, 39, 0.14),
			0 4px 16px rgba(44, 42, 39, 0.08);
		display: block;
		/* Placeholder background shown until real screenshot is added */
		background: #f7f5f2;
		min-height: 500px;
		object-fit: cover;
	}

	/* Mobile hint */
	.mobile-hint {
		margin-top: 32px;
		padding: 20px;
		border-radius: 12px;
		background: #f7f5f2;
		border: 1px solid #e8e3db;
	}
	@media (min-width: 768px) {
		.mobile-hint {
			display: none;
		}
	}
	.mobile-hint p {
		text-align: center;
		font-size: 14px;
		color: #6b6560;
		font-family: 'Inter', sans-serif;
		margin: 0;
	}
	.mobile-hint-accent {
		font-weight: 600;
		color: #3b82f6;
	}
</style>
