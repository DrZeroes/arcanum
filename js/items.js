// ================= DICTIONNAIRE DES OBJETS =================
// Préfixes : AM (Mêlée), AD (Distance), AF (Feu), DEF (Armure/Bijoux), BIJ (Bijoux),
// CONS (Consommable), MUN (Munition/Carburant/Énergie), TEC (Explosifs/Grenades/Pièges),
// COMP (Composant), DIV (Divers), XXX (Quête/Unique)

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
        equipable: "main_droite", stackable: false, degats: "1-8", armure: 0, vitesse: 10, portee: 1, degatsFT: 2,
        stats: {}, prerequis: { FO: 7 }, lootable: true, nbUsages: null
    },
    "AM02": {
        nom: "Marteau de qualité", desc: "Un marteau de forgeron parfaitement équilibré.",
        type: "arme_melee", rarete: "6", poids: 4.5, prix: 150,
        equipable: "main_droite", stackable: false, degats: "2-12", armure: 0, vitesse: 11, portee: 1, degatsFT: 3,
        stats: { }, prerequis: { FO: 9 }, lootable: true, nbUsages: null
    },
    "AM03": {
        nom: "Épée enchantée", desc: "Une lame luisante qui palpite d'une énergie arcanique.",
        type: "arme_melee", rarete: "8", poids: 2.0, prix: 600,
        equipable: "main_droite", stackable: false, degats: "4-14", armure: 0, vitesse: 14, portee: 1, degatsFT: 2,
        stats: { resMagie: 10, FT: 20, align: 10 }, prerequis: { FO: 6 }, lootable: true, nbUsages: null
    },
    "AM04": {
        nom: "Dague simple", desc: "Une petite lame facile à dissimuler.",
        type: "arme_melee", rarete: "3", poids: 0.5, prix: 30,
        equipable: "main_droite", stackable: false, degats: "1-4", armure: 0, vitesse: 16, portee: 1, degatsFT: 1,
        stats: {}, prerequis: {}, lootable: true, nbUsages: null, actionsParTour: 2
    },
    "AM05": {
        nom: "Bâton", desc: "Un long bâton en bois robuste, souvent utilisé par les voyageurs.",
        type: "arme_melee", rarete: "2", poids: 1.5, prix: 20,
        equipable: "deux_mains", stackable: false, degats: "1-3", armure: 0, vitesse: 12, portee: 1, degatsFT: 1,
        stats: { FT: 5 }, prerequis: {}, lootable: true, nbUsages: null
    },
    "AM06": {
        nom: "Épée simple", desc: "Une lame droite standard en fer.",
        type: "arme_melee", rarete: "4", poids: 2.5, prix: 100,
        equipable: "main_droite", stackable: false, degats: "2-8", armure: 0, vitesse: 12, portee: 1, degatsFT: 2,
        stats: {}, prerequis: { FO: 6 }, lootable: true, nbUsages: null
    },
    "AM07": {
        nom: "Couteau rouillé", desc: "Plus dangereux pour le tétanos que pour la blessure.",
        type: "arme_melee", rarete: "1", poids: 0.5, prix: 10,
        equipable: "main_droite", stackable: false, degats: "1-3", armure: 0, vitesse: 14, portee: 1, degatsFT: 1,
        stats: {}, prerequis: {}, lootable: true, nbUsages: null, actionsParTour: 2
    },
    "AM08": {
        nom: "Épée rouillée", desc: "Une lame qui a connu des jours meilleurs.",
        type: "arme_melee", rarete: "1", poids: 2.5, prix: 8,
        equipable: "main_droite", stackable: false, degats: "1-6", armure: 0, vitesse: 10, portee: 1, degatsFT: 1,
        stats: {}, prerequis: { FO: 6 }, lootable: true, nbUsages: null
    },
    "AM09": {
        nom: "Vieille rapière", desc: "Fine et élégante, malgré les taches de rouille.",
        type: "arme_melee", rarete: "4", poids: 1.5, prix: 45,
        equipable: "main_droite", stackable: false, degats: "2-9", armure: 0, vitesse: 15, portee: 1, degatsFT: 2,
        stats: {}, prerequis: { DX: 9 }, lootable: true, nbUsages: null, actionsParTour: 2
    },
    "AM10": {
        nom: "Hache", desc: "Une hache de bûcheron bien affûtée.",
        type: "arme_melee", rarete: "4", poids: 3.5, prix: 50,
        equipable: "main_droite", stackable: false, degats: "3-10", armure: 0, vitesse: 9, portee: 1, degatsFT: 3,
        stats: {}, prerequis: { FO: 8 }, lootable: true, nbUsages: null
    },
    // --- Mêlée (Craft) ---
    "AM11": {
        nom: "Épée équilibrée", desc: "Arme rapide et précise utilisant les propriétés du pur alliage.",
        type: "arme_melee", rarete: "7", poids: 1.5, prix: 450,
        equipable: "main_droite", stackable: false, degats: "5-15", armure: 0, vitesse: 18, portee: 1, degatsFT: 3,
        stats: { }, prerequis: { DX: 9 }, lootable: false, nbUsages: null
    },
    "AM12": {
        nom: "Hache ultralégère", desc: "Arme mortelle en minerai nain pesant moitié moins.",
        type: "arme_melee", rarete: "7", poids: 1.8, prix: 500,
        equipable: "main_droite", stackable: false, degats: "6-18", armure: 0, vitesse: 14, portee: 1, degatsFT: 3,
        stats: { }, prerequis: { FO: 7 }, lootable: false, nbUsages: null
    },
    "AM13": {
        nom: "Bâton électrique", desc: "Bâton avec condensateur libérant un choc à l'impact.",
        type: "arme_melee", rarete: "6", poids: 2.0, prix: 350,
        equipable: "deux_mains", stackable: false, degats: "2-10", armure: 0, vitesse: 13, portee: 1, degatsFT: 3,
        stats: { resElec: 5, align: -10 }, prerequis: { DX: 8 }, lootable: false, nbUsages: null,
        elementDegats: "elec"
    },
    "AM14": {
        nom: "Bâton Tesla", desc: "Arme avancée projetant des rayons d'énergie paralysants.",
        type: "arme_melee", rarete: "9", poids: 2.5, prix: 1200,
        equipable: "deux_mains", stackable: false, degats: "10-25", armure: 0, vitesse: 15, portee: 3, degatsFT: 5,
        stats: { resElec: 15, align: -20 }, prerequis: { DX: 10 }, lootable: false, nbUsages: null,
        elementDegats: "elec"
    },
	
	
	
	
	
	    "AM15": { nom: "Barre de fer", desc: "Tige métallique standard.", type: "arme_melee", rarete: "1", poids: 1.5, prix: 10, equipable: "main_droite", stackable: false, degats: "1-2", armure: 0, vitesse: 0, portee: 0, degatsFT: 1, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "AM16": {
        nom: "Petite dague magique", soustype: "dague",
        desc: "Une fine lame ornée de runes luminescentes. Ses propriétés restent mystérieuses jusqu'à identification.",
        type: "arme_melee", rarete: "7", poids: 0.4, prix: 0,
        equipable: "main_droite", stackable: false, degats: "3-7", armure: 0, vitesse: 4, portee: 1,
        stats: { FT: 10 }, prerequis: {}, lootable: false, nbUsages: null,
        nonIdentifie: true,
    },

    // --- Bâtons supplémentaires ---
    "AM17": { nom: "Bâton de charme", soustype: "baton", desc: "Bâton ensorcelé renforçant l'endurance du porteur.", type: "arme_melee", rarete: "6", poids: 0.6, prix: 350, equipable: "deux_mains", stackable: false, degats: "1-8", armure: 0, vitesse: 8, portee: 1, degatsFT: 7, stats: { FT: 10, align: 10 }, prerequis: {}, lootable: true, nbUsages: null },
    "AM18": { nom: "Bâton de mage", soustype: "baton", desc: "Bâton classique de mage, concentrant l'énergie arcanique.", type: "arme_melee", rarete: "5", poids: 0.6, prix: 250, equipable: "deux_mains", stackable: false, degats: "1-8", armure: 0, vitesse: 8, portee: 1, degatsFT: 7, stats: { resMagie: 5, align: 15 }, prerequis: {}, lootable: true, nbUsages: null },
    "AM19": { nom: "Bâton magique puissant", soustype: "baton", desc: "Bâton imprégné d'énergie mystique intense.", type: "arme_melee", rarete: "8", poids: 0.6, prix: 700, equipable: "deux_mains", stackable: false, degats: "1-8", armure: 0, vitesse: 8, portee: 1, degatsFT: 7, stats: { resMagie: 15, FT: 15, align: 20 }, prerequis: {}, lootable: true, nbUsages: null },
    "AM20": { nom: "Bâton de qualité", soustype: "baton", desc: "Bâton bien équilibré en bois de frêne poli.", type: "arme_melee", rarete: "4", poids: 0.7, prix: 150, equipable: "deux_mains", stackable: false, degats: "1-8", armure: 0, vitesse: 10, portee: 1, degatsFT: 7, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "AM21": { nom: "Bâton sacré", soustype: "baton", desc: "Bâton consacré par des prêtres, portée augmentée.", type: "arme_melee", rarete: "6", poids: 0.6, prix: 350, equipable: "deux_mains", stackable: false, degats: "1-4", armure: 0, vitesse: 9, portee: 2, degatsFT: 5, stats: { resMagie: 10, align: 25 }, prerequis: {}, lootable: true, nbUsages: null },
    "AM22": { nom: "Bâton de chaman", soustype: "baton", desc: "Bâton orné de plumes et de dents de tribus ancestrales.", type: "arme_melee", rarete: "5", poids: 0.6, prix: 200, equipable: "deux_mains", stackable: false, degats: "1-8", armure: 0, vitesse: 8, portee: 1, degatsFT: 7, stats: { resMagie: 5, resPoison: 10, align: 10 }, prerequis: {}, lootable: true, nbUsages: null },
    "AM23": { nom: "Bâton de soins", soustype: "baton", desc: "Bâton médical à charges curatives.", type: "arme_melee", rarete: "7", poids: 0.6, prix: 500, equipable: "deux_mains", stackable: false, degats: "1-8", armure: 0, vitesse: 8, portee: 1, degatsFT: 7, stats: { resMagie: 10, align: 20 }, prerequis: {}, lootable: true, nbUsages: null },
    "AM24": { nom: "Bâton de Xoranth", soustype: "baton", desc: "Don du sage Jormund, d'une précision redoutable.", type: "arme_melee", rarete: "8", poids: 0.6, prix: 800, equipable: "deux_mains", stackable: false, degats: "1-4", armure: 0, vitesse: 8, portee: 1, degatsFT: 5, stats: { resMagie: 15, align: 20, bonusComp: { melee: 5 } }, prerequis: {}, lootable: false, nbUsages: null },

    // --- Daggers supplémentaires ---
    "AM25": { nom: "Dague d'os", soustype: "dague", desc: "Lame taillée dans un os. Primitive mais acérée.", type: "arme_melee", rarete: "1", poids: 0.2, prix: 5, equipable: "main_droite", stackable: false, degats: "1-3", armure: 0, vitesse: 6, portee: 1, degatsFT: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null, actionsParTour: 2 },
    "AM26": { nom: "Dague de douleur", soustype: "dague", desc: "Lame dentelée qui inflige une douleur maximale.", type: "arme_melee", rarete: "5", poids: 0.2, prix: 200, equipable: "main_droite", stackable: false, degats: "1-4", armure: 0, vitesse: 12, portee: 1, degatsFT: 1, stats: { bonusComp: { melee: 3 } }, prerequis: { DX: 7 }, lootable: true, nbUsages: null, actionsParTour: 2 },
    "AM27": { nom: "Dague de vitesse", soustype: "dague", desc: "Lame elfique légère, trop rapide pour l'œil.", type: "arme_melee", rarete: "6", poids: 0.15, prix: 300, equipable: "main_droite", stackable: false, degats: "1-6", armure: 0, vitesse: 18, portee: 1, degatsFT: 1, stats: {}, prerequis: { DX: 9 }, lootable: true, nbUsages: null, actionsParTour: 3 },
    "AM28": { nom: "Dague redoutable", soustype: "dague", desc: "Lame forgée dans les entrailles de la terre.", type: "arme_melee", rarete: "5", poids: 0.2, prix: 220, equipable: "main_droite", stackable: false, degats: "1-4", armure: 0, vitesse: 10, portee: 1, degatsFT: 1, stats: { bonusComp: { melee: 2 } }, prerequis: {}, lootable: true, nbUsages: null, actionsParTour: 2 },
    "AM29": { nom: "Dague finement forgée", soustype: "dague", desc: "Lame de qualité artisanale, légère et équilibrée.", type: "arme_melee", rarete: "5", poids: 0.15, prix: 250, equipable: "main_droite", stackable: false, degats: "2-6", armure: 0, vitesse: 16, portee: 1, degatsFT: 2, stats: {}, prerequis: { DX: 8 }, lootable: true, nbUsages: null, actionsParTour: 2 },
    "AM30": { nom: "Dague d'acier fin", soustype: "dague", desc: "Lame forgée en acier de haute qualité.", type: "arme_melee", rarete: "4", poids: 0.25, prix: 150, equipable: "main_droite", stackable: false, degats: "2-6", armure: 0, vitesse: 12, portee: 1, degatsFT: 2, stats: {}, prerequis: {}, lootable: true, nbUsages: null, actionsParTour: 2 },
    "AM31": { nom: "Dague ensorcelée", soustype: "dague", desc: "Lame aux runes résonnant avec la magie ambiante.", type: "arme_melee", rarete: "6", poids: 0.2, prix: 350, equipable: "main_droite", stackable: false, degats: "1-4", armure: 0, vitesse: 10, portee: 1, degatsFT: 1, stats: { resMagie: 10, align: 5 }, prerequis: {}, lootable: true, nbUsages: null, actionsParTour: 2 },
    "AM32": { nom: "Dague mécanique", soustype: "dague", desc: "Lame à mécanisme intégré pour un déploiement instantané.", type: "arme_melee", rarete: "6", poids: 0.2, prix: 320, equipable: "main_droite", stackable: false, degats: "2-12", armure: 0, vitesse: 10, portee: 1, degatsFT: 3, stats: { align: -10 }, prerequis: {}, lootable: false, nbUsages: null, actionsParTour: 2 },
    "AM33": { nom: "Dague des ombres", soustype: "dague", desc: "Lame maudite qui empoisonne son porteur autant que ses victimes.", type: "arme_melee", rarete: "7", poids: 0.2, prix: 450, equipable: "main_droite", stackable: false, degats: "1-6", armure: 0, vitesse: 8, portee: 1, degatsFT: 1, stats: { bonusComp: { attaque_sournoise: 5 }, align: -10 }, prerequis: {}, lootable: true, nbUsages: null, actionsParTour: 2 },
    "AM34": { nom: "Dague électrisante", soustype: "dague", desc: "Lame chargée par un cristal de condensation électrique.", type: "arme_melee", rarete: "5", poids: 0.2, prix: 280, equipable: "main_droite", stackable: false, degats: "1-4", armure: 0, vitesse: 5, portee: 1, degatsFT: 1, stats: { align: -10 }, prerequis: {}, lootable: true, nbUsages: null, actionsParTour: 2, elementDegats: "elec" },
    "AM35": { nom: "Dague de sorcière", soustype: "dague", desc: "Lame rituelle à portée augmentée.", type: "arme_melee", rarete: "6", poids: 0.2, prix: 300, equipable: "main_droite", stackable: false, degats: "1-4", armure: 0, vitesse: 10, portee: 2, degatsFT: 1, stats: { resMagie: 5, align: 10 }, prerequis: {}, lootable: true, nbUsages: null, actionsParTour: 2 },

    // --- Épées supplémentaires ---
    "AM36": { nom: "Grande épée arcane", soustype: "epee", desc: "Épée à deux mains chargée d'énergie arcanique dévastatrice.", type: "arme_melee", rarete: "9", poids: 1.2, prix: 1500, equipable: "deux_mains", stackable: false, degats: "4-16", armure: 0, vitesse: 8, portee: 1, degatsFT: 7, stats: { resMagie: 20, FT: 15, align: 20 }, prerequis: { FO: 9 }, lootable: true, nbUsages: null },
    "AM37": { nom: "Grande lame barbare", soustype: "epee", desc: "Épée massive taillée pour les guerriers des steppes.", type: "arme_melee", rarete: "6", poids: 1.5, prix: 400, equipable: "main_droite", stackable: false, degats: "8-20", armure: 0, vitesse: 12, portee: 1, degatsFT: 9, stats: {}, prerequis: { FO: 10 }, lootable: true, nbUsages: null },
    "AM38": { nom: "Espadon", soustype: "epee", desc: "Longue lame large et solide, arme de ligne de bataille.", type: "arme_melee", rarete: "5", poids: 1.0, prix: 200, equipable: "main_droite", stackable: false, degats: "4-16", armure: 0, vitesse: 4, portee: 1, degatsFT: 7, stats: {}, prerequis: { FO: 8 }, lootable: true, nbUsages: null },
    "AM39": { nom: "Épée d'élite de Caladon", soustype: "epee", desc: "Épée issue des armureries royales de Caladon.", type: "arme_melee", rarete: "5", poids: 0.8, prix: 250, equipable: "main_droite", stackable: false, degats: "2-9", armure: 0, vitesse: 12, portee: 1, degatsFT: 3, stats: {}, prerequis: { FO: 7 }, lootable: true, nbUsages: null },
    "AM40": { nom: "Claymore", soustype: "epee", desc: "Grande épée à deux mains, lame longue dévastatrice.", type: "arme_melee", rarete: "6", poids: 1.2, prix: 350, equipable: "deux_mains", stackable: false, degats: "2-18", armure: 0, vitesse: 8, portee: 1, degatsFT: 6, stats: {}, prerequis: { FO: 9 }, lootable: true, nbUsages: null },
    "AM41": { nom: "Épée empoisonnée", soustype: "epee", desc: "Lame enduite d'un poison à action prolongée.", type: "arme_melee", rarete: "6", poids: 0.5, prix: 350, equipable: "main_droite", stackable: false, degats: "1-8", armure: 0, vitesse: 8, portee: 1, degatsFT: 2, stats: {}, prerequis: {}, lootable: true, nbUsages: null, elementDegats: "poison" },
    "AM42": { nom: "Fauchon", soustype: "epee", desc: "Lame incurvée à un seul tranchant, rapide et meurtrière.", type: "arme_melee", rarete: "4", poids: 0.9, prix: 150, equipable: "main_droite", stackable: false, degats: "2-9", armure: 0, vitesse: 6, portee: 1, degatsFT: 6, stats: {}, prerequis: { FO: 7 }, lootable: true, nbUsages: null },
    "AM43": { nom: "Flamberge", soustype: "epee", desc: "Longue épée à lame ondulée, difficile à parer.", type: "arme_melee", rarete: "6", poids: 1.3, prix: 400, equipable: "deux_mains", stackable: false, degats: "1-20", armure: 0, vitesse: 6, portee: 1, degatsFT: 5, stats: {}, prerequis: { FO: 9 }, lootable: true, nbUsages: null },
    "AM44": { nom: "Katana", soustype: "epee", desc: "Sabre du lointain Orient, forgé selon des techniques secrètes.", type: "arme_melee", rarete: "7", poids: 0.4, prix: 500, equipable: "main_droite", stackable: false, degats: "3-12", armure: 0, vitesse: 20, portee: 1, degatsFT: 2, stats: {}, prerequis: { DX: 9 }, lootable: true, nbUsages: null, actionsParTour: 2 },
    "AM45": { nom: "Épée de kite", soustype: "epee", desc: "Arme primitive des guerriers kites, taillée dans la roche.", type: "arme_melee", rarete: "2", poids: 0.2, prix: 15, equipable: "main_droite", stackable: false, degats: "2-6", armure: 0, vitesse: 6, portee: 1, degatsFT: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "AM46": { nom: "Épée mystique", soustype: "epee", desc: "Lame imprégnée d'une magie ancienne et puissante.", type: "arme_melee", rarete: "9", poids: 0.75, prix: 1200, equipable: "main_droite", stackable: false, degats: "1-8", armure: 0, vitesse: 10, portee: 1, degatsFT: 2, stats: { resMagie: 15, FT: 10, align: 20 }, prerequis: {}, lootable: true, nbUsages: null },
    "AM47": { nom: "Grande épée mystique", soustype: "epee", desc: "Épée à deux mains investie d'énergie mystique immense.", type: "arme_melee", rarete: "9", poids: 1.2, prix: 1400, equipable: "deux_mains", stackable: false, degats: "4-16", armure: 0, vitesse: 8, portee: 1, degatsFT: 7, stats: { resMagie: 20, FT: 15, align: 25 }, prerequis: { FO: 9 }, lootable: true, nbUsages: null },
    "AM48": { nom: "Grand espadon de qualité", soustype: "epee", desc: "Espadon de maître-forgeron, équilibré à la perfection.", type: "arme_melee", rarete: "7", poids: 1.0, prix: 600, equipable: "main_droite", stackable: false, degats: "6-18", armure: 0, vitesse: 8, portee: 1, degatsFT: 8, stats: {}, prerequis: { FO: 9 }, lootable: true, nbUsages: null },
    "AM49": { nom: "Épée de qualité", soustype: "epee", desc: "Épée finement travaillée par un artisan expérimenté.", type: "arme_melee", rarete: "5", poids: 0.8, prix: 250, equipable: "main_droite", stackable: false, degats: "2-9", armure: 0, vitesse: 10, portee: 1, degatsFT: 3, stats: {}, prerequis: { FO: 7 }, lootable: true, nbUsages: null },
    "AM50": { nom: "Cimeterre", soustype: "epee", desc: "Lame courbe d'origine méridionale, agile et mortelle.", type: "arme_melee", rarete: "4", poids: 0.6, prix: 180, equipable: "main_droite", stackable: false, degats: "2-10", armure: 0, vitesse: 11, portee: 1, degatsFT: 3, stats: {}, prerequis: { DX: 7 }, lootable: true, nbUsages: null },
    "AM51": { nom: "Cimeterre hurlant", soustype: "epee", desc: "Cimeterre enchanté dont le tranchant siffle en fendant l'air.", type: "arme_melee", rarete: "7", poids: 0.6, prix: 550, equipable: "main_droite", stackable: false, degats: "2-10", armure: 0, vitesse: 11, portee: 1, degatsFT: 3, stats: { bonusComp: { melee: 3 }, align: 5 }, prerequis: { DX: 7 }, lootable: true, nbUsages: null },
    "AM52": { nom: "Épée courte", soustype: "epee", desc: "Lame courte facile à manier dans les espaces confinés.", type: "arme_melee", rarete: "3", poids: 0.3, prix: 80, equipable: "main_droite", stackable: false, degats: "1-6", armure: 0, vitesse: 12, portee: 1, degatsFT: 2, stats: {}, prerequis: {}, lootable: true, nbUsages: null, actionsParTour: 2 },
    "AM53": { nom: "Épée de l'air", soustype: "epee", desc: "Lame forgée dans un métal inconnu, légère comme une brise.", type: "arme_melee", rarete: "8", poids: 0.4, prix: 900, equipable: "main_droite", stackable: false, degats: "5-20", armure: 0, vitesse: 12, portee: 1, degatsFT: 3, stats: { resMagie: 10, align: 15 }, prerequis: {}, lootable: true, nbUsages: null },
    "AM54": { nom: "Épée de défense", soustype: "epee", desc: "Lame conçue pour dévier les coups autant qu'en porter.", type: "arme_melee", rarete: "7", poids: 0.7, prix: 600, equipable: "main_droite", stackable: false, degats: "5-10", armure: 15, vitesse: 10, portee: 1, degatsFT: 2, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "AM55": { nom: "Épée de maladie", soustype: "epee", desc: "Lame maudite imprégnée de substances corruptrices.", type: "arme_melee", rarete: "8", poids: 1.0, prix: 800, equipable: "main_droite", stackable: false, degats: "5-20", armure: 0, vitesse: 8, portee: 1, degatsFT: 3, stats: { align: 5 }, prerequis: {}, lootable: true, nbUsages: null, elementDegats: "poison" },
    "AM56": { nom: "Épée trempée", soustype: "epee", desc: "Lame trempée dans une solution spéciale augmentant sa précision.", type: "arme_melee", rarete: "5", poids: 0.8, prix: 300, equipable: "main_droite", stackable: false, degats: "1-8", armure: 0, vitesse: 11, portee: 1, degatsFT: 2, stats: { bonusComp: { melee: 3 } }, prerequis: {}, lootable: true, nbUsages: null },

    // --- Marteaux supplémentaires ---
    "AM57": { nom: "Marteau écrasant", soustype: "marteau", desc: "Masse lourde conçue pour briser les armures.", type: "arme_melee", rarete: "6", poids: 1.2, prix: 350, equipable: "main_droite", stackable: false, degats: "1-9", armure: 0, vitesse: 5, portee: 1, degatsFT: 5, stats: {}, prerequis: { FO: 9 }, lootable: true, nbUsages: null },
    "AM58": { nom: "Marteau de nain", soustype: "marteau", desc: "Marteau de combat nain, lourd et précis.", type: "arme_melee", rarete: "7", poids: 1.0, prix: 500, equipable: "main_droite", stackable: false, degats: "1-7", armure: 0, vitesse: 8, portee: 1, degatsFT: 5, stats: { bonusComp: { melee: 4 } }, prerequis: { FO: 8 }, lootable: true, nbUsages: null },
    "AM59": { nom: "Marteau simple", soustype: "marteau", desc: "Marteau de forgeron reconverti en arme.", type: "arme_melee", rarete: "2", poids: 1.2, prix: 40, equipable: "main_droite", stackable: false, degats: "1-5", armure: 0, vitesse: 5, portee: 1, degatsFT: 4, stats: {}, prerequis: { FO: 7 }, lootable: true, nbUsages: null },
    "AM60": { nom: "Marteau infernal", soustype: "marteau", desc: "Marteau dont la tête rougeoyante brûle à chaque impact.", type: "arme_melee", rarete: "7", poids: 1.2, prix: 600, equipable: "main_droite", stackable: false, degats: "1-8", armure: 0, vitesse: 5, portee: 1, degatsFT: 5, stats: { align: -10 }, prerequis: { FO: 8 }, lootable: true, nbUsages: null, elementDegats: "feu" },
    "AM61": { nom: "Marteau de Lloyd", soustype: "marteau", desc: "Le marteau du forgeron Lloyd, légendairement précis.", type: "arme_melee", rarete: "6", poids: 1.0, prix: 400, equipable: "main_droite", stackable: false, degats: "1-7", armure: 0, vitesse: 8, portee: 1, degatsFT: 5, stats: { bonusComp: { melee: 2 } }, prerequis: { FO: 7 }, lootable: true, nbUsages: null },
    "AM62": { nom: "Marteau usiné", soustype: "marteau", desc: "Marteau fabriqué à la machine avec une précision d'ingénieur.", type: "arme_melee", rarete: "6", poids: 0.9, prix: 380, equipable: "main_droite", stackable: false, degats: "3-9", armure: 0, vitesse: 8, portee: 1, degatsFT: 7, stats: { align: -10 }, prerequis: {}, lootable: false, nbUsages: null },
    "AM63": { nom: "Marteau rouillé", soustype: "marteau", desc: "Vieux marteau couvert de rouille. Fragile.", type: "arme_melee", rarete: "1", poids: 1.2, prix: 5, equipable: "main_droite", stackable: false, degats: "1-4", armure: 0, vitesse: 3, portee: 1, degatsFT: 2, stats: {}, prerequis: {}, lootable: true, nbUsages: null },

    // --- Haches supplémentaires ---
    "AM64": { nom: "Hache d'Almstead", soustype: "hache", desc: "Hache de chasse de Garret Almstead, équilibrée pour les lancers.", type: "arme_melee", rarete: "6", poids: 1.0, prix: 400, equipable: "main_droite", stackable: false, degats: "3-14", armure: 0, vitesse: 9, portee: 1, degatsFT: 6, stats: { bonusComp: { melee: 3 } }, prerequis: { FO: 8 }, lootable: true, nbUsages: null },
    "AM65": { nom: "Hache de la foudre noire", soustype: "hache", desc: "Hache électrisée qui projette des éclairs au contact.", type: "arme_melee", rarete: "8", poids: 1.3, prix: 900, equipable: "main_droite", stackable: false, degats: "5-15", armure: 0, vitesse: 5, portee: 1, degatsFT: 5, stats: { resElec: -10, align: -15 }, prerequis: { FO: 8 }, lootable: true, nbUsages: null, elementDegats: "elec" },
    "AM66": { nom: "Hache de force", soustype: "hache", desc: "Hache enchantée décuplant la puissance brute de son porteur.", type: "arme_melee", rarete: "7", poids: 1.2, prix: 600, equipable: "main_droite", stackable: false, degats: "6-12", armure: 0, vitesse: 5, portee: 1, degatsFT: 2, stats: { FO: 1, CN: 1, align: 5 }, prerequis: { FO: 8 }, lootable: true, nbUsages: null },
    "AM67": { nom: "Hache chargée", soustype: "hache", desc: "Hache à condensateur déchargeant l'électricité à l'impact.", type: "arme_melee", rarete: "7", poids: 1.2, prix: 550, equipable: "main_droite", stackable: false, degats: "1-12", armure: 0, vitesse: 5, portee: 1, degatsFT: 5, stats: { align: -15 }, prerequis: { FO: 8 }, lootable: false, nbUsages: null, elementDegats: "elec" },
    "AM68": { nom: "Hache mystique", soustype: "hache", desc: "Hache ancienne imprégnée de puissance mystique.", type: "arme_melee", rarete: "9", poids: 1.2, prix: 1100, equipable: "main_droite", stackable: false, degats: "1-13", armure: 0, vitesse: 6, portee: 1, degatsFT: 7, stats: { resMagie: 15, align: 15 }, prerequis: { FO: 9 }, lootable: true, nbUsages: null },
    "AM69": { nom: "Hache puissante", soustype: "hache", desc: "Grande hache de guerre dégageant une force dévastatrice.", type: "arme_melee", rarete: "8", poids: 1.2, prix: 700, equipable: "main_droite", stackable: false, degats: "5-18", armure: 0, vitesse: 8, portee: 1, degatsFT: 7, stats: {}, prerequis: { FO: 10 }, lootable: true, nbUsages: null },
    "AM70": { nom: "Hache pyrotechnique", soustype: "hache", desc: "Hache à réservoir de carburant infligeant des dégâts de feu massifs.", type: "arme_melee", rarete: "8", poids: 1.2, prix: 800, equipable: "main_droite", stackable: false, degats: "1-12", armure: 0, vitesse: 5, portee: 1, degatsFT: 6, stats: { align: -20 }, prerequis: { FO: 8 }, lootable: false, nbUsages: null, elementDegats: "feu" },
    "AM71": { nom: "Hache de qualité", soustype: "hache", desc: "Hache de bûcheron de haute qualité, parfaitement affûtée.", type: "arme_melee", rarete: "6", poids: 1.0, prix: 380, equipable: "main_droite", stackable: false, degats: "3-14", armure: 0, vitesse: 8, portee: 1, degatsFT: 6, stats: {}, prerequis: { FO: 8 }, lootable: true, nbUsages: null },

    // --- Masses supplémentaires ---
    "AM72": { nom: "Masse ensorcelée", soustype: "masse", desc: "Masse enchantée dont les runes augmentent la puissance des coups.", type: "arme_melee", rarete: "6", poids: 1.3, prix: 400, equipable: "main_droite", stackable: false, degats: "1-5", armure: 0, vitesse: 5, portee: 1, degatsFT: 5, stats: { resMagie: 5, align: 5 }, prerequis: { FO: 8 }, lootable: true, nbUsages: null },
    "AM73": { nom: "Masse simple", soustype: "masse", desc: "Masse en fer de base, lourde et contondante.", type: "arme_melee", rarete: "2", poids: 1.2, prix: 50, equipable: "main_droite", stackable: false, degats: "1-4", armure: 0, vitesse: 5, portee: 1, degatsFT: 4, stats: {}, prerequis: { FO: 7 }, lootable: true, nbUsages: null },
    "AM74": { nom: "Masse des damnés", soustype: "masse", desc: "Masse maudite dont les coups drainent la volonté des adversaires.", type: "arme_melee", rarete: "9", poids: 1.25, prix: 1200, equipable: "main_droite", stackable: false, degats: "1-8", armure: 0, vitesse: 6, portee: 1, degatsFT: 4, stats: { resMagie: -5, align: -30 }, prerequis: { FO: 8 }, lootable: true, nbUsages: null },
    "AM75": { nom: "Masse magique", soustype: "masse", desc: "Masse imprégnée d'une magie ancienne et destructrice.", type: "arme_melee", rarete: "8", poids: 1.25, prix: 900, equipable: "main_droite", stackable: false, degats: "2-5", armure: 0, vitesse: 6, portee: 1, degatsFT: 6, stats: { resMagie: 15, align: 15 }, prerequis: { FO: 8 }, lootable: true, nbUsages: null },
    "AM76": { nom: "Masse de qualité", soustype: "masse", desc: "Masse de combat bien équilibrée de maître-forgeron.", type: "arme_melee", rarete: "5", poids: 1.0, prix: 250, equipable: "main_droite", stackable: false, degats: "2-5", armure: 0, vitesse: 8, portee: 1, degatsFT: 5, stats: {}, prerequis: { FO: 7 }, lootable: true, nbUsages: null },
    "AM77": { nom: "Masse rouillée", soustype: "masse", desc: "Vieille masse rongée par la rouille. Dangereuse surtout pour les tétanos.", type: "arme_melee", rarete: "1", poids: 1.2, prix: 5, equipable: "main_droite", stackable: false, degats: "1-3", armure: 0, vitesse: 3, portee: 1, degatsFT: 2, stats: {}, prerequis: {}, lootable: true, nbUsages: null },

	
	
	
	
	
	

    // ---------------- ARMES À DISTANCE (AD) ----------------
    "AD01": {
        nom: "Arc court", desc: "Un arc simple en bois souple. Nécessite des flèches.",
        type: "arme_distance", soustype: "arc", rarete: "1", poids: 1.5, prix: 100,
        equipable: "deux_mains", stackable: false, degats: "1-6", armure: 0, vitesse: 10, portee: 15, degatsFT: 1,
        stats: {}, prerequis: { DX: 8 }, lootable: true, nbUsages: null
    },
       "AD02": {
        nom: "Arc long", desc: "Un arc long en bois rigide. Nécessite des flèches.",
        type: "arme_distance", soustype: "arc", rarete: "3", poids: 1.5, prix: 200,
        equipable: "deux_mains", stackable: false, degats: "3-8", armure: 0, vitesse: 10, portee: 15, degatsFT: 1,
        stats: {}, prerequis: { DX: 10 }, lootable: true, nbUsages: null
    },
       "AD03": {
        nom: "Arc Elfique", desc: "Un arc elfique. Nécessite des flèches.",
        type: "arme_distance", soustype: "arc", rarete: "5", poids: 1.5, prix: 300,
        equipable: "deux_mains", stackable: false, degats: "3-15", armure: 0, vitesse: 10, portee: 15, degatsFT: 1,
        stats: {}, prerequis: { DX: 12 }, lootable: true, nbUsages: null
    },

       "AD04": {
        nom: "Arc magique ", desc: "Un arc emplit de magie. Nécessite des flèches.",
        type: "arme_distance", soustype: "arc", rarete: "5", poids: 1.5, prix: 300,
        equipable: "deux_mains", stackable: false, degats: "5-10", armure: 0, vitesse: 10, portee: 15, degatsFT: 1,
        stats: {FT: 25, align: 10}, prerequis: { DX: 12 }, lootable: true, nbUsages: null
    },
    "AD05": {
        nom: "Boomerang", desc: "Une arme exotique qui revient à l'envoyeur. Normalement.",
        type: "arme_distance", rarete: "1", poids: 1.0, prix: 70,
        equipable: "main_droite", stackable: false, degats: "1-4", armure: 0, vitesse: 12, portee: 10, degatsFT: 1,
        stats: {}, prerequis: { DX: 7 }, lootable: true, nbUsages: null
    },
    "AD06": { nom: "Boomerang à lame", desc: "Boomerang garni de lames tranchantes sur les bords.", type: "arme_distance", rarete: "5", poids: 0.6, prix: 200, equipable: "main_droite", stackable: false, degats: "1-8", armure: 0, vitesse: 12, portee: 20, degatsFT: 1, stats: {}, prerequis: { DX: 8 }, lootable: true, nbUsages: null },
    "AD07": { nom: "Arc béni", soustype: "arc", desc: "Arc consacré dont les flèches portent la faveur divine.", type: "arme_distance", rarete: "8", poids: 0.5, prix: 900, equipable: "deux_mains", stackable: false, degats: "1-10", armure: 0, vitesse: 15, portee: 15, degatsFT: 3, stats: { resMagie: 10, align: 20 }, prerequis: { DX: 10 }, lootable: true, nbUsages: null },
    "AD08": { nom: "Arc de destruction", soustype: "arc", desc: "Arc enchanté augmentant massivement la précision des tirs.", type: "arme_distance", rarete: "7", poids: 0.5, prix: 600, equipable: "deux_mains", stackable: false, degats: "1-10", armure: 0, vitesse: 8, portee: 15, degatsFT: 3, stats: { bonusComp: { arc: 4 }, align: 5 }, prerequis: { DX: 10 }, lootable: true, nbUsages: null },
    "AD09": { nom: "Arc de terreur", soustype: "arc", desc: "Arc aux runes de peur. Les cibles peuvent fuir sous l'effet de terreur.", type: "arme_distance", rarete: "7", poids: 0.5, prix: 500, equipable: "deux_mains", stackable: false, degats: "1-6", armure: 0, vitesse: 8, portee: 15, degatsFT: 1, stats: { align: -5 }, prerequis: { DX: 8 }, lootable: true, nbUsages: null },
    "AD10": { nom: "Arc du faucheur glacé", soustype: "arc", desc: "Arc maudit drainant la constitution de son porteur.", type: "arme_distance", rarete: "8", poids: 0.5, prix: 700, equipable: "deux_mains", stackable: false, degats: "1-8", armure: 0, vitesse: 8, portee: 15, degatsFT: 0, stats: { CN: -6, align: -10 }, prerequis: { DX: 9 }, lootable: true, nbUsages: null },
    "AD11": { nom: "Chakram", desc: "Disque tranchant en acier pouvant trancher à distance.", type: "arme_distance", rarete: "5", poids: 0.7, prix: 250, equipable: "main_droite", stackable: false, degats: "1-10", armure: 0, vitesse: 12, portee: 20, degatsFT: 2, stats: {}, prerequis: { DX: 8 }, lootable: true, nbUsages: null },
    "AD12": { nom: "Arc composé", soustype: "arc", desc: "Arc renforcé en os et bois lamellé, plus puissant qu'un arc ordinaire.", type: "arme_distance", rarete: "6", poids: 1.0, prix: 350, equipable: "deux_mains", stackable: false, degats: "5-18", armure: 0, vitesse: 6, portee: 15, degatsFT: 6, stats: {}, prerequis: { DX: 10, FO: 8 }, lootable: true, nbUsages: null },
    "AD13": { nom: "Arc de chasseur elfique", soustype: "arc", desc: "Arc elfique légendaire spécialisé contre les animaux et créatures.", type: "arme_distance", rarete: "8", poids: 0.5, prix: 900, equipable: "deux_mains", stackable: false, degats: "10-20", armure: 0, vitesse: 10, portee: 20, degatsFT: 0, stats: { align: 15 }, prerequis: { DX: 12 }, lootable: true, nbUsages: null },
    "AD14": { nom: "Boomerang véloce", desc: "Boomerang aérodynamique dont le retour est quasi instantané.", type: "arme_distance", rarete: "4", poids: 0.6, prix: 180, equipable: "main_droite", stackable: false, degats: "1-8", armure: 0, vitesse: 14, portee: 20, degatsFT: 1, stats: { bonusComp: { arc: 2 } }, prerequis: { DX: 8 }, lootable: true, nbUsages: null },
    "AD15": { nom: "Arc nocif", soustype: "arc", desc: "Arc maudit dont les flèches infligent des dommages aléatoires.", type: "arme_distance", rarete: "7", poids: 0.5, prix: 500, equipable: "deux_mains", stackable: false, degats: "5-20", armure: 0, vitesse: 8, portee: 15, degatsFT: 0, stats: { align: -10 }, prerequis: { DX: 10 }, lootable: true, nbUsages: null },
    "AD16": { nom: "Chakram dentelé", desc: "Chakram à bord cranté infligeant des blessures profondes.", type: "arme_distance", rarete: "6", poids: 0.8, prix: 350, equipable: "main_droite", stackable: false, degats: "1-10", armure: 0, vitesse: 12, portee: 20, degatsFT: 2, stats: { bonusComp: { arc: 2 } }, prerequis: { DX: 8 }, lootable: true, nbUsages: null },
    "AD17": { nom: "Dague de lancer", desc: "Dague équilibrée pour être lancée avec précision.", type: "arme_distance", rarete: "3", poids: 0.15, prix: 60, equipable: "main_droite", stackable: true, degats: "1-4", armure: 0, vitesse: 10, portee: 15, degatsFT: 1, stats: {}, prerequis: { DX: 7 }, lootable: true, nbUsages: null },

    // ---------------- ARMES À FEU (AF) ----------------
    "AF01": {
        nom: "Revolver de qualité", desc: "Le barillet tourne avec une précision mortelle.",
        type: "arme_feu", rarete: "6", poids: 1.8, prix: 350,
        equipable: "main_droite", stackable: false, degats: "5-15", armure: 0, vitesse: 15, portee: 12, degatsFT: 2, actionsParTour: 2,
        stats: { align: -10 }, prerequis: { DX: 7 }, lootable: true, nbUsages: null
    },
    "AF02": {
        nom: "Revolver rouillé", desc: "Le barillet a du mal à tourner, mais ça fera l'affaire.",
        type: "arme_feu", rarete: "3", poids: 1.8, prix: 220,
        equipable: "main_droite", stackable: false, degats: "4-12", armure: 0, vitesse: 12, portee: 12, degatsFT: 2,
        stats: { align: -5 }, prerequis: { DX: 7 }, lootable: true, nbUsages: null
    },
    // --- Armes à Feu (Craft) ---
    "AF03": {
        nom: "Pistolet à silex", desc: "Arme à feu rudimentaire fabriquée avec des pièces de récupération.",
        type: "arme_feu", rarete: "3", poids: 2.0, prix: 150,
        equipable: "main_droite", stackable: false, degats: "3-10", armure: 0, vitesse: 8, portee: 10, degatsFT: 2,
        stats: { align: -10 }, prerequis: { DX: 6 }, lootable: false, nbUsages: null
    },
    "AF04": {
        nom: "Revolver de choix", desc: "Pistolet bien équilibré destiné aux tireurs sérieux.",
        type: "arme_feu", rarete: "7", poids: 1.6, prix: 450,
        equipable: "main_droite", stackable: false, degats: "6-18", armure: 0, vitesse: 18, portee: 15, degatsFT: 2,
        stats: { align: -15 }, prerequis: { DX: 8 }, lootable: false, nbUsages: null
    },
    "AF05": {
        nom: "Fusil à répétition", desc: "Fusil permettant de tirer plusieurs coups rapidement.",
        type: "arme_feu", rarete: "8", poids: 3.5, prix: 800,
        equipable: "deux_mains", stackable: false, degats: "8-20", armure: 0, vitesse: 18, portee: 20, degatsFT: 2,
        stats: { align: -20 }, prerequis: { DX: 9 }, lootable: false, nbUsages: null, actionsParTour: 2
    },
    "AF06": {
        nom: "Revolver silencieux", desc: "Arme à feu modifiée pour réduire le bruit de la détonation.",
        type: "arme_feu", rarete: "7", poids: 1.7, prix: 600,
        equipable: "main_droite", stackable: false, degats: "5-15", armure: 0, vitesse: 16, portee: 12, degatsFT: 2,
        stats: { align: -15 }, prerequis: { DX: 8 }, lootable: false, nbUsages: null
    },
    "AF07": {
        nom: "Fusil à lunette", desc: "Fusil de précision équipé d'un système de visée optique.",
        type: "arme_feu", rarete: "8", poids: 4.0, prix: 950,
        equipable: "deux_mains", stackable: false, degats: "10-25", armure: 0, vitesse: 8, portee: 30, degatsFT: 2,
        stats: { align: -20 }, prerequis: { DX: 10 }, lootable: false, nbUsages: null
    },
    "AF08": {
        nom: "Canon portable", desc: "Arme lourde infligeant des dégâts massifs.",
        type: "arme_feu", rarete: "9", poids: 8.0, prix: 1500,
        equipable: "deux_mains", stackable: false, degats: "20-40", armure: 0, vitesse: 5, portee: 15, degatsFT: 2,
        stats: { align: -25 }, prerequis: { FO: 12, DX: 8 }, lootable: false, nbUsages: null
    },
    "AF09": {
        nom: "Fusil éléphant", desc: "Arme de très gros calibre pour les cibles les plus résistantes.",
        type: "arme_feu", rarete: "10", poids: 5.5, prix: 2200,
        equipable: "deux_mains", stackable: false, degats: "25-50", armure: 0, vitesse: 6, portee: 25, degatsFT: 2,
        stats: { align: -30 }, prerequis: { FO: 10, DX: 10 }, lootable: false, nbUsages: null
    },




    "AF10": { nom: "Fusil de chasse", desc: "Arme de base.", type: "arme_feu", rarete: "4", poids: 3.0, prix: 80, equipable: "deux_mains", stackable: false, degats: "5-12", armure: 0, vitesse: 5, portee: 8, degatsFT: 2, stats: {align: -10}, prerequis: {}, lootable: true, nbUsages: null },

    "AF11": { nom: "Fusil précis ", desc: "Fusil long canon.", type: "arme_feu", rarete: "6", poids: 3.5, prix: 150, equipable: "deux_mains", stackable: false, degats: "8-16", armure: 0, vitesse: 6, portee: 20, degatsFT: 2, stats: {align: -15}, prerequis: {}, lootable: true, nbUsages: null },

    "AF12": { nom: "Fusil Clarington", desc: "Fusil de haute qualité.", type: "arme_feu", rarete: "7", poids: 4.0, prix: 300, equipable: "deux_mains", stackable: false, degats: "10-15", armure: 6, vitesse: 15, portee: 15, degatsFT: 2, stats: {align: -20}, prerequis: {}, lootable: true, nbUsages: null },

    "AF13": { nom: "Pistolet chic", desc: "Arme de noble.", type: "arme_feu", rarete: "3", poids: 1.5, prix: 200, equipable: "main_droite", stackable: false, degats: "4-12", armure: 0, vitesse: 5, portee: 12, degatsFT: 2, stats: {align: -5, CH:1}, prerequis: {}, lootable: true, nbUsages: null },
    "AF14": { nom: "Pistolet de Bronwyck", desc: "Pistolet unique combinant précision et puissance dévastatrice.", type: "arme_feu", rarete: "8", poids: 0.9, prix: 900, equipable: "main_droite", stackable: false, degats: "1-4", armure: 0, vitesse: 6, portee: 10, degatsFT: 2, stats: { align: -15 }, prerequis: { DX: 8 }, lootable: true, nbUsages: null },
    "AF15": { nom: "Destructor de Droch", desc: "Fusil de guerre vendigrothien modifié. Puissance maximale.", type: "arme_feu", rarete: "10", poids: 0.8, prix: 2500, equipable: "deux_mains", stackable: false, degats: "20-40", armure: 0, vitesse: 8, portee: 15, degatsFT: 5, stats: { align: -30 }, prerequis: { DX: 10, FO: 8 }, lootable: true, nbUsages: null },
    "AF16": { nom: "Fusil de chasse standard", desc: "Fusil polyvalent pour la chasse et le combat rapproché.", type: "arme_feu", rarete: "4", poids: 1.2, prix: 120, equipable: "deux_mains", stackable: false, degats: "2-14", armure: 0, vitesse: 6, portee: 15, degatsFT: 5, stats: { align: -10 }, prerequis: { DX: 7 }, lootable: true, nbUsages: null },
    "AF17": { nom: "Grand fusil vendigrothien", desc: "Fusil de gros calibre des ruines de Vendigroth.", type: "arme_feu", rarete: "8", poids: 1.1, prix: 1200, equipable: "deux_mains", stackable: false, degats: "5-25", armure: 0, vitesse: 5, portee: 15, degatsFT: 4, stats: { align: -20 }, prerequis: { DX: 9, FO: 7 }, lootable: true, nbUsages: null },
    "AF18": { nom: "Vieux pistolet à silex", desc: "Pistolet antique peu précis. Mieux que rien.", type: "arme_feu", rarete: "2", poids: 0.7, prix: 30, equipable: "main_droite", stackable: false, degats: "1-5", armure: 0, vitesse: 2, portee: 5, degatsFT: 1, stats: { align: -5 }, prerequis: {}, lootable: true, nbUsages: null },
    "AF19": { nom: "Fusil rouillé", desc: "Fusil corrodé dont le canon risque d'exploser à tout moment.", type: "arme_feu", rarete: "1", poids: 1.2, prix: 15, equipable: "deux_mains", stackable: false, degats: "1-10", armure: 0, vitesse: 4, portee: 15, degatsFT: 1, stats: { align: -5 }, prerequis: {}, lootable: true, nbUsages: null },








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
        stats: { resMagie: 15, resPhys: 10, align: 15 }, prerequis: { DX: 8 }, lootable: true, nbUsages: null
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
        stats: {resPhys : 10 }, prerequis: {}, lootable: true, nbUsages: null
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
        nom: "Uniforme de soldat", desc: "Tenue réglementaire des gardes de Tarante.",
        type: "armure", rarete: "5", poids: 5.0, prix: 150,
        equipable: "torse", stackable: false, degats: "0", armure: 10, vitesse: 0, portee: 0,
        stats: { resPhys: 5 }, prerequis: { FO: 8 }, lootable: true, nbUsages: null
    },
    "DEF10": {
        nom: "Robe élégante", desc: "Faite d'une soie fine. Très prisée dans les hautes sphères.",
        type: "armure", rarete: "6", poids: 1.0, prix: 200,
        equipable: "torse", stackable: false, degats: "0", armure: 2, vitesse: 0, portee: 0,
        stats: { resMagie: 5 , CH:1 }, prerequis: {}, lootable: true, nbUsages: null
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
        equipable: "gants", stackable: false, degats: "1", armure: 4, vitesse: 0, portee: 0,
        stats: { align: -5 }, prerequis: { FO: 8 }, lootable: false, nbUsages: null
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
        stats: { resPhys: 15,  }, prerequis: { FO: 9 }, lootable: false, nbUsages: null
    },
    "DEF15": {
        nom: "Cuirasse d'élite", desc: "L'armure de plaques technologique la plus aboutie.",
        type: "armure", rarete: "9", poids: 8.0, prix: 2000,
        equipable: "torse", stackable: false, degats: "0", armure: 25, vitesse: -1, portee: 0,
        stats: { resPhys: 30, resFeu: 15}, prerequis: { FO: 12 }, lootable: false, nbUsages: null
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
        stats: { align: -30, bonusComp: { marchandage :4, crochetage:4, detection_piege:4 } }, prerequis: {}, lootable: false, nbUsages: null // Bonus perception
    },
	
	
	    "DEF23": { nom: "Paire de lunettes", desc: "Verres correcteurs.", type: "armure", rarete: "3", poids: 0.1, prix: 25, equipable: "tete", stackable: false, degats: "0", armure: 1, vitesse: 0, portee: 0, stats: {bonusComp: { marchandage : 1}}, prerequis: {}, lootable: true, nbUsages: null },

	
	
	
	    "DEF24": {
        nom: "Lampe électrique", desc: "Lanterne à filament offrant un éclairage propre et constant.",
        type: "armure", rarete: "4", poids: 1.0, prix: 100,
        equipable: "main_gauche", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -10, bonusComp: { detection_piege:4 } }, prerequis: {}, lootable: false, nbUsages: null
    },
	
	
	    "DEF25": { nom: "lanterne", desc: "Lampe à huile classique.", type: "armure", rarete: "2", poids: 1.0, prix: 15, equipable: "main_gauche", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {bonusComp: { detection_piege:2 }}, prerequis: {}, lootable: true, nbUsages: null },

	
	    "DEF26": {
        nom: "Spectromètre de flux", desc: "Appareil sensible détectant les perturbations magiques.",
        type: "armure", rarete: "7", poids: 1.5, prix: 600,
        equipable: "main_gauche", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -10, resFeu: 5 , resElec: 5 , resMagie: 5 }, prerequis: {}, lootable: false, nbUsages: null
    },

    // --- Armures de plaques (torse) ---
    "DEF27": { nom: "Armure de plaques", desc: "Armure complète de plaques d'acier forgé.", type: "armure", rarete: "6", poids: 10.0, prix: 400, equipable: "torse", stackable: false, degats: "0", armure: 15, vitesse: -1, portee: 0, stats: { resPhys: 36, resFeu: 10, resElec: -20, align: -40 }, prerequis: { FO: 10 }, lootable: true, nbUsages: null },
    "DEF28": { nom: "Armure de plaques usinée", desc: "Plaques d'acier façonnées à la machine, plus résistantes.", type: "armure", rarete: "7", poids: 10.0, prix: 600, equipable: "torse", stackable: false, degats: "0", armure: 20, vitesse: -1, portee: 0, stats: { resPhys: 30, resFeu: 10, resElec: -20, align: -40 }, prerequis: { FO: 11 }, lootable: true, nbUsages: null },
    "DEF29": { nom: "Armure de plaques bronzées", desc: "Plaques traitées au bronze offrant une excellente résistance au feu.", type: "armure", rarete: "7", poids: 10.0, prix: 500, equipable: "torse", stackable: false, degats: "0", armure: 15, vitesse: -1, portee: 0, stats: { resPhys: 36, resFeu: 30, resElec: -10, align: -40 }, prerequis: { FO: 10 }, lootable: true, nbUsages: null },
    "DEF30": { nom: "Cotte de mailles standard", desc: "Mailles d'acier entrelacées, protection polyvalente.", type: "armure", rarete: "5", poids: 5.0, prix: 250, equipable: "torse", stackable: false, degats: "0", armure: 12, vitesse: 0, portee: 0, stats: { resPhys: 23, resFeu: 5, resElec: -10, align: -12 }, prerequis: { FO: 8 }, lootable: true, nbUsages: null },
    "DEF31": { nom: "Cotte de mailles naine", desc: "Mailles forgées selon les techniques secrètes des nains.", type: "armure", rarete: "7", poids: 6.5, prix: 600, equipable: "torse", stackable: false, degats: "0", armure: 14, vitesse: 0, portee: 0, stats: { resPhys: 27, resFeu: 10, resElec: -20, align: -12 }, prerequis: { FO: 9 }, lootable: true, nbUsages: null },
    "DEF32": { nom: "Armure de plaques naine", desc: "Armure naine à la robustesse légendaire.", type: "armure", rarete: "8", poids: 13.0, prix: 900, equipable: "torse", stackable: false, degats: "0", armure: 17, vitesse: -1, portee: 0, stats: { resPhys: 40, resFeu: 15, resElec: -20, align: -40 }, prerequis: { FO: 12 }, lootable: true, nbUsages: null },
    "DEF33": { nom: "Cuir de dragon", desc: "Armure en peau de dragon tannée, légère et résistante au feu.", type: "armure", rarete: "8", poids: 3.5, prix: 1200, equipable: "torse", stackable: false, degats: "0", armure: 9, vitesse: 0, portee: 0, stats: { resPhys: 16, resFeu: 30, align: -5 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF34": { nom: "Armure de terreur", desc: "Armure noire intimidante portée par les gardes d'élite.", type: "armure", rarete: "8", poids: 10.0, prix: 700, equipable: "torse", stackable: false, degats: "0", armure: 19, vitesse: -1, portee: 0, stats: { resPhys: 5, resFeu: 5, align: -10 }, prerequis: { FO: 10 }, lootable: true, nbUsages: null },
    "DEF35": { nom: "Armure de maraude", desc: "Armure légère taillée pour les rôdeurs et voleurs. Bonus à la discrétion.", type: "armure", rarete: "5", poids: 2.0, prix: 300, equipable: "torse", stackable: false, degats: "0", armure: 10, vitesse: 0, portee: 0, stats: { resPhys: 5, resFeu: 5, bonusComp: { discretion: 3, attaque_sournoise: 2 } }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF36": { nom: "Armure de cuir magique", desc: "Cuir enchantée repoussant les sorts.", type: "armure", rarete: "7", poids: 4.0, prix: 800, equipable: "torse", stackable: false, degats: "0", armure: 9, vitesse: 0, portee: 0, stats: { resPhys: 16, resMagie: 10, resPoison: 10 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF37": { nom: "Cotte de mailles en mithril", desc: "Mailles d'une légèreté extraordinaire forgées dans le métal légendaire.", type: "armure", rarete: "9", poids: 1.5, prix: 1500, equipable: "torse", stackable: false, degats: "0", armure: 12, vitesse: 0, portee: 0, stats: { resPhys: 23, resMagie: 5, resFeu: 5 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF38": { nom: "Cotte de mailles mystique", desc: "Armure de mailles imprégnée d'énergie mystique.", type: "armure", rarete: "8", poids: 5.0, prix: 1100, equipable: "torse", stackable: false, degats: "0", armure: 12, vitesse: 0, portee: 0, stats: { resPhys: 15, resMagie: 15, resPoison: 15, resFeu: 15, resElec: -5, align: 10 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF39": { nom: "Armure mystique de plaques", desc: "Armure de plaques renforcée par des enchantements de protection.", type: "armure", rarete: "9", poids: 10.0, prix: 1400, equipable: "torse", stackable: false, degats: "0", armure: 15, vitesse: -1, portee: 0, stats: { resPhys: 8, resMagie: 8, resPoison: 8, resFeu: 8, resElec: 8, align: -30 }, prerequis: { FO: 10 }, lootable: true, nbUsages: null },
    "DEF40": { nom: "Cuir clouté", desc: "Armure de cuir garnie de clous métalliques pour dévier les lames.", type: "armure", rarete: "4", poids: 4.5, prix: 180, equipable: "torse", stackable: false, degats: "0", armure: 10, vitesse: 0, portee: 0, stats: { resPhys: 18, resFeu: 5 }, prerequis: { FO: 6 }, lootable: true, nbUsages: null },
    "DEF41": { nom: "Cotte de mailles huilée", desc: "Mailles lubrifiées pour une meilleure résistance aux chocs.", type: "armure", rarete: "5", poids: 5.0, prix: 280, equipable: "torse", stackable: false, degats: "0", armure: 12, vitesse: 0, portee: 0, stats: { resPhys: 23, resFeu: 5, resElec: -10 }, prerequis: { FO: 8 }, lootable: true, nbUsages: null },

    // --- Vêtements & Robes (torse) ---
    "DEF42": { nom: "Robes arcanes", desc: "Robes imprégnées d'énergie arcanique. Protection magique remarquable.", type: "armure", rarete: "9", poids: 0.5, prix: 1200, equipable: "torse", stackable: false, degats: "0", armure: 3, vitesse: 0, portee: 0, stats: { resPhys: 3, resMagie: 50, resPoison: 50, resFeu: 50, resElec: 50, align: 20 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF43": { nom: "Robes de magie", desc: "Robes de mage renforçant la résistance aux sorts.", type: "armure", rarete: "6", poids: 0.5, prix: 500, equipable: "torse", stackable: false, degats: "0", armure: 5, vitesse: 0, portee: 0, stats: { resPhys: 7, resFeu: 3, resMagie: 10, align: 15 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF44": { nom: "Robes d'ombre", desc: "Robes sombres conçues pour se fondre dans la nuit.", type: "armure", rarete: "5", poids: 0.5, prix: 350, equipable: "torse", stackable: false, degats: "0", armure: 5, vitesse: 0, portee: 0, stats: { resPhys: 7, resFeu: 3, bonusComp: { discretion: 2 } }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF45": { nom: "Robes de prêtre", desc: "Habit sacré des ministres du culte. Fragile face au feu.", type: "armure", rarete: "3", poids: 0.5, prix: 120, equipable: "torse", stackable: false, degats: "0", armure: 3, vitesse: 0, portee: 0, stats: { resPhys: 2, resFeu: -15, align: 15 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF46": { nom: "Cape mystique du voyageur", desc: "Cape de voyage imprégnée de sorts de protection.", type: "armure", rarete: "8", poids: 0.6, prix: 900, equipable: "torse", stackable: false, degats: "0", armure: 3, vitesse: 0, portee: 0, stats: { resPhys: 15, resMagie: 15, resPoison: 15, resFeu: 15, resElec: 15, align: 20 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF47": { nom: "Vêtement anti-venin", desc: "Tissu traité pour neutraliser les substances toxiques.", type: "armure", rarete: "6", poids: 0.5, prix: 400, equipable: "torse", stackable: false, degats: "0", armure: 4, vitesse: 0, portee: 0, stats: { resPhys: 5, resPoison: 80, resFeu: 3 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF48": { nom: "Veste en laine épaisse", desc: "Veste en laine dense offrant chaleur et résistance.", type: "armure", rarete: "3", poids: 1.0, prix: 60, equipable: "torse", stackable: false, degats: "0", armure: 7, vitesse: 0, portee: 0, stats: { resPhys: 12 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF49": { nom: "Robe enchantée", desc: "Robe fine aux broderies lumineuses. Résistante au feu.", type: "armure", rarete: "5", poids: 0.4, prix: 280, equipable: "torse", stackable: false, degats: "0", armure: 2, vitesse: 0, portee: 0, stats: { resPhys: 1, resFeu: 30, align: 10 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF50": { nom: "Vêtement de résistance", desc: "Vêtement traité pour résister aux éléments magiques.", type: "armure", rarete: "5", poids: 0.5, prix: 320, equipable: "torse", stackable: false, degats: "0", armure: 2, vitesse: 0, portee: 0, stats: { resFeu: 10, resMagie: 10 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF51": { nom: "Habit de smoking", desc: "Veste de soirée élégante. Met en valeur son porteur.", type: "armure", rarete: "3", poids: 0.5, prix: 150, equipable: "torse", stackable: false, degats: "0", armure: 2, vitesse: 0, portee: 0, stats: { CH: 2 }, prerequis: {}, lootable: true, nbUsages: null },

    // --- Casques (tete) ---
    "DEF52": { nom: "Heaume sombre", desc: "Casque noir imposant aux runes maudites.", type: "armure", rarete: "6", poids: 2.0, prix: 300, equipable: "tete", stackable: false, degats: "0", armure: 6, vitesse: 0, portee: 0, stats: { resPhys: 9, align: -20 }, prerequis: { FO: 8 }, lootable: true, nbUsages: null },
    "DEF53": { nom: "Grand heaume", desc: "Casque de tournoi lourd offrant une protection maximale.", type: "armure", rarete: "5", poids: 4.0, prix: 200, equipable: "tete", stackable: false, degats: "0", armure: 3, vitesse: 0, portee: 0, stats: { resPhys: 7 }, prerequis: { FO: 9 }, lootable: true, nbUsages: null },
    "DEF54": { nom: "Casque de force", desc: "Casque renforcé développé par les armuriers de Tarant.", type: "armure", rarete: "5", poids: 2.5, prix: 250, equipable: "tete", stackable: false, degats: "0", armure: 2, vitesse: 0, portee: 0, stats: { resPhys: 15, align: -5 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF55": { nom: "Heaume de lumière", desc: "Casque équipé d'une petite lampe frontale. Idéal en souterrain.", type: "armure", rarete: "4", poids: 2.0, prix: 180, equipable: "tete", stackable: false, degats: "0", armure: 3, vitesse: 0, portee: 0, stats: { resPhys: 7, bonusComp: { detection_piege: 2 }, align: -5 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF56": { nom: "Casque de mineur", desc: "Casque à lampe électrique des mineurs nains.", type: "armure", rarete: "5", poids: 2.5, prix: 220, equipable: "tete", stackable: false, degats: "0", armure: 15, vitesse: 0, portee: 0, stats: { bonusComp: { detection_piege: 3 }, align: -10 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF57": { nom: "Bassinet à visière", desc: "Casque de guerre à nasale protégeant le visage.", type: "armure", rarete: "5", poids: 2.5, prix: 220, equipable: "tete", stackable: false, degats: "0", armure: 10, vitesse: 0, portee: 0, stats: { resPhys: 12 }, prerequis: { FO: 7 }, lootable: true, nbUsages: null },
    "DEF58": { nom: "Heaume de Geleam", desc: "Heaume ancien aux enchantements protecteurs de l'elfe Geleam.", type: "armure", rarete: "7", poids: 1.5, prix: 600, equipable: "tete", stackable: false, degats: "0", armure: 3, vitesse: 0, portee: 0, stats: { resPhys: 7, resMagie: 5 }, prerequis: {}, lootable: true, nbUsages: null },

    // --- Bottes (bottes) ---
    "DEF59": { nom: "Bottes simples", desc: "Solides bottes en cuir du quotidien.", type: "armure", rarete: "2", poids: 1.0, prix: 30, equipable: "bottes", stackable: false, degats: "0", armure: 1, vitesse: 0, portee: 0, stats: { resPhys: 5 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF60": { nom: "Bottes elfiques", desc: "Bottes légères de fabrication elfique permettant un pas silencieux.", type: "armure", rarete: "6", poids: 0.5, prix: 350, equipable: "bottes", stackable: false, degats: "0", armure: 1, vitesse: 0, portee: 0, stats: { resPhys: 5, resPoison: 25, bonusComp: { discretion: 2 } }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF61": { nom: "Bottes de guerre enchantées", desc: "Bottes militaires renforcées et enchantées.", type: "armure", rarete: "6", poids: 1.5, prix: 400, equipable: "bottes", stackable: false, degats: "0", armure: 5, vitesse: 0, portee: 0, stats: { resPhys: 6, align: -5 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF62": { nom: "Bottes solides", desc: "Bottes de qualité supérieure à semelles épaisses.", type: "armure", rarete: "4", poids: 1.0, prix: 120, equipable: "bottes", stackable: false, degats: "0", armure: 1, vitesse: 0, portee: 0, stats: { resPhys: 8 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF63": { nom: "Bottes en métal", desc: "Bottes à coque métallique. Lourdes mais quasi indestructibles.", type: "armure", rarete: "5", poids: 3.0, prix: 200, equipable: "bottes", stackable: false, degats: "0", armure: 1, vitesse: -1, portee: 0, stats: { resPhys: 10, align: -5 }, prerequis: { FO: 7 }, lootable: true, nbUsages: null },
    "DEF64": { nom: "Chaussures", desc: "Simples chaussures de ville. Peu protectrices.", type: "armure", rarete: "1", poids: 0.5, prix: 10, equipable: "bottes", stackable: false, degats: "0", armure: 1, vitesse: 0, portee: 0, stats: { resPhys: 2 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF65": { nom: "Bottes des ténèbres", desc: "Bottes maudites qui accélèrent leur porteur en consumant son énergie.", type: "armure", rarete: "7", poids: 1.0, prix: 500, equipable: "bottes", stackable: false, degats: "0", armure: 1, vitesse: 0, portee: 0, stats: { DX: 2, FT: -5 }, prerequis: {}, lootable: true, nbUsages: null },

    // --- Gants (gants) ---
    "DEF66": { nom: "Gants de mailles", desc: "Gants en cotte de mailles protégeant les mains.", type: "armure", rarete: "4", poids: 0.3, prix: 80, equipable: "gants", stackable: false, degats: "0", armure: 4, vitesse: 0, portee: 0, stats: { resPhys: 6 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF67": { nom: "Gantelets ensorcelés", desc: "Gantelets enchantés offrant protection et légèreté.", type: "armure", rarete: "6", poids: 0.5, prix: 350, equipable: "gants", stackable: false, degats: "0", armure: 2, vitesse: 0, portee: 0, stats: { resPhys: 5, resMagie: 3 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF68": { nom: "Gantelets", desc: "Gants de métal standard pour guerriers.", type: "armure", rarete: "3", poids: 0.8, prix: 60, equipable: "gants", stackable: false, degats: "1", armure: 1, vitesse: 0, portee: 0, stats: { resPhys: 5 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF69": { nom: "Gants de dextérité", desc: "Gants de soie elfique amplifiant les mouvements fins.", type: "armure", rarete: "6", poids: 0.1, prix: 400, equipable: "gants", stackable: false, degats: "0", armure: 3, vitesse: 0, portee: 0, stats: { DX: 2 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF70": { nom: "Gantelets de chapardeur", desc: "Gants agiles à doigts fins. Idéaux pour les pickpockets.", type: "armure", rarete: "6", poids: 0.3, prix: 450, equipable: "gants", stackable: false, degats: "0", armure: 5, vitesse: 0, portee: 0, stats: { bonusComp: { vol_a_la_tire: 3, crochetage: 2 } }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF71": { nom: "Gantelets usinés", desc: "Gants métalliques fabriqués à la machine avec haute précision.", type: "armure", rarete: "7", poids: 1.0, prix: 600, equipable: "gants", stackable: false, degats: "2", armure: 5, vitesse: 0, portee: 0, stats: { resPhys: 7, align: -10 }, prerequis: {}, lootable: false, nbUsages: null },
    "DEF72": { nom: "Gantelets de guerre vendigrothiens", desc: "Gants de combat de l'ère Vendigrothienne. Puissance brute.", type: "armure", rarete: "9", poids: 1.2, prix: 1200, equipable: "gants", stackable: false, degats: "3", armure: 15, vitesse: 0, portee: 0, stats: { align: -15 }, prerequis: { FO: 10 }, lootable: true, nbUsages: null },
    "DEF73": { nom: "Gantelets de guerre", desc: "Gantelets de bataille éprouvés sur le champ d'honneur.", type: "armure", rarete: "5", poids: 1.2, prix: 250, equipable: "gants", stackable: false, degats: "2", armure: 6, vitesse: 0, portee: 0, stats: { resPhys: 8 }, prerequis: { FO: 8 }, lootable: true, nbUsages: null },

    // --- Boucliers (main_gauche) ---
    "DEF74": { nom: "Bouclier de givre", desc: "Bouclier enchantement protégeant de tous les éléments. Pénalisant physiquement.", type: "armure", rarete: "8", poids: 8.0, prix: 1000, equipable: "main_gauche", stackable: false, degats: "0", armure: 8, vitesse: -2, portee: 0, stats: { resPhys: 20, resMagie: 20, resFeu: 20, resElec: 20, resPoison: 20, FO: -3, DX: -3 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF75": { nom: "Bouclier de fer cabossé", desc: "Bouclier d'acier abîmé mais encore solide.", type: "armure", rarete: "2", poids: 5.0, prix: 40, equipable: "main_gauche", stackable: false, degats: "0", armure: 18, vitesse: -1, portee: 0, stats: {}, prerequis: { FO: 7 }, lootable: true, nbUsages: null },
    "DEF76": { nom: "Écu", desc: "Bouclier en goutte allongé offrant une excellente couverture.", type: "armure", rarete: "4", poids: 5.0, prix: 150, equipable: "main_gauche", stackable: false, degats: "0", armure: 20, vitesse: -1, portee: 0, stats: {}, prerequis: { FO: 8 }, lootable: true, nbUsages: null },
    "DEF77": { nom: "Bouclier de fer de qualité", desc: "Bouclier en acier forgé d'excellente facture.", type: "armure", rarete: "6", poids: 5.0, prix: 350, equipable: "main_gauche", stackable: false, degats: "0", armure: 30, vitesse: -1, portee: 0, stats: {}, prerequis: { FO: 9 }, lootable: true, nbUsages: null },
    "DEF78": { nom: "Bouclier hurlant", desc: "Bouclier enchantée émettant un cri dévastateur à chaque impact.", type: "armure", rarete: "8", poids: 5.0, prix: 1000, equipable: "main_gauche", stackable: false, degats: "0", armure: 30, vitesse: -1, portee: 0, stats: { resPhys: 10, align: 5 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF79": { nom: "Bouclier des ombres", desc: "Bouclier sombre dont la résistance croît avec le mal de son porteur.", type: "armure", rarete: "7", poids: 4.5, prix: 700, equipable: "main_gauche", stackable: false, degats: "0", armure: 10, vitesse: -1, portee: 0, stats: { align: -10 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF80": { nom: "Bouclier de force", desc: "Bouclier magique renvoyant une partie des dégâts à l'attaquant.", type: "armure", rarete: "9", poids: 4.5, prix: 1200, equipable: "main_gauche", stackable: false, degats: "0", armure: 30, vitesse: -1, portee: 0, stats: { align: 10 }, prerequis: {}, lootable: true, nbUsages: null },
    "DEF81": { nom: "Bouclier trempé", desc: "Bouclier de forge trempé dans une solution spéciale, résistant aux coups.", type: "armure", rarete: "7", poids: 4.0, prix: 600, equipable: "main_gauche", stackable: false, degats: "0", armure: 30, vitesse: -1, portee: 0, stats: { resPhys: 10 }, prerequis: { FO: 8 }, lootable: true, nbUsages: null },
    "DEF82": { nom: "Bouclier en bois", desc: "Bouclier en bois robuste, simple mais efficace.", type: "armure", rarete: "2", poids: 4.5, prix: 50, equipable: "main_gauche", stackable: false, degats: "0", armure: 15, vitesse: -1, portee: 0, stats: {}, prerequis: { FO: 6 }, lootable: true, nbUsages: null },
	
	
	
	
	
	

    // ---------------- BIJOUX & ACCESSOIRES (BIJ) ----------------
    "BIJ01": {
        nom: "Anneau électroactif", desc: "Anneau de cuivre boostant la puissance et les réflexes.",
        type: "armure", rarete: "6", poids: 0.1, prix: 500,
        equipable: "anneau", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { align: -15, DX:2, FO:2 }, prerequis: {}, lootable: false, nbUsages: null // Bonus à coder
    },
	    "BIJ02": { nom: "Anneau de cuivre", desc: "Bijou brillant.", type: "armure", rarete: "2", poids: 0.1, prix: 45, equipable: "anneau", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
	    "BIJ03": { nom: "Anneau de argent", desc: "Bijou brillant.", type: "armure", rarete: "4", poids: 0.1, prix: 145, equipable: "anneau", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
	    "BIJ04": { nom: "Anneau en or", desc: "Bijou brillant.", type: "armure", rarete: "6", poids: 0.1, prix: 345, equipable: "anneau", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },

    // --- Anneaux (stats) ---
    "BIJ05": { nom: "Anneau arcane", desc: "Anneau impregné de magie pure, résistant à tous les éléments.", type: "armure", rarete: "9", poids: 0.05, prix: 1200, equipable: "anneau", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { resPoison: 20, resFeu: 20, resElec: 20, resMagie: 20, align: 20 }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ06": { nom: "Anneau chargé", desc: "Anneau à bobine électromagnétique amplifiant les réflexes.", type: "armure", rarete: "5", poids: 0.05, prix: 350, equipable: "anneau", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { DX: 2, align: -15 }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ07": { nom: "Anneau ensorcelé", desc: "Anneau aux enchantements de protection élémentaire.", type: "armure", rarete: "6", poids: 0.05, prix: 500, equipable: "anneau", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { resPoison: 5, resFeu: 5, resElec: 5, resMagie: 5, align: 10 }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ08": { nom: "Anneau du destin", desc: "Anneau qui semble aiguiser le sens du risque et de la chance.", type: "armure", rarete: "7", poids: 0.05, prix: 600, equipable: "anneau", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { resMagie: 5, align: 10 }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ09": { nom: "Anneau mystique", desc: "Anneau aux puissants enchantements de résistance mystique.", type: "armure", rarete: "8", poids: 0.05, prix: 900, equipable: "anneau", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { resPoison: 15, resFeu: 15, resElec: 15, resMagie: 15, align: 15 }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ10": { nom: "Anneau du négociateur", desc: "Anneau utilisé par les diplomates pour faciliter les tractations.", type: "armure", rarete: "5", poids: 0.05, prix: 400, equipable: "anneau", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { resMagie: 10, align: 10 }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ11": { nom: "Anneau de dissimulation", desc: "Anneau aux propriétés d'ombre facilitant la discrétion.", type: "armure", rarete: "5", poids: 0.05, prix: 350, equipable: "anneau", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { bonusComp: { discretion: 2 } }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ12": { nom: "Anneau de magie noire", desc: "Anneau maudit amplifiant la puissance magique au détriment des résistances.", type: "armure", rarete: "7", poids: 0.05, prix: 600, equipable: "anneau", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { IN: 1, resMagie: 20, resPoison: -50, resFeu: -50, resElec: -50, align: -5 }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ13": { nom: "Anneau d'influence", desc: "Anneau amplifiant le charme naturel et les talents de persuasion.", type: "armure", rarete: "7", poids: 0.05, prix: 650, equipable: "anneau", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { CH: 3, bonusComp: { marchandage: 3 }, align: 10 }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ14": { nom: "Anneau de résistance au poison", desc: "Anneau conférant une protection naturelle contre les venins.", type: "armure", rarete: "6", poids: 0.05, prix: 450, equipable: "anneau", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { resPoison: 20, align: 10 }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ15": { nom: "Anneau de protection", desc: "Anneau enchanté conférant une légère armure magique.", type: "armure", rarete: "5", poids: 0.05, prix: 350, equipable: "anneau", stackable: false, degats: "0", armure: 2, vitesse: 0, portee: 0, stats: { resMagie: 5, align: 10 }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ16": { nom: "Anneau des ombres", desc: "Anneau maudit rendant son porteur quasi invisible mais le consumant.", type: "armure", rarete: "8", poids: 0.05, prix: 800, equipable: "anneau", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { bonusComp: { discretion: 5, attaque_sournoise: 3 }, FT: -10, align: -15 }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ17": { nom: "Anneau de virilité", desc: "Anneau renforçant la robustesse et la vitalité de son porteur.", type: "armure", rarete: "4", poids: 0.05, prix: 250, equipable: "anneau", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { CN: 2 }, prerequis: {}, lootable: true, nbUsages: null },

    // --- Amulettes & Médaillons (cou) ---
    "BIJ20": { nom: "Amulette de K'an-el", desc: "Amulette elfique aux propriétés vitalisantes portée par les anciens.", type: "armure", rarete: "8", poids: 0.05, prix: 900, equipable: "amulette", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { CN: 4, align: 15 }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ21": { nom: "Amulette de N'Tala", desc: "Amulette de guérison accélérant la récupération naturelle.", type: "armure", rarete: "8", poids: 0.05, prix: 1000, equipable: "amulette", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { FO: 1, CN: 1, align: 15 }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ22": { nom: "Collier de Cassie", desc: "Collier d'une servante, aux propriétés magiques surprenantes.", type: "armure", rarete: "6", poids: 0.05, prix: 400, equipable: "amulette", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { resMagie: 40 }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ23": { nom: "Médaillon charmant", desc: "Médaillon aux enchantements de résistance magique.", type: "armure", rarete: "6", poids: 0.05, prix: 450, equipable: "amulette", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { resMagie: 10, align: 10 }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ24": { nom: "Amulette Dorienne", desc: "Amulette ornée aux propriétés défensives.", type: "armure", rarete: "7", poids: 0.05, prix: 600, equipable: "amulette", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { resMagie: 40, align: 10 }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ25": { nom: "Médaillon de l'enfer", desc: "Médaillon maudit brûlant en combat. Ne pas porter à la légère.", type: "armure", rarete: "7", poids: 0.05, prix: 500, equipable: "amulette", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { resFeu: 20, align: -15 }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ26": { nom: "Joyau d'Hébé", desc: "Pierre précieuse aux reflets divins amplifiant le charme.", type: "armure", rarete: "7", poids: 0.05, prix: 650, equipable: "amulette", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { CH: 1 }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ27": { nom: "Médaillon de chance", desc: "Médaillon porte-bonheur des joueurs et marchands.", type: "armure", rarete: "4", poids: 0.05, prix: 200, equipable: "amulette", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { bonusComp: { marchandage: 2 } }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ28": { nom: "Médaillon de beauté", desc: "Médaillon enchanté rehaussant l'aura de beauté naturelle.", type: "armure", rarete: "5", poids: 0.05, prix: 300, equipable: "amulette", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { CH: 1, align: 10 }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ29": { nom: "Médaillon de magie noire", desc: "Médaillon maudit amplifiant la puissance magique au prix des défenses physiques.", type: "armure", rarete: "7", poids: 0.05, prix: 600, equipable: "amulette", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { resMagie: 20, resPhys: -50, align: -10 }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ30": { nom: "Médaillon de silence", desc: "Médaillon aux propriétés d'étouffement sonore.", type: "armure", rarete: "5", poids: 0.05, prix: 350, equipable: "amulette", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { bonusComp: { discretion: 3 }, align: 10 }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ31": { nom: "Collier de la Reine K'na S'ea", desc: "Joyau royal d'une beauté incomparable.", type: "armure", rarete: "9", poids: 0.05, prix: 1500, equipable: "amulette", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { CH: 2, align: 20 }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ32": { nom: "Amulette de Pelojian", desc: "Amulette de mage aux propriétés de résistance magique.", type: "armure", rarete: "7", poids: 0.05, prix: 700, equipable: "amulette", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { resMagie: 40, align: 15 }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ33": { nom: "Collier serpentin", desc: "Collier à venin de serpent. Dangereux mais fascinant.", type: "armure", rarete: "6", poids: 0.05, prix: 400, equipable: "amulette", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { resPoison: 30, align: -10 }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ34": { nom: "Doigt de Mannox", desc: "Relique macabre conférant une précision au corps-à-corps et une résistance au poison.", type: "armure", rarete: "8", poids: 0.05, prix: 800, equipable: "amulette", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { resPoison: 20, bonusComp: { melee: 2 } }, prerequis: {}, lootable: true, nbUsages: null },
    "BIJ35": { nom: "Amulette de la main", desc: "Étrange amulette gravée du symbole d'une main.", type: "armure", rarete: "2", poids: 0.05, prix: 800, equipable: "amulette", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: { resMagie: 10 }, prerequis: {}, lootable: false, nbUsages: null },


    // ---------------- MUNITIONS (MUN) ----------------
    "MUN01": {
		nom: "Balles", desc: "Munitions produites à partir de salpêtre et de charbon.",
        type: "munition", rarete: "2", poids: 0.01, prix: 5,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: true, nbUsages: null
    },
    "MUN02": {
        nom: "Flèche", desc: "Flèche empennée basique.",
        type: "munition", rarete: "2", poids: 0.05, prix: 5,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: true, nbUsages: null
    },


    // ---------------- CONSOMMABLES & EXPLOSIFS (CONS) ----------------
    "TEC01": {
        nom: "Cocktail Molotov", desc: "Bouteille inflammable. Explose à l'impact.",
        type: "explosif", rarete: "6", poids: 0.5, prix: 100,
        equipable: "main_droite", stackable: true, degats: "4-16", armure: 0, vitesse: 8, portee: 8,
        stats: {  }, prerequis: { DX: 6 }, lootable: true, nbUsages: 1
    },
    "TEC02": {
        nom: "Dynamite", desc: "Bâton explosif puissant. Ne restez pas à côté.",
        type: "explosif", rarete: "7", poids: 1.0, prix: 150,
        equipable: "main_droite", stackable: true, degats: "10-30", armure: 0, vitesse: 5, portee: 6,
        stats: { }, prerequis: {}, lootable: true, nbUsages: 1
    },
    "CONS03": {
        nom: "Potion de soin", desc: "Un liquide rouge effervescent qui referme les plaies.",
        type: "consommable", rarete: "3", poids: 0.5, prix: 50,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinPV: 15 }, prerequis: {}, lootable: true, nbUsages: 1
    },
    "CONS04": {
        nom: "Potion d'énergie", desc: "Restaure la fatigue accumulée. Goût de menthe forte.",
        type: "consommable", rarete: "3", poids: 0.5, prix: 50,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinFT: 15 }, prerequis: {}, lootable: true, nbUsages: 1
    },
    // --- Botanique & Thérapeutique (Craft) ---
    "CONS05": {
        nom: "Elixir de soins légers", desc: "Médicament de base pour soigner les blessures légères.",
        type: "consommable", rarete: "3", poids: 0.2, prix: 60,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinPV: 15 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS06": {
        nom: "Stimulant", desc: "Produit augmentant temporairement les capacités physiques.",
        type: "consommable", rarete: "5", poids: 0.2, prix: 120,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { }, prerequis: {}, lootable: false, nbUsages: 1 // Bonus à coder
    },
    "CONS07": {
        nom: "Antidote", desc: "Substance permettant de neutraliser les effets du poison.",
        type: "consommable", rarete: "4", poids: 0.2, prix: 80,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { curePoison: true }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS08": {
        nom: "Limiteur de fatigue", desc: "Préparation réduisant la perte de points de fatigue.",
        type: "consommable", rarete: "6", poids: 0.2, prix: 150,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinFT: 20 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS09": {
        nom: "Accélérateur de guérison", desc: "Accélère la régénération naturelle des tissus.",
        type: "consommable", rarete: "7", poids: 0.2, prix: 200,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: false, nbUsages: 1 // Regen à coder
    },
    "CONS10": {
        nom: "Drogue merveilleuse", desc: "Elixir puissant aux propriétés curatives avancées.",
        type: "consommable", rarete: "8", poids: 0.2, prix: 300,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinPV: 30, }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS11": {
        nom: "Soin universel", desc: "Le remède technologique ultime pour tous les maux.",
        type: "consommable", rarete: "10", poids: 0.2, prix: 500,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinPV: 30, soinFT: 30, curePoison: true }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS12": {
        nom: "Elixir de persuasion", desc: "Améliore temporairement le charisme et l'élocution.",
        type: "consommable", rarete: "5", poids: 0.2, prix: 150,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS13": {
        nom: "Elixir de prouesse", desc: "Augmente la force physique de l'utilisateur.",
        type: "consommable", rarete: "6", poids: 0.2, prix: 180,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {  }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS14": {
        nom: "Liquide de perception", desc: "Affûte les sens et la vigilance du sujet.",
        type: "consommable", rarete: "6", poids: 0.2, prix: 180,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {  }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS15": {
        nom: "Fortifiant réflexes", desc: "Améliore la dextérité et la vitesse de réaction.",
        type: "consommable", rarete: "7", poids: 0.2, prix: 200,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {  }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS16": {
        nom: "Concentré de neurones", desc: "Augmente temporairement l'intelligence.",
        type: "consommable", rarete: "7", poids: 0.2, prix: 220,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {  }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS17": {
        nom: "Energisant", desc: "Redonne de la vigueur et de l'énergie au corps.",
        type: "consommable", rarete: "8", poids: 0.2, prix: 250,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinFT: 80 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS18": {
        nom: "Revitalisant", desc: "Restaure l'ensemble des facultés physiques et mentales.",
        type: "consommable", rarete: "9", poids: 0.2, prix: 400,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinPV: 100, soinFT: 100 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    // --- Explosifs & Chimie (Craft) ---
    "TEC03": {
        nom: "Poison virulent", desc: "Substance toxique pouvant être appliquée sur des armes.",
        type: "explosif", rarete: "5", poids: 0.2, prix: 150,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {  }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "MUN04": {
        nom: "Carburant", desc: "Liquide inflammable utilisé pour divers engins technologiques.",
        type: "munition", rarete: "4", poids: 1.0, prix: 50,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {  }, prerequis: {}, lootable: false, nbUsages: null // Sert souvent de composant
    },
    "TEC04": {
        nom: "Hallucinite", desc: "Produit chimique provoquant des hallucinations chez la victime.",
        type: "explosif", rarete: "6", poids: 0.2, prix: 180,
        equipable: "main_droite", stackable: true, degats: "0", armure: 0, vitesse: 10, portee: 5,
        stats: { }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "TEC05": {
        nom: "Acide corrosif", desc: "Composé qui ronge immédiatement les surfaces et armures.",
        type: "explosif", rarete: "7", poids: 0.5, prix: 250,
        equipable: "main_droite", stackable: true, degats: "5-25", armure: 0, vitesse: 8, portee: 6,
        stats: { }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "TEC06": {
        nom: "Senteur animale", desc: "Mélange permettant de circuler parmi les bêtes sans être attaqué.",
        type: "explosif", rarete: "6", poids: 0.2, prix: 200,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {  }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "TEC07": {
        nom: "Paralysant", desc: "Liquide rendant l'ennemi impuissant temporairement.",
        type: "explosif", rarete: "8", poids: 0.2, prix: 350,
        equipable: "main_droite", stackable: true, degats: "0", armure: 0, vitesse: 10, portee: 5,
        stats: {  }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "TEC08": {
        nom: "Grenade aveuglante", desc: "Gadget au magnésium pour désorienter les adversaires.",
        type: "explosif", rarete: "5", poids: 0.5, prix: 150,
        equipable: "main_droite", stackable: true, degats: "0", armure: 0, vitesse: 12, portee: 8,
        stats: { align: -2 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "TEC09": {
        nom: "Grenade fumigène", desc: "Mixture générant un nuage de fumée pour couvrir une fuite.",
        type: "explosif", rarete: "5", poids: 0.5, prix: 150,
        equipable: "main_droite", stackable: true, degats: "0", armure: 0, vitesse: 12, portee: 8,
        stats: {  }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "TEC10": {
        nom: "Grenade étourdissante", desc: "Explosion de salpêtre étourdissant temporairement les ennemis.",
        type: "explosif", rarete: "6", poids: 0.5, prix: 200,
        equipable: "main_droite", stackable: true, degats: "2-8", armure: 0, vitesse: 12, portee: 8,
        stats: { }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "TEC11": {
        nom: "Grenade offensive", desc: "Arme de destruction puissante utilisant du TNT et de la poudre.",
        type: "explosif", rarete: "7", poids: 0.8, prix: 300,
        equipable: "main_droite", stackable: true, degats: "15-35", armure: 0, vitesse: 10, portee: 8,
        stats: { }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "TEC12": {
        nom: "Ecran de feu", desc: "Mixture inflammable créant un mur de flammes défensif.",
        type: "explosif", rarete: "8", poids: 1.0, prix: 400,
        equipable: "main_droite", stackable: true, degats: "10-20", armure: 0, vitesse: 8, portee: 5,
        stats: {}, prerequis: {}, lootable: false, nbUsages: 1
    },

    "CONS30": {
        nom: "Reanimateur", desc: "Mixture pouvant faire revenir à la vie.",
        type: "consommable", rarete: "9", poids: 1.0, prix: 1400,
        equipable: "main_droite", stackable: true, degats: "", armure: 0, vitesse: 8, portee: 5,
        stats: { resurrection: true, soinPV: 5 }, prerequis: {}, lootable: true, nbUsages: 1
    },



    // ---------------- OBJETS DE QUÊTE / UNIQUES (XXX) ----------------
    "XXX01": {
        nom: "Chevalière 'G.B.'", desc: "Une bague donnée par un vieux gnome avant de mourir.",
        type: "objet_quete", rarete: "10", poids: 0.05, prix: 5,
        equipable: "anneau", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: false, nbUsages: null
    },
    "XXX02": {
        nom: "Appareil photo", desc: "Un vieil appareil trouvé sur le lieu du crash.",
        type: "objet_quete", rarete: "10", poids: 0.1, prix: 5,
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
    
    "XXX05": {
        nom: "Essence RARE de Luciole de Volar", desc: "Une lueur éthérée captive dans un flacon de cristal. Émanée d'un Feu Follet ancestral de Volar, elle est d'une extrême rareté.",
        type: "objet_quete", rarete: "10", poids: 0.05, prix: 0,
        equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: true, nbUsages: null
    },

    "XXX06": {
        nom: "Botte de Elisa Pionnier", desc: "Une vieille botte usée mais solide, portant les initiales 'E.P.' gravées à l'intérieur. Elle semble aller à n'importe quel pied.",
        type: "objet_quete", rarete: "7", poids: 1.2, prix: 0,
        equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { }, prerequis: {}, lootable: true, nbUsages: null
    },

    // ---------------- OUTILS & DIVERS (DIV) ----------------
    "DIV01": {
        nom: "Outil de crochetage", desc: "Un ensemble de rossignols pour les serrures récalcitrantes.",
        type: "divers", rarete: "5", poids: 0.2, prix: 100,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {  }, prerequis: { DX: 8 }, lootable: true, nbUsages: null
    },
    // --- Mécanique (Craft) ---
    "TEC13": {
        nom: "Piège à piques", desc: "Dispositif simple blessant quiconque marche dessus.",
        type: "explosif", rarete: "4", poids: 2.0, prix: 150,
        equipable: "aucun", stackable: true, degats: "10-20", armure: 0, vitesse: 0, portee: 0,
        stats: {  }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "DIV03": {
        nom: "Passe-partout auto.", desc: "Outil facilitant grandement le crochetage des serrures.",
        type: "divers", rarete: "6", poids: 0.5, prix: 300,
        equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { }, prerequis: {}, lootable: false, nbUsages: null // Bonus crochetage à coder
    },
    "TEC14": {
        nom: "Déclencheur de piège", desc: "Boîtier à ressort pour activer les pièges à distance. Améliore le désamorçage.",
        type: "explosif", rarete: "5", poids: 0.5, prix: 200,
        equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { bonusComp: { desamorcage: 15 } }, prerequis: {}, lootable: false, nbUsages: null
    },
    "TEC15": {
        nom: "Piège à ours", desc: "Pince métallique immobilisant et blessant la proie.",
        type: "explosif", rarete: "6", poids: 3.0, prix: 250,
        equipable: "aucun", stackable: true, degats: "15-30", armure: 0, vitesse: 0, portee: 0,
        stats: {  }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "TEC16": {
        nom: "Leurre mécanique", desc: "Dispositif à ressort créant une diversion sonore.",
        type: "explosif", rarete: "7", poids: 1.0, prix: 350,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {  }, prerequis: {}, lootable: false, nbUsages: 1
    },

    "TEC17": {
        nom: "Méca-arachnide", desc: "Automate de combat hydraulique à vapeur avec griffes.",
        type: "explosif", rarete: "10", poids: 15.0, prix: 1500,
        equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {  }, prerequis: {}, lootable: false, nbUsages: null // Invocation à coder
    },
    // --- Électricité (Craft) ---


    // --- Chimie (Craft) ---
    "MUN03": {
        nom: "Energie", desc: "Source énergétique portable (Batterie).",
        type: "munition", rarete: "4", poids: 1.0, prix: 80,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {  }, prerequis: {}, lootable: false, nbUsages: null // Souvent composant
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
    "COMP09": { nom: "Manche de hache", desc: "Manche en bois robuste.", type: "composant", rarete: "2", poids: 1.0, prix: 8, equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP10": { nom: "Minerai de nain", desc: "Minerai lourd aux reflets rougeâtres.", type: "composant", rarete: "6", poids: 5.0, prix: 80, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP12": { nom: "Plaque d'acier", desc: "Plaque métallique forgée.", type: "composant", rarete: "3", poids: 2.5, prix: 25, equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP14": { nom: "Bandelette de cuir", desc: "Lanière solide.", type: "composant", rarete: "1", poids: 0.1, prix: 2, equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP16": { nom: "Bobine de fils", desc: "Fil d'acier fin.", type: "composant", rarete: "2", poids: 0.5, prix: 15, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP17": { nom: "Acier de nains", desc: "Acier extrêmement pur et résistant.", type: "composant", rarete: "7", poids: 3.0, prix: 200, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP19": { nom: "Gros ressort", desc: "Ressort industriel.", type: "composant", rarete: "3", poids: 0.8, prix: 20, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP20": { nom: "Petit ressort", desc: "Ressort d'horlogerie.", type: "composant", rarete: "3", poids: 0.1, prix: 15, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP21": { nom: "Boîte en métal", desc: "Petit contenant.", type: "composant", rarete: "1", poids: 0.3, prix: 5, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP22": { nom: "Pince métallique", desc: "Outil d'artisan.", type: "composant", rarete: "2", poids: 0.5, prix: 12, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP23": { nom: "Montre à goussets", desc: "Horloge de poche.", type: "composant", rarete: "4", poids: 0.2, prix: 40, equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP25": { nom: "Petite machine à vapeur", desc: "Moteur miniature.", type: "composant", rarete: "8", poids: 4.0, prix: 300, equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP26": { nom: "Gros engrenage", desc: "Roue dentée.", type: "composant", rarete: "3", poids: 1.0, prix: 15, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP27": { nom: "Pistole cassé", desc: "Arme hors d'usage.", type: "composant", rarete: "2", poids: 1.5, prix: 10, equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP28": { nom: "Petit tube en métal", desc: "Tuyau en cuivre.", type: "composant", rarete: "1", poids: 0.2, prix: 5, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP29": { nom: "Chambre de revolver", desc: "Pièce mécanique de tir.", type: "composant", rarete: "5", poids: 0.5, prix: 50, equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP31": { nom: "Silencieux", desc: "Tube étouffant le son.", type: "composant", rarete: "5", poids: 0.3, prix: 60, equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP33": { nom: "Miroir", desc: "Surface réfléchissante.", type: "composant", rarete: "2", poids: 0.1, prix: 10, equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP36": { nom: "Gros tuyau", desc: "Cylindre d'acier.", type: "composant", rarete: "3", poids: 2.0, prix: 15, equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP38": { nom: "Filament", desc: "Fil métallique fin.", type: "composant", rarete: "3", poids: 0.05, prix: 10, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP40": { nom: "Petite batterie", desc: "Pile chimique.", type: "composant", rarete: "4", poids: 0.5, prix: 30, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP41": { nom: "Boussole", desc: "Outil d'orientation.", type: "composant", rarete: "3", poids: 0.2, prix: 25, equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP42": { nom: "Petit compsoant électrique", desc: "Pièce de circuit.", type: "composant", rarete: "4", poids: 0.1, prix: 20, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP43": { nom: "Grande batterie", desc: "Générateur portable.", type: "composant", rarete: "6", poids: 2.0, prix: 100, equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP45": { nom: "Bobine électrique", desc: "Fil de cuivre enroulé.", type: "composant", rarete: "5", poids: 0.8, prix: 50, equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP46": { nom: "Harnais électrique", desc: "Sangles avec câblage.", type: "composant", rarete: "6", poids: 1.5, prix: 120, equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP47": { nom: "Bonine tesla", desc: "Condensateur de haute énergie.", type: "composant", rarete: "8", poids: 1.0, prix: 300, equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP48": { nom: "feuilles de coca", desc: "Plante stimulante.", type: "composant", rarete: "3", poids: 0.1, prix: 15, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP49": { nom: "feuilles de tabac", desc: "Plante à fumer.", type: "composant", rarete: "1", poids: 0.1, prix: 5, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP50": { nom: "Poison", desc: "Fiole toxique standard.", type: "composant", rarete: "3", poids: 0.2, prix: 30, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP51": { nom: "herbe à sorcière", desc: "Herbe médicinale rare.", type: "composant", rarete: "5", poids: 0.1, prix: 40, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP52": { nom: "graisse de serpent", desc: "Onguent huileux.", type: "composant", rarete: "4", poids: 0.2, prix: 25, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP53": { nom: "Thermomètre", desc: "Outil médical.", type: "composant", rarete: "3", poids: 0.1, prix: 15, equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
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
    "COMP79": { nom: "Nitroglycérine", desc: "Liquide extrêmement instable.", type: "composant", rarete: "8", poids: 0.5, prix: 200, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP80": { nom: "Pointe de rail", desc: "Gros clou en acier forgé pour les rails de chemin de fer.", type: "composant", rarete: "2", poids: 0.3, prix: 8, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP81": { nom: "Copeaux de métal", desc: "Résidus métalliques issus de la forge.", type: "composant", rarete: "1", poids: 0.2, prix: 3, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP82": { nom: "Plaque de métal brut", desc: "Plaque non travaillée, brut de fonderie.", type: "composant", rarete: "2", poids: 2.0, prix: 12, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP83": { nom: "Chlorure de potassium", desc: "Sel minéral utilisé en chimie et médecine.", type: "composant", rarete: "4", poids: 0.3, prix: 25, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP84": { nom: "Kérosène", desc: "Combustible liquide très inflammable.", type: "composant", rarete: "3", poids: 1.0, prix: 20, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP85": { nom: "Châssis de pistolet", desc: "Carcasse métallique de pistolet à assembler.", type: "composant", rarete: "5", poids: 0.8, prix: 60, equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP86": { nom: "Chambre d'alimentation auto.", desc: "Mécanisme permettant le rechargement automatique.", type: "composant", rarete: "7", poids: 0.5, prix: 120, equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },
    "COMP87": { nom: "Pièces de revolver", desc: "Ensemble de pièces détachées pour revolver.", type: "composant", rarete: "4", poids: 0.6, prix: 45, equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0, stats: {}, prerequis: {}, lootable: true, nbUsages: null },

    // ---------------- CONSOMMABLES SUPPLÉMENTAIRES ----------------
    "CONS19": {
        nom: "Grande potion de soin", desc: "Puissant élixir rouge qui referme les plaies profondes.",
        type: "consommable", rarete: "6", poids: 0.5, prix: 150,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinPV: 50 }, prerequis: {}, lootable: true, nbUsages: 1
    },
    "CONS20": {
        nom: "Grande potion d'énergie", desc: "Restaure massivement la fatigue. Goût de menthe intense.",
        type: "consommable", rarete: "6", poids: 0.5, prix: 150,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinFT: 50 }, prerequis: {}, lootable: true, nbUsages: 1
    },
    "CONS21": {
        nom: "Antidote puissant", desc: "Neutralise les poisons et soigne les blessures légères.",
        type: "consommable", rarete: "5", poids: 0.3, prix: 120,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { curePoison: true, soinPV: 10 }, prerequis: {}, lootable: true, nbUsages: 1
    },
    "CONS22": {
        nom: "Venin de Kalispi", desc: "Extrait venimeux d'un serpent rare. Usage délicat conseillé.",
        type: "consommable", rarete: "6", poids: 0.2, prix: 200,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: true, nbUsages: 1
    },
    "CONS23": {
        nom: "Liquide d'épaississement", desc: "Durcit temporairement la peau, améliorant la résistance physique.",
        type: "consommable", rarete: "7", poids: 0.3, prix: 250,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { resPhys: 10 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS24": {
        nom: "Larmes de Morgana", desc: "Liquide argenté aux reflets lunaires. Propriétés magiques inconnues.",
        type: "consommable", rarete: "8", poids: 0.2, prix: 400,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinPV: 25, resMagie: 5 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS25": {
        nom: "Potion de hâte", desc: "Accélère les mouvements et les réflexes le temps d'un combat.",
        type: "consommable", rarete: "7", poids: 0.3, prix: 300,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS26": {
        nom: "Invigorant", desc: "Tonique puissant restaurant rapidement l'énergie vitale.",
        type: "consommable", rarete: "6", poids: 0.3, prix: 180,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinFT: 40, soinPV: 10 }, prerequis: {}, lootable: true, nbUsages: 1
    },
    "CONS27": {
        nom: "Elixir Vendigrothien", desc: "Préparation alchimique complexe aux effets multiples.",
        type: "consommable", rarete: "9", poids: 0.5, prix: 600,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinPV: 40, soinFT: 40, curePoison: true }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS28": {
        nom: "Absinthe", desc: "Liqueur verte à haute teneur en alcool. Goût d'anis prononcé.",
        type: "consommable", rarete: "3", poids: 0.8, prix: 25,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinFT: 5 }, prerequis: {}, lootable: true, nbUsages: 1
    },
    "CONS29": {
        nom: "Pain", desc: "Miche de pain rassis. Nourrissant à défaut d'être bon.",
        type: "consommable", rarete: "1", poids: 0.3, prix: 2,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinPV: 3 }, prerequis: {}, lootable: true, nbUsages: 1
    },
    "CONS31": {
        nom: "Eau", desc: "Eau fraîche. Essentielle à la survie.",
        type: "consommable", rarete: "1", poids: 0.5, prix: 1,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinFT: 3 }, prerequis: {}, lootable: true, nbUsages: 1
    },
    "CONS32": {
        nom: "Eau de source elfique", desc: "Eau cristalline recueillie aux sources des forêts elfiques. Légèrement revigorante.",
        type: "consommable", rarete: "5", poids: 0.5, prix: 60,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinFT: 10, soinPV: 5 }, prerequis: {}, lootable: true, nbUsages: 1
    },
    "CONS33": {
        nom: "Gâteaux sucrés", desc: "Petits gâteaux fondants. Un luxe réconfortant.",
        type: "consommable", rarete: "2", poids: 0.2, prix: 8,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinPV: 5, soinFT: 2 }, prerequis: {}, lootable: true, nbUsages: 1
    },
    "CONS34": {
        nom: "Thé Earl Grey", desc: "Thé bergamote raffiné. Calme l'esprit et éveille les sens.",
        type: "consommable", rarete: "2", poids: 0.3, prix: 12,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinFT: 8 }, prerequis: {}, lootable: true, nbUsages: 1
    },
    "CONS35": {
        nom: "Tabac à priser nain", desc: "Mélange piquant prisé des mineurs. Déconseillé aux non-nains.",
        type: "consommable", rarete: "3", poids: 0.1, prix: 15,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinFT: 6 }, prerequis: {}, lootable: true, nbUsages: 1
    },
    "CONS36": {
        nom: "Belladone de Lingham", desc: "Extrait botanique aux effets sédatifs et analgésiques.",
        type: "consommable", rarete: "6", poids: 0.2, prix: 180,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinPV: 20, curePoison: true }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS37": {
        nom: "Teinture phosphorescente de Nimm", desc: "Liquide brillant aux propriétés curatives surprenantes.",
        type: "consommable", rarete: "7", poids: 0.3, prix: 280,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { soinPV: 30, resElec: 5 }, prerequis: {}, lootable: false, nbUsages: 1
    },
    "CONS38": {
        nom: "Cologne du Dragon", desc: "Parfum mystérieux dont l'odeur inspire une terreur instinctive.",
        type: "consommable", rarete: "7", poids: 0.2, prix: 350,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: { resFeu: 10 }, prerequis: {}, lootable: false, nbUsages: 1
    },

    // ---------------- DIVERS SUPPLÉMENTAIRES (DIV) ----------------
    "DIV13": {
        nom: "Montre de gousset", desc: "Montre en laiton fonctionnelle avec chaîne. Indique l'heure exacte.",
        type: "divers", rarete: "4", poids: 0.2, prix: 80,
        equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: true, nbUsages: null
    },
    "DIV14": {
        nom: "Chiffon", desc: "Tissu usé pouvant servir à nettoyer, ligaturer ou bourrer.",
        type: "divers", rarete: "1", poids: 0.1, prix: 1,
        equipable: "aucun", stackable: true, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: true, nbUsages: null
    },
    "DIV15": {
        nom: "Boîte à musique", desc: "Petit automate musical jouant une mélodie mélancolique.",
        type: "divers", rarete: "5", poids: 0.5, prix: 120,
        equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: true, nbUsages: null
    },
    "DIV16": {
        nom: "Trousseau de clés", desc: "Anneau métallique portant plusieurs clés indéterminées.",
        type: "divers", rarete: "3", poids: 0.3, prix: 30,
        equipable: "aucun", stackable: false, degats: "0", armure: 0, vitesse: 0, portee: 0,
        stats: {}, prerequis: {}, lootable: true, nbUsages: null
    }
};

const _LABELS_SOUSTYPE_INCONNU = {
    epee:    "Épée non identifiée",
    masse:   "Masse non identifiée",
    hache:   "Hache non identifiée",
    marteau: "Grand marteau non identifié",
    arc:     "Arc non identifié",
    dague:   "Dague non identifiée",
};
const _LABELS_SLOT_INCONNU = {
    main_droite: { arme_melee: "Arme de mêlée non identifiée", arme_distance: "Arme à distance non identifiée", _default: "Arme non identifiée" },
    deux_mains:  { arme_melee: "Arme à deux mains non identifiée", _default: "Arme non identifiée" },
    main_gauche: { armure: "Bouclier non identifié", _default: "Objet non identifié" },
    torse:       "Armure non identifiée",
    tete:        "Casque non identifié",
    gants:       "Gants non identifiés",
    bottes:      "Bottes non identifiées",
    anneau:      "Anneau non identifié",
    amulette:    "Amulette non identifiée",
};
function _nomInconnu(def) {
    if (!def) return "Objet non identifié";
    if (def.soustype && _LABELS_SOUSTYPE_INCONNU[def.soustype]) return _LABELS_SOUSTYPE_INCONNU[def.soustype];
    const slot = def.equipable;
    const label = _LABELS_SLOT_INCONNU[slot];
    if (!label) return "Objet non identifié";
    if (typeof label === "string") return label;
    return label[def.type] || label._default || "Objet non identifié";
}

const _STATS_MAGIQUES = ['resMagie','resPhys','resFeu','resElec','resPoison','FO','DX','IN','CN','CH','FT','PV','bonusComp'];
function _estItemMagique(def) {
    if (!def || !def.stats) return false;
    return _STATS_MAGIQUES.some(k => def.stats[k] !== undefined && def.stats[k] !== null && def.stats[k] !== 0);
}

// ── Objets des Arcanes (non identifiés jusqu'à identification) ────────────────
Object.assign(itemsData, {
    "AM_ARC1": {
        nom: "Épée des Arcanes", soustype: "epee",
        desc: "Une épée imprégnée d'énergie arcanique pure.",
        type: "arme_melee", rarete: "10", poids: 2.0, prix: 2500,
        equipable: "main_droite", stackable: false, degats: "8-18", armure: 0, vitesse: 14, portee: 1, degatsFT: 2,
        stats: { resMagie: 15, FO: 3, FT: 10 }, prerequis: { FO: 8 }, lootable: true, nbUsages: null,
        demandeIdentification: true
    },
    "AM_ARC2": {
        nom: "Masse des Arcanes", soustype: "masse",
        desc: "Une masse lourde qui vibre d'une énergie mystérieuse.",
        type: "arme_melee", rarete: "10", poids: 3.5, prix: 2200,
        equipable: "main_droite", stackable: false, degats: "10-22", armure: 0, vitesse: 10, portee: 1, degatsFT: 3,
        stats: { resPhys: 10, FO: 5, CN: 2 }, prerequis: { FO: 10 }, lootable: true, nbUsages: null,
        demandeIdentification: true
    },
    "AM_ARC3": {
        nom: "Hache des Arcanes", soustype: "hache",
        desc: "Une hache dont le tranchant est renforcé par des runes arcanes.",
        type: "arme_melee", rarete: "10", poids: 4.0, prix: 2300,
        equipable: "main_droite", stackable: false, degats: "9-20", armure: 0, vitesse: 11, portee: 1, degatsFT: 3,
        stats: { resFeu: 15, FO: 4, resPhys: 8 }, prerequis: { FO: 9 }, lootable: true, nbUsages: null,
        demandeIdentification: true
    },
    "AM_ARC4": {
        nom: "Marteau à deux mains des Arcanes", soustype: "marteau",
        desc: "Un marteau de guerre colossal gravé de runes de destruction.",
        type: "arme_melee", rarete: "10", poids: 7.0, prix: 2800,
        equipable: "deux_mains", stackable: false, degats: "14-28", armure: 0, vitesse: 8, portee: 1, degatsFT: 4,
        stats: { resPhys: 12, FO: 6, CN: 3 }, prerequis: { FO: 12 }, lootable: true, nbUsages: null,
        demandeIdentification: true
    },
    "DEF_ARC1": {
        nom: "Armure des Arcanes",
        desc: "Une armure couverte de runes protectrices.",
        type: "armure", rarete: "10", poids: 7.0, prix: 3000,
        equipable: "torse", stackable: false, degats: "0", armure: 12, vitesse: 0, portee: 0,
        stats: { resPhys: 20, resMagie: 20, resFeu: 10 }, prerequis: { FO: 9 }, lootable: true, nbUsages: null,
        demandeIdentification: true
    },
    "DEF_ARC2": {
        nom: "Casque des Arcanes",
        desc: "Un casque qui aiguise l'esprit et renforce la volonté.",
        type: "armure", rarete: "10", poids: 2.0, prix: 1800,
        equipable: "tete", stackable: false, degats: "0", armure: 6, vitesse: 0, portee: 0,
        stats: { IN: 3, resMagie: 15, bonusComp: { detection_piege: 3 } }, prerequis: {}, lootable: true, nbUsages: null,
        demandeIdentification: true
    },
    "DEF_ARC3": {
        nom: "Gants des Arcanes",
        desc: "Des gants qui amplifient la précision et la magie.",
        type: "armure", rarete: "10", poids: 0.8, prix: 1500,
        equipable: "gants", stackable: false, degats: "0", armure: 4, vitesse: 0, portee: 0,
        stats: { DX: 3, FT: 15, bonusComp: { crochetage: 2 } }, prerequis: {}, lootable: true, nbUsages: null,
        demandeIdentification: true
    },
    "DEF_ARC4": {
        nom: "Bottes des Arcanes",
        desc: "Des bottes légères qui semblent ne jamais toucher le sol.",
        type: "armure", rarete: "10", poids: 1.2, prix: 1600,
        equipable: "bottes", stackable: false, degats: "0", armure: 4, vitesse: 0, portee: 0,
        stats: { DX: 2, resPoison: 20, bonusComp: { discretion: 4 } }, prerequis: {}, lootable: true, nbUsages: null,
        demandeIdentification: true
    },
    "DEF_ARC5": {
        nom: "Bouclier des Arcanes",
        desc: "Un bouclier qui absorbe les énergies magiques et physiques.",
        type: "armure", rarete: "10", poids: 4.0, prix: 2800,
        equipable: "main_gauche", stackable: false, degats: "0", armure: 10, vitesse: 0, portee: 0,
        stats: { resPhys: 15, resMagie: 25, resElec: 15, resFeu: 15 }, prerequis: { FO: 7 }, lootable: true, nbUsages: null,
        demandeIdentification: true
    }
});

