<script lang="ts">
	import { MessageSquare, SparklesIcon, Split, X } from '@lucide/svelte';
	import { fade, scale } from 'svelte/transition';
	import ReadonlyThreadMessage from './ReadonlyThreadMessage.svelte';
	import type { SerializedAnnotation } from './types';

	let {
		annotation,
		selectedRevisionVersionIndex,
		onClose,
		onSelectRevisionVersion
	}: {
		annotation: SerializedAnnotation;
		selectedRevisionVersionIndex: number | null;
		onClose: () => void;
		onSelectRevisionVersion: (versionIndex: number) => void;
	} = $props();

	const selectedRevisionVersion = $derived(
		annotation.type === 'revision'
			? (annotation.versions.find((version) => version.index === selectedRevisionVersionIndex) ??
					annotation.versions[annotation.activeVersionIndex] ??
					annotation.versions[0] ??
					null)
			: null
	);

	const selectedSuggestion = $derived(
		annotation.type === 'suggestion' ? (annotation.replacements[0] ?? null) : null
	);

	const title = $derived(
		annotation.type === 'comment'
			? 'Comment'
			: annotation.type === 'suggestion'
				? 'AI Suggestion'
				: 'Revision'
	);
</script>

<div
	class="readonly-modal"
	role="presentation"
	onclick={(event) => event.currentTarget === event.target && onClose()}
>
	<div
		class="readonly-modal-inner"
		class:is-comment={annotation.type === 'comment'}
		class:is-suggestion={annotation.type === 'suggestion'}
		class:is-revision={annotation.type === 'revision'}
		in:scale={{ start: 0.96, duration: 180 }}
		out:fade={{ duration: 120 }}
	>
		<header class="modal-header">
			<div class="modal-breadcrumbs">
				{#if annotation.type === 'comment'}
					<MessageSquare size={13} class="text-blue-500/70" />
				{:else if annotation.type === 'suggestion'}
					<SparklesIcon size={13} class="text-green-500/70" />
				{:else}
					<Split size={13} class="text-purple-500/70" />
				{/if}
				<span class="crumb-current">{title}</span>
			</div>
			<button
				type="button"
				class="modal-close"
				onclick={onClose}
				aria-label="Close annotation details"
			>
				<span>esc</span>
				<X size={16} />
			</button>
		</header>

		<div class="modal-body">
			<section class="modal-main">
				{#if annotation.type === 'comment'}
					<div class="comment-thread">
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
						<button type="button" class="context-panel-header">
							<span>Context</span>
						</button>
						<div class="comment-context">
							<p>{annotation.selectedText || '(collapsed selection)'}</p>
						</div>
					</div>
				{:else if annotation.type === 'suggestion'}
					<div class="diff-pane">
						{#if annotation.selectedText}
							<span class="diff-delete">{annotation.selectedText}</span>
						{/if}
						{#if selectedSuggestion}
							<span class="diff-insert">{selectedSuggestion.text}</span>
						{/if}
					</div>
				{:else}
					<div class="revision-layout">
						<aside class="revision-sidebar">
							<p class="panel-label">Versions</p>
							<div class="version-tabs">
								{#each annotation.versions as version, i}
									{@const versionActive = version.index === selectedRevisionVersion?.index}
									<button
										type="button"
										class="version-chip"
										class:is-active={versionActive}
										onclick={() => onSelectRevisionVersion(version.index)}
									>
										<span>{version.label ?? `Version ${i + 1}`}</span>
										{#if version.index === annotation.activeVersionIndex}
											<span class="published-chip">Published</span>
										{/if}
									</button>
								{/each}
							</div>
						</aside>
						<section class="revision-document">
							<p>{selectedRevisionVersion?.text ?? ''}</p>
						</section>
					</div>
				{/if}
			</section>

			{#if annotation.type === 'suggestion'}
				<aside class="suggestion-sidebar">
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
				</aside>
			{:else if annotation.type === 'revision'}
				<aside class="modal-thread">
					<p class="panel-label">Thread</p>
					{#if annotation.thread.length > 0}
						<div class="thread-stack">
							{#each annotation.thread as message (message.time)}
								<ReadonlyThreadMessage {message} />
							{/each}
						</div>
					{:else}
						<p class="empty-state">No thread messages were attached to this annotation.</p>
					{/if}
				</aside>
			{/if}
		</div>
	</div>
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

	.readonly-modal-inner {
		display: flex;
		flex-direction: column;
		width: min(1060px, 100%);
		height: min(72vh, 780px);
		overflow: hidden;
		border-radius: 1rem;
		background: white;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
	}

	.readonly-modal-inner.is-suggestion {
		width: min(820px, 100%);
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		border-bottom: 1px solid rgba(191, 219, 254, 0.8);
		padding: 0.75rem 1.25rem;
	}

	.is-suggestion .modal-header {
		border-bottom-color: rgba(220, 252, 231, 0.8);
	}

	.is-revision .modal-header {
		border-bottom-color: rgba(233, 213, 255, 0.8);
	}

	.modal-breadcrumbs {
		display: flex;
		min-width: 0;
		flex: 1;
		align-items: center;
		gap: 0.4rem;
		flex-wrap: wrap;
	}

	.crumb-current {
		flex-shrink: 0;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(29, 78, 216, 0.7);
	}

	.is-suggestion .crumb-current {
		color: rgba(21, 128, 61, 0.72);
	}

	.is-revision .crumb-current {
		color: rgba(126, 34, 206, 0.72);
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

	.modal-body {
		display: flex;
		min-height: 0;
		flex: 1;
	}

	.modal-main {
		min-width: 0;
		flex: 1;
		overflow: auto;
	}

	.is-comment .modal-main {
		display: flex;
		overflow: hidden;
	}

	.comment-thread {
		min-height: 0;
		flex: 1;
		overflow: auto;
		padding: 1.25rem 1.5rem;
	}

	.comment-context-panel {
		display: flex;
		width: 33.333%;
		min-height: 0;
		flex-shrink: 0;
		flex-direction: column;
		border-left: 1px solid rgba(191, 219, 254, 0.6);
		background: rgba(239, 246, 255, 0.2);
	}

	.context-panel-header {
		flex-shrink: 0;
		border-bottom: 1px solid rgba(191, 219, 254, 0.55);
		padding: 0.65rem 1rem;
		text-align: left;
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(37, 99, 235, 0.6);
	}

	.comment-context {
		min-height: 0;
		flex: 1;
		overflow: auto;
		padding: 10px 14px;
		background: rgba(239, 246, 255, 0.45);
		backdrop-filter: blur(12px) saturate(1.3);
	}

	.comment-context p,
	.revision-document p {
		margin: 0;
		white-space: pre-wrap;
		word-break: break-word;
		font-family: var(--doc-font-family, system-ui, sans-serif);
		line-height: 1.7;
	}

	.comment-context p {
		font-size: 11px;
		color: rgba(30, 64, 120, 0.5);
	}

	.thread-stack,
	.replacement-stack,
	.version-tabs {
		display: grid;
		gap: 0.8rem;
	}

	.diff-pane {
		min-height: 100%;
		overflow: auto;
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

	.panel-label {
		margin: 0 0 0.55rem;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(0, 0, 0, 0.38);
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

	.ai-comment p {
		margin: 0;
		font-size: 11px;
		line-height: 1.5;
		color: rgba(0, 0, 0, 0.55);
	}

	.suggestion-sidebar .replacement-stack {
		flex: 1;
		overflow: auto;
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
		margin-top: 0.5rem;
		color: rgba(21, 128, 61, 0.72) !important;
	}

	.modal-thread {
		width: 320px;
		overflow: auto;
		border-left: 1px solid rgba(221, 214, 254, 0.6);
		background: rgba(248, 250, 252, 0.72);
		padding: 0.9rem;
	}

	.revision-layout {
		display: grid;
		grid-template-columns: 240px minmax(0, 1fr);
		min-height: 100%;
	}

	.revision-sidebar {
		border-right: 1px solid rgba(221, 214, 254, 0.6);
		background: rgba(250, 245, 255, 0.72);
		padding: 0.9rem;
	}

	.version-chip {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		border-radius: 0.5rem;
		background: rgba(255, 255, 255, 0.62);
		padding: 0.45rem 0.55rem;
		text-align: left;
		font-size: 0.74rem;
		font-weight: 650;
		color: rgba(0, 0, 0, 0.62);
		box-shadow: 0 0 0 1px rgba(168, 85, 247, 0.18);
	}

	.version-chip.is-active {
		background: rgba(168, 85, 247, 0.82);
		color: white;
	}

	.published-chip {
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.18);
		padding: 0.12rem 0.35rem;
		font-size: 0.58rem;
	}

	.revision-document {
		overflow: auto;
		padding: 1rem;
	}

	.revision-document p {
		font-size: 15px;
		color: rgba(0, 0, 0, 0.76);
	}

	.empty-state {
		font-size: 0.82rem;
		line-height: 1.55;
		color: rgba(0, 0, 0, 0.48);
	}

	@media (max-width: 760px) {
		.readonly-modal-inner {
			height: min(88vh, 780px);
		}

		.modal-body,
		.revision-layout,
		.is-comment .modal-main {
			display: block;
		}

		.modal-thread,
		.revision-sidebar,
		.comment-context-panel,
		.suggestion-sidebar {
			width: auto;
			border-width: 1px 0;
		}
	}
</style>
