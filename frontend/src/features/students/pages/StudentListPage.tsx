import { useMemo, useState } from "react";
import { Link } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import { SortableHeader } from "../../../components/common/SortableHeader";
import { nextSort, type SortState } from "../../../components/common/sortUtils";
import { PlusIcon } from "../../../icons";
import { CLASSES, getClassLabel } from "../../staff/data/academics";
import { useStudentStore } from "../store/useStudentStore";
import { StudentAvatar } from "../components/StudentAvatar";
import { StudentStatusBadge } from "../components/StudentStatusBadge";
import { CsvImportModal } from "../components/CsvImportModal";
import { fullName } from "../utils/display";
import type { Student, StudentStatus } from "../types/student.types";
import type { ParsedStudent } from "../utils/csvParser";

type StatusFilter = StudentStatus | "ALL";
type SortKey = "name" | "class" | "roll" | "status";

const STATUS_ORDER: Record<StudentStatus, number> = {
  ACTIVE: 0, INACTIVE: 1, TRANSFERRED: 2, GRADUATED: 3,
};

// Pre-build a map of classId → numeric sort index (grade * 10 + sectionIndex)
const CLASS_SORT_INDEX = new Map(
  CLASSES.map((c) => [c.id, c.grade * 10 + ["A", "B", "C"].indexOf(c.section)]),
);

function compareStudents(a: Student, b: Student, { key, dir }: SortState<SortKey>): number {
  let diff = 0;
  if (key === "name") {
    diff = fullName(a).localeCompare(fullName(b), "en-IN");
  } else if (key === "class") {
    diff = (CLASS_SORT_INDEX.get(a.currentClassId) ?? 999) - (CLASS_SORT_INDEX.get(b.currentClassId) ?? 999);
  } else if (key === "roll") {
    const ra = Number(a.rollNumber ?? "") || 9999;
    const rb = Number(b.rollNumber ?? "") || 9999;
    diff = ra - rb;
  } else if (key === "status") {
    diff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
  }
  return dir === "asc" ? diff : -diff;
}

function matches(s: Student, q: string) {
  if (!q) return true;
  return [s.firstName, s.lastName, s.admissionNumber, s.rollNumber ?? "", getClassLabel(s.currentClassId)]
    .join(" ").toLowerCase().includes(q.toLowerCase());
}

export function StudentListPage() {
  const { students, bulkImport } = useStudentStore();
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ACTIVE");
  const [sort, setSort] = useState<SortState<SortKey>>({ key: "name", dir: "asc" });
  const [showImport, setShowImport] = useState(false);

  const filtered = useMemo(() => {
    const base = students.filter((s) => {
      if (statusFilter !== "ALL" && s.status !== statusFilter) return false;
      if (classFilter !== "ALL" && s.currentClassId !== classFilter) return false;
      return matches(s, search.trim());
    });
    return [...base].sort((a, b) => compareStudents(a, b, sort));
  }, [students, statusFilter, classFilter, search, sort]);

  const counts = useMemo(() => ({
    total: students.length,
    active: students.filter((s) => s.status === "ACTIVE").length,
  }), [students]);

  function handleSort(key: SortKey) {
    setSort((prev) => nextSort(prev, key));
  }

  function handleImport(rows: ParsedStudent[]) {
    bulkImport(rows);
    setShowImport(false);
  }

  return (
    <>
      <PageMeta title="Students | MySchool ERP" description="Student records and admissions" />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-3xl">Students</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {counts.active} active · {counts.total} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowImport(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">
            Import CSV
          </button>
          <Link to="/students/new"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600">
            <PlusIcon className="size-4 fill-current" /> Admit student
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 lg:col-span-2">
          Search
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, admission no., class…"
            className="h-10 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
          Class
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}
            className="h-10 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90">
            <option value="ALL">All classes</option>
            {CLASSES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
          Status
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="h-10 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90">
            <option value="ALL">All</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="TRANSFERRED">Transferred</option>
            <option value="GRADUATED">Graduated</option>
          </select>
        </label>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500 dark:bg-gray-900/50 dark:text-gray-400">
              <tr>
                <SortableHeader label="Student" sortKey="name" current={sort} onSort={handleSort} />
                <SortableHeader label="Class" sortKey="class" current={sort} onSort={handleSort} />
                <SortableHeader label="Roll no." sortKey="roll" current={sort} onSort={handleSort} />
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">Guardian</th>
                <SortableHeader label="Status" sortKey="status" current={sort} onSort={handleSort} />
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                    No students matched your filters.
                  </td>
                </tr>
              )}
              {filtered.map((s) => {
                const primary = s.guardians.find((g) => g.isPrimary) ?? s.guardians[0];
                return (
                  <tr key={s.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                    <td className="px-5 py-3">
                      <Link to={`/students/${s.id}`} className="inline-flex items-center gap-3 hover:opacity-80">
                        <StudentAvatar student={s} size="sm" />
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white/90">{fullName(s)}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{s.admissionNumber}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{getClassLabel(s.currentClassId)}</td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{s.rollNumber || "—"}</td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                      {primary ? (
                        <>
                          <span>{primary.firstName} {primary.lastName}</span>
                          <span className="ml-1 text-xs text-gray-400">({primary.phone})</span>
                        </>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-3"><StudentStatusBadge status={s.status} /></td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <Link to={`/students/${s.id}`}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">
                          View
                        </Link>
                        <Link to={`/students/${s.id}/edit`}
                          className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-100 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300">
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showImport && <CsvImportModal onImport={handleImport} onClose={() => setShowImport(false)} />}
    </>
  );
}
