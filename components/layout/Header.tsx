'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import MobileMenu from './MobileMenu'

const navLinks = [
  { href: '/comercios', label: 'Comércios' },
  { href: '/imoveis', label: 'Imóveis' },
  { href: '/noticias', label: 'Notícias' },
  { href: '/turismo', label: 'Turismo' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: session, status } = useSession()
  const isLoggedIn = status === 'authenticated'

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E5E5E5] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/ilicinea-logo.svg"
                alt="Ilicínea.com"
                width={140}
                height={36}
                priority
                className="h-9 w-auto"
              />
            </Link>

            {/* Nav desktop */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[#111111] hover:text-[#F5820A] transition-colors duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Ações desktop */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <Link href="/minha-empresa" className="btn-primary text-sm py-1.5 px-4">
                    Meu painel
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="btn-outline text-sm py-1.5 px-4"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link href="/entrar" className="btn-outline text-sm py-1.5 px-4">
                    Entrar
                  </Link>
                  <Link href="/criar-conta" className="btn-primary text-sm py-1.5 px-4">
                    Cadastrar empresa
                  </Link>
                </>
              )}
            </div>

            {/* Botão hambúrguer mobile */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
              className="md:hidden p-2 rounded-lg text-[#F5820A] hover:bg-[#FEF0DC] transition-colors"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} navLinks={navLinks} isLoggedIn={isLoggedIn} />
    </>
  )
}
