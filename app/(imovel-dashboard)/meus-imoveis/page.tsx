import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function MeusImoveisPage() {
  const session = await auth()
  if (!session?.user) redirect('/entrar')

  const imoveis = await prisma.imovel.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { fotos: { take: 1, orderBy: { ordem: 'asc' } } },
  })

  const STATUS_BADGE: Record<string, string> = {
    PENDENTE: 'bg-status-warning/10 text-status-warning',
    ATIVO: 'bg-status-success/10 text-status-success',
    VENDIDO: 'bg-status-info/10 text-status-info',
    ALUGADO: 'bg-status-info/10 text-status-info',
    INATIVO: 'bg-text-muted/10 text-text-muted',
    REJEITADO: 'bg-status-error/10 text-status-error',
  }

  const STATUS_LABEL: Record<string, string> = {
    PENDENTE: 'Pendente', ATIVO: 'Ativo', VENDIDO: 'Vendido',
    ALUGADO: 'Alugado', INATIVO: 'Inativo', REJEITADO: 'Rejeitado',
  }

  function formatPrice(v: number | null): string {
    if (v == null) return 'Sob consulta'
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)
  }

  function formatDate(d: Date) {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(d))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Meus imóveis</h1>
          <p className="text-text-soft text-sm">{imoveis.length} anúncio{imoveis.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/meus-imoveis/novo" className="btn-primary py-2 px-4 text-sm">Novo anúncio</Link>
      </div>

      {imoveis.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-text-soft text-lg mb-4">Você ainda não tem imóveis cadastrados.</p>
          <Link href="/meus-imoveis/novo" className="btn-primary">Anunciar imóvel</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {imoveis.map(imovel => (
            <div key={imovel.id} className="card overflow-hidden flex flex-col sm:flex-row">
              <div className="w-full sm:w-48 h-36 sm:h-auto bg-surface-soft flex-shrink-0">
                {imovel.fotos[0]?.url || imovel.fotoCapa ? (
                  <img src={imovel.fotos[0]?.url || imovel.fotoCapa || ''} alt={imovel.titulo} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">Sem foto</div>
                )}
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono bg-surface-soft px-2 py-0.5 rounded text-text-soft">{imovel.codigo}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[imovel.status]}`}>{STATUS_LABEL[imovel.status]}</span>
                  </div>
                  <h3 className="text-lg font-bold text-text mb-1">{imovel.titulo}</h3>
                  <div className="flex items-center gap-4 text-sm text-text-soft">
                    <span>{formatPrice(imovel.preco)}</span>
                    <span>{imovel.visualizacoes} visualizações</span>
                    <span>{formatDate(imovel.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                  <Link href={`/meus-imoveis/${imovel.id}/editar`} className="btn-outline text-xs py-1.5 px-3">Editar</Link>
                  {imovel.status === 'ATIVO' && (
                    <Link href={`/api/imoveis/${imovel.id}/marcar-vendido`} className="text-xs text-text-muted hover:text-status-success py-1.5 px-3 border border-border rounded-lg">Marcar vendido</Link>
                  )}
                  {imovel.status === 'ATIVO' && (
                    <Link href={`/api/imoveis/${imovel.id}/desativar`} className="text-xs text-text-muted hover:text-accent py-1.5 px-3 border border-border rounded-lg">Desativar</Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
