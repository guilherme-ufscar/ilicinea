import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import type { UserRole } from '@prisma/client'

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    name,
    email,
    password,
    role,
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
  } = body

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Nome, e-mail e senha são obrigatórios' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Senha deve ter no mínimo 8 caracteres' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 409 })
  }

  const validRoles: UserRole[] = ['COMERCIANTE', 'ANUNCIANTE_IMOVEL']
  const userRole: UserRole = validRoles.includes(role) ? role : 'COMERCIANTE'

  if (userRole === 'COMERCIANTE' && (!nomeFantasia || !categoria || !segmentacao)) {
    return NextResponse.json(
      { error: 'Nome fantasia, categoria e segmentação são obrigatórios' },
      { status: 400 },
    )
  }

  const hashedPassword = await bcryptjs.hash(password, 12)

  let slug: string | null = null

  if (userRole === 'COMERCIANTE' && nomeFantasia) {
    slug = slugify(nomeFantasia)
    const existingSlug = await prisma.empresa.findUnique({ where: { slug } })
    if (existingSlug) slug = `${slug}-${Date.now().toString(36)}`
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: userRole,
      ...(userRole === 'COMERCIANTE' && slug
        ? {
            empresa: {
              create: {
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
            },
          }
        : {}),
    },
  })

  return NextResponse.json(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    { status: 201 },
  )
}
