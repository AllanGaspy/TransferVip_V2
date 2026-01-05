-- Add manual ordering column to veiculos
ALTER TABLE public.veiculos
  ADD COLUMN IF NOT EXISTS ordem INTEGER DEFAULT 0;

-- Optional index to speed ordering queries
CREATE INDEX IF NOT EXISTS idx_veiculos_ordem ON public.veiculos(ordem);

-- Ensure updated_at is touched on updates (if a trigger exists elsewhere, skip)
-- No-op here; rely on existing app logic

