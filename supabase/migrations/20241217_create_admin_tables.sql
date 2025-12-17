-- Tabela de Administradores
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nome VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_admin_users_email ON admin_users(email);

-- Tabela de Serviços
CREATE TABLE servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(200) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL CHECK (preco >= 0),
  duracao_minutos INTEGER NOT NULL CHECK (duracao_minutos > 0),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_servicos_nome ON servicos(nome);
CREATE INDEX idx_servicos_ativo ON servicos(ativo);
CREATE INDEX idx_servicos_preco ON servicos(preco);

-- Tabela de Veículos
CREATE TABLE veiculos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modelo VARCHAR(200) NOT NULL,
  placa VARCHAR(20) UNIQUE NOT NULL,
  capacidade_passageiros INTEGER NOT NULL CHECK (capacidade_passageiros > 0),
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('sedan', 'suv', 'van', 'executivo', 'luxo')),
  ativo BOOLEAN DEFAULT true,
  foto_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_veiculos_modelo ON veiculos(modelo);
CREATE INDEX idx_veiculos_placa ON veiculos(placa);
CREATE INDEX idx_veiculos_tipo ON veiculos(tipo);
CREATE INDEX idx_veiculos_ativo ON veiculos(ativo);

-- Permissões
GRANT ALL PRIVILEGES ON admin_users TO authenticated;
REVOKE ALL PRIVILEGES ON admin_users FROM anon;

GRANT SELECT ON servicos TO anon;
GRANT ALL PRIVILEGES ON servicos TO authenticated;

GRANT SELECT ON veiculos TO anon;
GRANT ALL PRIVILEGES ON veiculos TO authenticated;

-- RLS Policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE veiculos ENABLE ROW LEVEL SECURITY;

-- Admin users policies
CREATE POLICY "Admin users podem ver apenas seu próprio registro" ON admin_users
  FOR SELECT USING (auth.uid() = id);

-- Serviços policies
CREATE POLICY "Qualquer um pode listar serviços ativos" ON servicos
  FOR SELECT USING (ativo = true);

CREATE POLICY "Admin pode listar todos os serviços" ON servicos
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin pode criar serviços" ON servicos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin pode atualizar serviços" ON servicos
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin pode excluir serviços" ON servicos
  FOR DELETE USING (auth.role() = 'authenticated');

-- Veículos policies
CREATE POLICY "Qualquer um pode listar veículos ativos" ON veiculos
  FOR SELECT USING (ativo = true);

CREATE POLICY "Admin pode listar todos os veículos" ON veiculos
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin pode criar veículos" ON veiculos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin pode atualizar veículos" ON veiculos
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin pode excluir veículos" ON veiculos
  FOR DELETE USING (auth.role() = 'authenticated');