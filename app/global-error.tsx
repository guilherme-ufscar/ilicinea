'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
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
