import { useState, useMemo, useCallback } from "react";
import PageMeta from "../../../components/common/PageMeta";
import { CLASSES, SUBJECTS, getClassLabel, getSubjectName } from "../../staff/data/academics";
import { MOCK_STAFF } from "../../staff/data/mockStaff";
import { useTimetableStore } from "../store/useTimetableStore";
import { TimetableGrid, type CellContent } from "../components/TimetableGrid";
import { emptyCell } from "../utils/cellUtils";
import { TimetableEditModal } from "../components/TimetableEditModal";
import { TimetableBuildGrid, type DraftSlot } from "../components/TimetableBuildGrid";
import { ConflictPanel } from "../components/ConflictPanel";
import { SUBJECT_COLORS, DEFAULT_SUBJECT_COLOR } from "../data/timetableConfig";
import { detectConflicts, buildTeacherLoadSummary } from "../utils/conflictUtils";
import type { Day, PeriodNumber, ViewMode } from "../types/timetable.types";

const ACTIVE_TEACHERS = MOCK_STAFF.filter((s) => s.role === "TEACHER" && s.status === "ACTIVE");
const CURRENT_AY = "2025-26";

const POPULATED_CLASSES = ["cls_10A","cls_10B","cls_9A","cls_8C","cls_7A"];
const TIMETABLE_CLASSES = CLASSES.filter((c) => POPULATED_CLASSES.includes(c.id));

const VIEW_MODES: { id: ViewMode; label: string; icon: string }[] = [
  { id: "class",         label: "Class-wise",     icon: "🏫" },
  { id: "teacher",       label: "Teacher-wise",    icon: "👤" },
  { id: "teacher-class", label: "Teacher × Class", icon: "🔗" },
  { id: "subject",       label: "Subject-wise",    icon: "📚" },
];

function getPrintTitle(mode: ViewMode, classId: string, teacherId: string, subjectId: string) {
  if (mode === "class")         return `Timetable — ${getClassLabel(classId)}`;
  if (mode === "teacher")       return `Timetable — ${MOCK_STAFF.find(s=>s.id===teacherId)?.firstName ?? "Teacher"}`;
  if (mode === "teacher-class") return `Timetable — ${MOCK_STAFF.find(s=>s.id===teacherId)?.firstName} × ${getClassLabel(classId)}`;
  return `Timetable — ${getSubjectName(subjectId)}`;
}

export function TimetableManagementPage() {
  const { getSlot, getSlotsForClass, getSlotsForTeacher, getSlotsForSubject, upsertSlot, clearSlot, slots } = useTimetableStore();

  const [viewMode, setViewMode]   = useState<ViewMode>("class");
  const [classId, setClassId]     = useState(TIMETABLE_CLASSES[0].id);
  const [teacherId, setTeacherId] = useState(ACTIVE_TEACHERS[0]?.id ?? "");
  const [subjectId, setSubjectId] = useState(SUBJECTS[0].id);
  const [editTarget, setEditTarget] = useState<{ day: Day; period: PeriodNumber } | null>(null);
  const [isBuildMode, setIsBuildMode] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // ── Conflict detection ────────────────────────────────────────────────────
  const conflicts     = useMemo(() => detectConflicts(slots, MOCK_STAFF), [slots]);
  const teacherLoads  = useMemo(() => buildTeacherLoadSummary(slots, MOCK_STAFF), [slots]);
  const errorCount    = conflicts.filter((c) => c.severity === "error").length;
  const warningCount  = conflicts.filter((c) => c.severity === "warning").length;

  // ── Cell content builders ─────────────────────────────────────────────────
  const classViewCell = useCallback((day: Day, period: PeriodNumber): CellContent => {
    const s = getSlot(classId, day, period);
    if (!s) return emptyCell();
    const teacher = MOCK_STAFF.find((t) => t.id === s.teacherId);
    const colors = SUBJECT_COLORS[s.subjectId] ?? DEFAULT_SUBJECT_COLOR;
    // Highlight conflicting cells
    const hasConflict = conflicts.some(
      (c) => c.type === "DOUBLE_BOOKING" && c.fixClassId === classId && c.period === period && c.day === day
    );
    return {
      line1: getSubjectName(s.subjectId),
      line2: teacher ? `${teacher.firstName} ${teacher.lastName.charAt(0)}.` : undefined,
      colorClass: hasConflict
        ? "bg-error-50 text-error-800 border-error-300 dark:bg-error-500/10 dark:text-error-300 dark:border-error-500/30"
        : colors.cell,
    };
  }, [classId, getSlot, conflicts]);

  const teacherViewCell = useCallback((day: Day, period: PeriodNumber): CellContent => {
    const s = getSlotsForTeacher(teacherId).find((sl) => sl.day === day && sl.period === period);
    if (!s) return { line1: "", isEmpty: true };
    const colors = SUBJECT_COLORS[s.subjectId] ?? DEFAULT_SUBJECT_COLOR;
    return { line1: getClassLabel(s.classId), line2: getSubjectName(s.subjectId), colorClass: colors.cell };
  }, [teacherId, getSlotsForTeacher]);

  const teacherClassViewCell = useCallback((day: Day, period: PeriodNumber): CellContent => {
    const s = getSlot(classId, day, period);
    if (!s || s.teacherId !== teacherId) return { line1: "", isEmpty: true };
    const colors = SUBJECT_COLORS[s.subjectId] ?? DEFAULT_SUBJECT_COLOR;
    return { line1: getSubjectName(s.subjectId), line2: getClassLabel(classId), colorClass: colors.cell };
  }, [classId, teacherId, getSlot]);

  const subjectViewCell = useCallback((day: Day, period: PeriodNumber): CellContent => {
    const matching = getSlotsForSubject(subjectId).filter((sl) => sl.day === day && sl.period === period);
    if (matching.length === 0) return { line1: "", isEmpty: true };
    const colors = SUBJECT_COLORS[subjectId] ?? DEFAULT_SUBJECT_COLOR;
    if (matching.length === 1) {
      const s = matching[0];
      const teacher = MOCK_STAFF.find((t) => t.id === s.teacherId);
      return { line1: getClassLabel(s.classId), line2: teacher ? `${teacher.firstName} ${teacher.lastName.charAt(0)}.` : undefined, colorClass: colors.cell };
    }
    return { line1: matching.map((s) => getClassLabel(s.classId).replace("Class ", "")).join(", "), line2: `${matching.length} classes`, colorClass: colors.cell };
  }, [subjectId, getSlotsForSubject]);

  const getCellContent = useMemo(() => {
    if (viewMode === "class")         return classViewCell;
    if (viewMode === "teacher")       return teacherViewCell;
    if (viewMode === "teacher-class") return teacherClassViewCell;
    return subjectViewCell;
  }, [viewMode, classViewCell, teacherViewCell, teacherClassViewCell, subjectViewCell]);

  const canEdit = viewMode === "class";

  // ── Build mode save ───────────────────────────────────────────────────────
  function handleBuildSave(draft: Map<string, DraftSlot>) {
    // Apply all draft slots
    for (const [key, slot] of draft) {
      const [day, period] = key.split(":") as [Day, string];
      if (slot.subjectId && slot.teacherId) {
        upsertSlot({ classId, day, period: parseInt(period) as PeriodNumber, subjectId: slot.subjectId, teacherId: slot.teacherId, academicYear: CURRENT_AY });
      }
    }
    setIsBuildMode(false);
  }

  // ── Clear class timetable ─────────────────────────────────────────────────
  function handleClearClass() {
    const classDays: Day[] = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
    for (const day of classDays) {
      for (let p = 1; p <= 8; p++) {
        clearSlot(classId, day, p as PeriodNumber);
      }
    }
    setShowClearConfirm(false);
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  const classStats = useMemo(() => {
    if (viewMode !== "class") return null;
    const cs = getSlotsForClass(classId);
    return { filled: cs.length, total: 5 * 8, subjects: new Set(cs.map(s => s.subjectId)).size, empty: 5 * 8 - cs.length };
  }, [viewMode, classId, getSlotsForClass]);

  const printTitle = getPrintTitle(viewMode, classId, teacherId, subjectId);

  return (
    <>
      <PageMeta title="Timetable Management | MySchool ERP" description="View and manage class timetables" />

      {/* Print header */}
      <div className="hidden print:block print:mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">MySchool ERP · Academic Year {CURRENT_AY}</p>
            <h2 className="text-lg font-bold text-gray-900">{printTitle}</h2>
          </div>
          <p className="text-xs text-gray-400">Printed: {new Date().toLocaleDateString("en-IN")}</p>
        </div>
        <hr className="mt-2 border-gray-300" />
      </div>

      {/* Page header */}
      <div className="mb-6 flex flex-col gap-3 print:hidden sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-3xl">Timetable Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Academic Year {CURRENT_AY} · 8 periods · 40 min each · Lunch after P4
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(errorCount > 0 || warningCount > 0) && (
            <div className="flex items-center gap-1.5">
              {errorCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full border border-error-200 bg-error-50 px-3 py-1.5 text-xs font-medium text-error-700 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
                  🔴 {errorCount} error{errorCount !== 1 ? "s" : ""}
                </span>
              )}
              {warningCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full border border-warning-200 bg-warning-50 px-3 py-1.5 text-xs font-medium text-warning-700 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-400">
                  🟡 {warningCount} warning{warningCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          )}
          <button type="button" onClick={() => window.navigator.share?.({ title: printTitle, url: window.location.href }).catch(() => { window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(printTitle + "\n" + window.location.href)}`, "_blank", "noopener"); }) || window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(printTitle + "\n" + window.location.href)}`, "_blank", "noopener")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">
            <svg viewBox="0 0 20 20" className="size-4 fill-current" aria-hidden="true"><path d="M13 4.5a2.5 2.5 0 11.702 1.737L6.97 9.604a2.518 2.518 0 010 .792l6.733 3.367a2.5 2.5 0 11-.671 1.341l-6.733-3.367a2.5 2.5 0 110-3.474l6.733-3.366A2.52 2.52 0 0113 4.5z"/></svg>
            Share
          </button>
          <button type="button" onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600">
            <svg viewBox="0 0 20 20" className="size-4 fill-current" aria-hidden="true"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a1 1 0 001 1h8a1 1 0 001-1v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a1 1 0 00-1-1H6a1 1 0 00-1 1zm2 0h6v3H7V4zm-1 9v-1h8v1a.5.5 0 01-.5.5h-7A.5.5 0 016 13zm7-4a1 1 0 110 2 1 1 0 010-2z" clipRule="evenodd"/></svg>
            Print / PDF
          </button>
        </div>
      </div>

      {/* Conflict panel — always visible */}
      <div className="mb-5 print:hidden">
        <ConflictPanel conflicts={conflicts} teacherSummaries={teacherLoads} />
      </div>

      {/* View mode tabs */}
      <div className="mb-4 flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 print:hidden">
        {VIEW_MODES.map((vm) => (
          <button key={vm.id} type="button" onClick={() => { setViewMode(vm.id); setIsBuildMode(false); }}
            className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${viewMode === vm.id ? "bg-brand-500 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"}`}>
            <span className="mr-1.5">{vm.icon}</span>{vm.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-end gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 print:hidden">
        {(viewMode === "class" || viewMode === "teacher-class") && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Class</label>
            <select value={classId} onChange={(e) => setClassId(e.target.value)}
              className="h-10 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90">
              {TIMETABLE_CLASSES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
        )}
        {(viewMode === "teacher" || viewMode === "teacher-class") && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Teacher</label>
            <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)}
              className="h-10 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90">
              {ACTIVE_TEACHERS.map((t) => <option key={t.id} value={t.id}>{t.firstName} {t.lastName} ({t.department})</option>)}
            </select>
          </div>
        )}
        {viewMode === "subject" && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Subject</label>
            <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}
              className="h-10 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90">
              {SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        )}

        {classStats && (
          <div className="ml-auto flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span><strong className="text-gray-800 dark:text-white">{classStats.filled}</strong>/{classStats.total} filled</span>
            <span><strong className="text-gray-800 dark:text-white">{classStats.subjects}</strong> subjects</span>
            {classStats.empty > 0 && <span className="text-warning-600 dark:text-warning-400"><strong>{classStats.empty}</strong> empty</span>}

            {canEdit && !isBuildMode && (
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsBuildMode(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-600">
                  ✏️ Build timetable
                </button>
                <button type="button" onClick={() => setShowClearConfirm(true)}
                  className="rounded-lg border border-error-200 bg-error-50 px-3 py-1.5 text-xs font-medium text-error-600 hover:bg-error-100 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
                  Clear class
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Subject legend */}
      {viewMode !== "subject" && !isBuildMode && (
        <div className="mb-4 flex flex-wrap gap-1.5 print:hidden">
          {SUBJECTS.filter((s) => SUBJECT_COLORS[s.id]).map((s) => {
            const col = SUBJECT_COLORS[s.id];
            return (
              <span key={s.id} className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${col.badge}`}>
                {s.shortName}
              </span>
            );
          })}
        </div>
      )}

      {/* Grid or Build mode */}
      {isBuildMode && viewMode === "class" ? (
        <TimetableBuildGrid
          classId={classId}
          academicYear={CURRENT_AY}
          onSave={handleBuildSave}
          onCancel={() => setIsBuildMode(false)}
        />
      ) : (
        <>
          <div className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 print:hidden">{printTitle}</div>
          <TimetableGrid
            getCellContent={getCellContent}
            onCellClick={canEdit ? (d, p) => setEditTarget({ day: d, period: p }) : undefined}
            readOnly={!canEdit}
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 print:hidden">
            {viewMode === "class" && "Click any cell to add or edit. Use Build mode to fill the entire week at once."}
            {viewMode === "teacher" && "Shows all periods assigned to this teacher. Free periods are shown as empty."}
            {viewMode === "teacher-class" && "Shows only periods where this teacher teaches this class."}
            {viewMode === "subject" && "Shows all classes and teachers scheduled for this subject."}
          </p>
        </>
      )}

      {/* Edit modal */}
      {editTarget && (
        <TimetableEditModal
          classId={classId}
          day={editTarget.day}
          period={editTarget.period}
          academicYear={CURRENT_AY}
          onClose={() => setEditTarget(null)}
        />
      )}

      {/* Clear confirm dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Clear timetable?</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              This will remove all {classStats?.filled} period assignments for <strong>{getClassLabel(classId)}</strong>. This cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={() => setShowClearConfirm(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">
                Cancel
              </button>
              <button type="button" onClick={handleClearClass}
                className="rounded-xl bg-error-500 px-4 py-2 text-sm font-medium text-white hover:bg-error-600">
                Yes, clear all
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
