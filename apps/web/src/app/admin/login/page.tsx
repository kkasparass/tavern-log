import { LoginForm } from '@/components/admin/LoginForm'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-full max-w-sm bg-gray-900 border border-white/10 rounded-lg p-8">
        <h1 className="text-xl font-semibold text-white mb-6">Sign in</h1>
        <LoginForm />
      </div>
    </main>
  )
}
