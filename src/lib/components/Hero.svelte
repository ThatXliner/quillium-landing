<!-- ==================== HERO ==================== -->
<section class="hero">
	<div class="hero-logo">
		<img src="/logo.svg" alt="Quillium mark" width="96" height="96" />
	</div>

	<h1 class="reveal reveal-delay-1 hero-headline">Writing isn't a straight line.</h1>

	<p class="reveal reveal-delay-2 hero-sub">
		For the novelist who writes the same chapter four different ways.
		For the essayist who doesn't know the thesis until page three.
		Quillium keeps every version, so nothing is ever lost.
	</p>

	<div class="reveal reveal-delay-3 hero-ctas">
		<a href="#waitlist" class="btn-primary">Join the Waitlist</a>
		<a href="#features" class="btn-secondary">See how it works</a>
	</div>

	<div class="reveal reveal-delay-4 trust-line">
		<span>Built for writers, not content creators</span>
		<div class="trust-dots">
			<span style="background: #3b82f6;"></span>
			<span style="background: #a855f7;"></span>
			<span style="background: #22c55e;"></span>
			<span style="background: #fcbc05;"></span>
		</div>
	</div>
</section>

<style>
	.hero {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 8rem 2rem 6rem;
		text-align: center;
	}

	.hero-logo {
		width: 120px;
		height: 120px;
		border-radius: 32px;
		background: radial-gradient(circle at 40% 35%, #eceef2, #cdd1d9);
		border: 1.5px solid rgba(255, 255, 255, 0.35);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 3rem;
		transition: transform 400ms cubic-bezier(0.33, 0, 0.2, 1);
	}
	.hero-logo:hover {
		transform: scale(1.05) rotate(-2deg);
	}
	.hero-logo img {
		width: 96px;
		height: 96px;
	}

	.hero-headline {
		font-family: 'Newsreader', Georgia, serif;
		font-size: clamp(2.8rem, 6vw, 4.5rem);
		font-weight: 400;
		font-style: italic;
		letter-spacing: -0.03em;
		line-height: 1.15;
		max-width: 700px;
		color: rgba(0, 0, 0, 0.88);
		margin: 0 0 1.5rem 0;
	}

	.hero-sub {
		font-size: 1.1rem;
		color: rgba(0, 0, 0, 0.5);
		max-width: 520px;
		line-height: 1.7;
		margin: 0 0 3rem 0;
	}

	.hero-ctas {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.btn-secondary {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.85rem 2rem;
		background: radial-gradient(circle at 30% 25%, #eef0f3, #dfe2e8);
		color: rgba(0, 0, 0, 0.88);
		border: 1px solid rgba(255, 255, 255, 0.35);
		border-radius: 100px;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		text-decoration: none;
		transition: all 300ms ease;
	}
	.btn-secondary:hover {
		transform: translateY(-1px);
	}

	.trust-line {
		display: flex;
		align-items: center;
		gap: 2rem;
		margin-top: 4rem;
		padding-top: 3rem;
		border-top: 1px solid rgba(0, 0, 0, 0.04);
	}
	.trust-line span {
		font-size: 0.7rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: rgba(0, 0, 0, 0.28);
	}
	.trust-dots {
		display: flex;
		gap: 0.5rem;
	}
	.trust-dots span {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		letter-spacing: 0;
		text-transform: none;
	}

	@media (max-width: 768px) {
		.trust-line {
			flex-direction: column;
			gap: 1rem;
		}
	}
</style>
