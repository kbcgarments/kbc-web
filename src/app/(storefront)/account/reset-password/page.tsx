/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { useResetPassword } from "@/hooks";
import { Input } from "@/components/ui/Input";
import { useLanguageStore } from "@/stores";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { translate } = useLanguageStore();

  const token = params.get("token");
  const resetPassword = useResetPassword();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError(translate("auth.resetPassword.invalidOrExpired"));
    }
  }, [token, translate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirm) {
      setError(translate("profile.settings.security.allFieldsRequired"));
      return;
    }

    if (password !== confirm) {
      setError(translate("profile.settings.security.passwordsDoNotMatch"));
      return;
    }

    try {
      await resetPassword.mutateAsync({
        token: token!,
        newPassword: password,
      });

      router.push("/account/login");
    } catch {
      setError(translate("auth.resetPassword.invalidOrExpired"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-secondary/20 border border-primary/10 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-primary mb-2">
          {translate("auth.resetPassword.title")}
        </h1>

        <p className="text-sm text-secondary mb-6">
          {translate("auth.resetPassword.subtitle")}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={translate("auth.resetPassword.newPassword")}
            type={showPassword ? "text" : "password"}
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

          <Input
            label={translate("auth.resetPassword.confirmPassword")}
            type={showPassword ? "text" : "password"}
            icon={Lock}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
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

          <button
            type="submit"
            disabled={resetPassword.isPending || !token}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            {resetPassword.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              translate("auth.resetPassword.submit")
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
