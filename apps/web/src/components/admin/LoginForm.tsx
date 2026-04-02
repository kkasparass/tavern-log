'use client'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

async function login(body: { email: string; password: string }) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Invalid credentials')
  return res.json()
}

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => router.push('/admin'),
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutation.mutate({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm text-white/70">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="bg-gray-800 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-white/30"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm text-white/70">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="bg-gray-800 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-white/30"
        />
      </div>
      {mutation.isError && (
        <p className="text-red-400 text-sm">{mutation.error.message}</p>
      )}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="bg-white text-gray-950 font-semibold rounded px-4 py-2 hover:bg-white/90 disabled:opacity-50 transition-colors"
      >
        {mutation.isPending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
