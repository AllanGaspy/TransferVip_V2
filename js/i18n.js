const I18N = (() => {
  let lang = localStorage.getItem('lang') || 'pt';
  let dict = {};
  const load = async (l) => {
    lang = l;
    localStorage.setItem('lang', l);
    try {
      const res = await fetch(`/i18n/${l}.json`);
      dict = await res.json();
    } catch (e) {
      dict = {};
    }
    apply();
    try { window.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang } })); } catch {}
  };
  const t = (key) => dict[key] || key;
  const apply = () => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (val) el.innerHTML = val;
    });
  };
  const bindSwitcher = () => {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-lang]');
      if (a) {
        e.preventDefault();
        load(a.getAttribute('data-lang'));
      }
    });
  };
  const init = async () => {
    await load(lang);
    bindSwitcher();
  };
  return { init, apply, load };
})();
window.I18N = I18N;
document.addEventListener('DOMContentLoaded', () => I18N.init());
