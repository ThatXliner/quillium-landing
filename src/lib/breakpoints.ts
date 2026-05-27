export const MOBILE_BREAKPOINT = 768;

export function isMobile(): boolean {
	return typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT;
}
