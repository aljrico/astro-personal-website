---
title: "A Roguelite Inside an Idle Game"
publishDate: "20 February 2026"
description: "167 commits, a dungeon crawler, and eldritch lore. What happened after v5.2 of Cookie Empire."
tags: ["gamedev", "cookie-empire", "devlog", "programming"]
---

After shipping v5.1 of Cookie Empire, I went a bit overboard. What started as a "small addition to Expeditions" turned into 167 commits, a full roguelite minigame, a lore bible, and a custom tree layout algorithm. Here's everything that went in.

## The Hollows — A Roguelite Minigame
The biggest addition by far. A full dungeon exploration system living inside the Expeditions tab.

### The Core Loop
You explore a branching tree map shrouded in fog of war, one node at a time. Each node can be empty, contain a chest with loot, hide a monster to fight, or hold a lost journal fragment. You have a sanity bar — reach zero and your map wipes, but your equipment stays. Primordial Fangs are the meta-progression currency you earn from combat and chests.

The whole thing unlocks from a 5% "Tattered Map" drop on expedition payouts. No fanfare, no tutorial. You find a map, a new tab appears, and you start descending.

### Combat
Early on I had a d20-based system, but it didn't feel right — too swingy for a game where death has real consequences. I moved to a ratio-based formula where win probability is `(playerATK + 2) / (playerATK + 2 + monsterDEF)`. Predictable, but still tense.

Sanity damage also uses ratios now: `max(1, ceil(100 * (monsterATK - playerDEF) / (monsterATK + 10)))`. This means partial shield coverage actually matters — you don't need to fully outstat a monster to survive the fight.

Defeating a monster converts the danger node into a chest. Harder fights drop better treasure. There's a clash flash animation with haptics on engagement, and 12 randomized narration phrases per outcome so it doesn't feel repetitive.

### Equipment — The Smith
Five dagger tiers (Bone through Obsidian) and five shield tiers to match. Each with unique colored icons I built from SVGs.

I went through a couple of design iterations here. First it was a traditional equip system with upgrade RNG. Then I scrapped all of that for a simpler "buy copies" model — your total ATK is the sum of all daggers you own, total DEF is the sum of all shields. On sanity death you lose 50% of your ores but keep all equipment, making gear act as a savings account against wipes.

The balancing analysis showed shields are dramatically more valuable than daggers early on (17x improvement vs 1.26x), which creates a natural "defense first, offense second" strategy that players discover organically.

### The Map
The map went through three layout algorithms:

1. **Top-down tree** — worked but wasted space
2. **Radial starburst** — looked cool but fell apart with uneven subtrees
3. **Reingold-Tilford** — each subtree gets exactly the space it needs

On top of the layout, there's organic post-processing: arc displacement pushes children away from parents, and deterministic jitter (FNV-1a seeded) breaks the grid feel.

Nodes are hand-drawn wobbly squircles built from three overlapping sine harmonics at prime-ish frequencies modulating a superellipse radius. Same technique for the connection lines. It's deterministic and cheap to compute, but looks organic.

Pinch-to-zoom uses a UIScrollView wrapped in UIViewRepresentable. Nodes and lines animate in with a cascading ripple — lines "reach" toward nodes which spring into existence.

### Lore
110 lost journal fragments across four depth-scaled tiers. I wrote a full lore bible for this — an eldritch entity at the bottom of the mine, grandma sacrifices, cookie compulsion reframed as communion. The tiers progress from surface unease through growing dread to full cosmic horror.

Probably nobody will read all 110 entries. But the ones they do find should feel like they stumbled onto something real. It should feel like a reward.

## A/B Test: Offline Production
Ran a deep forensic analysis on the `freeOfflineProduction_v2` test. Initial surface-level conclusion was _so_ good. Higher **ARPDAU**, higher **D7 Retention**, higher **LTV**, just higher everything.

But it was too good to be true. A bunch of whales were nudging the numbers way up. The real finding: control users convert to payers at 2.11% vs 1.34% on the `free` variant. NoAds conversion specifically 3.7x higher in control. Free offline production removes the key monetization trigger — users never see ads, feel no friction, never buy.

Killed the free variant. But it had a better UI than control, so I replaced the test with one that keeps the new design but the same monetization strategy. We'll see how it goes.

## Bug Fixes
- **Tiles Match booster bug:** Boosters were consumed even when their effect failed. Changed the effect signature from `() -> Void` to `() -> Bool` — only decrement on success.
- **Pickaxe level compensation:** Added compensation for all 5 ore colors after a rebalancing pass.
- **ZoomableScrollView hard freeze:** `sizeThatFits` inside `viewDidLayoutSubviews` caused an infinite synchronous layout loop. Fixed with async deferral and a coalescing flag.
- **Offline claim button:** Disabled when the rewarded ad isn't loaded yet.

## Code Quality
Did a full 13-step, 4-phase refactor of the entire Hollows codebase once it was feature-complete. 871 insertions, 779 deletions, net -8% lines of code. Extracted a `CombatFlowController` that shrank the main combat handler from ~170 lines to ~15. Built a reusable `TypewriterText` component. Fixed a critical persistence bug where calling `save()` during `load()` could wipe map data for migrating users.

## What's Next
Ship it. This is the biggest content update Cookie Empire has ever had in a _long_ while, and it's been sitting on `main` for weeks.

I'm nervous. Not about bugs — those I can fix. It's about the silence. There's a lot of me in this one. The lore, the hand-drawn icons, the map algorithm I rewrote three times because it didn't *feel* right. 167 commits of caring about something that might land to zero fanfare. That's the usual bet, though. You ship it and see if anyone notices.
