-- ============================================
-- ADICIONAR SISTEMA DE ADMINISTRADOR
-- ============================================
-- Este script adiciona a coluna 'role' para diferenciar usuários normais de admins

-- Adicionar coluna role na tabela users
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================
-- CRIAR PRIMEIRO USUÁRIO ADMIN
-- ============================================
-- IMPORTANTE: Altere o email abaixo para o email da dona do site
-- Depois que ela criar a conta, execute este comando para torná-la admin

-- EXEMPLO: Se o email da dona for maria@gmail.com
-- UPDATE users SET role = 'admin' WHERE email = 'maria@gmail.com';

-- ⚠️ POR SEGURANÇA: Este update deve ser feito manualmente após o cadastro
