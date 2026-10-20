export const day = (date) => date.toISOString().slice(0, 10);
export const shifted = (date, days) => new Date(Date.parse(date + "T00:00:00Z") + days * 86400000);
export const daysInclusive = (from, to) => Math.round((Date.parse(to) - Date.parse(from)) / 86400000) + 1;
export const yesterday = (now = new Date()) => day(new Date(now.getTime() - 86400000));
const PROVIDERS = ["apple", "admob", "revenuecat"];
export function appendCurrentMonth(monthly, daily, to) {
	const start = to.slice(0, 7) + "-01";
	const bucket = (row) => ({ ...row, period_start: start, period_end: to, grain: "month" });
	monthly.totals.push(...daily.totals.map(bucket));
	for (const provider of new Set(daily.reports.map((row) => row.provider))) {
		const reports = daily.reports.filter((row) => row.provider === provider);
		if (new Set(reports.map((row) => row.period_start)).size === Number(to.slice(8)))
			monthly.reports.push(bucket(reports[0]));
	}
	return monthly;
}
export function ranges(preset, now = new Date(), custom = {}) {
	const to = custom.to || yesterday(now);
	const from =
		custom.from ||
		(preset === "mtd" ? to.slice(0, 7) + "-01" : day(shifted(to, 1 - Number(preset))));
	const length = daysInclusive(from, to);
	if (!Number.isFinite(length) || length < 1 || length > 366)
		throw new Error("Choose a range of 1–366 days.");
	let priorTo = day(shifted(from, -1)),
		priorFrom = day(shifted(from, -length));
	if (preset === "mtd") {
		priorFrom = priorTo.slice(0, 7) + "-01";
		priorTo = day(shifted(priorFrom, Math.min(length, Number(priorTo.slice(8))) - 1));
	}
	return { from, to, priorFrom, priorTo };
}
// Imported report count per provider against the periods the range should contain.
export function coverage(data, from, to, grain, provider, platform) {
	const expected =
		grain === "month"
			? new Date(to + "T00:00:00Z").getUTCMonth() -
			  new Date(from + "T00:00:00Z").getUTCMonth() +
			  12 * (Number(to.slice(0, 4)) - Number(from.slice(0, 4))) +
			  1
			: daysInclusive(from, to);
	const providers = (provider === "all" ? PROVIDERS : [provider]).filter(
		(source) =>
			(source !== "apple" || platform !== "android") &&
			(source !== "revenuecat" || platform !== "ios"),
	);
	return providers.map((source) => ({
		source,
		count: data.reports.filter(
			(r) => r.provider === source && r.period_start >= from && r.period_start <= to,
		).length,
		expected,
	}));
}
export function summarize(data, from, to, platform = "all", provider = "all") {
	const inRange = (r) => r.period_start >= from && r.period_start <= to;
	const reports = data.reports.filter(
		(r) => inRange(r) && (provider === "all" || r.provider === provider),
	);
	const included = data.totals.filter(
		(r) =>
			inRange(r) &&
			(platform === "all" || r.platform === platform) &&
			(provider === "all" || r.provider === provider),
	);
	// Report coverage is per provider (and per project for Apple and RevenueCat).
	const appleReports = reports.filter((r) => r.provider === "apple");
	const appleCoversAll = appleReports.some((r) => !r.project_ids);
	const appleProjects = new Set(appleReports.flatMap((r) => r.project_ids ?? []));
	const androidProjects = new Set(
		reports.filter((r) => r.provider === "revenuecat").flatMap((r) => r.project_ids ?? []),
	);
	const adsKnown = reports.some((r) => r.provider === "admob") && provider !== "apple";
	const byProject = new Map();
	for (const r of included) {
		let entry = byProject.get(r.project_id);
		if (!entry) {
			entry = { apple: 0, admob: 0, revenuecat: 0, unconverted: [] };
			byProject.set(r.project_id, entry);
		}
		if (r.amount_eur === null) {
			if (Number(r.amount) !== 0) entry.unconverted.push(r);
		} else if (PROVIDERS.includes(r.provider)) entry[r.provider] += Number(r.amount_eur);
	}
	const rows = data.projects
		.map((project) => {
			const sums = byProject.get(project.id) ?? { apple: 0, admob: 0, revenuecat: 0, unconverted: [] };
			const appleKnown =
				(appleCoversAll || appleProjects.has(project.id)) &&
				platform !== "android" &&
				provider !== "admob";
			const androidKnown = platform !== "ios" && androidProjects.has(project.id);
			return {
				...project,
				apple: appleKnown ? sums.apple : null,
				android: androidKnown ? sums.revenuecat : null,
				purchases: appleKnown || androidKnown ? sums.apple + sums.revenuecat : null,
				ads: adsKnown ? sums.admob : null,
				total: sums.apple + sums.admob + sums.revenuecat,
				hasData: appleKnown || androidKnown || adsKnown,
				unconverted: sums.unconverted,
			};
		})
		.sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
	return {
		rows,
		reports,
		included,
		total: rows.reduce((sum, row) => sum + row.total, 0),
		unconverted: rows.flatMap((r) => r.unconverted),
	};
}
