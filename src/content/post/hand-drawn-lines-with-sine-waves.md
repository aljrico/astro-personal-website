---
title: "Hand-Drawn Lines With Sine Waves"
publishDate: "06 February 2026"
description: "A cheap trick for making procedural graphics look organic: layer sine waves at prime frequencies."
tags: ["programming", "gamedev", "graphics"]
---

I needed connection lines in a game map to look hand-drawn. Not perfectly straight, but not random either. Stable across frames, no jitter.

My first attempt was a single sine wave displacing the line perpendicular to its direction:

<figure>
<svg viewBox="0 0 560 56" role="img" aria-label="A line displaced by a single sine wave: a smooth, regular wobble" xmlns="http://www.w3.org/2000/svg"><path d="M0.0,28.00 L2.0,27.78 L4.0,27.56 L6.0,27.35 L8.0,27.14 L10.0,26.93 L12.0,26.74 L14.1,26.55 L16.1,26.38 L18.1,26.21 L20.1,26.05 L22.1,25.91 L24.1,25.78 L26.1,25.66 L28.1,25.56 L30.1,25.47 L32.1,25.40 L34.1,25.35 L36.1,25.31 L38.1,25.29 L40.1,25.29 L42.2,25.30 L44.2,25.34 L46.2,25.39 L48.2,25.46 L50.2,25.55 L52.2,25.66 L54.2,25.80 L56.2,25.95 L58.2,26.11 L60.2,26.30 L62.2,26.51 L64.2,26.74 L66.2,26.98 L68.2,27.25 L70.3,27.53 L72.3,27.82 L74.3,28.14 L76.3,28.47 L78.3,28.82 L80.3,29.18 L82.3,29.55 L84.3,29.94 L86.3,30.34 L88.3,30.75 L90.3,31.17 L92.3,31.60 L94.3,32.04 L96.3,32.48 L98.4,32.94 L100.4,33.39 L102.4,33.86 L104.4,34.32 L106.4,34.78 L108.4,35.25 L110.4,35.71 L112.4,36.18 L114.4,36.64 L116.4,37.09 L118.4,37.54 L120.4,37.98 L122.4,38.41 L124.4,38.84 L126.5,39.25 L128.5,39.65 L130.5,40.04 L132.5,40.41 L134.5,40.77 L136.5,41.11 L138.5,41.43 L140.5,41.73 L142.5,42.02 L144.5,42.28 L146.5,42.52 L148.5,42.74 L150.5,42.93 L152.5,43.10 L154.6,43.24 L156.6,43.36 L158.6,43.45 L160.6,43.52 L162.6,43.56 L164.6,43.57 L166.6,43.55 L168.6,43.50 L170.6,43.42 L172.6,43.31 L174.6,43.18 L176.6,43.01 L178.6,42.82 L180.6,42.59 L182.7,42.34 L184.7,42.06 L186.7,41.74 L188.7,41.40 L190.7,41.03 L192.7,40.64 L194.7,40.22 L196.7,39.77 L198.7,39.29 L200.7,38.79 L202.7,38.26 L204.7,37.72 L206.7,37.15 L208.7,36.55 L210.8,35.94 L212.8,35.31 L214.8,34.66 L216.8,33.99 L218.8,33.31 L220.8,32.61 L222.8,31.90 L224.8,31.17 L226.8,30.44 L228.8,29.70 L230.8,28.95 L232.8,28.19 L234.8,27.42 L236.8,26.66 L238.9,25.89 L240.9,25.12 L242.9,24.35 L244.9,23.59 L246.9,22.83 L248.9,22.07 L250.9,21.32 L252.9,20.58 L254.9,19.85 L256.9,19.13 L258.9,18.43 L260.9,17.74 L262.9,17.06 L264.9,16.40 L267.0,15.76 L269.0,15.14 L271.0,14.54 L273.0,13.96 L275.0,13.41 L277.0,12.88 L279.0,12.37 L281.0,11.89 L283.0,11.44 L285.0,11.01 L287.0,10.62 L289.0,10.25 L291.0,9.92 L293.0,9.61 L295.1,9.34 L297.1,9.10 L299.1,8.89 L301.1,8.71 L303.1,8.57 L305.1,8.45 L307.1,8.38 L309.1,8.33 L311.1,8.32 L313.1,8.34 L315.1,8.40 L317.1,8.49 L319.1,8.61 L321.1,8.76 L323.2,8.95 L325.2,9.16 L327.2,9.41 L329.2,9.69 L331.2,9.99 L333.2,10.33 L335.2,10.69 L337.2,11.08 L339.2,11.49 L341.2,11.93 L343.2,12.39 L345.2,12.88 L347.2,13.39 L349.2,13.92 L351.3,14.47 L353.3,15.03 L355.3,15.61 L357.3,16.21 L359.3,16.83 L361.3,17.45 L363.3,18.09 L365.3,18.73 L367.3,19.39 L369.3,20.05 L371.3,20.72 L373.3,21.39 L375.3,22.07 L377.3,22.74 L379.4,23.42 L381.4,24.10 L383.4,24.77 L385.4,25.44 L387.4,26.10 L389.4,26.76 L391.4,27.41 L393.4,28.05 L395.4,28.67 L397.4,29.29 L399.4,29.89 L401.4,30.48 L403.4,31.06 L405.4,31.62 L407.5,32.16 L409.5,32.68 L411.5,33.18 L413.5,33.67 L415.5,34.13 L417.5,34.57 L419.5,34.99 L421.5,35.39 L423.5,35.76 L425.5,36.11 L427.5,36.44 L429.5,36.74 L431.5,37.01 L433.5,37.27 L435.6,37.49 L437.6,37.70 L439.6,37.87 L441.6,38.02 L443.6,38.15 L445.6,38.25 L447.6,38.33 L449.6,38.38 L451.6,38.41 L453.6,38.42 L455.6,38.40 L457.6,38.36 L459.6,38.30 L461.6,38.21 L463.7,38.11 L465.7,37.99 L467.7,37.84 L469.7,37.68 L471.7,37.50 L473.7,37.31 L475.7,37.10 L477.7,36.87 L479.7,36.64 L481.7,36.39 L483.7,36.12 L485.7,35.85 L487.7,35.57 L489.7,35.28 L491.8,34.98 L493.8,34.68 L495.8,34.37 L497.8,34.06 L499.8,33.75 L501.8,33.43 L503.8,33.12 L505.8,32.80 L507.8,32.49 L509.8,32.18 L511.8,31.88 L513.8,31.58 L515.8,31.28 L517.8,31.00 L519.9,30.72 L521.9,30.45 L523.9,30.19 L525.9,29.95 L527.9,29.71 L529.9,29.49 L531.9,29.28 L533.9,29.08 L535.9,28.90 L537.9,28.73 L539.9,28.58 L541.9,28.44 L543.9,28.33 L545.9,28.22 L548.0,28.14 L550.0,28.07 L552.0,28.02 L554.0,27.99 L556.0,27.98 L558.0,27.98 L560.0,28.00" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>
<figcaption>One sine wave. Too perfect.</figcaption>
</figure>

It looked worse than the straight line. Obviously mathematical. Your brain instantly clocks the repeating pattern.

## The fix: layer more sine waves

Three sine waves at different frequencies, added together:

```swift
let h1 = sin(t * 11.0 + seed)
let h2 = 0.6 * sin(t * 23.0 + seed * 1.4)
let h3 = 0.3 * sin(t * 37.0 + seed * 0.7)
let wobble = envelope * (h1 + h2 + h3) / 1.9
```

<figure>
<svg viewBox="0 0 560 56" role="img" aria-label="A line displaced by three summed sine waves: an irregular, hand-drawn wobble" xmlns="http://www.w3.org/2000/svg"><path d="M0.0,28.00 L2.0,27.80 L4.0,27.62 L6.0,27.44 L8.0,27.29 L10.0,27.15 L12.0,27.03 L14.1,26.93 L16.1,26.87 L18.1,26.83 L20.1,26.81 L22.1,26.83 L24.1,26.87 L26.1,26.95 L28.1,27.05 L30.1,27.18 L32.1,27.33 L34.1,27.50 L36.1,27.69 L38.1,27.90 L40.1,28.12 L42.2,28.35 L44.2,28.58 L46.2,28.81 L48.2,29.04 L50.2,29.26 L52.2,29.47 L54.2,29.66 L56.2,29.84 L58.2,29.99 L60.2,30.12 L62.2,30.22 L64.2,30.30 L66.2,30.34 L68.2,30.36 L70.3,30.34 L72.3,30.30 L74.3,30.24 L76.3,30.14 L78.3,30.03 L80.3,29.90 L82.3,29.75 L84.3,29.59 L86.3,29.42 L88.3,29.25 L90.3,29.08 L92.3,28.92 L94.3,28.77 L96.3,28.63 L98.4,28.52 L100.4,28.42 L102.4,28.36 L104.4,28.32 L106.4,28.32 L108.4,28.35 L110.4,28.42 L112.4,28.52 L114.4,28.66 L116.4,28.84 L118.4,29.05 L120.4,29.30 L122.4,29.58 L124.4,29.88 L126.5,30.21 L128.5,30.57 L130.5,30.94 L132.5,31.32 L134.5,31.71 L136.5,32.10 L138.5,32.50 L140.5,32.89 L142.5,33.26 L144.5,33.63 L146.5,33.98 L148.5,34.31 L150.5,34.61 L152.5,34.89 L154.6,35.14 L156.6,35.37 L158.6,35.57 L160.6,35.73 L162.6,35.87 L164.6,35.99 L166.6,36.08 L168.6,36.14 L170.6,36.19 L172.6,36.22 L174.6,36.23 L176.6,36.24 L178.6,36.23 L180.6,36.22 L182.7,36.21 L184.7,36.19 L186.7,36.18 L188.7,36.18 L190.7,36.18 L192.7,36.19 L194.7,36.20 L196.7,36.22 L198.7,36.25 L200.7,36.28 L202.7,36.31 L204.7,36.34 L206.7,36.37 L208.7,36.38 L210.8,36.39 L212.8,36.37 L214.8,36.33 L216.8,36.26 L218.8,36.15 L220.8,36.00 L222.8,35.81 L224.8,35.56 L226.8,35.26 L228.8,34.90 L230.8,34.47 L232.8,33.98 L234.8,33.42 L236.8,32.78 L238.9,32.08 L240.9,31.31 L242.9,30.46 L244.9,29.56 L246.9,28.59 L248.9,27.57 L250.9,26.50 L252.9,25.39 L254.9,24.25 L256.9,23.08 L258.9,21.89 L260.9,20.70 L262.9,19.52 L264.9,18.35 L267.0,17.21 L269.0,16.10 L271.0,15.05 L273.0,14.06 L275.0,13.13 L277.0,12.29 L279.0,11.53 L281.0,10.87 L283.0,10.30 L285.0,9.85 L287.0,9.50 L289.0,9.27 L291.0,9.15 L293.0,9.14 L295.1,9.25 L297.1,9.47 L299.1,9.80 L301.1,10.23 L303.1,10.75 L305.1,11.36 L307.1,12.05 L309.1,12.81 L311.1,13.63 L313.1,14.51 L315.1,15.42 L317.1,16.36 L319.1,17.31 L321.1,18.28 L323.2,19.23 L325.2,20.18 L327.2,21.10 L329.2,21.99 L331.2,22.83 L333.2,23.63 L335.2,24.38 L337.2,25.06 L339.2,25.68 L341.2,26.24 L343.2,26.73 L345.2,27.15 L347.2,27.50 L349.2,27.79 L351.3,28.01 L353.3,28.17 L355.3,28.28 L357.3,28.33 L359.3,28.34 L361.3,28.31 L363.3,28.25 L365.3,28.16 L367.3,28.05 L369.3,27.93 L371.3,27.80 L373.3,27.67 L375.3,27.55 L377.3,27.44 L379.4,27.34 L381.4,27.26 L383.4,27.20 L385.4,27.17 L387.4,27.17 L389.4,27.19 L391.4,27.25 L393.4,27.33 L395.4,27.44 L397.4,27.57 L399.4,27.73 L401.4,27.91 L403.4,28.11 L405.4,28.33 L407.5,28.55 L409.5,28.78 L411.5,29.02 L413.5,29.25 L415.5,29.48 L417.5,29.71 L419.5,29.92 L421.5,30.12 L423.5,30.30 L425.5,30.47 L427.5,30.61 L429.5,30.74 L431.5,30.85 L433.5,30.93 L435.6,31.00 L437.6,31.04 L439.6,31.07 L441.6,31.09 L443.6,31.09 L445.6,31.08 L447.6,31.06 L449.6,31.04 L451.6,31.01 L453.6,30.98 L455.6,30.96 L457.6,30.94 L459.6,30.92 L461.6,30.92 L463.7,30.93 L465.7,30.95 L467.7,30.98 L469.7,31.02 L471.7,31.08 L473.7,31.15 L475.7,31.23 L477.7,31.33 L479.7,31.43 L481.7,31.54 L483.7,31.65 L485.7,31.76 L487.7,31.87 L489.7,31.97 L491.8,32.07 L493.8,32.16 L495.8,32.23 L497.8,32.29 L499.8,32.33 L501.8,32.35 L503.8,32.34 L505.8,32.31 L507.8,32.26 L509.8,32.18 L511.8,32.07 L513.8,31.94 L515.8,31.78 L517.8,31.61 L519.9,31.41 L521.9,31.19 L523.9,30.96 L525.9,30.71 L527.9,30.46 L529.9,30.20 L531.9,29.94 L533.9,29.68 L535.9,29.43 L537.9,29.18 L539.9,28.96 L541.9,28.74 L543.9,28.55 L545.9,28.38 L548.0,28.24 L550.0,28.13 L552.0,28.04 L554.0,27.98 L556.0,27.96 L558.0,27.96 L560.0,28.00" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>
<figcaption>Three harmonics. Reads as hand-drawn.</figcaption>
</figure>

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
