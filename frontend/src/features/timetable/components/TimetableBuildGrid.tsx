import { useState, useCallback } from "react";
import { DAYS, PERIODS, type Day, type PeriodNumber } from "../types/timetable.types";
import { LUNCH_AFTER_PERIOD, LUNCH_CONFIG, PERIOD_CONFIG, SUBJECT_COLORS, DEFAULT_SUBJECT_COLOR } from "../data/timetableConfig";
import { SUBJECTS, getClassLabel } from "../../staff/data/academics";
import { MOCK_STAFF } from "../../staff/data/mockStaff";
import { useTimetableStore } from "../store/useTimetableStore";
import {
  teacherDayLoad,
  MAX_PERIODS_PER_DAY,
  getTeacherAvailabilities,
} from "../utils/conflictUtils";
import type { TimetableSlot } from "../types/timetable.types";

const ACTIVE_TEACHERS = MOCK_STAFF.filter((s) => s.status === "ACTIVE");

// Local draft type — keyed by "day:period"
type DraftSlot = { subjectId: string; teacherId: string };
type DraftMap = Map<string, DraftSlot>;

function draftKey(day: Day, period: PeriodNumber) {
  return `${day}:${period}`;
}

type Props = {
  classId: string;
  academicYear: string;
  onSave: (draft: Map<string, DraftSlot>) => void;
  onCancel: () => void;
};

export function TimetableBuildGrid({ classId, academicYear, onSave, onCancel }: Props) {
  const { getSlot, slots } = useTimetableStore();

  // Initialise draft from existing slots
  const [draft, setDraft] = useState<DraftMap>(() => {
    const map: DraftMap = new Map();
    for (const day of DAYS) {
      for (const period of PERIODS) {
        const existing = getSlot(classId, day, period);
        if (existing) {
          map.set(draftKey(day, period), {
            subjectId: existing.subjectId,
            teacherId: existing.teacherId,
          });
        }
      }
    }
    return map;
  });

  // Simulate draft as slots for conflict checking
  const draftAsSlots = useCallback((): TimetableSlot[] => {
    const result: TimetableSlot[] = [];
    for (const [key, slot] of draft) {
      const [day, period] = key.split(":") as [Day, string];
      result.push({
        id: `draft_${key}`,
        classId,
        academicYear,
        day,
        period: parseInt(period) as PeriodNumber,
        subjectId: slot.subjectId,
        teacherId: slot.teacherId,
      });
    }
    // Add all OTHER classes' slots for conflict checking
    const otherSlots = slots.filter((s) => s.classId !== classId);
    return [...otherSlots, ...result];
  }, [draft, classId, academicYear, slots]);

  function updateCell(day: Day, period: PeriodNumber, field: "subjectId" | "teacherId", value: string) {
    const key = draftKey(day, period);
    const existing = draft.get(key) ?? { subjectId: "", teacherId: "" };
    const updated = new Map(draft);
    const newSlot = { ...existing, [field]: value };
    // Clear teacher if subject changes and teacher is no longer valid
    if (field === "subjectId") newSlot.teacherId = "";
    if (!newSlot.subjectId && !newSlot.teacherId) {
      updated.delete(key);
    } else {
      updated.set(key, newSlot);
    }
    setDraft(updated);
  }

  function clearCell(day: Day, period: PeriodNumber) {
    const updated = new Map(draft);
    updated.delete(draftKey(day, period));
    setDraft(updated);
  }

  const beforeLunch = PERIOD_CONFIG.filter((p) => p.period <= LUNCH_AFTER_PERIOD);
  const afterLunch  = PERIOD_CONFIG.filter((p) => p.period > LUNCH_AFTER_PERIOD);

  // Count filled cells
  const filled = draft.size;
  const total  = DAYS.length * PERIODS.length;
  const allSlots = draftAsSlots();

  return (
    <div className="space-y-4">
      {/* Build toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 dark:border-brand-500/20 dark:bg-brand-500/5">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-brand-700 dark:text-brand-300">
            ✏️ Build mode — {getClassLabel(classId)}
          </span>
          <span className="text-xs text-brand-600 dark:text-brand-400">
            {filled}/{total} periods filled
          </span>
          {/* Progress bar */}
          <div className="hidden h-2 w-24 overflow-hidden rounded-full bg-brand-200 sm:block dark:bg-brand-900">
            <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${(filled / total) * 100}%` }} />
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">
            Cancel
          </button>
          <button type="button" onClick={() => onSave(draft)}
            className="rounded-lg bg-brand-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-brand-600 shadow-sm">
            Save timetable ({filled} periods)
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <table className="min-w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/60">
              <th className="w-20 border-b border-r border-gray-200 px-3 py-3 text-left dark:border-gray-800">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Day</span>
              </th>
              {beforeLunch.map((p) => (
                <th key={p.period} className="min-w-[130px] border-b border-r border-gray-200 px-2 py-2.5 text-center dark:border-gray-800">
                  <div className="font-bold text-gray-700 dark:text-white/80">{p.label}</div>
                  <div className="text-[10px] text-gray-400">{p.start}–{p.end}</div>
                </th>
              ))}
              <th className="min-w-[64px] border-b border-r border-gray-200 bg-amber-50/80 px-2 py-2.5 text-center dark:border-gray-800 dark:bg-amber-900/20">
                <div className="text-base">🍽️</div>
                <div className="font-bold text-amber-600 dark:text-amber-400 text-[10px]">LUNCH</div>
                <div className="text-[10px] text-amber-500">{LUNCH_CONFIG.start}–{LUNCH_CONFIG.end}</div>
              </th>
              {afterLunch.map((p) => (
                <th key={p.period} className="min-w-[130px] border-b border-r border-gray-200 px-2 py-2.5 text-center last:border-r-0 dark:border-gray-800">
                  <div className="font-bold text-gray-700 dark:text-white/80">{p.label}</div>
                  <div className="text-[10px] text-gray-400">{p.start}–{p.end}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day, dayIdx) => (
              <tr key={day} className={dayIdx % 2 === 0 ? "" : "bg-gray-50/40 dark:bg-gray-900/30"}>
                <td className="border-b border-r border-gray-200 px-3 py-2 dark:border-gray-800">
                  <div className="font-semibold text-gray-800 dark:text-white/90">{day.slice(0, 3)}</div>
                  <div className="text-[10px] text-gray-400">{day.slice(3)}</div>
                </td>
                {beforeLunch.map((p) => (
                  <BuildCell
                    key={p.period}
                    day={day}
                    period={p.period as PeriodNumber}
                    slot={draft.get(draftKey(day, p.period as PeriodNumber))}
                    allSlotsForConflict={allSlots}
                    classId={classId}
                    onSubjectChange={(v) => updateCell(day, p.period as PeriodNumber, "subjectId", v)}
                    onTeacherChange={(v) => updateCell(day, p.period as PeriodNumber, "teacherId", v)}
                    onClear={() => clearCell(day, p.period as PeriodNumber)}
                  />
                ))}
                <td className="border-b border-r border-gray-200 bg-amber-50/60 dark:border-gray-800 dark:bg-amber-900/10">
                  <div className="flex min-h-[72px] items-center justify-center text-lg">🍽️</div>
                </td>
                {afterLunch.map((p) => (
                  <BuildCell
                    key={p.period}
                    day={day}
                    period={p.period as PeriodNumber}
                    slot={draft.get(draftKey(day, p.period as PeriodNumber))}
                    allSlotsForConflict={allSlots}
                    classId={classId}
                    onSubjectChange={(v) => updateCell(day, p.period as PeriodNumber, "subjectId", v)}
                    onTeacherChange={(v) => updateCell(day, p.period as PeriodNumber, "teacherId", v)}
                    onClear={() => clearCell(day, p.period as PeriodNumber)}
                    lastCol={p.period === PERIODS[PERIODS.length - 1]}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Individual editable cell ──────────────────────────────────────────────────

type BuildCellProps = {
  day: Day;
  period: PeriodNumber;
  slot: DraftSlot | undefined;
  allSlotsForConflict: TimetableSlot[];
  classId: string;
  onSubjectChange: (v: string) => void;
  onTeacherChange: (v: string) => void;
  onClear: () => void;
  lastCol?: boolean;
};

function BuildCell({
  day, period, slot, allSlotsForConflict, classId,
  onSubjectChange, onTeacherChange, onClear, lastCol = false,
}: BuildCellProps) {
  const subjectId = slot?.subjectId ?? "";
  const teacherId = slot?.teacherId ?? "";

  const availabilities = subjectId
    ? getTeacherAvailabilities(allSlotsForConflict, ACTIVE_TEACHERS, day, period, subjectId, classId)
    : [];

  const hasConflict = teacherId
    ? allSlotsForConflict.some(
        (s) => s.teacherId === teacherId && s.day === day && s.period === period && s.classId !== classId,
      )
    : false;

  const isOverLimit = teacherId
    ? teacherDayLoad(allSlotsForConflict, teacherId, day, classId, period) >= MAX_PERIODS_PER_DAY
    : false;

  const colorClass = subjectId ? (SUBJECT_COLORS[subjectId] ?? DEFAULT_SUBJECT_COLOR).cell : "";

  const border = `border-b border-r ${lastCol ? "border-r-0" : ""} border-gray-200 dark:border-gray-800`;

  return (
    <td className={`${border} p-1.5`}>
      <div className={`min-h-[72px] rounded-lg border p-1.5 transition ${
        hasConflict
          ? "border-error-400 bg-error-50 dark:border-error-500/40 dark:bg-error-500/5"
          : isOverLimit
          ? "border-warning-400 bg-warning-50 dark:border-warning-500/40 dark:bg-warning-500/5"
          : subjectId
          ? colorClass
          : "border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/30"
      }`}>
        {/* Subject select */}
        <select value={subjectId} onChange={(e) => onSubjectChange(e.target.value)}
          className="mb-1 h-7 w-full rounded-md border-0 bg-white/70 px-1.5 text-[10px] font-semibold text-gray-800 focus:outline-hidden focus:ring-1 focus:ring-brand-400 dark:bg-gray-800/70 dark:text-white/90">
          <option value="">Subject…</option>
          {SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        {/* Teacher select */}
        <select value={teacherId} onChange={(e) => onTeacherChange(e.target.value)}
          disabled={!subjectId}
          className="h-7 w-full rounded-md border-0 bg-white/70 px-1.5 text-[10px] text-gray-700 focus:outline-hidden focus:ring-1 focus:ring-brand-400 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-gray-800/70 dark:text-white/80">
          <option value="">Teacher…</option>
          {availabilities.map(({ teacher, dailyLoad, isDoubleBooked, isOverLimit: tOver, teachesSubject }) => {
            const label = `${teacher.firstName} ${teacher.lastName} (${dailyLoad}p)${isDoubleBooked ? " ⚠ Busy" : tOver ? " ⚠ Full" : teachesSubject ? " ✓" : ""}`;
            return <option key={teacher.id} value={teacher.id}>{label}</option>;
          })}
        </select>

        {/* Conflict indicators */}
        {hasConflict && (
          <p className="mt-0.5 text-[9px] font-bold text-error-600 dark:text-error-400">🔴 Double-booked</p>
        )}
        {isOverLimit && !hasConflict && (
          <p className="mt-0.5 text-[9px] font-bold text-warning-600 dark:text-warning-400">🟡 Day limit reached</p>
        )}

        {/* Clear */}
        {(subjectId || teacherId) && (
          <button type="button" onClick={onClear}
            className="mt-0.5 text-[9px] text-gray-400 hover:text-error-500 dark:hover:text-error-400">
            × clear
          </button>
        )}
      </div>
    </td>
  );
}

export type { DraftSlot };
