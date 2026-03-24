---
title: "Why the Undo Button Is a Lie"
description: "Undo/redo pretends to be a revision system. It's not. It's a stack — and stacks are the wrong data structure for writing."
date: "2026-03-23"
author: "Bryan Hu"
---

Ctrl+Z is the most reassuring shortcut in computing. Made a mistake? Undo. Go back. Pretend it never happened.

Except that's not what's actually going on, and if you've ever lost a paragraph you loved because you undid too far and then typed something new, you already know this intuitively. You just haven't had the vocabulary for why it felt so broken.

Here's the vocabulary: **undo is a stack.**

## A stack is not a revision system

A stack is a data structure. Last in, first out. Every action you take gets pushed onto the stack. Ctrl+Z pops the most recent one off. Ctrl+Shift+Z pushes it back.

That works fine for correcting typos, but it's *completely wrong* for revision.

Think about how you actually revise a piece of writing. You write a draft, rewrite paragraph two, then rewrite it again. Then you realize the first rewrite was actually better—but the *current* version of paragraph four is the one you want to keep. You want to go back to version 3 of one section, keep version 5 of another, and try something entirely new for a third.

A stack literally cannot represent this operation. The moment you undo back to version 3 and start typing, versions 4 and 5 are gone, destroyed, the stack overwritten. That's not a revision system; it's a single-timeline illusion with a convenient keyboard shortcut.

## Every writing tool gets this wrong

Google Docs has version history (a linear list of snapshots sorted by time). Word has track changes (a linear diff of edits). Notion, Scrivener, iA Writer—every tool you can name treats your document's history as a single timeline.

But writing doesn't move in a single timeline. Writing is *divergent*. You want to keep multiple versions alive simultaneously, not because you're indecisive, but because **good writing is the result of exploring a search space**, and a linear history collapses that search space into a single path.

It's like recording a chess game by only saving the moves that were played. You lose all the analysis: the lines you considered, the variations you explored, the positions you evaluated and rejected. That analysis *is* the game.

## Git figured this out decades ago

Actually, software engineers solved this problem a long time ago: it's a tool called Git. Git doesn't give you a stack—it gives you a **directed acyclic graph**, a branching, forking tree of history where every version lives forever and you can merge, compare, and switch between branches at will.

This insight has nothing to do with code. It's about *any* creative work that involves revision. Which is to say: all of it.

## What branching looks like for prose

Imagine selecting a paragraph and forking it. The original stays, and your new version lives alongside it. You can switch between them, compare them side by side, or fork again. Nothing is destroyed.

That's what I'm building with Quillium: a writing tool where history branches instead of stacking, where revision is a first-class operation rather than an afterthought bolted on with Ctrl+Z.

You shouldn't have to choose between the paragraph you wrote Tuesday and the one you wrote Thursday. You should be able to keep both, see both, and decide later—or never. If that sounds like the way you already think about writing, and you're tired of fighting tools that don't, [join the waitlist](/#waitlist).
