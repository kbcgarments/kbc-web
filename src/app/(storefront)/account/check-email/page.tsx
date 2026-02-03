"use client";

import Link from "next/link";
import {
  Mail,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useLanguageStore } from "@/stores";

export default function CheckEmailPage() {
  const { translate } = useLanguageStore();
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    // Add your resend email logic here
    setTimeout(() => {
      setIsResending(false);
    }, 2000);
  };

  const openGmail = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = "googlegmail://";
      setTimeout(() => {
        window.open("https://mail.google.com", "_blank");
      }, 500);
    } else {
      window.open("https://mail.google.com", "_blank");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-background via-background to-accent/5">
      <div className="max-w-md w-full">
        {/* Card Container */}
        <div className="bg-card rounded-2xl shadow-lg border border-border/50 p-8 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full"></div>
              <div className="relative bg-linear-to-br from-accent/20 to-accent/10 p-4 rounded-full">
                <Mail className="w-12 h-12 text-accent" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              {translate("auth.checkEmail.title")}
            </h1>
            <p className="text-secondary leading-relaxed">
              {translate("auth.checkEmail.description")}
            </p>
          </div>

          {/* Open Email Button */}
          <button
            onClick={openGmail}
            className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
          >
            {translate("auth.checkEmail.openGmail")}
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <div className="flex justify-center text-xs border-t border-gray-300 border-2 pt-4">
            <span className="bg-card px-3 text-tertiary">
              {translate("auth.checkEmail.havingTrouble")}
            </span>
          </div>

          {/* Help Section */}
          <div className="space-y-3">
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div className="text-sm text-secondary">
                  <p className="font-medium text-primary mb-1">
                    {translate("auth.checkEmail.didntReceiveTitle")}
                  </p>
                  <ul className="space-y-1 text-tertiary">
                    <li>• {translate("auth.checkEmail.tip1")}</li>
                    <li>• {translate("auth.checkEmail.tip2")}</li>
                    <li>• {translate("auth.checkEmail.tip3")}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Resend Button */}
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full border border-border hover:border-accent/50 hover:bg-accent/5 text-primary font-medium py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group hover:scale-105"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  isResending ? "animate-spin" : "group-hover:rotate-180"
                } transition-transform duration-500`}
              />
              {isResending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                translate("auth.checkEmail.resendEmail")
              )}
            </button>
          </div>

          {/* Footer Link */}
          <div className="text-center pt-2">
            <Link
              href="/account/login"
              className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent/80 font-medium transition-colors"
            >
              ← {translate("auth.checkEmail.backToLogin")}
            </Link>
          </div>
        </div>

        {/* Bottom Help Text */}
        <p className="text-center text-sm text-tertiary mt-6">
          {translate("auth.checkEmail.needHelp")}{" "}
          <Link
            href="/support"
            className="text-accent hover:text-accent/80 font-medium transition-colors"
          >
            {translate("auth.checkEmail.contactSupport")}
          </Link>
        </p>
      </div>
    </div>
  );
}
