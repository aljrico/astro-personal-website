import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

/** Note: this function filters out draft devlog entries based on the environment */
export async function getAllDevlogEntries() {
	return await getCollection("devlog", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
}

export function sortDevlogByDate(entries: Array<CollectionEntry<"devlog">>) {
	return entries.sort((a, b) => {
		const aDate = new Date(a.data.publishDate).valueOf();
		const bDate = new Date(b.data.publishDate).valueOf();
		return bDate - aDate;
	});
}
