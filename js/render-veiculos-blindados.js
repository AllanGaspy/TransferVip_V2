import { supabase } from './supabase-client.js'
import { ScrollAnimations } from './main.js'

async function renderBlindados() {
  const container = document.getElementById('admin-blindados')
  if (!container) return

  try {
    const { data, error } = await supabase
      .from('veiculos')
      .select('*')
      .eq('ativo', true)
      .eq('blindado', true)
      .order('modelo', { ascending: true })

    if (error) throw error

    if (!data || data.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-center">Nenhum veículo blindado cadastrado no painel admin.</p>'
      return
    }

    const cards = data.map((v) => {
      const lang = (localStorage.getItem('lang') || 'pt').toLowerCase()
      const desc = lang.startsWith('en') ? (v.descricao_en || v.descricao_pt || '')
        : lang.startsWith('es') ? (v.descricao_es || v.descricao_pt || '')
        : (v.descricao_pt || v.descricao_en || v.descricao_es || '')
      const img = v.foto_url
        ? `<img src="${v.foto_url}" alt="${v.modelo}" class="w-full h-64 object-cover transition-transform duration-500 hover:scale-110">`
        : `<img src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(v.modelo + ' armored SUV luxury black exterior professional photography elegant lighting premium car showroom')}\u0026image_size=landscape_16_9" alt="${v.modelo}" class="w-full h-64 object-cover transition-transform duration-500 hover:scale-110">`

      return `
        <div class="premium-card animate-on-scroll">
          <div class="relative overflow-hidden rounded-t-16">
            ${img}
          </div>
          <div class="p-6">
            <h3 class="text-2xl font-poppins font-bold text-vip-black mb-2">${v.modelo}</h3>
            ${v.marca ? `<p class=\"text-gray-600 mb-2\">${v.marca}</p>` : ''}
            ${desc ? `<p class=\"text-gray-600 mb-4\">${desc}</p>` : ''}
            <button data-whatsapp="fleet-detail" data-vehicle="${v.modelo}" data-service="Orçamento Blindados" class="premium-button w-full justify-center">
              <i class="fab fa-whatsapp"></i>
              <span data-i18n="btn.quote">Solicitar Orçamento</span>
            </button>
          </div>
        </div>
      `
    }).join('')

    container.innerHTML = cards
    container.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('animated'))
    try { new ScrollAnimations() } catch {}
    if (window.I18N) window.I18N.apply()
  } catch (e) {
    console.error('Erro ao renderizar blindados:', e)
  }
}

document.addEventListener('DOMContentLoaded', renderBlindados)
window.addEventListener('i18n:change', renderBlindados)
