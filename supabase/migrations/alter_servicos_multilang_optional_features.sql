-- Add multilingual descriptions and optional fields to servicos
ALTER TABLE servicos
  ADD COLUMN IF NOT EXISTS descricao_pt TEXT,
  ADD COLUMN IF NOT EXISTS descricao_en TEXT,
  ADD COLUMN IF NOT EXISTS descricao_es TEXT,
  ADD COLUMN IF NOT EXISTS caracteristicas_pt JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS caracteristicas_en JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS caracteristicas_es JSONB DEFAULT '[]'::jsonb;

-- Make price and duration optional
ALTER TABLE servicos
  ALTER COLUMN preco DROP NOT NULL,
  ALTER COLUMN duracao_minutos DROP NOT NULL;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_servicos_ativo_nome ON servicos(ativo, nome);
