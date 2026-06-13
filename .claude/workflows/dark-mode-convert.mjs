export const meta = {
	name: 'dark-mode-convert',
	description: 'Convert hardcoded colours to design tokens for dark-mode support across all components/pages',
	phases: [
		{ title: 'Convert', detail: 'one agent per file: hardcoded colours → CSS var() tokens' },
		{ title: 'Verify', detail: 'adversarial check: stray light-only colours + dark contrast' }
	]
};

// The token contract every agent must follow. Kept verbatim in both the
// convert and verify prompts so they share one source of truth.
const TOKENS = `
DESIGN TOKENS (defined in src/routes/layout.css, light values in :root, dark in @media (prefers-color-scheme: dark)):
  SURFACES
    --bg            page background            (light #f5f4f1 / dark #171310)
    --surface       card / panel fill          (light #fffefb / dark #211b16)
    --surface-2     nested / inset / input fill (light #faf9f7 / dark #1e1c1a)
  TEXT (these replace the ~177 rgba(0,0,0,α) uses — map by opacity tier)
    --text-strong   headings / primary copy    (~rgba(0,0,0,0.88-0.9))
    --text          body copy                  (~rgba(0,0,0,0.7-0.8))
    --text-soft     secondary copy             (~rgba(0,0,0,0.5-0.6))
    --text-faint    captions/fine print/hints  (~rgba(0,0,0,0.4-0.45))
  LINES & ELEVATION
    --border        hairline divider/card edge (~rgba(0,0,0,0.05-0.1))
    --border-strong stronger border           (~rgba(0,0,0,0.15-0.2))
    --shadow-color  rgb triple for shadows; use as rgba(var(--shadow-color), α)
  GLASS (fixed nav only)
    --nav-glass, --nav-glass-solid, --nav-glass-border
  BRAND ACCENTS — identical in BOTH themes, do NOT make theme-dependent:
    --accent-blue #3b82f6, --accent-blue-deep #2563eb,
    --accent-purple #a855f7, --accent-purple-deep #9333ea,
    --accent-green #22c55e, --accent-green-deep #16a34a,
    --accent-amber #fcbc05, --accent-red #ef4444
`;

const RULES = `
CONVERSION RULES (apply precisely; minimal, surgical edits only):
1. Replace neutral text/border/surface colours with the matching token by ROLE & OPACITY tier:
   - rgba(0,0,0,0.85-0.9) → var(--text-strong); 0.7-0.8 → var(--text); 0.5-0.6 → var(--text-soft); 0.35-0.45 → var(--text-faint)
   - page/section background #f5f4f1 → var(--bg)
   - card/panel fills #fffefb #fffdf8 #fdfcfa #faf9f7 #fff/#ffffff (as a SURFACE, not button text) → var(--surface) or var(--surface-2) for nested/inset
   - hairline borders rgba(0,0,0,0.05-0.1) and rgba(44,42,39,0.05-0.1) → var(--border); stronger → var(--border-strong)
   - box-shadow colours rgba(0,0,0,α) / rgba(44,42,39,α) → rgba(var(--shadow-color), α) KEEPING the same α
2. Brand accent hexes (#3b82f6, #2563eb, #a855f7, #9333ea, #22c55e, #16a34a, #fcbc05, #ef4444 and their families) → the matching --accent-* var. Accent colours used at low alpha as tints (e.g. rgba(168,85,247,0.16) highlight) — LEAVE AS-IS; they read on both themes.
3. white text ON an accent button (e.g. .btn color:white) → leave as white.
4. Tailwind UTILITY classes in markup that bake neutral colour:
   - text-black/88 → text-[color:var(--text-strong)]; /50 → text-[color:var(--text-faint)] (map by tier as above)
   - hover:text-black/88 → hover:text-[color:var(--text-strong)]
   - bg-black/5 etc as a surface tint → bg-[color:var(--border)] only if it's a divider/edge; otherwise leave subtle tints
   - Keep accent utilities (text-[#22c55e]) as-is.
5. DO NOT touch: layout, spacing, fonts, SVG illustration fills that are intentionally colourful, the Hero3DV2.svelte file (already done), Nav.svelte (already done), gradients made of brand accents.
6. If a colour has no clean token match and isn't a neutral (e.g. a one-off illustration colour), LEAVE IT and note it in your report.
7. Add transition: background-color 300ms ease, color 300ms ease ONLY to large surface containers if trivially safe; otherwise skip — do not risk breaking animations.
8. CHIP/PANEL FILLS made of white at low alpha (bg-white/40, bg-white/50, bg-white/65) used as a raised surface → var(--surface) or var(--surface-2) (drop the /alpha, or keep a small alpha if it's glass over content). If such a chip has text-black/… on it, that black text must become a neutral text token too (it would be cream-on-white = unreadable in dark otherwise). Conversely a fixed-light semantic fill (e.g. a pale amber/green/purple highlight kept the same in both themes) needs explicit DARK text (color: rgba(0,0,0,0.82)) so it stays legible — don't leave it as inherit.
9. ring-black/… and border-black/… hairlines → var(--border)/var(--border-strong). ring-white/… as an edge → var(--border).
`;

phase('Convert');

// Files to convert. Hero3DV2.svelte and Nav.svelte are intentionally excluded
// (handled by hand). layout.css is the token source and already converted.
const COMPONENTS = [
	'src/lib/components/CookieConsent.svelte',
	'src/lib/components/Download.svelte',
	'src/lib/components/Features.svelte',
	'src/lib/components/Footer.svelte',
	'src/lib/components/Hero.svelte',
	'src/lib/components/HeroScroll.svelte',
	'src/lib/components/HeroVideo.svelte',
	'src/lib/components/Manifesto.svelte',
	'src/lib/components/Showcase.svelte',
	'src/lib/components/VideoEmbed.svelte',
	'src/lib/components/Writers.svelte'
];
const PAGES = [
	'src/routes/+page.svelte',
	'src/routes/ai/+page.svelte',
	'src/routes/blog/[slug]/+page.svelte',
	'src/routes/blog/+page.svelte',
	'src/routes/cant-think-straight/+page.svelte',
	'src/routes/manifesto/+page.svelte',
	'src/routes/omni/+page.svelte',
	'src/routes/pricing/+page.svelte',
	'src/routes/privacy/+page.svelte',
	'src/routes/share/[token]/+page.svelte',
	'src/routes/support/+page.svelte',
	'src/routes/terms/+page.svelte'
];
// Second pass: files the initial survey missed — the readonly share-annotation
// components (rendered by share/[token]) and the error page. Colour-heavy.
const MISSED = [
	'src/lib/share/ReadonlyAnnotatedText.svelte',
	'src/lib/share/ReadonlyAnnotationCard.svelte',
	'src/lib/share/ReadonlyAnnotationModal.svelte',
	'src/lib/share/ReadonlyThreadMessage.svelte',
	'src/routes/+error.svelte'
];

// Set FILES to whatever this run should process. Pass args:["missed"] to run
// only the second-pass files; default runs the original component+page sweep.
const FILES = args === 'missed' ? MISSED : [...COMPONENTS, ...PAGES];

const FILE_REPORT = {
	type: 'object',
	additionalProperties: false,
	required: ['file', 'changed', 'replacements', 'leftovers', 'notes'],
	properties: {
		file: { type: 'string' },
		changed: { type: 'boolean', description: 'true if any edit was made' },
		replacements: { type: 'number', description: 'count of colour values converted to tokens' },
		leftovers: {
			type: 'array',
			items: { type: 'string' },
			description: 'hardcoded neutral colours intentionally left, with a one-line reason each'
		},
		notes: { type: 'string', description: 'anything the reviewer should know' }
	}
};

const VERDICT = {
	type: 'object',
	additionalProperties: false,
	required: ['file', 'pass', 'issues'],
	properties: {
		file: { type: 'string' },
		pass: { type: 'boolean', description: 'true if conversion is correct & complete' },
		issues: {
			type: 'array',
			items: {
				type: 'object',
				additionalProperties: false,
				required: ['severity', 'detail'],
				properties: {
					severity: { type: 'string', enum: ['high', 'medium', 'low'] },
					detail: { type: 'string', description: 'file:line-ish + what is wrong + the fix' }
				}
			}
		}
	}
};

// Pipeline: each file is converted, then immediately verified — no barrier, so
// file B verifies while file C is still converting.
const results = await pipeline(
	FILES,
	(file) =>
		agent(
			`You are converting ONE file to use the project's dark-mode design tokens. The whole app is becoming theme-aware via prefers-color-scheme; colours must come from CSS vars, not hardcoded literals.

FILE: ${file}
(absolute root: /Users/bryanhu/Developer/current/public/quillium-landing)

${TOKENS}
${RULES}

Steps:
1. Read the file.
2. Make the minimal edits to convert neutral colours (in <style> AND in Tailwind utility classes in markup) to the tokens above.
3. Do NOT change layout, copy, or accent/illustration colours.
4. Return a structured report. Set changed=false with replacements=0 if the file had no neutral colours to convert.`,
			{ label: `convert:${file.split('/').pop()}`, phase: 'Convert', schema: FILE_REPORT }
		),
	(report, file) =>
		report && report.changed
			? agent(
					`Adversarially verify a dark-mode token conversion. Be skeptical — your job is to catch mistakes, not rubber-stamp.

FILE: ${file}
${TOKENS}

Check for:
- STRAY light-only neutrals left behind: any remaining rgba(0,0,0,α) / #f5f4f1 / #fff used as a surface or text colour that should be a token. (Accent tints like rgba(168,85,247,0.16) are fine.)
- WRONG tier: a heading mapped to --text-faint, body to --text-strong, a surface to a text token, etc.
- Shadows: rgba(0,0,0,α) shadow colours that were NOT moved to rgba(var(--shadow-color), α).
- Tailwind utilities still baking text-black/… or bg-…/… neutrals in markup.
- DARK CONTRAST: would any text token on its surface token be too low-contrast in DARK mode? (e.g. --text-faint on --surface-2). Flag if it reads < ~4.5:1 for body or < ~3:1 for large text.
- Anything visibly broken: an accent or illustration colour wrongly tokenised.

Read the file and report a verdict. pass=true only if there are no high/medium issues.`,
					{ label: `verify:${file.split('/').pop()}`, phase: 'Verify', schema: VERDICT }
				)
			: { file, pass: true, issues: [], skipped: 'no changes' }
);

const reports = results.filter(Boolean);
const failed = reports.filter((r) => r.issues && r.issues.some((i) => i.severity === 'high' || i.severity === 'medium'));

log(`Converted ${FILES.length} files. ${failed.length} flagged by verifier.`);

return {
	totalFiles: FILES.length,
	verifierFlagged: failed.map((f) => ({ file: f.file, issues: f.issues })),
	clean: reports.filter((r) => r.pass).map((r) => r.file)
};
