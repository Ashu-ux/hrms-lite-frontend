import { useEffect, useMemo, useState } from "react";
import { dashboardApi } from "../api/dashboardApi";
import Spinner from "../components/Spinner";
import ErrorState from "../components/ErrorState";

function Card({ title, value }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-gray-600">{title}</div>
      <div className="mt-2 text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await dashboardApi.stats();
        if (!mounted) return;
        setStats(res.data);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || err?.message || "Failed to load stats");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const normalized = useMemo(() => {
    const s = stats || {};
    return {
      totalProjects: s.totalProjects ?? s.projectsCount ?? 0,
      totalTasks: s.totalTasks ?? s.tasksCount ?? 0,
      completedTasks: s.completedTasks ?? 0,
      pendingTasks: s.pendingTasks ?? 0,
      inProgressTasks: s.inProgressTasks ?? s.inProgress ?? 0,
      userTaskStats: s.userTaskStats ?? s.userTasks ?? []
    };
  }, [stats]);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-bold text-gray-900">Dashboard</div>
        <div className="mt-1 text-sm text-gray-600">
          Overview of projects and task progress.
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner className="h-8 w-8" />
        </div>
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Card title="Total Projects" value={normalized.totalProjects} />
            <Card title="Total Tasks" value={normalized.totalTasks} />
            <Card title="Completed" value={normalized.completedTasks} />
            <Card title="Pending" value={normalized.pendingTasks} />
            <Card title="In Progress" value={normalized.inProgressTasks} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-5 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-800">
                  Task breakdown
                </div>
                <div className="text-xs text-gray-500">Status distribution</div>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Completed", value: normalized.completedTasks, color: "bg-green-500" },
                  { label: "Pending", value: normalized.pendingTasks, color: "bg-amber-500" },
                  { label: "In Progress", value: normalized.inProgressTasks, color: "bg-blue-500" }
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-700">{row.label}</div>
                      <div className="font-medium text-gray-900">{row.value}</div>
                    </div>
                    <div className="mt-2 h-3 w-full rounded-full bg-gray-100">
                      <div
                        className={`h-3 rounded-full ${row.color}`}
                        style={{
                          width: `${
                            normalized.totalTasks
                              ? Math.round((row.value / normalized.totalTasks) * 100)
                              : 0
                          }%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-gray-800">
                User stats
              </div>
              <div className="mt-4 space-y-3">
                {normalized.userTaskStats?.length ? (
                  normalized.userTaskStats.slice(0, 5).map((u, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-gray-900">
                          {u.userName || u.name || u.email || "User"}
                        </div>
                        <div className="truncate text-xs text-gray-500">
                          {u.completed ?? u.completedTasks ?? 0} completed
                        </div>
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        {u.totalTasks ?? u.tasks ?? 0}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-600">No user stats available.</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

