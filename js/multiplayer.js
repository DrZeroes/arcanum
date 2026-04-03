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
            .catch((_) => {
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
		pvActuel: window.perso.pvActuel ?? 0,
        ftActuel: window.perso.ftActuel ?? 0,
        pvMax: (window.perso.statsBase.FO * 2) + (window.perso.statsBase.IN) + (window.perso.boostPV || 0),
        ftMax: (window.perso.statsBase.CN * 2) + (window.perso.statsBase.IN) + (window.perso.boostFT || 0),
        niveau: window.perso.niveau || 1,
        xp: window.perso.xp || 0,
        vitesse: (window.perso.statsBase.DX + (window.perso.statsInvesties?.DX || 0)) + (window.perso.boostVitesseInne || 0),
        lieu: (typeof lieuxDecouverts !== 'undefined' && lieuxDecouverts[window.perso.lieuActuel]) ? lieuxDecouverts[window.perso.lieuActuel].nom : "Inconnu",
		estMort: window.perso.estMort || false,
        timestamp: Date.now(),
        compagnons_summary: (window.perso.compagnons || []).map((c, i) => ({ nom: c.nom, niveau: c.niveau || 1, idx: i })) || null
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
        
// Dans l'écouteur de cadeau du joueur
if (snapshot.val()) {
    // Si un cadeau est présent, on fait clignoter un bouton ou on affiche une alerte
    const btnRamasser = document.getElementById('btn-ramasser-cadeau');
    if (btnRamasser) {
        btnRamasser.style.backgroundColor = "#ff9800"; // Orange flashy
        btnRamasser.classList.add('animation-clignote');
    }
}
		
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
            if (typeof _toast === 'function') _toast(`🎁 ${data.expediteur || "Le MJ"} vous a donné : ${quantiteRecue}x ${nomObjet}`, 'gold');
            
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
    let basePV = (window.perso.pvActuel !== undefined) ? window.perso.pvActuel : 0;
    let valeurEffective = data.valeur;
    // Si c'est une attaque (valeur négative), on soustrait l'armure du joueur
    if (data.valeur < 0 && typeof _armureTotal === 'function') {
        const armure = _armureTotal(window.perso);
        valeurEffective = Math.min(0, data.valeur + armure); // armure réduit les dégâts
    }
    window.perso.pvActuel = basePV + valeurEffective;
    
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
        if (typeof _toast === 'function') _toast(msg, data.valeur > 0 ? 'success' : 'error');
    });
}


function activerEcouteurAlertesMJ() {
    db.ref('parties/' + sessionActuelle + '/alerte_mj').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data && data.texte && data.timestamp > derniereAlerteVue) {
            if (typeof _toast === 'function') _toast('📢 ' + data.texte);
            derniereAlerteVue = data.timestamp;
        }
    });
}


function activerRadarGroupeAccueil() {
    if (!db || !sessionActuelle) return;

    db.ref('parties/' + sessionActuelle + '/joueurs').on('value', (snapshot) => {
        const joueurs = snapshot.val();
        const container = document.getElementById('liste-membres-accueil');
        const zoneGroupe = document.getElementById('accueil-groupe-liste');

        if (!container) return;

        const fragments = [];

        if (joueurs && window.perso) {
            for (let id in joueurs) {
                let j = joueurs[id];
                if (j.nom !== window.perso.nom && j.lieu === window.perso.lieuActuel) {
                    fragments.push(`<div style="color:#fff; font-size:0.8em; margin-bottom:5px;"><span style="color:${j.estMort ? '#f44336' : '#4caf50'}">●</span> ${j.nom}</div>`);
                }
            }
        }

        container.innerHTML = fragments.join('');

        if (zoneGroupe) {
            zoneGroupe.style.display = (fragments.length > 0) ? "block" : "none";
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

function ouvrirEcranGroupe() {
    cacherTout();
    const ecran = document.getElementById('ecran-groupe');
    if (!ecran) return;
    ecran.style.display = 'block';

    const nomSession = document.getElementById('groupe-session-nom');
    if (nomSession) nomSession.textContent = sessionActuelle;

    const container = document.getElementById('affichage-allies');
    if (!container) return;

    container.innerHTML = '<div class="groupe-vide">Chargement...</div>';

    db.ref('parties/' + sessionActuelle + '/joueurs').on('value', (snapshot) => {
        const joueurs = snapshot.val();
        if (!joueurs) {
            container.innerHTML = '<div class="groupe-vide">Aucun aventurier connecté à cette session.</div>';
            return;
        }

        const lieuActuel = window.perso ? window.perso.lieuActuel : null;
        const fragments = [];

        for (let id in joueurs) {
            const j = joueurs[id];
            const estMort = (j.pvActuel <= 0 || j.estMort);
            const estMoi = (window.perso && j.nom === window.perso.nom);
            const memeLieu = (j.lieu === lieuActuel);

            const pvPct = j.pvMax > 0 ? Math.max(0, Math.min(100, (j.pvActuel / j.pvMax) * 100)) : 0;
            const ftPct = j.ftMax > 0 ? Math.max(0, Math.min(100, (j.ftActuel / j.ftMax) * 100)) : 0;
            const pvCritique = pvPct <= 25 && !estMort ? ' critique' : '';

            let cardClasses = 'groupe-card';
            if (estMort) cardClasses += ' est-mort';
            if (estMoi) cardClasses += ' est-moi';

            const statutTexte = estMort
                ? '💀 Inconscient'
                : (estMoi ? '● Vous' : '● En vie');

            fragments.push(`
                <div class="${cardClasses}">
                    <div class="groupe-card-header">
                        <div class="groupe-card-nom">${j.nom}</div>
                        <div class="groupe-card-niveau">Niv. ${j.niveau || 1}</div>
                    </div>
                    <div class="groupe-card-statut">${statutTexte}</div>

                    <div class="groupe-bar-label">
                        <span>❤ PV</span>
                        <span>${j.pvActuel ?? '?'} / ${j.pvMax ?? '?'}</span>
                    </div>
                    <div class="groupe-bar-track">
                        <div class="groupe-bar-fill pv${pvCritique}" style="width:${pvPct}%"></div>
                    </div>

                    <div class="groupe-bar-label">
                        <span>⚡ FT</span>
                        <span>${j.ftActuel ?? '?'} / ${j.ftMax ?? '?'}</span>
                    </div>
                    <div class="groupe-bar-track">
                        <div class="groupe-bar-fill ft" style="width:${ftPct}%"></div>
                    </div>

                    <div class="groupe-card-lieu${memeLieu ? ' meme-lieu' : ''}">
                        📍 ${j.lieu || 'Lieu inconnu'}
                    </div>
                </div>`);
        }

        container.innerHTML = fragments.join('');
    });
}

// ==========================================
// SYSTÈME DE COMPAGNONS
// ==========================================

/**
 * Ecoute les actions MJ sur les compagnons du joueur (don, level up, renvoi).
 * Le MJ écrit dans /joueurs/{id}/compagnon_action ; le joueur applique et sauvegarde.
 */
function activerEcouteurCompagnons() {
    if (!window.perso || !window.perso.nom) return;
    const playerID = window.perso.nom.replace(/\s+/g, '_');
    const ref = db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/compagnon_action');
    ref.off();
    ref.on('value', (snapshot) => {
        const data = snapshot.val();
        if (!data || !data.type) return;
        // Ignore les actions stale (> 30s) pour éviter les doublons au rechargement
        if (data.timestamp && (Date.now() - data.timestamp) > 30000) {
            ref.remove();
            return;
        }
        ref.remove(); // consume immédiatement

        if (!window.perso.compagnons) window.perso.compagnons = [];
        const comps = window.perso.compagnons;

        if (data.type === 'don') {
            const npcBase = (typeof personnagesNPC !== 'undefined') ? personnagesNPC[data.npcId] : null;
            if (!npcBase) { if (typeof _toast === 'function') _toast('⚠️ PNJ introuvable.', 'error'); return; }
            const statCH = (window.perso.statsBase?.CH || 0) + (window.perso.statsInvesties?.CH || 0);
            const maxComps = Math.max(1, Math.floor(statCH / 4));
            if (comps.length >= maxComps) {
                if (typeof _toast === 'function') _toast(`⚠️ Limite atteinte (${maxComps} max selon CH).`, 'error');
                return;
            }
            // Un seul exemplaire du même compagnon par groupe (check npcId ET nom)
            if (comps.some(c => c.npcId === data.npcId || c.nom === npcBase.nom)) {
                if (typeof _toast === 'function') _toast(`⚠️ ${npcBase.nom} est déjà dans votre groupe.`, 'error');
                return;
            }
            // Repart toujours de la définition fraîche (npcBase) pour avoir tous les champs à jour
            // puis réapplique la progression sauvegardée si elle existe
            const npc = JSON.parse(JSON.stringify(npcBase));
            npc.npcId = data.npcId;
            const memoire = window.perso.compagnonsMemoire || {};
            if (memoire[data.npcId]) {
                const mem = memoire[data.npcId];
                // Réapplique uniquement la progression (pas les champs de base)
                npc.niveau         = mem.niveau || npc.niveau;
                npc.xp             = mem.xp || 0;
                npc.pvActuel       = mem.pvActuel ?? npc.pvActuel;
                npc.ftActuel       = mem.ftActuel ?? npc.ftActuel;
                npc.statsInvesties = mem.statsInvesties ? JSON.parse(JSON.stringify(mem.statsInvesties)) : npc.statsInvesties;
                npc.magieInvesties = mem.magieInvesties ? JSON.parse(JSON.stringify(mem.magieInvesties)) : (npc.magieInvesties || {});
                npc.compInvesties  = mem.compInvesties  ? JSON.parse(JSON.stringify(mem.compInvesties))  : npc.compInvesties;
                npc.inventaire     = mem.inventaire     ? JSON.parse(JSON.stringify(mem.inventaire))     : npc.inventaire;
            }
            comps.push(npc);
            if (typeof _toast === 'function') _toast(`🤝 ${npc.nom} rejoint votre groupe !`, 'success');
        }
        else if (data.type === 'levelup') {
            const comp = comps[data.compIdx];
            if (!comp) return;
            comp.niveau = (comp.niveau || 1) + 1;
            if (data.stat && comp.statsInvesties) {
                comp.statsInvesties[data.stat] = (comp.statsInvesties[data.stat] || 0) + 1;
                const fo  = comp.statsBase.FO + comp.statsInvesties.FO;
                const ini = comp.statsBase.IN + comp.statsInvesties.IN;
                const cn  = comp.statsBase.CN + comp.statsInvesties.CN;
                comp.pvActuel = (fo * 2) + ini + (comp.boostPV || 0);
                comp.ftActuel = (cn * 2) + ini + (comp.boostFT || 0);
            } else if (data.stat === 'magie' && data.ecole) {
                if (!comp.magieInvesties) comp.magieInvesties = {};
                comp.magieInvesties[data.ecole] = (comp.magieInvesties[data.ecole] || 0) + 1;
            } else if (data.stat === 'comp' && data.competence) {
                if (!comp.compInvesties) comp.compInvesties = {};
                comp.compInvesties[data.competence] = (comp.compInvesties[data.competence] || 0) + 1;
            }
            if (typeof _toast === 'function') _toast(`🌟 ${comp.nom} Niv.${comp.niveau} !`, 'gold');
        }
        else if (data.type === 'renvoi') {
            const comp = comps[data.compIdx];
            if (!comp) return;
            const nom = comp.nom;
            // Mémorise le compagnon avant de le retirer
            if (!window.perso.compagnonsMemoire) window.perso.compagnonsMemoire = {};
            if (comp.npcId) window.perso.compagnonsMemoire[comp.npcId] = JSON.parse(JSON.stringify(comp));
            comps.splice(data.compIdx, 1);
            if (typeof _toast === 'function') _toast(`👋 ${nom} a quitté votre groupe.`);
        }
        else if (data.type === 'item_add') {
            const comp = comps[data.compIdx];
            if (!comp) return;
            if (!comp.inventaire) comp.inventaire = [];
            const existing = comp.inventaire.find(i => i.id === data.itemId);
            if (existing) { existing.quantite = (existing.quantite || 1) + (data.quantite || 1); }
            else { comp.inventaire.push({ id: data.itemId, quantite: data.quantite || 1 }); }
            if (typeof _toast === 'function') _toast(`🎒 Objet ajouté à ${comp.nom}.`, 'success');
        }

        window.perso.compagnons = comps;
        if (typeof autoSave === 'function') autoSave();
        localStorage.setItem('arcanum_sauvegarde', JSON.stringify(window.perso));
        _syncCompagnonsSummary();

        // Rafraîchit l'écran compagnons s'il est ouvert
        const ecranComp = document.getElementById('ecran-compagnons');
        if (ecranComp && ecranComp.style.display !== 'none') {
            if (typeof afficherEcranCompagnons === 'function') afficherEcranCompagnons();
        }
        // Affiche/masque le bouton accueil
        const btnComp = document.getElementById('btn-menu-compagnons');
        if (btnComp) btnComp.style.display = comps.length > 0 ? 'inline-block' : 'none';
    });
}

/**
 * Écoute le nœud combat_actif sur Firebase.
 * - Premier déclenchement actif → ouvre l'écran combat
 * - Mise à jour (tour, PV ennemi) → rafraîchit l'affichage sans rouvrir
 * - Nœud supprimé → retour à l'accueil
 */
function activerEcouteurCombat() {
    const ref = db.ref('parties/' + sessionActuelle + '/combat_actif');
    ref.off();
    ref.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data && data.actif === true) {
            const etaitEnCombat = !!window.combatActif;
            window.combatActif = data;
            if (!etaitEnCombat) {
                if (typeof ouvrirEcranCombat === 'function') ouvrirEcranCombat();
            } else {
                if (typeof afficherEtatCombat === 'function') afficherEtatCombat();
            }
        } else if (window.combatActif) {
            if (typeof quitterEcranCombat === 'function') quitterEcranCombat();
        }
    });
}

/** Pousse un résumé léger des compagnons sur Firebase (pour que le MJ puisse les voir). */
function _syncCompagnonsSummary() {
    if (!window.perso?.nom || !db) return;
    const playerID = window.perso.nom.replace(/\s+/g, '_');
    const summary = (window.perso.compagnons || []).map((c, i) => ({
        nom: c.nom, niveau: c.niveau || 1, idx: i,
        npcId: c.npcId || null, xp: c.xp || 0,
        magieInvesties: c.magieInvesties || null
    }));
    db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/compagnons_summary')
      .set(summary.length ? summary : null);
}

function activerEcouteurKick() {
    if (!window.perso || !window.perso.nom) return;
    const playerID = window.perso.nom.replace(/\s+/g, '_');
    const kickRef = db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/kick');

    kickRef.on('value', (snapshot) => {
        if (snapshot.val() !== true) return;

        // On coupe l'écouteur immédiatement pour éviter un double déclenchement
        kickRef.off();

        // Déconnexion propre : on retire tous les listeners de la session
        db.ref('parties/' + sessionActuelle).off();

        // On efface le nom de session pour ne pas se reconnecter automatiquement
        localStorage.removeItem('arcanum_session_name');
        sessionActuelle = "session1";

        if (typeof _toast === 'function') _toast("🚫 Vous avez été expulsé par le Maître du Jeu.", 'error');

        if (typeof allerAccueil === 'function') allerAccueil();
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
            
            if (typeof _toast === 'function') _toast("🌟 Niveau supérieur !", 'gold');

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
        window.estMJ = true;
        updateSessionName();
        if (typeof cacherTout === "function") cacherTout();
        document.getElementById('ecran-mj').style.display = 'block';
        switchOngletMJ('joueurs');
    } else {
        if (typeof _toast === 'function') _toast("🔒 Accès refusé.", 'error');
    }
}
function switchOngletMJ(ongletId) {
    console.log("📂 [DEBUG] Activation de l'onglet : " + ongletId);

    // 1. GESTION DES SECTIONS VISIBLES
    const secJoueurs = document.getElementById('mj-section-joueurs');
    const secCodex   = document.getElementById('mj-section-codex');
    const secCombat  = document.getElementById('mj-section-combat');

    if(secJoueurs) secJoueurs.style.display = 'none';
    if(secCodex)   secCodex.style.display   = 'none';
    if(secCombat)  secCombat.style.display  = 'none';

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
    else if (ongletId === 'codex-npc') {
        if(secCodex) secCodex.style.display = 'block';
        if (typeof genererNPCsMJ === "function") genererNPCsMJ();
    }
    else if (ongletId === 'codex-ennemis') {
        if(secCodex) secCodex.style.display = 'block';
        if (typeof genererEnnemisCodexMJ === "function") genererEnnemisCodexMJ();
    }
    else if (ongletId === 'codex-musique') {
        if(secCodex) secCodex.style.display = 'block';
        if (typeof genererMusiquesMJ_Integrated === "function") genererMusiquesMJ_Integrated();
    }
    else if (ongletId === 'combat') {
        const secCombat = document.getElementById('mj-section-combat');
        if (secCombat) secCombat.style.display = 'block';
        if (typeof mjAfficherInterfaceCombat === "function") mjAfficherInterfaceCombat();
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
    if (!item) return;

    const nomObjet = (typeof itemsData !== 'undefined' && itemsData[item.id]) ? itemsData[item.id].nom : item.id;
    const refCadeau = db.ref('parties/' + sessionActuelle + '/joueurs/' + idDestinataire + '/cadeau');

    console.log(`%c 📤 [TRANS] Envoi de ${nomObjet} à ${idDestinataire}...`, "color: #2196f3; font-weight: bold;");

    // Utilisation d'une transaction Firebase pour vérifier si le slot est libre
    refCadeau.transaction((currentData) => {
        if (currentData === null) {
            // Le slot est vide, on peut déposer l'objet
            return {
                id: item.id,
                expediteur: window.perso.nom,
                qte: 1,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            };
        } else {
            // Le joueur a déjà un cadeau non ramassé, on annule pour ne pas écraser
            return; 
        }
    }, (error, committed, _snapshot) => {
        if (error) {
            console.error("❌ Erreur transaction :", error);
        } else if (!committed) {
            if (typeof _toast === 'function') _toast("⚠️ Ce joueur a déjà un cadeau en attente.", 'error');
        } else {
            // SUCCESS : L'objet est bien arrivé sur le serveur
            console.log("✅ Objet livré.");
            
            // On le retire de notre inventaire seulement MAINTENANT
            window.perso.inventaire[itemIndex].quantite--;
            if (window.perso.inventaire[itemIndex].quantite <= 0) {
                window.perso.inventaire.splice(itemIndex, 1);
            }

            // Sauvegarde locale et mise à jour visuelle
            if (typeof autoSave === "function") autoSave();
            if (typeof updateInventaireUI === "function") updateInventaireUI();
            
            if (typeof _toast === 'function') _toast(`🎁 ${nomObjet} envoyé !`, 'success');
        }
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
    activerEcouteurKick();
    activerEcouteurCompagnons();
    activerEcouteurCombat();
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
        if (typeof _toast === 'function') _toast(`✅ Objet envoyé à ${destinataireID.replace('_', ' ')} !`, 'success');
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


function preparerDonObjet(itemIndex) {
    const item = window.perso.inventaire[itemIndex];
    if (!item) return;

    // 1. Récupérer les éléments de ta modale HTML
    const modal = document.getElementById('modal-transfert');
    const liste = document.getElementById('liste-destinataires');
    
    if (!modal || !liste) {
        console.error("❌ Erreur : 'modal-transfert' ou 'liste-destinataires' introuvable.");
        return;
    }

    // 2. Récupérer les joueurs en ligne via Firebase
    db.ref('parties/' + sessionActuelle + '/joueurs').once('value', (snapshot) => {
        const joueurs = snapshot.val();
        liste.innerHTML = ""; // On vide la liste avant de remplir

        let nbAutres = 0;

        if (joueurs) {
            for (let id in joueurs) {
                // 🛡️ SÉCURITÉ : On n'affiche pas son propre pseudo
                if (joueurs[id].nom !== window.perso.nom) {
                    nbAutres++;
                    
                    // On crée un bouton stylé pour chaque joueur
                    const btn = document.createElement('button');
                    btn.innerText = "👤 " + joueurs[id].nom;
                    btn.style = "background:#444; color:#ff9800; border:1px solid #ff9800; padding:10px; border-radius:5px; cursor:pointer; font-weight:bold; width:100%; text-align:left; transition:0.2s;";
                    
                    // Au clic, on valide le don et on ferme
                    btn.onclick = () => {
                        modal.style.display = 'none';
                        envoyerCadeauSecurise(id, itemIndex);
                    };

                    // Petit effet hover
                    btn.onmouseover = () => { btn.style.background = "#555"; };
                    btn.onmouseout = () => { btn.style.background = "#444"; };

                    liste.appendChild(btn);
                }
            }
        }

        if (nbAutres === 0) {
            liste.innerHTML = "<p style='color:#aaa; font-style:italic;'>Personne d'autre en ligne...</p>";
        }

        // 3. Afficher la modale
        modal.style.display = 'block';
    });
}



// 3. La fonction qui fait le lien avec ton système de transaction
window.validerEnvoiUnique = function(idDestinataire, itemIndex) {
    // Supprimer la modale
    const modal = document.getElementById('temp-modal-don');
    if (modal) modal.remove();

    // Lancer l'envoi sécurisé que l'on a codé au point précédent
    envoyerCadeauSecurise(idDestinataire, itemIndex);
};


function preparerDonObjetMJ(idJoueur) {
    // Cette fonction ouvre le Codex (onglet coffres) pour que le MJ choisisse un item
    const ongletCoffres = document.querySelector('button[onclick*="coffres"]');
    if (ongletCoffres) {
        ongletCoffres.click(); // On simule un clic sur l'onglet coffre
        if (typeof _toast === 'function') _toast("Sélectionnez un objet dans le Codex pour l'envoyer à " + idJoueur.replace('_', ' '));
        
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