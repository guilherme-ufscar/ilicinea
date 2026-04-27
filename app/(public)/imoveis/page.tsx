import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Imóveis',
  description: 'Imóveis para venda, aluguel e temporada em Ilicínea/MG.',
}

export default function ImoveisPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-[#111111] mb-2">Imóveis</h1>
      <p className="text-[#444444] mb-8">Imóveis para venda, aluguel e temporada em Ilicínea/MG.</p>
      <p className="text-[#888888]">Em breve — Fase 3</p>
    </div>
  )
}
