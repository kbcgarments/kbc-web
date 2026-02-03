"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForgotPassword } from "@/hooks";
import { Input } from "@/components/ui/Input";
import { useLanguageStore } from "@/stores";
import { interpolate } from "@/utils";

export default function ForgotPasswordClient() {
  const router = useRouter();
  const { translate } = useLanguageStore();
  const forgotPassword = useForgotPassword();

  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    forgotPassword.mutate(email, {
      onSuccess: () => {
        setSubmitted(true);
      },
    });
  };

  return (
    <div className="bg-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {translate("auth.forgotPassword.title")}
          </h1>
          <p className="text-secondary text-sm">
            {translate("auth.forgotPassword.subtitle")}
          </p>
        </div>

        <div className="bg-secondary/20 border border-primary/10 rounded-2xl p-6 sm:p-8">
          {!submitted ? (
            <>
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Email */}
                <Input
                  label={translate("auth.forgotPassword.form.email.label")}
                  icon={Mail}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={translate(
                    "auth.forgotPassword.form.email.placeholder",
                  )}
                  required
                />

                {/* Submit */}
                <button
                  type="submit"
                  disabled={forgotPassword.isPending}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {forgotPassword.isPending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {translate("auth.forgotPassword.submit.loading")}
                    </>
                  ) : (
                    <>
                      {translate("auth.forgotPassword.submit.default")}
                      <ArrowRight className="w-4 h-4" strokeWidth={2} />
                    </>
                  )}
                </button>
              </form>

              {/* Back to login */}
              <div className="mt-6 text-center">
                <Link
                  href="/account/login"
                  className="text-sm text-accent hover:underline font-medium"
                >
                  {translate("auth.forgotPassword.backToLogin")}
                </Link>
              </div>
            </>
          ) : (
            /* ================= SUCCESS STATE ================= */
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <CheckCircle
                  className="w-6 h-6 text-accent"
                  strokeWidth={1.5}
                />
              </div>

              <h2 className="text-lg font-bold text-primary">
                {translate("auth.forgotPassword.success.title")}
              </h2>

              <p className="text-sm text-secondary leading-relaxed">
                {interpolate("auth.forgotPassword.success.description", {
                  email,
                })}
              </p>

              <button
                onClick={() => router.push("/account/login")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-accent text-accent rounded-lg font-semibold hover:bg-accent hover:text-white transition-all"
              >
                {translate("auth.forgotPassword.success.cta")}
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
