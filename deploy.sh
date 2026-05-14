#!/bin/bash
# deploy.sh — Deploy do ilicinea.com
# Uso: bash deploy.sh

set -e

echo "=== Deploy Ilicínea.com ==="
cd /www/wwwroot/ilicineadocker

echo "1. Baixando código mais recente..."
git pull origin master

echo "2. Rebuildando imagem Docker (sem cache)..."
docker-compose build --no-cache app

echo "3. Subindo containers..."
docker-compose up -d

echo "4. Aguardando app iniciar..."
sleep 5

echo "5. Criando/atualizando tabelas do banco..."
docker-compose exec -T app ./node_modules/.bin/prisma db push

echo "6. Rodando seed (dados de exemplo)..."
docker-compose exec -T app ./node_modules/.bin/prisma db seed

echo "7. Verificando containers..."
docker-compose ps

echo "=== Deploy concluído! ==="
echo "Acesse: https://ilicinea.com"
