---
title: "Branching Narrative Writing Software: What Exists and What's Missing"
description: "A survey of branching narrative writing software — what tools exist today, where they fall short, and what writers actually need."
date: "2026-03-23"
author: "Bryan Hu"
---

Every writer knows the feeling. You're three paragraphs into a scene and you realize there's another way it could go. A better way, maybe. Or just a different way, one you want to explore without losing what you already have.

So you do what everyone does: you copy the paragraph, paste it below, and keep going. Maybe you leave a comment—"ALT VERSION" in all caps—or create a new document called `chapter-3-v2-FINAL-actual-final.docx`. It works. Barely. And it falls apart the moment you have more than two directions you want to explore.

This is a branching problem. And despite decades of software development, writers still don't have a good tool for it.

## What's out there

A few tools touch on this idea, but none of them quite nail it.

**Twine** is probably the closest thing to branching writing software that exists today. It was built for interactive fiction, and it does that well. Interactive fiction are the "choose your own path" kind of stories. You create nodes, connect them with links, and build a graph of narrative paths.

But Twine is designed for the *reader's* branching experience, not the *writer's*. You're authoring a final product that branches. You're not exploring multiple drafts of the same passage.

**Scrivener** is the go-to for long-form writing project management. It gives you a binder, index cards, split views. You can organize chapters and scenes with real flexibility. But at the sentence and paragraph level, Scrivener is still linear. There's no concept of "here are three versions of this paragraph, and I haven't decided which one I want yet." You'd have to manage that yourself with duplicate documents or duplicate paragraphs on the same page. It's easy to lose track of which is the "best version" or the "cleanest one" versus the "most engaging one."

**Git** solves the branching problem elegantly...for code. Branch, commit, merge, diff. It's exactly the mental model writers need. But Git was built for developers, and the interface reflects that. Asking a novelist to run `git checkout -b chapter-3-darker-tone` is not a serious suggestion. The concepts are right. The UX is not.

**Google Docs** has version history, which sounds relevant until you use it. Version history is linear: it's a timeline you scrub through. You can't maintain two active branches of a document simultaneously. You can't say "keep both of these alive and let me switch between them." It's undo on a slider. That's not branching.

## The gap

Here's what's missing: a writing tool that treats prose branching as a first-class feature.

Not branching for the reader. Not branching for developers. Branching for *writers*: people who think in drafts, who want to explore without committing, who need to keep multiple versions of a sentence alive because they genuinely don't know which one is better yet.

The ideal tool would let you fork at any point—a word, a sentence, a paragraph, an entire chapter. You'd see your branches visually, navigate between them without losing context, and merge the pieces that work back together when you're ready. The versions you're unsure about wouldn't disappear into some version history graveyard. They'd stay right there, accessible, part of your working document.

Think of it less like version control and more like version *exploration*. The difference matters. Version control implies a main branch and a history. Version exploration implies that all branches are alive until you decide otherwise.

## What I'm building

This is exactly the problem I'm working on with **Quillium**. The core idea is simple: writing is non-linear, so your writing tool should be too. You should be able to fork a sentence the way a developer forks a branch: instantly, without ceremony, without losing anything.

I'm not building Twine for novelists or Git with a pretty face. I'm building a writing environment where branching is so natural you don't think about it. Where exploring an alternative phrasing is as easy as typing it, and both versions just... exist. Keyboard first!

Writing is already non-linear in your head. It's time your tools caught up.

If this resonates, [join the waitlist](/#waitlist).
