import { useMemo } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import { StaffForm } from "../components/StaffForm";
import { useStaffStore } from "../store/useStaffStore";
import { staffToFormValues } from "../utils/draft";
import { formatFullName } from "../utils/display";
import type { StaffFormValues } from "../schemas/staff.schema";

export function StaffEditPage() {
  const { id } = useParams<{ id: string }>();
  const { getById, updateStaff } = useStaffStore();
  const navigate = useNavigate();

  const staff = id ? getById(id) : undefined;

  const initialValues = useMemo<StaffFormValues | null>(
    () => (staff ? staffToFormValues(staff) : null),
    [staff],
  );

  if (!staff || !initialValues) {
    return <Navigate to="/staff" replace />;
  }

  const handleSubmit = (values: StaffFormValues) => {
    updateStaff(staff.id, {
      ...values,
      department: values.department || undefined,
      photoUrl: values.photoUrl ?? null,
      classTeacherOf: values.classTeacherOf || null,
    });
    navigate(`/staff/${staff.id}`, { replace: true });
  };

  return (
    <>
      <PageMeta
        title={`Edit ${formatFullName(staff)} | MySchool ERP`}
        description="Edit a staff member's profile and assignments"
      />
      <div className="mb-6">
        <Link to={`/staff/${staff.id}`} className="text-sm text-brand-500 hover:text-brand-600">
          &larr; Back to profile
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-3xl">
          Edit {formatFullName(staff)}
        </h1>
      </div>

      <StaffForm
        initialValues={initialValues}
        submitLabel="Save changes"
        cancelHref={`/staff/${staff.id}`}
        onSubmit={handleSubmit}
      />
    </>
  );
}
