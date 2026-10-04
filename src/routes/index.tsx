import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Building2,
  CalendarDays,
  EyeOff,
  Link2,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import { DEFAULT_SHEET_URL, loadSheetDashboard } from "@/lib/sheet/actions";
import {
  readHiddenCompanies,
  readStoredSheetUrl,
  writeHiddenCompanies,
  writeStoredSheetUrl,
} from "@/lib/sheet/store";
import type { CompanyRecord, DashboardData } from "@/lib/sheet/types";
import { formatInt, formatPct } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Kpi } from "@/components/dashboard/kpi";
import { AttendanceBar } from "@/components/dashboard/attendance-bar";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [sheetUrl, setSheetUrl] = useState(DEFAULT_SHEET_URL);
  const [draftUrl, setDraftUrl] = useState(DEFAULT_SHEET_URL);
  const [hidden, setHidden] = useState<string[]>([]);
  const [showHidden, setShowHidden] = useState(false);
  const [query, setQuery] = useState("");
  const [setupOpen, setSetupOpen] = useState(false);

  useEffect(() => {
    const stored = readStoredSheetUrl(DEFAULT_SHEET_URL);
    setSheetUrl(stored);
    setDraftUrl(stored);
    setHidden(readHiddenCompanies());
  }, []);

  const dash = useQuery({
    queryKey: ["sheet", sheetUrl],
    queryFn: async () => {
      const res = await loadSheetDashboard({ data: { sheetUrl, bypassCache: false } });
      if (!res.ok) throw new Error(res.error);
      return res.data;
    },
    refetchInterval: 120_000,
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

  function hideCompany(name: string) {
    const next = Array.from(new Set([...hidden, name]));
    setHidden(next);
    writeHiddenCompanies(next);
  }

  function unhideCompany(name: string) {
    const next = hidden.filter((n) => n !== name);
    setHidden(next);
    writeHiddenCompanies(next);
  }

  return (
    <div className="min-h-dvh">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-present">
                Corporate & Industry Outreach
              </p>
              <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Placement Preparation sessions
              </h1>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                Live company sessions, faculty, POCs, and attendance — driven only by your spreadsheet
                tabs. Remove a company by deleting its sheet, or hide it here.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setSetupOpen(true)}>
                Sheet setup
              </Button>
              <Button variant="secondary" onClick={() => void refresh()} disabled={dash.isFetching}>
                <RefreshCw className={dash.isFetching ? "animate-spin" : ""} />
                Refresh
              </Button>
            </div>
          </div>
          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              connect();
            }}
          >
            <Input
              value={draftUrl}
              onChange={(e) => setDraftUrl(e.target.value)}
              placeholder="Google Spreadsheet link"
              aria-label="Google Spreadsheet link"
            />
            <Button type="submit">Connect sheet</Button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {dash.isLoading ? <LoadingState /> : null}
        {dash.error ? (
          <Card className="border-danger/30">
            <CardContent className="space-y-2">
              <p className="font-medium text-danger">Could not load the sheet</p>
              <p className="text-sm text-muted-foreground">
                {dash.error instanceof Error ? dash.error.message : "Unknown error"}
              </p>
              <p className="text-sm text-muted-foreground">
                Share the Google Sheet as Anyone with the link (Viewer), then refresh.
              </p>
            </CardContent>
          </Card>
        ) : null}
        {dash.data ? (
          <DashboardView
            data={dash.data}
            hidden={hidden}
            showHidden={showHidden}
            query={query}
            onQuery={setQuery}
            onToggleHidden={() => setShowHidden((v) => !v)}
            onHide={hideCompany}
            onUnhide={unhideCompany}
          />
        ) : null}
      </main>
      <SetupDialog open={setupOpen} onOpenChange={setSetupOpen} data={dash.data} />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-24 rounded-lg" />
      ))}
    </div>
  );
}

function DashboardView({
  data,
  hidden,
  showHidden,
  query,
  onQuery,
  onToggleHidden,
  onHide,
  onUnhide,
}: {
  data: DashboardData;
  hidden: string[];
  showHidden: boolean;
  query: string;
  onQuery: (v: string) => void;
  onToggleHidden: () => void;
  onHide: (name: string) => void;
  onUnhide: (name: string) => void;
}) {
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.companies.filter((c) => {
      if (!showHidden && hidden.includes(c.name)) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.poc.toLowerCase().includes(q) ||
        c.faculty.toLowerCase().includes(q) ||
        c.sessions.some((s) => s.venue.toLowerCase().includes(q) || s.faculty.toLowerCase().includes(q))
      );
    });
  }, [data.companies, hidden, showHidden, query]);

  const totals = useMemo(() => summarize(visible), [visible]);

  const chartData = visible.map((c) => ({
    name: c.name.length > 14 ? `${c.name.slice(0, 12)}…` : c.name,
    pct: c.attendancePct == null ? 0 : Math.round(c.attendancePct * 10) / 10,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <p>
          {data.title} · updated {new Date(data.fetchedAt).toLocaleString()} ·{" "}
          {data.companies.length} company tab{data.companies.length === 1 ? "" : "s"}
        </p>
        <a className="inline-flex items-center gap-1 text-present hover:underline" href={data.spreadsheetUrl} target="_blank" rel="noreferrer">
          <Link2 className="size-3.5" />
          Open spreadsheet
        </a>
      </div>

      {!data.hasMetaSheet ? (
        <div className="rounded-lg border border-border bg-present-soft/40 px-4 py-3 text-sm">
          Add a tab named <strong>Sessions</strong> with Company, POC, Faculty, Date, Time, Venue (or
          meeting link) to show who takes each session. Attendance still reads from each company tab.
        </div>
      ) : null}

      {data.warnings.length > 0 ? (
        <p className="text-sm text-muted-foreground">{data.warnings.join(" ")}</p>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Companies" value={formatInt(visible.length)} hint="From live sheet tabs" />
        <Kpi label="Sessions" value={formatInt(totals.sessions)} hint="All visible companies" />
        <Kpi label="Eligible students" value={formatInt(totals.eligible)} hint="Roster rows with names" />
        <Kpi
          label="Attendance"
          value={formatPct(totals.pct)}
          hint={`${formatInt(totals.present)} present / ${formatInt(totals.absent)} absent`}
          tone="present"
        />
      </section>

      {chartData.length > 0 ? (
        <Card>
          <CardContent>
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="font-display text-lg font-semibold">Attendance by company</h2>
              <span className="text-xs text-muted-foreground">Average of marked sessions</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <ReTooltip
                    cursor={{ fill: "var(--color-muted)" }}
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                    }}
                    formatter={(v: number) => [`${v}%`, "Attendance"]}
                  />
                  <Bar dataKey="pct" fill="var(--color-present)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search company, faculty, POC, or venue"
          />
        </div>
        <Button variant="outline" onClick={onToggleHidden}>
          <EyeOff />
          {showHidden ? "Hiding hidden companies" : `Hidden (${hidden.length})`}
        </Button>
      </div>

      {visible.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No companies to show. Add a tab in the spreadsheet, or unhide a company.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {visible.map((c) => (
            <CompanyCard
              key={c.slug}
              company={c}
              isHidden={hidden.includes(c.name)}
              onHide={() => onHide(c.name)}
              onUnhide={() => onUnhide(c.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function summarize(companies: CompanyRecord[]) {
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
    pct: marked ? (present / marked) * 100 : null,
  };
}

function CompanyCard({
  company,
  isHidden,
  onHide,
  onUnhide,
}: {
  company: CompanyRecord;
  isHidden: boolean;
  onHide: () => void;
  onUnhide: () => void;
}) {
  const next = company.sessions[0];
  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-xl font-semibold tracking-tight">{company.name}</h3>
              {isHidden ? <Badge variant="outline">Hidden on this device</Badge> : null}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Faculty {company.faculty || "— add in Sessions tab"}
            </p>
            <p className="text-sm text-muted-foreground">POC {company.poc || "—"}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={isHidden ? onUnhide : onHide}>
            {isHidden ? "Unhide" : "Hide"}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          <Meta icon={CalendarDays} label="Sessions" value={formatInt(company.sessionCount)} />
          <Meta icon={Users} label="Eligible" value={formatInt(company.eligible)} />
          <Meta icon={Building2} label="Present" value={formatInt(company.everPresent)} />
          <Meta icon={Users} label="Attendance" value={formatPct(company.attendancePct)} />
        </div>
        <AttendanceBar pct={company.attendancePct} />
        {next ? (
          <p className="text-xs text-muted-foreground">
            Latest slot {next.dateLabel} · {next.timeLabel}
            {next.faculty ? ` · ${next.faculty}` : ""}
            {next.venue ? ` · ${next.venue}` : next.meetingLink ? " · Online" : ""}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">Roster only — add session columns like 04-10|10:30-12:00</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/c/$slug" params={{ slug: company.slug }}>
              Open dashboard
            </Link>
          </Button>
          {company.sheetUrl ? (
            <Button asChild variant="outline">
              <a href={company.sheetUrl} target="_blank" rel="noreferrer">
                Attendance sheet
              </a>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md bg-muted/60 px-3 py-2">
      <p className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3" />
        {label}
      </p>
      <p className="mt-1 font-medium tabular-nums">{value}</p>
    </div>
  );
}

function SetupDialog({
  open,
  onOpenChange,
  data,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data?: DashboardData;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How the sheet maps</DialogTitle>
          <DialogDescription>
            Nothing is hard-coded. Company names come from tab names. Hide a card here, or delete the tab
            in Google Sheets and refresh. Faculty is per session — add it in the Sessions tab.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm leading-relaxed">
          <p>
            <strong>Company tabs</strong> (you have {data?.companies.map((c) => c.name).join(", ") || "—"})
            : one roster per company. Identity columns can be Name / Roll / Admission / Email. Session
            columns should look like <code>25Sep|10:00-11:00</code> or <code>30-08 | 12:00-13:00</code> with
            P / A marks.
          </p>
          <p>
            <strong>Optional tab named Sessions</strong> with headers: Company, POC, Faculty, Date, Time,
            Venue, Meeting link, Attendance link. Faculty is who takes that session. Venue can be a room
            or an online URL. One row per session.
          </p>
          <p>
            Eligible = named rows. Attendees = P. Absentees = A. Percentage = P / (P + A). Empty session
            cells stay unmarked and are excluded from the rate.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
