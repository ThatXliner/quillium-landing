<!-- ==================== MANIFESTO ==================== -->
<section id="manifesto" class="manifesto-section">
	<div class="manifesto-inner">
		<div class="reveal manifesto-eyebrow">
			<p class="section-eyebrow section-eyebrow--centered">The Manifesto</p>
		</div>

		<div class="reveal manifesto-intro">
			<p class="pull-quote">
				"Writing tools have always assumed you know where you're going. They give you a blank page
				and expect a straight line from start to finish."
			</p>
		</div>

		<div class="manifesto-grid">
			<div class="reveal manifesto-card">
				<p class="manifesto-label">The Problem</p>
				<p class="manifesto-prose">
					Writing isn't a straight line. It's a web of attempts, a tangle of better and worse, and
					a conversation between drafts.
				</p>
			</div>

			<div class="reveal manifesto-card">
				<p class="manifesto-label">Who It's For</p>
				<ul class="manifesto-list">
					<li>The novelist writing the same chapter four different ways.</li>
					<li>The essayist testing multiple theses before choosing one.</li>
					<li>The memoirist still reshaping sentences at 2am.</li>
				</ul>
			</div>

			<div class="reveal manifesto-card manifesto-card--wide">
				<p class="manifesto-label">What We Built</p>
				<p class="pull-quote pull-quote--accent">
					"Quillium was built for the tangle. We built an editor that treats non-linearity as a
					feature, not a problem to manage."
				</p>
				<p class="manifesto-prose">
					AI here isn't a distraction. It's a second voice in the room that annotates rather than
					interrupts and responds to your text rather than pulling you away from it.
				</p>
				<p class="manifesto-prose">
					We kept it warm because writing is personal. We kept it calm because flow is fragile. We
					kept it focused because the writing is the product and everything else is scaffolding.
				</p>
			</div>
		</div>

		<div class="reveal manifesto-closing">
			<p class="pull-quote pull-quote--closing">
				"You have something to say. We built a tool worthy of the work."
			</p>
			<p class="manifesto-attribution">— From the Quillium Manifesto</p>
		</div>
	</div>
</section>

<style>
	/* ── Manifesto ── */
	.manifesto-section {
		background: #f0ede8;
		background-image:
			radial-gradient(circle at 20% 80%, rgba(252, 188, 5, 0.04) 0%, transparent 50%),
			radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.04) 0%, transparent 50%);
		padding: 96px 24px;
	}
	@media (min-width: 768px) {
		.manifesto-section {
			padding: 144px 24px;
		}
	}
	.manifesto-inner {
		max-width: 62rem;
		margin: 0 auto;
	}
	.manifesto-eyebrow {
		margin-bottom: 36px;
	}
	.manifesto-intro {
		margin-bottom: 28px;
	}
	.pull-quote {
		font-family: 'Lora', Georgia, serif;
		font-style: italic;
		line-height: 1.6;
		color: #3d3830;
		margin: 0;
		font-size: clamp(1.15rem, 3vw, 1.7rem);
	}
	.pull-quote--accent {
		border-left: 3px solid #fcbc05;
		padding-left: 1rem;
		font-size: clamp(1.05rem, 2.4vw, 1.4rem);
		color: #2c2a27;
		margin: 0 0 16px 0;
	}
	.pull-quote--closing {
		text-align: center;
		font-size: clamp(1.1rem, 2.5vw, 1.45rem);
		color: #3d3830;
	}
	.manifesto-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;
		margin-bottom: 48px;
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
		padding: 20px;
	}
	@media (min-width: 768px) {
		.manifesto-card--wide {
			grid-column: 1 / -1;
		}
	}
	.manifesto-label {
		font-family: 'Inter', sans-serif;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #6b6560;
		margin: 0 0 12px 0;
	}
	.manifesto-prose {
		font-family: 'Lora', Georgia, serif;
		font-size: 16px;
		line-height: 1.75;
		color: #4d4742;
		margin: 0 0 1.2em 0;
	}
	.manifesto-prose:last-child {
		margin-bottom: 0;
	}
	.manifesto-list {
		margin: 0;
		padding-left: 20px;
		display: grid;
		gap: 10px;
		font-family: 'Lora', Georgia, serif;
		font-size: 16px;
		line-height: 1.65;
		color: #4d4742;
	}
	.manifesto-closing {
		text-align: center;
	}
	.manifesto-attribution {
		font-size: 13px;
		color: #a89e94;
		font-family: 'Inter', sans-serif;
		letter-spacing: 0.04em;
		margin-top: 20px;
	}
</style>
