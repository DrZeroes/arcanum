// ============================================================
// SYSTÈME DE COMBAT — Phase 2
// - Ordre de jeu basé sur la vitesse (DX)
// - Sorts utilisables depuis l'écran combat
// - Sélection de cible (ennemi ou allié)
// ============================================================

window.combatActif = null;
// Actions rapides : { tourKey: numéro du tour initialisé, restantes: nb d'actions bonus restantes }
window._actionsRapides = { tourKey: -1, restantes: 0 };

/** Enregistre un message dans l'historique Firebase et affiche une toast. */
/**
 * Enregistre une entrée dans le log de combat.
 * @param {string} msg   Message court (affiché aux joueurs)
 * @param {string} [detail]  Message détaillé réservé au MJ (optionnel)
 */
function _logCombat(msg, detail) {
    const ref = 'parties/' + sessionActuelle + '/';
    const entry = { texte: msg, detail: detail || null, timestamp: Date.now() };
    db.ref(ref + 'alerte_mj').set({ texte: detail || msg, timestamp: Date.now() });
    db.ref(ref + 'combat_log').push(entry);
}

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

/**
 * Vérifie si tous les joueurs (non-MJ) ET tous les compagnons sont morts → défaite.
 * ordreActuel : tableau ordre_jeu à jour (avec les derniers flags ko des compagnons).
 */
function _verifierDefaite(ordreActuel) {
    const ordre = ordreActuel || [];

    // Index ko depuis ordre_jeu (plus frais que Firebase joueurs après une attaque)
    const koParId = {};
    ordre.forEach(p => { if (p.ko) koParId[p.id || p.nom] = true; });

    // Joueurs dans l'ordre (non-MJ)
    const joueursOrdre = ordre.filter(p => p.type === 'joueur');
    // Compagnons dans l'ordre
    const compsOrdre   = ordre.filter(p => p.type === 'compagnon');

    // Si aucun joueur ni compagnon → pas de défaite possible
    if (joueursOrdre.length === 0 && compsOrdre.length === 0) return;

    // Un joueur/compagnon est KO si : flag ko=true OU pvActuel <= 0
    const tousJoueursKO = joueursOrdre.length === 0 || joueursOrdre.every(p =>
        p.ko || (p.pvActuel !== undefined && p.pvActuel <= 0)
    );
    const tousCompsKO = compsOrdre.length === 0 || compsOrdre.every(p =>
        p.ko || (p.pvActuel ?? 0) <= 0
    );

    if (!tousJoueursKO || !tousCompsKO) return;

    // Double-vérification via Firebase joueurs pour les cas où pvActuel n'est pas dans ordre_jeu
    db.ref('parties/' + sessionActuelle + '/joueurs').once('value', (snap) => {
        const joueurs = snap.val() || {};
        const joueursActifs = Object.values(joueurs).filter(j => !j.estMJ);
        const confirme = joueursActifs.every(j => {
            const id = j.nom?.replace(/\s+/g, '_');
            // KO si : dans ordre_jeu avec ko=true, OU pvActuel Firebase = 0
            return koParId[id] || (j.pvActuel || 0) <= 0;
        });

        if (confirme) {
            _logCombat('💀 Tous les alliés sont tombés — DÉFAITE !');
            db.ref('parties/' + sessionActuelle + '/combat_actif/resultat').set('defaite');
            if (window.estMJ) {
                setTimeout(() => db.ref('parties/' + sessionActuelle + '/combat_actif').remove(), 4000);
            }
        }
    });
}

// ── Barre d'ordre de jeu ─────────────────────────────────────

function _afficherOrdreTour(data) {
    const bar = document.getElementById('combat-ordre-bar');
    if (!bar) return;
    const ordre = data.ordre_jeu || [];
    if (ordre.length === 0) { bar.innerHTML = ''; return; }

    const tourIdx = (data.tour_actuel || 0) % ordre.length;
    const actuelP = ordre[tourIdx];

    // N'afficher que les participants encore en vie
    const vivants = ordre.filter(p => !p.ko);
    if (vivants.length === 0) { bar.innerHTML = ''; return; }

    const moiNom = window.perso?.nom || '';
    const frags = vivants.map(p => {
        const estActuel = actuelP &&
            p.nom === actuelP.nom &&
            p.instanceId === actuelP.instanceId &&
            p.joueurID  === actuelP.joueurID;
        const typeCls = p.type === 'joueur' ? 'tour-joueur'
                      : p.type === 'compagnon' ? 'tour-compagnon'
                      : 'tour-ennemi';
        const estMoi = p.type === 'joueur' && p.nom === moiNom;
        const cls = `combat-tour-pill ${typeCls}${estActuel ? ' actuel' : ''}${estMoi ? ' tour-moi' : ''}`;
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
        // FT ennemi : affiché si disponible (initialisé après premier passe-tour)
        const ftMax    = e.ftMax    ?? null;
        const ftActuel = e.ftActuel ?? null;
        const ftPct    = ftMax > 0 ? Math.round((ftActuel / ftMax) * 100) : 0;
        const ftHtml   = ftMax !== null ? `
                <div class="combat-bar-label"><span>⚡ FT</span><span>${ftActuel} / ${ftMax}</span></div>
                <div class="combat-bar-track"><div class="combat-bar-fill ft" style="width:${ftPct}%;"></div></div>` : '';
        return `
            <div class="combat-ennemi-card${estMort ? ' est-mort' : ''}" id="ennemi-card-${e.instanceId}">
                <div class="combat-ennemi-nom">${e.nom}
                    <span class="combat-ennemi-niv">Niv.${e.niveau || 1}</span>
                </div>
                <div class="combat-bar-label"><span>❤ PV</span><span>${e.pvActuel} / ${e.pvMax}</span></div>
                <div class="combat-bar-track">
                    <div class="combat-bar-fill" style="width:${pvPct}%; background:${couleur};"></div>
                </div>
                ${ftHtml}
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
        // Index des joueurs marqués KO dans ordre_jeu (source de vérité plus fraîche que joueurs FB)
        const ordreKO = {};
        (window.combatActif?.ordre_jeu || []).forEach(p => {
            if (p.type === 'joueur' && p.ko) ordreKO[p.id] = true;
        });
        const frags = Object.values(joueurs).filter(j => !j.estMJ).map(j => {
            // Si marqué KO dans ordre_jeu, forcer pvActuel à 0 (évite stale data après attaque monstre)
            const pvActuel = ordreKO[j.nom?.replace(/\s+/g, '_')] ? 0 : (j.pvActuel ?? 0);
            const pvPct  = j.pvMax > 0 ? Math.round((pvActuel / j.pvMax) * 100) : 0;
            const ftPct  = j.ftMax > 0 ? Math.round(((j.ftActuel ?? 0) / j.ftMax) * 100) : 0;
            const estMoi  = j.nom === window.perso?.nom;
            const estMort = pvActuel <= 0;
            const estEmpoisonne = estMoi ? !!window.perso?.poison : !!j.empoisonne;
            const pvBarStyle = estEmpoisonne ? 'background:#8b4513;' : '';
            const poisonLabel = estEmpoisonne ? '<span style="color:#9c4;font-size:10px;margin-left:4px;">☠ Empoisonné</span>' : '';
            return `
                <div class="combat-joueur-card${estMoi ? ' est-moi' : ''}${estMort ? ' est-mort' : ''}${estEmpoisonne ? ' est-empoisonne' : ''}">
                    <div class="combat-joueur-nom">${j.nom}${poisonLabel}
                        <span class="combat-joueur-niv">Niv.${j.niveau || 1}</span>
                    </div>
                    <div class="combat-bar-label"><span>❤ PV</span><span>${pvActuel} / ${j.pvMax ?? 0}</span></div>
                    <div class="combat-bar-track"><div class="combat-bar-fill pv" style="width:${pvPct}%;${pvBarStyle}"></div></div>
                    <div class="combat-bar-label"><span>⚡ FT</span><span>${j.ftActuel ?? 0} / ${j.ftMax ?? 0}</span></div>
                    <div class="combat-bar-track"><div class="combat-bar-fill ft" style="width:${ftPct}%;"></div></div>
                    ${j.nom === window.perso?.nom
                        ? '<div id="combat-xp-moi">' + _genererLedsXP(window.perso.xp || 0, window.perso.niveau || 1, window.perso) + '</div>'
                        : '<div class="xp-leds-other">' + _genererLedsXP(j.xp || 0, j.niveau || 1) + '</div>'}
                </div>`;
        });

        // Compagnons présents dans l'ordre de jeu
        const compagnons = (window.combatActif?.ordre_jeu || []).filter(p => p.type === 'compagnon');
        const fragsComp = compagnons.map(c => {
            const cPvMax = c.pvMax ?? 0;
            const cFtMax = c.ftMax ?? 0;
            return `
            <div class="combat-joueur-card compagnon-card-combat" style="padding:4px 6px;">
                <div class="combat-joueur-nom" style="font-size:11px;">🤝 ${c.nom}
                    <span class="combat-joueur-niv">Niv.${c.niveau || 1} · ${c.ownerNom || ''}</span>
                </div>
                <div style="display:flex; gap:8px; font-size:11px; color:#ccc; margin-top:2px;">
                    <span>❤ ${c.pvActuel ?? '?'}/${cPvMax || '?'}</span>
                    <span>⚡ ${c.ftActuel ?? '?'}/${cFtMax || '?'}</span>
                </div>
            </div>`;
        });

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

    // ── Joueur mort : aucune action possible ──
    const persoMort = window.perso;
    if ((persoMort?.pvActuel ?? 0) <= 0) {
        panel.innerHTML = `<div class="combat-actions-titre" style="color:#8b0000; text-align:center; padding:16px;">
            💀 Vous êtes mort<br><span style="font-size:0.85em; color:#aaa;">En attente de résurrection…</span>
        </div>`;
        if (statut) { statut.textContent = '💀 Vous êtes mort.'; statut.style.color = '#8b0000'; }
        return;
    }

    // ── Régénération PV au début du tour (une seule fois par tour) ──
    const perso    = window.perso;
    const tourKey  = data.tour_actuel || 0;
    if (window._dernierTourRegen !== tourKey) {
        window._dernierTourRegen = tourKey;
        const guerison = _getGuerison(perso);
        const maxPVRegen = (perso.statsBase.FO * 2) + (perso.statsBase.IN)
            + ((perso.statsInvesties?.FO || 0) * 2) + (perso.statsInvesties?.IN || 0)
            + (perso.boostPV || 0);
        if (guerison > 0 && perso.pvActuel < maxPVRegen && perso.pvActuel > 0) {
            perso.pvActuel = Math.min(maxPVRegen, (perso.pvActuel || 0) + guerison);
            if (typeof _toast === 'function') _toast(`💚 Régénération : +${guerison} PV`, 'success');
            if (typeof autoSave === 'function') autoSave();
            if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
        }
        _decrementerEffetsTemporaires();
    }

    // ── Init actions rapides pour ce tour ──
    const _eqRapideSlot = perso.equipement?.main_droite || perso.equipement?.deux_mains || perso.equipement?.main_gauche;
    const _weaponActionsParTour = (typeof itemsData !== 'undefined' && _eqRapideSlot)
        ? (itemsData[_eqRapideSlot.id]?.actionsParTour || 1) : 1;
    if (window._actionsRapides.tourKey !== tourKey) {
        window._actionsRapides = { tourKey: tourKey, max: _weaponActionsParTour, restantes: _weaponActionsParTour };
    }
    const _estActionBonus = window._actionsRapides.restantes < window._actionsRapides.max
        && window._actionsRapides.restantes > 0;

    // ── Épuisé : seul "Passer le tour" est disponible ──
    const guerison = _getGuerison(perso);
    if ((perso.ftActuel ?? 0) <= 0) {
        panel.innerHTML = `<div class="combat-actions-titre" style="color:#f44336;">😴 Épuisé — ne peut pas agir</div>
            <button class="combat-sort-btn" onclick="passerTourCombat()">
                <span class="sort-nom">💤 Passer le tour</span>
                <span class="sort-meta">+${guerison} FT (Guérison)</span>
            </button>`;
        return;
    }

    // ── Bouton Attaquer ──
    const fo       = (perso.statsBase?.FO || 0) + (perso.statsInvesties?.FO || 0);
    // foMod s'applique uniquement aux armes de mêlée et au corps à corps
    const _eqSlotPanel = perso.equipement || {};
    const _armePanel = _eqSlotPanel.main_droite || _eqSlotPanel.deux_mains || _eqSlotPanel.main_gauche;
    const _typePanelArme = (typeof itemsData !== 'undefined' && _armePanel) ? (itemsData[_armePanel.id]?.type || '') : '';
    const _estMelee = !_armePanel || _typePanelArme === 'arme_melee';
    let foMod      = _estMelee ? (fo > 10 ? fo - 10 : Math.floor((fo - 10) / 2)) : 0;
    if (_estMelee && fo >= 20) foMod *= 2; // Bonus FO ≥ 20 : Modif. Dégâts doublé
    const melee    = perso.compInvesties?.melee || 0;
    const armureTot = _armureTotal(perso);
    // Nom de l'arme équipée
    let armNom = 'Poing';
    if (typeof itemsData !== 'undefined') {
        const eq = perso.equipement || {};
        const slot = eq.main_droite || eq.deux_mains || eq.main_gauche;
        if (slot && itemsData[slot.id]) armNom = itemsData[slot.id].nom;
    }
    const _bonusLabel = _estActionBonus
        ? `<div class="combat-actions-titre" style="color:#f0b429; font-size:0.9em;">⚡ Action rapide !</div>`
        : '';
    let html = _bonusLabel + `<div class="combat-actions-titre">Actions</div>
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

    // ── Passer son tour ──
    html += `<button class="combat-sort-btn" onclick="passerTourCombat()" style="margin-top:8px; opacity:0.75;">
        <span class="sort-nom">⏭ Passer son tour</span>
        <span class="sort-meta">+${guerison} FT (Guérison)</span>
    </button>`;

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
        const estOffensif  = !!degParts;
        const estResurrect = !!data.stats?.resurrection;
        const estSoin      = !estResurrect && (soinPV > 0 || soinFT > 0);
        if (!estOffensif && !estSoin && !estResurrect) return; // pas d'effet connu en combat
        const key = it.id;
        if (vus[key]) return; // déjà affiché
        vus[key] = true;
        const qte = it.quantite || 1;
        const meta = estResurrect
            ? `✨ Résurrection (+${soinPV} PV)`
            : estSoin
            ? (soinPV > 0 ? `💚+${soinPV}PV` : '') + (soinFT > 0 ? ` ⚡+${soinFT}FT` : '')
            : `⚔ ${data.degats} dég.`;
        const onclick = estResurrect
            ? `ouvrirCiblesObjet('${it.id}', 'resurrection')`
            : estSoin
            ? `ouvrirCiblesObjet('${it.id}', 'soin')`
            : `ouvrirCiblesObjet('${it.id}', 'offensif')`;
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
    } else if (mode === 'soin') {
        // Mode soin : fetch tous les joueurs en une seule passe puis rendre
        const _itemSoinDef = (typeof itemsData !== 'undefined') ? itemsData[_objetCombatEnCours?.itemId] : null;
        const _soinPV = _itemSoinDef?.stats?.soinPV || 0;
        const _soinFT = _itemSoinDef?.stats?.soinFT || 0;
        const _peutSoigner = (pvA, pvM, ftA, ftM) => {
            if (_soinPV > 0 && pvA < pvM) return true;
            if (_soinFT > 0 && ftA < ftM) return true;
            return false;
        };
        const _renderSoin = (joueurs) => {
            const moiId = (window.perso?.nom || '').replace(/\s+/g, '_');
            let html = titre + `<div class="combat-cibles-label allie">💚 Alliés</div>`;
            let nbCibles = 0;
            const moiPV = window.perso?.pvActuel ?? 0, moiPVMax = window.perso?.pvMax ?? 0;
            const moiFT = window.perso?.ftActuel ?? 0, moiFTMax = window.perso?.ftMax ?? 0;
            if (_peutSoigner(moiPV, moiPVMax, moiFT, moiFTMax)) {
                html += `<button class="combat-cible-btn allie" onclick="utiliserObjetCombat('${moiId}')">Vous-même</button>`;
                nbCibles++;
            }
            for (let id in joueurs) {
                if (joueurs[id].estMJ) continue;
                if ((joueurs[id].pvActuel || 0) <= 0 || joueurs[id].nom === window.perso?.nom) continue;
                if (!_peutSoigner(joueurs[id].pvActuel, joueurs[id].pvMax, joueurs[id].ftActuel, joueurs[id].ftMax)) continue;
                html += `<button class="combat-cible-btn allie" onclick="utiliserObjetCombat('${id}')">
                    ${joueurs[id].nom} <span class="cible-pv">PV ${joueurs[id].pvActuel}/${joueurs[id].pvMax}</span>
                </button>`;
                nbCibles++;
            }
            const compagnons = (window.combatActif?.ordre_jeu || []).filter(p => p.type === 'compagnon' && !p.ko);
            compagnons.forEach(c => {
                if (!_peutSoigner(c.pvActuel ?? 0, c.pvMax || 0, c.ftActuel ?? 0, c.ftMax || 0)) return;
                const nomSafe = c.nom.replace(/'/g, "\\'");
                html += `<button class="combat-cible-btn allie"
                    onclick="utiliserObjetSurCompagnon('${c.ownerID}', ${c.compIdx}, '${nomSafe}')">
                    🤝 ${c.nom} <span class="cible-pv">PV ${c.pvActuel ?? '?'}/${c.pvMax ?? '?'}</span>
                </button>`;
                nbCibles++;
            });
            if (nbCibles === 0) html += `<p class="combat-vide" style="color:#f66;">Aucune cible disponible — tous les alliés sont déjà au maximum.</p>`;
            panel.innerHTML = html + annuler;
        };
        if (typeof db !== 'undefined') {
            db.ref('parties/' + sessionActuelle + '/joueurs').once('value', (snap) => _renderSoin(snap.val() || {}));
        } else {
            _renderSoin({});
        }
    } else if (mode === 'resurrection') {
        // Cible uniquement les alliés morts (pvActuel <= 0)
        const _renderResurrect = (joueurs) => {
            let html = titre + `<div class="combat-cibles-label allie">✨ Alliés morts</div>`;
            let nbCibles = 0;
            for (let id in joueurs) {
                if (joueurs[id].estMJ) continue;
                if (joueurs[id].nom === window.perso?.nom) continue;
                if ((joueurs[id].pvActuel || 0) > 0) continue; // vivant : pas de cible pour résurrection
                html += `<button class="combat-cible-btn allie" onclick="utiliserObjetCombat('${id}')">
                    💀 ${joueurs[id].nom}
                </button>`;
                nbCibles++;
            }
            if (nbCibles === 0) html += `<p class="combat-vide" style="color:#f66;">Aucun allié mort à ressusciter.</p>`;
            panel.innerHTML = html + annuler;
        };
        if (typeof db !== 'undefined') {
            db.ref('parties/' + sessionActuelle + '/joueurs').once('value', (snap) => _renderResurrect(snap.val() || {}));
        } else {
            _renderResurrect({});
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
        const ordreMAJObj = _marquerKODansOrdre(data?.ordre_jeu || [], ennemisMAJ);
        db.ref('parties/' + sessionActuelle + '/combat_actif').update({
            ennemis: ennemisMAJ,
            ordre_jeu: ordreMAJObj,
            tour_actuel: _prochainTourVivant(ordreMAJObj, data?.tour_actuel || 0)
        });
    } else if (mode === 'resurrection') {
        // Ressusciter un allié mort
        const soinPV = itemDef.stats?.soinPV || 5;
        db.ref('parties/' + sessionActuelle + '/joueurs/' + cibleId + '/modif_stat').set({
            stat: 'PV', valeur: soinPV, resurrection: true, timestamp: Date.now()
        });
        msg = `${window.perso.nom} utilise ${itemDef.nom} — ✨ Résurrection ! (+${soinPV} PV)`;
        const ordreActuel = data?.ordre_jeu || [];
        db.ref('parties/' + sessionActuelle + '/combat_actif/tour_actuel')
            .set(_prochainTourVivant(ordreActuel, data?.tour_actuel || 0));
    } else {
        const soinPV = itemDef.stats?.soinPV || 0;
        const soinFT = itemDef.stats?.soinFT || 0;
        const curePoison = !!itemDef.stats?.curePoison;
        const moiId = window.userUID || '';
        const estSurMoi = (cibleId === moiId);

        if (curePoison) {
            if (estSurMoi) {
                window.perso.poison = null;
                if (typeof _toast === 'function') _toast('✅ Poison neutralisé !', 'success');
                if (typeof autoSave === 'function') autoSave();
            } else {
                db.ref('parties/' + sessionActuelle + '/joueurs/' + cibleId + '/modif_stat').set({
                    stat: 'curePoison', valeur: 0, timestamp: Date.now()
                });
            }
        }
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
        const cibleNom = estSurMoi ? window.perso.nom : 'un allié';
        msg = `${window.perso.nom} utilise ${itemDef.nom} sur ${cibleNom}.${curePoison ? ' ☠→✅ Poison neutralisé !' : ''}`;
        const ordreActuel = data?.ordre_jeu || [];
        db.ref('parties/' + sessionActuelle + '/combat_actif/tour_actuel')
            .set(_prochainTourVivant(ordreActuel, data?.tour_actuel || 0));
    }

    if (msg) _logCombat(msg);
    _objetCombatEnCours = null;
}

/** Applique un soin d'objet sur un compagnon (ownerID + compIdx). */
function utiliserObjetSurCompagnon(ownerID, compIdx, compNom) {
    const { itemId } = _objetCombatEnCours || {};
    if (!itemId || !window.perso) return;
    const itemDef = (typeof itemsData !== 'undefined') ? itemsData[itemId] : null;
    if (!itemDef) return;

    const inv = window.perso.inventaire || [];
    const idx = inv.findIndex(i => i.id === itemId);
    if (idx === -1) return;
    if (inv[idx].quantite > 1) { inv[idx].quantite--; } else { inv.splice(idx, 1); }
    window.perso.inventaire = inv;
    if (typeof autoSave === 'function') autoSave();
    if (typeof synchroniserJoueur === 'function') synchroniserJoueur();

    const soinPV = itemDef.stats?.soinPV || 0;
    const soinFT = itemDef.stats?.soinFT || 0;
    db.ref('parties/' + sessionActuelle + '/joueurs/' + ownerID + '/compagnon_action').set({
        type: 'soin', compIdx, pvGain: soinPV, ftGain: soinFT, timestamp: Date.now()
    });

    const data = window.combatActif;
    db.ref('parties/' + sessionActuelle + '/combat_actif/tour_actuel')
        .set(_prochainTourVivant(data?.ordre_jeu || [], data?.tour_actuel || 0));
    _logCombat(`${window.perso.nom} utilise ${itemDef.nom} sur ${compNom} : +${soinPV} PV / +${soinFT} FT`);
    _objetCombatEnCours = null;
}

/** Applique un sort de soin sur un compagnon (ownerID + compIdx). */
function finaliserSortSurCompagnon(ownerID, compIdx, compNom) {
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

    const align = window.perso.alignementMagique || 0;
    const crit = _lancerCritique(window.perso);
    let soin = s.soin === 999 ? 9999 : Math.floor(s.soin + (align / 100) * s.soin);
    let critLabel = '';
    if (s.soin !== 999) {
        if (crit.type === 'echec') { soin = 0; critLabel = ' ⚠ ÉCHEC CRITIQUE'; }
        else if (crit.type === 'critique') { soin = Math.round(soin * crit.mult); critLabel = ' ⚡ CRITIQUE !'; }
    }
    db.ref('parties/' + sessionActuelle + '/joueurs/' + ownerID + '/compagnon_action').set({
        type: 'soin', compIdx, pvGain: soin, ftGain: 0, timestamp: Date.now()
    });

    const data = window.combatActif;
    db.ref('parties/' + sessionActuelle + '/combat_actif/tour_actuel')
        .set(_prochainTourVivant(data?.ordre_jeu || [], data?.tour_actuel || 0));
    _logCombat(`${window.perso.nom} lance ${s.nom}${critLabel} sur ${compNom} : +${soin} PV`);
    _sortCombatEnCours = null;
}

// ── Sélection de cible ────────────────────────────────────────

let _sortCombatEnCours = null;

function ouvrirCiblesSortCombat(nomSort) {
    const s = (typeof trouverSort === 'function') ? trouverSort(nomSort) : null;
    if (!s) return;
    _sortCombatEnCours = s;

    const data           = window.combatActif;
    const ennemisVivants = (data?.ennemis || []).filter(e => e.pvActuel > 0);
    const peutEnnemis    = !!s.degats || (!s.soin && !s.resurrection && !s.buffStat);
    const peutAllie      = !!s.soin || !!s.resurrection || !!s.buffStat;

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

        let nbCibles = 0;

        if (peutEnnemis && ennemisVivants.length > 0) nbCibles += ennemisVivants.length;

        if (peutAllie) {
            html += `<div class="combat-cibles-label allie">💚 Alliés</div>`;
            const moiId = (window.perso?.nom || '').replace(/\s+/g, '_');
            const moiPV = window.perso?.pvActuel ?? 0, moiPVMax = window.perso?.pvMax ?? 0;
            if (s.resurrection || s.buffStat || moiPV < moiPVMax) {
                html += `<button class="combat-cible-btn allie"
                    onclick="finaliserSortCombat('${moiId}', 'joueur')">Vous-même</button>`;
                nbCibles++;
            }
            for (let id in joueurs) {
                if (joueurs[id].estMJ) continue;
                if (joueurs[id].nom === window.perso?.nom) continue;
                if (!s.resurrection && !s.buffStat && (joueurs[id].pvActuel || 0) <= 0) continue;
                if (s.resurrection && (joueurs[id].pvActuel || 0) > 0) continue;
                if (!s.resurrection && !s.buffStat && (joueurs[id].pvActuel || 0) >= (joueurs[id].pvMax || 0)) continue;
                html += `<button class="combat-cible-btn allie"
                    onclick="finaliserSortCombat('${id}', 'joueur')">
                    ${joueurs[id].nom} <span class="cible-pv">PV ${joueurs[id].pvActuel}/${joueurs[id].pvMax}</span>
                </button>`;
                nbCibles++;
            }
            const compagnons = (window.combatActif?.ordre_jeu || []).filter(p => p.type === 'compagnon' && !p.ko);
            compagnons.forEach(c => {
                if (!s.resurrection && !s.buffStat && (c.pvActuel ?? 0) >= (c.pvMax || 0)) return;
                const nomSafe = c.nom.replace(/'/g, "\\'");
                html += `<button class="combat-cible-btn allie"
                    onclick="finaliserSortSurCompagnon('${c.ownerID}', ${c.compIdx}, '${nomSafe}')">
                    🤝 ${c.nom} <span class="cible-pv">PV ${c.pvActuel ?? '?'}/${c.pvMax ?? '?'}</span>
                </button>`;
                nbCibles++;
            });
        }

        if (nbCibles === 0) html += `<p class="combat-vide" style="color:#f66;">Aucune cible disponible.</p>`;
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
            const crit = _lancerCritique(window.perso);
            let degats = Math.floor(s.degats + (align / 100) * s.degats);
            let critLabel = '';
            if (crit.type === 'echec') {
                degats    = 0;
                critLabel = ' ⚠ ÉCHEC CRITIQUE';
            } else if (crit.type === 'critique') {
                degats    = Math.round(degats * crit.mult);
                critLabel = crit.mult >= 2 ? ' ⚡ CRITIQUE ×2 !' : ' ⚡ CRITIQUE ×1.5 !';
            }
            ennemisMAJ[idx].pvActuel = Math.max(0, ennemisMAJ[idx].pvActuel - degats);
            if (degats > 0) _gagnerXP(ennemisMAJ[idx].pvActuel <= 0 ? 6 : 1);
            msg = `${window.perso.nom} lance ${s.nom} sur ${ennemisMAJ[idx].nom}${critLabel} : ${degats} dégâts ! (PV restants : ${ennemisMAJ[idx].pvActuel})`;
        }

        const ordreMAJSort = _marquerKODansOrdre(data.ordre_jeu || [], ennemisMAJ);

        // ── Sort rapide ──────────────────────────────────────────
        const _tousEnnemisKOSort = ennemisMAJ.every(e => e.pvActuel <= 0);
        _verifierFinCombat(ennemisMAJ);
        if (s.rapide && !_tousEnnemisKOSort) {
            const _tourActuelSort = data.tour_actuel || 0;
            if (window._actionsRapides.tourKey !== _tourActuelSort) {
                window._actionsRapides = { tourKey: _tourActuelSort, max: 2, restantes: 2 };
            }
            window._actionsRapides.restantes = Math.max(0, window._actionsRapides.restantes - 1);
        }
        const _aEncoreActionsSort = s.rapide && !_tousEnnemisKOSort && window._actionsRapides.restantes > 0;

        if (_aEncoreActionsSort) {
            db.ref('parties/' + sessionActuelle + '/combat_actif').update({
                ennemis:   ennemisMAJ,
                ordre_jeu: ordreMAJSort
            });
            _logCombat(msg);
            window.combatActif = Object.assign({}, window.combatActif, { ennemis: ennemisMAJ, ordre_jeu: ordreMAJSort });
            _afficherEnnemis(window.combatActif);
            _afficherPanneauActions(window.combatActif);
        } else {
            db.ref('parties/' + sessionActuelle + '/combat_actif').update({
                ennemis:    ennemisMAJ,
                ordre_jeu:  ordreMAJSort,
                tour_actuel: _prochainTourVivant(ordreMAJSort, data.tour_actuel || 0)
            });
            _logCombat(msg);
        }

    } else if (typeCible === 'joueur') {
        const moiId = window.userUID || '';
        const estSurMoi = (cibleId === moiId);
        let soinMsg = `${window.perso.nom} lance ${s.nom} sur ${estSurMoi ? window.perso.nom : 'un allié'}.`;

        // Sort antidote (curePoison)
        if (s.curePoison) {
            if (estSurMoi) {
                window.perso.poison = null;
                if (typeof _toast === 'function') _toast('✅ Poison neutralisé !', 'success');
                if (typeof autoSave === 'function') autoSave();
                if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
            } else {
                db.ref('parties/' + sessionActuelle + '/joueurs/' + cibleId + '/modif_stat').set({
                    stat: 'curePoison', valeur: 0, timestamp: Date.now()
                });
            }
            soinMsg = `${window.perso.nom} lance ${s.nom} sur ${estSurMoi ? window.perso.nom : 'un allié'} — ☠→✅ Poison neutralisé !`;
        }

        if (s.soin) {
            const crit = _lancerCritique(window.perso);
            let soin = s.soin === 999 ? 9999 : Math.floor(s.soin + (align / 100) * s.soin);
            let critLabel = '';
            if (s.soin !== 999) { // jamais d'échec critique sur une résurrection
                if (crit.type === 'echec') {
                    soin = 0;
                    critLabel = ' ⚠ ÉCHEC CRITIQUE';
                } else if (crit.type === 'critique') {
                    soin = Math.round(soin * crit.mult);
                    critLabel = crit.mult >= 2 ? ' ⚡ CRITIQUE ×2 !' : ' ⚡ CRITIQUE ×1.5 !';
                }
            }
            if (soin > 0) {
                db.ref('parties/' + sessionActuelle + '/joueurs/' + cibleId + '/modif_stat').set({
                    stat: 'PV', valeur: soin, timestamp: Date.now()
                });
            }
            soinMsg = `${window.perso.nom} lance ${s.nom}${critLabel} : +${soin} PV à ${estSurMoi ? window.perso.nom : 'un allié'} !`;
        }

        if (s.buffStat) {
            const signe = s.buffVal > 0 ? '+' : '';
            db.ref('parties/' + sessionActuelle + '/joueurs/' + cibleId + '/effets_actifs').push({
                icone: s.buffVal > 0 ? '✨' : '💀',
                nom: s.nom.trim(),
                type: s.buffVal > 0 ? 'benediction' : 'malediction',
                stats: { [s.buffStat]: s.buffVal },
                temporaire: true,
                toursRestants: s.buffDuree || 3
            });
            _gagnerXP(2);
            soinMsg = `${window.perso.nom} lance ${s.nom} sur ${estSurMoi ? window.perso.nom : 'un allié'} — ${s.buffStat} ${signe}${s.buffVal} pendant ${s.buffDuree || 3} tours !`;
        }

        // ── Rapid + avancement de tour ─────────────────────────
        const _tourActuelJoueur = data.tour_actuel || 0;
        if (s.rapide) {
            if (window._actionsRapides.tourKey !== _tourActuelJoueur) {
                window._actionsRapides = { tourKey: _tourActuelJoueur, max: 2, restantes: 2 };
            }
            window._actionsRapides.restantes = Math.max(0, window._actionsRapides.restantes - 1);
        }
        if (s.rapide && window._actionsRapides.restantes > 0) {
            _logCombat(soinMsg);
            _afficherPanneauActions(data);
        } else {
            db.ref('parties/' + sessionActuelle + '/combat_actif/tour_actuel')
                .set(_prochainTourVivant(data.ordre_jeu || [], _tourActuelJoueur));
            _logCombat(soinMsg);
        }
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

/** MJ envoie de l'XP à un compagnon via Firebase → le joueur l'applique. Met aussi à jour ordre_jeu pour la jauge. */
function _gagnerXPCompagnon(ownerID, compIdx, montant) {
    if (!ownerID || compIdx === undefined) return;
    // Notification au joueur
    db.ref('parties/' + sessionActuelle + '/joueurs/' + ownerID + '/compagnon_action').set({
        type: 'xp_gain',
        compIdx,
        montant,
        timestamp: Date.now()
    });
    // Mise à jour de l'XP dans ordre_jeu pour rafraîchir la jauge en temps réel
    const data = window.combatActif;
    if (!data?.ordre_jeu) return;
    const ordreMAJ = data.ordre_jeu.map(p => {
        if (p.type !== 'compagnon' || p.ownerID !== ownerID || p.compIdx !== compIdx) return p;
        const newXp = (p.xp || 0) + montant;
        const needed = 10 + ((p.niveau || 1) - 1) * 5;
        const newNiveau = newXp >= needed ? (p.niveau || 1) + 1 : (p.niveau || 1);
        return Object.assign({}, p, { xp: newXp >= needed ? newXp - needed : newXp, niveau: newNiveau });
    });
    db.ref('parties/' + sessionActuelle + '/combat_actif/ordre_jeu').set(ordreMAJ);
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
        let html = '<div class="combat-actions-titre">⚔ ' + participant.nom + ' attaque</div>'
            + '<div class="combat-cibles-label allie">Choisir la cible</div>';
        db.ref('parties/' + sessionActuelle + '/joueurs').once('value', (snap) => {
            const joueurs = snap.val() || {};
            const discrets = window.combatActif?.joueurs_discrets || {};
            const premierTour = !(window._ennemisOntAttaque?.has(participant.instanceId));

            for (let id in joueurs) {
                if (joueurs[id].estMJ) continue;
                if ((joueurs[id].pvActuel || 0) > 0) {
                    const estDiscret = premierTour && discrets[id] === true;
                    if (estDiscret) {
                        html += '<button class="combat-cible-btn allie" disabled style="opacity:0.35; cursor:not-allowed;">'
                            + '🫥 ' + joueurs[id].nom + ' <span class="cible-pv">(discret)</span>'
                            + '</button>';
                    } else {
                        html += '<button class="combat-cible-btn allie" onclick="mjAttaqueMonstreJoueur(\'' + id + '\', \'' + joueurs[id].nom + '\')">'
                            + joueurs[id].nom + ' <span class="cible-pv">PV ' + joueurs[id].pvActuel + '/' + joueurs[id].pvMax + '</span>'
                            + '</button>';
                    }
                }
            }
            // Compagnons comme cibles
            const ordreComps = (window.combatActif?.ordre_jeu || []).filter(p => p.type === 'compagnon' && !p.ko);
            if (ordreComps.length > 0) {
                html += '<div class="combat-cibles-label" style="color:#ffe082; margin-top:6px;">🤝 Compagnons</div>';
                ordreComps.forEach(c => {
                    const nomSafe = c.nom.replace(/'/g, "\\'");
                    html += '<button class="combat-cible-btn allie" style="border-color:#ffe082;" onclick="mjAttaqueMonstreCompagnon(' + participant.instanceId + ', ' + c.compIdx + ', \'' + c.ownerID + '\', \'' + nomSafe + '\')">'
                        + '🤝 ' + c.nom + ' <span class="cible-pv">PV ' + (c.pvActuel ?? '?') + '/' + (c.pvMax || '?') + '</span>'
                        + '</button>';
                });
            }
            const guerisonEnnemi = Math.max(1, Math.floor((participant.niveau || 1) / 3));
            html += '<button class="combat-sort-btn" onclick="mjPasserTourEnnemi(' + participant.instanceId + ')" style="margin-top:8px; opacity:0.75; width:100%;">'
                + '<span class="sort-nom">⏭ Passer le tour</span>'
                + '<span class="sort-meta">+' + guerisonEnnemi + ' (Guérison)</span></button>';
            panel.innerHTML = html;
        });
    } else {
        // Le compagnon — lecture live des données depuis Firebase pour éviter les données périmées
        const _buildCompHtml = (magieInv, inventaireComp, ftComp, statsBaseComp, statsInvComp) => {
            const guerisonComp = Math.max(1, Math.floor(((statsBaseComp?.CN || 5) + (statsInvComp?.CN || 0)) / 3));
            let html = '<div class="combat-actions-titre">🤝 ' + participant.nom + '</div>';

            // Si épuisé : seul "passer le tour" disponible
            if ((ftComp ?? 1) <= 0) {
                html += '<div style="color:#f44336; margin:6px 0; text-align:center;">😴 Épuisé — ne peut pas agir</div>';
                html += '<button class="combat-sort-btn" onclick="mjPasserTourCompagnon(\'' + participant.ownerID + '\',' + participant.compIdx + ',' + guerisonComp + ')">'
                    + '<span class="sort-nom">💤 Passer le tour</span>'
                    + '<span class="sort-meta">+' + guerisonComp + ' FT (Guérison)</span></button>';
                panel.innerHTML = html;
                return;
            }

            // Attaque mêlée
            html += '<div class="combat-cibles-label ennemi">⚔ Attaque mêlée</div>';
            if (ennemisVivants.length === 0) {
                html += '<p class="combat-vide">Aucun ennemi vivant.</p>';
            } else {
                ennemisVivants.forEach(e => {
                    html += '<button class="combat-cible-btn ennemi" onclick="mjAttaqueCompagnonEnnemi(' + e.instanceId + ')">'
                        + e.nom + ' <span class="cible-pv">PV ' + e.pvActuel + '/' + e.pvMax + '</span></button>';
                });
            }

            // Sorts
            const sortsDuComp = _getSortsCompagnon({ magieInvesties: magieInv });
            if (sortsDuComp.length > 0) {
                html += '<div class="combat-cibles-label" style="color:#9575cd; margin-top:6px;">✨ Sorts</div>';
                if (!window._mjActionsData) window._mjActionsData = {};
                sortsDuComp.forEach(s => {
                    const meta = s.degats ? '⚔ ' + s.degats + ' dég.' : s.soin ? '💚 Soin' : '✨ Effet';
                    const key = 'sort_' + s.nom.replace(/\W/g, '') + '_' + Date.now();
                    window._mjActionsData[key] = { nomSort: s.nom, ennemis: ennemisVivants.map(e => ({instanceId: e.instanceId, nom: e.nom, pvActuel: e.pvActuel, pvMax: e.pvMax})) };
                    html += '<button class="combat-sort-btn" onclick="mjUtiliserSortCompagnon(\'' + key + '\')" style="width:100%; margin:2px 0;">'
                        + '<span class="sort-nom">' + s.nom + '</span>'
                        + '<span class="sort-meta">' + meta + ' · ' + (s.cout || 0) + ' FT</span></button>';
                });
            }

            // Objets consommables
            const inv = inventaireComp || [];
            const consomVus = {};
            let itemsHtml = '';
            inv.forEach(it => {
                if (!it || !it.id || consomVus[it.id]) return;
                const def = (typeof itemsData !== 'undefined') ? itemsData[it.id] : null;
                if (!def || def.type !== 'consommable') return;
                consomVus[it.id] = true;
                const qte = it.quantite || 1;
                const soin = def.stats?.soinPV || def.stats?.soinFT || 0;
                const meta = soin > 0 ? '💚 +' + soin : def.degats ? '💥 ' + def.degats : '✨';
                if (!window._mjActionsData) window._mjActionsData = {};
                const itemKey = 'item_' + it.id + '_' + Date.now();
                window._mjActionsData[itemKey] = { itemId: it.id, participant: { nom: participant.nom, ownerID: participant.ownerID, compIdx: participant.compIdx } };
                itemsHtml += '<button class="combat-sort-btn" onclick="mjOuvrirCiblesItemCompagnon(\'' + itemKey + '\')" style="width:100%; margin:2px 0;">'
                    + '<span class="sort-nom">🎒 ' + def.nom + ' (' + qte + ')</span>'
                    + '<span class="sort-meta">' + meta + '</span></button>';
            });
            if (itemsHtml) html += '<div class="combat-cibles-label" style="color:#ff9800; margin-top:6px;">🎒 Objets</div>' + itemsHtml;

            // Bouton passer le tour
            html += '<button class="combat-sort-btn" onclick="mjPasserTourCompagnon(\'' + participant.ownerID + '\',' + participant.compIdx + ',' + guerisonComp + ')" style="margin-top:8px; opacity:0.75;">'
                + '<span class="sort-nom">⏭ Passer le tour</span>'
                + '<span class="sort-meta">+' + guerisonComp + ' FT (Guérison)</span></button>';

            panel.innerHTML = html;
        };

        // Lecture live depuis Firebase (nœud dédié compagnons)
        const ownerID = participant.ownerID;
        if (ownerID) {
            db.ref('parties/' + sessionActuelle + '/compagnons/' + ownerID)
                .once('value', snap => {
                    const arr = snap.val();
                    if (arr) {
                        const list = Array.isArray(arr) ? arr : Object.values(arr);
                        const c = list.find(x => x.nom === participant.nom);
                        if (c) {
                            _buildCompHtml(c.magieInvesties || null, c.inventaire || null, c.ftActuel, c.statsBase, c.statsInvesties);
                            return;
                        }
                    }
                    // Fallback sur les données de l'ordre_jeu
                    _buildCompHtml(participant.magieInvesties, participant.inventaire, participant.ftActuel, participant.statsBase, participant.statsInvesties);
                });
        } else {
            _buildCompHtml(participant.magieInvesties, participant.inventaire, participant.ftActuel, participant.statsBase, participant.statsInvesties);
        }
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

/** MJ ouvre la sélection de cible pour un objet de compagnon. */
function mjOuvrirCiblesItemCompagnon(key) {
    const d = window._mjActionsData?.[key];
    if (!d) return;
    const { itemId, participant } = d;
    const def = (typeof itemsData !== 'undefined') ? itemsData[itemId] : null;
    if (!def) return;
    const panel = document.getElementById('combat-actions-panel');
    if (!panel) return;

    const data = window.combatActif;
    const ennemisVivants = (data?.ennemis || []).filter(e => e.pvActuel > 0);
    const estOffensif = !!(def.degats);
    const estSoin     = !!(def.stats?.soinPV || def.stats?.soinFT);

    const soinPV = def.stats?.soinPV || 0;
    const soinFT = def.stats?.soinFT || 0;
    if (estSoin) {
        db.ref('parties/' + sessionActuelle + '/joueurs').once('value', (snap) => {
            const joueurs = snap.val() || {};
            let html = '<div class="combat-actions-titre">🎒 ' + def.nom + ' — Cible</div>'
                + '<div class="combat-cibles-label allie">💚 Alliés</div>';
            for (let id in joueurs) {
                if (joueurs[id].estMJ) continue;
                if ((joueurs[id].pvActuel || 0) <= 0) continue;
                // filtre full-HP
                const estPleinPV = soinPV > 0 && (joueurs[id].pvActuel || 0) >= (joueurs[id].pvMax || 0);
                const estPleinFT = soinFT > 0 && (joueurs[id].ftActuel || 0) >= (joueurs[id].ftMax || 0);
                if (soinPV > 0 && soinFT > 0 && estPleinPV && estPleinFT) continue;
                if (soinPV > 0 && !soinFT && estPleinPV) continue;
                if (soinFT > 0 && !soinPV && estPleinFT) continue;
                const cibleKey = 'cible_' + id + '_' + Date.now();
                window._mjActionsData[cibleKey] = { itemId, participant, cibleId: id, typeCible: 'joueur' };
                html += '<button class="combat-cible-btn allie" onclick="mjAppliquerItemCompagnon(\'' + cibleKey + '\')">'
                    + joueurs[id].nom + ' <span class="cible-pv">PV ' + joueurs[id].pvActuel + '/' + joueurs[id].pvMax + '</span></button>';
            }
            // Compagnons
            const ordreComps = (window.combatActif?.ordre_jeu || []).filter(p => p.type === 'compagnon' && !p.ko);
            let nbCiblesMJ = Object.keys(joueurs).filter(id => !joueurs[id].estMJ && (joueurs[id].pvActuel || 0) > 0).length;
            ordreComps.forEach(c => {
                const estPleinPV = soinPV > 0 && (c.pvActuel ?? 0) >= (c.pvMax || 0);
                const estPleinFT = soinFT > 0 && (c.ftActuel ?? 0) >= (c.ftMax || 0);
                if (soinPV > 0 && soinFT > 0 && estPleinPV && estPleinFT) return;
                if (soinPV > 0 && !soinFT && estPleinPV) return;
                if (soinFT > 0 && !soinPV && estPleinFT) return;
                const cibleKey = 'cible_comp_' + c.ownerID + '_' + c.compIdx + '_' + Date.now();
                window._mjActionsData[cibleKey] = { itemId, participant, cibleId: { ownerID: c.ownerID, compIdx: c.compIdx, nom: c.nom }, typeCible: 'compagnon' };
                html += '<button class="combat-cible-btn allie" onclick="mjAppliquerItemCompagnon(\'' + cibleKey + '\')">'
                    + '🤝 ' + c.nom + ' <span class="cible-pv">PV ' + (c.pvActuel ?? '?') + '/' + (c.pvMax || '?') + '</span></button>';
                nbCiblesMJ++;
            });
            if (nbCiblesMJ === 0) html += '<p class="combat-vide" style="color:#f66;">Aucune cible disponible — tous les alliés sont déjà au maximum.</p>';
            panel.innerHTML = html;
        });
    } else if (estOffensif && ennemisVivants.length > 0) {
        let html = '<div class="combat-actions-titre">🎒 ' + def.nom + ' — Cible</div>'
            + '<div class="combat-cibles-label ennemi">⚔ Ennemis</div>';
        ennemisVivants.forEach(e => {
            const cibleKey = 'cible_' + e.instanceId + '_' + Date.now();
            window._mjActionsData[cibleKey] = { itemId, participant, cibleId: e.instanceId, typeCible: 'ennemi' };
            html += '<button class="combat-cible-btn ennemi" onclick="mjAppliquerItemCompagnon(\'' + cibleKey + '\')">'
                + e.nom + ' <span class="cible-pv">PV ' + e.pvActuel + '/' + e.pvMax + '</span></button>';
        });
        panel.innerHTML = html;
    }
}

/** MJ applique l'effet d'un objet de compagnon et le consomme. */
function mjAppliquerItemCompagnon(key) {
    const d = window._mjActionsData?.[key];
    if (!d) return;
    const { itemId, participant, cibleId, typeCible } = d;
    const def = (typeof itemsData !== 'undefined') ? itemsData[itemId] : null;
    if (!def) return;

    const data  = window.combatActif;
    const ordre = data?.ordre_jeu || [];

    // Consommer l'objet dans ordre_jeu
    const pIdx = ordre.findIndex(p => p.nom === participant.nom && p.type === 'compagnon');
    let msg = '';
    let ordreMAJ = ordre;
    if (pIdx !== -1) {
        ordreMAJ = ordre.map((p, i) => {
            if (i !== pIdx) return p;
            const inv = [...(p.inventaire || [])];
            const ii = inv.findIndex(it => it.id === itemId);
            if (ii !== -1) {
                if ((inv[ii].quantite || 1) > 1) inv[ii] = Object.assign({}, inv[ii], { quantite: inv[ii].quantite - 1 });
                else inv.splice(ii, 1);
            }
            return Object.assign({}, p, { inventaire: inv });
        });
    }

    // Envoyer action de retrait au joueur propriétaire
    if (participant.ownerID && participant.compIdx !== undefined) {
        db.ref('parties/' + sessionActuelle + '/joueurs/' + participant.ownerID + '/compagnon_action').set({
            type: 'item_remove',
            compIdx: participant.compIdx,
            itemId,
            timestamp: Date.now()
        });
    }

    const prochainTour = _prochainTourVivant(ordreMAJ, data?.tour_actuel || 0);

    if (typeCible === 'ennemi') {
        const ennemisMAJ = [...(data?.ennemis || [])];
        const ei = ennemisMAJ.findIndex(e => e.instanceId === cibleId);
        if (ei === -1) return;
        const parts = String(def.degats || '1-1').split('-');
        const min = parseInt(parts[0]) || 1;
        const max = parseInt(parts[parts.length - 1]) || min;
        const degats = min + Math.floor(Math.random() * (max - min + 1));
        ennemisMAJ[ei].pvActuel = Math.max(0, ennemisMAJ[ei].pvActuel - degats);
        _gagnerXPCompagnon(participant.ownerID, participant.compIdx, ennemisMAJ[ei].pvActuel <= 0 ? 6 : 1);
        msg = participant.nom + ' utilise ' + def.nom + ' sur ' + ennemisMAJ[ei].nom + ' : ' + degats + ' dégâts !';
        const ordreKO = _marquerKODansOrdre(ordreMAJ, ennemisMAJ);
        _verifierFinCombat(ennemisMAJ);
        db.ref('parties/' + sessionActuelle + '/combat_actif').update({
            ennemis: ennemisMAJ,
            ordre_jeu: ordreKO,
            tour_actuel: _prochainTourVivant(ordreKO, data?.tour_actuel || 0)
        });
    } else if (typeCible === 'compagnon') {
        const soinPV = def.stats?.soinPV || 0;
        const soinFT = def.stats?.soinFT || 0;
        const cib = cibleId; // { ownerID, compIdx, nom }
        db.ref('parties/' + sessionActuelle + '/joueurs/' + cib.ownerID + '/compagnon_action').set({
            type: 'soin', compIdx: cib.compIdx, pvGain: soinPV, ftGain: soinFT, timestamp: Date.now()
        });
        msg = participant.nom + ' utilise ' + def.nom + ' sur ' + cib.nom + ' : +' + soinPV + ' PV / +' + soinFT + ' FT';
        db.ref('parties/' + sessionActuelle + '/combat_actif').update({ ordre_jeu: ordreMAJ, tour_actuel: prochainTour });
    } else {
        const soinPV = def.stats?.soinPV || 0;
        const soinFT = def.stats?.soinFT || 0;
        if (soinPV > 0) db.ref('parties/' + sessionActuelle + '/joueurs/' + cibleId + '/modif_stat').set({ stat: 'PV', valeur: soinPV, timestamp: Date.now() });
        if (soinFT > 0) db.ref('parties/' + sessionActuelle + '/joueurs/' + cibleId + '/modif_stat').set({ stat: 'FT', valeur: soinFT, timestamp: Date.now() });
        msg = participant.nom + ' utilise ' + def.nom + ' sur un allié.';
        db.ref('parties/' + sessionActuelle + '/combat_actif').update({ ordre_jeu: ordreMAJ, tour_actuel: prochainTour });
    }
    if (msg) _logCombat(msg);
}

/** MJ utilise un sort de compagnon. */
function mjUtiliserSortCompagnon(key) {
    const d = window._mjActionsData?.[key];
    if (!d) return;
    const nomSort = d.nomSort;
    const ennemisVivants = d.ennemis;
    const s = (typeof trouverSort === 'function') ? trouverSort(nomSort) : null;
    if (!s) return;
    const data = window.combatActif;
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
                if (joueurs[id].estMJ) continue;
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
        db.ref('parties/' + sessionActuelle + '/combat_actif/tour_actuel')
            .set(_prochainTourVivant(data?.ordre_jeu || [], data?.tour_actuel || 0));
        _logCombat('Compagnon lance ' + nomSort + '.');
    }
}

function mjAppliquerSortCompagnon(instanceId, nomSort) {
    const s = (typeof trouverSort === 'function') ? trouverSort(nomSort) : null;
    if (!s || !s.degats) return;
    const data = window.combatActif;
    const ordre = data?.ordre_jeu || [];
    const compagnon = ordre[(data.tour_actuel || 0) % (ordre.length || 1)];
    const ennemisMAJ = [...(data?.ennemis || [])];
    const idx = ennemisMAJ.findIndex(e => e.instanceId === instanceId);
    if (idx === -1) return;
    const crit = _lancerCritique(null);
    let degats = parseInt(s.degats) || 5;
    let critLabel = '';
    if (crit.type === 'echec') {
        degats    = 0;
        critLabel = ' ⚠ ÉCHEC CRITIQUE';
    } else if (crit.type === 'critique') {
        degats    = Math.round(degats * crit.mult);
        critLabel = ' ⚡ CRITIQUE ×1.5 !';
    }
    ennemisMAJ[idx].pvActuel = Math.max(0, ennemisMAJ[idx].pvActuel - degats);
    if (degats > 0) _gagnerXPCompagnon(compagnon?.ownerID, compagnon?.compIdx, ennemisMAJ[idx].pvActuel <= 0 ? 6 : 1);
    _verifierFinCombat(ennemisMAJ);
    const ordreMAJComp = _marquerKODansOrdre(ordre, ennemisMAJ);
    db.ref('parties/' + sessionActuelle + '/combat_actif').update({
        ennemis:    ennemisMAJ,
        ordre_jeu:  ordreMAJComp,
        tour_actuel: _prochainTourVivant(ordreMAJComp, data?.tour_actuel || 0)
    });
    _logCombat('Compagnon lance ' + nomSort + critLabel + ' : ' + degats + ' dégâts !');
}

function mjAppliquerSoinCompagnon(joueurID, nomSort) {
    const s = (typeof trouverSort === 'function') ? trouverSort(nomSort) : null;
    if (!s || !s.soin) return;
    const soin = s.soin === 999 ? 9999 : s.soin;
    const data = window.combatActif;
    db.ref('parties/' + sessionActuelle + '/joueurs/' + joueurID + '/modif_stat').set({ stat: 'PV', valeur: soin, timestamp: Date.now() });
    db.ref('parties/' + sessionActuelle + '/combat_actif/tour_actuel')
        .set(_prochainTourVivant(data?.ordre_jeu || [], data?.tour_actuel || 0));
    _logCombat('Compagnon lance ' + nomSort + ' : +' + soin + ' PV !');
}

/** Retourne l'élément de dégâts d'un ennemi (nature ou équipement). */
function _getElementEnnemi(monstre) {
    // Défini directement sur l'ennemi
    if (monstre.elementDegats) return monstre.elementDegats;
    // Déduit de l'équipement (items avec elementDegats)
    if (monstre.equipement && typeof itemsData !== 'undefined') {
        for (let slot in monstre.equipement) {
            const eq = monstre.equipement[slot];
            if (!eq) continue;
            const def = itemsData[eq.id];
            if (def?.elementDegats) return def.elementDegats;
        }
    }
    return null; // physique
}

const _ELEM_LABELS = { feu: '🔥 Feu', elec: '⚡ Élec.', poison: '☠ Poison' };

function mjAttaqueMonstreJoueur(joueurID, joueurNom) {
    const data = window.combatActif;
    const ordre = data?.ordre_jeu || [];
    const tourIdx = (data.tour_actuel || 0) % (ordre.length || 1);
    const monstre = ordre[tourIdx];
    // Compléter avec les données complètes de l'ennemi (elementDegats, equipement, etc.)
    const monstreComplet = (data?.ennemis || []).find(e => e.instanceId === monstre?.instanceId) || monstre;

    // Marquer cet ennemi comme ayant déjà attaqué (fin de la protection discrétion)
    if (!window._ennemisOntAttaque) window._ennemisOntAttaque = new Set();
    if (monstre?.instanceId !== undefined) window._ennemisOntAttaque.add(monstre.instanceId);

    // Damage simple: 1d8 + niveau/2
    const de = Math.ceil(Math.random() * 8);
    const bonus = Math.floor((monstreComplet.niveau || monstre.niveau || 1) / 2);
    const degats = de + bonus;
    const element = _getElementEnnemi(monstreComplet);

    // Dégâts de fatigue : lire degatsFT de l'arme du monstre, sinon formule niveau
    let degatsFTMonstre = Math.max(1, Math.ceil((monstreComplet.niveau || monstre.niveau || 1) / 3));
    if (monstreComplet.equipement && typeof itemsData !== 'undefined') {
        for (const slot in monstreComplet.equipement) {
            const eq = monstreComplet.equipement[slot];
            if (eq && itemsData[eq.id]?.degatsFT) { degatsFTMonstre = itemsData[eq.id].degatsFT; break; }
        }
    }

    // Lire le statut surcharge de la cible puis résoudre l'attaque
    db.ref('parties/' + sessionActuelle + '/joueurs/' + joueurID + '/surcharge').once('value', (snapSurcharge) => {
        const cibleSurchargée = snapSurcharge.val() === true;

        // Jet critique de l'ennemi via _lancerCritique (seuils : échec ≤10, critique ≥89)
        const crit = _lancerCritique(null);
        // Cible surchargée : chance supplémentaire de critique (+10% sur un résultat normal)
        if (crit.type === 'normal' && cibleSurchargée && Math.random() < 0.10) {
            crit.type = 'critique'; crit.mult = 1.5;
        }

        let degatsFinaux = degats;
        let critLabel = '';
        const coupCritique = crit.type === 'critique';

        if (crit.type === 'echec') {
            degatsFinaux = 0;
            critLabel = ' ⚠ ÉCHEC CRITIQUE (rate son attaque !)';
        } else if (crit.type === 'critique') {
            degatsFinaux = Math.round(degats * crit.mult);
            critLabel = ' ⚡ CRITIQUE ×1.5 !';
        }

        const elemLabel = element ? ` [${_ELEM_LABELS[element] || element}]` : '';
        const surLabel  = cibleSurchargée ? ' [SURCHARGÉ]' : '';

        // Message court (joueurs) : juste dégâts + critique si applicable
        const critCourt = crit.type === 'echec' ? ' ⚠ ÉCHEC CRITIQUE' : crit.type === 'critique' ? ' ⚡ CRITIQUE ×1.5 !' : '';
        const msgCourt  = monstre.nom + ' attaque ' + joueurNom + elemLabel + critCourt
            + (degatsFinaux > 0 ? ' : ' + degatsFinaux + ' dégâts !' : ' : attaque ratée !');
        // Message détaillé (MJ) : dé, bonus, FT, surcharge, poison
        const poisonInfo = (element === 'poison' && degatsFinaux > 0) ? ' · ☠ 50% risque poison' : '';
        const msgDetail = monstre.nom + ' attaque ' + joueurNom + elemLabel + surLabel
            + ' : 1d8(' + de + ')+' + bonus + '=' + degatsFinaux + ' dég.' + critLabel
            + ' · -' + degatsFTMonstre + ' FT'
            + poisonInfo
            + (crit.roll !== undefined ? ' [d100=' + crit.roll + ']' : '');

        // Envoie uniquement si dégâts > 0 (échec critique = rien)
        if (degatsFinaux > 0) {
            db.ref('parties/' + sessionActuelle + '/joueurs/' + joueurID + '/modif_stat').set({
                stat: 'PV', valeur: -degatsFinaux, element: element || null, critique: coupCritique,
                degatsFT: degatsFTMonstre, timestamp: Date.now()
            });
        }

        _logCombat(msgCourt, msgDetail);

        // Lire pvActuel du joueur pour mettre à jour ordre_jeu immédiatement
        // (le joueur n'a pas encore traité modif_stat → on calcule nous-mêmes le nouveau PV)
        db.ref('parties/' + sessionActuelle + '/joueurs/' + joueurID + '/pvActuel').once('value', (snapPV) => {
            const pvAvant = snapPV.val() ?? 0;
            const newPV = Math.max(0, pvAvant - degatsFinaux);
            const ordreMAJ = ordre.map(p => {
                if (p.type === 'joueur' && p.id === joueurID) {
                    return Object.assign({}, p, { pvActuel: newPV, ko: newPV <= 0 });
                }
                return p;
            });
            db.ref('parties/' + sessionActuelle + '/combat_actif').update({
                ordre_jeu: ordreMAJ,
                tour_actuel: _prochainTourVivant(ordreMAJ, data.tour_actuel || 0)
            });
            // Vérifier défaite avec l'ordre mis à jour (KO immédiatement reflété)
            _verifierDefaite(ordreMAJ);
        });
    }); // fin snapSurcharge
}

/** Ennemi attaque un compagnon. */
function mjAttaqueMonstreCompagnon(instanceId, compIdx, ownerID, compNom) {
    const data = window.combatActif;
    const ordre = data?.ordre_jeu || [];
    const tourIdx = (data.tour_actuel || 0) % (ordre.length || 1);
    const monstre = ordre[tourIdx];

    if (!window._ennemisOntAttaque) window._ennemisOntAttaque = new Set();
    if (monstre?.instanceId !== undefined) window._ennemisOntAttaque.add(monstre.instanceId);

    const de = Math.ceil(Math.random() * 8);
    const bonus = Math.floor((monstre.niveau || 1) / 2);
    const degats = de + bonus;
    const crit = _lancerCritique(null);
    let degatsFinaux = degats;
    let critLabel = '';
    if (crit.type === 'echec') { degatsFinaux = 0; critLabel = ' ⚠ ÉCHEC CRITIQUE'; }
    else if (crit.type === 'critique') { degatsFinaux = Math.round(degats * 1.5); critLabel = ' ⚡ CRITIQUE ×1.5 !'; }

    // Appliquer dégâts dans ordre_jeu
    const ordreMAJ = ordre.map(p => {
        if (p.type === 'compagnon' && p.compIdx === compIdx && p.ownerID === ownerID) {
            const newPV = Math.max(0, (p.pvActuel || 0) - degatsFinaux);
            return Object.assign({}, p, { pvActuel: newPV, ko: newPV <= 0 });
        }
        return p;
    });

    // Notifier le joueur propriétaire
    if (degatsFinaux > 0) {
        db.ref('parties/' + sessionActuelle + '/joueurs/' + ownerID + '/compagnon_action').set({
            type: 'soin', compIdx, pvGain: -degatsFinaux, ftGain: 0, timestamp: Date.now()
        });
    }

    db.ref('parties/' + sessionActuelle + '/combat_actif').update({
        ordre_jeu: ordreMAJ,
        tour_actuel: _prochainTourVivant(ordreMAJ, data.tour_actuel || 0)
    });
    _logCombat(monstre.nom + ' attaque ' + compNom + critLabel + ' : ' + degatsFinaux + ' dégâts !');
    _verifierDefaite(ordreMAJ);
}

function mjAttaqueCompagnonEnnemi(instanceId) {
    const data = window.combatActif;
    const ordre = data?.ordre_jeu || [];
    const tourIdx = (data.tour_actuel || 0) % (ordre.length || 1);
    const compagnon = ordre[tourIdx];

    const ennemisMAJ = [...(data?.ennemis || [])];
    const idx = ennemisMAJ.findIndex(e => e.instanceId === instanceId);
    if (idx === -1) return;

    const de    = Math.ceil(Math.random() * 6);
    const bonus = Math.floor((compagnon.niveau || 1) / 2);
    let degats  = Math.max(1, de + bonus);

    // Jet critique du compagnon (même système que les joueurs, sans background)
    const crit = _lancerCritique(null);
    let critLabel = '';
    if (crit.type === 'echec') {
        degats    = 0;
        critLabel = ' ⚠ ÉCHEC CRITIQUE';
    } else if (crit.type === 'critique') {
        degats    = Math.round(degats * crit.mult);
        critLabel = ' ⚡ CRITIQUE ×1.5 !';
    }

    ennemisMAJ[idx].pvActuel = Math.max(0, ennemisMAJ[idx].pvActuel - degats);

    const estMort = ennemisMAJ[idx].pvActuel <= 0;
    const xpGain  = estMort ? 6 : 1;
    const critCourt2 = critLabel.includes('ÉCHEC') ? ' ⚠ ÉCHEC CRITIQUE' : critLabel;
    const msgCourt2  = compagnon.nom + ' attaque ' + ennemisMAJ[idx].nom + critCourt2
        + (degats > 0 ? ' : ' + degats + ' dégâts !' : ' : attaque ratée !');
    const msgDetail2 = compagnon.nom + ' attaque ' + ennemisMAJ[idx].nom
        + ' : 1d6(' + de + ')+' + bonus + '=' + degats + ' dég.' + critLabel
        + ' [d100=' + crit.roll + '] (PV ennemi: ' + ennemisMAJ[idx].pvActuel + ')';

    if (degats > 0) _gagnerXPCompagnon(compagnon.ownerID, compagnon.compIdx, xpGain);
    _verifierFinCombat(ennemisMAJ);
    const ordreMAJAtk = _marquerKODansOrdre(ordre, ennemisMAJ);
    db.ref('parties/' + sessionActuelle + '/combat_actif').update({
        ennemis:    ennemisMAJ,
        ordre_jeu:  ordreMAJAtk,
        tour_actuel: _prochainTourVivant(ordreMAJAtk, data.tour_actuel || 0)
    });
    _logCombat(msgCourt2, msgDetail2);
}

/** MJ passe le tour d'un compagnon : roll récupération → envoie PV+FT au joueur. */
function mjPasserTourCompagnon(ownerID, compIdx, guerisonVal) {
    const data   = window.combatActif;
    if (!data || !ownerID) return;
    const recup  = _roleRecuperation(guerisonVal || 1);
    db.ref('parties/' + sessionActuelle + '/joueurs/' + ownerID + '/compagnon_action').set({
        type: 'passer_tour',
        compIdx,
        ftGain: recup.ft,
        pvGain: recup.pv,
        timestamp: Date.now()
    });
    const ordre = data.ordre_jeu || [];
    db.ref('parties/' + sessionActuelle + '/combat_actif/tour_actuel')
        .set(_prochainTourVivant(ordre, data.tour_actuel || 0));
    const msg = recup.ft > 0
        ? 'Compagnon passe son tour et récupère +' + recup.pv + ' PV / +' + recup.ft + ' FT.' + recup.label
        : 'Compagnon passe son tour — rien récupéré.' + recup.label;
    _logCombat(msg);
}

/** MJ passe le tour d'un ennemi : roll récupération → ennemi récupère PV et FT. */
function mjPasserTourEnnemi(instanceId) {
    const data = window.combatActif;
    if (!data) return;
    const ennemisMAJ = [...(data.ennemis || [])];
    const idx = ennemisMAJ.findIndex(e => e.instanceId === instanceId);
    if (idx === -1) return;
    const e       = ennemisMAJ[idx];
    const niv     = e.niveau || 1;
    const guerison = Math.max(1, Math.floor(niv / 3));
    // Initialiser FT ennemi si absent
    if (e.ftMax  === undefined) e.ftMax  = Math.max(5, niv * 2);
    if (e.ftActuel === undefined) e.ftActuel = e.ftMax;
    const recup = _roleRecuperation(guerison);
    e.pvActuel  = Math.min(e.pvMax,  (e.pvActuel  || 0) + recup.pv);
    e.ftActuel  = Math.min(e.ftMax,  (e.ftActuel  || 0) + recup.ft);
    const ordre = data.ordre_jeu || [];
    db.ref('parties/' + sessionActuelle + '/combat_actif').update({
        ennemis:     ennemisMAJ,
        tour_actuel: _prochainTourVivant(ordre, data.tour_actuel || 0)
    });
    const msg = recup.ft > 0
        ? e.nom + ' passe son tour et récupère +' + recup.pv + ' PV / +' + recup.ft + ' FT.' + recup.label
        : e.nom + ' passe son tour — rien récupéré.' + recup.label;
    _logCombat(msg);
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

/** Retourne la stat de guérison d'un personnage (floor(CN_total / 3), min 1). */
function _getGuerison(p) {
    const cn = (p?.statsBase?.CN || 5) + (p?.statsInvesties?.CN || 0);
    return Math.max(1, Math.floor(cn / 3));
}

/**
 * Décrémente les effets temporaires du joueur en début de tour.
 * Supprime de Firebase les effets arrivés à 0 tour, avec toast de notification.
 */
function _decrementerEffetsTemporaires() {
    const effets = window.perso?.effets_actifs;
    if (!effets) return;
    const playerID = (window.perso.nom || '').replace(/\s+/g, '_');
    const ref = db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/effets_actifs');
    Object.entries(effets).forEach(([cle, effet]) => {
        if (!effet.temporaire) return;
        const restants = (effet.toursRestants || 0) - 1;
        if (restants <= 0) {
            ref.child(cle).remove();
            if (typeof _toast === 'function') _toast(`✨ ${effet.nom} a expiré.`, 'info');
        } else {
            ref.child(cle + '/toursRestants').set(restants);
        }
    });
}

/**
 * Roll de récupération (passer le tour).
 * 0-4 → échec critique (0 récup) | 99 → critique ×2 | sinon normal.
 * @returns {{ pv:number, ft:number, label:string }}
 */
function _roleRecuperation(guerison) {
    const roll = Math.floor(Math.random() * 100);
    if (roll <= 4)  return { pv: 0,           ft: 0,           label: ` ⚠ ÉCHEC CRITIQUE (${roll}) — rien récupéré !` };
    if (roll >= 99) return { pv: guerison * 2, ft: guerison * 2, label: ` ⚡ CRITIQUE ×2 (${roll}) — récupération double !` };
    return             { pv: guerison,       ft: guerison,       label: `` };
}

/** Passe le tour du joueur : roll récupération → +FT et +PV, avance le tour. */
function passerTourCombat() {
    const perso = window.perso;
    const data  = window.combatActif;
    if (!perso || !data) return;

    let msg;
    if (perso.poison) {
        // Empoisonné : pas de regen, roll guérison d'abord puis tic de dégâts
        const estPoison = !!perso.poison; // vrai avant l'appel
        const degats = (typeof _appliquerPoison === 'function') ? _appliquerPoison() : 0;
        const gueri = estPoison && !perso.poison; // poison était là, n'y est plus → guéri
        if (gueri) {
            msg = `${perso.nom} passe son tour — ✅ Poison neutralisé (aucun dégât ce tour) !`;
        } else {
            msg = `${perso.nom} passe son tour — ☠ Poison : −${degats} PV`;
        }
    } else {
        const guerison = _getGuerison(perso);
        const recup    = _roleRecuperation(guerison);
        const maxFT = (perso.statsBase.CN * 2) + (perso.statsBase.IN)
            + ((perso.statsInvesties?.CN || 0) * 2) + (perso.statsInvesties?.IN || 0)
            + (perso.boostFT || 0);
        const maxPV = (perso.statsBase.FO * 2) + (perso.statsBase.IN)
            + ((perso.statsInvesties?.FO || 0) * 2) + (perso.statsInvesties?.IN || 0)
            + (perso.boostPV || 0);
        perso.ftActuel = Math.min(maxFT, (perso.ftActuel || 0) + recup.ft);
        perso.pvActuel = Math.min(maxPV, (perso.pvActuel || 0) + recup.pv);
        const estEpuise = ((perso.ftActuel - recup.ft) <= 0);
        msg = recup.ft > 0
            ? `${perso.nom} passe son tour${estEpuise ? ' (épuisé)' : ''} et récupère +${recup.pv} PV / +${recup.ft} FT.${recup.label}`
            : `${perso.nom} passe son tour${estEpuise ? ' (épuisé)' : ''} — rien récupéré.${recup.label}`;
    }

    _logCombat(msg);
    const ordre = data.ordre_jeu || [];
    db.ref('parties/' + sessionActuelle + '/combat_actif/tour_actuel')
        .set(_prochainTourVivant(ordre, data.tour_actuel || 0));
    if (typeof autoSave === 'function') autoSave();
    if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
}

/**
 * Lance un d100 et retourne le type de coup selon le background du perso.
 * @returns {{ type: 'normal'|'echec'|'critique', roll: number, mult: number }}
 */
function _lancerCritique(perso) {
    const roll = Math.floor(Math.random() * 100);
    const bg   = perso?.background || '';

    // Seuils par défaut
    let seuilEchec    = 10; // 0-10 → échec critique
    let seuilCritique = 89; // 89-99 → réussite critique
    let multCritique  = 1.5;

    if (bg === 'Affiche de Nietzsche Enfant') seuilEchec = 25;
    if (bg === 'Né sous la bonne étoile') { seuilCritique = 95; multCritique = 2.0; }

    // Bonus IN ≥ 20 : chance de critique +5%
    const inTotal = (perso?.statsBase?.IN || 0) + (perso?.statsInvesties?.IN || 0);
    if (inTotal >= 20) seuilCritique = Math.max(seuilEchec + 1, seuilCritique - 5);

    // Surcharge : critique d'attaque impossible, chance d'échec doublée
    if (typeof _estSurcharge === 'function' && _estSurcharge(perso)) {
        seuilEchec = Math.min(99, seuilEchec * 2);
        seuilCritique = 101; // jamais atteint → pas de critique possible
    }

    if (roll <= seuilEchec)    return { type: 'echec',    roll, mult: 0 };
    if (roll >= seuilCritique) return { type: 'critique', roll, mult: multCritique };
    return { type: 'normal', roll, mult: 1 };
}

/** Retourne le prochain index de tour en sautant les participants KO. */
function _prochainTourVivant(ordre, from) {
    if (!ordre || ordre.length === 0) return 0;
    let next = (from + 1) % ordre.length;
    for (let i = 0; i < ordre.length; i++) {
        if (!ordre[next].ko) return next;
        next = (next + 1) % ordre.length;
    }
    return (from + 1) % ordre.length;
}

/** Marque les participants KO dans l'ordre de jeu (ennemis, joueurs, compagnons). */
function _marquerKODansOrdre(ordre, ennemisMAJ) {
    return ordre.map(p => {
        if (p.type === 'ennemi') {
            const e = ennemisMAJ ? ennemisMAJ.find(en => en.instanceId === p.instanceId) : null;
            return (e && e.pvActuel <= 0) ? Object.assign({}, p, { ko: true }) : p;
        }
        // Joueurs et compagnons : basé sur pvActuel déjà dans l'entrée ordre_jeu
        if (p.pvActuel !== undefined && p.pvActuel <= 0) {
            return Object.assign({}, p, { ko: true });
        }
        return p;
    });
}

/** Calcule le dé d'arme équipée d'un perso/compagnon. Retourne {de, label}. */
function _degatsArme(p) {
    if (typeof itemsData === 'undefined') return { de: 6, label: '1d6' };
    const eq = p.equipement || {};
    const slot = eq.main_droite || eq.deux_mains || eq.main_gauche;
    if (!slot) {
        const roll = 1 + Math.floor(Math.random() * 6);
        return { de: roll, label: 'Poing [1-6](' + roll + ')' };
    }
    const item = itemsData[slot.id];
    if (!item || !item.degats || item.degats === '0') {
        const roll = 1 + Math.floor(Math.random() * 6);
        return { de: roll, label: 'Poing [1-6](' + roll + ')' };
    }
    // Format "X-Y" → roll between min and max
    const parts = String(item.degats).split('-');
    const max   = parseInt(parts[parts.length - 1]) || 6;
    const min   = parseInt(parts[0]) || 1;
    const roll  = min + Math.floor(Math.random() * (max - min + 1));
    return { de: roll, label: item.nom + ' [' + item.degats + '](' + roll + ')' };
}

/**
 * Retourne la munition requise par l'arme équipée, ou null si aucune.
 * { id: 'MUN01'|'MUN02', nom: string }
 */
function _munitionRequise(itemId, item) {
    if (!item) return null;
    if (item.type === 'arme_feu') return { id: 'MUN01', nom: 'Balles' };
    // Arcs nécessitent des flèches — sauf le boomerang (AD02) qui revient à l'envoyeur
    if (item.type === 'arme_distance' && itemId !== 'AD02') return { id: 'MUN02', nom: 'Flèches' };
    return null;
}

/** Calcule la réduction d'armure totale d'un perso/compagnon. */
function _armureTotal(p) {
    if (typeof itemsData === 'undefined') return 0;
    const eq = p.equipement || {};
    let total = 0;
    for (const slot in eq) {
        const s = eq[slot];
        if (!s || !itemsData[s.id]) continue;
        // Une pièce d'armure brisée (durabilite = 0) ne protège plus
        if (s.durabilite !== undefined && s.durabilite <= 0) continue;
        total += itemsData[s.id].armure || 0;
    }
    return total;
}

function lancerAttaqueMelee(instanceId) {
    const perso = window.perso;
    if (!perso) return;

    // ── Vérifier durabilité de l'arme ────────────────────────────
    const eqSlots0 = perso.equipement || {};
    const armeSlotRef = eqSlots0.main_droite || eqSlots0.deux_mains || eqSlots0.main_gauche;
    if (armeSlotRef && (armeSlotRef.durabilite || 0) <= 0) {
        if (typeof _toast === 'function') _toast('🔨 Votre arme est brisée ! Elle ne peut plus être utilisée.', 'error');
        return;
    }

    // ── Vérifier et consommer les munitions ──────────────────────
    if (typeof itemsData !== 'undefined') {
        const eqSlots = perso.equipement || {};
        const armeSlot = eqSlots.main_droite || eqSlots.deux_mains || eqSlots.main_gauche;
        if (armeSlot) {
            const weaponDef = itemsData[armeSlot.id];
            const mun = _munitionRequise(armeSlot.id, weaponDef);
            if (mun) {
                const inv = perso.inventaire || [];
                const munIdx = inv.findIndex(i => i.id === mun.id);
                if (munIdx === -1 || (inv[munIdx].quantite || 0) < 1) {
                    if (typeof _toast === 'function') _toast('❌ Plus de ' + mun.nom + ' !', 'error');
                    return;
                }
                if (inv[munIdx].quantite > 1) inv[munIdx].quantite--;
                else inv.splice(munIdx, 1);
                perso.inventaire = inv;
                if (typeof autoSave === 'function') autoSave();
                if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
            }
        }
    }

    const fo    = (perso.statsBase?.FO || 0) + (perso.statsInvesties?.FO || 0);

    // ── Déterminer le type d'arme équipée ────────────────────────
    const _eqA     = perso.equipement || {};
    const _slotA   = _eqA.main_droite || _eqA.deux_mains || _eqA.main_gauche;
    const _itemDefA = (typeof itemsData !== 'undefined' && _slotA) ? itemsData[_slotA.id] : null;
    const _typeA    = _itemDefA?.type || '';
    const _estMeleeA      = !_slotA || _typeA === 'arme_melee';
    const _estArcA        = _typeA === 'arme_distance' && _itemDefA?.soustype === 'arc';
    const _estDistLancerA = _typeA === 'arme_distance' && !_estArcA; // boomerang etc.
    const _estFeuA        = _typeA === 'arme_feu';
    const _estExplosifA   = _typeA === 'consommable' && _itemDefA?.degats && _itemDefA.degats !== '0';

    // foMod : mêlée/poing uniquement, doublé si FO ≥ 20
    let foMod = _estMeleeA ? (fo > 10 ? fo - 10 : Math.floor((fo - 10) / 2)) : 0;
    if (_estMeleeA && fo >= 20) foMod *= 2;

    // ── Compétences applicables ───────────────────────────────────
    const comp         = perso.compInvesties || {};
    const melee_pts    = comp.melee || 0;
    const arc_pts      = comp.arc || 0;
    const lancer_pts   = comp.lancer || 0;
    const feu_pts      = comp.armes_a_feu || 0;
    const sournois_pts = comp.attaque_sournoise || 0;

    const arme  = _degatsArme(perso);
    const crit  = _lancerCritique(perso);

    // ── Calcul des dégâts de base ─────────────────────────────────
    let skillMult = 1;
    let skillLabel = '';
    if (_estMeleeA)      { skillMult = 1 + melee_pts * 0.05;  skillLabel = melee_pts  > 0 ? ` Mêlée(+${melee_pts * 5}%)` : ''; }
    else if (_estArcA)   { skillMult = 1 + arc_pts * 0.05;    skillLabel = arc_pts    > 0 ? ` Arc(+${arc_pts * 5}%)`    : ''; }
    else if (_estFeuA)   { skillMult = 1 + feu_pts * 0.05;    skillLabel = feu_pts    > 0 ? ` AF(+${feu_pts * 5}%)`    : ''; }
    else if (_estDistLancerA || _estExplosifA) {
        skillMult  = 1 + lancer_pts * 0.05;
        skillLabel = lancer_pts > 0 ? ` Lancer(+${lancer_pts * 5}%)` : '';
    }

    // Attaque sournoise : bonus sur la 1ère attaque du combat
    let sourLabel = '';
    if (sournois_pts > 0 && !window._combatPremierCoupFait) {
        const sourMult = 1 + sournois_pts * 0.10;
        skillMult *= sourMult;
        sourLabel = ` Sournois(+${sournois_pts * 10}%)`;
    }
    window._combatPremierCoupFait = true;

    let degatsBase = Math.max(1, Math.round((arme.de + foMod) * skillMult));
    let critLabel  = '';
    if (crit.type === 'echec') {
        degatsBase = 0;
        critLabel  = ' ⚠ ÉCHEC CRITIQUE';
    } else if (crit.type === 'critique') {
        degatsBase = Math.round(degatsBase * crit.mult);
        critLabel  = crit.mult >= 2 ? ' ⚡ CRITIQUE ×2 !' : ' ⚡ CRITIQUE ×1.5 !';
    }

    // ── Usure de l'arme ──────────────────────────────────────────
    const _armeSlot = perso.equipement?.main_droite || perso.equipement?.deux_mains || perso.equipement?.main_gauche;
    if (_armeSlot && _armeSlot.durabilite !== undefined) {
        const perte = (crit.type === 'echec') ? 10 : 1;
        _armeSlot.durabilite = Math.max(0, (_armeSlot.durabilite || 0) - perte);
        if (_armeSlot.durabilite === 0 && typeof _toast === 'function') {
            _toast('🔨 Votre arme est maintenant brisée !', 'error');
        }
    }

    const data = window.combatActif;
    const ennemisMAJ = [...(data?.ennemis || [])];
    const idx = ennemisMAJ.findIndex(e => e.instanceId === instanceId);
    if (idx === -1) return;

    // Armure ennemie réduit les dégâts
    const armEnnemi    = _armureTotal(ennemisMAJ[idx]);
    const degatsFinaux = Math.max(0, degatsBase - armEnnemi);

    ennemisMAJ[idx].pvActuel = Math.max(0, ennemisMAJ[idx].pvActuel - degatsFinaux);
    _gagnerXP(ennemisMAJ[idx].pvActuel <= 0 ? 6 : 1);
    const armInfo  = armEnnemi > 0 ? ` [armure -${armEnnemi}]` : '';
    const foInfo   = foMod !== 0 ? ` FO(${foMod > 0 ? '+' : ''}${foMod})` : '';
    const critCourt = critLabel.includes('ÉCHEC') ? ' ⚠ ÉCHEC CRITIQUE' : critLabel.includes('CRITIQUE') ? critLabel : '';
    const msgCourt  = `${perso.nom} attaque ${ennemisMAJ[idx].nom}${critCourt}${degatsFinaux > 0 ? ' : ' + degatsFinaux + ' dégâts !' : ' : attaque ratée !'}`;
    const msgDetail = `${perso.nom} attaque ${ennemisMAJ[idx].nom} : ${arme.label}${foInfo}${skillLabel}${sourLabel}${armInfo}${critLabel} = ${degatsFinaux} dég. (PV ennemi : ${ennemisMAJ[idx].pvActuel})`;

    const ordreMAJ     = _marquerKODansOrdre(data.ordre_jeu || [], ennemisMAJ);
    const prochainTour = _prochainTourVivant(ordreMAJ, data.tour_actuel || 0);

    // ── Actions rapides ──────────────────────────────────────────
    const _actionsArme = _itemDefA?.actionsParTour || 1;
    const _tourActuel  = data.tour_actuel || 0;
    if (window._actionsRapides.tourKey !== _tourActuel) {
        window._actionsRapides = { tourKey: _tourActuel, max: _actionsArme, restantes: _actionsArme };
    }
    window._actionsRapides.restantes = Math.max(0, window._actionsRapides.restantes - 1);
    const _tousEnnemisKO = ennemisMAJ.every(e => e.pvActuel <= 0);
    _verifierFinCombat(ennemisMAJ);

    if (window._actionsRapides.restantes > 0 && !_tousEnnemisKO) {
        // Bonus d'action : ne pas avancer le tour
        db.ref('parties/' + sessionActuelle + '/combat_actif').update({
            ennemis:   ennemisMAJ,
            ordre_jeu: ordreMAJ
        });
        _logCombat(msgCourt, msgDetail);
        window.combatActif = Object.assign({}, window.combatActif, { ennemis: ennemisMAJ, ordre_jeu: ordreMAJ });
        _afficherEnnemis(window.combatActif);
        _afficherPanneauActions(window.combatActif);
    } else {
        db.ref('parties/' + sessionActuelle + '/combat_actif').update({
            ennemis:    ennemisMAJ,
            ordre_jeu:  ordreMAJ,
            tour_actuel: prochainTour
        });
        _logCombat(msgCourt, msgDetail);
    }

    if (typeof autoSave === 'function') autoSave();
}
