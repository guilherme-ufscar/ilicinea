import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const empresa = await prisma.empresa.findUnique({ where: { userId: session.user.id } })
  if (!empresa) return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 })

  const body = await req.json()
  const promo = await prisma.promocao.create({
    data: {
      empresaId: empresa.id,
      titulo: body.titulo,
      descricao: body.descricao,
      imagemUrl: body.imagemUrl || null,
      validadeAte: body.validadeAte ? new Date(body.validadeAte) : null,
      ativo: body.ativo ?? true,
    },
  })

  return NextResponse.json(promo, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })

  const empresa = await prisma.empresa.findUnique({ where: { userId: session.user.id } })
  if (!empresa) return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 })

  const body = await req.json()
  const promo = await prisma.promocao.update({
    where: { id },
    data: {
      titulo: body.titulo,
      descricao: body.descricao,
      imagemUrl: body.imagemUrl || null,
      validadeAte: body.validadeAte ? new Date(body.validadeAte) : null,
      ativo: body.ativo ?? true,
    },
  })

  return NextResponse.json(promo)
}
