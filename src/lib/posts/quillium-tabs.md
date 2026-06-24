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

Instead of a stack of drafts where you have a new version on top of an old one, you can now have the option to split a draft into other versions. In computer science, we call this a [tree](https://en.wikipedia.org/wiki/Tree_(abstract_data_type)). 

![](@assets/screenshots/drafts.png)

Instead of only allowing an iteration, you can now branch into separate document-level versions. Unlike revisions, a branch is closer to a fresh document than an edit, so you can use it however you want. I personally use iterations for refining a draft I believe in, and branches for trying out a completely different structure or, for my college essays, a completely different storyline.

To review:

1. Iterating is the everyday move: "the next version, continuing from here." When you iterate, the old draft locks (it's been superseded) and your new draft becomes the one you edit. An iteration chain stays flat: a list of versions, oldest to newest. Even after a hundred iterations, it reads as a hundred-item list, not a hundred-level-deep tree.
2. Branching is the rarer move: "a different take on the same idea." When you branch, nothing locks. The original and the branch are both live, side by side, and the branch starts its own iteration chain. This is different from revisions because branches give you a lot more freedom. 

In terms of UI design, the common action (iterate) gets the cheap visual (a flat list) while the rare action (branch) gets the expensive one (an indented line of its own). The frequent thing stays simple, meaning you only pay for the complexity when you actually reach for it.

In short, instead of a stack of drafts where each new version sits on top of the old one, you now have two distinct moves: you can iterate on a draft, or branch off it.

## But still there's an "issue" with Drafts.

When I was writing my UC PIQs, I wanted my outlines, research notes, and actual essay drafts all in one place, but I didn't want them cluttering the same buffer. 

Separating them using markdown headers worked as a hack, but it's messy and don't really work well with the draft system.

Think about it: with the workaround, when you create a new draft, is this new draft for your first essay or your fourth essay? It's ambiguous since they are both in the same document. How would you be able to tell at a glance?

The current workaround is to create new Quillium documents. You would have a separate Quillium document per PIQ essay. But if you wanted to edit your essays side-by-side or have an outline you wrote as a reference, you have to pull up a whole new window and view a separate Quillium document (yes, I also recently also added multi-window support).

## Enter Tabs.

![](@assets/screenshots/tabs.png)

Think of each tab as a separate workspace inside a single Quillium document. You might have:

- A Research tab with links, quotes, and outlines
- A Brainstorm tab for freewriting and fragments
- A Draft tab where you're actively writing

Each tab has its own full draft system (tree, revisions, annotations) so you can experiment with different storylines in your Draft tab while keeping your research pinned in another tab, all without ever opening a second window.

Previously, you'd have to create separate Quillium documents and juggle windows. Now, it's all in one place.

## Come try it out!

You can [download Quillium](https://quillium.bryanhu.com) and try it out for yourself! It's currently in public beta, but if this whole idea of non-linear writing sounds appealing to you, I highly encourage you to try it out and [provide me feedback](mailto:founder@quillium.bryanhu.com).
