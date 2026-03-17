<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let slide0 = 0; // revision carousel
	let slide1 = 0; // AI carousel
	let slide2 = 0; // comments carousel

	const INTERVAL = 3500;
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
		if (which === 0) slide0 = idx;
		else if (which === 1) slide1 = idx;
		else slide2 = idx;
	}
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
			<!-- Revision panel close-up -->
			<div class="carousel">
				<div class="carousel-track" style="transform: translateX(-{slide0 * 100}%)">
					<!-- Slide 0: Base state -->
					<div class="carousel-slide">
						<div class="fmock fmock--revision">
				<div class="fmock-doc">
					<p class="fmock-prose">
						She had been walking for hours when <span class="fmock-underline">the rain began, softly at first</span>, then all at once — the way grief tends to arrive, without warning or permission.
					</p>
				</div>
				<div class="fmock-sidebar">
					<div class="fmock-card">
						<div class="fmock-card-label">REVISION</div>
						<div class="fmock-pills">
							<div class="fmock-pill fmock-pill--grey">
								<span>softly at first...</span>
								<span class="fmock-pill-x">×</span>
							</div>
							<div class="fmock-pill fmock-pill--purple">
								<span>gently, then all at...</span>
								<span class="fmock-pill-x">×</span>
							</div>
						</div>
						<div class="fmock-revision-actions">
							<span class="fmock-action-new">
								<svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M4.5 1.5V7.5M1.5 4.5H7.5" stroke="#3b82f6" stroke-width="1.2" stroke-linecap="round"/></svg>
								New version
							</span>
							<span class="fmock-action-nested">
								<svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M2 3.5L4.5 6L7 3.5" stroke="#6b6560" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>
								Nested editor
							</span>
						</div>
					</div>
				</div>
						</div>
					</div>
					<!-- Slide 1: Third version added -->
					<div class="carousel-slide">
						<div class="fmock fmock--revision">
							<div class="fmock-doc">
								<p class="fmock-prose">
									She had been walking for hours when <span class="fmock-underline">the rain began, softly at first</span>, then all at once — the way grief tends to arrive, without warning or permission.
								</p>
							</div>
							<div class="fmock-sidebar">
								<div class="fmock-card">
									<div class="fmock-card-label">REVISION</div>
									<div class="fmock-pills">
										<div class="fmock-pill fmock-pill--grey">
											<span>softly at first...</span>
											<span class="fmock-pill-x">×</span>
										</div>
										<div class="fmock-pill fmock-pill--purple">
											<span>gently, then all at...</span>
											<span class="fmock-pill-x">×</span>
										</div>
										<div class="fmock-pill fmock-pill--blue">
											<span>a cold shock of rain...</span>
											<span class="fmock-pill-x">×</span>
										</div>
									</div>
									<div style="font-size: 8.5px; color: #6b6560; padding-top: 4px; border-top: 1px solid #e4e4e4; margin-top: 4px; padding-left: 0;">3 versions</div>
								</div>
							</div>
						</div>
					</div>
					<!-- Slide 2: Nested editor open -->
					<div class="carousel-slide">
						<div class="fmock fmock--revision">
							<div class="fmock-doc">
								<p class="fmock-prose">
									She had been walking for hours when <span class="fmock-underline">the rain began, softly at first</span>, then all at once — the way grief tends to arrive, without warning or permission.
								</p>
								<div style="margin-top: 12px; border-top: 1px solid #e0e0e0; padding-top: 12px;">
									<div style="font-size: 9px; color: #a89e94; font-weight: 600; margin-bottom: 6px;">NESTED: child note</div>
									<p class="fmock-prose">This phrase carries both literal and metaphorical weight...</p>
								</div>
							</div>
							<div class="fmock-sidebar">
								<div class="fmock-card">
									<div class="fmock-card-label">REVISION</div>
									<div class="fmock-pills">
										<div class="fmock-pill fmock-pill--grey">
											<span>softly at first...</span>
											<span class="fmock-pill-x">×</span>
										</div>
										<div class="fmock-pill fmock-pill--purple">
											<span>gently, then all at...</span>
											<span class="fmock-pill-x">×</span>
										</div>
									</div>
									<div class="fmock-revision-actions">
										<span class="fmock-action-new">
											<svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M4.5 1.5V7.5M1.5 4.5H7.5" stroke="#3b82f6" stroke-width="1.2" stroke-linecap="round"/></svg>
											New version
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="carousel-dots">
					{#each [0, 1, 2] as i}
						<button class="dot" class:dot--active={slide0 === i} on:click={() => goTo(0, i)} />
					{/each}
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
			<!-- AI chat panel close-up -->
			<div class="carousel">
				<div class="carousel-track" style="transform: translateX(-{slide1 * 100}%)">
					<!-- Slide 0: Empty AI panel -->
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
						<span class="fmock-ai-label">Chat with AI</span>
						<div style="flex:1"></div>
						<svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 1.5L7.5 7.5M7.5 1.5L1.5 7.5" stroke="#9c968e" stroke-width="1.1" stroke-linecap="round"/></svg>
					</div>
					<div class="fmock-ai-body">
						<p class="fmock-ai-placeholder">Start a conversation about your document</p>
					</div>
					<div class="fmock-ai-footer">
						<div class="fmock-context-quote">
							<span class="fmock-context-label">Context:</span>
							<span class="fmock-context-text">"the rain began, softly at first, then all at once — the way grief tends to arrive..."</span>
						</div>
						<div class="fmock-ai-input-wrap">
							<span class="fmock-ai-input-text">Ask about selection...</span>
						</div>
						<div class="fmock-ai-send">Send</div>
					</div>
				</div>
						</div>
					</div>
					<!-- Slide 1: AI chat exchange -->
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
									<span class="fmock-ai-label">Chat with AI</span>
									<div style="flex:1"></div>
									<svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 1.5L7.5 7.5M7.5 1.5L1.5 7.5" stroke="#9c968e" stroke-width="1.1" stroke-linecap="round"/></svg>
								</div>
								<div class="fmock-ai-body" style="padding: 12px; gap: 8px; display: flex; flex-direction: column;">
									<div style="font-size: 10px; color: #5a554f; line-height: 1.5;">
										<strong style="color: #3a3a3a;">You:</strong> Is this too passive?
									</div>
									<div style="font-size: 10px; color: #6b6560; line-height: 1.5; background: rgba(59,130,246,0.08); padding: 6px 8px; border-radius: 5px;">
										<strong style="color: #3b82f6;">AI:</strong> Yes. "began" is tentative. Try "arrived" or "descended."
									</div>
								</div>
								<div class="fmock-ai-footer">
									<div class="fmock-context-quote">
										<span class="fmock-context-label">Context:</span>
										<span class="fmock-context-text">"the rain began, softly at first..."</span>
									</div>
									<div class="fmock-ai-input-wrap">
										<span class="fmock-ai-input-text">Ask about selection...</span>
									</div>
									<div class="fmock-ai-send">Send</div>
								</div>
							</div>
						</div>
					</div>
					<!-- Slide 2: Tone feedback tags -->
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
									<span class="fmock-ai-label">Chat with AI</span>
									<div style="flex:1"></div>
									<svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 1.5L7.5 7.5M7.5 1.5L1.5 7.5" stroke="#9c968e" stroke-width="1.1" stroke-linecap="round"/></svg>
								</div>
								<div class="fmock-ai-body" style="padding: 12px;">
									<div style="font-size: 10px; color: #6b6560; margin-bottom: 8px;">Tone detected:</div>
									<div style="display: flex; flex-wrap: wrap; gap: 6px;">
										<span style="background: #fde68a; border: 1px solid #f59e0b; border-radius: 4px; padding: 3px 7px; font-size: 9px; color: #7a6500; font-weight: 500;">Passive</span>
										<span style="background: #dbeafe; border: 1px solid #3b82f6; border-radius: 4px; padding: 3px 7px; font-size: 9px; color: #1e40af; font-weight: 500;">Tentative</span>
										<span style="background: #ede9fe; border: 1px solid #a855f7; border-radius: 4px; padding: 3px 7px; font-size: 9px; color: #6d28d9; font-weight: 500;">Melancholic</span>
									</div>
								</div>
								<div class="fmock-ai-footer">
									<div class="fmock-context-quote">
										<span class="fmock-context-label">Context:</span>
										<span class="fmock-context-text">"the rain began, softly at first..."</span>
									</div>
									<div class="fmock-ai-input-wrap">
										<span class="fmock-ai-input-text">Ask about selection...</span>
									</div>
									<div class="fmock-ai-send">Send</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="carousel-dots">
					{#each [0, 1, 2] as i}
						<button class="dot" class:dot--active={slide1 === i} on:click={() => goTo(1, i)} />
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Feature 3: Annotations -->
	<div class="reveal feature-row">
		<div class="feature-visual">
			<!-- Comment sidebar close-up -->
			<div class="carousel">
				<div class="carousel-track" style="transform: translateX(-{slide2 * 100}%)">
					<!-- Slide 0: Base comment state -->
					<div class="carousel-slide">
						<div class="fmock fmock--comments">
				<div class="fmock-doc fmock-doc--wide">
					<p class="fmock-prose">
						The café had <span class="fmock-highlight-comment">grown quiet</span> by the time she noticed the letter. It was propped against the salt shaker, her name written in handwriting she didn't recognise. <span class="fmock-highlight-yellow">She ordered another coffee she wouldn't finish. The letter stayed where it was.</span>
					</p>
				</div>
				<div class="fmock-sidebar">
					<!-- Comment 1 -->
					<div class="fmock-card fmock-card--comment">
						<div class="fmock-card-label">COMMENT</div>
						<div class="fmock-anchor">grown quiet</div>
						<div class="fmock-comment-row">
							<div class="fmock-avatar">E</div>
							<div>
								<div class="fmock-comment-meta"><span class="fmock-comment-author">Elena</span><span class="fmock-comment-time">just now</span></div>
								<p class="fmock-comment-body">Love this — much better than "emptied out."</p>
							</div>
						</div>
					</div>
					<!-- Comment 2 -->
					<div class="fmock-card fmock-card--comment">
						<div class="fmock-card-label">COMMENT</div>
						<div class="fmock-anchor">The letter stayed where it was.</div>
						<div class="fmock-comment-row">
							<div class="fmock-avatar">E</div>
							<div>
								<div class="fmock-comment-meta"><span class="fmock-comment-author">Elena</span><span class="fmock-comment-time">just now</span></div>
								<p class="fmock-comment-body">Best line in the chapter. Don't touch it.</p>
							</div>
						</div>
						<div class="fmock-reply-row">
							<span class="fmock-reply-text">Agreed, keeping it.</span>
							<span class="fmock-reply-send">Send</span>
						</div>
					</div>
				</div>
						</div>
					</div>
					<!-- Slide 1: Reply thread expanded -->
					<div class="carousel-slide">
						<div class="fmock fmock--comments">
							<div class="fmock-doc fmock-doc--wide">
								<p class="fmock-prose">
									The café had <span class="fmock-highlight-comment">grown quiet</span> by the time she noticed the letter. It was propped against the salt shaker, her name written in handwriting she didn't recognise. <span class="fmock-highlight-yellow">She ordered another coffee she wouldn't finish. The letter stayed where it was.</span>
								</p>
							</div>
							<div class="fmock-sidebar">
								<!-- Comment 1 -->
								<div class="fmock-card fmock-card--comment">
									<div class="fmock-card-label">COMMENT</div>
									<div class="fmock-anchor">grown quiet</div>
									<div class="fmock-comment-row">
										<div class="fmock-avatar">E</div>
										<div>
											<div class="fmock-comment-meta"><span class="fmock-comment-author">Elena</span><span class="fmock-comment-time">just now</span></div>
											<p class="fmock-comment-body">Love this — much better than "emptied out."</p>
										</div>
									</div>
								</div>
								<!-- Comment 2 with expanded replies -->
								<div class="fmock-card fmock-card--comment">
									<div class="fmock-card-label">COMMENT</div>
									<div class="fmock-anchor">The letter stayed where it was.</div>
									<div class="fmock-comment-row">
										<div class="fmock-avatar">E</div>
										<div>
											<div class="fmock-comment-meta"><span class="fmock-comment-author">Elena</span><span class="fmock-comment-time">just now</span></div>
											<p class="fmock-comment-body">Best line in the chapter. Don't touch it.</p>
										</div>
									</div>
									<div style="margin-top: 6px; padding: 6px; background: #f7f5f2; border-radius: 4px;">
										<div style="font-size: 9px; color: #a89e94; margin-bottom: 4px;">You replied:</div>
										<div style="font-size: 10.5px; color: #5a554f; margin-bottom: 4px;">Agreed, keeping it.</div>
										<div style="font-size: 9px; color: #a89e94;">2 min ago</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<!-- Slide 2: Comment resolved -->
					<div class="carousel-slide">
						<div class="fmock fmock--comments">
							<div class="fmock-doc fmock-doc--wide">
								<p class="fmock-prose">
									The café had <span class="fmock-highlight-comment">grown quiet</span> by the time she noticed the letter. It was propped against the salt shaker, her name written in handwriting she didn't recognise. <span class="fmock-highlight-yellow">She ordered another coffee she wouldn't finish. The letter stayed where it was.</span>
								</p>
							</div>
							<div class="fmock-sidebar">
								<!-- Comment 1 (resolved - greyed out) -->
								<div class="fmock-card fmock-card--comment" style="opacity: 0.5;">
									<div class="fmock-card-label">COMMENT</div>
									<div class="fmock-anchor">grown quiet</div>
									<div class="fmock-comment-row">
										<div class="fmock-avatar">E</div>
										<div>
											<div class="fmock-comment-meta"><span class="fmock-comment-author">Elena</span><span class="fmock-comment-time">just now</span></div>
											<p class="fmock-comment-body">Love this — much better than "emptied out."</p>
										</div>
									</div>
									<div style="margin-top: 6px; display: flex; align-items: center; gap: 4px; font-size: 9px; color: #a89e94;">
										<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 2" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
										Resolved
									</div>
								</div>
								<!-- Comment 2 (active) -->
								<div class="fmock-card fmock-card--comment">
									<div class="fmock-card-label">COMMENT</div>
									<div class="fmock-anchor">The letter stayed where it was.</div>
									<div class="fmock-comment-row">
										<div class="fmock-avatar">E</div>
										<div>
											<div class="fmock-comment-meta"><span class="fmock-comment-author">Elena</span><span class="fmock-comment-time">just now</span></div>
											<p class="fmock-comment-body">Best line in the chapter. Don't touch it.</p>
										</div>
									</div>
									<div class="fmock-reply-row">
										<span class="fmock-reply-text">Agreed, keeping it.</span>
										<span class="fmock-reply-send">Send</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="carousel-dots">
					{#each [0, 1, 2] as i}
						<button class="dot" class:dot--active={slide2 === i} on:click={() => goTo(2, i)} />
					{/each}
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
		font-family: 'Lora', Georgia, serif;
		font-size: 1.65rem;
		font-weight: 700;
		color: #1e1c1a;
		margin: 0 0 12px 0;
		line-height: 1.2;
	}
	.feature-lead {
		font-size: 15.5px;
		color: #5a554f;
		line-height: 1.8;
		margin: 0 0 16px 0;
	}
	.feature-body {
		font-size: 14px;
		color: #7c756d;
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
	.carousel-dots {
		display: flex;
		justify-content: center;
		gap: 6px;
		padding: 10px 0 4px;
		background: #f5f5f5;
	}
	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #d6cfc5;
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
		border-radius: 10px;
		overflow: hidden;
		box-shadow:
			0 8px 32px rgba(44, 42, 39, 0.1),
			0 2px 8px rgba(44, 42, 39, 0.06);
		font-family: 'Inter', system-ui, sans-serif;
		-webkit-font-smoothing: antialiased;
		background: #e8e8e8;
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
	.fmock-highlight-comment {
		background: rgba(251,191,36,0.25);
		border-bottom: 2px solid #f59e0b;
	}
	.fmock-highlight-yellow {
		background: #fde68a;
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
	.fmock-ai-placeholder {
		font-size: 11px;
		color: #9c968e;
		margin: 0;
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
		border-right: 1px solid #e0e0e0;
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
</style>
