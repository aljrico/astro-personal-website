import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
	author: "Alejandro Rico",
	title: "Alejandro Rico",
	description:
		"Alejandro Rico — data lead in games, indie developer, writes about companies and markets.",
	lang: "en-GB",
	ogLocale: "en_GB",
	// Date.prototype.toLocaleDateString() parameters
	date: {
		locale: "en-GB",
		options: {
			day: "numeric",
			month: "long",
			year: "numeric",
		},
	},
};

