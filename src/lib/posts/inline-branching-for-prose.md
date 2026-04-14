---
title: "Inline Branching for Prose: The Writing Tool That Should Already Exist"
description: "Because copy-pasting the same paragraph doesn't cut it anymore"
date: "2026-04-06"
author: "Bryan Hu"
---

You're writing a sentence and you want to try it three ways, not because you're indecisive but because that's how you write. You know you can't figure out the right phrasing until you've written the rest of the piece around it, so you want to keep all three alive, compare them, maybe edit one of them later, and decide when you're ready.

There isn't a tool for this. At least, not until now.

## The hacks writers actually use

The most common workaround is the bracket method, where you stack your variants inline with slashes.

> She walked into the room [/ stepped into the room / drifted into the room] and froze.

It works...barely. Sure, you can see all your options at a glance and the sentence stays in context, but the moment a variant gets longer than a few words, the brackets become unreadable. Additionally, if you wanted to try more combinations *inside* a variant (like a different verb or phrase), good luck with that.

Another workaround is the two-column table: left column is your current pick, right column is the alternates stacked vertically. It keeps everything editable, but now your document looks like a spreadsheet; you've traded the ugliness of brackets for the ugliness of a table breaking up your prose. Neither feels like writing.

These aren't bad ideas; they're evidence that writers need this feature and that no tool gives it to them, so they're building it out of duct tape.

## There's a name for what you want

What these hacks are trying to approximate is **inline branching for prose**: keeping multiple editable versions of a specific span of text (a sentence, a phrase, a paragraph) alive inside the document, switchable in place, without leaving the writing environment.

It's a kind of version control, but not the kind programmers use. Git, the most common implementation of version control, versions at the file level. What you want is versioning per clause.

## What people recommend instead

When you search for this, you'll find a handful of tools that look like they might do it. Some of these are tools you know any self-respecting writer would stay 10 feet awway from.

**Lex** is a Google Docs-style editor with AI features, and it has a "Versions" tool where you highlight text, ask for rewrites, and pick one. But **the versions come from AI**, so they're suggestions rather than your own writing AND they're ephemeral: you pick one and the others disappear. There's no way to keep three of your own phrasings alive and come back to them.

**Sudowrite** works similarly but for fiction. Highlight a sentence, get a bunch of AI-generated alternate phrasings, click to swap. Same problem: AI-generated, ephemeral, and no persistence, so once you pick, the rest are gone. It's trying to be [Twine](https://twinery.org/) but AI, and who cares about AI?

**Scrivener snapshots** let you save a version of a document section and revert to it later. But snapshots are whole-document or whole-section—you can't snapshot a single sentence. It's the same issue with Git.

**Obsidian with plugins** gets the closest. There's a community plugin that lets you store multiple variants of a span and cycle through them, but it requires using Obsidian as your writing environment. Obviously, revisions here aren't a first-class feature, and the moment the plugin maintainer stops updating, you're probably cooked.

**Cursor, Claude, or ChatGPT in a side panel** is the most manual option: copy a sentence out, paste it into a chat, ask for alternatives, copy the one you like back. It works the way everything works if you're willing to do enough clipboard gymnastics. It isn't really a tool, though; it's a workflow with no memory.

## The real distinction: rewrites vs. versions

There's a reason AI assistants keep recommending AI writing tools for this problem. From the outside, "get alternative phrasings" and "manage alternative phrasings" look like the same thing, but they're fundamentally different paradigms.

**AI rewrites** solve a *generation* problem: you have text, you want different text, and a model produces it. You evaluate options and pick a winner, while the other options vanish.

**Versioned writing** solves a *revision* problem: you have text, *you* write the alternatives, and you want to keep all of them while you figure out which one works. Maybe you won't decide today. Maybe the right choice depends on how the next paragraph turns out. Maybe you'll want to edit one of the alternatives next week when the piece has evolved further.

But a document-level system forces you to commit to one version at a time or else we're back to the hacks we first talked about. No tool exists for anything finer, like managing suggestions at the sentence-level or word-level.

At least, no tool existed until now.

## The tool that actually does this

This is why [Quillium](/) exists.

Quillium is a writing app where you can branch any span of text—a word, a sentence, a paragraph—and keep every version alive inside the document. The versions are written by you, live inline, and are switchable with a click.

A few things that make it different from every workaround above:

- **Nested editing.** You can open a revision and that revision's text can contain its own annotations—sub-revisions, comments, suggestions. It's infinitely recursive, matching your infinite creativity. Try doing that with brackets.

- **Undo crosses boundaries.** One global undo timeline spans the main document, all nested editors, and version switches. You can Cmd-Z back through a version switch. Try that in Scrivener.

- **You write every word.** No AI generates text for you, ever. We believe that's how you destroy writing abilities. Instead, Quillium has an [optional AI feature (off by default)](./ai-is-not-the-point) that works more like a second set of eyes: it will never generate new writing for you, ever.

The closest analogy isn't Scrivener snapshots or Lex's rewrite tool. It's **Git branches, but for individual sentences**, embedded in the document itself, with real-time switching and shared undo.

And no existing writing app does that.

## The bracket hack was the right idea

If you've been using brackets, tables, or copied paragraphs to manage your variants, you were right about the need. After all, [that's how we write](./the-myth-of-the-first-draft). You just didn't have the tool. The bracket hack `[/ option A / option B /]` *is* genuinely the closest analog to what Quillium does. But Quillium makes this a first-class UI instead of a plaintext workaround that falls apart at scale.

[Try it now.](/#download)
