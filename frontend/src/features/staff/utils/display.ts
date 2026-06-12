import type { StaffMember, StaffRole } from "../types/staff.types";

const ROLE_LABELS: Record<StaffRole, string> = {
  PRINCIPAL: "Principal",
  VICE_PRINCIPAL: "Vice Principal",
  TEACHER: "Teacher",
  OFFICE_STAFF: "Office Staff",
  LIBRARIAN: "Librarian",
  ACCOUNTANT: "Accountant",
};

export function formatRoleLabel(role: StaffRole): string {
  return ROLE_LABELS[role];
}

export function formatFullName(staff: Pick<StaffMember, "firstName" | "lastName">): string {
  return `${staff.firstName} ${staff.lastName}`.trim();
}

export function formatInitials(staff: Pick<StaffMember, "firstName" | "lastName">): string {
  const first = staff.firstName.charAt(0).toUpperCase();
  const last = staff.lastName.charAt(0).toUpperCase();
  return `${first}${last}`;
}

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return DATE_FORMATTER.format(date);
}
