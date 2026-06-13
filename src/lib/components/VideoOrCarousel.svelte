<script lang="ts">
	import { onMount } from 'svelte';
	import VideoEmbed from './VideoEmbed.svelte';
	import Showcase from './Showcase.svelte';

	let {
		videoId,
		/** poster the video uses; we also race its load to sniff a slow link */
		poster = '/video-poster.png',
		location = 'hero-video'
	}: {
		videoId: string;
		poster?: string;
		location?: string;
	} = $props();

	// Default to the video — it's the strongest conversion asset. We only fall back
	// to the lightweight Showcase carousel when the connection looks too slow to
	// stream a YouTube embed comfortably.
	//
	// `pending` while we sniff the connection (briefly), then `video` or `carousel`.
	// Server-render the video so the markup is there immediately; the swap only
	// happens client-side once we've measured the link.
	let mode = $state<'pending' | 'video' | 'carousel'>('video');

	// Browsers that can't report connection quality (Safari, Firefox) get a poster
	// load-race instead: if the poster's bytes don't arrive within this budget we
	// assume the link is too slow for video and show the carousel.
	const POSTER_TIMEOUT_MS = 2500;

	onMount(() => {
		// `navigator.connection` is non-standard (Chromium-only) and not in the DOM
		// lib types — read it defensively.
		const conn = (
			navigator as Navigator & {
				connection?: { effectiveType?: string; saveData?: boolean };
			}
		).connection;

		if (conn) {
			const slow =
				conn.saveData === true ||
				conn.effectiveType === '2g' ||
				conn.effectiveType === 'slow-2g';
			mode = slow ? 'carousel' : 'video';
			return;
		}

		// No Network Information API: race the poster load against a timeout. The
		// poster is a small image, so if even that can't land in time the link is
		// too slow to stream video. Whichever fires first wins; the other is a no-op
		// because `mode` only transitions away from `pending` once.
		mode = 'pending';
		let settled = false;
		const settle = (next: 'video' | 'carousel') => {
			if (settled) return;
			settled = true;
			mode = next;
		};

		const img = new Image();
		img.onload = () => settle('video');
		img.onerror = () => settle('carousel');
		img.src = poster;
		// Cached posters load synchronously-ish; `complete` covers that race.
		if (img.complete) settle('video');

		const timer = setTimeout(() => settle('carousel'), POSTER_TIMEOUT_MS);
		return () => clearTimeout(timer);
	});
</script>

{#if mode === 'carousel'}
	<!-- Showcase hides itself below 1200px (it was once a desktop-only extra). As
	     the spotty-connection fallback it's the ONLY media a small-screen visitor
	     gets, so force it visible here. -->
	<div class="carousel-fallback">
		<Showcase />
	</div>
{:else}
	<!-- `pending` also renders the video so SSR/no-JS visitors always get it -->
	<section class="hero-media-section">
		<div class="hero-media-inner">
			<VideoEmbed {videoId} {poster} {location} />
		</div>
	</section>
{/if}

<style>
	.hero-media-section {
		width: 100%;
		padding: clamp(2rem, 5vw, 4rem) 1.25rem 0;
	}
	.hero-media-inner {
		width: min(94vw, 980px);
		margin: 0 auto;
	}
	.carousel-fallback :global(.showcase) {
		display: block;
	}
</style>
