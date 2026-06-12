import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { TimetableSlot, Day, PeriodNumber } from "../types/timetable.types";
import { MOCK_TIMETABLE_SLOTS } from "../data/mockTimetable";
import { loadTimetable, saveTimetable } from "./timetableStorage";
import { TimetableStoreContext, type TimetableStoreValue } from "./timetableContext";

let _id = 9000;
function uid() { return `tt_${_id++}`; }

export function TimetableStoreProvider({ children }: { children: ReactNode }) {
  const [slots, setSlots] = useState<TimetableSlot[]>(() => loadTimetable() ?? MOCK_TIMETABLE_SLOTS);

  useEffect(() => { saveTimetable(slots); }, [slots]);

  const getSlot = useCallback(
    (classId: string, day: Day, period: PeriodNumber) =>
      slots.find((s) => s.classId === classId && s.day === day && s.period === period),
    [slots],
  );

  const getSlotsForClass    = useCallback((classId: string)  => slots.filter((s) => s.classId === classId),  [slots]);
  const getSlotsForTeacher  = useCallback((teacherId: string) => slots.filter((s) => s.teacherId === teacherId), [slots]);
  const getSlotsForSubject  = useCallback((subjectId: string) => slots.filter((s) => s.subjectId === subjectId), [slots]);

  const upsertSlot = useCallback<TimetableStoreValue["upsertSlot"]>((incoming) => {
    setSlots((prev) => {
      const idx = prev.findIndex(
        (s) => s.classId === incoming.classId && s.day === incoming.day && s.period === incoming.period,
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], subjectId: incoming.subjectId, teacherId: incoming.teacherId, academicYear: incoming.academicYear };
        return copy;
      }
      return [...prev, { ...incoming, id: uid() }];
    });
  }, []);

  const clearSlot = useCallback<TimetableStoreValue["clearSlot"]>((classId, day, period) => {
    setSlots((prev) => prev.filter((s) => !(s.classId === classId && s.day === day && s.period === period)));
  }, []);

  const value = useMemo<TimetableStoreValue>(
    () => ({ slots, getSlot, getSlotsForClass, getSlotsForTeacher, getSlotsForSubject, upsertSlot, clearSlot }),
    [slots, getSlot, getSlotsForClass, getSlotsForTeacher, getSlotsForSubject, upsertSlot, clearSlot],
  );

  return <TimetableStoreContext.Provider value={value}>{children}</TimetableStoreContext.Provider>;
}
