
function deplacerVers(idLieu) {
    const lieu = locations[idLieu] || lieuxDecouverts[idLieu];
    if (!lieu) return;

    // Si on est en multi, on déplace tout le monde
    if (typeof deplacerToutLeGroupe === "function") {
        deplacerToutLeGroupe(idLieu);
    } else {
        // Mode solo classique
        perso.lieuActuel = idLieu;
        if (!perso.lieuxConnus.includes(idLieu)) {
            perso.lieuxConnus.push(idLieu);
        }
        if (lieu.musique) AudioEngine.jouerMusique(lieu.musique);
        autoSave();
        rafraichirAccueil();
    }
}


// Fonction pour forcer l'apparition d'un lieu sur la carte (MJ)
function mjDecouvrirLieu(idLieu) {
    // 1. Le MJ l'ajoute à sa propre liste s'il ne l'a pas
    if (!perso.lieuxConnus.includes(idLieu)) {
        perso.lieuxConnus.push(idLieu);
    }

    // 2. PARTAGE MONDIAL : On écrit dans la branche partagée par tous
    // C'est ce qui déclenchera l'écouteur 'child_added' chez tous les joueurs
    db.ref('parties/' + sessionActuelle + '/lieux_shared/' + idLieu).set({
        nom: idLieu,
        decouvertPar: "Maître du Jeu",
        timestamp: Date.now()
    });

    // 3. Sauvegarde et feedback
    if (typeof autoSave === "function") autoSave();
    console.log("📍 Lieu partagé avec le groupe : " + idLieu);
    alert("📍 Vous avez révélé " + idLieu + " à tous les joueurs.");
}



function ouvrirCarte() {
    // Sécurité de base
    if (!perso) perso = { lieuxConnus: [] };
    if (!perso.lieuxConnus) perso.lieuxConnus = [];

    cacherTout();
    const ecran = document.getElementById('ecran-carte');
    if (ecran) {
        ecran.style.display = 'block';
        rafraichirPointsCarte();

        // --- OUTIL DE MJ : RÉCUPÉRER LES COORDONNÉES ---
        // On cible le conteneur complet (comme ça, vitre ou pas, ça marche)
        const conteneur = document.getElementById('conteneur-carte');
        if (conteneur) {
            conteneur.onclick = function(e) {
                // Si tu cliques sur une étiquette ou un point existant, on ignore
                if (e.target.style.cursor === "pointer" && e.target.id !== "calque-points") return;

                let rect = conteneur.getBoundingClientRect();
                let x = ((e.clientX - rect.left) / rect.width) * 100;
                let y = ((e.clientY - rect.top) / rect.height) * 100;
                
                // Affiche dans F12 en vert pomme pour bien le voir
                console.log(`%c📍 Clic aux coordonnées : x: ${x.toFixed(1)}, y: ${y.toFixed(1)}`, 'background: #222; color: #bada55; font-size: 14px;');
                
                // Pop-up direct sur ton écran !
               // alert(`Nouveau Lieu :\nx: ${x.toFixed(1)}\ny: ${y.toFixed(1)}`);
            };
        }
    }
}


// --- DESSINER LES POINTS SUR LE PNG ---


function mjpartagerlieu() {
    // On récupère le perso via window pour être sûr d'avoir les données à jour
    const p = window.perso || perso;
    const session = sessionActuelle || document.getElementById('input-session')?.value;

    if (!p || !p.lieuxConnus || p.lieuxConnus.length === 0) {
        console.error("❌ Erreur : Aucun lieu connu trouvé dans ton profil perso.");
        return;
    }

    console.log(`📡 Tentative de partage de ${p.lieuxConnus.length} lieux sur la session : ${session}`);

    p.lieuxConnus.forEach(idLieu => {
        // Envoi direct à Firebase
        db.ref('parties/' + session + '/lieux_shared/' + idLieu).set({
            nom: idLieu,
            decouvertPar: "Maître du Jeu (Sync Globale)",
            timestamp: Date.now()
        }).then(() => {
            console.log("✅ Partagé : " + idLieu);
        }).catch(err => {
            console.error("❌ Échec pour " + idLieu, err);
        });
    });
}

function AllLieux() {
    // 1. On récupère la session
    const session = sessionActuelle || document.getElementById('input-session')?.value;
    
    if (!session) {
        console.error("❌ Erreur : Aucune session de jeu détectée.");
        return;
    }

    console.log(`🚀 Lancement du test : Partage de TOUS les lieux sur la session [${session}]...`);

    // 2. On boucle sur l'objet de données que tu as fourni
    // 'lieuxDecouverts' est le nom de ton objet contenant Tarante, Tris, etc.
    for (let idLieu in lieuxDecouverts) {
        
        // Envoi à Firebase dans la branche partagée
        db.ref('parties/' + session + '/lieux_shared/' + idLieu).set({
            nom: lieuxDecouverts[idLieu].nom,
            decouvertPar: "Test Système",
            timestamp: Date.now()
        }).then(() => {
            console.log("✅ Envoyé : " + idLieu);
        }).catch(err => {
            console.error("❌ Échec pour " + idLieu, err);
        });
    }

    alert("⚙️ Test lancé ! Vérifie la console (F12) et la carte des autres joueurs.");
}


function RAZLieux() {
    const session = sessionActuelle || document.getElementById('input-session')?.value;
    
    if (!session) {
        console.error("❌ Erreur : Session introuvable.");
        return;
    }

    if (!confirm("⚠️ RESET TOTAL : Supprimer tous les lieux partagés (sauf crash) ?")) return;

    // 1. On vide d'abord LOCALEMENT (très important)
    window.perso.lieuxConnus = ["crash"];
    perso.lieuxConnus = ["crash"];

    // 2. Nettoyage Firebase
    db.ref('parties/' + session + '/lieux_shared').remove()
    .then(() => {
        console.log("🗑️ Firebase vidé.");
        
        // 3. On recrée uniquement le crash sur Firebase
        // Cela va redéclencher l'écouteur 'child_added' chez tout le monde
        return db.ref('parties/' + session + '/lieux_shared/crash').set({
            nom: "Site du Crash",
            decouvertPar: "Système (Reset)",
            timestamp: Date.now()
        });
    })
    .then(() => {
        // 4. Sauvegarde et Rafraîchissement
        if (typeof autoSave === "function") autoSave();
        
        // On force le rafraîchissement de la carte si elle est ouverte
        if (typeof rafraichirPointsCarte === "function") rafraichirPointsCarte();
        
        alert("✅ Carte réinitialisée avec succès !");
    })
    .catch(err => console.error("❌ Erreur lors du reset :", err));
}
let lieuSelectionne = null; // Stocke le lieu cliqué une fois (le point jaune)




function rafraichirPointsCarte() {
    const calque = document.getElementById('calque-points');
    if (!calque) return;
    calque.innerHTML = ""; 
    lieuSelectionne = null; // On réinitialise la sélection à chaque ouverture

    // --- 1. AFFICHAGE PAR DÉFAUT (Le lieu Actuel) ---
    const infoBox = document.getElementById('carte-info');
    const lieuActuelData = lieuxDecouverts[perso.lieuActuel];
    
    if (infoBox && lieuActuelData) {
        infoBox.innerHTML = `<strong style="color:#4caf50;">[VOUS ÊTES ICI] ${lieuActuelData.nom}</strong> : ${lieuActuelData.desc}`;
    }

    // --- 2. GESTION DU CLIC SUR LE FOND DE CARTE ---
    document.getElementById('conteneur-carte').onclick = function(e) {
        if (e.target.id === 'conteneur-carte' || e.target.id === 'img-carte' || e.target.id === 'calque-points') {
            // Si on clique dans le vide, on annule la sélection jaune et on redessine
            lieuSelectionne = null;
            rafraichirPointsCarte(); 
        }
    };

    // --- 3. DESSIN DES POINTS ---
    (perso.lieuxConnus || []).forEach(idLieu => {
        let coord = lieuxDecouverts[idLieu];
        if (!coord) return;

        let marqueurGroup = document.createElement('div');
        marqueurGroup.style.position = "absolute";
        marqueurGroup.style.left = coord.x + "%";
        marqueurGroup.style.top = coord.y + "%";
        marqueurGroup.style.transform = "translate(-50%, -50%)";
        marqueurGroup.style.cursor = "pointer";
        marqueurGroup.style.zIndex = "10";
        marqueurGroup.title = coord.nom; 

        let point = document.createElement('div');
        point.className = "point-carte-physique"; 
        point.dataset.id = idLieu; // On stocke l'ID dans le HTML pour le retrouver facilement
        point.style.width = "12px"; 
        point.style.height = "12px";
        point.style.borderRadius = "50%";
        point.style.border = "2px solid white";
        point.style.transition = "background 0.2s, box-shadow 0.2s";
        
        // COULEUR INITIALE 
        if (idLieu === perso.lieuActuel) {
            point.style.background = "#4caf50"; // VERT (Position actuelle)
            point.style.boxShadow = "0 0 10px #4caf50";
        } else {
            point.style.background = "#ff4444"; // ROUGE (Autres lieux)
            point.style.boxShadow = "0 0 8px rgba(255, 68, 68, 0.8)";
        }

        marqueurGroup.appendChild(point);

        // --- 4. LOGIQUE DES CLICS SUR LES POINTS ---
        marqueurGroup.onclick = (e) => {
            e.stopPropagation(); // Empêche le clic de se propager au fond de carte

            // CAS A : On clique sur le lieu où on est DÉJÀ (Vert)
            if (idLieu === perso.lieuActuel) {
                lieuSelectionne = null; 
                rafraichirPointsCarte(); // On redessine pour annuler d'éventuels points jaunes
                return; // On arrête là, le point reste vert
            }

   // CAS B : On clique sur un point Jaune (Deuxième clic = VOYAGE GROUPE)
            if (lieuSelectionne === idLieu) {
                // 👉 ON UTILISE LA FONCTION DE GROUPE AU LIEU DE JUSTE CHANGER LE PERSO
                if (typeof deplacerToutLeGroupe === "function") {
                    deplacerToutLeGroupe(idLieu); 
                } else {
                    // Sécurité si le mode multi n'est pas chargé
                    perso.lieuActuel = idLieu;
                    if (coord.musique) AudioEngine.jouerMusique(coord.musique);
                    //autoSave();
                    appliquerFondActuel();
                    rafraichirAccueil();
                    allerAccueil();
                }
                
                console.log("Le groupe voyage vers : " + coord.nom);
            }
            // CAS C : On clique sur un point Rouge (Premier clic = SÉLECTION)
            else {
                lieuSelectionne = idLieu;
                
                // On met à jour les couleurs de TOUS les points
                document.querySelectorAll('.point-carte-physique').forEach(p => {
                    let pid = p.dataset.id;
                    if (pid === perso.lieuActuel) {
                        p.style.background = "#4caf50"; // Le lieu actuel reste VERT
                        p.style.boxShadow = "0 0 10px #4caf50";
                    } else if (pid === lieuSelectionne) {
                        p.style.background = "#ffff00"; // La nouvelle cible devient JAUNE
                        p.style.boxShadow = "0 0 15px #ffff00";
                    } else {
                        p.style.background = "#ff4444"; // Les autres (re)deviennent ROUGES
                        p.style.boxShadow = "0 0 5px rgba(255,0,0,0.5)";
                    }
                });

                // Mise à jour de la zone de texte en bas avec la description de la cible
                if(infoBox) {
                    infoBox.innerHTML = `<b style="color:#ffff00;">${coord.nom}</b><br>${coord.desc}<br><i style="font-size:0.9em; color:#aaa;">(Cliquez à nouveau pour voyager)</i>`;
                }
            }
        };

        calque.appendChild(marqueurGroup);
    });
}
