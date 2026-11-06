'use strict';
/* ===== Écrans de l'application ===== */

const Views = {};
const daysToDeparture = () => keyToIndex(Store.settings.departure) - dayIndex();

/* ---------- Plan de 8 semaines ---------- */
const Plan = {
  start() { return keyToIndex(Store.planStart()); },
  currentWeek() { return Math.max(0, Math.min(PLAN.length - 1, Math.floor((dayIndex() - this.start()) / 7))); },
  /** Éléments d'une semaine, avec leur état « terminé » calculé une seule fois. */
  items(w) {
    return [
      ...w.vocab.map(id => ({ type: 'vocab', id })),
      ...w.grammar.map(id => ({ type: 'grammar', id })),
      ...w.dialogues.map(id => ({ type: 'dialogue', id })),
    ].map(it => ({ ...it, done: this.isDone(it) }));
  },
  isDone(it) {
    if (it.type === 'vocab') { const s = Vocab.stats(Vocab.theme(it.id)); return s.seen / s.total >= 0.8; }
    if (it.type === 'grammar') return Store.lessonPassed(it.id);
    return !!Store.state.dialogues[it.id];
  },
  progress(items) { return items.filter(i => i.done).length / items.length; },
};

function planItemRow(it) {
  let icon, label, kind, href, extra = '';
  if (it.type === 'vocab') {
    const t = Vocab.theme(it.id), s = Vocab.stats(t);
    [icon, label, kind, href, extra] = [t.icon, t.title, 'Vocabulaire', `#/vocab/${t.id}`, `${s.seen}/${s.total} mots`];
  } else if (it.type === 'grammar') {
    const g = GRAMMAR_BY_ID.get(it.id), sc = Store.state.lessons[g.id];
    [icon, label, kind, href, extra] = [g.icon, g.title, 'Grammaire', `#/grammar/${g.id}`, sc != null ? `${sc} %` : ''];
  } else {
    const d = DIALOGUE_BY_ID.get(it.id);
    [icon, label, kind, href] = [d.icon, d.title, 'Dialogue', `#/dialogues/${d.id}`];
  }
  return `<a class="todo ${it.done ? 'done' : ''}" href="${href}">
    <span class="todo-check">${it.done ? '✓' : ''}</span><span class="todo-icon">${icon}</span>
    <span class="todo-main"><span class="todo-kind">${kind}</span><span>${esc(label)}</span></span>
    <span class="muted small nowrap">${extra}</span></a>`;
}

/* ---------- Morceaux réutilisables ---------- */
function exampleHtml(w, cls = 'word-ex') {
  if (!w.ex) return '';
  return `<div class="${cls}">${esc(w.ex)} ${sayBtn(w.ex, w.lang, 'say-sm')}<div class="muted">${esc(w.exFr || '')}</div></div>`;
}
/** Ligne de mot. dot : pastille d'état de révision ; theme : lien vers le thème (résultats de recherche). */
function wordRow(w, { dot = true, theme = false } = {}) {
  const st = dot ? SRS.status(w.id) : null;
  const t = theme ? Vocab.theme(w.theme) : null;
  return `<div class="word-row">
    ${st ? `<span class="dot dot-${st}" title="${STATUS_LABEL[st]}"></span>` : ''}
    <div class="word-main">
      <div class="word-es">${esc(w.es)}</div>
      <div class="word-fr">${esc(w.fr)}</div>
      ${exampleHtml(w)}
      ${t ? `<a class="muted small" href="#/vocab/${t.id}">${t.icon} ${esc(t.title)}</a>` : ''}
    </div>
    ${sayBtn(w.es, w.lang)}
  </div>`;
}
/** Carte cliquable des grilles (thèmes, dialogues). */
function cardLink({ href, icon, title, level, meta, done = false, progress = null }) {
  return `<a class="theme-card ${done ? 'done' : ''}" href="${href}">
    <div class="theme-icon">${icon}</div>
    <div class="theme-body">
      <div class="theme-title">${esc(title)}</div>
      <div class="theme-meta">${levelBadge(level)}<span class="muted small">${meta}</span></div>
      ${progress != null ? progressBar(progress) : ''}
    </div></a>`;
}
function statTile(icon, value, label, ratio) {
  return `<div class="stat"><span class="stat-icon">${icon}</span><div><div class="stat-value">${value}</div><div class="stat-label">${label}</div>${ratio != null ? progressBar(ratio, 'bar-xs') : ''}</div></div>`;
}
function pageHead(icon, title, sub, badge = '') {
  return `<header class="page-head">${icon ? `<div class="page-icon">${icon}</div>` : ''}<div>${badge}<h1>${title}</h1>${sub ? `<p class="muted">${sub}</p>` : ''}</div></header>`;
}
/** Écran centré de fin (séance terminée, rien à réviser, page introuvable). */
function endScreen(emoji, title, body, buttons) {
  return `<div class="session-end"><div class="big-emoji">${emoji}</div><h1>${title}</h1>${body}<div class="row center gap-s wrap">${buttons}</div></div>`;
}
/** Bouton « tout écouter » : lit dans l'ordre en surlignant l'élément lu ; un 2ᵉ clic arrête. */
function playButton(btn, idleLabel, getSteps, { block = 'nearest', gap } = {}) {
  let run = 0, nodes = [];
  const idle = () => {
    btn.dataset.playing = '';
    btn.textContent = idleLabel;
    nodes.forEach(n => n.classList.remove('speaking'));
  };
  btn.onclick = async () => {
    if (btn.dataset.playing) { run++; Speech.stop(); idle(); return; }
    const my = ++run;
    const steps = getSteps();
    nodes = steps.nodes;
    btn.dataset.playing = '1';
    btn.textContent = '■ Arrêter';
    await Speech.sequence(steps.items, {
      gap,
      onStep: (i, on) => {
        if (my !== run) return;   // une lecture plus récente a pris la main
        nodes[i].classList.toggle('speaking', on);
        if (on) nodes[i].scrollIntoView({ block, behavior: 'smooth' });
      },
    });
    if (my === run) idle();
  };
}
const HERO_ART = `<svg viewBox="0 0 120 120" aria-hidden="true">
  <circle cx="78" cy="40" r="22" fill="#f5a524"/>
  <path d="M0 74 Q15 66 30 74 T60 74 T90 74 T120 74 V120 H0Z" fill="#1f6fb2" opacity=".9"/>
  <path d="M0 86 Q15 78 30 86 T60 86 T90 86 T120 86 V120 H0Z" fill="#2b86cf"/>
  <path d="M36 70 L50 70 L46 76 L40 76 Z" fill="#fff"/><path d="M43 46 L43 70 L54 66 Z" fill="#fff"/><path d="M42 52 L42 69 L33 67 Z" fill="#fde6df"/>
</svg>`;

/* ================= ACCUEIL ================= */
Views.home = el => {
  const s = Store.settings;
  const days = daysToDeparture();
  const due = Vocab.dueIds().length;
  const sum = Vocab.summary();
  const today = Store.todayXp();
  const streak = Store.streak();
  const wk = Plan.currentWeek(), week = PLAN[wk];
  const items = Plan.items(week);
  const pending = items.filter(i => !i.done).slice(0, 4);
  const [pEs, pFr] = dailyPick(PHRASES);
  const tip = dailyPick(TIPS, 3);
  const h = new Date().getHours();
  const hello = h < 13 ? '¡Buenos días' : h < 21 ? '¡Buenas tardes' : '¡Buenas noches';
  const nextTheme = PLAN.flatMap(w => w.vocab).find(id => { const st = Vocab.stats(Vocab.theme(id)); return st.seen < st.total; }) || 'bases';

  let title, sub;
  if (days > 1) { title = `J-${days} avant Barcelone`; sub = days > 14 ? `Encore ${Math.round(days / 7)} semaines pour te préparer. ¡Vamos!` : 'Dernière ligne droite, tu vas y arriver !'; }
  else if (days === 1) { title = 'Départ demain ! 🎒'; sub = 'Une dernière révision avant de faire ta valise ?'; }
  else if (days === 0) { title = '¡Hoy es el gran día! ✈️'; sub = 'Bon voyage, et profite de chaque instant.'; }
  else { title = `Día ${1 - days} en Barcelona ☀️`; sub = 'Continue à pratiquer : chaque jour sur place compte double !'; }

  el.innerHTML = `
  <section class="hero">
    <div class="hero-text">
      <p class="hero-kicker">${hello}${s.name ? ', ' + esc(s.name) : ''}!</p>
      <h1>${title}</h1>
      <p>${sub}</p>
    </div>
    <div class="hero-art">${HERO_ART}</div>
  </section>

  <section class="stat-grid">
    ${statTile('🔥', streak, streak > 1 ? 'jours de suite' : 'jour de suite')}
    ${statTile('⭐', `${today}<small> / ${s.goal}</small>`, 'XP aujourd’hui', today / s.goal)}
    ${statTile('📚', sum.seen, 'mots vus')}
    ${statTile('🏆', sum.mastered, 'mots maîtrisés')}
  </section>

  <section class="card card-accent">
    <div class="row-between wrap gap-s">
      <div>
        <h2>🃏 Révisions du jour</h2>
        <p class="muted">${due ? `${due} carte${due > 1 ? 's' : ''} à revoir aujourd’hui. Quelques minutes suffisent !` : sum.seen ? 'Rien à réviser pour l’instant : apprends de nouveaux mots !' : 'Commence par apprendre tes premiers mots.'}</p>
      </div>
      ${due ? `<a class="btn btn-primary btn-lg" href="#/study/flash/review">Réviser</a>` : `<a class="btn btn-primary btn-lg" href="#/vocab/${nextTheme}">Apprendre</a>`}
    </div>
    ${sum.seen >= 8 ? `<div class="chip-row"><a class="chip" href="#/study/qcm/review">✅ Quiz mélangé</a><a class="chip" href="#/study/write/review">✍️ Écriture</a><a class="chip" href="#/study/listen/review">🎧 Dictée</a>${Speech.canListen ? '<a class="chip" href="#/study/speak/review">🎤 Prononciation</a>' : ''}</div>` : ''}
  </section>

  <section class="card">
    <div class="row-between wrap gap-s"><h2>🗓️ Semaine ${wk + 1} · ${esc(week.title)}</h2><a href="#/plan" class="link">Tout le plan →</a></div>
    <p class="muted">${week.goal}</p>
    ${progressBar(Plan.progress(items))}
    <div class="todo-list">${pending.length ? pending.map(planItemRow).join('') : '<p class="center">✅ Semaine terminée, bravo ! Avance dans le plan ou révise.</p>'}</div>
  </section>

  <div class="grid-2">
    <section class="card">
      <h3>💬 Phrase du jour</h3>
      <p class="phrase-es">${esc(pEs)} ${sayBtn(pEs)}</p>
      <p class="muted">${esc(pFr)}</p>
    </section>
    <section class="card">
      <h3>☀️ Le savais-tu ?</h3>
      <p>${tip}</p>
    </section>
  </div>

  <section class="tiles">
    <a class="tile" href="#/vocab"><span>📚</span>Vocabulaire<small>${ALL_WORDS.length} mots</small></a>
    <a class="tile" href="#/grammar"><span>📖</span>Grammaire<small>${GRAMMAR.length} leçons</small></a>
    <a class="tile" href="#/conj"><span>🔁</span>Conjugaison<small>${VERBS.length} verbes</small></a>
    <a class="tile" href="#/dialogues"><span>💬</span>Dialogues<small>${DIALOGUES.length} situations</small></a>
    <a class="tile" href="#/vocab/catalan"><span>🟨</span>Catalan<small>de survie</small></a>
    <a class="tile" href="#/plan"><span>🗓️</span>Mon plan<small>8 semaines</small></a>
  </section>`;
};

/* ================= VOCABULAIRE ================= */
let searchIndex = null;   // [mot, texte replié espagnol + français], construit à la première recherche

Views.vocab = el => {
  el.innerHTML = `
  ${pageHead('', '📚 Vocabulaire', `${ALL_WORDS.length} mots et expressions classés par situations de ta vie à Barcelone.`)}
  <div class="search"><input id="q" type="search" placeholder="🔎 Chercher un mot en français ou en espagnol…" autocomplete="off"></div>
  <div id="results"></div>
  <div class="theme-grid" id="grid">${VOCAB.map(t => {
    const s = Vocab.stats(t);
    return cardLink({ href: `#/vocab/${t.id}`, icon: t.icon, title: t.title, level: t.level, done: s.seen === s.total,
      meta: `${s.seen}/${s.total} mots${s.mastered ? ` · ${s.mastered} 🏆` : ''}`, progress: s.seen / s.total });
  }).join('')}</div>`;
  const q = $('#q', el), res = $('#results', el), grid = $('#grid', el);
  q.addEventListener('input', () => {
    const v = fold(q.value);
    if (v.length < 2) { res.innerHTML = ''; grid.hidden = false; return; }
    searchIndex ||= ALL_WORDS.map(w => [w, fold(w.es) + '\n' + fold(w.fr)]);
    const hits = [];
    for (const [w, text] of searchIndex) {
      if (text.includes(v) && hits.push(w) === 60) break;
    }
    grid.hidden = true;
    res.innerHTML = hits.length ? `<div class="card word-list">${hits.map(w => wordRow(w, { theme: true })).join('')}</div>` : '<p class="muted center">Aucun résultat.</p>';
  });
};

Views.theme = (el, id) => {
  const t = Vocab.theme(id);
  if (!t) return Views.notFound(el);
  const s = Vocab.stats(t);
  const due = Vocab.dueIds(id).length;
  const lang = t.words[0].lang;
  const modes = [
    { m: 'flash', icon: '🃏', title: 'Cartes mémoire', sub: `${Math.min(Vocab.newWords(t).length, Store.newQuota())} nouveaux · ${due} à revoir` },
    { m: 'qcm', icon: '✅', title: 'QCM', sub: 'Choisis la bonne traduction' },
    { m: 'write', icon: '✍️', title: 'Écriture', sub: `Écris le mot en ${langName(lang)}` },
    { m: 'listen', icon: '🎧', title: 'Dictée', sub: 'Écris ce que tu entends' },
  ];
  if (Speech.canListen) modes.push({ m: 'speak', icon: '🎤', title: 'Prononciation', sub: 'Dis le mot à voix haute' });

  el.innerHTML = `
  <a class="back" href="#/vocab">← Vocabulaire</a>
  ${pageHead(t.icon, esc(t.title), t.note || `${s.total} mots · ${s.seen} vus · ${s.mastered} maîtrisés`, levelBadge(t.level))}
  ${progressBar(s.seen / s.total, 'bar-lg')}
  <div class="mode-grid">${modes.map(m => `<a class="mode-card" href="#/study/${m.m}/${t.id}"><span class="mode-icon">${m.icon}</span><span><b>${m.title}</b><br><span class="muted small">${m.sub}</span></span></a>`).join('')}</div>
  <div class="row-between"><h2>Liste des mots</h2><button class="btn btn-ghost btn-sm" id="playall">▶ Tout écouter</button></div>
  <div class="legend muted small"><span><i class="dot dot-new"></i> nouveau</span><span><i class="dot dot-learning"></i> en cours</span><span><i class="dot dot-due"></i> à revoir</span><span><i class="dot dot-mastered"></i> maîtrisé</span></div>
  <div class="card word-list">${t.words.map(w => wordRow(w)).join('')}</div>`;

  playButton($('#playall', el), '▶ Tout écouter', () => ({
    items: t.words.map(w => ({ text: w.es, lang: w.lang })),
    nodes: $$('.word-row', el),
  }));
};

Views.study = (el, mode, id, query) => {
  if (!['flash', 'qcm', 'write', 'listen', 'speak'].includes(mode)) return Views.notFound(el);
  const isReview = id === 'review';
  const theme = isReview ? null : Vocab.theme(id);
  if (!isReview && !theme) return Views.notFound(el);
  const back = isReview ? '#/' : `#/vocab/${id}`;
  let items;

  if (mode === 'flash') {
    const due = shuffle(Vocab.dueIds(theme && theme.id).map(i => WORD_BY_ID.get(i))).slice(0, 150);
    const newWords = theme ? Vocab.newWords(theme) : [];
    items = [...due, ...newWords.slice(0, query.has('more') ? 10 : Store.newQuota())];
    if (!items.length) {
      const msg = !theme ? 'Aucune carte à réviser pour le moment. Reviens demain, ou apprends de nouveaux mots.'
        : newWords.length ? `Tu as atteint ta limite de ${Store.settings.newPerDay} nouveaux mots pour aujourd’hui. Tu peux continuer si tu as la forme !`
        : 'Tu as vu tous les mots de ce thème et aucune révision n’est due.';
      el.innerHTML = endScreen('🎉', 'Tout est à jour !', `<p class="muted">${msg}</p>`,
        `${theme && newWords.length ? `<a class="btn btn-primary btn-lg" href="#/study/flash/${theme.id}?more">Apprendre 10 mots de plus</a>` : ''}
        ${theme ? `<a class="btn btn-ghost btn-lg" href="#/study/qcm/${theme.id}">Faire un QCM</a>` : `<a class="btn btn-primary btn-lg" href="#/vocab">Choisir un thème</a>`}
        <a class="btn btn-ghost btn-lg" href="${back}">Retour</a>`);
      return;
    }
  } else if (!theme) {
    const seen = ALL_WORDS.filter(w => !SRS.isNew(w.id));
    items = sample(seen.length >= 4 ? seen : Vocab.theme('bases').words, 15);
  } else if (mode === 'qcm') {
    items = sample(theme.words, 12);
  } else {
    // Écrire / écouter / dire : d'abord les mots déjà vus
    const seen = theme.words.filter(w => !SRS.isNew(w.id));
    items = [...shuffle(seen), ...shuffle(Vocab.newWords(theme))].slice(0, 12);
  }
  runSession(el, { mode, items, back, pool: theme ? theme.words : ALL_WORDS });
};

/* ================= GRAMMAIRE ================= */
Views.grammar = el => {
  const done = GRAMMAR.filter(g => Store.lessonPassed(g.id)).length;
  el.innerHTML = `
  ${pageHead('', '📖 Grammaire', `${GRAMMAR.length} leçons courtes de A1 à B1, avec exercices corrigés. ${done} validée${done > 1 ? 's' : ''}.`)}
  <div class="lesson-list">${GRAMMAR.map((g, i) => {
    const sc = Store.state.lessons[g.id];
    const ok = Store.lessonPassed(g.id);
    return `<a class="lesson-card ${ok ? 'done' : ''}" href="#/grammar/${g.id}">
      <span class="lesson-num">${ok ? '✓' : i + 1}</span>
      <span class="lesson-icon">${g.icon}</span>
      <span class="lesson-main"><b>${esc(g.title)}</b><span class="muted small">${g.summary}</span></span>
      <span class="lesson-side">${levelBadge(g.level)}${sc != null ? `<span class="score ${ok ? 'ok' : ''}">${sc} %</span>` : ''}</span>
    </a>`;
  }).join('')}</div>`;
};

Views.lesson = (el, id) => {
  const i = GRAMMAR.findIndex(g => g.id === id);
  if (i < 0) return Views.notFound(el);
  const g = GRAMMAR[i], prev = GRAMMAR[i - 1], nxt = GRAMMAR[i + 1];
  const best = Store.state.lessons[g.id];
  // Exercices : { q, opts, right } (choix) ou { q, answers } (à compléter)
  const prepared = g.ex.map(([q, a, right]) => (Array.isArray(a) ? { q, opts: a, right } : { q, answers: a.split('|') }));
  let exs = shuffle(prepared);

  el.innerHTML = `
  <a class="back" href="#/grammar">← Grammaire</a>
  ${pageHead(g.icon, esc(g.title), g.summary, levelBadge(g.level))}
  <article class="card lesson-body">${g.html}</article>
  <section class="card" id="ex-card">
    <div class="row-between wrap"><h2>✏️ Exercices</h2>${best != null ? `<span class="score ${Store.lessonPassed(g.id) ? 'ok' : ''}">Meilleur score : ${best} %</span>` : ''}</div>
    <p class="muted small">Complète, puis « Vérifier ». Entrée = question suivante. Les accents comptent !</p>
    <ol class="exercises" id="exs"></ol>
    <div class="sticky-acc">${accentBar()}</div>
    <div class="row gap-s wrap"><button class="btn btn-primary btn-lg" id="check">Vérifier mes réponses</button><button class="btn btn-ghost btn-lg" id="retry" hidden>Recommencer</button></div>
    <div id="ex-result"></div>
  </section>
  <nav class="pager">${prev ? `<a class="btn btn-ghost" href="#/grammar/${prev.id}">← ${esc(prev.title)}</a>` : '<span></span>'}${nxt ? `<a class="btn btn-ghost" href="#/grammar/${nxt.id}">${esc(nxt.title)} →</a>` : ''}</nav>`;

  const list = $('#exs', el), check = $('#check', el), retry = $('#retry', el), result = $('#ex-result', el);

  function render() {
    list.innerHTML = exs.map(e => {
      if (e.opts) {
        return `<li class="ex"><div class="ex-q">${esc(e.q)}</div>
          <div class="ex-opts">${e.opts.map((o, j) => `<button type="button" class="ex-opt" data-j="${j}">${esc(o)}</button>`).join('')}</div><div class="ex-fb"></div></li>`;
      }
      const blank = e.q.includes('___');
      const style = blank ? `width:${Math.max(5, ...e.answers.map(a => a.length + 2))}ch` : 'width:100%;max-width:30rem';
      const input = answerInput(`class="ex-input" style="${style}" aria-label="Réponse"`);
      return `<li class="ex"><div class="ex-q">${blank ? esc(e.q).replace('___', input) : `${esc(e.q)}<br>${input}`}</div><div class="ex-fb"></div></li>`;
    }).join('');
    $$('.ex-opt', list).forEach(b => {
      b.onclick = () => { $$('.ex-opt', b.parentNode).forEach(x => x.classList.remove('sel')); b.classList.add('sel'); };
    });
    const inputs = $$('.ex-input', list);
    inputs.forEach((inp, n) => {
      inp.addEventListener('keydown', ev => {
        if (ev.key !== 'Enter') return;
        ev.preventDefault();
        (inputs[n + 1] || check).focus();
      });
    });
  }

  check.onclick = () => {
    let ok = 0;
    exs.forEach((e, k) => {
      const li = list.children[k];
      let good;
      if (e.opts) {
        const btns = $$('.ex-opt', li);
        const chosen = btns.findIndex(b => b.classList.contains('sel'));
        good = chosen === e.right;
        revealChoice(btns, j => j === e.right, chosen);
      } else {
        const inp = $('.ex-input', li);
        const res = checkAnswer(inp.value, e.answers, { strict: true });
        good = res.ok;
        inp.disabled = true;
        inp.classList.add(good ? 'correct' : 'wrong');
        if (!good) {
          const hint = answerHint(res), sol = e.answers[0];
          $('.ex-fb', li).innerHTML = `→ <b>${esc(sol)}</b>${hint ? ` <span class="muted">(${hint})</span>` : ''} ${sayBtn(sol, 'es', 'say-sm')}`;
        }
      }
      li.classList.add(good ? 'is-ok' : 'is-ko');
      if (good) ok++;
    });
    const pct = Math.round(ok / exs.length * 100);
    const wasPassed = Store.lessonPassed(g.id);
    Store.state.lessons[g.id] = Math.max(Store.state.lessons[g.id] ?? 0, pct);
    Store.save();
    const passed = pct >= LESSON_PASS;
    const xp = ok * 2 + (passed && !wasPassed ? 20 : 0);
    Store.addXp(xp);
    result.innerHTML = feedbackBox(passed,
      pct === 100 ? '¡Perfecto! Sans faute 🎉' : passed ? '¡Muy bien! Leçon validée ✓' : 'Encore un petit effort !',
      `${ok}/${exs.length} bonnes réponses (${pct} %) · +${xp} XP${passed ? '' : ` — il faut ${LESSON_PASS} % pour valider la leçon.`}`,
      passed && nxt ? `<a class="btn btn-success" href="#/grammar/${nxt.id}">Leçon suivante →</a>` : '');
    check.hidden = true;
    retry.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
  retry.onclick = () => {
    exs = shuffle(prepared);
    render();
    result.innerHTML = '';
    check.hidden = false;
    retry.hidden = true;
    $('#ex-card', el).scrollIntoView({ behavior: 'smooth' });
  };
  render();
};

/* ================= CONJUGAISON ================= */
const GROUPS = [['irr', 'Irréguliers'], ['sc', 'À diphtongue (e→ie, o→ue, e→i)'], ['reg', 'Réguliers']];
const groupBadge = g => `<span class="badge grp-${g}">${{ irr: 'irrégulier', sc: 'diphtongue', reg: 'régulier' }[g]}</span>`;

Views.conj = (el, tab, arg) => {
  el.innerHTML = `
  ${pageHead('', '🔁 Conjugaison', `${VERBS.length} verbes essentiels, ${TENSES.length} temps, avec « vosotros » comme en Espagne.`)}
  <div class="tabs"><a class="tab ${tab !== 'drill' ? 'active' : ''}" href="#/conj/table/${arg && tab !== 'drill' ? encodeURIComponent(arg) : ''}">📋 Tableaux</a><a class="tab ${tab === 'drill' ? 'active' : ''}" href="#/conj/drill">🎯 Entraînement</a></div>
  <div id="conj-body"></div>`;
  const body = $('#conj-body', el);
  if (tab === 'drill') conjDrill(body); else conjTable(body, arg || 'ser');
};

function conjTable(body, inf) {
  const v = VERBS.find(x => x.inf === inf) || VERBS[0];
  const opts = GROUPS.map(([g, label]) => `<optgroup label="${label}">${VERBS.filter(x => x.g === g).map(x => `<option value="${x.inf}" ${x === v ? 'selected' : ''}>${x.inf} — ${esc(x.fr)}</option>`).join('')}</optgroup>`).join('');
  body.innerHTML = `
  <div class="card verb-head">
    <label class="verb-select">Choisis un verbe <select id="verb">${opts}</select></label>
    <div class="verb-title"><h2>${v.inf} ${sayBtn(v.inf)}</h2><span class="muted">${esc(v.fr)}</span> ${groupBadge(v.g)}</div>
    <div class="verb-meta"><span>Participe : <b>${Conj.part(v)}</b> ${sayBtn(Conj.part(v), 'es', 'say-sm')}</span><span>Gérondif : <b>${Conj.ger(v)}</b> ${sayBtn(Conj.ger(v), 'es', 'say-sm')}</span></div>
    <p class="muted small">Les formes <span class="irr-mark">en couleur</span> sont irrégulières. Clique sur une ligne pour l'écouter.</p>
  </div>
  <div class="tense-grid">${TENSES.map(t => {
    const f = Conj.forms(v, t.id), reg = Conj.regular(v, t.id);
    return `<div class="card tense-card"><h3>${t.es}</h3><p class="muted small">${t.fr}</p>
      <table class="conj-tbl">${Conj.persons(t).map(i => `<tr data-say="${esc(Conj.say(t, i, f[i]))}">
        <td class="pron">${Conj.label(t, i)}</td><td class="form ${f[i] !== reg[i] ? 'irr-mark' : ''}">${f[i]}</td><td class="spk">🔊</td></tr>`).join('')}</table></div>`;
  }).join('')}</div>`;
  $('#verb', body).onchange = e => { location.hash = '#/conj/table/' + encodeURIComponent(e.target.value); };
}

function conjDrill(body) {
  const s = Store.settings;
  let tenses = (s.conjTenses || []).filter(t => TENSES.some(x => x.id === t));
  if (!tenses.length) tenses = ['pres'];
  let group = s.conjGroup || 'all';
  let score = 0, count = 0, streak = 0, best = 0;
  const scoreHtml = () => `<span title="Bonnes réponses">✅ ${score}/${count}</span><span title="Série">🔥 ${streak}</span><span class="muted small">record : ${best}</span>`;

  body.innerHTML = `
  <div class="card drill-opts">
    <div class="muted small">Temps à travailler (plusieurs choix possibles) :</div>
    <div class="chip-row" id="tchips">${TENSES.map(t => `<button class="chip ${tenses.includes(t.id) ? 'on' : ''}" data-t="${t.id}">${t.es}</button>`).join('')}</div>
    <div class="muted small">Verbes :</div>
    <div class="chip-row" id="gchips">${[['all', 'Tous'], ['irr', 'Irréguliers'], ['sc', 'Diphtongues'], ['reg', 'Réguliers']].map(([k, l]) => `<button class="chip ${group === k ? 'on' : ''}" data-g="${k}">${l}</button>`).join('')}</div>
  </div>
  <div class="card drill-card" id="drill"></div>`;
  const drill = $('#drill', body);

  $$('#tchips .chip', body).forEach(c => {
    c.onclick = () => {
      const t = c.dataset.t;
      if (tenses.includes(t)) { if (tenses.length > 1) tenses = tenses.filter(x => x !== t); }
      else tenses.push(t);
      $$('#tchips .chip', body).forEach(x => x.classList.toggle('on', tenses.includes(x.dataset.t)));
      Store.set('conjTenses', tenses.slice());
      ask();
    };
  });
  $$('#gchips .chip', body).forEach(c => {
    c.onclick = () => {
      group = c.dataset.g;
      $$('#gchips .chip', body).forEach(x => x.classList.toggle('on', x === c));
      Store.set('conjGroup', group);
      ask();
    };
  });

  function ask() {
    const v = pick(VERBS.filter(x => group === 'all' || x.g === group));
    const t = pick(TENSES.filter(x => tenses.includes(x.id)));
    const p = pick(Conj.persons(t));
    const answer = Conj.forms(v, t.id)[p];
    const pron = t.labels ? t.labels[p] : pick(PRON_CHOICES[p]);
    drill.innerHTML = `
      <div class="drill-score">${scoreHtml()}</div>
      <div class="drill-verb">${v.inf} <span class="muted">(${esc(v.fr)})</span></div>
      <div class="drill-tense">${t.es} <span class="muted small">· ${t.fr}</span></div>
      <form id="df" class="drill-form" autocomplete="off">
        <span class="drill-pron">${t.prefix || ''}${pron}</span>
        ${answerInput('id="da" placeholder="…" aria-label="Ta réponse"')}
        <button class="btn btn-primary">OK</button>
      </form>
      ${accentBar()}
      <div id="dfb"></div>`;
    const inp = $('#da', drill), form = $('#df', drill);
    setTimeout(() => inp.focus(), 50);
    let answered = false;
    form.onsubmit = e => {
      e.preventDefault();
      if (answered) return ask();
      if (!inp.value.trim()) return;
      answered = true;
      const res = checkAnswer(inp.value, answer, { strict: true });
      count++;
      if (res.ok) { score++; streak++; best = Math.max(best, streak); Store.addXp(2); } else streak = 0;
      inp.readOnly = true;
      inp.classList.add(res.ok ? 'correct' : 'wrong');
      $('button', form).textContent = 'Suivant →';
      Speech.speak(Conj.say(t, p, answer, pron));
      const hint = answerHint(res);
      $('#dfb', drill).innerHTML = feedbackBox(res.ok,
        res.ok ? pick(PRAISE) : hint ? `Presque ! ${hint}` : 'Pas tout à fait…',
        `${res.ok ? '' : `Réponse : <b>${esc(answer)}</b> · `}<a href="#/conj/table/${encodeURIComponent(v.inf)}" class="link">voir le tableau de ${v.inf}</a>`,
        '<span class="muted small">Entrée pour continuer</span>');
      $('.drill-score', drill).innerHTML = scoreHtml();
    };
  }
  ask();
}

/* ================= DIALOGUES ================= */
Views.dialogues = el => {
  el.innerHTML = `
  ${pageHead('', '💬 Dialogues', 'Des situations réelles de ta future vie à Barcelone. Écoute, lis, puis joue un des rôles.')}
  <div class="theme-grid">${DIALOGUES.map(d => {
    const done = !!Store.state.dialogues[d.id];
    return cardLink({ href: `#/dialogues/${d.id}`, icon: d.icon, title: d.title, level: d.level, done, meta: done ? '✓ terminé' : d.lines.length + ' répliques' });
  }).join('')}</div>`;
};

Views.dialogue = (el, id) => {
  const d = DIALOGUE_BY_ID.get(id);
  if (!d) return Views.notFound(el);
  let showFr = false, role = null, step = 0, renderNo = 0;

  el.innerHTML = `
  <a class="back" href="#/dialogues">← Dialogues</a>
  ${pageHead(d.icon, esc(d.title), d.context, levelBadge(d.level))}
  <div class="toolbar">
    <button class="btn btn-primary" id="playall">▶ Écouter tout</button>
    <button class="btn btn-ghost" id="trans">👁 Traduction</button>
    <span class="toolbar-sep"></span>
    <span class="muted small">🎭 Jouer le rôle de :</span>
    <button class="btn btn-ghost" data-role="A">${esc(d.roles.A)}</button>
    <button class="btn btn-ghost" data-role="B">${esc(d.roles.B)}</button>
  </div>
  <div class="chat" id="chat"></div>
  <div id="rp"></div>
  <section class="card"><h2>🔑 Vocabulaire clé</h2><div class="word-list">${d.vocab.map(([es, fr]) => wordRow({ es, fr, lang: 'es' }, { dot: false })).join('')}</div></section>
  <section class="card"><h2>🧠 As-tu bien compris ?</h2><div id="quiz"></div></section>`;

  const chat = $('#chat', el), rp = $('#rp', el);
  const markDone = () => {
    if (Store.state.dialogues[d.id]) return;
    Store.state.dialogues[d.id] = true;
    Store.addXp(15);
    toast('Dialogue terminé ! +15 XP', 'ok');
  };
  const say = l => Speech.speak(l.es, d.voice[l.s]);
  const bubble = (l, mine) => `<div class="bubble ${mine ? 'me' : ''}">
      <div class="bubble-name">${esc(d.roles[l.s])}</div>
      <div class="bubble-es">${esc(l.es)} ${sayBtn(l.es)}</div>
      <div class="bubble-fr" ${showFr ? '' : 'hidden'}>${esc(l.fr)}</div></div>`;

  function renderAll() {
    chat.innerHTML = d.lines.map(l => bubble(l, l.s === d.me)).join('');
    rp.innerHTML = '';
  }

  function renderRole() {
    const r = ++renderNo;
    const html = d.lines.slice(0, step).map(l => bubble(l, l.s === role));
    if (step < d.lines.length) {
      const l = d.lines[step];
      if (l.s === role) {
        html.push(`<div class="bubble me prompt-bubble"><div class="bubble-name">À toi ! Dis en espagnol :</div><div class="bubble-fr">${esc(l.fr)}</div><div id="rp-heard" class="muted small"></div></div>`);
        rp.innerHTML = `<div class="rp-actions">${Speech.canListen ? '<button class="btn btn-primary" id="rp-mic">🎤 Je le dis</button>' : ''}<button class="btn ${Speech.canListen ? 'btn-ghost' : 'btn-primary'}" id="rp-reveal">👀 Voir la réponse</button><button class="btn btn-ghost" id="rp-quit">Quitter le jeu de rôle</button></div>`;
      } else {
        html.push(bubble(l, false));
        rp.innerHTML = `<div class="rp-actions"><button class="btn btn-primary" id="rp-next">Suivant ▶</button><button class="btn btn-ghost" id="rp-quit">Quitter le jeu de rôle</button></div>`;
        say(l);
      }
    } else {
      html.push(`<div class="rp-end">🎉 <b>¡Muy bien!</b> Tu as joué tout le dialogue.</div>`);
      rp.innerHTML = `<div class="rp-actions"><button class="btn btn-primary" id="rp-again">Rejouer</button><button class="btn btn-ghost" id="rp-swap">Jouer l’autre rôle</button><button class="btn btn-ghost" id="rp-quit">Revenir au dialogue</button></div>`;
      markDone();
    }
    chat.innerHTML = html.join('');
    if (chat.lastElementChild) chat.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const on = (sel, fn) => { const b = $(sel, rp); if (b) b.onclick = fn; };
    on('#rp-next', () => { step++; renderRole(); });
    on('#rp-reveal', () => { say(d.lines[step]); step++; renderRole(); });
    on('#rp-quit', () => { role = null; Speech.stop(); renderAll(); });
    on('#rp-again', () => { step = 0; renderRole(); });
    on('#rp-swap', () => { role = role === 'A' ? 'B' : 'A'; step = 0; renderRole(); });
    on('#rp-mic', async () => {
      const line = d.lines[step], heard = $('#rp-heard', chat);
      const alts = await Speech.capture($('#rp-mic', rp), heard);
      if (!alts || r !== renderNo) return;   // on a avancé pendant l'écoute
      const pct = Math.round(Math.max(...alts.map(a => similarity(a, line.es))) * 100);
      heard.innerHTML += ` — <b>${pct} %</b> ${pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '🔁'}`;
      if (pct >= 50) Store.addXp(2);
      $('#rp-reveal', rp).textContent = pct >= 80 ? 'Continuer ▶' : '👀 Voir la réponse';
    });
  }

  $('#trans', el).onclick = () => {
    showFr = !showFr;
    $('#trans', el).classList.toggle('on', showFr);
    $$('.bubble:not(.prompt-bubble) .bubble-fr', chat).forEach(x => { x.hidden = !showFr; });
  };
  $$('[data-role]', el).forEach(b => {
    b.onclick = () => { Speech.stop(); role = b.dataset.role; step = 0; renderRole(); chat.scrollIntoView({ behavior: 'smooth' }); };
  });
  playButton($('#playall', el), '▶ Écouter tout', () => {
    if (role) { role = null; renderAll(); }
    return { items: d.lines.map(l => ({ text: l.es, ...d.voice[l.s] })), nodes: $$('.bubble', chat) };
  }, { block: 'center', gap: 400 });

  // Compréhension
  const quiz = $('#quiz', el);
  let answered = 0, good = 0;
  quiz.innerHTML = d.quiz.map((q, k) => {
    const order = shuffle(q[1].map((o, j) => j));
    return `<div class="quiz-q" data-k="${k}"><p><b>${k + 1}.</b> ${esc(q[0])}</p><div class="ex-opts">${order.map(j => `<button type="button" class="ex-opt" data-j="${j}">${esc(q[1][j])}</button>`).join('')}</div></div>`;
  }).join('');
  $$('.quiz-q', quiz).forEach(box => {
    const q = d.quiz[+box.dataset.k];
    const btns = $$('.ex-opt', box);
    btns.forEach((b, chosen) => {
      b.onclick = () => {
        const ok = +b.dataset.j === q[2];
        revealChoice(btns, k => +btns[k].dataset.j === q[2], chosen);
        answered++;
        if (ok) { good++; Store.addXp(3); }
        if (answered === d.quiz.length) {
          quiz.insertAdjacentHTML('beforeend', feedbackBox(good === answered, `${good}/${answered} bonnes réponses`,
            good < answered ? 'Réécoute le dialogue avec la traduction pour vérifier.' : ''));
          if (good >= Math.ceil(answered / 2)) markDone();
        }
      };
    });
  });

  renderAll();
};

/* ================= PLAN ================= */
Views.plan = el => {
  const cur = Plan.currentWeek(), start = Plan.start();
  const dep = keyToIndex(Store.settings.departure);
  el.innerHTML = `
  ${pageHead('', '🗓️ Mon plan de 8 semaines', `Un parcours progressif jusqu’au départ, le ${formatDay(dep, { weekday: 'long', day: 'numeric', month: 'long' })}. 20 à 30 minutes par jour suffisent — avance à ton rythme, l’ordre n’est qu’une suggestion.`)}
  ${PLAN.map((w, i) => {
    const items = Plan.items(w), p = Plan.progress(items);
    return `<section class="card week ${i === cur ? 'current' : ''} ${p === 1 ? 'complete' : ''}">
      <div class="row-between wrap gap-s"><h2><span class="week-num">S${i + 1}</span> ${esc(w.title)} ${p === 1 ? '✅' : ''}</h2>
      <span class="muted small">${i === cur ? '<b class="now">cette semaine</b> · ' : ''}${formatDay(start + i * 7)} → ${formatDay(start + i * 7 + 6)}</span></div>
      <p class="muted">${w.goal}</p>${progressBar(p)}
      <div class="todo-list">${items.map(planItemRow).join('')}</div></section>`;
  }).join('')}
  <p class="muted small center">Un thème de vocabulaire est validé quand tu as vu 80 % de ses mots, une leçon à partir de ${LESSON_PASS} %, un dialogue quand tu l’as joué ou réussi son quiz. Tu peux changer la date de début dans les <a href="#/settings" class="link">réglages</a>.</p>`;
};

/* ================= RÉGLAGES ================= */
Views.settings = el => {
  const s = Store.settings;
  const voices = Speech.esVoices();
  const opt = (v, label, cur) => `<option value="${v}" ${String(cur) === String(v) ? 'selected' : ''}>${label}</option>`;
  el.innerHTML = `
  ${pageHead('', '⚙️ Réglages', '')}
  <section class="card form">
    <h2>Toi & ton voyage</h2>
    <label>Ton prénom <input type="text" data-k="name" value="${esc(s.name)}" placeholder="(facultatif)" maxlength="30"></label>
    <label>Date de départ pour Barcelone <input type="date" data-k="departure" value="${s.departure}"></label>
    <label>Début du plan de 8 semaines <input type="date" data-k="planStart" value="${Store.planStart()}"></label>
  </section>
  <section class="card form">
    <h2>Apprentissage</h2>
    <label>Objectif quotidien <select data-k="goal" data-num>${opt(20, '20 XP · tranquille', s.goal)}${opt(50, '50 XP · régulier', s.goal)}${opt(100, '100 XP · motivé', s.goal)}${opt(150, '150 XP · intensif', s.goal)}</select></label>
    <label>Nouveaux mots par jour <select data-k="newPerDay" data-num>${[5, 10, 15, 20, 30].map(n => opt(n, n + ' mots', s.newPerDay)).join('')}</select></label>
    <label>Sens des cartes mémoire <select data-k="direction">${opt('mix', 'Mélangé (recommandé)', s.direction)}${opt('es-fr', 'Espagnol → Français', s.direction)}${opt('fr-es', 'Français → Espagnol', s.direction)}</select></label>
    <label class="check"><input type="checkbox" data-k="autoplay" ${s.autoplay ? 'checked' : ''}> Lire automatiquement les mots à voix haute</label>
  </section>
  <section class="card form">
    <h2>Voix</h2>
    ${voices.length
      ? `<label>Voix espagnole <select data-k="voice">${opt('', 'Automatique (meilleure voix d’Espagne)', s.voice)}${voices.map(v => opt(esc(v.name), `${esc(v.name)} (${v.lang})`, s.voice)).join('')}</select></label>`
      : `<div class="tip warn">⚠️ ${Speech.canSpeak ? 'Aucune voix espagnole trouvée sur cet appareil.' : 'Ton navigateur ne permet pas la lecture à voix haute.'}<br>
         <b>Windows</b> : Paramètres → Heure et langue → Voix → Ajouter des voix → « Español (España) ».<br>
         <b>Chrome / Edge</b> proposent aussi des voix espagnoles en ligne.<br>
         <b>iPhone / Android</b> : Réglages → Accessibilité / Synthèse vocale → télécharger une voix espagnole.</div>`}
    <label>Vitesse de lecture : <b id="rate-v">${s.rate}</b><input type="range" min="0.5" max="1.2" step="0.05" data-k="rate" data-num value="${s.rate}"></label>
    <button class="btn btn-ghost" id="test-voice" type="button">🔊 Tester la voix</button>
  </section>
  <section class="card form">
    <h2>Sauvegarde</h2>
    <p class="muted small">Ta progression est enregistrée dans ce navigateur, sur cet appareil. Exporte-la pour la transférer ailleurs (par exemple sur ton téléphone), puis importe le fichier là-bas.</p>
    <div class="row gap-s wrap">
      <button class="btn btn-ghost" id="export" type="button">⬇️ Exporter ma progression</button>
      <label class="btn btn-ghost">⬆️ Importer<input type="file" id="import" accept="application/json,.json" hidden></label>
      <button class="btn btn-danger-ghost" id="reset" type="button">🗑️ Tout réinitialiser</button>
    </div>
  </section>
  <p class="muted small center">Rumbo a Barcelona · ${ALL_WORDS.length} mots · ${GRAMMAR.length} leçons · ${VERBS.length} verbes · ${DIALOGUES.length} dialogues · ${Store.totalXp()} XP au total</p>`;

  $('[data-k="rate"]', el).addEventListener('input', e => { $('#rate-v', el).textContent = e.target.value; });
  $$('[data-k]', el).forEach(inp => {
    inp.addEventListener('change', () => {
      let v = inp.type === 'checkbox' ? inp.checked : inp.value;
      if (inp.hasAttribute('data-num')) v = Number(v);
      if (inp.type === 'date' && !v) return;
      Store.set(inp.dataset.k, v);
      if (inp.dataset.k === 'departure' || inp.dataset.k === 'goal') renderTopStats();
    });
  });
  $('#test-voice', el).onclick = () => Speech.speak('¡Hola! Bienvenido a Barcelona. ¿Qué tal estás?');
  $('#export', el).onclick = () => {
    const blob = new Blob([Store.exportJson()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `rumbo-a-barcelona-${todayKey()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  $('#import', el).onchange = e => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try { Store.importJson(r.result); toast('Progression importée ✓', 'ok'); route(); }
      catch (err) { toast('Import impossible : ' + err.message, 'ko'); }
    };
    r.readAsText(f);
  };
  $('#reset', el).onclick = () => {
    if (!confirm('Effacer toute ta progression ? Cette action est irréversible (pense à exporter avant).')) return;
    Store.reset();
    toast('Progression effacée');
    location.hash = '#/';
  };
  if (!voices.length && Speech.canSpeak) {
    const off = Speech.onVoices(() => { if (Speech.esVoices().length) { off(); route(); } });
    setCleanup(off);
  }
};

Views.notFound = el => {
  el.innerHTML = endScreen('🤷', 'Page introuvable', '', '<a class="btn btn-primary" href="#/">Retour à l’accueil</a>');
};
