import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ImoveisTable from './ImoveisTable'

export default async function AdminImoveis() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/')

  const imoveis = await prisma.imovel.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      fotos: { take: 1 },
    },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-6">Imóveis</h1>
      <ImoveisTable imoveis={imoveis} />
    </div>
  )
}
