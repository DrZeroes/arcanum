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
        FO:8, IN:10, CN:6, DX:8, CH:8, peutEtreFemme: true,
        mod: { align: 0, resPoison: 0, resPhys: 0, bonusComp: { marchandage: 2 } }
    },
    "Halfelin": { 
        FO:5, IN:8, CN:8, DX:10, CH:8, peutEtreFemme: true,
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




let perso = {}; 
let statsCalculees = {}; 

// ================= INITIALISATION =================
window.onload = function() {
    // 1. Initialisation des menus (ton code existant)
    const raceSelect = document.getElementById('raceSelect');
    if (raceSelect) {
        for (let r in racesData) {
            let o = document.createElement('option');
            o.value = r; o.innerText = r;
            raceSelect.appendChild(o);
        }
        document.getElementById('raceSelect').addEventListener('change', buildChar);
        document.getElementById('sexeSelect').addEventListener('change', buildChar);
        document.getElementById('bgSelect').addEventListener('change', buildChar);
    }

    // 2. TENTATIVE DE RÉCUPÉRATION AUTO
    const sauvegarde = localStorage.getItem('arcanum_sauvegarde');
    if (sauvegarde) {
        perso = JSON.parse(sauvegarde); // On remplit la variable perso avec la sauvegarde
        console.log("Personnage récupéré automatiquement !");
    }

    // 3. On initialise les interfaces
    if (typeof competencesData !== 'undefined') initCompetencesUI();
    if (typeof magieData !== 'undefined') initMagieUI();
    if (typeof techData !== 'undefined') initTechUI();

    // 4. On affiche l'accueil (qui affichera "Continuer" grâce au point 2)
    allerAccueil(); 
};
// ================= NAVIGATION =================
function cacherTout() {
    // Liste complète de tous les écrans de ton interface
    const ecrans = [
        'ecran-accueil', 
        'ecran-creation', 
        'ecran-fiche', 
        'ecran-inventaire', 
        'ecran-fouille',   // AJOUTÉ
        'ecran-marchand' ,  // AJOUTÉ
		'ecran-craft' ,     // <--- AJOUTE CETTE LIGNE !
		'ecran-aide'       // <--- AJOUTE CETTE LIGNE !
    ];

    ecrans.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
}
function allerAccueil() {
    cacherTout();
    document.getElementById('ecran-accueil').style.display = 'block';
    const sauvegarde = localStorage.getItem('arcanum_sauvegarde');
    const btnLoad = document.getElementById('btn-load');
    if (sauvegarde) {
        const data = JSON.parse(sauvegarde);
        btnLoad.innerText = "Continuer avec " + data.nom;
        btnLoad.style.background = "#4caf50";
        btnLoad.disabled = false;
    } else {
        btnLoad.innerText = "Aucune sauvegarde";
        btnLoad.style.background = "#444";
        btnLoad.disabled = true;
    }
}



function ouvrirAide() {
    cacherTout();
    document.getElementById('ecran-aide').style.display = 'block';
}

function nouveauPersonnage() {
    // 1. Sécurité anti-écrasement
    if (perso && perso.nom && perso.nom !== "Nom du Personnage" && perso.nom !== "") {
        if (!confirm("Attention : Créer un nouveau personnage effacera votre progression. Continuer ?")) {
            return;
        }
    }

    // 2. Réinitialisation complète des données (Inventaire, Argent, Equipement)
    perso = {
        nom: "Nom du Personnage",
        race: "Humain",
        background: "Aucun",
        statsBase: { FO: 8, IN: 8, CN: 8, DX: 8, CH: 8 },
        statsInvesties: { FO: 0, IN: 0, CN: 0, DX: 0, CH: 0 },
        pointsDeCompetence: 5,
        niveau: 1,
        experience: 0,
        argent: 400,
        inventaire: [], // On vide le sac proprement
        equipement: { tete: null, torse: null, gants: null, bottes: null, anneau: null, amulette: null, main_droite: null, main_gauche: null }
    };

    // 3. Affichage de l'écran de création
    cacherTout();
    let ecranCrea = document.getElementById('ecran-creation');
    if (ecranCrea) ecranCrea.style.display = 'block';
    
    // On vide le champ texte du nom
    let inputNom = document.getElementById('charName');
    if (inputNom) inputNom.value = "";
    
    // 4. On lance le calcul des stats de départ (Race + BG)
    if (typeof buildChar === "function") buildChar(); 
    if (typeof rafraichirAccueil === "function") rafraichirAccueil();
}


function chargerPersonnage() {
    const sauvegarde = localStorage.getItem('arcanum_sauvegarde');
    if (sauvegarde) {
        perso = JSON.parse(sauvegarde);
        cacherTout();
        document.getElementById('ecran-fiche').style.display = 'block';
        updateFicheUI(); 
        
        // On vérifie le bouton craft au chargement
        if (typeof verifierBoutonCraft === "function") verifierBoutonCraft();
    }
}

// ================= CRÉATION =================
function buildChar() {
    const rKey = document.getElementById('raceSelect').value;
    const race = racesData[rKey];
    const sexeSelect = document.getElementById('sexeSelect');
    const bgSelect = document.getElementById('bgSelect');

    const currentSex = sexeSelect.value;
    sexeSelect.innerHTML = '<option value="M">Masculin</option>';
    if (race.peutEtreFemme) {
        sexeSelect.innerHTML += '<option value="F">Féminin</option>';
        sexeSelect.value = (currentSex === "F") ? "F" : "M";
    } else { sexeSelect.value = "M"; }

    let final = { FO: race.FO, IN: race.IN, CN: race.CN, DX: race.DX, CH: race.CH };
    if (sexeSelect.value === "F") {
        final.CN += 1; final.CH += 1; final.FO -= 1; final.DX -= 1;
    }

    const lastBg = bgSelect.value;
    bgSelect.innerHTML = "";
    
    if (typeof backgrounds !== 'undefined') {
        backgrounds.forEach(bg => {
            let allow = true;
            if (bg.rest.sexe && bg.rest.sexe !== sexeSelect.value) allow = false;
            if (bg.rest.races && !bg.rest.races.includes(rKey)) allow = false;
            if (bg.rest.pasRaces && bg.rest.pasRaces.includes(rKey)) allow = false;
            if (allow) {
                let o = document.createElement('option');
                o.value = bg.nom; o.innerText = bg.nom;
                if(bg.nom === lastBg) o.selected = true;
                bgSelect.appendChild(o);
            }
        });

        const currentBg = backgrounds.find(b => b.nom === bgSelect.value) || backgrounds[0];
        if (currentBg.mod) {
            for (let s in currentBg.mod) {
                if (final.hasOwnProperty(s)) final[s] += currentBg.mod[s];
            }
        }
        document.getElementById('desc-box').innerText = currentBg.desc;
document.getElementById('raceTraits').innerHTML = `<strong>Effets :</strong> ${currentBg.effets || "Aucun"}`;    }

    statsCalculees = final; 
    for (let s in final) { 
        let el = document.getElementById('val-' + s);
        if(el) el.innerText = final[s]; 
    }
    document.getElementById('pv-total').innerText = (final.FO * 2) + final.IN;
    document.getElementById('fatigue-total').innerText = (final.CN * 2) + final.IN;
	
	
	
// À la fin de la fonction buildChar()
const currentBg = backgrounds.find(b => b.nom === bgSelect.value) || backgrounds[0];
// Règle des 400 Or par défaut
const argentDepart = (currentBg.mod && currentBg.mod.argent !== undefined) ? currentBg.mod.argent : 400;



// On l'ajoute visuellement dans la zone de traits
document.getElementById('raceTraits').innerHTML = `
    <strong>Effets :</strong> ${currentBg.effets || "Aucun"} | 
    <strong>Argent :</strong> ${argentDepart} Or
`;


	
}



function validerCreation() {
    const nom = document.getElementById('charName').value.trim();
    if (nom === "") { alert("Veuillez entrer un nom !"); return; }

    const rKey = document.getElementById('raceSelect').value;
    const race = racesData[rKey];
    const bgName = document.getElementById('bgSelect').value;
    const bg = backgrounds.find(b => b.nom === bgName) || { mod: {} };

    perso = {
        nom: nom,
        race: rKey,
        sexe: document.getElementById('sexeSelect').value,
        antecedent: bgName,
        niveau: 1,
        pointsDispo: 5,
        argent: (bg.mod && bg.mod.argent !== undefined) ? bg.mod.argent : 400,
        boostVitesseInne: (bg.mod && bg.mod.vitesse) ? bg.mod.vitesse : 0,
        boostPV: 0, boostFT: 0,
        boostPVBase: 0, boostFTBase: 0,
        statsBase: JSON.parse(JSON.stringify(statsCalculees)), 
        statsInvesties: { FO:0, IN:0, CN:0, DX:0, CH:0 },
        compInvesties: {}, 
        compBase: {},
        magieInvesties: {},
        techInvesties: {},
        bonusInnes: {
            align: (race.mod.align || 0) + (bg.mod.align || 0),
            resPhys: (race.mod.resPhys || 0) + (bg.mod.resPhys || 0),
            resPoison: (race.mod.resPoison || 0) + (bg.mod.resPoison || 0),
            resMagie: (race.mod.resMagie || 0) + (bg.mod.resMagie || 0), 
            resFeu: (race.mod.resFeu || 0) + (bg.mod.resFeu || 0),       
            resElec: (race.mod.resElec || 0) + (bg.mod.resElec || 0)     
        }
    };
    
    if (!perso.inventaire) perso.inventaire = [];
    if (!perso.equipement) perso.equipement = {
        tete: null, torse: null, gants: null, bottes: null, 
        anneau: null, amulette: null, main_droite: null, main_gauche: null
    };

    const appliquerComp = (source) => {
        if (!source) return;
        if (source.bonusComp) {
            for (let id in source.bonusComp) {
                perso.compBase[id] = (perso.compBase[id] || 0) + source.bonusComp[id];
                perso.compInvesties[id] = (perso.compInvesties[id] || 0) + source.bonusComp[id];
            }
        }
        if (source.bonusCompCat) {
            const cat = source.bonusCompCat.cat;
            const val = source.bonusCompCat.val;
            if (competencesData[cat]) {
                competencesData[cat].forEach(c => {
                    perso.compBase[c.id] = (perso.compBase[c.id] || 0) + val;
                    perso.compInvesties[c.id] = (perso.compInvesties[c.id] || 0) + val;
                });
            }
        }
    };

    appliquerComp(race.mod);
    appliquerComp(bg.mod);

    if (!perso.techInvesties) perso.techInvesties = {};
    if (!perso.magieInvesties) perso.magieInvesties = {};

    const ajouterPointsInit = (source) => {
        if (source && source.techInit) {
            for (let discipline in source.techInit) {
                perso.techInvesties[discipline] = source.techInit[discipline];
            }
        }
        if (source && source.magieInit) {
            for (let ecole in source.magieInit) {
                perso.magieInvesties[ecole] = source.magieInit[ecole];
            }
        }
    };

    ajouterPointsInit(race.mod);
    ajouterPointsInit(bg.mod);

    localStorage.setItem('arcanum_sauvegarde', JSON.stringify(perso));
    
    // On affiche la fiche de personnage et on arrête là !
    cacherTout();
    document.getElementById('ecran-fiche').style.display = 'block';
    updateFicheUI();
    rafraichirAccueil(); 
}













// ================= MISE À JOUR FICHE =================
function updateFicheUI() {
    const container = document.getElementById('ecran-fiche');
    if (!container || !perso) return;

    // 1. Sécurités et Initialisation
    if (!perso.bonusInnes) perso.bonusInnes = { align: 0, resPhys: 0, resPoison: 0, resMagie: 0, resFeu: 0, resElec: 0 };
    if (perso.pointsDispo === undefined) perso.pointsDispo = 0;
    const b = perso.bonusInnes; // On définit 'b' tôt pour pouvoir l'utiliser

    // 2. Gestion des points dispos
    container.classList.toggle('no-points', perso.pointsDispo <= 0);
    document.getElementById('points-dispo').innerText = perso.pointsDispo;

    // 3. Header & Fortune
    document.getElementById('fiche-name').innerText = perso.nom || "";
    document.getElementById('fiche-level').innerText = perso.niveau || 1;
    document.getElementById('fiche-race').innerText = perso.race || "";
    document.getElementById('fiche-sexe').innerText = perso.sexe === 'M' ? 'Masculin' : 'Féminin';
    document.getElementById('fiche-bg').innerText = perso.antecedent || "";
    if (document.getElementById('fiche-argent')) document.getElementById('fiche-argent').innerText = perso.argent ?? 400;

    // 4. STATISTIQUES
    let finalStats = {};
    const statsKeys = ['FO', 'IN', 'CN', 'DX', 'CH'];
    statsKeys.forEach(s => {
        let total = (perso.statsBase[s] || 0) + (perso.statsInvesties[s] || 0);
        finalStats[s] = total; 
        let elVal = document.getElementById('fiche-val-' + s);
        if(elVal) {
            elVal.innerText = total;
            elVal.style.color = (perso.statsInvesties[s] > 0) ? "#4caf50" : "#fff";
            let btnMoins = document.getElementById('btn-moins-' + s); 
            if (btnMoins) btnMoins.style.visibility = (perso.statsInvesties[s] > 0) ? "visible" : "hidden";
        }
    });

    // 5. LECTURE DES BONUS D'ÉQUIPEMENT (Important pour l'épée enchantée)
    let bonusArmure = 0, bonusResPhys = 0, bonusResMagie = 0, bonusFT = 0;
    for (let slot in perso.equipement) {
        let itemEq = perso.equipement[slot];
        if (itemEq && itemsData[itemEq.id]) {
            let data = itemsData[itemEq.id];
            if (data.armure) bonusArmure += data.armure;
            if (data.stats) {
                bonusResMagie += (data.stats.resMagie || 0);
                bonusResPhys += (data.stats.resPhys || 0);
                bonusFT += (data.stats.FT || 0);
            }
        }
    }

    // 6. VITALITÉ (PV / FATIGUE)
    let statFO = finalStats.FO || 8;
    let statCN = finalStats.CN || 8;
    let statIN = finalStats.IN || 8;

    let pvTotal = (statFO * 2) + statIN + (perso.boostPV || 0);
    // On ajoute bonusFT ici pour l'épée !
    let ftTotal = (statCN * 2) + statIN + (perso.boostFT || 0) + bonusFT;

    if (document.getElementById('fiche-pv')) document.getElementById('fiche-pv').innerText = pvTotal;
    if (document.getElementById('fiche-fatigue')) {
        const elFt = document.getElementById('fiche-fatigue');
        elFt.innerText = ftTotal;
        elFt.style.color = (bonusFT > 0) ? "#4caf50" : "#fff"; // Vert si boosté par item
    }

    // 7. RÉSISTANCES (Fonction de mise à jour)
    const setRes = (id, valBase, valBonus) => {
        const el = document.getElementById(id);
        if (el) {
            let total = (valBase || 0) + (valBonus || 0);
            el.innerText = total + "%";
            el.style.color = (valBonus > 0) ? "#4caf50" : "#fff";
        }
    };

    setRes('res-degats', b.resPhys, bonusResPhys);
    setRes('res-poison', b.resPoison, 0); 
    setRes('res-sorts', b.resMagie, bonusResMagie); 
    setRes('res-feu', b.resFeu, 0); 
    setRes('res-elec', b.resElec, 0);

    // 8. CALCULS DÉRIVÉS
    let statDX = finalStats.DX || 8;
    let statCH = finalStats.CH || 8;

    let poidsActuel = (typeof updateInventaireUI === 'function') ? updateInventaireUI() : 0;
    let chargeMax = (statFO * 2);
    let elCharge = document.getElementById('der-charge');
    if (elCharge) {
        elCharge.innerText = poidsActuel.toFixed(1) + " / " + chargeMax + " kg";
        elCharge.style.color = (poidsActuel > chargeMax) ? "#f44336" : "#fff";
    }
    
    const elDegats = document.getElementById('der-degats');
    if (elDegats) {
        let modifFo = (statFO > 10) ? (statFO - 10) : (statFO < 10 ? Math.floor((statFO - 10) / 2) : 0);
        elDegats.innerText = (modifFo >= 0 ? "+" : "") + modifFo;
    }

    if (document.getElementById('der-armure')) {
        document.getElementById('der-armure').innerText = statDX + bonusArmure;
        document.getElementById('der-armure').style.color = (bonusArmure > 0) ? "#4caf50" : "#fff";
    }
    
    if (document.getElementById('der-vitesse')) document.getElementById('der-vitesse').innerText = statDX + (perso.boostVitesseInne || 0);
    if (document.getElementById('der-guerison')) document.getElementById('der-guerison').innerText = Math.floor(statCN / 3);
    if (document.getElementById('der-toxines')) document.getElementById('der-toxines').innerText = statCN;
    
    const elReaction = document.getElementById('der-reaction');
    if (elReaction) {
        let react = statCH - 8;
        elReaction.innerText = (react > 0 ? "+" : "") + react;
    }
    if (document.getElementById('der-compagnons')) document.getElementById('der-compagnons').innerText = Math.max(1, Math.floor(statCH / 4));

    // 9. COMPÉTENCES, MAGIE, TECH
    if (typeof competencesData !== 'undefined') {
        for (let cat in competencesData) {
            competencesData[cat].forEach(c => {
                let id = c.id;
                let act = (perso.compInvesties && perso.compInvesties[id]) ? perso.compInvesties[id] : 0;
                let el = document.getElementById('fiche-val-' + id);
                if (el) el.innerText = act;
            });
        }
    }
    if (typeof magieData !== 'undefined') updateMagieUI_Display();
    if (typeof techData !== 'undefined') updateTechUI_Display();
    
    // 10. ALIGNEMENT
    let align = calculerAlignement();
    let needle = document.getElementById('meter-needle');
    let score = document.getElementById('meter-score');
    if (needle) needle.style.top = (50 - (align / 2)) + "%";
    if (score) {
        score.innerText = (align > 0 ? "+" : "") + align;
        score.style.color = align > 0 ? "#2196f3" : (align < 0 ? "#ff9800" : "#dcdcdc");
    }
}




// ================= LOGIQUE STATS & VITALITÉ =================
function modStat(stat, val) {
    if (val > 0 && perso.pointsDispo <= 0) return;
    if (val < 0 && (perso.statsInvesties[stat] || 0) <= 0) return;
    perso.statsInvesties[stat] = (perso.statsInvesties[stat] || 0) + val;
    perso.pointsDispo -= val;
    updateFicheUI();
}

function boostVital(type, valeur) {
    if (valeur > 0 && perso.pointsDispo <= 0) return;
    if (type === 'PV') {
        let base = perso.boostPVBase || 0;
        if (valeur < 0 && (perso.boostPV || 0) <= base) return;
        perso.boostPV = (perso.boostPV || 0) + valeur;
    } else {
        let base = perso.boostFTBase || 0;
        if (valeur < 0 && (perso.boostFT || 0) <= base) return;
        perso.boostFT = (perso.boostFT || 0) + valeur;
    }
    perso.pointsDispo -= (valeur > 0 ? 1 : -1);
    updateFicheUI();
}

// ================= GESTION COMPÉTENCES =================
function initCompetencesUI() {
    const tabComp = document.getElementById('tab-comp');
    if (!tabComp) return;
    tabComp.innerHTML = '<div class="sub-tabs"></div><div class="sub-contents"></div>';
    let isFirst = true;
    for (let cat in competencesData) {
        let btn = document.createElement('button');
        btn.className = 'sub-tab-btn' + (isFirst ? ' active' : '');
        btn.innerText = cat;
        btn.onclick = function() { switchSubTab(cat); };
        tabComp.querySelector('.sub-tabs').appendChild(btn);

        let div = document.createElement('div');
        div.id = 'sub-tab-' + cat.replace(/\s+/g, '');
        div.className = 'sub-tab-content' + (isFirst ? ' active' : '');
        competencesData[cat].forEach(c => {
div.innerHTML += `<div class="skill-row">
            <div class="skill-name">${c.nom} <span class="skill-stat-tag">${c.stat}</span></div>
            <button id="btn-moins-${c.id}" class="btn-stat btn-moins edit-only" onclick="modComp('${c.id}', -4)">-</button>
            <span id="fiche-val-${c.id}" class="stat-value">0</span>
            <button class="btn-stat btn-plus edit-only" onclick="modComp('${c.id}', 4)">+</button>
        </div>`;
        });
        tabComp.querySelector('.sub-contents').appendChild(div);
        isFirst = false;
    }
}

function switchSubTab(cat) {
    document.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.toggle('active', b.innerText === cat));
    document.querySelectorAll('.sub-tab-content').forEach(c => c.classList.toggle('active', c.id === 'sub-tab-' + cat.replace(/\s+/g, '')));
}

function modComp(id, val) {
  if (!perso.compInvesties) perso.compInvesties = {};
    // Utilise pointsDispo pour correspondre à ton objet perso
    if (val > 0 && (perso.pointsDispo || 0) <= 0) return; 
    
    let act = perso.compInvesties[id] || 0;
    let base = (perso.compBase && perso.compBase[id]) ? perso.compBase[id] : 0;
    
    if (val < 0 && act <= base) return;
    if (val > 0 && act >= 20) return;
    
    // --- VÉRIFICATION DES PRÉREQUIS ---
    if (val > 0) {
        let statL = "";
        // On trouve quelle statistique (IN ou DX) gère cette compétence
        for (let cat in competencesData) {
            let f = competencesData[cat].find(c => c.id === id);
            if (f) { statL = f.stat; break; }
        }

        // On calcule le palier d'achat (0 clics, 1 clic, 2 clics...)
        // Le bonus de race (base) ne compte pas pour la restriction de stat
        let pointsInvestisReels = act - base; 
        let palier = Math.floor(pointsInvestisReels / 4);
        
        // Paliers Arcanum : pour acheter le 1er rang (4 pts) il faut 7, le 2eme 11, etc.
        const preRequisStats = [0, 7, 11, 15, 18]; 
        let req = preRequisStats[palier];

        let currentStatVal = (perso.statsBase[statL] || 0) + (perso.statsInvesties[statL] || 0);

        if (currentStatVal < req) { 
            alert(`Statistique ${statL} insuffisante. Requis: ${req}`); 
            return; 
        }
    }

    // --- APPLICATION ---
  perso.compInvesties[id] = act + val;
    perso.pointsDispo -= (val > 0 ? 1 : -1);
    updateFicheUI();
}


// ================= GESTION MAGIE =================

function initMagieUI() {
    const tab = document.getElementById('tab-magie');
    if (!tab) return;
    tab.innerHTML = '<div class="magic-tabs"></div><div class="magic-contents"></div>';
    const icons = {"Déplacement":"🌀","Divination":"👁️","Air":"💨","Terre":"🪨","Feu":"🔥","Eau":"💧","Energie":"⚡","Mental":"🧠","Méta":"💠","Transformation":"🦋","Nature":"🌿","Nécromancie noire":"💀","Nécromancie blanche":"🕊️","Illusion":"🎭","Invocation":"👹","Temporel":"⏳"};
    let isFirst = true;
    for (let ecole in magieData) {
        let btn = document.createElement('button');
		// AJOUTE CETTE LIGNE JUSTE ICI :
        btn.id = 'tab-btn-magie-' + ecole.replace(/\s+/g, '');
        btn.className = 'magic-tab-btn' + (isFirst ? ' active' : '');
        btn.innerText = icons[ecole] || "🪄"; btn.title = ecole;
        btn.onclick = function() { switchMagicTab(ecole); };
        tab.querySelector('.magic-tabs').appendChild(btn);

        let pane = document.createElement('div');
        pane.id = 'magic-pane-' + ecole.replace(/\s+/g, '');
        pane.className = 'magic-content-pane' + (isFirst ? ' active' : '');
        pane.innerHTML = `<div class="magic-school-header"><strong>${ecole}</strong>
            <button id="btn-moins-magie-${ecole.replace(/\s+/g, '')}" class="btn-stat edit-only" onclick="modMagie('${ecole}', -1)">-</button>
            <span id="magie-val-${ecole.replace(/\s+/g, '')}">0/5</span>
            <button class="btn-stat edit-only" onclick="modMagie('${ecole}', 1)">+</button></div>
            <div id="spells-${ecole.replace(/\s+/g, '')}"></div>`;
        magieData[ecole].sorts.forEach((s, i) => {
            pane.querySelector(`#spells-${ecole.replace(/\s+/g, '')}`).innerHTML += `<div id="spell-${ecole.replace(/\s+/g, '')}-${i}" class="spell-item">
                <strong>${s.nom}</strong> (Fatigue: ${s.cout})<br><em>${s.desc}</em></div>`;
        });
        tab.querySelector('.magic-contents').appendChild(pane);
        isFirst = false;
    }
}

function updateMagieUI_Display() {
    for (let e in magieData) {
        let act = (perso.magieInvesties && perso.magieInvesties[e]) ? perso.magieInvesties[e] : 0;
        let id = e.replace(/\s+/g, ''); 

        // --- AJOUT : Allumer/Éteindre l'icône de l'onglet ---
        let tabBtn = document.getElementById('tab-btn-magie-' + id);
        if (tabBtn) {
            if (act > 0) tabBtn.classList.add('has-points'); // Utilise ta classe CSS
            else tabBtn.classList.remove('has-points');
        }

        let el = document.getElementById('magie-val-' + id);
        if (el) el.innerText = act + "/5";
        
        for (let i = 0; i < 5; i++) {
            let sDiv = document.getElementById(`spell-${id}-${i}`);
            if (sDiv) {
                if (i < act) sDiv.classList.add('learned');
                else sDiv.classList.remove('learned');
            }
        }
    }
}

function switchMagicTab(e) {
    document.querySelectorAll('.magic-tab-btn').forEach(b => b.classList.toggle('active', b.title === e));
    document.querySelectorAll('.magic-content-pane').forEach(p => p.classList.toggle('active', p.id === 'magic-pane-' + e.replace(/\s+/g, '')));
}

function modMagie(e, v) {
    if (!perso.magieInvesties) perso.magieInvesties = {};
    let act = perso.magieInvesties[e] || 0;
    if (v > 0) {
        if (perso.pointsDispo <= 0 || act >= 5) return;
        let s = magieData[e].sorts[act];
        // Calcul de l'intelligence totale (Base + Investie)
        let intel = (perso.statsBase.IN || 8) + (perso.statsInvesties.IN || 0);
        if (perso.niveau < s.niv || intel < s.int) { 
            alert("Niveau ou Intelligence insuffisante pour ce sort !"); 
            return; 
        }
        perso.magieInvesties[e] = act + 1; 
        perso.pointsDispo--;
    } else {
        let base = (perso.magieBase && perso.magieBase[e]) ? perso.magieBase[e] : 0;
        if (act <= base) return;
        perso.magieInvesties[e] = act - 1; 
        perso.pointsDispo++;
    }
    updateFicheUI();
}


// ================= GESTION TECH =================

function initTechUI() {
    const tab = document.getElementById('tab-tech');
    if (!tab) return;
    tab.innerHTML = '<div class="magic-tabs"></div><div class="magic-contents"></div>';
    const icons = {"Forge":"⚒️","Mécanique":"⚙️","Armurerie":"🔫","Electricité":"⚡","Botanique":"🌱","Thérapeutique":"💊","Chimie":"🧪","Explosifs":"💣"};
    let isFirst = true;
    
    for (let d in techData) {
        // On crée le bouton UNE SEULE FOIS
        let btn = document.createElement('button');
        btn.id = 'tab-btn-tech-' + d.replace(/\s+/g, '');
        btn.className = 'magic-tab-btn' + (isFirst ? ' active' : '');
        btn.innerText = icons[d] || "🔧"; 
        btn.title = d;
        btn.onclick = function() { switchTechTab(d); };
        tab.querySelector('.magic-tabs').appendChild(btn);

        let pane = document.createElement('div');
        pane.id = 'tech-pane-' + d.replace(/\s+/g, '');
        pane.className = 'magic-content-pane' + (isFirst ? ' active' : '');
        pane.innerHTML = `<div class="magic-school-header"><strong>${d}</strong>
            <button id="btn-moins-tech-${d.replace(/\s+/g, '')}" class="btn-stat edit-only" onclick="modTech('${d}', -1)">-</button>
            <span id="tech-val-${d.replace(/\s+/g, '')}">0/7</span>
            <button class="btn-stat edit-only" onclick="modTech('${d}', 1)">+</button></div>
            <div id="schemas-${d.replace(/\s+/g, '')}"></div>`;
            
        // --- C'EST ICI QUE ÇA SE PASSE ---
        techData[d].schematics.forEach((s, i) => {
            // On gère les composants du schéma actuel "s"
            let texteCompo = Array.isArray(s.compo) ? s.compo.join(" + ") : s.compo;

            // On ajoute le texteCompo dans le HTML au lieu de s.compo
            pane.querySelector(`#schemas-${d.replace(/\s+/g, '')}`).innerHTML += `<div id="schema-${d.replace(/\s+/g, '')}-${i}" class="spell-item">
                <strong>${s.nom}</strong> (Compos : ${texteCompo})<br><em>${s.desc}</em></div>`;
        });
        
        tab.querySelector('.magic-contents').appendChild(pane);
        isFirst = false;
    }
}


function updateTechUI_Display() {
    for (let d in techData) {
        let act = (perso.techInvesties && perso.techInvesties[d]) ? perso.techInvesties[d] : 0;
        let id = d.replace(/\s+/g, '');

        // Allume l'onglet
        let tabBtn = document.getElementById('tab-btn-tech-' + id);
        if (tabBtn) {
            if (act > 0) tabBtn.classList.add('has-points');
            else tabBtn.classList.remove('has-points');
        }

        // Met à jour le texte (ex: 2/7)
        let el = document.getElementById('tech-val-' + id);
        if (el) el.innerText = act + "/7";
        
        // Allume les schémas appris dans la liste
        for (let i = 0; i < 7; i++) {
            let sDiv = document.getElementById(`schema-${id}-${i}`);
            if (sDiv) {
                if (i < act) sDiv.classList.add('learned');
                else sDiv.classList.remove('learned');
            }
        }
    }
}


function switchTechTab(d) {
    const tab = document.getElementById('tab-tech');
    tab.querySelectorAll('.magic-tab-btn').forEach(b => b.classList.toggle('active', b.title === d));
    tab.querySelectorAll('.magic-content-pane').forEach(p => p.classList.toggle('active', p.id === 'tech-pane-' + d.replace(/\s+/g, '')));
}

function modTech(d, v) {
    if (!perso.techInvesties) perso.techInvesties = {};
    let act = perso.techInvesties[d] || 0;
    
    if (v > 0) {
        if (perso.pointsDispo <= 0 || act >= 7) return;
        let intel = perso.statsBase.IN + (perso.statsInvesties.IN || 0);
        if (intel < techData[d].schematics[act].int) { alert("IN insuffisante"); return; }
        perso.techInvesties[d] = act + 1; 
        perso.pointsDispo--;
    } else {
        let base = (perso.techBase && perso.techBase[d]) ? perso.techBase[d] : 0;
        if (act <= base) return;
        perso.techInvesties[d] = act - 1; 
        perso.pointsDispo++;
    }
    
    updateFicheUI(); // Met à jour tes points et tes stats
    verifierBoutonCraft(); // <--- NOUVEAU : Vérifie si on doit afficher le bouton Craft
}


// ================= ALIGNEMENT & SAUVEGARDE =================

function calculerAlignement() {
    let m = 0, t = 0;
    if (perso.magieInvesties) for (let e in perso.magieInvesties) m += perso.magieInvesties[e];
    if (perso.techInvesties) for (let d in perso.techInvesties) t += perso.techInvesties[d];
    
    let total = (m * 5) - (t * 5);
    
    // Bonus de Race/BG
    if (perso.bonusInnes && perso.bonusInnes.align) total += perso.bonusInnes.align;

    // AJOUT : Bonus d'équipement (ex: +10 de l'épée enchantée)
    for (let slot in perso.equipement) {
        let itemEq = perso.equipement[slot];
        if (itemEq && itemsData[itemEq.id] && itemsData[itemEq.id].stats?.align) {
            total += itemsData[itemEq.id].stats.align;
        }
    }

    return Math.max(-100, Math.min(100, total));
}

function resetInvestissements() {
    if (!confirm("Réinitialiser tous les investissements du niveau ?")) return;
    for (let s in perso.statsInvesties) { perso.pointsDispo += perso.statsInvesties[s]; perso.statsInvesties[s] = 0; }
    for (let id in perso.compInvesties) {
        let act = perso.compInvesties[id], base = (perso.compBase && perso.compBase[id]) ? perso.compBase[id] : 0;
        perso.pointsDispo += (act - base) / 4; perso.compInvesties[id] = base;
    }
    perso.pointsDispo += ((perso.boostPV || 0) - (perso.boostPVBase || 0)) / 5; perso.boostPV = perso.boostPVBase || 0;
    perso.pointsDispo += ((perso.boostFT || 0) - (perso.boostFTBase || 0)) / 5; perso.boostFT = perso.boostFTBase || 0;
    if (perso.magieInvesties) for (let e in perso.magieInvesties) {
        let b = (perso.magieBase && perso.magieBase[e]) ? perso.magieBase[e] : 0;
        perso.pointsDispo += (perso.magieInvesties[e] - b); perso.magieInvesties[e] = b;
    }
    if (perso.techInvesties) for (let d in perso.techInvesties) {
        let b = (perso.techBase && perso.techBase[d]) ? perso.techBase[d] : 0;
        perso.pointsDispo += (perso.techInvesties[d] - b); perso.techInvesties[d] = b;
    }
    updateFicheUI();
}

function validerChangements() {
    if (perso.pointsDispo > 0) { alert("Dépensez tous vos points !"); return; }
    if (confirm("Valider définitivement ?")) {
        for (let s in perso.statsInvesties) { perso.statsBase[s] += (perso.statsInvesties[s] || 0); perso.statsInvesties[s] = 0; }
        if (!perso.compBase) perso.compBase = {}; for (let c in perso.compInvesties) perso.compBase[c] = perso.compInvesties[c];
        perso.boostPVBase = perso.boostPV; perso.boostFTBase = perso.boostFT;
        if (!perso.magieBase) perso.magieBase = {}; for (let e in perso.magieInvesties) perso.magieBase[e] = perso.magieInvesties[e];
        if (!perso.techBase) perso.techBase = {}; for (let d in perso.techInvesties) perso.techBase[d] = perso.techInvesties[d];
        document.getElementById('ecran-fiche').classList.add('is-locked');
        localStorage.setItem('arcanum_sauvegarde', JSON.stringify(perso));
        updateFicheUI();
    }
}

function switchSkillTab(id) {
    ["tab-comp", "tab-tech", "tab-magie"].forEach(t => {
        let el = document.getElementById(t);
        if (el) el.style.display = t === id ? 'block' : 'none';
    });
    ["btn-tab-comp", "btn-tab-tech", "btn-tab-magie"].forEach(b => {
        let el = document.getElementById(b);
        if (el) el.classList.toggle('active', b === 'btn-' + id);
    });
}

function telechargerFichier() {
    const blob = new Blob([JSON.stringify(perso, null, 2)], { type: "application/json" });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = (perso.nom || "perso") + "_arcanum.json"; a.click();
}

function importerFichier(e) {
    const reader = new FileReader();
    reader.onload = function(ev) {
        const p = JSON.parse(ev.target.result);
        if (p.nom) { localStorage.setItem('arcanum_sauvegarde', JSON.stringify(p)); perso = p; updateFicheUI(); cacherTout(); document.getElementById('ecran-fiche').style.display = 'block'; }
    };
    reader.readAsText(e.target.files[0]);
}

function levelUp() {
    document.getElementById('ecran-fiche').classList.remove('is-locked');
    perso.niveau = (perso.niveau || 1) + 1;
    perso.pointsDispo = (perso.pointsDispo || 0) + (perso.niveau % 5 === 0 ? 2 : 1);
    updateFicheUI();
}





// ================= GESTION INVENTAIRE & EQUIPEMENT =================

const nomEmplacements = {
    "tete": "Tête", "torse": "Torse", "gants": "Mains (Gants)", "bottes": "Pieds", 
    "anneau": "Doigt (Anneau)", "amulette": "Cou (Amulette)",
    "main_droite": "Main Droite", "main_gauche": "Main Gauche", "deux_mains": "Deux Mains"
};

function allerInventaire() {
    cacherTout();
    document.getElementById('ecran-inventaire').style.display = 'block';
    
    if (!perso.inventaire) perso.inventaire = [];
    if (!perso.equipement) perso.equipement = {
        tete: null, torse: null, gants: null, bottes: null, 
        anneau: null, amulette: null, main_droite: null, main_gauche: null
    };
    updateInventaireUI();
}

function fermerInventaire() {
    cacherTout();
    document.getElementById('ecran-fiche').style.display = 'block';
    updateFicheUI(); // Met à jour la fiche avec les bonus de l'équipement !
}

function ajouterItemParId() {
    let id = document.getElementById('new-item-id').value.trim().toUpperCase();
    if (!id || !itemsData[id]) { alert("ID d'objet inconnu !"); return; }
    
    let data = itemsData[id];
    let existant = perso.inventaire.find(item => item.id === id);
    
    if (existant && data.stackable) {
        existant.quantite += 1;
    } else {
        // NOUVEAU : Si c'est une arme ou armure (non stackable), on lui donne de la Durabilité !
        let newItem = { id: id, quantite: 1 };
        if (!data.stackable && (data.type.includes("arme") || data.type === "armure")) {
            newItem.durabilite = 100;
            newItem.durabiliteMax = 100;
        }
        perso.inventaire.push(newItem);
    }
    document.getElementById('new-item-id').value = ""; 
    updateInventaireUI();
}

function jeterItem(index) {
    if (confirm("Voulez-vous vraiment jeter cet objet ?")) {
        perso.inventaire[index].quantite -= 1;
        if (perso.inventaire[index].quantite <= 0) perso.inventaire.splice(index, 1);
        updateInventaireUI();
    }
}

function equiperItem(indexInventaire) {
    let itemInv = perso.inventaire[indexInventaire];
    let data = itemsData[itemInv.id];
    let slot = data.equipable;

    if (!slot || slot === "aucun") { alert("Cet objet ne s'équipe pas."); return; }

    if (slot === "deux_mains") {
        if (perso.equipement.main_droite) desequiperItem("main_droite", true);
        if (perso.equipement.main_gauche) desequiperItem("main_gauche", true);
        perso.equipement.main_droite = itemInv; // On stocke l'objet COMPLET (avec sa durabilité)
    } else {
        if (perso.equipement[slot]) desequiperItem(slot, true);
        perso.equipement[slot] = itemInv; 
    }

    perso.inventaire.splice(indexInventaire, 1); // On le retire du sac
    updateInventaireUI();
}

function desequiperItem(slot, isSilent = false) {
    let itemEq = perso.equipement[slot];
    if (!itemEq) return;

    // Sécurité pour les vieilles sauvegardes
    if (typeof itemEq === "string") itemEq = { id: itemEq, quantite: 1, durabilite: 100, durabiliteMax: 100 };

    let data = itemsData[itemEq.id];
    let existant = perso.inventaire.find(item => item.id === itemEq.id);
    
    if (existant && data.stackable) existant.quantite += 1;
    else perso.inventaire.push(itemEq); // On remet l'objet complet dans le sac

    perso.equipement[slot] = null;
    if (!isSilent) updateInventaireUI();
}

function updateInventaireUI() {
    let listInv = document.getElementById('inv-list-full');
    let listEq = document.getElementById('equipement-list');
    if (!listInv || !listEq) return 0;

    let poidsTotal = 0;

    // --- GENERATEUR DE STATS VISUELLES ---
    const getStatsHtml = (data, item) => {
        let h = `<div style="margin-top:5px; font-size:0.85em;">`;
        if (data.degats && data.degats !== "0") h += `<span style="color:#ff5252; margin-right: 10px;">⚔️ Dégâts: ${data.degats}</span>`;
        if (data.armure && data.armure > 0) h += `<span style="color:#4caf50; margin-right: 10px;">🛡️ Armure: ${data.armure}</span>`;
        if (item.durabilite) h += `<span style="color:#aaa;">🔧 État: ${item.durabilite}/${item.durabiliteMax}</span>`;
        h += `</div>`;
        return h;
    };

  // --- 1. DESSINER LE SAC À DOS ---
    let htmlInv = ``;
(perso.inventaire || []).forEach((item, index) => {
	let data = itemsData[item.id];
        if (data) {
            poidsTotal += data.poids * item.quantite;
            let btnEquiper = (data.equipable && data.equipable !== "aucun") 
                ? `<button onclick="equiperItem(${index})" style="background:#2196f3; color:#fff; border:none; padding:5px 10px; cursor:pointer; border-radius:3px;">Équiper</button>` : ``;

            htmlInv += `
                <div style="background: #251b14; padding: 10px; border: 1px solid #444; border-radius: 4px;">
                    <div style="display:flex; justify-content: space-between;">
                        <strong style="color:#dcdcdc;">${data.nom} (x${item.quantite})</strong>
                        <span style="color:#aaa;">${data.poids} kg</span>
                    </div>
                    <div style="font-size: 0.8em; color: #888; font-style: italic;">${data.desc}</div>
                    ${getStatsHtml(data, item)}
                    <div style="display:flex; gap: 5px; margin-top: 8px;">
                        ${btnEquiper}
                        <button onclick="jeterItem(${index})" style="background:#8b0000; color:#fff; border:none; padding:5px 10px; cursor:pointer; border-radius:3px;">Jeter</button>
                    </div>
                </div>`;
        }
    });
    listInv.innerHTML = htmlInv || "<div style='color:#666; font-style:italic;'>Le sac est vide.</div>";

    // --- 2. DESSINER L'ÉQUIPEMENT ---
    let htmlEq = ``;
    for (let slot in perso.equipement) {
        let itemEq = perso.equipement[slot];
        let nomSlot = nomEmplacements[slot] || slot;
        
        if (itemEq && typeof itemEq !== "string" && itemsData[itemEq.id]) {
            let data = itemsData[itemEq.id];
            poidsTotal += data.poids; 
            htmlEq += `
                <div style="background: #1a110b; border: 1px solid #4caf50; padding: 10px; border-radius: 4px; display:flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 0.7em; color: #4caf50; text-transform: uppercase;">${nomSlot}</div>
                        <strong style="color: #fff;">${data.nom}</strong>
                        ${getStatsHtml(data, itemEq)}
                    </div>
                    <button onclick="desequiperItem('${slot}')" style="background:#444; color:#fff; border:none; padding:5px; cursor:pointer; border-radius:3px; font-size: 0.8em;">Retirer</button>
                </div>`;
        } else {
            htmlEq += `
                <div style="background: #111; border: 1px dashed #444; padding: 10px; border-radius: 4px;">
                    <div style="font-size: 0.7em; color: #666; text-transform: uppercase;">${nomSlot}</div>
                    <div style="color: #444; font-style: italic;">Vide</div>
                </div>`;
        }
    }
    listEq.innerHTML = htmlEq;
    
    // MAJ de la charge dans l'inventaire
    let statFO = (perso.statsBase.FO || 8) + (perso.statsInvesties.FO || 0);
    let elPoidsInv = document.getElementById('inv-poids-total');
    if (elPoidsInv) {
        elPoidsInv.innerText = poidsTotal.toFixed(1) + " / " + (statFO * 2) + " kg";
        elPoidsInv.style.color = (poidsTotal > (statFO * 2)) ? "#f44336" : "#4caf50"; 
    }
    return poidsTotal;
}








// --- FOUILLE ---
function ouvrirPromptFouille() {
    let id = prompt("Entrez l'ID du coffre");
if (!id) return;
    
    cacherTout();
    document.getElementById('ecran-fouille').style.display = 'block';
    
    // Chargement du contenu
    contenuCoffreActuel = coffresFixes[id] ? [...coffresFixes[id].items] : genererLootAleatoire(parseInt(id) || 3);
    
    actualiserVisuelFouille();
}

function actualiserVisuelFouille() {
    let list = document.getElementById('liste-fouille');
    let btnTout = document.getElementById('btn-tout-prendre');
    list.innerHTML = "";

    if (contenuCoffreActuel.length === 0) {
        list.innerHTML = "<div style='text-align:center; color:#666;'>Le coffre est vide.</div>";
        btnTout.style.display = "none";
        return;
    }

    btnTout.style.display = "block";
    btnTout.onclick = toutPrendre;

    contenuCoffreActuel.forEach((item, idx) => {
        let data = itemsData[item.id];
        if (!data) return;

        let div = document.createElement('div');
        div.className = "skill-row";
        div.style = "background:#3e2d20; padding:10px; display:flex; justify-content:space-between; border-bottom:1px solid #222;";
        
        // Affichage des dégâts ou armure pour aider au choix
        let infoStats = data.degats && data.degats !== "0" ? ` (⚔️${data.degats})` : (data.armure > 0 ? ` (🛡️${data.armure})` : "");

        div.innerHTML = `
            <span>${data.nom}${infoStats} x${item.qte}</span>
            <button onclick="prendreUnObjet(${idx})" style="background:#4caf50; border:none; color:white; padding:5px 10px; cursor:pointer;">Prendre</button>
        `;
        list.appendChild(div);
    });
}


function ramasserItem(id, qteAjoutee) {
    if (id === "OR_PIECES") {
        if (perso.argent === undefined) perso.argent = 400; 
        perso.argent += qteAjoutee;
        updateFicheUI(); 
        return; 
    }

    if (!perso.inventaire) perso.inventaire = [];
    let data = itemsData[id];
    let existant = perso.inventaire.find(i => i.id === id);
    
    if (existant && data.stackable) {
        // Sécurité anti-NaN avec prise en compte des deux mots
        let q = parseInt(existant.qte) || parseInt(existant.quantite) || 1;
        existant.qte = q + qteAjoutee;
        existant.quantite = existant.qte; 
    } else {
        // Ajout au sac avec les DEUX mots
        perso.inventaire.push({ id: id, qte: qteAjoutee, quantite: qteAjoutee, durabilite: 100, durabiliteMax: 100 });
    }
    alert(data.nom + " ajouté à l'inventaire !");
    autoSave();
}


// --- MARCHAND ---
let marchandActuel = null;

function ouvrirPromptMarchand() {
    let nom = prompt("Nom du marchand (ex: marchand_tuto) :");
    if (!marchandsData[nom]) return alert("Ce marchand n'existe pas.");
    marchandActuel = marchandsData[nom];
    cacherTout();
    document.getElementById('ecran-marchand').style.display = 'block';
    updateMarchandUI();
}

function updateMarchandUI() {
    if (!marchandActuel) return;

    document.getElementById('nom-marchand').innerText = marchandActuel.nom;
    document.getElementById('argent-marchand').innerText = marchandActuel.argent;
    document.getElementById('votre-argent').innerText = perso.argent;

    // Calcul du bonus de marchandage (ex: 2% de réduction par point investi)
    let ptsMarchandage = (perso.compInvesties && perso.compInvesties['marchandage']) ? perso.compInvesties['marchandage'] : 0;
    let reductionClient = ptsMarchandage * 0.02; // 20 pts = 40% de bonus

    // --- INVENTAIRE DU MARCHAND (ACHAT DU JOUEUR) ---
    let listM = document.getElementById('inventaire-marchand');
    listM.innerHTML = "";
    
    marchandActuel.inventaire.forEach((item, idx) => {
        let data = itemsData[item.id];
        if (!data) return;

   // Le marchand vend à 125% du prix de base, réduit par ton talent de marchandage
let prixAchat = Math.ceil(data.prix * (1.25 - reductionClient)); 

// ON VÉRIFIE SI LE STOCK EST VIDE
let estEpuise = (item.qte <= 0);

listM.innerHTML += `
    <div class="skill-row" style="justify-content: space-between; padding: 5px 10px; opacity: ${estEpuise ? '0.5' : '1'};">
        <span>${data.nom} (x${item.qte})</span>
        <button 
            onclick="${estEpuise ? '' : `acheterItem(${idx}, ${prixAchat})`}" 
            style="background: ${estEpuise ? '#333' : '#4caf50'}; 
                   color: ${estEpuise ? '#888' : 'white'}; 
                   border: none; padding: 4px 8px; 
                   cursor: ${estEpuise ? 'default' : 'pointer'};"
            ${estEpuise ? 'disabled' : ''}>
            ${estEpuise ? '❌ Épuisé' : `🛒 Acheter : ${prixAchat} Or`}
        </button>
    </div>`;
    });

    // --- VOTRE INVENTAIRE (VENTE AU MARCHAND) ---
    let listV = document.getElementById('votre-inventaire-vente');
    listV.innerHTML = "";
    
    perso.inventaire.forEach((item, idx) => {
        let data = itemsData[item.id];
        if (!data) return;

        // Le marchand rachète à 70% du prix de base, augmenté par ton talent de marchandage
        let prixVente = Math.floor(data.prix * (0.7 + reductionClient));
        // On ne peut pas vendre plus cher que le prix de base original
        prixVente = Math.min(prixVente, data.prix);

        listV.innerHTML += `
            <div class="skill-row" style="justify-content: space-between; padding: 5px 10px;">
                <span>${data.nom} (x${item.quantite})</span>
                <button onclick="vendreItem(${idx}, ${prixVente})" style="background:#d4af37; color:black; border:none; padding:4px 8px; cursor:pointer;">
                    💰 Vendre : ${prixVente} Or
                </button>
            </div>`;
    });
}









function prendreUnObjet(index) {
    let item = contenuCoffreActuel[index];
    ramasserItem(item.id, item.qte); // Utilise ta fonction existante qui save et alerte
    
    // Retirer l'objet de la liste locale
    contenuCoffreActuel.splice(index, 1);
    
    // Rafraîchir l'affichage
    actualiserVisuelFouille();
}

function toutPrendre() {
    if (contenuCoffreActuel.length === 0) return;
    
    contenuCoffreActuel.forEach(item => {
        ramasserItem(item.id, item.qte);
    });
    
    contenuCoffreActuel = [];
    actualiserVisuelFouille();
    alert("Tout a été transféré dans votre inventaire !");
}


function acheterItem(idx, prix) {
    // 1. On récupère l'objet dans le stock du marchand
    let itemEnVente = marchandActuel.inventaire[idx];

    // 2. Vérifications de sécurité
    if (!itemEnVente || itemEnVente.qte <= 0) {
        alert("Ce marchand n'a plus cet objet en stock !");
        return;
    }
    if (perso.argent < prix) {
        alert("Vous n'avez pas assez d'argent !");
        return;
    }

    // 3. Transaction financière
    perso.argent -= prix;
    marchandActuel.argent += prix;

    // 4. Transfert de l'objet : ON DIMINUE LE STOCK ICI
    ramasserItem(itemEnVente.id, 1); // On en achète 1 (tu peux adapter si tu veux un prompt de quantité)
    itemEnVente.qte -= 1;

    // 5. Si le stock tombe à 0, on peut soit laisser "x0", soit retirer l'entrée
    if (itemEnVente.qte <= 0) {
        marchandActuel.inventaire.splice(idx, 1);
    }

    // 6. Mise à jour et Sauvegarde
    autoSave();
    updateMarchandUI();
}

function vendreItem(idx, prix) {
    if (marchandActuel.argent >= prix) {
        perso.argent += prix;
        marchandActuel.argent -= prix;
        perso.inventaire[idx].quantite--;
        if (perso.inventaire[idx].quantite <= 0) perso.inventaire.splice(idx, 1);
        updateMarchandUI();
    } else { alert("Le marchand n'a plus d'argent !"); }
}





function verifierBoutonCraft() {
    let btnCraft = document.getElementById('btn-menu-craft');
    if (!btnCraft) return;

    let aApprisTech = false;

    // On vérifie si le joueur a mis au moins 1 point dans n'importe quelle école
    if (perso && perso.techInvesties) {
        for (let ecole in perso.techInvesties) {
            if (perso.techInvesties[ecole] > 0) {
                aApprisTech = true;
                break; // On arrête de chercher, on a trouvé !
            }
        }
    }

    // On affiche ou on cache le bouton
    btnCraft.style.display = aApprisTech ? "inline-block" : "none";
}







// --- 1. Utilitaire : Trouver l'ID d'un objet depuis son nom (VERSION ANTI-BUG) ---
function trouverIdParNom(nomRecherche) {
    if (!nomRecherche) return null;
    
    // On met tout en minuscules et on enlève les espaces en trop au début/à la fin
    let nomPropre = nomRecherche.trim().toLowerCase(); 
    
    for (let id in itemsData) {
        if (itemsData[id].nom.trim().toLowerCase() === nomPropre) {
            return id;
        }
    }
    
    console.warn("L'objet suivant n'a pas été trouvé dans itemsData :", nomRecherche);
    return null; 
}

// --- 2. Afficher l'écran ---

// --- 2. Afficher l'écran ---
function ouvrirEcranCraft() {
    cacherTout();
    document.getElementById('ecran-craft').style.display = 'block';
    
    let div = document.getElementById('liste-crafts');
    div.innerHTML = ''; 

    if (!perso.techInvesties) return;

    for (let ecole in perso.techInvesties) {
        let niveau = perso.techInvesties[ecole];
        
        if (niveau > 0) {
            div.innerHTML += `<h3 style="margin-top: 25px; color: #ddd; border-bottom: 1px solid #444; padding-bottom: 5px;">${ecole} (Niv. ${niveau})</h3>`;
            
            for (let i = 0; i < niveau; i++) {
                let schema = techData[ecole].schematics[i];
                let compo1Nom = schema.compo[0];
                let compo2Nom = schema.compo[1];

                let idC1 = trouverIdParNom(compo1Nom);
                let idC2 = trouverIdParNom(compo2Nom);

                let qteC1 = compterObjet(idC1);
                let qteC2 = compterObjet(idC2);

                let hasC1 = qteC1 > 0;
                let hasC2 = qteC2 > 0;
                
                let canCraft = false;
                if (idC1 === idC2) {
                    canCraft = qteC1 >= 2; 
                } else {
                    canCraft = hasC1 && hasC2;
                }

                let btnHTML = canCraft 
                    ? `<button onclick="fabriquerObjet('${schema.nom}', '${idC1}', '${idC2}')" style="background: #4caf50; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; font-weight: bold; width: 120px;">🔨 Fabriquer</button>`
                    : `<button disabled style="background: #444; color: #888; border: 1px solid #555; padding: 10px 15px; border-radius: 4px; cursor: not-allowed; width: 120px;">Manquant</button>`;

                div.innerHTML += `
                    <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.3); border: 1px solid #555; padding: 12px; margin-bottom: 10px; border-radius: 6px;">
                        <div style="flex-grow: 1; padding-right: 15px;">
                            <strong style="color: #ffb74d; font-size: 1.1em;">${schema.nom}</strong><br>
                            <em style="color: #bbb; font-size: 0.9em;">${schema.desc}</em>
                            <div style="margin-top: 8px; font-size: 0.95em;">
                                Requis : 
                                <span style="color:${hasC1 ? '#81c784' : '#e57373'}; font-weight: bold;">${compo1Nom} (${qteC1}/1)</span> 
                                <span style="color: #888;">+</span> 
                                <span style="color:${hasC2 ? '#81c784' : '#e57373'}; font-weight: bold;">${compo2Nom} (${qteC2}/1)</span>
                            </div>
                        </div>
                        <div style="flex-shrink: 0;">
                            ${btnHTML}
                        </div>
                    </div>
                `;
            }
        }
    }
}



// --- 3. L'action de fabriquer ---



// --- 0. Utilitaire : Soigner la sauvegarde ---
function nettoyerInventaire() {
    if (!perso.inventaire) perso.inventaire = [];
    for (let i = perso.inventaire.length - 1; i >= 0; i--) {
        let item = perso.inventaire[i];
        
        // On récupère la valeur, qu'elle s'appelle 'qte' ou 'quantite'
        let val = item.qte !== undefined ? item.qte : item.quantite;
        let q = parseInt(val);
        
        if (isNaN(q) || val === undefined || val === null) {
            q = 1;
        }
        
        // On synchronise les deux noms pour éviter tout bug futur !
        item.qte = q;
        item.quantite = q;
        
        if (q <= 0) {
            perso.inventaire.splice(i, 1);
        }
    }
}

// --- 1. Utilitaire : Compter un objet (100% blindé) ---
function compterObjet(idRecherche) {
    if (!idRecherche || !perso.inventaire) return 0;
    let total = 0;
    for (let i = 0; i < perso.inventaire.length; i++) {
        if (perso.inventaire[i].id === idRecherche) {
            // Force la conversion en nombre entier, sinon met 1
            let q = parseInt(perso.inventaire[i].qte);
            total += isNaN(q) ? 1 : q;
        }
    }
    return total;
}

// --- 2. L'action de fabriquer (VERSION ANTI-CORRUPTION) ---

// --- 2. L'action de fabriquer (VERSION ANTI-CORRUPTION & AFFICHAGE FIXÉ) ---
function fabriquerObjet(nomResultat, idCompo1, idCompo2) {
    let idResultat = trouverIdParNom(nomResultat);
    if (!idResultat) return;

    // --- ETAPE 1 : RETIRER LE COMPOSANT 1 ---
    let index1 = perso.inventaire.findIndex(i => i.id === idCompo1);
    if (index1 !== -1) {
        let q1 = parseInt(perso.inventaire[index1].quantite) || parseInt(perso.inventaire[index1].qte) || 1;
        q1--; 
        if (q1 <= 0) {
            perso.inventaire.splice(index1, 1); 
        } else {
            perso.inventaire[index1].quantite = q1; 
            perso.inventaire[index1].qte = q1; 
        }
    }

    // --- ETAPE 2 : RETIRER LE COMPOSANT 2 ---
    let index2 = perso.inventaire.findIndex(i => i.id === idCompo2);
    if (index2 !== -1) {
        let q2 = parseInt(perso.inventaire[index2].quantite) || parseInt(perso.inventaire[index2].qte) || 1;
        q2--;
        if (q2 <= 0) {
            perso.inventaire.splice(index2, 1);
        } else {
            perso.inventaire[index2].quantite = q2;
            perso.inventaire[index2].qte = q2;
        }
    }

    // --- ETAPE 3 : AJOUTER L'OBJET FABRIQUÉ (CORRIGÉ !) ---
    let itemData = itemsData[idResultat];
    let indexRes = perso.inventaire.findIndex(i => i.id === idResultat);
    
    if (itemData.stackable && indexRes !== -1) {
        // Si l'objet existe déjà et est empilable
        let qRes = parseInt(perso.inventaire[indexRes].quantite) || parseInt(perso.inventaire[indexRes].qte) || 1;
        perso.inventaire[indexRes].quantite = qRes + 1;
        perso.inventaire[indexRes].qte = qRes + 1;
    } else {
        // NOUVEL OBJET : On utilise explicitement "quantite" pour l'affichage !
        perso.inventaire.push({ 
            id: idResultat, 
            quantite: 1, 
            qte: 1, // On met les deux pour la sécurité
            durabilite: 100, 
            durabiliteMax: 100 
        });
    }

    alert(`Succès ! Vous avez fabriqué : ${nomResultat}`);
    
    // --- ETAPE 4 : RAFRAICHISSEMENT GLOBAL ---
    if (typeof autoSave === "function") autoSave();
    if (typeof updateFicheUI === "function") updateFicheUI(); 
    
    ouvrirEcranCraft(); 
    if (typeof updateInventaireUI === "function") updateInventaireUI();
}



function rafraichirAccueil() {
    const zoneNouveau = document.getElementById('accueil-nouveau-jeu');
    const zoneContinuer = document.getElementById('accueil-continuer');
    const nomAffiche = document.getElementById('accueil-nom-perso');

    if (perso && perso.nom && perso.nom !== "Nom du Personnage" && perso.nom !== "") {
        if (zoneNouveau) zoneNouveau.style.display = 'none';
        if (zoneContinuer) zoneContinuer.style.display = 'block';
        if (nomAffiche) nomAffiche.innerText = "Héros : " + perso.nom + " (Niv. " + (perso.niveau || 1) + ")";
        
        // On vérifie le bouton craft car le perso existe !
        if (typeof verifierBoutonCraft === "function") verifierBoutonCraft(); 
    } else {
        if (zoneNouveau) zoneNouveau.style.display = 'block';
        if (zoneContinuer) zoneContinuer.style.display = 'none';
    }
}


















// Modifie ta fonction allerAccueil pour qu'elle vérifie l'état à chaque fois
function allerAccueil() {
	autoSave()
    cacherTout();
    document.getElementById('ecran-accueil').style.display = 'block';
    rafraichirAccueil(); // <--- Important !
}


function reprendrePartie() {
    // 1. Sécurité : On s'assure que les objets vitaux existent pour ne pas crasher updateInventaireUI
    if (!perso.inventaire) perso.inventaire = [];
    if (!perso.equipement) perso.equipement = {
        tete: null, torse: null, gants: null, bottes: null, 
        anneau: null, amulette: null, main_droite: null, main_gauche: null
    };

    // 2. On cache tout proprement d'abord
    cacherTout();

    // 3. On affiche la fiche et on la met à jour
 const ecranFiche = document.getElementById('ecran-fiche');
    if (ecranFiche) {
        ecranFiche.style.display = 'block';
        updateFicheUI();
        
        // On vérifie le bouton craft au moment de reprendre le jeu
        if (typeof verifierBoutonCraft === "function") verifierBoutonCraft();
    }
}








function autoSave() {
    if (perso && perso.nom && perso.nom !== "Nom du Personnage") {
        localStorage.setItem('arcanum_sauvegarde', JSON.stringify(perso));
        console.log("Sauvegarde automatique effectuée.");
    }
}