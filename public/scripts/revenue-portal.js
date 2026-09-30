const day = (date) => date.toISOString().slice(0, 10);
const shifted = (date, days) => new Date(Date.parse(date + "T00:00:00Z") + days * 86400000);
export function ranges(preset, now = new Date(), custom = {}) {
	const to = custom.to || day(new Date(now.getTime() - 86400000));
	const from =
		custom.from ||
		(preset === "mtd" ? to.slice(0, 7) + "-01" : day(shifted(to, 1 - Number(preset))));
	const length = Math.round((Date.parse(to) - Date.parse(from)) / 86400000) + 1;
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
export function summarize(data, from, to, platform = "all", provider = "all") {
	const reports = data.reports.filter(
		(r) =>
			r.period_start >= from &&
			r.period_start <= to &&
			(provider === "all" || r.provider === provider),
	);
	const included = data.totals.filter(
		(r) =>
			r.period_start >= from &&
			r.period_start <= to &&
			(platform === "all" || r.platform === platform) &&
			(provider === "all" || r.provider === provider),
	);
	const rows = data.projects
		.map((project) => {
			const values = included.filter((r) => r.project_id === project.id);
			const sum = (source) =>
				values
					.filter((r) => r.provider === source && r.amount_eur !== null)
					.reduce((total, r) => total + Number(r.amount_eur), 0);
			const appleKnown =
				reports.some((r) => r.provider === "apple") &&
				platform !== "android" &&
				provider !== "admob";
			const adsKnown = reports.some((r) => r.provider === "admob") && provider !== "apple";
			const androidKnown =
				platform !== "ios" &&
				reports.some((r) => r.provider === "revenuecat" && r.project_ids?.includes(project.id));
			const unconverted = values.filter((r) => r.amount_eur === null && Number(r.amount) !== 0);
			return {
				...project,
				apple: appleKnown ? sum("apple") : null,
				android: androidKnown ? sum("revenuecat") : null,
				purchases: appleKnown || androidKnown ? sum("apple") + sum("revenuecat") : null,
				ads: adsKnown ? sum("admob") : null,
				total: sum("apple") + sum("admob") + sum("revenuecat"),
				hasData: appleKnown || androidKnown || adsKnown,
				unconverted,
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
