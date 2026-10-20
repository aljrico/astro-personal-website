import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { isPublished } from "./post";

export async function getAllDevlogEntries() {
	return await getCollection("devlog", isPublished);
}

export function sortDevlogByDate(entries: Array<CollectionEntry<"devlog">>) {
	return entries.sort((a, b) => {
		const aDate = new Date(a.data.publishDate).valueOf();
		const bDate = new Date(b.data.publishDate).valueOf();
		return bDate - aDate;
	});
}
