import type { Metadata } from "next";
import { DashboardClient } from "@/components/admin/dashboard/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
  description: "KBC Fashion admin dashboard overview",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
