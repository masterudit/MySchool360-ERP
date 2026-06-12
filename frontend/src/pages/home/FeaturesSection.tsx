const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Auth & Security",
    description: "Role-based login, session management, audit logs, and per-school data isolation baked in from day one.",
    color: "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Academic Setup",
    description: "Academic years, grades, sections, subjects, timetables, and configurable grading scales for any curriculum.",
    color: "bg-blue-light-50 text-blue-light-600 dark:bg-blue-light-500/10 dark:text-blue-light-300",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Student Management",
    description: "Admissions, profiles, guardian links, CSV import, document storage, and class promotions in one place.",
    color: "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-300",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Staff Management",
    description: "Staff profiles, teacher-to-class and subject assignments, active/inactive status, and role-based access.",
    color: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Attendance",
    description: "Daily attendance by class, present/absent/late/excused statuses, corrections with audit trail, and parent visibility.",
    color: "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Fees & Payments",
    description: "Fee structures, per-student dues, discounts, offline payment recording, receipts, and outstanding-balance tracking.",
    color: "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-300",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Examinations",
    description: "Exam definitions, marks entry, configurable grading scales, result publishing, and downloadable report cards.",
    color: "bg-blue-light-50 text-blue-light-600 dark:bg-blue-light-500/10 dark:text-blue-light-300",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Announcements",
    description: "School-wide or class-targeted announcements with in-app notifications and email delivery for key events.",
    color: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Dashboards & Reports",
    description: "Role-specific dashboards for admin, teacher, and parent. CSV exports, attendance summaries, and fee reports.",
    color: "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-24 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-brand-500">
            Everything included
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            All the modules your school needs
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            No add-ons, no surprise costs. Every feature is built-in and
            accessible to your school from day one.
          </p>
        </div>

        <div id="modules" className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <div className={`mb-4 inline-flex size-12 items-center justify-center rounded-xl ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="mb-2 text-base font-semibold text-gray-800 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
