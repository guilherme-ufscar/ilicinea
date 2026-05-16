import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'E-mail é obrigatório' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ message: 'Se o e-mail existir, enviaremos um link de recuperação.' })
    }

    const token = randomUUID()
    const expires = new Date(Date.now() + 3600000)

    await prisma.verificationToken.deleteMany({ where: { identifier: email } })
    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://ilicinea.com'
    const resetUrl = `${appUrl}/recuperar-senha/${token}`

    await sendEmail({
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

    return NextResponse.json({ message: 'Se o e-mail existir, enviaremos um link de recuperação.' })
  } catch {
    return NextResponse.json(
      { error: 'Recuperação de senha temporariamente indisponível. Tente novamente em instantes.' },
      { status: 503 },
    )
  }
}
