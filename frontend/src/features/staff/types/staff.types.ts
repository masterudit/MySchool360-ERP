export type StaffRole =
  | "PRINCIPAL"
  | "VICE_PRINCIPAL"
  | "TEACHER"
  | "OFFICE_STAFF"
  | "LIBRARIAN"
  | "ACCOUNTANT";

export type StaffStatus = "ACTIVE" | "INACTIVE";

export type Sex = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";

export type TeachingAssignment = {
  id: string;
  classId: string;
  subjectId: string;
};

export type StaffMember = {
  id: string;
  schoolId: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sex: Sex;
  role: StaffRole;
  department?: string;
  dateOfJoining: string;
  status: StaffStatus;
  photoUrl?: string | null;
  classTeacherOf?: string | null;
  assignments: TeachingAssignment[];
};

export type StaffDraft = Omit<StaffMember, "id" | "schoolId" | "assignments"> & {
  assignments: Omit<TeachingAssignment, "id">[];
};
