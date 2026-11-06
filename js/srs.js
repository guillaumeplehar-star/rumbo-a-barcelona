'use strict';
/* ===== Répétition espacée (inspirée de SM-2) + aides vocabulaire ===== */

const SRS = {
  get(id) { return Store.state.cards[id]; },
  isNew(id) { return !Store.state.cards[id]; },

  /** Calcule le nouvel état d'une carte. grade : 0 à revoir, 1 difficile, 2 bien, 3 facile */
  compute(c, grade, today = dayIndex()) {
    c = c ? { ...c } : { ivl: 0, ease: 2.5, reps: 0, lapses: 0, due: today };
    if (grade === 0) {
      c.reps = 0; c.lapses++; c.ivl = 0; c.ease = Math.max(1.3, c.ease - 0.2); c.due = today;
    } else {
      if (grade === 1) { c.ivl = c.reps === 0 ? 1 : Math.max(c.ivl + 1, Math.round(c.ivl * 1.2)); c.ease = Math.max(1.3, c.ease - 0.15); }
      else if (grade === 2) { c.ivl = c.reps === 0 ? 1 : c.reps === 1 ? 3 : Math.max(c.ivl + 1, Math.round(c.ivl * c.ease)); }
      else { c.ivl = c.reps === 0 ? 4 : Math.max(c.ivl + 2, Math.round(c.ivl * c.ease * 1.3)); c.ease += 0.15; }
      c.reps++; c.due = today + c.ivl;
    }
    c.last = today;
    return c;
  },
  review(id, grade) {
    Store.state.cards[id] = this.compute(this.get(id), grade);
    Store.save();
  },
  /** Erreur dans un quiz : le mot revient dans les révisions du jour. */
  lapse(id) {
    const c = this.get(id);
    if (!c) return;
    c.due = Math.min(c.due, dayIndex());
    Store.save();
  },
  previewLabel(id, grade) {
    if (grade === 0) return 'maintenant';
    const d = this.compute(this.get(id), grade).ivl;
    if (d < 30) return d + ' j';
    if (d < 365) return Math.round(d / 30) + ' mois';
    return Math.round(d / 365) + ' an(s)';
  },
  status(id, today = dayIndex()) {
    const c = this.get(id);
    if (!c) return 'new';
    if (c.ivl >= MASTERED_IVL) return 'mastered';
    if (c.due <= today) return 'due';
    return 'learning';
  },
};
const STATUS_LABEL = { new: 'Nouveau', learning: 'En cours', due: 'À revoir', mastered: 'Maîtrisé' };

const Vocab = {
  theme(id) { return THEME_BY_ID.get(id); },
  dueIds(themeId) {
    const today = dayIndex();
    return Object.entries(Store.state.cards)
      .filter(([id, c]) => c.due <= today && WORD_BY_ID.has(id) && (!themeId || WORD_BY_ID.get(id).theme === themeId))
      .map(([id]) => id);
  },
  newWords(theme) { return theme.words.filter(w => SRS.isNew(w.id)); },
  count(words) {
    let seen = 0, mastered = 0;
    for (const w of words) {
      const c = Store.state.cards[w.id];
      if (!c) continue;
      seen++;
      if (c.ivl >= MASTERED_IVL) mastered++;
    }
    return { total: words.length, seen, mastered };
  },
  stats(theme) { return this.count(theme.words); },
  summary() { return this.count(ALL_WORDS); },
};
