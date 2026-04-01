



let estMuet = false;
function toggleMute() {
    estMuet = !estMuet;
    AudioEngine.setVolume(estMuet ? 0 : 0.3);
    document.getElementById('btn-audio').innerText = estMuet ? "🔇" : "🔊";
}




const AudioEngine = {
    musiqueActuelle: null,
    volumeCible: 0.3,
    fadeInterval: null,

    // NOUVELLE MÉTHODE POUR FORCER LE DÉBLOCAGE
    debloquer() {
        if (this.musiqueActuelle && this.musiqueActuelle.paused) {
            console.log("🔓 AudioEngine : Tentative de reprise de la lecture bloquée...");
            this.musiqueActuelle.play().catch(e => console.error("Échec définitif :", e));
            
            // On relance le fade in pour que ce ne soit pas brutal
            this.lancerFadeIn();
        }
    }, // <-- VIRGULE OBLIGATOIRE

    // --- DANS audio.js ---
jouerMusique(nomFichier) {
    // 🛡️ SÉCURITÉ MORT : Si le perso est mort, on refuse de jouer quoi que ce soit
    if (window.perso && (window.perso.pvActuel <= 0 || window.perso.estMort)) {
        console.log("🚫 [AudioEngine] Lecture bloquée : Vous êtes mort.");
        this.stopMusique(); // Sécurité supplémentaire pour couper un son en cours
        return; 
    }

    console.log("🎤 AudioEngine reçoit l'ordre de jouer : " + nomFichier);
    // ... reste de ta fonction ...

        const url = `./docs/audio/${nomFichier}`;
        

        // Sécurité si le fichier est déjà en train de jouer
        if (this.musiqueActuelle && this.musiqueActuelle.src.includes(nomFichier)) return;

        clearInterval(this.fadeInterval);
        if (this.musiqueActuelle) {
            this.fadeInterval = setInterval(() => {
                if (this.musiqueActuelle.volume > 0.02) {
                    this.musiqueActuelle.volume -= 0.02;
                } else {
                    clearInterval(this.fadeInterval);
                    this.musiqueActuelle.pause();
                    this.lancerNouvellePiste(url);
                }
            }, 30);
        } else {
            this.lancerNouvellePiste(url);
        }
    }, // <-- VIRGULE OBLIGATOIRE

    lancerNouvellePiste(url) {
        console.log("🚀 Création de l'objet Audio : " + url);
        this.musiqueActuelle = new Audio(url);
        this.musiqueActuelle.loop = true;
        this.musiqueActuelle.volume = 0;
        
        // On tente de jouer, mais on lance le fade quoi qu'il arrive
        this.musiqueActuelle.play().then(() => {
            console.log("✅ Lecture réussie immédiatement.");
        }).catch(e => {
            console.warn("⚠️ Audio bloqué au chargement, en attente du clic.");
        });

        // L'intervalle de volume montera le son dès que le play() réussira
        this.lancerFadeIn();
    }, // <-- VIRGULE OBLIGATOIRE

    lancerFadeIn() {
        clearInterval(this.fadeInterval);
        this.fadeInterval = setInterval(() => {
            if (this.musiqueActuelle && this.musiqueActuelle.volume < this.volumeCible) {
                this.musiqueActuelle.volume = Math.min(this.musiqueActuelle.volume + 0.01, this.volumeCible);
            } else {
                clearInterval(this.fadeInterval);
            }
        }, 50);
    }, // <-- VIRGULE OBLIGATOIRE

    setVolume(val) {
        this.volumeCible = val;
        if (this.musiqueActuelle) {
            this.musiqueActuelle.volume = val;
        }
    }, // <-- VIRGULE OBLIGATOIRE

    playSFX(nomFichier) {
        console.log("🔊 SFX : " + nomFichier);
        const sfx = new Audio('./docs/audio/sfx/' + nomFichier);
        sfx.volume = 0.4;
        sfx.play().catch(e => console.warn("Erreur SFX:", e));
    }, // <-- VIRGULE OBLIGATOIRE

    stopMusique() {
        if (this.musiqueActuelle) {
            this.musiqueActuelle.pause();
            this.musiqueActuelle = null;
            clearInterval(this.fadeInterval);
        }
    }
};



// --- FONCTIONS MJ : MUSIQUE ---
function mjChangerMusique(fichier) {
    console.log("🎵 [MJ] Changement de piste : " + fichier);
    db.ref('parties/' + sessionActuelle + '/musique_mj').set({
        fichier: fichier,
        timestamp: Date.now()
    });
}

function mjArreterMusique() {
    console.log("⏹ [MJ] Arrêt de la musique globale.");
    db.ref('parties/' + sessionActuelle + '/musique_mj').remove();
}

