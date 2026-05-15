import type { Metadata } from 'next'
import Link from 'next/link'
import Icon from '@/components/Icon'

export const metadata: Metadata = { title: 'Criar conta' }

export default function CriarContaPage() {
  return (
    <div className="w-full max-w-md">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-[#111111] mb-1">Criar conta</h1>
        <p className="text-[#444444] text-sm mb-6">
          Escolha como deseja usar o Ilicínea.com
        </p>

        <div className="space-y-3">
          <Link
            href="/criar-conta/empresario"
            className="block border-2 border-[#F5820A] rounded-xl p-5 hover:bg-[#FEF0DC] transition-colors group"
          >
            <div className="flex items-start gap-3">
              <Icon name="store" className="w-7 h-7 text-primary mt-0.5" />
              <div>
                <h2 className="font-bold text-[#111111] group-hover:text-[#F5820A]">Sou empresário</h2>
                <p className="text-sm text-[#444444] mt-1">
                  Cadastre sua empresa no Guia Comercial e ganhe visibilidade na cidade
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/criar-conta/anunciante"
            className="block border-2 border-[#E5E5E5] rounded-xl p-5 hover:border-[#F5820A] hover:bg-[#FEF0DC] transition-colors group"
          >
            <div className="flex items-start gap-3">
              <Icon name="home" className="w-7 h-7 text-primary mt-0.5" />
              <div>
                <h2 className="font-bold text-[#111111] group-hover:text-[#F5820A]">Quero anunciar imóvel</h2>
                <p className="text-sm text-[#444444] mt-1">
                  Anuncie imóveis para venda, aluguel ou temporada em Ilicínea
                </p>
              </div>
            </div>
          </Link>
        </div>

        <p className="text-center text-sm text-[#888888] mt-6">
          Já tem conta?{' '}
          <Link href="/entrar" className="text-[#F5820A] font-medium hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
