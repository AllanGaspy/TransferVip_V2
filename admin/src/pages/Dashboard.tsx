import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Servico, Veiculo } from '../types/admin'
import { 
  LayoutDashboard, 
  Briefcase, 
  Car, 
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react'

const Dashboard: React.FC = () => {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Carregar serviços
      const { data: servicosData } = await supabase
        .from('servicos')
        .select('*')
        .order('created_at', { ascending: false })

      // Carregar veículos
      const { data: veiculosData } = await supabase
        .from('veiculos')
        .select('*')
        .order('created_at', { ascending: false })

      if (servicosData) setServicos(servicosData as Servico[])
      if (veiculosData) setVeiculos(veiculosData as Veiculo[])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const servicosAtivos = servicos.filter(s => s.ativo).length
  const veiculosAtivos = veiculos.filter(v => v.ativo).length
  const totalServicos = servicos.length
  const totalVeiculos = veiculos.length

  const cards = [
    {
      name: 'Serviços Ativos',
      value: servicosAtivos,
      total: totalServicos,
      icon: Briefcase,
      color: 'bg-blue-500',
      href: '/admin/servicos'
    },
    {
      name: 'Veículos Ativos',
      value: veiculosAtivos,
      total: totalVeiculos,
      icon: Car,
      color: 'bg-green-500',
      href: '/admin/veiculos'
    },
    {
      name: 'Tempo Médio',
      value: servicos.length > 0 
        ? Math.round(servicos.reduce((acc, s) => acc + (s.duracao_minutos ?? 0), 0) / servicos.length)
        : 0,
      unit: 'min',
      icon: Clock,
      color: 'bg-yellow-500',
      href: '/admin/servicos'
    },
    {
      name: 'Preço Médio',
      value: servicos.length > 0 
        ? Math.round(servicos.reduce((acc, s) => acc + (s.preco ?? 0), 0) / servicos.length)
        : 0,
      unit: 'R$',
      icon: DollarSign,
      color: 'bg-purple-500',
      href: '/admin/servicos'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema Transfer VIP Tour</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <a
            key={card.name}
            href={card.href}
            className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
          >
            <div className="flex items-center">
              <div className={`${card.color} rounded-lg p-3`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{card.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">
                    {card.unit === 'R$' && 'R$ '}{card.value}{card.unit && card.unit !== 'R$' && ` ${card.unit}`}
                  </p>
                  {card.total && (
                    <p className="ml-2 text-sm text-gray-500">/ {card.total}</p>
                  )}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Seções recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Serviços recentes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Serviços Recentes</h2>
            <a href="/admin/servicos" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Ver todos
            </a>
          </div>
          <div className="space-y-3">
            {servicos.slice(0, 5).map((servico) => (
              <div key={servico.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{servico.nome}</p>
                  <p className="text-sm text-gray-600">R$ {servico.preco ?? '—'} • {servico.duracao_minutos != null ? `${servico.duracao_minutos} min` : '—'}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  servico.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {servico.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            ))}
            {servicos.length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhum serviço cadastrado</p>
            )}
          </div>
        </div>

        {/* Veículos recentes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Veículos Recentes</h2>
            <a href="/admin/veiculos" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Ver todos
            </a>
          </div>
          <div className="space-y-3">
            {veiculos.slice(0, 5).map((veiculo) => (
              <div key={veiculo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{veiculo.modelo}</p>
                  <p className="text-sm text-gray-600">{veiculo.placa} • {veiculo.capacidade_passageiros} passageiros</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  veiculo.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {veiculo.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            ))}
            {veiculos.length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhum veículo cadastrado</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
