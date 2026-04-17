// --- FOUILLE ---
function ouvrirPromptFouille() {
    const config = window._fouilleActiveConfig;
    if (!config || !config.actif) {
        if (typeof _toast === 'function') _toast('⛔ Aucune fouille disponible actuellement.', 'error');
        return;
    }
    // Consommer l'autorisation Firebase
    const playerID = window.perso?.nom?.replace(/\s+/g, '_');
    if (playerID && typeof db !== 'undefined') {
        db.ref('parties/' + sessionActuelle + '/fouille_active/' + playerID).remove();
    }
    cacherTout();
    document.getElementById('ecran-fouille').style.display = 'block';
    if (config.type === 'predefini' && coffresFixes[config.id]) {
        contenuCoffreActuel = [...coffresFixes[config.id].items];
    } else {
        contenuCoffreActuel = genererLootAleatoire(config.rarete || 3);
    }
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
        const nomFouille  = data.demandeIdentification ? `❓ ${typeof _nomInconnu === 'function' ? _nomInconnu(data) : 'Objet mystérieux'}` : data.nom;
        let infoStats     = (!data.demandeIdentification && data.degats && data.degats !== "0") ? ` (⚔️${data.degats})` : ((!data.demandeIdentification && data.armure > 0) ? ` (🛡️${data.armure})` : "");

        div.innerHTML = `
            <span>${nomFouille}${infoStats} x${item.qte}</span>
            <button onclick="prendreUnObjet(${idx})" style="background:#4caf50; border:none; color:white; padding:5px 10px; cursor:pointer;">Prendre</button>
        `;
        list.appendChild(div);
    });
}


function ramasserItem(id, qteAjoutee, identifie = true) {
    if (id === "OR_PIECES") {
        if (perso.argent === undefined) perso.argent = 400;
        perso.argent += qteAjoutee;
        if (typeof _incStatPartie === 'function') _incStatPartie('or_cumule', qteAjoutee);
        updateFicheUI();
        return;
    }

    if (!perso.inventaire) perso.inventaire = [];
    let data = itemsData[id];
    // Seuls les items avec demandeIdentification:true (et non arme_feu) arrivent non identifiés
    const identifieVal = (!identifie && data?.demandeIdentification && data?.type !== 'arme_feu') ? false : true;
    let existant = perso.inventaire.find(i => i.id === id && i.identifie !== false);

    if (existant && data.stackable && identifieVal) {
        let q = parseInt(existant.qte) || parseInt(existant.quantite) || 1;
        existant.qte = q + qteAjoutee;
        existant.quantite = existant.qte;
    } else {
        perso.inventaire.push({ id, qte: qteAjoutee, quantite: qteAjoutee, durabilite: 100, durabiliteMax: 100, identifie: identifieVal });
    }
    autoSave();
}


// --- MARCHAND ---
let marchandActuel = null;

function ouvrirPromptMarchand() {
    const id = window._marchandActifId;
    if (!id || !marchandsData[id]) {
        if (typeof _toast === 'function') _toast('⛔ Aucun marchand disponible actuellement.', 'error');
        return;
    }
    // Consommer l'autorisation Firebase
    const playerID = window.perso?.nom?.replace(/\s+/g, '_');
    if (playerID && typeof db !== 'undefined') {
        db.ref('parties/' + sessionActuelle + '/marchand_actif/' + playerID).remove();
    }
    marchandActuel = marchandsData[id];
    cacherTout();
    document.getElementById('ecran-marchand').style.display = 'block';
    updateMarchandUI();
}

function updateMarchandUI() {
    if (!marchandActuel) return;

    document.getElementById('nom-marchand').innerText = marchandActuel.nom;
    document.getElementById('argent-marchand').innerText = marchandActuel.argent;
    document.getElementById('votre-argent').innerText = perso.argent;

    let ptsMarchandage = (perso.compInvesties && perso.compInvesties['marchandage']) ? perso.compInvesties['marchandage'] : 0;
    let reductionClient = ptsMarchandage * 0.02;

    // --- INVENTAIRE DU MARCHAND (ACHAT) ---
    let listM = document.getElementById('inventaire-marchand');
    listM.innerHTML = "";
    
    marchandActuel.inventaire.forEach((item, idx) => {
        let data = itemsData[item.id];
        if (!data) return;

        let prixAchat = Math.ceil(data.prix * (1.25 - reductionClient)); 
        let estEpuise = (item.qte <= 0);

        // Code HTML du compteur de quantité (seulement si stock > 1)
        let inputHTML = "";
        if (item.qte > 1) {
            inputHTML = `
            <div style="display:flex; align-items:center; gap:5px; margin-right:15px;">
                <button onclick="changerQte('buy-qte-${idx}', -1, ${item.qte})" style="background:#555; color:white; border:none; width:25px; height:25px; cursor:pointer; font-weight:bold; border-radius:3px;">-</button>
                <input type="number" id="buy-qte-${idx}" value="1" min="1" max="${item.qte}" onchange="verifierQte('buy-qte-${idx}', ${item.qte})" style="width:45px; text-align:center; background:#111; color:white; border:1px solid #4caf50; height:25px; border-radius:3px;">
                <button onclick="changerQte('buy-qte-${idx}', 1, ${item.qte})" style="background:#555; color:white; border:none; width:25px; height:25px; cursor:pointer; font-weight:bold; border-radius:3px;">+</button>
            </div>`;
        }

        listM.innerHTML += `
            <div class="skill-row" style="justify-content: space-between; padding: 10px; border-bottom: 1px solid #333; opacity: ${estEpuise ? '0.5' : '1'};">
                <div style="display:flex; flex-direction:column;">
                    <span>${data.nom} <span style="color:#aaa; font-size:0.8em;">(Stock: ${item.qte})</span></span>
                    <span style="color:#d4af37; font-size:0.85em;">Unité: ${prixAchat} Or</span>
                </div>
                <div style="display:flex; align-items:center;">
                    ${!estEpuise ? inputHTML : ''}
                    <button onclick="${estEpuise ? '' : `acheterItem(${idx}, ${prixAchat})`}" 
                            style="background: ${estEpuise ? '#333' : '#4caf50'}; color: ${estEpuise ? '#888' : 'white'}; border: none; padding: 6px 12px; cursor: ${estEpuise ? 'default' : 'pointer'}; border-radius:3px;"
                            ${estEpuise ? 'disabled' : ''}>
                        ${estEpuise ? '❌ Épuisé' : `🛒 Acheter`}
                    </button>
                </div>
            </div>`;
    });

    // --- SERVICE IDENTIFICATION (marchand magique) ---
    if (marchandActuel.estMarchandMagique) {
        const prixIdent = marchandActuel.prixIdentification || 150;
        const nonIdent  = (perso.inventaire || []).filter(it => it.identifie === false);
        let sectionIdent = document.getElementById('section-identification-marchand');
        if (!sectionIdent) {
            sectionIdent = document.createElement('div');
            sectionIdent.id = 'section-identification-marchand';
            sectionIdent.style.cssText = 'border:1px solid #7c4dff;border-radius:6px;padding:12px;margin:12px 0;background:#1a0d2e;';
            document.getElementById('ecran-marchand').querySelector('.skill-row')?.before(sectionIdent)
                || document.getElementById('inventaire-marchand').after(sectionIdent);
        }
        if (nonIdent.length === 0) {
            sectionIdent.innerHTML = `<div style="color:#888;font-style:italic;">🔮 Identification — Aucun objet non identifié dans votre sac.</div>`;
        } else {
            let btns = nonIdent.map((it, idx) => {
                const realIdx = perso.inventaire.indexOf(it);
                const def = itemsData[it.id];
                return `<button onclick="marchandIdentifierObjet(${realIdx}, ${prixIdent})"
                    style="background:#2e1f4d;color:#ce93d8;border:1px solid #7c4dff;padding:7px 10px;border-radius:4px;cursor:pointer;font-size:0.85em;margin:3px;">
                    ❓ ${def?.nom || it.id} — ${prixIdent} Or
                </button>`;
            }).join('');
            sectionIdent.innerHTML = `<div style="color:#ce93d8;font-weight:bold;margin-bottom:8px;">🔮 Service d'identification (${prixIdent} Or / objet)</div>${btns}`;
        }
    }

    // --- VOTRE INVENTAIRE (VENTE) ---
    let listV = document.getElementById('votre-inventaire-vente');
    listV.innerHTML = "";
    
    perso.inventaire.forEach((item, idx) => {
        let data = itemsData[item.id];
        if (!data) return;

        let prixVente = Math.min(Math.floor(data.prix * (0.7 + reductionClient)), data.prix);
        let qteActuelle = item.quantite || item.qte || 1;

        // Code HTML du compteur (seulement si on en a > 1)
        let inputHTML = "";
        if (qteActuelle > 1) {
            inputHTML = `
            <div style="display:flex; align-items:center; gap:5px; margin-right:15px;">
                <button onclick="changerQte('sell-qte-${idx}', -1, ${qteActuelle})" style="background:#555; color:white; border:none; width:25px; height:25px; cursor:pointer; font-weight:bold; border-radius:3px;">-</button>
                <input type="number" id="sell-qte-${idx}" value="1" min="1" max="${qteActuelle}" onchange="verifierQte('sell-qte-${idx}', ${qteActuelle})" style="width:45px; text-align:center; background:#111; color:white; border:1px solid #d4af37; height:25px; border-radius:3px;">
                <button onclick="changerQte('sell-qte-${idx}', 1, ${qteActuelle})" style="background:#555; color:white; border:none; width:25px; height:25px; cursor:pointer; font-weight:bold; border-radius:3px;">+</button>
            </div>`;
        }

        listV.innerHTML += `
            <div class="skill-row" style="justify-content: space-between; padding: 10px; border-bottom: 1px solid #333;">
                <div style="display:flex; flex-direction:column;">
                    <span>${data.nom} <span style="color:#aaa; font-size:0.8em;">(Vous avez: ${qteActuelle})</span></span>
                    <span style="color:#d4af37; font-size:0.85em;">Unité: ${prixVente} Or</span>
                </div>
                <div style="display:flex; align-items:center;">
                    ${inputHTML}
                    <button onclick="vendreItem(${idx}, ${prixVente})" style="background:#d4af37; color:black; font-weight:bold; border:none; padding:6px 12px; cursor:pointer; border-radius:3px;">
                        💰 Vendre
                    </button>
                </div>
            </div>`;
    });
}





function prendreUnObjet(index) {
    let item = contenuCoffreActuel[index];
    ramasserItem(item.id, item.qte, false); // false = peut être non identifié si magique
    
    // Retirer l'objet de la liste locale
    contenuCoffreActuel.splice(index, 1);
    
    // Rafraîchir l'affichage
    actualiserVisuelFouille();
}

function toutPrendre() {
    if (contenuCoffreActuel.length === 0) return;
    
    contenuCoffreActuel.forEach(item => {
        ramasserItem(item.id, item.qte, false);
    });
    
    contenuCoffreActuel = [];
    actualiserVisuelFouille();
}

function acheterItem(idx, prixUnitaire) {
    let itemEnVente = marchandActuel.inventaire[idx];
    if (!itemEnVente || itemEnVente.qte <= 0) return;

    // On récupère la quantité dans le petit champ de texte (par défaut 1 si le champ n'existe pas)
    let qteAAcheter = 1;
    let inputElement = document.getElementById(`buy-qte-${idx}`);
    if (inputElement) {
        qteAAcheter = parseInt(inputElement.value) || 1;
    }

    let prixTotal = prixUnitaire * qteAAcheter;

    if (perso.argent < prixTotal) {
        alert(`Vous n'avez pas assez d'argent ! (${prixTotal} Or requis)`);
        return;
    }

    perso.argent -= prixTotal;
    marchandActuel.argent += prixTotal;
    if (typeof _incStatPartie === 'function') _incStatPartie('or_depense', prixTotal);
    ramasserItem(itemEnVente.id, qteAAcheter);
    itemEnVente.qte -= qteAAcheter;

    if (itemEnVente.qte <= 0) marchandActuel.inventaire.splice(idx, 1);

    autoSave();
    updateMarchandUI();
}

function marchandIdentifierObjet(idx, prix) {
    const item = perso.inventaire[idx];
    if (!item || item.identifie !== false) return;
    if (perso.argent < prix) {
        alert("Vous n'avez pas assez d'or ! (" + prix + " Or requis)");
        return;
    }
    perso.argent -= prix;
    if (marchandActuel) marchandActuel.argent += prix;
    item.identifie = true;
    const def = itemsData[item.id];
    autoSave();
    const props = (typeof _descStatsItem === 'function') ? _descStatsItem(def) : '';
    alert("✨ " + (def?.nom || item.id) + " identifié !" + props);
    updateMarchandUI();
}

function vendreItem(idx, prixUnitaire) {
    let item = perso.inventaire[idx];
    let qteActuelle = item.quantite || item.qte || 1;

    // On récupère la quantité dans le petit champ de texte
    let qteAVendre = 1;
    let inputElement = document.getElementById(`sell-qte-${idx}`);
    if (inputElement) {
        qteAVendre = parseInt(inputElement.value) || 1;
    }

    let prixTotal = prixUnitaire * qteAVendre;

    if (marchandActuel.argent < prixTotal) {
        alert(`Le marchand n'a pas assez d'argent ! (Il lui reste ${marchandActuel.argent} Or)`);
        return;
    }

    perso.argent += prixTotal;
    if (typeof _incStatPartie === 'function') _incStatPartie('or_cumule', prixTotal);
    marchandActuel.argent -= prixTotal;
    item.quantite -= qteAVendre;
    item.qte = item.quantite; 
    
    if (item.quantite <= 0) perso.inventaire.splice(idx, 1);

    autoSave();
    updateMarchandUI();
}

// --- Petites fonctions de forçage pour le MJ ---
function forcerOuvertureMarchand(id) {
    marchandActuel = marchandsData[id];
    cacherTout();
    document.getElementById('ecran-marchand').style.display = 'block';
    updateMarchandUI();
}

function forcerOuvertureCoffre(id) {
    cacherTout();
    document.getElementById('ecran-fouille').style.display = 'block';
    // On simule le contenu du coffre
    contenuCoffreActuel = coffresFixes[id] ? [...coffresFixes[id].items] : genererLootAleatoire(20);
    actualiserVisuelFouille();
}


function changerQte(inputId, delta, max) {
    let input = document.getElementById(inputId);
    if (!input) return;
    let val = parseInt(input.value) || 1;
    val += delta;
    
    // On bloque aux limites
    if (val < 1) val = 1;
    if (val > max) val = max;
    
    input.value = val;
}

function verifierQte(inputId, max) {
    let input = document.getElementById(inputId);
    if (!input) return;
    let val = parseInt(input.value);
    
    // Si l'utilisateur tape n'importe quoi ou un nombre négatif
    if (isNaN(val) || val < 1) val = 1;
    if (val > max) val = max;
    
    input.value = val;
}

