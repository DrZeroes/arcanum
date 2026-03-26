const magieData = {
    "Déplacement": {
        desc: "Les arcanes du Déplacement regroupent les sortilèges liés aux mouvements et aux déplacements d'",
        sorts: [
            { nom: "Désarmement", niv: 1, int: 6, cout: 10, desc: " si la cible n'a pas la dextérité nécessaire pour résister, son arme lui échappera des mains" },
            { nom: "Déverrouillage", niv: 1, int: 9, cout: 10, desc: "Ouvre magiquement les portes et conteneurs normaux." },
            { nom: "Choc", niv: 5, int: 12, cout: 15, desc: "Repousse violemment une cible en arrière." },
            { nom: "Distorsion spatiale", niv: 10, int: 15, cout: 25, desc: "Vous téléporte instantanément sur une courte distance." },
            { nom: "Téléportation", niv: 15, int: 18, cout: 50, desc: "Vous transporte instantanément vers un lieu déjà visité." }
        ]
    },
    "Divination": {
        desc: "Sortilèges permettant d'obtenir des informations ou des connaissances.",
        sorts: [
            { nom: "Détection de l'alignement", niv: 1, int: 6, cout: "?", desc: "???" },
            { nom: "Perception du contenu", niv: 1, int: 9, cout: "?", desc: "???" },
            { nom: "Perception de l'aura", niv: 5, int: 12, cout: "?", desc: "???" },
            { nom: "Détection de l'invisible", niv: 10, int: 15, cout: "?", desc: "???" },
            { nom: "Identification", niv: 15, int: 18, cout: "?", desc: "???" }
        ]
    },
    "Air": {
        desc: "Ecole basée sur la manipulation de l’élément air. La plupart des sorts sont surtout défensif, mais il y a quelques sort plus ou moins offensifs.",
        sorts: [
            { nom: "Vitalité de l'Air", niv: 1, int: 6, cout: "?", desc: "Augmente la constitution de la cible" },
            { nom: "Vapeurs toxiques", niv: 1, int: 9, cout: "?", desc: "crée un nuage toxique" },
            { nom: "Rafale de vent", niv: 5, int: 12, cout: "?", desc: "crée un tourbillon autour du lanceur" },
            { nom: "Incarnation d'Air", niv: 10, int: 15, cout: "?", desc: "rend le corps de la cible impalpable (donc relativement intouchable) et fait qu’il flotte au-dessus du sol" },
            { nom: "Appel d'un élémentaire de l'Air", niv: 15, int: 18, cout: "?", desc: "invoque un élémental d’air" }
        ]
    },
    "Terre": { 
        desc: "Sortilèges basés sur la terre et la roche.", 
        sorts: [
            { nom: "???", niv: 1, int: 6, cout: "?", desc: "???" }, 
            { nom: "???", niv: 1, int: 9, cout: "?", desc: "???" }, 
            { nom: "???", niv: 5, int: 12, cout: "?", desc: "???" }, 
            { nom: "???", niv: 10, int: 15, cout: "?", desc: "???" }, 
            { nom: "???", niv: 15, int: 18, cout: "?", desc: "???" }
        ] 
    },
    "Feu": { 
        desc: "Sortilèges basés sur le feu et la chaleur.", 
        sorts: [
            { nom: "???", niv: 1, int: 6, cout: "?", desc: "???" }, 
            { nom: "???", niv: 1, int: 9, cout: "?", desc: "???" }, 
            { nom: "???", niv: 5, int: 12, cout: "?", desc: "???" }, 
            { nom: "???", niv: 10, int: 15, cout: "?", desc: "???" }, 
            { nom: "???", niv: 15, int: 18, cout: "?", desc: "???" }
        ] 
    },
    "Eau": { 
        desc: "Sortilèges basés sur l'eau et la glace.", 
        sorts: [
            { nom: "???", niv: 1, int: 6, cout: "?", desc: "???" }, 
            { nom: "???", niv: 1, int: 9, cout: "?", desc: "???" }, 
            { nom: "???", niv: 5, int: 12, cout: "?", desc: "???" }, 
            { nom: "???", niv: 10, int: 15, cout: "?", desc: "???" }, 
            { nom: "???", niv: 15, int: 18, cout: "?", desc: "???" }
        ] 
    },
    "Energie": { 
        desc: "Manipulation des énergies cosmiques pures.", 
        sorts: [
            { nom: "???", niv: 1, int: 6, cout: "?", desc: "???" }, 
            { nom: "???", niv: 1, int: 9, cout: "?", desc: "???" }, 
            { nom: "???", niv: 5, int: 12, cout: "?", desc: "???" }, 
            { nom: "???", niv: 10, int: 15, cout: "?", desc: "???" }, 
            { nom: "???", niv: 15, int: 18, cout: "?", desc: "???" }
        ] 
    },
    "Mental": { 
        desc: "Contrôler l'esprit d'une cible faible.", 
        sorts: [
            { nom: "???", niv: 1, int: 6, cout: "?", desc: "???" }, 
            { nom: "???", niv: 1, int: 9, cout: "?", desc: "???" }, 
            { nom: "???", niv: 5, int: 12, cout: "?", desc: "???" }, 
            { nom: "???", niv: 10, int: 15, cout: "?", desc: "???" }, 
            { nom: "???", niv: 15, int: 18, cout: "?", desc: "???" }
        ] 
    },
    "Méta": { 
        desc: "Sortilèges qui ont la primauté sur les autres sortilèges.", 
        sorts: [
            { nom: "???", niv: 1, int: 6, cout: "?", desc: "???" }, 
            { nom: "???", niv: 1, int: 9, cout: "?", desc: "???" }, 
            { nom: "???", niv: 5, int: 12, cout: "?", desc: "???" }, 
            { nom: "???", niv: 10, int: 15, cout: "?", desc: "???" }, 
            { nom: "???", niv: 15, int: 18, cout: "?", desc: "???" }
        ] 
    },
    "Transformation": { 
        desc: "Modifier la structure matérielle d'une cible.", 
        sorts: [
            { nom: "???", niv: 1, int: 6, cout: "?", desc: "???" }, 
            { nom: "???", niv: 1, int: 9, cout: "?", desc: "???" }, 
            { nom: "???", niv: 5, int: 12, cout: "?", desc: "???" }, 
            { nom: "???", niv: 10, int: 15, cout: "?", desc: "???" }, 
            { nom: "???", niv: 15, int: 18, cout: "?", desc: "???" }
        ] 
    },
    "Nature": { 
        desc: "Manipuler les plantes, animaux et forces naturelles.", 
        sorts: [
            { nom: "???", niv: 1, int: 6, cout: "?", desc: "???" }, 
            { nom: "???", niv: 1, int: 9, cout: "?", desc: "???" }, 
            { nom: "???", niv: 5, int: 12, cout: "?", desc: "???" }, 
            { nom: "???", niv: 10, int: 15, cout: "?", desc: "???" }, 
            { nom: "???", niv: 15, int: 18, cout: "?", desc: "???" }
        ] 
    },
    "Nécromancie noire": { 
        desc: "Ecole basée sur la modification de la vie, négativement. Très intéressant à bas niveau, puisque c’est ici que vous apprendrez le seul sort offensif de 1er niveau.", 
        sorts: [
            { nom: "Blessure ", niv: 1, int: 6, cout: "?", desc: "diminue la vie de la cible. Très efficace contre la plupart des créatures faibles (loups etc) et même contre les autres à haut niveau puisque la puissance augmente avec le niveau." }, 
            { nom: "???", niv: 1, int: 9, cout: "?", desc: "???" }, 
            { nom: "???", niv: 5, int: 12, cout: "?", desc: "???" }, 
            { nom: "???", niv: 10, int: 15, cout: "?", desc: "???" }, 
            { nom: "???", niv: 15, int: 18, cout: "?", desc: "???" }
        ] 
    },
    "Nécromancie blanche": { 
        desc: "Affecte de façon positive la force vitale.", 
        sorts: [
            { nom: "???", niv: 1, int: 6, cout: "?", desc: "???" }, 
            { nom: "???", niv: 1, int: 9, cout: "?", desc: "???" }, 
            { nom: "???", niv: 5, int: 12, cout: "?", desc: "???" }, 
            { nom: "???", niv: 10, int: 15, cout: "?", desc: "???" }, 
            { nom: "???", niv: 15, int: 18, cout: "?", desc: "???" }
        ] 
    },
    "Illusion": { 
        desc: "Contrôler la lumière et les illusions.", 
        sorts: [
            { nom: "???", niv: 1, int: 6, cout: "?", desc: "???" }, 
            { nom: "???", niv: 1, int: 9, cout: "?", desc: "???" }, 
            { nom: "???", niv: 5, int: 12, cout: "?", desc: "???" }, 
            { nom: "???", niv: 10, int: 15, cout: "?", desc: "???" }, 
            { nom: "???", niv: 15, int: 18, cout: "?", desc: "???" }
        ] 
    },
    "Invocation": { 
        desc: "Invoquer des créatures.", 
        sorts: [
            { nom: "???", niv: 1, int: 6, cout: "?", desc: "???" }, 
            { nom: "???", niv: 1, int: 9, cout: "?", desc: "???" }, 
            { nom: "???", niv: 5, int: 12, cout: "?", desc: "???" }, 
            { nom: "???", niv: 10, int: 15, cout: "?", desc: "???" }, 
            { nom: "???", niv: 15, int: 18, cout: "?", desc: "???" }
        ] 
    },
    "Temporel": { 
        desc: "Contrôler le cours du temps.", 
        sorts: [
            { nom: "???", niv: 1, int: 6, cout: "?", desc: "???" }, 
            { nom: "???", niv: 1, int: 9, cout: "?", desc: "???" }, 
            { nom: "???", niv: 5, int: 12, cout: "?", desc: "???" }, 
            { nom: "???", niv: 10, int: 15, cout: "?", desc: "???" }, 
            { nom: "???", niv: 15, int: 18, cout: "?", desc: "???" }
        ] 
    }
};