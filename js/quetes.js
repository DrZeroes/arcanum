// ============================================================
// SYSTÈME DE QUÊTES — Données statiques
// Chaque quête : nom, ville, donneur, résumé, récompenses
// ============================================================

const quetesData = {

    // ── SITE DU CRASH ─────────────────────────────────────────

    "Q01": {
        nom: "Le Prêtre et les Bandits",
        ville: "Site du Crash",
        donneur: "Charles Brehgo (esprit)",
        resume: "Libérer l'esprit d'un bandit maudit par un prêtre.",
        recompenses: { or: 0, xp: 20, special: "Bénédiction : Réaction +5" }
    },

    // ── SHROUDED HILLS ────────────────────────────────────────

    "Q02": {
        nom: "Détruire la Machine à Vapeur",
        ville: "Shrouded Hills",
        donneur: "Jongle Dunne",
        resume: "La machine à vapeur de la ville perturbe la magie de Jongle.",
        recompenses: { or: 0, xp: 50, items: ["Potion de soin (x2)"] }
    },

    "Q03": {
        nom: "Réparer la Machine à Vapeur",
        ville: "Shrouded Hills",
        donneur: "Constable Owens",
        resume: "Après avoir saboté la machine, le Constable demande de la réparer.",
        recompenses: { or: 100, xp: 150 }
    },

    "Q04": {
        nom: "Récupérer le Colis de Jongle",
        ville: "Shrouded Hills → Dernholm",
        donneur: "Jongle Dunne",
        resume: "Jongle a besoin qu'on récupère un colis à Dernholm.",
        recompenses: { or: 70, xp: 10 }
    },

    "Q05": {
        nom: "Arrêter le Braquage",
        ville: "Shrouded Hills",
        donneur: "Doc Roberts",
        resume: "Doc Roberts a besoin d'aide pour empêcher un braquage à la banque.",
        recompenses: { or: 0, xp: 30, special: "Réputation : Héros de Shrouded Hills + arme au choix (hache, épée enchantée ou revolver)" }
    },

    "Q06": {
        nom: "Du Pur Alliage pour Lloyd",
        ville: "Shrouded Hills",
        donneur: "Lloyd (forgeron)",
        resume: "Lloyd le forgeron a besoin de pur alliage pour forger une lame.",
        recompenses: { or: 0, xp: 15, items: ["Dague d'acier fin"] }
    },

    "Q07": {
        nom: "Les Voleurs et le Pont",
        ville: "Shrouded Hills",
        donneur: "Constable Owens",
        resume: "Des voleurs bloquent le pont à l'est de la ville.",
        recompenses: { or: 50, xp: 15 }
    },

    "Q08": {
        nom: "Braquer la Banque",
        ville: "Shrouded Hills",
        donneur: "Jacob Bens (auberge)",
        resume: "Jacob Bens propose de partager les bénéfices d'un braquage.",
        recompenses: { or: 250, xp: 20, special: "Attention : Jacob peut vous dénoncer si vous ne le payez pas" }
    },

    "Q09": {
        nom: "Libérer le Fantôme de Bessie Toone",
        ville: "Shrouded Hills → Dernholm → Tarant",
        donneur: "Percival Toone",
        resume: "Le fantôme de Bessie Toone hante la mine. Il faut découvrir pourquoi.",
        recompenses: { or: 500, xp: 400, special: "Variante : donner l'acte à Sarah → Épée magique non identifiée" }
    },

    // ── TARANT ────────────────────────────────────────────────

    "Q10": {
        nom: "Livrer l'Avis de Paiement",
        ville: "Tarant",
        donneur: "M. Wright (Journal Tarantien)",
        resume: "M. Wright a besoin qu'on livre un avis de paiement.",
        recompenses: { or: 80, xp: 100 }
    },

    "Q11": {
        nom: "Débarrasser les Entrepôts des Rats",
        ville: "Tarant",
        donneur: "Simon Plough",
        resume: "Les entrepôts de Simon Plough sont infestés de rats.",
        recompenses: { or: 0, xp: 100, special: "Garder ce qu'on trouve dans les entrepôts" }
    },

    "Q12": {
        nom: "Retrouver l'Alliance de Matthew",
        ville: "Tarant",
        donneur: "Matthew Jameson",
        resume: "Matthew a perdu son alliance dans les égouts.",
        recompenses: { or: 150, xp: 100 }
    },

    "Q13": {
        nom: "Retrouver le Tableau Volé",
        ville: "Tarant",
        donneur: "Evelyn Garringsburg",
        resume: "Un précieux tableau a été volé chez Evelyn Garringsburg.",
        recompenses: { or: 300, xp: 250, special: "Article dans le journal le lendemain" }
    },

    "Q14": {
        nom: "Wilhelmina et Jared",
        ville: "Tarant / Site du Crash",
        donneur: "Corps de Wilhelmina (site du crash)",
        resume: "Remettre une lettre d'adieu à son petit ami et l'aider à commémorer sa mémoire.",
        recompenses: { or: 0, xp: 100 }
    },

    "Q15": {
        nom: "La Boule de Cristal",
        ville: "Tarant",
        donneur: "Delores Beston",
        resume: "Delores Beston cherche une boule de cristal appartenant à Madame Toussaude.",
        recompenses: { or: 0, xp: 150, special: "Localisation du tableau Garringsburg OU Bénédiction Charisme +1" }
    },

    "Q16": {
        nom: "Le Whisky de Caleb Malloy",
        ville: "Tarant",
        donneur: "Caleb Malloy (Le Bourbier)",
        resume: "Caleb Malloy veut qu'on livre un chargement de whisky.",
        recompenses: { or: 500, xp: 250 }
    },

    "Q17": {
        nom: "Travailler pour Madame Lil",
        ville: "Tarant",
        donneur: "Madame Lil",
        resume: "Madame Lil, tenancière d'un bordel sur Devonshire, offre plusieurs missions.",
        recompenses: { or: 300, xp: 300, special: "Services gratuits de Madame Lil" }
    },

    "Q18": {
        nom: "Mettre Fin au Soulèvement des Orcs",
        ville: "Tarant",
        donneur: "Capitaine Wheeler",
        resume: "Des orcs menés par Donn Throgg se sont barricadés au 15 Ten Hands Alley.",
        recompenses: { or: 0, xp: 300, special: "Résultat variable selon l'approche choisie" }
    },

    "Q19": {
        nom: "Voler la Pierre Funéraire Elfique",
        ville: "Tarant → Ruines Elfiques",
        donneur: "Cassandra Pettibone",
        resume: "Cassandra veut une pierre funéraire dans des ruines elfiques.",
        recompenses: { or: 250, xp: 300 }
    },

    "Q20": {
        nom: "Le Bourbier — Gang de Pollock",
        ville: "Tarant",
        donneur: "Miranda Tears (taverne du Bourbier)",
        resume: "Rejoindre le gang de Pollock et éliminer son rival Damian Maug.",
        recompenses: { or: 1500, xp: 500, items: ["Grenade explosive", "Invigorant", "Canon portable"] }
    },

    "Q21": {
        nom: "Le Bourbier — Gang de Damian Maug",
        ville: "Tarant",
        donneur: "Muggs (taverne du Bourbier)",
        resume: "Rejoindre le gang de Damian Maug et éliminer son rival Pollock.",
        recompenses: { or: 2025, xp: 600 }
    },

    "Q22": {
        nom: "Le Bourbier — Aider Sebastian",
        ville: "Tarant",
        donneur: "M. Willoughsby / Sebastian",
        resume: "Sebastian veut qu'on élimine Damian Maug pour protéger la ville.",
        recompenses: { or: 0, xp: 400, special: "Sebastian rejoint le groupe" }
    },

    "Q23": {
        nom: "La Guilde des Voleurs",
        ville: "Tarant",
        donneur: "Thaddeus Mynor",
        resume: "Rejoindre la Guilde des Voleurs en volant la carte des égouts.",
        recompenses: { or: 300, xp: 300, special: "Accès aux missions de la Guilde des Voleurs" }
    },

    "Q24": {
        nom: "Voler l'Idole d'Or de Kree",
        ville: "Tarant → Kree",
        donneur: "Thaddeus Mynor (Guilde des Voleurs)",
        resume: "La Guilde veut l'idole dorée des barbares de Kree.",
        recompenses: { or: 1000, xp: 400 }
    },

    // ── STILLWATER ────────────────────────────────────────────

    "Q25": {
        nom: "À la Recherche de Cyrus",
        ville: "Stillwater",
        donneur: "Richard Leeks (forgeron)",
        resume: "Le forgeron de Stillwater demande de retrouver Cyrus, le mage qui enchante ses armes.",
        recompenses: { or: 0, xp: 300, items: ["Lame de Stillwater"] }
    },

    "Q26": {
        nom: "Retrouver l'Idole Volée",
        ville: "Stillwater",
        donneur: "Brigitte (prêtresse)",
        resume: "La prêtresse de Stillwater demande de retrouver l'idole sacrée de sa déesse.",
        recompenses: { or: 0, xp: 150, special: "Bénédiction : Beauté +1" }
    },

    // ── BLACK ROOT ────────────────────────────────────────────

    "Q27": {
        nom: "Retrouver Liam Cameron",
        ville: "Black Root",
        donneur: "Mme Cameron",
        resume: "Mme Cameron demande de découvrir ce qui est arrivé à son fils disparu.",
        recompenses: { or: 0, xp: 250, items: ["Chapeau d'Inversion Magnétique ou Dague de Mage"] }
    },

    "Q28": {
        nom: "Le Jeu Ancien",
        ville: "Black Root",
        donneur: "Demi-mage halfelin (sud de la Mairie)",
        resume: "Un mystérieux halfelin propose de jouer à un jeu d'énigmes en plusieurs étapes.",
        recompenses: { or: 0, xp: 200, items: ["Gemme Mystérieuse"] }
    },

    // ── DERNHOLM ──────────────────────────────────────────────

    "Q29": {
        nom: "Collecter les Taxes de Black Root pour le Roi Praetor",
        ville: "Black Root → Dernholm",
        donneur: "Roi Praetor (château de Dernholm)",
        resume: "Le Roi Praetor demande de collecter les taxes de Black Root, qui a changé d'allégeance.",
        recompenses: { or: 200, xp: 300 }
    },

    "Q30": {
        nom: "L'Alliance de Gladys",
        ville: "Dernholm",
        donneur: "Gladys",
        resume: "Gladys veut récupérer une alliance qui appartenait à son fils, portée par Archibald près du quai.",
        recompenses: { or: 0, xp: 100 }
    },

    "Q31": {
        nom: "Adkin Chambers et Sir Garrick Stout",
        ville: "Stillwater → Dernholm",
        donneur: "Adkin Chambers (Stillwater)",
        resume: "Pour devenir Maître de l'Esquive et du Corps à Corps, deux maîtres s'affrontent — il faut les départager.",
        recompenses: { or: 0, xp: 500, special: "Titre : Maître du Corps à Corps + Maître de l'Esquive" }
    },

    "Q32": {
        nom: "Retrouver la Fille du Roi Praetor",
        ville: "Dernholm → Caladon",
        donneur: "Roi Praetor",
        resume: "La princesse Aria est partie à Caladon rejoindre le prince et n'est jamais arrivée.",
        recompenses: { or: 1250, xp: 350, special: "250 or du roi + 1000 or du prince Farad de Caladon" }
    },

    // ── ASHBURY ───────────────────────────────────────────────

    "Q33": {
        nom: "Le Cimetière d'Ashbury",
        ville: "Ashbury",
        donneur: "Geoffry Tarellond-Ashe (entrée du cimetière)",
        resume: "Des morts-vivants se lèvent dans le cimetière d'Ashbury. Découvrir la cause.",
        recompenses: { or: 500, xp: 400 }
    },

    "Q34": {
        nom: "Tuer les Cochons Sauvages",
        ville: "Ashbury",
        donneur: "Theo Brightstart (ferme)",
        resume: "Theo Brightstart demande d'éliminer les cochons sauvages qui ravagent son champ.",
        recompenses: { or: 50, xp: 75 }
    },

    "Q35": {
        nom: "Déplacer les Rochers",
        ville: "Ashbury",
        donneur: "Theo Brightstart (ferme)",
        resume: "Après avoir tué les cochons, Theo demande de débarrasser son champ de cinq gros rochers.",
        recompenses: { or: 50, xp: 50 }
    },

    "Q36": {
        nom: "Récupérer la Cotte de Mailles de Theodore",
        ville: "Ashbury",
        donneur: "Theodore (devant le 12 Trellis Way)",
        resume: "Theodore veut récupérer son armure améliorée dans une maison infestée d'araignées mécaniques.",
        recompenses: { or: 200, xp: 150 }
    },

    // ── ÎLE DU DÉSESPOIR ──────────────────────────────────────

    "Q37": {
        nom: "La Bête Sorcière",
        ville: "Île du Désespoir",
        donneur: "Garde du village",
        resume: "Une bête sorcière attaque le village. Le garde offre une amulette pour l'éliminer.",
        recompenses: { or: 0, xp: 250, items: ["Collier Serpentin"] }
    },

    "Q38": {
        nom: "Objets de Shades Beach",
        ville: "Île du Désespoir",
        donneur: "Jones le Collectionneur",
        resume: "Jones envoie récupérer des objets anciens sur la plage de Shades Beach.",
        recompenses: { or: 0, xp: 100, items: ["Châssis de Pistolet Ancien"] }
    },

    "Q39": {
        nom: "Livrer des Marchandises à Maximillian",
        ville: "Île du Désespoir",
        donneur: "Norian",
        resume: "Norian demande de livrer de l'alcool artisanal à Maximillian au nord.",
        recompenses: { or: 0, xp: 75, items: ["Moonshine à la Pomme de Terre de Norian"] }
    },

    "Q40": {
        nom: "Aider Cynthia Boggs à Fuir l'Île",
        ville: "Île du Désespoir",
        donneur: "Cynthia Boggs",
        resume: "Cynthia Boggs veut fuir l'île et demande de convaincre les femmes nomades de l'aider.",
        recompenses: { or: 0, xp: 200 }
    },

    "Q41": {
        nom: "Informer le Clan de la Roue au Sujet de Thorvald",
        ville: "Île du Désespoir → Clan de la Roue",
        donneur: "Thorvald Two Stones",
        resume: "Thorvald demande d'informer son clan (Wheel Clan) de son emprisonnement sur l'île.",
        recompenses: { or: 0, xp: 100 }
    },

    "Q42": {
        nom: "Informer Lianna Pel Dar au Sujet de Maximillian",
        ville: "Île du Désespoir → Dernholm",
        donneur: "Maximillian",
        resume: "Maximillian, vrai roi de Cumbrie, demande de prévenir Lianna Pel Dar de son existence.",
        recompenses: { or: 0, xp: 100 }
    },

    // ── VOORIDEN ──────────────────────────────────────────────

    "Q43": {
        nom: "Rapporter une Pierre d'Autel de la Carrière de Torin",
        ville: "Vooriden → Carrière de Torin",
        donneur: "Edwin Wallows (prêtre)",
        resume: "Le prêtre d'un temple de Vooriden a besoin d'une nouvelle pierre d'autel depuis la carrière de Torin.",
        recompenses: { or: 0, xp: 150 }
    },

    // ── CLAN DE LA ROUE ───────────────────────────────────────

    "Q44": {
        nom: "Nettoyer la Mine",
        ville: "Clan de la Roue",
        donneur: "Arvid Millstone (contremaître)",
        resume: "Une créature terrifiante dans la mine tue les mineurs nains. L'éliminer.",
        recompenses: { or: 0, xp: 350, special: "Réputation : Héros du Clan de la Roue" }
    },

    "Q45": {
        nom: "Retrouver l'Héritage des Moltenflow",
        ville: "Clan de la Roue",
        donneur: "Vegard Moltenflow",
        resume: "Un héritage familial a été oublié dans la Drague. Vegard demande de le récupérer.",
        recompenses: { or: 0, xp: 150, items: ["Casque de Mineur"] }
    },

    "Q46": {
        nom: "Thrayne veut que son Frère Rentre à la Maison",
        ville: "Clan de la Roue → Clan des Tailleurs de Pierre",
        donneur: "Thrayne Iron Heart",
        resume: "Thrayne demande de retrouver son frère Erland au Clan des Tailleurs de Pierre et de le convaincre de revenir.",
        recompenses: { or: 0, xp: 200 }
    },

    // ── QUINTARRA ─────────────────────────────────────────────

    "Q47": {
        nom: "Enquêter sur le Meurtre de Wrath",
        ville: "Quintarra",
        donneur: "Jormund (serviteur de Wrath)",
        resume: "L'elfe Wrath a été assassiné. Innocenter Jormund en trouvant le vrai coupable.",
        recompenses: { or: 0, xp: 400, items: ["Bâton de Xoranth"], special: "Jormund peut rejoindre le groupe" }
    },

    "Q48": {
        nom: "Libérer l'Elfe des Bedokaan",
        ville: "Quintarra → Village Bedokaan",
        donneur: "Winde",
        resume: "Un membre de la patrouille de chasse a disparu, capturé par les Bedokaan.",
        recompenses: { or: 0, xp: 300, items: ["Cotte de Mailles Elfique"] }
    },

    "Q49": {
        nom: "Trouver une Essence de Luciole de Volar pour Whysper",
        ville: "Quintarra",
        donneur: "Whysper",
        resume: "Whysper a besoin d'une essence rare de Luciole de Volar pour ses recherches.",
        recompenses: { or: 0, xp: 150, items: ["Parchemin de Secours aux Bêtes"] }
    },

    "Q50": {
        nom: "Obtenir du Minerai de Mithril pour Ellumyn",
        ville: "Quintarra → Clan de la Roue",
        donneur: "Ellumyn (boutique)",
        resume: "Ellumyn offre son arc légendaire en échange de minerai de mithril du Clan de la Roue.",
        recompenses: { or: 0, xp: 200, items: ["Arc d'Ellumyn"] }
    },

    // ── ROSEBOROUGH ───────────────────────────────────────────

    "Q51": {
        nom: "Photographier le Wyvern de Lethe",
        ville: "Roseborough",
        donneur: "Trevor Lynwood (auberge de Roseborough)",
        resume: "Un journaliste du Tarantien veut une photo du Wyvern de Lethe mais a eu trop peur de s'approcher.",
        recompenses: { or: 300, xp: 200 }
    },

    // ── CALADON ───────────────────────────────────────────────

    "Q52": {
        nom: "Libérer J.T. Morgan",
        ville: "Caladon",
        donneur: "Mme Morgan (Roseborough)",
        resume: "Mme Morgan demande de libérer son fils emprisonné dans la prison haute sécurité de Caladon.",
        recompenses: { or: 0, xp: 300, special: "Titre : Maître Serrurier" }
    },

    "Q53": {
        nom: "Découvrir ce qui Tue les Lapins de David",
        ville: "Caladon",
        donneur: "David Wit (ferme à l'ouest de Caladon)",
        resume: "Les lapins de David Wit sont tués mystérieusement. Il faut découvrir le coupable.",
        recompenses: { or: 1000, xp: 350 }
    },

    "Q54": {
        nom: "Prouver que les Machines Volantes de Maxim ont Volé",
        ville: "Caladon → Site du Crash",
        donneur: "Hieronymous Maxim (laboratoire, nord-ouest de Caladon)",
        resume: "Maxim a besoin d'une preuve que ses dirigeables ont fonctionné pour convaincre les conseillers du roi.",
        recompenses: { or: 0, xp: 300, items: ["Arachnide Médical + Schéma de fabrication"] }
    },

    "Q55": {
        nom: "Négociations avec Caladon",
        ville: "Tarant → Caladon",
        donneur: "M. Willoughsby (19 Pickwick Alley, Tarant)",
        resume: "Représenter Tarant dans les négociations d'adhésion de Caladon au Royaume-Uni.",
        recompenses: { or: 7000, xp: 600, special: "Titre : Maître de la Persuasion (montant variable selon les termes négociés)" }
    },

    "Q56": {
        nom: "Résoudre les Meurtres de Caladon",
        ville: "Caladon",
        donneur: "Inspecteur Henderson (Quartier Général de la Police)",
        resume: "Une série de meurtres inexpliqués secoue Caladon. Trouver le démon responsable et l'éliminer.",
        recompenses: { or: 2000, xp: 700 }
    },

    "Q57": {
        nom: "Découvrir la Vérité sur les Panarii",
        ville: "Caladon → Roseborough",
        donneur: "Prêtres du Temple Panarii (Caladon)",
        resume: "Après la révélation sur Nasrudin, les prêtres demandent de découvrir la vérité sur Saint Mannox.",
        recompenses: { or: 0, xp: 300, items: ["Doigt de Mannox (amulette magique puissante)"] }
    },

    "Q58": {
        nom: "Enquête pour Lillian Misk",
        ville: "Caladon → Tarant → Ashbury",
        donneur: "Lillian Misk (Caladon)",
        resume: "Lillian Misk demande de découvrir qui a révélé que son mari possédait le livre maudit.",
        recompenses: { or: 0, xp: 250 }
    },

    // ── T'SEN ANG ─────────────────────────────────────────────

    "Q59": {
        nom: "Libérer les Ogres",
        ville: "T'sen Ang",
        donneur: "Maug Maulman (esclave ogre)",
        resume: "Trois ogres sont retenus en esclavage par un mage elfe. Éliminer le mage pour les libérer.",
        recompenses: { or: 0, xp: 300 }
    },

    // ── TEMPLE ANCIEN ─────────────────────────────────────────

    "Q60": {
        nom: "Libérer Torian Kel de la Malédiction",
        ville: "Temple Ancien (nord-est de Tarant)",
        donneur: "Squelette en décomposition (Torian Kel)",
        resume: "Un squelette maudit dans un temple ancien demande du sang de dragon pour être libéré.",
        recompenses: { or: 0, xp: 400, special: "Torian Kel peut rejoindre le groupe" }
    }

};
