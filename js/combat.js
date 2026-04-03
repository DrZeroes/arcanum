// ============================================================
// SYSTÈME DE COMBAT — Phase 2
// - Ordre de jeu basé sur la vitesse (DX)
// - Sorts utilisables depuis l'écran combat
// - Sélection de cible (ennemi ou allié)
// ============================================================

window.combatActif = null;

// ── Navigation ───────────────────────────────────────────────

function ouvrirEcranCombat() {
    if (typeof cacherTout === 'function') cacherTout();
    const ecran = document.getElementById('ecran-combat');
    if (ecran) ecran.style.display = 'flex';
    afficherEtatCombat();
    if (typeof AudioEngine !== 'undefined') AudioEngine.jouerMusique('Battle.mp3');
}

function quitterEcranCombat() {
    window.combatActif = null;
    if (typeof allerAccueil === 'function') allerAccueil();
    if (typeof activerEcouteurMusiqueMJ === 'function') activerEcouteurMusiqueMJ();
}

// ── Affichage principal ───────────────────────────────────────

function afficherEtatCombat() {
    const data = window.combatActif;
    if (!data) return;
    if (data.resultat) {
        _afficherResultatCombat(data.resultat);
        return;
    }
    _afficherOrdreTour(data);
    _afficherEnnemis(data);
    _afficherJoueurs();
    _afficherPanneauActions(data);
}

function _afficherResultatCombat(resultat) {
    const bar    = document.getElementById('combat-ordre-bar');
    const statut = document.getElementById('combat-statut');
    const panel  = document.getElementById('combat-actions-panel');
    const isVic  = resultat === 'victoire';
    if (bar)    bar.innerHTML = '';
    if (statut) {
        statut.textContent = isVic ? '⚔ Victoire !' : '💀 Défaite…';
        statut.style.color    = isVic ? '#ffd700' : '#ff4444';
        statut.style.fontSize = '1.4em';
        statut.style.fontWeight = 'bold';
    }
    if (panel) {
        panel.innerHTML = '<div style="text-align:center;font-size:2em;padding:24px;">'
            + (isVic ? '🏆 VICTOIRE !' : '💀 DÉFAITE…') + '</div>';
    }
}

function _verifierFinCombat(ennemisMAJ) {
    const tousKO = ennemisMAJ.every(e => e.pvActuel <= 0);
    if (!tousKO) return;
    db.ref('parties/' + sessionActuelle + '/combat_actif/resultat').set('victoire');
    if (window.estMJ) {
        setTimeout(() => db.ref('parties/' + sessionActuelle + '/combat_actif').remove(), 4000);
    }
}

// ── Barre d'ordre de jeu ─────────────────────────────────────

function _afficherOrdreTour(data) {
    const bar = document.getElementById('combat-ordre-bar');
    if (!bar) return;
    const ordre = data.ordre_jeu || [];
    if (ordre.length === 0) { bar.innerHTML = ''; return; }

    const tourIdx = (data.tour_actuel || 0) % ordre.length;
    const frags = ordre.map((p, i) => {
        const estActuel = (i === tourIdx);
        const cls = 'combat-tour-pill ' + (p.type === 'joueur' ? 'tour-joueur' : 'tour-ennemi') + (estActuel ? ' actuel' : '');
        return `<div class="${cls}">${estActuel ? '▶ ' : ''}${p.nom}<span class="tour-vitesse">⚡${p.vitesse}</span></div>`;
    });
    bar.innerHTML = frags.join('<span class="tour-fleche">›</span>');

    // Scroll auto vers le tour actuel
    const actuelEl = bar.querySelector('.actuel');
    if (actuelEl) actuelEl.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
}

// ── Colonne Ennemis ───────────────────────────────────────────

function _afficherEnnemis(data) {
    const zone = document.getElementById('combat-ennemis-liste');
    if (!zone) return;
    const ennemis = data.ennemis || [];
    if (ennemis.length === 0) {
        zone.innerHTML = '<p class="combat-vide">Aucun ennemi.</p>';
        return;
    }
    zone.innerHTML = ennemis.map(e => {
        const pvPct   = e.pvMax > 0 ? Math.round((e.pvActuel / e.pvMax) * 100) : 0;
        const estMort = e.pvActuel <= 0;
        const couleur = pvPct <= 25 ? '#e53935' : pvPct <= 50 ? '#f57c00' : '#c62828';
        return `
            <div class="combat-ennemi-card${estMort ? ' est-mort' : ''}" id="ennemi-card-${e.instanceId}">
                <div class="combat-ennemi-nom">${e.nom}
                    <span class="combat-ennemi-niv">Niv.${e.niveau || 1}</span>
                </div>
                <div class="combat-bar-label"><span>❤ PV</span><span>${e.pvActuel} / ${e.pvMax}</span></div>
                <div class="combat-bar-track">
                    <div class="combat-bar-fill" style="width:${pvPct}%; background:${couleur};"></div>
                </div>
                ${estMort ? '<div class="combat-mort-label">☠ Vaincu</div>' : ''}
            </div>`;
    }).join('');
}

// ── Colonne Joueurs + Compagnons ──────────────────────────────

function _afficherJoueurs() {
    const zone = document.getElementById('combat-joueurs-liste');
    if (!zone || typeof db === 'undefined') return;

    db.ref('parties/' + sessionActuelle + '/joueurs').once('value', (snap) => {
        const joueurs = snap.val() || {};
        const frags = Object.values(joueurs).map(j => {
            const pvPct  = j.pvMax > 0 ? Math.round(((j.pvActuel ?? 0) / j.pvMax) * 100) : 0;
            const ftPct  = j.ftMax > 0 ? Math.round(((j.ftActuel ?? 0) / j.ftMax) * 100) : 0;
            const estMoi  = j.nom === window.perso?.nom;
            const estMort = j.pvActuel <= 0;
            return `
                <div class="combat-joueur-card${estMoi ? ' est-moi' : ''}${estMort ? ' est-mort' : ''}">
                    <div class="combat-joueur-nom">${j.nom}
                        <span class="combat-joueur-niv">Niv.${j.niveau || 1}</span>
                    </div>
                    <div class="combat-bar-label"><span>❤ PV</span><span>${j.pvActuel ?? 0} / ${j.pvMax ?? 0}</span></div>
                    <div class="combat-bar-track"><div class="combat-bar-fill pv" style="width:${pvPct}%;"></div></div>
                    <div class="combat-bar-label"><span>⚡ FT</span><span>${j.ftActuel ?? 0} / ${j.ftMax ?? 0}</span></div>
                    <div class="combat-bar-track"><div class="combat-bar-fill ft" style="width:${ftPct}%;"></div></div>
                    ${j.nom === window.perso?.nom
                        ? '<div id="combat-xp-moi">' + _genererLedsXP(window.perso.xp || 0, window.perso.niveau || 1, window.perso) + '</div>'
                        : '<div class="xp-leds-other">' + _genererLedsXP(j.xp || 0, j.niveau || 1) + '</div>'}
                </div>`;
        });

        // Compagnons présents dans l'ordre de jeu
        const compagnons = (window.combatActif?.ordre_jeu || []).filter(p => p.type === 'compagnon');
        const fragsComp = compagnons.map(c => `
            <div class="combat-joueur-card compagnon-card-combat">
                <div class="combat-joueur-nom">🤝 ${c.nom}
                    <span class="combat-joueur-niv">Niv.${c.niveau || 1} · ${c.ownerNom}</span>
                </div>
                <div style="color:#888; font-size:0.7em; margin-top:3px;">Géré par le MJ</div>
                <div class="xp-leds-other">${_genererLedsXP(c.xp || 0, c.niveau || 1)}</div>
            </div>`);

        zone.innerHTML = (frags.length ? frags.join('') : '<p class="combat-vide">Aucun joueur.</p>')
                       + fragsComp.join('');
    });
}

// ── Sorts disponibles (corrige magieBase vs magieInvesties) ──────

/**
 * Retourne la liste des noms de sorts connus.
 * getSortsConnus() lit magieBase (base raciale) mais les sorts investis
 * sont dans magieInvesties — on utilise les deux sources.
 */
function _getSortsDisponibles() {
    const perso = window.perso;
    if (!perso || typeof magieData === 'undefined') return [];
    // Source prioritaire : magieInvesties ; fallback : magieBase
    const source = (perso.magieInvesties && Object.keys(perso.magieInvesties).length > 0)
        ? perso.magieInvesties
        : (perso.magieBase || {});
    const result = [];
    for (let ecole in source) {
        const niveau = parseInt(source[ecole]) || 0;
        if (niveau > 0 && magieData[ecole]?.sorts) {
            for (let i = 0; i < niveau; i++) {
                if (magieData[ecole].sorts[i]) result.push(magieData[ecole].sorts[i].nom);
            }
        }
    }
    return result;
}

// ── Panneau d'actions ─────────────────────────────────────────

function _afficherPanneauActions(data) {
    const panel  = document.getElementById('combat-actions-panel');
    const statut = document.getElementById('combat-statut');
    if (!panel) return;

    // Boutons MJ — tour suivant + terminer
    const btnTour = document.getElementById('combat-btn-tour-suivant');
    const btnFin  = document.getElementById('combat-btn-terminer');
    if (btnTour) btnTour.style.display = window.estMJ ? 'inline-block' : 'none';
    if (btnFin)  btnFin.style.display  = window.estMJ ? 'inline-block' : 'none';

    const ordre = data.ordre_jeu || [];
    if (ordre.length === 0) return;
    const tourIdx     = (data.tour_actuel || 0) % ordre.length;
    const participant = ordre[tourIdx];

    const estMonTour       = participant.type === 'joueur'     && participant.nom === window.perso?.nom;
    const estTourEnnemi    = participant.type === 'ennemi';
    const estTourCompagnon = participant.type === 'compagnon';

    if (statut) {
        if (estTourEnnemi)       statut.textContent = `Tour de ${participant.nom} — le MJ joue…`;
        else if (estTourCompagnon) statut.textContent = `Tour de ${participant.nom} (compagnon) — le MJ gère…`;
        else if (estMonTour)     statut.textContent = `C'est votre tour !`;
        else                     statut.textContent = `Tour de ${participant.nom}…`;
    }

    // Si c'est le tour d'un monstre ou compagnon et que le MJ est connecté
    if (!estMonTour) {
        if (window.estMJ && (estTourEnnemi || estTourCompagnon)) {
            _afficherActionsControleMJ(participant, panel);
        } else {
            panel.innerHTML = '';
        }
        return;
    }

    // ── Bouton Attaquer ──
    const perso    = window.perso;
    const fo       = (perso.statsBase?.FO || 0) + (perso.statsInvesties?.FO || 0);
    const foMod    = fo > 10 ? fo - 10 : Math.floor((fo - 10) / 2);
    const melee    = perso.compInvesties?.melee || 0;
    const armureTot = _armureTotal(perso);
    // Nom de l'arme équipée
    let armNom = 'Poing';
    if (typeof itemsData !== 'undefined') {
        const eq = perso.equipement || {};
        const slot = eq.main_droite || eq.deux_mains || eq.main_gauche;
        if (slot && itemsData[slot.id]) armNom = itemsData[slot.id].nom;
    }
    let html = `<div class="combat-actions-titre">Actions</div>
        <button class="combat-sort-btn attaque" onclick="ouvrirCiblesAttaque()">
            <span class="sort-nom">⚔ ${armNom}</span>
            <span class="sort-meta">FO ${fo > 10 ? '+' : ''}${foMod} · Mêlée ${melee}${armureTot > 0 ? ' · 🛡' + armureTot : ''}</span>
        </button>`;

    // ── Sorts connus ──
    const sorts = _getSortsDisponibles();
    if (sorts.length > 0) {
        const ftActuel = perso?.ftActuel ?? 0;
        const sortsHtml = sorts.map(nom => {
            const s = (typeof trouverSort === 'function') ? trouverSort(nom) : null;
            if (!s) return '';
            const cout = parseInt(s.cout, 10) || 0;
            const peut = ftActuel >= cout;
            const meta = s.degats ? `⚔ ${s.degats} dég.` : s.soin ? `💚 Soin` : `✨ Effet`;
            const nomSafe = nom.replace(/'/g, "\\'");
            return `<button class="combat-sort-btn${peut ? '' : ' epuise'}"
                onclick="${peut ? `ouvrirCiblesSortCombat('${nomSafe}')` : ''}"
                ${peut ? '' : 'disabled'}>
                <span class="sort-nom">${s.nom}</span>
                <span class="sort-meta">${meta} · ${cout} FT</span>
            </button>`;
        }).filter(Boolean).join('');
        if (sortsHtml) html += `<div class="combat-actions-titre" style="margin-top:8px;">Sorts</div>` + sortsHtml;
    }

    // ── Objets consommables ──
    const consomHtml = _genererBoutonsConsommables(perso);
    if (consomHtml) html += `<div class="combat-actions-titre" style="margin-top:8px;">Objets</div>` + consomHtml;

    panel.innerHTML = html;
}

// ── Helpers consommables ──────────────────────────────────────

/**
 * Retourne le HTML des boutons consommables de l'inventaire.
 * Affiche soin/FT sur alliés et explosifs sur ennemis.
 */
function _genererBoutonsConsommables(perso) {
    if (typeof itemsData === 'undefined' || !perso?.inventaire) return '';
    let html = '';
    // Déduplique par id pour afficher un seul bouton avec (xN)
    const vus = {};
    perso.inventaire.forEach((it) => {
        const data = itemsData[it.id];
        if (!data || data.type !== 'consommable') return;
        const soinPV = data.stats?.soinPV || 0;
        const soinFT = data.stats?.soinFT || 0;
        const degParts = data.degats && data.degats !== '0' ? String(data.degats).split('-') : null;
        const estOffensif = !!degParts;
        const estSoin     = soinPV > 0 || soinFT > 0;
        if (!estOffensif && !estSoin) return; // pas d'effet connu en combat
        const key = it.id;
        if (vus[key]) return; // déjà affiché
        vus[key] = true;
        const qte = it.quantite || 1;
        const meta = estSoin
            ? (soinPV > 0 ? `💚+${soinPV}PV` : '') + (soinFT > 0 ? ` ⚡+${soinFT}FT` : '')
            : `⚔ ${data.degats} dég.`;
        const onclick = estOffensif
            ? `ouvrirCiblesObjet('${it.id}', 'offensif')`
            : `ouvrirCiblesObjet('${it.id}', 'soin')`;
        html += `<button class="combat-sort-btn${estOffensif ? ' attaque' : ''}" onclick="${onclick}">
            <span class="sort-nom">${data.nom} <span style="color:#888">×${qte}</span></span>
            <span class="sort-meta">${meta.trim()}</span>
        </button>`;
    });
    return html;
}

// ── Utilisation d'objet en combat ─────────────────────────────

let _objetCombatEnCours = null;

function ouvrirCiblesObjet(itemId, mode) {
    if (typeof itemsData === 'undefined') return;
    _objetCombatEnCours = { itemId, mode };
    const data   = window.combatActif;
    const panel  = document.getElementById('combat-actions-panel');
    if (!panel) return;

    const titre = `<div class="combat-actions-titre">Cible — ${itemsData[itemId]?.nom}</div>`;
    const annuler = `<button class="combat-annuler-btn" onclick="_afficherPanneauActions(window.combatActif)">✕ Annuler</button>`;

    if (mode === 'offensif') {
        const ennemisVivants = (data?.ennemis || []).filter(e => e.pvActuel > 0);
        let html = titre + `<div class="combat-cibles-label ennemi">⚔ Ennemis</div>`;
        if (!ennemisVivants.length) {
            html += '<p class="combat-vide">Aucun ennemi vivant.</p>';
        } else {
            ennemisVivants.forEach(e => {
                html += `<button class="combat-cible-btn ennemi"
                    onclick="utiliserObjetCombat(${e.instanceId})">
                    ${e.nom} <span class="cible-pv">PV ${e.pvActuel}/${e.pvMax}</span>
                </button>`;
            });
        }
        panel.innerHTML = html + annuler;
    } else {
        // Mode soin : fetch tous les joueurs en une seule passe puis rendre
        const _renderSoin = (joueurs) => {
            const moiId = (window.perso?.nom || '').replace(/\s+/g, '_');
            let html = titre + `<div class="combat-cibles-label allie">💚 Alliés</div>`;
            html += `<button class="combat-cible-btn allie" onclick="utiliserObjetCombat('${moiId}')">Vous-même</button>`;
            for (let id in joueurs) {
                if ((joueurs[id].pvActuel || 0) > 0 && joueurs[id].nom !== window.perso?.nom) {
                    html += `<button class="combat-cible-btn allie"
                        onclick="utiliserObjetCombat('${id}')">
                        ${joueurs[id].nom} <span class="cible-pv">PV ${joueurs[id].pvActuel}/${joueurs[id].pvMax}</span>
                    </button>`;
                }
            }
            panel.innerHTML = html + annuler;
        };
        if (typeof db !== 'undefined') {
            db.ref('parties/' + sessionActuelle + '/joueurs').once('value', (snap) => _renderSoin(snap.val() || {}));
        } else {
            _renderSoin({});
        }
    }
}

function utiliserObjetCombat(cibleId) {
    const { itemId, mode } = _objetCombatEnCours || {};
    if (!itemId || !window.perso) return;
    const itemDef = (typeof itemsData !== 'undefined') ? itemsData[itemId] : null;
    if (!itemDef) return;

    // Consomme l'objet dans l'inventaire
    const inv = window.perso.inventaire || [];
    const idx = inv.findIndex(i => i.id === itemId);
    if (idx === -1) return;
    if (inv[idx].quantite > 1) { inv[idx].quantite--; }
    else { inv.splice(idx, 1); }
    window.perso.inventaire = inv;
    if (typeof autoSave === 'function') autoSave();
    if (typeof synchroniserJoueur === 'function') synchroniserJoueur();

    const data = window.combatActif;
    const ordreTaille  = (data?.ordre_jeu || []).length || 1;
    const prochainTour = ((data?.tour_actuel || 0) + 1) % ordreTaille;
    let msg = '';

    if (mode === 'offensif') {
        const ennemisMAJ = [...(data?.ennemis || [])];
        const ei = ennemisMAJ.findIndex(e => e.instanceId === cibleId);
        if (ei === -1) return;
        const parts = String(itemDef.degats).split('-');
        const min = parseInt(parts[0]) || 1;
        const max = parseInt(parts[parts.length - 1]) || min;
        const degats = min + Math.floor(Math.random() * (max - min + 1));
        ennemisMAJ[ei].pvActuel = Math.max(0, ennemisMAJ[ei].pvActuel - degats);
        _gagnerXP(ennemisMAJ[ei].pvActuel <= 0 ? 6 : 1);
        _verifierFinCombat(ennemisMAJ);
        msg = `${window.perso.nom} utilise ${itemDef.nom} sur ${ennemisMAJ[ei].nom} : ${degats} dégâts !`;
        db.ref('parties/' + sessionActuelle + '/combat_actif').update({
            ennemis: ennemisMAJ, tour_actuel: prochainTour
        });
    } else {
        const soinPV = itemDef.stats?.soinPV || 0;
        const soinFT = itemDef.stats?.soinFT || 0;
        if (soinPV > 0) {
            db.ref('parties/' + sessionActuelle + '/joueurs/' + cibleId + '/modif_stat').set({
                stat: 'PV', valeur: soinPV, timestamp: Date.now()
            });
        }
        if (soinFT > 0) {
            db.ref('parties/' + sessionActuelle + '/joueurs/' + cibleId + '/modif_stat').set({
                stat: 'FT', valeur: soinFT, timestamp: Date.now()
            });
        }
        msg = `${window.perso.nom} utilise ${itemDef.nom} sur un allié.`;
        db.ref('parties/' + sessionActuelle + '/combat_actif/tour_actuel').set(prochainTour);
    }

    if (msg) db.ref('parties/' + sessionActuelle + '/alerte_mj').set({ texte: msg, timestamp: Date.now() });
    _objetCombatEnCours = null;
}

// ── Sélection de cible ────────────────────────────────────────

let _sortCombatEnCours = null;

function ouvrirCiblesSortCombat(nomSort) {
    const s = (typeof trouverSort === 'function') ? trouverSort(nomSort) : null;
    if (!s) return;
    _sortCombatEnCours = s;

    const data           = window.combatActif;
    const ennemisVivants = (data?.ennemis || []).filter(e => e.pvActuel > 0);
    const peutEnnemis    = !!s.degats || (!s.soin && !s.resurrection);
    const peutAllie      = !!s.soin || !!s.resurrection;

    const panel = document.getElementById('combat-actions-panel');
    if (!panel) return;

    const _render = (joueurs) => {
        let html = `<div class="combat-actions-titre">Cible — ${s.nom}</div>`;

        if (peutEnnemis && ennemisVivants.length > 0) {
            html += `<div class="combat-cibles-label ennemi">⚔ Ennemis</div>`;
            ennemisVivants.forEach(e => {
                html += `<button class="combat-cible-btn ennemi"
                    onclick="finaliserSortCombat(${e.instanceId}, 'ennemi')">
                    ${e.nom} <span class="cible-pv">PV ${e.pvActuel}/${e.pvMax}</span>
                </button>`;
            });
        }

        if (peutAllie) {
            html += `<div class="combat-cibles-label allie">💚 Alliés</div>`;
            // Clé Firebase = nom avec espaces → underscores
            const moiId = (window.perso?.nom || '').replace(/\s+/g, '_');
            html += `<button class="combat-cible-btn allie"
                onclick="finaliserSortCombat('${moiId}', 'joueur')">Vous-même</button>`;
            for (let id in joueurs) {
                if ((joueurs[id].pvActuel || 0) > 0 && joueurs[id].nom !== window.perso?.nom) {
                    html += `<button class="combat-cible-btn allie"
                        onclick="finaliserSortCombat('${id}', 'joueur')">
                        ${joueurs[id].nom} <span class="cible-pv">PV ${joueurs[id].pvActuel}/${joueurs[id].pvMax}</span>
                    </button>`;
                }
            }
        }

        html += `<button class="combat-annuler-btn"
            onclick="_afficherPanneauActions(window.combatActif)">✕ Annuler</button>`;
        panel.innerHTML = html;
    };

    if (peutAllie && typeof db !== 'undefined') {
        db.ref('parties/' + sessionActuelle + '/joueurs').once('value', (snap) => {
            _render(snap.val() || {});
        });
    } else {
        _render({});
    }
}

// ── Finalisation du sort ──────────────────────────────────────

function finaliserSortCombat(cibleId, typeCible) {
    const s = _sortCombatEnCours;
    if (!s || !window.perso) return;

    const cout = parseInt(s.cout, 10) || 0;
    if (window.perso.ftActuel < cout) {
        const st = document.getElementById('combat-statut');
        if (st) { st.textContent = '💥 Fatigue insuffisante.'; st.style.color = '#ff4444'; }
        return;
    }

    window.perso.ftActuel -= cout;
    if (typeof autoSave === 'function') autoSave();
    if (typeof synchroniserJoueur === 'function') synchroniserJoueur();

    const align    = window.perso.alignementMagique || 0;
    const data     = window.combatActif;
    const ordreTaille = (data.ordre_jeu || []).length || 1;
    const prochainTour = ((data.tour_actuel || 0) + 1) % ordreTaille;

    if (typeCible === 'ennemi') {
        const ennemisMAJ = [...(data.ennemis || [])];
        const idx = ennemisMAJ.findIndex(e => e.instanceId === cibleId);
        if (idx === -1) return;

        let msg = `${window.perso.nom} lance ${s.nom} sur ${ennemisMAJ[idx].nom}.`;
        if (s.degats) {
            const degats = Math.floor(s.degats + (align / 100) * s.degats);
            ennemisMAJ[idx].pvActuel = Math.max(0, ennemisMAJ[idx].pvActuel - degats);
            if (degats > 0) _gagnerXP(ennemisMAJ[idx].pvActuel <= 0 ? 6 : 1);
            msg = `${window.perso.nom} lance ${s.nom} sur ${ennemisMAJ[idx].nom} : ${degats} dégâts ! (PV restants : ${ennemisMAJ[idx].pvActuel})`;
        }

        _verifierFinCombat(ennemisMAJ);
        db.ref('parties/' + sessionActuelle + '/combat_actif').update({
            ennemis: ennemisMAJ,
            tour_actuel: prochainTour
        });
        db.ref('parties/' + sessionActuelle + '/alerte_mj').set({ texte: msg, timestamp: Date.now() });

    } else if (typeCible === 'joueur') {
        if (s.soin) {
            const soin = s.soin === 999 ? 9999 : Math.floor(s.soin + (align / 100) * s.soin);
            db.ref('parties/' + sessionActuelle + '/joueurs/' + cibleId + '/modif_stat').set({
                stat: 'PV', valeur: soin, timestamp: Date.now()
            });
        }
        db.ref('parties/' + sessionActuelle + '/combat_actif/tour_actuel').set(prochainTour);
    }

    _sortCombatEnCours = null;
}

// ── Système d'XP ─────────────────────────────────────────────

function xpPourNiveau(niveau, persoRef) {
    // Niveau 1→2: 10xp, 2→3: 15xp, 3→4: 20xp...
    const base = 10 + ((niveau || 1) - 1) * 5;
    // Background "Affiche de Nietzsche Enfant" : -10% XP requis
    const p = persoRef || window.perso;
    if (p && p.background === 'Affiche de Nietzsche Enfant') {
        return Math.max(1, Math.floor(base * 0.9));
    }
    return base;
}

function _gagnerXP(montant) {
    if (!window.perso) return;
    window.perso.xp = (window.perso.xp || 0) + montant;
    const needed = xpPourNiveau(window.perso.niveau || 1, window.perso);
    let leveledUp = false;
    while (window.perso.xp >= needed) {
        window.perso.xp -= needed;
        if (typeof levelUp === 'function') levelUp();
        leveledUp = true;
    }
    if (leveledUp) {
        const st = document.getElementById('combat-statut');
        if (st) { st.textContent = '🌟 Niveau ' + window.perso.niveau + ' atteint !'; st.style.color = '#ffd700'; }
    }
    if (typeof autoSave === 'function') autoSave();
    if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
    _rafraichirJaugeXP();
}

/** Génère 10 LEDs représentant la progression XP. */
function _genererLedsXP(xpActuel, niveau, persoRef) {
    const needed = xpPourNiveau(niveau || 1, persoRef);
    const ledsOn = Math.min(10, Math.floor(((xpActuel || 0) / needed) * 10));
    let html = '<div class="xp-leds">';
    for (let i = 0; i < 10; i++) {
        html += '<span class="xp-led' + (i < ledsOn ? ' active' : '') + '"></span>';
    }
    html += '<span class="xp-leds-label">' + (xpActuel || 0) + '/' + needed + ' XP</span></div>';
    return html;
}

/** Met à jour la jauge XP du joueur sur l'écran combat. */
function _rafraichirJaugeXP() {
    const el = document.getElementById('combat-xp-moi');
    if (el && window.perso) {
        el.innerHTML = _genererLedsXP(window.perso.xp || 0, window.perso.niveau || 1, window.perso);
    }
}

/** Panel d'actions que le MJ voit quand c'est le tour d'un monstre ou compagnon. */
function _afficherActionsControleMJ(participant, panel) {
    const data = window.combatActif;
    const ennemisVivants = (data?.ennemis || []).filter(e => e.pvActuel > 0);

    if (participant.type === 'ennemi') {
        // Le monstre attaque un joueur
        let html = '<div class="combat-actions-titre">⚔ ' + participant.nom + ' attaque</div>'
            + '<div class="combat-cibles-label allie">Choisir la cible joueur</div>';
        // Fetch players
        db.ref('parties/' + sessionActuelle + '/joueurs').once('value', (snap) => {
            const joueurs = snap.val() || {};
            for (let id in joueurs) {
                if ((joueurs[id].pvActuel || 0) > 0) {
                    html += '<button class="combat-cible-btn allie" onclick="mjAttaqueMonstreJoueur(\'' + id + '\', \'' + joueurs[id].nom + '\')">'
                        + joueurs[id].nom + ' <span class="cible-pv">PV ' + joueurs[id].pvActuel + '/' + joueurs[id].pvMax + '</span>'
                        + '</button>';
                }
            }
            panel.innerHTML = html;
        });
    } else {
        // Le compagnon : attaque mêlée ou sorts
        let html = '<div class="combat-actions-titre">🤝 ' + participant.nom + '</div>';

        // Attaque mêlée
        html += '<div class="combat-cibles-label ennemi">⚔ Attaque mêlée</div>';
        if (ennemisVivants.length === 0) {
            html += '<p class="combat-vide">Aucun ennemi vivant.</p>';
        } else {
            ennemisVivants.forEach(e => {
                html += '<button class="combat-cible-btn ennemi" onclick="mjAttaqueCompagnonEnnemi(' + e.instanceId + ')">'
                    + e.nom + ' <span class="cible-pv">PV ' + e.pvActuel + '/' + e.pvMax + '</span>'
                    + '</button>';
            });
        }

        // Sorts du compagnon
        const sortsDuComp = _getSortsCompagnon(participant);
        if (sortsDuComp.length > 0) {
            html += '<div class="combat-cibles-label" style="color:#9575cd; margin-top:6px;">✨ Sorts</div>';
            sortsDuComp.forEach(s => {
                const nomSafe = s.nom.replace(/'/g, "\\'");
                const meta = s.degats ? '⚔ ' + s.degats + ' dég.' : s.soin ? '💚 Soin' : '✨ Effet';
                html += '<button class="combat-sort-btn" onclick="mjUtiliserSortCompagnon(\''
                    + nomSafe + '\', ' + JSON.stringify(ennemisVivants.map(e => ({instanceId: e.instanceId, nom: e.nom, pvActuel: e.pvActuel, pvMax: e.pvMax})))
                    + ')" style="width:100%; margin:2px 0;">'
                    + '<span class="sort-nom">' + s.nom + '</span>'
                    + '<span class="sort-meta">' + meta + ' · ' + (s.cout || 0) + ' FT</span>'
                    + '</button>';
            });
        }

        panel.innerHTML = html;
    }
}

/** Retourne les sorts connus d'un participant compagnon (depuis ordre_jeu + perso local). */
function _getSortsCompagnon(participant) {
    if (typeof magieData === 'undefined') return [];
    // magieInvesties est stocké directement dans participant (ordre_jeu Firebase)
    const source = participant.magieInvesties || {};
    const sorts = [];
    for (let ecole in source) {
        const niv = parseInt(source[ecole]) || 0;
        if (niv > 0 && magieData[ecole]?.sorts) {
            for (let i = 0; i < niv; i++) {
                if (magieData[ecole].sorts[i]) sorts.push(magieData[ecole].sorts[i]);
            }
        }
    }
    return sorts;
}

/** MJ utilise un sort de compagnon. */
function mjUtiliserSortCompagnon(nomSort, ennemisVivants) {
    const s = (typeof trouverSort === 'function') ? trouverSort(nomSort) : null;
    if (!s) return;
    const data = window.combatActif;
    const ordreTaille  = (data?.ordre_jeu || []).length || 1;
    const prochainTour = ((data?.tour_actuel || 0) + 1) % ordreTaille;
    const panel = document.getElementById('combat-actions-panel');

    if (s.degats && ennemisVivants.length > 0) {
        // Choisir cible ennemie
        let html = '<div class="combat-actions-titre">✨ ' + s.nom + ' — Cible</div>'
            + '<div class="combat-cibles-label ennemi">⚔ Ennemis</div>';
        ennemisVivants.forEach(e => {
            html += '<button class="combat-cible-btn ennemi" onclick="mjAppliquerSortCompagnon(' + e.instanceId + ', \'' + nomSort.replace(/'/g, "\\'") + '\')">'
                + e.nom + ' <span class="cible-pv">PV ' + e.pvActuel + '/' + e.pvMax + '</span></button>';
        });
        if (panel) panel.innerHTML = html;
    } else if (s.soin) {
        // Soin sur joueurs
        db.ref('parties/' + sessionActuelle + '/joueurs').once('value', (snap) => {
            const joueurs = snap.val() || {};
            let html = '<div class="combat-actions-titre">✨ ' + s.nom + ' — Cible</div>'
                + '<div class="combat-cibles-label allie">💚 Alliés</div>';
            for (let id in joueurs) {
                if ((joueurs[id].pvActuel || 0) > 0) {
                    const nomSafe = nomSort.replace(/'/g, "\\'");
                    html += '<button class="combat-cible-btn allie" onclick="mjAppliquerSoinCompagnon(\'' + id + '\', \'' + nomSafe + '\')">'
                        + joueurs[id].nom + ' <span class="cible-pv">PV ' + joueurs[id].pvActuel + '/' + joueurs[id].pvMax + '</span></button>';
                }
            }
            if (panel) panel.innerHTML = html;
        });
    } else {
        // Effet sans cible → avancer le tour
        db.ref('parties/' + sessionActuelle + '/combat_actif/tour_actuel').set(prochainTour);
        db.ref('parties/' + sessionActuelle + '/alerte_mj').set({ texte: 'Compagnon lance ' + nomSort + '.', timestamp: Date.now() });
    }
}

function mjAppliquerSortCompagnon(instanceId, nomSort) {
    const s = (typeof trouverSort === 'function') ? trouverSort(nomSort) : null;
    if (!s || !s.degats) return;
    const data = window.combatActif;
    const ennemisMAJ = [...(data?.ennemis || [])];
    const idx = ennemisMAJ.findIndex(e => e.instanceId === instanceId);
    if (idx === -1) return;
    const degats = parseInt(s.degats) || 5;
    ennemisMAJ[idx].pvActuel = Math.max(0, ennemisMAJ[idx].pvActuel - degats);
    const ordreTaille  = (data?.ordre_jeu || []).length || 1;
    const prochainTour = ((data?.tour_actuel || 0) + 1) % ordreTaille;
    _verifierFinCombat(ennemisMAJ);
    db.ref('parties/' + sessionActuelle + '/combat_actif').update({ ennemis: ennemisMAJ, tour_actuel: prochainTour });
    db.ref('parties/' + sessionActuelle + '/alerte_mj').set({ texte: 'Compagnon lance ' + nomSort + ' : ' + degats + ' dégâts !', timestamp: Date.now() });
}

function mjAppliquerSoinCompagnon(joueurID, nomSort) {
    const s = (typeof trouverSort === 'function') ? trouverSort(nomSort) : null;
    if (!s || !s.soin) return;
    const soin = s.soin === 999 ? 9999 : s.soin;
    const data = window.combatActif;
    const ordreTaille  = (data?.ordre_jeu || []).length || 1;
    const prochainTour = ((data?.tour_actuel || 0) + 1) % ordreTaille;
    db.ref('parties/' + sessionActuelle + '/joueurs/' + joueurID + '/modif_stat').set({ stat: 'PV', valeur: soin, timestamp: Date.now() });
    db.ref('parties/' + sessionActuelle + '/combat_actif/tour_actuel').set(prochainTour);
    db.ref('parties/' + sessionActuelle + '/alerte_mj').set({ texte: 'Compagnon lance ' + nomSort + ' : +' + soin + ' PV !', timestamp: Date.now() });
}

function mjAttaqueMonstreJoueur(joueurID, joueurNom) {
    const data = window.combatActif;
    const ordre = data?.ordre_jeu || [];
    const tourIdx = (data.tour_actuel || 0) % (ordre.length || 1);
    const monstre = ordre[tourIdx];

    // Damage simple: 1d8 + niveau/2
    const de = Math.ceil(Math.random() * 8);
    const bonus = Math.floor((monstre.niveau || 1) / 2);
    const degats = de + bonus;

    const msg = monstre.nom + ' attaque ' + joueurNom + ' : 1d8(' + de + ') + ' + bonus + ' = ' + degats + ' dégâts !';

    // Apply via modif_stat (negative PV) — on ne connaît pas l'armure joueur côté Firebase
    db.ref('parties/' + sessionActuelle + '/joueurs/' + joueurID + '/modif_stat').set({
        stat: 'PV', valeur: -degats, timestamp: Date.now()
    });

    const prochainTour = ((data.tour_actuel || 0) + 1) % (ordre.length || 1);
    db.ref('parties/' + sessionActuelle + '/combat_actif/tour_actuel').set(prochainTour);
    db.ref('parties/' + sessionActuelle + '/alerte_mj').set({ texte: msg, timestamp: Date.now() });

    // Vérifier défaite: tous les joueurs KO après ce coup
    db.ref('parties/' + sessionActuelle + '/joueurs').once('value', (snap) => {
        const joueurs = snap.val() || {};
        const tousKO = Object.values(joueurs).every(j => {
            const pvApres = j.id === joueurID ? Math.max(0, (j.pvActuel || 0) - degats) : (j.pvActuel || 0);
            return pvApres <= 0;
        });
        if (tousKO) {
            db.ref('parties/' + sessionActuelle + '/combat_actif/resultat').set('defaite');
            if (window.estMJ) {
                setTimeout(() => db.ref('parties/' + sessionActuelle + '/combat_actif').remove(), 4000);
            }
        }
    });
}

function mjAttaqueCompagnonEnnemi(instanceId) {
    const data = window.combatActif;
    const ordre = data?.ordre_jeu || [];
    const tourIdx = (data.tour_actuel || 0) % (ordre.length || 1);
    const compagnon = ordre[tourIdx];

    const ennemisMAJ = [...(data?.ennemis || [])];
    const idx = ennemisMAJ.findIndex(e => e.instanceId === instanceId);
    if (idx === -1) return;

    const de = Math.ceil(Math.random() * 6);
    const bonus = Math.floor((compagnon.niveau || 1) / 2);
    const degats = Math.max(1, de + bonus);
    ennemisMAJ[idx].pvActuel = Math.max(0, ennemisMAJ[idx].pvActuel - degats);

    const msg = compagnon.nom + ' attaque ' + ennemisMAJ[idx].nom + ' : 1d6(' + de + ') + ' + bonus + ' = ' + degats + ' dégâts ! (PV: ' + ennemisMAJ[idx].pvActuel + ')';

    _verifierFinCombat(ennemisMAJ);
    const prochainTour = ((data.tour_actuel || 0) + 1) % (ordre.length || 1);
    db.ref('parties/' + sessionActuelle + '/combat_actif').update({
        ennemis: ennemisMAJ,
        tour_actuel: prochainTour
    });
    db.ref('parties/' + sessionActuelle + '/alerte_mj').set({ texte: msg, timestamp: Date.now() });
}

// ── Attaque mêlée ─────────────────────────────────────────────

function ouvrirCiblesAttaque() {
    const data = window.combatActif;
    const ennemisVivants = (data?.ennemis || []).filter(e => e.pvActuel > 0);
    const panel = document.getElementById('combat-actions-panel');
    if (!panel) return;

    let html = `<div class="combat-actions-titre">Choisir la cible</div>
        <div class="combat-cibles-label ennemi">⚔ Ennemis</div>`;

    if (ennemisVivants.length === 0) {
        html += '<p class="combat-vide">Aucun ennemi vivant.</p>';
    } else {
        ennemisVivants.forEach(e => {
            html += `<button class="combat-cible-btn ennemi"
                onclick="lancerAttaqueMelee(${e.instanceId})">
                ${e.nom} <span class="cible-pv">PV ${e.pvActuel}/${e.pvMax}</span>
            </button>`;
        });
    }
    html += `<button class="combat-annuler-btn"
        onclick="_afficherPanneauActions(window.combatActif)">✕ Annuler</button>`;
    panel.innerHTML = html;
}

/** Calcule le dé d'arme équipée d'un perso/compagnon. Retourne {de, label}. */
function _degatsArme(p) {
    if (typeof itemsData === 'undefined') return { de: 6, label: '1d6' };
    const eq = p.equipement || {};
    const slot = eq.main_droite || eq.deux_mains || eq.main_gauche;
    if (!slot) return { de: 6, label: '1d6(poing)' };
    const item = itemsData[slot.id];
    if (!item || !item.degats || item.degats === '0') return { de: 6, label: '1d6(poing)' };
    // Format "X-Y" → d(Y-X+1)+X-1, simplified: just roll max die
    const parts = String(item.degats).split('-');
    const max   = parseInt(parts[parts.length - 1]) || 6;
    const min   = parseInt(parts[0]) || 1;
    const roll  = min + Math.floor(Math.random() * (max - min + 1));
    return { de: roll, label: item.nom + '(' + item.degats + ')' };
}

/** Calcule la réduction d'armure totale d'un perso/compagnon. */
function _armureTotal(p) {
    if (typeof itemsData === 'undefined') return 0;
    const eq = p.equipement || {};
    let total = 0;
    for (const slot in eq) {
        const s = eq[slot];
        if (s && itemsData[s.id]) total += itemsData[s.id].armure || 0;
    }
    return total;
}

function lancerAttaqueMelee(instanceId) {
    const perso = window.perso;
    if (!perso) return;

    const fo    = (perso.statsBase?.FO || 0) + (perso.statsInvesties?.FO || 0);
    const foMod = fo > 10 ? fo - 10 : Math.floor((fo - 10) / 2);
    const melee = perso.compInvesties?.melee || 0;
    const arme  = _degatsArme(perso);
    const degats = Math.max(1, arme.de + foMod + melee);

    const data = window.combatActif;
    const ennemisMAJ = [...(data?.ennemis || [])];
    const idx = ennemisMAJ.findIndex(e => e.instanceId === instanceId);
    if (idx === -1) return;

    // Armure ennemie réduit les dégâts
    const armEnnemi = _armureTotal(ennemisMAJ[idx]);
    const degatsFinaux = Math.max(0, degats - armEnnemi);

    ennemisMAJ[idx].pvActuel = Math.max(0, ennemisMAJ[idx].pvActuel - degatsFinaux);
    _gagnerXP(ennemisMAJ[idx].pvActuel <= 0 ? 6 : 1);
    _verifierFinCombat(ennemisMAJ);
    const armInfo = armEnnemi > 0 ? ` [armure -${armEnnemi}]` : '';
    const msg = `${perso.nom} attaque ${ennemisMAJ[idx].nom} : ${arme.label} + FO(${foMod > 0 ? '+' : ''}${foMod}) + Mêlée(${melee})${armInfo} = ${degatsFinaux} dégâts ! (PV : ${ennemisMAJ[idx].pvActuel})`;

    const ordreTaille  = (data.ordre_jeu || []).length || 1;
    const prochainTour = ((data.tour_actuel || 0) + 1) % ordreTaille;

    db.ref('parties/' + sessionActuelle + '/combat_actif').update({
        ennemis: ennemisMAJ,
        tour_actuel: prochainTour
    });
    db.ref('parties/' + sessionActuelle + '/alerte_mj').set({ texte: msg, timestamp: Date.now() });

    if (typeof autoSave === 'function') autoSave();
}
