import { supabase } from './supabase-client.js'
import { ScrollAnimations } from './main.js'

async function renderHomeFleet() {
  const grid = document.querySelector('#fleet .services-grid')
  if (!grid) return

  try {
    const execPromise = supabase
      .from('veiculos')
      .select('*')
      .eq('ativo', true)
      .eq('executivo', true)
      .order('created_at', { ascending: false })
      .limit(3)

    const blindPromise = supabase
      .from('veiculos')
      .select('*')
      .eq('ativo', true)
      .eq('blindado', true)
      .eq('executivo', false)
      .order('created_at', { ascending: false })
      .limit(1)

    const [{ data: execs, error: e1 }, { data: armors, error: e2 }] = await Promise.all([execPromise, blindPromise])
    if (e1) throw e1
    if (e2) throw e2

    const selected = []
    const execList = Array.isArray(execs) ? execs : []
    const armorNonExec = Array.isArray(armors) ? armors : []

    for (let i = 0; i < Math.min(2, execList.length); i++) {
      selected.push(execList[i])
    }

    if (armorNonExec.length > 0) {
      selected.push(armorNonExec[0])
    } else if (execList.length >= 3) {
      selected.push(execList[2])
    } else {
      const { data: blindFallback } = await supabase
        .from('veiculos')
        .select('*')
        .eq('ativo', true)
        .eq('blindado', true)
        .order('created_at', { ascending: false })
        .limit(3)
      if (blindFallback && blindFallback.length > 0) {
        const selectedIds = new Set(selected.map(v => v.id))
        const firstDistinct = blindFallback.find(v => !selectedIds.has(v.id))
        if (firstDistinct) selected.push(firstDistinct)
      }
    }
    const list = selected
    if (list.length === 0) return

    const lang = (localStorage.getItem('lang') || 'pt').toLowerCase()

    const cards = list.map(v => {
      const desc = lang.startsWith('en') ? (v.descricao_en || v.descricao_pt || '')
        : lang.startsWith('es') ? (v.descricao_es || v.descricao_pt || '')
        : (v.descricao_pt || v.descricao_en || v.descricao_es || '')

      const img = v.foto_url
        ? `<img src="${v.foto_url}" alt="${v.modelo}" class="w-full h-64 object-cover transition-transform duration-500 hover:scale-110">`
        : `<img src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(v.modelo + ' luxury vehicle professional photography premium lighting')}&image_size=landscape_16_9" alt="${v.modelo}" class="w-full h-64 object-cover transition-transform duration-500 hover:scale-110">`

      const badge = v.blindado
        ? `<div class="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold" data-badge>BLINDADO</div>`
        : `<div class="absolute top-4 right-4 bg-vip-gold text-white px-3 py-1 rounded-full text-sm font-semibold" data-badge>EXECUTIVO</div>`

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
            <button data-whatsapp="fleet" data-vehicle="${v.modelo}" data-service="${v.blindado ? 'Orçamento Blindado' : 'Orçamento Executivo'}" class="premium-button w-full justify-center">
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
    console.error('Erro ao renderizar frota da home:', e)
  }
}

document.addEventListener('DOMContentLoaded', renderHomeFleet)
window.addEventListener('i18n:change', renderHomeFleet)
