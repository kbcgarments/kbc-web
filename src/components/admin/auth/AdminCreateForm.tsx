"use client";

import { useState } from "react";
import { AdminRole, useCreateAdmin } from "@/hooks/";
import { Mail, Lock, UserPlus, Loader2, User } from "lucide-react";
import { Input } from "../../ui/Input";
import { useRouter } from "next/navigation";

export function AdminCreateForm() {
  const createAdmin = useCreateAdmin();
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<AdminRole>(AdminRole.STAFF);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createAdmin.mutate({
      name: name.trim(),
      email: email.trim(),
      password,
      role,
    });
    router.push("/admin/auth/login");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <>
        <Input
          id="name"
          type="text"
          label="Name"
          icon={User}
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
        />
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

        <select
          id="role"
          title="role selector"
          value={role}
          onChange={(e) => setRole(e.target.value as AdminRole)}
          className="
              w-full px-4 py-3 border focus:border-none
              bg-secondary/20 border-primary/20
              text-primary rounded-lg duration-500
              focus:outline-none focus:ring-1 focus:ring-(--color-bg-accent)
              transition-all cursor-pointer "
        >
          <option value={AdminRole.STAFF}>Staff</option>
          <option value={AdminRole.ADMIN}>Admin</option>
        </select>
      </>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={createAdmin.isPending}
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
        {createAdmin.isPending ? (
          <Loader2 className="w-6 h-6 animate-spin text-white" />
        ) : (
          <>
            <UserPlus className="w-5 h-5 text-white" />
            <span>Create Admin</span>
          </>
        )}
      </button>
    </form>
  );
}
