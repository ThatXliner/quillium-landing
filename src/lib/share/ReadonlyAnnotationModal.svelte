<script lang="ts">
	import {
		Check,
		ChevronDown,
		ChevronRight,
		ChevronUp,
		MessageSquare,
		SparklesIcon,
		X
	} from '@lucide/svelte';
	import { slide } from 'svelte/transition';
	import ReadonlyAnnotatedText from './ReadonlyAnnotatedText.svelte';
	import ReadonlyAnnotationCard from './ReadonlyAnnotationCard.svelte';
	import ReadonlyThreadMessage from './ReadonlyThreadMessage.svelte';
	import {
		annotationLabel,
		buildDisplayedShare,
		buildRevisionContextLayers,
		findAnnotationPath,
		getSelectedRevisionVersion,
		getSelectedRevisionVersionIndex,
		previewVersionText,
		type AnnotationId,
		type AnnotationPathEntry,
		type RevisionContextLayer,
		type RevisionVersionSelections,
		type SerializedRevisionAnnotation
	} from './rendering';
	import type { SerializedAnnotation } from './types';

	let {
		annotation,
		rootContent = '',
		rootAnnotations = [],
		activeAnnotationId = null,
		revisionVersionSelections = {},
		onClose,
		onSelectAnnotation,
		onSelectRevisionVersion
	}: {
		annotation: SerializedAnnotation;
		rootContent?: string;
		rootAnnotations?: SerializedAnnotation[];
		activeAnnotationId?: AnnotationId | null;
		revisionVersionSelections?: RevisionVersionSelections;
		onClose: () => void;
		onSelectAnnotation?: (annotationId: AnnotationId) => void;
		onSelectRevisionVersion: (annotationId: AnnotationId, versionIndex: number) => void;
	} = $props();

	let openDropdown = $state(-1);
	let contextCollapsed = $state(false);
	let annotationsCollapsed = $state(false);

	const annotationPath = $derived.by((): AnnotationPathEntry[] => {
		return (
			findAnnotationPath(annotation.id, rootContent, rootAnnotations) ?? [
				{
					annotation,
					parentContent: rootContent,
					parentAnnotations: rootAnnotations,
					viaVersionIndex: null
				}
			]
		);
	});

	const revisionCrumbs = $derived(
		annotationPath.filter(
			(entry): entry is AnnotationPathEntry & { annotation: SerializedRevisionAnnotation } =>
				entry.annotation.type === 'revision'
		)
	);

	const selectedRevisionVersion = $derived(
		annotation.type === 'revision'
			? getSelectedRevisionVersion(annotation, revisionVersionSelections)
			: null
	);

	const selectedSuggestion = $derived(
		annotation.type === 'suggestion' ? (annotation.replacements[0] ?? null) : null
	);

	const displayedRevisionShare = $derived(
		selectedRevisionVersion
			? buildDisplayedShare(
					selectedRevisionVersion.text,
					selectedRevisionVersion.annotations ?? [],
					revisionVersionSelections,
					{ includeNestedAnnotations: false }
				)
			: { content: '', annotations: [] }
	);

	const revisionContextLayers = $derived(buildRevisionContextLayers(annotationPath));

	function selectedIndexForCrumb(
		entry: AnnotationPathEntry & { annotation: SerializedRevisionAnnotation }
	) {
		return (
			revisionVersionSelections[entry.annotation.id] ??
			entry.viaVersionIndex ??
			entry.annotation.activeVersionIndex
		);
	}

	function selectBreadcrumbVersion(
		entry: AnnotationPathEntry & { annotation: SerializedRevisionAnnotation },
		versionIndex: number,
		isCurrentRevision: boolean
	) {
		openDropdown = -1;
		onSelectRevisionVersion(entry.annotation.id, versionIndex);
		if (!isCurrentRevision) {
			onSelectAnnotation?.(entry.annotation.id);
		}
	}

	function selectNestedAnnotation(annotationId: AnnotationId) {
		onSelectAnnotation?.(annotationId);
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape') return;
		if (openDropdown !== -1) {
			openDropdown = -1;
			return;
		}
		onClose();
	}
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<div
	class="readonly-modal"
	role="presentation"
	onclick={(event) => event.currentTarget === event.target && onClose()}
>
	{#if annotation.type === 'revision'}
		<div class="revision-modal-inner">
			<div class="modal-header border-purple">
				<nav class="revision-breadcrumbs">
					{#each revisionCrumbs as crumb, ci}
						{@const isCurrent = crumb.annotation.id === annotation.id}
						{@const selectedVi = selectedIndexForCrumb(crumb)}

						{#if ci > 0}
							<ChevronRight size={10} class="shrink-0 text-purple-300/60" />
						{/if}

						<div class="flex items-center gap-1.5">
							{#if isCurrent}
								<span
									class="shrink-0 text-[10px] font-semibold tracking-wider text-purple-700/70 uppercase"
									>Revision</span
								>
							{:else}
								<button
									class="shrink-0 text-[10px] tracking-wider text-purple-400/60 uppercase transition-colors hover:text-purple-600/80"
									type="button"
									onclick={() => onSelectAnnotation?.(crumb.annotation.id)}
								>
									Revision
								</button>
							{/if}

							<div class="relative">
								<button
									class="version-trigger flex items-center gap-1 rounded-md py-0.5 pr-1.5 pl-2 text-[10px] font-medium transition-all duration-150 {isCurrent
										? 'bg-purple-100/70 text-purple-700/80 ring-1 ring-purple-200/60 hover:bg-purple-100'
										: 'bg-black/5 text-black/45 ring-1 ring-black/10 hover:bg-black/8'} {openDropdown ===
									ci
										? 'ring-2 ' + (isCurrent ? 'ring-purple-300/60' : 'ring-black/20')
										: ''}"
									type="button"
									onclick={(event) => {
										event.stopPropagation();
										openDropdown = openDropdown === ci ? -1 : ci;
									}}
								>
									<span class="max-w-[160px] truncate">
										{crumb.annotation.versions[selectedVi]?.label ??
											previewVersionText(crumb.annotation.versions[selectedVi])}
									</span>
									<ChevronDown
										size={9}
										class="transition-transform duration-200 {openDropdown === ci
											? 'rotate-180'
											: ''} {isCurrent ? 'text-purple-400/70' : 'text-black/30'}"
									/>
								</button>

								{#if openDropdown === ci}
									<div class="version-popover" style="transform-origin: top left;">
										{#each crumb.annotation.versions as version}
											{@const isSelected = version.index === selectedVi}
											<button
												class="version-option"
												class:version-option-active={isSelected}
												type="button"
												onclick={() => selectBreadcrumbVersion(crumb, version.index, isCurrent)}
											>
												<span class="flex-1 truncate text-left">
													{version.label ?? previewVersionText(version)}
												</span>
												{#if isSelected}
													<Check size={10} class="shrink-0 text-purple-500/70" />
												{/if}
											</button>
										{/each}
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</nav>

				<button type="button" class="modal-close" onclick={onClose} aria-label="Close revision">
					<span>esc</span>
					<X size={16} />
				</button>
			</div>

			<div class="revision-modal-body">
				<div class="revision-modal-thread">
					<div class="thread-panel-header">
						<span>Thread</span>
					</div>
					<div class="thread-panel-body">
						{#if annotation.thread.length === 0}
							<p class="empty-state">No messages yet.</p>
						{:else}
							<div class="thread-stack">
								{#each annotation.thread as message (message.time)}
									<ReadonlyThreadMessage {message} />
								{/each}
							</div>
						{/if}
					</div>
				</div>

				<div class="revision-modal-editor">
					<div class="revision-modal-document">
						<ReadonlyAnnotatedText
							content={selectedRevisionVersion?.text ?? ''}
							annotations={selectedRevisionVersion?.annotations ?? []}
							{activeAnnotationId}
							{revisionVersionSelections}
							onSelectAnnotation={selectNestedAnnotation}
						/>
					</div>
				</div>

				<div class="revision-right-panel">
					{#if revisionContextLayers.length > 0}
						<div class="context-panel">
							<button
								class="panel-toggle"
								type="button"
								onclick={() => (contextCollapsed = !contextCollapsed)}
							>
								<span>Context</span>
								{#if contextCollapsed}
									<ChevronDown size={10} class="text-purple-400/50" />
								{:else}
									<ChevronUp size={10} class="text-purple-400/50" />
								{/if}
							</button>
							{#if !contextCollapsed}
								<div transition:slide={{ duration: 180 }} class="relative">
									<div class="context-scroll">
										{#snippet renderLayer(depth: number)}
											{@const layer = revisionContextLayers[depth] as RevisionContextLayer}
											{@const isDeepest = depth === revisionContextLayers.length - 1}
											<span class="context-text context-depth-{depth}">
												{#if layer.before}<span class="context-surrounding">{layer.before}</span
													>{/if}<!--
												--><span class="context-nest context-nest-{Math.min(depth, 3)}"
													>{#if isDeepest}{layer.revision || '(empty)'}{:else}{@render renderLayer(
															depth + 1
														)}{/if}</span
												><!--
												-->{#if layer.after}<span class="context-surrounding"
														>{layer.after}</span
													>{/if}
											</span>
										{/snippet}
										{@render renderLayer(0)}
									</div>
								</div>
							{/if}
						</div>
					{/if}

					<div class="nested-annotations-panel">
						<button
							class="panel-toggle"
							type="button"
							onclick={() => (annotationsCollapsed = !annotationsCollapsed)}
						>
							<span>Annotations</span>
							{#if annotationsCollapsed}
								<ChevronDown size={10} class="text-purple-400/50" />
							{:else}
								<ChevronUp size={10} class="text-purple-400/50" />
							{/if}
						</button>
						{#if !annotationsCollapsed}
							<div transition:slide={{ duration: 180 }} class="nested-annotation-scroll">
								{#if displayedRevisionShare.annotations.length > 0}
									<div class="space-y-2">
										{#each displayedRevisionShare.annotations as nestedAnnotation (nestedAnnotation.id)}
											<ReadonlyAnnotationCard
												annotation={nestedAnnotation}
												active={activeAnnotationId === nestedAnnotation.id}
												{activeAnnotationId}
												{revisionVersionSelections}
												selectedRevisionVersionIndex={nestedAnnotation.type === 'revision'
													? getSelectedRevisionVersionIndex(
															nestedAnnotation,
															revisionVersionSelections
														)
													: null}
												onSelect={() => onSelectAnnotation?.(nestedAnnotation.id)}
												onSelectAnnotation={selectNestedAnnotation}
												onOpen={() => onSelectAnnotation?.(nestedAnnotation.id)}
												onSelectRevisionVersion={(versionIndex) =>
													onSelectRevisionVersion(nestedAnnotation.id, versionIndex)}
											/>
										{/each}
									</div>
								{:else}
									<p class="empty-state centered">No annotations yet.</p>
								{/if}
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{:else if annotation.type === 'comment'}
		<div class="comment-modal-inner">
			<div class="modal-header border-blue">
				<div class="flex min-w-0 flex-1 items-center gap-2">
					<MessageSquare size={13} class="shrink-0 text-blue-500/70" />
					<nav class="comment-breadcrumbs">
						{#each revisionCrumbs as crumb, ci}
							<button
								class="max-w-[120px] shrink-0 truncate text-[10px] text-blue-500/60 transition-colors hover:text-blue-700/80"
								type="button"
								onclick={() => onSelectAnnotation?.(crumb.annotation.id)}
							>
								Revision
							</button>
							<ChevronRight size={10} class="shrink-0 text-blue-300/60" />
						{/each}
						<span
							class="shrink-0 text-[10px] font-semibold tracking-wider text-blue-700/70 uppercase"
							>Comment</span
						>
					</nav>
				</div>
				<button type="button" class="modal-close" onclick={onClose} aria-label="Close comment">
					<span>esc</span>
					<X size={16} />
				</button>
			</div>

			<div class="comment-modal-body">
				<div class="comment-thread-main">
					{#if annotation.thread.length > 0}
						<div class="thread-stack">
							{#each annotation.thread as message (message.time)}
								<ReadonlyThreadMessage {message} />
							{/each}
						</div>
					{:else}
						<p class="empty-state">No thread messages were attached to this comment.</p>
					{/if}
				</div>
				<div class="comment-context-panel">
					<button type="button" class="panel-toggle blue-panel-toggle">
						<span>Context</span>
					</button>
					<div class="comment-context-scroll">
						<span class="comment-context-text">
							<span class="context-comment">{annotation.selectedText || '(empty)'}</span>
						</span>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="diff-modal-inner">
			<div class="modal-header border-green">
				<div class="flex min-w-0 flex-1 items-center gap-2">
					<SparklesIcon size={13} class="shrink-0 text-green-500/70" />
					<nav class="suggestion-breadcrumbs">
						{#each revisionCrumbs as crumb}
							<button
								class="max-w-[120px] shrink-0 truncate text-[10px] text-green-500/60 transition-colors hover:text-green-700/80"
								type="button"
								onclick={() => onSelectAnnotation?.(crumb.annotation.id)}
							>
								Revision
							</button>
							<ChevronRight size={10} class="shrink-0 text-green-300/60" />
						{/each}
						<span
							class="truncate text-[10px] font-semibold tracking-wider text-green-700/70 uppercase"
							>{annotationLabel(annotation)}</span
						>
					</nav>
				</div>
				<button type="button" class="modal-close" onclick={onClose} aria-label="Close suggestion">
					<span>esc</span>
					<X size={16} />
				</button>
			</div>

			<div class="diff-modal-body">
				<div class="diff-pane">
					{#if annotation.selectedText}
						<span class="diff-delete">{annotation.selectedText}</span>
					{/if}
					{#if selectedSuggestion}
						<span class="diff-insert">{selectedSuggestion.text}</span>
					{/if}
				</div>

				<div class="suggestion-sidebar">
					{#if annotation.thread[0]?.author === 'AI'}
						<div class="ai-comment">
							<p>{annotation.thread[0].message}</p>
						</div>
					{/if}
					<div class="replacement-stack">
						{#each annotation.replacements as replacement, index (`modal-suggestion-${index}`)}
							<article class="replacement-card" class:is-active={index === 0}>
								<p>{replacement.text}</p>
								{#if replacement.rationale}
									<p class="replacement-rationale">{replacement.rationale}</p>
								{/if}
							</article>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.readonly-modal {
		position: fixed;
		inset: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(4px);
	}

	.revision-modal-inner,
	.comment-modal-inner,
	.diff-modal-inner {
		display: flex;
		flex-direction: column;
		height: 72vh;
		overflow: hidden;
		border-radius: 1rem;
		background: white;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
	}

	.revision-modal-inner {
		width: min(1160px, 100%);
	}

	.comment-modal-inner {
		width: min(1060px, 100%);
	}

	.diff-modal-inner {
		width: min(820px, 100%);
	}

	.modal-header {
		display: flex;
		min-width: 0;
		flex-shrink: 0;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		border-bottom: 1px solid;
		padding: 0.75rem 1.25rem;
	}

	.border-purple {
		border-color: rgba(243, 232, 255, 0.8);
	}

	.border-blue {
		border-color: rgba(219, 234, 254, 0.8);
	}

	.border-green {
		border-color: rgba(220, 252, 231, 0.8);
	}

	.revision-breadcrumbs,
	.comment-breadcrumbs,
	.suggestion-breadcrumbs {
		display: flex;
		min-width: 0;
		flex: 1;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.375rem;
	}

	.modal-close {
		display: inline-flex;
		flex-shrink: 0;
		align-items: center;
		gap: 0.25rem;
		border-radius: 0.375rem;
		padding: 0.25rem 0.25rem 0.25rem 0.375rem;
		color: rgba(0, 0, 0, 0.3);
		transition:
			background-color 0.15s ease,
			color 0.15s ease;
	}

	.modal-close span {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 9px;
		line-height: 1;
		color: rgba(0, 0, 0, 0.2);
	}

	.modal-close:hover {
		background: rgba(0, 0, 0, 0.05);
		color: rgba(0, 0, 0, 0.6);
	}

	.version-popover {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		z-index: 10;
		min-width: 160px;
		max-width: 240px;
		overflow: hidden;
		border: 1px solid rgba(147, 112, 219, 0.15);
		border-radius: 10px;
		background: white;
		padding: 4px;
		box-shadow:
			0 8px 24px -4px rgba(0, 0, 0, 0.12),
			0 2px 8px -2px rgba(0, 0, 0, 0.08);
	}

	.version-option {
		display: flex;
		width: 100%;
		align-items: center;
		gap: 6px;
		border-radius: 6px;
		padding: 5px 8px;
		color: rgba(0, 0, 0, 0.6);
		font-size: 11px;
		cursor: pointer;
		transition:
			background 0.1s,
			color 0.1s;
	}

	.version-option:hover {
		background: rgba(147, 112, 219, 0.08);
		color: rgba(109, 40, 217, 0.85);
	}

	.version-option-active {
		background: rgba(147, 112, 219, 0.1);
		color: rgba(109, 40, 217, 0.9);
		font-weight: 500;
	}

	.revision-modal-body,
	.comment-modal-body,
	.diff-modal-body {
		display: flex;
		min-height: 0;
		flex: 1;
		overflow: hidden;
	}

	.revision-modal-thread {
		display: flex;
		width: 220px;
		min-height: 0;
		flex-shrink: 0;
		flex-direction: column;
		border-right: 1px solid rgba(243, 232, 255, 0.6);
		background: rgba(250, 245, 255, 0.9);
	}

	.thread-panel-header {
		flex-shrink: 0;
		border-bottom: 1px solid rgba(243, 232, 255, 0.5);
		padding: 0.75rem 1rem;
	}

	.thread-panel-header span,
	.panel-toggle span {
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(147, 51, 234, 0.6);
	}

	.thread-panel-body {
		flex: 1;
		overflow-y: auto;
		padding: 0.75rem 1rem;
	}

	.thread-stack,
	.replacement-stack {
		display: grid;
		gap: 0.8rem;
	}

	.revision-modal-editor {
		min-width: 0;
		flex: 1;
		overflow-y: auto;
		background: transparent;
		font-family: var(--doc-font-family, system-ui, sans-serif);
	}

	.revision-modal-document {
		min-height: 100%;
		padding: 20px 32px 32px;
		font-family: var(--doc-font-family, system-ui, sans-serif);
		font-size: 15px;
		line-height: 1.7;
		color: rgba(0, 0, 0, 0.76);
	}

	.revision-right-panel {
		display: flex;
		width: 18rem;
		min-height: 0;
		flex-shrink: 0;
		flex-direction: column;
		overflow-x: hidden;
		border-left: 1px solid rgba(243, 232, 255, 0.6);
		background: rgba(250, 245, 255, 0.2);
	}

	.context-panel {
		flex-shrink: 0;
		border-bottom: 1px solid rgba(243, 232, 255, 0.6);
	}

	.nested-annotations-panel {
		display: flex;
		min-height: 0;
		flex: 1;
		flex-direction: column;
	}

	.panel-toggle {
		display: flex;
		width: 100%;
		flex-shrink: 0;
		align-items: center;
		justify-content: space-between;
		padding: 0.625rem 1rem;
		transition: background-color 0.15s ease;
	}

	.panel-toggle:hover {
		background: rgba(250, 245, 255, 0.6);
	}

	.context-scroll {
		height: 200px;
		overflow-y: auto;
		padding: 10px 14px;
		background: rgba(245, 240, 255, 0.45);
		scrollbar-width: none;
		backdrop-filter: blur(12px) saturate(1.3);
		-webkit-backdrop-filter: blur(12px) saturate(1.3);
	}

	.context-scroll::-webkit-scrollbar,
	.nested-annotation-scroll::-webkit-scrollbar {
		display: none;
	}

	.context-text {
		font-family: var(--doc-font-family, system-ui, sans-serif);
		font-size: 11px;
		line-height: 1.7;
		color: rgba(80, 40, 120, 0.35);
		white-space: pre-wrap;
		word-break: break-word;
	}

	.context-depth-0 {
		display: block;
	}

	.context-nest {
		display: inline;
		border-radius: 4px;
		padding: 1px 3px;
	}

	.context-nest-0 {
		background: rgba(147, 112, 219, 0.1);
		color: rgba(88, 28, 135, 0.55);
		box-shadow: inset 0 0 0 1px rgba(147, 112, 219, 0.18);
	}

	.context-nest-1 {
		background: rgba(126, 87, 194, 0.16);
		color: rgba(88, 28, 135, 0.7);
		box-shadow: inset 0 0 0 1px rgba(126, 87, 194, 0.25);
	}

	.context-nest-2 {
		background: rgba(109, 40, 217, 0.2);
		color: rgba(88, 28, 135, 0.82);
		box-shadow: inset 0 0 0 1px rgba(109, 40, 217, 0.3);
	}

	.context-nest-3 {
		background: rgba(88, 28, 135, 0.24);
		color: rgba(88, 28, 135, 0.92);
		font-weight: 500;
		box-shadow: inset 0 0 0 1px rgba(88, 28, 135, 0.35);
	}

	.nested-annotation-scroll {
		min-height: 0;
		flex: 1;
		overflow-y: auto;
		padding: 0.5rem;
		scrollbar-width: none;
	}

	.comment-thread-main {
		min-width: 0;
		flex: 1;
		overflow-y: auto;
		padding: 1.25rem 1.5rem;
	}

	.comment-context-panel {
		display: flex;
		width: 33.333%;
		min-height: 0;
		flex-shrink: 0;
		flex-direction: column;
		border-left: 1px solid rgba(219, 234, 254, 0.6);
		background: rgba(239, 246, 255, 0.2);
	}

	.blue-panel-toggle span {
		color: rgba(37, 99, 235, 0.6);
	}

	.comment-context-scroll {
		flex: 1;
		overflow-y: auto;
		padding: 10px 14px;
		background: rgba(239, 246, 255, 0.45);
		backdrop-filter: blur(12px) saturate(1.3);
		-webkit-backdrop-filter: blur(12px) saturate(1.3);
	}

	.comment-context-text {
		display: block;
		font-family: var(--doc-font-family, system-ui, sans-serif);
		font-size: 11px;
		line-height: 1.7;
		color: rgba(30, 64, 120, 0.35);
		white-space: pre-wrap;
		word-break: break-word;
	}

	.context-comment {
		display: inline;
		border-radius: 4px;
		background: rgba(253, 224, 71, 0.25);
		padding: 1px 3px;
		color: rgba(120, 80, 10, 0.75);
		box-shadow: inset 0 0 0 1px rgba(253, 224, 71, 0.45);
	}

	.diff-pane {
		min-width: 0;
		flex: 1;
		overflow-y: auto;
		border-right: 1px solid rgba(240, 253, 244, 1);
		padding: 1.25rem 1.5rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.875rem;
		line-height: 1.65;
		color: rgba(0, 0, 0, 0.72);
	}

	.diff-delete,
	.diff-insert {
		border-radius: 0.125rem;
		padding: 0 0.125rem;
	}

	.diff-delete {
		background: rgba(254, 226, 226, 0.8);
		color: rgb(185, 28, 28);
		text-decoration: line-through;
	}

	.diff-insert {
		background: rgba(220, 252, 231, 0.9);
		color: rgb(21, 128, 61);
	}

	.suggestion-sidebar {
		display: flex;
		width: 16rem;
		flex-shrink: 0;
		flex-direction: column;
		overflow: hidden;
		border-left: 1px solid rgba(187, 247, 208, 0.6);
	}

	.ai-comment {
		border-bottom: 1px solid rgba(187, 247, 208, 0.6);
		padding: 1rem 1rem 0.75rem;
	}

	.ai-comment p,
	.replacement-card p {
		margin: 0;
	}

	.ai-comment p {
		font-size: 11px;
		line-height: 1.5;
		color: rgba(0, 0, 0, 0.55);
	}

	.suggestion-sidebar .replacement-stack {
		flex: 1;
		overflow-y: auto;
		padding: 0.75rem;
	}

	.replacement-card {
		border: 1px solid rgba(34, 197, 94, 0.16);
		border-radius: 0.65rem;
		background: rgba(255, 255, 255, 0.6);
		padding: 0.75rem;
	}

	.replacement-card.is-active {
		border-color: rgba(74, 222, 128, 0.5);
		background: rgba(220, 252, 231, 0.8);
		box-shadow: 0 0 0 1px rgba(74, 222, 128, 0.4);
	}

	.replacement-card p {
		font-size: 0.82rem;
		line-height: 1.55;
		color: rgba(0, 0, 0, 0.68);
	}

	.replacement-rationale {
		margin-top: 0.5rem !important;
		color: rgba(21, 128, 61, 0.72) !important;
	}

	.empty-state {
		margin: 0;
		font-size: 0.82rem;
		line-height: 1.55;
		color: rgba(0, 0, 0, 0.48);
	}

	.empty-state.centered {
		padding: 1rem 0.5rem;
		text-align: center;
		font-size: 11px;
		color: rgba(0, 0, 0, 0.3);
	}

	@media (max-width: 860px) {
		.readonly-modal {
			padding: 0.75rem;
		}

		.revision-modal-inner,
		.comment-modal-inner,
		.diff-modal-inner {
			height: min(88vh, 780px);
		}

		.revision-modal-body,
		.comment-modal-body,
		.diff-modal-body {
			display: block;
			overflow-y: auto;
		}

		.revision-modal-thread,
		.revision-right-panel,
		.comment-context-panel,
		.suggestion-sidebar {
			width: auto;
			border-width: 1px 0;
		}

		.revision-modal-editor,
		.comment-thread-main,
		.diff-pane {
			min-height: 18rem;
		}
	}
</style>
