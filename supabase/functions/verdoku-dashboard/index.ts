// Private aggregate dashboard API. Raw analytics rows never leave Postgres;
// this function exposes one precomputed JSON snapshot behind a shared secret.
//
// RATE LIMITING RUNS BEFORE AUTH, DELIBERATELY, and it has to actually bind. The
// only credential here is DASHBOARD_ACCESS_TOKEN — a real secret, unlike the
// publishable key the app-facing functions carry — so unauthenticated guesses are
// the threat, and a limiter placed AFTER the auth check would throttle nothing
// that matters. constantTimeEqual defeats timing attacks and does nothing at all
// against volume.
//
// That made the original keying a live hole: it read the FIRST X-Forwarded-For
// hop, which is whatever the caller wrote (proxies append to XFF rather than
// replacing it), so varying one header gave unlimited unthrottled attempts at
// brute-forcing the token. The 10k overflow also called requestWindows.clear(),
// letting anyone able to grow the map reset every other caller's window.
//
// What the limiter below is and is not: it bounds attempt VOLUME. It is
// per-isolate and Supabase runs several, so it is best-effort abuse control, not
// a cryptographic control. The token's entropy is what actually protects this
// endpoint — keep DASHBOARD_ACCESS_TOKEN long and random, and rotate it if it
// ever was not.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const ALLOWED_ORIGINS = new Set([
	"https://aljrico.com",
	"http://localhost:4321",
	"http://127.0.0.1:4321",
]);
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 30;
// Backstop for a spray of forged client addresses, which per-key limiting cannot
// see. Legitimate traffic here is one person refreshing a private dashboard, so
// this is orders of magnitude above any real burst while still capping how many
// guesses an isolate will serve per minute.
const MAX_REQUESTS_PER_WINDOW_GLOBAL = 300;
const MAX_TRACKED_KEYS = 10_000;
const requestWindows = new Map<string, { startedAt: number; count: number }>();
let globalWindow = { startedAt: 0, count: 0 };

function corsHeaders(origin: string | null): Record<string, string> {
	const allowedOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://aljrico.com";
	return {
		"access-control-allow-origin": allowedOrigin,
		"access-control-allow-headers": "authorization, content-type",
		"access-control-allow-methods": "GET, OPTIONS",
		"access-control-max-age": "86400",
		vary: "Origin",
	};
}

function json(body: unknown, status: number, origin: string | null): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			...corsHeaders(origin),
			"content-type": "application/json; charset=utf-8",
			"cache-control": "private, no-store, max-age=0",
			"referrer-policy": "no-referrer",
			"x-content-type-options": "nosniff",
		},
	});
}

function constantTimeEqual(left: string, right: string): boolean {
	const encoder = new TextEncoder();
	const a = encoder.encode(left);
	const b = encoder.encode(right);
	const length = Math.max(a.length, b.length);
	let diff = a.length ^ b.length;
	for (let index = 0; index < length; index++) {
		diff |= (a[index] ?? 0) ^ (b[index] ?? 0);
	}
	return diff === 0;
}

// `cf-connecting-ip` FIRST, because it is the only value here the client cannot
// choose: the edge sets it. X-Forwarded-For is APPENDED to by each proxy rather
// than replaced, so its first hop is caller-controlled; when we must fall back to
// XFF we take the LAST hop, the one written by the proxy closest to us.
function clientKey(req: Request): string {
	const edgeIp = req.headers.get("cf-connecting-ip")?.trim();
	if (edgeIp) return edgeIp;

	const forwarded = req.headers.get("x-forwarded-for");
	if (forwarded) {
		const hops = forwarded
			.split(",")
			.map((hop) => hop.trim())
			.filter((hop) => hop.length > 0);
		if (hops.length > 0) return hops[hops.length - 1];
	}
	return "unknown";
}

// Drop windows that have already expired, instead of clearing the whole table.
function pruneExpiredWindows(now: number): void {
	for (const [key, window] of requestWindows) {
		if (now - window.startedAt >= WINDOW_MS) requestWindows.delete(key);
	}
}

function isKeyRateLimited(key: string, now: number): boolean {
	const current = requestWindows.get(key);

	if (!current || now - current.startedAt >= WINDOW_MS) {
		if (requestWindows.size >= MAX_TRACKED_KEYS) pruneExpiredWindows(now);
		// Still full after pruning means live windows have filled the table, i.e. a
		// forged-address spray. Stop tracking new keys rather than evicting real
		// ones; such requests are then unmetered per-key and fall to the global cap.
		if (requestWindows.size < MAX_TRACKED_KEYS) {
			requestWindows.set(key, { startedAt: now, count: 1 });
		}
		return false;
	}

	current.count += 1;
	return current.count > MAX_REQUESTS_PER_WINDOW;
}

function isRateLimited(req: Request): boolean {
	const now = Date.now();

	// Per-key first; the global counter only sees requests that got past it. The
	// other order would let one caller spend the shared budget and 429 every
	// legitimate caller on this isolate — a lockout, not a rate limit.
	if (isKeyRateLimited(clientKey(req), now)) return true;

	if (now - globalWindow.startedAt >= WINDOW_MS) {
		globalWindow = { startedAt: now, count: 1 };
		return false;
	}
	globalWindow.count += 1;
	return globalWindow.count > MAX_REQUESTS_PER_WINDOW_GLOBAL;
}

Deno.serve(async (req) => {
	const origin = req.headers.get("origin");

	if (req.method === "OPTIONS") {
		if (origin && !ALLOWED_ORIGINS.has(origin)) {
			return json({ error: "origin not allowed" }, 403, origin);
		}
		return new Response(null, { status: 204, headers: corsHeaders(origin) });
	}
	if (req.method !== "GET") {
		return json({ error: "method not allowed" }, 405, origin);
	}
	if (origin && !ALLOWED_ORIGINS.has(origin)) {
		return json({ error: "origin not allowed" }, 403, origin);
	}
	if (isRateLimited(req)) {
		return json({ error: "too many requests" }, 429, origin);
	}

	const expectedToken = Deno.env.get("DASHBOARD_ACCESS_TOKEN");
	const suppliedToken = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
	if (!expectedToken || !constantTimeEqual(suppliedToken, expectedToken)) {
		return json({ error: "unauthorized" }, 401, origin);
	}

	const supabaseUrl = Deno.env.get("SUPABASE_URL");
	const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
	if (!supabaseUrl || !serviceKey) {
		return json({ error: "server not configured" }, 500, origin);
	}

	const client = createClient(supabaseUrl, serviceKey, {
		auth: { persistSession: false, autoRefreshToken: false },
	});
	const url = new URL(req.url);
	const view = url.searchParams.get("view");
	const isAsoView = view === "aso";
	const isExperimentView = view === "experiments";
	const country = (
		url.searchParams.get("country") ?? (isExperimentView ? "ALL" : "US")
	).toUpperCase();
	const keyword = (url.searchParams.get("keyword") ?? "sudoku").trim().toLowerCase();
	const experiment = (url.searchParams.get("experiment") ?? "hint_offer_choice")
		.trim()
		.toLowerCase();
	const platform = (url.searchParams.get("platform") ?? "all").trim().toLowerCase();
	if (isAsoView && (!/^[A-Z]{2}$/.test(country) || !keyword || keyword.length > 100)) {
		return json({ error: "invalid ASO selection" }, 400, origin);
	}
	if (
		isExperimentView &&
		(!/^[a-z][a-z0-9_]{0,79}$/.test(experiment) ||
			!["all", "ios", "android"].includes(platform) ||
			(country !== "ALL" && !/^[A-Z]{2}$/.test(country)))
	) {
		return json({ error: "invalid experiment selection" }, 400, origin);
	}

	const { data, error } = isAsoView
		? await client.rpc("get_verdoku_aso_dashboard", {
				p_country: country,
				p_keyword: keyword,
		  })
		: isExperimentView
		? await client.rpc("get_verdoku_experiment_dashboard", {
				p_experiment_key: experiment,
				p_platform: platform === "all" ? null : platform,
				p_country: country === "ALL" ? null : country,
		  })
		: await client.rpc("get_verdoku_dashboard_snapshot");
	if (error || !data) {
		console.error(
			isAsoView
				? "ASO dashboard read failed"
				: isExperimentView
				? "experiment dashboard read failed"
				: "dashboard snapshot read failed",
			error?.message ?? "empty snapshot",
		);
		return json({ error: "snapshot unavailable" }, 503, origin);
	}

	if (!isAsoView && !isExperimentView) {
		const breakdownResult = await client.rpc("get_verdoku_dashboard_case_breakdowns");
		if (breakdownResult.error || !breakdownResult.data) {
			console.error(
				"case breakdown read failed",
				breakdownResult.error?.message ?? "empty breakdown",
			);
			return json({ error: "snapshot unavailable" }, 503, origin);
		}
		data.case_breakdowns = breakdownResult.data;
	}

	if (isExperimentView) {
		const params = {
			p_experiment_key: experiment,
			p_platform: platform === "all" ? null : platform,
			p_country: country === "ALL" ? null : country,
		};
		const [metricsResult, assignmentsResult] = await Promise.all([
			client.rpc("get_verdoku_experiment_metrics", params),
			client.rpc("get_verdoku_experiment_assignment_total", params),
		]);
		if (metricsResult.error || !metricsResult.data) {
			console.error(
				"experiment metrics read failed",
				metricsResult.error?.message ?? "empty metrics",
			);
			return json({ error: "snapshot unavailable" }, 503, origin);
		}
		if (assignmentsResult.error || assignmentsResult.data == null) {
			console.error(
				"experiment assignment total read failed",
				assignmentsResult.error?.message ?? "empty assignment total",
			);
			return json({ error: "snapshot unavailable" }, 503, origin);
		}
		data.metrics = metricsResult.data.metrics;
		data.maturity = metricsResult.data.maturity;
		data.assigned_total = Number(assignmentsResult.data);
	}

	return json(data, 200, origin);
});
