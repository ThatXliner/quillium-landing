---
title: "Quillium AI — The Complete Rundown"
description: "Everything Quillium's AI can do and why it's built the way it is."
date: "2026-04-06"
author: "Bryan Hu"
---

## The core philosophy

Every AI feature in Quillium follows one rule: the AI creates structured annotations, [never raw text edits](/blog/ai-is-not-the-point#what-ai-could-actually-be). Every suggestion is reversible and non-destructive. You stay in control. The AI doesn't get to touch your words.

Everything runs BYOK (bring your own key), fully client-side. No Quillium servers are involved at any point. Your API keys stay in the OS keychain, never in localStorage. We support OpenAI, Anthropic Claude, and Google Gemini.

## 1. AI Sidebar — three modes

A floating panel with three AI assistants, each good at different things:

**Chat** is open-ended writing Q&A. Brainstorm ideas, ask "does this paragraph work?", bounce thoughts around.

**Feedback** is your big-picture reviewer. It looks at structure, voice, argument, and pacing, then gives you 2-3 labeled alternatives with tradeoff explanations for each issue.

**Revise** is the line editor. It walks through your text in reading order and suggests word-level rewrites, each with multiple replacement options. At the end you get a short summary of patterns it noticed across the document.

None of this shows up as a wall of text you have to copy-paste. Every piece of AI output lands as an annotation in the editor. Accept, reject, or ignore. The sidebar glows with a rainbow border while AI is running so you always know when it's costing you tokens.

## 2. AutoAI — background reviewer

This one is unusual. A small morphing bubble sits in your editor and runs editorial review continuously while you write. You don't ask it to. It just does.

It waits until you've written enough new material, thinks for a bit, then drops inline comments and revision suggestions directly into your document. If you've edited a section since it started thinking, it throws away any suggestions that no longer apply. No stale feedback.

Three levels of intensity:

- **Conservative** — only flags glaring issues
- **Balanced** — the default
- **Thorough** — feedback on everything

You can rename the reviewer persona to whatever you want: "Editor", "Critic", "Devil's Advocate". That name shows up as the author on all its annotations.

It's like having someone read over your shoulder, except they actually have useful things to say. (The rainbow-spinning border while it thinks is a nice touch too.)

## 3. Comment thread AI

Every annotation thread has a "Suggest" button. Hit it and the AI reads the full thread history plus the highlighted text, then drops a response into the thread.

Annotations become conversations. Disagree with a comment? Ask the AI to push back, right there in the thread.

## 4. Document context

A panel where you describe your document's purpose, audience, tone, and constraints. That context feeds into every AI call, so feedback is calibrated to what you're actually trying to write instead of generic writing advice.

There's also an "AI generate" button: paste a raw writing prompt or assignment brief and it produces structured context notes for you.

## 5. Writing style analysis

Inside the Writing Statistics modal, an AI scores your prose across 7 dimensions (formality, clarity, conciseness, vocabulary, tone, pacing, descriptiveness) on a 1-10 scale, plus tone descriptors and a style summary.

We tell the model to be honest and avoid giving everything high scores. The results show up as progress bars. Self-awareness about your writing tendencies, from someone who won't sugarcoat it.

## 6. Reverse dictionary

Cmd-B on a selected word opens a popover where you can describe a concept ("the feeling of nostalgia for a place you've never been") and get back matching words with nuance and connotation notes. If you want to keep going, the conversation carries over into the full Chat panel.

Good for that tip-of-the-tongue problem where you *know* the word exists but can't reach it.

## 7. Custom quick actions

Define your own reusable prompts — "Check academic citations", "Tighten this paragraph", whatever — and they show up as chips in the Chat, Feedback, and Revise panels.

## How we handle your keys and data

Your API keys never touch localStorage or disk. They live in the OS keychain. Every AI action is Cmd-Z reversible, same as any other edit. And all AI output goes through the same annotation system the rest of the editor uses, so nothing can silently modify your text.
