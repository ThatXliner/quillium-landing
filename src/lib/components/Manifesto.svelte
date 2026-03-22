<!-- ==================== MANIFESTO ==================== -->
<section id="manifesto" class="manifesto">
	<div class="manifesto-inner reveal">
		<p class="section-eyebrow section-eyebrow--centered">The Manifesto</p>

		<h2 class="manifesto-headline">
			Writing tools have always assumed you know where you're going.
		</h2>

		<p class="manifesto-subtitle">They don't. Neither do you. That's not a flaw.</p>

		<div class="manifesto-cards">
			<div
				class="manifesto-card gap-2 rounded-lg bg-white/50 shadow-md inset-shadow-sm inset-shadow-white backdrop-blur-md transition-colors hover:bg-gray-50/30 hover:text-black/70"
			>
				<h3>The Problem</h3>
				<p>
					Writing is a web of attempts — a tangle of better and worse, a conversation between
					drafts. Every blank page pretending otherwise is lying to you.
				</p>
			</div>
			<div
				class="manifesto-card gap-2 rounded-lg bg-white/50 shadow-md inset-shadow-sm inset-shadow-white backdrop-blur-md transition-colors hover:bg-gray-50/30 hover:text-black/70"
			>
				<h3>Who It's For</h3>
				<ul>
					<li>
						<span class="bullet"></span>
						Novelists writing the same chapter four different ways
					</li>
					<li>
						<span class="bullet"></span>
						Essayists testing three theses before committing to one
					</li>
					<li>
						<span class="bullet"></span>
						Memoirists still reshaping sentences at 2am
					</li>
				</ul>
			</div>
		</div>

		<div class="manifesto-divider"></div>

		<p class="manifesto-quote">
			"We built an editor that treats non-linearity as a
			<span class="highlight">feature</span>, not a problem to manage."
		</p>

		<p class="manifesto-closing">
			AI as a second voice in the room — one that annotates rather than interrupts, responds to your
			text rather than pulling you away from it. Warm. Calm. Focused. Because the writing is the
			product.
		</p>
	</div>
</section>

<style>
	.manifesto {
		text-align: center;
		padding: 8rem 2rem;
	}
	.manifesto-inner {
		max-width: 800px;
		margin: 0 auto;
	}
	.manifesto-headline {
		font-family: 'Newsreader', Georgia, serif;
		font-size: clamp(1.8rem, 4vw, 2.8rem);
		font-weight: 400;
		font-style: italic;
		line-height: 1.25;
		color: rgba(0, 0, 0, 0.88);
		margin: 0 0 1.25rem 0;
	}
	.manifesto-subtitle {
		font-size: 1.05rem;
		color: rgba(0, 0, 0, 0.28);
		margin: 0 0 3.5rem 0;
		line-height: 1.6;
	}

	/* ── Cards ── */
	.manifesto-cards {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.25rem;
		margin-bottom: 4rem;
		text-align: left;
	}
	@media (max-width: 768px) {
		.manifesto-cards {
			grid-template-columns: 1fr;
		}
	}
	.manifesto-card {
		padding: 2rem;
	}
	.manifesto-card h3 {
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: rgba(0, 0, 0, 0.88);
		margin: 0 0 1.25rem 0;
	}
	.manifesto-card p {
		font-size: 0.95rem;
		color: rgba(0, 0, 0, 0.5);
		line-height: 1.75;
		margin: 0;
	}
	.manifesto-card ul {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 0;
		margin: 0;
	}
	.manifesto-card li {
		font-size: 0.95rem;
		color: rgba(0, 0, 0, 0.5);
		line-height: 1.6;
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
	}
	.bullet {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #fcbc05;
		flex-shrink: 0;
		margin-top: 0.45em;
	}

	/* ── Divider + Quote ── */
	.manifesto-divider {
		width: 100%;
		max-width: 800px;
		height: 1px;
		background: rgba(0, 0, 0, 0.06);
		margin: 0 auto 4rem;
	}
	.manifesto-quote {
		font-family: 'Newsreader', Georgia, serif;
		font-size: clamp(1.3rem, 2.5vw, 1.65rem);
		font-style: italic;
		line-height: 1.6;
		color: rgba(0, 0, 0, 0.88);
		margin: 0 0 2rem 0;
		max-width: 700px;
		margin-left: auto;
		margin-right: auto;
	}
	.highlight {
		color: #fcbc05;
	}
	.manifesto-closing {
		font-size: 0.95rem;
		color: rgba(0, 0, 0, 0.5);
		line-height: 1.8;
		max-width: 640px;
		margin: 0 auto;
	}
</style>
