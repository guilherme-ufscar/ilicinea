import { prisma } from '../lib/prisma'
import bcryptjs from 'bcryptjs'

const email = process.argv[2]
const newPassword = process.argv[3]

if (!email || !newPassword) {
  console.error('Uso: npx tsx scripts/reset-password.ts <email> <nova-senha>')
  process.exit(1)
}

async function main() {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.error(`Usuário com email "${email}" não encontrado.`)
    process.exit(1)
  }

  const hashed = await bcryptjs.hash(newPassword, 12)
  await prisma.user.update({
    where: { email },
    data: { password: hashed },
  })

  console.log(`Senha atualizada com sucesso para ${email}`)
}

main().finally(() => prisma.$disconnect())
