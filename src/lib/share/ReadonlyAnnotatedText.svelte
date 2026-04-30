<script lang="ts">
	import {
		annotationInlineClass,
		annotationToneClass,
		buildDisplayedShare,
		buildParagraphBlocks,
		getPrimaryInlineAnnotation,
		markerSymbol,
		type AnnotationId,
		type RevisionVersionSelections
	} from './rendering';
	import type { SerializedAnnotation } from './types';

	let {
		content,
		annotations = [],
		activeAnnotationId = null,
		revisionVersionSelections = {},
		onSelectAnnotation,
		indented = false,
		compact = false,
		class: className = ''
	}: {
		content: string;
		annotations?: SerializedAnnotation[];
		activeAnnotationId?: AnnotationId | null;
		revisionVersionSelections?: RevisionVersionSelections;
		onSelectAnnotation?: (id: AnnotationId) => void;
		indented?: boolean;
		compact?: boolean;
		class?: string;
	} = $props();

	const displayedShare = $derived(
		buildDisplayedShare(content, annotations, revisionVersionSelections)
	);
	const paragraphBlocks = $derived(
		buildParagraphBlocks(displayedShare.content, displayedShare.annotations)
	);
</script>

<div
	class="readonly-annotated-text {className}"
	class:is-indented={indented}
	class:is-compact={compact}
>
	{#each paragraphBlocks as paragraph (paragraph.id)}
		<div class="readonly-annotated-paragraph" class:is-blank={paragraph.isBlank}>
			{#if paragraph.leadingMarkers.length > 0}
				<span class="inline-marker-group">
					{#each paragraph.leadingMarkers as marker (marker.id)}
						<button
							type="button"
							class={`annotation-marker ${annotationToneClass(marker.type)}`}
							onclick={() => onSelectAnnotation?.(marker.id)}
							aria-pressed={activeAnnotationId === marker.id}
						>
							{markerSymbol(marker.type)}
						</button>
					{/each}
				</span>
			{/if}

			{#if paragraph.segments.length === 0}
				<span class="readonly-blank-line" aria-hidden="true"></span>
			{:else}
				{#each paragraph.segments as segment (segment.key)}
					{#if segment.annotationIds.length > 0}
						{@const primaryAnnotation = getPrimaryInlineAnnotation(
							segment.annotationIds,
							displayedShare.annotations,
							activeAnnotationId
						)}
						<button
							type="button"
							class={`annotation-inline ${annotationInlineClass(primaryAnnotation, activeAnnotationId === primaryAnnotation?.id)}`}
							onclick={() => primaryAnnotation && onSelectAnnotation?.(primaryAnnotation.id)}
							aria-pressed={activeAnnotationId === primaryAnnotation?.id}
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
									onclick={() => onSelectAnnotation?.(marker.id)}
									aria-pressed={activeAnnotationId === marker.id}
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

<style>
	.readonly-annotated-text {
		display: grid;
		gap: 0;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.readonly-annotated-paragraph {
		min-height: 1.6em;
	}

	.readonly-annotated-text.is-indented .readonly-annotated-paragraph {
		text-indent: 2em;
	}

	.readonly-annotated-text.is-compact .readonly-annotated-paragraph {
		min-height: 1.45em;
	}

	.readonly-blank-line {
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
		font: inherit;
		text-align: inherit;
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
		text-indent: 0;
	}

	.annotation-marker {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.25rem;
		height: 1.25rem;
		border: none;
		border-radius: 999px;
		font-size: 0.64rem;
		font-weight: 700;
		line-height: 1;
		cursor: pointer;
		box-shadow: 0 1px 2px rgba(15, 23, 42, 0.14);
		transition:
			transform 0.16s ease,
			box-shadow 0.16s ease;
	}

	.readonly-annotated-text.is-compact .annotation-marker {
		width: 1rem;
		height: 1rem;
		font-size: 0.55rem;
	}

	.annotation-marker:hover {
		transform: translateY(-1px);
		box-shadow: 0 3px 7px rgba(15, 23, 42, 0.18);
	}

	.annotation-tone-comment {
		background: #fcbc05;
		color: #5f4300;
	}

	.annotation-tone-suggestion {
		background: #22c55e;
		color: white;
	}

	.annotation-tone-revision {
		background: #a855f7;
		color: white;
	}
</style>
