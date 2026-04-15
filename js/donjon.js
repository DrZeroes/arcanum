// ============================================================
// SYSTÈME DE DONJON — Phase joueur
// Tour par tour, brouillard de guerre, événements
// ============================================================

window.donjonActif = null;

// ── Cartes pré-enregistrées ──────────────────────────────────
// Chaque carte est définie par un tableau de chaînes (ASCII map).
// '#' = mur, '.' = sol, 'S' = départ, 'P' = piège, 'C' = coffre, 'R' = rencontre, 'D' = porte, 'X' = découverte

const DONJON_PRESETS = {
    couloir: {
        nom: '🗺 Couloir en L',
        carte: [
            '##########',
            '#S........',
            '#.#######.',
            '#.......R.',
            '#C#######.',
            '#X......P.',
            '#.########',
            '##########',
        ]
    },
    crypte: {
        nom: '⚰ Crypte',
        carte: [
            '############',
            '#S..#....C.#',
            '#...D......#',
            '#...#....R.#',
            '####.#####.#',
            '#P...#.....#',
            '#....D.....#',
            '#X...#.....#',
            '############',
        ]
    },
    grotte: {
        nom: '🪨 Grotte',
        carte: [
            '###########',
            '##S........',
            '#.#########',
            '#.#.......#',
            '#.#.C.R...#',
            '#.#.......#',
            '#.#########',
            '#.........#',
            '#P..D.....#',
            '###########',
        ]
    },
    forteresse: {
        nom: '🏰 Forteresse',
        carte: [
            '################',
            '#S.............#',
            '#.##.########.##',
            '#.#C.........D.#',
            '#.#.#########.##',
            '#.#.#R.......#.#',
            '#D#.#.#######.##',
            '#...#.........P#',
            '#.##########.###',
            '#X.............#',
            '################',
        ]
    }
};

/** Convertit une carte ASCII en objet brouillon. */
function _parseDonjonPreset(preset) {
    const lignes = preset.carte;
    const hauteur = lignes.length;
    const largeur = Math.max(...lignes.map(l => l.length));
    const grille = {};
    let depart = { x: 1, y: 1 };

    for (let y = 0; y < hauteur; y++) {
        const ligne = lignes[y];
        for (let x = 0; x < largeur; x++) {
            const ch = (ligne[x] || '#');
            const key = `${x}_${y}`;
            if (ch === '#') {
                grille[key] = { type: 'mur' };
            } else if (ch === 'S') {
                grille[key] = { type: 'sol' };
                depart = { x, y };
            } else if (ch === 'P') {
                grille[key] = { type: 'sol', event: { type: 'piege', declenche: false, data: { description: 'Dalle piégée', degats: 8, type_degat: 'normal', difficulte: 50 } } };
            } else if (ch === 'C') {
                grille[key] = { type: 'sol', event: { type: 'coffre', declenche: false, data: { probVerrou: 50, durabilite: 20 } } };
            } else if (ch === 'R') {
                grille[key] = { type: 'sol', event: { type: 'rencontre', declenche: false, data: { description: 'Des ennemis surgissent !' } } };
            } else if (ch === 'D') {
                grille[key] = { type: 'sol', event: { type: 'porte', declenche: false, data: { probVerrou: 40, durabilite: 30, cleRequise: null } } };
            } else if (ch === 'X') {
                grille[key] = { type: 'sol', event: { type: 'decouverte', declenche: false, data: { texte: 'Une inscription mystérieuse…' } } };
            } else {
                grille[key] = { type: 'sol' };
            }
        }
    }
    return { largeur, hauteur, grille, depart };
}

// ── Navigation ───────────────────────────────────────────────

function ouvrirEcranDonjon() {
    if (typeof cacherTout === 'function') cacherTout();
    const ecran = document.getElementById('ecran-donjon');
    if (ecran) ecran.style.display = 'flex';
    _activerClavierDonjon();
    afficherEtatDonjon();
}

/** Active le listener clavier pour déplacer le joueur dans le donjon. */
function _activerClavierDonjon() {
    if (window._clavierDonjonActif) return; // déjà branché
    window._clavierDonjonActif = true;
    document.addEventListener('keydown', _handleClavierDonjon);
}

function _desactiverClavierDonjon() {
    window._clavierDonjonActif = false;
    document.removeEventListener('keydown', _handleClavierDonjon);
}

function _handleClavierDonjon(e) {
    // Ignorer si un champ de saisie est actif
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    // Ignorer si l'écran donjon n'est pas visible
    const ecran = document.getElementById('ecran-donjon');
    if (!ecran || ecran.style.display === 'none') return;

    const map = {
        'ArrowUp': [0, -1], 'z': [0, -1], 'Z': [0, -1],
        'ArrowDown': [0, 1], 's': [0, 1], 'S': [0, 1],
        'ArrowLeft': [-1, 0], 'q': [-1, 0], 'Q': [-1, 0],
        'ArrowRight': [1, 0], 'd': [1, 0], 'D': [1, 0],
    };
    const dir = map[e.key];
    if (!dir) return;
    e.preventDefault();
    deplacerJoueur(dir[0], dir[1]);
}

function fermerEcranDonjon() {
    _desactiverClavierDonjon();
    window.donjonActif = null;
    if (typeof allerAccueil === 'function') allerAccueil();
}

// ── Affichage principal ──────────────────────────────────────

function afficherEtatDonjon() {
    const data = window.donjonActif;
    if (!data) return;
    _afficherOrdreDonjon(data);
    _afficherStatsDonjon();
    _afficherGrilleDonjon(data);
    _afficherPanneauDonjon(data);
    _afficherActionsHorsCombatDonjon();
    _afficherLogDonjon(data);
    _afficherBandeauRencontre(data);
}

/** Affiche (ou cache) le bandeau "rencontre en attente du MJ" pour les joueurs. */
function _afficherBandeauRencontre(data) {
    if (window.estMJ) return;
    let el = document.getElementById('donjon-bandeau-rencontre');
    if (!el) {
        el = document.createElement('div');
        el.id = 'donjon-bandeau-rencontre';
        el.style.cssText = 'display:none;position:absolute;top:0;left:0;right:0;background:rgba(100,0,0,0.92);color:#ff8080;text-align:center;padding:10px;font-weight:bold;z-index:500;font-size:0.9em;border-bottom:2px solid #8b0000;';
        const ecran = document.getElementById('ecran-donjon');
        if (ecran) ecran.style.position = 'relative', ecran.appendChild(el);
    }
    if (data.rencontre_en_attente) {
        const desc = data.rencontre_en_attente.description || 'Des ennemis !';
        el.innerHTML = `👹 <strong>${desc}</strong> — En attente du MJ…`;
        el.style.display = 'block';
    } else {
        el.style.display = 'none';
    }
}

// ── Barre d'ordre d'actions ──────────────────────────────────

function _afficherOrdreDonjon(data) {
    const bar = document.getElementById('donjon-ordre-bar');
    if (!bar) return;
    const ordre   = data.ordre_joueurs || [];
    const tourIdx = Math.max(0, (data.tour_actuel || 0) % Math.max(1, ordre.length));
    const myID    = (window.perso?.nom || '').replace(/\s+/g, '_');

    bar.innerHTML = ordre.map((id, i) => {
        const actif  = i === tourIdx;
        const isMe   = id === myID;
        const isCmp  = id.startsWith('cmp_');
        const label  = isCmp
            ? `🐾 ${id.replace('cmp_', '').replace(/_/g, ' ')}`
            : id.replace(/_/g, ' ');
        return `<div style="
            display:inline-flex;align-items:center;padding:3px 9px;border-radius:4px;
            white-space:nowrap;font-size:0.74em;
            background:${actif ? '#1a3a1a' : '#111'};
            border:1px solid ${actif ? '#4caf50' : '#2a2010'};
            color:${actif ? '#4caf50' : isMe ? '#d4af37' : '#666'};
            font-weight:${actif ? 'bold' : 'normal'};
        ">${actif ? '▶ ' : ''}${label}</div>`;
    }).join('');
}

// ── Stats HP / FT ────────────────────────────────────────────

function _afficherStatsDonjon() {
    const el = document.getElementById('donjon-stats');
    if (!el || !window.perso) return;
    const p     = window.perso;
    const pvAct = p.pvActuel ?? 0;
    const pvMax = (p.statsBase?.FO || 0) * 2 + (p.statsBase?.IN || 0)
                + (p.statsInvesties?.FO || 0) * 2 + (p.statsInvesties?.IN || 0)
                + (p.boostPV || 0);
    const ftAct = p.ftActuel ?? 0;
    const ftMax = (p.statsBase?.CN || 0) * 2 + (p.statsBase?.IN || 0)
                + (p.statsInvesties?.CN || 0) * 2 + (p.statsInvesties?.IN || 0)
                + (p.boostFT || 0);
    const pvPct = pvMax > 0 ? Math.round(pvAct / pvMax * 100) : 0;
    const ftPct = ftMax > 0 ? Math.round(ftAct / ftMax * 100) : 0;
    const pvCol = pvPct > 50 ? '#4caf50' : pvPct > 20 ? '#f0b429' : '#ff4444';

    el.innerHTML = `
        <div style="display:flex;gap:10px;background:#111;border-radius:5px;padding:6px 10px;">
            <div style="flex:1;">
                <div style="color:#888;font-size:0.72em;margin-bottom:2px;">❤ PV</div>
                <div style="height:5px;background:#222;border-radius:3px;overflow:hidden;margin-bottom:2px;">
                    <div style="height:100%;width:${pvPct}%;background:${pvCol};"></div>
                </div>
                <strong style="color:${pvCol};font-size:0.88em;">${pvAct} / ${pvMax}</strong>
            </div>
            <div style="flex:1;">
                <div style="color:#888;font-size:0.72em;margin-bottom:2px;">⚡ FT</div>
                <div style="height:5px;background:#222;border-radius:3px;overflow:hidden;margin-bottom:2px;">
                    <div style="height:100%;width:${ftPct}%;background:#2196f3;"></div>
                </div>
                <strong style="color:#2196f3;font-size:0.88em;">${ftAct} / ${ftMax}</strong>
            </div>
        </div>`;
}

// ── Soins & Consommables (hors combat) ───────────────────────

/** Retourne true si c'est le tour du joueur actuel dans le donjon. */
function _estMonTourDonjon() {
    const data = window.donjonActif;
    if (!data) return false;
    const ordre = data.ordre_joueurs || [];
    if (ordre.length === 0) return true; // pas de système de tour actif
    const myID   = (window.perso?.nom || '').replace(/\s+/g, '_');
    const tourIdx = (data.tour_actuel || 0) % ordre.length;
    return ordre[tourIdx] === myID;
}

function _afficherActionsHorsCombatDonjon() {
    const el = document.getElementById('donjon-actions-hc');
    if (!el || !window.perso) return;
    if (window.estMJ) { el.innerHTML = ''; return; }

    const p   = window.perso;
    const inv = p.inventaire || [];

    // Consommables utiles
    const conso = inv.filter(item => {
        if (!item || item.quantite <= 0) return false;
        const def = typeof itemsData !== 'undefined' ? itemsData[item.id] : null;
        return def && (def.soin || def.curePoison || def.resurrection);
    });

    // Sorts de soin connus
    const sortsHC = [];
    if (typeof magieData !== 'undefined') {
        const magieInv = p.magieInvesties || {};
        Object.entries(magieData).forEach(([ecole, ecoleData]) => {
            const niveauEcole = magieInv[ecole] || 0;
            if (!niveauEcole) return;
            (ecoleData.sorts || []).forEach(s => {
                if ((s.soin || s.curePoison) && s.niv <= niveauEcole) {
                    if (!sortsHC.find(x => x.nom === s.nom)) sortsHC.push(s);
                }
            });
        });
    }

    const btn = 'background:#1a1408;color:#d4af37;border:1px solid #4a3a1a;padding:5px 10px;border-radius:4px;cursor:pointer;font-size:0.78em;';
    const btnInv = 'background:#1a1208;color:#9c7fd4;border:1px solid #3a2060;padding:5px 10px;border-radius:4px;cursor:pointer;font-size:0.78em;';
    let html = '<div style="border-top:1px solid #2a2010;padding-top:6px;margin-top:4px;">';
    html += '<div style="display:flex;flex-wrap:wrap;gap:5px;">';

    if (conso.length > 0 || sortsHC.length > 0) {
        conso.forEach(item => {
            const def = itemsData[item.id];
            const ico = def.soin ? '💊' : def.curePoison ? '🧪' : '✨';
            html += `<button onclick="_utiliserItemDonjon('${item.id}')" style="${btn}">${ico} ${def.nom} ×${item.quantite}</button>`;
        });
        sortsHC.forEach(s => {
            html += `<button onclick="_choisirCibleSoinDonjon('${s.nom}')" style="${btn}">✨ ${s.nom}${s.cout ? ` (−${s.cout} FT)` : ''}</button>`;
        });
    }

    html += `<button onclick="_ouvrirInventaireDonjon()" style="${btnInv}">📦 Inventaire</button>`;
    html += '</div></div>';
    el.innerHTML = html;
}

/** Ouvre l'inventaire depuis le donjon — retour automatique au donjon en fermant. */
function _ouvrirInventaireDonjon() {
    window._retourDonjon = true;
    if (typeof allerInventaire === 'function') allerInventaire();
}

/** Utilise un consommable sur soi-même. */
function _utiliserItemDonjon(itemId) {
    if (!_estMonTourDonjon()) {
        if (typeof _toast === 'function') _toast("⏳ Ce n'est pas votre tour !", 'error');
        return;
    }
    const p   = window.perso;
    if (!p || typeof itemsData === 'undefined') return;
    const def = itemsData[itemId];
    if (!def) return;
    const idx = (p.inventaire || []).findIndex(i => i.id === itemId && i.quantite > 0);
    if (idx === -1) return;

    if (def.soin) {
        const parts  = String(def.soin).split('-').map(Number);
        const soinMn = parts[0] || 0;
        const soinMx = parts[parts.length - 1] || soinMn;
        const soin   = soinMn + Math.floor(Math.random() * (soinMx - soinMn + 1));
        const pvMax  = (p.statsBase?.FO || 0) * 2 + (p.statsBase?.IN || 0)
                     + (p.statsInvesties?.FO || 0) * 2 + (p.statsInvesties?.IN || 0) + (p.boostPV || 0);
        p.pvActuel = Math.min(pvMax, (p.pvActuel || 0) + soin);
        if (typeof _toast === 'function') _toast(`💊 ${def.nom} : +${soin} PV`, 'success');
        _logDonjon(`💊 ${p.nom} utilise ${def.nom} (+${soin} PV).`);
    }
    if (def.curePoison) {
        p.poison = null;
        if (typeof _toast === 'function') _toast(`🧪 ${def.nom} : poison soigné !`, 'success');
        _logDonjon(`🧪 ${p.nom} utilise ${def.nom} (poison soigné).`);
    }

    p.inventaire[idx].quantite--;
    if (p.inventaire[idx].quantite <= 0) p.inventaire.splice(idx, 1);
    if (typeof autoSave === 'function') autoSave();
    if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
    _avancerTourDonjon(window.donjonActif);
    afficherEtatDonjon();
}

/** Ouvre la sélection de cible pour un sort de soin. */
function _choisirCibleSoinDonjon(nomSort) {
    if (!_estMonTourDonjon()) {
        if (typeof _toast === 'function') _toast("⏳ Ce n'est pas votre tour !", 'error');
        return;
    }
    const data = window.donjonActif;
    if (!data) return;
    const joueurs = Object.keys(data.positions || {}).filter(id => !id.startsWith('cmp_'));

    let modal = document.getElementById('modal-donjon-soin');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-donjon-soin';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }
    const myID    = (window.perso?.nom || '').replace(/\s+/g, '_');
    const btnSyle = 'background:#0d1a0d;color:#4caf50;border:1px solid #2a5a2a;padding:8px 14px;border-radius:4px;cursor:pointer;width:100%;text-align:left;';
    const cibles  = joueurs.map(id =>
        `<button onclick="_lancerSoinDonjon('${nomSort}','${id}')" style="${btnSyle}">${id === myID ? '👤 ' : '🧑 '}${id.replace(/_/g, ' ')}</button>`
    ).join('');

    modal.innerHTML = `
        <div style="background:#1a120a;border:2px solid #4caf50;border-radius:10px;padding:20px;max-width:300px;width:90%;text-align:center;">
            <h3 style="color:#4caf50;margin:0 0 12px;">✨ ${nomSort}</h3>
            <div style="display:flex;flex-direction:column;gap:6px;">${cibles}</div>
            <button onclick="document.getElementById('modal-donjon-soin').remove()" style="margin-top:10px;width:100%;background:#333;color:#aaa;border:1px solid #555;padding:7px;border-radius:4px;cursor:pointer;">Annuler</button>
        </div>`;
    modal.style.display = 'flex';
}

/** Lance un sort de soin sur une cible (soi ou allié via Firebase). */
function _lancerSoinDonjon(nomSort, cibleId) {
    document.getElementById('modal-donjon-soin')?.remove();
    let sort = null;
    if (typeof magieData !== 'undefined') {
        Object.values(magieData).forEach(ec => { ec.sorts?.forEach(s => { if (s.nom === nomSort) sort = s; }); });
    }
    if (!sort) return;

    const p      = window.perso;
    const ftCost = sort.cout || 0;
    if (ftCost > 0 && (p.ftActuel || 0) < ftCost) {
        if (typeof _toast === 'function') _toast(`Pas assez de FT (${p.ftActuel} / ${ftCost}).`, 'error');
        return;
    }
    if (ftCost > 0) { p.ftActuel = Math.max(0, (p.ftActuel || 0) - ftCost); }

    const myID = (p.nom || '').replace(/\s+/g, '_');
    const soin = sort.soin || 0;

    if (cibleId === myID) {
        const pvMax = (p.statsBase?.FO || 0) * 2 + (p.statsBase?.IN || 0)
                    + (p.statsInvesties?.FO || 0) * 2 + (p.statsInvesties?.IN || 0) + (p.boostPV || 0);
        p.pvActuel = Math.min(pvMax, (p.pvActuel || 0) + soin);
        if (typeof _toast === 'function') _toast(`✨ ${sort.nom} : +${soin} PV`, 'success');
        _logDonjon(`✨ ${p.nom} se soigne avec ${sort.nom} (+${soin} PV).`);
    } else {
        db.ref('parties/' + sessionActuelle + '/joueurs/' + cibleId + '/modif_stat').set({
            stat: 'PV', valeur: soin, timestamp: Date.now()
        });
        if (typeof _toast === 'function') _toast(`✨ ${sort.nom} → ${cibleId.replace(/_/g, ' ')} (+${soin} PV)`, 'success');
        _logDonjon(`✨ ${p.nom} lance ${sort.nom} sur ${cibleId.replace(/_/g, ' ')} (+${soin} PV).`);
    }

    if (typeof autoSave === 'function') autoSave();
    if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
    _avancerTourDonjon(window.donjonActif);
    afficherEtatDonjon();
}

// ── Grille avec brouillard ───────────────────────────────────

function _afficherGrilleDonjon(data) {
    const container = document.getElementById('donjon-grille');
    if (!container) return;

    const grille  = data.grille  || {};
    const largeur = data.largeur || 10;
    const hauteur = data.hauteur || 8;
    const myID    = (window.perso?.nom || '').replace(/\s+/g, '_');
    const maPos   = data.positions?.[myID] || { x: 1, y: 1 };

    // Calcul de la visibilité (flood-fill depuis la position du joueur)
    // Les portes fermées/verrouillées bloquent la propagation
    const visible = _calculerVisibilite(grille, largeur, hauteur, maPos.x, maPos.y, data.etats_portes);

    // Taille des cases : max 36px, adapté à la largeur
    const cellPx = Math.max(22, Math.min(36, Math.floor(340 / largeur)));
    container.style.cssText = `
        display:grid;
        grid-template-columns:repeat(${largeur},${cellPx}px);
        gap:1px; background:#111; padding:4px;
        border:1px solid #333; border-radius:4px;
        width:fit-content; margin:0 auto;
    `;
    container.innerHTML = '';

    for (let y = 0; y < hauteur; y++) {
        for (let x = 0; x < largeur; x++) {
            const key  = `${x}_${y}`;
            const cell = grille[key] || { type: 'mur' };
            const isVisible = visible.has(key);
            const isMyPos   = x === maPos.x && y === maPos.y;

            const div = document.createElement('div');
            div.style.cssText = `width:${cellPx}px;height:${cellPx}px;display:flex;align-items:center;justify-content:center;font-size:${Math.max(10,cellPx-8)}px;position:relative;`;

            if (!isVisible) {
                div.style.background = '#000';
            } else if (cell.type === 'mur') {
                div.style.background = '#2a2a2a';
                div.style.border = '1px solid #1a1a1a';
            } else {
                div.style.background = '#3a2e20';
                div.style.border = '1px solid #4a3a28';

                // Événements
                if (cell.event) {
                    if (cell.event.type === 'porte') {
                        const etatPorte = data.etats_portes?.[key];
                        if (etatPorte?.statut === 'ouverte') {
                            div.innerHTML = '🟫'; // porte ouverte
                        } else if (etatPorte?.statut === 'cassee') {
                            div.innerHTML = '💥'; // porte détruite
                        } else {
                            div.innerHTML = '🚪'; // porte fermée ou verrouillée
                        }
                    } else if (cell.event.type === 'coffre') {
                        const etatCoffre = data.etats_coffres?.[key];
                        if (!etatCoffre) {
                            div.innerHTML = '📦'; // coffre intact, jamais ouvert
                        } else if (etatCoffre.statut === 'casse') {
                            div.innerHTML = '💥';
                        } else if (etatCoffre.statut === 'ouvert' || etatCoffre.statut === 'verrouille') {
                            // 📭 seulement si tous les slots pris ET l'or pris
                            const slots = Object.values(etatCoffre.loot?.slots || {});
                            const toutSlotsPris = slots.length === 0 || slots.every(s => !!s.pris_par);
                            const orVal = etatCoffre.loot?.or || 0;
                            const orPris = orVal === 0 || Object.keys(etatCoffre.or_pris || {}).length > 0;
                            div.innerHTML = (toutSlotsPris && orPris) ? '📭' : '📦';
                        } else {
                            div.innerHTML = '📦';
                        }
                    }
                    // Pièges : visibles seulement si détecté par ce joueur ou partagé
                    else if (cell.event.type === 'piege' && !cell.event.declenche) {
                        const detecte = data.pieges_detectes?.[key]?.[myID];
                        const partage = data.pieges_partages?.[key];
                        if (detecte || partage) div.innerHTML = '🪤';
                    }
                    // Rencontres, découvertes : cachés jusqu'au déclenchement
                }
            }

            // Position du joueur
            if (isMyPos) {
                div.innerHTML = `<span style="position:absolute;font-size:${Math.max(12,cellPx-4)}px;">👤</span>`;
                div.style.background = '#1a3a1a';
            } else {
                // Autres joueurs dans la zone visible
                const autres = Object.entries(data.positions || {})
                    .filter(([id, pos]) => id !== myID && pos.x === x && pos.y === y);
                if (autres.length > 0 && isVisible) {
                    div.innerHTML = `<span style="font-size:${Math.max(10,cellPx-6)}px;">🧑</span>`;
                }
            }

            container.appendChild(div);
        }
    }
}

// ── Effets de statut (poison, étourdi…) ─────────────────────

/**
 * Appliqué une fois au début du tour du joueur.
 * Tick du poison — si duree tombe à 0, supprime l'effet.
 */
function _appliquerEffetsDebutTour(myID) {
    const p = window.perso;
    if (!p) return;

    // Poison : lire depuis Firebase, appliquer dégâts directement (bypass armure — c'est du poison interne)
    db.ref('parties/' + sessionActuelle + '/joueurs/' + myID + '/effets/poison').once('value', snap => {
        const poison = snap.val();
        if (!poison) return;
        const { degats, duree } = poison;

        // Résistance au poison (bonusInnes) — pas d'armure physique
        let dmg = degats;
        const resP = p.bonusInnes?.resPoison || 0;
        if (resP !== 0) dmg = Math.max(0, Math.round(dmg * (1 - resP / 100)));

        if (dmg > 0) {
            const pvAvant = p.pvActuel || 0;
            let msg;
            if (pvAvant - dmg <= 0) {
                // Le poison ne peut pas tuer : surplus sur la FT
                const pvAbsorbables = pvAvant - 1;
                const surplus = dmg - pvAbsorbables;
                p.pvActuel = 1;
                p.ftActuel = Math.max(0, (p.ftActuel || 0) - surplus);
                msg = `☠️ Poison : −${pvAbsorbables} PV, −${surplus} FT (${duree} tour(s) restant(s))`;
            } else {
                p.pvActuel = pvAvant - dmg;
                msg = `☠️ Poison : −${dmg} PV (${duree} tour(s) restant(s))`;
            }
            if (typeof _toast === 'function') _toast(msg, 'error');
            _logDonjon(`${msg} — ${p.nom}`);
            if (typeof autoSave === 'function') autoSave();
            if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
        }

        if (duree <= 1) {
            snap.ref.remove();
            if (typeof _toast === 'function') _toast('✅ L\'effet de poison est dissipé.', 'info');
        } else {
            snap.ref.update({ duree: duree - 1 });
        }
    });
}

// ── Panneau d'actions ────────────────────────────────────────

function _afficherPanneauDonjon(data) {
    const panel  = document.getElementById('donjon-actions');
    const statut = document.getElementById('donjon-statut');
    if (!panel) return;

    // Pause MJ
    if (data.pause) {
        if (statut) { statut.textContent = '⏸ En pause…'; statut.style.color = '#f0b429'; }
        panel.innerHTML = '<div style="text-align:center;color:#f0b429;font-size:0.88em;padding:8px;border:1px solid #5a4a00;border-radius:5px;background:#1a1400;">⏸ Le MJ a mis le jeu en pause.</div>';
        return;
    }

    const myID   = (window.perso?.nom || '').replace(/\s+/g, '_');
    const ordre  = data.ordre_joueurs || [];
    const tourIdx = Math.max(0, (data.tour_actuel || 0) % Math.max(1, ordre.length));
    const nomTour    = ordre[tourIdx] || '?';
    const estTourCompagnon = nomTour.startsWith('cmp_');
    const estMonTour = ordre[tourIdx] === myID;

    if (statut) {
        if (estTourCompagnon) {
            statut.textContent = `🐾 Tour du compagnon de ${nomTour.slice(4)}…`;
            statut.style.color = '#d4af37';
        } else {
            statut.textContent = estMonTour ? "⚔ C'est votre tour !" : `Tour de ${nomTour}…`;
            statut.style.color = estMonTour ? '#4caf50' : '#888';
        }
    }

    if (estTourCompagnon) {
        panel.innerHTML = '<div style="text-align:center;color:#888;font-size:0.85em;padding:8px;">Géré par le MJ.</div>';
        return;
    }

    if (!estMonTour) { panel.innerHTML = ''; return; }

    // Appliquer les effets de début de tour (poison, etc.) une seule fois par tour
    const tourActuel = data.tour_actuel || 0;
    if (window._dernierTourEffets !== tourActuel) {
        window._dernierTourEffets = tourActuel;
        _appliquerEffetsDebutTour(myID);
    }

    panel.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(3,46px);gap:6px;justify-content:center;margin:10px auto 6px;">
            <div></div>
            <button onclick="deplacerJoueur(0,-1)" style="${_styleBtnDonjon()}">↑</button>
            <div></div>
            <button onclick="deplacerJoueur(-1,0)" style="${_styleBtnDonjon()}">←</button>
            <div style="width:46px;height:46px;display:flex;align-items:center;justify-content:center;color:#d4af37;font-size:1.4em;">📍</div>
            <button onclick="deplacerJoueur(1,0)"  style="${_styleBtnDonjon()}">→</button>
            <div></div>
            <button onclick="deplacerJoueur(0,1)"  style="${_styleBtnDonjon()}">↓</button>
            <div></div>
        </div>
        <button onclick="passerTourDonjon()" style="background:#222;color:#666;border:1px solid #444;padding:5px 18px;border-radius:4px;cursor:pointer;font-size:0.82em;margin-top:4px;">⏭ Passer le tour</button>
    `;

    // Bouton "Interagir" si la case actuelle a un coffre ou une porte
    const maPos   = data.positions?.[myID];
    if (maPos) {
        const ck   = `${maPos.x}_${maPos.y}`;
        const cell = data.grille?.[ck];
        if (cell?.event?.type === 'coffre') {
            panel.innerHTML += `<button onclick="_initCoffreDonjon('${ck}', ${JSON.stringify(cell.event).replace(/"/g, '&quot;')})" style="background:#2a1a0a;color:#d4af37;border:1px solid #8b6914;padding:5px 18px;border-radius:4px;cursor:pointer;font-size:0.82em;margin-top:4px;">📦 Ouvrir le coffre</button>`;
        } else if (cell?.event?.type === 'porte' && !cell.event.declenche) {
            panel.innerHTML += `<button onclick="_interagirPorteDonjon('${ck}', {x:${maPos.x},y:${maPos.y}}, ${JSON.stringify(cell.event).replace(/"/g, '&quot;')}, '${myID}', window.donjonActif)" style="background:#2a1a0a;color:#d4af37;border:1px solid #8b6914;padding:5px 18px;border-radius:4px;cursor:pointer;font-size:0.82em;margin-top:4px;">🚪 Interagir avec la porte</button>`;
        }
    }
}

function _styleBtnDonjon() {
    return 'width:46px;height:46px;background:#2a1a0a;color:#d4af37;border:1px solid #8b6914;border-radius:6px;cursor:pointer;font-size:1.3em;';
}

// ── Log ──────────────────────────────────────────────────────

function _afficherLogDonjon(data) {
    const logEl = document.getElementById('donjon-log');
    if (!logEl) return;
    const entrees = Object.values(data.log || {})
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, 8);
    logEl.innerHTML = entrees.length === 0
        ? '<span style="color:#555;font-size:0.8em;">Aucune action.</span>'
        : entrees.map(e => `<div style="color:#aaa;font-size:0.8em;padding:2px 0;">${e.texte}</div>`).join('');
}

// ── Déplacement ──────────────────────────────────────────────

function deplacerJoueur(dx, dy) {
    const data = window.donjonActif;
    if (!data) return;
    if (data.pause) {
        if (typeof _toast === 'function') _toast('⏸ Le MJ a mis le jeu en pause.', 'info');
        return;
    }

    const myID  = (window.perso?.nom || '').replace(/\s+/g, '_');
    const maPos = data.positions?.[myID] || { x: 1, y: 1 };
    const nx = maPos.x + dx;
    const ny = maPos.y + dy;

    if (nx < 0 || nx >= (data.largeur || 10) || ny < 0 || ny >= (data.hauteur || 8)) return;

    const cellKey = `${nx}_${ny}`;
    const cell    = data.grille?.[cellKey];

    if (!cell || cell.type === 'mur') {
        if (typeof _toast === 'function') _toast('🧱 Passage bloqué.', 'error');
        return;
    }

    // Porte non encore déclenchée : gestion async (verrou + clef + durabilité)
    if (cell.event?.type === 'porte' && !cell.event?.declenche) {
        _interagirPorteDonjon(cellKey, { x: nx, y: ny }, cell.event, myID, data);
        return;
    }

    // Piège non déclenché : vérifier si détecté → modal de choix
    if (cell.event?.type === 'piege' && !cell.event?.declenche) {
        const detecte = data.pieges_detectes?.[cellKey]?.[myID];
        const partage = data.pieges_partages?.[cellKey];
        if (detecte || partage) {
            _afficherModalPiegeDetecte(cellKey, cell.event, { nx, ny, dx, dy }, myID, data);
            return;
        }
    }

    // Déplacement normal + déclenchement des autres événements
    db.ref('parties/' + sessionActuelle + '/donjon_actif/positions/' + myID).set({ x: nx, y: ny });
    if (typeof _incStatPartie === 'function') _incStatPartie('cases_parcourues', 1);
    if (cell.event) {
        if (cell.event.type === 'coffre') {
            // Le coffre est toujours interactable — _initCoffreDonjon gère l'état async
            _initCoffreDonjon(cellKey, cell.event);
        } else if (!cell.event.declenche) {
            _declencherEvenementDonjon(cellKey, cell.event, myID);
        }
    }
    _avancerTourDonjon(data);
    // Vérifier détection de pièges dans la zone visible après déplacement
    setTimeout(() => _verifierDetectionPieges(window.donjonActif, myID), 300);
}

// ── Portes (verrou + clef + durabilité) ─────────────────────

/**
 * Contexte de la porte en cours d'interaction.
 * Stocké en window pour être accessible depuis les callbacks onclick.
 */
window._donjonPorteCtx = null;

function _interagirPorteDonjon(cellKey, pos, eventCell, myID, data) {
    const ref = db.ref('parties/' + sessionActuelle + '/donjon_actif/etats_portes/' + cellKey);
    ref.once('value', snap => {
        let etat = snap.val();

        if (!etat) {
            // Initialiser l'état de la porte
            const cleRequise    = eventCell.data?.cleRequise || null;
            const verrouillée   = cleRequise ? true : (Math.random() * 100 < (eventCell.data?.probVerrou ?? 30));
            const durabiliteMax = Math.min(100, Math.max(10, eventCell.data?.durabilite || 30));
            etat = {
                statut:        verrouillée ? 'verrouillee' : 'ouverte',
                cleRequise:    cleRequise,
                durabilite:    verrouillée ? durabiliteMax : 0,
                durabiliteMax: durabiliteMax,
            };
            ref.set(etat);
        }

        if (etat.statut !== 'verrouillee') {
            // Porte ouverte ou cassée → passage libre
            _passerPorte(cellKey, pos, myID, data);
        } else {
            if (typeof _toast === 'function') _toast('🔒 Porte verrouillée !', 'error');
            window._donjonPorteCtx = { cellKey, pos, myID, data };
            _afficherModalPorte(cellKey, etat);
        }
    });
}

/** Le joueur franchit la porte : met à jour position + marque déclenché + avance le tour. */
function _passerPorte(cellKey, pos, myID, data) {
    _logDonjon(`🚪 ${window.perso?.nom} passe une porte.`);
    db.ref('parties/' + sessionActuelle + '/donjon_actif/grille/' + cellKey + '/event/declenche').set(true);
    db.ref('parties/' + sessionActuelle + '/donjon_actif/positions/' + myID).set(pos);
    _avancerTourDonjon(data);
}

/** Modal d'interaction avec une porte verrouillée. */
function _afficherModalPorte(cellKey, etat) {
    let modal = document.getElementById('modal-donjon-porte');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-donjon-porte';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }

    const DX          = (window.perso?.statsBase?.DX ?? 8) + (window.perso?.statsInvesties?.DX || 0);
    const crochetage  = window.perso?.compInvesties?.crochetage || 0;
    const chanceCroch = Math.min(95, DX * 3 + crochetage * 5);
    const myID        = (window.perso?.nom || '').replace(/\s+/g, '_');
    const cleRequise  = etat.cleRequise;
    const aLaClef     = cleRequise && !!(window.donjonActif?.cles_joueurs?.[myID]?.[cleRequise]);

    const durCoul = etat.durabilite > etat.durabiliteMax * 0.5 ? '#4caf50'
                  : etat.durabilite > etat.durabiliteMax * 0.2 ? '#f0b429' : '#ff4444';

    // Bloc clef
    let clefHtml = '';
    if (cleRequise) {
        clefHtml = `<div style="background:#1a1408;border:1px solid #8b6914;padding:6px 10px;border-radius:5px;margin-bottom:10px;font-size:0.85em;">
            🗝 Nécessite : <strong style="color:#d4af37;">${cleRequise}</strong>
            ${aLaClef
                ? `<br><button onclick="_utiliserClefPorte('${cellKey}')" style="margin-top:6px;width:100%;background:#2a1a0a;color:#d4af37;border:1px solid #8b6914;padding:6px;border-radius:4px;cursor:pointer;">🗝 Utiliser la clef</button>`
                : `<div style="color:#666;margin-top:4px;">Vous n'avez pas cette clef.</div>`}
        </div>`;
    }

    // Bouton frapper
    const armeInfo = _getArmeEquipeeDonjon();
    let labelFrapper, sousTitreFrapper;
    if (armeInfo) {
        const dmgParts   = String(armeInfo.def.degats).split('-');
        const dmgMax     = parseInt(dmgParts[dmgParts.length - 1]) || 3;
        const durArme    = armeInfo.slotObj.durabilite ?? '?';
        labelFrapper     = `🪓 Enfoncer avec ${armeInfo.def.nom}`;
        sousTitreFrapper = `Porte −${dmgMax} dur. max · Arme −2 à 4 dur. (actuelle : ${durArme})`;
    } else {
        labelFrapper     = '🤛 Enfoncer à mains nues';
        sousTitreFrapper = 'Porte −1 à 3 dur. · Vous perdez 1 à 3 PV';
    }

    modal.innerHTML = `
        <div style="background:#1a120a;border:2px solid #d4af37;border-radius:10px;padding:20px;max-width:340px;width:90%;">
            <h3 style="color:#d4af37;margin:0 0 12px;">🔒 Porte verrouillée</h3>
            ${clefHtml}
            <div style="color:#aaa;font-size:0.85em;margin-bottom:12px;">
                Durabilité :
                <strong style="color:${durCoul};">${etat.durabilite} / ${etat.durabiliteMax}</strong>
                <div style="height:6px;background:#222;border-radius:3px;margin-top:4px;overflow:hidden;">
                    <div style="height:100%;width:${Math.round(etat.durabilite/etat.durabiliteMax*100)}%;background:${durCoul};"></div>
                </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px;">
                <button onclick="_crochetagePorte('${cellKey}')" style="background:#0d1a0d;color:#4caf50;border:1px solid #2a5a2a;padding:9px 12px;border-radius:5px;cursor:pointer;text-align:left;">
                    🔓 Crocheter
                    <span style="color:#666;font-size:0.8em;display:block;">Chance : ${chanceCroch}% (DX ${DX} + crochetage ${crochetage})</span>
                </button>
                <button onclick="_frapperPorte('${cellKey}')" style="background:#1a0d0d;color:#ff9800;border:1px solid #5a2a0d;padding:9px 12px;border-radius:5px;cursor:pointer;text-align:left;">
                    ${labelFrapper}
                    <span style="color:#666;font-size:0.8em;display:block;">${sousTitreFrapper}</span>
                </button>
                ${(_getItemsExplosifsDonjon().length > 0 || _getSortsOffensifsInvestis().length > 0) ? `<button onclick="_ouvrirModalExplosifSurTarget('${cellKey}','porte')" style="background:#1a0d00;color:#ff6b00;border:1px solid #5a3000;padding:9px 12px;border-radius:5px;cursor:pointer;text-align:left;">
                    💥 Utiliser item / sort
                    <span style="color:#666;font-size:0.8em;display:block;">Grenade, dynamite, boule de feu…</span>
                </button>` : ''}
            </div>
            <button onclick="document.getElementById('modal-donjon-porte').remove()" style="width:100%;background:#222;color:#666;border:1px solid #444;padding:7px;border-radius:4px;cursor:pointer;">Fermer (sans avancer le tour)</button>
        </div>`;
    modal.style.display = 'flex';
}

/** Utilise la clef requise pour ouvrir la porte et passer. */
function _utiliserClefPorte(cellKey) {
    const ctx = window._donjonPorteCtx;
    if (!ctx) return;
    const ref = db.ref('parties/' + sessionActuelle + '/donjon_actif/etats_portes/' + cellKey);
    document.getElementById('modal-donjon-porte')?.remove();
    _logDonjon(`🗝 ${window.perso?.nom} utilise une clef pour ouvrir la porte.`);
    if (typeof _toast === 'function') _toast('🗝 Porte ouverte !', 'success');
    ref.update({ statut: 'ouverte' }).then(() => {
        _passerPorte(cellKey, ctx.pos, ctx.myID, ctx.data);
    });
}

/** Tentative de crochetage de la porte. Succès → passage immédiat. */
function _crochetagePorte(cellKey) {
    const ctx        = window._donjonPorteCtx;
    const DX         = (window.perso?.statsBase?.DX ?? 8) + (window.perso?.statsInvesties?.DX || 0);
    const crochetage = window.perso?.compInvesties?.crochetage || 0;
    const chance     = Math.min(95, DX * 3 + crochetage * 5);
    const roll       = Math.floor(Math.random() * 100);
    const ref        = db.ref('parties/' + sessionActuelle + '/donjon_actif/etats_portes/' + cellKey);
    const nom        = window.perso?.nom || '?';
    document.getElementById('modal-donjon-porte')?.remove();

    if (roll < chance) {
        if (typeof _toast === 'function') _toast(`🔓 Porte crochetée ! (${roll}/${chance}%)`, 'success');
        _logDonjon(`🔓 ${nom} crochète une porte (${roll}/${chance}%).`);
        ref.update({ statut: 'ouverte' }).then(() => {
            if (ctx) _passerPorte(cellKey, ctx.pos, ctx.myID, ctx.data);
        });
    } else {
        if (typeof _toast === 'function') _toast(`❌ Crochetage échoué (${roll}/${chance}%).`, 'error');
        _logDonjon(`❌ ${nom} échoue à crocheter une porte (${roll}/${chance}%).`);
        if (ctx) _avancerTourDonjon(ctx.data);
    }
}

/** Frappe la porte avec calcul de coup (crits inclus). */
function _frapperPorte(cellKey) {
    const ctx      = window._donjonPorteCtx;
    const armeInfo = _getArmeEquipeeDonjon();
    const nom      = window.perso?.nom || '?';
    const myID     = (window.perso?.nom || '').replace(/\s+/g, '_');
    const ref      = db.ref('parties/' + sessionActuelle + '/donjon_actif/etats_portes/' + cellKey);
    const coup     = _calculerCoupDonjon(armeInfo);
    const nomArme  = armeInfo ? armeInfo.def.nom : 'Poings';
    document.getElementById('modal-donjon-porte')?.remove();

    // Feedback selon le résultat
    if (coup.resultat === 'echec_critique') {
        const blessure = Math.floor(Math.random() * 4) + 1;
        if (typeof _toast === 'function') _toast(`💀 Échec critique ! Vous vous blessez (−${blessure} PV) !`, 'error');
        _logDonjon(`💀 ${nom} : échec critique sur la porte (−${blessure} PV).`);
        db.ref('parties/' + sessionActuelle + '/joueurs/' + myID + '/modif_stat').set({ stat: 'PV', valeur: -blessure, timestamp: Date.now() });
        if (ctx) _avancerTourDonjon(ctx.data);
        return;
    }
    if (coup.resultat === 'succes_critique') {
        if (typeof _toast === 'function') _toast(`🌟 Coup critique ! ${coup.dmg} dégâts !`, 'success');
    } else if (coup.resultat === 'echec') {
        if (typeof _toast === 'function') _toast(`❌ Coup manqué (${coup.roll}/${coup.baseChance}%).`, 'error');
        if (ctx) _avancerTourDonjon(ctx.data);
        return;
    }

    // Usure de l'arme
    if (armeInfo) {
        const perteArme = coup.resultat === 'succes_critique' ? Math.floor(Math.random() * 3) + 3 : Math.floor(Math.random() * 3) + 2;
        const slotObj   = armeInfo.slotObj;
        if (slotObj.durabilite !== undefined) {
            slotObj.durabilite = Math.max(0, (slotObj.durabilite || 0) - perteArme);
            if (typeof _toast === 'function') {
                slotObj.durabilite === 0
                    ? _toast(`🔨 ${nomArme} est brisée !`, 'error')
                    : _toast(`🔧 ${nomArme} : −${perteArme} dur. (reste ${slotObj.durabilite})`, 'info');
            }
            if (typeof autoSave === 'function') autoSave();
        }
    } else {
        const pertePV = Math.floor(Math.random() * 3) + 1;
        if (typeof _toast === 'function') _toast(`🤛 Vous vous blessez en enfonçant la porte (−${pertePV} PV) !`, 'error');
        _logDonjon(`🤛 ${nom} se blesse à mains nues (−${pertePV} PV).`);
        db.ref('parties/' + sessionActuelle + '/joueurs/' + myID + '/modif_stat').set({ stat: 'PV', valeur: -pertePV, timestamp: Date.now() });
    }

    ref.once('value', snap => {
        const etat = snap.val();
        if (!etat) return;
        const nouvDura = Math.max(0, etat.durabilite - coup.dmg);
        _logDonjon(`🪓 ${nom} frappe la porte avec ${nomArme} — ${coup.resultat} (${coup.roll}/${coup.baseChance}%) : −${coup.dmg} dur. → reste ${nouvDura}/${etat.durabiliteMax}.`);
        if (nouvDura <= 0) {
            if (typeof _toast === 'function') _toast('💥 La porte est enfoncée !', 'success');
            ref.update({ durabilite: 0, statut: 'cassee' });
        } else {
            if (typeof _toast === 'function') _toast(`🪓 Porte endommagée (${nouvDura}/${etat.durabiliteMax}).`, 'info');
            ref.update({ durabilite: nouvDura });
        }
    });
    if (ctx) _avancerTourDonjon(ctx.data);
}

function passerTourDonjon() {
    const data = window.donjonActif;
    if (!data) return;
    if (data.pause) {
        if (typeof _toast === 'function') _toast('⏸ Le MJ a mis le jeu en pause.', 'info');
        return;
    }
    _avancerTourDonjon(data);
}

function _avancerTourDonjon(data) {
    const ordre = data.ordre_joueurs || [];
    if (ordre.length === 0) return;
    let prochain = ((data.tour_actuel || 0) + 1) % ordre.length;

    // Vérifier si le prochain joueur est étourdi → sauter son tour et nettoyer l'effet
    const prochainID = ordre[prochain];
    if (prochainID && !prochainID.startsWith('cmp_')) {
        const effets = window.donjonActif?.joueurs?.[prochainID]?.effets;
        if (effets?.etourdi) {
            _logDonjon(`⚡ ${prochainID} est étourdi — son tour est sauté.`);
            db.ref('parties/' + sessionActuelle + '/joueurs/' + prochainID + '/effets/etourdi').remove();
            prochain = (prochain + 1) % ordre.length;
        }
    }

    db.ref('parties/' + sessionActuelle + '/donjon_actif/tour_actuel').set(prochain);
}

// ── Système de pièges ─────────────────────────────────────────

/**
 * Vérifie si le joueur détecte des pièges dans sa zone visible.
 * Appelé après chaque déplacement.
 */
function _verifierDetectionPieges(data, myID) {
    if (!data || !window.perso) return;
    const p         = window.perso;
    const detection = p.compInvesties?.detection_pieges || 0;
    if (detection === 0) return;

    const grille  = data.grille || {};
    const maPos   = data.positions?.[myID] || { x: 1, y: 1 };
    const visible = _calculerVisibilite(grille, data.largeur || 10, data.hauteur || 8, maPos.x, maPos.y, data.etats_portes);
    const range   = detection * 2; // niveau 1 = 2 cases, niveau 3 = 6 cases

    visible.forEach(key => {
        const cell = grille[key];
        if (!cell?.event || cell.event.type !== 'piege' || cell.event.declenche) return;
        if (data.pieges_detectes?.[key]?.[myID]) return; // déjà détecté

        // Vérifier portée
        const [cx, cy] = key.split('_').map(Number);
        const dist = Math.abs(cx - maPos.x) + Math.abs(cy - maPos.y);
        if (dist > range) return;

        // Calcul de détection : niveau * 15 + 10, modifié par la difficulté du piège
        const difficulte   = cell.event.data?.difficulte ?? 50;
        const chanceBase   = Math.min(95, detection * 15 + 10);
        const chanceFinale = Math.max(5, chanceBase - Math.floor((difficulte - 50) / 2));
        const roll         = Math.floor(Math.random() * 100) + 1;

        if (roll <= chanceFinale) {
            db.ref('parties/' + sessionActuelle + '/donjon_actif/pieges_detectes/' + key + '/' + myID).set(true);
            if (typeof _toast === 'function') _toast(`🔍 Vous repérez un piège à (${cx},${cy}) !`, 'warning');
            _logDonjon(`🔍 ${p.nom} détecte un piège en (${cx},${cy}).`);
        }
    });
}

/** Modal quand le joueur essaie de marcher sur un piège détecté. */
function _afficherModalPiegeDetecte(cellKey, event, moveParams, myID, data) {
    let modal = document.getElementById('modal-donjon-piege');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-donjon-piege';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }
    const desc       = event.data?.description || 'Piège !';
    const desarm     = window.perso?.compInvesties?.desarmorcage || 0;
    const chanceDesarm = Math.min(95, desarm * 15 + 10);
    const partage    = !!(data.pieges_partages?.[cellKey]);

    modal.innerHTML = `
        <div style="background:#1a0d0d;border:2px solid #ff4444;border-radius:10px;padding:20px;max-width:340px;width:90%;">
            <h3 style="color:#ff4444;margin:0 0 8px;">🪤 Piège détecté !</h3>
            <p style="color:#ccc;font-size:0.85em;margin:0 0 12px;">${desc}</p>
            <div style="display:flex;flex-direction:column;gap:8px;">
                ${desarm > 0 ? `<button onclick="_desarmorcer('${cellKey}')" style="background:#0d1a0d;color:#4caf50;border:1px solid #2a5a2a;padding:9px 12px;border-radius:5px;cursor:pointer;text-align:left;">
                    🔧 Tenter de désamorcer
                    <span style="color:#666;font-size:0.8em;display:block;">Chance : ${chanceDesarm}% · Éch. crit. : explosion !</span>
                </button>` : ''}
                <button onclick="_passerSurPiege('${cellKey}',${moveParams.nx},${moveParams.ny},'${myID}')" style="background:#2a0d0d;color:#ff9800;border:1px solid #5a2a0d;padding:9px 12px;border-radius:5px;cursor:pointer;text-align:left;">
                    ⚡ Traverser quand même
                    <span style="color:#666;font-size:0.8em;display:block;">Le piège se déclenchera !</span>
                </button>
                ${!partage ? `<button onclick="_partagerLocalisationPiege('${cellKey}')" style="background:#0d0d2a;color:#9c7fd4;border:1px solid #5c3a9d;padding:9px 12px;border-radius:5px;cursor:pointer;text-align:left;">
                    📍 Partager la localisation
                    <span style="color:#666;font-size:0.8em;display:block;">Tous les joueurs verront ce piège.</span>
                </button>` : '<div style="color:#666;font-size:0.8em;">📍 Localisation déjà partagée.</div>'}
            </div>
            <button onclick="document.getElementById('modal-donjon-piege').remove()" style="width:100%;background:#222;color:#666;border:1px solid #444;padding:7px;border-radius:4px;cursor:pointer;margin-top:10px;">Rester sur place</button>
        </div>`;
    modal.style.display = 'flex';
}

/** Passe sur le piège en sachant ce que c'est. */
function _passerSurPiege(cellKey, nx, ny, myID) {
    document.getElementById('modal-donjon-piege')?.remove();
    const data = window.donjonActif;
    if (!data) return;
    db.ref('parties/' + sessionActuelle + '/donjon_actif/positions/' + myID).set({ x: nx, y: ny });
    const cell = data.grille?.[cellKey];
    if (cell?.event) _declencherEvenementDonjon(cellKey, cell.event, myID);
    _avancerTourDonjon(data);
}

/** Tente de désamorcer un piège. */
function _desarmorcer(cellKey) {
    document.getElementById('modal-donjon-piege')?.remove();
    const p    = window.perso;
    const nom  = p?.nom || '?';
    const myID = (p?.nom || '').replace(/\s+/g, '_');
    const data = window.donjonActif;
    if (!data || !p) return;

    const desarm      = p.compInvesties?.desarmorcage || 0;
    const cell        = data.grille?.[cellKey];
    const difficulte  = cell?.event?.data?.difficulte ?? 50;
    const chanceBase  = Math.min(95, desarm * 15 + 10);
    const chanceFinale = Math.max(5, chanceBase - Math.floor((difficulte - 50) / 2));
    const roll        = Math.floor(Math.random() * 100) + 1;

    if (roll >= 96) {
        // Échec critique : le piège explose sur le joueur
        if (typeof _toast === 'function') _toast('💥 Échec critique ! Le piège explose !', 'error');
        _logDonjon(`💥 ${nom} : échec critique lors du désarmorcage — piège déclenché !`);
        if (cell?.event) _declencherEvenementDonjon(cellKey, cell.event, myID);
    } else if (roll <= Math.max(1, Math.floor(chanceFinale / 5))) {
        // Succès critique : items récupérés
        const itemsGagnes = ['ressort', 'morceau_de_fer', 'rouage'].filter(() => Math.random() > 0.4);
        if (typeof _toast === 'function') _toast(`🌟 Désarmorcage parfait ! Vous récupérez des composants.`, 'success');
        _logDonjon(`🌟 ${nom} désamorce parfaitement le piège et récupère des composants.`);
        itemsGagnes.forEach(id => {
            if (typeof itemsData !== 'undefined' && itemsData[id] && p.inventaire) {
                const idx = p.inventaire.findIndex(i => i.id === id);
                if (idx !== -1) p.inventaire[idx].quantite = (p.inventaire[idx].quantite || 1) + 1;
                else p.inventaire.push({ id, quantite: 1 });
            }
        });
        db.ref('parties/' + sessionActuelle + '/donjon_actif/grille/' + cellKey + '/event/declenche').set(true);
        if (typeof autoSave === 'function') autoSave();
    } else if (roll <= chanceFinale) {
        // Succès : piège désarmorcé
        if (typeof _toast === 'function') _toast(`✅ Piège désarmorcé ! (${roll}/${chanceFinale}%)`, 'success');
        _logDonjon(`✅ ${nom} désamorce le piège (${roll}/${chanceFinale}%).`);
        db.ref('parties/' + sessionActuelle + '/donjon_actif/grille/' + cellKey + '/event/declenche').set(true);
    } else {
        // Échec : rien ne se passe, tour perdu
        if (typeof _toast === 'function') _toast(`❌ Désarmorcage échoué (${roll}/${chanceFinale}%).`, 'error');
        _logDonjon(`❌ ${nom} échoue à désamorcer le piège (${roll}/${chanceFinale}%).`);
    }

    _avancerTourDonjon(data);
}

/** Partage la localisation d'un piège à tous les joueurs. */
function _partagerLocalisationPiege(cellKey) {
    document.getElementById('modal-donjon-piege')?.remove();
    db.ref('parties/' + sessionActuelle + '/donjon_actif/pieges_partages/' + cellKey).set(true);
    if (typeof _toast === 'function') _toast('📍 Localisation du piège partagée !', 'success');
    _logDonjon(`📍 ${window.perso?.nom} partage la localisation d'un piège.`);
}

// ── Événements ───────────────────────────────────────────────

function _declencherEvenementDonjon(cellKey, event, myID) {
    const type = event.type;
    const nom  = window.perso?.nom || '?';

    // Le coffre gère son propre cycle (verrouillé / cassé / ouvert)
    if (type === 'coffre') {
        _initCoffreDonjon(cellKey, event);
        return;
    }

    // Tous les autres types : marquer comme déclenché immédiatement
    db.ref('parties/' + sessionActuelle + '/donjon_actif/grille/' + cellKey + '/event/declenche').set(true);

    if (type === 'piege') {
        const degats    = event.data?.degats    || 5;
        const typeDegat = event.data?.type_degat || 'normal';
        const desc      = event.data?.description || 'Piège !';

        const emojiDegat = { poison: '☠️', feu: '🔥', elec: '⚡', normal: '🪤' }[typeDegat] || '🪤';
        if (typeof _toast === 'function') _toast(`${emojiDegat} ${desc} — −${degats} PV !`, 'error');
        _logDonjon(`${emojiDegat} ${nom} déclenche un piège [${typeDegat}] — −${degats} PV.`);

        // Dégâts PV directs
        db.ref('parties/' + sessionActuelle + '/joueurs/' + myID + '/modif_stat').set({
            stat: 'PV', valeur: -degats, timestamp: Date.now()
        });

        // Effets secondaires selon le type
        if (typeDegat === 'poison') {
            const pvPoison = Math.max(1, Math.floor(degats / 2));
            db.ref('parties/' + sessionActuelle + '/joueurs/' + myID + '/effets/poison').set({
                degats: pvPoison,
                duree: 3,
                timestamp: Date.now()
            });
            if (typeof _toast === 'function') _toast('☠️ Vous êtes empoisonné ! (−' + pvPoison + ' PV/tour × 3 tours)', 'error');
            _logDonjon(`☠️ ${nom} est empoisonné (${pvPoison} PV/tour pendant 3 tours).`);

        } else if (typeDegat === 'elec') {
            db.ref('parties/' + sessionActuelle + '/joueurs/' + myID + '/effets/etourdi').set({
                duree: 1,
                timestamp: Date.now()
            });
            if (typeof _toast === 'function') _toast('⚡ Choc électrique ! Vous êtes étourdi pour 1 tour.', 'error');
            _logDonjon(`⚡ ${nom} est étourdi (saute le prochain tour).`);

        } else if (typeDegat === 'feu') {
            // Feu : dégâts majorés — les brûlures comptent double
            const brulures = Math.max(1, Math.floor(degats / 2));
            db.ref('parties/' + sessionActuelle + '/joueurs/' + myID + '/modif_stat').set({
                stat: 'PV', valeur: -brulures, timestamp: Date.now() + 1
            });
            if (typeof _toast === 'function') _toast('🔥 Vous brûlez ! Dégâts supplémentaires de brûlure (−' + brulures + ' PV).', 'error');
            _logDonjon(`🔥 ${nom} brûle — dégâts de brûlure supplémentaires (${brulures} PV).`);
        }

    } else if (type === 'coffre') {
        _initCoffreDonjon(cellKey, event);
        return; // gestion async, pas de marquage immédiat

    } else if (type === 'decouverte') {
        const texte = event.data?.texte || 'Découverte !';
        if (typeof _toast === 'function') _toast(`🔎 ${texte}`, 'info');
        _logDonjon(`🔎 ${nom} découvre : ${texte}`);
        _afficherDecouverteDonjon(texte);

    } else if (type === 'rencontre') {
        const desc = event.data?.description || 'Des ennemis apparaissent !';
        if (typeof _toast === 'function') _toast(`👹 ${desc}`, 'error');
        _logDonjon(`👹 ${nom} déclenche une rencontre : ${desc}`);
        // Mettre le jeu en pause et notifier le MJ via Firebase
        const refDonjon = db.ref('parties/' + sessionActuelle + '/donjon_actif');
        refDonjon.child('pause').set(true);
        refDonjon.child('rencontre_en_attente').set({
            cellKey,
            ennemisKeys: event.data?.ennemisKeys || [],
            description: desc,
            declenchePar: nom,
            timestamp: Date.now()
        });

    } else if (type === 'porte') {
        _logDonjon(`🚪 ${nom} passe une porte.`);
    }
}

// ── Coffre (verrou + durabilité) ─────────────────────────────

/**
 * Première interaction avec un coffre.
 * Initialise l'état dans Firebase si pas encore fait, puis ouvre le modal.
 */
function _initCoffreDonjon(cellKey, eventData) {
    const ref = db.ref('parties/' + sessionActuelle + '/donjon_actif/etats_coffres/' + cellKey);
    ref.once('value', snap => {
        if (snap.val()) {
            _afficherModalCoffre(cellKey, snap.val());
            return;
        }
        // Première fois : rouler le verrou, générer le loot (1 slot par joueur)
        const probVerrou    = eventData.data?.probVerrou ?? 30;
        const durabiliteMax = Math.max(1, eventData.data?.durabilite || 20);
        const verrouille    = Math.random() * 100 < probVerrou;
        const positions     = window.donjonActif?.positions || {};
        const nbJoueurs     = Object.keys(positions).filter(id => !id.startsWith('cmp_')).length;
        const loot          = _genererLootCoffre(nbJoueurs);

        const etat = {
            verrouille,
            durabilite:    verrouille ? durabiliteMax : 0,
            durabiliteMax: durabiliteMax,
            statut:        verrouille ? 'verrouille' : 'ouvert',
            loot
        };

        ref.set(etat).then(() => {
            if (!verrouille) {
                _logDonjon(`📦 ${window.perso?.nom} ouvre un coffre.`);
                if (typeof _toast === 'function') _toast('📦 Coffre ouvert !', 'success');
            } else {
                _logDonjon(`🔒 ${window.perso?.nom} découvre un coffre verrouillé.`);
                if (typeof _toast === 'function') _toast('🔒 Coffre verrouillé !', 'error');
            }
            _afficherModalCoffre(cellKey, etat);
        });
    });
}

/**
 * Génère le loot d'un coffre : un slot par joueur présent dans le donjon.
 * Structure : { slots: { "0": {id,nom,pris_par:null}, ... }, or: N }
 */
function _genererLootCoffre(nbJoueurs) {
    if (typeof itemsData === 'undefined') return { slots: {}, or: 0 };
    const lootables = Object.entries(itemsData).filter(([, v]) => v.lootable);
    const nb     = Math.max(1, nbJoueurs || 1);
    const slots  = {};
    for (let i = 0; i < nb; i++) {
        if (lootables.length === 0) break;
        const [id, item] = lootables[Math.floor(Math.random() * lootables.length)];
        slots[String(i)] = { id, nom: item.nom, pris_par: null };
    }
    const or = Math.floor(Math.random() * 50) + 10;
    return { slots, or };
}

/** Retourne l'arme équipée en mêlée (slot main_droite / deux_mains / main_gauche) ou null. */
/**
 * Retourne { slotNom, slotObj, def } pour l'arme équipée en mêlée,
 * ou null si aucune arme avec des dégâts n'est portée.
 */
function _getArmeEquipeeDonjon() {
    if (!window.perso || typeof itemsData === 'undefined') return null;
    const eq = window.perso.equipement || {};
    const slotNom = eq.main_droite ? 'main_droite' : eq.deux_mains ? 'deux_mains' : eq.main_gauche ? 'main_gauche' : null;
    if (!slotNom) return null;
    const slotObj = eq[slotNom];
    const def = itemsData[slotObj?.id];
    return (def && def.degats) ? { slotNom, slotObj, def } : null;
}

// ── Calcul de coup (crits) ───────────────────────────────────

/**
 * Calcule un coup sur coffre/porte.
 * Retourne { roll, baseChance, resultat, dmg }
 * resultat : 'succes_critique' | 'succes' | 'echec' | 'echec_critique'
 */
function _calculerCoupDonjon(armeInfo) {
    const p = window.perso;
    const FO = (p?.statsBase?.FO || 5) + (p?.statsInvesties?.FO || 0);
    const baseChance = Math.min(90, FO * 5);
    const roll = Math.floor(Math.random() * 100) + 1;
    let dmgBase;
    if (armeInfo) {
        const parts = String(armeInfo.def.degats).split('-');
        const dMin  = parseInt(parts[0]) || 1;
        const dMax  = parseInt(parts[parts.length - 1]) || 3;
        dmgBase = dMin + Math.floor(Math.random() * (dMax - dMin + 1));
    } else {
        dmgBase = Math.floor(Math.random() * 3) + 1;
    }
    let resultat, dmg;
    if (roll >= 96) {
        resultat = 'echec_critique'; dmg = 0;
    } else if (roll <= Math.max(1, Math.floor(baseChance / 5))) {
        resultat = 'succes_critique'; dmg = dmgBase * 2;
    } else if (roll <= baseChance) {
        resultat = 'succes'; dmg = dmgBase;
    } else {
        resultat = 'echec'; dmg = 0;
    }
    return { roll, baseChance, resultat, dmg };
}

// ── Items/sorts explosifs sur coffre/porte ───────────────────

/** Retourne les items de l'inventaire utilisables sur coffre/porte (explosifs, projectiles). */
function _getItemsExplosifsDonjon() {
    const p = window.perso;
    if (!p || typeof itemsData === 'undefined') return [];
    return (p.inventaire || []).filter(item => {
        if (!item || item.quantite <= 0) return false;
        const def = itemsData[item.id];
        return def && (def.explosion || def.degatsZone || (def.degats && !def.melee && def.consommable));
    }).map(item => ({ ...item, def: itemsData[item.id] }));
}

/** Retourne les sorts offensifs investis (avec dégâts). */
function _getSortsOffensifsInvestis() {
    const p = window.perso;
    if (!p || typeof magieData === 'undefined') return [];
    const magieInv = p.magieInvesties || {};
    const sorts = [];
    Object.entries(magieData).forEach(([ecole, ecoleData]) => {
        const niveauEcole = magieInv[ecole] || 0;
        if (!niveauEcole) return;
        (ecoleData.sorts || []).forEach(s => {
            if (s.degats && s.niv <= niveauEcole && !sorts.find(x => x.nom === s.nom)) {
                sorts.push({ ...s, ecole });
            }
        });
    });
    return sorts;
}

/**
 * Ouvre une modale pour choisir item/sort explosif, puis applique les dégâts à la cible.
 * targetType : 'coffre' | 'porte'
 */
function _ouvrirModalExplosifSurTarget(cellKey, targetType) {
    const items = _getItemsExplosifsDonjon();
    const sorts = _getSortsOffensifsInvestis();
    if (items.length === 0 && sorts.length === 0) {
        if (typeof _toast === 'function') _toast('Aucun item ou sort offensif disponible.', 'error');
        return;
    }

    let modal = document.getElementById('modal-donjon-explosif');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-donjon-explosif';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:10000;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }
    const btn = 'width:100%;background:#1a0d0d;color:#ff9800;border:1px solid #5a2a0d;padding:8px 12px;border-radius:5px;cursor:pointer;text-align:left;margin-bottom:5px;';
    let corps = '<div style="display:flex;flex-direction:column;gap:5px;">';
    items.forEach(item => {
        const dmgStr = item.def.degatsZone || item.def.degats || '?';
        corps += `<button onclick="_appliquerExplosifSurTarget('${cellKey}','${targetType}','item','${item.id}')" style="${btn}">
            💣 ${item.def.nom} ×${item.quantite} <span style="color:#666;font-size:0.8em;">Dégâts : ${dmgStr}</span>
        </button>`;
    });
    sorts.forEach(s => {
        corps += `<button onclick="_appliquerExplosifSurTarget('${cellKey}','${targetType}','sort','${s.nom}')" style="${btn}">
            🔥 ${s.nom} <span style="color:#666;font-size:0.8em;">Dégâts : ${s.degats}${s.cout ? ` · −${s.cout} FT` : ''}</span>
        </button>`;
    });
    corps += '</div>';

    modal.innerHTML = `
        <div style="background:#1a0d0d;border:2px solid #ff6b00;border-radius:10px;padding:20px;max-width:340px;width:90%;">
            <h3 style="color:#ff9800;margin:0 0 12px;">💥 Utiliser sur la ${targetType}</h3>
            ${corps}
            <button onclick="document.getElementById('modal-donjon-explosif').remove()" style="width:100%;background:#222;color:#666;border:1px solid #444;padding:7px;border-radius:4px;cursor:pointer;margin-top:8px;">Annuler</button>
        </div>`;
    modal.style.display = 'flex';
}

/** Applique les dégâts d'un item/sort à un coffre ou une porte. */
function _appliquerExplosifSurTarget(cellKey, targetType, sourceType, sourceId) {
    document.getElementById('modal-donjon-explosif')?.remove();
    document.getElementById('modal-donjon-coffre')?.remove();
    document.getElementById('modal-donjon-porte')?.remove();

    const p   = window.perso;
    const nom = p?.nom || '?';
    let dmg   = 0;
    let label = '';

    if (sourceType === 'item') {
        const def = typeof itemsData !== 'undefined' ? itemsData[sourceId] : null;
        if (!def) return;
        const dmgStr = def.degatsZone || def.degats || '5';
        const parts  = String(dmgStr).split('-');
        const dMin   = parseInt(parts[0]) || 1;
        const dMax   = parseInt(parts[parts.length - 1]) || dMin;
        dmg = dMin + Math.floor(Math.random() * (dMax - dMin + 1));
        label = def.nom;
        // Consommer l'item
        const idx = (p?.inventaire || []).findIndex(i => i.id === sourceId && i.quantite > 0);
        if (idx !== -1) {
            p.inventaire[idx].quantite--;
            if (p.inventaire[idx].quantite <= 0) p.inventaire.splice(idx, 1);
            if (typeof autoSave === 'function') autoSave();
        }
    } else if (sourceType === 'sort') {
        let sort = null;
        if (typeof magieData !== 'undefined') {
            Object.values(magieData).forEach(ec => ec.sorts?.forEach(s => { if (s.nom === sourceId) sort = s; }));
        }
        if (!sort) return;
        const ftCost = sort.cout || 0;
        if (ftCost > 0 && (p?.ftActuel || 0) < ftCost) {
            if (typeof _toast === 'function') _toast(`Pas assez de FT (${p.ftActuel}/${ftCost}).`, 'error');
            return;
        }
        if (ftCost > 0 && p) p.ftActuel = Math.max(0, (p.ftActuel || 0) - ftCost);
        const parts = String(sort.degats).split('-');
        const dMin  = parseInt(parts[0]) || 1;
        const dMax  = parseInt(parts[parts.length - 1]) || dMin;
        dmg   = dMin + Math.floor(Math.random() * (dMax - dMin + 1));
        label = sort.nom;
        if (typeof autoSave === 'function') autoSave();
    }

    if (dmg <= 0) return;
    _logDonjon(`💥 ${nom} utilise ${label} sur la ${targetType} (−${dmg} durabilité).`);
    if (typeof _toast === 'function') _toast(`💥 ${label} : −${dmg} durabilité !`, 'success');

    const refPath = targetType === 'coffre'
        ? 'parties/' + sessionActuelle + '/donjon_actif/etats_coffres/' + cellKey
        : 'parties/' + sessionActuelle + '/donjon_actif/etats_portes/' + cellKey;

    const ref = db.ref(refPath);
    ref.once('value', snap => {
        const etat = snap.val();
        if (!etat) return;
        const nouvDura = Math.max(0, etat.durabilite - dmg);
        if (nouvDura <= 0) {
            const nouveauStatut = targetType === 'coffre' ? 'casse' : 'cassee';
            if (typeof _toast === 'function') _toast(`💥 La ${targetType} est détruite !`, 'success');
            ref.update({ durabilite: 0, statut: nouveauStatut }).then(() => {
                db.ref('parties/' + sessionActuelle + '/donjon_actif/grille/' + cellKey + '/event/declenche').set(true);
                ref.once('value', s => {
                    if (targetType === 'coffre') _afficherModalCoffre(cellKey, s.val());
                    // porte : passage libre au prochain tour
                });
            });
        } else {
            ref.update({ durabilite: nouvDura }).then(() => {
                ref.once('value', s => {
                    if (targetType === 'coffre') _afficherModalCoffre(cellKey, s.val());
                    else _afficherModalPorte(cellKey, s.val());
                });
            });
        }
    });

    const data = window.donjonActif;
    if (data) _avancerTourDonjon(data);
}

/** Affiche le modal d'interaction avec le coffre (ouvert, verrouillé, cassé). */
function _afficherModalCoffre(cellKey, etat) {
    let modal = document.getElementById('modal-donjon-coffre');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-donjon-coffre';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }

    const myID  = (window.perso?.nom || '').replace(/\s+/g, '_');
    const ouvert = etat.statut === 'ouvert' || etat.statut === 'casse';
    let header, corps;

    if (ouvert) {
        header = etat.statut === 'casse' ? '📦💥 Coffre fracassé' : '📦 Coffre ouvert';
        const dejaPris = !!(etat.pris_par?.[myID]);

        if (dejaPris) {
            corps = `<div style="color:#888;font-size:0.9em;padding:10px 0;">Vous avez déjà récupéré un objet dans ce coffre.</div>`;
        } else {
            // Slots d'items
            const slots    = etat.loot?.slots || {};
            const slotsHtml = Object.entries(slots).map(([slotKey, slot]) => {
                if (slot.pris_par) {
                    return `<li style="color:#555;padding:3px 0;font-size:0.85em;">🎁 ${slot.nom} <em>(pris par ${slot.pris_par.replace(/_/g,' ')})</em></li>`;
                }
                return `<li style="color:#ccc;padding:3px 0;">🎁 ${slot.nom}
                    <button onclick="_prendreItemDonjon('${cellKey}','${slotKey}')" style="margin-left:8px;background:#2a1a0a;color:#d4af37;border:1px solid #8b6914;padding:2px 8px;border-radius:3px;cursor:pointer;font-size:0.8em;">Prendre</button>
                </li>`;
            }).join('') || '<li style="color:#666;">Vide.</li>';

            // Or
            const orVal  = etat.loot?.or || 0;
            const orPris = !!(etat.or_pris?.[myID]);
            const orHtml = orVal > 0 && !orPris
                ? `<div style="color:#f0b429;margin:8px 0;">💰 ${orVal} pièces d'or
                    <button onclick="_prendreOrDonjon('${cellKey}')" style="margin-left:8px;background:#2a1a0a;color:#d4af37;border:1px solid #8b6914;padding:2px 8px;border-radius:3px;cursor:pointer;font-size:0.8em;">Prendre</button>
                   </div>`
                : orVal > 0 && orPris ? `<div style="color:#555;font-size:0.85em;margin-top:4px;">💰 Or déjà récupéré.</div>` : '';

            corps = `<ul style="list-style:none;padding:0;margin:0 0 6px;">${slotsHtml}</ul>${orHtml}`;
        }

    } else {
        // Coffre verrouillé
        header = '🔒 Coffre verrouillé';
        const DX         = (window.perso?.statsBase?.DX ?? 8) + (window.perso?.statsInvesties?.DX || 0);
        const crochetage = window.perso?.compInvesties?.crochetage || 0;
        const chanceCroch = Math.min(95, DX * 3 + crochetage * 5);
        const armeInfo   = _getArmeEquipeeDonjon();
        const durCoul    = etat.durabilite > etat.durabiliteMax * 0.5 ? '#4caf50'
                         : etat.durabilite > etat.durabiliteMax * 0.2 ? '#f0b429' : '#ff4444';
        const FO         = (window.perso?.statsBase?.FO || 5) + (window.perso?.statsInvesties?.FO || 0);

        let labelFrapper, sousTitreFrapper;
        if (armeInfo) {
            labelFrapper     = `🪓 Frapper avec ${armeInfo.def.nom}`;
            sousTitreFrapper = `Coup FO ${FO} (base ${Math.min(90,FO*5)}%) · Crit succès : ×2 dégâts · Crit échec : blessure`;
        } else {
            labelFrapper     = '🤛 Frapper à mains nues';
            sousTitreFrapper = `Coup FO ${FO} · Sans arme : vous perdez des PV en cas d'échec`;
        }

        const hasExplosifs = _getItemsExplosifsDonjon().length > 0 || _getSortsOffensifsInvestis().length > 0;

        corps = `
            <div style="color:#aaa;font-size:0.85em;margin-bottom:12px;">
                Durabilité : <strong style="color:${durCoul};">${etat.durabilite} / ${etat.durabiliteMax}</strong>
                <div style="height:6px;background:#222;border-radius:3px;margin-top:4px;overflow:hidden;">
                    <div style="height:100%;width:${Math.round(etat.durabilite/etat.durabiliteMax*100)}%;background:${durCoul};"></div>
                </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px;">
                <button onclick="_crochetageCoffre('${cellKey}')" style="background:#0d1a0d;color:#4caf50;border:1px solid #2a5a2a;padding:9px 12px;border-radius:5px;cursor:pointer;text-align:left;">
                    🔓 Crocheter
                    <span style="color:#666;font-size:0.8em;display:block;">Chance : ${chanceCroch}% (DX ${DX} + crochetage ${crochetage})</span>
                </button>
                <button onclick="_frapperCoffre('${cellKey}')" style="background:#1a0d0d;color:#ff9800;border:1px solid #5a2a0d;padding:9px 12px;border-radius:5px;cursor:pointer;text-align:left;">
                    ${labelFrapper}
                    <span style="color:#666;font-size:0.8em;display:block;">${sousTitreFrapper}</span>
                </button>
                ${hasExplosifs ? `<button onclick="_ouvrirModalExplosifSurTarget('${cellKey}','coffre')" style="background:#1a0d00;color:#ff6b00;border:1px solid #5a3000;padding:9px 12px;border-radius:5px;cursor:pointer;text-align:left;">
                    💥 Utiliser item / sort
                    <span style="color:#666;font-size:0.8em;display:block;">Grenade, dynamite, boule de feu…</span>
                </button>` : ''}
            </div>`;
    }

    modal.innerHTML = `
        <div style="background:#1a120a;border:2px solid #d4af37;border-radius:10px;padding:20px;max-width:340px;width:90%;">
            <h3 style="color:#d4af37;margin:0 0 12px;">${header}</h3>
            ${corps}
            <button onclick="document.getElementById('modal-donjon-coffre').remove()" style="width:100%;background:#333;color:#aaa;border:1px solid #555;padding:7px;border-radius:4px;cursor:pointer;margin-top:4px;">Fermer</button>
        </div>`;
    modal.style.display = 'flex';
}

/** Tentative de crochetage du coffre. */
function _crochetageCoffre(cellKey) {
    const DX         = (window.perso?.statsBase?.DX ?? 8) + (window.perso?.statsInvesties?.DX || 0);
    const crochetage = window.perso?.compInvesties?.crochetage || 0;
    const chance     = Math.min(95, DX * 3 + crochetage * 5);
    const roll       = Math.floor(Math.random() * 100);
    const ref        = db.ref('parties/' + sessionActuelle + '/donjon_actif/etats_coffres/' + cellKey);
    const nom        = window.perso?.nom || '?';

    document.getElementById('modal-donjon-coffre')?.remove();

    if (roll < chance) {
        if (typeof _toast === 'function') _toast(`🔓 Coffre crocheté ! (${roll}/${chance}%)`, 'success');
        _logDonjon(`🔓 ${nom} crochète un coffre (${roll}/${chance}%).`);
        ref.update({ statut: 'ouvert', verrouille: false }).then(() => {
            db.ref('parties/' + sessionActuelle + '/donjon_actif/grille/' + cellKey + '/event/declenche').set(true);
            ref.once('value', s => _afficherModalCoffre(cellKey, s.val()));
        });
    } else {
        if (typeof _toast === 'function') _toast(`❌ Crochetage échoué (${roll}/${chance}%).`, 'error');
        _logDonjon(`❌ ${nom} échoue à crocheter un coffre (${roll}/${chance}%).`);
    }
    // Avancer le tour dans tous les cas
    const data = window.donjonActif;
    if (data) _avancerTourDonjon(data);
}

/** Frappe le coffre avec calcul de coup (crits inclus). */
function _frapperCoffre(cellKey) {
    const armeInfo = _getArmeEquipeeDonjon();
    const nom      = window.perso?.nom || '?';
    const myID     = (window.perso?.nom || '').replace(/\s+/g, '_');
    const ref      = db.ref('parties/' + sessionActuelle + '/donjon_actif/etats_coffres/' + cellKey);
    const coup     = _calculerCoupDonjon(armeInfo);
    const nomArme  = armeInfo ? armeInfo.def.nom : 'Poings';
    document.getElementById('modal-donjon-coffre')?.remove();

    if (coup.resultat === 'echec_critique') {
        const blessure = Math.floor(Math.random() * 4) + 1;
        if (typeof _toast === 'function') _toast(`💀 Échec critique ! Vous vous blessez (−${blessure} PV) !`, 'error');
        _logDonjon(`💀 ${nom} : échec critique sur le coffre (−${blessure} PV).`);
        db.ref('parties/' + sessionActuelle + '/joueurs/' + myID + '/modif_stat').set({ stat: 'PV', valeur: -blessure, timestamp: Date.now() });
        const data = window.donjonActif;
        if (data) _avancerTourDonjon(data);
        return;
    }
    if (coup.resultat === 'succes_critique') {
        if (typeof _toast === 'function') _toast(`🌟 Coup critique ! ${coup.dmg} dégâts !`, 'success');
    } else if (coup.resultat === 'echec') {
        if (typeof _toast === 'function') _toast(`❌ Coup manqué (${coup.roll}/${coup.baseChance}%).`, 'error');
        const data = window.donjonActif;
        if (data) _avancerTourDonjon(data);
        return;
    }

    // Usure de l'arme / PV mains nues
    if (armeInfo) {
        const perteArme = coup.resultat === 'succes_critique' ? Math.floor(Math.random() * 3) + 3 : Math.floor(Math.random() * 3) + 2;
        const slotObj   = armeInfo.slotObj;
        if (slotObj.durabilite !== undefined) {
            slotObj.durabilite = Math.max(0, (slotObj.durabilite || 0) - perteArme);
            if (typeof _toast === 'function') {
                slotObj.durabilite === 0
                    ? _toast(`🔨 ${nomArme} est brisée !`, 'error')
                    : _toast(`🔧 ${nomArme} : −${perteArme} dur. (reste ${slotObj.durabilite})`, 'info');
            }
            if (typeof autoSave === 'function') autoSave();
        }
    } else {
        const pertePV = Math.floor(Math.random() * 3) + 1;
        if (typeof _toast === 'function') _toast(`🤛 Vous vous blessez en frappant le coffre (−${pertePV} PV) !`, 'error');
        _logDonjon(`🤛 ${nom} se blesse à mains nues (−${pertePV} PV).`);
        db.ref('parties/' + sessionActuelle + '/joueurs/' + myID + '/modif_stat').set({ stat: 'PV', valeur: -pertePV, timestamp: Date.now() });
    }

    ref.once('value', snap => {
        const etat = snap.val();
        if (!etat) return;
        const nouvDura = Math.max(0, etat.durabilite - coup.dmg);
        _logDonjon(`🪓 ${nom} frappe le coffre avec ${nomArme} — ${coup.resultat} (${coup.roll}/${coup.baseChance}%) : −${coup.dmg} dur. → reste ${nouvDura}/${etat.durabiliteMax}.`);
        if (nouvDura <= 0) {
            if (typeof _toast === 'function') _toast('💥 Le coffre est fracassé !', 'success');
            ref.update({ durabilite: 0, statut: 'casse' }).then(() => {
                db.ref('parties/' + sessionActuelle + '/donjon_actif/grille/' + cellKey + '/event/declenche').set(true);
                ref.once('value', s => _afficherModalCoffre(cellKey, s.val()));
            });
        } else {
            if (typeof _toast === 'function') _toast(`🪓 Coffre endommagé (${nouvDura}/${etat.durabiliteMax}).`, 'info');
            ref.update({ durabilite: nouvDura }).then(() => ref.once('value', s => _afficherModalCoffre(cellKey, s.val())));
        }
    });
    const data = window.donjonActif;
    if (data) _avancerTourDonjon(data);
}

/** Prend un item dans un slot de coffre. Un seul item par joueur par coffre. */
function _prendreItemDonjon(cellKey, slotKey) {
    if (!window.perso || typeof itemsData === 'undefined') return;
    const myID = (window.perso.nom || '').replace(/\s+/g, '_');
    const ref  = db.ref('parties/' + sessionActuelle + '/donjon_actif/etats_coffres/' + cellKey);
    ref.once('value', snap => {
        const etat = snap.val();
        if (!etat) return;
        if (etat.pris_par?.[myID]) {
            if (typeof _toast === 'function') _toast('Vous avez déjà pris un objet dans ce coffre.', 'error');
            return;
        }
        const slot = etat.loot?.slots?.[slotKey];
        if (!slot || slot.pris_par) {
            if (typeof _toast === 'function') _toast('Cet objet a déjà été pris.', 'error');
            ref.once('value', s => _afficherModalCoffre(cellKey, s.val()));
            return;
        }
        const itemDef = itemsData[slot.id];
        if (!itemDef) return;

        // Ajouter à l'inventaire
        if (!window.perso.inventaire) window.perso.inventaire = [];
        const idx = window.perso.inventaire.findIndex(i => i.id === slot.id && itemDef.stackable);
        if (idx !== -1) window.perso.inventaire[idx].quantite = (window.perso.inventaire[idx].quantite || 1) + 1;
        else window.perso.inventaire.push({ id: slot.id, quantite: 1 });
        if (typeof autoSave === 'function') autoSave();
        if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
        if (typeof _toast === 'function') _toast(`✅ ${itemDef.nom} ramassé !`, 'success');
        _logDonjon(`🎁 ${window.perso.nom} ramasse : ${itemDef.nom}`);

        // Marquer dans Firebase
        const updates = {};
        updates[`loot/slots/${slotKey}/pris_par`] = myID;
        updates[`pris_par/${myID}`] = true;
        ref.update(updates).then(() => {
            document.getElementById('modal-donjon-coffre')?.remove();
        });
    });
}

/** Prend l'or d'un coffre (une fois par joueur). */
function _prendreOrDonjon(cellKey) {
    if (!window.perso) return;
    const myID = (window.perso.nom || '').replace(/\s+/g, '_');
    const ref  = db.ref('parties/' + sessionActuelle + '/donjon_actif/etats_coffres/' + cellKey);
    ref.once('value', snap => {
        const etat = snap.val();
        if (!etat) return;
        if (etat.or_pris?.[myID]) {
            if (typeof _toast === 'function') _toast('Vous avez déjà pris l\'or de ce coffre.', 'error');
            return;
        }
        const montant = etat.loot?.or || 0;
        if (montant <= 0) return;
        window.perso.argent = (window.perso.argent || 0) + montant;
        if (typeof _incStatPartie === 'function') _incStatPartie('or_cumule', montant);
        if (typeof autoSave === 'function') autoSave();
        if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
        if (typeof _toast === 'function') _toast(`💰 +${montant} pièces d'or !`, 'success');
        _logDonjon(`💰 ${window.perso.nom} ramasse ${montant} pièces d'or.`);
        ref.update({ [`or_pris/${myID}`]: true }).then(() => {
            document.getElementById('modal-donjon-coffre')?.remove();
        });
    });
}

// ── Découverte ───────────────────────────────────────────────

function _afficherDecouverteDonjon(texte) {
    let modal = document.getElementById('modal-donjon-decouverte');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-donjon-decouverte';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }
    modal.innerHTML = `
        <div style="background:#0d1a2a;border:2px solid #2196f3;border-radius:10px;padding:20px;max-width:340px;width:90%;text-align:center;">
            <div style="font-size:2em;margin-bottom:8px;">🔎</div>
            <p style="color:#ccc;line-height:1.5;">${texte}</p>
            <button onclick="document.getElementById('modal-donjon-decouverte').remove()" style="background:#1a2a3a;color:#2196f3;border:1px solid #2196f3;padding:7px 20px;border-radius:4px;cursor:pointer;margin-top:8px;">OK</button>
        </div>`;
    modal.style.display = 'flex';
}

// ── Brouillard de guerre ─────────────────────────────────────

/**
 * Flood-fill depuis (px, py) à travers les cases non-mur.
 * Les portes fermées (non ouvertes) bloquent la propagation (visibles mais opaques).
 * Renvoie un Set de clés "x_y" visibles (sol + murs bordants).
 */
function _calculerVisibilite(grille, largeur, hauteur, px, py, etats_portes) {
    const visible  = new Set();
    const visited  = new Set([`${px}_${py}`]);
    const queue    = [[px, py]];

    while (queue.length > 0) {
        const [cx, cy] = queue.shift();
        visible.add(`${cx}_${cy}`);

        for (const [nx, ny] of [[cx-1,cy],[cx+1,cy],[cx,cy-1],[cx,cy+1]]) {
            if (nx < 0 || nx >= largeur || ny < 0 || ny >= hauteur) continue;
            const key  = `${nx}_${ny}`;
            const cell = grille[key];
            visible.add(key); // Voir les murs / portes bordants
            if (!visited.has(key) && cell?.type !== 'mur') {
                // Une porte fermée ou verrouillée bloque la vue derrière elle
                const estPorte = cell?.event?.type === 'porte';
                const etatPorte = etats_portes?.[key];
                const estFermee = estPorte && (etatPorte?.statut !== 'ouverte');
                if (!estFermee) {
                    visited.add(key);
                    queue.push([nx, ny]);
                }
            }
        }
    }
    return visible;
}

// ── Utilitaires ──────────────────────────────────────────────

function _logDonjon(texte) {
    db.ref('parties/' + sessionActuelle + '/donjon_actif/log').push({ texte, timestamp: Date.now() });
}
