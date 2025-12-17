import { supabase } from './supabase-client.js'
import { ScrollAnimations } from './main.js'

async function renderServices() {
  const mainGrid = document.querySelector('.services-grid')
  if (!mainGrid) return

  try {
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .eq('ativo', true)
      .order('nome', { ascending: true })

    if (error) throw error

    if (!data || data.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-center">Nenhum serviço cadastrado no painel admin.</p>'
      return
    }

    const cards = data.map((s) => {
      const lang = (localStorage.getItem('lang') || 'pt').toLowerCase()
      const title = lang.startsWith('en') ? (s.nome_en || s.nome_pt || s.nome)
        : lang.startsWith('es') ? (s.nome_es || s.nome_pt || s.nome)
        : (s.nome_pt || s.nome)

      const desc = lang.startsWith('en') ? (s.descricao_en || s.descricao_pt || s.descricao || '')
        : lang.startsWith('es') ? (s.descricao_es || s.descricao_pt || s.descricao || '')
        : (s.descricao_pt || s.descricao || s.descricao_en || s.descricao_es || '')

      const features = (lang.startsWith('en') ? s.caracteristicas_en
        : lang.startsWith('es') ? s.caracteristicas_es
        : s.caracteristicas_pt) || []

      const featuresHtml = Array.isArray(features) && features.length > 0
        ? `
          <div class="space-y-3 mb-6 text-left">
            ${features.map((f) => `
              <div class=\"flex items-start\">
                <i class=\"fas fa-check-circle text-vip-gold mt-1 mr-3 flex-shrink-0\"></i>
                <span class=\"text-sm text-gray-700\">${f}</span>
              </div>
            `).join('')}
          </div>
        `
        : ''

      const durationHtml = s.duracao_minutos != null
        ? `<div class=\"flex items-start\"><i class=\"fas fa-clock text-vip-gold mt-1 mr-3 flex-shrink-0\"></i><span class=\"text-sm text-gray-700\">Duração estimada: ${s.duracao_minutos} min</span></div>`
        : ''

      const priceHtml = s.preco != null
        ? `<div class=\"flex items-start\"><i class=\"fas fa-dollar-sign text-vip-gold mt-1 mr-3 flex-shrink-0\"></i><span class=\"text-sm text-gray-700\">Preço: R$ ${Number(s.preco).toFixed(2)}</span></div>`
        : ''

      return `
        <div class="premium-card text-center animate-on-scroll">
          <div class="w-20 h-20 bg-gradient-to-br from-vip-gold to-vip-gold-dark rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="${s.icon_class || 'fas fa-briefcase'} text-white text-3xl"></i>
          </div>
          <h3 class="text-2xl font-poppins font-bold text-vip-black mb-4">${title}</h3>
          ${desc ? `<p class=\"text-gray-600 mb-6\">${desc}</p>` : ''}
          ${featuresHtml || `<div class=\"space-y-3 mb-6 text-left\">${durationHtml}${priceHtml}</div>`}
          <button data-whatsapp="services" data-service="${s.nome}" class="premium-button w-full justify-center">
            <i class="fab fa-whatsapp"></i>
            <span data-i18n="btn.reserve">Reservar Agora</span>
          </button>
        </div>
      `
    }).join('')

    mainGrid.innerHTML = cards
    mainGrid.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('animated'))
    try { new ScrollAnimations() } catch {}
    if (window.I18N) window.I18N.apply()
  } catch (e) {
    console.error('Erro ao renderizar serviços:', e)
  }
}

document.addEventListener('DOMContentLoaded', renderServices)
window.addEventListener('i18n:change', renderServices)
