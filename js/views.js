'use strict';
/* ===== Écrans de l'application ===== */

const Views = {};
const daysToDeparture = () => keyToIndex(Store.settings.departure) - dayIndex();

/* ---------- Plan de 8 semaines ---------- */
const Plan = {
  start() { return keyToIndex(Store.planStart()); },
  currentWeek() { return Math.max(0, Math.min(PLAN.length - 1, Math.floor((dayIndex() - this.start()) / 7))); },
  items(w) {
    return [
      ...w.vocab.map(id => ({ type: 'vocab', id })),
      ...w.grammar.map(id => ({ type: 'grammar', id })),
      ...w.dialogues.map(id => ({ type: 'dialogue', id })),
    ];
  },
  isDone(it) {
    if (it.type === 'vocab') { const s = Vocab.stats(Vocab.theme(it.id)); return s.seen / s.total >= 0.8; }
    if (it.type === 'grammar') return (Store.state.lessons[it.id] || 0) >= 70;
    return !!Store.state.dialogues[it.id];
  },
  progress(w) { const its = this.items(w); return its.filter(i => this.isDone(i)).length / its.length; },
  pending(w) { return this.items(w).filter(i => !this.isDone(i)); },
};

function planItemRow(it) {
  let icon, label, kind, href, extra = '';
  if (it.type === 'vocab') {
    const t = Vocab.theme(it.id), s = Vocab.stats(t);
    [icon, label, kind, href, extra] = [t.icon, t.title, 'Vocabulaire', `#/vocab/${t.id}`, `${s.seen}/${s.total} mots`];
  } else if (it.type === 'grammar') {
    const g = GRAMMAR.find(x => x.id === it.id), sc = Store.state.lessons[g.id];
    [icon, label, kind, href, extra] = [g.icon, g.title, 'Grammaire', `#/grammar/${g.id}`, sc != null ? `${sc} %` : ''];
  } else {
    const d = DIALOGUES.find(x => x.id === it.id);
    [icon, label, kind, href] = [d.icon, d.title, 'Dialogue', `#/dialogues/${d.id}`];
  }
  const done = Plan.isDone(it);
  return `<a class="todo ${done ? 'done' : ''}" href="${href}">
    <span class="todo-check">${done ? '✓' : ''}</span><span class="todo-icon">${icon}</span>
    <span class="todo-main"><span class="todo-kind">${kind}</span><span>${esc(label)}</span></span>
    <span class="muted small nowrap">${extra}</span></a>`;
}

/* ---------- Morceaux réutilisables ---------- */
function wordRow(w, showTheme = false) {
  const st = SRS.status(w.id);
  const t = showTheme ? Vocab.theme(w.theme) : null;
  return `<div class="word-row">
    <span class="dot dot-${st}" title="${STATUS_LABEL[st]}"></span>
    <div class="word-main">
      <div class="word-es">${esc(w.es)}</div>
      <div class="word-fr">${esc(w.fr)}</div>
      ${w.ex ? `<div class="word-ex">${esc(w.ex)} ${sayBtn(w.ex, w.lang, 'say-sm')}<br><span class="muted">${esc(w.exFr || '')}</span></div>` : ''}
      ${t ? `<a class="muted small" href="#/vocab/${t.id}">${t.icon} ${esc(t.title)}</a>` : ''}
    </div>
    ${sayBtn(w.es, w.lang)}
  </div>`;
}
function statTile(icon, value, label, ratio) {
  return `<div class="stat"><span class="stat-icon">${icon}</span><div><div class="stat-value">${value}</div><div class="stat-label">${label}</div>${ratio != null ? progressBar(ratio, 'bar-xs') : ''}</div></div>`;
}
function pageHead(icon, title, sub, badge = '') {
  return `<header class="page-head">${icon ? `<div class="page-icon">${icon}</div>` : ''}<div>${badge}<h1>${title}</h1>${sub ? `<p class="muted">${sub}</p>` : ''}</div></header>`;
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
  const pending = Plan.pending(week).slice(0, 4);
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
    ${progressBar(Plan.progress(week))}
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
function themeCard(t) {
  const s = Vocab.stats(t);
  return `<a class="theme-card ${s.seen === s.total ? 'done' : ''}" href="#/vocab/${t.id}">
    <div class="theme-icon">${t.icon}</div>
    <div class="theme-body">
      <div class="theme-title">${esc(t.title)}</div>
      <div class="theme-meta">${levelBadge(t.level)}<span class="muted small">${s.seen}/${s.total} mots${s.mastered ? ` · ${s.mastered} 🏆` : ''}</span></div>
      ${progressBar(s.seen / s.total)}
    </div></a>`;
}

Views.vocab = el => {
  el.innerHTML = `
  ${pageHead('', '📚 Vocabulaire', `${ALL_WORDS.length} mots et expressions classés par situations de ta vie à Barcelone.`)}
  <div class="search"><input id="q" type="search" placeholder="🔎 Chercher un mot en français ou en espagnol…" autocomplete="off"></div>
  <div id="results"></div>
  <div class="theme-grid" id="grid">${VOCAB.map(themeCard).join('')}</div>`;
  const q = $('#q', el), res = $('#results', el), grid = $('#grid', el);
  q.addEventListener('input', () => {
    const v = stripAccents(norm(q.value));
    if (v.length < 2) { res.innerHTML = ''; grid.hidden = false; return; }
    const hits = ALL_WORDS.filter(w => stripAccents(norm(w.es)).includes(v) || stripAccents(norm(w.fr)).includes(v)).slice(0, 60);
    grid.hidden = true;
    res.innerHTML = hits.length ? `<div class="card word-list">${hits.map(w => wordRow(w, true)).join('')}</div>` : '<p class="muted center">Aucun résultat.</p>';
  });
};

Views.theme = (el, id) => {
  const t = Vocab.theme(id);
  if (!t) return Views.notFound(el);
  const s = Vocab.stats(t);
  const due = Vocab.dueIds(id).length;
  const newLeft = t.words.filter(w => SRS.isNew(w.id)).length;
  const quota = Math.max(0, Store.settings.newPerDay - Store.newSeenToday());
  const modes = [
    { m: 'flash', icon: '🃏', title: 'Cartes mémoire', sub: `${Math.min(newLeft, quota)} nouveaux · ${due} à revoir` },
    { m: 'qcm', icon: '✅', title: 'QCM', sub: 'Choisis la bonne traduction' },
    { m: 'write', icon: '✍️', title: 'Écriture', sub: `Écris le mot en ${langName(t.words[0].lang)}` },
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

  let playing = false;
  const btn = $('#playall', el);
  setCleanup(() => { playing = false; });
  btn.onclick = async () => {
    if (playing) { playing = false; Speech.stop(); btn.textContent = '▶ Tout écouter'; return; }
    playing = true;
    btn.textContent = '■ Arrêter';
    const rows = $$('.word-row', el);
    for (let i = 0; i < t.words.length && playing; i++) {
      rows[i].classList.add('speaking');
      rows[i].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      await Speech.speak(t.words[i].es, { lang: t.words[i].lang });
      rows[i].classList.remove('speaking');
      await new Promise(r => setTimeout(r, 350));
    }
    playing = false;
    if (document.body.contains(btn)) btn.textContent = '▶ Tout écouter';
  };
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
    let fresh = [];
    if (theme) {
      const quota = query.has('more') ? 10 : Math.max(0, Store.settings.newPerDay - Store.newSeenToday());
      fresh = theme.words.filter(w => SRS.isNew(w.id)).slice(0, quota);
    }
    items = [...due, ...fresh];
    if (!items.length) {
      const newLeft = theme ? theme.words.filter(w => SRS.isNew(w.id)).length : 0;
      el.innerHTML = `<div class="session-end">
        <div class="big-emoji">🎉</div><h1>Tout est à jour !</h1>
        <p class="muted">${theme ? (newLeft ? `Tu as atteint ta limite de ${Store.settings.newPerDay} nouveaux mots pour aujourd’hui. Tu peux continuer si tu as la forme !` : 'Tu as vu tous les mots de ce thème et aucune révision n’est due.') : 'Aucune carte à réviser pour le moment. Reviens demain, ou apprends de nouveaux mots.'}</p>
        <div class="row center gap-s wrap">${theme && newLeft ? `<a class="btn btn-primary btn-lg" href="#/study/flash/${theme.id}?more">Apprendre 10 mots de plus</a>` : ''}
        ${theme ? `<a class="btn btn-ghost btn-lg" href="#/study/qcm/${theme.id}">Faire un QCM</a>` : `<a class="btn btn-primary btn-lg" href="#/vocab">Choisir un thème</a>`}
        <a class="btn btn-ghost btn-lg" href="${back}">Retour</a></div></div>`;
      return;
    }
  } else {
    let pool = theme ? theme.words : ALL_WORDS.filter(w => !SRS.isNew(w.id));
    if (!theme && pool.length < 4) pool = Vocab.theme('bases').words;
    const seen = pool.filter(w => !SRS.isNew(w.id));
    const unseen = pool.filter(w => SRS.isNew(w.id));
    items = mode === 'qcm' || isReview ? sample(pool, isReview ? 15 : 12) : [...shuffle(seen), ...shuffle(unseen)].slice(0, 12);
  }
  runSession(el, { mode, items, back, pool: theme ? theme.words : ALL_WORDS });
};

/* ================= GRAMMAIRE ================= */
Views.grammar = el => {
  const done = GRAMMAR.filter(g => (Store.state.lessons[g.id] || 0) >= 70).length;
  el.innerHTML = `
  ${pageHead('', '📖 Grammaire', `${GRAMMAR.length} leçons courtes de A1 à B1, avec exercices corrigés. ${done} validée${done > 1 ? 's' : ''}.`)}
  <div class="lesson-list">${GRAMMAR.map((g, i) => {
    const sc = Store.state.lessons[g.id];
    const ok = sc >= 70;
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
  let exs = shuffle(g.ex);

  el.innerHTML = `
  <a class="back" href="#/grammar">← Grammaire</a>
  ${pageHead(g.icon, esc(g.title), g.summary, levelBadge(g.level))}
  <article class="card lesson-body">${g.html}</article>
  <section class="card" id="ex-card">
    <div class="row-between wrap"><h2>✏️ Exercices</h2>${best != null ? `<span class="score ${best >= 70 ? 'ok' : ''}">Meilleur score : ${best} %</span>` : ''}</div>
    <p class="muted small">Complète, puis « Vérifier ». Entrée = question suivante. Les accents comptent !</p>
    <ol class="exercises" id="exs"></ol>
    <div class="sticky-acc">${accentBar()}</div>
    <div class="row gap-s wrap"><button class="btn btn-primary btn-lg" id="check">Vérifier mes réponses</button><button class="btn btn-ghost btn-lg" id="retry" hidden>Recommencer</button></div>
    <div id="ex-result"></div>
  </section>
  <nav class="pager">${prev ? `<a class="btn btn-ghost" href="#/grammar/${prev.id}">← ${esc(prev.title)}</a>` : '<span></span>'}${nxt ? `<a class="btn btn-ghost" href="#/grammar/${nxt.id}">${esc(nxt.title)} →</a>` : ''}</nav>`;

  const list = $('#exs', el), check = $('#check', el), retry = $('#retry', el), result = $('#ex-result', el);
  const answers = e => e[1].split('|');

  function render() {
    list.innerHTML = exs.map((e, k) => {
      if (Array.isArray(e[1])) {
        return `<li class="ex"><div class="ex-q">${esc(e[0])}</div>
          <div class="ex-opts">${e[1].map((o, j) => `<button type="button" class="ex-opt" data-j="${j}">${esc(o)}</button>`).join('')}</div><div class="ex-fb"></div></li>`;
      }
      const w = Math.max(5, ...answers(e).map(a => a.length + 2));
      const input = `<input type="text" class="ex-input" data-k="${k}" style="width:${w}ch" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Réponse">`;
      const q = e[0].includes('___') ? esc(e[0]).replace('___', input) : `${esc(e[0])}<br>${input.replace(/style="[^"]*"/, 'style="width:100%;max-width:30rem"')}`;
      return `<li class="ex"><div class="ex-q">${q}</div><div class="ex-fb"></div></li>`;
    }).join('');
    $$('.ex-opt', list).forEach(b => {
      b.onclick = () => { $$('.ex-opt', b.parentNode).forEach(x => x.classList.remove('sel')); b.classList.add('sel'); };
    });
    const inputs = $$('.ex-input', list);
    inputs.forEach((inp, n) => {
      inp.addEventListener('keydown', ev => {
        if (ev.key !== 'Enter') return;
        ev.preventDefault();
        if (inputs[n + 1]) inputs[n + 1].focus(); else check.focus();
      });
    });
  }

  check.onclick = () => {
    let ok = 0;
    exs.forEach((e, k) => {
      const li = list.children[k], fb = $('.ex-fb', li);
      let good;
      if (Array.isArray(e[1])) {
        const sel = $('.ex-opt.sel', li);
        const j = sel ? +sel.dataset.j : -1;
        good = j === e[2];
        $$('.ex-opt', li).forEach((b, jj) => {
          b.disabled = true;
          if (jj === e[2]) b.classList.add('correct'); else if (jj === j) b.classList.add('wrong');
        });
      } else {
        const inp = $('.ex-input', li);
        const res = checkAnswer(inp.value, answers(e), { strict: true });
        good = res.ok;
        inp.disabled = true;
        inp.classList.add(good ? 'correct' : 'wrong');
        const sol = answers(e)[0];
        if (!good) fb.innerHTML = `→ <b>${esc(sol)}</b>${res.kind === 'accents' ? ' <span class="muted">(attention à l’accent)</span>' : ''} ${sayBtn(sol, 'es', 'say-sm')}`;
      }
      li.classList.add(good ? 'is-ok' : 'is-ko');
      if (good) ok++;
    });
    const pct = Math.round(ok / exs.length * 100);
    const prevBest = Store.state.lessons[g.id];
    Store.state.lessons[g.id] = Math.max(prevBest ?? 0, pct);
    Store.save();
    const firstPass = pct >= 70 && !(prevBest >= 70);
    const xp = ok * 2 + (firstPass ? 20 : 0);
    Store.addXp(xp);
    result.innerHTML = `<div class="feedback ${pct >= 70 ? 'ok' : 'ko'}"><div class="fb-text">
      <b>${pct === 100 ? '¡Perfecto! Sans faute 🎉' : pct >= 70 ? '¡Muy bien! Leçon validée ✓' : 'Encore un petit effort !'}</b>
      <div>${ok}/${exs.length} bonnes réponses (${pct} %) · +${xp} XP${pct < 70 ? ' — il faut 70 % pour valider la leçon.' : ''}</div></div>
      ${pct >= 70 && nxt ? `<div class="fb-btns"><a class="btn btn-success" href="#/grammar/${nxt.id}">Leçon suivante →</a></div>` : ''}</div>`;
    check.hidden = true;
    retry.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
  retry.onclick = () => {
    exs = shuffle(g.ex);
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
  const sayText = (t, i, f) => t === 'imp' ? f : t === 'subj' ? `que ${PRON_CHOICES[i][0]} ${f}` : `${PRON_CHOICES[i][0]} ${f}`;
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
      <table class="conj-tbl">${f.map((x, i) => x === '—' ? '' : `<tr data-say="${esc(sayText(t.id, i, x))}">
        <td class="pron">${t.id === 'imp' ? IMP_LABELS[i] : PERSONS[i]}</td><td class="form ${x !== reg[i] ? 'irr-mark' : ''}">${x}</td><td class="spk">🔊</td></tr>`).join('')}</table></div>`;
  }).join('')}</div>`;
  $('#verb', body).onchange = e => { location.hash = '#/conj/table/' + encodeURIComponent(e.target.value); };
}

function conjDrill(body) {
  const s = Store.settings;
  let tenses = (s.conjTenses || []).filter(t => TENSES.some(x => x.id === t));
  if (!tenses.length) tenses = ['pres'];
  let group = s.conjGroup || 'all';
  let score = 0, count = 0, streak = 0, best = 0;

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
    const verbs = VERBS.filter(v => group === 'all' || v.g === group);
    const v = pick(verbs), tid = pick(tenses), t = TENSES.find(x => x.id === tid);
    const p = pick(tid === 'imp' ? [1, 2, 4, 5] : [0, 1, 2, 3, 4, 5]);
    const answer = Conj.forms(v, tid)[p];
    const pron = tid === 'imp' ? IMP_LABELS[p] : pick(PRON_CHOICES[p]);
    drill.innerHTML = `
      <div class="drill-score"><span title="Bonnes réponses">✅ ${score}/${count}</span><span title="Série">🔥 ${streak}</span><span class="muted small">record : ${best}</span></div>
      <div class="drill-verb">${v.inf} <span class="muted">(${esc(v.fr)})</span></div>
      <div class="drill-tense">${t.es} <span class="muted small">· ${t.fr}</span></div>
      <form id="df" class="drill-form" autocomplete="off">
        <span class="drill-pron">${tid === 'subj' ? 'que ' : ''}${pron}</span>
        <input id="da" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="…" aria-label="Ta réponse">
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
      Speech.speak(tid === 'imp' ? answer : `${pron} ${answer}`);
      $('#dfb', drill).innerHTML = `<div class="feedback ${res.ok ? 'ok' : 'ko'}"><div class="fb-text">
        <b>${res.ok ? pick(PRAISE) : res.kind === 'accents' ? 'Presque ! Attention à l’accent' : 'Pas tout à fait…'}</b>
        <div>${res.ok ? '' : `Réponse : <b>${esc(answer)}</b> · `}<a href="#/conj/table/${encodeURIComponent(v.inf)}" class="link">voir le tableau de ${v.inf}</a></div></div>
        <div class="fb-btns"><span class="muted small">Entrée pour continuer</span></div></div>`;
      $('.drill-score', drill).innerHTML = `<span>✅ ${score}/${count}</span><span>🔥 ${streak}</span><span class="muted small">record : ${best}</span>`;
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
    return `<a class="theme-card ${done ? 'done' : ''}" href="#/dialogues/${d.id}"><div class="theme-icon">${d.icon}</div>
      <div class="theme-body"><div class="theme-title">${esc(d.title)}</div>
      <div class="theme-meta">${levelBadge(d.level)}<span class="muted small">${done ? '✓ terminé' : d.lines.length + ' répliques'}</span></div></div></a>`;
  }).join('')}</div>`;
};

Views.dialogue = (el, id) => {
  const d = DIALOGUES.find(x => x.id === id);
  if (!d) return Views.notFound(el);
  let showFr = false, role = null, step = 0, playing = false;
  setCleanup(() => { playing = false; });

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
  <section class="card"><h2>🔑 Vocabulaire clé</h2><div class="word-list">${d.vocab.map(([es, fr]) => `<div class="word-row"><div class="word-main"><div class="word-es">${esc(es)}</div><div class="word-fr">${esc(fr)}</div></div>${sayBtn(es)}</div>`).join('')}</div></section>
  <section class="card"><h2>🧠 As-tu bien compris ?</h2><div id="quiz"></div></section>`;

  const chat = $('#chat', el), rp = $('#rp', el);
  const markDone = () => {
    if (Store.state.dialogues[d.id]) return;
    Store.state.dialogues[d.id] = true;
    Store.save();
    Store.addXp(15);
    toast('Dialogue terminé ! +15 XP', 'ok');
  };
  const bubble = (l, i, mine, extra = '') => `<div class="bubble ${mine ? 'me' : ''}" data-i="${i}">
      <div class="bubble-name">${esc(d.roles[l.s])}</div>
      <div class="bubble-es">${esc(l.es)} ${sayBtn(l.es)}</div>
      <div class="bubble-fr ${showFr ? '' : 'hidden'}">${esc(l.fr)}</div>${extra}</div>`;

  function renderAll() {
    chat.innerHTML = d.lines.map((l, i) => bubble(l, i, l.s === 'B')).join('');
    rp.innerHTML = '';
  }

  function renderRole() {
    const html = [];
    for (let i = 0; i < Math.min(step, d.lines.length); i++) html.push(bubble(d.lines[i], i, d.lines[i].s === role));
    if (step < d.lines.length) {
      const l = d.lines[step];
      if (l.s === role) {
        html.push(`<div class="bubble me prompt-bubble"><div class="bubble-name">À toi ! Dis en espagnol :</div><div class="bubble-fr">${esc(l.fr)}</div><div id="rp-heard" class="muted small"></div></div>`);
        rp.innerHTML = `<div class="rp-actions">${Speech.canListen ? '<button class="btn btn-primary" id="rp-mic">🎤 Je le dis</button>' : ''}<button class="btn ${Speech.canListen ? 'btn-ghost' : 'btn-primary'}" id="rp-reveal">👀 Voir la réponse</button><button class="btn btn-ghost" id="rp-quit">Quitter le jeu de rôle</button></div>`;
      } else {
        html.push(bubble(l, step, false));
        rp.innerHTML = `<div class="rp-actions"><button class="btn btn-primary" id="rp-next">Suivant ▶</button><button class="btn btn-ghost" id="rp-quit">Quitter le jeu de rôle</button></div>`;
        Speech.speak(l.es, { alt: l.s === 'B' });
      }
    } else {
      html.push(`<div class="rp-end">🎉 <b>¡Muy bien!</b> Tu as joué tout le dialogue.</div>`);
      rp.innerHTML = `<div class="rp-actions"><button class="btn btn-primary" id="rp-again">Rejouer</button><button class="btn btn-ghost" data-swap>Jouer l’autre rôle</button><button class="btn btn-ghost" id="rp-quit">Revenir au dialogue</button></div>`;
      markDone();
    }
    chat.innerHTML = html.join('');
    const last = chat.lastElementChild;
    if (last) last.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const on = (sel, fn) => { const b = $(sel, rp); if (b) b.onclick = fn; };
    on('#rp-next', () => { step++; renderRole(); });
    on('#rp-reveal', () => { Speech.speak(d.lines[step].es, { alt: d.lines[step].s === 'B' }); step++; renderRole(); });
    on('#rp-quit', () => { role = null; Speech.stop(); renderAll(); });
    on('#rp-again', () => { step = 0; renderRole(); });
    on('[data-swap]', () => { role = role === 'A' ? 'B' : 'A'; step = 0; renderRole(); });
    on('#rp-mic', async () => {
      const heard = $('#rp-heard', chat), mic = $('#rp-mic', rp);
      mic.disabled = true;
      heard.textContent = 'Je t’écoute…';
      try {
        const alts = await Speech.listen();
        if (!alts.length) { heard.textContent = 'Je n’ai rien entendu, réessaie.'; return; }
        const score = Math.max(...alts.map(a => similarity(a, d.lines[step].es)));
        const pct = Math.round(score * 100);
        heard.innerHTML = `J’ai entendu : « ${esc(alts[0])} » — <b>${pct} %</b> ${pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '🔁'}`;
        if (pct >= 50) Store.addXp(2);
        $('#rp-reveal', rp).textContent = pct >= 80 ? 'Continuer ▶' : '👀 Voir la réponse';
      } catch (err) {
        heard.textContent = Speech.micError(err);
      } finally { mic.disabled = false; }
    });
  }

  $('#trans', el).onclick = () => {
    showFr = !showFr;
    $('#trans', el).classList.toggle('on', showFr);
    $$('.bubble:not(.prompt-bubble) .bubble-fr', chat).forEach(x => x.classList.toggle('hidden', !showFr));
  };
  $$('[data-role]', el).forEach(b => {
    b.onclick = () => { playing = false; Speech.stop(); role = b.dataset.role; step = 0; renderRole(); chat.scrollIntoView({ behavior: 'smooth' }); };
  });
  const playBtn = $('#playall', el);
  playBtn.onclick = async () => {
    if (playing) { playing = false; Speech.stop(); return; }
    if (role) { role = null; renderAll(); }
    playing = true;
    playBtn.textContent = '■ Arrêter';
    const bubbles = $$('.bubble', chat);
    for (let i = 0; i < d.lines.length && playing; i++) {
      bubbles[i].classList.add('speaking');
      bubbles[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
      await Speech.speak(d.lines[i].es, { alt: d.lines[i].s === 'B', pitch: d.lines[i].s === 'B' ? 1.1 : 0.95 });
      bubbles[i].classList.remove('speaking');
      await new Promise(r => setTimeout(r, 400));
    }
    playing = false;
    if (document.body.contains(playBtn)) playBtn.textContent = '▶ Écouter tout';
  };

  // Compréhension
  const quiz = $('#quiz', el);
  let answered = 0, good = 0;
  quiz.innerHTML = d.quiz.map((q, k) => {
    const order = shuffle(q[1].map((o, j) => j));
    return `<div class="quiz-q" data-k="${k}"><p><b>${k + 1}.</b> ${esc(q[0])}</p><div class="ex-opts">${order.map(j => `<button type="button" class="ex-opt" data-j="${j}">${esc(q[1][j])}</button>`).join('')}</div></div>`;
  }).join('');
  $$('.quiz-q', quiz).forEach(box => {
    const q = d.quiz[+box.dataset.k];
    $$('.ex-opt', box).forEach(b => {
      b.onclick = () => {
        const j = +b.dataset.j, ok = j === q[2];
        $$('.ex-opt', box).forEach(x => { x.disabled = true; if (+x.dataset.j === q[2]) x.classList.add('correct'); });
        if (!ok) b.classList.add('wrong');
        answered++;
        if (ok) { good++; Store.addXp(3); }
        if (answered === d.quiz.length) {
          quiz.insertAdjacentHTML('beforeend', `<div class="feedback ${good === answered ? 'ok' : 'ko'}"><div class="fb-text"><b>${good}/${answered} bonnes réponses</b>${good < answered ? '<div>Réécoute le dialogue avec la traduction pour vérifier.</div>' : ''}</div></div>`);
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
    const p = Plan.progress(w);
    return `<section class="card week ${i === cur ? 'current' : ''} ${p === 1 ? 'complete' : ''}">
      <div class="row-between wrap gap-s"><h2><span class="week-num">S${i + 1}</span> ${esc(w.title)} ${p === 1 ? '✅' : ''}</h2>
      <span class="muted small">${i === cur ? '<b class="now">cette semaine</b> · ' : ''}${formatDay(start + i * 7)} → ${formatDay(start + i * 7 + 6)}</span></div>
      <p class="muted">${w.goal}</p>${progressBar(p)}
      <div class="todo-list">${Plan.items(w).map(planItemRow).join('')}</div></section>`;
  }).join('')}
  <p class="muted small center">Un thème de vocabulaire est validé quand tu as vu 80 % de ses mots, une leçon à partir de 70 %, un dialogue quand tu l’as joué ou réussi son quiz. Tu peux changer la date de début dans les <a href="#/settings" class="link">réglages</a>.</p>`;
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
  <p class="muted small center">Rumbo a Barcelona · ${ALL_WORDS.length} mots · ${GRAMMAR.length} leçons · ${VERBS.length} verbes · ${DIALOGUES.length} dialogues · ${Store.state.totalXp} XP au total</p>`;

  $$('[data-k]', el).forEach(inp => {
    const evt = inp.type === 'range' || inp.type === 'text' ? 'input' : 'change';
    inp.addEventListener(evt, () => {
      let v = inp.type === 'checkbox' ? inp.checked : inp.value;
      if (inp.hasAttribute('data-num')) v = Number(v);
      if (inp.type === 'date' && !v) return;
      Store.set(inp.dataset.k, v);
      if (inp.dataset.k === 'rate') $('#rate-v', el).textContent = v;
      renderTopStats();
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
    route();
  };
  if (!voices.length && Speech.canSpeak) {
    const off = Speech.onVoices(() => { if (Speech.esVoices().length) { off(); route(); } });
    setCleanup(off);
  }
};

Views.notFound = el => {
  el.innerHTML = `<div class="session-end"><div class="big-emoji">🤷</div><h1>Page introuvable</h1><a class="btn btn-primary" href="#/">Retour à l’accueil</a></div>`;
};
