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
            .catch((err) => {
                console.error("🔴 AUTH FIREBASE ÉCHOUÉE :", err.code, err.message);
                // err.code === 'auth/operation-not-allowed' → activer l'auth anonyme dans la console Firebase
                // err.code === 'auth/network-request-failed' → problème réseau

                // Avertissement visible dans l'UI
                const msg = err.code === 'auth/operation-not-allowed'
                    ? '🔴 Auth Firebase non activée — active l\'authentification anonyme dans la console Firebase.'
                    : `🔴 Connexion Firebase impossible (${err.code}) — mode hors-ligne.`;
                if (typeof _toast === 'function') _toast(msg, 'error');
                else console.warn(msg);

                // ID de secours local (les écritures Firebase seront rejetées par les règles de sécurité)
                window.userUID = "Guest_" + Math.floor(Math.random() * 1000);
                window._firebaseAuthEchec = true;
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
    
    const surcharge = (typeof _estSurcharge === 'function') ? _estSurcharge(window.perso) : false;
    const dx = window.perso.statsBase.DX + (window.perso.statsInvesties?.DX || 0);
    const vitesseBase = (dx >= 20 ? (25 + (dx - 20)) : dx) + (window.perso.boostVitesseInne || 0);

    const dataSync = {
        nom: window.perso.nom,
        ownerID: window.userUID,
        estMJ: window.estMJ ? true : false,
        pvActuel: window.perso.pvActuel ?? 0,
        ftActuel: window.perso.ftActuel ?? 0,
        pvMax: (window.perso.statsBase.FO * 2) + (window.perso.statsBase.IN)
            + ((window.perso.statsInvesties?.FO || 0) * 2) + (window.perso.statsInvesties?.IN || 0)
            + (window.perso.boostPV || 0),
        ftMax: (window.perso.statsBase.CN * 2) + (window.perso.statsBase.IN)
            + ((window.perso.statsInvesties?.CN || 0) * 2) + (window.perso.statsInvesties?.IN || 0)
            + (window.perso.boostFT || 0),
        niveau: window.perso.niveau || 1,
        xp: window.perso.xp || 0,
        vitesse: surcharge ? 1 : vitesseBase,
        lieu: (typeof lieuxDecouverts !== 'undefined' && lieuxDecouverts[window.perso.lieuActuel]) ? lieuxDecouverts[window.perso.lieuActuel].nom : "Inconnu",
        discretion: window.perso.compInvesties?.discretion || 0,
        surcharge: surcharge,
        estMort: window.perso.estMort || false,
        empoisonne: !!window.perso.poison,
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



/** Écoute les bénédictions/malédictions attribuées par le MJ. */
function activerEcouteurEffets() {
    if (!window.perso || !window.perso.nom) return;
    const playerID = window.perso.nom.replace(/\s+/g, '_');
    const ref = db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/effets_actifs');
    ref.off();
    ref.on('value', (snap) => {
        const effets = snap.val() || null;
        const avant  = JSON.stringify(window.perso.effets_actifs || null);
        window.perso.effets_actifs = effets;
        if (JSON.stringify(effets) !== avant) {
            // Notifier si un nouvel effet apparaît
            if (effets) {
                const noms = Object.values(effets).map(e => e.icone + ' ' + e.nom).join(', ');
                if (typeof _toast === 'function') {
                    const type = Object.values(effets).some(e => e.type === 'malediction') ? 'error' : 'success';
                    _toast('Effets actifs : ' + noms, type);
                }
            }
            if (typeof rafraichirAccueil === 'function') rafraichirAccueil();
            if (typeof rafraichirFiche   === 'function') rafraichirFiche();
            if (typeof autoSave          === 'function') autoSave();
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
function activerEcouteurArgent() {
    if (!window.perso || !window.perso.nom) return;
    const playerID = window.perso.nom.replace(/\s+/g, '_');
    const argentRef = db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/modif_argent');
    argentRef.off();
    argentRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (!data) return;
        argentRef.remove();
        const gain = data.valeur || 0;
        window.perso.argent = (window.perso.argent || 0) + gain;
        if (gain > 0 && typeof _incStatPartie === 'function') _incStatPartie('or_cumule', gain);
        if (typeof autoSave === 'function') autoSave();
        if (typeof updateInventaireUI === 'function') updateInventaireUI();
        if (typeof rafraichirAccueil === 'function') rafraichirAccueil();
        if (typeof _toast === 'function') _toast(`💰 +${data.valeur} or reçu de ${data.de || '?'} !`, 'gold');
    });
}

// ══════════════════════════════════════════════════════════════
// VOL À LA TIRE — Côté joueur
// ══════════════════════════════════════════════════════════════

/**
 * Écoute le nœud Firebase vol_a_la_tire/{playerID}.
 * Quand le MJ autorise une tentative, affiche le bouton "Voler" sur l'accueil.
 */
/** Écoute les quêtes de la session et met à jour le journal joueur en temps réel. */
function activerEcouteurQuetes() {
    const ref = db.ref('parties/' + sessionActuelle + '/quetes');
    ref.off();
    ref.on('value', (snap) => {
        const quetes = snap.val() || {};
        const avant  = JSON.stringify(window._quetesActives || {});
        window._quetesActives = quetes;

        if (!window.perso) return;
        const myID = (window.perso.nom || '').replace(/\s+/g, '_');
        const apres = JSON.stringify(quetes);
        if (avant === apres) return;

        // Toast si nouvelle quête attribuée à ce joueur
        const prevQuetes = JSON.parse(avant);
        Object.values(quetes).forEach(q => {
            if (q.statut !== 'en_cours') return;
            if (!(q.joueurs || []).includes(myID) && (q.joueurs || []).length > 0) return;
            const etaitPresentAvant = Object.values(prevQuetes).some(
                pq => pq.nom === q.nom && pq.statut === 'en_cours'
            );
            if (!etaitPresentAvant) {
                if (typeof _toast === 'function') _toast(`📜 Nouvelle quête : "${q.nom}"`, 'success');
            }
        });

        // Toast si quête validée/échouée
        Object.values(quetes).forEach(q => {
            if (!(q.joueurs || []).includes(myID) && (q.joueurs || []).length > 0) return;
            const prev = Object.values(prevQuetes).find(pq => pq.nom === q.nom);
            if (prev && prev.statut === 'en_cours' && q.statut === 'validee') {
                if (typeof _toast === 'function') _toast(`✅ Quête terminée : "${q.nom}"`, 'success');
            }
            if (prev && prev.statut === 'en_cours' && q.statut === 'echouee') {
                if (typeof _toast === 'function') _toast(`❌ Quête échouée : "${q.nom}"`, 'error');
            }
        });

        // Rafraîchir le journal si l'onglet quêtes est ouvert
        const modal = document.getElementById('modal-journal');
        if (modal && modal.style.display === 'flex') {
            if (typeof ouvrirJournal === 'function') ouvrirJournal('quetes');
        }
    });
}

function activerEcouteurDonjon() {
    const ref = db.ref('parties/' + sessionActuelle + '/donjon_actif');
    ref.off();
    ref.on('value', (snap) => {
        const data = snap.val();
        if (!data) {
            // Donjon terminé
            if (window.donjonActif) {
                window.donjonActif = null;
                if (typeof _toast === 'function') _toast('🗺 Le donjon est terminé.', 'info');
                if (typeof allerAccueil === 'function') allerAccueil();
            }
            return;
        }

        window.donjonActif = data;

        // ── Côté MJ : notification + refresh si onglet donjon ouvert ──
        if (window.estMJ) {
            const secDonjon = document.getElementById('mj-section-donjon');
            const estVisible = secDonjon && secDonjon.style.display !== 'none';
            if (estVisible && typeof mjGererDonjon === 'function') mjGererDonjon();
            // Toast si nouvelle rencontre en attente
            if (data.rencontre_en_attente) {
                const ts = data.rencontre_en_attente.timestamp;
                if (ts !== window._dernierTimestampRencontre) {
                    window._dernierTimestampRencontre = ts;
                    if (typeof _toast === 'function') _toast('👹 Rencontre déclenchée ! Allez sur l\'onglet Donjon.', 'error');
                }
            }
            return;
        }

        // ── Côté joueur ──
        // Ouvrir l'écran donjon si pas déjà affiché
        const ecran = document.getElementById('ecran-donjon');
        if (ecran && ecran.style.display !== 'flex') {
            if (typeof ouvrirEcranDonjon === 'function') ouvrirEcranDonjon();
            else ecran.style.display = 'flex';
        }

        // Rafraîchir l'affichage si l'écran est actif
        if (ecran && ecran.style.display === 'flex') {
            if (typeof afficherEtatDonjon === 'function') afficherEtatDonjon();
        }
    });
}

function activerEcouteurVolATire() {
    if (!window.perso || !window.perso.nom) return;
    const playerID = window.perso.nom.replace(/\s+/g, '_');
    const ref = db.ref('parties/' + sessionActuelle + '/vol_a_la_tire/' + playerID);
    ref.off();
    ref.on('value', (snapshot) => {
        const data = snapshot.val();
        const zone = document.getElementById('zone-vol-a-la-tire');
        if (!zone) return;

        if (data && data.actif) {
            // Décrire l'opportunité
            let description = 'Opportunité de vol en cours…';
            if (data.objetId && typeof itemsData !== 'undefined' && itemsData[data.objetId]) {
                description = `Objet ciblé : <strong style="color:#d4af37;">${itemsData[data.objetId].nom}</strong>`;
            } else if (data.rarete) {
                description = `Butin de rareté <strong style="color:#d4af37;">${data.rarete}</strong>`;
            }

            // Stocker la config pour le roll
            window._volATireConfig = { rarete: data.rarete || null, objetId: data.objetId || null };

            zone.style.display = 'block';
            zone.innerHTML = `
                <div style="background:rgba(20,10,40,0.95); border:2px solid #7c4dff; border-radius:8px; padding:14px; text-align:center;">
                    <div style="color:#b39ddb; font-weight:bold; font-size:1.05em; margin-bottom:6px;">🤏 Opportunité de vol</div>
                    <div style="color:#ccc; font-size:0.85em; margin-bottom:12px;">${description}</div>
                    <button onclick="tenterVolATire()"
                        style="background:#7c4dff; color:white; border:none; padding:10px 28px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:1em; letter-spacing:0.03em;">
                        🤏 Tenter le vol
                    </button>
                </div>`;
        } else {
            zone.style.display = 'none';
            zone.innerHTML = '';
            window._volATireConfig = null;
        }
    });
}

/**
 * Effectue le jet de vol à la tire et applique le résultat.
 * Appelée par le bouton "Tenter le vol" sur l'accueil.
 * Supprime l'autorisation Firebase immédiatement (succès ou échec).
 */
function tenterVolATire() {
    const config = window._volATireConfig;
    const perso = window.perso;
    if (!config || !perso) return;

    // — Calcul de la chance —
    const dx       = (perso.statsBase?.DX || 0) + (perso.statsInvesties?.DX || 0);
    const volPts   = (perso.compInvesties?.vol_a_la_tire || 0);
    // Bonus équipement : items avec stats.bonusVol (ex. gants de voleur)
    let bonusEquip = 0;
    if (perso.equipement && typeof itemsData !== 'undefined') {
        for (const slot in perso.equipement) {
            const eq = perso.equipement[slot];
            if (eq && itemsData[eq.id]?.stats?.bonusVol) bonusEquip += itemsData[eq.id].stats.bonusVol;
        }
    }
    const chance = Math.min(95, dx * 3 + volPts * 4 + bonusEquip);
    const roll   = Math.floor(Math.random() * 100) + 1; // 1–100
    const succes = roll <= chance;

    // — Supprimer l'autorisation Firebase et masquer la zone —
    const playerID = perso.nom.replace(/\s+/g, '_');
    db.ref('parties/' + sessionActuelle + '/vol_a_la_tire/' + playerID).remove();
    const zone = document.getElementById('zone-vol-a-la-tire');
    if (zone) { zone.style.display = 'none'; zone.innerHTML = ''; }
    window._volATireConfig = null;

    if (succes) {
        // Cas spécial : or
        if (config.objetId === 'OR_PIECES') {
            const qte = config.quantite || 10;
            perso.argent = (perso.argent || 0) + qte;
            if (typeof autoSave === 'function') autoSave();
            if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
            if (typeof _toast === 'function') _toast(`🤏 Vol réussi ! (${roll}/${chance}%) Subtilisé : ${qte} pièces d'or !`, 'success');
            return;
        }

        let objetGagne = null;

        if (config.objetId && typeof itemsData !== 'undefined' && itemsData[config.objetId]) {
            objetGagne = config.objetId;
        } else if (config.rarete && typeof itemsData !== 'undefined') {
            // Cherche un objet lootable de la bonne rareté
            const candidats = Object.entries(itemsData)
                .filter(([, d]) => d.lootable === true && parseInt(d.rarete) === config.rarete)
                .map(([id]) => id);
            if (candidats.length > 0) {
                objetGagne = candidats[Math.floor(Math.random() * candidats.length)];
            }
        }

        if (objetGagne && typeof itemsData !== 'undefined') {
            const data = itemsData[objetGagne];
            const inv  = perso.inventaire || (perso.inventaire = []);
            const qte  = config.quantite || 1;
            // Stackable sans durabilité → empiler
            const exist = data.stackable
                ? inv.findIndex(i => i.id === objetGagne && i.durabilite === undefined)
                : -1;
            if (exist !== -1) { inv[exist].quantite = (inv[exist].quantite || 1) + qte; inv[exist].qte = inv[exist].quantite; }
            else               { inv.push({ id: objetGagne, quantite: qte, qte: qte }); }
            if (typeof autoSave === 'function') autoSave();
            if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
            if (typeof _toast === 'function') _toast(`🤏 Vol réussi ! (${roll}/${chance}%) Subtilisé : ${data.nom} !`, 'success');
        } else {
            if (typeof _toast === 'function') _toast(`🤏 Vol réussi ! (${roll}/${chance}%) Mais il n'y avait rien à prendre…`, 'success');
        }
    } else {
        if (typeof _toast === 'function') _toast(`🤏 Vol raté ! (${roll}/${chance}%)`, 'error');
    }
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

        const maxPV = (window.perso.statsBase.FO * 2) + (window.perso.statsBase.IN)
            + ((window.perso.statsInvesties?.FO || 0) * 2) + (window.perso.statsInvesties?.IN || 0)
            + (window.perso.boostPV || 0);
        const maxFT = (window.perso.statsBase.CN * 2) + (window.perso.statsBase.IN)
            + ((window.perso.statsInvesties?.CN || 0) * 2) + (window.perso.statsInvesties?.IN || 0)
            + (window.perso.boostFT || 0);
        
       if (data.stat === 'PV') {
    let basePV = (window.perso.pvActuel !== undefined) ? window.perso.pvActuel : 0;
    let valeurEffective = data.valeur;
    let esquive = false; // déclaré ici pour être accessible après le bloc damage

    if (data.valeur < 0) {
        let degats = -data.valeur;

        // 0. Esquive : 1% de chance par point de compétence (impossible si surchargé)
        const esquive_pts_base = window.perso.compInvesties?.esquive || 0;
        const persoSurchargé = (typeof _estSurcharge === 'function') && _estSurcharge(window.perso);
        // Brouillard : +20 esquive
        const _buffsGroupeEsq = window.combatActif?.buffs_groupe || {};
        const bonusEsqBrouillard = _buffsGroupeEsq['Brouillard']?.actif ? 20 : 0;
        // Occultation : +10 esquive
        const bonusEsqOccultation = window.perso.effets_actifs
            ? Object.values(window.perso.effets_actifs).reduce((s, e) => s + (e.bonus_esquive || 0), 0) : 0;
        // Incarnation d'Air : esquive fixée à 75
        const _incAir = window.perso.effets_actifs && Object.values(window.perso.effets_actifs).some(e => e.incarnation && e.element_incarnation === 'Air');
        const esquive_pts = _incAir ? 75 : (esquive_pts_base + bonusEsqBrouillard + bonusEsqOccultation);
        if (!persoSurchargé && esquive_pts > 0 && Math.floor(Math.random() * 100) < esquive_pts) {
            esquive = true;
            if (typeof _toast === 'function') _toast('🏃 Attaque esquivée !', 'success');
        }

        if (!esquive) {
            // 0b. Bouclier mystique : −20% dégâts magiques
            const _buffsGroupe = window.combatActif?.buffs_groupe || {};
            if (data.magique && _buffsGroupe['Bouclier mystique']?.actif) {
                degats = Math.max(0, Math.round(degats * 0.80));
                if (typeof _toast === 'function') _toast('🔮 Bouclier mystique — −20% dég. magiques', 'success');
            }

            // 1. Résistance élémentaire (avant armure)
            if (data.element) {
                const resMap = { feu: 'resFeu', elec: 'resElec', poison: 'resPoison' };
                const resKey = resMap[data.element];
                const res = resKey ? (window.perso.bonusInnes?.[resKey] || 0) : 0;
                if (res !== 0) {
                    const mult = 1 - (res / 100);
                    degats = Math.max(0, Math.round(degats * mult));
                    const elemLabels = { feu:'🔥 Feu', elec:'⚡ Élec.', poison:'☠ Poison' };
                    const resLabel = res > 0 ? `résistance ${res}%` : `faiblesse ${Math.abs(res)}%`;
                    if (typeof _toast === 'function') _toast(`${elemLabels[data.element]} — ${resLabel} → ${degats} dégâts`, res > 0 ? 'success' : 'error');
                }
            }

            // 2. Armure physique (toujours)
            if (typeof _armureTotal === 'function') {
                const armure = _armureTotal(window.perso);
                degats = Math.max(0, degats - armure);
            }

            // 2b. Mur de pierres / Mur de force : −20% dégâts physiques (pas magiques)
            if (!data.magique && (_buffsGroupe['Mur de pierres']?.actif || _buffsGroupe['Mur de force']?.actif)) {
                degats = Math.max(0, Math.round(degats * 0.80));
                const nomMur = _buffsGroupe['Mur de pierres']?.actif ? 'Mur de pierres' : 'Mur de force';
                if (typeof _toast === 'function') _toast(`🪨 ${nomMur} — −20% dég. physiques`, 'success');
            }

            // 2c. Bouclier de protection : −25% dégâts physiques, se brise au premier coup
            if (!data.magique && window.perso.effets_actifs) {
                const effetsArr = Object.entries(window.perso.effets_actifs);
                const idxBouclier = effetsArr.findIndex(([, e]) => e.bouclier_physique && e.fragile);
                if (idxBouclier !== -1) {
                    const [cleBouclier] = effetsArr[idxBouclier];
                    degats = Math.max(0, Math.round(degats * (1 - effetsArr[idxBouclier][1].bouclier_physique)));
                    if (typeof _toast === 'function') _toast('🛡 Bouclier de protection absorbé et brisé !', 'success');
                    // Briser le bouclier
                    const _playerID = (window.perso.nom || '').replace(/\s+/g, '_');
                    db.ref('parties/' + sessionActuelle + '/joueurs/' + _playerID + '/effets_actifs/' + cleBouclier).remove();
                }
            }

            // 2d. Occultation : −10% tous dégâts
            if (window.perso.effets_actifs) {
                const aOccultation = Object.values(window.perso.effets_actifs).some(e => e.nom === 'Occultation' && e.reduction_degats);
                if (aOccultation) {
                    degats = Math.max(0, Math.round(degats * 0.90));
                    if (typeof _toast === 'function') _toast('🌫 Occultation — −10% dégâts', 'success');
                }
            }

            // 2e. Incarnation de Pierre : −75% tous dégâts
            if (window.perso.effets_actifs && Object.values(window.perso.effets_actifs).some(e => e.incarnation && e.element_incarnation === 'Pierre')) {
                degats = Math.max(0, Math.round(degats * 0.25));
                if (typeof _toast === 'function') _toast('🪨 Incarnation de Pierre — −75% dégâts !', 'success');
            }

            // 2f. Bouclier de réflexion : réfléchit les attaques magiques/élémentaires
            const _estMagique = !!data.element || !!data.magique;
            if (_estMagique && window.perso.effets_actifs) {
                const _effReflArr = Object.entries(window.perso.effets_actifs);
                const _idxRef = _effReflArr.findIndex(([,e]) => e.reflexion);
                if (_idxRef !== -1) {
                    const [_cleRef, _effRef] = _effReflArr[_idxRef];
                    const _playerIDRef = (window.perso.nom || '').replace(/\s+/g, '_');
                    // Réfléchir les dégâts sur l'attaquant si instanceId connu
                    if (data.instanceId != null && window.combatActif) {
                        const _ennemisRef = [...(window.combatActif.ennemis || [])];
                        const _idxREnemi = _ennemisRef.findIndex(e => e.instanceId === data.instanceId);
                        if (_idxREnemi !== -1) {
                            _ennemisRef[_idxREnemi].pvActuel = Math.max(0, _ennemisRef[_idxREnemi].pvActuel - degats);
                            db.ref('parties/' + sessionActuelle + '/combat_actif/ennemis').set(_ennemisRef);
                        }
                    }
                    degats = 0;
                    db.ref('parties/' + sessionActuelle + '/joueurs/' + _playerIDRef + '/effets_actifs/' + _cleRef).remove();
                    // Retirer le maintien chez le lanceur si différent
                    if (_effRef.lanceur && _effRef.lanceur !== _playerIDRef) {
                        db.ref('parties/' + sessionActuelle + '/joueurs/' + _effRef.lanceur + '/effets_actifs').once('value', snapL => {
                            const effL = snapL.val() || {};
                            const cleM = Object.keys(effL).find(k => effL[k].reflexion_maintien && effL[k].cible === _playerIDRef);
                            if (cleM) db.ref('parties/' + sessionActuelle + '/joueurs/' + _effRef.lanceur + '/effets_actifs/' + cleM).remove();
                        });
                    }
                    if (typeof _toast === 'function') _toast('🪞 Bouclier de réflexion — sort réfléchi !', 'success');
                    if (typeof _logCombat === 'function') _logCombat(`🪞 ${window.perso.nom} réfléchit le sort !`);
                }
            }

            // 3. Contamination poison (50% de base, réduite par resPoison ; CN ≥ 20 = immunité)
            if (data.element === 'poison' && degats > 0 && !window.perso.poison) {
                const CN = (window.perso.statsBase?.CN || 5) + (window.perso.statsInvesties?.CN || 0);
                if (CN >= 20) {
                    if (typeof _toast === 'function') _toast('🛡 Immunité au poison (CN ≥ 20) !', 'success');
                } else {
                    const resP = window.perso.bonusInnes?.resPoison || 0;
                    const chanceContamination = 50 * (1 - resP / 100);
                    if (Math.random() * 100 < chanceContamination) {
                        window.perso.poison = { chanceGuerison: CN };
                        if (typeof _toast === 'function') _toast('☠ Vous êtes empoisonné !', 'error');
                        if (typeof _logCombat === 'function') {
                            const detail = `☠ ${window.perso.nom} est empoisonné ! (chance contamination: ${Math.round(chanceContamination)}%, CN=${CN})`;
                            _logCombat(`☠ ${window.perso.nom} est empoisonné !`, detail);
                        }
                        if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
                        if (typeof afficherEtatCombat === 'function') afficherEtatCombat();
                    }
                }
            }

            // 4. Usure de l'armure portée
            const armorSlots = ['tete', 'torse', 'gants', 'bottes', 'main_gauche'];
            const perteArmure = data.critique ? 10 : 1;
            armorSlots.forEach(slot => {
                const piece = window.perso.equipement?.[slot];
                if (piece && piece.durabilite !== undefined) {
                    piece.durabilite = Math.max(0, (piece.durabilite || 0) - perteArmure);
                    if (piece.durabilite === 0 && typeof _toast === 'function') {
                        const nomPiece = (typeof itemsData !== 'undefined' && itemsData[piece.id]?.nom) || slot;
                        _toast(`🛡 ${nomPiece} est brisée !`, 'error');
                    }
                }
            });

            valeurEffective = -degats;

            // 2g. Incarnation de Feu : riposte feu personnelle (30%)
            if (degats > 0 && data.instanceId != null && window.perso.effets_actifs &&
                Object.values(window.perso.effets_actifs).some(e => e.incarnation && e.element_incarnation === 'Feu') &&
                window.combatActif) {
                const _riposteFeu = Math.max(1, Math.ceil(degats * 0.30));
                const _ennemisRip = [...(window.combatActif.ennemis || [])];
                const _idxRip = _ennemisRip.findIndex(e => e.instanceId === data.instanceId);
                if (_idxRip !== -1) {
                    _ennemisRip[_idxRip].pvActuel = Math.max(0, _ennemisRip[_idxRip].pvActuel - _riposteFeu);
                    db.ref('parties/' + sessionActuelle + '/combat_actif/ennemis').set(_ennemisRip);
                    if (typeof _logCombat === 'function') _logCombat(`🔥 Incarnation de Feu — riposte ${_riposteFeu} dégâts !`);
                }
            }

            // 2h. Élémentaire de Feu allié : riposte 10% feu sur l'attaquant
            if (degats > 0 && data.instanceId != null && window.combatActif) {
                const _moiIdEF = (window.perso.nom || '').replace(/\s+/g, '_');
                const _elemFeu = (window.combatActif.ordre_jeu || []).find(function(p) {
                    return p.type === 'invoque' && p.riposteFeu && p.invocateurId === _moiIdEF && !p.ko;
                });
                if (_elemFeu) {
                    const _ripEF  = Math.max(1, Math.ceil(degats * 0.10));
                    const _enEF   = (window.combatActif.ennemis || []).slice();
                    const _idxEF  = _enEF.findIndex(function(e) { return e.instanceId === data.instanceId; });
                    if (_idxEF !== -1) {
                        _enEF[_idxEF].pvActuel = Math.max(0, _enEF[_idxEF].pvActuel - _ripEF);
                        db.ref('parties/' + sessionActuelle + '/combat_actif/ennemis').set(_enEF);
                        if (typeof _logCombat === 'function') _logCombat(_elemFeu.nom + ' riposte ' + _ripEF + ' degats de feu sur ' + _enEF[_idxEF].nom + ' !');
                    }
                }
            }
        } // fin !esquive
    }

    window.perso.pvActuel = Math.min(maxPV, Math.max(0, basePV + valeurEffective));
    console.log(`❤️ [DEBUG] PV mis à jour : ${window.perso.pvActuel} / ${maxPV}`);

        // Dégâts de fatigue associés au coup
        if (!esquive && data.valeur < 0 && data.degatsFT) {
            window.perso.ftActuel = Math.max(0, (window.perso.ftActuel ?? maxFT) - data.degatsFT);
            if (typeof _toast === 'function') _toast(`⚡ -${data.degatsFT} FT (coup reçu)`, 'error');
        }

    // Mort en combat : marquer KO dans ordre_jeu
    if (window.perso.pvActuel <= 0 && window.combatActif) {
        const ordreKO = (window.combatActif.ordre_jeu || []).map(p => {
            if (p.type === 'joueur' && p.id === playerID) return Object.assign({}, p, { ko: true, pvActuel: 0 });
            return p;
        });
        db.ref('parties/' + sessionActuelle + '/combat_actif/ordre_jeu').set(ordreKO);
        if (typeof _toast === 'function') _toast('💀 Vous êtes mort !', 'error');
    }
    // Résurrection en combat : effacer le flag KO pour que le joueur puisse agir à nouveau
    if (basePV <= 0 && window.perso.pvActuel > 0 && window.combatActif) {
        const ordreRes = (window.combatActif.ordre_jeu || []).map(p => {
            if (p.type === 'joueur' && p.id === playerID) return Object.assign({}, p, { ko: false, pvActuel: window.perso.pvActuel });
            return p;
        });
        db.ref('parties/' + sessionActuelle + '/combat_actif/ordre_jeu').set(ordreRes);
        if (typeof _toast === 'function') _toast('✨ Ressuscité !', 'success');
    }
}
 else if (data.stat === 'FT') {
            window.perso.ftActuel = (window.perso.ftActuel || maxFT) + data.valeur;
            window.perso.ftActuel = Math.min(maxFT, Math.max(0, window.perso.ftActuel));
            console.log(`🔋 Nouveau FT : ${window.perso.ftActuel}/${maxFT}`);
        }

        // Passer le tour forcé par le MJ → regen PV + FT (ou tick poison si empoisonné)
        if (data.stat === 'passer_tour') {
            if (data.poisonTick && window.perso.poison) {
                // Le MJ a détecté un joueur empoisonné : appliquer le tick localement
                if (typeof _appliquerPoison === 'function') _appliquerPoison();
            } else {
                if (data.pvGain > 0) {
                    window.perso.pvActuel = Math.min(maxPV, (window.perso.pvActuel || 0) + data.pvGain);
                }
                if (data.ftGain > 0) {
                    window.perso.ftActuel = Math.min(maxFT, (window.perso.ftActuel || 0) + data.ftGain);
                }
                if (typeof _toast === 'function') {
                    const msgPT = data.pvGain > 0
                        ? `⏭ Tour passé — +${data.pvGain} PV / +${data.ftGain} FT`
                        : `⏭ Tour passé — rien récupéré`;
                    _toast(msgPT, data.pvGain > 0 ? 'success' : 'info');
                }
            }
        }

        // XP de quête
        if (data.stat === 'XP') {
            if (typeof _gagnerXP === 'function') {
                _gagnerXP(data.valeur);
            } else {
                window.perso.xp = (window.perso.xp || 0) + data.valeur;
                if (typeof autoSave === 'function') autoSave();
            }
            if (typeof _toast === 'function') _toast(`⭐ +${data.valeur} XP (Quête) !`, 'success');
            return; // pas de toast générique
        }

        // Cure poison reçue d'un autre joueur ou d'un item/sort
        if (data.stat === 'curePoison') {
            window.perso.poison = null;
            if (typeof _toast === 'function') _toast('✅ Poison neutralisé !', 'success');
        }

        // --- STATS DE PARTIE ---
        if (typeof _incStatPartie === 'function') {
            if (data.stat === 'PV' && data.valeur < 0) {
                // PV vraiment perdus (après armure/esquive — valeurEffective est négatif si dégâts)
                const perdu = Math.abs(Math.min(0, valeurEffective ?? data.valeur));
                if (perdu > 0) _incStatPartie('pv_perdus', perdu);
            }
        }

        // --- TRAITEMENT ET UI ---
        if (typeof verifierMort === 'function') verifierMort();
        localStorage.setItem('arcanum_sauvegarde', JSON.stringify(window.perso));
        // Sync Firebase (retiré de rafraichirAccueil pour éviter les boucles de listeners)
        if (typeof synchroniserJoueur === 'function') synchroniserJoueur();

        if (typeof rafraichirAccueil === 'function') rafraichirAccueil();
        if (typeof updateFicheUI === 'function') updateFicheUI();

        // Toast dégâts/soin (sauf si toast élément déjà affiché)
        if (!data.element || data.valeur > 0) {
            const msg = (data.valeur > 0) ? `✨ Gain : +${data.valeur} ${data.stat}` : `💥 Perte : ${data.valeur} ${data.stat}`;
            if (typeof _toast === 'function') _toast(msg, data.valeur > 0 ? 'success' : 'error');
        }
    });
}


/**
 * Écoute directement pvActuel et ftActuel depuis Firebase.
 * Mis à jour par synchroniserJoueur() sur n'importe quel appareil.
 * Sert de filet de sécurité pour afficher les vrais chiffres en direct sur l'accueil,
 * sans dépendre uniquement du canal modif_stat.
 */
function activerEcouteurStatsPropres() {
    if (!window.perso || !window.perso.nom) return;
    const playerID = window.perso.nom.replace(/\s+/g, '_');
    const ref = db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID);

    ref.child('pvActuel').off();
    ref.child('pvActuel').on('value', snap => {
        const pv = snap.val();
        if (pv === null || pv === undefined) return;
        if (pv === window.perso.pvActuel) return; // pas de changement, évite la boucle
        window.perso.pvActuel = pv;
        if (typeof rafraichirAccueil === 'function') rafraichirAccueil();
        if (typeof updateFicheUI === 'function') updateFicheUI();
    });

    ref.child('ftActuel').off();
    ref.child('ftActuel').on('value', snap => {
        const ft = snap.val();
        if (ft === null || ft === undefined) return;
        if (ft === window.perso.ftActuel) return;
        window.perso.ftActuel = ft;
        if (typeof rafraichirAccueil === 'function') rafraichirAccueil();
        if (typeof updateFicheUI === 'function') updateFicheUI();
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

    // Nettoyage avant re-registration pour éviter l'accumulation de listeners
    db.ref('parties/' + sessionActuelle + '/joueurs').off();
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
            if (data.stat && !['magie','comp','tech'].includes(data.stat) && comp.statsInvesties) {
                comp.statsInvesties[data.stat] = (comp.statsInvesties[data.stat] || 0) + 1;
                const fo  = (comp.statsBase?.FO || 3) + (comp.statsInvesties?.FO || 0);
                const ini = (comp.statsBase?.IN || 3) + (comp.statsInvesties?.IN || 0);
                const cn  = (comp.statsBase?.CN || 3) + (comp.statsInvesties?.CN || 0);
                comp.pvActuel = (fo * 2) + ini + (comp.boostPV || 0);
                comp.ftActuel = (cn * 2) + ini + (comp.boostFT || 0);
            } else if (data.stat === 'magie' && data.ecole) {
                if (!comp.magieInvesties) comp.magieInvesties = {};
                comp.magieInvesties[data.ecole] = (comp.magieInvesties[data.ecole] || 0) + 1;
            } else if (data.stat === 'comp' && data.competence) {
                if (!comp.compInvesties) comp.compInvesties = {};
                comp.compInvesties[data.competence] = (comp.compInvesties[data.competence] || 0) + 1;
            } else if (data.stat === 'tech' && data.discipline) {
                if (!comp.techInvesties) comp.techInvesties = {};
                comp.techInvesties[data.discipline] = (comp.techInvesties[data.discipline] || 0) + 1;
            }
            if (typeof _toast === 'function') _toast(`🌟 ${comp.nom} monte au niveau ${comp.niveau} !`, 'gold');
            if (typeof verifierBoutonCraft === 'function') verifierBoutonCraft();
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
        else if (data.type === 'item_remove') {
            const comp = comps[data.compIdx];
            if (!comp || !comp.inventaire) return;
            const ii = comp.inventaire.findIndex(i => i.id === data.itemId);
            if (ii !== -1) {
                if ((comp.inventaire[ii].quantite || 1) > 1) comp.inventaire[ii].quantite--;
                else comp.inventaire.splice(ii, 1);
            }
        }
        else if (data.type === 'xp_gain') {
            const comp = comps[data.compIdx];
            if (!comp) return;
            comp.xp = (comp.xp || 0) + (data.montant || 1);
            const needed = 10 + ((comp.niveau || 1) - 1) * 5;
            if (comp.xp >= needed) {
                comp.xp -= needed;
                // Notifier le joueur — c'est le MJ qui choisit la compétence via son panel
                if (typeof _toast === 'function') _toast(`🌟 ${comp.nom} peut monter de niveau ! Le MJ va choisir sa progression.`, 'gold');
            }
            if (typeof _rafraichirJaugeXP === 'function') _rafraichirJaugeXP();
        }
        else if (data.type === 'soin') {
            const comp = comps[data.compIdx];
            if (!comp) return;
            const foComp = (comp.statsBase?.FO || 3) + (comp.statsInvesties?.FO || 0);
            const inComp = (comp.statsBase?.IN || 3) + (comp.statsInvesties?.IN || 0);
            const cnComp = (comp.statsBase?.CN || 3) + (comp.statsInvesties?.CN || 0);
            const pvMaxComp = (foComp * 2) + inComp + (comp.boostPV || 0);
            const ftMaxComp = (cnComp * 2) + inComp + (comp.boostFT || 0);
            if (data.pvGain > 0) comp.pvActuel = Math.min(pvMaxComp, (comp.pvActuel || 0) + data.pvGain);
            if (data.ftGain > 0) comp.ftActuel = Math.min(ftMaxComp, (comp.ftActuel || 0) + data.ftGain);
            if (typeof _toast === 'function') _toast(`💚 ${comp.nom} : +${data.pvGain || 0} PV / +${data.ftGain || 0} FT`, 'success');
        }
        else if (data.type === 'ft_gain') {
            const comp = comps[data.compIdx];
            if (!comp) return;
            const cnComp = (comp.statsBase?.CN || 3) + (comp.statsInvesties?.CN || 0);
            const ftMaxComp = (cnComp * 2) + ((comp.statsBase?.IN || 3) + (comp.statsInvesties?.IN || 0)) + (comp.boostFT || 0);
            comp.ftActuel = Math.min(ftMaxComp, (comp.ftActuel || 0) + (data.montant || 1));
            if (typeof _toast === 'function') _toast(`⚡ ${comp.nom} récupère ${data.montant} FT.`, 'success');
        }
        else if (data.type === 'passer_tour') {
            const comp = comps[data.compIdx];
            if (!comp) return;
            const cnComp = (comp.statsBase?.CN || 3) + (comp.statsInvesties?.CN || 0);
            const inComp = (comp.statsBase?.IN || 3) + (comp.statsInvesties?.IN || 0);
            const foComp = (comp.statsBase?.FO || 3) + (comp.statsInvesties?.FO || 0);
            const ftMaxComp = (cnComp * 2) + inComp + (comp.boostFT || 0);
            const pvMaxComp = (foComp * 2) + inComp + (comp.boostPV || 0);
            const ftGain = data.ftGain || 0;
            const pvGain = data.pvGain || 0;
            comp.ftActuel = Math.min(ftMaxComp, (comp.ftActuel || 0) + ftGain);
            comp.pvActuel = Math.min(pvMaxComp, (comp.pvActuel || 0) + pvGain);
            if (pvGain > 0 || ftGain > 0) {
                if (typeof _toast === 'function') _toast(`${comp.nom} : +${pvGain} PV / +${ftGain} FT`, 'success');
            } else {
                if (typeof _toast === 'function') _toast(`${comp.nom} passe son tour — rien récupéré.`, 'error');
            }
        }

        window.perso.compagnons = comps;
        localStorage.setItem('arcanum_sauvegarde', JSON.stringify(window.perso));
        _syncCompagnonsSummary(); // compagnons d'abord → MJ verra les données à jour
        if (typeof autoSave === 'function') autoSave(); // joueur ensuite → déclenche le on() MJ

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
    console.log('🎮 [COMBAT] activerEcouteurCombat → session:', sessionActuelle);
    const ref = db.ref('parties/' + sessionActuelle + '/combat_actif');
    ref.off();
    ref.on('value', (snapshot) => {
        const data = snapshot.val();
        console.log('🎮 [COMBAT] Firebase event → actif:', data?.actif, '| timestamp:', data?.timestamp);
        if (data && data.actif === true) {
            const ancienTimestamp = window.combatActif?.timestamp || 0;
            const nouveauCombat = !window.combatActif || (data.timestamp && data.timestamp !== ancienTimestamp);
            window.combatActif = data;

            const ecranCombat = document.getElementById('ecran-combat');
            const ecranVisible = ecranCombat && ecranCombat.style.display !== 'none';

            console.log('🎮 [COMBAT] nouveauCombat:', nouveauCombat, '| ecranVisible:', ecranVisible, '| ouvrirEcranCombat défini:', typeof ouvrirEcranCombat === 'function');

            if (nouveauCombat || !ecranVisible) {
                window._combatPremierCoupFait = false;
                window._actionsRapides = { tourKey: -1, max: 1, restantes: 0 };
                if (typeof ouvrirEcranCombat === 'function') {
                    ouvrirEcranCombat();
                } else {
                    console.error('🎮 [COMBAT] ❌ ouvrirEcranCombat introuvable !');
                }
            } else {
                if (typeof afficherEtatCombat === 'function') afficherEtatCombat();
            }
        } else if (window.combatActif) {
            if (typeof quitterEcranCombat === 'function') quitterEcranCombat();
        }
    });
}

/** Ouvre une modale côté joueur pour choisir le bonus de level-up du compagnon. */
function _ouvrirChoixLevelUpCompagnon(compIdx, comp) {
    let modal = document.getElementById('modal-lvup-comp');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-lvup-comp';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }

    const _appliquer = (payload) => {
        const c = window.perso?.compagnons?.[compIdx];
        if (!c) return;
        c.niveau = (c.niveau || 1) + 1;
        if (payload.stat && !['magie','comp','tech'].includes(payload.stat)) {
            if (!c.statsInvesties) c.statsInvesties = {};
            c.statsInvesties[payload.stat] = (c.statsInvesties[payload.stat] || 0) + 1;
            const fo = (c.statsBase?.FO||3)+(c.statsInvesties?.FO||0);
            const ini = (c.statsBase?.IN||3)+(c.statsInvesties?.IN||0);
            const cn = (c.statsBase?.CN||3)+(c.statsInvesties?.CN||0);
            c.pvActuel = (fo*2)+ini+(c.boostPV||0);
            c.ftActuel = (cn*2)+ini+(c.boostFT||0);
        } else if (payload.stat === 'magie' && payload.ecole) {
            if (!c.magieInvesties) c.magieInvesties = {};
            c.magieInvesties[payload.ecole] = (c.magieInvesties[payload.ecole] || 0) + 1;
        } else if (payload.stat === 'comp' && payload.competence) {
            if (!c.compInvesties) c.compInvesties = {};
            c.compInvesties[payload.competence] = (c.compInvesties[payload.competence] || 0) + 1;
        } else if (payload.stat === 'tech' && payload.discipline) {
            if (!c.techInvesties) c.techInvesties = {};
            c.techInvesties[payload.discipline] = (c.techInvesties[payload.discipline] || 0) + 1;
        }
        if (typeof autoSave === 'function') autoSave();
        if (typeof _syncCompagnonsSummary === 'function') _syncCompagnonsSummary();
        if (typeof verifierBoutonCraft === 'function') verifierBoutonCraft();
        if (typeof _toast === 'function') _toast(`🌟 ${c.nom} monte au niveau ${c.niveau} !`, 'gold');
        modal.style.display = 'none';
    };

    let html = `<div style="background:#1a1208;border:2px solid #d4af37;border-radius:8px;padding:20px;max-width:420px;width:92%;max-height:80vh;overflow-y:auto;">
        <h3 style="color:#d4af37;margin:0 0 12px;">🌟 ${comp.nom} — Choisir l'amélioration</h3>`;

    // Stats
    html += `<div class="lvup-section-titre">📊 Stats</div><div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px;">`;
    ['FO','IN','CN','DX','CH'].forEach(s => {
        html += `<button class="comp-levelup-btn" data-action='${JSON.stringify({stat:s})}'>+1 ${s}</button>`;
    });
    html += `</div>`;

    // Compétences
    html += `<div class="lvup-section-titre">⚔ Compétences</div><div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px;">`;
    if (typeof competencesData !== 'undefined') {
        for (let cat in competencesData) {
            competencesData[cat].forEach(c => {
                html += `<button class="comp-levelup-btn" data-action='${JSON.stringify({stat:'comp',competence:c.id})}'>${c.nom}</button>`;
            });
        }
    }
    html += `</div>`;

    // Technologie
    html += `<div class="lvup-section-titre">⚙ Technologie</div><div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px;">`;
    if (typeof techData !== 'undefined') {
        Object.keys(techData).forEach(d => {
            html += `<button class="comp-levelup-btn" data-action='${JSON.stringify({stat:'tech',discipline:d})}'>${d}</button>`;
        });
    }
    html += `</div>`;

    // Magie
    html += `<div class="lvup-section-titre">✨ Magie</div><div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px;">`;
    if (typeof magieData !== 'undefined') {
        Object.keys(magieData).forEach(e => {
            html += `<button class="comp-levelup-btn" data-action='${JSON.stringify({stat:'magie',ecole:e})}'>${e}</button>`;
        });
    }
    html += `</div></div>`;

    modal.innerHTML = html;
    modal.style.display = 'flex';
    modal.addEventListener('click', e => {
        const btn = e.target.closest('[data-action]');
        if (btn) _appliquer(JSON.parse(btn.dataset.action));
    }, { once: true });
}

function activerEcouteurCombatLog() {
    const ref = db.ref('parties/' + sessionActuelle + '/combat_log');
    ref.off();
    ref.on('value', (snapshot) => {
        const logDiv = document.getElementById('combat-log');
        if (!logDiv) return;
        const data = snapshot.val();
        if (!data) { logDiv.innerHTML = ''; return; }
        const entries = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
        logDiv.innerHTML = entries.map(e => {
            const affiche = (window.estMJ && e.detail) ? e.detail : e.texte;
            let cls = 'combat-log-entry';
            if (affiche.includes('ÉCHEC CRITIQUE')) cls += ' log-echec';
            else if (affiche.includes('CRITIQUE')) cls += ' log-critique';
            return `<div class="${cls}">${affiche}</div>`;
        }).join('');
    });
}

/** Pousse les données complètes des compagnons dans parties/{session}/compagnons/{playerID}. */
function _syncCompagnonsSummary() {
    if (!window.perso?.nom || !db) return;
    const playerID = window.perso.nom.replace(/\s+/g, '_');
    const data = (window.perso.compagnons || []).map((c, i) => {
        const cFO  = (c.statsBase?.FO || 5) + (c.statsInvesties?.FO || 0);
        const cIN  = (c.statsBase?.IN || 5) + (c.statsInvesties?.IN || 0);
        const cCN  = (c.statsBase?.CN || 5) + (c.statsInvesties?.CN || 0);
        const cPvMax = (cFO * 2) + cIN + (c.boostPV || 0);
        const cFtMax = (cCN * 2) + cIN + (c.boostFT || 0);
        return {
            recrutee: true,
            proprietaire: playerID,
            idx: i,
            nom: c.nom,
            niveau: c.niveau || 1,
            npcId: c.npcId || null,
            xp: c.xp || 0,
            pvActuel: c.pvActuel ?? cPvMax,
            pvMax: cPvMax,
            ftActuel: c.ftActuel ?? cFtMax,
            ftMax: cFtMax,
            statsBase: c.statsBase || null,
            statsInvesties: c.statsInvesties || null,
            magieInvesties: c.magieInvesties || null,
            compInvesties: c.compInvesties || null,
            inventaire: c.inventaire || null,
            equipement: c.equipement || null,
            estMort: c.estMort || false
        };
    });
    db.ref('parties/' + sessionActuelle + '/compagnons/' + playerID)
      .set(data.length ? data : null);
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
    if (mdpMJ === "PASS") {
        window.estMJ = true;
        sessionStorage.setItem('arcanum_estMJ', '1');
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
    const secQuetes  = document.getElementById('mj-section-quetes');
    const secDonjon  = document.getElementById('mj-section-donjon');

    if(secJoueurs) secJoueurs.style.display = 'none';
    if(secCodex)   secCodex.style.display   = 'none';
    if(secCombat)  secCombat.style.display  = 'none';
    if(secQuetes)  secQuetes.style.display  = 'none';
    if(secDonjon)  secDonjon.style.display  = 'none';

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
    else if (ongletId === 'quetes') {
        if (secQuetes) secQuetes.style.display = 'block';
        if (typeof mjGererQuetes === 'function') mjGererQuetes();
    }
    else if (ongletId === 'donjon') {
        if (secDonjon) secDonjon.style.display = 'block';
        if (typeof mjGererDonjon === 'function') mjGererDonjon();
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
    // Attendre que Firebase auth soit résolu avant toute opération DB
    if (!window.userUID) return;

    // Restaurer le statut MJ après rechargement de page
    if (sessionStorage.getItem('arcanum_estMJ') === '1') {
        window.estMJ = true;
    }

    // Écouteurs "globaux" : toujours enregistrés même sans perso chargé
    // (combat, musique MJ, alertes — reçus par tous les joueurs connectés)
    activerEcouteurCombat();
    activerEcouteurCombatLog();
    activerEcouteurMusiqueMJ();
    activerEcouteurAlertesMJ();
    activerEcouteurKick();

    // Écouteurs qui nécessitent un personnage chargé
    const persoPrep = window.perso && window.perso.nom && window.perso.nom !== "Nom du Personnage";
    if (!persoPrep) {
        console.warn("⚠️ Moteur Multi partiel : personnage non chargé (écouteurs combat/musique actifs).");
        return;
    }

    console.log("🌐 Initialisation du mode multijoueur complète...");
    window._moteurMultiComplet = true; // flag pour autoSave — évite relance inutile

    // 2. REPLANTAGE DES ÉCOUTEURS (Les antennes)
    activerEcouteurCadeaux();
    activerEcouteurArgent();
    activerEcouteurStats();
    activerEcouteurEffets();
    activerEcouteurStatsPropres();
    activerEcouteurDeplacementGroupe();
    activerEcouteurPartageLieux();
    activerEcouteurCommandesMJ();
    activerEcouteurCompagnons();
    _syncCompagnonsSummary();
    activerEcouteurVolATire();
    activerEcouteurQuetes();
    activerEcouteurDonjon();
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

    const modal = document.getElementById('modal-transfert');
    const _reset = () => { objetEnCoursDeDon = null; quantiteEnCoursDeDonMJ = 1; if (modal) modal.style.display = 'none'; };

    // Cas compagnon : destinataireID = 'comp_{ownerID}_{compIdx}'
    if (destinataireID.startsWith('comp_')) {
        const parts = destinataireID.split('_');
        // format: comp_{ownerID}_{compIdx} — ownerID peut contenir des _
        const compIdx = parseInt(parts[parts.length - 1]);
        const ownerID = parts.slice(1, -1).join('_');
        db.ref('parties/' + sessionActuelle + '/joueurs/' + ownerID + '/compagnon_action').set({
            type: 'item_add',
            compIdx,
            itemId: objetEnCoursDeDon,
            quantite: quantiteEnCoursDeDonMJ || 1,
            timestamp: Date.now()
        }).then(() => {
            if (typeof _toast === 'function') _toast(`✅ Objet envoyé au compagnon !`, 'success');
            _reset();
        });
        return;
    }

    // Cas joueur normal
    db.ref('parties/' + sessionActuelle + '/joueurs/' + destinataireID + '/cadeau').set({
        id: objetEnCoursDeDon,
        qte: quantiteEnCoursDeDonMJ || 1,
        expediteur: "Le Maître du Jeu",
        timestamp: Date.now()
    }).then(() => {
        if (typeof _toast === 'function') _toast(`✅ Objet envoyé à ${destinataireID.replace(/_/g, ' ')} !`, 'success');
        _reset();
    }).catch(err => { console.error("Erreur don MJ:", err); });
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