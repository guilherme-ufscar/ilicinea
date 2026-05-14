import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import NewsletterSignup from '@/components/NewsletterSignup'

interface Props {
  params: { slug: string }
}

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const empresa = await prisma.empresa.findUnique({
    where: { slug: params.slug },
    select: { nomeFantasia: true, categoria: true, descricao: true },
  })

  if (!empresa) {
    return { title: 'Comercio nao encontrado' }
  }

  return {
    title: empresa.nomeFantasia,
    description: empresa.descricao || `Confira ${empresa.nomeFantasia} no Guia Comercial de Ilicinea. ${empresa.categoria}.`,
  }
}

export default async function ComercioPerfilPage({ params }: Props) {
  const empresa = await prisma.empresa.findFirst({
    where: { slug: params.slug, aprovado: true, ativo: true },
    include: {
      galeria: { orderBy: { ordem: 'asc' } },
      promocoes: { where: { ativo: true } },
    },
  })

  if (!empresa) {
    notFound()
  }

  const isEssencialPlus = empresa.plano === 'ESSENCIAL' || empresa.plano === 'PROFISSIONAL'
  const isProfissional = empresa.plano === 'PROFISSIONAL'
  const whatsappNum = empresa.whatsapp?.replace(/\D/g, '') || ''
  const telefonoNum = empresa.celular?.replace(/\D/g, '') || empresa.telefone?.replace(/\D/g, '') || ''

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-text-muted">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/comercios" className="hover:text-primary transition-colors">Guia Comercial</Link>
        <span className="mx-2">/</span>
        <span className="text-text-soft">{empresa.nomeFantasia}</span>
      </nav>

      {/* Cabecalho */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {isProfissional && <span className="badge-profissional">Empresa em Foco</span>}
              {empresa.plano === 'ESSENCIAL' && <span className="badge-essencial">Destaque Local</span>}
              {empresa.plano === 'GRATUITO' && <span className="badge-gratuito">Presenca Basica</span>}
              <span className="bg-primary-light text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                {empresa.categoria}
              </span>
              <span className="text-text-muted text-xs">{empresa.segmentacao}</span>
            </div>
            <h1 className="text-3xl font-bold text-text mb-1">{empresa.nomeFantasia}</h1>
            {empresa.razaoSocial && (
              <p className="text-text-muted text-sm">{empresa.razaoSocial}</p>
            )}
          </div>

          {/* Foto perfil - apenas ESSENCIAL+ */}
          {isEssencialPlus && empresa.fotoPerfil && (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-surface-soft flex-shrink-0 border border-border">
              <img
                src={empresa.fotoPerfil}
                alt={empresa.nomeFantasia}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-8">
          {/* Descricao - apenas PROFISSIONAL */}
          {isProfissional && empresa.descricao && (
            <section>
              <h2 className="text-xl font-bold text-text mb-3">Sobre a Empresa</h2>
              <p className="text-text-soft whitespace-pre-line">{empresa.descricao}</p>
            </section>
          )}

          {/* Informacoes basicas - todos os planos */}
          <section>
            <h2 className="text-xl font-bold text-text mb-3">Informacoes</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {empresa.categoria && (
                <InfoItem label="Categoria" value={empresa.categoria} />
              )}
              {empresa.segmentacao && (
                <InfoItem label="Segmentacao" value={empresa.segmentacao} />
              )}
              {empresa.endereco && (
                <InfoItem label="Endereco" value={`${empresa.endereco}${empresa.bairro ? `, ${empresa.bairro}` : ''} - ${empresa.cidade}/${empresa.estado}${empresa.cep ? `, CEP ${empresa.cep}` : ''}`} />
              )}
              {empresa.telefone && (
                <InfoItem label="Telefone" value={empresa.telefone} />
              )}
              {empresa.celular && (
                <InfoItem label="Celular" value={empresa.celular} />
              )}
              {empresa.email && (
                <InfoItem label="E-mail" value={empresa.email} />
              )}
              {empresa.linkSite && (
                <div>
                  <dt className="text-text-muted text-sm">Site</dt>
                  <dd>
                    <a
                      href={empresa.linkSite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-hover transition-colors"
                    >
                      {empresa.linkSite}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* Galeria - apenas ESSENCIAL+ */}
          {isEssencialPlus && empresa.galeria.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-text mb-3">Galeria</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {empresa.galeria.map((foto) => (
                  <div
                    key={foto.id}
                    className="aspect-square rounded-lg overflow-hidden bg-surface-soft border border-border"
                  >
                    <img
                      src={foto.url}
                      alt={foto.alt || empresa.nomeFantasia}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Foto fachada - apenas ESSENCIAL+ */}
          {isEssencialPlus && empresa.fotoFachada && (
            <section>
              <h2 className="text-xl font-bold text-text mb-3">Fachada</h2>
              <div className="rounded-xl overflow-hidden bg-surface-soft border border-border max-w-lg">
                <img
                  src={empresa.fotoFachada}
                  alt={`Fachada ${empresa.nomeFantasia}`}
                  className="w-full h-auto object-cover"
                />
              </div>
            </section>
          )}

          {/* Promocao do mes - apenas PROFISSIONAL */}
          {isProfissional && empresa.promocoes.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-text mb-3">Promocao do Mes</h2>
              <div className="space-y-4">
                {empresa.promocoes.map((promo) => (
                  <div
                    key={promo.id}
                    className="card border-l-4 border-l-primary p-4"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {promo.imagemUrl && (
                        <div className="w-full sm:w-40 h-32 rounded-lg overflow-hidden bg-surface-soft flex-shrink-0">
                          <img
                            src={promo.imagemUrl}
                            alt={promo.titulo}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-text mb-1">{promo.titulo}</h3>
                        <p className="text-text-soft whitespace-pre-line">{promo.descricao}</p>
                        {promo.validadeAte && (
                          <p className="text-text-muted text-sm mt-2">
                            Valido ate{' '}
                            {new Date(promo.validadeAte).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Botoes de acao */}
          <div className="card p-5 space-y-3 sticky top-20">
            <h3 className="font-bold text-text">Contato</h3>

            {/* WhatsApp - apenas ESSENCIAL+ */}
            {isEssencialPlus && empresa.whatsapp && (
              <a
                href={`https://wa.me/55${whatsappNum}?text=Ol%C3%A1!`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full justify-center inline-flex items-center gap-2 py-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
                Chamar no WhatsApp
              </a>
            )}

            {/* Google Maps - apenas ESSENCIAL+ */}
            {isEssencialPlus && empresa.linkGoogleMaps && (
              <a
                href={empresa.linkGoogleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full justify-center inline-flex items-center gap-2 py-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                </svg>
                Ver no Google Maps
              </a>
            )}

            {/* Telefone - como texto (todos os planos) */}

            {/* Redes sociais - apenas PROFISSIONAL */}
            {isProfissional && (empresa.linkInstagram || empresa.linkFacebook) && (
              <div className="pt-3 border-t border-border">
                <p className="text-text-muted text-sm mb-2">Redes Sociais</p>
                <div className="flex items-center gap-3">
                  {empresa.linkInstagram && (
                    <a
                      href={empresa.linkInstagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-primary transition-colors"
                      title="Instagram"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                      </svg>
                    </a>
                  )}
                  {empresa.linkFacebook && (
                    <a
                      href={empresa.linkFacebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-primary transition-colors"
                      title="Facebook"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Newsletter */}
          <NewsletterSignup />
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-text-muted text-sm">{label}</dt>
      <dd className="text-text">{value}</dd>
    </div>
  )
}
