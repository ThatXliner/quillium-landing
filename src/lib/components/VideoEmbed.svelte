<script lang="ts">
	import { untrack } from 'svelte';
	import { Play } from '@lucide/svelte';
	import posthog from 'posthog-js';

	let {
		videoId,
		title = 'Quillium — the non-linear writing app',
		poster = '/video-poster.png',
		eager = false,
		location = 'hero'
	}: {
		videoId: string;
		title?: string;
		poster?: string;
		/** autoplay (muted) immediately instead of click-to-play */
		eager?: boolean;
		location?: string;
	} = $props();

	// `eager` is a static prop; capture its initial value intentionally.
	let activated = $state(untrack(() => eager));

	// privacy-nocookie domain; mute+autoplay+loop only in eager (hero) mode
	let embedSrc = $derived(
		`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1` +
			(eager ? `&autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0` : `&autoplay=1`)
	);

	function activate() {
		if (activated) return;
		activated = true;
		posthog.capture('video_play_clicked', { location, video_id: videoId });
	}
</script>

<div class="video-frame">
	{#if activated}
		<iframe
			src={embedSrc}
			{title}
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
			loading="lazy"
		></iframe>
	{:else}
		<button class="poster-btn" onclick={activate} aria-label="Play video">
			<img src={poster} alt={title} loading="eager" />
			<span class="play-badge">
				<Play size={26} strokeWidth={2} fill="currentColor" />
			</span>
		</button>
	{/if}
</div>

<style>
	.video-frame {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		border-radius: 16px;
		background: #e5e7eb;
		box-shadow:
			0 24px 64px rgba(44, 42, 39, 0.14),
			0 6px 18px rgba(44, 42, 39, 0.06);
	}
	.video-frame iframe {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}
	.poster-btn {
		display: block;
		width: 100%;
		height: 100%;
		padding: 0;
		border: 0;
		cursor: pointer;
		background: none;
	}
	.poster-btn img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.play-badge {
		position: absolute;
		top: 50%;
		left: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 84px;
		height: 84px;
		transform: translate(-50%, -50%);
		border-radius: 9999px;
		color: #fff;
		background: rgba(20, 20, 22, 0.55);
		backdrop-filter: blur(8px);
		box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
		transition:
			transform 0.25s cubic-bezier(0.33, 0, 0.2, 1),
			background 0.25s;
		padding-left: 4px;
	}
	.poster-btn:hover .play-badge {
		transform: translate(-50%, -50%) scale(1.08);
		background: rgba(59, 130, 246, 0.85);
	}
</style>
