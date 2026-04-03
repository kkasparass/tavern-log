"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";

async function login(body: { email: string; password: string }) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json();
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => window.location.assign("/admin"),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm text-white/70">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded border border-white/10 bg-gray-800 px-3 py-2 text-white focus:border-white/30 focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm text-white/70">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded border border-white/10 bg-gray-800 px-3 py-2 text-white focus:border-white/30 focus:outline-none"
        />
      </div>
      {mutation.isError && <p className="text-sm text-red-400">{mutation.error.message}</p>}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="rounded bg-white px-4 py-2 font-semibold text-gray-950 transition-colors hover:bg-white/90 disabled:opacity-50"
      >
        {mutation.isPending ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-sm text-white/50">
        No account?{" "}
        <Link href="/admin/register" className="text-white/70 underline hover:text-white">
          Create one
        </Link>
      </p>
    </form>
  );
}
