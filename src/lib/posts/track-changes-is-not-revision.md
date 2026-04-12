---
title: "Track Changes Is Not Revision"
description: "Word's Track Changes was built for corporate document approval, not for writers who actually revise."
date: "2026-04-11"
author: "Bryan Hu"
---

There's a [blog post from 2015](https://mjwrightnz.wordpress.com/2015/08/03/why-i-think-track-changes-sucks-as-an-editing-tool/) by Matthew Wright called "Why I Think Track Changes Sucks as an Editing Tool." He's a New Zealand editor, and his core complaint is simple: [Track Changes](https://support.microsoft.com/en-us/office/track-changes-in-word-197ba630-0f5f-4a8e-9a77-3712475e806a) was designed for office workers passing memos back and forth, not for people doing real line-editing on prose. He's right, and the situation hasn't improved in the eleven years since he wrote it.

Track Changes does one thing: it shows you what someone added and what someone deleted, inline, in a single linear diff. That's useful if you're a manager reviewing a contract and you want to see exactly which clauses your lawyer changed. It is almost useless if you're a writer trying to revise.

## The diff is not the point

When you're revising a piece of writing, you're not making a list of surgical edits to an otherwise finished document. You're *rethinking*. You're trying a different opening, restructuring an argument, cutting a paragraph and seeing if the piece still holds without it. You might rewrite the same sentence five different ways before you figure out what you actually mean.

Track Changes can't represent any of that. It shows you insertions and deletions on a single timeline. If you rewrite a sentence, Track Changes doesn't show you "here are two versions of this sentence." It shows you a red strikethrough of the old words and a blue insertion of the new words, jammed together in a way that makes both versions harder to read than either one alone.

And if you rewrite it a *third* time? Now you have a strikethrough of the strikethrough, nested colored text, and a document that looks like a crime scene. What a mess! The more you revise, the less readable the diff becomes. The tool actively punishes you for doing the thing writing requires.

## Scrivener tried, sort of

Scrivener's "Revision Mode" takes a different approach: instead of tracking deletions, it just colors new text. Turn on revision mode, and anything you type shows up in red (or blue, or green, depending on which revision pass you're on). It's less noisy than Track Changes, but it's also less useful, because it doesn't track deletions at all. If you cut a sentence, it's gone. No strikethrough, no record.

Scrivener also has Snapshots, which are manual save points you can compare against the current version. This is closer to what writers actually need, but it's per-document, completely manual, and the comparison view is basic. You have to remember to take the snapshot *before* you start revising, and if you forget, tough luck.

The pattern across all of these tools is the same: revision is treated as an afterthought. Something bolted on top of a document model that was never designed for it.

## What revision actually looks like

When I watch how I revise (and how every writer I've talked to revises), it looks nothing like a linear diff. It looks like a tree.

You write a paragraph. You try a different version. You keep both, because you won't know which is better until the next paragraph takes shape. Maybe you try a third version that combines the opening of version one with the closing of version two. You want all of these alive, visible, and easy to switch between.

Track Changes gives you a diff. Scrivener gives you colored text. Google Docs gives you a timeline you can scrub through. None of them give you what you actually want: the ability to hold multiple versions of the same passage in parallel and decide later.

## Branching instead of tracking

This is what I built Quillium to do. Instead of tracking changes to a single version of your text, you branch. Select a sentence, fork it, write an alternative. Both versions live in the document, side by side. You can switch between them, compare them, fork again. Nothing gets destroyed, nothing gets buried in a diff.

The mental model is different from Track Changes in a way that matters: Track Changes asks "what changed?" Quillium asks "what are my options?" Writers need the second question a lot more than they need the first.

And because every branch is scoped to the specific text it belongs to, you can mix and match freely. The formal opening from version one, the conversational middle from version two, the ending you just wrote ten minutes ago. You don't have to accept or reject changes across the whole document. You pick the best version of each piece independently.

## Track Changes has its place

I'm not saying Track Changes is useless. If you're an editor sending a marked-up manuscript back to an author, or a lawyer redlining a contract, the linear diff is exactly what you need. It's a communication tool for saying "here's what I changed, do you agree?"

But that's proofreading. That's copyediting. And yes, you could argue that copyediting *is* revision, that every stage of editing is part of the same process. Fair enough.

But there's a reason writers talk about "revising" and "copyediting" as different activities. Revision is when you're still figuring out what the piece is. Copyediting is when you already know and you're cleaning it up. Track Changes is fine for the cleaning-up part. It's the figuring-out part where it falls apart, and that's where most of the actual writing happens.

If Track Changes has been getting in your way more than helping, [give Quillium a shot](/#download).
