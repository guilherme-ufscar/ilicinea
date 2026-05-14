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

async function generateCodigo(): Promise<string> {
  const year = new Date().getFullYear()
  const lastImovel = await prisma.imovel.findFirst({
    where: { codigo: { startsWith: `IL-${year}-` } },
    orderBy: { codigo: 'desc' },
  })

  let seq = 1
  if (lastImovel) {
    const parts = lastImovel.codigo.split('-')
    seq = parseInt(parts[2]) + 1
  }

  return `IL-${year}-${seq.toString().padStart(3, '0')}`
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tipo = searchParams.get('tipo')
  const negocio = searchParams.get('negocio')
  const bairro = searchParams.get('bairro')
  const precoMin = searchParams.get('precoMin')
  const precoMax = searchParams.get('precoMax')
  const quartos = searchParams.get('quartos')
  const codigo = searchParams.get('codigo')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const ordem = searchParams.get('ordem') || 'recentes'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { status: 'ATIVO' }

  if (tipo) where.tipo = tipo
  if (negocio) where.negocio = negocio
  if (bairro) where.bairro = { contains: bairro, mode: 'insensitive' }
  if (codigo) where.codigo = { contains: codigo, mode: 'insensitive' }
  if (quartos) where.quartos = { gte: parseInt(quartos) }
  if (precoMin || precoMax) {
    where.preco = {}
    if (precoMin) where.preco.gte = parseFloat(precoMin)
    if (precoMax) where.preco.lte = parseFloat(precoMax)
  }

  let orderBy: Record<string, string>[] = [{ destaque: 'desc' }, { createdAt: 'desc' }]
  if (ordem === 'menor-preco') orderBy = [{ destaque: 'desc' }, { preco: 'asc' }]
  if (ordem === 'maior-preco') orderBy = [{ destaque: 'desc' }, { preco: 'desc' }]

  const [imoveis, total] = await Promise.all([
    prisma.imovel.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { fotos: { orderBy: { ordem: 'asc' }, take: 1 } },
    }),
    prisma.imovel.count({ where }),
  ])

  return NextResponse.json({ imoveis, total, page, totalPages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  if (session.user.role !== 'ANUNCIANTE_IMOVEL' && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  const body = await req.json()
  const { titulo, descricao, tipo, finalidade, negocio, nomeAnunciante } = body

  if (!titulo || !descricao || !tipo || !finalidade || !negocio || !nomeAnunciante) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
  }

  const codigo = await generateCodigo()
  let slug = slugify(titulo)
  const existingSlug = await prisma.imovel.findUnique({ where: { slug } })
  if (existingSlug) slug = `${slug}-${codigo.toLowerCase()}`

  const imovel = await prisma.imovel.create({
    data: {
      userId: session.user.id,
      codigo,
      titulo,
      slug,
      descricao,
      tipo,
      finalidade,
      negocio,
      cep: body.cep,
      logradouro: body.logradouro,
      numero: body.numero,
      complemento: body.complemento,
      bairro: body.bairro,
      cidade: body.cidade || 'Ilicínea',
      estado: body.estado || 'MG',
      latitude: body.latitude ? parseFloat(body.latitude) : null,
      longitude: body.longitude ? parseFloat(body.longitude) : null,
      linkGoogleMaps: body.linkGoogleMaps,
      preco: body.preco ? parseFloat(body.preco) : null,
      precoNegociavel: body.precoNegociavel || false,
      condominio: body.condominio ? parseFloat(body.condominio) : null,
      iptu: body.iptu ? parseFloat(body.iptu) : null,
      caucao: body.caucao ? parseFloat(body.caucao) : null,
      precoTemporada: body.precoTemporada ? parseFloat(body.precoTemporada) : null,
      areaTotal: body.areaTotal ? parseFloat(body.areaTotal) : null,
      areaConstruida: body.areaConstruida ? parseFloat(body.areaConstruida) : null,
      areaTerreno: body.areaTerreno ? parseFloat(body.areaTerreno) : null,
      quartos: body.quartos ? parseInt(body.quartos) : null,
      suites: body.suites ? parseInt(body.suites) : null,
      banheiros: body.banheiros ? parseInt(body.banheiros) : null,
      vagas: body.vagas ? parseInt(body.vagas) : null,
      andares: body.andares ? parseInt(body.andares) : null,
      posicaoSol: body.posicaoSol,
      sala: body.sala || false,
      cozinha: body.cozinha || false,
      areaServico: body.areaServico || false,
      varanda: body.varanda || false,
      quintal: body.quintal || false,
      piscina: body.piscina || false,
      churrasqueira: body.churrasqueira || false,
      portaoEletrico: body.portaoEletrico || false,
      cercaEletrica: body.cercaEletrica || false,
      cameraSeguranca: body.cameraSeguranca || false,
      alarme: body.alarme || false,
      aquecedorAgua: body.aquecedorAgua || false,
      arCondicionado: body.arCondicionado || false,
      mobiliado: body.mobiliado || 'NAO_MOBILIADO',
      animaisPermitidos: body.animaisPermitidos || false,
      hectares: body.hectares ? parseFloat(body.hectares) : null,
      aguaEncanada: body.aguaEncanada || false,
      energiaEletrica: body.energiaEletrica || false,
      escritura: body.escritura || false,
      georreferenciado: body.georreferenciado || false,
      cadastroRural: body.cadastroRural || false,
      tipoSolo: body.tipoSolo,
      usoAgricola: body.usoAgricola,
      benfeitorias: body.benfeitorias,
      wc: body.wc ? parseInt(body.wc) : null,
      mezanino: body.mezanino || false,
      peDireito: body.peDireito ? parseFloat(body.peDireito) : null,
      trifasico: body.trifasico || false,
      fotoCapa: body.fotoCapa,
      videoUrl: body.videoUrl,
      tourVirtualUrl: body.tourVirtualUrl,
      nomeAnunciante,
      telefoneContato: body.telefoneContato,
      whatsappContato: body.whatsappContato,
      emailContato: body.emailContato,
      creci: body.creci,
    },
  })

  if (body.fotos && Array.isArray(body.fotos)) {
    await prisma.fotoImovel.createMany({
      data: body.fotos.map((foto: { url: string; alt?: string }, i: number) => ({
        imovelId: imovel.id,
        url: foto.url,
        alt: foto.alt || null,
        ordem: i,
      })),
    })
  }

  return NextResponse.json(imovel, { status: 201 })
}
