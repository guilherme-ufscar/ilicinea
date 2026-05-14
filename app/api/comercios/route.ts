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
  const segmentacao = searchParams.get('segmentacao')
  const busca = searchParams.get('busca')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { aprovado: true, ativo: true }

  if (segmentacao) where.segmentacao = segmentacao
  if (busca) {
    where.OR = [
      { nomeFantasia: { contains: busca, mode: 'insensitive' } },
      { categoria: { contains: busca, mode: 'insensitive' } },
      { palavrasChave: { contains: busca, mode: 'insensitive' } },
    ]
  }

  const [empresas, total] = await Promise.all([
    prisma.empresa.findMany({
      where,
      orderBy: [
        { destaqueHome: 'desc' },
        { plano: 'desc' },
        { nomeFantasia: 'asc' },
      ],
      skip: (page - 1) * limit,
      take: limit,
      include: { galeria: { orderBy: { ordem: 'asc' }, take: 5 } },
    }),
    prisma.empresa.count({ where }),
  ])

  return NextResponse.json({ empresas, total, page, totalPages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const existing = await prisma.empresa.findUnique({ where: { userId: session.user.id } })
  if (existing) {
    return NextResponse.json({ error: 'Você já possui uma empresa cadastrada' }, { status: 409 })
  }

  const body = await req.json()
  const { nomeFantasia, razaoSocial, cnpj, categoria, segmentacao, telefone, celular, cep, endereco, bairro } = body

  if (!nomeFantasia || !categoria || !segmentacao) {
    return NextResponse.json({ error: 'Nome fantasia, categoria e segmentação são obrigatórios' }, { status: 400 })
  }

  let slug = slugify(nomeFantasia)
  const existingSlug = await prisma.empresa.findUnique({ where: { slug } })
  if (existingSlug) slug = `${slug}-${Date.now().toString(36)}`

  const empresa = await prisma.empresa.create({
    data: {
      userId: session.user.id,
      slug,
      nomeFantasia,
      razaoSocial,
      cnpj,
      categoria,
      segmentacao,
      telefone,
      celular,
      cep,
      endereco,
      bairro,
    },
  })

  return NextResponse.json(empresa, { status: 201 })
}
