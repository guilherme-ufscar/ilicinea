import { Resend } from 'resend'

let resendInstance: Resend | null = null

function getResend(): Resend {
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }
  return resendInstance
}

export function getEmailFrom(): string {
  return `${process.env.RESEND_FROM_NAME || 'Ilicínea.com'} <${process.env.RESEND_FROM_EMAIL || 'noreply@ilicinea.com'}>`
}

export async function sendEmail(options: { to: string; subject: string; html: string }) {
  try {
    await getResend().emails.send({
      from: getEmailFrom(),
      to: options.to,
      subject: options.subject,
      html: options.html,
    })
  } catch (e) {
    console.error('Erro ao enviar e-mail:', e)
  }
}
