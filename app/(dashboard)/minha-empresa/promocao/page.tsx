'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PromocaoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    titulo: '', descricao: '', imagemUrl: '', validadeAte: '', ativo: true,
  })
  const [promoId, setPromoId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/comercios/minha')
      .then(r => r.json())
      .then(e => {
        const promo = e.promocoes?.[0]
        if (promo) {
          setPromoId(promo.id)
          setForm({
            titulo: promo.titulo || '',
            descricao: promo.descricao || '',
            imagemUrl: promo.imagemUrl || '',
            validadeAte: promo.validadeAte ? promo.validadeAte.split('T')[0] : '',
            ativo: promo.ativo ?? true,
          })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  function update(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!form.titulo || !form.descricao) { setError('Título e descrição são obrigatórios'); return }
    setSaving(true)
    try {
      const method = promoId ? 'PUT' : 'POST'
      const url = promoId ? `/api/comercios/promocao?id=${promoId}` : '/api/comercios/promocao'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Erro'); setSaving(false); return }
      setSuccess(true)
      setTimeout(() => { router.refresh(); setSuccess(false) }, 2000)
    } catch { setError('Erro inesperado') } finally { setSaving(false) }
  }

  if (loading) return <div className="text-text-muted">Carregando...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-2">Promoção do mês</h1>
      <p className="text-text-soft text-sm mb-6">Disponível apenas para planos Profissionais.</p>

      {error && <div className="bg-accent-light text-accent text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
      {success && <div className="bg-green-50 text-status-success text-sm px-4 py-3 rounded-lg mb-4">Promoção salva!</div>}

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1">Título *</label>
          <input type="text" value={form.titulo} onChange={e => update('titulo', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Descrição *</label>
          <textarea value={form.descricao} onChange={e => update('descricao', e.target.value)} rows={4} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">URL da imagem</label>
          <input type="text" value={form.imagemUrl} onChange={e => update('imagemUrl', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <UploadField onUpload={url => update('imagemUrl', url)} label="Upload da imagem" folder="promocoes" />
        <div>
          <label className="block text-sm font-medium text-text mb-1">Validade</label>
          <input type="date" value={form.validadeAte} onChange={e => update('validadeAte', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.ativo} onChange={e => update('ativo', e.target.checked)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
          <span className="text-sm text-text-soft">Ativa</span>
        </label>
        <button type="submit" disabled={saving} className="btn-primary py-2.5 px-6 disabled:opacity-60">
          {saving ? 'Salvando...' : 'Salvar promoção'}
        </button>
      </form>
    </div>
  )
}

function UploadField({ onUpload, label, folder }: { onUpload: (url: string) => void; label: string; folder: string }) {
  const [uploading, setUploading] = useState(false)
  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', folder)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload falhou')
      const data = await res.json()
      onUpload(data.url)
    } catch { alert('Erro no upload') } finally { setUploading(false) }
  }
  return (
    <div>
      <label className="block text-sm font-medium text-text mb-1">{label}</label>
      <input type="file" accept="image/*" onChange={handleChange} disabled={uploading} className="w-full text-sm text-text-soft file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-light file:text-primary" />
      {uploading && <p className="text-xs text-text-muted mt-1">Enviando...</p>}
    </div>
  )
}
