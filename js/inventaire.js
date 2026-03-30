
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



function trierInventaire(critere) {
    if (!perso.inventaire || perso.inventaire.length === 0) return;

    // Calcul du bonus de marchandage pour le tri par prix
    let ptsMarchandage = (perso.compInvesties && perso.compInvesties['marchandage']) ? perso.compInvesties['marchandage'] : 0;
    let reductionClient = ptsMarchandage * 0.02;

    perso.inventaire.sort((a, b) => {
        let dataA = itemsData[a.id];
        let dataB = itemsData[b.id];
        
        if (!dataA || !dataB) return 0;

if (critere === 'poids') {
            // --- CALCUL DU POIDS TOTAL POUR LE TRI ---
            // On multiplie le poids unitaire par la quantité de la pile
            let qteA = a.quantite || a.qte || 1;
            let qteB = b.quantite || b.qte || 1;
            
            let poidsTotalA = dataA.poids * qteA;
            let poidsTotalB = dataB.poids * qteB;

            // Tri du plus lourd au plus léger
            return poidsTotalB - poidsTotalA;
        }

if (critere === 'prix') {
            let qteA = a.quantite || a.qte || 1;
            let qteB = b.quantite || b.qte || 1;
            
            let valeurTotaleA = dataA.prix * qteA;
            let valeurTotaleB = dataB.prix * qteB;

            // Du plus cher au moins cher
            return valeurTotaleB - valeurTotaleA;
        }

        if (critere === 'nom') {
            return dataA.nom.localeCompare(dataB.nom);
        }
        
        return 0;
    });

    // On rafraîchit l'affichage après avoir trié la liste
    updateInventaireUI();
}

function updateInventaireUI() {
    let listInv = document.getElementById('inv-list-full');
    let listEq = document.getElementById('equipement-list');
    if (!listInv || !listEq) return 0;

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

    // --- 1. DESSINER LE SAC À DOS ---
    
    // Ajout des boutons de tri en haut de la liste
    let htmlInv = `
        <div style="display: flex; gap: 10px; margin-bottom: 15px; background: #1a110b; padding: 10px; border-radius: 4px; border: 1px solid #444;">
            <span style="color: #888; font-size: 0.9em; align-self: center;">Trier par :</span>
            <button onclick="trierInventaire('poids')" style="background: #333; color: white; border: 1px solid #555; padding: 5px 10px; cursor: pointer; border-radius: 3px; font-size: 0.8em; flex: 1;">⚖️ Plus Lourd</button>
            <button onclick="trierInventaire('prix')" style="background: #333; color: white; border: 1px solid #555; padding: 5px 10px; cursor: pointer; border-radius: 3px; font-size: 0.8em; flex: 1;">💰 Plus Cher</button>
        </div>
    `;

    if (!perso.inventaire || perso.inventaire.length === 0) {
        htmlInv = "<div style='color:#666; font-style:italic; text-align: center; margin-top: 20px;'>Le sac est vide.</div>";
    } else {
        perso.inventaire.forEach((item, index) => {
            let data = itemsData[item.id];
            if (data) {
                poidsTotal += data.poids * item.quantite;
                
                // Calcul du prix de vente affiché
                let prixVente = Math.floor(data.prix * (0.7 + reductionClient));
                prixVente = Math.min(prixVente, data.prix); // Capé au prix max
                
                let btnEquiper = (data.equipable && data.equipable !== "aucun") 
                    ? `<button onclick="equiperItem(${index})" style="background:#2196f3; color:#fff; border:none; padding:5px 10px; cursor:pointer; border-radius:3px;">Équiper</button>` : ``;

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
                            ${btnEquiper}
                            <button onclick="jeterItem(${index})" style="background:#8b0000; color:#fff; border:none; padding:5px 10px; cursor:pointer; border-radius:3px;">Jeter</button>
                        </div>
                    </div>`;
            }
        });
    }
    
    listInv.innerHTML = htmlInv;

    // --- 2. DESSINER L'ÉQUIPEMENT ---
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
    
    // MAJ de la charge dans l'inventaire
    let statFO = (perso.statsBase.FO || 8) + (perso.statsInvesties.FO || 0);
    let elPoidsInv = document.getElementById('inv-poids-total');
    if (elPoidsInv) {
        elPoidsInv.innerText = poidsTotal.toFixed(1) + " / " + (statFO * 2) + " kg";
        elPoidsInv.style.color = (poidsTotal > (statFO * 2)) ? "#f44336" : "#4caf50"; 
    }
    return poidsTotal;
}
