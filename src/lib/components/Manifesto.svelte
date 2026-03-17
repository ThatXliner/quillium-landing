<!-- ==================== MANIFESTO ==================== -->
<section id="manifesto" class="manifesto-section">
	<div class="manifesto-inner">
		<div class="reveal manifesto-eyebrow">
			<p class="section-eyebrow section-eyebrow--centered">The Manifesto</p>
		</div>

		<div class="reveal manifesto-lede">
			<p class="lede-text">
				Writing tools have always assumed<br class="lede-br" />
				you know where you're going.
			</p>
			<p class="lede-sub">They don't. Neither do you. That's not a flaw.</p>
		</div>

		<div class="manifesto-grid">
			<div class="reveal manifesto-card">
				<p class="manifesto-label">The Problem</p>
				<p class="manifesto-prose">
					Writing is a web of attempts — a tangle of better and worse, a conversation between drafts.
					Every blank page pretending otherwise is lying to you.
				</p>
			</div>

			<div class="reveal manifesto-card">
				<p class="manifesto-label">Who It's For</p>
				<div class="persona-list">
					<div class="persona">
						<span class="persona-icon">✦</span>
						<span>Novelists writing the same chapter four different ways</span>
					</div>
					<div class="persona">
						<span class="persona-icon">✦</span>
						<span>Essayists testing three theses before committing to one</span>
					</div>
					<div class="persona">
						<span class="persona-icon">✦</span>
						<span>Memoirists still reshaping sentences at 2am</span>
					</div>
				</div>
			</div>
		</div>

		<div class="reveal manifesto-statement">
			<blockquote class="statement-quote">
				"We built an editor that treats non-linearity as a
				<em class="statement-highlight">feature</em>,
				not a problem to manage."
			</blockquote>
			<p class="statement-sub">
				AI as a second voice in the room — one that annotates rather than interrupts,
				responds to your text rather than pulling you away from it.
				Warm. Calm. Focused. Because the writing is the product.
			</p>
		</div>
	</div>
</section>

<style>
	/* ── Manifesto ── */
	.manifesto-section {
		background: #f0ede8;
		background-image:
			radial-gradient(circle at 20% 80%, rgba(252, 188, 5, 0.05) 0%, transparent 50%),
			radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.04) 0%, transparent 50%);
		padding: 64px 24px;
	}
	@media (min-width: 768px) {
		.manifesto-section {
			padding: 96px 24px;
		}
	}
	.manifesto-inner {
		max-width: 62rem;
		margin: 0 auto;
	}
	.manifesto-eyebrow {
		margin-bottom: 36px;
	}

	/* ── Lede ── */
	.manifesto-lede {
		text-align: center;
		margin-bottom: 40px;
	}
	.lede-text {
		font-family: 'Lora', Georgia, serif;
		font-size: clamp(1.5rem, 4vw, 2.4rem);
		font-style: italic;
		line-height: 1.35;
		color: #1e1c1a;
		margin: 0 0 14px 0;
	}
	.lede-br {
		display: none;
	}
	@media (min-width: 560px) {
		.lede-br {
			display: inline;
		}
	}
	.lede-sub {
		font-family: 'Inter', sans-serif;
		font-size: clamp(0.95rem, 2vw, 1.1rem);
		color: #a89e94;
		margin: 0;
		letter-spacing: 0.01em;
	}

	/* ── Cards ── */
	.manifesto-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;
		margin-bottom: 40px;
	}
	@media (min-width: 768px) {
		.manifesto-grid {
			grid-template-columns: 1fr 1fr;
			gap: 20px;
		}
	}
	.manifesto-card {
		border: 1px solid #d6cfc5;
		background: rgba(255, 255, 255, 0.6);
		border-radius: 16px;
		padding: 24px;
	}
	.manifesto-label {
		font-family: 'Inter', sans-serif;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #6b6560;
		margin: 0 0 14px 0;
	}
	.manifesto-prose {
		font-family: 'Lora', Georgia, serif;
		font-size: 16px;
		line-height: 1.75;
		color: #4d4742;
		margin: 0;
	}

	/* ── Persona list ── */
	.persona-list {
		display: grid;
		gap: 12px;
	}
	.persona {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		font-family: 'Lora', Georgia, serif;
		font-size: 15px;
		line-height: 1.55;
		color: #4d4742;
	}
	.persona-icon {
		color: #fcbc05;
		font-size: 10px;
		margin-top: 5px;
		flex-shrink: 0;
	}

	/* ── Statement ── */
	.manifesto-statement {
		border-top: 1px solid #d6cfc5;
		padding-top: 40px;
		text-align: center;
		max-width: 48rem;
		margin: 0 auto;
	}
	.statement-quote {
		font-family: 'Lora', Georgia, serif;
		font-style: italic;
		font-size: clamp(1.2rem, 3vw, 1.65rem);
		line-height: 1.5;
		color: #2c2a27;
		margin: 0 0 20px 0;
		quotes: none;
	}
	.statement-highlight {
		color: #2563eb;
		font-style: italic;
		font-weight: 600;
	}
	.statement-sub {
		font-family: 'Inter', sans-serif;
		font-size: 15px;
		line-height: 1.75;
		color: #6b6560;
		margin: 0;
	}
</style>
