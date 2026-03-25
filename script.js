const racesData = {
    "Humain": { FO:8, IN:8, CN:8, DX:8, CH:8, spec: "Polyvalent", peutEtreFemme: true },
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

function init() {
    for (let r in racesData) {
        let o = document.createElement('option');
        o.value = r; o.innerText = r;
        raceSelect.appendChild(o);
    }
    raceSelect.addEventListener('change', buildChar);
    sexeSelect.addEventListener('change', buildChar);
    bgSelect.addEventListener('change', buildChar);
    buildChar();
}


function buildChar() {
    const rKey = raceSelect.value;
    const race = racesData[rKey];
    const currentBg = backgrounds.find(b => b.nom === bgSelect.value) || backgrounds[0];
	
	
    // Gérer Sexe
    const currentSex = sexeSelect.value;
    sexeSelect.innerHTML = '<option value="M">Masculin</option>';
    if (race.peutEtreFemme) {
        sexeSelect.innerHTML += '<option value="F">Féminin</option>';
        sexeSelect.value = (currentSex === "F") ? "F" : "M";
    } else {
        sexeSelect.value = "M";
    }

    let final = { FO: race.FO, IN: race.IN, CN: race.CN, DX: race.DX, CH: race.CH };
    if (sexeSelect.value === "F") {
        final.CN += 1; final.CH += 1; final.FO -= 1; final.DX -= 1;
    }

// Afficher la description littérale
document.getElementById('desc-box').innerText = currentBg.desc;

// NOUVEAU : Afficher les effets secondaires (équipement, bonus de comp, etc.)
// Assure-toi d'avoir une div avec id="autres-effets" dans ton HTML
document.getElementById('autres-effets').innerText = "Effets spéciaux : " + (currentBg.autres || "Aucun");

    // Gérer Antécédents
    const lastBg = bgSelect.value;
    bgSelect.innerHTML = "";
    backgrounds.forEach(bg => {
        let allow = true;
        if (bg.rest.sexe && bg.rest.sexe !== sexeSelect.value) allow = false;
        if (bg.rest.races && !bg.rest.races.includes(rKey)) allow = false;
        if (bg.rest.pasRaces && bg.rest.pasRaces.includes(rKey)) allow = false;
        if (allow) {
            let o = document.createElement('option');
            o.value = bg.nom; o.innerText = bg.nom;
            if(bg.nom === lastBg) o.selected = true;
            bgSelect.appendChild(o);
        }
    });

    const currentBg = backgrounds.find(b => b.nom === bgSelect.value) || backgrounds[0];
    for (let s in currentBg.mod) final[s] += currentBg.mod[s];

    // Affichage des Stats
    for (let s in final) { document.getElementById('val-' + s).innerText = final[s]; }
    
    // Calcul PV/Fatigue
    document.getElementById('pv-total').innerText = (final.FO * 2) + final.IN;
    document.getElementById('fatigue-total').innerText = (final.CN * 2) + final.IN;
    
    // Description Textuelle
    document.getElementById('desc-box').innerText = currentBg.desc;
    document.getElementById('raceTraits').innerText = "Capacités de race : " + race.spec;
    
    // Les lignes de mise à jour du footer ont été supprimées
}

init();