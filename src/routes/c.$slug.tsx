import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, MapPin, RefreshCw, Search, Video } from "lucide-react";
import { DEFAULT_SHEET_URL, loadSheetDashboard } from "@/lib/sheet/actions";
import { readStoredSheetUrl } from "@/lib/sheet/store";
import type { CompanyRecord, StudentRow } from "@/lib/sheet/types";
import { formatInt, formatPct } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Kpi } from "@/components/dashboard/kpi";
import { AttendanceBar } from "@/components/dashboard/attendance-bar";

export const Route = createFileRoute("/c/$slug")({ component: CompanyPage });

function CompanyPage() {
  const { slug } = Route.useParams();
  const [sheetUrl, setSheetUrl] = useState(DEFAULT_SHEET_URL);
  const [q, setQ] = useState("");
  const [markFilter, setMarkFilter] = useState<"all" | "present" | "absent" | "unmarked">("all");
  const [sessionId, setSessionId] = useState<string | "all">("all");

  useEffect(() => {
    setSheetUrl(readStoredSheetUrl(DEFAULT_SHEET_URL));
  }, []);

  const dash = useQuery({
    queryKey: ["sheet", sheetUrl],
    queryFn: async () => {
      const res = await loadSheetDashboard({ data: { sheetUrl } });
      if (!res.ok) throw new Error(res.error);
      return res.data;
    },
  });

  const company = dash.data?.companies.find((c) => c.slug === slug);

  return (
    <div className="min-h-dvh">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">
                <ArrowLeft />
                All companies
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => void dash.refetch()} disabled={dash.isFetching}>
              <RefreshCw className={dash.isFetching ? "animate-spin" : ""} />
              Refresh
            </Button>
          </div>
          {company ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-present">
                Corporate & Industry Outreach
              </p>
              <h1 className="font-display text-3xl font-semibold tracking-tight">{company.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Faculty {company.faculty || "not in sheet yet"} · POC {company.poc || "—"} ·{" "}
                {formatInt(company.sessionCount)} session{company.sessionCount === 1 ? "" : "s"}
              </p>
            </div>
          ) : dash.isLoading ? (
            <h1 className="font-display text-2xl">Loading company…</h1>
          ) : (
            <div>
              <h1 className="font-display text-2xl">Company not found</h1>
              <p className="text-sm text-muted-foreground">
                It may have been removed from the spreadsheet. Return to the board and refresh.
              </p>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {dash.error ? (
          <p className="text-sm text-danger">{dash.error instanceof Error ? dash.error.message : "Error"}</p>
        ) : null}
        {company ? (
          <CompanyDetail
            company={company}
            q={q}
            onQ={setQ}
            markFilter={markFilter}
            onMarkFilter={setMarkFilter}
            sessionId={sessionId}
            onSessionId={setSessionId}
          />
        ) : null}
      </main>
    </div>
  );
}

function CompanyDetail({
  company,
  q,
  onQ,
  markFilter,
  onMarkFilter,
  sessionId,
  onSessionId,
}: {
  company: CompanyRecord;
  q: string;
  onQ: (v: string) => void;
  markFilter: "all" | "present" | "absent" | "unmarked";
  onMarkFilter: (v: "all" | "present" | "absent" | "unmarked") => void;
  sessionId: string | "all";
  onSessionId: (v: string | "all") => void;
}) {
  const students = useMemo(() => {
    const query = q.trim().toLowerCase();
    return company.students.filter((s) => {
      if (query) {
        const hay = `${s.name} ${s.roll} ${s.admission} ${s.email}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      if (markFilter === "all") return true;
      if (sessionId !== "all") return (s.marks[sessionId] ?? "unmarked") === markFilter;
      const values = Object.values(s.marks);
      if (markFilter === "present") return values.some((m) => m === "present");
      if (markFilter === "absent") return values.includes("absent") && !values.includes("present");
      return values.every((m) => m === "unmarked");
    });
  }, [company.students, q, markFilter, sessionId]);

  return (
    <div className="space-y-6">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Eligible" value={formatInt(company.eligible)} />
        <Kpi label="Attended at least once" value={formatInt(company.everPresent)} tone="present" />
        <Kpi label="Never present" value={formatInt(company.neverPresent)} tone="absent" />
        <Kpi label="Attendance" value={formatPct(company.attendancePct)} />
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Sessions</h2>
        {company.sessions.length === 0 ? (
          <Card>
            <CardContent className="text-sm text-muted-foreground">
              No session columns yet. Add a header such as 04-10|10:30-12:00 and mark P/A.
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Venue / link</th>
                  <th className="px-4 py-3 font-medium">Faculty</th>
                  <th className="px-4 py-3 font-medium">POC</th>
                  <th className="px-4 py-3 font-medium">P</th>
                  <th className="px-4 py-3 font-medium">A</th>
                  <th className="px-4 py-3 font-medium">%</th>
                  <th className="px-4 py-3 font-medium">Sheet</th>
                </tr>
              </thead>
              <tbody>
                {company.sessions.map((s) => (
                  <tr key={s.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3">{s.dateLabel}</td>
                    <td className="px-4 py-3 tabular-nums">{s.timeLabel}</td>
                    <td className="px-4 py-3">
                      {s.meetingLink ? (
                        <a className="inline-flex items-center gap-1 text-present hover:underline" href={s.meetingLink} target="_blank" rel="noreferrer">
                          <Video className="size-3.5" />
                          Join
                        </a>
                      ) : s.venue ? (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3.5" />
                          {s.venue}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">{s.faculty || "—"}</td>
                    <td className="px-4 py-3">{s.poc || "—"}</td>
                    <td className="px-4 py-3 tabular-nums text-present">{s.present}</td>
                    <td className="px-4 py-3 tabular-nums text-danger">{s.absent}</td>
                    <td className="px-4 py-3">
                      <div className="flex min-w-28 items-center gap-2">
                        <AttendanceBar pct={s.attendancePct} />
                        <span className="tabular-nums">{formatPct(s.attendancePct)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {s.attendanceLink ? (
                        <a className="inline-flex items-center gap-1 hover:underline" href={s.attendanceLink} target="_blank" rel="noreferrer">
                          Open
                          <ExternalLink className="size-3.5" />
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <h2 className="font-display text-lg font-semibold">Roster</h2>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" value={q} onChange={(e) => onQ(e.target.value)} placeholder="Search student" />
          </div>
          <select
            className="h-11 rounded-md border border-border bg-card px-3 text-sm"
            value={sessionId}
            onChange={(e) => onSessionId(e.target.value)}
          >
            <option value="all">All sessions</option>
            {company.sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.dateLabel} {s.timeLabel}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-1">
            {(["all", "present", "absent", "unmarked"] as const).map((k) => (
              <Button key={k} size="sm" variant={markFilter === k ? "default" : "outline"} onClick={() => onMarkFilter(k)}>
                {k}
              </Button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Admission / roll</th>
                {company.sessions.map((s) => (
                  <th key={s.id} className="px-4 py-3 font-medium">
                    {s.dateLabel}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.slice(0, 250).map((s) => (
                <StudentRowView key={`${s.name}-${s.admission}-${s.roll}`} student={s} sessions={company.sessions.map((x) => x.id)} />
              ))}
            </tbody>
          </table>
          {students.length > 250 ? (
            <p className="px-4 py-3 text-xs text-muted-foreground">Showing 250 of {students.length}. Narrow the search.</p>
          ) : students.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">No matching students.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function StudentRowView({ student, sessions }: { student: StudentRow; sessions: string[] }) {
  return (
    <tr className="border-b border-border/70 last:border-0">
      <td className="px-4 py-2.5">
        <div className="font-medium">{student.name}</div>
        {student.email ? <div className="text-xs text-muted-foreground">{student.email}</div> : null}
      </td>
      <td className="px-4 py-2.5 text-xs tabular-nums text-muted-foreground">
        {student.admission || student.roll || "—"}
      </td>
      {sessions.map((id) => {
        const m = student.marks[id] ?? "unmarked";
        return (
          <td key={id} className="px-4 py-2.5">
            <Badge variant={m === "present" ? "present" : m === "absent" ? "absent" : "outline"}>
              {m === "present" ? "P" : m === "absent" ? "A" : "—"}
            </Badge>
          </td>
        );
      })}
    </tr>
  );
}
