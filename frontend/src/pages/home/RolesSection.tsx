const ROLES = [
  {
    role: "Principal",
    description: "School-wide overview — attendance, fees, announcements, staff, and exam results at a glance.",
    pill: "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300",
  },
  {
    role: "Teacher",
    description: "Mark attendance, enter marks, view assigned classes and subjects, and send class announcements.",
    pill: "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-300",
  },
  {
    role: "Office Staff",
    description: "Manage admissions, collect fees, issue receipts, and generate administrative reports.",
    pill: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300",
  },
  {
    role: "Parent",
    description: "View attendance, fee dues, exam results, and school announcements for their child.",
    pill: "bg-blue-light-50 text-blue-light-600 dark:bg-blue-light-500/10 dark:text-blue-light-300",
  },
  {
    role: "Student",
    description: "Access timetable, results, attendance record, and school notices from a dedicated portal.",
    pill: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  },
];

export function RolesSection() {
  return (
    <section className="bg-white py-24 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-brand-500">
            Role-based portals
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            The right view for every person
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Every user sees exactly what they need — and nothing they shouldn't.
            Permissions are enforced on the server, not just the UI.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ROLES.map((item) => (
            <div
              key={item.role}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
            >
              <span className={`mb-4 inline-flex self-start rounded-full px-3 py-1 text-xs font-semibold ${item.pill}`}>
                {item.role}
              </span>
              <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
