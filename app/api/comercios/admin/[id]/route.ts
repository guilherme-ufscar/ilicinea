import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await req.json()

  const data: Record<string, unknown> = {}
  const boolFields = ['aprovado', 'ativo', 'destaqueHome']
  const stringFields = ['plano', 'planoStatus']

  for (const field of boolFields) {
    if (body[field] !== undefined) data[field] = body[field]
  }
  for (const field of stringFields) {
    if (body[field] !== undefined) data[field] = body[field]
  }

  const updated = await prisma.empresa.update({ where: { id: params.id }, data })

  return NextResponse.json(updated)
}
