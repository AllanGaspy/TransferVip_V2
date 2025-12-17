import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          email: string
          password_hash: string
          nome: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          nome: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          nome?: string
          created_at?: string
          updated_at?: string
        }
      }
      servicos: {
        Row: {
          id: string
          nome: string
          nome_pt: string | null
          nome_en: string | null
          nome_es: string | null
          descricao: string | null
          descricao_pt: string | null
          descricao_en: string | null
          descricao_es: string | null
          caracteristicas_pt: any | null
          caracteristicas_en: any | null
          caracteristicas_es: any | null
          icon_class: string | null
          preco: number | null
          duracao_minutos: number | null
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          nome_pt?: string | null
          nome_en?: string | null
          nome_es?: string | null
          descricao?: string | null
          descricao_pt?: string | null
          descricao_en?: string | null
          descricao_es?: string | null
          caracteristicas_pt?: any | null
          caracteristicas_en?: any | null
          caracteristicas_es?: any | null
          icon_class?: string | null
          preco?: number | null
          duracao_minutos?: number | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          nome_pt?: string | null
          nome_en?: string | null
          nome_es?: string | null
          descricao?: string | null
          descricao_pt?: string | null
          descricao_en?: string | null
          descricao_es?: string | null
          caracteristicas_pt?: any | null
          caracteristicas_en?: any | null
          caracteristicas_es?: any | null
          icon_class?: string | null
          preco?: number | null
          duracao_minutos?: number | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      veiculos: {
        Row: {
          id: string
          marca: string | null
          modelo: string
          ano: number | null
          placa: string | null
          capacidade_passageiros: number | null
          tipo: string
          ativo: boolean
          blindado: boolean
          executivo: boolean
          foto_url: string | null
          descricao_pt: string | null
          descricao_en: string | null
          descricao_es: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          marca?: string | null
          modelo: string
          ano?: number | null
          placa?: string | null
          capacidade_passageiros?: number | null
          tipo: string
          ativo?: boolean
          blindado?: boolean
          executivo?: boolean
          foto_url?: string | null
          descricao_pt?: string | null
          descricao_en?: string | null
          descricao_es?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          marca?: string | null
          modelo?: string
          ano?: number | null
          placa?: string | null
          capacidade_passageiros?: number | null
          tipo?: string
          ativo?: boolean
          blindado?: boolean
          executivo?: boolean
          foto_url?: string | null
          descricao_pt?: string | null
          descricao_en?: string | null
          descricao_es?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
