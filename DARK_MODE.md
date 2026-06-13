# Dark Mode

The site supports light and dark themes. Dark mode follows the operating system
via `prefers-color-scheme: dark` — there is **no toggle and no persistence**.
The whole UI is driven by **CSS design tokens** defined once in
[`src/routes/layout.css`](src/routes/layout.css); a theme is one edit there, not
a sweep across components.

## How it works

`layout.css` declares the tokens twice:

```css
:root {
  /* light values */
  --bg: #f5f4f1;
  --text-strong: rgba(0, 0, 0, 0.9);
  /* … */
}

@media (prefers-color-scheme: dark) {
  :root {
    /* dark overrides for the same names */
    --bg: #171310;
    --text-strong: rgba(247, 241, 227, 0.95);
    /* … */
  }
}
```

`color-scheme` is set on `:root` in each mode so native controls (form fields,
scrollbars) follow the theme too. The `<body>` transitions `background-color`
and `color` so an OS theme flip animates rather than snaps.

Components never hardcode a neutral colour — they reference a token:

```css
.card        { background: var(--surface); color: var(--text); }
.card .meta  { color: var(--text-faint); }
```

…or, in Tailwind markup, via arbitrary values:

```html
<p class="text-[color:var(--text-soft)]">…</p>
<div class="bg-[color:var(--surface)] border border-[color:var(--border)]">…</div>
```

## The tokens

### Surfaces
| Token          | Role                                    | Light     | Dark      |
| -------------- | --------------------------------------- | --------- | --------- |
| `--bg`         | page background                         | `#f5f4f1` | `#171310` |
| `--surface`    | card / panel fill (raised above `--bg`) | `#fffefb` | `#211b16` |
| `--surface-2`  | nested / inset / input / code-chip fill | `#faf9f7` | `#1e1c1a` |

### Text — map by role **and** opacity tier
| Token           | Role                              | Light             | Dark               |
| --------------- | --------------------------------- | ----------------- | ------------------ |
| `--text-strong` | headings, primary copy            | `rgba(0,0,0,.9)`  | `rgba(247,241,227,.95)` |
| `--text`        | body copy                         | `rgba(0,0,0,.75)` | `rgba(247,241,227,.82)` |
| `--text-soft`   | secondary copy                    | `rgba(0,0,0,.6)`  | `rgba(247,241,227,.64)` |
| `--text-faint`  | captions, fine print, hints       | `rgba(0,0,0,.45)` | `rgba(247,241,227,.58)` |

> **Why dark `--text-faint` is 0.58, not 0.45.** Cream at 0.45 alpha on the dark
> surfaces lands ~4.1:1 — just under WCAG AA (4.5:1) for body text. 0.58 clears
> ~5:1 while staying clearly the quietest tier. The light value stays 0.45.
> **Only use `--text-faint` for genuine fine print/hints**, never for body copy —
> body copy mapped to the faint tier was the single most common review finding.

### Lines & elevation
| Token             | Role                                  | Light             | Dark                  |
| ----------------- | ------------------------------------- | ----------------- | --------------------- |
| `--border`        | hairline divider / card edge          | `rgba(0,0,0,.08)` | `rgba(255,255,255,.1)`  |
| `--border-strong` | more visible border                   | `rgba(0,0,0,.18)` | `rgba(255,255,255,.22)` |
| `--shadow-color`  | **rgb triple** for shadows            | `44, 38, 34`      | `0, 0, 0`             |

Shadows use the triple inside `rgba(...)`, keeping the alpha:

```css
box-shadow: 0 18px 44px rgba(var(--shadow-color), 0.14);
```

### Nav glass (the fixed translucent header)
`--nav-glass`, `--nav-glass-solid` (mobile dropdown), `--nav-glass-border`.
These let the nav read correctly over any hero in either theme — which is why
the old `data-nav-dark` attribute hack is gone (see below).

### Brand accents — **theme-independent** (identical in both modes)
`--accent-blue` `#3b82f6`, `--accent-blue-deep` `#2563eb`,
`--accent-purple` `#a855f7`, `--accent-purple-deep` `#9333ea`,
`--accent-green` `#22c55e`, `--accent-green-deep` `#16a34a`,
`--accent-amber` `#fcbc05`, `--accent-red` `#ef4444`.

Use these for buttons, badges, links, and accent tints. They do **not** change
between themes — do not wrap them in a `@media` block.

#### The one accent that flips: `--accent-amber-text`
`#d97706` (light) → `#fcbc05` (dark). Amber is the exception: deep amber reads on
a pale amber-tint chip in light mode but vanishes on the same chip in dark mode,
so the **text** colour for amber chips flips even though the chip fill doesn't.
If you add blue/green/purple chips that hit the same problem, follow this
pattern: a `--accent-*-text` token that flips, with the tint fill unchanged.

### Annotation tints (share page) — colour-coded surfaces that flip
The shared-document page colour-codes annotation cards by type. Unlike accents,
these **surfaces flip**: a pale tint in light mode, a deep same-hue tint in dark,
so the coding survives *and* cream `--text*` reads on top.

| Family   | Role       | `--tint-blue` (comment) | `--tint-green` (suggestion) | `--tint-purple` (revision) |
| -------- | ---------- | ----------------------- | --------------------------- | -------------------------- |
| base     | resting    | pale → deep blue        | pale → deep green           | pale → deep purple         |
| `-active`| selected   | …more saturated         | …                           | …                          |
| `-border`| edge       | matching border         | …                           | …                          |

```css
.editor-comment-card        { background: var(--tint-blue);  border-color: var(--tint-blue-border); }
.editor-comment-card.is-active { background: var(--tint-blue-active); }
```

> **When to use a flipping tint vs. a fixed-light island.** Use the `--tint-*`
> tokens for any colour-coded *card or panel* that holds body text — the deep
> dark tint keeps cream text legible. Small *inline* spans that are conventionally
> light even in dark UIs (word-level git-style diff highlights: red deletion /
> green insertion) are kept as fixed-light pills with fixed-dark text instead;
> flipping them would muddy the diff. Match the precedent in
> `ReadonlyAnnotationModal.svelte` (`.diff-delete` / `.diff-insert`).

## Conversion rules (for new code or files not yet migrated)

1. **Neutrals → tokens by role + opacity.** `rgba(0,0,0,0.85–0.9)` →
   `--text-strong`; `0.7–0.8` → `--text`; `0.5–0.6` → `--text-soft`;
   `0.35–0.45` → `--text-faint`. Surface fills (`#fffefb`, `#fffdf8`, `#fff` as a
   panel, `#f5f4f1` page bg) → `--bg`/`--surface`/`--surface-2`.
2. **Shadows** `rgba(0,0,0,α)` → `rgba(var(--shadow-color), α)` (same α).
3. **Borders** → `--border` / `--border-strong`.
4. **Brand accent hexes** → the matching `--accent-*`. Low-alpha accent **tints**
   (e.g. `rgba(168,85,247,0.16)` highlights) read on both themes — leave them.
5. **Tailwind utilities** that bake neutrals (`text-black/50`, `bg-white/50`,
   `bg-gray-50`, `ring-black/10`) → arbitrary values:
   `text-[color:var(--text-faint)]`, `bg-[color:var(--surface)]`,
   `border-[color:var(--border)]`. Map by the same tiers.
6. **`white` text on an accent button** (e.g. `.btn-primary { color: white }`) —
   leave as white.
7. **Neutral button fills** that should invert (e.g. a black "Accept" button):
   use `background: var(--text-strong); color: var(--surface)` so they flip
   automatically (dark-on-light → light-on-dark).

### Gotchas (caught in review — watch for these)

- **White inner highlights** (`inset-shadow-white`, `inset 0 1px 0 rgba(255,255,255,…)`)
  flash as a bright rim on dark surfaces. Drop them or replace with a hairline
  `border: 1px solid var(--border)`.
- **Light-only hover washes** (`hover:bg-gray-50/30`) flash near-white on dark.
  Use a token tint (`hover:bg-[color:var(--surface)]/80`).
- **Always-light semantic fills** (pale amber/green/purple annotation highlights
  kept identical in both themes) need **explicit dark text**
  (`color: rgba(0,0,0,0.82)`) — `color: inherit` gives unreadable cream-on-pale
  in dark mode.
- **Glass panels:** convert the *fill* too, not just the border — a tokenised
  border over a hardcoded light fill leaves a light panel (with now-cream text)
  in dark mode.
- **Off-palette dark shades** (`#15803d` green-700, `text-amber-600`) fail dark
  contrast. Use the bright brand token (`--accent-green`) or a flipping
  `--accent-*-text`.

## Scope notes

- **The 3D hero** (`Hero3DV2.svelte`) is special: its WebGL scene colours (sky,
  fog, smoke, dust) live in JS, keyed off `matchMedia('(prefers-color-scheme: dark)')`
  with a live recolour on theme change. Its DOM overlay uses a self-contained
  `@media (prefers-color-scheme: dark)` block rather than the shared tokens.
- **`data-nav-dark` is retired.** It existed only to force the nav/footer dark
  under the night-flight hero back when the app was light-only. Now that the nav
  and footer are token-driven they flip on their own; the attribute is no longer
  set or read anywhere.

## Testing

Automated contrast math was checked during conversion, but the **feel** of the
dark palette is a human call. Toggle your OS appearance (macOS: System Settings →
Appearance) and eyeball, paying attention to:

- surface elevation (does `--surface` read as raised above `--bg`?),
- the 3D hero running into the dark footer,
- annotation highlights on the `/share/[token]` page,
- fine print at `--text-faint`.

Local: `bun run dev`, then switch your OS theme with a page open — it should
re-theme live with no reload.
