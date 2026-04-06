const competencesData = {
    "Combat": [
        { id: "arc", nom: "Arc", stat: "DX", desc: "+5% de dégâts avec arc par point" },
        { id: "esquive", nom: "Esquive", stat: "DX", desc: "+1% de chance d'esquiver une attaque par point" },
        { id: "melee", nom: "Mêlée", stat: "DX", desc: "+5% de dégâts en mêlée et corps à corps par point" },
        { id: "lancer", nom: "Lancer", stat: "DX", desc: "+5% de dégâts avec explosifs et armes de jet par point" }
    ],
    "Vol": [
        { id: "attaque_sournoise", nom: "Attaque sournoise", stat: "DX", desc: "+10% de dégâts à la 1ère attaque par point ; +10% vitesse avant la 1ère action" },
        { id: "vol_a_la_tire", nom: "Vol à la tire", stat: "DX", desc: "+4% de chance de réussite par point" },
        { id: "discretion", nom: "Discrétion", stat: "DX", desc: "+2% de chance de ne pas pouvoir être ciblé au 1er tour par point" },
        { id: "detection_piege", nom: "Détection de Piège", stat: "IN", desc: "+5% de chance de révéler un piège ; -2% de dégâts si piège déclenché par point" }
    ],
    "Social": [
        { id: "jeu", nom: "Jeu", stat: "IN", desc: "+5% de chance de gagner un pari par point ; augmente la mise des PNJ" },
        { id: "marchandage", nom: "Marchandage", stat: "IN", desc: "-2% à l'achat, +2% à la revente par point" },
        { id: "soins", nom: "Soins", stat: "IN", desc: "+5% d'efficacité des potions et objets de soin par point" },
        { id: "persuasion", nom: "Persuasion", stat: "CH", desc: "+2% d'XP et d'or en récompense de quêtes par point" }
    ],
    "Technologie": [
        { id: "reparation", nom: "Réparation", stat: "IN", desc: "Répare les objets ; -1% de perte de durabilité max tous les 2 points (base 15%)" },
        { id: "armes_a_feu", nom: "Armes à feu", stat: "IN", desc: "+5% de dégâts avec armes à feu par point" },
        { id: "crochetage", nom: "Crochetage", stat: "DX", desc: "+5% de chance de réussite ; -5% de chance de casser le passe-partout par point" },
        { id: "desamorcage", nom: "Désamorçage de piège", stat: "IN", desc: "+5% de chance de désamorcer un piège par point" }
    ],
    "Survie": [
        { id: "purge_toxines", nom: "Purge de toxines", stat: "CN", desc: "+5% de chance de se remettre naturellement du poison par tour par point" }
    ]
};
