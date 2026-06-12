import { useState } from "react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { GetStartedForm } from "./GetStartedForm";
import { SuccessView } from "./SuccessView";
import type { GetStartedFormValues } from "./schemas/getStarted.schema";

const BENEFITS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: "Free demo customised to your school",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: "Call back within one business day",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: "Talk directly with the implementation team",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: "Your data stays isolated and secure",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: "No commitment — just a conversation",
  },
];

export function GetStartedPage() {
  const [submittedValues, setSubmittedValues] = useState<GetStartedFormValues | null>(null);

  return (
    <>
      <PageMeta
        title="Get started | MySchool ERP"
        description="Request a personalised demo and call back from the MySchool ERP team."
      />

      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg bg-brand-500 text-white">
              <svg viewBox="0 0 48 48" className="size-6" fill="none" aria-hidden="true">
                <path d="M6 19 24 9l18 10-18 10L6 19Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
                <path d="M13 24v10c7 6 15 6 22 0V24M42 19v12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-base font-bold text-gray-900 dark:text-white">
              MySchool <span className="text-brand-500">ERP</span>
            </span>
          </Link>
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 transition hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-300"
          >
            Already have an account? Sign in →
          </Link>
        </div>
      </header>

      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {submittedValues ? (
            <SuccessView values={submittedValues} />
          ) : (
            <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">

              {/* Sidebar */}
              <aside className="self-start lg:sticky lg:top-24">
                <div className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-500">
                  Get started
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  Let's talk about your school
                </h1>
                <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400">
                  Fill in your details and we'll schedule a personalised demo with our
                  team — tailored to your school's size, board, and workflows.
                </p>

                <ul className="mt-8 space-y-4">
                  {BENEFITS.map((benefit) => (
                    <li key={benefit.text} className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                        {benefit.icon}
                      </span>
                      <span className="pt-1.5 text-sm text-gray-700 dark:text-gray-300">
                        {benefit.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 rounded-2xl border border-brand-100 bg-brand-50 p-5 dark:border-brand-500/20 dark:bg-brand-500/5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                    Already have credentials?
                  </p>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                    If your school is already on MySchool ERP, sign in directly.
                  </p>
                  <Link
                    to="/login"
                    className="mt-3 inline-flex items-center text-sm font-semibold text-brand-500 hover:text-brand-600"
                  >
                    Sign in to your school →
                  </Link>
                </div>
              </aside>

              {/* Form card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
                <GetStartedForm onSuccess={(values) => setSubmittedValues(values)} />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
