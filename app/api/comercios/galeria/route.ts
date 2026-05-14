import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const empresa = await prisma.empresa.findUnique({ where: { userId: session.user.id } })
  if (!empresa) return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 })

  const count = await prisma.galeriaFoto.count({ where: { empresaId: empresa.id } })
  if (count >= 5) return NextResponse.json({ error: 'Máximo de 5 fotos' }, { status: 400 })

  const { url } = await req.json()
  const foto = await prisma.galeriaFoto.create({
    data: { empresaId: empresa.id, url, ordem: count },
  })

  return NextResponse.json(foto, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })

  const empresa = await prisma.empresa.findUnique({ where: { userId: session.user.id } })
  if (!empresa) return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 })

  await prisma.galeriaFoto.deleteMany({ where: { id, empresaId: empresa.id } })
  return NextResponse.json({ message: 'Foto removida' })
}
