import type { Student } from "../types/student.types";

const KEY = "myschool.students.v1";

export function loadStudents(): Student[] | null {
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as Student[]; }
  catch { window.localStorage.removeItem(KEY); return null; }
}

export function saveStudents(students: Student[]): void {
  window.localStorage.setItem(KEY, JSON.stringify(students));
}
