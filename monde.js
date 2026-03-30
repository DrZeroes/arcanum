// ================= DONNÉES DU MONDE =================

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
            { id: "MUN01", qte: 100 }, { id: "CONS02", qte: 2 }
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
    "tarante": { nom: "Tarante", x: 51.5, y: 51.1, musique: "Tarant.mp3",desc: "La cité industrielle." },
    "tr_col": { nom: "Triste Colline", x: 30.5, y: 65.4, musique: "Villages.mp3",desc: "Un petit village minier." },
    "cendrebourg": { nom: "Cendrebourg", x: 74.3, y: 55.2, musique: "Cities.mp3",desc: "Une ville sombre et mystérieuse." },
    "crash": { nom: "Site du Crash", x: 27.3, y: 62.8, musique: "Interlude.mp3",desc: "Le Zephyr est tombé ici." },
    "abraham": { nom: "Demeure d'Abraham", x: 28.1, y: 64.1, musique: "Wilderness.mp3",desc: "Maison d'un vieil ermite." },
    "simon": { nom: "Maison de Simon", x: 27.1, y: 65.9, musique: "Wilderness.mp3", desc: "Domicile de Simon" }
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
	{ nom: "Chateau de Kerghan", fichier: "Kerghan.mp3" },
    { nom: "Ile du désespoir", fichier: "Isle_of_Despair.mp3" }

];