---
title: "Why the Undo Button Is a Lie"
description: "Undo/redo pretends to be a revision system. It's not. It's a stack — and stacks are the wrong data structure for writing."
date: "2026-03-23"
author: "Bryan Hu"
---

Ctrl+Z is the most reassuring shortcut in computing. You made a mistake, you undo, you go back, and you pretend it never happened.

That's the pitch, anyway, and if you've ever lost a paragraph you loved because you undid too far and then typed something new, you already know this intuitively. You just haven't had the vocabulary for why it felt so broken.

Here it is: it's because the undo is a stack.

## A stack is not a revision system

A stack is a data structure that works last-in, first-out. Every action you take gets pushed onto it, Ctrl+Z pops the most recent one off, and Ctrl+Shift+Z pushes it back on.

That works fine for correcting typos, and it falls apart completely as a model for revision.

Think about how you actually revise a piece of writing. You write a draft, rewrite paragraph two, rewrite it again, and then realize the first rewrite was actually better, except that the current version of paragraph four is the one you want to keep. You want to go back to version three of one section, keep version five of another, and try something entirely new for a third.

A stack literally cannot represent this. The moment you undo back to version three and start typing, versions four and five are gone, because the stack has been overwritten. What looks like a revision system is really a single-timeline illusion with a convenient keyboard shortcut.

## Every writing tool gets this wrong

Google Docs has version history, which is a linear list of snapshots sorted by time. Word has track changes, which is a linear diff of edits. Notion, Scrivener, iA Writer—every tool you can name treats your document's history as a single timeline running from start to end.

But writing doesn't move in a single timeline. Writing is *divergent*. You want to keep multiple versions alive simultaneously, not because you're indecisive, but because **good writing is the result of exploring a search space**, and a linear history collapses that search space into a single path.

It's a bit like recording a chess game by only saving the moves that were played. You lose all the analysis: the lines you considered, the variations you explored, the positions you evaluated and rejected. That analysis *is* the game. The moves that survived are just the tip of it.

## Git figured this out decades ago

Software engineers solved this problem a long time ago, using a tool called Git. Git doesn't give you a stack; it gives you a directed acyclic graph, a branching tree of history where every version lives forever and you can merge, compare, and switch between branches at will.

This insight has nothing to do with code. It's about *any* creative work that involves revision. That is, all of it.

Final Cut Pro has "auditions" for video clips. You can compare snapshots of different photo in  Darktable. So, what about writing?

## What branching looks like for prose

Imagine selecting a paragraph and forking it. The original stays, and your new version lives alongside it. You can switch between them, compare them side by side, or fork again, and nothing is destroyed in the process. That's what I'm building with Quillium, a writing tool where history branches instead of stacking, and revision is a first-class operation rather than an afterthought hack ala Ctrl+Z.

You shouldn't have to choose between the paragraph you wrote Tuesday and the one you wrote Thursday. You should be able to keep both, see both, and decide later—or never. If that sounds like the way you already think about writing, and you're tired of fighting tools that don't, [try it out](/#download).
