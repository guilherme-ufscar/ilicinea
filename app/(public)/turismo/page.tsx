import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Turismo',
  description: 'Descubra os pontos turísticos de Ilicínea/MG.',
}

export default function TurismoPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-[#111111] mb-2">Turismo</h1>
      <p className="text-[#444444] mb-8">Descubra os pontos turísticos de Ilicínea/MG.</p>
      <p className="text-[#888888]">Em breve — Fase 4</p>
    </div>
  )
}
