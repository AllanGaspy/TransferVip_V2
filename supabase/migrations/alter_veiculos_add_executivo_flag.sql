ALTER TABLE veiculos
  ADD COLUMN IF NOT EXISTS executivo BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_veiculos_executivo_ativo ON veiculos(executivo, ativo);
