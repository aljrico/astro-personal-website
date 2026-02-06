---
title: "Hand-Drawn Lines With Sine Waves"
publishDate: "06 February 2026"
description: "A cheap trick for making procedural graphics look organic: layer sine waves at prime frequencies."
tags: ["programming", "gamedev", "graphics"]
---

I needed connection lines in a game map to look hand-drawn. Not perfectly straight, but not random either. Stable across frames, no jitter.

My first attempt was a single sine wave displacing the line perpendicular to its direction:

![A single sine wave — too perfect](/posts/wobble-single-sine.png)

It looked worse than the straight line. Obviously mathematical. Your brain instantly clocks the repeating pattern.

## The fix: layer more sine waves

Three sine waves at different frequencies, added together:

```swift
let h1 = sin(t * 11.0 + seed)
let h2 = 0.6 * sin(t * 23.0 + seed * 1.4)
let h3 = 0.3 * sin(t * 37.0 + seed * 0.7)
let wobble = envelope * (h1 + h2 + h3) / 1.9
```

![Three overlapping harmonics — organic](/posts/wobble-multi-harmonic.png)

The frequencies (11, 23, 37) are chosen to not be multiples of each other. This means the combined wave never repeats cleanly. Your brain can't lock onto a pattern because there isn't one.

The amplitudes decrease (1.0, 0.6, 0.3) so the lowest frequency dominates the overall shape while the higher ones add texture. Like a coastline — big bays with smaller inlets with even smaller coves.

## Making it useful

Two details that matter:

**Envelope.** Multiply the whole thing by `sin(π * t)` where `t` goes from 0 to 1 along the line. This fades the wobble to zero at both endpoints, so lines connect cleanly to their nodes.

**Seed.** Each line gets a seed derived from its endpoint IDs (`parentId.hashValue ^ childId.hashValue`). Same math, different phase offsets, unique shape per line. Deterministic — no randomness, no state, renders identically every frame.

## The same trick works for shapes

I used the same approach for node outlines. A superellipse (squircle) with three harmonics modulating the radius:

```swift
let harmonic1 = 0.018 * sin(rad * 3 + seed)
let harmonic2 = 0.012 * sin(rad * 5 + seed * 1.3)
let harmonic3 = 0.008 * sin(rad * 7 + seed * 0.7)
```

Every node gets a unique wobbly shape from its UUID hash. The whole map looks like someone sketched it by hand.

## Why this works

A single sine wave has one degree of freedom — your visual cortex solves it instantly. Three non-harmonic sine waves have enough complexity that the pattern recognition fails. The result reads as "irregular" rather than "mathematical."

It's the cheapest possible way to fake organic. No Perlin noise, no random number generators, no precomputed textures. Just `sin()` called a few extra times.
