function metricByKey(metrics, key) {
	return (metrics ?? []).find((metric) => metric.metric === key);
}

function matureEnough(metric, minimum) {
	return Boolean(metric?.arms?.length === 2 && metric.arms.every((arm) => arm.n >= minimum));
}

function recommendationFor(metric, lossThreshold) {
	const treatmentLoss = Number(metric.effect.expected_loss_treatment);
	const controlLoss = Number(metric.effect.expected_loss_control);
	const treatmentSafe = treatmentLoss <= lossThreshold;
	const controlSafe = controlLoss <= lossThreshold;
	if (treatmentSafe && controlSafe) return "practical_tie";
	if (treatmentSafe) return "ship_treatment";
	if (controlSafe) return "keep_control";
	return "keep_running";
}

function guardrailFailure(metrics, guardrail) {
	const metric = metricByKey(metrics, guardrail.metric);
	const minimum = Number(guardrail.minimum_mature_per_arm ?? 0);
	if (!matureEnough(metric, minimum)) return null;
	const draws = metric.posterior?.difference_draws ?? [];
	if (!draws.length) return null;
	const maximumHarm = Number(guardrail.maximum_harm);
	const harmful =
		guardrail.direction === "lower"
			? draws.filter((difference) => difference > maximumHarm).length
			: draws.filter((difference) => difference < -maximumHarm).length;
	const probability = harmful / draws.length;
	return probability >= Number(guardrail.block_probability)
		? { metric: guardrail.metric, probability, maximum_harm: maximumHarm }
		: null;
}

export function evaluateExperimentDecision(metrics, policy) {
	if (!policy?.advisory) {
		return { state: "insufficient_data", reason: "Decision policy pending", advisory: true };
	}

	const finalPolicy = policy.final;
	const earlyPolicy = policy.early;
	const finalMetric = metricByKey(metrics, finalPolicy?.metric);
	const earlyMetric = metricByKey(metrics, earlyPolicy?.metric);
	let selectedPolicy;
	let selectedMetric;
	let timing;
	if (finalPolicy && matureEnough(finalMetric, Number(finalPolicy.minimum_mature_per_arm))) {
		selectedPolicy = finalPolicy;
		selectedMetric = finalMetric;
		timing = "final";
	} else if (earlyPolicy && matureEnough(earlyMetric, Number(earlyPolicy.minimum_mature_per_arm))) {
		selectedPolicy = earlyPolicy;
		selectedMetric = earlyMetric;
		timing = "early";
	} else {
		return {
			state: "insufficient_data",
			reason: `Waiting for ${finalPolicy?.horizon?.toUpperCase() ?? "mature"} cohorts`,
			advisory: true,
		};
	}

	let state = recommendationFor(selectedMetric, Number(selectedPolicy.loss_threshold));
	let blockedBy = null;
	if (state === "ship_treatment" || state === "practical_tie") {
		blockedBy = (policy.guardrails ?? [])
			.map((guardrail) => guardrailFailure(metrics, guardrail))
			.find(Boolean);
		if (blockedBy) state = "guardrail_blocked";
	}

	return {
		state,
		timing,
		metric: selectedMetric.metric,
		horizon: selectedPolicy.horizon,
		loss_threshold: Number(selectedPolicy.loss_threshold),
		blocked_by: blockedBy,
		advisory: true,
	};
}
