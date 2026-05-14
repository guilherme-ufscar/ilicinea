import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { token, password } = await req.json()

  if (!token || !password) {
    return NextResponse.json({ error: 'Token e senha são obrigatórios' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Senha deve ter no mínimo 8 caracteres' }, { status: 400 })
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  })

  if (!verificationToken || verificationToken.expires < new Date()) {
    return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 400 })
  }

  const hashedPassword = await bcryptjs.hash(password, 12)

  await prisma.user.update({
    where: { email: verificationToken.identifier },
    data: { password: hashedPassword },
  })

  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier: verificationToken.identifier, token } },
  })

  return NextResponse.json({ message: 'Senha alterada com sucesso' })
}
