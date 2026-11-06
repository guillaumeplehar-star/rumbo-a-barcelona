'use strict';
/* ===== Conjugueur : génère les formes à partir de règles + exceptions ===== */

const PERSONS = ['yo', 'tú', 'él / ella / usted', 'nosotros', 'vosotros', 'ellos / ellas / ustedes'];
const IMP_LABELS = ['', 'tú', 'usted', 'nosotros', 'vosotros', 'ustedes'];
const PRON_CHOICES = [['yo'], ['tú'], ['él', 'ella', 'usted'], ['nosotros', 'nosotras'], ['vosotros', 'vosotras'], ['ellos', 'ellas', 'ustedes']];

/* persons : personnes qui existent à ce temps (par défaut les 6) ; labels : libellés à afficher ;
   prefix : mot ajouté devant le pronom ; sayPron : false = on lit la forme seule */
const TENSES = [
  { id: 'pres', es: 'Presente', fr: 'Présent' },
  { id: 'perf', es: 'Pretérito perfecto', fr: 'Passé composé (aujourd’hui, expérience)' },
  { id: 'indef', es: 'Pretérito indefinido', fr: 'Passé (hier, action terminée)' },
  { id: 'imperf', es: 'Pretérito imperfecto', fr: 'Imparfait (description, habitude)' },
  { id: 'fut', es: 'Futuro', fr: 'Futur' },
  { id: 'cond', es: 'Condicional', fr: 'Conditionnel' },
  { id: 'subj', es: 'Presente de subjuntivo', fr: 'Subjonctif présent', prefix: 'que ' },
  { id: 'imp', es: 'Imperativo', fr: 'Impératif (affirmatif)', persons: [1, 2, 3, 4, 5], labels: IMP_LABELS, sayPron: false },
];

/* g : irr = irrégulier, sc = diphtongue (stem change), reg = régulier
   sc : 'ie' (e→ie), 'ue' (o/u→ue), 'i' (e→i)
   yo : forme irrégulière de « yo » au présent (sert aussi de base au subjonctif)
   indefStem : radical fort du passé (tuv-, hic-…) ; fut : radical du futur/conditionnel */
const VERBS = [
  { inf: 'ser', fr: 'être', g: 'irr', pres: ['soy', 'eres', 'es', 'somos', 'sois', 'son'], indef: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'], imperf: ['era', 'eras', 'era', 'éramos', 'erais', 'eran'], subj: ['sea', 'seas', 'sea', 'seamos', 'seáis', 'sean'], impTu: 'sé' },
  { inf: 'estar', fr: 'être (état, lieu)', g: 'irr', pres: ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'], indefStem: 'estuv', subj: ['esté', 'estés', 'esté', 'estemos', 'estéis', 'estén'] },
  { inf: 'ir', fr: 'aller', g: 'irr', pres: ['voy', 'vas', 'va', 'vamos', 'vais', 'van'], indef: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'], imperf: ['iba', 'ibas', 'iba', 'íbamos', 'ibais', 'iban'], subj: ['vaya', 'vayas', 'vaya', 'vayamos', 'vayáis', 'vayan'], impTu: 've', impNos: 'vamos', ger: 'yendo' },
  { inf: 'tener', fr: 'avoir', g: 'irr', sc: 'ie', yo: 'tengo', indefStem: 'tuv', fut: 'tendr', impTu: 'ten' },
  { inf: 'hacer', fr: 'faire', g: 'irr', yo: 'hago', indefStem: 'hic', indef3: 'hizo', fut: 'har', part: 'hecho', impTu: 'haz' },
  { inf: 'decir', fr: 'dire', g: 'irr', sc: 'i', yo: 'digo', indefStem: 'dij', fut: 'dir', part: 'dicho', impTu: 'di' },
  { inf: 'venir', fr: 'venir', g: 'irr', sc: 'ie', yo: 'vengo', indefStem: 'vin', fut: 'vendr', impTu: 'ven' },
  { inf: 'poder', fr: 'pouvoir', g: 'irr', sc: 'ue', indefStem: 'pud', fut: 'podr', ger: 'pudiendo' },
  { inf: 'querer', fr: 'vouloir, aimer', g: 'irr', sc: 'ie', indefStem: 'quis', fut: 'querr' },
  { inf: 'saber', fr: 'savoir', g: 'irr', yo: 'sé', indefStem: 'sup', fut: 'sabr', subj: ['sepa', 'sepas', 'sepa', 'sepamos', 'sepáis', 'sepan'] },
  { inf: 'poner', fr: 'mettre', g: 'irr', yo: 'pongo', indefStem: 'pus', fut: 'pondr', part: 'puesto', impTu: 'pon' },
  { inf: 'salir', fr: 'sortir, partir', g: 'irr', yo: 'salgo', fut: 'saldr', impTu: 'sal' },
  { inf: 'dar', fr: 'donner', g: 'irr', pres: ['doy', 'das', 'da', 'damos', 'dais', 'dan'], indef: ['di', 'diste', 'dio', 'dimos', 'disteis', 'dieron'], subj: ['dé', 'des', 'dé', 'demos', 'deis', 'den'] },
  { inf: 'ver', fr: 'voir', g: 'irr', pres: ['veo', 'ves', 've', 'vemos', 'veis', 'ven'], indef: ['vi', 'viste', 'vio', 'vimos', 'visteis', 'vieron'], imperf: ['veía', 'veías', 'veía', 'veíamos', 'veíais', 'veían'], part: 'visto' },
  { inf: 'conocer', fr: 'connaître', g: 'irr', yo: 'conozco' },
  { inf: 'traer', fr: 'apporter', g: 'irr', yo: 'traigo', indefStem: 'traj', part: 'traído', ger: 'trayendo' },
  { inf: 'conducir', fr: 'conduire', g: 'irr', yo: 'conduzco', indefStem: 'conduj' },
  { inf: 'leer', fr: 'lire', g: 'irr', indef: ['leí', 'leíste', 'leyó', 'leímos', 'leísteis', 'leyeron'], part: 'leído', ger: 'leyendo' },
  { inf: 'creer', fr: 'croire', g: 'irr', indef: ['creí', 'creíste', 'creyó', 'creímos', 'creísteis', 'creyeron'], part: 'creído', ger: 'creyendo' },

  { inf: 'pensar', fr: 'penser', g: 'sc', sc: 'ie' },
  { inf: 'empezar', fr: 'commencer', g: 'sc', sc: 'ie' },
  { inf: 'cerrar', fr: 'fermer', g: 'sc', sc: 'ie' },
  { inf: 'entender', fr: 'comprendre', g: 'sc', sc: 'ie' },
  { inf: 'preferir', fr: 'préférer', g: 'sc', sc: 'ie' },
  { inf: 'sentir', fr: 'ressentir, regretter', g: 'sc', sc: 'ie' },
  { inf: 'volver', fr: 'revenir, rentrer', g: 'sc', sc: 'ue', part: 'vuelto' },
  { inf: 'dormir', fr: 'dormir', g: 'sc', sc: 'ue' },
  { inf: 'encontrar', fr: 'trouver', g: 'sc', sc: 'ue' },
  { inf: 'costar', fr: 'coûter', g: 'sc', sc: 'ue' },
  { inf: 'recordar', fr: 'se souvenir, rappeler', g: 'sc', sc: 'ue' },
  { inf: 'jugar', fr: 'jouer', g: 'sc', sc: 'ue' },
  { inf: 'pedir', fr: 'demander, commander', g: 'sc', sc: 'i' },
  { inf: 'repetir', fr: 'répéter', g: 'sc', sc: 'i' },
  { inf: 'servir', fr: 'servir', g: 'sc', sc: 'i' },

  { inf: 'hablar', fr: 'parler', g: 'reg' },
  { inf: 'trabajar', fr: 'travailler', g: 'reg' },
  { inf: 'estudiar', fr: 'étudier', g: 'reg' },
  { inf: 'comprar', fr: 'acheter', g: 'reg' },
  { inf: 'tomar', fr: 'prendre (boire, manger)', g: 'reg' },
  { inf: 'llegar', fr: 'arriver', g: 'reg' },
  { inf: 'buscar', fr: 'chercher', g: 'reg' },
  { inf: 'pagar', fr: 'payer', g: 'reg' },
  { inf: 'necesitar', fr: 'avoir besoin de', g: 'reg' },
  { inf: 'escuchar', fr: 'écouter', g: 'reg' },
  { inf: 'viajar', fr: 'voyager', g: 'reg' },
  { inf: 'esperar', fr: 'attendre, espérer', g: 'reg' },
  { inf: 'comer', fr: 'manger', g: 'reg' },
  { inf: 'beber', fr: 'boire', g: 'reg' },
  { inf: 'aprender', fr: 'apprendre', g: 'reg' },
  { inf: 'vender', fr: 'vendre', g: 'reg' },
  { inf: 'coger', fr: 'prendre', g: 'reg' },
  { inf: 'vivir', fr: 'vivre, habiter', g: 'reg' },
  { inf: 'escribir', fr: 'écrire', g: 'reg', part: 'escrito' },
  { inf: 'abrir', fr: 'ouvrir', g: 'reg', part: 'abierto' },
  { inf: 'subir', fr: 'monter', g: 'reg' },
  { inf: 'recibir', fr: 'recevoir', g: 'reg' },
];

const Conj = (() => {
  const E = {
    pres: { ar: ['o', 'as', 'a', 'amos', 'áis', 'an'], er: ['o', 'es', 'e', 'emos', 'éis', 'en'], ir: ['o', 'es', 'e', 'imos', 'ís', 'en'] },
    indef: { ar: ['é', 'aste', 'ó', 'amos', 'asteis', 'aron'], er: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'] },
    imperf: { ar: ['aba', 'abas', 'aba', 'ábamos', 'abais', 'aban'], er: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'] },
    fut: ['é', 'ás', 'á', 'emos', 'éis', 'án'],
    cond: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'],
    subj: { ar: ['e', 'es', 'e', 'emos', 'éis', 'en'], er: ['a', 'as', 'a', 'amos', 'áis', 'an'] },
  };
  const HABER = ['he', 'has', 'ha', 'hemos', 'habéis', 'han'];
  const STRONG = [0, 1, 2, 5];   // personnes « botte »

  const type = v => v.inf.slice(-2);              // ar | er | ir
  const grp = v => (type(v) === 'ar' ? 'ar' : 'er'); // -er et -ir partagent ces terminaisons
  const stem = v => v.inf.slice(0, -2);

  function strong(st, sc) {
    if (sc === 'ue') {
      let i = st.lastIndexOf('o');
      if (i < 0) i = st.lastIndexOf('u');          // jugar → jueg-
      return st.slice(0, i) + 'ue' + st.slice(i + 1);
    }
    const i = st.lastIndexOf('e');
    return st.slice(0, i) + (sc === 'ie' ? 'ie' : 'i') + st.slice(i + 1);
  }
  function weak(st) {                               // e→i, o→u (verbes en -ir)
    const i = Math.max(st.lastIndexOf('e'), st.lastIndexOf('o'));
    if (i < 0) return st;
    return st.slice(0, i) + (st[i] === 'e' ? 'i' : 'u') + st.slice(i + 1);
  }
  function spell(st, end, t) {                      // busqué, llegue, empiece, cojo
    const f = end[0];
    if (t === 'ar' && (f === 'e' || f === 'é')) {
      if (st.endsWith('c')) return st.slice(0, -1) + 'qu';
      if (st.endsWith('g')) return st.slice(0, -1) + 'gu';
      if (st.endsWith('z')) return st.slice(0, -1) + 'c';
    }
    if (t !== 'ar' && 'oaá'.includes(f) && st.endsWith('g')) return st.slice(0, -1) + 'j';
    return st;
  }

  function pres(v) {
    if (v.pres) return v.pres;
    const t = type(v);
    return E.pres[t].map((e, i) => {
      if (i === 0 && v.yo) return v.yo;
      const s = v.sc && STRONG.includes(i) ? strong(stem(v), v.sc) : stem(v);
      return spell(s, e, t) + e;
    });
  }
  function indef(v) {
    if (v.indef) return v.indef;
    if (v.indefStem) {
      const s = v.indefStem;
      const f = [s + 'e', s + 'iste', s + 'o', s + 'imos', s + 'isteis', s + (s.endsWith('j') ? 'eron' : 'ieron')];
      if (v.indef3) f[2] = v.indef3;
      return f;
    }
    const t = type(v);
    return E.indef[grp(v)].map((e, i) => {
      const s = t === 'ir' && v.sc && (i === 2 || i === 5) ? weak(stem(v)) : stem(v);
      return spell(s, e, t) + e;
    });
  }
  function imperf(v) {
    if (v.imperf) return v.imperf;
    return E.imperf[grp(v)].map(e => stem(v) + e);
  }
  const fut = v => E.fut.map(e => (v.fut || v.inf) + e);
  const cond = v => E.cond.map(e => (v.fut || v.inf) + e);
  const part = v => v.part || stem(v) + (type(v) === 'ar' ? 'ado' : 'ido');
  const perf = v => HABER.map(h => h + ' ' + part(v));
  function subj(v) {
    if (v.subj) return v.subj;
    const t = type(v), end = E.subj[grp(v)];
    const yo = v.yo || (v.pres && v.pres[0]);
    if (yo && yo.endsWith('o')) { const s = yo.slice(0, -1); return end.map(e => s + e); }
    return end.map((e, i) => {
      let s = stem(v);
      if (v.sc) {
        if (STRONG.includes(i)) s = strong(s, v.sc);
        else if (t === 'ir') s = weak(s);
      }
      return spell(s, e, t) + e;
    });
  }
  function imp(v) {
    const s = subj(v), p = pres(v);
    return ['—', v.impTu || p[2], s[2], v.impNos || s[3], v.inf.slice(0, -1) + 'd', s[5]];
  }
  function ger(v) {
    if (v.ger) return v.ger;
    const t = type(v);
    if (t === 'ar') return stem(v) + 'ando';
    return (t === 'ir' && v.sc ? weak(stem(v)) : stem(v)) + 'iendo';
  }

  const FN = { pres, perf, indef, imperf, fut, cond, subj, imp };
  const forms = (v, tense) => FN[tense](v);
  /** Formes « si le verbe était régulier », pour surligner les irrégularités. */
  const regular = (v, tense) => FN[tense]({ inf: v.inf });

  /* Présentation d'un temps (t = une entrée de TENSES) */
  const persons = t => t.persons || [0, 1, 2, 3, 4, 5];
  const label = (t, i) => (t.labels || PERSONS)[i];
  /** Texte à lire à voix haute : « yo hablo », « que yo hable », « habla » (impératif). */
  const say = (t, i, form, pron = PRON_CHOICES[i][0]) => (t.sayPron === false ? form : `${t.prefix || ''}${pron} ${form}`);

  return { forms, regular, part, ger, persons, label, say };
})();
