# ESCOPO COMPLETO — ILICINEA.COM
**Repositório:** https://github.com/guilherme-ufscar/ilicinea  
**Stack:** Next.js 14 · TypeScript · Prisma · PostgreSQL · Docker Compose · Resend · TipTap · Google Stitch MCP  
**Data:** Abril/2026  
**Desenvolvido por:** Coder Master

---

## ÍNDICE

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Arquitetura & Infraestrutura](#2-arquitetura--infraestrutura)
3. [Variáveis de Ambiente](#3-variáveis-de-ambiente)
4. [Banco de Dados — Modelagem Prisma](#4-banco-de-dados--modelagem-prisma)
5. [Autenticação & Contas](#5-autenticação--contas)
6. [Módulo: Guia Comercial](#6-módulo-guia-comercial)
7. [Módulo: Imóveis](#7-módulo-imóveis)
8. [Módulo: Notícias](#8-módulo-notícias)
9. [Módulo: Turismo](#9-módulo-turismo)
10. [Editor Rich Text — TipTap](#10-editor-rich-text--tiptap)
11. [Sistema de E-mails (Resend)](#11-sistema-de-e-mails-resend)
12. [Painel Administrativo](#12-painel-administrativo)
13. [SEO & Performance](#13-seo--performance)
14. [UI/UX — Google Stitch MCP](#14-uiux--google-stitch-mcp)
15. [Fases de Desenvolvimento](#15-fases-de-desenvolvimento)
16. [CLAUDE.md para Agentes](#16-claudemd-para-agentes)

---

## 1. VISÃO GERAL DO PROJETO

**ilicinea.com** é um portal local para a cidade de Ilicínea/MG com quatro módulos principais:

| Módulo | Descrição |
|---|---|
| Guia Comercial | Empresas locais se cadastram e pagam planos para ganhar visibilidade |
| Imóveis | Listagem e cadastro de imóveis para venda/aluguel/temporada |
| Notícias | Blog de notícias da cidade |
| Turismo | Blog de pontos turísticos da cidade |

### Personas
- **Visitante anônimo:** Consome conteúdo público sem login
- **Empresário:** Cadastra sua empresa, gerencia perfil, compra plano
- **Corretor / Anunciante de imóvel:** Cadastra imóveis para venda ou aluguel
- **Administrador:** Gerencia todo o conteúdo, usuários e planos (acesso via painel admin)

---

## 2. ARQUITETURA & INFRAESTRUTURA

### Stack Tecnológica

```
Frontend/Backend: Next.js 14 (App Router) + TypeScript
ORM:              Prisma
Banco de Dados:   PostgreSQL 16
E-mail:           Resend (SDK oficial)
Upload de Imagens: UploadThing ou S3-compatible (MinIO local em dev)
Autenticação:     NextAuth v5 (Auth.js)
Estilização:      Tailwind CSS + shadcn/ui
Pagamentos:       Stripe (produtos + assinaturas)
Editor Rich Text: TipTap (open source) — usado em Notícias, Turismo e Imóveis
Containerização:  Docker Compose
```

### Estrutura de Pastas (Next.js 14 App Router)

```
ilicinea/
├── app/
│   ├── (public)/                    # Rotas públicas sem auth
│   │   ├── page.tsx                 # Home
│   │   ├── comercios/
│   │   │   ├── page.tsx             # Listagem de comércios
│   │   │   └── [slug]/page.tsx      # Perfil da empresa
│   │   ├── imoveis/
│   │   │   ├── page.tsx             # Listagem de imóveis
│   │   │   └── [codigo]/page.tsx    # Detalhe do imóvel
│   │   ├── noticias/
│   │   │   ├── page.tsx             # Listagem de notícias
│   │   │   └── [slug]/page.tsx      # Artigo de notícia
│   │   └── turismo/
│   │       ├── page.tsx             # Listagem de turismo
│   │       └── [slug]/page.tsx      # Detalhe do ponto turístico
│   ├── (auth)/                      # Rotas de autenticação
│   │   ├── entrar/page.tsx          # Login
│   │   ├── criar-conta/page.tsx     # Cadastro
│   │   └── recuperar-senha/page.tsx
│   ├── (dashboard)/                 # Área logada do empresário
│   │   └── minha-empresa/
│   │       ├── page.tsx             # Visão geral do perfil
│   │       ├── editar/page.tsx      # Editar dados da empresa
│   │       ├── plano/page.tsx       # Ver/trocar plano
│   │       ├── fotos/page.tsx       # Gerenciar galeria
│   │       └── promocao/page.tsx    # Cadastrar promoção do mês
│   ├── (imovel-dashboard)/          # Área do anunciante de imóvel
│   │   └── meus-imoveis/
│   │       ├── page.tsx
│   │       ├── novo/page.tsx
│   │       └── [id]/editar/page.tsx
│   ├── admin/                       # Painel administrativo
│   │   ├── page.tsx
│   │   ├── usuarios/page.tsx
│   │   ├── comercios/page.tsx
│   │   ├── imoveis/page.tsx
│   │   ├── noticias/
│   │   │   ├── page.tsx
│   │   │   ├── nova/page.tsx
│   │   │   └── [id]/editar/page.tsx
│   │   └── turismo/
│   │       ├── page.tsx
│   │       ├── novo/page.tsx
│   │       └── [id]/editar/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── webhooks/stripe/route.ts
│       ├── comercios/route.ts
│       ├── imoveis/route.ts
│       ├── noticias/route.ts
│       ├── turismo/route.ts
│       └── newsletter/route.ts
├── components/
│   ├── ui/                          # shadcn/ui base components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── MobileMenu.tsx
│   ├── comercios/
│   ├── imoveis/
│   ├── noticias/
│   └── turismo/
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── resend.ts
│   ├── stripe.ts
│   └── uploadthing.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── emails/                          # Templates Resend (React Email)
│   ├── WelcomeEmail.tsx
│   ├── PlanoAtivadoEmail.tsx
│   ├── RecuperarSenhaEmail.tsx
│   └── NoticiaNewsletter.tsx
├── docker-compose.yml
├── docker-compose.prod.yml
├── Dockerfile
└── .env.example
```

### Docker Compose

```yaml
# docker-compose.yml
version: "3.9"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: ilicinea_app
    restart: unless-stopped
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - RESEND_API_KEY=${RESEND_API_KEY}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
      - UPLOADTHING_SECRET=${UPLOADTHING_SECRET}
      - UPLOADTHING_APP_ID=${UPLOADTHING_APP_ID}
    ports:
      - "${PUBLIC_APP_PORT:-3000}:3000"
    depends_on:
      db:
        condition: service_healthy
    networks:
      - ilicinea_net

  db:
    image: postgres:16-alpine
    container_name: ilicinea_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - ilicinea_pgdata:/var/lib/postgresql/data
    # PORTA INTERNA APENAS — sem exposição pública
    expose:
      - "5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - ilicinea_net

  # pgAdmin opcional para desenvolvimento
  pgadmin:
    image: dpage/pgadmin4
    container_name: ilicinea_pgadmin
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: ${PGADMIN_EMAIL}
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD}
    ports:
      - "${PUBLIC_PGADMIN_PORT:-5050}:80"
    depends_on:
      - db
    networks:
      - ilicinea_net
    profiles:
      - dev

volumes:
  ilicinea_pgdata:

networks:
  ilicinea_net:
    driver: bridge
```

### Dockerfile

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

---

## 3. VARIÁVEIS DE AMBIENTE

Arquivo `.env.example` — **todas as portas públicas configuráveis via .env:**

```env
# ============================================
# PORTAS PÚBLICAS (modificar conforme desejado)
# ============================================
PUBLIC_APP_PORT=3000
PUBLIC_PGADMIN_PORT=5050

# ============================================
# BANCO DE DADOS (interno Docker)
# ============================================
POSTGRES_USER=ilicinea_user
POSTGRES_PASSWORD=senha_segura_aqui
POSTGRES_DB=ilicinea_db
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}?schema=public"

# ============================================
# AUTENTICAÇÃO
# ============================================
NEXTAUTH_URL=https://ilicinea.com
NEXTAUTH_SECRET=gerar_com_openssl_rand_base64_32

# ============================================
# E-MAIL (Resend)
# ============================================
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@ilicinea.com
RESEND_FROM_NAME="Ilicínea.com"

# ============================================
# PAGAMENTOS (Stripe)
# ============================================
STRIPE_PUBLISHABLE_KEY=pk_live_xxxx
STRIPE_SECRET_KEY=sk_live_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx
STRIPE_PRICE_ESSENCIAL_MENSAL=price_xxxx
STRIPE_PRICE_ESSENCIAL_ANUAL=price_xxxx
STRIPE_PRICE_PROFISSIONAL=price_xxxx

# ============================================
# UPLOAD DE ARQUIVOS (UploadThing)
# ============================================
UPLOADTHING_SECRET=sk_live_xxxx
UPLOADTHING_APP_ID=xxxx

# ============================================
# PGADMIN (dev only)
# ============================================
PGADMIN_EMAIL=admin@ilicinea.com
PGADMIN_PASSWORD=pgadmin_senha

# ============================================
# APP
# ============================================
NEXT_PUBLIC_APP_URL=https://ilicinea.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=xxxx
```

---

## 4. BANCO DE DADOS — MODELAGEM PRISMA

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================
// AUTENTICAÇÃO (NextAuth v5)
// ============================

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?   // hash bcrypt
  role          UserRole  @default(COMERCIANTE)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  empresa       Empresa?
  imoveis       Imovel[]
  newsletter    Newsletter?

  @@map("users")
}

enum UserRole {
  ADMIN
  COMERCIANTE
  ANUNCIANTE_IMOVEL
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// ============================
// GUIA COMERCIAL
// ============================

model Empresa {
  id                String         @id @default(cuid())
  userId            String         @unique
  user              User           @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Dados básicos (todos os planos)
  slug              String         @unique
  nomeFantasia      String
  razaoSocial       String?
  cnpj              String?
  categoria         String         // ex: "Restaurante", "Clínica", "Loja"
  segmentacao       String         // tag de segmentação para filtro
  endereco          String?
  bairro            String?
  cidade            String         @default("Ilicínea")
  estado            String         @default("MG")
  cep               String?
  telefone          String?
  celular           String?

  // Plano e visibilidade
  plano             PlanoEmpresa   @default(GRATUITO)
  planoStatus       PlanoStatus    @default(ATIVO)
  stripeCustomerId  String?
  stripeSubId       String?
  planoExpiraEm     DateTime?

  // Dados do Plano Essencial+
  whatsapp          String?        // número com DDI: 5535984570053
  fotoPerfil        String?        // URL da imagem
  fotoFachada       String?        // 1 imagem adicional
  linkGoogleMaps    String?        // URL do Google Maps

  // Dados do Plano Profissional
  descricao         String?        @db.Text
  palavrasChave     String?        // separadas por vírgula
  linkInstagram     String?
  linkFacebook      String?
  linkSite          String?
  email             String?

  // Galeria (Profissional: até 5 fotos)
  galeria           GaleriaFoto[]

  // Promoção do mês (Profissional)
  promocoes         Promocao[]

  // Status
  aprovado          Boolean        @default(false) // admin aprova após cadastro
  ativo             Boolean        @default(true)
  destaqueHome      Boolean        @default(false)

  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt

  @@map("empresas")
}

enum PlanoEmpresa {
  GRATUITO
  ESSENCIAL
  PROFISSIONAL
}

enum PlanoStatus {
  ATIVO
  CANCELADO
  EXPIRADO
  AGUARDANDO_PAGAMENTO
}

model GaleriaFoto {
  id        String   @id @default(cuid())
  empresaId String
  empresa   Empresa  @relation(fields: [empresaId], references: [id], onDelete: Cascade)
  url       String
  alt       String?
  ordem     Int      @default(0)
  createdAt DateTime @default(now())

  @@map("galeria_fotos")
}

model Promocao {
  id          String   @id @default(cuid())
  empresaId   String
  empresa     Empresa  @relation(fields: [empresaId], references: [id], onDelete: Cascade)
  titulo      String
  descricao   String   @db.Text
  imagemUrl   String?
  validadeAte DateTime?
  ativo       Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("promocoes")
}

// ============================
// IMÓVEIS
// ============================

model Imovel {
  id              String          @id @default(cuid())
  userId          String
  user            User            @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Identificação
  codigo          String          @unique // gerado automaticamente: IL-2024-001
  titulo          String
  slug            String          @unique
  descricao       String          @db.Text

  // Classificação
  tipo            TipoImovel
  finalidade      FinalidadeImovel
  negocio         NegocioImovel

  // Localização
  cep             String?
  logradouro      String?
  numero          String?
  complemento     String?
  bairro          String?
  cidade          String          @default("Ilicínea")
  estado          String          @default("MG")
  latitude        Float?
  longitude       Float?
  linkGoogleMaps  String?

  // Valores
  preco           Float?
  precoNegociavel Boolean         @default(false)
  condominio      Float?
  iptu            Float?
  caucao          Float?          // para aluguel
  precoTemporada  Float?          // diária ou mensal

  // Características gerais
  areaTotal       Float?          // m²
  areaConstruida  Float?          // m²
  areaTerreno     Float?          // m²
  quartos         Int?
  suites          Int?
  banheiros       Int?
  vagas           Int?
  andares         Int?
  posicaoSol      String?         // ex: "Nascente", "Poente"

  // Características específicas — Residencial
  sala            Boolean         @default(false)
  cozinha         Boolean         @default(false)
  areaServico     Boolean         @default(false)
  varanda         Boolean         @default(false)
  quintal         Boolean         @default(false)
  piscina         Boolean         @default(false)
  churrasqueira   Boolean         @default(false)
  portaoEletrico  Boolean         @default(false)
  cercaEletrica   Boolean         @default(false)
  cameraSeguranca Boolean         @default(false)
  alarme          Boolean         @default(false)
  aquecedorAgua   Boolean         @default(false)
  arCondicionado  Boolean         @default(false)
  mobiliado       ImovelMobilia   @default(NAO_MOBILIADO)
  animaisPermitidos Boolean       @default(false)

  // Características específicas — Rural/Fazenda
  hectares        Float?
  aguaEncanada    Boolean         @default(false)
  energiaEletrica Boolean         @default(false)
  escritura       Boolean         @default(false)
  georreferenciado Boolean        @default(false)
  cadastroRural   Boolean         @default(false) // ITR
  tipoSolo        String?         // ex: "Arenoso", "Argiloso"
  usoAgricola     String?         // ex: "Soja, Milho, Pastagem"
  benfeitorias    String?         @db.Text // descrição livre

  // Características específicas — Comercial/Sala
  wc              Int?
  mezanino        Boolean         @default(false)
  peDireito       Float?          // metros
  trifasico       Boolean         @default(false)

  // Mídia
  fotoCapa        String?
  fotos           FotoImovel[]
  videoUrl        String?         // YouTube ou link direto
  tourVirtualUrl  String?

  // Contato do anunciante
  nomeAnunciante  String
  telefoneContato String?
  whatsappContato String?
  emailContato    String?
  creci           String?         // número CRECI do corretor

  // Status
  status          StatusImovel    @default(PENDENTE)
  destaque        Boolean         @default(false)
  visualizacoes   Int             @default(0)

  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  publicadoEm    DateTime?

  @@map("imoveis")
}

enum TipoImovel {
  APARTAMENTO
  AREA_INDUSTRIAL
  AREA_RESIDENCIAL
  BARRACAO
  CASA
  CHACARA
  FAZENDA
  FLAT
  GLEBA
  INDUSTRIAL
  LOJA
  PAVILHAO_GALPAO
  POUSADA
  PREDIO
  RANCHO
  SALA
  SALA_COMERCIAL
  SITIO
  SOBRADO
  TERRENO
}

enum FinalidadeImovel {
  RESIDENCIAL
  COMERCIAL
  RURAL
  MISTO
}

enum NegocioImovel {
  VENDA
  ALUGUEL
  TEMPORADA_DIARIA
  TEMPORADA_MENSAL
}

enum ImovelMobilia {
  NAO_MOBILIADO
  SEMI_MOBILIADO
  MOBILIADO
}

enum StatusImovel {
  PENDENTE     // aguardando aprovação do admin
  ATIVO
  VENDIDO
  ALUGADO
  INATIVO
  REJEITADO
}

model FotoImovel {
  id       String  @id @default(cuid())
  imovelId String
  imovel   Imovel  @relation(fields: [imovelId], references: [id], onDelete: Cascade)
  url      String
  alt      String?
  ordem    Int     @default(0)

  @@map("fotos_imovel")
}

// ============================
// NOTÍCIAS
// ============================

model Noticia {
  id              String         @id @default(cuid())
  slug            String         @unique
  titulo          String
  subtitulo       String?
  conteudo        String         @db.Text // rich text (HTML/MDX)
  resumo          String?        @db.Text // máx 300 chars, para cards e SEO
  imagemCapa      String?
  imagemCapaAlt   String?

  // Metadados
  autorNome       String         // pode ser diferente do user
  autorUserId     String?        // link para user admin
  fonte           String?        // ex: "Prefeitura de Ilicínea"
  linkFonte       String?

  // Categorização
  categorias      String[]       // ex: ["Esportes", "Cultura", "Política"]
  tags            String[]
  local           String?        // ex: "Centro", "Ginásio Municipal"

  // Data do evento (pode ser diferente da publicação)
  dataEvento      DateTime?

  // SEO
  metaTitulo      String?
  metaDescricao   String?

  // Status e publicação
  status          StatusConteudo @default(RASCUNHO)
  publicadoEm     DateTime?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  destaque        Boolean        @default(false)
  fixadoHome      Boolean        @default(false)
  visualizacoes   Int            @default(0)

  @@map("noticias")
}

// ============================
// TURISMO
// ============================

model PontoTuristico {
  id              String         @id @default(cuid())
  slug            String         @unique
  nome            String
  subtitulo       String?
  descricao       String         @db.Text
  resumo          String?        @db.Text

  // Localização
  endereco        String?
  bairro          String?
  latitude        Float?
  longitude       Float?
  linkGoogleMaps  String?
  comoChegar      String?        @db.Text // instruções de acesso

  // Características
  categoria       CategoriaTurismo
  dificuldade     DificuldadeTurismo?
  distanciaCentro Float?         // km do centro da cidade
  tempoDuracao    String?        // ex: "2h a 3h"
  melhorEpoca     String?        // ex: "Maio a Outubro"
  entradaGratuita Boolean        @default(true)
  precoEntrada    Float?
  acessivelPCD    Boolean        @default(false)

  // Informações práticas
  horarioFuncionamento String?
  telefoneContato String?
  linkInstagram   String?
  linkSite        String?
  dicasImportantes String?       @db.Text

  // Mídia
  imagemCapa      String?
  imagemCapaAlt   String?
  galeria         FotoTurismo[]
  videoUrl        String?

  // SEO
  metaTitulo      String?
  metaDescricao   String?
  tags            String[]

  // Status
  status          StatusConteudo  @default(RASCUNHO)
  publicadoEm     DateTime?
  destaque        Boolean         @default(false)
  fixadoHome      Boolean         @default(false)
  visualizacoes   Int             @default(0)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  @@map("pontos_turisticos")
}

enum CategoriaTurismo {
  NATUREZA
  RELIGIOSO
  HISTORICO
  CULTURAL
  ESPORTE_AVENTURA
  GASTRONOMIA
  FESTIVAL_EVENTO
}

enum DificuldadeTurismo {
  FACIL
  MODERADO
  DIFICIL
}

model FotoTurismo {
  id               String         @id @default(cuid())
  pontoTuristicoId String
  ponto            PontoTuristico @relation(fields: [pontoTuristicoId], references: [id], onDelete: Cascade)
  url              String
  alt              String?
  ordem            Int            @default(0)

  @@map("fotos_turismo")
}

// ============================
// NEWSLETTER
// ============================

model Newsletter {
  id        String   @id @default(cuid())
  email     String   @unique
  nome      String?
  userId    String?  @unique
  user      User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  ativo     Boolean  @default(true)
  createdAt DateTime @default(now())

  @@map("newsletter")
}

// ============================
// ENUMS COMPARTILHADOS
// ============================

enum StatusConteudo {
  RASCUNHO
  PUBLICADO
  ARQUIVADO
}
```

---

## 5. AUTENTICAÇÃO & CONTAS

### Páginas

| Rota | Descrição |
|---|---|
| `/entrar` | Login com e-mail/senha |
| `/criar-conta` | Cadastro — escolhe tipo (comerciante ou anunciante de imóvel) |
| `/recuperar-senha` | Solicita e-mail de recuperação |
| `/recuperar-senha/[token]` | Formulário de nova senha |

### Fluxo de Cadastro — Empresário (Guia Comercial)

O cadastro já coleta todos os dados da empresa na mesma tela, dividido em **steps (etapas)**:

**Step 1 — Conta**
- Nome completo
- E-mail
- Senha (min 8 chars)
- Confirmar senha

**Step 2 — Dados da Empresa**
- Nome fantasia *
- Razão social
- CNPJ
- Categoria (select + campo livre)
- Segmentação (select com opções pré-definidas)

**Step 3 — Contato & Localização**
- Telefone fixo
- Celular / WhatsApp
- CEP (auto-preenche endereço via ViaCEP API)
- Endereço, número, complemento
- Bairro

**Step 4 — Plano** *(escolha do plano)*
- Card: Gratuito — R$0
- Card: Essencial — R$34,99/mês ou R$350/ano
- Card: Profissional — Sob consulta (redireciona para WhatsApp)

Após escolher plano pago → redirect para Stripe Checkout.
Após confirmar pagamento → empresa ativa automaticamente via webhook Stripe.

### Fluxo de Cadastro — Anunciante de Imóvel

- Nome completo
- E-mail
- Senha
- Telefone / WhatsApp
- CRECI (opcional)
- Role: `ANUNCIANTE_IMOVEL`

---

## 6. MÓDULO: GUIA COMERCIAL

### Regras de Negócio por Plano

#### 🟢 Gratuito — "Presença Básica" — R$0

**Visível no perfil:**
- Nome da empresa
- Categoria e Segmentação
- Endereço (sem link para maps)
- Telefone fixo ou celular (somente texto, sem link clicável)
- Posição: Final da listagem da categoria

**NÃO visível:**
- WhatsApp (link clicável)
- Logo/foto
- Google Maps
- Galeria
- Redes sociais
- Descrição

#### 🟡 Essencial — "Destaque Local" — R$34,99/mês ou R$350/ano

**Tudo do Gratuito +**
- Botão WhatsApp (link clicável com mensagem pré-definida)
- Foto de perfil/logo
- 1 imagem adicional (fachada ou produto)
- Botão de rotas (Google Maps)
- Galeria com até 5 fotos
- Posição: Topo da listagem, acima dos gratuitos

#### 🔵 Profissional — "Empresa em Foco" — Valor sob consulta

**Tudo do Essencial +**
- Galeria com até 5 fotos (compartilhado com Essencial, mas diferente no layout)
- Links redes sociais (Instagram, Facebook)
- Descrição completa com palavras-chave
- Publicação de 1 promoção por mês (seção exclusiva no perfil)
- Destaque no topo absoluto da listagem
- Badge visual "Destaque" no card

### Páginas do Módulo

#### `/comercios` — Listagem

- Header da seção com busca por nome
- Grade de segmentações (pills clicáveis) com contador de perfis
- Seção "Profissional — Empresa em Foco" (cards maiores, badge destaque)
- Seção "Essencial — Destaque Local" (cards com logo e WhatsApp)
- Seção "Gratuito — Presença Básica" (listagem simples, texto apenas)
- Newsletter signup no rodapé

#### `/comercios/[slug]` — Perfil da Empresa

Renderização condicional por plano:

**Todos os planos:**
- Nome da empresa
- Categoria / Segmentação
- Endereço
- Telefone

**Essencial+:**
- Foto de perfil (avatar grande)
- Foto de fachada
- Botão WhatsApp (verde, fixo no mobile)
- Botão Google Maps
- Galeria de fotos

**Profissional+:**
- Descrição completa
- Links Instagram e Facebook
- Seção "Promoção do Mês" (se houver promoção ativa)
- Badge "Empresa em Foco"

#### `/segmentacao/[slug]` — Listagem por Segmentação

- Mesma lógica da listagem principal, filtrada pela segmentação

### Dashboard do Empresário — `/minha-empresa`

| Rota | Funcionalidade |
|---|---|
| `/minha-empresa` | Visão geral — preview do perfil público + status do plano |
| `/minha-empresa/editar` | Editar todos os dados da empresa |
| `/minha-empresa/fotos` | Upload e gerenciamento de galeria (drag & drop para ordenar) |
| `/minha-empresa/plano` | Ver plano atual, data de renovação, botão upgrade |
| `/minha-empresa/promocao` | Cadastrar promoção do mês (apenas Profissional) |

---

## 7. MÓDULO: IMÓVEIS

### Páginas

#### `/imoveis` — Listagem com Filtros

**Filtros disponíveis:**
- Tipo de imóvel (select — todos os `TipoImovel`)
- Tipo de negócio (Venda / Aluguel / Temporada)
- Localização / Bairro
- Faixa de preço (slider ou campos min/max)
- Número de quartos (0, 1, 2, 3, 4+)
- Código do imóvel (busca direta)

**Layout:**
- Grid de cards com: foto capa, título, tipo, localização, preço, quartos/banheiros/vagas
- Ordenação: Mais recentes | Menor preço | Maior preço | Destaque
- Paginação (20 por página)
- Imóveis destaque no topo

#### `/imoveis/[codigo]` — Detalhe do Imóvel

- Galeria de fotos (carrossel + lightbox)
- Título, tipo, código
- Preço em destaque
- Mapa Google Maps embedado (se coordenadas disponíveis)
- Tabela de características detalhadas
- Descrição completa
- Bloco de contato: telefone, WhatsApp, e-mail do anunciante
- CRECI do corretor (se informado)
- Compartilhar (WhatsApp, Facebook, copiar link)
- "Ver mais imóveis deste anunciante"

### Formulário de Cadastro de Imóvel — `/meus-imoveis/novo`

Formulário multi-step (5 etapas):

**Step 1 — Classificação**
- Tipo de imóvel (select completo)
- Finalidade (Residencial / Comercial / Rural / Misto)
- Tipo de negócio (Venda / Aluguel / Temporada Diária / Temporada Mensal)
- Título do anúncio *

**Step 2 — Localização**
- CEP (auto-preenche via ViaCEP)
- Logradouro / Rua
- Número
- Complemento
- Bairro (select com bairros de Ilicínea + campo "Outro")
- Cidade
- Estado
- Latitude e Longitude (opcional, com botão "Buscar no mapa")
- Link Google Maps (opcional)

**Step 3 — Valores**
- Preço (R$) + checkbox "Preço a negociar"
- Condomínio (R$) — para apartamentos/condomínios
- IPTU anual (R$)
- Caução (para aluguel — nº de meses)
- Preço por diária / Preço por mês (para temporada)

**Step 4 — Características**

*Características gerais (todos os tipos):*
- Área total (m²)
- Área construída (m²)
- Área do terreno (m²)

*Residencial:*
- Quartos, Suítes, Banheiros, Vagas de garagem
- Andares (para sobrados/prédios)
- Checkboxes: Sala | Cozinha | Área de serviço | Varanda | Quintal | Piscina | Churrasqueira | Portão elétrico | Cerca elétrica | Câmera de segurança | Alarme | Aquecedor de água | Ar condicionado
- Mobília: Não mobiliado / Semi-mobiliado / Mobiliado
- Animais permitidos (para aluguel)
- Posição solar (Nascente / Poente / Misto)

*Rural (Fazenda, Sítio, Chácara, Gleba):*
- Área em hectares
- Checkboxes: Água encanada | Energia elétrica | Escritura | Georreferenciado | Cadastro Rural (ITR)
- Tipo de solo
- Uso agrícola (texto livre)
- Benfeitorias (textarea)

*Comercial/Industrial:*
- WC
- Pé-direito (m)
- Mezanino
- Trifásico (energia)

**Step 5 — Fotos & Descrição**
- Descrição completa (textarea rich text)
- Upload de fotos (mín. 1, máx. 20)
  - Primeira foto = foto capa (drag para reordenar)
  - Cada foto com campo "Alt text"
- URL de vídeo (YouTube, opcional)
- URL Tour Virtual (Matterport ou similar, opcional)
- Dados de contato do anunciante:
  - Nome para exibição *
  - Telefone
  - WhatsApp
  - E-mail
  - CRECI (opcional)

**Geração automática de código:** `IL-[ANO]-[SEQUENCIAL]` ex: `IL-2026-001`

### Dashboard do Anunciante — `/meus-imoveis`

- Lista de imóveis cadastrados com status (Pendente / Ativo / Vendido / Inativo)
- Botão "Marcar como Vendido/Alugado"
- Botão "Desativar anúncio"
- Visualizações por anúncio
- Botão "Editar"
- Botão "Excluir" (com confirmação)

---

## 8. MÓDULO: NOTÍCIAS

### Páginas

#### `/noticias` — Listagem

- Notícia destaque (hero com imagem grande)
- Grid de notícias recentes
- Filtro por categoria (pills)
- Busca por texto

#### `/noticias/[slug]` — Artigo

- Imagem de capa (full-width)
- Título, subtítulo, data, autor, fonte
- Local do evento
- Corpo do artigo (rich text)
- Tags
- Compartilhar (WhatsApp, Facebook, copiar link)
- "Outras notícias" (relacionadas por categoria)

### Campos do Cadastro de Notícias (Admin)

| Campo | Tipo | Obrigatório |
|---|---|---|
| Título | Texto | ✅ |
| Subtítulo | Texto | ❌ |
| Slug | Auto-gerado (editável) | ✅ |
| Imagem de capa | Upload | ✅ |
| Alt da imagem | Texto | ✅ |
| Resumo (para cards/SEO) | Textarea (máx 300) | ✅ |
| Conteúdo completo | Rich Text Editor | ✅ |
| Nome do autor | Texto | ✅ |
| Fonte da notícia | Texto | ❌ |
| Link da fonte | URL | ❌ |
| Categorias | Multi-select (Esportes, Cultura, Política, Saúde, Educação, Segurança, Eventos, Geral) | ✅ |
| Tags | Tags livres | ❌ |
| Local do evento | Texto | ❌ |
| Data do evento | Date picker | ❌ |
| Meta título (SEO) | Texto | ❌ |
| Meta descrição (SEO) | Textarea | ❌ |
| Status | Rascunho / Publicado | ✅ |
| Data de publicação | DateTime (agendamento) | ✅ |
| Destaque | Toggle | ❌ |
| Fixar na home | Toggle | ❌ |
| Enviar newsletter | Toggle (dispara e-mail aos inscritos ao publicar) | ❌ |

---

## 9. MÓDULO: TURISMO

### Páginas

#### `/turismo` — Listagem

- Hero com imagem da cidade
- Filtro por categoria (Natureza, Religioso, Histórico, Cultural, Esporte/Aventura)
- Grid de pontos turísticos com cards

#### `/turismo/[slug]` — Detalhe

- Galeria de fotos (carrossel)
- Nome, categoria, dificuldade, distância do centro
- Descrição completa
- Informações práticas (horário, entrada, acessibilidade)
- Mapa embedado
- "Como chegar" com instruções
- Dicas importantes (box destacado)
- Compartilhar

### Campos do Cadastro de Turismo (Admin)

| Campo | Tipo | Obrigatório |
|---|---|---|
| Nome | Texto | ✅ |
| Subtítulo | Texto | ❌ |
| Slug | Auto-gerado (editável) | ✅ |
| Categoria | Select (CategoriaTurismo) | ✅ |
| Imagem de capa | Upload | ✅ |
| Alt da imagem | Texto | ✅ |
| Galeria de fotos | Multi-upload (máx 10) | ❌ |
| Resumo | Textarea (máx 300) | ✅ |
| Descrição completa | Rich Text Editor | ✅ |
| Endereço / Referência | Texto | ❌ |
| Bairro / Localidade | Texto | ❌ |
| Latitude | Float | ❌ |
| Longitude | Float | ❌ |
| Link Google Maps | URL | ❌ |
| Como chegar | Textarea | ❌ |
| Distância do centro | Float (km) | ❌ |
| Dificuldade de acesso | Select (Fácil / Moderado / Difícil) | ❌ |
| Tempo de duração da visita | Texto livre | ❌ |
| Melhor época para visitar | Texto livre | ❌ |
| Horário de funcionamento | Texto livre | ❌ |
| Entrada gratuita | Toggle | ✅ |
| Preço da entrada | Float | ❌ |
| Acessível para PCD | Toggle | ✅ |
| Telefone de contato | Texto | ❌ |
| Instagram | URL | ❌ |
| Site | URL | ❌ |
| Dicas importantes | Textarea | ❌ |
| URL do vídeo | URL (YouTube) | ❌ |
| Meta título (SEO) | Texto | ❌ |
| Meta descrição (SEO) | Textarea | ❌ |
| Tags | Tags livres | ❌ |
| Status | Rascunho / Publicado | ✅ |
| Data de publicação | DateTime | ✅ |
| Destaque | Toggle | ❌ |
| Fixar na home | Toggle | ❌ |

---

## 10. EDITOR RICH TEXT — TIPTAP

### Visão Geral

O TipTap (open source, baseado em ProseMirror) é o editor rich text usado em **três módulos**:

| Módulo | Uso | Upload de imagem no editor |
|---|---|---|
| Notícias | Corpo completo do artigo | ✅ Sim |
| Turismo | Descrição + Como Chegar + Dicas | ✅ Sim |
| Imóveis | Descrição do imóvel | ❌ Não (fotos via upload separado) |

### Instalação

```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit
# Extensões adicionais
npm install @tiptap/extension-image
npm install @tiptap/extension-link
npm install @tiptap/extension-placeholder
npm install @tiptap/extension-character-count
npm install @tiptap/extension-underline
npm install @tiptap/extension-text-align
npm install @tiptap/extension-color
npm install @tiptap/extension-highlight
npm install @tiptap/extension-youtube
```

### Componente Base — `components/editor/RichTextEditor.tsx`

```tsx
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Youtube from '@tiptap/extension-youtube'
import EditorToolbar from './EditorToolbar'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
  enableImageUpload?: boolean  // controla se o botão de imagem aparece
  minHeight?: string
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Escreva aqui...',
  enableImageUpload = false,
  minHeight = '300px',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
      ...(enableImageUpload
        ? [Image.configure({ HTMLAttributes: { class: 'rounded-lg max-w-full' } })]
        : []),
      Youtube.configure({ controls: false }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none p-4',
        style: `min-height: ${minHeight}`,
      },
    },
  })

  return (
    <div className="border border-[#E5E5E5] rounded-lg overflow-hidden">
      <EditorToolbar editor={editor} enableImageUpload={enableImageUpload} />
      <EditorContent editor={editor} />
    </div>
  )
}
```

### Toolbar — `components/editor/EditorToolbar.tsx`

A toolbar deve conter os seguintes botões, agrupados visualmente:

**Grupo 1 — Texto:**
- Negrito (B)
- Itálico (I)
- Sublinhado (U)
- Tachado (S)

**Grupo 2 — Títulos:**
- H1, H2, H3

**Grupo 3 — Listas:**
- Lista não ordenada (•)
- Lista ordenada (1.)
- Blockquote (")

**Grupo 4 — Alinhamento:**
- Esquerda, Centro, Direita, Justificado

**Grupo 5 — Mídia (apenas quando `enableImageUpload = true`):**
- Inserir imagem (abre modal de upload)
- Inserir link de vídeo YouTube

**Grupo 6 — Links:**
- Inserir/editar link (abre popover com URL)

**Grupo 7 — Utilitários:**
- Desfazer / Refazer
- Limpar formatação

### Upload de Imagem no Editor

Quando `enableImageUpload = true` (Notícias e Turismo), o botão "Inserir imagem" abre um **modal** com duas abas:

**Aba 1 — Upload:**
- Input file (aceita: `image/jpeg, image/png, image/webp, image/gif`)
- Tamanho máximo: 5MB
- Faz upload via UploadThing
- Ao completar → insere a URL no editor via `editor.chain().focus().setImage({ src: url }).run()`

**Aba 2 — URL externa:**
- Campo de texto com URL da imagem
- Botão "Inserir"

```tsx
// Exemplo de handler de upload no editor
const handleImageUpload = async (file: File) => {
  // Upload via UploadThing endpoint dedicado
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/upload/editor-image', { method: 'POST', body: formData })
  const { url } = await res.json()
  editor?.chain().focus().setImage({ src: url, alt: file.name }).run()
}
```

### Endpoint de Upload para o Editor

```
POST /api/upload/editor-image
- Autenticado (apenas ADMIN pode fazer upload em notícias/turismo)
- Aceita: multipart/form-data com campo "file"
- Retorna: { url: string }
- Salva via UploadThing
```

### Uso por Módulo

**Notícias (Admin) — campo `conteudo`:**
```tsx
<RichTextEditor
  content={form.conteudo}
  onChange={(html) => form.setValue('conteudo', html)}
  placeholder="Escreva o corpo completo da notícia..."
  enableImageUpload={true}
  minHeight="500px"
/>
```

**Turismo (Admin) — campo `descricao`:**
```tsx
<RichTextEditor
  content={form.descricao}
  onChange={(html) => form.setValue('descricao', html)}
  placeholder="Descreva o ponto turístico em detalhes..."
  enableImageUpload={true}
  minHeight="400px"
/>
```

**Turismo (Admin) — campo `comoChegar` e `dicasImportantes`:**
```tsx
<RichTextEditor
  content={form.comoChegar}
  onChange={(html) => form.setValue('comoChegar', html)}
  placeholder="Descreva como o visitante chega ao local..."
  enableImageUpload={false}  // sem upload aqui, só texto
  minHeight="200px"
/>
```

**Imóveis (Anunciante) — campo `descricao`:**
```tsx
<RichTextEditor
  content={form.descricao}
  onChange={(html) => form.setValue('descricao', html)}
  placeholder="Descreva o imóvel com detalhes relevantes para o comprador..."
  enableImageUpload={false}  // fotos via galeria separada
  minHeight="300px"
/>
```

### Renderização do Conteúdo nas Páginas Públicas

O conteúdo salvo é HTML. Para renderizar com estilos corretos:

```tsx
// components/editor/RichTextDisplay.tsx
import DOMPurify from 'isomorphic-dompurify'

interface Props {
  html: string
  className?: string
}

export default function RichTextDisplay({ html, className }: Props) {
  const clean = DOMPurify.sanitize(html)
  return (
    <div
      className={`prose prose-lg max-w-none
        prose-headings:text-[#111111] prose-headings:font-bold
        prose-a:text-[#F5820A] prose-a:no-underline hover:prose-a:underline
        prose-img:rounded-lg prose-img:shadow-md
        prose-blockquote:border-l-[#F5820A] prose-blockquote:text-[#444444]
        ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}
```

```bash
npm install isomorphic-dompurify
npm install @types/dompurify
```

### Dependência adicional no schema Prisma

Os campos que armazenam conteúdo TipTap já estão como `@db.Text` no schema — nenhuma alteração necessária.

---

## 11. SISTEMA DE E-MAILS (RESEND)



### Configuração

```typescript
// lib/resend.ts
import { Resend } from 'resend';
export const resend = new Resend(process.env.RESEND_API_KEY);
```

### Templates de E-mail (React Email)

Todos os templates devem ser criados via **Google Stitch MCP** para geração do design visual, depois convertidos para componentes React Email.

| Template | Gatilho |
|---|---|
| `WelcomeEmail` | Cadastro de novo usuário |
| `VerificacaoEmail` | Verificação de e-mail |
| `RecuperarSenhaEmail` | Solicitação de recuperação de senha |
| `PlanoAtivadoEmail` | Pagamento aprovado / plano ativado |
| `PlanoCanceladoEmail` | Cancelamento de assinatura Stripe |
| `PlanoExpirandoEmail` | 7 dias antes do vencimento |
| `ImovelAprovadoEmail` | Imóvel aprovado pelo admin |
| `ImovelRejeitadoEmail` | Imóvel rejeitado (com motivo) |
| `NoticiaNewsletter` | Nova notícia publicada com toggle newsletter |
| `EmpresaAprovadaEmail` | Empresa aprovada pelo admin |
| `ContatoEmpresaEmail` | Formulário de contato via perfil da empresa |

### Exemplo de uso

```typescript
// Envio de welcome email
await resend.emails.send({
  from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
  to: user.email,
  subject: 'Bem-vindo ao Ilicínea.com!',
  react: WelcomeEmail({ nome: user.name }),
});
```

---

## 12. PAINEL ADMINISTRATIVO

### Rota: `/admin` (protegida por role `ADMIN`)

#### Dashboard
- Total de empresas por plano
- Total de imóveis por status
- Total de usuários
- Newsletter inscritos
- Últimas ações (feed de atividades)

#### Gestão de Empresas — `/admin/comercios`
- Tabela: Nome | Plano | Status | Data cadastro | Ações
- Ação: Aprovar empresa
- Ação: Editar qualquer campo
- Ação: Forçar upgrade/downgrade de plano
- Ação: Desativar empresa
- Ação: Marcar como destaque na home

#### Gestão de Imóveis — `/admin/imoveis`
- Tabela: Código | Título | Tipo | Negócio | Anunciante | Status | Ações
- Ação: Aprovar imóvel (status Pendente → Ativo)
- Ação: Rejeitar com motivo (envia e-mail ao anunciante)
- Ação: Editar
- Ação: Marcar destaque

#### Gestão de Notícias — `/admin/noticias`
- CRUD completo com rich text editor
- Agendamento de publicação
- Toggle destaque / fixar home
- Toggle enviar newsletter

#### Gestão de Turismo — `/admin/turismo`
- CRUD completo com rich text editor
- Upload de galeria

#### Gestão de Usuários — `/admin/usuarios`
- Tabela: Nome | E-mail | Role | Data | Ações
- Alterar role
- Bloquear/desbloquear conta

#### Newsletter — `/admin/newsletter`
- Lista de inscritos
- Exportar CSV
- Enviar newsletter manual (com seleção de notícia)

---

## 13. SEO & PERFORMANCE

### Por Módulo

| Página | Estratégia |
|---|---|
| Home | Static Generation (ISR 1h) |
| Listagem Comércios | SSR com cache |
| Perfil Empresa | ISR por slug |
| Listagem Imóveis | SSR (filtros dinâmicos) |
| Detalhe Imóvel | ISR por codigo |
| Notícias lista | ISR 30min |
| Notícia detalhe | ISR por slug |
| Turismo lista | ISR 1h |
| Turismo detalhe | ISR por slug |

### Metadados Dinâmicos

Cada página deve exportar `generateMetadata()` com:
- `title`
- `description`
- `openGraph` (imagem, título, descrição)
- `twitter:card`
- URL canônica

### Schema.org (JSON-LD)

- Empresas: `LocalBusiness`
- Imóveis: `RealEstateListing`
- Notícias: `NewsArticle`
- Turismo: `TouristAttraction`

### Sitemap

`/sitemap.xml` gerado dinamicamente via `app/sitemap.ts` incluindo todas as páginas públicas.

---

## 14. UI/UX — GOOGLE STITCH MCP

**Regra obrigatória:** Toda página nova deve ter seu design gerado via Google Stitch MCP antes de qualquer código ser escrito.

### Páginas para geração no Stitch

1. **Home** — Hero + seções de módulos + newsletter
2. **Listagem de Comércios** — segmentações + cards por plano
3. **Perfil de Empresa** — 3 versões (Gratuito / Essencial / Profissional)
4. **Listagem de Imóveis** — filtros + grid de cards
5. **Detalhe de Imóvel** — galeria + características + contato
6. **Listagem de Notícias** — hero destaque + grid
7. **Artigo de Notícia** — layout editorial
8. **Listagem de Turismo** — grid com categorias
9. **Detalhe Turismo** — galeria + mapa + info prática
10. **Login** — card centralizado
11. **Cadastro** — multi-step wizard
12. **Dashboard Empresário** — overview + menu
13. **Formulário de Imóvel** — multi-step wizard
14. **Painel Admin** — tabelas + dashboard
15. **Templates de E-mail** — via Stitch para design, convertidos para React Email

### Paleta de Cores e Identidade

A paleta é extraída diretamente da logo oficial do Ilicínea.com:

```
Logo:  Pin de localização LARANJA + olho branco/preto + sorriso vermelho
       Texto "Ilicínea.com" em PRETO sólido, tipografia bold
```

```css
/* ============================================
   PALETA OFICIAL — ILICINEA.COM
   Baseada na logo (pin laranja + texto preto)
   ============================================ */

/* Primária — Laranja do pin */
--cor-primaria:        #F5820A;   /* laranja vibrante principal */
--cor-primaria-hover:  #D96E00;   /* laranja escurecido para hover */
--cor-primaria-light:  #FEF0DC;   /* laranja claro para backgrounds suaves */
--cor-primaria-dark:   #B35A00;   /* laranja profundo para contraste */

/* Secundária — Preto do texto da logo */
--cor-texto:           #111111;   /* preto quase puro — texto principal */
--cor-texto-suave:     #444444;   /* cinza escuro — texto secundário */
--cor-texto-muted:     #888888;   /* cinza médio — labels, captions */

/* Acento — Vermelho do sorriso (uso pontual) */
--cor-acento:          #E8263A;   /* vermelho — badges, alertas, destaque */
--cor-acento-light:    #FDE8EA;   /* vermelho claro — background de badges */

/* Neutros — Brancos e cinzas */
--cor-fundo:           #FFFFFF;   /* fundo das páginas */
--cor-fundo-suave:     #F8F8F8;   /* fundo de seções alternadas */
--cor-fundo-card:      #FFFFFF;   /* fundo dos cards */
--cor-borda:           #E5E5E5;   /* bordas suaves */
--cor-borda-forte:     #CCCCCC;   /* bordas com mais contraste */

/* Planos do Guia Comercial */
--cor-plano-gratuito:      #888888;   /* cinza — Presença Básica */
--cor-plano-essencial:     #F5820A;   /* laranja — Destaque Local (= primária) */
--cor-plano-profissional:  #111111;   /* preto — Empresa em Foco (premium) */

/* Status / Sistema */
--cor-sucesso:         #16A34A;   /* verde — aprovado, ativo */
--cor-aviso:           #F59E0B;   /* amarelo — pendente, atenção */
--cor-erro:            #DC2626;   /* vermelho — erro, rejeitado */
--cor-info:            #2563EB;   /* azul — informativo */

/* WhatsApp (botão recorrente no site) */
--cor-whatsapp:        #25D366;
--cor-whatsapp-hover:  #1EBE5A;
```

**Tipografia:**
```css
/* Fonte principal — bold e legível como na logo */
font-family: 'Inter', 'Poppins', sans-serif;

/* Hierarquia */
--font-display:   700;   /* títulos de seção, nome de empresa */
--font-heading:   600;   /* h2, h3 */
--font-body:      400;   /* texto corrido */
--font-label:     500;   /* labels, badges, botões */
```

**Uso prático:**
- **CTA principal** (Comprar plano, Ver empresa): fundo `--cor-primaria` + texto branco
- **Header:** fundo branco ou `#111111` (dark mode opcional) + logo
- **Cards de empresa Profissional:** borda `--cor-primaria` + badge preto
- **Cards Essencial:** borda `--cor-primaria-light` + badge laranja
- **Cards Gratuito:** sem borda colorida, cinza sutil
- **Botão WhatsApp:** sempre `--cor-whatsapp`
- **Badges de status:** background `--cor-*-light` + texto colorido correspondente

---

## 15. FASES DE DESENVOLVIMENTO

### Fase 1 — Fundação (Semana 1-2)
- [ ] Setup projeto Next.js 14 + TypeScript
- [ ] Configuração Docker Compose (app + db)
- [ ] Prisma schema completo + migrations
- [ ] NextAuth v5 (login, cadastro, recuperação de senha)
- [ ] Layout base: Header, Footer, navegação mobile
- [ ] `.env.example` completo

### Fase 2 — Guia Comercial (Semana 3-4)
- [ ] Google Stitch MCP: gerar designs das páginas do guia
- [ ] Página de cadastro multi-step (Comerciante)
- [ ] Stripe: produtos, webhooks, subscription
- [ ] CRUD de empresa (dashboard do comerciante)
- [ ] Listagem de comércios com segmentações
- [ ] Perfil público da empresa (renderização por plano)
- [ ] Galeria de fotos (UploadThing)
- [ ] Sistema de promoção do mês
- [ ] Admin: aprovação e gestão de empresas

### Fase 3 — Imóveis (Semana 5-6)
- [ ] Google Stitch MCP: gerar designs de imóveis
- [ ] Formulário multi-step de cadastro de imóvel
- [ ] Sistema de upload de até 20 fotos + reordenação
- [ ] Geração automática de código (IL-2026-001)
- [ ] Listagem com filtros avançados
- [ ] Página de detalhe com galeria lightbox
- [ ] Google Maps embed
- [ ] Dashboard do anunciante
- [ ] Admin: aprovação/rejeição com e-mail

### Fase 4 — Notícias & Turismo (Semana 7)
- [ ] Google Stitch MCP: gerar designs editoriais
- [ ] Instalação e configuração do TipTap (todas as extensões necessárias)
- [ ] Componente `RichTextEditor` com toolbar completa
- [ ] Componente `RichTextDisplay` com DOMPurify para renderização segura
- [ ] Upload de imagem no editor (Notícias e Turismo) via modal + UploadThing
- [ ] CRUD de notícias (admin) com TipTap
- [ ] CRUD de turismo (admin) com TipTap
- [ ] Páginas públicas de listagem e detalhe
- [ ] Sistema de agendamento de publicação

### Fase 5 — E-mails, Newsletter & Finalização (Semana 8)
- [ ] Google Stitch MCP: designs dos e-mails
- [ ] Todos os templates React Email
- [ ] Resend: envio de todos os e-mails transacionais
- [ ] Sistema de newsletter (inscrição + envio)
- [ ] SEO: generateMetadata, sitemap.xml, JSON-LD
- [ ] ISR e cache de páginas
- [ ] Push final para GitHub
- [ ] Deploy em produção

---

## 16. CLAUDE.md PARA AGENTES

```markdown
# CLAUDE.md — ilicinea.com

## REPOSITÓRIO
https://github.com/guilherme-ufscar/ilicinea

## REGRA OBRIGATÓRIA — ANTES DE QUALQUER FRONTEND
Antes de escrever qualquer código de interface, use o Google Stitch MCP
para gerar o design da página. Só após aprovação do design escreva o código.

## STACK
- Next.js 14 (App Router) + TypeScript
- Prisma + PostgreSQL (via Docker, porta interna)
- NextAuth v5
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

## TIPTAP — EDITOR RICH TEXT
- Usado em: Notícias (admin), Turismo (admin), Imóveis (anunciante)
- Upload de imagem NO editor: apenas Notícias e Turismo (enableImageUpload=true)
- Imóveis: TipTap sem upload (fotos via galeria separada)
- Componentes: RichTextEditor.tsx + EditorToolbar.tsx
- Renderização pública: RichTextDisplay.tsx com DOMPurify
- Upload de imagem no editor: POST /api/upload/editor-image (UploadThing)

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
docker-compose down
```

---

*Escopo elaborado por Coder Master — codermaster.com.br*  
*Versão 1.0 — Abril/2026*
