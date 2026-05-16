import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import PublicModuleUnavailable from '@/components/PublicModuleUnavailable'

export const metadata: Metadata = {
  title: 'Turismo em Ilicínea',
  description: 'Descubra os pontos turísticos de Ilicínea/MG.',
}

export const revalidate = 3600

const CATEGORIAS: { key: string; label: string }[] = [
  { key: 'NATUREZA', label: 'Natureza' },
  { key: 'RELIGIOSO', label: 'Religioso' },
  { key: 'HISTORICO', label: 'Histórico' },
  { key: 'CULTURAL', label: 'Cultural' },
  { key: 'ESPORTE_AVENTURA', label: 'Esporte/Aventura' },
  { key: 'GASTRONOMIA', label: 'Gastronomia' },
  { key: 'FESTIVAL_EVENTO', label: 'Festival/Evento' },
]

const DIFICULDADE_MAP: Record<string, string> = {
  FACIL: 'Fácil',
  MODERADO: 'Moderado',
  DIFICIL: 'Difícil',
}

const DIFICULDADE_COLORS: Record<string, string> = {
  FACIL: 'bg-green-100 text-green-800',
  MODERADO: 'bg-yellow-100 text-yellow-800',
  DIFICIL: 'bg-red-100 text-red-800',
}

function formatDistance(km: number | null | undefined): string {
  if (km === null || km === undefined) return ''
  if (km < 1) return `${(km * 1000).toFixed(0)}m do centro`
  return `${km.toFixed(1)}km do centro`
}

export default async function TurismoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const categoria = typeof sp.categoria === 'string' ? sp.categoria : null

  const where: Prisma.PontoTuristicoWhereInput = {
    status: 'PUBLICADO',
    ...(categoria && categoria !== 'Todas' ? { categoria: categoria as Prisma.EnumCategoriaTurismoFilter['equals'] } : {}),
  }

  try {
    const pontos = await prisma.pontoTuristico.findMany({
      where,
      orderBy: { nome: 'asc' },
    })

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="section-title mb-1">Turismo em Ilicínea</h1>
        <p className="section-subtitle mb-8">
          Descubra os encantos da cidade: natureza, cultura, gastronomia e muito mais.
        </p>

        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/turismo"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              !categoria || categoria === 'Todas'
                ? 'bg-primary text-white border-primary'
                : 'border-border text-text-soft hover:bg-primary-light hover:text-primary hover:border-primary'
            }`}
          >
            Todas
          </Link>
          {CATEGORIAS.map((cat) => (
            <Link
              key={cat.key}
              href={`/turismo?categoria=${cat.key}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                categoria === cat.key
                  ? 'bg-primary text-white border-primary'
                  : 'border-border text-text-soft hover:bg-primary-light hover:text-primary hover:border-primary'
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {pontos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-soft text-lg">Nenhum ponto turístico encontrado nesta categoria.</p>
            <Link href="/turismo" className="btn-primary mt-4 inline-block">
              Ver todos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pontos.map((ponto) => (
              <Link
                key={ponto.id}
                href={`/turismo/${ponto.slug}`}
                className="card overflow-hidden group flex flex-col"
              >
                <div className="relative w-full aspect-video bg-surface-soft">
                  {ponto.imagemCapa ? (
                    <img
                      src={ponto.imagemCapa}
                      alt={ponto.imagemCapaAlt || ponto.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">
                      <span className="inline-flex items-center gap-2">Sem foto</span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-2">
                    <span className="badge-essencial text-xs">
                      {CATEGORIAS.find((c) => c.key === ponto.categoria)?.label || ponto.categoria}
                    </span>
                  </div>

                  <h3 className="font-bold text-text group-hover:text-primary transition-colors line-clamp-1 mb-1">
                    {ponto.nome}
                  </h3>

                  {ponto.resumo && (
                    <p className="text-text-soft text-sm line-clamp-2 mb-3 flex-1">{ponto.resumo}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 mt-auto text-xs">
                    {ponto.distanciaCentro !== null && ponto.distanciaCentro !== undefined && (
                      <span className="inline-flex items-center gap-1 text-text-muted bg-surface-soft px-2 py-1 rounded-full border border-border">
                        {formatDistance(ponto.distanciaCentro)}
                      </span>
                    )}

                    {ponto.dificuldade && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${DIFICULDADE_COLORS[ponto.dificuldade]}`}>
                        {DIFICULDADE_MAP[ponto.dificuldade]}
                      </span>
                    )}

                    {ponto.entradaGratuita && (
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200 text-xs font-medium">
                        Entrada gratuita
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  } catch {
    return (
      <PublicModuleUnavailable
        title="Módulo de turismo temporariamente indisponível"
        description="Estamos restabelecendo os dados deste módulo. Tente novamente em instantes."
      />
    )
  }
}
