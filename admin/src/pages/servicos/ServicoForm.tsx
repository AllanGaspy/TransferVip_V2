import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Servico } from '../../types/admin'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Save } from 'lucide-react'

const ServicoForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id

  const [formData, setFormData] = useState({
    nome_pt: '',
    nome_en: '',
    nome_es: '',
    descricao_pt: '',
    descricao_en: '',
    descricao_es: '',
    caracteristicas_pt: '',
    caracteristicas_en: '',
    caracteristicas_es: '',
    icon_class: 'fas fa-briefcase',
    preco: '',
    duracao_minutos: '',
    ativo: true
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEditing) {
      loadServico()
    }
  }, [id, isEditing])

  const loadServico = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (data) {
        setFormData({
          nome_pt: (data.nome_pt ?? data.nome ?? '') as string,
          nome_en: (data.nome_en ?? '') as string,
          nome_es: (data.nome_es ?? '') as string,
          descricao_pt: (data.descricao_pt ?? data.descricao ?? '') as string,
          descricao_en: (data.descricao_en ?? '') as string,
          descricao_es: (data.descricao_es ?? '') as string,
          caracteristicas_pt: Array.isArray(data.caracteristicas_pt) ? (data.caracteristicas_pt as string[]).join('\n') : '',
          caracteristicas_en: Array.isArray(data.caracteristicas_en) ? (data.caracteristicas_en as string[]).join('\n') : '',
          caracteristicas_es: Array.isArray(data.caracteristicas_es) ? (data.caracteristicas_es as string[]).join('\n') : '',
          icon_class: (data.icon_class ?? 'fas fa-briefcase') as string,
          preco: data.preco != null ? String(data.preco) : '',
          duracao_minutos: data.duracao_minutos != null ? String(data.duracao_minutos) : '',
          ativo: data.ativo
        })
      }
    } catch (error) {
      console.error('Erro ao carregar serviço:', error)
      toast.error('Erro ao carregar serviço')
      navigate('/admin/servicos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome_pt.trim()) {
      toast.error('Nome do serviço é obrigatório')
      return
    }
    
    if (formData.preco && parseFloat(formData.preco) <= 0) {
      toast.error('Preço deve ser maior que zero')
      return
    }
    
    if (formData.duracao_minutos && parseInt(formData.duracao_minutos) <= 0) {
      toast.error('Duração deve ser maior que zero')
      return
    }

    try {
      setSaving(true)
      
      const toLines = (text: string) => text.split('\n').map(l => l.trim()).filter(Boolean)
      const servicoData = {
        nome: formData.nome_pt.trim(),
        nome_pt: formData.nome_pt.trim() || null,
        nome_en: formData.nome_en.trim() || null,
        nome_es: formData.nome_es.trim() || null,
        descricao_pt: formData.descricao_pt.trim() || null,
        descricao_en: formData.descricao_en.trim() || null,
        descricao_es: formData.descricao_es.trim() || null,
        caracteristicas_pt: toLines(formData.caracteristicas_pt),
        caracteristicas_en: toLines(formData.caracteristicas_en),
        caracteristicas_es: toLines(formData.caracteristicas_es),
        icon_class: formData.icon_class || null,
        preco: formData.preco ? parseFloat(formData.preco) : null,
        duracao_minutos: formData.duracao_minutos ? parseInt(formData.duracao_minutos) : null,
        ativo: formData.ativo
      }

      if (isEditing) {
        const { error } = await supabase
          .from('servicos')
          .update(servicoData)
          .eq('id', id)

        if (error) throw error
        toast.success('Serviço atualizado com sucesso!')
      } else {
        const { error } = await supabase
          .from('servicos')
          .insert([servicoData])

        if (error) throw error
        toast.success('Serviço criado com sucesso!')
      }

      navigate('/admin/servicos')
    } catch (error) {
      console.error('Erro ao salvar serviço:', error)
      toast.error('Erro ao salvar serviço')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
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
            onClick={() => navigate('/admin/servicos')}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Serviço' : 'Novo Serviço'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Atualize as informações do serviço' : 'Adicione um novo serviço ao sistema'}
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="icon_class" className="block text-sm font-medium text-gray-700 mb-2">
            Ícone do Serviço
          </label>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-vip-gold to-vip-gold-dark rounded-full flex items-center justify-center">
              <i className={`${formData.icon_class} text-white text-2xl`}></i>
            </div>
            <span className="text-sm text-gray-600">Pré-visualização</span>
          </div>
          <select
            id="icon_class"
            name="icon_class"
            value={formData.icon_class}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="fas fa-plane">Avião</option>
            <option value="fas fa-briefcase">Pasta</option>
            <option value="fas fa-glass-cheers">Brinde</option>
            <option value="fas fa-map-marked-alt">Mapa</option>
            <option value="fas fa-shopping-bag">Compras</option>
            <option value="fas fa-handshake">Parceria</option>
            <option value="fas fa-ring">Aliança</option>
            <option value="fas fa-car">Carro</option>
            <option value="fas fa-shield-alt">Escudo</option>
            <option value="fas fa-language">Idioma</option>
            <option value="fas fa-concierge-bell">Concierge</option>
            <option value="fas fa-clock">Relógio</option>
          </select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="nome_pt" className="block text-sm font-medium text-gray-700 mb-2">
              Nome (PT) *
            </label>
            <input
              type="text"
              id="nome_pt"
              name="nome_pt"
              value={formData.nome_pt}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Transfer Aeroporto - Hotel"
              required
            />
          </div>
          <div>
            <label htmlFor="nome_en" className="block text-sm font-medium text-gray-700 mb-2">
              Name (EN)
            </label>
            <input
              type="text"
              id="nome_en"
              name="nome_en"
              value={formData.nome_en}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Airport Transfer - Hotel"
            />
          </div>
          <div>
            <label htmlFor="nome_es" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre (ES)
            </label>
            <input
              type="text"
              id="nome_es"
              name="nome_es"
              value={formData.nome_es}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej.: Transfer Aeropuerto - Hotel"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="descricao_pt" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição (PT)
            </label>
            <textarea
              id="descricao_pt"
              name="descricao_pt"
              rows={3}
              value={formData.descricao_pt}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descrição em português"
            />
          </div>
          <div>
            <label htmlFor="descricao_en" className="block text-sm font-medium text-gray-700 mb-2">
              Description (EN)
            </label>
            <textarea
              id="descricao_en"
              name="descricao_en"
              rows={3}
              value={formData.descricao_en}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Description in English"
            />
          </div>
          <div>
            <label htmlFor="descricao_es" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (ES)
            </label>
            <textarea
              id="descricao_es"
              name="descricao_es"
              rows={3}
              value={formData.descricao_es}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descripción en español"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Características (uma por linha)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <textarea
                id="caracteristicas_pt"
                name="caracteristicas_pt"
                rows={4}
                value={formData.caracteristicas_pt}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="PT: cada linha será um item"
              />
            </div>
            <div>
              <textarea
                id="caracteristicas_en"
                name="caracteristicas_en"
                rows={4}
                value={formData.caracteristicas_en}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="EN: one item per line"
              />
            </div>
            <div>
              <textarea
                id="caracteristicas_es"
                name="caracteristicas_es"
                rows={4}
                value={formData.caracteristicas_es}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="ES: un ítem por línea"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-2">
              Preço (R$) (opcional)
            </label>
            <input
              type="number"
              id="preco"
              name="preco"
              step="0.01"
              min="0.01"
              value={formData.preco}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              
            />
          </div>

          <div>
            <label htmlFor="duracao_minutos" className="block text-sm font-medium text-gray-700 mb-2">
              Duração (minutos) (opcional)
            </label>
            <input
              type="number"
              id="duracao_minutos"
              name="duracao_minutos"
              min="1"
              value={formData.duracao_minutos}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="30"
              
            />
          </div>
        </div>

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
            Serviço ativo
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/admin/servicos')}
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

export default ServicoForm
