'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isChunkError =
    error?.name === 'ChunkLoadError' ||
    error?.message?.includes('Loading chunk') ||
    error?.message?.includes('loading chunk') ||
    error?.stack?.includes('ChunkLoadError') ||
    error?.message?.includes('Failed to fetch dynamically imported module') ||
    error?.message?.includes('Importing a module script failed')

  useEffect(() => {
    if (!isChunkError) return
    const key = 'chunk_reload_at'
    const last = Number(sessionStorage.getItem(key) || '0')
    const now = Date.now()
    if (now - last < 30_000) return
    sessionStorage.setItem(key, String(now))
    window.location.reload()
  }, [isChunkError])

  if (isChunkError) {
    return (
      <div style={{ fontFamily: 'sans-serif', padding: '2rem', textAlign: 'center' }}>
        <p style={{ marginBottom: '1rem' }}>Nova versão disponível. Recarregando…</p>
        <button
          onClick={() => {
            sessionStorage.removeItem('chunk_reload_at')
            window.location.reload()
          }}
          style={{ padding: '0.5rem 1.5rem', cursor: 'pointer', background: '#F5820A', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem' }}
        >
          Recarregar agora
        </button>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Algo deu errado</h2>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={() => window.location.reload()}
          style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#F5820A', color: '#fff', border: 'none', borderRadius: '6px' }}
        >
          Recarregar página
        </button>
        <button
          onClick={reset}
          style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#eee', border: '1px solid #ccc', borderRadius: '6px' }}
        >
          Tentar novamente
        </button>
      </div>
    </div>
  )
}
