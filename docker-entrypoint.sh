#!/bin/sh
set -e

echo "Aguardando banco de dados..."
until ./node_modules/.bin/prisma db push --skip-generate; do
  echo "Banco indisponível, tentando novamente em 3s..."
  sleep 3
done

echo "Aplicando seed inicial..."
./node_modules/.bin/prisma db seed || true

echo "Iniciando aplicação..."
exec node server.js
