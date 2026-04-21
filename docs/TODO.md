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

## E — Compagnons ✅ FAIT (v0.10)

- 31 compagnons dans `compagnons.js` (stats, équipement, portraits, règles spéciales)
- Portraits dans frise d'action, cartes compagnon, onglet Groupe
- Modal MJ refaite (portraits, recherche, grisage des assignés)
- Fiche complète `ouvrirFicheCompagnon` (joueur + MJ)
- Level-up : vérification prérequis (plafonds, stat gouvernante ≥ 7)
- Mémoire de progression au renvoi/réattribution
- Bouton RAZ compagnon (MJ) avec confirmation

## F — Sorts Cat. 5 (partiel) ✅ FAIT

- Incarnation d'Air (`buffPersistant` : +30 esquive, −20% dég. physiques, 3 tours)
- Incarnation de Pierre (`buffPersistant` : −30% dég. physiques, −20% dég. magiques, 3 tours)
- Incarnation de Feu (`buffPersistant` : riposte feu 30% des dégâts reçus, 3 tours)
- Appel des élémentaires (Air / Terre / Feu) via `invocation`

## G — Sorts Cat. 6 (partiel) ✅ FAIT

- Déverrouillage magique (`deverrouillage: true` — ouvre portes/coffres donjon, IN×5%)

## H — Pièges sur coffres/portes ✅ FAIT

- `_verifierPiegeObjet` déclenché à l'ouverture d'un coffre ou passage d'une porte
- Types : poison, élec, feu, normal

## J — Effets de Rang (Apprenti / Expert / Maître) ✅ FAIT (v0.11)

- `RANG_EFFETS` + `_getRang` + `_getRangEffet` définis dans `skills.js`
- **Combat** (`combat.js`, `codex.js`) :
  - Arc Apprenti : +5 vitesse si arc équipé ; Expert : 2 attaques/tour ; Maître : dégâts max
  - Mêlée Apprenti : +5 vitesse ; Expert : perce 25% armure ; Maître : pas d'échec critique
  - Lancer Apprenti : +5 vitesse ; Expert : +50% dégâts ; Maître : dégâts max
  - Armes à feu Apprenti : +5 vitesse ; Expert : +10% dégâts ; Maître : dégâts max
  - Attaque sournoise Apprenti : 1ère attaque ignore armure (si ennemi n'a pas agi) ; Expert : toutes armes ; Maître : seuil critique −20
  - Esquive Apprenti/Expert/Maître : +5/+10/+20 esquive passive
- **Donjon** (`donjon.js`) :
  - Crochetage Apprenti : pas de coût de tour sur échec ; Expert : +5 ; Maître : +25
  - Détection piège Apprenti/Expert : +5/+10 ; Maître : 2e chance
  - Désamorçage Apprenti : +5 ; Expert : seuil crit succès amélioré ; Maître : 2e chance
- **Social / Technologie** :
  - Vol à la tire Apprenti/Expert : échec seulement sur crit fail (1-5) ; Maître : toujours réussit
  - Marchandage Apprenti : −5% supplémentaire à l'achat
  - Soins Apprenti : ×1.5 efficacité des potions
  - Réparation Apprenti/Expert/Maître : dégradation 5% / 1% / 0%
  - Persuasion Apprenti : +5% XP de quêtes

## I — À faire

### Incarnation d'Eau (compléter Cat. 5)
- Ajouter dans `magie.js` : niv 10, buffPersistant, effet défensif eau (ex: +25 RM, −20% dégâts magiques)
- Appel d'un élémentaire d'Eau (niv 15, invocation)

### Sort Détection de l'invisible (Cat. 6)
- Révèle les ennemis/alliés invisibles dans le donjon (rayon basé sur IN)

### Attribution XP pour kills par poison
- Le tick de poison doit donner de l'XP si l'ennemi meurt (combat.js / codex.js mjTourSuivant)

### Équipement compagnon propagé en combat
- Passer `equipement` dans `ordre_jeu` lors du lancement du combat (codex.js)
- `_degatsArme` lit déjà `p.equipement` — il suffit que le champ soit présent

