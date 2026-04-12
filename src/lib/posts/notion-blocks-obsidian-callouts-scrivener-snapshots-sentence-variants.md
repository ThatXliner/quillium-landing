---
title: "Notion Blocks, Obsidian Callouts, Scrivener Snapshots: The Workarounds Writers Use to Keep Sentence Variants"
description: "Here's why those workarounds exist, and what a purpose-built tool looks like."
date: "2026-04-12"
author: "Bryan Hu"
---


If you've ever wanted to keep two or three versions of the same sentence alive in a document—compare them, swap between them, decide later—you've probably discovered that no writing app has a button for that.

So you improvise. You stuff alternate phrasings into Notion toggle blocks. You park variant sentences inside Obsidian callouts. You take Scrivener snapshots before rewriting a paragraph, hoping you'll remember to check the diff later. You use iA Writer's critic markup to hold one alternative visible next to the original.

These are all clever hacks. They're also all evidence that the feature you actually want doesn't exist in any of these tools.

## Notion toggle blocks

Notion's toggle block is designed for collapsible content—FAQs, nested details, things you want to hide until someone clicks. Writers repurpose it as a container for alternate phrasings: write the current version in the paragraph, stuff two other options inside a toggle underneath.

It works until it doesn't. Toggle blocks are visually heavy. They break the flow of your prose with a disclosure triangle that screams "there's a UI element here." You can't switch between versions in place—you have to open the toggle, read the alternative, mentally compare it to the paragraph above, close the toggle, and then decide. And if you want to try a version that mixes the opening of variant A with the closing of variant B, you're copy-pasting between toggles and the main text.

## Obsidian callouts

Obsidian's callout syntax (`> [!note]`) is even more of a repurposed feature. Callouts are designed for notes, warnings, and tips—sidebar-style annotations. Writers use them to stash alternate phrasings next to the "live" version of a paragraph because it's the closest thing Obsidian has to inline annotations.

The callout sits below or beside your text, visually distinct, clearly not part of the document. Which is exactly the problem. Your alternate phrasing *is* part of the document—it's a version of the text that might become the real one. Rendering it as an annotation makes it feel secondary, like a comment rather than a contender.

There are also community plugins that let you store multiple variants of a span and cycle through them. These get closer to the right idea, but they're third-party, the experience is fiddly, and your workflow depends on a plugin maintainer's continued interest. One abandoned plugin update and your revision system is gone. That being said, Obsidian is very good if you don't care about revisions not being a first-party system.

## Scrivener snapshots

Scrivener is the only mainstream writing tool that has a first-party feature for this problem—Snapshots. You take a snapshot before revising, and later you can compare the current version against the snapshot in a split view.

But Scrivener snapshots are whole-document. You can't snapshot a single sentence. If you rewrite one paragraph, the snapshot diff shows you the entire document with that one change highlighted, and you have to scan through to find it. Take multiple snapshots across multiple revision sessions and comparing them becomes an archaeology project.

Snapshots are also manual and one-directional. You have to remember to take one *before* you start revising. If you forget—or if you only realize midway through that you liked the old version—the previous text is gone. And you can't maintain two versions simultaneously; a snapshot is a frozen archive, not a live alternative you can switch to.

The comparison view, when it works, shows a side-by-side diff. Side-by-side is better than nothing, but it's still a diff view, which means you're looking at *what changed* rather than *what your options are*. Those are different questions. Writers need the second one.

Also, Scrivener costs money.

## iA Writer and critic markup

iA Writer supports [CriticMarkup](https://criticmarkup.com/), a plain-text syntax for tracking changes: `{~~old~>new~~}` shows a substitution, `{++addition++}` shows an insertion. Some writers use this to hold one alternate phrasing visible next to the original, inline, without leaving their Markdown file.

Of all the workarounds, this one is the most honest about what it's doing. It's literally inline, literally in the text, and it doesn't pretend to be something else. But it has hard limits: you can only hold two versions (the old and the new). There's no syntax for three or four variants. The markup is noisy in the raw text, and it doesn't compose—you can't have a critic-markup substitution inside another substitution. For a single "try this instead" pass, it works. For the kind of exploratory revision where you write a sentence four different ways, it breaks down fast.

Also, you can't use CriticMarkup inside CriticMarkup.

## What all of these have in common

Every one of these workarounds is trying to solve the same problem: **keeping multiple versions of the same text alive in a document so you can compare, choose, and swap between them.** Notion toggle blocks, Obsidian callouts, Scrivener snapshots, and iA Writer critic markup all approximate this, and they all fall short in the same ways:

- **They're not inline.** The alternate version lives somewhere else—below the text, in a sidebar, in a snapshot archive—instead of occupying the same space as the original.
- **They don't compose.** You can't branch a branch. You can't try a version that combines pieces of two other versions without manual copy-pasting.
- **They're not first-class.** These are all repurposed features, built for something else and awkwardly shoved into a revision workflow.

## The tool that's actually built for this

This is why [Quillium](/) exists.

In Quillium, you select any span of text—a word, a sentence, a paragraph—and branch it. The branch creates a new version that lives in the same place as the original. You switch between versions with a click. Both are fully editable.

You can branch a branch. You can have three, four, five versions of the same sentence, all alive, all inline, all part of the document.

The closest analogy is [Git branches, but for individual sentences](./why-not#why-not-git). Unlike Git, branches would be embedded in the document itself, with real-time switching and a single undo timeline that crosses branch boundaries. It's what Notion toggle blocks and Obsidian callouts are trying to be, but as a first-class feature instead of a duct-tape workaround.

If you've been parking alternate phrasings in toggles, callouts, snapshots, or critic markup, you already know you need this. You've just been building it yourself out of the wrong parts. You want Git for writing, but also something where you can mix-and-match versions.

[Try Quillium.](/#download)
