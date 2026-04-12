import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initReveal() {
	gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
		const delay = el.classList.contains('reveal-delay-1')
			? 0.1
			: el.classList.contains('reveal-delay-2')
				? 0.2
				: el.classList.contains('reveal-delay-3')
					? 0.3
					: el.classList.contains('reveal-delay-4')
						? 0.45
						: 0;

		gsap.fromTo(
			el,
			{ opacity: 0, y: 24 },
			{
				opacity: 1,
				y: 0,
				duration: 0.7,
				delay,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: el,
					start: 'top 95%',
					once: true
				}
			}
		);
	});
}
