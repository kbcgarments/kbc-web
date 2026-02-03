import type { Metadata } from "next";
import { SettingsClient } from "@/components/admin/settings/SettingsClient";

export const metadata: Metadata = {
  title: "Settings | Admin",
  description: "Admin settings",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
