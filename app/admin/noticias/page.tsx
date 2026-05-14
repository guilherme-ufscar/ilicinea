import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminNoticias() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/')

  const noticias = await prisma.noticia.findMany({
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
        <h1 className="text-2xl font-bold text-text">Notícias</h1>
        <Link href="/admin/noticias/nova" className="btn-primary py-2 px-4 text-sm">
          Nova notícia
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-soft">
                <th className="text-left py-3 px-4 font-medium text-text-muted">Título</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Autor</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Status</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Destaque</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Publicado</th>
                <th className="text-right py-3 px-4 font-medium text-text-muted">Ações</th>
              </tr>
            </thead>
            <tbody>
              {noticias.map((n) => (
                <tr key={n.id} className="border-b border-border/50 hover:bg-surface-soft/50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="text-text font-medium line-clamp-1">{n.titulo}</p>
                    <p className="text-text-muted text-xs">{n.categorias?.join(', ')}</p>
                  </td>
                  <td className="py-3 px-4 text-text-soft text-xs">{n.autorNome}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[n.status]}`}>
                      {n.status === 'PUBLICADO' ? 'Publicado' : n.status === 'RASCUNHO' ? 'Rascunho' : 'Arquivado'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {n.destaque && <span className="badge-essencial text-xs">Destaque</span>}
                  </td>
                  <td className="py-3 px-4 text-text-muted text-xs">{formatDate(n.publicadoEm)}</td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/admin/noticias/${n.id}/editar`}
                      className="text-primary hover:text-primary-hover text-xs font-medium"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
              {noticias.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-text-muted">Nenhuma notícia cadastrada</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
