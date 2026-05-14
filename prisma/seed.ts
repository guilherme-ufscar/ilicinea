import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

function slugify(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function main() {
  console.log('🌱 Iniciando seed...')

  // Admin user
  const adminPassword = await bcryptjs.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ilicinea.com' },
    update: {},
    create: { name: 'Administrador', email: 'admin@ilicinea.com', password: adminPassword, role: 'ADMIN', emailVerified: new Date() },
  })
  console.log('✅ Admin:', admin.email)

  // Comerciante de exemplo
  const comerciantePassword = await bcryptjs.hash('12345678', 12)
  const comerciante = await prisma.user.upsert({
    where: { email: 'comerciante@ilicinea.com' },
    update: {},
    create: { name: 'João Silva', email: 'comerciante@ilicinea.com', password: comerciantePassword, role: 'COMERCIANTE' },
  })

  const slug = slugify('Restaurante Sabor Mineiro')
  await prisma.empresa.upsert({
    where: { slug },
    update: {},
    create: {
      userId: comerciante.id, slug, nomeFantasia: 'Restaurante Sabor Mineiro',
      categoria: 'Restaurante', segmentacao: 'Alimentação',
      endereco: 'Rua Principal, 123', bairro: 'Centro', cidade: 'Ilicínea', estado: 'MG',
      telefone: '(35) 1234-5678', celular: '(35) 99999-9999', whatsapp: '5535999999999',
      plano: 'PROFISSIONAL', aprovado: true, destaqueHome: true,
      descricao: 'O melhor restaurante de comida mineira da cidade. Ambiente familiar com buffet completo e pratos típicos.',
      palavrasChave: 'comida mineira, buffet, almoço, restaurante',
      linkInstagram: 'https://instagram.com/sabormineiro',
    },
  })
  console.log('✅ Empresa:', slug)

  // Anunciante de exemplo
  const anunciantePassword = await bcryptjs.hash('12345678', 12)
  const anunciante = await prisma.user.upsert({
    where: { email: 'anunciante@ilicinea.com' },
    update: {},
    create: { name: 'Maria Corretora', email: 'anunciante@ilicinea.com', password: anunciantePassword, role: 'ANUNCIANTE_IMOVEL' },
  })

  const imovelExists = await prisma.imovel.findUnique({ where: { codigo: 'IL-2026-001' } })
  if (!imovelExists) {
    await prisma.imovel.create({
      data: {
        userId: anunciante.id, codigo: 'IL-2026-001',
        titulo: 'Casa ampla com quintal no Centro',
        slug: 'casa-ampla-com-quintal-no-centro',
        descricao: '<p>Linda casa com quintal amplo, 3 quartos, sala, cozinha, área de serviço e garagem para 2 carros.</p>',
        tipo: 'CASA', finalidade: 'RESIDENCIAL', negocio: 'VENDA', preco: 350000,
        areaTotal: 250, areaConstruida: 180, quartos: 3, banheiros: 2, vagas: 2,
        bairro: 'Centro', cidade: 'Ilicínea', estado: 'MG',
        sala: true, cozinha: true, areaServico: true, varanda: true, quintal: true,
        nomeAnunciante: 'Maria Corretora', telefoneContato: '(35) 98888-8888',
        whatsappContato: '5535988888888', emailContato: 'maria@email.com', creci: '12345-MG',
        status: 'ATIVO', destaque: true, publicadoEm: new Date(),
      },
    })
    console.log('✅ Imóvel: IL-2026-001')
  }

  // Notícia de exemplo
  const noticiaSlug = slugify('Inauguração da nova praça central')
  const noticiaExists = await prisma.noticia.findUnique({ where: { slug: noticiaSlug } })
  if (!noticiaExists) {
    await prisma.noticia.create({
      data: {
        slug: noticiaSlug, titulo: 'Inauguração da nova praça central de Ilicínea',
        subtitulo: 'Prefeitura entrega obra de revitalização',
        conteudo: '<p>A Prefeitura de Ilicínea inaugurou neste sábado a nova Praça Central, totalmente revitalizada.</p>',
        resumo: 'A Prefeitura de Ilicínea inaugurou a nova Praça Central totalmente revitalizada.',
        autorNome: 'Redação Ilicínea.com', categorias: ['Eventos', 'Geral'],
        tags: ['inauguração', 'praça'], local: 'Praça Central',
        status: 'PUBLICADO', destaque: true, fixadoHome: true, publicadoEm: new Date(),
      },
    })
    console.log('✅ Notícia criada')
  }

  // Ponto turístico de exemplo
  const turismoSlug = slugify('Igreja Matriz de São Sebastião')
  const turismoExists = await prisma.pontoTuristico.findUnique({ where: { slug: turismoSlug } })
  if (!turismoExists) {
    await prisma.pontoTuristico.create({
      data: {
        slug: turismoSlug, nome: 'Igreja Matriz de São Sebastião',
        subtitulo: 'Padroeiro da cidade',
        descricao: '<p>A Igreja Matriz de São Sebastião é um dos principais pontos turísticos de Ilicínea.</p>',
        resumo: 'Principal igreja da cidade, dedicada ao padroeiro São Sebastião.',
        categoria: 'RELIGIOSO', endereco: 'Praça Central, s/n', bairro: 'Centro',
        distanciaCentro: 0.1, entradaGratuita: true, acessivelPCD: true,
        horarioFuncionamento: 'Seg a Sex: 8h-18h | Sáb: 8h-12h | Dom: Missas às 8h e 19h',
        status: 'PUBLICADO', destaque: true, fixadoHome: true, publicadoEm: new Date(),
      },
    })
    console.log('✅ Turismo criado')
  }

  console.log('🌱 Seed concluído!')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
