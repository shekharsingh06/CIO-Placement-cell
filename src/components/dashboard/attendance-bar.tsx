import { cn } from "@/lib/utils";

export function AttendanceBar({ pct, className }: { pct: number | null; className?: string }) {
  const width = pct == null ? 0 : Math.max(0, Math.min(100, pct));
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div
        className="h-full rounded-full bg-present transition-[width] duration-[var(--motion-fast)] ease-[var(--ease-out)]"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
