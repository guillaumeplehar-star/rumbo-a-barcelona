'use strict';
/* ===== Voix : synthèse (écouter) et reconnaissance (parler) ===== */

const Speech = (() => {
  const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const LOCALE = { es: 'es-ES', ca: 'ca-ES' };
  let esList = [], caVoice = null;   // voix espagnoles triées (meilleure d'abord), voix catalane
  let gen = 0;                       // incrémenté par stop() : invalide les lectures en série en cours
  let recognizer = null;
  const listeners = new Set();

  const rank = v => (/es[-_]ES/i.test(v.lang) ? 10 : 0) + (/natural|online|neural|google/i.test(v.name) ? 5 : 0);
  function refresh() {
    const voices = synth.getVoices();
    esList = voices.filter(v => /^es([-_]|$)/i.test(v.lang)).sort((a, b) => rank(b) - rank(a));
    caVoice = voices.find(v => /^ca([-_]|$)/i.test(v.lang)) || null;
    listeners.forEach(f => f());
  }
  if (synth) {
    refresh();
    if (synth.addEventListener) synth.addEventListener('voiceschanged', refresh);
    else synth.onvoiceschanged = refresh;
  }

  function pickVoice(lang, alt) {
    if (lang === 'ca' && caVoice) return caVoice;
    const main = esList.find(v => v.name === Store.settings.voice) || esList[0] || null;
    if (!alt) return main;
    return esList.find(v => v !== main && /es[-_]ES/i.test(v.lang)) || esList.find(v => v !== main) || main;
  }

  const clean = t => String(t).split(ALT_SEP).join(', ').replace(/\.\.\.|…/g, '').replace(/[()]/g, '');

  /** Lit un texte. Résout true si la lecture est allée au bout, false si elle a été interrompue. */
  function speak(text, { lang = 'es', rate, pitch = 1, alt = false } = {}) {
    return new Promise(resolve => {
      if (!synth || !text) return resolve(false);
      synth.cancel();
      const u = new SpeechSynthesisUtterance(clean(text));
      const v = pickVoice(lang, alt);
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = LOCALE[lang] || LOCALE.es;
      u.rate = rate ?? Store.settings.rate;
      u.pitch = pitch;
      // Filet de sécurité si le navigateur n'envoie jamais « end »
      const timer = setTimeout(() => resolve(true), (4000 + text.length * 120) / Math.min(1, u.rate));
      const fin = ok => { clearTimeout(timer); resolve(ok); };
      u.onend = () => fin(true);
      u.onerror = () => fin(false);
      synth.speak(u);
    });
  }

  /** Lit des éléments l'un après l'autre. S'arrête sur stop() ou si une autre lecture coupe la parole. */
  async function sequence(items, { gap = 350, onStep } = {}) {
    const token = ++gen;
    for (let i = 0; i < items.length; i++) {
      if (onStep) onStep(i, true);
      const ok = await speak(items[i].text, items[i]);
      if (onStep) onStep(i, false);
      if (!ok || token !== gen) return false;
      await new Promise(r => setTimeout(r, gap));
      if (token !== gen) return false;
    }
    return true;
  }

  /** Coupe tout : voix, lectures en série et micro. */
  function stop() {
    gen++;
    if (synth) synth.cancel();
    if (recognizer) { recognizer.abort(); recognizer = null; }
  }

  function listen(lang = 'es') {
    return new Promise((resolve, reject) => {
      if (!Rec) return reject(new Error('unsupported'));
      stop();
      const r = recognizer = new Rec();
      r.lang = LOCALE[lang] || lang;
      r.maxAlternatives = 5;
      r.onresult = e => resolve(Array.from(e.results[0], a => a.transcript));
      r.onerror = e => reject(new Error(e.error || 'error'));
      r.onend = () => { if (recognizer === r) recognizer = null; resolve([]); };
      r.start();
    });
  }
  function micError(err) {
    const m = String(err && err.message);
    if (m === 'not-allowed' || m === 'service-not-allowed') return "Autorise l'accès au micro dans ton navigateur pour utiliser cet exercice.";
    if (m === 'network') return 'La reconnaissance vocale a besoin d’une connexion internet.';
    if (m === 'no-speech') return "Je n'ai rien entendu. Réessaie en parlant près du micro.";
    if (m === 'unsupported') return "Ton navigateur ne gère pas la reconnaissance vocale (essaie Chrome ou Edge).";
    if (m === 'aborted') return 'Écoute interrompue.';
    return 'Problème de micro : ' + m;
  }
  /** Écoute avec retour visuel sur le bouton micro et la zone de texte.
      Renvoie les transcriptions, ou null si rien n'a été entendu (le message est déjà affiché). */
  async function capture(mic, heard, lang = 'es') {
    mic.disabled = true;
    mic.classList.add('listening');
    heard.textContent = 'Je t’écoute…';
    try {
      const alts = await listen(lang);
      if (!alts.length) { heard.textContent = 'Je n’ai rien entendu. Réessaie !'; return null; }
      heard.innerHTML = `J’ai entendu : « <b>${esc(alts[0])}</b> »`;
      return alts;
    } catch (err) {
      heard.textContent = micError(err);
      return null;
    } finally {
      mic.disabled = false;
      mic.classList.remove('listening');
    }
  }

  return {
    speak, sequence, stop, listen, capture, micError,
    esVoices: () => esList,
    onVoices(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    get canSpeak() { return !!synth; },
    get canListen() { return !!Rec; },
  };
})();
