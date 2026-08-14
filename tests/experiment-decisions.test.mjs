import assert from "node:assert/strict";
import test from "node:test";

import { evaluateExperimentDecision } from "../public/scripts/experiment-decisions.js";

const policy = {
	advisory: true,
	final: {
		metric: "d14_ltv",
		horizon: "d14",
		loss_threshold: 0.002,
		minimum_mature_per_arm: 1500,
	},
	early: {
		metric: "d7_ltv",
		horizon: "d7",
		loss_threshold: 0.001,
		minimum_mature_per_arm: 1500,
	},
	guardrails: [
		{
			metric: "d7_retention",
			direction: "higher",
			maximum_harm: 1.5,
			block_probability: 0.9,
			minimum_mature_per_arm: 1500,
		},
	],
};

function metric(metric, { n = 2000, treatmentLoss = 0, controlLoss = 0.01, draws = [1] } = {}) {
	return {
		metric,
		arms: [
			{ arm: "control", n },
			{ arm: "treatment", n },
		],
		effect: {
			expected_loss_treatment: treatmentLoss,
			expected_loss_control: controlLoss,
		},
		posterior: { difference_draws: draws },
	};
}

test("D14 takes precedence once its cohorts mature", () => {
	const result = evaluateExperimentDecision(
		[
			metric("d7_ltv"),
			metric("d14_ltv", { treatmentLoss: 0.003, controlLoss: 0.001 }),
			metric("d7_retention"),
		],
		policy,
	);
	assert.equal(result.state, "keep_control");
	assert.equal(result.timing, "final");
	assert.equal(result.metric, "d14_ltv");
	assert.equal(result.advisory, true);
});

test("D7 can make an early recommendation while D14 is immature", () => {
	const result = evaluateExperimentDecision(
		[metric("d7_ltv"), metric("d14_ltv", { n: 500 }), metric("d7_retention")],
		policy,
	);
	assert.equal(result.state, "ship_treatment");
	assert.equal(result.timing, "early");
});

test("both choices below the loss threshold are a practical tie", () => {
	const result = evaluateExperimentDecision(
		[metric("d14_ltv", { treatmentLoss: 0.001, controlLoss: 0.001 }), metric("d7_retention")],
		policy,
	);
	assert.equal(result.state, "practical_tie");
});

test("retention harm blocks an otherwise favorable treatment", () => {
	const result = evaluateExperimentDecision(
		[
			metric("d14_ltv"),
			metric("d7_retention", { draws: Array(95).fill(-2).concat(Array(5).fill(0)) }),
		],
		policy,
	);
	assert.equal(result.state, "guardrail_blocked");
	assert.equal(result.blocked_by.metric, "d7_retention");
});

test("too few mature users stays explicitly pending", () => {
	const result = evaluateExperimentDecision(
		[metric("d7_ltv", { n: 1499 }), metric("d14_ltv", { n: 400 })],
		policy,
	);
	assert.equal(result.state, "insufficient_data");
});
