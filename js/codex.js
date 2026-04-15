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
            if (typeof _toast === 'function') _toast("Quantité invalide.", 'error'); else return;
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
                liste.innerHTML += `<button onclick="executerDonObjetMJ('${id}')" style="background:#4caf50; color:white; padding:10px; border:none; border-radius:5px; cursor:pointer; margin-bottom:5px; width:100%;">${joueurs[id].nom}</button>`;
            }
        }

        // Compagnons de tous les joueurs
        db.ref('parties/' + sessionActuelle + '/compagnons').once('value', snapComps => {
            const tousComps = snapComps.val() || {};
            let hasComps = false;
            for (let ownerID in tousComps) {
                const arr = tousComps[ownerID];
                const list = Array.isArray(arr) ? arr : Object.values(arr);
                list.forEach(c => {
                    if (!hasComps) {
                        liste.innerHTML += `<hr style="border:0;border-top:1px solid #444;margin:8px 0;"><div style="color:#888;font-size:0.8em;margin-bottom:4px;">Compagnons</div>`;
                        hasComps = true;
                    }
                    const nomSafe = c.nom.replace(/'/g, "\\'");
                    liste.innerHTML += `<button onclick="executerDonObjetMJ('comp_${ownerID}_${c.idx}')" style="background:#2e1f4d; color:#b39ddb; padding:10px; border:1px solid #7c4dff; border-radius:5px; cursor:pointer; margin-bottom:5px; width:100%;">🤝 ${c.nom} <span style="color:#888;font-size:0.8em;">(${joueurs?.[ownerID]?.nom || ownerID})</span></button>`;
                });
            }
            document.getElementById('modal-transfert').style.display = 'block';
        });
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
                        📋 Stats
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

        if (!joueurs) { container.innerHTML = ""; return; }

        db.ref('parties/' + sessionActuelle + '/compagnons').once('value', snapComps => {
            const tousCompagnons = snapComps.val() || {};
            // Vider le container ICI (dans once) pour éviter les doublons si le on() se re-déclenche
            container.innerHTML = "";

        for (let id in joueurs) {
            const j = joueurs[id];
            if (j.estMJ) continue;
            const estMort = (j.pvActuel <= 0);

            // Section compagnons du joueur (depuis le nœud dédié)
            const compsRaw = tousCompagnons[id];
            const comps = compsRaw ? (Array.isArray(compsRaw) ? compsRaw : Object.values(compsRaw)) : [];
            const compsHtml = comps.length
                ? comps.map(c => {
                    const key = id + '-' + c.idx;
                    const nomSafe = c.nom.replace(/'/g, "\\'");
                    // Inventaire du compagnon
                    const invItems = c.inventaire || [];
                    const invHtml = invItems.length
                        ? invItems.map(it => {
                            const def = (typeof itemsData !== 'undefined') ? itemsData[it.id] : null;
                            return def ? `<span style="color:#ccc; font-size:10px; background:rgba(0,0,0,0.3); border-radius:2px; padding:1px 4px;">${def.nom} ×${it.quantite || 1}</span>` : '';
                        }).filter(Boolean).join(' ')
                        : '<span style="color:#555; font-size:10px;">Aucun objet</span>';
                    return `
                    <div data-comp-key="${key}" style="background:rgba(50,35,10,0.6); border:1px solid #5a4010; padding:4px 6px; border-radius:3px; margin-top:3px;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="color:#d4af37; font-size:11px;">🤝 ${c.nom} <span style="color:#888;">Niv.${c.niveau}</span></span>
                            <span style="display:flex; gap:3px;">
                                <button onclick="mjLevelUpCompagnon('${id}', ${c.idx}, '${nomSafe}')" style="background:#1a3a1a; color:#4caf50; border:1px solid #4caf50; padding:2px 5px; cursor:pointer; font-size:10px; border-radius:2px;">🌟 LvUp</button>
                                <button onclick="mjAjouterItemCompagnon('${id}', ${c.idx})" style="background:#1a1a3a; color:#9575cd; border:1px solid #7c4dff; padding:2px 5px; cursor:pointer; font-size:10px; border-radius:2px;">🎒 Item</button>
                                <button onclick="mjRenvoyerCompagnon('${id}', ${c.idx}, '${nomSafe}')" style="background:#3a1010; color:#ff6b6b; border:1px solid #8b0000; padding:2px 5px; cursor:pointer; font-size:10px; border-radius:2px;">✕</button>
                            </span>
                        </div>
                        <div style="margin-top:3px; display:flex; flex-wrap:wrap; gap:3px;">🎒 ${invHtml}</div>
                    </div>`;
                }).join('')
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
                        <button onclick="mjAutoriserVolATire('${id}', '${j.nom}')" style="grid-column: span 2; background:#1a1030; color:#b39ddb; border:1px solid #7c4dff; padding:4px; cursor:pointer; font-size:11px;">🤏 Autoriser Vol à la tire</button>
                        <button onclick="mjGererEffets('${id}', '${j.nom}')" style="grid-column: span 2; background:#1a1008; color:#ffd700; border:1px solid #7a6000; padding:4px; cursor:pointer; font-size:11px;">✨ Bénédictions / Malédictions</button>
                    </div>

                    <div style="margin-top:6px; border-top:1px solid #333; padding-top:5px;">
                        <div style="color:#777; font-size:10px; text-transform:uppercase; margin-bottom:2px;">Compagnons</div>
                        ${compsHtml}
                    </div>
                </div>
            `;
        }
        }); // fin once compagnons
    });
}


function mjChargerNPC(idNPC) {
    const npc = (typeof personnagesNPC !== 'undefined') ? personnagesNPC[idNPC] : null;
    if (!npc) return;

    const stats = npc.statsBase;
    const inv   = npc.statsInvesties;
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
    if (!personnagesNPC[choixId]) { if (typeof _toast === 'function') _toast('ID introuvable.', 'error'); return; }

    db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/compagnon_action').set({
        type: 'don',
        npcId: choixId.trim(),
        timestamp: Date.now()
    });
}

/**
 * Panel de level-up compagnon (MJ) — stats, compétences, tech, magie.
 */
function mjLevelUpCompagnon(playerID, compIdx, compNom) {
    const containerId = 'lvup-panel-' + playerID + '-' + compIdx;
    const existing = document.getElementById(containerId);
    if (existing) { existing.remove(); return; }

    const parent = document.querySelector(`[data-comp-key="${playerID}-${compIdx}"]`);
    if (!parent) return;

    const _envoyer = (payload) => {
        payload.type = 'levelup';
        payload.compIdx = compIdx;
        payload.timestamp = Date.now();
        db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/compagnon_action').set(payload);
        document.getElementById(containerId)?.remove();
        if (typeof _toast === 'function') _toast('🌟 Level-up envoyé à ' + compNom + ' !', 'gold');
    };

    // --- Stats ---
    let html = '<div class="lvup-titre">🌟 ' + compNom + ' — Améliorer :</div>';
    html += '<div class="lvup-section-titre">📊 Stats</div>';
    html += ['FO','IN','CN','DX','CH'].map(s =>
        `<button class="comp-levelup-btn" data-action='${JSON.stringify({stat:s})}'>+1 ${s}</button>`
    ).join('');

    // --- Compétences ---
    html += '<div class="lvup-section-titre">⚔ Compétences</div>';
    if (typeof competencesData !== 'undefined') {
        for (let cat in competencesData) {
            competencesData[cat].forEach(c => {
                html += `<button class="comp-levelup-btn" data-action='${JSON.stringify({stat:'comp', competence:c.id})}'>${c.nom}</button>`;
            });
        }
    }

    // --- Technologie ---
    html += '<div class="lvup-section-titre">⚙ Technologie</div>';
    if (typeof techData !== 'undefined') {
        Object.keys(techData).forEach(d => {
            html += `<button class="comp-levelup-btn" data-action='${JSON.stringify({stat:'tech', discipline:d})}'>${d}</button>`;
        });
    }

    // --- Magie ---
    html += '<div class="lvup-section-titre">✨ Magie</div>';
    if (typeof magieData !== 'undefined') {
        Object.keys(magieData).forEach(e => {
            html += `<button class="comp-levelup-btn" data-action='${JSON.stringify({stat:'magie', ecole:e})}'>${e}</button>`;
        });
    }

    const panel = document.createElement('div');
    panel.id = containerId;
    panel.className = 'comp-levelup-panel';
    panel.innerHTML = html;

    // Délégation d'événement unique
    panel.addEventListener('click', e => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        _envoyer(JSON.parse(btn.dataset.action));
    });

    parent.after(panel);
}

/**
 * Le MJ renvoie un compagnon.
 */
function mjRenvoyerCompagnon(playerID, compIdx, compNom) {
    db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/compagnon_action').set({
        type: 'renvoi', compIdx: compIdx, timestamp: Date.now()
    });
    if (typeof _toast === 'function') _toast(compNom + ' renvoyé.', '');
}

/**
 * Le MJ ajoute un item à l'inventaire d'un compagnon.
 */
function mjAjouterItemCompagnon(playerID, compIdx) {
    if (typeof itemsData === 'undefined') return;
    const liste = Object.entries(itemsData)
        .filter(([,v]) => v.lootable !== false)
        .map(([id,v]) => id + ' — ' + v.nom).join('\n');
    const choix = prompt('Ajouter un item à ce compagnon :\n\n' + liste + '\n\nID :');
    if (!choix) return;
    const id = choix.trim().toUpperCase();
    if (!itemsData[id]) { if (typeof _toast === 'function') _toast('ID inconnu.', 'error'); return; }
    const qte = parseInt(prompt('Quantité ?') || '1') || 1;
    db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/compagnon_action').set({
        type: 'item_add', compIdx: compIdx, itemId: id, quantite: qte, timestamp: Date.now()
    });
    if (typeof _toast === 'function') _toast(itemsData[id].nom + ' ajouté.', 'success');
}

// ── GESTION DU COMBAT (MJ) ─────────────────────────────────────────────────

/** Quantités choisies par le MJ par ID d'ennemi. */
let _combatSelection = {};

/**
 * Génère l'interface de lancement de combat dans le panneau MJ.
 * Appelée quand on switche vers l'onglet 'combat'.
 */
function mjAfficherInterfaceCombat() {
    const section = document.getElementById('mj-section-combat');
    if (!section || typeof ennemisData === 'undefined') return;
    _combatSelection = {};

    // Contexte rencontre donjon (si vient d'une rencontre)
    const rencontreCtx = window._rencontreDonjonContexte || null;
    window._rencontreDonjonContexte = null;

    // Vérifie si un combat est déjà en cours
    db.ref('parties/' + sessionActuelle + '/combat_actif').once('value', (snap) => {
        const enCours = snap.val();

        if (enCours && enCours.actif) {
            const ordre      = enCours.ordre_jeu || [];
            const tourIdx    = (enCours.tour_actuel || 0) % (ordre.length || 1);
            const participant = ordre[tourIdx];
            const ordreHtml  = ordre.map((p, i) =>
                '<span style="color:' + (i === tourIdx ? '#ff6b6b' : '#555') + '; font-size:0.78em;">'
                + (i === tourIdx ? '▶ ' : '') + p.nom + ' ⚡' + p.vitesse + '</span>'
            ).join(' › ');

            const ennemisHtml = (enCours.ennemis || []).map(e =>
                (e.pvActuel <= 0 ? '☠ ' : '') + e.nom + ' — PV ' + e.pvActuel + '/' + e.pvMax
            ).join('<br>');

            section.innerHTML =
                '<div style="background:rgba(139,0,0,0.2); border:1px solid #8b0000; border-radius:6px; padding:16px; margin-bottom:12px;">'
                + '<div style="color:#ff6b6b; font-size:1.05em; font-weight:bold; margin-bottom:10px;">⚔ COMBAT EN COURS</div>'
                + '<div style="margin-bottom:10px; line-height:1.8;">' + ordreHtml + '</div>'
                + '<div style="color:#aaa; font-size:0.8em; margin-bottom:12px; border-top:1px solid #333; padding-top:8px;">' + ennemisHtml + '</div>'
                + '<div style="color:#888; font-size:0.8em; margin-bottom:12px;">Tour : <strong style="color:#d4af37;">'
                + (participant ? participant.nom : '?') + '</strong>'
                + (participant && participant.type === 'ennemi' ? ' (ennemi — vous jouez)' : '') + '</div>'
                + '<div style="display:flex; gap:8px;">'
                + '<button onclick="mjTourSuivant()" style="flex:1; background:#1a3a1a; color:#4caf50; border:1px solid #4caf50; padding:8px; cursor:pointer; border-radius:4px; font-weight:bold;">▶ Tour suivant</button>'
                + '<button onclick="ouvrirEcranCombat()" style="flex:1; background:#1a1a3a; color:#9575cd; border:1px solid #7c4dff; padding:8px; cursor:pointer; border-radius:4px;">👁 Voir combat</button>'
                + '<button onclick="mjTerminerCombat()" style="flex:1; background:#3a0000; color:#ff6b6b; border:1px solid #8b0000; padding:8px; cursor:pointer; border-radius:4px; font-weight:bold;">🛑 Terminer</button>'
                + '</div></div>';
            return;
        }

        // Groupe les ennemis par zone
        const parZone = {};
        for (let id in ennemisData) {
            const e = ennemisData[id];
            (e.zones || ['?']).forEach(z => {
                if (!parZone[z]) parZone[z] = [];
                // Déduplique (un ennemi peut apparaître dans plusieurs zones)
                if (!parZone[z].find(x => x.id === id)) parZone[z].push({ id, ...e });
            });
        }

        let lignes = '';
        for (let zone in parZone) {
            const nomZone = (typeof lieuxDecouverts !== 'undefined' && lieuxDecouverts[zone])
                ? lieuxDecouverts[zone].nom : zone;
            lignes += `<tr><td colspan="3" style="padding:6px 8px; background:#1a0d05; color:#d4af37; font-size:0.75em; text-transform:uppercase; letter-spacing:0.1em;">${nomZone}</td></tr>`;
            parZone[zone].forEach(e => {
                const fo = e.statsBase.FO + (e.statsInvesties?.FO || 0);
                const ini = e.statsBase.IN + (e.statsInvesties?.IN || 0);
                const pvMax = (fo * 2) + ini + (e.boostPV || 0);
                lignes += `
                    <tr style="border-bottom:1px solid #2a1d12;">
                        <td style="padding:6px 10px; color:#ddd; font-size:0.85em;">${e.nom}
                            <span style="color:#666; font-size:0.75em;"> Niv.${e.niveau} ❤${pvMax}</span>
                        </td>
                        <td style="padding:6px 8px; text-align:center;">
                            <input type="number" id="qty-${e.id}" min="0" max="9" value="0"
                                style="width:45px; background:#111; color:#fff; border:1px solid #444; padding:3px; text-align:center; border-radius:3px;"
                                onchange="_combatSelection['${e.id}'] = parseInt(this.value)||0">
                        </td>
                        <td style="padding:6px 8px; color:#888; font-size:0.72em;">${e.race}</td>
                    </tr>`;
            });
        }

        const banniereRencontre = rencontreCtx
            ? `<div style="background:#2a1000;border:1px solid #ff6b6b;border-radius:6px;padding:8px 12px;margin-bottom:10px;color:#ff9966;font-size:0.88em;">👹 <strong>Rencontre :</strong> ${rencontreCtx}</div>`
            : '';

        section.innerHTML = `
            ${banniereRencontre}
            <div style="margin-bottom:12px; color:#ff6b6b; font-size:0.8em; text-align:center; text-transform:uppercase; letter-spacing:0.08em;">
                Définissez les quantités puis lancez le combat
            </div>
            <div style="max-height:55vh; overflow-y:auto; border:1px solid #333; border-radius:4px; margin-bottom:14px;">
                <table style="width:100%; border-collapse:collapse;">${lignes}</table>
            </div>
            <button onclick="mjLancerCombat()" style="width:100%; background:#8b0000; color:white; border:none; padding:12px; cursor:pointer; font-size:1em; font-weight:bold; border-radius:4px; letter-spacing:0.05em;">
                ⚔ LANCER LE COMBAT
            </button>`;
    });
}

/**
 * Écrit le combat dans Firebase.
 * Tous les joueurs connectés basculent automatiquement sur ecran-combat.
 */
function mjLancerCombat() {
    const ennemisChoisis = [];
    let instanceIdx = 0;

    for (let id in _combatSelection) {
        const qte = _combatSelection[id];
        if (!qte || qte <= 0) continue;

        const e = ennemisData[id];
        if (!e) continue;

        const fo  = e.statsBase.FO + (e.statsInvesties?.FO || 0);
        const ini = e.statsBase.IN + (e.statsInvesties?.IN || 0);
        const cn  = e.statsBase.CN + (e.statsInvesties?.CN || 0);
        const pvMax = (fo * 2) + ini + (e.boostPV || 0);
        const ftMax = (cn * 2) + ini + (e.boostFT || 0);

        for (let i = 0; i < qte; i++) {
            ennemisChoisis.push({
                instanceId: instanceIdx++,
                id,
                nom: qte > 1 ? `${e.nom} ${i + 1}` : e.nom,
                race: e.race,
                niveau: e.niveau,
                pvActuel: e.pvActuel || pvMax,
                pvMax,
                ftActuel: e.ftActuel || ftMax,
                ftMax,
                xp: e.xp || 0,
                elementDegats: e.elementDegats || null,
                equipement: e.equipement || null,
                statsBase: e.statsBase || null,
                statsInvesties: e.statsInvesties || null,
                compInvesties: e.compInvesties || null
            });
        }
    }

    if (ennemisChoisis.length === 0) {
        if (typeof _toast === 'function') _toast('Sélectionnez au moins un ennemi.', 'error');
        return;
    }

    // Récupère les joueurs + compagnons pour construire l'ordre de jeu
    db.ref('parties/' + sessionActuelle + '/joueurs').once('value', (snap) => {
        const joueurs = snap.val() || {};

        db.ref('parties/' + sessionActuelle + '/compagnons').once('value', (snapComps) => {
        const tousCompagnons = snapComps.val() || {};
        const participants = [];

        // Joueurs + leurs compagnons (le MJ est exclu)
        for (let id in joueurs) {
            const j = joueurs[id];
            if (j.estMJ) continue;
            participants.push({
                type: 'joueur',
                id,
                nom: j.nom,
                vitesse: j.vitesse || j.niveau || 1
            });
            // Compagnons depuis le nœud dédié
            const compsRaw = tousCompagnons[id];
            const comps = compsRaw ? (Array.isArray(compsRaw) ? compsRaw : Object.values(compsRaw)) : [];
            comps.forEach(c => {
                const cFO = (c.statsBase?.FO || 5) + (c.statsInvesties?.FO || 0);
                const cIN = (c.statsBase?.IN || 5) + (c.statsInvesties?.IN || 0);
                const cCN = (c.statsBase?.CN || 5) + (c.statsInvesties?.CN || 0);
                const cPvMax = (cFO * 2) + cIN + (c.boostPV || 0);
                const cFtMax = (cCN * 2) + cIN + (c.boostFT || 0);
                participants.push({
                    type: 'compagnon',
                    nom: c.nom,
                    niveau: c.niveau || 1,
                    ownerNom: j.nom,
                    ownerID: id,
                    compIdx: c.idx,
                    vitesse: Math.max(1, (c.niveau || 1) * 2),
                    pvActuel: c.pvActuel ?? cPvMax,
                    pvMax: cPvMax,
                    ftActuel: c.ftActuel ?? cFtMax,
                    ftMax: cFtMax,
                    xp: c.xp || 0,
                    statsBase: c.statsBase || null,
                    statsInvesties: c.statsInvesties || null,
                    magieInvesties: c.magieInvesties || null,
                    inventaire: c.inventaire || null
                });
            });
        }

        // Ennemis (vitesse = DX de leur fiche)
        ennemisChoisis.forEach(e => {
            const orig = ennemisData[e.id];
            const dx = orig ? (orig.statsBase.DX + (orig.statsInvesties?.DX || 0)) : 5;
            participants.push({
                type: 'ennemi',
                instanceId: e.instanceId,
                nom: e.nom,
                vitesse: dx
            });
        });

        // Tri décroissant par vitesse (à égalité, les joueurs passent avant)
        participants.sort((a, b) => b.vitesse - a.vitesse || (a.type === 'joueur' ? -1 : 1));

        // Calcul de la discrétion : 2% par point → griser le bouton au 1er tour de chaque ennemi
        const joueurs_discrets = {};
        for (let id in joueurs) {
            if (joueurs[id].estMJ) continue;
            const discPts = joueurs[id].discretion || 0;
            if (discPts > 0) {
                const chance = discPts * 2; // 2% par point
                joueurs_discrets[id] = Math.floor(Math.random() * 100) < chance;
            } else {
                joueurs_discrets[id] = false;
            }
        }
        window._ennemisOntAttaque = new Set(); // reset pour le nouveau combat

        db.ref('parties/' + sessionActuelle + '/combat_log').remove();
        db.ref('parties/' + sessionActuelle + '/combat_actif').set({
            actif: true,
            ennemis: ennemisChoisis,
            ordre_jeu: participants,
            tour_actuel: 0,
            joueurs_discrets,
            timestamp: Date.now()
        }).then(() => {
            if (typeof _toast === 'function') _toast('⚔ Combat lancé !', 'gold');
            mjAfficherInterfaceCombat();
        });
        }); // fin once compagnons
    });
}

/** Le MJ passe au tour suivant (= passer le tour du participant courant + regen). */
function mjTourSuivant() {
    // Lire combat_actif ET joueurs en une seule requête pour avoir le flag empoisonne
    db.ref('parties/' + sessionActuelle).once('value', (snapRoot) => {
        const root = snapRoot.val() || {};
        const data = root.combat_actif;
        const joueursFB = root.joueurs || {};
        if (!data || !data.actif) return;
        const ordre = data.ordre_jeu || [];
        if (ordre.length === 0) return;

        const tourIdx = (data.tour_actuel || 0) % ordre.length;
        const participant = ordre[tourIdx];
        const prochainTour = (typeof _prochainTourVivant === 'function')
            ? _prochainTourVivant(ordre, data.tour_actuel || 0)
            : ((data.tour_actuel || 0) + 1) % ordre.length;

        if (participant && typeof _roleRecuperation === 'function') {
            if (participant.type === 'joueur') {
                // Lire le flag empoisonne depuis le nœud joueur Firebase (pas depuis ordre_jeu)
                const joueurData = joueursFB[participant.id] || {};
                const estEmpoisonne = !!joueurData.empoisonne;

                if (estEmpoisonne) {
                    // Joueur empoisonné : pas de regen, le joueur applique le tick de poison lui-même
                    db.ref('parties/' + sessionActuelle + '/joueurs/' + participant.id + '/modif_stat').set({
                        stat: 'passer_tour', pvGain: 0, ftGain: 0, poisonTick: true, timestamp: Date.now()
                    });
                    if (typeof _logCombat === 'function') {
                        _logCombat(`${participant.nom} passe son tour — ☠ poison actif`);
                    }
                } else {
                    // Regen normale
                    const guerison = Math.max(1, Math.floor(((participant.pvMax || 10) / 10)));
                    const recup = _roleRecuperation(guerison);
                    db.ref('parties/' + sessionActuelle + '/joueurs/' + participant.id + '/modif_stat').set({
                        stat: 'passer_tour', pvGain: recup.pv, ftGain: recup.ft, timestamp: Date.now()
                    });
                    if (typeof _logCombat === 'function') {
                        const msg = recup.pv > 0
                            ? `${participant.nom} passe son tour et récupère +${recup.pv} PV / +${recup.ft} FT.${recup.label}`
                            : `${participant.nom} passe son tour — rien récupéré.${recup.label}`;
                        _logCombat(msg);
                    }
                }
            } else if (participant.type === 'compagnon') {
                if (typeof mjPasserTourCompagnon === 'function') {
                    const cn = (participant.statsBase?.CN || 5) + (participant.statsInvesties?.CN || 0);
                    mjPasserTourCompagnon(participant.ownerID, participant.compIdx, Math.max(1, Math.floor(cn / 3)));
                    return; // mjPasserTourCompagnon avance le tour lui-même
                }
            } else if (participant.type === 'ennemi') {
                if (typeof mjPasserTourEnnemi === 'function') {
                    mjPasserTourEnnemi(participant.instanceId);
                    return; // mjPasserTourEnnemi avance le tour lui-même
                }
            }
        }

        db.ref('parties/' + sessionActuelle + '/combat_actif/tour_actuel').set(prochainTour);
    });
}

/**
 * Termine le combat côté Firebase → tous les joueurs retournent à l'accueil.
 */
function mjTerminerCombat() {
    db.ref('parties/' + sessionActuelle + '/combat_actif').remove();
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
    if (typeof _toast === 'function') _toast(`🎲 ${nbItems} objets envoyés !`, 'gold');
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


// ══════════════════════════════════════════════════════════════
// VOL À LA TIRE — Interface MJ
// ══════════════════════════════════════════════════════════════

/**
 * Ouvre la modal de configuration du vol à la tire pour un joueur spécifique.
 * Le MJ choisit : rareté globale OU objet précis.
 */
// Labels d'affichage par type d'item
const _VOL_TYPE_LABELS = {
    arme_melee:    '⚔️ Armes de mêlée',
    arme_distance: '🏹 Armes à distance',
    arme_feu:      '🔫 Armes à feu',
    armure:        '🛡️ Armures',
    consommable:   '🧪 Consommables',
    munition:      '🔮 Munitions',
    composant:     '🔩 Composants',
    divers:        '📦 Divers',
    objet_quete:   '⭐ Objets de quête',
};

function mjAutoriserVolATire(playerID, playerNom) {
    let modal = document.getElementById('modal-vol-tire');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-vol-tire';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }

    const raretesOptions = [1,2,3,4,5,6,7,8,9,10]
        .map(r => `<option value="${r}">Rareté ${r}</option>`).join('');

    modal.innerHTML = `
        <div style="background:#1a120a;border:2px solid #7c4dff;border-radius:8px;padding:24px;max-width:460px;width:90%;max-height:85vh;overflow-y:auto;">
            <h3 style="color:#b39ddb;margin:0 0 16px;">🤏 Vol à la tire — ${playerNom}</h3>

            <div style="margin-bottom:14px;padding:10px;background:rgba(124,77,255,0.1);border:1px solid #5a3a9a;border-radius:6px;">
                <label style="color:#ccc;display:flex;align-items:center;gap:8px;cursor:pointer;margin-bottom:8px;">
                    <input type="radio" name="vol-type" value="rarete" checked style="accent-color:#7c4dff;">
                    <strong>Rareté globale du butin</strong>
                </label>
                <select id="vol-rarete-select" style="width:100%;background:#111;color:#eee;border:1px solid #555;padding:8px;border-radius:4px;">
                    ${raretesOptions}
                </select>
            </div>

            <div style="margin-bottom:18px;padding:10px;background:rgba(124,77,255,0.1);border:1px solid #5a3a9a;border-radius:6px;">
                <label style="color:#ccc;display:flex;align-items:center;gap:8px;cursor:pointer;margin-bottom:8px;">
                    <input type="radio" name="vol-type" value="objet" style="accent-color:#7c4dff;">
                    <strong>Objet précis</strong>
                </label>
                <input type="text" id="vol-objet-search" placeholder="🔍 Rechercher par nom…"
                    oninput="_volFiltrerItems()"
                    style="width:100%;box-sizing:border-box;background:#111;color:#eee;border:1px solid #555;padding:7px 10px;border-radius:4px;margin-bottom:8px;">
                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;" id="vol-cat-filtres"></div>
                <div onclick="_volSelectionnerItem('OR_PIECES')" id="vol-or-row"
                    style="padding:6px 10px;cursor:pointer;font-size:12px;border:1px solid #444;
                           border-radius:4px;background:#0d0d0d;margin-bottom:6px;
                           display:flex;align-items:center;justify-content:space-between;">
                    <span style="color:#ffd700;font-weight:bold;">💰 Or (quantité libre)</span>
                    <input type="number" id="vol-or-quantite" min="1" value="10"
                        onclick="event.stopPropagation();_volSelectionnerItem('OR_PIECES')"
                        style="width:70px;background:#111;color:#ffd700;border:1px solid #555;
                               padding:3px 6px;border-radius:4px;text-align:right;">
                </div>
                <div id="vol-objet-liste"
                    style="max-height:180px;overflow-y:auto;border:1px solid #444;border-radius:4px;background:#0d0d0d;"></div>
                <div id="vol-objet-selectionne"
                    style="margin-top:6px;font-size:12px;color:#b39ddb;min-height:16px;"></div>
            </div>

            <div style="display:flex;gap:8px;">
                <button onclick="_mjConfirmerVolATire('${playerID}','${playerNom}')"
                    style="flex:1;background:#7c4dff;color:white;border:none;padding:10px;border-radius:4px;cursor:pointer;font-weight:bold;">
                    ✅ Autoriser le vol
                </button>
                <button onclick="document.getElementById('modal-vol-tire').style.display='none'"
                    style="background:#333;color:#aaa;border:1px solid #555;padding:10px;border-radius:4px;cursor:pointer;">
                    Annuler
                </button>
            </div>
        </div>`;

    modal.style.display = 'flex';

    // Init picker items
    window._volObjetSelectionne = null;
    window._volCatActive = null;
    _volRenderCategories();
    _volFiltrerItems();

    // Sélectionner automatiquement le mode "objet" quand on clique sur la recherche
    document.getElementById('vol-objet-search').addEventListener('focus', () => {
        const radio = modal.querySelector('input[name="vol-type"][value="objet"]');
        if (radio) radio.checked = true;
    });
}

/** Construit les boutons de filtrage par catégorie. */
function _volRenderCategories() {
    const container = document.getElementById('vol-cat-filtres');
    if (!container || typeof itemsData === 'undefined') return;

    // Catégories présentes dans les items (tous sauf argent/or — géré séparément)
    const cats = [...new Set(
        Object.values(itemsData)
            .filter(d => d.type !== 'argent')
            .map(d => d.type)
    )].sort();

    container.innerHTML = cats.map(cat => {
        const label = _VOL_TYPE_LABELS[cat] || cat;
        return `<button onclick="_volToggleCat('${cat}')" data-cat="${cat}"
            style="font-size:11px;padding:3px 8px;border-radius:12px;border:1px solid #5a3a9a;
                   background:#1a120a;color:#ccc;cursor:pointer;white-space:nowrap;">
            ${label}
        </button>`;
    }).join('');
}

/** Active/désactive le filtre de catégorie. */
function _volToggleCat(cat) {
    window._volCatActive = (window._volCatActive === cat) ? null : cat;
    // Mise à jour visuels boutons
    document.querySelectorAll('#vol-cat-filtres button').forEach(btn => {
        const actif = btn.dataset.cat === window._volCatActive;
        btn.style.background  = actif ? '#7c4dff' : '#1a120a';
        btn.style.color       = actif ? '#fff'    : '#ccc';
        btn.style.borderColor = actif ? '#7c4dff' : '#5a3a9a';
    });
    _volFiltrerItems();
}

/** Filtre et affiche la liste d'items selon recherche + catégorie. */
function _volFiltrerItems() {
    const liste = document.getElementById('vol-objet-liste');
    if (!liste || typeof itemsData === 'undefined') return;

    const query = (document.getElementById('vol-objet-search')?.value || '').toLowerCase().trim();
    const catFiltree = window._volCatActive || null;

    // Grouper par type
    const groupes = {};
    Object.entries(itemsData).forEach(([id, d]) => {
        if (d.type === 'argent') return; // or géré séparément
        if (catFiltree && d.type !== catFiltree) return;
        if (query && !d.nom.toLowerCase().includes(query)) return;
        if (!groupes[d.type]) groupes[d.type] = [];
        groupes[d.type].push({ id, d });
    });

    if (Object.keys(groupes).length === 0) {
        liste.innerHTML = '<div style="color:#666;padding:8px;text-align:center;font-size:12px;">Aucun résultat</div>';
        return;
    }

    const typeOrder = Object.keys(_VOL_TYPE_LABELS);
    const html = Object.entries(groupes)
        .sort(([a], [b]) => typeOrder.indexOf(a) - typeOrder.indexOf(b))
        .map(([type, items]) => {
            const label = _VOL_TYPE_LABELS[type] || type;
            const lignes = items
                .sort((a, b) => parseInt(a.d.rarete) - parseInt(b.d.rarete))
                .map(({ id, d }) => {
                    const selectionne = window._volObjetSelectionne === id;
                    return `<div onclick="_volSelectionnerItem('${id}')"
                        style="padding:5px 10px;cursor:pointer;font-size:12px;
                               background:${selectionne ? 'rgba(124,77,255,0.3)' : 'transparent'};
                               border-left:3px solid ${selectionne ? '#7c4dff' : 'transparent'};
                               display:flex;justify-content:space-between;align-items:center;"
                        onmouseover="this.style.background='rgba(124,77,255,0.15)'"
                        onmouseout="this.style.background='${selectionne ? 'rgba(124,77,255,0.3)' : 'transparent'}'">
                        <span style="color:#eee;">${d.nom}</span>
                        <span style="color:#888;font-size:11px;">R${d.rarete} · ${d.prix}or</span>
                    </div>`;
                }).join('');
            return `<div>
                <div style="padding:4px 10px;font-size:11px;color:#7c4dff;background:#111;
                            border-bottom:1px solid #333;font-weight:bold;position:sticky;top:0;">
                    ${label}
                </div>
                ${lignes}
            </div>`;
        }).join('');

    liste.innerHTML = html;
}

/** Sélectionne un item dans le picker. */
function _volSelectionnerItem(id) {
    window._volObjetSelectionne = id;
    const info = document.getElementById('vol-objet-selectionne');
    // Surbrillance ligne Or
    const orRow = document.getElementById('vol-or-row');
    if (orRow) orRow.style.borderColor = id === 'OR_PIECES' ? '#ffd700' : '#444';
    if (info) {
        if (id === 'OR_PIECES') {
            const qte = parseInt(document.getElementById('vol-or-quantite')?.value) || 10;
            info.textContent = `✔ Sélectionné : Or × ${qte}`;
        } else {
            const d = itemsData[id];
            if (d) info.textContent = `✔ Sélectionné : ${d.nom} (R${d.rarete} · ${d.prix} or)`;
        }
    }
    // Sélectionner le mode "objet"
    const radio = document.querySelector('input[name="vol-type"][value="objet"]');
    if (radio) radio.checked = true;
    // Re-render pour mettre à jour la surbrillance
    _volFiltrerItems();
}

function _mjConfirmerVolATire(playerID, playerNom) {
    const typeVol = document.querySelector('input[name="vol-type"]:checked')?.value;
    let config;

    if (typeVol === 'rarete') {
        const rarete = parseInt(document.getElementById('vol-rarete-select').value);
        config = { actif: true, rarete: rarete, objetId: null, timestamp: Date.now() };
    } else {
        const objetId = window._volObjetSelectionne;
        if (!objetId) {
            if (typeof _toast === 'function') _toast('⚠️ Sélectionne un objet dans la liste.', 'error');
            return;
        }
        const quantite = objetId === 'OR_PIECES'
            ? (parseInt(document.getElementById('vol-or-quantite')?.value) || 10)
            : 1;
        config = { actif: true, rarete: null, objetId: objetId, quantite: quantite, timestamp: Date.now() };
    }

    db.ref('parties/' + sessionActuelle + '/vol_a_la_tire/' + playerID).set(config);
    document.getElementById('modal-vol-tire').style.display = 'none';
    window._volObjetSelectionne = null;
    window._volCatActive = null;
    if (typeof _toast === 'function') _toast(`🤏 Vol à la tire autorisé pour ${playerNom}.`, 'success');
}

// ── Bénédictions / Malédictions ─────────────────────────────────────────────

function mjGererEffets(playerID, playerNom) {
    let modal = document.getElementById('modal-effets-mj');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-effets-mj';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }

    const statsKeys = ['FO', 'IN', 'CN', 'DX', 'CH'];

    const renderModal = () => {
        db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/effets_actifs').once('value', snap => {
            const effets = snap.val() || {};
            const listeHtml = Object.entries(effets).map(([key, e]) => {
                const estBened = e.type === 'benediction';
                const couleur  = estBened ? '#ffd700' : '#ce93d8';
                const statsStr = [
                    ...Object.entries(e.stats || {}).filter(([,v]) => v !== 0).map(([k,v]) => `${k}${v>0?'+'+v:v}`),
                    ...(e.pvBonus ? [`PV${e.pvBonus>0?'+'+e.pvBonus:e.pvBonus}`] : []),
                    ...(e.ftBonus ? [`FT${e.ftBonus>0?'+'+e.ftBonus:e.ftBonus}`] : []),
                    ...Object.entries(e.comps || {}).filter(([,v]) => v !== 0).map(([k,v]) => `${k}${v>0?'+'+v:v}`)
                ].join(' ');
                return `<div style="display:flex;align-items:center;justify-content:space-between;
                            padding:6px 10px;background:rgba(255,255,255,0.04);border-radius:4px;margin-bottom:4px;">
                    <span style="color:${couleur};">${e.icone || ''} <strong>${e.nom}</strong>
                        ${statsStr ? `<span style="font-size:11px;color:#aaa;margin-left:6px;">${statsStr}</span>` : ''}
                    </span>
                    <button onclick="_mjSupprimerEffet('${playerID}','${key}')"
                        style="background:#5a0000;color:#ff6b6b;border:1px solid #8b0000;
                               padding:2px 8px;border-radius:4px;cursor:pointer;font-size:12px;">✕</button>
                </div>`;
            }).join('') || '<div style="color:#555;font-size:12px;text-align:center;padding:8px;">Aucun effet actif</div>';

            const statsInputs = statsKeys.map(s =>
                `<div style="text-align:center;">
                    <div style="color:#aaa;font-size:11px;margin-bottom:2px;">${s}</div>
                    <input type="number" id="effet-stat-${s}" value="0"
                        style="width:48px;background:#111;color:#eee;border:1px solid #555;
                               padding:4px;border-radius:4px;text-align:center;">
                </div>`
            ).join('');

            modal.innerHTML = `
                <div style="background:#1a120a;border:2px solid #7a6000;border-radius:10px;padding:20px;
                             max-width:460px;width:92%;max-height:85vh;overflow-y:auto;">
                    <h3 style="color:#ffd700;margin:0 0 14px;">✨ Effets — ${playerNom}</h3>

                    <div style="margin-bottom:16px;">${listeHtml}</div>

                    <div style="border-top:1px solid #333;padding-top:14px;">
                        <div style="font-size:12px;color:#aaa;margin-bottom:8px;text-transform:uppercase;">Ajouter un effet</div>

                        <div style="display:flex;gap:8px;margin-bottom:8px;">
                            <input type="text" id="effet-icone" placeholder="🌟" maxlength="2"
                                style="width:44px;background:#111;color:#eee;border:1px solid #555;
                                       padding:6px;border-radius:4px;text-align:center;font-size:16px;">
                            <input type="text" id="effet-nom" placeholder="Nom de l'effet"
                                style="flex:1;background:#111;color:#eee;border:1px solid #555;
                                       padding:6px;border-radius:4px;">
                        </div>

                        <div style="display:flex;gap:8px;margin-bottom:10px;">
                            <label style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;
                                padding:7px;border-radius:4px;cursor:pointer;border:1px solid #7a6000;background:rgba(255,215,0,0.08);">
                                <input type="radio" name="effet-type" value="benediction" checked style="accent-color:#ffd700;">
                                <span style="color:#ffd700;font-size:13px;">✨ Bénédiction</span>
                            </label>
                            <label style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;
                                padding:7px;border-radius:4px;cursor:pointer;border:1px solid #6a1b8a;background:rgba(156,39,176,0.1);">
                                <input type="radio" name="effet-type" value="malediction" style="accent-color:#ce93d8;">
                                <span style="color:#ce93d8;font-size:13px;">💀 Malédiction</span>
                            </label>
                        </div>

                        <div style="margin-bottom:8px;">
                            <div style="color:#aaa;font-size:11px;margin-bottom:6px;text-transform:uppercase;">Stats</div>
                            <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;">
                                ${statsInputs}
                            </div>
                        </div>

                        <div style="margin-bottom:8px;">
                            <div style="color:#aaa;font-size:11px;margin-bottom:6px;text-transform:uppercase;">Ressources</div>
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                                <div style="text-align:center;">
                                    <div style="color:#4caf50;font-size:11px;margin-bottom:2px;">❤ PV max</div>
                                    <input type="number" id="effet-stat-pv" value="0"
                                        style="width:100%;background:#111;color:#eee;border:1px solid #555;
                                               padding:4px;border-radius:4px;text-align:center;">
                                </div>
                                <div style="text-align:center;">
                                    <div style="color:#2196f3;font-size:11px;margin-bottom:2px;">⚡ FT max</div>
                                    <input type="number" id="effet-stat-ft" value="0"
                                        style="width:100%;background:#111;color:#eee;border:1px solid #555;
                                               padding:4px;border-radius:4px;text-align:center;">
                                </div>
                            </div>
                        </div>

                        <details style="margin-bottom:10px;">
                            <summary style="color:#aaa;font-size:11px;text-transform:uppercase;cursor:pointer;padding:4px 0;">
                                Compétences (cliquer pour déplier)
                            </summary>
                            <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px;" id="effet-comps-grid">
                                ${_mjEffetCompsInputs()}
                            </div>
                        </details>

                        <div style="display:flex;gap:6px;margin-bottom:6px;">
                            <button onclick="_mjConfirmerEffet('${playerID}', '${playerNom}', false)"
                                style="flex:1;background:#7a6000;color:#ffd700;border:none;
                                       padding:9px;border-radius:4px;cursor:pointer;font-weight:bold;">
                                ✅ Appliquer
                            </button>
                            <button onclick="_mjConfirmerEffet('${playerID}', '${playerNom}', true)"
                                style="flex:1;background:#3a3000;color:#ffd700;border:1px solid #7a6000;
                                       padding:9px;border-radius:4px;cursor:pointer;font-weight:bold;">
                                👥 Appliquer à tous
                            </button>
                        </div>
                        <button onclick="document.getElementById('modal-effets-mj').style.display='none'"
                            style="width:100%;background:#222;color:#888;border:1px solid #444;
                                   padding:7px;border-radius:4px;cursor:pointer;">
                            Fermer
                        </button>
                    </div>
                </div>`;
            modal.style.display = 'flex';
        });
    };

    window._mjRenderEffetsModal = renderModal;
    renderModal();
}

/** Génère les inputs compétences pour le modal d'effet. */
function _mjEffetCompsInputs() {
    if (typeof competencesData === 'undefined') return '';
    return Object.values(competencesData).flat().map(c =>
        `<div style="display:flex;align-items:center;justify-content:space-between;
                     background:rgba(255,255,255,0.03);border-radius:3px;padding:3px 6px;">
            <span style="color:#ccc;font-size:11px;">${c.nom}</span>
            <input type="number" id="effet-comp-${c.id}" value="0"
                style="width:44px;background:#111;color:#eee;border:1px solid #444;
                       padding:2px 4px;border-radius:3px;text-align:center;font-size:11px;">
        </div>`
    ).join('');
}

function _mjConfirmerEffet(playerID, playerNom, tousLesJoueurs = false) {
    const nom = document.getElementById('effet-nom')?.value.trim();
    if (!nom) { if (typeof _toast === 'function') _toast('⚠️ Donne un nom à l\'effet.', 'error'); return; }

    const icone = document.getElementById('effet-icone')?.value.trim() || '';
    const type  = document.querySelector('input[name="effet-type"]:checked')?.value || 'benediction';

    const stats = {};
    ['FO','IN','CN','DX','CH'].forEach(s => {
        const v = parseInt(document.getElementById('effet-stat-' + s)?.value) || 0;
        if (v !== 0) stats[s] = v;
    });

    const pvBonus = parseInt(document.getElementById('effet-stat-pv')?.value) || 0;
    const ftBonus = parseInt(document.getElementById('effet-stat-ft')?.value) || 0;

    const comps = {};
    if (typeof competencesData !== 'undefined') {
        Object.values(competencesData).flat().forEach(c => {
            const v = parseInt(document.getElementById('effet-comp-' + c.id)?.value) || 0;
            if (v !== 0) comps[c.id] = v;
        });
    }

    const effet = { nom, icone, type, stats, pvBonus, ftBonus, comps, timestamp: Date.now() };

    if (tousLesJoueurs) {
        db.ref('parties/' + sessionActuelle + '/joueurs').once('value', snap => {
            const joueurs = snap.val() || {};
            const promises = Object.keys(joueurs)
                .filter(id => !joueurs[id].estMJ)
                .map(id => db.ref('parties/' + sessionActuelle + '/joueurs/' + id + '/effets_actifs').push(effet));
            Promise.all(promises).then(() => {
                if (typeof _toast === 'function') _toast(`✨ "${nom}" appliqué à tous les joueurs.`, 'success');
                if (window._mjRenderEffetsModal) window._mjRenderEffetsModal();
            });
        });
    } else {
        db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/effets_actifs').push(effet)
            .then(() => {
                if (typeof _toast === 'function') _toast(`✨ Effet "${nom}" appliqué à ${playerNom}.`, 'success');
                if (window._mjRenderEffetsModal) window._mjRenderEffetsModal();
            });
    }
}

function _mjSupprimerEffet(playerID, effectKey) {
    db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/effets_actifs/' + effectKey).remove()
        .then(() => {
            if (window._mjRenderEffetsModal) window._mjRenderEffetsModal();
        });
}

// ── Système de Quêtes MJ ─────────────────────────────────────────────────────

function mjGererQuetes() {
    const sec = document.getElementById('mj-section-quetes');
    if (!sec) return;

    // Lire les joueurs connectés + les quêtes actives en parallèle
    Promise.all([
        db.ref('parties/' + sessionActuelle + '/joueurs').once('value'),
        db.ref('parties/' + sessionActuelle + '/quetes').once('value')
    ]).then(([snapJ, snapQ]) => {
        const joueurs = snapJ.val() || {};
        const quetesActives = snapQ.val() || {};

        // ── Liste des joueurs (checkboxes) ──────────────────────
        const joueursNonMJ = Object.entries(joueurs).filter(([, j]) => !j.estMJ);
        const checkboxesHtml = joueursNonMJ.length > 0
            ? joueursNonMJ.map(([id, j]) =>
                `<label style="display:flex;align-items:center;gap:6px;color:#ccc;font-size:0.9em;cursor:pointer;">
                    <input type="checkbox" class="mj-quete-joueur-cb" value="${id}" style="accent-color:#4caf50;"> ${j.nom || id}
                </label>`).join('')
            : '<span style="color:#666;font-size:0.85em;">Aucun joueur connecté</span>';

        // ── Formulaire création quête ───────────────────────────
        const optionsQuetes = Object.entries(quetesData || {}).map(([k, q]) =>
            `<option value="${k}">${q.nom} — ${q.donneur}</option>`).join('');

        const formHtml = `
        <div style="background:#0d1a0d;border:1px solid #4caf50;border-radius:8px;padding:14px;margin-bottom:18px;">
            <h3 style="color:#4caf50;margin:0 0 12px;font-size:0.95em;">➕ Nouvelle quête</h3>
            <div style="margin-bottom:10px;">
                <label style="color:#aaa;font-size:0.82em;display:block;margin-bottom:4px;">Quête prédéfinie</label>
                <select id="mj-quete-select" onchange="mjPreRemplirQuete(this.value)"
                    style="width:100%;background:#111;color:#fff;border:1px solid #4caf50;padding:6px;border-radius:4px;">
                    <option value="">— Quête personnalisée —</option>
                    ${optionsQuetes}
                </select>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
                <div>
                    <label style="color:#aaa;font-size:0.82em;">Nom</label>
                    <input id="mj-quete-nom" type="text" placeholder="Nom de la quête"
                        style="width:100%;background:#111;color:#fff;border:1px solid #555;padding:5px;border-radius:4px;box-sizing:border-box;">
                </div>
                <div>
                    <label style="color:#aaa;font-size:0.82em;">Donneur</label>
                    <input id="mj-quete-donneur" type="text" placeholder="NPC donneur"
                        style="width:100%;background:#111;color:#fff;border:1px solid #555;padding:5px;border-radius:4px;box-sizing:border-box;">
                </div>
            </div>
            <div style="margin-bottom:8px;">
                <label style="color:#aaa;font-size:0.82em;">Résumé</label>
                <textarea id="mj-quete-resume" rows="2" placeholder="Résumé court affiché dans le journal joueur"
                    style="width:100%;background:#111;color:#fff;border:1px solid #555;padding:5px;border-radius:4px;box-sizing:border-box;resize:vertical;"></textarea>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
                <div>
                    <label style="color:#aaa;font-size:0.82em;">⭐ XP récompense</label>
                    <input id="mj-quete-xp" type="number" value="50" min="0"
                        style="width:100%;background:#111;color:#fff;border:1px solid #555;padding:5px;border-radius:4px;box-sizing:border-box;">
                </div>
                <div>
                    <label style="color:#aaa;font-size:0.82em;">💰 Or récompense</label>
                    <input id="mj-quete-or" type="number" value="100" min="0"
                        style="width:100%;background:#111;color:#fff;border:1px solid #555;padding:5px;border-radius:4px;box-sizing:border-box;">
                </div>
            </div>
            <div style="margin-bottom:10px;">
                <label style="color:#aaa;font-size:0.82em;display:block;margin-bottom:6px;">👥 Joueurs participants</label>
                <div style="display:flex;flex-direction:column;gap:4px;">${checkboxesHtml}</div>
            </div>
            <button onclick="mjActiverQuete()"
                style="width:100%;background:#2e7d32;color:#fff;border:none;padding:8px;border-radius:6px;cursor:pointer;font-weight:bold;">
                📜 Lancer la quête
            </button>
        </div>`;

        // ── Quêtes actives ──────────────────────────────────────
        const enCours = Object.entries(quetesActives).filter(([, q]) => q.statut === 'en_cours');
        const terminees = Object.entries(quetesActives).filter(([, q]) => q.statut === 'validee' || q.statut === 'echouee');

        const rendreCarte = ([fbKey, q]) => {
            const estValide = q.statut === 'validee';
            const estEchoue = q.statut === 'echouee';
            const couleur   = estValide ? '#4caf50' : estEchoue ? '#8b0000' : '#d4af37';
            const badge     = estValide ? '✅' : estEchoue ? '❌' : '🔵';
            const joueursList = (q.joueurs || []).join(', ') || '—';
            const btns = (!estValide && !estEchoue) ? `
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px;">
                    <button onclick="mjValiderQuete('${fbKey}')"
                        style="background:#1a3a1a;color:#4caf50;border:1px solid #4caf50;padding:5px;border-radius:4px;cursor:pointer;font-size:0.85em;">✅ Valider</button>
                    <button onclick="mjEchouerQuete('${fbKey}')"
                        style="background:#3a0000;color:#ff6b6b;border:1px solid #8b0000;padding:5px;border-radius:4px;cursor:pointer;font-size:0.85em;">❌ Échouer</button>
                </div>` : '';
            return `<div style="border:1px solid ${couleur};border-radius:6px;padding:10px;margin-bottom:8px;background:#0a0a0a;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <strong style="color:${couleur};">${badge} ${q.nom}</strong>
                    <button onclick="mjSupprimerQuete('${fbKey}')" style="background:transparent;border:none;color:#555;cursor:pointer;font-size:12px;">🗑</button>
                </div>
                <div style="font-size:0.8em;color:#888;margin-top:2px;">Donné par : ${q.donneur || '—'} · Participants : ${joueursList}</div>
                <div style="font-size:0.82em;color:#aaa;margin-top:4px;">${q.resume || ''}</div>
                <div style="font-size:0.8em;color:#666;margin-top:3px;">Récompense : ⭐ ${q.recompenses?.xp || 0} XP · 💰 ${q.recompenses?.or || 0} or</div>
                ${btns}
            </div>`;
        };

        const enCoursHtml = enCours.length > 0
            ? enCours.map(rendreCarte).join('')
            : '<p style="color:#666;font-size:0.85em;">Aucune quête en cours.</p>';

        const termineesHtml = terminees.length > 0
            ? `<details style="margin-top:10px;"><summary style="color:#666;cursor:pointer;font-size:0.85em;">Historique (${terminees.length})</summary><div style="margin-top:8px;">${terminees.map(rendreCarte).join('')}</div></details>`
            : '';

        sec.innerHTML = formHtml
            + `<h3 style="color:#d4af37;font-size:0.9em;margin:0 0 8px;">📋 Quêtes en cours</h3>`
            + enCoursHtml + termineesHtml;
    });
}

/** Pré-remplit le formulaire avec les données d'une quête prédéfinie. */
function mjPreRemplirQuete(key) {
    const q = (typeof quetesData !== 'undefined') ? quetesData[key] : null;
    if (!q) return;
    const f = id => document.getElementById(id);
    if (f('mj-quete-nom'))    f('mj-quete-nom').value    = q.nom    || '';
    if (f('mj-quete-donneur'))f('mj-quete-donneur').value = q.donneur || '';
    if (f('mj-quete-resume')) f('mj-quete-resume').value  = q.resume  || '';
    if (f('mj-quete-xp'))     f('mj-quete-xp').value      = q.recompenses?.xp  ?? 50;
    if (f('mj-quete-or'))     f('mj-quete-or').value      = q.recompenses?.or  ?? 100;
}

/** Lance une quête et la publie dans Firebase pour les joueurs sélectionnés. */
function mjActiverQuete() {
    const nom     = (document.getElementById('mj-quete-nom')?.value     || '').trim();
    const donneur = (document.getElementById('mj-quete-donneur')?.value || '').trim();
    const resume  = (document.getElementById('mj-quete-resume')?.value  || '').trim();
    const xp      = parseInt(document.getElementById('mj-quete-xp')?.value)  || 0;
    const or      = parseInt(document.getElementById('mj-quete-or')?.value)  || 0;

    if (!nom) { if (typeof _toast === 'function') _toast('❌ Nom de quête requis.', 'error'); return; }

    const joueursCB = Array.from(document.querySelectorAll('.mj-quete-joueur-cb:checked')).map(cb => cb.value);

    const queteData = {
        nom, donneur, resume,
        recompenses: { xp, or },
        statut: 'en_cours',
        joueurs: joueursCB,
        timestamp: Date.now()
    };

    // ── Vérification doublon : un joueur ne peut pas avoir deux fois la même quête en cours ──
    db.ref('parties/' + sessionActuelle + '/quetes').once('value', snap => {
        const existantes = snap.val() || {};
        const enDoublon = joueursCB.filter(playerID =>
            Object.values(existantes).some(q =>
                q.nom === nom &&
                q.statut === 'en_cours' &&
                (q.joueurs || []).includes(playerID)
            )
        );
        if (enDoublon.length > 0) {
            if (typeof _toast === 'function') _toast(`⚠ Certains joueurs ont déjà "${nom}" en cours.`, 'error');
            return;
        }
        db.ref('parties/' + sessionActuelle + '/quetes').push(queteData).then(() => {
            if (typeof _toast === 'function') _toast(`📜 Quête "${nom}" lancée !`, 'success');
            mjGererQuetes();
        });
    });
}

/** Valide une quête : distribue XP + or aux participants et met le statut à 'validee'. */
function mjValiderQuete(fbKey) {
    db.ref('parties/' + sessionActuelle + '/quetes/' + fbKey).once('value', snap => {
        const q = snap.val();
        if (!q) return;

        const xp = q.recompenses?.xp || 0;
        const or = q.recompenses?.or || 0;
        const joueurs = q.joueurs || [];

        joueurs.forEach(playerID => {
            if (xp > 0) {
                db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/modif_stat').set({
                    stat: 'XP', valeur: xp, timestamp: Date.now()
                });
            }
            if (or > 0) {
                db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/modif_argent').set({
                    valeur: or, timestamp: Date.now()
                });
            }
        });

        db.ref('parties/' + sessionActuelle + '/quetes/' + fbKey + '/statut').set('validee').then(() => {
            if (typeof _toast === 'function') {
                const recap = [xp ? `⭐ ${xp} XP` : '', or ? `💰 ${or} or` : ''].filter(Boolean).join(' + ');
                _toast(`✅ Quête "${q.nom}" validée !${recap ? ' Récompenses : ' + recap : ''}`, 'success');
            }
            mjGererQuetes();
        });
    });
}

/** Marque une quête comme échouée (pas de récompenses). */
function mjEchouerQuete(fbKey) {
    db.ref('parties/' + sessionActuelle + '/quetes/' + fbKey + '/statut').set('echouee').then(() => {
        if (typeof _toast === 'function') _toast('❌ Quête marquée comme échouée.', 'error');
        mjGererQuetes();
    });
}

/** Supprime définitivement une quête de Firebase. */
function mjSupprimerQuete(fbKey) {
    db.ref('parties/' + sessionActuelle + '/quetes/' + fbKey).remove().then(() => {
        mjGererQuetes();
    });
}

// ============================================================
// SYSTÈME DONJON — Interface MJ
// ============================================================

// Brouillon du donjon en cours d'édition
window._donjonBrouillon = null;
window._donjonModeEdit  = 'sol';    // 'sol' | 'mur' | 'coffre' | 'piege' | 'decouverte' | 'rencontre' | 'porte' | 'depart'

/** Génère le HTML du panneau "Donner une clef" pour la vue active MJ. */
function _mjBuilderDonnerClefHtml(data) {
    // Recenser toutes les clefs définies dans les événements de portes
    const clesConnues = [];
    Object.values(data.grille || {}).forEach(cell => {
        const c = cell.event?.data?.cleRequise;
        if (c && !clesConnues.includes(c)) clesConnues.push(c);
    });
    if (clesConnues.length === 0) return ''; // Aucune porte à clef

    // Liste des joueurs
    const joueurs = data.ordre_joueurs || [];
    if (joueurs.length === 0) return '';

    const selCles = clesConnues.map(c =>
        `<option value="${c}">${c}</option>`
    ).join('');
    const cbJoueurs = joueurs.map(j =>
        `<label style="display:flex;align-items:center;gap:6px;color:#ccc;font-size:0.85em;"><input type="checkbox" class="mj-cle-joueur-cb" value="${j}"> ${j}</label>`
    ).join('');

    return `
        <div style="background:#1a1408;border:1px solid #8b6914;border-radius:6px;padding:10px;margin-bottom:10px;">
            <strong style="color:#d4af37;font-size:0.9em;">🗝 Donner une clef</strong>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:6px;">
                <select id="mj-cle-select" style="background:#111;color:#d4af37;border:1px solid #8b6914;padding:4px 8px;border-radius:4px;font-size:0.85em;">${selCles}</select>
                <span style="color:#666;font-size:0.8em;">→ Joueurs :</span>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">${cbJoueurs}</div>
                <button onclick="mjDonnerClef()" style="background:#2a1a0a;color:#d4af37;border:1px solid #8b6914;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:0.85em;">Donner</button>
            </div>
        </div>`;
}

/** Écrit les clefs sélectionnées dans Firebase pour les joueurs cochés. */
function mjDonnerClef() {
    const cleId   = document.getElementById('mj-cle-select')?.value;
    if (!cleId) return;
    const cbs     = document.querySelectorAll('.mj-cle-joueur-cb:checked');
    const joueurs = Array.from(cbs).map(cb => cb.value);
    if (joueurs.length === 0) {
        if (typeof _toast === 'function') _toast('Sélectionne au moins un joueur.', 'error');
        return;
    }
    const promises = joueurs.map(j =>
        db.ref('parties/' + sessionActuelle + '/donjon_actif/cles_joueurs/' + j + '/' + cleId).set(true)
    );
    Promise.all(promises).then(() => {
        if (typeof _toast === 'function') _toast(`🗝 Clef "${cleId}" donnée à : ${joueurs.join(', ')}`, 'success');
    });
}

/** Point d'entrée de l'onglet MJ Donjon */
function mjGererDonjon() {
    const sec = document.getElementById('mj-section-donjon');
    if (!sec) return;

    // Vérifier si un donjon est actif en Firebase
    db.ref('parties/' + sessionActuelle + '/donjon_actif').once('value', snap => {
        const actif = snap.val();
        if (actif) {
            _mjAfficherDonjonActif(sec, actif);
        } else {
            _mjAfficherBuilderDonjon(sec);
        }
    });
}

// ── VUE ACTIVE (MJ voit tout) ────────────────────────────────

function _mjAfficherDonjonActif(sec, data) {
    const grille  = data.grille  || {};
    const largeur = data.largeur || 10;
    const hauteur = data.hauteur || 8;
    const cellPx  = Math.max(20, Math.min(32, Math.floor(460 / largeur)));

    // Rencontre en attente ?
    const rencontreHtml = data.rencontre_en_attente
        ? `<div style="background:#3a0000;border:1px solid #ff6b6b;padding:8px;border-radius:6px;margin-bottom:10px;">
            <strong style="color:#ff6b6b;">👹 Rencontre déclenchée !</strong>
            <div style="color:#ccc;font-size:0.85em;margin:4px 0;">${data.rencontre_en_attente.description} — par ${data.rencontre_en_attente.declenchePar}</div>
            <button onclick="mjLancerCombatRencontre()" style="background:#8b0000;color:#fff;border:none;padding:6px 14px;border-radius:4px;cursor:pointer;margin-top:4px;">⚔ Lancer le combat</button>
            <button onclick="mjIgnorerRencontre()" style="background:#222;color:#aaa;border:1px solid #555;padding:6px 14px;border-radius:4px;cursor:pointer;margin-top:4px;margin-left:6px;">Ignorer</button>
           </div>`
        : '';

    // Grille complète (sans brouillard)
    let grilleHtml = `<div style="display:grid;grid-template-columns:repeat(${largeur},${cellPx}px);gap:1px;background:#111;padding:4px;border:1px solid #333;border-radius:4px;width:fit-content;margin:0 auto 10px;">`;
    for (let y = 0; y < hauteur; y++) {
        for (let x = 0; x < largeur; x++) {
            const key  = `${x}_${y}`;
            const cell = grille[key] || { type: 'mur' };
            const isMur = cell.type === 'mur';
            let bg = isMur ? '#2a2a2a' : '#3a2e20';
            let content = '';
            if (!isMur && cell.event) {
                const etatCoffre = cell.event.type === 'coffre' ? (data.etats_coffres?.[key] || null) : null;
                let icone;
                if (etatCoffre) {
                    icone = etatCoffre.statut === 'casse' ? '💥' : etatCoffre.statut === 'ouvert' ? '📭' : '🔒';
                } else {
                    const icones = { porte: '🚪', piege: '🪤', coffre: '📦', rencontre: '👹', decouverte: '🔎' };
                    icone = icones[cell.event.type] || '';
                }
                content = cell.event.declenche && !etatCoffre
                    ? '<span style="opacity:0.4">' + icone + '</span>'
                    : icone;
            }
            // Positions joueurs et compagnons
            Object.entries(data.positions || {}).forEach(([id, pos]) => {
                if (pos.x === x && pos.y === y) {
                    content += id.startsWith('cmp_') ? '🐾' : '👤';
                    bg = '#1a3a1a';
                }
            });
            grilleHtml += `<div style="width:${cellPx}px;height:${cellPx}px;background:${bg};display:flex;align-items:center;justify-content:center;font-size:${Math.max(9,cellPx-10)}px;border:1px solid #1a1a1a;">${content}</div>`;
        }
    }
    grilleHtml += '</div>';

    // Log récent
    const logEntries = Object.values(data.log || {})
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, 8)
        .map(e => `<div style="color:#aaa;font-size:0.8em;padding:2px 0;">${e.texte}</div>`)
        .join('') || '<span style="color:#555;font-size:0.8em;">Aucune action.</span>';

    // Ordre de jeu
    const ordre = data.ordre_joueurs || [];
    const tourIdx = Math.max(0, (data.tour_actuel || 0) % Math.max(1, ordre.length));
    const nomTour = ordre[tourIdx] || '?';
    const estTourCompagnon = nomTour.startsWith('cmp_');
    const ordreHtml = ordre.length > 0
        ? `<div style="margin-bottom:6px;font-size:0.85em;color:#888;">Ordre : ${ordre.map((n,i) => {
            const label = n.startsWith('cmp_') ? '🐾' + n.slice(4) : n;
            return `<span style="color:${i===tourIdx?'#4caf50':'#666'}">${label}</span>`;
          }).join(' → ')}</div>`
        : '';

    // Contrôles compagnon si c'est son tour
    const cmpId = estTourCompagnon ? nomTour.slice(4) : null;
    const cmpControlesHtml = estTourCompagnon ? `
        <div style="background:#1a1a0a;border:1px solid #8b6914;border-radius:6px;padding:10px;margin-bottom:10px;">
            <div style="color:#d4af37;font-size:0.85em;margin-bottom:6px;">🐾 Tour du compagnon de <strong>${cmpId}</strong></div>
            <div style="display:grid;grid-template-columns:repeat(3,42px);gap:4px;justify-content:center;">
                <div></div>
                <button onclick="mjDeplacerCompagnon('${cmpId}',0,-1)" style="width:42px;height:42px;background:#2a1a0a;color:#d4af37;border:1px solid #8b6914;border-radius:6px;cursor:pointer;font-size:1.2em;">↑</button>
                <div></div>
                <button onclick="mjDeplacerCompagnon('${cmpId}',-1,0)" style="width:42px;height:42px;background:#2a1a0a;color:#d4af37;border:1px solid #8b6914;border-radius:6px;cursor:pointer;font-size:1.2em;">←</button>
                <div style="width:42px;height:42px;display:flex;align-items:center;justify-content:center;color:#d4af37;font-size:1.3em;">🐾</div>
                <button onclick="mjDeplacerCompagnon('${cmpId}',1,0)"  style="width:42px;height:42px;background:#2a1a0a;color:#d4af37;border:1px solid #8b6914;border-radius:6px;cursor:pointer;font-size:1.2em;">→</button>
                <div></div>
                <button onclick="mjDeplacerCompagnon('${cmpId}',0,1)"  style="width:42px;height:42px;background:#2a1a0a;color:#d4af37;border:1px solid #8b6914;border-radius:6px;cursor:pointer;font-size:1.2em;">↓</button>
                <div></div>
            </div>
            <button onclick="mjPasserTourCompagnon()" style="background:#222;color:#666;border:1px solid #444;padding:5px 18px;border-radius:4px;cursor:pointer;font-size:0.82em;margin-top:8px;display:block;margin-left:auto;margin-right:auto;">⏭ Passer le tour</button>
        </div>` : '';

    sec.innerHTML = `
        <div style="color:#9c7fd4;font-size:1.1em;font-weight:bold;margin-bottom:10px;">🗺 Donjon actif</div>
        ${rencontreHtml}
        ${ordreHtml}
        ${cmpControlesHtml}
        ${grilleHtml}
        <div style="border-top:1px solid #2a2010;padding-top:6px;margin-bottom:10px;">
            <div style="color:#666;font-size:0.75em;margin-bottom:4px;">Journal</div>
            <div style="max-height:120px;overflow-y:auto;">${logEntries}</div>
        </div>
        ${_mjBuilderDonnerClefHtml(data)}
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">
            <button onclick="mjGererDonjon()" style="background:#1a1a2a;color:#9c7fd4;border:1px solid #5c3a9d;padding:6px 14px;border-radius:4px;cursor:pointer;font-size:0.85em;">🔄 Rafraîchir</button>
            <button onclick="mjTogglePauseDonjon()" style="background:${data.pause ? '#2a1a00' : '#1a1a00'};color:${data.pause ? '#f0b429' : '#888'};border:1px solid ${data.pause ? '#8b6914' : '#444'};padding:6px 14px;border-radius:4px;cursor:pointer;font-size:0.85em;">${data.pause ? '▶ Reprendre' : '⏸ Pause'}</button>
            <button onclick="mjTerminerDonjon()" style="background:#3a0000;color:#ff6b6b;border:1px solid #8b0000;padding:6px 14px;border-radius:4px;cursor:pointer;font-size:0.85em;">🏁 Terminer le donjon</button>
        </div>
    `;
}

// ── BUILDER ──────────────────────────────────────────────────

function _mjAfficherBuilderDonjon(sec) {
    // Init brouillon si nécessaire
    if (!window._donjonBrouillon) {
        window._donjonBrouillon = _creerGrilleDonjon(10, 8);
    }
    // Mode par défaut : sol (sinon le clic sur une cellule sans mode sélectionné crée un event invalide)
    if (!window._donjonModeEdit) window._donjonModeEdit = 'sol';

    sec.innerHTML = _mjBuilderDonjonHtml();
    _mjRendreGrilleBuilder();
}

function _creerGrilleDonjon(larg, haut) {
    const grille = {};
    for (let y = 0; y < haut; y++) {
        for (let x = 0; x < larg; x++) {
            // Bordure = mur, intérieur = mur par défaut (MJ peint en sol)
            grille[`${x}_${y}`] = { type: 'mur' };
        }
    }
    return { largeur: larg, hauteur: haut, grille, depart: { x: 1, y: 1 } };
}

function _mjBuilderDonjonHtml() {
    const b = window._donjonBrouillon;
    const modes = [
        { id: 'sol',        label: '🟫 Sol',        color: '#3a2e20' },
        { id: 'mur',        label: '🧱 Mur',        color: '#2a2a2a' },
        { id: 'porte',      label: '🚪 Porte',      color: '#5c3a00' },
        { id: 'coffre',     label: '📦 Coffre',     color: '#0d2a0d' },
        { id: 'piege',      label: '🪤 Piège',      color: '#2a0d0d' },
        { id: 'decouverte', label: '🔎 Découverte', color: '#0d1a2a' },
        { id: 'rencontre',  label: '👹 Rencontre',  color: '#2a0d0d' },
        { id: 'depart',     label: '📍 Départ',     color: '#1a3a1a' },
    ];
    const modeBtns = modes.map(m => {
        const actif = window._donjonModeEdit === m.id;
        return `<button onclick="mjSetModeDonjon('${m.id}')" style="background:${actif ? m.color : '#111'};color:${actif ? '#fff' : '#888'};border:1px solid ${actif ? '#9c7fd4' : '#333'};padding:4px 8px;border-radius:4px;cursor:pointer;font-size:0.78em;">${m.label}</button>`;
    }).join('');

    // Boutons présets
    const presetBtns = typeof DONJON_PRESETS !== 'undefined'
        ? Object.entries(DONJON_PRESETS).map(([id, p]) =>
            `<button onclick="mjChargerPreset('${id}')" style="background:#111;color:#9c7fd4;border:1px solid #5c3a9d;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:0.78em;">${p.nom}</button>`
          ).join('')
        : '';

    return `
        <div style="color:#9c7fd4;font-size:1.1em;font-weight:bold;margin-bottom:10px;">🗺 Éditeur de Donjon</div>

        <!-- Cartes préenregistrées -->
        ${presetBtns ? `<div style="margin-bottom:10px;"><div style="color:#666;font-size:0.75em;margin-bottom:4px;">Cartes préenregistrées :</div><div style="display:flex;gap:5px;flex-wrap:wrap;">${presetBtns}</div></div>` : ''}

        <!-- Taille -->
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:10px;flex-wrap:wrap;">
            <label style="color:#aaa;font-size:0.85em;">Largeur</label>
            <input id="donjon-larg" type="number" min="5" max="20" value="${b.largeur}" style="width:50px;background:#111;color:#fff;border:1px solid #444;padding:3px 6px;border-radius:3px;">
            <label style="color:#aaa;font-size:0.85em;">Hauteur</label>
            <input id="donjon-haut" type="number" min="5" max="20" value="${b.hauteur}" style="width:50px;background:#111;color:#fff;border:1px solid #444;padding:3px 6px;border-radius:3px;">
            <button onclick="mjRedimensionnerDonjon()" style="background:#222;color:#9c7fd4;border:1px solid #5c3a9d;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:0.82em;">Créer</button>
            <button onclick="mjResetDonjon()" style="background:#222;color:#666;border:1px solid #444;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:0.82em;">🗑 Reset</button>
        </div>

        <!-- Modes de peinture -->
        <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px;">${modeBtns}</div>
        <div id="donjon-event-form" style="margin-bottom:8px;"></div>

        <!-- Grille éditable -->
        <div id="donjon-builder-grille" style="margin:0 auto 10px;cursor:crosshair;"></div>

        <!-- Lancer -->
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;">
            <button onclick="mjLancerDonjon()" style="background:#1a0d2a;color:#9c7fd4;border:1px solid #5c3a9d;padding:7px 18px;border-radius:4px;cursor:pointer;font-size:0.9em;">🚀 Lancer le donjon</button>
        </div>
    `;
}

function mjSetModeDonjon(mode) {
    window._donjonModeEdit = mode;
    const sec = document.getElementById('mj-section-donjon');
    if (sec) sec.innerHTML = _mjBuilderDonjonHtml();
    _mjRendreGrilleBuilder();
    // Formulaire événement si besoin
    if (['piege','decouverte','rencontre','porte','coffre'].includes(mode)) {
        _mjAfficherFormulaireEvent(mode);
    }
}

function _mjAfficherFormulaireEvent(mode) {
    const form = document.getElementById('donjon-event-form');
    if (!form) return;
    const styles = 'background:#111;color:#fff;border:1px solid #444;padding:3px 8px;border-radius:3px;font-size:0.82em;';
    let html = `<div style="background:#1a1a2a;border:1px solid #5c3a9d;padding:8px;border-radius:6px;font-size:0.82em;color:#aaa;">`;
    if (mode === 'piege') {
        html += `<strong style="color:#ff6b6b;">Piège</strong><br>
            <div style="margin-bottom:4px;">
                Description : <input id="ev-desc" type="text" placeholder="Dalle piégée…" style="${styles}width:160px;">
            </div>
            <div style="margin-bottom:4px;">
                Dégâts PV : <input id="ev-degats" type="number" value="8" min="1" max="99" style="${styles}width:50px;">
                &nbsp; Difficulté : <input id="ev-difficulte" type="number" value="50" min="1" max="100" style="${styles}width:50px;">
                <span style="color:#555;font-size:0.85em;">(1=facile, 100=très dur)</span>
            </div>
            <div>
                Type de dégât :
                <select id="ev-type-degat" style="${styles}">
                    <option value="normal">🪤 Normal</option>
                    <option value="poison">☠️ Poison</option>
                    <option value="feu">🔥 Feu</option>
                    <option value="elec">⚡ Électrique</option>
                </select>
                <span style="color:#555;font-size:0.85em;margin-left:4px;">Poison = effet/tour × 3, Élec = étourdi 1 tour, Feu = brûlure bonus</span>
            </div>`;
    } else if (mode === 'decouverte') {
        html += `<strong style="color:#2196f3;">Découverte</strong><br>
            Texte : <input id="ev-desc" type="text" placeholder="Une inscription sur le mur…" style="${styles}width:250px;">`;
    } else if (mode === 'rencontre') {
        html += `<strong style="color:#ff9800;">Rencontre</strong><br>
            Description : <input id="ev-desc" type="text" placeholder="Des gobelins surgissent !" style="${styles}width:220px;">`;
    } else if (mode === 'porte') {
        html += `<strong style="color:#d4af37;">Porte</strong><br>
            <div style="margin-top:4px;">
                Clef requise : <input id="ev-cle-requise" type="text" placeholder="cle_tour_nord (vide = aucune)" style="${styles}width:200px;">
                <span style="color:#555;font-size:0.85em;display:block;margin-top:2px;">Si rempli → porte toujours verrouillée, ouvrable uniquement avec cette clef (ou de force)</span>
            </div>
            <div style="margin-top:6px;">
                Prob. verrouillée <em style="color:#555;">(sans clef)</em> : <input id="ev-prob-verrou-porte" type="number" min="0" max="100" value="30" style="${styles}width:55px;"> %
                &nbsp; Durabilité : <input id="ev-durabilite-porte" type="number" min="10" max="100" value="30" style="${styles}width:50px;">
            </div>`;
    } else if (mode === 'coffre') {
        html += `<strong style="color:#4caf50;">Coffre</strong><br>
            Probabilité verrouillé : <input id="ev-prob-verrou" type="number" min="0" max="100" value="30" style="${styles}width:55px;"> %
            &nbsp; Durabilité : <input id="ev-durabilite" type="number" min="10" max="100" value="20" style="${styles}width:50px;">
            <span style="color:#555;font-size:0.9em;margin-left:6px;">(si verrouillé)</span>`;
    }
    html += '</div>';
    form.innerHTML = html;
}

function _mjRendreGrilleBuilder() {
    const container = document.getElementById('donjon-builder-grille');
    if (!container || !window._donjonBrouillon) return;
    const b = window._donjonBrouillon;
    const cellPx = Math.max(18, Math.min(30, Math.floor(460 / b.largeur)));

    container.style.cssText = `display:grid;grid-template-columns:repeat(${b.largeur},${cellPx}px);gap:1px;background:#111;padding:4px;border:1px solid #333;border-radius:4px;width:fit-content;`;
    container.innerHTML = '';

    for (let y = 0; y < b.hauteur; y++) {
        for (let x = 0; x < b.largeur; x++) {
            const key  = `${x}_${y}`;
            const cell = b.grille[key] || { type: 'mur' };
            const isMur = cell.type === 'mur';
            const isDepart = b.depart?.x === x && b.depart?.y === y;

            const div = document.createElement('div');
            div.style.cssText = `width:${cellPx}px;height:${cellPx}px;display:flex;align-items:center;justify-content:center;font-size:${Math.max(8,cellPx-12)}px;box-sizing:border-box;`;

            if (isDepart) {
                div.style.background = '#1a3a1a';
                div.textContent = '📍';
            } else if (isMur) {
                div.style.background = '#2a2a2a';
                div.style.border = '1px solid #1a1a1a';
            } else {
                div.style.background = '#3a2e20';
                div.style.border = '1px solid #4a3a28';
                if (cell.event) {
                    const icones = { porte: '🚪', piege: '🪤', coffre: '📦', rencontre: '👹', decouverte: '🔎' };
                    div.textContent = icones[cell.event.type] || '';
                }
            }

            div.addEventListener('click', () => _mjCelluleCliquee(x, y));
            container.appendChild(div);
        }
    }
}

function _mjCelluleCliquee(x, y) {
    const b   = window._donjonBrouillon;
    if (!b) return;
    const key  = `${x}_${y}`;
    const mode = window._donjonModeEdit;
    if (!mode) return; // Aucun mode sélectionné

    if (mode === 'sol') {
        b.grille[key] = { type: 'sol' };
    } else if (mode === 'mur') {
        b.grille[key] = { type: 'mur' };
    } else if (mode === 'depart') {
        // Mettre la case en sol et définir le départ
        b.grille[key] = { type: 'sol' };
        b.depart = { x, y };
    } else {
        // Event : la case devient sol + event
        b.grille[key] = { type: 'sol', event: _mjLireFormulaireEvent(mode) };
    }

    _mjRendreGrilleBuilder();
}

function _mjLireFormulaireEvent(mode) {
    const event = { type: mode, declenche: false, data: {} };
    const desc       = document.getElementById('ev-desc');
    const degats     = document.getElementById('ev-degats');
    const verrou     = document.getElementById('ev-verrou');
    const probVerrou = document.getElementById('ev-prob-verrou');
    const durabilite = document.getElementById('ev-durabilite');
    if (desc)       event.data.description = desc.value || '';
    if (desc && mode === 'decouverte') event.data.texte = desc.value || '';
    if (degats)     event.data.degats      = parseInt(degats.value) || 8;
    if (verrou)     event.data.verrouille  = verrou.checked; // legacy (non-porte)
    const typeDegat  = document.getElementById('ev-type-degat');
    const difficulte = document.getElementById('ev-difficulte');
    if (typeDegat)  event.data.type_degat  = typeDegat.value || 'normal';
    if (difficulte) event.data.difficulte  = Math.min(100, Math.max(1, parseInt(difficulte.value) || 50));
    const cleRequise      = document.getElementById('ev-cle-requise');
    const probVerrouPorte = document.getElementById('ev-prob-verrou-porte');
    const durabilitePorte = document.getElementById('ev-durabilite-porte');
    if (cleRequise)      event.data.cleRequise  = cleRequise.value.trim() || null;
    if (probVerrouPorte) event.data.probVerrou  = Math.min(100, Math.max(0, parseInt(probVerrouPorte.value) || 30));
    if (durabilitePorte) event.data.durabilite  = Math.min(100, Math.max(10, parseInt(durabilitePorte.value) || 30));
    if (probVerrou) event.data.probVerrou  = Math.min(100, Math.max(0, parseInt(probVerrou.value) || 30));
    if (durabilite) event.data.durabilite  = Math.min(100, Math.max(10, parseInt(durabilite.value) || 20));
    return event;
}

function mjRedimensionnerDonjon() {
    const larg = Math.min(20, Math.max(5, parseInt(document.getElementById('donjon-larg')?.value) || 10));
    const haut = Math.min(20, Math.max(5, parseInt(document.getElementById('donjon-haut')?.value) || 8));
    window._donjonBrouillon = _creerGrilleDonjon(larg, haut);
    const sec = document.getElementById('mj-section-donjon');
    if (sec) sec.innerHTML = _mjBuilderDonjonHtml();
    _mjRendreGrilleBuilder();
}

function mjResetDonjon() {
    window._donjonBrouillon = null;
    window._donjonModeEdit = 'sol';
    mjGererDonjon();
}

/** Charge une carte pré-enregistrée dans le brouillon. */
function mjChargerPreset(nom) {
    if (typeof DONJON_PRESETS === 'undefined' || !DONJON_PRESETS[nom]) return;
    if (!confirm(`Charger la carte "${DONJON_PRESETS[nom].nom}" ? Le brouillon actuel sera remplacé.`)) return;
    window._donjonBrouillon = _parseDonjonPreset(DONJON_PRESETS[nom]);
    window._donjonModeEdit = 'sol';
    const sec = document.getElementById('mj-section-donjon');
    if (sec) sec.innerHTML = _mjBuilderDonjonHtml();
    _mjRendreGrilleBuilder();
}

/** Lance le donjon : écrit dans Firebase et initialise les positions des joueurs. */
function mjLancerDonjon() {
    const b = window._donjonBrouillon;
    if (!b) return;

    db.ref('parties/' + sessionActuelle + '/joueurs').once('value', snap => {
        const joueurs = snap.val() || {};
        const ids = Object.keys(joueurs);
        if (ids.length === 0) {
            if (typeof _toast === 'function') _toast('Aucun joueur connecté.', 'error');
            return;
        }

        // Filtrer le MJ (pas de perso jouable dans le donjon)
        const joueurIds = ids.filter(id => !joueurs[id]?.estMJ);

        // Positions initiales : tous au point de départ (joueurs + compagnons)
        const positions = {};
        const depart = { x: b.depart?.x || 1, y: b.depart?.y || 1 };
        joueurIds.forEach(id => { positions[id] = { ...depart }; });
        joueurIds.forEach(id => {
            if (joueurs[id]?.compagnon?.nom) {
                positions[`cmp_${id}`] = { ...depart };
            }
        });

        // Ordre de jeu : joueurs + compagnons, tri par DX décroissant
        const getDX = (id) => {
            const j = joueurs[id];
            return (j?.statsBase?.DX || 8) + (j?.statsInvesties?.DX || 0);
        };
        const getDXCmp = (id) => {
            const cmp = joueurs[id]?.compagnon;
            return cmp?.DX || 8;
        };

        const entrees = [];
        joueurIds.forEach(id => {
            entrees.push({ id, dx: getDX(id) });
            if (joueurs[id]?.compagnon?.nom) {
                entrees.push({ id: `cmp_${id}`, dx: getDXCmp(id) });
            }
        });
        entrees.sort((a, b2) => b2.dx - a.dx);
        const ordre = entrees.map(e => e.id);

        const payload = {
            largeur:       b.largeur,
            hauteur:       b.hauteur,
            grille:        b.grille,
            positions,
            ordre_joueurs: ordre,
            tour_actuel:   0,
            log:           {}
        };

        db.ref('parties/' + sessionActuelle + '/donjon_actif').set(payload).then(() => {
            if (typeof _toast === 'function') _toast('🗺 Donjon lancé !', 'success');
            mjGererDonjon();
        });
    });
}

/** Bascule la pause du donjon. */
function mjTogglePauseDonjon() {
    db.ref('parties/' + sessionActuelle + '/donjon_actif/pause').once('value', snap => {
        const enPause = !!snap.val();
        db.ref('parties/' + sessionActuelle + '/donjon_actif/pause').set(!enPause).then(() => {
            if (typeof _toast === 'function') _toast(enPause ? '▶ Jeu repris.' : '⏸ Jeu en pause.', 'info');
            mjGererDonjon();
        });
    });
}

/** Termine le donjon : supprime la clé Firebase. */
function mjTerminerDonjon() {
    if (!confirm('Terminer le donjon ? Les joueurs seront renvoyés à l\'accueil.')) return;
    db.ref('parties/' + sessionActuelle + '/donjon_actif').remove().then(() => {
        window._donjonBrouillon = null;
        if (typeof _toast === 'function') _toast('🏁 Donjon terminé.', 'info');
        mjGererDonjon();
    });
}

/** Lance un combat depuis une rencontre en attente dans le donjon. */
function mjLancerCombatRencontre() {
    db.ref('parties/' + sessionActuelle + '/donjon_actif/rencontre_en_attente').once('value', snap => {
        const r = snap.val();
        if (!r) { if (typeof _toast === 'function') _toast('Aucune rencontre active.', 'error'); return; }
        // Stocker le contexte pour l'onglet combat
        window._rencontreDonjonContexte = r.description || 'Rencontre !';
        // Effacer la rencontre en attente ET lever la pause
        const refDonjon = db.ref('parties/' + sessionActuelle + '/donjon_actif');
        refDonjon.child('rencontre_en_attente').remove();
        refDonjon.child('pause').set(false);
        // Basculer sur l'onglet combat
        if (typeof switchOngletMJ === 'function') switchOngletMJ('combat');
    });
}

/** Ignore une rencontre en attente. */
function mjIgnorerRencontre() {
    const refDonjon = db.ref('parties/' + sessionActuelle + '/donjon_actif');
    refDonjon.child('rencontre_en_attente').remove();
    refDonjon.child('pause').set(false);
    refDonjon.once('value', () => mjGererDonjon());
}

/** Déplace un compagnon (MJ) dans le donjon. */
function mjDeplacerCompagnon(joueurId, dx, dy) {
    const ref = db.ref('parties/' + sessionActuelle + '/donjon_actif');
    ref.once('value', snap => {
        const data = snap.val();
        if (!data) return;
        const cmpKey = `cmp_${joueurId}`;
        const pos = data.positions?.[cmpKey] || { x: 1, y: 1 };
        const nx = pos.x + dx;
        const ny = pos.y + dy;

        if (nx < 0 || nx >= (data.largeur || 10) || ny < 0 || ny >= (data.hauteur || 8)) return;

        const cellKey = `${nx}_${ny}`;
        const cell = data.grille?.[cellKey];
        if (!cell || cell.type === 'mur') {
            if (typeof _toast === 'function') _toast('🧱 Passage bloqué.', 'error');
            return;
        }

        const ordre = data.ordre_joueurs || [];
        const tourIdx = Math.max(0, (data.tour_actuel || 0) % Math.max(1, ordre.length));
        const nextTour = (tourIdx + 1) % Math.max(1, ordre.length);

        const logKey = 'log_' + Date.now();
        const updates = {};
        updates[`positions/${cmpKey}`] = { x: nx, y: ny };
        updates['tour_actuel'] = nextTour;
        updates[`log/${logKey}`] = { texte: `🐾 Compagnon de ${joueurId} se déplace en (${nx},${ny}).`, timestamp: Date.now() };

        ref.update(updates).then(() => mjGererDonjon());
    });
}

/** Passe le tour du compagnon actuel (MJ). */
function mjPasserTourCompagnon() {
    const ref = db.ref('parties/' + sessionActuelle + '/donjon_actif');
    ref.once('value', snap => {
        const data = snap.val();
        if (!data) return;
        const ordre = data.ordre_joueurs || [];
        const tourIdx = Math.max(0, (data.tour_actuel || 0) % Math.max(1, ordre.length));
        const nextTour = (tourIdx + 1) % Math.max(1, ordre.length);
        ref.update({ tour_actuel: nextTour }).then(() => mjGererDonjon());
    });
}
