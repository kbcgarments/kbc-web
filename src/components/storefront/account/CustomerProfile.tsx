"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Package, MapPin, Settings } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCustomerOrders } from "@/hooks";
import AccountSettings from "./settings/AccountSettings";
import AddressBook from "./address/AddressBook";
import OrderHistory from "./order/OrderHistory";
import ProfileOverview from "./ProfileOverview";
import { cn } from "@/utils";
import { useLanguageStore } from "@/stores";

export type TabType =
  | "overview"
  | "orders"
  | "personal"
  | "addresses"
  | "settings";

export default function CustomerProfile() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { data: orders = [] } = useCustomerOrders();
  const { translate } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/account/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    );
  }

  const memberYear = new Date(user.createdAt).getFullYear();

  const navigation = [
    { id: "overview", label: "profile.navigation.profile", icon: User },
    { id: "orders", label: "profile.navigation.orders", icon: Package },
    { id: "addresses", label: "profile.navigation.addresses", icon: MapPin },
    // { id: "wallets", label: "profile.navigation.payment", icon: CreditCard },
    { id: "settings", label: "profile.navigation.settings", icon: Settings },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <ProfileOverview
            user={user}
            memberYear={memberYear}
            setActiveTab={setActiveTab}
          />
        );
      case "orders":
        return <OrderHistory orders={orders} />;
      case "addresses":
        return <AddressBook />;
      // case "wallets":
      //   return <PaymentMethods />;
      case "settings":
        return <AccountSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-primary md:px-4">
      <div className="max-w-8xl">
        {/* Top Navigation */}
        <nav className="border-b-4 border-(--color-bg-accent) bg-secondary py-2 px-1 rounded-lg shadow-lg shrink-0">
          <div className="flex items-center justify-center gap-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex items-center justify-center gap-2 p-2 text-[15px] transition-all duration-500font-medium shrink-0 whitespace-nowrap rounded-lg",
                    isActive
                      ? "text-accent bg-(--color-text-tertiary)"
                      : "text-secondary hover:text-primary",
                  )}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                  <span className="hidden sm:inline">
                    {translate(item.label)}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Content */}
        <div className="sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-12">
          <div className="max-w-8xl mx-auto">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
