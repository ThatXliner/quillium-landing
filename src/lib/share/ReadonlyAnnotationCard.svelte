<script lang="ts">
	import {
		ChevronDownIcon,
		GitBranchIcon,
		Maximize2,
		PlusIcon,
		SparklesIcon,
		Trash2,
		X
	} from '@lucide/svelte';
	import { scale } from 'svelte/transition';
	import ReadonlyThreadMessage from './ReadonlyThreadMessage.svelte';
	import type { SerializedAnnotation } from './types';

	let {
		annotation,
		active,
		selectedRevisionVersionIndex,
		onSelect,
		onOpen,
		onSelectRevisionVersion
	}: {
		annotation: SerializedAnnotation;
		active: boolean;
		selectedRevisionVersionIndex: number | null;
		onSelect: () => void;
		onOpen: () => void;
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
</script>

{#if annotation.type === 'comment'}
	<article
		class="editor-comment-card"
		class:is-active={active}
		in:scale={{ start: 0.96, duration: 220 }}
	>
		<div class="flex items-center justify-between px-3 pt-3 pb-0">
			<h3 class="text-[10px] font-semibold tracking-wider text-blue-600/70 uppercase">Comment</h3>
			<div class="flex items-center gap-0.5">
				<button
					class="rounded-md p-1 text-blue-400/50 transition-colors hover:bg-white/40 hover:text-blue-600/70"
					type="button"
					onclick={onOpen}
					title="Expand thread"
					aria-label="Expand comment thread"
				>
					<Maximize2 size={14} />
				</button>
				<button
					class="cursor-default rounded-md p-1 text-blue-400/30"
					type="button"
					disabled
					title="Read-only snapshot"
					aria-label="Delete comment unavailable on shared page"
				>
					<Trash2 size={16} />
				</button>
			</div>
		</div>

		{#if annotation.selectedText}
			<div class="px-3 pt-3 pb-0">
				<button
					class="w-full cursor-pointer truncate border-l-2 border-yellow-400/80 pl-2 text-left text-xs text-black/50 italic transition-colors hover:border-yellow-500/80 hover:text-black/70"
					type="button"
					onclick={onSelect}
					title="Jump to this comment in the document"
				>
					{annotation.selectedText.slice(0, 80)}{annotation.selectedText.length > 80 ? '...' : ''}
				</button>
			</div>
		{/if}

		<div class="px-3 pt-3 pb-3">
			{#if annotation.thread.length > 0}
				<div class="space-y-3">
					{#each active ? annotation.thread : annotation.thread.slice(0, 1) as message, i (message.time)}
						<ReadonlyThreadMessage {message} truncate={!active} />
						{#if !active && i === 0 && annotation.thread.length > 1}
							<p class="pl-9 text-[10px] text-black/40">
								{annotation.thread.length - 1} more repl{annotation.thread.length === 2
									? 'y'
									: 'ies'}
							</p>
						{/if}
					{/each}
				</div>
			{:else}
				<p class="text-xs leading-relaxed text-black/70">
					No thread messages were attached to this comment.
				</p>
			{/if}
		</div>
	</article>
{:else if annotation.type === 'suggestion'}
	<article
		class="editor-suggestion-card"
		class:is-active={active}
		in:scale={{ start: 0.96, duration: 220 }}
	>
		<div class="flex items-center justify-between px-3 pt-2.5 pb-0">
			<div class="flex items-center gap-1.5">
				<SparklesIcon size={11} class="text-green-500/70" />
				<h3 class="text-[10px] font-semibold tracking-wider text-green-600/70 uppercase">
					AI Suggestion
				</h3>
			</div>
			<button
				class="cursor-default rounded-md p-1 text-green-400/30"
				type="button"
				disabled
				title="Read-only snapshot"
			>
				<Trash2 size={16} />
			</button>
		</div>

		{#if annotation.thread.length > 0 && annotation.thread[0].author === 'AI'}
			<div class="px-3 pt-2 pb-0">
				<p class="text-[11px] leading-relaxed text-black/55">{annotation.thread[0].message}</p>
			</div>
		{/if}

		<div class="space-y-2 p-3">
			{#each annotation.replacements as replacement, index (`${annotation.id}-${index}`)}
				<button
					class="w-full overflow-hidden rounded-lg border text-left transition-colors {index === 0
						? 'border-green-400/50 bg-green-100/80 ring-1 ring-green-400/40'
						: 'border-green-100/60 bg-white/50 hover:border-green-200/60 hover:bg-white/70'}"
					type="button"
					onclick={onSelect}
				>
					<div class="px-3 py-2 text-xs leading-relaxed text-black/80">{replacement.text}</div>
					{#if replacement.rationale}
						<div
							class="border-t border-green-100/50 px-3 pt-1.5 pb-2 text-[10px] leading-snug text-green-700/60"
						>
							{replacement.rationale}
						</div>
					{/if}
				</button>
			{/each}
		</div>

		<div class="px-3 pb-2">
			<div class="flex items-center justify-between">
				<button
					class="flex items-center gap-1 text-[10px] text-green-700/60 transition-colors hover:text-green-700/80"
					type="button"
					onclick={onSelect}
				>
					<ChevronDownIcon size={12} />
					<span>View changes</span>
				</button>
				<button
					class="flex items-center gap-1 text-[10px] text-green-700/40 transition-colors hover:text-green-700/70"
					type="button"
					onclick={onOpen}
					title="Expand to full view"
				>
					<Maximize2 size={10} />
				</button>
			</div>
		</div>

		<div class="flex items-center gap-1.5 px-3 pb-3">
			<button
				aria-label="Branch instead"
				title="Convert to revision with original and suggestion as versions"
				class="flex cursor-default items-center gap-1 rounded-md bg-white/40 px-2 py-1 text-[11px] font-medium text-purple-600/70 ring-1 ring-green-200/50"
				type="button"
				disabled
			>
				<GitBranchIcon size={11} />
				<span>Branch</span>
			</button>
			<button
				disabled
				class="flex-1 cursor-default rounded-md bg-green-500/50 px-2 py-1 text-[11px] font-medium text-white ring-1 ring-green-400/30 transition-colors"
				type="button"
			>
				Apply
			</button>
		</div>
	</article>
{:else}
	<article
		class="editor-revision-card"
		class:is-active={active}
		in:scale={{ start: 0.96, duration: 220 }}
	>
		<div class="flex items-center justify-between px-3 pt-3 pb-2">
			<h3 class="text-[10px] font-semibold tracking-wider text-purple-600/70 uppercase">
				Revision
			</h3>
			<button
				class="cursor-default rounded-md p-1 text-purple-400/30"
				type="button"
				disabled
				title="Read-only snapshot"
			>
				<Trash2 size={16} />
			</button>
		</div>

		<div class="flex flex-wrap items-center gap-1 px-3 pb-2">
			{#each annotation.versions as version, i}
				{@const versionActive = version.index === selectedRevisionVersion?.index}
				<div
					class="inline-flex items-center overflow-hidden rounded-md {versionActive
						? 'bg-purple-500/80 ring-1 ring-purple-400/40'
						: 'bg-white/60 ring-1 ring-purple-200/40'}"
				>
					<button
						class="max-w-[120px] truncate px-2 py-1 text-[11px] font-medium transition-colors {versionActive
							? 'text-white'
							: 'text-black/65 hover:text-black/85'}"
						type="button"
						disabled={versionActive}
						title={version.text || '(empty)'}
						onclick={() => onSelectRevisionVersion(version.index)}
					>
						{version.label ?? (version.text.slice(0, 24) || `Version ${i + 1}`)}
					</button>
					<button
						class="py-1 pr-1.5 pl-0.5 transition-colors {versionActive
							? 'text-white/50'
							: 'text-black/25'} cursor-default"
						type="button"
						disabled
						title={`Delete version ${i + 1}`}
					>
						<X size={9} />
					</button>
				</div>
			{/each}
		</div>

		<div class="flex gap-1.5 px-3 pb-3">
			<button
				class="flex cursor-default items-center gap-1.5 rounded-md bg-white/50 px-2 py-1 text-[11px] font-medium text-purple-600/80 ring-1 ring-purple-200/40"
				type="button"
				disabled
				title="Create a new version"
			>
				<PlusIcon size={14} />
				<span>New Version</span>
			</button>
			<button
				class="ml-auto flex items-center gap-1 rounded-md bg-white/50 px-2 py-1 text-[11px] font-medium text-purple-600/60 ring-1 ring-purple-200/40 transition-colors hover:bg-white/70"
				type="button"
				onclick={onOpen}
				title="Expand editor"
			>
				<Maximize2 size={10} />
			</button>
		</div>

		{#if selectedRevisionVersion}
			<div class="mx-3 mb-3 overflow-hidden rounded-lg bg-white/60 ring-1 ring-white/40">
				<div class="revision-inline-preview">
					<p>{selectedRevisionVersion.text}</p>
				</div>
			</div>
		{/if}
	</article>
{/if}

<style>
	.editor-comment-card,
	.editor-suggestion-card,
	.editor-revision-card {
		border: 1px solid;
		overflow: hidden;
		backdrop-filter: blur(12px);
		transition:
			opacity 0.2s ease,
			box-shadow 0.2s ease,
			border-color 0.2s ease,
			background-color 0.2s ease;
	}

	.editor-comment-card {
		border-color: rgba(191, 219, 254, 0.4);
		border-radius: 12px;
		background: rgba(239, 246, 255, 0.6);
		box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
		opacity: 0.9;
	}

	.editor-comment-card.is-active {
		border-color: rgba(191, 219, 254, 0.6);
		border-radius: 14px;
		background: rgba(239, 246, 255, 0.9);
		box-shadow: 0 18px 34px rgba(15, 23, 42, 0.12);
		opacity: 1;
	}

	.editor-suggestion-card {
		border-color: rgba(187, 247, 208, 0.4);
		border-radius: 12px;
		background: rgba(240, 253, 244, 0.6);
		box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
		opacity: 0.9;
	}

	.editor-suggestion-card.is-active {
		border-color: rgba(187, 247, 208, 0.6);
		border-radius: 14px;
		background: rgba(240, 253, 244, 0.9);
		box-shadow: 0 18px 34px rgba(15, 23, 42, 0.12);
		opacity: 1;
	}

	.editor-revision-card {
		border-color: rgba(221, 214, 254, 0.4);
		border-radius: 14px;
		background: rgba(250, 245, 255, 0.6);
		box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
		opacity: 0.9;
		clip-path: inset(0 round 14px);
	}

	.editor-revision-card.is-active {
		border-color: rgba(221, 214, 254, 0.6);
		background: rgba(250, 245, 255, 0.9);
		box-shadow: 0 18px 34px rgba(15, 23, 42, 0.12);
		opacity: 1;
	}

	.revision-inline-preview {
		min-height: 220px;
		padding: 8px 10px 12px;
		font-family: var(--doc-font-family, 'SF Pro Text', system-ui, sans-serif);
		font-size: 13px;
		line-height: 1.6;
		color: rgba(0, 0, 0, 0.7);
	}
</style>
