'use client'

import { useSearchParams } from 'next/navigation'

export default function SuccessMessage() {
  const searchParams = useSearchParams()
  const sucesso = searchParams.get('sucesso')

  if (!sucesso) return null

  return (
    <div className="bg-green-50 text-status-success text-sm px-4 py-3 rounded-lg mb-6">
      Pagamento confirmado! Seu plano foi atualizado com sucesso.
    </div>
  )
}
