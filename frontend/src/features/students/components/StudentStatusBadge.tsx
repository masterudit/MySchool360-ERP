import type { StudentStatus } from "../types/student.types";

const STYLES: Record<StudentStatus, string> = {
  ACTIVE: "bg-success-50 text-success-700 ring-success-200 dark:bg-success-500/10 dark:text-success-400 dark:ring-success-500/20",
  INACTIVE: "bg-gray-100 text-gray-600 ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700",
  TRANSFERRED: "bg-warning-50 text-warning-700 ring-warning-200 dark:bg-warning-500/10 dark:text-warning-400 dark:ring-warning-500/20",
  GRADUATED: "bg-brand-50 text-brand-700 ring-brand-200 dark:bg-brand-500/10 dark:text-brand-400 dark:ring-brand-500/20",
};

const LABELS: Record<StudentStatus, string> = {
  ACTIVE: "Active", INACTIVE: "Inactive", TRANSFERRED: "Transferred", GRADUATED: "Graduated",
};

export function StudentStatusBadge({ status }: { status: StudentStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}
