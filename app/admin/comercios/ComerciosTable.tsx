'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface EmpresaAdmin {
  id: string
  nomeFantasia: string
  slug: string
  plano: string
  planoStatus: string
  aprovado: boolean
  ativo: boolean
  destaqueHome: boolean
  categoria: string
  createdAt: Date
  user: { name: string | null; email: string }
}

const PLANO_BADGE: Record<string, string> = {
  GRATUITO: 'badge-gratuito',
  ESSENCIAL: 'badge-essencial',
  PROFISSIONAL: 'badge-profissional',
}

const PLANO_LABEL: Record<string, string> = {
  GRATUITO: 'Gratuito',
  ESSENCIAL: 'Essencial',
  PROFISSIONAL: 'Profissional',
}

export default function ComerciosTable({ empresas }: { empresas: EmpresaAdmin[] }) {
  const router = useRouter()
  const [updating, setUpdating] = useState<string | null>(null)

  async function toggleField(id: string, field: string, current: boolean) {
    setUpdating(id)
    try {
      await fetch(`/api/comercios/admin/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !current }),
      })
      router.refresh()
    } catch (err) {
      console.error('Erro ao atualizar:', err)
    } finally {
      setUpdating(null)
    }
  }

  async function changePlan(id: string, plano: string) {
    setUpdating(id)
    try {
      await fetch(`/api/comercios/admin/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plano }),
      })
      router.refresh()
    } catch (err) {
      console.error('Erro ao alterar plano:', err)
    } finally {
      setUpdating(null)
    }
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date))
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-soft">
              <th className="text-left py-3 px-4 font-medium text-text-muted">Nome</th>
              <th className="text-left py-3 px-4 font-medium text-text-muted">Proprietário</th>
              <th className="text-left py-3 px-4 font-medium text-text-muted">Plano</th>
              <th className="text-left py-3 px-4 font-medium text-text-muted">Status</th>
              <th className="text-left py-3 px-4 font-medium text-text-muted">Data</th>
              <th className="text-right py-3 px-4 font-medium text-text-muted">Ações</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((e) => (
              <tr key={e.id} className="border-b border-border/50 hover:bg-surface-soft/50 transition-colors">
                <td className="py-3 px-4">
                  <p className="text-text font-medium">{e.nomeFantasia}</p>
                  <p className="text-text-muted text-xs">{e.categoria}</p>
                </td>
                <td className="py-3 px-4">
                  <p className="text-text-soft text-xs">{e.user.name || '—'}</p>
                  <p className="text-text-muted text-xs">{e.user.email}</p>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={e.plano}
                    disabled={updating === e.id}
                    onChange={(ev) => changePlan(e.id, ev.target.value)}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${PLANO_BADGE[e.plano]}`}
                  >
                    <option value="GRATUITO">Gratuito</option>
                    <option value="ESSENCIAL">Essencial</option>
                    <option value="PROFISSIONAL">Profissional</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => toggleField(e.id, 'aprovado', e.aprovado)}
                      className={`text-xs font-medium px-2 py-0.5 rounded-full text-left ${
                        e.aprovado ? 'bg-status-success/10 text-status-success' : 'bg-status-warning/10 text-status-warning'
                      }`}
                    >
                      {e.aprovado ? 'Aprovado' : 'Pendente'}
                    </button>
                    <button
                      onClick={() => toggleField(e.id, 'destaqueHome', e.destaqueHome)}
                      className={`text-xs font-medium px-2 py-0.5 rounded-full text-left ${
                        e.destaqueHome ? 'bg-primary-light text-primary' : 'bg-border/30 text-text-muted'
                      }`}
                    >
                      {e.destaqueHome ? 'Destaque' : 'Normal'}
                    </button>
                  </div>
                </td>
                <td className="py-3 px-4 text-text-muted text-xs">{formatDate(e.createdAt)}</td>
                <td className="py-3 px-4 text-right">
                  {updating === e.id && <span className="text-xs text-text-muted">Salvando...</span>}
                </td>
              </tr>
            ))}
            {empresas.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-text-muted">Nenhum comércio cadastrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
