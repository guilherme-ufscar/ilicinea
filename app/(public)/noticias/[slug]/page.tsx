import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 1800

function formatDate(date: Date | null | undefined): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function formatDateTime(date: Date | null | undefined): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const noticia = await prisma.noticia.findUnique({
    where: { slug, status: 'PUBLICADO' },
    select: {
      metaTitulo: true,
      metaDescricao: true,
      titulo: true,
      resumo: true,
      imagemCapa: true,
      imagemCapaAlt: true,
    },
  })

  if (!noticia) {
    return { title: 'Notícia não encontrada' }
  }

  return {
    title: noticia.metaTitulo || noticia.titulo,
    description: noticia.metaDescricao || noticia.resumo || `Leia a notícia "${noticia.titulo}".`,
    openGraph: noticia.imagemCapa
      ? {
          images: [noticia.imagemCapa],
        }
      : undefined,
    alternates: {
      canonical: `/noticias/${slug}`,
    },
  }
}

export default async function NoticiaDetailPage({ params }: Props) {
  const { slug } = await params

  const noticia = await prisma.noticia.findUnique({
    where: { slug, status: 'PUBLICADO' },
  })

  if (!noticia) notFound()

  const outras = await prisma.noticia.findMany({
    where: {
      status: 'PUBLICADO',
      id: { not: noticia.id },
      categorias: { hasSome: noticia.categorias },
    },
    orderBy: { publicadoEm: 'desc' },
    take: 4,
  })

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/noticias/${noticia.slug}`
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(`${noticia.titulo} — ${shareUrl}`)}`

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Início
        </Link>
        <span>/</span>
        <Link href="/noticias" className="hover:text-primary transition-colors">
          Notícias
        </Link>
        <span>/</span>
        <span className="text-text truncate">{noticia.titulo}</span>
      </nav>

      {/* Hero image */}
      {noticia.imagemCapa && (
        <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden mb-8 bg-surface-soft">
          <img
            src={noticia.imagemCapa}
            alt={noticia.imagemCapaAlt || noticia.titulo}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Categorias e tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {noticia.categorias.map((cat) => (
          <Link
            key={cat}
            href={`/noticias?categoria=${encodeURIComponent(cat)}`}
            className="badge-essencial hover:opacity-80 transition-opacity"
          >
            {cat}
          </Link>
        ))}
        {noticia.tags.map((tag) => (
          <span key={tag} className="bg-surface-soft text-text-soft text-xs font-medium px-2 py-0.5 rounded-full border border-border">
            {tag}
          </span>
        ))}
      </div>

      {/* Título e subtítulo */}
      <h1 className="text-3xl sm:text-4xl font-bold text-text mb-2">{noticia.titulo}</h1>
      {noticia.subtitulo && (
        <p className="text-lg text-text-soft mb-6">{noticia.subtitulo}</p>
      )}

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-8 pb-6 border-b border-border">
        <span className="flex items-center gap-1">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          {noticia.autorNome}
        </span>
        <span className="flex items-center gap-1">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {formatDateTime(noticia.publicadoEm)}
        </span>
        {noticia.fonte && (
          <span>
            Fonte: {noticia.linkFonte ? (
              <a
                href={noticia.linkFonte}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {noticia.fonte}
              </a>
            ) : (
              noticia.fonte
            )}
          </span>
        )}
        <span className="flex items-center gap-1">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {noticia.visualizacoes} visualizações
        </span>
      </div>

      {/* Local do evento */}
      {noticia.local && (
        <div className="flex items-center gap-2 text-sm text-text-soft bg-primary-light px-4 py-3 rounded-lg mb-6">
          <svg width="18" height="18" fill="none" stroke="#F5820A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>
            <strong>Local do evento:</strong> {noticia.local}
            {noticia.dataEvento && ` — ${formatDate(noticia.dataEvento)}`}
          </span>
        </div>
      )}

      {/* Conteúdo */}
      <div
        className="prose prose-lg max-w-none mb-10
          prose-headings:text-text prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
          prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3
          prose-p:text-text-soft prose-p:leading-relaxed prose-p:mb-5
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-xl prose-img:my-6
          prose-strong:text-text prose-strong:font-semibold
          prose-blockquote:border-l-primary prose-blockquote:bg-primary-light/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
          prose-ul:text-text-soft prose-ol:text-text-soft
          prose-li:marker:text-primary"
        dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
      />

      {/* Share buttons */}
      <div className="flex items-center gap-3 py-6 border-t border-b border-border mb-10">
        <span className="text-sm font-medium text-text">Compartilhar:</span>
        <a
          href={whatsappShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp text-sm py-1.5 px-4 inline-flex items-center gap-2"
        >
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
          WhatsApp
        </a>
        <button
          onClick={(e) => {
            navigator.clipboard.writeText(shareUrl)
              .then(() => alert('Link copiado!'))
              .catch(() => {})
          }}
          className="btn-outline text-sm py-1.5 px-4 inline-flex items-center gap-2"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copiar link
        </button>
      </div>

      {/* Outras notícias */}
      {outras.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-text mb-6">Outras notícias</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {outras.map((n) => (
              <Link
                key={n.id}
                href={`/noticias/${n.slug}`}
                className="card overflow-hidden group flex flex-col"
              >
                <div className="relative w-full aspect-video bg-surface-soft">
                  {n.imagemCapa ? (
                    <img
                      src={n.imagemCapa}
                      alt={n.imagemCapaAlt || n.titulo}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">
                      📰
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-text group-hover:text-primary transition-colors line-clamp-2 text-sm mb-1">
                    {n.titulo}
                  </h3>
                  <span className="text-xs text-text-muted mt-auto">
                    {formatDate(n.publicadoEm)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
