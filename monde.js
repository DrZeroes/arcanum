// ================= DONNÉES DU MONDE =================

const coffresFixes = {
    "site_crash": {
        nom: "Trouvé sur les cadavres",
        items: [
            { id: "XXX02", qte: 1 }, 
            { id: "XXX03", qte: 1 }
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
    }, // <-- Fin de Ristezze
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
    } // <-- FERME LE MARCHAND TUTO
}; // <-- FERME LE DICTIONNAIRE GLOBAL (C'est elle qui manquait !)


// Fonction utilitaire pour générer du loot aléatoire
function genererLootAleatoire(niveauRareteMax = 5, nombreObjets = 3) {
    let loot = [];
    // On vérifie que itemsData existe bien
    let cles = Object.keys(itemsData).filter(k => {
        let item = itemsData[k];
        return !k.startsWith("XXX") && (parseInt(item.rarete) <= niveauRareteMax);
    });
    
    for (let i = 0; i < nombreObjets; i++) {
        if (cles.length === 0) break;
        let idAleatoire = cles[Math.floor(Math.random() * cles.length)];
        let itemTemplate = itemsData[idAleatoire];
        loot.push({ 
            id: idAleatoire, 
            qte: itemTemplate.stackable ? Math.floor(Math.random() * 10) + 1 : 1 
        });
    }
    return loot;
}