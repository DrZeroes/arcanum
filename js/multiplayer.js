// ==========================================
// 1. CONFIGURATION FIREBASE
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyAOc0iR-fwgJlKoCqrLx2DsQFD3ZZHGaFw",
  authDomain: "arcanumrp-multiplayer.firebaseapp.com",
  databaseURL: "https://arcanumrp-multiplayer-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "arcanumrp-multiplayer",
  storageBucket: "arcanumrp-multiplayer.firebasestorage.app",
  messagingSenderId: "408880817048",
  appId: "1:408880817048:web:4180a3fce4b412b5c541ed"
};

// Initialisation de Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// ==========================================
// 2. VARIABLES GLOBALES MJ
// ==========================================
let sessionActuelle = "session1";

function updateSessionName() {
    const input = document.getElementById('input-session');
    if (input && input.value.trim() !== "") {
        sessionActuelle = input.value.trim().replace(/[^a-zA-Z0-9]/g, "_");
    }
}

// ==========================================
// 3. SYNCHRONISATION DU JOUEUR (ENVOI)
// ==========================================
function synchroniserJoueur() {
    if (!perso || !perso.nom || perso.nom === "Nom du Personnage") return;
    
    updateSessionName(); 
    const playerID = perso.nom.replace(/\s+/g, '_');
    
    // On calcule le MAX
    const maxPV = (perso.statsBase.FO * 2) + (perso.statsBase.IN) + (perso.boostPV || 0);
    const maxFT = (perso.statsBase.CN * 2) + (perso.statsBase.IN) + (perso.boostFT || 0);

    // Si les PV actuels n'existent pas encore (nouveau perso), on les met au max
    if (perso.pvActuel === undefined) perso.pvActuel = maxPV;
    if (perso.ftActuel === undefined) perso.ftActuel = maxFT;

    db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID).set({
        nom: perso.nom,
        pvActuel: perso.pvActuel,
        pvMax: maxPV,
        ftActuel: perso.ftActuel,
        ftMax: maxFT,
        niveau: perso.niveau,
        lieu: perso.lieuActuel,
		estMort: perso.estMort || false, // <-- NOUVELLE LIGNE ICI
        lastUpdate: Date.now()
    });
}



// ==========================================
// 4. ECOUTEURS DU JOUEUR (RECEPTION)
// ==========================================

// Le joueur écoute si le MJ change la musique
db.ref('parties/' + sessionActuelle + '/musique_mj').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data && data.fichier) {
        if (typeof AudioEngine !== 'undefined') {
            AudioEngine.jouerMusique(data.fichier);
        }
    }
});

// Le joueur écoute s'il reçoit un cadeau
function activerEcouteurCadeaux() {
    if (!perso || !perso.nom) return;
    const playerID = perso.nom.replace(/\s+/g, '_');

    db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/cadeau').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data && data.id) {
            const nomObjet = (typeof itemsData !== 'undefined' && itemsData[data.id]) ? itemsData[data.id].nom : data.id;
            
            if (typeof ramasserItem === "function") {
                ramasserItem(data.id, 1);
            } else {
                if (!perso.inventaire) perso.inventaire = [];
                perso.inventaire.push({ id: data.id, quantite: 1 });
            }

            if (typeof updateInventaireUI === "function") updateInventaireUI();
// On vérifie qui a envoyé (Un joueur, ou le MJ par défaut)
            let nomExpediteur = data.expediteur ? data.expediteur : "Le Maître du Jeu";
            
            alert(`🎁 ${nomExpediteur} vous a donné : ${nomObjet}`);            
            db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/cadeau').remove();
            if (typeof autoSave === "function") autoSave();
        }
    });
}

// Le joueur écoute s'il y a une alerte MJ
db.ref('parties/' + sessionActuelle + '/alerte_mj').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data && data.texte) {
        alert("📢 MESSAGE DU MJ : \n\n" + data.texte);
    }
});


// ==========================================
// 5. FONCTIONS DU MAITRE DU JEU (INTERFACE)
// ==========================================
function ouvrirInterfaceMJ() {
    updateSessionName(); 
    if (typeof cacherTout === "function") cacherTout();
    
    const ecranMj = document.getElementById('ecran-mj');
    if (ecranMj) ecranMj.style.display = 'block';

    db.ref('parties/' + sessionActuelle + '/joueurs').on('value', (snapshot) => {
        const joueurs = snapshot.val();
        const container = document.getElementById('liste-joueurs-mj');
        if (!container) return;

        container.innerHTML = ""; 

        if (!joueurs) {
            container.innerHTML = `<p style='color:#666; text-align:center;'>Aucun joueur dans le groupe : <b>${sessionActuelle}</b></p>`;
            return;
        }

        // --- C'EST ICI QUE 'j' EST DÉCLARÉ POUR CHAQUE JOUEUR ---
        for (let id in joueurs) {
            const j = joueurs[id]; 
            
            // Calcul des PV et FT (Actuels et Max)
            const pvActuel = j.pvActuel !== undefined ? j.pvActuel : (j.pv || 0);
            const pvMax = j.pvMax || j.pv || 1;
            const ftActuel = j.ftActuel !== undefined ? j.ftActuel : (j.ft || 0);
            const ftMax = j.ftMax || j.ft || 1;

            const ratioPV = (pvActuel / pvMax) * 100;
            const couleurVie = ratioPV > 50 ? "#4caf50" : "#f44336";

            container.innerHTML += `
                <div style="background: #222; border: 2px solid #444; padding: 15px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 10px;">
                        <strong style="color: #ff9800; font-size: 1.2em;">${j.nom}</strong>
                        <span style="background:#333; padding: 2px 8px; border-radius: 4px; font-size: 0.8em;">Niv. ${j.niveau || 1}</span>
                    </div>
                    <div style="display: grid; gap: 8px;">
                        <div style="color: ${couleurVie}; font-weight: bold;">❤️ PV : ${pvActuel} / ${pvMax}</div>
                        <div style="color: #2196f3;">⚡ FT : ${ftActuel} / ${ftMax}</div>
                        <div style="color: #aaa; font-size: 0.8em; font-style: italic;">📍 Lieu : ${j.lieu || "Inconnu"}</div>
                    </div>
                    
                    <div style="margin-top:15px; display:flex; gap:5px; border-top: 1px solid #333; padding-top: 10px;">
                        <button onclick="mjDonnerObjet('${id}')" style="background:#4caf50; color:white; border:none; padding:5px; flex:1; cursor:pointer; border-radius:3px;">🎁 Cadeau</button>
                        <button onclick="mjModifierStat('${id}', 'PV')" style="background:#e91e63; color:white; border:none; padding:5px; flex:1; cursor:pointer; border-radius:3px;">❤️ Dégât/Soin</button>
                        <button onclick="mjModifierStat('${id}', 'FT')" style="background:#2196f3; color:white; border:none; padding:5px; flex:1; cursor:pointer; border-radius:3px;">⚡ Fatigue</button>
                    </div>
                </div>
            `;
        }
    });
}



// Le MJ envoie la demande de modification (ex: +5 ou -10)
function mjModifierStat(playerID, typeStat) {
    let valeur = prompt(`Modif. ${typeStat} (Tapez -5 pour blesser, 5 pour soigner) :`);
    if (!valeur || isNaN(valeur)) return; 
    
    db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/modif_stat').set({
        stat: typeStat,
        valeur: parseInt(valeur),
        timestamp: Date.now()
    });
}

// Le JOUEUR écoute les modifications envoyées par le MJ
// ==========================================
// ÉCOUTEUR : RÉCEPTION DES DÉGÂTS ET SOINS 🛰️
// ==========================================
function activerEcouteurStats() {
    if (!perso || !perso.nom || perso.nom === "Nom du Personnage") return;

    const playerID = perso.nom.replace(/\s+/g, '_');
    const modifRef = db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/modif_stat');

    modifRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (!data) return; 

        const maxPV = (perso.statsBase.FO * 2) + (perso.statsBase.IN) + (perso.boostPV || 0);
        const maxFT = (perso.statsBase.CN * 2) + (perso.statsBase.IN) + (perso.boostFT || 0);

        if (data.stat === 'PV') {
            perso.pvActuel = (perso.pvActuel || maxPV) + data.valeur;
            perso.pvActuel = Math.min(maxPV, Math.max(0, perso.pvActuel));
            
            alert(data.valeur > 0 ? `✨ Soin reçu : +${data.valeur} PV` : `💥 Dégâts subis : ${Math.abs(data.valeur)} PV`);
            
            if (typeof verifierMort === 'function') verifierMort();

        } else if (data.stat === 'FT') {
            perso.ftActuel = (perso.ftActuel || maxFT) + data.valeur;
            perso.ftActuel = Math.min(maxFT, Math.max(0, perso.ftActuel));
            alert(data.valeur > 0 ? `🔋 Regain : +${data.valeur} FT` : `💨 Fatigue : ${Math.abs(data.valeur)} FT`);
        }

        // Nettoyage Firebase pour éviter les boucles
        modifRef.remove();
        
        if (typeof autoSave === 'function') autoSave();
        if (typeof rafraichirAccueil === 'function') rafraichirAccueil();
        if (typeof updateFicheUI === 'function') updateFicheUI();
    });
}



function fermerInterfaceMJ() {
    db.ref('parties/' + sessionActuelle + '/joueurs').off();
    if (typeof cacherTout === "function") cacherTout();
    if (typeof allerAccueil === "function") allerAccueil();
}

// ==========================================
// 6. POUVOIRS DU MAITRE DU JEU
// ==========================================
function mjChangerMusique(nomFichier) {
    updateSessionName();
    db.ref('parties/' + sessionActuelle + '/musique_mj').set({
        fichier: nomFichier,
        timestamp: Date.now()
    });
}

function mjDonnerObjet(playerID) {
    let itemID = prompt("ID de l'objet (ex: AM01 ou epee_longue) :");
    if (!itemID) return; 
    itemID = itemID.trim();

    if (typeof itemsData !== 'undefined' && itemsData[itemID]) {
        db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/cadeau').set({
            id: itemID,
            timestamp: Date.now()
        });
        alert("✅ Objet envoyé avec succès !");
    } else {
        alert("❌ Erreur : L'ID '" + itemID + "' n'existe pas dans items.js");
    }
}

function mjEnvoyerAlerte() {
    let message = prompt("Entrez le message à afficher aux joueurs :");
    if (message && message.trim() !== "") {
        db.ref('parties/' + sessionActuelle + '/alerte_mj').set({
            texte: message,
            timestamp: Date.now()
        });
    }
}

function mjModifierPV(playerID, modificateur) {
    const ref = db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/pv');
    ref.transaction((currentPV) => {
        return (currentPV || 0) + modificateur;
    });
}


// Variable pour se souvenir de la dernière alerte et ne pas la répéter en boucle
let derniereAlerteVue = Date.now(); 


// ==========================================
// 7. INTERACTIONS ENTRE JOUEURS (P2P)
// ==========================================

// 1. VOIR LES ALLIÉS
function ouvrirEcranGroupe() {
    updateSessionName();
    if (typeof cacherTout === "function") cacherTout();
    document.getElementById('ecran-groupe').style.display = 'block';

    const moiID = perso.nom.replace(/\s+/g, '_');

    db.ref('parties/' + sessionActuelle + '/joueurs').on('value', (snapshot) => {
        const joueurs = snapshot.val();
        const container = document.getElementById('affichage-alliés');
        if (!container) return;

        container.innerHTML = "";
        let aDesAllies = false;

        for (let id in joueurs) {
            // On affiche les autres (on ne s'affiche pas soi-même dans "Alliés")
            if (id !== moiID) {
                aDesAllies = true;
                const j = joueurs[id];
                const pvMax = j.pvMax || j.pv;
                const pvActuel = j.pvActuel !== undefined ? j.pvActuel : j.pv;
                
                container.innerHTML += `
                    <div style="background: #222; border: 1px solid #444; padding: 15px; border-radius: 8px;">
                        <strong style="color: #ff9800; font-size: 1.1em;">${j.nom}</strong> (Niv. ${j.niveau || 1})<br>
                        <span style="color: ${pvActuel > (pvMax/2) ? '#4caf50' : '#f44336'};">❤️ PV: ${pvActuel} / ${pvMax}</span><br>
                        <span style="color: #aaa; font-size: 0.8em;">📍 ${j.lieu || "Inconnu"}</span>
                    </div>
                `;
            }
        }

        if (!aDesAllies) {
            container.innerHTML = "<p style='color:#888;'>Vous êtes le seul joueur en ligne pour le moment.</p>";
        }
    });
}

// 2. PRÉPARER L'ENVOI D'UN OBJET (Ouvre la fenêtre)
let objetEnCoursDeDon = null;

function preparerDonObjet(idObjet) {
    objetEnCoursDeDon = idObjet;
    const moiID = perso.nom.replace(/\s+/g, '_');

    // On va chercher qui est en ligne
    db.ref('parties/' + sessionActuelle + '/joueurs').once('value', (snapshot) => {
        const joueurs = snapshot.val();
        const liste = document.getElementById('liste-destinataires');
        liste.innerHTML = "";
        let aDesJoueurs = false;

        for (let id in joueurs) {
            if (id !== moiID) {
                aDesJoueurs = true;
                // On crée un bouton pour chaque joueur connecté
                liste.innerHTML += `<button onclick="executerDonObjet('${id}')" style="background:#2196f3; color:white; padding:10px; border:none; border-radius:5px; cursor:pointer;">À ${joueurs[id].nom}</button>`;
            }
        }

        if (!aDesJoueurs) {
            liste.innerHTML = "<p style='color:#aaa;'>Personne d'autre n'est connecté.</p>";
        }

        document.getElementById('modal-transfert').style.display = 'block';
    });
}

// 3. ENVOYER L'OBJET (Retire du sac et envoie)
function executerDonObjet(destinataireID) {
    if (!objetEnCoursDeDon) return;

    // A. On trouve l'objet dans notre inventaire
    let index = perso.inventaire.findIndex(i => i.id === objetEnCoursDeDon);
    
    if (index > -1) {
        // B. On enlève 1 quantité
        perso.inventaire[index].quantite--;
        if (perso.inventaire[index].quantite <= 0) {
            perso.inventaire.splice(index, 1); // On le supprime si y'en a plus
        }

        // C. On envoie le colis via Firebase
        db.ref('parties/' + sessionActuelle + '/joueurs/' + destinataireID + '/cadeau').set({
            id: objetEnCoursDeDon,
            expediteur: perso.nom, // <--- On dit de qui ça vient !
            timestamp: Date.now()
        });

        // D. On nettoie
        document.getElementById('modal-transfert').style.display = 'none';
        alert("✅ Objet envoyé avec succès !");
        
        if (typeof updateInventaireUI === 'function') updateInventaireUI();
        if (typeof autoSave === 'function') autoSave();
    }
}


// --- DÉPLACEMENT DE GROUPE ---

// 1. Fonction pour demander le déplacement de TOUT le groupe
function deplacerToutLeGroupe(idLieu) {
    updateSessionName();
    
    // 1. ON SE DÉPLACE SOI-MÊME D'ABORD (Localement)
    console.log("🚀 Départ local vers : " + idLieu);
    
    // On met à jour notre perso
    perso.lieuActuel = idLieu;
    
    // On récupère les infos du lieu pour la musique et le fond
    let lieuInfos = (typeof lieuxDecouverts !== 'undefined' && lieuxDecouverts[idLieu]) ? lieuxDecouverts[idLieu] : null;
    
    if (lieuInfos) {
        if (lieuInfos.musique && typeof AudioEngine !== 'undefined') AudioEngine.jouerMusique(lieuInfos.musique);
        if (lieuInfos.fond) document.body.style.backgroundImage = `url('./docs/img/fonds/${lieuInfos.fond}')`;
    }

    // On sauvegarde et on rafraîchit l'accueil
    if (typeof autoSave === "function") autoSave();
    if (typeof rafraichirAccueil === "function") rafraichirAccueil();
    if (typeof allerAccueil === "function") allerAccueil();

    // 2. ON ENVOIE L'ORDRE AUX AUTRES (Firebase)
    db.ref('parties/' + sessionActuelle + '/lieu_groupe').set({
        id: idLieu,
        timestamp: Date.now(),
        lancePar: perso.nom
    });
}


// 2. Antenne qui écoute le changement de lieu du groupe
function activerEcouteurDeplacementGroupe() {
    updateSessionName();
    
    db.ref('parties/' + sessionActuelle + '/lieu_groupe').on('value', (snapshot) => {
        const data = snapshot.val();
        
        // Sécurité : on ne bouge que si l'ID est valide et différent du nôtre
        if (data && data.id && data.id !== perso.lieuActuel) {
            
            // 1. CHANGER LA VARIABLE DE LIEU
            perso.lieuActuel = data.id;

            // 2. CHERCHER LES INFOS DU LIEU (On cherche dans toutes tes listes)
            let lieuInfos = null;
            if (typeof lieuxDecouverts !== 'undefined' && lieuxDecouverts[data.id]) {
                lieuInfos = lieuxDecouverts[data.id];
            } else if (typeof locations !== 'undefined' && locations[data.id]) {
                lieuInfos = locations[data.id];
            }

            // 3. CHANGER LA MUSIQUE
            if (lieuInfos && lieuInfos.musique && typeof AudioEngine !== 'undefined') {
                AudioEngine.jouerMusique(lieuInfos.musique);
            }

            // 4. CHANGER LE FOND D'ÉCRAN
            if (lieuInfos && lieuInfos.fond) {
                document.body.style.backgroundImage = `url('./docs/img/fonds/${lieuInfos.fond}')`;
            }

            // 5. MISE À JOUR DE L'ACCUEIL (Titre et Description)
            // On s'assure que les éléments existent avant d'écrire dedans
            const titre = document.getElementById('lieu-titre');
            const desc = document.getElementById('lieu-desc');
            if (titre && lieuInfos) titre.innerText = lieuInfos.nom;
            if (desc && lieuInfos) desc.innerText = lieuInfos.desc;

            // 6. FORCER LE RETOUR À L'ACCUEIL (Ferme la carte, le grimoire, etc.)
            if (typeof cacherTout === "function") cacherTout();
            
            const ecranAccueil = document.getElementById('ecran-accueil');
            if (ecranAccueil) {
                ecranAccueil.style.display = 'block';
                // On recalcule les PV/FT sur l'accueil
                if (typeof rafraichirAccueil === "function") rafraichirAccueil();
            }

            // 7. SAUVEGARDE LOCALE
            localStorage.setItem('arcanum_sauvegarde', JSON.stringify(perso));
            
            console.log("📍 Groupe synchronisé sur : " + data.id);
        }
    });
}

// 1. Envoyer la découverte d'un lieu à tout le groupe
function partagerDecouverte(idLieu) {
    updateSessionName();
    // On ajoute le lieu dans un dossier "lieux_decouverts" sur Firebase
    db.ref('parties/' + sessionActuelle + '/lieux_shared/' + idLieu).set({
        nom: idLieu,
        decouvertPar: perso.nom,
        timestamp: Date.now()
    });
}

// 2. Écouter les nouvelles découvertes des autres
function activerEcouteurPartageLieux() {
    updateSessionName();
    
    // On écoute les découvertes du groupe
    db.ref('parties/' + sessionActuelle + '/lieux_shared').on('child_added', (snapshot) => {
        const idLieu = snapshot.key;
        
        // SÉCURITÉ : On vérifie si on a un perso et si la liste existe
        if (!perso) return;
        if (!perso.lieuxConnus) perso.lieuxConnus = [];

        // SI ON NE CONNAIT PAS LE LIEU : On l'ajoute discrètement
        if (!perso.lieuxConnus.includes(idLieu)) {
            perso.lieuxConnus.push(idLieu);
            
            // On sauvegarde et on rafraîchit la carte si elle est ouverte
            if (typeof autoSave === "function") autoSave();
            
            if (document.getElementById('ecran-carte').style.display === 'block') {
                if (typeof rafraichirPointsCarte === "function") rafraichirPointsCarte();
            }
            
            console.log("📍 Nouveau lieu synchronisé avec le groupe : " + idLieu);
        } 
        // SI ON LE CONNAIT DÉJÀ : On ne fait strictement RIEN (pas d'alerte !)
    });
}



function activerRadarGroupeAccueil(modeCiblage = false) {
    if (!sessionActuelle) return;

    db.ref('parties/' + sessionActuelle + '/joueurs').on('value', (snapshot) => {
        const joueurs = snapshot.val();
        const container = document.getElementById('liste-membres-accueil');
        const zoneGroupe = document.getElementById('accueil-groupe-liste');
        
        if (!container || !joueurs) return;
        container.innerHTML = "";
        let count = 0;

        for (let id in joueurs) {
            let j = joueurs[id];
            if (j.nom !== perso.nom && j.lieu === perso.lieuActuel) {
                count++;
                
                // Si on est en train d'utiliser un objet (Réanimateur/Soin)
                let boutonCible = "";
                if (modeCiblage) {
                    boutonCible = `<button onclick="finaliserActionObjet('${id}', '${j.nom}')" style="margin-left:10px; background:#ff9800; border:none; color:white; border-radius:3px; cursor:pointer;">🎯 Utiliser</button>`;
                }

                container.innerHTML += `
                    <div style="background: rgba(76, 175, 80, 0.1); border: 1px solid #4caf50; padding: 5px 10px; border-radius: 15px; font-size: 0.8em; color: #fff; display: flex; align-items: center; margin-bottom: 5px;">
                        <span style="color: ${j.estMort ? '#f44336' : '#4caf50'};">●</span> 
                        ${j.nom} ${j.estMort ? '(MORT)' : ''} 
                        ${boutonCible}
                    </div>
                `;
            }
        }
        if (zoneGroupe) zoneGroupe.style.display = (count > 0) ? "block" : "none";
    });
}

// Fonction pour lancer tout le moteur multijoueur d'un coup
function demarrerMoteurMulti() {
    if (!perso || !perso.nom || perso.nom === "Nom du Personnage") return;
    
    console.log("🌐 Initialisation du mode multijoueur...");

    // 1. On s'annonce immédiatement
    if (typeof synchroniserJoueur === "function") synchroniserJoueur();

    // 2. On active toutes les écoutes (les "antennes")
    if (typeof activerEcouteurCadeaux === "function") activerEcouteurCadeaux();
    if (typeof activerEcouteurAlertes === "function") activerEcouteurAlertes();
    if (typeof activerEcouteurStats === "function") activerEcouteurStats();
    if (typeof activerEcouteurDeplacementGroupe === "function") activerEcouteurDeplacementGroupe();
    if (typeof activerEcouteurPartageLieux === "function") activerEcouteurPartageLieux();
    if (typeof activerRadarGroupeAccueil === "function") activerRadarGroupeAccueil();
}





