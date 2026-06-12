const STATS = [
  { value: "10+", label: "Functional modules" },
  { value: "5", label: "Role-based portals" },
  { value: "100%", label: "Data isolation per school" },
  { value: "₹0", label: "Vendor lock-in" },
];

export function StatsBar() {
  return (
    <section className="border-y border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <dt className="text-3xl font-bold text-brand-500">{stat.value}</dt>
              <dd className="mt-1 text-sm text-gray-600 dark:text-gray-400">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
