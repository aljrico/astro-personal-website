import assert from "node:assert/strict";
import test from "node:test";

import { summarizeBayesianMetrics } from "../public/scripts/bayesian-experiments.js";

test("beta-binomial retention is deterministic and favors the stronger arm", () => {
	const inputs = [
		{
			metric: "d1_retention",
			label: "D1 retention",
			unit: "percent",
			horizon: "d1",
			arm: "control",
			n: 100,
			successes: 50,
			buckets: [],
		},
		{
			metric: "d1_retention",
			label: "D1 retention",
			unit: "percent",
			horizon: "d1",
			arm: "treatment",
			n: 100,
			successes: 65,
			buckets: [],
		},
	];
	const options = { controlArm: "control", treatmentArm: "treatment", draws: 4000, seed: "fixed" };
	const first = summarizeBayesianMetrics(inputs, options);
	const second = summarizeBayesianMetrics(inputs, options);

	assert.deepEqual(first, second);
	assert.equal(first.length, 1);
	assert.ok(first[0].effect.probability_better > 0.97);
	assert.ok(first[0].effect.ci_low > 0);
	assert.ok(first[0].arms[0].ci_low < first[0].arms[0].value);
	assert.ok(first[0].arms[0].value < first[0].arms[0].ci_high);
});

test("grouped Bayesian bootstrap preserves degenerate arm means", () => {
	const inputs = [
		{
			metric: "d7_ltv",
			label: "D7 LTV",
			unit: "usd",
			horizon: "d7",
			arm: "control",
			n: 100,
			successes: null,
			buckets: [[100, 1]],
		},
		{
			metric: "d7_ltv",
			label: "D7 LTV",
			unit: "usd",
			horizon: "d7",
			arm: "treatment",
			n: 100,
			successes: null,
			buckets: [[100, 1.2]],
		},
	];
	const [summary] = summarizeBayesianMetrics(inputs, {
		controlArm: "control",
		treatmentArm: "treatment",
		draws: 500,
		seed: "ltv",
	});

	assert.equal(summary.arms[0].value, 1);
	assert.equal(summary.arms[1].value, 1.2);
	assert.ok(Math.abs(summary.effect.value - 0.2) < 1e-12);
	assert.equal(summary.effect.probability_better, 1);
});

test("continuous posterior stays inside the observed grouped support", () => {
	const inputs = [
		{
			metric: "d1_ltv",
			label: "D1 LTV",
			unit: "usd",
			horizon: "d1",
			arm: "control",
			n: 10,
			buckets: [
				[9, 0],
				[1, 1],
			],
		},
		{
			metric: "d1_ltv",
			label: "D1 LTV",
			unit: "usd",
			horizon: "d1",
			arm: "treatment",
			n: 10,
			buckets: [
				[8, 0],
				[2, 1],
			],
		},
	];
	const [summary] = summarizeBayesianMetrics(inputs, {
		controlArm: "control",
		treatmentArm: "treatment",
		draws: 4000,
		seed: "bounded",
	});

	for (const arm of summary.arms) {
		assert.ok(arm.ci_low >= 0);
		assert.ok(arm.ci_high <= 1);
	}
});

test("metrics missing either arm stay pending", () => {
	const summaries = summarizeBayesianMetrics(
		[
			{
				metric: "d0_ltv",
				label: "D0 LTV",
				unit: "usd",
				horizon: "d0",
				arm: "control",
				n: 10,
				buckets: [[10, 0]],
			},
		],
		{ controlArm: "control", treatmentArm: "treatment" },
	);
	assert.deepEqual(summaries, []);
});
