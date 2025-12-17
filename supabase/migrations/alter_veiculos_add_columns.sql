-- Add columns to support admin data and blindado flag
ALTER TABLE veiculos
  ADD COLUMN IF NOT EXISTS marca VARCHAR(100),
  ADD COLUMN IF NOT EXISTS ano INTEGER CHECK (ano >= 1900 AND ano <= EXTRACT(YEAR FROM NOW()) + 1),
  ADD COLUMN IF NOT EXISTS blindado BOOLEAN DEFAULT false;

-- Optional indexes for common queries
CREATE INDEX IF NOT EXISTS idx_veiculos_marca ON veiculos(marca);
CREATE INDEX IF NOT EXISTS idx_veiculos_ano ON veiculos(ano);
CREATE INDEX IF NOT EXISTS idx_veiculos_blindado ON veiculos(blindado);
