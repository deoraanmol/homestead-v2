"use client";

import { FormEvent, useState } from "react";
import { LogIn } from "lucide-react";
import { signInWithPassword } from "@/lib/supabase";

type Props = {
  disabled?: boolean;
  onSuccess?: () => void;
  onError?: (message: string) => void;
};

export function LoginForm({ disabled, onSuccess, onError }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (disabled) return;

    setSubmitting(true);
    const { error } = await signInWithPassword(email.trim(), password);
    setSubmitting(false);

    if (error) {
      onError?.(error);
      return;
    }

    onSuccess?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 sm:flex-row sm:items-center"
    >
      <input
        type="email"
        required
        autoComplete="email"
        disabled={disabled || submitting}
        className={inputClass}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        required
        autoComplete="current-password"
        disabled={disabled || submitting}
        className={inputClass}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="submit"
        disabled={disabled || submitting}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        <LogIn className="h-4 w-4" />
        {submitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full min-w-[140px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60 sm:w-auto";
