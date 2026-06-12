import { useState } from "react";
import { getClassLabel, SUBJECTS } from "../../staff/data/academics";
import { MOCK_STAFF } from "../../staff/data/mockStaff";
import { useTimetableStore } from "../store/useTimetableStore";
import type { ConflictItem, TeacherDaySummary } from "../utils/conflictUtils";
import { DAYS, MAX_PERIODS_PER_DAY } from "../utils/conflictUtils";
import { PERIOD_CONFIG } from "../data/timetableConfig";

type Props = {
  conflicts: ConflictItem[];
  teacherSummaries: TeacherDaySummary[];
};

function PeriodLabel({ period }: { period: number }) {
  const cfg = PERIOD_CONFIG.find((p) => p.period === period);
  return <>{cfg ? `P${period} (${cfg.start})` : `P${period}`}</>;
}

function LoadBar({ load, max = MAX_PERIODS_PER_DAY }: { load: number; max?: number }) {
  const pct = Math.min((load / max) * 100, 100);
  const color =
    load > max ? "bg-error-500" :
    load === max ? "bg-warning-500" :
    load >= max - 1 ? "bg-warning-400" :
    "bg-brand-500";

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-[10px] font-semibold tabular-nums ${load > max ? "text-error-600" : load === max ? "text-warning-600" : "text-gray-500"} dark:text-opacity-80`}>
        {load}/{max}
      </span>
    </div>
  );
}

export function ConflictPanel({ conflicts, teacherSummaries }: Props) {
  const { upsertSlot } = useTimetableStore();
  const [activeTab, setActiveTab] = useState<"issues" | "load">("issues");
  const [collapsed, setCollapsed] = useState(false);
  const [applied, setApplied] = useState<Set<string>>(new Set());

  const errors   = conflicts.filter((c) => c.severity === "error");
  const warnings = conflicts.filter((c) => c.severity === "warning");
  const overloaded = teacherSummaries.filter((s) => s.isOverloaded);

  function applyFix(conflict: ConflictItem, suggestionIdx: number) {
    const suggestion = conflict.suggestions[suggestionIdx];
    if (!suggestion || !conflict.fixClassId || !conflict.fixSubjectId) return;
    upsertSlot({
      classId: conflict.fixClassId,
      day: conflict.day,
      period: conflict.period!,
      subjectId: conflict.fixSubjectId,
      teacherId: suggestion.suggestedTeacherId,
      academicYear: "2025-26",
    });
    setApplied((prev) => new Set(prev).add(conflict.id));
  }

  const totalIssues = errors.length + warnings.length;

  return (
    <div className={`rounded-2xl border shadow-theme-xs transition-all ${
      errors.length > 0
        ? "border-error-200 bg-error-50/40 dark:border-error-500/20 dark:bg-error-500/5"
        : warnings.length > 0
        ? "border-warning-200 bg-warning-50/40 dark:border-warning-500/20 dark:bg-warning-500/5"
        : "border-success-200 bg-success-50/40 dark:border-success-500/20 dark:bg-success-500/5"
    }`}>
      {/* Header */}
      <div
        className="flex cursor-pointer items-center justify-between px-5 py-3.5"
        onClick={() => setCollapsed((c) => !c)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setCollapsed((c) => !c)}
      >
        <div className="flex items-center gap-3">
          {totalIssues === 0 ? (
            <span className="text-success-600 dark:text-success-400">✓</span>
          ) : (
            <span className="text-error-600 dark:text-error-400">⚠</span>
          )}
          <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
            {totalIssues === 0
              ? "No conflicts — timetable looks good!"
              : `${totalIssues} issue${totalIssues !== 1 ? "s" : ""} found`}
          </span>
          {errors.length > 0 && (
            <span className="rounded-full bg-error-100 px-2 py-0.5 text-[10px] font-bold text-error-700 dark:bg-error-500/20 dark:text-error-400">
              {errors.length} error{errors.length !== 1 ? "s" : ""}
            </span>
          )}
          {warnings.length > 0 && (
            <span className="rounded-full bg-warning-100 px-2 py-0.5 text-[10px] font-bold text-warning-700 dark:bg-warning-500/20 dark:text-warning-400">
              {warnings.length} warning{warnings.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <svg
          viewBox="0 0 20 20" className={`size-4 fill-current text-gray-400 transition-transform ${collapsed ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>

      {!collapsed && (
        <div className="border-t border-gray-200 dark:border-gray-800">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 px-5 dark:border-gray-800">
            <button type="button" onClick={() => setActiveTab("issues")}
              className={`mr-4 border-b-2 py-2.5 text-xs font-semibold transition ${activeTab === "issues" ? "border-brand-500 text-brand-600 dark:text-brand-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"}`}>
              Issues ({totalIssues})
            </button>
            <button type="button" onClick={() => setActiveTab("load")}
              className={`mr-4 border-b-2 py-2.5 text-xs font-semibold transition ${activeTab === "load" ? "border-brand-500 text-brand-600 dark:text-brand-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"}`}>
              Teacher load
              {overloaded.length > 0 && (
                <span className="ml-1.5 rounded-full bg-warning-100 px-1.5 py-0.5 text-[10px] font-bold text-warning-700 dark:bg-warning-500/20 dark:text-warning-400">
                  {overloaded.length}
                </span>
              )}
            </button>
          </div>

          {/* Issues tab */}
          {activeTab === "issues" && (
            <div className="p-5">
              {totalIssues === 0 ? (
                <p className="text-sm text-success-600 dark:text-success-400">
                  ✓ All teacher assignments are valid. No double-bookings or overloaded days.
                </p>
              ) : (
                <div className="space-y-3">
                  {[...errors, ...warnings].map((conflict) => (
                    <div key={conflict.id}
                      className={`rounded-xl border p-4 ${
                        conflict.severity === "error"
                          ? "border-error-200 bg-white dark:border-error-500/30 dark:bg-gray-900"
                          : "border-warning-200 bg-white dark:border-warning-500/30 dark:bg-gray-900"
                      }`}>
                      <div className="flex items-start gap-2">
                        <span className={`mt-0.5 text-sm ${conflict.severity === "error" ? "text-error-500" : "text-warning-500"}`}>
                          {conflict.severity === "error" ? "🔴" : "🟡"}
                        </span>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-800 dark:text-white/90">{conflict.message}</p>

                          {conflict.type === "DOUBLE_BOOKING" && conflict.period && (
                            <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                              Classes: {conflict.affectedClasses.join(" & ")} · <PeriodLabel period={conflict.period} /> · {conflict.day}
                            </p>
                          )}
                          {conflict.type === "MAX_PERIODS_EXCEEDED" && (
                            <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                              Day: {conflict.day} · Classes: {conflict.affectedClasses.join(", ")}
                            </p>
                          )}

                          {/* Suggestions */}
                          {conflict.suggestions.length > 0 && !applied.has(conflict.id) && (
                            <div className="mt-3">
                              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                💡 Suggested alternatives
                              </p>
                              <div className="space-y-1.5">
                                {conflict.suggestions.map((sug, idx) => (
                                  <div key={sug.suggestedTeacherId}
                                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                                    <div>
                                      <span className="text-[11px] font-semibold text-gray-800 dark:text-white/90">{sug.suggestedTeacherName}</span>
                                      <span className="ml-2 text-[10px] text-gray-500 dark:text-gray-400">{sug.reason}</span>
                                    </div>
                                    {conflict.fixClassId && (
                                      <button type="button"
                                        onClick={() => applyFix(conflict, idx)}
                                        className="ml-3 shrink-0 rounded-lg bg-brand-500 px-3 py-1 text-[10px] font-semibold text-white hover:bg-brand-600">
                                        Apply fix
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {applied.has(conflict.id) && (
                            <p className="mt-2 text-[11px] font-medium text-success-600 dark:text-success-400">
                              ✓ Fix applied — save to confirm
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Teacher load tab */}
          {activeTab === "load" && (
            <div className="p-5">
              <p className="mb-3 text-[10px] text-gray-500 dark:text-gray-400">
                Max {MAX_PERIODS_PER_DAY} periods per teacher per day. Red = over limit.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="pb-2 text-left font-semibold text-gray-600 dark:text-gray-400 pr-4">Teacher</th>
                      {DAYS.map((d) => (
                        <th key={d} className="pb-2 text-center font-semibold text-gray-600 dark:text-gray-400 px-2">
                          {d.slice(0, 3)}
                        </th>
                      ))}
                      <th className="pb-2 text-center font-semibold text-gray-600 dark:text-gray-400 px-2">Week</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {teacherSummaries.map((summary) => {
                      const weekTotal = Object.values(summary.loads).reduce((a, b) => a + b, 0);
                      return (
                        <tr key={summary.teacherId} className={summary.isOverloaded ? "bg-error-50/50 dark:bg-error-500/5" : ""}>
                          <td className="py-2 pr-4 font-medium text-gray-800 dark:text-white/90">
                            {summary.teacherName}
                            {summary.isOverloaded && <span className="ml-1.5 text-[9px] font-bold text-error-600 uppercase">Overloaded</span>}
                          </td>
                          {DAYS.map((d) => {
                            const load = summary.loads[d] ?? 0;
                            return (
                              <td key={d} className="py-2 px-2 text-center">
                                {load === 0 ? (
                                  <span className="text-gray-300 dark:text-gray-600">—</span>
                                ) : (
                                  <span className={`inline-flex size-5 items-center justify-center rounded-full text-[10px] font-bold ${
                                    load > MAX_PERIODS_PER_DAY
                                      ? "bg-error-100 text-error-700 dark:bg-error-500/20 dark:text-error-400"
                                      : load === MAX_PERIODS_PER_DAY
                                      ? "bg-warning-100 text-warning-700 dark:bg-warning-500/20 dark:text-warning-400"
                                      : "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
                                  }`}>
                                    {load}
                                  </span>
                                )}
                              </td>
                            );
                          })}
                          <td className="py-2 px-2 text-center font-semibold text-gray-700 dark:text-gray-300">{weekTotal}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
