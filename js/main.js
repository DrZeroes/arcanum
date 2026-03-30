
let perso = {}; 
let statsCalculees = {}; 

// === AJOUTE CECI ===
// Variable globale pour traquer les points dépensés AVANT validation
let investissementsTemporaires = {
    pv: 0,
    ft: 0,
    stats: {},
    comp: {},
    magie: {},
    tech: {}
};

// ================= INITIALISATION =================
window.onload = function() {
	
		//cahrgemtn music accueil
	document.body.addEventListener('click', function() {
        AudioEngine.jouerMusique('Arcanum.mp3');
    }, { once: true }); // Ne s'exécute qu'une fois
	

	
    // 1. Initialisation des menus (ton code existant)
    const raceSelect = document.getElementById('raceSelect');
    if (raceSelect) {
        for (let r in racesData) {
            let o = document.createElement('option');
            o.value = r; o.innerText = r;
            raceSelect.appendChild(o);
        }
        document.getElementById('raceSelect').addEventListener('change', buildChar);
        document.getElementById('sexeSelect').addEventListener('change', buildChar);
        document.getElementById('bgSelect').addEventListener('change', buildChar);
    }

    // 2. TENTATIVE DE RÉCUPÉRATION AUTO
    const sauvegarde = localStorage.getItem('arcanum_sauvegarde');
    if (sauvegarde) {
        perso = JSON.parse(sauvegarde); // On remplit la variable perso avec la sauvegarde
        console.log("Personnage récupéré automatiquement !");
    }

    // 3. On initialise les interfaces
    if (typeof competencesData !== 'undefined') initCompetencesUI();
    if (typeof magieData !== 'undefined') initMagieUI();
    if (typeof techData !== 'undefined') initTechUI();

    // 4. On affiche l'accueil (qui affichera "Continuer" grâce au point 2)
    allerAccueil(); 
};
// ================= NAVIGATION =================
function cacherTout() {
    // Liste complète de tous les écrans de ton interface
    const ecrans = [
        'ecran-accueil', 
        'ecran-creation', 
        'ecran-fiche', 
        'ecran-inventaire', 
        'ecran-fouille',   // AJOUTÉ
        'ecran-marchand' ,  // AJOUTÉ
		'ecran-craft' ,     // <--- AJOUTE CETTE LIGNE !
		'ecran-aide' ,
'ecran-codex',		// <--- AJOUTE CETTE LIGNE !
'ecran-carte'
    ];

    ecrans.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
}
function allerAccueil() {
    cacherTout();
    document.getElementById('ecran-accueil').style.display = 'block';
    const sauvegarde = localStorage.getItem('arcanum_sauvegarde');
    const btnLoad = document.getElementById('btn-load');
    if (sauvegarde) {
        const data = JSON.parse(sauvegarde);
        btnLoad.innerText = "Continuer avec " + data.nom;
        btnLoad.style.background = "#4caf50";
        btnLoad.disabled = false;
    } else {
        btnLoad.innerText = "Aucune sauvegarde";
        btnLoad.style.background = "#444";
        btnLoad.disabled = true;
    }
}


function ouvrirAide() {
    cacherTout();
    const ecranAide = document.getElementById('ecran-aide');
    if (ecranAide) {
        ecranAide.style.display = 'block';
    } else {
        console.warn("L'élément 'ecran-aide' est introuvable dans le HTML.");
    }
}


function chargerPersonnage() {
    const sauvegarde = localStorage.getItem('arcanum_sauvegarde');
    if (sauvegarde) {
        perso = JSON.parse(sauvegarde);
        cacherTout();
        document.getElementById('ecran-fiche').style.display = 'block';
        updateFicheUI(); 
        
        // On vérifie le bouton craft au chargement
        if (typeof verifierBoutonCraft === "function") verifierBoutonCraft();
    }
}


function telechargerFichier() {
    const blob = new Blob([JSON.stringify(perso, null, 2)], { type: "application/json" });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = (perso.nom || "perso") + "_arcanum.json"; a.click();
}

function importerFichier(e) {
    const reader = new FileReader();
    reader.onload = function(ev) {
        const p = JSON.parse(ev.target.result);
        if (p.nom) { localStorage.setItem('arcanum_sauvegarde', JSON.stringify(p)); perso = p; updateFicheUI(); cacherTout(); document.getElementById('ecran-fiche').style.display = 'block'; }
    };
    reader.readAsText(e.target.files[0]);
}


function appliquerFondActuel() {
    // On sécurise le coup : si on n'a pas de perso ou pas de lieu, on met le crash ou un fond par défaut
    const idLieu = (perso && perso.lieuActuel) ? perso.lieuActuel : "crash";
    const lieuData = lieuxDecouverts[idLieu];

    if (lieuData && lieuData.fond) {
        document.body.style.backgroundImage = `url('./docs/img/fonds/${lieuData.fond}')`;
    } else {
        // Fond par défaut si le lieu n'a pas d'image
        document.body.style.backgroundImage = `url('./docs/img/fonds/fond_arcanum_default.jpg')`;
    }
    
    // On s'assure que l'image s'affiche bien (tu peux aussi mettre ça dans ton fichier CSS sur la balise body)
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center center";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.transition = "background-image 0.5s ease-in-out"; // Petit fondu sympa !
}


function rafraichirAccueil() {
    const zoneNouveau = document.getElementById('accueil-nouveau-jeu');
    const zoneContinuer = document.getElementById('accueil-continuer');
    const nomAffiche = document.getElementById('accueil-nom-perso');
    const lieuAffiche = document.getElementById('accueil-lieu-perso'); // Ajoute cet ID dans ton HTML

    if (perso && perso.nom && perso.nom !== "Nom du Personnage" && perso.nom !== "") {
        if (zoneNouveau) zoneNouveau.style.display = 'none';
        if (zoneContinuer) zoneContinuer.style.display = 'block';
        
        if (nomAffiche) nomAffiche.innerText = "Héros : " + perso.nom + " (Niv. " + (perso.niveau || 1) + ")";
        
        // --- AJOUT DU LIEU ACTUEL ---
        if (lieuAffiche) {
            const lieuData = lieuxDecouverts[perso.lieuActuel || "crash"];
            lieuAffiche.innerText = "Lieu actuel : " + (lieuData ? lieuData.nom : "Inconnu");
        }
        
        if (typeof verifierBoutonCraft === "function") verifierBoutonCraft(); 
    } else {
        if (zoneNouveau) zoneNouveau.style.display = 'block';
        if (zoneContinuer) zoneContinuer.style.display = 'none';
    }
}


// Modifie ta fonction allerAccueil pour qu'elle vérifie l'état à chaque fois
function allerAccueil() {
	autoSave()
    cacherTout();
    document.getElementById('ecran-accueil').style.display = 'block';
    rafraichirAccueil(); // <--- Important !
}

function reprendrePartie() {
    const sauvegarde = localStorage.getItem('arcanum_sauvegarde');
    if (!sauvegarde) return;

    perso = JSON.parse(sauvegarde);

    // Sécurités inventaire
    if (!perso.inventaire) perso.inventaire = [];
    if (!perso.equipement) perso.equipement = {
        tete: null, torse: null, gants: null, bottes: null, 
        anneau: null, amulette: null, main_droite: null, main_gauche: null
    };

    // --- GESTION DE LA MUSIQUE AU CHARGEMENT ---
    // On cherche le lieu actuel dans tes données
    const idLieu = perso.lieuActuel || "crash"; 
    const lieuData = lieuxDecouverts[idLieu];

    if (lieuData && lieuData.musique) {
        AudioEngine.jouerMusique(lieuData.musique);
    } else {
        AudioEngine.jouerMusique('Interlude.mp3'); // Secours
    }

    cacherTout();
    const ecranFiche = document.getElementById('ecran-fiche');
    if (ecranFiche) {
        ecranFiche.style.display = 'block';
        updateFicheUI();
        if (typeof verifierBoutonCraft === "function") verifierBoutonCraft();
    }
	
	
	appliquerFondActuel();
}


function autoSave() {
    if (perso && perso.nom && perso.nom !== "Nom du Personnage") {
        localStorage.setItem('arcanum_sauvegarde', JSON.stringify(perso));
        console.log("Sauvegarde automatique effectuée.");
    }
}