import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const empresa = await prisma.empresa.findUnique({
    where: { slug: params.slug },
    include: {
      galeria: { orderBy: { ordem: 'asc' } },
      promocoes: { where: { ativo: true }, orderBy: { createdAt: 'desc' }, take: 1 },
    },
  })

  if (!empresa || !empresa.aprovado || !empresa.ativo) {
    return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 })
  }

  return NextResponse.json(empresa)
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const empresa = await prisma.empresa.findUnique({ where: { slug: params.slug } })
  if (!empresa) {
    return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 })
  }

  if (empresa.userId !== session.user.id && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  const body = await req.json()
  const allowedFields = [
    'nomeFantasia', 'razaoSocial', 'cnpj', 'categoria', 'segmentacao',
    'endereco', 'bairro', 'cep', 'telefone', 'celular', 'whatsapp',
    'fotoPerfil', 'fotoFachada', 'linkGoogleMaps', 'descricao',
    'palavrasChave', 'linkInstagram', 'linkFacebook', 'linkSite', 'email',
  ]

  const data: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (body[field] !== undefined) data[field] = body[field]
  }

  const updated = await prisma.empresa.update({
    where: { id: empresa.id },
    data,
  })

  return NextResponse.json(updated)
}
