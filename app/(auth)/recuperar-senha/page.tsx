import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Recuperar senha' }

export default function RecuperarSenhaPage() {
  return (
    <div className="w-full max-w-md">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-[#111111] mb-1">Recuperar senha</h1>
        <p className="text-[#444444] text-sm mb-6">
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </p>

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#111111] mb-1">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-lg border border-[#E5E5E5] text-[#111111] placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#F5820A] focus:border-transparent"
            />
          </div>

          <button type="submit" className="btn-primary w-full py-3">
            Enviar link de recuperação
          </button>
        </form>

        <p className="text-center text-sm text-[#888888] mt-6">
          <Link href="/entrar" className="text-[#F5820A] hover:underline">
            ← Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  )
}
