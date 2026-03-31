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
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

db.ref('parties/session1/musique_mj').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data && data.fichier) {
        console.log("Le MJ change l'ambiance : " + data.fichier);
        AudioEngine.jouerMusique(data.fichier);
    }
});



// Fonction pour envoyer les données du joueur à la base de données
function synchroniserJoueur() {
    if (!perso || !perso.nom || perso.nom === "Nom du Personnage") return;

    // On crée un identifiant unique pour le joueur (on nettoie le nom pour éviter les bugs)
    const playerID = perso.nom.replace(/\s+/g, '_');

    db.ref('parties/session1/joueurs/' + playerID).set({
        nom: perso.nom,
        pv: (perso.statsBase.FO * 2) + (perso.statsBase.IN) + (perso.boostPV || 0),
        ft: (perso.statsBase.CN * 2) + (perso.statsBase.IN) + (perso.boostFT || 0),
        niveau: perso.niveau,
        lieu: perso.lieuActuel,
        lastUpdate: Date.now()
    });
}


function ouvrirInterfaceMJ() {
    updateSessionName(); // On récupère le nom du groupe tapé dans l'accueil
    
    cacherTout();
    document.getElementById('ecran-mj').style.display = 'block';

    // On écoute la session spécifique 👇
    db.ref('parties/' + sessionActuelle + '/joueurs').on('value', (snapshot) => {
        // ... (le reste de ton code actuel pour afficher les cartes joueurs)
    });
}

// N'oublie pas de modifier aussi le mjChangerMusique
function mjChangerMusique(nomFichier) {
    updateSessionName();
    db.ref('parties/' + sessionActuelle + '/musique_mj').set({
        fichier: nomFichier,
        timestamp: Date.now()
    });
}

// Variable globale pour la session (par défaut session1)
let sessionActuelle = "session1";

// Fonction pour mettre à jour la session depuis l'input
function updateSessionName() {
    const input = document.getElementById('input-session');
    if (input && input.value.trim() !== "") {
        // On nettoie le nom (pas d'espaces, pas de caractères spéciaux pour Firebase)
        sessionActuelle = input.value.trim().replace(/[^a-zA-Z0-9]/g, "_");
        console.log("Session connectée : " + sessionActuelle);
    }
}

// MODIFIE ta fonction de synchronisation pour utiliser la variable
function synchroniserJoueur() {
    if (!perso || !perso.nom || perso.nom === "Nom du Personnage") return;
    
    updateSessionName(); // On vérifie le nom du groupe avant d'envoyer

    const playerID = perso.nom.replace(/\s+/g, '_');
    
    // On utilise sessionActuelle ici 👇
    db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID).set({
        nom: perso.nom,
        pv: (perso.statsBase.FO * 2) + (perso.statsBase.IN) + (perso.boostPV || 0),
        ft: (perso.statsBase.CN * 2) + (perso.statsBase.IN) + (perso.boostFT || 0),
        niveau: perso.niveau,
        lieu: perso.lieuActuel,
        lastUpdate: Date.now()
    });
}