'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FotosEmpresaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [fotos, setFotos] = useState<{ id: string; url: string; alt?: string }[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetch('/api/comercios/minha')
      .then(r => r.json())
      .then(e => { setFotos(e.galeria || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleUpload(file: File) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'empresas')
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const { url } = await res.json()

      await fetch('/api/comercios/galeria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      router.refresh()
      setFotos(prev => [...prev, { id: Date.now().toString(), url }])
    } catch { alert('Erro no upload') } finally { setUploading(false) }
  }

  async function removeFoto(id: string) {
    await fetch(`/api/comercios/galeria?id=${id}`, { method: 'DELETE' })
    setFotos(prev => prev.filter(f => f.id !== id))
    router.refresh()
  }

  if (loading) return <div className="text-text-muted">Carregando...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-2">Galeria de fotos</h1>
      <p className="text-text-soft text-sm mb-6">Adicione até 5 fotos da sua empresa.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {fotos.map(foto => (
          <div key={foto.id} className="relative aspect-square rounded-lg overflow-hidden bg-surface-soft border border-border group">
            <img src={foto.url} alt={foto.alt || 'Foto'} className="w-full h-full object-cover" />
            <button
              onClick={() => removeFoto(foto.id)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              &times;
            </button>
          </div>
        ))}
        {fotos.length < 5 && (
          <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors text-text-muted hover:text-primary">
            <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14" /></svg>
            <span className="text-xs">{uploading ? 'Enviando...' : 'Adicionar foto'}</span>
            <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} disabled={uploading} className="hidden" />
          </label>
        )}
      </div>
      <p className="text-xs text-text-muted">{fotos.length}/5 fotos</p>
    </div>
  )
}
