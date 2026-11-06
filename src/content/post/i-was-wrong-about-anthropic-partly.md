---
title: "I Was Wrong About Anthropic (Partly)"
publishDate: "02 September 2026"
description: "I said coding models were becoming a commodity and Anthropic was on the wrong side of it. Then the S-1 came out."
tags: ["ai", "anthropic", "business", "investing"]
---

*Originally posted on eToro as three posts: [the commoditisation thesis](https://www.etoro.com/posts/5661cfb0-a6dd-11f1-8080-80002fc356b0) (2 September 2026), [the S-1 reality check](https://www.etoro.com/posts/5a8022d0-d2d5-11f1-8080-80011a4bfcfc) (28 October 2026) and [the Opus 5.5 update](https://www.etoro.com/posts/2eb84a80-d45e-11f1-8080-80003ce0c8b8) (30 October 2026). Figures are as of those dates.*

In May I wrote [Who Gets Paid When Every Developer Uses AI?](/posts/who-captures-the-ai-coding-money/), about where the money in AI coding ends up. This is what happened next to one of the names in it. First the thesis, then the evidence, then the part where I admit I was wrong.

A quick key to the model names, because they get confusing fast:

- **Sol, Terra and Luna** are OpenAI's GPT-5.6 tiers: flagship, mid and cheap.
- **Fable and Opus** are Anthropic's Claude models. Fable is the top tier.
- **Muse Spark** is Meta's model.
- **Grok** is SpaceX's model, since SpaceX merged with xAI.
- **Flash** is Google's fast, cheap Gemini tier.

## 1. The thesis: coding models are getting commoditised (2 September 2026)

The whole AI race is about coding models. Almost everything else is a rounding error in comparison. And coding models are slowly, gradually getting commoditised. Not totally yet, but we're going there.

Not every coding task needs Sol or Fable on Ultra mode. Most coding happens with Sol Medium, Fable Medium or even Luna on extra-high reasoning. You could say developers are using two tiers of coding models right now. The first tier is "scan every file in the codebase, consider multiple interconnected states and iteratively chase this nasty bug nobody can find". The second is "add a new button to the menu that does X".

First-tier tasks need top-notch models, and the only things that matter are intelligence, handling complex logic, sticking to the task, security compliance and so on.

Second-tier tasks don't care nearly as much about all that. The model needs to be smart enough, obviously. But past a certain level of intelligence, other things matter more, like cost and iteration speed. GPT-5.6 Terra on low, Muse Spark 1.2, Grok 4.6 or, hell, even Opus 5 can add a button to a menu with the functionality you asked for, probably with no errors and clean enough code. At that point the question isn't which model ranks higher on DeepSWE or Terminal-Bench. It's a given that they'll do the task without breaking the rest of the codebase. The question is which one does it faster and cheaper. That's models being commoditised.

It's not totally the case yet. I'm exaggerating a little. But we're definitely heading that way. And if it keeps going, "the race" will be won by something other than who has the best model. It will be won by whoever can deliver inference at higher volume, lower cost and lower latency. Most likely, that's the most vertically integrated company.

Right now, Google looks best positioned to do that, but it's moving too slowly. Meta and SpaceX understood this moment immediately and are going full steam toward vertically integrating inference. Anthropic is the exact opposite. Instead of integrating, it keeps renting cloud compute, betting on a model that's different and good enough to beat the rest, and doubling down on enterprise relationships to lock customers in as fast as it can. OpenAI sits in a strange middle ground: it rents most of its compute, but publicly toys with custom chips and its own data centres. Nowhere near as fast as Meta and SpaceX, though.

From a cost-structure perspective, Google is best positioned, and its newest model (Flash 3.7) is a true second-tier model. Meta can deliver faster and cheaper than even Google, and Muse Spark 1.2 is close to second tier too. SpaceX is the most interesting player. Grok 4.6 is already at GPT-5.6 Terra level, though slower and more expensive than Sol on low for second-tier tasks. But SpaceX is scaling faster than anyone, and it has so much computing capacity that it's one of the companies Anthropic rents from. Its problem is distribution, which it's betting hard on through partners like Cursor and products like Grok Bot. If the next Grok gets close to Sol on medium but cheaper and faster, OpenAI could be in trouble.

Unless my theory about commoditisation is wrong, I couldn't see a way out for Anthropic. Unless they proved me wrong with a model so much better that it stands apart, or their customer lock-in was stronger than I gave them credit for.

## 2. The reality check: the S-1 (28 October 2026)

Back in November 2025, in a post about Meta, I wrote this:

> While unprofitable start-ups like OpenAI and Anthropic really risk bankruptcy if they misjudge the timing of their investment, Meta has one secret superpower: Positive Cash Flow.

Well. Anthropic just filed its S-1 to list on the Nasdaq as ANT. And I'll be honest, I have to eat some of those words. All figures below are from the S-1 as filed in October 2026.

**Financials**

- $16.3B of revenue in H1 2026, 14x the $1.16B of H1 2025
- Q2 alone: $11.6B, more than double the whole of 2025 ($4.6B)
- $974M of operating profit in Q2, the first profitable period they disclose
- $3.9B of operating cash flow in H1, up from -$1.5B a year earlier
- $131.7B in cash and short-term investments as of 30 June

Let that last one sink in. Apple had $62.4B in cash and short-term securities at the end of June ($146.5B including long-term ones). Alphabet had $242.5B. A company that was burning cash a year ago now holds more short-term cash than Apple, and more than half of what Alphabet has.

**Enterprise (as of 30 September)**

- 11,900+ customers spending $100K+ a year, up from 950 a year earlier
- 1,900+ spending $1M+, and about 250 spending $10M+
- 900% net revenue retention
- $10.8B of contracted revenue still to be recognised

**Spending**

- $8.95B of compute and infrastructure expenses in H1
- $265.6B of future compute and infrastructure commitments, over 1 to 20 years

**The flywheel**

The S-1 lists five core advantages: mission, talent, research, compute and enterprise. Anthropic pitches them as two loops. Better models bring more use cases and more feedback. Faster growth brings more investment and more capability. Their evidence:

- Q2 revenue grew 1,368% year over year, while compute costs grew 300%
- Revenue per employee of $6.6M, up from $1.4M a year earlier
- Code per engineer in Q3 2026 was 45x the 2024 average
- Over 90% of code contributions in September 2026 were written by Claude
- Q3 2026 revenue was 86x Q4 2024's, while headcount grew 5x

**A company with positive operating cash flow and $130B+ in the bank is not going bankrupt any time soon. I was wrong on that one. Period.**

### "But they lost $80.7 BILLION?"

Yes, in H1 2026. Sounds apocalyptic. It mostly isn't. $72.4B of it is the change in fair value of convertible notes and similar instruments, mainly Amazon's. When Anthropic's valuation goes up, those notes are worth more, and the accounting books that as a loss. No cash leaves the building. The actual operating loss for the half was $693M: a loss in Q1, a profit in Q2.

### What I still believed

The bankruptcy call was wrong. The commoditisation call was still open.

1. Hard coding work needs the best model. Most coding just needs a model that's good enough, and then it's all about cost and speed.
2. That second tier goes to whoever delivers inference at the highest volume and lowest cost. That means vertical integration, and Google, Meta and SpaceX are building their own. Anthropic still mostly rents.
3. $265.6B of commitments is a hell of a fixed cost if token prices collapse.

A 900% NRR tells you how good things are today. It doesn't tell you how sticky customers will be when a model that's 10x cheaper does the job 95% as well.

### Who's driving

A Founder LLC owned by the seven co-founders holds a fixed 50.1% of the votes. The Long-Term Benefit Trust elects a majority of the board. Class A shareholders (you, if you buy) are capped at 49.9% of the voting power. You get the economics, not the steering wheel.

### The price

In May I wrote that "when (if) they go public, all expectations will be priced the hell in." There was no price range yet when I wrote this. When it shows up, the question is whether it prices in the $265.6B of commitments too, or just the 14x and the 900%.

## 3. The update: Opus 5.5 (30 October 2026)

The biggest change in my perspective came from the release of Opus 5.5.

In many posts I've argued that AI models might become a commodity. If that happens, it's terrible news for Anthropic, because in a commodity market vertical integration is what matters: the only differentiation left is inference cost and speed, and Anthropic is notoriously behind on both.

But they proved my worry partly wrong by releasing a model so much better than the competition that most power users moved from OpenAI to Anthropic. I say partly because some of the model's advantage doesn't come only from smarts. It also comes from speed and cost efficiency, which makes things fuzzy. They delivered a model that's smarter and more efficient at the same time, and users rationally moved to it.

If they moved because the model is smarter, my point was wrong: model differentiation is still what moves the market. If they moved because it's more efficient, my point about commoditisation still holds, and my worry that Anthropic was behind on efficiency was the part that was wrong. In all honesty, it's probably a mix of both. Which tells you how fast this landscape keeps changing.

## Where that leaves me

- Anthropic is not going bankrupt. I was wrong.
- The $80.7B loss is mostly accounting from a rising valuation, not cash burn.
- Commoditisation is still the big risk, and the compute commitments make it bigger.
- But Opus 5.5 showed that a lab that rents its compute can still win on the model, at least for now.

---

*Not investment advice.*
