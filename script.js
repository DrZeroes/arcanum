// ================= DONNÉES DE BASE =================
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

    if (typeof competencesData !== 'undefined') initCompetencesUI();
    if (typeof magieData !== 'undefined') initMagieUI();
    if (typeof techData !== 'undefined') initTechUI();

    allerAccueil(); 
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
        document.getElementById('raceTraits').innerHTML = `<strong>Capacité :</strong> ${race.spec} | <strong>Effets :</strong> ${currentBg.effets || "Aucun"}`;
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
        nom: nom, race: document.getElementById('raceSelect').value,
        sexe: document.getElementById('sexeSelect').value,
        antecedent: document.getElementById('bgSelect').value,
        niveau: 1, pointsDispo: 5, boostPV: 0, boostFT: 0,
        statsBase: statsCalculees, statsInvesties: { FO:0, IN:0, CN:0, DX:0, CH:0 },
        compInvesties: {}, magieInvesties: {}, techInvesties: {}
    };

    localStorage.setItem('arcanum_sauvegarde', JSON.stringify(perso));
    cacherTout();
    document.getElementById('ecran-fiche').style.display = 'block';
    updateFicheUI();
}

// ================= MISE À JOUR FICHE =================
function updateFicheUI() {
    const container = document.getElementById('ecran-fiche');
    if (!container) return;

    if (perso.pointsDispo <= 0) container.classList.add('no-points');
    else container.classList.remove('no-points');

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
        // Masquer le bouton moins si rien n'est investi
        let btnMoinsStat = document.querySelector(`button[onclick="modStat('${s}', -1)"]`);
        if (btnMoinsStat) btnMoinsStat.style.visibility = (perso.statsInvesties[s] > 0) ? "visible" : "hidden";
    }

    document.getElementById('fiche-pv').innerText = (finalStats.FO * 2) + finalStats.IN + (perso.boostPV || 0);
    document.getElementById('fiche-fatigue').innerText = (finalStats.CN * 2) + finalStats.IN + (perso.boostFT || 0);

    // Masquer moins vitalité
    let btnMoinsPV = document.querySelector(`button[onclick="boostVital('PV', -5)"]`);
    if (btnMoinsPV) btnMoinsPV.style.visibility = ((perso.boostPV || 0) > (perso.boostPVBase || 0)) ? "visible" : "hidden";
    let btnMoinsFT = document.querySelector(`button[onclick="boostVital('FT', -5)"]`);
    if (btnMoinsFT) btnMoinsFT.style.visibility = ((perso.boostFT || 0) > (perso.boostFTBase || 0)) ? "visible" : "hidden";

    // Calculs Dérivés
    document.getElementById('der-charge').innerText = (finalStats.FO * 2) + " kg";
    let degats = (finalStats.FO > 10) ? (finalStats.FO - 10) : (finalStats.FO < 10 ? Math.floor((finalStats.FO - 10) / 2) : 0);
    document.getElementById('der-degats').innerText = (degats > 0 ? "+" + degats : degats);
    document.getElementById('der-armure').innerText = finalStats.DX;
    document.getElementById('der-vitesse').innerText = finalStats.DX;
    document.getElementById('der-guerison').innerText = Math.floor(finalStats.CN / 3);
    document.getElementById('der-toxines').innerText = finalStats.CN;
    document.getElementById('der-reaction').innerText = (finalStats.CH - 8 > 0 ? "+" + (finalStats.CH - 8) : finalStats.CH - 8);
    document.getElementById('der-compagnons').innerText = Math.max(1, Math.floor(finalStats.CH / 4));

    // Compétences
    if (perso.compInvesties) {
        for (let id in perso.compInvesties) {
            let el = document.getElementById('fiche-val-' + id);
            let base = (perso.compBase && perso.compBase[id]) ? perso.compBase[id] : 0;
            let act = perso.compInvesties[id] || 0;
            if (el) {
                el.innerText = act;
                el.style.color = (act > base) ? "#4caf50" : "#fff";
            }
            let btn = document.querySelector(`button[onclick="modComp('${id}', -4)"]`);
            if (btn) btn.style.visibility = (act > base) ? "visible" : "hidden";
        }
    }

    // Magie & Techno visuel
    if (typeof magieData !== 'undefined') updateMagieUI_Display();
    if (typeof techData !== 'undefined') updateTechUI_Display();
    
    // Alignement & Score
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
                <button class="btn-stat edit-only" onclick="modComp('${c.id}', -4)">-</button>
                <span id="fiche-val-${c.id}" class="stat-value">0</span>
                <button class="btn-stat edit-only" onclick="modComp('${c.id}', 4)">+</button>
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
    if (val > 0 && perso.pointsDispo <= 0) return;
    let act = perso.compInvesties[id] || 0;
    let base = (perso.compBase && perso.compBase[id]) ? perso.compBase[id] : 0;
    if (val < 0 && act <= base) return;
    if (val > 0 && act >= 20) return;
    
    if (val > 0) {
        let statL = "";
        for (let cat in competencesData) {
            let f = competencesData[cat].find(c => c.id === id);
            if (f) { statL = f.stat; break; }
        }
        let req = [0, 4, 5, 12, 15][act / 4];
        let pStat = perso.statsBase[statL] + (perso.statsInvesties[statL] || 0);
        if (pStat < req) { alert(`Améliorer la stat ${statL} avant. (Requis: ${req})`); return; }
    }
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
        btn.className = 'magic-tab-btn' + (isFirst ? ' active' : '');
        btn.innerText = icons[ecole] || "🪄"; btn.title = ecole;
        btn.onclick = function() { switchMagicTab(ecole); };
        tab.querySelector('.magic-tabs').appendChild(btn);

        let pane = document.createElement('div');
        pane.id = 'magic-pane-' + ecole.replace(/\s+/g, '');
        pane.className = 'magic-content-pane' + (isFirst ? ' active' : '');
        pane.innerHTML = `<div class="magic-school-header"><strong>${ecole}</strong>
            <button class="btn-stat edit-only" onclick="modMagie('${ecole}', -1)">-</button>
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
        let intel = perso.statsBase.IN + (perso.statsInvesties.IN || 0);
        if (perso.niveau < s.niv || intel < s.int) { alert("Niveau ou IN insuffisant"); return; }
        perso.magieInvesties[e] = act + 1; perso.pointsDispo--;
    } else {
        let base = (perso.magieBase && perso.magieBase[e]) ? perso.magieBase[e] : 0;
        if (act <= base) return;
        perso.magieInvesties[e] = act - 1; perso.pointsDispo++;
    }
    updateFicheUI();
}

function updateMagieUI_Display() {
    for (let e in magieData) {
        let act = perso.magieInvesties[e] || 0;
        let id = e.replace(/\s+/g, '');
        let el = document.getElementById('magie-val-' + id);
        if (el) el.innerText = act + "/5";
        
        let btnMoins = document.querySelector(`button[onclick="modMagie('${e}', -1)"]`);
        let base = (perso.magieBase && perso.magieBase[e]) ? perso.magieBase[e] : 0;
        if (btnMoins) btnMoins.style.visibility = (act > base) ? "visible" : "hidden";

        for (let i = 0; i < 5; i++) {
            let sDiv = document.getElementById(`spell-${id}-${i}`);
            if (sDiv) sDiv.classList.toggle('learned', i < act);
        }
    }
}

// ================= GESTION TECH =================
function initTechUI() {
    const tab = document.getElementById('tab-tech');
    if (!tab) return;
    tab.innerHTML = '<div class="magic-tabs"></div><div class="magic-contents"></div>';
    const icons = {"Forge":"⚒️","Mécanique":"⚙️","Armurerie":"🔫","Electricité":"⚡","Botanique":"🌱","Thérapeutique":"💊","Chimie":"🧪","Explosifs":"💣"};
    let isFirst = true;
    for (let d in techData) {
        let btn = document.createElement('button');
        btn.className = 'magic-tab-btn' + (isFirst ? ' active' : '');
        btn.innerText = icons[d] || "🔧"; btn.title = d;
        btn.onclick = function() { switchTechTab(d); };
        tab.querySelector('.magic-tabs').appendChild(btn);

        let pane = document.createElement('div');
        pane.id = 'tech-pane-' + d.replace(/\s+/g, '');
        pane.className = 'magic-content-pane' + (isFirst ? ' active' : '');
        pane.innerHTML = `<div class="magic-school-header"><strong>${d}</strong>
            <button class="btn-stat edit-only" onclick="modTech('${d}', -1)">-</button>
            <span id="tech-val-${d.replace(/\s+/g, '')}">0/7</span>
            <button class="btn-stat edit-only" onclick="modTech('${d}', 1)">+</button></div>
            <div id="schemas-${d.replace(/\s+/g, '')}"></div>`;
        techData[d].schematics.forEach((s, i) => {
            pane.querySelector(`#schemas-${d.replace(/\s+/g, '')}`).innerHTML += `<div id="schema-${d.replace(/\s+/g, '')}-${i}" class="spell-item">
                <strong>${s.nom}</strong> (Compos: ${s.compo})<br><em>${s.desc}</em></div>`;
        });
        tab.querySelector('.magic-contents').appendChild(pane);
        isFirst = false;
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
        perso.techInvesties[d] = act + 1; perso.pointsDispo--;
    } else {
        let base = (perso.techBase && perso.techBase[d]) ? perso.techBase[d] : 0;
        if (act <= base) return;
        perso.techInvesties[d] = act - 1; perso.pointsDispo++;
    }
    updateFicheUI();
}

function updateTechUI_Display() {
    for (let d in techData) {
        let act = perso.techInvesties[d] || 0;
        let id = d.replace(/\s+/g, '');
        let el = document.getElementById('tech-val-' + id);
        if (el) el.innerText = act + "/7";
        
        let btnMoins = document.querySelector(`button[onclick="modTech('${d}', -1)"]`);
        let base = (perso.techBase && perso.techBase[d]) ? perso.techBase[d] : 0;
        if (btnMoins) btnMoins.style.visibility = (act > base) ? "visible" : "hidden";

        for (let i = 0; i < 7; i++) {
            let sDiv = document.getElementById(`schema-${id}-${i}`);
            if (sDiv) sDiv.classList.toggle('learned', i < act);
        }
    }
}

// ================= ALIGNEMENT & SAUVEGARDE =================
function calculerAlignement() {
    let m = 0, t = 0;
    if (perso.magieInvesties) for (let e in perso.magieInvesties) m += perso.magieInvesties[e];
    if (perso.techInvesties) for (let d in perso.techInvesties) t += perso.techInvesties[d];
    if (perso.compInvesties && typeof competencesData !== 'undefined' && competencesData["Technologie"]) {
        competencesData["Technologie"].forEach(c => { t += (perso.compInvesties[c.id] || 0) / 4; });
    }
    return Math.max(-100, Math.min(100, (m * 5) - (t * 5)));
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