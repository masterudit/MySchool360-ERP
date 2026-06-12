import { UPCOMING_EVENTS, type UpcomingEvent } from "../data/mockDashboard";

const CATEGORY_TONE: Record<UpcomingEvent["category"], string> = {
  Examination: "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300",
  Meeting: "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400",
  Event: "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400",
  Holiday: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export function UpcomingEvents() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
      <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
          Upcoming
        </h3>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
        {UPCOMING_EVENTS.map((event) => (
          <li key={event.id} className="flex items-start justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {event.title}
              </p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {event.date}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${CATEGORY_TONE[event.category]}`}
            >
              {event.category}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
