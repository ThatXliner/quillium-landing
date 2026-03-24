---
title: "Why Version Control for Writing Should Work Like Git"
description: "Writers lose drafts or drown in filenames. Version control for writing should work like Git, because drafts aren't enough."
date: "2026-03-23"
author: "Bryan Hu"
---

Every programmer I know would riot if you took away Git. The idea of working on a codebase without branches, without diffs, without the ability to rewind to any point in history, it's unthinkable. Version control isn't a nice-to-have in software: it's necessary to survive.

And yet, writers—people whose entire job is iterating on text—are stuck with the digital equivalent of scribbling in the margins and praying.

## The state of "version control" for writers

Here's what version control looks like for most writers today:

1. **The naming convention approach.** `essay.docx`, `essay_v2.docx`, `essay_v2_revised.docx`, `essay_FINAL.docx`, `essay_FINAL_real.docx`, `essay_FINAL_real_USE_THIS_ONE.docx`. You know the drill. You've done the drill.

2. **The "just trust undo" approach.** Write linearly. Hit Ctrl+Z when things go wrong. Hope you haven't closed the app since the version you want. (You have.)

3. **The Google Docs approach.** Version history exists, technically. It's a timeline you can scrub through. But it's linear—you can look at the past, not explore alternate presents.

None of these are version control. They're cope.

## What programmers figured out decades ago

Git solved this problem for code in 2005. The key insight wasn't just "save every version." It was **branching**.

A branch lets you say: "I want to try something different without destroying what I have." You can experiment on a branch, and if it works, merge it back. If it doesn't, the original is untouched. You can maintain multiple parallel versions of the same thing indefinitely.

This isn't just useful for code. It maps almost perfectly onto how creative writing actually works.

## Writing is non-linear. Your tools should be too.

Think about how you actually write. You draft a paragraph, and then you think: *What if I took this in a completely different direction?* Maybe the essay works better if you open with the anecdote instead of the thesis. Maybe this sentence is stronger with a different metaphor.

In a linear tool, you have two options: overwrite what you have, or copy-paste it somewhere and maintain two documents manually.

Both are bad. Overwriting means you lose the original. Manual copies mean you lose your mind. What you actually want is a fork: you want to branch the sentence, try the alternative, and keep both versions alive. In the document itself, as a first-class concept, not a separate document or yet another comment. Because what if there was changes you wanted to make to the idea you had? Further exploration of ideas??

This is why undo is the wrong model. Undo is a linear stack. It assumes there's one timeline and you're just moving backward and forward on it—but creative writing isn't one timeline. It's a tree. Every interesting decision is a fork.

## The gap

Programmers have had branching for twenty years. Writers are still renaming files.

It's not because the idea is too complex for non-programmers. It's because nobody's built the right interface for it. Git's power is real, but its UX was designed for people comfortable with terminals and merge conflicts. The mental model—branches, forks, parallel versions—is intuitive. The implementation just hasn't been translated for prose.

That's what I'm building with Quillium. A writing tool where branching is native. You can fork a sentence, a paragraph, an entire section—try a different direction without losing the one you were on. Every version stays alive, and you choose which path to follow. It's the Git model, but for people who think in paragraphs, not pull requests. Infinitely.

## Actually, it's even better

Git is the inspiration, but Quillium isn't just "Git for prose." In some important ways, it goes further.

In Git, a branch is all-or-nothing. You check out one branch at a time, and that branch represents a single state of the entire project. If you want your new opening paragraph from branch A but the conclusion from branch B, you're looking at a merge—and merges in Git are about *lines*, not *ideas*. Any programmer can tell you how nasty a merge conflict can be.

Quillium doesn't work like that. "Branches" are *per-fragment*. You can branch a single sentence, a paragraph, or a whole section independently. And because each branch is scoped to the piece of text it belongs to, you can mix and match: take the formal opening from version one, the conversational middle from version two, and the punchy ending from version three. All in the same document, without merging anything. We call each section a revision, and each version a, well, *version*.

This is something Git genuinely can't do. In Git, you pick a branch and live with all of its changes. In Quillium, you pick and choose *per decision*. Every fork in the text is its own independent choice.

That's closer to how writing actually works. You don't want to choose between "draft A" and "draft B" wholesale; you want the best pieces of each, assembled the way *you* see fit.

Version control for writing should be better than Git, because prose demands it.

## Writing deserves better tools

Writers iterate as much as programmers do. Probably more, actually: code either works or it doesn't, but prose has infinite valid variations. The difference is that programmers have tools that embrace iteration, and writers have tools that punish it.

That should change.

If you're tired of `draft_v7_FINAL_REAL.docx` and want to write the way you actually think—in branches, not in lines — [join the waitlist](/#waitlist).
