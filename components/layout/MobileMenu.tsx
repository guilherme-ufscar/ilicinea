'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'
import { signOut } from 'next-auth/react'

interface NavLink {
  href: string
  label: string
}

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  navLinks: NavLink[]
  isLoggedIn: boolean
}

export default function MobileMenu({ open, onClose, navLinks, isLoggedIn }: MobileMenuProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl flex flex-col">
        {/* Cabeçalho do drawer */}
        <div className="flex items-center justify-between p-4 border-b border-[#E5E5E5]">
          <Image
            src="/ilicinea-logo.svg"
            alt="Ilicínea.com"
            width={120}
            height={32}
            className="h-8 w-auto"
          />
          <button
            onClick={onClose}
            aria-label="Fechar menu"
            className="p-2 rounded-lg text-[#888888] hover:text-[#111111] hover:bg-[#F8F8F8] transition-colors"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Links de navegação */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center px-3 py-3 rounded-lg text-[#111111] font-medium hover:bg-[#FEF0DC] hover:text-[#F5820A] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Ações */}
        <div className="p-4 border-t border-[#E5E5E5] flex flex-col gap-3">
          {isLoggedIn ? (
            <>
              <Link href="/minha-empresa" onClick={onClose} className="btn-primary text-center text-sm">
                Meu painel
              </Link>
              <button
                onClick={() => { onClose(); signOut({ callbackUrl: '/' }) }}
                className="btn-outline text-center text-sm"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/entrar" onClick={onClose} className="btn-outline text-center text-sm">
                Entrar
              </Link>
              <Link href="/criar-conta" onClick={onClose} className="btn-primary text-center text-sm">
                Cadastrar empresa
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
