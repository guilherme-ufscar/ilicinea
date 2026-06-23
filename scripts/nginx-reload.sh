#!/bin/bash
set -e

echo "Testando configuração do nginx..."
nginx -t

echo "Recarregando nginx..."
nginx -s reload

echo "Nginx recarregado com sucesso."
