'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Inscrito {
  id: string
  email: string
  nome: string | null
  ativo: boolean
  createdAt: Date
  user: { name: string | null } | null
}

export default function NewsletterClient({ inscritos }: { inscritos: Inscrito[] }) {
  const router = useRouter()
  const [removing, setRemoving] = useState<string | null>(null)

  async function removeInscrito(email: string, id: string) {
    setRemoving(id)
    try {
      await fetch('/api/newsletter', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      router.refresh()
    } catch (err) {
      console.error('Erro ao remover:', err)
    } finally {
      setRemoving(null)
    }
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date))
  }

  function exportCSV() {
    const header = 'Nome,E-mail,Data de inscrição\n'
    const rows = inscritos.map((i) => `"${i.nome || i.user?.name || ''}","${i.email}","${formatDate(i.createdAt)}"`).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'newsletter-inscritos.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-text-soft text-sm">{inscritos.length} inscrito{inscritos.length !== 1 ? 's' : ''} ativo{inscritos.length !== 1 ? 's' : ''}</p>
        <button onClick={exportCSV} className="btn-outline py-2 px-4 text-sm">Exportar CSV</button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-soft">
                <th className="text-left py-3 px-4 font-medium text-text-muted">Nome</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">E-mail</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Data</th>
                <th className="text-right py-3 px-4 font-medium text-text-muted">Ações</th>
              </tr>
            </thead>
            <tbody>
              {inscritos.map((i) => (
                <tr key={i.id} className="border-b border-border/50 hover:bg-surface-soft/50 transition-colors">
                  <td className="py-3 px-4 text-text">{i.nome || i.user?.name || '—'}</td>
                  <td className="py-3 px-4 text-text-soft">{i.email}</td>
                  <td className="py-3 px-4 text-text-muted text-xs">{formatDate(i.createdAt)}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => removeInscrito(i.email, i.id)}
                      disabled={removing === i.id}
                      className="text-accent hover:text-accent/80 text-xs font-medium disabled:opacity-50"
                    >
                      {removing === i.id ? 'Removendo...' : 'Remover'}
                    </button>
                  </td>
                </tr>
              ))}
              {inscritos.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-text-muted">Nenhum inscrito na newsletter</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
