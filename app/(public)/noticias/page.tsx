import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Notícias de Ilicínea',
  description: 'Notícias e acontecimentos de Ilicínea/MG.',
}

export const revalidate = 1800

const CATEGORIAS = [
  'Esportes',
  'Cultura',
  'Política',
  'Saúde',
  'Educação',
  'Segurança',
  'Eventos',
  'Geral',
]

const ITEMS_PER_PAGE = 9

function formatDate(date: Date | null | undefined): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const categoria = typeof sp.categoria === 'string' ? sp.categoria : null
  const busca = typeof sp.busca === 'string' ? sp.busca : null
  const page = typeof sp.page === 'string' ? parseInt(sp.page, 10) || 1 : 1

  const where: Prisma.NoticiaWhereInput = {
    status: 'PUBLICADO',
    ...(categoria && categoria !== 'Todas' ? { categorias: { has: categoria } } : {}),
    ...(busca
      ? {
          OR: [
            { titulo: { contains: busca, mode: 'insensitive' } },
            { resumo: { contains: busca, mode: 'insensitive' } },
          ],
        }
      : {}),
  }

  const [noticias, total] = await Promise.all([
    prisma.noticia.findMany({
      where,
      orderBy: { publicadoEm: 'desc' },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.noticia.count({ where }),
  ])

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)
  const hero = noticias[0]
  const grid = noticias.slice(1)

  function buildUrl(params: Record<string, string | null>) {
    const query = new URLSearchParams()
    const currentCat = categoria || null
    const currentBusca = busca || null
    const cat = params.categoria !== undefined ? params.categoria : currentCat
    const q = params.busca !== undefined ? params.busca : currentBusca
    if (cat && cat !== 'Todas') query.set('categoria', cat)
    if (q) query.set('busca', q)
    if (params.page && params.page !== '1') query.set('page', params.page)
    const qs = query.toString()
    return qs ? `/noticias?${qs}` : '/noticias'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-title mb-1">Notícias de Ilicínea</h1>
      <p className="section-subtitle mb-8">Fique por dentro de tudo que acontece na cidade.</p>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-10">
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildUrl({ categoria: null, page: '1' })}
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
              key={cat}
              href={buildUrl({ categoria: cat, page: '1' })}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                categoria === cat
                  ? 'bg-primary text-white border-primary'
                  : 'border-border text-text-soft hover:bg-primary-light hover:text-primary hover:border-primary'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        <form
          className="sm:ml-auto flex gap-2"
          action="/noticias"
          method="GET"
        >
          {categoria && categoria !== 'Todas' && (
            <input type="hidden" name="categoria" value={categoria} />
          )}
          <input
            type="text"
            name="busca"
            defaultValue={busca || ''}
            placeholder="Buscar notícias..."
            className="px-4 py-2 rounded-lg border border-border text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm w-full sm:w-64"
          />
          <button type="submit" className="btn-primary px-3 py-2 text-sm">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </form>
      </div>

      {noticias.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-soft text-lg">Nenhuma notícia encontrada.</p>
          <Link href="/noticias" className="btn-primary mt-4 inline-block">
            Ver todas as notícias
          </Link>
        </div>
      ) : (
        <>
          {/* Hero */}
          {hero && (
            <Link href={`/noticias/${hero.slug}`} className="group block mb-10">
              <div className="card overflow-hidden">
                <div className="relative w-full aspect-[21/9] bg-surface-soft">
                  {hero.imagemCapa ? (
                    <img
                      src={hero.imagemCapa}
                      alt={hero.imagemCapaAlt || hero.titulo}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">
                      📰 Sem imagem de capa
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {hero.categorias.map((cat) => (
                      <span
                        key={cat}
                        className="badge-essencial"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl font-bold text-text group-hover:text-primary transition-colors mb-2">
                    {hero.titulo}
                  </h2>
                  {hero.resumo && (
                    <p className="text-text-soft line-clamp-2 mb-3">{hero.resumo}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-text-muted">
                    <span>{hero.autorNome}</span>
                    <span>{formatDate(hero.publicadoEm)}</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Grid */}
          {grid.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {grid.map((noticia) => (
                <Link
                  key={noticia.id}
                  href={`/noticias/${noticia.slug}`}
                  className="card overflow-hidden group flex flex-col"
                >
                  <div className="relative w-full aspect-video bg-surface-soft">
                    {noticia.imagemCapa ? (
                      <img
                        src={noticia.imagemCapa}
                        alt={noticia.imagemCapaAlt || noticia.titulo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">
                        📰 Sem imagem
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {noticia.categorias.slice(0, 3).map((cat) => (
                        <span
                          key={cat}
                          className="badge-essencial text-xs px-2 py-0.5"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-bold text-text group-hover:text-primary transition-colors line-clamp-2 mb-1">
                      {noticia.titulo}
                    </h3>
                    {noticia.resumo && (
                      <p className="text-text-soft text-sm line-clamp-2 mb-3 flex-1">
                        {noticia.resumo}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-text-muted mt-auto">
                      <span>{noticia.autorNome}</span>
                      <span>{formatDate(noticia.publicadoEm)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              {page > 1 && (
                <Link
                  href={buildUrl({ page: String(page - 1) })}
                  className="btn-outline text-sm py-1.5 px-3"
                >
                  Anterior
                </Link>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={buildUrl({ page: p === 1 ? '1' : String(p) })}
                  className={`w-10 h-10 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
                    p === page
                      ? 'bg-primary text-white'
                      : 'border border-border text-text-soft hover:bg-primary-light hover:text-primary'
                  }`}
                >
                  {p}
                </Link>
              ))}

              {page < totalPages && (
                <Link
                  href={buildUrl({ page: String(page + 1) })}
                  className="btn-outline text-sm py-1.5 px-3"
                >
                  Próxima
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
