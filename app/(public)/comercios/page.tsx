import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guia Comercial',
  description: 'Encontre os melhores comércios e empresas de Ilicínea/MG.',
}

export default function ComerciosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-[#111111] mb-2">Guia Comercial</h1>
      <p className="text-[#444444] mb-8">Encontre os melhores comércios e empresas de Ilicínea/MG.</p>
      <p className="text-[#888888]">Em breve — Fase 2</p>
    </div>
  )
}
