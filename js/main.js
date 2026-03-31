// ==========================================
// 1. VARIABLES GLOBALES (Sécurisées)
// ==========================================
window.perso = window.perso || {};
var perso = window.perso;

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
        });
    }

    // Musique au premier clic
    document.body.addEventListener('click', function() {
        if (typeof AudioEngine !== 'undefined') AudioEngine.jouerMusique('Arcanum.mp3');
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
        perso = JSON.parse(sauvegarde);
        window.perso = perso;
demarrerMoteurMulti();
    }

    // Interfaces
    if (typeof initCompetencesUI === 'function') initCompetencesUI();
    if (typeof initMagieUI === 'function') initMagieUI();
    if (typeof initTechUI === 'function') initTechUI();

    allerAccueil(); 
};

// ==========================================
// 3. NAVIGATION & AFFICHAGE
// ==========================================
function cacherTout() {
    const ecrans = [
        'ecran-accueil', 'ecran-creation', 'ecran-fiche', 
        'ecran-inventaire', 'ecran-fouille', 'ecran-marchand', 
        'ecran-craft', 'ecran-aide', 'ecran-codex', 'ecran-mj', 'ecran-carte', 'ecran-groupe', 'ecran-magie-accueil'
    ];
    ecrans.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
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
    if (!perso) return;

    // Si le joueur est mort, on force le fond d'écran funèbre
    if (perso.estMort) {
        document.body.style.backgroundImage = `url('./docs/img/fonds/mort.jpg')`; 
    } 
    // Sinon, on affiche le fond normal lié au lieu
    else {
        const idLieu = perso.lieuActuel || "crash";
        let lieuData = null;
        if (typeof lieuxDecouverts !== 'undefined') lieuData = lieuxDecouverts[idLieu];

        if (lieuData && lieuData.fond) {
            document.body.style.backgroundImage = `url('./docs/img/fonds/${lieuData.fond}')`;
        } else {
            document.body.style.backgroundImage = `url('./docs/img/fonds/fond_arcanum_default.jpg')`;
        }
    }
    
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center center";
    document.body.style.backgroundAttachment = "fixed";
}


function rafraichirAccueil() {
    const zoneNouveau = document.getElementById('accueil-nouveau-jeu');
    const zoneContinuer = document.getElementById('accueil-continuer');
    const nomAffiche = document.getElementById('accueil-nom-perso');
    const lieuAffiche = document.getElementById('accueil-lieu-perso'); 
    
    if (perso && perso.nom && perso.nom !== "Nom du Personnage" && perso.nom !== "") {
        if (zoneNouveau) zoneNouveau.style.display = 'none';
        if (zoneContinuer) zoneContinuer.style.display = 'block';

        // --- 1. AFFICHAGE NOM ET LIEU ---
        if (nomAffiche) nomAffiche.innerText = "Héros : " + perso.nom + " (Niv. " + (perso.niveau || 1) + ")";
        
        if (lieuAffiche && typeof lieuxDecouverts !== 'undefined') {
            const lieuData = lieuxDecouverts[perso.lieuActuel || "crash"];
            lieuAffiche.innerText = "Lieu actuel : " + (lieuData ? lieuData.nom : "Inconnu");
        }

        // --- 2. AFFICHAGE DES PV / FT ---
		document.getElementById('accueil-stats-perso').style.display = 'block';
        const maxPV = (perso.statsBase.FO * 2) + (perso.statsBase.IN) + (perso.boostPV || 0);
        const maxFT = (perso.statsBase.CN * 2) + (perso.statsBase.IN) + (perso.boostFT || 0);
        document.getElementById('accueil-pv').innerText = (perso.pvActuel || maxPV) + " / " + maxPV;
        document.getElementById('accueil-ft').innerText = (perso.ftActuel || maxFT) + " / " + maxFT;

        // --- 3. SYNCHRO & GROUPE ---
        // On s'annonce aux autres
        if (typeof synchroniserJoueur === "function") synchroniserJoueur();
        // On affiche les membres du groupe
        if (typeof activerRadarGroupeAccueil === "function") activerRadarGroupeAccueil();

        // --- 4. BOUTONS SPÉCIAUX (Craft & Magie) ---
        if (typeof verifierBoutonCraft === "function") verifierBoutonCraft(); 
        const btnMagie = document.getElementById('btn-menu-magie');
        if (btnMagie) {
            let mesSorts = (typeof getSortsConnus === "function") ? getSortsConnus() : [];
            btnMagie.style.display = (mesSorts.length > 0) ? 'block' : 'none';
        }

    } else {
        if (zoneNouveau) zoneNouveau.style.display = 'block';
        if (zoneContinuer) zoneContinuer.style.display = 'none';
    }
}





// 4. GESTION DU PERSONNAGE
// ==========================================


// ==========================================
// GESTION DE LA VIE ET DE LA MORT 💀
// ==========================================
function verifierMort() {
    if (!perso) return;

    if (perso.pvActuel <= 0) {
        perso.pvActuel = 0;
        
        // On vérifie si le joueur VIENT de mourir (pour ne pas relancer la musique en boucle)
        let vientDeMourir = !perso.estMort; 
        perso.estMort = true;
        
        document.body.style.filter = "grayscale(100%)";
        const btnMagie = document.getElementById('btn-menu-magie');
        if (btnMagie) btnMagie.style.display = 'none';
        
        // Si c'est l'instant fatal :
        if (vientDeMourir) {
            alert("💀 Vous avez succombé à vos blessures...");
            if (typeof AudioEngine !== 'undefined') {
                AudioEngine.jouerMusique('Musique_Mort.mp3'); // <-- À remplacer par ta piste audio
            }
            appliquerFondActuel(); // On met à jour le fond visuel
        }
        
    } else {
        // Le joueur a plus de 0 PV
        let vientDeRessusciter = perso.estMort;
        perso.estMort = false;
        
        document.body.style.filter = "none";
        if (document.getElementById('btn-menu-magie')) {
            document.getElementById('btn-menu-magie').style.display = 'block';
        }
        
        // Si le joueur VIENT de ressusciter :
        if (vientDeRessusciter) {
            alert("✨ Vous revenez d'entre les morts !");
            
            // On relance la musique du lieu actuel
            if (typeof AudioEngine !== 'undefined') {
                const idLieu = perso.lieuActuel || "crash";
                const lieuData = (typeof lieuxDecouverts !== 'undefined') ? lieuxDecouverts[idLieu] : null;
                if (lieuData && lieuData.musique) {
                    AudioEngine.jouerMusique(lieuData.musique);
                } else {
                    AudioEngine.jouerMusique('Interlude.mp3');
                }
            }
            appliquerFondActuel(); // On restaure le décor
        }
    }

    if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
    if (typeof rafraichirAccueil === 'function') rafraichirAccueil();
}





function chargerPersonnage() {
    const sauvegarde = localStorage.getItem('arcanum_sauvegarde');
    if (sauvegarde) {
        perso = JSON.parse(sauvegarde);
        window.perso = perso;
        cacherTout();
        
        const ecranFiche = document.getElementById('ecran-fiche');
        if (ecranFiche) ecranFiche.style.display = 'block';
        
        if (typeof updateFicheUI === 'function') updateFicheUI(); 
        
        // --- LES ANTENNES DU JOUEUR SONT ICI ---
        if (typeof activerEcouteurCadeaux === "function") activerEcouteurCadeaux();
        if (typeof activerEcouteurAlertes === "function") activerEcouteurAlertes();
        if (typeof activerEcouteurStats === "function") activerEcouteurStats();
        
        // On appelle la mise à jour de la liste des cibles ici
        if (typeof mettreAJourListeCibles === "function") mettreAJourListeCibles();

        if (typeof verifierBoutonCraft === "function") verifierBoutonCraft();
    }
}

function reprendrePartie() {
    const sauvegarde = localStorage.getItem('arcanum_sauvegarde');
    if (!sauvegarde) return;

    perso = JSON.parse(sauvegarde);
    window.perso = perso;

    if (!perso.inventaire) perso.inventaire = [];
    if (!perso.equipement) perso.equipement = {
        tete: null, torse: null, gants: null, bottes: null, 
        anneau: null, amulette: null, main_droite: null, main_gauche: null
    };

    const idLieu = perso.lieuActuel || "crash"; 
    if (typeof lieuxDecouverts !== 'undefined') {
        const lieuData = lieuxDecouverts[idLieu];
        if (lieuData && lieuData.musique) {
            if (typeof AudioEngine !== 'undefined') AudioEngine.jouerMusique(lieuData.musique);
        } else {
            if (typeof AudioEngine !== 'undefined') AudioEngine.jouerMusique('Interlude.mp3');
        }
    }

    cacherTout();
    const ecranFiche = document.getElementById('ecran-fiche');
    if (ecranFiche) {
        ecranFiche.style.display = 'block';
        if (typeof updateFicheUI === 'function') updateFicheUI();
        if (typeof verifierBoutonCraft === "function") verifierBoutonCraft();
    }
    
    // On appelle aussi la mise à jour de la liste ici quand on reprend la partie
    if (typeof mettreAJourListeCibles === "function") mettreAJourListeCibles();
    
    appliquerFondActuel();
}


function mettreAJourListeCibles() {
    const groupeSorts = document.getElementById('groupe-joueurs'); // Ta liste Magie
    const groupeObjets = document.getElementById('groupe-joueurs-inventaire'); // Ta liste Inventaire

    db.ref('parties/' + sessionActuelle + '/joueurs/').on('value', (snapshot) => {
        if (groupeSorts) groupeSorts.innerHTML = '';
        if (groupeObjets) groupeObjets.innerHTML = ''; 

        snapshot.forEach((child) => {
            const joueur = child.val();
            const joueurID = child.key;

            if (perso && joueur.nom !== perso.nom) {
                const option1 = document.createElement('option');
                option1.value = joueurID;
                option1.textContent = joueur.nom;

                const option2 = document.createElement('option');
                option2.value = joueurID;
                option2.textContent = joueur.nom;

                if (groupeSorts) groupeSorts.appendChild(option1);
                if (groupeObjets) groupeObjets.appendChild(option2);
            }
        });
    });
}


// ==========================================
// 5. SAUVEGARDE ET IMPORT/EXPORT
// ==========================================
function autoSave() {
    if (perso && perso.nom && perso.nom !== "Nom du Personnage") {
        localStorage.setItem('arcanum_sauvegarde', JSON.stringify(perso));
        console.log("Sauvegarde automatique effectuée.");
    }
    if (typeof synchroniserJoueur === "function") {
        synchroniserJoueur();
    }
}

function telechargerFichier() {
    const blob = new Blob([JSON.stringify(perso, null, 2)], { type: "application/json" });
    const a = document.createElement('a'); 
    a.href = URL.createObjectURL(blob);
    a.download = (perso.nom || "perso") + "_arcanum.json"; 
    a.click();
}

function importerFichier(e) {
    if(!e.target.files[0]) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
        const p = JSON.parse(ev.target.result);
        if (p.nom) { 
            localStorage.setItem('arcanum_sauvegarde', JSON.stringify(p)); 
            perso = p; 
            window.perso = p;
            if (typeof updateFicheUI === 'function') updateFicheUI(); 
            cacherTout(); 
            const ecranFiche = document.getElementById('ecran-fiche');
            if (ecranFiche) ecranFiche.style.display = 'block'; 
        }
    };
    reader.readAsText(e.target.files[0]);
}