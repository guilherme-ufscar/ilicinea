'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import RichTextEditor from '@/components/editor/RichTextEditor'

const CATEGORIAS = ['Esportes', 'Cultura', 'Política', 'Saúde', 'Educação', 'Segurança', 'Eventos', 'Geral']

export default function NovaNoticiaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    titulo: '',
    subtitulo: '',
    resumo: '',
    conteudo: '',
    autorNome: '',
    fonte: '',
    linkFonte: '',
    imagemCapa: '',
    imagemCapaAlt: '',
    local: '',
    dataEvento: '',
    metaTitulo: '',
    metaDescricao: '',
    status: 'RASCUNHO' as 'RASCUNHO' | 'PUBLICADO',
    destaque: false,
    fixadoHome: false,
    categorias: [] as string[],
    tags: [] as string[],
    tagsInput: '',
  })

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
      setForm((prev) => ({
        ...prev,
        tags: [...new Set([...prev.tags, ...tags])],
        tagsInput: '',
      }))
    }
  }

  async function handleImageUpload(file: File): Promise<string> {
    const uploadForm = new FormData()
    uploadForm.append('file', file)
    uploadForm.append('folder', 'noticias')
    const res = await fetch('/api/upload', { method: 'POST', body: uploadForm })
    if (!res.ok) throw new Error('Upload falhou')
    const data = await res.json()
    return data.url
  }

  async function handleSubmit(e: React.FormEvent, publishAfterSave = false) {
    e.preventDefault()
    setError(null)

    if (!form.titulo || !form.resumo || !form.conteudo || !form.autorNome) {
      setError('Título, resumo, conteúdo e autor são obrigatórios')
      return
    }

    if (form.categorias.length === 0) {
      setError('Selecione pelo menos uma categoria')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/noticias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          status: publishAfterSave ? 'PUBLICADO' : form.status,
          tags: form.tags,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Erro ao criar notícia')
        setLoading(false)
        return
      }

      router.push('/admin/noticias')
      router.refresh()
    } catch {
      setError('Erro inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Nova notícia</h1>
      </div>

      {error && <div className="bg-accent-light text-accent text-sm px-4 py-3 rounded-lg mb-6">{error}</div>}

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text mb-4">Informações básicas</h2>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Título *</label>
            <input type="text" value={form.titulo} onChange={(e) => update('titulo', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Subtítulo</label>
            <input type="text" value={form.subtitulo} onChange={(e) => update('subtitulo', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Nome do autor *</label>
            <input type="text" value={form.autorNome} onChange={(e) => update('autorNome', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Fonte</label>
              <input type="text" value={form.fonte} onChange={(e) => update('fonte', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Link da fonte</label>
              <input type="url" value={form.linkFonte} onChange={(e) => update('linkFonte', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Local do evento</label>
            <input type="text" value={form.local} onChange={(e) => update('local', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Data do evento</label>
            <input type="date" value={form.dataEvento} onChange={(e) => update('dataEvento', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text mb-4">Categorias</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategoria(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  form.categorias.includes(cat)
                    ? 'bg-primary text-white border-primary'
                    : 'border-border text-text-soft hover:bg-primary-light hover:text-primary hover:border-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text mb-4">Imagem de capa</h2>

          <div>
            <label className="block text-sm font-medium text-text mb-1">URL da imagem de capa</label>
            <input type="text" value={form.imagemCapa} onChange={(e) => update('imagemCapa', e.target.value)} placeholder="https://... ou faça upload abaixo" className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Alt da imagem</label>
            <input type="text" value={form.imagemCapaAlt} onChange={(e) => update('imagemCapaAlt', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <UploadField onUpload={(url) => update('imagemCapa', url)} label="Fazer upload da capa" folder="noticias" />
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text mb-4">Resumo (para cards e SEO)</h2>
          <textarea
            value={form.resumo}
            onChange={(e) => update('resumo', e.target.value)}
            maxLength={300}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Resumo da notícia (máx 300 caracteres)..."
          />
          <p className="text-xs text-text-muted">{form.resumo.length}/300 caracteres</p>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text mb-4">Conteúdo completo *</h2>
          <RichTextEditor
            content={form.conteudo}
            onChange={(html) => update('conteudo', html)}
            placeholder="Escreva o corpo completo da notícia..."
            enableImageUpload={true}
            minHeight="500px"
          />
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text mb-4">Tags e SEO</h2>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.tagsInput}
                onChange={(e) => update('tagsInput', e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTags() } }}
                placeholder="Separar por vírgula"
                className="flex-1 px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="button" onClick={addTags} className="btn-outline py-2 px-4 text-sm">Adicionar</button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {form.tags.map((tag) => (
                  <span key={tag} className="bg-surface-soft text-text-soft text-xs font-medium px-2 py-0.5 rounded-full border border-border flex items-center gap-1">
                    {tag}
                    <button type="button" onClick={() => update('tags', form.tags.filter((t) => t !== tag))} className="text-text-muted hover:text-accent">&times;</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Meta título (SEO)</label>
            <input type="text" value={form.metaTitulo} onChange={(e) => update('metaTitulo', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Meta descrição (SEO)</label>
            <textarea value={form.metaDescricao} onChange={(e) => update('metaDescricao', e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        <div className="card p-6 space-y-4">
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
          <button
            type="submit"
            disabled={loading}
            className="btn-outline py-2.5 px-6 disabled:opacity-60"
          >
            Salvar rascunho
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={(e) => handleSubmit(e, true)}
            className="btn-primary py-2.5 px-6 disabled:opacity-60"
          >
            {loading ? 'Salvando...' : 'Publicar'}
          </button>
        </div>
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
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload falhou')
      const data = await res.json()
      onUpload(data.url)
    } catch (err) {
      console.error('Upload error:', err)
      alert('Erro no upload')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-text mb-1">{label}</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={uploading}
        className="w-full text-sm text-text-soft file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-light file:text-primary hover:file:bg-primary/20 cursor-pointer"
      />
      {uploading && <p className="text-xs text-text-muted mt-1">Enviando...</p>}
    </div>
  )
}
