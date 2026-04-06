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
            { nom: "Antidote", niv: 1, int: 9, cout: 5, curePoison: true, desc: "Soigne les effets de poison." }, 
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

// Transforme les points de magie (base + investis) en liste de sorts jouables
function getSortsConnus() {
    let sortsAppris = [];
    if (typeof magieData === 'undefined') return sortsAppris;

    // Fusionne magieBase et magieInvesties (prend le max de chaque école)
    const niveauxParEcole = {};
    for (let ecole in (perso.magieBase || {})) {
        niveauxParEcole[ecole] = Math.max(niveauxParEcole[ecole] || 0, parseInt(perso.magieBase[ecole]) || 0);
    }
    for (let ecole in (perso.magieInvesties || {})) {
        niveauxParEcole[ecole] = Math.max(niveauxParEcole[ecole] || 0, parseInt(perso.magieInvesties[ecole]) || 0);
    }

    for (let ecole in niveauxParEcole) {
        let niveau = niveauxParEcole[ecole];
        if (niveau > 0 && magieData[ecole]?.sorts) {
            for (let i = 0; i < niveau; i++) {
                if (magieData[ecole].sorts[i]) sortsAppris.push(magieData[ecole].sorts[i].nom);
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

    const maxFT = (perso.statsBase.CN * 2) + (perso.statsBase.IN) + (perso.boostFT || 0);
    if (perso.ftActuel === undefined) perso.ftActuel = maxFT;
    document.getElementById('val-ft-magie').innerText = perso.ftActuel;
    document.getElementById('val-ft-max-magie').innerText = maxFT;

    const container = document.getElementById('liste-sorts-accueil');
    if (!container) return;
    container.innerHTML = "";

    const _sortHtml = (data, ftSource, onclickCall, couleurBord, couleurFond) => {
        const coutReel = parseInt(data.cout, 10) || 0;
        const peutLancer = (ftSource >= coutReel);
        return `
            <div style="background: ${couleurFond}; border: 1px solid ${couleurBord}; padding: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div style="flex: 1;">
                    <strong style="color: #d1c4e9;">${data.nom}</strong><br>
                    <small style="color: #9575cd; font-style: italic;">Coût : ${coutReel} FT</small>
                </div>
                <button onclick="${onclickCall}"
                    style="background: ${peutLancer ? couleurBord : '#444'}; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: ${peutLancer ? 'pointer' : 'not-allowed'};"
                    ${peutLancer ? '' : 'disabled'}>
                    ${peutLancer ? '✨ Lancer' : '❌ Épuisé'}
                </button>
            </div>`;
    };

    // --- SORTS DU JOUEUR ---
    let mesSorts = getSortsConnus();
    if (mesSorts.length > 0) {
        container.innerHTML += `<p style="color:#9575cd; font-weight:bold; margin: 4px 0 8px;">✨ Vos sorts</p>`;
        mesSorts.forEach(nomSort => {
            const data = trouverSort(nomSort);
            if (!data) return;
            const nomSafe = data.nom.replace(/'/g, "\\'");
            container.innerHTML += _sortHtml(data, perso.ftActuel, `preparerEtLancerSort('${nomSafe}')`, '#673ab7', '#2a1a3a');
        });
    }

    // --- SORTS DES COMPAGNONS ---
    const comps = window.perso?.compagnons || [];
    comps.forEach((comp, i) => {
        const sortComp = _getSortsConnus_comp(comp);
        if (sortComp.length === 0) return;
        const ftMaxComp = (comp.statsBase?.CN || 5) * 2 + (comp.statsBase?.IN || 5) + (comp.boostFT || 0);
        const ftComp = comp.ftActuel !== undefined ? comp.ftActuel : ftMaxComp;
        container.innerHTML += `<p style="color:#a5d6a7; font-weight:bold; margin: 12px 0 6px; border-top: 1px solid #333; padding-top: 8px;">🤝 ${comp.nom} <small style="color:#888; font-weight:normal;">FT : ${ftComp}/${ftMaxComp}</small></p>`;
        sortComp.forEach(nomSort => {
            const data = trouverSort(nomSort);
            if (!data) return;
            const nomSafe = data.nom.replace(/'/g, "\\'");
            container.innerHTML += _sortHtml(data, ftComp, `preparerEtLancerSort('${nomSafe}', ${i})`, '#4caf50', '#1a2a1a');
        });
    });

    if (mesSorts.length === 0 && comps.every(c => _getSortsConnus_comp(c).length === 0)) {
        container.innerHTML = "<p style='color:#666; text-align:center;'>Aucun sort connu.</p>";
    }
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
let sortSourceCompIdx = null; // null = joueur, number = index compagnon

// Retourne les sorts connus d'un compagnon (même logique que getSortsConnus pour le joueur)
function _getSortsConnus_comp(comp) {
    const sortsAppris = [];
    if (typeof magieData === 'undefined') return sortsAppris;
    const niveauxParEcole = {};
    for (let ecole in (comp.magieBase || {})) {
        niveauxParEcole[ecole] = Math.max(niveauxParEcole[ecole] || 0, parseInt(comp.magieBase[ecole]) || 0);
    }
    for (let ecole in (comp.magieInvesties || {})) {
        niveauxParEcole[ecole] = Math.max(niveauxParEcole[ecole] || 0, parseInt(comp.magieInvesties[ecole]) || 0);
    }
    for (let ecole in niveauxParEcole) {
        const niveau = niveauxParEcole[ecole];
        if (niveau > 0 && magieData[ecole]?.sorts) {
            for (let i = 0; i < niveau; i++) {
                if (magieData[ecole].sorts[i]) sortsAppris.push(magieData[ecole].sorts[i].nom);
            }
        }
    }
    return sortsAppris;
}

function preparerEtLancerSort(nomSort, compIdx) {
    const data = trouverSort(nomSort);
    if (!data) return;

    if (window.perso.pvActuel <= 0) {
        alert("💀 Un mort ne peut pas lancer de sorts !");
        return;
    }

    sortEnCoursCible = data;
    sortSourceCompIdx = (compIdx !== undefined && compIdx !== null) ? compIdx : null;

    // Bonus IN ≥ 20 : coût des sorts -10% (joueur seulement)
    const _inTotal = (perso?.statsBase?.IN || 0) + (perso?.statsInvesties?.IN || 0);
    const coutBase = parseInt(data.cout, 10) || 0;
    const coutReel = (compIdx === undefined || compIdx === null) && _inTotal >= 20
        ? Math.max(1, Math.floor(coutBase * 0.9))
        : coutBase;
    let ftSource, nomSource;
    if (sortSourceCompIdx !== null) {
        const comp = window.perso.compagnons[sortSourceCompIdx];
        const ftMaxComp = (comp.statsBase?.CN || 5) * 2 + (comp.statsBase?.IN || 5) + (comp.boostFT || 0);
        ftSource = comp.ftActuel !== undefined ? comp.ftActuel : ftMaxComp;
        nomSource = comp.nom;
    } else {
        ftSource = perso.ftActuel;
        nomSource = "Vous";
    }
    if (ftSource < coutReel) {
        alert(`💥 ${nomSource} est trop fatigué pour lancer ce sort !`);
        return;
    }

    const moiID = perso.nom.replace(/\s+/g, '_');

    db.ref('parties/' + sessionActuelle + '/joueurs').once('value', (snapshot) => {
        const joueurs = snapshot.val();
        const liste = document.getElementById('liste-destinataires');
        const titre = document.querySelector('#modal-transfert h3') || document.querySelector('#modal-transfert .titre');

        if (titre) titre.innerText = sortSourceCompIdx !== null
            ? `Lancer ${data.nom} (${nomSource}) sur :`
            : `Lancer ${data.nom} sur :`;
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

        // 🤝 Compagnons du joueur
        const comps = window.perso?.compagnons || [];
        if (comps.length > 0) {
            liste.innerHTML += `<hr style="border:0; border-top:1px solid #444; margin:8px 0;">`;
            comps.forEach((c, i) => {
                const nomSafe = c.nom.replace(/'/g, "\\'");
                liste.innerHTML += `<button onclick="finaliserMagieCible('comp_${i}', '${nomSafe}')" style="background:#2e1f4d; color:#b39ddb; padding:10px; border:1px solid #7c4dff; border-radius:5px; cursor:pointer; margin-bottom:5px; width:100%;">🤝 ${c.nom}</button>`;
            });
        }

        document.getElementById('modal-transfert').style.display = 'block';
    });

}



function finaliserMagieCible(cibleID, nomCible) {
    if (!sortEnCoursCible) return;

    const data = sortEnCoursCible;
    const coutReel = parseInt(data.cout, 10) || 0;

    // Détermine la source de FT (joueur ou compagnon)
    const _ftSource = () => {
        if (sortSourceCompIdx !== null) {
            const comp = window.perso.compagnons[sortSourceCompIdx];
            const ftMax = (comp.statsBase?.CN || 5) * 2 + (comp.statsBase?.IN || 5) + (comp.boostFT || 0);
            return comp.ftActuel !== undefined ? comp.ftActuel : ftMax;
        }
        return perso.ftActuel;
    };
    const _deduireFT = () => {
        if (sortSourceCompIdx !== null) {
            window.perso.compagnons[sortSourceCompIdx].ftActuel = _ftSource() - coutReel;
            if (typeof _syncCompagnonsSummary === 'function') _syncCompagnonsSummary();
        } else {
            perso.ftActuel -= coutReel;
        }
    };

    // Vérification commune : fatigue
    if (_ftSource() < coutReel) {
        alert("💥 Trop fatigué pour lancer ce sort !");
        return;
    }

    const alignement = sortSourceCompIdx !== null
        ? (window.perso.compagnons[sortSourceCompIdx].alignementMagique || 0)
        : (perso.alignementMagique || 0);

    // Bonus IN ≥ 20 : dégâts sorts +10% (joueur seulement)
    const inTotal = (perso?.statsBase?.IN || 0) + (perso?.statsInvesties?.IN || 0);
    const bonusIN20 = (sortSourceCompIdx === null && inTotal >= 20) ? 1.1 : 1.0;

    // Jet critique : joueur = avec son background, compagnon = sans background
    const _casterPerso = sortSourceCompIdx === null ? perso : null;
    const critSort = (typeof _lancerCritique === 'function')
        ? _lancerCritique(_casterPerso)
        : { type: 'normal', mult: 1 };
    const critLabel = critSort.type === 'echec'
        ? ' ⚠ ÉCHEC CRITIQUE'
        : critSort.type === 'critique'
            ? (critSort.mult >= 2 ? ' ⚡ CRITIQUE ×2 !' : ' ⚡ CRITIQUE ×1.5 !')
            : '';

    const _calcDegats = (base) => {
        if (critSort.type === 'echec') return 0;
        const val = Math.floor((base + (alignement / 100) * base) * bonusIN20);
        return critSort.type === 'critique' ? Math.round(val * critSort.mult) : val;
    };
    const _calcSoin = (base) => {
        if (base === 999) return 9999; // résurrection : jamais d'échec critique
        if (critSort.type === 'echec') return 0;
        const val = Math.floor(base + (alignement / 100) * base);
        return critSort.type === 'critique' ? Math.round(val * critSort.mult) : val;
    };

    // --- CAS A : CIBLE ENNEMIE ---
    if (cibleID === 'ennemi') {
        _deduireFT();
        let infoEffet = "";
        if (data.degats) {
            const d = _calcDegats(data.degats);
            infoEffet = critSort.type === 'echec'
                ? `(⚠ ÉCHEC CRITIQUE — sort raté !)`
                : `(${d} dégâts infligés${critLabel})`;
        } else if (data.soin) {
            infoEffet = "(Cible ennemie soignée ?!)";
        }
        alert(`⚔️ Sort ${data.nom} lancé sur l'Ennemi ! ${infoEffet}`);
        fermerModaleEtUpdate();
        return;
    }

    // --- CAS B2 : CIBLE COMPAGNON (local) ---
    if (cibleID.startsWith('comp_')) {
        const compIdx = parseInt(cibleID.replace('comp_', ''));
        const comp = window.perso?.compagnons?.[compIdx];
        if (!comp) return;
        if (data.soin) {
            const soin = _calcSoin(data.soin);
            const pvMax = (comp.statsBase?.FO || 3) * 2 + (comp.statsBase?.IN || 3);
            comp.pvActuel = Math.min(pvMax, (comp.pvActuel || 0) + soin);
        }
        if (data.degats) {
            comp.pvActuel = Math.max(0, (comp.pvActuel || 0) - _calcDegats(data.degats));
        }
        _deduireFT();
        if (typeof autoSave === 'function') autoSave();
        alert(`🔮 Sort ${data.nom}${critLabel} lancé sur ${nomCible} !`);
        fermerModaleEtUpdate();
        return;
    }

    // Détermine si la cible c'est le joueur lui-même
    const moiID = window.perso?.nom?.replace(/\s+/g, '_') || '';

    // --- CAS B : CIBLE JOUEUR (Firebase ou soi-même) ---
    db.ref('parties/' + sessionActuelle + '/joueurs/' + cibleID).once('value', (snapshot) => {
        const cibleData = snapshot.val();
        if (!cibleData) return;

        const pvActuels = cibleData.pvActuel || 0;
        const estKO = (pvActuels <= 0 || cibleData.estMort === true);

        if (data.degats && estKO) {
            alert(`🚫 ${nomCible} est déjà au sol.`);
            return;
        }
        if (data.soin && estKO && !data.resurrection) {
            alert(`🚫 Un simple soin ne peut pas ranimer ${nomCible} !`);
            return;
        }

        const statRef = db.ref('parties/' + sessionActuelle + '/joueurs/' + cibleID + '/modif_stat');

        const soinVal = data.soin ? _calcSoin(data.soin) : 0;
        const degatsVal = data.degats ? _calcDegats(data.degats) : 0;

        if (soinVal > 0) {
            statRef.set({ stat: 'PV', valeur: soinVal, timestamp: Date.now() });
        }
        if (degatsVal > 0) {
            statRef.set({ stat: 'PV', valeur: -degatsVal, timestamp: Date.now() });
        }

        // Cure poison (indépendant du critique — effet magique garanti)
        if (data.curePoison) {
            if (cibleID === moiID) {
                window.perso.poison = null;
                if (typeof _toast === 'function') _toast('✅ Poison neutralisé !', 'success');
                if (typeof rafraichirAccueil === 'function') rafraichirAccueil();
            } else {
                statRef.set({ stat: 'curePoison', valeur: 1, timestamp: Date.now() });
            }
        }

        _deduireFT();
        alert(`🔮 Sort ${data.nom}${critLabel} lancé sur ${nomCible} !`);
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
