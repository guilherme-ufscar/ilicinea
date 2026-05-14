'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Props {
  segmentacoes: [string, number][]
  segmentacaoAtiva?: string
  buscaAtiva?: string
}

export default function BuscaComercios({ segmentacoes, segmentacaoAtiva, buscaAtiva }: Props) {
  const router = useRouter()
  const [busca, setBusca] = useState(buscaAtiva || '')

  useEffect(() => {
    setBusca(buscaAtiva || '')
  }, [buscaAtiva])

  function pesquisar() {
    const params = new URLSearchParams()
    if (busca) params.set('busca', busca)
    if (segmentacaoAtiva) params.set('segmentacao', segmentacaoAtiva)
    router.push(`/comercios?${params.toString()}`)
  }

  function limparSegmentacao() {
    const params = new URLSearchParams()
    if (busca) params.set('busca', busca)
    router.push(`/comercios?${params.toString()}`)
  }

  return (
    <div className="mb-8 space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && pesquisar()}
          placeholder="Buscar comércio por nome, categoria ou palavra-chave..."
          className="flex-1 px-4 py-3 rounded-lg border border-border text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button onClick={pesquisar} className="btn-primary px-6 py-3">Buscar</button>
      </div>

      {segmentacoes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {segmentacaoAtiva && (
            <button
              onClick={limparSegmentacao}
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-primary text-white"
            >
              ✕ Todos
            </button>
          )}
          {segmentacoes.map(([seg, count]) => (
            <Link
              key={seg}
              href={`/comercios?segmentacao=${encodeURIComponent(seg)}${busca ? `&busca=${encodeURIComponent(busca)}` : ''}`}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                seg === segmentacaoAtiva
                  ? 'bg-primary text-white'
                  : 'bg-surface-soft text-text border border-border hover:bg-primary-light hover:text-primary'
              }`}
            >
              {seg} ({count})
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
