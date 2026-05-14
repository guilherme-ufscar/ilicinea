import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/')

  const [
    totalEmpresas,
    planosGratuito,
    planosEssencial,
    planosProfissional,
    totalUsuarios,
    newsletterCount,
    totalImoveis,
    imoveisPendentes,
    imoveisAtivos,
    imoveisVendidos,
    empresasRecentes,
    imoveisRecentes,
  ] = await Promise.all([
    prisma.empresa.count(),
    prisma.empresa.count({ where: { plano: 'GRATUITO' } }),
    prisma.empresa.count({ where: { plano: 'ESSENCIAL' } }),
    prisma.empresa.count({ where: { plano: 'PROFISSIONAL' } }),
    prisma.user.count(),
    prisma.newsletter.count({ where: { ativo: true } }),
    prisma.imovel.count(),
    prisma.imovel.count({ where: { status: 'PENDENTE' } }),
    prisma.imovel.count({ where: { status: 'ATIVO' } }),
    prisma.imovel.count({ where: { status: 'VENDIDO' } }),
    prisma.empresa.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { nomeFantasia: true, plano: true, createdAt: true, aprovado: true },
    }),
    prisma.imovel.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { titulo: true, status: true, createdAt: true },
    }),
  ])

  const cards = [
    {
      title: 'Empresas',
      value: totalEmpresas,
      detail: `Gratuito: ${planosGratuito} | Essencial: ${planosEssencial} | Profissional: ${planosProfissional}`,
    },
    {
      title: 'Imóveis',
      value: totalImoveis,
      detail: `Pendentes: ${imoveisPendentes} | Ativos: ${imoveisAtivos} | Vendidos: ${imoveisVendidos}`,
    },
    {
      title: 'Usuários',
      value: totalUsuarios,
      detail: 'Total de contas cadastradas',
    },
    {
      title: 'Newsletter',
      value: newsletterCount,
      detail: 'Inscritos ativos',
    },
  ]

  function formatDate(d: Date) {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  }

  const statusBadgeImovel = (s: string) => {
    const map: Record<string, string> = {
      PENDENTE: 'bg-status-warning/10 text-status-warning',
      ATIVO: 'bg-status-success/10 text-status-success',
      VENDIDO: 'bg-status-info/10 text-status-info',
      REJEITADO: 'bg-status-error/10 text-status-error',
      INATIVO: 'bg-text-muted/10 text-text-muted',
    }
    return map[s] || 'bg-border text-text-muted'
  }

  const planoBadge = (p: string) => {
    const map: Record<string, string> = {
      GRATUITO: 'badge-gratuito',
      ESSENCIAL: 'badge-essencial',
      PROFISSIONAL: 'badge-profissional',
    }
    return map[p] || 'bg-border text-text-muted text-xs font-medium px-2 py-0.5 rounded-full'
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.title} className="card p-5">
            <p className="text-sm text-text-muted mb-1">{card.title}</p>
            <p className="text-3xl font-bold text-text mb-1">{card.value}</p>
            <p className="text-xs text-text-muted">{card.detail}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Empresas */}
        <div className="card p-5">
          <h2 className="text-lg font-semibold text-text mb-3">Empresas Recentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 font-medium text-text-muted">Nome</th>
                  <th className="pb-2 font-medium text-text-muted">Plano</th>
                  <th className="pb-2 font-medium text-text-muted">Status</th>
                  <th className="pb-2 font-medium text-text-muted">Data</th>
                </tr>
              </thead>
              <tbody>
                {empresasRecentes.map((e) => (
                  <tr key={e.nomeFantasia + e.createdAt.toISOString()} className="border-b border-border/50">
                    <td className="py-2 text-text">{e.nomeFantasia}</td>
                    <td className="py-2">
                      <span className={planoBadge(e.plano)}>
                        {e.plano === 'GRATUITO' ? 'Gratuito' : e.plano === 'ESSENCIAL' ? 'Essencial' : 'Profissional'}
                      </span>
                    </td>
                    <td className="py-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${e.aprovado ? 'bg-status-success/10 text-status-success' : 'bg-status-warning/10 text-status-warning'}`}>
                        {e.aprovado ? 'Aprovado' : 'Pendente'}
                      </span>
                    </td>
                    <td className="py-2 text-text-muted">{formatDate(e.createdAt)}</td>
                  </tr>
                ))}
                {empresasRecentes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-text-muted">Nenhuma empresa cadastrada</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Imoveis */}
        <div className="card p-5">
          <h2 className="text-lg font-semibold text-text mb-3">Imóveis Recentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 font-medium text-text-muted">Título</th>
                  <th className="pb-2 font-medium text-text-muted">Status</th>
                  <th className="pb-2 font-medium text-text-muted">Data</th>
                </tr>
              </thead>
              <tbody>
                {imoveisRecentes.map((i) => (
                  <tr key={i.titulo + i.createdAt.toISOString()} className="border-b border-border/50">
                    <td className="py-2 text-text">{i.titulo}</td>
                    <td className="py-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadgeImovel(i.status)}`}>
                        {i.status === 'PENDENTE' ? 'Pendente' : i.status === 'ATIVO' ? 'Ativo' : i.status === 'VENDIDO' ? 'Vendido' : i.status}
                      </span>
                    </td>
                    <td className="py-2 text-text-muted">{formatDate(i.createdAt)}</td>
                  </tr>
                ))}
                {imoveisRecentes.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-text-muted">Nenhum imóvel cadastrado</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
