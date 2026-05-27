import { prisma } from '@/lib/prisma'

const PRECO_MENSAL: Record<string, number> = {
  GRATUITO: 0,
  ESSENCIAL: 34.99,
  PROFISSIONAL: 99.90,
}

export default async function FinanceiroPage() {
  const empresas = await prisma.empresa.findMany({
    where: { ativo: true },
    select: { plano: true, planoStatus: true, nomeFantasia: true, planoExpiraEm: true },
  })

  const totais = {
    GRATUITO: empresas.filter(e => e.plano === 'GRATUITO').length,
    ESSENCIAL: empresas.filter(e => e.plano === 'ESSENCIAL').length,
    PROFISSIONAL: empresas.filter(e => e.plano === 'PROFISSIONAL').length,
  }

  const receitaMensal =
    totais.ESSENCIAL * PRECO_MENSAL.ESSENCIAL +
    totais.PROFISSIONAL * PRECO_MENSAL.PROFISSIONAL

  const receitaAnual = receitaMensal * 12

  const pagantes = empresas.filter(e => e.plano !== 'GRATUITO')

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-6">Financeiro</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-5">
          <p className="text-text-muted text-xs mb-1">Receita mensal estimada</p>
          <p className="text-2xl font-bold text-primary">
            {receitaMensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-text-muted text-xs mb-1">Receita anual estimada</p>
          <p className="text-2xl font-bold text-text">
            {receitaAnual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-text-muted text-xs mb-1">Assinantes pagos</p>
          <p className="text-2xl font-bold text-text">{pagantes.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-text-muted text-xs mb-1">Total de empresas</p>
          <p className="text-2xl font-bold text-text">{empresas.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Distribuição por plano</h2>
          <div className="space-y-3">
            <PlanRow label="Gratuito" count={totais.GRATUITO} total={empresas.length} color="bg-border" />
            <PlanRow label="Essencial" count={totais.ESSENCIAL} total={empresas.length} color="bg-primary" />
            <PlanRow label="Profissional" count={totais.PROFISSIONAL} total={empresas.length} color="bg-accent" />
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Assinantes ativos</h2>
          {pagantes.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {pagantes.map((e, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-text">{e.nomeFantasia}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    e.plano === 'ESSENCIAL' ? 'badge-essencial' : 'badge-profissional'
                  }`}>
                    {e.plano === 'ESSENCIAL' ? 'Essencial' : 'Profissional'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm">Nenhum assinante pago ainda.</p>
          )}
        </div>
      </div>

      <div className="card p-6 mt-6">
        <h2 className="text-lg font-semibold text-text mb-4">Tabela de preços</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 text-text-muted font-medium">Plano</th>
              <th className="text-right py-2 text-text-muted font-medium">Preço/mês</th>
              <th className="text-right py-2 text-text-muted font-medium">Qtd</th>
              <th className="text-right py-2 text-text-muted font-medium">Subtotal/mês</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-2 text-text">Gratuito</td>
              <td className="py-2 text-right text-text-soft">R$ 0,00</td>
              <td className="py-2 text-right text-text">{totais.GRATUITO}</td>
              <td className="py-2 text-right text-text-soft">R$ 0,00</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 text-text">Essencial</td>
              <td className="py-2 text-right text-text-soft">R$ 34,99</td>
              <td className="py-2 text-right text-text">{totais.ESSENCIAL}</td>
              <td className="py-2 text-right text-text font-medium">
                {(totais.ESSENCIAL * 34.99).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 text-text">Profissional</td>
              <td className="py-2 text-right text-text-soft">R$ 99,90</td>
              <td className="py-2 text-right text-text">{totais.PROFISSIONAL}</td>
              <td className="py-2 text-right text-text font-medium">
                {(totais.PROFISSIONAL * 99.90).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </td>
            </tr>
            <tr>
              <td className="py-3 text-text font-bold" colSpan={3}>Total mensal</td>
              <td className="py-3 text-right text-primary font-bold text-lg">
                {receitaMensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PlanRow({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-text">{label}</span>
        <span className="text-text-muted">{count} ({pct.toFixed(0)}%)</span>
      </div>
      <div className="h-2 bg-surface-soft rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
