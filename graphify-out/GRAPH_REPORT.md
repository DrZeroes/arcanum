# Graph Report - .  (2026-04-20)

## Corpus Check
- 48 files · ~0 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 453 nodes · 1037 edges · 15 communities detected
- Extraction: 73% EXTRACTED · 27% INFERRED · 0% AMBIGUOUS · INFERRED: 280 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]

## God Nodes (most connected - your core abstractions)
1. `_toast()` - 62 edges
2. `autoSave()` - 42 edges
3. `_logCombat()` - 28 edges
4. `demarrerMoteurMulti()` - 26 edges
5. `_prochainTourVivant()` - 25 edges
6. `synchroniserJoueur()` - 22 edges
7. `updateFicheUI()` - 20 edges
8. `_logDonjon()` - 19 edges
9. `_avancerTourDonjon()` - 18 edges
10. `cacherTout()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `retirerDeInventaire()` --calls--> `autoSave()`  [INFERRED]
  js\inventaire.js → js\main.js
- `_incStatPartie()` --calls--> `_verifierSucces()`  [INFERRED]
  js\main.js → js\succes.js
- `mjDonnerObjetDirect()` --calls--> `_toast()`  [INFERRED]
  js\codex.js → js\main.js
- `switchOngletMJ()` --calls--> `genererMusiquesMJ_Integrated()`  [INFERRED]
  js\multiplayer.js → js\codex.js
- `switchOngletMJ()` --calls--> `genererEnnemisCodexMJ()`  [INFERRED]
  js\multiplayer.js → js\codex.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.04
Nodes (50): ajouterLigneCodexMJ(), _creerGrilleDonjon(), genererContenuCodexMJ(), genererEnnemisCodexMJ(), genererMusiquesMJ_Integrated(), genererNPCsMJ(), mjActiverQuete(), _mjAfficherBuilderDonjon() (+42 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (60): _afficherActionsControleMJ(), _afficherBuffsGroupe(), _afficherEnnemis(), afficherEtatCombat(), _afficherJoueurs(), _afficherOrdreTour(), _afficherPanneauActions(), _afficherPanneauInvoque() (+52 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (59): _afficherActionsHorsCombatDonjon(), _afficherBandeauRencontre(), _afficherDecouverteDonjon(), afficherEtatDonjon(), _afficherGrilleDonjon(), _afficherLogDonjon(), _afficherModalCoffre(), _afficherModalPiegeDetecte() (+51 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (46): quitterEcranCombat(), _activerClavierDonjon(), ouvrirEcranDonjon(), _ouvrirInventaireDonjon(), allerInventaire(), _appliquerReparation(), _calculerPoidsPersonnage(), _chargeMax() (+38 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (58): Geoffrey, Gorgoth, Jayna, Jormund, Kraka-tur, Loghaire, Magnus, Murgo (+50 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (31): RANG_EFFETS (lookup table in skills.js), codex.js, combat.js, compagnons.js, donjon.js, quetes.js, skills.js, getPortraitJoueur(p) (+23 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (26): activerEcouteurAlertesMJ(), activerEcouteurArgent(), activerEcouteurCadeaux(), activerEcouteurCombat(), activerEcouteurCombatLog(), activerEcouteurCommandesMJ(), activerEcouteurCompagnons(), activerEcouteurDeplacementGroupe() (+18 more)

### Community 7 - "Community 7"
Cohesion: 0.16
Nodes (20): boostVital(), calculerAlignement(), initCompetencesUI(), initMagieUI(), initTechUI(), levelUp(), modComp(), modMagie() (+12 more)

### Community 8 - "Community 8"
Cohesion: 0.19
Nodes (15): _incStatPartie(), acheterItem(), actualiserVisuelFouille(), forcerOuvertureCoffre(), forcerOuvertureMarchand(), marchandIdentifierObjet(), ouvrirPromptFouille(), ouvrirPromptMarchand() (+7 more)

### Community 9 - "Community 9"
Cohesion: 0.67
Nodes (3): Combat Spells System (Sorts de Combat), Initiative Mechanic System, v0.8 — Avril 2026

### Community 10 - "Community 10"
Cohesion: 0.67
Nodes (0): 

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (2): magie.js, TODO: Incarnation d'Eau (Cat. 5)

### Community 12 - "Community 12"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Community 13"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (1): TODO: Sort Détection de l'Invisible (Cat. 6)

## Knowledge Gaps
- **12 isolated node(s):** `v0.4 — Mars 2026`, `Pickpocket System (Vol à la Tire)`, `Temporary Magic Buffs (Magie Temporaire)`, `Quick Weapons & Actions (Armes Rapides)`, `getPortraitJoueur(p)` (+7 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 11`** (2 nodes): `magie.js`, `TODO: Incarnation d'Eau (Cat. 5)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (1 nodes): `compagnons.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (1 nodes): `quetes.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (1 nodes): `TODO: Sort Détection de l'Invisible (Cat. 6)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `_toast()` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 6`, `Community 7`, `Community 8`?**
  _High betweenness centrality (0.243) - this node is a cross-community bridge._
- **Why does `autoSave()` connect `Community 2` to `Community 8`, `Community 1`, `Community 3`, `Community 7`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Why does `synchroniserJoueur()` connect `Community 1` to `Community 2`, `Community 3`, `Community 6`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Are the 56 inferred relationships involving `_toast()` (e.g. with `mjDonnerObjetDirect()` and `mjRenvoyerCompagnon()`) actually correct?**
  _`_toast()` has 56 INFERRED edges - model-reasoned connections that need verification._
- **Are the 32 inferred relationships involving `autoSave()` (e.g. with `_afficherPanneauActions()` and `utiliserObjetCombat()`) actually correct?**
  _`autoSave()` has 32 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `demarrerMoteurMulti()` (e.g. with `chargerPersonnage()` and `appliquerFondActuel()`) actually correct?**
  _`demarrerMoteurMulti()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `v0.4 — Mars 2026`, `Pickpocket System (Vol à la Tire)`, `Temporary Magic Buffs (Magie Temporaire)` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._