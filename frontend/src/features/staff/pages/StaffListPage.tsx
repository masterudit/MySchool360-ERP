import { useMemo, useState } from "react";
import { Link } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import { SortableHeader } from "../../../components/common/SortableHeader";
import { nextSort, type SortState } from "../../../components/common/sortUtils";
import { PlusIcon } from "../../../icons";
import { getClassLabel, getSubjectName } from "../data/academics";
import { STAFF_ROLES, STAFF_STATUSES } from "../schemas/staff.schema";
import { useStaffStore } from "../store/useStaffStore";
import { StaffAvatar } from "../components/StaffAvatar";
import { StaffStatusBadge } from "../components/StaffStatusBadge";
import { formatFullName, formatRoleLabel } from "../utils/display";
import type { StaffMember, StaffRole, StaffStatus } from "../types/staff.types";

type RoleFilter = StaffRole | "ALL";
type StatusFilter = StaffStatus | "ALL";
type SortKey = "name" | "role" | "status";

const STATUS_ORDER: Record<StaffStatus, number> = { ACTIVE: 0, INACTIVE: 1 };

function compareStaff(a: StaffMember, b: StaffMember, { key, dir }: SortState<SortKey>): number {
  let diff = 0;
  if (key === "name") {
    diff = formatFullName(a).localeCompare(formatFullName(b), "en-IN");
  } else if (key === "role") {
    diff = formatRoleLabel(a.role).localeCompare(formatRoleLabel(b.role), "en-IN");
  } else if (key === "status") {
    diff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
  }
  return dir === "asc" ? diff : -diff;
}

/** Returns unique subject names from assignments (deduped). */
function uniqueSubjectNames(staff: StaffMember): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const asn of staff.assignments) {
    const name = getSubjectName(asn.subjectId);
    if (!seen.has(name)) { seen.add(name); result.push(name); }
  }
  return result;
}

function matchesSearch(staff: StaffMember, query: string): boolean {
  if (!query) return true;
  return [staff.firstName, staff.lastName, staff.email, staff.employeeCode, staff.department ?? ""]
    .join(" ").toLowerCase().includes(query.toLowerCase());
}

const MAX_SUBJECT_PILLS = 2;

export function StaffListPage() {
  const { staff, toggleStatus } = useStaffStore();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ACTIVE");
  const [sort, setSort] = useState<SortState<SortKey>>({ key: "name", dir: "asc" });

  const filtered = useMemo(() => {
    const base = staff.filter((entry) => {
      if (roleFilter !== "ALL" && entry.role !== roleFilter) return false;
      if (statusFilter !== "ALL" && entry.status !== statusFilter) return false;
      return matchesSearch(entry, search.trim());
    });
    return [...base].sort((a, b) => compareStaff(a, b, sort));
  }, [staff, roleFilter, statusFilter, search, sort]);

  const counts = useMemo(() => ({
    total: staff.length,
    active: staff.filter((e) => e.status === "ACTIVE").length,
    teachers: staff.filter((e) => e.role === "TEACHER").length,
  }), [staff]);

  function handleSort(key: SortKey) {
    setSort((prev) => nextSort(prev, key));
  }

  return (
    <>
      <PageMeta title="Staff | MySchool ERP" description="Manage school staff and teacher assignments" />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-3xl">Staff</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {counts.active} active · {counts.teachers} teachers · {counts.total} total
          </p>
        </div>
        <Link to="/staff/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600">
          <PlusIcon className="size-4 fill-current" /> Add staff
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-4 grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 lg:col-span-2">
          Search
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, email, code, or department"
            className="h-10 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
          Role
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
            className="h-10 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90">
            <option value="ALL">All roles</option>
            {STAFF_ROLES.map((role) => (
              <option key={role} value={role}>{formatRoleLabel(role)}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
          Status
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="h-10 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90">
            <option value="ALL">All</option>
            {STAFF_STATUSES.map((s) => (
              <option key={s} value={s}>{s === "ACTIVE" ? "Active" : "Inactive"}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500 dark:bg-gray-900/50 dark:text-gray-400">
              <tr>
                <SortableHeader label="Name" sortKey="name" current={sort} onSort={handleSort} />
                <SortableHeader label="Role" sortKey="role" current={sort} onSort={handleSort} />
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">Class teacher</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">Subjects taught</th>
                <SortableHeader label="Status" sortKey="status" current={sort} onSort={handleSort} />
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    No staff matched your filters.
                  </td>
                </tr>
              )}
              {filtered.map((entry) => {
                const subjects = uniqueSubjectNames(entry);
                const visible = subjects.slice(0, MAX_SUBJECT_PILLS);
                const overflow = subjects.length - MAX_SUBJECT_PILLS;

                return (
                  <tr key={entry.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                    <td className="px-5 py-3">
                      <Link to={`/staff/${entry.id}`} className="inline-flex items-center gap-3 hover:opacity-80">
                        <StaffAvatar staff={entry} size="sm" />
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white/90">{formatFullName(entry)}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{entry.employeeCode}</p>
                        </div>
                      </Link>
                    </td>

                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                      {formatRoleLabel(entry.role)}
                      {entry.department && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">{entry.department}</p>
                      )}
                    </td>

                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                      {entry.classTeacherOf ? getClassLabel(entry.classTeacherOf) : "—"}
                    </td>

                    <td className="px-5 py-3">
                      {subjects.length === 0 ? (
                        <span className="text-gray-400 dark:text-gray-600">—</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {visible.map((name) => (
                            <span
                              key={name}
                              className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                            >
                              {name}
                            </span>
                          ))}
                          {overflow > 0 && (
                            <span
                              className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                              title={subjects.slice(MAX_SUBJECT_PILLS).join(", ")}
                            >
                              +{overflow} more
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-3">
                      <StaffStatusBadge status={entry.status} />
                    </td>

                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button type="button" onClick={() => toggleStatus(entry.id)}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                          {entry.status === "ACTIVE" ? "Deactivate" : "Activate"}
                        </button>
                        <Link to={`/staff/${entry.id}/edit`}
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
    </>
  );
}
