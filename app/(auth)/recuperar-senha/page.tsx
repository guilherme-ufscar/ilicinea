'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Erro ao enviar e-mail')
        setLoading(false)
        return
      }

      setSent(true)
    } catch {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="w-full max-w-md">
        <div className="card p-8 text-center">
          <div className="text-4xl mb-4">📧</div>
          <h1 className="text-xl font-bold text-text mb-2">E-mail enviado!</h1>
          <p className="text-text-soft text-sm">
            Se o e-mail informado estiver cadastrado, você receberá um link para redefinir sua senha.
          </p>
          <Link href="/entrar" className="btn-primary mt-6 inline-block">
            Voltar ao login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-text mb-1">Recuperar senha</h1>
        <p className="text-text-soft text-sm mb-6">
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </p>

        {error && <div className="bg-accent-light text-accent text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-lg border border-border text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
            {loading ? 'Enviando...' : 'Enviar link de recuperação'}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          <Link href="/entrar" className="text-primary hover:underline">
            Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  )
}
