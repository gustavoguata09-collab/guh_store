-- Criar tabela para rastrear visitas ao site
CREATE TABLE IF NOT EXISTS public.site_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visited_at timestamp with time zone DEFAULT now(),
  page_url text,
  user_ip text,
  user_agent text
);

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_site_visits_visited_at ON public.site_visits(visited_at);

-- RLS: Todos podem adicionar visitas
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can track visits" ON public.site_visits;
CREATE POLICY "Anyone can track visits" 
ON public.site_visits FOR INSERT WITH CHECK (true);
