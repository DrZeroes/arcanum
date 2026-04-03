// --- FONCTION MJ : OUVRIR LE CODEX ---

// Fonction pour filtrer la recherche
function filtrerCodexMJ() {
    let input = document.getElementById('recherche-codex-mj').value.toLowerCase();
    let lignes = document.querySelectorAll('#tbody-codex-mj tr');
    lignes.forEach(l => l.style.display = l.innerText.toLowerCase().includes(input) ? "" : "none");
}

// Petite fonction pour donner un objet sans avoir à taper l'ID (depuis la liste)
// Variable globale pour stocker la quantité choisie par le MJ

function mjDonnerObjetDirect(itemID) {
    const data = itemsData[itemID];
    if (!data) return;

    objetEnCoursDeDon = itemID;
    quantiteEnCoursDeDonMJ = 1; // Valeur par défaut

    // Si l'objet est stackable, on demande combien en donner
    if (data.stackable) {
        let rep = prompt(`Combien de "${data.nom}" voulez-vous donner ?`, "1");
        if (rep === null) return; // Annulation
        
        let qte = parseInt(rep);
        if (isNaN(qte) || qte <= 0) {
            alert("Quantité invalide.");
            return;
        }
        quantiteEnCoursDeDonMJ = qte;
    }

    // On ouvre la modale pour choisir le destinataire
    db.ref('parties/' + sessionActuelle + '/joueurs').once('value', (snapshot) => {
        const joueurs = snapshot.val();
        const liste = document.getElementById('liste-destinataires');
        const titre = document.querySelector('#modal-transfert h3');
        
        if (titre) titre.innerText = `Donner ${quantiteEnCoursDeDonMJ}x ${data.nom} à :`;
        liste.innerHTML = "";

        if (!joueurs) {
            liste.innerHTML = "<p style='color:#aaa;'>Aucun joueur connecté.</p>";
        } else {
            for (let id in joueurs) {
                liste.innerHTML += `
                    <button onclick="executerDonObjetMJ('${id}')" 
                            style="background:#4caf50; color:white; padding:10px; border:none; border-radius:5px; cursor:pointer; margin-bottom:5px; width:100%;">
                        ${joueurs[id].nom}
                    </button>`;
            }
        }
        document.getElementById('modal-transfert').style.display = 'block';
    });
}




// Fonction Musique intégrée (inspirée de ton codex.js)





function genererMusiquesMJ_Integrated() {
    const tbody = document.getElementById('tbody-codex-mj');
    tbody.innerHTML = ""; 

    // 1. BOUTON STOP EN HAUT
    let trStop = document.createElement('tr');
    trStop.innerHTML = `
        <td colspan="2" style="padding:15px; text-align:center; border-bottom: 2px solid #8b0000;">
            <button onclick="mjArreterMusique()" 
                    style="background:#8b0000; color:white; border:none; padding:12px; cursor:pointer; font-weight:bold; border-radius:5px; width:100%;">
                ⏹ ARRÊTER LA MUSIQUE MJ (Tout le groupe)
            </button>
        </td>`;
    tbody.appendChild(trStop);

    // 2. LA LISTE
    playlistMJ.forEach(piste => {
        tbody.innerHTML += `
            <tr style="border-bottom: 1px solid #333;">
                <td style="padding: 10px; color: #fff;">🎵 ${piste.nom}</td>
                <td style="padding: 10px; text-align: right;">
                    <button onclick="mjChangerMusique('${piste.fichier}')" 
                            style="padding: 5px 12px; cursor: pointer; background: #4caf50; color: white; border: none; border-radius: 3px;">
                        ▶ Lancer
                    </button>
                </td>
            </tr>`;
    });
}

// Fonction pour envoyer l'ordre d'arrêt
function mjArreterMusique() {
    db.ref('parties/' + sessionActuelle + '/musique_mj').remove();
}

function genererContenuCodexMJ(type) {
    const tbody = document.getElementById('tbody-codex-mj');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (type === 'items') {
        for (let id in itemsData) {
            ajouterLigneCodexMJ(id, itemsData[id].nom, `mjDonnerObjetDirect('${id}')`, "🎁 Donner");
        }
    } 
    else if (type === 'marchands') {
        for (let id in marchandsData) {
            ajouterLigneCodexMJ(id, marchandsData[id].nom, `forcerOuvertureMarchand('${id}')`, "💰 Ouvrir");
        }
    } 
    else if (type === 'coffres') {
        for (let id in coffresFixes) {
            ajouterLigneCodexMJ(id, coffresFixes[id].nom, `forcerOuvertureCoffre('${id}')`, "🔍 Fouiller");
        }
    }
    else if (type === 'lieux') {
        for (let id in lieuxDecouverts) {
            let l = lieuxDecouverts[id];
            ajouterLigneCodexMJ(id, l.nom, `mjDecouvrirLieu('${id}')`, "📍 Révéler");
        }
    }
}

function mjChargerEnnemi(idEnnemi) {
    const ennemi = (typeof ennemisData !== 'undefined') ? ennemisData[idEnnemi] : null;
    if (!ennemi) return;

    const choix = confirm(`Charger "${ennemi.nom}" comme personnage actif ?\n\nOK = remplace ton perso\nAnnuler = affiche les stats`);

    if (choix) {
        window.perso = JSON.parse(JSON.stringify(ennemi));
        localStorage.setItem('arcanum_sauvegarde', JSON.stringify(window.perso));
        if (typeof demarrerMoteurMulti === 'function') demarrerMoteurMulti();
        alert(`⚔️ ${ennemi.nom} chargé.`);
        if (typeof allerAccueil === 'function') allerAccueil();
    } else {
        const stats = ennemi.statsBase;
        const fo = stats.FO, ini = stats.IN, cn = stats.CN;
        const pvMax = (fo * 2) + ini;
        const ftMax = (cn * 2) + ini;

        const lootStr = (ennemi.lootDrop || []).map(l => {
            const item = (typeof itemsData !== 'undefined') ? itemsData[l.id] : null;
            return `${item ? item.nom : l.id} x${l.qte}`;
        }).join(', ');

        const compStr = Object.entries(ennemi.compInvesties).map(([k, v]) => `${k}:${v}`).join(', ');

        alert(`⚔️ ${ennemi.nom} (${ennemi.race}, Niv.${ennemi.niveau})\n\n` +
              `FO:${fo}  IN:${ini}  CN:${cn}  DX:${stats.DX}  CH:${stats.CH}\n` +
              `PV:${pvMax}  FT:${ftMax}  XP:${ennemi.xp}  Or:${ennemi.argent}\n\n` +
              `Compétences: ${compStr}\n\n` +
              `Butin: ${lootStr || 'Rien'}\n\n` +
              `${ennemi.antecedent}`);
    }
}

function genererEnnemisCodexMJ() {
    const tbody = document.getElementById('tbody-codex-mj');
    if (!tbody || typeof ennemisData === 'undefined') return;
    tbody.innerHTML = '';

    const zones = {
        crash: '🌲 Zone 1 — Crash & Wilderness',
        tris:  '⛏ Zone 2 — Triste Colline & Mine',
        tarante: '🗡 Zone 3/4 — Route & Main de Moloch'
    };
    const dejaMisZone = new Set();

    for (let id in ennemisData) {
        const e = ennemisData[id];
        const fo = e.statsBase.FO, ini = e.statsBase.IN, cn = e.statsBase.CN;
        const pvMax = (fo * 2) + ini;
        const ftMax = (cn * 2) + ini;

        // Séparateur de zone (affiché une seule fois par zone principale)
        const zoneKey = e.zones[0];
        if (!dejaMisZone.has(zoneKey) && zones[zoneKey]) {
            dejaMisZone.add(zoneKey);
            tbody.innerHTML += `
                <tr><td colspan="3" style="padding:10px 10px 4px; color:#8b6914; font-size:0.75em; font-variant:small-caps; letter-spacing:2px; border-top:1px solid #2a1d12;">
                    ${zones[zoneKey]}
                </td></tr>`;
        }

        const lootStr = (e.lootDrop || []).map(l => {
            const item = (typeof itemsData !== 'undefined') ? itemsData[l.id] : null;
            return item ? item.nom : l.id;
        }).join(', ');

        tbody.innerHTML += `
            <tr style="border-bottom:1px solid #1a110b;">
                <td style="padding:8px 10px;">
                    <span style="color:#e57373; font-weight:bold; font-size:0.9em;">${e.nom}</span>
                    <div style="color:#555; font-size:0.72em; margin-top:2px;">${e.race} — Niv.${e.niveau} — XP: ${e.xp}</div>
                </td>
                <td style="padding:8px 10px; font-size:0.78em;">
                    <span style="color:#e57373;">❤ ${pvMax}</span> &nbsp;
                    <span style="color:#64b5f6;">⚡ ${ftMax}</span><br>
                    <span style="color:#666;">FO:${fo} DX:${e.statsBase.DX} IN:${ini}</span><br>
                    <span style="color:#4a3a18; font-size:0.9em;">💰 ${lootStr}</span>
                </td>
                <td style="padding:8px 10px; text-align:right;">
                    <button onclick="mjChargerEnnemi('${id}')" style="background:#2a0a0a; color:#e57373; border:1px solid #8b0000; padding:5px 10px; cursor:pointer; border-radius:3px; font-size:0.8em;">
                        ⚔ Stats
                    </button>
                </td>
            </tr>`;
    }
}

function genererNPCsMJ() {
    const tbody = document.getElementById('tbody-codex-mj');
    if (!tbody || typeof personnagesNPC === 'undefined') return;
    tbody.innerHTML = '';

    for (let id in personnagesNPC) {
        const npc = personnagesNPC[id];
        const stats = npc.statsBase;
        const inv = npc.statsInvesties;
        const fo = stats.FO + inv.FO;
        const ini = stats.IN + inv.IN;
        const cn = stats.CN + inv.CN;
        const pvMax = (fo * 2) + ini + (npc.boostPV || 0);
        const ftMax = (cn * 2) + ini + (npc.boostFT || 0);

        tbody.innerHTML += `
            <tr style="border-bottom: 1px solid #2a1d12;">
                <td style="padding:10px; color:#d4af37; font-variant:small-caps; font-size:0.95em;">
                    ${npc.nom}
                    <div style="color:#666; font-size:0.75em; font-variant:normal; margin-top:2px;">${npc.race} — Niv.${npc.niveau}</div>
                </td>
                <td style="padding:10px; font-size:0.8em; color:#888;">
                    <span style="color:#e57373;">❤ ${pvMax}</span> &nbsp;
                    <span style="color:#64b5f6;">⚡ ${ftMax}</span><br>
                    <span style="color:#aaa;">FO:${fo} IN:${ini} CN:${cn} DX:${stats.DX+inv.DX} CH:${stats.CH+inv.CH}</span>
                </td>
                <td style="padding:10px; text-align:right;">
                    <button onclick="mjChargerNPC('${id}')" style="background:#1a2e1a; color:#4caf50; border:1px solid #4caf50; padding:5px 10px; cursor:pointer; border-radius:3px; font-size:0.8em;">
                        ▶ Charger
                    </button>
                </td>
            </tr>`;
    }
}

function rafraichirListeJoueursMJ() {
    const container = document.getElementById('mj-liste-joueurs');
    if (!container) return;

    console.log("👥 [LOG] Mise à jour de la liste des joueurs MJ...");

    db.ref('parties/' + sessionActuelle + '/joueurs').on('value', (snapshot) => {
        const joueurs = snapshot.val();
        container.innerHTML = "";

        if (!joueurs) return;

        for (let id in joueurs) {
            const j = joueurs[id];
            const estMort = (j.pvActuel <= 0);

            // Section compagnons du joueur
            const comps = j.compagnons_summary || [];
            const compsHtml = comps.length
                ? comps.map(c => `
                    <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(50,35,10,0.6); border:1px solid #5a4010; padding:4px 6px; border-radius:3px; margin-top:3px;">
                        <span style="color:#d4af37; font-size:11px;">🤝 ${c.nom} <span style="color:#888;">Niv.${c.niveau}</span></span>
                        <span style="display:flex; gap:4px;">
                            <button onclick="mjLevelUpCompagnon('${id}', ${c.idx}, '${c.nom.replace(/'/g, "\\'")}')" style="background:#1a3a1a; color:#4caf50; border:1px solid #4caf50; padding:2px 5px; cursor:pointer; font-size:10px; border-radius:2px;">🌟 LvUp</button>
                            <button onclick="mjRenvoyerCompagnon('${id}', ${c.idx}, '${c.nom.replace(/'/g, "\\'")}')" style="background:#3a1010; color:#ff6b6b; border:1px solid #8b0000; padding:2px 5px; cursor:pointer; font-size:10px; border-radius:2px;">✕ Renvoi</button>
                        </span>
                    </div>`).join('')
                : `<div style="color:#555; font-size:10px; margin-top:3px;">Aucun compagnon</div>`;

            container.innerHTML += `
                <div class="mj-player-card" style="background:rgba(0,0,0,0.4); border:1px solid #444; padding:10px; margin:5px; border-radius:5px;">
                    <div style="display:flex; justify-content:space-between;">
                        <strong style="color:#ff9800;">${j.nom}</strong>
                        <span style="font-size:10px; color:#aaa;">Niv.${j.niveau || 1}</span>
                    </div>

                    <div style="margin: 5px 0; font-size: 13px;">
                        <span style="color:${estMort ? 'red' : '#4caf50'}">❤️ PV: ${j.pvActuel}/${j.pvMax}</span> |
                        <span style="color:#2196f3">🔋 FT: ${j.ftActuel}/${j.ftMax || '??'}</span>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px; margin-top:5px;">
                        <button onclick="mjModifierStat('${id}', 'PV')" style="background:#2e7d32; color:white; border:none; padding:4px; cursor:pointer; font-size:11px;">+/- ❤️ PV</button>
                        <button onclick="mjModifierStat('${id}', 'FT')" style="background:#1565c0; color:white; border:none; padding:4px; cursor:pointer; font-size:11px;">+/- 🔋 FT</button>
                        <button onclick="mjDonnerLevelUp('${j.nom}')" style="grid-column: span 2; background:#ff9800; color:black; border:none; padding:4px; cursor:pointer; font-size:11px; font-weight:bold;">🌟 LEVEL UP joueur</button>
                        <button onclick="mjDonnerCompagnon('${id}', '${j.nom}')" style="grid-column: span 2; background:#1a2e1a; color:#4caf50; border:1px solid #4caf50; padding:4px; cursor:pointer; font-size:11px;">🤝 Donner Compagnon</button>
                        <button onclick="mjKickJoueur('${id}', '${j.nom}')" style="grid-column: span 2; background:#5a0000; color:#ff6b6b; border:1px solid #8b0000; padding:4px; cursor:pointer; font-size:11px;">🚫 Expulser de la session</button>
                    </div>

                    <div style="margin-top:6px; border-top:1px solid #333; padding-top:5px;">
                        <div style="color:#777; font-size:10px; text-transform:uppercase; margin-bottom:2px;">Compagnons</div>
                        ${compsHtml}
                    </div>
                </div>
            `;
        }
    });
}


function mjChargerNPC(idNPC) {
    const npc = (typeof personnagesNPC !== 'undefined') ? personnagesNPC[idNPC] : null;
    if (!npc) return;

    const choix = confirm(`Charger "${npc.nom}" comme personnage actif ?\n\nOK = remplace ton perso actuel\nAnnuler = affiche juste la fiche`);

    if (choix) {
        window.perso = JSON.parse(JSON.stringify(npc)); // deep copy
        localStorage.setItem('arcanum_sauvegarde', JSON.stringify(window.perso));
        if (typeof demarrerMoteurMulti === 'function') demarrerMoteurMulti();
        alert(`✅ ${npc.nom} chargé comme personnage actif.`);
        if (typeof allerAccueil === 'function') allerAccueil();
    } else {
        // Affiche un résumé lisible dans la console MJ
        const stats = npc.statsBase;
        const inv = npc.statsInvesties;
        const fo = stats.FO + inv.FO, i = stats.IN + inv.IN;
        const cn = stats.CN + inv.CN;
        const pvMax = (fo * 2) + i + (npc.boostPV || 0);
        const ftMax = (cn * 2) + i + (npc.boostFT || 0);

        const equipStr = Object.entries(npc.equipement)
            .filter(([, v]) => v !== null)
            .map(([slot, v]) => {
                const item = (typeof itemsData !== 'undefined') ? itemsData[v.id] : null;
                return `${slot}: ${item ? item.nom : v.id}`;
            }).join('\n');

        const compStr = Object.entries(npc.compInvesties)
            .map(([k, v]) => `${k}: ${v}`).join(', ');

        alert(`📋 ${npc.nom} (${npc.race}, Niv.${npc.niveau})\n\n` +
              `FO:${fo} IN:${i} CN:${cn} DX:${stats.DX + inv.DX} CH:${stats.CH + inv.CH}\n` +
              `PV:${pvMax}  FT:${ftMax}  Or:${npc.argent}\n\n` +
              `Équipement:\n${equipStr}\n\n` +
              `Compétences: ${compStr}`);
    }
}

function mjKickJoueur(playerID, nomJoueur) {
    if (!confirm(`Expulser ${nomJoueur} de la session ?`)) return;

    // 1. On écrit le flag kick — le joueur l'écoute et se déconnecte proprement
    db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/kick').set(true)
      .then(() => {
          // 2. Après 2s (le temps que le joueur reçoive le signal), on supprime son nœud
          setTimeout(() => {
              db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID).remove();
          }, 2000);
      });
}

// ── GESTION DES COMPAGNONS (MJ) ────────────────────────────────────────────

/**
 * Le MJ assigne un PNJ de personnagesNPC comme compagnon à un joueur.
 * Vérifie côté joueur si le max CH est atteint.
 */
function mjDonnerCompagnon(playerID, playerNom) {
    if (typeof personnagesNPC === 'undefined') return;
    const liste = Object.entries(personnagesNPC)
        .map(([id, npc]) => `${id}  →  ${npc.nom} (Niv.${npc.niveau}, ${npc.race})`)
        .join('\n');
    const choixId = prompt(`Compagnon à attribuer à ${playerNom} :\n\n${liste}\n\nID :`);
    if (!choixId) return;
    if (!personnagesNPC[choixId]) { alert('ID introuvable.'); return; }

    db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/compagnon_action').set({
        type: 'don',
        npcId: choixId.trim(),
        timestamp: Date.now()
    });
}

/**
 * Le MJ donne un level up à un compagnon précis d'un joueur.
 * Demande quelle stat augmenter.
 */
function mjLevelUpCompagnon(playerID, compIdx, compNom) {
    const stat = prompt(`Level Up de ${compNom}\nStat à augmenter ? (FO / IN / CN / DX / CH)`);
    if (!stat) return;
    const statUp = stat.toUpperCase().trim();
    if (!['FO', 'IN', 'CN', 'DX', 'CH'].includes(statUp)) {
        alert('Stat invalide. Entrez FO, IN, CN, DX ou CH.');
        return;
    }
    db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/compagnon_action').set({
        type: 'levelup',
        compIdx: compIdx,
        stat: statUp,
        timestamp: Date.now()
    });
}

/**
 * Le MJ renvoie un compagnon : il est retiré du groupe du joueur.
 */
function mjRenvoyerCompagnon(playerID, compIdx, compNom) {
    if (!confirm(`Renvoyer ${compNom} du groupe ?`)) return;
    db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/compagnon_action').set({
        type: 'renvoi',
        compIdx: compIdx,
        timestamp: Date.now()
    });
}

function mjLootAleatoire(idJoueur) {
    // On filtre les objets "communs" (rareté < 5)
    const itemsDispo = Object.values(itemsData).filter(i => (i.rarete || 0) < 5);
    const nbItems = Math.floor(Math.random() * 4) + 1; // 1d4
    
    for(let i=0; i < nbItems; i++) {
        const randomItem = itemsDispo[Math.floor(Math.random() * itemsDispo.length)];
        
        // On l'envoie directement dans les cadeaux du joueur
        db.ref('parties/' + sessionActuelle + '/cadeaux/' + idJoueur).push({
            from: "Le Destin (MJ)",
            item: { id: randomItem.id, quantite: 1, durabilite: 100, durabiliteMax: 100 },
            timestamp: Date.now()
        });
    }
    alert(`🎲 ${nbItems} objets envoyés à l'aventurier !`);
}



// Utilitaire pour créer les lignes avec un style uniforme
function ajouterLigneCodexMJ(id, nom, actionFn, texteAction) {
    const tbody = document.getElementById('tbody-codex-mj');
    tbody.innerHTML += `
        <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 10px; color: #ffb74d; font-family: monospace; font-size: 0.8em; width: 80px;">${id}</td>
            <td style="padding: 10px; color: #fff;">${nom}</td>
            <td style="padding: 10px; text-align:right;">
                <button onclick="${actionFn}" style="background: #444; color: #ff9800; border: 1px solid #ff9800; padding: 5px 10px; cursor: pointer; border-radius: 3px; font-size: 0.8em;">
                    ${texteAction}
                </button>
            </td>
        </tr>`;
}




