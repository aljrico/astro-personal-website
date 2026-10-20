import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
	author: "Alejandro Rico",
	title: "Personal Website",
	description: "Alejandro's personal website. Made with Astro",
	lang: "en-GB",
	ogLocale: "en_GB",
	// Date.prototype.toLocaleDateString() parameters
	date: {
		locale: "en-GB",
		options: {
			day: "numeric",
			month: "short",
			year: "numeric",
		},
	},
};

// Used to generate links in both the Header & Footer.
export const menuLinks: Array<{ title: string; path: string }> = [
	{
		title: "Home",
		path: "/",
	},
	{
		title: "Blog",
		path: "/posts/",
	},
];
