const magieData = {
    "Déplacement": {
        desc: "Les arcanes du Déplacement regroupent les sortilèges liés aux mouvements et aux déplacements d'",
        sorts: [
            { nom: "Désarmement", niv: 1, int: 6, cout: 2, implemente: true, desc: " Force la cible à lâcher son arme si elle échoue à résister." },
            { nom: "Déverrouillage", niv: 1, int: 9, cout: 5, deverrouillage: true, desc: "Ouvre magiquement les portes et coffres verrouillés (IN×5% de chance, donjon uniquement)." },
            { nom: "Choc", niv: 5, int: 12, cout: 10, degats: 2, desc: "Repousse violemment une cible en arrière." },
            { nom: "Distorsion spatiale", niv: 10, int: 15, cout: 10, buffPersistant: true, desc: "Téléporte un allié : il jouera en PREMIER ou en DERNIER au prochain round (choix)." },
            { nom: "Téléportation", niv: 15, int: 18, cout: 20, desc: "Vous transporte instantanément vers un lieu déjà visité." }
        ]
    },
    "Divination": {
        desc: "Sortilèges permettant d'obtenir des informations ou des connaissances.",
        sorts: [
            { nom: "Détection de l'alignement", niv: 1, int: 6, cout: 2, desc: "Révèle l’alignement d’une créature." },
            { nom: "Perception du contenu", niv: 1, int: 9, cout: 2, desc: "Permet de voir l’inventaire de la cible." },
            { nom: "Perception de l'aura", niv: 5, int: 12, cout: 5, desc: "Révèle certains attributs cachés de la cible." },
            { nom: "Détection de l'invisible", niv: 10, int: 15, cout: 10, implemente: true, desc: "Permet de voir créatures et objets invisibles." },
            { nom: "Identification", niv: 15, int: 18, cout: 15, implemente: true, desc: "Identifie toutes les propriétés magiques d’un objet." }
        ]
    },
    "Air": {
        desc: "Ecole basée sur la manipulation de l’élément air. La plupart des sorts sont surtout défensif, mais il y a quelques sort plus ou moins offensifs.",
        sorts: [
            { nom: "Vitalité de l'Air", niv: 1, int: 6, cout: 5, desc: "Augmente la constitution de la cible pendant 3 tours.", buffStat: "CN", buffVal: 3, buffDuree: 3, rapide: true },
            { nom: "Vapeurs toxiques", niv: 1, int: 9, cout: 5, degats: 4,desc: "Crée un nuage de gaz qui inflige des dégâts si la cible ne résiste pas." },
            { nom: "Rafale de vent", niv: 5, int: 12, cout: 10, degats: 8,desc: "Génère une rafale qui projette objets et créatures." },
            { nom: "Incarnation d'Air", niv: 10, int: 15, cout: 15, buffPersistant: true, desc: "+30 esquive et −20% dégâts physiques pendant 3 tours." },
            { nom: "Appel d’un élémentaire de l’Air", niv: 15, int: 18, cout: 20, invocation: true, invocationId: "elem_air", desc: "Invoque un elementaire d’Air allie (98 PV)." }
        ]
    },
    "Terre": { 
        desc: "Sortilèges basés sur la terre et la roche.", 
        sorts: [
            { nom: "Force de la Terre", niv: 1, int: 6, cout: 5, desc: "Augmente la force de la cible pendant 3 tours.", buffStat: "FO", buffVal: 3, buffDuree: 3, rapide: true },
            { nom: "Projectile de pierre", niv: 1, int: 9, cout: 5, degats: 8, desc: "Lance un projectile de pierre infligeant des dégâts." }, 
            { nom: "Mur de pierres", niv: 5, int: 12, cout: 10, buffGroupe: true, cout_par_tour: 2, desc: "Réduit de 20% les dégâts physiques reçus par le groupe." },
            { nom: "Incarnation de Pierre", niv: 10, int: 15, cout: 15, buffPersistant: true, desc: "−30% dégâts physiques et −20% dégâts magiques pendant 3 tours." },
            { nom: "Appel d’un élémentaire de Terre", niv: 15, int: 18, cout: 20, invocation: true, invocationId: "elem_terre", desc: "Invoque un elementaire de Terre allie (122 PV)." }
        ] 
    },
    "Feu": { 
        desc: "Sortilèges basés sur le feu et la chaleur.", 
        sorts: [
            { nom: "Agilité du Feu", niv: 1, int: 6, cout: 5, desc: "Augmente la dextérité de la cible pendant 3 tours.", buffStat: "DX", buffVal: 3, buffDuree: 3, rapide: true },
            { nom: "Mur de feu", niv: 1, int: 9, cout: 5, buffGroupe: true, cout_par_tour: 1, desc: "Inflige des dégâts de feu en retour à chaque attaque ennemie en mêlée." },
            { nom: "Boule de feu", niv: 5, int: 12, cout: 10, degats: 15, desc: "Lance une boule de feu infligeant de lourds dégâts." }, 
            { nom: "Incarnation de Feu", niv: 10, int: 15, cout: 15, buffPersistant: true, desc: "Riposte automatique en feu (30% des dégâts reçus) pendant 3 tours." },
            { nom: "Appel d’un élémentaire de Feu", niv: 15, int: 18, cout: 20, invocation: true, invocationId: "elem_feu", desc: "Invoque un elementaire de Feu allie (98 PV, riposte feu)." }
        ] 
    },
    "Eau": { 
        desc: "Sortilèges basés sur l'eau et la glace.", 
        sorts: [
            { nom: "Pureté de l’Eau", niv: 1, int: 6, cout: 5, desc: "Améliore le charisme de la cible pendant 3 tours.", buffStat: "CH", buffVal: 3, buffDuree: 3, rapide: true },
            { nom: "Brouillard", niv: 1, int: 9, cout: 5, buffGroupe: true, cout_par_tour: 1, desc: "+20 points d'esquive pour tout le groupe." },
            { nom: "Fureur de glace", niv: 5, int: 12, cout: 10, degats: 15, desc: "Inflige des dégâts de glace." }, 
            { nom: "Incarnation d’Eau", niv: 10, int: 15, cout: 15, buffPersistant: true, desc: "+30 RM et +2 PV de régénération par tour pendant 3 tours." },
            { nom: "Appel d’un élémentaire de l’Eau", niv: 15, int: 18, cout: 20, invocation: true, invocationId: "elem_eau", desc: "Invoque un elementaire d’Eau allie (98 PV, soin 2 PV/tour)." }
        ] 
    },
    "Energie": { 
        desc: "Manipulation des énergies cosmiques pures.", 
        sorts: [
            { nom: "Bouclier de protection", niv: 1, int: 6, cout: 5, buffPersistant: true, desc: "-25% dégâts physiques, se brise au premier coup reçu." },
            { nom: "Choc électrique", niv: 1, int: 9, cout: 5, degats: 10,desc: "Inflige des dégâts électriques à la cible." }, 
            { nom: "Mur de force", niv: 5, int: 12, cout: 10, buffGroupe: true, cout_par_tour: 2, desc: "Réduit de 20% les dégâts physiques reçus par le groupe." },
            { nom: "Eclair", niv: 10, int: 15, cout: 15, degats: 30 ,desc: "Lance un éclair qui inflige de lourds dégâts à la cible." }, 
            { nom: "Désintégration", niv: 15, int: 18, cout: 20, degats: 999 ,desc: "Détruit la cible instantanément si le sort réussit." }
        ] 
    },
    "Mental": { 
        desc: "Contrôler l'esprit d'une cible faible.", 
        sorts: [
            { nom: "Charme", niv: 1, int: 6, cout: 5, implemente: true, desc: "Améliore la réaction de la cible envers le lanceur." },
            { nom: "Étourdissement", niv: 1, int: 9, cout: 5, implemente: true, desc: "Étourdit la cible et l’empêche d’agir pendant quelques secondes." },
            { nom: "Absorption de la volonté", niv: 5, int: 12, cout: 10, implemente: true, desc: "Réduit fortement la volonté de la cible pendant la durée du sort." },
            { nom: "Cauchemar", niv: 10, int: 15, cout: 15, implemente: true, desc: "Terrifie les créatures proches qui tentent de fuir." },
            { nom: "Domination", niv: 15, int: 18, cout: 20, implemente: true, desc: "Permet de contrôler totalement l’esprit de la cible." }
        ] 
    },
    "Méta": { 
        desc: "Sortilèges qui ont la primauté sur les autres sortilèges.", 
        sorts: [
            { nom: "Résistance aux sortilèges", niv: 1, int: 6, cout: 5, buffPersistant: true, desc: "+25 RM pendant 3 tours." },
            { nom: "Dissipation des sortilèges", niv: 1, int: 9, cout: 5, implemente: true, desc: "Supprime les sorts actifs sur une cible." },
            { nom: "Bouclier mystique", niv: 5, int: 12, cout: 10, buffGroupe: true, cout_par_tour: 2, desc: "Réduit de 20% les dégâts magiques reçus par le groupe." },
            { nom: "Entrave aux sortilèges", niv: 10, int: 15, cout: 15, implemente: true, desc: "Empêche la cible de lancer des sorts." },
            { nom: "Bouclier de réflexion", niv: 15, int: 18, cout: 20, buffPersistant: true, desc: "Réfléchit la prochaine attaque magique reçue vers son lanceur (se brise après usage)." }
        ] 
    },
    "Transformation": { 
        desc: "Modifier la structure matérielle d'une cible.", 
        sorts: [
            { nom: "Main de fer", niv: 1, int: 6, cout: 5, desc: "Augmente fortement la force de la cible pendant 3 tours.", buffStat: "FO", buffVal: 5, buffDuree: 3, rapide: true },
            { nom: "Faiblesse", niv: 1, int: 9, cout: 5, implemente: true, desc: "Diminue les caractéristiques physiques de la cible." },
            { nom: "Rétrécissement", niv: 5, int: 12, cout: 10, implemente: true, desc: "Réduit la taille de la cible." },
            { nom: "Pétrification", niv: 10, int: 15, cout: 15, implemente: true, desc: "Transforme la cible en pierre." },
            { nom: "Polymorphie", niv: 15, int: 18, cout: 20, desc: "Transforme la cible en une autre créature." }
        ] 
    },
    "Nature": { 
        desc: "Manipuler les plantes, animaux et forces naturelles.", 
        sorts: [
            { nom: "Charmer les animaux", niv: 1, int: 6, cout: 5, implemente: true, desc: "Rend les animaux amicaux envers le lanceur." },
            { nom: "Enchevêtrement", niv: 1, int: 9, cout: 5, implemente: true, desc: "Immobilise la cible avec des plantes." },
            { nom: "Contrôler les animaux", niv: 5, int: 12, cout: 10, implemente: true, desc: "Permet de contrôler les animaux proches." },
            { nom: "Appeler les animaux", niv: 10, int: 15, cout: 15, invocation: true, invocationId: "animal_align", desc: "Invoque un animal allie (stats selon votre alignement magique)." },
            { nom: "Régénération", niv: 15, int: 18, cout: 20, buffGroupe: true, cout_par_tour: 3, desc: "+3 PV à tous les alliés au début de chacun de leur tour." }
        ] 
    },
    "Nécromancie noire": { 
        desc: "Ecole basée sur la modification de la vie, négativement. Très intéressant à bas niveau, puisque c’est ici que vous apprendrez le seul sort offensif de 1er niveau.", 
        sorts: [
            { nom: "Blessure ", niv: 1, int: 6, cout: 3, degats: 6, desc: "diminue la vie de la cible.", rapide: true },
            { nom: "Rappel d’un esprit", niv: 1, int: 9, cout: 5, desc: "Permet de parler à l’esprit d’un cadavre." }, 
            { nom: "Invocation de morts-vivants", niv: 5, int: 12, cout: 10, invocation: true, invocationId: "mort_vivant_align", desc: "Invoque un mort-vivant allie (stats selon votre alignement magique)." },
            { nom: "Création de morts-vivants", niv: 10, int: 15, cout: 15, creationMortVivant: true, desc: "Reanime un ennemi mort qui combat pour vous." },
            { nom: "Suppression de la vie", niv: 15, int: 18, cout: 20,degats: 999, desc: "Tue instantanément la cible si le sort réussit." }
        ] 
    },
    "Nécromancie blanche": { 
        desc: "Affecte de façon positive la force vitale.", 
        sorts: [
            { nom: "Soins légers", niv: 1, int: 6, cout: 3,soin: 3, desc: "Soigne une petite quantité de points de vie." }, 
            { nom: "Antidote", niv: 1, int: 9, cout: 5, curePoison: true, desc: "Soigne les effets de poison." }, 
            { nom: "Soins importants", niv: 5, int: 12, cout: 10,soin: 15, desc: "Soigne une grande quantité de points de vie." }, 
            { nom: "Sanctuaire", niv: 10, int: 15, cout: 15, buffGroupe: true, cout_par_tour: 2, desc: "Les morts-vivants ne peuvent pas attaquer les membres du groupe." },
            { nom: "Résurrection", niv: 15, int: 18, cout: 20,soin: 999,resurrection: true, desc: "Ramène une cible à la vie." }
        ] 
    },
    "Illusion": { 
        desc: "Contrôler la lumière et les illusions.", 
        sorts: [
            { nom: "Illumination", niv: 1, int: 6, cout: 5, desc: "Augmente la luminosité autour de la cible." }, 
            { nom: "Flash", niv: 1, int: 9, cout: 5, implemente: true, desc: "Aveugle temporairement la cible." },
            { nom: "Occultation", niv: 5, int: 12, cout: 10, buffPersistant: true, desc: "-10% dégâts reçus et +10 esquive pendant 3 tours." },
            { nom: "Monstre illusoire", niv: 10, int: 15, cout: 15, implemente: true, desc: "Crée un monstre fictif que la cible croit réel." },
            { nom: "Invisibilité", niv: 15, int: 18, cout: 20, buffPersistant: true, desc: "Cible invisible (−4 FT/tour). Disparaît de la liste des cibles ennemies." }
        ] 
    },
    "Invocation": { 
        desc: "Invoquer des créatures.", 
        sorts: [
            { nom: "Nuée d’insectes", niv: 1, int: 6, cout: 5, degats: 3, nueeDInsectes: true, desc: "Degats legers + ralentit la cible de 25% pendant 2 tours." },
            { nom: "Champion orque", niv: 1, int: 9, cout: 8, invocation: true, invocationId: "champion_orc", desc: "Invoque un orque allie (47 PV) qui combat pour le lanceur." },
            { nom: "Ogre gardien", niv: 5, int: 12, cout: 12, invocation: true, invocationId: "ogre_gardien", desc: "Invoque un ogre allie (104 PV) qui combat pour le lanceur." },
            { nom: "Porte des Enfers", niv: 10, int: 15, cout: 16, invocation: true, invocationId: "porte_enfers", desc: "Invoque un demon allie (200 PV) qui combat pour le lanceur." },
            { nom: "Invocation d’un familier", niv: 15, int: 18, cout: 25, invocation: true, invocationId: "familier", estFamilier: true, desc: "Invoque un familier permanent (evolutif selon alignement). Castable hors combat." }
        ] 
    },
    "Temporel": { 
        desc: "Contrôler le cours du temps.", 
        sorts: [
            { nom: "Verrou magique", niv: 1, int: 6, cout: 2, desc: "Verouille une porte ou un coffre" }, 
            { nom: "Altération temporelle", niv: 1, int: 9, cout: 5, aoeEnnemi: true, cout_par_tour: 1, desc: "ROLL zone : ennemis ratant le jet ont leur vitesse réduite de 50%. Coût FT/tour, annulable." }, 
            { nom: "Hâte", niv: 5, int: 12, cout: 10, buffPersistant: true, desc: "Vitesse ×2 pendant 3 tours." },
            { nom: "Stase", niv: 10, int: 15, cout: 15, implemente: true, desc: "Immobilise totalement une cible." },
            { nom: "Tempus Fugit", niv: 15, int: 18, cout: 20, aoeEnnemi: true, cout_par_tour: 4, desc: "Alliés ×3 vitesse. ROLL zone sur ennemis : vitesse /2 si raté. Coût FT/tour, annulable." }
        ] 
    }
};



// ==========================================
// DONNÉES DES CRÉATURES INVOCABLES
// ==========================================

const _INVOCATIONS_DATA = {
    champion_orc: {
        nom: "Champion orque", race: "orque", niveau: 5,
        pv: 47, ft: 47,
        stats: { FO: 11, CN: 11, DX: 8, IN: 2, CH: 2 },
        res:  { physique: 0, magie: 0, feu: 0, poison: 35, elec: 0 }
    },
    ogre_gardien: {
        nom: "Ogre gardien", race: "ogre", niveau: 8,
        pv: 104, ft: 96,
        stats: { FO: 23, CN: 12, DX: 11, IN: 1, CH: 7 },
        res:  { physique: 38, magie: 0, feu: 10, poison: 40, elec: -20 }
    },
    porte_enfers: {
        nom: "Demon invoque", race: "demon", niveau: 12,
        pv: 200, ft: 98,
        stats: { FO: 20, CN: 14, DX: 15, IN: 11, CH: 3 },
        res:  { physique: 20, magie: 30, feu: 40, poison: 80, elec: 25 }
    },
    elem_air: {
        nom: "Elementaire d'Air", race: "elementaire", niveau: 35,
        pv: 98, ft: 50,
        stats: { FO: 6, CN: 12, DX: 14, IN: 7, CH: 2 },
        res:  { physique: 0, magie: 50, feu: 0, poison: 20, elec: 0 },
        esquiveInnee: 15,
        sortsConnus: ["Désarmement", "Choc"]
    },
    elem_terre: {
        nom: "Elementaire de Terre", race: "elementaire", niveau: 35,
        pv: 122, ft: 50,
        stats: { FO: 6, CN: 18, DX: 4, IN: 4, CH: 5 },
        res:  { physique: 75, magie: 0, feu: 0, poison: 50, elec: 0 }
    },
    elem_feu: {
        nom: "Elementaire de Feu", race: "elementaire", niveau: 35,
        pv: 98, ft: 50,
        stats: { FO: 12, CN: 8, DX: 18, IN: 7, CH: 4 },
        res:  { physique: 0, magie: 0, feu: 100, poison: 0, elec: 0 },
        riposteFeu: true
    },
    elem_eau: {
        nom: "Elementaire d'Eau", race: "elementaire", niveau: 35,
        pv: 98, ft: 50,
        stats: { FO: 10, CN: 14, DX: 12, IN: 7, CH: 2 },
        res:  { physique: 10, magie: 30, feu: 0, poison: 30, elec: -60 },
        soinsParTour: 2,
        sortsConnus: ["Purete d'ondine"]
    },
    mort_vivant_align: [
        { nom: "Soldat mort",         race: "mort-vivant", niveau: 5,  pv: 34,  ft: 47, stats: { FO: 11, CN: 12, DX: 8,  IN: 2,  CH: 2 }, res: { physique: 0,  magie: 0,  feu: 0,  poison: 140, elec: 0  }, alignMin: -100, alignMax: 25  },
        { nom: "Combattant enrage",   race: "mort-vivant", niveau: 8,  pv: 80,  ft: 56, stats: { FO: 16, CN: 13, DX: 11, IN: 12, CH: 1 }, res: { physique: 40, magie: 40, feu: 40, poison: 85,  elec: 40 }, alignMin: 26,   alignMax: 60  },
        { nom: "Guerrier squelette",  race: "mort-vivant", niveau: 10, pv: 63,  ft: 59, stats: { FO: 12, CN: 10, DX: 13, IN: 5,  CH: 2 }, res: { physique: 30, magie: 30, feu: 30, poison: 60,  elec: 30 }, alignMin: 61,   alignMax: 85  },
        { nom: "Champion mort-vivant",race: "mort-vivant", niveau: 12, pv: 75,  ft: 79, stats: { FO: 11, CN: 13, DX: 17, IN: 8,  CH: 5 }, res: { physique: 60, magie: 10, feu: 25, poison: 70,  elec: 25 }, alignMin: 86,   alignMax: 100 }
    ],
    familier: [
        { nom: "Familier subalterne",      race: "familier", niveau: 1, pv: 29,  ft: 29,  stats: { FO: 5,  CN: 5,  DX: 9,  IN: 3, CH: 3 }, res: { physique: 10, magie: 10, feu: 10, poison: 15, elec: 10 }, alignMin: -100, alignMax: 25  },
        { nom: "Familier",                 race: "familier", niveau: 1, pv: 47,  ft: 43,  stats: { FO: 9,  CN: 7,  DX: 1,  IN: 3, CH: 3 }, res: { physique: 15, magie: 15, feu: 15, poison: 30, elec: 15 }, alignMin: 26,   alignMax: 50  },
        { nom: "Familier Slasher",         race: "familier", niveau: 1, pv: 75,  ft: 69,  stats: { FO: 13, CN: 10, DX: 16, IN: 3, CH: 3 }, res: { physique: 20, magie: 20, feu: 20, poison: 50, elec: 20 }, alignMin: 51,   alignMax: 75  },
        { nom: "Familier Griffe-sanglante",race: "familier", niveau: 1, pv: 111, ft: 105, stats: { FO: 16, CN: 13, DX: 18, IN: 3, CH: 3 }, res: { physique: 30, magie: 30, feu: 30, poison: 75, elec: 30 }, alignMin: 76,   alignMax: 100 }
    ],
    animal_align: [
        { nom: "Loup",            race: "animal", niveau: 3,  pv: 34,  ft: 34,  stats: { FO: 11, CN: 9,  DX: 13, IN: 5,  CH: 3  }, res: { physique: 0,  magie: 0,  feu: 0,  poison: 25, elec: 0  }, alignMin: -100, alignMax: 20  },
        { nom: "Cougar",          race: "animal", niveau: 4,  pv: 30,  ft: 36,  stats: { FO: 8,  CN: 9,  DX: 14, IN: 3,  CH: 6  }, res: { physique: 0,  magie: 0,  feu: 0,  poison: 25, elec: 0  }, alignMin: 21,   alignMax: 40  },
        { nom: "Tigre",           race: "animal", niveau: 6,  pv: 30,  ft: 48,  stats: { FO: 10, CN: 12, DX: 14, IN: 6,  CH: 11 }, res: { physique: 0,  magie: 0,  feu: 0,  poison: 40, elec: 0  }, alignMin: 41,   alignMax: 55  },
        { nom: "Grizzly",         race: "animal", niveau: 8,  pv: 58,  ft: 74,  stats: { FO: 14, CN: 16, DX: 10, IN: 5,  CH: 8  }, res: { physique: 30, magie: 10, feu: 30, poison: 90, elec: 30 }, alignMin: 56,   alignMax: 70  },
        { nom: "Gorille forestier",race: "animal", niveau: 10, pv: 62,  ft: 70,  stats: { FO: 14, CN: 12, DX: 16, IN: 7,  CH: 7  }, res: { physique: 50, magie: 0,  feu: 50, poison: 90, elec: 50 }, alignMin: 71,   alignMax: 95  },
        { nom: "Lapin Vorpal",    race: "animal", niveau: 15, pv: 108, ft: 139, stats: { FO: 14, CN: 18, DX: 17, IN: 18, CH: 14 }, res: { physique: 0,  magie: 0,  feu: 0,  poison: 70, elec: 0  }, alignMin: 96,   alignMax: 100, sortsConnus: ["Bouclier de protection", "Choc électrique"] }
    ]
};

/** Retourne la bonne variante d'une invocation selon l'alignement du lanceur. */
function _getInvocationParAlign(invocationId, align) {
    const table = _INVOCATIONS_DATA[invocationId];
    if (!Array.isArray(table)) return table;
    return table.find(v => align >= v.alignMin && align <= v.alignMax) || table[0];
}

/** Construit l'entrée ordre_jeu pour un invoqué. */
function _creerEntreeInvoque(modele, invocateurId, invocateurNom) {
    const instanceId = Date.now();
    return {
        type:          "invoque",
        instanceId,
        id:            "invoque_" + instanceId,
        nom:           modele.nom,
        race:          modele.race || "",
        niveau:        modele.niveau || 1,
        invocateurId,
        invocateurNom,
        vitesse:       modele.stats.DX,
        pvActuel:      modele.pv,
        pvMax:         modele.pv,
        ftActuel:      modele.ft,
        ftMax:         modele.ft,
        stats:         modele.stats,
        res:           modele.res || {},
        sortsConnus:   modele.sortsConnus || [],
        riposteFeu:    modele.riposteFeu  || false,
        soinsParTour:  modele.soinsParTour || 0,
        esquiveInnee:  modele.esquiveInnee || 0,
        ko:            false
    };
}

/** Invoque un familier hors combat et le stocke dans Firebase. */
function _lancerFamilierHorsCombat(coutReel, compIdx) {
    if (!sessionActuelle || !window.perso) return;
    const uid = window.perso.nom.replace(/\s+/g, '_');
    db.ref('parties/' + sessionActuelle + '/familiers/' + uid).once('value', function(snap) {
        const exist = snap.val();
        if (exist && exist.pvActuel > 0) {
            if (typeof _toast === 'function') _toast('🐾 Vous avez déjà un familier actif (' + exist.nom + ') !', 'warning');
            else alert('🐾 Vous avez déjà un familier actif (' + exist.nom + ') !');
            return;
        }
        const align = (compIdx !== null && compIdx !== undefined)
            ? (window.perso.compagnons[compIdx].alignementMagique || 0)
            : (perso.alignementMagique || 0);
        const modele = _getInvocationParAlign('familier', align);
        const entree = _creerEntreeInvoque(modele, uid, perso.nom);
        entree.estFamilier = true;
        if (compIdx !== null && compIdx !== undefined) {
            window.perso.compagnons[compIdx].ftActuel -= coutReel;
            if (typeof _syncCompagnonsSummary === 'function') _syncCompagnonsSummary();
        } else {
            perso.ftActuel -= coutReel;
        }
        db.ref('parties/' + sessionActuelle + '/familiers/' + uid).set(entree, function() {
            if (typeof _toast === 'function') _toast('🐾 Familier invoqué : ' + entree.nom + ' !', 'success');
            else alert('🐾 Familier invoqué : ' + entree.nom + ' !');
            if (typeof autoSave === 'function') autoSave();
            if (typeof rafraichirAccueil === 'function') rafraichirAccueil();
        });
    });
}

/** Invoque un animal compagnon hors combat et le stocke dans Firebase. */
function _lancerAnimalHorsCombat(coutReel, compIdx) {
    if (!sessionActuelle || !window.perso) return;
    const uid = window.perso.nom.replace(/\s+/g, '_');
    db.ref('parties/' + sessionActuelle + '/animaux/' + uid).once('value', function(snap) {
        const exist = snap.val();
        if (exist && exist.pvActuel > 0) {
            if (typeof _toast === 'function') _toast('🐺 Vous avez déjà un animal compagnon actif (' + exist.nom + ') !', 'warning');
            else alert('🐺 Vous avez déjà un animal compagnon actif (' + exist.nom + ') !');
            return;
        }
        const align = (compIdx !== null && compIdx !== undefined)
            ? (window.perso.compagnons[compIdx].alignementMagique || 0)
            : (perso.alignementMagique || 0);
        const modele = _getInvocationParAlign('animal_align', align);
        const entree = _creerEntreeInvoque(modele, uid, perso.nom);
        if (compIdx !== null && compIdx !== undefined) {
            window.perso.compagnons[compIdx].ftActuel -= coutReel;
            if (typeof _syncCompagnonsSummary === 'function') _syncCompagnonsSummary();
        } else {
            perso.ftActuel -= coutReel;
        }
        db.ref('parties/' + sessionActuelle + '/animaux/' + uid).set(entree, function() {
            if (typeof _toast === 'function') _toast('🐺 Animal invoqué : ' + entree.nom + ' !', 'success');
            else alert('🐺 Animal invoqué : ' + entree.nom + ' !');
            if (typeof autoSave === 'function') autoSave();
            if (typeof rafraichirAccueil === 'function') rafraichirAccueil();
        });
    });
}

// ==========================================
// SYSTÈME DE GRIMOIRE ET LANCEMENT DE SORTS
// ==========================================

// Fonction pour fouiller dans les catégories et trouver les stats du sort
function trouverSort(nomSortCherche) {
    if (typeof magieData === 'undefined') return null;
    
    for (let ecole in magieData) {
        let listeSorts = magieData[ecole].sorts;
        if (listeSorts) {
            for (let i = 0; i < listeSorts.length; i++) {
                if (listeSorts[i].nom === nomSortCherche) {
                    return listeSorts[i]; // Sort trouvé !
                }
            }
        }
    }
    return null; // Sort introuvable
}

// Transforme les points de magie (base + investis) en liste de sorts jouables
function getSortsConnus() {
    let sortsAppris = [];
    if (typeof magieData === 'undefined') return sortsAppris;

    // Fusionne magieBase et magieInvesties (prend le max de chaque école)
    const niveauxParEcole = {};
    for (let ecole in (perso.magieBase || {})) {
        niveauxParEcole[ecole] = Math.max(niveauxParEcole[ecole] || 0, parseInt(perso.magieBase[ecole]) || 0);
    }
    for (let ecole in (perso.magieInvesties || {})) {
        niveauxParEcole[ecole] = Math.max(niveauxParEcole[ecole] || 0, parseInt(perso.magieInvesties[ecole]) || 0);
    }

    for (let ecole in niveauxParEcole) {
        let niveau = niveauxParEcole[ecole];
        if (niveau > 0 && magieData[ecole]?.sorts) {
            for (let i = 0; i < niveau; i++) {
                if (magieData[ecole].sorts[i]) sortsAppris.push(magieData[ecole].sorts[i].nom);
            }
        }
    }
    return sortsAppris;
}

// Ouvre l'interface du grimoire sur l'accueil
function ouvrirMagieAccueil() {
    if (typeof cacherTout === "function") cacherTout();

    const ecranMagie = document.getElementById('ecran-magie-accueil');
    if (ecranMagie) ecranMagie.style.display = 'block';

    const maxFT = (perso.statsBase.CN * 2) + (perso.statsBase.IN) + (perso.boostFT || 0);
    if (perso.ftActuel === undefined) perso.ftActuel = maxFT;
    document.getElementById('val-ft-magie').innerText = perso.ftActuel;
    document.getElementById('val-ft-max-magie').innerText = maxFT;

    const container = document.getElementById('liste-sorts-accueil');
    if (!container) return;
    container.innerHTML = "";

    const _iconsEcole = {"Déplacement":"🌀","Divination":"👁️","Air":"💨","Terre":"🪨","Feu":"🔥","Eau":"💧","Energie":"⚡","Mental":"🧠","Méta":"💠","Transformation":"🦋","Nature":"🌿","Nécromancie noire":"💀","Nécromancie blanche":"🕊️","Illusion":"🎭","Invocation":"👹","Temporel":"⏳"};

    const _sortHtml = (data, ftSource, onclickCall, couleurBord, couleurFond) => {
        const coutReel = parseInt(data.cout, 10) || 0;
        // Utile hors combat : soin, rez, cure poison, dégâts directs, familier
        const utileHorsCombat = !!(data.soin || data.resurrection || data.curePoison
            || data.degats || data.estFamilier);
        const peutLancer = utileHorsCombat && (ftSource >= coutReel);
        if (!utileHorsCombat) {
            // Grisé + petit
            return `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 8px;border-radius:5px;margin-bottom:4px;opacity:0.35;">
                <span style="color:#666;font-size:0.8em;">${data.nom} <span style="color:#444;">(${coutReel} FT)</span></span>
                <span style="color:#444;font-size:0.75em;">⚔ Combat</span>
            </div>`;
        }
        const btnLabel = ftSource < coutReel ? '❌ Épuisé' : '✨ Lancer';
        return `
            <div style="background: ${couleurFond}; border: 1px solid ${couleurBord}; padding: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div style="flex: 1;">
                    <strong style="color: #d1c4e9;">${data.nom}</strong><br>
                    <small style="color: #9575cd; font-style: italic;">Coût : ${coutReel} FT</small>
                </div>
                <button onclick="${peutLancer ? onclickCall : ''}"
                    style="background: ${peutLancer ? couleurBord : '#444'}; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: ${peutLancer ? 'pointer' : 'not-allowed'};"
                    ${peutLancer ? '' : 'disabled'}>
                    ${btnLabel}
                </button>
            </div>`;
    };

    const _renderGrilleEcoles = (nomSection, sortsParEcole, ftSource, buildOnclick, couleurBord, couleurFond, prefixId) => {
        const couleurTitre = couleurBord === '#4caf50' ? '#a5d6a7' : '#9575cd';
        let html = `<p style="color:${couleurTitre};font-weight:bold;margin:4px 0 8px;">${nomSection}</p>`;
        // Grille de cases école
        html += `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:8px;">`;
        for (const ecole in sortsParEcole) {
            const icon = _iconsEcole[ecole] || '🪄';
            const eid  = prefixId + '_' + ecole.replace(/[^a-zA-Z0-9]/g, '_');
            const nb   = sortsParEcole[ecole].length;
            const nbUtil = sortsParEcole[ecole].filter(s =>
                (s.soin || s.resurrection || s.curePoison || s.degats || s.estFamilier) && ftSource >= (parseInt(s.cout,10)||0)
            ).length;
            const utilLabel = nbUtil > 0
                ? `<div style="color:#4caf50;font-size:0.75em;">✨ ${nbUtil} utilisable${nbUtil>1?'s':''}</div>`
                : `<div style="color:#555;font-size:0.75em;">— hors combat</div>`;
            html += `<button onclick="
                var all=document.querySelectorAll('[id^=\\'${prefixId}_\\']');
                all.forEach(function(el){if(el.id!=='${eid}')el.style.display='none';});
                var d=document.getElementById('${eid}');
                d.style.display=d.style.display==='none'?'block':'none';"
                style="background:#1a0f2a;color:#d1c4e9;border:1px solid ${couleurBord};border-radius:8px;
                       padding:8px 4px;cursor:pointer;text-align:center;font-size:0.82em;">
                <div style="font-size:1.4em;">${icon}</div>
                <div style="font-weight:bold;font-size:0.8em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${ecole}</div>
                <div style="color:#888;font-size:0.75em;">${nb} sort${nb>1?'s':''}</div>
                ${utilLabel}
            </button>`;
        }
        html += `</div>`;
        // Panneaux de sorts (cachés par défaut, un seul ouvert à la fois)
        for (const ecole in sortsParEcole) {
            const eid = prefixId + '_' + ecole.replace(/[^a-zA-Z0-9]/g, '_');
            html += `<div id="${eid}" style="display:none;border-left:2px solid ${couleurBord};padding-left:8px;margin-bottom:8px;">`;
            html += `<p style="color:${couleurTitre};font-size:0.85em;margin:4px 0 6px;">${_iconsEcole[ecole]||'🪄'} ${ecole}</p>`;
            sortsParEcole[ecole].forEach(data => {
                const nomSafe = data.nom.replace(/'/g, "\\'");
                html += _sortHtml(data, ftSource, buildOnclick(nomSafe), couleurBord, couleurFond);
            });
            html += `</div>`;
        }
        return html;
    };

    // --- SORTS DU JOUEUR (groupés par école) ---
    let mesSorts = getSortsConnus();
    if (mesSorts.length > 0 && typeof magieData !== 'undefined') {
        // Sorts rapides (dernier + plus lancé)
        const dernierSort = perso.stats_partie?.dernier_sort;
        const sortsParNom = perso.stats_partie?.sorts_par_nom || {};
        const bestEntry   = Object.entries(sortsParNom)
            .filter(([nom]) => { const s = (typeof trouverSort === 'function') ? trouverSort(nom) : null; return s && !!(s.soin || s.resurrection || s.curePoison || s.degats || s.estFamilier); })
            .sort((a, b) => b[1] - a[1])[0];
        const plusLance   = bestEntry ? bestEntry[0] : null;
        const plusLanceCnt = bestEntry ? bestEntry[1] : 0;

        const _raccourciSort = (label, nomSort, extra) => {
            if (!nomSort) return '';
            const s = (typeof trouverSort === 'function') ? trouverSort(nomSort) : null;
            const cout = s ? (parseInt(s.cout, 10) || 0) : 0;
            const peut = s && (perso.ftActuel >= cout)
                && !!(s.soin || s.resurrection || s.curePoison || s.degats || s.estFamilier);
            const nomSafe = nomSort.replace(/'/g, "\\'");
            return `<div style="background:#1a1a2a;border:1px solid #7c4dff;border-radius:6px;padding:7px 10px;margin-bottom:6px;font-size:0.85em;display:flex;justify-content:space-between;align-items:center;">
                <span>${label} <strong style="color:#ce93d8;">${nomSort}</strong>${extra ? `<span style="color:#666;font-size:0.8em;"> ${extra}</span>` : ''}</span>
                ${peut
                    ? `<button onclick="preparerEtLancerSort('${nomSafe}')" style="background:#673ab7;color:white;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:0.82em;">✨ Relancer</button>`
                    : `<span style="color:#555;font-size:0.8em;">${s ? (perso.ftActuel < cout ? '❌ Épuisé' : '⚔ Combat') : '—'}</span>`}
            </div>`;
        };

        if (dernierSort || plusLance) {
            container.innerHTML += _raccourciSort('🕐', dernierSort, '');
            if (plusLance && plusLance !== dernierSort) {
                container.innerHTML += _raccourciSort('🏆', plusLance, `×${plusLanceCnt}`);
            }
        }
        const ecolesSorts = {};
        for (const ecole in magieData) {
            magieData[ecole].sorts.forEach(s => {
                if (!mesSorts.includes(s.nom)) return;
                if (!ecolesSorts[ecole]) ecolesSorts[ecole] = [];
                ecolesSorts[ecole].push(s);
            });
        }
        container.innerHTML += _renderGrilleEcoles('✨ Vos sorts', ecolesSorts, perso.ftActuel,
            nomSafe => `preparerEtLancerSort('${nomSafe}')`, '#673ab7', '#2a1a3a', 'grim_joueur');
    }

    // --- SORTS DES COMPAGNONS ---
    const comps = window.perso?.compagnons || [];
    comps.forEach((comp, i) => {
        const sortComp = _getSortsConnus_comp(comp);
        if (sortComp.length === 0) return;
        const ftMaxComp = (comp.statsBase?.CN || 5) * 2 + (comp.statsBase?.IN || 5) + (comp.boostFT || 0);
        const ftComp = comp.ftActuel !== undefined ? comp.ftActuel : ftMaxComp;
        const ecolesComp = {};
        if (typeof magieData !== 'undefined') {
            for (const ecole in magieData) {
                magieData[ecole].sorts.forEach(s => {
                    if (!sortComp.includes(s.nom)) return;
                    if (!ecolesComp[ecole]) ecolesComp[ecole] = [];
                    ecolesComp[ecole].push(s);
                });
            }
        }
        container.innerHTML += `<hr style="border:0;border-top:1px solid #333;margin:8px 0;">`;
        container.innerHTML += _renderGrilleEcoles(`🤝 ${comp.nom} — FT ${ftComp}/${ftMaxComp}`, ecolesComp, ftComp,
            nomSafe => `preparerEtLancerSort('${nomSafe}', ${i})`, '#4caf50', '#1a2a1a', 'grim_comp' + i);
    });

    if (mesSorts.length === 0 && comps.every(c => _getSortsConnus_comp(c).length === 0)) {
        container.innerHTML = "<p style='color:#666; text-align:center;'>Aucun sort connu.</p>";
    }
}



function mettreAJourListeCibles() {
    const groupeSorts = document.getElementById('groupe-joueurs'); // Ta liste Magie
    const groupeObjets = document.getElementById('groupe-joueurs-inventaire'); // Ta liste Inventaire

    db.ref('parties/' + sessionActuelle + '/joueurs/').on('value', (snapshot) => {
        if (groupeSorts) groupeSorts.innerHTML = '';
        if (groupeObjets) groupeObjets.innerHTML = ''; 

        snapshot.forEach((child) => {
            const joueur = child.val();
            const joueurID = child.key;

            if (perso && joueur.nom !== perso.nom) {
                const option1 = document.createElement('option');
                option1.value = joueurID;
                option1.textContent = joueur.nom;

                const option2 = document.createElement('option');
                option2.value = joueurID;
                option2.textContent = joueur.nom;

                if (groupeSorts) groupeSorts.appendChild(option1);
                if (groupeObjets) groupeObjets.appendChild(option2);
            }
        });
    });
}

// Cette fonction remplace l'ancienne avec le prompt()
let sortEnCoursCible = null;
let sortSourceCompIdx = null; // null = joueur, number = index compagnon

// Retourne les sorts connus d'un compagnon (même logique que getSortsConnus pour le joueur)
function _getSortsConnus_comp(comp) {
    const sortsAppris = [];
    if (typeof magieData === 'undefined') return sortsAppris;
    const niveauxParEcole = {};
    for (let ecole in (comp.magieBase || {})) {
        niveauxParEcole[ecole] = Math.max(niveauxParEcole[ecole] || 0, parseInt(comp.magieBase[ecole]) || 0);
    }
    for (let ecole in (comp.magieInvesties || {})) {
        niveauxParEcole[ecole] = Math.max(niveauxParEcole[ecole] || 0, parseInt(comp.magieInvesties[ecole]) || 0);
    }
    for (let ecole in niveauxParEcole) {
        const niveau = niveauxParEcole[ecole];
        if (niveau > 0 && magieData[ecole]?.sorts) {
            for (let i = 0; i < niveau; i++) {
                if (magieData[ecole].sorts[i]) sortsAppris.push(magieData[ecole].sorts[i].nom);
            }
        }
    }
    return sortsAppris;
}

function preparerEtLancerSort(nomSort, compIdx) {
    const data = trouverSort(nomSort);
    if (!data) return;

    if (window.perso.pvActuel <= 0) {
        alert("💀 Un mort ne peut pas lancer de sorts !");
        return;
    }

    sortEnCoursCible = data;
    sortSourceCompIdx = (compIdx !== undefined && compIdx !== null) ? compIdx : null;

    // Bonus IN ≥ 20 : coût des sorts -10% (joueur seulement)
    const _inTotal = (perso?.statsBase?.IN || 0) + (perso?.statsInvesties?.IN || 0);
    const coutBase = parseInt(data.cout, 10) || 0;
    const coutReel = (compIdx === undefined || compIdx === null) && _inTotal >= 20
        ? Math.max(1, Math.floor(coutBase * 0.9))
        : coutBase;
    let ftSource, nomSource;
    if (sortSourceCompIdx !== null) {
        const comp = window.perso.compagnons[sortSourceCompIdx];
        const ftMaxComp = (comp.statsBase?.CN || 5) * 2 + (comp.statsBase?.IN || 5) + (comp.boostFT || 0);
        ftSource = comp.ftActuel !== undefined ? comp.ftActuel : ftMaxComp;
        nomSource = comp.nom;
    } else {
        ftSource = perso.ftActuel;
        nomSource = "Vous";
    }
    if (ftSource < coutReel) {
        alert(`💥 ${nomSource} est trop fatigué pour lancer ce sort !`);
        return;
    }

    // --- Identification d'objet ---
    if (data.nom === 'Identification') {
        const nonIdent = (perso.inventaire || []).map((it, i) => ({ it, i })).filter(({ it }) => it.identifie === false);
        if (nonIdent.length === 0) {
            alert("✨ Vous n'avez aucun objet non identifié.");
            return;
        }
        const liste = document.getElementById('liste-destinataires');
        const titre = document.querySelector('#modal-transfert h3') || document.querySelector('#modal-transfert .titre');
        if (titre) titre.innerText = "Identifier quel objet ?";
        liste.innerHTML = '';
        nonIdent.forEach(({ it, i }) => {
            const def = itemsData[it.id];
            const btn = document.createElement('button');
            btn.style.cssText = 'background:#2e1f4d;color:#ce93d8;border:1px solid #7c4dff;padding:10px;border-radius:5px;cursor:pointer;margin-bottom:5px;width:100%;';
            btn.textContent = '🔮 ' + (def?.nom || it.id);
            btn.onclick = () => {
                perso.inventaire[i].identifie = true;
                perso.ftActuel -= coutReel;
                if (typeof _incStatPartie === 'function') {
                    _incStatPartie('sorts_lances', 1);
                    if (!perso.stats_partie) perso.stats_partie = {};
                    perso.stats_partie.dernier_sort = data.nom;
                    if (!perso.stats_partie.sorts_par_nom) perso.stats_partie.sorts_par_nom = {};
                    perso.stats_partie.sorts_par_nom[data.nom] = (perso.stats_partie.sorts_par_nom[data.nom] || 0) + 1;
                }
                if (typeof autoSave === 'function') autoSave();
                if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
                document.getElementById('modal-transfert').style.display = 'none';
                alert("✨ " + (def?.nom || it.id) + " identifié ! " + _descStatsItem(def));
            };
            liste.appendChild(btn);
        });
        document.getElementById('modal-transfert').style.display = 'flex';
        return;
    }

    // --- Invocations hors combat ---
    if (data.estFamilier) {
        _lancerFamilierHorsCombat(coutReel, sortSourceCompIdx);
        return;
    }
    if (data.invocationId === "animal_align") {
        _lancerAnimalHorsCombat(coutReel, sortSourceCompIdx);
        return;
    }
    if (data.invocation) {
        alert("⚔️ Ce sort d'invocation ne peut être lancé qu'en combat !");
        return;
    }

    const moiID = perso.nom.replace(/\s+/g, '_');

    db.ref('parties/' + sessionActuelle + '/joueurs').once('value', (snapshot) => {
        const joueurs = snapshot.val();
        const liste = document.getElementById('liste-destinataires');
        const titre = document.querySelector('#modal-transfert h3') || document.querySelector('#modal-transfert .titre');

        if (titre) titre.innerText = sortSourceCompIdx !== null
            ? `Lancer ${data.nom} (${nomSource}) sur :`
            : `Lancer ${data.nom} sur :`;
        liste.innerHTML = "";

        // ⚔️ BOUTON ENNEMI (Ajouté ici)
        liste.innerHTML += `
            <button onclick="finaliserMagieCible('ennemi', 'l\\'Ennemi')" 
                style="background:#8b0000; color:white; padding:12px; border:2px solid #ff5252; border-radius:5px; cursor:pointer; margin-bottom:10px; width:100%; font-weight:bold;">
                ⚔️ CIBLE ENNEMIE
            </button>
            <hr style="border:0; border-top:1px solid #444; margin-bottom:10px;">
        `;

        // ✨ Bouton pour soi-même
        liste.innerHTML += `<button onclick="finaliserMagieCible('${moiID}', 'Vous-même')" style="background:#4caf50; color:white; padding:10px; border:none; border-radius:5px; cursor:pointer; margin-bottom:5px; width:100%;">✨ Sur moi-même</button>`;

        // 🔮 Liste des autres joueurs
        for (let id in joueurs) {
            if (id !== moiID) {
                liste.innerHTML += `<button onclick="finaliserMagieCible('${id}', '${joueurs[id].nom}')" style="background:#673ab7; color:white; padding:10px; border:none; border-radius:5px; cursor:pointer; margin-bottom:5px; width:100%;">🔮 ${joueurs[id].nom}</button>`;
            }
        }

        // 🤝 Compagnons du joueur
        const comps = window.perso?.compagnons || [];
        if (comps.length > 0) {
            liste.innerHTML += `<hr style="border:0; border-top:1px solid #444; margin:8px 0;">`;
            comps.forEach((c, i) => {
                const nomSafe = c.nom.replace(/'/g, "\\'");
                liste.innerHTML += `<button onclick="finaliserMagieCible('comp_${i}', '${nomSafe}')" style="background:#2e1f4d; color:#b39ddb; padding:10px; border:1px solid #7c4dff; border-radius:5px; cursor:pointer; margin-bottom:5px; width:100%;">🤝 ${c.nom}</button>`;
            });
        }

        document.getElementById('modal-transfert').style.display = 'block';
    });

}



function finaliserMagieCible(cibleID, nomCible) {
    if (!sortEnCoursCible) return;

    const data = sortEnCoursCible;
    const coutReel = parseInt(data.cout, 10) || 0;

    // Détermine la source de FT (joueur ou compagnon)
    const _ftSource = () => {
        if (sortSourceCompIdx !== null) {
            const comp = window.perso.compagnons[sortSourceCompIdx];
            const ftMax = (comp.statsBase?.CN || 5) * 2 + (comp.statsBase?.IN || 5) + (comp.boostFT || 0);
            return comp.ftActuel !== undefined ? comp.ftActuel : ftMax;
        }
        return perso.ftActuel;
    };
    const _deduireFT = () => {
        if (sortSourceCompIdx !== null) {
            window.perso.compagnons[sortSourceCompIdx].ftActuel = _ftSource() - coutReel;
            if (typeof _syncCompagnonsSummary === 'function') _syncCompagnonsSummary();
        } else {
            perso.ftActuel -= coutReel;
        }
        // Tracking stats
        if (sortSourceCompIdx === null && typeof _incStatPartie === 'function') {
            _incStatPartie('sorts_lances', 1);
            if (!perso.stats_partie) perso.stats_partie = {};
            perso.stats_partie.dernier_sort = data.nom;
            if (!perso.stats_partie.sorts_par_nom) perso.stats_partie.sorts_par_nom = {};
            perso.stats_partie.sorts_par_nom[data.nom] = (perso.stats_partie.sorts_par_nom[data.nom] || 0) + 1;
        }
    };

    // Vérification commune : fatigue
    if (_ftSource() < coutReel) {
        alert("💥 Trop fatigué pour lancer ce sort !");
        return;
    }

    const alignement = sortSourceCompIdx !== null
        ? (window.perso.compagnons[sortSourceCompIdx].alignementMagique || 0)
        : (perso.alignementMagique || 0);

    // Bonus IN ≥ 20 : dégâts sorts +10% (joueur seulement)
    const inTotal = (perso?.statsBase?.IN || 0) + (perso?.statsInvesties?.IN || 0);
    const bonusIN20 = (sortSourceCompIdx === null && inTotal >= 20) ? 1.1 : 1.0;

    // Jet critique : joueur = avec son background, compagnon = sans background
    const _casterPerso = sortSourceCompIdx === null ? perso : null;
    const critSort = (typeof _lancerCritique === 'function')
        ? _lancerCritique(_casterPerso)
        : { type: 'normal', mult: 1 };
    const critLabel = critSort.type === 'echec'
        ? ' ⚠ ÉCHEC CRITIQUE'
        : critSort.type === 'critique'
            ? (critSort.mult >= 2 ? ' ⚡ CRITIQUE ×2 !' : ' ⚡ CRITIQUE ×1.5 !')
            : '';

    const _calcDegats = (base) => {
        if (critSort.type === 'echec') return 0;
        const val = Math.floor((base + (alignement / 100) * base) * bonusIN20);
        return critSort.type === 'critique' ? Math.round(val * critSort.mult) : val;
    };
    const _calcSoin = (base) => {
        if (base === 999) return 9999; // résurrection : jamais d'échec critique
        if (critSort.type === 'echec') return 0;
        const val = Math.floor(base + (alignement / 100) * base);
        return critSort.type === 'critique' ? Math.round(val * critSort.mult) : val;
    };

    // --- CAS A : CIBLE ENNEMIE ---
    if (cibleID === 'ennemi') {
        _deduireFT();
        let infoEffet = "";
        if (data.degats) {
            const d = _calcDegats(data.degats);
            infoEffet = critSort.type === 'echec'
                ? `(⚠ ÉCHEC CRITIQUE — sort raté !)`
                : `(${d} dégâts infligés${critLabel})`;
        } else if (data.soin) {
            infoEffet = "(Cible ennemie soignée ?!)";
        }
        alert(`⚔️ Sort ${data.nom} lancé sur l'Ennemi ! ${infoEffet}`);
        fermerModaleEtUpdate();
        return;
    }

    // --- CAS B2 : CIBLE COMPAGNON (local) ---
    if (cibleID.startsWith('comp_')) {
        const compIdx = parseInt(cibleID.replace('comp_', ''));
        const comp = window.perso?.compagnons?.[compIdx];
        if (!comp) return;
        if (data.soin) {
            const soin = _calcSoin(data.soin);
            const pvMax = (comp.statsBase?.FO || 3) * 2 + (comp.statsBase?.IN || 3);
            comp.pvActuel = Math.min(pvMax, (comp.pvActuel || 0) + soin);
            if (typeof _incStatPartie === 'function') _incStatPartie('soins_donnes', soin);
        }
        if (data.degats) {
            comp.pvActuel = Math.max(0, (comp.pvActuel || 0) - _calcDegats(data.degats));
        }
        _deduireFT();
        if (typeof autoSave === 'function') autoSave();
        alert(`🔮 Sort ${data.nom}${critLabel} lancé sur ${nomCible} !`);
        fermerModaleEtUpdate();
        return;
    }

    // Détermine si la cible c'est le joueur lui-même
    const moiID = window.perso?.nom?.replace(/\s+/g, '_') || '';

    // --- CAS B : CIBLE JOUEUR (Firebase ou soi-même) ---
    db.ref('parties/' + sessionActuelle + '/joueurs/' + cibleID).once('value', (snapshot) => {
        const cibleData = snapshot.val();
        if (!cibleData) return;

        const pvActuels = cibleData.pvActuel || 0;
        const estKO = (pvActuels <= 0 || cibleData.estMort === true);

        if (data.degats && estKO) {
            alert(`🚫 ${nomCible} est déjà au sol.`);
            return;
        }
        if (data.soin && estKO && !data.resurrection) {
            alert(`🚫 Un simple soin ne peut pas ranimer ${nomCible} !`);
            return;
        }

        const statRef = db.ref('parties/' + sessionActuelle + '/joueurs/' + cibleID + '/modif_stat');

        const soinVal = data.soin ? _calcSoin(data.soin) : 0;
        const degatsVal = data.degats ? _calcDegats(data.degats) : 0;

        if (soinVal > 0) {
            statRef.set({ stat: 'PV', valeur: soinVal, timestamp: Date.now() });
            if (typeof _incStatPartie === 'function') {
                if (cibleID === moiID) _incStatPartie('soins_soi', soinVal);
                else _incStatPartie('soins_donnes', soinVal);
            }
        }
        if (degatsVal > 0) {
            statRef.set({ stat: 'PV', valeur: -degatsVal, timestamp: Date.now() });
            // Succès traître : attaque un joueur allié
            if (cibleID !== moiID && typeof _incStatPartie === 'function') {
                _incStatPartie('attaques_allies', 1);
            }
        }

        // Cure poison (indépendant du critique — effet magique garanti)
        if (data.curePoison) {
            if (cibleID === moiID) {
                window.perso.poison = null;
                if (typeof _toast === 'function') _toast('✅ Poison neutralisé !', 'success');
                if (typeof rafraichirAccueil === 'function') rafraichirAccueil();
            } else {
                statRef.set({ stat: 'curePoison', valeur: 1, timestamp: Date.now() });
            }
        }

        _deduireFT();
        alert(`🔮 Sort ${data.nom}${critLabel} lancé sur ${nomCible} !`);
        fermerModaleEtUpdate();
    });
}

function _descStatsItem(def) {
    if (!def?.stats) return '';
    const parts = [];
    const s = def.stats;
    if (s.resMagie)  parts.push(`RM+${s.resMagie}`);
    if (s.resPhys)   parts.push(`RPhys+${s.resPhys}`);
    if (s.resFeu)    parts.push(`RFeu+${s.resFeu}`);
    if (s.resElec)   parts.push(`RElec+${s.resElec}`);
    if (s.FT)        parts.push(`FT+${s.FT}`);
    if (s.FO)        parts.push(`FO+${s.FO}`);
    if (s.DX)        parts.push(`DX+${s.DX}`);
    if (s.IN)        parts.push(`IN+${s.IN}`);
    if (s.CN)        parts.push(`CN+${s.CN}`);
    if (s.CH)        parts.push(`CH+${s.CH}`);
    if (s.bonusComp) Object.entries(s.bonusComp).forEach(([k, v]) => parts.push(`${k}+${v}`));
    return parts.length ? '\n\nPropriétés : ' + parts.join(', ') : '';
}

// Petite fonction utilitaire pour éviter de répéter le code de fermeture
function fermerModaleEtUpdate() {
    document.getElementById('modal-transfert').style.display = 'none';
    sortEnCoursCible = null;
    if (typeof autoSave === 'function') autoSave();
    if (typeof ouvrirMagieAccueil === 'function') ouvrirMagieAccueil();
    if (typeof rafraichirAccueil === 'function') rafraichirAccueil();
}

// ==========================================
// EFFETS SECONDAIRES — COMBAT
// ==========================================

/** Jet de sort opposé : d100+IN_lanceur vs d100+(IN+RM)_cible. true = sort passe. */
function _rollSortPasse(lanceurIN, cibleIN, cibleRM) {
    const rollL = Math.floor(Math.random() * 100) + 1 + (lanceurIN || 0);
    const rollC = Math.floor(Math.random() * 100) + 1 + ((cibleIN || 0) + (cibleRM || 0));
    return rollL >= rollC;
}

/**
 * Déplace une entrée ordre_jeu en DERNIÈRE position (push d'initiative).
 * @returns {{ ordre: object[], tourActuel: number }}
 */
function _pousserEnDernier(ordre, tourActuel, cibleInstanceId, cibleJoueurId) {
    const arr = [...ordre];
    const idx = arr.findIndex(p =>
        (cibleInstanceId != null && p.instanceId === cibleInstanceId) ||
        (cibleJoueurId   && (p.id === cibleJoueurId || p.joueurID === cibleJoueurId))
    );
    if (idx === -1) return { ordre: arr, tourActuel };
    const [cible] = arr.splice(idx, 1);
    cible.pushed = true;
    arr.push(cible);
    const nouveauTour = idx < tourActuel ? Math.max(0, tourActuel - 1) : tourActuel;
    return { ordre: arr, tourActuel: nouveauTour };
}

/**
 * Nettoie pushed, re-trie par vitesse, et place les entries bonus_round
 * (Distorsion spatiale) en tête (devant) ou en queue (derrière).
 */
function _nouveauRondOrdre(ordre) {
    const sansPushed = ordre.map(p => {
        const c = Object.assign({}, p);
        delete c.pushed;
        return c;
    });
    // Séparer les bonus_round des entrées normales
    const devant   = sansPushed.filter(p => p.bonus_round?.position === 'devant')
                               .map(p => { const c = Object.assign({}, p); delete c.bonus_round; return c; });
    const derriere = sansPushed.filter(p => p.bonus_round?.position === 'derriere')
                               .map(p => { const c = Object.assign({}, p); delete c.bonus_round; return c; });
    const normaux  = sansPushed.filter(p => !p.bonus_round)
                               .sort((a, b) => (b.vitesse || 0) - (a.vitesse || 0) || (a.type === 'joueur' ? -1 : 1));
    return [...devant, ...normaux, ...derriere];
}

/**
 * Avance le tour. Si nouveau round (wrap), re-trie et applique les bonus_round.
 * @returns {{ ordre: object[], tourActuel: number }}
 */
function _avancerTourCombat(ordre, tourActuel) {
    const prochainTour = _prochainTourVivant(ordre, tourActuel);
    const estNouveauRond = prochainTour < tourActuel;
    const aReorganiser = estNouveauRond && (ordre.some(p => p.pushed) || ordre.some(p => p.bonus_round));
    const ordreRetour = aReorganiser ? _nouveauRondOrdre(ordre) : ordre;
    return { ordre: ordreRetour, tourActuel: prochainTour };
}

/**
 * Applique les effets secondaires d'un sort sur l'ennemi ciblé.
 * Peut modifier ennemisMAJ en place (AoE).
 * @returns {{ msgExtra: string, ordreUpdate: object[]|null, tourUpdate: number|null }}
 */
function _effetSecondaireEnnemi(sortData, cibleIdx, ennemisMAJ, ordreActuel, tourActuel, lanceurIN) {
    const ennemi  = ennemisMAJ[cibleIdx];
    const cibleIN = (ennemi.statsBase?.IN || 0) + (ennemi.statsInvesties?.IN || 0);
    const cibleRM = ennemi.resistanceMagique || ennemi.compInvesties?.resistanceMagique || 0;
    const nom     = (sortData.nom || '').trim();
    const align   = window.perso?.alignementMagique || 0;

    let msgExtra  = '';
    let ordreUpdate = null;
    let tourUpdate  = null;

    // — Push en dernier : Choc, Choc électrique, Étourdissement, Rafale de vent —
    if (['Choc', 'Rafale de vent', 'Choc électrique', 'Étourdissement'].includes(nom)) {
        if (ennemi.pvActuel > 0) {
            if (_rollSortPasse(lanceurIN, cibleIN, cibleRM)) {
                const res = _pousserEnDernier(ordreActuel, tourActuel, ennemi.instanceId, null);
                ordreUpdate = res.ordre;
                tourUpdate  = res.tourActuel;
                msgExtra = ' 💨 Repoussé en dernier !';
            } else {
                msgExtra = ' — ⛔ Effet résisté.';
            }
        }
        return { msgExtra, ordreUpdate, tourUpdate };
    }

    // — Boule de feu : 25% AoE splash sur les autres ennemis vivants —
    if (nom === 'Boule de feu') {
        const dmgBase = sortData.degats || 15;
        const splash  = Math.max(1, Math.floor((dmgBase + (align / 100) * dmgBase) * 0.25));
        let nbTouches = 0;
        ennemisMAJ.forEach((e, i) => {
            if (i === cibleIdx || e.pvActuel <= 0) return;
            e.pvActuel = Math.max(0, e.pvActuel - splash);
            nbTouches++;
        });
        if (nbTouches > 0) msgExtra = ` — 🔥 Éclaboussure : ${splash} dég. sur ${nbTouches} autre(s)`;
        return { msgExtra, ordreUpdate, tourUpdate };
    }

    // — Éclair : rebonds ½ → ¼ → ⅛ sur les autres ennemis vivants —
    if (nom === 'Eclair' || nom === 'Éclair') {
        const dmgBase = sortData.degats || 30;
        let dmgRebond = Math.max(1, Math.floor((dmgBase + (align / 100) * dmgBase) / 2));
        const vivants = ennemisMAJ.filter((e, i) => i !== cibleIdx && e.pvActuel > 0);
        const rebonds = [];
        vivants.forEach(e => {
            if (dmgRebond < 1) return;
            e.pvActuel = Math.max(0, e.pvActuel - dmgRebond);
            rebonds.push(`${e.nom} (${dmgRebond})`);
            dmgRebond = Math.floor(dmgRebond / 2);
        });
        if (rebonds.length > 0) msgExtra = ` — ⚡ Rebonds : ${rebonds.join(' → ')}`;
        return { msgExtra, ordreUpdate, tourUpdate };
    }

    // — Vapeurs toxiques : poison 2 tours (ROLL) —
    if (nom === 'Vapeurs toxiques') {
        if (ennemi.pvActuel > 0) {
            if (_rollSortPasse(lanceurIN, cibleIN, cibleRM)) {
                if (!ennemisMAJ[cibleIdx].effets) ennemisMAJ[cibleIdx].effets = {};
                const dmgPoison = Math.max(1, Math.floor((sortData.degats || 4) * 0.5));
                ennemisMAJ[cibleIdx].effets.poison = { duree: 2, degats: dmgPoison, source: window.perso?.nom || '?' };
                msgExtra = ` — ☠ Empoisonné (${dmgPoison} dég./tour, 2 tours)`;
            } else {
                msgExtra = ' — ⛔ Poison résisté.';
            }
        }
        return { msgExtra, ordreUpdate, tourUpdate };
    }

    // — Nuée d'insectes : vitesse -25% (ROLL) —
    if (nom === "Nuée d'insectes") {
        if (ennemi.pvActuel > 0) {
            if (_rollSortPasse(lanceurIN, cibleIN, cibleRM)) {
                if (!ennemisMAJ[cibleIdx].effets) ennemisMAJ[cibleIdx].effets = {};
                ennemisMAJ[cibleIdx].effets.ralenti = { facteur: 0.75 };
                const ordreMAJ = [...ordreActuel].map(p => {
                    if (p.type === 'ennemi' && p.instanceId === ennemi.instanceId) {
                        const vOrig = p.vitesseOrig ?? p.vitesse;
                        return Object.assign({}, p, { vitesse: Math.max(1, Math.floor(vOrig * 0.75)), vitesseOrig: vOrig });
                    }
                    return p;
                });
                ordreUpdate = ordreMAJ;
                msgExtra = ' — 🐝 Ralenti (-25% vitesse) !';
            } else {
                msgExtra = ' — ⛔ Effet résisté.';
            }
        }
        return { msgExtra, ordreUpdate, tourUpdate };
    }

    // — Désarmement : perd son arme (ROLL) —
    if (nom === 'Désarmement') {
        if (ennemi.pvActuel > 0 && _rollSortPasse(lanceurIN, cibleIN, cibleRM)) {
            if (!ennemisMAJ[cibleIdx].effets) ennemisMAJ[cibleIdx].effets = {};
            ennemisMAJ[cibleIdx].effets.desarme = true;
            msgExtra = ' — ⚔ Désarmé (mains nues) !';
        } else if (ennemi.pvActuel > 0) {
            msgExtra = ' — ⛔ Sort résisté.';
        }
        return { msgExtra, ordreUpdate, tourUpdate };
    }

    // — Absorption de la volonté : saute 1 tour sans regen (ROLL) —
    if (nom === 'Absorption de la volonté') {
        if (ennemi.pvActuel > 0 && _rollSortPasse(lanceurIN, cibleIN, cibleRM)) {
            if (!ennemisMAJ[cibleIdx].effets) ennemisMAJ[cibleIdx].effets = {};
            ennemisMAJ[cibleIdx].effets.skip_tour = { tours: 1 };
            msgExtra = ' — 🧠 Tour bloqué (sans regen) !';
        } else if (ennemi.pvActuel > 0) {
            msgExtra = ' — ⛔ Sort résisté.';
        }
        return { msgExtra, ordreUpdate, tourUpdate };
    }

    // — Charme : ne peut pas cibler le lanceur 1 tour (ROLL) —
    if (nom === 'Charme') {
        if (ennemi.pvActuel > 0 && _rollSortPasse(lanceurIN, cibleIN, cibleRM)) {
            if (!ennemisMAJ[cibleIdx].effets) ennemisMAJ[cibleIdx].effets = {};
            ennemisMAJ[cibleIdx].effets.charme = { cible_interdit: window.perso?.nom || '', tours: 1 };
            msgExtra = ' — 💜 Charmé (ne peut pas attaquer le lanceur) !';
        } else if (ennemi.pvActuel > 0) {
            msgExtra = ' — ⛔ Sort résisté.';
        }
        return { msgExtra, ordreUpdate, tourUpdate };
    }

    // — Flash : 25% miss sur la prochaine attaque (ROLL) —
    if (nom === 'Flash') {
        if (ennemi.pvActuel > 0 && _rollSortPasse(lanceurIN, cibleIN, cibleRM)) {
            if (!ennemisMAJ[cibleIdx].effets) ennemisMAJ[cibleIdx].effets = {};
            ennemisMAJ[cibleIdx].effets.flash = true;
            msgExtra = ' — ✨ Aveuglé (25% de rater) !';
        } else if (ennemi.pvActuel > 0) {
            msgExtra = ' — ⛔ Sort résisté.';
        }
        return { msgExtra, ordreUpdate, tourUpdate };
    }

    // — Faiblesse : -5 dégâts sur les attaques (ROLL) —
    if (nom === 'Faiblesse') {
        if (ennemi.pvActuel > 0 && _rollSortPasse(lanceurIN, cibleIN, cibleRM)) {
            if (!ennemisMAJ[cibleIdx].effets) ennemisMAJ[cibleIdx].effets = {};
            ennemisMAJ[cibleIdx].effets.faiblesse = { fo_delta: -5 };
            msgExtra = ' — 💀 Affaibli (-5 dégâts) !';
        } else if (ennemi.pvActuel > 0) {
            msgExtra = ' — ⛔ Sort résisté.';
        }
        return { msgExtra, ordreUpdate, tourUpdate };
    }

    // — Rétrécissement : +25% dégâts reçus pendant 2 tours (ROLL) —
    if (nom === 'Rétrécissement') {
        if (ennemi.pvActuel > 0 && _rollSortPasse(lanceurIN, cibleIN, cibleRM)) {
            if (!ennemisMAJ[cibleIdx].effets) ennemisMAJ[cibleIdx].effets = {};
            ennemisMAJ[cibleIdx].effets.retrecissement = { facteur: 1.25, duree: 2 };
            msgExtra = ' — 🔍 Rétréci (+25% dégâts, 2 tours) !';
        } else if (ennemi.pvActuel > 0) {
            msgExtra = ' — ⛔ Sort résisté.';
        }
        return { msgExtra, ordreUpdate, tourUpdate };
    }

    // — Cauchemar : AoE push tous les ennemis ratant le jet (ROLL par ennemi) —
    if (nom === 'Cauchemar') {
        let ordreMAJ = [...ordreActuel];
        let tourMAJ  = tourActuel;
        let poussés  = 0;
        ennemisMAJ.forEach((e) => {
            if (e.pvActuel <= 0) return;
            const eIN = (e.statsBase?.IN || 0) + (e.statsInvesties?.IN || 0);
            const eRM = e.resistanceMagique || e.compInvesties?.resistanceMagique || 0;
            if (!_rollSortPasse(lanceurIN, eIN, eRM)) {
                const res = _pousserEnDernier(ordreMAJ, tourMAJ, e.instanceId, null);
                ordreMAJ = res.ordre;
                tourMAJ  = res.tourActuel;
                poussés++;
            }
        });
        if (poussés > 0) {
            ordreUpdate = ordreMAJ;
            tourUpdate  = tourMAJ;
            msgExtra = ` — 😱 Cauchemar : ${poussés} ennemi(s) repoussé(s) !`;
        } else {
            msgExtra = ' — ⛔ Tous ont résisté.';
        }
        return { msgExtra, ordreUpdate, tourUpdate };
    }

    // — Pétrification : immunité physique, passe son tour avec regen (ROLL) —
    if (nom === 'Pétrification') {
        if (ennemi.pvActuel > 0 && _rollSortPasse(lanceurIN, cibleIN, cibleRM)) {
            if (!ennemisMAJ[cibleIdx].effets) ennemisMAJ[cibleIdx].effets = {};
            ennemisMAJ[cibleIdx].effets.petrification = true;
            msgExtra = ' — 🪨 Pétrifié (immunité physique, passe son tour) !';
        } else if (ennemi.pvActuel > 0) {
            msgExtra = ' — ⛔ Sort résisté.';
        }
        return { msgExtra, ordreUpdate, tourUpdate };
    }

    // — Enchevêtrement : vitesse /2, ROLL de maintien à chaque tour (ROLL) —
    if (nom === 'Enchevêtrement') {
        if (ennemi.pvActuel > 0 && _rollSortPasse(lanceurIN, cibleIN, cibleRM)) {
            if (!ennemisMAJ[cibleIdx].effets) ennemisMAJ[cibleIdx].effets = {};
            ennemisMAJ[cibleIdx].effets.enchevetre = { lanceurIN };
            const ordreMAJ = [...ordreActuel].map(p => {
                if (p.type === 'ennemi' && p.instanceId === ennemi.instanceId) {
                    const vOrig = p.vitesseOrig ?? p.vitesse;
                    return Object.assign({}, p, { vitesse: Math.max(1, Math.floor(vOrig * 0.5)), vitesseOrig: vOrig });
                }
                return p;
            });
            ordreUpdate = ordreMAJ;
            msgExtra = ' — 🌿 Enchevêtré (vitesse /2) !';
        } else if (ennemi.pvActuel > 0) {
            msgExtra = ' — ⛔ Sort résisté.';
        }
        return { msgExtra, ordreUpdate, tourUpdate };
    }

    // — Charmer les animaux : animal passe ses tours (ROLL facile) —
    if (nom === 'Charmer les animaux') {
        const estAnimal = ['animal', 'Animal', 'bête', 'Bête'].includes(ennemi.race || '');
        if (!estAnimal) {
            msgExtra = ' — ❌ Cible non animale.';
        } else if (_rollSortPasse(lanceurIN * 2, cibleIN, cibleRM)) {
            if (!ennemisMAJ[cibleIdx].effets) ennemisMAJ[cibleIdx].effets = {};
            ennemisMAJ[cibleIdx].effets.charme_animal = { lanceur: window.perso?.nom || '' };
            msgExtra = ' — 🐾 Animal charmé (passe ses tours) !';
        } else {
            msgExtra = ' — ⛔ Sort résisté.';
        }
        return { msgExtra, ordreUpdate, tourUpdate };
    }

    // — Entrave aux sortilèges : ne peut plus lancer de sorts (ROLL) —
    if (nom === 'Entrave aux sortilèges') {
        if (ennemi.pvActuel > 0 && _rollSortPasse(lanceurIN, cibleIN, cibleRM)) {
            if (!ennemisMAJ[cibleIdx].effets) ennemisMAJ[cibleIdx].effets = {};
            ennemisMAJ[cibleIdx].effets.entrave_sorts = true;
            msgExtra = ' — 🔒 Entravé (ne peut plus lancer de sorts) !';
        } else if (ennemi.pvActuel > 0) {
            msgExtra = ' — ⛔ Sort résisté.';
        }
        return { msgExtra, ordreUpdate, tourUpdate };
    }

    // — Stase : saute ses tours sans regen (ROLL) —
    if (nom === 'Stase') {
        if (ennemi.pvActuel > 0 && _rollSortPasse(lanceurIN, cibleIN, cibleRM)) {
            if (!ennemisMAJ[cibleIdx].effets) ennemisMAJ[cibleIdx].effets = {};
            ennemisMAJ[cibleIdx].effets.stase = true;
            msgExtra = ' — ⏸ En stase (ne peut plus agir) !';
        } else if (ennemi.pvActuel > 0) {
            msgExtra = ' — ⛔ Sort résisté.';
        }
        return { msgExtra, ordreUpdate, tourUpdate };
    }

    // — Monstre illusoire : 50% chance fausse cible (ROLL) —
    if (nom === 'Monstre illusoire') {
        if (ennemi.pvActuel > 0 && _rollSortPasse(lanceurIN, cibleIN, cibleRM)) {
            if (!ennemisMAJ[cibleIdx].effets) ennemisMAJ[cibleIdx].effets = {};
            ennemisMAJ[cibleIdx].effets.monstre_illusoire = true;
            msgExtra = ' — 👻 Monstre illusoire actif (50% fausse cible) !';
        } else if (ennemi.pvActuel > 0) {
            msgExtra = ' — ⛔ Sort résisté.';
        }
        return { msgExtra, ordreUpdate, tourUpdate };
    }

    // — Domination / Contrôler les animaux (ROLL) —
    if (nom === 'Domination' || nom === 'Contrôler les animaux') {
        const estAnimal = ['animal', 'Animal', 'bête', 'Bête'].includes(ennemi.race || '');
        if (nom === 'Contrôler les animaux' && !estAnimal) {
            msgExtra = ' — ❌ Cible non animale.';
        } else if (ennemi.pvActuel > 0 && _rollSortPasse(lanceurIN, cibleIN, cibleRM)) {
            if (!ennemisMAJ[cibleIdx].effets) ennemisMAJ[cibleIdx].effets = {};
            ennemisMAJ[cibleIdx].effets.domine = { lanceur: window.perso?.nom || '' };
            msgExtra = ` — 🎭 Dominé par ${window.perso?.nom || '?'} !`;
        } else if (ennemi.pvActuel > 0) {
            msgExtra = ' — ⛔ Sort résisté.';
        }
        return { msgExtra, ordreUpdate, tourUpdate };
    }

    // — Dissipation des sortilèges : efface tous les effets magiques (ROLL) —
    if (nom === 'Dissipation des sortilèges') {
        if (ennemi.pvActuel > 0 && _rollSortPasse(lanceurIN, cibleIN, cibleRM)) {
            const nbEffets = Object.keys(ennemisMAJ[cibleIdx].effets || {}).length;
            ennemisMAJ[cibleIdx].effets = {};
            msgExtra = nbEffets > 0
                ? ` — ✨ ${nbEffets} effet(s) dissipé(s) !`
                : ' — ✨ Aucun effet à dissiper.';
        } else if (ennemi.pvActuel > 0) {
            msgExtra = ' — ⛔ Sort résisté.';
        }
        return { msgExtra, ordreUpdate, tourUpdate };
    }

    // — Nuée d'insectes : ralentissement 25% pendant 2 tours —
    if (s.nueeDInsectes && ennemi.pvActuel > 0) {
        if (!ennemisMAJ[cibleIdx].effets) ennemisMAJ[cibleIdx].effets = {};
        const vOrig = (ordreUpdate || []).find(p => p.type === 'ennemi' && p.instanceId === ennemi.instanceId)?.vitesse
                   || ennemi.statsBase?.DX || 5;
        ennemisMAJ[cibleIdx].effets.nuee_insectes = { toursRestants: 2, vitesseOrig: vOrig };
        ordreUpdate = (ordreUpdate || []).map(p => {
            if (p.type === 'ennemi' && p.instanceId === ennemi.instanceId) {
                const vO = p.vitesseOrig ?? p.vitesse;
                return Object.assign({}, p, { vitesse: Math.max(1, Math.floor(vO * 0.75)), vitesseOrig: vO });
            }
            return p;
        });
        msgExtra += ' — 🐝 Ralenti de 25% pendant 2 tours !';
    }

    return { msgExtra, ordreUpdate, tourUpdate };
}
