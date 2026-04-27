<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import posthog from 'posthog-js';
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { MessageSquareMore, Sparkles, Split, X } from '@lucide/svelte';

	let { data } = $props();

	type ShareAnnotation = (typeof data.share.annotations)[number];
	type AnnotationId = ShareAnnotation['id'];
	type ParagraphSegment = {
		key: string;
		text: string;
		annotationIds: AnnotationId[];
		trailingMarkers: ShareAnnotation[];
	};
	type ParagraphBlock = {
		id: string;
		start: number;
		end: number;
		leadingMarkers: ShareAnnotation[];
		segments: ParagraphSegment[];
		annotations: ShareAnnotation[];
		isBlank: boolean;
	};
	type DisplayShare = {
		content: string;
		annotations: ShareAnnotation[];
	};

	const downloadUrl =
		'/?utm_source=shared-doc&utm_medium=share-page&utm_campaign=public-readonly-share#download';

	let activeInlineAnnotationId = $state<AnnotationId | null>(null);
	let modalAnnotationId = $state<AnnotationId | null>(null);
	let initializedSelection = $state(false);
	let revisionVersionSelections = $state<Record<string, number>>({});

	function formatPublishedAt(value: string | null): string {
		if (!value) return 'Shared from Quillium';
		return new Intl.DateTimeFormat(undefined, {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(value));
	}

	function formatTimestamp(value: number): string {
		return new Intl.DateTimeFormat(undefined, {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(value));
	}

	function shareTokenSuffix(token: string): string {
		return token.slice(-8);
	}

	function annotationIcon(type: ShareAnnotation['type']) {
		if (type === 'comment') return MessageSquareMore;
		if (type === 'suggestion') return Sparkles;
		return Split;
	}

	function annotationLabel(type: ShareAnnotation['type']) {
		if (type === 'comment') return 'Comment';
		if (type === 'suggestion') return 'Suggestion';
		return 'Revision';
	}

	function annotationChipLabel(annotation: ShareAnnotation) {
		if (annotation.type === 'comment') return `${annotation.thread.length} message${annotation.thread.length === 1 ? '' : 's'}`;
		if (annotation.type === 'suggestion') {
			return `${annotation.replacements.length} option${annotation.replacements.length === 1 ? '' : 's'}`;
		}
		return `${annotation.versions.length} version${annotation.versions.length === 1 ? '' : 's'}`;
	}

	function annotationToneClass(type: ShareAnnotation['type']) {
		if (type === 'comment') return 'annotation-tone-comment';
		if (type === 'suggestion') return 'annotation-tone-suggestion';
		return 'annotation-tone-revision';
	}

	function annotationInlineClass(annotation: ShareAnnotation | undefined, isActive: boolean) {
		if (!annotation) return '';
		if (annotation.type === 'comment') {
			return isActive ? 'annotation-inline-comment-active' : 'annotation-inline-comment';
		}
		if (annotation.type === 'suggestion') {
			return isActive ? 'annotation-inline-suggestion-active' : 'annotation-inline-suggestion';
		}
		return isActive ? 'annotation-inline-revision-active' : 'annotation-inline-revision';
	}

	function markerSymbol(type: ShareAnnotation['type']) {
		if (type === 'comment') return 'C';
		if (type === 'suggestion') return 'S';
		return 'R';
	}

	function clamp(value: number, min: number, max: number) {
		return Math.min(Math.max(value, min), max);
	}

	function selectAnnotation(id: AnnotationId) {
		activeInlineAnnotationId = id;
	}

	function toggleInlineAnnotation(id: AnnotationId) {
		activeInlineAnnotationId = activeInlineAnnotationId === id ? null : id;
	}

	function openAnnotationModal(id: AnnotationId) {
		activeInlineAnnotationId = id;
		modalAnnotationId = id;
	}

	function closeAnnotationModal() {
		modalAnnotationId = null;
	}

	function getSelectedRevisionVersionIndex(annotation: ShareAnnotation): number {
		if (annotation.type !== 'revision') return 0;
		return revisionVersionSelections[annotation.id] ?? annotation.activeVersionIndex;
	}

	function getSelectedRevisionVersion(annotation: ShareAnnotation) {
		if (annotation.type !== 'revision') return null;
		const selectedIndex = getSelectedRevisionVersionIndex(annotation);
		return (
			annotation.versions.find((version) => version.index === selectedIndex) ??
			annotation.versions[annotation.activeVersionIndex] ??
			annotation.versions[0] ??
			null
		);
	}

	function getRequiredRevisionVersion(
		annotation: Extract<ShareAnnotation, { type: 'revision' }>
	) {
		const selectedVersion = getSelectedRevisionVersion(annotation);
		if (!selectedVersion) {
			throw new Error(`Missing selected revision version for annotation ${annotation.id}`);
		}
		return selectedVersion;
	}

	function selectRevisionVersion(annotationId: AnnotationId, versionIndex: number) {
		revisionVersionSelections = {
			...revisionVersionSelections,
			[annotationId]: versionIndex
		};
	}

	function buildParagraphBlocks(content: string, annotations: ShareAnnotation[]): ParagraphBlock[] {
		const lines = content.split('\n');
		let cursor = 0;

		return lines.map((line, index) => {
			const start = cursor;
			const end = start + line.length;
			cursor = end + 1;

			const paragraphAnnotations = annotations
				.filter((annotation) => {
					if (annotation.from === annotation.to) {
						return annotation.from >= start && annotation.from <= end;
					}

					return annotation.from < end && annotation.to > start;
				})
				.sort((a, b) => a.from - b.from || a.to - b.to || a.id.localeCompare(b.id));

			const collapsedMarkers = new Map<number, ShareAnnotation[]>();
			const breakpoints = new Set<number>([start, end]);

			for (const annotation of paragraphAnnotations) {
				const from = clamp(annotation.from, start, end);
				const to = clamp(annotation.to, start, end);

				if (from === to) {
					collapsedMarkers.set(from, [...(collapsedMarkers.get(from) ?? []), annotation]);
					continue;
				}

				breakpoints.add(from);
				breakpoints.add(to);
			}

			const points = [...breakpoints].sort((a, b) => a - b);
			const leadingMarkers = collapsedMarkers.get(start) ?? [];
			const segments: ParagraphSegment[] = [];

			for (let pointIndex = 0; pointIndex < points.length - 1; pointIndex += 1) {
				const segmentStart = points[pointIndex];
				const segmentEnd = points[pointIndex + 1];
				if (segmentEnd <= segmentStart) continue;

				const annotationIds = paragraphAnnotations
					.filter((annotation) => {
						const from = clamp(annotation.from, start, end);
						const to = clamp(annotation.to, start, end);
						return from < segmentEnd && to > segmentStart;
					})
					.map((annotation) => annotation.id);

				segments.push({
					key: `${index}-${segmentStart}-${segmentEnd}`,
					text: content.slice(segmentStart, segmentEnd),
					annotationIds,
					trailingMarkers: collapsedMarkers.get(segmentEnd) ?? []
				});
			}

			return {
				id: `paragraph-${index}`,
				start,
				end,
				leadingMarkers,
				segments,
				annotations: paragraphAnnotations,
				isBlank: line.length === 0
			};
		});
	}

	function buildDisplayedShare(
		content: string,
		annotations: ShareAnnotation[]
	): DisplayShare {
		let nextContent = content;
		let nextAnnotations = [...annotations];

		function mapPositionWithinReplacement(
			position: number,
			replacementStart: number,
			replacementEnd: number,
			replacementTextLength: number
		): number {
			const originalLength = replacementEnd - replacementStart;
			if (originalLength <= 0) return replacementStart;
			const relativeOffset = (position - replacementStart) / originalLength;
			const mappedOffset = Math.round(relativeOffset * replacementTextLength);
			return replacementStart + Math.min(Math.max(mappedOffset, 0), replacementTextLength);
		}

		const revisionSelections = nextAnnotations
			.filter(
				(annotation): annotation is Extract<ShareAnnotation, { type: 'revision' }> =>
					annotation.type === 'revision'
			)
			.map((annotation) => ({
				annotationId: annotation.id,
				from: annotation.from,
				to: annotation.to,
				selectedVersion: getSelectedRevisionVersion(annotation)
			}))
			.filter((entry) => !!entry.selectedVersion)
			.sort((a, b) => a.from - b.from);

		for (const entry of revisionSelections) {
			const currentAnnotation = nextAnnotations.find(
				(annotation): annotation is Extract<ShareAnnotation, { type: 'revision' }> =>
					annotation.id === entry.annotationId && annotation.type === 'revision'
			);
			if (!currentAnnotation || !entry.selectedVersion) continue;

			const nestedDisplayedShare = buildDisplayedShare(
				entry.selectedVersion.text,
				entry.selectedVersion.annotations ?? []
			);

			const replacementStart = currentAnnotation.from;
			const replacementEnd = currentAnnotation.to;
			const replacementText = nestedDisplayedShare.content;
			const delta = replacementText.length - (replacementEnd - replacementStart);

			nextContent =
				nextContent.slice(0, replacementStart) +
				replacementText +
				nextContent.slice(replacementEnd);

			nextAnnotations = nextAnnotations.map((annotation) => {
				if (annotation.id === currentAnnotation.id) {
					return {
						...annotation,
						from: replacementStart,
						to: replacementStart + replacementText.length,
						selectedText: replacementText
					};
				}

				if (annotation.to <= replacementStart) {
					return annotation;
				}

				if (annotation.from >= replacementEnd) {
					return {
						...annotation,
						from: annotation.from + delta,
						to: annotation.to + delta
					};
				}

				let nextFrom = annotation.from;
				let nextTo = annotation.to;

				const isFullyInside =
					annotation.from >= replacementStart && annotation.to <= replacementEnd;
				const overlapsLeftEdge =
					annotation.from < replacementStart && annotation.to > replacementStart;
				const overlapsRightEdge =
					annotation.from < replacementEnd && annotation.to > replacementEnd;

				if (isFullyInside) {
					nextFrom = mapPositionWithinReplacement(
						annotation.from,
						replacementStart,
						replacementEnd,
						replacementText.length
					);
					nextTo = mapPositionWithinReplacement(
						annotation.to,
						replacementStart,
						replacementEnd,
						replacementText.length
					);
				} else if (overlapsLeftEdge && annotation.to <= replacementEnd) {
					nextTo = mapPositionWithinReplacement(
						annotation.to,
						replacementStart,
						replacementEnd,
						replacementText.length
					);
				} else if (annotation.from >= replacementStart && overlapsRightEdge) {
					nextFrom = mapPositionWithinReplacement(
						annotation.from,
						replacementStart,
						replacementEnd,
						replacementText.length
					);
					nextTo = annotation.to + delta;
				} else if (annotation.from < replacementStart && annotation.to > replacementEnd) {
					nextTo = annotation.to + delta;
				}

				return {
					...annotation,
					from: nextFrom,
					to: Math.max(nextFrom, nextTo)
				};
			});

			const mappedNestedAnnotations = nestedDisplayedShare.annotations.map((annotation) => ({
				...annotation,
				from: replacementStart + annotation.from,
				to: replacementStart + annotation.to,
				selectedText: replacementText.slice(annotation.from, annotation.to)
			}));

			nextAnnotations = [
				...nextAnnotations.filter((annotation) => !mappedNestedAnnotations.some((nested) => nested.id === annotation.id)),
				...mappedNestedAnnotations
			];
		}

		return {
			content: nextContent,
			annotations: nextAnnotations
				.map((annotation) => ({
					...annotation,
					selectedText: nextContent.slice(annotation.from, annotation.to)
				}))
				.sort((a, b) => a.from - b.from || a.to - b.to || a.id.localeCompare(b.id))
		};
	}

	function trackInstallClick(location: string) {
		posthog.capture('shared_page_cta_clicked', {
			share_token_suffix: shareTokenSuffix(data.share.token),
			location
		});
	}

	const sortedAnnotations = $derived(
		[...data.share.annotations].sort(
			(a, b) => a.from - b.from || a.to - b.to || a.id.localeCompare(b.id)
		)
	);

	const displayedShare = $derived(buildDisplayedShare(data.share.content, sortedAnnotations));

	const displayAnnotations = $derived(displayedShare.annotations);

	const paragraphBlocks = $derived(buildParagraphBlocks(displayedShare.content, displayAnnotations));

	const activeInlineAnnotation = $derived(
		displayAnnotations.find((annotation) => annotation.id === activeInlineAnnotationId) ??
			sortedAnnotations.find((annotation) => annotation.id === activeInlineAnnotationId) ??
			null
	);

	const modalAnnotation = $derived(
		displayAnnotations.find((annotation) => annotation.id === modalAnnotationId) ??
			sortedAnnotations.find((annotation) => annotation.id === modalAnnotationId) ??
			null
	);

	$effect(() => {
		if (initializedSelection) return;
		activeInlineAnnotationId = sortedAnnotations[0]?.id ?? null;
		initializedSelection = true;
	});

	onMount(() => {
		posthog.capture('shared_page_viewed', {
			share_token_suffix: shareTokenSuffix(data.share.token),
			has_author: !!data.share.authorName
		});
	});
</script>

<svelte:head>
	<title>{data.share.title} · Shared via Quillium</title>
	<meta name="description" content={data.share.excerpt || 'A read-only document shared from Quillium.'} />
	<link rel="canonical" href={data.share.canonicalUrl} />
	<meta property="og:title" content={`${data.share.title} · Shared via Quillium`} />
	<meta property="og:description" content={data.share.excerpt || 'A read-only document shared from Quillium.'} />
	<meta property="og:url" content={data.share.canonicalUrl} />
	<meta property="og:type" content="article" />
</svelte:head>

<Nav />

<main class="share-shell min-h-screen px-4 pt-28 pb-20 sm:px-6">
	<section class="mx-auto max-w-[1320px]">
		<div class="share-topbar-shell">
			<div class="share-topbar" in:fly={{ y: -18, duration: 420 }}>
				<div class="share-title-block">
					<p class="share-title">{data.share.title}</p>
					<p class="share-topbar-meta">
						{data.share.authorName || 'Shared from Quillium'} · {formatPublishedAt(data.share.publishedAt)}
					</p>
				</div>
				<a href={downloadUrl} onclick={() => trackInstallClick('toolbar')} class="btn-primary share-install-button">
					Edit in Quillium
				</a>
			</div>
		</div>

		<div class="editor-stage">
			<section class="editor-sheet" in:fade={{ duration: 420 }}>
				<div class="share-document">
					{#each paragraphBlocks as paragraph}
						<div class="share-paragraph" id={paragraph.id}>
							{#if paragraph.leadingMarkers.length > 0}
								<span class="inline-marker-group">
									{#each paragraph.leadingMarkers as marker (marker.id)}
										<button
											type="button"
											class={`annotation-marker ${annotationToneClass(marker.type)}`}
											onclick={() => selectAnnotation(marker.id)}
											aria-pressed={activeInlineAnnotationId === marker.id}
										>
											{markerSymbol(marker.type)}
										</button>
									{/each}
								</span>
							{/if}

							{#if paragraph.segments.length === 0}
								<span class="share-blank-line" aria-hidden="true"></span>
							{:else}
								{#each paragraph.segments as segment (segment.key)}
									{#if segment.annotationIds.length > 0}
										{@const primaryAnnotation = displayAnnotations.find(
											(annotation) => annotation.id === segment.annotationIds[0]
										)}
										<button
											type="button"
											class={`annotation-inline ${annotationInlineClass(primaryAnnotation, activeInlineAnnotationId === segment.annotationIds[0])}`}
											onclick={() => selectAnnotation(segment.annotationIds[0])}
											aria-pressed={activeInlineAnnotationId === segment.annotationIds[0]}
										>
											{segment.text}
										</button>
									{:else}
										<span>{segment.text}</span>
									{/if}

									{#if segment.trailingMarkers.length > 0}
										<span class="inline-marker-group">
											{#each segment.trailingMarkers as marker (marker.id)}
												<button
													type="button"
													class={`annotation-marker ${annotationToneClass(marker.type)}`}
													onclick={() => selectAnnotation(marker.id)}
													aria-pressed={activeInlineAnnotationId === marker.id}
												>
													{markerSymbol(marker.type)}
												</button>
											{/each}
										</span>
									{/if}
								{/each}
							{/if}
						</div>
					{/each}
				</div>
			</section>

			<aside class="annotation-column" in:fly={{ x: 20, duration: 420, delay: 60 }}>
				<div class="annotation-column-note">
					<p class="annotation-note-label">Read-only annotations</p>
					<p class="annotation-note-copy">
						Highlights stay in the document. Annotation details live here, like the editor.
					</p>
				</div>

				<div class="annotation-card-stack">
					{#if sortedAnnotations.length > 0}
						{#each sortedAnnotations as annotation (annotation.id)}
							{@const isActive = activeInlineAnnotationId === annotation.id}
							{@const Icon = annotationIcon(annotation.type)}
							{@const selectedRevisionVersion = annotation.type === 'revision' ? getSelectedRevisionVersion(annotation) : null}
							<article
								class={`annotation-card ${annotation.type === 'comment' ? 'annotation-card-comment' : annotation.type === 'suggestion' ? 'annotation-card-suggestion' : 'annotation-card-revision'} ${isActive ? 'annotation-card-active' : ''}`}
								in:scale={{ start: 0.96, duration: 220 }}
							>
								<div class="annotation-card-topline">
									<button
										type="button"
										class="annotation-card-select"
										onclick={() => selectAnnotation(annotation.id)}
										aria-pressed={isActive}
									>
										<div class="annotation-card-icon">
											<Icon size={14} />
										</div>
										<div class="min-w-0 flex-1 text-left">
											<p class="annotation-card-label">{annotationLabel(annotation.type)}</p>
											<p class="annotation-card-meta">{annotationChipLabel(annotation)}</p>
										</div>
									</button>

									{#if isActive}
										<button
											type="button"
											class="annotation-card-action"
											onclick={() => openAnnotationModal(annotation.id)}
										>
											Open
										</button>
									{/if}
								</div>

								<button
									type="button"
									class="annotation-selection-chip"
									onclick={() => selectAnnotation(annotation.id)}
									aria-pressed={isActive}
								>
									{annotation.type === 'revision' && selectedRevisionVersion
										? selectedRevisionVersion.text
										: annotation.selectedText || 'Collapsed selection'}
								</button>

								{#if annotation.type === 'comment'}
									{#if annotation.thread.length > 0}
										<div class="annotation-thread-stack">
											{#each (isActive ? annotation.thread : annotation.thread.slice(0, 1)) as message (message.time)}
												<article class="thread-message">
													<div class="thread-message-meta">
														<span class="thread-author">{message.author}</span>
														<span>{formatTimestamp(message.time)}</span>
													</div>
													<p class="thread-message-body">{message.message}</p>
												</article>
											{/each}
										</div>
									{:else}
										<p class="annotation-empty-state">No thread messages were attached to this comment.</p>
									{/if}
								{:else if annotation.type === 'suggestion'}
									<div class="annotation-option-stack">
										{#each (isActive ? annotation.replacements : annotation.replacements.slice(0, 1)) as replacement, index (`${annotation.id}-${index}`)}
											<article class="suggestion-option">
												<p class="suggestion-option-label">Option {index + 1}</p>
												<p class="suggestion-option-text">{replacement.text}</p>
												{#if isActive && replacement.rationale}
													<p class="suggestion-option-rationale">{replacement.rationale}</p>
												{/if}
											</article>
										{/each}
									</div>

									{#if isActive && annotation.thread.length > 0}
										<div class="annotation-thread-stack">
											{#each annotation.thread as message (message.time)}
												<article class="thread-message">
													<div class="thread-message-meta">
														<span class="thread-author">{message.author}</span>
														<span>{formatTimestamp(message.time)}</span>
													</div>
													<p class="thread-message-body">{message.message}</p>
												</article>
											{/each}
										</div>
									{/if}
								{:else}
									<div class="revision-version-tabs">
										{#each annotation.versions as version}
											<button
												type="button"
												class={`revision-version-chip ${version.index === getSelectedRevisionVersionIndex(annotation) ? 'revision-version-chip-active' : ''}`}
												onclick={() => selectRevisionVersion(annotation.id, version.index)}
												aria-pressed={version.index === getSelectedRevisionVersionIndex(annotation)}
											>
												<span>V{version.index + 1}</span>
												{#if version.label}
													<span>{version.label}</span>
												{/if}
												{#if version.index === annotation.activeVersionIndex}
													<span>Published</span>
												{/if}
											</button>
										{/each}
									</div>

									<div class="revision-version-stack">
										{#if selectedRevisionVersion}
											{#key `${annotation.id}-${selectedRevisionVersion.index}`}
												<article
													class={`revision-version-card ${selectedRevisionVersion.index === annotation.activeVersionIndex ? 'revision-version-card-active' : ''}`}
													in:fade={{ duration: 180 }}
													out:fade={{ duration: 140 }}
												>
													<p class="revision-version-label">
														Version {selectedRevisionVersion.index + 1}{selectedRevisionVersion.label ? ` · ${selectedRevisionVersion.label}` : ''}{selectedRevisionVersion.index === annotation.activeVersionIndex ? ' · published' : ' · previewing'}
													</p>
													<p class="revision-version-body">{selectedRevisionVersion.text}</p>
												</article>
											{/key}
										{/if}
										{#if isActive && annotation.versions.length > 1}
											<p class="revision-version-hint">
												Switch versions to inspect alternate drafts without changing the published document.
											</p>
										{/if}
									</div>

									{#if isActive && annotation.thread.length > 0}
										<div class="annotation-thread-stack">
											{#each annotation.thread as message (message.time)}
												<article class="thread-message">
													<div class="thread-message-meta">
														<span class="thread-author">{message.author}</span>
														<span>{formatTimestamp(message.time)}</span>
													</div>
													<p class="thread-message-body">{message.message}</p>
												</article>
											{/each}
										</div>
									{/if}
								{/if}
							</article>
						{/each}
					{:else}
						<p class="annotation-empty-state">This snapshot does not have any annotations yet.</p>
					{/if}
				</div>

				<div class="annotation-column-footer">
					<p class="annotation-note-copy">
						Quillium stays free for local writing. Shared pages are snapshots people can read without an account.
					</p>
					<a href={downloadUrl} onclick={() => trackInstallClick('rail')} class="annotation-secondary-cta">
						Get Quillium
					</a>
				</div>
			</aside>
		</div>
	</section>
</main>

{#if modalAnnotation}
	<div
		class="annotation-modal-backdrop"
		role="presentation"
		onclick={(event) => event.currentTarget === event.target && closeAnnotationModal()}
	>
		<div class="annotation-modal-shell" in:scale={{ start: 0.96, duration: 180 }} out:fade={{ duration: 120 }}>
			<div class="annotation-modal-header">
				<div>
					<p class="workspace-eyebrow mb-2">{annotationLabel(modalAnnotation.type)}</p>
					<h2 class="annotation-modal-title">Read-only annotation details</h2>
				</div>
				<button type="button" class="annotation-modal-close" onclick={closeAnnotationModal} aria-label="Close annotation details">
					<X size={18} />
				</button>
			</div>

			<div class="annotation-modal-grid">
				<section class="annotation-modal-panel">
					<p class="annotation-modal-label">Attached text</p>
					<p class="annotation-modal-body">
						{modalAnnotation.type === 'revision'
							? getRequiredRevisionVersion(modalAnnotation).text
							: modalAnnotation.selectedText || '(collapsed selection)'}
					</p>
				</section>

				{#if modalAnnotation.type === 'suggestion'}
					<section class="annotation-modal-panel">
						<p class="annotation-modal-label">Suggested replacements</p>
						<div class="annotation-modal-stack">
							{#each modalAnnotation.replacements as replacement, index (`modal-suggestion-${index}`)}
								<article class="annotation-modal-item">
									<p class="annotation-modal-item-label">Option {index + 1}</p>
									<p class="annotation-modal-body">{replacement.text}</p>
									{#if replacement.rationale}
										<p class="annotation-modal-secondary">{replacement.rationale}</p>
									{/if}
								</article>
							{/each}
						</div>
					</section>
				{:else if modalAnnotation.type === 'revision'}
					<section class="annotation-modal-panel">
						<p class="annotation-modal-label">Revision versions</p>
						<div class="revision-version-tabs">
							{#each modalAnnotation.versions as version}
								<button
									type="button"
									class={`revision-version-chip ${version.index === getSelectedRevisionVersionIndex(modalAnnotation) ? 'revision-version-chip-active' : ''}`}
									onclick={() => selectRevisionVersion(modalAnnotation.id, version.index)}
									aria-pressed={version.index === getSelectedRevisionVersionIndex(modalAnnotation)}
								>
									<span>V{version.index + 1}</span>
									{#if version.label}
										<span>{version.label}</span>
									{/if}
									{#if version.index === modalAnnotation.activeVersionIndex}
										<span>Published</span>
									{/if}
								</button>
							{/each}
						</div>
						<div class="annotation-modal-stack">
							{#key `modal-revision-${modalAnnotation.id}-${getRequiredRevisionVersion(modalAnnotation).index}`}
									<article class="annotation-modal-item" in:fade={{ duration: 180 }} out:fade={{ duration: 140 }}>
										<p class="annotation-modal-item-label">
											Version {getRequiredRevisionVersion(modalAnnotation).index + 1}{getRequiredRevisionVersion(modalAnnotation).label ? ` · ${getRequiredRevisionVersion(modalAnnotation).label}` : ''}{getRequiredRevisionVersion(modalAnnotation).index === modalAnnotation.activeVersionIndex ? ' · published' : ' · previewing'}
										</p>
										<p class="annotation-modal-body">{getRequiredRevisionVersion(modalAnnotation).text}</p>
									</article>
							{/key}
						</div>
					</section>
				{/if}

				<section class="annotation-modal-panel">
					<p class="annotation-modal-label">Thread</p>
					{#if modalAnnotation.thread.length > 0}
						<div class="annotation-modal-stack">
							{#each modalAnnotation.thread as message (message.time)}
								<article class="annotation-modal-item">
									<div class="thread-message-meta">
										<span class="thread-author">{message.author}</span>
										<span>{formatTimestamp(message.time)}</span>
									</div>
									<p class="annotation-modal-body">{message.message}</p>
								</article>
							{/each}
						</div>
					{:else}
						<p class="annotation-empty-state">No thread messages were attached to this annotation.</p>
					{/if}
				</section>
			</div>
		</div>
	</div>
{/if}

<Footer />

<style>
	.share-shell {
		background:
			radial-gradient(circle at top, rgba(255, 255, 255, 0.88), transparent 36%),
			linear-gradient(180deg, #f7f7f4 0%, #eef0ec 100%);
	}

	.workspace-eyebrow,
	.editor-meta-label,
	.annotation-card-label,
	.annotation-modal-label {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(15, 23, 42, 0.42);
	}

	.editor-meta-copy,
	.rail-copy,
	.annotation-card-meta,
	.annotation-modal-secondary {
		font-size: 0.92rem;
		line-height: 1.6;
		color: rgba(15, 23, 42, 0.56);
	}

	.share-topbar-shell {
		position: sticky;
		top: 6rem;
		z-index: 20;
		display: flex;
		justify-content: center;
		margin-bottom: 2rem;
	}

	.share-topbar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.85rem;
		max-width: min(64rem, calc(100vw - 2rem));
		padding: 0.9rem 1.25rem;
		border-radius: 2rem;
		background: rgba(209, 213, 219, 0.72);
		border: 1px solid rgba(255, 255, 255, 0.36);
		box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
		backdrop-filter: blur(14px);
		animation: shareTopbarSettle 560ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.share-title-block {
		min-width: 0;
		text-align: center;
	}

	.share-title {
		font-size: 0.98rem;
		font-weight: 600;
		color: rgba(15, 23, 42, 0.82);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: min(32rem, 80vw);
	}

	.share-topbar-meta {
		font-size: 0.74rem;
		color: rgba(15, 23, 42, 0.54);
	}

	.annotation-secondary-cta,
	.revision-version-chip {
		border: 1px solid rgba(15, 23, 42, 0.08);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.72);
		padding: 0.4rem 0.72rem;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	.share-install-button {
		white-space: nowrap;
		box-shadow:
			0 10px 28px rgba(37, 99, 235, 0.22),
			inset 0 1px 0 rgba(255, 255, 255, 0.16);
	}

	.editor-sheet {
		width: min(816px, 100%);
		min-height: calc(100vh - 4rem);
		border: 1px solid rgba(15, 23, 42, 0.04);
		border-radius: 0.75rem;
		background: #fff;
		box-shadow:
			0 18px 60px rgba(15, 23, 42, 0.09),
			0 1px 0 rgba(255, 255, 255, 0.9) inset;
		padding: 0.75rem 0.25rem;
		animation: documentSheetSettle 620ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.editor-stage {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		gap: 1.5rem;
	}

	.share-document {
		display: grid;
		gap: 1.15rem;
		max-width: 816px;
		margin: 0 auto;
		padding: 0.5rem clamp(0.35rem, 1vw, 0.75rem) 3rem;
		font-family: Georgia, serif;
		font-size: 18px;
		line-height: 1.9;
		color: rgba(15, 23, 42, 0.82);
	}

	.share-paragraph {
		white-space: pre-wrap;
		word-break: break-word;
		text-indent: 2em;
	}

	.share-blank-line {
		display: block;
		min-height: 1.9em;
	}

	.annotation-inline {
		display: inline;
		margin: 0;
		padding: 0 0.08em;
		border: none;
		border-radius: 2px;
		background: transparent;
		box-decoration-break: clone;
		-webkit-box-decoration-break: clone;
		color: inherit;
		cursor: pointer;
		transition:
			background 0.16s ease,
			text-decoration-color 0.16s ease,
			color 0.16s ease,
			filter 0.16s ease;
	}

	.annotation-inline-comment {
		background-color: #fef2cd;
	}

	.annotation-inline-comment-active {
		background-color: #fcbc05;
	}

	.annotation-inline-suggestion {
		text-decoration: underline;
		text-decoration-color: #22c55e;
		text-decoration-thickness: 2px;
		text-underline-offset: 3px;
	}

	.annotation-inline-suggestion-active {
		background-color: #dcfce7;
		text-decoration: none;
	}

	.annotation-inline-revision {
		text-decoration: underline;
		text-decoration-color: #a855f7;
		text-decoration-thickness: 2px;
		text-underline-offset: 3px;
	}

	.annotation-inline-revision-active {
		background-color: #d8b4fe;
		text-decoration: none;
	}

	.annotation-inline:hover {
		filter: brightness(0.98);
	}

	.inline-marker-group {
		display: inline-flex;
		gap: 0.28rem;
		margin: 0 0.24rem;
		vertical-align: middle;
	}

	.annotation-marker {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.25rem;
		height: 1.25rem;
		padding: 0;
		border: 1px solid rgba(15, 23, 42, 0.08);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.95);
		box-shadow:
			0 6px 14px rgba(15, 23, 42, 0.05),
			inset 0 1px 0 rgba(255, 255, 255, 0.92);
		font-family: system-ui, -apple-system, sans-serif;
		font-size: 0.68rem;
		font-weight: 700;
		cursor: pointer;
	}

	.annotation-tone-comment {
		background: rgba(254, 242, 205, 0.94);
		color: rgba(180, 83, 9, 0.95);
	}

	.annotation-tone-suggestion {
		background: rgba(220, 252, 231, 0.94);
		color: rgba(21, 128, 61, 0.95);
	}

	.annotation-tone-revision {
		background: rgba(232, 213, 255, 0.94);
		color: rgba(126, 34, 206, 0.95);
	}

	.annotation-column {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		position: sticky;
		top: 9rem;
		width: 280px;
	}

	.annotation-column-note,
	.annotation-column-footer {
		padding: 0.2rem 0.1rem;
	}

	.annotation-note-label {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(15, 23, 42, 0.38);
	}

	.annotation-note-copy {
		font-size: 0.82rem;
		line-height: 1.55;
		color: rgba(15, 23, 42, 0.52);
	}

	.annotation-card-stack {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.annotation-card {
		border: 1px solid transparent;
		border-radius: 12px;
		padding: 0.7rem;
		box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
		backdrop-filter: blur(12px);
		transition:
			transform 0.16s ease,
			box-shadow 0.16s ease,
			border-color 0.16s ease,
			opacity 0.16s ease,
			background-color 0.2s ease;
	}

	.annotation-card:hover {
		transform: translateY(-1px);
	}

	.annotation-card-active {
		border-color: rgba(15, 23, 42, 0.1);
		box-shadow: 0 18px 32px rgba(15, 23, 42, 0.12);
		transform: translateY(-1px);
	}

	.annotation-card-comment {
		background: rgba(239, 246, 255, 0.88);
		border-color: rgba(191, 219, 254, 0.5);
	}

	.annotation-card-suggestion {
		background: rgba(240, 253, 244, 0.88);
		border-color: rgba(187, 247, 208, 0.5);
	}

	.annotation-card-revision {
		background: rgba(250, 245, 255, 0.9);
		border-color: rgba(221, 214, 254, 0.55);
	}

	.annotation-card-topline,
	.thread-message-meta {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.6rem;
	}

	.annotation-card-select {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		flex: 1;
		min-width: 0;
		background: transparent;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.annotation-card-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.8rem;
		height: 1.8rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.7);
	}

	.annotation-card-action {
		border: none;
		background: rgba(255, 255, 255, 0.55);
		border-radius: 999px;
		padding: 0.38rem 0.7rem;
		font-size: 0.7rem;
		font-weight: 700;
		color: rgba(15, 23, 42, 0.58);
		cursor: pointer;
	}

	.annotation-selection-chip,
	.annotation-modal-panel,
	.annotation-modal-item,
	.thread-message,
	.suggestion-option,
	.revision-version-card {
		border: 1px solid rgba(15, 23, 42, 0.06);
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.72);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.88);
	}

	.annotation-selection-chip {
		width: 100%;
		margin-top: 0.6rem;
		padding: 0.72rem 0.78rem;
		text-align: left;
		border-radius: 10px;
		font-size: 0.82rem;
		line-height: 1.5;
		color: rgba(15, 23, 42, 0.62);
		cursor: pointer;
	}

	.annotation-thread-stack,
	.annotation-option-stack,
	.revision-version-stack,
	.annotation-modal-stack,
	.revision-version-tabs {
		display: grid;
		gap: 0.55rem;
		margin-top: 0.6rem;
	}

	.thread-message,
	.suggestion-option,
	.revision-version-card,
	.annotation-modal-item {
		padding: 0.7rem 0.8rem;
	}

	.annotation-modal-item-label,
	.revision-version-label,
	.suggestion-option-label {
		font-size: 0.75rem;
		font-weight: 700;
		color: rgba(15, 23, 42, 0.78);
	}

	.thread-message-meta {
		font-size: 0.68rem;
		color: rgba(15, 23, 42, 0.44);
		margin-bottom: 0.28rem;
	}

	.thread-author {
		font-weight: 700;
		color: rgba(15, 23, 42, 0.7);
	}

	.thread-message-body,
	.suggestion-option-text,
	.revision-version-body,
	.annotation-modal-body,
	.annotation-empty-state {
		font-size: 0.84rem;
		line-height: 1.55;
		color: rgba(15, 23, 42, 0.68);
	}

	.suggestion-option-rationale {
		margin-top: 0.35rem;
		font-size: 0.76rem;
		line-height: 1.5;
		color: rgba(21, 128, 61, 0.74);
	}

	.revision-version-tabs {
		grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
	}

	.revision-version-chip {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		font-size: 0.66rem;
		font-weight: 700;
		color: rgba(15, 23, 42, 0.5);
		cursor: pointer;
		transition:
			transform 0.14s ease,
			box-shadow 0.14s ease,
			border-color 0.14s ease,
			background-color 0.14s ease;
	}

	.revision-version-chip:hover {
		transform: translateY(-1px);
	}

	.revision-version-chip-active,
	.revision-version-card-active {
		border-color: rgba(168, 85, 247, 0.28);
		box-shadow:
			0 0 0 1px rgba(168, 85, 247, 0.18),
			inset 0 1px 0 rgba(255, 255, 255, 0.92);
	}

	.revision-version-hint {
		font-size: 0.74rem;
		line-height: 1.5;
		color: rgba(15, 23, 42, 0.46);
		padding: 0.1rem 0.1rem 0;
	}

	.annotation-modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		background: rgba(15, 23, 42, 0.24);
		backdrop-filter: blur(10px);
	}

	.annotation-modal-shell {
		width: min(920px, 100%);
		max-height: min(88vh, 980px);
		overflow: auto;
		border: 1px solid rgba(15, 23, 42, 0.08);
		border-radius: 28px;
		background: rgba(247, 247, 244, 0.94);
		box-shadow: 0 36px 80px rgba(15, 23, 42, 0.22);
		padding: 1.25rem;
	}

	.annotation-modal-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.annotation-modal-title {
		font-family: Georgia, serif;
		font-size: clamp(1.55rem, 3vw, 2.35rem);
		line-height: 1.05;
		color: rgba(15, 23, 42, 0.92);
	}

	.annotation-modal-grid {
		display: grid;
		gap: 0.9rem;
	}

	.annotation-modal-panel {
		padding: 1rem;
	}

	.annotation-secondary-cta {
		display: inline-flex;
		align-self: flex-start;
		margin-top: 0.65rem;
		font-size: 0.72rem;
		font-weight: 700;
		color: rgba(15, 23, 42, 0.7);
	}

	.annotation-inline:focus-visible,
	.annotation-marker:focus-visible,
	.annotation-card-select:focus-visible,
	.annotation-selection-chip:focus-visible,
	.revision-version-chip:focus-visible,
	.annotation-card-action:focus-visible,
	.annotation-modal-close:focus-visible {
		outline: 2px solid rgba(37, 99, 235, 0.45);
		outline-offset: 2px;
	}

	@keyframes shareTopbarSettle {
		from {
			opacity: 0;
			transform: translateY(-10px) scale(0.985);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@keyframes documentSheetSettle {
		from {
			opacity: 0;
			transform: translateY(14px);
			box-shadow: 0 8px 28px rgba(15, 23, 42, 0.05);
		}
		to {
			opacity: 1;
			transform: translateY(0);
			box-shadow:
				0 18px 60px rgba(15, 23, 42, 0.09),
				0 1px 0 rgba(255, 255, 255, 0.9) inset;
		}
	}

	@media (max-width: 1120px) {
		.editor-stage {
			flex-direction: column;
			align-items: center;
		}

		.annotation-column {
			position: static;
			top: auto;
			width: min(816px, 100%);
		}
	}

	@media (max-width: 720px) {
		.share-topbar {
			padding: 0.85rem 1rem;
		}

		.share-document {
			font-size: 17px;
			line-height: 1.82;
			padding: 0.8rem 0 2rem;
		}

	}
</style>
