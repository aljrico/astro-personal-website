import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const { ranges, summarize, appendCurrentMonth } = await import(
	"data:text/javascript;base64," +
		readFileSync(new URL("../public/scripts/revenue-portal.js", import.meta.url)).toString("base64")
);
const history = appendCurrentMonth({ reports: [], totals: [] }, {
	reports: [{ provider: "apple", period_start: "2026-09-01" },
		{ provider: "apple", period_start: "2026-09-02" },
		{ provider: "admob", period_start: "2026-09-01" }],
	totals: [{ provider: "apple", period_start: "2026-09-01", amount_eur: "5" },
		{ provider: "apple", period_start: "2026-09-02", amount_eur: "-1" }],
}, "2026-09-02");
assert.equal(history.reports.length, 1); // Incomplete AdMob coverage stays missing.
assert.equal(history.reports[0].period_start, "2026-09-01");
assert.equal(history.totals.reduce((sum, row) => sum + Number(row.amount_eur), 0), 4);
assert.deepEqual(ranges("mtd", new Date("2026-09-30T12:00:00Z")), {
	from: "2026-09-01",
	to: "2026-09-29",
	priorFrom: "2026-08-01",
	priorTo: "2026-08-29",
});
assert.deepEqual(ranges("7", new Date("2026-09-30T12:00:00Z")), {
	from: "2026-09-23",
	to: "2026-09-29",
	priorFrom: "2026-09-16",
	priorTo: "2026-09-22",
});
const data = {
	projects: [{ id: "a", name: "A" }],
	reports: [{ provider: "apple", period_start: "2026-09-01" }],
	totals: [
		{
			project_id: "a",
			provider: "apple",
			platform: "ios",
			period_start: "2026-09-01",
			amount: "10",
			amount_eur: 10,
		},
		{
			project_id: "a",
			provider: "apple",
			platform: "ios",
			period_start: "2026-09-01",
			amount: "-2",
			amount_eur: -2,
		},
		{
			project_id: "a",
			provider: "apple",
			platform: "ios",
			period_start: "2026-09-01",
			amount: "3",
			amount_eur: null,
		},
	],
};
const result = summarize(data, "2026-09-01", "2026-09-29");
assert.equal(result.total, 8);
assert.equal(result.rows[0].ads, null);
assert.equal(result.unconverted.length, 1);
assert.equal(summarize(data, "2026-08-01", "2026-08-29").rows[0].hasData, false);
assert.equal(summarize(data, "2026-09-01", "2026-09-29", "android").rows[0].apple, null);
data.projects.push({ id: "unconnected", name: "Unconnected" });
data.reports.push({ provider: "revenuecat", period_start: "2026-09-01", project_ids: ["a"] });
data.totals.push({
	project_id: "a",
	provider: "revenuecat",
	platform: "android",
	period_start: "2026-09-01",
	amount: "5",
	amount_eur: 5,
});
assert.equal(summarize(data, "2026-09-01", "2026-09-29").total, 13);
assert.equal(summarize(data, "2026-09-01", "2026-09-29", "ios").total, 8);
const android = summarize(data, "2026-09-01", "2026-09-29", "android", "revenuecat");
assert.equal(android.total, 5);
assert.equal(android.rows.find((p) => p.id === "unconnected").purchases, null);
console.log(
	"Revenue portal: refunds, missing sources, period comparisons and platform filters passed.",
);
