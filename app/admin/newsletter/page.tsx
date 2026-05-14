import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import NewsletterClient from './NewsletterClient'

export default async function AdminNewsletter() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/')

  const inscritos = await prisma.newsletter.findMany({
    where: { ativo: true },
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true } } },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-6">Newsletter</h1>
      <NewsletterClient inscritos={inscritos} />
    </div>
  )
}
