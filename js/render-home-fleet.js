import { supabase } from './supabase-client.js'
import { ScrollAnimations } from './main.js'

async function renderHomeFleet() {
  const grid = document.querySelector('#fleet .services-grid')
  if (!grid) return

  try {
    const preferredOrder = ['Corolla', 'Jumpy', 'Transit']

    const { data: execs, error } = await supabase
      .from('veiculos')
      .select('*')
      .eq('ativo', true)
      .eq('executivo', true)
      .order('ordem', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) throw error
    const execList = Array.isArray(execs) ? execs : []
    if (execList.length === 0) return

    // Primeiro: selecionar exatamente na ordem desejada
    const primary = preferredOrder
      .map(name => execList.find(v => (v.modelo || '').toLowerCase() === name.toLowerCase()))
      .filter(Boolean)

    // Depois: completar até 3 com demais executivos não selecionados
    const selectedIds = new Set(primary.map(v => v.id))
    const fillers = execList.filter(v => !selectedIds.has(v.id))
    const list = [...primary, ...fillers].slice(0, 3)
    if (list.length === 0) throw new Error('Nenhum executivo encontrado')

    const lang = (localStorage.getItem('lang') || 'pt').toLowerCase()

    const cards = list.map(v => {
      const desc = lang.startsWith('en') ? (v.descricao_en || v.descricao_pt || '')
        : lang.startsWith('es') ? (v.descricao_es || v.descricao_pt || '')
        : (v.descricao_pt || v.descricao_en || v.descricao_es || '')

      const img = v.foto_url
        ? `<img src="${v.foto_url}" alt="${v.modelo}" class="w-full h-64 object-cover transition-transform duration-500 hover:scale-110">`
        : `
          <div class="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <i class="fas fa-car text-gray-500 text-3xl"></i>
          </div>
        `

      const badge = `<div class="absolute top-4 right-4 bg-vip-gold text-white px-3 py-1 rounded-full text-sm font-semibold" data-badge>EXECUTIVO</div>`

      return `
        <div class="premium-card animate-on-scroll">
          <div class="relative overflow-hidden rounded-t-16">
            ${img}
            ${badge}
          </div>
          <div class="p-6">
            <h3 class="text-xl font-poppins font-bold text-vip-black mb-2">${v.modelo}</h3>
            ${v.marca ? `<p class=\"text-gray-600 mb-2\">${v.marca}</p>` : ''}
            ${desc ? `<p class=\"text-gray-600 mb-4\">${desc}</p>` : ''}
            <button data-whatsapp="fleet" data-vehicle="${v.modelo}" data-service="Orçamento Executivo" class="premium-button w-full justify-center">
              <i class="fab fa-whatsapp"></i>
              <span data-i18n="btn.quote">Solicitar Orçamento</span>
            </button>
          </div>
        </div>
      `
    }).join('')

    grid.innerHTML = cards
    grid.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('animated'))
    try { new ScrollAnimations() } catch {}
    if (window.I18N) window.I18N.apply()
  } catch (e) {
    console.warn('Erro ao renderizar frota da home:', e)
    const grid = document.querySelector('#fleet .services-grid')
    if (grid) {
      const cacheRaw = localStorage.getItem('home_fleet_cache')
      if (cacheRaw) {
        try {
          const execs = JSON.parse(cacheRaw)
          const preferredOrder = ['Corolla', 'Jumpy', 'Transit']
          const list = preferredOrder
            .map(name => execs.find(v => (v.modelo || '').toLowerCase() === name.toLowerCase()))
            .filter(Boolean)
            .slice(0,3)
          if (list.length) {
            const cards = list.map(v => `
              <div class="premium-card animate-on-scroll">
                <div class="relative overflow-hidden rounded-t-16">
                  ${v.foto_url ? `<img src="${v.foto_url}" alt="${v.modelo}" class="w-full h-64 object-cover transition-transform duration-500 hover:scale-110">` : `
                    <div class=\"w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center\">
                      <i class=\"fas fa-car text-gray-500 text-3xl\"></i>
                    </div>
                  `}
                  <div class="absolute top-4 right-4 bg-vip-gold text-white px-3 py-1 rounded-full text-sm font-semibold" data-badge>EXECUTIVO</div>
                </div>
                <div class="p-6">
                  <h3 class="text-xl font-poppins font-bold text-vip-black mb-2">${v.modelo}</h3>
                  ${v.marca ? `<p class=\"text-gray-600 mb-2\">${v.marca}</p>` : ''}
                  <button data-whatsapp="fleet" data-vehicle="${v.modelo}" data-service="Orçamento Executivo" class="premium-button w-full justify-center">
                    <i class="fab fa-whatsapp"></i>
                    <span data-i18n="btn.quote">Solicitar Orçamento</span>
                  </button>
                </div>
              </div>
            `).join('')
            grid.innerHTML = cards
          }
        } catch {}
      }
      if (!grid.innerHTML) {
        const fallback = ['Corolla','Jumpy','Transit'].map(name => ({ modelo: name, marca: '', foto_url: '' }))
        const cards = fallback.map(v => `
          <div class="premium-card animate-on-scroll">
            <div class="relative overflow-hidden rounded-t-16">
            <div class="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <i class="fas fa-car text-gray-500 text-3xl"></i>
            </div>
            <div class="absolute top-4 right-4 bg-vip-gold text-white px-3 py-1 rounded-full text-sm font-semibold" data-badge>EXECUTIVO</div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-poppins font-bold text-vip-black mb-2">${v.modelo}</h3>
              ${v.marca ? `<p class=\"text-gray-600 mb-2\">${v.marca}</p>` : ''}
              <button data-whatsapp="fleet" data-vehicle="${v.modelo}" data-service="Orçamento Executivo" class="premium-button w-full justify-center">
                <i class="fab fa-whatsapp"></i>
                <span data-i18n="btn.quote">Solicitar Orçamento</span>
              </button>
            </div>
          </div>
        `).join('')
        grid.innerHTML = cards
      }
      grid.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('animated'))
      try { new ScrollAnimations() } catch {}
      if (window.I18N) window.I18N.apply()
    }
  }
}

document.addEventListener('DOMContentLoaded', renderHomeFleet)
window.addEventListener('i18n:change', renderHomeFleet)
