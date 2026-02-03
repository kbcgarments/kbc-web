/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib";
import { CheckCircle2, XCircle, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useLanguageStore } from "@/stores";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const { translate } = useLanguageStore();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    apiClient
      .post("/auth/verify-email", { token })
      .then(() => {
        setStatus("success");
        setTimeout(() => router.push("/account/me"), 3000);
      })
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-background via-background to-accent/5">
      <div className="max-w-md w-full">
        {/* Card Container */}
        <div className="bg-card rounded-2xl shadow-lg border border-border/50 p-8 space-y-6">
          {/* Loading State */}
          {status === "loading" && (
            <>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full animate-pulse"></div>
                  <div className="relative bg-linear-to-br from-accent/20 to-accent/10 p-4 rounded-full">
                    <Loader2
                      className="w-12 h-12 text-accent animate-spin"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
              </div>

              <div className="text-center space-y-3">
                <h1 className="text-2xl md:text-3xl font-bold text-primary">
                  {translate("auth.verifyEmail.verifying")}
                </h1>
                <p className="text-secondary leading-relaxed">
                  {translate("auth.verifyEmail.verifyingDescription")}
                </p>
              </div>

              <div className="flex justify-center">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                </div>
              </div>
            </>
          )}

          {/* Success State */}
          {status === "success" && (
            <>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
                  <div className="relative bg-linear-to-br from-green-500/20 to-green-500/10 p-4 rounded-full animate-scale-in">
                    <CheckCircle2
                      className="w-12 h-12 text-green-600 dark:text-green-500"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
              </div>

              <div className="text-center space-y-3 animate-fade-in">
                <h1 className="text-2xl md:text-3xl font-bold text-primary">
                  {translate("auth.verifyEmail.successTitle")}
                </h1>
                <p className="text-secondary leading-relaxed">
                  {translate("auth.verifyEmail.successDescription")}
                </p>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 animate-fade-in">
                <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="font-medium text-sm">
                    {translate("auth.verifyEmail.redirecting")}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Error State */}
          {status === "error" && (
            <>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
                  <div className="relative bg-linear-to-br from-red-500/20 to-red-500/10 p-4 rounded-full animate-shake">
                    <XCircle
                      className="w-12 h-12 text-red-600 dark:text-red-500"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
              </div>

              <div className="text-center space-y-3">
                <h1 className="text-2xl md:text-3xl font-bold text-primary">
                  {translate("auth.verifyEmail.errorTitle")}
                </h1>
                <p className="text-secondary leading-relaxed">
                  {translate("auth.verifyEmail.errorDescription")}
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/account/check-email"
                  className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
                >
                  {translate("auth.verifyEmail.tryAgain")}
                </Link>

                <Link
                  href="/account/login"
                  className="w-full border border-border hover:border-accent/50 hover:bg-accent/5 text-primary font-medium py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {translate("auth.verifyEmail.backToLogin")}
                </Link>
              </div>

              <p className="text-center text-sm text-tertiary">
                <Link
                  href="/support"
                  className="text-accent hover:text-accent/80 font-medium transition-colors"
                >
                  {translate("auth.verifyEmail.contactSupport")}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
