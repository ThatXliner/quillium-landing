---
title: "How We're Thinking About Collaboration"
description: "Collaboration shouldn't mean compromise. Here's how we're designing Quillium Omni to give writers shared space without shared constraints."
date: "2026-04-09"
author: "Bryan Hu"
---

Quillium is a solo tool right now. You write locally, your files live on your machine, and nobody else can see your document unless you export it. That's going to change.

We're building real-time collaboration into Quillium, and I want to talk about how we're thinking about it because most collaborative writing tools get it wrong, and we'd rather take our time than ship the same mistakes everyone else has.

## What's missing from Google Docs

Google Docs's collaboration is genuinely pretty good. With real-time cursors, instant sync, comments in the margin, suggestions, etc. it works perfectly fine.

But Google Docs gives you collaboration on a *linear document*. One version of the text, one timeline, one history. If you and your co-author both want to try a different direction for the opening paragraph, one of you has to copy-paste into a side doc or leave a comment saying "what if we tried it this way?" The tool has no concept of two versions of the same sentence existing at the same time. And what if you wanted to make further edits to the 2 sides of the story?

That's the gap. The collaboration infrastructure is solid, but it's built on top of a writing model that doesn't support how writers actually revise. Quillium already has branching—you can fork a sentence, keep three versions alive, decide later. The question for us was: what does collaboration look like when the *document itself* supports parallel exploration?

## What we're actually building

Quillium Omni is designed around a different principle: **shared text, independent views**.

Here's what that means:

- You and your collaborator see the same document, the same text, the same annotations.
- But your UI state is yours. Nobody else's modals pop up on your screen. Nobody else's scroll position drags you around. You're working in the same material, but you're each in your own headspace, should be pretty intuitive.
- Annotations—comments, revisions, suggestions—sync in real time. When your collaborator leaves a note, you see it immediately, anchored to the exact text it references.
- If you *want* to see what someone else is doing, you can opt into follow mode (the way Figma does it). Click on a collaborator's avatar, and your view mirrors theirs—their scroll position, their cursor, even which revision version they're looking at. Click away and you're back to your own view.

The key design decision here is that collaboration is additive. Nothing about the core writing experience changes. You still branch text, you still have your revision history, you still write offline. Omni layers on top; it never replaces what's underneath.

## The owner model

Here's a decision we made early that might be controversial: the person who owns the document is the only one with full offline access, version history, and snapshots. Collaborators work through the server.

I'll be honest: part of this is a technical constraint. Quillium's collab protocol is built on CodeMirror's `@codemirror/collab`, which uses [operational transformation](https://en.wikipedia.org/wiki/Operational_transformation). OT requires a central authority to order changes: there's no true peer-to-peer offline editing the way CRDTs allow. The owner's machine is the source of truth, and collaborators work through a relay server.

But the constraint also happens to match how writing actually works. There's almost always a primary author—the person whose voice the piece is in, the person who makes the final call. In Quillium, the owner of a document keeps full offline access, version history, and snapshots. If the server goes down, the owner keeps writing. Collaborators reconnect when they can.

We may migrate to CRDTs later (Yjs is the likely candidate), which would open up true offline editing for everyone. But for v1, the owner model is both the technically honest choice and the one that reflects how most collaborative writing actually happens.

## Annotations are the collaboration layer

In most collaborative editors, the collaboration *is* the text. Two people type into the same document and the tool merges their keystrokes.

In Quillium, the primary collaboration layer is annotations. Comments, revisions, and suggestions are shared and live—they sync in real time, they're anchored to the text they reference, and they carry attribution. When your editor leaves a comment on your second paragraph, you see it appear inline, attached to exactly the words they're responding to.

This matters because it means collaboration can happen *around* the writing without disrupting the writing itself. Your collaborator can leave detailed feedback on a draft while you're actively revising a different section. The annotations don't conflict with your edits because they exist alongside the text, not inside it.

And because Quillium already has branching, your collaborator's suggestion can literally become a revision: "try it this way" turns into a new version of the sentence that lives next to your original. You compare, you pick, or you keep both. That's what a real writing conversation looks like.

## What we're not building

We're not building a web client (yet). Collaboration in v1 is desktop-to-desktop: both people need the Quillium app. This is partly a resource constraint and partly intentional—writing apps belong on your desktop, and we'd rather get the core experience right than spread thin across platforms.

We're not building Google Docs-style simultaneous typing as the primary interaction. You *can* edit at the same time, and those edits will sync correctly. But the product isn't optimized for two people typing into the same paragraph at once. It's optimized for two people *thinking* about the same paragraph in their own time and own way.

We're also *not* building a free tier for collaboration. Quillium Omni will be around $20/month, because running a real-time relay server costs real money and we'd rather charge honestly than mine your data. The writing app itself stays free forever, and collaboration is an upgrade for people who want it. Collaborators don't need to pay—only the document owner does. See our [pricing page](/pricing) for the full picture.

## When?

Soon-ish. We're working through the infrastructure now: auth, the relay server, the sync protocol. I'm not going to give a date because I'll miss it, but it's the next major feature after the current round of editor improvements.

If this is the kind of collaboration you've been wanting—something that respects the way writers actually work together, rather than forcing everyone into a shared cursor—[download Quillium](/#download) and start writing. When sync ships, your documents will be ready for it.
