// ================= DICTIONNAIRE DES OBJETS =================
// Préfixes : AM (Mêlée), AD (Distance), AF (Feu), DEF (Armure), 
// CONS (Consommable), MUN (Munition), COMP (Composant), DIV (Divers), XXX (Quête/Unique)

const itemsData = {
	
	
	
	
	
	"OR_PIECES": {
        nom: "Pièces d'or", desc: "La monnaie de base, toujours utile.",
        type: "argent", rarete: "1", poids: 0.0, prix: 1,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: false, nbUsages: null
    },
	
	
	
	
	
	
	
    // ---------------- ARMES DE MÊLÉE (AM) ----------------
    "AM01": {
        nom: "Hache rouillée", desc: "Une hache usée par le temps.",
        type: "arme_melee", rarete: "2", poids: 3.0, prix: 30,
        equipable: "main_droite", stackable: false, degats: "1-8", armure: 0, vitesse: 10, portee: 1,
        stats: {}, prerequis: { FO: 7 }, lootable: true, nbUsages: null
    },
    "AM02": {
        nom: "Marteau de qualité", desc: "Un marteau de forgeron parfaitement équilibré.",
        type: "arme_melee", rarete: "6", poids: 4.5, prix: 150,
        equipable: "main_droite", stackable: false, degats: "2-12", armure: 0, vitesse: 11, portee: 1,
        stats: { align: -5 }, prerequis: { FO: 9 }, lootable: true, nbUsages: null
    },
    "AM03": {
        nom: "Épée enchantée", desc: "Une lame luisante qui palpite d'une énergie arcanique.",
        type: "arme_melee", rarete: "8", poids: 2.0, prix: 600,
        equipable: "main_droite", stackable: false, degats: "4-14", armure: 0, vitesse: 14, portee: 1,
        stats: { resMagie: 10, FT: 2, align: 10 }, prerequis: { FO: 6 }, lootable: true, nbUsages: null
    },
    "AM04": {
        nom: "Dague simple", desc: "Une petite lame facile à dissimuler.",
        type: "arme_melee", rarete: "3", poids: 0.5, prix: 30,
        equipable: "main_droite", stackable: false, degats: "1-4", armure: 0, vitesse: 16, portee: 1,
        stats: {}, prerequis: {}, lootable: true, nbUsages: null
    },
    "AM05": {
        nom: "Bâton", desc: "Un long bâton en bois robuste, souvent utilisé par les voyageurs.",
        type: "arme_melee", rarete: "2", poids: 1.5, prix: 20,
        equipable: "deux_mains", stackable: false, degats: "1-6", armure: 0, vitesse: 12, portee: 1,
        stats: { FT: 2 }, prerequis: {}, lootable: true, nbUsages: null
    },
    "AM06": {
        nom: "Épée simple", desc: "Une lame droite standard en fer.",
        type: "arme_melee", rarete: "4", poids: 2.5, prix: 100,
        equipable: "main_droite", stackable: false, degats: "2-8", armure: 0, vitesse: 12, portee: 1,
        stats: {}, prerequis: { FO: 6 }, lootable: true, nbUsages: null
    },
    "AM07": {
        nom: "Couteau rouillé", desc: "Plus dangereux pour le tétanos que pour la blessure.",
        type: "arme_melee", rarete: "1", poids: 0.5, prix: 10,
        equipable: "main_droite", stackable: false, degats: "1-3", armure: 0, vitesse: 14, portee: 1,
        stats: {}, prerequis: {}, lootable: true, nbUsages: null
    },
    "AM08": {
        nom: "Épée rouillée", desc: "Une lame qui a connu des jours meilleurs.",
        type: "arme_melee", rarete: "1", poids: 2.5, prix: 8,
        equipable: "main_droite", stackable: false, degats: "1-6", armure: 0, vitesse: 10, portee: 1,
        stats: {}, prerequis: { FO: 6 }, lootable: true, nbUsages: null
    },
    "AM09": {
        nom: "Vieille rapière", desc: "Fine et élégante, malgré les taches de rouille.",
        type: "arme_melee", rarete: "4", poids: 1.5, prix: 45,
        equipable: "main_droite", stackable: false, degats: "2-9", armure: 0, vitesse: 15, portee: 1,
        stats: {}, prerequis: { DX: 9 }, lootable: true, nbUsages: null
    },
    "AM10": {
        nom: "Hache", desc: "Une hache de bûcheron bien affûtée.",
        type: "arme_melee", rarete: "4", poids: 3.5, prix: 50,
        equipable: "main_droite", stackable: false, degats: "3-10", armure: 0, vitesse: 9, portee: 1,
        stats: {}, prerequis: { FO: 8 }, lootable: true, nbUsages: null
    },
    // --- Mêlée (Craft) ---
    "AM11": {
        nom: "Épée équilibrée", desc: "Arme rapide et précise utilisant les propriétés du pur alliage.",
        type: "arme_melee", rarete: "7", poids: 1.5, prix: 450,
        equipable: "main_droite", stackable: false, degats: "5-15", armure: 0, vitesse: 18, portee: 1,
        stats: { align: -10 }, prerequis: { DX: 9 }, lootable: false, nbUsages: null
    },
    "AM12": {
        nom: "Hache ultralégère", desc: "Arme mortelle en minerai nain pesant moitié moins.",
        type: "arme_melee", rarete: "7", poids: 1.8, prix: 500,
        equipable: "main_droite", stackable: false, degats: "6-18", armure: 0, vitesse: 14, portee: 1,
        stats: { align: -15 }, prerequis: { FO: 7 }, lootable: false, nbUsages: null
    },
    "AM13": {
        nom: "Bâton électrique", desc: "Bâton avec condensateur libérant un choc à l'impact.",
        type: "arme_melee", rarete: "6", poids: 2.0, prix: 350,
        equipable: "deux_mains", stackable: false, degats: "2-10", armure: 0, vitesse: 13, portee: 1,
        stats: { resElec: 5, align: -10 }, prerequis: { DX: 8 }, lootable: false, nbUsages: null
    },
    "AM14": {
        nom: "Bâton Tesla", desc: "Arme avancée projetant des rayons d'énergie paralysants.",
        type: "arme_melee", rarete: "9", poids: 2.5, prix: 1200,
        equipable: "deux_mains", stackable: false, degats: "10-25", armure: 0, vitesse: 15, portee: 3,
        stats: { align: -30 }, prerequis: { DX: 10 }, lootable: false, nbUsages: null
    },
	
	
	
	
	
	    "AM15": { nom: "Barre de fer", desc: "Tige métallique standard.", type: "arme_melee", rarete: "1", poids: 1.5, prix: 10, equipable: "main_droite", stackable: false, degats: "1-2", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },

	
	
	
	
	
	

    // ---------------- ARMES À DISTANCE (AD) ----------------
    "AD01": {
        nom: "Arc court", desc: "Un arc simple en bois souple. Nécessite des flèches.",
        type: "arme_distance", rarete: "3", poids: 1.5, prix: 100,
        equipable: "deux_mains", stackable: false, degats: "1-6", armure: 0, vitesse: 10, portee: 15,
        stats: {}, prerequis: { DX: 8 }, lootable: true, nbUsages: null
    },
    "AD02": {
        nom: "Boomerang", desc: "Une arme exotique qui revient à l'envoyeur. Normalement.",
        type: "arme_distance", rarete: "4", poids: 1.0, prix: 70,
        equipable: "main_droite", stackable: false, degats: "1-8", armure: 0, vitesse: 12, portee: 10,
        stats: {}, prerequis: { DX: 7 }, lootable: true, nbUsages: null
    },

    // ---------------- ARMES À FEU (AF) ----------------
    "AF01": {
        nom: "Revolver de qualité", desc: "Le barillet tourne avec une précision mortelle.",
        type: "arme_feu", rarete: "6", poids: 1.8, prix: 350,
        equipable: "main_droite", stackable: false, degats: "5-15", armure: 0, vitesse: 15, portee: 12,
        stats: { align: -20 }, prerequis: { DX: 7 }, lootable: true, nbUsages: null
    },
    "AF02": {
        nom: "Revolver rouillé", desc: "Le barillet a du mal à tourner, mais ça fera l'affaire.",
        type: "arme_feu", rarete: "3", poids: 1.8, prix: 220,
        equipable: "main_droite", stackable: false, degats: "4-12", armure: 0, vitesse: 12, portee: 12,
        stats: { align: -20 }, prerequis: { DX: 7 }, lootable: true, nbUsages: null
    },
    // --- Armes à Feu (Craft) ---
    "AF03": {
        nom: "Pistolet à silex", desc: "Arme à feu rudimentaire fabriquée avec des pièces de récupération.",
        type: "arme_feu", rarete: "3", poids: 2.0, prix: 150,
        equipable: "main_droite", stackable: false, degats: "3-10", armure: 0, vitesse: 8, portee: 10,
        stats: { align: -10 }, prerequis: { DX: 6 }, lootable: false, nbUsages: null
    },
    "AF04": {
        nom: "Revolver de choix", desc: "Pistolet bien équilibré destiné aux tireurs sérieux.",
        type: "arme_feu", rarete: "7", poids: 1.6, prix: 450,
        equipable: "main_droite", stackable: false, degats: "6-18", armure: 0, vitesse: 18, portee: 15,
        stats: { align: -25 }, prerequis: { DX: 8 }, lootable: false, nbUsages: null
    },
    "AF05": {
        nom: "Fusil à répétition", desc: "Fusil permettant de tirer plusieurs coups rapidement.",
        type: "arme_feu", rarete: "8", poids: 3.5, prix: 800,
        equipable: "deux_mains", stackable: false, degats: "8-20", armure: 0, vitesse: 18, portee: 20,
        stats: { align: -35 }, prerequis: { DX: 9 }, lootable: false, nbUsages: null
    },
    "AF06": {
        nom: "Revolver silencieux", desc: "Arme à feu modifiée pour réduire le bruit de la détonation.",
        type: "arme_feu", rarete: "7", poids: 1.7, prix: 600,
        equipable: "main_droite", stackable: false, degats: "5-15", armure: 0, vitesse: 16, portee: 12,
        stats: { align: -25 }, prerequis: { DX: 8 }, lootable: false, nbUsages: null
    },
    "AF07": {
        nom: "Fusil à lunette", desc: "Fusil de précision équipé d'un système de visée optique.",
        type: "arme_feu", rarete: "8", poids: 4.0, prix: 950,
        equipable: "deux_mains", stackable: false, degats: "10-25", armure: 0, vitesse: 8, portee: 30,
        stats: { align: -35 }, prerequis: { DX: 10 }, lootable: false, nbUsages: null
    },
    "AF08": {
        nom: "Canon portable", desc: "Arme lourde infligeant des dégâts massifs.",
        type: "arme_feu", rarete: "9", poids: 8.0, prix: 1500,
        equipable: "deux_mains", stackable: false, degats: "20-40", armure: 0, vitesse: 5, portee: 15,
        stats: { align: -40 }, prerequis: { FO: 12, DX: 8 }, lootable: false, nbUsages: null
    },
    "AF09": {
        nom: "Fusil éléphant", desc: "Arme de très gros calibre pour les cibles les plus résistantes.",
        type: "arme_feu", rarete: "10", poids: 5.5, prix: 2200,
        equipable: "deux_mains", stackable: false, degats: "25-50", armure: 0, vitesse: 6, portee: 25,
        stats: { align: -50 }, prerequis: { FO: 10, DX: 10 }, lootable: false, nbUsages: null
    },




    "AF10": { nom: "Fusil de chasse", desc: "Arme de base.", type: "arme_feu", rarete: "4", poids: 3.0, prix: 80, equipable: "deux_mains", stackable: false, degats: "5-12", armure: 0, vitesse: 5, portee: 8, stats: {}, prerequis: {}, lootable: true, nbUsages: null },

    "AF11": { nom: "Fusil précis ", desc: "Fusil long canon.", type: "arme_feu", rarete: "6", poids: 3.5, prix: 150, equipable: "deux_mains", stackable: false, degats: "8-16", armure: 0, vitesse: 6, portee: 20, stats: {}, prerequis: {}, lootable: true, nbUsages: null },

    "AF12": { nom: "Fusil Clarington", desc: "Fusil de haute qualité.", type: "arme_feu", rarete: "7", poids: 4.0, prix: 300, equipable: "deux_mains", stackable: false, degats: "10-15", armure: 6, vitesse: 15, portee: 15, stats: {}, prerequis: {}, lootable: true, nbUsages: null },

    "AF13": { nom: "Pistolet chic", desc: "Arme de noble.", type: "arme_feu", rarete: "5", poids: 1.5, prix: 200, equipable: "aucun", stackable: false, degats: "0", armure: 4-12, vitesse: 5, portee: 12, stats: {}, prerequis: {}, lootable: true, nbUsages: null },








    // ---------------- ARMURES & VÊTEMENTS (DEF) ----------------
    "DEF01": {
        nom: "Vêtements en tissu", desc: "Habits de citadin. Élégants mais sans protection.",
        type: "armure", rarete: "2", poids: 1.0, prix: 100,
        equipable: "torse", stackable: false, degats: "0", armure: 1, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: true, nbUsages: null
    },
    "DEF02": {
        nom: "Vêtements barbares", desc: "Peaux de bêtes épaisses cousues grossièrement.",
        type: "armure", rarete: "4", poids: 4.0, prix: 160,
        equipable: "torse", stackable: false, degats: "0", armure: 4, vitesse: 0, portee: 0,
        stats: { resPhys: 5 }, prerequis: { FO: 8 }, lootable: true, nbUsages: null
    },
    "DEF03": {
        nom: "Cotte de mailles elfique", desc: "Un maillage incroyablement léger qui brille d'un éclat bleuté.",
        type: "armure", rarete: "8", poids: 3.5, prix: 1050,
        equipable: "torse", stackable: false, degats: "0", armure: 12, vitesse: 0, portee: 0,
        stats: { resMagie: 15, resPhys: 10, align: 40 }, prerequis: { DX: 8 }, lootable: true, nbUsages: null
    },
    "DEF04": {
        nom: "Robe simple", desc: "Une robe ample et confortable, prisée par les mages débutants.",
        type: "armure", rarete: "1", poids: 1.0, prix: 100,
        equipable: "torse", stackable: false, degats: "0", armure: 1, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: true, nbUsages: null
    },
    "DEF05": {
        nom: "Veste en tissu", desc: "Une veste épaisse d'ouvrier.",
        type: "armure", rarete: "1", poids: 1.2, prix: 100,
        equipable: "torse", stackable: false, degats: "0", armure: 2, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: true, nbUsages: null
    },
    "DEF06": {
        nom: "Bottes usagées", desc: "De vieilles bottes en cuir avec des trous dans les semelles.",
        type: "armure", rarete: "1", poids: 1.0, prix: 25,
        equipable: "bottes", stackable: false, degats: "0", armure: 1, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: true, nbUsages: null
    },
    "DEF07": {
        nom: "Vieux manteau", desc: "Un long manteau élimé qui protège un peu du vent.",
        type: "armure", rarete: "2", poids: 2.0, prix: 50,
        equipable: "torse", stackable: false, degats: "0", armure: 2, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: true, nbUsages: null
    },
    "DEF08": {
        nom: "Grand bouclier en bois", desc: "Massif et lourd, offre une excellente protection frontale.",
        type: "armure", rarete: "5", poids: 6.0, prix: 150,
        equipable: "main_gauche", stackable: false, degats: "0", armure: 8, vitesse: -2, portee: 0,
        stats: { resPhys: 10 }, prerequis: { FO: 10 }, lootable: true, nbUsages: null
    },
    "DEF09": {
        nom: "Uniforme de soldat", desc: "Tenue réglementaire des gardes de Tarente.",
        type: "armure", rarete: "5", poids: 5.0, prix: 150,
        equipable: "torse", stackable: false, degats: "0", armure: 10, vitesse: 0, portee: 0,
        stats: { resPhys: 5, align: -5 }, prerequis: { FO: 8 }, lootable: true, nbUsages: null
    },
    "DEF10": {
        nom: "Robe élégante", desc: "Faite d'une soie fine. Très prisée dans les hautes sphères.",
        type: "armure", rarete: "6", poids: 1.0, prix: 200,
        equipable: "torse", stackable: false, degats: "0", armure: 2, vitesse: 0, portee: 0,
        stats: { resMagie: 5, align: 10 }, prerequis: {}, lootable: true, nbUsages: null
    },
    "DEF11": {
        nom: "Casque de fer", desc: "Une protection crânienne simple mais efficace.",
        type: "armure", rarete: "4", poids: 2.5, prix: 150,
        equipable: "tete", stackable: false, degats: "0", armure: 5, vitesse: 0, portee: 0,
        stats: {}, prerequis: { FO: 7 }, lootable: true, nbUsages: null
    },
    // --- Armures (Craft) ---
    "DEF12": {
        nom: "Gantelets de nain", desc: "Gants métalliques boostant la puissance au corps à corps.",
        type: "armure", rarete: "6", poids: 1.5, prix: 350,
        equipable: "gants", stackable: false, degats: "0", armure: 4, vitesse: 0, portee: 0,
        stats: { align: -15 }, prerequis: { FO: 8 }, lootable: false, nbUsages: null
    },
    "DEF13": {
        nom: "Heaume de vision", desc: "Casque de protection améliorant la visibilité.",
        type: "armure", rarete: "6", poids: 2.0, prix: 400,
        equipable: "tete", stackable: false, degats: "0", armure: 6, vitesse: 0, portee: 0,
        stats: { align: -10 }, prerequis: { FO: 7 }, lootable: false, nbUsages: null
    },
    "DEF14": {
        nom: "Cotte de mailles légère", desc: "Armure de mailles offrant une protection agile.",
        type: "armure", rarete: "7", poids: 5.0, prix: 800,
        equipable: "torse", stackable: false, degats: "0", armure: 15, vitesse: 0, portee: 0,
        stats: { resPhys: 15, align: -25 }, prerequis: { FO: 9 }, lootable: false, nbUsages: null
    },
    "DEF15": {
        nom: "Cuirasse d'élite", desc: "L'armure de plaques technologique la plus aboutie.",
        type: "armure", rarete: "9", poids: 8.0, prix: 2000,
        equipable: "torse", stackable: false, degats: "0", armure: 25, vitesse: -1, portee: 0,
        stats: { resPhys: 30, resFeu: 15, align: -40 }, prerequis: { FO: 12 }, lootable: false, nbUsages: null
    },
    "DEF16": {
        nom: "Chapeau d'inversion", desc: "Haut-de-forme protégeant contre les balles et flèches par magnétisme.",
        type: "armure", rarete: "7", poids: 1.0, prix: 750,
        equipable: "tete", stackable: false, degats: "0", armure: 2, vitesse: 0, portee: 0,
        stats: { resPhys: 20, align: -20 }, prerequis: {}, lootable: false, nbUsages: null
    },
    "DEF17": {
        nom: "Veste de soins", desc: "Veste utilisant l'énergie bio-électrique pour régénérer le corps.",
        type: "armure", rarete: "8", poids: 3.0, prix: 1100,
        equipable: "torse", stackable: false, degats: "0", armure: 8, vitesse: 0, portee: 0,
        stats: { align: -25 }, prerequis: {}, lootable: false, nbUsages: null // À coder : regen passive
    },
	
	
	
	    "DEF18": { nom: "Gants en tissu", desc: "De simples gants.", type: "armure", rarete: "1", poids: 0.2, prix: 5, equipable: "gants", stackable: false, degats: "0", armure: 1, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
	
	    "DEF19": { nom: "Heaume de qualité", desc: "Casque simple de soldat.", type: "armure", rarete: "4", poids: 2.0, prix: 60, equipable: "tete", stackable: false, degats: "0", armure: 4, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
	
	    "DEF20": { nom: "Armure de cuir", desc: "Protection de base pour rôdeur.", type: "armure", rarete: "3", poids: 4.0, prix: 80, equipable: "torse", stackable: false, degats: "0", armure: 3, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
	
	    "DEF21": { nom: "Haut-de-forme", desc: "Chapeau de dandy.", type: "armure", rarete: "2", poids: 0.3, prix: 40, equipable: "tete", stackable: false, degats: "0", armure: 1, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
	
	
	
	    "DEF22": {
        nom: "Méca-lorgnon", desc: "Lunettes augmentant la perception de jour comme de nuit.",
        type: "armure", rarete: "8", poids: 0.2, prix: 500,
        equipable: "tete", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -30 }, prerequis: {}, lootable: false, nbUsages: null // Bonus perception
    },
	
	
	    "DEF23": { nom: "Paire de lunettes", desc: "Verres correcteurs.", type: "armure", rarete: "3", poids: 0.1, prix: 25, equipable: "tete", stackable: false, degats: "0", armure: 1, vitesse: 0, portee: 0, stats: {bonusComp: { marchandage : 1}}, prerequis: {}, lootable: true, nbUsages: null },

	
	
	
	    "DEF24": {
        nom: "Lampe électrique", desc: "Lanterne à filament offrant un éclairage propre et constant.",
        type: "armure", rarete: "4", poids: 1.0, prix: 100,
        equipable: "main_gauche", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -10 }, prerequis: {}, lootable: false, nbUsages: null
    },
	
	
	    "DEF25": { nom: "lanterne", desc: "Lampe à huile classique.", type: "armure", rarete: "2", poids: 1.0, prix: 15, equipable: "main_gauche", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },

	
	
	
	
	
	
	
	

    // ---------------- BIJOUX & ACCESSOIRES (BIJ) ----------------
    "BIJ01": {
        nom: "Anneau électroactif", desc: "Anneau de cuivre boostant la puissance et les réflexes.",
        type: "divers", rarete: "6", poids: 0.1, prix: 500,
        equipable: "anneau", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -15 }, prerequis: {}, lootable: false, nbUsages: null // Bonus à coder
    },
	    "BIJ02": { nom: "Anneau de cuivre", desc: "Bijou brillant.", type: "divers", rarete: "2", poids: 0.1, prix: 45, equipable: "anneau", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
	    "BIJ03": { nom: "Anneau de argent", desc: "Bijou brillant.", type: "divers", rarete: "4", poids: 0.1, prix: 145, equipable: "anneau", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
	    "BIJ04": { nom: "Anneau en or", desc: "Bijou brillant.", type: "divers", rarete: "6", poids: 0.1, prix: 345, equipable: "anneau", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },

    
    // ---------------- MUNITIONS (MUN) ----------------
    "MUN01": {
        nom: "Balles de pistolet", desc: "Munitions classiques (poudre et plomb).",
        type: "munition", rarete: "2", poids: 0.01, prix: 1,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -2 }, prerequis: {}, lootable: true, nbUsages: null
    },
    "MUN02": {
        nom: "Flèche", desc: "Flèche empennée basique.",
        type: "munition", rarete: "2", poids: 0.05, prix: 1,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: true, nbUsages: null
    },
    "MUN03": { // Craft Explosifs
        nom: "Balles", desc: "Munitions produites à partir de salpêtre et de charbon.",
        type: "munition", rarete: "2", poids: 0.01, prix: 1,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -2 }, prerequis: {}, lootable: false, nbUsages: null
    },

    // ---------------- CONSOMMABLES & EXPLOSIFS (CONS) ----------------
    "CONS01": {
        nom: "Cocktail Molotov", desc: "Bouteille inflammable. Explose à l'impact.",
        type: "consommable", rarete: "6", poids: 0.5, prix: 100,
        equipable: "main_droite", stackable: true, degats: "4-16", armure: 0, vitesse: 8, portee: 8,
        stats: { align: -15 }, prerequis: { DX: 6 }, lootable: true, nbUsages: 1
    },
    "CONS02": {
        nom: "Dynamite", desc: "Bâton explosif puissant. Ne restez pas à côté.",
        type: "consommable", rarete: "7", poids: 1.0, prix: 150,
        equipable: "main_droite", stackable: true, degats: "10-30", armure: 0, vitesse: 5, portee: 6,
        stats: { align: -25 }, prerequis: {}, lootable: true, nbUsages: 1
    },
    "CONS03": {
        nom: "Potion de soin", desc: "Un liquide rouge effervescent qui referme les plaies.",
        type: "consommable", rarete: "3", poids: 0.5, prix: 50,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinPV: 20, align: 10 }, prerequis: {}, lootable: true, nbUsages: 1
    },
    "CONS04": {
        nom: "Potion d'énergie", desc: "Restaure la fatigue accumulée. Goût de menthe forte.",
        type: "consommable", rarete: "3", poids: 0.5, prix: 50,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinFT: 20, align: 10 }, prerequis: {}, lootable: true, nbUsages: 1
    },
    // --- Botanique & Thérapeutique (Craft) ---
    "CONS05": {
        nom: "Elixir de soins légers", desc: "Médicament de base pour soigner les blessures légères.",
        type: "consommable", rarete: "3", poids: 0.2, prix: 60,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinPV: 30, align: -5 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS06": {
        nom: "Stimulant", desc: "Produit augmentant temporairement les capacités physiques.",
        type: "consommable", rarete: "5", poids: 0.2, prix: 120,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -10 }, prerequis: {}, lootable: false, nbUsages: 1 // Bonus à coder
    },
    "CONS07": {
        nom: "Antidote", desc: "Substance permettant de neutraliser les effets du poison.",
        type: "consommable", rarete: "4", poids: 0.2, prix: 80,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -5 }, prerequis: {}, lootable: false, nbUsages: 1 // Soin poison à coder
    },
    "CONS08": {
        nom: "Limiteur de fatigue", desc: "Préparation réduisant la perte de points de fatigue.",
        type: "consommable", rarete: "6", poids: 0.2, prix: 150,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinFT: 50, align: -10 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS09": {
        nom: "Accélérateur de guérison", desc: "Accélère la régénération naturelle des tissus.",
        type: "consommable", rarete: "7", poids: 0.2, prix: 200,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -15 }, prerequis: {}, lootable: false, nbUsages: 1 // Regen à coder
    },
    "CONS10": {
        nom: "Drogue merveilleuse", desc: "Elixir puissant aux propriétés curatives avancées.",
        type: "consommable", rarete: "8", poids: 0.2, prix: 300,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinPV: 80, align: -20 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS11": {
        nom: "Soin universel", desc: "Le remède technologique ultime pour tous les maux.",
        type: "consommable", rarete: "10", poids: 0.2, prix: 500,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinPV: 150, soinFT: 150, align: -30 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS12": {
        nom: "Elixir de persuasion", desc: "Améliore temporairement le charisme et l'élocution.",
        type: "consommable", rarete: "5", poids: 0.2, prix: 150,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -10 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS13": {
        nom: "Elixir de prouesse", desc: "Augmente la force physique de l'utilisateur.",
        type: "consommable", rarete: "6", poids: 0.2, prix: 180,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -15 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS14": {
        nom: "Liquide de perception", desc: "Affûte les sens et la vigilance du sujet.",
        type: "consommable", rarete: "6", poids: 0.2, prix: 180,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -15 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS15": {
        nom: "Fortifiant réflexes", desc: "Améliore la dextérité et la vitesse de réaction.",
        type: "consommable", rarete: "7", poids: 0.2, prix: 200,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -20 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS16": {
        nom: "Concentré de neurones", desc: "Augmente temporairement l'intelligence.",
        type: "consommable", rarete: "7", poids: 0.2, prix: 220,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -20 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS17": {
        nom: "Energisant", desc: "Redonne de la vigueur et de l'énergie au corps.",
        type: "consommable", rarete: "8", poids: 0.2, prix: 250,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinFT: 80, align: -25 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS18": {
        nom: "Revitalisant", desc: "Restaure l'ensemble des facultés physiques et mentales.",
        type: "consommable", rarete: "9", poids: 0.2, prix: 400,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinPV: 100, soinFT: 100, align: -30 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    // --- Explosifs & Chimie (Craft) ---
    "CONS19": {
        nom: "Poison virulent", desc: "Substance toxique pouvant être appliquée sur des armes.",
        type: "consommable", rarete: "5", poids: 0.2, prix: 150,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -15 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS20": {
        nom: "Carburant", desc: "Liquide inflammable utilisé pour divers engins technologiques.",
        type: "consommable", rarete: "4", poids: 1.0, prix: 50,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -10 }, prerequis: {}, lootable: false, nbUsages: null // Sert souvent de composant
    },
    "CONS21": {
        nom: "Hallucinite", desc: "Produit chimique provoquant des hallucinations chez la victime.",
        type: "consommable", rarete: "6", poids: 0.2, prix: 180,
        equipable: "main_droite", stackable: true, degats: "0", armure: 0, vitesse: 10, portee: 5,
        stats: { align: -20 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS22": {
        nom: "Acide corrosif", desc: "Composé qui ronge immédiatement les surfaces et armures.",
        type: "consommable", rarete: "7", poids: 0.5, prix: 250,
        equipable: "main_droite", stackable: true, degats: "5-25", armure: 0, vitesse: 8, portee: 6,
        stats: { align: -25 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS23": {
        nom: "Senteur animale", desc: "Mélange permettant de circuler parmi les bêtes sans être attaqué.",
        type: "consommable", rarete: "6", poids: 0.2, prix: 200,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -15 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS24": {
        nom: "Paralysant", desc: "Liquide rendant l'ennemi impuissant temporairement.",
        type: "consommable", rarete: "8", poids: 0.2, prix: 350,
        equipable: "main_droite", stackable: true, degats: "0", armure: 0, vitesse: 10, portee: 5,
        stats: { align: -30 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS25": {
        nom: "Grenade aveuglante", desc: "Gadget au magnésium pour désorienter les adversaires.",
        type: "consommable", rarete: "5", poids: 0.5, prix: 150,
        equipable: "main_droite", stackable: true, degats: "0", armure: 0, vitesse: 12, portee: 8,
        stats: { align: -15 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS26": {
        nom: "Grenade fumigène", desc: "Mixture générant un nuage de fumée pour couvrir une fuite.",
        type: "consommable", rarete: "5", poids: 0.5, prix: 150,
        equipable: "main_droite", stackable: true, degats: "0", armure: 0, vitesse: 12, portee: 8,
        stats: { align: -15 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS27": {
        nom: "Grenade étourdissante", desc: "Explosion de salpêtre étourdissant temporairement les ennemis.",
        type: "consommable", rarete: "6", poids: 0.5, prix: 200,
        equipable: "main_droite", stackable: true, degats: "2-8", armure: 0, vitesse: 12, portee: 8,
        stats: { align: -20 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS28": {
        nom: "Grenade offensive", desc: "Arme de destruction puissante utilisant du TNT et de la poudre.",
        type: "consommable", rarete: "7", poids: 0.8, prix: 300,
        equipable: "main_droite", stackable: true, degats: "15-35", armure: 0, vitesse: 10, portee: 8,
        stats: { align: -25 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS29": {
        nom: "Ecran de feu", desc: "Mixture inflammable créant un mur de flammes défensif.",
        type: "consommable", rarete: "8", poids: 1.0, prix: 400,
        equipable: "main_droite", stackable: true, degats: "10-20", armure: 0, vitesse: 8, portee: 5,
        stats: { align: -30 }, prerequis: {}, lootable: false, nbUsages: 1
    },

    // ---------------- OBJETS DE QUÊTE / UNIQUES (XXX) ----------------
    "XXX01": {
        nom: "Chevalière 'G.B.'", desc: "Une bague donnée par un vieux gnome avant de mourir.",
        type: "divers", rarete: "10", poids: 0.05, prix: 5,
        equipable: "anneau", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: false, nbUsages: null
    },
    "XXX02": {
        nom: "Appareil photo", desc: "Un vieil appareil trouvé sur le lieu du crash.",
        type: "divers", rarete: "10", poids: 0.1, prix: 5,
        equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: false, nbUsages: null
    },
    "XXX03": {
        nom: "Lettre non envoyée", desc: "Un pli scellé à la cire, adressé à une personne à Caladon. Elle semble contenir des aveux de dernière minute.",
        type: "objet_quete", rarete: "10", poids: 0.05, prix: 0,
        equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: false, nbUsages: null
    },
    "XXX04": {
        nom: "Relique ancestrale", desc: "Un médaillon en argent terni avec la photo d'une femme dedans.",
        type: "objet_quete", rarete: "10", poids: 0.2, prix: 50,
        equipable: "cou", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {  }, prerequis: {}, lootable: false, nbUsages: null
    },

    // ---------------- OUTILS & DIVERS (DIV) ----------------
    "DIV01": {
        nom: "Outil de crochetage", desc: "Un ensemble de rossignols pour les serrures récalcitrantes.",
        type: "divers", rarete: "5", poids: 0.2, prix: 100,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -10 }, prerequis: { DX: 8 }, lootable: true, nbUsages: null
    },
    // --- Mécanique (Craft) ---
    "DIV02": {
        nom: "Piège à piques", desc: "Dispositif simple blessant quiconque marche dessus.",
        type: "divers", rarete: "4", poids: 2.0, prix: 150,
        equipable: "aucun", stackable: true, degats: "10-20", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -10 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "DIV03": {
        nom: "Passe-partout auto.", desc: "Outil facilitant grandement le crochetage des serrures.",
        type: "divers", rarete: "6", poids: 0.5, prix: 300,
        equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -20 }, prerequis: {}, lootable: false, nbUsages: null // Bonus crochetage à coder
    },
    "DIV04": {
        nom: "Déclencheur de piège", desc: "Boîtier à ressort pour activer les pièges à distance.",
        type: "divers", rarete: "5", poids: 0.5, prix: 200,
        equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -15 }, prerequis: {}, lootable: false, nbUsages: null
    },
    "DIV05": {
        nom: "Piège à ours", desc: "Pince métallique immobilisant et blessant la proie.",
        type: "divers", rarete: "6", poids: 3.0, prix: 250,
        equipable: "aucun", stackable: true, degats: "15-30", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -20 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "DIV06": {
        nom: "Leurre mécanique", desc: "Dispositif à ressort créant une diversion sonore.",
        type: "divers", rarete: "7", poids: 1.0, prix: 350,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -25 }, prerequis: {}, lootable: false, nbUsages: 1
    },

    "DIV08": {
        nom: "Méca-arachnide", desc: "Automate de combat hydraulique à vapeur avec griffes.",
        type: "divers", rarete: "10", poids: 15.0, prix: 1500,
        equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -50 }, prerequis: {}, lootable: false, nbUsages: null // Invocation à coder
    },
    // --- Électricité (Craft) ---

    "DIV10": {
        nom: "Spectromètre de flux", desc: "Appareil sensible détectant les perturbations magiques.",
        type: "divers", rarete: "7", poids: 1.5, prix: 600,
        equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -20 }, prerequis: {}, lootable: false, nbUsages: null
    },
    // --- Chimie (Craft) ---
    "DIV11": {
        nom: "Energie", desc: "Source énergétique portable (Batterie).",
        type: "divers", rarete: "4", poids: 1.0, prix: 80,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -10 }, prerequis: {}, lootable: false, nbUsages: null // Souvent composant
    },
    "DIV12": {
        nom: "Pelle", desc: "Parfait pour creuser des trous.",
        type: "divers", rarete: "4", poids: 10.0, prix: 100,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {  }, prerequis: {}, lootable: true, nbUsages: null // 
    },









    // ---------------- COMPOSANTS D'ARTISANAT (COMP) ----------------
    "COMP01": {
        nom: "Acier", desc: "Un bloc de métal industriel raffiné.",
        type: "composant", rarete: "3", poids: 2.0, prix: 20,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: true, nbUsages: null
    },
    "COMP02": {
        nom: "Minerai de fer", desc: "Un bloc de roche brute riche en fer.",
        type: "composant", rarete: "2", poids: 3.0, prix: 10,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: true, nbUsages: null
    },
    "COMP03": {
        nom: "Pur Alliage", desc: "Amalgame de fer et d'acier plus léger et résistant.",
        type: "composant", rarete: "5", poids: 1.5, prix: 100,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: false, nbUsages: null
    },
    "COMP04": {
        nom: "Garde d'épée", desc: "Une pièce d'armurerie vierge.",
        type: "composant", rarete: "3", poids: 0.5, prix: 15,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: true, nbUsages: null
    },
    "COMP05": {
        nom: "racine de ginka", desc: "Une racine amère aux propriétés médicinales.",
        type: "composant", rarete: "2", poids: 0.1, prix: 5,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: true, nbUsages: null
    },
    "COMP06": {
        nom: "tige de kadura", desc: "Une tige souple trouvée près des rivières.",
        type: "composant", rarete: "2", poids: 0.1, prix: 5,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: true, nbUsages: null
    },
    "COMP07": {
        nom: "Salpêtre", desc: "Poudre blanche au goût salé, très réactive.",
        type: "composant", rarete: "4", poids: 0.2, prix: 15,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: true, nbUsages: null
    },
    "COMP08": {
        nom: "Charbon", desc: "Morceau de bois calciné.",
        type: "composant", rarete: "1", poids: 0.5, prix: 2,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: true, nbUsages: null
    },
    "COMP09": { nom: "Manche de hache", desc: "Manche en bois robuste.", type: "composant", rarete: "2", poids: 1.0, prix: 8, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP10": { nom: "Minerai de nain", desc: "Minerai lourd aux reflets rougeâtres.", type: "composant", rarete: "6", poids: 5.0, prix: 80, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP12": { nom: "Plaque d'acier", desc: "Plaque métallique forgée.", type: "composant", rarete: "3", poids: 2.5, prix: 25, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP14": { nom: "Bandelette de cuir", desc: "Lanière solide.", type: "composant", rarete: "1", poids: 0.1, prix: 2, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP16": { nom: "Bobine de fils", desc: "Fil d'acier fin.", type: "composant", rarete: "2", poids: 0.5, prix: 15, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP17": { nom: "Acier de nains", desc: "Acier extrêmement pur et résistant.", type: "composant", rarete: "7", poids: 3.0, prix: 200, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP19": { nom: "Gros ressort", desc: "Ressort industriel.", type: "composant", rarete: "3", poids: 0.8, prix: 20, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP20": { nom: "Petit ressort", desc: "Ressort d'horlogerie.", type: "composant", rarete: "3", poids: 0.1, prix: 15, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP21": { nom: "Boîte en métal", desc: "Petit contenant.", type: "composant", rarete: "1", poids: 0.3, prix: 5, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP22": { nom: "Pince métallique", desc: "Outil d'artisan.", type: "composant", rarete: "2", poids: 0.5, prix: 12, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP23": { nom: "Montre à goussets", desc: "Horloge de poche.", type: "composant", rarete: "4", poids: 0.2, prix: 40, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP25": { nom: "Petite machine à vapeur", desc: "Moteur miniature.", type: "composant", rarete: "8", poids: 4.0, prix: 300, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP26": { nom: "Gros engrenage", desc: "Roue dentée.", type: "composant", rarete: "3", poids: 1.0, prix: 15, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP27": { nom: "Pistole cassé", desc: "Arme hors d'usage.", type: "composant", rarete: "2", poids: 1.5, prix: 10, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP28": { nom: "Petit tube en métal", desc: "Tuyau en cuivre.", type: "composant", rarete: "1", poids: 0.2, prix: 5, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP29": { nom: "Chambre de revolver", desc: "Pièce mécanique de tir.", type: "composant", rarete: "5", poids: 0.5, prix: 50, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP31": { nom: "Silencieux", desc: "Tube étouffant le son.", type: "composant", rarete: "5", poids: 0.3, prix: 60, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP33": { nom: "Miroir", desc: "Surface réfléchissante.", type: "composant", rarete: "2", poids: 0.1, prix: 10, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP36": { nom: "Gros tuyau", desc: "Cylindre d'acier.", type: "composant", rarete: "3", poids: 2.0, prix: 15, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP38": { nom: "Filament", desc: "Fil métallique fin.", type: "composant", rarete: "3", poids: 0.05, prix: 10, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP40": { nom: "Petite batterie", desc: "Pile chimique.", type: "composant", rarete: "4", poids: 0.5, prix: 30, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP41": { nom: "Boussole", desc: "Outil d'orientation.", type: "composant", rarete: "3", poids: 0.2, prix: 25, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP42": { nom: "Petit compsoant électrique", desc: "Pièce de circuit.", type: "composant", rarete: "4", poids: 0.1, prix: 20, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP43": { nom: "Grande batterie", desc: "Générateur portable.", type: "composant", rarete: "6", poids: 2.0, prix: 100, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP45": { nom: "Bobine électrique", desc: "Fil de cuivre enroulé.", type: "composant", rarete: "5", poids: 0.8, prix: 50, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP46": { nom: "Harnais électrique", desc: "Sangles avec câblage.", type: "composant", rarete: "6", poids: 1.5, prix: 120, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP47": { nom: "Bonine tesla", desc: "Condensateur de haute énergie.", type: "composant", rarete: "8", poids: 1.0, prix: 300, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP48": { nom: "feuilles de coca", desc: "Plante stimulante.", type: "composant", rarete: "3", poids: 0.1, prix: 15, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP49": { nom: "feuilles de tabac", desc: "Plante à fumer.", type: "composant", rarete: "1", poids: 0.1, prix: 5, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP50": { nom: "Poison", desc: "Fiole toxique standard.", type: "composant", rarete: "3", poids: 0.2, prix: 30, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP51": { nom: "herbe à sorcière", desc: "Herbe médicinale rare.", type: "composant", rarete: "5", poids: 0.1, prix: 40, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP52": { nom: "graisse de serpent", desc: "Onguent huileux.", type: "composant", rarete: "4", poids: 0.2, prix: 25, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP53": { nom: "Thermomètre", desc: "Outil médical.", type: "composant", rarete: "3", poids: 0.1, prix: 15, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP54": { nom: "Remède contre la migraine", desc: "Pillule apaisante.", type: "composant", rarete: "2", poids: 0.1, prix: 10, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP55": { nom: "Flacon de Camphre", desc: "Liquide aromatique.", type: "composant", rarete: "3", poids: 0.2, prix: 12, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP56": { nom: "Pilule sanguie", desc: "Capsule rouge.", type: "composant", rarete: "4", poids: 0.1, prix: 20, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP57": { nom: "Glycéride", desc: "Base chimique douce.", type: "composant", rarete: "3", poids: 0.2, prix: 15, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP58": { nom: "Teinture d'Arnica", desc: "Extrait végétal concentré.", type: "composant", rarete: "4", poids: 0.2, prix: 25, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP59": { nom: "Remède contre les rhumatisme", desc: "Fiole d'apothicaire.", type: "composant", rarete: "3", poids: 0.2, prix: 20, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP60": { nom: "Pillule nerveuse", desc: "Calmant chimique.", type: "composant", rarete: "4", poids: 0.1, prix: 30, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP61": { nom: "Bouteille de quinine", desc: "Tonic amer.", type: "composant", rarete: "3", poids: 0.5, prix: 18, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP62": { nom: "Solution électrolyte", desc: "Liquide conducteur.", type: "composant", rarete: "3", poids: 0.5, prix: 20, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP63": { nom: "Nettoyant", desc: "Détergent agressif.", type: "composant", rarete: "2", poids: 0.5, prix: 8, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP64": { nom: "Eau de vie", desc: "Alcool fort.", type: "composant", rarete: "2", poids: 0.5, prix: 15, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP65": { nom: "Vin", desc: "Bouteille de rouge.", type: "composant", rarete: "1", poids: 1.0, prix: 10, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP66": { nom: "Levure de brasseur", desc: "Pâte fermentée.", type: "composant", rarete: "2", poids: 0.2, prix: 5, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP67": { nom: "Champignon", desc: "Fongus vénéneux.", type: "composant", rarete: "3", poids: 0.1, prix: 12, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP68": { nom: "Remède contre la toux", desc: "Sirop épais.", type: "composant", rarete: "2", poids: 0.3, prix: 8, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP69": { nom: "Flacon de phénol", desc: "Acide industriel.", type: "composant", rarete: "5", poids: 0.5, prix: 50, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP70": { nom: "Pilule de souffre", desc: "Minéral jaune puant.", type: "composant", rarete: "4", poids: 0.1, prix: 25, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP71": { nom: "Flacon de parfum", desc: "Senteur florale.", type: "composant", rarete: "3", poids: 0.2, prix: 30, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP72": { nom: "Mixture de brimure", desc: "Boue malodorante.", type: "composant", rarete: "2", poids: 0.5, prix: 10, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP73": { nom: "Magnésium", desc: "Poudre métallique très inflammable.", type: "composant", rarete: "4", poids: 0.1, prix: 40, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP74": { nom: "Sucre", desc: "Poudre douce.", type: "composant", rarete: "1", poids: 0.5, prix: 5, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP75": { nom: "Engrais", desc: "Sacs de nutriments pour plantes.", type: "composant", rarete: "2", poids: 2.0, prix: 10, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP76": { nom: "Acide stéarique", desc: "Cire chimique.", type: "composant", rarete: "4", poids: 0.2, prix: 30, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP77": { nom: "Poudre noire", desc: "Mélange explosif classique.", type: "composant", rarete: "5", poids: 0.5, prix: 60, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP78": { nom: "Savon liquide", desc: "Produit glissant.", type: "composant", rarete: "2", poids: 0.5, prix: 5, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP79": { nom: "Nitroglycérine", desc: "Liquide extrêmement instable.", type: "composant", rarete: "8", poids: 0.5, prix: 200, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null }
};