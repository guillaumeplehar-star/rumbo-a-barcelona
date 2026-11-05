'use strict';
/* ===== Voix : synthèse (écouter) et reconnaissance (parler) ===== */

const Speech = (() => {
  const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
  let voices = [];
  const listeners = new Set();

  function refresh() {
    if (!synth) return;
    voices = synth.getVoices();
    listeners.forEach(f => f());
  }
  if (synth) {
    refresh();
    if (synth.addEventListener) synth.addEventListener('voiceschanged', refresh);
    else synth.onvoiceschanged = refresh;
  }

  const esVoices = () => voices.filter(v => /^es([-_]|$)/i.test(v.lang));
  const rank = v => (/es[-_]ES/i.test(v.lang) ? 10 : 0) + (/natural|online|neural|google/i.test(v.name) ? 5 : 0);

  function pickVoice(lang, alt) {
    if (lang === 'ca') {
      const ca = voices.find(v => /^ca([-_]|$)/i.test(v.lang));
      if (ca) return ca;
    }
    const list = esVoices().sort((a, b) => rank(b) - rank(a));
    const main = list.find(v => v.name === Store.settings.voice) || list[0] || null;
    if (!alt) return main;
    return list.find(v => v !== main && /es[-_]ES/i.test(v.lang)) || list.find(v => v !== main) || main;
  }

  const clean = t => String(t).replace(/\.\.\.|…/g, '').replace(/\s+\/\s+/g, ', ').replace(/[()]/g, '');

  /** Lit un texte. Renvoie une promesse résolue à la fin de la lecture. */
  function speak(text, { lang = 'es', rate, pitch = 1, alt = false } = {}) {
    return new Promise(resolve => {
      if (!synth || !text) return resolve();
      synth.cancel();
      const u = new SpeechSynthesisUtterance(clean(text));
      const v = pickVoice(lang, alt);
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = lang === 'ca' ? 'ca-ES' : 'es-ES';
      u.rate = rate ?? Store.settings.rate;
      u.pitch = pitch;
      let done = false;
      const fin = () => { if (!done) { done = true; resolve(); } };
      u.onend = fin; u.onerror = fin;
      setTimeout(fin, 4000 + text.length * 120);
      synth.speak(u);
    });
  }
  const stop = () => { if (synth) synth.cancel(); };

  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  function listen(lang = 'es-ES') {
    return new Promise((resolve, reject) => {
      if (!Rec) return reject(new Error('unsupported'));
      stop();
      const r = new Rec();
      r.lang = lang; r.interimResults = false; r.maxAlternatives = 5; r.continuous = false;
      let got = false;
      r.onresult = e => { got = true; resolve(Array.from(e.results[0]).map(a => a.transcript)); };
      r.onerror = e => reject(new Error(e.error || 'error'));
      r.onend = () => { if (!got) resolve([]); };
      r.start();
    });
  }
  function micError(err) {
    const m = String(err && err.message);
    if (m === 'not-allowed' || m === 'service-not-allowed') return "Autorise l'accès au micro dans ton navigateur pour utiliser cet exercice.";
    if (m === 'network') return 'La reconnaissance vocale a besoin d’une connexion internet.';
    if (m === 'no-speech') return "Je n'ai rien entendu. Réessaie en parlant près du micro.";
    if (m === 'unsupported') return "Ton navigateur ne gère pas la reconnaissance vocale (essaie Chrome ou Edge).";
    return 'Problème de micro : ' + m;
  }

  return {
    speak, stop, listen, micError, esVoices, refresh,
    onVoices(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    get canSpeak() { return !!synth; },
    get canListen() { return !!Rec; },
  };
})();
