import { Link } from "react-router";
import type { GetStartedFormValues } from "./schemas/getStarted.schema";

type SuccessViewProps = {
  values: GetStartedFormValues;
};

export function SuccessView({ values }: SuccessViewProps) {
  const firstName = values.fullName.trim().split(" ")[0];

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 grid size-20 place-items-center rounded-full bg-success-50 dark:bg-success-500/10">
        <svg viewBox="0 0 48 48" className="size-10 text-success-500" fill="none" aria-hidden="true">
          <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2.5" />
          <path d="M14 24l7 7 13-14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
        Thank you, {firstName}!
      </h2>
      <p className="mx-auto mt-3 max-w-md text-base text-gray-600 dark:text-gray-400">
        We've received your request from{" "}
        <span className="font-medium text-gray-800 dark:text-white">{values.schoolName}</span>.
        Our team will reach out on{" "}
        <span className="font-medium text-gray-800 dark:text-white">
          {new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long" }).format(
            new Date(`${values.preferredDate}T00:00:00`),
          )}
        </span>{" "}
        between{" "}
        <span className="font-medium text-gray-800 dark:text-white">{values.preferredTimeSlot}</span>{" "}
        via{" "}
        <span className="font-medium text-gray-800 dark:text-white">{values.contactMode}</span>.
      </p>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-left dark:border-gray-800 dark:bg-gray-900 sm:w-96">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          Summary
        </p>
        <dl className="space-y-2 text-sm">
          <Row label="Name" value={values.fullName} />
          <Row label="Email" value={values.email} />
          <Row label="Mobile" value={values.phone} />
          <Row label="School" value={values.schoolName} />
          <Row label="City" value={`${values.city}, ${values.state}`} />
          <Row label="Students" value={values.studentCount} />
        </dl>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          ← Back to home
        </Link>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-brand-600"
        >
          Sign in if you have an account
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="text-right font-medium text-gray-800 dark:text-white">{value}</dd>
    </div>
  );
}
