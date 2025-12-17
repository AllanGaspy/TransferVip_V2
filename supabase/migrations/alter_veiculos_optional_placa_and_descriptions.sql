-- Make placa optional and add multilingual descriptions
ALTER TABLE veiculos
  ALTER COLUMN placa DROP NOT NULL;

ALTER TABLE veiculos
  ADD COLUMN IF NOT EXISTS descricao_pt TEXT,
  ADD COLUMN IF NOT EXISTS descricao_en TEXT,
  ADD COLUMN IF NOT EXISTS descricao_es TEXT;

-- Index to speed up filters on tipo/ativo which are common in public pages
CREATE INDEX IF NOT EXISTS idx_veiculos_tipo_ativo ON veiculos(tipo, ativo);
