---
title: "Free isn't generosity"
description: "Quillium is free because paywalling it would kill it. Here's the indie-dev math behind why that's true."
date: "2026-04-13"
author: "Bryan Hu"
---

One of the lines on Quillium's [pricing](/pricing) page is:

> Never pay us a cent and the app works the same. That's the point.

Most people who read that line treat it as a generous founder pledging that the free tier will remain useful, but it isn't a promise at all. It's closer to a confession, because the app is free for reasons that have very little to do with generosity and almost everything to do with the fact that *any other arrangement would quietly destroy the product*.

(For what it's worth, *I do* personally believe that writing tools should be free, and I'll get to that near the end)

## I don't have leverage

I'm a solo developer working on Quillium without a brand name, a sales team, an enterprise pipeline, or a VC runway that I can burn on paid acquisition. When someone hears about Quillium, it's because a friend told them, or they stumbled onto a blog post, or the Hacker News algorithm happened to have a good day. There isn't a funnel underneath any of this; there is only me, a landing page, and the hope that a stranger will decide to try the app.

That context matters because the things that let other software charge upfront are, almost without exception, trust mechanisms that have been built up over years. Notion can ask for $10 a month because you already know what Notion does and what it replaces. Scrivener can ask for $59 once because it has two decades of reviews behind it and a reputation as the serious writer's tool. Even a scrappy YC startup can ask for a credit card at signup, because the brand of YC itself does a meaningful amount of the convincing before the product has to.

None of that is available to me. What I'm asking a reader to do is try an unfamiliar writing tool, built by someone they've never heard of, that works differently from anything they've used before. The correct price for that request, from the stranger's perspective, is zero; anything higher makes the ask unreasonable before the software ever gets a chance to make its case.

## You have to try it to believe it

The second problem is the value proposition itself. Quillium's central idea—branching for prose, keeping every version of every sentence alive while you revise—is genuinely abstract until you've done it, and the reasonable response when I describe it is something like, "okay, but I can just copy-paste paragraphs into a scratch doc." [I've written](/blog/why-not) about why that workaround falls apart the moment you have more than two versions of anything, but the argument only really lands after you've felt it happen in your own writing. Before that point, it's a claim you have no particular reason to believe.

This is where a paywall would be fatal rather than merely inconvenient. Most SaaS products asking for money can say, in a single sentence, what they do and what they replace—and that sentence is enough to carry a prospective user through a checkout flow.

Quillium's pitch doesn't work that way. On "[inline branching for prose](/blog/inline-branching-for-prose)," depending on how a reader squints at those phrases, it sound either self-evident or pointless, and neither is worth "shut up and take my money."

The only reliable way someone figures out whether Quillium is useful to them is to live with it for a week or two on their own writing. Not a demo or a free tier with the interesting parts quietly removed, but the actual tool operating on an actual draft, and for long enough that they hit the specific moment where they wanted to try a different version of a paragraph without losing the one they already had. That single moment is the entire sale, and everything that comes before it **is pure noise**.

A paywall of any kind—five dollars, a free trial that requires a credit card, a feature gate that hides the interesting behavior—filters out every reader who hasn't already been convinced. For a tool like this, that is essentially everyone. The math is inverted from ordinary SaaS, because I don't need fewer users paying more; I need more users trying the thing for long enough to discover that it isn't replaceable.

## Paywalling would kill the product, not fund it

Suppose I ignored all of that and put up a paywall anyway. It would still break the two mechanisms that actually make Quillium improve over time.

The first is word-of-mouth (which is the only distribution channel I realistically have) and word-of-mouth depends on the person being recommended to being able to try the thing without friction. Nobody forwards their friend a link to software that opens on a pricing page, because the recommendation dies the moment the friend hits the paywall. Whatever goodwill I've built up with early users stops being transferable at exactly the point where it was supposed to compound.

The second is the feedback loop. The users who find edge cases in branching behavior, whose unusual writing workflows surface bugs I would never have thought to test, who tell me which parts of the interface are confusing and why—those people are, almost always, not paying customers. They're people who decided to try something. If I gate them out, I'm left optimizing the tool for a small population of already-convinced payers, which is the fastest way I can think of to build software that only makes sense to people who already believed in it.

This is also why the parts of Quillium that *do* cost money—sync, collaboration, anything that touches a server I have to pay for—are the only parts I charge for. Those features have real infrastructure costs attached, and charging for them is honest accounting rather than rent. The writing tool itself costs nothing to run on your machine, so charging for it would be extracting rent rather than covering a cost, and it would be extracting rent from the exact thing that needs to spread freely in order for any of this to work.

## For what it's worth, I do believe writing tools should be free

Everything above is the structural argument, and the structural argument is what would hold up even if my personal values on this question were different. It's the version I'd believe if I were a cynic who cared only about whether the business worked. But since I've already admitted I'm a solo developer with no leverage, I might as well be honest about the other layer underneath all of this.

I think writing tools are closer to infrastructure than to products. Writing is thinking, and the software you use to do it shapes the shape of the thoughts you can have in it. Charging ongoing rent on something that sits that close to how a person thinks has always felt, to me, like charging rent on a workbench—technically legitimate, but a strange thing to build a business around when the workbench is where someone's craft happens.

I mention this last, and briefly, because I don't want it to carry the argument. If the structural case didn't hold, the values case wouldn't be enough on its own, and I'd be charging for the core like everyone else and telling myself a story about it. The values are real, but they're the reason this arrangement feels right to me, just not the reason it's the only one that works.

## That's the point

"Never pay us a cent and the app works the same" isn't a pledge I'm making out of principle, and it isn't a marketing line dressed up as one. It's the only arrangement that leaves the product intact. Gating the core would cut off word-of-mouth, filter out the readers who haven't been convinced yet (which is, again, essentially everyone), and leave me optimizing for a population too small to build a good tool for.

The business has to be shaped around the tool rather than the other way around. Sync and collaboration can carry their own weight because they have real costs attached to them. The writing experience can't carry anything, because the moment it's asked to, it stops reaching the people it was built for.

So yes, the app is free, and it will stay that way. Not because I'm being generous, but because that's the only version of this that works at all.

[Try Quillium today.](/#download)
