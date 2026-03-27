// ================= DICTIONNAIRE DES OBJETS =================
// Préfixes : AM (Mêlée), AD (Distance), AF (Feu), DEF (Armure), BIJ (Accessoire), 
// CONS (Consommable), MUN (Munition), COMP (Composant), DIV (Divers), XXX (Quête/Unique)




const itemsData = {
    // ---------------- ARMES DE MÊLÉE (AM) ----------------
    "AM01": {
        nom: "Hache rouillée", desc: "Une hache usée par le temps.",
        type: "arme_melee", rarete: "2", poids: 3.0, prix: 30,
        equipable: "main_droite", stackable: false, degats: "1-8", armure: 0, vitesse: 10, portee: 1,
        stats: {}, prerequis: { FO: 7 }, alignement: 0, nbUsages: null
    },
    "AM02": {
        nom: "Marteau de qualité", desc: "Un marteau de forgeron parfaitement équilibré.",
        type: "arme_melee", rarete: "6", poids: 4.5, prix: 150,
        equipable: "main_droite", stackable: false, degats: "2-12", armure: 0, vitesse: 11, portee: 1,
        stats: {}, prerequis: { FO: 9 }, alignement: -5, nbUsages: null
    },
    "AM03": {
        nom: "Épée enchantée", desc: "Une lame luisante qui palpite d'une énergie arcanique.",
        type: "arme_melee", rarete: "8", poids: 2.0, prix: 600,
        equipable: "main_droite", stackable: false, degats: "4-14", armure: 0, vitesse: 14, portee: 1,
        stats: { resMagie: 10, FT: 2, align:10 }, prerequis: { FO: 6 }, alignement: 30, nbUsages: null
    },
    "AM04": {
        nom: "Dague simple", desc: "Une petite lame facile à dissimuler.",
        type: "arme_melee", rarete: "3", poids: 0.5, prix: 30,
        equipable: "main_droite", stackable: false, degats: "1-4", armure: 0, vitesse: 16, portee: 1,
        stats: {}, prerequis: {}, alignement: 0, nbUsages: null
    },
    "AM05": {
        nom: "Bâton", desc: "Un long bâton en bois robuste, souvent utilisé par les voyageurs.",
        type: "arme_melee", rarete: "2", poids: 1.5, prix: 20,
        equipable: "deux_mains", stackable: false, degats: "1-6", armure: 0, vitesse: 12, portee: 1,
        stats: {FT:2}, prerequis: {}, alignement: 0, nbUsages: null
    },
    "AM06": {
        nom: "Épée simple", desc: "Une lame droite standard en fer.",
        type: "arme_melee", rarete: "4", poids: 2.5, prix: 100,
        equipable: "main_droite", stackable: false, degats: "2-8", armure: 0, vitesse: 12, portee: 1,
        stats: {}, prerequis: { FO: 6 }, alignement: 0, nbUsages: null
    },
    "AM07": {
        nom: "Couteau rouillé", desc: "Plus dangereux pour le tétanos que pour la blessure.",
        type: "arme_melee", rarete: "1", poids: 0.5, prix: 10,
        equipable: "main_droite", stackable: false, degats: "1-3", armure: 0, vitesse: 14, portee: 1,
        stats: {}, prerequis: {}, alignement: 0, nbUsages: null
    },
    "AM08": {
        nom: "Épée rouillée", desc: "Une lame qui a connu des jours meilleurs.",
        type: "arme_melee", rarete: "1", poids: 2.5, prix: 8,
        equipable: "main_droite", stackable: false, degats: "1-6", armure: 0, vitesse: 10, portee: 1,
        stats: {}, prerequis: { FO: 6 }, alignement: 0, nbUsages: null
    },
    "AM09": {
        nom: "Vieille rapière", desc: "Fine et élégante, malgré les taches de rouille.",
        type: "arme_melee", rarete: "4", poids: 1.5, prix: 45,
        equipable: "main_droite", stackable: false, degats: "2-9", armure: 0, vitesse: 15, portee: 1,
        stats: {}, prerequis: { DX: 9 }, alignement: 0, nbUsages: null
    },
    "AM10": {
        nom: "Hache", desc: "Une hache de bûcheron bien affûtée.",
        type: "arme_melee", rarete: "4", poids: 3.5, prix: 50,
        equipable: "main_droite", stackable: false, degats: "3-10", armure: 0, vitesse: 9, portee: 1,
        stats: {}, prerequis: { FO: 8 }, alignement: 0, nbUsages: null
    },




    // ---------------- ARMES À DISTANCE (AD) ----------------
    "AD01": {
        nom: "Arc court", desc: "Un arc simple en bois souple. Nécessite des flèches.",
        type: "arme_distance", rarete: "3", poids: 1.5, prix: 100,
        equipable: "deux_mains", stackable: false, degats: "1-6", armure: 0, vitesse: 10, portee: 15,
        stats: {}, prerequis: { DX: 8 }, alignement: 0, nbUsages: null
    },
    "AD02": {
        nom: "Boomerang", desc: "Une arme exotique qui revient à l'envoyeur. Normalement.",
        type: "arme_distance", rarete: "4", poids: 1.0, prix: 70,
        equipable: "main_droite", stackable: false, degats: "1-8", armure: 0, vitesse: 12, portee: 10,
        stats: {}, prerequis: { DX: 7 }, alignement: 0, nbUsages: null
    },

    // ---------------- ARMES À FEU (AF) ----------------
    "AF01": {
        nom: "Revolver de qualité", desc: "Le barillet tourne avec une précision mortelle.",
        type: "arme_feu", rarete: "6", poids: 1.8, prix: 350,
        equipable: "main_droite", stackable: false, degats: "5-15", armure: 0, vitesse: 15, portee: 12,
        stats: {}, prerequis: { DX: 7 }, alignement: -20, nbUsages: null
    },
	"AF02": {
        nom: "Revolver rouillé", desc: "Le barillet a du mal à tourner, masi ça era l'affaire",
        type: "arme_feu", rarete: "3", poids: 1.8, prix: 220,
        equipable: "main_droite", stackable: false, degats: "5-15", armure: 0, vitesse: 15, portee: 12,
        stats: {align:-20}, prerequis: { DX: 7 },alignement: -20 , nbUsages: null
    },

    // ---------------- ARMURES & VÊTEMENTS (DEF) ----------------
    "DEF01": {
        nom: "Vêtements en tissu", desc: "Habits de citadin. Élégants mais sans protection.",
        type: "armure", rarete: "2", poids: 1.0, prix: 100,
        equipable: "torse", stackable: false, degats: "0", armure: 1, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, alignement: 0, nbUsages: null
    },
    "DEF02": {
        nom: "Vêtements barbares", desc: "Peaux de bêtes épaisses cousues grossièrement.",
        type: "armure", rarete: "4", poids: 4.0, prix: 160,
        equipable: "torse", stackable: false, degats: "0", armure: 4, vitesse: 0, portee: 0,
        stats: { resPhys: 5 }, prerequis: { FO: 8 }, alignement: 0, nbUsages: null
    },
    "DEF03": {
        nom: "Cotte de mailles elfique", desc: "Un maillage incroyablement léger qui brille d'un éclat bleuté.",
        type: "armure", rarete: "8", poids: 3.5, prix: 1050,
        equipable: "torse", stackable: false, degats: "0", armure: 12, vitesse: 0, portee: 0,
        stats: { resMagie: 15, resPhys: 10 }, prerequis: { DX: 8 }, alignement: 40, nbUsages: null
    },
    "DEF04": {
        nom: "Robe simple", desc: "Une robe ample et confortable, prisée par les mages débutants.",
        type: "armure", rarete: "1", poids: 1.0, prix: 100,
        equipable: "torse", stackable: false, degats: "0", armure: 1, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, alignement: 0, nbUsages: null
    },
    "DEF05": {
        nom: "Veste en tissu", desc: "Une veste épaisse d'ouvrier.",
        type: "armure", rarete: "1", poids: 1.2, prix: 100,
        equipable: "torse", stackable: false, degats: "0", armure: 2, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, alignement: 0, nbUsages: null
    },
    "DEF06": {
        nom: "Bottes usagées", desc: "De vieilles bottes en cuir avec des trous dans les semelles.",
        type: "armure", rarete: "1", poids: 1.0, prix: 25,
        equipable: "bottes", stackable: false, degats: "0", armure: 1, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, alignement: 0, nbUsages: null
    },
    "DEF07": {
        nom: "Vieux manteau", desc: "Un long manteau élimé qui protège un peu du vent.",
        type: "armure", rarete: "2", poids: 2.0, prix: 50,
        equipable: "torse", stackable: false, degats: "0", armure: 2, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, alignement: 0, nbUsages: null
    },
    "DEF08": {
        nom: "Grand bouclier en bois", desc: "Massif et lourd, offre une excellente protection frontale.",
        type: "armure", rarete: "5", poids: 6.0, prix: 150,
        equipable: "main_gauche", stackable: false, degats: "0", armure: 8, vitesse: -2, portee: 0,
        stats: { resPhys: 10 }, prerequis: { FO: 10 }, alignement: 0, nbUsages: null
    },
    "DEF09": {
        nom: "Uniforme de soldat", desc: "Tenue réglementaire des gardes de Tarente.",
        type: "armure", rarete: "5", poids: 5.0, prix: 150,
        equipable: "torse", stackable: false, degats: "0", armure: 10, vitesse: 0, portee: 0,
        stats: { resPhys: 5 }, prerequis: { FO: 8 }, alignement: -5, nbUsages: null
    },
    "DEF10": {
        nom: "Robe élégante", desc: "Faite d'une soie fine. Très prisée dans les hautes sphères.",
        type: "armure", rarete: "6", poids: 1.0, prix: 200,
        equipable: "torse", stackable: false, degats: "0", armure: 2, vitesse: 0, portee: 0,
        stats: { resMagie: 5 }, prerequis: {}, alignement: 10, nbUsages: null
    },
    "DEF11": {
        nom: "Casque de fer", desc: "Une protection crânienne simple mais efficace.",
        type: "armure", rarete: "4", poids: 2.5, prix: 150,
        equipable: "tete", stackable: false, degats: "0", armure: 5, vitesse: 0, portee: 0,
        stats: {}, prerequis: { FO: 7 }, alignement: 0, nbUsages: null
    },




    // ---------------- MUNITIONS (MUN) ----------------
    "MUN01": {
        nom: "Balles de pistolet", desc: "Munitions classiques (poudre et plomb).",
        type: "munition", rarete: "2", poids: 0.01, prix: 1,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, alignement: -2, nbUsages: null
    },
    "MUN02": {
        nom: "Flèche", desc: "Flèche empennée basique.",
        type: "munition", rarete: "2", poids: 0.05, prix: 1,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, alignement: 0, nbUsages: null
    },

    // ---------------- CONSOMMABLES & EXPLOSIFS (CONS) ----------------
    "CONS01": {
        nom: "Cocktail Molotov", desc: "Bouteille inflammable. Explose à l'impact.",
        type: "consommable", rarete: "6", poids: 0.5, prix: 100,
        equipable: "main_droite", stackable: true, degats: "4-16", armure: 0, vitesse: 8, portee: 8,
        stats: {}, prerequis: { DX: 6 }, alignement: -15, nbUsages: 1 // Disparaît après le lancer
    },
    "CONS02": {
        nom: "Dynamite", desc: "Bâton explosif puissant. Ne restez pas à côté.",
        type: "consommable", rarete: "7", poids: 1.0, prix: 150,
        equipable: "main_droite", stackable: true, degats: "10-30", armure: 0, vitesse: 5, portee: 6,
        stats: {}, prerequis: {}, alignement: -25, nbUsages: 1
    },
    "CONS03": {
        nom: "Potion de soin", desc: "Un liquide rouge effervescent qui referme les plaies.",
        type: "consommable", rarete: "3", poids: 0.5, prix: 50,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinPV: 20 }, prerequis: {}, alignement: 10, nbUsages: 1
    },
    "CONS04": {
        nom: "Potion d'énergie", desc: "Restaure la fatigue accumulée. Goût de menthe forte.",
        type: "consommable", rarete: "3", poids: 0.5, prix: 50,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinFT: 20 }, prerequis: {}, alignement: 10, nbUsages: 1
    },





    // ---------------- OBJETS DE QUÊTE / UNIQUES (XXX) ----------------
   "XXX01": {
        nom: "Chevalière 'G.B.' ", desc: "une bague données par un vieux gnome avant de mourir.",
        type: "divers", rarete: "10", poids: 0.05, prix: 5,
        equipable: "anneau", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {  }, prerequis: {}, alignement: 0, nbUsages: null
    }, // <-- IL MANQUAIT CETTE VIRGULE
    "XXX02": {
        nom: "Appareil photo ", desc: "un vieil appareil trouvé sur le lieux du crash.",
        type: "divers", rarete: "10", poids: 0.1, prix: 5,
        equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {  }, prerequis: {}, alignement: 0, nbUsages: null
    },
	"XXX03": {
        nom: "Lettre non envoyée", 
        desc: "Un pli scellé à la cire, adressé à une personne à Caladon. Elle semble contenir des aveux de dernière minute.",
        type: "objet_quete", rarete: "10", poids: 0.05, prix: 0,
        equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, alignement: 0, nbUsages: null
    },
    "XXX04": {
        nom: "Relique ancestrale", 
        desc: "Un médaillon en argent terni avec la photo d'uen femme dedans.",
        type: "objet_quete", rarete: "10", poids: 0.2, prix: 50,
        equipable: "cou", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { resMagie: 5 }, prerequis: {}, alignement: 20, nbUsages: null
    },
	
	
	

    // Outils & Divers
    "DIV01": {
        nom: "Outil de crochetage", desc: "Un ensemble de rossignols pour les serrures récalcitrantes.",
        type: "divers", rarete: "5", poids: 0.2, prix: 100,
        equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { }, prerequis: { DX: 8 }, alignement: -10, nbUsages: null
    }
	
	
}; // <-- FERMETURE DU DICO