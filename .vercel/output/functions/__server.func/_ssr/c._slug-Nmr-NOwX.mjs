import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as formatPct, r as formatInt } from "./utils-Cg5JfY7-.mjs";
import { a as Search, n as Video, o as RefreshCw, p as ArrowLeft, s as MapPin, u as ExternalLink } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as Route } from "./router-C5N9F7SA.mjs";
import { a as CardContent, c as Kpi, d as readStoredSheetUrl, i as Card, l as loadSheetDashboard, n as Badge, o as DEFAULT_SHEET_URL, r as Button, s as Input, t as AttendanceBar } from "./attendance-bar-D7PUlu_-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/c._slug-Nmr-NOwX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CompanyPage() {
	const { slug } = Route.useParams();
	const [sheetUrl, setSheetUrl] = (0, import_react.useState)(DEFAULT_SHEET_URL);
	const [q, setQ] = (0, import_react.useState)("");
	const [markFilter, setMarkFilter] = (0, import_react.useState)("all");
	const [sessionId, setSessionId] = (0, import_react.useState)("all");
	(0, import_react.useEffect)(() => {
		setSheetUrl(readStoredSheetUrl(DEFAULT_SHEET_URL));
	}, []);
	const dash = useQuery({
		queryKey: ["sheet", sheetUrl],
		queryFn: async () => {
			const res = await loadSheetDashboard({ data: { sheetUrl } });
			if (!res.ok) throw new Error(res.error);
			return res.data;
		}
	});
	const company = dash.data?.companies.find((c) => c.slug === slug);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {}), "All companies"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => void dash.refetch(),
						disabled: dash.isFetching,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: dash.isFetching ? "animate-spin" : "" }), "Refresh"]
					})]
				}), company ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.16em] text-present",
						children: "Company session"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-semibold tracking-tight",
						children: company.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							"POC ",
							company.poc || "not in sheet yet",
							" · ",
							formatInt(company.sessionCount),
							" session",
							company.sessionCount === 1 ? "" : "s"
						]
					})
				] }) : dash.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl",
					children: "Loading company…"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl",
					children: "Company not found"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "It may have been removed from the spreadsheet. Return to the board and refresh."
				})] })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 py-6 sm:px-6",
			children: [dash.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: dash.error instanceof Error ? dash.error.message : "Error"
			}) : null, company ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyDetail, {
				company,
				q,
				onQ: setQ,
				markFilter,
				onMarkFilter: setMarkFilter,
				sessionId,
				onSessionId: setSessionId
			}) : null]
		})]
	});
}
function CompanyDetail({ company, q, onQ, markFilter, onMarkFilter, sessionId, onSessionId }) {
	const students = (0, import_react.useMemo)(() => {
		const query = q.trim().toLowerCase();
		return company.students.filter((s) => {
			if (query) {
				if (!`${s.name} ${s.roll} ${s.admission} ${s.email}`.toLowerCase().includes(query)) return false;
			}
			if (markFilter === "all") return true;
			if (sessionId !== "all") return (s.marks[sessionId] ?? "unmarked") === markFilter;
			const values = Object.values(s.marks);
			if (markFilter === "present") return values.some((m) => m === "present");
			if (markFilter === "absent") return values.includes("absent") && !values.includes("present");
			return values.every((m) => m === "unmarked");
		});
	}, [
		company.students,
		q,
		markFilter,
		sessionId
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Eligible",
						value: formatInt(company.eligible)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Attended at least once",
						value: formatInt(company.everPresent),
						tone: "present"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Never present",
						value: formatInt(company.neverPresent),
						tone: "absent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Attendance",
						value: formatPct(company.attendancePct)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Sessions"
				}), company.sessions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "text-sm text-muted-foreground",
					children: "No session columns yet. Add a header such as 04-10|10:30-12:00 and mark P/A."
				}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-xl border border-border bg-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[720px] text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "border-b border-border text-xs uppercase tracking-wide text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Time"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Venue / link"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "POC"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "P"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "A"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "%"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Sheet"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: company.sessions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border/70 last:border-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: s.dateLabel
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 tabular-nums",
									children: s.timeLabel
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: s.meetingLink ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										className: "inline-flex items-center gap-1 text-present hover:underline",
										href: s.meetingLink,
										target: "_blank",
										rel: "noreferrer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-3.5" }), "Join"]
									}) : s.venue ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5" }), s.venue]
									}) : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: s.poc || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 tabular-nums text-present",
									children: s.present
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 tabular-nums text-danger",
									children: s.absent
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex min-w-28 items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttendanceBar, { pct: s.attendancePct }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums",
											children: formatPct(s.attendancePct)
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: s.attendanceLink ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										className: "inline-flex items-center gap-1 hover:underline",
										href: s.attendanceLink,
										target: "_blank",
										rel: "noreferrer",
										children: ["Open", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })]
									}) : "—"
								})
							]
						}, s.id)) })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 lg:flex-row lg:items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-semibold",
							children: "Roster"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "pl-9",
								value: q,
								onChange: (e) => onQ(e.target.value),
								placeholder: "Search student"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-11 rounded-md border border-border bg-card px-3 text-sm",
							value: sessionId,
							onChange: (e) => onSessionId(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All sessions"
							}), company.sessions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: s.id,
								children: [
									s.dateLabel,
									" ",
									s.timeLabel
								]
							}, s.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1",
							children: [
								"all",
								"present",
								"absent",
								"unmarked"
							].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: markFilter === k ? "default" : "outline",
								onClick: () => onMarkFilter(k),
								children: k
							}, k))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-x-auto rounded-xl border border-border bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[640px] text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "border-b border-border text-xs uppercase tracking-wide text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Student"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Admission / roll"
								}),
								company.sessions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: s.dateLabel
								}, s.id))
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: students.slice(0, 250).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentRowView, {
							student: s,
							sessions: company.sessions.map((x) => x.id)
						}, `${s.name}-${s.admission}-${s.roll}`)) })]
					}), students.length > 250 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "px-4 py-3 text-xs text-muted-foreground",
						children: [
							"Showing 250 of ",
							students.length,
							". Narrow the search."
						]
					}) : students.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-4 py-8 text-center text-sm text-muted-foreground",
						children: "No matching students."
					}) : null]
				})]
			})
		]
	});
}
function StudentRowView({ student, sessions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		className: "border-b border-border/70 last:border-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
				className: "px-4 py-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: student.name
				}), student.email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: student.email
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-2.5 text-xs tabular-nums text-muted-foreground",
				children: student.admission || student.roll || "—"
			}),
			sessions.map((id) => {
				const m = student.marks[id] ?? "unmarked";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "px-4 py-2.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: m === "present" ? "present" : m === "absent" ? "absent" : "outline",
						children: m === "present" ? "P" : m === "absent" ? "A" : "—"
					})
				}, id);
			})
		]
	});
}
//#endregion
export { CompanyPage as component };
