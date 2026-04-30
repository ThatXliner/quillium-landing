<script lang="ts">
	import type { SerializedThreadMessage } from './types';

	let { message, truncate = false }: { message: SerializedThreadMessage; truncate?: boolean } =
		$props();

	function avatarInitials(author: string): string {
		return author
			.trim()
			.split(/\s+/)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase() ?? '')
			.join('');
	}

	function avatarColor(author: string): string {
		let hash = 0;
		for (let i = 0; i < author.length; i += 1) {
			hash = (hash * 31 + author.charCodeAt(i)) % 360;
		}
		return `hsl(${hash} 62% 48%)`;
	}

	function formatTime(ts: number) {
		return new Intl.DateTimeFormat('default', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		}).format(new Date(ts));
	}
</script>

<div class="flex gap-2.5">
	<div
		class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white shadow-sm"
		style={`background: ${avatarColor(message.author)};`}
		title={message.author}
	>
		{avatarInitials(message.author)}
	</div>
	<div class="min-w-0 flex-1">
		<div class="flex items-baseline gap-1.5">
			<span class="text-xs font-semibold text-black/80">{message.author}</span>
			<span class="text-[10px] text-black/40">{formatTime(message.time)}</span>
		</div>
		<p
			class="mt-0.5 text-xs leading-relaxed text-black/70 {truncate
				? 'truncate'
				: 'whitespace-pre-wrap'}"
		>
			{message.message}
		</p>
	</div>
</div>
