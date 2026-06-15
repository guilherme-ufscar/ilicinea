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
    if (isChunkError) {
      window.location.reload()
    }
  }, [isChunkError])

  if (isChunkError) {
    return <p style={{ fontFamily: 'sans-serif', padding: '2rem', textAlign: 'center' }}>Atualizando página...</p>
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h2>Algo deu errado</h2>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  )
}
