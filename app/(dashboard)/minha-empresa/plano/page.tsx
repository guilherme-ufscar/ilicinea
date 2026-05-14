import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function PlanoPage() {
  const session = await auth()
  if (!session?.user) redirect('/entrar')

  const empresa = await prisma.empresa.findUnique({ where: { userId: session.user.id } })
  if (!empresa) redirect('/minha-empresa')

  const PLANOS = [
    {
      key: 'GRATUITO', nome: 'Presença Básica', preco: 'R$0',
      features: ['Nome da empresa', 'Categoria', 'Endereço', 'Telefone (texto)', 'Visível ao final da listagem'],
      current: empresa.plano === 'GRATUITO',
    },
    {
      key: 'ESSENCIAL', nome: 'Destaque Local', preco: 'R$34,99/mês',
      features: ['Tudo do Gratuito +', 'WhatsApp clicável', 'Logo/foto de perfil', '1 foto de fachada', 'Google Maps', 'Galeria com 5 fotos', 'Topo da listagem'],
      current: empresa.plano === 'ESSENCIAL',
    },
    {
      key: 'PROFISSIONAL', nome: 'Empresa em Foco', preco: 'Sob consulta',
      features: ['Tudo do Essencial +', 'Redes sociais', 'Descrição SEO', 'Palavras-chave', '1 promoção por mês', 'Destaque absoluto', 'Badge "Destaque"'],
      current: empresa.plano === 'PROFISSIONAL',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-2">Plano</h1>
      <p className="text-text-soft text-sm mb-6">Veja os detalhes do plano e faça upgrade.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANOS.map(plano => (
          <div key={plano.key} className={`card p-6 ${plano.current ? 'border-primary ring-2 ring-primary/20' : ''}`}>
            {plano.current && <span className="badge-essencial mb-3">Plano atual</span>}
            <h3 className="text-lg font-bold text-text mb-1">{plano.nome}</h3>
            <p className="text-2xl font-bold text-primary mb-4">{plano.preco}</p>
            <ul className="space-y-2 text-sm text-text-soft mb-4">
              {plano.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                  {f}
                </li>
              ))}
            </ul>
            {!plano.current && (
              plano.key === 'PROFISSIONAL' ? (
                <a href="https://wa.me/5535999999999" target="_blank" rel="noopener noreferrer" className="btn-primary w-full py-2 text-sm text-center inline-block">
                  Falar no WhatsApp
                </a>
              ) : (
                <button className="btn-primary w-full py-2 text-sm">Contratar</button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
