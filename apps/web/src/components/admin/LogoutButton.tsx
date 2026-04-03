"use client";
import { useMutation } from "@tanstack/react-query";

export function LogoutButton() {
  const mutation = useMutation({
    mutationFn: () => fetch("/api/auth/logout", { method: "POST" }),
    onSuccess: () => window.location.assign("/admin/login"),
  });

  return (
    <button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className="text-sm text-white/50 transition-colors hover:text-white/80 disabled:opacity-50"
    >
      Sign out
    </button>
  );
}
