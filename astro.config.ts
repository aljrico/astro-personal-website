import mdx from "@astrojs/mdx";
import prefetch from "@astrojs/prefetch";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import fs from "fs";
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
		plugins: [rawFonts([".ttf"])],
		optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
	},
});

function rawFonts(ext: Array<string>) {
	return {
		name: "vite-plugin-raw-fonts",
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore:next-line
		transform(_, id) {
			if (ext.some((e) => id.endsWith(e))) {
				const buffer = fs.readFileSync(id);
				return {
					code: `export default ${JSON.stringify(buffer)}`,
					map: null,
				};
			}
		},
	};
}
