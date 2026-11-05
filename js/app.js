'use strict';
/* ===== Routeur, navigation et événements globaux ===== */

let currentCleanup = null;
function setCleanup(fn) {
  const prev = currentCleanup;
  currentCleanup = prev ? () => { prev(); fn(); } : fn;
}

const NAV = [
  { href: '#/', icon: '🏠', label: 'Accueil', key: '' },
  { href: '#/vocab', icon: '📚', label: 'Vocabulaire', key: 'vocab' },
  { href: '#/grammar', icon: '📖', label: 'Grammaire', key: 'grammar' },
  { href: '#/conj', icon: '🔁', label: 'Conjugaison', key: 'conj' },
  { href: '#/dialogues', icon: '💬', label: 'Dialogues', key: 'dialogues' },
  { href: '#/plan', icon: '🗓️', label: 'Mon plan', key: 'plan', sideOnly: true },
  { href: '#/settings', icon: '⚙️', label: 'Réglages', key: 'settings', sideOnly: true },
];

const ROUTES = [
  [/^$/, el => Views.home(el), ''],
  [/^vocab$/, el => Views.vocab(el), 'vocab'],
  [/^vocab\/([\w-]+)$/, (el, m) => Views.theme(el, m[1]), 'vocab'],
  [/^study\/(\w+)\/([\w-]+)$/, (el, m, q) => Views.study(el, m[1], m[2], q), m => (m[2] === 'review' ? '' : 'vocab')],
  [/^grammar$/, el => Views.grammar(el), 'grammar'],
  [/^grammar\/([\w-]+)$/, (el, m) => Views.lesson(el, m[1]), 'grammar'],
  [/^conj(?:\/(table|drill))?(?:\/(.*))?$/, (el, m) => Views.conj(el, m[1] || 'table', m[2] ? decodeURIComponent(m[2]) : ''), 'conj'],
  [/^dialogues$/, el => Views.dialogues(el), 'dialogues'],
  [/^dialogues\/([\w-]+)$/, (el, m) => Views.dialogue(el, m[1]), 'dialogues'],
  [/^plan$/, el => Views.plan(el), 'plan'],
  [/^settings$/, el => Views.settings(el), 'settings'],
];

function renderNav(section) {
  const link = n => `<a href="${n.href}" class="${n.key === section ? 'active' : ''}"><span class="ni">${n.icon}</span><span>${n.label}</span></a>`;
  $('#nav').innerHTML = NAV.map(link).join('');
  $('#bottom-nav').innerHTML = NAV.filter(n => !n.sideOnly).map(link).join('');
}

function renderTopStats() {
  const days = daysToDeparture();
  const dLabel = days > 0 ? `J-${days}` : days === 0 ? 'Jour J' : `J+${-days}`;
  $('#top-stats').innerHTML = `
    <a class="pill" href="#/plan" title="Jours avant le départ">✈️ ${dLabel}</a>
    <span class="pill" title="Jours de suite">🔥 ${Store.streak()}</span>
    <span class="pill" id="xp-pill" title="XP aujourd’hui / objectif">⭐ ${Store.todayXp()}<small>/${Store.settings.goal}</small></span>`;
}

function route() {
  if (currentCleanup) { try { currentCleanup(); } catch (e) { console.warn(e); } }
  currentCleanup = null;
  Speech.stop();
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, qs] = raw.split('?');
  const query = new URLSearchParams(qs || '');
  const el = $('#app');
  let section = '';
  let found = false;
  for (const [re, view, sec] of ROUTES) {
    const m = path.match(re);
    if (!m) continue;
    found = true;
    section = typeof sec === 'function' ? sec(m) : sec;
    el.innerHTML = '';
    view(el, m, query);
    break;
  }
  if (!found) Views.notFound(el);
  document.body.dataset.section = section;
  document.body.classList.toggle('in-session', path.startsWith('study/'));
  renderNav(section);
  renderTopStats();
  window.scrollTo(0, 0);
}

/* ----- Événements globaux ----- */
document.addEventListener('click', e => {
  const say = e.target.closest('[data-say]');
  if (say) {
    e.preventDefault();
    Speech.speak(say.dataset.say, { lang: say.dataset.lang || 'es' });
    return;
  }
  const em = e.target.closest('.lesson-body em');
  if (em) Speech.speak(em.textContent);
});

document.addEventListener('xp', e => {
  const { before, after } = e.detail;
  renderTopStats();
  const pill = $('#xp-pill');
  if (pill) { pill.classList.remove('bump'); void pill.offsetWidth; pill.classList.add('bump'); }
  const goal = Store.settings.goal;
  if (before < goal && after >= goal) toast(`🎉 Objectif du jour atteint : ${goal} XP ! ¡Enhorabuena!`, 'ok');
});

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', () => {
  route();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});
