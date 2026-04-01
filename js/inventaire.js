
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

/*
function utiliserObjet(indexObjet) {
    if (!perso || !perso.inventaire || !perso.inventaire[indexObjet]) return;

    const objet = perso.inventaire[indexObjet];
    const selectCible = document.getElementById('cible-objet');
    const valeurCible = selectCible ? selectCible.value : "soi-meme";

    // 1. Définir la cible
    let cible = perso;
    if (valeurCible !== "soi-meme") {
        const nomJoueur = selectCible.options[selectCible.selectedIndex].text;
        cible = { nom: nomJoueur, id: valeurCible };
    }

    // Calcul pour la limite de soin
    const cibleMaxPV = cible.statsBase ? 
        (cible.statsBase.FO * 2) + (cible.statsBase.IN) + (cible.boostPV || 0) : 100;
    
    // On estime l'état de la cible (mort ou vivant)
    let pvCible = (cible === perso) ? perso.pvActuel : 1; 
    let estMort = pvCible <= 0;

    // 2. Vérifications et Effets
    if (objet.soin) {
        if (estMort && !objet.resurrection) {
            alert(`${cible.nom || "La cible"} est inconsciente. Cet objet ne peut pas la ranimer !`);
            return;
        }
        if (pvCible >= cibleMaxPV) {
             alert(`${cible.nom || "La cible"} est déjà en pleine forme !`);
             return;
        }

        // --- APPLICATION DU SOIN ---
        if (cible === perso) {
            perso.pvActuel = Math.min(cibleMaxPV, perso.pvActuel + objet.soin);
            alert(`🧪 Vous utilisez ${objet.nom} : +${objet.soin} PV.`);
            if (typeof verifierMort === 'function') verifierMort();
        } else {
            db.ref('parties/' + sessionActuelle + '/joueurs/' + cible.id + '/modif_stat').set({
                stat: 'PV',
                valeur: objet.soin,
                timestamp: Date.now()
            });
            alert(`🧪 Vous donnez ${objet.nom} à ${cible.nom} : +${objet.soin} PV.`);
        }

    } else if (objet.resurrection) {
        // Le cas du Réanimateur
        if (cible === perso) {
            alert("Vous ne pouvez pas utiliser un réanimateur sur vous-même en étant mort !");
            return;
        }
        db.ref('parties/' + sessionActuelle + '/joueurs/' + cible.id + '/modif_stat').set({
            stat: 'PV',
            valeur: objet.soin || 50, // Rend 50 PV par défaut à la résurrection
            timestamp: Date.now()
        });
        alert(`⚡ Vous utilisez un ${objet.nom} pour ranimer ${cible.nom} !`);
    } else {
        alert("Cet objet ne peut pas être utilisé comme ça.");
        return;
    }

    // 3. Consommer l'objet (réduire la quantité ou le supprimer)
    if (objet.quantite && objet.quantite > 1) {
        objet.quantite -= 1;
    } else {
        perso.inventaire.splice(indexObjet, 1);
    }

    // 4. Sauvegarder et rafraîchir l'interface
    if (typeof autoSave === 'function') autoSave();
    if (typeof afficherInventaire === 'function') afficherInventaire(); // Ta fonction qui dessine l'inventaire
    if (typeof rafraichirAccueil === 'function') rafraichirAccueil();
}

*/

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
        
        liste.innerHTML = "";
        let aDesJoueurs = false;

        // Optionnel : Ajouter "Soi-même" en haut de la liste pour l'utilisation
        liste.innerHTML += `<button onclick="finaliserActionObjet('${moiID}', 'Vous-même')" style="background:#4caf50; color:white; padding:10px; border:none; border-radius:5px; cursor:pointer; margin-bottom:5px; width:100%;">✨ Sur moi-même</button>`;

        for (let id in joueurs) {
            if (id !== moiID) {
                aDesJoueurs = true;
                // On utilise finaliserActionObjet au lieu de executerDonObjet
                liste.innerHTML += `<button onclick="finaliserActionObjet('${id}', '${joueurs[id].nom}')" style="background:#ff9800; color:white; padding:10px; border:none; border-radius:5px; cursor:pointer; margin-bottom:5px; width:100%;">À ${joueurs[id].nom}</button>`;
            }
        }

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
        if (item.durabilite) h += `<span style="color:#aaa;">🔧 État: ${item.durabilite}/${item.durabiliteMax}</span>`;
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
                poidsTotal += data.poids * item.quantite;
                
                let prixVente = Math.floor(data.prix * (0.7 + reductionClient));
                prixVente = Math.min(prixVente, data.prix);
                
                let btnEquiper = (data.equipable && data.equipable !== "aucun") 
                    ? `<button onclick="equiperItem(${index})" style="background:#4caf50; color:#fff; border:none; padding:5px 10px; cursor:pointer; border-radius:3px;">Équiper</button>` : ``;

                let btnConsommer = (data.type === "consommable")
                    ? `<button onclick="preparerUtilisationCible(${index})" style="background:#ff9800; color:#fff; border:none; padding:5px 10px; cursor:pointer; border-radius:3px;">🧪 Utiliser</button>` : ``;

                htmlInv += `
                    <div style="background: #251b14; padding: 10px; border: 1px solid #444; border-radius: 4px; margin-bottom: 8px;">
                        <div style="display:flex; justify-content: space-between;">
                            <strong style="color:#dcdcdc;">${data.nom} (x${item.quantite})</strong>
                            <div style="text-align: right; min-width: 80px;">
                                <span style="color:#aaa; display:block; font-size:0.9em;">⚖️ ${data.poids} kg</span>
                                <span style="color:#d4af37; display:block; font-size:0.9em;">💰 ${prixVente} Or</span>
                            </div>
                        </div>
                        <div style="font-size: 0.8em; color: #888; font-style: italic;">${data.desc}</div>
                        ${getStatsHtml(data, item)}
                        <div style="display:flex; gap: 5px; margin-top: 8px;">
                            ${btnEquiper} ${btnConsommer}
                            <button onclick="preparerDonObjet('${item.id}')" style="background:#2196f3; color:#fff; border:none; padding:5px 10px; cursor:pointer; border-radius:3px;">🤝 Donner</button>
                            <button onclick="jeterItem(${index})" style="background:#8b0000; color:#fff; border:none; padding:5px 10px; cursor:pointer; border-radius:3px;">Jeter</button>
                        </div>
                    </div>`;
            }
        });
    }
    listInv.innerHTML = htmlInv;

    // --- 3. DESSINER L'ÉQUIPEMENT ---
    let htmlEq = ``;
    for (let slot in perso.equipement) {
        let itemEq = perso.equipement[slot];
        let nomSlot = nomEmplacements[slot] || slot;
        
        if (itemEq && typeof itemEq !== "string" && itemsData[itemEq.id]) {
            let data = itemsData[itemEq.id];
            poidsTotal += data.poids; 
            htmlEq += `
                <div style="background: #1a110b; border: 1px solid #4caf50; padding: 10px; border-radius: 4px; margin-bottom: 5px; display:flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 0.7em; color: #4caf50; text-transform: uppercase;">${nomSlot}</div>
                        <strong style="color: #fff;">${data.nom}</strong>
                        ${getStatsHtml(data, itemEq)}
                    </div>
                    <button onclick="desequiperItem('${slot}')" style="background:#444; color:#fff; border:none; padding:5px; cursor:pointer; border-radius:3px; font-size: 0.8em;">Retirer</button>
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
    let statFO = (perso.statsBase.FO || 8) + (perso.statsInvesties.FO || 0);
    let elPoidsInv = document.getElementById('inv-poids-total');
    if (elPoidsInv) {
        elPoidsInv.innerText = poidsTotal.toFixed(1) + " / " + (statFO * 2) + " kg";
        elPoidsInv.style.color = (poidsTotal > (statFO * 2)) ? "#f44336" : "#4caf50"; 
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

        // 2. VÉRIFICATIONS DES RÈGLES DE JEU 🛡️
        
        // Cas A : L'objet est un RÉANIMATEUR
        if (estResurrection) {
            if (!estKO) {
                alert(`🚫 ${nomCible} n'est pas KO. Le réanimateur n'a aucun effet sur les vivants !`);
                return;
            }
        } 
        // Cas B : L'objet est un SOIN (Potion, Nourriture...)
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
        
        // Envoi du soin PV
        if (soinPV > 0) {
            db.ref('parties/' + sessionActuelle + '/joueurs/' + cibleID + '/modif_stat').set({
                stat: 'PV',
                valeur: soinPV,
                timestamp: Date.now()
            });
        }

        // Envoi du soin Fatigue (Energie)
        if (soinFT > 0) {
            db.ref('parties/' + sessionActuelle + '/joueurs/' + cibleID + '/modif_stat').set({
                stat: 'FT',
                valeur: soinFT,
                timestamp: Date.now()
            });
        }

        // Cas spécial Résurrection : si l'objet ressuscite mais n'a pas de valeur PV définie
        if (estResurrection && !soinPV) {
            db.ref('parties/' + sessionActuelle + '/joueurs/' + cibleID + '/modif_stat').set({
                stat: 'PV',
                valeur: 10, // Réanimation minimum par défaut
                timestamp: Date.now()
            });
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