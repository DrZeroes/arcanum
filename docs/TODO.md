# ArcanumRP — Roadmap & TODO

## A — Magie temporaire (stats/buffs) ✅ FAIT
- Sorts stat (Force de la Terre, Agilité du Feu, Vitalité de l'Air, Pureté de l'Eau, Main de fer)
- Durée : 3 tours de combat
- Effets stockés dans `effets_actifs` avec `temporaire: true` + `toursRestants`
- Décrémentation automatique en début de tour du joueur, suppression à 0
- XP : +2 par sort de buff lancé
- Rapide : action bonus sur ces sorts

## B — Bénédictions & Malédictions (MJ → Joueur)
- Le MJ peut attribuer une bénédiction/malédiction à un joueur :
  - Bonus/malus de stats (FO, DX, IN, CN, CH, AL)
  - Bonus/malus de compétences
  - Octroi temporaire de sorts
  - Effets visuels distincts (bénédiction = doré, malédiction = violet/noir)
- Interface MJ : créer, voir, supprimer les effets actifs sur chaque joueur
- Interface Joueur : voir ses bénédictions/malédictions actives (icône + description)
- Persistance Firebase : `parties/{session}/joueurs/{id}/effets_actifs`

## C — Système de Quêtes
- Le MJ peut créer/valider/échouer des quêtes depuis le Codex
- À la validation : distribution automatique XP + or aux joueurs participants
- Journal de quêtes visible par les joueurs (quêtes en cours, validées, échouées)
- Statuts : `en_cours`, `validee`, `echouee`, `cachee`
- Affichage du journal en haut de l'écran d'accueil (onglet ou bouton dédié)
- Le MJ peut ajouter des notes/descriptions dans le journal
- Persistance Firebase : `parties/{session}/quetes/`

## D — Exploration de Donjon (nouvel écran)
- Écran dédié similaire au combat (lancé par le MJ)
- Carte de donjon en grille (cases révélées au fur et à mesure)
- Les joueurs se déplacent case par case
- Événements sur les cases :
  - 🚪 Porte fermée (nécessite crochetage ou force)
  - 🪤 Piège (jet de DX pour l'éviter, dégâts si raté)
  - 📦 Coffre (loot aléatoire selon rareté définie par le MJ)
  - 👹 Rencontre monstre (bascule vers l'écran de combat)
  - 🔎 Découverte (texte/description posé par le MJ)
- Le MJ place les éléments sur la carte avant / pendant l'exploration
- Persistance Firebase : `parties/{session}/donjon_actif/`

