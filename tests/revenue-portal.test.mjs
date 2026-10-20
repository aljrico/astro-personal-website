import assert from "node:assert/strict";
import test from "node:test";

import { ranges, summarize, appendCurrentMonth } from "../public/scripts/revenue-portal.js";

const appleRow = (amount, amount_eur) => ({
	project_id: "a",
	provider: "apple",
	platform: "ios",
	period_start: "2026-09-01",
	amount,
	amount_eur,
});

function appleOnly() {
	return {
		projects: [{ id: "a", name: "A" }],
		reports: [{ provider: "apple", period_start: "2026-09-01" }],
		totals: [appleRow("10", 10), appleRow("-2", -2), appleRow("3", null)],
	};
}

function withAndroid() {
	const data = appleOnly();
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
	return data;
}

test("current month is appended only for providers with complete daily coverage", () => {
	const history = appendCurrentMonth(
		{ reports: [], totals: [] },
		{
			reports: [
				{ provider: "apple", period_start: "2026-09-01" },
				{ provider: "apple", period_start: "2026-09-02" },
				{ provider: "admob", period_start: "2026-09-01" },
			],
			totals: [
				{ provider: "apple", period_start: "2026-09-01", amount_eur: "5" },
				{ provider: "apple", period_start: "2026-09-02", amount_eur: "-1" },
			],
		},
		"2026-09-02",
	);
	assert.equal(history.reports.length, 1); // Incomplete AdMob coverage stays missing.
	assert.equal(history.reports[0].period_start, "2026-09-01");
	assert.equal(history.totals.reduce((sum, row) => sum + Number(row.amount_eur), 0), 4);
});

test("Apple reports scoped to other projects do not count as coverage", () => {
	const result = summarize(
		{
			projects: [{ id: "other", name: "Other" }],
			reports: [{ provider: "apple", period_start: "2025-04-01", project_ids: ["cookie-empire"] }],
			totals: [],
		},
		"2025-04-01",
		"2025-04-30",
	);
	assert.equal(result.rows[0].apple, null);
});

test("period comparisons line up for month-to-date and rolling presets", () => {
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
});

test("refunds net out and unconverted currencies stay separate", () => {
	const data = appleOnly();
	const result = summarize(data, "2026-09-01", "2026-09-29");
	assert.equal(result.total, 8);
	assert.equal(result.rows[0].ads, null);
	assert.equal(result.unconverted.length, 1);
	assert.equal(summarize(data, "2026-08-01", "2026-08-29").rows[0].hasData, false);
	assert.equal(summarize(data, "2026-09-01", "2026-09-29", "android").rows[0].apple, null);
});

test("platform and provider filters include RevenueCat Android proceeds", () => {
	const data = withAndroid();
	assert.equal(summarize(data, "2026-09-01", "2026-09-29").total, 13);
	assert.equal(summarize(data, "2026-09-01", "2026-09-29", "ios").total, 8);
	const android = summarize(data, "2026-09-01", "2026-09-29", "android", "revenuecat");
	assert.equal(android.total, 5);
	assert.equal(android.rows.find((p) => p.id === "unconnected").purchases, null);
});
