import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'

const navItems = [
  { href: '/minha-empresa', label: 'Visão geral', icon: '📊' },
  { href: '/minha-empresa/editar', label: 'Editar empresa', icon: '✏️' },
  { href: '/minha-empresa/fotos', label: 'Galeria de fotos', icon: '🖼️' },
  { href: '/minha-empresa/plano', label: 'Plano', icon: '💎' },
  { href: '/minha-empresa/promocao', label: 'Promoção do mês', icon: '🎯' },
]

export default async function EmpresarioLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) { redirect('/entrar') }
  if (session.user.role !== 'COMERCIANTE' && session.user.role !== 'ADMIN') { redirect('/') }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="card p-4 space-y-1 sticky top-20">
            <div className="px-3 py-2 mb-2 border-b border-border">
              <p className="text-text font-semibold text-sm">Minha Empresa</p>
              <p className="text-text-muted text-xs">{session.user.name}</p>
            </div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-soft hover:bg-primary-light hover:text-primary transition-colors text-sm font-medium"
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-border">
              <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-muted hover:text-text transition-colors text-sm">
                ← Voltar ao site
              </Link>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="lg:col-span-3">{children}</main>
      </div>
    </div>
  )
}
