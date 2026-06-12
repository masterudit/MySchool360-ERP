import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import Label from "../../../components/form/Label";
import { DatePickerInput } from "../../../components/form/DatePickerInput";
import { ImageUpload } from "../../../components/form/ImageUpload";
import { CLASSES } from "../../staff/data/academics";
import { ACADEMIC_YEARS, BLOOD_GROUPS, GUARDIAN_RELATIONSHIPS, INDIAN_STATES_LIST, SEX_OPTIONS, STUDENT_STATUSES } from "../data/studentOptions";
import { studentFormSchema, type StudentFormValues } from "../schemas/student.schema";
import { initials } from "../utils/display";

const inp = "h-11 w-full rounded-xl border bg-transparent px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:text-white/90";
const fc = (e: boolean) => e ? "border-error-500 focus:ring-error-500/20" : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700";
function Err({ msg }: { msg?: string }) { return msg ? <p className="mt-1 text-xs text-error-500">{msg}</p> : null; }
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{children}</h3>;
}

type Props = { initialValues: StudentFormValues; submitLabel: string; cancelHref: string; onSubmit: (v: StudentFormValues) => void; };

export function StudentForm({ initialValues, submitLabel, cancelHref, onSubmit }: Props) {
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: initialValues,
  });
  useEffect(() => { reset(initialValues); }, [initialValues, reset]);

  const firstName = useWatch({ control, name: "firstName" });
  const lastName = useWatch({ control, name: "lastName" });
  const today = new Date();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Photo */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <SectionTitle>Student photo</SectionTitle>
        <Controller control={control} name="photoUrl" render={({ field }) => (
          <ImageUpload value={field.value} onChange={field.onChange} initials={initials({ firstName, lastName })} />
        )} />
      </section>

      {/* Admission */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <SectionTitle>Admission details</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="admissionNumber">Admission number *</Label>
            <input id="admissionNumber" placeholder="2025/001" className={`${inp} ${fc(Boolean(errors.admissionNumber))}`} {...register("admissionNumber")} />
            <Err msg={errors.admissionNumber?.message} />
          </div>
          <div>
            <Label htmlFor="rollNumber">Roll number</Label>
            <input id="rollNumber" placeholder="01" className={`${inp} ${fc(false)}`} {...register("rollNumber")} />
          </div>
          <div>
            <Label htmlFor="currentClassId">Class / Section *</Label>
            <select id="currentClassId" className={`${inp} ${fc(Boolean(errors.currentClassId))}`} {...register("currentClassId")}>
              <option value="">Select class</option>
              {CLASSES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <Err msg={errors.currentClassId?.message} />
          </div>
          <div>
            <Label htmlFor="academicYear">Academic year *</Label>
            <select id="academicYear" className={`${inp} ${fc(Boolean(errors.academicYear))}`} {...register("academicYear")}>
              {ACADEMIC_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="admissionDate">Admission date *</Label>
            <Controller control={control} name="admissionDate" render={({ field }) => (
              <DatePickerInput id="admissionDate" value={field.value} onChange={field.onChange} hasError={Boolean(errors.admissionDate)} maxDate={today} />
            )} />
            <Err msg={errors.admissionDate?.message} />
          </div>
          <div>
            <Label htmlFor="status">Status *</Label>
            <select id="status" className={`${inp} ${fc(false)}`} {...register("status")}>
              {STUDENT_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Personal */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <SectionTitle>Personal details</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="firstName">First name *</Label>
            <input id="firstName" className={`${inp} ${fc(Boolean(errors.firstName))}`} {...register("firstName")} />
            <Err msg={errors.firstName?.message} />
          </div>
          <div>
            <Label htmlFor="lastName">Last name *</Label>
            <input id="lastName" className={`${inp} ${fc(Boolean(errors.lastName))}`} {...register("lastName")} />
            <Err msg={errors.lastName?.message} />
          </div>
          <div>
            <Label htmlFor="dateOfBirth">Date of birth *</Label>
            <Controller control={control} name="dateOfBirth" render={({ field }) => (
              <DatePickerInput id="dateOfBirth" value={field.value} onChange={field.onChange} hasError={Boolean(errors.dateOfBirth)} maxDate={today} />
            )} />
            <Err msg={errors.dateOfBirth?.message} />
          </div>
          <div>
            <Label htmlFor="sex">Sex *</Label>
            <select id="sex" className={`${inp} ${fc(Boolean(errors.sex))}`} {...register("sex")}>
              {SEX_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <Err msg={errors.sex?.message} />
          </div>
          <div>
            <Label htmlFor="bloodGroup">Blood group *</Label>
            <select id="bloodGroup" className={`${inp} ${fc(Boolean(errors.bloodGroup))}`} {...register("bloodGroup")}>
              {BLOOD_GROUPS.map((b) => <option key={b} value={b}>{b === "UNKNOWN" ? "Not known" : b}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="phone">Student mobile <span className="text-gray-400 font-normal">(optional)</span></Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">+91</span>
              <input id="phone" type="tel" inputMode="numeric" placeholder="9876543210" className={`${inp} pl-10 ${fc(Boolean(errors.phone))}`} {...register("phone")} />
            </div>
            <Err msg={errors.phone?.message} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="email">Student email <span className="text-gray-400 font-normal">(optional)</span></Label>
            <input id="email" type="email" className={`${inp} ${fc(Boolean(errors.email))}`} {...register("email")} />
            <Err msg={errors.email?.message} />
          </div>
        </div>
      </section>

      {/* Address */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <SectionTitle>Address</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="address.line1">Address line 1 *</Label>
            <input id="address.line1" placeholder="House no., street, locality" className={`${inp} ${fc(Boolean(errors.address?.line1))}`} {...register("address.line1")} />
            <Err msg={errors.address?.line1?.message} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="address.line2">Address line 2 <span className="text-gray-400 font-normal">(optional)</span></Label>
            <input id="address.line2" placeholder="Landmark, area" className={`${inp} ${fc(false)}`} {...register("address.line2")} />
          </div>
          <div>
            <Label htmlFor="address.city">City *</Label>
            <input id="address.city" className={`${inp} ${fc(Boolean(errors.address?.city))}`} {...register("address.city")} />
            <Err msg={errors.address?.city?.message} />
          </div>
          <div>
            <Label htmlFor="address.state">State / UT *</Label>
            <select id="address.state" className={`${inp} ${fc(Boolean(errors.address?.state))}`} {...register("address.state")}>
              {INDIAN_STATES_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <Err msg={errors.address?.state?.message} />
          </div>
          <div>
            <Label htmlFor="address.pincode">Pincode *</Label>
            <input id="address.pincode" inputMode="numeric" maxLength={6} placeholder="400001" className={`${inp} ${fc(Boolean(errors.address?.pincode))}`} {...register("address.pincode")} />
            <Err msg={errors.address?.pincode?.message} />
          </div>
        </div>
      </section>

      {/* Primary guardian */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <SectionTitle>Primary guardian</SectionTitle>
        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">You can add more guardians and emergency contacts from the student's profile page.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="guardian.firstName">First name *</Label>
            <input id="guardian.firstName" className={`${inp} ${fc(Boolean(errors.guardian?.firstName))}`} {...register("guardian.firstName")} />
            <Err msg={errors.guardian?.firstName?.message} />
          </div>
          <div>
            <Label htmlFor="guardian.lastName">Last name *</Label>
            <input id="guardian.lastName" className={`${inp} ${fc(Boolean(errors.guardian?.lastName))}`} {...register("guardian.lastName")} />
            <Err msg={errors.guardian?.lastName?.message} />
          </div>
          <div>
            <Label htmlFor="guardian.relationship">Relationship *</Label>
            <select id="guardian.relationship" className={`${inp} ${fc(Boolean(errors.guardian?.relationship))}`} {...register("guardian.relationship")}>
              {GUARDIAN_RELATIONSHIPS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            <Err msg={errors.guardian?.relationship?.message} />
          </div>
          <div>
            <Label htmlFor="guardian.phone">Mobile number *</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">+91</span>
              <input id="guardian.phone" type="tel" inputMode="numeric" placeholder="9876543210" className={`${inp} pl-10 ${fc(Boolean(errors.guardian?.phone))}`} {...register("guardian.phone")} />
            </div>
            <Err msg={errors.guardian?.phone?.message} />
          </div>
          <div>
            <Label htmlFor="guardian.email">Email <span className="text-gray-400 font-normal">(optional)</span></Label>
            <input id="guardian.email" type="email" className={`${inp} ${fc(Boolean(errors.guardian?.email))}`} {...register("guardian.email")} />
            <Err msg={errors.guardian?.email?.message} />
          </div>
          <div>
            <Label htmlFor="guardian.occupation">Occupation <span className="text-gray-400 font-normal">(optional)</span></Label>
            <input id="guardian.occupation" className={`${inp} ${fc(false)}`} {...register("guardian.occupation")} />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <Link to={cancelHref} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">Cancel</Link>
        <button type="submit" disabled={isSubmitting}
          className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 disabled:opacity-60">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
