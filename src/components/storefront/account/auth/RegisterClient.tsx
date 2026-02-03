"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useRegister } from "@/hooks";
import { Input } from "@/components/ui/Input";
import { useLanguageStore } from "@/stores";
import { useRouter } from "next/navigation";

export default function RegisterClient() {
  const register = useRegister();
  const router = useRouter();
  const { translate } = useLanguageStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate({
      email,
      password,
      name: `${firstName} ${lastName}`.trim(),
    });
    router.push("/account/check-email");
  };

  return (
    <div className="bg-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
            {translate("auth.register.title")}
          </h1>
          <p className="text-sm sm:text-base text-secondary">
            {translate("auth.register.subtitle")}
          </p>
        </div>

        {/* Form */}
        <div className="bg-secondary/20 border border-primary/10 rounded-2xl p-6 sm:p-8">
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={translate("auth.register.form.firstName.label")}
                type="text"
                placeholder={translate(
                  "auth.register.form.firstName.placeholder",
                )}
                icon={User}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />

              <Input
                label={translate("auth.register.form.lastName.label")}
                type="text"
                placeholder={translate(
                  "auth.register.form.lastName.placeholder",
                )}
                icon={User}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <Input
              label={translate("auth.register.form.email.label")}
              type="email"
              placeholder={translate("auth.register.form.email.placeholder")}
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password */}
            <div>
              <Input
                label={translate("auth.register.form.password.label")}
                type={showPassword ? "text" : "password"}
                placeholder={translate(
                  "auth.register.form.password.placeholder",
                )}
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
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

              <p className="text-xs text-tertiary mt-2">
                {translate("auth.register.form.password.hint")}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={register.isPending}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {register.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 rounded-full animate-spin" />
                </>
              ) : (
                <>
                  {translate("auth.register.submit.default")}
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 pt-6 border-t border-primary/10">
            <p className="text-center text-sm text-secondary">
              {translate("auth.register.footer.alreadyHaveAccount")}{" "}
              <Link
                href="/account/login"
                className="text-accent font-semibold hover:underline"
              >
                {translate("auth.register.footer.signIn")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
