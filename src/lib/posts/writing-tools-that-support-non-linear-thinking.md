---
title: "Writing Tools That Support Non-Linear Thinking"
description: "Most writing tools force linear thinking. A look at non-linear writing tools—and what's still missing at the prose level."
date: "2026-03-23"
author: "Bryan Hu"
---

Open any writing tool and you get a blank page, a blinking cursor, and an implicit instruction to start at the top and write to the bottom.

That's how almost every writing app works, from Google Docs and Word to Notion and most of the distraction-free editors that were supposed to be different. They share an assumption that writing is linear, and the interface reflects that assumption down to the scroll behavior.

## How thinking actually works

Ideas branch. You're writing a paragraph and you realize there are two completely different directions it could go, or you loop back because something you wrote on page three changes what you meant on page one, or one argument fractures into two and you're not yet sure which is stronger. This isn't a bug in your creative process; it *is* the process. The problem is that our tools don't support it, so the branching has to happen in your head or in a mess of side documents that nobody enjoys maintaining.

## The landscape so far

Some tools have tried to address this. Mind-mapping software like MindMeister and Miro lets you brainstorm non-linearly, connecting ideas in webs instead of sequences, which works well for ideation but gives you nowhere to actually write prose. You can't draft an essay inside a node diagram.

Outliners like Roam Research and Obsidian get closer. They let you link ideas bidirectionally, nest thoughts, and build a graph of connected notes, all of which makes them strong as research and note-taking environments. When it comes time to actually write, though — to turn those atomic notes into a coherent piece of prose — you're back inside a linear document. The non-linearity stops at the outline level.

Scrivener deserves credit here. Its corkboard and binder let you rearrange sections, split documents, and maintain multiple drafts, and the whole tool genuinely understands that writing is modular. Scrivener's unit of modularity, though, is the document or the section. If you want to explore two different versions of a single paragraph, you're back to copying and pasting or keeping a "scraps" file, and there's nothing at all for phrases or individual sentences except maybe inline annotations.

## The gap

When you agonize over a piece of writing, it's rarely about which section goes where. It's about this sentence: whether it should be blunt or gentle, whether this paragraph lands better leading with the example or with the claim, whether the verb is pulling its weight. You want to try both versions and keep both alive while you figure out which one earns its place. No existing tool lets you do that without a mess of duplicated files or copy-pasted paragraphs filling up the margins.

## What branching prose looks like

This is the problem I built [Quillium](/) to solve. Quillium lets you fork at the sentence and paragraph level, roughly the way Git branches work but designed for prose rather than code. You write a sentence and then branch it, trying a different tone, a different structure, or a completely different idea, and every version stays alive, navigable, and comparable without drowning in `draft_v7_FINAL2.docx` files.

The point isn't to add complexity; the point is to finally match the tool to the way your brain already works. Writing is revision, revision is exploration, and exploration by its nature branches.

## Try it

If you've ever felt like your writing tool was fighting the way you think, I'd love for you to [try it out](/#download). Quillium is still early, but the core idea is working, and I think it changes how writing feels.
