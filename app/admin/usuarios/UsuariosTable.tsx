'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: Date
}

const ROLE_MAP: Record<string, string> = {
  ADMIN: 'Administrador',
  COMERCIANTE: 'Comerciante',
  ANUNCIANTE_IMOVEL: 'Anunciante',
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-accent-light text-accent',
  COMERCIANTE: 'bg-primary-light text-primary',
  ANUNCIANTE_IMOVEL: 'bg-status-info/10 text-status-info',
}

export default function UsuariosTable({ users }: { users: User[] }) {
  const router = useRouter()
  const [updating, setUpdating] = useState<string | null>(null)

  async function changeRole(userId: string, newRole: string) {
    setUpdating(userId)
    try {
      await fetch(`/api/usuarios/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      router.refresh()
    } catch (err) {
      console.error('Erro ao alterar role:', err)
    } finally {
      setUpdating(null)
    }
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(date))
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-soft">
              <th className="text-left py-3 px-4 font-medium text-text-muted">Nome</th>
              <th className="text-left py-3 px-4 font-medium text-text-muted">E-mail</th>
              <th className="text-left py-3 px-4 font-medium text-text-muted">Tipo</th>
              <th className="text-left py-3 px-4 font-medium text-text-muted">Data</th>
              <th className="text-right py-3 px-4 font-medium text-text-muted">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border/50 hover:bg-surface-soft/50 transition-colors">
                <td className="py-3 px-4 text-text font-medium">{user.name || '—'}</td>
                <td className="py-3 px-4 text-text-soft">{user.email}</td>
                <td className="py-3 px-4">
                  <select
                    value={user.role}
                    disabled={updating === user.id}
                    onChange={(e) => changeRole(user.id, e.target.value)}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${ROLE_COLORS[user.role] || 'bg-border text-text-muted'}`}
                  >
                    <option value="ADMIN">Administrador</option>
                    <option value="COMERCIANTE">Comerciante</option>
                    <option value="ANUNCIANTE_IMOVEL">Anunciante</option>
                  </select>
                </td>
                <td className="py-3 px-4 text-text-muted text-xs">{formatDate(user.createdAt)}</td>
                <td className="py-3 px-4 text-right">
                  {updating === user.id && <span className="text-xs text-text-muted">Salvando...</span>}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-text-muted">Nenhum usuário encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
