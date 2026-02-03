"use client";

import { useState } from "react";
import { Loader } from "lucide-react";
import { useActivity } from "@/hooks";
import { ActivityRow } from "@/components/admin/activity/ActivityRow";
import { ActivityType } from "@/types";
import { ACTIVITY_LABELS } from "@/utils";

export default function ActivityPageClient() {
  const [activityType, setActivityType] = useState<ActivityType | "ALL">("ALL");

  const [limit] = useState(50);
  const [offset, setOffset] = useState(0);

  const { data, isLoading } = useActivity({
    limit,
    offset,
    activityType: activityType === "ALL" ? undefined : activityType,
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-display font-bold text-primary">
          Activity Log
        </h1>
        <p className="text-secondary">
          Administrative actions across the system
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="flex gap-4 items-center bg-secondary p-4 rounded-lg border border-primary">
        <select
          title="Filter activity type"
          value={activityType}
          onChange={(e) =>
            setActivityType(e.target.value as ActivityType | "ALL")
          }
          className="px-4 py-2 bg-primary border border-primary rounded-lg text-sm"
        >
          <option value="ALL">All Activities</option>
          {Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-secondary border border-primary rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : !data || data.length === 0 ? (
          <div className="py-16 text-center text-secondary text-sm">
            No activity logs found
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-tertiary">
              <tr>
                <Th>Action</Th>
                <Th>Entity</Th>
                <Th>Actor</Th>
                <Th>Description</Th>
                <Th>Time</Th>
              </tr>
            </thead>
            <tbody>
              {data.map((activity) => (
                <ActivityRow key={activity.id} activity={activity} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center text-sm text-secondary">
        <span>Showing {data?.length ?? 0} activities</span>

        <div className="flex gap-2">
          <button
            title="Previous page"
            disabled={offset === 0}
            onClick={() => setOffset((o) => Math.max(0, o - limit))}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Previous
          </button>

          <button
            title="Next page"
            disabled={!data || data.length < limit}
            onClick={() => setOffset((o) => o + limit)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
      {children}
    </th>
  );
}
