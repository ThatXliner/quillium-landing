<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	import editorImg from '$lib/assets/screenshots/01-editor.png';
	// import revisionsImg from '$lib/assets/screenshots/revisions.png';
	import revisionModalImg from '$lib/assets/screenshots/revision-modal.png';
	// import annotationsImg from '$lib/assets/screenshots/03-annotations.png';
	// import aiAnnotationsImg from '$lib/assets/screenshots/ai-annotations.png';
	// import annotationsBelongImg from '$lib/assets/screenshots/annotations-belong.png';

	const slides = [
		{ src: editorImg, alt: 'The Quillium editor — a clean, focused writing environment' },
		{ src: revisionModalImg, alt: 'Revision modal with the context sidebar' }
		// { src: annotationsImg, alt: 'All annotations' }
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
		/* width driven by image height: 50vh × 8/5 aspect ratio + padding */
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
		transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.carousel-slide {
		min-width: 100%;
		min-height: 100%;
		flex-shrink: 0;
	}
	.carousel-slide img {
		max-height: 70vh;
		width: auto;
		display: block;
		margin: 0 auto;
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
