'use strict';
/* ===== Vocabulaire par thèmes =====
   Une ligne = « espagnol | français | exemple (facultatif) | traduction de l'exemple »
   « a / b » côté espagnol = deux réponses acceptées ; « (x) » = partie facultative. */

function V(id, icon, title, level, raw, extra = {}) {
  const lang = extra.lang || 'es';
  const words = parseRows(raw).map(([es, fr, ex, exFr]) => ({ id: `${id}::${es}`, theme: id, es, fr, ex, exFr, lang }));
  return { id, icon, title, level, words, ...extra };
}

const VOCAB = [

V('bases', '👋', 'Salutations & politesse', 'A1', `
hola|salut / bonjour
buenos días|bonjour (le matin)|Buenos días, ¿qué tal?|Bonjour, ça va ?
buenas tardes|bonjour / bonsoir (l'après-midi)
buenas noches|bonsoir / bonne nuit
buenas|salut (familier, à toute heure)
adiós|au revoir
hasta luego|à plus tard / au revoir
hasta mañana|à demain
nos vemos|on se voit / à plus
por favor|s'il te plaît / s'il vous plaît
gracias|merci
muchas gracias|merci beaucoup
de nada|de rien
perdón|pardon
perdona|excuse-moi (pour interpeller)|Perdona, ¿dónde está el metro?|Excuse-moi, où est le métro ?
lo siento|je suis désolé(e)
sí|oui
no|non
vale|d'accord / OK|Vale, nos vemos a las ocho.|D'accord, on se voit à huit heures.
¿qué tal?|comment ça va ?
bien, ¿y tú?|bien, et toi ?
muy bien|très bien
regular|bof / comme ci comme ça
encantado / encantada|enchanté(e)
mucho gusto|enchanté (plus formel)
bienvenido / bienvenida|bienvenue
¿cómo te llamas?|comment tu t'appelles ?
me llamo...|je m'appelle...
no entiendo|je ne comprends pas
¿puedes repetir, por favor?|tu peux répéter, s'il te plaît ?
más despacio, por favor|plus lentement, s'il te plaît
¿cómo se dice ... en español?|comment dit-on ... en espagnol ?
¿hablas francés?|tu parles français ?
un momento|un instant
claro|bien sûr
¡que aproveche!|bon appétit !
¡salud!|santé ! / à tes souhaits !
`),

V('presentarse', '🙋', 'Se présenter', 'A1', `
el nombre|le prénom / le nom
el apellido|le nom de famille
¿de dónde eres?|d'où es-tu ?
soy de Francia|je viens de France
soy francés / soy francesa|je suis français(e)
vivo en Barcelona|j'habite à Barcelone
¿cuántos años tienes?|quel âge as-tu ?
tengo veinticinco años|j'ai vingt-cinco ans
¿a qué te dedicas?|qu'est-ce que tu fais dans la vie ?
soy estudiante|je suis étudiant(e)
trabajo en...|je travaille à / chez...
estudio...|j'étudie...
el idioma|la langue
hablo un poco de español|je parle un peu espagnol
estoy aprendiendo español|j'apprends l'espagnol|Estoy aprendiendo español para vivir en Barcelona.|J'apprends l'espagnol pour vivre à Barcelone.
el país|le pays
la ciudad|la ville
la nacionalidad|la nationalité
francés / francesa|français(e)
español / española|espagnol(e)
catalán / catalana|catalan(e)
inglés / inglesa|anglais(e)
alemán / alemana|allemand(e)
italiano / italiana|italien(ne)
voy a vivir aquí seis meses|je vais vivre ici six mois
llegué en enero|je suis arrivé(e) en janvier
el cumpleaños|l'anniversaire
estoy soltero / estoy soltera|je suis célibataire
tengo novio / tengo novia|j'ai un copain / une copine
mi número de teléfono es...|mon numéro de téléphone est...
el correo electrónico|l'e-mail
¿me das tu número?|tu me donnes ton numéro ?
¿tienes Instagram?|tu as Instagram ?
`),

V('numeros', '🔢', 'Nombres, prix & heure', 'A1', `
cero|zéro
uno|un
dos|deux
tres|trois
cuatro|quatre
cinco|cinq
seis|six
siete|sept
ocho|huit
nueve|neuf
diez|dix
once|onze
doce|douze
trece|treize
catorce|quatorze
quince|quinze
dieciséis|seize
veinte|vingt
veintiuno|vingt et un
treinta|trente
cuarenta|quarante
cincuenta|cinquante
sesenta|soixante
setenta|soixante-dix
ochenta|quatre-vingts
noventa|quatre-vingt-dix
cien|cent
ciento cincuenta|cent cinquante
doscientos|deux cents
quinientos|cinq cents
mil|mille
el primero / la primera|le premier / la première
la mitad|la moitié
¿cuánto cuesta?|combien ça coûte ?|¿Cuánto cuesta este café?|Combien coûte ce café ?
¿cuánto es?|c'est combien ? (au total)
son tres euros con cincuenta|ça fait trois euros cinquante
¿qué hora es?|quelle heure est-il ?
es la una|il est une heure
son las dos y media|il est deux heures et demie
son las cinco menos cuarto|il est cinq heures moins le quart
son las ocho y cuarto|il est huit heures et quart
a las nueve|à neuf heures
en punto|pile (pour l'heure)
de la mañana|du matin
de la tarde|de l'après-midi / du soir
de la noche|du soir / de la nuit
el mediodía|midi
`),

V('calendario', '📅', 'Jours, mois & moments', 'A1', `
lunes|lundi
martes|mardi
miércoles|mercredi
jueves|jeudi
viernes|vendredi
sábado|samedi
domingo|dimanche
el fin de semana|le week-end
enero|janvier
febrero|février
marzo|mars
abril|avril
mayo|mai
junio|juin
el mes|le mois
la semana|la semaine
el año|l'année
el día|le jour
hoy|aujourd'hui
mañana|demain
ayer|hier
pasado mañana|après-demain
anteayer|avant-hier
la mañana|le matin
la tarde|l'après-midi / le soir
la noche|la nuit / le soir
ahora|maintenant
luego|plus tard / ensuite
pronto|bientôt
tarde|tard
temprano|tôt
siempre|toujours
nunca|jamais
a veces|parfois
todos los días|tous les jours
la próxima semana|la semaine prochaine
el año pasado|l'année dernière
el invierno|l'hiver
la primavera|le printemps
el verano|l'été
el otoño|l'automne
¿qué día es hoy?|quel jour sommes-nous ?
`),

V('gente', '👨‍👩‍👧', 'Les gens & la famille', 'A1', `
la familia|la famille
los padres|les parents
el padre|le père
la madre|la mère
el hermano|le frère
la hermana|la sœur
el hijo|le fils
la hija|la fille (enfant)
el abuelo|le grand-père
la abuela|la grand-mère
el tío|l'oncle (et « mec » en familier)
la tía|la tante
el primo / la prima|le cousin / la cousine
el marido|le mari
la mujer|la femme
el hombre|l'homme
el chico / la chica|le garçon / la fille (jeune)
el niño / la niña|l'enfant (garçon / fille)
el bebé|le bébé
el amigo / la amiga|l'ami(e)
el novio / la novia|le copain / la copine
el vecino / la vecina|le voisin / la voisine
la gente|les gens
alto / alta|grand(e)
bajo / baja|petit(e) (taille)
joven|jeune
mayor|âgé(e) / plus âgé(e)
guapo / guapa|beau / belle
simpático / simpática|sympathique
majo / maja|sympa (Espagne)
moreno / morena|brun(e) / bronzé(e)
rubio / rubia|blond(e)
pelirrojo / pelirroja|roux / rousse
tiene el pelo largo|il / elle a les cheveux longs
lleva gafas|il / elle porte des lunettes
`),

V('ciudad', '🏙️', 'En ville & directions', 'A1', `
la calle|la rue
la plaza|la place
la avenida|l'avenue
el barrio|le quartier|Vivo en el barrio de Gràcia.|J'habite dans le quartier de Gràcia.
el centro|le centre
el ayuntamiento|la mairie
la playa|la plage
el puerto|le port
el parque|le parc
la iglesia|l'église
el museo|le musée
el mercado|le marché
el supermercado|le supermarché
la farmacia|la pharmacie
el banco|la banque / le banc
el cajero (automático)|le distributeur de billets
la biblioteca|la bibliothèque
el edificio|l'immeuble / le bâtiment
la esquina|le coin (de rue)
el semáforo|le feu (de circulation)
el paso de cebra|le passage piéton
¿dónde está...?|où est... ?
¿está lejos?|c'est loin ?
está cerca|c'est près
a la derecha|à droite
a la izquierda|à gauche
todo recto|tout droit|Sigue todo recto y gira a la derecha.|Continue tout droit et tourne à droite.
gira / gire|tourne / tournez
cruza / cruce|traverse / traversez
al lado de|à côté de
enfrente de|en face de
detrás de|derrière
delante de|devant
al final de la calle|au bout de la rue
la primera calle a la izquierda|la première rue à gauche
a cinco minutos andando|à cinq minutes à pied
perdido / perdida|perdu(e)
`),

V('transporte', '🚇', 'Transports', 'A1', `
el metro|le métro
la parada|l'arrêt
la estación|la gare / la station
el andén|le quai
la línea|la ligne|Coge la línea verde hasta Diagonal.|Prends la ligne verte jusqu'à Diagonal.
el autobús / el bus|le bus
el tren|le train
el tranvía|le tramway
el taxi|le taxi
el aeropuerto|l'aéroport
el billete|le billet / le ticket
la tarjeta de transporte|la carte de transport
la T-casual|le titre de 10 trajets (Barcelone)
la T-usual|l'abonnement mensuel (Barcelone)
el abono|l'abonnement
la bici / la bicicleta|le vélo
el patinete|la trottinette
el coche|la voiture
coger el metro|prendre le métro
bajar(se) del tren|descendre du train
subir(se) al autobús|monter dans le bus
hacer transbordo|faire une correspondance
la salida|la sortie
la entrada|l'entrée
el horario|les horaires
el retraso|le retard
llegar tarde|arriver en retard
ir andando / ir a pie|aller à pied
la próxima parada|le prochain arrêt
¿qué línea va a...?|quelle ligne va à... ?
ida y vuelta|aller-retour
solo ida|aller simple
el vuelo|le vol
la maleta|la valise
el carril bici|la piste cyclable
`),

V('piso', '🏠', 'Logement & colocation', 'A2', `
el piso|l'appartement|Busco un piso cerca de la playa.|Je cherche un appartement près de la plage.
compartir piso|être en colocation
la habitación|la chambre
el alquiler|le loyer / la location
alquilar|louer
el casero / la casera|le / la propriétaire (bailleur)
el compañero de piso / la compañera de piso|le / la colocataire
el contrato|le contrat
la fianza|la caution (dépôt de garantie)
los gastos incluidos|charges comprises
las facturas|les factures
la luz|l'électricité / la lumière
el agua caliente|l'eau chaude
la calefacción|le chauffage
el aire acondicionado|la climatisation
amueblado / amueblada|meublé(e)
exterior|côté rue (avec fenêtre sur la rue)
interior|côté cour
luminoso / luminosa|lumineux / lumineuse
el ascensor|l'ascenseur
la planta|l'étage
el ático|le dernier étage
el balcón|le balcon
la terraza|la terrasse
la llave|la clé
mudarse|déménager
la mudanza|le déménagement
la inmobiliaria|l'agence immobilière
el anuncio|l'annonce
¿está disponible?|il / elle est disponible ?
¿cuánto es al mes?|c'est combien par mois ?
¿se puede visitar?|on peut visiter ?
la comunidad|les charges de copropriété
el portero / el conserje|le gardien / le concierge
el ruido|le bruit
la humedad|l'humidité
el vecino de arriba|le voisin du dessus
está roto / está rota|c'est cassé
`),

V('casa', '🛋️', 'Dans la maison', 'A1', `
la cocina|la cuisine
el baño|la salle de bain / les toilettes
el salón|le salon
el dormitorio|la chambre (à coucher)
la cama|le lit
la mesa|la table
la silla|la chaise
el sofá|le canapé
el armario|l'armoire / le placard
la puerta|la porte
la ventana|la fenêtre
la pared|le mur
el suelo|le sol
el techo|le plafond
la nevera|le frigo
el horno|le four
el microondas|le micro-ondes
la lavadora|la machine à laver
el lavavajillas|le lave-vaisselle
la ducha|la douche
el váter|les toilettes (la cuvette)
el espejo|le miroir
la toalla|la serviette (de bain)
la sábana|le drap
la almohada|l'oreiller
el enchufe|la prise électrique
la bombilla|l'ampoule
la basura|la poubelle / les ordures
reciclar|recycler
limpiar|nettoyer
fregar los platos|faire la vaisselle
poner la lavadora|lancer une machine
tender la ropa|étendre le linge
la sartén|la poêle
la olla|la marmite / la casserole
el vaso|le verre
la taza|la tasse
el plato|l'assiette / le plat
el tenedor|la fourchette
el cuchillo|le couteau
la cuchara|la cuillère
`),

V('comida', '🛒', 'Nourriture & courses', 'A1', `
la comida|la nourriture / le déjeuner
el desayuno|le petit-déjeuner
la cena|le dîner
desayunar|prendre le petit-déjeuner
comer|manger / déjeuner
cenar|dîner
el pan|le pain
la barra de pan|la baguette
el agua|l'eau
la leche|le lait
el café|le café
el zumo|le jus
el vino|le vin
la cerveza|la bière
la carne|la viande
el pollo|le poulet
el cerdo|le porc
la ternera|le veau / le bœuf
el pescado|le poisson
el marisco|les fruits de mer
el jamón|le jambon
el queso|le fromage
el huevo|l'œuf
el arroz|le riz
la pasta|les pâtes
la verdura|les légumes
la fruta|les fruits
la manzana|la pomme
la naranja|l'orange
el plátano|la banane
el tomate|la tomate
la patata|la pomme de terre
la cebolla|l'oignon
el ajo|l'ail
el aceite (de oliva)|l'huile (d'olive)
la sal|le sel
el azúcar|le sucre
la mantequilla|le beurre
un kilo de|un kilo de
medio kilo|un demi-kilo
una docena|une douzaine
una bolsa|un sac
la caja|la caisse / la boîte
¿me pone...?|vous me mettez... ? (pour commander)|¿Me pone medio kilo de tomates?|Vous me mettez un demi-kilo de tomates ?
¿algo más?|autre chose ?
nada más, gracias|ce sera tout, merci
fresco / fresca|frais / fraîche
vegetariano / vegetariana|végétarien(ne)
`),

V('bar', '🍷', 'Au bar & au restaurant', 'A1', `
el camarero / la camarera|le serveur / la serveuse
la carta|la carte (le menu)
el menú del día|la formule du midi
la tapa|la tapa (petite portion)
la ración|la portion (à partager)
el pincho|la petite bouchée sur pain
una caña|un demi (bière pression)|Una caña y unas bravas, por favor.|Un demi et des patatas bravas, s'il vous plaît.
un vermut|un vermouth (l'apéro typique de Barcelone)
un café con leche|un café au lait
un cortado|un café noisette
un café solo|un expresso
una botella de agua|une bouteille d'eau
el agua del grifo|l'eau du robinet
el primer plato|l'entrée
el segundo plato|le plat principal
el postre|le dessert
la cuenta|l'addition|La cuenta, por favor.|L'addition, s'il vous plaît.
la propina|le pourboire
¿tienen mesa para dos?|vous avez une table pour deux ?
para mí...|pour moi...
quería...|je voudrais...
de primero|en entrée
de segundo|en plat
¿qué me recomienda?|que me conseillez-vous ?
estoy lleno / estoy llena|je n'ai plus faim (je suis rassasié)
¡qué rico!|c'est délicieux !
las patatas bravas|pommes de terre sauce piquante
el pan con tomate|le pain frotté à la tomate
la tortilla (de patatas)|l'omelette (aux pommes de terre)
los calamares|les calamars
las croquetas|les croquettes
para llevar|à emporter
¿se puede pagar con tarjeta?|on peut payer par carte ?
invito yo|c'est moi qui invite
pagamos a medias|on partage (l'addition)
el baño / el servicio|les toilettes
`),

V('compras', '🛍️', 'Shopping & argent', 'A2', `
la tienda|le magasin
comprar|acheter
vender|vendre
pagar|payer
el dinero|l'argent
el efectivo|les espèces|¿Puedo pagar en efectivo?|Je peux payer en espèces ?
la tarjeta|la carte (bancaire)
el cambio|la monnaie / le change
el precio|le prix
caro / cara|cher / chère
barato / barata|bon marché
las rebajas|les soldes
la oferta|la promotion
el descuento|la réduction
la talla|la taille (vêtements)
el número|la pointure / le numéro
el probador|la cabine d'essayage
probarse|essayer (un vêtement)
¿puedo probármelo?|je peux l'essayer ?
me queda bien|ça me va bien
me queda grande|c'est trop grand pour moi
la ropa|les vêtements
la camiseta|le t-shirt
los pantalones|le pantalon
la falda|la jupe
el vestido|la robe
la chaqueta|la veste
el abrigo|le manteau
los zapatos|les chaussures
las zapatillas|les baskets / les chaussons
el bolso|le sac à main
el ticket|le ticket de caisse
devolver|rendre / se faire rembourser
cambiar|échanger
solo estoy mirando|je regarde seulement
abierto|ouvert
cerrado|fermé
`),

V('trabajo', '💼', 'Études & travail', 'A2', `
el trabajo|le travail / le boulot
trabajar|travailler
la empresa|l'entreprise
la oficina|le bureau (lieu)
el jefe / la jefa|le / la chef, patron(ne)
el compañero de trabajo|le collègue
la reunión|la réunion
el sueldo|le salaire
las prácticas|le stage
el becario / la becaria|le / la stagiaire
el currículum|le CV
la entrevista|l'entretien
buscar trabajo|chercher du travail
contratar|embaucher
la universidad|l'université
la facultad|la faculté
la asignatura|la matière (cours)
la clase|le cours / la classe
el examen|l'examen
aprobar|réussir (un examen)
suspender|rater (un examen)
el profesor / la profesora|le / la professeur
el alumno / la alumna|l'élève / l'étudiant(e)
los apuntes|les notes de cours
la beca|la bourse (d'études)
el ordenador|l'ordinateur
el portátil|l'ordinateur portable
la fecha límite|la date limite
estar de vacaciones|être en vacances
teletrabajar|télétravailler
el turno|le service / le créneau horaire
estoy de Erasmus|je suis en Erasmus
¿en qué trabajas?|tu travailles dans quoi ?
`),

V('administracion', '📋', 'Démarches administratives', 'B1', `
el NIE|le numéro d'identité d'étranger (NIE)
el certificado de registro (de ciudadano de la UE)|le certificat d'enregistrement (citoyens UE)
el empadronamiento|l'inscription au registre municipal
empadronarse|s'inscrire au registre de la mairie|Tengo que empadronarme en el ayuntamiento.|Je dois m'inscrire au registre de la mairie.
el certificado de empadronamiento|le certificat de résidence
la cita previa|le rendez-vous (administratif)
pedir cita|prendre rendez-vous
el trámite|la démarche
el formulario|le formulaire
rellenar|remplir (un formulaire)
firmar|signer
la firma|la signature
el pasaporte|le passeport
el DNI|la carte d'identité (espagnole)
la fotocopia|la photocopie
la tasa|la taxe / les frais
la comisaría|le commissariat
la Seguridad Social|la Sécurité sociale
la tarjeta sanitaria europea|la carte européenne d'assurance maladie
la cuenta bancaria|le compte bancaire
abrir una cuenta|ouvrir un compte
la nómina|la fiche de paie / le salaire
la ventanilla|le guichet
hacer cola|faire la queue
el número de turno|le ticket d'attente
el plazo|le délai
caducado / caducada|expiré(e) / périmé(e)
la dirección|l'adresse
el código postal|le code postal
el justificante|le justificatif
el recibo|le reçu
¿qué documentos necesito?|de quels documents ai-je besoin ?
¿dónde tengo que firmar?|où dois-je signer ?
`),

V('salud', '🏥', 'Santé', 'A2', `
el médico / la médica|le médecin
el CAP|le centre de santé (Catalogne)
el hospital|l'hôpital
las urgencias|les urgences
la farmacia de guardia|la pharmacie de garde
la receta|l'ordonnance
el medicamento|le médicament
la pastilla|le cachet / la pastille
el jarabe|le sirop
estoy enfermo / estoy enferma|je suis malade
me duele la cabeza|j'ai mal à la tête|Me duele mucho la cabeza desde ayer.|J'ai très mal à la tête depuis hier.
me duele la garganta|j'ai mal à la gorge
me duele el estómago|j'ai mal au ventre
tengo fiebre|j'ai de la fièvre
estoy resfriado / estoy resfriada|je suis enrhumé(e)
estoy constipado / estoy constipada|je suis enrhumé(e) (faux ami !)
la tos|la toux
la gripe|la grippe
mareado / mareada|qui a la tête qui tourne / nauséeux
la alergia|l'allergie
soy alérgico a... / soy alérgica a...|je suis allergique à...
la herida|la blessure
la cabeza|la tête
la espalda|le dos
el brazo|le bras
la pierna|la jambe
la mano|la main
el pie|le pied
el ojo|l'œil
la boca|la bouche
el diente|la dent
el dentista|le dentiste
el seguro médico|l'assurance santé
¿necesito receta?|il me faut une ordonnance ?
¿cada cuántas horas?|toutes les combien d'heures ?
me encuentro mal|je ne me sens pas bien
la tirita|le pansement
`),

V('ocio', '🎉', 'Sorties & loisirs', 'A2', `
salir|sortir
quedar|se donner rendez-vous|¿Quedamos a las nueve en la plaza?|On se retrouve à neuf heures sur la place ?
¿quedamos?|on se voit ?
la fiesta|la fête
ir de fiesta|faire la fête
la discoteca|la boîte de nuit
el concierto|le concert
la entrada|le billet (spectacle)
el cine|le cinéma
la película|le film
el teatro|le théâtre
la exposición|l'exposition
ir a la playa|aller à la plage
tomar el sol|bronzer
bañarse|se baigner
hacer deporte|faire du sport
el gimnasio|la salle de sport
correr|courir
nadar|nager
la excursión|l'excursion
la montaña|la montagne
hacer senderismo|faire de la randonnée
el partido (de fútbol)|le match (de foot)
tomar algo|boire un verre|¿Vamos a tomar algo?|On va boire un verre ?
el plan|le plan / le programme
¿qué haces esta noche?|tu fais quoi ce soir ?
me apetece...|j'ai envie de...
¿te apetece venir?|ça te dit de venir ?
no puedo, tengo planes|je ne peux pas, j'ai des projets
¡qué buena idea!|quelle bonne idée !
¿te apuntas?|tu viens avec nous ? / tu en es ?
el intercambio de idiomas|l'échange linguistique
la fiesta mayor|la fête de quartier (Catalogne)
la sobremesa|le moment de discussion après le repas
`),

V('clima', '☀️', 'La météo', 'A1', `
el tiempo|le temps (météo)
¿qué tiempo hace?|quel temps fait-il ?
hace sol|il fait soleil
hace calor|il fait chaud
hace frío|il fait froid
hace viento|il y a du vent
hace buen tiempo|il fait beau
hace mal tiempo|il fait mauvais
llueve|il pleut
está lloviendo|il est en train de pleuvoir
la lluvia|la pluie
nieva|il neige
está nublado|c'est nuageux
hay mucha humedad|c'est très humide
el paraguas|le parapluie
la tormenta|l'orage
la temperatura|la température
estamos a veinte grados|il fait vingt degrés
el pronóstico|les prévisions
el bochorno|la chaleur étouffante
la ola de calor|la canicule
el cielo|le ciel
la nube|le nuage
el sol|le soleil
el mar|la mer
la crema solar|la crème solaire
`),

V('emociones', '😊', 'Sentiments & caractère', 'A2', `
contento / contenta|content(e)
feliz|heureux / heureuse
triste|triste
cansado / cansada|fatigué(e)
nervioso / nerviosa|nerveux / nerveuse
enfadado / enfadada|fâché(e) / en colère
preocupado / preocupada|inquiet / inquiète
aburrido / aburrida|qui s'ennuie / ennuyeux
estresado / estresada|stressé(e)
tranquilo / tranquila|calme / tranquille
sorprendido / sorprendida|surpris(e)
tengo miedo|j'ai peur
tengo ganas de...|j'ai envie de...|Tengo muchas ganas de ir a Barcelona.|J'ai très envie d'aller à Barcelone.
echo de menos...|... me manque|Echo de menos a mi familia.|Ma famille me manque.
me da vergüenza|j'ai honte / je suis gêné(e)
me hace ilusión|ça me fait plaisir / j'ai hâte
me encanta|j'adore
odio...|je déteste...
estar de buen humor|être de bonne humeur
estar de mal humor|être de mauvaise humeur
divertido / divertida|drôle / amusant(e)
tímido / tímida|timide
gracioso / graciosa|drôle
pesado / pesada|lourd(e) / casse-pieds
¡qué pena!|quel dommage !
¡qué bien!|super !
¡qué rollo!|quelle barbe !
me da igual|ça m'est égal
`),

V('verbos', '⚡', 'Verbes essentiels', 'A1', `
ser|être (identité, caractéristique)
estar|être (état, lieu)
tener|avoir
haber (hay)|avoir (il y a)
hacer|faire
ir|aller
venir|venir
poder|pouvoir
querer|vouloir / aimer (quelqu'un)
saber|savoir
conocer|connaître
decir|dire
hablar|parler
ver|voir
mirar|regarder
escuchar|écouter
oír|entendre
dar|donner
poner|mettre
salir|sortir / partir
llegar|arriver
volver|revenir / rentrer
quedarse|rester
llevar|porter / emmener
traer|apporter
coger|prendre
tomar|prendre (boire, manger)
dejar|laisser / prêter
buscar|chercher
encontrar|trouver
necesitar|avoir besoin de
pensar|penser
creer|croire
entender|comprendre
empezar|commencer
terminar|finir
abrir|ouvrir
cerrar|fermer
esperar|attendre / espérer
ayudar|aider
preguntar|demander (poser une question)
pedir|demander (quelque chose) / commander
contestar|répondre
leer|lire
escribir|écrire
aprender|apprendre
enseñar|enseigner / montrer
vivir|vivre / habiter
dormir|dormir
levantarse|se lever
ducharse|se doucher
acostarse|se coucher
jugar|jouer
gustar|plaire
olvidar|oublier
recordar|se souvenir
usar|utiliser
cambiar|changer
perder|perdre
ganar|gagner
`),

V('adjetivos', '🎨', 'Adjectifs & couleurs', 'A1', `
grande|grand(e)
pequeño / pequeña|petit(e)
bueno / buena|bon(ne)
malo / mala|mauvais(e)
nuevo / nueva|nouveau / neuve
viejo / vieja|vieux / vieille
bonito / bonita|joli(e)
feo / fea|laid(e)
fácil|facile
difícil|difficile
rápido / rápida|rapide
lento / lenta|lent(e)
caliente|chaud(e) (objet, plat)
frío / fría|froid(e)
limpio / limpia|propre
sucio / sucia|sale
lleno / llena|plein(e)
vacío / vacía|vide
largo / larga|long(ue)
corto / corta|court(e)
mismo / misma|même
otro / otra|autre
importante|important(e)
interesante|intéressant(e)
increíble|incroyable
raro / rara|bizarre
listo / lista|intelligent(e) / prêt(e)
ocupado / ocupada|occupé(e)
libre|libre
mejor|meilleur / mieux
peor|pire
último / última|dernier / dernière
rojo / roja|rouge
azul|bleu(e)
verde|vert(e)
amarillo / amarilla|jaune
negro / negra|noir(e)
blanco / blanca|blanc(he)
gris|gris(e)
marrón|marron
`),

V('conectores', '🔗', 'Mots de liaison & tics de langage', 'A2', `
y|et
o|ou
pero|mais
porque|parce que
¿por qué?|pourquoi ?
entonces|alors / donc
también|aussi
tampoco|non plus
además|en plus
sin embargo|cependant
aunque|bien que / même si
cuando|quand
mientras|pendant que
después|après / ensuite
antes|avant
por eso|c'est pour ça
o sea|c'est-à-dire / bref
es decir|c'est-à-dire
bueno...|bon... / eh bien...
pues|eh bien / alors
a ver|voyons / bon
de hecho|en fait
en realidad|en réalité
por cierto|au fait
al final|finalement
por fin|enfin (soulagement)
de repente|soudain
por ejemplo|par exemple
más o menos|plus ou moins
quizás|peut-être
creo que sí|je crois que oui
creo que no|je crois que non
¿verdad?|n'est-ce pas ?
depende|ça dépend
tienes razón|tu as raison
estoy de acuerdo|je suis d'accord
ya|déjà / ça y est / je vois
todavía|encore / toujours
todavía no|pas encore
casi|presque
sobre todo|surtout
`),

V('coloquial', '😎', 'Espagnol familier d’Espagne', 'B1', `
tío / tía|mec / meuf (familier)
¡qué guay!|trop bien !
mola|c'est cool / ça déchire|¡Cómo mola tu chaqueta!|Elle est trop cool ta veste !
flipar|halluciner / adorer
¡flipo!|j'hallucine !
currar|bosser
el curro|le boulot
la pasta|le fric (et les pâtes)
la peña|les gens / la bande
el colega|le pote
¡qué fuerte!|c'est dingue !
¡vaya!|ça alors ! / mince !
¡madre mía!|oh là là !
¡venga!|allez ! / vas-y !
¡anda!|ça alors !
¡ostras!|mince ! / la vache !
estar hecho polvo|être crevé
ser un rollo|être barbant
ponerse las pilas|se bouger / s'y mettre
buen rollo|bonne ambiance / bonnes ondes
me da palo|j'ai la flemme / ça me gêne
guiri|touriste étranger
cutre|minable / cheap
chulo / chula|stylé / frimeur
pillar|attraper / piger
¿lo pillas?|tu piges ?
mogollón|un paquet / plein
un montón|beaucoup / plein
a tope|à fond
ni idea|aucune idée
¡ni de coña!|pas question ! (familier)
no pasa nada|c'est pas grave
¿qué pasa?|quoi de neuf ? / qu'est-ce qui se passe ?
¡qué morro!|quel culot !
tener resaca|avoir la gueule de bois
un planazo|un super plan
`),

V('fauxamis', '⚠️', 'Faux amis français-espagnol', 'A2', `
embarazada|enceinte (≠ embarrassée)
constipado / constipada|enrhumé(e) (≠ constipé)
el éxito|le succès (≠ sortie)
la salida|la sortie (≠ saleté)
largo / larga|long(ue) (≠ large)
ancho / ancha|large
la firma|la signature (≠ firme)
el vaso|le verre (≠ vase)
la copa|le verre à pied / le verre d'alcool
el suceso|le fait divers (≠ succès)
la tienda|le magasin / la tente
la boda|le mariage (cérémonie)
el despacho|le bureau (pièce)
quitar|enlever (≠ quitter)
dejar|laisser / quitter (quelqu'un)
contestar|répondre (≠ contester)
la discusión|la dispute / le débat
el sitio|l'endroit / la place
la gamba|la crevette (≠ jambe)
la pierna|la jambe
el rato|le moment (≠ raté)
el aceite|l'huile (≠ acide)
ensuciar|salir (rendre sale)
el oso|l'ours (≠ os)
el hueso|l'os
el burro|l'âne (≠ beurre)
el nombre|le prénom / le nom (≠ nombre)
el número|le nombre / le numéro
la ropa|les vêtements (≠ robe)
el vestido|la robe
la habitación|la chambre (≠ habitation)
la vivienda|le logement
el bufete|le cabinet d'avocat (≠ buffet)
la mesa|la table (≠ messe)
el cuarto|la pièce / le quart
`),

V('tecnologia', '📱', 'Téléphone & internet', 'A2', `
el móvil|le portable (téléphone)
el cargador|le chargeur
la batería|la batterie
cargar el móvil|charger son téléphone
me he quedado sin batería|je n'ai plus de batterie
el wifi|le wifi
la contraseña|le mot de passe|¿Cuál es la contraseña del wifi?|Quel est le mot de passe du wifi ?
los datos (móviles)|les données mobiles
la tarjeta SIM|la carte SIM
la tarifa|le forfait
llamar|appeler
la llamada|l'appel
el mensaje|le message
mandar un mensaje|envoyer un message
el audio|le message vocal
descargar|télécharger
la aplicación / la app|l'application
la pantalla|l'écran
el enlace|le lien
la cobertura|le réseau (couverture)
no tengo cobertura|je n'ai pas de réseau
la foto|la photo
hacer una foto|prendre une photo
el teclado|le clavier
el ratón|la souris
la impresora|l'imprimante
el usuario|l'identifiant / l'utilisateur
iniciar sesión|se connecter
las redes sociales|les réseaux sociaux
¿te mando la ubicación?|je t'envoie la localisation ?
`),

V('emergencias', '🚨', 'Urgences & sécurité', 'A2', `
¡socorro!|au secours !
¡ayuda!|à l'aide !
¡cuidado!|attention !
¡al ladrón!|au voleur !
llame a la policía|appelez la police
llame a una ambulancia|appelez une ambulance
el uno uno dos|le 112 (numéro d'urgence européen)
la policía|la police
los Mossos (d'Esquadra)|la police de Catalogne
la denuncia|la plainte
poner una denuncia|porter plainte
me han robado|on m'a volé|Me han robado el móvil en el metro.|On m'a volé mon portable dans le métro.
el carterista|le pickpocket
la cartera|le portefeuille
he perdido...|j'ai perdu...
el accidente|l'accident
el incendio|l'incendie
los bomberos|les pompiers
estoy herido / estoy herida|je suis blessé(e)
es urgente|c'est urgent
el consulado|le consulat
la embajada|l'ambassade
¡fuego!|au feu !
¿estás bien?|ça va ? (tu vas bien ?)
estoy bien|je vais bien
necesito un médico|j'ai besoin d'un médecin
déjame en paz|laisse-moi tranquille
la salida de emergencia|la sortie de secours
la mochila|le sac à dos
`),

V('catalan', '🟨', 'Catalan de survie', 'A1', `
bon dia|bonjour (esp. buenos días)
bona tarda|bon après-midi (esp. buenas tardes)
bona nit|bonne nuit / bonsoir (esp. buenas noches)
adéu|au revoir (esp. adiós)
fins després|à plus tard (esp. hasta luego)
si us plau|s'il vous plaît (esp. por favor)
gràcies|merci (esp. gracias)
moltes gràcies|merci beaucoup
de res|de rien (esp. de nada)
perdó|pardon (esp. perdón)
d'acord|d'accord (esp. vale)
com estàs?|comment vas-tu ? (esp. ¿cómo estás?)
molt bé|très bien (esp. muy bien)
no ho entenc|je ne comprends pas (esp. no lo entiendo)
parles castellà?|tu parles espagnol ? (esp. ¿hablas castellano?)
em dic...|je m'appelle... (esp. me llamo...)
carrer|rue (esp. calle)
plaça|place (esp. plaza)
platja|plage (esp. playa)
sortida|sortie (esp. salida)
entrada|entrée (esp. entrada)
obert|ouvert (esp. abierto)
tancat|fermé (esp. cerrado)
ajuntament|mairie (esp. ayuntamiento)
estació|gare / station (esp. estación)
avinguda|avenue (esp. avenida)
pa amb tomàquet|pain à la tomate (esp. pan con tomate)
aigua|eau (esp. agua)
cervesa|bière (esp. cerveza)
el compte, si us plau|l'addition, s'il vous plaît (esp. la cuenta, por favor)
quant val?|combien ça coûte ? (esp. ¿cuánto cuesta?)
dilluns|lundi (esp. lunes)
dissabte|samedi (esp. sábado)
diumenge|dimanche (esp. domingo)
avui|aujourd'hui (esp. hoy)
demà|demain (esp. mañana)
bon profit|bon appétit (esp. que aproveche)
Bon Nadal|Joyeux Noël (esp. Feliz Navidad)
`, {
  lang: 'ca',
  note: "À Barcelone, panneaux, menus et annonces du métro sont souvent en catalan. Pas besoin de le parler : le reconnaître suffit, et un « Bon dia ! » fait toujours plaisir. (Prononciation catalane seulement si ton appareil a une voix catalane.)",
}),

];

const ALL_WORDS = VOCAB.flatMap(t => t.words);
const WORD_BY_ID = new Map(ALL_WORDS.map(w => [w.id, w]));
const THEME_BY_ID = new Map(VOCAB.map(t => [t.id, t]));
