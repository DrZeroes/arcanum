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
    const btnPN = document.getElementById('btn-patch-notes');
    if (btnPN) btnPN.style.display = 'none';
}

function allerAccueil() {
    autoSave();
    cacherTout();
    const ecran = document.getElementById('ecran-accueil');
    if (ecran) ecran.style.display = 'block';
    const btnPN = document.getElementById('btn-patch-notes');
    if (btnPN) btnPN.style.display = 'flex';
    rafraichirAccueil();
    if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
}

function lancerD20Accueil() {
    const btn = document.getElementById('btn-d20');
    const el  = document.getElementById('d20-resultat');
    if (!el || !btn) return;

    btn.classList.remove('rolling');
    void btn.offsetWidth;
    btn.classList.add('rolling');

    el.classList.remove('pop', 'crit');
    el.style.color = '#9575cd';
    let ticks = 0;
    const intervalle = setInterval(() => {
        el.textContent = 1 + Math.floor(Math.random() * 20);
        ticks++;
        if (ticks > 8) {
            clearInterval(intervalle);
            const roll   = 1 + Math.floor(Math.random() * 20);
            const isCrit = roll === 20;
            const isFail = roll === 1;
            el.textContent = roll;
            el.style.color = isCrit ? '#ffd700' : isFail ? '#ff4444' : '#e0c8ff';
            el.classList.add('pop');
            if (isCrit) el.classList.add('crit');
            btn.classList.remove('rolling');
            // Succès liés au dé d'accueil
            if (typeof _incStatPartie === 'function' && typeof _debloquerSucces === 'function') {
                if (roll === 1) {
                    _incStatPartie('de_as_1', 1);
                    if (window._dernierRollD20 === 1) _debloquerSucces('de_deux_1_suite');
                } else if (roll === 10) {
                    _incStatPartie('de_as_10', 1);
                    if (window._dernierRollD20 === 10) _debloquerSucces('de_deux_10_suite');
                }
                window._dernierRollD20 = roll;
            }
        }
    }, 60);
}

/**
 * Modal fiche complète d'un compagnon — lisible par le joueur ET le MJ.
 * cmp : objet compagnon live (avec statsBase, statsInvesties, compInvesties, etc.)
 */
function ouvrirFicheCompagnon(cmp) {
    document.getElementById('fiche-cmp-modal')?.remove();

    const fo  = (cmp.statsBase?.FO || 0) + (cmp.statsInvesties?.FO || 0);
    const ini = (cmp.statsBase?.IN || 0) + (cmp.statsInvesties?.IN || 0);
    const cn  = (cmp.statsBase?.CN || 0) + (cmp.statsInvesties?.CN || 0);
    const dx  = (cmp.statsBase?.DX || 0) + (cmp.statsInvesties?.DX || 0);
    const ch  = (cmp.statsBase?.CH || 0) + (cmp.statsInvesties?.CH || 0);
    const pvMax = (fo * 2) + ini + (cmp.boostPV || 0);
    const ftMax = (cn * 2) + ini + (cmp.boostFT || 0);
    const pvPct = pvMax > 0 ? Math.round(((cmp.pvActuel ?? pvMax) / pvMax) * 100) : 100;
    const ftPct = ftMax > 0 ? Math.round(((cmp.ftActuel ?? ftMax) / ftMax) * 100) : 100;

    const statRow = (label, base, inv) => {
        const total = (base || 0) + (inv || 0);
        const invStr = inv ? `<span style="color:#4caf50;font-size:0.8em"> (+${inv})</span>` : '';
        return `<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #222;">
            <span style="color:#aaa;">${label}</span>
            <span style="color:#fff;font-weight:bold;">${total}${invStr}</span>
        </div>`;
    };

    // Compétences
    let compsHtml = '';
    if (cmp.compInvesties && typeof competencesData !== 'undefined') {
        const rangsDef = (typeof RANGS !== 'undefined') ? RANGS : {};
        for (const cat in competencesData) {
            competencesData[cat].forEach(skill => {
                const inv = cmp.compInvesties[skill.id] || 0;
                if (!inv) return;
                const rang = cmp.rangsComp?.[skill.id] || 0;
                const ri   = rangsDef[rang];
                const badge = rang > 0 && ri
                    ? `<span style="background:${ri.color};color:${ri.txtColor};border-radius:3px;padding:0 4px;font-size:0.7em;margin-left:4px;">${ri.abbr}</span>`
                    : '';
                const eff = rang > 0 && ri ? Math.round(inv * ri.mult) : inv;
                compsHtml += `<div style="display:flex;justify-content:space-between;padding:2px 0;font-size:0.85em;">
                    <span style="color:#ccc;">${skill.nom}${badge}</span>
                    <span style="color:#d4af37;">${inv}${rang > 0 ? ' → <b>' + eff + '</b>' : ''}</span>
                </div>`;
            });
        }
    }

    // Magie
    let magieHtml = '';
    if (cmp.magieInvesties) {
        for (const [ecole, pts] of Object.entries(cmp.magieInvesties)) {
            if (!pts) continue;
            magieHtml += `<div style="display:flex;justify-content:space-between;font-size:0.85em;padding:2px 0;">
                <span style="color:#ce93d8;">✨ ${ecole}</span><span style="color:#fff;">${pts}/5</span>
            </div>`;
        }
    }

    // Tech
    let techHtml = '';
    if (cmp.techInvesties) {
        for (const [disc, pts] of Object.entries(cmp.techInvesties)) {
            if (!pts) continue;
            techHtml += `<div style="display:flex;justify-content:space-between;font-size:0.85em;padding:2px 0;">
                <span style="color:#80cbc4;">⚙ ${disc}</span><span style="color:#fff;">${pts}/5</span>
            </div>`;
        }
    }

    // Équipement
    const slotLabels = { main_droite:'Main droite', main_gauche:'Main gauche / Bouclier',
        torse:'Torse', tete:'Tête', bottes:'Bottes', gants:'Gants', anneau:'Anneau', amulette:'Amulette' };
    let equipHtml = '';
    if (cmp.equipement && typeof itemsData !== 'undefined') {
        for (const [slot, val] of Object.entries(cmp.equipement)) {
            if (!val) continue;
            const itemId = typeof val === 'string' ? val : val?.id;
            const def = itemId ? itemsData[itemId] : null;
            if (!def) continue;
            equipHtml += `<div style="display:flex;justify-content:space-between;font-size:0.82em;padding:2px 0;">
                <span style="color:#888;">${slotLabels[slot] || slot}</span>
                <span style="color:#d4af37;">${def.nom}</span>
            </div>`;
        }
    }

    const portraitSrc = cmp.portrait || '';
    const modal = document.createElement('div');
    modal.id = 'fiche-cmp-modal';
    modal.style.cssText = `position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.88);
        display:flex;align-items:center;justify-content:center;padding:16px;`;
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

    modal.innerHTML = `
    <div style="background:#141414;border:1px solid #444;border-radius:8px;width:100%;max-width:520px;
                max-height:90vh;overflow-y:auto;padding:20px;">
        <div style="display:flex;gap:16px;align-items:flex-start;margin-bottom:16px;">
            ${portraitSrc ? `<img src="${portraitSrc}" style="width:100px;height:100px;object-fit:cover;border-radius:6px;border:2px solid #d4af37;flex-shrink:0;" onerror="this.style.display='none'">` : ''}
            <div style="flex:1;">
                <div style="color:#d4af37;font-size:1.2em;font-weight:bold;">${cmp.nom}</div>
                <div style="color:#888;font-size:0.85em;margin-top:2px;">Niv. ${cmp.niveau || 1} · ${cmp.race || '?'} · ${cmp.sexe === 'F' ? 'Féminin' : 'Masculin'}</div>
                ${cmp.lieu ? `<div style="color:#666;font-size:0.78em;margin-top:2px;">📍 ${cmp.lieu}</div>` : ''}
                ${cmp.prndSlot === false ? `<div style="color:#9575cd;font-size:0.75em;margin-top:2px;">Hors-slot compagnon</div>` : ''}
                ${cmp.temporaire ? `<div style="color:#e57373;font-size:0.75em;margin-top:2px;">Compagnon temporaire</div>` : ''}
            </div>
            <button onclick="document.getElementById('fiche-cmp-modal').remove()"
                style="background:#3a1010;color:#ff6b6b;border:1px solid #8b0000;padding:4px 10px;border-radius:4px;cursor:pointer;flex-shrink:0;">✕</button>
        </div>

        <!-- PV / FT -->
        <div style="margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;font-size:0.82em;color:#aaa;margin-bottom:2px;"><span>❤ PV</span><span>${cmp.pvActuel ?? pvMax} / ${pvMax}</span></div>
            <div style="height:6px;background:#333;border-radius:3px;"><div style="height:100%;width:${pvPct}%;background:#e57373;border-radius:3px;"></div></div>
            <div style="display:flex;justify-content:space-between;font-size:0.82em;color:#aaa;margin:6px 0 2px;"><span>⚡ FT</span><span>${cmp.ftActuel ?? ftMax} / ${ftMax}</span></div>
            <div style="height:6px;background:#333;border-radius:3px;"><div style="height:100%;width:${ftPct}%;background:#64b5f6;border-radius:3px;"></div></div>
        </div>

        <!-- Stats -->
        <div style="margin-bottom:12px;">
            <div style="color:#666;font-size:0.72em;text-transform:uppercase;margin-bottom:4px;">Statistiques</div>
            ${statRow('Force (FO)', cmp.statsBase?.FO, cmp.statsInvesties?.FO)}
            ${statRow('Intelligence (IN)', cmp.statsBase?.IN, cmp.statsInvesties?.IN)}
            ${statRow('Constitution (CN)', cmp.statsBase?.CN, cmp.statsInvesties?.CN)}
            ${statRow('Dextérité (DX)', cmp.statsBase?.DX, cmp.statsInvesties?.DX)}
            ${statRow('Charisme (CH)', cmp.statsBase?.CH, cmp.statsInvesties?.CH)}
        </div>

        ${compsHtml ? `<div style="margin-bottom:12px;">
            <div style="color:#666;font-size:0.72em;text-transform:uppercase;margin-bottom:4px;">Compétences</div>
            ${compsHtml}
        </div>` : ''}

        ${magieHtml ? `<div style="margin-bottom:12px;">
            <div style="color:#666;font-size:0.72em;text-transform:uppercase;margin-bottom:4px;">Magie</div>
            ${magieHtml}
        </div>` : ''}

        ${techHtml ? `<div style="margin-bottom:12px;">
            <div style="color:#666;font-size:0.72em;text-transform:uppercase;margin-bottom:4px;">Technologie</div>
            ${techHtml}
        </div>` : ''}

        ${equipHtml ? `<div style="margin-bottom:12px;">
            <div style="color:#666;font-size:0.72em;text-transform:uppercase;margin-bottom:4px;">Équipement</div>
            ${equipHtml}
        </div>` : ''}

        ${cmp.notes ? `<div style="color:#666;font-size:0.78em;font-style:italic;border-top:1px solid #222;padding-top:8px;">${cmp.notes}</div>` : ''}
        ${cmp.contrainte ? `<div style="color:#555;font-size:0.75em;margin-top:4px;">⚠ ${cmp.contrainte}</div>` : ''}
    </div>`;

    document.body.appendChild(modal);
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
    const uid   = (window.perso?.nom || '').replace(/\s+/g, '_');

    // Lire le familier depuis Firebase puis afficher
    if (typeof db !== 'undefined' && sessionActuelle) {
        db.ref('parties/' + sessionActuelle + '/familiers/' + uid).once('value', function(snap) {
            _afficherEcranCompagnons_suite(container, comps, snap.val());
        });
    } else {
        _afficherEcranCompagnons_suite(container, comps, null);
    }
}

function _afficherEcranCompagnons_suite(container, comps, familier) {
    if (comps.length === 0 && !familier) {
        container.innerHTML = '<p style="color:#888; text-align:center; padding:40px;">Aucun compagnon pour l\'instant.</p>';
        return;
    }

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

        const portraitHtml = c.portrait
            ? `<img src="${c.portrait}" alt="${c.nom}" style="width:72px;height:72px;object-fit:cover;border-radius:4px;float:right;margin:0 0 6px 10px;">`
            : '';
        fragments.push(`
            <div class="compagnon-card">
                ${portraitHtml}
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
                <button onclick="ouvrirFicheCompagnon(window.perso.compagnons[${idx}])"
                    style="margin-top:8px;width:100%;background:#1a1a2e;color:#9575cd;border:1px solid #4a3a7a;
                           padding:5px;border-radius:4px;cursor:pointer;font-size:0.82em;">📋 Fiche complète</button>
            </div>
        `);
    });

    // Carte familier
    let familierHtml = '';
    if (familier && (familier.pvActuel === undefined || familier.pvActuel > 0)) {
        const fPV    = familier.pvActuel ?? familier.pv ?? 30;
        const fPVMax = familier.pvMax    ?? familier.pv ?? 30;
        const fFT    = familier.ftActuel ?? familier.ft ?? 20;
        const fFTMax = familier.ftMax    ?? familier.ft ?? 20;
        const fStats = familier.stats || {};
        const pvPctF = fPVMax > 0 ? Math.round((fPV / fPVMax) * 100) : 0;
        const ftPctF = fFTMax > 0 ? Math.round((fFT / fFTMax) * 100) : 0;
        const sortsF = (familier.sortsConnus || []).join(' · ') || '—';
        familierHtml = `
            <div class="compagnon-card" style="border-color:#7c4dff;background:#1a0f2a;">
                <div class="compagnon-header">
                    <span class="compagnon-nom">🐾 ${familier.nom || 'Familier'}</span>
                    <span class="compagnon-niveau" style="color:#ce93d8;">Familier · Niv. ${familier.niveau || 1}</span>
                </div>
                <div class="compagnon-identite" style="color:#9575cd;">${familier.race || 'familier'}</div>
                <div class="compagnon-bars">
                    <div class="compagnon-bar-label"><span>❤ PV</span><span>${fPV} / ${fPVMax}</span></div>
                    <div class="compagnon-bar-track"><div class="compagnon-bar-fill pv" style="width:${pvPctF}%"></div></div>
                    <div class="compagnon-bar-label"><span>⚡ FT</span><span>${fFT} / ${fFTMax}</span></div>
                    <div class="compagnon-bar-track"><div class="compagnon-bar-fill ft" style="width:${ftPctF}%"></div></div>
                </div>
                <div class="compagnon-stats-grid">
                    <div class="compagnon-stat"><span class="cs-label">FO</span><span class="cs-val">${fStats.FO||'?'}</span></div>
                    <div class="compagnon-stat"><span class="cs-label">IN</span><span class="cs-val">${fStats.IN||'?'}</span></div>
                    <div class="compagnon-stat"><span class="cs-label">CN</span><span class="cs-val">${fStats.CN||'?'}</span></div>
                    <div class="compagnon-stat"><span class="cs-label">DX</span><span class="cs-val">${fStats.DX||'?'}</span></div>
                    <div class="compagnon-stat"><span class="cs-label">CH</span><span class="cs-val">${fStats.CH||'?'}</span></div>
                </div>
                ${sortsF !== '—' ? `<div class="compagnon-spells">✨ ${sortsF}</div>` : ''}
            </div>`;
    } else if (familier && familier.pvActuel <= 0) {
        familierHtml = `<div class="compagnon-card" style="border-color:#444;opacity:0.5;">
            <div class="compagnon-header"><span class="compagnon-nom">🐾 ${familier.nom || 'Familier'}</span><span style="color:#f44336;">💀 Mort</span></div>
            <p style="color:#666;font-size:0.85em;margin:4px 0;">Votre familier est mort. Relancez Invocation d'un familier pour en invoquer un nouveau (Niv. 1).</p>
        </div>`;
    }

    const statCHVal = (window.perso?.statsBase?.CH || 0) + (window.perso?.statsInvesties?.CH || 0);
    const maxCompsVal = Math.max(1, Math.floor(statCHVal / 4));
    const enTete = `<div class="compagnons-max-info">Compagnons : ${comps.length} / ${maxCompsVal} (CH ${statCHVal})</div>`;
    container.innerHTML = enTete + fragments.join('') + familierHtml;
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
    // Normalise : string → objet {id} pour compatibilité compagnonsData
    const eq = {};
    for (const [s, v] of Object.entries(c.equipement)) {
        if (!v) continue;
        eq[s] = typeof v === 'string' ? { id: v } : v;
    }

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
    const val = c.equipement[slot];
    c.inventaire.push(typeof val === 'string' ? { id: val, quantite: 1 } : val);
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
            <div style="margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid #333;">
                <h3 style="color:#9c7fd4;margin:0 0 8px;font-size:0.95em;">🗺 Donjon</h3>
                <ul style="margin:0;padding-left:18px;color:#aaa;font-size:0.88em;line-height:1.8;">
                    <li>Étages multiples (escaliers, transition entre niveaux)</li>
                </ul>
            </div>
            <div style="margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid #333;">
                <h3 style="color:#ef9a9a;margin:0 0 8px;font-size:0.95em;">⚔ Combat</h3>
                <ul style="margin:0;padding-left:18px;color:#aaa;font-size:0.88em;line-height:1.8;">
                    <li>Sorts de Cat. 6+ (offensive/défensive avancée)</li>
                    <li>IA ennemie variée (fuyards, soigneurs, ciblage prioritaire)</li>
                </ul>
            </div>
            <div style="margin-bottom:0;">
                <h3 style="color:#ffd700;margin:0 0 8px;font-size:0.95em;">🛒 Économie</h3>
                <ul style="margin:0;padding-left:18px;color:#aaa;font-size:0.88em;line-height:1.8;">
                    <li>Artisanat / réparation via PNJ ou matériaux lootés</li>
                    <li>Bourse dynamique (prix variables selon offre/demande)</li>
                </ul>
            </div>`;
        modal.style.display = 'flex';
        return;
    }

    contenu.innerHTML = `
        <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #333;">
            <h3 style="color:#d4af37;margin:0 0 6px;font-size:1em;">v1.2 — Mai 2026</h3>
            <p style="color:#aaa;font-size:0.82em;margin:0 0 8px;font-style:italic;">Étages multiples dans le donjon</p>
            <ul style="margin:0;padding-left:18px;color:#ccc;font-size:0.92em;">
                <li><strong style="color:#9090ff;">🪜 Étages multiples</strong> — l'éditeur MJ supporte plusieurs étages (onglets Étage 1 / 2 / … + bouton ➕) ; cellule E = escalier ; quand un joueur marche dessus, tous passent à l'étage suivant ; le MJ peut aussi forcer la transition via "⬆ Étage suivant" ; indicateur Étage N/M affiché dans le statut</li>
            </ul>
        </div>
        <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #333;">
            <h3 style="color:#d4af37;margin:0 0 6px;font-size:1em;">v1.1 — Mai 2026</h3>
            <p style="color:#aaa;font-size:0.82em;margin:0 0 8px;font-style:italic;">Donjon enrichi, effets de statut, chat, mobile, stats persistantes</p>
            <ul style="margin:0;padding-left:18px;color:#ccc;font-size:0.92em;">
                <li><strong style="color:#9c7fd4;">📝 Notes MJ</strong> — onglet Notes dans l'interface MJ, auto-sauvegardé en Firebase</li>
                <li><strong style="color:#ff9800;">⌨️ Raccourcis clavier combat</strong> — A = attaque, P/Échap = passer, 1–9 = nth action</li>
                <li><strong style="color:#ef5350;">🔥 Effets de statut</strong> — Brûlure, Électrocution, Saignement : badges visuels, dégâts par tour, contamination au combat</li>
                <li><strong style="color:#90caf9;">📜 Historique de combat</strong> — log archivé en Firebase après chaque combat ; accessible depuis le résultat ou le Codex MJ</li>
                <li><strong style="color:#b39ddb;">💬 Chat en jeu</strong> — panneau flottant, 40 messages chargés à l'ouverture, badge de nouveaux messages, toast de notification</li>
                <li><strong style="color:#80cbc4;">🗺 Mini-carte mémorisée</strong> — les cases visitées restent visibles en brouillard (grisé) après passage, persistées par joueur en Firebase</li>
                <li><strong style="color:#d4af37;">🔐 Portes secrètes</strong> — case H dans l'éditeur MJ ; invisibles jusqu'à détection passive (compétence) ou fouille active (bouton) ; franchissables une fois détectées</li>
                <li><strong style="color:#4caf50;">🧙 PNJ errants & Autels</strong> — cases N et A dans l'éditeur ; PNJ affiche un dialogue ; Autel donne un buff temporaire (+10% PV ou FT max) valable uniquement pendant le donjon, retiré à la fin</li>
                <li><strong style="color:#80cbc4;">📱 Support mobile</strong> — écran donjon plein écran fixe, grille adaptée à la largeur, boutons tactiles 50 px, chat full-width, modaux responsive</li>
                <li><strong style="color:#a5d6a7;">📊 Statistiques persistantes</strong> — stats cumulatives sauvegardées en Firebase (profils/{joueur}/stats) ; survivent aux changements d'appareil ; delta session affiché en vert dans le journal</li>
            </ul>
        </div>
        <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #333;">
            <h3 style="color:#d4af37;margin:0 0 6px;font-size:1em;">v1.0 — Mai 2026</h3>
            <p style="color:#aaa;font-size:0.82em;margin:0 0 8px;font-style:italic;">Bestiaire, Codex MJ Ennemis, Combat de Rêve, Succès dé & critiques</p>
            <ul style="margin:0;padding-left:18px;color:#ccc;font-size:0.92em;">
                <li><strong style="color:#ef9a9a;">🐾 Bestiaire</strong> — monstre vu-non-tué : nom + portrait désormais visibles (plus de ????)</li>
                <li><strong style="color:#4fc3f7;">📖 Codex MJ — Ennemis</strong> — grille multi-colonnes ; filtre Espèce / Zone dans onglets Codex ET Combat</li>
                <li><strong style="color:#80cbc4;">💤 Combat de Rêve</strong> — onglet Rêve dans le journal joueur ; affronte un ennemi déjà rencontré sans XP, loot, ni comptage</li>
                <li><strong style="color:#ffd700;">🏆 Succès</strong> — 12 nouveaux : coups critiques ×3, échecs critiques ×3, dé accueil (1 / 5×1 / 10 / 5×10 / deux 1 suite / deux 10 suite)</li>
                <li><strong style="color:#a5d6a7;">🗂 Codex MJ — Marchands / Coffres / Lieux / Musique</strong> — affichage en grille multi-colonnes ; boutons ALL Lieux / RAZ Lieux déplacés dans l'onglet Lieux uniquement</li>
                <li><strong style="color:#ce93d8;">🛒 Marchands — stock partagé & limité</strong> — inventaire et argent stockés dans Firebase ; partagés entre tous les joueurs ; chaque achat/vente décrémente le stock commun</li>
                <li><strong style="color:#80cbc4;">👁 Codex MJ — Coffres & Marchands</strong> — bouton Voir : aperçu du contenu (stock actuel vs inventaire complet pour marchands) ; bouton Envoyer : envoie le coffre/marchand à un joueur au choix ; bouton ♻️ : réinitialise le stock et l'argent</li>
                <li><strong style="color:#ffb74d;">🔓 Bestiaire MJ — déverrouillage progressif</strong> — 3 paliers (×1 / ×3 / ×5 kills) pour révéler nom→équipement→magie/résistances ; badge ⚔ N/next sur les cartes ; ennemis uniques débloquables manuellement</li>
            </ul>
        </div>
        <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #333;">
            <h3 style="color:#d4af37;margin:0 0 6px;font-size:1em;">v0.10 — Avril 2026</h3>
            <ul style="margin:0;padding-left:18px;color:#aaa;font-size:0.88em;">
                <li>31 Compagnons</li>
                <li>Portraits (frise, cartes compagnon, onglet Groupe)</li>
                <li>Fiche complète joueur & MJ</li>
                <li>Modal don MJ</li>
                <li>Level-up prérequis</li>
                <li>RAZ compagnon (MJ)</li>
                <li>Mémoire de progression</li>
            </ul>
        </div>
        <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #333;">
            <h3 style="color:#d4af37;margin:0 0 6px;font-size:1em;">v0.9 — Avril 2026</h3>
            <ul style="margin:0;padding-left:18px;color:#aaa;font-size:0.88em;">
                <li>57 Succès en 13 catégories</li>
                <li>45 Succès de Maîtrise (level-up)</li>
                <li>Déblocage / révocation succès MJ</li>
                <li>Refonte Codex objets (explosifs, munitions, bijoux)</li>
            </ul>
        </div>
        <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #333;">
            <h3 style="color:#d4af37;margin:0 0 6px;font-size:1em;">v0.8 — Avril 2026</h3>
            <ul style="margin:0;padding-left:18px;color:#aaa;font-size:0.88em;">
                <li>Sorts offensifs de combat (Cat. 1→4)</li>
                <li>Sorts de contrôle / CC</li>
                <li>Buffs de groupe</li>
                <li>Buffs individuels</li>
                <li>Sorts d'initiative avancée</li>
                <li>Détection pièges de base</li>
            </ul>
        </div>
        <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #333;">
            <h3 style="color:#d4af37;margin:0 0 6px;font-size:1em;">v0.7 — Avril 2026</h3>
            <ul style="margin:0;padding-left:18px;color:#aaa;font-size:0.88em;">
                <li>Journal 4 onglets (Quêtes / Bénédictions / Antécédent / Stats)</li>
                <li>Donjon amélioré (clavier, coffres persistants, tour requis)</li>
                <li>Poison amélioré (bypass armure, surplus FT)</li>
                <li>Level-up : soin complet PV + FT</li>
                <li>Don d'or MJ</li>
            </ul>
        </div>
        <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #333;">
            <h3 style="color:#d4af37;margin:0 0 6px;font-size:1em;">v0.6 — Avril 2026</h3>
            <ul style="margin:0;padding-left:18px;color:#aaa;font-size:0.88em;">
                <li>Système de Donjon</li>
                <li>Système de Quêtes</li>
                <li>Bénédictions & Malédictions</li>
                <li>Armes & sorts rapides</li>
                <li>Magie temporaire</li>
                <li>Vol à la tire</li>
            </ul>
        </div>
        <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #333;">
            <h3 style="color:#d4af37;margin:0 0 6px;font-size:1em;">v0.5 — Avril 2026</h3>
            <ul style="margin:0;padding-left:18px;color:#aaa;font-size:0.88em;">
                <li>Poison amélioré</li>
                <li>Mort en combat & résurrection</li>
                <li>Corrections multijoueur</li>
            </ul>
        </div>
        <div style="margin-bottom:20px;">
            <h3 style="color:#d4af37;margin:0 0 6px;font-size:1em;">v0.4 — Mars 2026</h3>
            <ul style="margin:0;padding-left:18px;color:#aaa;font-size:0.88em;">
                <li>Système Compagnons</li>
                <li>Combat phase 2</li>
            </ul>
        </div>`;

    modal.style.display = 'flex';
}

/** Rétro-compatibilité : anciens appels vers ouvrirJournalQuetes() */
function ouvrirJournalQuetes() { ouvrirJournal('quetes'); }

/**
 * Ouvre le journal à l'onglet demandé.
 * @param {'quetes'|'effets'|'stats'|'succes'|'ennemis_uniques'|'reve'} onglet
 */
function ouvrirJournal(onglet) {
    const modal   = document.getElementById('modal-journal');
    const contenu = document.getElementById('journal-contenu');
    if (!modal || !contenu) return;

    // Surligner l'onglet actif
    ['quetes', 'effets', 'stats', 'succes', 'ennemis_uniques'].forEach(id => {
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

    } else if (onglet === 'stats') {
        const p   = window.perso;
        const sp  = p?.stats_partie || {};
        const deb = window._statsDebutSession || {};
        const d = (cle) => {
            const v = (sp[cle] || 0) - (deb[cle] || 0);
            return v > 0 ? `<span style="color:#3a5a3a;font-size:0.78em;font-weight:normal;"> +${v}</span>` : '';
        };
        const ligne = (icone, label, cle, couleur) =>
            `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;border-bottom:1px solid #1a1a2a;">
                <span style="color:#888;font-size:0.9em;">${icone} ${label}</span>
                <span style="color:${couleur || '#d4af37'};font-weight:bold;">${sp[cle] || 0}${d(cle)}</span>
            </div>`;
        const bestSort = (()=>{ const sn = sp.sorts_par_nom || {}; const best = Object.entries(sn).sort((a,b)=>b[1]-a[1])[0]; return best ? best[0] + ' ×' + best[1] : '—'; })();
        contenu.innerHTML = `
            <div style="color:#3a3a3a;font-size:0.73em;text-align:right;margin-bottom:5px;padding-right:2px;">Cumul total &nbsp;<span style="color:#3a5a3a;">+session en cours</span></div>
            <div style="border:1px solid #2a1a4a;border-radius:8px;overflow:hidden;background:#0a0a14;font-size:0.88em;">
                <div style="padding:6px 10px;background:#0d0d1a;color:#555;font-size:0.75em;text-transform:uppercase;letter-spacing:0.08em;">Parcours</div>
                ${ligne('🗓', 'Sessions jouées',        'sessions_jouees',     '#9c7fd4')}
                ${ligne('⚔️', 'Combats gagnés',          'combats_gagnes',      '#ff6b6b')}
                ${ligne('🗺', 'Donjons terminés',        'donjons_termines',    '#80cbc4')}
                ${ligne('🏙', 'Villes découvertes',      'villes_decouvertes',  '#80cbc4')}
                ${ligne('🐾', 'Compagnons débloqués',    'compagnons_debloques','#ffd700')}
                <div style="padding:6px 10px;background:#0d0d1a;color:#555;font-size:0.75em;text-transform:uppercase;letter-spacing:0.08em;">Combat</div>
                ${ligne('⚔️', 'Ennemis vaincus',         'ennemis_tues',        '#ff8a80')}
                ${ligne('🗡️', 'Attaques portées',        'attaques',            '#ff9800')}
                ${ligne('💥', 'Coups critiques',         'coups_critiques',     '#ef5350')}
                ${ligne('🩸', 'Dégâts infligés',         'degats_ennemis',      '#ef5350')}
                ${ligne('🔮', 'Sorts lancés',            'sorts_lances',        '#ce93d8')}
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;border-bottom:1px solid #1a1a2a;">
                    <span style="color:#888;font-size:0.9em;">🏆 Sort favori</span>
                    <span style="color:#ce93d8;font-weight:bold;font-size:0.85em;">${bestSort}</span>
                </div>
                <div style="padding:6px 10px;background:#0d0d1a;color:#555;font-size:0.75em;text-transform:uppercase;letter-spacing:0.08em;">Vie & Économie</div>
                ${ligne('❤️', 'PV perdus',               'pv_perdus',           '#e57373')}
                ${ligne('💀', 'Fois mort(e)',             'morts',               '#888')}
                ${ligne('🩹', 'Soins à soi-même',        'soins_soi',           '#4caf50')}
                ${ligne('💙', 'Soins donnés',            'soins_donnes',        '#42a5f5')}
                ${ligne('💰', 'Or accumulé',             'or_cumule',           '#ffd700')}
                ${ligne('🚶', 'Cases parcourues',        'cases_parcourues',    '#80cbc4')}
            </div>`;

    } else if (onglet === 'succes') {
        contenu.innerHTML = '';
        const mesSucces = window.perso?.succes || {};
        if (typeof succesData === 'undefined' || succesData.length === 0) {
            contenu.innerHTML = `<p style="color:#555;text-align:center;padding:20px;">Aucun succès disponible.</p>`;
        } else {
            const cats = [...new Set(succesData.map(s => s.categorie))];
            const debloquesCount = succesData.filter(s => mesSucces[s.id]).length;

            // Compteur global
            const counter = document.createElement('div');
            counter.style.cssText = 'text-align:center;margin-bottom:12px;color:#d4af37;font-size:0.85em;';
            counter.textContent = `${debloquesCount} / ${succesData.length} succès débloqués`;
            contenu.appendChild(counter);

            // Grille de pills de catégories
            const catGrid = document.createElement('div');
            catGrid.style.cssText = 'display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px;';

            // Panneau de détail (mis à jour au clic)
            const panel = document.createElement('div');
            let activeCat = null;

            const renderCat = (cat) => {
                if (activeCat === cat) {
                    panel.innerHTML = '';
                    activeCat = null;
                    catGrid.querySelectorAll('button').forEach(b => {
                        b.style.background = '#0d0d18';
                        b.style.borderColor = '#1a1a2a';
                        b.style.color = '#888';
                    });
                    return;
                }
                activeCat = cat;
                catGrid.querySelectorAll('button').forEach(b => {
                    const sel = b.dataset.cat === cat;
                    b.style.background = sel ? 'rgba(212,175,55,0.12)' : '#0d0d18';
                    b.style.borderColor = sel ? '#d4af37' : '#1a1a2a';
                    b.style.color = sel ? '#d4af37' : '#888';
                });
                panel.innerHTML = '';
                succesData.filter(s => s.categorie === cat).forEach(s => {
                    const data = mesSucces[s.id];
                    const card = document.createElement('div');
                    if (data) {
                        const dateStr = data.date ? new Date(data.date).toLocaleDateString('fr-FR') : '—';
                        card.style.cssText = 'display:flex;align-items:flex-start;gap:10px;padding:9px 10px;margin-top:4px;border:1px solid #4a3a00;border-radius:7px;background:rgba(212,175,55,0.08);';
                        card.innerHTML = `<span style="font-size:1.3em;flex-shrink:0;">${s.icone}</span>
                            <div>
                                <div style="color:#d4af37;font-weight:bold;font-size:0.88em;">${s.nom}</div>
                                <div style="color:#aaa;font-size:0.78em;margin-top:2px;">${s.desc}</div>
                                <div style="color:#666;font-size:0.72em;margin-top:3px;">🗓 ${dateStr}</div>
                            </div>`;
                    } else {
                        card.style.cssText = 'display:flex;align-items:center;gap:10px;padding:9px 10px;margin-top:4px;border:1px solid #1a1a1a;border-radius:7px;background:#0a0a0a;opacity:0.55;';
                        card.innerHTML = `<span style="font-size:1.3em;flex-shrink:0;filter:grayscale(1);">🔒</span>
                            <div style="color:#555;font-size:0.88em;">${s.nom}</div>`;
                    }
                    panel.appendChild(card);
                });
            };

            cats.forEach(cat => {
                const items = succesData.filter(s => s.categorie === cat);
                const catDeb = items.filter(s => mesSucces[s.id]).length;
                const btn = document.createElement('button');
                btn.dataset.cat = cat;
                btn.style.cssText = 'padding:4px 10px;border:1px solid #1a1a2a;border-radius:20px;background:#0d0d18;color:#888;font-size:0.78em;font-variant:small-caps;letter-spacing:0.5px;cursor:pointer;white-space:nowrap;';
                btn.innerHTML = `${cat} <span style="opacity:0.5;font-size:0.85em;">${catDeb}/${items.length}</span>`;
                btn.addEventListener('click', () => renderCat(cat));
                catGrid.appendChild(btn);
            });

            contenu.appendChild(catGrid);
            contenu.appendChild(panel);
        }

    } else if (onglet === 'ennemis_uniques') {
        contenu.innerHTML = `<p style="color:#555;text-align:center;padding:20px;">Chargement...</p>`;
        Promise.all([
            db.ref('parties/' + sessionActuelle + '/bestiaire').once('value'),
            db.ref('parties/' + sessionActuelle + '/ennemis_uniques').once('value')
        ]).then(([bestSnap, uniqSnap]) => {
            const bestiaireData = bestSnap.val() || {};
            const uniquesBattus = uniqSnap.val() || {};
            if (typeof ennemisData === 'undefined') {
                contenu.innerHTML = '<p style="color:#555;text-align:center;padding:20px;">Données indisponibles.</p>';
                return;
            }
            const RACE_TO_CAT = {
                'Bête':'Bêtes','Lycanthrope':'Bêtes',
                'Mort-vivant':'Morts-vivants','Esprit':'Esprits','Démon':'Démons',
                'Élémentaire':'Élémentaires',
                'Araignée':'Araignées','Dragon':'Dragons','Golem':'Golems',
                'Construct':'Constructs','Pestilentiel':'Pestilentiels','Animal':'Animaux',
                'Insectoïde':'Insectoïdes','Singe':'Singes',
                'Plante':'Plantes','Artificiel':'Créatures Artificielles','Fée':'Fées',
                'Troll':'Trolls','Humanoïde':'Humanoïdes',
                'Araya':'Arayas','Kite':'Kites','Krag':'Krags','Reptilien':'Reptiliens',
                'Humain':'Humains','Nain':'Nains',
                'Elfe':'Elfes','Elfe Noir':'Elfes',
                'Ork':'Orques','Orque':'Orques','Demi-Orc':'Orques',
                'Demi-Ogre':'Demi-Ogres','Gnome':'Gnomes','Halfelin':'Halfelins'
            };
            const CAT_ORDER = ['Bêtes','Singes','Morts-vivants','Esprits','Démons','Élémentaires','Insectoïdes','Araignées','Arayas','Dragons','Golems','Constructs','Pestilentiels','Animaux','Plantes','Créatures Artificielles','Fées','Trolls','Humanoïdes','Kites','Krags','Reptiliens','Humains','Nains','Elfes','Orques','Demi-Ogres','Gnomes','Halfelins','Assassins de la Main','Autres'];
            const CAT_ICONS = {
                'Bêtes':'🐺','Singes':'🐒','Morts-vivants':'💀','Esprits':'👻','Démons':'😈',
                'Élémentaires':'⚡','Insectoïdes':'🕷','Araignées':'🕸','Dragons':'🐉',
                'Arayas':'🪼','Golems':'🗿','Constructs':'⚙','Pestilentiels':'🦠','Animaux':'🐄',
                'Plantes':'🌿','Créatures Artificielles':'🤖','Fées':'🧚','Trolls':'🪨',
                'Humanoïdes':'🧟','Kites':'🏹','Krags':'⛏','Reptiliens':'🦎',
                'Humains':'🧑','Nains':'⚒','Elfes':'🧝','Orques':'💢',
                'Demi-Ogres':'👊','Gnomes':'🔧','Halfelins':'🗡',
                'Assassins de la Main':'🔪','Autres':'❓'
            };
            const getCat = (id, def) => {
                if (id.startsWith('main_assassin_')) return 'Assassins de la Main';
                const race = def.race || '';
                if (race === 'Araignée') return 'Araignées';
                if (race === 'Dragon') return 'Dragons';
                if (race === 'Golem') return 'Golems';
                if (race === 'Construct') return 'Constructs';
                if (race === 'Pestilentiel') return 'Pestilentiels';
                if (race === 'Animal') return 'Animaux';
                if (race === 'Insectoïde') return 'Insectoïdes';
                return RACE_TO_CAT[race] || 'Autres';
            };

            const renderCard = (id, def) => {
                const entry = bestiaireData[id] || {};
                const k = entry.nbKills || 0;
                const isVu = !!entry.premierVu;
                const imgSrc = def.portrait ? `docs/img/portraits/${def.portrait}` : '';
                const imgSrcF = def.biGenre && def.portrait ? `docs/img/portraits/${def.portrait.replace('.png','f.png')}` : '';
                const imgBlur = (k === 0 && !isVu) ? 'filter:blur(5px);opacity:0.35;' : '';
                const nomAff = k >= 1 ? def.nom : (isVu ? def.nom : '???');
                const nomColor = k >= 1 ? '#e57373' : (isVu ? '#8a4a4a' : '#555');
                let badge = k > 0
                    ? `<span style="background:#0d1f0d;color:#4caf50;border:1px solid #2e7d32;border-radius:3px;padding:1px 5px;font-size:0.7em;margin-left:4px;">☠ ×${k}</span>`
                    : (isVu ? `<span style="background:#1a1a2a;color:#7c4a8a;border:1px solid #4a2a5a;border-radius:3px;padding:1px 5px;font-size:0.7em;margin-left:4px;">Vu</span>` : '');
                let details = '';
                if (k >= 1) {
                    const zonesStr = (def.zones || []).join(', ') || '—';
                    details += `<div style="font-size:0.77em;color:#999;margin-top:3px;">Niv.${def.niveau} · ${def.race}</div>`;
                    details += `<div style="font-size:0.74em;color:#80cbc4;margin-top:2px;">📍 ${zonesStr}</div>`;
                }
                if (k >= 3) {
                    const st = def.statsBase || {};
                    details += `<div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:5px;font-size:0.76em;">${['FO','CN','DX','IN','CH'].map(x=>`<span style="color:#aaa;">${x}:<b style="color:#fff;">${st[x]||0}</b></span>`).join('')}</div>`;
                    const equip = Object.entries(def.equipement||{}).filter(([,v])=>v).map(([,v])=>{const it=typeof itemsData!=='undefined'?itemsData[v.id]:null;return it?it.nom:v.id;});
                    if (equip.length) details += `<div style="font-size:0.73em;color:#ce93d8;margin-top:3px;">⚔ ${equip.join(', ')}</div>`;
                    const loot = (def.lootDrop||[]).map(l=>{const it=typeof itemsData!=='undefined'?itemsData[l.id]:null;const pct=l.proba<1?` (${Math.round(l.proba*100)}%)`:'';return `${it?it.nom:l.id} ×${l.qte}${pct}`;});
                    details += loot.length
                        ? `<div style="font-size:0.73em;color:#ffd54f;margin-top:3px;">💰 ${loot.join(', ')}</div>`
                        : `<div style="font-size:0.73em;color:#555;margin-top:3px;">💰 Aucun loot</div>`;
                }
                if (k >= 5) {
                    const magie = Object.entries(def.magieBase||{});
                    if (magie.length) details += `<div style="font-size:0.73em;color:#ce93d8;margin-top:3px;">🔮 ${magie.map(([e,n])=>`${e} niv.${n}`).join(', ')}</div>`;
                    const res = def.resistances||{};
                    if (Object.keys(res).length) {
                        const RC={resPhys:'#78909c',resMagie:'#9c27b0',resFeu:'#f44336',resPoison:'#4caf50',resElec:'#ffc107'};
                        const RL={resPhys:'Phy',resMagie:'Mag',resFeu:'Feu',resPoison:'Poi',resElec:'Élec'};
                        details += `<div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:4px;font-size:0.73em;">${Object.entries(res).map(([rk,rv])=>`<span style="color:${RC[rk]||'#aaa'}">${RL[rk]||rk}:<b>${rv}%</b></span>`).join('')}</div>`;
                    }
                }
                const uBadge = def.unique ? `<span style="color:#9c27b0;font-size:0.7em;margin-left:3px;">★</span>` : '';
                const pid = 'bpic_'+id;
                const portraitsHtml = imgSrcF && k >= 1
                    ? `<div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;gap:2px;">
                        <img id="${pid}" src="${imgSrc}" data-state="m" onerror="this.style.display='none'" style="width:42px;height:42px;object-fit:contain;border-radius:3px;background:#111;border:1px solid #2a2a2a;${imgBlur}">
                        <div style="display:flex;align-items:center;gap:2px;">
                            <button onclick="(function(){var i=document.getElementById('${pid}');if(i.dataset.state==='f'){i.src='${imgSrc}';i.dataset.state='m';}else{i.src='${imgSrcF}';i.dataset.state='f';}})()" style="background:none;border:none;color:#666;cursor:pointer;padding:0;font-size:0.7em;line-height:1;">◀</button>
                            <span style="color:#444;font-size:0.6em;">♂♀</span>
                            <button onclick="(function(){var i=document.getElementById('${pid}');if(i.dataset.state==='m'){i.src='${imgSrcF}';i.dataset.state='f';}else{i.src='${imgSrc}';i.dataset.state='m';}})()" style="background:none;border:none;color:#666;cursor:pointer;padding:0;font-size:0.7em;line-height:1;">▶</button>
                        </div>
                       </div>`
                    : (imgSrc ? `<img src="${imgSrc}" onerror="this.style.display='none'" style="width:42px;height:42px;object-fit:contain;border-radius:3px;background:#111;border:1px solid #2a2a2a;${imgBlur}flex-shrink:0;">` : '<div style="width:42px;height:42px;flex-shrink:0;"></div>');
                return `<div style="display:flex;gap:8px;align-items:flex-start;padding:8px;border:1px solid #1e1e1e;border-radius:5px;margin-bottom:5px;background:#090909;">
                    ${portraitsHtml}
                    <div style="flex:1;min-width:0;">
                        <div style="display:flex;align-items:center;flex-wrap:wrap;"><span style="color:${nomColor};font-size:0.87em;font-weight:bold;">${nomAff}${uBadge}</span>${badge}</div>
                        ${details}
                        ${k===0&&!isVu?'<div style="font-size:0.72em;color:#3a3a3a;margin-top:3px;font-style:italic;">Non découvert</div>':''}
                    </div>
                </div>`;
            };

            // Cache données pour re-filtrage
            window._bcatBestData = bestiaireData;
            window._bcatUniqData = uniquesBattus;
            window._bestFilter = window._bestFilter || 'tous';

            const _passeFiltre = (id) => {
                const f = window._bestFilter;
                if (f === 'tous') return true;
                const entry = bestiaireData[id] || {};
                const k = entry.nbKills || 0;
                const vu = !!entry.premierVu || k > 0;
                const battu = !!uniquesBattus[id];
                const def = ennemisData[id];
                if (def?.unique) {
                    if (f === 'rencontre') return (vu || battu) && !battu;
                    if (f === 'decouvert') return battu;
                } else {
                    if (f === 'rencontre') return vu && k < 5;
                    if (f === 'decouvert') return k >= 5;
                }
                return true;
            };

            const _renderUniqCard = (id, def) => {
                const k = bestiaireData[id]?.nbKills||0;
                const battu = uniquesBattus[id];
                const debloque = battu || k >= 1;
                const isVu = !!bestiaireData[id]?.premierVu || k > 0;
                const nomAff = debloque ? def.nom : (isVu ? '????' : '???');
                const imgSrc = def.portrait ? `docs/img/portraits/${def.portrait}` : '';
                const imgBlur = !debloque ? 'filter:blur(5px);opacity:0.3;' : '';
                const statusEl = battu
                    ? `<span style="color:#4caf50;font-size:0.76em;">✅ Terrassé le ${new Date(battu.date).toLocaleDateString('fr-FR')}</span>`
                    : (debloque
                        ? `<span style="color:#4caf50;font-size:0.76em;">✅ Vaincu</span>`
                        : (isVu
                            ? `<span style="color:#f57c00;font-size:0.76em;">⚠ Rencontré — non terrassé</span>`
                            : `<span style="color:#555;font-size:0.76em;font-style:italic;">☆ Non rencontré</span>`));
                let uniqDetails = '';
                if (debloque) {
                    uniqDetails += `<div style="font-size:0.74em;color:#aaa;margin-top:2px;">Niv.${def.niveau} · ${def.race}</div>`;
                    const st = def.statsBase || {};
                    uniqDetails += `<div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:4px;font-size:0.76em;">${['FO','CN','DX','IN','CH'].map(x=>`<span style="color:#aaa;">${x}:<b style="color:#fff;">${st[x]||0}</b></span>`).join('')}</div>`;
                    const res = def.resistances || {};
                    if (Object.keys(res).length) {
                        const RC={resPhys:'#78909c',resMagie:'#9c27b0',resFeu:'#f44336',resPoison:'#4caf50',resElec:'#ffc107'};
                        const RL={resPhys:'Phy',resMagie:'Mag',resFeu:'Feu',resPoison:'Poi',resElec:'Élec'};
                        uniqDetails += `<div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:4px;font-size:0.73em;">${Object.entries(res).map(([rk,rv])=>`<span style="color:${RC[rk]||'#aaa'}">${RL[rk]||rk}:<b>${rv}%</b></span>`).join('')}</div>`;
                    }
                    const magie = Object.entries(def.magieBase||{});
                    if (magie.length) uniqDetails += `<div style="font-size:0.73em;color:#ce93d8;margin-top:3px;">🔮 ${magie.map(([e,n])=>`${e} niv.${n}`).join(', ')}</div>`;
                    const loot = (def.lootDrop||[]).map(l=>{const it=typeof itemsData!=='undefined'?itemsData[l.id]:null;const pct=l.proba<1?` (${Math.round(l.proba*100)}%)`:'';return `${it?it.nom:l.id} ×${l.qte}${pct}`;});
                    if (loot.length) uniqDetails += `<div style="font-size:0.73em;color:#ffd54f;margin-top:3px;">💰 ${loot.join(', ')}</div>`;
                }
                return `<div style="display:flex;gap:8px;align-items:flex-start;padding:9px 10px;border:1px solid #3a1a5a;border-radius:5px;margin-bottom:6px;background:rgba(156,39,176,0.05);">
                    ${imgSrc?`<img src="${imgSrc}" onerror="this.style.display='none'" style="width:42px;height:42px;object-fit:contain;border-radius:3px;background:#111;border:1px solid #4a2a5a;${imgBlur}flex-shrink:0;">`:''}
                    <div style="flex:1;"><div style="color:#ce93d8;font-weight:bold;font-size:0.9em;">${nomAff}</div><div style="margin-top:3px;">${statusEl}</div>${uniqDetails}</div>
                </div>`;
            };

            window._recomputeBestContents = () => {
                window._bcatContents = {};
                sortedCats.forEach(cat => {
                    const cid = 'bcat_' + cat.replace(/[^a-z0-9]/gi, '_');
                    window._bcatContents[cid] = categories[cat]
                        .filter(([id]) => _passeFiltre(id))
                        .map(([id, def]) => renderCard(id, def)).join('');
                });
                // Mettre à jour les compteurs et la visibilité des boutons catégorie
                sortedCats.forEach(cat => {
                    const cid = 'bcat_' + cat.replace(/[^a-z0-9]/gi, '_');
                    const btn = document.getElementById('btn_' + cid);
                    if (!btn) return;
                    const nb = categories[cat].filter(([id]) => _passeFiltre(id)).length;
                    const spans = btn.querySelectorAll('span');
                    if (spans[2]) spans[2].textContent = nb + '/' + categories[cat].length;
                    btn.style.display = nb > 0 ? 'inline-flex' : 'none';
                    // Fermer la zone si la catégorie active n'a plus de résultats
                    if (nb === 0 && window._bcatActif === cid) {
                        const zone = document.getElementById('bcat-zone');
                        if (zone) zone.style.display = 'none';
                        window._bcatActif = null;
                        btn.style.background = '#111';
                        btn.style.borderColor = '#2a2a2a';
                        btn.style.color = '#ccc';
                    }
                });
                // Re-filtrer la section Ennemis Uniques
                const uniqDiv = document.getElementById('bcat_uniques');
                if (uniqDiv) {
                    const filteredUniq = uniqueEntries.filter(([id]) => _passeFiltre(id));
                    uniqDiv.innerHTML = filteredUniq.map(([id, def]) => _renderUniqCard(id, def)).join('')
                        || '<p style="color:#555;text-align:center;padding:12px;">Aucun ennemi dans ce filtre.</p>';
                    const uniqBtn = uniqDiv.parentElement?.querySelector('button');
                    if (uniqBtn) {
                        const spans = uniqBtn.querySelectorAll('span');
                        const discBadge = window._bestFilter === 'tous'
                            ? uniqueEntries.filter(([id]) => (bestiaireData[id]?.nbKills||0)>0||uniquesBattus[id]||bestiaireData[id]?.premierVu).length
                            : filteredUniq.length;
                        if (spans[2]) { spans[2].textContent = discBadge + '/' + uniqueEntries.length + ' ▾'; spans[2].style.color = discBadge > 0 ? '#4caf50' : '#555'; }
                        uniqBtn.style.display = filteredUniq.length > 0 ? 'inline-flex' : 'none';
                    }
                }
                // Rafraîchir la zone ouverte si besoin
                if (window._bcatActif) {
                    const zone = document.getElementById('bcat-zone');
                    if (zone && zone.style.display !== 'none') {
                        zone.innerHTML = window._bcatContents[window._bcatActif] || '<p style="color:#555;text-align:center;padding:12px;">Aucun ennemi dans ce filtre.</p>';
                    }
                }
            };

            let html = '';

            // ── Filtres ───────────────────────────────────────────────────
            const _mkFBtn = (val, label) => {
                const active = window._bestFilter === val;
                return `<button onclick="window._bestFilter='${val}';window._recomputeBestContents();document.querySelectorAll('.best-filter-btn').forEach(b=>{b.style.background='#111';b.style.color='#888';b.style.borderColor='#2a2a2a';});this.style.background='#1a1030';this.style.color='#b39ddb';this.style.borderColor='#7c4dff';"
                    class="best-filter-btn" style="background:${active?'#1a1030':'#111'};color:${active?'#b39ddb':'#888'};border:1px solid ${active?'#7c4dff':'#2a2a2a'};padding:3px 10px;cursor:pointer;border-radius:4px;font-size:0.78em;">${label}</button>`;
            };
            html += `<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px;align-items:center;">
                <span style="color:#555;font-size:0.75em;">Filtre :</span>
                ${_mkFBtn('tous','Tous')}
                ${_mkFBtn('rencontre','Rencontré ≠100%')}
                ${_mkFBtn('decouvert','Découvert 100%')}
            </div>`;

            // ── Ennemis Uniques (accordéon) ──────────────────────────────
            const uniqueEntries = Object.entries(ennemisData).filter(([,e])=>e.unique);
            if (uniqueEntries.length) {
                const discUniq = uniqueEntries.filter(([id])=>(bestiaireData[id]?.nbKills||0)>0||uniquesBattus[id]||bestiaireData[id]?.premierVu).length;
                const uniqContent = uniqueEntries.filter(([id]) => _passeFiltre(id)).map(([id, def]) => _renderUniqCard(id, def)).join('');
                html += `<div style="margin-bottom:5px;">
                    <button onclick="var el=document.getElementById('bcat_uniques');el.style.display=el.style.display==='none'?'block':'none';"
                        style="background:#0d0020;border:1px solid #3a1a5a;color:#ce93d8;padding:6px 10px;cursor:pointer;border-radius:4px;display:inline-flex;align-items:center;gap:6px;font-size:0.85em;font-weight:bold;">
                        <span>★</span><span>Ennemis Uniques</span>
                        <span style="color:${discUniq>0?'#4caf50':'#555'};font-size:0.8em;margin-left:4px;">${discUniq}/${uniqueEntries.length} ▾</span>
                    </button>
                    <div id="bcat_uniques" style="display:none;padding:6px 2px 2px 2px;">${uniqContent}</div>
                </div>`;
            }

            // ── Catégories ───────────────────────────────────────────────
            const categories = {};
            Object.entries(ennemisData).forEach(([id,def])=>{
                if (def.unique) return;
                const cat = getCat(id,def);
                if (!categories[cat]) categories[cat]=[];
                categories[cat].push([id,def]);
            });
            const sortedCats = Object.keys(categories).sort((a,b)=>{
                const ia=CAT_ORDER.indexOf(a),ib=CAT_ORDER.indexOf(b);
                return (ia<0?999:ia)-(ib<0?999:ib);
            });
            // Pré-calcul des contenus par catégorie (avec filtre actif)
            window._bcatContents = {};
            sortedCats.forEach(cat=>{
                const enemies = categories[cat];
                const cid = 'bcat_'+cat.replace(/[^a-z0-9]/gi,'_');
                window._bcatContents[cid] = enemies
                    .filter(([id]) => _passeFiltre(id))
                    .map(([id,def])=>renderCard(id,def)).join('');
            });
            html += `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:8px;">`;
            sortedCats.forEach(cat=>{
                const enemies = categories[cat];
                const disc = enemies.filter(([id]) => _passeFiltre(id)).length;
                const cid = 'bcat_'+cat.replace(/[^a-z0-9]/gi,'_');
                const icon = CAT_ICONS[cat] || '❓';
                html += `<button id="btn_${cid}" onclick="(function(cid,btn){
                        var zone=document.getElementById('bcat-zone');
                        var prev=window._bcatActif;
                        if(prev){var pb=document.getElementById('btn_'+prev);if(pb){pb.style.background='#111';pb.style.borderColor='#2a2a2a';pb.style.color='#ccc';}}
                        if(prev===cid){zone.style.display='none';window._bcatActif=null;return;}
                        window._bcatActif=cid;
                        btn.style.background='#1a1030';btn.style.borderColor='#7c4dff';btn.style.color='#b39ddb';
                        zone.innerHTML=window._bcatContents[cid]||'';
                        zone.style.display='block';
                    })('${cid}',this)"
                    class="bcat-btn" style="background:#111;border:1px solid #2a2a2a;color:#ccc;padding:4px 8px;cursor:pointer;border-radius:4px;display:${disc>0?'inline-flex':'none'};align-items:center;gap:4px;font-size:0.8em;white-space:nowrap;">
                    <span>${icon}</span><span>${cat}</span>
                    <span style="color:#4caf50;font-size:0.75em;">${disc}/${enemies.length}</span>
                </button>`;
            });
            html += `</div><div id="bcat-zone" style="display:none;margin-top:6px;"></div>`;

            contenu.innerHTML = html || '<p style="color:#555;text-align:center;padding:20px;">Aucun ennemi découvert.</p>';
            window._bcatActif = null;
        });

    }

    modal.style.display = 'flex';
}

window._revesBattus = window._revesBattus || {};

function ouvrirModalReve() {
    const modal   = document.getElementById('modal-reve');
    const contenu = document.getElementById('reve-contenu');
    if (!modal || !contenu) return;
    contenu.innerHTML = '<p style="color:#555;text-align:center;padding:20px;">Chargement...</p>';
    modal.style.display = 'flex';

    db.ref('parties/' + sessionActuelle + '/bestiaire').once('value').then(snap => {
        const bestiaireData = snap.val() || {};
        if (typeof ennemisData === 'undefined') {
            contenu.innerHTML = '<p style="color:#555;text-align:center;">Données indisponibles.</p>';
            return;
        }

        // Catégories utilitaires (copiées du bestiaire)
        const CAT_ORDER = ['Bêtes','Singes','Morts-vivants','Esprits','Démons','Élémentaires','Insectoïdes','Araignées','Arayas','Dragons','Golems','Constructs','Pestilentiels','Animaux','Plantes','Créatures Artificielles','Fées','Trolls','Humanoïdes','Kites','Krags','Reptiliens','Humains','Nains','Elfes','Orques','Demi-Ogres','Gnomes','Halfelins','Assassins de la Main','Autres'];
        const CAT_ICONS = {'Bêtes':'🐺','Singes':'🐒','Morts-vivants':'💀','Esprits':'👻','Démons':'😈','Élémentaires':'⚡','Insectoïdes':'🕷','Araignées':'🕸','Dragons':'🐉','Golems':'🗿','Constructs':'⚙','Pestilentiels':'🧟','Animaux':'🦁','Plantes':'🌿','Créatures Artificielles':'🤖','Fées':'🧚','Trolls':'👺','Humanoïdes':'🧍','Kites':'🦅','Krags':'🪨','Reptiliens':'🦎','Humains':'👤','Nains':'⛏','Elfes':'🌙','Orques':'⚔','Demi-Ogres':'🏔','Gnomes':'🔧','Halfelins':'🌾','Assassins de la Main':'🔪','Autres':'❓'};
        const getCat = (id, def) => {
            if (id.startsWith('main_assassin_')) return 'Assassins de la Main';
            const race = def.race || '';
            const map = {'Humain':'Humains','Nain':'Nains','Elfe':'Elfes','Orque':'Orques','Demi-Ogre':'Demi-Ogres','Gnome':'Gnomes','Halfelin':'Halfelins'};
            return map[race] || def.categorie || 'Autres';
        };

        // Grouper par catégorie — seulement ceux découverts
        const cats = {};
        Object.entries(ennemisData).forEach(([id, def]) => {
            if (def.unique) return;
            const e = bestiaireData[id] || {};
            if (!e.premierVu && !(e.nbKills > 0)) return;
            const cat = getCat(id, def);
            if (!cats[cat]) cats[cat] = [];
            cats[cat].push([id, def, e]);
        });
        const sortedCats = Object.keys(cats).sort((a, b) => {
            const ia = CAT_ORDER.indexOf(a), ib = CAT_ORDER.indexOf(b);
            return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
        });

        if (!sortedCats.length) {
            contenu.innerHTML = `<div style="text-align:center;padding:30px;color:#555;"><div style="font-size:2em;margin-bottom:10px;">💤</div><div>Aucun ennemi découvert.</div></div>`;
            return;
        }

        // Pré-générer HTML des monstres par catégorie
        const catContents = {};
        sortedCats.forEach(cat => {
            const monsters = cats[cat];
            monsters.sort((a, b) => a[1].niveau - b[1].niveau);
            catContents[cat] = monsters.map(([id, def]) => {
                const fo = def.statsBase?.FO || 0, ini = def.statsBase?.IN || 0;
                const pvMax = (fo * 2) + ini + (def.boostPV || 0);
                const kills = bestiaireData[id]?.nbKills || 0;
                const portrait = def.portrait ? `docs/img/portraits/${def.portrait}` : '';
                const battu = !!(window._revesBattus?.[id]);
                return `<div style="display:flex;gap:6px;align-items:center;padding:6px;border:1px solid #0d2a3a;border-radius:4px;background:#000d1a;">
                    ${portrait ? `<img src="${portrait}" onerror="this.style.display='none'" style="width:34px;height:34px;object-fit:cover;border-radius:3px;flex-shrink:0;border:1px solid #1a3a4a;">` : '<div style="width:34px;flex-shrink:0;"></div>'}
                    <div style="flex:1;min-width:0;">
                        <div style="color:#ccc;font-size:0.82em;font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${def.nom}</div>
                        <div style="color:#3a5a6a;font-size:0.65em;">Niv.${def.niveau} · ❤${pvMax}${kills > 0 ? ` · ☠×${kills}` : ' · Vu'}</div>
                    </div>
                    ${battu ? '<span style="color:#4caf50;font-size:1em;flex-shrink:0;" title="Vaincu en Rêve">✔</span>' : '<span style="width:16px;flex-shrink:0;"></span>'}
                    <button onclick="lancerCombatReve('${id}')" style="background:#001520;color:#4fc3f7;border:1px solid #0277bd;padding:3px 7px;cursor:pointer;border-radius:3px;font-size:0.75em;flex-shrink:0;">▶</button>
                </div>`;
            }).join('');
        });

        // Rendu : boutons de catégories + zone de contenu
        let html = `<div style="color:#3a6a7a;font-size:0.78em;margin-bottom:10px;">Affronte un ennemi déjà rencontré — sans XP, sans loot, sans conséquences.</div>`;
        html += `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px;" id="reve-cat-btns">`;
        sortedCats.forEach(cat => {
            const icon = CAT_ICONS[cat] || '❓';
            const nb = cats[cat].length;
            const battuNb = cats[cat].filter(([id]) => window._revesBattus?.[id]).length;
            html += `<button onclick="_reveOuvrirCategorie('${cat.replace(/'/g,"\\'")}',this)"
                style="background:#001020;color:#4fc3f7;border:1px solid #0d2a3a;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:0.78em;display:inline-flex;align-items:center;gap:3px;"
                id="reve-cat-btn-${cat.replace(/[^a-z0-9]/gi,'_')}">
                <span>${icon}</span><span>${cat}</span>
                <span style="color:${battuNb>0?'#4caf50':'#3a6a7a'};font-size:0.75em;">${battuNb}/${nb}</span>
            </button>`;
        });
        html += `</div><div id="reve-cat-zone"></div>`;
        contenu.innerHTML = html;

        // Stocker pour les callbacks
        window._reveCatContents = catContents;
    });
}

function _reveOuvrirCategorie(cat, btn) {
    const zone = document.getElementById('reve-cat-zone');
    if (!zone) return;
    // Toggle : si déjà ouvert, fermer
    const cid = cat.replace(/[^a-z0-9]/gi, '_');
    if (window._reveCatActif === cid) {
        zone.innerHTML = '';
        window._reveCatActif = null;
        btn.style.borderColor = '#0d2a3a';
        btn.style.color = '#4fc3f7';
        return;
    }
    // Réinitialiser l'actif précédent
    if (window._reveCatActif) {
        const prev = document.getElementById('reve-cat-btn-' + window._reveCatActif);
        if (prev) { prev.style.borderColor = '#0d2a3a'; prev.style.color = '#4fc3f7'; }
    }
    window._reveCatActif = cid;
    btn.style.borderColor = '#0277bd';
    btn.style.color = '#81d4fa';
    zone.innerHTML = `<div style="display:flex;flex-direction:column;gap:4px;margin-top:4px;">${window._reveCatContents?.[cat] || ''}</div>`;
}

function lancerCombatReve(monsterId) {
    if (!window.perso || !window.perso.nom || !sessionActuelle) return;
    const def = (typeof ennemisData !== 'undefined') ? ennemisData[monsterId] : null;
    if (!def) return;
    if (window.donjonActif) {
        if (typeof _toast === 'function') _toast('🗺 Impossible pendant un donjon.', 'error');
        return;
    }

    // Vérifier dans Firebase qu'aucun combat (normal ou rêve d'un autre joueur) n'est actif
    db.ref('parties/' + sessionActuelle + '/combat_actif/actif').once('value', (snap) => {
        if (snap.val() === true) {
            if (typeof _toast === 'function') _toast('⚔ Un combat est déjà en cours — impossible de lancer un Rêve.', 'error');
            return;
        }

        document.getElementById('modal-reve')?.style && (document.getElementById('modal-reve').style.display = 'none');
        document.getElementById('modal-journal')?.style && (document.getElementById('modal-journal').style.display = 'none');

        const p = window.perso;
        const myId = p.nom.replace(/\s+/g, '_');
        window._revePvAvant = p.pvActuel;
        window._reveFtAvant = p.ftActuel;
        const pvMaxJ = ((p.statsBase?.FO||0)*2) + (p.statsBase?.IN||0) + (p.boostPV||0);
        const ftMaxJ = ((p.statsBase?.CN||0)*2) + (p.statsBase?.IN||0) + (p.boostFT||0);
        const dxJ = (p.statsBase?.DX||0) + (p.statsInvesties?.DX||0);

        const foE = (def.statsBase?.FO||0) + (def.statsInvesties?.FO||0);
        const inE = (def.statsBase?.IN||0) + (def.statsInvesties?.IN||0);
        const cnE = (def.statsBase?.CN||0) + (def.statsInvesties?.CN||0);
        const dxE = (def.statsBase?.DX||0) + (def.statsInvesties?.DX||0);
        const pvMaxE = (foE*2) + inE + (def.boostPV||0);
        const ftMaxE = (cnE*2) + inE + (def.boostFT||0);

        const instanceId = Date.now();
        const ennemi = {
            instanceId,
            id: monsterId,
            nom: def.nom,
            race: def.race || '',
            niveau: def.niveau || 1,
            pvActuel: pvMaxE, pvMax: pvMaxE,
            ftActuel: ftMaxE, ftMax: ftMaxE,
            statsBase: def.statsBase || {},
            statsInvesties: def.statsInvesties || {},
            magieBase: def.magieBase || {},
            res: def.res || {},
            equipement: def.equipement || {},
            lootDrop: def.lootDrop || [],
            sortsConnus: (() => {
                const mb = def.magieBase || {};
                const sorts = [];
                for (const [ecole, nb] of Object.entries(mb)) {
                    if (typeof magieData !== 'undefined' && magieData[ecole]?.sorts) {
                        for (let k = 0; k < nb && k < magieData[ecole].sorts.length; k++) {
                            sorts.push(magieData[ecole].sorts[k].nom);
                        }
                    }
                }
                return sorts;
            })()
        };

        const ordre = [
            { type: 'joueur', id: myId, nom: p.nom, vitesse: dxJ },
            { type: 'ennemi', instanceId, nom: def.nom, vitesse: dxE }
        ].sort((a, b) => b.vitesse - a.vitesse || (a.type === 'joueur' ? -1 : 1));

        db.ref('parties/' + sessionActuelle + '/combat_log').remove();
        db.ref('parties/' + sessionActuelle + '/combat_actif').set({
            actif: true,
            reve: true,
            reve_initiateur: myId,
            ennemis: [ennemi],
            ordre_jeu: ordre,
            tour_actuel: 0,
            joueurs_discrets: { [myId]: false },
            timestamp: Date.now()
        }).then(() => {
            if (typeof _toast === 'function') _toast('💤 Combat de Rêve !', 'info');
        });
    });
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

function _appliquerBrulure() {
    if (!window.perso?.brulure) return 0;
    const CN = (window.perso.statsBase?.CN || 5) + (window.perso.statsInvesties?.CN || 0);
    const chance = Math.max(10, Math.floor(CN / 3));
    const resFeu = window.perso.bonusInnes?.resFeu || 0;
    const maxPV = (window.perso.statsBase.FO * 2) + window.perso.statsBase.IN
        + ((window.perso.statsInvesties?.FO || 0) * 2) + (window.perso.statsInvesties?.IN || 0)
        + (window.perso.boostPV || 0);

    if (Math.floor(Math.random() * 100) < chance) {
        window.perso.brulure = null;
        if (typeof _toast === 'function') _toast('✅ Brûlure éteinte — aucun dégât !', 'success');
        if (typeof autoSave === 'function') autoSave();
        rafraichirAccueil();
        return 0;
    }
    window.perso.brulure.tours--;
    if (window.perso.brulure.tours <= 0) window.perso.brulure = null;

    const degatsBase = Math.ceil(maxPV * 0.10);
    const degats = Math.max(1, Math.round(degatsBase * (1 - resFeu / 100)));
    let msg;
    if (window.perso.pvActuel - degats <= 0) {
        const pvAbs = Math.max(0, window.perso.pvActuel - 1);
        const surplus = degats - pvAbs;
        window.perso.pvActuel = 1;
        window.perso.ftActuel = Math.max(0, (window.perso.ftActuel || 0) - surplus);
        msg = `🔥 Brûlure : −${pvAbs} PV, −${surplus} FT`;
    } else {
        window.perso.pvActuel -= degats;
        msg = `🔥 Brûlure : −${degats} PV`;
    }
    if (typeof _toast === 'function') _toast(msg, 'error');
    if (typeof _logCombat === 'function') _logCombat(`🔥 ${window.perso.nom} : ${msg}`);
    if (typeof autoSave === 'function') autoSave();
    rafraichirAccueil();
    return degats;
}

function _appliquerElectrocution() {
    if (!window.perso?.electrocution) return 0;
    const resElec = window.perso.bonusInnes?.resElec || 0;
    const maxPV = (window.perso.statsBase.FO * 2) + window.perso.statsBase.IN
        + ((window.perso.statsInvesties?.FO || 0) * 2) + (window.perso.statsInvesties?.IN || 0)
        + (window.perso.boostPV || 0);

    window.perso.electrocution.tours--;
    const dissipee = window.perso.electrocution.tours <= 0;
    if (dissipee) window.perso.electrocution = null;

    const degatsBase = Math.ceil(maxPV * 0.05);
    const degats = Math.max(1, Math.round(degatsBase * (1 - resElec / 100)));
    window.perso.pvActuel = Math.max(1, (window.perso.pvActuel || 1) - degats);
    const msg = `⚡ Électrocution : −${degats} PV${dissipee ? ' — dissipée' : ''}`;
    if (typeof _toast === 'function') _toast(msg, 'error');
    if (typeof _logCombat === 'function') _logCombat(`⚡ ${window.perso.nom} : ${msg}`);
    if (typeof autoSave === 'function') autoSave();
    rafraichirAccueil();
    return degats;
}

function _appliquerSaignement() {
    if (!window.perso?.saignement) return 0;
    const maxPV = (window.perso.statsBase.FO * 2) + window.perso.statsBase.IN
        + ((window.perso.statsInvesties?.FO || 0) * 2) + (window.perso.statsInvesties?.IN || 0)
        + (window.perso.boostPV || 0);

    window.perso.saignement.tours--;
    if (window.perso.saignement.tours <= 0) window.perso.saignement = null;

    const degats = Math.max(1, Math.ceil(maxPV * 0.07));
    let msg;
    if (window.perso.pvActuel - degats <= 0) {
        const pvAbs = Math.max(0, window.perso.pvActuel - 1);
        const surplus = degats - pvAbs;
        window.perso.pvActuel = 1;
        window.perso.ftActuel = Math.max(0, (window.perso.ftActuel || 0) - surplus);
        msg = `🩸 Saignement : −${pvAbs} PV, −${surplus} FT`;
    } else {
        window.perso.pvActuel -= degats;
        msg = `🩸 Saignement : −${degats} PV`;
    }
    if (typeof _toast === 'function') _toast(msg, 'error');
    if (typeof _logCombat === 'function') _logCombat(`🩸 ${window.perso.nom} : ${msg}`);
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
    let bonusFTEquip = 0, bonusPVEquip = 0;
    if (window.perso.equipement && typeof itemsData !== 'undefined') {
        for (const slot in window.perso.equipement) {
            const itemEq = window.perso.equipement[slot];
            if (itemEq && itemsData[itemEq.id]?.stats && itemEq.identifie !== false) {
                bonusFTEquip += itemsData[itemEq.id].stats.FT || 0;
                bonusPVEquip += itemsData[itemEq.id].stats.PV || 0;
            }
        }
    }
    const maxPV = (foTotal * 2) + inTotal + (window.perso.boostPV || 0) + _bonusEffets(window.perso, 'pv') + bonusPVEquip;
    const maxFT = (cnTotal * 2) + inTotal + (window.perso.boostFT || 0) + _bonusEffets(window.perso, 'ft') + bonusFTEquip;

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

        // Bouton Compagnons : visible si au moins un compagnon OU un familier actif
        const btnCompagnons = document.getElementById('btn-menu-compagnons');
        if (btnCompagnons) {
            const nbComps = (window.perso.compagnons || []).length;
            if (nbComps > 0) {
                btnCompagnons.style.display = 'inline-block';
            } else if (typeof db !== 'undefined' && sessionActuelle) {
                const _uid = (window.perso.nom || '').replace(/\s+/g, '_');
                db.ref('parties/' + sessionActuelle + '/familiers/' + _uid).once('value', function(s) {
                    const fam = s.val();
                    btnCompagnons.style.display = (fam && (fam.pvActuel === undefined || fam.pvActuel > 0)) ? 'inline-block' : 'none';
                });
            } else {
                btnCompagnons.style.display = 'none';
            }
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

        // Bouton Rêve : visible si au moins un monstre découvert dans le bestiaire
        const btnReve = document.getElementById('btn-menu-reve');
        if (btnReve && typeof db !== 'undefined' && sessionActuelle) {
            db.ref('parties/' + sessionActuelle + '/bestiaire').once('value', snap => {
                const b = snap.val() || {};
                const auMoinsUn = typeof ennemisData !== 'undefined' && Object.entries(ennemisData).some(([id, def]) => {
                    if (def.unique) return false;
                    return (b[id]?.premierVu || (b[id]?.nbKills || 0) > 0);
                });
                btnReve.style.display = auMoinsUn ? 'block' : 'none';
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
    if (typeof _verifierSucces === 'function') _verifierSucces(cle);
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
        if (typeof _syncStatsGlobales === 'function') _syncStatsGlobales();
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