# CLAUDE.md — ilicinea.com

## REPOSITÓRIO
https://github.com/guilherme-ufscar/ilicinea

## REGRA OBRIGATÓRIA — ANTES DE QUALQUER FRONTEND
Antes de escrever qualquer código de interface, use o Google Stitch MCP
para gerar o design da página. Só após aprovação do design escreva o código.

## STACK
- Next.js 14 (App Router) + TypeScript
- Prisma + PostgreSQL (via Docker, porta interna)
- NextAuth v5 (Auth.js)
- Resend (e-mails)
- Stripe (pagamentos)
- UploadThing (uploads)
- TipTap (editor rich text — open source)
- Tailwind CSS + shadcn/ui
- Docker Compose

## PALETA DE CORES (baseada na logo oficial)
--cor-primaria:       #F5820A   (laranja — CTA, destaque, links)
--cor-primaria-hover: #D96E00
--cor-primaria-light: #FEF0DC
--cor-texto:          #111111   (preto — texto principal)
--cor-texto-suave:    #444444
--cor-acento:         #E8263A   (vermelho — badges, alertas)
--cor-fundo:          #FFFFFF
--cor-fundo-suave:    #F8F8F8
--cor-borda:          #E5E5E5
--cor-whatsapp:       #25D366

## GOOGLE STITCH MCP
- Projeto ID: 2565234883951909530
- Design System ID: assets/5871296530528516654
- Telas geradas: Homepage Desktop, Homepage Mobile

## INFRA DOCKER
- Todas as portas internas ficam OCULTAS (expose, não ports)
- Apenas app e pgadmin (dev) têm portas públicas
- Portas públicas configuráveis via .env:
  PUBLIC_APP_PORT=3000
  PUBLIC_PGADMIN_PORT=5050

## GITHUB
- Push obrigatório após CADA mudança significativa
- Nunca commitar .env (apenas .env.example)
- Mensagens de commit em português

## MODELOS PRISMA PRINCIPAIS
User, Empresa, GaleriaFoto, Promocao,
Imovel, FotoImovel, Noticia, PontoTuristico,
FotoTurismo, Newsletter

## EMAILS (Resend)
- Todos os envios passam por lib/resend.ts
- Templates em /emails/*.tsx (React Email)
- FROM: process.env.RESEND_FROM_EMAIL

## PLANOS DO GUIA COMERCIAL
- GRATUITO: apenas dados básicos texto, sem links, sem fotos
- ESSENCIAL: + WhatsApp, logo, 1 foto, maps, galeria 5 fotos
- PROFISSIONAL: + redes sociais, descrição SEO, promoção do mês

## IMÓVEIS
- Código gerado: IL-[ANO]-[SEQUENCIAL]
- Formulário: 5 steps (Classificação, Localização, Valores, Características, Fotos)
- Máx 20 fotos por imóvel
- Admin deve aprovar antes de publicar

## COMANDOS ÚTEIS
npm run dev
npx prisma migrate dev
npx prisma studio
docker-compose up -d
docker-compose --profile dev up -d   # inclui pgAdmin
docker-compose down
