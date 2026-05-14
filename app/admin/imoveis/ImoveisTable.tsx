'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ImovelAdmin {
  id: string
  codigo: string
  titulo: string
  tipo: string
  negocio: string
  status: string
  destaque: boolean
  createdAt: Date
  user: { name: string | null; email: string }
}

const STATUS_BADGE: Record<string, string> = {
  PENDENTE: 'bg-status-warning/10 text-status-warning',
  ATIVO: 'bg-status-success/10 text-status-success',
  VENDIDO: 'bg-status-info/10 text-status-info',
  ALUGADO: 'bg-status-info/10 text-status-info',
  INATIVO: 'bg-text-muted/10 text-text-muted',
  REJEITADO: 'bg-status-error/10 text-status-error',
}

const STATUS_LABEL: Record<string, string> = {
  PENDENTE: 'Pendente',
  ATIVO: 'Ativo',
  VENDIDO: 'Vendido',
  ALUGADO: 'Alugado',
  INATIVO: 'Inativo',
  REJEITADO: 'Rejeitado',
}

function formatTipo(tipo: string) {
  return tipo.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatNegocio(negocio: string) {
  return negocio.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function ImoveisTable({ imoveis }: { imoveis: ImovelAdmin[] }) {
  const router = useRouter()
  const [updating, setUpdating] = useState<string | null>(null)
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [reason, setReason] = useState('')

  async function changeStatus(id: string, status: string) {
    setUpdating(id)
    try {
      await fetch(`/api/imoveis/admin/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      router.refresh()
    } catch (err) {
      console.error('Erro ao atualizar:', err)
    } finally {
      setUpdating(null)
    }
  }

  async function toggleDestaque(id: string, current: boolean) {
    setUpdating(id)
    try {
      await fetch(`/api/imoveis/admin/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destaque: !current }),
      })
      router.refresh()
    } catch (err) {
      console.error('Erro ao atualizar:', err)
    } finally {
      setUpdating(null)
    }
  }

  async function handleReject(id: string) {
    if (!reason.trim()) return
    setUpdating(id)
    try {
      await fetch(`/api/imoveis/admin/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJEITADO', motivo: reason }),
      })
      setRejectId(null)
      setReason('')
      router.refresh()
    } catch (err) {
      console.error('Erro ao rejeitar:', err)
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
              <th className="text-left py-3 px-4 font-medium text-text-muted">Código</th>
              <th className="text-left py-3 px-4 font-medium text-text-muted">Título</th>
              <th className="text-left py-3 px-4 font-medium text-text-muted">Tipo</th>
              <th className="text-left py-3 px-4 font-medium text-text-muted">Anunciante</th>
              <th className="text-left py-3 px-4 font-medium text-text-muted">Status</th>
              <th className="text-right py-3 px-4 font-medium text-text-muted">Ações</th>
            </tr>
          </thead>
          <tbody>
            {imoveis.map((i) => (
              <tr key={i.id} className="border-b border-border/50 hover:bg-surface-soft/50 transition-colors">
                <td className="py-3 px-4">
                  <span className="text-xs font-mono bg-surface-soft px-2 py-0.5 rounded text-text-soft">{i.codigo}</span>
                </td>
                <td className="py-3 px-4">
                  <p className="text-text font-medium line-clamp-1">{i.titulo}</p>
                  <p className="text-text-muted text-xs">{formatTipo(i.tipo)} · {formatNegocio(i.negocio)}</p>
                </td>
                <td className="py-3 px-4 text-text-soft text-xs">{formatTipo(i.tipo)}</td>
                <td className="py-3 px-4">
                  <p className="text-text-soft text-xs">{i.user.name || '—'}</p>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={i.status}
                    disabled={updating === i.id}
                    onChange={(e) => {
                      if (e.target.value === 'REJEITADO') {
                        setRejectId(i.id)
                      } else {
                        changeStatus(i.id, e.target.value)
                      }
                    }}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_BADGE[i.status]}`}
                  >
                    {Object.entries(STATUS_LABEL).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => toggleDestaque(i.id, i.destaque)}
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        i.destaque ? 'bg-primary-light text-primary' : 'bg-border/30 text-text-muted'
                      }`}
                    >
                      {i.destaque ? 'Destaque' : 'Normal'}
                    </button>
                    {updating === i.id && <span className="text-xs text-text-muted">...</span>}
                  </div>
                </td>
              </tr>
            ))}
            {imoveis.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-text-muted">Nenhum imóvel cadastrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de rejeição */}
      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full mx-4">
            <h2 className="text-lg font-bold text-text mb-2">Rejeitar imóvel</h2>
            <p className="text-text-soft text-sm mb-4">Informe o motivo da rejeição (será enviado por e-mail).</p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              rows={3}
              placeholder="Motivo da rejeição..."
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => { setRejectId(null); setReason('') }} className="btn-outline flex-1 py-2 text-sm">Cancelar</button>
              <button onClick={() => handleReject(rejectId)} className="btn-primary flex-1 py-2 text-sm">Rejeitar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
