---
title: "Five Daggers From One SVG"
publishDate: "14 February 2026"
description: "I needed five weapon tiers for my game. I had one SVG and a text editor."
tags: ["gamedev", "devlog", "cookie-empire"]
---

I needed five dagger icons for [Cookie Empire](/apps/cookie-empire). The game has a pickaxe upgrade system with five tiers — bone, ruby, sapphire, golden, obsidian — and each one needed to feel like a distinct step up. I had one SVG from an icon pack and no budget for a designer.

<img src="/posts/dagger-bone.png" alt="The original bone dagger" width="128" />

The easy move would've been to eyeball some colors. Pick a red that looks ruby-ish, a blue that looks sapphire-ish. But eyeballed colors at icon size always look slightly off — too saturated, too dull, not quite right in ways you can't articulate.

The same icon pack has ore stones. Ruby ore, sapphire ore, the whole set. Those colors were already designed to read well at small sizes. So instead of inventing colors, I just borrowed them. Open the ruby ore SVG, grab its fills, paste them into the dagger blade.

<img src="/posts/dagger-ruby.png" alt="Ruby dagger" width="128" />

Worked perfectly on the first try. Deep reds, jewel-toned, immediately reads as "ruby." For the hilt I pulled slate tones from another variant in the pack. Cool metal against warm red blade — nice contrast without any effort.

Then I did the same with sapphire and it looked like shit. Three times. The blues that look rich and deep on a big chunky ore polygon turn into a muddy blob on a thin blade surrounded by black outline. Same hex values, completely different perception. I had to crank the brightness way past what felt right in isolation to get something that actually read as "sapphire" at icon size.

<img src="/posts/dagger-sapphire.png" alt="Sapphire dagger" width="128" />

That was the useful lesson from this whole exercise. Colors don't transfer between shapes. Context — size, surrounding colors, thickness of the surface — changes everything.

Golden was a freebie. Already existed in the pack, swapped the hilt to slate, done.

<img src="/posts/dagger-golden.png" alt="Golden dagger" width="128" />

Obsidian was the one I'm proudest of, and it happened by accident. I tried the same formula — dark blade, slate hilt — and it was unreadable. Dark blade, dark hilt, black outline, everything merged together. I was stuck.

So I flipped it out of desperation. Gave the blade the slate colors that had been the *hilt* on every other dagger. Gave the hilt some stone-grey tones from a coal ore.

<img src="/posts/dagger-obsidian.png" alt="Obsidian dagger" width="128" />

It ended up being the best one. Monochromatic, cold, looks carved from volcanic rock. And it visually breaks the pattern of the other four daggers, which is exactly what a top-tier item should do. I didn't plan that. The constraint forced something better than what I would've designed on purpose.

Five icons, maybe an hour of work. Most of that hour was arguing with myself about whether the sapphire was too dark.
