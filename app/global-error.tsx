'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
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
    // recarrega automático apenas uma vez a cada 30 segundos
    if (now - last < 30_000) return
    sessionStorage.setItem(key, String(now))
    window.location.reload()
  }, [isChunkError])

  if (isChunkError) {
    return (
      <html>
        <body style={{ fontFamily: 'sans-serif', padding: '2rem', textAlign: 'center', color: '#111' }}>
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
        </body>
      </html>
    )
  }

  return (
    <html>
      <body style={{ fontFamily: 'monospace', padding: '2rem', background: '#1a1a1a', color: '#fff' }}>
        <h1 style={{ color: '#ff4444' }}>Erro na aplicação</h1>
        <pre style={{
          background: '#2a2a2a',
          padding: '1rem',
          borderRadius: '8px',
          overflow: 'auto',
          color: '#ffaaaa',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          fontSize: '0.85rem',
        }}>
          {error?.message || 'Erro desconhecido'}
          {'\n\n'}
          {error?.stack || ''}
        </pre>
        {error?.digest && (
          <p style={{ color: '#aaa', marginTop: '1rem' }}>Digest: {error.digest}</p>
        )}
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#F5820A', color: '#fff', border: 'none', borderRadius: '6px' }}
          >
            Recarregar página
          </button>
          <button
            onClick={() => window.history.back()}
            style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#333', color: '#fff', border: '1px solid #555', borderRadius: '6px' }}
          >
            Voltar
          </button>
        </div>
      </body>
    </html>
  )
}
