// Hardcoded Indonesian day/month names — old Android TV STB browsers have
// inconsistent (or missing) Intl locale data, so we never rely on
// toLocaleDateString('id-ID', ...) for the on-screen clock/date.

const DAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function formatIndonesianDate(date: Date): string {
  const day = DAY_NAMES[date.getDay()];
  const dd = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const yyyy = date.getFullYear();
  return `${day}, ${dd} ${month} ${yyyy}`;
}

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function formatTimeDigits(date: Date): {
  hours: string;
  minutes: string;
  seconds: string;
} {
  return {
    hours: pad2(date.getHours()),
    minutes: pad2(date.getMinutes()),
    seconds: pad2(date.getSeconds()),
  };
}

// Local YYYY-MM-DD (not UTC) so "today" matches the TV's wall-clock date.
export function todayLocalISODate(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

// Converts an ISO timestamp to the local value a <input type="datetime-local">
// expects (YYYY-MM-DDTHH:MM), and back. Used by admin date-range forms.
export function toDatetimeLocalValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export function fromDatetimeLocalValue(value: string): string | null {
  if (!value) return null;
  return new Date(value).toISOString();
}

// Client-side re-check of a lifecycle window, used in addition to the
// Supabase RLS window filter so items disappear from an already-loaded
// screen the instant they expire, without waiting for a realtime event.
export function isWithinWindow(
  startsAt: string,
  endsAt: string | null,
  now: Date = new Date()
): boolean {
  const start = new Date(startsAt);
  if (now < start) return false;
  if (endsAt) {
    const end = new Date(endsAt);
    if (now > end) return false;
  }
  return true;
}
