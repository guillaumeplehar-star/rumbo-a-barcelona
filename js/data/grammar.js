'use strict';
/* ===== Leçons de grammaire =====
   Dans le HTML, les exemples espagnols sont en <em> : un clic les fait lire à voix haute.
   Exercices : [question avec ___, 'réponse|variante']  ou  [question, [options], index de la bonne] */

const GRAMMAR = [

{ id: 'pronunciacion', icon: '🗣️', level: 'A1', title: 'Prononciation & accent tonique',
  summary: 'Les sons qui changent du français, et où mettre l’accent.',
  html: `
<p>Bonne nouvelle : l'espagnol se lit presque toujours comme il s'écrit. Toutes les lettres se prononcent (sauf le <b>h</b>) et il n'y a <b>pas de voyelles nasales</b> : dans <em>ventana</em> ou <em>bombón</em>, on entend bien le « n » et le « m ».</p>
<table class="tbl"><tr><th>Lettres</th><th>Son</th><th>Exemples</th></tr>
<tr><td>j, g + e/i</td><td>« r » raclé du fond de la gorge</td><td><em>jamón</em>, <em>gente</em></td></tr>
<tr><td>g + a/o/u, gu + e/i</td><td>« g » dur</td><td><em>gato</em>, <em>guitarra</em></td></tr>
<tr><td>ll, y</td><td>« y » de « yaourt »</td><td><em>calle</em>, <em>playa</em></td></tr>
<tr><td>ñ</td><td>« gn » de « montagne »</td><td><em>España</em>, <em>mañana</em></td></tr>
<tr><td>r</td><td>roulé une fois (entre voyelles)</td><td><em>pero</em>, <em>caro</em></td></tr>
<tr><td>rr, r initial</td><td>roulé fort</td><td><em>perro</em>, <em>Rambla</em></td></tr>
<tr><td>c + e/i, z</td><td>« th » anglais (en Espagne)</td><td><em>cerveza</em>, <em>gracias</em></td></tr>
<tr><td>ch</td><td>« tch »</td><td><em>churros</em>, <em>noche</em></td></tr>
<tr><td>h</td><td>muet</td><td><em>hola</em>, <em>hacer</em></td></tr>
<tr><td>b, v</td><td>le même son, entre b et v</td><td><em>vino</em>, <em>bien</em></td></tr>
<tr><td>u</td><td>« ou »</td><td><em>muy</em>, <em>luna</em></td></tr>
<tr><td>e</td><td>toujours « é »</td><td><em>leche</em>, <em>verde</em></td></tr>
<tr><td>s</td><td>toujours « ss », jamais « z »</td><td><em>casa</em>, <em>mesa</em></td></tr>
<tr><td>qu + e/i</td><td>« k » (le u est muet)</td><td><em>queso</em>, <em>aquí</em></td></tr></table>
<h3>L'accent tonique</h3>
<ul>
<li>Mot terminé par une <b>voyelle, -n ou -s</b> → on appuie sur l'<b>avant-dernière</b> syllabe : <em>casa</em> (CA-sa), <em>hablan</em> (HA-blan), <em>gracias</em> (GRA-cias).</li>
<li>Mot terminé par une <b>autre consonne</b> → on appuie sur la <b>dernière</b> syllabe : <em>hablar</em> (ha-BLAR), <em>ciudad</em> (ciu-DAD), <em>español</em>.</li>
<li>L'<b>accent écrit</b> (´) signale une exception : <em>café</em>, <em>árbol</em>, <em>música</em>, <em>estación</em>.</li>
</ul>
<p>L'accent écrit distingue aussi des mots : <em>sí</em> (oui) / <em>si</em> (si), <em>tú</em> (tu) / <em>tu</em> (ton), <em>él</em> (il) / <em>el</em> (le), <em>más</em> (plus) / <em>mas</em> (mais, littéraire).</p>
<div class="tip">💡 Clique sur les mots en couleur pour les écouter, et répète-les à voix haute.</div>`,
  ex: [
    ['Le « j » de « jamón » se prononce…', ['comme un « j » français', 'comme un « r » raclé de la gorge', 'il est muet'], 1],
    ['Le « h » de « hola » se prononce…', ['il est muet', 'comme en anglais (aspiré)'], 0],
    ['« ll » dans « calle » se prononce…', ['« l »', '« y »', '« lh »'], 1],
    ['« ñ » dans « mañana » se prononce…', ['« n »', '« gn »', '« ni-a »'], 1],
    ['En Espagne, le « c » de « cerveza » et le « z » se prononcent…', ['« s »', '« th » anglais', '« k »'], 1],
    ['Le « s » de « casa » se prononce…', ['« z »', '« ss »'], 1],
    ['Où est l’accent tonique dans « hablan » ?', ['ha-BLAN', 'HA-blan'], 1],
    ['Où est l’accent tonique dans « ciudad » ?', ['CIU-dad', 'ciu-DAD'], 1],
    ['Quel mot veut dire « oui » ?', ['si', 'sí'], 1],
    ['« u » dans « luna » se prononce…', ['« u » français', '« ou »'], 1],
  ] },

{ id: 'articulos', icon: '🏷️', level: 'A1', title: 'Articles, genre & pluriel',
  summary: 'el, la, los, las, un, una… et les mots qui changent de genre.',
  html: `
<table class="tbl"><tr><th></th><th>Masculin</th><th>Féminin</th></tr>
<tr><td>le / la</td><td><em>el chico</em></td><td><em>la chica</em></td></tr>
<tr><td>les</td><td><em>los chicos</em></td><td><em>las chicas</em></td></tr>
<tr><td>un / une</td><td><em>un piso</em></td><td><em>una casa</em></td></tr>
<tr><td>des</td><td><em>unos amigos</em></td><td><em>unas amigas</em></td></tr></table>
<h3>Le genre</h3>
<ul>
<li>En général : <b>-o → masculin</b> (<em>el libro</em>), <b>-a → féminin</b> (<em>la mesa</em>).</li>
<li>Toujours féminins : <b>-ción, -sión, -dad, -tad, -tud</b> : <em>la estación</em>, <em>la ciudad</em>, <em>la libertad</em>.</li>
<li>Pièges : <em>el día</em>, <em>el mapa</em>, <em>el problema</em>, <em>el idioma</em>, <em>el tema</em> (masculins) ; <em>la mano</em>, <em>la foto</em>, <em>la moto</em> (féminins).</li>
<li>Devant un nom féminin qui commence par un « a » accentué : <em>el agua fría</em>, <em>el aula</em> (mais <em>las aguas</em>).</li>
</ul>
<h3>Genre différent du français ⚠️</h3>
<p><em>la leche</em> (le lait), <em>la sal</em> (le sel), <em>la sangre</em> (le sang), <em>la nariz</em> (le nez), <em>la miel</em> (le miel), <em>la señal</em> (le signal) — <em>el color</em> (la couleur), <em>el dolor</em> (la douleur), <em>el valor</em> (la valeur), <em>el equipo</em> (l'équipe), <em>el planeta</em> (la planète), <em>el diente</em> (la dent).</p>
<h3>Le pluriel</h3>
<ul>
<li>Après une voyelle : <b>+s</b> → <em>casas</em>, <em>cafés</em>.</li>
<li>Après une consonne : <b>+es</b> → <em>ciudades</em>, <em>estaciones</em> (l'accent écrit disparaît), <em>lápices</em> (z → c).</li>
</ul>
<h3>Contractions</h3>
<p>Seulement deux : <b>a + el = al</b> (<em>Voy al mercado</em>) et <b>de + el = del</b> (<em>Vengo del trabajo</em>). Jamais avec la, los, las.</p>
<p>Bonus : <b>lo</b> + adjectif = « ce qui est… » : <em>lo bueno</em> (le bon côté), <em>lo mejor</em> (le mieux).</p>`,
  ex: [
    ['___ casa', ['el', 'la'], 1],
    ['___ problema', ['el', 'la'], 0],
    ['___ ciudad', ['el', 'la'], 1],
    ['___ leche (le lait)', ['el', 'la'], 1],
    ['___ mano', ['el', 'la'], 1],
    ['___ día', ['el', 'la'], 0],
    ['___ color (la couleur)', ['el', 'la'], 0],
    ['___ agua está fría.', ['El', 'La'], 0],
    ['Des livres → ___ libros', ['unos', 'unas', 'los'], 0],
    ['Pluriel de « la ciudad » : las ___', 'ciudades'],
    ['Pluriel de « la estación » : las ___', 'estaciones'],
    ['Voy ___ mercado. (a + el)', 'al'],
    ['Es el piso ___ chico. (de + el)', 'del'],
  ] },

{ id: 'presente', icon: '🌱', level: 'A1', title: 'Pronoms & présent des verbes réguliers',
  summary: 'yo, tú, vosotros… et les terminaisons -ar, -er, -ir.',
  html: `
<table class="tbl"><tr><th>Pronom</th><th>hablar (parler)</th><th>comer (manger)</th><th>vivir (vivre)</th></tr>
<tr><td>yo (je)</td><td><em>hablo</em></td><td><em>como</em></td><td><em>vivo</em></td></tr>
<tr><td>tú (tu)</td><td><em>hablas</em></td><td><em>comes</em></td><td><em>vives</em></td></tr>
<tr><td>él / ella / usted</td><td><em>habla</em></td><td><em>come</em></td><td><em>vive</em></td></tr>
<tr><td>nosotros/as (nous)</td><td><em>hablamos</em></td><td><em>comemos</em></td><td><em>vivimos</em></td></tr>
<tr><td>vosotros/as (vous)</td><td><em>habláis</em></td><td><em>coméis</em></td><td><em>vivís</em></td></tr>
<tr><td>ellos / ellas / ustedes</td><td><em>hablan</em></td><td><em>comen</em></td><td><em>viven</em></td></tr></table>
<ul>
<li>On <b>n'utilise presque jamais le pronom sujet</b> : la terminaison suffit. <em>Hablo francés</em> = je parle français. On l'ajoute pour insister : <em>Yo no, ¡tú!</em></li>
<li><b>vosotros</b> = « vous » quand on tutoie plusieurs personnes. Très utilisé en Espagne (en Amérique latine on dit <em>ustedes</em>).</li>
<li><b>usted / ustedes</b> = « vous » de politesse. Il se conjugue comme <b>él / ellos</b> : <em>¿Usted habla inglés?</em></li>
<li>En Espagne on tutoie beaucoup : serveurs, vendeurs, gens de ton âge. Garde <em>usted</em> pour les personnes âgées et l'administration.</li>
</ul>`,
  ex: [
    ['Yo ___ español. (hablar)', 'hablo'],
    ['Tú ___ en Barcelona. (vivir)', 'vives'],
    ['Nosotros ___ paella. (comer)', 'comemos'],
    ['¿Vosotros ___ francés? (hablar)', 'habláis'],
    ['Ellos ___ en una oficina. (trabajar)', 'trabajan'],
    ['Usted ___ mucho. (trabajar)', 'trabaja'],
    ['Mi hermana ___ en París. (vivir)', 'vive'],
    ['Nosotros ___ en la universidad. (estudiar)', 'estudiamos'],
    ['¿Qué ___ tú? (beber)', 'bebes'],
    ['Vosotros ___ un correo. (escribir)', 'escribís'],
    ['Ellas ___ música. (escuchar)', 'escuchan'],
  ] },

{ id: 'serestar', icon: '⚖️', level: 'A1', title: 'Ser ou estar ?',
  summary: 'Les deux verbes « être » : identité vs état.',
  html: `
<table class="tbl"><tr><th></th><th>ser</th><th>estar</th></tr>
<tr><td>yo</td><td><em>soy</em></td><td><em>estoy</em></td></tr>
<tr><td>tú</td><td><em>eres</em></td><td><em>estás</em></td></tr>
<tr><td>él / ella / usted</td><td><em>es</em></td><td><em>está</em></td></tr>
<tr><td>nosotros</td><td><em>somos</em></td><td><em>estamos</em></td></tr>
<tr><td>vosotros</td><td><em>sois</em></td><td><em>estáis</em></td></tr>
<tr><td>ellos / ustedes</td><td><em>son</em></td><td><em>están</em></td></tr></table>
<h3>SER = ce que l'on est (identité, définition)</h3>
<p>Nationalité, origine, profession, caractère, description, matière, heure, date, et lieu d'un <b>événement</b>.</p>
<p><em>Soy francés.</em> · <em>Es profesora.</em> · <em>Somos de Lyon.</em> · <em>Son las tres.</em> · <em>La fiesta es en mi casa.</em></p>
<h3>ESTAR = comment / où l'on est (état, situation)</h3>
<p>Localisation, état temporaire, humeur, santé, résultat, et <em>estar + gérondif</em>.</p>
<p><em>Estoy en Barcelona.</em> · <em>Estoy cansada.</em> · <em>La sopa está fría.</em> · <em>¿Dónde está el metro?</em> · <em>Estoy comiendo.</em></p>
<h3>Le sens change !</h3>
<ul>
<li><em>ser listo</em> = être intelligent · <em>estar listo</em> = être prêt</li>
<li><em>ser aburrido</em> = être ennuyeux · <em>estar aburrido</em> = s'ennuyer</li>
<li><em>ser rico</em> = être riche · <em>estar rico</em> = être délicieux</li>
<li><em>ser malo</em> = être méchant / mauvais · <em>estar malo</em> = être malade</li>
</ul>`,
  ex: [
    ['Yo ___ francés.', 'soy'],
    ['Barcelona ___ en Cataluña.', 'está'],
    ['Hoy ___ muy cansada. (yo)', 'estoy'],
    ['Mi compañero de piso ___ muy simpático.', 'es'],
    ['¿Dónde ___ el metro?', 'está'],
    ['___ las ocho de la tarde.', 'son'],
    ['Nosotros ___ estudiantes.', 'somos'],
    ['La sopa ___ fría.', 'está'],
    ['¡Esta paella ___ muy rica!', 'está'],
    ['Mis padres ___ de Lyon.', 'son'],
    ['¿___ listo? Nos vamos. (tú)', 'estás'],
    ['La fiesta ___ en casa de Marta.', 'es'],
  ] },

{ id: 'hayestar', icon: '📍', level: 'A1', title: 'Hay ou está ?',
  summary: '« Il y a » ou « se trouve » : le piège classique.',
  html: `
<p><b>hay</b> = il y a. Invariable, suivi d'un nom <b>sans article défini</b> (un, una, des nombres, rien, mucho…).</p>
<p><em>Hay un bar en la esquina.</em> · <em>Hay muchos turistas.</em> · <em>¿Hay wifi?</em> · <em>No hay agua caliente.</em></p>
<p><b>estar</b> = se trouver. Pour quelque chose de <b>précis, déjà connu</b> (el, la, mi, este…).</p>
<p><em>El bar está en la esquina.</em> · <em>Los baños están al fondo.</em> · <em>Mis llaves están en la mesa.</em></p>
<div class="tip">💡 Pour demander : <em>¿Hay una farmacia por aquí?</em> (y en a-t-il une ?) mais <em>¿Dónde está la farmacia?</em> (où est-elle ?)</div>
<p>Au passé : <em>había</em> (il y avait), <em>hubo</em> (il y a eu), <em>ha habido</em>. Au futur : <em>habrá</em>.</p>`,
  ex: [
    ['___ un supermercado cerca de mi piso.', ['Hay', 'Está'], 0],
    ['El supermercado ___ cerca de mi piso.', ['hay', 'está'], 1],
    ['¿___ wifi en el piso?', ['Hay', 'Está'], 0],
    ['¿Dónde ___ los baños?', 'están'],
    ['En Barcelona ___ muchas playas.', 'hay'],
    ['La Sagrada Familia ___ en el Eixample.', 'está'],
    ['No ___ agua caliente.', 'hay'],
    ['Mis llaves ___ en la mesa.', 'están'],
  ] },

{ id: 'muymucho', icon: '📏', level: 'A1', title: 'Muy, mucho, bueno, bien',
  summary: 'Très / beaucoup, bon / bien : les erreurs des francophones.',
  html: `
<h3>muy ou mucho ?</h3>
<ul>
<li><b>muy</b> (très) + adjectif ou adverbe, invariable : <em>muy bonito</em>, <em>muy bien</em>, <em>muy tarde</em>.</li>
<li><b>mucho</b> (beaucoup) après un verbe, invariable : <em>Me gusta mucho.</em> <em>Trabajo mucho.</em></li>
<li><b>mucho / mucha / muchos / muchas</b> (beaucoup de) + nom, accordé : <em>mucha gente</em>, <em>muchos amigos</em>, <em>mucho calor</em>.</li>
</ul>
<p>⚠️ On ne dit jamais « muy mucho ». Pour insister : <em>muchísimo</em>.</p>
<h3>bueno ou bien ?</h3>
<ul>
<li><b>bueno / buena</b> = bon (adjectif) : <em>un restaurante bueno</em>. Devant un nom masculin singulier : <b>buen</b> → <em>un buen restaurante</em>, <em>¡Buen día!</em></li>
<li><b>bien</b> = bien (adverbe) : <em>Hablas bien.</em> <em>Estoy bien.</em></li>
<li>Même chose avec <em>malo → mal</em> : <em>un mal día</em>, <em>Me siento mal.</em></li>
</ul>`,
  ex: [
    ['Barcelona es ___ bonita.', 'muy'],
    ['Me gusta ___ la playa.', 'mucho'],
    ['Hay ___ gente en la playa.', 'mucha'],
    ['Hablas ___ bien español.', 'muy'],
    ['Tengo ___ amigos aquí.', 'muchos'],
    ['Hace ___ calor.', 'mucho'],
    ['Este restaurante es muy ___. (bon)', 'bueno'],
    ['Es un ___ restaurante. (bon, devant le nom)', 'buen'],
    ['Estoy ___, gracias.', ['bien', 'bueno'], 0],
  ] },

{ id: 'irregulares', icon: '🌀', level: 'A1', title: 'Verbes irréguliers au présent',
  summary: 'quiero, puedo, tengo, hago, voy… les indispensables.',
  html: `
<h3>1. Les verbes « botte » (diphtongue)</h3>
<p>La voyelle du radical change à toutes les personnes <b>sauf nosotros et vosotros</b> :</p>
<table class="tbl"><tr><th></th><th>e → ie<br>querer</th><th>o → ue<br>poder</th><th>e → i<br>pedir</th></tr>
<tr><td>yo</td><td><em>quiero</em></td><td><em>puedo</em></td><td><em>pido</em></td></tr>
<tr><td>tú</td><td><em>quieres</em></td><td><em>puedes</em></td><td><em>pides</em></td></tr>
<tr><td>él / usted</td><td><em>quiere</em></td><td><em>puede</em></td><td><em>pide</em></td></tr>
<tr><td>nosotros</td><td><em>queremos</em></td><td><em>podemos</em></td><td><em>pedimos</em></td></tr>
<tr><td>vosotros</td><td><em>queréis</em></td><td><em>podéis</em></td><td><em>pedís</em></td></tr>
<tr><td>ellos</td><td><em>quieren</em></td><td><em>pueden</em></td><td><em>piden</em></td></tr></table>
<p>Comme <b>querer</b> : pensar, empezar, preferir, entender, cerrar. Comme <b>poder</b> : volver, dormir, encontrar, costar, jugar (<em>juego</em>). Comme <b>pedir</b> : repetir, servir.</p>
<h3>2. Irréguliers seulement à « yo »</h3>
<p><em>hacer → hago</em>, <em>poner → pongo</em>, <em>salir → salgo</em>, <em>traer → traigo</em>, <em>conocer → conozco</em>, <em>saber → sé</em>, <em>dar → doy</em>, <em>ver → veo</em>.</p>
<h3>3. Les deux à la fois</h3>
<p><em>tener → tengo, tienes</em> · <em>venir → vengo, vienes</em> · <em>decir → digo, dices</em>.</p>
<h3>4. Totalement irréguliers</h3>
<p><b>ir</b> : <em>voy, vas, va, vamos, vais, van</em> — plus <em>ser</em> et <em>estar</em> (voir leçon dédiée).</p>
<div class="tip">💡 Tous ces verbes sont dans l'onglet <b>Conjugaison</b>, avec un entraînement ciblé.</div>`,
  ex: [
    ['Yo ___ un café. (querer)', 'quiero'],
    ['¿___ abrir la ventana? (poder, tú)', 'puedes'],
    ['Nosotros ___ ir a la playa. (querer)', 'queremos'],
    ['Yo ___ los deberes. (hacer)', 'hago'],
    ['Yo no ___ la respuesta. (saber)', 'sé'],
    ['Ella ___ ocho horas. (dormir)', 'duerme'],
    ['Yo ___ veinte años. (tener)', 'tengo'],
    ['¿A qué hora ___ el concierto? (empezar)', 'empieza'],
    ['Yo ___ a Marta desde hace años. (conocer)', 'conozco'],
    ['Vosotros ___ al cine esta noche. (ir)', 'vais'],
    ['Yo ___ de casa a las ocho. (salir)', 'salgo'],
    ['Ellos ___ una pizza. (pedir)', 'piden'],
    ['¿Cuánto ___ el billete? (costar)', 'cuesta'],
  ] },

{ id: 'gustar', icon: '❤️', level: 'A1', title: 'Gustar & compagnie',
  summary: 'me gusta, me encanta, me duele, me apetece…',
  html: `
<p><b>gustar</b> fonctionne « à l'envers » : littéralement « X me plaît ». Le verbe s'accorde avec <b>ce qui plaît</b>, pas avec la personne.</p>
<table class="tbl"><tr><th>(à qui)</th><th>+ singulier / infinitif</th><th>+ pluriel</th></tr>
<tr><td>(a mí) me</td><td><em>me gusta Barcelona</em></td><td><em>me gustan las tapas</em></td></tr>
<tr><td>(a ti) te</td><td><em>te gusta bailar</em></td><td><em>te gustan los gatos</em></td></tr>
<tr><td>(a él / ella / usted) le</td><td><em>le gusta el fútbol</em></td><td><em>le gustan los museos</em></td></tr>
<tr><td>(a nosotros) nos</td><td><em>nos gusta el mar</em></td><td><em>nos gustan las fiestas</em></td></tr>
<tr><td>(a vosotros) os</td><td><em>os gusta el vermut</em></td><td><em>os gustan las croquetas</em></td></tr>
<tr><td>(a ellos / ustedes) les</td><td><em>les gusta salir</em></td><td><em>les gustan los conciertos</em></td></tr></table>
<p>On ajoute <em>a mí, a ti, a Marta…</em> pour insister ou préciser : <em>A Marta le gusta el vermut.</em></p>
<h3>Même construction</h3>
<p><em>encantar</em> (adorer) : <em>me encanta</em> · <em>doler</em> (faire mal) : <em>me duele la cabeza</em>, <em>me duelen los pies</em> · <em>apetecer</em> (avoir envie) : <em>¿Te apetece un café?</em> · <em>interesar</em>, <em>importar</em>, <em>molestar</em>, <em>quedar</em> (aller bien) : <em>me queda bien</em> · <em>molar</em> (familier) : <em>me mola</em>.</p>
<h3>Réagir</h3>
<p>— <em>Me gusta el café.</em> — <em>A mí también.</em> (moi aussi) / <em>A mí no.</em> (pas moi)<br>— <em>No me gusta el café.</em> — <em>A mí tampoco.</em> (moi non plus) / <em>A mí sí.</em> (moi si)</p>`,
  ex: [
    ['Me ___ la playa.', 'gusta'],
    ['Me ___ las croquetas.', 'gustan'],
    ['¿___ gusta bailar? (à toi)', 'te'],
    ['A Pedro ___ gusta el fútbol.', 'le'],
    ['Nos ___ los museos. (encantar)', 'encantan'],
    ['Me ___ la cabeza. (doler)', 'duele'],
    ['Me ___ los pies. (doler)', 'duelen'],
    ['¿Os ___ un café? (apetecer)', 'apetece'],
    ['— No me gusta el café. — A mí ___. (moi non plus)', 'tampoco'],
    ['— Me encanta Barcelona. — ¡A mí ___! (moi aussi)', 'también'],
    ['A mis amigos ___ gusta salir.', 'les'],
  ] },

{ id: 'preguntas', icon: '❓', level: 'A1', title: 'Questions & négation',
  summary: '¿Qué? ¿Dónde? ¿Cuánto?… et no, nunca, nada, nadie.',
  html: `
<p>À l'écrit, les questions et exclamations s'ouvrent avec <b>¿</b> et <b>¡</b>. À l'oral, l'intonation suffit : <em>¿Hablas francés?</em></p>
<table class="tbl"><tr><th>Mot</th><th>Sens</th><th>Exemple</th></tr>
<tr><td><em>¿qué?</em></td><td>quoi, que, quel</td><td><em>¿Qué quieres?</em></td></tr>
<tr><td><em>¿quién? / ¿quiénes?</em></td><td>qui</td><td><em>¿Quién es?</em></td></tr>
<tr><td><em>¿dónde?</em></td><td>où</td><td><em>¿Dónde vives?</em></td></tr>
<tr><td><em>¿adónde?</em></td><td>où (direction)</td><td><em>¿Adónde vas?</em></td></tr>
<tr><td><em>¿de dónde?</em></td><td>d'où</td><td><em>¿De dónde eres?</em></td></tr>
<tr><td><em>¿cuándo?</em></td><td>quand</td><td><em>¿Cuándo llegas?</em></td></tr>
<tr><td><em>¿cuánto? / ¿cuánta? / ¿cuántos? / ¿cuántas?</em></td><td>combien</td><td><em>¿Cuántos años tienes?</em></td></tr>
<tr><td><em>¿cómo?</em></td><td>comment</td><td><em>¿Cómo estás?</em></td></tr>
<tr><td><em>¿por qué?</em></td><td>pourquoi</td><td><em>¿Por qué no vienes?</em> — <em>Porque…</em></td></tr>
<tr><td><em>¿cuál? / ¿cuáles?</em></td><td>lequel, quel (choix)</td><td><em>¿Cuál prefieres?</em></td></tr></table>
<h3>La négation</h3>
<p>Simple : <b>no</b> devant le verbe. <em>No hablo catalán.</em></p>
<p>Avec <em>nunca</em> (jamais), <em>nada</em> (rien), <em>nadie</em> (personne), <em>tampoco</em> (non plus), <em>ninguno</em> (aucun) : soit devant le verbe <b>sans no</b>, soit après le verbe <b>avec no</b> (double négation obligatoire).</p>
<p><em>Nunca como carne.</em> = <em>No como carne nunca.</em> · <em>No conozco a nadie.</em> · <em>No quiero nada.</em></p>`,
  ex: [
    ['¿___ te llamas?', 'cómo'],
    ['¿De ___ eres? — Soy de Francia.', 'dónde'],
    ['¿___ cuesta? — Diez euros.', 'cuánto'],
    ['¿___ es tu cumpleaños? — En marzo.', 'cuándo'],
    ['¿___ estudias español? — Porque voy a vivir en Barcelona.', 'por qué'],
    ['¿___ es ese chico? — Es mi compañero de piso.', 'quién'],
    ['¿___ prefieres, el rojo o el azul?', 'cuál'],
    ['No conozco a ___ aquí. (personne)', 'nadie'],
    ['No quiero ___, gracias. (rien)', 'nada'],
    ['___ llego tarde. (jamais)', 'nunca'],
    ['Traduis : Je ne parle pas catalan.', 'no hablo catalán'],
  ] },

{ id: 'perifrasis', icon: '🧭', level: 'A1', title: 'Futur proche & obligation',
  summary: 'voy a…, tengo que…, hay que…, acabo de…',
  html: `
<h3>Futur proche : ir a + infinitif</h3>
<p><em>Voy a vivir en Barcelona.</em> · <em>¿Qué vas a hacer esta noche?</em> · <em>Vamos a cenar fuera.</em></p>
<h3>Obligation</h3>
<ul>
<li><b>tener que</b> + infinitif (obligation personnelle) : <em>Tengo que buscar piso.</em></li>
<li><b>hay que</b> + infinitif (« il faut », en général) : <em>Hay que pedir cita previa.</em></li>
<li><b>deber</b> + infinitif (devoir moral, conseil) : <em>Debes descansar.</em></li>
<li><b>necesitar</b> + infinitif : <em>Necesito hablar contigo.</em></li>
</ul>
<h3>Autres tournures utiles</h3>
<ul>
<li><b>acabar de</b> + inf. = venir de : <em>Acabo de llegar.</em></li>
<li><b>volver a</b> + inf. = refaire : <em>Vuelvo a llamar mañana.</em></li>
<li><b>empezar a</b> + inf. = commencer à : <em>Empiezo a entender.</em></li>
<li><b>dejar de</b> + inf. = arrêter de : <em>Quiero dejar de fumar.</em></li>
</ul>`,
  ex: [
    ['Mañana ___ a visitar un piso. (yo)', 'voy'],
    ['¿Qué ___ a hacer el fin de semana? (tú)', 'vas'],
    ['Nosotros ___ a cenar en la Barceloneta.', 'vamos'],
    ['___ que buscar trabajo. (yo, obligation)', 'tengo'],
    ['Para el NIE, ___ que pedir cita previa. (en général)', 'hay'],
    ['___ de llegar a Barcelona. (yo : je viens d’arriver)', 'acabo'],
    ['Ellos ___ que estudiar mucho.', 'tienen'],
    ['Quiero dejar ___ fumar.', 'de'],
    ['Traduis : Je vais apprendre l’espagnol.', 'voy a aprender español|voy a aprender el español'],
  ] },

{ id: 'reflexivos', icon: '🪞', level: 'A2', title: 'Verbes pronominaux',
  summary: 'me llamo, me levanto, me quedo… et quedar vs quedarse.',
  html: `
<p>Les verbes en <b>-se</b> se conjuguent avec <em>me, te, se, nos, os, se</em> :</p>
<table class="tbl"><tr><th></th><th>levantarse (se lever)</th></tr>
<tr><td>yo</td><td><em>me levanto</em></td></tr><tr><td>tú</td><td><em>te levantas</em></td></tr>
<tr><td>él / usted</td><td><em>se levanta</em></td></tr><tr><td>nosotros</td><td><em>nos levantamos</em></td></tr>
<tr><td>vosotros</td><td><em>os levantáis</em></td></tr><tr><td>ellos / ustedes</td><td><em>se levantan</em></td></tr></table>
<p>Courants : <em>llamarse</em>, <em>despertarse</em>, <em>ducharse</em>, <em>vestirse</em>, <em>acostarse</em>, <em>quedarse</em>, <em>irse</em>, <em>sentirse</em>, <em>equivocarse</em> (se tromper).</p>
<h3>Place du pronom</h3>
<p>Devant le verbe conjugué, ou <b>collé</b> à l'infinitif / au gérondif / à l'impératif : <em>Me voy a duchar</em> = <em>Voy a ducharme</em>. <em>¡Levántate!</em></p>
<h3>Le sens change</h3>
<ul>
<li><em>ir</em> (aller) / <em>irse</em> (s'en aller) : <em>Me voy.</em> = je m'en vais.</li>
<li><em>quedar</em> (se donner rendez-vous) / <em>quedarse</em> (rester) : <em>¿Quedamos a las ocho?</em> vs <em>Me quedo en casa.</em></li>
<li><em>dormir</em> / <em>dormirse</em> (s'endormir) · <em>llamar</em> (appeler) / <em>llamarse</em> (s'appeler).</li>
</ul>`,
  ex: [
    ['Yo ___ llamo Lucas.', 'me'],
    ['¿A qué hora ___ levantas?', 'te'],
    ['Nosotros ___ duchamos por la mañana.', 'nos'],
    ['Ella ___ acuesta tarde.', 'se'],
    ['¿Vosotros ___ quedáis en casa?', 'os'],
    ['Mañana voy a levantar___ temprano.', 'me'],
    ['Ya es tarde, ___ voy. (je m’en vais)', 'me'],
    ['« On se retrouve à 8 h ? » se dit…', ['¿Quedamos a las ocho?', '¿Nos quedamos a las ocho?'], 0],
    ['Mis amigos ___ en un hotel. (quedarse, présent)', 'se quedan'],
  ] },

{ id: 'posesivos', icon: '👉', level: 'A2', title: 'Possessifs & démonstratifs',
  summary: 'mi, tu, su… este, ese, aquel.',
  html: `
<table class="tbl"><tr><th>Français</th><th>Singulier</th><th>Pluriel</th></tr>
<tr><td>mon, ma</td><td><em>mi</em></td><td><em>mis</em></td></tr>
<tr><td>ton, ta</td><td><em>tu</em></td><td><em>tus</em></td></tr>
<tr><td>son, sa, votre (usted)</td><td><em>su</em></td><td><em>sus</em></td></tr>
<tr><td>notre</td><td><em>nuestro / nuestra</em></td><td><em>nuestros / nuestras</em></td></tr>
<tr><td>votre (vosotros)</td><td><em>vuestro / vuestra</em></td><td><em>vuestros / vuestras</em></td></tr>
<tr><td>leur, votre (ustedes)</td><td><em>su</em></td><td><em>sus</em></td></tr></table>
<p>Formes toniques (« à moi ») : <em>mío, tuyo, suyo, nuestro, vuestro</em> → <em>Es mío.</em> · <em>un amigo mío</em> (un de mes amis).</p>
<h3>Démonstratifs : trois distances</h3>
<table class="tbl"><tr><th>Distance</th><th>Masc.</th><th>Fém.</th><th>Neutre</th></tr>
<tr><td>ici (près de moi)</td><td><em>este / estos</em></td><td><em>esta / estas</em></td><td><em>esto</em></td></tr>
<tr><td>là (près de toi)</td><td><em>ese / esos</em></td><td><em>esa / esas</em></td><td><em>eso</em></td></tr>
<tr><td>là-bas (loin)</td><td><em>aquel / aquellos</em></td><td><em>aquella / aquellas</em></td><td><em>aquello</em></td></tr></table>
<p><em>¿Qué es esto?</em> (qu'est-ce que c'est ?) · <em>¡Eso es!</em> (exactement !) · <em>Por eso.</em> (c'est pour ça.)</p>`,
  ex: [
    ['___ piso es muy grande. (mon)', 'mi'],
    ['___ amigos son simpáticos. (tes)', 'tus'],
    ['¿Es ___ móvil, señora? (votre, usted)', 'su'],
    ['___ casa está en Gràcia. (notre)', 'nuestra'],
    ['¿Vivís con ___ padres? (vos, vosotros)', 'vuestros'],
    ['___ chaqueta es bonita. (cette, près de moi)', 'esta'],
    ['¿Qué es ___? (ça, près de toi)', 'eso'],
    ['___ montañas de allí son preciosas. (ces, là-bas)', 'aquellas'],
    ['Este libro es ___. (à moi)', 'mío'],
  ] },

{ id: 'porpara', icon: '🎯', level: 'A2', title: 'Por ou para ?',
  summary: 'Deux façons de dire « pour »… et « par ».',
  html: `
<h3>PARA → le but, la destination</h3>
<ul>
<li>But : <em>Estudio español para vivir en Barcelona.</em></li>
<li>Destinataire : <em>Este regalo es para ti.</em></li>
<li>Direction : <em>Salgo para Madrid.</em></li>
<li>Échéance : <em>Lo necesito para el lunes.</em></li>
<li>Opinion : <em>Para mí, es la mejor ciudad.</em></li>
</ul>
<h3>POR → la cause, le moyen, le passage</h3>
<ul>
<li>Cause : <em>Gracias por todo.</em> · <em>Por eso.</em></li>
<li>Moyen : <em>Te llamo por teléfono.</em></li>
<li>Lieu traversé : <em>Paseo por el barrio.</em></li>
<li>Moment de la journée : <em>por la mañana</em>, <em>por la noche</em></li>
<li>Prix, échange : <em>Lo compré por diez euros.</em></li>
</ul>
<p>Expressions : <em>por favor</em>, <em>por fin</em>, <em>por cierto</em>, <em>por supuesto</em>, <em>por ejemplo</em>, <em>por si acaso</em> (au cas où).</p>`,
  ex: [
    ['Gracias ___ tu ayuda.', 'por'],
    ['Este regalo es ___ ti.', 'para'],
    ['Estudio español ___ vivir en Barcelona.', 'para'],
    ['Me gusta pasear ___ el Born.', 'por'],
    ['Te llamo ___ teléfono.', 'por'],
    ['Necesito el informe ___ el viernes.', 'para'],
    ['Compré la bici ___ cien euros.', 'por'],
    ['Trabajo ___ la mañana.', 'por'],
    ['___ mí, Barcelona es la ciudad más bonita.', 'para'],
    ['¡___ fin es viernes!', 'por'],
    ['Salgo ___ Barcelona el 4 de enero.', 'para'],
  ] },

{ id: 'comparativos', icon: '📊', level: 'A2', title: 'Comparer',
  summary: 'más… que, tan… como, mejor, -ísimo.',
  html: `
<ul>
<li><b>más</b> + adj + <b>que</b> : <em>Barcelona es más grande que Lyon.</em></li>
<li><b>menos</b> + adj + <b>que</b> : <em>El bus es menos rápido que el metro.</em></li>
<li><b>tan</b> + adj + <b>como</b> : <em>Es tan caro como en París.</em></li>
<li><b>tanto / tanta / tantos / tantas</b> + nom + <b>como</b> : <em>Tengo tantos amigos como tú.</em></li>
<li>verbe + <b>tanto como</b> : <em>Trabajo tanto como tú.</em></li>
</ul>
<h3>Irréguliers</h3>
<p><em>mejor</em> (meilleur, mieux) · <em>peor</em> (pire) · <em>mayor</em> (plus âgé) · <em>menor</em> (plus jeune).</p>
<h3>Superlatifs</h3>
<p><em>Es la playa más bonita de Barcelona.</em> (le / la plus… <b>de</b>)<br>
Absolu avec <b>-ísimo</b> : <em>buenísimo</em>, <em>carísimo</em>, <em>muchísimo</em>, <em>riquísimo</em> (super bon !).</p>`,
  ex: [
    ['Barcelona es ___ grande que Lyon. (plus)', 'más'],
    ['El metro es ___ rápido como el coche. (aussi)', 'tan'],
    ['Esta paella es ___ que la otra. (meilleure)', 'mejor'],
    ['Mi hermana es ___ que yo. (plus âgée)', 'mayor'],
    ['Tengo ___ amigos como tú. (autant de)', 'tantos'],
    ['Es la calle ___ bonita del barrio.', 'más'],
    ['La comida está ___. (très bonne, en -ísima)', 'buenísima'],
    ['El piso es ___ caro que el otro. (moins)', 'menos'],
    ['Este café es ___ que el de ayer. (pire)', 'peor'],
  ] },

{ id: 'perfecto', icon: '✅', level: 'A2', title: 'Le passé composé (pretérito perfecto)',
  summary: 'he comido, has visto… pour aujourd’hui et les expériences.',
  html: `
<p>Formation : <b>haber</b> au présent + <b>participe passé</b>.</p>
<table class="tbl"><tr><th></th><th>haber</th><th>+ participe</th></tr>
<tr><td>yo</td><td><em>he</em></td><td rowspan="6"><em>hablado</em> (-ar → -ado)<br><em>comido</em> (-er → -ido)<br><em>vivido</em> (-ir → -ido)</td></tr>
<tr><td>tú</td><td><em>has</em></td></tr><tr><td>él / usted</td><td><em>ha</em></td></tr>
<tr><td>nosotros</td><td><em>hemos</em></td></tr><tr><td>vosotros</td><td><em>habéis</em></td></tr><tr><td>ellos</td><td><em>han</em></td></tr></table>
<p><b>Participes irréguliers</b> : <em>hecho</em> (hacer), <em>dicho</em> (decir), <em>visto</em> (ver), <em>puesto</em> (poner), <em>vuelto</em> (volver), <em>escrito</em> (escribir), <em>abierto</em> (abrir), <em>roto</em> (romper), <em>muerto</em> (morir).</p>
<h3>Quand l'utiliser (en Espagne)</h3>
<ul>
<li>Période <b>pas encore terminée</b> : <em>hoy</em>, <em>esta mañana</em>, <em>esta semana</em>, <em>este año</em> → <em>Hoy he comido paella.</em></li>
<li><b>Expérience</b> de vie : <em>¿Has estado en Barcelona?</em> · <em>Nunca he comido calçots.</em></li>
<li>Avec <em>ya</em> (déjà) et <em>todavía no</em> (pas encore) : <em>Ya he pedido cita.</em></li>
</ul>
<div class="tip">⚠️ Toujours <b>haber</b>, jamais « être » : <em>He ido</em> = je suis allé(e). Le participe ne s'accorde jamais et ne se sépare jamais de haber : <em>Las he visto.</em></div>`,
  ex: [
    ['Hoy ___ comido paella. (yo)', 'he'],
    ['¿___ estado en Barcelona? (tú)', 'has'],
    ['Esta semana nosotros ___ trabajado mucho.', 'hemos'],
    ['Ella ha ___ una carta. (escribir)', 'escrito'],
    ['¿Qué has ___ hoy? (hacer)', 'hecho'],
    ['Todavía no he ___ la Sagrada Familia. (ver)', 'visto'],
    ['¿Habéis ___ a casa? (volver)', 'vuelto'],
    ['Ellos ya han ___ el piso. (alquilar)', 'alquilado'],
    ['Je suis allé(e) au marché ce matin → Esta mañana ___ ido al mercado.', 'he'],
    ['Traduis : Je n’ai jamais mangé de calçots.', 'nunca he comido calçots|no he comido nunca calçots'],
  ] },

{ id: 'indefinido', icon: '⏮️', level: 'A2', title: 'Le passé simple (pretérito indefinido)',
  summary: 'hablé, comí, fui… pour hier et les actions terminées.',
  html: `
<p>Pour une action <b>terminée dans une période terminée</b> : <em>ayer</em>, <em>anoche</em>, <em>la semana pasada</em>, <em>el año pasado</em>, <em>en 2020</em>, <em>hace dos días</em>. À l'oral, c'est l'équivalent de notre passé composé.</p>
<table class="tbl"><tr><th></th><th>hablar</th><th>comer</th><th>vivir</th></tr>
<tr><td>yo</td><td><em>hablé</em></td><td><em>comí</em></td><td><em>viví</em></td></tr>
<tr><td>tú</td><td><em>hablaste</em></td><td><em>comiste</em></td><td><em>viviste</em></td></tr>
<tr><td>él / usted</td><td><em>habló</em></td><td><em>comió</em></td><td><em>vivió</em></td></tr>
<tr><td>nosotros</td><td><em>hablamos</em></td><td><em>comimos</em></td><td><em>vivimos</em></td></tr>
<tr><td>vosotros</td><td><em>hablasteis</em></td><td><em>comisteis</em></td><td><em>vivisteis</em></td></tr>
<tr><td>ellos</td><td><em>hablaron</em></td><td><em>comieron</em></td><td><em>vivieron</em></td></tr></table>
<h3>Irréguliers fréquents (sans accent !)</h3>
<p><b>ser / ir</b> (identiques) : <em>fui, fuiste, fue, fuimos, fuisteis, fueron</em><br>
Radical spécial + <em>-e, -iste, -o, -imos, -isteis, -ieron</em> : <em>tener → tuve</em>, <em>estar → estuve</em>, <em>poder → pude</em>, <em>poner → puse</em>, <em>saber → supe</em>, <em>querer → quise</em>, <em>venir → vine</em>, <em>hacer → hice, hizo</em>, <em>decir → dije, dijeron</em>.<br>
<em>dar → di, dio</em> · <em>ver → vi, vio</em> · <em>hay → hubo</em>.</p>
<p>Verbes en -ir à diphtongue, à la 3<sup>e</sup> personne : <em>pidió</em>, <em>durmió</em>, <em>sintió</em>. Orthographe à « yo » : <em>busqué</em>, <em>llegué</em>, <em>empecé</em>.</p>
<div class="tip">💡 <em>Hoy he comido</em> (aujourd'hui) mais <em>Ayer comí</em> (hier).</div>`,
  ex: [
    ['Ayer ___ con mis amigos. (cenar, yo)', 'cené'],
    ['El año pasado ___ a Barcelona. (ir, yo)', 'fui'],
    ['¿Qué ___ anoche? (hacer, tú)', 'hiciste'],
    ['Ella ___ a las diez. (llegar)', 'llegó'],
    ['Nosotros ___ en la playa todo el día. (estar)', 'estuvimos'],
    ['Ellos ___ una casa en la montaña. (alquilar)', 'alquilaron'],
    ['¿___ la película? (ver, vosotros)', 'visteis'],
    ['Yo ___ el autobús a las ocho. (coger)', 'cogí'],
    ['Mi hermano ___ diez horas. (dormir)', 'durmió'],
    ['Yo ___ las llaves por todas partes. (buscar)', 'busqué'],
    ['___ he visto a Marta.', ['Hoy', 'Ayer'], 0],
    ['___ vi a Marta.', ['Esta mañana', 'Ayer'], 1],
  ] },

{ id: 'imperfecto', icon: '🎞️', level: 'B1', title: 'L’imparfait (pretérito imperfecto)',
  summary: 'Décrire le passé, les habitudes… et le contraster avec l’indefinido.',
  html: `
<table class="tbl"><tr><th></th><th>hablar</th><th>comer / vivir</th></tr>
<tr><td>yo</td><td><em>hablaba</em></td><td><em>comía</em></td></tr>
<tr><td>tú</td><td><em>hablabas</em></td><td><em>comías</em></td></tr>
<tr><td>él / usted</td><td><em>hablaba</em></td><td><em>comía</em></td></tr>
<tr><td>nosotros</td><td><em>hablábamos</em></td><td><em>comíamos</em></td></tr>
<tr><td>vosotros</td><td><em>hablabais</em></td><td><em>comíais</em></td></tr>
<tr><td>ellos</td><td><em>hablaban</em></td><td><em>comían</em></td></tr></table>
<p>Seulement 3 irréguliers : <em>ser → era</em>, <em>ir → iba</em>, <em>ver → veía</em>.</p>
<h3>Utilisation (comme en français)</h3>
<ul>
<li>Description, contexte : <em>Hacía sol y había mucha gente.</em></li>
<li>Habitude passée : <em>De pequeño, iba a la playa todos los veranos.</em></li>
<li>Action en cours, interrompue : <em>Estaba en la ducha cuando sonó el teléfono.</em></li>
</ul>
<div class="tip">💡 Imparfait = le décor (ce qui durait). Indefinido = l'événement (ce qui s'est passé, d'un coup). <em>Mientras cocinaba, llegó Pablo.</em></div>`,
  ex: [
    ['Cuando era pequeño, ___ en Lyon. (vivir)', 'vivía'],
    ['Antes yo ___ mucho al cine. (ir)', 'iba'],
    ['De pequeña, ___ muy tímida. (ser)', 'era'],
    ['Todos los veranos ___ a la playa. (ir, nosotros)', 'íbamos'],
    ['Hacía sol y la gente ___ en la terraza. (estar)', 'estaba'],
    ['Yo ___ la tele cuando llamaste. (ver)', 'veía'],
    ['Mientras cocinaba, ___ el teléfono.', ['sonaba', 'sonó'], 1],
    ['Antes no ___ hablar español. (saber, yo)', 'sabía'],
    ['Ayer ___ a Marta en el metro.', ['vi', 'veía'], 0],
    ['Mis abuelos ___ en el campo. (trabajar)', 'trabajaban'],
  ] },

{ id: 'gerundio', icon: '⏳', level: 'A2', title: 'Estar + gérondif',
  summary: 'Estoy aprendiendo : « être en train de ».',
  html: `
<p>Gérondif : <b>-ar → -ando</b> (<em>hablando</em>), <b>-er / -ir → -iendo</b> (<em>comiendo</em>, <em>viviendo</em>).</p>
<p>Irréguliers : <em>leyendo</em> (leer), <em>oyendo</em> (oír), <em>yendo</em> (ir), <em>durmiendo</em> (dormir), <em>pidiendo</em> (pedir), <em>diciendo</em> (decir), <em>sintiendo</em> (sentir), <em>viniendo</em> (venir).</p>
<h3>Utilisations</h3>
<ul>
<li><b>estar + gérondif</b> = être en train de : <em>Estoy aprendiendo español.</em> · <em>¿Qué estás haciendo?</em></li>
<li><b>seguir + gérondif</b> = continuer à : <em>Sigo buscando piso.</em></li>
<li><b>llevar + durée + gérondif</b> = ça fait… que : <em>Llevo dos meses estudiando español.</em></li>
</ul>`,
  ex: [
    ['Estoy ___ español. (aprender)', 'aprendiendo'],
    ['¿Qué estás ___? (hacer)', 'haciendo'],
    ['Está ___. (llover)', 'lloviendo'],
    ['Nosotros estamos ___ la cena. (preparar)', 'preparando'],
    ['Mi compañero está ___. (dormir)', 'durmiendo'],
    ['Estoy ___ un libro. (leer)', 'leyendo'],
    ['Llevo dos meses ___ español. (estudiar)', 'estudiando'],
    ['Ellos ___ hablando. (estar)', 'están'],
    ['Sigo ___ piso. (buscar)', 'buscando'],
  ] },

{ id: 'pronombres', icon: '🔄', level: 'A2', title: 'Pronoms compléments (lo, la, le, se lo)',
  summary: 'Lo tengo, te lo doy, dímelo…',
  html: `
<table class="tbl"><tr><th></th><th>COD (le, la, les)</th><th>COI (lui, leur)</th></tr>
<tr><td>moi</td><td><em>me</em></td><td><em>me</em></td></tr>
<tr><td>toi</td><td><em>te</em></td><td><em>te</em></td></tr>
<tr><td>lui, elle, vous (usted)</td><td><em>lo / la</em></td><td><em>le</em></td></tr>
<tr><td>nous</td><td><em>nos</em></td><td><em>nos</em></td></tr>
<tr><td>vous (vosotros)</td><td><em>os</em></td><td><em>os</em></td></tr>
<tr><td>eux, elles, vous (ustedes)</td><td><em>los / las</em></td><td><em>les</em></td></tr></table>
<p><em>¿Tienes las llaves? — Sí, las tengo.</em> · <em>Le escribo a Marta.</em> (je lui écris)</p>
<h3>Place</h3>
<p>Devant le verbe conjugué, mais <b>collé</b> à l'infinitif, au gérondif et à l'impératif affirmatif : <em>Lo voy a comprar</em> = <em>Voy a comprarlo</em>. <em>¡Dímelo!</em> · <em>No me lo digas.</em></p>
<h3>Deux pronoms ensemble</h3>
<p>Ordre : COI puis COD → <em>me lo</em>, <em>te la</em>, <em>nos los</em>. Et <b>le / les + lo / la → se lo / se la</b> : <em>Le doy el regalo → Se lo doy.</em></p>
<div class="tip">💡 À Madrid on entend souvent <em>le</em> pour un homme en COD (<em>le veo</em> = je le vois) : c'est accepté.</div>`,
  ex: [
    ['¿Tienes el billete? — Sí, ___ tengo.', 'lo'],
    ['¿Conoces a Marta? — Sí, ___ conozco.', 'la'],
    ['¿Compras las entradas? — Sí, ___ compro.', 'las'],
    ['¿Me llamas mañana? — Sí, ___ llamo.', 'te'],
    ['Doy el regalo a Pedro → ___ doy el regalo.', 'le'],
    ['Doy el regalo a Pedro → ___ doy.', 'se lo'],
    ['¿Me pasas la sal? — Sí, te ___ paso.', 'la'],
    ['Voy a comprar___. (le pain)', 'lo'],
    ['Traduis : Dis-le-moi ! (tú)', 'dímelo'],
  ] },

{ id: 'futuro', icon: '🔮', level: 'B1', title: 'Futur & conditionnel',
  summary: 'hablaré, podría, me gustaría… et la politesse.',
  html: `
<p>Les deux se forment sur <b>l'infinitif entier</b> :</p>
<table class="tbl"><tr><th></th><th>Futur</th><th>Conditionnel</th></tr>
<tr><td>yo</td><td><em>hablaré</em></td><td><em>hablaría</em></td></tr>
<tr><td>tú</td><td><em>hablarás</em></td><td><em>hablarías</em></td></tr>
<tr><td>él / usted</td><td><em>hablará</em></td><td><em>hablaría</em></td></tr>
<tr><td>nosotros</td><td><em>hablaremos</em></td><td><em>hablaríamos</em></td></tr>
<tr><td>vosotros</td><td><em>hablaréis</em></td><td><em>hablaríais</em></td></tr>
<tr><td>ellos</td><td><em>hablarán</em></td><td><em>hablarían</em></td></tr></table>
<p><b>Radicaux irréguliers</b> (les mêmes pour les deux) : <em>tendr-</em> (tener), <em>podr-</em> (poder), <em>querr-</em> (querer), <em>sabr-</em> (saber), <em>har-</em> (hacer), <em>dir-</em> (decir), <em>vendr-</em> (venir), <em>pondr-</em> (poner), <em>saldr-</em> (salir), <em>habr-</em> (haber).</p>
<h3>Le futur sert aussi à faire une supposition</h3>
<p><em>¿Dónde está Marta? — Estará en clase.</em> (elle doit être en cours)</p>
<h3>Le conditionnel = politesse et conseils</h3>
<p><em>Me gustaría un café.</em> · <em>¿Podrías ayudarme?</em> · <em>Yo que tú, cogería el metro.</em> (à ta place…)</p>`,
  ex: [
    ['Mañana ___ calor. (hacer)', 'hará'],
    ['El año que viene ___ en Barcelona. (vivir, yo)', 'viviré'],
    ['¿___ tiempo esta tarde? (tener, tú)', 'tendrás'],
    ['Nosotros ___ el lunes. (salir)', 'saldremos'],
    ['Te lo ___ mañana. (decir, yo)', 'diré'],
    ['¿Dónde está Marta? — No sé, ___ en clase. (estar, supposition)', 'estará'],
    ['Me ___ un café con leche, por favor. (gustar, conditionnel)', 'gustaría'],
    ['¿___ ayudarme? (poder, tú, conditionnel)', 'podrías'],
    ['Yo que tú, ___ el metro. (coger, conditionnel)', 'cogería'],
    ['¿Qué ___ tú en mi lugar? (hacer, conditionnel)', 'harías'],
  ] },

{ id: 'imperativo', icon: '👆', level: 'B1', title: 'L’impératif',
  summary: 'Sigue recto, ven, dime, no te preocupes…',
  html: `
<table class="tbl"><tr><th></th><th>hablar</th><th>comer</th><th>escribir</th></tr>
<tr><td>tú</td><td><em>habla</em></td><td><em>come</em></td><td><em>escribe</em></td></tr>
<tr><td>usted</td><td><em>hable</em></td><td><em>coma</em></td><td><em>escriba</em></td></tr>
<tr><td>vosotros</td><td><em>hablad</em></td><td><em>comed</em></td><td><em>escribid</em></td></tr>
<tr><td>ustedes</td><td><em>hablen</em></td><td><em>coman</em></td><td><em>escriban</em></td></tr></table>
<ul>
<li><b>tú</b> = 3<sup>e</sup> personne du présent (<em>sigue</em>, <em>cierra</em>, <em>pide</em>). Irréguliers : <em>ten, ven, pon, sal, haz, di, ve, sé</em>.</li>
<li><b>vosotros</b> = infinitif avec <b>-d</b> au lieu de -r (<em>id</em> pour ir).</li>
<li><b>usted / ustedes</b> = subjonctif : <em>gire</em>, <em>venga</em>, <em>pasen</em>.</li>
<li><b>Négatif</b> = toujours le subjonctif : <em>no hables</em>, <em>no vengas</em>, <em>no habléis</em>.</li>
</ul>
<p>Les pronoms se collent à l'affirmatif, se placent devant au négatif : <em>Llámame</em> / <em>No me llames</em> · <em>Siéntate</em> / <em>No te sientes</em>.</p>
<h3>Très utiles à Barcelone</h3>
<p><em>Oye / Oiga</em> (dis / dites), <em>Mira / Mire</em> (regarde / regardez), <em>Perdona / Perdone</em>, <em>Sigue recto</em>, <em>Gira a la izquierda</em>, <em>Espera</em>, <em>Déjame pasar</em>, <em>No te preocupes</em>.</p>`,
  ex: [
    ['___ todo recto. (seguir, tú)', 'sigue'],
    ['___ aquí, por favor. (venir, tú)', 'ven'],
    ['___ la verdad. (decir, tú)', 'di'],
    ['___ los deberes. (hacer, tú)', 'haz'],
    ['Perdone, ___ a la derecha. (girar, usted)', 'gire'],
    ['No ___ tarde. (llegar, tú)', 'llegues'],
    ['¡___ la puerta! (cerrar, vosotros)', 'cerrad'],
    ['Traduis : Appelle-moi demain ! (tú)', 'llámame mañana'],
    ['No me ___ eso. (decir, tú)', 'digas'],
    ['___ por aquí. (pasar, ustedes)', 'pasen'],
  ] },

{ id: 'subjuntivo', icon: '🌈', level: 'B1', title: 'Le subjonctif présent (les bases)',
  summary: 'Quiero que vengas, ojalá, cuando llegues…',
  html: `
<p><b>Formation</b> : on part du « yo » au présent, on enlève le -o, et on « inverse » les voyelles : <b>-ar → -e</b>, <b>-er / -ir → -a</b>.</p>
<table class="tbl"><tr><th></th><th>hablar</th><th>comer</th><th>tener (tengo)</th></tr>
<tr><td>yo</td><td><em>hable</em></td><td><em>coma</em></td><td><em>tenga</em></td></tr>
<tr><td>tú</td><td><em>hables</em></td><td><em>comas</em></td><td><em>tengas</em></td></tr>
<tr><td>él / usted</td><td><em>hable</em></td><td><em>coma</em></td><td><em>tenga</em></td></tr>
<tr><td>nosotros</td><td><em>hablemos</em></td><td><em>comamos</em></td><td><em>tengamos</em></td></tr>
<tr><td>vosotros</td><td><em>habléis</em></td><td><em>comáis</em></td><td><em>tengáis</em></td></tr>
<tr><td>ellos</td><td><em>hablen</em></td><td><em>coman</em></td><td><em>tengan</em></td></tr></table>
<p>Irréguliers : <em>ser → sea</em>, <em>estar → esté</em>, <em>ir → vaya</em>, <em>saber → sepa</em>, <em>haber → haya</em>, <em>dar → dé</em>.</p>
<h3>Quand l'utiliser</h3>
<ul>
<li>Volonté sur quelqu'un d'autre : <em>Quiero que vengas.</em></li>
<li>Souhait : <em>Espero que te guste.</em> · <em>Ojalá haga sol.</em></li>
<li>Jugement : <em>Es importante que pidas cita.</em> · <em>Es mejor que…</em></li>
<li>But : <em>Te lo explico para que lo entiendas.</em></li>
<li>⚠️ <b>cuando + futur</b> : <em>Cuando llegues, llámame.</em> (en français : « quand tu arriveras »)</li>
<li>Vœux : <em>¡Que te vaya bien!</em> · <em>¡Que lo pases bien!</em> · <em>¡Que te mejores!</em></li>
</ul>
<p><em>Creo que está en casa</em> (indicatif) mais <em>No creo que esté en casa</em> (subjonctif).</p>`,
  ex: [
    ['Quiero que ___ a la fiesta. (venir, tú)', 'vengas'],
    ['Espero que ___ buen tiempo. (hacer)', 'haga'],
    ['Ojalá ___ un piso pronto. (encontrar, yo)', 'encuentre'],
    ['Cuando ___ a Barcelona, llámame. (llegar, tú)', 'llegues'],
    ['Es importante que ___ cita previa. (pedir, tú)', 'pidas'],
    ['¡Que lo ___ bien! (pasar, tú)', 'pases'],
    ['No creo que ___ abierto hoy. (estar)', 'esté'],
    ['Te llamo para que me ___. (ayudar, tú)', 'ayudes'],
    ['Creo que Marta ___ en casa.', ['está', 'esté'], 0],
    ['Mis padres quieren que ___ más. (estudiar, yo)', 'estudie'],
    ['¡Que te ___ bien! (ir)', 'vaya'],
  ] },

];

const GRAMMAR_BY_ID = new Map(GRAMMAR.map(g => [g.id, g]));
