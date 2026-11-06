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
function dayIndex(d = new Date()) { return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5); }
function keyToIndex(k) { const [y, m, d] = String(k).split('-').map(Number); return Math.floor(Date.UTC(y, m - 1, d) / 864e5); }
const indexToKey = i => new Date(i * 864e5).toISOString().slice(0, 10);
const todayKey = () => indexToKey(dayIndex());
function formatDay(i, opts = { day: 'numeric', month: 'long' }) {
  return new Date(i * 864e5).toLocaleDateString('fr-FR', { ...opts, timeZone: 'UTC' });
}
/** Élément « du jour » : stable pendant toute la journée. */
const dailyPick = (arr, salt = 0) => arr[((dayIndex() * 7 + salt) % arr.length + arr.length) % arr.length];

/* ----- Seuils partagés ----- */
const MASTERED_IVL = 21;   // jours d'intervalle à partir desquels un mot est « maîtrisé »
const LESSON_PASS = 70;    // % à atteindre pour valider une leçon

/* ----- Données texte : une ligne = des champs séparés par « | » ----- */
const parseRows = raw => raw.trim().split('\n').map(l => l.trim()).filter(Boolean).map(l => l.split('|').map(s => s.trim()));

/* ----- Comparaison des réponses ----- */
const ALT_SEP = /\s+\/\s+/;      // « a / b » = deux formes acceptées
const OPTIONAL = /\([^)]*\)/g;   // « (x) » = partie facultative
const stripAccents = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '');
const norm = s => String(s ?? '').toLowerCase().replace(/[’`]/g, "'").replace(/[…¿?¡!.,;:"«»]/g, ' ').replace(/\s+/g, ' ').trim();
const fold = s => stripAccents(norm(s));
const ARTICLES = /^(el|la|los|las|un|una|unos|unas) /;

/** Toutes les formes acceptées d'une réponse. */
function variants(expected) {
  const list = Array.isArray(expected) ? expected : String(expected).split(ALT_SEP);
  const out = new Set();
  for (const raw of list) {
    for (const f of [raw.replace(OPTIONAL, ' '), raw.replace(/[()]/g, '')]) {
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
const ANSWER_HINTS = { accents: 'Attention aux accents', article: 'N’oublie pas l’article', typo: 'Presque : une petite faute' };
/** Message court qui accompagne une réponse « presque juste » ('' sinon). */
const answerHint = res => ANSWER_HINTS[res.kind] || '';

/** Proportion des mots attendus retrouvés dans ce qui a été dit (reconnaissance vocale). */
function similarity(heard, expected) {
  const toks = s => fold(s).split(' ').filter(Boolean);
  const exp = toks(expected), got = toks(heard);
  if (!exp.length) return 0;
  let hit = 0;
  for (const w of exp) if (got.some(g => g === w || (w.length > 3 && levenshtein(g, w) <= 1))) hit++;
  return hit / exp.length;
}
function speechMatches(alternatives, expected) {
  const exps = variants(expected).map(v => stripAccents(v.replace(ARTICLES, '')));
  return alternatives.some(alt => {
    const h = fold(alt).replace(ARTICLES, '');
    return exps.some(e => h === e || h.includes(e) || similarity(h, e) >= 0.8);
  });
}

/** Deux mots de vocabulaire ont-ils un sens proche ? (même espagnol, ou un mot commun dans la traduction) */
const glossWords = s => new Set(fold(String(s).replace(OPTIONAL, ' ')).split(/[\s/']+/).filter(t => t.length >= 4));
function closeMeaning(a, b) {
  if (a.es === b.es || a.fr === b.fr) return true;
  const wa = glossWords(a.fr);
  for (const t of glossWords(b.fr)) if (wa.has(t)) return true;
  return false;
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

/** Bandeau de résultat vert / rouge. */
function feedbackBox(ok, title, body = '', btns = '') {
  return `<div class="feedback ${ok ? 'ok' : 'ko'}"><div class="fb-text"><b>${title}</b>${body ? `<div>${body}</div>` : ''}</div>${btns ? `<div class="fb-btns">${btns}</div>` : ''}</div>`;
}
/** Verrouille des boutons de choix : la/les bonne(s) en vert, le mauvais choix en rouge. */
function revealChoice(buttons, isCorrect, chosen) {
  buttons.forEach((b, j) => {
    b.disabled = true;
    if (isCorrect(j)) b.classList.add('correct'); else if (j === chosen) b.classList.add('wrong');
  });
}
/** Champ de réponse en espagnol : sans correction automatique ni majuscule forcée. */
const answerInput = (attrs = '') => `<input type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" ${attrs}>`;

const ACCENTS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'];
const accentBar = () => `<div class="accent-bar" aria-label="Caractères espagnols">${ACCENTS.map(c => `<button type="button" class="acc" data-acc="${c}" tabindex="-1">${c}</button>`).join('')}</div>`;

let lastInput = null;   // remis à null à chaque changement de page (app.js)
document.addEventListener('focusin', e => {
  if (e.target.matches('input[type=text], input:not([type])')) lastInput = e.target;
});
// Empêche le bouton d'accent de voler le focus (le clavier mobile reste ouvert)
document.addEventListener('pointerdown', e => { if (e.target.closest('.acc')) e.preventDefault(); });
document.addEventListener('click', e => {
  const b = e.target.closest('.acc');
  if (!b) return;
  let inp = lastInput && lastInput.isConnected && !lastInput.disabled ? lastInput : null;
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
