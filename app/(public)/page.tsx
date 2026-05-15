import type { Metadata } from 'next'
import Link from 'next/link'
import Icon from '@/components/Icon'

export const metadata: Metadata = {
  title: 'Ilicínea.com — Portal Local de Ilicínea/MG',
  description:
    'Encontre comércios, imóveis, notícias e pontos turísticos da cidade de Ilicínea/MG.',
}

const modules = [
  {
    href: '/comercios',
    icon: 'store',
    title: 'Guia Comercial',
    description: 'Encontre os melhores estabelecimentos da cidade',
  },
  {
    href: '/imoveis',
    icon: 'home',
    title: 'Imóveis',
    description: 'Compre, alugue ou anuncie imóveis em Ilicínea',
  },
  {
    href: '/noticias',
    icon: 'news',
    title: 'Notícias',
    description: 'Fique por dentro de tudo que acontece na cidade',
  },
  {
    href: '/turismo',
    icon: 'map',
    title: 'Turismo',
    description: 'Descubra os encantos de Ilicínea',
  },
]

const categories = [
  { href: '/comercios', icon: 'store', label: 'Comércios' },
  { href: '/imoveis', icon: 'home', label: 'Imóveis' },
  { href: '/noticias', icon: 'news', label: 'Notícias' },
  { href: '/turismo', icon: 'map', label: 'Turismo' },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#F8F8F8] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#111111] mb-4 leading-tight">
            Tudo sobre Ilicínea<br />em um só lugar
          </h1>
          <p className="text-[#444444] text-lg mb-8">
            Encontre comércios, imóveis, notícias e pontos turísticos da cidade de forma rápida e fácil.
          </p>

          {/* Barra de busca */}
          <div className="flex gap-2 max-w-xl mx-auto mb-6">
            <input
              type="text"
              placeholder="Buscar em Ilicínea..."
              className="flex-1 px-4 py-3 rounded-lg border border-[#E5E5E5] bg-white text-[#111111] placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#F5820A] focus:border-transparent"
            />
            <button className="btn-primary px-6 py-3">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>

          {/* Pills de categorias */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#F5820A] text-[#F5820A] bg-white hover:bg-[#FEF0DC] font-medium text-sm transition-colors min-h-[44px]"
              >
                <Icon name={cat.icon as 'store' | 'home' | 'news' | 'map'} className="w-5 h-5" />
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Módulos principais */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-title">O que você encontra aqui</h2>
            <p className="section-subtitle">Tudo o que a cidade tem a oferecer, em um só portal</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((mod) => (
              <Link
                key={mod.href}
                href={mod.href}
                className="card p-6 flex flex-col items-start gap-3 group"
              >
                <Icon name={mod.icon as 'store' | 'home' | 'news' | 'map'} className="w-8 h-8 text-primary" />
                <h3 className="font-bold text-[#111111] text-lg">{mod.title}</h3>
                <p className="text-[#444444] text-sm flex-1">{mod.description}</p>
                <span className="text-[#F5820A] text-sm font-medium group-hover:underline">
                  Ver mais →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-14 px-4 bg-[#F5820A]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Receba as novidades de Ilicínea</h2>
          <p className="text-orange-100 mb-6">Inscreva-se e fique por dentro de tudo que acontece na cidade.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Seu e-mail..."
              className="flex-1 px-4 py-3 rounded-lg border-0 text-[#111111] placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-[#F5820A] font-semibold px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors whitespace-nowrap">
              Inscrever
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
