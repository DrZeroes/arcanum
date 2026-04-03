// ==========================================
// 1. VARIABLES GLOBALES (Sécurisées)
// ==========================================
window.perso = window.perso || {};

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
            'ecran-carte', 'ecran-groupe', 'ecran-magie-accueil', 'ecran-compagnons'
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
        const fo  = c.statsBase.FO + (c.statsInvesties?.FO || 0);
        const ini = c.statsBase.IN + (c.statsInvesties?.IN || 0);
        const cn  = c.statsBase.CN + (c.statsInvesties?.CN || 0);
        const dx  = c.statsBase.DX + (c.statsInvesties?.DX || 0);
        const ch  = c.statsBase.CH + (c.statsInvesties?.CH || 0);
        const pvMax = (fo * 2) + ini + (c.boostPV || 0);
        const ftMax = (cn * 2) + ini + (c.boostFT || 0);
        const pvPct = pvMax > 0 ? Math.round((c.pvActuel / pvMax) * 100) : 0;
        const ftPct = ftMax > 0 ? Math.round((c.ftActuel / ftMax) * 100) : 0;

        // Équipement non-null
        const equipItems = [];
        if (c.equipement && typeof itemsData !== 'undefined') {
            for (let slot in c.equipement) {
                const eq = c.equipement[slot];
                if (eq && itemsData[eq.id]) equipItems.push(itemsData[eq.id].nom);
            }
        }

        // Compétences investies
        const compStr = c.compInvesties
            ? Object.entries(c.compInvesties).filter(([, v]) => v > 0).map(([k, v]) => `${k}:${v}`).join(' · ')
            : '';

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
                </div>

                <div class="compagnon-stats-grid">
                    <div class="compagnon-stat"><span class="cs-label">FO</span><span class="cs-val">${fo}</span></div>
                    <div class="compagnon-stat"><span class="cs-label">IN</span><span class="cs-val">${ini}</span></div>
                    <div class="compagnon-stat"><span class="cs-label">CN</span><span class="cs-val">${cn}</span></div>
                    <div class="compagnon-stat"><span class="cs-label">DX</span><span class="cs-val">${dx}</span></div>
                    <div class="compagnon-stat"><span class="cs-label">CH</span><span class="cs-val">${ch}</span></div>
                </div>

                ${equipItems.length ? `<div class="compagnon-equip">🗡 ${equipItems.join(' · ')}</div>` : ''}
                ${compStr ? `<div class="compagnon-comps">📚 ${compStr}</div>` : ''}
            </div>
        `);
    });

    const enTete = `<div class="compagnons-max-info">Compagnons : ${comps.length} / ${maxComps} (CH ${statCH})</div>`;
    container.innerHTML = enTete + fragments.join('');
}

function ouvrirAide() {
    cacherTout();
    const ecranAide = document.getElementById('ecran-aide');
    if (ecranAide) ecranAide.style.display = 'block';
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
    const maxPV = (window.perso.statsBase.FO * 2) + (window.perso.statsBase.IN) + (window.perso.boostPV || 0);
    const maxFT = (window.perso.statsBase.CN * 2) + (window.perso.statsBase.IN) + (window.perso.boostFT || 0);

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
        statsBox.innerHTML = `
            ❤️ PV : <span id="accueil-pv" style="font-weight:bold;">${pvReels} / ${maxPV}</span> 
            ⚡ FT : <span id="accueil-ft" style="font-weight:bold;">${ftReels} / ${maxFT}</span>
        `;
    }
}



        if (typeof synchroniserJoueur === "function") synchroniserJoueur();
        if (typeof activerRadarGroupeAccueil === "function") activerRadarGroupeAccueil();
        if (typeof verifierBoutonCraft === "function") verifierBoutonCraft(); 

        const btnMagie = document.getElementById('btn-menu-magie');
        if (btnMagie) {
            let mesSorts = (typeof getSortsConnus === "function") ? getSortsConnus() : [];
            btnMagie.style.display = (mesSorts.length > 0) ? 'block' : 'none';
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
        window.perso.estMort = true;
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


function chargerPersonnage() {
    const sauvegarde = localStorage.getItem('arcanum_sauvegarde');
    if (sauvegarde) {
        window.perso = JSON.parse(sauvegarde);
        
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
    if (!window.perso.inventaire) window.perso.inventaire = [];
    if (!window.perso.equipement) window.perso.equipement = {
        tete: null, torse: null, gants: null, bottes: null, anneau: null, amulette: null, main_droite: null, main_gauche: null
    };
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
let _autoSaveTimer = null;
function autoSave() {
    if (_autoSaveTimer) clearTimeout(_autoSaveTimer);
    _autoSaveTimer = setTimeout(() => {
        if (window.perso && window.perso.nom && window.perso.nom !== "Nom du Personnage") {
            localStorage.setItem('arcanum_sauvegarde', JSON.stringify(window.perso));
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
        const p = JSON.parse(ev.target.result);
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