// --- FONCTION MJ : OUVRIR LE CODEX ---

// Fonction pour filtrer la recherche
function filtrerCodexMJ() {
    let input = document.getElementById('recherche-codex-mj').value.toLowerCase();
    let lignes = document.querySelectorAll('#tbody-codex-mj tr');
    lignes.forEach(l => l.style.display = l.innerText.toLowerCase().includes(input) ? "" : "none");
}

// Petite fonction pour donner un objet sans avoir à taper l'ID (depuis la liste)
// Variable globale pour stocker la quantité choisie par le MJ

function mjDonnerObjetDirect(itemID) {
    const data = itemsData[itemID];
    if (!data) return;

    objetEnCoursDeDon = itemID;
    quantiteEnCoursDeDonMJ = 1; // Valeur par défaut

    // Si l'objet est stackable, on demande combien en donner
    if (data.stackable) {
        let rep = prompt(`Combien de "${data.nom}" voulez-vous donner ?`, "1");
        if (rep === null) return; // Annulation
        
        let qte = parseInt(rep);
        if (isNaN(qte) || qte <= 0) {
            alert("Quantité invalide.");
            return;
        }
        quantiteEnCoursDeDonMJ = qte;
    }

    // On ouvre la modale pour choisir le destinataire
    db.ref('parties/' + sessionActuelle + '/joueurs').once('value', (snapshot) => {
        const joueurs = snapshot.val();
        const liste = document.getElementById('liste-destinataires');
        const titre = document.querySelector('#modal-transfert h3');
        
        if (titre) titre.innerText = `Donner ${quantiteEnCoursDeDonMJ}x ${data.nom} à :`;
        liste.innerHTML = "";

        if (!joueurs) {
            liste.innerHTML = "<p style='color:#aaa;'>Aucun joueur connecté.</p>";
        } else {
            for (let id in joueurs) {
                liste.innerHTML += `
                    <button onclick="executerDonObjetMJ('${id}')" 
                            style="background:#4caf50; color:white; padding:10px; border:none; border-radius:5px; cursor:pointer; margin-bottom:5px; width:100%;">
                        ${joueurs[id].nom}
                    </button>`;
            }
        }
        document.getElementById('modal-transfert').style.display = 'block';
    });
}




// Fonction Musique intégrée (inspirée de ton codex.js)





function genererMusiquesMJ_Integrated() {
    const tbody = document.getElementById('tbody-codex-mj');
    tbody.innerHTML = ""; 

    // 1. BOUTON STOP EN HAUT
    let trStop = document.createElement('tr');
    trStop.innerHTML = `
        <td colspan="2" style="padding:15px; text-align:center; border-bottom: 2px solid #8b0000;">
            <button onclick="mjArreterMusique()" 
                    style="background:#8b0000; color:white; border:none; padding:12px; cursor:pointer; font-weight:bold; border-radius:5px; width:100%;">
                ⏹ ARRÊTER LA MUSIQUE MJ (Tout le groupe)
            </button>
        </td>`;
    tbody.appendChild(trStop);

    // 2. LA LISTE
    playlistMJ.forEach(piste => {
        tbody.innerHTML += `
            <tr style="border-bottom: 1px solid #333;">
                <td style="padding: 10px; color: #fff;">🎵 ${piste.nom}</td>
                <td style="padding: 10px; text-align: right;">
                    <button onclick="mjChangerMusique('${piste.fichier}')" 
                            style="padding: 5px 12px; cursor: pointer; background: #4caf50; color: white; border: none; border-radius: 3px;">
                        ▶ Lancer
                    </button>
                </td>
            </tr>`;
    });
}

// Fonction pour envoyer l'ordre d'arrêt
function mjArreterMusique() {
    db.ref('parties/' + sessionActuelle + '/musique_mj').remove();
}

function genererContenuCodexMJ(type) {
    const tbody = document.getElementById('tbody-codex-mj');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (type === 'items') {
        for (let id in itemsData) {
            ajouterLigneCodexMJ(id, itemsData[id].nom, `mjDonnerObjetDirect('${id}')`, "🎁 Donner");
        }
    } 
    else if (type === 'marchands') {
        for (let id in marchandsData) {
            ajouterLigneCodexMJ(id, marchandsData[id].nom, `forcerOuvertureMarchand('${id}')`, "💰 Ouvrir");
        }
    } 
    else if (type === 'coffres') {
        for (let id in coffresFixes) {
            ajouterLigneCodexMJ(id, coffresFixes[id].nom, `forcerOuvertureCoffre('${id}')`, "🔍 Fouiller");
        }
    }
    else if (type === 'lieux') {
        for (let id in lieuxDecouverts) {
            let l = lieuxDecouverts[id];
            ajouterLigneCodexMJ(id, l.nom, `mjDecouvrirLieu('${id}')`, "📍 Révéler");
        }
    }
}

function rafraichirListeJoueursMJ() {
    const container = document.getElementById('mj-liste-joueurs');
    if (!container) return;

    console.log("👥 [LOG] Mise à jour de la liste des joueurs MJ...");

    db.ref('parties/' + sessionActuelle + '/joueurs').on('value', (snapshot) => {
        const joueurs = snapshot.val();
        container.innerHTML = "";

        if (!joueurs) return;

        for (let id in joueurs) {
            const j = joueurs[id];
            const estMort = (j.pvActuel <= 0);
            
            container.innerHTML += `
                <div class="mj-player-card" style="background:rgba(0,0,0,0.4); border:1px solid #444; padding:10px; margin:5px; border-radius:5px;">
                    <div style="display:flex; justify-content:space-between;">
                        <strong style="color:#ff9800;">${j.nom}</strong>
                        <span style="font-size:10px; color:#aaa;">Niv.${j.niveau || 1}</span>
                    </div>
                    
                    <div style="margin: 5px 0; font-size: 13px;">
                        <span style="color:${estMort ? 'red' : '#4caf50'}">❤️ PV: ${j.pvActuel}/${j.pvMax}</span> | 
                        <span style="color:#2196f3">🔋 FT: ${j.ftActuel}/${j.ftMax || '??'}</span>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px; margin-top:5px;">
                        <button onclick="mjModifierStat('${id}', 'PV')" style="background:#2e7d32; color:white; border:none; padding:4px; cursor:pointer; font-size:11px;">+/- ❤️ PV</button>
                        <button onclick="mjModifierStat('${id}', 'FT')" style="background:#1565c0; color:white; border:none; padding:4px; cursor:pointer; font-size:11px;">+/- 🔋 FT</button>
                        <button onclick="mjDonnerLevelUp('${j.nom}')" style="grid-column: span 2; background:#ff9800; color:black; border:none; padding:4px; cursor:pointer; font-size:11px; font-weight:bold;">🌟 LEVEL UP</button>
                        <button onclick="mjKickJoueur('${id}', '${j.nom}')" style="grid-column: span 2; background:#5a0000; color:#ff6b6b; border:1px solid #8b0000; padding:4px; cursor:pointer; font-size:11px;">🚫 Expulser de la session</button>
                    </div>
                </div>
            `;
        }
    });
}


function mjKickJoueur(playerID, nomJoueur) {
    if (!confirm(`Expulser ${nomJoueur} de la session ?`)) return;

    // 1. On écrit le flag kick — le joueur l'écoute et se déconnecte proprement
    db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/kick').set(true)
      .then(() => {
          // 2. Après 2s (le temps que le joueur reçoive le signal), on supprime son nœud
          setTimeout(() => {
              db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID).remove();
          }, 2000);
      });
}

function mjLootAleatoire(idJoueur) {
    // On filtre les objets "communs" (rareté < 5)
    const itemsDispo = Object.values(itemsData).filter(i => (i.rarete || 0) < 5);
    const nbItems = Math.floor(Math.random() * 4) + 1; // 1d4
    
    for(let i=0; i < nbItems; i++) {
        const randomItem = itemsDispo[Math.floor(Math.random() * itemsDispo.length)];
        
        // On l'envoie directement dans les cadeaux du joueur
        db.ref('parties/' + sessionActuelle + '/cadeaux/' + idJoueur).push({
            from: "Le Destin (MJ)",
            item: { id: randomItem.id, quantite: 1, durabilite: 100, durabiliteMax: 100 },
            timestamp: Date.now()
        });
    }
    alert(`🎲 ${nbItems} objets envoyés à l'aventurier !`);
}



// Utilitaire pour créer les lignes avec un style uniforme
function ajouterLigneCodexMJ(id, nom, actionFn, texteAction) {
    const tbody = document.getElementById('tbody-codex-mj');
    tbody.innerHTML += `
        <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 10px; color: #ffb74d; font-family: monospace; font-size: 0.8em; width: 80px;">${id}</td>
            <td style="padding: 10px; color: #fff;">${nom}</td>
            <td style="padding: 10px; text-align:right;">
                <button onclick="${actionFn}" style="background: #444; color: #ff9800; border: 1px solid #ff9800; padding: 5px 10px; cursor: pointer; border-radius: 3px; font-size: 0.8em;">
                    ${texteAction}
                </button>
            </td>
        </tr>`;
}




