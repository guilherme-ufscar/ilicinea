import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

interface Props { params: Promise<{ codigo: string }> }

export const revalidate = 600

function formatPrice(v: number | null): string {
  if (v == null) return 'Sob consulta'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)
}

function formatLabel(s: string): string {
  return s.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { codigo } = await params
  const imovel = await prisma.imovel.findUnique({
    where: { codigo, status: 'ATIVO' },
    select: { titulo: true, descricao: true, fotoCapa: true },
  })
  if (!imovel) return { title: 'Imóvel não encontrado' }
  return {
    title: imovel.titulo,
    description: imovel.descricao?.slice(0, 160),
    openGraph: imovel.fotoCapa ? { images: [imovel.fotoCapa] } : undefined,
    alternates: { canonical: `/imoveis/${codigo}` },
  }
}

export default async function ImovelDetailPage({ params }: Props) {
  const { codigo } = await params

  const imovel = await prisma.imovel.findUnique({
    where: { codigo, status: 'ATIVO' },
    include: {
      fotos: { orderBy: { ordem: 'asc' } },
      user: { select: { name: true } },
    },
  })

  if (!imovel) notFound()

  // Update visualizacoes
  await prisma.imovel.update({ where: { id: imovel.id }, data: { visualizacoes: { increment: 1 } } })

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/imoveis/${imovel.codigo}`
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(`${imovel.titulo} (${imovel.codigo}) — ${shareUrl}`)}`
  const whatsappContactUrl = imovel.whatsappContato
    ? `https://wa.me/55${imovel.whatsappContato.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Tenho interesse no imóvel ${imovel.codigo}`)}`
    : null

  const allFotos = imovel.fotoCapa
    ? [{ url: imovel.fotoCapa, alt: imovel.titulo }, ...imovel.fotos]
    : imovel.fotos

  const boolFeatures: [string, boolean][] = [
    ['Sala', imovel.sala], ['Cozinha', imovel.cozinha], ['Área de serviço', imovel.areaServico],
    ['Varanda', imovel.varanda], ['Quintal', imovel.quintal], ['Piscina', imovel.piscina],
    ['Churrasqueira', imovel.churrasqueira], ['Portão elétrico', imovel.portaoEletrico],
    ['Cerca elétrica', imovel.cercaEletrica], ['Câmera de segurança', imovel.cameraSeguranca],
    ['Alarme', imovel.alarme], ['Aquecedor de água', imovel.aquecedorAgua],
    ['Ar condicionado', imovel.arCondicionado], ['Animais permitidos', imovel.animaisPermitidos],
    ['Água encanada', imovel.aguaEncanada], ['Energia elétrica', imovel.energiaEletrica],
    ['Escritura', imovel.escritura], ['Georreferenciado', imovel.georreferenciado],
    ['Cadastro Rural (ITR)', imovel.cadastroRural], ['Mezanino', imovel.mezanino],
    ['Trifásico', imovel.trifasico],
  ].filter(([, v]) => v)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-text-muted">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/imoveis" className="hover:text-primary">Imóveis</Link>
        <span className="mx-2">/</span>
        <span className="text-text-soft">{imovel.codigo}</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs font-mono bg-surface-soft px-2 py-0.5 rounded text-text-soft">{imovel.codigo}</span>
          <span className="badge-essencial">{formatLabel(imovel.tipo)}</span>
          <span className="bg-surface-soft text-text-soft text-xs font-medium px-2 py-0.5 rounded-full border border-border">{formatLabel(imovel.negocio)}</span>
          {imovel.precoNegociavel && <span className="bg-status-warning/10 text-status-warning text-xs font-medium px-2 py-0.5 rounded-full">Preço a negociar</span>}
        </div>
        <h1 className="text-3xl font-bold text-text mb-1">{imovel.titulo}</h1>
        {imovel.bairro && <p className="text-text-soft">{imovel.bairro}, {imovel.cidade}/{imovel.estado}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Photo gallery */}
          {allFotos.length > 0 && (
            <section>
              <div className="grid grid-cols-1 gap-2">
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-surface-soft">
                  <img src={allFotos[0].url} alt={allFotos[0].alt || imovel.titulo} className="w-full h-full object-cover" />
                </div>
                {allFotos.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {allFotos.slice(1, 5).map((f, i) => (
                      <div key={i} className="aspect-square rounded-lg overflow-hidden bg-surface-soft border border-border">
                        <img src={f.url} alt={f.alt || `${imovel.titulo} ${i + 2}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
                {allFotos.length > 5 && <p className="text-sm text-text-muted text-center">+ {allFotos.length - 5} fotos</p>}
              </div>
            </section>
          )}

          {/* Description */}
          {imovel.descricao && (
            <section>
              <h2 className="text-xl font-bold text-text mb-3">Descrição</h2>
              <div
                className="prose prose-lg max-w-none prose-p:text-text-soft prose-p:leading-relaxed prose-a:text-primary prose-strong:text-text"
                dangerouslySetInnerHTML={{ __html: imovel.descricao }}
              />
            </section>
          )}

          {/* Characteristics */}
          <section>
            <h2 className="text-xl font-bold text-text mb-4">Características</h2>

            {/* Main specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {imovel.areaTotal && <SpecCard label="Área total" value={`${imovel.areaTotal}m²`} />}
              {imovel.areaConstruida && <SpecCard label="Área construída" value={`${imovel.areaConstruida}m²`} />}
              {imovel.areaTerreno && <SpecCard label="Área terreno" value={`${imovel.areaTerreno}m²`} />}
              {imovel.quartos != null && <SpecCard label="Quartos" value={String(imovel.quartos)} />}
              {imovel.suites != null && <SpecCard label="Suítes" value={String(imovel.suites)} />}
              {imovel.banheiros != null && <SpecCard label="Banheiros" value={String(imovel.banheiros)} />}
              {imovel.vagas != null && <SpecCard label="Vagas" value={String(imovel.vagas)} />}
              {imovel.andares != null && <SpecCard label="Andares" value={String(imovel.andares)} />}
              {imovel.wc != null && <SpecCard label="WC" value={String(imovel.wc)} />}
              {imovel.peDireito != null && <SpecCard label="Pé-direito" value={`${imovel.peDireito}m`} />}
              {imovel.hectares != null && <SpecCard label="Hectares" value={`${imovel.hectares}`} />}
            </div>

            {/* Bool features */}
            {boolFeatures.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {boolFeatures.map(([label]) => (
                  <span key={label} className="bg-surface-soft text-text-soft text-sm px-3 py-1.5 rounded-lg border border-border flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {label}
                  </span>
                ))}
              </div>
            )}

            {/* Rural specifics */}
            {imovel.tipoSolo && <p className="text-text-soft text-sm mt-3"><strong className="text-text">Solo:</strong> {imovel.tipoSolo}</p>}
            {imovel.usoAgricola && <p className="text-text-soft text-sm"><strong className="text-text">Uso agrícola:</strong> {imovel.usoAgricola}</p>}
            {imovel.benfeitorias && <p className="text-text-soft text-sm"><strong className="text-text">Benfeitorias:</strong> {imovel.benfeitorias}</p>}

            {/* Mobilia */}
            {imovel.mobiliado !== 'NAO_MOBILIADO' && (
              <p className="text-text-soft text-sm mt-3">
                <strong className="text-text">Mobília:</strong> {imovel.mobiliado === 'MOBILIADO' ? 'Mobiliado' : 'Semi-mobiliado'}
              </p>
            )}
            {imovel.posicaoSol && <p className="text-text-soft text-sm"><strong className="text-text">Posição solar:</strong> {imovel.posicaoSol}</p>}
          </section>

          {/* Map */}
          {(imovel.latitude && imovel.longitude) || imovel.linkGoogleMaps ? (
            <section>
              <h2 className="text-xl font-bold text-text mb-3">Localização</h2>
              <div className="aspect-video rounded-xl overflow-hidden bg-surface-soft">
                {imovel.latitude && imovel.longitude ? (
                  <iframe
                    src={`https://www.google.com/maps?q=${imovel.latitude},${imovel.longitude}&z=15&output=embed`}
                    className="w-full h-full" loading="lazy" title={`Mapa de ${imovel.titulo}`}
                  />
                ) : imovel.linkGoogleMaps ? (
                  <div className="flex items-center justify-center h-full">
                    <a href={imovel.linkGoogleMaps} target="_blank" rel="noopener noreferrer" className="btn-outline">Ver no Google Maps</a>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          {/* Video / Tour */}
          {(imovel.videoUrl || imovel.tourVirtualUrl) && (
            <section>
              <h2 className="text-xl font-bold text-text mb-3">{imovel.videoUrl ? 'Vídeo' : 'Tour virtual'}</h2>
              {imovel.videoUrl && (
                <div className="aspect-video rounded-xl overflow-hidden bg-surface-soft">
                  <iframe src={imovel.videoUrl} className="w-full h-full" allowFullScreen title="Vídeo do imóvel" />
                </div>
              )}
              {imovel.tourVirtualUrl && (
                <a href={imovel.tourVirtualUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2 mt-2">
                  Ver tour virtual
                </a>
              )}
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price card */}
          <div className="card p-6 space-y-4 sticky top-20">
            <div>
              {imovel.precoNegociavel ? (
                <p className="text-3xl font-bold text-primary">Preço a negociar</p>
              ) : imovel.preco != null ? (
                <p className="text-3xl font-bold text-primary">{formatPrice(imovel.preco)}</p>
              ) : (
                <p className="text-3xl font-bold text-primary">Sob consulta</p>
              )}
              {imovel.negocio === 'ALUGUEL' && imovel.condominio && (
                <p className="text-text-soft text-sm mt-1">Condomínio: {formatPrice(imovel.condominio)}</p>
              )}
              {imovel.negocio === 'ALUGUEL' && imovel.iptu && (
                <p className="text-text-soft text-sm">IPTU anual: {formatPrice(imovel.iptu)}</p>
              )}
              {imovel.negocio === 'ALUGUEL' && imovel.caucao && (
                <p className="text-text-soft text-sm">Caução: {imovel.caucao} {imovel.caucao === 1 ? 'mês' : 'meses'}</p>
              )}
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <h3 className="font-bold text-text">Contato</h3>
              <p className="text-text-soft text-sm">{imovel.nomeAnunciante}</p>
              {imovel.creci && <p className="text-xs text-text-muted">CRECI: {imovel.creci}</p>}

              {whatsappContactUrl && (
                <a href={whatsappContactUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full justify-center inline-flex items-center gap-2 py-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
                  Chamar no WhatsApp
                </a>
              )}

              {imovel.telefoneContato && (
                <a href={`tel:${imovel.telefoneContato.replace(/\D/g, '')}`} className="btn-outline w-full justify-center py-3">
                  {imovel.telefoneContato}
                </a>
              )}

              {imovel.emailContato && (
                <a href={`mailto:${imovel.emailContato}`} className="text-primary text-sm block text-center hover:underline">
                  Enviar e-mail
                </a>
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

function SpecCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-3 text-center">
      <p className="text-text-muted text-xs">{label}</p>
      <p className="text-text font-bold text-lg">{value}</p>
    </div>
  )
}
