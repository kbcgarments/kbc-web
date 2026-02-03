"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useLogin } from "@/hooks";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { useLanguageStore } from "@/stores";

export default function LoginClient() {
  const router = useRouter();
  const login = useLogin();
  const { translate } = useLanguageStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { email, password },
      {
        onSuccess: () => {
          router.push("/account/me");
        },
      },
    );
  };

  return (
    <div className="bg-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
            {translate("auth.login.title")}
          </h1>
          <p className="text-secondary">{translate("auth.login.subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* ================= LOGIN FORM ================= */}
          <div className="bg-secondary/20 border border-primary/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-2">
              {translate("auth.login.signIn.title")}
            </h2>
            <p className="text-sm text-secondary mb-6">
              {translate("auth.login.signIn.welcome")}
            </p>

            <form onSubmit={onSubmit} className="space-y-4">
              <Input
                label={translate("auth.login.signIn.emailLabel")}
                type="email"
                placeholder={translate("auth.login.signIn.emailPlaceholder")}
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label={translate("auth.login.signIn.passwordLabel")}
                type={showPassword ? "text" : "password"}
                placeholder={translate("auth.login.signIn.passwordPlaceholder")}
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="hover:text-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                    ) : (
                      <Eye className="w-4 h-4" strokeWidth={1.5} />
                    )}
                  </button>
                }
              />

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link
                  href="/account/forgot-password"
                  className="text-xs text-accent hover:underline font-medium"
                >
                  {translate("auth.login.signIn.forgotPassword")}
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={login.isPending}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:scale-105 duration-500 hover:bg-accent-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {login.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 rounded-full animate-spin" />
                  </>
                ) : (
                  <>
                    {translate("auth.login.signIn.submit")}
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ================= NEW CUSTOMER ================= */}
          <div className="bg-linear-to-br from-accent/5 via-transparent to-accent/5 border border-accent/20 rounded-2xl p-6 sm:p-8 flex flex-col justify-center">
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-3">
              {translate("auth.login.newCustomer.title")}
            </h2>
            <p className="text-sm text-secondary mb-6 leading-relaxed">
              {translate("auth.login.newCustomer.description")}
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex gap-3 text-sm text-secondary">
                <span className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                </span>
                {translate("auth.login.newCustomer.benefits.trackOrders")}
              </li>
              <li className="flex gap-3 text-sm text-secondary">
                <span className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                </span>
                {translate("auth.login.newCustomer.benefits.saveAddresses")}
              </li>
              <li className="flex gap-3 text-sm text-secondary">
                <span className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                </span>
                {translate("auth.login.newCustomer.benefits.orderHistory")}
              </li>
            </ul>

            <Link
              href="/account/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-accent text-accent rounded-lg font-semibold hover:bg-accent hover:scale-105 transition-all duration-500"
            >
              {translate("auth.login.newCustomer.cta")}
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
