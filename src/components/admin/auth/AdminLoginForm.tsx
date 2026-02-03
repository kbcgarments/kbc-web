"use client";

import { useState } from "react";
import { useAdminLogin } from "@/hooks";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "../../ui/Input";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAdminLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* EMAIL FIELD */}
      <Input
        id="email"
        type="email"
        label="Email"
        icon={Mail}
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="staff@kbcuniverse.org"
      />
      <Input
        id="password"
        type="password"
        label="Password"
        icon={Lock}
        required
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Set a strong password"
      />

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={login.isPending}
        className="
          w-full py-3 px-4
          bg-accent hover:bg-accent-dark active:scale-[0.98]
          text-white font-semibold rounded-lg
          transition-all duration-200 
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
          shadow-lg hover:shadow-xl
        "
      >
        {login.isPending ? (
          <Loader2 className="w-6 h-6 animate-spin text-white" />
        ) : (
          <>
            <span>Sign In</span>
            <ArrowRight className="w-5 h-5 text-white" />
          </>
        )}
      </button>

      {/* HELP TEXT */}
      <p className="text-center text-xs text-tertiary pt-4">
        Need help? Contact{" "}
        <a
          href="mailto:support@kbcfashion.com"
          className="text-accent hover:text-accent-dark font-medium transition-theme"
        >
          support@kbcfashion.com
        </a>
      </p>
    </form>
  );
}
