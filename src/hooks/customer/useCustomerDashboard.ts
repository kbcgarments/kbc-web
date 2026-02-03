"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib";
import type { Order } from "@/types";

export interface CustomerDashboardMetrics {
  totalOrders: number;
  activeOrders: number;
  deliveredOrders: number;
  ordersThisMonth: number;
  totalSpentUSD: number;
  savedAddresses: number;
  savedPaymentMethods: number;
  recentOrders: Order[];
}
export function useCustomerDashboardMetrics() {
  return useQuery<CustomerDashboardMetrics>({
    queryKey: ["customer-dashboard-metrics"],
    queryFn: () =>
      apiClient.get<CustomerDashboardMetrics>("/customer/dashboard/metrics"),
  });
}
