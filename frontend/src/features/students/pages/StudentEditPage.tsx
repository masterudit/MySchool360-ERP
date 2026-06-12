import { useMemo } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import { StudentForm } from "../components/StudentForm";
import { useStudentStore } from "../store/useStudentStore";
import { studentToFormValues } from "../utils/draft";
import { fullName } from "../utils/display";
import type { StudentFormValues } from "../schemas/student.schema";
import type { GuardianRelationship } from "../types/student.types";

export function StudentEditPage() {
  const { id } = useParams<{ id: string }>();
  const { getById, updateStudent } = useStudentStore();
  const navigate = useNavigate();
  const student = id ? getById(id) : undefined;
  const initialValues = useMemo(() => student ? studentToFormValues(student) : null, [student]);
  if (!student || !initialValues) return <Navigate to="/students" replace />;

  const handleSubmit = (v: StudentFormValues) => {
    updateStudent(student.id, {
      admissionNumber: v.admissionNumber, rollNumber: v.rollNumber || undefined,
      admissionDate: v.admissionDate, academicYear: v.academicYear, currentClassId: v.currentClassId,
      firstName: v.firstName, lastName: v.lastName, dateOfBirth: v.dateOfBirth,
      sex: v.sex, bloodGroup: v.bloodGroup as "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-" | "UNKNOWN",
      email: v.email || undefined, phone: v.phone || undefined, photoUrl: v.photoUrl ?? null,
      address: { line1: v.address.line1, line2: v.address.line2 || undefined, city: v.address.city, state: v.address.state, pincode: v.address.pincode },
      status: v.status,
      guardian: { ...v.guardian, relationship: v.guardian.relationship as GuardianRelationship, email: v.guardian.email || undefined, occupation: v.guardian.occupation || undefined, isPrimary: true },
    });
    navigate(`/students/${student.id}`, { replace: true });
  };

  return (
    <>
      <PageMeta title={`Edit ${fullName(student)} | MySchool ERP`} description="Edit student record" />
      <div className="mb-6">
        <Link to={`/students/${student.id}`} className="text-sm text-brand-500 hover:text-brand-600">← Back to profile</Link>
        <h1 className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-3xl">Edit {fullName(student)}</h1>
      </div>
      <StudentForm initialValues={initialValues} submitLabel="Save changes" cancelHref={`/students/${student.id}`} onSubmit={handleSubmit} />
    </>
  );
}
