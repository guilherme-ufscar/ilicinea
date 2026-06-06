import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { UpgradeButton, ManageSubscriptionButton } from '@/components/StripeButtons'
import SuccessMessage from './SuccessMessage'

export default async function PlanoPage() {
  const session = await auth()
  if (!session?.user) redirect('/entrar')

  const empresa = await prisma.empresa.findUnique({ where: { userId: session.user.id } })
  if (!empresa) redirect('/minha-empresa')

  const hasPaidPlan = empresa.plano !== 'GRATUITO'

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

      <SuccessMessage />

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
            {plano.current && hasPaidPlan && (
              <ManageSubscriptionButton />
            )}
            {!plano.current && plano.key === 'ESSENCIAL' && empresa.plano === 'GRATUITO' && (
              <div className="flex flex-col gap-2">
                <UpgradeButton />
                <a
                  href={`https://wa.me/5535984540744?text=${encodeURIComponent(`Olá! Tenho interesse em assinar o plano *Destaque Local (Essencial)* do Guia Comercial de Ilicínea.\n\nMinha empresa: ${empresa.nomeFantasia}\n\nPoderia me dar mais informações?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full py-2 text-sm text-center inline-flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.531 5.845L.057 23.5l5.797-1.452A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.652-.51-5.17-1.399l-.371-.22-3.443.862.916-3.352-.241-.386A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                  Assinar pelo WhatsApp
                </a>
              </div>
            )}
            {!plano.current && plano.key === 'PROFISSIONAL' && (
              <a
                href={`https://wa.me/5535984540744?text=${encodeURIComponent(`Olá! Tenho interesse em assinar o plano *Empresa em Foco (Profissional)* do Guia Comercial de Ilicínea.\n\nMinha empresa: ${empresa.nomeFantasia}\n\nPoderia me dar mais informações?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full py-2 text-sm text-center inline-flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.531 5.845L.057 23.5l5.797-1.452A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.652-.51-5.17-1.399l-.371-.22-3.443.862.916-3.352-.241-.386A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                Falar no WhatsApp
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
