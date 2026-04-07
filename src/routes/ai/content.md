---
title: "Quillium AI — The Complete Rundown"
description: "Everything Quillium's AI can do, how it works, and why it's built the way it is."
date: "2026-04-06"
author: "Bryan Hu"
---

## The core philosophy

Every AI feature in Quillium follows one rule: the AI creates structured annotations, [never raw text edits](./ai-is-not-the-point#what-ai-could-actually-be). All suggestions are reversible, non-destructive, and flow through the same annotation system the human editor uses. You stay in control. The AI doesn't get to touch your words.

Everything runs BYOK (bring your own key), fully client-side. No Quillium servers are involved at any point. Your API keys live in the OS keychain via Tauri, never in localStorage. We support OpenAI, Anthropic Claude, and Google Gemini.

## 1. AI Sidebar — three specialized modes

A resizable floating panel with three distinct AI assistants:

**Chat** is general writing Q&A. Plain conversational AI, no tool calls. Good for brainstorming, asking "does this paragraph work?", stuff like that.

**Feedback** is an editorial reviewer. The system prompt forces all feedback into `createSuggestion` and `createRevision` tool calls. It focuses on big picture issues: structure, voice, argument, pacing. Each revision includes 2 to 3 labeled alternatives with tradeoff explanations.

**Revise** is the line editor. It scans in reading order, creates `createSuggestion` tool calls for every rewrite (each with 2+ replacement options and rationales), then ends with a short summary of patterns it noticed. This is for more word-level execution fixes, while Feedback is for more high-level suggestions.

The tool-calling enforcement is what makes this work. You don't get a wall of text to manually copy+paste; each piece of AI output lands as an annotation in the editor. Accept it, reject it, or just ignore it.

This is the core of all AI features: this sidebar glows with a rainbow border when AI is running so you are always aware of your costs.

## 2. AutoAI — autonomous background reviewer

Probably the most unusual feature. A morphing bubble widget sits in your editor and runs continuous, unprompted editorial review while you write. You don't ask it to. It just... does.

Under the hood: it watches for content changes (20+ character delta threshold), debounces for 10 seconds, then fires a single `generateObject()` call with a Zod schema. Back comes a typed JSON array of comments, suggestions, and revisions. Before applying anything, it validates that each `targetText` is still a literal substring of the document. If you've edited that part since the AI started thinking, it throws the suggestion away. If a suggestion would overlap an existing annotation, it downgrades to a comment.

Three conservativeness levels:

- **Conservative** — only flags glaring issues
- **Balanced** — the default
- **Thorough** — comprehensive feedback on everything

You can also configure the persona. Rename the reviewer to "Editor", "Critic", "Devil's Advocate", whatever. That name becomes the author field on all created annotations.

Think of it as a tireless editor reading over your shoulder. Inline comments and revision suggestions just appear as you write. (The rainbow-spinning border animation while it's thinking is a nice touch too.)

## 3. Comment thread AI suggestions

Every annotation thread (comments, revisions) has a "Suggest" button. Hit it and the AI reads the full thread history plus the highlighted text, then drops a contextual response into the thread as an "AI" authored message.

So annotations become conversations. Disagree with a comment? Ask the AI to elaborate or counter-argue, right there in the thread.

## 4. Document context — AI-generated writing briefs

A panel where you describe your document's purpose, audience, tone, and constraints. That context gets injected into every AI call, so the feedback is calibrated to what you're actually trying to write, not generic writing advice.

There's also an "AI generate" button: paste in a raw writing prompt or assignment brief and it produces structured context notes for you. We're currently A/B testing two formats (freeform prose vs. structured fields) via PostHog feature flags, this way we can ensure that this AI feature is optimized.

## 5. Writing style characterizer

Inside the Writing Statistics modal, an AI analyzes your prose across 7 dimensions (formality, clarity, conciseness, vocabulary, tone, pacing, descriptiveness) on a 1 to 10 scale, plus tone descriptors and a style summary. The prompt explicitly tells the model to "be honest — avoid giving everything high scores."

The results show up as visual progress bars. Basically: self-awareness about your writing tendencies, from someone who won't sugarcoat it.

## 6. Dictionary popover AI mode

Cmd-B on a selected word opens a popover with an AI "describe, then find word" mode. Describe a concept ("the feeling of nostalgia for a place you've never been") and the AI suggests matching words with nuance and connotation notes. If you want to keep going, you can bridge the conversation into the full Chat panel with history preserved.

A reverse thesaurus, basically. You describe the idea, the AI finds the word. Good for that tip-of-the-tongue problem where you *know* the word exists but can't quite reach it.

## 7. Custom quick actions

User-configurable entries (label, prompt, panel) that appear as chips in the Chat, Feedback, and Revise panels. Define your own: "Check academic citations", "Tighten this paragraph", whatever you need.

## What makes this architecture different

**Annotation bus pattern.** All AI output (chat tools, AutoAI, comment threads) flows through the same annotation functions and never touches editor text directly.

**Everything is undoable.** Because annotations use CodeMirror's transaction system, every AI action is Cmd-Z reversible.

**Keychain-first security.** API keys never touch localStorage or disk. They're lazy-loaded from the OS keychain only on first actual AI interaction, which avoids macOS permission prompts at startup.
