"use client";

import Link from "next/link";
import {
  Package,
  FolderTree,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";

import { useAdminOrders, useDashboardMetrics } from "@/hooks";
import { Order } from "@/types";
import { STATUS_COLORS } from "@/constants";

/* ======================================================
   DASHBOARD
====================================================== */

export function DashboardClient() {
  const { data: orderData = [] } = useAdminOrders();
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();

  const recentOrders = orderData.slice(0, 10);

  /* -----------------------------
     Stats Config
  ----------------------------- */

  const stats = [
    /* =============================
       PRODUCTS & CATEGORIES
    ============================== */
    {
      label: "Total Products",
      value: metrics?.totalProducts ?? "—",
      icon: Package,
      color: "bg-blue-500",
      href: "/admin/products",
    },
    {
      label: "Categories",
      value: metrics?.totalCategories ?? "—",
      icon: FolderTree,
      color: "bg-purple-500",
      href: "/admin/categories",
    },

    /* =============================
       ORDERS
    ============================== */
    {
      label: "Total Orders",
      value: metrics?.totalOrders ?? "—",
      icon: ShoppingCart,
      color: "bg-green-500",
      href: "/admin/orders",
    },
    {
      label: "Orders Today",
      value: metrics?.ordersToday ?? "—",
      icon: TrendingUp,
      color: "bg-red-500",
      href: "/admin/orders",
    },
    {
      label: "Pending Orders",
      value: metrics?.pendingOrders ?? "—",
      icon: ShoppingCart,
      color: "bg-yellow-600",
      href: "/admin/orders?status=PENDING",
    },
    {
      label: "Delivered Orders",
      value: metrics?.deliveredOrders ?? "—",
      icon: ShoppingCart,
      color: "bg-emerald-600",
      href: "/admin/orders?status=DELIVERED",
    },
    {
      label: "Cancelled Orders",
      value: metrics?.cancelledOrders ?? "—",
      icon: ShoppingCart,
      color: "bg-rose-600",
      href: "/admin/orders?status=CANCELLED",
    },

    /* =============================
       CUSTOMERS
    ============================== */
    {
      label: "Total Customers",
      value: metrics?.totalCustomers ?? "—",
      icon: Users,
      color: "bg-indigo-500",
      href: "/admin/customers",
    },

    /* =============================
       REVENUE
    ============================== */
    {
      label: "Total Revenue",
      value:
        metrics?.totalRevenueUSD !== undefined
          ? `$${metrics.totalRevenueUSD.toFixed(2)}`
          : "—",
      icon: DollarSign,
      color: "bg-yellow-500",
      href: "/admin/orders",
    },
    {
      label: "Revenue Today",
      value:
        metrics?.revenueTodayUSD !== undefined
          ? `$${metrics.revenueTodayUSD.toFixed(2)}`
          : "—",
      icon: DollarSign,
      color: "bg-orange-500",
      href: "/admin/orders",
    },
    {
      label: "Revenue This Week",
      value:
        metrics?.revenueThisWeekUSD !== undefined
          ? `$${metrics.revenueThisWeekUSD.toFixed(2)}`
          : "—",
      icon: DollarSign,
      color: "bg-green-700",
      href: "/admin/orders",
    },
    {
      label: "Revenue This Month",
      value:
        metrics?.revenueThisMonthUSD !== undefined
          ? `$${metrics.revenueThisMonthUSD.toFixed(2)}`
          : "—",
      icon: DollarSign,
      color: "bg-teal-600",
      href: "/admin/orders",
    },

    /* =============================
       FEEDBACK SYSTEM
    ============================== */
    {
      label: "Pending Feedback",
      value: metrics?.pendingFeedback ?? "—",
      icon: Users,
      color: "bg-gray-600",
      href: "/admin/feedback",
    },
    {
      label: "Approved Feedback",
      value: metrics?.approvedFeedback ?? "—",
      icon: Users,
      color: "bg-blue-600",
      href: "/admin/feedback",
    },
    {
      label: "Promoted Testimonials",
      value: metrics?.promotedFeedback ?? "—",
      icon: Users,
      color: "bg-green-600",
      href: "/admin/testimonials",
    },

    /* =============================
       HOMEPAGE CONTENT
    ============================== */
    {
      label: "Active Hero Sections",
      value: metrics?.activeHeroSections ?? "—",
      icon: FolderTree,
      color: "bg-purple-700",
      href: "/admin/homepage/hero",
    },
    {
      label: "Active Banners",
      value: metrics?.activeBanners ?? "—",
      icon: FolderTree,
      color: "bg-blue-700",
      href: "/admin/homepage/banner",
    },
    {
      label: "Why Choose Us Items",
      value: metrics?.activeWhyChooseUsItems ?? "—",
      icon: FolderTree,
      color: "bg-indigo-700",
      href: "/admin/homepage/why-choose-us",
    },
  ];

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-display font-bold text-primary">
          Dashboard
        </h1>
        <p className="text-secondary mt-1">
          Welcome back — here&apos;s what&apos;s happening today.
        </p>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-secondary border border-primary rounded-lg p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-primary group-hover:text-accent transition-colors">
                {metricsLoading ? "…" : value}
              </span>
            </div>
            <p className="text-sm font-medium text-secondary">{label}</p>
          </Link>
        ))}
      </section>

      {/* Quick Actions */}
      <section className="bg-secondary border border-primary rounded-lg p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction
            href="/admin/products/create"
            icon={Package}
            label="Add Product"
          />
          <QuickAction
            href="/admin/categories/create"
            icon={FolderTree}
            label="Add Category"
          />
          <QuickAction
            href="/admin/orders"
            icon={ShoppingCart}
            label="View Orders"
          />
          <QuickAction
            href="/admin/currency"
            icon={DollarSign}
            label="Update Rates"
          />
        </div>
      </section>

      {/* Recent Orders */}
      <section className="bg-secondary border border-primary rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary">Recent Orders</h2>
          {orderData.length > 10 && (
            <Link
              href="/admin/orders"
              className="text-sm text-accent hover:text-accent-dark"
            >
              View all →
            </Link>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-primary">
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order: Order) => (
                <tr
                  key={order.id}
                  className="border-b border-primary hover:bg-tertiary"
                >
                  <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                  <td className="px-4 py-3 text-secondary">{order.email}</td>
                  <td className="px-4 py-3 font-medium">
                    {order.currency}
                    {order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status]}`}
                    >
                      {order.status.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-secondary">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ======================================================
   QUICK ACTION COMPONENT
====================================================== */

function QuickAction({
  href,
  icon: Icon,
  label,
  primary = true,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-4 rounded-lg transition-colors
        ${
          primary
            ? "bg-accent text-white hover:bg-accent-dark"
            : "bg-primary border border-primary hover:bg-tertiary"
        }`}
    >
      <Icon className={`w-5 h-5 ${primary ? "text-white" : "text-primary"}`} />
      <span
        className={`font-medium ${primary ? "text-white" : "text-primary"}`}
      >
        {label}
      </span>
    </Link>
  );
}
