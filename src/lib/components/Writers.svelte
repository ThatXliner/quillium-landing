<!-- ==================== WHO IT'S FOR ==================== -->
<section id="for-writers" class="writers-section">
	<div class="writers-inner">
		<div class="reveal writers-header">
			<p class="section-eyebrow">Who it's for</p>
			<h2 class="section-heading">Built for serious writers.</h2>
			<p class="writers-subhead">Not project managers. Not "content creators." Writers who live inside their sentences.</p>
		</div>

		<div class="writers-list">
			<div class="reveal writer-card">
				<div class="writer-icon-wrap">
					<svg width="22" height="22" viewBox="0 0 22 22" fill="none">
						<path d="M11 5C11 5 8 4 4 4.5V17C8 16.5 11 17.5 11 17.5" stroke="#5a554f" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M11 5C11 5 14 4 18 4.5V17C14 16.5 11 17.5 11 17.5" stroke="#5a554f" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
						<line x1="11" y1="5" x2="11" y2="17.5" stroke="#5a554f" stroke-width="1.2" stroke-linecap="round" />
					</svg>
				</div>
				<div class="writer-content">
					<h3 class="writer-name">The Novelist</h3>
					<p class="writer-bio">You've written the same chapter four different ways. One in the morning, one at night. One with the character knowing, one without. Each version is different — not better or worse, just differently weighted. Quillium keeps them all. You decide which path the story takes — later, when you know more.</p>
				</div>
			</div>

			<div class="writer-divider"></div>

			<div class="reveal reveal-delay-1 writer-card">
				<div class="writer-icon-wrap">
					<svg width="22" height="22" viewBox="0 0 22 22" fill="none">
						<path d="M14 4L18 8L8 18L4 18L4 14L14 4Z" stroke="#5a554f" stroke-width="1.4" stroke-linejoin="round" />
						<line x1="11" y1="7" x2="15" y2="11" stroke="#5a554f" stroke-width="1.2" stroke-linecap="round" />
						<line x1="4" y1="21" x2="18" y2="21" stroke="#5a554f" stroke-width="1.3" stroke-linecap="round" />
					</svg>
				</div>
				<div class="writer-content">
					<h3 class="writer-name">The Essayist</h3>
					<p class="writer-bio">You can't commit to a thesis until you've argued three of them. The essay isn't the argument you planned — it's the argument you discovered. Quillium lets you pursue three theses at once, branch at the point of divergence, and see which argument earns its conclusion. No overwriting. No backtracking. Just three threads, alive at once.</p>
				</div>
			</div>

			<div class="writer-divider"></div>

			<div class="reveal reveal-delay-2 writer-card">
				<div class="writer-icon-wrap">
					<svg width="22" height="22" viewBox="0 0 22 22" fill="none">
						<circle cx="11" cy="11" r="7.5" stroke="#5a554f" stroke-width="1.4" />
						<path d="M11 7V11L13.5 13.5" stroke="#5a554f" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
						<line x1="8" y1="3" x2="14" y2="3" stroke="#5a554f" stroke-width="1.3" stroke-linecap="round" />
					</svg>
				</div>
				<div class="writer-content">
					<h3 class="writer-name">The Memoirist</h3>
					<!-- <p class="writer-bio">You rewrite sentences until 2am and still aren't sure you've gotten it. Memory is approximate, and the sentence has to hold the approximation without collapsing it. Quillium's AI doesn't correct you — it works alongside you, noting a verb that's too hard, a clause that's closing too soon. The words remain yours.</p> -->
					<p class="writer-bio">You rewrite sentences until 2am and still aren't sure you've gotten it. Memory is approximate, and the sentence has to hold the approximation without collapsing it. Quillium lets you hold every version side by side — noting a verb that's too hard, a clause that's closing too soon. The words remain yours.</p>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	/* ── Writers ── */
	.writers-section {
		background: #faf9f7;
		padding: 56px 24px;
	}
	@media (min-width: 768px) {
		.writers-section {
			padding: 80px 24px;
		}
	}
	.writers-inner {
		max-width: 64rem;
		margin: 0 auto;
	}
	.writers-header {
		margin-bottom: 64px;
		max-width: 32rem;
	}
	.writers-subhead {
		margin-top: 16px;
		font-size: 15.5px;
		color: #5a554f;
		line-height: 1.75;
	}
	.writers-list {
		display: flex;
		flex-direction: column;
	}
	.writer-card {
		display: flex;
		align-items: flex-start;
		gap: 32px;
		padding: 32px 0 32px 24px;
		border-left: 2px solid transparent;
		transition:
			border-color 0.3s,
			background 0.3s;
		border-radius: 0 8px 8px 0;
		max-width: 48rem;
	}
	.writer-card:hover {
		border-left-color: #3b82f6;
		background: rgba(59, 130, 246, 0.03);
	}
	.writer-icon-wrap {
		width: 44px;
		height: 44px;
		border-radius: 10px;
		background: #f7f5f2;
		border: 1px solid #e8e3db;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.writer-name {
		font-family: 'Lora', Georgia, serif;
		font-size: 1.35rem;
		font-weight: 600;
		color: #1e1c1a;
		margin: 0 0 8px 0;
	}
	.writer-bio {
		font-size: 15px;
		color: #5a554f;
		line-height: 1.8;
		margin: 0;
		font-family: 'Inter', sans-serif;
	}
	.writer-divider {
		height: 1px;
		background: #f0ede8;
		max-width: 33rem;
		margin-left: 68px;
	}
</style>
