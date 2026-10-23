import fs from "node:fs";
import path from "node:path";
import satori, { type SatoriOptions } from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import { siteConfig } from "@/site-config";

// Share cards (1200x630) in the site's light theme: paper, ink, the red accent, DM Sans and Plex Mono.
// Satori collapses spaces between spans, so the tagline spaces its words with margins.
// Satori can't read woff2, hence the static woff builds. Paths are relative to the project root,
// where builds run.
const read = (file: string) => fs.readFileSync(path.resolve(file));
const fontsource = (pkg: string, file: string) => read(`node_modules/@fontsource/${pkg}/files/${file}`);

const options: SatoriOptions = {
	width: 1200,
	height: 630,
	fonts: [
		{ name: "DM Sans", data: fontsource("dm-sans", "dm-sans-latin-600-normal.woff"), weight: 600 },
		{ name: "Plex Mono", data: fontsource("ibm-plex-mono", "ibm-plex-mono-latin-400-normal.woff"), weight: 400 },
	],
};

const avatar = `data:image/jpeg;base64,${read("src/assets/avatar.jpg").toString("base64")}`;
const host = new URL(import.meta.env.SITE).host;

const PAPER = "#fdfdfb";
const INK = "#111111";
const MUTED = "#6b6b6b";
const ACCENT = "#cb2a42";

/** The homepage card: the site header, large. */
const siteCard = () =>
	html`<div tw="flex flex-col w-full h-full p-[80px]" style="background: ${PAPER}">
		<div tw="flex flex-1 items-center">
			<img src="${avatar}" width="180" height="180" tw="rounded-[36px]" />
			<div tw="flex flex-col ml-[44px]">
				<p tw="flex m-0 text-[30px]" style="font-family: 'Plex Mono'; color: ${MUTED}">
					<span>Making</span>
					<span style="margin-left: 18px; color: ${ACCENT}">fun</span>
					<span style="margin-left: 18px">things</span>
					<span style="margin-left: 18px; color: ${ACCENT}">profitable</span>
					<span>…</span>
				</p>
				<p tw="m-0 mt-[6px] text-[64px]" style="font-family: 'DM Sans'; color: ${INK}">${siteConfig.author}</p>
			</div>
		</div>
		<p tw="m-0 text-[26px]" style="font-family: 'Plex Mono'; color: ${MUTED}">${host}</p>
	</div>`;

/** A post card: the title, with the date and a small site header for the byline. */
const postCard = (title: string, date: string) =>
	html`<div tw="flex flex-col w-full h-full justify-between p-[80px]" style="background: ${PAPER}">
		<p tw="m-0 text-[26px]" style="font-family: 'Plex Mono'; color: ${MUTED}">${date}</p>
		<p tw="m-0 text-[68px] leading-[1.15]" style="font-family: 'DM Sans'; color: ${INK}">${title}</p>
		<div tw="flex items-center">
			<img src="${avatar}" width="72" height="72" tw="rounded-[16px]" />
			<p tw="m-0 ml-[24px] text-[30px]" style="font-family: 'DM Sans'; color: ${INK}">${siteConfig.author}</p>
			<p tw="m-0 ml-auto text-[26px]" style="font-family: 'Plex Mono'; color: ${MUTED}">${host}</p>
		</div>
	</div>`;

const png = async (markup: ReturnType<typeof html>) =>
	new Response(new Resvg(await satori(markup, options)).render().asPng(), {
		headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000, immutable" },
	});

export const siteCardResponse = () => png(siteCard());
export const postCardResponse = (title: string, date: string) => png(postCard(title, date));
