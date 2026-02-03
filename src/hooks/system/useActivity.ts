"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { ActivityLog, ActivityType } from "@/types";

interface ActivityQueryParams {
  limit?: number;
  offset?: number;
  entity?: string;
  entityId?: string;
  activityType?: ActivityType;
  actorId?: string;
  fromDate?: string;
  toDate?: string;
}

export function useActivity(params: ActivityQueryParams) {
  return useQuery({
    queryKey: ["activity", params],
    queryFn: async () => {
      const search = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          search.append(key, String(value));
        }
      });

      return apiClient.get<ActivityLog[]>(`/activity?${search.toString()}`);
    },
    staleTime: 30_000,
  });
}
