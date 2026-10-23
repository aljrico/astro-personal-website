import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

// The design is one size, ink on paper. The theme below is deliberately tiny so that
// leftover utility classes can't reintroduce sizes, colours, borders, radii or shadows.
const ink = "var(--ink)";
const muted = "var(--muted)";

export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	corePlugins: {
		touchAction: false,
		ringOffsetWidth: false,
		ringOffsetColor: false,
		ringWidth: false,
		scrollSnapType: false,
		borderOpacity: false,
		textOpacity: false,
		fontVariantNumeric: false,
		boxShadow: false,
		borderRadius: false,
		borderWidth: false,
		fontSize: false,
		letterSpacing: false,
	},
	theme: {
		colors: {
			transparent: "transparent",
			current: "currentColor",
			ink,
			muted,
			paper: "var(--paper)",
			codebg: "var(--codebg)",
			// Legacy names still used by a few hand-built pages map onto the two inks.
			textColor: ink,
			"accent-2": ink,
			accent: ink,
			link: ink,
			bgColor: "var(--paper)",
			gray: { 400: muted, 500: muted, 600: muted },
		},
		fontFamily: {
			heading: "var(--font-heading)",
			serif: "var(--font-heading)",
			sans: "var(--font-body)",
			mono: "var(--font-mono)",
		},
	},
	plugins: [
		plugin(function ({ addComponents }) {
			addComponents({
				".title": {
					"@apply font-semibold text-ink": {},
				},
			});
		}),
	],
} satisfies Config;
