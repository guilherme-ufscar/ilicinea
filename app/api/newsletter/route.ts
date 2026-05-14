import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { email, nome } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'E-mail é obrigatório' }, { status: 400 })
  }

  const existing = await prisma.newsletter.findUnique({ where: { email } })
  if (existing) {
    if (!existing.ativo) {
      await prisma.newsletter.update({ where: { email }, data: { ativo: true } })
      return NextResponse.json({ message: 'Inscrição reativada com sucesso!' })
    }
    return NextResponse.json({ message: 'E-mail já inscrito na newsletter.' })
  }

  await prisma.newsletter.create({ data: { email, nome } })

  return NextResponse.json({ message: 'Inscrito com sucesso!' }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'E-mail é obrigatório' }, { status: 400 })
  }

  const existing = await prisma.newsletter.findUnique({ where: { email } })
  if (!existing) {
    return NextResponse.json({ error: 'E-mail não encontrado' }, { status: 404 })
  }

  await prisma.newsletter.update({ where: { email }, data: { ativo: false } })

  return NextResponse.json({ message: 'Inscrição cancelada.' })
}
