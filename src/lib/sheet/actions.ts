import { createServerFn } from "@tanstack/react-start";
import { extractSpreadsheetId } from "@/lib/utils";
import type { LoadSheetResult } from "./types";

export const DEFAULT_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1OxKlZ_Q2Sr2f50XCfOQhSfYnw_p1IMVOV9BKd9Fa6IU/edit";

export const loadSheetDashboard = createServerFn({ method: "POST" })
  .validator((input: { sheetUrl?: string; bypassCache?: boolean }) => input)
  .handler(async ({ data }): Promise<LoadSheetResult> => {
    const id = extractSpreadsheetId(data.sheetUrl || DEFAULT_SHEET_URL);
    if (!id) {
      return { ok: false, error: "Paste a valid Google Spreadsheet link." };
    }
    const { loadSpreadsheet } = await import("./load.server");
    return loadSpreadsheet(id, Boolean(data.bypassCache));
  });
