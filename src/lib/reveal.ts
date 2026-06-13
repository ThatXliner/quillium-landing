import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Idempotent: only animates `.reveal` elements it hasn't seen yet, so it can be
// re-run after a variant swap (e.g. hero=video) renders new `.reveal` nodes
// without double-animating the ones already wired up.
export function initReveal() {
	gsap.utils.toArray<HTMLElement>('.reveal:not([data-revealed])').forEach((el) => {
		el.dataset.revealed = '';

		const delay = el.classList.contains('reveal-delay-1')
			? 0.1
			: el.classList.contains('reveal-delay-2')
				? 0.2
				: el.classList.contains('reveal-delay-3')
					? 0.3
					: el.classList.contains('reveal-delay-4')
						? 0.45
						: 0;

		const rect = el.getBoundingClientRect();
		const alreadyVisible = rect.top < window.innerHeight;

		if (alreadyVisible) {
			// Already in viewport on load — animate immediately, no ScrollTrigger
			gsap.fromTo(
				el,
				{ opacity: 0, y: 48 },
				{ opacity: 1, y: 0, duration: 0.9, delay, ease: 'power3.out' }
			);
		} else {
			gsap.fromTo(
				el,
				{ opacity: 0, y: 48 },
				{
					opacity: 1,
					y: 0,
					duration: 0.9,
					delay,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: el,
						start: 'top 95%',
						once: true
					}
				}
			);
		}
	});

	// Trigger positions are measured now, but sections below the fold (e.g. the
	// Showcase carousel) contain lazy/poster images that load later and shift the
	// layout. Without a refresh, a stale start position can leave a section stuck
	// at opacity:0 — visible as a tall blank gap. Recompute once everything loads.
	if (document.readyState === 'complete') {
		ScrollTrigger.refresh();
	} else {
		window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
	}
}
