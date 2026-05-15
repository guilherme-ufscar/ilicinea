import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Icon from '@/components/Icon'

export default async function MinhaEmpresaPage() {
  const session = await auth()
  if (!session?.user) redirect('/entrar')

  const empresa = await prisma.empresa.findUnique({
    where: { userId: session.user.id },
    include: {
      galeria: { orderBy: { ordem: 'asc' }, take: 5 },
      promocoes: { where: { ativo: true }, take: 1 },
    },
  })

  if (!empresa) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-text-soft mb-4">Você ainda não cadastrou sua empresa.</p>
        <Link href="/criar-conta/empresario" className="btn-primary">Cadastrar empresa</Link>
      </div>
    )
  }

  const PLANO_LABEL: Record<string, string> = {
    GRATUITO: 'Gratuito', ESSENCIAL: 'Essencial', PROFISSIONAL: 'Profissional',
  }

  const PLANO_BADGE: Record<string, string> = {
    GRATUITO: 'badge-gratuito', ESSENCIAL: 'badge-essencial', PROFISSIONAL: 'badge-profissional',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-6">Minha Empresa</h1>

      {/* Status card */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-text">{empresa.nomeFantasia}</h2>
              <span className={PLANO_BADGE[empresa.plano]}>{PLANO_LABEL[empresa.plano]}</span>
            </div>
            <p className="text-text-soft text-sm">{empresa.categoria} · {empresa.segmentacao}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/minha-empresa/editar" className="btn-outline text-sm py-2 px-4">Editar</Link>
            <Link href={`/comercios/${empresa.slug}`} target="_blank" className="btn-primary text-sm py-2 px-4">Ver perfil público</Link>
          </div>
        </div>

        {/* Status */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          <div>
            <p className="text-text-muted text-xs">Status</p>
            <p className={`text-sm font-medium ${empresa.aprovado ? 'text-status-success' : 'text-status-warning'}`}>
              {empresa.aprovado ? 'Aprovado' : 'Aguardando aprovação'}
            </p>
          </div>
          <div>
            <p className="text-text-muted text-xs">Plano</p>
            <p className="text-sm font-medium text-text">{PLANO_LABEL[empresa.plano]}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs">Destaque</p>
            <p className="text-sm font-medium text-text">{empresa.destaqueHome ? 'Sim' : 'Não'}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs">Galeria</p>
            <p className="text-sm font-medium text-text">{empresa.galeria.length} fotos</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/minha-empresa/editar" className="card p-5 hover:border-primary transition-colors">
          <Icon name="edit" className="w-7 h-7 text-primary" />
          <h3 className="font-semibold text-text mt-2">Editar dados</h3>
          <p className="text-text-soft text-sm">Atualize endereço, telefone, descrição e mais.</p>
        </Link>
        <Link href="/minha-empresa/fotos" className="card p-5 hover:border-primary transition-colors">
          <Icon name="images" className="w-7 h-7 text-primary" />
          <h3 className="font-semibold text-text mt-2">Gerenciar fotos</h3>
          <p className="text-text-soft text-sm">Adicione ou remova fotos da galeria.</p>
        </Link>
        <Link href="/minha-empresa/plano" className="card p-5 hover:border-primary transition-colors">
          <Icon name="gem" className="w-7 h-7 text-primary" />
          <h3 className="font-semibold text-text mt-2">Ver plano</h3>
          <p className="text-text-soft text-sm">Consulte detalhes e faça upgrade.</p>
        </Link>
      </div>

      {/* Promoção ativa */}
      {empresa.promocoes.length > 0 && (
        <div className="mt-6 card p-5 border-l-4 border-l-primary">
          <h3 className="font-bold text-text mb-1">Promoção do mês ativa</h3>
          <p className="text-text-soft text-sm">{empresa.promocoes[0].titulo}</p>
        </div>
      )}
    </div>
  )
}
