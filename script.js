// ================= DONNÉES =================
const racesData = {
    "Humain": { FO:8, IN:8, CN:8, DX:8, CH:8, spec: "Polyvalent", peutEtreFemme: true },
    "Nain": { FO:9, IN:8, CN:9, DX:7, CH:7, spec: "15% Technologie, +2 comp. Technologie", peutEtreFemme: false },
    "Gnome": { FO:8, IN:10, CN:6, DX:8, CH:8, spec: "+2 Marchandage", peutEtreFemme: true },
    "Halfelin": { FO:5, IN:8, CN:8, DX:10, CH:8, spec: "+2 Discrétion, +1 Esquive, +5% Crit", peutEtreFemme: true },
    "Ogre": { FO:14, IN:2, CN:8, DX:8, CH:3, spec: "20% Résistance Physique, -3 Discrétion", peutEtreFemme: false },
    "Demi-Ogre": { FO:12, IN:4, CN:8, DX:8, CH:7, spec: "10% Résistance Physique, -2 Discrétion", peutEtreFemme: false },
    "Elfe": { FO:7, IN:9, CN:6, DX:9, CH:9, spec: "15% Magie, -2 points compétences Techno", peutEtreFemme: true },
    "Demi-Elfe": { FO:8, IN:8, CN:7, DX:9, CH:9, spec: "5% Magie, -1 point compétence Techno", peutEtreFemme: true },
    "Orque": { FO:10, IN:7, CN:10, DX:8, CH:4, spec: "+3 Mêlée, 20% Résistance Poison", peutEtreFemme: false },
    "Demi-Orque": { FO:9, IN:8, CN:9, DX:8, CH:6, spec: "+2 Mêlée & Esquive, 10% Résistance Poison", peutEtreFemme: true }
};

let perso = {}; 
let statsCalculees = {}; 

// ================= INITIALISATION =================
window.onload = function() {
    const raceSelect = document.getElementById('raceSelect');
    for (let r in racesData) {
        let o = document.createElement('option');
        o.value = r; o.innerText = r;
        raceSelect.appendChild(o);
    }
    
    document.getElementById('raceSelect').addEventListener('change', buildChar);
    document.getElementById('sexeSelect').addEventListener('change', buildChar);
    document.getElementById('bgSelect').addEventListener('change', buildChar);

    // On génère la liste des compétences
    if (typeof competencesData !== 'undefined') {
        initCompetencesUI();
    }
    
    // On génère la liste des écoles de magie
    if (typeof magieData !== 'undefined') {
        initMagieUI();
    }
	// On génère la liste des disciplines technologiques
    if (typeof techData !== 'undefined') {
        initTechUI();
    }

    allerAccueil(); // Démarrage
};

// ================= NAVIGATION =================
function cacherTout() {
    document.getElementById('ecran-accueil').style.display = 'none';
    document.getElementById('ecran-creation').style.display = 'none';
    document.getElementById('ecran-fiche').style.display = 'none';
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

function nouveauPersonnage() {
    cacherTout();
    document.getElementById('ecran-creation').style.display = 'block';
    document.getElementById('charName').value = "";
    buildChar(); 
}

function chargerPersonnage() {
    const sauvegarde = localStorage.getItem('arcanum_sauvegarde');
    if (sauvegarde) {
        perso = JSON.parse(sauvegarde);
        cacherTout();
        document.getElementById('ecran-fiche').style.display = 'block';
        updateFicheUI(); 
    }
}

// ================= CRÉATION (Écran 2) =================
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
        document.getElementById('raceTraits').innerHTML = `<div style="margin-bottom:10px;"><strong>Capacité :</strong> ${race.spec}</div><div><strong>Effets :</strong> ${currentBg.effets || "Aucun"}</div>`;
    }

    statsCalculees = final; 

    for (let s in final) { 
        let el = document.getElementById('val-' + s);
        if(el) el.innerText = final[s]; 
    }
    
    document.getElementById('pv-total').innerText = (final.FO * 2) + final.IN;
    document.getElementById('fatigue-total').innerText = (final.CN * 2) + final.IN;
}

function validerCreation() {
    const nom = document.getElementById('charName').value.trim();
    if (nom === "") { alert("Veuillez entrer un nom !"); return; }

    perso = {
        nom: nom,
        race: document.getElementById('raceSelect').value,
        sexe: document.getElementById('sexeSelect').value,
        antecedent: document.getElementById('bgSelect').value,
        niveau: 1,
        pointsDispo: 5,
        boostPV: 0,
        boostFT: 0,
        statsBase: statsCalculees,
        statsInvesties: { FO:0, IN:0, CN:0, DX:0, CH:0 },
        compInvesties: {} 
    };

    if (typeof competencesData !== 'undefined') {
        for (let cat in competencesData) {
            competencesData[cat].forEach(comp => {
                perso.compInvesties[comp.id] = 0;
            });
        }
    }

    localStorage.setItem('arcanum_sauvegarde', JSON.stringify(perso));
    
    cacherTout();
    document.getElementById('ecran-fiche').style.display = 'block';
    updateFicheUI();
}

// ================= FICHE & POINTS (Écran 3) =================
function updateFicheUI() {
    const container = document.getElementById('ecran-fiche');
    
    if (perso.pointsDispo <= 0) {
        container.classList.add('no-points');
    } else {
        container.classList.remove('no-points');
    }

    document.getElementById('fiche-name').innerText = perso.nom;
    document.getElementById('fiche-level').innerText = perso.niveau;
    document.getElementById('fiche-race').innerText = perso.race;
    document.getElementById('fiche-sexe').innerText = perso.sexe === 'M' ? 'Masculin' : 'Féminin';
    document.getElementById('fiche-bg').innerText = perso.antecedent;
    document.getElementById('points-dispo').innerText = perso.pointsDispo;

    let finalStats = {};
    for (let s in perso.statsBase) {
        let total = perso.statsBase[s] + (perso.statsInvesties[s] || 0);
        finalStats[s] = total;
        
        let elVal = document.getElementById('fiche-val-' + s);
        if(elVal) {
            elVal.innerText = total;
            elVal.style.color = (perso.statsInvesties[s] > 0) ? "#4caf50" : "#fff";
        }

        let btnMoinsStat = document.querySelector(`button[onclick="modStat('${s}', -1)"]`);
        if (btnMoinsStat) {
            btnMoinsStat.style.visibility = (perso.statsInvesties[s] > 0) ? "visible" : "hidden";
        }
    }

    let pvTotal = (finalStats.FO * 2) + finalStats.IN + (perso.boostPV || 0);
    let ftTotal = (finalStats.CN * 2) + finalStats.IN + (perso.boostFT || 0);
    
    let elPv = document.getElementById('fiche-pv');
    let elFt = document.getElementById('fiche-fatigue');
    if (elPv) elPv.innerText = pvTotal;
    if (elFt) elFt.innerText = ftTotal;

    let btnMoinsPV = document.querySelector(`button[onclick="boostVital('PV', -5)"]`);
    if (btnMoinsPV) {
        let basePV = perso.boostPVBase || 0;
        let actuPV = perso.boostPV || 0;
        btnMoinsPV.style.visibility = (actuPV > basePV) ? "visible" : "hidden";
    }
    
    let btnMoinsFT = document.querySelector(`button[onclick="boostVital('FT', -5)"]`);
    if (btnMoinsFT) {
        let baseFT = perso.boostFTBase || 0;
        let actuFT = perso.boostFT || 0;
        btnMoinsFT.style.visibility = (actuFT > baseFT) ? "visible" : "hidden";
    }

    // Calculs dérivés
    let fo = finalStats.FO;
    let cn = finalStats.CN;
    let dx = finalStats.DX;
    let ch = finalStats.CH;

    let elCharge = document.getElementById('der-charge');
    if(elCharge) elCharge.innerText = (fo * 2) + " kg";

    let degats = (fo > 10) ? (fo - 10) : (fo < 10 ? Math.floor((fo - 10) / 2) : 0);
    let elDegats = document.getElementById('der-degats');
    if(elDegats) elDegats.innerText = (degats > 0 ? "+" + degats : degats);

    let elArmure = document.getElementById('der-armure');
    if(elArmure) elArmure.innerText = dx;

    let elVitesse = document.getElementById('der-vitesse');
    if(elVitesse) elVitesse.innerText = dx;

    let elGuerison = document.getElementById('der-guerison');
    if(elGuerison) elGuerison.innerText = Math.floor(cn / 3);

    let elToxines = document.getElementById('der-toxines');
    if(elToxines) elToxines.innerText = cn;

    let reaction = ch - 8;
    let elReaction = document.getElementById('der-reaction');
    if(elReaction) elReaction.innerText = (reaction > 0 ? "+" + reaction : reaction);

    let elCompagnons = document.getElementById('der-compagnons');
    if(elCompagnons) elCompagnons.innerText = Math.max(1, Math.floor(ch / 4));

    // Compétences
    if (perso.compInvesties) {
        for (let compId in perso.compInvesties) {
            let elComp = document.getElementById('fiche-val-' + compId);
            let base = (perso.compBase && perso.compBase[compId]) ? perso.compBase[compId] : 0;
            
            if (elComp) {
                elComp.innerText = perso.compInvesties[compId];
                elComp.style.color = (perso.compInvesties[compId] > base) ? "#4caf50" : "#fff";
            }

            let btnMoinsComp = document.querySelector(`button[onclick="modComp('${compId}', -4)"]`);
            if (btnMoinsComp) {
                btnMoinsComp.style.visibility = (perso.compInvesties[compId] > base) ? "visible" : "hidden";
            }
        }
    }

    // Magie
    if (typeof magieData !== 'undefined') {
        for (let ecole in magieData) {
            let maitrise = (perso.magieInvesties && perso.magieInvesties[ecole]) ? perso.magieInvesties[ecole] : 0;
            let base = (perso.magieBase && perso.magieBase[ecole]) ? perso.magieBase[ecole] : 0;
            let safeEcoleId = ecole.replace(/\s+/g, '');
            
            let elVal = document.getElementById('magie-val-' + safeEcoleId);
            if (elVal) {
                elVal.innerText = maitrise + "/5";
                elVal.style.color = (maitrise > base) ? "#4caf50" : "#fff";
            }
            
            let btnMoinsMagie = document.querySelector(`button[onclick="modMagie('${ecole}', -1)"]`);
            if (btnMoinsMagie) {
                btnMoinsMagie.style.visibility = (maitrise > base) ? "visible" : "hidden";
            }
            
            for (let i = 0; i < 5; i++) {
                let spellDiv = document.getElementById(`spell-${safeEcoleId}-${i}`);
                if (spellDiv) {
                    if (i < maitrise) {
                        spellDiv.classList.add('learned'); 
                    } else {
                        spellDiv.classList.remove('learned'); 
                    }
                }
            }
        }
    }
	
	
	
	// ==========================================
    // 8. MISE À JOUR DE LA TECHNOLOGIE
    // ==========================================
    if (typeof techData !== 'undefined') {
        for (let dis in techData) {
            let maitrise = (perso.techInvesties && perso.techInvesties[dis]) ? perso.techInvesties[dis] : 0;
            let base = (perso.techBase && perso.techBase[dis]) ? perso.techBase[dis] : 0;
            let safeDisId = dis.replace(/\s+/g, '');
            
            let elVal = document.getElementById('tech-val-' + safeDisId);
            if (elVal) {
                elVal.innerText = maitrise + "/7";
                elVal.style.color = (maitrise > base) ? "#4caf50" : "#fff";
            }
            
            let btnMoinsTech = document.querySelector(`button[onclick="modTech('${dis}', -1)"]`);
            if (btnMoinsTech) {
                btnMoinsTech.style.visibility = (maitrise > base) ? "visible" : "hidden";
            }
            
            for (let i = 0; i < 7; i++) { // Jusqu'à 7 pour la techno
                let schemaDiv = document.getElementById(`schema-${safeDisId}-${i}`);
                if (schemaDiv) {
                    if (i < maitrise) {
                        schemaDiv.classList.add('learned'); 
                    } else {
                        schemaDiv.classList.remove('learned'); 
                    }
                }
            }
        }
    }
	
	
	// ==========================================
    // 9. MISE À JOUR DE LA JAUGE D'ALIGNEMENT
    // ==========================================
    let alignement = calculerAlignement();
    let elNeedle = document.getElementById('meter-needle');
    
    if (elNeedle) {
        // La jauge CSS va de 0% (Haut/Magie) à 100% (Bas/Techno). 
        // À 0 d'alignement, on veut qu'elle soit au milieu (50%).
        let topPosition = 50 - (alignement / 2);
        elNeedle.style.top = topPosition + "%";
        
        // Bonus visuel : on change la couleur de l'aiguille selon le côté !
        if (alignement > 0) {
            elNeedle.style.backgroundColor = "#2196f3"; // Bleu Magie
        } else if (alignement < 0) {
            elNeedle.style.backgroundColor = "#ff9800"; // Orange Techno
        } else {
            elNeedle.style.backgroundColor = "red"; // Neutre
        }
    }
	
	
}

function modStat(stat, val) {
    if (val > 0 && perso.pointsDispo <= 0) return;
    if (val < 0 && perso.statsInvesties[stat] <= 0) return;

    perso.statsInvesties[stat] += val;
    perso.pointsDispo -= val;
    
    updateFicheUI();
}

function boostVital(type, valeur) {
    if (valeur > 0 && perso.pointsDispo <= 0) return;
    
    if (type === 'PV') {
        let basePV = perso.boostPVBase || 0;
        let actuPV = perso.boostPV || 0;
        if (valeur < 0 && actuPV <= basePV) return; 
        perso.boostPV = actuPV + valeur;
    } else {
        let baseFT = perso.boostFTBase || 0;
        let actuFT = perso.boostFT || 0;
        if (valeur < 0 && actuFT <= baseFT) return; 
        perso.boostFT = actuFT + valeur;
    }
    
    perso.pointsDispo -= (valeur > 0 ? 1 : -1);
    updateFicheUI();
}

// ================= GESTION DES COMPÉTENCES =================
function initCompetencesUI() {
    const tabComp = document.getElementById('tab-comp');
    tabComp.innerHTML = ''; 

    let subTabsDiv = document.createElement('div');
    subTabsDiv.className = 'sub-tabs';
    tabComp.appendChild(subTabsDiv);

    let contentDiv = document.createElement('div');
    tabComp.appendChild(contentDiv);

    let isFirst = true;

    for (let categorie in competencesData) {
        let btn = document.createElement('button');
        btn.className = 'sub-tab-btn' + (isFirst ? ' active' : '');
        btn.innerText = categorie;
        btn.onclick = function() { switchSubTab(categorie); };
        subTabsDiv.appendChild(btn);

        let catDiv = document.createElement('div');
        catDiv.id = 'sub-tab-' + categorie.replace(/\s+/g, ''); 
        catDiv.className = 'sub-tab-content' + (isFirst ? ' active' : '');
        
        competencesData[categorie].forEach(comp => {
            let row = document.createElement('div');
            row.className = 'skill-row';
            row.title = comp.desc; 

            row.innerHTML = `
                <div class="skill-name">${comp.nom} <span class="skill-stat-tag">${comp.stat}</span></div>
                <button class="btn-stat edit-only" onclick="modComp('${comp.id}', -4)">-</button>
                <span id="fiche-val-${comp.id}" class="stat-value">0</span>
                <button class="btn-stat edit-only" onclick="modComp('${comp.id}', 4)">+</button>
            `;
            catDiv.appendChild(row);
        });

        contentDiv.appendChild(catDiv);
        isFirst = false; 
    }
}

function switchSubTab(catActive) {
    let catId = 'sub-tab-' + catActive.replace(/\s+/g, '');

    document.querySelectorAll('.sub-tab-btn').forEach(btn => {
        if(btn.innerText === catActive) btn.classList.add('active');
        else btn.classList.remove('active');
    });
    
    document.querySelectorAll('.sub-tab-content').forEach(content => {
        if(content.id === catId) content.classList.add('active');
        else content.classList.remove('active');
    });
}

function modComp(compId, val) {
    if (val > 0 && perso.pointsDispo <= 0) return;
    
    let valActuelle = perso.compInvesties[compId] || 0;
    let valBase = (perso.compBase && perso.compBase[compId]) ? perso.compBase[compId] : 0;
    
    if (val < 0 && valActuelle <= valBase) return;
    if (val > 0 && valActuelle >= 20) return;

    if (val > 0) {
        let statLiee = "";
        for (let cat in competencesData) {
            let compTrouvee = competencesData[cat].find(c => c.id === compId);
            if (compTrouvee) { statLiee = compTrouvee.stat; break; }
        }

        let palier = valActuelle / 4; 
        const preRequisStats = [0, 4, 5, 12, 15]; 
        let statRequise = preRequisStats[palier];
        let statJoueur = perso.statsBase[statLiee] + (perso.statsInvesties[statLiee] || 0);

        if (statJoueur < statRequise) {
            alert("Améliorer la stat " + statLiee + " avant. (Requis: " + statRequise + ")");
            return; 
        }
    }

    perso.compInvesties[compId] = valActuelle + val;
    let coutPoint = (val > 0) ? 1 : -1;
    perso.pointsDispo -= coutPoint;
    
    updateFicheUI();
}

function switchSkillTab(tabId) {
    document.getElementById('tab-comp').style.display = 'none';
    document.getElementById('tab-tech').style.display = 'none';
    document.getElementById('tab-magie').style.display = 'none';
    
    document.getElementById('btn-tab-comp').classList.remove('active');
    document.getElementById('btn-tab-tech').classList.remove('active');
    document.getElementById('btn-tab-magie').classList.remove('active');
    
    document.getElementById(tabId).style.display = 'block';
    document.getElementById('btn-' + tabId).classList.add('active');
}

// ================= GESTION DE LA MAGIE =================
function initMagieUI() {
    const tabMagie = document.getElementById('tab-magie');
    tabMagie.innerHTML = '<h4 style="color:#8b7355; border-bottom:1px solid #333; margin-top:0; margin-bottom:15px;">Écoles de Magie</h4>'; 

    let tabsDiv = document.createElement('div');
    tabsDiv.className = 'magic-tabs';
    tabMagie.appendChild(tabsDiv);

    let contentDiv = document.createElement('div');
    tabMagie.appendChild(contentDiv);

    let isFirst = true;

    // Dictionnaire des icônes pour chaque école
    const iconesMagie = {
        "Déplacement": "🌀", "Divination": "👁️", "Air": "💨", "Terre": "🪨",
        "Feu": "🔥", "Eau": "💧", "Energie": "⚡", "Mental": "🧠",
        "Méta": "💠", "Transformation": "🦋", "Nature": "🌿", 
        "Nécromancie noire": "💀", "Nécromancie blanche": "🕊️", 
        "Illusion": "🎭", "Invocation": "👹", "Temporel": "⏳"
    };

    for (let ecole in magieData) {
        let ecoleData = magieData[ecole];
        let safeEcoleId = ecole.replace(/\s+/g, '');

        // 1. Le bouton de l'onglet avec l'icône (et le nom au survol)
        let btn = document.createElement('button');
        btn.className = 'magic-tab-btn' + (isFirst ? ' active' : '');
        btn.innerText = iconesMagie[ecole] || "🪄"; // Met une baguette magique par défaut si l'école n'a pas d'icône
        btn.title = ecole; // Affiche le nom de l'école quand on laisse la souris dessus !
        btn.onclick = function() { switchMagicTab(ecole); };
        tabsDiv.appendChild(btn);

        let pane = document.createElement('div');
        pane.id = 'magic-pane-' + safeEcoleId;
        pane.className = 'magic-content-pane' + (isFirst ? ' active' : '');

        pane.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span style="color:#d4af37; font-weight:bold; font-variant:small-caps; font-size:1.1em;">${ecole}</span>
                <div class="stat-controls">
                    <button class="btn-stat edit-only" onclick="modMagie('${ecole}', -1)">-</button>
                    <span id="magie-val-${safeEcoleId}" class="stat-value" style="font-size:1em; margin: 0 10px;">0/5</span>
                    <button class="btn-stat edit-only" onclick="modMagie('${ecole}', 1)">+</button>
                </div>
            </div>
            <div style="font-size:0.85em; color:#aaa; margin-bottom:15px; font-style:italic; border-left: 2px solid #444; padding-left: 10px;">
                ${ecoleData.desc}
            </div>
            <div id="spells-list-${safeEcoleId}" style="background: #1a110b; padding: 10px; border: 1px solid #333; border-radius: 4px;"></div>
        `;

        let spellsContainer = pane.querySelector('#spells-list-' + safeEcoleId);
        ecoleData.sorts.forEach((sort, index) => {
            let coutAffiche = sort.cout ? sort.cout : "?";
            let descAffiche = sort.desc ? sort.desc : "Description inconnue.";
            
            // J'ai supprimé la balise <span> qui affichait les prérequis
            spellsContainer.innerHTML += `
                <div id="spell-${safeEcoleId}-${index}" class="spell-item">
                    <div style="line-height: 1.3;">
                        <strong>Niveau ${index + 1} : ${sort.nom}</strong> 
                        <span style="color: #2196f3; font-weight: bold; font-size: 0.85em; float:right;">Fatigue: ${coutAffiche}</span><br>
                        <em style="font-size: 0.85em; padding-left: 15px; display: inline-block; margin-top: 3px;">${descAffiche}</em>
                    </div>
                </div>
            `;
        });

        contentDiv.appendChild(pane);
        isFirst = false;
    }
}



function switchMagicTab(ecoleActive) {
    let safeId = 'magic-pane-' + ecoleActive.replace(/\s+/g, '');
    
    document.querySelectorAll('.magic-tab-btn').forEach(btn => {
        if(btn.innerText === ecoleActive) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    document.querySelectorAll('.magic-content-pane').forEach(pane => {
        if(pane.id === safeId) pane.classList.add('active');
        else pane.classList.remove('active');
    });
}

function modMagie(ecole, val) {
    if (!perso.magieInvesties) perso.magieInvesties = {};
    
    let niveauMaitriseActuel = perso.magieInvesties[ecole] || 0;
    
    if (val > 0) {
        if (perso.pointsDispo <= 0) return; 
        if (niveauMaitriseActuel >= 5) return; 
        
        let sortCible = magieData[ecole].sorts[niveauMaitriseActuel];
        let intActuelle = perso.statsBase.IN + (perso.statsInvesties.IN || 0);
        
        if (perso.niveau < sortCible.niv) {
            alert(`Niveau insuffisant ! Le sort "${sortCible.nom}" nécessite d'être niveau ${sortCible.niv}.`);
            return;
        }
        if (intActuelle < sortCible.int) {
            alert(`Intelligence insuffisante ! Le sort "${sortCible.nom}" nécessite ${sortCible.int} en IN.`);
            return;
        }
        
        perso.magieInvesties[ecole] = niveauMaitriseActuel + 1;
        perso.pointsDispo -= 1;
    } 
    else if (val < 0) {
        let niveauBase = (perso.magieBase && perso.magieBase[ecole]) ? perso.magieBase[ecole] : 0;
        if (niveauMaitriseActuel <= niveauBase) return;
        
        perso.magieInvesties[ecole] = niveauMaitriseActuel - 1;
        perso.pointsDispo += 1;
    }
    
    updateFicheUI();
}

// ================= IMPORT / EXPORT =================
function telechargerFichier() {
    const dataStr = JSON.stringify(perso, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    
    let nomFichier = perso.nom ? perso.nom.replace(/[^a-z0-9]/gi, '_').toLowerCase() : "personnage";
    a.download = nomFichier + "_arcanum.json";
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importerFichier(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const contenu = e.target.result;
            const persoImporte = JSON.parse(contenu);
            
            if (persoImporte.nom !== undefined && persoImporte.statsBase !== undefined) {
                localStorage.setItem('arcanum_sauvegarde', JSON.stringify(persoImporte));
                perso = persoImporte;
                
                alert("Le personnage " + perso.nom + " a été importé avec succès !");
                
                cacherTout();
                document.getElementById('ecran-fiche').style.display = 'block';
                updateFicheUI();
            } else {
                alert("Fichier invalide ou corrompu. Ce n'est pas une fiche ArcanumRP.");
            }
        } catch (erreur) {
            alert("Erreur lors de la lecture du fichier : " + erreur.message);
        }
        document.getElementById('file-import').value = "";
    };
    reader.readAsText(file);
}

// --- LOGIQUE DE MONTÉE DE NIVEAU ---
function levelUp() {
    document.getElementById('ecran-fiche').classList.remove('is-locked');
    perso.niveau += 1;
    perso.pointsDispo += (perso.niveau % 5 === 0 ? 2 : 1);
    updateFicheUI();
}

// ================= VALIDATION =================
function validerChangements() {
    if (perso.pointsDispo > 0) {
        alert("Action impossible : Il vous reste " + perso.pointsDispo + " point(s) à distribuer ! Vous devez tout dépenser avant de verrouiller la fiche.");
        return; 
    }

    if (confirm("Voulez-vous valider définitivement ces changements ? Vous ne pourrez plus retirer ces points par la suite.")) {
        
        for (let s in perso.statsInvesties) {
            perso.statsBase[s] += perso.statsInvesties[s]; 
            perso.statsInvesties[s] = 0; 
        }

        if (!perso.compBase) perso.compBase = {};
        for (let c in perso.compInvesties) {
            perso.compBase[c] = perso.compInvesties[c]; 
        }

        perso.boostPVBase = perso.boostPV || 0;
        perso.boostFTBase = perso.boostFT || 0;

        if (!perso.magieBase) perso.magieBase = {};
        if (perso.magieInvesties) {
            for (let e in perso.magieInvesties) {
                perso.magieBase[e] = perso.magieInvesties[e];
            }
        }
		
		if (!perso.techBase) perso.techBase = {};
        if (perso.techInvesties) {
            for (let t in perso.techInvesties) {
                perso.techBase[t] = perso.techInvesties[t];
            }
        }
		
		

        document.getElementById('ecran-fiche').classList.add('is-locked');
        localStorage.setItem('arcanum_sauvegarde', JSON.stringify(perso));
        
        alert("Fiche mise à jour et verrouillée avec succès !");
        updateFicheUI(); 
    }
}


// ================= GESTION DE LA TECHNOLOGIE =================
function initTechUI() {
    const tabTech = document.getElementById('tab-tech');
    tabTech.innerHTML = '<h4 style="color:#8b7355; border-bottom:1px solid #333; margin-top:0; margin-bottom:15px;">Disciplines Technologiques</h4>'; 

    let tabsDiv = document.createElement('div');
    tabsDiv.className = 'magic-tabs'; // On réutilise le style CSS des onglets Magie !
    tabTech.appendChild(tabsDiv);

    let contentDiv = document.createElement('div');
    tabTech.appendChild(contentDiv);

    let isFirst = true;

    // Dictionnaire des icônes pour chaque discipline
    const iconesTech = {
        "Forge": "⚒️", "Mécanique": "⚙️", "Armurerie": "🔫", "Electricité": "⚡",
        "Botanique": "🌱", "Thérapeutique": "💊", "Chimie": "🧪", "Explosifs": "💣"
    };

    for (let dis in techData) {
        let disData = techData[dis];
        let safeDisId = dis.replace(/\s+/g, '');

        let btn = document.createElement('button');
        btn.className = 'magic-tab-btn' + (isFirst ? ' active' : '');
        btn.innerText = iconesTech[dis] || "🔧"; 
        btn.title = dis; 
        btn.onclick = function() { switchTechTab(dis); };
        tabsDiv.appendChild(btn);

        let pane = document.createElement('div');
        pane.id = 'tech-pane-' + safeDisId;
        pane.className = 'magic-content-pane' + (isFirst ? ' active' : '');

        pane.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span style="color:#d4af37; font-weight:bold; font-variant:small-caps; font-size:1.1em;">${dis}</span>
                <div class="stat-controls">
                    <button class="btn-stat edit-only" onclick="modTech('${dis}', -1)">-</button>
                    <span id="tech-val-${safeDisId}" class="stat-value" style="font-size:1em; margin: 0 10px;">0/7</span>
                    <button class="btn-stat edit-only" onclick="modTech('${dis}', 1)">+</button>
                </div>
            </div>
            <div style="font-size:0.85em; color:#aaa; margin-bottom:15px; font-style:italic; border-left: 2px solid #444; padding-left: 10px;">
                ${disData.desc}
            </div>
            <div id="schemas-list-${safeDisId}" style="background: #1a110b; padding: 10px; border: 1px solid #333; border-radius: 4px;"></div>
        `;

        let schemasContainer = pane.querySelector('#schemas-list-' + safeDisId);
        disData.schematics.forEach((schema, index) => {
            let compoAffiche = schema.compo ? schema.compo : "?";
            let descAffiche = schema.desc ? schema.desc : "Description inconnue.";
            
            schemasContainer.innerHTML += `
                <div id="schema-${safeDisId}-${index}" class="spell-item">
                    <div style="line-height: 1.3;">
                        <strong>Niveau ${index + 1} : ${schema.nom}</strong> 
                        <span style="color: #ff9800; font-weight: bold; font-size: 0.85em; float:right;">Composants: ${compoAffiche}</span><br>
                        <em style="font-size: 0.85em; padding-left: 15px; display: inline-block; margin-top: 3px;">${descAffiche}</em>
                    </div>
                </div>
            `;
        });

        contentDiv.appendChild(pane);
        isFirst = false;
    }
}

function switchTechTab(disActive) {
    let safeId = 'tech-pane-' + disActive.replace(/\s+/g, '');
    
    // Le code fouille dans l'onglet tech pour ajuster les boutons
    const tabTech = document.getElementById('tab-tech');
    tabTech.querySelectorAll('.magic-tab-btn').forEach(btn => {
        if(btn.title === disActive) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    tabTech.querySelectorAll('.magic-content-pane').forEach(pane => {
        if(pane.id === safeId) pane.classList.add('active');
        else pane.classList.remove('active');
    });
}

function modTech(dis, val) {
    if (!perso.techInvesties) perso.techInvesties = {};
    
    let niveauActuel = perso.techInvesties[dis] || 0;
    
    if (val > 0) {
        if (perso.pointsDispo <= 0) return; 
        if (niveauActuel >= 7) return; // La technologie va jusqu'à 7 !
        
        let schemaCible = techData[dis].schematics[niveauActuel];
        let intActuelle = perso.statsBase.IN + (perso.statsInvesties.IN || 0);
        
        if (intActuelle < schemaCible.int) {
            alert(`Intelligence insuffisante ! Le schéma "${schemaCible.nom}" nécessite ${schemaCible.int} en IN.`);
            return;
        }
        
        perso.techInvesties[dis] = niveauActuel + 1;
        perso.pointsDispo -= 1;
    } 
    else if (val < 0) {
        let niveauBase = (perso.techBase && perso.techBase[dis]) ? perso.techBase[dis] : 0;
        if (niveauActuel <= niveauBase) return;
        
        perso.techInvesties[dis] = niveauActuel - 1;
        perso.pointsDispo += 1;
    }
    
    updateFicheUI();
}

// ================= ALIGNEMENT MAGIE / TECHNOLOGIE =================
function calculerAlignement() {
    let ptsMagie = 0;
    let ptsTech = 0;

    // 1. Magie (Chaque sort appris donne 1 point)
    if (perso.magieInvesties) {
        for (let ecole in perso.magieInvesties) {
            ptsMagie += perso.magieInvesties[ecole];
        }
    }

    // 2. Technologie (Chaque schéma appris donne 1 point)
    if (perso.techInvesties) {
        for (let dis in perso.techInvesties) {
            ptsTech += perso.techInvesties[dis];
        }
    }

    // 3. Compétences Technologiques
    // On fouille dans la catégorie "Technologie" de competencesData
    if (perso.compInvesties && typeof competencesData !== 'undefined' && competencesData["Technologie"]) {
        competencesData["Technologie"].forEach(comp => {
            let valeurComp = perso.compInvesties[comp.id] || 0;
            // On divise par 4 car 1 rang investi = +4 dans la valeur
            ptsTech += (valeurComp / 4);
        });
    }

    // Calcul final : Magie monte, Tech descend (x5 par point)
    let alignementFinal = (ptsMagie * 5) - (ptsTech * 5);

    // On bloque l'alignement entre -100 (Max Tech) et +100 (Max Magie)
    if (alignementFinal > 100) alignementFinal = 100;
    if (alignementFinal < -100) alignementFinal = -100;

    return alignementFinal;
}










