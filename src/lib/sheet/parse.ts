import { slugify } from "@/lib/utils";
import type {
  AttendanceMark,
  CompanyRecord,
  DashboardData,
  SessionStat,
  StudentRow,
} from "./types";

const META_SHEET_RE =
  /^(sessions?|companies|company|meta|master|poc|overview|setup|_meta)$/i;

const MONTHS: Record<string, number> = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
};

export type RawSheet = {
  name: string;
  gid: string | null;
  rows: string[][];
};

function cell(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "";
    if (Math.abs(value) >= 1e9) return String(Math.round(value));
    if (Number.isInteger(value)) return String(value);
    const rounded = Math.round(value);
    if (Math.abs(value - rounded) < 1e-6) return String(rounded);
    return String(value);
  }
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).replace(/\s+/g, " ").trim();
}

function normalizeHeader(h: string): string {
  return h.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function isMetaSheetName(name: string): boolean {
  return META_SHEET_RE.test(name.trim());
}

function classifyIdentity(header: string): "name" | "roll" | "admission" | "email" | "phone" | null {
  const h = normalizeHeader(header);
  if (!h) return null;
  if (/(email|mail id|e mail)/.test(h)) return "email";
  if (/(phone|mobile|contact|whatsapp|number)$/.test(h) && !/roll|admission/.test(h))
    return "phone";
  if (h === "number" || h === "phone number" || h === "mobile number") return "phone";
  if (/(admission)/.test(h)) return "admission";
  if (/(roll)/.test(h)) return "roll";
  if (/(student name|full name|^name$|student$)/.test(h)) return "name";
  return null;
}

function parseMark(raw: string): AttendanceMark {
  const v = raw.trim().toUpperCase();
  if (!v) return "unmarked";
  if (["P", "PRESENT", "YES", "Y", "1", "TRUE", "ATTENDED"].includes(v)) return "present";
  if (["A", "ABSENT", "NO", "N", "0", "FALSE"].includes(v)) return "absent";
  return "unmarked";
}

function looksLikeSessionHeader(header: string): boolean {
  const h = header.trim();
  if (!h) return false;
  if (classifyIdentity(h)) return false;
  if (/\|/.test(h)) return true;
  if (/\d{1,2}\s*[-/]\s*\d{1,2}/.test(h) && /\d{1,2}\s*:\s*\d{2}/.test(h)) return true;
  if (/\d{1,2}\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(h)) return true;
  return false;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function parseSessionHeader(header: string, now = new Date()): {
  dateLabel: string;
  timeLabel: string;
  isoDate: string | null;
} {
  const raw = header.replace(/\s+/g, " ").trim();
  const parts = raw.split("|").map((p) => p.trim());
  const datePart = parts[0] ?? raw;
  const timePart = parts.slice(1).join(" | ").trim();

  let day: number | null = null;
  let month: number | null = null;
  let year: number | null = null;

  const numeric = datePart.match(/^(\d{1,2})[-\/](\d{1,2})(?:[-\/](\d{2,4}))?/);
  if (numeric) {
    day = Number(numeric[1]);
    month = Number(numeric[2]);
    if (numeric[3]) {
      year = Number(numeric[3]);
      if (year < 100) year += 2000;
    }
  } else {
    const named = datePart.match(
      /^(\d{1,2})\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*/i,
    );
    if (named) {
      day = Number(named[1]);
      month = MONTHS[named[2].toLowerCase()] ?? null;
    }
  }

  if (day && month) {
    const y = year ?? now.getFullYear();
    const isoDate = `${y}-${pad(month)}-${pad(day)}`;
    const dateLabel = `${pad(day)} ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][month - 1]} ${y}`;
    return { dateLabel, timeLabel: timePart || "—", isoDate };
  }

  return {
    dateLabel: datePart || "Session",
    timeLabel: timePart || "—",
    isoDate: null,
  };
}

function pct(present: number, absent: number, unmarked: number, eligible: number): number | null {
  const marked = present + absent;
  if (marked > 0) return (present / marked) * 100;
  if (eligible > 0 && unmarked === eligible) return 0;
  return null;
}

type MetaRow = {
  company: string;
  poc: string;
  faculty: string;
  date: string;
  time: string;
  venue: string;
  meetingLink: string;
  attendanceLink: string;
  notes: string;
};

function headerIndex(headers: string[], aliases: string[]): number {
  const normalized = headers.map(normalizeHeader);
  for (const alias of aliases) {
    const i = normalized.findIndex((h) => h === alias || h.includes(alias));
    if (i >= 0) return i;
  }
  return -1;
}

function parseMetaSheet(rows: string[][]): MetaRow[] {
  if (rows.length < 2) return [];
  const headers = rows[0] ?? [];
  const companyI = headerIndex(headers, ["company", "company name", "firm"]);
  const pocI = headerIndex(headers, ["poc", "point of contact", "company poc", "coordinator", "owner"]);
  const facultyI = headerIndex(headers, ["faculty name", "faculty", "trainer", "instructor", "taken by", "professor"]);
  const dateI = headerIndex(headers, ["date", "session date"]);
  const timeI = headerIndex(headers, ["time", "slot", "session time"]);
  const venueI = headerIndex(headers, ["venue", "location", "place", "mode"]);
  const meetI = headerIndex(headers, ["meeting", "meet link", "online link", "zoom", "gmeet"]);
  const attI = headerIndex(headers, ["attendance link", "sheet link", "roster", "link"]);
  const notesI = headerIndex(headers, ["notes", "remark", "status"]);
  if (companyI < 0) return [];

  const out: MetaRow[] = [];
  for (const row of rows.slice(1)) {
    const company = (row[companyI] ?? "").trim();
    if (!company) continue;
    out.push({
      company,
      poc: pocI >= 0 ? row[pocI] ?? "" : "",
      faculty: facultyI >= 0 ? row[facultyI] ?? "" : "",
      date: dateI >= 0 ? row[dateI] ?? "" : "",
      time: timeI >= 0 ? row[timeI] ?? "" : "",
      venue: venueI >= 0 ? row[venueI] ?? "" : "",
      meetingLink: meetI >= 0 ? row[meetI] ?? "" : "",
      attendanceLink: attI >= 0 ? row[attI] ?? "" : "",
      notes: notesI >= 0 ? row[notesI] ?? "" : "",
    });
  }
  return out;
}

function companyKey(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function pickMetaForSession(
  metas: MetaRow[],
  company: string,
  dateLabel: string,
  timeLabel: string,
  isoDate: string | null,
): MetaRow | undefined {
  const key = companyKey(company);
  const forCompany = metas.filter((m) => companyKey(m.company) === key);
  if (forCompany.length === 0) {
    return metas.find((m) => companyKey(m.company).includes(key) || key.includes(companyKey(m.company)));
  }
  const timeNorm = timeLabel.replace(/\s+/g, "").toLowerCase();
  const byTime = forCompany.find((m) => m.time.replace(/\s+/g, "").toLowerCase() === timeNorm && timeNorm);
  if (byTime) return byTime;
  if (isoDate) {
    const byDate = forCompany.find((m) => m.date.includes(isoDate) || isoDate.includes(m.date.replace(/\//g, "-")));
    if (byDate) return byDate;
  }
  const byDateLabel = forCompany.find((m) =>
    dateLabel.toLowerCase().includes(m.date.toLowerCase()) && m.date.length > 2,
  );
  if (byDateLabel) return byDateLabel;
  return forCompany[0];
}

function parseAttendanceSheet(
  sheet: RawSheet,
  spreadsheetId: string,
  metas: MetaRow[],
  usedSlugs: Map<string, number>,
): CompanyRecord | null {
  const rows = sheet.rows.filter((r) => r.some((c) => c.trim()));
  if (rows.length < 1) return null;
  const headers = rows[0] ?? [];
  if (headers.every((h) => !h)) return null;

  const identity: Record<string, number> = {};
  const sessionCols: { index: number; header: string }[] = [];

  headers.forEach((h, i) => {
    const id = classifyIdentity(h);
    if (id && identity[id] == null) identity[id] = i;
    else if (looksLikeSessionHeader(h)) sessionCols.push({ index: i, header: h });
    else if (!id && h) {
      const sample = rows.slice(1, 60).map((r) => parseMark(r[i] ?? ""));
      const marked = sample.filter((m) => m !== "unmarked").length;
      if (marked >= 5) sessionCols.push({ index: i, header: h });
    }
  });

  const nameCol = identity.name ?? 0;
  const students: StudentRow[] = [];
  for (const row of rows.slice(1)) {
    const name = (row[nameCol] ?? "").trim();
    if (!name) continue;
    const marks: Record<string, AttendanceMark> = {};
    for (const s of sessionCols) {
      marks[s.header] = parseMark(row[s.index] ?? "");
    }
    students.push({
      name,
      roll: identity.roll != null ? row[identity.roll] ?? "" : "",
      admission: identity.admission != null ? row[identity.admission] ?? "" : "",
      email: identity.email != null ? row[identity.email] ?? "" : "",
      phone: identity.phone != null ? row[identity.phone] ?? "" : "",
      marks,
    });
  }
  if (students.length === 0) return null;

  const eligible = students.length;
  const sessions: SessionStat[] = sessionCols.map((s) => {
    const parsed = parseSessionHeader(s.header);
    const meta = pickMetaForSession(metas, sheet.name, parsed.dateLabel, parsed.timeLabel, parsed.isoDate);
    let present = 0;
    let absent = 0;
    let unmarked = 0;
    for (const st of students) {
      const m = st.marks[s.header] ?? "unmarked";
      if (m === "present") present += 1;
      else if (m === "absent") absent += 1;
      else unmarked += 1;
    }
    const venue = meta?.venue ?? "";
    const meeting = meta?.meetingLink ?? "";
    const isUrl = /^https?:\/\//i.test(venue);
    return {
      id: s.header,
      rawHeader: s.header,
      dateLabel: meta?.date || parsed.dateLabel,
      timeLabel: meta?.time || parsed.timeLabel,
      isoDate: parsed.isoDate,
      venue: isUrl ? "" : venue,
      meetingLink: meeting || (isUrl ? venue : ""),
      attendanceLink:
        meta?.attendanceLink ||
        (sheet.gid
          ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${sheet.gid}`
          : `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`),
      poc: meta?.poc ?? "",
      faculty: meta?.faculty ?? "",
      eligible,
      present,
      absent,
      unmarked,
      attendancePct: pct(present, absent, unmarked, eligible),
    };
  });

  // If no session columns yet (roster only), still show the company
  if (sessions.length === 0) {
    const companyMetas = metas.filter((m) => companyKey(m.company) === companyKey(sheet.name));
    for (const m of companyMetas) {
      sessions.push({
        id: `${m.date}|${m.time}|${m.venue}`,
        rawHeader: [m.date, m.time].filter(Boolean).join(" | "),
        dateLabel: m.date || "Upcoming",
        timeLabel: m.time || "—",
        isoDate: null,
        venue: /^https?:\/\//i.test(m.venue) ? "" : m.venue,
        meetingLink: m.meetingLink || (/^https?:\/\//i.test(m.venue) ? m.venue : ""),
        attendanceLink:
          m.attendanceLink ||
          (sheet.gid
            ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${sheet.gid}`
            : `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`),
        poc: m.poc,
        faculty: m.faculty,
        eligible,
        present: 0,
        absent: 0,
        unmarked: eligible,
        attendancePct: null,
      });
    }
  }

  const sessionPcts = sessions.map((s) => s.attendancePct).filter((v): v is number => v != null);
  const attendancePct =
    sessionPcts.length > 0 ? sessionPcts.reduce((a, b) => a + b, 0) / sessionPcts.length : null;

  let everPresent = 0;
  let neverPresent = 0;
  for (const st of students) {
    const values = Object.values(st.marks);
    if (values.some((m) => m === "present")) everPresent += 1;
    else if (values.some((m) => m === "absent")) neverPresent += 1;
    else neverPresent += 1;
  }

  const poc =
    sessions.find((s) => s.poc)?.poc ||
    metas.find((m) => companyKey(m.company) === companyKey(sheet.name))?.poc ||
    "";
  const faculties = Array.from(
    new Set(
      [
        ...sessions.map((s) => s.faculty),
        ...metas.filter((m) => companyKey(m.company) === companyKey(sheet.name)).map((m) => m.faculty),
      ]
        .map((v) => v.trim())
        .filter(Boolean),
    ),
  );
  const faculty = faculties.join(", ");

  const baseSlug = slugify(sheet.name);
  const n = usedSlugs.get(baseSlug) ?? 0;
  usedSlugs.set(baseSlug, n + 1);
  const slug = n === 0 ? baseSlug : `${baseSlug}-${n + 1}`;

  const sheetUrl = sheet.gid
    ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${sheet.gid}`
    : `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  return {
    name: sheet.name.trim(),
    slug,
    sheetName: sheet.name,
    gid: sheet.gid,
    sheetUrl,
    poc,
    faculty,
    faculties,
    sessionCount: sessions.length,
    eligible,
    presentUnique: everPresent,
    everPresent,
    neverPresent,
    attendancePct,
    sessions,
    students,
  };
}

export function buildDashboard(
  spreadsheetId: string,
  sheets: RawSheet[],
  title = "Preparation session attendance",
): DashboardData {
  const warnings: string[] = [];
  const metaSheet = sheets.find((s) => isMetaSheetName(s.name));
  const metas = metaSheet ? parseMetaSheet(metaSheet.rows) : [];
  if (metaSheet && metas.length === 0) {
    warnings.push(
      `Found sheet “${metaSheet.name}” but could not read session rows. Use a header row with Company, POC, Faculty, Date, Time, Venue.`,
    );
  }

  const usedSlugs = new Map<string, number>();
  const companies: CompanyRecord[] = [];
  for (const sheet of sheets) {
    if (isMetaSheetName(sheet.name)) continue;
    const rec = parseAttendanceSheet(sheet, spreadsheetId, metas, usedSlugs);
    if (rec) companies.push(rec);
    else warnings.push(`Skipped empty sheet “${sheet.name.trim()}”.`);
  }

  companies.sort((a, b) => a.name.localeCompare(b.name));

  return {
    spreadsheetId,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    title,
    fetchedAt: new Date().toISOString(),
    companies,
    warnings,
    hasMetaSheet: Boolean(metaSheet),
    metaSheetName: metaSheet?.name ?? null,
  };
}

export function sheetsFromWorkbookAoA(
  names: string[],
  data: Record<string, unknown[][]>,
  gids: Record<string, string | null>,
): RawSheet[] {
  return names.map((name) => {
    const aoa = data[name] ?? [];
    const rows = aoa.map((row) => {
      const arr = Array.isArray(row) ? row : [];
      return arr.map((c) => cell(c));
    });
    return { name, gid: gids[name] ?? null, rows };
  });
}
