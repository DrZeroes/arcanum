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

    // ── ZONE 1 : Site du Crash & Wilderness ────────────────────────────────

    "loup_affame": {
        nom: "Loup affamé", race: "Humain", sexe: "M", niveau: 1,
        antecedent: "Prédateur affaibli par la famine, attaque à vue.",
        zones: ["crash", "arba", "simon"],
        xp: 30,
        statsBase:    { FO:8, IN:2, CN:7, DX:9, CH:1 },
        statsInvesties:{ FO:0, IN:0, CN:0, DX:0, CH:0 },
        // PV:18  FT:16
        compInvesties: { melee:2 },
        elementDegats: "poison",
        equipement: { tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null },
        pvActuel: 18, ftActuel: 16, boostPV:0, boostFT:0, argent: 0,
        lootDrop: [ { id:"COMP06", qte:1 }, { id:"OR_PIECES", qte:2 } ]
    },

    "loup_alpha": {
        nom: "Loup Alpha", race: "Humain", sexe: "M", niveau: 3,
        antecedent: "Dominant de la meute, plus grand et nettement plus agressif.",
        zones: ["crash", "arba"],
        xp: 80,
        statsBase:    { FO:10, IN:3, CN:9, DX:10, CH:2 },
        statsInvesties:{ FO:0, IN:0, CN:0, DX:0, CH:0 },
        // PV:23  FT:21
        compInvesties: { melee:3, esquive:1 },
        elementDegats: "poison",
        equipement: { tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null, main_droite:null, main_gauche:null },
        pvActuel: 23, ftActuel: 21, boostPV:0, boostFT:0, argent: 0,
        lootDrop: [ { id:"COMP06", qte:2 }, { id:"COMP05", qte:1 }, { id:"OR_PIECES", qte:5 } ]
    },

    "gnoll_rodeur": {
        nom: "Gnoll Rôdeur", race: "Demi-Orque", sexe: "M", niveau: 2,
        antecedent: "Humanoïde canin nomade, attaque en groupe depuis les lisières.",
        zones: ["crash", "arba", "simon"],
        xp: 55,
        statsBase:    { FO:9, IN:5, CN:8, DX:8, CH:2 },
        statsInvesties:{ FO:0, IN:0, CN:0, DX:0, CH:0 },
        // PV:23  FT:21
        compInvesties: { melee:2, lancer:1 },
        equipement: {
            tete:null,
            torse: { id:"DEF02", quantite:1, durabilite:40, durabiliteMax:100 },
            gants:null, bottes:null, anneau:null, amulette:null,
            main_droite: { id:"AM07", quantite:1, durabilite:50, durabiliteMax:100 },
            main_gauche:null
        },
        pvActuel: 23, ftActuel: 21, boostPV:0, boostFT:0, argent: 5,
        lootDrop: [ { id:"AM07", qte:1 }, { id:"OR_PIECES", qte:8 }, { id:"CONS03", qte:1 } ]
    },

    "simon_fahrkus": {
        nom: "Simon Fahrkus", race: "Humain", sexe: "M", niveau: 3,
        antecedent: "Escroc retors, survivant de l'épave. Persuasif et dangereux, il cherche à dépouiller les rescapés avant de fuir.",
        zones: ["crash"],
        xp: 75,
        statsBase:    { FO:7, IN:10, CN:8, DX:9, CH:12 },
        statsInvesties:{ FO:0, IN:0, CN:0, DX:0, CH:0 },
        // PV:24  FT:24 (FO*2+IN | CN*2+IN)
        compInvesties: { persuasion:4, discretion:3, vol_a_la_tire:2 },
        equipement: {
            tete:null,
            torse: { id:"DEF01", quantite:1, durabilite:90, durabiliteMax:100 },
            gants:null, bottes:null, anneau:null, amulette:null,
            main_droite: { id:"AM04", quantite:1, durabilite:100, durabiliteMax:100 },
            main_gauche:null
        },
        pvActuel: 24, ftActuel: 24, boostPV:0, boostFT:0, argent: 80,
        lootDrop: [ { id:"AM04", qte:1 }, { id:"OR_PIECES", qte:65 }, { id:"CONS03", qte:2 } ]
    },

    "elfe_encapuchonnee": {
        nom: "Elfe Encapuchonnée", race: "Elfe", sexe: "F", niveau: 7,
        antecedent: "Premier boss. Mystérieuse elfe dont l'identité est dissimulée. Sa présence sur l'épave n'est pas accidentelle — elle cherche quelque chose dans les débris.",
        zones: ["crash"],
        xp: 280,
        statsBase:    { FO:8, IN:13, CN:9, DX:13, CH:10 },
        statsInvesties:{ FO:0, IN:0, CN:2, DX:2, CH:0 },
        // PV:29  FT:33
        compInvesties: { magie_combat:5, esquive:4, discretion:3 },
        elementDegats: "feu",
        equipement: {
            tete: { id:"DEF04", quantite:1, durabilite:100, durabiliteMax:100 },
            torse: { id:"DEF04", quantite:1, durabilite:100, durabiliteMax:100 },
            gants:null, bottes:null,
            anneau: { id:"AM09", quantite:1, durabilite:100, durabiliteMax:100 },
            amulette:null,
            main_droite: { id:"AM03", quantite:1, durabilite:100, durabiliteMax:100 },
            main_gauche:null
        },
        pvActuel: 29, ftActuel: 33, boostPV:0, boostFT:0, argent: 40,
        lootDrop: [ { id:"AM03", qte:1 }, { id:"AM09", qte:1 }, { id:"OR_PIECES", qte:35 }, { id:"CONS04", qte:2 } ]
    },

    // ── ZONE 2 : Triste Colline & Mine ─────────────────────────────────────

    "pickpocket": {
        nom: "Pickpocket Halfelin", race: "Halfelin", sexe: "M", niveau: 2,
        antecedent: "Petit voleur fuyant la mine, vole dans les poches avant de disparaître.",
        zones: ["tris"],
        xp: 45,
        statsBase:    { FO:5, IN:8, CN:7, DX:11, CH:7 },
        statsInvesties:{ FO:0, IN:0, CN:0, DX:0, CH:0 },
        // PV:18  FT:22
        compInvesties: { discretion:3, vol_a_la_tire:3, attaque_sournoise:2 },
        equipement: {
            tete:null,
            torse: { id:"DEF01", quantite:1, durabilite:80, durabiliteMax:100 },
            gants:null, bottes:null, anneau:null, amulette:null,
            main_droite: { id:"AM04", quantite:1, durabilite:100, durabiliteMax:100 },
            main_gauche:null
        },
        pvActuel: 18, ftActuel: 22, boostPV:0, boostFT:0, argent: 35,
        lootDrop: [ { id:"AM04", qte:1 }, { id:"OR_PIECES", qte:25 } ]
    },

    "bandit_route": {
        nom: "Bandit de Grand Chemin", race: "Humain", sexe: "M", niveau: 3,
        antecedent: "Ancien mineur reconverti au brigandage, désespéré et armé.",
        zones: ["tris", "simon"],
        xp: 70,
        statsBase:    { FO:9, IN:7, CN:8, DX:8, CH:5 },
        statsInvesties:{ FO:0, IN:0, CN:0, DX:0, CH:0 },
        // PV:25  FT:23
        compInvesties: { melee:3, esquive:1 },
        equipement: {
            tete:null,
            torse: { id:"DEF07", quantite:1, durabilite:60, durabiliteMax:100 },
            gants:null,
            bottes: { id:"DEF06", quantite:1, durabilite:50, durabiliteMax:100 },
            anneau:null, amulette:null,
            main_droite: { id:"AM08", quantite:1, durabilite:55, durabiliteMax:100 },
            main_gauche:null
        },
        pvActuel: 25, ftActuel: 23, boostPV:0, boostFT:0, argent: 20,
        lootDrop: [ { id:"AM08", qte:1 }, { id:"OR_PIECES", qte:18 }, { id:"COMP08", qte:2 } ]
    },

    "bandit_chef": {
        nom: "Lucain le Grand", race: "Humain", sexe: "M", niveau: 5,
        antecedent: "Lucain le Grand — meneur brutal surnommé pour sa stature et sa cruauté, ex-soldat de Tarante tombé dans la criminalité.",
        zones: ["tris"],
        xp: 150,
        statsBase:    { FO:11, IN:8, CN:9, DX:9, CH:7 },
        statsInvesties:{ FO:0, IN:0, CN:0, DX:0, CH:0 },
        // PV:30  FT:26
        compInvesties: { melee:4, esquive:2, persuasion:1 },
        equipement: {
            tete: { id:"DEF11", quantite:1, durabilite:80, durabiliteMax:100 },
            torse: { id:"DEF05", quantite:1, durabilite:75, durabiliteMax:100 },
            gants:null,
            bottes: { id:"DEF06", quantite:1, durabilite:70, durabiliteMax:100 },
            anneau:null, amulette:null,
            main_droite: { id:"AM06", quantite:1, durabilite:85, durabiliteMax:100 },
            main_gauche: { id:"DEF08", quantite:1, durabilite:70, durabiliteMax:100 }
        },
        pvActuel: 30, ftActuel: 26, boostPV:0, boostFT:0, argent: 65,
        lootDrop: [ { id:"AM06", qte:1 }, { id:"OR_PIECES", qte:55 }, { id:"CONS03", qte:2 } ]
    },

    "gnome_solitaire": {
        nom: "Gnome Solitaire", race: "Gnome", sexe: "M", niveau: 2,
        antecedent: "Gnome paranoïaque vivant en marge du village. Attaque quiconque s'approche de son territoire, convaincu d'être espionné.",
        zones: ["tris"],
        xp: 40,
        statsBase:    { FO:6, IN:9, CN:7, DX:10, CH:4 },
        statsInvesties:{ FO:0, IN:0, CN:0, DX:0, CH:0 },
        // PV:21  FT:23
        compInvesties: { mecanique:3, discretion:2 },
        equipement: {
            tete:null,
            torse: { id:"DEF01", quantite:1, durabilite:55, durabiliteMax:100 },
            gants:null, bottes:null, anneau:null, amulette:null,
            main_droite: { id:"AM13", quantite:1, durabilite:80, durabiliteMax:100 },
            main_gauche:null
        },
        pvActuel: 21, ftActuel: 23, boostPV:0, boostFT:0, argent: 12,
        lootDrop: [ { id:"COMP03", qte:3 }, { id:"OR_PIECES", qte:10 } ]
    },

    "machiniste": {
        nom: "Machiniste", race: "Gnome", sexe: "M", niveau: 1,
        antecedent: "Réparateur de machines inoffensif, coincé à Triste Colline. Non-hostile — ne se bat que s'il est directement attaqué. Peut offrir des réparations.",
        zones: ["tris"],
        xp: 5,
        statsBase:    { FO:4, IN:10, CN:6, DX:7, CH:8 },
        statsInvesties:{ FO:0, IN:0, CN:0, DX:0, CH:0 },
        // PV:18  FT:22
        compInvesties: { mecanique:4, persuasion:1 },
        equipement: {
            tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null,
            main_droite: { id:"AM15", quantite:1, durabilite:100, durabiliteMax:100 },
            main_gauche:null
        },
        pvActuel: 18, ftActuel: 22, boostPV:0, boostFT:0, argent: 20,
        lootDrop: [ { id:"COMP03", qte:2 }, { id:"COMP02", qte:2 }, { id:"OR_PIECES", qte:15 } ]
    },

    "braqueur": {
        nom: "Braqueur", race: "Humain", sexe: "M", niveau: 4,
        antecedent: "Brigand armé d'une arme à feu, opère sur la route menant à Triste Colline. Préfère intimider avant de tirer.",
        zones: ["tris"],
        xp: 100,
        statsBase:    { FO:9, IN:7, CN:8, DX:10, CH:6 },
        statsInvesties:{ FO:0, IN:0, CN:0, DX:0, CH:0 },
        // PV:25  FT:23
        compInvesties: { armes_a_feu:4, intimidation:2 },
        equipement: {
            tete:null,
            torse: { id:"DEF07", quantite:1, durabilite:65, durabiliteMax:100 },
            gants:null,
            bottes: { id:"DEF06", quantite:1, durabilite:60, durabiliteMax:100 },
            anneau:null, amulette:null,
            main_droite: { id:"AF02", quantite:1, durabilite:80, durabiliteMax:100 },
            main_gauche:null
        },
        pvActuel: 25, ftActuel: 23, boostPV:0, boostFT:0, argent: 45,
        lootDrop: [ { id:"AF02", qte:1 }, { id:"OR_PIECES", qte:38 }, { id:"COMP08", qte:2 } ]
    },

    "araignee_grottes": {
        nom: "Araignée des Grottes", race: "Humain", sexe: "M", niveau: 3,
        antecedent: "Créature venimeuse tapie dans les galeries de la mine abandonnée sous Triste Colline.",
        zones: ["tris"],
        xp: 65,
        statsBase:    { FO:9, IN:2, CN:8, DX:11, CH:1 },
        statsInvesties:{ FO:0, IN:0, CN:0, DX:0, CH:0 },
        // PV:20  FT:18
        compInvesties: { melee:3, discretion:2 },
        elementDegats: "poison",
        equipement: {
            tete:null, torse:null, gants:null, bottes:null, anneau:null, amulette:null,
            main_droite:null, main_gauche:null
        },
        pvActuel: 20, ftActuel: 18, boostPV:0, boostFT:0, argent: 0,
        lootDrop: [ { id:"COMP06", qte:2 }, { id:"TEC02", qte:1 } ]
    },

    "mineur_revolte": {
        nom: "Mineur en Révolte", race: "Humain", sexe: "M", niveau: 3,
        antecedent: "Ouvrier de la mine épuisé et exploité, il a choisi la violence.",
        zones: ["tris"],
        xp: 60,
        statsBase:    { FO:10, IN:6, CN:9, DX:7, CH:5 },
        statsInvesties:{ FO:0, IN:0, CN:0, DX:0, CH:0 },
        // PV:26  FT:24
        compInvesties: { melee:2 },
        equipement: {
            tete:null,
            torse: { id:"DEF05", quantite:1, durabilite:45, durabiliteMax:100 },
            gants:null, bottes:null, anneau:null, amulette:null,
            main_droite: { id:"AM15", quantite:1, durabilite:100, durabiliteMax:100 },
            main_gauche:null
        },
        pvActuel: 26, ftActuel: 24, boostPV:0, boostFT:0, argent: 8,
        lootDrop: [ { id:"OR_PIECES", qte:8 }, { id:"COMP02", qte:3 } ]
    },

    "garde_mine": {
        nom: "Garde de Mine corrompu", race: "Humain", sexe: "M", niveau: 4,
        antecedent: "Garde payé par les propriétaires pour faire taire les plaintes.",
        zones: ["tris"],
        xp: 110,
        statsBase:    { FO:10, IN:8, CN:9, DX:8, CH:6 },
        statsInvesties:{ FO:0, IN:0, CN:0, DX:0, CH:0 },
        // PV:28  FT:26
        compInvesties: { melee:3, esquive:1 },
        equipement: {
            tete: { id:"DEF11", quantite:1, durabilite:90, durabiliteMax:100 },
            torse: { id:"DEF09", quantite:1, durabilite:90, durabiliteMax:100 },
            gants:null,
            bottes: { id:"DEF06", quantite:1, durabilite:80, durabiliteMax:100 },
            anneau:null, amulette:null,
            main_droite: { id:"AM06", quantite:1, durabilite:90, durabiliteMax:100 },
            main_gauche:null
        },
        pvActuel: 28, ftActuel: 26, boostPV:0, boostFT:0, argent: 30,
        lootDrop: [ { id:"DEF09", qte:1 }, { id:"OR_PIECES", qte:30 }, { id:"CONS03", qte:1 } ]
    },

    // ── ZONE 3 : Route vers Tarante (Wilderness) ───────────────────────────

    "orc_pillard": {
        nom: "Orc Pillard", race: "Orque", sexe: "M", niveau: 4,
        antecedent: "Pillard tribale chassé de son clan, attaque les convois commerciaux.",
        zones: ["tarante"],
        xp: 120,
        statsBase:    { FO:12, IN:6, CN:11, DX:8, CH:3 },
        statsInvesties:{ FO:0, IN:0, CN:0, DX:0, CH:0 },
        // PV:30  FT:28
        compInvesties: { melee:4, lancer:2 },
        equipement: {
            tete:null,
            torse: { id:"DEF02", quantite:1, durabilite:60, durabiliteMax:100 },
            gants:null, bottes:null, anneau:null, amulette:null,
            main_droite: { id:"AM10", quantite:1, durabilite:65, durabiliteMax:100 },
            main_gauche:null
        },
        pvActuel: 30, ftActuel: 28, boostPV:0, boostFT:0, argent: 12,
        lootDrop: [ { id:"AM10", qte:1 }, { id:"OR_PIECES", qte:12 }, { id:"DEF02", qte:1 } ]
    },

    "brigand_arme": {
        nom: "Brigand Armé", race: "Humain", sexe: "M", niveau: 5,
        antecedent: "Mercenaire sans contrat, vole les voyageurs sur la route de Tarante.",
        zones: ["tarante"],
        xp: 140,
        statsBase:    { FO:10, IN:8, CN:9, DX:9, CH:5 },
        statsInvesties:{ FO:0, IN:0, CN:0, DX:0, CH:0 },
        // PV:28  FT:26
        compInvesties: { melee:3, armes_a_feu:2, esquive:2 },
        equipement: {
            tete:null,
            torse: { id:"DEF07", quantite:1, durabilite:70, durabiliteMax:100 },
            gants:null,
            bottes: { id:"DEF06", quantite:1, durabilite:65, durabiliteMax:100 },
            anneau:null, amulette:null,
            main_droite: { id:"AF02", quantite:1, durabilite:70, durabiliteMax:100 },
            main_gauche:null
        },
        pvActuel: 28, ftActuel: 26, boostPV:0, boostFT:0, argent: 45,
        lootDrop: [ { id:"AF02", qte:1 }, { id:"MUN01", qte:8 }, { id:"OR_PIECES", qte:40 } ]
    },

    "ogre_sauvage": {
        nom: "Ogre Sauvage", race: "Ogre", sexe: "M", niveau: 4,
        antecedent: "Solitaire errant, territorial et imprévisible. Ne fuira jamais.",
        zones: ["tarante"],
        xp: 200,
        statsBase:    { FO:14, IN:2, CN:8, DX:7, CH:2 },
        statsInvesties:{ FO:0, IN:0, CN:0, DX:0, CH:0 },
        // PV:30  FT:18
        compInvesties: { melee:3 },
        equipement: {
            tete:null,
            torse: { id:"DEF02", quantite:1, durabilite:50, durabiliteMax:100 },
            gants:null, bottes:null, anneau:null, amulette:null,
            main_droite: { id:"AM01", quantite:1, durabilite:80, durabiliteMax:100 },
            main_gauche:null
        },
        pvActuel: 30, ftActuel: 18, boostPV:0, boostFT:0, argent: 0,
        lootDrop: [ { id:"OR_PIECES", qte:5 }, { id:"COMP02", qte:4 } ]
    },

    // ── ZONE 4 : Approche de Tarante (Main de Moloch) ─────────────────────

    "assassin_main": {
        nom: "Assassin de la Main de Moloch", race: "Humain", sexe: "M", niveau: 6,
        antecedent: "Tueur de la confrérie secrète, envoyé pour éliminer le survivant du Zephyr.",
        zones: ["tarante"],
        xp: 220,
        statsBase:    { FO:9, IN:10, CN:8, DX:12, CH:7 },
        statsInvesties:{ FO:0, IN:0, CN:0, DX:0, CH:0 },
        // PV:28  FT:26
        compInvesties: { melee:3, discretion:4, attaque_sournoise:4, esquive:3 },
        equipement: {
            tete:null,
            torse: { id:"DEF07", quantite:1, durabilite:100, durabiliteMax:100 },
            gants:null, bottes:null, anneau:null, amulette:null,
            main_droite: { id:"AM04", quantite:1, durabilite:100, durabiliteMax:100 },
            main_gauche: { id:"AM04", quantite:1, durabilite:100, durabiliteMax:100 }
        },
        pvActuel: 28, ftActuel: 26, boostPV:0, boostFT:0, argent: 80,
        lootDrop: [ { id:"AM04", qte:2 }, { id:"OR_PIECES", qte:70 }, { id:"CONS04", qte:1 }, { id:"XXX02", qte:1 } ]
    },

    "tireur_embuscade": {
        nom: "Tireur en Embuscade", race: "Humain", sexe: "M", niveau: 5,
        antecedent: "Mercenaire de la Main positionné en hauteur, tire depuis l'ombre.",
        zones: ["tarante"],
        xp: 160,
        statsBase:    { FO:8, IN:10, CN:8, DX:13, CH:6 },
        statsInvesties:{ FO:0, IN:0, CN:0, DX:0, CH:0 },
        // PV:26  FT:26
        compInvesties: { armes_a_feu:5, discretion:3, esquive:2 },
        equipement: {
            tete:null,
            torse: { id:"DEF07", quantite:1, durabilite:100, durabiliteMax:100 },
            gants:null, bottes:null, anneau:null, amulette:null,
            main_droite: null, main_gauche: null,
            deux_mains: { id:"AF05", quantite:1, durabilite:100, durabiliteMax:100 }
        },
        pvActuel: 26, ftActuel: 26, boostPV:0, boostFT:0, argent: 60,
        lootDrop: [ { id:"AF05", qte:1 }, { id:"MUN02", qte:12 }, { id:"OR_PIECES", qte:55 } ]
    },

    "assassin_elite": {
        nom: "Assassin d'Élite de la Main", race: "Humain", sexe: "M", niveau: 8,
        antecedent: "Le meilleur opérateur de la Main de Moloch. Il ne rate jamais sa cible.",
        zones: ["tarante"],
        xp: 350,
        statsBase:    { FO:10, IN:11, CN:9, DX:14, CH:8 },
        statsInvesties:{ FO:0, IN:0, CN:0, DX:0, CH:0 },
        // PV:31  FT:29
        compInvesties: { melee:5, discretion:5, attaque_sournoise:5, esquive:4, detection_piege:2 },
        equipement: {
            tete:null,
            torse: { id:"DEF07", quantite:1, durabilite:100, durabiliteMax:100 },
            gants:null, bottes:null, anneau:null, amulette:null,
            main_droite: { id:"AM09", quantite:1, durabilite:100, durabiliteMax:100 },
            main_gauche: { id:"AM04", quantite:1, durabilite:100, durabiliteMax:100 }
        },
        pvActuel: 31, ftActuel: 29, boostPV:0, boostFT:0, argent: 150,
        lootDrop: [ { id:"AM09", qte:1 }, { id:"AM04", qte:1 }, { id:"OR_PIECES", qte:130 }, { id:"CONS04", qte:2 } ]
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