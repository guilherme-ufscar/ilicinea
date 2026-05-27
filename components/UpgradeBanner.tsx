'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function UpgradeBanner() {
  const pathname = usePathname()

  if (pathname === '/minha-empresa/plano') return null

  return (
    <div className="bg-gradient-to-r from-[#F5820A] to-[#D96E00] rounded-xl p-5 mb-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-bold text-lg">Destaque sua empresa</h3>
          <p className="text-orange-100 text-sm mt-1">
            Com o plano Essencial você ganha WhatsApp clicável, fotos, Google Maps e muito mais.
          </p>
        </div>
        <Link
          href="/minha-empresa/plano"
          className="bg-white text-[#F5820A] font-semibold px-5 py-2.5 rounded-lg hover:bg-orange-50 transition-colors text-sm whitespace-nowrap text-center"
        >
          Ver planos
        </Link>
      </div>
    </div>
  )
}
