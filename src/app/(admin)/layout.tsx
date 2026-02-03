import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminTopbar } from "@/components/admin/layout/AdminTopbar";
import { AdminAuthGuard } from "@/components/admin/auth/AdminAuthGuard";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard | KBC",
    template: "%s | KBC Admin",
  },
  description:
    "Manage your KBC e-commerce store - products, orders, categories, and customers.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "KBC Admin Dashboard",
    description: "E-commerce management system",
    type: "website",
    locale: "en_US",
    siteName: "KBC Admin",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="flex h-screen bg-sand-50 dark:bg-sand-950">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminTopbar />
          <main className="flex-1 overflow-y-auto p-4 bg-sand-50 dark:bg-sand-950">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
