import { useState, useMemo } from "react";
import { SUBJECTS, getClassLabel, getSubjectName } from "../../staff/data/academics";
import { MOCK_STAFF } from "../../staff/data/mockStaff";
import type { Day, PeriodNumber } from "../types/timetable.types";
import { useTimetableStore } from "../store/useTimetableStore";
import { PERIOD_CONFIG } from "../data/timetableConfig";
import {
  getTeacherAvailabilities,
  teacherDayLoad,
  MAX_PERIODS_PER_DAY,
} from "../utils/conflictUtils";

type Props = {
  classId: string;
  day: Day;
  period: PeriodNumber;
  academicYear: string;
  onClose: () => void;
};

const ACTIVE_TEACHERS = MOCK_STAFF.filter((s) => s.status === "ACTIVE");

function LoadDots({ load, max = MAX_PERIODS_PER_DAY }: { load: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={`size-2 rounded-full ${
          i < load
            ? load > max ? "bg-error-500" : load === max ? "bg-warning-500" : "bg-brand-500"
            : "bg-gray-200 dark:bg-gray-700"
        }`} />
      ))}
      <span className="ml-1 text-[10px] text-gray-500 dark:text-gray-400">
        {load}/{max} today
      </span>
    </div>
  );
}

export function TimetableEditModal({ classId, day, period, academicYear, onClose }: Props) {
  const { getSlot, upsertSlot, clearSlot, slots } = useTimetableStore();
  const existing = getSlot(classId, day, period);
  const periodCfg = PERIOD_CONFIG.find((p) => p.period === period);

  const [subjectId, setSubjectId]   = useState(existing?.subjectId ?? "");
  const [teacherId, setTeacherId]   = useState(existing?.teacherId ?? "");
  const [saving, setSaving]         = useState(false);

  const availabilities = useMemo(
    () => subjectId
      ? getTeacherAvailabilities(slots, ACTIVE_TEACHERS, day, period, subjectId, classId)
      : [],
    [subjectId, slots, day, period, classId],
  );

  const selectedAvailability = availabilities.find((a) => a.teacher.id === teacherId);
  const isDoubleBooked  = selectedAvailability?.isDoubleBooked ?? false;
  const isAtDailyLimit  = selectedAvailability ? selectedAvailability.dailyLoad >= MAX_PERIODS_PER_DAY : false;
  const canSave = Boolean(subjectId && teacherId && !isDoubleBooked && !isAtDailyLimit);

  const selectedLoad = teacherId
    ? teacherDayLoad(slots, teacherId, day, classId, period)
    : 0;

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 150));
    upsertSlot({ classId, day, period, subjectId, teacherId, academicYear });
    setSaving(false);
    onClose();
  }

  function handleClear() {
    clearSlot(classId, day, period);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <div>
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white/90">
              {existing ? "Edit period" : "Add period"}
            </h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {getClassLabel(classId)} · {day} · {periodCfg?.label} ({periodCfg?.start}–{periodCfg?.end})
            </p>
          </div>
          <button type="button" onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">✕</button>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">Subject *</label>
            <select
              value={subjectId}
              onChange={(e) => { setSubjectId(e.target.value); setTeacherId(""); }}
              className="h-10 w-full rounded-xl border border-gray-300 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90"
            >
              <option value="">Select subject</option>
              {SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Teacher *
              <span className="ml-2 font-normal text-gray-400">(✓ = teaches subject)</span>
            </label>
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              disabled={!subjectId}
              className="h-10 w-full rounded-xl border border-gray-300 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-white/90"
            >
              <option value="">Select teacher</option>
              {availabilities.map(({ teacher, dailyLoad, isDoubleBooked: busy, isOverLimit, teachesSubject }) => {
                const tag = busy ? "⚠ Busy at this period"
                  : isOverLimit ? `⚠ ${dailyLoad}/${MAX_PERIODS_PER_DAY} today — limit reached`
                  : teachesSubject ? `✓ Teaches this · ${dailyLoad}p today`
                  : `${dailyLoad} period${dailyLoad !== 1 ? "s" : ""} today`;
                return (
                  <option key={teacher.id} value={teacher.id} disabled={busy || isOverLimit}>
                    {teacher.firstName} {teacher.lastName} — {tag}
                  </option>
                );
              })}
            </select>

            {teacherId && (
              <div className="mt-2 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800">
                <span className="text-[11px] text-gray-600 dark:text-gray-400">
                  {MOCK_STAFF.find(t => t.id === teacherId)?.firstName}'s load on {day}:
                </span>
                <LoadDots load={selectedLoad} />
              </div>
            )}

            {isDoubleBooked && (
              <div className="mt-2 flex gap-2 rounded-lg border border-error-200 bg-error-50 px-3 py-2 text-xs text-error-700 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
                <span className="shrink-0">🔴</span>
                <span>
                  <strong>Double-booking:</strong> This teacher is already assigned to another class during this period. Choose a different teacher.
                </span>
              </div>
            )}

            {isAtDailyLimit && !isDoubleBooked && (
              <div className="mt-2 flex gap-2 rounded-lg border border-warning-200 bg-warning-50 px-3 py-2 text-xs text-warning-700 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-400">
                <span className="shrink-0">🟡</span>
                <span>
                  <strong>Daily limit reached:</strong> This teacher already has {MAX_PERIODS_PER_DAY} periods on {day}. Max {MAX_PERIODS_PER_DAY} periods per day per teacher.
                </span>
              </div>
            )}
          </div>

          {subjectId && teacherId && !isDoubleBooked && !isAtDailyLimit && (
            <div className="rounded-xl border border-success-200 bg-success-50 px-4 py-2.5 dark:border-success-500/20 dark:bg-success-500/5">
              <div className="flex items-center gap-2">
                <span className="text-success-600">✓</span>
                <span className="text-sm font-semibold text-success-700 dark:text-success-300">{getSubjectName(subjectId)}</span>
                <span className="text-success-500">·</span>
                <span className="text-sm text-success-600 dark:text-success-400">
                  {MOCK_STAFF.find(t => t.id === teacherId)?.firstName} {MOCK_STAFF.find(t => t.id === teacherId)?.lastName}
                </span>
              </div>
              {selectedLoad === MAX_PERIODS_PER_DAY - 1 && (
                <p className="mt-1 text-[11px] text-warning-600 dark:text-warning-400">
                  ⚠️ This will be their last allowed period today ({MAX_PERIODS_PER_DAY}/{MAX_PERIODS_PER_DAY}).
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gray-200 px-5 py-4 dark:border-gray-800">
          <div>
            {existing && (
              <button type="button" onClick={handleClear}
                className="rounded-xl border border-error-200 bg-error-50 px-4 py-2 text-xs font-medium text-error-600 hover:bg-error-100 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
                Clear slot
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={!canSave || saving}
              className="rounded-xl bg-brand-500 px-5 py-2 text-xs font-medium text-white shadow-sm hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40">
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
