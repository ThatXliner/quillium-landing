---
title: "How Quillium Keeps Your Writing Safe"
description: "Every keystroke is saved. Every crash is caught. Here's how Quillium's robustness guarantees actually work."
date: "2026-04-07"
author: "Bryan Hu"
---

The scariest thing about a writing tool isn't a missing feature, it's losing your work.

I've been there. Everyone has. You're two thousand words into something good, the app freezes, and when you reopen it: gone. Or half-gone, which is somehow worse because now you're staring at a fragment and trying to remember what the rest said.

Every writing tool handles this the same way: autosave. Write your work to disk every few seconds, and if something goes wrong, you lose a few seconds at most. It's a good baseline. Quillium does this too: every keystroke is written to a local database the instant it happens. There's no save button, no "unsaved changes" dialog, no prompt asking if you're sure you want to leave. You type, it's saved.

But autosave only protects you from one kind of disaster: the app closing unexpectedly. It does nothing about the other kind—the kind where the app is working *perfectly* and *you're* the one who just accidentally destroyed your work.

## The disaster autosave can't prevent

You're seven chapters into your novel. You hit Cmd+A by accident, then press a key. Your entire manuscript is replaced with the letter "k." The app dutifully autosaves. Congratulations—your latest save is now just the letter "k."

Or you're cleaning up and accidentally delete a section that contained three [revisions](./inline-branching-for-prose) you'd been developing for weeks. Each revision had its own nested drafts, comments, and suggestions. Gone in one keypress...*and autosaved*.

In every other writing tool, your only hope at this point is undo. If you've done anything else since the deletion, or closed the app, or if the undo history doesn't extend far enough, you're out of luck. The tool *watched you destroy your own work* and helpfully saved the destruction.

Quillium doesn't do that.

## Proactive recovery: snapshot *before* damage

Quillium monitors every edit in real-time. When it detects a change that looks catastrophic, it **creates a recovery point of the state *before* the change is saved**—automatically, without you asking.

If you accidentally wipe out a huge chunk of your document, Quillium catches it. Same thing if a batch of your revisions, comments, or suggestions vanish at once. An amber warning appears with a link to version history. Your work is not blocked (you can continue editing), but if you look at version history, there's a snapshot waiting for you, labeled "Before large deletion (auto)" or "Before mass annotation removal (auto)," containing everything exactly as it was one second ago.

This is the difference between a tool that saves your work and a tool that **protects** your work. Autosave is reactive—it preserves whatever state the document is in. Proactive recovery is preemptive—it recognizes that the state might be wrong and preserves the *previous* state before it's too late.

No other writing tool I know of does this.

<details>
<summary>How the detection works</summary>

Three heuristics trigger the warning. The first catches large deletions: at least 100 characters removed *and* at least 20% of the document gone at once. Both thresholds must pass, which prevents false alarms on short documents while catching genuine disasters on long ones.

The second catches mass annotation removal: at least 3 annotations deleted *and* at least 25% of all annotations wiped simultaneously. Annotations are how Quillium stores revisions, comments, and suggestions internally, so losing them means losing your branching history.

The third catches deep annotation loss: if a single removed annotation contained more than 3 nested sub-annotations across its versions, or any sub-annotation that itself had nested content. A revision in Quillium can contain its own comments, suggestions, and even sub-revisions. Thus, deleting one top-level revision could silently destroy an entire tree of work which the mass-removal check wouldn't catch because it only sees one annotation disappearing.

</details>

## The five design principles behind the rest

Proactive recovery is the headline, but it's one layer in a larger system. Everything else follows from five ideas.

### 1. Every keystroke is persisted

Quillium stores every change you make as a separate entry in an append-only log. Every insertion, every deletion, every annotation change is recorded in order.

The document you see is reconstructed from that history (between snapshots at certain intervals), which means if something goes wrong at any point, the full record of how your document got there is preserved. There's no window where work can be lost because there's no concept of "unsaved changes." This is exactly how modern text editors preserve work-in-progress code as well.

<details>
<summary>How the event log works</summary>

This is an event-sourcing architecture backed by SQLite in WAL mode. There is no "document content" column—all content lives exclusively in the events and snapshots tables. Event types include `doc_change` (insertions/deletions + selection), `compound` (document changes combined with annotation events), and individual annotation operations like `annotation_add`, `annotation_remove`, and `annotation_update`.

All writes go through a serialized promise queue to guarantee transaction order regardless of async timing. If you navigate away from a document mid-write, the stale write is detected and aborted.

</details>

### 2. Degrade, never crash

What if part of the history is corrupted? Maybe a record got mangled, or an annotation has invalid data. Most apps would crash but Quillium doesn't.

Every record is handled individually. A corrupt event is skipped, a warning is logged, and replay continues with everything that came after it. One bad record doesn't prevent recovery of the thousands of good ones. The same goes for annotations: if one fails validation on load, it's dropped and the rest load normally. If an entire snapshot is corrupted, Quillium falls back to rebuilding from a fresh state.

The principle is simple: **corrupt data should degrade to a safe default, not bring down the app.** You might lose a single annotation or a single edit, but you'll never lose everything because one byte was wrong.

<details>
<summary>How validation works</summary>

Every annotation is validated against a strict schema on load. The schemas are designed to tolerate unknown fields from future versions, so your data won't break when Quillium updates. On validation failure, the annotation is dropped with a logged error, and the rest of the annotation map loads normally.

During event replay, each event is processed in a try/catch. If a single event throws—malformed data, unknown type, out-of-range position—it's skipped with a warning and replay continues.

</details>

### 3. Restore should heal, not just paste

Restoring from a backup isn't just dumping text back in. Just in case, Quillium performs a "healing restore" that recovers your annotations—revisions, comments, suggestions—along with the text.

It works by remembering the actual text content at each annotation's position, not just the position. After the document is restored, it searches for each of those text fragments in the new document. If found, the annotation is re-attached at its correct position. If not found, it's placed at the beginning with a warning rather than silently dropped. For revisions with nested content, the healing process goes deeper, validating and re-anchoring at every level.

One subtle detail: the restore is specially tagged so the suspicious change detector *doesn't* trigger on it. Without this, restoring a backup would look like a massive deletion and create a circular loop of warnings.

### 4. Time travel is always available

Between automatic snapshots (every 50 changes or 2 minutes), checkpoints you name yourself, and safety snapshots created before suspicious changes, Quillium is constantly building a timeline of your document. You can always go back.

Version history isn't an afterthought buried in a menu. It's a full browsing experience: every snapshot is reconstructed as a read-only editor so you can see exactly what you'd be restoring before you commit to it. Restoring requires two clicks—first to select, second to confirm—so you can't accidentally roll back by mis-clicking.

Yeah: it's just like Google Docs. Named checkpoints are never auto-pruned—only unlabeled automatic snapshots get cleaned up. And if storage grows large, Quillium warns you at 1 GB and lets you prune by count or by age.

The result: it's not just "we recover from crashes." It's that **you can browse and preview any point in your document's history**, and the system is quietly creating recovery points for you in the background.

## Undo that actually works

I've written before about [why the undo button is a lie](./why-the-undo-button-is-a-lie). But this blog post is about reliability, so it's kind of different. But, for completion, it's good to know that Quillium's undo and redo work across annotation changes, version switches, and even implicit deletions.

<details>
<summary>How annotation undo works</summary>

The annotation system generates inverted effects for every operation: adding an annotation generates a remove on undo, updating a comment thread restores the previous version, switching a revision's active version switches it back. For implicit deletions—where typing collapses an annotation's range to zero width—the system detects the disappearance by diffing old and new state, and generates a restore effect with special handling for collapsed ranges.

Guards prevent undo from generating its own undo entries during replays, internal revision edits, and nested editor operations.

</details>

## Why this matters

If you can't trust a word processor to reliably save your work, you can't trust it to do *anything*.

Half the development time for Quillium's [public beta](./public-beta) was spent on reliability alone. Not features, not UI polish, not ["aI iNtEgRaTIOn"](./ai-is-not-the-point). 

It's about reliability. Because a writing tool that loses your writing isn't a tool—it's a liability.

Your words are safe here. [Try it out now.](/#download)
