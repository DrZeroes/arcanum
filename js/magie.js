const magieData = {
    "Déplacement": {
        desc: "Les arcanes du Déplacement regroupent les sortilèges liés aux mouvements et aux déplacements d'",
        sorts: [
            { nom: "Désarmement", niv: 1, int: 6, cout: 2, desc: " Force la cible à lâcher son arme si elle échoue à résister." },
            { nom: "Déverrouillage", niv: 1, int: 9, cout: 5, desc: "Ouvre magiquement les portes et conteneurs normaux." },
            { nom: "Choc", niv: 5, int: 12, cout: 10, degats: 2, desc: "Repousse violemment une cible en arrière." },
            { nom: "Distorsion spatiale", niv: 10, int: 15, cout: 10, desc: "Vous téléporte instantanément sur une courte distance." },
            { nom: "Téléportation", niv: 15, int: 18, cout: 20, desc: "Vous transporte instantanément vers un lieu déjà visité." }
        ]
    },
    "Divination": {
        desc: "Sortilèges permettant d'obtenir des informations ou des connaissances.",
        sorts: [
            { nom: "Détection de l'alignement", niv: 1, int: 6, cout: 2, desc: "Révèle l’alignement d’une créature." },
            { nom: "Perception du contenu", niv: 1, int: 9, cout: 2, desc: "Permet de voir l’inventaire de la cible." },
            { nom: "Perception de l'aura", niv: 5, int: 12, cout: 5, desc: "Révèle certains attributs cachés de la cible." },
            { nom: "Détection de l'invisible", niv: 10, int: 15, cout: 10, desc: "Permet de voir créatures et objets invisibles." },
            { nom: "Identification", niv: 15, int: 18, cout: 15, desc: "Identifie toutes les propriétés magiques d’un objet." }
        ]
    },
    "Air": {
        desc: "Ecole basée sur la manipulation de l’élément air. La plupart des sorts sont surtout défensif, mais il y a quelques sort plus ou moins offensifs.",
        sorts: [
            { nom: "Vitalité de l'Air", niv: 1, int: 6, cout: 5, desc: "Augmente la constitution de la cible" },
            { nom: "Vapeurs toxiques", niv: 1, int: 9, cout: 5, degats: 8,desc: "Crée un nuage de gaz qui inflige des dégâts si la cible ne résiste pas." },
            { nom: "Rafale de vent", niv: 5, int: 12, cout: 10, degats: 15,desc: "Génère une rafale qui projette objets et créatures." },
            { nom: "Incarnation d'Air", niv: 10, int: 15, cout: 15, desc: "Transforme la cible en air et la rend difficile à toucher." },
            { nom: "Appel d'un élémentaire de l'Air", niv: 15, int: 18, cout: 20, desc: "Invoque un élémentaire d’Air." }
        ]
    },
    "Terre": { 
        desc: "Sortilèges basés sur la terre et la roche.", 
        sorts: [
            { nom: "Force de la Terre", niv: 1, int: 6, cout: 5, desc: "Augmente la force de la cible." }, 
            { nom: "Projectile de pierre", niv: 1, int: 9, cout: 5, degats: 8, desc: "Lance un projectile de pierre infligeant des dégâts." }, 
            { nom: "Mur de pierres", niv: 5, int: 12, cout: 10, desc: "Crée un mur de pierre bloquant le passage." }, 
            { nom: "Incarnation de Pierre", niv: 10, int: 15, cout: 15, desc: "Transforme la cible en pierre." }, 
            { nom: "Appel d’un élémentaire de Terre" , niv: 15, int: 18, cout: 20, desc: "Invoque un élémentaire de Terre." }
        ] 
    },
    "Feu": { 
        desc: "Sortilèges basés sur le feu et la chaleur.", 
        sorts: [
            { nom: "Agilité du Feu", niv: 1, int: 6, cout: 5, desc: "Augmente la dexterité de la cible." }, 
            { nom: "Mur de feu", niv: 1, int: 9, cout: 5, desc: "Crée un mur de flammes infligeant des dégâts." }, 
            { nom: "Boule de feu", niv: 5, int: 12, cout: 10, degats: 15, desc: "Lance une boule de feu infligeant de lourds dégâts." }, 
            { nom: "Incarnation de Feu", niv: 10, int: 15, cout: 15, desc: "Transforme la cible en feu." }, 
            { nom: "Appel d’un élémentaire de Feu", niv: 15, int: 18, cout: 20, desc: "Invoque un élémentaire de Feu." }
        ] 
    },
    "Eau": { 
        desc: "Sortilèges basés sur l'eau et la glace.", 
        sorts: [
            { nom: "Pureté de l’Eau", niv: 1, int: 6, cout: 5, desc: "Améliore le charisme de la cible." }, 
            { nom: "Brouillard", niv: 1, int: 9, cout: 5, desc: "Crée un brouillard qui gêne la vision." }, 
            { nom: "Fureur de glace", niv: 5, int: 12, cout: 10, degats: 15, desc: "Inflige des dégâts de glace." }, 
            { nom: "Incarnation d’Eau", niv: 10, int: 15, cout: 15, desc: "Transforme la cible en eau." }, 
            { nom: "Appel d’un élémentaire de l’Eau", niv: 15, int: 18, cout: 20, desc: "Invoque un élémentaire d’Eau." }
        ] 
    },
    "Energie": { 
        desc: "Manipulation des énergies cosmiques pures.", 
        sorts: [
            { nom: "Bouclier de protection", niv: 1, int: 6, cout: 5, desc: "Protège la cible en réduisant les dégâts reçus." }, 
            { nom: "Choc électrique", niv: 1, int: 9, cout: 5, degats: 10,desc: "Inflige des dégâts électriques à la cible." }, 
            { nom: "Mur de force", niv: 5, int: 12, cout: 10, desc: "Crée une barrière magique qui bloque le passage." }, 
            { nom: "Eclair", niv: 10, int: 15, cout: 15, degats: 30 ,desc: "Lance un éclair qui inflige de lourds dégâts à la cible." }, 
            { nom: "Désintégration", niv: 15, int: 18, cout: 20, degats: 999 ,desc: "Détruit la cible instantanément si le sort réussit." }
        ] 
    },
    "Mental": { 
        desc: "Contrôler l'esprit d'une cible faible.", 
        sorts: [
            { nom: "Charme", niv: 1, int: 6, cout: 5, desc: "Améliore la réaction de la cible envers le lanceur." }, 
            { nom: "Étourdissement", niv: 1, int: 9, cout: 5, desc: "Étourdit la cible et l’empêche d’agir pendant quelques secondes." }, 
            { nom: "Absorption de la volonté", niv: 5, int: 12, cout: 10, desc: "Réduit fortement la volonté de la cible pendant la durée du sort." }, 
            { nom: "Cauchemar", niv: 10, int: 15, cout: 15, desc: "Terrifie les créatures proches qui tentent de fuir." }, 
            { nom: "Domination", niv: 15, int: 18, cout: 20, desc: "Permet de contrôler totalement l’esprit de la cible." }
        ] 
    },
    "Méta": { 
        desc: "Sortilèges qui ont la primauté sur les autres sortilèges.", 
        sorts: [
            { nom: "Résistance aux sortilèges", niv: 1, int: 6, cout: 5, desc: "Réduit les effets des sorts subis par la cible." }, 
            { nom: "Dissipation des sortilèges", niv: 1, int: 9, cout:5, desc: "Supprime les sorts actifs sur une cible." }, 
            { nom: "Bouclier mystique", niv: 5, int: 12, cout: 10, desc: "Protège la cible contre les effets magiques." }, 
            { nom: "Entrave aux sortilèges", niv: 10, int: 15, cout: 15, desc: "Empêche la cible de lancer des sorts." }, 
            { nom: "Bouclier de réflexion", niv: 15, int: 18, cout: 20, desc: "Renvoie les sorts vers leur lanceur." }
        ] 
    },
    "Transformation": { 
        desc: "Modifier la structure matérielle d'une cible.", 
        sorts: [
            { nom: "Main de fer", niv: 1, int: 6, cout: 5, desc: "Augmente la puissance physique de la cible." }, 
            { nom: "Faiblesse", niv: 1, int: 9, cout: 5, desc: "Diminue les caractéristiques physiques de la cible." }, 
            { nom: "Rétrécissement", niv: 5, int: 12, cout: 10, desc: "Réduit la taille de la cible." }, 
            { nom: "Pétrification", niv: 10, int: 15, cout: 15, desc: "Transforme la cible en pierre." }, 
            { nom: "Polymorphie", niv: 15, int: 18, cout: 20, desc: "Transforme la cible en une autre créature." }
        ] 
    },
    "Nature": { 
        desc: "Manipuler les plantes, animaux et forces naturelles.", 
        sorts: [
            { nom: "Charmer les animaux", niv: 1, int: 6, cout: 5, desc: "Rend les animaux amicaux envers le lanceur." }, 
            { nom: "Enchevêtrement", niv: 1, int: 9, cout: 5, desc: "Immobilise la cible avec des plantes." }, 
            { nom: "Contrôler les animaux", niv: 5, int: 12, cout: 10, desc: "Permet de contrôler les animaux proches." }, 
            { nom: "Appeler les animaux", niv: 10, int: 15, cout: 15, desc: "Fait apparaître des animaux alliés." }, 
            { nom: "Régénération", niv: 15, int: 18, cout: 20, desc: "Soigne progressivement les membres du groupe." }
        ] 
    },
    "Nécromancie noire": { 
        desc: "Ecole basée sur la modification de la vie, négativement. Très intéressant à bas niveau, puisque c’est ici que vous apprendrez le seul sort offensif de 1er niveau.", 
        sorts: [
            { nom: "Blessure ", niv: 1, int: 6, cout: 3,degats: 6, desc: "diminue la vie de la cible." }, 
            { nom: "Rappel d’un esprit", niv: 1, int: 9, cout: 5, desc: "Permet de parler à l’esprit d’un cadavre." }, 
            { nom: "Invocation de morts-vivants", niv: 5, int: 12, cout: 10, desc: "Invoque des morts-vivants hostiles autour de la cible." }, 
            { nom: "Création de morts-vivants", niv: 10, int: 15, cout: 15, desc: "Réanime un cadavre qui devient allié." }, 
            { nom: "Suppression de la vie", niv: 15, int: 18, cout: 20,degats: 999, desc: "Tue instantanément la cible si le sort réussit." }
        ] 
    },
    "Nécromancie blanche": { 
        desc: "Affecte de façon positive la force vitale.", 
        sorts: [
            { nom: "Soins légers", niv: 1, int: 6, cout: 3,soin: 3, desc: "Soigne une petite quantité de points de vie." }, 
            { nom: "Antidote", niv: 1, int: 9, cout: 5, desc: "Soigne les effets de poison." }, 
            { nom: "Soins importants", niv: 5, int: 12, cout: 10,soin: 15, desc: "Soigne une grande quantité de points de vie." }, 
            { nom: "Sanctuaire", niv: 10, int: 15, cout: 15, desc: "Empêche les morts-vivants d’attaquer la cible." }, 
            { nom: "Résurrection", niv: 15, int: 18, cout: 20,soin: 999,resurrection: true, desc: "Ramène une cible à la vie." }
        ] 
    },
    "Illusion": { 
        desc: "Contrôler la lumière et les illusions.", 
        sorts: [
            { nom: "Illumination", niv: 1, int: 6, cout: 5, desc: "Augmente la luminosité autour de la cible." }, 
            { nom: "Flash", niv: 1, int: 9, cout: 5, desc: "Aveugle temporairement la cible." }, 
            { nom: "Occultation", niv: 5, int: 12, cout: 10, desc: "Augmente l'armure de la cible." }, 
            { nom: "Monstre illusoire", niv: 10, int: 15, cout: 15, desc: "Crée un monstre fictif que la cible croit réel." }, 
            { nom: "Invisibilité", niv: 15, int: 18, cout: 20, desc: "Rend la cible invisible." }
        ] 
    },
    "Invocation": { 
        desc: "Invoquer des créatures.", 
        sorts: [
            { nom: "Nuée d’insectes", niv: 1, int: 6, cout: 5, desc: "Invoque un essaim qui ralentit la cible." }, 
            { nom: "Champion orque", niv: 1, int: 9, cout: 8, desc: "Invoque un orque qui combat pour le lanceur." }, 
            { nom: "Ogre gardien", niv: 5, int: 12, cout: 12, desc: "Invoque un ogre allié." }, 
            { nom: "Porte des Enfers", niv: 10, int: 15, cout: 16, desc: "Invoque un démon." }, 
            { nom: "Invocation d’un familier", niv: 15, int: 18, cout: 25, desc: "Invoque un familier permanent." }
        ] 
    },
    "Temporel": { 
        desc: "Contrôler le cours du temps.", 
        sorts: [
            { nom: "Verrou magique", niv: 1, int: 6, cout: 2, desc: "Verouille une porte ou un coffre" }, 
            { nom: "Altération temporelle", niv: 1, int: 9, cout: 5, desc: "Réduit de moitié la vitesse des créatures près du lanceur du sort" }, 
            { nom: "Hâte", niv: 5, int: 12, cout: 10, desc: "Double  la vitesse de la cible." }, 
            { nom: "Stase", niv: 10, int: 15, cout: 15, desc: "Immobilise totalement une cible." }, 
            { nom: "Tempus Fugit", niv: 15, int: 18, cout: 20, desc: "Triple la vitesse pour le lanceur et ses aliés et réduit celle des autres." }
        ] 
    }
};



// ==========================================
// SYSTÈME DE GRIMOIRE ET LANCEMENT DE SORTS
// ==========================================

// Fonction pour fouiller dans les catégories et trouver les stats du sort
function trouverSort(nomSortCherche) {
    if (typeof magieData === 'undefined') return null;
    
    for (let ecole in magieData) {
        let listeSorts = magieData[ecole].sorts;
        if (listeSorts) {
            for (let i = 0; i < listeSorts.length; i++) {
                if (listeSorts[i].nom === nomSortCherche) {
                    return listeSorts[i]; // Sort trouvé !
                }
            }
        }
    }
    return null; // Sort introuvable
}

// Transforme les points de magieBase en liste de sorts jouables
function getSortsConnus() {
    let sortsAppris = [];
    if (!perso.magieBase || typeof magieData === 'undefined') return sortsAppris;

    for (let ecole in perso.magieBase) {
        let niveauInvesti = parseInt(perso.magieBase[ecole]); // Sécurité : on s'assure que c'est un nombre
        if (niveauInvesti > 0 && magieData[ecole] && magieData[ecole].sorts) {
            for (let i = 0; i < niveauInvesti; i++) {
                if (magieData[ecole].sorts[i]) {
                    sortsAppris.push(magieData[ecole].sorts[i].nom);
                }
            }
        }
    }
    return sortsAppris;
}

// Ouvre l'interface du grimoire sur l'accueil
function ouvrirMagieAccueil() {
    if (typeof cacherTout === "function") cacherTout();
    
    const ecranMagie = document.getElementById('ecran-magie-accueil');
    if (ecranMagie) ecranMagie.style.display = 'block';
    
// Calcul de la fatigue
const maxFT = (perso.statsBase.CN * 2) + (perso.statsBase.IN) + (perso.boostFT || 0);
if (perso.ftActuel === undefined) perso.ftActuel = maxFT;

document.getElementById('val-ft-magie').innerText = perso.ftActuel;
document.getElementById('val-ft-max-magie').innerText = maxFT;

    const container = document.getElementById('liste-sorts-accueil');
    if (!container) return;
    
    container.innerHTML = ""; // On vide la liste avant de la remplir

    // 1. On récupère les sorts que le joueur connaît vraiment
    let mesSorts = getSortsConnus(); 

    // 2. S'il n'en connaît aucun
    if (mesSorts.length === 0) {
        container.innerHTML = "<p style='color:#666; text-align:center;'>Aucun sort connu.</p>";
        return;
    }

    // 3. LA CORRECTION EST LÀ : on utilise "mesSorts.forEach" au lieu de "perso.sorts" !
    mesSorts.forEach(nomSort => {
        const data = trouverSort(nomSort);
        if (data) {
            const coutReel = parseInt(data.cout, 10) || 0;
            const peutLancer = (perso.ftActuel >= coutReel);
            const nomSafe = data.nom.replace(/'/g, "\\'");

            container.innerHTML += `
                <div style="background: #2a1a3a; border: 1px solid #673ab7; padding: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div style="flex: 1;">
                        <strong style="color: #d1c4e9;">${data.nom}</strong><br>
                        <small style="color: #9575cd; font-style: italic;">Coût : ${coutReel} FT</small>
                    </div>
                    <button onclick="preparerEtLancerSort('${nomSafe}')" 
                        style="background: ${peutLancer ? '#673ab7' : '#444'}; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: ${peutLancer ? 'pointer' : 'not-allowed'};"
                        ${peutLancer ? '' : 'disabled'}>
                        ${peutLancer ? '✨ Lancer' : '❌ Épuisé'}
                    </button>
                </div>
            `;
        }
    });
}



function mettreAJourListeCibles() {
    const groupeSorts = document.getElementById('groupe-joueurs'); // Ta liste Magie
    const groupeObjets = document.getElementById('groupe-joueurs-inventaire'); // Ta liste Inventaire

    db.ref('parties/' + sessionActuelle + '/joueurs/').on('value', (snapshot) => {
        if (groupeSorts) groupeSorts.innerHTML = '';
        if (groupeObjets) groupeObjets.innerHTML = ''; 

        snapshot.forEach((child) => {
            const joueur = child.val();
            const joueurID = child.key;

            if (perso && joueur.nom !== perso.nom) {
                const option1 = document.createElement('option');
                option1.value = joueurID;
                option1.textContent = joueur.nom;

                const option2 = document.createElement('option');
                option2.value = joueurID;
                option2.textContent = joueur.nom;

                if (groupeSorts) groupeSorts.appendChild(option1);
                if (groupeObjets) groupeObjets.appendChild(option2);
            }
        });
    });
}

// Cette fonction remplace l'ancienne avec le prompt()
let sortEnCoursCible = null;

function preparerEtLancerSort(nomSort) {
    const data = trouverSort(nomSort);
    if (!data) return;

    sortEnCoursCible = data;
    const moiID = perso.nom.replace(/\s+/g, '_');

    db.ref('parties/' + sessionActuelle + '/joueurs').once('value', (snapshot) => {
        const joueurs = snapshot.val();
        const liste = document.getElementById('liste-destinataires');
        const titre = document.querySelector('#modal-transfert h3') || document.querySelector('#modal-transfert .titre'); 
        
        if (titre) titre.innerText = `Lancer ${data.nom} sur :`;
        liste.innerHTML = "";

        // ⚔️ BOUTON ENNEMI (Ajouté ici)
        liste.innerHTML += `
            <button onclick="finaliserMagieCible('ennemi', 'l\\'Ennemi')" 
                style="background:#8b0000; color:white; padding:12px; border:2px solid #ff5252; border-radius:5px; cursor:pointer; margin-bottom:10px; width:100%; font-weight:bold;">
                ⚔️ CIBLE ENNEMIE
            </button>
            <hr style="border:0; border-top:1px solid #444; margin-bottom:10px;">
        `;

        // ✨ Bouton pour soi-même
        liste.innerHTML += `<button onclick="finaliserMagieCible('${moiID}', 'Vous-même')" style="background:#4caf50; color:white; padding:10px; border:none; border-radius:5px; cursor:pointer; margin-bottom:5px; width:100%;">✨ Sur moi-même</button>`;

        // 🔮 Liste des autres joueurs
        for (let id in joueurs) {
            if (id !== moiID) {
                liste.innerHTML += `<button onclick="finaliserMagieCible('${id}', '${joueurs[id].nom}')" style="background:#673ab7; color:white; padding:10px; border:none; border-radius:5px; cursor:pointer; margin-bottom:5px; width:100%;">🔮 ${joueurs[id].nom}</button>`;
            }
        }

        document.getElementById('modal-transfert').style.display = 'block';
    });
}



function finaliserMagieCible(cibleID, nomCible) {
    if (!sortEnCoursCible) return;

    const data = sortEnCoursCible;
    const coutReel = parseInt(data.cout, 10) || 0;

    // 1. VÉRIFICATION COMMUNE : La fatigue
    if (perso.ftActuel < coutReel) {
        alert("💥 Vous êtes trop fatigué pour lancer ce sort !");
        return;
    }

    // --- CAS A : CIBLE ENNEMIE (Action immédiate sans Firebase) ---
    if (cibleID === 'ennemi') {
        perso.ftActuel -= coutReel; // On déduit le coût
        
        let infoEffet = "";
        const align = perso.alignementMagique || 0;

        if (data.degats) {
            let degatsModifies = Math.floor(data.degats + (align / 100) * data.degats);
            infoEffet = `(${degatsModifies} dégâts infligés)`;
        } else if (data.soin) {
            infoEffet = "(Cible ennemie soignée ?!)";
        }

        alert(`⚔️ Sort ${data.nom} lancé sur l'Ennemi ! ${infoEffet}`);
        
        // Nettoyage et fermeture
        fermerModaleEtUpdate();
        return; // ON S'ARRÊTE ICI POUR L'ENNEMI
    }

    // --- CAS B : CIBLE JOUEUR (Nécessite Firebase) ---
    // Si on arrive ici, c'est que cibleID n'est PAS 'ennemi'
    db.ref('parties/' + sessionActuelle + '/joueurs/' + cibleID).once('value', (snapshot) => {
        const cibleData = snapshot.val();
        if (!cibleData) return;

        const pvActuels = cibleData.pvActuel || 0;
        const estKO = (pvActuels <= 0 || cibleData.estMort === true);

        // Vérifications de sécurité pour les joueurs
        if (data.degats && estKO) {
            alert(`🚫 ${nomCible} est déjà au sol.`);
            return;
        }
        if (data.soin && estKO && !data.resurrection) {
            alert(`🚫 Un simple soin ne peut pas ranimer ${nomCible} !`);
            return;
        }

        // Application des effets sur Firebase
        const alignement = perso.alignementMagique || 0;

        if (data.soin) {
            let soinModifie = Math.floor(data.soin + (alignement / 100) * data.soin);
            db.ref('parties/' + sessionActuelle + '/joueurs/' + cibleID + '/modif_stat').set({
                stat: 'PV', valeur: Math.max(0, soinModifie), timestamp: Date.now()
            });
        }

        if (data.degats) {
            let degatsModifies = Math.floor(data.degats + (alignement / 100) * data.degats);
            db.ref('parties/' + sessionActuelle + '/joueurs/' + cibleID + '/modif_stat').set({
                stat: 'PV', valeur: -Math.max(0, degatsModifies), timestamp: Date.now()
            });
        }

        // Déduction coût et message
        perso.ftActuel -= coutReel;
        alert(`🔮 Sort ${data.nom} lancé sur ${nomCible} !`);
        
        fermerModaleEtUpdate();
    });
}

// Petite fonction utilitaire pour éviter de répéter le code de fermeture
function fermerModaleEtUpdate() {
    document.getElementById('modal-transfert').style.display = 'none';
    sortEnCoursCible = null;
    if (typeof autoSave === 'function') autoSave();
    if (typeof ouvrirMagieAccueil === 'function') ouvrirMagieAccueil();
    if (typeof rafraichirAccueil === 'function') rafraichirAccueil();
}
