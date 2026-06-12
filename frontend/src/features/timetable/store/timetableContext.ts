import { createContext } from "react";
import type { TimetableSlot, Day, PeriodNumber } from "../types/timetable.types";

export type TimetableStoreValue = {
  slots: TimetableSlot[];
  getSlot: (classId: string, day: Day, period: PeriodNumber) => TimetableSlot | undefined;
  getSlotsForClass: (classId: string) => TimetableSlot[];
  getSlotsForTeacher: (teacherId: string) => TimetableSlot[];
  getSlotsForSubject: (subjectId: string) => TimetableSlot[];
  upsertSlot: (slot: Omit<TimetableSlot, "id">) => void;
  clearSlot: (classId: string, day: Day, period: PeriodNumber) => void;
};

export const TimetableStoreContext = createContext<TimetableStoreValue | undefined>(undefined);
