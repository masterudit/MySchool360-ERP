import { Link, useNavigate } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import { StudentForm } from "../components/StudentForm";
import { useStudentStore } from "../store/useStudentStore";
import { EMPTY_STUDENT_FORM } from "../utils/draft";
import type { StudentFormValues } from "../schemas/student.schema";
import type { GuardianRelationship } from "../types/student.types";

export function StudentNewPage() {
  const { addStudent } = useStudentStore();
  const navigate = useNavigate();

  const handleSubmit = (v: StudentFormValues) => {
    const created = addStudent({
      admissionNumber: v.admissionNumber, rollNumber: v.rollNumber || undefined,
      admissionDate: v.admissionDate, academicYear: v.academicYear, currentClassId: v.currentClassId,
      firstName: v.firstName, lastName: v.lastName, dateOfBirth: v.dateOfBirth,
      sex: v.sex, bloodGroup: v.bloodGroup as "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-" | "UNKNOWN",
      email: v.email || undefined, phone: v.phone || undefined, photoUrl: v.photoUrl ?? null,
      address: { line1: v.address.line1, line2: v.address.line2 || undefined, city: v.address.city, state: v.address.state, pincode: v.address.pincode },
      status: v.status,
      guardian: { ...v.guardian, relationship: v.guardian.relationship as GuardianRelationship, email: v.guardian.email || undefined, occupation: v.guardian.occupation || undefined, isPrimary: true },
    });
    navigate(`/students/${created.id}`, { replace: true });
  };

  return (
    <>
      <PageMeta title="Admit student | MySchool ERP" description="Student admission form" />
      <div className="mb-6">
        <Link to="/students" className="text-sm text-brand-500 hover:text-brand-600">← Back to students</Link>
        <h1 className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-3xl">Admit new student</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Fill in the student's admission and personal details.</p>
      </div>
      <StudentForm initialValues={EMPTY_STUDENT_FORM} submitLabel="Admit student" cancelHref="/students" onSubmit={handleSubmit} />
    </>
  );
}
