"use client";

import {
  Package,
  Truck,
  CheckCircle,
  CreditCard,
  MapPin,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { useCurrencyStore, useLanguageStore } from "@/stores";
import type { Customer } from "@/types";
import { Dispatch } from "react";
import { TabType } from "./CustomerProfile";
import { OrderCard } from "./order/OrderCard";
import { interpolate, normalizeOrder } from "@/utils";
import { useCustomerDashboardMetrics } from "@/hooks";

interface ProfileOverviewProps {
  user: Customer;
  memberYear: number;
  setActiveTab: Dispatch<React.SetStateAction<TabType>>;
}

export default function ProfileOverview({
  user,
  memberYear,
  setActiveTab,
}: ProfileOverviewProps) {
  const { formatPrice } = useCurrencyStore();
  const { translate } = useLanguageStore();
  const { data, isLoading } = useCustomerDashboardMetrics();

  if (isLoading || !data) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="h-6 sm:h-8 w-48 sm:w-64 bg-secondary/20 rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 sm:h-28 rounded-xl border border-primary/10 bg-secondary/10"
            />
          ))}
        </div>
      </div>
    );
  }

  const {
    totalOrders,
    activeOrders,
    deliveredOrders,
    ordersThisMonth,
    totalSpentUSD,
    savedAddresses,
    savedPaymentMethods,
    recentOrders,
  } = data;
  const normalizedOrders = recentOrders.map(normalizeOrder);
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-primary mb-1">
          {interpolate(translate("profile.overview.greeting"), {
            name: user.name?.split(" ")[0] ?? "User",
          })}
        </h1>
        <p className="text-sm sm:text-base text-secondary">
          {interpolate(translate("profile.overview.memberSince"), {
            year: memberYear,
          })}
        </p>
      </div>

      {/* Primary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          icon={Package}
          label={translate("profile.overview.stats.totalOrders")}
          value={totalOrders}
        />
        <MetricCard
          icon={Truck}
          label={translate("profile.overview.stats.activeOrders")}
          value={activeOrders}
        />
        <MetricCard
          icon={CheckCircle}
          label={translate("profile.overview.stats.delivered")}
          value={deliveredOrders}
        />
        <MetricCard
          icon={DollarSign}
          label={translate("profile.overview.stats.totalSpent")}
          value={formatPrice(totalSpentUSD)}
        />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <SecondaryCard
          icon={Package}
          label={translate("profile.overview.stats.ordersThisMonth")}
          value={ordersThisMonth}
        />
        <SecondaryCard
          icon={MapPin}
          label={translate("profile.overview.stats.savedAddresses")}
          value={savedAddresses}
        />
        <SecondaryCard
          icon={CreditCard}
          label={translate("profile.overview.stats.paymentMethods")}
          value={savedPaymentMethods}
        />
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-primary">
            {translate("profile.overview.stats.recentOrders")}
          </h2>

          {recentOrders.length > 3 && (
            <button
              onClick={() => setActiveTab("orders")}
              className="text-xs sm:text-sm text-accent hover:text-accent-dark flex items-center gap-1 font-medium transition-colors"
            >
              <span className="hidden sm:inline">
                {translate("common.viewAll")}
              </span>
              <span className="sm:hidden">{translate("common.all")}</span>
              <ArrowRight
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                strokeWidth={2}
              />
            </button>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div className="border border-primary/10 rounded-xl p-6 sm:p-8 text-center">
            <Package
              className="w-8 h-8 sm:w-10 sm:h-10 text-tertiary mx-auto mb-2 sm:mb-3"
              strokeWidth={1.5}
            />
            <p className="text-sm sm:text-base text-secondary">
              {translate("profile.overview.stats.noOrders")}
            </p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {normalizedOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ======================================================
   Metric cards
====================================================== */

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-primary/10 p-4 sm:p-6 hover:border-accent/30 transition-all">
      <Icon
        className="w-4 h-4 sm:w-5 sm:h-5 text-accent mb-2 sm:mb-3"
        strokeWidth={1.5}
      />
      <div className="text-2xl sm:text-3xl font-semibold text-primary tabular-nums">
        {value}
      </div>
      <div className="text-xs sm:text-sm text-secondary mt-1">{label}</div>
    </div>
  );
}

function SecondaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-primary/10 p-4 sm:p-5 bg-secondary/20 hover:bg-secondary/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
          <Icon
            className="w-5 h-5 sm:w-6 sm:h-6 text-accent"
            strokeWidth={1.5}
          />
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-primary tabular-nums text-lg sm:text-xl">
            {value}
          </div>
          <div className="text-xs sm:text-sm text-secondary truncate">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}
