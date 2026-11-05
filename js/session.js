'use strict';
/* ===== Séances d'exercices de vocabulaire : cartes, QCM, écriture, dictée, prononciation ===== */

const PRAISE = ['¡Muy bien!', '¡Perfecto!', '¡Genial!', '¡Eso es!', '¡Bravo!', '¡Fenomenal!', '¡Olé!'];
const langName = l => (l === 'ca' ? 'catalan' : 'espagnol');

function runSession(el, cfg) {
  const { mode, back } = cfg;
  const queue = cfg.items.slice();
  const total = queue.length;
  let completed = 0, correct = 0, xpEarned = 0;
  const mistakes = new Map();
  let keyFn = null;

  const onKey = e => {
    if (!keyFn || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.matches('input, textarea, select') && e.key !== 'Enter') return;
    keyFn(e);
  };
  document.addEventListener('keydown', onKey);
  setCleanup(() => document.removeEventListener('keydown', onKey));

  const gain = n => { xpEarned += n; Store.addXp(n); };
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
    keyFn = null;
    if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
    if (!queue.length) return finish();
    R[mode](queue.shift());
  }
  function feedback(ok, html, extraBtn = '') {
    $('.session-actions', el).innerHTML = `
      <div class="feedback ${ok ? 'ok' : 'ko'}">
        <div class="fb-text"><b>${ok ? pick(PRAISE) : 'Pas tout à fait…'}</b>${html ? `<div>${html}</div>` : ''}</div>
        <div class="fb-btns">${extraBtn}<button class="btn ${ok ? 'btn-success' : 'btn-danger'}" id="cont">Continuer <kbd>Entrée</kbd></button></div>
      </div>`;
    $('#cont', el).onclick = next;
    // petit délai : la touche Entrée qui a validé ne doit pas aussi passer à la suite
    setTimeout(() => { keyFn = e => { if (e.key === 'Enter') { e.preventDefault(); next(); } }; }, 150);
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
        ${w.ex ? `<div class="fc-ex">${esc(w.ex)} ${sayBtn(w.ex, w.lang, 'say-sm')}<div class="muted">${esc(w.exFr || '')}</div></div>` : ''}`;
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
      const pool = cfg.pool.length >= 4 ? cfg.pool : ALL_WORDS;
      // On évite les intrus qui ont un sens proche (ex. « hola » et « buenas » = « salut »)
      const toks = s => new Set(stripAccents(norm(s.replace(/\([^)]*\)/g, ' '))).split(/[\s/']+/).filter(t => t.length >= 4));
      const target = toks(w.fr);
      const close = o => [...toks(o.fr)].some(t => target.has(t));
      const used = new Set([w[key]]);
      const opts = [w];
      for (const strict of [true, false]) {
        for (const o of shuffle(pool)) {
          if (opts.length === 4) break;
          if (used.has(o[key]) || (strict && close(o))) continue;
          used.add(o[key]); opts.push(o);
        }
      }
      const shown = shuffle(opts);
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
        const ok = shown[i] === w;
        $$('.option', el).forEach((b, j) => {
          b.disabled = true;
          if (shown[j] === w) b.classList.add('correct'); else if (j === i) b.classList.add('wrong');
        });
        completed++;
        if (ok) { correct++; gain(3); } else { mistakes.set(w.id, w); SRS.lapse(w.id); }
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
      let tries = 0, busy = false;
      const mic = $('#mic', el), heard = $('#heard', el);
      mic.onclick = async () => {
        if (busy) return;
        busy = true;
        mic.classList.add('listening');
        heard.textContent = 'Je t’écoute…';
        try {
          const alts = await Speech.listen(w.lang === 'ca' ? 'ca-ES' : 'es-ES');
          if (!alts.length) { heard.textContent = 'Je n’ai rien entendu. Réessaie !'; return; }
          tries++;
          const ok = speechMatches(alts, w.es);
          heard.innerHTML = `J’ai entendu : « <b>${esc(alts[0])}</b> »`;
          if (ok || tries >= 3) {
            completed++;
            if (ok) { correct++; gain(3); } else mistakes.set(w.id, w);
            mic.disabled = true;
            feedback(ok, ok ? '' : `On attendait : <b>${esc(w.es)}</b>. Écoute et répète encore !`);
          } else {
            heard.innerHTML += `<br>Pas tout à fait… Réessaie ! (encore ${3 - tries} essai${3 - tries > 1 ? 's' : ''})`;
          }
        } catch (err) {
          heard.textContent = Speech.micError(err);
        } finally {
          busy = false;
          mic.classList.remove('listening');
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
        <input id="ans" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Ta réponse…" lang="${w.lang}">
        ${accentBar()}
        <div class="row gap-s"><button class="btn btn-primary btn-lg grow" type="submit">Vérifier</button><button class="btn btn-ghost btn-lg" type="button" id="skip">Je ne sais pas</button></div>
      </form>`);
    const inp = $('#ans', el);
    setTimeout(() => inp.focus(), 60);
    if (listen) {
      const play = rate => Speech.speak(w.es, { lang: w.lang, rate });
      $('#play', el).onclick = () => { play(); inp.focus(); };
      $('#slow', el).onclick = () => { play(0.55); inp.focus(); };
      setTimeout(() => play(), 250);
    }
    const done = (res, given) => {
      $('#af', el).classList.add('locked');
      $$('#af input, #af button', el).forEach(x => { x.disabled = true; });
      completed++;
      const ok = res.ok;
      if (ok) { correct++; gain(4); } else { mistakes.set(w.id, w); SRS.lapse(w.id); }
      const parts = [];
      if (res.kind === 'accents') parts.push(`Attention aux accents : <b>${esc(w.es)}</b>`);
      else if (res.kind === 'article') parts.push(`N’oublie pas l’article : <b>${esc(w.es)}</b>`);
      else if (!ok) {
        parts.push(`Réponse : <b>${esc(w.es)}</b>`);
        if (given) parts.push(`<span class="muted">Ta réponse : ${esc(given)}</span>${res.kind === 'typo' ? ' — presque, une petite faute !' : ''}`);
      }
      if (listen) parts.push(`<span class="muted">${esc(w.es)} = ${esc(w.fr)}</span>`);
      Speech.speak(w.es, { lang: w.lang });
      const override = !ok && given ? `<button class="btn btn-ghost btn-sm" id="override">J’avais bon</button>` : '';
      feedback(ok, parts.join('<br>'), override);
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
    const good = isFlash || pct >= 80;
    el.innerHTML = `<div class="session-end">
      <div class="big-emoji">${good ? '🎉' : pct >= 50 ? '💪' : '📚'}</div>
      <h1>${isFlash ? '¡Sesión terminada!' : pct >= 80 ? '¡Excelente!' : pct >= 50 ? '¡Bien hecho!' : '¡Ánimo!'}</h1>
      <div class="end-stats">
        ${isFlash ? `<div><b>${total}</b><span>cartes</span></div>` : `<div><b>${correct}/${total}</b><span>bonnes réponses</span></div>`}
        <div><b>+${xpEarned}</b><span>XP gagnés</span></div>
        <div><b>${Store.todayXp()}/${Store.settings.goal}</b><span>objectif du jour</span></div>
      </div>
      ${ms.length ? `<div class="card word-list left"><h3>À retravailler</h3>${ms.map(w => wordRow(w)).join('')}</div>` : ''}
      <div class="row center gap-s wrap"><button class="btn btn-primary btn-lg" id="again">Recommencer</button><a class="btn btn-ghost btn-lg" href="${back}">Retour</a></div>
    </div>`;
    $('#again', el).onclick = () => route();
    keyFn = e => { if (e.key === 'Enter') { e.preventDefault(); route(); } };
  }

  next();
}
