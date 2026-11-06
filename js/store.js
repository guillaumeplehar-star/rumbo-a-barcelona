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

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY));
      if (raw && raw.v === 1) {
        const d = defaults();
        return { ...d, ...raw, settings: { ...d.settings, ...raw.settings } };
      }
    } catch (e) { console.warn('Lecture de la sauvegarde impossible', e); }
    return defaults();
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
      if (!o || o.v !== 1 || typeof o.cards !== 'object') throw new Error('Fichier de sauvegarde invalide');
      localStorage.setItem(KEY, JSON.stringify(o));
      api.state = load();
    },
    reset() { localStorage.removeItem(KEY); api.state = load(); },
  };
  return api;
})();
