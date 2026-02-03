"use client";

import { useState } from "react";
import { Search, Filter, ShoppingBag } from "lucide-react";
import type { Order } from "@/types";
import { OrderCard } from "./OrderCard";
import { interpolate, normalizeOrder } from "@/utils";
import { useLanguageStore } from "@/stores";
interface OrderHistoryProps {
  orders: Order[];
}

export default function OrderHistory({ orders }: OrderHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { translate } = useLanguageStore();

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const normalizedOrders = filteredOrders.map(normalizeOrder);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-1">
            {translate("profile.orders.title")}
          </h2>
          <p className="text-xs sm:text-sm text-secondary">
            {interpolate(
              translate(
                orders.length === 1
                  ? "profile.orders.subtitle.one"
                  : "profile.orders.subtitle.other",
              ),
              {
                count: orders.length,
              },
            )}
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-secondary/20 rounded-xl border border-primary/10 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary"
              strokeWidth={1.5}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={translate("profile.orders.actions.searchOrder")}
              className="w-full pl-10 pr-4 py-2.5 bg-primary border border-primary/20 rounded-lg text-sm text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
            />
          </div>

          {/* Filter */}
          <div className="relative sm:w-52">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary pointer-events-none"
              strokeWidth={1.5}
            />
            <select
              title={translate("profile.orders.actions.filterByStatus")}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-primary border border-primary/20 rounded-lg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="processing">Processing</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-secondary/20 rounded-xl border border-primary/10 p-8 sm:p-12 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <ShoppingBag
                className="w-6 h-6 sm:w-8 sm:h-8 text-accent"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-primary font-semibold mb-1 text-sm sm:text-base">
              {translate("profile.orders.empty.title")}
            </p>
            <p className="text-xs sm:text-sm text-tertiary">
              {translate("profile.orders.empty.description")}
            </p>
          </div>
        ) : (
          normalizedOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  );
}
