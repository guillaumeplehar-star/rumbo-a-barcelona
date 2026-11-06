'use strict';
/* ===== Séances d'exercices de vocabulaire : cartes, QCM, écriture, dictée, prononciation ===== */

const PRAISE = ['¡Muy bien!', '¡Perfecto!', '¡Genial!', '¡Eso es!', '¡Bravo!', '¡Fenomenal!', '¡Olé!'];
const langName = l => (l === 'ca' ? 'catalan' : 'espagnol');

function runSession(el, cfg) {
  const { mode, back } = cfg;
  const queue = cfg.items.slice();
  const total = queue.length;
  let completed = 0, correct = 0, xpEarned = 0;
  let step = 0, alive = true;   // step change à chaque question ; alive passe à false quand on quitte la page
  const mistakes = new Map();
  let keyFn = null;

  const onKey = e => {
    if (!keyFn || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.matches('input, textarea, select') && e.key !== 'Enter') return;
    keyFn(e);
  };
  document.addEventListener('keydown', onKey);
  document.body.classList.add('in-session');
  setCleanup(() => {
    alive = false;
    document.removeEventListener('keydown', onKey);
    document.body.classList.remove('in-session');
  });

  /** Lance fn plus tard, seulement si on est toujours sur la même question. */
  const later = (fn, ms) => { const s = step; setTimeout(() => { if (alive && s === step) fn(); }, ms); };
  const gain = n => { xpEarned += n; Store.addXp(n); };
  /** Enregistre le résultat d'une question (hors cartes mémoire). */
  const record = (w, ok, xp, lapse = true) => {
    completed++;
    if (ok) { correct++; gain(xp); }
    else { mistakes.set(w.id, w); if (lapse) SRS.lapse(w.id); }
  };
  const autoplay = (text, lang) => { if (Store.settings.autoplay) Speech.speak(text, { lang }); };

  function frame(body, actions = '') {
    el.innerHTML = `<div class="session">
      <div class="session-top">
        <a class="icon-btn" href="${back}" title="Quitter" aria-label="Quitter">✕</a>
        ${progressBar(completed / total, 'grow')}
        <span class="muted small nowrap">${Math.min(completed + 1, total)} / ${total}</span>
      </div>
      <div class="session-body">${body}</div>
      <div class="session-actions">${actions}</div>
    </div>`;
  }
  function next() {
    step++;
    keyFn = null;
    if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
    if (!queue.length) return finish();
    R[mode](queue.shift());
  }
  function feedback(ok, html, extraBtn = '') {
    $('.session-actions', el).innerHTML = feedbackBox(ok, ok ? pick(PRAISE) : 'Pas tout à fait…', html,
      `${extraBtn}<button class="btn ${ok ? 'btn-success' : 'btn-danger'}" id="cont">Continuer <kbd>Entrée</kbd></button>`);
    $('#cont', el).onclick = next;
    // La touche qui a validé la réponse a déjà été traitée : pas de risque de double déclenchement.
    keyFn = e => { if (e.key === 'Enter') { e.preventDefault(); next(); } };
  }

  const R = {
    /* ---------- Cartes mémoire (répétition espacée) ---------- */
    flash(w) {
      const dir = Store.settings.direction;
      const front = dir === 'mix' ? (Math.random() < 0.5 ? 'es' : 'fr') : dir === 'fr-es' ? 'fr' : 'es';
      const isNew = SRS.isNew(w.id);
      const backHtml = `
        <div class="fc-word">${esc(w.es)} ${sayBtn(w.es, w.lang)}</div>
        <div class="fc-trans">${esc(w.fr)}</div>
        ${exampleHtml(w, 'fc-ex')}`;
      const frontHtml = front === 'es'
        ? `<div class="fc-word">${esc(w.es)} ${sayBtn(w.es, w.lang)}</div><div class="muted small">Que veut dire ce mot ?</div>`
        : `<div class="fc-trans big">${esc(w.fr)}</div><div class="muted small">Comment dit-on en ${langName(w.lang)} ?</div>`;
      frame(`<div class="flashcard" id="fc">${isNew ? '<span class="badge badge-new">Nouveau</span>' : ''}<div id="fc-content">${frontHtml}</div></div>`,
        `<button class="btn btn-primary btn-lg wide" id="flip">Voir la réponse <kbd>Espace</kbd></button>`);
      if (front === 'es') autoplay(w.es, w.lang);

      const grade = g => {
        if (isNew) Store.markNewSeen();
        SRS.review(w.id, g);
        if (g === 0) { mistakes.set(w.id, w); queue.splice(Math.min(3, queue.length), 0, w); gain(1); }
        else { completed++; gain(2); }
        next();
      };
      const flip = () => {
        $('#fc-content', el).innerHTML = backHtml;
        $('#fc', el).classList.add('flipped');
        if (front === 'fr') autoplay(w.es, w.lang);
        const labels = ['À revoir', 'Difficile', 'Bien', 'Facile'];
        $('.session-actions', el).innerHTML = `<div class="grade-row">${labels.map((l, g) =>
          `<button class="btn grade g${g}" data-g="${g}"><b>${l}</b><span>${SRS.previewLabel(w.id, g)}</span><kbd>${g + 1}</kbd></button>`).join('')}</div>`;
        $$('.grade', el).forEach(b => { b.onclick = () => grade(+b.dataset.g); });
        keyFn = e => { if (e.key >= '1' && e.key <= '4') grade(+e.key - 1); };
      };
      $('#flip', el).onclick = flip;
      keyFn = e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); } };
    },

    /* ---------- QCM ---------- */
    qcm(w) {
      const askEs = Math.random() < 0.5;
      const key = askEs ? 'fr' : 'es';
      const sameLang = cfg.pool.filter(o => o.lang === w.lang);
      const candidates = shuffle(sameLang.length >= 4 ? sameLang : ALL_WORDS.filter(o => o.lang === w.lang));
      const opts = [w], used = new Set([w[key]]);
      // Intrus de sens éloigné d'abord ; les sens proches seulement si le thème est trop petit
      const add = strict => {
        for (const o of candidates) {
          if (opts.length === 4) return;
          if (used.has(o[key]) || (strict && closeMeaning(o, w))) continue;
          used.add(o[key]); opts.push(o);
        }
      };
      add(true);
      if (opts.length < 4) add(false);
      const shown = shuffle(opts);
      const isRight = j => shown[j].es === w.es || shown[j].fr === w.fr;

      frame(`<div class="prompt">
          <div class="prompt-label">${askEs ? 'Que veut dire…' : `Comment dit-on en ${langName(w.lang)}…`}</div>
          <div class="prompt-word ${askEs ? '' : 'fr'}">${esc(askEs ? w.es : w.fr)} ${askEs ? sayBtn(w.es, w.lang) : ''}</div>
        </div>
        <div class="options">${shown.map((o, i) => `<button class="option" data-i="${i}"><kbd>${i + 1}</kbd><span>${esc(o[key])}</span></button>`).join('')}</div>`);
      if (askEs) autoplay(w.es, w.lang);
      let answered = false;
      const choose = i => {
        if (answered) return;
        answered = true;
        const ok = isRight(i);
        revealChoice($$('.option', el), isRight, i);
        record(w, ok, 3);
        Speech.speak(w.es, { lang: w.lang });
        feedback(ok, ok ? '' : `<b>${esc(w.es)}</b> = ${esc(w.fr)}`);
      };
      $$('.option', el).forEach(b => { b.onclick = () => choose(+b.dataset.i); });
      keyFn = e => { const n = +e.key; if (n >= 1 && n <= shown.length) choose(n - 1); };
    },

    write(w) { typed(w, false); },
    listen(w) { typed(w, true); },

    /* ---------- Prononciation (reconnaissance vocale) ---------- */
    speak(w) {
      frame(`<div class="prompt">
          <div class="prompt-label">Dis à voix haute</div>
          <div class="prompt-word">${esc(w.es)} ${sayBtn(w.es, w.lang)}</div>
          <div class="muted">${esc(w.fr)}</div>
        </div>
        <div class="mic-zone"><button class="btn-mic" id="mic" aria-label="Parler">🎤</button><div id="heard" class="muted">Écoute le modèle 🔊, puis appuie sur le micro et parle.</div></div>`,
        `<button class="btn btn-ghost" id="skip">Passer</button>`);
      let tries = 0;
      const mic = $('#mic', el), heard = $('#heard', el);
      mic.onclick = async () => {
        const s = step;
        const alts = await Speech.capture(mic, heard, w.lang);
        if (!alts || !alive || s !== step) return;
        tries++;
        const ok = speechMatches(alts, w.es);
        if (ok || tries >= 3) {
          mic.disabled = true;
          record(w, ok, 3, false);
          feedback(ok, ok ? '' : `On attendait : <b>${esc(w.es)}</b>. Écoute et répète encore !`);
        } else {
          heard.innerHTML += `<br>Pas tout à fait… Réessaie ! (encore ${3 - tries} essai${3 - tries > 1 ? 's' : ''})`;
        }
      };
      $('#skip', el).onclick = () => { completed++; next(); };
      keyFn = e => { if (e.key === ' ') { e.preventDefault(); mic.click(); } };
    },
  };

  /* ---------- Écriture & dictée ---------- */
  function typed(w, listen) {
    frame(`<div class="prompt">
        ${listen
          ? `<div class="prompt-label">Écris ce que tu entends</div>
             <div class="listen-btns"><button type="button" class="btn-round" id="play" title="Écouter">🔊</button><button type="button" class="btn-round soft" id="slow" title="Plus lentement">🐢</button></div>`
          : `<div class="prompt-label">Traduis en ${langName(w.lang)}</div><div class="prompt-word fr">${esc(w.fr)}</div>`}
      </div>
      <form id="af" class="answer" autocomplete="off">
        ${answerInput(`id="ans" placeholder="Ta réponse…" lang="${w.lang}"`)}
        ${accentBar()}
        <div class="row gap-s"><button class="btn btn-primary btn-lg grow" type="submit">Vérifier</button><button class="btn btn-ghost btn-lg" type="button" id="skip">Je ne sais pas</button></div>
      </form>`);
    const inp = $('#ans', el);
    later(() => inp.focus(), 60);
    if (listen) {
      const play = rate => Speech.speak(w.es, { lang: w.lang, rate });
      $('#play', el).onclick = () => { play(); inp.focus(); };
      $('#slow', el).onclick = () => { play(0.55); inp.focus(); };
      later(() => play(), 250);
    }
    const done = (res, given) => {
      $('#af', el).classList.add('locked');
      $$('#af input, #af button', el).forEach(x => { x.disabled = true; });
      record(w, res.ok, 4);
      const hint = answerHint(res);
      const parts = [];
      if (res.ok && hint) parts.push(`${hint} : <b>${esc(w.es)}</b>`);
      if (!res.ok) {
        parts.push(`Réponse : <b>${esc(w.es)}</b>`);
        if (given) parts.push(`<span class="muted">Ta réponse : ${esc(given)}</span>${hint ? ` — ${hint}` : ''}`);
      }
      if (listen) parts.push(`<span class="muted">${esc(w.es)} = ${esc(w.fr)}</span>`);
      Speech.speak(w.es, { lang: w.lang });
      const override = !res.ok && given ? `<button class="btn btn-ghost btn-sm" id="override">J’avais bon</button>` : '';
      feedback(res.ok, parts.join('<br>'), override);
      if (override) $('#override', el).onclick = () => { correct++; gain(4); mistakes.delete(w.id); next(); };
    };
    $('#af', el).onsubmit = e => {
      e.preventDefault();
      const v = inp.value;
      if (!v.trim()) { inp.focus(); return; }
      done(checkAnswer(v, w.es), v);
    };
    $('#skip', el).onclick = () => done({ ok: false, kind: 'skip' }, '');
  }

  /* ---------- Fin de séance ---------- */
  function finish() {
    const isFlash = mode === 'flash';
    const pct = total ? Math.round(correct / total * 100) : 0;
    const ms = [...mistakes.values()];
    el.innerHTML = endScreen(
      isFlash || pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📚',
      isFlash ? '¡Sesión terminada!' : pct >= 80 ? '¡Excelente!' : pct >= 50 ? '¡Bien hecho!' : '¡Ánimo!',
      `<div class="end-stats">
        ${isFlash ? `<div><b>${total}</b><span>cartes</span></div>` : `<div><b>${correct}/${total}</b><span>bonnes réponses</span></div>`}
        <div><b>+${xpEarned}</b><span>XP gagnés</span></div>
        <div><b>${Store.todayXp()}/${Store.settings.goal}</b><span>objectif du jour</span></div>
      </div>
      ${ms.length ? `<div class="card word-list left"><h3>À retravailler</h3>${ms.map(w => wordRow(w)).join('')}</div>` : ''}`,
      `<button class="btn btn-primary btn-lg" id="again">Recommencer</button><a class="btn btn-ghost btn-lg" href="${back}">Retour</a>`);
    $('#again', el).onclick = () => route();
    keyFn = e => { if (e.key === 'Enter') { e.preventDefault(); route(); } };
  }

  next();
}
