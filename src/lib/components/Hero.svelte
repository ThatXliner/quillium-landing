<script>
	import { onMount } from 'svelte';
	import posthog from 'posthog-js';

	let displayedText = $state('');
	const fullText = 'Prose for ';
	const typingSpeed = 100;
	let showPros = $state(false);
	let showPeriod = $state(false);
	let showCursor = $state(true);

	onMount(() => {
		let i = 0;
		const interval = setInterval(() => {
			if (i < fullText.length) {
				displayedText = fullText.slice(0, i + 1);
				i++;
			} else {
				showPros = true;
				clearInterval(interval);
				setTimeout(() => {
					showPeriod = true;
					setTimeout(() => {
						showCursor = false;
					}, 600);
				}, typingSpeed);
			}
		}, typingSpeed);

		return () => clearInterval(interval);
	});
</script>

<!-- ==================== HERO ==================== -->
<section
	class="flex min-h-screen flex-col items-center justify-center px-8 pt-32 pb-24 text-center"
>
	<div
		class="mb-4 flex h-[120px] w-[120px] items-center justify-center rounded-[32px] border-[1.5px] border-white/35 bg-radial-[at_40%_35%] from-[#eceef2] to-[#cdd1d9] transition-transform duration-400 hover:scale-105 hover:-rotate-2"
	>
		<img src="/logo.svg" alt="Quillium mark" width="96" height="96" />
	</div>

	<p class="reveal mb-4 text-[0.75rem] font-semibold tracking-[0.15em] text-black/35 uppercase">
		The Non-Linear Writing Canvas
	</p>

	<h1
		class="reveal reveal-delay-1 mb-6 max-w-[700px] font-[Newsreader,Georgia,serif] text-[clamp(2.8rem,6vw,4.5rem)] leading-[1.15] font-normal tracking-[-0.03em] text-black/88"
	>
		{displayedText}{#if showPros}<span class="italic">Pros</span>{/if}{#if showPeriod}.{/if}<span
			class="typing-cursor"
			class:hidden={!showCursor}>|</span
		>
	</h1>

	<p class="reveal reveal-delay-2 mb-12 max-w-[520px] text-[1.1rem] leading-[1.7] text-black/50">
		For the novelist who writes the same chapter four different ways. For the essayist who doesn't
		know the thesis until page three. Quillium keeps every version, so nothing is ever lost.
	</p>

	<div class="reveal reveal-delay-3 flex flex-wrap items-center justify-center gap-4">
		<a
			href="#waitlist"
			class="btn-primary"
			onclick={() => posthog.capture('cta_clicked', { cta: 'join_waitlist', location: 'hero' })}
			>Join the Waitlist</a
		>
		<a
			href="#features"
			class="inline-flex items-center gap-2 rounded-[10px] bg-white/50 px-6 py-3 text-[0.95rem] font-medium text-black/88 no-underline shadow-md inset-shadow-sm inset-shadow-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-50/30"
		>
			See how it works
		</a>
	</div>

	<p class="reveal reveal-delay-4 mt-6 text-[0.85rem] font-medium tracking-wide text-black/40">
		Coming April 2nd
	</p>

	<div
		class="reveal reveal-delay-4 mt-16 flex items-center gap-8 border-t border-black/4 pt-12 max-md:flex-col max-md:gap-4"
	>
		<div class="flex gap-2">
			<span class="h-2 w-2 rounded-full bg-[#3b82f6]"></span>
			<span class="h-2 w-2 rounded-full bg-[#a855f7]"></span>
			<span class="h-2 w-2 rounded-full bg-[#22c55e]"></span>
			<span class="h-2 w-2 rounded-full bg-[#fcbc05]"></span>
		</div>
	</div>
</section>

<style>
	.typing-cursor {
		font-weight: 300;
		animation: blink 0.6s step-end infinite;
	}
	.typing-cursor.hidden {
		display: none;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
