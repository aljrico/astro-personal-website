// Shared access for the private /stats dashboards. Both pages talk to the same
// Supabase function and share one access key.
export const ENDPOINT = "https://lbitxwhhrohcjkbpbcrv.supabase.co/functions/v1/verdoku-dashboard";
// verdoku.astro repeats this literal in its pre-paint <head> check, which runs
// before modules load and so cannot import it.
export const TOKEN_KEY = "verdoku-dashboard-key";

export function storedToken() {
	try {
		return localStorage.getItem(TOKEN_KEY) ?? "";
	} catch {
		return "";
	}
}

export function storeToken(token) {
	try {
		localStorage.setItem(TOKEN_KEY, token);
	} catch {}
}

export function forgetToken() {
	try {
		localStorage.removeItem(TOKEN_KEY);
	} catch {}
}

// The access key used to live permanently in location.hash, which leaks it
// into browser history, screenshots and screen shares. Private links still
// work, but the hash is consumed once and stripped; the key lives in
// localStorage from then on.
export function consumeTokenFromHash() {
	let fromHash = "";
	try {
		fromHash = decodeURIComponent(location.hash.slice(1)).trim();
	} catch {}
	if (!fromHash) return "";
	history.replaceState(null, "", location.pathname + location.search);
	storeToken(fromHash);
	return fromHash;
}

// Authorized GET against the dashboard function. `params` become the query
// string; `init` is passed through to fetch (cache mode, abort signal).
export function fetchView(token, params = {}, init = {}) {
	const url = new URL(ENDPOINT);
	for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
	return fetch(url, { ...init, headers: { Authorization: `Bearer ${token}` } });
}
