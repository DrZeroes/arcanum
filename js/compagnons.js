// ================================================================
// DONNÉES DES COMPAGNONS
// Structure identique à perso pour la compatibilité.
//
// magieInvesties  : points par école (1-5, débloque les sorts)
// techInvesties   : points par discipline (pas des rangs de formation)
// rangsComp       : rangs de formation (0=aucun 1=Apprenti 2=Expert 3=Maître)
// progressionRangs: rangs accordés automatiquement à certains niveaux
// prndSlot        : false = ne compte pas dans le max de compagnons
// temporaire      : quitte le groupe après sa condition
// armeObligatoire : slot forcé ("deux_mains", etc.)
// restrictionsEquip: slots interdits (["main_droite","torse"...])
// equipement      : équipement de départ par slot
// portrait        : chemin vers la miniature (./docs/img/portraits/compagnons/)
// ================================================================

const compagnonsData = {

    // ── VIRGIL ───────────────────────────────────────────────────────────────
    "1": {
        id: 1, nom: "Virgil", niveau: 1, race: "Human", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/Virgil.png",
        statsBase: { FO: 9, CN: 8, DX: 8, IN: 8, CH: 8 },
        lieu: "Lieu du Crash",
        niveauMinJoueur: null,
        contrainte: "Aucune condition — il attend à l'endroit du crash.",
        compInvesties: { esquive: 4, melee: 4, crochetage: 4 },
        rangsComp: {},
        magieInvesties: { "Nécromancie blanche": 1 },
        techInvesties: {},
        temporaire: false, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AM05",
            torse: "DEF45",
            bottes: "DEF59"
        },
        notes: ""
    },

    // ── SOGG HYDROMEL ────────────────────────────────────────────────────────
    "2": {
        id: 2, nom: "Sogg Hydromel", niveau: 2, race: "Half-Ogre", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/Sogg.png",
        statsBase: { FO: 15, CN: 8, DX: 10, IN: 3, CH: 8 },
        lieu: "Tristes Collines",
        niveauMinJoueur: null,
        contrainte: "CH ≥ 9 pour le recruter.",
        compInvesties: { esquive: 4, melee: 4 },
        rangsComp: {},
        magieInvesties: {},
        techInvesties: {},
        temporaire: false, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AM10",
            main_gauche: "DEF75",
            torse: "DEF48",
            bottes: "DEF59",
            gants: "DEF68"
        },
        notes: "IN très faible — limité aux compétences physiques simples."
    },

    // ── JAYNA TOURNIQUET ─────────────────────────────────────────────────────
    "3": {
        id: 3, nom: "Jayna Tourniquet", niveau: 6, race: "Human", sexe: "F",
        portrait: "./docs/img/portraits/compagnons/Jayna.png",
        statsBase: { FO: 8, CN: 8, DX: 9, IN: 9, CH: 8 },
        lieu: "Dernholm",
        niveauMinJoueur: 5,
        contrainte: "Jauge Magie/Tech ≤ −10 (orientation techno). Niveau joueur ≥ 5.",
        compInvesties: { melee: 4, soins: 4 },
        rangsComp: {},
        magieInvesties: {},
        techInvesties: { "Botanique": 1, "Thérapeutique": 1 },
        temporaire: false, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AM06",
            torse: "DEF20",
            bottes: "DEF59"
        },
        notes: ""
    },

    // ── MAGNUS ───────────────────────────────────────────────────────────────
    "4": {
        id: 4, nom: "Magnus", niveau: 8, race: "Dwarf", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/Magnus.png",
        statsBase: { FO: 10, CN: 10, DX: 9, IN: 9, CH: 7 },
        lieu: "Tarante (devant P. Schuyler & fils)",
        niveauMinJoueur: 7,
        contrainte: "Ne pas être mauvais. Niveau joueur ≥ 7.",
        compInvesties: { esquive: 4, melee: 8 },
        rangsComp: {},
        magieInvesties: {},
        techInvesties: { "Mécanique": 2, "Armurerie": 2, "Forge": 1 },
        temporaire: false, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AM58",
            main_gauche: "DEF75",
            torse: "DEF31",
            tete: "DEF19",
            bottes: "DEF63",
            gants: "DEF68"
        },
        notes: "Forge 1 ajouté — bonus racial nain."
    },

    // ── GAR ──────────────────────────────────────────────────────────────────
    "5": {
        id: 5, nom: "Gar", niveau: 10, race: "Human", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/gar.png",
        statsBase: { FO: 11, CN: 8, DX: 12, IN: 9, CH: 8 },
        lieu: "Tarante (Musée Hector Parnell)",
        niveauMinJoueur: 9,
        contrainte: "IN et Persuasion suffisants. Parler de thé avec lui. Niveau joueur ≥ 9.",
        compInvesties: { esquive: 12, melee: 12 },
        rangsComp: {},
        magieInvesties: {},
        techInvesties: {},
        temporaire: false, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AM44",
            torse: "DEF30",
            bottes: "DEF62",
            gants: "DEF66"
        },
        notes: ""
    },

    // ── BARNABÉ BONARIEN ─────────────────────────────────────────────────────
    "6": {
        id: 6, nom: "Barnabé Bonarien", niveau: 12, race: "Chien", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/barnabeBonarien-Chien.png",
        statsBase: { FO: 15, CN: 8, DX: 14, IN: 9, CH: 8 },
        lieu: "Cendrebourg (près de l'Auberge)",
        niveauMinJoueur: null,
        contrainte: "Le sauver. Ne prend pas de slot de compagnon.",
        compInvesties: { esquive: 12, melee: 14 },
        rangsComp: { melee: 1 },
        magieInvesties: {},
        techInvesties: {},
        temporaire: false, prndSlot: false,
        armeObligatoire: null, restrictionsEquip: [],
        progressionRangs: [
            { niveauAtteint: 20, skill: "melee", rang: 2 },
            { niveauAtteint: 30, skill: "melee", rang: 3 }
        ],
        equipement: {},
        notes: "Ne compte pas dans le max de compagnons. Rang mêlée : Apprenti au recrutement → Expert lv20 → Maître lv30."
    },

    // ── GEOFFROY CENDRE-TARELLOND ─────────────────────────────────────────────
    "7": {
        id: 7, nom: "Geoffroy Cendre-Tarellond", niveau: 12, race: "Human", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/Geoffrey.png",
        statsBase: { FO: 6, CN: 10, DX: 8, IN: 15, CH: 8 },
        lieu: "Cendrebourg (portes du cimetière)",
        niveauMinJoueur: 11,
        contrainte: "Être mauvais. Résoudre sa quête (Q33). Niveau joueur ≥ 11.",
        compInvesties: { melee: 4, esquive: 4 },
        rangsComp: {},
        magieInvesties: { "Feu": 3, "Energie": 2, "Nécromancie noire": 2 },
        techInvesties: {},
        temporaire: false, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AM18",
            torse: "DEF43",
            bottes: "DEF59",
            anneau: "BIJ07",
            amulette: "BIJ23"
        },
        notes: ""
    },

    // ── DANTE ────────────────────────────────────────────────────────────────
    "8": {
        id: 8, nom: "Dante", niveau: 12, race: "Human", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/Dante.png",
        statsBase: { FO: 12, CN: 8, DX: 12, IN: 10, CH: 9 },
        lieu: "Racine Noire (bar)",
        niveauMinJoueur: 12,
        contrainte: "Niveau joueur ≥ 12. Quitte le groupe après la quête des impôts (Q29).",
        compInvesties: { esquive: 4, melee: 4 },
        rangsComp: {},
        magieInvesties: { "Air": 1, "Energie": 1, "Nécromancie blanche": 2 },
        techInvesties: {},
        temporaire: true, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AM09",
            torse: "DEF30",
            bottes: "DEF62"
        },
        notes: "Quitte définitivement le groupe après Q29 (quête des impôts de Black Root)."
    },

    // ── VOLLINGER ────────────────────────────────────────────────────────────
    "9": {
        id: 9, nom: "Vollinger", niveau: 15, race: "Gnome", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/Vollinger.png",
        statsBase: { FO: 9, CN: 6, DX: 9, IN: 10, CH: 8 },
        lieu: "Dernholm (Auberge du Roi)",
        niveauMinJoueur: 14,
        contrainte: "Niveau joueur ≥ 14.",
        compInvesties: { melee: 8, armes_a_feu: 12, lancer: 8, jeu: 4 },
        rangsComp: {},
        magieInvesties: {},
        techInvesties: { "Armurerie": 3, "Chimie": 3, "Mécanique": 1 },
        temporaire: false, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AF01",
            torse: "DEF30",
            tete: "DEF19",
            bottes: "DEF59"
        },
        notes: "Mécanique 1 ajouté — bonus racial gnome."
    },

    // ── CHUKKA ───────────────────────────────────────────────────────────────
    "10": {
        id: 10, nom: "Chukka", niveau: 16, race: "Ogre", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/Chukka.png",
        statsBase: { FO: 22, CN: 8, DX: 15, IN: 7, CH: 8 },
        lieu: "Tarante (Domaine de Bastien)",
        niveauMinJoueur: 15,
        contrainte: "Avoir visité les Mines du Mont Noir. IN ≥ 5, CH ≥ 12. Niveau joueur ≥ 15.",
        compInvesties: { esquive: 12, melee: 12 },
        rangsComp: {},
        magieInvesties: {},
        techInvesties: {},
        temporaire: false, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AM37",
            torse: "DEF40",
            bottes: "DEF63",
            gants: "DEF68"
        },
        notes: ""
    },

    // ── WAROMON ──────────────────────────────────────────────────────────────
    "11": {
        id: 11, nom: "Waromon", niveau: 20, race: "Bédokien", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/Waromon.png",
        statsBase: { FO: 12, CN: 12, DX: 16, IN: 9, CH: 8 },
        lieu: "Village des Bédokiens",
        niveauMinJoueur: 19,
        contrainte: "Avoir résolu la quête des braconniers pacifiquement (Q48). Niveau joueur ≥ 19.",
        compInvesties: { arc: 19, melee: 16 },
        rangsComp: { arc: 2, melee: 2 },
        magieInvesties: { "Nature": 2, "Terre": 2, "Feu": 2 },
        techInvesties: {},
        temporaire: false, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AD03",
            torse: "DEF36",
            bottes: "DEF60",
            gants: "DEF67",
            anneau: "BIJ07",
            amulette: "BIJ21"
        },
        notes: ""
    },

    // ── TORIAN KEL ───────────────────────────────────────────────────────────
    "12": {
        id: 12, nom: "Torian Kel", niveau: 20, race: "Human", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/TorianKel.png",
        statsBase: { FO: 16, CN: 8, DX: 15, IN: 10, CH: 8 },
        lieu: "Temple Ancien",
        niveauMinJoueur: 19,
        contrainte: "Être mauvais. Avoir ressuscité Torian Kel (Q60). Niveau joueur ≥ 19.",
        compInvesties: { esquive: 16, melee: 16 },
        rangsComp: {},
        magieInvesties: {},
        techInvesties: {},
        temporaire: false, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AM48",
            torse: "DEF34",
            tete: "DEF52",
            bottes: "DEF61",
            gants: "DEF73"
        },
        notes: ""
    },

    // ── THORVALD DOUBLE-ROC ──────────────────────────────────────────────────
    "13": {
        id: 13, nom: "Thorvald Double-Roc", niveau: 23, race: "Dwarf", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/Thorvald.png",
        statsBase: { FO: 21, CN: 11, DX: 17, IN: 10, CH: 6 },
        lieu: "Île du Désespoir",
        niveauMinJoueur: 22,
        contrainte: "Être assez persuasif. Pas gnome. Part après Q41 (retour au Clan de la Roue). Niveau joueur ≥ 22.",
        compInvesties: { esquive: 16, melee: 16 },
        rangsComp: {},
        magieInvesties: {},
        techInvesties: { "Forge": 1 },
        temporaire: false, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AM69",
            main_gauche: "DEF77",
            torse: "DEF32",
            tete: "DEF57",
            bottes: "DEF63",
            gants: "DEF73"
        },
        notes: "Forge 1 ajouté — bonus racial nain. Quitte le groupe après Q41."
    },

    // ── WELDO RUBIN ──────────────────────────────────────────────────────────
    "14": {
        id: 14, nom: "Weldo Rubin", niveau: 25, race: "Halfling", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/WeldoRubin.png",
        statsBase: { FO: 6, CN: 10, DX: 16, IN: 8, CH: 8 },
        lieu: "Passage vers les Landes",
        niveauMinJoueur: 24,
        contrainte: "Être halfelin, ou être mauvais, ou Persuasion ≥ 8. Niveau joueur ≥ 24.",
        compInvesties: { esquive: 13, attaque_sournoise: 8, discretion: 10, detection_piege: 8, crochetage: 16 },
        rangsComp: { crochetage: 2 },
        magieInvesties: {},
        techInvesties: {},
        temporaire: false, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AM33",
            torse: "DEF35",
            bottes: "DEF60",
            gants: "DEF70",
            anneau: "BIJ11",
            amulette: "BIJ30"
        },
        notes: ""
    },

    // ── PERRIN LAFORGE ───────────────────────────────────────────────────────
    "15": {
        id: 15, nom: "Perrin Laforge", niveau: 25, race: "Human", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/Perriman.png",
        statsBase: { FO: 6, CN: 10, DX: 15, IN: 15, CH: 8 },
        lieu: "Tarante (résidence des Saules)",
        niveauMinJoueur: 24,
        contrainte: "Lors du départ pour Tulla. Ne veut pas de joueurs mauvais. Niveau joueur ≥ 24.",
        compInvesties: { esquive: 12, melee: 16 },
        rangsComp: {},
        magieInvesties: { "Feu": 3, "Nécromancie blanche": 4, "Illusion": 3 },
        techInvesties: {},
        temporaire: false, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AM19",
            torse: "DEF43",
            bottes: "DEF59",
            anneau: "BIJ05",
            amulette: "BIJ32"
        },
        notes: ""
    },

    // ── ORFRAIE ──────────────────────────────────────────────────────────────
    "16": {
        id: 16, nom: "Orfraie", niveau: 32, race: "Elf", sexe: "F",
        portrait: "./docs/img/portraits/compagnons/ORFRAIE.png",
        statsBase: { FO: 9, CN: 11, DX: 17, IN: 14, CH: 8 },
        lieu: "Qintarra",
        niveauMinJoueur: 31,
        contrainte: "Après être revenu de T'sen Ang. Niveau joueur ≥ 31.",
        compInvesties: { esquive: 12, melee: 4, arc: 16 },
        rangsComp: { arc: 2 },
        magieInvesties: { "Eau": 3, "Nécromancie blanche": 3 },
        techInvesties: {},
        temporaire: false, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AD12",
            torse: "DEF36",
            bottes: "DEF60",
            gants: "DEF67",
            anneau: "BIJ07",
            amulette: "BIJ20"
        },
        notes: ""
    },

    // ── Z'AN AL'URIN ─────────────────────────────────────────────────────────
    "17": {
        id: 17, nom: "Z'an Al'urin", niveau: 29, race: "Dark Elf", sexe: "F",
        portrait: "./docs/img/portraits/compagnons/ZanAlurin.png",
        statsBase: { FO: 5, CN: 18, DX: 9, IN: 19, CH: 8 },
        lieu: "T'sen Ang",
        niveauMinJoueur: 28,
        contrainte: "Être mauvais. Niveau joueur ≥ 28.",
        compInvesties: { esquive: 8, melee: 4 },
        rangsComp: {},
        magieInvesties: { "Terre": 3, "Energie": 4, "Temporel": 3 },
        techInvesties: {},
        temporaire: false, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AM35",
            torse: "DEF44",
            bottes: "DEF60",
            anneau: "BIJ12",
            amulette: "BIJ29"
        },
        notes: ""
    },

    // ── TOLLO ────────────────────────────────────────────────────────────────
    "18": {
        id: 18, nom: "Tollo", niveau: 20, race: "Halfling", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/Tollo.png",
        statsBase: { FO: 5, CN: 8, DX: 22, IN: 8, CH: 8 },
        lieu: "Prison de Dernholm",
        niveauMinJoueur: 29,
        contrainte: "Être mauvais. Niveau joueur ≥ 29.",
        compInvesties: { esquive: 20, melee: 8, crochetage: 20, attaque_sournoise: 12, discretion: 1, detection_piege: 12, desamorcage: 8 },
        rangsComp: {},
        magieInvesties: {},
        techInvesties: {},
        temporaire: false, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AM27",
            torse: "DEF35",
            bottes: "DEF65",
            gants: "DEF70",
            anneau: "BIJ16"
        },
        notes: ""
    },

    // ── SEBASTIAN ────────────────────────────────────────────────────────────
    "19": {
        id: 19, nom: "Sebastian", niveau: 30, race: "Human", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/Sebastian.png",
        statsBase: { FO: 9, CN: 8, DX: 12, IN: 12, CH: 8 },
        lieu: "Tarante (La Fosse, Bar)",
        niveauMinJoueur: 29,
        contrainte: "Faire sa quête (Q22). Niveau joueur ≥ 29.",
        compInvesties: { crochetage: 12, armes_a_feu: 16, lancer: 4, melee: 4 },
        rangsComp: {},
        magieInvesties: {},
        techInvesties: { "Explosifs": 4, "Electricité": 4 },
        temporaire: false, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AF05",
            torse: "DEF30",
            tete: "DEF13",
            bottes: "DEF62"
        },
        notes: ""
    },

    // ── MURGO ────────────────────────────────────────────────────────────────
    "20": {
        id: 20, nom: "Murgo", niveau: 30, race: "Half-Ogre", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/Murgo.png",
        statsBase: { FO: 24, CN: 8, DX: 18, IN: 3, CH: 8 },
        lieu: "Vooriden",
        niveauMinJoueur: null,
        contrainte: "Uniquement durant la quête de la pierre d'autel (Q43).",
        compInvesties: { esquive: 20, melee: 20 },
        rangsComp: {},
        magieInvesties: {},
        techInvesties: {},
        temporaire: true, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AM37",
            torse: "DEF40",
            bottes: "DEF63",
            gants: "DEF68"
        },
        notes: "Compagnon temporaire — quitte le groupe à la fin de Q43."
    },

    // ── JORMUND ──────────────────────────────────────────────────────────────
    "21": {
        id: 21, nom: "Jormund", niveau: 20, race: "Dwarf", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/Jormund.png",
        statsBase: { FO: 7, CN: 16, DX: 9, IN: 16, CH: 7 },
        lieu: "Qintarra",
        niveauMinJoueur: 19,
        contrainte: "Prouver son innocence dans la quête Q47. Niveau joueur ≥ 19.",
        compInvesties: { melee: 4 },
        rangsComp: {},
        magieInvesties: { "Feu": 3, "Energie": 2 },
        techInvesties: {},
        temporaire: false, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AM18",
            torse: "DEF43",
            bottes: "DEF59",
            anneau: "BIJ07",
            amulette: "BIJ23"
        },
        notes: "Nain mage — Forge non ajouté car son identité est celle d'un mage, pas d'un artisan."
    },

    // ── LOGHAIRE PIERREFOUDRE ────────────────────────────────────────────────
    "22": {
        id: 22, nom: "Loghaire Pierrefoudre", niveau: 35, race: "Nain", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/Loghaire.png",
        statsBase: { FO: 20, CN: 9, DX: 18, IN: 14, CH: 8 },
        lieu: "Clan de la Roue",
        niveauMinJoueur: null,
        contrainte: "Avoir une haute IN et Persuasion pour le convaincre.",
        compInvesties: { esquive: 20, melee: 20 },
        rangsComp: {},
        magieInvesties: {},
        techInvesties: { "Forge": 2, "Mécanique": 1 },
        temporaire: false, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AM69",
            main_gauche: "DEF77",
            torse: "DEF32",
            tete: "DEF57",
            bottes: "DEF63",
            gants: "DEF12"
        },
        notes: "Forge 2 + Mécanique 1 ajoutés — bonus racial nain (haut niveau)."
    },

    // ── FRANKLIN PAYNE ───────────────────────────────────────────────────────
    "23": {
        id: 23, nom: "Franklin Payne", niveau: 35, race: "Human", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/FranklinPayne.png",
        statsBase: { FO: 7, CN: 8, DX: 18, IN: 9, CH: 8 },
        lieu: "Racine Noire (chez lui)",
        niveauMinJoueur: 34,
        contrainte: "Lors du départ pour Thanatos. Niveau joueur ≥ 34.",
        compInvesties: { melee: 4, armes_a_feu: 8 },
        rangsComp: {},
        magieInvesties: {},
        techInvesties: { "Forge": 1, "Mécanique": 1, "Armurerie": 1, "Electricité": 1, "Botanique": 1, "Thérapeutique": 1, "Chimie": 1, "Explosifs": 1 },
        temporaire: false, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AF07",
            torse: "DEF17",
            tete: "DEF22",
            bottes: "DEF62"
        },
        notes: "Toutes les disciplines technologiques au niveau 1."
    },

    // ── KRAKA-TUR ────────────────────────────────────────────────────────────
    "24": {
        id: 24, nom: "Kraka-Tur", niveau: 45, race: "Dragon", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/Kraka-tur.png",
        statsBase: { FO: 18, CN: 16, DX: 20, IN: 11, CH: 8 },
        lieu: "Le Néant",
        niveauMinJoueur: null,
        contrainte: "Avoir son journal ou lui promettre de le libérer.",
        compInvesties: { esquive: 20, melee: 20 },
        rangsComp: { esquive: 3, melee: 2 },
        magieInvesties: { "Feu": 2 },
        techInvesties: {},
        temporaire: false, prndSlot: false,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AM46",
            torse: "DEF33",
            bottes: "DEF65",
            anneau: "BIJ09",
            amulette: "BIJ21"
        },
        notes: "Ne compte pas dans le max de compagnons. Feu 2 ajouté — souffle de dragon (bonus racial)."
    },

    // ── LE FLÉAU DE KREE ─────────────────────────────────────────────────────
    "25": {
        id: 25, nom: "Le Fléau de Kree", niveau: 45, race: "Human", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/fleauKree.png",
        statsBase: { FO: 20, CN: 10, DX: 19, IN: 10, CH: 7 },
        lieu: "Le Néant",
        niveauMinJoueur: 44,
        contrainte: "Être mauvais. Niveau joueur ≥ 44.",
        compInvesties: { esquive: 20, melee: 20 },
        rangsComp: { esquive: 3, melee: 3 },
        magieInvesties: {},
        techInvesties: {},
        temporaire: false, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AM47",
            torse: "DEF39",
            tete: "DEF52",
            bottes: "DEF61",
            gants: "DEF72",
            anneau: "BIJ09",
            amulette: "BIJ21"
        },
        notes: "Porte l'Épée Ancestrale de Torian Kel."
    },

    // ── ARRONAX ──────────────────────────────────────────────────────────────
    "26": {
        id: 26, nom: "Arronax", niveau: 50, race: "Elf", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/aronax.png",
        statsBase: { FO: 12, CN: 10, DX: 14, IN: 19, CH: 10 },
        lieu: "Le Néant",
        niveauMinJoueur: null,
        contrainte: "Le libérer de sa prison dans le Néant.",
        compInvesties: { esquive: 12, melee: 12 },
        rangsComp: { esquive: 2, melee: 2 },
        magieInvesties: { "Feu": 3, "Energie": 4 },
        techInvesties: {},
        temporaire: false, prndSlot: false,
        armeObligatoire: "deux_mains",
        restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AM19",
            torse: "DEF42",
            bottes: "DEF59",
            anneau: "BIJ05",
            amulette: "BIJ32"
        },
        notes: "Ne compte pas dans le max de compagnons. N'équipe que des armes à deux mains (bâtons uniquement)."
    },

    // ── GORGOTH ──────────────────────────────────────────────────────────────
    "27": {
        id: 27, nom: "Gorgoth", niveau: 50, race: "Human", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/Gorgoth.png",
        statsBase: { FO: 20, CN: 17, DX: 18, IN: 4, CH: 2 },
        lieu: "Le Néant",
        niveauMinJoueur: null,
        contrainte: "Le nourrir.",
        compInvesties: { esquive: 20, melee: 20 },
        rangsComp: { esquive: 3, melee: 2 },
        magieInvesties: {},
        techInvesties: {},
        temporaire: false, prndSlot: false,
        armeObligatoire: null,
        restrictionsEquip: ["main_droite", "main_gauche", "torse"],
        progressionRangs: [],
        equipement: {
            tete: "DEF52",
            bottes: "DEF65",
            gants: "DEF72",
            anneau: "BIJ17",
            amulette: "BIJ21"
        },
        notes: "Ne peut pas équiper : main droite, main gauche, torse. Ne compte pas dans le max de compagnons."
    },

    // ── COMPAGNONS TEMPORAIRES (XXX) ─────────────────────────────────────────

    "XXX1": {
        id: "XXX1", nom: "Cynthia Boggs", niveau: 20, race: "Human", sexe: "F",
        portrait: "./docs/img/portraits/compagnons/Cynthia_Boggs.png",
        statsBase: { FO: 8, CN: 9, DX: 15, IN: 14, CH: 8 },
        lieu: "Île du Désespoir",
        niveauMinJoueur: null,
        contrainte: "Temporaire — lors de la quête pour la libérer (Q40).",
        compInvesties: { esquive: 16, melee: 16, soins: 16 },
        rangsComp: {},
        magieInvesties: {},
        techInvesties: {},
        temporaire: true, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AM06",
            torse: "DEF30",
            bottes: "DEF59"
        },
        notes: "Compagnon temporaire uniquement durant Q40."
    },

    "XXX2": {
        id: "XXX2", nom: "Preste", niveau: 9, race: "Elf", sexe: "F",
        portrait: "./docs/img/portraits/compagnons/Preste.png",
        statsBase: { FO: 11, CN: 7, DX: 12, IN: 7, CH: 8 },
        lieu: "Qintarra",
        niveauMinJoueur: null,
        contrainte: "Temporaire — veut simplement rejoindre Tarante.",
        compInvesties: { esquive: 4, melee: 8 },
        rangsComp: {},
        magieInvesties: { "Air": 1, "Nécromancie blanche": 2, "Energie": 1 },
        techInvesties: {},
        temporaire: true, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AM20",
            torse: "DEF45",
            bottes: "DEF59"
        },
        notes: "Quitte le groupe une fois arrivée à Tarante."
    },

    "XXX3": {
        id: "XXX3", nom: "Doc Roberts", niveau: 30, race: "Human", sexe: "M",
        portrait: "./docs/img/portraits/compagnons/DocRoberts.png",
        statsBase: { FO: 9, CN: 10, DX: 12, IN: 18, CH: 8 },
        lieu: "Tristes Collines",
        niveauMinJoueur: null,
        contrainte: "Temporaire — pour la défense de la banque (Q05).",
        compInvesties: { armes_a_feu: 8, melee: 4, soins: 4 },
        rangsComp: {},
        magieInvesties: {},
        techInvesties: {},
        temporaire: true, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AF11",
            torse: "DEF30",
            bottes: "DEF59"
        },
        notes: "Compagnon temporaire uniquement durant Q05."
    },

    "XXX4": {
        id: "XXX4", nom: "Druella", niveau: 17, race: "Half-Elf", sexe: "F",
        portrait: "./docs/img/portraits/compagnons/Druella.png",
        statsBase: { FO: 6, CN: 8, DX: 9, IN: 12, CH: 20 },
        lieu: "Une forêt près de Dernholm",
        niveauMinJoueur: null,
        contrainte: "Temporaire — pour la quête du Maître de Mêlée (Q31).",
        compInvesties: { soins: 4, persuasion: 12 },
        rangsComp: {},
        magieInvesties: { "Méta": 1, "Nature": 2, "Nécromancie blanche": 1 },
        techInvesties: { "Botanique": 1, "Thérapeutique": 1 },
        temporaire: true, prndSlot: true,
        armeObligatoire: null, restrictionsEquip: [], progressionRangs: [],
        equipement: {
            main_droite: "AM23",
            torse: "DEF45",
            bottes: "DEF59",
            amulette: "BIJ28"
        },
        notes: "Compagnon temporaire uniquement durant Q31."
    }

};
