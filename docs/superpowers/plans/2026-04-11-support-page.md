# Support Page & Email Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/support` page for the App Store Support URL and migrate all contact emails from `thatxliner@gmail.com` to `support@quillium.bryanhu.com`.

**Architecture:** One new SvelteKit page route following existing page patterns (Nav + centered content + Footer). Find-and-replace email across 4 existing files.

**Tech Stack:** SvelteKit, Tailwind CSS

---

### Task 1: Create the `/support` page

**Files:**
- Create: `src/routes/support/+page.svelte`

- [ ] **Step 1: Create the support page**

Create `src/routes/support/+page.svelte`:

```svelte
<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>Support – Quillium</title>
	<meta
		name="description"
		content="Need help with Quillium? Get in touch with us."
	/>
	<link rel="canonical" href="https://quillium.bryanhu.com/support" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://quillium.bryanhu.com/support" />
	<meta property="og:title" content="Support – Quillium" />
	<meta
		property="og:description"
		content="Need help with Quillium? Get in touch with us."
	/>
	<meta property="og:site_name" content="Quillium" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Support – Quillium" />
	<meta
		name="twitter:description"
		content="Need help with Quillium? Get in touch with us."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Newsreader:ital,wght@0,400;0,500;1,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<Nav />

<main class="min-h-screen px-6 pt-32 pb-20">
	<div class="mx-auto max-w-2xl">
		<header>
			<h1
				class="mb-4 font-[Newsreader,Georgia,serif] text-[clamp(2.5rem,6vw,3.75rem)] leading-[1.05] font-normal tracking-[-0.03em] text-black/90"
			>
				Need help?
			</h1>
			<p class="max-w-xl text-[0.95rem] leading-relaxed text-black/45">
				Quillium is in public beta. If you run into a bug, have a question, or just want to say
				hi — email us at <a
					href="mailto:support@quillium.bryanhu.com"
					class="text-[#3b82f6] no-underline hover:underline">support@quillium.bryanhu.com</a
				>.
			</p>
		</header>
	</div>
</main>

<Footer />
```

- [ ] **Step 2: Verify the page renders**

Run: `bun run dev`

Open `http://localhost:5173/support` in a browser. Confirm:
- Nav renders at top
- "Need help?" headline in serif font
- Email is a clickable mailto link
- Footer renders at bottom

- [ ] **Step 3: Commit**

```bash
git add src/routes/support/+page.svelte
git commit -m "feat: add /support page for App Store Support URL"
```

---

### Task 2: Migrate email addresses

**Files:**
- Modify: `src/routes/pricing/+page.svelte:179,221` (2 occurrences)
- Modify: `src/routes/terms/+page.svelte:293` (1 occurrence)
- Modify: `src/routes/privacy/+page.svelte:202-203,489,530` (3 occurrences)
- Modify: `src/lib/components/Footer.svelte:78` (1 occurrence)

- [ ] **Step 1: Replace all occurrences**

In each of the 4 files, replace every instance of `thatxliner@gmail.com` with `support@quillium.bryanhu.com`. There are 7 total occurrences across the files:

**`src/routes/pricing/+page.svelte`** — lines 179 and 221:
```
href="mailto:thatxliner@gmail.com"
→
href="mailto:support@quillium.bryanhu.com"
```

**`src/routes/terms/+page.svelte`** — line 293:
```
<a href="mailto:thatxliner@gmail.com">thatxliner@gmail.com</a>
→
<a href="mailto:support@quillium.bryanhu.com">support@quillium.bryanhu.com</a>
```

**`src/routes/privacy/+page.svelte`** — lines 202-203, 489, 530:
```
thatxliner@gmail.com → support@quillium.bryanhu.com
```
(Both href values and display text)

**`src/lib/components/Footer.svelte`** — line 78:
```
href="mailto:thatxliner@gmail.com"
→
href="mailto:support@quillium.bryanhu.com"
```

- [ ] **Step 2: Verify no remaining references**

Run: `grep -r "thatxliner@gmail.com" src/`

Expected: no output (zero matches).

- [ ] **Step 3: Spot-check in browser**

With dev server running, check:
- `/pricing` — "Email us" links in Custom Build card and "Have a better idea?" row
- `/privacy` — all three email references
- `/terms` — contact section email
- Footer on any page — "Contact" link

All should point to `mailto:support@quillium.bryanhu.com`.

- [ ] **Step 4: Commit**

```bash
git add src/routes/pricing/+page.svelte src/routes/terms/+page.svelte src/routes/privacy/+page.svelte src/lib/components/Footer.svelte
git commit -m "chore: migrate contact email to support@quillium.bryanhu.com"
```
