import { Link, Navigate, useParams } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import { getClassLabel, getSubjectName } from "../data/academics";
import { useStaffStore } from "../store/useStaffStore";
import { StaffAvatar } from "../components/StaffAvatar";
import { StaffStatusBadge } from "../components/StaffStatusBadge";
import {
  formatDate,
  formatFullName,
  formatRoleLabel,
} from "../utils/display";
import type { Sex } from "../types/staff.types";

const SEX_LABELS: Record<Sex, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
  PREFER_NOT_TO_SAY: "Prefer not to say",
};

export function StaffDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getById, toggleStatus } = useStaffStore();

  const staff = id ? getById(id) : undefined;
  if (!staff) return <Navigate to="/staff" replace />;

  return (
    <>
      <PageMeta title={`${formatFullName(staff)} | MySchool ERP`} description="Staff profile" />

      <div className="mb-6">
        <Link to="/staff" className="text-sm text-brand-500 hover:text-brand-600">
          &larr; Back to staff
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-5">
            <StaffAvatar staff={staff} size="lg" />
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                {formatFullName(staff)}
              </h1>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{formatRoleLabel(staff.role)}</span>
                {staff.department && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{staff.department}</span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span>{staff.employeeCode}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StaffStatusBadge status={staff.status} />
            <button
              type="button"
              onClick={() => toggleStatus(staff.id)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {staff.status === "ACTIVE" ? "Deactivate" : "Activate"}
            </button>
            <Link
              to={`/staff/${staff.id}/edit`}
              className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600"
            >
              Edit profile
            </Link>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Email" value={staff.email} />
          <Field label="Mobile" value={staff.phone} />
          <Field label="Gender" value={SEX_LABELS[staff.sex]} />
          <Field label="Date of joining" value={formatDate(staff.dateOfJoining)} />
          {staff.department && <Field label="Department" value={staff.department} />}
          {staff.classTeacherOf && (
            <Field label="Class teacher of" value={getClassLabel(staff.classTeacherOf)} />
          )}
        </dl>
      </div>

      {staff.role === "TEACHER" && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white/90">
              Teaching assignments
            </h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Subjects this teacher handles across classes.
            </p>
          </div>
          {staff.assignments.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No assignments yet.
            </p>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500 dark:bg-gray-900/50 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3 font-medium">Class</th>
                  <th className="px-6 py-3 font-medium">Subject</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {staff.assignments.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{getClassLabel(entry.classId)}</td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{getSubjectName(entry.subjectId)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm text-gray-800 dark:text-white/90">{value}</dd>
    </div>
  );
}
