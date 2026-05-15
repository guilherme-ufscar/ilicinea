'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Icon from '@/components/Icon'

export default function ResetPasswordTokenPage() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres')
      return
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Erro ao redefinir senha')
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => router.push('/entrar'), 3000)
    } catch {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="card p-8 text-center">
          <div className="flex justify-center mb-4"><Icon name="check-circle" className="w-10 h-10 text-status-success" /></div>
          <h1 className="text-xl font-bold text-text mb-2">Senha redefinida!</h1>
          <p className="text-text-soft text-sm">Sua senha foi alterada com sucesso. Redirecionando para o login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-text mb-1">Redefinir senha</h1>
        <p className="text-text-soft text-sm mb-6">Digite sua nova senha.</p>

        {error && <div className="bg-accent-light text-accent text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Nova senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className="w-full px-4 py-3 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Confirmar senha</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita a senha"
              className="w-full px-4 py-3 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
            {loading ? 'Alterando...' : 'Redefinir senha'}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          <Link href="/entrar" className="text-primary hover:underline">← Voltar ao login</Link>
        </p>
      </div>
    </div>
  )
}
