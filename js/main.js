// ==========================================
// 1. VARIABLES GLOBALES (Sécurisées)
// ==========================================
window.perso = window.perso || {};

/**
 * Retourne la somme des bonus issus des effets actifs (bénédictions/malédictions).
 * @param {object} perso
 * @param {string} key  stat: 'FO'|'IN'|'CN'|'DX'|'CH'
 *                      ressource: 'pv'|'ft'
 *                      compétence: 'melee'|'arc'|... (id de compétence)
 */
function _bonusEffets(perso, key) {
    const effets = perso?.effets_actifs;
    if (!effets) return 0;
    return Object.values(effets).reduce((sum, e) => {
        if (key === 'pv') return sum + (e.pvBonus || 0);
        if (key === 'ft') return sum + (e.ftBonus || 0);
        if (e.stats?.[key] !== undefined) return sum + (e.stats[key] || 0);
        return sum + (e.comps?.[key] || 0);
    }, 0);
}

/**
 * Remplace alert() partout dans le jeu.
 * type: 'success' | 'error' | 'gold' | '' (défaut)
 */
function _toast(msg, type) {
    const el = document.createElement('div');
    el.className = 'toast-notif' + (type ? ' toast-' + type : '');
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
        requestAnimationFrame(() => el.classList.add('toast-visible'));
    });
    setTimeout(() => {
        el.classList.remove('toast-visible');
        setTimeout(() => el.remove(), 400);
    }, 3500);
}

let statsCalculees = {}; 
let investissementsTemporaires = {
    pv: 0, ft: 0, stats: {}, comp: {}, magie: {}, tech: {}
};

// ==========================================
// 2. INITIALISATION AU DÉMARRAGE
// ==========================================
window.onload = function() {
    // Session Multijoueur
    const sessionSave = localStorage.getItem('arcanum_session_name');
    if (sessionSave) {
        const inputSession = document.getElementById('input-session');
        if (inputSession) inputSession.value = sessionSave;
        if (typeof sessionActuelle !== 'undefined') sessionActuelle = sessionSave;
    }

    const inputSessionEl = document.getElementById('input-session');
    if (inputSessionEl) {
        inputSessionEl.addEventListener('input', (e) => {
            localStorage.setItem('arcanum_session_name', e.target.value);
            if (typeof sessionActuelle !== 'undefined') sessionActuelle = e.target.value;
        });
    }

    // Musique au premier clic
    console.log("🛠️ Système d'écouteur de clic initialisé.");
    document.body.addEventListener('click', function() {
        console.log("Clic détecté sur le body !");
        
        if (typeof AudioEngine !== 'undefined') {
            if (AudioEngine.musiqueActuelle && AudioEngine.musiqueActuelle.paused) {
                console.log("🔓 Musique en attente détectée, tentative de lecture forcée...");
                AudioEngine.musiqueActuelle.play().catch(e => console.error("Erreur lecture clic:", e));
                return;
            }

            if (!AudioEngine.musiqueActuelle) {
                console.log("🔊 Rien n'était chargé, lancement initial...");
                const session = document.getElementById('input-session')?.value || sessionActuelle;
                db.ref('parties/' + session + '/musique_mj').once('value', (snapshot) => {
                    const data = snapshot.val();
                    if (data && data.fichier) {
                        AudioEngine.jouerMusique(data.fichier);
                    } else if (window.perso && window.perso.lieuActuel) {
                        const lieuData = (typeof lieuxDecouverts !== 'undefined') ? lieuxDecouverts[window.perso.lieuActuel] : null;
                        AudioEngine.jouerMusique(lieuData ? lieuData.musique : 'Arcanum.mp3');
                    } else {
                        AudioEngine.jouerMusique('Arcanum.mp3');
                    }
                });
            }
        }
    }, { once: true });

    // Remplir les listes déroulantes de création
    const raceSelect = document.getElementById('raceSelect');
    if (raceSelect && typeof racesData !== 'undefined') {
        for (let r in racesData) {
            let o = document.createElement('option');
            o.value = r; o.innerText = r;
            raceSelect.appendChild(o);
        }
        if (typeof buildChar === 'function') {
            document.getElementById('raceSelect').addEventListener('change', buildChar);
            document.getElementById('sexeSelect').addEventListener('change', buildChar);
            document.getElementById('bgSelect').addEventListener('change', buildChar);
        }
    }

    // Récupération automatique
    const sauvegarde = localStorage.getItem('arcanum_sauvegarde');
    if (sauvegarde) {
        chargerPersonnage(); 
    }

    // Initialisation des interfaces
    if (typeof initCompetencesUI === 'function') initCompetencesUI();
    if (typeof initMagieUI === 'function') initMagieUI();
    if (typeof initTechUI === 'function') initTechUI();

    allerAccueil();
};

// ==========================================
// 3. NAVIGATION & AFFICHAGE
// ==========================================
let _ecransCache = null;
function cacherTout() {
    if (!_ecransCache) {
        _ecransCache = [
            'ecran-accueil', 'ecran-creation', 'ecran-fiche',
            'ecran-inventaire', 'ecran-fouille', 'ecran-marchand',
            'ecran-craft', 'ecran-aide', 'ecran-codex', 'ecran-mj',
            'ecran-carte', 'ecran-groupe', 'ecran-magie-accueil', 'ecran-compagnons', 'ecran-combat', 'ecran-donjon'
        ].map(id => document.getElementById(id)).filter(Boolean);
    }
    _ecransCache.forEach(el => el.style.display = 'none');
}

function allerAccueil() {
    autoSave();
    cacherTout();
    const ecran = document.getElementById('ecran-accueil');
    if (ecran) ecran.style.display = 'block';
    rafraichirAccueil();
    if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
}

function lancerD20Accueil() {
    const roll = 1 + Math.floor(Math.random() * 20);
    const el = document.getElementById('d20-resultat');
    if (!el) return;
    const isCrit = roll === 20;
    const isFail = roll === 1;
    el.textContent = roll;
    el.style.color = isCrit ? '#ffd700' : isFail ? '#ff4444' : '#e0c8ff';
    el.style.textShadow = isCrit ? '0 0 10px #ffd700' : isFail ? '0 0 8px #ff4444' : 'none';
}

function ouvrirEcranCompagnons() {
    cacherTout();
    const ecran = document.getElementById('ecran-compagnons');
    if (ecran) ecran.style.display = 'block';
    afficherEcranCompagnons();
}

/**
 * Rendu en lecture seule des compagnons du joueur.
 * Le joueur ne peut ni modifier les stats ni renvoyer le compagnon.
 */
function afficherEcranCompagnons() {
    const container = document.getElementById('compagnons-liste');
    if (!container) return;
    const comps = window.perso?.compagnons || [];

    if (comps.length === 0) {
        container.innerHTML = '<p style="color:#888; text-align:center; padding:40px;">Aucun compagnon pour l\'instant.</p>';
        return;
    }

    const statCH = (window.perso.statsBase?.CH || 0) + (window.perso.statsInvesties?.CH || 0);
    const maxComps = Math.max(1, Math.floor(statCH / 4));

    const fragments = [];
    comps.forEach((c) => {
        const idx = comps.indexOf(c);
        // Bonus d'équipement sur stats
        const eqBonus = { FO:0, IN:0, CN:0, DX:0, CH:0 };
        if (c.equipement && typeof itemsData !== 'undefined') {
            for (let slot in c.equipement) {
                const eq = c.equipement[slot];
                if (!eq) continue;
                const def = itemsData[eq.id];
                if (def?.stats) for (let s in eqBonus) if (def.stats[s]) eqBonus[s] += def.stats[s];
            }
        }
        // Bonus CH ≥ 20 du joueur : +2 à toutes les stats du compagnon
        const playerCH = (window.perso?.statsBase?.CH || 0) + (window.perso?.statsInvesties?.CH || 0);
        const bonusCH20 = playerCH >= 20 ? 2 : 0;
        const fo  = c.statsBase.FO + (c.statsInvesties?.FO || 0) + eqBonus.FO + bonusCH20;
        const ini = c.statsBase.IN + (c.statsInvesties?.IN || 0) + eqBonus.IN + bonusCH20;
        const cn  = c.statsBase.CN + (c.statsInvesties?.CN || 0) + eqBonus.CN + bonusCH20;
        const dx  = c.statsBase.DX + (c.statsInvesties?.DX || 0) + eqBonus.DX + bonusCH20;
        const ch  = c.statsBase.CH + (c.statsInvesties?.CH || 0) + eqBonus.CH + bonusCH20;
        const pvMax = (fo * 2) + ini + (c.boostPV || 0);
        const ftMax = (cn * 2) + ini + (c.boostFT || 0);
        const pvPct = pvMax > 0 ? Math.round((c.pvActuel / pvMax) * 100) : 0;
        const ftPct = ftMax > 0 ? Math.round((c.ftActuel / ftMax) * 100) : 0;

        // Compétences investies
        const compStr = c.compInvesties
            ? Object.entries(c.compInvesties).filter(([, v]) => v > 0).map(([k, v]) => `${k}:${v}`).join(' · ')
            : '';

        // Charge du compagnon
        const poidsComp = (typeof _calculerPoidsPersonnage === 'function') ? _calculerPoidsPersonnage(c) : 0;
        const chargeCompMax = (typeof _chargeMax === 'function') ? _chargeMax(c) : fo * 2;
        const compSurcharge = poidsComp > chargeCompMax;
        const chargeColor = compSurcharge ? '#f44336' : poidsComp > chargeCompMax * 0.8 ? '#ff9800' : '#4caf50';

        fragments.push(`
            <div class="compagnon-card">
                <div class="compagnon-header">
                    <span class="compagnon-nom">${c.nom}</span>
                    <span class="compagnon-niveau">Niv. ${c.niveau || 1}</span>
                </div>
                <div class="compagnon-identite">${c.race || '?'} — ${c.sexe === 'F' ? 'Féminin' : 'Masculin'}</div>
                <div class="compagnon-antecedent">${c.antecedent || ''}</div>

                <div class="compagnon-bars">
                    <div class="compagnon-bar-label"><span>❤ PV</span><span>${c.pvActuel} / ${pvMax}</span></div>
                    <div class="compagnon-bar-track"><div class="compagnon-bar-fill pv" style="width:${pvPct}%"></div></div>
                    <div class="compagnon-bar-label"><span>⚡ FT</span><span>${c.ftActuel} / ${ftMax}</span></div>
                    <div class="compagnon-bar-track"><div class="compagnon-bar-fill ft" style="width:${ftPct}%"></div></div>
                    <div class="compagnon-bar-label" style="margin-top:4px;">
                        <span>⚖ Charge</span>
                        <span style="color:${chargeColor};">${poidsComp.toFixed(1)} / ${chargeCompMax} kg${compSurcharge ? ' ⚠' : ''}</span>
                    </div>
                </div>

                <div class="compagnon-stats-grid">
                    <div class="compagnon-stat"><span class="cs-label">FO</span><span class="cs-val">${fo}${eqBonus.FO ? '<span style="color:#4caf50;font-size:0.7em">+'+eqBonus.FO+'</span>' : ''}</span></div>
                    <div class="compagnon-stat"><span class="cs-label">IN</span><span class="cs-val">${ini}${eqBonus.IN ? '<span style="color:#4caf50;font-size:0.7em">+'+eqBonus.IN+'</span>' : ''}</span></div>
                    <div class="compagnon-stat"><span class="cs-label">CN</span><span class="cs-val">${cn}${eqBonus.CN ? '<span style="color:#4caf50;font-size:0.7em">+'+eqBonus.CN+'</span>' : ''}</span></div>
                    <div class="compagnon-stat"><span class="cs-label">DX</span><span class="cs-val">${dx}${eqBonus.DX ? '<span style="color:#4caf50;font-size:0.7em">+'+eqBonus.DX+'</span>' : ''}</span></div>
                    <div class="compagnon-stat"><span class="cs-label">CH</span><span class="cs-val">${ch}${eqBonus.CH ? '<span style="color:#4caf50;font-size:0.7em">+'+eqBonus.CH+'</span>' : ''}</span></div>
                </div>

                ${_compagnon_equipementHtml(c, idx)}
                ${compStr ? `<div class="compagnon-comps">📚 ${compStr}</div>` : ''}
                ${_compagnon_sortsHtml(c)}
                ${_compagnon_inventaireHtml(c, idx)}
                ${(typeof _genererLedsXP === 'function') ? '<div style="margin-top:6px;">' + _genererLedsXP(c.xp || 0, c.niveau || 1) + '</div>' : ''}
            </div>
        `);
    });

    const enTete = `<div class="compagnons-max-info">Compagnons : ${comps.length} / ${maxComps} (CH ${statCH})</div>`;
    container.innerHTML = enTete + fragments.join('');
}

function _compagnon_sortsHtml(c) {
    if (typeof magieData === 'undefined') return '';
    const source = (c.magieInvesties && Object.keys(c.magieInvesties).length > 0)
        ? c.magieInvesties : (c.magieBase || {});
    const sorts = [];
    for (let ecole in source) {
        const niv = parseInt(source[ecole]) || 0;
        if (niv > 0 && magieData[ecole]?.sorts) {
            for (let i = 0; i < niv; i++) {
                if (magieData[ecole].sorts[i]) sorts.push(magieData[ecole].sorts[i].nom);
            }
        }
    }
    if (!sorts.length) return '';
    return `<div class="compagnon-spells">✨ ${sorts.join(' · ')}</div>`;
}

function _compagnon_inventaireHtml(c, idx) {
    const items = c.inventaire || [];
    const reparation_pts = window.perso?.compInvesties?.reparation || 0;
    let html = '<div class="compagnon-invent">';
    if (c.argent) html += `<span class="compagnon-invent-item">💰 ${c.argent} or</span>`;
    if (typeof itemsData !== 'undefined') {
        items.forEach((it, i) => {
            const def = itemsData[it.id];
            if (!def) return;
            const durStr = it.durabilite !== undefined
                ? ` <small style="color:${it.durabilite <= 0 ? '#f44336' : it.durabilite < 30 ? '#ff9800' : '#aaa'};">[${it.durabilite}/${it.durabiliteMax || 100}]</small>`
                : '';
            const btnRepComp = (it.durabilite !== undefined && reparation_pts > 0 && it.durabilite < (it.durabiliteMax || 100))
                ? ` <button class="comp-inv-btn" style="color:#ff9800;" title="Réparer" onclick="_reparerInvCompagnon(${idx},${i})">🔧</button>`
                : '';
            html += `<span class="compagnon-invent-item">${def.nom} ×${it.quantite || 1}${durStr}`
                + ` <button class="comp-inv-btn" title="Reprendre" onclick="_reprendreItemCompagnon(${idx},${i})">⬆</button>`
                + btnRepComp
                + ` <button class="comp-inv-btn" style="color:#e57373;" title="Jeter" onclick="_retirerItemCompagnon(${idx},${i})">✕</button>`
                + `</span>`;
        });
    }
    html += `<button class="comp-inv-btn" style="margin-top:4px; font-size:0.75em; padding:2px 7px;" onclick="ouvrirDonnerItemCompagnon(${idx})">＋ Donner un objet</button>`;
    html += '</div>';
    return html;
}

/** Reprend 1 exemplaire d'un item du compagnon vers l'inventaire du joueur. */
function _reprendreItemCompagnon(compIdx, itemIdx) {
    const comps = window.perso?.compagnons;
    if (!comps?.[compIdx]) return;
    const items = comps[compIdx].inventaire || [];
    const it = items[itemIdx];
    if (!it) return;

    // Vérifier la charge du joueur avant d'accepter l'objet
    if (typeof _estSurcharge === 'function' && _estSurcharge(window.perso)) {
        if (typeof _toast === 'function') _toast('⚠ Inventaire plein ! Vous êtes surchargé.', 'error');
        return;
    }

    // Retirer du compagnon (1 exemplaire)
    if ((it.quantite || 1) > 1) { it.quantite--; it.qte = it.quantite; }
    else items.splice(itemIdx, 1);
    comps[compIdx].inventaire = items;

    // Dégradation de durabilité au transfert (objets équipables uniquement)
    const transferItem = { id: it.id, quantite: 1, qte: 1 };
    if (it.durabilite !== undefined) {
        transferItem.durabilite = Math.max(0, (it.durabilite || 0) - 5);
        transferItem.durabiliteMax = it.durabiliteMax || 100;
    }

    // Ajouter au joueur — items avec durabilité toujours en entrée séparée
    const inv = window.perso.inventaire;
    if (it.durabilite === undefined) {
        const exist = inv.findIndex(i => i.id === it.id && i.durabilite === undefined);
        if (exist !== -1) { inv[exist].quantite = (inv[exist].quantite || 1) + 1; inv[exist].qte = inv[exist].quantite; }
        else inv.push(transferItem);
    } else {
        inv.push(transferItem);
    }

    if (typeof autoSave === 'function') autoSave();
    if (typeof _syncCompagnonsSummary === 'function') _syncCompagnonsSummary();
    afficherEcranCompagnons();
}

/** Affiche les slots d'équipement du compagnon avec boutons équiper/déséquiper. */
function _compagnon_equipementHtml(c, idx) {
    if (typeof itemsData === 'undefined') return '';
    const slots = { tete:'Tête', torse:'Torse', gants:'Mains', bottes:'Pieds',
                    anneau:'Anneau', amulette:'Amulette', main_droite:'Main D.', main_gauche:'Main G.' };
    if (!c.equipement) c.equipement = {};
    const eq = c.equipement;

    // Détecte arme 2 mains
    const estDeuxMains = !!(eq.main_droite && itemsData[eq.main_droite.id]?.equipable === 'deux_mains');

    let html = '<div class="compagnon-equip-slots">';
    for (let slot in slots) {
        const item = eq[slot];
        if (slot === 'main_gauche' && estDeuxMains) {
            html += `<div class="comp-eq-slot blocked"><span class="comp-eq-label">${slots[slot]}</span><span style="color:#8b4513;font-size:0.7em;">⛔ 2 mains</span></div>`;
            continue;
        }
        if (item && itemsData[item.id]) {
            const def = itemsData[item.id];
            const armStr = def.armure ? ` 🛡${def.armure}` : '';
            const degStr = def.degats && def.degats !== '0' ? ` ⚔${def.degats}` : '';
            const durComp = item.durabilite;
            const durMaxComp = item.durabiliteMax || 100;
            const durColorComp = durComp !== undefined ? (durComp <= 0 ? '#f44336' : durComp < 30 ? '#ff9800' : '#aaa') : '';
            const durStrComp = durComp !== undefined
                ? ` <small style="color:${durColorComp};">[${durComp}/${durMaxComp}]</small>` : '';
            const repPts = window.perso?.compInvesties?.reparation || 0;
            const btnRepEq = (durComp !== undefined && repPts > 0 && durComp < durMaxComp)
                ? `<button class="comp-inv-btn" style="color:#ff9800;" title="Réparer" onclick="_reparerEquipCompagnon(${idx},'${slot}')">🔧</button>`
                : '';
            html += `<div class="comp-eq-slot equipped">
                <span class="comp-eq-label">${slots[slot]}</span>
                <span class="comp-eq-nom">${def.nom}${armStr}${degStr}${durStrComp}</span>
                <div style="display:flex;gap:2px;">${btnRepEq}<button class="comp-inv-btn" style="color:#e57373;" onclick="_desequiperCompagnon(${idx},'${slot}')">✕</button></div>
            </div>`;
        } else {
            html += `<div class="comp-eq-slot empty"><span class="comp-eq-label">${slots[slot]}</span><span style="color:#444;font-size:0.7em;">—</span></div>`;
        }
    }
    // Bouton pour équiper un objet depuis l'inventaire du compagnon
    const equipables = (c.inventaire || []).filter(it => {
        const def = itemsData[it.id];
        return def && def.equipable && def.equipable !== 'aucun';
    });
    if (equipables.length) {
        html += `<button class="comp-inv-btn" style="margin-top:4px;font-size:0.75em;padding:2px 7px;" onclick="ouvrirEquiperCompagnon(${idx})">🗡 Équiper un objet</button>`;
    }
    html += '</div>';
    return html;
}

function ouvrirEquiperCompagnon(compIdx) {
    const c = window.perso?.compagnons?.[compIdx];
    if (!c) return;
    const equipables = (c.inventaire || []).filter(it => {
        const def = typeof itemsData !== 'undefined' ? itemsData[it.id] : null;
        return def && def.equipable && def.equipable !== 'aucun';
    });
    let modal = document.getElementById('modal-comp-equip');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-comp-equip';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }
    let html = `<div style="background:#1a120a;border:2px solid #d4af37;border-radius:8px;padding:20px;max-width:360px;width:90%;max-height:70vh;overflow-y:auto;">
        <h3 style="color:#d4af37;margin:0 0 12px;">🗡 Équiper ${c.nom}</h3>
        <div style="display:flex;flex-direction:column;gap:6px;">`;
    equipables.forEach((it) => {
        const def = itemsData[it.id];
        const invIdx = c.inventaire.indexOf(it);
        html += `<button onclick="_equiperCompagnon(${compIdx},${invIdx})" style="background:#2a1a0a;border:1px solid #5a3a10;color:#eee;padding:8px;border-radius:4px;cursor:pointer;text-align:left;">
            ${def.nom} <span style="color:#888;font-size:0.8em;">[${def.equipable}]</span></button>`;
    });
    html += `</div><button onclick="document.getElementById('modal-comp-equip').style.display='none'" style="margin-top:12px;background:#333;color:#aaa;border:none;padding:6px 14px;border-radius:4px;cursor:pointer;">Fermer</button></div>`;
    modal.innerHTML = html;
    modal.style.display = 'flex';
}

function _equiperCompagnon(compIdx, invIdx) {
    const c = window.perso?.compagnons?.[compIdx];
    if (!c || !c.inventaire?.[invIdx]) return;
    if (!c.equipement) c.equipement = {};
    const it = c.inventaire[invIdx];
    const def = itemsData[it.id];
    if (!def?.equipable) return;
    let slot = def.equipable;
    // Arme 2 mains : libérer main droite et gauche
    if (slot === 'deux_mains') {
        if (c.equipement.main_droite) c.inventaire.push(c.equipement.main_droite);
        if (c.equipement.main_gauche) c.inventaire.push(c.equipement.main_gauche);
        c.equipement.main_droite = it;
        c.equipement.main_gauche = null;
    } else {
        if (c.equipement[slot]) c.inventaire.push(c.equipement[slot]);
        c.equipement[slot] = it;
    }
    c.inventaire.splice(invIdx, 1);

    // Initialiser la durabilité uniquement pour les types éligibles (armes + armures)
    const targetSlotComp = (slot === 'deux_mains') ? 'main_droite' : slot;
    const eqCompApres = c.equipement[targetSlotComp];
    if (eqCompApres && typeof itemsData !== 'undefined' && typeof _itemADurabilite === 'function') {
        const defComp = itemsData[eqCompApres.id];
        if (_itemADurabilite(defComp) && eqCompApres.durabilite === undefined) {
            eqCompApres.durabilite = 100; eqCompApres.durabiliteMax = 100;
        }
    }

    document.getElementById('modal-comp-equip').style.display = 'none';
    if (typeof autoSave === 'function') autoSave();
    if (typeof _syncCompagnonsSummary === 'function') _syncCompagnonsSummary();
    afficherEcranCompagnons();
}

function _desequiperCompagnon(compIdx, slot) {
    const c = window.perso?.compagnons?.[compIdx];
    if (!c?.equipement?.[slot]) return;
    if (!c.inventaire) c.inventaire = [];
    c.inventaire.push(c.equipement[slot]);
    c.equipement[slot] = null;
    if (typeof autoSave === 'function') autoSave();
    if (typeof _syncCompagnonsSummary === 'function') _syncCompagnonsSummary();
    afficherEcranCompagnons();
}

function _retirerItemCompagnon(compIdx, itemIdx) {
    const comps = window.perso?.compagnons;
    if (!comps || !comps[compIdx]) return;
    const items = comps[compIdx].inventaire || [];
    if (!items[itemIdx]) return;
    const it = items[itemIdx];
    if (it.quantite > 1) { it.quantite--; }
    else { items.splice(itemIdx, 1); }
    comps[compIdx].inventaire = items;
    if (typeof autoSave === 'function') autoSave();
    if (typeof _syncCompagnonsSummary === 'function') _syncCompagnonsSummary();
    afficherEcranCompagnons();
}

/** Répare un objet équipé sur un compagnon. */
function _reparerEquipCompagnon(compIdx, slot) {
    const c = window.perso?.compagnons?.[compIdx];
    if (!c?.equipement?.[slot]) return;
    const reparation_pts = window.perso?.compInvesties?.reparation || 0;
    if (reparation_pts <= 0) return;
    if (typeof _appliquerReparation !== 'function') return;
    if (!_appliquerReparation(c.equipement[slot], reparation_pts)) return;
    if (typeof autoSave === 'function') autoSave();
    if (typeof _toast === 'function') _toast(`🔧 Réparé ! Durabilité max réduite à ${c.equipement[slot].durabiliteMax}.`, 'success');
    afficherEcranCompagnons();
}

/** Répare un objet dans l'inventaire d'un compagnon. */
function _reparerInvCompagnon(compIdx, itemIdx) {
    const c = window.perso?.compagnons?.[compIdx];
    const item = c?.inventaire?.[itemIdx];
    if (!item || item.durabilite === undefined) return;
    const reparation_pts = window.perso?.compInvesties?.reparation || 0;
    if (reparation_pts <= 0) return;
    if (typeof _appliquerReparation !== 'function') return;
    if (!_appliquerReparation(item, reparation_pts)) return;
    if (typeof autoSave === 'function') autoSave();
    if (typeof _toast === 'function') _toast(`🔧 Réparé ! Durabilité max réduite à ${item.durabiliteMax}.`, 'success');
    afficherEcranCompagnons();
}

/** Ouvre une modal pour choisir quel objet du joueur donner au compagnon. */
function ouvrirDonnerItemCompagnon(compIdx) {
    const inv = window.perso?.inventaire || [];
    let modal = document.getElementById('modal-comp-don');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-comp-don';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }
    let html = `<div style="background:#1a120a;border:2px solid #d4af37;border-radius:8px;padding:20px;max-width:360px;width:90%;max-height:70vh;overflow-y:auto;">
        <h3 style="color:#d4af37;margin:0 0 12px;">Donner au compagnon</h3>
        <div style="display:flex;flex-direction:column;gap:6px;">`;
    if (!inv.length) {
        html += `<p style="color:#888;text-align:center;">Votre inventaire est vide.</p>`;
    } else {
        inv.forEach((it, i) => {
            const def = typeof itemsData !== 'undefined' ? itemsData[it.id] : null;
            if (!def) return;
            html += `<button onclick="_donnerItemCompagnon(${compIdx},${i})" style="background:#2a1a0a;border:1px solid #5a3a10;color:#eee;padding:8px;border-radius:4px;cursor:pointer;text-align:left;">
                ${def.nom} <span style="color:#aaa;">×${it.quantite || 1}</span></button>`;
        });
    }
    html += `</div><button onclick="document.getElementById('modal-comp-don').style.display='none'" style="margin-top:12px;background:#333;color:#aaa;border:none;padding:6px 14px;border-radius:4px;cursor:pointer;">Fermer</button></div>`;
    modal.innerHTML = html;
    modal.style.display = 'flex';
}

function _donnerItemCompagnon(compIdx, invIdx) {
    const comps = window.perso?.compagnons;
    const inv = window.perso?.inventaire;
    if (!comps?.[compIdx] || !inv?.[invIdx]) return;

    // Vérifier la charge du compagnon avant d'accepter l'objet
    const comp = comps[compIdx];
    if (typeof _calculerPoidsPersonnage === 'function' && typeof _chargeMax === 'function') {
        const poidsComp = _calculerPoidsPersonnage(comp);
        const chargeComp = _chargeMax(comp);
        if (poidsComp >= chargeComp) {
            if (typeof _toast === 'function') _toast(`⚠ ${comp.nom} est surchargé !`, 'error');
            return;
        }
    }

    const it = inv[invIdx];
    // Retirer du joueur (1 exemplaire)
    if ((it.quantite || 1) > 1) { it.quantite--; it.qte = it.quantite; }
    else inv.splice(invIdx, 1);

    // Dégradation de durabilité au transfert
    const transferItem = { id: it.id, quantite: 1, qte: 1 };
    if (it.durabilite !== undefined) {
        transferItem.durabilite = Math.max(0, (it.durabilite || 0) - 5);
        transferItem.durabiliteMax = it.durabiliteMax || 100;
    }

    // Ajouter au compagnon — items avec durabilité toujours en entrée séparée
    if (!comp.inventaire) comp.inventaire = [];
    if (it.durabilite === undefined) {
        const exist = comp.inventaire.findIndex(i => i.id === it.id && i.durabilite === undefined);
        if (exist !== -1) comp.inventaire[exist].quantite = (comp.inventaire[exist].quantite || 1) + 1;
        else comp.inventaire.push(transferItem);
    } else {
        comp.inventaire.push(transferItem);
    }

    if (typeof autoSave === 'function') autoSave();
    if (typeof _syncCompagnonsSummary === 'function') _syncCompagnonsSummary();
    document.getElementById('modal-comp-don').style.display = 'none';
    afficherEcranCompagnons();
}

function ouvrirAide() {
    cacherTout();
    const ecranAide = document.getElementById('ecran-aide');
    if (ecranAide) ecranAide.style.display = 'block';
}

function ouvrirPatchNotes(onglet) {
    const modal = document.getElementById('modal-patchnotes');
    const contenu = document.getElementById('patchnotes-contenu');
    if (!modal || !contenu) return;

    onglet = onglet || 'patch';

    // Surligner l'onglet actif
    ['patch', 'todo'].forEach(id => {
        const btn = document.getElementById('pn-tab-' + id);
        if (!btn) return;
        btn.style.color = id === onglet ? '#d4af37' : '#666';
        btn.style.borderBottomColor = id === onglet ? '#d4af37' : 'transparent';
        btn.style.fontWeight = id === onglet ? 'bold' : 'normal';
    });

    if (onglet === 'todo') {
        contenu.innerHTML = `
            <div style="margin-bottom:16px;">
                <h3 style="color:#4caf50;margin:0 0 8px;font-size:0.95em;">✅ Terminé</h3>
                <ul style="margin:0;padding-left:18px;color:#666;font-size:0.88em;line-height:1.7;">
                    <li>Magie temporaire (buffs 3 tours)</li>
                    <li>Bénédictions & Malédictions (MJ → joueur)</li>
                    <li>Système de Quêtes complet</li>
                    <li>Exploration de Donjon (grille, brouillard, événements)</li>
                    <li>Coffres : persistance multi-joueurs, clavier ZQSD/flèches</li>
                    <li>Quêtes : journal 4 onglets, tri statut/date, couleurs complètes</li>
                    <li>Poison : bypass armure, ne peut pas tuer (surplus → FT)</li>
                    <li>Level up : soin complet PV + FT</li>
                    <li>Don d'or via modal (même UI que don d'objet)</li>
                </ul>
            </div>
            <div>
                <h3 style="color:#f0b429;margin:0 0 8px;font-size:0.95em;">🔜 À faire</h3>
                <ul style="margin:0;padding-left:18px;color:#ccc;font-size:0.88em;line-height:1.7;">
                    <li>Pièges sur coffres/portes (déclencher à l'ouverture, types poison/élec/feu)</li>
                    <li>Bénédictions étendues (nouvelles catégories d'effets)</li>
                </ul>
            </div>`;
        modal.style.display = 'flex';
        return;
    }

    contenu.innerHTML = `
        <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #333;">
            <h3 style="color:#d4af37;margin:0 0 6px;font-size:1em;">v0.7 — Avril 2026</h3>
            <p style="color:#aaa;font-size:0.82em;margin:0 0 8px;font-style:italic;">Donjon (améliorations), quêtes, poison, level up, inventaire</p>
            <ul style="margin:0;padding-left:18px;color:#ccc;font-size:0.92em;">
                <li><strong style="color:#4caf50;">📜 Journal</strong> — 4 onglets (Quêtes · Bénédictions · Antécédent · Stats) ; XP/or cachés joueur ; couleurs complètes (vert/rouge) ; tri par statut ou date ↑↓</li>
                <li><strong style="color:#9c7fd4;">🗺 Donjon</strong> — clavier ZQSD + flèches ; coffres persistants (📭 uniquement si tout pris) ; bouton ré-interaction sur place ; crocheter/frapper coûte le tour ; items/sorts bloqués hors tour</li>
                <li><strong style="color:#9c7fd4;">🗺 Donjon</strong> — rencontre met le jeu en pause (bandeau rouge joueur) jusqu'à l'action du MJ</li>
                <li><strong style="color:#ff8080;">☠ Poison</strong> — bypass armure ; ne peut pas tuer (surplus sur FT) ; log de combat</li>
                <li>Level up : soin complet PV + FT</li>
                <li>Don d'or via modal joueur (sélection par bouton + champ montant)</li>
                <li>Inventaire équipé : durabilité affichée une seule fois (plus de doublon)</li>
            </ul>
        </div>
        <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #333;">
            <h3 style="color:#d4af37;margin:0 0 6px;font-size:1em;">v0.6 — Avril 2026</h3>
            <p style="color:#aaa;font-size:0.82em;margin:0 0 8px;font-style:italic;">Donjon, quêtes, bénédictions, armes rapides, magie temporaire</p>
            <ul style="margin:0;padding-left:18px;color:#ccc;font-size:0.92em;">
                <li><strong style="color:#9c7fd4;">🗺 Système de Donjon</strong> — MJ crée la grille et la lance ; joueurs se déplacent tour par tour avec brouillard de guerre ; pièges, coffres, découvertes, rencontres ; journal temps réel</li>
                <li><strong style="color:#4caf50;">📜 Système de Quêtes</strong> — MJ : créer/valider/échouer depuis le Codex ; joueur : journal avec statuts colorés ; récompenses XP + or distribuées automatiquement</li>
                <li><strong style="color:#ffd700;">✨ Bénédictions & Malédictions</strong> — le MJ attribue des effets (stats, PV/FT, compétences) ; badges colorés sur l'accueil et la fiche</li>
                <li><strong style="color:#f0b429;">⚡ Armes & sorts rapides</strong> — dague, couteau, rapière, revolver, fusil, sort Blessure : attaque deux fois par tour</li>
                <li><strong style="color:#80cbc4;">✨ Magie temporaire</strong> — sorts de stat, buff 3 tours, rapides, XP +2</li>
                <li>Vol à la tire : recherche, catégories, or libre ; formule DX×3 + comp×4</li>
                <li>Firebase sécurisé + correction auth race condition</li>
            </ul>
        </div>
        <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #333;">
            <h3 style="color:#d4af37;margin:0 0 6px;font-size:1em;">v0.5 — Avril 2026</h3>
            <p style="color:#aaa;font-size:0.82em;margin:0 0 8px;font-style:italic;">Poison, combat, multijoueur</p>
            <ul style="margin:0;padding-left:18px;color:#ccc;font-size:0.92em;">
                <li>Poison : guérison avant dégâts, 15% PV max/tour</li>
                <li>Mort en combat : résurrection requise ; défaite auto si tous KO</li>
                <li>Corrections multijoueur (PV morts, soins MJ, doublons cartes)</li>
            </ul>
        </div>
        <div style="margin-bottom:20px;">
            <h3 style="color:#d4af37;margin:0 0 6px;font-size:1em;">v0.4 — Mars 2026</h3>
            <p style="color:#aaa;font-size:0.82em;margin:0 0 8px;font-style:italic;">Compagnons, combat phase 2</p>
            <ul style="margin:0;padding-left:18px;color:#ccc;font-size:0.92em;">
                <li>Système compagnons : stats, sorts, combat</li>
                <li>Ordre de jeu DX, sorts/consommables en combat, critiques, éléments</li>
            </ul>
        </div>`;

    modal.style.display = 'flex';
}

/** Rétro-compatibilité : anciens appels vers ouvrirJournalQuetes() */
function ouvrirJournalQuetes() { ouvrirJournal('quetes'); }

/**
 * Ouvre le journal à l'onglet demandé.
 * @param {'quetes'|'effets'|'antecedent'|'stats'} onglet
 */
function ouvrirJournal(onglet) {
    const modal   = document.getElementById('modal-journal');
    const contenu = document.getElementById('journal-contenu');
    if (!modal || !contenu) return;

    // Surligner l'onglet actif
    ['quetes', 'effets', 'antecedent', 'stats'].forEach(id => {
        const btn = document.getElementById('jt-' + id);
        if (!btn) return;
        const actif = id === onglet;
        btn.style.color           = actif ? '#b39ddb' : '#666';
        btn.style.borderBottomColor = actif ? '#7c4dff' : 'transparent';
        btn.style.fontWeight      = actif ? 'bold' : 'normal';
    });

    if (onglet === 'quetes') {
        const myID = (window.perso?.nom || '').replace(/\s+/g, '_');
        const quetes = window._quetesActives || {};
        const mesMissions = Object.entries(quetes).filter(([, q]) => {
            if (q.statut === 'cachee') return false;
            const liste = q.joueurs || [];
            return liste.length === 0 || liste.includes(myID);
        });

        // Tri courant : 'statut_asc' (défaut), 'statut_desc', 'date_asc', 'date_desc'
        if (!window._journalSortMode) window._journalSortMode = 'statut_asc';
        const sortMode = window._journalSortMode;
        const [sortCle, sortDir] = sortMode.split('_'); // 'statut'/'date' + 'asc'/'desc'

        if (sortCle === 'date') {
            mesMissions.sort(([, a], [, b]) =>
                sortDir === 'asc'
                    ? (a.timestamp || 0) - (b.timestamp || 0)
                    : (b.timestamp || 0) - (a.timestamp || 0)
            );
        } else {
            const ordre = { en_cours: 0, validee: 1, echouee: 2 };
            mesMissions.sort(([, a], [, b]) =>
                sortDir === 'asc'
                    ? (ordre[a.statut] || 0) - (ordre[b.statut] || 0)
                    : (ordre[b.statut] || 0) - (ordre[a.statut] || 0)
            );
        }

        // Cliquer sur le bouton actif inverse la direction ; sinon bascule sur ce critère en asc
        const _mkSortClick = (cle) => {
            if (sortCle === cle) return `${cle}_${sortDir === 'asc' ? 'desc' : 'asc'}`;
            return `${cle}_asc`;
        };
        const _arrow = (cle) => sortCle === cle ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '';
        const _actif = (cle) => sortCle === cle;

        const btnStatut = `<button onclick="window._journalSortMode='${_mkSortClick('statut')}';ouvrirJournal('quetes')"
            style="padding:4px 12px;border:none;border-radius:4px;cursor:pointer;
            background:${_actif('statut')?'#7c4dff':'#333'};
            color:${_actif('statut')?'#fff':'#aaa'};font-size:0.8em;">Statut${_arrow('statut')}</button>`;
        const btnDate = `<button onclick="window._journalSortMode='${_mkSortClick('date')}';ouvrirJournal('quetes')"
            style="padding:4px 12px;border:none;border-radius:4px;cursor:pointer;
            background:${_actif('date')?'#7c4dff':'#333'};
            color:${_actif('date')?'#fff':'#aaa'};font-size:0.8em;">Date${_arrow('date')}</button>`;
        const sortBar = `<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;color:#666;font-size:0.8em;">
            Trier par : ${btnStatut}${btnDate}
        </div>`;

        if (mesMissions.length === 0) {
            contenu.innerHTML = sortBar + `<p style="color:#555;text-align:center;padding:20px;">Aucune quête en cours.</p>`;
        } else {
            const cartes = mesMissions.map(([, q]) => {
                const valide = q.statut === 'validee';
                const echoue = q.statut === 'echouee';
                const badge  = valide ? '✅' : echoue ? '❌' : '🔵';

                if (valide) {
                    return `<div style="border:1px solid #2e7d32;border-radius:8px;padding:12px;margin-bottom:10px;background:rgba(46,125,50,0.12);">
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                            <span>${badge}</span>
                            <strong style="color:#4caf50;">${q.nom}</strong>
                        </div>
                        <div style="font-size:0.8em;color:#388e3c;margin-bottom:4px;">Donné par : <em>${q.donneur || '—'}</em></div>
                        <div style="color:#66bb6a;font-size:0.85em;">${q.resume || ''}</div>
                    </div>`;
                } else if (echoue) {
                    return `<div style="border:1px solid #7f1010;border-radius:8px;padding:12px;margin-bottom:10px;background:rgba(100,0,0,0.15);">
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                            <span>${badge}</span>
                            <strong style="color:#e53935;text-decoration:line-through;">${q.nom}</strong>
                        </div>
                        <div style="font-size:0.8em;color:#c62828;margin-bottom:4px;text-decoration:line-through;">Donné par : <em>${q.donneur || '—'}</em></div>
                        <div style="color:#ef9a9a;font-size:0.85em;text-decoration:line-through;">${q.resume || ''}</div>
                    </div>`;
                } else {
                    return `<div style="border:1px solid #d4af37;border-radius:8px;padding:12px;margin-bottom:10px;background:#0a0f0a;">
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                            <span>${badge}</span>
                            <strong style="color:#d4af37;">${q.nom}</strong>
                        </div>
                        <div style="font-size:0.8em;color:#666;margin-bottom:4px;">Donné par : <em>${q.donneur || '—'}</em></div>
                        <div style="color:#aaa;font-size:0.85em;">${q.resume || ''}</div>
                    </div>`;
                }
            }).join('');
            contenu.innerHTML = sortBar + cartes;
        }

    } else if (onglet === 'effets') {
        const effets = window.perso?.effets_actifs;
        if (!effets || Object.keys(effets).length === 0) {
            contenu.innerHTML = `<p style="color:#555;text-align:center;padding:20px;">Aucun effet actif.</p>`;
        } else {
            contenu.innerHTML = Object.entries(effets).map(([, e]) => {
                const estBen   = e.type === 'benediction';
                const couleur  = estBen ? '#ffd700' : '#ce93d8';
                const bg       = estBen ? 'rgba(255,215,0,0.07)' : 'rgba(156,39,176,0.1)';
                const bord     = estBen ? '#7a6000' : '#6a1b8a';
                const statsStr = [
                    ...Object.entries(e.stats || {}).filter(([, v]) => v !== 0).map(([k, v]) => `${k} ${v > 0 ? '+' + v : v}`),
                    ...(e.pvBonus ? [`PV ${e.pvBonus > 0 ? '+' + e.pvBonus : e.pvBonus}`] : []),
                    ...(e.ftBonus ? [`FT ${e.ftBonus > 0 ? '+' + e.ftBonus : e.ftBonus}`] : []),
                    ...Object.entries(e.comps || {}).filter(([, v]) => v !== 0).map(([k, v]) => `${k} ${v > 0 ? '+' + v : v}`)
                ].join(' · ');
                return `<div style="border:1px solid ${bord};border-radius:8px;padding:12px;margin-bottom:10px;background:${bg};">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                        <span style="font-size:1.2em;">${e.icone || (estBen ? '✨' : '💀')}</span>
                        <strong style="color:${couleur};">${e.nom}</strong>
                        <span style="font-size:0.75em;color:#666;">${estBen ? 'Bénédiction' : 'Malédiction'}</span>
                    </div>
                    ${statsStr ? `<div style="color:#aaa;font-size:0.82em;">${statsStr}</div>` : ''}
                </div>`;
            }).join('');
        }

    } else if (onglet === 'antecedent') {
        const p  = window.perso;
        if (!p) { contenu.innerHTML = `<p style="color:#555;text-align:center;padding:20px;">Aucun personnage chargé.</p>`; }
        else {
            const bgData = (typeof backgrounds !== 'undefined') ? backgrounds.find(b => b.nom === p.antecedent) : null;
            const desc   = bgData?.desc || '—';
            contenu.innerHTML = `
                <div style="border:1px solid #5c3a9d;border-radius:8px;padding:14px;background:#0d0a18;">
                    <div style="font-size:1em;font-weight:bold;color:#b39ddb;margin-bottom:8px;">
                        ${p.antecedent || 'Inconnu'}
                    </div>
                    <div style="color:#ccc;font-size:0.88em;line-height:1.7;">${desc}</div>
                </div>
                <div style="margin-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.82em;">
                    <div style="background:#0a0a0a;border:1px solid #333;border-radius:6px;padding:8px;">
                        <span style="color:#888;">Race</span><br><span style="color:#d4af37;">${p.race || '—'}</span>
                    </div>
                    <div style="background:#0a0a0a;border:1px solid #333;border-radius:6px;padding:8px;">
                        <span style="color:#888;">Niveau</span><br><span style="color:#d4af37;">${p.niveau || 1}</span>
                    </div>
                    <div style="background:#0a0a0a;border:1px solid #333;border-radius:6px;padding:8px;">
                        <span style="color:#888;">Alignement</span><br><span style="color:${(p.bonusInnes?.align || 0) >= 0 ? '#4caf50' : '#ff6b6b'};">${(p.bonusInnes?.align || 0) >= 0 ? '⚪ Bien' : '⚫ Mal'} (${p.bonusInnes?.align || 0})</span>
                    </div>
                    <div style="background:#0a0a0a;border:1px solid #333;border-radius:6px;padding:8px;">
                        <span style="color:#888;">XP total</span><br><span style="color:#d4af37;">${p.xp || 0}</span>
                    </div>
                </div>`;
        }

    } else if (onglet === 'stats') {
        const p  = window.perso;
        const sp = p?.stats_partie || {};
        const ligne = (icone, label, valeur, couleur) =>
            `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;border-bottom:1px solid #1a1a2a;">
                <span style="color:#888;">${icone} ${label}</span>
                <span style="color:${couleur || '#d4af37'};font-weight:bold;">${valeur}</span>
            </div>`;
        contenu.innerHTML = `
            <div style="border:1px solid #2a1a4a;border-radius:8px;overflow:hidden;background:#0a0a14;font-size:0.88em;">
                ${ligne('⚔️', 'Ennemis vaincus',       sp.ennemis_tues   || 0, '#ff6b6b')}
                ${ligne('❤️', 'Points de vie perdus',   sp.pv_perdus      || 0, '#e57373')}
                ${ligne('💰', 'Or total accumulé',      sp.or_cumule      || 0, '#ffd700')}
                ${ligne('🔮', 'Sorts lancés',           sp.sorts_lances   || 0, '#ce93d8')}
                ${ligne('🗡️', 'Attaques portées',       sp.attaques       || 0, '#ff9800')}
                ${ligne('🧪', 'Potions utilisées',      sp.potions        || 0, '#4caf50')}
                ${ligne('🚶', 'Cases parcourues',       sp.cases_parcourues || 0, '#80cbc4')}
                ${ligne('💀', 'Fois mort(e)',           sp.morts          || 0, '#888')}
            </div>`;
    }

    modal.style.display = 'flex';
}

function appliquerFondActuel() {
    if (!window.perso) return;
    if (window.perso.estMort) {
        document.body.style.backgroundImage = `url('./docs/img/fonds/mort.jpg')`; 
    } else {
        const idLieu = window.perso.lieuActuel || "crash";
        let lieuData = (typeof lieuxDecouverts !== 'undefined') ? lieuxDecouverts[idLieu] : null;
        if (lieuData && lieuData.fond) {
            document.body.style.backgroundImage = `url('./docs/img/fonds/${lieuData.fond}')`;
        } else {
            document.body.style.backgroundImage = `url('./docs/img/fonds/fond_arcanum_default.jpg')`;
        }
    }
    Object.assign(document.body.style, {
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundAttachment: "fixed"
    });
}

// Appelée quand le joueur passe son tour en combat — applique le poison actif
// Retourne le nombre de PV perdus (pour affichage dans le log)
function _appliquerPoison() {
    if (!window.perso?.poison) return 0;

    const CN = (window.perso.statsBase?.CN || 5) + (window.perso.statsInvesties?.CN || 0);
    // CN ≥ 20 : immunité totale, guérison immédiate
    if (CN >= 20) {
        window.perso.poison = null;
        if (typeof _toast === 'function') _toast('🛡 Immunité au poison (CN ≥ 20) !', 'success');
        if (typeof autoSave === 'function') autoSave();
        return 0;
    }

    const maxPV = (window.perso.statsBase.FO * 2) + window.perso.statsBase.IN
        + ((window.perso.statsInvesties?.FO || 0) * 2) + (window.perso.statsInvesties?.IN || 0)
        + (window.perso.boostPV || 0);
    const resPoison = window.perso.bonusInnes?.resPoison || 0;

    // 1. Tentative de guérison naturelle AVANT le tic de dégâts
    // Chance de base = CN / 2 (min 5%) — la stat Toxines dérivée reflète cette résistance
    const cnPoison  = (window.perso.statsBase?.CN || 0) + (window.perso.statsInvesties?.CN || 0);
    const chanceBase = Math.max(5, Math.floor(cnPoison / 2));
    const chanceActuelle = window.perso.poison.chanceGuerison || chanceBase;
    if (Math.floor(Math.random() * 100) < chanceActuelle) {
        window.perso.poison = null;
        if (typeof _toast === 'function') _toast('✅ Poison neutralisé — aucun dégât ce tour !', 'success');
        if (typeof autoSave === 'function') autoSave();
        rafraichirAccueil();
        return 0; // guéri avant le tic, pas de dégâts
    }
    // Raté : la chance augmente pour le prochain tour
    window.perso.poison.chanceGuerison = chanceActuelle + chanceBase;

    // 2. Dégâts de poison : 15% des PV max, réduits par résistance
    const degatsBase = Math.ceil(maxPV * 0.15);
    const degats = Math.max(1, Math.round(degatsBase * (1 - resPoison / 100)));

    const pvAvant = window.perso.pvActuel || 0;
    let msgPoison;

    if (pvAvant - degats <= 0) {
        // Le poison ne peut pas tuer : on vide les PV au minimum 1, le surplus passe en FT
        const pvAbsorbables = pvAvant - 1; // PV qu'on peut enlever sans tuer
        const surplus = degats - pvAbsorbables;
        window.perso.pvActuel = 1;
        window.perso.ftActuel = Math.max(0, (window.perso.ftActuel || 0) - surplus);
        msgPoison = `☠ Poison : −${pvAbsorbables} PV, −${surplus} FT (trop faible pour mourir du poison !)`;
        if (typeof _toast === 'function') _toast(msgPoison, 'error');
    } else {
        window.perso.pvActuel = pvAvant - degats;
        msgPoison = `☠ Poison : −${degats} PV (chance guérison : ${Math.min(100, chanceActuelle + chanceBase)}%)`;
        if (typeof _toast === 'function') _toast(msgPoison, 'error');
    }

    // Log dans le combat si actif
    if (typeof _logCombat === 'function') _logCombat(`☠ ${window.perso.nom} : ${msgPoison}`);

    if (typeof autoSave === 'function') autoSave();
    rafraichirAccueil();
    return degats;
}

function rafraichirAccueil() {
    const zoneNouveau = document.getElementById('accueil-nouveau-jeu');
    const zoneContinuer = document.getElementById('accueil-continuer');
    const nomAffiche = document.getElementById('accueil-nom-perso');
    const lieuAffiche = document.getElementById('accueil-lieu-perso'); 
    
    // Gestion du bouton "Fiche Personnage" (CORRIGÉ ICI)
    const btnFiche = document.querySelector("button[onclick='reprendrePartie()']");
    if (btnFiche && window.perso) {
        if (window.perso.pointsDispo > 0) {
            btnFiche.classList.add('alerte-level-up');
            btnFiche.innerHTML = "👤 DISTRIBUER POINTS (" + window.perso.pointsDispo + ")";
        } else {
            btnFiche.classList.remove('alerte-level-up');
            btnFiche.innerHTML = "👤 Fiche Personnage";
        }
    }

    if (window.perso && window.perso.nom && window.perso.nom !== "Nom du Personnage" && window.perso.nom !== "") {
        if (zoneNouveau) zoneNouveau.style.display = 'none';
        if (zoneContinuer) zoneContinuer.style.display = 'block';

        if (nomAffiche) nomAffiche.innerText = "Héros : " + window.perso.nom + " (Niv. " + (window.perso.niveau || 1) + ")";
        
        if (lieuAffiche && typeof lieuxDecouverts !== 'undefined') {
            const lieuData = lieuxDecouverts[window.perso.lieuActuel || "crash"];
            lieuAffiche.innerText = "Lieu actuel : " + (lieuData ? lieuData.nom : "Inconnu");
        }

// --- DANS TA FONCTION rafraichirAccueil() ---
const statsBox = document.getElementById('accueil-stats-perso');
if (statsBox && window.perso) {
    statsBox.style.display = 'block';
    
    // 1. Calcul des maximums réels
    const foTotal = (window.perso.statsBase.FO || 0) + (window.perso.statsInvesties?.FO || 0) + _bonusEffets(window.perso, 'FO');
    const inTotal = (window.perso.statsBase.IN || 0) + (window.perso.statsInvesties?.IN || 0) + _bonusEffets(window.perso, 'IN');
    const cnTotal = (window.perso.statsBase.CN || 0) + (window.perso.statsInvesties?.CN || 0) + _bonusEffets(window.perso, 'CN');
    const maxPV = (foTotal * 2) + inTotal + (window.perso.boostPV || 0) + _bonusEffets(window.perso, 'pv');
    const maxFT = (cnTotal * 2) + inTotal + (window.perso.boostFT || 0) + _bonusEffets(window.perso, 'ft');

    // 2. Récupération des valeurs actuelles SANS valeur par défaut automatique
    const pvReels = window.perso.pvActuel;
    const ftReels = window.perso.ftActuel;

    // 3. Logique d'affichage conditionnelle
    if (window.perso.estMort || pvReels <= 0) {
        statsBox.innerHTML = `
            <div style="text-align: center; padding: 10px; background: rgba(139, 0, 0, 0.2); border: 1px solid #8b0000; border-radius: 5px;">
                <div style="color: #ff4444; font-weight: bold;">💀 VOUS ÊTES MORT</div>
                <div style="color: #aaa; font-size: 0.85em;">Stats : ${pvReels}/${maxPV} PV | ${ftReels}/${maxFT} FT</div>
            </div>`;
    } else {
        statsBox.style.background = "";
        statsBox.style.border = "";
        // On affiche UNIQUEMENT pvReels, sans le remplacer par maxPV
        const xpLedsHtml = (typeof _genererLedsXP === 'function')
            ? _genererLedsXP(window.perso.xp || 0, window.perso.niveau || 1, window.perso)
            : '';
        const poisonBadge = window.perso.poison
            ? `<span style="display:inline-block; background:#2a0a00; color:#ff6b35; border:1px solid #ff6b35; border-radius:4px; padding:1px 6px; margin-left:8px; font-weight:bold; font-size:0.9em; animation:poison-pulse 1.5s ease-in-out infinite;" title="Empoisonné — guérison : ${window.perso.poison.chanceGuerison}%">☠ EMPOISONNÉ</span>`
            : '';
        statsBox.innerHTML = `
            ❤️ PV : <span id="accueil-pv" style="font-weight:bold;">${pvReels} / ${maxPV}</span>${poisonBadge}
            ⚡ FT : <span id="accueil-ft" style="font-weight:bold;">${ftReels} / ${maxFT}</span>
            ${xpLedsHtml}
        `;
    }
}

        if (typeof verifierBoutonCraft === "function") verifierBoutonCraft();

        const btnMagie = document.getElementById('btn-menu-magie');
        if (btnMagie) {
            let mesSorts = (typeof getSortsConnus === "function") ? getSortsConnus() : [];
            const compOntSorts = (window.perso?.compagnons || []).some(c =>
                Object.values(c.magieInvesties || {}).some(v => parseInt(v) > 0) ||
                Object.values(c.magieBase || {}).some(v => parseInt(v) > 0)
            );
            btnMagie.style.display = (mesSorts.length > 0 || compOntSorts) ? 'block' : 'none';
        }

        // Bouton Compagnons : visible si le joueur a au moins un compagnon
        const btnCompagnons = document.getElementById('btn-menu-compagnons');
        if (btnCompagnons) {
            const nbComps = (window.perso.compagnons || []).length;
            btnCompagnons.style.display = nbComps > 0 ? 'inline-block' : 'none';
        }

        // Bouton Groupe : visible si au moins un autre joueur est dans la session
        const btnGroupe = document.getElementById('btn-menu-groupe');
        if (btnGroupe && typeof db !== 'undefined' && typeof sessionActuelle !== 'undefined') {
            db.ref('parties/' + sessionActuelle + '/joueurs').once('value', (snap) => {
                const joueurs = snap.val();
                const nbAutres = joueurs ? Object.keys(joueurs).filter(id => joueurs[id].nom !== window.perso.nom).length : 0;
                btnGroupe.style.display = (nbAutres > 0) ? 'inline-block' : 'none';
            });
        }
    } else {
        if (zoneNouveau) zoneNouveau.style.display = 'block';
        if (zoneContinuer) zoneContinuer.style.display = 'none';
    }
}

// ==========================================
// 4. GESTION DU PERSONNAGE
// ==========================================
function verifierMort() {
    if (!window.perso) return;
    
    if (window.perso.pvActuel <= 0) {
        window.perso.pvActuel = 0;
        if (!window.perso.estMort) _incStatPartie('morts', 1); // ne compter qu'au moment où ça passe à mort
        window.perso.estMort = true;
        window.perso.poison = null; // La mort efface l'empoisonnement
        document.body.style.filter = "grayscale(100%)";
        if (typeof AudioEngine !== 'undefined') AudioEngine.stopMusique();
    } else {
        // Si PV > 0, on ressuscite
        window.perso.estMort = false;
        document.body.style.filter = "none";
        // Relancer la musique : piste MJ en cours, sinon ambiance du lieu
        if (typeof AudioEngine !== 'undefined') {
            db.ref('parties/' + sessionActuelle + '/musique_mj').once('value', (snapshot) => {
                const data = snapshot.val();
                if (data && data.fichier) {
                    AudioEngine.jouerMusique(data.fichier);
                } else {
                    const lieuData = (typeof lieuxDecouverts !== 'undefined') ? lieuxDecouverts[window.perso.lieuActuel] : null;
                    AudioEngine.jouerMusique(lieuData ? lieuData.musique : 'Arcanum.mp3');
                }
            });
        }
    }
    
    if (typeof synchroniserJoueur === 'function') synchroniserJoueur(); //
    rafraichirAccueil(); //
}


/**
 * Normalise un objet perso chargé depuis localStorage ou JSON importé.
 * Ajoute tous les champs manquants avec leurs valeurs par défaut.
 * N'écrase JAMAIS une valeur existante.
 */
function _migrerPerso(p) {
    if (!p) return p;

    // ── Champs scalaires ──────────────────────────────────────
    if (p.boostPV === undefined) p.boostPV = 0;
    if (p.boostFT === undefined) p.boostFT = 0;
    // Rattrapage rétroactif : +2 PV/FT par niveau passé (marqué par _boostLvlApplique)
    const _niveauxBonus = (p.niveau || 1) - 1; // nb de level-ups déjà faits
    if (!p._boostLvlApplique && _niveauxBonus > 0) {
        p.boostPV = (p.boostPV || 0) + _niveauxBonus * 2;
        p.boostFT = (p.boostFT || 0) + _niveauxBonus * 2;
    }
    p._boostLvlApplique = true; // flag : ne jamais réappliquer
    if (p.boostVitesseInne  === undefined) p.boostVitesseInne  = 0;
    if (p.poison            === undefined) p.poison            = null;
    if (p.compagnonsMemoire === undefined) p.compagnonsMemoire = {};
    if (!p.inventaire)    p.inventaire    = [];
    if (!p.techInvesties) p.techInvesties = {};
    if (!p.compInvesties) p.compInvesties = {};
    if (!p.magieInvesties) p.magieInvesties = {};
    if (!p.bonusInnes) p.bonusInnes = { align: 0, resPhys: 0, resPoison: 0, resMagie: 0, resFeu: 0, resElec: 0 };
    if (!p.statsInvesties) p.statsInvesties = { FO: 0, IN: 0, CN: 0, DX: 0, CH: 0 };

    // ── Équipement : slots manquants ──────────────────────────
    if (!p.equipement) p.equipement = {};
    ['tete','torse','gants','bottes','anneau','amulette','main_droite','main_gauche'].forEach(s => {
        if (!(s in p.equipement)) p.equipement[s] = null;
    });

    // ── Durabilité sur items équipés : ajout si manquant, nettoyage si incorrect ──
    const _ALL_SLOTS = ['tete','torse','gants','bottes','main_droite','main_gauche','deux_mains','anneau','amulette'];
    _ALL_SLOTS.forEach(slot => {
        const eq = p.equipement[slot];
        if (!eq || typeof itemsData === 'undefined') return;
        const def = itemsData[eq.id];
        if (!def) return;
        if (typeof _itemADurabilite === 'function' && _itemADurabilite(def)) {
            // Doit avoir durabilité
            if (eq.durabilite    === undefined) eq.durabilite    = 100;
            if (eq.durabiliteMax === undefined) eq.durabiliteMax = 100;
        } else {
            // Ne doit PAS avoir durabilité → nettoyer
            delete eq.durabilite;
            delete eq.durabiliteMax;
        }
    });

    // ── Inventaire : nettoyer durabilité sur items qui ne doivent pas en avoir ──
    (p.inventaire || []).forEach(it => {
        if (it.durabilite === undefined) return; // pas de durabilité → rien à faire
        if (typeof itemsData === 'undefined') return;
        const def = itemsData[it.id];
        if (!def || !(typeof _itemADurabilite === 'function' && _itemADurabilite(def))) {
            delete it.durabilite;
            delete it.durabiliteMax;
        }
    });

    // ── PV / FT actuels : recalculer si absent ou hors-borne ─
    const _fo  = (p.statsBase?.FO || 8) + (p.statsInvesties?.FO || 0);
    const _ini = (p.statsBase?.IN || 8) + (p.statsInvesties?.IN || 0);
    const _cn  = (p.statsBase?.CN || 8) + (p.statsInvesties?.CN || 0);
    const _maxPV = (_fo * 2) + _ini + (p.boostPV || 0);
    const _maxFT = (_cn * 2) + _ini + (p.boostFT || 0);
    if (p.pvActuel === undefined || p.pvActuel === null) p.pvActuel = _maxPV;
    if (p.ftActuel === undefined || p.ftActuel === null) p.ftActuel = _maxFT;
    // Corriger si la valeur dépasse le max (ex : stats réduites depuis)
    if (p.pvActuel > _maxPV) p.pvActuel = _maxPV;
    if (p.ftActuel > _maxFT) p.ftActuel = _maxFT;

    // ── Compagnons ────────────────────────────────────────────
    if (!p.compagnons) p.compagnons = [];
    p.compagnons.forEach(c => {
        if (!c.inventaire)    c.inventaire    = [];
        if (!c.magieInvesties) c.magieInvesties = {};
        if (!c.compInvesties)  c.compInvesties  = {};
        if (!c.techInvesties)  c.techInvesties  = {};
        if (!c.statsInvesties) c.statsInvesties = { FO: 0, IN: 0, CN: 0, DX: 0, CH: 0 };
        if (c.boostPV === undefined) c.boostPV = 0;
        if (c.boostFT === undefined) c.boostFT = 0;
        if (!c.equipement) c.equipement = {};
        ['tete','torse','gants','bottes','anneau','amulette','main_droite','main_gauche'].forEach(s => {
            if (!(s in c.equipement)) c.equipement[s] = null;
        });
        // Durabilité équipement compagnon : ajout si manquant, nettoyage si incorrect
        _ALL_SLOTS.forEach(slot => {
            const eq = c.equipement[slot];
            if (!eq || typeof itemsData === 'undefined') return;
            const def = itemsData[eq.id];
            if (!def) return;
            if (typeof _itemADurabilite === 'function' && _itemADurabilite(def)) {
                if (eq.durabilite    === undefined) eq.durabilite    = 100;
                if (eq.durabiliteMax === undefined) eq.durabiliteMax = 100;
            } else {
                delete eq.durabilite;
                delete eq.durabiliteMax;
            }
        });
        // Inventaire compagnon : nettoyer durabilité incorrecte
        (c.inventaire || []).forEach(it => {
            if (it.durabilite === undefined) return;
            if (typeof itemsData === 'undefined') return;
            const def = itemsData[it.id];
            if (!def || !(typeof _itemADurabilite === 'function' && _itemADurabilite(def))) {
                delete it.durabilite; delete it.durabiliteMax;
            }
        });
        // Magie depuis npcBase si absent
        if (c.npcId && typeof personnagesNPC !== 'undefined' && personnagesNPC[c.npcId]) {
            const base = personnagesNPC[c.npcId];
            if (!c.magieInvesties || Object.keys(c.magieInvesties).length === 0) {
                if (base.magieInvesties) c.magieInvesties = JSON.parse(JSON.stringify(base.magieInvesties));
            }
        }
        // PV / FT compagnon
        const cFO  = (c.statsBase?.FO || 5) + (c.statsInvesties?.FO || 0);
        const cIN  = (c.statsBase?.IN || 5) + (c.statsInvesties?.IN || 0);
        const cCN  = (c.statsBase?.CN || 5) + (c.statsInvesties?.CN || 0);
        const cMaxPV = (cFO * 2) + cIN + (c.boostPV || 0);
        const cMaxFT = (cCN * 2) + cIN + (c.boostFT || 0);
        if (c.pvActuel === undefined || c.pvActuel === null) c.pvActuel = cMaxPV;
        if (c.ftActuel === undefined || c.ftActuel === null) c.ftActuel = cMaxFT;
        if (c.pvActuel > cMaxPV) c.pvActuel = cMaxPV;
        if (c.ftActuel > cMaxFT) c.ftActuel = cMaxFT;
    });

    return p;
}

function chargerPersonnage() {
    const sauvegarde = localStorage.getItem('arcanum_sauvegarde');
    if (sauvegarde) {
        window.perso = _migrerPerso(JSON.parse(sauvegarde));

        // 1. On coupe le moteur audio immédiatement pour éviter les chevauchements
        if (typeof AudioEngine !== 'undefined') AudioEngine.stopMusique();

        // 2. Gestion de l'état de Mort
        if (window.perso.pvActuel <= 0 || window.perso.estMort) {
            window.perso.estMort = true;
            document.body.style.filter = "grayscale(100%)";
            console.log("🔇 [AUDIO] Silence forcé : le personnage est mort.");
        } else {
            // Musique normale seulement si le perso est vivant
            document.body.style.filter = "none"; // On remet les couleurs au cas où
            const lieuId = window.perso.lieuActuel || "crash";
            const lieuData = (typeof lieuxDecouverts !== 'undefined') ? lieuxDecouverts[lieuId] : null;
            
            if (lieuData && lieuData.musique && typeof AudioEngine !== 'undefined') {
                AudioEngine.jouerMusique(lieuData.musique);
            }
        }

        // 3. Reste du chargement (Sorti de la condition de musique)
        appliquerFondActuel();
        if (typeof demarrerMoteurMulti === "function") demarrerMoteurMulti();
        
        // On s'assure d'aller à l'accueil
        allerAccueil();
    }
}




function reprendrePartie() {
    if (!window.perso || !window.perso.nom) {
        const sauvegarde = localStorage.getItem('arcanum_sauvegarde');
        if (!sauvegarde) return;
        window.perso = JSON.parse(sauvegarde);
    }
    _migrerPerso(window.perso);
    cacherTout();
    const ecranFiche = document.getElementById('ecran-fiche');
    if (ecranFiche) {
        ecranFiche.style.display = 'block';
        if (typeof updateFicheUI === 'function') updateFicheUI();
    }
    if (typeof mettreAJourListeCibles === "function") mettreAJourListeCibles();
    appliquerFondActuel();
}

// ==========================================
// 5. SAUVEGARDE ET IMPORT/EXPORT
// ==========================================
/**
 * Incrémente un compteur dans window.perso.stats_partie.
 * Crée le sous-objet si absent.
 * @param {string} cle   Clé à incrémenter (ex: 'ennemis_tues')
 * @param {number} delta Valeur à ajouter (défaut 1)
 */
function _incStatPartie(cle, delta = 1) {
    if (!window.perso) return;
    if (!window.perso.stats_partie) window.perso.stats_partie = {};
    window.perso.stats_partie[cle] = (window.perso.stats_partie[cle] || 0) + delta;
}

let _autoSaveTimer = null;
function autoSave() {
    if (_autoSaveTimer) clearTimeout(_autoSaveTimer);
    _autoSaveTimer = setTimeout(() => {
        if (window.perso && window.perso.nom && window.perso.nom !== "Nom du Personnage") {
            localStorage.setItem('arcanum_sauvegarde', JSON.stringify(window.perso));
            // Relancer le moteur multi complet si le perso vient juste d'être prêt
            // (cas d'un nouveau joueur en navigation privée sans localStorage initial)
            if (!window._moteurMultiComplet && typeof demarrerMoteurMulti === 'function') {
                demarrerMoteurMulti();
            }
        }
        if (typeof synchroniserJoueur === "function") synchroniserJoueur();
    }, 300);
}

function telechargerFichier() {
    const blob = new Blob([JSON.stringify(window.perso, null, 2)], { type: "application/json" });
    const a = document.createElement('a'); 
    a.href = URL.createObjectURL(blob);
    a.download = (window.perso.nom || "perso") + "_arcanum.json"; 
    a.click();
}

function importerFichier(e) {
    if(!e.target.files[0]) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
        const p = _migrerPerso(JSON.parse(ev.target.result));
        if (p.nom) {
            localStorage.setItem('arcanum_sauvegarde', JSON.stringify(p));
            window.perso = p;
            if (typeof updateFicheUI === 'function') updateFicheUI(); 
            cacherTout(); 
            const ecranFiche = document.getElementById('ecran-fiche');
            if (ecranFiche) ecranFiche.style.display = 'block'; 
        }
    };
    reader.readAsText(e.target.files[0]);
}