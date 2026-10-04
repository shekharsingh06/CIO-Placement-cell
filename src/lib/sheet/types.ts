export type AttendanceMark = "present" | "absent" | "unmarked";

export type StudentRow = {
  name: string;
  roll: string;
  admission: string;
  email: string;
  phone: string;
  marks: Record<string, AttendanceMark>;
};

export type SessionStat = {
  id: string;
  rawHeader: string;
  dateLabel: string;
  timeLabel: string;
  isoDate: string | null;
  venue: string;
  meetingLink: string;
  attendanceLink: string;
  poc: string;
  faculty: string;
  eligible: number;
  present: number;
  absent: number;
  unmarked: number;
  attendancePct: number | null;
};

export type CompanyRecord = {
  name: string;
  slug: string;
  sheetName: string;
  gid: string | null;
  sheetUrl: string | null;
  poc: string;
  faculty: string;
  faculties: string[];
  sessionCount: number;
  eligible: number;
  presentUnique: number;
  everPresent: number;
  neverPresent: number;
  attendancePct: number | null;
  sessions: SessionStat[];
  students: StudentRow[];
};

export type DashboardData = {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
  fetchedAt: string;
  companies: CompanyRecord[];
  warnings: string[];
  hasMetaSheet: boolean;
  metaSheetName: string | null;
};

export type LoadSheetResult =
  | { ok: true; data: DashboardData }
  | { ok: false; error: string };
