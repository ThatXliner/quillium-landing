<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	import editorImg from '$lib/assets/screenshots/01-editor.png';
	import commentActiveImg from '$lib/assets/screenshots/04-comment-active.png';
	import revisionActiveImg from '$lib/assets/screenshots/05-revision-active.png';
	import libraryImg from '$lib/assets/screenshots/06-library.png';
	import revisionModalImg from '$lib/assets/screenshots/07-revision-modal.png';
	import dictionaryImg from '$lib/assets/screenshots/10-dictionary.png';
	import inlineImg from '$lib/assets/screenshots/13-inline-nested-revision.png';

	const slides = [
		{ src: editorImg, alt: 'The Quillium editor — a clean, focused writing environment' },
		{ src: commentActiveImg, alt: 'An active comment thread in the annotation sidebar' },
		{ src: revisionActiveImg, alt: 'An active revision thread in the annotation sidebar' },
		{ src: libraryImg, alt: 'The library sidebar, showing all documents in the library' },
		{ src: dictionaryImg, alt: 'The dictionary sidebar, showing definitions for a selected word' },
		{ src: revisionModalImg, alt: 'Revision modal with the context sidebar' },
		{ src: inlineImg, alt: 'Inline revisions in a revision modal!' }
	];

	let current = 0;
	let timer: ReturnType<typeof setInterval>;

	function goTo(i: number) {
		current = i;
		resetTimer();
	}

	function resetTimer() {
		clearInterval(timer);
		timer = setInterval(() => {
			current = (current + 1) % slides.length;
		}, 5000);
	}

	onMount(() => resetTimer());
	onDestroy(() => clearInterval(timer));
</script>

<section class="showcase reveal">
	<div class="showcase-window">
		<div class="carousel-track" style="transform: translateX(-{current * 100}%)">
			{#each slides as slide}
				<div class="carousel-slide">
					<img src={slide.src} alt={slide.alt} />
				</div>
			{/each}
		</div>
	</div>
	<div class="carousel-dots">
		{#each slides as _, i}
			<button
				class="dot"
				class:dot--active={current === i}
				on:click={() => goTo(i)}
				aria-label="Go to screenshot {i + 1}"
			></button>
		{/each}
	</div>
</section>

<style>
	.showcase {
		margin: 0 auto;
		padding: 0 24px 64px;
		max-width: calc(70vh * 8 / 5 + 48px);
	}
	@media (max-width: 1200px) {
		.showcase {
			display: none;
		}
	}
	.showcase-window {
		overflow: hidden;
		border-radius: 12px;
		box-shadow:
			0 12px 48px rgba(44, 42, 39, 0.12),
			0 4px 12px rgba(44, 42, 39, 0.06);
		border: 1px solid rgba(0, 0, 0, 0.06);
	}
	.carousel-track {
		display: flex;
		width: 100%;
		transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.carousel-slide {
		width: 100%;
		flex: 0 0 100%;
		line-height: 0;
	}
	.carousel-slide img {
		max-height: 70vh;
		width: 100%;
		aspect-ratio: 8 / 5;
		object-fit: cover;
		display: block;
	}
	.carousel-dots {
		display: flex;
		justify-content: center;
		gap: 8px;
		margin-top: 20px;
	}
	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.15);
		border: none;
		cursor: pointer;
		padding: 0;
		transition:
			background 0.2s,
			transform 0.2s;
	}
	.dot--active {
		background: rgba(0, 0, 0, 0.5);
		transform: scale(1.3);
	}
</style>
