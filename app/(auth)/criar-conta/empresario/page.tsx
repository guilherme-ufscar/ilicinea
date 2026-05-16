'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

const SEGMENTACOES = [
  'Alimentação', 'Saúde', 'Beleza', 'Educação', 'Serviços', 'Varejo',
  'Automotivo', 'Construção', 'Tecnologia', 'Entretenimento', 'Outro',
]

export default function CadastroEmpresarioPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    nomeFantasia: '',
    razaoSocial: '',
    cnpj: '',
    categoria: '',
    segmentacao: '',
    telefone: '',
    celular: '',
    cep: '',
    endereco: '',
    bairro: '',
    numero: '',
    complemento: '',
  })

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function buscarCep() {
    if (form.cep.length < 8) return
    try {
      const res = await fetch(`https://viacep.com.br/ws/${form.cep.replace(/\D/g, '')}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          endereco: data.logradouro || '',
          bairro: data.bairro || '',
        }))
      }
    } catch {}
  }

  async function handleSubmit() {
    setError(null)
    setLoading(true)

    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: 'COMERCIANTE',
          nomeFantasia: form.nomeFantasia,
          razaoSocial: form.razaoSocial,
          cnpj: form.cnpj,
          categoria: form.categoria,
          segmentacao: form.segmentacao,
          telefone: form.telefone,
          celular: form.celular,
          cep: form.cep,
          endereco: form.endereco,
          bairro: form.bairro,
        }),
      })

      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }

      const loginRes = await signIn('credentials', { email: form.email, password: form.password, redirect: false })
      if (loginRes?.error) { setError('Conta criada, mas falha no login automático.'); setLoading(false); return }

      router.push('/minha-empresa')
      router.refresh()
    } catch {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function nextStep() {
    if (step === 1 && (!form.name || !form.email || !form.password || !form.confirmPassword)) {
      setError('Preencha todos os campos obrigatórios'); return
    }
    if (step === 1 && form.password !== form.confirmPassword) {
      setError('As senhas não coincidem'); return
    }
    if (step === 2 && (!form.nomeFantasia || !form.categoria || !form.segmentacao)) {
      setError('Preencha nome fantasia, categoria e segmentação'); return
    }
    setError(null)
    setStep((s) => s + 1)
  }

  return (
    <div className="w-full max-w-lg">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-text mb-1">Cadastro — Empresário</h1>
        <p className="text-text-soft text-sm mb-6">Etapa {step} de 3</p>

        <div className="flex gap-1 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-border'}`} />
          ))}
        </div>

        {error && <div className="bg-accent-light text-accent text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Nome completo *</label>
              <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">E-mail *</label>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Senha *</label>
              <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Mínimo 8 caracteres" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Confirmar senha *</label>
              <input type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Nome fantasia *</label>
              <input type="text" value={form.nomeFantasia} onChange={(e) => update('nomeFantasia', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Razão social</label>
              <input type="text" value={form.razaoSocial} onChange={(e) => update('razaoSocial', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">CNPJ</label>
              <input type="text" value={form.cnpj} onChange={(e) => update('cnpj', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Categoria *</label>
              <input type="text" value={form.categoria} onChange={(e) => update('categoria', e.target.value)} placeholder="Ex: Restaurante, Clínica, Loja" className="w-full px-4 py-3 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Segmentação *</label>
              <select value={form.segmentacao} onChange={(e) => update('segmentacao', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Selecione...</option>
                {SEGMENTACOES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Telefone fixo</label>
              <input type="tel" value={form.telefone} onChange={(e) => update('telefone', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Celular / WhatsApp</label>
              <input type="tel" value={form.celular} onChange={(e) => update('celular', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">CEP</label>
              <input type="text" value={form.cep} onChange={(e) => update('cep', e.target.value)} onBlur={buscarCep} className="w-full px-4 py-3 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Endereço</label>
              <input type="text" value={form.endereco} onChange={(e) => update('endereco', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Bairro</label>
              <input type="text" value={form.bairro} onChange={(e) => update('bairro', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button onClick={() => setStep((s) => s - 1)} className="btn-outline flex-1 py-3">Voltar</button>
          )}
          {step < 3 ? (
            <button onClick={nextStep} className="btn-primary flex-1 py-3">Próximo</button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 py-3 disabled:opacity-60">
              {loading ? 'Cadastrando...' : 'Criar conta'}
            </button>
          )}
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          Já tem conta? <Link href="/entrar" className="text-primary font-medium hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
