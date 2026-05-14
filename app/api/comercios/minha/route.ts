import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const empresa = await prisma.empresa.findUnique({
    where: { userId: session.user.id },
    include: {
      galeria: { orderBy: { ordem: 'asc' } },
      promocoes: { where: { ativo: true } },
    },
  })

  if (!empresa) {
    return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 })
  }

  return NextResponse.json(empresa)
}
