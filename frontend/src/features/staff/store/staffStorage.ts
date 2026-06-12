import type { StaffMember } from "../types/staff.types";

const STORAGE_KEY = "myschool.staff.records.v2";

export function loadStoredStaff(): StaffMember[] | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as StaffMember[];
    return null;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function persistStaff(staff: StaffMember[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(staff));
}
