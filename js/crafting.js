

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
function ouvrirEcranCraft() {
    cacherTout();
    document.getElementById('ecran-craft').style.display = 'block';

    let div = document.getElementById('liste-crafts');
    div.innerHTML = '';

    // Construit le HTML d'une section de schémas (joueur ou compagnon)
    function _afficherSchemas(techInvesties, titreSection, couleur) {
        if (!techInvesties) return;
        let hasAny = false;
        for (let ecole in techInvesties) {
            let niveau = techInvesties[ecole];
            if (niveau <= 0 || !techData[ecole]) continue;
            if (!hasAny) {
                div.innerHTML += `<h3 style="margin-top:20px; color:${couleur}; border-bottom:1px solid #444; padding-bottom:5px;">${titreSection}</h3>`;
                hasAny = true;
            }
            div.innerHTML += `<h4 style="color:#ddd; margin:15px 0 5px;">${ecole} (Niv. ${niveau})</h4>`;
            for (let i = 0; i < niveau; i++) {
                let schema = techData[ecole].schematics[i];
                if (!schema) continue;
                let compo1Nom = schema.compo[0];
                let compo2Nom = schema.compo[1];
                let idC1 = trouverIdParNom(compo1Nom);
                let idC2 = trouverIdParNom(compo2Nom);
                let qteC1 = _compterObjetCombine(idC1);
                let qteC2 = _compterObjetCombine(idC2);
                let maxCraftable = idC1 === idC2 ? Math.floor(qteC1 / 2) : Math.min(qteC1, qteC2);
                let canCraft = maxCraftable > 0;
                let btnHTML = canCraft
                    ? `<button onclick="fabriquerObjetCombine('${schema.nom}', '${idC1}', '${idC2}')" style="background:#4caf50; color:white; border:none; padding:10px 15px; border-radius:4px; cursor:pointer; font-weight:bold; width:140px;">🔨 Fabriquer (${maxCraftable})</button>`
                    : `<button disabled style="background:#444; color:#888; border:1px solid #555; padding:10px 15px; border-radius:4px; cursor:not-allowed; width:140px;">Manquant</button>`;
                div.innerHTML += `
                    <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.3); border:1px solid #555; padding:12px; margin-bottom:10px; border-radius:6px;">
                        <div style="flex-grow:1; padding-right:15px;">
                            <strong style="color:#ffb74d; font-size:1.1em;">${schema.nom}</strong><br>
                            <em style="color:#bbb; font-size:0.9em;">${schema.desc}</em>
                            <div style="margin-top:8px; font-size:0.95em;">
                                Requis :
                                <span style="color:${qteC1 > 0 ? '#81c784' : '#e57373'}; font-weight:bold;">${compo1Nom} (${qteC1}/1)</span>
                                <span style="color:#888;">+</span>
                                <span style="color:${qteC2 > 0 ? '#81c784' : '#e57373'}; font-weight:bold;">${compo2Nom} (${qteC2}/1)</span>
                            </div>
                        </div>
                        <div style="flex-shrink:0;">${btnHTML}</div>
                    </div>`;
            }
        }
    }

    // Schémas du joueur
    _afficherSchemas(perso.techInvesties, '⚙️ ' + (perso.nom || 'Joueur'), '#ff9800');

    // Schémas des compagnons
    (perso.compagnons || []).forEach(c => {
        if (c.techInvesties) {
            _afficherSchemas(c.techInvesties, '🤝 ' + c.nom, '#d4af37');
        }
    });

    if (!div.innerHTML) div.innerHTML = '<p style="color:#888;">Aucun schéma disponible.</p>';
}




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


// --- Fabriquer en puisant dans les inventaires joueur + compagnons ---
function fabriquerObjetCombine(nomResultat, idCompo1, idCompo2) {
    let idResultat = trouverIdParNom(nomResultat);
    if (!idResultat) return;
    if (window.perso.pvActuel <= 0) { alert("💀 Un mort ne peut pas forger d'objets !"); return; }

    _retirerObjetCombine(idCompo1);
    _retirerObjetCombine(idCompo2);

    let itemData = itemsData[idResultat];
    let indexRes = perso.inventaire.findIndex(i => i.id === idResultat);
    if (itemData.stackable && indexRes !== -1) {
        let q = parseInt(perso.inventaire[indexRes].quantite) || 1;
        perso.inventaire[indexRes].quantite = q + 1;
        perso.inventaire[indexRes].qte = q + 1;
    } else {
        perso.inventaire.push({ id: idResultat, quantite: 1, qte: 1, durabilite: 100, durabiliteMax: 100 });
    }

    alert(`Succès ! Vous avez fabriqué : ${nomResultat}`);
    if (typeof _incStatPartie === 'function') _incStatPartie('objets_craftes', 1);
    if (typeof autoSave === 'function') autoSave();
    if (typeof updateFicheUI === 'function') updateFicheUI();
    ouvrirEcranCraft();
    if (typeof updateInventaireUI === 'function') updateInventaireUI();
}

// --- 2. L'action de fabriquer (VERSION ANTI-CORRUPTION & AFFICHAGE FIXÉ) ---
function fabriquerObjet(nomResultat, idCompo1, idCompo2) {
    let idResultat = trouverIdParNom(nomResultat);
    if (!idResultat) return;


// SÉCURITÉ MORT
    if (window.perso.pvActuel <= 0) {
        alert("💀 Un mort ne peut pas forger d'objets !");
        return;
    }

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
    if (typeof _incStatPartie === 'function') _incStatPartie('objets_craftes', 1);

    // --- ETAPE 4 : RAFRAICHISSEMENT GLOBAL ---
    if (typeof autoSave === "function") autoSave();
    if (typeof updateFicheUI === "function") updateFicheUI(); 
    
    ouvrirEcranCraft(); 
    if (typeof updateInventaireUI === "function") updateInventaireUI();
}



function verifierBoutonCraft() {
    let btnCraft = document.getElementById('btn-menu-craft');
    if (!btnCraft) return;

    let aApprisTech = false;

    if (perso && perso.techInvesties) {
        for (let ecole in perso.techInvesties) {
            if (perso.techInvesties[ecole] > 0) { aApprisTech = true; break; }
        }
    }
    // Vérifier aussi les compagnons
    if (!aApprisTech && perso && perso.compagnons) {
        for (let c of perso.compagnons) {
            if (c.techInvesties) {
                for (let ecole in c.techInvesties) {
                    if (c.techInvesties[ecole] > 0) { aApprisTech = true; break; }
                }
            }
            if (aApprisTech) break;
        }
    }

    btnCraft.style.display = aApprisTech ? "inline-block" : "none";
}

/** Compte un objet dans l'inventaire du joueur + tous les compagnons. */
function _compterObjetCombine(id) {
    if (!id) return 0;
    let total = compterObjet(id);
    (perso.compagnons || []).forEach(c => {
        (c.inventaire || []).forEach(it => {
            if (it.id === id) total += (parseInt(it.quantite) || 1);
        });
    });
    return total;
}

/** Retire 1 exemplaire d'un objet : joueur en priorité, sinon compagnons. */
function _retirerObjetCombine(id) {
    if (!id) return;
    // Essai joueur d'abord
    let idx = perso.inventaire.findIndex(i => i.id === id);
    if (idx !== -1) {
        let q = parseInt(perso.inventaire[idx].quantite) || 1;
        if (q <= 1) perso.inventaire.splice(idx, 1);
        else { perso.inventaire[idx].quantite = q - 1; perso.inventaire[idx].qte = q - 1; }
        return;
    }
    // Sinon compagnons
    for (let c of (perso.compagnons || [])) {
        let ci = (c.inventaire || []).findIndex(i => i.id === id);
        if (ci !== -1) {
            let q = parseInt(c.inventaire[ci].quantite) || 1;
            if (q <= 1) c.inventaire.splice(ci, 1);
            else c.inventaire[ci].quantite = q - 1;
            if (typeof _syncCompagnonsSummary === 'function') _syncCompagnonsSummary();
            return;
        }
    }
}




