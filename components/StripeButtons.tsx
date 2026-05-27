'use client'

import { useState } from 'react'

export function UpgradeButton() {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Erro ao iniciar pagamento')
        setLoading(false)
      }
    } catch {
      alert('Erro inesperado')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="btn-primary w-full py-2 text-sm disabled:opacity-60"
    >
      {loading ? 'Redirecionando...' : 'Contratar'}
    </button>
  )
}

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Erro ao abrir portal')
        setLoading(false)
      }
    } catch {
      alert('Erro inesperado')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="btn-outline w-full py-2 text-sm disabled:opacity-60"
    >
      {loading ? 'Abrindo...' : 'Gerenciar assinatura'}
    </button>
  )
}
