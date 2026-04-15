# ArcanumRP — Roadmap & TODO

## A — Magie temporaire (stats/buffs) ✅ FAIT
- Sorts stat (Force de la Terre, Agilité du Feu, Vitalité de l'Air, Pureté de l'Eau, Main de fer)
- Durée : 3 tours de combat
- Effets stockés dans `effets_actifs` avec `temporaire: true` + `toursRestants`
- Décrémentation automatique en début de tour du joueur, suppression à 0
- XP : +2 par sort de buff lancé
- Rapide : action bonus sur ces sorts

## B — Bénédictions & Malédictions (MJ → Joueur) — reporté (voir section E)

## C — Système de Quêtes ✅ FAIT
- `js/quetes.js` : 10 quêtes prédéfinies (nom, donneur, résumé, récompenses)
- MJ : onglet "📜 Quêtes" dans le Codex — créer (prédéfinie ou personnalisée), sélectionner joueurs, XP/or custom
- MJ : boutons "✅ Valider" (distribue XP + or) et "❌ Échouer" par quête active
- Joueur : bouton "📜 Journal de Quêtes" sur l'accueil → modal
- Journal : en_cours (normal), validée (vert), échouée (rouge barré)
- Firebase listener en temps réel : toast à l'attribution et à la résolution
- XP distribué via `modif_stat { stat: 'XP' }`, or via `modif_argent`
- Persistance : `parties/{session}/quetes/{pushKey}`

## D — Exploration de Donjon ✅ FAIT
- Écran dédié similaire au combat (lancé par le MJ)
- Carte de donjon en grille avec brouillard de guerre (flood-fill, bloqué par portes fermées)
- Les joueurs se déplacent case par case, tour par tour
- Événements sur les cases :
  - 🚪 Porte (verrouillable, crochetage, clef, frappe avec crits, explosifs)
  - 🪤 Piège (détection compétence, partage localisation, désarmorcage avec crits, types : normal/poison/feu/élec)
  - 📦 Coffre (verrou + durabilité, 1 slot/joueur, 1 objet/joueur, explosifs)
  - 👹 Rencontre (notif MJ en temps réel, bascule vers combat)
  - 🔎 Découverte (texte posé par le MJ)
- Cartes pré-enregistrées (couloir, crypte, grotte, forteresse) + builder MJ
- Bouton pause MJ (bloque les déplacements joueurs)
- Retour inventaire → donjon (flag `_retourDonjon`)
- Fin de combat → MJ retourne sur son onglet donjon, joueur sur son écran donjon
- Sorts/objets offensifs utilisables sur coffres et portes
- Effets de statut : poison (tick/tour), étourdi/élec (saute un tour), brûlure/feu (dégâts bonus)
- Persistance Firebase : `parties/{session}/donjon_actif/`

## E — À faire

### Pièges sur coffres/portes
- Permettre au MJ de placer un piège sur une case coffre ou porte
- Le piège se déclenche à l'ouverture (avant le loot ou le passage)
- Types disponibles : poison, élec, feu, normal

### Bénédictions & Malédictions (MJ → Joueur)
- Le MJ peut attribuer une bénédiction/malédiction à un joueur :
  - Bonus/malus de stats (FO, DX, IN, CN, CH, AL)
  - Bonus/malus de compétences
  - Octroi temporaire de sorts
  - Effets visuels distincts (bénédiction = doré, malédiction = violet/noir)
- Interface MJ : créer, voir, supprimer les effets actifs sur chaque joueur
- Interface Joueur : voir ses bénédictions/malédictions actives (icône + description)
- Persistance Firebase : `parties/{session}/joueurs/{id}/effets_actifs`

