import type { Student } from "../types/student.types";
import type { StudentFormValues } from "../schemas/student.schema";
import { CURRENT_ACADEMIC_YEAR } from "../data/studentOptions";

export const EMPTY_STUDENT_FORM: StudentFormValues = {
  photoUrl: null,
  admissionNumber: "",
  rollNumber: "",
  admissionDate: new Date().toISOString().slice(0, 10),
  academicYear: CURRENT_ACADEMIC_YEAR,
  currentClassId: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  sex: "MALE",
  bloodGroup: "UNKNOWN",
  email: "",
  phone: "",
  address: { line1: "", line2: "", city: "", state: "Maharashtra", pincode: "" },
  status: "ACTIVE",
  guardian: {
    firstName: "", lastName: "", relationship: "FATHER",
    phone: "", email: "", occupation: "", isPrimary: true,
  },
};

export function studentToFormValues(s: Student): StudentFormValues {
  const primary = s.guardians.find((g) => g.isPrimary) ?? s.guardians[0];
  return {
    photoUrl: s.photoUrl ?? null,
    admissionNumber: s.admissionNumber,
    rollNumber: s.rollNumber ?? "",
    admissionDate: s.admissionDate,
    academicYear: s.academicYear,
    currentClassId: s.currentClassId,
    firstName: s.firstName,
    lastName: s.lastName,
    dateOfBirth: s.dateOfBirth,
    sex: s.sex,
    bloodGroup: s.bloodGroup,
    email: s.email ?? "",
    phone: s.phone ?? "",
    address: {
      line1: s.address.line1,
      line2: s.address.line2 ?? "",
      city: s.address.city,
      state: s.address.state,
      pincode: s.address.pincode,
    },
    status: s.status,
    guardian: primary
      ? {
          firstName: primary.firstName,
          lastName: primary.lastName,
          relationship: primary.relationship,
          phone: primary.phone,
          email: primary.email ?? "",
          occupation: primary.occupation ?? "",
          isPrimary: true,
        }
      : EMPTY_STUDENT_FORM.guardian,
  };
}
