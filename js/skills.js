const competencesData = {
    "Combat": [
        { id: "arc", nom: "Arc", stat: "DX", desc: "+5% de dégâts avec arc par point" },
        { id: "esquive", nom: "Esquive", stat: "DX", desc: "+1% de chance d'esquiver une attaque par point" },
        { id: "melee", nom: "Mêlée", stat: "DX", desc: "+5% de dégâts en mêlée et corps à corps par point" },
        { id: "lancer", nom: "Lancer", stat: "DX", desc: "+5% de dégâts avec explosifs et armes de jet par point" }
    ],
    "Vol": [
        { id: "attaque_sournoise", nom: "Attaque sournoise", stat: "DX", desc: "+10% de dégâts à la 1ère attaque par point ; +10% vitesse avant la 1ère action" },
        { id: "vol_a_la_tire", nom: "Vol à la tire", stat: "DX", desc: "+4% de chance de réussite par point" },
        { id: "discretion", nom: "Discrétion", stat: "DX", desc: "+2% de chance de ne pas pouvoir être ciblé au 1er tour par point" },
        { id: "detection_piege", nom: "Détection de Piège", stat: "IN", desc: "+5% de chance de révéler un piège ; -2% de dégâts si piège déclenché par point" }
    ],
    "Social": [
        { id: "jeu", nom: "Jeu", stat: "IN", desc: "+5% de chance de gagner un pari par point ; augmente la mise des PNJ" },
        { id: "marchandage", nom: "Marchandage", stat: "IN", desc: "-2% à l'achat, +2% à la revente par point" },
        { id: "soins", nom: "Soins", stat: "IN", desc: "+5% d'efficacité des potions et objets de soin par point" },
        { id: "persuasion", nom: "Persuasion", stat: "CH", desc: "+2% d'XP et d'or en récompense de quêtes par point" }
    ],
    "Technologie": [
        { id: "reparation", nom: "Réparation", stat: "IN", desc: "Répare les objets ; -1% de perte de durabilité max tous les 2 points (base 15%)" },
        { id: "armes_a_feu", nom: "Armes à feu", stat: "IN", desc: "+5% de dégâts avec armes à feu par point" },
        { id: "crochetage", nom: "Crochetage", stat: "DX", desc: "+5% de chance de réussite ; -5% de chance de casser le passe-partout par point" },
        { id: "desamorcage", nom: "Désamorçage de piège", stat: "IN", desc: "+5% de chance de désamorcer un piège par point" }
    ],
};

// ── RANGS DE COMPÉTENCES ──────────────────────────────────────────────────────
// Points investis (0-20) → rang débloqué par un entraîneur (apprenti/expert/maître)
// Le rang applique un multiplicateur sur la valeur investie dans la skill.
const RANGS = {
    0: { nom: "—",        abbr: "",  color: "transparent", txtColor: "#666",    mult: 1.0 },
    1: { nom: "Apprenti", abbr: "A", color: "#2a5fa5",      txtColor: "#c8dfff", mult: 1.25 },
    2: { nom: "Expert",   abbr: "E", color: "#8a6d00",      txtColor: "#ffe896", mult: 1.5  },
    3: { nom: "Maître",   abbr: "M", color: "#7a1a1a",      txtColor: "#ffb3b3", mult: 2.0  }
};

// Points minimum requis dans la skill pour qu'un entraîneur accepte de former le joueur
const SEUILS_RANGS = { 1: 1, 2: 9, 3: 18 };

// Retourne la valeur effective d'une compétence (investie × multiplicateur de rang)
function getEffectiveComp(id) {
    const investi = (perso.compInvesties && perso.compInvesties[id]) || 0;
    const rang    = (perso.rangsComp    && perso.rangsComp[id])    || 0;
    return Math.round(investi * (RANGS[rang]?.mult ?? 1.0));
}

// ── EFFETS DE RANG PAR COMPÉTENCE ────────────────────────────────────────────
// Lookup des effets passifs débloqués selon le rang atteint dans chaque skill.
const RANG_EFFETS = {
    arc:               { 1: { vitesse: 5 },           2: { actionsParTour: 2 },          3: { degatsMax: true } },
    melee:             { 1: { vitesse: 5 },           2: { perforationArmure: 0.25 },    3: { pasEchecCritique: true } },
    lancer:            { 1: { vitesse: 5 },           2: { bonusDegats: 0.5 },           3: { degatsMax: true } },
    armes_a_feu:       { 1: { vitesse: 5 },           2: { bonusDegats: 0.10 },          3: { degatsMax: true } },
    attaque_sournoise: { 1: { percerArmure: true },   2: { percerArmureTousTypes: true }, 3: { seuilCritique: 20 } },
    esquive:           { 1: { bonusEsquive: 5 },      2: { bonusEsquive: 10 },           3: { bonusEsquive: 20 } },
    vol_a_la_tire:     { 1: { echecMin: 5 },          2: { penalitesTaille: 0.5 },       3: { inattrappable: true } },
    discretion:        { 1: { bonusDiscretion: 3 },   2: { bonusDiscretion: 7 },         3: { bonusDiscretion: 15 } },
    detection_piege:   { 1: { bonusDetection: 5 },    2: { bonusDetection: 10 },         3: { secondeChance: true } },
    jeu:               { 1: { bonusMise: 0.10 },      2: { misierEquipement: true },     3: { misierNonVendable: true } },
    marchandage:       { 1: { reductionSupp: 0.05 },  2: { tousArticles: true },         3: { articlesHorsVente: true } },
    soins:             { 1: { bonusSoins: 0.5 },      2: { pasEchecCritique: true },     3: { toujoursReussiteCritique: true } },
    persuasion:        { 1: { bonusXp: 0.05 },        2: { slotCompagnon: 1 },           3: { pasPrerequis: true } },
    reparation:        { 1: { degradation: 5 },       2: { degradation: 1 },             3: { degradation: 0 } },
    crochetage:        { 1: { pasCoutTour: true },    2: { bonusCrochetage: 5 },         3: { bonusCrochetage: 25 } },
    desamorcage:       { 1: { bonusDesamorcage: 5 },  2: { seuilCritique: 4 },           3: { secondeChance: true } },
};

/** Retourne le rang actuel d'une compétence pour un objet joueur (défaut : window.perso). */
function _getRang(skillId, p) {
    const obj = p || window.perso;
    return (obj?.rangsComp?.[skillId]) || 0;
}

/** Retourne l'objet d'effets de rang pour un skill et un rang donnés (ou {} si inexistant). */
function _getRangEffet(skillId, rang) {
    return (typeof RANG_EFFETS !== 'undefined' && RANG_EFFETS[skillId]?.[rang]) || {};
}
