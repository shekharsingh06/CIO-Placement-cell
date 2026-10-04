import * as XLSX from "xlsx";
import { buildDashboard, sheetsFromWorkbookAoA, type RawSheet } from "./parse";
import type { LoadSheetResult } from "./types";

const cache = new Map<string, { at: number; result: LoadSheetResult }>();
const TTL_MS = 45_000;

function parseGids(html: string): Record<string, string> {
  const map: Record<string, string> = {};
  const re =
    /name:\s*"((?:\\.|[^"\\])*)"\s*,\s*pageUrl:\s*"(?:\\.|[^"\\])*"\s*,\s*gid:\s*"(-?\d+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const name = m[1].replace(/\\"/g, '"');
    map[name] = m[2];
  }
  return map;
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    redirect: "follow",
    headers: {
      "User-Agent": "Mozilla/5.0 SessionBoard/1.0",
    },
  });
  if (!res.ok) {
    throw new Error(`Sheet request failed (${res.status})`);
  }
  return res.text();
}

async function fetchBuf(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url, {
    redirect: "follow",
    headers: {
      "User-Agent": "Mozilla/5.0 SessionBoard/1.0",
    },
  });
  if (!res.ok) {
    throw new Error(`Sheet export failed (${res.status})`);
  }
  return res.arrayBuffer();
}

export async function loadSpreadsheet(
  spreadsheetId: string,
  bypassCache = false,
): Promise<LoadSheetResult> {
  const cached = cache.get(spreadsheetId);
  if (!bypassCache && cached && Date.now() - cached.at < TTL_MS) {
    return cached.result;
  }

  try {
    const xlsxUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=xlsx`;
    const htmlUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/htmlview`;

    const [buf, html] = await Promise.all([
      fetchBuf(xlsxUrl),
      fetchText(htmlUrl).catch(() => ""),
    ]);

    const wb = XLSX.read(buf, { type: "array", cellDates: true, raw: false });
    const gids = html ? parseGids(html) : {};
    const data: Record<string, unknown[][]> = {};
    for (const name of wb.SheetNames) {
      const sheet = wb.Sheets[name];
      data[name] = sheet ? (XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: false }) as unknown[][]) : [];
    }
    const sheets: RawSheet[] = sheetsFromWorkbookAoA(wb.SheetNames, data, gids);
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch?.[1]?.replace(/\s*-\s*Google Drive\s*$/, "").trim() || "Session board";
    const dataDash = buildDashboard(spreadsheetId, sheets, title);
    const result: LoadSheetResult = { ok: true, data: dataDash };
    cache.set(spreadsheetId, { at: Date.now(), result });
    return result;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not read the spreadsheet.";
    const result: LoadSheetResult = {
      ok: false,
      error:
        message.includes("404") || message.includes("failed (4")
          ? "Could not open the spreadsheet. Share it as “Anyone with the link” (Viewer) and try again."
          : message,
    };
    return result;
  }
}
