import { CLASS_SNAPSHOT } from "../data/mockDashboard";

function attendanceTone(pct: number): string {
  if (pct >= 95) return "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400";
  if (pct >= 90) return "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400";
  return "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400";
}

export function ClassSnapshotTable() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
          Today's class snapshot
        </h3>
        <button
          type="button"
          className="text-xs font-medium text-brand-500 hover:text-brand-600"
        >
          Open attendance
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500 dark:bg-gray-900/50 dark:text-gray-400">
            <tr>
              <th className="px-5 py-3 font-medium">Class</th>
              <th className="px-5 py-3 font-medium">Students</th>
              <th className="px-5 py-3 font-medium">Attendance</th>
              <th className="px-5 py-3 font-medium">Class teacher</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {CLASS_SNAPSHOT.map((row) => (
              <tr key={`${row.className}-${row.section}`}>
                <td className="px-5 py-3 font-medium text-gray-800 dark:text-white/90">
                  {row.className} <span className="text-gray-400">— {row.section}</span>
                </td>
                <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{row.students}</td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${attendanceTone(
                      row.attendancePct,
                    )}`}
                  >
                    {row.attendancePct.toFixed(1)}%
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{row.classTeacher}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
