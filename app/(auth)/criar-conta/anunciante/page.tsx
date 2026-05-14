'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function CadastroAnunciantePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefone: '',
    creci: '',
  })

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: 'ANUNCIANTE_IMOVEL',
        }),
      })

      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }

      const loginRes = await signIn('credentials', { email: form.email, password: form.password, redirect: false })
      if (loginRes?.error) { setError('Conta criada, mas falha no login automático.'); setLoading(false); return }

      router.push('/meus-imoveis')
      router.refresh()
    } catch {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-text mb-1">Cadastro — Anunciante de Imóvel</h1>
        <p className="text-text-soft text-sm mb-6">Crie sua conta para anunciar imóveis em Ilicínea</p>

        {error && <div className="bg-accent-light text-accent text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Nome completo *</label>
            <input type="text" required value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">E-mail *</label>
            <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Senha *</label>
            <input type="password" required value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Mínimo 8 caracteres" className="w-full px-4 py-3 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Confirmar senha *</label>
            <input type="password" required value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Telefone / WhatsApp</label>
            <input type="tel" value={form.telefone} onChange={(e) => update('telefone', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">CRECI (opcional)</label>
            <input type="text" value={form.creci} onChange={(e) => update('creci', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
            {loading ? 'Cadastrando...' : 'Criar conta'}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          Já tem conta? <Link href="/entrar" className="text-primary font-medium hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
