import { Link, useNavigate } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import { StaffForm } from "../components/StaffForm";
import { useStaffStore } from "../store/useStaffStore";
import { EMPTY_STAFF_FORM } from "../utils/draft";
import type { StaffFormValues } from "../schemas/staff.schema";

export function StaffNewPage() {
  const { addStaff } = useStaffStore();
  const navigate = useNavigate();

  const handleSubmit = (values: StaffFormValues) => {
    const created = addStaff({
      ...values,
      department: values.department || undefined,
      photoUrl: values.photoUrl ?? null,
      classTeacherOf: values.classTeacherOf || null,
    });
    navigate(`/staff/${created.id}`, { replace: true });
  };

  return (
    <>
      <PageMeta title="Add staff | MySchool ERP" description="Add a new staff member" />
      <div className="mb-6">
        <Link to="/staff" className="text-sm text-brand-500 hover:text-brand-600">
          &larr; Back to staff
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-3xl">
          Add staff
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create a profile for a new teacher or staff member.
        </p>
      </div>

      <StaffForm
        initialValues={EMPTY_STAFF_FORM}
        submitLabel="Create staff"
        cancelHref="/staff"
        onSubmit={handleSubmit}
      />
    </>
  );
}
