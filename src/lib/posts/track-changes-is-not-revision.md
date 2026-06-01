---
title: "Track Changes Is Not Revision"
description: "Word's Track Changes was built for corporate document approval, not for writers who actually revise."
date: "2026-04-11"
author: "Bryan Hu"
---

There's a [blog post from 2015](https://mjwrightnz.wordpress.com/2015/08/03/why-i-think-track-changes-sucks-as-an-editing-tool/) by Matthew Wright called "Why I Think Track Changes Sucks as an Editing Tool." He's a New Zealand editor, and his core complaint is simple: [Track Changes](https://support.microsoft.com/en-us/office/track-changes-in-word-197ba630-0f5f-4a8e-9a77-3712475e806a) was designed for office workers passing memos back and forth, not for people doing real line-editing on prose.

Track Changes does one thing: show you what someone added and what someone deleted, inline, in a single linear diff. That's useful if you are a manager reviewing a contract and you want to see exactly which clauses your lawyer changed.

Matthew is (W)right, and the situation hasn't improved in the eleven years since he wrote that blog: Track Changes is almost useless if you're a writer trying to revise.

## The diff is not the point

When you're revising a piece of writing, you're *rethinking*. You're trying a different opening, restructuring an argument, cutting a paragraph and seeing if the piece still holds without it. You might rewrite the same sentence five different ways before you figure out what you actually mean.

Track Changes can't represent any of that. It shows you insertions and deletions on a single timeline. If you rewrite a sentence, Track Changes doesn't show you "here are two versions of this sentence." Instead, it shows you a red strikethrough of the old words and a blue insertion of the new words, jammed together in a way that makes both versions harder to read than either one alone.

And if you rewrite it a *third* time? You end up with a strikethrough of the strikethrough, nested colored text, and a document that *looks like a crime scene.* The more you revise, the less readable the diff becomes, so *the tool actively punishes you for doing the thing that writing requires!*

## Scrivener tried, sort of

Scrivener's "Revision Mode" takes a different approach: instead of tracking deletions, it just colors new text. Turn on revision mode, and anything you type shows up in red (or blue, or green, depending on which revision pass you're on). It's less noisy than Track Changes, but it's also less useful, because it doesn't track deletions at all. If you cut a sentence, it's gone. No strikethrough, no record.

Scrivener also has Snapshots, which are manual save points you can compare against the current version. This is closer to what writers actually need, but it's per-document, completely manual, and the comparison view is basic. You have to remember to take the snapshot *before* you start revising, and if you forget, tough luck.

The pattern across all of these tools is the same, in that revision is treated as an afterthought, something bolted on top of a document model that was never designed for it.

## What revision actually looks like

You write a paragraph, try a different version, or in the end you can't decide and want to keep both because you won't know which is better until the next paragraph takes shape. Maybe you try a third version combining the opening of version one with the closing of version two. Either way you want all of these alive, visible, and easy to switch between.

Track Changes gives you a diff, Scrivener gives you colored text, and Google Docs gives you a timeline you can scrub through. None of them give you what you actually want, which is *the ability to hold multiple versions of the same passage in parallel and decide later.*

## Branching instead of tracking

This is what I built Quillium to do. Instead of tracking changes to a single version of your text, *you* do the branching: select a sentence, fork it, and write an alternative. Both versions live in the document, side by side. You can switch between them, compare them, fork again. Where Track Changes asks "what changed?", Quillium asks "what are my options?"

## Track Changes has its place

I'm not saying Track Changes is useless. If you're an editor sending a marked-up manuscript back to an author, or a lawyer redlining a contract, the linear diff is exactly what you need, because it works as a communication tool for saying "here's what I changed, do you agree?"

But that's proofreading or copyediting. And yes, you could argue that copyediting *is* revision, and that every stage of editing is part of the same process.

But there's a reason writers talk about "revising" and "copyediting" as different activities. Revision is when you're still figuring out what the piece is, whereas copyediting is when you already know and you're cleaning it up. Track Changes is fine for the cleaning-up part, but it falls apart in the figuring-out part, and that's where most of the actual writing happens.

If Track Changes has been getting in your way more than helping, [give Quillium a shot](/#download).
