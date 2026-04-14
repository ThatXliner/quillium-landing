---
title: "Your Writing Stays on Your Computer"
description: "Quillium is local-first by default. Here's what that means for your privacy."
date: "2026-04-08"
author: "Bryan Hu"
---

In Google Docs, your draft lives on Google's servers before you've even finished the first sentence, and in Notion your notes sit in somebody else's database, indexable and queryable and *potentially trainable on*. When you use an AI writing tool, your unfinished paragraphs travel through a server you don't control.

Quillium doesn't work like that. Your writing stays on your computer. Period. But I know that claim is easy to make and hard to verify (especially when we're closed source, at least for now), so let me walk through the specifics.

## Local-first means local-only (by default)

Every document you create in Quillium is stored in a local database on your device. It isn't a cloud database that happens to cache locally, and by default it isn't a "local-first" system that quietly syncs whenever you're online; it's simply local, with no cloud storage, sync server, remote database, or upload endpoint behind the scenes.

Your settings are stored locally. Your [crash backups](./how-quillium-keeps-your-writing-safe) are stored locally. Your version history is stored locally. Everything Quillium needs to work is on your machine, and the app works fully offline—because "offline" and "online" aren't even meaningful distinctions when nothing is on a server.

I do plan to offer cloud sync as an optional paid feature down the line, for people who want to work across devices, but it will be something you *explicitly choose and pay for* rather than something that happens behind your back. The free, default experience is fully local and will stay that way.

I built it this way because I care about durability, and because a network failure should be irrelevant to whether you can open your own draft.

## If you use AI, the calls go directly to your provider

Quillium has [optional AI features](./ai-is-not-the-point) that are off by default. If you choose to enable them, here's what happens:

You provide your own API key from whichever provider you want—OpenAI, Anthropic, or Google. When the AI reads your writing, that request goes directly from your machine to your chosen provider. It does not pass through Quillium's servers. There is no proxy, no relay, no middleware. We literally don't have a server for it to go through.

This is called BYOK, or bring your own key. It means Quillium never sees your API key, never sees the text you send to AI, and never sees the response. The relationship is between you and your AI provider, and Quillium is just the interface. Obviously, by using AI features you agree to your chosen provider's terms of service and privacy policy (and the app links to both when you configure your key).



## Analytics are off if you want them off

Quillium uses PostHog for usage analytics. If that bothers you, there's a single toggle in Settings > Privacy > "Usage analytics." Turn it off, and all analytics stop immediately, with the opt-out persisting across sessions.

That said, let me be specific about what these analytics are, because "analytics" is a word that's been poisoned by ad tech.

**We don't track you.** There are no accounts, no login, no user ID tied to your identity. PostHog assigns its own anonymous IDs, and we don't call any identify function with personal information. The only context we attach to events is the app version and that you're on the desktop app. That's it.

**Your document content is never in analytics by default.** The analytics system actively strips document-related properties—words, synonyms, original text—from every event before sending. our internal session replay telemetry mask the actual text you're writing with asterisks—we can't read your writing even if we wanted to. (There is an optional "Share document analytics" setting, off by default, that removes this masking if you want to help us debug editor-specific issues. You have to explicitly opt in.)

This is separate from AI features. Again, if you use those, your text is sent directly to your chosen AI provider, subject to their Terms of Service and Privacy Policy.

## We tell you when we can't see your data

Here's a detail I'm genuinely proud of.

When an error occurs and you *haven't* opted into document sharing (off by default: you have to explicitly opt-in in settings), Quillium shows a small notification explaining what happened. It tells you the incident code, says that your document content was redacted, and offers to open settings if you *want* to share it to help fix the issue.

The key word is *was*. By the time you see the notification, the content is already redacted. We're asking permission for next time, not retroactively sharing what just happened. The notification is a request, not an action.

Most apps do the opposite, collecting everything by default and letting you opt out later if you can find the setting. Quillium collects nothing by default and asks you to opt in if you want to help.

The reason for this policy is straightforward: if nothing in the app is broken, there's no reason for the app to collect your document information, and the policy also makes GDPR and CCPA compliance much easier to implement. For the full legal details, see the [privacy policy](/privacy).

## The default is private

I want to state this plainly because it's easy to miss how unusual it is:

- There is no account system today. No login, no signup. When we add accounts for cloud sync down the road, they'll be entirely optional—you'll have to go out of your way to create one.
- There is no cloud storage today. Again: no sync, no upload. When cloud sync arrives, it'll be a paid add-on you explicitly enable, not something that happens by default.
- There is no user ID tied to your identity.
- There is no *Quillium* server that sees your documents or your AI conversations. When you use AI features, requests go directly from your machine to your provider.

Quillium is a desktop app that runs on your machine, stores data on your machine, and talks to the internet only when *you* explicitly tell it to. That's the default today, and it will remain the default.

## Why this matters

Writers pour unfinished thoughts, half-formed arguments, and vulnerable first attempts into their tools. A journal entry, a personal essay, a scene that's too honest to share yet—that kind of writing deserves the same level of protection we give to passwords and medical records, rather than the level we give to Google.

I don't think the current generation of writing tools takes this seriously enough. "We encrypt your data" is table stakes. The actual bar is not having your data in the first place.

[Try it out.](/#download)
