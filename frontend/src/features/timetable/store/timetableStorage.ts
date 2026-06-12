import type { TimetableSlot } from "../types/timetable.types";

const KEY = "myschool.timetable.v1";

export function loadTimetable(): TimetableSlot[] | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as TimetableSlot[]; }
  catch { localStorage.removeItem(KEY); return null; }
}

export function saveTimetable(slots: TimetableSlot[]): void {
  localStorage.setItem(KEY, JSON.stringify(slots));
}
