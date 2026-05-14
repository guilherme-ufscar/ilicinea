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
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { status: 'PUBLICADO' }

  if (categoria) where.categoria = categoria

  const [pontos, total] = await Promise.all([
    prisma.pontoTuristico.findMany({
      where,
      orderBy: [{ fixadoHome: 'desc' }, { destaque: 'desc' }, { publicadoEm: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
      include: { galeria: { orderBy: { ordem: 'asc' }, take: 1 } },
    }),
    prisma.pontoTuristico.count({ where }),
  ])

  return NextResponse.json({ pontos, total, page, totalPages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const { nome, descricao, resumo, categoria } = body

  if (!nome || !descricao || !resumo || !categoria) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
  }

  let slug = slugify(nome)
  const existingSlug = await prisma.pontoTuristico.findUnique({ where: { slug } })
  if (existingSlug) slug = `${slug}-${Date.now().toString(36)}`

  const ponto = await prisma.pontoTuristico.create({
    data: {
      slug,
      nome,
      subtitulo: body.subtitulo,
      descricao,
      resumo,
      endereco: body.endereco,
      bairro: body.bairro,
      latitude: body.latitude ? parseFloat(body.latitude) : null,
      longitude: body.longitude ? parseFloat(body.longitude) : null,
      linkGoogleMaps: body.linkGoogleMaps,
      comoChegar: body.comoChegar,
      categoria,
      dificuldade: body.dificuldade,
      distanciaCentro: body.distanciaCentro ? parseFloat(body.distanciaCentro) : null,
      tempoDuracao: body.tempoDuracao,
      melhorEpoca: body.melhorEpoca,
      entradaGratuita: body.entradaGratuita ?? true,
      precoEntrada: body.precoEntrada ? parseFloat(body.precoEntrada) : null,
      acessivelPCD: body.acessivelPCD || false,
      horarioFuncionamento: body.horarioFuncionamento,
      telefoneContato: body.telefoneContato,
      linkInstagram: body.linkInstagram,
      linkSite: body.linkSite,
      dicasImportantes: body.dicasImportantes,
      imagemCapa: body.imagemCapa,
      imagemCapaAlt: body.imagemCapaAlt,
      videoUrl: body.videoUrl,
      metaTitulo: body.metaTitulo,
      metaDescricao: body.metaDescricao,
      tags: body.tags || [],
      status: body.status || 'RASCUNHO',
      publicadoEm: body.status === 'PUBLICADO' ? new Date() : null,
      destaque: body.destaque || false,
      fixadoHome: body.fixadoHome || false,
    },
  })

  if (body.galeria && Array.isArray(body.galeria)) {
    await prisma.fotoTurismo.createMany({
      data: body.galeria.map((foto: { url: string; alt?: string }, i: number) => ({
        pontoTuristicoId: ponto.id,
        url: foto.url,
        alt: foto.alt || null,
        ordem: i,
      })),
    })
  }

  return NextResponse.json(ponto, { status: 201 })
}
