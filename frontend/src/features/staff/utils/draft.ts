import type { StaffMember } from "../types/staff.types";
import type { StaffFormValues } from "../schemas/staff.schema";

export const EMPTY_STAFF_FORM: StaffFormValues = {
  photoUrl: null,
  employeeCode: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  sex: "PREFER_NOT_TO_SAY",
  role: "TEACHER",
  department: "",
  dateOfJoining: new Date().toISOString().slice(0, 10),
  status: "ACTIVE",
  classTeacherOf: "",
  assignments: [],
};

export function staffToFormValues(staff: StaffMember): StaffFormValues {
  return {
    photoUrl: staff.photoUrl ?? null,
    employeeCode: staff.employeeCode,
    firstName: staff.firstName,
    lastName: staff.lastName,
    email: staff.email,
    phone: staff.phone,
    sex: staff.sex,
    role: staff.role,
    department: staff.department ?? "",
    dateOfJoining: staff.dateOfJoining,
    status: staff.status,
    classTeacherOf: staff.classTeacherOf ?? "",
    assignments: staff.assignments.map((entry) => ({
      classId: entry.classId,
      subjectId: entry.subjectId,
    })),
  };
}
