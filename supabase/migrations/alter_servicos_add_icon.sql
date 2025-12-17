-- Add icon class to services for frontend rendering
ALTER TABLE servicos
  ADD COLUMN IF NOT EXISTS icon_class VARCHAR(64);

CREATE INDEX IF NOT EXISTS idx_servicos_icon_class ON servicos(icon_class);
