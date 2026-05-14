import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { role } = await req.json()

  if (!['ADMIN', 'COMERCIANTE', 'ANUNCIANTE_IMOVEL'].includes(role)) {
    return NextResponse.json({ error: 'Role inválido' }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data: { role },
  })

  return NextResponse.json({ id: user.id, role: user.role })
}
