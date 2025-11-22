-- ============================================
-- SCRIPT COMPLETO DE CONFIGURAÇÃO DO BANCO
-- Execute este script no Supabase SQL Editor
-- ============================================

-- 1. Criar tabela de categorias
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text DEFAULT 'Package',
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Criar tabela de produtos
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  image_url text,
  affiliate_link text NOT NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Criar tabela de cliques em produtos
CREATE TABLE IF NOT EXISTS public.product_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  clicked_at timestamp with time zone DEFAULT now(),
  user_ip text,
  user_agent text
);

-- 4. Criar tabela de visitas ao site
CREATE TABLE IF NOT EXISTS public.site_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visited_at timestamp with time zone DEFAULT now(),
  page_path text,
  user_ip text,
  user_agent text,
  referrer text
);

-- 5. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_product_clicks_product_id ON public.product_clicks(product_id);
CREATE INDEX IF NOT EXISTS idx_product_clicks_clicked_at ON public.product_clicks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_site_visits_visited_at ON public.site_visits(visited_at);

-- 6. Configurar Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

-- Políticas: Todos podem ler
DROP POLICY IF EXISTS "Enable read access for all" ON public.categories;
CREATE POLICY "Enable read access for all" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable read access for all" ON public.products;
CREATE POLICY "Enable read access for all" ON public.products FOR SELECT USING (true);

-- Políticas: Qualquer um pode registrar cliques e visitas
DROP POLICY IF EXISTS "Enable insert for all" ON public.product_clicks;
CREATE POLICY "Enable insert for all" ON public.product_clicks FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable insert for all" ON public.site_visits;
CREATE POLICY "Enable insert for all" ON public.site_visits FOR INSERT WITH CHECK (true);

-- 7. Inserir categorias de exemplo
INSERT INTO public.categories (name, slug, icon) VALUES
  ('Eletrônicos', 'eletronicos', 'Smartphone'),
  ('Moda', 'moda', 'Shirt'),
  ('Casa & Decoração', 'casa-decoracao', 'Home'),
  ('Beleza', 'beleza', 'Sparkles'),
  ('Esportes', 'esportes', 'Dumbbell'),
  ('Livros', 'livros', 'BookOpen')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- PRONTO! Agora você pode criar produtos
-- ============================================
