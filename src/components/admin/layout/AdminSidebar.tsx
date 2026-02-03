"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  DollarSign,
  FileText,
  // Settings,
  LogOut,
  Trash2,
  Tag,
} from "lucide-react";
import { useAdminLogout } from "@/hooks";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";

export function AdminSidebar() {
  const pathname = usePathname();
  const logout = useAdminLogout();
  const admin = useAdminAuthStore((state) => state.admin);

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Product Types", href: "/admin/product-types", icon: Tag },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Currency", href: "/admin/currency", icon: DollarSign },
    { name: "Content", href: "/admin/content", icon: FileText },
    // { name: "Settings", href: "/admin/settings", icon: Settings },
    { name: "Recycles", href: "/admin/recycles", icon: Trash2 },
    { name: "Activity", href: "/admin/activity", icon: FileText },
  ];

  return (
    <div className="flex flex-col h-full bg-secondary border-r border-primary text-primary w-64">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-primary">
        <h1 className="text-xl font-display font-bold text-accent">
          KBC Admin
        </h1>
      </div>

      {/* Admin Info */}
      <div className="px-6 py-4 border-b border-primary">
        <p className="text-sm text-secondary">Logged in as</p>
        <p className="text-sm font-medium truncate">{admin?.email}</p>
        <p className="text-xs text-accent capitalize">
          {admin?.role.toLowerCase().replace("_", " ")}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-theme relative
                ${
                  isActive
                    ? "bg-accent text-white shadow-sm"
                    : "text-primary  hover:bg-tertiary"
                }
              `}
            >
              {/* Left Accent Bar */}
              {isActive && (
                <span className="absolute left-0 top-0 h-full w-1 bg-accent-light rounded-r" />
              )}

              <Icon className="w-5 h-5 " />

              <span className={` font-medium`}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-primary">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-secondary hover:bg-tertiary transition-colors"
        >
          <LogOut className="w-5 h-5 icon-secondary" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
