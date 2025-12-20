import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Veiculo } from '../../types/admin'
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2, Search, Users, Calendar } from 'lucide-react'

const VeiculosList: React.FC = () => {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'unavailable' | 'executivo' | 'blindado'>('all')

  useEffect(() => {
    loadVeiculos()
  }, [])

  const loadVeiculos = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('veiculos')
        .select('*')
        .order('modelo', { ascending: true })

      if (error) throw error
      if (data) setVeiculos(data as Veiculo[])
    } catch (error) {
      console.error('Erro ao carregar veículos:', error)
      toast.error('Erro ao carregar veículos')
    } finally {
      setLoading(false)
    }
  }

  const deleteVeiculo = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este veículo?')) return

    try {
      const { error } = await supabase
        .from('veiculos')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Veículo excluído com sucesso!')
      loadVeiculos()
    } catch (error) {
      console.error('Erro ao excluir veículo:', error)
      toast.error('Erro ao excluir veículo')
    }
  }

  const filteredVeiculos = veiculos.filter(veiculo => {
    const term = searchTerm.toLowerCase()
    const matchesSearch = veiculo.modelo.toLowerCase().includes(term) ||
      (veiculo.marca ? veiculo.marca.toLowerCase().includes(term) : false) ||
      (veiculo.placa ? veiculo.placa.toLowerCase().includes(term) : false)

    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'available' && veiculo.ativo) ||
      (filterStatus === 'unavailable' && !veiculo.ativo) ||
      (filterStatus === 'executivo' && veiculo.executivo) ||
      (filterStatus === 'blindado' && veiculo.blindado)

    return matchesSearch && matchesStatus
  })

  const orderMap: Record<string, number> = { sedan: 0, suv: 1, minivan: 2, van: 3, luxo: 4 }
  const sortedVeiculos = filteredVeiculos.slice().sort((a, b) => {
    const oa = orderMap[(a.tipo || '').toLowerCase()] ?? 99
    const ob = orderMap[(b.tipo || '').toLowerCase()] ?? 99
    if (oa !== ob) return oa - ob
    const ca = new Date(a.created_at || 0).getTime()
    const cb = new Date(b.created_at || 0).getTime()
    return cb - ca
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Veículos</h1>
          <p className="text-gray-600">Gerencie a frota de veículos</p>
        </div>
        <Link
          to="/admin/veiculos/novo"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Veículo
        </Link>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar veículos..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'available' | 'unavailable' | 'executivo' | 'blindado')}
          >
            <option value="all">Todos</option>
            <option value="available">Disponíveis</option>
            <option value="unavailable">Indisponíveis</option>
            <option value="executivo">Executivos</option>
            <option value="blindado">Blindados</option>
          </select>
        </div>
      </div>

      {/* Grid de Veículos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedVeiculos.map((veiculo) => (
          <div key={veiculo.id} className="bg-white shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            {veiculo.foto_url && (
              <div className="h-48 bg-gray-200">
                <img
                  src={veiculo.foto_url}
                  alt={`${veiculo.marca} ${veiculo.modelo}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {veiculo.marca} {veiculo.modelo}
                  </h3>
                  <p className="text-sm text-gray-600">{veiculo.ano}</p>
                </div>
                <div className="flex items-center gap-2">
                  {veiculo.executivo && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Executivo</span>
                  )}
                  {veiculo.blindado && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Blindado</span>
                  )}
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    veiculo.ativo
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {veiculo.ativo ? 'Ativo' : 'Indisponível'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Placa:</span>
                  {veiculo.placa || '—'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{veiculo.capacidade_passageiros} passageiros</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{veiculo.tipo.toUpperCase()}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Link
                  to={`/admin/veiculos/${veiculo.id}/editar`}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Link>
                <button
                  onClick={() => deleteVeiculo(veiculo.id)}
                  className="inline-flex items-center justify-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVeiculos.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum veículo encontrado</p>
        </div>
      )}
    </div>
  )
}

export default VeiculosList
