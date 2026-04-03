"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
async function register(body: { email: string; password: string }) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (res.status === 409) throw new Error("Email already registered");
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => window.location.assign("/admin"),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordError("");
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
      <div className="flex flex-col gap-1">
        <label htmlFor="confirmPassword" className="text-sm text-white/70">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="rounded border border-white/10 bg-gray-800 px-3 py-2 text-white focus:border-white/30 focus:outline-none"
        />
      </div>
      {passwordError && <p className="text-sm text-red-400">{passwordError}</p>}
      {mutation.isError && <p className="text-sm text-red-400">{mutation.error.message}</p>}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="rounded bg-white px-4 py-2 font-semibold text-gray-950 transition-colors hover:bg-white/90 disabled:opacity-50"
      >
        {mutation.isPending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
