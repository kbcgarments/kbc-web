"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Eye, Package } from "lucide-react";
import { useAdminOrders } from "@/hooks";
import { OrderStatus } from "@/types";
import { STATUS_COLORS } from "@/constants";

export function OrdersListClient() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "ALL">("ALL");

  const { data: orders = [], isLoading } = useAdminOrders({
    status: status === "ALL" ? undefined : status,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-primary mb-1">
          Orders
        </h1>
        <p className="text-secondary">Manage and track customer orders</p>
      </div>

      {/* Filters */}
      <div className="bg-secondary border border-primary rounded-lg p-4 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number or email"
            className="w-full pl-10 pr-4 py-2 bg-primary border border-primary rounded-lg text-sm"
          />
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-secondary" />
          <select
            title="Order Status Selector"
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus | "ALL")}
            className="px-4 py-2 bg-primary border border-primary rounded-lg text-sm"
          >
            <option value="ALL">All</option>
            {Object.keys(STATUS_COLORS).map((s) => (
              <option key={s} value={s}>
                {s.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-secondary border border-primary rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-tertiary">
            <tr>
              <th className="px-4 py-3 text-left text-sm">Order ID</th>
              <th className="px-4 py-3 text-left text-sm">Customer</th>
              <th className="px-4 py-3 text-left text-sm">Items</th>
              <th className="px-4 py-3 text-left text-sm">Amount</th>
              <th className="px-4 py-3 text-left text-sm">Status</th>
              <th className="px-4 py-3 text-left text-sm">Date</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-secondary">
                  Loading orders…
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-secondary">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-primary hover:bg-tertiary"
                >
                  <td className="px-4 py-3 font-mono text-sm">
                    {order.orderNumber}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      {order.items.length}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {order.currency} {order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}
                    >
                      {order.status.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="p-2 rounded-lg hover:bg-accent/10 text-accent"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
