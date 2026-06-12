import { RECENT_ANNOUNCEMENTS } from "../data/mockDashboard";

export function RecentAnnouncements() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
          Recent announcements
        </h3>
        <button
          type="button"
          className="text-xs font-medium text-brand-500 hover:text-brand-600"
        >
          View all
        </button>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
        {RECENT_ANNOUNCEMENTS.map((item) => (
          <li key={item.id} className="px-5 py-4">
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {item.title}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
              <span>{item.audience}</span>
              <span aria-hidden="true">·</span>
              <span>{item.postedBy}</span>
              <span aria-hidden="true">·</span>
              <span>{item.postedAt}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
