"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import CustomerProfile from "@/components/storefront/account/CustomerProfile";
import UnauthenticatedStateMinimal from "../../../../components/storefront/account/auth/UnauthenticatedStateMinimal";

export default function AccountProfilePage() {
  const { user, isAuthenticated } = useAuthStore();
  /* ---------------- Guards ---------------- */

  if (!isAuthenticated) {
    return <UnauthenticatedStateMinimal />;
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-primary">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }
  return (
    <div className="min-h-fit bg-primary pb-20">
      <div className="max-w-7xl mx-auto px-2 flex flex-col space-y-10">
        <CustomerProfile />
      </div>
    </div>
  );
}
