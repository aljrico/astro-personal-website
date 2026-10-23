import type { APIContext, GetStaticPaths } from "astro";
import { getEntryBySlug } from "astro:content";
import { siteConfig } from "@/site-config";
import { getAllPosts, getFormattedDate } from "@/utils";
import { postCardResponse } from "../../utils/og-card";

export async function GET({ params: { slug } }: APIContext) {
	const post = await getEntryBySlug("post", slug!);
	const title = post?.data.title ?? siteConfig.title;
	const date = getFormattedDate(post?.data.updatedDate ?? post?.data.publishDate ?? Date.now());
	return postCardResponse(title, date);
}

export const getStaticPaths: GetStaticPaths = async () => {
	const posts = await getAllPosts();
	return posts.filter(({ data }) => !data.ogImage).map(({ slug }) => ({ params: { slug } }));
};
