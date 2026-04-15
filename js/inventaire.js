
// ================= GESTION INVENTAIRE & EQUIPEMENT =================
let triActuel = {
    type: 'poids', // 'poids' ou 'prix'
    ordre: 'desc'  // 'desc' ou 'asc'
};



const nomEmplacements = {
    "tete": "Tête", "torse": "Torse", "gants": "Mains (Gants)", "bottes": "Pieds", 
    "anneau": "Doigt (Anneau)", "amulette": "Cou (Amulette)",
    "main_droite": "Main Droite", "main_gauche": "Main Gauche", "deux_mains": "Deux Mains"
};

let objetEnCoursUtilisation = null;
let indexObjetEnCours = null;

/**
 * Retourne true si cet item doit avoir une durabilité.
 * Règle : armes (mêlée, distance, feu) et armures uniquement.
 * Pas les composants, bijoux, consommables, divers, munitions, etc.
 */
function _itemADurabilite(itemDef) {
    if (!itemDef) return false;
    return ['arme_melee', 'arme_distance', 'arme_feu', 'armure'].includes(itemDef.type);
}

/** Poids total d'un personnage (inventaire + équipement). */
function _calculerPoidsPersonnage(p) {
    if (!p || typeof itemsData === 'undefined') return 0;
    let poids = 0;
    (p.inventaire || []).forEach(it => {
        const def = itemsData[it.id];
        if (def) poids += def.poids * (it.quantite || it.qte || 1);
    });
    if (p.equipement) {
        for (const slot in p.equipement) {
            const eq = p.equipement[slot];
            if (eq && itemsData[eq.id]) poids += itemsData[eq.id].poids;
        }
    }
    return Math.round(poids * 10) / 10;
}

/** Charge max d'un personnage = 5 + FO × 2. */
function _chargeMax(p) {
    if (!p) return 0;
    const fo = Math.max(0, (p.statsBase?.FO || 5) + (p.statsInvesties?.FO || 0) + ((typeof _bonusEffets === 'function') ? _bonusEffets(p, 'FO') : 0));
    return 5 + fo * 2;
}

/** Renvoie true si le personnage dépasse sa charge maximale. */
function _estSurcharge(p) {
    return _calculerPoidsPersonnage(p) > _chargeMax(p);
}

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
    if (window._retourDonjon) {
        window._retourDonjon = false;
        if (typeof ouvrirEcranDonjon === 'function') { ouvrirEcranDonjon(); return; }
    }
    document.getElementById('ecran-fiche').style.display = 'block';
    updateFicheUI(); // Met à jour la fiche avec les bonus de l'équipement !
}




function jeterItem(index) {
    let item = perso.inventaire[index];
    let data = itemsData[item.id];
    let qteActuelle = item.quantite || item.qte || 1;

    // S'il y a plus d'un objet, on demande combien en jeter
    if (qteActuelle > 1) {
        let rep = prompt(`Combien de "${data.nom}" voulez-vous jeter ? (Max : ${qteActuelle})`, "1");
        if (rep === null) return; // Le joueur a cliqué sur Annuler
        
        let qteAJeter = parseInt(rep);
        if (isNaN(qteAJeter) || qteAJeter <= 0) return; // Saisie invalide
        
        if (qteAJeter >= qteActuelle) {
            // S'il jette tout ou plus que ce qu'il a
            if (confirm(`Jeter TOUT votre stock de ${data.nom} ?`)) {
                perso.inventaire.splice(index, 1);
            } else {
                return;
            }
        } else {
            // On réduit la quantité
            item.quantite -= qteAJeter;
            item.qte = item.quantite; // Sécurité de synchronisation
        }
    } else {
        // S'il n'y a qu'un seul objet, un simple confirm suffit
        if (confirm(`Voulez-vous vraiment jeter : ${data.nom} ?`)) {
            perso.inventaire.splice(index, 1);
        }
    }

    updateInventaireUI();
    autoSave(); // On sauvegarde l'inventaire
}

function equiperItem(indexInventaire) {
    let itemInv = perso.inventaire[indexInventaire];
    let data = itemsData[itemInv.id];
    let slot = data.equipable;

    if (!slot || slot === "aucun") { 
        alert("Cet objet ne s'équipe pas."); 
        return; 
    }

  let alignObjet = (data.stats && data.stats.align) ? data.stats.align : 0;

    // --- RESTRICTIONS DE BACKGROUND (Tes codes précédents) ---
    if (perso.antecedent === "Allergie à la magie" && alignObjet > 0) {
        alert("💥 Votre allergie à la magie vous empêche de toucher cet objet !");
        return;
    }
    if (perso.antecedent === "Technophobie" && alignObjet < 0) {
        alert("⚙️ Votre technophobie vous empêche de manipuler cet engin !");
        return;
    }

    // --- NOUVEAU : RESTRICTIONS RACIALES ---

    // 1. Ogre et Demi-Ogre : Pas d'armes à distance (type "arme_feu" ou "arc")
    const estOgreOuDemi = (perso.race === "Ogre" || perso.race === "Demi-Ogre");
    const estArmeADistance = (data.type === "arme_feu" || data.type === "arc");
    
    if (estOgreOuDemi && estArmeADistance) {
        alert("🚫 Vos doigts sont bien trop gros et maladroits pour manipuler une arme aussi délicate !");
        return;
    }

    // 2. Bedokien : Pas d'armure de torse (Coutume/Morphologie)
    if (perso.race === "Bedokien" && slot === "torse") {
        // Optionnel : On peut autoriser les vêtements simples mais bloquer les armures
        // Ici on bloque tout ce qui va sur le torse :
        alert("🛡️ La tradition Bedokienne interdit le port d'armures lourdes ou de vêtements de torse encombrants.");
        return;
    }
    // --------------------------------------------------

    // Reste du code d'équipement habituel
    if (slot === "deux_mains") {
        if (perso.equipement.main_droite) desequiperItem("main_droite", true);
        if (perso.equipement.main_gauche) desequiperItem("main_gauche", true);
        perso.equipement.main_droite = itemInv;
    } else {
        if (perso.equipement[slot]) desequiperItem(slot, true);
        perso.equipement[slot] = itemInv;
    }

    // Initialiser la durabilité uniquement pour les types éligibles (armes + armures)
    const targetSlot = (slot === 'deux_mains') ? 'main_droite' : slot;
    const eqApresEquip = perso.equipement[targetSlot];
    if (eqApresEquip && typeof itemsData !== 'undefined') {
        const defApres = itemsData[eqApresEquip.id];
        if (_itemADurabilite(defApres) && eqApresEquip.durabilite === undefined) {
            eqApresEquip.durabilite = 100; eqApresEquip.durabiliteMax = 100;
        }
    }

    perso.inventaire.splice(indexInventaire, 1);
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


function trierInventaire(type) {
    if (!perso.inventaire) return;

    // Si on clique sur le même type, on inverse l'ordre
    if (triActuel.type === type) {
        triActuel.ordre = (triActuel.ordre === 'desc') ? 'asc' : 'desc';
    } else {
        // Nouveau type de tri, on remet en descendant par défaut
        triActuel.type = type;
        triActuel.ordre = 'desc';
    }

    perso.inventaire.sort((a, b) => {
        let dataA = itemsData[a.id];
        let dataB = itemsData[b.id];
        if (!dataA || !dataB) return 0;

        let valA = (type === 'poids') ? dataA.poids : dataA.prix;
        let valB = (type === 'poids') ? dataB.poids : dataB.prix;

        return (triActuel.ordre === 'desc') ? (valB - valA) : (valA - valB);
    });

    updateInventaireUI();
}

// ==========================================
// UTILISATION D'OBJETS DEPUIS L'INVENTAIRE 🎒
// ==========================================


// --- FONCTION UNIFIÉE POUR RETIRER UN OBJET DU SAC ---
function retirerDeInventaire(itemId, quantiteADenlever = 1) {
    const index = perso.inventaire.findIndex(item => item.id === itemId);

    if (index !== -1) {
        let itemSlot = perso.inventaire[index];
        // On gère les deux noms de variables possibles (quantite ou qte)
        let qteActuelle = itemSlot.quantite || itemSlot.qte || 1;
        
        qteActuelle -= quantiteADenlever;

        if (qteActuelle <= 0) {
            // Plus d'objet ? On supprime la ligne
            perso.inventaire.splice(index, 1);
        } else {
            // On met à jour les deux pour être sûr
            itemSlot.quantite = qteActuelle;
            itemSlot.qte = qteActuelle;
        }
        
        if (typeof autoSave === "function") autoSave();
    }
}


function preparerUtilisationCible(index) {
    const item = perso.inventaire[index];
    if (!item) return;

    indexObjetEnCours = index;
    objetEnCoursUtilisation = item;

    const moiID = perso.nom.replace(/\s+/g, '_');

    db.ref('parties/' + sessionActuelle + '/joueurs').once('value', (snapshot) => {
        const joueurs = snapshot.val();
        const liste = document.getElementById('liste-destinataires');
        const titre = document.querySelector('#modal-transfert h3') || document.querySelector('#modal-transfert .titre'); 
        
        // On change le titre de la modal pour plus de clarté
        if (titre) titre.innerText = "Utiliser sur qui ?";
        
        const fragments = [
            `<button onclick="finaliserActionObjet('${moiID}', 'Vous-même')" style="background:#4caf50; color:white; padding:10px; border:none; border-radius:5px; cursor:pointer; margin-bottom:5px; width:100%;">✨ Sur moi-même</button>`
        ];

        for (let id in joueurs) {
            if (id !== moiID) {
                fragments.push(`<button onclick="finaliserActionObjet('${id}', '${joueurs[id].nom}')" style="background:#ff9800; color:white; padding:10px; border:none; border-radius:5px; cursor:pointer; margin-bottom:5px; width:100%;">À ${joueurs[id].nom}</button>`);
            }
        }

        liste.innerHTML = fragments.join('');
        document.getElementById('modal-transfert').style.display = 'block';
    });
}
function updateInventaireUI() {
    let listInv = document.getElementById('inv-list-full');
    let listEq = document.getElementById('equipement-list');
    if (!listInv || !listEq) return 0;

    // --- 1. MISE À JOUR DE L'ARGENT ---
    const elArgent = document.getElementById('inv-argent-total');
    if (elArgent) {
        // On affiche l'argent du perso (ou 0 si indéfini)
        elArgent.innerText = (window.perso && window.perso.argent !== undefined) ? window.perso.argent : 0;
    }

    let poidsTotal = 0;

    // --- CALCUL DU MARCHANDAGE POUR LE PRIX AFFICHE ---
    let ptsMarchandage = (perso.compInvesties && perso.compInvesties['marchandage']) ? perso.compInvesties['marchandage'] : 0;
    let reductionClient = ptsMarchandage * 0.02;

    // --- GENERATEUR DE STATS VISUELLES ---
    const getStatsHtml = (data, item) => {
        let h = `<div style="margin-top:5px; font-size:0.85em;">`;
        if (data.degats && data.degats !== "0") h += `<span style="color:#ff5252; margin-right: 10px;">⚔️ Dégâts: ${data.degats}</span>`;
        if (data.armure && data.armure > 0) h += `<span style="color:#4caf50; margin-right: 10px;">🛡️ Armure: ${data.armure}</span>`;
        h += `</div>`;
        return h;
    };

    // --- 2. DESSINER LE SAC À DOS ---
// Calcul des styles et labels pour les boutons
    const styleActif = "border: 2px solid #4caf50; background: #2e4d23; color: white;";
    const styleInactif = "border: 1px solid #555; background: #333; color: #888;";
    
    let labelPoids = (triActuel.type === 'poids' && triActuel.ordre === 'asc') ? "⚖️ Moins Lourd" : "⚖️ Plus Lourd";
    let labelPrix = (triActuel.type === 'prix' && triActuel.ordre === 'asc') ? "💰 Moins Cher" : "💰 Plus Cher";

    let htmlInv = `
        <div style="display: flex; gap: 10px; margin-bottom: 15px; background: #1a110b; padding: 10px; border-radius: 4px; border: 1px solid #444;">
            <span style="color: #888; font-size: 0.9em; align-self: center;">Trier :</span>
            
            <button onclick="trierInventaire('poids')" 
                style="${triActuel.type === 'poids' ? styleActif : styleInactif} padding: 5px 10px; cursor: pointer; border-radius: 3px; font-size: 0.8em; flex: 1; transition: all 0.2s;">
                ${labelPoids}
            </button>
            
            <button onclick="trierInventaire('prix')" 
                style="${triActuel.type === 'prix' ? styleActif : styleInactif} padding: 5px 10px; cursor: pointer; border-radius: 3px; font-size: 0.8em; flex: 1; transition: all 0.2s;">
                ${labelPrix}
            </button>
        </div>
    `;




    if (!perso.inventaire || perso.inventaire.length === 0) {
        htmlInv += "<div style='color:#666; font-style:italic; text-align: center; margin-top: 20px;'>Le sac est vide.</div>";
    } else {
        perso.inventaire.forEach((item, index) => {
            let data = itemsData[item.id];
            if (data) {
                poidsTotal += data.poids * (item.quantite || item.qte || 1);

                // Prix de vente : basé sur la durabilité si l'objet en a une, sinon formule standard
                let prixVente;
                if (item.durabilite !== undefined && item.durabiliteMax > 0) {
                    prixVente = Math.floor(data.prix * (item.durabilite / item.durabiliteMax));
                } else {
                    prixVente = Math.floor(data.prix * (0.7 + reductionClient));
                    prixVente = Math.min(prixVente, data.prix);
                }

                let btnEquiper = (data.equipable && data.equipable !== "aucun")
                    ? `<button onclick="equiperItem(${index})" style="background:#4caf50; color:#fff; border:none; padding:5px 10px; cursor:pointer; border-radius:3px;">Équiper</button>` : ``;

                let btnConsommer = (data.type === "consommable")
                    ? `<button onclick="preparerUtilisationCible(${index})" style="background:#ff9800; color:#fff; border:none; padding:5px 10px; cursor:pointer; border-radius:3px;">🧪 Utiliser</button>` : ``;

                // Réparation depuis l'inventaire (objet précédemment équipé avec durabilité)
                const reparation_pts = perso.compInvesties?.reparation || 0;
                const durInv = item.durabilite;
                const durMaxInv = item.durabiliteMax || 100;
                const btnReparerInv = (durInv !== undefined && reparation_pts > 0 && durInv < durMaxInv)
                    ? `<button onclick="reparerInventaire(${index})" style="background:#795548; color:#fff; border:none; padding:5px 8px; cursor:pointer; border-radius:3px; font-size:0.8em;">🔧 Réparer</button>`
                    : '';

                htmlInv += `
                    <div style="background: #251b14; padding: 10px; border: 1px solid #444; border-radius: 4px; margin-bottom: 8px;">
                        <div style="display:flex; justify-content: space-between;">
                            <strong style="color:#dcdcdc;">${data.nom} (x${item.quantite || 1})</strong>
                            <div style="text-align: right; min-width: 80px;">
                                <span style="color:#aaa; display:block; font-size:0.9em;">⚖️ ${data.poids} kg</span>
                                <span style="color:#d4af37; display:block; font-size:0.9em;">💰 ${prixVente} Or</span>
                            </div>
                        </div>
                        <div style="font-size: 0.8em; color: #888; font-style: italic;">${data.desc}</div>
                        ${getStatsHtml(data, item)}
                        <div style="display:flex; gap: 5px; margin-top: 8px; flex-wrap:wrap;">
                            ${btnEquiper} ${btnConsommer} ${btnReparerInv}
                            <button onclick="preparerDonObjet(${index})" style="background:#2196f3; color:#fff; border:none; padding:5px 10px; cursor:pointer; border-radius:3px;">🤝 Donner</button>
                            <button onclick="jeterItem(${index})" style="background:#8b0000; color:#fff; border:none; padding:5px 10px; cursor:pointer; border-radius:3px;">Jeter</button>
                        </div>
                    </div>`;
            }
        });
    }
    listInv.innerHTML = htmlInv;

    // --- 3. DESSINER L'ÉQUIPEMENT ---
    // Détecte si la main droite porte une arme à deux mains
    const itemMainDroite = perso.equipement.main_droite;
    const estDeuxMains = !!(itemMainDroite && itemsData[itemMainDroite.id]?.equipable === 'deux_mains');

    let htmlEq = ``;
    for (let slot in perso.equipement) {
        let itemEq = perso.equipement[slot];
        let nomSlot = nomEmplacements[slot] || slot;

        // Main gauche bloquée par une arme à 2 mains
        if (slot === 'main_gauche' && estDeuxMains) {
            htmlEq += `
                <div style="background:#111; border:1px dashed #8b4513; padding:10px; border-radius:4px; margin-bottom:5px; opacity:0.7;">
                    <div style="font-size:0.7em; color:#8b4513; text-transform:uppercase;">${nomSlot}</div>
                    <div style="color:#8b4513; font-style:italic;">⛔ Occupée (arme à deux mains)</div>
                </div>`;
            continue;
        }

        if (itemEq && typeof itemEq !== "string" && itemsData[itemEq.id]) {
            let data = itemsData[itemEq.id];
            poidsTotal += data.poids;
            const reparation_pts = perso.compInvesties?.reparation || 0;
            const durMax = itemEq.durabiliteMax || 100;
            const dur = itemEq.durabilite !== undefined ? itemEq.durabilite : durMax;
            const durColor = dur <= 0 ? '#f44336' : dur < 30 ? '#ff9800' : '#4caf50';
            const durHtml = itemEq.durabilite !== undefined
                ? `<small style="color:${durColor}"> [${dur}/${durMax}]</small>`
                : '';
            const btnReparer = (reparation_pts > 0 && dur < durMax)
                ? `<button onclick="reparer('${slot}')" style="background:#795548; color:#fff; border:none; padding:4px 7px; cursor:pointer; border-radius:3px; font-size:0.75em; margin-left:4px;">🔧 Réparer</button>`
                : '';
            htmlEq += `
                <div style="background: #1a110b; border: 1px solid #4caf50; padding: 10px; border-radius: 4px; margin-bottom: 5px; display:flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 0.7em; color: #4caf50; text-transform: uppercase;">${nomSlot}</div>
                        <strong style="color: #fff;">${data.nom}</strong>${durHtml}
                        ${getStatsHtml(data, itemEq)}
                    </div>
                    <div style="display:flex; gap:4px;">
                        ${btnReparer}
                        <button onclick="desequiperItem('${slot}')" style="background:#444; color:#fff; border:none; padding:5px; cursor:pointer; border-radius:3px; font-size: 0.8em;">Retirer</button>
                    </div>
                </div>`;
        } else {
            htmlEq += `
                <div style="background: #111; border: 1px dashed #444; padding: 10px; border-radius: 4px; margin-bottom: 5px;">
                    <div style="font-size: 0.7em; color: #666; text-transform: uppercase;">${nomSlot}</div>
                    <div style="color: #444; font-style: italic;">Vide</div>
                </div>`;
        }
    }
    listEq.innerHTML = htmlEq;
    
    // --- 4. MISE À JOUR DE LA CHARGE FINALE ---
    const chargeMax = _chargeMax(perso);
    const estSurchargé = poidsTotal > chargeMax;
    let elPoidsInv = document.getElementById('inv-poids-total');
    if (elPoidsInv) {
        elPoidsInv.innerText = poidsTotal.toFixed(1) + " / " + chargeMax + " kg"
            + (estSurchargé ? " ⚠ SURCHARGÉ" : "");
        elPoidsInv.style.color = estSurchargé ? "#f44336" : "#4caf50";
    }

    return poidsTotal;
}


function finaliserActionObjet(cibleID, nomCible) {
    if (!objetEnCoursUtilisation) return;

    const itemPile = objetEnCoursUtilisation;
    const data = itemsData[itemPile.id]; 
    const index = indexObjetEnCours;

    // 1. RÉCUPÉRATION DE L'ÉTAT DE LA CIBLE
    db.ref('parties/' + sessionActuelle + '/joueurs/' + cibleID).once('value', (snapshot) => {
        const cibleData = snapshot.val();
        if (!cibleData) return;

        const pvActuels = cibleData.pvActuel || 0;
        const pvMax = cibleData.pvMax || 100;
        const estKO = (pvActuels <= 0 || cibleData.estMort === true);

        // --- Extraction des stats de l'objet pour plus de clarté ---
        const soinPV = data.stats ? data.stats.soinPV : 0;
        const soinFT = data.stats ? data.stats.soinFT : 0;
        const estResurrection = data.stats ? data.stats.resurrection : false;
        const curePoison = data.stats ? data.stats.curePoison : false;

        // 2. VÉRIFICATIONS DES RÈGLES DE JEU 🛡️

        // Cas A : L'objet est un RÉANIMATEUR
        if (estResurrection) {
            if (!estKO) {
                alert(`🚫 ${nomCible} n'est pas KO. Le réanimateur n'a aucun effet sur les vivants !`);
                return;
            }
        }
        // Cas B : L'objet est un SOIN (Potion, Nourriture...) — pas de blocage si c'est juste un antidote
        else if (soinPV > 0) {
            if (estKO) {
                alert(`🚫 ${nomCible} est inconscient(e). Une potion ne servira à rien, il faut un réanimateur !`);
                return;
            }
            if (pvActuels >= pvMax) {
                alert(`🚫 ${nomCible} est déjà en pleine forme !`);
                return;
            }
        }

        // 3. APPLICATION DES EFFETS 🪄
        // Bonus Soins : +5% d'efficacité par point de compétence
        const soins_pts = window.perso?.compInvesties?.soins || 0;
        const soinMult = 1 + soins_pts * 0.05;

        const statRef = db.ref('parties/' + sessionActuelle + '/joueurs/' + cibleID + '/modif_stat');
        const pvBase = (estResurrection && !soinPV) ? 10 : soinPV;
        const pvEffectif = pvBase > 0 ? Math.round(pvBase * soinMult) : 0;
        const ftEffectif = soinFT > 0 ? Math.round(soinFT * soinMult) : 0;
        const envoyerStat = (stat, valeur) => statRef.set({ stat, valeur, timestamp: Date.now() });

        if (pvEffectif > 0 && ftEffectif > 0) {
            envoyerStat('PV', pvEffectif).then(() => envoyerStat('FT', ftEffectif));
        } else if (pvEffectif > 0) {
            envoyerStat('PV', pvEffectif);
        } else if (ftEffectif > 0) {
            envoyerStat('FT', ftEffectif);
        }

        // Cure poison (sur soi-même, nettoyer directement ; sur autrui, envoyer via Firebase)
        if (curePoison) {
            if (cibleID === (window.perso?.nom || '').replace(/\s+/g, '_')) {
                window.perso.poison = null;
                if (typeof _toast === 'function') _toast('✅ Poison neutralisé !', 'success');
                if (typeof rafraichirAccueil === 'function') rafraichirAccueil();
            } else {
                statRef.set({ stat: 'curePoison', valeur: 1, timestamp: Date.now() });
            }
        }

        alert(`✅ ${data.nom} utilisé sur ${nomCible} !`);

        // 4. CONSOMMATION DE L'OBJET
        let qte = itemPile.quantite || itemPile.qte || 1;
        if (qte > 1) {
            itemPile.quantite = qte - 1;
            itemPile.qte = itemPile.quantite;
        } else {
            perso.inventaire.splice(index, 1);
        }

        // 5. FERMETURE ET NETTOYAGE
        document.getElementById('modal-transfert').style.display = 'none';
        objetEnCoursUtilisation = null;
        indexObjetEnCours = null;
        
        if (typeof autoSave === 'function') autoSave();
        if (typeof updateInventaireUI === 'function') updateInventaireUI();
    });
}

/** Logique commune de réparation — modifie l'objet en place. */
function _appliquerReparation(objet, reparation_pts) {
    const degradationPct = Math.max(5, 15 - Math.floor(reparation_pts / 2));
    const ancienMax = objet.durabiliteMax || 100;
    const nouveauMax = Math.max(1, Math.floor(ancienMax * (1 - degradationPct / 100)));
    const nom = (typeof itemsData !== 'undefined' && itemsData[objet.id]?.nom) || objet.id;
    if (!confirm(`🔧 Réparer ${nom} ?\nDurabilité max : ${ancienMax} → ${nouveauMax} (−${degradationPct}%)\nL'objet sera réparé à ${nouveauMax}.`)) return false;
    objet.durabiliteMax = nouveauMax;
    objet.durabilite = nouveauMax;
    return true;
}

function reparer(slot) {
    const perso = window.perso;
    const itemEq = perso.equipement?.[slot];
    if (!itemEq) return;
    const reparation_pts = perso.compInvesties?.reparation || 0;
    if (reparation_pts <= 0) return;
    if (!_appliquerReparation(itemEq, reparation_pts)) return;
    if (typeof autoSave === 'function') autoSave();
    if (typeof updateInventaireUI === 'function') updateInventaireUI();
    if (typeof _toast === 'function') _toast(`🔧 Réparé ! Durabilité max réduite à ${itemEq.durabiliteMax}.`, 'success');
}

function reparerInventaire(index) {
    const perso = window.perso;
    const item = perso.inventaire?.[index];
    if (!item || item.durabilite === undefined) return;
    const reparation_pts = perso.compInvesties?.reparation || 0;
    if (reparation_pts <= 0) return;
    if (!_appliquerReparation(item, reparation_pts)) return;
    if (typeof autoSave === 'function') autoSave();
    if (typeof updateInventaireUI === 'function') updateInventaireUI();
    if (typeof _toast === 'function') _toast(`🔧 Réparé ! Durabilité max réduite à ${item.durabiliteMax}.`, 'success');
}

function ouvrirDonnerOr() {
    const actuel = window.perso?.argent || 0;
    if (!db || !sessionActuelle) { alert('Pas connecté.'); return; }

    const modal = document.getElementById('modal-transfert');
    const liste = document.getElementById('liste-destinataires');
    if (!modal || !liste) return;

    db.ref('parties/' + sessionActuelle + '/joueurs').once('value', (snap) => {
        const joueurs = snap.val() || {};
        const moiID = window.perso.nom.replace(/\s+/g, '_');
        const autres = Object.entries(joueurs).filter(([id]) => id !== moiID);

        liste.innerHTML = '';

        // Champ montant en haut du modal
        const zoneInput = document.createElement('div');
        zoneInput.style = 'margin-bottom:12px;';
        zoneInput.innerHTML = `
            <label style="color:#d4af37;font-size:0.85em;display:block;margin-bottom:4px;">
                Montant (vous avez : <strong>${actuel}</strong> or)
            </label>
            <input id="input-montant-or" type="number" min="1" max="${actuel}" value="1"
                style="width:100%;box-sizing:border-box;padding:8px;background:#111;color:#d4af37;
                border:1px solid #d4af37;border-radius:4px;font-size:1em;text-align:center;">`;
        liste.appendChild(zoneInput);

        if (autres.length === 0) {
            const p = document.createElement('p');
            p.style = 'color:#aaa;font-style:italic;';
            p.textContent = 'Personne d\'autre en ligne...';
            liste.appendChild(p);
        } else {
            autres.forEach(([destinID, destinJoueur]) => {
                const btn = document.createElement('button');
                btn.innerText = '👤 ' + destinJoueur.nom;
                btn.style = 'background:#444;color:#d4af37;border:1px solid #d4af37;padding:10px;border-radius:5px;cursor:pointer;font-weight:bold;width:100%;text-align:left;transition:0.2s;';
                btn.onmouseover = () => { btn.style.background = '#555'; };
                btn.onmouseout  = () => { btn.style.background = '#444'; };
                btn.onclick = () => {
                    const montant = parseInt(document.getElementById('input-montant-or')?.value) || 0;
                    if (montant <= 0) { if (typeof _toast === 'function') _toast('Montant invalide.', 'error'); return; }
                    if (montant > (window.perso?.argent || 0)) { if (typeof _toast === 'function') _toast(`Pas assez d'or !`, 'error'); return; }

                    modal.style.display = 'none';

                    window.perso.argent -= montant;
                    if (typeof autoSave === 'function') autoSave();
                    if (typeof synchroniserJoueur === 'function') synchroniserJoueur();

                    db.ref('parties/' + sessionActuelle + '/joueurs/' + destinID + '/modif_argent').set({
                        valeur: montant,
                        de: window.perso.nom,
                        timestamp: Date.now()
                    });

                    if (typeof updateInventaireUI === 'function') updateInventaireUI();
                    if (typeof _toast === 'function') _toast(`💰 ${montant} or envoyé à ${destinJoueur.nom} !`, 'success');
                };
                liste.appendChild(btn);
            });
        }

        // Titre du modal
        const titre = modal.querySelector('h3');
        if (titre) titre.textContent = '💰 Donner de l\'or';

        modal.style.display = 'block';
    });
}

function ouvrirDepenseOr() {
    const actuel = window.perso?.argent || 0;
    const saisie = prompt(`Combien d'or voulez-vous dépenser ? (Vous avez : ${actuel} or)`, '');
    if (saisie === null) return;
    const montant = parseInt(saisie);
    if (isNaN(montant) || montant <= 0) { if (typeof _toast === 'function') _toast('Montant invalide.', 'error'); return; }
    if (montant > actuel) { if (typeof _toast === 'function') _toast(`Pas assez d'or ! (${actuel} or)`, 'error'); return; }
    window.perso.argent = actuel - montant;
    if (typeof autoSave === 'function') autoSave();
    if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
    if (typeof updateInventaireUI === 'function') updateInventaireUI();
    if (typeof _toast === 'function') _toast(`💸 ${montant} or dépensé. Reste : ${window.perso.argent} or`, 'gold');
}