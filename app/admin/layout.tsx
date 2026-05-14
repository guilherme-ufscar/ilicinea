import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import LogoutButton from './LogoutButton'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/usuarios', label: 'Usuários', icon: '👥' },
  { href: '/admin/comercios', label: 'Comércios', icon: '🏪' },
  { href: '/admin/imoveis', label: 'Imóveis', icon: '🏠' },
  { href: '/admin/noticias', label: 'Notícias', icon: '📰' },
  { href: '/admin/turismo', label: 'Turismo', icon: '🏞️' },
  { href: '/admin/newsletter', label: 'Newsletter', icon: '📧' },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/entrar')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex bg-surface-soft">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-primary font-bold text-lg">Ilicínea</span>
            <span className="text-text-muted text-sm">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-soft hover:bg-primary-light hover:text-primary transition-colors text-sm font-medium"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-bold">
              {session.user.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">
                {session.user.name || 'Admin'}
              </p>
              <p className="text-xs text-text-muted">Administrador</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-x-auto">
        {children}
      </main>
    </div>
  )
}
