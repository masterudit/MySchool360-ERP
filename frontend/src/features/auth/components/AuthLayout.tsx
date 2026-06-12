import type { ReactNode } from "react";
import GridShape from "../../../components/common/GridShape";
import ThemeTogglerTwo from "../../../components/common/ThemeTogglerTwo";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen bg-white p-6 dark:bg-gray-900 sm:p-0">
      <div className="relative flex min-h-screen w-full flex-col lg:flex-row">
        <section className="flex w-full items-center justify-center lg:w-1/2">
          {children}
        </section>

        <aside className="relative hidden min-h-screen w-1/2 place-items-center overflow-hidden bg-brand-950 lg:grid">
          <GridShape />
          <div className="relative z-1 max-w-lg px-12 text-center">
            <div className="mx-auto mb-8 grid size-20 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <svg viewBox="0 0 48 48" className="size-12 text-white" fill="none" aria-hidden="true">
                <path d="M6 19 24 9l18 10-18 10L6 19Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
                <path d="M13 24v10c7 6 15 6 22 0V24M42 19v12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">
              MySchool ERP
            </p>
            <h1 className="mb-5 text-4xl font-semibold text-white">
              One place to run your school with clarity
            </h1>
            <p className="text-base leading-7 text-gray-400">
              Manage academics, attendance, fees, examinations, and communication securely.
            </p>
          </div>
        </aside>

        <div className="fixed bottom-6 right-6 z-50">
          <ThemeTogglerTwo />
        </div>
      </div>
    </main>
  );
}
