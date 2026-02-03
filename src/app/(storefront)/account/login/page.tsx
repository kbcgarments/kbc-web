"use client";
import LoginClient from "@/components/storefront/account/auth/LoginClient";

export default function LoginPage() {
  return (
    <div className="min-h-fit bg-primary pb-20">
      <div className="max-w-7xl mx-auto  flex flex-col space-y-4">
        <LoginClient />
      </div>
    </div>
  );
}
