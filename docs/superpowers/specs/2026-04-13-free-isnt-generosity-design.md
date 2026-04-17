# Blog post: "Free isn't generosity"

Date: 2026-04-13

## Purpose

A blog post unpacking the landing page line "Never pay us a cent and the app works the same. That's the point." The post argues that Quillium is free not as generosity but as structural necessity — paywalling core features would kill the product, because (a) the author is an indie dev with no leverage, (b) the value proposition requires trying the app to understand, and (c) a paywall breaks the word-of-mouth loop the product depends on.

## Thesis

Free isn't a gift. It's the only model that works for this kind of tool built by this kind of developer.

## Tone

Personal/confessional first-person as the spine (indie dev talking plainly about the economics of their own situation), held together by the argumentative rigor of existing posts (concede obvious counterarguments, then dismantle them). No marketing "we." No values language. State mechanics.

## Target length

1000-1400 words.

## Structure

1. **Hook — the landing page line** (~100w). Quote the line. Announce the post is about why it's structural, not generous.

2. **I don't have leverage** (~250w). Solo indie dev, no brand, no sales team, no enterprise pipeline, no VC runway. The things that let other tools charge upfront — trust, distribution, case studies — the author doesn't have.

3. **You have to try it to believe it** (~350w). Branching for prose sounds abstract and replaceable ("I can just copy-paste paragraphs"). The only way to discover it's not is to live with it for a week. Any paywall filters out everyone who hasn't been convinced — which is everyone. Economics are inverted: need more users trying it, not fewer paying ones.

4. **Paywalling would kill the product, not fund it** (~300w). Gating core features kills the word-of-mouth loop. Nobody recommends software friends can't try. The feedback loop that improves the tool (edge cases, weird workflows, bugs) evaporates. Reference monetization plan: sync/collab is paid because server costs are real; everything else is free because it has to be.

5. **That's the point** (~150w). Callback to landing page line. Reframe: not a promise of generosity, an admission that any other model breaks the product. Business serves the tool, not the other way around.

## Links

- `/blog/why-not` — for the copy-paste workaround argument
- `/blog/inline-branching-for-prose` — for what branching actually does
- `/#download` — closing CTA, matching house style

## File

`src/lib/posts/free-isnt-generosity.md`

## Frontmatter

```yaml
---
title: "Free isn't generosity"
description: "Quillium is free because paywalling it would kill it. Here's the indie-dev math behind why that's true."
date: "2026-04-13"
author: "Bryan Hu"
---
```

## Style rules

- First person, specific, no corporate "we."
- Concede counterarguments before dismantling them.
- No "we believe" / values language. State mechanics.
- Don't re-argue branching's value — link out to posts that already did.
- Close with landing page callback; don't use it as title.

## Out of scope

- Re-arguing why branching for prose matters (covered in other posts).
- Comparing Quillium to competitors (covered in `why-not.md`).
- Explaining sync/collab pricing mechanics (covered in monetization plan).
- Any "pro tier" or "enterprise" speculation.
