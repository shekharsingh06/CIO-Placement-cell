import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { n as extractSpreadsheetId } from "./utils-Cg5JfY7-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/actions-S1hzVxXj.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var DEFAULT_SHEET_URL = "https://docs.google.com/spreadsheets/d/1OxKlZ_Q2Sr2f50XCfOQhSfYnw_p1IMVOV9BKd9Fa6IU/edit";
var loadSheetDashboard_createServerFn_handler = createServerRpc({
	id: "230a7a1c3dc6cd68b188a4c350dfe72bd7e5f33813873967d296793e4e4cf1ae",
	name: "loadSheetDashboard",
	filename: "src/lib/sheet/actions.ts"
}, (opts) => loadSheetDashboard.__executeServer(opts));
var loadSheetDashboard = createServerFn({ method: "POST" }).validator((input) => input).handler(loadSheetDashboard_createServerFn_handler, async ({ data }) => {
	const id = extractSpreadsheetId(data.sheetUrl || DEFAULT_SHEET_URL);
	if (!id) return {
		ok: false,
		error: "Paste a valid Google Spreadsheet link."
	};
	const { loadSpreadsheet } = await import("./load.server-BdAXmgMS.mjs");
	return loadSpreadsheet(id, Boolean(data.bypassCache));
});
//#endregion
export { loadSheetDashboard_createServerFn_handler };
