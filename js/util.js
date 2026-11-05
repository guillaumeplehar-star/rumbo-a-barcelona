'use strict';
/* ===== Petits utilitaires partagés ===== */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const sample = (arr, n) => shuffle(arr).slice(0, n);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

/* ----- Dates : on compte en « jours » (index entier, fuseau local) ----- */
const pad2 = n => String(n).padStart(2, '0');
function dayIndex(d = new Date()) { return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5); }
function keyToIndex(k) { const [y, m, d] = String(k).split('-').map(Number); return Math.floor(Date.UTC(y, m - 1, d) / 864e5); }
function indexToKey(i) { const d = new Date(i * 864e5); return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`; }
const todayKey = () => indexToKey(dayIndex());
function formatDay(i, opts = { day: 'numeric', month: 'long' }) {
  return new Date(i * 864e5).toLocaleDateString('fr-FR', { ...opts, timeZone: 'UTC' });
}
/** Élément « du jour » : stable pendant toute la journée. */
const dailyPick = (arr, salt = 0) => arr[((dayIndex() * 7 + salt) % arr.length + arr.length) % arr.length];

/* ----- Comparaison des réponses ----- */
const stripAccents = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '');
function norm(s) {
  return String(s ?? '').toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/\.\.\.|…/g, ' ')
    .replace(/[¿?¡!.,;:"«»]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
const ARTICLES = /^(el|la|los|las|un|una|unos|unas) /;

/** Toutes les formes acceptées : « a / b » = deux réponses possibles, « (x) » = facultatif. */
function variants(expected) {
  const list = Array.isArray(expected) ? expected : String(expected).split(/\s+\/\s+/);
  const out = new Set();
  for (const raw of list) {
    for (const f of [raw.replace(/\([^)]*\)/g, ' '), raw.replace(/[()]/g, '')]) {
      const n = norm(f);
      if (n) out.add(n);
    }
  }
  return [...out];
}

function levenshtein(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}

/**
 * Vérifie une réponse tapée.
 * kind : exact | accents | article | typo | wrong | empty
 * strict = les accents comptent (grammaire, conjugaison).
 */
function checkAnswer(input, expected, { strict = false } = {}) {
  const n = norm(input);
  if (!n) return { ok: false, kind: 'empty' };
  const vs = variants(expected);
  if (vs.includes(n)) return { ok: true, kind: 'exact' };
  const na = stripAccents(n);
  if (vs.some(v => stripAccents(v) === na)) return { ok: !strict, kind: 'accents' };
  if (!strict) {
    const noArt = v => v.replace(ARTICLES, '');
    if (vs.some(v => v !== noArt(v) && stripAccents(noArt(v)) === na)) return { ok: true, kind: 'article' };
  }
  if (vs.some(v => v.length > 5 && levenshtein(stripAccents(v), na) === 1)) return { ok: false, kind: 'typo' };
  return { ok: false, kind: 'wrong' };
}

/** Proportion des mots attendus retrouvés dans ce qui a été dit (reconnaissance vocale). */
function similarity(heard, expected) {
  const toks = s => stripAccents(norm(s)).split(' ').filter(Boolean);
  const exp = toks(expected), got = toks(heard);
  if (!exp.length) return 0;
  let hit = 0;
  for (const w of exp) if (got.some(g => g === w || (w.length > 3 && levenshtein(g, w) <= 1))) hit++;
  return hit / exp.length;
}
function speechMatches(alternatives, expected) {
  const exps = variants(expected).map(v => stripAccents(v.replace(ARTICLES, '')));
  return alternatives.some(alt => {
    const h = stripAccents(norm(alt)).replace(ARTICLES, '');
    return exps.some(e => h === e || h.includes(e) || similarity(h, e) >= 0.8);
  });
}

/* ----- Petits morceaux d'interface ----- */
function sayBtn(text, lang = 'es', cls = '') {
  return `<button type="button" class="say ${cls}" data-say="${esc(text)}" data-lang="${lang}" title="Écouter" aria-label="Écouter">🔊</button>`;
}
function progressBar(p, cls = '') {
  const pct = Math.round(Math.max(0, Math.min(1, p || 0)) * 100);
  return `<div class="bar ${cls}" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div>`;
}
const levelBadge = l => `<span class="badge lvl-${l.toLowerCase()}">${l}</span>`;

const ACCENTS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'];
const accentBar = () => `<div class="accent-bar" aria-label="Caractères espagnols">${ACCENTS.map(c => `<button type="button" class="acc" data-acc="${c}" tabindex="-1">${c}</button>`).join('')}</div>`;

let lastInput = null;
document.addEventListener('focusin', e => {
  if (e.target.matches('input[type=text], input:not([type])')) lastInput = e.target;
});
// Empêche le bouton d'accent de voler le focus (le clavier mobile reste ouvert)
document.addEventListener('pointerdown', e => { if (e.target.closest('.acc')) e.preventDefault(); });
document.addEventListener('click', e => {
  const b = e.target.closest('.acc');
  if (!b) return;
  let inp = lastInput && document.body.contains(lastInput) && !lastInput.disabled ? lastInput : null;
  if (!inp) inp = b.closest('section, form, .card, .session')?.querySelector('input[type=text]:not([disabled])');
  if (!inp) return;
  const s = inp.selectionStart ?? inp.value.length, en = inp.selectionEnd ?? inp.value.length;
  inp.value = inp.value.slice(0, s) + b.dataset.acc + inp.value.slice(en);
  inp.focus();
  inp.setSelectionRange(s + 1, s + 1);
  inp.dispatchEvent(new Event('input', { bubbles: true }));
});

function toast(msg, cls = '') {
  const box = $('#toasts');
  if (!box) return;
  const t = document.createElement('div');
  t.className = 'toast ' + cls;
  t.textContent = msg;
  box.appendChild(t);
  setTimeout(() => t.classList.add('out'), 2600);
  setTimeout(() => t.remove(), 3100);
}
