import { Link } from "react-router";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-950">
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,#e4e7ec_1px,transparent_1px),linear-gradient(to_bottom,#e4e7ec_1px,transparent_1px)] [background-size:48px_48px] dark:[background-image:linear-gradient(to_right,#1d2939_1px,transparent_1px),linear-gradient(to_bottom,#1d2939_1px,transparent_1px)] opacity-60"
      />
      {/* Gradient fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white dark:from-gray-950"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pb-28 sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-600 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300">
            <span className="size-1.5 rounded-full bg-brand-500" />
            Built for Indian schools
          </span>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
            One ERP.{" "}
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
              Every school.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">
            Manage academics, attendance, fees, examinations, and
            parent communication — from one secure platform designed for
            how Indian schools actually work.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/get-started"
              className="inline-flex w-full items-center justify-center rounded-xl bg-brand-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 sm:w-auto"
            >
              Get started for free
              <svg viewBox="0 0 20 20" className="ml-2 size-4 fill-current" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" />
              </svg>
            </Link>
            <a
              href="#features"
              className="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 sm:w-auto"
            >
              See what's included
            </a>
          </div>
        </div>

        {/* Mock dashboard preview */}
        <div className="mt-16 sm:mt-20">
          <div className="relative mx-auto max-w-5xl">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-2xl shadow-gray-900/10 dark:border-gray-800 dark:bg-gray-900">
              {/* Fake browser chrome */}
              <div className="flex items-center gap-1.5 border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
                <span className="size-3 rounded-full bg-error-400" />
                <span className="size-3 rounded-full bg-warning-400" />
                <span className="size-3 rounded-full bg-success-400" />
                <span className="ml-4 rounded-md bg-gray-100 px-4 py-1 text-xs text-gray-400 dark:bg-gray-800">
                  app.myschoolerp.in/dashboard
                </span>
              </div>
              {/* Dashboard preview */}
              <div className="p-6">
                <div className="mb-4">
                  <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="mt-1.5 h-3 w-64 rounded bg-gray-100 dark:bg-gray-800" />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Students", value: "1,248", color: "bg-brand-500" },
                    { label: "Attendance", value: "92.4%", color: "bg-success-500" },
                    { label: "Staff", value: "78", color: "bg-orange-500" },
                    { label: "Fees collected", value: "₹18.4L", color: "bg-blue-light-500" },
                  ].map((card) => (
                    <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                      <div className={`mb-3 size-8 rounded-lg ${card.color} opacity-20`} />
                      <p className="text-xl font-bold text-gray-800 dark:text-white">{card.value}</p>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{card.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {[80, 60, 90].map((w, i) => (
                    <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                      <div className="mb-2 h-2 rounded-full bg-gray-100 dark:bg-gray-700">
                        <div className="h-2 rounded-full bg-brand-500 opacity-60" style={{ width: `${w}%` }} />
                      </div>
                      <div className="h-2.5 w-3/4 rounded bg-gray-100 dark:bg-gray-700" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Glow */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-10 -bottom-10 h-20 bg-brand-500/20 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
