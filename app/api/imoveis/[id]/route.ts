import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const imovel = await prisma.imovel.findUnique({
    where: { id: params.id },
    include: {
      fotos: { orderBy: { ordem: 'asc' } },
      user: { select: { name: true, email: true } },
    },
  })

  if (!imovel) {
    return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 })
  }

  return NextResponse.json(imovel)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const imovel = await prisma.imovel.findUnique({ where: { id: params.id } })
  if (!imovel) {
    return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 })
  }

  if (imovel.userId !== session.user.id && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  const body = await req.json()

  const numericFields = ['preco', 'condominio', 'iptu', 'caucao', 'precoTemporada', 'areaTotal', 'areaConstruida', 'areaTerreno', 'hectares', 'peDireito', 'latitude', 'longitude']
  const intFields = ['quartos', 'suites', 'banheiros', 'vagas', 'andares', 'wc']

  const data: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(body)) {
    if (key === 'fotos') continue
    if (numericFields.includes(key)) {
      data[key] = value ? parseFloat(value as string) : null
    } else if (intFields.includes(key)) {
      data[key] = value ? parseInt(value as string) : null
    } else {
      data[key] = value
    }
  }

  const updated = await prisma.imovel.update({ where: { id: params.id }, data })

  if (body.fotos && Array.isArray(body.fotos)) {
    await prisma.fotoImovel.deleteMany({ where: { imovelId: params.id } })
    await prisma.fotoImovel.createMany({
      data: body.fotos.map((foto: { url: string; alt?: string }, i: number) => ({
        imovelId: params.id,
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
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const imovel = await prisma.imovel.findUnique({ where: { id: params.id } })
  if (!imovel) {
    return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 })
  }

  if (imovel.userId !== session.user.id && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  await prisma.imovel.delete({ where: { id: params.id } })

  return NextResponse.json({ message: 'Imóvel excluído' })
}
