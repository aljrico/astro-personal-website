import type { ImageMetadata } from "astro";
import flamaIcon from "../assets/icons/flamaIcon.png";
import gotLogo from "../assets/icons/got_logo.png";
import hpLogo from "../assets/icons/hp_logo.png";
import ipirateIcon from "../assets/icons/ipirateIcon.svg";
import miniMatchIcon from "../assets/icons/miniMatchIcon.png";
import pizzaClickerIcon from "../assets/icons/pizzaClickerIcon.png";
import planetsLogo from "../assets/icons/planets_logo.png";
import rfinanceLogo from "../assets/icons/rfinance_logo.png";
import shipLogo from "../assets/icons/ship_logo.png";
import tabletIcon from "../assets/icons/tabletIcon.svg";
import tentativelyIcon from "../assets/icons/tentativelyIcon.png";
import testDgtIcon from "../assets/icons/testDgtIcon.png";
import tinyCrimesIcon from "../assets/icons/tinyCrimesIcon.png";
import tinyTdIcon from "../assets/icons/tinyTdIcon.png";
import tolkienLogo from "../assets/icons/tolkien_logo.svg";
import toonliteLogo from "../assets/icons/toonlite_logo.svg";
import whaleCoffeeIcon from "../assets/icons/whaleCoffeeIcon.png";

export type ProjectLink = {
	href: string;
	label: string;
	/** Rendered as a greyed-out, non-navigating button (e.g. a store listing that no longer exists). */
	disabled?: boolean;
};

import type { SectionIconName } from "../components/SectionIcon.astro";

export type LegalDoc = "privacy" | "terms" | "support";

export type Project = {
	/** Folder under src/pages/apps/ and prefix of its legal docs in src/content/apps/. */
	slug: string;
	title: string;
	/** Shown on the app page; its years are the homepage row's range. */
	period: string;
	status: "live" | "closed" | "ended";
	/** Replaces `period` on the app page header only. */
	subtitle?: string;
	/** Local icons are optimised through astro:assets; strings are remote URLs. */
	icon: ImageMetadata | string;
	iconAlt: string;
	links?: ProjectLink[];
	/** Labels for the legal docs nav (and its aria-label), when the page is not in English. */
	legalLabels?: Record<LegalDoc | "nav", string>;
};

const appStore = (href: string): ProjectLink => ({
	href,
	label: "App Store",
});
const googlePlay = (href: string): ProjectLink => ({
	href,
	label: "Google Play",
});
const github = (repo: string): ProjectLink => ({
	href: `https://github.com/aljrico/${repo}`,
	label: "GitHub",
});
const cran = (pkg: string): ProjectLink => ({
	href: `https://cran.r-project.org/package=${pkg}`,
	label: "CRAN",
});

export const sections: Array<{ heading: string; icon: SectionIconName; projects: Project[] }> = [
	{
		heading: "Games",
		icon: "games",
		projects: [
			{
				slug: "tentatively",
				title: "Tentatively",
				period: "2026-present",
				status: "live",
				icon: tentativelyIcon,
				iconAlt: "Tentatively app icon",
			},
			{
				slug: "tiny-crimes",
				title: "Tiny Crimes",
				period: "2026-present",
				status: "live",
				icon: tinyCrimesIcon,
				iconAlt: "Tiny Crimes app icon",
				links: [
					appStore("https://apps.apple.com/app/id6776382837"),
					googlePlay("https://play.google.com/store/apps/details?id=com.aljrico.tinycrimes"),
				],
			},
			{
				slug: "tiny-td",
				title: "Tiny TD",
				period: "2026-present",
				status: "live",
				icon: tinyTdIcon,
				iconAlt: "Tiny TD app icon",
				links: [
					appStore("https://apps.apple.com/es/app/tiny-td-living-roads/id6809146749?l=en-GB"),
					googlePlay("https://play.google.com/store/apps/details?id=com.aljrico.minitd"),
				],
			},
			{
				slug: "match-tile-mini",
				title: "Match Tile: Mini",
				period: "2023-2026",
				status: "live",
				icon: miniMatchIcon,
				iconAlt: "Match Tile: Mini app icon",
				links: [
					appStore(
						"https://apps.apple.com/es/app/match-tile-mini-puzzle-game/id6473903061?l=en-GB",
					),
				],
			},
			{
				slug: "cookie-empire",
				title: "Cookie Empire",
				period: "2022-present",
				status: "live",
				icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/5e/15/4a/5e154ae1-c4c9-0b05-187f-918de949abb3/AppIcon-0-0-1x_U007epad-0-0-0-1-0-0-85-220.png/128x128bb.jpg",
				iconAlt: "Cookie Empire app icon",
				links: [
					appStore("https://apps.apple.com/app/cookie-empire-idle-clicker/id6471402254"),
					{ href: "https://discord.gg/thqU7G8hXt", label: "Discord" },
				],
			},
			{
				slug: "pizza-clicker",
				title: "Pizza Clicker",
				period: "Feb-Oct 2022",
				status: "closed",
				icon: pizzaClickerIcon,
				iconAlt: "Pizza Clicker app icon",
			},
		],
	},
	{
		heading: "Open source",
		icon: "open-source",
		projects: [
			{
				slug: "toonlite",
				title: "toonlite",
				period: "2025-present",
				status: "live",
				icon: toonliteLogo,
				iconAlt: "toonlite R package logo",
				links: [github("toonlite"), cran("toonlite")],
			},
			{
				slug: "rfinance",
				title: "rfinance",
				period: "2020-2024",
				status: "live",
				icon: rfinanceLogo,
				iconAlt: "rfinance R package logo",
				links: [github("rfinance"), cran("rfinance")],
			},
			{
				slug: "tolkien",
				title: "tolkien",
				period: "2019",
				status: "live",
				icon: tolkienLogo,
				iconAlt: "tolkien R package logo",
				links: [github("tolkien")],
			},
			{
				slug: "planets",
				title: "planets",
				period: "2019",
				status: "live",
				icon: planetsLogo,
				iconAlt: "planets R package logo",
				links: [github("planets"), cran("planets")],
			},
			{
				slug: "gameofthrones",
				title: "gameofthrones",
				period: "2018-present",
				status: "live",
				icon: gotLogo,
				iconAlt: "gameofthrones R package logo",
				links: [github("gameofthrones")],
			},
			{
				slug: "harrypotter",
				title: "harrypotter",
				period: "2018-present",
				status: "live",
				icon: hpLogo,
				iconAlt: "harrypotter R package logo",
				links: [github("harrypotter"), cran("harrypotter")],
			},
		],
	},
	{
		heading: "Commercial Projects",
		icon: "commercial",
		projects: [
			{
				slug: "test-dgt",
				title: "Test DGT",
				period: "2026-present",
				status: "live",
				icon: testDgtIcon,
				iconAlt: "Test DGT app icon",
				links: [
					appStore("https://apps.apple.com/app/id6763710388"),
					googlePlay("https://play.google.com/store/apps/details?id=com.aljrico.flama_conducir"),
				],
			},
			{
				slug: "flama-coach",
				title: "Mossos Coach",
				period: "2026-present",
				status: "live",
				subtitle: "Oposicions a Mossos d'Esquadra · Convocatòria 2026",
				icon: flamaIcon,
				iconAlt: "Icona de Mossos Coach",
				links: [
					{
						...appStore("https://apps.apple.com/es/app/mossos-coach-oposicions/id6758277341"),
						label: "Descarrega'l a l'App Store",
					},
				],
				legalLabels: {
					privacy: "Política de privacitat",
					terms: "Termes d'ús",
					support: "Suport",
					nav: "Enllaços de Mossos Coach",
				},
			},
			{
				slug: "coffee-galley",
				title: "Coffee Galley",
				period: "2020-2022",
				status: "closed",
				icon: shipLogo,
				iconAlt: "Coffee Galley ship icon",
				links: [{ href: "#", label: "Shopify App Store", disabled: true }],
			},
			{
				slug: "the-whale-coffee",
				title: "The Whale Coffee",
				period: "2020-2021",
				status: "closed",
				icon: whaleCoffeeIcon,
				iconAlt: "The Whale Coffee logo",
				links: [
					{
						href: "https://www.instagram.com/thewhalecoffee_/",
						label: "Instagram",
					},
				],
			},
			{
				slug: "comprar-una-tablet",
				title: "Comprar una tablet",
				period: "2014-2016",
				status: "closed",
				icon: tabletIcon,
				iconAlt: "Comprar una tablet icon",
				links: [
					{
						href: "https://web.archive.org/web/2015/http://comprarunatablet.eu/",
						label: "Wayback Machine",
					},
					{
						href: "https://www.facebook.com/comprarunatablet.eu/",
						label: "Facebook",
					},
				],
			},
			{
				slug: "ipirate",
				title: "iPirate",
				period: "2014-2017",
				status: "closed",
				icon: ipirateIcon,
				iconAlt: "iPirate channel icon",
				links: [
					{
						href: "https://www.youtube.com/@iPirateLoL/videos",
						label: "YouTube",
					},
				],
			},
		],
	},
];

export function getProject(slug: string): Project {
	const project = sections.flatMap((s) => s.projects).find((p) => p.slug === slug);
	if (!project) throw new Error(`Unknown project slug: ${slug}`);
	return project;
}
