'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isChunkError = error?.name === 'ChunkLoadError' || error?.message?.includes('Loading chunk')

  useEffect(() => {
    if (!isChunkError) return
    const reloaded = sessionStorage.getItem('chunk_reload')
    if (reloaded) return
    sessionStorage.setItem('chunk_reload', '1')
    window.location.reload()
  }, [isChunkError])

  if (isChunkError) {
    return (
      <html>
        <body style={{ fontFamily: 'sans-serif', padding: '2rem', textAlign: 'center', color: '#111' }}>
          <p>Versão atualizada disponível. Recarregando...</p>
          <button
            onClick={() => { sessionStorage.removeItem('chunk_reload'); window.location.reload() }}
            style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', cursor: 'pointer', background: '#F5820A', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem' }}
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
        }}>
          {error?.message || 'Erro desconhecido'}
          {'\n\n'}
          {error?.stack || ''}
        </pre>
        {error?.digest && (
          <p style={{ color: '#aaa' }}>Digest: {error.digest}</p>
        )}
        <button
          onClick={reset}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
        >
          Tentar novamente
        </button>
      </body>
    </html>
  )
}
