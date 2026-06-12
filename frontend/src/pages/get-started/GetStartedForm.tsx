import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Label from "../../components/form/Label";
import { DatePickerInput } from "../../components/form/DatePickerInput";
import {
  CONTACT_MODES,
  DESIGNATIONS,
  INDIAN_STATES,
  REFERRAL_SOURCES,
  SCHOOL_BOARDS,
  STAFF_COUNT_RANGES,
  STUDENT_COUNT_RANGES,
  TIME_SLOTS,
} from "./data/getStartedOptions";
import {
  EMPTY_GET_STARTED_FORM,
  getStartedSchema,
  type GetStartedFormValues,
} from "./schemas/getStarted.schema";

const inputCls =
  "h-11 w-full rounded-xl border bg-transparent px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:text-white/90";

function fieldCls(hasError: boolean) {
  return hasError
    ? "border-error-500 focus:ring-error-500/20"
    : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700";
}

function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-xs text-error-500">{msg}</p>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
      {children}
    </h3>
  );
}

function Divider() {
  return <hr className="border-gray-100 dark:border-gray-800" />;
}

type GetStartedFormProps = {
  onSuccess: (values: GetStartedFormValues) => void;
};

export function GetStartedForm({ onSuccess }: GetStartedFormProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GetStartedFormValues>({
    resolver: zodResolver(getStartedSchema),
    defaultValues: EMPTY_GET_STARTED_FORM,
  });

  const messageValue = useWatch({ control, name: "message" }) ?? "";

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  const onSubmit = async (values: GetStartedFormValues) => {
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 600));
    onSuccess(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">

      {/* ── About you ── */}
      <section>
        <SectionTitle>About you</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="fullName">Full name *</Label>
            <input
              id="fullName"
              placeholder="Ramesh Kumar Sharma"
              className={`${inputCls} ${fieldCls(Boolean(errors.fullName))}`}
              {...register("fullName")}
            />
            <Err msg={errors.fullName?.message} />
          </div>

          <div>
            <Label htmlFor="email">Email address *</Label>
            <input
              id="email"
              type="email"
              placeholder="you@school.edu"
              className={`${inputCls} ${fieldCls(Boolean(errors.email))}`}
              {...register("email")}
            />
            <Err msg={errors.email?.message} />
          </div>

          <div>
            <Label htmlFor="phone">Mobile number *</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
                +91
              </span>
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
            <Err msg={errors.phone?.message} />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="designation">Your designation *</Label>
            <select
              id="designation"
              className={`${inputCls} ${fieldCls(Boolean(errors.designation))}`}
              {...register("designation")}
            >
              {DESIGNATIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <Err msg={errors.designation?.message} />
          </div>
        </div>
      </section>

      <Divider />

      {/* ── School details ── */}
      <section>
        <SectionTitle>Your school</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="schoolName">School name *</Label>
            <input
              id="schoolName"
              placeholder="Delhi Public School, Bhopal"
              className={`${inputCls} ${fieldCls(Boolean(errors.schoolName))}`}
              {...register("schoolName")}
            />
            <Err msg={errors.schoolName?.message} />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="board">Board / Curriculum *</Label>
            <select
              id="board"
              className={`${inputCls} ${fieldCls(Boolean(errors.board))}`}
              {...register("board")}
            >
              {SCHOOL_BOARDS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <Err msg={errors.board?.message} />
          </div>

          <div>
            <Label htmlFor="city">City *</Label>
            <input
              id="city"
              placeholder="Pune"
              className={`${inputCls} ${fieldCls(Boolean(errors.city))}`}
              {...register("city")}
            />
            <Err msg={errors.city?.message} />
          </div>

          <div>
            <Label htmlFor="state">State / UT *</Label>
            <select
              id="state"
              className={`${inputCls} ${fieldCls(Boolean(errors.state))}`}
              {...register("state")}
            >
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <Err msg={errors.state?.message} />
          </div>

          <div>
            <Label htmlFor="studentCount">Number of students *</Label>
            <select
              id="studentCount"
              className={`${inputCls} ${fieldCls(Boolean(errors.studentCount))}`}
              {...register("studentCount")}
            >
              {STUDENT_COUNT_RANGES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <Err msg={errors.studentCount?.message} />
          </div>

          <div>
            <Label htmlFor="staffCount">Number of staff *</Label>
            <select
              id="staffCount"
              className={`${inputCls} ${fieldCls(Boolean(errors.staffCount))}`}
              {...register("staffCount")}
            >
              {STAFF_COUNT_RANGES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <Err msg={errors.staffCount?.message} />
          </div>
        </div>
      </section>

      <Divider />

      {/* ── Schedule a call ── */}
      <section>
        <SectionTitle>Schedule a call</SectionTitle>
        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          All times are IST (Indian Standard Time, UTC +5:30). Available Monday to Saturday.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="preferredDate">Preferred date *</Label>
            <Controller
              control={control}
              name="preferredDate"
              render={({ field }) => (
                <DatePickerInput
                  id="preferredDate"
                  value={field.value}
                  onChange={field.onChange}
                  hasError={Boolean(errors.preferredDate)}
                  minDate={today}
                  maxDate={maxDate}
                />
              )}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              You can pick any date within the next 30 days.
            </p>
            <Err msg={errors.preferredDate?.message} />
          </div>

          <div>
            <Label htmlFor="preferredTimeSlot">Preferred time slot (IST) *</Label>
            <select
              id="preferredTimeSlot"
              className={`${inputCls} ${fieldCls(Boolean(errors.preferredTimeSlot))}`}
              {...register("preferredTimeSlot")}
            >
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <Err msg={errors.preferredTimeSlot?.message} />
          </div>

          <div>
            <Label htmlFor="contactMode">Preferred contact mode *</Label>
            <select
              id="contactMode"
              className={`${inputCls} ${fieldCls(Boolean(errors.contactMode))}`}
              {...register("contactMode")}
            >
              {CONTACT_MODES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <Err msg={errors.contactMode?.message} />
          </div>
        </div>
      </section>

      <Divider />

      {/* ── Additional info ── */}
      <section>
        <SectionTitle>Anything else</SectionTitle>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="message">
              Tell us about your current challenges{" "}
              <span className="font-normal text-gray-400">(optional)</span>
            </Label>
            <textarea
              id="message"
              rows={4}
              maxLength={500}
              placeholder="E.g. we currently manage attendance in registers and need to move to a digital system..."
              className={`w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:text-white/90 ${fieldCls(Boolean(errors.message))}`}
              {...register("message")}
            />
            <p className="mt-1 text-right text-xs text-gray-400">
              {messageValue.length}/500
            </p>
            <Err msg={errors.message?.message} />
          </div>

          <div>
            <Label htmlFor="referralSource">How did you hear about us? *</Label>
            <select
              id="referralSource"
              className={`${inputCls} ${fieldCls(Boolean(errors.referralSource))}`}
              {...register("referralSource")}
            >
              {REFERRAL_SOURCES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <Err msg={errors.referralSource?.message} />
          </div>
        </div>
      </section>

      <Divider />

      {/* ── Consent + Submit ── */}
      <section>
        <div className="mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <Controller
              control={control}
              name="consent"
              render={({ field }) => (
                <input
                  type="checkbox"
                  id="consent"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="mt-0.5 size-4 shrink-0 rounded border-gray-300 accent-brand-500"
                />
              )}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              I agree to be contacted by the MySchool ERP team via the details provided above.
              I understand that my information will not be shared with third parties.{" "}
              <span className="text-error-500">*</span>
            </span>
          </label>
          <Err msg={errors.consent?.message} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting…
            </>
          ) : (
            <>
              Request a call back
              <svg viewBox="0 0 20 20" className="size-4 fill-current" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" />
              </svg>
            </>
          )}
        </button>

        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          We typically respond within one business day. No spam, ever.
        </p>
      </section>
    </form>
  );
}
