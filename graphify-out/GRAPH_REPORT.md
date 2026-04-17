# Graph Report - .  (2026-04-18)

## Corpus Check
- Large corpus: 143 files · ~907,176 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 570 nodes · 1333 edges · 25 communities detected
- Extraction: 71% EXTRACTED · 28% INFERRED · 1% AMBIGUOUS · INFERRED: 377 edges (avg confidence: 0.83)
- Token cost: 12,000 input · 10,800 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Portraits & Art Styles|Portraits & Art Styles]]
- [[_COMMUNITY_Système de Combat|Système de Combat]]
- [[_COMMUNITY_Exploration Donjon|Exploration Donjon]]
- [[_COMMUNITY_Codex & Interface MJ|Codex & Interface MJ]]
- [[_COMMUNITY_Personnage & Crafting|Personnage & Crafting]]
- [[_COMMUNITY_Mécaniques Clés (Firebase, Initiative, Magie)|Mécaniques Clés (Firebase, Initiative, Magie)]]
- [[_COMMUNITY_Multijoueur Firebase|Multijoueur Firebase]]
- [[_COMMUNITY_Stats & Compétences|Stats & Compétences]]
- [[_COMMUNITY_Carte du Monde & Lieux|Carte du Monde & Lieux]]
- [[_COMMUNITY_Inventaire & Crafting|Inventaire & Crafting]]
- [[_COMMUNITY_Création de Personnage|Création de Personnage]]
- [[_COMMUNITY_Magie & Invocations|Magie & Invocations]]
- [[_COMMUNITY_Navigation Monde|Navigation Monde]]
- [[_COMMUNITY_Portraits Demi-Orque|Portraits Demi-Orque]]
- [[_COMMUNITY_Système Audio|Système Audio]]
- [[_COMMUNITY_Items & Objets|Items & Objets]]
- [[_COMMUNITY_Arrière-Plans|Arrière-Plans]]
- [[_COMMUNITY_Quêtes|Quêtes]]
- [[_COMMUNITY_Données Races|Données Races]]
- [[_COMMUNITY_Compétences|Compétences]]
- [[_COMMUNITY_Technologie|Technologie]]
- [[_COMMUNITY_Patch Level Up|Patch: Level Up]]
- [[_COMMUNITY_Patch Don Or|Patch: Don Or]]
- [[_COMMUNITY_Patch Actions Tour|Patch: Actions Tour]]
- [[_COMMUNITY_Patch Vol à la Tire|Patch: Vol à la Tire]]

## God Nodes (most connected - your core abstractions)
1. `_toast()` - 64 edges
2. `autoSave()` - 49 edges
3. `_logCombat()` - 28 edges
4. `demarrerMoteurMulti()` - 27 edges
5. `_prochainTourVivant()` - 26 edges
6. `updateFicheUI()` - 23 edges
7. `cacherTout()` - 23 edges
8. `synchroniserJoueur()` - 22 edges
9. `finaliserSortCombat()` - 20 edges
10. `Monde d'Arcanum` - 20 edges

## Surprising Connections (you probably didn't know these)
- `Manuel (PDF - non lisible)` --semantically_similar_to--> `ArcanumRP Patch Notes`  [AMBIGUOUS] [semantically similar]
  docs/pdf/manuel.pdf → docs/PATCHNOTES.md
- `Races (PDF - non lisible)` --semantically_similar_to--> `ArcanumRP Patch Notes`  [AMBIGUOUS] [semantically similar]
  docs/pdf/races.pdf → docs/PATCHNOTES.md
- `Schemas (PDF - non lisible)` --semantically_similar_to--> `ArcanumRP Patch Notes`  [AMBIGUOUS] [semantically similar]
  docs/pdf/schemas.pdf → docs/PATCHNOTES.md
- `Magies (PDF - non lisible)` --semantically_similar_to--> `Refonte Sorts de Combat (v0.8)`  [AMBIGUOUS] [semantically similar]
  docs/pdf/magies.pdf → docs/PATCHNOTES.md
- `Carte (PDF - non lisible)` --semantically_similar_to--> `SystÃ¨me de Donjon - Nouveau (v0.6)`  [AMBIGUOUS] [semantically similar]
  docs/pdf/carte.pdf → docs/PATCHNOTES.md

## Hyperedges (group relationships)
- **SystÃ¨me Donjon Complet (Grille + Brouillard + Firebase + Ã‰vÃ©nements)** — patchnotes_donjon_v06, concept_brouillard_guerre, concept_firebase_sync, patchnotes_donjon_v07 [EXTRACTED 0.95]
- **Combat Sorts & Initiative (Frise + ROLL + CatÃ©gories Sorts)** — patchnotes_sorts_combat_v08, concept_frise_initiative, concept_roll_resistance, patchnotes_initiative_mecanique [EXTRACTED 0.95]
- **SystÃ¨me SuccÃ¨s, Stats Partie & Sync Firebase** — patchnotes_systeme_succes, patchnotes_stats_partie, concept_firebase_sync, patchnotes_succes_categories [EXTRACTED 0.92]
- **Industrial Steampunk Cities of Arcanum** — location_tarante, location_cendrebourg, location_dernholm, location_racinenoir [INFERRED 0.85]
- **Underground Dwarven Settlements** — location_montnoir, location_roue [INFERRED 0.80]
- **Magical Forest Locations** — location_quintara, location_tsenang, location_tulla, location_thana [INFERRED 0.80]
- **Isolated Rural Locations** — location_arbalah, location_simon [INFERRED 0.75]
- **Prison and Exile Island Locations** — location_desespoir, location_demogre [INFERRED 0.70]
- **Death and Graveyard Locations** — location_mort, location_placeholder [INFERRED 0.75]
- **World Map Image Assets** — carte_monde_full_worldmap, carte_monde_worldmap, world_arcanum [EXTRACTED 1.00]
- **All Location Background Images (fonds)** — location_arbalah, location_cendrebourg, location_crash, location_demogre, location_dernholm, location_desespoir, location_eaudor, location_montnoir, location_mort, location_quintara, location_racinenoir, location_roue, location_simon, location_tarante, location_thana, location_trist_coll, location_tsenang, location_tulla, location_placeholder [EXTRACTED 1.00]
- **Bedokien Race Portrait Set (4 variants)** — portrait_bedokien_01, portrait_bedokien_02, portrait_bedokien_03, portrait_bedokien_04 [EXTRACTED 1.00]
- **Demi-Elfe Female Portrait Set (4 variants)** — portrait_demi_elfe_femme_01, portrait_demi_elfe_femme_02, portrait_demi_elfe_femme_03, portrait_demi_elfe_femme_04 [EXTRACTED 1.00]
- **Demi-Elfe Male Portrait Set (4 variants)** — portrait_demi_elfe_homme_01, portrait_demi_elfe_homme_02, portrait_demi_elfe_homme_03, portrait_demi_elfe_homme_04 [EXTRACTED 1.00]
- **Demi-Ogre Male Portrait Set (4 variants)** — portrait_demi_ogre_homme_01, portrait_demi_ogre_homme_02, portrait_demi_ogre_homme_03, portrait_demi_ogre_homme_04 [EXTRACTED 1.00]
- **Demi-Orque Female Portrait Set (4 variants)** — portrait_demi_orque_femme_01, portrait_demi_orque_femme_02, portrait_demi_orque_femme_03, portrait_demi_orque_femme_04 [EXTRACTED 1.00]
- **All Playable Races in Chunk 03** — race_bedokien, race_demi_elfe, race_demi_ogre, race_demi_orque [INFERRED 0.90]
- **Character Creation Portrait System** — concept_character_creation, concept_portrait_system, portrait_placeholder [INFERRED 0.85]
- **Half-Orc Male Portraits (02-04)** — portrait_demi_orque_homme_02, portrait_demi_orque_homme_03, portrait_demi_orque_homme_04 [EXTRACTED 1.00]
- **Elf Female Portraits (01-04)** — portrait_elfe_femme_01, portrait_elfe_femme_02, portrait_elfe_femme_03, portrait_elfe_femme_04 [EXTRACTED 1.00]
- **Elf Male Portraits (01-04)** — portrait_elfe_homme_01, portrait_elfe_homme_02, portrait_elfe_homme_03, portrait_elfe_homme_04 [EXTRACTED 1.00]
- **Dark Elf Female Portraits (01-04)** — portrait_elfenoire_femme_01, portrait_elfenoire_femme_02, portrait_elfenoire_femme_03, portrait_elfenoire_femme_04 [EXTRACTED 1.00]
- **Dark Elf Male Portraits (01-04)** — portrait_elfenoire_homme_01, portrait_elfenoire_homme_02, portrait_elfenoire_homme_03, portrait_elfenoire_homme_04 [EXTRACTED 1.00]
- **Gnome Male Portraits (01-03)** — portrait_gnome_homme_01, portrait_gnome_homme_02, portrait_gnome_homme_03 [EXTRACTED 1.00]
- **All Chunk 4 Character Creation Portraits** — portrait_demi_orque_homme_02, portrait_demi_orque_homme_03, portrait_demi_orque_homme_04, portrait_elfe_femme_01, portrait_elfe_femme_02, portrait_elfe_femme_03, portrait_elfe_femme_04, portrait_elfe_homme_01, portrait_elfe_homme_02, portrait_elfe_homme_03, portrait_elfe_homme_04, portrait_elfenoire_femme_01, portrait_elfenoire_femme_02, portrait_elfenoire_femme_03, portrait_elfenoire_femme_04, portrait_elfenoire_homme_01, portrait_elfenoire_homme_02, portrait_elfenoire_homme_03, portrait_elfenoire_homme_04, portrait_gnome_homme_01, portrait_gnome_homme_02, portrait_gnome_homme_03 [INFERRED 0.95]
- **Gnome Male Portrait Set** — portrait_gnome_homme_04, race_gnome, gender_homme [EXTRACTED 1.00]
- **Halfling Male Portrait Set** — portrait_halfelin_homme_01, portrait_halfelin_homme_02, portrait_halfelin_homme_03, portrait_halfelin_homme_04, race_halfelin, gender_homme [EXTRACTED 1.00]
- **Human Female Portrait Set** — portrait_humain_femme_01, portrait_humain_femme_02, portrait_humain_femme_03, portrait_humain_femme_04, portrait_humain_femme_05, portrait_humain_femme_06, race_humain, gender_femme [EXTRACTED 1.00]
- **Human Male Portrait Set** — portrait_humain_homme_01, portrait_humain_homme_02, portrait_humain_homme_03, portrait_humain_homme_04, portrait_humain_homme_05, race_humain, gender_homme [EXTRACTED 1.00]
- **Dwarf Male Portrait Set** — portrait_nain_homme_01, portrait_nain_homme_02, portrait_nain_homme_03, portrait_nain_homme_04, race_nain, gender_homme [EXTRACTED 1.00]
- **Ogre Male Portrait Set** — portrait_ogre_homme_01, portrait_ogre_homme_02, race_ogre, gender_homme [EXTRACTED 1.00]
- **Digital Painterly Style Portraits Group** — portrait_gnome_homme_04, portrait_halfelin_homme_01, portrait_halfelin_homme_02, portrait_halfelin_homme_03, portrait_halfelin_homme_04, portrait_humain_femme_01, portrait_humain_femme_02, portrait_humain_femme_03, portrait_humain_femme_04, portrait_humain_homme_01, portrait_humain_homme_02, portrait_humain_homme_03, portrait_humain_homme_04, portrait_nain_homme_01, portrait_nain_homme_02, portrait_nain_homme_03, portrait_nain_homme_04, portrait_ogre_homme_01, portrait_ogre_homme_02, artstyle_digital_painting [INFERRED 0.90]
- **Vintage Photo Style Portraits Group** — portrait_humain_femme_05, portrait_humain_femme_06, portrait_humain_homme_05, artstyle_vintage_photo [INFERRED 0.90]
- **All Character Creation Portrait Assets** — portrait_gnome_homme_04, portrait_halfelin_homme_01, portrait_halfelin_homme_02, portrait_halfelin_homme_03, portrait_halfelin_homme_04, portrait_humain_femme_01, portrait_humain_femme_02, portrait_humain_femme_03, portrait_humain_femme_04, portrait_humain_femme_05, portrait_humain_femme_06, portrait_humain_homme_01, portrait_humain_homme_02, portrait_humain_homme_03, portrait_humain_homme_04, portrait_humain_homme_05, portrait_nain_homme_01, portrait_nain_homme_02, portrait_nain_homme_03, portrait_nain_homme_04, portrait_ogre_homme_01, portrait_ogre_homme_02, character_creation [INFERRED 0.95]
- **All Ogre Male Portraits** — ogre_homme_03, ogre_homme_04, race_ogre, gender_homme [EXTRACTED 1.00]
- **All Orc Male Portraits** — orque_homme_01, orque_homme_02, orque_homme_03, orque_homme_04, race_orque, gender_homme [EXTRACTED 1.00]
- **Character Creation Portraits Chunk 6** — ogre_homme_03, ogre_homme_04, orque_homme_01, orque_homme_02, orque_homme_03, orque_homme_04, character_creation [INFERRED 0.90]
- **Sepia Damaged Photo Style Portraits** — ogre_homme_03, ogre_homme_04, orque_homme_02, art_style_sepia_damaged [EXTRACTED 1.00]
- **Watercolor Sketch Style Portraits** — orque_homme_03, orque_homme_04, art_style_watercolor_sketch [EXTRACTED 1.00]

## Communities

### Community 0 - "Portraits & Art Styles"
Cohesion: 0.08
Nodes (74): Art Style: Digital Painting, Art Style: Sepia Damaged Photo, Art Style: Watercolor Sketch, Art Style: Digital Painting / Painterly Realism, Art Style: Ink Sketch / Line Art, Art Style: Vintage/Aged Photograph, Character Creation System, Gender: Female (Femme) (+66 more)

### Community 1 - "Système de Combat"
Cohesion: 0.09
Nodes (65): _afficherActionsControleMJ(), _afficherBuffsGroupe(), _afficherEnnemis(), afficherEtatCombat(), _afficherJoueurs(), _afficherOrdreTour(), _afficherPanneauActions(), _afficherPanneauInvoque() (+57 more)

### Community 2 - "Exploration Donjon"
Cohesion: 0.08
Nodes (65): _afficherActionsHorsCombatDonjon(), _afficherBandeauRencontre(), _afficherDecouverteDonjon(), afficherEtatDonjon(), _afficherGrilleDonjon(), _afficherLogDonjon(), _afficherModalCoffre(), _afficherModalPiegeDetecte() (+57 more)

### Community 3 - "Codex & Interface MJ"
Cohesion: 0.04
Nodes (41): ajouterLigneCodexMJ(), _creerGrilleDonjon(), genererContenuCodexMJ(), genererEnnemisCodexMJ(), genererMusiquesMJ_Integrated(), genererNPCsMJ(), mjActiverQuete(), _mjAfficherBuilderDonjon() (+33 more)

### Community 4 - "Personnage & Crafting"
Cohesion: 0.06
Nodes (48): quitterEcranCombat(), verifierBoutonCraft(), buildChar(), changerPhotoSelection(), creerPersonnageTest(), nouveauPersonnage(), rafraichirApercuAvatar(), resetEtRafraichir() (+40 more)

### Community 5 - "Mécaniques Clés (Firebase, Initiative, Magie)"
Cohesion: 0.06
Nodes (40): Brouillard de Guerre (flood-fill), Effets Actifs (effets_actifs, temporaire, toursRestants), Firebase Sync Temps RÃ©el, Frise d'Initiative (ordre de jeu), RÃ´le MJ (MaÃ®tre du Jeu), ROLL de RÃ©sistance UnifiÃ© (d100+IN vs d100+IN+RM), ArcanumRP Patch Notes, BÃ©nÃ©dictions & MalÃ©dictions MJâ†’Joueur (v0.6) (+32 more)

### Community 6 - "Multijoueur Firebase"
Cohesion: 0.1
Nodes (27): activerEcouteurAlertesMJ(), activerEcouteurArgent(), activerEcouteurCadeaux(), activerEcouteurCombat(), activerEcouteurCombatLog(), activerEcouteurCommandesMJ(), activerEcouteurCompagnons(), activerEcouteurDeplacementGroupe() (+19 more)

### Community 7 - "Stats & Compétences"
Cohesion: 0.13
Nodes (26): boostVital(), calculerAlignement(), initCompetencesUI(), initMagieUI(), initTechUI(), levelUp(), modComp(), modMagie() (+18 more)

### Community 8 - "Carte du Monde & Lieux"
Cohesion: 0.1
Nodes (29): Carte du Monde d'Arcanum (Full), Carte du Monde d'Arcanum (Standard), Arbalah - Isolated Rural Homestead, Cendrebourg - Industrial Harbor City, Crash Site - Wrecked Airship, Ile des Demi-Ogres - Ogre-Human Hybrid Island, Dernholm - Industrial Steampunk City with River, Ile du DÃ©sespoir - Criminal Exile Island Prison (+21 more)

### Community 9 - "Inventaire & Crafting"
Cohesion: 0.13
Nodes (21): compterObjet(), _compterObjetCombine(), fabriquerObjet(), fabriquerObjetCombine(), ouvrirEcranCraft(), _retirerObjetCombine(), trouverIdParNom(), _incStatPartie() (+13 more)

### Community 10 - "Création de Personnage"
Cohesion: 0.1
Nodes (25): Character Creation System, Portrait Selection System, Demi-Elfe Female Gender Group, Demi-Elfe Male Gender Group, Demi-Ogre Male Gender Group, Bedokien Portrait 01 â€“ Reptilian, copper-scaled, raptor-like head, stylized digital art, Bedokien Portrait 02 â€“ Pale green lizard-like face, wide amber eyes, painterly style, Bedokien Portrait 03 â€“ Dark scaled dragonoid face, open maw with teeth, dark tones (+17 more)

### Community 11 - "Magie & Invocations"
Cohesion: 0.24
Nodes (12): _creerEntreeInvoque(), _descStatsItem(), fermerModaleEtUpdate(), finaliserMagieCible(), _getInvocationParAlign(), getSortsConnus(), _lancerAnimalHorsCombat(), _lancerFamilierHorsCombat() (+4 more)

### Community 12 - "Navigation Monde"
Cohesion: 0.29
Nodes (4): deplacerVers(), mjDecouvrirLieu(), ouvrirCarte(), rafraichirPointsCarte()

### Community 13 - "Portraits Demi-Orque"
Cohesion: 0.5
Nodes (5): Demi-Orque Female Gender Group, Demi-Orque Female Portrait 01 â€“ Dark hair, slightly greenish tint to skin, intense dark eyes, painterly, Demi-Orque Female Portrait 02 â€“ Straight grey-streaked hair, stoic expression, cool pallid skin, painterly, Demi-Orque Female Portrait 03 â€“ Short dark hair, strong jaw, slightly greenish undertone, bold digital painting, Demi-Orque Female Portrait 04 â€“ Short dark hair, angular prominent cheekbones, cool-toned skin, painterly

### Community 14 - "Système Audio"
Cohesion: 0.5
Nodes (0): 

### Community 15 - "Items & Objets"
Cohesion: 0.67
Nodes (0): 

### Community 16 - "Arrière-Plans"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Quêtes"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Données Races"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Compétences"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Technologie"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Patch: Level Up"
Cohesion: 1.0
Nodes (1): Level Up - Soin Complet (v0.7)

### Community 22 - "Patch: Don Or"
Cohesion: 1.0
Nodes (1): Don d'Or via Modal (v0.7)

### Community 23 - "Patch: Actions Tour"
Cohesion: 1.0
Nodes (1): Armes & Sorts Rapides (actionsParTour)

### Community 24 - "Patch: Vol à la Tire"
Cohesion: 1.0
Nodes (1): Vol Ã  la Tire

## Ambiguous Edges - Review These
- `ArcanumRP Patch Notes` → `Manuel (PDF - non lisible)`  [AMBIGUOUS]
  docs/pdf/manuel.pdf · relation: semantically_similar_to
- `ArcanumRP Patch Notes` → `Races (PDF - non lisible)`  [AMBIGUOUS]
  docs/pdf/races.pdf · relation: semantically_similar_to
- `ArcanumRP Patch Notes` → `Schemas (PDF - non lisible)`  [AMBIGUOUS]
  docs/pdf/schemas.pdf · relation: semantically_similar_to
- `Refonte Sorts de Combat (v0.8)` → `Magies (PDF - non lisible)`  [AMBIGUOUS]
  docs/pdf/magies.pdf · relation: semantically_similar_to
- `SystÃ¨me de Donjon - Nouveau (v0.6)` → `Carte (PDF - non lisible)`  [AMBIGUOUS]
  docs/pdf/carte.pdf · relation: semantically_similar_to
- `Les Montagnes Grises` → `Eau Dormante - Small Snowy Town with Water Giant Statue`  [AMBIGUOUS]
  docs/img/fonds/eaudor.jpg · relation: conceptually_related_to
- `Les Landes de Vendigroth` → `Ile du DÃ©sespoir - Criminal Exile Island Prison`  [AMBIGUOUS]
  docs/img/fonds/desespoir.jpg · relation: conceptually_related_to
- `Dark Elf Female Portrait 01` → `Dark Elf Female Portrait 04`  [AMBIGUOUS]
  docs/img/portraits/elfenoire/Femme · relation: semantically_similar_to

## Knowledge Gaps
- **39 isolated node(s):** `CatÃ©gories de SuccÃ¨s (57 succÃ¨s)`, `Stats de Partie TrackÃ©es`, `Refonte Codex CatÃ©gories Objets (v0.9)`, `Sorts DÃ©gÃ¢ts & Effets Secondaires`, `DÃ©tection de PiÃ¨ges (v0.8)` (+34 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Arrière-Plans`** (1 nodes): `backgrounds.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Quêtes`** (1 nodes): `quetes.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Données Races`** (1 nodes): `racesData.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Compétences`** (1 nodes): `skills.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Technologie`** (1 nodes): `technologie.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Patch: Level Up`** (1 nodes): `Level Up - Soin Complet (v0.7)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Patch: Don Or`** (1 nodes): `Don d'Or via Modal (v0.7)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Patch: Actions Tour`** (1 nodes): `Armes & Sorts Rapides (actionsParTour)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Patch: Vol à la Tire`** (1 nodes): `Vol Ã  la Tire`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `ArcanumRP Patch Notes` and `Manuel (PDF - non lisible)`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `ArcanumRP Patch Notes` and `Races (PDF - non lisible)`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `ArcanumRP Patch Notes` and `Schemas (PDF - non lisible)`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `Refonte Sorts de Combat (v0.8)` and `Magies (PDF - non lisible)`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `SystÃ¨me de Donjon - Nouveau (v0.6)` and `Carte (PDF - non lisible)`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `Les Montagnes Grises` and `Eau Dormante - Small Snowy Town with Water Giant Statue`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Les Landes de Vendigroth` and `Ile du DÃ©sespoir - Criminal Exile Island Prison`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._