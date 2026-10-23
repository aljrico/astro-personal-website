import { siteConfig } from "@/site-config";

const dateFormat = new Intl.DateTimeFormat(siteConfig.date.locale, siteConfig.date.options);

export function getFormattedDate(
	date: string | number | Date,
	options?: Intl.DateTimeFormatOptions
) {
	if (typeof options !== "undefined") {
		return new Date(date).toLocaleDateString(siteConfig.date.locale, {
			...(siteConfig.date.options as Intl.DateTimeFormatOptions),
			...options,
		});
	}

	return dateFormat.format(new Date(date));
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "May 2026": the short date used in list rows. */
export function monthYear(date: Date) {
	return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * A period string as a year range: "2026-present" (or "2026-now") is 2026 to now, "Feb-Oct 2022"
 * is 2022 alone, "2020-2024" stays as is. Ongoing periods drive the accent and shimmer.
 */
export function yearRange(period: string) {
	const years = period.match(/\d{4}/g) ?? [];
	const start = years[0] ?? "";
	const ongoing = /present|now/i.test(period);
	const end = ongoing ? "now" : years.at(-1);
	return { start, end: end && end !== start ? end : undefined, ongoing };
}
