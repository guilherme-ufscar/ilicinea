'use client'

import Link from 'next/link'
import type { Empresa, GaleriaFoto, Promocao } from '@prisma/client'

type EmpresaComRelacoes = Empresa & {
  galeria: GaleriaFoto[]
  promocoes?: Promocao[]
}

interface Props {
  empresas: EmpresaComRelacoes[]
}

function CardProfissional({ empresa }: { empresa: EmpresaComRelacoes }) {
  const promoAtiva = empresa.promocoes?.find((p) => p.ativo)

  return (
    <Link
      href={`/comercios/${empresa.slug}`}
      className="card border-l-4 border-l-primary hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col sm:flex-row"
    >
      {/* Foto ou logo */}
      <div className="w-full sm:w-48 h-40 sm:h-auto bg-surface-soft flex-shrink-0 flex items-center justify-center overflow-hidden">
        {empresa.fotoPerfil ? (
          <img
            src={empresa.fotoPerfil}
            alt={empresa.nomeFantasia}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-text-muted text-4xl font-bold">
            {empresa.nomeFantasia.charAt(0)}
          </div>
        )}
      </div>

      {/* Conteudo */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-start gap-2 mb-2">
            <span className="badge-profissional">Empresa em Foco</span>
            <span className="badge-essencial">{empresa.categoria}</span>
          </div>
          <h3 className="text-lg font-bold text-text mb-1">{empresa.nomeFantasia}</h3>
          {empresa.descricao && (
            <p className="text-text-soft text-sm line-clamp-2 mb-2">{empresa.descricao}</p>
          )}
          <div className="text-text-muted text-sm flex flex-wrap gap-x-4 gap-y-1">
            {empresa.endereco && <span>{empresa.endereco}{empresa.bairro ? `, ${empresa.bairro}` : ''}</span>}
            {empresa.telefone && <span>{empresa.telefone}</span>}
          </div>

          {/* Promocao ativa */}
          {promoAtiva && (
            <div className="mt-3 bg-accent-light text-accent rounded-lg px-3 py-2 text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-semibold">{promoAtiva.titulo}</span>
            </div>
          )}
        </div>

        {/* Acoes */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {empresa.whatsapp && (
            <span
              onClick={(e) => {
                e.preventDefault()
                const num = empresa.whatsapp!.replace(/\D/g, '')
                window.open(`https://wa.me/55${num}?text=Olá!`, '_blank')
              }}
              className="btn-whatsapp text-sm py-1.5 px-3 inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              WhatsApp
            </span>
          )}
          {empresa.linkInstagram && (
            <a
              href={empresa.linkInstagram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-text-muted hover:text-primary transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </a>
          )}
          {empresa.linkFacebook && (
            <a
              href={empresa.linkFacebook}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-text-muted hover:text-primary transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </Link>
  )
}

function CardEssencial({ empresa }: { empresa: EmpresaComRelacoes }) {
  return (
    <Link
      href={`/comercios/${empresa.slug}`}
      className="card border-l-4 border-l-primary-light hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col sm:flex-row"
    >
      {/* Logo */}
      <div className="w-full sm:w-36 h-28 sm:h-auto bg-surface-soft flex-shrink-0 flex items-center justify-center overflow-hidden">
        {empresa.fotoPerfil ? (
          <img
            src={empresa.fotoPerfil}
            alt={empresa.nomeFantasia}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-text-muted text-3xl font-bold">
            {empresa.nomeFantasia.charAt(0)}
          </div>
        )}
      </div>

      {/* Conteudo */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-essencial">Destaque Local</span>
            <span className="text-text-muted text-xs">{empresa.categoria}</span>
          </div>
          <h3 className="text-base font-bold text-text mb-1">{empresa.nomeFantasia}</h3>
          <div className="text-text-muted text-sm flex flex-wrap gap-x-4 gap-y-1">
            {empresa.endereco && <span>{empresa.endereco}{empresa.bairro ? `, ${empresa.bairro}` : ''}</span>}
            {empresa.telefone && <span>{empresa.telefone}</span>}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {empresa.whatsapp && (
            <span
              onClick={(e) => {
                e.preventDefault()
                const num = empresa.whatsapp!.replace(/\D/g, '')
                window.open(`https://wa.me/55${num}?text=Olá!`, '_blank')
              }}
              className="btn-whatsapp text-sm py-1.5 px-3 inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              WhatsApp
            </span>
          )}
          {empresa.linkGoogleMaps && (
            <a
              href={empresa.linkGoogleMaps}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-text-muted hover:text-primary transition-colors text-sm inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              </svg>
              Ver no Mapa
            </a>
          )}
        </div>
      </div>
    </Link>
  )
}

function CardGratuito({ empresa }: { empresa: EmpresaComRelacoes }) {
  return (
    <Link
      href={`/comercios/${empresa.slug}`}
      className="card hover:shadow-md transition-all duration-200 p-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="badge-gratuito">Presenca Basica</span>
        <span className="text-text-muted text-xs">{empresa.categoria}</span>
      </div>
      <h3 className="text-base font-bold text-text mb-1">{empresa.nomeFantasia}</h3>
      <div className="text-text-muted text-sm space-y-0.5">
        {empresa.endereco && <p>{empresa.endereco}{empresa.bairro ? `, ${empresa.bairro}` : ''}</p>}
        {empresa.telefone && <p className="text-text-soft">{empresa.telefone}</p>}
      </div>
    </Link>
  )
}

export default function CardsComercios({ empresas }: Props) {
  const profissionais = empresas.filter((e) => e.plano === 'PROFISSIONAL')
  const essenciais = empresas.filter((e) => e.plano === 'ESSENCIAL')
  const gratuitos = empresas.filter((e) => e.plano === 'GRATUITO')

  return (
    <div className="space-y-12">
      {/* Profissionais */}
      {profissionais.length > 0 && (
        <section>
          <div className="mb-5">
            <h2 className="section-title">Empresas em Foco</h2>
            <p className="section-subtitle">Comercios com presenca completa.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {profissionais.map((empresa) => (
              <CardProfissional key={empresa.id} empresa={empresa} />
            ))}
          </div>
        </section>
      )}

      {/* Essenciais */}
      {essenciais.length > 0 && (
        <section>
          <div className="mb-5">
            <h2 className="section-title">Destaque Local</h2>
            <p className="section-subtitle">Comercios com contato direto e localizacao.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {essenciais.map((empresa) => (
              <CardEssencial key={empresa.id} empresa={empresa} />
            ))}
          </div>
        </section>
      )}

      {/* Gratuitos */}
      {gratuitos.length > 0 && (
        <section>
          <div className="mb-5">
            <h2 className="section-title">Presenca Basica</h2>
            <p className="section-subtitle">Comercios da regiao com dados essenciais.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gratuitos.map((empresa) => (
              <CardGratuito key={empresa.id} empresa={empresa} />
            ))}
          </div>
        </section>
      )}

      {empresas.length === 0 && (
        <div className="text-center py-10 text-text-muted">
          <p className="text-lg">Nenhuma empresa encontrada.</p>
        </div>
      )}
    </div>
  )
}
