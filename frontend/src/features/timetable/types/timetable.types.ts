export type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
export type PeriodNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type TimetableSlot = {
  id: string;
  classId: string;
  academicYear: string;
  day: Day;
  period: PeriodNumber;
  subjectId: string;
  teacherId: string;
};

export type ViewMode = "class" | "teacher" | "teacher-class" | "subject";

export const DAYS: Day[] = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
];

export const PERIODS: PeriodNumber[] = [1, 2, 3, 4, 5, 6, 7, 8];
