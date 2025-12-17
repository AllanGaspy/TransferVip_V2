-- Add multilingual names for services
ALTER TABLE servicos
  ADD COLUMN IF NOT EXISTS nome_pt VARCHAR(200),
  ADD COLUMN IF NOT EXISTS nome_en VARCHAR(200),
  ADD COLUMN IF NOT EXISTS nome_es VARCHAR(200);

CREATE INDEX IF NOT EXISTS idx_servicos_nome_pt ON servicos(nome_pt);
CREATE INDEX IF NOT EXISTS idx_servicos_nome_en ON servicos(nome_en);
CREATE INDEX IF NOT EXISTS idx_servicos_nome_es ON servicos(nome_es);
