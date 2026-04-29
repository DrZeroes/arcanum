// ================= DONNÉES DU MONDE =================

// ── ENTRAÎNEURS DE COMPÉTENCES ────────────────────────────────────────────────
// Chaque entrée : skill (id), rang (1=Apprenti/2=Expert/3=Maître),
// seuil (points requis auto-vérifiés), cout (or, 0 si quête), quete (ID ou null)
const entreineursData = {

    // ── MÊLÉE ──
    "entraineur_melee_A": {
        nom: "Ser Aldric le Vétéran", skill: "melee", rang: 1,
        cout: 200, quete: null,
        ville: "Shrouded Hills",
        phrase: "Un bon soldat ? Il faut d'abord apprendre à tenir son arme."
    },
    "entraineur_melee_E": {
        nom: "Ser Aldric le Vétéran", skill: "melee", rang: 2,
        cout: 0, quete: "Q31",
        ville: "Dernholm",
        phrase: "Je ne transmets mon art qu'à ceux qui ont prouvé leur valeur au combat. Revenez avec des preuves."
    },
    "entraineur_melee_M": {
        nom: "Adkin Chambers", skill: "melee", rang: 3,
        cout: 0, quete: "Q31",
        ville: "Stillwater",
        phrase: "Vaincre Sir Garrick ? Alors vous méritez le titre de Maître."
    },

    // ── ARC ──
    "entraineur_arc_A": {
        nom: "Ellumyn l'Archer", skill: "arc", rang: 1,
        cout: 150, quete: null,
        ville: "Quintarra",
        phrase: "Tenir un arc sans formation, c'est comme viser les étoiles les yeux fermés."
    },
    "entraineur_arc_E": {
        nom: "Ellumyn l'Archer", skill: "arc", rang: 2,
        cout: 800, quete: null,
        ville: "Quintarra",
        phrase: "Vos progrès sont notables. Pour 800 pièces, je vous montrerai les techniques avancées."
    },
    "entraineur_arc_M": {
        nom: "Ellumyn l'Archer", skill: "arc", rang: 3,
        cout: 0, quete: "Q50",
        ville: "Quintarra",
        phrase: "Trouvez-moi du mithril et je vous révèle les secrets de l'arc elfique ancestral."
    },

    // ── ESQUIVE ──
    "entraineur_esquive_A": {
        nom: "Lukan le Fugitif", skill: "esquive", rang: 1,
        cout: 100, quete: null,
        ville: "Tarant",
        phrase: "Se battre, c'est bien. Ne pas être touché, c'est mieux."
    },
    "entraineur_esquive_E": {
        nom: "Lukan le Fugitif", skill: "esquive", rang: 2,
        cout: 600, quete: null,
        ville: "Tarant",
        phrase: "Je peux vous apprendre à lire les attaques avant qu'elles arrivent. Ça a un prix."
    },
    "entraineur_esquive_M": {
        nom: "Adkin Chambers", skill: "esquive", rang: 3,
        cout: 0, quete: "Q31",
        ville: "Stillwater",
        phrase: "L'esquive parfaite n'est pas un réflexe — c'est un état d'esprit. Montrez-le-moi."
    },

    // ── LANCER ──
    "entraineur_lancer_A": {
        nom: "Hilda Ferrebombe", skill: "lancer", rang: 1,
        cout: 200, quete: null,
        ville: "Tarant",
        phrase: "La précision avec des explosifs ? Commençons par les bases."
    },
    "entraineur_lancer_E": {
        nom: "Hilda Ferrebombe", skill: "lancer", rang: 2,
        cout: 750, quete: null,
        ville: "Tarant",
        phrase: "Trajectoires en arc, compensation du vent... ça s'apprend. Pour 750 or."
    },
    "entraineur_lancer_M": {
        nom: "Hilda Ferrebombe", skill: "lancer", rang: 3,
        cout: 1500, quete: null,
        ville: "Tarant",
        phrase: "Maîtrise absolue du lancer ? Je n'ai pas eu beaucoup d'élèves à ce niveau."
    },

    // ── ATTAQUE SOURNOISE ──
    "entraineur_attaque_sournoise_A": {
        nom: "Thaddeus Mynor", skill: "attaque_sournoise", rang: 1,
        cout: 0, quete: "Q23",
        ville: "Tarant",
        phrase: "Rejoignez la Guilde et je vous apprendrai à frapper en premier — et à toucher."
    },
    "entraineur_attaque_sournoise_E": {
        nom: "Thaddeus Mynor", skill: "attaque_sournoise", rang: 2,
        cout: 500, quete: null,
        ville: "Tarant",
        phrase: "Deux fois plus vite, deux fois plus silencieux. Pour les membres de la Guilde seulement."
    },
    "entraineur_attaque_sournoise_M": {
        nom: "Thaddeus Mynor", skill: "attaque_sournoise", rang: 3,
        cout: 0, quete: "Q24",
        ville: "Tarant",
        phrase: "Ramenez l'idole de Kree et je vous transmettrai le coup parfait."
    },

    // ── VOL À LA TIRE ──
    "entraineur_vol_a_la_tire_A": {
        nom: "Thaddeus Mynor", skill: "vol_a_la_tire", rang: 1,
        cout: 0, quete: "Q23",
        ville: "Tarant",
        phrase: "Prouvez-moi que vous pouvez entrer dans la Guilde, et je vous apprendrai à vider des poches."
    },
    "entraineur_vol_a_la_tire_E": {
        nom: "Miranda Tears", skill: "vol_a_la_tire", rang: 2,
        cout: 400, quete: null,
        ville: "Tarant (Le Bourbier)",
        phrase: "Doigts agiles, regard fuyant. 400 or pour les astuces avancées."
    },
    "entraineur_vol_a_la_tire_M": {
        nom: "Miranda Tears", skill: "vol_a_la_tire", rang: 3,
        cout: 0, quete: "Q20",
        ville: "Tarant (Le Bourbier)",
        phrase: "Aidez Pollock à régler ses affaires et je vous montrerai comment voler sans même être vu."
    },

    // ── DISCRÉTION ──
    "entraineur_discretion_A": {
        nom: "Lukan le Fugitif", skill: "discretion", rang: 1,
        cout: 150, quete: null,
        ville: "Tarant",
        phrase: "Se fondre dans l'ombre, ça s'apprend."
    },
    "entraineur_discretion_E": {
        nom: "Lukan le Fugitif", skill: "discretion", rang: 2,
        cout: 500, quete: null,
        ville: "Tarant",
        phrase: "Pour les experts : rester invisible même sous la lumière."
    },
    "entraineur_discretion_M": {
        nom: "Lukan le Fugitif", skill: "discretion", rang: 3,
        cout: 1200, quete: null,
        ville: "Tarant",
        phrase: "La maîtrise de la discrétion, c'est devenir une ombre parmi les ombres."
    },

    // ── DÉTECTION DE PIÈGE ──
    "entraineur_detection_piege_A": {
        nom: "Constable Owens", skill: "detection_piege", rang: 1,
        cout: 100, quete: null,
        ville: "Shrouded Hills",
        phrase: "Les mines autour de la ville m'ont appris à voir les pièges avant qu'ils me voient."
    },
    "entraineur_detection_piege_E": {
        nom: "Constable Owens", skill: "detection_piege", rang: 2,
        cout: 0, quete: "Q07",
        ville: "Shrouded Hills",
        phrase: "Aidez-moi avec le pont et je vous apprendrai les techniques avancées."
    },
    "entraineur_detection_piege_M": {
        nom: "Ingrid la Démineure", skill: "detection_piege", rang: 3,
        cout: 2000, quete: null,
        ville: "Tarant",
        phrase: "Je suis la seule à avoir survécu à l'atelier Boyle. Je peux vous apprendre pourquoi."
    },

    // ── MARCHANDAGE ──
    "entraineur_marchandage_A": {
        nom: "Madame Lil", skill: "marchandage", rang: 1,
        cout: 200, quete: null,
        ville: "Tarant",
        phrase: "Dans mon métier, tout se négocie. Je peux vous montrer comment."
    },
    "entraineur_marchandage_E": {
        nom: "Madame Lil", skill: "marchandage", rang: 2,
        cout: 0, quete: "Q17",
        ville: "Tarant",
        phrase: "Faites quelques courses pour moi et je vous apprendrai à tirer le meilleur des marchés."
    },
    "entraineur_marchandage_M": {
        nom: "M. Wright", skill: "marchandage", rang: 3,
        cout: 1000, quete: null,
        ville: "Tarant",
        phrase: "Vingt ans au Journal Tarantien m'ont appris que tout a un prix — et qu'on peut toujours négocier."
    },

    // ── PERSUASION ──
    "entraineur_persuasion_A": {
        nom: "Doc Roberts", skill: "persuasion", rang: 1,
        cout: 150, quete: null,
        ville: "Shrouded Hills",
        phrase: "La médecine, c'est aussi convaincre les gens que ça va aller."
    },
    "entraineur_persuasion_E": {
        nom: "M. Willoughsby", skill: "persuasion", rang: 2,
        cout: 500, quete: null,
        ville: "Tarant",
        phrase: "La rhétorique avancée s'enseigne à la Mairie. Pour ceux qui en ont les moyens."
    },
    "entraineur_persuasion_M": {
        nom: "M. Willoughsby", skill: "persuasion", rang: 3,
        cout: 0, quete: "Q55",
        ville: "Tarant",
        phrase: "Réussissez les négociations avec Caladon et je vous proclame Maître de la Persuasion."
    },

    // ── SOINS ──
    "entraineur_soins_A": {
        nom: "Sœur Thérèse", skill: "soins", rang: 1,
        cout: 100, quete: null,
        ville: "Tarant",
        phrase: "Appliquer un bandage ne s'improvise pas."
    },
    "entraineur_soins_E": {
        nom: "Sœur Thérèse", skill: "soins", rang: 2,
        cout: 400, quete: null,
        ville: "Tarant",
        phrase: "Herbes, dosages, contra-indications... Pour ceux qui veulent vraiment soigner."
    },
    "entraineur_soins_M": {
        nom: "Hieronymous Maxim", skill: "soins", rang: 3,
        cout: 0, quete: "Q54",
        ville: "Caladon",
        phrase: "L'arachnide médical que je fabriquais nécessite une maîtrise parfaite des soins. Prouvez-le-moi."
    },

    // ── JEU ──
    "entraineur_jeu_A": {
        nom: "Jacob Bens", skill: "jeu", rang: 1,
        cout: 50, quete: null,
        ville: "Shrouded Hills (Auberge)",
        phrase: "Je vous apprendrai comment lire les autres joueurs. Pour presque rien."
    },
    "entraineur_jeu_E": {
        nom: "Caleb Malloy", skill: "jeu", rang: 2,
        cout: 300, quete: null,
        ville: "Tarant (Le Bourbier)",
        phrase: "Au Bourbier, on joue pour de vrai. Je vous montrerai les astuces des professionnels."
    },
    "entraineur_jeu_M": {
        nom: "Caleb Malloy", skill: "jeu", rang: 3,
        cout: 0, quete: "Q16",
        ville: "Tarant (Le Bourbier)",
        phrase: "Livrez mon whisky et je vous apprendrai à ne jamais perdre."
    },

    // ── RÉPARATION ──
    "entraineur_reparation_A": {
        nom: "Lloyd (forgeron)", skill: "reparation", rang: 1,
        cout: 100, quete: null,
        ville: "Shrouded Hills",
        phrase: "Savoir réparer ce qu'on a, c'est la première chose qu'un aventurier doit apprendre."
    },
    "entraineur_reparation_E": {
        nom: "Lloyd (forgeron)", skill: "reparation", rang: 2,
        cout: 0, quete: "Q06",
        ville: "Shrouded Hills",
        phrase: "Fabriquez-moi du pur alliage et je vous montrerai comment travailler les métaux fins."
    },
    "entraineur_reparation_M": {
        nom: "Barnabé le Marteleur", skill: "reparation", rang: 3,
        cout: 1500, quete: null,
        ville: "Tarant",
        phrase: "Maîtrise totale de la forge et de la réparation. Rares sont ceux qui atteignent ce niveau."
    },

    // ── ARMES À FEU ──
    "entraineur_armes_a_feu_A": {
        nom: "Richard Leeks (forgeron)", skill: "armes_a_feu", rang: 1,
        cout: 200, quete: null,
        ville: "Stillwater",
        phrase: "Savoir charger un pistolet, c'est déjà quelque chose."
    },
    "entraineur_armes_a_feu_E": {
        nom: "Richard Leeks (forgeron)", skill: "armes_a_feu", rang: 2,
        cout: 700, quete: null,
        ville: "Stillwater",
        phrase: "Entretien, cadence, précision sous pression... la formation avancée."
    },
    "entraineur_armes_a_feu_M": {
        nom: "Richard Leeks (forgeron)", skill: "armes_a_feu", rang: 3,
        cout: 0, quete: "Q25",
        ville: "Stillwater",
        phrase: "Retrouvez Cyrus et il enchântera vos armes. C'est tout ce qu'il me reste à vous apprendre."
    },

    // ── CROCHETAGE ──
    "entraineur_crochetage_A": {
        nom: "Thaddeus Mynor", skill: "crochetage", rang: 1,
        cout: 0, quete: "Q23",
        ville: "Tarant",
        phrase: "Pour entrer dans la Guilde, il faut déjà savoir crocheter une serrure."
    },
    "entraineur_crochetage_E": {
        nom: "J.T. Morgan", skill: "crochetage", rang: 2,
        cout: 0, quete: "Q52",
        ville: "Caladon (Prison)",
        phrase: "Si vous pouvez m'atteindre ici, vous méritez les secrets du métier."
    },
    "entraineur_crochetage_M": {
        nom: "J.T. Morgan", skill: "crochetage", rang: 3,
        cout: 0, quete: "Q52",
        ville: "Caladon",
        phrase: "Libérez-moi et je ferai de vous le meilleur serrurier de tout Arcanum."
    },

    // ── DÉSAMORÇAGE DE PIÈGE ──
    "entraineur_desamorcage_A": {
        nom: "Constable Owens", skill: "desamorcage", rang: 1,
        cout: 100, quete: null,
        ville: "Shrouded Hills",
        phrase: "Neutraliser un piège, ça demande de la méthode."
    },
    "entraineur_desamorcage_E": {
        nom: "Hilda Ferrebombe", skill: "desamorcage", rang: 2,
        cout: 500, quete: null,
        ville: "Tarant",
        phrase: "Mécanismes complexes, désamorçage sous pression. Cours avancé."
    },
    "entraineur_desamorcage_M": {
        nom: "Ingrid la Démineure", skill: "desamorcage", rang: 3,
        cout: 2500, quete: null,
        ville: "Tarant",
        phrase: "Maîtrise absolue du désamorçage. Vous pourrez désamorcer n'importe quoi, n'importe où."
    }
};

// ── INTERACTION AVEC UN ENTRAÎNEUR ───────────────────────────────────────────
function ouvrirEntraineur(idEntraineur) {
    const e = entreineursData[idEntraineur];
    if (!e) { _toast('Entraîneur introuvable.', 'error'); return; }

    if (!perso.rangsComp) perso.rangsComp = {};

    const rangActuel  = perso.rangsComp[e.skill] || 0;
    const investi     = (perso.compInvesties && perso.compInvesties[e.skill]) || 0;
    const seuil       = SEUILS_RANGS[e.rang];
    const rangInfo    = RANGS[e.rang];
    const nomRang     = rangInfo.nom;

    // Déjà ce rang ou supérieur
    if (rangActuel >= e.rang) {
        _toast(`${e.nom} : Vous avez déjà le rang ${RANGS[rangActuel].nom} (ou supérieur) en ${e.skill}.`);
        return;
    }
    // Rang pas encore accessible (doit avoir rang précédent)
    if (e.rang > rangActuel + 1) {
        _toast(`${e.nom} : Obtenez d'abord le rang ${RANGS[e.rang - 1].nom} avant de prétendre à ${nomRang}.`, 'error');
        return;
    }
    // Points insuffisants
    if (investi < seuil) {
        _toast(`${e.nom} : "${e.phrase}" — Requis : ${seuil} points en ${e.skill} (actuel : ${investi}).`, 'error');
        return;
    }
    // Quête requise
    if (e.quete) {
        _toast(`${e.nom} : "${e.phrase}" — Cette formation requiert la quête ${e.quete}.`);
        return;
    }
    // Formation payante
    if (e.cout > 0) {
        if ((perso.argent || 0) < e.cout) {
            _toast(`${e.nom} : Cette formation coûte ${e.cout} or. Vous n'en avez pas assez.`, 'error');
            return;
        }
        if (!confirm(`${e.nom} vous propose la formation ${nomRang} en "${e.skill}" pour ${e.cout} or.\n\nAccepter ?`)) return;
        perso.argent -= e.cout;
    }

    octroierRang('comp', e.skill, e.rang, e.cout === 0);
}

const coffresFixes = {
    "site_crash": {
        nom: "Trouvé sur les cadavres",
        items: [
            { id: "XXX02", qte: 1 }, 
            { id: "XXX03", qte: 1 }
        ]
    }, // <-- Virgule ajoutée ici
    "coffre_de_mine": {
        nom: "Caisse de Minage",
        items: [
            { id: "COMP02", qte: 8 },  // Minerai de fer
            { id: "COMP08", qte: 12 }, // Charbon
            { id: "OR_PIECES", qte: 45 },
            { id: "AM15", qte: 1 }     // Barre de fer
        ]
    },
    "coffre_standard": {
        nom: "Coffre en fer",
        items: genererLootAleatoire(3, 3) 
    },
    "poubelle_commune": {
        nom: "Poubelle de ruelle",
        items: [
            { id: "OR_PIECES", qte: 8 },
            { id: "COMP08", qte: 1 },  // Charbon
            { id: "COMP21", qte: 1 },  // Boîte en métal
            { id: "COMP65", qte: 1 }   // Vin
        ]
    }
};

const marchandsData = {
    "Ristezze": {
        nom: "Ristezze (Triste Colline)",
        argent: 500,
        inventaire: [
            { id: "AM06", qte: 1 }, { id: "DEF05", qte: 1 }, 
            { id: "MUN01", qte: 100 }, { id: "TEC02", qte: 2 }
        ]
    },
    "marchand_tuto": {
        nom: "marchand du zephyr",
        argent: 500,
        inventaire: [
            { id: "AM01", qte: 1 }, { id: "AM04", qte: 1 }, { id: "AM05", qte: 1 }, 
            { id: "AM06", qte: 1 }, { id: "AM07", qte: 1 }, { id: "AM08", qte: 1 }, 
            { id: "AM09", qte: 1 }, { id: "AM10", qte: 1 }, { id: "AD01", qte: 1 }, 
            { id: "AD02", qte: 1 }, { id: "AF02", qte: 1 }, { id: "DEF01", qte: 1 }, 
            { id: "DEF04", qte: 1 }, { id: "DEF05", qte: 1 }, { id: "DEF06", qte: 1 }, 
            { id: "DEF07", qte: 1 }, { id: "DEF08", qte: 1 }, { id: "DEF09", qte: 1 }, 
            { id: "DEF10", qte: 1 }, { id: "DEF11", qte: 1 }, { id: "CONS03", qte: 5 }, 
            { id: "CONS04", qte: 5 }, { id: "MUN01", qte: 50 }, { id: "MUN02", qte: 50 }
        ]
    }, // <-- Virgule ajoutée ici
    "forgeron_1": {
        nom: "Barnabé le Marteleur",
        argent: 1200,
        phrase: "Si c'est pas en fer, ça sert à rien !",
        inventaire: [
            { id: "COMP01", qte: 10 }, 
            { id: "COMP02", qte: 15 }, 
            { id: "COMP04", qte: 5 },  
            { id: "COMP09", qte: 5 },  
            { id: "AM06", qte: 2 },    
            { id: "AM10", qte: 2 },    
            { id: "DEF11", qte: 1 }     
        ]
    },
    "alchimiste_1": {
        nom: "Sœur Thérèse",
        argent: 850,
        phrase: "Les remèdes de la terre valent mieux que les machines.",
        inventaire: [
            { id: "CONS03", qte: 10 }, 
            { id: "CONS04", qte: 10 }, 
            { id: "COMP05", qte: 25 }, 
            { id: "COMP06", qte: 25 }, 
            { id: "COMP51", qte: 5 },  
            { id: "CONS07", qte: 3 }   
        ]
    },
    "camelot_1": {
        nom: "Gredin le Vieux",
        argent: 350,
        phrase: "De tout et de rien, mais surtout pour votre or !",
        inventaire: [
            { id: "AM07", qte: 2 },
            { id: "DEF06", qte: 2 },
            { id: "DIV12", qte: 1 },
            { id: "COMP08", qte: 10 },
            { id: "MUN01", qte: 30 },
            { id: "BIJ02", qte: 1 },
            { id: "COMP65", qte: 5 }
        ]
    },
    "mage_identif": {
        nom: "Elara la Déchiffreuse",
        argent: 2000,
        phrase: "Aucun secret ne résiste à mon regard.",
        estMarchandMagique: true,
        prixIdentification: 150,
        inventaire: [
            { id: "AM03", qte: 1 },
            { id: "AD04", qte: 1 },
            { id: "DEF03", qte: 1 },
            { id: "DEF12", qte: 1 },
            { id: "AM05", qte: 1 }
        ]
    }
}; 

// Fonction utilitaire pour générer du loot aléatoire
function genererLootAleatoire(niveauRareteMax = 10, nombreObjets = 5) {
    let loot = [];
    
    // Sécurité : vérifier si itemsData existe
    if (typeof itemsData === 'undefined') return loot;

    let cles = Object.keys(itemsData).filter(k => {
        let item = itemsData[k];
        return item.lootable === true && (parseInt(item.rarete) <= niveauRareteMax);
    });
    
    for (let i = 0; i < nombreObjets; i++) {
        if (cles.length === 0) break;
        let idAleatoire = cles[Math.floor(Math.random() * cles.length)];
        let itemTemplate = itemsData[idAleatoire];
        
        loot.push({ 
            id: idAleatoire, 
            qte: itemTemplate.stackable ? Math.floor(Math.random() * 5) + 1 : 1 
        });
    }

    if (Math.random() < 0.8) {
        let minOr = niveauRareteMax * 5;
        let maxOr = niveauRareteMax * 25;
        let montantOr = Math.floor(Math.random() * (maxOr - minOr + 1)) + minOr;
        loot.push({ id: "OR_PIECES", qte: montantOr });
    }
    
    return loot;
}


const lieuxDecouverts = {
    "tarante": { nom: "Tarante", x: 51.5, y: 51.1, musique: "Tarant.mp3",fond: "tarante.jpg", desc: "La cité industrielle.", estVille: true },
    "tris": { nom: "Triste Colline", x: 30.5, y: 65.4, musique: "Villages.mp3",fond: "trist_coll.jpg", desc: "Un petit village minier.", estVille: true },
    "crash": { nom: "Site du Crash", x: 27.3, y: 62.8, musique: "Interlude.mp3",fond: "crash.jpg",desc: "Le Zephyr est tombé ici." },
    "arba": { nom: "Demeure d'Arbalah", x: 28.1, y: 64.1, musique: "Wilderness.mp3",fond: "arbalah.jpg",desc: "Maison d'un vieil ermite." },
    "simon": { nom: "Maison de Simon", x: 27.1, y: 65.9, musique: "Wilderness.mp3",fond: "simon.jpg", desc: "Domicile de Simon" },
	"cendre": { nom: "Cendrebourg", x: 74.3, y: 55.2, musique: "Cities.mp3",fond: "cendrebourg.jpg",desc: "Une ville sombre et mystérieuse.", estVille: true },
	"caladon": { nom: "Caladon", x: 20.3, y: 90.1, musique: "Caladon.mp3",fond: "simon.jpg", desc: "Grande Ville", estVille: true },
	"dern": { nom: "Dernholm", x: 38.6, y: 81.4, musique: "Cities.mp3",fond: "dernholm.jpg", desc: "Ville", estVille: true },
	"roue": { nom: "Clan de la roue", x: 51.2, y: 34.1, musique: "DwarvenMusic.mp3",fond: "roue.jpg", desc: "Mine de Nains" },
	"mnoir": { nom: "Mines du Mont Noir", x: 35.2, y: 38.4, musique: "DwarvenMusic.mp3",fond: "montnoir.jpg", desc: "Mine de Nains" },
	"rnoir": { nom: "Racine noir", x: 45.0, y: 71.5, musique: "Towns.mp3",fond: "racinenoir.jpg", desc: "Petite ville", estVille: true },
	"eaud": { nom: "Eau Dormante", x: 41.2, y: 38.0, musique: "Villages.mp3",fond: "eaudor.jpg", desc: "Charmant Village", estVille: true },
	"quin": { nom: "Quintara", x: 21.8, y: 35.8, musique: "Qintara.mp3",fond: "quintara.jpg", desc: "Village caché des elfes", estVille: true },
	"tsen": { nom: "T'sen-Ang", x: 25.4, y: 15.3, musique: "Qintara.mp3",fond: "tsenang.jpg", desc: "Village caché des elfes noires", estVille: true },
	"tulla": { nom: "Tulla", x: 77.0, y: 24.7, musique: "Tulla.mp3",fond: "tulla.jpg", desc: "Cité de la magie", estVille: true },
	"dese": { nom: "Ile du désespoir", x: 83.2, y: 43.0, musique: "Isle_of_Despair.mp3",fond: "desespoir.jpg", desc: "Ile bannis" },
	"demogre": { nom: "Ile des demi-ogres", x: 54.5, y: 84.1, musique: "Isle_of_Despair.mp3",fond: "demogre.jpg", desc: "étrange île" },
	"rose": { nom: "Rosebourg", x: 13.6, y: 74.5, musique: "Towns.mp3",fond: "_placeholder.jpg", desc: "Petite ville", estVille: true },
	"naz": { nom: "Cabane sur Thanatos", x: 63.2, y: 92.3, musique: "Wilderness.mp3",fond: "_placeholder.jpg", desc: "Vieille maison au bout de Thanathos" },
	"vend": { nom: "Ruines de Vendigroth", x: 84.3, y: 29.2, musique: "Vendegoth.mp3",fond: "_placeholder.jpg", desc: "Ancienens ruines" },
	"bedo": { nom: "Village bédokien", x: 41.2, y: 17.1, musique: "Villages.mp3",fond: "_placeholder.jpg", desc: "un village primitif", estVille: true },
	"cmpF": { nom: "Camp des femmes", x: 84.1, y: 40.5, musique: "Isle_of_Despair.mp3",fond: "_placeholder.jpg", desc: "camp d'amazone" },
	"max": { nom: "Demeure de Maximilien", x: 81.1, y: 42.6, musique: "Isle_of_Despair.mp3",fond: "_placeholder.jpg", desc: "Maison au milieu de nulle part" },	
	"crik": { nom: "Crique de Pierre latige", x: 68.1, y: 65.8, musique: "Wilderness.mp3",fond: "_placeholder.jpg", desc: "Vieille crique" },
	"tres": { nom: "Trésor de Pierre latige", x: 60.7, y: 64.9, musique: "Wilderness.mp3",fond: "_placeholder.jpg", desc: "tombe sous una arbre" },
	"atel": { nom: "Atelier de lambert", x: 42.1, y: 73.8, musique: "Wilderness.mp3",fond: "_placeholder.jpg", desc: "Maison d'un inventeur" },
	"than": { nom: "Thanatos", x: 67.8, y: 79.5, musique: "Wilderness.mp3",fond: "thana.jpg", desc: "Ile mystérieuse" }


}; // <--- IL MANQUAIT CECI ICI

// ================= PERSONNAGES PNJ (inspirés d'Arcanum) =================
// Structure identique à window.perso — utilisable directement par le MJ.
// pvMax = (FO*2) + IN + boostPV  |  ftMax = (CN*2) + IN + boostFT

const personnagesNPC = {

    "virgil": {
        nom: "Virgil", race: "Humain", sexe: "M", niveau: 1,
        antecedent: "Prêtre déchu de Panari cherchant à se racheter.",
        statsBase:    { FO:8, IN:8, CN:8, DX:8, CH:8 },
        statsInvesties:{ FO:0, IN:0, CN:0, DX:0, CH:0 },
        magieInvesties: { "Nécromancie blanche": 1 },
        // Commence niveau 1 avec 1 sort en Nécromancie blanche (Soins légers)
        compInvesties: { soins:1 },
        equipement: {
            tete: null, torse: { id:"DEF07", quantite:1, durabilite:100, durabiliteMax:100 },
            gants: null, bottes: { id:"DEF06", quantite:1, durabilite:100, durabiliteMax:100 },
            anneau: null, amulette: null,
            main_droite: null,
            main_gauche: null,
            deux_mains: { id:"AM05", quantite:1, durabilite:100, durabiliteMax:100 }
        },
        pvActuel: 24, ftActuel: 24, boostPV: 0, boostFT: 0,
        argent: 65, inventaire: [ { id:"CONS03", quantite:3 } ]
    },

    "magnus": {
        nom: "Magnus", race: "Nain", sexe: "M", niveau: 7,
        antecedent: "Forgeron nain en quête de sens après la chute de sa mine.",
        statsBase:    { FO:9, IN:8, CN:9, DX:7, CH:7 },
        statsInvesties:{ FO:4, IN:1, CN:2, DX:1, CH:0 },
        // Totaux : FO:13 IN:9 CN:11 DX:8 CH:7 — pvMax:35 ftMax:31
        compInvesties: { melee:4, reparation:3 },
        equipement: {
            tete: { id:"DEF11", quantite:1, durabilite:100, durabiliteMax:100 },
            torse: { id:"DEF09", quantite:1, durabilite:100, durabiliteMax:100 },
            gants: { id:"DEF12", quantite:1, durabilite:100, durabiliteMax:100 },
            bottes: { id:"DEF06", quantite:1, durabilite:100, durabiliteMax:100 },
            anneau: null, amulette: null,
            main_droite: { id:"AM10", quantite:1, durabilite:100, durabiliteMax:100 },
            main_gauche: { id:"DEF08", quantite:1, durabilite:100, durabiliteMax:100 }
        },
        pvActuel: 35, ftActuel: 31, boostPV: 0, boostFT: 0,
        argent: 120, inventaire: [ { id:"COMP02", quantite:5 } ]
    },

    "sogg": {
        nom: "Sogg Hydromel", race: "Demi-Ogre", sexe: "M", niveau: 5,
        antecedent: "Bagarreur de taverne au cœur simple mais aux poings redoutables.",
        statsBase:    { FO:9, IN:8, CN:9, DX:8, CH:6 },
        statsInvesties:{ FO:5, IN:0, CN:3, DX:0, CH:0 },
        // Totaux : FO:14 IN:8 CN:12 DX:8 CH:6 — pvMax:36 ftMax:32
        compInvesties: { melee:5, esquive:2 },
        equipement: {
            tete: null,
            torse: { id:"DEF05", quantite:1, durabilite:70, durabiliteMax:100 },
            gants: null,
            bottes: { id:"DEF06", quantite:1, durabilite:60, durabiliteMax:100 },
            anneau: null, amulette: null,
            main_droite: { id:"AM01", quantite:1, durabilite:80, durabiliteMax:100 },
            main_gauche: null
        },
        pvActuel: 36, ftActuel: 32, boostPV: 0, boostFT: 0,
        argent: 18, inventaire: [ { id:"COMP65", quantite:2 } ]
    },

    "vollinger": {
        nom: "Vollinger", race: "Humain", sexe: "M", niveau: 8,
        antecedent: "Mercenaire froid et méthodique, le meilleur tireur à l'ouest de Tarante.",
        statsBase:    { FO:8, IN:8, CN:8, DX:8, CH:8 },
        statsInvesties:{ FO:1, IN:2, CN:0, DX:6, CH:0 },
        // Totaux : FO:9 IN:10 CN:8 DX:14 CH:8 — pvMax:28 ftMax:26
        compInvesties: { armes_a_feu:5, esquive:3, detection_piege:2 },
        equipement: {
            tete: { id:"DEF11", quantite:1, durabilite:100, durabiliteMax:100 },
            torse: { id:"DEF09", quantite:1, durabilite:100, durabiliteMax:100 },
            gants: null, bottes: null, anneau: null, amulette: null,
            main_droite: { id:"AF01", quantite:1, durabilite:100, durabiliteMax:100 },
            main_gauche: null
        },
        pvActuel: 28, ftActuel: 26, boostPV: 0, boostFT: 0,
        argent: 200, inventaire: [ { id:"MUN01", quantite:40 } ]
    },

    "gar": {
        nom: "Gar", race: "Humain", sexe: "M", niveau: 4,
        antecedent: "Humain se faisant passer pour un Demi-Orque simple d'esprit, loyal comme un roc et fort comme un bœuf.",
        statsBase:    { FO:12, IN:4, CN:8, DX:8, CH:7 },
        statsInvesties:{ FO:4, IN:0, CN:2, DX:0, CH:0 },
        // Totaux : FO:16 IN:4 CN:10 DX:8 CH:7 — pvMax:36 ftMax:24
        compInvesties: { melee:4 },
        equipement: {
            tete: null,
            torse: { id:"DEF02", quantite:1, durabilite:90, durabiliteMax:100 },
            gants: null, bottes: null, anneau: null, amulette: null,
            main_droite: { id:"AM10", quantite:1, durabilite:90, durabiliteMax:100 },
            main_gauche: null
        },
        pvActuel: 36, ftActuel: 24, boostPV: 0, boostFT: 0,
        argent: 5, inventaire: []
    },

    "zan_alurin": {
        nom: "Z'an Al'urin", race: "Elfe", sexe: "M", niveau: 9,
        antecedent: "Mage elfique contemplatif, gardien de savoirs arcaniques oubliés.",
        statsBase:    { FO:7, IN:9, CN:6, DX:9, CH:9 },
        statsInvesties:{ FO:0, IN:5, CN:1, DX:1, CH:2 },
        // Totaux : FO:7 IN:14 CN:7 DX:10 CH:11 — pvMax:28 ftMax:28
        compInvesties: { persuasion:3, marchandage:2 },
        equipement: {
            tete: null,
            torse: { id:"DEF04", quantite:1, durabilite:100, durabiliteMax:100 },
            gants: null, bottes: null, anneau: null, amulette: null,
            main_droite: null, main_gauche: null,
            deux_mains: { id:"AM05", quantite:1, durabilite:100, durabiliteMax:100 }
        },
        pvActuel: 28, ftActuel: 28, boostPV: 0, boostFT: 0,
        argent: 300, inventaire: [ { id:"CONS04", quantite:2 } ]
    },

    "loghaire": {
        nom: "Loghaire Thunder Stone", race: "Nain", sexe: "M", niveau: 12,
        antecedent: "Roi déchu du clan Thunderstone, portant le poids de ses trahisons.",
        statsBase:    { FO:9, IN:8, CN:9, DX:7, CH:7 },
        statsInvesties:{ FO:6, IN:1, CN:4, DX:2, CH:1 },
        // Totaux : FO:15 IN:9 CN:13 DX:9 CH:8 — pvMax:39 ftMax:35
        compInvesties: { melee:6, esquive:3, persuasion:2 },
        equipement: {
            tete: { id:"DEF11", quantite:1, durabilite:100, durabiliteMax:100 },
            torse: { id:"DEF09", quantite:1, durabilite:100, durabiliteMax:100 },
            gants: { id:"DEF12", quantite:1, durabilite:100, durabiliteMax:100 },
            bottes: { id:"DEF06", quantite:1, durabilite:100, durabiliteMax:100 },
            anneau: null, amulette: null,
            main_droite: { id:"AM10", quantite:1, durabilite:100, durabiliteMax:100 },
            main_gauche: { id:"DEF08", quantite:1, durabilite:100, durabiliteMax:100 }
        },
        pvActuel: 39, ftActuel: 35, boostPV: 0, boostFT: 0,
        argent: 0, inventaire: []
    },

    "drog": {
        nom: "Drog Black Tooth", race: "Orque", sexe: "M", niveau: 6,
        antecedent: "Gladiateur orque affranchi, cherche vengeance contre son ancien maître.",
        statsBase:    { FO:10, IN:7, CN:10, DX:8, CH:4 },
        statsInvesties:{ FO:4, IN:0, CN:2, DX:1, CH:0 },
        // Totaux : FO:14 IN:7 CN:12 DX:9 CH:4 — pvMax:35 ftMax:31
        compInvesties: { melee:5, esquive:3, lancer:2 },
        equipement: {
            tete: null,
            torse: { id:"DEF02", quantite:1, durabilite:75, durabiliteMax:100 },
            gants: null, bottes: null, anneau: null, amulette: null,
            main_droite: { id:"AM06", quantite:1, durabilite:80, durabiliteMax:100 },
            main_gauche: null
        },
        pvActuel: 35, ftActuel: 31, boostPV: 0, boostFT: 0,
        argent: 40, inventaire: []
    },

    "jayna": {
        nom: "Jayna Stiles", race: "Humain", sexe: "F", niveau: 7,
        antecedent: "Médecin de Tarante spécialisée en prothèses mécaniques et trauma de guerre.",
        statsBase:    { FO:8, IN:8, CN:8, DX:8, CH:8 },
        statsInvesties:{ FO:0, IN:5, CN:1, DX:3, CH:2 },
        // Totaux : FO:8 IN:13 CN:9 DX:11 CH:10 — pvMax:29 ftMax:31
        compInvesties: { soins:5, reparation:4, desamorcage:2 },
        equipement: {
            tete: { id:"DEF23", quantite:1, durabilite:100, durabiliteMax:100 },
            torse: { id:"DEF05", quantite:1, durabilite:100, durabiliteMax:100 },
            gants: null,
            bottes: { id:"DEF06", quantite:1, durabilite:100, durabiliteMax:100 },
            anneau: null, amulette: null,
            main_droite: { id:"AM04", quantite:1, durabilite:100, durabiliteMax:100 },
            main_gauche: null
        },
        pvActuel: 29, ftActuel: 31, boostPV: 0, boostFT: 0,
        argent: 180, inventaire: [ { id:"CONS03", quantite:5 }, { id:"CONS04", quantite:3 } ]
    },

    "raven": {
        nom: "Raven", race: "Demi-Elfe", sexe: "F", niveau: 6,
        antecedent: "Demi-elfe mystérieuse liée aux derniers jours de Nasrudin.",
        statsBase:    { FO:8, IN:8, CN:7, DX:9, CH:9 },
        statsInvesties:{ FO:0, IN:3, CN:1, DX:2, CH:3 },
        // Totaux : FO:8 IN:11 CN:8 DX:11 CH:12 — pvMax:27 ftMax:27
        compInvesties: { persuasion:4, discretion:3, attaque_sournoise:2 },
        equipement: {
            tete: null,
            torse: { id:"DEF01", quantite:1, durabilite:100, durabiliteMax:100 },
            gants: null, bottes: null, anneau: null, amulette: null,
            main_droite: { id:"AM09", quantite:1, durabilite:100, durabiliteMax:100 },
            main_gauche: null
        },
        pvActuel: 27, ftActuel: 27, boostPV: 0, boostFT: 0,
        argent: 90, inventaire: []
    },

    "thorvald": {
        nom: "Thorvald", race: "Nain", sexe: "M", niveau: 9,
        antecedent: "Chef de clan berserker, aucune armure ne l'arrête, aucune peur ne le retient.",
        statsBase:    { FO:9, IN:8, CN:9, DX:7, CH:7 },
        statsInvesties:{ FO:6, IN:0, CN:4, DX:1, CH:0 },
        // Totaux : FO:15 IN:8 CN:13 DX:8 CH:7 — pvMax:38 ftMax:34
        compInvesties: { melee:6, esquive:2 },
        equipement: {
            tete: { id:"DEF11", quantite:1, durabilite:100, durabiliteMax:100 },
            torse: { id:"DEF09", quantite:1, durabilite:100, durabiliteMax:100 },
            gants: { id:"DEF12", quantite:1, durabilite:100, durabiliteMax:100 },
            bottes: null, anneau: null, amulette: null,
            main_droite: { id:"AM12", quantite:1, durabilite:100, durabiliteMax:100 },
            main_gauche: null
        },
        pvActuel: 38, ftActuel: 34, boostPV: 0, boostFT: 0,
        argent: 70, inventaire: []
    },

    "sebastian": {
        nom: "Sebastian", race: "Humain", sexe: "M", niveau: 10,
        antecedent: "Noble de Caladon reconverti à la magie arcanique, dandy et redoutable.",
        statsBase:    { FO:8, IN:8, CN:8, DX:8, CH:8 },
        statsInvesties:{ FO:0, IN:6, CN:1, DX:1, CH:4 },
        // Totaux : FO:8 IN:14 CN:9 DX:9 CH:12 — pvMax:30 ftMax:32
        compInvesties: { persuasion:5, marchandage:4, soins:2 },
        equipement: {
            tete: { id:"DEF21", quantite:1, durabilite:100, durabiliteMax:100 },
            torse: { id:"DEF10", quantite:1, durabilite:100, durabiliteMax:100 },
            gants: null, bottes: null, anneau: null, amulette: null,
            main_droite: null, main_gauche: null,
            deux_mains: { id:"AM05", quantite:1, durabilite:100, durabiliteMax:100 }
        },
        pvActuel: 30, ftActuel: 32, boostPV: 0, boostFT: 0,
        argent: 450, inventaire: [ { id:"CONS04", quantite:2 } ]
    }
};

// ================= ENNEMIS (Scénario : Crash → Tarante) =================
// pvMax = (FO*2) + IN  |  ftMax = (CN*2) + IN
// zones   : lieux où ils apparaissent (IDs de lieuxDecouverts)
// lootDrop: butin récupérable sur le corps
// xp      : points d'expérience accordés

const ennemisData = {

 

    // ── MONSTRES ARCANUM ──

    "apish_shaman": {
        nom: "Chaman Singe", niveau: 15,
        race: "Singe",
        statsBase: {FO:15, CN:10, DX:7, IN:18, CH:6, MA:30},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Nature":5, "Mental":1},
        portrait: "npc-ennemis/monstres/apish_shaman.png",
        pvActuel: 58, ftActuel: 74, boostPV: 10, boostFT: 36,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 375, argent: 0,
        lootDrop: [{id:"COMP05", qte:1, proba:0.5}, {id:"COMP51", qte:1, proba:0.3}, {id:"COMP06", qte:1, proba:0.4}],
        resistances: {resPhys:50, resMagie:0, resFeu:50, resPoison:50, resElec:50},
        zones: ["Pont Terrestre"]
    },

    "arachnix_child": {
        nom: "Enfant Arachnide", niveau: 8,
        race: "Araignée",
        statsBase: {FO:8, CN:8, DX:11, IN:3, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/arachnix_child.png",
        pvActuel: 38, ftActuel: 38, boostPV: 19, boostFT: 19,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 200, argent: 0,
        lootDrop: [{id:"COMP50", qte:1, proba:0.5}],
        resistances: {resPhys:20, resMagie:10, resFeu:20, resPoison:20, resElec:20}
    },

    "arachnix_mother": {
        nom: "Mère Arachnide", niveau: 15,
        race: "Araignée",
        statsBase: {FO:12, CN:12, DX:15, IN:3, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/arachnix_mother.png",
        pvActuel: 60, ftActuel: 60, boostPV: 33, boostFT: 33,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 375, argent: 0,
        lootDrop: [{id:"TEC03", qte:1, proba:0.4}, {id:"COMP50", qte:1, proba:0.6}],
        resistances: {resPhys:40, resMagie:15, resFeu:40, resPoison:40, resElec:40}
    },

    "automaton": {
        nom: "Automate", niveau: 30,
        race: "Artificiel",
        statsBase: {FO:20, CN:19, DX:13, IN:7, CH:1, TC:100},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/automaton.png",
        pvActuel: 100, ftActuel: 104, boostPV: 53, boostFT: 59,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 750, argent: 0,
        lootDrop: [{id:"COMP01", qte:1, proba:0.7}, {id:"COMP19", qte:1, proba:0.5}, {id:"COMP26", qte:1, proba:0.5}, {id:"MUN04", qte:1, proba:0.4}],
        resistances: {resPhys:50, resMagie:90, resFeu:50, resPoison:100, resElec:10},
        zones: ["Ruines de Vendigroth", "Ashbury"]
    },

    "bear_ancient": {
        nom: "Ours Ancestral", niveau: 30,
        race: "Bête",
        statsBase: {FO:20, CN:17, DX:17, IN:15, CH:8, MA:30},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Nature":5, "Mental":1},
        portrait: "npc-ennemis/monstres/bear_ancient.png",
        pvActuel: 102, ftActuel: 117, boostPV: 47, boostFT: 68,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 750, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.6}, {id:"TEC06", qte:1, proba:0.4}, {id:"COMP05", qte:1, proba:0.5}],
        resistances: {resPhys:30, resMagie:55, resFeu:30, resPoison:30, resElec:30}
    },

    "bear_golden": {
        nom: "Ours Doré", niveau: 20,
        race: "Bête",
        statsBase: {FO:17, CN:12, DX:12, IN:4, CH:14},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/bear_golden.png",
        pvActuel: 68, ftActuel: 73, boostPV: 30, boostFT: 45,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 500, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.6}, {id:"TEC06", qte:1, proba:0.4}],
        resistances: {resPhys:40, resMagie:10, resFeu:40, resPoison:40, resElec:40},
        zones: ["Sud-est Chaîne Stonewall"]
    },

    "bear_grizzly": {
        nom: "Ours Grizzly", niveau: 15,
        race: "Bête",
        statsBase: {FO:14, CN:16, DX:10, IN:5, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/bear_grizzly.png",
        pvActuel: 58, ftActuel: 74, boostPV: 25, boostFT: 37,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 375, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.6}, {id:"TEC06", qte:1, proba:0.4}],
        resistances: {resPhys:30, resMagie:10, resFeu:30, resPoison:30, resElec:30},
        zones: ["Forêt Scintillante", "Chaîne Stonewall"]
    },

    "bear_polar": {
        nom: "Ours Polaire", niveau: 10,
        race: "Bête",
        statsBase: {FO:14, CN:10, DX:8, IN:4, CH:9},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/bear_polar.png",
        pvActuel: 48, ftActuel: 49, boostPV: 16, boostFT: 25,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 250, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.6}],
        resistances: {resPhys:20, resMagie:10, resFeu:20, resPoison:20, resElec:20},
        zones: ["Col de Hardin"]
    },

    "bear_polar_cub": {
        nom: "Ourson Polaire", niveau: 5,
        race: "Bête",
        statsBase: {FO:7, CN:5, DX:4, IN:4, CH:14},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/bear_polar_cub.png",
        pvActuel: 48, ftActuel: 29, boostPV: 30, boostFT: 15,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 125, argent: 0,
        lootDrop: [],
        resistances: {resPhys:20, resMagie:5, resFeu:20, resPoison:20, resElec:20},
        zones: ["Col de Hardin"]
    },

    "black_defiler": {
        nom: "Profanateur Noir", niveau: 25,
        race: "Mort-vivant",
        statsBase: {FO:16, CN:8, DX:11, IN:16, CH:3, MA:100},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Nécromancie noire":3},
        portrait: "npc-ennemis/monstres/black_defiler.png",
        biGenre: true,
        pvActuel: 104, ftActuel: 88, boostPV: 56, boostFT: 56,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 625, argent: 0,
        lootDrop: [{id:"COMP50", qte:1, proba:0.4}],
        resistances: {resPhys:30, resMagie:30, resFeu:0, resPoison:30, resElec:30}
    },

    "black_defiler_slave": {
        nom: "Esclave du Profanateur", niveau: 15,
        race: "Mort-vivant",
        statsBase: {FO:14, CN:12, DX:15, IN:12, CH:3, MA:10},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Nécromancie noire":1, "Invocation":1},
        portrait: "npc-ennemis/monstres/black_defiler_slave.png",
        biGenre: true,
        pvActuel: 77, ftActuel: 73, boostPV: 37, boostFT: 37,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 375, argent: 0,
        lootDrop: [],
        resistances: {resPhys:50, resMagie:50, resFeu:0, resPoison:100, resElec:50}
    },

    "bone_butcher": {
        nom: "Boucher d'Os", niveau: 15,
        race: "Mort-vivant",
        statsBase: {FO:12, CN:10, DX:13, IN:5, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/bone_butcher.png",
        pvActuel: 63, ftActuel: 59, boostPV: 34, boostFT: 34,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 375, argent: 0,
        lootDrop: [],
        resistances: {resPhys:30, resMagie:30, resFeu:30, resPoison:100, resElec:30}
    },

    "brute_fang": {
        nom: "Croc Brutal", niveau: 20,
        race: "Bête",
        statsBase: {FO:18, CN:13, DX:15, IN:5, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/brute_fang.png",
        pvActuel: 68, ftActuel: 77, boostPV: 27, boostFT: 46,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 500, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.5}, {id:"TEC06", qte:1, proba:0.3}],
        resistances: {resPhys:25, resMagie:5, resFeu:10, resPoison:15, resElec:5},
        zones: ["Tarant (La Bouille)", "Mines Montagne Noire"]
    },

    "burnowar": {
        nom: "Burnowar", niveau: 30,
        race: "Démon",
        statsBase: {FO:14, CN:12, DX:9, IN:15, CH:3, MA:25},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Feu":5},
        portrait: "npc-ennemis/monstres/burnowar.png",
        pvActuel: 110, ftActuel: 106, boostPV: 67, boostFT: 67,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 750, argent: 0,
        lootDrop: [{id:"COMP73", qte:1, proba:0.3}, {id:"COMP84", qte:1, proba:0.3}],
        resistances: {resPhys:20, resMagie:10, resFeu:50, resPoison:10, resElec:10},
        zones: ["Abîmes de Bangellian"]
    },

    "death_latern": {
        nom: "Lanterne de Mort", niveau: 20,
        race: "Esprit",
        statsBase: {FO:8, CN:7, DX:19, IN:9, CH:4},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/death_latern.png",
        pvActuel: 69, ftActuel: 67, boostPV: 44, boostFT: 44,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 500, argent: 0,
        lootDrop: [],
        resistances: {resPhys:70, resMagie:20, resFeu:10, resPoison:100, resElec:10}
    },

    "elemental_snake": {
        nom: "Serpent Élémentaire", niveau: 32,
        race: "Élémentaire",
        statsBase: {FO:13, CN:17, DX:14, IN:14, CH:4, MA:25},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Feu":3, "Eau":2},
        portrait: "npc-ennemis/monstres/elemental_snake.png",
        pvActuel: 92, ftActuel: 119, boostPV: 52, boostFT: 71,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 800, argent: 0,
        lootDrop: [{id:"COMP52", qte:1, proba:0.8}, {id:"TEC03", qte:1, proba:0.6}, {id:"CONS22", qte:1, proba:0.3}],
        resistances: {resPhys:20, resMagie:30, resFeu:50, resPoison:80, resElec:0}
    },

    "feraloch": {
        nom: "Féraloch", niveau: 20,
        race: "Bête",
        statsBase: {FO:13, CN:14, DX:9, IN:3, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/feraloch.png",
        pvActuel: 75, ftActuel: 77, boostPV: 46, boostFT: 46,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 500, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.5}, {id:"TEC06", qte:1, proba:0.3}],
        resistances: {resPhys:15, resMagie:5, resFeu:10, resPoison:10, resElec:5}
    },

    "fleshy_mound": {
        nom: "Monticule de Chair", niveau: 15,
        race: "Démon",
        statsBase: {FO:14, CN:11, DX:10, IN:4, CH:5},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/fleshy_mound.png",
        pvActuel: 70, ftActuel: 64, boostPV: 38, boostFT: 38,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 375, argent: 0,
        lootDrop: [{id:"COMP50", qte:1, proba:0.4}, {id:"COMP72", qte:1, proba:0.5}],
        resistances: {resPhys:10, resMagie:5, resFeu:0, resPoison:20, resElec:5}
    },

    "forest_ape": {
        nom: "Singe des Forêts", niveau: 17,
        race: "Singe",
        statsBase: {FO:14, CN:12, DX:16, IN:7, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/forest_ape.png",
        pvActuel: 62, ftActuel: 70, boostPV: 27, boostFT: 39,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 425, argent: 0,
        lootDrop: [{id:"COMP05", qte:1, proba:0.5}, {id:"COMP48", qte:1, proba:0.3}, {id:"COMP14", qte:1, proba:0.4}],
        resistances: {resPhys:15, resMagie:5, resFeu:10, resPoison:10, resElec:5}
    },

    "foul_spirit": {
        nom: "Esprit Immonde", niveau: 25,
        race: "Esprit",
        statsBase: {FO:7, CN:15, DX:8, IN:16, CH:3, MA:35},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Air":2, "Mental":3, "Transformation":2},
        portrait: "npc-ennemis/monstres/foul_spirit.png",
        pvActuel: 86, ftActuel: 102, boostPV: 56, boostFT: 56,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 625, argent: 0,
        lootDrop: [],
        resistances: {resPhys:70, resMagie:15, resFeu:0, resPoison:100, resElec:10}
    },

    "frigidon": {
        nom: "Frigidon", niveau: 25,
        race: "Bête",
        statsBase: {FO:12, CN:11, DX:12, IN:9, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/frigidon.png",
        pvActuel: 85, ftActuel: 83, boostPV: 52, boostFT: 52,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 625, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.6}],
        resistances: {resPhys:30, resMagie:10, resFeu:0, resPoison:20, resElec:10},
        zones: ["Col de Hardin"]
    },

    "ghoul": {
        nom: "Goule", niveau: 6,
        race: "Mort-vivant",
        statsBase: {FO:9, CN:12, DX:8, IN:3, CH:1, MA:50},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/ghoul.png",
        biGenre: true,
        pvActuel: 40, ftActuel: 42, boostPV: 19, boostFT: 15,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 150, argent: 0,
        lootDrop: [{id:"COMP67", qte:1, proba:0.4}, {id:"COMP50", qte:1, proba:0.3}],
        resistances: {resPhys:20, resMagie:20, resFeu:0, resPoison:100, resElec:20}
    },

    "golem_ore": {
        nom: "Golem de Minerai", niveau: 25,
        race: "Artificiel",
        statsBase: {FO:18, CN:18, DX:9, IN:6, CH:5, MA:100},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/golem_ore.png",
        pvActuel: 78, ftActuel: 105, boostPV: 36, boostFT: 63,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 625, argent: 0,
        lootDrop: [{id:"COMP02", qte:1, proba:0.7}, {id:"COMP10", qte:1, proba:0.3}, {id:"COMP01", qte:1, proba:0.4}],
        resistances: {resPhys:60, resMagie:40, resFeu:30, resPoison:100, resElec:20},
        zones: ["Mines Montagne Noire", "Clan Wheel", "Labyrinthe Antique"]
    },

    "gore_guard": {
        nom: "Gardien Sanglant", niveau: 22,
        race: "Artificiel",
        statsBase: {FO:14, CN:15, DX:10, IN:3, CH:1, MA:100},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/gore_guard.png",
        pvActuel: 72, ftActuel: 80, boostPV: 41, boostFT: 47,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 550, argent: 0,
        lootDrop: [{id:"COMP01", qte:1, proba:0.5}, {id:"COMP26", qte:1, proba:0.4}, {id:"COMP19", qte:1, proba:0.4}],
        resistances: {resPhys:25, resMagie:15, resFeu:10, resPoison:20, resElec:10},
        zones: ["Cimetière Ashbury", "Château Ashbury", "Labyrinthe Antique"]
    },

    "gowrath_greater": {
        nom: "Grand Gowrath", niveau: 18,
        race: "Bête",
        statsBase: {FO:15, CN:11, DX:9, IN:3, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/gowrath_greater.png",
        pvActuel: 75, ftActuel: 67, boostPV: 42, boostFT: 42,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 450, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.5}, {id:"TEC06", qte:1, proba:0.4}],
        resistances: {resPhys:20, resMagie:15, resFeu:15, resPoison:20, resElec:10}
    },

    "gowrath_lesser": {
        nom: "Petit Gowrath", niveau: 15,
        race: "Bête",
        statsBase: {FO:14, CN:10, DX:8, IN:3, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/gowrath_lesser.png",
        pvActuel: 67, ftActuel: 59, boostPV: 36, boostFT: 36,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 375, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.5}],
        resistances: {resPhys:10, resMagie:10, resFeu:10, resPoison:15, resElec:5}
    },

    "grim_shade": {
        nom: "Ombre Sinistre", niveau: 30,
        race: "Esprit",
        statsBase: {FO:12, CN:15, DX:17, IN:16, CH:3, MA:25},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Mental":3, "Air":2},
        portrait: "npc-ennemis/monstres/grim_shade.png",
        pvActuel: 106, ftActuel: 112, boostPV: 66, boostFT: 66,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 750, argent: 0,
        lootDrop: [],
        resistances: {resPhys:80, resMagie:10, resFeu:0, resPoison:100, resElec:10}
    },

    "hell_creeper": {
        nom: "Rampant des Enfers", niveau: 15,
        race: "Démon",
        statsBase: {FO:15, CN:7, DX:17, IN:15, CH:2, MA:15},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Feu":3},
        portrait: "npc-ennemis/monstres/hell_creeper.png",
        pvActuel: 283, ftActuel: 67, boostPV: 238, boostFT: 38,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 375, argent: 0,
        lootDrop: [{id:"COMP73", qte:1, proba:0.4}, {id:"COMP84", qte:1, proba:0.3}],
        resistances: {resPhys:20, resMagie:10, resFeu:50, resPoison:20, resElec:10}
    },

    "insectress_hunter": {
        nom: "Chasseuse Insectoïde", niveau: 15,
        race: "Bête",
        statsBase: {FO:12, CN:12, DX:15, IN:4, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/insectress_hunter.png",
        pvActuel: 60, ftActuel: 60, boostPV: 32, boostFT: 32,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 375, argent: 0,
        lootDrop: [{id:"COMP50", qte:1, proba:0.5}],
        resistances: {resPhys:15, resMagie:10, resFeu:20, resPoison:30, resElec:10}
    },

    "kite_berserker": {
        nom: "Berserker Kite", niveau: 8,
        race: "Kite",
        statsBase: {FO:3, CN:4, DX:14, IN:2, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/kite_berserker.png",
        pvActuel: 30, ftActuel: 32, boostPV: 22, boostFT: 22,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 200, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:2, proba:1}, {id:"COMP05", qte:1, proba:0.3}],
        resistances: {resPhys:15, resMagie:5, resFeu:10, resPoison:10, resElec:5},
        zones: ["Forêt Scintillante", "Mines Montagne Noire"]
    },

    "kite_bowman": {
        nom: "Archer Kite", niveau: 5,
        race: "Kite",
        statsBase: {FO:3, CN:4, DX:9, IN:4, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/kite_bowman.png",
        pvActuel: 24, ftActuel: 26, boostPV: 14, boostFT: 14,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 125, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:1, proba:1}, {id:"MUN02", qte:5, proba:0.8}],
        resistances: {resPhys:10, resMagie:5, resFeu:10, resPoison:10, resElec:5},
        zones: ["Forêt Scintillante", "Mines Montagne Noire"]
    },

    "kite_scout": {
        nom: "Éclaireur Kite", niveau: 3,
        race: "Kite",
        statsBase: {FO:3, CN:4, DX:8, IN:4, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/kite_scout.png",
        pvActuel: 20, ftActuel: 22, boostPV: 10, boostFT: 10,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 75, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:1, proba:1}],
        resistances: {resPhys:10, resMagie:5, resFeu:10, resPoison:10, resElec:5},
        zones: ["Forêt Scintillante", "Mines Montagne Noire"]
    },

    "kite_shaman": {
        nom: "Chaman Kite", niveau: 12,
        race: "Kite",
        statsBase: {FO:2, CN:4, DX:5, IN:15, CH:3, MA:25},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Nature":5},
        portrait: "npc-ennemis/monstres/kite_shaman.png",
        pvActuel: 50, ftActuel: 54, boostPV: 31, boostFT: 31,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 300, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:4, proba:1}, {id:"COMP51", qte:1, proba:0.5}, {id:"COMP05", qte:1, proba:0.5}, {id:"COMP06", qte:1, proba:0.4}],
        resistances: {resPhys:5, resMagie:20, resFeu:10, resPoison:10, resElec:10},
        zones: ["Forêt Scintillante", "Mines Montagne Noire"]
    },

    "kite_warrior": {
        nom: "Guerrier Kite", niveau: 5,
        race: "Kite",
        statsBase: {FO:4, CN:4, DX:10, IN:4, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/kite_warrior.png",
        pvActuel: 26, ftActuel: 26, boostPV: 14, boostFT: 14,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 125, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:1, proba:1}],
        resistances: {resPhys:15, resMagie:5, resFeu:10, resPoison:10, resElec:5},
        zones: ["Forêt Scintillante", "Mines Montagne Noire"]
    },

    "lethe_wyvern": {
        nom: "Wyverne du Léthé", niveau: 45,
        race: "Bête",
        statsBase: {FO:18, CN:17, DX:16, IN:16, CH:4},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/lethe_wyvern.png",
        pvActuel: 147, ftActuel: 145, boostPV: 95, boostFT: 95,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 1125, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.7}, {id:"TEC06", qte:1, proba:0.5}, {id:"COMP52", qte:1, proba:0.4}],
        resistances: {resPhys:40, resMagie:25, resFeu:35, resPoison:25, resElec:10}
    },

    "lich_greater": {
        nom: "Grand Liche", niveau: 15,
        race: "Mort-vivant",
        statsBase: {FO:13, CN:8, DX:8, IN:15, CH:3, MA:100},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Energie":4},
        portrait: "npc-ennemis/monstres/lich_greater.png",
        biGenre: true,
        pvActuel: 78, ftActuel: 68, boostPV: 37, boostFT: 37,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 375, argent: 0,
        lootDrop: [{id:"COMP50", qte:1, proba:0.3}],
        resistances: {resPhys:15, resMagie:40, resFeu:0, resPoison:100, resElec:15}
    },

    "lich_lesser": {
        nom: "Petit Liche", niveau: 8,
        race: "Mort-vivant",
        statsBase: {FO:9, CN:8, DX:6, IN:13, CH:3, MA:100},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/lich_lesser.png",
        biGenre: true,
        pvActuel: 50, ftActuel: 48, boostPV: 19, boostFT: 19,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 200, argent: 0,
        lootDrop: [],
        resistances: {resPhys:10, resMagie:30, resFeu:0, resPoison:100, resElec:10}
    },

    "lords_slave": {
        nom: "Esclave du Seigneur", niveau: 22,
        race: "Humain",
        statsBase: {FO:16, CN:14, DX:17, IN:14, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/lords_slave.png",
        biGenre: true,
        pvActuel: 72, ftActuel: 92, boostPV: 26, boostFT: 50,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 550, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:7, proba:1}, {id:"CONS03", qte:1, proba:0.3}],
        resistances: {resPhys:20, resMagie:10, resFeu:10, resPoison:10, resElec:10}
    },

    "molten_arachnid": {
        nom: "Arachnide en Fusion", niveau: 15,
        race: "Araignée",
        statsBase: {FO:9, CN:7, DX:14, IN:15, CH:2, MA:15},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Feu":3},
        portrait: "npc-ennemis/monstres/molten_arachnid.png",
        pvActuel: 58, ftActuel: 67, boostPV: 25, boostFT: 38,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 375, argent: 0,
        lootDrop: [{id:"TEC03", qte:1, proba:0.3}, {id:"COMP73", qte:1, proba:0.3}],
        resistances: {resPhys:20, resMagie:10, resFeu:75, resPoison:20, resElec:0}
    },

    "mongrelon": {
        nom: "Mongrelon", niveau: 20,
        race: "Humanoïde",
        statsBase: {FO:14, CN:13, DX:16, IN:8, CH:4},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/mongrelon.png",
        pvActuel: 78, ftActuel: 76, boostPV: 42, boostFT: 42,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 500, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:6, proba:1}, {id:"COMP14", qte:1, proba:0.4}],
        resistances: {resPhys:15, resMagie:5, resFeu:10, resPoison:10, resElec:5}
    },

    "monkey_swarmer": {
        nom: "Singe en Essaim", niveau: 3,
        race: "Singe",
        statsBase: {FO:5, CN:4, DX:16, IN:3, CH:5},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/monkey_swarmer.png",
        pvActuel: 34, ftActuel: 20, boostPV: 21, boostFT: 9,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 75, argent: 0,
        lootDrop: [],
        resistances: {resPhys:5, resMagie:0, resFeu:5, resPoison:5, resElec:5}
    },

    "muck_walker": {
        nom: "Marcheur de Boue", niveau: 20,
        race: "Artificiel",
        statsBase: {FO:17, CN:14, DX:13, IN:3, CH:1, MA:100},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/muck_walker.png",
        pvActuel: 68, ftActuel: 74, boostPV: 31, boostFT: 43,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 500, argent: 0,
        lootDrop: [{id:"COMP01", qte:1, proba:0.7}, {id:"COMP26", qte:1, proba:0.5}, {id:"COMP72", qte:1, proba:0.5}],
        resistances: {resPhys:30, resMagie:15, resFeu:0, resPoison:100, resElec:10}
    },

    "plaguish_maiden": {
        nom: "Vierge Pestilentielle", niveau: 20,
        race: "Mort-vivant",
        statsBase: {FO:9, CN:8, DX:15, IN:14, CH:1, MA:10},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Air":2},
        portrait: "npc-ennemis/monstres/plaguish_maiden.png",
        pvActuel: 80, ftActuel: 78, boostPV: 48, boostFT: 48,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 500, argent: 0,
        lootDrop: [{id:"COMP67", qte:1, proba:0.4}, {id:"COMP50", qte:1, proba:0.3}],
        resistances: {resPhys:10, resMagie:20, resFeu:0, resPoison:100, resElec:10}
    },

    "prodigious_vermin": {
        nom: "Vermine Prodigieuse", niveau: 4,
        race: "Bête",
        statsBase: {FO:4, CN:6, DX:8, IN:1, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/prodigious_vermin.png",
        pvActuel: 36, ftActuel: 26, boostPV: 27, boostFT: 13,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 100, argent: 0,
        lootDrop: [{id:"COMP50", qte:1, proba:0.3}],
        resistances: {resPhys:5, resMagie:0, resFeu:5, resPoison:10, resElec:5}
    },

    "putrid_rodent": {
        nom: "Rongeur Putride", niveau: 12,
        race: "Bête",
        statsBase: {FO:8, CN:7, DX:11, IN:1, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/putrid_rodent.png",
        pvActuel: 44, ftActuel: 44, boostPV: 27, boostFT: 29,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 300, argent: 0,
        lootDrop: [{id:"COMP67", qte:1, proba:0.4}, {id:"COMP50", qte:1, proba:0.3}],
        resistances: {resPhys:10, resMagie:5, resFeu:5, resPoison:20, resElec:5}
    },

    "putrid_walker": {
        nom: "Marcheur Putride", niveau: 12,
        race: "Mort-vivant",
        statsBase: {FO:10, CN:12, DX:9, IN:3, CH:1, MA:75},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/putrid_walker.png",
        pvActuel: 52, ftActuel: 54, boostPV: 29, boostFT: 27,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 300, argent: 0,
        lootDrop: [{id:"COMP67", qte:1, proba:0.4}, {id:"COMP50", qte:1, proba:0.3}],
        resistances: {resPhys:15, resMagie:10, resFeu:0, resPoison:100, resElec:5}
    },

    "rat_granite": {
        nom: "Rat de Granit", niveau: 30,
        race: "Bête",
        statsBase: {FO:17, CN:18, DX:7, IN:10, CH:1, MA:10},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Transformation":2},
        portrait: "npc-ennemis/monstres/rat_granite.png",
        pvActuel: 88, ftActuel: 115, boostPV: 44, boostFT: 69,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 750, argent: 0,
        lootDrop: [{id:"COMP02", qte:1, proba:0.5}, {id:"COMP67", qte:1, proba:0.3}],
        resistances: {resPhys:40, resMagie:15, resFeu:10, resPoison:10, resElec:5}
    },

    "rat_rock": {
        nom: "Rat de Roche", niveau: 15,
        race: "Bête",
        statsBase: {FO:10, CN:14, DX:8, IN:3, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/rat_rock.png",
        pvActuel: 58, ftActuel: 64, boostPV: 35, boostFT: 33,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 375, argent: 0,
        lootDrop: [{id:"COMP02", qte:1, proba:0.4}],
        resistances: {resPhys:30, resMagie:10, resFeu:10, resPoison:10, resElec:5}
    },

    "rat_were": {
        nom: "Rat-Garou", niveau: 25,
        race: "Lycanthrope",
        statsBase: {FO:16, CN:17, DX:14, IN:15, CH:6},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/rat_were.png",
        pvActuel: 78, ftActuel: 102, boostPV: 31, boostFT: 53,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 625, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:8, proba:0.7}, {id:"TEC06", qte:1, proba:0.4}, {id:"COMP50", qte:1, proba:0.3}],
        resistances: {resPhys:30, resMagie:15, resFeu:10, resPoison:15, resElec:10}
    },

    "rock_sprite": {
        nom: "Lutin de Pierre", niveau: 15,
        race: "Fée",
        statsBase: {FO:12, CN:11, DX:9, IN:12, CH:3, MA:100},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Terre":2},
        portrait: "npc-ennemis/monstres/rock_sprite.png",
        pvActuel: 78, ftActuel: 71, boostPV: 42, boostFT: 37,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 375, argent: 0,
        lootDrop: [{id:"COMP02", qte:1, proba:0.4}, {id:"COMP01", qte:1, proba:0.3}],
        resistances: {resPhys:35, resMagie:15, resFeu:5, resPoison:25, resElec:15}
    },

    "seether": {
        nom: "Bouillonnant", niveau: 7,
        race: "Démon",
        statsBase: {FO:2, CN:3, DX:10, IN:3, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/seether.png",
        pvActuel: 42, ftActuel: 26, boostPV: 35, boostFT: 17,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 175, argent: 0,
        lootDrop: [],
        resistances: {resPhys:10, resMagie:15, resFeu:20, resPoison:10, resElec:10}
    },

    "seething_mass": {
        nom: "Masse Bouillonnante", niveau: 20,
        race: "Démon",
        statsBase: {FO:11, CN:10, DX:14, IN:5, CH:5},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/seething_mass.png",
        pvActuel: 68, ftActuel: 70, boostPV: 41, boostFT: 45,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 500, argent: 0,
        lootDrop: [],
        resistances: {resPhys:20, resMagie:20, resFeu:30, resPoison:20, resElec:15}
    },

    "sewer_shambler": {
        nom: "Traîne-Égout", niveau: 10,
        race: "Humanoïde",
        statsBase: {FO:11, CN:10, DX:9, IN:6, CH:5, MA:70},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/sewer_shambler.png",
        pvActuel: 54, ftActuel: 52, boostPV: 26, boostFT: 26,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 250, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:3, proba:1}, {id:"COMP67", qte:1, proba:0.4}, {id:"COMP50", qte:1, proba:0.3}],
        resistances: {resPhys:10, resMagie:10, resFeu:5, resPoison:20, resElec:5}
    },

    "sewer_slitherer": {
        nom: "Rampant des Égouts", niveau: 3,
        race: "Bête",
        statsBase: {FO:3, CN:3, DX:7, IN:2, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/sewer_slitherer.png",
        pvActuel: 34, ftActuel: 19, boostPV: 26, boostFT: 11,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 75, argent: 0,
        lootDrop: [{id:"COMP50", qte:1, proba:0.3}],
        resistances: {resPhys:5, resMagie:0, resFeu:5, resPoison:15, resElec:5}
    },

    "shadow_crawler": {
        nom: "Rampeur de l'Ombre", niveau: 30,
        race: "Mort-vivant",
        statsBase: {FO:17, CN:14, DX:15, IN:6, CH:3, MA:15},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Nécromancie noire":3},
        portrait: "npc-ennemis/monstres/shadow_crawler.png",
        pvActuel: 88, ftActuel: 109, boostPV: 48, boostFT: 75,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 750, argent: 0,
        lootDrop: [],
        resistances: {resPhys:20, resMagie:20, resFeu:0, resPoison:100, resElec:10}
    },

    "shadow_hunter": {
        nom: "Chasseur d'Ombre", niveau: 13,
        race: "Esprit",
        statsBase: {FO:11, CN:11, DX:13, IN:7, CH:4},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/shadow_hunter.png",
        pvActuel: 58, ftActuel: 58, boostPV: 29, boostFT: 29,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 325, argent: 0,
        lootDrop: [],
        resistances: {resPhys:50, resMagie:20, resFeu:10, resPoison:100, resElec:15}
    },

    "shiver_beast": {
        nom: "Bête Frissonnante", niveau: 10,
        race: "Bête",
        statsBase: {FO:8, CN:7, DX:10, IN:5, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/shiver_beast.png",
        pvActuel: 48, ftActuel: 44, boostPV: 27, boostFT: 25,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 250, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.4}],
        resistances: {resPhys:15, resMagie:10, resFeu:0, resPoison:10, resElec:5}
    },

    "shiverbit": {
        nom: "Mordant de Givre", niveau: 12,
        race: "Bête",
        statsBase: {FO:12, CN:10, DX:14, IN:8, CH:5},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/shiverbit.png",
        pvActuel: 52, ftActuel: 55, boostPV: 20, boostFT: 27,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 300, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.4}],
        resistances: {resPhys:20, resMagie:10, resFeu:0, resPoison:10, resElec:5}
    },

    "siren_queen": {
        nom: "Reine Sirène", niveau: 30,
        race: "Bête",
        statsBase: {FO:17, CN:14, DX:19, IN:3, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/siren_queen.png",
        pvActuel: 100, ftActuel: 94, boostPV: 63, boostFT: 63,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 750, argent: 0,
        lootDrop: [{id:"COMP06", qte:1, proba:0.6}, {id:"COMP52", qte:1, proba:0.5}, {id:"OR_PIECES", qte:10, proba:0.5}],
        resistances: {resPhys:25, resMagie:20, resFeu:10, resPoison:15, resElec:0}
    },

    "skullcrusher": {
        nom: "Brise-Crâne", niveau: 30,
        race: "Singe",
        statsBase: {FO:19, CN:14, DX:12, IN:3, CH:6},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/skullcrusher.png",
        pvActuel: 98, ftActuel: 99, boostPV: 57, boostFT: 68,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 750, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.6}, {id:"OR_PIECES", qte:10, proba:0.7}],
        resistances: {resPhys:40, resMagie:10, resFeu:0, resPoison:25, resElec:10}
    },

    "slime_demon": {
        nom: "Démon Visqueux", niveau: 25,
        race: "Démon",
        statsBase: {FO:8, CN:8, DX:15, IN:6, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/slime_demon.png",
        pvActuel: 78, ftActuel: 85, boostPV: 56, boostFT: 63,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 625, argent: 0,
        lootDrop: [{id:"COMP72", qte:1, proba:0.7}, {id:"COMP50", qte:1, proba:0.4}],
        resistances: {resPhys:20, resMagie:15, resFeu:20, resPoison:40, resElec:15}
    },

    "spider_dread": {
        nom: "Araignée Redoutable", niveau: 15,
        race: "Araignée",
        statsBase: {FO:13, CN:10, DX:16, IN:11, CH:3, MA:15},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Mental":3},
        portrait: "npc-ennemis/monstres/spider_dread.png",
        pvActuel: 58, ftActuel: 69, boostPV: 21, boostFT: 38,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 375, argent: 0,
        lootDrop: [{id:"TEC03", qte:1, proba:0.5}, {id:"COMP50", qte:1, proba:0.6}],
        resistances: {resPhys:20, resMagie:15, resFeu:10, resPoison:30, resElec:10}
    },

    "spider_greater": {
        nom: "Grande Araignée", niveau: 7,
        race: "Araignée",
        statsBase: {FO:7, CN:5, DX:11, IN:3, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/spider_greater.png",
        pvActuel: 42, ftActuel: 30, boostPV: 25, boostFT: 17,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 175, argent: 0,
        lootDrop: [{id:"COMP50", qte:1, proba:0.5}],
        resistances: {resPhys:10, resMagie:5, resFeu:10, resPoison:25, resElec:5}
    },

    "spider_siren": {
        nom: "Araignée Sirène", niveau: 25,
        race: "Araignée",
        statsBase: {FO:15, CN:13, DX:16, IN:4, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/spider_siren.png",
        pvActuel: 86, ftActuel: 82, boostPV: 52, boostFT: 52,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 625, argent: 0,
        lootDrop: [{id:"TEC03", qte:1, proba:0.4}, {id:"COMP50", qte:1, proba:0.5}],
        resistances: {resPhys:25, resMagie:10, resFeu:10, resPoison:30, resElec:5}
    },

    "stone_monkey": {
        nom: "Singe de Pierre", niveau: 8,
        race: "Singe",
        statsBase: {FO:8, CN:7, DX:8, IN:5, CH:5},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/stone_monkey.png",
        pvActuel: 44, ftActuel: 36, boostPV: 23, boostFT: 17,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 200, argent: 0,
        lootDrop: [{id:"COMP05", qte:1, proba:0.3}],
        resistances: {resPhys:25, resMagie:5, resFeu:10, resPoison:10, resElec:5}
    },

    "swamp_shambler": {
        nom: "Traîne-Marais", niveau: 18,
        race: "Plante",
        statsBase: {FO:18, CN:16, DX:11, IN:8, CH:5, MA:70},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/swamp_shambler.png",
        pvActuel: 87, ftActuel: 83, boostPV: 43, boostFT: 43,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 450, argent: 0,
        lootDrop: [{id:"COMP06", qte:1, proba:0.7}, {id:"COMP05", qte:1, proba:0.5}, {id:"COMP51", qte:1, proba:0.4}],
        resistances: {resPhys:25, resMagie:10, resFeu:0, resPoison:50, resElec:15}
    },

    "tattered_bowman": {
        nom: "Archer en Lambeaux", niveau: 12,
        race: "Mort-vivant",
        statsBase: {FO:9, CN:8, DX:12, IN:5, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/tattered_bowman.png",
        pvActuel: 51, ftActuel: 49, boostPV: 28, boostFT: 28,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 300, argent: 0,
        lootDrop: [{id:"MUN02", qte:6, proba:0.7}],
        resistances: {resPhys:10, resMagie:15, resFeu:0, resPoison:100, resElec:5}
    },

    "venom_hound": {
        nom: "Chien Venimeux", niveau: 7,
        race: "Bête",
        statsBase: {FO:9, CN:8, DX:11, IN:6, CH:4},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/venom_hound.png",
        pvActuel: 42, ftActuel: 40, boostPV: 18, boostFT: 18,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 175, argent: 0,
        lootDrop: [{id:"TEC03", qte:1, proba:0.4}, {id:"COMP50", qte:1, proba:0.5}, {id:"TEC06", qte:1, proba:0.3}],
        resistances: {resPhys:10, resMagie:5, resFeu:10, resPoison:30, resElec:5}
    },

    "volars_wisp": {
        nom: "Feu Follet de Volar", niveau: 12,
        race: "Esprit",
        statsBase: {FO:6, CN:4, DX:15, IN:8, CH:4},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/volars_wisp.png",
        pvActuel: 49, ftActuel: 45, boostPV: 29, boostFT: 29,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 300, argent: 0,
        lootDrop: [],
        resistances: {resPhys:60, resMagie:15, resFeu:10, resPoison:100, resElec:20}
    },

    // ── ENNEMIS UNIQUES ─────────────────────────────────────────────────────────

    "volar_wisp_ancien": {
        nom: "Feu Follet de Volar Ancien", niveau: 20,
        race: "Esprit",
        unique: true,
        statsBase: {FO:9, CN:7, DX:19, IN:12, CH:6},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/unique/volar_wisp_ancien.png",
        pvActuel: 68, ftActuel: 64, boostPV: 38, boostFT: 38,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 600, argent: 0,
        lootDrop: [{id:"XXX05", qte:1, proba:1}],
        resistances: {resPhys:70, resMagie:20, resFeu:15, resPoison:100, resElec:25}
    },

    "widower": {
        nom: "Veuf", niveau: 7,
        race: "Esprit",
        statsBase: {FO:2, CN:1, DX:3, IN:3, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/widower.png",
        pvActuel: 14, ftActuel: 22, boostPV: 7, boostFT: 17,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 175, argent: 0,
        lootDrop: [],
        resistances: {resPhys:50, resMagie:15, resFeu:10, resPoison:100, resElec:15}
    },

    "will_o_the_wisp": {
        nom: "Feu Follet", niveau: 6,
        race: "Esprit",
        statsBase: {FO:5, CN:4, DX:9, IN:8, CH:4},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/will_o_the_wisp.png",
        pvActuel: 35, ftActuel: 33, boostPV: 17, boostFT: 17,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 150, argent: 0,
        lootDrop: [],
        resistances: {resPhys:55, resMagie:15, resFeu:10, resPoison:100, resElec:20}
    },

    "wolf": {
        nom: "Loup", niveau: 3,
        race: "Bête",
        statsBase: {FO:11, CN:9, DX:13, IN:3, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/wolf.png",
        pvActuel: 34, ftActuel: 34, boostPV: 9, boostFT: 13,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 75, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.5}, {id:"TEC06", qte:1, proba:0.3}],
        resistances: {resPhys:10, resMagie:0, resFeu:10, resPoison:10, resElec:5}
    },

    "wolf_ailing": {
        nom: "Loup Malade", niveau: 1,
        race: "Bête",
        statsBase: {FO:2, CN:3, DX:4, IN:4, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/wolf_ailing.png",
        pvActuel: 10, ftActuel: 15, boostPV: 2, boostFT: 5,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 25, argent: 0,
        lootDrop: [],
        resistances: {resPhys:5, resMagie:0, resFeu:5, resPoison:5, resElec:5}
    },

    "wolf_patriarch": {
        nom: "Loup Patriarche", niveau: 23,
        race: "Bête",
        statsBase: {FO:13, CN:13, DX:15, IN:18, CH:6, MA:30},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Nature":5, "Mental":1},
        portrait: "npc-ennemis/monstres/wolf_patriarch.png",
        pvActuel: 74, ftActuel: 96, boostPV: 30, boostFT: 52,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 575, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.7}, {id:"TEC06", qte:1, proba:0.5}, {id:"COMP05", qte:1, proba:0.4}],
        resistances: {resPhys:20, resMagie:15, resFeu:10, resPoison:15, resElec:10}
    },

    "wolf_timber": {
        nom: "Loup des Forêts", niveau: 7,
        race: "Bête",
        statsBase: {FO:9, CN:8, DX:11, IN:6, CH:4},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/wolf_timber.png",
        pvActuel: 42, ftActuel: 40, boostPV: 18, boostFT: 18,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 175, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.5}, {id:"TEC06", qte:1, proba:0.3}],
        resistances: {resPhys:10, resMagie:0, resFeu:10, resPoison:10, resElec:5}
    },

    "yeti": {
        nom: "Yéti", niveau: 30,
        race: "Bête",
        statsBase: {FO:19, CN:16, DX:13, IN:5, CH:6},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/yeti.png",
        pvActuel: 98, ftActuel: 103, boostPV: 55, boostFT: 66,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 750, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.7}, {id:"TEC06", qte:1, proba:0.4}],
        resistances: {resPhys:30, resMagie:10, resFeu:0, resPoison:15, resElec:5}
    },

    // ── HUMANOÏDES ──────────────────────────────────────────────────────────────

    // ─── HUMAINS — Guerriers / Technologiques ───

    "brigand": {
        nom: "Brigand", niveau: 3,
        race: "Humain",
        statsBase: {FO:9, CN:7, DX:10, IN:7, CH:7},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/brigand.png",
        biGenre: true,
        pvActuel: 28, ftActuel: 25, boostPV: 3, boostFT: 4,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:{id:"AM07"}, main_gauche:null},
        xp: 75, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:2, proba:1}, {id:"CONS29", qte:1, proba:0.5}, {id:"CONS28", qte:1, proba:0.3}],
        resistances: {resPhys:5, resMagie:0, resFeu:5, resPoison:5, resElec:5}
    },

    "bandit_pistolier": {
        nom: "Bandit Pistolier", niveau: 5,
        race: "Humain",
        statsBase: {FO:8, CN:8, DX:12, IN:7, CH:7},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/bandit_pistolier.png",
        biGenre: true,
        pvActuel: 32, ftActuel: 30, boostPV: 9, boostFT: 7,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:{id:"AF13"}, main_gauche:null},
        xp: 125, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:3, proba:1}, {id:"MUN01", qte:6, proba:0.8}, {id:"CONS03", qte:1, proba:0.3}],
        resistances: {resPhys:5, resMagie:0, resFeu:5, resPoison:5, resElec:5}
    },

    "mercenaire": {
        nom: "Mercenaire", niveau: 10,
        race: "Humain",
        statsBase: {FO:11, CN:9, DX:11, IN:9, CH:8},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/mercenaire.png",
        biGenre: true,
        pvActuel: 50, ftActuel: 45, boostPV: 19, boostFT: 18,
        equipement: {tete:{id:"DEF19"}, torse:{id:"DEF30"}, gants:null, bottes:null, anneau:null, amulette:null, main_droite:{id:"AM06"}, main_gauche:null},
        xp: 250, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:5, proba:1}, {id:"CONS03", qte:1, proba:0.5}, {id:"CONS04", qte:1, proba:0.3}],
        resistances: {resPhys:15, resMagie:5, resFeu:5, resPoison:5, resElec:5}
    },

    "garde_tarant": {
        nom: "Garde de Tarant", niveau: 10,
        race: "Humain",
        statsBase: {FO:10, CN:9, DX:12, IN:9, CH:10},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/garde_tarant.png",
        biGenre: true,
        pvActuel: 48, ftActuel: 45, boostPV: 19, boostFT: 18,
        equipement: {tete:null, torse:{id:"DEF20"}, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null, deux_mains:{id:"AF10"}},
        xp: 250, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:5, proba:1}, {id:"MUN01", qte:10, proba:0.9}, {id:"CONS05", qte:1, proba:0.3}],
        resistances: {resPhys:15, resMagie:5, resFeu:5, resPoison:5, resElec:5}
    },

    "chasseur_prime": {
        nom: "Chasseur de Prime", niveau: 18,
        race: "Humain",
        statsBase: {FO:12, CN:11, DX:14, IN:11, CH:9},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/chasseur_prime.png",
        biGenre: true,
        pvActuel: 72, ftActuel: 68, boostPV: 37, boostFT: 35,
        equipement: {tete:null, torse:{id:"DEF35"}, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null, deux_mains:{id:"AF11"}},
        xp: 450, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:6, proba:1}, {id:"MUN01", qte:12, proba:0.75}, {id:"CONS03", qte:1, proba:0.5}, {id:"CONS07", qte:1, proba:0.3}],
        resistances: {resPhys:15, resMagie:5, resFeu:5, resPoison:5, resElec:5}
    },

    "chevalier_empire": {
        nom: "Chevalier de l'Empire", niveau: 22,
        race: "Humain",
        statsBase: {FO:14, CN:11, DX:9, IN:11, CH:10},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/chevalier_empire.png",
        biGenre: true,
        pvActuel: 82, ftActuel: 72, boostPV: 43, boostFT: 39,
        equipement: {tete:{id:"DEF57"}, torse:{id:"DEF27"}, gants:null, bottes:null, anneau:null, amulette:null, main_droite:{id:"AM38"}, main_gauche:null},
        xp: 550, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:7, proba:1}, {id:"CONS06", qte:1, proba:0.4}, {id:"CONS19", qte:1, proba:0.3}],
        resistances: {resPhys:30, resMagie:10, resFeu:10, resPoison:10, resElec:10}
    },

    "assassin_ombre": {
        nom: "Assassin", niveau: 15,
        race: "Humain",
        statsBase: {FO:9, CN:10, DX:17, IN:11, CH:8},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/assassin_ombre.png",
        biGenre: true,
        pvActuel: 58, ftActuel: 62, boostPV: 29, boostFT: 31,
        equipement: {tete:null, torse:{id:"DEF44"}, gants:null, bottes:null, anneau:null, amulette:null, main_droite:{id:"AM33"}, main_gauche:null},
        xp: 375, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:5, proba:1}, {id:"TEC03", qte:1, proba:0.4}, {id:"CONS07", qte:1, proba:0.5}, {id:"CONS03", qte:1, proba:0.3}],
        resistances: {resPhys:10, resMagie:10, resFeu:5, resPoison:15, resElec:5}
    },

    // ─── HUMAINS — Magiques ───

    "apprenti_mage": {
        nom: "Apprenti Mage", niveau: 5,
        race: "Humain",
        statsBase: {FO:6, CN:7, DX:8, IN:13, CH:8, MA:25},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Energie":1},
        portrait: "npc-ennemis/monstres/apprenti_mage.png",
        biGenre: true,
        pvActuel: 30, ftActuel: 38, boostPV: 5, boostFT: 11,
        equipement: {tete:null, torse:{id:"DEF45"}, gants:null, bottes:null, anneau:null, amulette:null, main_droite:{id:"AM05"}, main_gauche:null},
        xp: 125, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:2, proba:1}, {id:"CONS04", qte:1, proba:0.5}, {id:"CONS05", qte:1, proba:0.3}],
        resistances: {resPhys:5, resMagie:15, resFeu:5, resPoison:5, resElec:5}
    },

    "sorciere": {
        nom: "Sorcière", niveau: 12,
        race: "Humain",
        statsBase: {FO:7, CN:8, DX:9, IN:15, CH:9, MA:45},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Mental":2, "Nature":2},
        portrait: "npc-ennemis/monstres/sorciere.png",
        pvActuel: 52, ftActuel: 55, boostPV: 23, boostFT: 24,
        equipement: {tete:null, torse:{id:"DEF43"}, gants:null, bottes:null, anneau:null, amulette:null, main_droite:{id:"AM35"}, main_gauche:null},
        xp: 300, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:4, proba:1}, {id:"CONS07", qte:1, proba:0.5}, {id:"TEC03", qte:1, proba:0.3}, {id:"CONS04", qte:1, proba:0.4}],
        resistances: {resPhys:5, resMagie:20, resFeu:5, resPoison:10, resElec:5}
    },

    "mage_guilde": {
        nom: "Mage de Guilde", niveau: 20,
        race: "Humain",
        statsBase: {FO:7, CN:9, DX:10, IN:17, CH:11, MA:70},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Energie":4, "Mental":2},
        portrait: "npc-ennemis/monstres/mage_guilde.png",
        biGenre: true,
        pvActuel: 72, ftActuel: 82, boostPV: 41, boostFT: 47,
        equipement: {tete:null, torse:{id:"DEF42"}, gants:null, bottes:null, anneau:null, amulette:null, main_droite:{id:"AM19"}, main_gauche:null},
        xp: 500, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:6, proba:1}, {id:"CONS20", qte:1, proba:0.4}, {id:"CONS08", qte:1, proba:0.4}, {id:"CONS16", qte:1, proba:0.3}],
        resistances: {resPhys:5, resMagie:30, resFeu:5, resPoison:5, resElec:10}
    },

    "necromancien": {
        nom: "Nécromancien", niveau: 28,
        race: "Humain",
        statsBase: {FO:8, CN:9, DX:9, IN:18, CH:5, MA:85},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Nécromancie noire":5, "Invocation":2},
        portrait: "npc-ennemis/monstres/necromancien.png",
        biGenre: true,
        pvActuel: 100, ftActuel: 108, boostPV: 66, boostFT: 72,
        equipement: {tete:null, torse:{id:"DEF42"}, gants:null, bottes:null, anneau:null, amulette:null, main_droite:{id:"AM19"}, main_gauche:null},
        xp: 700, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:9, proba:1}, {id:"TEC03", qte:1, proba:0.5}, {id:"CONS10", qte:1, proba:0.3}, {id:"CONS24", qte:1, proba:0.2}],
        resistances: {resPhys:5, resMagie:35, resFeu:5, resPoison:15, resElec:5}
    },

    // ─── NAINS ───

    "guerrier_nain": {
        nom: "Guerrier Nain", niveau: 10,
        race: "Nain",
        statsBase: {FO:13, CN:11, DX:7, IN:9, CH:7},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/guerrier_nain.png",
        pvActuel: 54, ftActuel: 50, boostPV: 19, boostFT: 19,
        equipement: {tete:{id:"DEF19"}, torse:{id:"DEF31"}, gants:null, bottes:null, anneau:null, amulette:null, main_droite:{id:"AM10"}, main_gauche:null},
        xp: 250, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:4, proba:1}, {id:"CONS35", qte:1, proba:0.7}, {id:"CONS03", qte:1, proba:0.4}],
        resistances: {resPhys:25, resMagie:10, resFeu:10, resPoison:15, resElec:5}
    },

    "fusilier_nain": {
        nom: "Fusilier Nain", niveau: 17,
        race: "Nain",
        statsBase: {FO:12, CN:10, DX:8, IN:11, CH:7},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/fusilier_nain.png",
        pvActuel: 68, ftActuel: 62, boostPV: 33, boostFT: 31,
        equipement: {tete:null, torse:{id:"DEF31"}, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null, deux_mains:{id:"AF12"}},
        xp: 425, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:5, proba:1}, {id:"MUN01", qte:15, proba:0.9}, {id:"CONS35", qte:1, proba:0.6}, {id:"CONS03", qte:1, proba:0.3}],
        resistances: {resPhys:20, resMagie:10, resFeu:10, resPoison:15, resElec:5}
    },

    "artificier_nain": {
        nom: "Artificier Nain", niveau: 25,
        race: "Nain",
        statsBase: {FO:11, CN:12, DX:9, IN:15, CH:8},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/artificier_nain.png",
        pvActuel: 88, ftActuel: 96, boostPV: 51, boostFT: 57,
        equipement: {tete:{id:"DEF56"}, torse:{id:"DEF32"}, gants:null, bottes:null, anneau:null, amulette:null, main_droite:{id:"AM13"}, main_gauche:null},
        xp: 625, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:8, proba:1}, {id:"MUN03", qte:3, proba:0.7}, {id:"TEC10", qte:1, proba:0.35}, {id:"TEC08", qte:1, proba:0.25}, {id:"CONS09", qte:1, proba:0.3}],
        resistances: {resPhys:20, resMagie:10, resFeu:10, resPoison:10, resElec:5}
    },

    // ─── ELFES ───

    "archer_elfe": {
        nom: "Archer Elfe", niveau: 8,
        race: "Elfe",
        statsBase: {FO:7, CN:7, DX:15, IN:12, CH:11},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/archer_elfe.png",
        biGenre: true,
        pvActuel: 42, ftActuel: 40, boostPV: 16, boostFT: 14,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:{id:"AM04"}, main_gauche:null},
        xp: 200, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:3, proba:1}, {id:"MUN02", qte:15, proba:0.9}, {id:"CONS32", qte:1, proba:0.5}],
        resistances: {resPhys:10, resMagie:20, resFeu:10, resPoison:10, resElec:10}
    },

    "garde_elfe": {
        nom: "Garde Elfe", niveau: 12,
        race: "Elfe",
        statsBase: {FO:9, CN:9, DX:14, IN:12, CH:11},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/garde_elfe.png",
        biGenre: true,
        pvActuel: 52, ftActuel: 52, boostPV: 22, boostFT: 22,
        equipement: {tete:null, torse:{id:"DEF20"}, gants:null, bottes:null, anneau:null, amulette:null, main_droite:{id:"AM39"}, main_gauche:null},
        xp: 300, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:4, proba:1}, {id:"CONS32", qte:1, proba:0.5}, {id:"MUN02", qte:6, proba:0.4}, {id:"CONS03", qte:1, proba:0.3}],
        resistances: {resPhys:15, resMagie:20, resFeu:10, resPoison:10, resElec:10}
    },

    "mage_elfe": {
        nom: "Mage Elfe", niveau: 18,
        race: "Elfe",
        statsBase: {FO:6, CN:8, DX:12, IN:16, CH:12, MA:60},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Feu":3, "Air":2, "Mental":2},
        portrait: "npc-ennemis/monstres/mage_elfe.png",
        biGenre: true,
        pvActuel: 70, ftActuel: 78, boostPV: 42, boostFT: 46,
        equipement: {tete:null, torse:{id:"DEF43"}, gants:null, bottes:null, anneau:null, amulette:null, main_droite:{id:"AM18"}, main_gauche:null},
        xp: 450, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:5, proba:1}, {id:"CONS04", qte:1, proba:0.5}, {id:"CONS21", qte:1, proba:0.3}, {id:"CONS24", qte:1, proba:0.2}],
        resistances: {resPhys:5, resMagie:35, resFeu:10, resPoison:10, resElec:15}
    },

    // ─── ORQUES ───

    "guerrier_orc": {
        nom: "Guerrier Orc", niveau: 8,
        race: "Orc",
        statsBase: {FO:13, CN:10, DX:9, IN:5, CH:5},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/guerrier_orc.png",
        biGenre: true,
        pvActuel: 44, ftActuel: 40, boostPV: 13, boostFT: 15,
        equipement: {tete:null, torse:{id:"DEF48"}, gants:null, bottes:null, anneau:null, amulette:null, main_droite:{id:"AM01"}, main_gauche:null},
        xp: 200, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:2, proba:1}, {id:"CONS29", qte:1, proba:0.5}, {id:"CONS13", qte:1, proba:0.25}],
        resistances: {resPhys:20, resMagie:5, resFeu:10, resPoison:10, resElec:5}
    },

  

    // ─── DEMI-OGRES ───

    "demi_ogre_brute": {
        nom: "Brute Demi-Ogre", niveau: 12,
        race: "Demi-Ogre",
        statsBase: {FO:16, CN:10, DX:7, IN:4, CH:5},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/demi_ogre_brute.png",
        pvActuel: 56, ftActuel: 48, boostPV: 20, boostFT: 24,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:{id:"AM37"}, main_gauche:null},
        xp: 300, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:3, proba:1}, {id:"CONS29", qte:2, proba:0.6}, {id:"CONS28", qte:1, proba:0.4}, {id:"CONS13", qte:1, proba:0.3}],
        resistances: {resPhys:30, resMagie:5, resFeu:10, resPoison:10, resElec:5}
    },

    "demi_ogre_garde": {
        nom: "Garde Demi-Ogre", niveau: 22,
        race: "Demi-Ogre",
        statsBase: {FO:18, CN:12, DX:8, IN:5, CH:6},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/demi_ogre_garde.png",
        pvActuel: 86, ftActuel: 76, boostPV: 45, boostFT: 47,
        equipement: {tete:null, torse:{id:"DEF27"}, gants:null, bottes:null, anneau:null, amulette:null, main_droite:{id:"AM37"}, main_gauche:null},
        xp: 550, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:6, proba:1}, {id:"CONS03", qte:1, proba:0.4}, {id:"CONS06", qte:1, proba:0.3}],
        resistances: {resPhys:35, resMagie:10, resFeu:10, resPoison:10, resElec:5}
    },

    // ─── GNOMES ───

    "gnome_savant": {
        nom: "Savant Gnome", niveau: 12,
        race: "Gnome",
        statsBase: {FO:5, CN:8, DX:13, IN:16, CH:9},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/gnome_savant.png",
        pvActuel: 46, ftActuel: 52, boostPV: 20, boostFT: 20,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:{id:"AM13"}, main_gauche:null},
        xp: 300, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:4, proba:1}, {id:"MUN03", qte:3, proba:0.7}, {id:"TEC08", qte:1, proba:0.35}, {id:"TEC09", qte:1, proba:0.35}, {id:"CONS16", qte:1, proba:0.4}],
        resistances: {resPhys:5, resMagie:25, resFeu:5, resPoison:10, resElec:10}
    },

    // ─── ASSASSINS DE LA MAIN ───

    "main_assassin_humain": {
        nom: "Assassin de la Main", niveau: 16,
        race: "Humain",
        statsBase: {FO:10, CN:11, DX:18, IN:12, CH:9},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/main_assassin_humain.png",
        biGenre: true,
        pvActuel: 65, ftActuel: 68, boostPV: 33, boostFT: 34,
        equipement: {tete:null, torse:{id:"DEF44"}, gants:null, bottes:null, anneau:null, amulette:{id:"BIJ35"}, main_droite:{id:"AM26"}, main_gauche:null},
        xp: 400, argent: 0,
        lootDrop: [{id:"BIJ35", qte:1, proba:1}, {id:"OR_PIECES", qte:8, proba:0.75}],
        resistances: {resPhys:15, resMagie:15, resFeu:5, resPoison:20, resElec:10}
    },

    "main_assassin_demi_ogre": {
        nom: "Assassin de la Main", niveau: 18,
        race: "Demi-Ogre",
        statsBase: {FO:17, CN:11, DX:10, IN:6, CH:5},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/main_assassin_demi_ogre.png",
        pvActuel: 72, ftActuel: 62, boostPV: 32, boostFT: 34,
        equipement: {tete:null, torse:{id:"DEF40"}, gants:null, bottes:null, anneau:null, amulette:{id:"BIJ35"}, main_droite:{id:"AM33"}, main_gauche:null},
        xp: 450, argent: 0,
        lootDrop: [{id:"BIJ35", qte:1, proba:1}, {id:"OR_PIECES", qte:8, proba:0.75}],
        resistances: {resPhys:25, resMagie:10, resFeu:5, resPoison:15, resElec:5}
    },

    "main_assassin_demi_orc": {
        nom: "Assassin de la Main", niveau: 14,
        race: "Demi-Orc",
        statsBase: {FO:12, CN:10, DX:14, IN:8, CH:7},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/main_assassin_demi_orc.png",
        biGenre: true,
        pvActuel: 58, ftActuel: 54, boostPV: 26, boostFT: 26,
        equipement: {tete:null, torse:{id:"DEF35"}, gants:null, bottes:null, anneau:null, amulette:{id:"BIJ35"}, main_droite:{id:"AM28"}, main_gauche:null},
        xp: 350, argent: 0,
        lootDrop: [{id:"BIJ35", qte:1, proba:1}, {id:"OR_PIECES", qte:6, proba:0.75}],
        resistances: {resPhys:20, resMagie:10, resFeu:5, resPoison:15, resElec:5}
    },

    "main_assassin_elfe_noir": {
        nom: "Assassin de la Main", niveau: 20,
        race: "Elfe Noir",
        statsBase: {FO:7, CN:8, DX:17, IN:15, CH:9, MA:25},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Mental":2},
        portrait: "npc-ennemis/monstres/main_assassin_elfe_noir.png",
        biGenre: true,
        pvActuel: 72, ftActuel: 78, boostPV: 43, boostFT: 47,
        equipement: {tete:null, torse:{id:"DEF44"}, gants:null, bottes:null, anneau:null, amulette:{id:"BIJ35"}, main_droite:{id:"AM27"}, main_gauche:null},
        xp: 500, argent: 0,
        lootDrop: [{id:"BIJ35", qte:1, proba:1}, {id:"OR_PIECES", qte:8, proba:0.75}],
        resistances: {resPhys:10, resMagie:25, resFeu:5, resPoison:20, resElec:10}
    },

    // ─── HALFELINS ───

    "halfelin_voleur": {
        nom: "Voleur Halfelin", niveau: 6,
        race: "Halfelin",
        statsBase: {FO:5, CN:8, DX:15, IN:9, CH:12},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/halfelin_voleur.png",
        pvActuel: 36, ftActuel: 40, boostPV: 17, boostFT: 15,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:{id:"AM25"}, main_gauche:null},
        xp: 150, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:3, proba:1}, {id:"CONS07", qte:1, proba:0.5}, {id:"TEC09", qte:1, proba:0.3}, {id:"CONS28", qte:1, proba:0.4}],
        resistances: {resPhys:5, resMagie:10, resFeu:5, resPoison:10, resElec:5}
    },

    // ── NOUVEAUX MONSTRES ────────────────────────────────────────────────────────

    // ─── BÊTES ───

    // Créé par IA - stats estimées
    "arachnix": {
        nom: "Arachnix", niveau: 12,
        race: "Araignée",
        statsBase: {FO:9, CN:8, DX:14, IN:6, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/arachnix.png",
        pvActuel: 52, ftActuel: 46, boostPV: 26, boostFT: 22,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 300, argent: 0,
        lootDrop: [{id:"TEC03", qte:1, proba:0.4}, {id:"COMP50", qte:1, proba:0.5}],
        resistances: {resPhys:20, resMagie:10, resFeu:20, resPoison:20, resElec:20}
    },

    // Créé par IA - stats estimées
    "bear_black": {
        nom: "Ours Noir", niveau: 6,
        race: "Bête",
        statsBase: {FO:12, CN:10, DX:8, IN:3, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/bear_black.png",
        pvActuel: 42, ftActuel: 40, boostPV: 16, boostFT: 16,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 150, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.5}, {id:"TEC06", qte:1, proba:0.3}],
        resistances: {resPhys:20, resMagie:5, resFeu:10, resPoison:10, resElec:5}
    },

    // Créé par IA - stats estimées
    "bear_black_cub": {
        nom: "Ourson Noir", niveau: 3,
        race: "Bête",
        statsBase: {FO:6, CN:6, DX:9, IN:2, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/bear_black_cub.png",
        pvActuel: 24, ftActuel: 22, boostPV: 8, boostFT: 8,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 75, argent: 0,
        lootDrop: [],
        resistances: {resPhys:10, resMagie:0, resFeu:5, resPoison:5, resElec:5}
    },

    // Créé par IA - stats estimées
    "bear_grizzly_cub": {
        nom: "Ourson Grizzly", niveau: 7,
        race: "Bête",
        statsBase: {FO:9, CN:8, DX:8, IN:2, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/bear_grizzly_cub.png",
        pvActuel: 36, ftActuel: 34, boostPV: 14, boostFT: 14,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 175, argent: 0,
        lootDrop: [],
        resistances: {resPhys:15, resMagie:0, resFeu:5, resPoison:5, resElec:5}
    },

    // Créé par IA - stats estimées
    "bear_golden_cub": {
        nom: "Ourson Doré", niveau: 10,
        race: "Bête",
        statsBase: {FO:11, CN:9, DX:9, IN:3, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/bear_golden_cub.png",
        pvActuel: 44, ftActuel: 42, boostPV: 20, boostFT: 20,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 250, argent: 0,
        lootDrop: [],
        resistances: {resPhys:20, resMagie:5, resFeu:10, resPoison:10, resElec:5}
    },

    // Créé par IA - stats estimées
    "boar_lesser": {
        nom: "Sanglier", niveau: 2,
        race: "Bête",
        statsBase: {FO:9, CN:8, DX:7, IN:2, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/boar_lesser.png",
        pvActuel: 22, ftActuel: 20, boostPV: 8, boostFT: 8,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 50, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.4}],
        resistances: {resPhys:10, resMagie:0, resFeu:5, resPoison:5, resElec:5}
    },

    // Créé par IA - stats estimées
    "boar_greater": {
        nom: "Grand Sanglier", niveau: 4,
        race: "Bête",
        statsBase: {FO:12, CN:10, DX:8, IN:2, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/boar_greater.png",
        pvActuel: 34, ftActuel: 30, boostPV: 14, boostFT: 14,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 100, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.5}],
        resistances: {resPhys:15, resMagie:0, resFeu:5, resPoison:5, resElec:5}
    },

    // Créé par IA - stats estimées
    "boar_rabid": {
        nom: "Sanglier Enragé", niveau: 6,
        race: "Bête",
        statsBase: {FO:13, CN:11, DX:9, IN:2, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/boar_rabid.png",
        pvActuel: 42, ftActuel: 38, boostPV: 18, boostFT: 18,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 150, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.5}, {id:"COMP50", qte:1, proba:0.3}],
        resistances: {resPhys:15, resMagie:0, resFeu:5, resPoison:10, resElec:5}
    },

    // Créé par IA - stats estimées
    "tiger": {
        nom: "Tigre", niveau: 10,
        race: "Bête",
        statsBase: {FO:13, CN:10, DX:14, IN:4, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/tiger.png",
        pvActuel: 50, ftActuel: 48, boostPV: 22, boostFT: 22,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 250, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.6}, {id:"TEC06", qte:1, proba:0.3}],
        resistances: {resPhys:15, resMagie:5, resFeu:10, resPoison:10, resElec:5}
    },

    // Créé par IA - stats estimées
    "tiger_bangle": {
        nom: "Tigre Rayé", niveau: 18,
        race: "Bête",
        statsBase: {FO:16, CN:13, DX:16, IN:5, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/tiger_bangle.png",
        pvActuel: 72, ftActuel: 68, boostPV: 36, boostFT: 36,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 450, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.7}, {id:"TEC06", qte:1, proba:0.4}],
        resistances: {resPhys:20, resMagie:5, resFeu:10, resPoison:10, resElec:5}
    },

    // Créé par IA - stats estimées
    "mountain_lion": {
        nom: "Lion des Montagnes", niveau: 7,
        race: "Bête",
        statsBase: {FO:11, CN:9, DX:13, IN:4, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/mountain_lion.png",
        pvActuel: 40, ftActuel: 38, boostPV: 16, boostFT: 16,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 175, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.5}, {id:"TEC06", qte:1, proba:0.3}],
        resistances: {resPhys:10, resMagie:5, resFeu:10, resPoison:10, resElec:5}
    },

    // Créé par IA - stats estimées
    "swamp_ape": {
        nom: "Singe des Marais", niveau: 12,
        race: "Singe",
        statsBase: {FO:14, CN:11, DX:10, IN:4, CH:4},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/swamp_ape.png",
        pvActuel: 54, ftActuel: 50, boostPV: 26, boostFT: 24,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 300, argent: 0,
        lootDrop: [{id:"COMP05", qte:1, proba:0.3}],
        resistances: {resPhys:20, resMagie:5, resFeu:5, resPoison:20, resElec:5}
    },

    // Créé par IA - stats estimées
    "gorilla_greater": {
        nom: "Grand Gorille", niveau: 15,
        race: "Singe",
        statsBase: {FO:17, CN:13, DX:9, IN:4, CH:4},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/gorilla_greater.png",
        pvActuel: 64, ftActuel: 58, boostPV: 30, boostFT: 28,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 375, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.5}, {id:"COMP05", qte:1, proba:0.3}],
        resistances: {resPhys:25, resMagie:5, resFeu:10, resPoison:10, resElec:5}
    },

    // Créé par IA - stats estimées
    "lycanthrope": {
        nom: "Lycanthrope", niveau: 15,
        race: "Lycanthrope",
        statsBase: {FO:14, CN:13, DX:13, IN:8, CH:5},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/lycanthrope.png",
        pvActuel: 62, ftActuel: 60, boostPV: 28, boostFT: 28,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 375, argent: 0,
        lootDrop: [{id:"TEC06", qte:1, proba:0.4}, {id:"COMP50", qte:1, proba:0.3}],
        resistances: {resPhys:30, resMagie:15, resFeu:10, resPoison:15, resElec:10}
    },

    // ─── MORTS-VIVANTS ───

    // Créé par IA - stats estimées
    "skeleton_lesser": {
        nom: "Squelette", niveau: 5,
        race: "Mort-vivant",
        statsBase: {FO:7, CN:6, DX:7, IN:2, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/skeleton_lesser.png",
        pvActuel: 28, ftActuel: 26, boostPV: 10, boostFT: 10,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 125, argent: 0,
        lootDrop: [],
        resistances: {resPhys:20, resMagie:10, resFeu:0, resPoison:100, resElec:5}
    },

    // Créé par IA - stats estimées
    "skeleton_warrior": {
        nom: "Squelette Guerrier", niveau: 10,
        race: "Mort-vivant",
        statsBase: {FO:10, CN:8, DX:9, IN:3, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/skeleton_warrior.png",
        pvActuel: 44, ftActuel: 40, boostPV: 18, boostFT: 18,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 250, argent: 0,
        lootDrop: [],
        resistances: {resPhys:25, resMagie:10, resFeu:0, resPoison:100, resElec:5}
    },

    // Créé par IA - stats estimées
    "skeleton_greater": {
        nom: "Squelette Supérieur", niveau: 18,
        race: "Mort-vivant",
        statsBase: {FO:13, CN:10, DX:11, IN:5, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/skeleton_greater.png",
        pvActuel: 64, ftActuel: 60, boostPV: 30, boostFT: 28,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 450, argent: 0,
        lootDrop: [],
        resistances: {resPhys:30, resMagie:10, resFeu:0, resPoison:100, resElec:5}
    },

    // Créé par IA - stats estimées
    "mummy": {
        nom: "Momie", niveau: 12,
        race: "Mort-vivant",
        statsBase: {FO:12, CN:11, DX:6, IN:4, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/mummy.png",
        pvActuel: 52, ftActuel: 48, boostPV: 22, boostFT: 22,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 300, argent: 0,
        lootDrop: [{id:"COMP67", qte:1, proba:0.4}, {id:"COMP50", qte:1, proba:0.3}],
        resistances: {resPhys:20, resMagie:10, resFeu:0, resPoison:100, resElec:5}
    },

    // Créé par IA - stats estimées
    "mummy_greater": {
        nom: "Grande Momie", niveau: 22,
        race: "Mort-vivant",
        statsBase: {FO:15, CN:13, DX:7, IN:6, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/mummy_greater.png",
        pvActuel: 78, ftActuel: 72, boostPV: 40, boostFT: 38,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 550, argent: 0,
        lootDrop: [{id:"COMP67", qte:1, proba:0.5}, {id:"COMP50", qte:1, proba:0.4}],
        resistances: {resPhys:25, resMagie:15, resFeu:0, resPoison:100, resElec:5}
    },

    // Créé par IA - stats estimées
    "phantom_knight": {
        nom: "Chevalier Fantôme", niveau: 20,
        race: "Esprit",
        statsBase: {FO:13, CN:11, DX:12, IN:7, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/phantom_knight.png",
        pvActuel: 72, ftActuel: 68, boostPV: 36, boostFT: 34,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 500, argent: 0,
        lootDrop: [],
        resistances: {resPhys:70, resMagie:20, resFeu:20, resPoison:100, resElec:20}
    },

    // Créé par IA - stats estimées
    "cursed_paladin": {
        nom: "Paladin Maudit", niveau: 15,
        race: "Mort-vivant",
        statsBase: {FO:11, CN:8, DX:18, IN:7, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/cursed_paladin.png",
        biGenre: true,
        pvActuel: 60, ftActuel: 56, boostPV: 28, boostFT: 26,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 375, argent: 0,
        lootDrop: [],
        resistances: {resPhys:60, resMagie:30, resFeu:30, resPoison:100, resElec:30}
    },

    // ─── HUMANOÏDES / DÉMONS ───

    // Créé par IA - stats estimées
    "berserker": {
        nom: "Berserk", niveau: 17,
        race: "Humain",
        statsBase: {FO:17, CN:10, DX:15, IN:5, CH:4},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/berserker.png",
        biGenre: true,
        pvActuel: 68, ftActuel: 60, boostPV: 32, boostFT: 28,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:{id:"AM37"}, main_gauche:null},
        xp: 425, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:4, proba:0.7}, {id:"CONS03", qte:1, proba:0.4}],
        resistances: {resPhys:65, resMagie:10, resFeu:25, resPoison:25, resElec:25}
    },

    // Créé par IA - stats estimées
    "dark_berserker": {
        nom: "Berserk des Ténèbres", niveau: 25,
        race: "Humain",
        statsBase: {FO:15, CN:10, DX:16, IN:6, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/dark_berserker.png",
        biGenre: true,
        pvActuel: 88, ftActuel: 80, boostPV: 48, boostFT: 44,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:{id:"AM37"}, main_gauche:null},
        xp: 625, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:6, proba:0.7}, {id:"CONS03", qte:1, proba:0.4}],
        resistances: {resPhys:40, resMagie:15, resFeu:40, resPoison:40, resElec:40}
    },

    // Créé par IA - stats estimées
    "dark_champion": {
        nom: "Champion des Ténèbres", niveau: 25,
        race: "Humain",
        statsBase: {FO:11, CN:14, DX:16, IN:9, CH:4},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/dark_champion.png",
        biGenre: true,
        pvActuel: 90, ftActuel: 96, boostPV: 50, boostFT: 56,
        equipement: {tete:{id:"DEF57"}, torse:{id:"DEF27"}, gants:null, bottes:null, anneau:null, amulette:null, main_droite:{id:"AM38"}, main_gauche:null},
        xp: 625, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:7, proba:0.8}, {id:"CONS06", qte:1, proba:0.4}],
        resistances: {resPhys:75, resMagie:25, resFeu:10, resPoison:10, resElec:10}
    },

    // Créé par IA - stats estimées
    "blood_spirit": {
        nom: "Esprit du Sang", niveau: 20,
        race: "Esprit",
        statsBase: {FO:11, CN:12, DX:15, IN:8, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/blood_spirit.png",
        pvActuel: 70, ftActuel: 74, boostPV: 38, boostFT: 42,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 500, argent: 0,
        lootDrop: [],
        resistances: {resPhys:65, resMagie:10, resFeu:50, resPoison:10, resElec:10}
    },

    // Créé par IA - stats estimées
    "bludgeoner": {
        nom: "Cogneur", niveau: 30,
        race: "Humanoïde",
        statsBase: {FO:20, CN:17, DX:19, IN:4, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/bludgeoner.png",
        pvActuel: 100, ftActuel: 110, boostPV: 58, boostFT: 66,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:{id:"AM37"}, main_gauche:null},
        xp: 750, argent: 0,
        lootDrop: [{id:"OR_PIECES", qte:8, proba:0.7}, {id:"COMP14", qte:1, proba:0.4}],
        resistances: {resPhys:85, resMagie:10, resFeu:10, resPoison:10, resElec:10}
    },



    // ─── HOMMES-REPTILES ───

    // Créé par IA - stats estimées
    "lizard_man": {
        nom: "Homme-Lézard", niveau: 7,
        race: "Reptilien",
        statsBase: {FO:11, CN:9, DX:10, IN:5, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/lizard_man.png",
        pvActuel: 40, ftActuel: 38, boostPV: 16, boostFT: 16,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 175, argent: 0,
        lootDrop: [{id:"COMP06", qte:1, proba:0.4}],
        resistances: {resPhys:15, resMagie:5, resFeu:10, resPoison:20, resElec:5}
    },

    // Créé par IA - stats estimées
    "lizard_guard": {
        nom: "Garde Homme-Lézard", niveau: 12,
        race: "Reptilien",
        statsBase: {FO:13, CN:11, DX:11, IN:6, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/lizard_guard.png",
        biGenre: true,
        pvActuel: 54, ftActuel: 50, boostPV: 24, boostFT: 22,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 300, argent: 0,
        lootDrop: [{id:"COMP06", qte:1, proba:0.5}, {id:"OR_PIECES", qte:2, proba:0.6}],
        resistances: {resPhys:20, resMagie:5, resFeu:10, resPoison:20, resElec:5}
    },

    // Créé par IA - stats estimées
    "lizard_woman": {
        nom: "Femme-Lézard", niveau: 8,
        race: "Reptilien",
        statsBase: {FO:8, CN:8, DX:13, IN:7, CH:3, MA:15},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Nature":1},
        portrait: "npc-ennemis/monstres/lizard_woman.png",
        pvActuel: 42, ftActuel: 44, boostPV: 16, boostFT: 18,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 200, argent: 0,
        lootDrop: [{id:"COMP06", qte:1, proba:0.4}, {id:"TEC03", qte:1, proba:0.3}],
        resistances: {resPhys:10, resMagie:15, resFeu:10, resPoison:20, resElec:5}
    },

    // ─── ÉLÉMENTAIRES ───

    // Créé par IA - stats estimées
    "elemental_air": {
        nom: "Élémentaire d'Air", niveau: 10,
        race: "Élémentaire",
        statsBase: {FO:5, CN:6, DX:18, IN:9, CH:2, MA:50},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Air":2},
        portrait: "npc-ennemis/monstres/elemental_air.png",
        pvActuel: 40, ftActuel: 50, boostPV: 16, boostFT: 24,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 250, argent: 0,
        lootDrop: [],
        resistances: {resPhys:60, resMagie:15, resFeu:20, resPoison:100, resElec:25},
        zones: ["Tulla"]
    },

    // Créé par IA - stats estimées
    "elemental_earth": {
        nom: "Élémentaire de Terre", niveau: 14,
        race: "Élémentaire",
        statsBase: {FO:17, CN:15, DX:5, IN:6, CH:1, MA:30},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Terre":2},
        portrait: "npc-ennemis/monstres/elemental_earth.png",
        pvActuel: 64, ftActuel: 56, boostPV: 26, boostFT: 26,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 350, argent: 0,
        lootDrop: [{id:"COMP02", qte:1, proba:0.5}, {id:"COMP01", qte:1, proba:0.3}],
        resistances: {resPhys:70, resMagie:10, resFeu:25, resPoison:100, resElec:25}
    },

    // Créé par IA - stats estimées
    "elemental_fire": {
        nom: "Élémentaire de Feu", niveau: 12,
        race: "Élémentaire",
        statsBase: {FO:10, CN:8, DX:13, IN:8, CH:2, MA:40},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Feu":2},
        portrait: "npc-ennemis/monstres/elemental_fire.png",
        pvActuel: 50, ftActuel: 52, boostPV: 20, boostFT: 24,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 300, argent: 0,
        lootDrop: [{id:"COMP73", qte:1, proba:0.4}],
        resistances: {resPhys:30, resMagie:15, resFeu:100, resPoison:100, resElec:0},
        zones: ["Ashbury", "Tulla", "Grotte inconnue"]
    },

    // Créé par IA - stats estimées
    "elemental_water": {
        nom: "Élémentaire d'Eau", niveau: 10,
        race: "Élémentaire",
        statsBase: {FO:7, CN:9, DX:11, IN:8, CH:2, MA:40},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Eau":2},
        portrait: "npc-ennemis/monstres/elemental_water.png",
        pvActuel: 44, ftActuel: 50, boostPV: 18, boostFT: 24,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 250, argent: 0,
        lootDrop: [],
        resistances: {resPhys:40, resMagie:15, resFeu:100, resPoison:100, resElec:0}
    },

    // Créé par IA - stats estimées
    "snake_man": {
        nom: "Homme-Serpent", niveau: 10,
        race: "Reptilien",
        statsBase: {FO:9, CN:8, DX:15, IN:7, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/snake_man.png",
        pvActuel: 46, ftActuel: 44, boostPV: 18, boostFT: 18,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 250, argent: 0,
        lootDrop: [{id:"TEC03", qte:1, proba:0.5}, {id:"COMP50", qte:1, proba:0.4}],
        resistances: {resPhys:10, resMagie:10, resFeu:10, resPoison:40, resElec:5}
    },

    // ========== HUMANOÏDES / ORCS ==========
    // Créé par IA - stats estimées
    "orc_grunt": {
        nom: "Orc Soldat", niveau: 4, race: "Orque",
        statsBase: {FO:7, CN:6, DX:5, IN:3, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/orc_grunt.png",
        biGenre: true,
        pvActuel: 32, ftActuel: 32, boostPV: 10, boostFT: 10,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 120, argent: 5,
        lootDrop: [{id:"TEC03", qte:1, proba:0.2}, {id:"COMP14", qte:1, proba:0.15}],
        resistances: {resPhys:15, resMagie:0, resFeu:0, resPoison:5, resElec:0},
        zones: ["Ashbury", "Stillwater", "Terres sauvages"]
    },
    // Créé par IA - stats estimées
    "orc_berserker": {
        nom: "Orc Berserker", niveau: 8, race: "Orque",
        statsBase: {FO:12, CN:9, DX:8, IN:3, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/orc_berserker.png",
        biGenre: true,
        pvActuel: 50, ftActuel: 56, boostPV: 18, boostFT: 20,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 220, argent: 10,
        lootDrop: [{id:"TEC06", qte:1, proba:0.25}, {id:"COMP14", qte:1, proba:0.2}],
        resistances: {resPhys:20, resMagie:0, resFeu:0, resPoison:10, resElec:0},
        zones: ["Ashbury", "Mines de Kree", "Terres sauvages"]
    },
    // Créé par IA - stats estimées
    "orc_chief": {
        nom: "Chef Orc", niveau: 12, race: "Orque",
        statsBase: {FO:14, CN:11, DX:9, IN:6, CH:5},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/orc_chief.png",
        biGenre: true,
        pvActuel: 62, ftActuel: 68, boostPV: 24, boostFT: 26,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 350, argent: 25,
        lootDrop: [{id:"TEC06", qte:1, proba:0.35}, {id:"DEF06", qte:1, proba:0.2}, {id:"COMP05", qte:1, proba:0.3}],
        resistances: {resPhys:25, resMagie:5, resFeu:0, resPoison:10, resElec:0},
        zones: ["Ashbury", "Terres sauvages"]
    },
    // Créé par IA - stats estimées
    "orc_shaman": {
        nom: "Chaman Orc", niveau: 9, race: "Orque",
        statsBase: {FO:7, CN:7, DX:8, IN:10, CH:5, MA:30},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Eau":1, "Nature":1},
        portrait: "npc-ennemis/monstres/orc_shaman.png",
        biGenre: true,
        pvActuel: 42, ftActuel: 42, boostPV: 14, boostFT: 14,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 280, argent: 15,
        lootDrop: [{id:"COMP67", qte:1, proba:0.3}, {id:"CONS04", qte:1, proba:0.25}],
        resistances: {resPhys:10, resMagie:20, resFeu:0, resPoison:15, resElec:0},
        zones: ["Ashbury", "Terres sauvages"]
    },
    // Créé par IA - stats estimées
    "dark_knight": {
        nom: "Chevalier Noir", niveau: 11, race: "Humain",
        statsBase: {FO:12, CN:10, DX:9, IN:7, CH:4},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/dark_knight.png",
        biGenre: true,
        pvActuel: 56, ftActuel: 60, boostPV: 20, boostFT: 22,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 320, argent: 30,
        lootDrop: [{id:"TEC06", qte:1, proba:0.3}, {id:"DEF09", qte:1, proba:0.2}],
        resistances: {resPhys:30, resMagie:10, resFeu:0, resPoison:5, resElec:0},
        zones: ["Catacombes de Caladon", "Manoir hanté", "Île du Désespoir"]
    },
    // Créé par IA - stats estimées
    "dark_warlord": {
        nom: "Seigneur de Guerre Noir", niveau: 15, race: "Humain",
        statsBase: {FO:14, CN:12, DX:11, IN:9, CH:6},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/dark_warlord.png",
        biGenre: true,
        pvActuel: 70, ftActuel: 76, boostPV: 28, boostFT: 30,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 500, argent: 50,
        lootDrop: [{id:"TEC06", qte:1, proba:0.4}, {id:"DEF11", qte:1, proba:0.25}, {id:"AM05", qte:1, proba:0.15}],
        resistances: {resPhys:35, resMagie:15, resFeu:0, resPoison:5, resElec:0},
        zones: ["Catacombes de Caladon", "Île du Désespoir"]
    },
    // Créé par IA - stats estimées
    "dark_warrior_priest": {
        nom: "Prêtre Guerrier Noir", niveau: 13, race: "Humain",
        statsBase: {FO:10, CN:9, DX:9, IN:12, CH:8, MA:35},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Nécromancien":2},
        portrait: "npc-ennemis/monstres/dark_warrior_priest.png",
        biGenre: true,
        pvActuel: 52, ftActuel: 54, boostPV: 18, boostFT: 18,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 400, argent: 40,
        lootDrop: [{id:"COMP67", qte:1, proba:0.35}, {id:"CONS07", qte:1, proba:0.3}],
        resistances: {resPhys:20, resMagie:30, resFeu:0, resPoison:10, resElec:0},
        zones: ["Catacombes de Caladon", "Île du Désespoir"]
    },
    // Créé par IA - stats estimées
    "ragged_fighter": {
        nom: "Combattant Déguenillé", niveau: 3, race: "Humain",
        statsBase: {FO:6, CN:5, DX:6, IN:4, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/ragged_fighter.png",
        biGenre: true,
        pvActuel: 26, ftActuel: 28, boostPV: 8, boostFT: 8,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 80, argent: 3,
        lootDrop: [{id:"TEC03", qte:1, proba:0.15}, {id:"COMP14", qte:1, proba:0.1}],
        resistances: {resPhys:5, resMagie:0, resFeu:0, resPoison:0, resElec:0},
        zones: ["Égouts de Tarant", "Thieves Underground", "Arcanum"]
    },
    // Créé par IA - stats estimées
    "wargunn": {
        nom: "Wargunn", niveau: 7, race: "Orque",
        statsBase: {FO:11, CN:8, DX:7, IN:4, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/wargunn.png",
        biGenre: true,
        pvActuel: 44, ftActuel: 48, boostPV: 14, boostFT: 16,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 200, argent: 12,
        lootDrop: [{id:"TEC06", qte:1, proba:0.2}, {id:"COMP14", qte:1, proba:0.15}],
        resistances: {resPhys:20, resMagie:0, resFeu:0, resPoison:5, resElec:0},
        zones: ["Terres sauvages", "Krondor"]
    },
    // Créé par IA - stats estimées
    "hollow_man": {
        nom: "Homme Creux", niveau: 9, race: "Mort-vivant",
        statsBase: {FO:8, CN:7, DX:7, IN:5, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/hollow_man.png",
        pvActuel: 40, ftActuel: 42, boostPV: 14, boostFT: 14,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 240, argent: 0,
        lootDrop: [],
        resistances: {resPhys:20, resMagie:15, resFeu:0, resPoison:100, resElec:5},
        zones: ["Catacombes de Caladon", "Manoir hanté"]
    },
    // Créé par IA - stats estimées
    "voltax": {
        nom: "Voltax", niveau: 10, race: "Construct",
        statsBase: {FO:10, CN:9, DX:8, IN:6, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/voltax.png",
        pvActuel: 50, ftActuel: 50, boostPV: 18, boostFT: 18,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 280, argent: 0,
        lootDrop: [{id:"COMP01", qte:1, proba:0.3}, {id:"COMP02", qte:1, proba:0.25}],
        resistances: {resPhys:30, resMagie:20, resFeu:50, resPoison:100, resElec:0},
        zones: ["Vendigroth", "Site du crash"]
    },

    // ========== MORT-VIVANTS ==========
    // Créé par IA - stats estimées
    "zombie": {
        nom: "Zombie", niveau: 2, race: "Mort-vivant",
        statsBase: {FO:6, CN:5, DX:3, IN:1, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/zombie.png",
        biGenre: true,
        pvActuel: 24, ftActuel: 22, boostPV: 8, boostFT: 6,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 50, argent: 0,
        lootDrop: [],
        resistances: {resPhys:15, resMagie:5, resFeu:0, resPoison:100, resElec:5},
        zones: ["Catacombes de Caladon", "Cimetière", "Nécropole"]
    },
    // Créé par IA - stats estimées
    "ghoul_savage": {
        nom: "Goule Sauvage", niveau: 5, race: "Mort-vivant",
        statsBase: {FO:8, CN:7, DX:7, IN:2, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/ghoul_savage.png",
        biGenre: true,
        pvActuel: 34, ftActuel: 36, boostPV: 10, boostFT: 10,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 130, argent: 0,
        lootDrop: [],
        resistances: {resPhys:15, resMagie:5, resFeu:0, resPoison:100, resElec:5},
        zones: ["Catacombes de Caladon", "Nécropole"]
    },
    // Créé par IA - stats estimées
    "ghoul_stygian": {
        nom: "Goule du Styx", niveau: 10, race: "Mort-vivant",
        statsBase: {FO:11, CN:10, DX:8, IN:3, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/ghoul_stygian.png",
        biGenre: true,
        pvActuel: 52, ftActuel: 54, boostPV: 20, boostFT: 20,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 280, argent: 0,
        lootDrop: [],
        resistances: {resPhys:20, resMagie:10, resFeu:0, resPoison:100, resElec:5},
        zones: ["Île du Désespoir", "Nécropole profonde"]
    },
    // Créé par IA - stats estimées
    "venomous_ghoul": {
        nom: "Goule Venimeuse", niveau: 7, race: "Mort-vivant",
        statsBase: {FO:9, CN:8, DX:8, IN:2, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/venomous_ghoul.png",
        biGenre: true,
        pvActuel: 42, ftActuel: 42, boostPV: 14, boostFT: 14,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 190, argent: 0,
        lootDrop: [],
        resistances: {resPhys:15, resMagie:5, resFeu:0, resPoison:100, resElec:5},
        zones: ["Marais empoisonnés", "Nécropole"]
    },
    // Créé par IA - stats estimées
    "demi_liche": {
        nom: "Demi-Liche", niveau: 16, race: "Mort-vivant",
        statsBase: {FO:8, CN:10, DX:9, IN:20, MA:55, CH:3},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Nécromancien":3},
        portrait: "npc-ennemis/monstres/demi_liche.png",
        biGenre: true,
        pvActuel: 70, ftActuel: 68, boostPV: 28, boostFT: 28,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 600, argent: 0,
        lootDrop: [{id:"COMP67", qte:1, proba:0.4}, {id:"BIJ35", qte:1, proba:0.2}],
        resistances: {resPhys:30, resMagie:50, resFeu:0, resPoison:100, resElec:20},
        zones: ["Île du Désespoir", "Catacombes de Caladon"]
    },
    // Créé par IA - stats estimées
    "undead_champion": {
        nom: "Champion Mort-Vivant", niveau: 13, race: "Mort-vivant",
        statsBase: {FO:14, CN:12, DX:8, IN:5, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/undead_champion.png",
        biGenre: true,
        pvActuel: 64, ftActuel: 70, boostPV: 24, boostFT: 26,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 420, argent: 0,
        lootDrop: [{id:"TEC06", qte:1, proba:0.3}, {id:"DEF09", qte:1, proba:0.2}],
        resistances: {resPhys:35, resMagie:20, resFeu:0, resPoison:100, resElec:10},
        zones: ["Île du Désespoir", "Catacombes de Caladon"]
    },
    // Créé par IA - stats estimées
    "pestilent_soul": {
        nom: "Âme Pestilentielle", niveau: 8, race: "Mort-vivant",
        statsBase: {FO:7, CN:7, DX:6, IN:4, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/pestilent_soul.png",
        pvActuel: 40, ftActuel: 38, boostPV: 14, boostFT: 12,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 210, argent: 0,
        lootDrop: [],
        resistances: {resPhys:10, resMagie:20, resFeu:0, resPoison:100, resElec:5},
        zones: ["Marais empoisonnés", "Île du Désespoir"]
    },
    // Créé par IA - stats estimées
    "ensanguine_soul": {
        nom: "Âme Ensanglantée", niveau: 11, race: "Mort-vivant",
        statsBase: {FO:8, CN:8, DX:8, IN:6, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/ensanguine_soul.png",
        pvActuel: 48, ftActuel: 46, boostPV: 18, boostFT: 16,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 320, argent: 0,
        lootDrop: [],
        resistances: {resPhys:15, resMagie:25, resFeu:0, resPoison:100, resElec:10},
        zones: ["Île du Désespoir", "Catacombes de Caladon"]
    },
    // Créé par IA - stats estimées
    "spectral_wraith": {
        nom: "Spectre Funèbre", niveau: 14, race: "Mort-vivant",
        statsBase: {FO:9, CN:9, DX:12, IN:10, MA:25, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/spectral_wraith.png",
        pvActuel: 58, ftActuel: 56, boostPV: 22, boostFT: 22,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 480, argent: 0,
        lootDrop: [],
        resistances: {resPhys:40, resMagie:40, resFeu:0, resPoison:100, resElec:15},
        zones: ["Île du Désespoir", "Le Void"]
    },
    // Créé par IA - stats estimées
    "soldier_decayed": {
        nom: "Soldat Décomposé", niveau: 4, race: "Mort-vivant",
        statsBase: {FO:7, CN:6, DX:5, IN:2, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/soldier_decayed.png",
        biGenre: true,
        pvActuel: 28, ftActuel: 30, boostPV: 8, boostFT: 8,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 100, argent: 0,
        lootDrop: [{id:"TEC03", qte:1, proba:0.15}],
        resistances: {resPhys:15, resMagie:5, resFeu:0, resPoison:100, resElec:5},
        zones: ["Catacombes de Caladon", "Cimetière"]
    },
    // Créé par IA - stats estimées
    "grave_lurker": {
        nom: "Rôdeur des Tombes", niveau: 6, race: "Mort-vivant",
        statsBase: {FO:8, CN:7, DX:6, IN:2, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/grave_lurker.png",
        biGenre: true,
        pvActuel: 36, ftActuel: 36, boostPV: 12, boostFT: 10,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 160, argent: 0,
        lootDrop: [],
        resistances: {resPhys:15, resMagie:5, resFeu:0, resPoison:100, resElec:5},
        zones: ["Cimetière", "Nécropole", "Catacombes de Caladon"]
    },
    // Créé par IA - stats estimées
    "putrid_husk": {
        nom: "Enveloppe Putride", niveau: 9, race: "Mort-vivant",
        statsBase: {FO:10, CN:8, DX:5, IN:2, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/putrid_husk.png",
        pvActuel: 44, ftActuel: 46, boostPV: 16, boostFT: 16,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 240, argent: 0,
        lootDrop: [],
        resistances: {resPhys:20, resMagie:10, resFeu:0, resPoison:100, resElec:5},
        zones: ["Marais empoisonnés", "Île du Désespoir"]
    },
    // Créé par IA - stats estimées
    "lord_of_the_damned": {
        nom: "Seigneur des Damnés", niveau: 18, race: "Mort-vivant",
        statsBase: {FO:12, CN:12, DX:10, IN:15, MA:40, CH:5},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Nécromancien":3, "Feu":1},
        portrait: "npc-ennemis/monstres/lord_of_the_damned.png",
        biGenre: true,
        pvActuel: 78, ftActuel: 76, boostPV: 34, boostFT: 32,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 800, argent: 0,
        lootDrop: [{id:"BIJ35", qte:1, proba:0.3}, {id:"AM37", qte:1, proba:0.2}],
        resistances: {resPhys:40, resMagie:50, resFeu:20, resPoison:100, resElec:20},
        zones: ["Île du Désespoir", "Le Void"]
    },
    // Créé par IA - stats estimées
    "holy_defiler": {
        nom: "Profanateur Sacré", niveau: 12, race: "Mort-vivant",
        statsBase: {FO:12, CN:10, DX:9, IN:8, MA:25, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/holy_defiler.png",
        biGenre: true,
        pvActuel: 56, ftActuel: 58, boostPV: 20, boostFT: 20,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 360, argent: 0,
        lootDrop: [{id:"COMP67", qte:1, proba:0.3}],
        resistances: {resPhys:25, resMagie:35, resFeu:0, resPoison:100, resElec:10},
        zones: ["Île du Désespoir", "Catacombes de Caladon"]
    },
    // Créé par IA - stats estimées
    "holy_slave": {
        nom: "Esclave Sacré", niveau: 7, race: "Mort-vivant",
        statsBase: {FO:8, CN:7, DX:6, IN:4, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/holy_slave.png",
        biGenre: true,
        pvActuel: 36, ftActuel: 36, boostPV: 10, boostFT: 10,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 170, argent: 0,
        lootDrop: [],
        resistances: {resPhys:15, resMagie:25, resFeu:0, resPoison:100, resElec:5},
        zones: ["Île du Désespoir"]
    },

    // ========== DÉMONS / ESPRITS / MAGIQUES ==========
    // Créé par IA - stats estimées
    "desecrator": {
        nom: "Profanateur", niveau: 15, race: "Démon",
        statsBase: {FO:13, CN:11, DX:10, IN:10, MA:20, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/desecrator.png",
        pvActuel: 68, ftActuel: 70, boostPV: 28, boostFT: 28,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 550, argent: 0,
        lootDrop: [],
        resistances: {resPhys:25, resMagie:35, resFeu:50, resPoison:50, resElec:10},
        zones: ["Île du Désespoir", "Le Void"]
    },
    // Créé par IA - stats estimées
    "mystic_fiend": {
        nom: "Démon Mystique", niveau: 12, race: "Démon",
        statsBase: {FO:10, CN:9, DX:11, IN:14, MA:40, CH:3},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Nécromancien":2},
        portrait: "npc-ennemis/monstres/mystic_fiend.png",
        pvActuel: 54, ftActuel: 56, boostPV: 20, boostFT: 20,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 380, argent: 0,
        lootDrop: [{id:"COMP67", qte:1, proba:0.35}],
        resistances: {resPhys:20, resMagie:40, resFeu:30, resPoison:30, resElec:0},
        zones: ["Île du Désespoir", "Manoir hanté"]
    },
    // Créé par IA - stats estimées
    "foe_mangler": {
        nom: "Broyeur d'Ennemis", niveau: 11, race: "Démon",
        statsBase: {FO:14, CN:10, DX:8, IN:6, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/foe_mangler.png",
        pvActuel: 58, ftActuel: 62, boostPV: 22, boostFT: 24,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 340, argent: 0,
        lootDrop: [],
        resistances: {resPhys:25, resMagie:20, resFeu:30, resPoison:50, resElec:0},
        zones: ["Île du Désespoir"]
    },
    // Créé par IA - stats estimées
    "speak_of_evil": {
        nom: "Parole du Mal", niveau: 8, race: "Démon",
        statsBase: {FO:8, CN:7, DX:9, IN:10, MA:25, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/speak_of_evil.png",
        pvActuel: 40, ftActuel: 40, boostPV: 14, boostFT: 14,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 220, argent: 0,
        lootDrop: [],
        resistances: {resPhys:15, resMagie:30, resFeu:20, resPoison:30, resElec:0},
        zones: ["Manoir hanté", "Île du Désespoir"]
    },
    // Créé par IA - stats estimées
    "screaming_wretch": {
        nom: "Misérable Hurlant", niveau: 6, race: "Démon",
        statsBase: {FO:7, CN:6, DX:8, IN:5, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/screaming_wretch.png",
        pvActuel: 32, ftActuel: 32, boostPV: 10, boostFT: 10,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 160, argent: 0,
        lootDrop: [],
        resistances: {resPhys:10, resMagie:20, resFeu:10, resPoison:20, resElec:0},
        zones: ["Marais empoisonnés", "Île du Désespoir"]
    },
    // Créé par IA - stats estimées
    "evil_tempest": {
        nom: "Tempête Maléfique", niveau: 13, race: "Esprit",
        statsBase: {FO:9, CN:8, DX:14, IN:12, MA:30, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/evil_tempest.png",
        pvActuel: 50, ftActuel: 52, boostPV: 18, boostFT: 18,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 420, argent: 0,
        lootDrop: [],
        resistances: {resPhys:30, resMagie:35, resFeu:0, resPoison:50, resElec:50},
        zones: ["Terres sauvages", "Le Void"]
    },
    // Créé par IA - stats estimées
    "murderain": {
        nom: "Pluie Meurtrière", niveau: 10, race: "Esprit",
        statsBase: {FO:8, CN:8, DX:10, IN:8, MA:20, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/murderain.png",
        pvActuel: 46, ftActuel: 46, boostPV: 16, boostFT: 16,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 290, argent: 0,
        lootDrop: [],
        resistances: {resPhys:25, resMagie:30, resFeu:0, resPoison:50, resElec:10},
        zones: ["Terres sauvages", "Île du Désespoir"]
    },
    // Créé par IA - stats estimées
    "lycanix": {
        nom: "Lycanix", niveau: 14, race: "Bête",
        statsBase: {FO:15, CN:12, DX:13, IN:5, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/lycanix.png",
        pvActuel: 66, ftActuel: 72, boostPV: 26, boostFT: 28,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 500, argent: 0,
        lootDrop: [],
        resistances: {resPhys:25, resMagie:20, resFeu:0, resPoison:20, resElec:0},
        zones: ["Terres sauvages du nord", "Montagnes"]
    },
    // Créé par IA - stats estimées
    "invisible_crusher": {
        nom: "Broyeur Invisible", niveau: 12, race: "Démon",
        statsBase: {FO:16, CN:10, DX:9, IN:4, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/invisible_crusher.png",
        pvActuel: 56, ftActuel: 68, boostPV: 20, boostFT: 26,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 380, argent: 0,
        lootDrop: [],
        resistances: {resPhys:20, resMagie:25, resFeu:10, resPoison:50, resElec:10},
        zones: ["Île du Désespoir"]
    },
    // Créé par IA - stats estimées
    "mysterious_apparition": {
        nom: "Apparition Mystérieuse", niveau: 9, race: "Esprit",
        statsBase: {FO:6, CN:7, DX:12, IN:10, MA:25, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/mysterious_apparition.png",
        pvActuel: 40, ftActuel: 36, boostPV: 14, boostFT: 12,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 250, argent: 0,
        lootDrop: [],
        resistances: {resPhys:35, resMagie:30, resFeu:0, resPoison:100, resElec:0},
        zones: ["Manoir hanté", "Terres sauvages"]
    },
    // Créé par IA - stats estimées
    "love_lights": {
        nom: "Lumières d'Amour", niveau: 5, race: "Esprit",
        statsBase: {FO:3, CN:4, DX:14, IN:6, MA:20, CH:8},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Energie":1},
        portrait: "npc-ennemis/monstres/love_lights.png",
        pvActuel: 24, ftActuel: 22, boostPV: 8, boostFT: 6,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 120, argent: 0,
        lootDrop: [],
        resistances: {resPhys:25, resMagie:20, resFeu:0, resPoison:100, resElec:30},
        zones: ["Terres sauvages", "Marais"]
    },
    // Créé par IA - stats estimées
    "familiar": {
        nom: "Familier", niveau: 3, race: "Esprit",
        statsBase: {FO:3, CN:3, DX:10, IN:8, MA:15, CH:5},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/familiar.png",
        pvActuel: 18, ftActuel: 16, boostPV: 6, boostFT: 4,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 60, argent: 0,
        lootDrop: [],
        resistances: {resPhys:15, resMagie:20, resFeu:0, resPoison:50, resElec:0},
        zones: ["Terres sauvages", "Forêt"]
    },
    // Créé par IA - stats estimées
    "familiar_dark": {
        nom: "Familier des Ténèbres", niveau: 6, race: "Esprit",
        statsBase: {FO:4, CN:4, DX:12, IN:10, MA:20, CH:4},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/familiar_dark.png",
        pvActuel: 26, ftActuel: 24, boostPV: 8, boostFT: 8,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 140, argent: 0,
        lootDrop: [],
        resistances: {resPhys:20, resMagie:30, resFeu:0, resPoison:100, resElec:0},
        zones: ["Manoir hanté", "Île du Désespoir"]
    },
    // Créé par IA - stats estimées
    "familiar_fire": {
        nom: "Familier de Feu", niveau: 7, race: "Élémentaire",
        statsBase: {FO:4, CN:4, DX:12, IN:8, MA:20, CH:3},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Feu":1},
        portrait: "npc-ennemis/monstres/familiar_fire.png",
        pvActuel: 28, ftActuel: 26, boostPV: 10, boostFT: 8,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 160, argent: 0,
        lootDrop: [],
        resistances: {resPhys:15, resMagie:15, resFeu:80, resPoison:100, resElec:0},
        zones: ["Zones volcaniques"]
    },
    // Créé par IA - stats estimées
    "familiar_ice": {
        nom: "Familier de Glace", niveau: 7, race: "Élémentaire",
        statsBase: {FO:4, CN:4, DX:12, IN:8, MA:20, CH:3},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Eau":1},
        portrait: "npc-ennemis/monstres/familiar_ice.png",
        pvActuel: 28, ftActuel: 26, boostPV: 10, boostFT: 8,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 160, argent: 0,
        lootDrop: [],
        resistances: {resPhys:15, resMagie:15, resFeu:0, resPoison:100, resElec:0},
        zones: ["Zones glacées"]
    },
    // Créé par IA - stats estimées
    "swamp_spirit": {
        nom: "Esprit des Marais", niveau: 7, race: "Esprit",
        statsBase: {FO:6, CN:6, DX:8, IN:6, MA:15, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/swamp_spirit.png",
        pvActuel: 34, ftActuel: 32, boostPV: 10, boostFT: 10,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 180, argent: 0,
        lootDrop: [],
        resistances: {resPhys:25, resMagie:25, resFeu:0, resPoison:100, resElec:0},
        zones: ["Marais empoisonnés"]
    },
    // Créé par IA - stats estimées
    "fen_fiend": {
        nom: "Démon des Marécages", niveau: 8, race: "Bête",
        statsBase: {FO:10, CN:8, DX:7, IN:4, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/fen_fiend.png",
        pvActuel: 42, ftActuel: 44, boostPV: 14, boostFT: 14,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 210, argent: 0,
        lootDrop: [],
        resistances: {resPhys:15, resMagie:15, resFeu:0, resPoison:50, resElec:0},
        zones: ["Marais empoisonnés", "Terres sauvages"]
    },
    // Créé par IA - stats estimées
    "flameshade": {
        nom: "Ombre de Flamme", niveau: 11, race: "Esprit",
        statsBase: {FO:8, CN:8, DX:12, IN:9, MA:25, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/flameshade.png",
        pvActuel: 48, ftActuel: 48, boostPV: 18, boostFT: 18,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 320, argent: 0,
        lootDrop: [],
        resistances: {resPhys:30, resMagie:30, resFeu:75, resPoison:100, resElec:0},
        zones: ["Zones volcaniques", "Île du Désespoir"]
    },
    // Créé par IA - stats estimées
    "gilded_horror": {
        nom: "Horreur Dorée", niveau: 13, race: "Démon",
        statsBase: {FO:12, CN:10, DX:11, IN:8, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/gilded_horror.png",
        pvActuel: 58, ftActuel: 60, boostPV: 22, boostFT: 22,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 420, argent: 50,
        lootDrop: [{id:"BIJ35", qte:1, proba:0.3}, {id:"AM37", qte:1, proba:0.2}],
        resistances: {resPhys:30, resMagie:25, resFeu:20, resPoison:50, resElec:0},
        zones: ["Île du Désespoir", "Manoir hanté"]
    },
    // Créé par IA - stats estimées
    "hell_beast": {
        nom: "Bête des Enfers", niveau: 10, race: "Bête",
        statsBase: {FO:13, CN:10, DX:10, IN:3, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/hell_beast.png",
        pvActuel: 52, ftActuel: 58, boostPV: 18, boostFT: 22,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 290, argent: 0,
        lootDrop: [],
        resistances: {resPhys:20, resMagie:15, resFeu:50, resPoison:30, resElec:0},
        zones: ["Île du Désespoir"]
    },

    // ========== ARAIGNÉES / BÊTES / REPTILES ==========
    // Créé par IA - stats estimées
    "spider_lesser": {
        nom: "Araignée Mineure", niveau: 1, race: "Araignée",
        statsBase: {FO:3, CN:3, DX:8, IN:1, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/spider_lesser.png",
        pvActuel: 14, ftActuel: 14, boostPV: 4, boostFT: 4,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 25, argent: 0,
        lootDrop: [],
        resistances: {resPhys:5, resMagie:0, resFeu:0, resPoison:20, resElec:0},
        zones: ["Forêt", "Grottes", "Égouts de Tarant"]
    },
    // Créé par IA - stats estimées
    "spider_base": {
        nom: "Araignée", niveau: 3, race: "Araignée",
        statsBase: {FO:5, CN:4, DX:9, IN:1, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/spider_base.png",
        pvActuel: 22, ftActuel: 22, boostPV: 6, boostFT: 6,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 70, argent: 0,
        lootDrop: [],
        resistances: {resPhys:5, resMagie:0, resFeu:0, resPoison:25, resElec:0},
        zones: ["Forêt", "Grottes"]
    },
    // Créé par IA - stats estimées
    "fire_spider": {
        nom: "Araignée de Feu", niveau: 8, race: "Araignée",
        statsBase: {FO:7, CN:6, DX:10, IN:2, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/fire_spider.png",
        pvActuel: 34, ftActuel: 36, boostPV: 10, boostFT: 10,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 210, argent: 0,
        lootDrop: [{id:"COMP50", qte:1, proba:0.25}],
        resistances: {resPhys:10, resMagie:10, resFeu:75, resPoison:20, resElec:0},
        zones: ["Zones volcaniques", "Terres sauvages"]
    },
    // Créé par IA - stats estimées
    "firejumper": {
        nom: "Sauteur de Feu", niveau: 5, race: "Araignée",
        statsBase: {FO:6, CN:5, DX:11, IN:1, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/firejumper.png",
        pvActuel: 26, ftActuel: 28, boostPV: 8, boostFT: 8,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 130, argent: 0,
        lootDrop: [],
        resistances: {resPhys:5, resMagie:5, resFeu:50, resPoison:20, resElec:0},
        zones: ["Terres sauvages", "Zones chaudes"]
    },
    // Créé par IA - stats estimées
    "terror_claw": {
        nom: "Griffe Terreur", niveau: 11, race: "Araignée",
        statsBase: {FO:12, CN:9, DX:11, IN:2, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/terror_claw.png",
        pvActuel: 50, ftActuel: 54, boostPV: 18, boostFT: 18,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 320, argent: 0,
        lootDrop: [],
        resistances: {resPhys:15, resMagie:5, resFeu:0, resPoison:30, resElec:0},
        zones: ["Terres sauvages", "Grottes"]
    },
    // Créé par IA - stats estimées
    "baleful_hound": {
        nom: "Chien Maléfique", niveau: 7, race: "Bête",
        statsBase: {FO:9, CN:7, DX:10, IN:3, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/baleful_hound.png",
        pvActuel: 38, ftActuel: 40, boostPV: 12, boostFT: 12,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 190, argent: 0,
        lootDrop: [],
        resistances: {resPhys:10, resMagie:5, resFeu:0, resPoison:10, resElec:0},
        zones: ["Terres sauvages", "Catacombes de Caladon"]
    },
    // Créé par IA - stats estimées
    "howler": {
        nom: "Hurleur", niveau: 9, race: "Bête",
        statsBase: {FO:11, CN:9, DX:9, IN:3, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/howler.png",
        pvActuel: 46, ftActuel: 50, boostPV: 16, boostFT: 18,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 250, argent: 0,
        lootDrop: [],
        resistances: {resPhys:15, resMagie:5, resFeu:0, resPoison:10, resElec:0},
        zones: ["Terres sauvages", "Montagnes"]
    },
    // Créé par IA - stats estimées
    "fever_beast": {
        nom: "Bête Fiévreuse", niveau: 8, race: "Bête",
        statsBase: {FO:10, CN:8, DX:8, IN:2, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/fever_beast.png",
        pvActuel: 42, ftActuel: 46, boostPV: 14, boostFT: 16,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 220, argent: 0,
        lootDrop: [],
        resistances: {resPhys:15, resMagie:5, resFeu:20, resPoison:30, resElec:0},
        zones: ["Terres sauvages", "Zones chaudes"]
    },
    // Créé par IA - stats estimées
    "dread_lizard": {
        nom: "Lézard Redouté", niveau: 10, race: "Reptilien",
        statsBase: {FO:12, CN:10, DX:9, IN:4, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/dread_lizard.png",
        pvActuel: 52, ftActuel: 56, boostPV: 18, boostFT: 20,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 280, argent: 0,
        lootDrop: [{id:"COMP50", qte:1, proba:0.2}],
        resistances: {resPhys:25, resMagie:5, resFeu:10, resPoison:20, resElec:0},
        zones: ["Terres sauvages", "Vendigroth"]
    },
    // Créé par IA - stats estimées
    "void_lizard_lesser": {
        nom: "Lézard du Vide Mineur", niveau: 11, race: "Reptilien",
        statsBase: {FO:10, CN:9, DX:10, IN:5, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/void_lizard_lesser.png",
        pvActuel: 50, ftActuel: 50, boostPV: 18, boostFT: 18,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 320, argent: 0,
        lootDrop: [],
        resistances: {resPhys:20, resMagie:25, resFeu:5, resPoison:30, resElec:0},
        zones: ["Le Void", "Terres sauvages"]
    },
    // Créé par IA - stats estimées
    "void_lizard_greater": {
        nom: "Grand Lézard du Vide", niveau: 15, race: "Reptilien",
        statsBase: {FO:14, CN:12, DX:12, IN:7, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/void_lizard_greater.png",
        pvActuel: 66, ftActuel: 68, boostPV: 26, boostFT: 26,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 520, argent: 0,
        lootDrop: [{id:"COMP50", qte:1, proba:0.3}],
        resistances: {resPhys:30, resMagie:35, resFeu:5, resPoison:40, resElec:0},
        zones: ["Le Void"]
    },
    // Créé par IA - stats estimées
    "reptilian_mage": {
        nom: "Mage Reptilien", niveau: 9, race: "Reptilien",
        statsBase: {FO:8, CN:7, DX:9, IN:13, MA:30, CH:3},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Energie":1, "Eau":1},
        portrait: "npc-ennemis/monstres/reptilian_mage.png",
        biGenre: true,
        pvActuel: 38, ftActuel: 38, boostPV: 12, boostFT: 12,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 260, argent: 10,
        lootDrop: [{id:"COMP67", qte:1, proba:0.3}],
        resistances: {resPhys:10, resMagie:20, resFeu:5, resPoison:20, resElec:10},
        zones: ["Terres sauvages", "Vendigroth"]
    },
    // Créé par IA - stats estimées
    "dragaron": {
        nom: "Dragaron", niveau: 16, race: "Dragon",
        statsBase: {FO:18, CN:15, DX:10, IN:8, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/dragaron.png",
        pvActuel: 84, ftActuel: 92, boostPV: 36, boostFT: 40,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 750, argent: 100,
        lootDrop: [{id:"COMP05", qte:1, proba:0.4}, {id:"BIJ35", qte:1, proba:0.25}],
        resistances: {resPhys:40, resMagie:20, resFeu:80, resPoison:30, resElec:0},
        zones: ["Montagnes", "Terres sauvages du nord"]
    },
    // Créé par IA - stats estimées
    "stone_mistress": {
        nom: "Maîtresse de Pierre", niveau: 14, race: "Golem",
        statsBase: {FO:16, CN:13, DX:5, IN:10, MA:25, CH:5},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/stone_mistress.png",
        pvActuel: 70, ftActuel: 76, boostPV: 28, boostFT: 30,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 480, argent: 0,
        lootDrop: [{id:"COMP02", qte:1, proba:0.35}],
        resistances: {resPhys:55, resMagie:20, resFeu:30, resPoison:100, resElec:10},
        zones: ["Mines de Kree", "Grottes de pierre"]
    },
    // Créé par IA - stats estimées
    "snake_menace": {
        nom: "Serpent Menaçant", niveau: 6, race: "Reptilien",
        statsBase: {FO:7, CN:6, DX:12, IN:3, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/snake_menace.png",
        pvActuel: 30, ftActuel: 32, boostPV: 10, boostFT: 10,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 150, argent: 0,
        lootDrop: [],
        resistances: {resPhys:5, resMagie:0, resFeu:5, resPoison:50, resElec:0},
        zones: ["Terres sauvages", "Marais"]
    },
    // Créé par IA - stats estimées
    "spirit_snake": {
        nom: "Serpent Esprit", niveau: 8, race: "Reptilien",
        statsBase: {FO:7, CN:6, DX:14, IN:5, MA:15, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/spirit_snake.png",
        pvActuel: 34, ftActuel: 34, boostPV: 10, boostFT: 10,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 210, argent: 0,
        lootDrop: [],
        resistances: {resPhys:20, resMagie:25, resFeu:0, resPoison:60, resElec:0},
        zones: ["Marais empoisonnés", "Terres sauvages"]
    },
    // Créé par IA - stats estimées
    "bolt_slayer": {
        nom: "Trancheur d'Éclairs", niveau: 7, race: "Construct",
        statsBase: {FO:9, CN:8, DX:12, IN:5, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/bolt_slayer.png",
        pvActuel: 40, ftActuel: 42, boostPV: 14, boostFT: 14,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 190, argent: 0,
        lootDrop: [{id:"COMP01", qte:1, proba:0.3}, {id:"MUN01", qte:2, proba:0.4}],
        resistances: {resPhys:25, resMagie:10, resFeu:10, resPoison:100, resElec:50},
        zones: ["Vendigroth", "Site du crash"]
    },

    // ========== CONSTRUCTS / MÉCANIQUE ==========
    // Créé par IA - stats estimées
    "clockwork_decoy": {
        nom: "Leurre Mécanique", niveau: 4, race: "Construct",
        statsBase: {FO:5, CN:5, DX:8, IN:3, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/clockwork_decoy.png",
        pvActuel: 26, ftActuel: 24, boostPV: 8, boostFT: 6,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 90, argent: 0,
        lootDrop: [{id:"COMP14", qte:1, proba:0.3}],
        resistances: {resPhys:20, resMagie:0, resFeu:10, resPoison:100, resElec:10},
        zones: ["Vendigroth", "Site du crash"]
    },
    // Créé par IA - stats estimées
    "arachnid_mechanized": {
        nom: "Arachnide Mécanisé", niveau: 8, race: "Construct",
        statsBase: {FO:10, CN:8, DX:10, IN:4, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/arachnid_mechanized.png",
        pvActuel: 42, ftActuel: 44, boostPV: 14, boostFT: 14,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 210, argent: 0,
        lootDrop: [{id:"COMP01", qte:1, proba:0.35}, {id:"COMP02", qte:1, proba:0.25}],
        resistances: {resPhys:30, resMagie:5, resFeu:10, resPoison:100, resElec:20},
        zones: ["Vendigroth"]
    },
    // Créé par IA - stats estimées
    "arachnid_mechanized_queen": {
        nom: "Reine Arachnide Mécanisée", niveau: 12, race: "Construct",
        statsBase: {FO:12, CN:10, DX:9, IN:6, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/arachnid_mechanized_queen.png",
        pvActuel: 56, ftActuel: 58, boostPV: 20, boostFT: 20,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 360, argent: 0,
        lootDrop: [{id:"COMP02", qte:1, proba:0.4}, {id:"COMP06", qte:1, proba:0.3}],
        resistances: {resPhys:35, resMagie:5, resFeu:10, resPoison:100, resElec:20},
        zones: ["Vendigroth"]
    },
    // Créé par IA - stats estimées
    "mercury_man": {
        nom: "Homme de Mercure", niveau: 10, race: "Construct",
        statsBase: {FO:10, CN:9, DX:13, IN:7, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/mercury_man.png",
        pvActuel: 48, ftActuel: 52, boostPV: 16, boostFT: 18,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 280, argent: 0,
        lootDrop: [{id:"COMP01", qte:1, proba:0.35}],
        resistances: {resPhys:30, resMagie:10, resFeu:10, resPoison:100, resElec:30},
        zones: ["Vendigroth", "Site du crash"]
    },

    // ========== PESTILENCE / ÉLÉMENTAIRES ==========
    // Créé par IA - stats estimées
    "epidemia": {
        nom: "Épidémia", niveau: 9, race: "Pestilentiel",
        statsBase: {FO:8, CN:8, DX:7, IN:5, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/epidemia.png",
        pvActuel: 42, ftActuel: 40, boostPV: 14, boostFT: 12,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 250, argent: 0,
        lootDrop: [],
        resistances: {resPhys:10, resMagie:20, resFeu:0, resPoison:100, resElec:0},
        zones: ["Île du Désespoir", "Marais empoisonnés"]
    },
    // Créé par IA - stats estimées
    "insectress_base": {
        nom: "Insectresse", niveau: 10, race: "Insectoïde",
        statsBase: {FO:10, CN:9, DX:10, IN:8, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/insectress_base.png",
        pvActuel: 48, ftActuel: 50, boostPV: 16, boostFT: 18,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 290, argent: 0,
        lootDrop: [{id:"COMP50", qte:1, proba:0.3}],
        resistances: {resPhys:15, resMagie:10, resFeu:0, resPoison:40, resElec:5},
        zones: ["Terres sauvages", "Nid d'insectes"]
    },
    // Créé par IA - stats estimées
    "storm_soldier": {
        nom: "Soldat de Tempête", niveau: 9, race: "Élémentaire",
        statsBase: {FO:8, CN:8, DX:12, IN:6, MA:20, CH:2},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Energie":1},
        portrait: "npc-ennemis/monstres/storm_soldier.png",
        pvActuel: 42, ftActuel: 42, boostPV: 14, boostFT: 14,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 260, argent: 0,
        lootDrop: [],
        resistances: {resPhys:15, resMagie:15, resFeu:0, resPoison:100, resElec:70},
        zones: ["Terres sauvages", "Montagnes"]
    },
    // Créé par IA - stats estimées
    "storm_fury": {
        nom: "Furie de Tempête", niveau: 13, race: "Élémentaire",
        statsBase: {FO:10, CN:9, DX:15, IN:8, MA:30, CH:2},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Energie":2},
        portrait: "npc-ennemis/monstres/storm_fury.png",
        pvActuel: 54, ftActuel: 56, boostPV: 20, boostFT: 20,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 420, argent: 0,
        lootDrop: [],
        resistances: {resPhys:20, resMagie:20, resFeu:0, resPoison:100, resElec:80},
        zones: ["Terres sauvages", "Montagnes"]
    },

    // ========== FAUNE ==========
    // Créé par IA - stats estimées
    "sewer_rat": {
        nom: "Rat des Égouts", niveau: 1, race: "Bête",
        statsBase: {FO:2, CN:2, DX:9, IN:1, CH:1},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/sewer_rat.png",
        pvActuel: 10, ftActuel: 10, boostPV: 2, boostFT: 2,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 15, argent: 0,
        lootDrop: [],
        resistances: {resPhys:0, resMagie:0, resFeu:0, resPoison:15, resElec:0},
        zones: ["Égouts de Tarant", "Donjons"]
    },
    // Créé par IA - stats estimées
    "leprous_monkey": {
        nom: "Singe Lépreux", niveau: 4, race: "Singe",
        statsBase: {FO:5, CN:4, DX:9, IN:4, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/leprous_monkey.png",
        pvActuel: 22, ftActuel: 22, boostPV: 6, boostFT: 6,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 90, argent: 0,
        lootDrop: [],
        resistances: {resPhys:5, resMagie:0, resFeu:0, resPoison:20, resElec:0},
        zones: ["Île du Désespoir", "Terres tropicales"]
    },
    // Créé par IA - stats estimées
    "bunny": {
        nom: "Lapin", niveau: 1, race: "Animal",
        statsBase: {FO:1, CN:1, DX:12, IN:1, CH:3},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/bunny.png",
        pvActuel: 8, ftActuel: 8, boostPV: 2, boostFT: 2,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 5, argent: 0,
        lootDrop: [],
        resistances: {resPhys:0, resMagie:0, resFeu:0, resPoison:0, resElec:0},
        zones: ["Terres sauvages", "Campagne"]
    },
    // Créé par IA - stats estimées
    "chicken": {
        nom: "Poulet", niveau: 1, race: "Animal",
        statsBase: {FO:1, CN:1, DX:8, IN:1, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/chicken.png",
        pvActuel: 6, ftActuel: 6, boostPV: 2, boostFT: 2,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 5, argent: 0,
        lootDrop: [],
        resistances: {resPhys:0, resMagie:0, resFeu:0, resPoison:0, resElec:0},
        zones: ["Villages", "Fermes"]
    },
    // Créé par IA - stats estimées
    "cow": {
        nom: "Vache", niveau: 1, race: "Animal",
        statsBase: {FO:4, CN:4, DX:3, IN:1, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/cow.png",
        pvActuel: 20, ftActuel: 18, boostPV: 6, boostFT: 4,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 10, argent: 0,
        lootDrop: [],
        resistances: {resPhys:0, resMagie:0, resFeu:0, resPoison:0, resElec:0},
        zones: ["Villages", "Fermes", "Campagne"]
    },
    // Créé par IA - stats estimées
    "pig": {
        nom: "Cochon", niveau: 1, race: "Animal",
        statsBase: {FO:2, CN:2, DX:5, IN:1, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/pig.png",
        pvActuel: 12, ftActuel: 10, boostPV: 4, boostFT: 2,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 5, argent: 0,
        lootDrop: [],
        resistances: {resPhys:0, resMagie:0, resFeu:0, resPoison:0, resElec:0},
        zones: ["Villages", "Fermes"]
    },
    // Créé par IA - stats estimées
    "sheep": {
        nom: "Mouton", niveau: 1, race: "Animal",
        statsBase: {FO:2, CN:2, DX:4, IN:1, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/sheep.png",
        pvActuel: 10, ftActuel: 10, boostPV: 4, boostFT: 2,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 5, argent: 0,
        lootDrop: [],
        resistances: {resPhys:0, resMagie:0, resFeu:0, resPoison:0, resElec:0},
        zones: ["Villages", "Campagne"]
    },
    // Créé par IA - stats estimées
    "stillwater_bunny": {
        nom: "Lapin de Stillwater", niveau: 2, race: "Animal",
        statsBase: {FO:1, CN:2, DX:13, IN:3, MA:10, CH:5},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/stillwater_bunny.png",
        pvActuel: 12, ftActuel: 10, boostPV: 4, boostFT: 2,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 30, argent: 0,
        lootDrop: [],
        resistances: {resPhys:5, resMagie:10, resFeu:0, resPoison:0, resElec:0},
        zones: ["Stillwater"]
    },
    // Créé par IA - stats estimées
    "stillwater_giant": {
        nom: "Géant de Stillwater", niveau: 15, race: "Bête",
        statsBase: {FO:18, CN:15, DX:6, IN:3, CH:2},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/monstres/stillwater_giant.png",
        pvActuel: 80, ftActuel: 88, boostPV: 34, boostFT: 38,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 600, argent: 0,
        lootDrop: [],
        resistances: {resPhys:40, resMagie:15, resFeu:0, resPoison:20, resElec:0},
        zones: ["Stillwater"]
    },

    // ========== BOSS UNIQUES ==========
    // Créé par IA - stats estimées
    "grey_king": {
        nom: "Le Roi Gris", niveau: 17, race: "Mort-vivant",
        unique: true,
        statsBase: {FO:12, CN:13, DX:10, IN:16, MA:45, CH:6},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Nécromancien":3},
        portrait: "npc-ennemis/unique/grey_king.png",
        pvActuel: 80, ftActuel: 80, boostPV: 36, boostFT: 36,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 1200, argent: 0,
        lootDrop: [{id:"AM37", qte:1, proba:0.8}, {id:"BIJ35", qte:1, proba:0.6}],
        resistances: {resPhys:35, resMagie:55, resFeu:0, resPoison:100, resElec:20},
        zones: ["Île du Désespoir"]
    },
    // Créé par IA - stats estimées
    "gyr_dolour": {
        nom: "Gyr-Dolour", niveau: 16, race: "Démon",
        unique: true,
        statsBase: {FO:15, CN:13, DX:12, IN:14, MA:30, CH:4},
        statsInvesties: {}, compInvesties: {},
        portrait: "npc-ennemis/unique/gyr_dolour.png",
        pvActuel: 76, ftActuel: 80, boostPV: 32, boostFT: 34,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 1000, argent: 0,
        lootDrop: [{id:"AM37", qte:1, proba:0.7}],
        resistances: {resPhys:35, resMagie:45, resFeu:40, resPoison:100, resElec:20},
        zones: ["Île du Désespoir"]
    },
    // Créé par IA - stats estimées
    "l_anamelach": {
        nom: "L'Anamelach", niveau: 20, race: "Démon",
        unique: true,
        statsBase: {FO:16, CN:15, DX:13, IN:18, MA:50, CH:8},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Nécromancien":4, "Feu":2},
        portrait: "npc-ennemis/unique/l_anamelach.png",
        pvActuel: 100, ftActuel: 106, boostPV: 44, boostFT: 48,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 1500, argent: 0,
        lootDrop: [{id:"AM37", qte:1, proba:0.9}, {id:"BIJ35", qte:2, proba:0.7}],
        resistances: {resPhys:40, resMagie:60, resFeu:75, resPoison:100, resElec:30},
        zones: ["Île du Désespoir"]
    },
    // Créé par IA - stats estimées
    "araya": {
        nom: "Araya l'Éternelle", niveau: 18, race: "Humain",
        unique: true,
        statsBase: {FO:13, CN:12, DX:12, IN:17, MA:50, CH:10},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Feu":3, "Energie":2, "Mental":2},
        portrait: "npc-ennemis/unique/araya.png",
        pvActuel: 90, ftActuel: 90, boostPV: 40, boostFT: 40,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 1500, argent: 100,
        lootDrop: [{id:"AM10", qte:1, proba:0.9}, {id:"BIJ35", qte:1, proba:0.8}],
        resistances: {resPhys:25, resMagie:50, resFeu:60, resPoison:20, resElec:40},
        zones: ["Tulla"]
    },
    // Créé par IA - stats estimées
    "araya_blessed": {
        nom: "Araya Bénie", niveau: 20, race: "Humain",
        unique: true,
        statsBase: {FO:13, CN:13, DX:13, IN:18, MA:55, CH:12},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Feu":3, "Energie":2, "Mental":3, "Nature":1},
        portrait: "npc-ennemis/unique/araya_blessed.png",
        pvActuel: 98, ftActuel: 98, boostPV: 46, boostFT: 46,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 2000, argent: 150,
        lootDrop: [{id:"AM10", qte:1, proba:1.0}, {id:"BIJ35", qte:2, proba:0.9}],
        resistances: {resPhys:30, resMagie:60, resFeu:70, resPoison:30, resElec:50},
        zones: ["Tulla"]
    },
    // Créé par IA - stats estimées
    "araya_cursed": {
        nom: "Araya Maudite", niveau: 19, race: "Humain",
        unique: true,
        statsBase: {FO:14, CN:12, DX:12, IN:17, MA:50, CH:5},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Nécromancien":3, "Feu":2, "Mental":1},
        portrait: "npc-ennemis/unique/araya_cursed.png",
        pvActuel: 94, ftActuel: 94, boostPV: 42, boostFT: 42,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 1800, argent: 80,
        lootDrop: [{id:"COMP67", qte:1, proba:0.9}, {id:"AM37", qte:1, proba:0.8}],
        resistances: {resPhys:25, resMagie:55, resFeu:40, resPoison:50, resElec:30},
        zones: ["Tulla"]
    },
    // Créé par IA - stats estimées
    "araya_ascended": {
        nom: "Araya Ascendante", niveau: 22, race: "Humain",
        unique: true,
        statsBase: {FO:14, CN:14, DX:14, IN:20, MA:60, CH:14},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Feu":4, "Energie":3, "Mental":3, "Nature":2},
        portrait: "npc-ennemis/unique/araya_ascended.png",
        pvActuel: 110, ftActuel: 112, boostPV: 52, boostFT: 54,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 3000, argent: 200,
        lootDrop: [{id:"AM10", qte:1, proba:1.0}, {id:"AM37", qte:1, proba:1.0}],
        resistances: {resPhys:35, resMagie:70, resFeu:80, resPoison:40, resElec:60},
        zones: ["Tulla"]
    },
    // Créé par IA - stats estimées
    "araya_fallen": {
        nom: "Araya Déchue", niveau: 17, race: "Humain",
        unique: true,
        statsBase: {FO:12, CN:11, DX:11, IN:15, MA:45, CH:4},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Nécromancien":4, "Mental":2},
        portrait: "npc-ennemis/unique/araya_fallen.png",
        pvActuel: 84, ftActuel: 84, boostPV: 36, boostFT: 36,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 1400, argent: 60,
        lootDrop: [{id:"COMP67", qte:2, proba:0.9}],
        resistances: {resPhys:20, resMagie:50, resFeu:20, resPoison:80, resElec:20},
        zones: ["Tulla"]
    },
    // Créé par IA - stats estimées
    "araya_shadow": {
        nom: "Ombre d'Araya", niveau: 16, race: "Esprit",
        unique: true,
        statsBase: {FO:10, CN:10, DX:15, IN:16, MA:45, CH:8},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Mental":3, "Nécromancien":2},
        portrait: "npc-ennemis/unique/araya_shadow.png",
        pvActuel: 76, ftActuel: 74, boostPV: 32, boostFT: 30,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 1200, argent: 0,
        lootDrop: [{id:"BIJ35", qte:1, proba:0.8}],
        resistances: {resPhys:40, resMagie:55, resFeu:0, resPoison:100, resElec:30},
        zones: ["Tulla"]
    },
    // Créé par IA - stats estimées
    "araya_spirit": {
        nom: "Esprit d'Araya", niveau: 18, race: "Esprit",
        unique: true,
        statsBase: {FO:8, CN:10, DX:16, IN:18, MA:55, CH:10},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Mental":4, "Energie":2, "Feu":1},
        portrait: "npc-ennemis/unique/araya_spirit.png",
        pvActuel: 86, ftActuel: 80, boostPV: 38, boostFT: 34,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 1600, argent: 0,
        lootDrop: [{id:"AM37", qte:1, proba:0.9}, {id:"BIJ35", qte:1, proba:0.7}],
        resistances: {resPhys:45, resMagie:65, resFeu:20, resPoison:100, resElec:40},
        zones: ["Tulla"]
    },
    // Créé par IA - stats estimées
    "kerghan": {
        nom: "Kerghan le Non-Mort", niveau: 25, race: "Mort-vivant",
        unique: true,
        statsBase: {FO:15, CN:16, DX:12, IN:22, MA:70, CH:12},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Nécromancien":5, "Mental":3, "Feu":2},
        portrait: "npc-ennemis/unique/kerghan.png",
        pvActuel: 130, ftActuel: 128, boostPV: 60, boostFT: 58,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 5000, argent: 500,
        lootDrop: [{id:"AM10", qte:1, proba:1.0}, {id:"BIJ35", qte:3, proba:1.0}, {id:"AM37", qte:2, proba:0.9}],
        resistances: {resPhys:50, resMagie:70, resFeu:30, resPoison:100, resElec:30},
        zones: ["Château de Kerghan", "Le Void"]
    },
    // Créé par IA - stats estimées
    "kerghan_spirit": {
        nom: "Esprit de Kerghan", niveau: 22, race: "Esprit",
        unique: true,
        statsBase: {FO:12, CN:14, DX:14, IN:22, MA:65, CH:10},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Nécromancien":5, "Mental":4},
        portrait: "npc-ennemis/unique/kerghan_spirit.png",
        pvActuel: 110, ftActuel: 108, boostPV: 50, boostFT: 50,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 3500, argent: 0,
        lootDrop: [],
        resistances: {resPhys:55, resMagie:75, resFeu:20, resPoison:100, resElec:30},
        zones: ["Le Void"]
    },
    // Créé par IA - stats estimées
    "kerghan_true": {
        nom: "Kerghan — La Fin de Toutes Choses", niveau: 30, race: "Mort-vivant",
        unique: true,
        statsBase: {FO:18, CN:20, DX:14, IN:25, MA:80, CH:15},
        statsInvesties: {}, compInvesties: {},
        magieBase: {"Nécromancien":6, "Mental":5, "Feu":3, "Energie":2},
        portrait: "npc-ennemis/unique/kerghan_true.png",
        pvActuel: 160, ftActuel: 158, boostPV: 80, boostFT: 78,
        equipement: {tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null},
        xp: 10000, argent: 1000,
        lootDrop: [{id:"AM10", qte:2, proba:1.0}, {id:"BIJ35", qte:3, proba:1.0}],
        resistances: {resPhys:60, resMagie:80, resFeu:40, resPoison:100, resElec:40},
        zones: ["Le Void"]
    }
};

const playlistMJ = [
	{ nom: "Titre", fichier: "Arcanum.mp3" },
	{ nom: "Zephyr - story", fichier: "Zephyr.mp3" },
	 { nom: "Combat START ", fichier: "Combat_start.mp3" },
    { nom: "Combat ", fichier: "Combat.mp3" },
    { nom: "Ambiance Calme - site crash", fichier: "Interlude.mp3" },
	{ nom: "Grandes villes", fichier: "Cities.mp3" },
	{ nom: "Petites villes", fichier: "Towns.mp3" },
    { nom: "Village", fichier: "Villages.mp3" },
    { nom: "Exploration Sauvage", fichier: "Wilderness.mp3" },
	{ nom: "Mines", fichier: "Mines.mp3" },
	{ nom: "Dungeons", fichier: "Dungeons.mp3" },
    { nom: "Nains - mines", fichier: "DwarvenMusic.mp3" },
	{ nom: "Tarante", fichier: "Tarant.mp3" },
	{ nom: "Egouts de Tarante", fichier: "Tarant_Sewers.mp3" },
	{ nom: "Caladon", fichier: "Caladon.mp3" },
	{ nom: "Caladon catacombes", fichier: "Caladon_Catacombs.mp3" },
	{ nom: "Qintara", fichier: "Qintara.mp3" },
    { nom: "Tulla", fichier: "Tulla.mp3" },
    { nom: "The Vendigroth Wastes", fichier: "Vendegoth.mp3" },
    { nom: "The Void", fichier: "Void.mp3" },
    { nom: "Ile du désespoir", fichier: "Isle_of_Despair.mp3" },
	{ nom: "Chateau de Kerghan", fichier: "Kerghan.mp3" }

];