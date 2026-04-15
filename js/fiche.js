function modStat(stat, val) {
if (window.perso.pvActuel <= 0) { 
        alert("💀 Vous êtes mort ! Impossible de modifier vos statistiques."); 
        return; 
    }
    if (val > 0 && perso.pointsDispo <= 0) return;
    if (val < 0 && (perso.statsInvesties[stat] || 0) <= 0) return;
    
    // MODIFICATION ICI : Sécurité pour le panier
    if (!investissementsTemporaires.stats[stat]) investissementsTemporaires.stats[stat] = 0;
    // On ne peut retirer que si on a investi temporairement
    if (val < 0 && investissementsTemporaires.stats[stat] <= 0) return;

    perso.statsInvesties[stat] = (perso.statsInvesties[stat] || 0) + val;
    investissementsTemporaires.stats[stat] += val; // Mise à jour du panier
    perso.pointsDispo -= val;
    updateFicheUI();
	verifierEtatValidation(); // <--- AJOUT
}


function levelUp() {
    document.getElementById('ecran-fiche').classList.remove('is-locked');
    perso.niveau = (perso.niveau || 1) + 1;
    perso.pointsDispo = (perso.pointsDispo || 0) + (perso.niveau % 5 === 0 ? 2 : 1);
    // +2 PV max et +2 FT max à chaque niveau
    perso.boostPV = (perso.boostPV || 0) + 2;
    perso.boostFT = (perso.boostFT || 0) + 2;
    updateFicheUI();
}




// ================= MISE À JOUR FICHE =================
function verifierEtatValidation() {
    const btnValider = document.querySelector("button[onclick='validerChangements()']");
    if (!btnValider) return;

    const aDesChangements =
        investissementsTemporaires.pv !== 0 ||
        investissementsTemporaires.ft !== 0 ||
        Object.values(investissementsTemporaires.stats).some(v => v !== 0) ||
        Object.values(investissementsTemporaires.comp).some(v => v !== 0) ||
        Object.values(investissementsTemporaires.magie).some(v => v !== 0) ||
        Object.values(investissementsTemporaires.tech).some(v => v !== 0);

    if (perso.pointsDispo > 0 || aDesChangements) {
        btnValider.style.display = 'block';
        if (perso.pointsDispo > 0) {
            // ÉTAT : ATTENTE — points restants à dépenser
            btnValider.disabled = true;
            btnValider.style.opacity = "0.7";
            btnValider.style.background = "linear-gradient(180deg, #2e4d23 0%, #1b2e15 100%)";
            btnValider.style.color = "#aaa";
            btnValider.style.border = "2px solid #5d4a1f";
            btnValider.style.cursor = "not-allowed";
            btnValider.style.boxShadow = "inset 0 0 10px rgba(0,0,0,0.5)";
            btnValider.innerHTML = `⏳ Dépensez tout (${perso.pointsDispo})`;
        } else {
            // ÉTAT : PRÊT — tous les points sont distribués
            btnValider.disabled = false;
            btnValider.style.opacity = "1";
            btnValider.style.background = "linear-gradient(180deg, #4caf50 0%, #2e7d32 100%)";
            btnValider.style.color = "#fff";
            btnValider.style.border = "2px solid #d4af37";
            btnValider.style.cursor = "pointer";
            btnValider.style.boxShadow = "0 0 15px rgba(76, 175, 80, 0.6), inset 0 0 10px rgba(255,255,255,0.2)";
            btnValider.innerHTML = "✨ Valider la Progression";
        }
    } else {
        btnValider.style.display = 'none';
    }
}

function updateFicheUI() {
    const container = document.getElementById('ecran-fiche');
    if (!container || !perso) return;


// --- DANS TA FONCTION updateFicheUI() ---

const photoContainer = document.getElementById('fiche-photo');
if (photoContainer && perso) {
    let raceDossier = perso.race.toLowerCase().replace(/\s+/g, '');
    let sexePath = "";

    // Exception Bedokien
    if (perso.race !== "Bedokien") {
        sexePath = (perso.sexe === 'F') ? "Femme/" : "Homme/";
    }

// Ici perso.photo contient déjà "01.png", "02.png", etc.
    let cheminPhoto = `./docs/img/portraits/${raceDossier}/${sexePath}${perso.photo}`;
	
photoContainer.innerHTML = `
        <img src="${cheminPhoto}" 
             alt="Avatar" 
             style="width:100px; height:100px; border:2px solid #d4af37; border-radius:5px; object-fit:cover; background:#222;"
             onerror="this.src='./docs/img/portraits/placeholder.png'">`;
}


    // 1. Sécurités et Initialisation
    if (!perso.bonusInnes) perso.bonusInnes = { align: 0, resPhys: 0, resPoison: 0, resMagie: 0, resFeu: 0, resElec: 0 };
    if (perso.pointsDispo === undefined) perso.pointsDispo = 0;
    const b = perso.bonusInnes;

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
        const bonusE = (typeof _bonusEffets === 'function') ? _bonusEffets(perso, s) : 0;
        let total = Math.max(0, (perso.statsBase[s] || 0) + (perso.statsInvesties[s] || 0) + bonusE);
        finalStats[s] = total;
        let elVal = document.getElementById('fiche-val-' + s);
        if(elVal) {
            elVal.innerText = total;
            elVal.style.color = bonusE > 0 ? '#ffd700' : bonusE < 0 ? '#e040fb' : '#fff';
            let btnMoins = document.getElementById('btn-moins-' + s); 
            if (btnMoins) btnMoins.style.visibility = (investissementsTemporaires.stats[s] > 0) ? "visible" : "hidden";
        }
    });

    // 5. LECTURE DES BONUS D'ÉQUIPEMENT
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
    let statFO = finalStats.FO ?? 8;
    let statCN = finalStats.CN ?? 8;
    let statIN = finalStats.IN ?? 8;

    let pvTotal = (statFO * 2) + statIN + (perso.boostPV || 0);
    let ftTotal = (statCN * 2) + statIN + (perso.boostFT || 0) + bonusFT;

    if (document.getElementById('fiche-pv')) document.getElementById('fiche-pv').innerText = pvTotal;
    if (document.getElementById('fiche-fatigue')) {
        const elFt = document.getElementById('fiche-fatigue');
        elFt.innerText = ftTotal;
        elFt.style.color = (bonusFT > 0) ? "#4caf50" : "#fff"; 
    }
    
// --- Affichage des boutons - pour PV et FT ---
    let btnMoinsPV = document.getElementById('btn-moins-PV'); // <-- Majuscules ici !
    if (btnMoinsPV) btnMoinsPV.style.visibility = investissementsTemporaires.pv > 0 ? "visible" : "hidden";

    let btnMoinsFT = document.getElementById('btn-moins-FT'); // <-- Majuscules ici !
    if (btnMoinsFT) btnMoinsFT.style.visibility = investissementsTemporaires.ft > 0 ? "visible" : "hidden";

    // 7. RÉSISTANCES
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
    let statDX = finalStats.DX ?? 8;
    let statCH = finalStats.CH ?? 8;

    let poidsActuel = (typeof updateInventaireUI === 'function') ? updateInventaireUI() : 0;
    let chargeMax = 5 + (statFO * 2);
    let elCharge = document.getElementById('der-charge');
    if (elCharge) {
        elCharge.innerText = poidsActuel.toFixed(1) + " / " + chargeMax + " kg";
        elCharge.style.color = (poidsActuel > chargeMax) ? "#f44336" : "#fff";
    }
    
    const elDegats = document.getElementById('der-degats');
    if (elDegats) {
        // foMod s'applique uniquement aux armes de mêlée et au corps à corps
        const _eqFiche = perso.equipement || {};
        const _slotFiche = _eqFiche.main_droite || _eqFiche.deux_mains || _eqFiche.main_gauche;
        const _typeFiche = (typeof itemsData !== 'undefined' && _slotFiche) ? (itemsData[_slotFiche.id]?.type || '') : '';
        const _estMeleeFiche = !_slotFiche || _typeFiche === 'arme_melee';
        let modifFo = _estMeleeFiche ? ((statFO > 10) ? (statFO - 10) : (statFO < 10 ? Math.floor((statFO - 10) / 2) : 0)) : 0;
        if (_estMeleeFiche && statFO >= 20) modifFo *= 2; // Bonus FO ≥ 20 : Modif. Dégâts doublé
        elDegats.innerText = (modifFo >= 0 ? "+" : "") + modifFo;
    }

    const elArmure = document.getElementById('der-armure');
    if (elArmure) {
        elArmure.innerText = statDX + bonusArmure;
        elArmure.style.color = (bonusArmure > 0) ? "#4caf50" : "#fff";
    }
    
    if (document.getElementById('der-vitesse')) {
        let vitesse = statDX >= 20 ? (25 + (statDX - 20)) : statDX;
        vitesse += (perso.boostVitesseInne || 0);
        const surcharge = (typeof _estSurcharge === 'function') && _estSurcharge(perso);
        const elVit = document.getElementById('der-vitesse');
        elVit.innerText = surcharge ? '1 ⚠' : vitesse;
        elVit.style.color = surcharge ? '#f44336' : '';
    }
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
                
                // --- CALCUL DU TOTAL (Investi + Équipement) ---
                let investi = (perso.compInvesties && perso.compInvesties[id]) ? perso.compInvesties[id] : 0;
                let bonusEquip = 0;

                // On parcourt l'équipement pour trouver des bonusComp
                for (let slot in perso.equipement) {
                    let itemEq = perso.equipement[slot];
                    if (itemEq && itemsData[itemEq.id] && itemsData[itemEq.id].stats?.bonusComp) {
                        let b = itemsData[itemEq.id].stats.bonusComp[id];
                        if (b) bonusEquip += b;
                    }
                }

                const bonusE    = (typeof _bonusEffets === 'function') ? _bonusEffets(perso, id) : 0;
                let totalFinal  = investi + bonusEquip + bonusE;
                // ----------------------------------------------

                let el = document.getElementById('fiche-val-' + id);
                if (el) {
                    el.innerText = totalFinal;
                    el.style.color = bonusE > 0 ? '#ffd700' : bonusE < 0 ? '#e040fb' : (bonusEquip > 0) ? "#4caf50" : "#fff";
                }
                
                let btnMoins = document.getElementById('btn-moins-' + id);
                if (btnMoins) {
                    btnMoins.style.visibility = (investissementsTemporaires.comp[id] > 0) ? "visible" : "hidden";
                }
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
	
    // --- 11. GESTION DYNAMIQUE DU BOUTON VALIDER ---
    verifierEtatValidation();
  
  
    // --- 12. MASQUAGE AUTO DE LA ZONE "POINTS À DISTRIBUER" ---
    const contPoints = document.getElementById('points-dispo')?.parentElement;
    if (contPoints) {
        contPoints.style.display = (perso.pointsDispo > 0) ? "block" : "none";
    }
	
}



// ================= LOGIQUE STATS & VITALITÉ =================

function boostVital(type, valeur) {
	if (window.perso.pvActuel <= 0) { 
        alert("💀 Vous êtes mort ! Impossible de modifier vos statistiques."); 
        return; 
	}
    if (valeur > 0 && perso.pointsDispo <= 0) return;
    if (type === 'PV') {
        let base = perso.boostPVBase || 0;
        if (valeur < 0 && (perso.boostPV || 0) <= base) return;
        // Sécurité Panier
        if (valeur < 0 && investissementsTemporaires.pv <= 0) return;

        perso.boostPV = (perso.boostPV || 0) + valeur;
        investissementsTemporaires.pv += valeur; // Mise à jour du panier
    } else {
        let base = perso.boostFTBase || 0;
        if (valeur < 0 && (perso.boostFT || 0) <= base) return;
        // Sécurité Panier
        if (valeur < 0 && investissementsTemporaires.ft <= 0) return;

        perso.boostFT = (perso.boostFT || 0) + valeur;
        investissementsTemporaires.ft += valeur; // Mise à jour du panier
    }
    perso.pointsDispo -= (valeur > 0 ? 1 : -1);
    updateFicheUI();
	verifierEtatValidation(); // <--- AJOUT
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

function validerChangements() {
    // On force la dépense de tous les points avant de valider
    if (perso.pointsDispo > 0) { 
        alert("Il vous reste " + perso.pointsDispo + " points à distribuer !"); 
        return; 
    }

    if (confirm("Valider définitivement vos nouveaux talents ?")) {
        
        // 1. VIDE LE PANIER
        investissementsTemporaires = {
            pv: 0, ft: 0, stats: {}, comp: {}, magie: {}, tech: {}
        };

        // 2. TRANSFERT DES BASES (Ton code actuel...)
        // ... (tes boucles for statsBase, compBase, etc.) ...

        // 3. NETTOYAGE FORCÉ DE L'INTERFACE MJ/LEVELUP
        // On verrouille la fiche
        document.getElementById('ecran-fiche').classList.add('is-locked');
        
        // On cache le bouton VALIDER (celui sur lequel on vient de cliquer)
        const btnValider = document.querySelector("button[onclick='validerChangements()']");
        if (btnValider) btnValider.style.display = 'none';

        // On cache le bouton ROUGE "LV UP" (celui qui ouvre l'édition)
        const btnLvUp = document.getElementById('btn-lvup-joueur');
        if (btnLvUp) btnLvUp.style.setProperty('display', 'none', 'important');

        // On cache la zone de texte "Points à distribuer"
        const elPointsDispo = document.getElementById('points-dispo');
        if (elPointsDispo) elPointsDispo.parentElement.style.display = 'none';

        // 4. SAUVEGARDE ET SYNCHRO
        localStorage.setItem('arcanum_sauvegarde', JSON.stringify(perso));
        if (typeof autoSave === "function") autoSave();

        // 5. MISE À JOUR ET RETOUR
        updateFicheUI(); 
        allerAccueil(); 
        
        //alert("✨ Progression enregistrée !");
    }


}


function resetInvestissements() {
    if (!confirm("Réinitialiser tous les investissements du niveau ?")) return;
    
    // --- ON VIDE LE PANIER TEMPORAIRE ---
    investissementsTemporaires = {
        pv: 0, ft: 0, stats: {}, comp: {}, magie: {}, tech: {}
    };

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
	if (window.perso.pvActuel <= 0) { 
        alert("💀 Vous êtes mort ! Impossible de modifier vos statistiques."); 
        return; 
    }
  if (!perso.compInvesties) perso.compInvesties = {};
    // Utilise pointsDispo pour correspondre à ton objet perso
    if (val > 0 && (perso.pointsDispo || 0) <= 0) return; 
    
    let act = perso.compInvesties[id] || 0;
    let base = (perso.compBase && perso.compBase[id]) ? perso.compBase[id] : 0;
    
    if (val < 0 && act <= base) return;
    if (val > 0 && act >= 20) return;
	
	
	// --- AJOUT PANIER ---
    if (!investissementsTemporaires.comp[id]) investissementsTemporaires.comp[id] = 0;
    if (val < 0 && investissementsTemporaires.comp[id] <= 0) return; // Empêche de retirer si pas dans le panier
    
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
  investissementsTemporaires.comp[id] += (val > 0 ? 1 : -1); // AJOUT PANIER (Note: l'incrément dépend de ta logique, si 1 clic = 4 pts, le panier compte les "clics")
    perso.pointsDispo -= (val > 0 ? 1 : -1);
    updateFicheUI();
verifierEtatValidation(); // <--- AJOUT	
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
            <button class="btn-stat btn-plus edit-only" onclick="modMagie('${ecole}', 1)">+</button></div>
            <div id="spells-${ecole.replace(/\s+/g, '')}"></div>`;
        magieData[ecole].sorts.forEach((s, i) => {
            const _implemente = s.degats || s.soin || s.resurrection || s.curePoison || s.buffStat;
            const _badge = _implemente ? '' : ' <span style="color:#666;font-size:0.75em;font-style:normal;" title="Effet non implémenté dans le jeu">*</span>';
            pane.querySelector(`#spells-${ecole.replace(/\s+/g, '')}`).innerHTML += `<div id="spell-${ecole.replace(/\s+/g, '')}-${i}" class="spell-item">
                <strong>${s.nom}</strong>${_badge} (Fatigue: ${s.cout})<br><em>${s.desc}</em></div>`;
        });
        tab.querySelector('.magic-contents').appendChild(pane);
        isFirst = false;
    }
}

function updateMagieUI_Display() {
    for (let e in magieData) {
        let act = (perso.magieInvesties && perso.magieInvesties[e]) ? perso.magieInvesties[e] : 0;
        let id = e.replace(/\s+/g, '');

        let tabBtn = document.getElementById('tab-btn-magie-' + id);
        if (tabBtn) {
            if (act > 0) tabBtn.classList.add('has-points');
            else tabBtn.classList.remove('has-points');
        }

        let el = document.getElementById('magie-val-' + id);
        if (el) el.innerText = act + "/5";
        
        // --- AJOUT : CACHER LE BOUTON MOINS ---
        let btnMoins = document.getElementById('btn-moins-magie-' + id);
        if (btnMoins) {
            btnMoins.style.visibility = (investissementsTemporaires.magie[e] > 0) ? "visible" : "hidden";
        }
        
        for (let i = 0; i < 5; i++) {
            let sDiv = document.getElementById(`spell-${id}-${i}`);
            if (sDiv) {
                if (i < act) sDiv.classList.add('learned');
                else sDiv.classList.remove('learned');
            }
        }
    }
}

function modMagie(e, v) {
	if (window.perso.pvActuel <= 0) { 
        alert("💀 Vous êtes mort ! Impossible de modifier vos statistiques."); 
        return; 
    }
    if (!perso.magieInvesties) perso.magieInvesties = {};
    let act = perso.magieInvesties[e] || 0;
    
    // Initialisation dans le panier
    if (!investissementsTemporaires.magie[e]) investissementsTemporaires.magie[e] = 0;

    if (v > 0) {
        if (perso.pointsDispo <= 0 || act >= 5) return;
        let s = magieData[e].sorts[act];
        let intel = (perso.statsBase.IN || 8) + (perso.statsInvesties.IN || 0);
        if (perso.niveau < s.niv || intel < s.int) {
            const raison = perso.niveau < s.niv && intel < s.int
                ? `Niveau insuffisant (requis : ${s.niv}) et Intelligence insuffisante (requise : ${s.int})`
                : perso.niveau < s.niv
                    ? `Niveau insuffisant — requis : ${s.niv} (actuel : ${perso.niveau})`
                    : `Intelligence insuffisante — requise : ${s.int} (actuelle : ${intel})`;
            if (typeof _toast === 'function') _toast('❌ ' + raison, 'error');
            else alert(raison);
            return;
        }
        perso.magieInvesties[e] = act + 1; 
        investissementsTemporaires.magie[e] += 1; // ON AJOUTE AU PANIER
        perso.pointsDispo--;
    } else {
        let base = (perso.magieBase && perso.magieBase[e]) ? perso.magieBase[e] : 0;
        // ON BLOQUE SI CE N'EST PAS DANS LE PANIER
        if (act <= base || investissementsTemporaires.magie[e] <= 0) return; 
        perso.magieInvesties[e] = act - 1; 
        investissementsTemporaires.magie[e] -= 1; // ON RETIRE DU PANIER
        perso.pointsDispo++;
    }
    updateFicheUI();
	verifierEtatValidation(); // <--- AJOUT
}


function switchMagicTab(e) {
    document.querySelectorAll('.magic-tab-btn').forEach(b => b.classList.toggle('active', b.title === e));
    document.querySelectorAll('.magic-content-pane').forEach(p => p.classList.toggle('active', p.id === 'magic-pane-' + e.replace(/\s+/g, '')));
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
            <button class="btn-stat btn-plus edit-only" onclick="modTech('${d}', 1)">+</button></div>
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

        let tabBtn = document.getElementById('tab-btn-tech-' + id);
        if (tabBtn) {
            if (act > 0) tabBtn.classList.add('has-points');
            else tabBtn.classList.remove('has-points');
        }

        let el = document.getElementById('tech-val-' + id);
        if (el) el.innerText = act + "/7";
        
        // --- AJOUT : CACHER LE BOUTON MOINS ---
        let btnMoins = document.getElementById('btn-moins-tech-' + id);
        if (btnMoins) {
            btnMoins.style.visibility = (investissementsTemporaires.tech[d] > 0) ? "visible" : "hidden";
        }
        
        for (let i = 0; i < 7; i++) {
            let sDiv = document.getElementById(`schema-${id}-${i}`);
            if (sDiv) {
                if (i < act) sDiv.classList.add('learned');
                else sDiv.classList.remove('learned');
            }
        }
    }
}

function modTech(d, v) {
	if (window.perso.pvActuel <= 0) { 
        alert("💀 Vous êtes mort ! Impossible de modifier vos statistiques."); 
        return; 
    }
    if (!perso.techInvesties) perso.techInvesties = {};
    let act = perso.techInvesties[d] || 0;
    
    // Initialisation dans le panier
    if (!investissementsTemporaires.tech[d]) investissementsTemporaires.tech[d] = 0;
    
    if (v > 0) {
        if (perso.pointsDispo <= 0 || act >= 7) return;
        let intel = perso.statsBase.IN + (perso.statsInvesties.IN || 0);
        if (intel < techData[d].schematics[act].int) { alert("IN insuffisante"); return; }
        perso.techInvesties[d] = act + 1; 
        investissementsTemporaires.tech[d] += 1; // ON AJOUTE AU PANIER
        perso.pointsDispo--;
    } else {
        let base = (perso.techBase && perso.techBase[d]) ? perso.techBase[d] : 0;
        // ON BLOQUE SI CE N'EST PAS DANS LE PANIER
        if (act <= base || investissementsTemporaires.tech[d] <= 0) return; 
        perso.techInvesties[d] = act - 1; 
        investissementsTemporaires.tech[d] -= 1; // ON RETIRE DU PANIER
        perso.pointsDispo++;
    }
    
    updateFicheUI(); 
    verifierBoutonCraft(); 
	verifierEtatValidation(); // <--- AJOUT
}

function switchTechTab(d) {
    const tab = document.getElementById('tab-tech');
    tab.querySelectorAll('.magic-tab-btn').forEach(b => b.classList.toggle('active', b.title === d));
    tab.querySelectorAll('.magic-content-pane').forEach(p => p.classList.toggle('active', p.id === 'tech-pane-' + d.replace(/\s+/g, '')));
}
