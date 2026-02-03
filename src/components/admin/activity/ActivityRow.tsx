import { ActivityActor, ActivityLog } from "@/types";
import { ACTIVITY_LABELS, formatActor, formatDate } from "@/utils";

export function ActivityRow({ activity }: { activity: ActivityLog }) {
  return (
    <tr className="border-t border-primary hover:bg-tertiary transition-colors">
      <td className="px-4 py-3 text-sm text-primary">
        {ACTIVITY_LABELS[activity.activityType]}
      </td>

      <td className="px-4 py-3 text-sm text-secondary">{activity.entity}</td>

      <td className="px-4 py-3 text-sm text-secondary">
        {formatActor(activity.actor as ActivityActor)}
      </td>

      <td className="px-4 py-3 text-sm text-primary max-w-xl">
        {activity.message}
      </td>

      <td className="px-4 py-3 text-sm text-secondary whitespace-nowrap">
        {formatDate(activity.createdAt)}
      </td>
    </tr>
  );
}
