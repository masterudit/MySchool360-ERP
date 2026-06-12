import type { BloodGroup, DocumentType, GuardianRelationship, StudentSex, StudentStatus } from "../types/student.types";

export const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "UNKNOWN"];

export const STUDENT_STATUSES: { value: StudentStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "TRANSFERRED", label: "Transferred" },
  { value: "GRADUATED", label: "Graduated" },
];

export const SEX_OPTIONS: { value: StudentSex; label: string }[] = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

export const GUARDIAN_RELATIONSHIPS: { value: GuardianRelationship; label: string }[] = [
  { value: "FATHER", label: "Father" },
  { value: "MOTHER", label: "Mother" },
  { value: "GRANDPARENT", label: "Grandparent" },
  { value: "UNCLE_AUNT", label: "Uncle / Aunt" },
  { value: "SIBLING", label: "Sibling" },
  { value: "GUARDIAN", label: "Legal Guardian" },
  { value: "OTHER", label: "Other" },
];

export const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
  { value: "BIRTH_CERTIFICATE", label: "Birth Certificate" },
  { value: "TRANSFER_CERTIFICATE", label: "Transfer Certificate" },
  { value: "AADHAAR", label: "Aadhaar Card" },
  { value: "MARKSHEET", label: "Marksheet / Report Card" },
  { value: "MEDICAL", label: "Medical Records" },
  { value: "PHOTO_ID", label: "Photo Identity Proof" },
  { value: "OTHER", label: "Other" },
];

export const ACADEMIC_YEARS = [
  "2025-26",
  "2024-25",
  "2023-24",
  "2022-23",
];

export const CURRENT_ACADEMIC_YEAR = "2025-26";

// All Indian states + UTs (reuse from get-started options)
export const INDIAN_STATES_LIST = [
  "Andaman & Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam",
  "Bihar", "Chandigarh", "Chhattisgarh", "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi (NCT)", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh",
  "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
] as const;
