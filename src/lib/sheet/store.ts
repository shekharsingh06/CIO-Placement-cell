const URL_KEY = "session-board.sheetUrl";
const HIDDEN_KEY = "session-board.hiddenCompanies";

export function readStoredSheetUrl(fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return window.localStorage.getItem(URL_KEY) || fallback;
}

export function writeStoredSheetUrl(url: string) {
  window.localStorage.setItem(URL_KEY, url);
}

export function readHiddenCompanies(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HIDDEN_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function writeHiddenCompanies(names: string[]) {
  window.localStorage.setItem(HIDDEN_KEY, JSON.stringify(names));
}
