#!/bin/sh
set -e

# Mescla os estáticos deste build no volume persistente, SEM apagar os
# chunks de deploys anteriores. Garante que usuários com HTML antigo em
# cache ainda consigam baixar seus chunks (evita ChunkLoadError / 404).
echo "Sincronizando estáticos do Next.js (preservando chunks antigos)..."
mkdir -p /app/.next/static
if [ -d /app/.next/static-build ]; then
  # cp -r (sem -n: o cp do BusyBox/Alpine nao suporta -n). Como os nomes
  # dos chunks sao hasheados, sobrescrever arquivos identicos e inofensivo;
  # os chunks de deploys antigos que nao estao na origem sao PRESERVADOS.
  cp -r /app/.next/static-build/. /app/.next/static/
  echo "Estaticos sincronizados:"
  ls /app/.next/static/chunks | head -n 3
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
