---
title: "How Quillium Keeps Your Writing Safe"
description: "Every keystroke is saved. Every crash is caught. Here's how we approach robustness."
date: "2026-04-07"
author: "Bryan Hu"
---

The scariest thing about a writing tool isn't a missing feature; it's losing your work. Everyone who has written on a computer for long enough has been there. You're two thousand words into something good, the app freezes, and when you reopen it the work is gone, or half-gone, which is somehow worse because now you're staring at a fragment and trying to remember what the rest of the draft said.

Every writing tool handles this the same way: autosave. The app writes your work to disk every few seconds, and if something goes wrong you lose a few seconds at most. It's a good baseline, and Quillium does it too; every keystroke is written to a local database the instant it happens, with no save button, no "unsaved changes" dialog, and no prompt asking whether you're sure you want to leave. You type, and the app has already saved.

Autosave only protects against one kind of disaster, though: the app closing unexpectedly. It does nothing about the other kind, the kind where the app is working perfectly and you are the one who just accidentally destroyed your own work.

## The disaster autosave can't prevent

You're seven chapters into your novel. You hit Cmd+A by accident, then press a key, and your entire manuscript is replaced with the letter "k." The app dutifully autosaves, and now your latest save is the letter "k." Or you're cleaning up and accidentally delete a section that contained three [revisions](./inline-branching-for-prose) you'd been developing for weeks, each with its own nested drafts, comments, and suggestions. Gone in one keypress, and autosaved.

In every other writing tool, your only hope at this point is the undo button. If you've done anything else since the deletion, or closed the app, or simply run out of undo history, you're out of luck. The tool watched you destroy your own work and helpfully preserved the destruction.

## Proactive recovery: snapshot *before* damage

Quillium monitors every edit in real-time. When it detects a change that looks catastrophic, it **creates a recovery point of the state *before* the change is saved**—automatically, without you asking.

If you accidentally wipe out a huge chunk of your document, Quillium catches it. Same thing if a batch of your revisions, comments, or suggestions vanish at once. An amber warning appears with a link to version history. Your work is not blocked (you can continue editing), but if you look at version history, there's a snapshot waiting for you, labeled "Before large deletion (auto)" or "Before mass annotation removal (auto)," containing everything exactly as it was one second ago.

That's the difference between a tool that saves your work and a tool that **protects** your work. Autosave is reactive: it preserves whatever state the document happens to be in. Proactive recovery is preemptive: it recognizes that the state might be wrong and preserves the previous state before it's too late.

No other writing tool I know of does this.

<details>
<summary>How the detection works</summary>

Three heuristics trigger the warning. The first catches large deletions: at least 100 characters removed *and* at least 20% of the document gone at once. Both thresholds must pass, which prevents false alarms on short documents while catching genuine disasters on long ones.

The second catches mass annotation removal: at least 3 annotations deleted *and* at least 25% of all annotations wiped simultaneously. Annotations are how Quillium stores revisions, comments, and suggestions internally, so losing them means losing your branching history.

The third catches deep annotation loss: if a single removed annotation contained more than 3 nested sub-annotations across its versions, or any sub-annotation that itself had nested content. A revision in Quillium can contain its own comments, suggestions, and even sub-revisions. Thus, deleting one top-level revision could silently destroy an entire tree of work which the mass-removal check wouldn't catch because it only sees one annotation disappearing.

</details>

## The five design principles behind the rest

Proactive recovery is the headline, but it's one layer of a larger system that follows from five underlying ideas.

### 1. Every keystroke is persisted

Quillium stores every change you make as a separate entry in an append-only log. Every insertion, every deletion, every annotation change is recorded in order.

The document you see is reconstructed from that history (with snapshots taken at regular intervals), which means if something goes wrong at any point, the full record of how your document got there is preserved. There's no window in which work can be lost, because there's no concept of "unsaved changes" to begin with. This is essentially the same approach modern text editors use to preserve in-progress code.

<details>
<summary>How the event log works</summary>

This is an event-sourcing architecture backed by SQLite in WAL mode. There is no "document content" column—all content lives exclusively in the events and snapshots tables. Event types include `doc_change` (insertions/deletions + selection), `compound` (document changes combined with annotation events), and individual annotation operations like `annotation_add`, `annotation_remove`, and `annotation_update`.

All writes go through a serialized promise queue to guarantee transaction order regardless of async timing. If you navigate away from a document mid-write, the stale write is detected and aborted.

</details>

### 2. Degrade, never crash


If a part of your history is corrupted—a mangled record, an annotation with invalid data—most apps would crash. Quillium handles every record individually instead. A corrupt event is skipped, a warning is logged, and replay continues with everything that came after it, so one bad record doesn't prevent recovery of the thousands of good ones. The same approach applies to annotations: if one fails validation on load, it's dropped (unless we can recover it—see the next section) and the rest load normally, and if an entire snapshot is corrupted, Quillium falls back to rebuilding from a fresh state.

The underlying principle is that corrupt data should degrade to a safe default rather than bring down the app. You might lose a single annotation or a single edit in a worst case, but you will never lose everything because one byte happened to be wrong.

<details>
<summary>How validation works</summary>

Every annotation is validated against a strict schema on load. The schemas are designed to tolerate unknown fields from future versions, so your data won't break when Quillium updates. On validation failure, the annotation is dropped with a logged error, and the rest of the annotation map loads normally.

During event replay, each event is processed in a try/catch. If a single event throws—malformed data, unknown type, out-of-range position—it's skipped with a warning and replay continues.

</details>

### 3. Restore should heal, not just paste

Restoring from a backup isn't just dumping text back into the editor. In case of something going wrong, Quillium performs a "healing restore" that recovers your annotations—revisions, comments, suggestions—alongside the text itself.

It works by remembering the actual text content at each annotation's position, not just the position. After the document is restored, it searches for each of those text fragments in the new document. If found, the annotation is re-attached at its correct position. If not found, it's placed at the beginning with a warning rather than silently dropped. For revisions with nested content, the healing process goes deeper, validating and re-anchoring at every level.

One subtle detail: the restore is specially tagged so the suspicious-change detector doesn't trigger on it. Without that tag, restoring a backup would look like a massive deletion and create a circular loop of warnings.

### 4. Time travel is always available

Between automatic snapshots (every 50 changes or two minutes), checkpoints you name yourself, and safety snapshots created before suspicious changes, Quillium is constantly building a timeline of your document, so you can always go back.

Version history isn't an afterthought buried in a menu; it's a full browsing experience where every snapshot is reconstructed as a read-only editor, so you can see exactly what you'd be restoring before you commit to it. Restoring requires two clicks—first to select, second to confirm—so an accidental mis-click can't roll you back.

Named checkpoints are never auto-pruned, and only unlabeled automatic snapshots get cleaned up. If storage grows large, Quillium warns you at 1 GB and lets you prune by count or by age.

The result is that you can browse and preview any point in your document's history, while the system quietly creates recovery points for you in the background.

## Undo

One of the most common questions about reliability is "why not just use undo?" The usual answer is that undo is ephemeral; once you leave the document, or accidentally crash out of it, there's no more history. Quillium is the exception, since you can undo as much as you want and the history survives across sessions.

But most importantly, if you're using undo for the kind of thing most writers use undo for, you mostly don't need it in Quillium. I've [written before about why the undo button is a lie](./why-the-undo-button-is-a-lie), though that post takes a philosophical angle where this one is about reliability.

The practical detail here is that Quillium's undo and redo work across annotation changes, version switches, and even implicit deletions.

<details>
<summary>How annotation undo works</summary>

The annotation system generates inverted effects for every operation: adding an annotation generates a remove on undo, updating a comment thread restores the previous version, switching a revision's active version switches it back. For implicit deletions—where typing collapses an annotation's range to zero width—the system detects the disappearance by diffing old and new state, and generates a restore effect with special handling for collapsed ranges.

Guards prevent undo from generating its own undo entries during replays, internal revision edits, and nested editor operations.

</details>

## Why this matters

If you can't trust a word processor to reliably save your work, you can't trust it to do anything else either.

Roughly half of the development time spent on Quillium's [public beta](./public-beta) went into reliability alone, rather than into features, UI polish, or any ["aI iNtEgRaTIOn"](./ai-is-not-the-point).

A writing tool that loses your writing isn't really a tool; it's a liability with a text editor bolted on.

Your words are safe here. [Try it out now.](/#download)
