import { supabase } from './supabase-client.js'
import { ScrollAnimations } from './main.js'

async function renderHomeServices() {
  const grid = document.getElementById('home-services-grid')
  if (!grid) return

  try {
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .eq('ativo', true)
      .order('created_at', { ascending: false })
      .limit(3)

    if (error) throw error
    if (!data || data.length === 0) return

    const lang = (localStorage.getItem('lang') || 'pt').toLowerCase()

    const cards = data.map(s => {
      const title = lang.startsWith('en') ? (s.nome_en || s.nome_pt || s.nome)
        : lang.startsWith('es') ? (s.nome_es || s.nome_pt || s.nome)
        : (s.nome_pt || s.nome)

      const desc = lang.startsWith('en') ? (s.descricao_en || s.descricao_pt || s.descricao || '')
        : lang.startsWith('es') ? (s.descricao_es || s.descricao_pt || s.descricao || '')
        : (s.descricao_pt || s.descricao || s.descricao_en || s.descricao_es || '')

      const icon = s.icon_class || 'fas fa-briefcase'

      const features = (lang.startsWith('en') ? s.caracteristicas_en
        : lang.startsWith('es') ? s.caracteristicas_es
        : s.caracteristicas_pt) || []

      const featuresHtml = Array.isArray(features) && features.length > 0
        ? `
          <div class=\"space-y-3 mb-6 text-left\">
            ${features.map((f) => `
              <div class=\"flex items-start\">
                <i class=\"fas fa-check-circle text-vip-gold mt-1 mr-3 flex-shrink-0\"></i>
                <span class=\"text-sm text-gray-700\">${f}</span>
              </div>
            `).join('')}
          </div>
        `
        : ''

      return `
        <div class=\"premium-card text-center animate-on-scroll\">
          <div class=\"w-16 h-16 bg-gradient-to-br from-vip-gold to-vip-gold-dark rounded-full flex items-center justify-center mx-auto mb-6\">
            <i class=\"${icon} text-white text-2xl\"></i>
          </div>
          <h3 class=\"text-xl font-poppins font-bold text-vip-black mb-4\">${title}</h3>
          ${desc ? `<p class=\"text-gray-600 mb-6\">${desc}</p>` : ''}
          ${featuresHtml}
          <button data-whatsapp=\"services\" data-service=\"${s.nome}\" class=\"premium-button w-full justify-center\">
            <i class=\"fab fa-whatsapp\"></i>
            <span data-i18n=\"btn.reserve\">Reservar Agora</span>
          </button>
        </div>
      `
    }).join('')

    grid.innerHTML = cards
    grid.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('animated'))
    try { new ScrollAnimations() } catch {}
    if (window.I18N) window.I18N.apply()
  } catch (e) {
    console.error('Erro ao renderizar serviços da home:', e)
  }
}

document.addEventListener('DOMContentLoaded', renderHomeServices)
window.addEventListener('i18n:change', renderHomeServices)
