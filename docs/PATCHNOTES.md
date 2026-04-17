# ArcanumRP — Patch Notes

---

## v0.9 — Avril 2026

### Système de Succès (Steam-like)

- Nouvel onglet **🏆 Succès** dans le journal joueur
- Succès verrouillé : nom seul affiché ; débloqué : carte colorée avec description et date
- Accordéon par catégorie (replié par défaut)
- Toast à chaque déblocage, file d'attente pour éviter les empilements simultanés
- Vérification automatique scoped par clé stat (`_verifierSucces(cle)`) pour éviter les faux déclenchements croisés
- Vérification au level-up (`_verifierSuccesLevelUp`) pour les succès de maîtrise
- MJ : bouton "🏆 Gérer les Succès" par joueur dans le Codex → débloquer / révoquer par catégorie
- Sync Firebase temps réel : déblocage MJ → notification toast joueur instantanée

#### Catégories & succès disponibles (57 au total)
- **Combat** (6) : Premier Sang, Combattant, Tueur, Massacreur, Exterminateur, Berserker
- **Magie** (3) : Apprenti Mage, Mage Confirmé, Archimage
- **Soins** (2) : Aidant, Médecin de campagne
- **Survie** (3) : Résilient, Première Mort, 9 Vies
- **Exploration** (5) : Explorateur, Grand Explorateur, Premier Voyage, Voyageur, Globe-Trotteur
- **Richesse** (6) : Argent de poche → Homme d'Affaires (or cumulé) + Client Fidèle → Mécène (or dépensé)
- **Compagnons** (2) : Pas Seul, Chef de Groupe
- **Donjon** (2) : Dépiégeur, Sapeur
- **Histoire** (4) : Survivant du Crash, Héros, Diplomate, Collectionneur (tous manuels MJ)
- **Équipe** (5) : Traître, Généreux, Bienfaiteur, Bien Entouré, Chouchou
- **Vol** (2) : Voleur, Filou
- **Artisan** (2) : Artisan, Maître Artisan
- **Maîtrise** (45) : 5 stats à 20 · 16 écoles de magie complètes · 8 écoles de tech complètes · 16 skills à 20

#### Stats de partie trackées (nouvelles clés)
`attaques_allies` · `villes_decouvertes` · `compagnons_debloques` · `or_depense` · `vols_reussis` · `objets_craftes` · `objets_donnes` · `objets_recus` · `pieges_desamorces`

### Refonte Codex — catégories d'objets

- Explosifs, grenades, pièges, cocktails, acide → nouveau type `explosif` (préfixe TEC), icône 💣
- Énergie (DIV11) + Carburant (CONS20) → type `munition` (préfixe MUN)
- Bijoux (BIJ01–04) → intégrés dans la section Armures
- **Déclencheur de piège (TEC14)** : bonus +15 au skill Désamorçage quand équipé

---

## v0.8 — Avril 2026

### Refonte complète des sorts de combat

Tous les sorts disposent désormais d'effets mécaniques réels en combat, organisés en 4 catégories.

#### Catégorie 1 — Dégâts & effets secondaires
- **Choc, Choc électrique, Étourdissement, Rafale de vent** : dégâts + ROLL → cible repoussée en dernier dans la frise
- **Boule de feu** : dégâts + 25% de chances d'éclabousser les ennemis adjacents (½ dégâts)
- **Éclair** : dégâts principaux + propagation en chaîne (½ → ¼ → ⅛) sur les ennemis proches
- **Vapeurs toxiques** : dégâts + ROLL → poison (2 tours)
- **Nuée d'insectes** : dégâts + ROLL → vitesse −25% (ralenti dans la frise)
- **Désarmement** : ROLL → ennemi désarmé (−5 dégâts en mains nues)
- **Absorption de la volonté** : ROLL → ennemi bloqué (passe son tour sans regen)
- **Charme** : ROLL → ennemi charmé (ne peut plus attaquer le lanceur)
- **Flash** : ROLL → ennemi aveuglé (25% de rater sa prochaine attaque, consommé en une frappe)
- **Faiblesse** : ROLL → ennemi affaibli (−5 dégâts, FO −5)
- **Rétrécissement** : ROLL → ennemi rétréci (reçoit +25% dégâts pendant 3 tours)
- **Désintégration / Suppression de la vie** : ROLL requis — tue instantanément si réussi

#### Catégorie 2 — Contrôle / CC
- **Cauchemar** : ROLL zone → tous les ennemis vivants repoussés en dernier dans la frise
- **Pétrification** : ROLL → immunité physique totale (attaques mêlée ignorées), passe ses tours avec regen
- **Enchevêtrement** : ROLL → vitesse /2 + ROLL de maintien à chaque tour du MJ (libération aléatoire)
- **Charmer les animaux** : ROLL facile si cible `race: animal` → passe ses tours indéfiniment
- **Entrave aux sortilèges** : ROLL → ennemi ne peut plus lancer de sorts
- **Stase** : ROLL → ennemi immobilisé (passe ses tours sans regen)
- **Monstre illusoire** : ROLL → 50% de chance que le monstre attaque un allié imaginaire
- **Domination / Contrôler les animaux** : ROLL → ennemi dominé (le MJ peut le retourner contre ses alliés)
- **Dissipation des sortilèges** : ROLL → efface tous les effets magiques actifs sur l'ennemi ciblé

Toutes les CC : durée/maintien ROLL gérés tour par tour dans `mjPasserTourEnnemi`. Vitesse originale restaurée automatiquement à l'expiration.

#### Catégorie 3 — Buffs & Protections persistantes

**Buffs de groupe** (bouton unique "🛡 Tout le groupe", FT dépensée chaque tour du lanceur) :
- **Mur de pierres / Mur de force** : −20% dégâts physiques pour tout le groupe
- **Mur de feu** : riposte automatique en feu (30% des dégâts reçus) sur chaque attaque ennemie en mêlée
- **Bouclier mystique** : −20% dégâts magiques pour tout le groupe
- **Brouillard** : +20 pts d'esquive pour tout le groupe
- **Régénération** : +3 PV à chaque allié en début de son tour
- **Sanctuaire** : les morts-vivants ne peuvent pas cibler les membres du groupe
- Dissipation automatique si FT épuisée, avec log de combat

**Buffs individuels** (ciblage allié normal) :
- **Bouclier de protection** : −25% dégâts physiques, se brise au premier coup reçu
- **Hâte** : vitesse ×2 pendant 3 tours (modifie immédiatement la frise), restaurée automatiquement à l'expiration
- **Occultation** : −10% tous dégâts + +10 esquive pendant 3 tours
- **Résistance aux sortilèges** : +25 RM pendant 3 tours
- **Invisibilité** : cible invisible (cachée dans la liste des cibles ennemies), coûte 4 FT/tour au lanceur

Bandeau "🛡 Buffs actifs" affiché sous la frise d'initiative pour tous.

#### Catégorie 4 — Vitesse / Initiative
- **Distorsion spatiale** : cibler un allié → choix ▲ Devant / ▼ Derrière → au prochain round, la cible joue son tour bonus en tête ou en queue de frise
- **Altération temporelle** : AoE zone — ROLL sur chaque ennemi vivant → vitesse /2 si raté. Coûte 1 FT/tour, annulable à tout moment depuis le panneau d'actions du lanceur
- **Tempus Fugit** : alliés ×3 vitesse (immédiat dans la frise) + ROLL zone enemies → vitesse /2 si raté. Coûte 4 FT/tour, annulable

### Système de mécanique d'initiative
- **Nouveau round** : le tri par vitesse s'exécute désormais même sans entrées `pushed`, ce qui garantit la prise en compte des `bonus_round` (Distorsion spatiale) et des changements de vitesse (Tempus Fugit)
- **ROLL de résistance** unifié : `d100 + IN_lanceur vs d100 + (IN_cible + RM_cible)` — plus haut gagne

### Détection de pièges
- Chance de base **10%** même sans compétence Détection (portée : case adjacente uniquement)
- Avec compétence : formule inchangée (portée ×2, chance jusqu'à 95%)

---

## v0.7 — Avril 2026

### Système de Quêtes (améliorations)
- Journal de quêtes transformé en **Journal à 4 onglets** : Quêtes · Bénédictions · Antécédent · Statistiques
- Onglet Quêtes : XP et or des récompenses masqués côté joueur
- Affichage couleur complet selon statut : texte entièrement vert (validée) ou rouge barré (échouée)
- Tri par statut (en cours → validée → échouée) ou par date de réception, ascendant/descendant (▲/▼)
- Onglet Statistiques : ennemis tués, PV perdus, or cumulé, sorts lancés, potions utilisées, morts, cases parcourues

### Système de Donjon (améliorations)
- **Clavier ZQSD + flèches directionnelles** pour se déplacer dans le donjon
- **Coffres persistants** : ouvrir et quitter sans prendre ne fait plus disparaître le coffre pour les autres joueurs ; icône 📭 uniquement si tous les slots ET l'or sont pris
- **Bouton "Ouvrir le coffre / Interagir avec la porte"** disponible quand on est déjà sur la case, pour retenter sans se déplacer
- Crocheter ou frapper un coffre/porte consomme maintenant le tour
- Utiliser un item ou un sort hors combat est bloqué si ce n'est pas son tour
- **Rencontre ennemie** : met automatiquement le donjon en **pause** dès le déclenchement, bandeau rouge affiché côté joueur, la pause est levée quand le MJ lance le combat ou ignore la rencontre
- **Poison donjon** : bypass de l'armure physique (c'est un poison interne), respect de la résistance `resPoison` uniquement
- **Le poison ne peut pas tuer** : si les dégâts amèneraient à ≤ 0 PV, le joueur reste à 1 PV et le surplus est déduit de la FT
- Log de donjon affiche les dégâts de poison avec détail PV/FT
- Log de combat mis à jour lors d'un tick de poison en combat

### Level Up
- Soin complet des PV et FT au passage de niveau

### Inventaire / Or
- Don d'or via le même modal que le don d'objet (sélection du joueur par bouton + champ montant) — plus de `prompt()`

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
