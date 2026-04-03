// ================= CRÉATION =================
function buildChar() {
    const rKey = document.getElementById('raceSelect').value;
    const race = racesData[rKey];
    const sexeSelect = document.getElementById('sexeSelect');
    const bgSelect = document.getElementById('bgSelect');

    const currentSex = sexeSelect.value;
    sexeSelect.innerHTML = '<option value="M">Masculin</option>';
    if (race.peutEtreFemme) {
        sexeSelect.innerHTML += '<option value="F">Féminin</option>';
        sexeSelect.value = (currentSex === "F") ? "F" : "M";
    } else { sexeSelect.value = "M"; }

    let final = { FO: race.FO, IN: race.IN, CN: race.CN, DX: race.DX, CH: race.CH };
    if (sexeSelect.value === "F") {
        final.CN += 1; final.CH += 1; final.FO -= 1; final.DX -= 1;
    }

    const lastBg = bgSelect.value;
    bgSelect.innerHTML = "";
    
    if (typeof backgrounds !== 'undefined') {
        backgrounds.forEach(bg => {
            let allow = true;
            if (bg.rest.sexe && bg.rest.sexe !== sexeSelect.value) allow = false;
            if (bg.rest.races && !bg.rest.races.includes(rKey)) allow = false;
            if (bg.rest.pasRaces && bg.rest.pasRaces.includes(rKey)) allow = false;
            if (allow) {
                let o = document.createElement('option');
                o.value = bg.nom; o.innerText = bg.nom;
                if(bg.nom === lastBg) o.selected = true;
                bgSelect.appendChild(o);
            }
        });

        const currentBg = backgrounds.find(b => b.nom === bgSelect.value) || backgrounds[0];
        if (currentBg.mod) {
            for (let s in currentBg.mod) {
                if (final.hasOwnProperty(s)) final[s] += currentBg.mod[s];
            }
        }
        document.getElementById('desc-box').innerText = currentBg.desc;
document.getElementById('raceTraits').innerHTML = `<strong>Effets :</strong> ${currentBg.effets || "Aucun"}`;    }

    statsCalculees = final; 
    for (let s in final) { 
        let el = document.getElementById('val-' + s);
        if(el) el.innerText = final[s]; 
    }
    document.getElementById('pv-total').innerText = (final.FO * 2) + final.IN;
    document.getElementById('fatigue-total').innerText = (final.CN * 2) + final.IN;
	
	
	
// À la fin de la fonction buildChar()
const currentBg = backgrounds.find(b => b.nom === bgSelect.value) || backgrounds[0];
// Règle des 400 Or par défaut
const argentDepart = (currentBg.mod && currentBg.mod.argent !== undefined) ? currentBg.mod.argent : 400;



// On l'ajoute visuellement dans la zone de traits
document.getElementById('raceTraits').innerHTML = `
    <strong>Effets :</strong> ${currentBg.effets || "Aucun"} | 
    <strong>Argent :</strong> ${argentDepart} Or
`;


rafraichirApercuAvatar(); // <--- AJOUTE CETTE LIGNE ICI	
}

function validerCreation() {
    // 1. Récupération et vérification du nom
    const nom = document.getElementById('charName').value.trim();
    if (nom === "") { 
        alert("Veuillez entrer un nom pour votre personnage !"); 
        return; 
    }

    // 2. Récupération des données de base (Race et Background)
    const rKey = document.getElementById('raceSelect').value;
    const race = racesData[rKey];
    const bgName = document.getElementById('bgSelect').value;
    const bg = backgrounds.find(b => b.nom === bgName) || { mod: {} };
    const sexe = document.getElementById('sexeSelect').value;

    // 3. Formatage du nom de la photo
    const nomPhoto = photoIndexSelection.toString().padStart(2, '0') + ".png";

    // 4. Initialisation de l'objet personnage
    // NOTE : On définit "perso" (sans le let) car c'est ta variable globale
    perso = {
        nom: nom,
        race: rKey,
        sexe: sexe,
        photo: nomPhoto, 
        antecedent: bgName,
        niveau: 1,
        pointsDispo: 5,
        argent: (bg.mod && bg.mod.argent !== undefined) ? bg.mod.argent : 400,
        boostVitesseInne: (bg.mod && bg.mod.vitesse) ? bg.mod.vitesse : 0,
        boostPV: 0, 
        boostFT: 0,
        statsBase: JSON.parse(JSON.stringify(statsCalculees)), 
        statsInvesties: { FO: 0, IN: 0, CN: 0, DX: 0, CH: 0 },
        compInvesties: {}, 
        compBase: {},
        magieInvesties: {},
        techInvesties: {},
        bonusInnes: {
            align: (race.mod.align || 0) + (bg.mod.align || 0),
            resPhys: (race.mod.resPhys || 0) + (bg.mod.resPhys || 0),
            resPoison: (race.mod.resPoison || 0) + (bg.mod.resPoison || 0),
            resMagie: (race.mod.resMagie || 0) + (bg.mod.resMagie || 0), 
            resFeu: (race.mod.resFeu || 0) + (bg.mod.resFeu || 0),             
            resElec: (race.mod.resElec || 0) + (bg.mod.resElec || 0)      
        },
        inventaire: [],
        equipement: {
            tete: null, torse: null, gants: null, bottes: null, 
            anneau: null, amulette: null, main_droite: null, main_gauche: null
        },
        lieuActuel: "crash",
        lieuxConnus: ["crash"],
        estMort: false // On s'assure qu'il est bien vivant !
    };

    // --- GESTION DE L'ÉQUIPEMENT DE DÉPART ---
    let idVetementTorse = (sexe === 'F') ? "ARM_ROBE" : "ARM_TISSU";
    if (rKey === "Bedokien" || bgName === "Ogre des montagnes") {
        idVetementTorse = null; 
    }

    if (bg.mod && bg.mod.items) {
        bg.mod.items.forEach(itemBg => {
            if (itemsData[itemBg.id]) {
                if (itemsData[itemBg.id].equipable === "torse") {
                    idVetementTorse = itemBg.id;
                } else {
                    perso.inventaire.push({
                        id: itemBg.id,
                        quantite: itemBg.qte,
                        durabilite: itemsData[itemBg.id].durabiliteMax || 100,
                        durabiliteMax: itemsData[itemBg.id].durabiliteMax || 100
                    });
                }
            }
        });
    }

    if (idVetementTorse && itemsData[idVetementTorse]) {
        perso.equipement.torse = {
            id: idVetementTorse,
            quantite: 1,
            durabilite: itemsData[idVetementTorse].durabiliteMax || 100,
            durabiliteMax: itemsData[idVetementTorse].durabiliteMax || 100
        };
    }

    // 5. Application des bonus de compétences
    const appliquerComp = (source) => {
        if (!source) return;
        if (source.bonusComp) {
            for (let id in source.bonusComp) {
                perso.compBase[id] = (perso.compBase[id] || 0) + source.bonusComp[id];
                perso.compInvesties[id] = (perso.compInvesties[id] || 0) + source.bonusComp[id];
            }
        }
    };
    appliquerComp(race.mod);
    appliquerComp(bg.mod);

    // 6. Application des maîtrises Magie/Tech
    const ajouterPointsInit = (source) => {
        if (source && source.techInit) {
            for (let discipline in source.techInit) {
                perso.techInvesties[discipline] = (perso.techInvesties[discipline] || 0) + source.techInit[discipline];
            }
        }
        if (source && source.magieInit) {
            for (let ecole in source.magieInit) {
                perso.magieInvesties[ecole] = (perso.magieInvesties[ecole] || 0) + source.magieInit[ecole];
            }
        }
    };
    ajouterPointsInit(race.mod);
    ajouterPointsInit(bg.mod);

    // ========================================================
    // --- 7. INITIALISATION DES POINTS DE VIE ET FATIGUE ---
    // ========================================================
    const maxPV = (perso.statsBase.FO * 2) + (perso.statsBase.IN) + (perso.boostPV || 0);
    const maxFT = (perso.statsBase.CN * 2) + (perso.statsBase.IN) + (perso.boostFT || 0);
    
    // On assigne les valeurs de départ pour éviter le "undefined"
    perso.pvActuel = maxPV;
    perso.ftActuel = maxFT;
    // ========================================================

    // Musique du lieu
    if (lieuxDecouverts["crash"] && lieuxDecouverts["crash"].musique) {
        AudioEngine.jouerMusique(lieuxDecouverts["crash"].musique);
    }

    // 8. Sauvegarde finale
    localStorage.setItem('arcanum_sauvegarde', JSON.stringify(perso));
    
    // Mettre à jour l'objet global pour le multijoueur
    window.perso = perso;

    cacherTout();
    document.getElementById('ecran-fiche').style.display = 'block';
    
    // On synchronise avec Firebase immédiatement
    if (typeof synchroniserJoueur === 'function') synchroniserJoueur();

    updateFicheUI();
    if (typeof rafraichirAccueil === 'function') rafraichirAccueil();
    appliquerFondActuel();
}
function nouveauPersonnage() {
	
// --- FORCE L'ACCÈS À LA VARIABLE GLOBALE ---
    if (typeof perso === 'undefined') {
        if (window.perso) {
            perso = window.perso;
        } else {
            window.perso = {};
            perso = window.perso;
        }
    }

    // Ton code de musique (attention à la casse du nom de fichier !)
    if (typeof AudioEngine !== 'undefined') {
        AudioEngine.jouerMusique('Arcanum.mp3'); 
    }

    // 1. Sécurité anti-écrasement
    if (perso && perso.nom && perso.nom !== "Nom du Personnage" && perso.nom !== "") {
        if (!confirm("Attention : Créer un nouveau personnage effacera votre progression. Continuer ?")) {
            return;
        }
    }

    // 2. Réinitialisation complète des données (Inventaire, Argent, Equipement)
    perso = {
        nom: "Nom du Personnage",
        race: "Humain",
        background: "Aucun",
        statsBase: { FO: 8, IN: 8, CN: 8, DX: 8, CH: 8 },
        statsInvesties: { FO: 0, IN: 0, CN: 0, DX: 0, CH: 0 },
        pointsDeCompetence: 5,
        niveau: 1,
        experience: 0,
        argent: 400,
		photo: "01.png", // Par défaut la première
        inventaire: [], // On vide le sac proprement
        equipement: { tete: null, torse: null, gants: null, bottes: null, anneau: null, amulette: null, main_droite: null, main_gauche: null },
		lieuActuel: "crash", // Lieu de départ
		lieuxConnus: ["crash"] // <-- AJOUTE CETTE LIGNE ICI

    };

    // 3. Affichage de l'écran de création
    cacherTout();
    let ecranCrea = document.getElementById('ecran-creation');
    if (ecranCrea) ecranCrea.style.display = 'block';
    
    // On vide le champ texte du nom
    let inputNom = document.getElementById('charName');
    if (inputNom) inputNom.value = "";
    
    // 4. On lance le calcul des stats de départ (Race + BG)
    if (typeof buildChar === "function") buildChar(); 
    if (typeof rafraichirAccueil === "function") rafraichirAccueil();
}


// Variable temporaire pour stocker l'index pendant la création
let photoIndexSelection = 1;

function changerPhotoSelection(direction) {
    photoIndexSelection += direction;

    // 1. Si on dépasse vers le haut (ex: clic droit sur 04 alors qu'il n'y a pas de 05)
    // On met une limite haute arbitraire (10), le testImg.onerror s'occupera de revenir à 01
    if (photoIndexSelection > 10) {
        photoIndexSelection = 1;
        rafraichirApercuAvatar();
        return;
    }

    // 2. Si on recule sous la 01 (clic gauche sur la 01)
    if (photoIndexSelection < 1) {
        // On va chercher la dernière image possible (on teste à partir de 04)
        trouverDerniereImage(4); 
        return;
    }

    rafraichirApercuAvatar();
}



// Fonction utilitaire pour trouver la dernière image existante dans le dossier
function trouverDerniereImage(indexTest) {
    const raceSelect = document.getElementById('raceSelect');
    const sexeSelect = document.getElementById('sexeSelect');
    if (!raceSelect || !sexeSelect) return;

    let raceDossier = raceSelect.value.toLowerCase().replace(/\s+/g, '');
    let sexePath = (raceSelect.value !== "Bedokien") ? (sexeSelect.value === 'F' ? "Femme/" : "Homme/") : "";
    
    let nomFichier = indexTest.toString().padStart(2, '0') + ".png";
    let cheminTest = `./docs/img/portraits/${raceDossier}/${sexePath}${nomFichier}`;

    let img = new Image();
    img.src = cheminComplet = encodeURI(cheminTest);

    img.onload = function() {
        // L'image existe ! C'est donc notre "dernière" (ou on a trouvé la fin)
        photoIndexSelection = indexTest;
        rafraichirApercuAvatar();
    };

    img.onerror = function() {
        // L'image n'existe pas (ex: pas de 04.png), on tente la 03.png
        if (indexTest > 1) {
            trouverDerniereImage(indexTest - 1);
        } else {
            photoIndexSelection = 1;
            rafraichirApercuAvatar();
        }
    };
}



function changerPhoto(direction) {
    // On suppose que tu as 3 photos par race pour l'instant
    let num = parseInt(perso.photo.replace('px', '').replace('.png', ''));
    num += direction;
    if (num > 3) num = 1;
    if (num < 1) num = 3;
    
  //  perso.photo = "px" + num + ".png";
    
    // Si on est sur l'écran de création, on rafraîchit l'aperçu
    let apercu = document.getElementById('apercu-photo-creation');
    if (apercu) {
        let dossierRace = document.getElementById('raceSelect').value.toLowerCase();
        apercu.src = `./docs/img/portraits/${dossierRace}/${perso.photo}`;
    }
}

function rafraichirApercuAvatar() {
    const img = document.getElementById('apercu-photo-creation');
    const raceSelect = document.getElementById('raceSelect');
    const sexeSelect = document.getElementById('sexeSelect');
    
    if (!img || !raceSelect || !sexeSelect) return;

    let raceNom = raceSelect.value;
    let raceDossier = raceNom.toLowerCase().replace(/\s+/g, '');
    let sexeVal = sexeSelect.value; // "M" ou "F"
    let sexePath = "";

    // Exception pour les Bedokiens (pas de sous-dossier Homme/Femme)
    if (raceNom !== "Bedokien") {
        sexePath = (sexeVal === 'F') ? "Femme/" : "Homme/";
    }

    // On prépare le nom du fichier (ex: 01.png)
    let nomFichier = photoIndexSelection.toString().padStart(2, '0') + ".png";
    let cheminComplet = `./docs/img/portraits/${raceDossier}/${sexePath}${nomFichier}`;

    // --- TEST DE L'IMAGE ---
    let testImg = new Image();
    testImg.src = cheminComplet;
    
    testImg.onload = function() {
        // L'image existe : on l'affiche
        img.src = cheminComplet;
        // On stocke le nom dans l'objet perso temporaire
        if (typeof perso !== 'undefined' && perso) perso.photo = nomFichier;
    };
    
    testImg.onerror = function() {
        // L'image n'existe pas (ex: on a demandé 05.png alors qu'il n'y en a que 4)
        if (photoIndexSelection > 1) {
            photoIndexSelection = 1; // On boucle vers la 1ère
            rafraichirApercuAvatar();
        } else {
            // Si même la 01.png n'existe pas, on met un placeholder
            img.src = "./docs/img/portraits/placeholder.png"; 
        }
    };
}

// Fonction appelée quand on change de Race ou de Sexe
function resetEtRafraichir() {
    photoIndexSelection = 1; // On revient à la première photo
    rafraichirApercuAvatar();
}
