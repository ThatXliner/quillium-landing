---
title: "Your Writing Stays on Your Computer"
description: "Quillium is local-first by default. Here's what that means for your privacy."
date: "2026-04-08"
author: "Bryan Hu"
---

In Google Docs, your draft lives on Google's servers before you've even finished the first sentence. For Notion, and your notes sit in somebody else's database, queryable, indexable, trainable. You use an "AI writing tool," and yet your unfinished paragraphs get sent to a model you didn't choose through a server you don't control.

Quillium doesn't work like that. Your writing stays on your computer. Period. But I know that claim is easy to make and hard to verify (especially when we're closed source, at least for now), so let me walk through the specifics.

## Local-first means local-only (by default)

Every document you create in Quillium is stored in a local database on your device. Not a cloud database that caches locally. Not a "local-first" system that syncs when you're online. Just local. There is no cloud storage, no sync server, no remote database, no upload endpoint.

Your settings are stored locally. Your [crash backups](./how-quillium-keeps-your-writing-safe) are stored locally. Your version history is stored locally. Everything Quillium needs to work is on your machine, and the app works fully offline—because "offline" and "online" aren't even meaningful distinctions when nothing is on a server.

We do plan to offer cloud sync as an optional paid feature down the line—for people who want to work across devices. But it will be something you explicitly choose and pay for, not something that happens behind your back. The free, default experience is and will always be fully local.

I built it this way because I care about durability. Imagine losing hours of work to a network failure. With local storage, a network failure is irrelevant—your data was never on the network.

## If you use AI, the calls go directly to your provider

Quillium has [optional AI features](./ai-is-not-the-point) that are off by default. If you choose to enable them, here's what happens:

You provide your own API key from whichever provider you want—OpenAI, Anthropic, or Google. When the AI reads your writing, that request goes directly from your machine to your chosen provider. It does not pass through Quillium's servers. There is no proxy, no relay, no middleware. We literally don't have a server for it to go through.

This is called BYOK—bring your own key. It means Quillium never sees your API key, never sees the text you send to AI, and never sees the response. The relationship is between you and your AI provider, and Quillium is just the interface.

## Your API keys are stored in the OS keychain

This one's more technical, but it matters.

A lot of apps store API keys in the browser's local storage. That's convenient but insecure—any JavaScript running in the app can read it, which means a single security vulnerability could leak your key.

Quillium stores API keys in your operating system's keychain: macOS Keychain, Windows Credential Manager, or Linux Secret Service. These are the same systems that store your passwords, and they require OS-level authentication to access. Your key passes through the app's JavaScript layer only transiently—it's never stored there.

## Analytics are off if you want them off

Quillium uses PostHog for usage analytics. If that bothers you: there's a single toggle in Settings > Privacy > "Usage analytics." Turn it off, and all analytics stop immediately. The opt-out persists across sessions.

That said, let me be specific about what these analytics are, because "analytics" is a word that's been poisoned by ad tech.

**We don't track you.** There are no accounts, no login, no user ID tied to your identity. PostHog assigns its own anonymous IDs, and we don't call any identify function with personal information. The only context we attach to events is the app version and that you're on the desktop app. That's it.

**Your document content is never in analytics by default.** The analytics system actively strips document-related properties—words, synonyms, original text—from every event before sending. If you watch a session replay of your app (which would only happen if we're debugging with your consent), the actual text you're writing is masked with asterisks. We can't read your writing even if we wanted to.

## We tell you when we *can't* see your data

Here's a detail I'm genuinely proud of.

When an error occurs and you *haven't* opted into document sharing (off by default: you have to explicitly opt-in in settings), Quillium shows a small notification explaining what happened. It tells you the incident code, says that your document content was redacted, and offers to open settings if you *want* to share it to help fix the issue.

The key word is *was*. By the time you see the notification, the content is already redacted. We're asking permission for next time, not retroactively sharing what just happened. The notification is a request, not an action.

Most apps do the opposite: collect everything by default and let you opt out later (if you can find the setting). We collect nothing by default and ask you to opt in if you choose.

Why? If nothing is broken in our app (as one should reaonably expect), we have no reason to collect your document information. This policy also makes GDPR/CCPA compliance much easier to implement.

## The default is private

I want to state this plainly because it's easy to miss how unusual it is:

- There is no account system today. No login, no signup. When we add accounts for cloud sync down the road, they'll be entirely optional—you'll have to go out of your way to create one.
- There is no cloud storage today. Again: no sync, no upload. When cloud sync arrives, it'll be a paid add-on you explicitly enable, not something that happens by default.
- There is no user ID tied to your identity.
- There is no server that sees your documents or your AI conversations.

Quillium is a desktop app that runs on your machine, stores data on your machine, and talks to the internet only when *you* explicitly tell it to. That's the default today, and it will remain the default.

## Why this matters

Writers pour unfinished thoughts, half-formed arguments, and vulnerable first attempts into their tools. A journal entry. A personal essay. A scene that's too honest. That kind of writing deserves the same level of protection we give to passwords and medical records, not the level we give to Google search history.

I don't think the current generation of writing tools takes this seriously enough. "We encrypt your data" is table stakes. "We don't have your data in the first place" is the actual bar.

[Try it out.](/#download)
