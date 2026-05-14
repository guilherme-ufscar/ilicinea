import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const ponto = await prisma.pontoTuristico.findUnique({
    where: { id: params.id },
    include: { galeria: { orderBy: { ordem: 'asc' } } },
  })

  if (!ponto) {
    return NextResponse.json({ error: 'Ponto turístico não encontrado' }, { status: 404 })
  }

  return NextResponse.json(ponto)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const ponto = await prisma.pontoTuristico.findUnique({ where: { id: params.id } })
  if (!ponto) {
    return NextResponse.json({ error: 'Ponto turístico não encontrado' }, { status: 404 })
  }

  const body = await req.json()
  const data: Record<string, unknown> = {}

  const stringFields = [
    'nome', 'subtitulo', 'descricao', 'resumo', 'endereco', 'bairro',
    'linkGoogleMaps', 'comoChegar', 'categoria', 'dificuldade', 'tempoDuracao',
    'melhorEpoca', 'horarioFuncionamento', 'telefoneContato', 'linkInstagram',
    'linkSite', 'dicasImportantes', 'imagemCapa', 'imagemCapaAlt', 'videoUrl',
    'metaTitulo', 'metaDescricao', 'status',
  ]
  const floatFields = ['latitude', 'longitude', 'distanciaCentro', 'precoEntrada']
  const boolFields = ['entradaGratuita', 'acessivelPCD', 'destaque', 'fixadoHome']

  for (const field of stringFields) {
    if (body[field] !== undefined) data[field] = body[field]
  }
  for (const field of floatFields) {
    if (body[field] !== undefined) data[field] = body[field] ? parseFloat(body[field]) : null
  }
  for (const field of boolFields) {
    if (body[field] !== undefined) data[field] = body[field]
  }
  if (body.tags !== undefined) data.tags = body.tags

  if (body.status === 'PUBLICADO' && !ponto.publicadoEm) {
    data.publicadoEm = new Date()
  }

  const updated = await prisma.pontoTuristico.update({ where: { id: params.id }, data })

  if (body.galeria && Array.isArray(body.galeria)) {
    await prisma.fotoTurismo.deleteMany({ where: { pontoTuristicoId: params.id } })
    await prisma.fotoTurismo.createMany({
      data: body.galeria.map((foto: { url: string; alt?: string }, i: number) => ({
        pontoTuristicoId: params.id,
        url: foto.url,
        alt: foto.alt || null,
        ordem: i,
      })),
    })
  }

  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  await prisma.pontoTuristico.delete({ where: { id: params.id } })

  return NextResponse.json({ message: 'Ponto turístico excluído' })
}
