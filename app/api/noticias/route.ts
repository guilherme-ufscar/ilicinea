import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const categoria = searchParams.get('categoria')
  const busca = searchParams.get('busca')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { status: 'PUBLICADO' }

  if (categoria) where.categorias = { has: categoria }
  if (busca) {
    where.OR = [
      { titulo: { contains: busca, mode: 'insensitive' } },
      { resumo: { contains: busca, mode: 'insensitive' } },
    ]
  }

  const [noticias, total] = await Promise.all([
    prisma.noticia.findMany({
      where,
      orderBy: [{ fixadoHome: 'desc' }, { destaque: 'desc' }, { publicadoEm: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.noticia.count({ where }),
  ])

  return NextResponse.json({ noticias, total, page, totalPages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const { titulo, conteudo, resumo, autorNome, categorias } = body

  if (!titulo || !conteudo || !resumo || !autorNome || !categorias?.length) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
  }

  let slug = slugify(titulo)
  const existingSlug = await prisma.noticia.findUnique({ where: { slug } })
  if (existingSlug) slug = `${slug}-${Date.now().toString(36)}`

  const noticia = await prisma.noticia.create({
    data: {
      slug,
      titulo,
      subtitulo: body.subtitulo,
      conteudo,
      resumo,
      imagemCapa: body.imagemCapa,
      imagemCapaAlt: body.imagemCapaAlt,
      autorNome,
      autorUserId: session.user.id,
      fonte: body.fonte,
      linkFonte: body.linkFonte,
      categorias,
      tags: body.tags || [],
      local: body.local,
      dataEvento: body.dataEvento ? new Date(body.dataEvento) : null,
      metaTitulo: body.metaTitulo,
      metaDescricao: body.metaDescricao,
      status: body.status || 'RASCUNHO',
      publicadoEm: body.status === 'PUBLICADO' ? (body.publicadoEm ? new Date(body.publicadoEm) : new Date()) : null,
      destaque: body.destaque || false,
      fixadoHome: body.fixadoHome || false,
    },
  })

  return NextResponse.json(noticia, { status: 201 })
}
