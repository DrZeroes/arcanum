



let estMuet = false;
function toggleMute() {
    estMuet = !estMuet;
    AudioEngine.setVolume(estMuet ? 0 : 0.3);
    document.getElementById('btn-audio').innerText = estMuet ? "🔇" : "🔊";
}




const AudioEngine = {
    musiqueActuelle: null,
    volumeCible: 0.3, // Le volume que tu souhaites au final
    fadeInterval: null,

    jouerMusique(nomFichier) {
        const url = `./docs/audio/${nomFichier}`;
        
        // Sécurité : Si c'est déjà la même musique qui tourne, on ignore
        if (this.musiqueActuelle && this.musiqueActuelle.src.includes(nomFichier)) return;

        // On arrête tout fondu en cours avant de commencer
        clearInterval(this.fadeInterval);

        if (this.musiqueActuelle) {
            // FADE OUT (Sortie)
            this.fadeInterval = setInterval(() => {
                if (this.musiqueActuelle.volume > 0.02) {
                    this.musiqueActuelle.volume -= 0.02;
                } else {
                    clearInterval(this.fadeInterval);
                    this.musiqueActuelle.pause();
                    this.lancerNouvellePiste(url);
                }
            }, 30); // 30ms pour un fondu plus réactif
        } else {
            this.lancerNouvellePiste(url);
        }
    },

    lancerNouvellePiste(url) {
        this.musiqueActuelle = new Audio(url);
        this.musiqueActuelle.loop = true;
        this.musiqueActuelle.volume = 0;
        
        // Jouer la musique (catch pour l'interaction navigateur)
        this.musiqueActuelle.play().catch(e => {
            console.warn("L'audio attend un clic utilisateur pour démarrer.");
        });

        // FADE IN (Entrée)
        this.fadeInterval = setInterval(() => {
            if (this.musiqueActuelle.volume < this.volumeCible) {
                // On augmente progressivement vers le volume cible
                let nouveauVol = this.musiqueActuelle.volume + 0.01;
                this.musiqueActuelle.volume = Math.min(nouveauVol, this.volumeCible);
            } else {
                clearInterval(this.fadeInterval);
            }
        }, 50);
    },

	setVolume(val) {
        this.volumeCible = val;
        // Si une musique joue déjà, on ajuste son volume immédiatement
        if (this.musiqueActuelle) {
            this.musiqueActuelle.volume = val;
        }
    },


    stopMusique() {
        if (this.musiqueActuelle) {
            this.musiqueActuelle.pause();
            this.musiqueActuelle = null;
            clearInterval(this.fadeInterval);
        }
    }
};

