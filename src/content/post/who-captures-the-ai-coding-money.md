---
title: "Every Developer Uses AI. Who Captures the Money?"
publishDate: "20 May 2026"
description: "Nearly every developer on earth is using AI coding tools. The real money isn't in the apps you've heard of."
tags: ["ai", "business", "investing"]
---

**Nearly every developer on earth is using AI coding assistants. Why should you care?**

It's really happening. It's not a "maybe in the future" and it's not a slow, gradual shift. It's now. Even if many aren't publicly saying it, they're all doing it. According to Stack Overflow's 2025 survey, 84% of all developers use or plan to use AI tools. JetBrains says 85% regularly use AI tools for coding. AI coding is no longer a wild experiment. It's the default developer workflow now.

We've been debating whether AI will have a real economic impact for a couple of years now. This is it. This is the real one. There are at least 50M active developers out there right now (according to SlashData), and nearly all of them are being targeted by a $100 Claude or Codex subscription, at minimum. Not all of them have complied yet, but they will. That's ~$60B of annual revenue TAM right there, right now. And you know what's even crazier? That I'm being extremely conservative. I'm excluding non-professional developers, enterprise overages, API usage, agents doing non-coding work, and workflows where one human supervises many AI workers. This market will mint multiple $100B+ companies. A single dominant winner could easily be worth $500B and immediately sitting as the 26th most valuable company in the world, bigger than $COST or $NFLX or $MC.

And I insist. I'm being conservative here. Market penetration of AI coding tools is nowhere near 100%. Most developers underreport how much they use it. They're afraid of the reaction, obviously. Half their colleagues would think them fools for shipping AI slop, and the other half would think their job can be automated and fire them. Both camps are wrong, but the point is the value is undeniable and its usage is underreported. Professionals building things can't unsee it once they try it. They're either paying for a $100 or $200 subscription in secret, or they've convinced a middle manager to expense it. And the power-users aren't spending $100 a month, they're spending $1k-$2k a month in API costs.

And I'll keep saying it. I am being very, very conservative here. How do I know I'm being conservative? Just check out Anthropic's latest annualised run-rate revenue: ~$30B (per Reuters reporting in April 2026). They make Claude Code, and they're growing like no company has grown before. OpenAI, the makers of ChatGPT and Codex, follow just behind at ~$25B. These two companies alone are already capturing ~$55B of ARR, while expecting 2x, 5x, or even 10x growth in the next year (according to some of the more aggressive reports). I was saying the TOTAL market for this was worth ~$60B a year, assuming all developers on earth start paying a $100 subscription now.

The thing is, this market is enormous. And it's growing. We know that. But more important than knowing that is being able to answer this question: **Who captures the money?**

There's a complicated network of players that make all this possible, and all of them take a cut: application layer, model makers, hyperscalers, silicon designers, silicon manufacturers, and the forgotten power-and-networking layer. I'm going to break down each one of them, so we can put a number on each piece of the value chain, now in a moment. But before we get started, let me drop the most interesting thing first: **This thesis can be 100% correct, and the stocks might still go down 40% along the way.** Bear with me and I'll explain why.

## The Six Layers of the AI Coding Stack

Most people read "AI coding boom" and immediately think Cursor or Copilot. But that's only the visible layer. It's the one everyone knows about and manages to put a name on, but it's also where the least durable margin lives. The real money flows upstream, into compute, packaging, memory, networking, and power. If you only own the visible app, you're betting on the layer with the most competition, the thinnest moats, and the most price compression. It has *some* value, but it's not where all the value is. Let's walk down the stack, layer by layer.

### Layer 1: The Application Layer

Cursor, GitHub Copilot, Claude Code, Codex, Replit, Devin, Windsurf. This is where developers actually swipe their credit card. It's growing fastest in absolute terms. Cursor hit $2B ARR in February 2026 and is forecasting $6B by year-end. Claude Code alone hit $2.5B ARR. GitHub Copilot has 4.7M paid subscribers across 90% of the Fortune 100.

But here's the annoying bit: most of these companies are private, and the ones that are public (Microsoft via Copilot) bury the economics inside massive parent businesses. More importantly, this layer is structurally exposed: every dollar of revenue passes through to the model lab (Anthropic, OpenAI), which passes through to the hyperscaler (Azure, AWS), which passes through to the silicon (Nvidia, Broadcom). Cursor's gross margin is whatever Anthropic and OpenAI decide it should be. That's not a moat. It's a product being commoditised.

### Layer 2: The Model Makers

Anthropic, OpenAI, Google DeepMind, Meta, xAI. This is where real pricing power is emerging. Anthropic pulled off one of the most violent margin flips in software history: from -94% gross margin in 2024 to ~50% in 2025, targeting ~77% by 2028 (per industry trackers). Read that again. From NEGATIVE 94% to positive, aiming nearly 80%. OpenAI is annualizing ~$25B at ~33% gross margin.

These aren't passive token vendors anymore. They're building enterprise distribution (Claude is at 1,000+ customers spending $1M+/year), locking in capacity (Anthropic committed $100B+ to AWS, OpenAI committed $1.15T+ across Oracle, Broadcom, Microsoft, Nvidia, AMD, AWS, CoreWeave through 2035), and starting to capture meaningful gross profit.

The catch: all of them are private. Which sucks, because that means we can't invest in them. Anthropic is rumored at a $900B round; OpenAI could IPO at $1T+. Public-market access here is indirect: through $AMZN (Anthropic anchor), $MSFT (OpenAI partner), or $GOOGL (vertical Gemini stack).

Investors have been *frothing* with the idea of buying into any of these, which is why they have raised more money through private rounds than going public. Hell, the mere mention of an IPO of any of these sends all VCs to throw any coin they can find to buy more stakes. They could be playing this game for as long as they need and never go public. And believe me, when (if) they go public, all expectations will be priced the hell in.

### Layer 3: The Hyperscalers

Microsoft, Amazon, Google, Oracle. These companies do three things at once: they rent compute, they capture marketplace margin on top of model inference (~30–50% uplift), and they're building their own silicon to claw back inference economics from Nvidia. Because, let's be real, Nvidia is the one chewing most of this cake right now.

Microsoft is the most leveraged to the coding thesis specifically: GitHub, VS Code, Copilot, Azure, and enterprise identity make it the distribution chokepoint for enterprise developer AI. This is Microsoft's classic move. Is it sexy? Nope. Do developers love to use it? Nope. Is it the best at anything? Hell no. But it has everything you need in one sweet, self-contained package that gets included with most other horrible software your company needs to function. Distribution is a hell of a drug, and nearly every company you can think of is balls deep with Microsoft. They're not pulling out now.

Amazon has the cleanest custom-silicon story: 1.4M Trainium chips deployed and Anthropic running on 1M+ Trainium2 units. Google owns the most vertical stack: TPU + Gemini + Cloud + Workspace + Android. Oracle is the leveraged option with $455B in remaining performance obligations, $100B+ in debt, and a $50B 2026 capex run-rate. Hard pass.

The combined 2026 capex for the top five hyperscalers is $725B, up 77% from 2025. That's not a typo. That's the single largest concentrated industrial spending event in modern history.

### Layer 4: The Silicon Designers

Nvidia, Broadcom, AMD, Marvell. Nvidia is still the gravitational center and the most popular kid at the party. FY26 data center revenue $194B, Q4 alone $62.3B (+75%), and the networking business inside Nvidia is now $11B/quarter growing 263% YoY. They look invincible. And the bear case for them isn't "Nvidia collapses." It's "Nvidia's growth decelerates from extreme to merely fast and the multiple compresses from 27x to 20x forward." Not without risk.

Broadcom is the strongest custom-silicon challenger. Q1 FY26 AI revenue $8.4B (+106% YoY), guiding $10.7B for Q2, and management targeting $100B+ in AI revenue by 2027 across six named custom-silicon customers. AMD is the second-source bet. The OpenAI deal (up to 6 GW, $90B+ potential revenue, plus warrants for ~10% of the company) and the Meta 6 GW deal create real upside if MI450 delivers and ROCm closes the software gap. Marvell is the cheaper hedge on the same custom-silicon thesis, but Broadcom's AI revenue alone is bigger than Marvell's entire annual revenue. You should not size them equally.

### Layer 5: The Actual Silicon Manufacturers

TSMC, SK Hynix, Micron, ASE/Amkor. This is the bottleneck layer. The true engineers, and the most undervalued part of the stack on a quality-adjusted basis. $TSM fabs every advanced-node AI chip on this good earth: Nvidia, Broadcom, AMD, Apple, Google TPU, AWS Trainium. Any half-decent chip that pretends to be leading edge is made in a TSMC facility. CoWoS advanced packaging, the technique that lets you stack HBM memory next to a compute die, is sold out through at least mid-2026 and doubling to 130k wafers/month by end of 2026.

HBM memory is the second binding constraint: SK Hynix owns ~62% share, has sold out 2026 capacity, and is pushing HBM3E prices up ~20% year-over-year. For most retail investors, $MU is the practical HBM proxy because SK Hynix (000660.KS) trades in Seoul and most European brokers don't offer clean access.

The Korea ETF ($EWY) is not a substitute. It's a Korea index basket, too diluted to count as HBM exposure. So we're stuck with MU.

### Layer 6: Power and Networking

The middle child. The forgotten layer. Vertiv, GE Vernova, Eaton, $SE, Arista Networks. By 2027, the binding constraint on AI buildout migrates from chips to electricity. McKinsey projects US AI data center power capacity needs to grow from 30 GW in 2025 to over 90 GW by 2030, and the grid is just not freaking ready for this.

Vertiv reported Q4 2025 organic orders up 252% with a $15B backlog. Eaton's electrical backlog up 31%. GE Vernova Q1 2026 orders $18.3B (+71% organic). These businesses have zero glamour, they trade at lower multiples than the chip designers, and nobody proudly announces they've joined them on X. They're the unsung heroes of any heavy industrial development. Doesn't matter what we're producing. We need them. And they have arguably the more durable bottleneck economics.

Arista is the networking pure-play. AI revenue ramping from $1.6B (2025) to $3.5B (2026 guided), with deferred revenue up 132% YoY.

The thing nobody pricing this stack is paying enough attention to: you cannot build $725B of data centers a year without unprecedented amounts of power equipment, transformers, switchgear, cooling systems, and high-speed networking gear. These are the shovels everyone keeps talking about. Not the chip designs.

## The Structural Read Across All Six Layers

Let's break down every dollar spent on AI inference today:

- ~40–45% flows to silicon
- ~30–35% to hyperscalers
- ~8–10% to networking, power, packaging
- ~10–15% to model lab gross margin
- ~3–5% to the application layer

By 2030, my best estimate:

- silicon compresses to ~30–35%
- hyperscalers stay at 30–35%
- networking and power grow to 10–12%
- model labs expand to 20–25% as they scale and integrate
- the application layer creeps up to 5–8%

That's why the cleanest public-market expression of "every developer uses AI" isn't to buy the coding app. It's to own the bottlenecks one or two layers upstream. The ones that benefit regardless of whether the winning coding assistant is Cursor or Copilot or Claude Code or something that doesn't exist yet.

## The Risk That Breaks Everything

Now, the part everyone forgets. Remember when I told you the thesis could be 100% correct and the stocks could still drop 40%? Here's how.

Hyperscaler capex grew 77% in 2026, up to $725B. That growth rate is insane and will not continue forever. At that pace, it'll surpass $2.3T by 2028. More than the entire annual capex of the S&P 500 combined. Something has to give. Power grids, free cash flow, ROI math, the equity market's willingness to keep funding it. You name it. But the music will stop at some point.

So by 2027 or 2028 or whenever, capex growth will decelerate from "extreme" to merely "high". Let's say from 77% to "just" 30%. Still huge, but not as crazy. What happens then? Every company I've named is priced as if the party will keep going, as if the capex slope goes up and to the right at the current angle. When that slope softens, multiples will compress and company stock prices will go down way before businesses show any real damage. We'll witness companies announcing a great quarter while the stock tanks 15%, because the forward growth expectations just got cut.

That's how you lose 30–40% on a thesis that's correct. Not because AI adoption fails. Not because "it was a bubble all along". Not because developers stop paying for coding agents. And definitely not because Nvidia or TSMC stop printing money. Just because the market was pricing 77% growth in capex that would last forever, and "forever" turned out to be three years.

This is why owning the right names isn't enough. You have to *own the bottlenecks AND stage your entry*. The best buying opportunities in this game will come from capex-cycle scares, not from the thesis being wrong. If you deploy 100% on day one, you've handed the next correction your worst entry price.

On the next post, I'll explore which specific names I'd actually buy, at what price, and which ones I'd avoid.
