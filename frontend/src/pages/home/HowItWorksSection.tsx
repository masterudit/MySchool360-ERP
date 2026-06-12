const STEPS = [
  {
    step: "01",
    title: "Set up your school",
    description:
      "Register your school, configure academic years, grades, sections, subjects, and fee structures in minutes.",
  },
  {
    step: "02",
    title: "Onboard students & staff",
    description:
      "Import students via CSV or add individually. Assign teachers to classes and subjects. Link parents automatically.",
  },
  {
    step: "03",
    title: "Run daily operations",
    description:
      "Teachers mark attendance, enter marks, and communicate with parents — all from role-specific dashboards.",
  },
  {
    step: "04",
    title: "Reports & insights",
    description:
      "Generate attendance summaries, fee collection reports, exam results, and audit logs with one click.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-gray-50 py-24 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-brand-500">
            How it works
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Up and running in a day
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            No lengthy implementation projects. No consultants. Your school
            admin can configure and launch the ERP in a single session.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connecting line — desktop */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-6 hidden h-0.5 w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-200 to-transparent dark:via-brand-900 lg:block"
          />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.step} className="relative flex flex-col items-center text-center">
                <div className="mb-5 flex size-12 items-center justify-center rounded-full border-2 border-brand-200 bg-white text-sm font-bold text-brand-500 shadow-sm dark:border-brand-800 dark:bg-gray-950">
                  {step.step}
                </div>
                <h3 className="mb-2 text-base font-semibold text-gray-800 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
