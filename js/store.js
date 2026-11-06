'use strict';
/* ===== Sauvegarde locale de la progression (localStorage) ===== */

const Store = (() => {
  const KEY = 'rumbo-a-barcelona-v1';

  const defaults = () => ({
    v: 1,
    created: todayKey(),
    settings: {
      name: '',
      departure: '2027-01-04',
      planStart: '',
      goal: 50,
      newPerDay: 10,
      direction: 'mix',
      autoplay: true,
      rate: 0.9,
      voice: '',
      conjTenses: ['pres'],
      conjGroup: 'all',
    },
    cards: {},      // id du mot -> état de répétition espacée
    xp: {},         // 'AAAA-MM-JJ' -> XP gagnés ce jour-là
    newSeen: {},    // 'AAAA-MM-JJ' -> nouveaux mots découverts
    lessons: {},    // id leçon -> meilleur score (%)
    dialogues: {},  // id dialogue -> true quand terminé
  });

  const DATE = /^\d{4}-\d{2}-\d{2}$/;
  const isObj = x => !!x && typeof x === 'object' && !Array.isArray(x);
  const isNum = x => typeof x === 'number' && Number.isFinite(x);
  const entries = x => Object.entries(isObj(x) ? x : {});

  /** Ne garde que des valeurs du bon type : une sauvegarde abîmée ou piégée
      ne peut ni bloquer l'app ni injecter du HTML dans les pages. */
  function sanitize(raw) {
    const d = defaults();
    if (!isObj(raw) || raw.v !== 1) return d;
    const ds = d.settings, rs = isObj(raw.settings) ? raw.settings : {};
    const pick = (k, ok) => (ok(rs[k]) ? rs[k] : ds[k]);
    const settings = {
      name: typeof rs.name === 'string' ? rs.name.slice(0, 30) : ds.name,
      departure: pick('departure', x => DATE.test(x)),
      planStart: pick('planStart', x => x === '' || DATE.test(x)),
      goal: pick('goal', x => isNum(x) && x > 0),
      newPerDay: pick('newPerDay', x => Number.isInteger(x) && x > 0),
      direction: pick('direction', x => ['mix', 'es-fr', 'fr-es'].includes(x)),
      autoplay: pick('autoplay', x => typeof x === 'boolean'),
      rate: pick('rate', x => isNum(x) && x >= 0.5 && x <= 1.5),
      voice: pick('voice', x => typeof x === 'string'),
      conjTenses: Array.isArray(rs.conjTenses) ? rs.conjTenses.filter(x => typeof x === 'string') : ds.conjTenses,
      conjGroup: pick('conjGroup', x => ['all', 'irr', 'sc', 'reg'].includes(x)),
    };
    const cards = {};
    for (const [id, c] of entries(raw.cards)) {
      if (isObj(c) && ['ivl', 'ease', 'reps', 'lapses', 'due'].every(k => isNum(c[k]))) {
        cards[id] = { ivl: c.ivl, ease: c.ease, reps: c.reps, lapses: c.lapses, due: c.due, last: isNum(c.last) ? c.last : c.due };
      }
    }
    const numbers = (x, fix = n => n) => Object.fromEntries(entries(x).filter(([, n]) => isNum(n)).map(([k, n]) => [k, fix(n)]));
    return {
      v: 1,
      created: DATE.test(raw.created) ? raw.created : d.created,
      settings,
      cards,
      xp: numbers(raw.xp),
      newSeen: numbers(raw.newSeen),
      lessons: numbers(raw.lessons, n => Math.max(0, Math.min(100, Math.round(n)))),
      dialogues: Object.fromEntries(entries(raw.dialogues).filter(([, done]) => done).map(([k]) => [k, true])),
    };
  }

  function load() {
    try { return sanitize(JSON.parse(localStorage.getItem(KEY))); }
    catch (e) { console.warn('Lecture de la sauvegarde impossible', e); return defaults(); }
  }

  let pending = false;
  function write() {
    pending = false;
    try { localStorage.setItem(KEY, JSON.stringify(api.state)); } catch (e) { console.warn(e); }
  }

  const api = {
    state: load(),
    /** Enregistre à la fin de la tâche en cours : plusieurs modifications d'affilée = une seule écriture. */
    save() {
      if (pending) return;
      pending = true;
      queueMicrotask(write);
    },
    get settings() { return api.state.settings; },
    set(key, value) { api.state.settings[key] = value; api.save(); },

    addXp(n) {
      if (!n) return;
      const k = todayKey();
      const before = api.state.xp[k] || 0;
      api.state.xp[k] = before + n;
      api.save();
      document.dispatchEvent(new CustomEvent('xp', { detail: { before, after: before + n } }));
    },
    todayXp() { return api.state.xp[todayKey()] || 0; },
    totalXp() { return Object.values(api.state.xp).reduce((a, b) => a + b, 0); },
    streak() {
      const xp = api.state.xp;
      let i = dayIndex();
      if (!xp[indexToKey(i)]) i--;           // la série tient tant qu'on a joué hier
      let c = 0;
      while (xp[indexToKey(i)]) { c++; i--; }
      return c;
    },
    newSeenToday() { return api.state.newSeen[todayKey()] || 0; },
    markNewSeen() { const k = todayKey(); api.state.newSeen[k] = api.newSeenToday() + 1; api.save(); },
    /** Nouveaux mots qu'on peut encore découvrir aujourd'hui. */
    newQuota() { return Math.max(0, api.state.settings.newPerDay - api.newSeenToday()); },
    lessonPassed(id) { return (api.state.lessons[id] ?? 0) >= LESSON_PASS; },
    planStart() { return api.state.settings.planStart || api.state.created; },

    exportJson() { return JSON.stringify(api.state, null, 2); },
    importJson(txt) {
      const o = JSON.parse(txt);
      if (!isObj(o) || o.v !== 1 || !isObj(o.cards)) throw new Error('Fichier de sauvegarde invalide');
      api.state = sanitize(o);
      write();
    },
    reset() { localStorage.removeItem(KEY); api.state = load(); },
  };
  return api;
})();
