<script lang="ts">
	import posthog from 'posthog-js';
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { X } from '@lucide/svelte';
	import ReadonlyAnnotationCard from '$lib/share/ReadonlyAnnotationCard.svelte';

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

	function annotationLabel(type: ShareAnnotation['type']) {
		if (type === 'comment') return 'Comment';
		if (type === 'suggestion') return 'Suggestion';
		return 'Revision';
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

	function getRequiredRevisionVersion(annotation: Extract<ShareAnnotation, { type: 'revision' }>) {
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

	function buildDisplayedShare(content: string, annotations: ShareAnnotation[]): DisplayShare {
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
				...nextAnnotations.filter(
					(annotation) => !mappedNestedAnnotations.some((nested) => nested.id === annotation.id)
				),
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

	const paragraphBlocks = $derived(
		buildParagraphBlocks(displayedShare.content, displayAnnotations)
	);

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
	<meta
		name="description"
		content={data.share.excerpt || 'A read-only document shared from Quillium.'}
	/>
	<link rel="canonical" href={data.share.canonicalUrl} />
	<meta property="og:title" content={`${data.share.title} · Shared via Quillium`} />
	<meta
		property="og:description"
		content={data.share.excerpt || 'A read-only document shared from Quillium.'}
	/>
	<meta property="og:url" content={data.share.canonicalUrl} />
	<meta property="og:type" content="article" />
</svelte:head>

<main class="share-shell min-h-screen px-4 pt-4 pb-12 sm:px-6">
	<section class="mx-auto max-w-[1320px]">
		<div class="share-topbar-shell">
			<div class="share-topbar" in:fly={{ y: -18, duration: 420 }}>
				<div class="share-status">
					<span class="share-status-dot"></span>
					<span>Read-only</span>
				</div>
				<div class="share-topbar-divider"></div>
				<div class="share-title-block">
					<p class="share-title">{data.share.title}</p>
					<p class="share-topbar-meta">
						{data.share.authorName || 'Shared from Quillium'} · {formatPublishedAt(
							data.share.publishedAt
						)}
					</p>
				</div>
				<div class="share-topbar-divider share-topbar-divider-optional"></div>
				<a
					href={downloadUrl}
					onclick={() => trackInstallClick('toolbar')}
					class="btn-primary share-install-button"
				>
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
				<div class="annotation-card-stack">
					{#if sortedAnnotations.length > 0}
						{#each sortedAnnotations as annotation (annotation.id)}
							<ReadonlyAnnotationCard
								{annotation}
								active={activeInlineAnnotationId === annotation.id}
								selectedRevisionVersionIndex={annotation.type === 'revision'
									? getSelectedRevisionVersionIndex(annotation)
									: null}
								onSelect={() => selectAnnotation(annotation.id)}
								onOpen={() => openAnnotationModal(annotation.id)}
								onSelectRevisionVersion={(versionIndex) =>
									selectRevisionVersion(annotation.id, versionIndex)}
							/>
						{/each}
					{:else}
						<p class="annotation-empty-state">This snapshot does not have any annotations yet.</p>
					{/if}
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
		<div
			class="annotation-modal-shell"
			in:scale={{ start: 0.96, duration: 180 }}
			out:fade={{ duration: 120 }}
		>
			<div class="annotation-modal-header">
				<div>
					<p class="workspace-eyebrow mb-2">{annotationLabel(modalAnnotation.type)}</p>
					<h2 class="annotation-modal-title">Read-only annotation details</h2>
				</div>
				<button
					type="button"
					class="annotation-modal-close"
					onclick={closeAnnotationModal}
					aria-label="Close annotation details"
				>
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
								<article
									class="annotation-modal-item"
									in:fade={{ duration: 180 }}
									out:fade={{ duration: 140 }}
								>
									<p class="annotation-modal-item-label">
										Version {getRequiredRevisionVersion(modalAnnotation).index +
											1}{getRequiredRevisionVersion(modalAnnotation).label
											? ` · ${getRequiredRevisionVersion(modalAnnotation).label}`
											: ''}{getRequiredRevisionVersion(modalAnnotation).index ===
										modalAnnotation.activeVersionIndex
											? ' · published'
											: ' · previewing'}
									</p>
									<p class="annotation-modal-body">
										{getRequiredRevisionVersion(modalAnnotation).text}
									</p>
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
						<p class="annotation-empty-state">
							No thread messages were attached to this annotation.
						</p>
					{/if}
				</section>
			</div>
		</div>
	</div>
{/if}

<style>
	.share-shell {
		background: #f5f4f1;
	}

	.workspace-eyebrow,
	.annotation-modal-label {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(15, 23, 42, 0.42);
	}

	.annotation-modal-secondary {
		font-size: 0.92rem;
		line-height: 1.6;
		color: rgba(15, 23, 42, 0.56);
	}

	.share-topbar-shell {
		position: sticky;
		top: 1rem;
		z-index: 40;
		display: flex;
		justify-content: center;
		margin-bottom: 3rem;
		pointer-events: none;
	}

	.share-topbar {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		max-width: min(100%, 42rem);
		min-width: 0;
		padding: 0.5rem 1.5rem;
		border-radius: 2rem;
		background: rgba(209, 213, 219, 0.7);
		border: 1px solid rgba(255, 255, 255, 0.3);
		box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
		backdrop-filter: blur(14px);
		animation: shareTopbarSettle 560ms cubic-bezier(0.16, 1, 0.3, 1);
		pointer-events: auto;
	}

	.share-status {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		flex-shrink: 0;
		font-size: 0.875rem;
		color: rgba(0, 0, 0, 0.9);
	}

	.share-status-dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 999px;
		background: #4ade80;
	}

	.share-topbar-divider {
		width: 1px;
		height: 2rem;
		flex-shrink: 0;
		background: rgba(0, 0, 0, 0.2);
	}

	.share-title-block {
		min-width: 0;
		text-align: center;
	}

	.share-title {
		font-size: 0.875rem;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.6);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: min(24rem, 42vw);
	}

	.share-topbar-meta {
		margin-top: 0.05rem;
		font-size: 0.68rem;
		color: rgba(0, 0, 0, 0.42);
	}

	.revision-version-chip {
		border: 1px solid rgba(15, 23, 42, 0.08);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.72);
		padding: 0.4rem 0.72rem;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	.share-install-button {
		min-height: 2.4rem;
		border-radius: 999px;
		padding: 0 1rem;
		font-size: 0.78rem;
		white-space: nowrap;
		box-shadow:
			0 10px 28px rgba(37, 99, 235, 0.22),
			inset 0 1px 0 rgba(255, 255, 255, 0.16);
	}

	.editor-sheet {
		width: min(816px, 100%);
		min-height: calc(100vh - 4rem);
		border-radius: 0.5rem;
		background: #fff;
		box-shadow: 0 20px 46px rgba(15, 23, 42, 0.18);
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
		gap: 0;
		max-width: 816px;
		margin: 0 auto;
		padding: 0.5rem clamp(0.35rem, 1vw, 0.75rem) 3rem;
		font-family: var(--doc-font-family, 'SF Pro Text', system-ui, sans-serif);
		font-size: 18px;
		line-height: 1.6;
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
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
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
		position: sticky;
		top: 5.25rem;
		width: 280px;
	}

	.annotation-card-stack {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.annotation-modal-panel,
	.annotation-modal-item {
		border: 1px solid rgba(15, 23, 42, 0.06);
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.72);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.88);
	}

	.annotation-modal-stack,
	.revision-version-tabs {
		display: grid;
		gap: 0.55rem;
		margin-top: 0.6rem;
	}

	.annotation-modal-item {
		padding: 0.7rem 0.8rem;
	}

	.annotation-modal-item-label,
	.revision-version-label {
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

	.revision-version-body,
	.annotation-modal-body,
	.annotation-empty-state {
		font-size: 0.84rem;
		line-height: 1.55;
		color: rgba(15, 23, 42, 0.68);
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

	.revision-version-chip-active {
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

	.annotation-inline:focus-visible,
	.annotation-marker:focus-visible,
	.revision-version-chip:focus-visible,
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
			gap: 0.75rem;
			padding: 0.5rem 1rem;
		}

		.share-topbar-divider-optional,
		.share-install-button {
			display: none;
		}

		.share-title {
			max-width: min(16rem, 48vw);
		}

		.share-document {
			font-size: 18px;
			line-height: 1.6;
			padding: 0.8rem 0 2rem;
		}
	}
</style>
