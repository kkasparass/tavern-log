"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: () => fetch("/api/auth/logout", { method: "POST" }),
    onSuccess: () => router.push("/admin/login"),
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
