---
title: "Five Daggers From One SVG"
publishDate: "14 February 2026"
description: "How I turned a single icon pack SVG into five color-coded weapon tiers by swapping fills and exporting PNGs from the terminal."
tags: ["gamedev", "design", "assets"]
---

My idle clicker game has a dagger upgrade system. Five tiers: bone, ruby, sapphire, golden, obsidian. I needed five distinct icons. I had one.

![The original bone dagger](/posts/dagger-bone.png)

The SVG from the icon pack has seven CSS classes. Three control the blade, two control the hilt, one is the outline, one is an invisible bounding box. That's it. Seven fills to define the whole thing.

```css
.cls-1 { fill: #ffdfb5; }  /* blade main */
.cls-2 { fill: #f0ba84; }  /* blade shadow */
.cls-4 { fill: #fff2d4; }  /* blade highlight */
.cls-3 { fill: #9c3d29; }  /* hilt cross-guard */
.cls-5 { fill: #d1774b; }  /* hilt wrap */
```

To make a ruby dagger, I just needed three new hex values for the blade fills.

## Stealing colors from the right place

I didn't want to eyeball the reds. The same icon pack has ore stones — ruby ore, sapphire ore — with colors that already look good at small sizes. So I opened those SVGs and grabbed their fills.

Ruby ore uses `#e62e49` and `#a72d3e`. Deep, saturated, jewel-toned. I mapped those to the blade's main and shadow fills, then derived a lighter `#ff6675` for the highlight.

![Ruby dagger](/posts/dagger-ruby.png)

For the hilt, I borrowed the slate tones from the crystal dagger variant in the same pack (`#324652` / `#476475`). The cool metal handle against the warm red blade creates a nice contrast.

## The sapphire problem

I did the same thing with sapphire ore colors (`#0049c7` / `#1778ff`). It looked wrong. Too dark, too muddy at icon size. What reads as a rich blue on a large ore stone becomes an indistinct blob on a tiny dagger blade.

I had to manually bump the brightness while keeping saturation high. Ended up at `#2b88ff` / `#0055dd` / `#5cadff` — noticeably brighter than the ore, but still reads as "sapphire" rather than "sky blue."

![Sapphire dagger](/posts/dagger-sapphire.png)

Lesson: colors don't transfer 1:1 between shapes. The ore is a big chunky polygon. The blade is a thin sliver surrounded by black outline. Same hex value, completely different perception.

## The freebie

Golden already existed in the pack. I just swapped the hilt from wooden brown to slate. Done.

![Golden dagger](/posts/dagger-golden.png)

## Breaking the pattern on purpose

For obsidian — the top tier — I tried the same formula. Dark blade, slate hilt. It looked terrible. The dark blade merged with the dark hilt and the black outline. No contrast, no readability.

So I flipped it. The blade got the slate colors that had been the hilt on every other dagger. And the hilt got stone-grey tones from a coal ore SVG (`#7b97a6` / `#abc0c9`).

![Obsidian dagger](/posts/dagger-obsidian.png)

The result is a monochromatic, cold weapon that looks carved from a single piece of volcanic rock. It breaks the pattern of the other four daggers, which is exactly what a top-tier item should do.

## The pipeline

The whole process is three steps:

1. Edit CSS fills in the SVG
2. `rsvg-convert -w 256 -h 256 input.svg -o output.png`
3. Drop the PNG into an Xcode asset catalog

No Photoshop. No Figma. No manual exporting. Just a text editor and a terminal command.

Five icons, one source file, maybe an hour of iteration. Most of that hour was arguing about whether the sapphire was too dark.
