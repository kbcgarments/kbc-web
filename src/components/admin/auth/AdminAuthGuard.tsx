"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";
import { Loader } from "lucide-react";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/admin/auth/login") {
      router.push("/admin/auth/login");
    }
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated && pathname !== "/admin/auth/login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <Loader className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
