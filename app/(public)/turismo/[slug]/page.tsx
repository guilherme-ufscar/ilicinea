import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

const CATEGORIA_LABEL: Record<string, string> = {
  NATUREZA: 'Natureza', RELIGIOSO: 'Religioso', HISTORICO: 'Histórico',
  CULTURAL: 'Cultural', ESPORTE_AVENTURA: 'Esporte/Aventura',
  GASTRONOMIA: 'Gastronomia', FESTIVAL_EVENTO: 'Festival/Evento',
}

const DIFICULDADE_MAP: Record<string, string> = {
  FACIL: 'Fácil', MODERADO: 'Moderado', DIFICIL: 'Difícil',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const ponto = await prisma.pontoTuristico.findFirst({
    where: { slug, status: 'PUBLICADO' },
    select: { metaTitulo: true, metaDescricao: true, nome: true, resumo: true, imagemCapa: true },
  })

  if (!ponto) return { title: 'Ponto turístico não encontrado' }

  return {
    title: ponto.metaTitulo || ponto.nome,
    description: ponto.metaDescricao || ponto.resumo || `Conheça ${ponto.nome} em Ilicínea/MG.`,
    openGraph: ponto.imagemCapa ? { images: [ponto.imagemCapa] } : undefined,
    alternates: { canonical: `/turismo/${slug}` },
  }
}

export default async function TurismoDetailPage({ params }: Props) {
  const { slug } = await params

  const ponto = await prisma.pontoTuristico.findFirst({
    where: { slug, status: 'PUBLICADO' },
    include: { galeria: { orderBy: { ordem: 'asc' } } },
  })

  if (!ponto) notFound()

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/turismo/${ponto.slug}`
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(`${ponto.nome} — ${shareUrl}`)}`

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Início</Link>
        <span>/</span>
        <Link href="/turismo" className="hover:text-primary transition-colors">Turismo</Link>
        <span>/</span>
        <span className="text-text truncate">{ponto.nome}</span>
      </nav>

      {/* Hero image */}
      {ponto.imagemCapa && (
        <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden mb-8 bg-surface-soft">
          <img src={ponto.imagemCapa} alt={ponto.imagemCapaAlt || ponto.nome} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="badge-essencial">{CATEGORIA_LABEL[ponto.categoria] || ponto.categoria}</span>
        {ponto.dificuldade && <span className="bg-surface-soft text-text-soft text-xs font-medium px-2 py-0.5 rounded-full border border-border">{DIFICULDADE_MAP[ponto.dificuldade]}</span>}
        {ponto.entradaGratuita && (
          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200 text-xs font-medium">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Entrada gratuita
          </span>
        )}
        {!ponto.entradaGratuita && ponto.precoEntrada && (
          <span className="bg-surface-soft text-text-soft text-xs font-medium px-2 py-0.5 rounded-full border border-border">
            R$ {ponto.precoEntrada.toFixed(2).replace('.', ',')}
          </span>
        )}
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-text mb-2">{ponto.nome}</h1>
      {ponto.subtitulo && <p className="text-lg text-text-soft mb-6">{ponto.subtitulo}</p>}

      {/* Info rápida */}
      <div className="flex flex-wrap gap-4 text-sm text-text-soft mb-8 pb-6 border-b border-border">
        {ponto.distanciaCentro != null && (
          <span className="flex items-center gap-1">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {ponto.distanciaCentro < 1 ? `${(ponto.distanciaCentro * 1000).toFixed(0)}m do centro` : `${ponto.distanciaCentro.toFixed(1)}km do centro`}
          </span>
        )}
        {ponto.tempoDuracao && <span>Duração: {ponto.tempoDuracao}</span>}
        {ponto.melhorEpoca && <span>Melhor época: {ponto.melhorEpoca}</span>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-8">
          {/* Descrição */}
          <section>
            <h2 className="text-xl font-bold text-text mb-3">Sobre o local</h2>
            <div
              className="prose prose-lg max-w-none prose-headings:text-text prose-p:text-text-soft prose-p:leading-relaxed prose-a:text-primary prose-img:rounded-xl prose-img:my-6 prose-strong:text-text prose-blockquote:border-l-primary prose-blockquote:bg-primary-light/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
              dangerouslySetInnerHTML={{ __html: ponto.descricao }}
            />
          </section>

          {/* Galeria */}
          {ponto.galeria.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-text mb-3">Galeria de fotos</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ponto.galeria.map((foto) => (
                  <div key={foto.id} className="aspect-square rounded-lg overflow-hidden bg-surface-soft border border-border">
                    <img src={foto.url} alt={foto.alt || ponto.nome} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Como chegar */}
          {ponto.comoChegar && (
            <section>
              <h2 className="text-xl font-bold text-text mb-3">Como chegar</h2>
              <div
                className="prose prose-lg max-w-none prose-p:text-text-soft prose-a:text-primary"
                dangerouslySetInnerHTML={{ __html: ponto.comoChegar }}
              />
            </section>
          )}

          {/* Dicas */}
          {ponto.dicasImportantes && (
            <section>
              <h2 className="text-xl font-bold text-text mb-3">Dicas importantes</h2>
              <div className="bg-primary-light border-l-4 border-primary rounded-r-lg p-4 prose prose-p:text-text">
                <div dangerouslySetInnerHTML={{ __html: ponto.dicasImportantes }} />
              </div>
            </section>
          )}

          {/* Vídeo */}
          {ponto.videoUrl && (
            <section>
              <h2 className="text-xl font-bold text-text mb-3">Vídeo</h2>
              <div className="aspect-video rounded-xl overflow-hidden bg-surface-soft">
                <iframe src={ponto.videoUrl} className="w-full h-full" allowFullScreen title={`Vídeo de ${ponto.nome}`} />
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-5 space-y-4 sticky top-20">
            <h3 className="font-bold text-text">Informações</h3>

            {ponto.horarioFuncionamento && (
              <div>
                <p className="text-text-muted text-sm">Horário</p>
                <p className="text-text">{ponto.horarioFuncionamento}</p>
              </div>
            )}

            {ponto.telefoneContato && (
              <div>
                <p className="text-text-muted text-sm">Telefone</p>
                <p className="text-text">{ponto.telefoneContato}</p>
              </div>
            )}

            {ponto.endereco && (
              <div>
                <p className="text-text-muted text-sm">Endereço</p>
                <p className="text-text">{ponto.endereco}{ponto.bairro ? `, ${ponto.bairro}` : ''}</p>
              </div>
            )}

            {ponto.acessivelPCD && (
              <div className="inline-flex items-center gap-1 bg-primary-light text-primary text-xs font-medium px-2 py-1 rounded-full">
                Acessível para PCD
              </div>
            )}

            {/* Links */}
            <div className="pt-3 border-t border-border space-y-2">
              {ponto.linkGoogleMaps && (
                <a href={ponto.linkGoogleMaps} target="_blank" rel="noopener noreferrer" className="btn-outline w-full justify-center inline-flex items-center gap-2 py-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  </svg>
                  Ver no Google Maps
                </a>
              )}
              {ponto.linkInstagram && (
                <a href={ponto.linkInstagram} target="_blank" rel="noopener noreferrer" className="text-text-soft hover:text-primary flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>
                  Instagram
                </a>
              )}
              {ponto.linkSite && (
                <a href={ponto.linkSite} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">Site oficial</a>
              )}
            </div>

            {/* Share */}
            <div className="pt-3 border-t border-border flex items-center gap-2">
              <span className="text-xs text-text-muted">Compartilhar:</span>
              <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp text-xs py-1 px-3">WhatsApp</a>
              <button onClick={() => navigator.clipboard.writeText(shareUrl)} className="btn-outline text-xs py-1 px-3">Link</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
