import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay, i as DialogDescription$1, n as DialogClose, o as DialogPortal, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { i as formatPct, r as formatInt, t as cn } from "./utils-Cg5JfY7-.mjs";
import { a as Search, c as Link2, d as CalendarDays, f as Building2, l as EyeOff, o as RefreshCw, r as Users, t as X } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as CardContent, c as Kpi, d as readStoredSheetUrl, f as writeHiddenCompanies, i as Card, l as loadSheetDashboard, n as Badge, o as DEFAULT_SHEET_URL, p as writeStoredSheetUrl, r as Button, s as Input, t as AttendanceBar, u as readHiddenCompanies } from "./attendance-bar-D7PUlu_-.mjs";
import { a as Bar, i as CartesianGrid, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-COfcJoyy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-ink/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed left-1/2 top-1/2 z-50 w-[min(560px,calc(100vw-1.5rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 shadow-lg focus:outline-none", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mb-4 space-y-1 pr-6", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-xl font-semibold tracking-tight", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-muted", className),
		...props
	});
}
function Home() {
	const [sheetUrl, setSheetUrl] = (0, import_react.useState)(DEFAULT_SHEET_URL);
	const [draftUrl, setDraftUrl] = (0, import_react.useState)(DEFAULT_SHEET_URL);
	const [hidden, setHidden] = (0, import_react.useState)([]);
	const [showHidden, setShowHidden] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const [setupOpen, setSetupOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const stored = readStoredSheetUrl(DEFAULT_SHEET_URL);
		setSheetUrl(stored);
		setDraftUrl(stored);
		setHidden(readHiddenCompanies());
	}, []);
	const dash = useQuery({
		queryKey: ["sheet", sheetUrl],
		queryFn: async () => {
			const res = await loadSheetDashboard({ data: {
				sheetUrl,
				bypassCache: false
			} });
			if (!res.ok) throw new Error(res.error);
			return res.data;
		},
		refetchInterval: 12e4
	});
	function connect() {
		writeStoredSheetUrl(draftUrl.trim());
		setSheetUrl(draftUrl.trim());
	}
	async function refresh() {
		writeStoredSheetUrl(draftUrl.trim() || sheetUrl);
		setSheetUrl(draftUrl.trim() || sheetUrl);
		await dash.refetch();
	}
	function hideCompany(name) {
		const next = Array.from(/* @__PURE__ */ new Set([...hidden, name]));
		setHidden(next);
		writeHiddenCompanies(next);
	}
	function unhideCompany(name) {
		const next = hidden.filter((n) => n !== name);
		setHidden(next);
		writeHiddenCompanies(next);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-border bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-[0.16em] text-present",
								children: "Placement cell"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-3xl font-semibold tracking-tight",
								children: "Session Board"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 max-w-xl text-sm text-muted-foreground",
								children: "Live company sessions, POCs, and attendance — driven only by your spreadsheet tabs. Remove a company by deleting its sheet, or hide it here."
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setSetupOpen(true),
								children: "Sheet setup"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								onClick: () => void refresh(),
								disabled: dash.isFetching,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: dash.isFetching ? "animate-spin" : "" }), "Refresh"]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex flex-col gap-2 sm:flex-row",
						onSubmit: (e) => {
							e.preventDefault();
							connect();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draftUrl,
							onChange: (e) => setDraftUrl(e.target.value),
							placeholder: "Google Spreadsheet link",
							"aria-label": "Google Spreadsheet link"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Connect sheet"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 py-6 sm:px-6",
				children: [
					dash.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, {}) : null,
					dash.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-danger/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-danger",
									children: "Could not load the sheet"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: dash.error instanceof Error ? dash.error.message : "Unknown error"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Share the Google Sheet as Anyone with the link (Viewer), then refresh."
								})
							]
						})
					}) : null,
					dash.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardView, {
						data: dash.data,
						hidden,
						showHidden,
						query,
						onQuery: setQuery,
						onToggleHidden: () => setShowHidden((v) => !v),
						onHide: hideCompany,
						onUnhide: unhideCompany
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SetupDialog, {
				open: setupOpen,
				onOpenChange: setSetupOpen,
				data: dash.data
			})
		]
	});
}
function LoadingState() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 sm:grid-cols-4",
		children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-lg" }, i))
	});
}
function DashboardView({ data, hidden, showHidden, query, onQuery, onToggleHidden, onHide, onUnhide }) {
	const visible = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return data.companies.filter((c) => {
			if (!showHidden && hidden.includes(c.name)) return false;
			if (!q) return true;
			return c.name.toLowerCase().includes(q) || c.poc.toLowerCase().includes(q) || c.sessions.some((s) => s.venue.toLowerCase().includes(q));
		});
	}, [
		data.companies,
		hidden,
		showHidden,
		query
	]);
	const totals = (0, import_react.useMemo)(() => summarize(visible), [visible]);
	const chartData = visible.map((c) => ({
		name: c.name.length > 14 ? `${c.name.slice(0, 12)}…` : c.name,
		pct: c.attendancePct == null ? 0 : Math.round(c.attendancePct * 10) / 10
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					data.title,
					" · updated ",
					new Date(data.fetchedAt).toLocaleString(),
					" ·",
					" ",
					data.companies.length,
					" company tab",
					data.companies.length === 1 ? "" : "s"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					className: "inline-flex items-center gap-1 text-present hover:underline",
					href: data.spreadsheetUrl,
					target: "_blank",
					rel: "noreferrer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-3.5" }), "Open spreadsheet"]
				})]
			}),
			!data.hasMetaSheet ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-present-soft/40 px-4 py-3 text-sm",
				children: [
					"Add a tab named ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Sessions" }),
					" with Company, POC, Date, Time, Venue (or meeting link) to show contact and venue on this board. Attendance still reads from each company tab."
				]
			}) : null,
			data.warnings.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: data.warnings.join(" ")
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Companies",
						value: formatInt(visible.length),
						hint: "From live sheet tabs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Sessions",
						value: formatInt(totals.sessions),
						hint: "All visible companies"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Eligible students",
						value: formatInt(totals.eligible),
						hint: "Roster rows with names"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Attendance",
						value: formatPct(totals.pct),
						hint: `${formatInt(totals.present)} present / ${formatInt(totals.absent)} absent`,
						tone: "present"
					})
				]
			}),
			chartData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Attendance by company"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: "Average of marked sessions"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-64",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: chartData,
						margin: {
							top: 8,
							right: 8,
							left: -16,
							bottom: 8
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--color-border)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "name",
								tick: {
									fill: "var(--color-muted-foreground)",
									fontSize: 12
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								domain: [0, 100],
								tick: {
									fill: "var(--color-muted-foreground)",
									fontSize: 12
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								cursor: { fill: "var(--color-muted)" },
								contentStyle: {
									background: "var(--color-card)",
									border: "1px solid var(--color-border)",
									borderRadius: 12
								},
								formatter: (v) => [`${v}%`, "Attendance"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "pct",
								fill: "var(--color-present)",
								radius: [
									6,
									6,
									0,
									0
								]
							})
						]
					})
				})
			})] }) }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "pl-9",
						value: query,
						onChange: (e) => onQuery(e.target.value),
						placeholder: "Search company, POC, or venue"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: onToggleHidden,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, {}), showHidden ? "Hiding hidden companies" : `Hidden (${hidden.length})`]
				})]
			}),
			visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "py-12 text-center text-sm text-muted-foreground",
				children: "No companies to show. Add a tab in the spreadsheet, or unhide a company."
			}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: visible.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyCard, {
					company: c,
					isHidden: hidden.includes(c.name),
					onHide: () => onHide(c.name),
					onUnhide: () => onUnhide(c.name)
				}, c.slug))
			})
		]
	});
}
function summarize(companies) {
	let sessions = 0;
	let eligible = 0;
	let present = 0;
	let absent = 0;
	for (const c of companies) {
		sessions += c.sessionCount;
		eligible += c.eligible;
		for (const s of c.sessions) {
			present += s.present;
			absent += s.absent;
		}
	}
	const marked = present + absent;
	return {
		sessions,
		eligible,
		present,
		absent,
		pct: marked ? present / marked * 100 : null
	};
}
function CompanyCard({ company, isHidden, onHide, onUnhide }) {
	const next = company.sessions[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl font-semibold tracking-tight",
							children: company.name
						}), isHidden ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: "Hidden on this device"
						}) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: ["POC ", company.poc || "— add in Sessions tab"]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: isHidden ? onUnhide : onHide,
						children: isHidden ? "Unhide" : "Hide"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2 text-sm sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
							icon: CalendarDays,
							label: "Sessions",
							value: formatInt(company.sessionCount)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
							icon: Users,
							label: "Eligible",
							value: formatInt(company.eligible)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
							icon: Building2,
							label: "Present",
							value: formatInt(company.everPresent)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
							icon: Users,
							label: "Attendance",
							value: formatPct(company.attendancePct)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttendanceBar, { pct: company.attendancePct }),
				next ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"Latest slot ",
						next.dateLabel,
						" · ",
						next.timeLabel,
						next.venue ? ` · ${next.venue}` : next.meetingLink ? " · Online" : ""
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Roster only — add session columns like 04-10|10:30-12:00"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/c/$slug",
							params: { slug: company.slug },
							children: "Open dashboard"
						})
					}), company.sheetUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: company.sheetUrl,
							target: "_blank",
							rel: "noreferrer",
							children: "Attendance sheet"
						})
					}) : null]
				})
			]
		})
	});
}
function Meta({ icon: Icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-muted/60 px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3" }), label]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-medium tabular-nums",
			children: value
		})]
	});
}
function SetupDialog({ open, onOpenChange, data }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "How the sheet maps" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Nothing is hard-coded. Company names come from tab names. Hide a card here, or delete the tab in Google Sheets and refresh." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 text-sm leading-relaxed",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Company tabs" }),
					" (you have ",
					data?.companies.map((c) => c.name).join(", ") || "—",
					") : one roster per company. Identity columns can be Name / Roll / Admission / Email. Session columns should look like ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "25Sep|10:00-11:00" }),
					" or ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "30-08 | 12:00-13:00" }),
					" with P / A marks."
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Optional tab named Sessions" }), " with headers: Company, POC, Date, Time, Venue, Meeting link, Attendance link. Venue can be a room or an online URL. One row per session."] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Eligible = named rows. Attendees = P. Absentees = A. Percentage = P / (P + A). Empty session cells stay unmarked and are excluded from the rate." })
			]
		})] })
	});
}
//#endregion
export { Home as component };
