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

        for (let id in joueurs) {
            const j = joueurs[id];
            const estMort = (j.pvActuel <= 0);

            // Section compagnons du joueur
            const comps = j.compagnons_summary || [];
            const compsHtml = comps.length
                ? comps.map(c => {
                    const key = id + '-' + c.idx;
                    const nomSafe = c.nom.replace(/'/g, "\\'");
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
 * Le MJ choisit précisément où va le point de level-up d'un compagnon.
 * Affiche un panel inline (pas de prompt).
 */
function mjLevelUpCompagnon(playerID, compIdx, compNom) {
    const containerId = 'lvup-panel-' + playerID + '-' + compIdx;
    const existing = document.getElementById(containerId);
    if (existing) { existing.remove(); return; } // toggle

    const parent = document.querySelector(`[data-comp-key="${playerID}-${compIdx}"]`);
    if (!parent) return;

    const panel = document.createElement('div');
    panel.id = containerId;
    panel.className = 'comp-levelup-panel';
    panel.innerHTML = '<div class="lvup-titre">🌟 Level Up ' + compNom + ' — choisir :</div>'
        + ['FO','IN','CN','DX','CH'].map(s =>
            `<button class="comp-levelup-btn" onclick="mjEnvoyerLevelUp('${playerID}',${compIdx},'${s}',this)">+1 ${s}</button>`
        ).join('')
        + '<div class="lvup-titre" style="margin-top:6px;">Compétence / Magie</div>'
        + `<button class="comp-levelup-btn" onclick="mjLvUpComp_menu('${playerID}',${compIdx},'comp',this)">Compétence…</button>`
        + `<button class="comp-levelup-btn" onclick="mjLvUpComp_menu('${playerID}',${compIdx},'magie',this)">Sort…</button>`;
    parent.after(panel);
}

function mjEnvoyerLevelUp(playerID, compIdx, stat, btn) {
    db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/compagnon_action').set({
        type: 'levelup', compIdx: compIdx, stat: stat, timestamp: Date.now()
    });
    btn.closest('.comp-levelup-panel').remove();
    if (typeof _toast === 'function') _toast('Level-up envoyé (+1 ' + stat + ').', 'gold');
}

function mjLvUpComp_menu(playerID, compIdx, type, btn) {
    const panel = btn.closest('.comp-levelup-panel');
    let extra = panel.querySelector('.lvup-extra');
    if (extra) { extra.remove(); return; }
    extra = document.createElement('div');
    extra.className = 'lvup-extra';
    extra.style.marginTop = '6px';

    if (type === 'comp') {
        const comps = ['melee','esquive','soins','persuasion','discrétion','reparation','technologie'];
        extra.innerHTML = comps.map(c =>
            `<button class="comp-levelup-btn" onclick="mjEnvoyerLevelUpComp('${playerID}',${compIdx},'comp','${c}',this)">${c}</button>`
        ).join('');
    } else {
        if (typeof magieData === 'undefined') return;
        extra.innerHTML = Object.keys(magieData).map(e =>
            `<button class="comp-levelup-btn" onclick="mjEnvoyerLevelUpComp('${playerID}',${compIdx},'magie','${e}',this)">${e}</button>`
        ).join('');
    }
    panel.appendChild(extra);
}

function mjEnvoyerLevelUpComp(playerID, compIdx, type, valeur, btn) {
    const payload = { type: 'levelup', compIdx: compIdx, timestamp: Date.now() };
    if (type === 'comp') { payload.stat = 'comp'; payload.competence = valeur; }
    else { payload.stat = 'magie'; payload.ecole = valeur; }
    db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/compagnon_action').set(payload);
    btn.closest('.comp-levelup-panel').remove();
    if (typeof _toast === 'function') _toast('Level-up envoyé (+1 ' + valeur + ').', 'gold');
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
                xp: e.xp || 0
            });
        }
    }

    if (ennemisChoisis.length === 0) {
        if (typeof _toast === 'function') _toast('Sélectionnez au moins un ennemi.', 'error');
        return;
    }

    // Récupère les joueurs pour construire l'ordre de jeu basé sur la vitesse
    db.ref('parties/' + sessionActuelle + '/joueurs').once('value', (snap) => {
        const joueurs = snap.val() || {};
        const participants = [];

        // Joueurs + leurs compagnons
        for (let id in joueurs) {
            const j = joueurs[id];
            participants.push({
                type: 'joueur',
                id,
                nom: j.nom,
                vitesse: j.vitesse || j.niveau || 1
            });
            // Compagnons du joueur
            const comps = j.compagnons_summary || [];
            comps.forEach(c => {
                participants.push({
                    type: 'compagnon',
                    nom: c.nom,
                    niveau: c.niveau || 1,
                    ownerNom: j.nom,
                    vitesse: Math.max(1, (c.niveau || 1) * 2),
                    magieInvesties: c.magieInvesties || null
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

        db.ref('parties/' + sessionActuelle + '/combat_actif').set({
            actif: true,
            ennemis: ennemisChoisis,
            ordre_jeu: participants,
            tour_actuel: 0,
            timestamp: Date.now()
        }).then(() => {
            if (typeof _toast === 'function') _toast('⚔ Combat lancé !', 'gold');
            mjAfficherInterfaceCombat();
        });
    });
}

/** Le MJ passe au tour suivant. */
function mjTourSuivant() {
    db.ref('parties/' + sessionActuelle + '/combat_actif').once('value', (snap) => {
        const data = snap.val();
        if (!data || !data.actif) return;
        const taille = (data.ordre_jeu || []).length;
        if (taille === 0) return;
        const prochainTour = ((data.tour_actuel || 0) + 1) % taille;
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




