'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SEGMENTACOES = ['Alimentação', 'Saúde', 'Beleza', 'Educação', 'Serviços', 'Varejo', 'Automotivo', 'Construção', 'Tecnologia', 'Entretenimento', 'Outro']

export default function EditarEmpresaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    nomeFantasia: '', razaoSocial: '', cnpj: '', categoria: '', segmentacao: '',
    telefone: '', celular: '', whatsapp: '', email: '', cep: '', endereco: '',
    bairro: '', cidade: 'Ilicínea', estado: 'MG',
    descricao: '', palavrasChave: '',
    linkInstagram: '', linkFacebook: '', linkSite: '', linkGoogleMaps: '',
    fotoPerfil: '', fotoFachada: '',
  })

  useEffect(() => {
    fetch('/api/comercios/minha')
      .then(r => r.json())
      .then(e => {
        if (e.id) {
          setForm({
            nomeFantasia: e.nomeFantasia || '', razaoSocial: e.razaoSocial || '',
            cnpj: e.cnpj || '', categoria: e.categoria || '', segmentacao: e.segmentacao || '',
            telefone: e.telefone || '', celular: e.celular || '', whatsapp: e.whatsapp || '',
            email: e.email || '', cep: e.cep || '', endereco: e.endereco || '',
            bairro: e.bairro || '', cidade: e.cidade || 'Ilicínea', estado: e.estado || 'MG',
            descricao: e.descricao || '', palavrasChave: e.palavrasChave || '',
            linkInstagram: e.linkInstagram || '', linkFacebook: e.linkFacebook || '',
            linkSite: e.linkSite || '', linkGoogleMaps: e.linkGoogleMaps || '',
            fotoPerfil: e.fotoPerfil || '', fotoFachada: e.fotoFachada || '',
          })
        }
        setPageLoading(false)
      })
      .catch(() => setPageLoading(false))
  }, [])

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/comercios/editar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Erro'); setLoading(false); return }
      setSuccess(true)
      setTimeout(() => { router.refresh(); setSuccess(false) }, 2000)
    } catch { setError('Erro inesperado') } finally { setLoading(false) }
  }

  async function buscarCep() {
    if (form.cep.replace(/\D/g, '').length < 8) return
    try {
      const res = await fetch(`https://viacep.com.br/ws/${form.cep.replace(/\D/g, '')}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setForm(prev => ({ ...prev, endereco: data.logradouro || '', bairro: data.bairro || '' }))
      }
    } catch {}
  }

  if (pageLoading) return <div className="text-text-muted">Carregando...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-6">Editar empresa</h1>

      {error && <div className="bg-accent-light text-accent text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
      {success && <div className="bg-green-50 text-status-success text-sm px-4 py-3 rounded-lg mb-4">Dados salvos com sucesso!</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text">Dados básicos</h2>
          <GridInput label="Nome fantasia *" value={form.nomeFantasia} onChange={v => update('nomeFantasia', v)} />
          <GridInput label="Razão social" value={form.razaoSocial} onChange={v => update('razaoSocial', v)} />
          <GridInput label="CNPJ" value={form.cnpj} onChange={v => update('cnpj', v)} />
          <GridInput label="Categoria *" value={form.categoria} onChange={v => update('categoria', v)} />
          <div>
            <label className="block text-sm font-medium text-text mb-1">Segmentação *</label>
            <select value={form.segmentacao} onChange={e => update('segmentacao', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Selecione...</option>
              {SEGMENTACOES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text">Contato</h2>
          <GridInput label="Telefone fixo" value={form.telefone} onChange={v => update('telefone', v)} />
          <GridInput label="Celular" value={form.celular} onChange={v => update('celular', v)} />
          <GridInput label="WhatsApp (com DDD)" value={form.whatsapp} onChange={v => update('whatsapp', v)} placeholder="5535999999999" />
          <GridInput label="E-mail" value={form.email} onChange={v => update('email', v)} />
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text">Endereço</h2>
          <GridInput label="CEP" value={form.cep} onChange={v => update('cep', v)} onBlur={buscarCep} />
          <GridInput label="Endereço" value={form.endereco} onChange={v => update('endereco', v)} />
          <GridInput label="Bairro" value={form.bairro} onChange={v => update('bairro', v)} />
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text">Online (Plano Essencial+)</h2>
          <GridInput label="Descrição" value={form.descricao} onChange={v => update('descricao', v)} type="textarea" />
          <GridInput label="Palavras-chave (separadas por vírgula)" value={form.palavrasChave} onChange={v => update('palavrasChave', v)} />
          <GridInput label="Instagram" value={form.linkInstagram} onChange={v => update('linkInstagram', v)} />
          <GridInput label="Facebook" value={form.linkFacebook} onChange={v => update('linkFacebook', v)} />
          <GridInput label="Site" value={form.linkSite} onChange={v => update('linkSite', v)} />
          <GridInput label="Google Maps" value={form.linkGoogleMaps} onChange={v => update('linkGoogleMaps', v)} />
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text">Fotos</h2>
          <GridInput label="URL Foto de perfil" value={form.fotoPerfil} onChange={v => update('fotoPerfil', v)} />
          <UploadField onUpload={url => update('fotoPerfil', url)} label="Upload foto perfil" folder="empresas" />
          <GridInput label="URL Foto fachada" value={form.fotoFachada} onChange={v => update('fotoFachada', v)} />
          <UploadField onUpload={url => update('fotoFachada', url)} label="Upload foto fachada" folder="empresas" />
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary py-2.5 px-6 disabled:opacity-60">
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </button>
          <Link href="/minha-empresa" className="btn-outline py-2.5 px-6">Cancelar</Link>
        </div>
      </form>
    </div>
  )
}

function GridInput({ label, value, onChange, type = 'text', onBlur, placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; onBlur?: () => void; placeholder?: string }) {
  const isTextarea = type === 'textarea'
  const Component = isTextarea ? 'textarea' : 'input'
  return (
    <div>
      <label className="block text-sm font-medium text-text mb-1">{label}</label>
      {/* @ts-ignore */}
      <Component
        type={!isTextarea ? type : undefined}
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={isTextarea ? 3 : undefined}
        className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary"
      />
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
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
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
