-- Make capacidade_passageiros optional
ALTER TABLE veiculos
  ALTER COLUMN capacidade_passageiros DROP NOT NULL;

-- Update tipo allowed values: replace 'executivo' with 'minivan'
ALTER TABLE veiculos DROP CONSTRAINT IF EXISTS veiculos_tipo_check;
ALTER TABLE veiculos ADD CONSTRAINT veiculos_tipo_check
  CHECK (tipo IN ('sedan', 'suv', 'van', 'minivan', 'luxo'));
