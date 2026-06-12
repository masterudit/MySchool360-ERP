import type { TimetableSlot, Day, PeriodNumber } from "../types/timetable.types";
import type { StaffMember } from "../../staff/types/staff.types";
import { getClassLabel, getSubjectName } from "../../staff/data/academics";
import { DAYS, PERIODS } from "../types/timetable.types";

export const MAX_PERIODS_PER_DAY = 5;

// ── Types ───────────────────────────────────────────────────────────────────

export type ConflictType = "DOUBLE_BOOKING" | "MAX_PERIODS_EXCEEDED";

export type SwapSuggestion = {
  suggestedTeacherId: string;
  suggestedTeacherName: string;
  dailyLoad: number;
  reason: string;
};

export type ConflictItem = {
  id: string;
  type: ConflictType;
  severity: "error" | "warning";
  teacherId: string;
  teacherName: string;
  day: Day;
  period?: PeriodNumber;
  affectedClasses: string[];
  message: string;
  suggestions: SwapSuggestion[];
  /** The slot that should be reassigned (for auto-fix: the second/duplicate booking) */
  fixClassId?: string;
  fixSubjectId?: string;
};

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Count how many periods a teacher has on a given day across all slots */
export function teacherDayLoad(
  slots: TimetableSlot[],
  teacherId: string,
  day: Day,
  excludeClassId?: string,
  excludePeriod?: PeriodNumber,
): number {
  return slots.filter(
    (s) =>
      s.teacherId === teacherId &&
      s.day === day &&
      !(s.classId === excludeClassId && s.period === excludePeriod),
  ).length;
}

/** Teachers who are free (not assigned anywhere) at a specific day+period */
export function freeTeachersAt(
  slots: TimetableSlot[],
  allTeachers: StaffMember[],
  day: Day,
  period: PeriodNumber,
  excludeTeacherId?: string,
): StaffMember[] {
  const busyIds = new Set(
    slots
      .filter((s) => s.day === day && s.period === period)
      .map((s) => s.teacherId),
  );
  return allTeachers.filter(
    (t) => !busyIds.has(t.id) && t.id !== excludeTeacherId && t.status === "ACTIVE",
  );
}

/** Generate swap suggestions for a given slot conflict */
function buildSuggestions(
  slots: TimetableSlot[],
  allTeachers: StaffMember[],
  day: Day,
  period: PeriodNumber,
  subjectId: string,
  excludeTeacherId: string,
): SwapSuggestion[] {
  const free = freeTeachersAt(slots, allTeachers, day, period, excludeTeacherId);

  return free
    .filter((t) => {
      // Must be under the daily max
      const load = teacherDayLoad(slots, t.id, day);
      return load < MAX_PERIODS_PER_DAY;
    })
    .map((t) => {
      const load = teacherDayLoad(slots, t.id, day);
      // Does this teacher teach this subject? (check their assignments)
      const teachesSubject = t.assignments.some((a) => a.subjectId === subjectId);
      return {
        suggestedTeacherId: t.id,
        suggestedTeacherName: `${t.firstName} ${t.lastName}`,
        dailyLoad: load,
        reason: teachesSubject
          ? `Teaches ${getSubjectName(subjectId)} · ${load} period${load !== 1 ? "s" : ""} today`
          : `Free at this slot · ${load} period${load !== 1 ? "s" : ""} today`,
      };
    })
    .sort((a, b) => {
      // Prefer teachers who teach the subject, then lower load
      const aTeaches = a.reason.startsWith("Teaches");
      const bTeaches = b.reason.startsWith("Teaches");
      if (aTeaches !== bTeaches) return aTeaches ? -1 : 1;
      return a.dailyLoad - b.dailyLoad;
    })
    .slice(0, 3); // Top 3 suggestions
}

// ── Main detection function ───────────────────────────────────────────────────

export function detectConflicts(
  slots: TimetableSlot[],
  allTeachers: StaffMember[],
): ConflictItem[] {
  const conflicts: ConflictItem[] = [];
  let idCounter = 0;

  // ── 1. Double-bookings: same teacher, same day, same period, different classes ──
  const bookingMap = new Map<string, TimetableSlot[]>();
  for (const slot of slots) {
    const key = `${slot.teacherId}:${slot.day}:${slot.period}`;
    const existing = bookingMap.get(key) ?? [];
    existing.push(slot);
    bookingMap.set(key, existing);
  }

  for (const [, slotGroup] of bookingMap) {
    if (slotGroup.length < 2) continue;
    const first = slotGroup[0];
    const teacher = allTeachers.find((t) => t.id === first.teacherId);
    if (!teacher) continue;

    const classLabels = slotGroup.map((s) => getClassLabel(s.classId));
    const suggestions = buildSuggestions(
      slots, allTeachers, first.day, first.period!, first.subjectId, first.teacherId,
    );

    // Flag the second+ slots as the ones to fix
    slotGroup.slice(1).forEach((dup) => {
      conflicts.push({
        id: `conflict_${idCounter++}`,
        type: "DOUBLE_BOOKING",
        severity: "error",
        teacherId: first.teacherId,
        teacherName: `${teacher.firstName} ${teacher.lastName}`,
        day: first.day,
        period: first.period as PeriodNumber,
        affectedClasses: classLabels,
        message: `${teacher.firstName} ${teacher.lastName} is double-booked on ${first.day} Period ${first.period} in ${classLabels.join(" & ")}`,
        suggestions,
        fixClassId: dup.classId,
        fixSubjectId: dup.subjectId,
      });
    });
  }

  // ── 2. Max periods exceeded: > 5 periods per teacher per day ──────────────
  const loadMap = new Map<string, number>();
  for (const slot of slots) {
    const key = `${slot.teacherId}:${slot.day}`;
    loadMap.set(key, (loadMap.get(key) ?? 0) + 1);
  }

  for (const [key, count] of loadMap) {
    if (count <= MAX_PERIODS_PER_DAY) continue;
    const [teacherId, day] = key.split(":") as [string, Day];
    const teacher = allTeachers.find((t) => t.id === teacherId);
    if (!teacher) continue;

    // Find the periods this teacher is over-assigned on
    const overPeriods = slots
      .filter((s) => s.teacherId === teacherId && s.day === day)
      .map((s) => s.period);

    conflicts.push({
      id: `conflict_${idCounter++}`,
      type: "MAX_PERIODS_EXCEEDED",
      severity: "warning",
      teacherId,
      teacherName: `${teacher.firstName} ${teacher.lastName}`,
      day: day as Day,
      affectedClasses: [...new Set(
        slots.filter((s) => s.teacherId === teacherId && s.day === day).map((s) => getClassLabel(s.classId))
      )],
      message: `${teacher.firstName} ${teacher.lastName} has ${count} periods on ${day} (max ${MAX_PERIODS_PER_DAY})`,
      suggestions: [],
      fixClassId: undefined,
    });
    void overPeriods;
  }

  return conflicts;
}

// ── Per-teacher daily load summary ──────────────────────────────────────────

export type TeacherDaySummary = {
  teacherId: string;
  teacherName: string;
  loads: Record<Day, number>;
  maxLoad: number;
  isOverloaded: boolean;
};

export function buildTeacherLoadSummary(
  slots: TimetableSlot[],
  allTeachers: StaffMember[],
): TeacherDaySummary[] {
  return allTeachers
    .filter((t) => t.status === "ACTIVE" && t.role === "TEACHER")
    .map((teacher) => {
      const loads = {} as Record<Day, number>;
      let maxLoad = 0;
      for (const day of DAYS) {
        const count = slots.filter((s) => s.teacherId === teacher.id && s.day === day).length;
        loads[day] = count;
        if (count > maxLoad) maxLoad = count;
      }
      return {
        teacherId: teacher.id,
        teacherName: `${teacher.firstName} ${teacher.lastName}`,
        loads,
        maxLoad,
        isOverloaded: maxLoad > MAX_PERIODS_PER_DAY,
      };
    })
    .filter((s) => s.maxLoad > 0) // only show teachers with assignments
    .sort((a, b) => b.maxLoad - a.maxLoad);
}

// ── Available teachers for a given slot (used in edit modal) ─────────────────

export type TeacherAvailability = {
  teacher: StaffMember;
  dailyLoad: number;
  isAvailable: boolean;
  isOverLimit: boolean;
  isDoubleBooked: boolean;
  teachesSubject: boolean;
};

export function getTeacherAvailabilities(
  slots: TimetableSlot[],
  allTeachers: StaffMember[],
  day: Day,
  period: PeriodNumber,
  subjectId: string,
  currentClassId: string,
): TeacherAvailability[] {
  return allTeachers
    .filter((t) => t.status === "ACTIVE")
    .map((teacher) => {
      const dailyLoad = teacherDayLoad(slots, teacher.id, day, currentClassId, period);
      const busyAtPeriod = slots.some(
        (s) => s.teacherId === teacher.id && s.day === day && s.period === period && s.classId !== currentClassId,
      );
      const teachesSubject = teacher.assignments.some((a) => a.subjectId === subjectId);

      return {
        teacher,
        dailyLoad,
        isAvailable: !busyAtPeriod,
        isOverLimit: dailyLoad >= MAX_PERIODS_PER_DAY,
        isDoubleBooked: busyAtPeriod,
        teachesSubject,
      };
    })
    .sort((a, b) => {
      // Sort: available + teaches subject first, then available, then rest
      if (a.isAvailable !== b.isAvailable) return a.isAvailable ? -1 : 1;
      if (a.teachesSubject !== b.teachesSubject) return a.teachesSubject ? -1 : 1;
      return a.dailyLoad - b.dailyLoad;
    });
}

// Re-export PERIODS for convenience
export { DAYS, PERIODS };
