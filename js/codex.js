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
        container.innerHTML = "";

        if (!joueurs) return;

        db.ref('parties/' + sessionActuelle + '/compagnons').once('value', snapComps => {
            const tousCompagnons = snapComps.val() || {};
            // (once suffit : on est déjà dans un on() joueurs — se re-déclenche à chaque maj joueur)

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

        section.innerHTML = `
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
function mjAutoriserVolATire(playerID, playerNom) {
    let modal = document.getElementById('modal-vol-tire');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-vol-tire';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }

    // Liste des objets lootables triés par rareté
    const itemsOptions = (typeof itemsData !== 'undefined')
        ? Object.entries(itemsData)
            .filter(([, d]) => d.lootable !== false)
            .sort(([, a], [, b]) => parseInt(a.rarete) - parseInt(b.rarete))
            .map(([id, d]) => `<option value="${id}">[R${d.rarete}] ${d.nom}</option>`)
            .join('')
        : '';

    const raretesOptions = [1,2,3,4,5,6,7,8,9,10]
        .map(r => `<option value="${r}">Rareté ${r}</option>`).join('');

    modal.innerHTML = `
        <div style="background:#1a120a;border:2px solid #7c4dff;border-radius:8px;padding:24px;max-width:420px;width:90%;max-height:80vh;overflow-y:auto;">
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
                <select id="vol-objet-select" style="width:100%;background:#111;color:#eee;border:1px solid #555;padding:8px;border-radius:4px;">
                    ${itemsOptions}
                </select>
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
}

function _mjConfirmerVolATire(playerID, playerNom) {
    const typeVol = document.querySelector('input[name="vol-type"]:checked')?.value;
    let config;

    if (typeVol === 'rarete') {
        const rarete = parseInt(document.getElementById('vol-rarete-select').value);
        config = { actif: true, rarete: rarete, objetId: null, timestamp: Date.now() };
    } else {
        const objetId = document.getElementById('vol-objet-select').value;
        config = { actif: true, rarete: null, objetId: objetId, timestamp: Date.now() };
    }

    db.ref('parties/' + sessionActuelle + '/vol_a_la_tire/' + playerID).set(config);
    document.getElementById('modal-vol-tire').style.display = 'none';
    if (typeof _toast === 'function') _toast(`🤏 Vol à la tire autorisé pour ${playerNom}.`, 'success');
}
