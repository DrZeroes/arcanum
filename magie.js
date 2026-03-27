const magieData = {
    "Déplacement": {
        desc: "Les arcanes du Déplacement regroupent les sortilèges liés aux mouvements et aux déplacements d'",
        sorts: [
            { nom: "Désarmement", niv: 1, int: 6, cout: 10, desc: " Force la cible à lâcher son arme si elle échoue à résister." },
            { nom: "Déverrouillage", niv: 1, int: 9, cout: 10, desc: "Ouvre magiquement les portes et conteneurs normaux." },
            { nom: "Choc", niv: 5, int: 12, cout: 15, desc: "Repousse violemment une cible en arrière." },
            { nom: "Distorsion spatiale", niv: 10, int: 15, cout: 25, desc: "Vous téléporte instantanément sur une courte distance." },
            { nom: "Téléportation", niv: 15, int: 18, cout: 50, desc: "Vous transporte instantanément vers un lieu déjà visité." }
        ]
    },
    "Divination": {
        desc: "Sortilèges permettant d'obtenir des informations ou des connaissances.",
        sorts: [
            { nom: "Détection de l'alignement", niv: 1, int: 6, cout: "?", desc: Révèle l’alignement d’une créature. },
            { nom: "Perception du contenu", niv: 1, int: 9, cout: "?", desc: Permet de voir l’inventaire de la cible. },
            { nom: "Perception de l'aura", niv: 5, int: 12, cout: "?", desc: Révèle certains attributs cachés de la cible. },
            { nom: "Détection de l'invisible", niv: 10, int: 15, cout: "?", desc: Permet de voir créatures et objets invisibles. },
            { nom: "Identification", niv: 15, int: 18, cout: "?", desc: Identifie toutes les propriétés magiques d’un objet. }
        ]
    },
    "Air": {
        desc: "Ecole basée sur la manipulation de l’élément air. La plupart des sorts sont surtout défensif, mais il y a quelques sort plus ou moins offensifs.",
        sorts: [
            { nom: "Vitalité de l'Air", niv: 1, int: 6, cout: "?", desc: "Augmente la constitution de la cible" },
            { nom: "Vapeurs toxiques", niv: 1, int: 9, cout: "?", desc: "Crée un nuage de gaz qui inflige des dégâts si la cible ne résiste pas." },
            { nom: "Rafale de vent", niv: 5, int: 12, cout: "?", desc: "Génère une rafale qui projette objets et créatures." },
            { nom: "Incarnation d'Air", niv: 10, int: 15, cout: "?", desc: "Transforme la cible en air et la rend difficile à toucher." },
            { nom: "Appel d'un élémentaire de l'Air", niv: 15, int: 18, cout: "?", desc: "Invoque un élémentaire d’Air." }
        ]
    },
    "Terre": { 
        desc: "Sortilèges basés sur la terre et la roche.", 
        sorts: [
            { nom: "Force de la Terre" niv: 1, int: 6, cout: "?", desc: "Augmente la force de la cible." }, 
            { nom: "Projectile de pierre" niv: 1, int: 9, cout: "?", desc: "Lance un projectile de pierre infligeant des dégâts." }, 
            { nom: "Mur de pierres" niv: 5, int: 12, cout: "?", desc: "Crée un mur de pierre bloquant le passage." }, 
            { nom: "Incarnation de Pierre" niv: 10, int: 15, cout: "?", desc: "Transforme la cible en pierre." }, 
            { nom: "Appel d’un élémentaire de Terre" niv: 15, int: 18, cout: "?", desc: "Invoque un élémentaire de Terre." }
        ] 
    },
    "Feu": { 
        desc: "Sortilèges basés sur le feu et la chaleur.", 
        sorts: [
            { nom: "Agilité du Feu", niv: 1, int: 6, cout: "?", desc: "Augmente la dexterité de la cible." }, 
            { nom: "Mur de feu", niv: 1, int: 9, cout: "?", desc: "Crée un mur de flammes infligeant des dégâts." }, 
            { nom: "Boule de feu", niv: 5, int: 12, cout: "?", desc: "Lance une boule de feu infligeant de lourds dégâts." }, 
            { nom: "Incarnation de Feu", niv: 10, int: 15, cout: "?", desc: "Transforme la cible en feu." }, 
            { nom: "Appel d’un élémentaire de Feu, niv: 15, int: 18, cout: "?", desc: "Invoque un élémentaire de Feu." }
        ] 
    },
    "Eau": { 
        desc: "Sortilèges basés sur l'eau et la glace.", 
        sorts: [
            { nom: "Pureté de l’Eau", niv: 1, int: 6, cout: "?", desc: "Améliore le charisme de la cible." }, 
            { nom: "Brouillard", niv: 1, int: 9, cout: "?", desc: "Crée un brouillard qui gêne la vision." }, 
            { nom: "Fureur de glace", niv: 5, int: 12, cout: "?", desc: "Inflige des dégâts de glace." }, 
            { nom: "Incarnation d’Eau", niv: 10, int: 15, cout: "?", desc: "Transforme la cible en eau." }, 
            { nom: "Appel d’un élémentaire de l’Eau", niv: 15, int: 18, cout: "?", desc: "Invoque un élémentaire d’Eau." }
        ] 
    },
    "Energie": { 
        desc: "Manipulation des énergies cosmiques pures.", 
        sorts: [
            { nom: "Bouclier de protection", niv: 1, int: 6, cout: "?", desc: "Protège la cible en réduisant les dégâts reçus." }, 
            { nom: "Choc électrique", niv: 1, int: 9, cout: "?", desc: "Inflige des dégâts électriques à la cible." }, 
            { nom: "Mur de force", niv: 5, int: 12, cout: "?", desc: "Crée une barrière magique qui bloque le passage." }, 
            { nom: "Eclair", niv: 10, int: 15, cout: "?", desc: "Lance un éclair qui inflige de lourds dégâts à la cible." }, 
            { nom: "Désintégration", niv: 15, int: 18, cout: "?", desc: "Détruit la cible instantanément si le sort réussit." }
        ] 
    },
    "Mental": { 
        desc: "Contrôler l'esprit d'une cible faible.", 
        sorts: [
            { nom: "Charme", niv: 1, int: 6, cout: "?", desc: "Améliore la réaction de la cible envers le lanceur." }, 
            { nom: "Étourdissement", niv: 1, int: 9, cout: "?", desc: "Étourdit la cible et l’empêche d’agir pendant quelques secondes." }, 
            { nom: "Absorption de la volonté", niv: 5, int: 12, cout: "?", desc: "Réduit fortement la volonté de la cible pendant la durée du sort." }, 
            { nom: "Cauchemar", niv: 10, int: 15, cout: "?", desc: "Terrifie les créatures proches qui tentent de fuir." }, 
            { nom: "Domination", niv: 15, int: 18, cout: "?", desc: "Permet de contrôler totalement l’esprit de la cible." }
        ] 
    },
    "Méta": { 
        desc: "Sortilèges qui ont la primauté sur les autres sortilèges.", 
        sorts: [
            { nom: "Résistance aux sortilèges", niv: 1, int: 6, cout: "?", desc: "Réduit les effets des sorts subis par la cible." }, 
            { nom: "Dissipation des sortilèges", niv: 1, int: 9, cout: "?", desc: "Supprime les sorts actifs sur une cible." }, 
            { nom: "Bouclier mystique", niv: 5, int: 12, cout: "?", desc: "Protège la cible contre les effets magiques." }, 
            { nom: "Entrave aux sortilèges", niv: 10, int: 15, cout: "?", desc: "Empêche la cible de lancer des sorts." }, 
            { nom: "Bouclier de réflexion", niv: 15, int: 18, cout: "?", desc: "Renvoie les sorts vers leur lanceur." }
        ] 
    },
    "Transformation": { 
        desc: "Modifier la structure matérielle d'une cible.", 
        sorts: [
            { nom: "Main de fer", niv: 1, int: 6, cout: "?", desc: "Augmente la puissance physique de la cible." }, 
            { nom: "Faiblesse", niv: 1, int: 9, cout: "?", desc: "Diminue les caractéristiques physiques de la cible." }, 
            { nom: "Rétrécissement", niv: 5, int: 12, cout: "?", desc: "Réduit la taille de la cible." }, 
            { nom: "Pétrification", niv: 10, int: 15, cout: "?", desc: "Transforme la cible en pierre." }, 
            { nom: "Polymorphie", niv: 15, int: 18, cout: "?", desc: "Transforme la cible en une autre créature." }
        ] 
    },
    "Nature": { 
        desc: "Manipuler les plantes, animaux et forces naturelles.", 
        sorts: [
            { nom: "Charmer les animaux", niv: 1, int: 6, cout: "?", desc: "Rend les animaux amicaux envers le lanceur." }, 
            { nom: "Enchevêtrement", niv: 1, int: 9, cout: "?", desc: "Immobilise la cible avec des plantes." }, 
            { nom: "Contrôler les animaux", niv: 5, int: 12, cout: "?", desc: "Permet de contrôler les animaux proches." }, 
            { nom: "Appeler les animaux", niv: 10, int: 15, cout: "?", desc: "Fait apparaître des animaux alliés." }, 
            { nom: "Régénération", niv: 15, int: 18, cout: "?", desc: "Soigne progressivement les membres du groupe." }
        ] 
    },
    "Nécromancie noire": { 
        desc: "Ecole basée sur la modification de la vie, négativement. Très intéressant à bas niveau, puisque c’est ici que vous apprendrez le seul sort offensif de 1er niveau.", 
        sorts: [
            { nom: "Blessure ", niv: 1, int: 6, cout: "?", desc: "diminue la vie de la cible." }, 
            { nom: "Rappel d’un esprit", niv: 1, int: 9, cout: "?", desc: "Permet de parler à l’esprit d’un cadavre." }, 
            { nom: "Invocation de morts-vivants", niv: 5, int: 12, cout: "?", desc: "Invoque des morts-vivants hostiles autour de la cible." }, 
            { nom: "Création de morts-vivants", niv: 10, int: 15, cout: "?", desc: "Réanime un cadavre qui devient allié." }, 
            { nom: "Suppression de la vie", niv: 15, int: 18, cout: "?", desc: "Tue instantanément la cible si le sort réussit." }
        ] 
    },
    "Nécromancie blanche": { 
        desc: "Affecte de façon positive la force vitale.", 
        sorts: [
            { nom: "Soins légers", niv: 1, int: 6, cout: "?", desc: "Soigne une petite quantité de points de vie." }, 
            { nom: "Antidote", niv: 1, int: 9, cout: "?", desc: "Soigne les effets de poison." }, 
            { nom: "Soins importants", niv: 5, int: 12, cout: "?", desc: "Soigne une grande quantité de points de vie." }, 
            { nom: "Sanctuaire", niv: 10, int: 15, cout: "?", desc: "Empêche les morts-vivants d’attaquer la cible." }, 
            { nom: "Résurrection", niv: 15, int: 18, cout: "?", desc: "Ramène une cible à la vie." }
        ] 
    },
    "Illusion": { 
        desc: "Contrôler la lumière et les illusions.", 
        sorts: [
            { nom: "Illumination", niv: 1, int: 6, cout: "?", desc: "Augmente la luminosité autour de la cible." }, 
            { nom: "Flash", niv: 1, int: 9, cout: "?", desc: "Aveugle temporairement la cible." }, 
            { nom: "Occultation", niv: 5, int: 12, cout: "?", desc: "Augmente l'armure de la cible." }, 
            { nom: "Monstre illusoire", niv: 10, int: 15, cout: "?", desc: "Crée un monstre fictif que la cible croit réel." }, 
            { nom: "Invisibilité", niv: 15, int: 18, cout: "?", desc: "Rend la cible invisible." }
        ] 
    },
    "Invocation": { 
        desc: "Invoquer des créatures.", 
        sorts: [
            { nom: "Nuée d’insectes", niv: 1, int: 6, cout: "?", desc: "Invoque un essaim qui ralentit la cible." }, 
            { nom: "Champion orque", niv: 1, int: 9, cout: "?", desc: "Invoque un orque qui combat pour le lanceur." }, 
            { nom: "Ogre gardien", niv: 5, int: 12, cout: "?", desc: "Invoque un ogre allié." }, 
            { nom: "Porte des Enfers", niv: 10, int: 15, cout: "?", desc: "Invoque un démon." }, 
            { nom: "Invocation d’un familier", niv: 15, int: 18, cout: "?", desc: "Invoque un familier permanent." }
        ] 
    },
    "Temporel": { 
        desc: "Contrôler le cours du temps.", 
        sorts: [
            { nom: "Verrou magique", niv: 1, int: 6, cout: "?", desc: "Verouille une porte ou un coffre" }, 
            { nom: "Altération temporelle", niv: 1, int: 9, cout: "?", desc: "Réduit de moitié la vitesse des créatures près du lanceur du sort" }, 
            { nom: "Hâte", niv: 5, int: 12, cout: "?", desc: "Double  la vitesse de la cible." }, 
            { nom: "Stase", niv: 10, int: 15, cout: "?", desc: "Immobilise totalement une cible." }, 
            { nom: "Tempus Fugit", niv: 15, int: 18, cout: "?", desc: "Triple la vitesse pour le lanceur et ses aliés et réduit celle des autres." }
        ] 
    }
};