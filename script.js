const racesData = {
    "Humain": { FO:8, IN:8, CN:8, DX:8, CH:8, spec: "Basique", peutEtreFemme: true },
    "Nain": { FO:9, IN:8, CN:9, DX:7, CH:7, spec: "15% Technologie, +2 comp. Technologie", peutEtreFemme: false },
    "Gnome": { FO:8, IN:10, CN:6, DX:8, CH:8, spec: "+2 Marchandage", peutEtreFemme: true },
    "Halfelin": { FO:5, IN:8, CN:8, DX:10, CH:8, spec: "+2 Discrétion, +1 Esquive, +5% Crit", peutEtreFemme: true },
    "Ogre": { FO:14, IN:2, CN:8, DX:8, CH:3, spec: "20% Résistance Physique, -3 Discrétion", peutEtreFemme: false },
    "Demi-Ogre": { FO:12, IN:4, CN:8, DX:8, CH:7, spec: "10% Résistance Physique, -2 Discrétion", peutEtreFemme: false },
    "Elfe": { FO:7, IN:9, CN:6, DX:9, CH:9, spec: "15% Magie, -2 points compétences Techno", peutEtreFemme: true },
    "Demi-Elfe": { FO:8, IN:8, CN:7, DX:9, CH:9, spec: "5% Magie, -1 point compétence Techno", peutEtreFemme: true },
    "Orque": { FO:10, IN:7, CN:10, DX:8, CH:4, spec: "+3 Mêlée, 20% Résistance Poison", peutEtreFemme: false },
    "Demi-Orque": { FO:9, IN:8, CN:9, DX:8, CH:6, spec: "+2 Mêlée & Esquive, 10% Résistance Poison", peutEtreFemme: true }
};

const raceSelect = document.getElementById('raceSelect');
const sexeSelect = document.getElementById('sexeSelect');
const bgSelect = document.getElementById('bgSelect');


/*
function openTab(tabId) {
    // Cacher tous les contenus
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    // Désactiver tous les boutons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    // Montrer l'onglet actuel
    document.getElementById(tabId).classList.add('active');
    // Activer le bouton correspondant
    event.currentTarget.classList.add('active');
}
*/


function init() {
    // Remplissage du menu Race
    for (let r in racesData) {
        let o = document.createElement('option');
        o.value = r; o.innerText = r;
        raceSelect.appendChild(o);
    }

    // Écouteurs d'événements
    raceSelect.addEventListener('change', buildChar);
    sexeSelect.addEventListener('change', buildChar);
    bgSelect.addEventListener('change', buildChar);

    // Premier calcul
    buildChar();
}

function buildChar() {
    const rKey = raceSelect.value;
    const race = racesData[rKey];

    // 1. Gestion dynamique du Sexe selon la Race
    const currentSex = sexeSelect.value;
    sexeSelect.innerHTML = '<option value="M">Masculin</option>';
    if (race.peutEtreFemme) {
        sexeSelect.innerHTML += '<option value="F">Féminin</option>';
        sexeSelect.value = (currentSex === "F") ? "F" : "M";
    } else {
        sexeSelect.value = "M";
    }

    // 2. Base des stats Race + Modificateur Sexe
    let final = { FO: race.FO, IN: race.IN, CN: race.CN, DX: race.DX, CH: race.CH };
    if (sexeSelect.value === "F") {
        final.CN += 1; final.CH += 1; final.FO -= 1; final.DX -= 1;
    }

    // 3. Filtrage dynamique des Antécédents
    const lastBg = bgSelect.value;
    bgSelect.innerHTML = "";
    
    backgrounds.forEach(bg => {
        let allow = true;
        // Filtre de sexe
        if (bg.rest.sexe && bg.rest.sexe !== sexeSelect.value) allow = false;
        // Filtre inclusion race
        if (bg.rest.races && !bg.rest.races.includes(rKey)) allow = false;
        // Filtre exclusion race
        if (bg.rest.pasRaces && bg.rest.pasRaces.includes(rKey)) allow = false;

        if (allow) {
            let o = document.createElement('option');
            o.value = bg.nom; o.innerText = bg.nom;
            if(bg.nom === lastBg) o.selected = true;
            bgSelect.appendChild(o);
        }
    });

    // 4. Application des modificateurs du Background choisi
    const currentBg = backgrounds.find(b => b.nom === bgSelect.value) || backgrounds[0];
    if (currentBg.mod) {
        for (let s in currentBg.mod) {
            if (final.hasOwnProperty(s)) {
                final[s] += currentBg.mod[s];
            }
        }
    }

    // 5. Mise à jour de l'affichage des Stats
    for (let s in final) {
        const el = document.getElementById('val-' + s);
        if (el) el.innerText = final[s];
    }
    
// ... code précédent ...

    // 6. Calcul des ressources dérivées principales
    document.getElementById('pv-total').innerText = (final.FO * 2) + final.IN;
    document.getElementById('fatigue-total').innerText = (final.CN * 2) + final.IN;
    
    /* NOTE POUR PLUS TARD (Écran de résumé) :
    let degatsBonus = (final.FO > 10) ? (final.FO - 10) : (final.FO < 10 ? Math.floor((final.FO - 10) / 2) : 0);
    let armure = final.DX;
    let vitesse = final.DX;
    let recupPoison = final.CN;
    let compagnons = Math.max(1, Math.floor(final.CH / 4));
    */

    // 7. Affichage des textes (Description + Autres effets)
    document.getElementById('desc-box').innerText = currentBg.desc;
    
    // On affiche les capacités de race et les effets de l'antécédent ensemble
    let extraHTML = `<div style="margin-bottom:10px;"><strong>Capacités de race :</strong> ${race.spec}</div>`;
    extraHTML += `<div><strong>Autres effets :</strong> ${currentBg.effets || "Aucun"}</div>`;
    
    document.getElementById('raceTraits').innerHTML = extraHTML;
}

// Lancement
init();

function updateUI() {
    const name = document.getElementById('charName').value;
    console.log("Nom actuel : " + name);
}

// --- FONCTION DE SAUVEGARDE ---
function saveCharacter() {
    // 1. Récupérer le nom
    const nomPerso = document.getElementById('charName').value.trim();
    
    // Si le champ nom est vide, on bloque la sauvegarde
    if (nomPerso === "") {
        alert("Veuillez entrer un nom pour votre personnage avant de sauvegarder !");
        return;
    }

    // 2. Créer l'objet Personnage avec le niveau et les points par défaut
    const personnage = {
        nom: nomPerso,
        race: document.getElementById('raceSelect').value,
        sexe: document.getElementById('sexeSelect').value,
        antecedent: document.getElementById('bgSelect').value,
        niveau: 1,           // Niveau par défaut
        pointsDispo: 5,      // Points de compétences par défaut
        
        // On sauvegarde aussi les stats calculées
        stats: {
            FO: document.getElementById('val-FO').innerText,
            IN: document.getElementById('val-IN').innerText,
            CN: document.getElementById('val-CN').innerText,
            DX: document.getElementById('val-DX').innerText,
            CH: document.getElementById('val-CH').innerText
        },
        derivees: {
            PV: document.getElementById('pv-total').innerText,
            Fatigue: document.getElementById('fatigue-total').innerText
        }
    };

    // 3. Sauvegarder dans le localStorage du navigateur
    // JSON.stringify transforme notre objet en texte pour pouvoir le stocker
    localStorage.setItem('arcanum_sauvegarde', JSON.stringify(personnage));

    // 4. Confirmer au joueur
    console.log("Personnage sauvegardé :", personnage);
    alert("Le personnage " + nomPerso + " a été sauvegardé avec succès dans le navigateur !");
}