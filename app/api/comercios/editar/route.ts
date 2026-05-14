import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const empresa = await prisma.empresa.findUnique({ where: { userId: session.user.id } })
  if (!empresa) {
    return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 })
  }

  const body = await req.json()
  const fields = [
    'nomeFantasia', 'razaoSocial', 'cnpj', 'categoria', 'segmentacao',
    'telefone', 'celular', 'whatsapp', 'email', 'cep', 'endereco', 'bairro',
    'cidade', 'estado', 'descricao', 'palavrasChave',
    'linkInstagram', 'linkFacebook', 'linkSite', 'linkGoogleMaps',
    'fotoPerfil', 'fotoFachada',
  ]

  const data: Record<string, unknown> = {}
  for (const f of fields) {
    if (body[f] !== undefined) data[f] = body[f]
  }

  const updated = await prisma.empresa.update({ where: { id: empresa.id }, data })
  return NextResponse.json(updated)
}
