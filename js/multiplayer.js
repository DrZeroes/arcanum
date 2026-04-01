// ==========================================
// 1. DÉCLARATION DES VARIABLES GLOBALES
// ==========================================
let sessionActuelle = localStorage.getItem('arcanum_session_name') || "session1";
let db;
let derniereAlerteVue = Date.now(); 

// ==========================================
// 2. CONFIGURATION ET INITIALISATION FIREBASE
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

// Initialisation de Firebase (On le fait AVANT l'Auth)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
db = firebase.database();

// --- AUTHENTIFICATION SILENCIEUSE (Adaptée pour le local) ---
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log("🔐 Authentifié avec l'ID :", user.uid);
        window.userUID = user.uid;
        // On lance le moteur une fois l'ID obtenu
        if (typeof demarrerMoteurMulti === "function") demarrerMoteurMulti();
    } else {
        firebase.auth().signInAnonymously()
            .catch((error) => {
                // On affiche un simple message au lieu d'une erreur bloquante
                console.warn("⚠️ Mode Local détecté : Connexion Firebase anonyme impossible (Referer Null).");
                
                // --- SOLUTION DE SECOURS ---
                // On génère un ID temporaire basé sur le nom du perso ou un random
                window.userUID = "Guest_" + Math.floor(Math.random() * 1000);
                console.log("🛠️ Utilisation d'un ID de secours :", window.userUID);
                
                // On force le démarrage du moteur malgré l'échec d'auth
                if (typeof demarrerMoteurMulti === "function") demarrerMoteurMulti();
            });
    }
});

// ==========================================
// 3. LOGIQUE DE SESSION ET SYNCHRONISATION
// ==========================================
function updateSessionName() {
    const input = document.getElementById('input-session');
    if (input && input.value.trim() !== "") {
        sessionActuelle = input.value.trim().replace(/[^a-zA-Z0-9]/g, "_");
        localStorage.setItem('arcanum_session_name', sessionActuelle);
    }
}

function synchroniserJoueur() {
    if (!window.perso || !window.perso.nom || window.perso.nom === "Nom du Personnage") return;
    if (!window.userUID) return; 

    const playerID = window.perso.nom.replace(/\s+/g, '_');
    
    const dataSync = {
        nom: window.perso.nom,
        ownerID: window.userUID, // ✨ L'ID de sécurité pour tes futures règles
        pvActuel: window.perso.pvActuel,
        pvMax: (window.perso.statsBase.FO * 2) + (window.perso.statsBase.IN) + (window.perso.boostPV || 0),
        ftActuel: window.perso.ftActuel,
        ftMax: (window.perso.statsBase.CN * 2) + (window.perso.statsBase.IN) + (window.perso.boostFT || 0),
        niveau: window.perso.niveau || 1,
        lieu: (typeof lieuxDecouverts !== 'undefined' && lieuxDecouverts[window.perso.lieuActuel]) ? lieuxDecouverts[window.perso.lieuActuel].nom : "Inconnu",
        estMort: window.perso.estMort || false,
        timestamp: Date.now()
    };

    db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID).update(dataSync);
}

// ==========================================
// 4. ÉCOUTEURS DU JOUEUR (ANTENNES)
// ==========================================

function activerEcouteurMusiqueMJ() {
    console.log("🎵 [AUDIO] Activation de l'antenne Musique MJ...");
    const musicRef = db.ref('parties/' + sessionActuelle + '/musique_mj');
    
    musicRef.off(); // Nettoyage des anciens écouteurs
    musicRef.on('value', (snapshot) => {
        const data = snapshot.val();
        
        // --- SÉCURITÉ MORT : SILENCE TOTAL ---
        if (window.perso.estMort || window.perso.pvActuel <= 0) {
            console.log("🔇 [AUDIO] Personnage mort : arrêt de la musique.");
            if (typeof AudioEngine !== 'undefined') {
                AudioEngine.stopMusique(); 
            }
            return; // On ignore les ordres du MJ et la musique de lieu
        }

        // --- LOGIQUE POUR LES VIVANTS ---
        if (data && data.fichier) {
            console.log("🔊 [MJ] Nouvelle piste reçue : " + data.fichier);
            if (typeof AudioEngine !== 'undefined') {
                AudioEngine.jouerMusique(data.fichier);
            }
        } else {
            // Musique par défaut du lieu si le MJ ne diffuse rien
            const lieuId = window.perso.lieuActuel || "crash";
            const lieuData = (typeof lieuxDecouverts !== 'undefined') ? lieuxDecouverts[lieuId] : null;
            
            if (lieuData && lieuData.musique) {
                console.log("🏞️ [AUDIO] Musique d'ambiance du lieu : " + lieuData.musique);
                if (typeof AudioEngine !== 'undefined') {
                    AudioEngine.jouerMusique(lieuData.musique);
                }
            }
        }
    });
}



function activerEcouteurCadeaux() {
    if (!window.perso || !window.perso.nom) return;
    const playerID = window.perso.nom.replace(/\s+/g, '_');
    const cadeauRef = db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/cadeau');

    console.log("🎁 [DEBUG] Antenne Cadeaux activée pour : " + playerID);

    // On coupe l'ancien écouteur pour éviter les accumulations de fonctions
    cadeauRef.off(); 

    cadeauRef.on('value', (snapshot) => {
        const data = snapshot.val();
        
        // Si pas de données ou si le cadeau est déjà en cours de traitement, on stop
        if (!data || !data.id) return;

        console.log(`%c 🎁 [MULTI] Cadeau reçu : ${data.id} (x${data.qte || 1})`, "color: #ff9800; font-weight: bold;");

        // --- SÉCURITÉ ANTI-DOUBLON : ON SUPPRIME AVANT TOUTE ACTION ---
        cadeauRef.remove().then(() => {
            const quantiteRecue = parseInt(data.qte) || 1;
            const nomObjet = (typeof itemsData !== 'undefined' && itemsData[data.id]) ? itemsData[data.id].nom : data.id;

            // Ajout à l'inventaire via ta fonction existante
            if (typeof ramasserItem === "function") {
                ramasserItem(data.id, quantiteRecue);
            } else {
                // Logique de secours si ramasserItem n'est pas chargée
                let inv = window.perso.inventaire || [];
                let existant = inv.find(i => i.id === data.id);
                if (existant && itemsData[data.id]?.stackable) {
                    existant.quantite = (existant.quantite || 0) + quantiteRecue;
                } else {
                    inv.push({ id: data.id, quantite: quantiteRecue });
                }
                window.perso.inventaire = inv;
            }

            // Notifications et Sauvegardes
            alert(`🎁 ${data.expediteur || "Le MJ"} vous a donné : ${quantiteRecue}x ${nomObjet}`);
            
            if (typeof autoSave === "function") autoSave();
            if (typeof updateInventaireUI === "function") updateInventaireUI();
            
        }).catch(err => console.error("Erreur lors de la réception du cadeau :", err));
    });
}
function activerEcouteurStats() {
    if (!window.perso || !window.perso.nom) return;
    const playerID = window.perso.nom.replace(/\s+/g, '_');
    const modifRef = db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/modif_stat');

    console.log("📡 [DEBUG] Antenne Stats activée pour : " + playerID);

    modifRef.off(); // Nettoyage préventif
    
    // On utilise child_added ou value mais avec une sécurité
    modifRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (!data) return; 

        console.log(`%c ⚡ [MULTI] Stat Reçue : ${data.stat} | Valeur : ${data.valeur}`, "color: #4caf50; font-weight: bold;");

        // ON SUPPRIME IMMEDIATEMENT POUR EVITER LA BOUCLE
        modifRef.remove(); 

        const maxPV = (window.perso.statsBase.FO * 2) + (window.perso.statsBase.IN) + (window.perso.boostPV || 0);
        const maxFT = (window.perso.statsBase.CN * 2) + (window.perso.statsBase.IN) + (window.perso.boostFT || 0);
        
       if (data.stat === 'PV') {
    // UTILISE ?? 0 AU LIEU DE || maxPV
    let basePV = (window.perso.pvActuel !== undefined) ? window.perso.pvActuel : 0;
    window.perso.pvActuel = basePV + data.valeur;
    
    // On plafonne pour ne pas dépasser le max
    window.perso.pvActuel = Math.min(maxPV, Math.max(0, window.perso.pvActuel));
    console.log(`❤️ [DEBUG] PV mis à jour : ${window.perso.pvActuel} / ${maxPV}`);
}
 else if (data.stat === 'FT') {
            window.perso.ftActuel = (window.perso.ftActuel || maxFT) + data.valeur;
            window.perso.ftActuel = Math.min(maxFT, Math.max(0, window.perso.ftActuel));
            console.log(`🔋 Nouveau FT : ${window.perso.ftActuel}/${maxFT}`);
        }

        // --- TRAITEMENT ET UI ---
        if (typeof verifierMort === 'function') verifierMort();
        localStorage.setItem('arcanum_sauvegarde', JSON.stringify(window.perso));
        
        if (typeof rafraichirAccueil === 'function') rafraichirAccueil();
        if (typeof updateFicheUI === 'function') updateFicheUI();
        
        // Alerte visuelle pour le joueur
        const msg = (data.valeur > 0) ? `✨ Gain : +${data.valeur} ${data.stat}` : `💥 Perte : ${data.valeur} ${data.stat}`;
        alert(msg);
    });
}


function activerEcouteurAlertesMJ() {
    db.ref('parties/' + sessionActuelle + '/alerte_mj').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data && data.texte && data.timestamp > derniereAlerteVue) {
            alert("📢 MESSAGE DU MJ : \n\n" + data.texte);
            derniereAlerteVue = data.timestamp;
        }
    });
}


function activerRadarGroupeAccueil(modeCiblage = false) {
    if (!db || !sessionActuelle) return;

    db.ref('parties/' + sessionActuelle + '/joueurs').on('value', (snapshot) => {
        const joueurs = snapshot.val();
        const container = document.getElementById('liste-membres-accueil');
        const zoneGroupe = document.getElementById('accueil-groupe-liste');
        
        // --- SÉCURITÉ : On vérifie si l'élément existe AVANT d'agir ---
        if (!container) return; 
        
        container.innerHTML = "";
        let count = 0;

        if (joueurs && window.perso) {
            for (let id in joueurs) {
                let j = joueurs[id];
                if (j.nom !== window.perso.nom && j.lieu === window.perso.lieuActuel) {
                    count++;
                    container.innerHTML += `
                        <div style="color:#fff; font-size:0.8em; margin-bottom:5px;">
                            <span style="color:${j.estMort ? '#f44336' : '#4caf50'}">●</span> ${j.nom}
                        </div>`;
                }
            }
        }

        // --- SÉCURITÉ : Idem pour la zone parente ---
        if (zoneGroupe) {
            zoneGroupe.style.display = (count > 0) ? "block" : "none";
        }
    });
}

function activerEcouteurDeplacementGroupe() {
    if (!db) return;
    
    db.ref('parties/' + sessionActuelle + '/lieu_groupe').on('value', (snapshot) => {
        const data = snapshot.val();
        // Sécurité : on vérifie que window.perso existe bien
        if (!window.perso) return;

        if (data && data.id && data.id !== window.perso.lieuActuel) {
            window.perso.lieuActuel = data.id;
            
            // Appliquer le décor
            let lieuInfos = (typeof lieuxDecouverts !== 'undefined') ? lieuxDecouverts[data.id] : null;
            if (lieuInfos) {
                if (lieuInfos.musique && typeof AudioEngine !== 'undefined') {
                    db.ref('parties/' + sessionActuelle + '/musique_mj').once('value', (snap) => {
                        if (!snap.exists()) AudioEngine.jouerMusique(lieuInfos.musique);
                    });
                }
                if (lieuInfos.fond) {
                    document.body.style.backgroundImage = `url('./docs/img/fonds/${lieuInfos.fond}')`;
                }
            }

            // --- NAVIGATION SÉCURISÉE ---
            const ecranMj = document.getElementById('ecran-mj');
            const mjEstOuvert = ecranMj && ecranMj.style.display === 'block';

            if (!mjEstOuvert) {
                // On n'appelle cacherTout que si la fonction existe
                if (typeof cacherTout === "function") cacherTout();
                
                const accueil = document.getElementById('ecran-accueil');
                if (accueil) {
                    accueil.style.display = 'block';
                }
                
                // Rafraîchissement sécurisé
                if (typeof rafraichirAccueil === "function") rafraichirAccueil();
            }
            
            // Sauvegarde locale
            localStorage.setItem('arcanum_sauvegarde', JSON.stringify(window.perso));
        }
    });
}

function mjDonnerLevelUp(nomJoueur) {
    if (!nomJoueur) return;
    console.log("🎁 Envoi d'un Level Up à : " + nomJoueur);
    
    // On envoie la commande dans la branche 'commandes' du joueur
    db.ref('parties/' + sessionActuelle + '/commandes/' + nomJoueur).push({
        type: "LEVEL_UP",
        timestamp: Date.now()
    });
}





function activerEcouteurPartageLieux() {
    const refLieux = db.ref('parties/' + sessionActuelle + '/lieux_shared');
    refLieux.on('value', (snapshot) => {
        const data = snapshot.val();
        if (!data || Object.keys(data).length <= 1) {
            window.perso.lieuxConnus = data ? Object.keys(data) : ["crash"];
            if (typeof rafraichirPointsCarte === "function") rafraichirPointsCarte();
        }
    });
    refLieux.on('child_added', (snapshot) => {
        const idLieu = snapshot.key;
        if (!window.perso.lieuxConnus.includes(idLieu)) {
            window.perso.lieuxConnus.push(idLieu);
            if (typeof rafraichirPointsCarte === "function") rafraichirPointsCarte();
        }
    });
}

let verrouLevelUp = false; // Empêche le double déclenchement

function activerEcouteurCommandesMJ() {
    if (!window.perso || !window.perso.nom) return;
    
    const cheminCommandes = 'parties/' + sessionActuelle + '/commandes/' + window.perso.nom;

    db.ref(cheminCommandes).on('child_added', (snapshot) => {
        const cmd = snapshot.val();
        const cmdKey = snapshot.key;

        if (cmd && cmd.type === "LEVEL_UP" && !verrouLevelUp) {
            verrouLevelUp = true; // On ferme le verrou tout de suite

            // 1. On supprime la commande de Firebase IMMÉDIATEMENT
            db.ref(cheminCommandes + '/' + cmdKey).remove();

            console.log("🎊 Level Up reçu !");
            
            // 2. On donne le niveau
            if (typeof levelUp === "function") {
                levelUp(); 
            }
            
            // 3. On affiche le bouton
            const btnLvUp = document.getElementById('btn-lvup-joueur');
            if (btnLvUp) btnLvUp.style.setProperty('display', 'block', 'important');
            
            alert("🌟 Félicitations ! Le MJ vous a fait monter de niveau !");

            // 4. On rouvre le verrou après 2 secondes pour les prochains niveaux
            setTimeout(() => { verrouLevelUp = false; }, 2000);
        } else if (verrouLevelUp) {
            // Si le verrou est actif, on nettoie juste les commandes en doublon sans rien faire
            db.ref(cheminCommandes + '/' + cmdKey).remove();
        }
    });
}





// ==========================================
// 5. FONCTIONS MJ ET INTERACTIONS
// ==========================================

function ouvrirInterfaceMJ() {
    const mdpMJ = prompt("Entrez le mot de passe Maître du Jeu :");
    if (mdpMJ === "") {
        updateSessionName(); 
        if (typeof cacherTout === "function") cacherTout();
        document.getElementById('ecran-mj').style.display = 'block';
        switchOngletMJ('joueurs'); 
    } else {
        alert("🔒 Accès refusé.");
    }
}
function switchOngletMJ(ongletId) {
    console.log(`%c 📂 [MJ-UI] Onglet : ${ongletId}`, "color: #ff9800; font-weight: bold;");

    // Sections HTML
    const secJoueurs = document.getElementById('mj-section-joueurs');
    const secCodex = document.getElementById('mj-section-codex');

    if (secJoueurs) secJoueurs.style.display = 'none';
    if (secCodex) secCodex.style.display = 'none';

    if (ongletId === 'joueurs') {
        if (secJoueurs) secJoueurs.style.display = 'block';
        rafraichirListeJoueursMJ();
    } 
    else {
        // Pour tous les autres onglets, on affiche le Codex
        if (secCodex) secCodex.style.display = 'block';
        
        // On fait le lien avec ton codex.js
        if (ongletId === 'codex-musique') {
            if (typeof genererMusiquesMJ_Integrated === "function") genererMusiquesMJ_Integrated();
        } else {
            // Mapping des types pour genererContenuCodexMJ
            const types = {
                'codex-items': 'items',
                'codex-marchands': 'marchands',
                'codex-coffres': 'coffres',
                'codex-lieux': 'lieux'
            };
            if (typeof genererContenuCodexMJ === "function") {
                genererContenuCodexMJ(types[ongletId] || 'items');
            }
        }
    }

    // Gestion visuelle des boutons
    document.querySelectorAll('.mj-tab-btn').forEach(btn => btn.classList.remove('active'));
    const btnActif = document.querySelector(`button[onclick="switchOngletMJ('${ongletId}')"]`);
    if (btnActif) btnActif.classList.add('active');
}function switchOngletMJ(ongletId) {
    console.log("📂 [DEBUG] Activation de l'onglet : " + ongletId);

    // 1. GESTION DES SECTIONS VISIBLES
    const secJoueurs = document.getElementById('mj-section-joueurs');
    const secCodex = document.getElementById('mj-section-codex');
    
    if(secJoueurs) secJoueurs.style.display = 'none';
    if(secCodex) secCodex.style.display = 'none';

    // 2. ROUTAGE VERS LES BONS CONTENUS
    if (ongletId === 'joueurs') {
        if(secJoueurs) secJoueurs.style.display = 'block';
        rafraichirListeJoueursMJ();
    } 
    else if (ongletId === 'codex-items') {
        if(secCodex) secCodex.style.display = 'block';
        if (typeof genererContenuCodexMJ === "function") genererContenuCodexMJ('items');
    }
    else if (ongletId === 'codex-marchands') {
        if(secCodex) secCodex.style.display = 'block';
        if (typeof genererContenuCodexMJ === "function") genererContenuCodexMJ('marchands');
    }
    else if (ongletId === 'codex-coffres') {
        if(secCodex) secCodex.style.display = 'block';
        if (typeof genererContenuCodexMJ === "function") genererContenuCodexMJ('coffres');
    }
    else if (ongletId === 'codex-lieux') {
        if(secCodex) secCodex.style.display = 'block';
        if (typeof genererContenuCodexMJ === "function") genererContenuCodexMJ('lieux');
    }
    else if (ongletId === 'codex-musique') {
        if(secCodex) secCodex.style.display = 'block';
        if (typeof genererMusiquesMJ_Integrated === "function") genererMusiquesMJ_Integrated();
    }

    // 3. STYLE DES BOUTONS
    document.querySelectorAll('.mj-tab-btn').forEach(btn => btn.classList.remove('active'));
    const btnActif = document.querySelector(`button[onclick="switchOngletMJ('${ongletId}')"]`);
    if (btnActif) btnActif.classList.add('active');
}


function mjModifierStat(playerID, stat) {
    let label = (stat === 'PV') ? "Points de Vie" : "Fatigue";
    let val = prompt(`Modifier ${label} pour ce joueur (ex: 10 pour soigner, -5 pour blesser) :`);
    
    if (val === null || val === "") return;

    console.log(`📡 [LOG] Envoi modif ${stat} : ${val} à ${playerID}`);

    db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/modif_stat').set({
        stat: stat,
        valeur: parseInt(val),
        timestamp: Date.now()
    });
}

function envoyerCadeauSecurise(idDestinataire, itemIndex) {
    const item = window.perso.inventaire[itemIndex];
    db.ref('parties/' + sessionActuelle + '/joueurs/' + idDestinataire + '/cadeau').set({
        id: item.id,
        expediteur: window.perso.nom,
        qte: 1,
        timestamp: Date.now()
    }).then(() => {
        window.perso.inventaire[itemIndex].quantite--;
        if (window.perso.inventaire[itemIndex].quantite <= 0) window.perso.inventaire.splice(itemIndex, 1);
        autoSave();
        updateInventaireUI();
        alert("🎁 Objet envoyé !");
    });
}



// ==========================================
// 6. INITIALISATION MOTEUR
// ==========================================

function demarrerMoteurMulti() {
    // 1. Sécurité : On ne lance rien si le perso n'est pas chargé
    if (!window.perso || !window.perso.nom || window.perso.nom === "Nom du Personnage") {
        console.warn("⚠️ Moteur Multi en attente : personnage non chargé.");
        return;
    }
    
    console.log("🌐 Initialisation du mode multijoueur complète...");

    // 2. REPLANTAGE DES ÉCOUTEURS (Les antennes)
    activerEcouteurCadeaux();
    activerEcouteurStats();
    activerEcouteurDeplacementGroupe();
    activerEcouteurPartageLieux();
    activerEcouteurAlertesMJ();
    activerEcouteurMusiqueMJ();
    activerEcouteurCommandesMJ();
    activerRadarGroupeAccueil();

    // 3. ACTIONS VISUELLES ET SONORES AU CHARGEMENT
    if (typeof appliquerFondActuel === "function") appliquerFondActuel();
    
    // On synchronise la musique MJ déjà en cours
    db.ref('parties/' + sessionActuelle + '/musique_mj').once('value', (snapshot) => {
        const data = snapshot.val();
        if (data && data.fichier) {
            console.log("🎶 Synchronisation musique MJ : " + data.fichier);
            if (typeof AudioEngine !== 'undefined') AudioEngine.jouerMusique(data.fichier);
        }
    });

    // 4. PREMIÈRE SYNCHRO ET SAUVEGARDE
    synchroniserJoueur();
    
    // Petit rappel pour l'artisanat si besoin
    if (typeof verifierBoutonCraft === "function") verifierBoutonCraft();
}


// Variables temporaires pour le don MJ
let objetEnCoursDeDon = null;
let quantiteEnCoursDeDonMJ = 1;

function executerDonObjetMJ(destinataireID) {
    if (!objetEnCoursDeDon) return;

    // Le MJ envoie l'objet dans la branche 'cadeau' du joueur
    db.ref('parties/' + sessionActuelle + '/joueurs/' + destinataireID + '/cadeau').set({
        id: objetEnCoursDeDon,
        qte: quantiteEnCoursDeDonMJ || 1,
        expediteur: "Le Maître du Jeu",
        timestamp: Date.now()
    }).then(() => {
        alert(`✅ Objet envoyé à ${destinataireID.replace('_', ' ')} !`);
        // On ferme la fenêtre de choix si elle existe
        const modal = document.getElementById('modal-transfert');
        if (modal) modal.style.display = 'none';
        
        // Reset
        objetEnCoursDeDon = null;
        quantiteEnCoursDeDonMJ = 1;
    }).catch(err => {
        console.error("Erreur don MJ:", err);
    });
}


function preparerDonObjetMJ(idJoueur) {
    // Cette fonction ouvre le Codex (onglet coffres) pour que le MJ choisisse un item
    const ongletCoffres = document.querySelector('button[onclick*="coffres"]');
    if (ongletCoffres) {
        ongletCoffres.click(); // On simule un clic sur l'onglet coffre
        alert("Sélectionnez un objet dans le Codex pour l'envoyer à " + idJoueur.replace('_', ' '));
        
        // On mémorise la cible du don
        window.destinataireEnCoursMJ = idJoueur;
    }
}

// Exemple de ce qu'il faut ajouter dans la fonction qui crée les boutons d'items du Codex
function cliquerSurItemCodex(idItem) {
    if (window.destinataireEnCoursMJ) {
        objetEnCoursDeDon = idItem;
        quantiteEnCoursDeDonMJ = parseInt(prompt("Quantité à donner ?", "1")) || 1;
        
        // On appelle la fonction d'envoi qu'on a créée avant
        executerDonObjetMJ(window.destinataireEnCoursMJ);
        
        // On reset la cible après le don
        window.destinataireEnCoursMJ = null;
    }
}