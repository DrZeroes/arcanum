# ArcanumRP — Patch Notes

---

## v0.6 — Avril 2026

### Système de Donjon (nouveau)
- Nouvel onglet "🗺 Donjon" dans le Codex MJ : éditeur de grille configurable (5–20 × 5–20 cases)
- MJ peint les cases sol/mur au clic et place des événements : coffre, piège, porte, découverte, rencontre
- Point de départ configurable ; lancement distribue les positions et l'ordre de jeu (basé sur DX) à tous les joueurs
- Côté joueur : écran dédié avec grille et brouillard de guerre (flood-fill — seules les cases accessibles depuis la position du joueur sont visibles)
- Déplacement tour par tour (1 case/tour, même rotation que le combat)
- Événements automatiques au pas sur une case : piège (−PV), coffre (loot aléatoire + or), découverte (message), porte (crochetage DX si verrouillée), rencontre (notifie le MJ)
- MJ voit la grille complète sans brouillard avec positions de tous les joueurs
- Rencontre ennemie : alerte dans le panel MJ avec bouton "⚔ Lancer le combat"
- Journal de donjon en temps réel (Firebase) visible côté joueur et MJ
- Bouton "🏁 Terminer le donjon" (MJ) renvoie automatiquement tous les joueurs à l'accueil

### Bénédictions & Malédictions (nouveau système)
- Le MJ peut attribuer des effets à un joueur depuis le Codex (bouton ✨ par carte joueur)
- Paramètres disponibles : stats (FO/IN/CN/DX/CH), PV max, FT max, 16 compétences de base
- Type : bénédiction (doré) ou malédiction (violet)
- Le MJ peut supprimer un effet individuellement
- Bouton "Appliquer à tous" pour distribuer le même effet à tous les joueurs d'un coup
- Côté joueur : badges colorés sur l'écran d'accueil (avec détail au survol)
- Stats et compétences colorées sur la fiche (doré = buff, violet = malus)
- maxPV et maxFT recalculés en tenant compte des bonus d'effets actifs

### Divers
- Sorts sans effet mécanique marqués `*` dans la liste d'apprentissage (fiche personnage)
- Quêtes : impossible d'attribuer deux fois la même quête `en_cours` au même joueur

### Système de Quêtes
- Nouvel onglet "📜 Quêtes" dans le Codex MJ : créer une quête (prédéfinie ou personnalisée), sélectionner les joueurs participants, définir récompenses XP + or
- 10 quêtes prédéfinies dans `quetes.js` (nom, donneur, résumé, récompenses)
- Boutons "✅ Valider" (distribue XP + or à chaque participant) et "❌ Échouer" sur chaque quête active
- Côté joueur : bouton "📜 Journal de Quêtes" sur l'accueil — affichage coloré par statut (en cours, ✅ validée en vert, ❌ échouée en rouge barré)
- Toast en temps réel : notification à l'attribution d'une nouvelle quête et à sa résolution
- Persistance Firebase : `parties/{session}/quetes/`

### Magie temporaire (buffs de stats)
- Sorts de stat (Force de la Terre, Agilité du Feu, Vitalité de l'Air, Pureté de l'Eau, Main de fer) appliquent un effet temporaire au lanceur ou un allié
- Durée : 3 tours de combat
- L'effet est visible sur la fiche (bénédiction dorée) avec décrémentation automatique
- À 0 tour restant : l'effet est supprimé et un toast "X a expiré" s'affiche
- Ces sorts donnent 2 XP au lanceur et sont **rapides** (action bonus)
- Ciblage étendu : peut cibler n'importe quel allié (PV pleins ou non)

### Armes & Sorts rapides
- Certaines armes légères et sorts permettent d'agir deux fois par tour (`actionsParTour: 2`)
- Armes rapides : Dague simple, Couteau rouillé, Vieille rapière, Revolver de qualité, Fusil à répétition
- Sort rapide : Blessure (Nécromancie noire, niv 1)
- Indicateur "⚡ Action rapide !" affiché sur le panneau d'actions lors du bonus d'attaque
- Si l'ennemi est tué au premier coup, le bonus d'action n'est pas déclenché

### Vol à la tire
- Modal MJ repensée : recherche par nom, filtres par catégorie, objets de quête inclus
- Nouvelle option Or avec quantité libre
- Formule ajustée : `min(95%, DX×3 + compétence×4 + bonus équipement)` — compétence prime sur DX

### Magie
- Message d'erreur de déverrouillage de sort précisé : indique si c'est le niveau ou l'intelligence qui est insuffisant, avec les valeurs requises et actuelles

### Interface / Fiche
- Couleur verte retirée des stats après validation de distribution de points
- Compétence "Purge de toxines" retirée de la liste (catégorie Survie supprimée)
- Résistance au poison désormais basée sur CN/2 (stat dérivée Toxines)

### Sécurité Firebase
- Base de données sécurisée : lecture/écriture réservées aux utilisateurs authentifiés
- Correction race condition auth : listeners Firebase ne se posent plus avant résolution de l'auth

### Patch notes & Roadmap
- Bouton ℹ en haut à gauche de l'accueil → modal patch notes + roadmap en développement

---

## v0.5 — Avril 2026

### Sécurité
- Firebase Realtime Database sécurisé : lecture/écriture réservées aux utilisateurs authentifiés
- Authentification anonyme Firebase activée (silencieuse, transparente pour les joueurs)

### Vol à la tire
- Modal MJ entièrement repensée : recherche par nom, sous-catégories par type d'arme/armure/consommable…
- Objets de quête inclus dans la sélection
- Nouvel option **Or (quantité libre)** : le MJ définit la somme exacte
- Formule ajustée : `min(95%, DX×3 + compétence×4 + bonus équipement)` — la compétence pèse plus que la dextérité

### Système de poison
- Le jet de guérison se fait **avant** le tick de dégâts
- Dégâts poison : 15% des PV max par tour
- Compétence `Purge de toxines` (stat CN) : +5% de chance de guérison par point investi, minimum 5% par tour
- Messages toast dédiés : dégâts subis, guérison réussie, chance au prochain tour

### Combat
- Joueur à 0 PV : mort confirmée, ne peut plus agir
- Seul un sort ou potion de **résurrection** peut le ranimer
- Condition de défaite : si tous les joueurs ET compagnons sont KO → fin de combat automatique
- Affichage PV correct pour les joueurs morts (plus de stale data)
- Correction : les attaques monstres mettent à jour `ordre_jeu` immédiatement → détection défaite fiable

### Magie
- `_appliquerPoison` retiré des sorts (poison géré uniquement par le système dédié)

### Multijoueur / Firebase
- Correction : `esquive` scoping bug (ReferenceError silencieux sur soins positifs MJ→joueur)
- Correction : doublons de cartes joueurs dans l'interface MJ (race condition innerHTML)
- Correction : écran de combat ne s'affichait pas (SyntaxError + listener non enregistré)
- `demarrerMoteurMulti` : initialisation en deux phases, robuste pour les nouveaux joueurs
- Correction : listeners Firebase ne se posent plus avant que l'auth soit résolue

---

## v0.4 — Mars 2026

### Compagnons
- Système de compagnons complet : stats, sorts, combat
- Le MJ peut attaquer les compagnons
- Compagnons affichés dans l'ordre de jeu et les cartes combat

### Combat (phase 2)
- Ordre de jeu basé sur la vitesse (DX)
- Sorts utilisables depuis l'écran combat
- Sélection de cible (ennemi, allié, compagnon)
- Log de combat détaillé (version joueur + version MJ)
- Critique et échec critique (seuils d100)
- Éléments de dégâts : feu, électricité, poison

### Interface
- Écran combat dédié avec barre d'ordre, cartes joueurs/ennemis
- Boutons consommables et sorts en combat
- Leds XP sur les cartes joueurs
