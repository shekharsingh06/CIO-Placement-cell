import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-Cg5JfY7-.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function extractSpreadsheetId(input) {
	const trimmed = input.trim();
	if (!trimmed) return null;
	const fromUrl = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
	if (fromUrl?.[1]) return fromUrl[1];
	if (/^[a-zA-Z0-9-_]{20,}$/.test(trimmed)) return trimmed;
	return null;
}
function slugify(value) {
	return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "company";
}
function formatPct(value) {
	if (value == null || Number.isNaN(value)) return "—";
	return `${Math.round(value * 10) / 10}%`;
}
function formatInt(value) {
	return new Intl.NumberFormat("en-IN").format(value);
}
//#endregion
export { slugify as a, formatPct as i, extractSpreadsheetId as n, formatInt as r, cn as t };
