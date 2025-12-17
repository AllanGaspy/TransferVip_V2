-- Habilitar RLS nas tabelas
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE veiculos ENABLE ROW LEVEL SECURITY;

-- Permissões básicas
GRANT ALL PRIVILEGES ON admin_users TO authenticated;
GRANT ALL PRIVILEGES ON servicos TO authenticated;
GRANT ALL PRIVILEGES ON veiculos TO authenticated;

-- Permissões de leitura pública para serviços e veículos ativos
GRANT SELECT ON servicos TO anon;
GRANT SELECT ON veiculos TO anon;

-- Revogar permissões de escrita para anônimos
REVOKE ALL PRIVILEGES ON admin_users FROM anon;
REVOKE INSERT, UPDATE, DELETE ON servicos FROM anon;
REVOKE INSERT, UPDATE, DELETE ON veiculos FROM anon;

-- Políticas para admin_users
CREATE POLICY "Admin users podem ver apenas seu próprio registro" ON admin_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin users podem atualizar seu próprio registro" ON admin_users
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para serviços
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

-- Políticas para veículos
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