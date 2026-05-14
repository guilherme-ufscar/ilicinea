'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import RichTextEditor from '@/components/editor/RichTextEditor'

const CATEGORIAS = ['Esportes', 'Cultura', 'Política', 'Saúde', 'Educação', 'Segurança', 'Eventos', 'Geral']

export default function EditarNoticiaPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    titulo: '', subtitulo: '', resumo: '', conteudo: '',
    autorNome: '', fonte: '', linkFonte: '', imagemCapa: '', imagemCapaAlt: '',
    local: '', dataEvento: '', metaTitulo: '', metaDescricao: '',
    status: 'RASCUNHO' as string, destaque: false, fixadoHome: false,
    categorias: [] as string[], tags: [] as string[], tagsInput: '',
  })

  useEffect(() => {
    fetch(`/api/noticias/${id}`)
      .then((r) => r.json())
      .then((n) => {
        setForm({
          titulo: n.titulo || '',
          subtitulo: n.subtitulo || '',
          resumo: n.resumo || '',
          conteudo: n.conteudo || '',
          autorNome: n.autorNome || '',
          fonte: n.fonte || '',
          linkFonte: n.linkFonte || '',
          imagemCapa: n.imagemCapa || '',
          imagemCapaAlt: n.imagemCapaAlt || '',
          local: n.local || '',
          dataEvento: n.dataEvento ? n.dataEvento.split('T')[0] : '',
          metaTitulo: n.metaTitulo || '',
          metaDescricao: n.metaDescricao || '',
          status: n.status || 'RASCUNHO',
          destaque: n.destaque || false,
          fixadoHome: n.fixadoHome || false,
          categorias: n.categorias || [],
          tags: n.tags || [],
          tagsInput: '',
        })
        setPageLoading(false)
      })
      .catch(() => { setError('Erro ao carregar notícia'); setPageLoading(false) })
  }, [id])

  function update(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function toggleCategoria(cat: string) {
    setForm((prev) => ({
      ...prev,
      categorias: prev.categorias.includes(cat)
        ? prev.categorias.filter((c) => c !== cat)
        : [...prev.categorias, cat],
    }))
  }

  function addTags() {
    const tags = form.tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
    if (tags.length > 0) {
      setForm((prev) => ({ ...prev, tags: [...new Set([...prev.tags, ...tags])], tagsInput: '' }))
    }
  }

  async function handleSubmit(e: React.FormEvent, publish = false) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`/api/noticias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          status: publish ? 'PUBLICADO' : form.status,
          tags: form.tags,
        }),
      })
      if (!res.ok) { const data = await res.json(); setError(data.error || 'Erro'); setLoading(false); return }
      router.push('/admin/noticias')
      router.refresh()
    } catch { setError('Erro inesperado') } finally { setLoading(false) }
  }

  if (pageLoading) return <div className="p-8 text-text-muted">Carregando...</div>

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Editar notícia</h1>
      </div>

      {error && <div className="bg-accent-light text-accent text-sm px-4 py-3 rounded-lg mb-6">{error}</div>}

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text">Informações básicas</h2>
          <InputField label="Título *" value={form.titulo} onChange={(v) => update('titulo', v)} />
          <InputField label="Subtítulo" value={form.subtitulo} onChange={(v) => update('subtitulo', v)} />
          <InputField label="Nome do autor *" value={form.autorNome} onChange={(v) => update('autorNome', v)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Fonte" value={form.fonte} onChange={(v) => update('fonte', v)} />
            <InputField label="Link da fonte" value={form.linkFonte} onChange={(v) => update('linkFonte', v)} />
          </div>
          <InputField label="Local do evento" value={form.local} onChange={(v) => update('local', v)} />
          <InputField label="Data do evento" type="date" value={form.dataEvento} onChange={(v) => update('dataEvento', v)} />
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text">Categorias</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIAS.map((cat) => (
              <button key={cat} type="button" onClick={() => toggleCategoria(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${form.categorias.includes(cat) ? 'bg-primary text-white border-primary' : 'border-border text-text-soft hover:bg-primary-light hover:text-primary hover:border-primary'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text">Imagem de capa</h2>
          <InputField label="URL da imagem de capa" value={form.imagemCapa} onChange={(v) => update('imagemCapa', v)} />
          <InputField label="Alt da imagem" value={form.imagemCapaAlt} onChange={(v) => update('imagemCapaAlt', v)} />
          <UploadField onUpload={(url) => update('imagemCapa', url)} label="Fazer upload da capa" folder="noticias" />
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Resumo *</h2>
          <textarea value={form.resumo} onChange={(e) => update('resumo', e.target.value)} maxLength={300} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
          <p className="text-xs text-text-muted">{form.resumo.length}/300</p>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Conteúdo completo *</h2>
          <RichTextEditor content={form.conteudo} onChange={(html) => update('conteudo', html)} placeholder="Escreva o corpo completo da notícia..." enableImageUpload={true} minHeight="500px" />
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text">Tags e SEO</h2>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Tags</label>
            <div className="flex gap-2">
              <input type="text" value={form.tagsInput} onChange={(e) => update('tagsInput', e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTags() } }} className="flex-1 px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
              <button type="button" onClick={addTags} className="btn-outline py-2 px-4 text-sm">Adicionar</button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {form.tags.map((tag) => (
                  <span key={tag} className="bg-surface-soft text-text-soft text-xs px-2 py-0.5 rounded-full border border-border flex items-center gap-1">
                    {tag}
                    <button type="button" onClick={() => update('tags', form.tags.filter((t) => t !== tag))} className="text-text-muted hover:text-accent">&times;</button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <InputField label="Meta título (SEO)" value={form.metaTitulo} onChange={(v) => update('metaTitulo', v)} />
          <InputField label="Meta descrição (SEO)" value={form.metaDescricao} onChange={(v) => update('metaDescricao', v)} type="textarea" />
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Publicação</h2>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.destaque} onChange={(e) => update('destaque', e.target.checked)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
              <span className="text-sm text-text-soft">Destaque</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.fixadoHome} onChange={(e) => update('fixadoHome', e.target.checked)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
              <span className="text-sm text-text-soft">Fixar na home</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-outline py-2.5 px-6 disabled:opacity-60">Salvar rascunho</button>
          <button type="button" disabled={loading} onClick={(e) => handleSubmit(e, true)} className="btn-primary py-2.5 px-6 disabled:opacity-60">{loading ? 'Salvando...' : 'Publicar'}</button>
        </div>
      </form>
    </div>
  )
}

function InputField({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  if (type === 'textarea') {
    return (
      <div>
        <label className="block text-sm font-medium text-text mb-1">{label}</label>
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
    )
  }
  return (
    <div>
      <label className="block text-sm font-medium text-text mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
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
