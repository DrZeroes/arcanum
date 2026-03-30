// ================= DONNÉES DE BASE =================
const racesData = {
    "Humain": { 
        FO:8, IN:8, CN:8, DX:8, CH:8, peutEtreFemme: true,
        mod: { align: 0, resPoison: 0, resPhys: 0 }
    },
    "Nain": { 
        FO:9, IN:8, CN:9, DX:7, CH:7, peutEtreFemme: false,
        mod: { align: -15, resPoison: 0, resPhys: 0, bonusCompCat: { cat: "Technologie", val: 2 } }
    },
    "Gnome": { 
        FO:8, IN:10, CN:6, DX:8, CH:8, peutEtreFemme: false,
        mod: { align: 0, resPoison: 0, resPhys: 0, bonusComp: { marchandage: 2 } }
    },
    "Halfelin": { 
        FO:5, IN:8, CN:8, DX:10, CH:8, peutEtreFemme: false,
        mod: { align: 0, resPoison: 0, resPhys: 0, bonusComp: { discretion: 2, esquive: 1, vol_a_la_tire:1 } }
    },
    "Ogre": { 
        FO:14, IN:2, CN:8, DX:8, CH:3, peutEtreFemme: false,
        mod: { align: 0, resPoison: 0, resPhys: 20, bonusComp: { discretion: -3 } }
    },
    "Demi-Ogre": { 
        FO:12, IN:4, CN:8, DX:8, CH:7, peutEtreFemme: false,
        mod: { align: 0, resPoison: 0, resPhys: 10, bonusComp: { discretion: -2 } }
    },
    "Elfe": { 
        FO:7, IN:9, CN:6, DX:9, CH:9, peutEtreFemme: true,
        mod: { align: 15, resPoison: 0, resPhys: 0, bonusCompCat: { cat: "Technologie", val: -2 } }
    },
    "Demi-Elfe": { 
        FO:8, IN:8, CN:7, DX:9, CH:9, peutEtreFemme: true,
        mod: { align: 5, resPoison: 0, resPhys: 0, bonusCompCat: { cat: "Technologie", val: -1 } }
    },
    "Orque": { 
        FO:10, IN:7, CN:10, DX:8, CH:4, peutEtreFemme: false,
        mod: { align: 0, resPoison: 20, resPhys: 0, bonusComp: { melee: 4 } }
    },
    "Demi-Orque": { 
        FO:9, IN:8, CN:9, DX:8, CH:6, peutEtreFemme: true,
        mod: { align: 0, resPoison: 10, resPhys: 0, bonusComp: { melee: 2, esquive: 2 } }
    }
	,
    "Bedokien": { 
        FO:7, IN:9, CN:8, DX:10, CH:6, peutEtreFemme: true,
        mod: { align: 10, resPoison: 15, resFeu:15, resPhys: 0, bonusComp: { arc: 3}, magieInit: { "Feu": 1 } }
    },
    "Elfe noire": { 
        FO:6, IN:11, CN:6, DX:7, CH:10, peutEtreFemme: true,
        mod: { align: 20, resPoison: 0, resPhys: 0, bonusComp: { discretion: 2, attaque_sournoise: 2 }, magieInit: { "Nécromancie noire": 1} }
    }
};

