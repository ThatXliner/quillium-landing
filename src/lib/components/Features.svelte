<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let slide0 = 0;
	let slide1 = 0;
	let slide2 = 0;

	const INTERVAL = 4000;
	let timers: ReturnType<typeof setInterval>[] = [];

	function startTimer(set: (n: number) => void, count: number) {
		let i = 0;
		return setInterval(() => {
			i = (i + 1) % count;
			set(i);
		}, INTERVAL);
	}

	onMount(() => {
		timers = [
			startTimer((v) => (slide0 = v), 3),
			startTimer((v) => (slide1 = v), 3),
			startTimer((v) => (slide2 = v), 3),
		];
	});

	onDestroy(() => timers.forEach(clearInterval));

	function goTo(which: 0 | 1 | 2, idx: number) {
		clearInterval(timers[which]);
		if (which === 0) { slide0 = idx; timers[0] = startTimer((v) => (slide0 = v), 3); }
		else if (which === 1) { slide1 = idx; timers[1] = startTimer((v) => (slide1 = v), 3); }
		else { slide2 = idx; timers[2] = startTimer((v) => (slide2 = v), 3); }
	}

	const captions0 = [
		'Two versions of a phrase, side by side',
		'Add a third — pick the best later',
		'Open a nested note on any version',
	];
	const captions1 = [
		'Select text, open the AI panel',
		'Ask a direct question, get a direct answer',
		'See tone tags detected in your selection',
	];
	const captions2 = [
		'Comments anchor to the exact phrase',
		'Reply inline — no separate thread needed',
		'Resolve and move on, cleanly',
	];
</script>

<!-- ==================== FEATURES ==================== -->
<section id="features" class="features-section">
	<div class="features-header reveal">
		<p class="section-eyebrow">What makes it different</p>
		<h2 class="section-heading">The tools your writing actually needs.</h2>
	</div>

	<!-- Feature 1: Branches / Revisions -->
	<div class="reveal feature-row">
		<div class="feature-visual">
			<div class="carousel">
				<div class="carousel-track" style="transform: translateX(-{slide0 * 100}%)">

					<!-- Slide 0: Two versions, picking between them -->
					<div class="carousel-slide">
						<div class="fmock fmock--revision">
							<div class="fmock-doc">
								<div class="fmock-doc-chrome">
									<span class="fmock-filename">chapter-3.qll</span>
								</div>
								<p class="fmock-prose">
									She had been walking for hours when
									<span class="fmock-branch-wrap">
										<span class="fmock-branch fmock-branch--a">the rain began, softly at first,</span>
										<span class="fmock-branch fmock-branch--b">the rain arrived all at once —</span>
									</span>
									then all at once — the way grief tends to arrive, without warning or permission.
								</p>
								<div class="fmock-diff-legend">
									<span class="fmock-diff-dot fmock-diff-dot--a"></span><span class="fmock-diff-label">v1 (original)</span>
									<span class="fmock-diff-dot fmock-diff-dot--b"></span><span class="fmock-diff-label">v2 (active)</span>
								</div>
							</div>
							<div class="fmock-sidebar">
								<div class="fmock-card">
									<div class="fmock-card-label">BRANCHES</div>
									<div class="fmock-pills">
										<div class="fmock-pill fmock-pill--grey">
											<span>v1 — softly at first</span>
											<span class="fmock-pill-x">×</span>
										</div>
										<div class="fmock-pill fmock-pill--purple fmock-pill--active-check">
											<span>v2 — all at once</span>
											<svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
										</div>
									</div>
									<div class="fmock-revision-actions">
										<span class="fmock-action-new">
											<svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M4.5 1.5V7.5M1.5 4.5H7.5" stroke="#3b82f6" stroke-width="1.2" stroke-linecap="round"/></svg>
											New branch
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Slide 1: Third version added, diff view -->
					<div class="carousel-slide">
						<div class="fmock fmock--revision">
							<div class="fmock-doc">
								<div class="fmock-doc-chrome">
									<span class="fmock-filename">chapter-3.qll</span>
									<span class="fmock-diff-badge">diff</span>
								</div>
								<div class="fmock-diff-block">
									<div class="fmock-diff-line fmock-diff-line--neutral">She had been walking for hours when</div>
									<div class="fmock-diff-line fmock-diff-line--removed">
										<span class="fmock-diff-gutter">−</span>
										<span>the rain began, <span class="fmock-diff-mark fmock-diff-mark--removed">softly at first,</span> then all at once —</span>
									</div>
									<div class="fmock-diff-line fmock-diff-line--added">
										<span class="fmock-diff-gutter">+</span>
										<span>the rain <span class="fmock-diff-mark fmock-diff-mark--added">descended cold and sudden,</span> then all at once —</span>
									</div>
									<div class="fmock-diff-line fmock-diff-neutral">the way grief tends to arrive.</div>
								</div>
							</div>
							<div class="fmock-sidebar">
								<div class="fmock-card">
									<div class="fmock-card-label">BRANCHES</div>
									<div class="fmock-pills">
										<div class="fmock-pill fmock-pill--grey">
											<span>v1 — softly at first</span>
											<span class="fmock-pill-x">×</span>
										</div>
										<div class="fmock-pill fmock-pill--purple">
											<span>v2 — all at once</span>
											<span class="fmock-pill-x">×</span>
										</div>
										<div class="fmock-pill fmock-pill--blue fmock-pill--active-check">
											<span>v3 — cold and sudden</span>
											<svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
										</div>
									</div>
									<div class="fmock-stat">3 branches · comparing v1↔v3</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Slide 2: Nested note open on a branch -->
					<div class="carousel-slide">
						<div class="fmock fmock--revision">
							<div class="fmock-doc">
								<div class="fmock-doc-chrome">
									<span class="fmock-filename">chapter-3.qll</span>
									<span class="fmock-nested-badge">nested</span>
								</div>
								<p class="fmock-prose">
									She had been walking for hours when <span class="fmock-underline">the rain descended cold and sudden</span>, then all at once — the way grief tends to arrive, without warning or permission.
								</p>
								<div class="fmock-nested-panel">
									<div class="fmock-nested-header">
										<svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M2 2.5H7M2 4.5H5.5M2 6.5H6.5" stroke="#6b6560" stroke-width="1.1" stroke-linecap="round"/></svg>
										note on v3
									</div>
									<p class="fmock-nested-body">"Cold and sudden" adds a physical jolt — contrast with the emotional weight that follows. Keep.</p>
								</div>
							</div>
							<div class="fmock-sidebar">
								<div class="fmock-card">
									<div class="fmock-card-label">BRANCHES</div>
									<div class="fmock-pills">
										<div class="fmock-pill fmock-pill--grey">
											<span>v1 — softly at first</span>
											<span class="fmock-pill-x">×</span>
										</div>
										<div class="fmock-pill fmock-pill--purple">
											<span>v2 — all at once</span>
											<span class="fmock-pill-x">×</span>
										</div>
										<div class="fmock-pill fmock-pill--blue fmock-pill--active-check">
											<span>v3 — cold and sudden</span>
											<svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
										</div>
									</div>
									<div class="fmock-revision-actions">
										<span class="fmock-action-nested">
											<svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M2 3.5L4.5 6L7 3.5" stroke="#6b6560" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>
											1 note
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

				</div>
				<div class="carousel-footer">
					<p class="carousel-caption">{captions0[slide0]}</p>
					<div class="carousel-dots">
						{#each [0, 1, 2] as i}
							<button class="dot" class:dot--active={slide0 === i} on:click={() => goTo(0, i)} />
						{/each}
					</div>
				</div>
			</div>
		</div>
		<div class="feature-text">
			<div class="feature-icon-wrap" style="background:rgba(59,130,246,0.08);">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
					<circle cx="5" cy="5" r="2.5" stroke="#3b82f6" stroke-width="1.5" />
					<circle cx="5" cy="19" r="2.5" stroke="#3b82f6" stroke-width="1.5" />
					<circle cx="19" cy="12" r="2.5" stroke="#3b82f6" stroke-width="1.5" />
					<path d="M5 7.5V16.5" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" />
					<path d="M5 10C5 10 5 12 8.5 12H16.5" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" />
				</svg>
			</div>
			<h3 class="feature-heading">Write in Branches</h3>
			<p class="feature-lead">Fork any sentence. Keep every version. Navigate your creative decisions like chapters, not mistakes.</p>
			<p class="feature-body">No more "draft 1," "draft 2," "draft FINAL." Your branches live in the document itself — visible, selectable, alive. Switch between them instantly. The one you didn't choose is still there when you need it.</p>
		</div>
	</div>

	<!-- Feature 2: A Second Voice -->
	<div class="reveal feature-row feature-row--reversed">
		<div class="feature-text">
			<div class="feature-icon-wrap" style="background:rgba(168,85,247,0.08);">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
					<path d="M12 3L13.8 8.1L19.2 8.1L14.7 11.4L16.2 16.5L12 13.4L7.8 16.5L9.3 11.4L4.8 8.1L10.2 8.1L12 3Z" stroke="#a855f7" stroke-width="1.5" stroke-linejoin="round" />
				</svg>
			</div>
			<h3 class="feature-heading">A Second Voice</h3>
			<p class="feature-lead">AI that annotates, not interrupts. Ask for feedback, find the right word, get clarity — all without leaving your flow.</p>
			<p class="feature-body">It isn't a chatbot in the corner. It responds to your text right where you are — flagging a passive construction, offering a sharper phrasing, or just confirming that the sentence you struggled over is, actually, right.</p>
			<div class="tag-list">
				<span class="tag tag--purple">Review &amp; revise</span>
				<span class="tag tag--purple">Find the right word</span>
				<span class="tag tag--purple">Tone feedback</span>
				<span class="tag tag--purple">Clarity &amp; conciseness</span>
			</div>
		</div>
		<div class="feature-visual">
			<div class="carousel">
				<div class="carousel-track" style="transform: translateX(-{slide1 * 100}%)">

					<!-- Slide 0: Text selected, AI panel just opened -->
					<div class="carousel-slide">
						<div class="fmock fmock--ai">
							<div class="fmock-ai-panel">
								<div class="fmock-ai-tabs">
									<div class="fmock-ai-tab fmock-ai-tab--active">
										<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 2.5C1.5 2.22 1.72 2 2 2H11C11.28 2 11.5 2.22 11.5 2.5V7.5C11.5 7.78 11.28 8 11 8H8L5.5 10.5V8H2C1.72 8 1.5 7.78 1.5 7.5V2.5Z" stroke="#3b82f6" stroke-width="1.1" stroke-linejoin="round"/></svg>
									</div>
									<div class="fmock-ai-tab">
										<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L7.8 4.3L11 4.3L8.5 6.2L9.4 9.5L6.5 7.6L3.6 9.5L4.5 6.2L2 4.3L5.2 4.3L6.5 1Z" stroke="#6b6560" stroke-width="1" stroke-linejoin="round"/></svg>
									</div>
									<div class="fmock-ai-tab">
										<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8.5 2L11 4.5L4.5 11H2V8.5L8.5 2Z" stroke="#6b6560" stroke-width="1.1" stroke-linejoin="round"/></svg>
									</div>
									<span class="fmock-ai-label">Ask AI</span>
									<div style="flex:1"></div>
									<svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 1.5L7.5 7.5M7.5 1.5L1.5 7.5" stroke="#9c968e" stroke-width="1.1" stroke-linecap="round"/></svg>
								</div>
								<div class="fmock-ai-body">
									<div class="fmock-ai-suggestions">
										<div class="fmock-ai-suggestion-label">Quick actions</div>
										<div class="fmock-ai-chip">Improve this sentence</div>
										<div class="fmock-ai-chip">Is this too passive?</div>
										<div class="fmock-ai-chip">Find a stronger verb</div>
										<div class="fmock-ai-chip">Analyse tone</div>
									</div>
								</div>
								<div class="fmock-ai-footer">
									<div class="fmock-context-quote">
										<span class="fmock-context-label">Selected:</span>
										<span class="fmock-context-text">"the rain began, softly at first, then all at once"</span>
									</div>
									<div class="fmock-ai-input-wrap">
										<span class="fmock-ai-input-text">Ask about selection...</span>
									</div>
									<div class="fmock-ai-send">Send</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Slide 1: Back-and-forth exchange -->
					<div class="carousel-slide">
						<div class="fmock fmock--ai">
							<div class="fmock-ai-panel">
								<div class="fmock-ai-tabs">
									<div class="fmock-ai-tab fmock-ai-tab--active">
										<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 2.5C1.5 2.22 1.72 2 2 2H11C11.28 2 11.5 2.22 11.5 2.5V7.5C11.5 7.78 11.28 8 11 8H8L5.5 10.5V8H2C1.72 8 1.5 7.78 1.5 7.5V2.5Z" stroke="#3b82f6" stroke-width="1.1" stroke-linejoin="round"/></svg>
									</div>
									<div class="fmock-ai-tab">
										<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L7.8 4.3L11 4.3L8.5 6.2L9.4 9.5L6.5 7.6L3.6 9.5L4.5 6.2L2 4.3L5.2 4.3L6.5 1Z" stroke="#6b6560" stroke-width="1" stroke-linejoin="round"/></svg>
									</div>
									<div class="fmock-ai-tab">
										<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8.5 2L11 4.5L4.5 11H2V8.5L8.5 2Z" stroke="#6b6560" stroke-width="1.1" stroke-linejoin="round"/></svg>
									</div>
									<span class="fmock-ai-label">Ask AI</span>
									<div style="flex:1"></div>
									<svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 1.5L7.5 7.5M7.5 1.5L1.5 7.5" stroke="#9c968e" stroke-width="1.1" stroke-linecap="round"/></svg>
								</div>
								<div class="fmock-ai-body fmock-ai-body--chat">
									<div class="fmock-chat-msg fmock-chat-msg--user">Is "began" too weak here?</div>
									<div class="fmock-chat-msg fmock-chat-msg--ai">
										Yes — "began" is tentative where the sentence wants force. Try <span class="fmock-inline-suggestion">arrived</span>, <span class="fmock-inline-suggestion">descended</span>, or <span class="fmock-inline-suggestion">broke</span>.
									</div>
									<div class="fmock-chat-msg fmock-chat-msg--user">What about "broke"? Too violent?</div>
									<div class="fmock-chat-msg fmock-chat-msg--ai">
										Not if you want the contrast with "softly." The tension is the point.
									</div>
								</div>
								<div class="fmock-ai-footer">
									<div class="fmock-context-quote">
										<span class="fmock-context-label">Selected:</span>
										<span class="fmock-context-text">"the rain began, softly at first"</span>
									</div>
									<div class="fmock-ai-input-wrap">
										<span class="fmock-ai-input-text">Reply...</span>
									</div>
									<div class="fmock-ai-send">Send</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Slide 2: Tone analysis panel -->
					<div class="carousel-slide">
						<div class="fmock fmock--ai">
							<div class="fmock-ai-panel">
								<div class="fmock-ai-tabs">
									<div class="fmock-ai-tab fmock-ai-tab--active">
										<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 2.5C1.5 2.22 1.72 2 2 2H11C11.28 2 11.5 2.22 11.5 2.5V7.5C11.5 7.78 11.28 8 11 8H8L5.5 10.5V8H2C1.72 8 1.5 7.78 1.5 7.5V2.5Z" stroke="#3b82f6" stroke-width="1.1" stroke-linejoin="round"/></svg>
									</div>
									<div class="fmock-ai-tab">
										<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L7.8 4.3L11 4.3L8.5 6.2L9.4 9.5L6.5 7.6L3.6 9.5L4.5 6.2L2 4.3L5.2 4.3L6.5 1Z" stroke="#6b6560" stroke-width="1" stroke-linejoin="round"/></svg>
									</div>
									<div class="fmock-ai-tab">
										<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8.5 2L11 4.5L4.5 11H2V8.5L8.5 2Z" stroke="#6b6560" stroke-width="1.1" stroke-linejoin="round"/></svg>
									</div>
									<span class="fmock-ai-label">Tone analysis</span>
									<div style="flex:1"></div>
									<svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 1.5L7.5 7.5M7.5 1.5L1.5 7.5" stroke="#9c968e" stroke-width="1.1" stroke-linecap="round"/></svg>
								</div>
								<div class="fmock-ai-body fmock-ai-body--tone">
									<div class="fmock-tone-row">
										<span class="fmock-tone-tag fmock-tone-tag--amber">Tentative</span>
										<div class="fmock-tone-bar"><div class="fmock-tone-fill" style="width:72%; background:#f59e0b;"></div></div>
										<span class="fmock-tone-pct">72%</span>
									</div>
									<div class="fmock-tone-row">
										<span class="fmock-tone-tag fmock-tone-tag--purple">Melancholic</span>
										<div class="fmock-tone-bar"><div class="fmock-tone-fill" style="width:58%; background:#a855f7;"></div></div>
										<span class="fmock-tone-pct">58%</span>
									</div>
									<div class="fmock-tone-row">
										<span class="fmock-tone-tag fmock-tone-tag--blue">Restrained</span>
										<div class="fmock-tone-bar"><div class="fmock-tone-fill" style="width:44%; background:#3b82f6;"></div></div>
										<span class="fmock-tone-pct">44%</span>
									</div>
									<div class="fmock-tone-note">High tentativeness — consider stronger verbs in this passage.</div>
								</div>
								<div class="fmock-ai-footer">
									<div class="fmock-context-quote">
										<span class="fmock-context-label">Analysed:</span>
										<span class="fmock-context-text">"the rain began, softly at first..."</span>
									</div>
									<div class="fmock-ai-input-wrap">
										<span class="fmock-ai-input-text">Ask about this result...</span>
									</div>
									<div class="fmock-ai-send">Send</div>
								</div>
							</div>
						</div>
					</div>

				</div>
				<div class="carousel-footer">
					<p class="carousel-caption">{captions1[slide1]}</p>
					<div class="carousel-dots">
						{#each [0, 1, 2] as i}
							<button class="dot" class:dot--active={slide1 === i} on:click={() => goTo(1, i)} />
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Feature 3: Annotations -->
	<div class="reveal feature-row">
		<div class="feature-visual">
			<div class="carousel">
				<div class="carousel-track" style="transform: translateX(-{slide2 * 100}%)">

					<!-- Slide 0: Two comments anchored to text -->
					<div class="carousel-slide">
						<div class="fmock fmock--comments">
							<div class="fmock-doc fmock-doc--wide">
								<div class="fmock-doc-chrome">
									<span class="fmock-filename">chapter-7.qll</span>
									<span class="fmock-comment-count">2 comments</span>
								</div>
								<p class="fmock-prose">
									The café had <span class="fmock-highlight-comment">grown quiet</span> by the time she noticed the letter. It was propped against the salt shaker, her name written in handwriting she didn't recognise. <span class="fmock-highlight-yellow">She ordered another coffee she wouldn't finish. The letter stayed where it was.</span>
								</p>
							</div>
							<div class="fmock-sidebar">
								<div class="fmock-card fmock-card--comment">
									<div class="fmock-card-label">COMMENT</div>
									<div class="fmock-anchor">grown quiet</div>
									<div class="fmock-comment-row">
										<div class="fmock-avatar fmock-avatar--e">E</div>
										<div>
											<div class="fmock-comment-meta"><span class="fmock-comment-author">Elena</span><span class="fmock-comment-time">2 min ago</span></div>
											<p class="fmock-comment-body">Love this — much better than "emptied out."</p>
										</div>
									</div>
								</div>
								<div class="fmock-card fmock-card--comment">
									<div class="fmock-card-label">COMMENT</div>
									<div class="fmock-anchor">The letter stayed where it was.</div>
									<div class="fmock-comment-row">
										<div class="fmock-avatar fmock-avatar--e">E</div>
										<div>
											<div class="fmock-comment-meta"><span class="fmock-comment-author">Elena</span><span class="fmock-comment-time">just now</span></div>
											<p class="fmock-comment-body">Best line in the chapter. Don't touch it.</p>
										</div>
									</div>
									<div class="fmock-reply-row">
										<span class="fmock-reply-text">Agreed, keeping it.</span>
										<span class="fmock-reply-send">Reply</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Slide 1: Reply thread sent, timestamp shown -->
					<div class="carousel-slide">
						<div class="fmock fmock--comments">
							<div class="fmock-doc fmock-doc--wide">
								<div class="fmock-doc-chrome">
									<span class="fmock-filename">chapter-7.qll</span>
									<span class="fmock-comment-count">2 comments</span>
								</div>
								<p class="fmock-prose">
									The café had <span class="fmock-highlight-comment">grown quiet</span> by the time she noticed the letter. It was propped against the salt shaker, her name written in handwriting she didn't recognise. <span class="fmock-highlight-yellow">She ordered another coffee she wouldn't finish. The letter stayed where it was.</span>
								</p>
							</div>
							<div class="fmock-sidebar">
								<div class="fmock-card fmock-card--comment">
									<div class="fmock-card-label">COMMENT</div>
									<div class="fmock-anchor">grown quiet</div>
									<div class="fmock-comment-row">
										<div class="fmock-avatar fmock-avatar--e">E</div>
										<div>
											<div class="fmock-comment-meta"><span class="fmock-comment-author">Elena</span><span class="fmock-comment-time">2 min ago</span></div>
											<p class="fmock-comment-body">Love this — much better than "emptied out."</p>
										</div>
									</div>
								</div>
								<div class="fmock-card fmock-card--comment fmock-card--active">
									<div class="fmock-card-label">COMMENT · 1 reply</div>
									<div class="fmock-anchor">The letter stayed where it was.</div>
									<div class="fmock-comment-row">
										<div class="fmock-avatar fmock-avatar--e">E</div>
										<div>
											<div class="fmock-comment-meta"><span class="fmock-comment-author">Elena</span><span class="fmock-comment-time">3 min ago</span></div>
											<p class="fmock-comment-body">Best line in the chapter. Don't touch it.</p>
										</div>
									</div>
									<div class="fmock-reply-thread">
										<div class="fmock-thread-line"></div>
										<div class="fmock-comment-row">
											<div class="fmock-avatar fmock-avatar--you">Y</div>
											<div>
												<div class="fmock-comment-meta"><span class="fmock-comment-author">You</span><span class="fmock-comment-time">just now</span></div>
												<p class="fmock-comment-body">Agreed, keeping it.</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Slide 2: First comment resolved -->
					<div class="carousel-slide">
						<div class="fmock fmock--comments">
							<div class="fmock-doc fmock-doc--wide">
								<div class="fmock-doc-chrome">
									<span class="fmock-filename">chapter-7.qll</span>
									<span class="fmock-comment-count fmock-comment-count--resolved">1 open · 1 resolved</span>
								</div>
								<p class="fmock-prose">
									The café had <span class="">grown quiet</span> by the time she noticed the letter. It was propped against the salt shaker, her name written in handwriting she didn't recognise. <span class="fmock-highlight-yellow">She ordered another coffee she wouldn't finish. The letter stayed where it was.</span>
								</p>
							</div>
							<div class="fmock-sidebar">
								<div class="fmock-card fmock-card--comment fmock-card--resolved">
									<div class="fmock-card-label">COMMENT</div>
									<div class="fmock-anchor fmock-anchor--resolved">grown quiet</div>
									<div class="fmock-comment-row">
										<div class="fmock-avatar fmock-avatar--e">E</div>
										<div>
											<div class="fmock-comment-meta"><span class="fmock-comment-author">Elena</span></div>
											<p class="fmock-comment-body">Love this — much better than "emptied out."</p>
										</div>
									</div>
									<div class="fmock-resolved-badge">
										<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L3.5 7.5L8.5 2" stroke="#10b981" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
										Resolved by you
									</div>
								</div>
								<div class="fmock-card fmock-card--comment fmock-card--active">
									<div class="fmock-card-label">COMMENT · 1 reply</div>
									<div class="fmock-anchor">The letter stayed where it was.</div>
									<div class="fmock-comment-row">
										<div class="fmock-avatar fmock-avatar--e">E</div>
										<div>
											<div class="fmock-comment-meta"><span class="fmock-comment-author">Elena</span><span class="fmock-comment-time">3 min ago</span></div>
											<p class="fmock-comment-body">Best line in the chapter. Don't touch it.</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

				</div>
				<div class="carousel-footer">
					<p class="carousel-caption">{captions2[slide2]}</p>
					<div class="carousel-dots">
						{#each [0, 1, 2] as i}
							<button class="dot" class:dot--active={slide2 === i} on:click={() => goTo(2, i)} />
						{/each}
					</div>
				</div>
			</div>
		</div>
		<div class="feature-text">
			<div class="feature-icon-wrap" style="background:rgba(252,188,5,0.1);">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
					<path d="M4 5C4 4.45 4.45 4 5 4H19C19.55 4 20 4.45 20 5V15C20 15.55 19.55 16 19 16H14L10 20.5V16H5C4.45 16 4 15.55 4 15V5Z" stroke="#d97706" stroke-width="1.5" stroke-linejoin="round" />
					<line x1="8" y1="9" x2="16" y2="9" stroke="#d97706" stroke-width="1.3" stroke-linecap="round" />
					<line x1="8" y1="12" x2="14" y2="12" stroke="#d97706" stroke-width="1.3" stroke-linecap="round" />
				</svg>
			</div>
			<h3 class="feature-heading">Annotations That Belong</h3>
			<p class="feature-lead">Comments, revisions, and suggestions float beside the text they're about. Not buried in a sidebar. Not lost in a thread.</p>
			<p class="feature-body">Every note is anchored to the exact phrase it concerns — spatial and immediate. Scroll past it, and it moves with the text. Resolve it, and it disappears cleanly. The document stays the document.</p>
		</div>
	</div>
</section>

<style>
	/* ── Features ── */
	.features-section {
		padding: 56px 24px;
		max-width: 72rem;
		margin: 0 auto;
	}
	@media (min-width: 768px) {
		.features-section {
			padding: 80px 24px;
		}
	}
	.features-header {
		margin-bottom: 64px;
		max-width: 32rem;
	}
	.feature-row {
		display: grid;
		grid-template-columns: 1fr;
		gap: 48px;
		margin-bottom: 80px;
		align-items: center;
	}
	@media (min-width: 768px) {
		.feature-row {
			grid-template-columns: 1fr 1fr;
			gap: 80px;
		}
		.feature-row--reversed .feature-text {
			order: -1;
		}
	}
	.feature-icon-wrap {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20px;
	}
	.feature-heading {
		font-family: 'Newsreader', Georgia, serif;
		font-size: 1.65rem;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.88);
		margin: 0 0 12px 0;
		line-height: 1.2;
		letter-spacing: -0.01em;
	}
	.feature-lead {
		font-size: 15.5px;
		color: rgba(0, 0, 0, 0.5);
		line-height: 1.8;
		margin: 0 0 16px 0;
	}
	.feature-body {
		font-size: 14px;
		color: rgba(0, 0, 0, 0.35);
		line-height: 1.75;
		margin: 0;
	}
	.tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 20px;
	}
	.tag {
		border-radius: 9999px;
		padding: 3px 11px;
		font-size: 12px;
		font-family: 'Inter', sans-serif;
		font-weight: 500;
	}
	.tag--purple {
		background: rgba(168, 85, 247, 0.08);
		border: 1px solid rgba(168, 85, 247, 0.2);
		color: #7c3aed;
	}

	/* ── Carousel ── */
	.carousel {
		position: relative;
		overflow: hidden;
		border-radius: 10px;
		box-shadow:
			0 8px 32px rgba(44, 42, 39, 0.1),
			0 2px 8px rgba(44, 42, 39, 0.06);
	}
	.carousel-track {
		display: flex;
		transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.carousel-slide {
		min-width: 100%;
		flex-shrink: 0;
	}
	.carousel-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 7px 12px 7px 14px;
		background: #f2f2f2;
		border-top: 1px solid #e0e0e0;
		gap: 8px;
	}
	.carousel-caption {
		font-size: 10.5px;
		color: rgba(0, 0, 0, 0.28);
		margin: 0;
		font-family: 'Inter', sans-serif;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.carousel-dots {
		display: flex;
		gap: 6px;
		flex-shrink: 0;
	}
	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.15);
		border: none;
		cursor: pointer;
		padding: 0;
		transition: background 0.2s, transform 0.2s;
	}
	.dot--active {
		background: #3b82f6;
		transform: scale(1.3);
	}

	/* ── Feature mocks shared ── */
	.fmock {
		overflow: hidden;
		font-family: 'Inter', system-ui, sans-serif;
		-webkit-font-smoothing: antialiased;
		background: #f2f2f2;
	}
	.fmock-doc-chrome {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 6px 10px;
		background: #f8f8f8;
		border-bottom: 1px solid #e8e8e8;
		margin: -20px -22px 14px;
	}
	.fmock-filename {
		font-size: 9.5px;
		font-weight: 600;
		color: #6b6560;
		font-family: 'Inter', monospace;
	}
	.fmock-diff-badge {
		font-size: 8.5px;
		font-weight: 700;
		letter-spacing: 0.06em;
		color: #3b82f6;
		background: rgba(59,130,246,0.1);
		border-radius: 3px;
		padding: 1px 5px;
	}
	.fmock-nested-badge {
		font-size: 8.5px;
		font-weight: 700;
		letter-spacing: 0.06em;
		color: #6b6560;
		background: #e8e3db;
		border-radius: 3px;
		padding: 1px 5px;
	}
	.fmock-comment-count {
		font-size: 9px;
		color: #9c968e;
		margin-left: auto;
	}
	.fmock-comment-count--resolved {
		color: #10b981;
	}

	/* Revision mock */
	.fmock--revision {
		display: grid;
		grid-template-columns: 1fr 168px;
	}
	.fmock-doc {
		background: white;
		padding: 20px 22px;
		border-right: 1px solid #e0e0e0;
		min-width: 0;
		overflow: hidden;
	}
	.fmock-prose {
		font-family: 'Georgia', serif;
		font-size: 12.5px;
		line-height: 1.8;
		color: #1e1c1a;
		margin: 0;
	}
	.fmock-underline {
		border-bottom: 2px solid #6366f1;
	}

	/* Branch inline diff */
	.fmock-branch-wrap {
		display: inline-flex;
		flex-direction: column;
		vertical-align: top;
		gap: 1px;
		margin: 0 1px;
	}
	.fmock-branch {
		font-family: 'Georgia', serif;
		font-size: 12.5px;
		line-height: 1.6;
		border-radius: 2px;
		padding: 0 2px;
	}
	.fmock-branch--a {
		background: #fef3c7;
		color: #92400e;
		text-decoration: line-through;
		text-decoration-color: rgba(146,64,14,0.4);
		font-size: 11px;
	}
	.fmock-branch--b {
		background: #dbeafe;
		color: #1e3a8a;
	}
	.fmock-diff-legend {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 10px;
		padding-top: 8px;
		border-top: 1px solid #f0ede8;
	}
	.fmock-diff-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		flex-shrink: 0;
	}
	.fmock-diff-dot--a { background: #f59e0b; }
	.fmock-diff-dot--b { background: #3b82f6; }
	.fmock-diff-label {
		font-size: 9px;
		color: #9c968e;
	}

	/* Diff block */
	.fmock-diff-block {
		font-family: 'Inter', monospace;
		font-size: 10.5px;
		line-height: 1.7;
		overflow: hidden;
	}
	.fmock-diff-line {
		display: flex;
		gap: 6px;
		padding: 1px 4px;
		border-radius: 2px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.fmock-diff-line--neutral { color: #5a554f; }
	.fmock-diff-line--removed { background: #fff1f0; color: #7f1d1d; }
	.fmock-diff-line--added   { background: #f0fdf4; color: #14532d; }
	.fmock-diff-gutter {
		font-weight: 700;
		width: 10px;
		flex-shrink: 0;
		opacity: 0.7;
	}
	.fmock-diff-mark {
		border-radius: 2px;
		padding: 0 2px;
	}
	.fmock-diff-mark--removed { background: #fecaca; }
	.fmock-diff-mark--added   { background: #bbf7d0; }

	/* Nested note */
	.fmock-nested-panel {
		margin-top: 12px;
		border: 1px solid #e0dbd4;
		border-left: 3px solid #6b6560;
		border-radius: 5px;
		padding: 8px 10px;
		background: #faf9f7;
	}
	.fmock-nested-header {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 9px;
		font-weight: 600;
		color: #9c968e;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		margin-bottom: 5px;
	}
	.fmock-nested-body {
		font-family: 'Georgia', serif;
		font-size: 11px;
		line-height: 1.6;
		color: #5a554f;
		margin: 0;
	}

	.fmock-stat {
		font-size: 8.5px;
		color: #a89e94;
		margin-top: 4px;
		padding-top: 4px;
		border-top: 1px solid #e4e4e4;
	}

	.fmock-sidebar {
		background: #f2f2f2;
		padding: 8px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.fmock-card {
		background: white;
		border: 1px solid #e4e4e4;
		border-radius: 7px;
		padding: 8px 9px;
	}
	.fmock-card--active {
		border-color: #c7d7f5;
		box-shadow: 0 0 0 2px rgba(59,130,246,0.08);
	}
	.fmock-card--resolved {
		opacity: 0.55;
	}
	.fmock-card-label {
		font-size: 8.5px;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: #a89e94;
		margin-bottom: 7px;
	}
	.fmock-pills {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin-bottom: 7px;
	}
	.fmock-pill {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 4px;
		padding: 3px 7px;
		font-size: 10px;
		font-weight: 500;
	}
	.fmock-pill--grey {
		background: #f0ede8;
		color: #6b6560;
		border: 1px solid #d6cfc5;
	}
	.fmock-pill--purple {
		background: #a855f7;
		color: white;
	}
	.fmock-pill--blue {
		background: #3b82f6;
		color: white;
	}
	.fmock-pill--active-check {
		box-shadow: 0 0 0 2px rgba(255,255,255,0.5) inset;
	}
	.fmock-pill-x {
		opacity: 0.65;
		font-size: 12px;
		line-height: 1;
	}
	.fmock-revision-actions {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
	}
	.fmock-action-new {
		display: flex;
		align-items: center;
		gap: 3px;
		font-size: 9.5px;
		color: #3b82f6;
		font-weight: 500;
	}
	.fmock-action-nested {
		display: flex;
		align-items: center;
		gap: 3px;
		font-size: 9.5px;
		color: #6b6560;
	}

	/* AI mock */
	.fmock--ai {
		background: #f2f2f2;
	}
	.fmock-ai-panel {
		display: flex;
		flex-direction: column;
		min-height: 280px;
	}
	.fmock-ai-tabs {
		display: flex;
		align-items: center;
		gap: 2px;
		padding: 8px 10px;
		border-bottom: 1px solid #d8d8d8;
		background: #f2f2f2;
	}
	.fmock-ai-tab {
		width: 24px;
		height: 24px;
		border-radius: 5px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.fmock-ai-tab--active {
		background: rgba(59,130,246,0.1);
	}
	.fmock-ai-label {
		font-size: 11px;
		font-weight: 500;
		color: #4a4a4a;
		margin-left: 4px;
	}
	.fmock-ai-body {
		flex: 1;
		padding: 12px 12px 0;
	}
	.fmock-ai-body--chat {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 10px 10px 0;
	}
	.fmock-ai-body--tone {
		padding: 10px 12px 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.fmock-ai-suggestions {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.fmock-ai-suggestion-label {
		font-size: 9px;
		font-weight: 600;
		letter-spacing: 0.06em;
		color: #a89e94;
		text-transform: uppercase;
		margin-bottom: 2px;
	}
	.fmock-ai-chip {
		background: white;
		border: 1px solid #e0dbd4;
		border-radius: 5px;
		padding: 5px 9px;
		font-size: 10.5px;
		color: #4a4a4a;
		cursor: default;
	}
	.fmock-ai-placeholder {
		font-size: 11px;
		color: #9c968e;
		margin: 0;
	}
	.fmock-chat-msg {
		font-size: 10.5px;
		line-height: 1.5;
		border-radius: 6px;
		padding: 6px 8px;
		max-width: 95%;
	}
	.fmock-chat-msg--user {
		background: white;
		border: 1px solid #e0dbd4;
		color: #3a3a3a;
		align-self: flex-end;
	}
	.fmock-chat-msg--ai {
		background: rgba(59,130,246,0.07);
		border: 1px solid rgba(59,130,246,0.15);
		color: #2a2a2a;
		align-self: flex-start;
	}
	.fmock-inline-suggestion {
		background: rgba(59,130,246,0.12);
		border-radius: 3px;
		padding: 0 4px;
		font-weight: 600;
		color: #1d4ed8;
		font-style: italic;
	}
	.fmock-tone-row {
		display: flex;
		align-items: center;
		gap: 7px;
	}
	.fmock-tone-tag {
		font-size: 9px;
		font-weight: 600;
		border-radius: 3px;
		padding: 2px 5px;
		width: 68px;
		flex-shrink: 0;
		text-align: center;
	}
	.fmock-tone-tag--amber  { background: #fef3c7; color: #92400e; }
	.fmock-tone-tag--purple { background: #ede9fe; color: #6d28d9; }
	.fmock-tone-tag--blue   { background: #dbeafe; color: #1e40af; }
	.fmock-tone-bar {
		flex: 1;
		height: 5px;
		background: #e8e3db;
		border-radius: 99px;
		overflow: hidden;
	}
	.fmock-tone-fill {
		height: 100%;
		border-radius: 99px;
		transition: width 0.6s ease;
	}
	.fmock-tone-pct {
		font-size: 9px;
		color: #9c968e;
		width: 24px;
		text-align: right;
	}
	.fmock-tone-note {
		font-size: 9.5px;
		color: #9c968e;
		line-height: 1.5;
		padding-top: 4px;
		border-top: 1px solid #e8e3db;
	}
	.fmock-ai-footer {
		padding: 10px;
		border-top: 1px solid #d8d8d8;
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-top: 16px;
	}
	.fmock-context-quote {
		background: #fef9e7;
		border: 1px solid rgba(252,188,5,0.4);
		border-radius: 5px;
		padding: 6px 8px;
		font-size: 10px;
		color: #7a6500;
		line-height: 1.5;
	}
	.fmock-context-label {
		font-weight: 600;
		display: block;
		margin-bottom: 1px;
	}
	.fmock-context-text { font-style: italic; }
	.fmock-ai-input-wrap {
		background: white;
		border: 1px solid #d0d0d0;
		border-radius: 5px;
		padding: 6px 8px;
		font-size: 10.5px;
		color: #9c968e;
	}
	.fmock-ai-send {
		background: #3b82f6;
		color: white;
		border-radius: 5px;
		padding: 7px;
		font-size: 11.5px;
		font-weight: 500;
		text-align: center;
	}

	/* Comments mock */
	.fmock--comments {
		display: grid;
		grid-template-columns: 1fr 168px;
	}
	.fmock-doc--wide {
		background: white;
		padding: 20px 22px;
		border-right: 1px solid #e0e0e0;
	}
	.fmock-highlight-comment {
		background: rgba(251,191,36,0.25);
		border-bottom: 2px solid #f59e0b;
	}
	.fmock-highlight-yellow {
		background: #fde68a;
	}
	.fmock-card--comment {
		margin-bottom: 0;
	}
	.fmock-anchor {
		font-size: 10px;
		font-weight: 500;
		color: #d97706;
		border-left: 2px solid #f59e0b;
		padding-left: 5px;
		margin-bottom: 6px;
		font-style: italic;
		line-height: 1.4;
	}
	.fmock-anchor--resolved {
		color: #9c968e;
		border-left-color: #d6cfc5;
	}
	.fmock-comment-row {
		display: flex;
		gap: 5px;
		align-items: flex-start;
	}
	.fmock-avatar {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #e8e3db;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 9px;
		font-weight: 700;
		color: #6b6560;
		flex-shrink: 0;
	}
	.fmock-avatar--e { background: #dbeafe; color: #1e40af; }
	.fmock-avatar--you { background: #ede9fe; color: #6d28d9; }
	.fmock-comment-meta {
		display: flex;
		gap: 4px;
		align-items: baseline;
		margin-bottom: 1px;
	}
	.fmock-comment-author {
		font-size: 10px;
		font-weight: 600;
		color: #3a3a3a;
	}
	.fmock-comment-time {
		font-size: 9px;
		color: #a89e94;
	}
	.fmock-comment-body {
		font-size: 10.5px;
		color: #5a554f;
		margin: 0;
		line-height: 1.45;
	}
	.fmock-reply-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 6px;
		background: #f7f5f2;
		border: 1px solid #e0dbd4;
		border-radius: 4px;
		padding: 4px 7px;
	}
	.fmock-reply-text {
		font-size: 10.5px;
		color: #5a554f;
	}
	.fmock-reply-send {
		font-size: 10.5px;
		font-weight: 500;
		color: #3b82f6;
	}
	.fmock-reply-thread {
		display: flex;
		gap: 5px;
		margin-top: 6px;
		padding-top: 6px;
		border-top: 1px solid #f0ede8;
	}
	.fmock-thread-line {
		width: 1.5px;
		background: #e0dbd4;
		border-radius: 1px;
		flex-shrink: 0;
		margin-left: 8px;
	}
	.fmock-resolved-badge {
		display: flex;
		align-items: center;
		gap: 3px;
		margin-top: 5px;
		font-size: 9px;
		color: #10b981;
		font-weight: 500;
	}
</style>
