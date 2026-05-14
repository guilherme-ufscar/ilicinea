import Link from 'next/link'
import type { Imovel, FotoImovel } from '@prisma/client'

interface CardImovelProps {
  imovel: Imovel & { fotos?: FotoImovel[] }
}

function formatPrice(value: number | null): string {
  if (value == null) return 'Sob consulta'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatTipo(tipo: string): string {
  return tipo
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatNegocio(negocio: string): string {
  return negocio
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNFNUU1RTUiLz48cGF0aCBkPSJNMTYwIDEyMEgyNDBWMjQwSDE2MFYxMjBaIiBzdHJva2U9IiM4ODg4ODgiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik0xMzAgMjQwTDIwMCAxNjBMMjcwIDI0MCIgc3Ryb2tlPSIjODg4ODg4IiBzdHJva2Utd2lkdGg9IjIiLz48Y2lyY2xlIGN4PSIxODAiIGN5PSIxNjAiIHI9IjgiIHN0cm9rZT0iIzg4ODg4OCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+'

export default function CardImovel({ imovel }: CardImovelProps) {
  const imageUrl =
    imovel.fotoCapa ||
    (imovel.fotos && imovel.fotos.length > 0 ? imovel.fotos[0].url : null) ||
    PLACEHOLDER_IMAGE

  return (
    <Link
      href={`/imoveis/${imovel.codigo}`}
      className="card overflow-hidden flex flex-col group"
    >
      {/* Imagem */}
      <div className="relative w-full h-48 overflow-hidden bg-surface-soft">
        <img
          src={imageUrl}
          alt={imovel.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {imovel.destaque && (
          <span className="absolute top-2 left-2 bg-accent text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Destaque
          </span>
        )}
        <span className="absolute top-2 right-2 bg-white/90 text-text text-xs font-medium px-2.5 py-0.5 rounded-full backdrop-blur-sm">
          {formatNegocio(imovel.negocio)}
        </span>
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Código + tipo */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-text-muted bg-surface-soft px-2 py-0.5 rounded">
            {imovel.codigo}
          </span>
          <span className="text-xs text-text-muted">{formatTipo(imovel.tipo)}</span>
        </div>

        {/* Título */}
        <h3 className="font-semibold text-text text-base line-clamp-2 leading-tight">
          {imovel.titulo}
        </h3>

        {/* Bairro */}
        {imovel.bairro && (
          <p className="text-sm text-text-soft flex items-center gap-1">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            {imovel.bairro}
          </p>
        )}

        {/* Preço */}
        <p className="text-lg font-bold text-primary mt-1">
          {imovel.precoNegociavel ? 'Preço a negociar' : formatPrice(imovel.preco)}
        </p>

        {/* Ícones de características */}
        <div className="flex items-center gap-3 text-text-muted text-sm mt-auto pt-2 border-t border-border">
          {(imovel.quartos != null && imovel.quartos > 0) && (
            <span className="flex items-center gap-1" title="Quartos">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
              </svg>
              {imovel.quartos}
            </span>
          )}
          {(imovel.banheiros != null && imovel.banheiros > 0) && (
            <span className="flex items-center gap-1" title="Banheiros">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              {imovel.banheiros}
            </span>
          )}
          {(imovel.vagas != null && imovel.vagas > 0) && (
            <span className="flex items-center gap-1" title="Vagas">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              {imovel.vagas}
            </span>
          )}
          {(imovel.quartos == null || imovel.quartos === 0) &&
            (imovel.banheiros == null || imovel.banheiros === 0) &&
            (imovel.vagas == null || imovel.vagas === 0) && (
              <span className="text-xs text-text-muted">Consulte detalhes</span>
            )}
        </div>
      </div>
    </Link>
  )
}
