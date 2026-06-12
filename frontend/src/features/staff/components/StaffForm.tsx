import { useEffect } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import Label from "../../../components/form/Label";
import { DatePickerInput } from "../../../components/form/DatePickerInput";
import { ImageUpload } from "../../../components/form/ImageUpload";
import { CLASSES, SUBJECTS } from "../data/academics";
import { DEPARTMENTS } from "../data/departments";
import {
  SEX_OPTIONS,
  STAFF_ROLES,
  STAFF_STATUSES,
  staffFormSchema,
  type StaffFormValues,
} from "../schemas/staff.schema";
import { formatInitials, formatRoleLabel } from "../utils/display";

const inputCls =
  "h-11 w-full rounded-lg border bg-transparent px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:text-white/90";

const SEX_LABELS: Record<(typeof SEX_OPTIONS)[number], string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
  PREFER_NOT_TO_SAY: "Prefer not to say",
};

function fieldCls(hasError: boolean) {
  return hasError
    ? "border-error-500 focus:ring-error-500/20"
    : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700";
}

function ErrorMsg({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-error-500">{message}</p>;
}

type StaffFormProps = {
  initialValues: StaffFormValues;
  submitLabel: string;
  cancelHref: string;
  onSubmit: (values: StaffFormValues) => void;
};

export function StaffForm({ initialValues, submitLabel, cancelHref, onSubmit }: StaffFormProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: initialValues,
  });

  useEffect(() => { reset(initialValues); }, [initialValues, reset]);

  const { fields, append, remove } = useFieldArray({ control, name: "assignments" });
  const role = useWatch({ control, name: "role" });
  const photoUrl = useWatch({ control, name: "photoUrl" });
  const firstName = useWatch({ control, name: "firstName" });
  const lastName = useWatch({ control, name: "lastName" });

  useEffect(() => {
    if (role !== "TEACHER") {
      setValue("classTeacherOf", "");
      setValue("assignments", []);
    }
  }, [role, setValue]);

  const today = new Date();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

      {/* Photo */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Profile photo
        </h2>
        <Controller
          control={control}
          name="photoUrl"
          render={({ field }) => (
            <ImageUpload
              value={field.value}
              onChange={field.onChange}
              initials={formatInitials({ firstName, lastName })}
              error={errors.photoUrl?.message}
            />
          )}
        />
        {/* keep photoUrl in form state — show current value for debug in dev */}
        <input type="hidden" value={photoUrl ?? ""} />
      </section>

      {/* Personal details */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Personal details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="firstName">First name *</Label>
            <input id="firstName" className={`${inputCls} ${fieldCls(Boolean(errors.firstName))}`} {...register("firstName")} />
            <ErrorMsg message={errors.firstName?.message} />
          </div>
          <div>
            <Label htmlFor="lastName">Last name *</Label>
            <input id="lastName" className={`${inputCls} ${fieldCls(Boolean(errors.lastName))}`} {...register("lastName")} />
            <ErrorMsg message={errors.lastName?.message} />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <input id="email" type="email" autoComplete="email" className={`${inputCls} ${fieldCls(Boolean(errors.email))}`} {...register("email")} />
            <ErrorMsg message={errors.email?.message} />
          </div>
          <div>
            <Label htmlFor="phone">Mobile number *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">+91</span>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                maxLength={15}
                placeholder="9876543210"
                className={`${inputCls} pl-10 ${fieldCls(Boolean(errors.phone))}`}
                {...register("phone")}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              10-digit Indian mobile number starting with 6–9
            </p>
            <ErrorMsg message={errors.phone?.message} />
          </div>
          <div>
            <Label htmlFor="sex">Gender *</Label>
            <select id="sex" className={`${inputCls} ${fieldCls(Boolean(errors.sex))}`} {...register("sex")}>
              {SEX_OPTIONS.map((s) => (
                <option key={s} value={s}>{SEX_LABELS[s]}</option>
              ))}
            </select>
            <ErrorMsg message={errors.sex?.message} />
          </div>
        </div>
      </section>

      {/* Employment */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Employment
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="employeeCode">Employee code *</Label>
            <input id="employeeCode" placeholder="EMP-001" className={`${inputCls} ${fieldCls(Boolean(errors.employeeCode))}`} {...register("employeeCode")} />
            <ErrorMsg message={errors.employeeCode?.message} />
          </div>
          <div>
            <Label htmlFor="role">Role *</Label>
            <select id="role" className={`${inputCls} ${fieldCls(Boolean(errors.role))}`} {...register("role")}>
              {STAFF_ROLES.map((r) => (
                <option key={r} value={r}>{formatRoleLabel(r)}</option>
              ))}
            </select>
            <ErrorMsg message={errors.role?.message} />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <select id="department" className={`${inputCls} ${fieldCls(Boolean(errors.department))}`} {...register("department")}>
              <option value="">— Not specified —</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <ErrorMsg message={errors.department?.message} />
          </div>
          <div>
            <Label htmlFor="dateOfJoining">Date of joining *</Label>
            <Controller
              control={control}
              name="dateOfJoining"
              render={({ field }) => (
                <DatePickerInput
                  id="dateOfJoining"
                  value={field.value}
                  onChange={field.onChange}
                  hasError={Boolean(errors.dateOfJoining)}
                  maxDate={today}
                />
              )}
            />
            <ErrorMsg message={errors.dateOfJoining?.message} />
          </div>
          <div>
            <Label htmlFor="status">Status *</Label>
            <select id="status" className={`${inputCls} ${fieldCls(Boolean(errors.status))}`} {...register("status")}>
              {STAFF_STATUSES.map((s) => (
                <option key={s} value={s}>{s === "ACTIVE" ? "Active" : "Inactive"}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Teaching assignments (teachers only) */}
      {role === "TEACHER" && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Teaching assignments
          </h2>

          <div className="mb-6">
            <Label htmlFor="classTeacherOf">Class teacher of</Label>
            <Controller
              control={control}
              name="classTeacherOf"
              render={({ field }) => (
                <select
                  id="classTeacherOf"
                  className={`${inputCls} ${fieldCls(false)}`}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <option value="">Not assigned</option>
                  {CLASSES.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.label}</option>
                  ))}
                </select>
              )}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Optional. A teacher can be class teacher of only one class.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject – class assignments</p>
              <button
                type="button"
                onClick={() => append({ classId: "", subjectId: "" })}
                className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-100 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300"
              >
                + Add row
              </button>
            </div>

            {fields.length === 0 && (
              <p className="rounded-lg border border-dashed border-gray-300 px-4 py-6 text-center text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                No assignments yet. Add classes and subjects this teacher will handle.
              </p>
            )}

            {fields.map((entry, index) => {
              const classErr = errors.assignments?.[index]?.classId?.message;
              const subjectErr = errors.assignments?.[index]?.subjectId?.message;
              return (
                <div key={entry.id} className="grid gap-3 rounded-xl border border-gray-200 p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end dark:border-gray-800">
                  <div>
                    <Label htmlFor={`assignments.${index}.classId`}>Class</Label>
                    <select
                      id={`assignments.${index}.classId`}
                      className={`${inputCls} ${fieldCls(Boolean(classErr))}`}
                      {...register(`assignments.${index}.classId`)}
                    >
                      <option value="">Select class</option>
                      {CLASSES.map((cls) => (
                        <option key={cls.id} value={cls.id}>{cls.label}</option>
                      ))}
                    </select>
                    <ErrorMsg message={classErr} />
                  </div>
                  <div>
                    <Label htmlFor={`assignments.${index}.subjectId`}>Subject</Label>
                    <select
                      id={`assignments.${index}.subjectId`}
                      className={`${inputCls} ${fieldCls(Boolean(subjectErr))}`}
                      {...register(`assignments.${index}.subjectId`)}
                    >
                      <option value="">Select subject</option>
                      {SUBJECTS.map((subj) => (
                        <option key={subj.id} value={subj.id}>{subj.name}</option>
                      ))}
                    </select>
                    <ErrorMsg message={subjectErr} />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="h-11 rounded-lg border border-error-200 bg-error-50 px-3 text-xs font-medium text-error-600 hover:bg-error-100 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="flex items-center justify-end gap-3">
        <Link
          to={cancelHref}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-300"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
