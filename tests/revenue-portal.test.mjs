import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const { ranges, summarize } = await import(
	"data:text/javascript;base64," +
		readFileSync(new URL("../public/scripts/revenue-portal.js", import.meta.url)).toString("base64")
);
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
console.log(
	"Revenue portal: refunds, missing sources, period comparisons and platform filters passed.",
);
