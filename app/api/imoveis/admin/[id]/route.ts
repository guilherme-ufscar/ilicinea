import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await req.json()

  const data: Record<string, unknown> = {}
  if (body.status !== undefined) data.status = body.status
  if (body.destaque !== undefined) data.destaque = body.destaque

  const updated = await prisma.imovel.update({ where: { id: params.id }, data })

  if (body.motivo) {
    const imovel = await prisma.imovel.findUnique({
      where: { id: params.id },
      include: { user: { select: { email: true, name: true } } },
    })
    if (imovel?.user?.email) {
      try {
        const { sendEmail } = await import('@/lib/resend')
        await sendEmail({
          to: imovel.user.email,
          subject: `Imóvel ${imovel.codigo} — Rejeitado`,
          html: `
            <h2>Imóvel rejeitado</h2>
            <p>Olá ${imovel.user.name || ''},</p>
            <p>Seu imóvel <strong>${imovel.titulo}</strong> (${imovel.codigo}) foi rejeitado.</p>
            <p><strong>Motivo:</strong> ${body.motivo}</p>
          `,
        })
      } catch (e) {
        console.error('Erro ao enviar e-mail de rejeição:', e)
      }
    }
  }

  return NextResponse.json(updated)
}
