---
title: "Why Not ___?"
description: "Google Docs, AI writing tools, Git—the obvious alternatives already exist. Here's why none of them are actually doing what Quillium does."
date: "2026-03-27"
author: "Bryan Hu"
---

The obvious alternatives already exist: Google Docs, AI writing tools, and Git. So when someone asks why I'm building Quillium, I get it. Here's my actual answer to each one.

## Why not Google Docs?

Google Docs is genuinely good. For what it was designed for—sharing a document, editing with other people, writing something you already know how to say—it's hard to beat. It's free, ubiquitous, and has real-time collaboration that actually works. Backed by Google, used by billions, what could possibly be its downside?

The issue isn't Google Docs: it's what Google Docs assumes about writing.

Google Doc's version history is a linear list of timestamps. You scroll back through it looking for the paragraph you deleted on Tuesday, and what you find is a list of saves sorted by time with no labels (unless you manually added one) and no branching. "Version history" implies that your writing *has* a history: a single chain of events you can trace back. That might be true for spreadsheets and legal documents. It's not true for writing.

When you revise, you're not moving forward through a timeline; you're exploring a space. You try one angle, then a completely different one, then you go back and combine pieces of both, not exactly a linear history. Google Docs can't represent that. It records what you ended up with, not what you explored. Every version you *didn't* keep is gone.

There's also the Suggesting mode, which does let you propose changes to your own text, but it's an approval/rejection interface, not a branching one. It shows you what you want to change from and to, and then you accept or reject. Once you have several overlapping suggestion diffs open, the UI becomes genuinely unreadable: colored strikethroughs layered over colored insertions across multiple paragraphs, with no way to see what the document actually looks like under any given set of choices. It's designed for a reviewer leaving one round of edits, not a writer mid-exploration.

The workarounds people actually use are copy-pasting paragraphs into the comments, keeping a graveyard of old versions at the bottom of the document, or opening a new tab for each draft. Those work—barely—when you have two versions of one paragraph.

But once you're juggling three different angles for the opening, two for the conclusion, and a completely different structural approach you want to try, the number of combinations explodes. You'd need a tab for every permutation. Nobody does that, so instead they just pick one and delete the rest, and hope they chose right.

Google Docs is built for transcription. You know what you want to say, you type it, you share it. If that describes your writing process, it's fine. If your writing process involves not knowing what you want to say until you've written it four different ways—and for most serious writing, it does—Google Docs is quietly working against you.

## Why not AI?

What?? Quillium's not an AI writing app. It's not even remotely close to AI. This question is a category error, and Quillium not a real alternative nor competitor.

AI writing tools—ChatGPT, Claude, Jasper, Grammarly's "rewrite" features—are *generation* tools. You give them a prompt or a rough draft and they produce text. The output is words you didn't write. That's the whole point.

Quillium is not a generation tool. You write every word yourself. No text is generated for you, no sentences autocompleted, no "here's a better version" suggestions. The comparison to AI writing tools is a bit like asking why you'd use a text editor instead of hiring a ghostwriter; they're not alternatives to each other. Quillium is solving a completely different problem.

The confusion is understandable though. I've written about it [at length](/blog/quillium-is-not-an-ai-app). Every new writing product in 2025 and 2026 has "AI-powered" somewhere in the pitch, and people reasonably assume anything in the writing tool category is another one of those. The assumption breaks down fast when you look at what each tool is actually doing, though.

In short, AI tools solve a generation problem: I need words, give me words. Quillium solves a revision problem: I have words, I want to keep every version of them while I figure out which ones are right.

If anything, they work together fine. You can use AI to generate a draft, but it doesn't help you navigate between five versions of the same paragraph. Quillium doesn't generate anything—it just makes sure that when you write five versions, none of them disappear.

Write a rough draft however you want—by hand, with AI assistance, by dictation. Quillium is for what comes after, when you're revising, which is when writing actually happens.

## Why not Git?

This one is for the developers reading this. You already know Git. You use it every day. You know branching works, you know the value of keeping every version, you know what it feels like to have a history you can actually navigate.

So why aren't you using it for your writing? Probably because you've tried it, and it's painful.

Git is built for code. That means it's built around files, commits, and diffs—three concepts that map awkwardly onto prose. But a commit message for "rewrote the second paragraph three times" is meaningless. A diff that shows you what changed line-by-line across a 4,000-word essay isn't useful when the line breaks are arbitrary. Merge conflicts in prose produce output that reads like noise. And the discipline of writing good commit messages, staging changes, maintaining branch names—it's overhead that makes sense when you're shipping software, but it's dead weight when you're trying to think on the page.

Git's granularity is the commit. Quillium's is the sentence. Or word, or phrase. That difference matters more than it sounds. You can fork a single clause (like a formal version versus a conversational one) without `git checkout -b`, without switching contexts, and (most importantly) without writing a commit message. You just fork it, both versions exist, and you keep writing.

The other thing Git doesn't give you is a prose-native interface. Reading a branching history in Quillium looks like reading a document, just with some annotations. Reading a branching history in Git looks like a terminal or subway system. One of those feels like writing; the other feels like engineering.

Git solved the conceptual problem–nonlinear history, branching, nothing gets lost. Quillium takes that solution and builds it for writers instead of programmers.

## Conclusion

Google Docs tracks what you ended up with, not what you explored. AI tools are for generating text, which is a completely different problem. Git gets the concept right but was built for code, and it shows.

Quillium is for writers who revise obsessively, who keep five versions of the same paragraph, who want to explore without losing anything.

The alternatives aren't bad. They just weren't built for this.

[Get notified when we launch.](/#waitlist)
