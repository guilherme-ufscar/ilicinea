import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { TipoImovel, NegocioImovel } from '@prisma/client'
import FiltrosImoveis from './FiltrosImoveis'
import CardImovel from '@/components/CardImovel'
import PublicModuleUnavailable from '@/components/PublicModuleUnavailable'

export const metadata: Metadata = {
  title: 'Imóveis em Ilicínea',
  description: 'Encontre imóveis para venda, aluguel e temporada em Ilicínea/MG.',
}

export const revalidate = 600

const TIPO_OPTIONS = Object.values(TipoImovel) as string[]
const NEGOCIO_OPTIONS = Object.values(NegocioImovel) as string[]

const ORDEM_LABELS: Record<string, string> = {
  recentes: 'Mais recentes',
  'menor-preco': 'Menor preço',
  'maior-preco': 'Maior preço',
}

export default async function ImoveisPage({
  searchParams,
}: {
  searchParams: {
    tipo?: string
    negocio?: string
    bairro?: string
    precoMin?: string
    precoMax?: string
    quartos?: string
    codigo?: string
    page?: string
    ordem?: string
  }
}) {
  const tipo = searchParams.tipo
  const negocio = searchParams.negocio
  const bairro = searchParams.bairro
  const precoMin = searchParams.precoMin ? parseFloat(searchParams.precoMin) : undefined
  const precoMax = searchParams.precoMax ? parseFloat(searchParams.precoMax) : undefined
  const quartos = searchParams.quartos ? parseInt(searchParams.quartos) : undefined
  const codigo = searchParams.codigo
  const page = parseInt(searchParams.page || '1')
  const ordem = searchParams.ordem || 'recentes'
  const limit = 15

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { status: 'ATIVO' }

  if (tipo) where.tipo = tipo
  if (negocio) where.negocio = negocio
  if (bairro) where.bairro = { contains: bairro, mode: 'insensitive' }
  if (precoMin !== undefined || precoMax !== undefined) {
    where.preco = {}
    if (precoMin !== undefined) where.preco.gte = precoMin
    if (precoMax !== undefined) where.preco.lte = precoMax
  }
  if (quartos !== undefined) where.quartos = quartos >= 4 ? { gte: 4 } : quartos
  if (codigo) where.codigo = { contains: codigo, mode: 'insensitive' }

  const orderBy: Record<string, string> =
    ordem === 'menor-preco'
      ? { preco: 'asc' }
      : ordem === 'maior-preco'
        ? { preco: 'desc' }
        : { createdAt: 'desc' }

  try {
    const [imoveis, total] = await Promise.all([
      prisma.imovel.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          fotos: {
            orderBy: { ordem: 'asc' },
            take: 1,
            select: { url: true, alt: true },
          },
        },
      }),
      prisma.imovel.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Imóveis em Ilicínea</h1>
          <p className="text-text-soft">
            {total > 0
              ? `${total} imóvel${total > 1 ? 'is' : ''} encontrado${total > 1 ? 's' : ''}`
              : 'Encontre imóveis para venda, aluguel e temporada em Ilicínea/MG.'}
          </p>
        </div>

        <FiltrosImoveis
          tipoOptions={TIPO_OPTIONS}
          negocioOptions={NEGOCIO_OPTIONS}
          ordemLabels={ORDEM_LABELS}
          filtroTipo={tipo}
          filtroNegocio={negocio}
          filtroBairro={bairro}
          filtroPrecoMin={searchParams.precoMin}
          filtroPrecoMax={searchParams.precoMax}
          filtroQuartos={searchParams.quartos}
          filtroCodigo={codigo}
          filtroOrdem={ordem}
        />

        {imoveis.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imoveis.map((imovel) => (
              <CardImovel key={imovel.id} imovel={imovel} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-text-muted">
            <p className="text-lg mb-2">Nenhum imóvel encontrado</p>
            <p>Tente ajustar os filtros ou faça uma nova busca.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }, (_, i) => {
              const p = i + 1
              const params = new URLSearchParams()
              if (tipo) params.set('tipo', tipo)
              if (negocio) params.set('negocio', negocio)
              if (bairro) params.set('bairro', bairro)
              if (searchParams.precoMin) params.set('precoMin', searchParams.precoMin)
              if (searchParams.precoMax) params.set('precoMax', searchParams.precoMax)
              if (searchParams.quartos) params.set('quartos', searchParams.quartos)
              if (codigo) params.set('codigo', codigo)
              if (ordem && ordem !== 'recentes') params.set('ordem', ordem)
              params.set('page', String(p))

              return (
                <Link
                  key={p}
                  href={`/imoveis?${params.toString()}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-primary text-white'
                      : 'bg-white border border-border text-text hover:bg-primary-light'
                  }`}
                >
                  {p}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  } catch {
    return (
      <PublicModuleUnavailable
        title="Módulo de imóveis temporariamente indisponível"
        description="Estamos restabelecendo os dados deste módulo. Tente novamente em instantes."
      />
    )
  }
}
