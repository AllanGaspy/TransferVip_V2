export interface AdminUser {
  id: string
  email: string
  password_hash: string
  nome: string
  created_at: string
  updated_at: string
}

export interface Servico {
  id: string
  nome: string
  nome_pt?: string | null
  nome_en?: string | null
  nome_es?: string | null
  descricao: string | null
  descricao_pt?: string | null
  descricao_en?: string | null
  descricao_es?: string | null
  caracteristicas_pt?: string[] | null
  caracteristicas_en?: string[] | null
  caracteristicas_es?: string[] | null
  icon_class?: string | null
  preco?: number | null
  duracao_minutos?: number | null
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface Veiculo {
  id: string
  marca?: string
  modelo: string
  ano?: number
  placa?: string
  capacidade_passageiros?: number
  tipo: 'sedan' | 'suv' | 'van' | 'minivan' | 'luxo'
  ativo: boolean
  blindado: boolean
  executivo: boolean
  foto_url: string | null
  descricao_pt?: string | null
  descricao_en?: string | null
  descricao_es?: string | null
  created_at: string
  updated_at: string
}

export interface AuthContextType {
  user: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export interface ServicoFormData {
  nome_pt: string
  nome_en: string
  nome_es: string
  descricao_pt: string
  descricao_en: string
  descricao_es: string
  caracteristicas_pt: string
  caracteristicas_en: string
  caracteristicas_es: string
  icon_class?: string
  preco?: number
  duracao_minutos?: number
  ativo: boolean
}

export interface VeiculoFormData {
  modelo: string
  placa: string
  capacidade_passageiros: number
  tipo: 'sedan' | 'suv' | 'van' | 'executivo' | 'luxo'
  ativo: boolean
  foto_url?: string
}
