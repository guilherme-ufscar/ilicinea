import type { Metadata } from 'next'
import Link from 'next/link'
import LoginForm from './LoginForm'

export const metadata: Metadata = { title: 'Entrar' }
export const dynamic = 'force-dynamic'

export default function EntrarPage() {
  return (
    <div className="w-full max-w-md">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-[#111111] mb-1">Entrar</h1>
        <p className="text-[#444444] text-sm mb-6">
          Acesse sua conta para gerenciar sua empresa ou imóveis.
        </p>

        <LoginForm />

        <p className="text-center text-sm text-[#888888] mt-6">
          Não tem conta?{' '}
          <Link href="/criar-conta" className="text-[#F5820A] font-medium hover:underline">
            Criar conta
          </Link>
        </p>
        <p className="text-center text-sm text-[#888888] mt-2">
          <Link href="/recuperar-senha" className="text-[#F5820A] hover:underline">
            Esqueci minha senha
          </Link>
        </p>
      </div>
    </div>
  )
}
