import type { DashboardMetric } from "../data/mockDashboard";

const TONE_CLASSES: Record<NonNullable<DashboardMetric["tone"]>, string> = {
  positive: "text-success-600 dark:text-success-500",
  negative: "text-error-600 dark:text-error-500",
  neutral: "text-gray-500 dark:text-gray-400",
};

export function MetricCard({ metric }: { metric: DashboardMetric }) {
  const toneClass = TONE_CLASSES[metric.tone ?? "neutral"];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
      <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
        {metric.value}
      </p>
      {metric.delta && (
        <p className={`mt-1 text-xs font-medium ${toneClass}`}>{metric.delta}</p>
      )}
      {metric.helper && (
        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">{metric.helper}</p>
      )}
    </div>
  );
}
