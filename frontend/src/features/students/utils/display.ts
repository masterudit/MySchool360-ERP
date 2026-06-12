import type { Student, StudentStatus, GuardianRelationship, DocumentType } from "../types/student.types";

export function fullName(s: Pick<Student, "firstName" | "lastName">) {
  return `${s.firstName} ${s.lastName}`.trim();
}

export function initials(s: Pick<Student, "firstName" | "lastName">) {
  return `${s.firstName[0] ?? ""}${s.lastName[0] ?? ""}`.toUpperCase();
}

const DATE_FMT = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export function fmtDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : DATE_FMT.format(d);
}

export function calcAge(dob: string) {
  const d = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  if (today.getMonth() < d.getMonth() || (today.getMonth() === d.getMonth() && today.getDate() < d.getDate())) age--;
  return age;
}

export const STATUS_LABELS: Record<StudentStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  TRANSFERRED: "Transferred",
  GRADUATED: "Graduated",
};

export const RELATIONSHIP_LABELS: Record<GuardianRelationship, string> = {
  FATHER: "Father",
  MOTHER: "Mother",
  GRANDPARENT: "Grandparent",
  UNCLE_AUNT: "Uncle / Aunt",
  SIBLING: "Sibling",
  GUARDIAN: "Legal Guardian",
  OTHER: "Other",
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  BIRTH_CERTIFICATE: "Birth Certificate",
  TRANSFER_CERTIFICATE: "Transfer Certificate",
  AADHAAR: "Aadhaar Card",
  MARKSHEET: "Marksheet",
  MEDICAL: "Medical Records",
  PHOTO_ID: "Photo Identity Proof",
  OTHER: "Other",
};
