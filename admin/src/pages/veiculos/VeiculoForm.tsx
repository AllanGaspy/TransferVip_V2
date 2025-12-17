import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Veiculo } from '../../types/admin'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Save, Upload } from 'lucide-react'

const VeiculoForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id

  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: '',
    placa: '',
    tipo: 'sedan' as const,
    capacidade_passageiros: '',
    foto_url: '',
    ativo: true,
    blindado: false,
    executivo: false,
    descricao_pt: '',
    descricao_en: '',
    descricao_es: ''
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (isEditing) {
      loadVeiculo()
    }
  }, [id, isEditing])

  const loadVeiculo = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('veiculos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (data) {
        setFormData({
          marca: data.marca || '',
          modelo: data.modelo,
          ano: (data.ano ?? '').toString(),
          placa: data.placa || '',
          tipo: data.tipo,
          capacidade_passageiros: data.capacidade_passageiros.toString(),
          foto_url: data.foto_url || '',
          ativo: data.ativo,
          blindado: !!data.blindado,
          executivo: !!data.executivo,
          descricao_pt: data.descricao_pt || '',
          descricao_en: data.descricao_en || '',
          descricao_es: data.descricao_es || ''
        })
      }
    } catch (error) {
      console.error('Erro ao carregar veículo:', error)
      toast.error('Erro ao carregar veículo')
      navigate('/admin/veiculos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.marca.trim() || !formData.modelo.trim()) {
      toast.error('Marca e modelo são obrigatórios')
      return
    }
    
    if (formData.ano && (parseInt(formData.ano) < 1900 || parseInt(formData.ano) > new Date().getFullYear() + 1)) {
      toast.error('Ano inválido')
      return
    }
    
    // Placa opcional
    
    if (formData.capacidade_passageiros && parseInt(formData.capacidade_passageiros) <= 0) {
      toast.error('Capacidade deve ser maior que zero')
      return
    }

    try {
      setSaving(true)
      
      const veiculoData = {
        marca: formData.marca.trim() || null,
        modelo: formData.modelo.trim(),
        ano: formData.ano ? parseInt(formData.ano) : null,
        placa: formData.placa.trim() ? formData.placa.trim().toUpperCase() : null,
        tipo: formData.tipo,
        capacidade_passageiros: formData.capacidade_passageiros ? parseInt(formData.capacidade_passageiros) : null,
        foto_url: formData.foto_url.trim() || null,
        ativo: formData.ativo,
        blindado: formData.blindado,
        executivo: formData.executivo,
        descricao_pt: formData.descricao_pt.trim() || null,
        descricao_en: formData.descricao_en.trim() || null,
        descricao_es: formData.descricao_es.trim() || null
      }

      if (isEditing) {
        const { error } = await supabase
          .from('veiculos')
          .update(veiculoData)
          .eq('id', id)

        if (error) throw error
        toast.success('Veículo atualizado com sucesso!')
      } else {
        const { error } = await supabase
          .from('veiculos')
          .insert([veiculoData])

        if (error) throw error
        toast.success('Veículo criado com sucesso!')
      }

      navigate('/admin/veiculos')
    } catch (error) {
      console.error('Erro ao salvar veículo:', error)
      toast.error('Erro ao salvar veículo')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `veiculos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('transfervip')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('transfervip')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, foto_url: publicUrl }))
      toast.success('Foto carregada com sucesso!')
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      toast.error('Erro ao fazer upload da foto')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/admin/veiculos')}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Veículo' : 'Novo Veículo'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Atualize as informações do veículo' : 'Adicione um novo veículo à frota'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="marca" className="block text-sm font-medium text-gray-700 mb-2">
              Marca *
            </label>
            <input
              type="text"
              id="marca"
              name="marca"
              value={formData.marca}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Mercedes-Benz"
              required
            />
          </div>

          <div>
            <label htmlFor="modelo" className="block text-sm font-medium text-gray-700 mb-2">
              Modelo *
            </label>
            <input
              type="text"
              id="modelo"
              name="modelo"
              value={formData.modelo}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: S-Class"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ano" className="block text-sm font-medium text-gray-700 mb-2">
              Ano (opcional)
            </label>
            <input
              type="number"
              id="ano"
              name="ano"
              min="1900"
              max={new Date().getFullYear() + 1}
              value={formData.ano}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="2024"
              
            />
          </div>

          <div>
            <label htmlFor="placa" className="block text-sm font-medium text-gray-700 mb-2">
              Placa (opcional)
            </label>
            <input
              type="text"
              id="placa"
              name="placa"
              value={formData.placa}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="ABC-1234"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo *
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="van">Van</option>
              <option value="minivan">Minivan</option>
              <option value="luxo">Luxo</option>
            </select>
          </div>

          <div>
            <label htmlFor="capacidade_passageiros" className="block text-sm font-medium text-gray-700 mb-2">
              Capacidade de Passageiros (opcional)
            </label>
            <input
              type="number"
              id="capacidade_passageiros"
              name="capacidade_passageiros"
              min="1"
              max="50"
              value={formData.capacidade_passageiros}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="4"
              
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="descricao_pt" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição (Português)
            </label>
            <textarea
              id="descricao_pt"
              name="descricao_pt"
              value={formData.descricao_pt}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Pickup blindada com proteção total e robustez."
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="descricao_en" className="block text-sm font-medium text-gray-700 mb-2">
              Description (English)
            </label>
            <textarea
              id="descricao_en"
              name="descricao_en"
              value={formData.descricao_en}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Armored pickup with complete protection and robustness."
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="descricao_es" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (Español)
            </label>
            <textarea
              id="descricao_es"
              name="descricao_es"
              value={formData.descricao_es}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej.: Pickup blindada con protección total y robustez."
              rows={3}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto do Veículo
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="foto-upload"
              disabled={uploading}
            />
            <label
              htmlFor="foto-upload"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Carregando...' : 'Carregar Foto'}
            </label>
            {formData.foto_url && (
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, foto_url: '' }))}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remover foto
              </button>
            )}
          </div>
          {formData.foto_url && (
            <div className="mt-4">
              <img
                src={formData.foto_url}
                alt="Foto do veículo"
                className="h-32 w-32 object-cover rounded-lg border"
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ativo"
              name="ativo"
              checked={formData.ativo}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="ativo" className="ml-2 block text-sm text-gray-900">
              Veículo ativo
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="blindado"
              name="blindado"
              checked={formData.blindado}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="blindado" className="ml-2 block text-sm text-gray-900">
              Blindado
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="executivo"
              name="executivo"
              checked={formData.executivo}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="executivo" className="ml-2 block text-sm text-gray-900">
              Executivo
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/admin/veiculos')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? 'Atualizar' : 'Criar'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default VeiculoForm
