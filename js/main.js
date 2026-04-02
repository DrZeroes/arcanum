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
            'ecran-carte', 'ecran-groupe', 'ecran-magie-accueil'
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