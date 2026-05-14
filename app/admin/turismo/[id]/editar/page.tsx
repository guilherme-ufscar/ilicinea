'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import RichTextEditor from '@/components/editor/RichTextEditor'

const CATEGORIAS = [
  { key: 'NATUREZA', label: 'Natureza' }, { key: 'RELIGIOSO', label: 'Religioso' },
  { key: 'HISTORICO', label: 'Histórico' }, { key: 'CULTURAL', label: 'Cultural' },
  { key: 'ESPORTE_AVENTURA', label: 'Esporte/Aventura' }, { key: 'GASTRONOMIA', label: 'Gastronomia' },
  { key: 'FESTIVAL_EVENTO', label: 'Festival/Evento' },
]

const DIFICULDADES = ['FACIL', 'MODERADO', 'DIFICIL'] as const

export default function EditarTurismoPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    nome: '', subtitulo: '', resumo: '', descricao: '', categoria: 'NATUREZA',
    dificuldade: '', endereco: '', bairro: '', latitude: '', longitude: '',
    linkGoogleMaps: '', comoChegar: '', distanciaCentro: '', tempoDuracao: '',
    melhorEpoca: '', entradaGratuita: true, precoEntrada: '', acessivelPCD: false,
    horarioFuncionamento: '', telefoneContato: '', linkInstagram: '', linkSite: '',
    dicasImportantes: '', imagemCapa: '', imagemCapaAlt: '', videoUrl: '',
    metaTitulo: '', metaDescricao: '', tags: [] as string[], tagsInput: '',
    status: 'RASCUNHO' as string, destaque: false, fixadoHome: false,
    galeria: [] as { url: string; alt?: string }[],
  })

  useEffect(() => {
    fetch(`/api/turismo/${id}`)
      .then((r) => r.json())
      .then((p) => {
        setForm({
          nome: p.nome || '', subtitulo: p.subtitulo || '', resumo: p.resumo || '',
          descricao: p.descricao || '', categoria: p.categoria || 'NATUREZA',
          dificuldade: p.dificuldade || '', endereco: p.endereco || '', bairro: p.bairro || '',
          latitude: p.latitude?.toString() || '', longitude: p.longitude?.toString() || '',
          linkGoogleMaps: p.linkGoogleMaps || '', comoChegar: p.comoChegar || '',
          distanciaCentro: p.distanciaCentro?.toString() || '',
          tempoDuracao: p.tempoDuracao || '', melhorEpoca: p.melhorEpoca || '',
          entradaGratuita: p.entradaGratuita ?? true, precoEntrada: p.precoEntrada?.toString() || '',
          acessivelPCD: p.acessivelPCD || false,
          horarioFuncionamento: p.horarioFuncionamento || '',
          telefoneContato: p.telefoneContato || '', linkInstagram: p.linkInstagram || '',
          linkSite: p.linkSite || '', dicasImportantes: p.dicasImportantes || '',
          imagemCapa: p.imagemCapa || '', imagemCapaAlt: p.imagemCapaAlt || '',
          videoUrl: p.videoUrl || '', metaTitulo: p.metaTitulo || '',
          metaDescricao: p.metaDescricao || '', tags: p.tags || [], tagsInput: '',
          status: p.status || 'RASCUNHO', destaque: p.destaque || false,
          fixadoHome: p.fixadoHome || false, galeria: p.galeria || [],
        })
        setPageLoading(false)
      })
      .catch(() => { setError('Erro ao carregar'); setPageLoading(false) })
  }, [id])

  function update(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function addTags() {
    const tags = form.tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
    if (tags.length > 0) {
      setForm((prev) => ({ ...prev, tags: [...new Set([...prev.tags, ...tags])], tagsInput: '' }))
    }
  }

  function addGaleria(url: string) {
    setForm((prev) => ({ ...prev, galeria: [...prev.galeria, { url }] }))
  }

  function removeGaleria(index: number) {
    setForm((prev) => ({ ...prev, galeria: prev.galeria.filter((_, i) => i !== index) }))
  }

  async function handleSubmit(e: React.FormEvent, publish = false) {
    e.preventDefault()
    setError(null)
    if (!form.nome || !form.resumo || !form.descricao) { setError('Campos obrigatórios faltando'); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/turismo/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status: publish ? 'PUBLICADO' : form.status }),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Erro'); setLoading(false); return }
      router.push('/admin/turismo')
      router.refresh()
    } catch { setError('Erro inesperado') } finally { setLoading(false) }
  }

  if (pageLoading) return <div className="p-8 text-text-muted">Carregando...</div>

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-text mb-6">Editar ponto turístico</h1>
      {error && <div className="bg-accent-light text-accent text-sm px-4 py-3 rounded-lg mb-6">{error}</div>}

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text">Informações básicas</h2>
          <InputF label="Nome *" value={form.nome} onChange={(v) => update('nome', v)} />
          <InputF label="Subtítulo" value={form.subtitulo} onChange={(v) => update('subtitulo', v)} />
          <div>
            <label className="block text-sm font-medium text-text mb-1">Categoria *</label>
            <select value={form.categoria} onChange={(e) => update('categoria', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary">
              {CATEGORIAS.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Dificuldade</label>
            <select value={form.dificuldade} onChange={(e) => update('dificuldade', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Não informada</option>
              {DIFICULDADES.map((d) => <option key={d} value={d}>{d === 'FACIL' ? 'Fácil' : d === 'MODERADO' ? 'Moderado' : 'Difícil'}</option>)}
            </select>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text">Localização</h2>
          <InputF label="Endereço" value={form.endereco} onChange={(v) => update('endereco', v)} />
          <InputF label="Bairro" value={form.bairro} onChange={(v) => update('bairro', v)} />
          <div className="grid grid-cols-2 gap-4">
            <InputF label="Latitude" value={form.latitude} onChange={(v) => update('latitude', v)} type="number" />
            <InputF label="Longitude" value={form.longitude} onChange={(v) => update('longitude', v)} type="number" />
          </div>
          <InputF label="Link Google Maps" value={form.linkGoogleMaps} onChange={(v) => update('linkGoogleMaps', v)} />
          <InputF label="Distância do centro (km)" value={form.distanciaCentro} onChange={(v) => update('distanciaCentro', v)} type="number" />
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text">Informações práticas</h2>
          <InputF label="Horário de funcionamento" value={form.horarioFuncionamento} onChange={(v) => update('horarioFuncionamento', v)} />
          <InputF label="Tempo de duração" value={form.tempoDuracao} onChange={(v) => update('tempoDuracao', v)} />
          <InputF label="Melhor época" value={form.melhorEpoca} onChange={(v) => update('melhorEpoca', v)} />
          <InputF label="Telefone" value={form.telefoneContato} onChange={(v) => update('telefoneContato', v)} />
          <InputF label="Instagram" value={form.linkInstagram} onChange={(v) => update('linkInstagram', v)} />
          <InputF label="Site" value={form.linkSite} onChange={(v) => update('linkSite', v)} />
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.entradaGratuita} onChange={(e) => update('entradaGratuita', e.target.checked)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
              <span className="text-sm text-text-soft">Entrada gratuita</span>
            </label>
            {!form.entradaGratuita && <InputF label="Preço (R$)" value={form.precoEntrada} onChange={(v) => update('precoEntrada', v)} type="number" />}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.acessivelPCD} onChange={(e) => update('acessivelPCD', e.target.checked)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
              <span className="text-sm text-text-soft">Acessível PCD</span>
            </label>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text">Mídia</h2>
          <InputF label="URL da imagem de capa" value={form.imagemCapa} onChange={(v) => update('imagemCapa', v)} />
          <InputF label="Alt da imagem" value={form.imagemCapaAlt} onChange={(v) => update('imagemCapaAlt', v)} />
          <UploadField onUpload={(url) => update('imagemCapa', url)} label="Fazer upload da capa" folder="turismo" />
          <InputF label="URL do vídeo (YouTube)" value={form.videoUrl} onChange={(v) => update('videoUrl', v)} />

          <div>
            <label className="block text-sm font-medium text-text mb-1">Galeria</label>
            <UploadField onUpload={addGaleria} label="Adicionar foto à galeria" folder="turismo" />
            {form.galeria.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
                {form.galeria.map((foto, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-surface-soft border border-border group">
                    <img src={foto.url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeGaleria(i)} className="absolute top-1 right-1 bg-accent text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Resumo *</h2>
          <textarea value={form.resumo} onChange={(e) => update('resumo', e.target.value)} maxLength={300} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
          <p className="text-xs text-text-muted">{form.resumo.length}/300</p>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Descrição completa *</h2>
          <RichTextEditor content={form.descricao} onChange={(html) => update('descricao', html)} placeholder="Descreva o ponto turístico em detalhes..." enableImageUpload={true} minHeight="400px" />
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text">Texto adicional</h2>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Como chegar</label>
            <RichTextEditor content={form.comoChegar} onChange={(html) => update('comoChegar', html)} placeholder="Descreva como o visitante chega ao local..." enableImageUpload={false} minHeight="200px" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Dicas importantes</label>
            <RichTextEditor content={form.dicasImportantes} onChange={(html) => update('dicasImportantes', html)} placeholder="Dicas para os visitantes..." enableImageUpload={false} minHeight="200px" />
          </div>
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
          <InputF label="Meta título (SEO)" value={form.metaTitulo} onChange={(v) => update('metaTitulo', v)} />
          <InputF label="Meta descrição (SEO)" value={form.metaDescricao} onChange={(v) => update('metaDescricao', v)} />
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

function InputF({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-text mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
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
