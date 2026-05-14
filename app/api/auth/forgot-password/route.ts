import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { prisma } from '@/lib/prisma'
import { resend, emailFrom } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'E-mail é obrigatório' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ message: 'Se o e-mail existir, enviaremos um link de recuperação.' })
  }

  const token = randomUUID()
  const expires = new Date(Date.now() + 3600000) // 1 hora

  await prisma.verificationToken.upsert({
    where: { identifier_token: { identifier: email, token } },
    update: { token, expires },
    create: { identifier: email, token, expires },
  })

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/recuperar-senha/${token}`

  try {
    await resend.emails.send({
      from: emailFrom,
      to: email,
      subject: 'Recuperar senha — Ilicínea.com',
      html: `
        <h2>Recuperação de senha</h2>
        <p>Olá ${user.name || ''},</p>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#F5820A;color:white;text-decoration:none;border-radius:8px;">Redefinir senha</a>
        <p>Este link expira em 1 hora.</p>
        <p>Se você não solicitou, ignore este e-mail.</p>
      `,
    })
  } catch (e) {
    console.error('Erro ao enviar e-mail:', e)
  }

  return NextResponse.json({ message: 'Se o e-mail existir, enviaremos um link de recuperação.' })
}
