import Link from 'next/link'
import Image from 'next/image'

const footerLinks = [
  {
    title: 'Comércios',
    links: [
      { href: '/comercios', label: 'Ver todos' },
      { href: '/criar-conta', label: 'Cadastrar empresa' },
      { href: '/comercios#planos', label: 'Nossos planos' },
    ],
  },
  {
    title: 'Imóveis',
    links: [
      { href: '/imoveis', label: 'Ver imóveis' },
      { href: '/imoveis?negocio=TEMPORADA', label: 'Temporada' },
      { href: '/imoveis?negocio=VENDA', label: 'À venda' },
      { href: '/imoveis?negocio=ALUGUEL', label: 'Para alugar' },
    ],
  },
  {
    title: 'Notícias',
    links: [
      { href: '/noticias', label: 'Últimas notícias' },
      { href: '/noticias?categoria=Esportes', label: 'Esportes' },
      { href: '/noticias?categoria=Cultura', label: 'Cultura' },
      { href: '/noticias?categoria=Eventos', label: 'Eventos' },
    ],
  },
  {
    title: 'Turismo',
    links: [
      { href: '/turismo', label: 'Pontos turísticos' },
      { href: '/turismo?categoria=NATUREZA', label: 'Natureza' },
      { href: '/turismo?categoria=HISTORICO', label: 'Histórico' },
      { href: '/turismo?categoria=RELIGIOSO', label: 'Religioso' },
    ],
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#111111] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo e descrição */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/ilicinea-logo.svg"
                alt="Ilicínea.com"
                width={130}
                height={34}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-[#888888] text-sm leading-relaxed">
              O portal local de Ilicínea/MG. Tudo sobre a cidade em um só lugar.
            </p>
          </div>

          {/* Colunas de links */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white mb-4">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#888888] hover:text-[#F5820A] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-[#222222] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#888888]">
            © {year} Ilicínea.com — Todos os direitos reservados
          </p>
          <p className="text-xs text-[#888888]">Ilicínea, Minas Gerais</p>
        </div>
      </div>
    </footer>
  )
}
