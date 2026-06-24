#!/bin/sh
set -e

# Mescla os estáticos deste build no volume persistente, SEM apagar os
# chunks de deploys anteriores. Garante que usuários com HTML antigo em
# cache ainda consigam baixar seus chunks (evita ChunkLoadError / 404).
echo "Sincronizando estáticos do Next.js (preservando chunks antigos)..."
mkdir -p /app/.next/static
if [ -d /app/.next/static-build ]; then
  cp -rn /app/.next/static-build/. /app/.next/static/ 2>/dev/null || true
fi

echo "Aguardando banco de dados..."
until ./node_modules/.bin/prisma db push --skip-generate; do
  echo "Banco indisponível, tentando novamente em 3s..."
  sleep 3
done

echo "Aplicando seed inicial..."
./node_modules/.bin/prisma db seed || true

echo "Iniciando aplicação..."
exec node server.js
