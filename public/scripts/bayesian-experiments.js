function hashString(value) {
	let hash = 2166136261;
	for (let index = 0; index < value.length; index += 1) {
		hash ^= value.charCodeAt(index);
		hash = Math.imul(hash, 16777619);
	}
	return hash >>> 0;
}

function seededRandom(seed) {
	let state = seed || 0x6d2b79f5;
	return () => {
		state += 0x6d2b79f5;
		let value = state;
		value = Math.imul(value ^ (value >>> 15), value | 1);
		value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
		return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
	};
}

function normal(random) {
	const first = Math.max(random(), Number.EPSILON);
	return Math.sqrt(-2 * Math.log(first)) * Math.cos(2 * Math.PI * random());
}

// Marsaglia-Tsang. Histogram counts are positive integers, but supporting all
// positive shapes keeps the sampler independently useful and easy to test.
function gamma(shape, random) {
	if (!(shape > 0)) return 0;
	if (shape < 1) {
		return gamma(shape + 1, random) * Math.pow(Math.max(random(), Number.EPSILON), 1 / shape);
	}
	const d = shape - 1 / 3;
	const c = 1 / Math.sqrt(9 * d);
	while (true) {
		const x = normal(random);
		const v = Math.pow(1 + c * x, 3);
		if (v <= 0) continue;
		const u = random();
		if (u < 1 - 0.0331 * Math.pow(x, 4)) return d * v;
		if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
	}
}

function beta(alpha, betaShape, random) {
	const left = gamma(alpha, random);
	const right = gamma(betaShape, random);
	return left / (left + right);
}

function quantile(sorted, probability) {
	if (!sorted.length) return null;
	const position = (sorted.length - 1) * probability;
	const lower = Math.floor(position);
	const fraction = position - lower;
	return sorted[lower + 1] == null
		? sorted[lower]
		: sorted[lower] + fraction * (sorted[lower + 1] - sorted[lower]);
}

function interval(draws) {
	const sorted = [...draws].sort((left, right) => left - right);
	return [quantile(sorted, 0.025), quantile(sorted, 0.975)];
}

function continuousMean(row) {
	if (!row?.n) return null;
	return (
		row.buckets.reduce((sum, bucket) => sum + Number(bucket[0]) * Number(bucket[1]), 0) /
		Number(row.n)
	);
}

function posteriorDraws(row, draws, random) {
	if (row.unit === "percent") {
		const successes = Number(row.successes);
		const failures = Number(row.n) - successes;
		return Array.from({ length: draws }, () => 100 * beta(successes + 1, failures + 1, random));
	}
	// Direct grouped Bayesian bootstrap. Each stored atom is [count, exact mean]
	// for a narrow logarithmic bucket. Dirichlet(counts) weights preserve the
	// empirical zero mass and ugly revenue tail without imposing a Normal or
	// LogNormal likelihood on mixed ad + fixed-tier IAP revenue.
	const buckets = row.buckets
		.map(([count, mean]) => [Number(count), Number(mean)])
		.filter(([count, mean]) => count > 0 && Number.isFinite(mean));
	if (!buckets.length) return [];
	if (buckets.length === 1) return Array(draws).fill(buckets[0][1]);
	return Array.from({ length: draws }, () => {
		let totalWeight = 0;
		let weightedMean = 0;
		for (const [count, mean] of buckets) {
			const weight = gamma(count, random);
			totalWeight += weight;
			weightedMean += weight * mean;
		}
		return totalWeight > 0 ? weightedMean / totalWeight : continuousMean(row);
	});
}

function armCenter(row) {
	if (row.unit === "percent") {
		return (100 * (Number(row.successes) + 1)) / (Number(row.n) + 2);
	}
	return continuousMean(row);
}

export function summarizeBayesianMetrics(
	inputs,
	{ controlArm, treatmentArm, draws = 5000, seed = "experiment-dashboard" },
) {
	const random = seededRandom(hashString(String(seed)));
	const metrics = new Map();
	for (const row of inputs ?? []) {
		if (!metrics.has(row.metric)) metrics.set(row.metric, []);
		metrics.get(row.metric).push({
			...row,
			n: Number(row.n),
			successes: row.successes == null ? null : Number(row.successes),
			buckets: Array.isArray(row.buckets) ? row.buckets : [],
		});
	}

	const summaries = [];
	for (const [metric, rows] of metrics) {
		const control = rows.find((row) => row.arm === controlArm);
		const treatment = rows.find((row) => row.arm === treatmentArm);
		if (!control?.n || !treatment?.n) continue;

		const controlDraws = posteriorDraws(control, draws, random);
		const treatmentDraws = posteriorDraws(treatment, draws, random);
		if (!controlDraws.length || !treatmentDraws.length) continue;
		const differenceDraws = treatmentDraws.map((value, index) => value - controlDraws[index]);
		const relativeDraws = treatmentDraws
			.map((value, index) =>
				controlDraws[index] > 0 ? 100 * (value / controlDraws[index] - 1) : null,
			)
			.filter(Number.isFinite);
		const [controlLow, controlHigh] = interval(controlDraws);
		const [treatmentLow, treatmentHigh] = interval(treatmentDraws);
		const [differenceLow, differenceHigh] = interval(differenceDraws);
		const [relativeLow, relativeHigh] = interval(relativeDraws);
		const controlValue = armCenter(control);
		const treatmentValue = armCenter(treatment);

		summaries.push({
			metric,
			label: control.label,
			unit: control.unit,
			horizon: control.horizon,
			arms: [
				{
					arm: controlArm,
					n: control.n,
					value: controlValue,
					ci_low: controlLow,
					ci_high: controlHigh,
				},
				{
					arm: treatmentArm,
					n: treatment.n,
					value: treatmentValue,
					ci_low: treatmentLow,
					ci_high: treatmentHigh,
				},
			],
			effect: {
				value: treatmentValue - controlValue,
				ci_low: differenceLow,
				ci_high: differenceHigh,
				relative_pct: controlValue > 0 ? 100 * (treatmentValue / controlValue - 1) : null,
				relative_ci_low_pct: relativeLow,
				relative_ci_high_pct: relativeHigh,
				probability_better:
					differenceDraws.filter((value) => value > 0).length / differenceDraws.length,
				expected_loss_treatment:
					differenceDraws.reduce((sum, value) => sum + Math.max(-value, 0), 0) /
					differenceDraws.length,
				expected_loss_control:
					differenceDraws.reduce((sum, value) => sum + Math.max(value, 0), 0) /
					differenceDraws.length,
			},
			posterior: { difference_draws: differenceDraws },
		});
	}
	return summaries;
}
