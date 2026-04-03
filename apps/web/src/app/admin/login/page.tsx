import { LoginForm } from "@/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-full items-center justify-center bg-gray-950">
      <div className="w-full max-w-sm rounded-lg border border-white/10 bg-gray-900 p-8">
        <h1 className="mb-6 text-xl font-semibold text-white">Sign in</h1>
        <LoginForm />
      </div>
    </main>
  );
}
