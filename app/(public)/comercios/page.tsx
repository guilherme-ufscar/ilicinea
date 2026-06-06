import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import BuscaComercios from './BuscaComercios'
import CardsComercios from './CardsComercios'
import NewsletterSignup from '@/components/NewsletterSignup'
import PublicModuleUnavailable from '@/components/PublicModuleUnavailable'

export const metadata: Metadata = {
  title: 'Guia Comercial',
  description: 'Encontre os melhores comércios e empresas de Ilicínea/MG.',
}

export const revalidate = 3600

async function getSegmentacoes() {
  const grouped = await prisma.empresa.groupBy({
    by: ['segmentacao'],
    where: { aprovado: true, ativo: true },
    _count: { segmentacao: true },
    orderBy: { _count: { segmentacao: 'desc' } },
  })
  return grouped.map((g) => [g.segmentacao, g._count.segmentacao] as [string, number])
}

export default async function ComerciosPage({
  searchParams,
}: {
  searchParams: { segmentacao?: string; busca?: string; page?: string }
}) {
  const segmentacao = searchParams.segmentacao
  const busca = searchParams.busca
  const page = parseInt(searchParams.page || '1')
  const limit = 20

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { aprovado: true, ativo: true }
  if (segmentacao) where.segmentacao = segmentacao
  if (busca) {
    where.OR = [
      { nomeFantasia: { contains: busca, mode: 'insensitive' } },
      { categoria: { contains: busca, mode: 'insensitive' } },
      { palavrasChave: { contains: busca, mode: 'insensitive' } },
    ]
  }

  try {
    const [empresas, total, segmentacoes] = await Promise.all([
      prisma.empresa.findMany({
        where,
        orderBy: [{ destaqueHome: 'desc' }, { plano: 'desc' }, { nomeFantasia: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          galeria: { orderBy: { ordem: 'asc' }, take: 5 },
          promocoes: { where: { ativo: true } },
        },
      }),
      prisma.empresa.count({ where }),
      getSegmentacoes(),
    ])

    const totalPages = Math.ceil(total / limit)

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Guia Comercial</h1>
          <p className="text-text-soft">Encontre os melhores comércios e empresas de Ilicínea/MG.</p>
        </div>

        <BuscaComercios
          segmentacoes={segmentacoes}
          segmentacaoAtiva={segmentacao}
          buscaAtiva={busca}
        />

        <CardsComercios empresas={empresas} />

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/comercios?page=${p}${segmentacao ? `&segmentacao=${segmentacao}` : ''}${busca ? `&busca=${busca}` : ''}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? 'bg-primary text-white'
                    : 'bg-white border border-border text-text hover:bg-primary-light'
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}

        {empresas.length === 0 && (
          <div className="text-center py-16 text-text-muted">
            <p className="text-lg mb-2">Nenhum comércio encontrado</p>
            <p>Tente ajustar os filtros ou tente uma nova busca.</p>
          </div>
        )}

        <div className="mt-16">
          <NewsletterSignup />
        </div>
      </div>
    )
  } catch {
    return (
      <PublicModuleUnavailable
        title="Guia Comercial temporariamente indisponível"
        description="Estamos restabelecendo os dados deste módulo. Tente novamente em instantes."
      />
    )
  }
}
