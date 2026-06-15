'use client'

import { useEffect } from 'react'

export default function Error({
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
      <div style={{ fontFamily: 'sans-serif', padding: '2rem', textAlign: 'center' }}>
        <p>Versão atualizada disponível. Recarregando...</p>
        <button
          onClick={() => { sessionStorage.removeItem('chunk_reload'); window.location.reload() }}
          style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', cursor: 'pointer', background: '#F5820A', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem' }}
        >
          Recarregar agora
        </button>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h2>Algo deu errado</h2>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  )
}
