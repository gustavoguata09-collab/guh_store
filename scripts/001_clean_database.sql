-- Script para limpar todos os dados de exemplo
-- Remove todos os produtos
DELETE FROM products;

-- Remove todas as categorias
DELETE FROM categories;

-- Reseta os contadores de ID para começar do 1
ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
