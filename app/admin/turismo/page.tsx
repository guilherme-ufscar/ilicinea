import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const CATEGORIA_LABEL: Record<string, string> = {
  NATUREZA: 'Natureza', RELIGIOSO: 'Religioso', HISTORICO: 'Histórico',
  CULTURAL: 'Cultural', ESPORTE_AVENTURA: 'Esporte/Aventura',
  GASTRONOMIA: 'Gastronomia', FESTIVAL_EVENTO: 'Festival/Evento',
}

export default async function AdminTurismo() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/')

  const pontos = await prisma.pontoTuristico.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const STATUS_BADGE: Record<string, string> = {
    RASCUNHO: 'bg-text-muted/10 text-text-muted',
    PUBLICADO: 'bg-status-success/10 text-status-success',
    ARQUIVADO: 'bg-status-warning/10 text-status-warning',
  }

  function formatDate(d: Date | null) {
    if (!d) return '—'
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(d))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Turismo</h1>
        <Link href="/admin/turismo/novo" className="btn-primary py-2 px-4 text-sm">Novo ponto turístico</Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-soft">
                <th className="text-left py-3 px-4 font-medium text-text-muted">Nome</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Categoria</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Status</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Destaque</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Publicado</th>
                <th className="text-right py-3 px-4 font-medium text-text-muted">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pontos.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-surface-soft/50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="text-text font-medium">{p.nome}</p>
                    {p.subtitulo && <p className="text-text-muted text-xs">{p.subtitulo}</p>}
                  </td>
                  <td className="py-3 px-4 text-text-soft text-xs">{CATEGORIA_LABEL[p.categoria] || p.categoria}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[p.status]}`}>
                      {p.status === 'PUBLICADO' ? 'Publicado' : p.status === 'RASCUNHO' ? 'Rascunho' : 'Arquivado'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {p.destaque && <span className="badge-essencial text-xs">Destaque</span>}
                  </td>
                  <td className="py-3 px-4 text-text-muted text-xs">{formatDate(p.publicadoEm)}</td>
                  <td className="py-3 px-4 text-right">
                    <Link href={`/admin/turismo/${p.id}/editar`} className="text-primary hover:text-primary-hover text-xs font-medium">Editar</Link>
                  </td>
                </tr>
              ))}
              {pontos.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-text-muted">Nenhum ponto turístico cadastrado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
