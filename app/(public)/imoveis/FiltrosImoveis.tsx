'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'

interface Props {
  tipoOptions: string[]
  negocioOptions: string[]
  ordemLabels: Record<string, string>
  filtroTipo?: string
  filtroNegocio?: string
  filtroBairro?: string
  filtroPrecoMin?: string
  filtroPrecoMax?: string
  filtroQuartos?: string
  filtroCodigo?: string
  filtroOrdem?: string
}

function formatTipoLabel(tipo: string): string {
  return tipo
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatNegocioLabel(negocio: string): string {
  return negocio
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function FiltrosImoveis({
  tipoOptions,
  negocioOptions,
  ordemLabels,
  filtroTipo,
  filtroNegocio,
  filtroBairro,
  filtroPrecoMin,
  filtroPrecoMax,
  filtroQuartos,
  filtroCodigo,
  filtroOrdem,
}: Props) {
  const router = useRouter()

  const [tipo, setTipo] = useState(filtroTipo || '')
  const [negocio, setNegocio] = useState(filtroNegocio || '')
  const [bairro, setBairro] = useState(filtroBairro || '')
  const [precoMin, setPrecoMin] = useState(filtroPrecoMin || '')
  const [precoMax, setPrecoMax] = useState(filtroPrecoMax || '')
  const [quartos, setQuartos] = useState(filtroQuartos || '')
  const [codigo, setCodigo] = useState(filtroCodigo || '')
  const [ordem, setOrdem] = useState(filtroOrdem || 'recentes')
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    setTipo(filtroTipo || '')
    setNegocio(filtroNegocio || '')
    setBairro(filtroBairro || '')
    setPrecoMin(filtroPrecoMin || '')
    setPrecoMax(filtroPrecoMax || '')
    setQuartos(filtroQuartos || '')
    setCodigo(filtroCodigo || '')
    setOrdem(filtroOrdem || 'recentes')
  }, [filtroTipo, filtroNegocio, filtroBairro, filtroPrecoMin, filtroPrecoMax, filtroQuartos, filtroCodigo, filtroOrdem])

  const aplicarFiltros = useCallback(() => {
    const params = new URLSearchParams()
    if (tipo) params.set('tipo', tipo)
    if (negocio) params.set('negocio', negocio)
    if (bairro) params.set('bairro', bairro)
    if (precoMin) params.set('precoMin', precoMin)
    if (precoMax) params.set('precoMax', precoMax)
    if (quartos) params.set('quartos', quartos)
    if (codigo) params.set('codigo', codigo)
    if (ordem && ordem !== 'recentes') params.set('ordem', ordem)
    params.set('page', '1')
    router.push(`/imoveis?${params.toString()}`)
  }, [tipo, negocio, bairro, precoMin, precoMax, quartos, codigo, ordem, router])

  const limparFiltros = () => {
    setTipo('')
    setNegocio('')
    setBairro('')
    setPrecoMin('')
    setPrecoMax('')
    setQuartos('')
    setCodigo('')
    setOrdem('recentes')
    router.push('/imoveis')
  }

  const hasFilters = tipo || negocio || bairro || precoMin || precoMax || quartos || codigo || ordem !== 'recentes'

  return (
    <div className="mb-8 space-y-4">
      {/* Linha principal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Tipo */}
        <select
          value={tipo}
          onChange={(e) => { setTipo(e.target.value); setTimeout(aplicarFiltros, 0) }}
          className="px-3 py-2.5 rounded-lg border border-border bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        >
          <option value="">Tipo de imóvel</option>
          {tipoOptions.map((t) => (
            <option key={t} value={t}>
              {formatTipoLabel(t)}
            </option>
          ))}
        </select>

        {/* Negócio */}
        <select
          value={negocio}
          onChange={(e) => { setNegocio(e.target.value); setTimeout(aplicarFiltros, 0) }}
          className="px-3 py-2.5 rounded-lg border border-border bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        >
          <option value="">Tipo de negócio</option>
          {negocioOptions.map((n) => (
            <option key={n} value={n}>
              {formatNegocioLabel(n)}
            </option>
          ))}
        </select>

        {/* Bairro */}
        <input
          type="text"
          value={bairro}
          onChange={(e) => setBairro(e.target.value)}
          onBlur={aplicarFiltros}
          onKeyDown={(e) => e.key === 'Enter' && aplicarFiltros()}
          placeholder="Bairro"
          className="px-3 py-2.5 rounded-lg border border-border bg-white text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />

        {/* Ordem */}
        <select
          value={ordem}
          onChange={(e) => { setOrdem(e.target.value); setTimeout(aplicarFiltros, 0) }}
          className="px-3 py-2.5 rounded-lg border border-border bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        >
          {Object.entries(ordemLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Avançado toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm font-medium text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
      >
        {showAdvanced ? 'Ocultar filtros' : 'Mais filtros'}
        <svg
          className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Filtros avançados */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Preço mínimo */}
          <input
            type="number"
            value={precoMin}
            onChange={(e) => setPrecoMin(e.target.value)}
            onBlur={aplicarFiltros}
            onKeyDown={(e) => e.key === 'Enter' && aplicarFiltros()}
            placeholder="Preço mínimo (R$)"
            className="px-3 py-2.5 rounded-lg border border-border bg-white text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />

          {/* Preço máximo */}
          <input
            type="number"
            value={precoMax}
            onChange={(e) => setPrecoMax(e.target.value)}
            onBlur={aplicarFiltros}
            onKeyDown={(e) => e.key === 'Enter' && aplicarFiltros()}
            placeholder="Preço máximo (R$)"
            className="px-3 py-2.5 rounded-lg border border-border bg-white text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />

          {/* Quartos */}
          <select
            value={quartos}
            onChange={(e) => { setQuartos(e.target.value); setTimeout(aplicarFiltros, 0) }}
            className="px-3 py-2.5 rounded-lg border border-border bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="">Quartos</option>
            {[1, 2, 3, 4].map((q) => (
              <option key={q} value={q}>
                {q} {q === 1 ? 'quarto' : 'quartos'}{q === 4 ? '+' : ''}
              </option>
            ))}
          </select>

          {/* Código */}
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            onBlur={aplicarFiltros}
            onKeyDown={(e) => e.key === 'Enter' && aplicarFiltros()}
            placeholder="Código do imóvel"
            className="px-3 py-2.5 rounded-lg border border-border bg-white text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
      )}

      {/* Limpar filtros */}
      {hasFilters && (
        <button
          onClick={limparFiltros}
          className="text-sm text-text-soft hover:text-accent transition-colors"
        >
          Limpar todos os filtros
        </button>
      )}
    </div>
  )
}
