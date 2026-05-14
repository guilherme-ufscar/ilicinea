import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ComerciosTable from './ComerciosTable'

export default async function AdminComercios() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/')

  const empresas = await prisma.empresa.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      galeria: { take: 1 },
    },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-6">Comércios</h1>
      <ComerciosTable empresas={empresas} />
    </div>
  )
}
