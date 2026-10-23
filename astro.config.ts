import mdx from "@astrojs/mdx";
import prefetch from "@astrojs/prefetch";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkUnwrapImages from "remark-unwrap-images";
import { remarkReadingTime } from "./src/utils/remark-reading-time";

// https://astro.build/config
export default defineConfig({
	site: "https://aljrico.com/",
	markdown: {
		// Math is $$...$$ only, inline or block: single dollars are prices in the newer posts.
		remarkPlugins: [remarkUnwrapImages, remarkReadingTime, [remarkMath, { singleDollarTextMath: false }]],
		rehypePlugins: [rehypeKatex],
		remarkRehype: { footnoteLabelProperties: { className: [""] } },
		// Code is set in plain ink: no highlighting theme.
		syntaxHighlight: false,
	},
	integrations: [
		mdx({}),
		tailwind({
			applyBaseStyles: false,
		}),
		sitemap({ filter: (page) => !page.includes("/stats/") }),
		prefetch(),
	],
	vite: {
		optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
	},
});
