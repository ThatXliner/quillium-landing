<!-- ==================== MANIFESTO ==================== -->
<section id="manifesto" class="manifesto-section">
	<div class="manifesto-inner">
		<div class="reveal manifesto-eyebrow">
			<p class="section-eyebrow section-eyebrow--centered">The Manifesto</p>
		</div>

		<div class="reveal manifesto-quote-1">
			<p class="pull-quote">
				"Writing tools have always assumed you know where you're going. They give you a blank page
				and expect a straight line from start to finish."
			</p>
		</div>

		<div class="reveal manifesto-body-1">
			<p class="manifesto-prose">
				But writing isn't a straight line — it's a web of attempts, a tangle of better and worse,
				a conversation between drafts.
			</p>
			<p class="manifesto-prose">
				We built this for the writers who know the first version is never the only version. For the
				novelist who writes the same chapter four different ways, hoping one of them is right. For
				the essayist who can't commit to a thesis until they've argued three of them. For the
				memoirist who rewrites sentences until 2am and still isn't sure they've gotten it.
			</p>
		</div>

		<div class="reveal manifesto-quote-2">
			<p class="pull-quote pull-quote--accent">
				"Quillium was built for the tangle. We built an editor that treats non-linearity as a
				feature, not a problem to manage."
			</p>
		</div>

		<div class="reveal manifesto-body-2">
			<p class="manifesto-prose">
				Where AI isn't a distraction but a second voice in the room — one that annotates rather
				than interrupts, that responds to your text rather than pulling you away from it.
			</p>
			<p class="manifesto-prose">
				We kept it warm because writing is personal. We kept it calm because flow is fragile. We
				kept it focused because the writing is the product — everything else is scaffolding.
			</p>
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
		max-width: 56rem;
		margin: 0 auto;
	}
	.manifesto-eyebrow {
		margin-bottom: 48px;
	}
	.pull-quote {
		font-family: 'Lora', Georgia, serif;
		font-style: italic;
		line-height: 1.75;
		color: #3d3830;
		margin: 0;
		font-size: clamp(1.25rem, 3.5vw, 1.9rem);
	}
	.pull-quote--accent {
		border-left: 3px solid #fcbc05;
		padding-left: 2rem;
		font-size: clamp(1.15rem, 3vw, 1.65rem);
		color: #2c2a27;
	}
	.pull-quote--closing {
		text-align: center;
		font-size: clamp(1.1rem, 2.5vw, 1.45rem);
		color: #3d3830;
	}
	.manifesto-quote-1 {
		margin-bottom: 64px;
		padding-left: 0;
	}
	@media (min-width: 768px) {
		.manifesto-quote-1 {
			padding-left: 48px;
		}
	}
	.manifesto-body-1 {
		margin-bottom: 64px;
	}
	.manifesto-quote-2 {
		margin-bottom: 64px;
	}
	.manifesto-body-2 {
		margin-bottom: 64px;
		display: grid;
		grid-template-columns: 1fr;
		gap: 40px;
	}
	@media (min-width: 768px) {
		.manifesto-body-2 {
			grid-template-columns: 1fr 1fr;
		}
	}
	.manifesto-prose {
		font-family: 'Lora', Georgia, serif;
		font-size: 17px;
		line-height: 1.9;
		color: #4d4742;
		margin: 0 0 1.2em 0;
	}
	.manifesto-prose:last-child {
		margin-bottom: 0;
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
