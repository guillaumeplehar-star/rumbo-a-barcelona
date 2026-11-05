'use strict';
/* ===== Dialogues de situations réelles à Barcelone =====
   Lignes : « A ou B | espagnol | français ». Vocabulaire : « espagnol | français ».
   Quiz : [question, [options], index de la bonne réponse] */

function D(id, icon, title, level, roles, context, rawLines, rawVocab, quiz) {
  const parse = raw => raw.trim().split('\n').map(l => l.trim()).filter(Boolean).map(l => l.split('|').map(s => s.trim()));
  return {
    id, icon, title, level, roles, context,
    lines: parse(rawLines).map(([s, es, fr]) => ({ s, es, fr })),
    vocab: parse(rawVocab),
    quiz,
  };
}

const DIALOGUES = [

D('bar', '🍻', 'Au bar à tapas', 'A1', { A: 'Camarero', B: 'Tú' },
  'Tu entres dans un petit bar du quartier de Gràcia pour boire un verre et grignoter quelques tapas.', `
A|¡Buenas! ¿Qué te pongo?|Salut ! Qu'est-ce que je te sers ?
B|Hola, una caña, por favor.|Bonjour, un demi, s'il te plaît.
A|¿Algo para picar?|Quelque chose à grignoter ?
B|Sí, ¿qué me recomiendas?|Oui, qu'est-ce que tu me conseilles ?
A|Las bravas y las croquetas de jamón están muy buenas.|Les bravas et les croquettes au jambon sont très bonnes.
B|Vale, pues unas bravas y una ración de croquetas.|D'accord, alors des bravas et une portion de croquettes.
A|¿Quieres pan con tomate también?|Tu veux aussi du pain à la tomate ?
B|Sí, perfecto. ¿Tenéis algo vegetariano?|Oui, parfait. Vous avez quelque chose de végétarien ?
A|Sí, tenemos pimientos de Padrón y tortilla de patatas.|Oui, on a des poivrons de Padrón et de l'omelette aux pommes de terre.
B|Genial, unos pimientos también.|Génial, des poivrons aussi.
B|Perdona, ¿me cobras?|Excuse-moi, je peux payer ?
A|Claro. Son dieciocho euros con cincuenta.|Bien sûr. Ça fait dix-huit euros cinquante.
B|¿Puedo pagar con tarjeta?|Je peux payer par carte ?
A|Sí, sin problema. ¡Gracias, que vaya bien!|Oui, sans problème. Merci, bonne continuation !
`, `
¿qué te pongo?|qu'est-ce que je te sers ?
algo para picar|quelque chose à grignoter
una ración|une portion (à partager)
¿me cobras?|je peux payer ? (tu m'encaisses ?)
¡que vaya bien!|bonne continuation !
`, [
  ["Qu'est-ce que la personne boit ?", ['Una caña', 'Un vino', 'Un café'], 0],
  ['Comment demande-t-on à payer ?', ['¿Me cobras?', '¿Me pones?', '¿Me recomiendas?'], 0],
  ['Combien coûte le tout ?', ['18,50 €', '15,80 €', '8,50 €'], 0],
]),

D('mercado', '🍅', 'Au marché', 'A1', { A: 'Vendedor', B: 'Tú' },
  'Samedi matin au marché de Santa Caterina : tu fais tes courses de fruits et légumes.', `
A|¡Buenos días! ¿Quién va ahora?|Bonjour ! C'est à qui ?
B|Yo. ¿Me pone un kilo de tomates?|Moi. Vous me mettez un kilo de tomates ?
A|¿Para ensalada o para pan con tomate?|Pour une salade ou pour du pain à la tomate ?
B|Para pan con tomate.|Pour du pain à la tomate.
A|Entonces estos son los mejores. ¿Algo más?|Alors ceux-ci sont les meilleurs. Autre chose ?
B|Sí, medio kilo de fresas. ¿Son de aquí?|Oui, un demi-kilo de fraises. Elles sont d'ici ?
A|Sí, son del Maresme, muy dulces. ¿Quieres probar una?|Oui, elles viennent du Maresme, très sucrées. Tu veux en goûter une ?
B|¡Mmm, qué ricas! Póngame también una docena de huevos.|Mmm, délicieuses ! Mettez-moi aussi une douzaine d'œufs.
A|Aquí tienes. ¿Algo más?|Voilà. Autre chose ?
B|Nada más, gracias. ¿Cuánto es?|Ce sera tout, merci. C'est combien ?
A|Son nueve euros con ochenta.|Ça fait neuf euros quatre-vingts.
B|Tome, diez euros.|Tenez, dix euros.
A|Veinte céntimos de cambio. ¡Gracias, hasta la próxima!|Vingt centimes de monnaie. Merci, à la prochaine !
`, `
¿quién va ahora?|c'est à qui ?
¿me pone...?|vous me mettez... ?
probar|goûter / essayer
nada más|rien d'autre
el cambio|la monnaie
`, [
  ['Quelle quantité de tomates ?', ['1 kilo', '1/2 kilo', 'une douzaine'], 0],
  ['Combien le vendeur rend-il ?', ['20 centimes', '80 centimes', '2 euros'], 0],
]),

D('metro', '🚇', 'Dans le métro', 'A1', { A: 'Tú', B: 'Señora' },
  'Tu es à la gare de Sants et tu veux aller à la Sagrada Família. Tu demandes de l’aide à une dame.', `
A|Perdone, ¿dónde puedo comprar un billete?|Excusez-moi, où puis-je acheter un ticket ?
B|En las máquinas, allí al lado de la entrada.|Aux distributeurs, là-bas à côté de l'entrée.
A|¿Qué billete me recomienda? Voy a usar mucho el metro.|Quel ticket me conseillez-vous ? Je vais beaucoup utiliser le métro.
B|La T-casual: son diez viajes y sale más barato.|La T-casual : ce sont dix trajets et ça revient moins cher.
A|Gracias. Y para ir a la Sagrada Família, ¿qué línea cojo?|Merci. Et pour aller à la Sagrada Família, quelle ligne je prends ?
B|Coge la línea azul, la L5, dirección Vall d'Hebron.|Prends la ligne bleue, la L5, direction Vall d'Hebron.
A|¿Tengo que hacer transbordo?|Je dois changer ?
B|No, es directo. Son cinco paradas.|Non, c'est direct. C'est à cinq arrêts.
A|¡Muchas gracias! ¿Y cuánto se tarda?|Merci beaucoup ! Et ça prend combien de temps ?
B|Unos quince minutos. ¡Y cuidado con la cartera, eh! Hay muchos carteristas.|Environ quinze minutes. Et attention à ton portefeuille, hein ! Il y a beaucoup de pickpockets.
A|Vale, gracias por el consejo. ¡Adiós!|D'accord, merci du conseil. Au revoir !
`, `
hacer transbordo|changer de ligne
sale más barato|ça revient moins cher
¿cuánto se tarda?|combien de temps ça prend ?
el carterista|le pickpocket
la cartera|le portefeuille
`, [
  ['Combien de trajets contient la T-casual ?', ['10', '20', 'illimité'], 0],
  ['Faut-il changer de ligne ?', ['Non, c’est direct', 'Oui, à Diagonal', 'Oui, deux fois'], 0],
  ['De quoi la dame dit-elle de se méfier ?', ['Des pickpockets', 'Des retards', 'Des contrôleurs'], 0],
]),

D('intercambio', '🗣️', 'Échange linguistique', 'A2', { A: 'Pau', B: 'Tú' },
  'Premier soir à un « intercambio » dans un bar du Born : des Barcelonais apprennent le français, toi l’espagnol.', `
A|¡Hola! ¿Es tu primera vez en el intercambio?|Salut ! C'est ta première fois à l'échange linguistique ?
B|Sí, es la primera vez. Soy de Francia y acabo de llegar.|Oui, c'est la première fois. Je viens de France et je viens d'arriver.
A|¡Qué bien! Yo me llamo Pau, soy de aquí, de Barcelona.|Super ! Moi je m'appelle Pau, je suis d'ici, de Barcelone.
B|¿Pau? ¿Es un nombre catalán?|Pau ? C'est un prénom catalan ?
A|Sí, es Pablo en catalán. ¿Cuánto tiempo vas a estar aquí?|Oui, c'est Pablo en catalan. Combien de temps vas-tu rester ici ?
B|Seis meses, hasta junio. Hago unas prácticas en una empresa.|Six mois, jusqu'en juin. Je fais un stage dans une entreprise.
A|¡Qué guay! ¿Y qué tal tu español?|Trop bien ! Et ton espagnol, ça va ?
B|Bueno, lo entiendo bastante, pero me cuesta hablar.|Bon, je le comprends assez bien, mais j'ai du mal à parler.
A|¡Pues hablas muy bien! Yo estoy aprendiendo francés, pero es dificilísimo.|Eh bien tu parles très bien ! Moi j'apprends le français, mais c'est super difficile.
B|Si quieres, podemos quedar cada semana: una hora en español y una en francés.|Si tu veux, on peut se voir chaque semaine : une heure en espagnol et une en français.
A|¡Me parece genial! ¿Te van bien los jueves por la tarde?|Ça me paraît génial ! Le jeudi après-midi, ça te va ?
B|Perfecto. ¿Me das tu número?|Parfait. Tu me donnes ton numéro ?
A|Claro, apunta. Te mando un WhatsApp y así tienes el mío.|Bien sûr, note. Je t'envoie un WhatsApp comme ça tu as le mien.
`, `
acabo de llegar|je viens d'arriver
me cuesta hablar|j'ai du mal à parler
quedar|se voir, se donner rendez-vous
¿te va bien?|ça te va ?
apunta|note (impératif)
`, [
  ['D’où vient Pau ?', ['De Barcelone', 'De Madrid', 'De France'], 0],
  ['Quand vont-ils se voir ?', ['Le jeudi après-midi', 'Le lundi matin', 'Le week-end'], 0],
  ['« Me cuesta hablar » veut dire…', ['J’ai du mal à parler', 'Ça me coûte cher', 'Je parle beaucoup'], 0],
]),

D('piso', '🏠', 'Visiter une colocation', 'A2', { A: 'Laura', B: 'Tú' },
  'Tu as trouvé une annonce sur internet. Laura, qui habite déjà l’appartement, te fait visiter la chambre.', `
A|¡Hola! ¿Vienes a ver la habitación?|Salut ! Tu viens voir la chambre ?
B|Sí, hablamos ayer por WhatsApp.|Oui, on a parlé hier sur WhatsApp.
A|Pasa, pasa. Mira, esta es la cocina y aquí está el salón.|Entre, entre. Regarde, voici la cuisine et ici c'est le salon.
B|¡Qué luminoso! ¿Cuántas personas vivís aquí?|Comme c'est lumineux ! Vous êtes combien à vivre ici ?
A|Ahora somos dos: Marc, que es de aquí, y yo.|Pour l'instant on est deux : Marc, qui est d'ici, et moi.
B|¿Y la habitación?|Et la chambre ?
A|Es esta. Es exterior y tiene un armario muy grande.|C'est celle-ci. Elle donne sur la rue et elle a une très grande armoire.
B|Me gusta mucho. ¿Cuánto es el alquiler?|Elle me plaît beaucoup. C'est combien le loyer ?
A|Son cuatrocientos cincuenta euros al mes, gastos incluidos.|C'est quatre cent cinquante euros par mois, charges comprises.
B|¿Hay que pagar fianza?|Il faut payer une caution ?
A|Sí, un mes de fianza. Y el contrato es hasta junio.|Oui, un mois de caution. Et le contrat va jusqu'en juin.
B|¡Perfecto! Me quedo en Barcelona hasta junio.|Parfait ! Je reste à Barcelone jusqu'en juin.
A|¡Genial! ¿Cuándo podrías entrar?|Génial ! Quand pourrais-tu emménager ?
B|A principios de enero. ¿Te va bien?|Début janvier. Ça te va ?
A|Sí. Lo hablo con Marc y te digo algo mañana.|Oui. J'en parle à Marc et je te dis quelque chose demain.
`, `
exterior|côté rue
el alquiler|le loyer
gastos incluidos|charges comprises
la fianza|la caution
a principios de enero|début janvier
`, [
  ['Combien coûte le loyer ?', ['450 €, charges comprises', '450 € sans les charges', '540 €'], 0],
  ['Jusqu’à quand va le contrat ?', ['Juin', 'Janvier', 'Décembre'], 0],
  ['Combien de personnes vivent déjà là ?', ['Deux', 'Trois', 'Une'], 0],
]),

D('quedar', '📱', 'Organiser une sortie', 'A2', { A: 'Marta', B: 'Tú' },
  'Marta, une collègue, t’écrit sur WhatsApp pour le week-end.', `
A|¡Hola! ¿Qué haces este sábado?|Salut ! Tu fais quoi ce samedi ?
B|Nada especial, ¿por?|Rien de spécial, pourquoi ?
A|Vamos a hacer un pícnic en la playa de la Barceloneta. ¿Te apuntas?|On va faire un pique-nique sur la plage de la Barceloneta. Tu viens avec nous ?
B|¡Claro que me apunto! ¿A qué hora quedamos?|Bien sûr que je viens ! On se retrouve à quelle heure ?
A|A las doce en la salida del metro Barceloneta.|À midi à la sortie du métro Barceloneta.
B|Perfecto. ¿Llevo algo?|Parfait. J'apporte quelque chose ?
A|Si quieres, trae algo de beber. Nosotros llevamos la comida.|Si tu veux, apporte quelque chose à boire. Nous, on apporte à manger.
B|Vale, llevo unos refrescos y agua. ¿Viene mucha gente?|D'accord, j'apporte des sodas et de l'eau. Il vient beaucoup de monde ?
A|Unos ocho, gente del curro y algunos amigos. Son muy majos.|Environ huit, des gens du boulot et quelques amis. Ils sont très sympas.
B|¡Genial! Me hace mucha ilusión.|Génial ! J'ai trop hâte.
A|Y después, si queréis, vamos a tomar algo al Born.|Et après, si vous voulez, on va boire un verre dans le Born.
B|¡Me parece un planazo! Nos vemos el sábado.|Ça me paraît un super plan ! On se voit samedi.
A|¡Hasta el sábado! Si llegas tarde, mándame un mensaje.|À samedi ! Si tu arrives en retard, envoie-moi un message.
`, `
¿te apuntas?|tu viens avec nous ?
¿a qué hora quedamos?|on se retrouve à quelle heure ?
¿llevo algo?|j'apporte quelque chose ?
el curro|le boulot (familier)
me hace ilusión|j'ai hâte, ça me fait plaisir
un planazo|un super plan
`, [
  ['Où se retrouvent-ils ?', ['À la sortie du métro Barceloneta', 'Sur la plage', 'Dans le Born'], 0],
  ['« ¿Te apuntas? » veut dire…', ['Tu viens avec nous ?', 'Tu prends des notes ?', 'Tu as faim ?'], 0],
  ['Que doit apporter la personne ?', ['Quelque chose à boire', 'À manger', 'Rien'], 0],
]),

D('tienda', '👕', 'Les soldes', 'A2', { A: 'Dependienta', B: 'Tú' },
  'En janvier, il fait plus frais que prévu. Tu profites des « rebajas » pour acheter un manteau.', `
A|Hola, ¿te puedo ayudar en algo?|Bonjour, je peux t'aider ?
B|Sí, estoy buscando un abrigo. En enero hace más frío de lo que pensaba.|Oui, je cherche un manteau. En janvier il fait plus froid que je ne pensais.
A|¡Pues estás de suerte! Están todos rebajados un treinta por ciento.|Eh bien tu as de la chance ! Ils sont tous soldés à trente pour cent.
B|¡Qué bien! Me gusta este azul. ¿Lo tenéis en la talla M?|Super ! J'aime bien ce bleu. Vous l'avez en taille M ?
A|Déjame mirar... Sí, aquí tienes. Los probadores están al fondo.|Laisse-moi regarder… Oui, voilà. Les cabines d'essayage sont au fond.
A|¿Qué tal te queda?|Comment il te va ?
B|Me queda un poco grande. ¿Tienes una talla menos?|Il est un peu grand pour moi. Tu as une taille en dessous ?
A|Sí, la S. Toma.|Oui, le S. Tiens.
B|Este me queda perfecto. Me lo llevo.|Celui-ci me va parfaitement. Je le prends.
A|¡Genial! Son cincuenta y seis euros. ¿Efectivo o tarjeta?|Génial ! Ça fait cinquante-six euros. Espèces ou carte ?
B|Con tarjeta. Si no me convence, ¿lo puedo devolver?|Par carte. S'il ne me convainc pas, je peux le rendre ?
A|Sí, tienes treinta días con el ticket.|Oui, tu as trente jours avec le ticket.
`, `
rebajado / rebajada|soldé(e)
la talla|la taille
el probador|la cabine d'essayage
me queda grande|c'est trop grand pour moi
me lo llevo|je le prends
devolver|rendre, se faire rembourser
`, [
  ['Quelle est la réduction ?', ['30 %', '50 %', '20 %'], 0],
  ['Quelle taille la personne prend-elle finalement ?', ['S', 'M', 'L'], 0],
  ['Combien de temps pour rendre l’article ?', ['30 jours', '15 jours', 'Impossible'], 0],
]),

D('farmacia', '💊', 'À la pharmacie', 'A2', { A: 'Farmacéutica', B: 'Tú' },
  'Tu as attrapé un rhume. Tu passes à la pharmacie (la croix verte) en bas de chez toi.', `
A|Hola, buenas tardes. ¿Qué necesitas?|Bonjour. De quoi as-tu besoin ?
B|Hola. Creo que tengo un resfriado: me duele la garganta y tengo tos.|Bonjour. Je crois que j'ai un rhume : j'ai mal à la gorge et je tousse.
A|¿Tienes fiebre?|Tu as de la fièvre ?
B|Un poco, treinta y siete y medio.|Un peu, trente-sept et demi.
A|Vale. Te puedo dar un jarabe para la tos y unas pastillas para la garganta.|D'accord. Je peux te donner un sirop pour la toux et des pastilles pour la gorge.
B|¿Necesito receta?|Il me faut une ordonnance ?
A|No, no hace falta. ¿Tienes alergia a algún medicamento?|Non, ce n'est pas nécessaire. Tu es allergique à un médicament ?
B|No, a ninguno.|Non, à aucun.
A|Pues toma el jarabe tres veces al día, después de las comidas.|Alors prends le sirop trois fois par jour, après les repas.
B|¿Y las pastillas?|Et les pastilles ?
A|Una cada cuatro horas, como máximo seis al día. Y bebe mucha agua.|Une toutes les quatre heures, six par jour maximum. Et bois beaucoup d'eau.
B|Muy bien. ¿Cuánto es?|Très bien. C'est combien ?
A|Son doce euros con veinte. ¡Que te mejores!|Ça fait douze euros vingt. Bon rétablissement !
`, `
el resfriado|le rhume
la tos|la toux
la receta|l'ordonnance
no hace falta|ce n'est pas nécessaire
cada cuatro horas|toutes les quatre heures
¡que te mejores!|bon rétablissement !
`, [
  ['Combien de fois par jour prendre le sirop ?', ['3', '4', '6'], 0],
  ['Faut-il une ordonnance ?', ['Non', 'Oui'], 0],
  ['« ¡Que te mejores! » veut dire…', ['Bon rétablissement !', 'Bonne journée !', 'À bientôt !'], 0],
]),

D('padron', '📋', 'S’inscrire à la mairie', 'B1', { A: 'Funcionaria', B: 'Tú' },
  'Tu as pris rendez-vous (« cita previa ») à l’Oficina d’Atenció Ciutadana pour l’« empadronamiento ».', `
B|Buenos días. Quería empadronarme.|Bonjour. Je voudrais m'inscrire au registre municipal.
A|Buenos días. ¿Tiene cita previa?|Bonjour. Vous avez rendez-vous ?
B|Sí, a las diez y cuarto. Aquí tiene mi pasaporte.|Oui, à dix heures et quart. Voici mon passeport.
A|Muy bien. ¿Trae el contrato de alquiler?|Très bien. Vous avez apporté le contrat de location ?
B|Sí, aquí está. Es un piso compartido.|Oui, le voici. C'est une colocation.
A|Entonces necesito también una autorización del titular del contrato y una copia de su DNI.|Alors il me faut aussi une autorisation du titulaire du contrat et une copie de sa carte d'identité.
B|Vale, lo tengo todo aquí.|D'accord, j'ai tout ici.
A|Perfecto. Rellene este formulario y firme aquí abajo.|Parfait. Remplissez ce formulaire et signez ici en bas.
B|¿Tengo que poner mi número de teléfono?|Je dois mettre mon numéro de téléphone ?
A|Sí, y su dirección completa con el código postal.|Oui, et votre adresse complète avec le code postal.
B|Ya está. ¿Cuándo tendré el certificado?|Voilà. Quand aurai-je le certificat ?
A|Se lo doy ahora mismo.|Je vous le donne tout de suite.
B|¡Qué rápido! Muchas gracias.|C'est rapide ! Merci beaucoup.
A|De nada. Que tenga un buen día.|De rien. Bonne journée.
`, `
empadronarse|s'inscrire au registre municipal
la cita previa|le rendez-vous
el titular del contrato|le titulaire du contrat
rellenar|remplir
firmar|signer
ahora mismo|tout de suite
`, [
  ['Que doit fournir le colocataire titulaire du contrat ?', ['Une autorisation et une copie de sa carte d’identité', 'Son passeport original', 'Rien du tout'], 0],
  ['Quand reçoit-on le certificat ?', ['Tout de suite', 'Dans un mois', 'Par courrier'], 0],
  ['La personne vouvoie la fonctionnaire. Quel mot le montre ?', ['Aquí tiene', 'Aquí tienes'], 0],
]),

D('banco', '🏦', 'Ouvrir un compte en banque', 'B1', { A: 'Empleado', B: 'Tú' },
  'Pour recevoir ton salaire et payer ton loyer, tu ouvres un compte dans une agence bancaire.', `
B|Buenos días. Me gustaría abrir una cuenta bancaria.|Bonjour. J'aimerais ouvrir un compte bancaire.
A|Por supuesto. ¿Es usted residente en España?|Bien sûr. Vous êtes résident en Espagne ?
B|Sí, vivo en Barcelona desde enero. Ya tengo el NIE.|Oui, je vis à Barcelone depuis janvier. J'ai déjà le NIE.
A|Perfecto. Necesito su pasaporte, el NIE y un justificante de domicilio.|Parfait. Il me faut votre passeport, le NIE et un justificatif de domicile.
B|Aquí tiene. ¿La cuenta tiene comisiones?|Voici. Le compte a des frais ?
A|Si domicilia su nómina, no tiene ninguna comisión.|Si vous faites verser votre salaire ici, il n'y a aucuns frais.
B|¿Y si no tengo nómina?|Et si je n'ai pas de salaire ?
A|Tenemos una cuenta para menores de treinta años, también sin comisiones.|Nous avons un compte pour les moins de trente ans, aussi sans frais.
B|Muy bien. ¿Me dan una tarjeta de débito?|Très bien. Vous me donnez une carte de débit ?
A|Sí, la recibirá en su domicilio en una semana. ¿Quiere descargar también nuestra app?|Oui, vous la recevrez chez vous dans une semaine. Voulez-vous aussi télécharger notre application ?
B|Sí, claro. ¿Dónde tengo que firmar?|Oui, bien sûr. Où dois-je signer ?
A|Aquí y aquí. ¡Listo! Su cuenta ya está abierta.|Ici et ici. C'est fait ! Votre compte est ouvert.
`, `
las comisiones|les frais bancaires
domiciliar la nómina|faire verser son salaire
el justificante de domicilio|le justificatif de domicile
la tarjeta de débito|la carte de débit
¡listo!|c'est fait ! / prêt !
`, [
  ['Quand recevra-t-on la carte ?', ['Dans une semaine', 'Tout de suite', 'Dans un mois'], 0],
  ['« Domiciliar la nómina » veut dire…', ['Faire verser son salaire sur le compte', 'Changer d’adresse', 'Payer son loyer'], 0],
]),

D('averia', '🔧', 'Une panne dans l’appartement', 'B1', { A: 'Jordi (casero)', B: 'Tú' },
  'Plus d’eau chaude depuis hier ! Tu appelles Jordi, le propriétaire.', `
A|¿Sí? ¿Dígame?|Allô ?
B|Hola, Jordi. Te llamo del piso de la calle Verdi.|Bonjour Jordi. Je t'appelle de l'appartement de la rue Verdi.
A|Ah, hola. ¿Qué tal? ¿Pasa algo?|Ah, bonjour. Ça va ? Il y a un problème ?
B|Pues sí, desde ayer no hay agua caliente. Creo que el calentador está roto.|Eh bien oui, depuis hier il n'y a pas d'eau chaude. Je crois que le chauffe-eau est cassé.
A|Vaya, lo siento. ¿Has mirado si está encendido?|Mince, désolé. Tu as regardé s'il est allumé ?
B|Sí, está encendido, pero sale una luz roja.|Oui, il est allumé, mais il y a une lumière rouge.
A|Vale. Voy a llamar al técnico. ¿Cuándo estás en casa?|D'accord. Je vais appeler le technicien. Quand es-tu à la maison ?
B|Mañana por la mañana estoy, hasta las doce.|Demain matin je suis là, jusqu'à midi.
A|Perfecto, le digo que vaya mañana sobre las diez.|Parfait, je lui dis de passer demain vers dix heures.
B|Muchas gracias. Y otra cosa: la ventana del baño no cierra bien.|Merci beaucoup. Et autre chose : la fenêtre de la salle de bain ferme mal.
A|Vale, se lo comento también al técnico.|D'accord, j'en parle aussi au technicien.
B|Genial. ¡Gracias por todo, Jordi!|Super. Merci pour tout, Jordi !
A|Nada. Cualquier cosa, me llamas.|De rien. Au moindre souci, tu m'appelles.
`, `
¿dígame?|allô ? (en décrochant)
el calentador|le chauffe-eau
encendido / encendida|allumé(e)
el técnico|le technicien
sobre las diez|vers dix heures
cualquier cosa|au moindre souci
`, [
  ['Quel est le problème ?', ['Pas d’eau chaude', 'Pas d’électricité', 'Pas de wifi'], 0],
  ['Quand vient le technicien ?', ['Demain vers 10 h', 'Aujourd’hui à midi', 'La semaine prochaine'], 0],
  ['« Le digo que vaya » utilise…', ['le subjonctif', 'le futur', 'l’imparfait'], 0],
]),

D('medico', '🩺', 'Chez le médecin (CAP)', 'B1', { A: 'Médica', B: 'Tú' },
  'Depuis quelques jours tu as mal au ventre. Tu as rendez-vous au CAP, le centre de santé du quartier.', `
A|Buenos días, siéntese. ¿Qué le pasa?|Bonjour, asseyez-vous. Qu'est-ce qui vous arrive ?
B|Buenos días. Desde hace tres días me duele mucho el estómago.|Bonjour. Depuis trois jours, j'ai très mal à l'estomac.
A|¿Tiene fiebre o vómitos?|Vous avez de la fièvre ou des vomissements ?
B|Fiebre no, pero tengo náuseas por las mañanas.|Pas de fièvre, mais j'ai des nausées le matin.
A|¿Ha comido algo diferente estos días?|Avez-vous mangé quelque chose d'inhabituel ces jours-ci ?
B|El sábado comí marisco en un restaurante.|Samedi, j'ai mangé des fruits de mer au restaurant.
A|Vale. Túmbese aquí, voy a explorarle. ¿Le duele aquí?|D'accord. Allongez-vous ici, je vais vous examiner. Ça vous fait mal ici ?
B|Sí, un poco.|Oui, un peu.
A|Parece una gastroenteritis, nada grave. Le voy a recetar algo para el dolor.|On dirait une gastro-entérite, rien de grave. Je vais vous prescrire quelque chose contre la douleur.
B|¿Tengo que hacer dieta?|Je dois faire un régime ?
A|Sí: arroz blanco, pollo a la plancha y mucha agua. Nada de alcohol ni de café.|Oui : riz blanc, poulet grillé et beaucoup d'eau. Pas d'alcool ni de café.
B|¿Y si no mejoro?|Et si je ne vais pas mieux ?
A|Si en tres días sigue igual, vuelva y pida otra cita.|Si dans trois jours c'est pareil, revenez et prenez un autre rendez-vous.
B|Muy bien, muchas gracias, doctora.|Très bien, merci beaucoup, docteure.
`, `
¿qué le pasa?|qu'est-ce qui vous arrive ?
desde hace tres días|depuis trois jours
túmbese|allongez-vous
recetar|prescrire
a la plancha|grillé (sur plaque)
mejorar|aller mieux
`, [
  ['Depuis quand la personne a-t-elle mal ?', ['3 jours', '1 semaine', 'Hier'], 0],
  ['Que doit-elle éviter ?', ['L’alcool et le café', 'Le riz et le poulet', 'L’eau'], 0],
  ['Que doit-elle faire si ça ne va pas mieux ?', ['Revenir dans 3 jours', 'Aller aux urgences tout de suite', 'Rien'], 0],
]),

];
