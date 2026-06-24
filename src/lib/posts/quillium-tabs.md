---
title: "Introducing our new Tab and Drafts system"
description: "A drafting revolution"
date: "2026-06-23"
author: "Bryan Hu"
---

In the past month, I have been [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) [Quillium](https://quillium.bryanhu.com/) for drafting my college application essays.

And even though I have implemented many features that I have desired, even including markdown rendering, I realized there was one part of my workflow that I heavily missed. That was creating new drafts.

You see, the issue is that you can't really recreate this with revisions. While technically yes you can select the entire document and make it a revision, it's pretty bad, especially with the entire thing looking purple and then the annotations all look really ugly. The revision system is currently designed for smaller changes, similar to how you would make cuts or [auditions](https://support.apple.com/guide/final-cut-pro/intro-to-auditions-verbbd3587d/mac) in Final Cut Pro.

And while I'm currently working on a feature called linked versions, I still miss the older workflow I had with Google Docs: creating new drafts by copying and pasting.

So I built it into Quillium, but better.

## Introducing the Drafts System

The drafts system in Quillium allows you to create new drafts by copying and pasting, just like with Google Docs. Unlike the workaround of creating new document Tabs in Google Docs, Quillium's drafts system not only does the copy-pasting for you, but also locks older versions so that you won't accidentally iterate on an older draft.

Additionally, because Quillium is fundamentally a *nonlinear* writing app, we decided to make this concept of a draft expanded from the typical stack-based approach.

## Drafts can now be Nonlinear

Instead of a stack of drafts where each new version sits on top of the old one, you now have two distinct moves: you can iterate on a draft, or branch off it.

1. Iterating is the everyday move: "the next version, continuing from here." When you iterate, the old draft locks (it's been superseded) and your new draft becomes the one you edit. An iteration chain stays flat: a list of versions, oldest to newest. Even after a hundred iterations, it reads as a hundred-item list, not a hundred-level-deep tree.
2. Branching is the rarer move: "a different take on the same idea." When you branch, nothing locks. The original and the branch are both live, side by side, and the branch starts its own iteration chain. This is different from revisions because branches give you a lot more freedom.

In computer science, we'd call the whole shape a [tree](https://en.wikipedia.org/wiki/Tree_(abstract_data_type)).

<figure class="draft-demo">
  <div class="draft-panel" role="img" aria-label="Quillium drafts panel. Main run Draft, v1, v2, v3 renders flat. Three branches indent off v2: 'Alt opening'; 'Darker take' with its own sub-run v1, v2; and 'Flashback' with sub-run v1. Draft, v1, and the Darker take run are locked. Flashback is the active draft.">
    <div class="draft-panel__head">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
      <span>Drafts</span>
    </div>
    <!-- Main run (col 0): Draft → v1 → v2 → v3, flat. -->
    <div class="draft-row">
      <span class="draft-rail draft-rail--below" style="--c:0"></span>
      <span class="draft-dot" style="--c:0"></span>
      <span class="draft-label">Draft</span>
      <svg class="draft-lock" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      <span class="draft-fill"></span>
    </div>
    <div class="draft-row">
      <span class="draft-rail draft-rail--full" style="--c:0"></span>
      <span class="draft-dot" style="--c:0"></span>
      <span class="draft-label">v1</span>
      <svg class="draft-lock" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      <span class="draft-fill"></span>
    </div>
    <div class="draft-row">
      <span class="draft-rail draft-rail--full" style="--c:0"></span>
      <span class="draft-dot" style="--c:0"></span>
      <span class="draft-label">v2</span>
      <span class="draft-fill"></span>
    </div>
    <!-- Three branches off v2, indented to col 1. Main spine (col 0) passes
         straight through all of them because the run continues to v3 below. -->
    <div class="draft-row" style="--d:1">
      <span class="draft-rail draft-rail--full" style="--c:0"></span>
      <span class="draft-elbow" style="--c:0"></span>
      <span class="draft-dot" style="--c:1"></span>
      <span class="draft-label">Alt opening</span>
      <span class="draft-fill"></span>
    </div>
    <div class="draft-row" style="--d:1">
      <span class="draft-rail draft-rail--full" style="--c:0"></span>
      <span class="draft-elbow" style="--c:0"></span>
      <span class="draft-rail draft-rail--below" style="--c:1"></span>
      <span class="draft-dot" style="--c:1"></span>
      <span class="draft-label">Darker take</span>
      <svg class="draft-lock" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      <span class="draft-fill"></span>
    </div>
    <div class="draft-row" style="--d:1">
      <span class="draft-rail draft-rail--full" style="--c:0"></span>
      <span class="draft-rail draft-rail--full" style="--c:1"></span>
      <span class="draft-dot" style="--c:1"></span>
      <span class="draft-label">v1</span>
      <svg class="draft-lock" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      <span class="draft-fill"></span>
    </div>
    <div class="draft-row" style="--d:1">
      <span class="draft-rail draft-rail--full" style="--c:0"></span>
      <span class="draft-rail draft-rail--above" style="--c:1"></span>
      <span class="draft-dot" style="--c:1"></span>
      <span class="draft-label">v2</span>
      <span class="draft-fill"></span>
    </div>
    <div class="draft-row draft-row--active" style="--d:1">
      <span class="draft-rail draft-rail--full" style="--c:0"></span>
      <span class="draft-elbow" style="--c:0"></span>
      <span class="draft-rail draft-rail--below" style="--c:1"></span>
      <span class="draft-dot draft-dot--active" style="--c:1"></span>
      <span class="draft-label">Flashback</span>
      <span class="draft-fill"></span>
    </div>
    <div class="draft-row" style="--d:1">
      <span class="draft-rail draft-rail--full" style="--c:0"></span>
      <span class="draft-rail draft-rail--above" style="--c:1"></span>
      <span class="draft-dot" style="--c:1"></span>
      <span class="draft-label">v1</span>
      <span class="draft-fill"></span>
    </div>
    <!-- Main run resumes: v3 closes the col-0 spine. -->
    <div class="draft-row">
      <span class="draft-rail draft-rail--above" style="--c:0"></span>
      <span class="draft-dot" style="--c:0"></span>
      <span class="draft-label">v3</span>
      <span class="draft-fill"></span>
    </div>
  </div>
  <figcaption>The main run stays flat (<code>Draft → v1 → v2 → v3</code>) no matter how much branches off it. Three takes branch off <code>v2</code> — one with its own iteration run — yet the trunk reads as a simple list. Padlocks mark locked older versions; the amber dot is the active draft.</figcaption>
</figure>

<style>
  .draft-demo { margin: 2rem auto; max-width: 16rem; }
  .draft-panel {
    --rail: color-mix(in srgb, currentColor 22%, transparent);
    --branch: rgb(251 191 36 / 0.85);
    --muted: color-mix(in srgb, currentColor 38%, transparent);
    --label: color-mix(in srgb, currentColor 62%, transparent);
    background: var(--surface-2, rgb(0 0 0 / 0.035));
    border: 1px solid var(--border, rgb(0 0 0 / 0.07));
    border-radius: 0.7rem;
    padding: 0.5rem 0.4rem;
    user-select: none;
  }
  .draft-panel__head {
    display: flex; align-items: center; gap: 0.4rem;
    padding: 0.1rem 0.5rem 0.5rem;
    font-size: 0.66rem; font-weight: 600; letter-spacing: 0.06em;
    text-transform: uppercase; color: var(--muted);
  }
  /* --col0 = x of column 0's rail/dot centre; --col = indent per branch hop.
     A row at depth --d pads its label past its own dot column. */
  .draft-panel { --col0: 0.95rem; --col: 1rem; }
  .draft-row {
    position: relative; display: flex; align-items: center; gap: 0.55rem;
    padding: 0.36rem 0.4rem 0.36rem calc(0.85rem + var(--d, 0) * var(--col));
    border-radius: 0.45rem; font-size: 0.9rem; color: var(--label);
  }
  /* the active row: a bright white pill popping off the grey panel */
  .draft-row--active {
    background: var(--surface, #fff);
    color: var(--text-strong, rgb(0 0 0 / 0.85));
    font-weight: 600;
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.08);
  }
  .draft-dot {
    width: 0.42rem; height: 0.42rem; border-radius: 50%;
    background: var(--rail); flex-shrink: 0;
  }
  .draft-dot--active { background: rgb(245 158 11); }
  .draft-label { flex: 0 0 auto; }
  .draft-fill { flex: 1 1 auto; }
  .draft-lock { color: var(--muted); flex-shrink: 0; }
  /* A rail is a 1px vertical line in column --c (grey = an iteration run-spine). */
  .draft-rail {
    position: absolute; width: 1px; background: var(--rail);
    left: calc(var(--col0) + var(--c, 0) * var(--col));
  }
  .draft-rail--full  { top: 0; bottom: 0; }
  .draft-rail--above { top: 0; height: 50%; }
  .draft-rail--below { top: 50%; bottom: 0; }
  /* branch elbow: amber vertical in column --c (a TEE — full height, because in
     this layout the trunk keeps running below every branch) plus a horizontal
     stub turning right into the indented child dot one column over.
     Amber = "a different take"; grey = "the next version". */
  .draft-elbow {
    position: absolute; top: 0; bottom: 0; width: 1px; background: var(--branch);
    left: calc(var(--col0) + var(--c, 0) * var(--col));
  }
  .draft-elbow::after {
    content: ""; position: absolute; left: 0; top: 50%;
    width: var(--col); height: 1px; background: var(--branch);
  }
  .draft-demo figcaption {
    margin-top: 0.6rem; font-size: 0.8rem; font-style: italic;
    text-align: center; color: var(--text-soft, var(--muted));
  }
  .draft-demo figcaption code {
    font-style: normal; font-size: 0.85em;
    background: var(--surface-2); padding: 0.05rem 0.2rem; border-radius: 0.2rem;
  }
</style>

In terms of UI design, the common action (iterate) gets the cheap visual (a flat list) while the rare action (branch) gets the expensive one (an indented line of its own). The frequent thing stays simple, meaning you only pay for the complexity when you actually reach for it.

In practice, I use iterations for refining a draft I believe in, and branches for trying out a completely different structure or, for my college essays, a completely different storyline.

## But still there's an "issue" with Drafts.

When I was writing my UC PIQs, I wanted my outlines, research notes, and actual essay drafts all in one place, but I didn't want them cluttering the same buffer. 

Separating them using markdown headers worked as a hack, but it's messy and don't really work well with the draft system.

Think about it: with the workaround, when you create a new draft, is this new draft for your first essay or your fourth essay? It's ambiguous since they are both in the same document. How would you be able to tell at a glance?

The current workaround is to create new Quillium documents. You would have a separate Quillium document per PIQ essay. But if you wanted to edit your essays side-by-side or have an outline you wrote as a reference, you have to pull up a whole new window and view a separate Quillium document (yes, I also recently also added multi-window support).

## Enter Tabs.

![Quillium tab bar with Research, Brainstorm, and Draft tabs in one document]($assets/screenshots/tabs.png)

Think of each tab as a separate workspace inside a single Quillium document. You might have:

- A Research tab with links, quotes, and outlines
- A Brainstorm tab for freewriting and fragments
- A Draft tab where you're actively writing

Each tab has its own full draft system (tree, revisions, annotations) so you can experiment with different storylines in your Draft tab while keeping your research pinned in another tab, all without ever opening a second window.

Previously, you'd have to create separate Quillium documents and juggle windows. Now, it's all in one place.

## Come try it out!

You can [download Quillium](https://quillium.bryanhu.com) and try it out for yourself! It's currently in public beta, but if this whole idea of non-linear writing sounds appealing to you, I highly encourage you to try it out and [provide me feedback](mailto:founder@quillium.bryanhu.com).
