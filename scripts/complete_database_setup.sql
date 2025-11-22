-- ====================================
-- SETUP COMPLETO DO BANCO DE DADOS
-- Loja do Guh - PostgreSQL
-- ====================================

-- Limpar tabelas existentes (cuidado em produção!)
DROP TABLE IF EXISTS product_clicks CASCADE;
DROP TABLE IF EXISTS site_visits CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- ====================================
-- 1. TABELA DE CATEGORIAS
-- ====================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT DEFAULT 'Package',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================
-- 2. TABELA DE PRODUTOS
-- ====================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  affiliate_link TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================
-- 3. TABELA DE CLIQUES EM PRODUTOS
-- ====================================
CREATE TABLE product_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  user_ip TEXT,
  user_agent TEXT
);

-- ====================================
-- 4. TABELA DE VISITAS AO SITE
-- ====================================
CREATE TABLE site_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visited_at TIMESTAMPTZ DEFAULT NOW(),
  page_path TEXT,
  user_ip TEXT,
  user_agent TEXT,
  referrer TEXT
);

-- ====================================
-- 5. TABELA DE CONFIGURAÇÕES DO SITE
-- ====================================
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================
-- 6. INSERIR CONFIGURAÇÕES PADRÃO
-- ====================================
INSERT INTO site_settings (key, value) VALUES
  ('site_name', 'Loja do Guh'),
  ('site_logo_url', ''),
  ('site_description', 'Os melhores produtos com os melhores preços'),
  ('banner_image_url', ''),
  ('banner_title', 'Bem-vindo à Loja do Guh'),
  ('banner_subtitle', 'Encontre os melhores produtos aqui'),
  ('about_text', 'Somos uma loja dedicada a oferecer os melhores produtos com ótimos preços.'),
  ('about_owner_photo', ''),
  ('contact_email', ''),
  ('contact_phone', ''),
  ('contact_address', ''),
  ('social_instagram', ''),
  ('social_facebook', ''),
  ('social_whatsapp', ''),
  ('social_tiktok', '');

-- ====================================
-- 7. INSERIR CATEGORIAS DE EXEMPLO
-- ====================================
INSERT INTO categories (name, slug, icon) VALUES
  ('Eletrônicos', 'eletronicos', 'Smartphone'),
  ('Roupas', 'roupas', 'Shirt'),
  ('Casa & Decoração', 'casa-decoracao', 'Home'),
  ('Esportes', 'esportes', 'Dumbbell'),
  ('Beleza', 'beleza', 'Sparkles'),
  ('Livros', 'livros', 'BookOpen');

-- ====================================
-- 8. INSERIR PRODUTOS DE EXEMPLO
-- ====================================
INSERT INTO products (name, description, price, image_url, affiliate_link, category_id)
SELECT 
  'Produto Exemplo ' || (ROW_NUMBER() OVER ()),
  'Descrição do produto de exemplo',
  99.99,
  'https://placeholder.co/400x300',
  'https://exemplo.com/produto',
  c.id
FROM categories c
LIMIT 3;

-- ====================================
-- 9. ÍNDICES PARA PERFORMANCE
-- ====================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_product_clicks_product ON product_clicks(product_id);
CREATE INDEX idx_product_clicks_date ON product_clicks(clicked_at);
CREATE INDEX idx_site_visits_date ON site_visits(visited_at);
CREATE INDEX idx_categories_slug ON categories(slug);

-- ====================================
-- 10. POLÍTICAS RLS (ROW LEVEL SECURITY)
-- ====================================

-- Categorias: Todos podem ler
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categorias são públicas" ON categories FOR SELECT USING (true);

-- Produtos: Todos podem ler
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Produtos são públicos" ON products FOR SELECT USING (true);

-- Configurações: Todos podem ler
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Configurações são públicas" ON site_settings FOR SELECT USING (true);

-- Cliques: Todos podem inserir (para tracking)
ALTER TABLE product_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Qualquer um pode registrar cliques" ON product_clicks FOR INSERT WITH CHECK (true);

-- Visitas: Todos podem inserir (para analytics)
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Qualquer um pode registrar visitas" ON site_visits FOR INSERT WITH CHECK (true);

-- ====================================
-- 11. TRIGGER PARA ATUALIZAR updated_at
-- ====================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ====================================
-- FIM DO SETUP
-- ====================================

-- Verificar se tudo foi criado
SELECT 'Categorias' as tabela, COUNT(*) as registros FROM categories
UNION ALL
SELECT 'Produtos', COUNT(*) FROM products
UNION ALL
SELECT 'Configurações', COUNT(*) FROM site_settings;
