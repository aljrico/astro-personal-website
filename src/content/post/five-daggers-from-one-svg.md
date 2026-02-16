---
title: "Five Daggers From One SVG"
publishDate: "14 February 2026"
description: "I needed five weapon tiers for my game. I had one SVG and a text editor."
tags: ["gamedev", "devlog", "cookie-empire"]
---

I needed five dagger icons for [Cookie Empire](/apps/cookie-empire). The game has a pickaxe upgrade system with five tiers — bone, ruby, sapphire, golden, obsidian — and each one needed to look distinct. I had one SVG from an icon pack and no desire to open Figma.

<img src="/posts/dagger-bone.png" alt="The original bone dagger" width="128" />

Turns out the SVG is just seven CSS classes. Three fills for the blade, two for the hilt, one outline, one bounding box. So making a ruby dagger is literally changing three hex values in a text editor.

```css
.cls-1 { fill: #ffdfb5; }  /* blade main */
.cls-2 { fill: #f0ba84; }  /* blade shadow */
.cls-4 { fill: #fff2d4; }  /* blade highlight */
```

I didn't want to eyeball the colors, so I grabbed them from the ore stones in the same icon pack. Ruby ore uses these deep, saturated reds — `#e62e49`, `#a72d3e`. Plugged those into the blade fills, derived a lighter pink for the highlight, swapped the wooden hilt for slate tones. Looked great immediately.

<img src="/posts/dagger-ruby.png" alt="Ruby dagger" width="128" />

Then I tried the same thing with sapphire and it looked like shit. Too dark, too muddy. What reads as a rich blue on a big chunky ore polygon becomes an indistinct blob on a thin blade surrounded by black outline. Same hex value, completely different perception. I had to manually crank the brightness way up while keeping saturation high. Took me three attempts to land on something that read as "sapphire" and not "sky blue" or "bruise."

<img src="/posts/dagger-sapphire.png" alt="Sapphire dagger" width="128" />

Golden was a freebie — already existed in the pack, I just swapped the hilt to slate. Done.

<img src="/posts/dagger-golden.png" alt="Golden dagger" width="128" />

Obsidian was the interesting one. I tried the same formula — dark blade, slate hilt — and it looked terrible. Everything merged together. Dark blade, dark hilt, black outline. No contrast, no readability. So I flipped it. The blade got the slate colors that had been the hilt on every other dagger, and the hilt got stone-grey tones from a coal ore SVG.

<img src="/posts/dagger-obsidian.png" alt="Obsidian dagger" width="128" />

It accidentally ended up being the coolest one. Monochromatic, cold, looks carved from a single piece of volcanic rock. It breaks the visual pattern of the other four, which is exactly what a top-tier item should do. I didn't plan that — I just ran out of options and the constraint forced something better than what I would've designed on purpose.

Five icons, one source file, maybe an hour of work. Most of that hour was arguing with myself about whether the sapphire was too dark.
