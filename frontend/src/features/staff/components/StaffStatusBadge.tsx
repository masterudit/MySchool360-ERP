import type { StaffStatus } from "../types/staff.types";

const STYLES: Record<StaffStatus, string> = {
  ACTIVE:
    "bg-success-50 text-success-700 ring-success-200 dark:bg-success-500/10 dark:text-success-400 dark:ring-success-500/20",
  INACTIVE:
    "bg-gray-100 text-gray-600 ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700",
};

const LABELS: Record<StaffStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

export function StaffStatusBadge({ status }: { status: StaffStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
