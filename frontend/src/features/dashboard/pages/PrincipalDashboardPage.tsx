import PageMeta from "../../../components/common/PageMeta";
import { useAuth } from "../../auth/context/useAuth";
import { DASHBOARD_METRICS } from "../data/mockDashboard";
import { MetricCard } from "../components/MetricCard";
import { RecentAnnouncements } from "../components/RecentAnnouncements";
import { ClassSnapshotTable } from "../components/ClassSnapshotTable";
import { UpcomingEvents } from "../components/UpcomingEvents";

const TODAY_FORMATTER = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function PrincipalDashboardPage() {
  const { user } = useAuth();
  const today = TODAY_FORMATTER.format(new Date());
  const firstName = user?.displayName.split(" ")[0] ?? "Principal";

  return (
    <>
      <PageMeta
        title="Dashboard | MySchool ERP"
        description="Principal dashboard overview"
      />

      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">{today}</p>
        <h1 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-3xl">
          Good morning, {firstName}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Here's how your school is doing today.
        </p>
      </div>

      <section
        aria-label="Key metrics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {DASHBOARD_METRICS.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ClassSnapshotTable />
        </div>
        <UpcomingEvents />
      </section>

      <section className="mt-6">
        <RecentAnnouncements />
      </section>
    </>
  );
}
