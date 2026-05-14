'use client'

import { useState, FormEvent } from 'react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!email.trim()) {
      setStatus('error')
      setMessage('Informe um e-mail valido.')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage(data.message || 'Inscrito com sucesso!')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Erro ao inscrever.')
      }
    } catch {
      setStatus('error')
      setMessage('Erro de conexao. Tente novamente.')
    }
  }

  return (
    <div className="card p-5">
      <h3 className="text-lg font-bold text-text mb-1">Newsletter</h3>
      <p className="text-text-muted text-sm mb-4">
        Receba novidades e promocoes do comercio local.
      </p>

      {status === 'success' ? (
        <div className="bg-status-success/10 border border-status-success text-status-success rounded-lg px-4 py-3 text-sm">
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu melhor e-mail"
            required
            className="w-full px-4 py-3 rounded-lg border border-border text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={status === 'loading'}
          />

          {status === 'error' && (
            <p className="text-status-error text-sm">{message}</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-primary hover:bg-primary-hover text-white font-medium w-full py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Inscrevendo...' : 'Inscrever'}
          </button>
        </form>
      )}
    </div>
  )
}
