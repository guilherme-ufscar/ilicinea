import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const noticia = await prisma.noticia.findUnique({ where: { id: params.id } })

  if (!noticia) {
    return NextResponse.json({ error: 'Notícia não encontrada' }, { status: 404 })
  }

  return NextResponse.json(noticia)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const noticia = await prisma.noticia.findUnique({ where: { id: params.id } })
  if (!noticia) {
    return NextResponse.json({ error: 'Notícia não encontrada' }, { status: 404 })
  }

  const body = await req.json()
  const data: Record<string, unknown> = {}

  const fields = [
    'titulo', 'subtitulo', 'conteudo', 'resumo', 'imagemCapa', 'imagemCapaAlt',
    'autorNome', 'fonte', 'linkFonte', 'categorias', 'tags', 'local',
    'metaTitulo', 'metaDescricao', 'status', 'destaque', 'fixadoHome',
  ]

  for (const field of fields) {
    if (body[field] !== undefined) data[field] = body[field]
  }

  if (body.dataEvento !== undefined) {
    data.dataEvento = body.dataEvento ? new Date(body.dataEvento) : null
  }

  if (body.publicadoEm !== undefined) {
    data.publicadoEm = body.publicadoEm ? new Date(body.publicadoEm) : null
  } else if (body.status === 'PUBLICADO' && !noticia.publicadoEm) {
    data.publicadoEm = new Date()
  }

  const updated = await prisma.noticia.update({ where: { id: params.id }, data })

  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  await prisma.noticia.delete({ where: { id: params.id } })

  return NextResponse.json({ message: 'Notícia excluída' })
}
