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

const backgrounds = [
    { nom: "Standard", rest: {}, mod: {}, desc: "Aucun passé particulier.", xp: 0, gold: 400, items: "Aucun" },
    { nom: "Affiche de Nietzsche", rest: {pasRaces:["Ogre"]}, mod: {}, desc: "XP +10% / Échec Critique +20%.", xp: 10, gold: 400 },
    { nom: "Agoraphobe", rest: {races:["Humain","Nain","Gnome","Halfelin"]}, mod: {IN:2}, desc: "IN +2 en intérieur. Extérieur ouvert : IN-2, DX-2, FO+2 (Panique).", gold: 400 },
    { nom: "Allergie à la magie", rest: {pasRaces:["Elfe","Demi-Elfe"]}, mod: {}, desc: "Points techniques +2. +10% Tech. Interdiction objets magiques.", gold: 400 },
    { nom: "Apprenti commerçant", rest: {pasRaces:["Ogre"]}, mod: {DX:-1}, desc: "Marchander +3.", gold: 400 },
    { nom: "Apprenti forgeron", rest: {pasRaces:["Ogre"]}, mod: {FO:1, DX:-2}, desc: "Réparation +2.", gold: 400 },
    { nom: "Bandit", rest: {races:["Humain","Demi-Orque","Orque","Demi-Elfe"]}, mod: {CH:-1}, desc: "Armes à feu +2.", gold: 0, items: "Revolver de qualité, 50 balles" },
    { nom: "Barbare", rest: {pasRaces:["Elfe"]}, mod: {FO:2, CN:1, IN:-1, CH:-2}, desc: "Mêlée +1, Marchandage -2.", gold: 100, items: "Vêtements barbares" },
    { nom: "Battu avec un bâton", rest: {pasRaces:["Ogre"]}, mod: {CH:-6, FO:2, DX:2}, desc: "+1 toutes compétences combat.", gold: 400 },
    { nom: "Brute", rest: {pasRaces:["Orque","Demi-Orque","Ogre","Demi-Ogre"]}, mod: {IN:-1, FO:1}, desc: "Grand et stupide.", gold: 400 },
    { nom: "Peau dure", rest: {races:["Orque","Demi-Orque","Ogre","Demi-Ogre"]}, mod: {CH:-1}, desc: "Résistance dégâts +10.", gold: 400 },
    { nom: "Débutante", rest: {sexe:"F"}, mod: {CH:4, FO:-1, DX:-1}, desc: "Malus combat -2.", gold: 400 },
    { nom: "Demi-ogre sauvage", rest: {races:["Demi-Ogre"]}, mod: {FO:1, CH:-1}, desc: "Clan sauvage.", gold: 400 },
    { nom: "Disciple elfe noir", rest: {races:["Elfe"]}, mod: {IN:2, CH:-2}, desc: "Technologie doit mourir.", gold: 400 },
    { nom: "Docteur fou", rest: {pasRaces:["Ogre"]}, mod: {IN:3, DX:-2, CN:-3, CH:-1}, desc: "Soin +4, Résist Elec/Poison +20.", gold: 400 },
    { nom: "Élevé dans les fosses", rest: {}, mod: {IN:-6, FO:2, DX:2}, desc: "+1 compétences combat.", gold: 100, items: "Hache rouillée" },
    { nom: "Élevé par des elfes", rest: {races:["Humain"]}, mod: {}, desc: "Malus Tech -1. Cotte de maille magique.", gold: 400, items: "Cotte de maille elfique" },
    { nom: "Élevé par maîtres-serpents", rest: {}, mod: {CH:-1}, desc: "Résistance Poison +20.", gold: 400 },
    { nom: "Élevé par des moines", rest: {pasRaces:["Ogre"]}, mod: {CN:1}, desc: "Piété ascétique.", gold: 100 },
    { nom: "Élevé par des orcs", rest: {pasRaces:["Elfe"]}, mod: {CH:-6, FO:2, DX:1}, desc: "+1 compétences combat.", gold: 400 },
    { nom: "Elfe dandy", rest: {races:["Elfe"]}, mod: {DX:-1}, desc: "Persuasion +2.", gold: 400 },
    { nom: "Enfance protégée", rest: {pasRaces:["Nain","Ogre","Demi-Ogre"]}, mod: {FO:-6, IN:4, CH:1}, desc: "Choyé et sensible.", gold: 400 },
    { nom: "Enfant d'un héros", rest: {}, mod: {}, desc: "Réaction x2 pire pour le mal.", gold: 400, items: "Épée enchantée" },
    { nom: "Enfant sauvage", rest: {races:["Humain", "Demi-Elfe", "Gnome", "Orque", "Demi-Orque", "Ogre", "Demi-Ogre"]}, mod: {IN:-6, DX:3}, desc: "Discrétion/Vol +1.", gold: 200 },
    { nom: "Enfant unique", rest: {pasRaces:["Ogre"]}, mod: {IN:6, CH:-4}, desc: "Persuasion/Marchandage -2.", gold: 400 },
    { nom: "École de charme", rest: {sexe:"F", races:["Humain"]}, mod: {CH:3, IN:-1, FO:-2}, desc: "Éducation sociale.", gold: 400 },
    { nom: "Évadé d'usine", rest: {races:["Orque","Demi-Orque"]}, mod: {FO:1}, desc: "Ancien esclave.", gold: 50 },
    { nom: "Formation militaire", rest: {pasRaces:["Ogre","Demi-Ogre"]}, mod: {FO:1, DX:-1}, desc: "+1 Arc/Mêlée.", gold: 400 },
    { nom: "Garçon Tomboy", rest: {sexe:"F"}, mod: {FO:1, CN:-1}, desc: "Annule effet de genre FO/CN.", gold: 400 },
    { nom: "Garde du corps libéré", rest: {races:["Demi-Ogre", "Ogre"]}, mod: {IN:-1}, desc: "Don de l'ancien maître.", gold: 500 },
    { nom: "Gnome sans droits", rest: {races:["Gnome"]}, mod: {FO:1}, desc: "Marchandage -2.", gold: 400 },
    { nom: "Héritage", rest: {}, mod: {IN:-1}, desc: "Orphelin riche.", gold: 800 },
    { nom: "Hydrophobe", rest: {pasRaces:["Elfe","Ogre","Demi-Ogre"]}, mod: {}, desc: "Persuasion +2. Panique eau : IN-2, DX-2, FO+2.", gold: 400 },
    { nom: "Hyperactif", rest: {}, mod: {DX:1, CH:-1}, desc: "Vitesse accrue.", gold: 400 },
    { nom: "Idiot Savant", rest: {races:["Humain"]}, mod: {IN:2, FO:-1, CN:-1, DX:-2}, desc: "Jeu +3.", gold: 0 },
    { nom: "Fui avec le cirque", rest: {}, mod: {FO:6, DX:2, IN:-4, CH:-2, CN:-2}, desc: "Grande force.", gold: 400 },
    { nom: "L'homme de la dame", rest: {sexe:"M", pasRaces:["Ogre"]}, mod: {CH:6, CN:-2, FO:-2, DX:-2}, desc: "Beau mais frêle.", gold: 400 },
    { nom: "Fiancée Frankenstein", rest: {sexe:"F", races:["Humain","Demi-Orque"]}, mod: {CH:4, CN:4, DX:-4}, desc: "Résistances Elec/Poison.", gold: 0 },
    { nom: "Lanceur pro", rest: {pasRaces:["Ogre"]}, mod: {DX:-1}, desc: "Lancer +3.", gold: 400 },
    { nom: "Protégé du Charlatan", rest: {pasRaces:["Orque","Demi-Orque","Ogre","Demi-Ogre"]}, mod: {CH:6, FO:-2, CN:-2}, desc: "Malus combat -1.", gold: 400 },
    { nom: "Maladif", rest: {}, mod: {IN:6, FO:-2, CN:-4, DX:-1}, desc: "Esprit supérieur.", gold: 400 },
    { nom: "Monstre Frankenstein", rest: {sexe:"M", races:["Humain","Demi-Orque"]}, mod: {FO:4, CN:4, DX:-6}, desc: "Résistances Elec/Poison.", gold: 0 },
    { nom: "Nain sans clan", rest: {races:["Nain"]}, mod: {}, desc: "Marteau de qualité.", gold: 400, items: "Marteau de qualité" },
    { nom: "Naissance rare D-Ogre", rest: {races:["Demi-Ogre"]}, mod: {IN:2, FO:-1, CN:-1}, desc: "Élevé en ville.", gold: 400 },
    { nom: "Né sous bonne étoile", rest: {}, mod: {}, desc: "Critiques instables.", gold: 400 },
    { nom: "Opération Miracle", rest: {}, mod: {IN:3, CH:3, FO:-3, DX:-3, CN:-5}, desc: "Détection piège +2.", gold: 0 },
    { nom: "Orphelin Halfelin", rest: {races:["Halfelin"]}, mod: {IN:-1}, desc: "Pick Pocket +2.", gold: 400 },
    { nom: "Personnalité extrême", rest: {}, mod: {}, desc: "Réactions +/- 30.", gold: 400 },
    { nom: "Personne spéciale", rest: {}, mod: {IN:-2}, desc: "Réaction positive x2.", gold: 400 },
    { nom: "Peur du noir", rest: {races:["Humain","Halfelin"]}, mod: {CN:2}, desc: "Panique noir : IN-3, DX-2, FO+2.", gold: 400 },
    { nom: "Progéniture de troll", rest: {}, mod: {CH:-6, FO:2, CN:2, DX:1}, desc: "Force de monstre.", gold: 400 },
    { nom: "Pyromane", rest: {races:["Humain","Gnome","Demi-Orque"]}, mod: {FO:-1, CN:-1}, desc: "Explosifs +20.", gold: 400 },
    { nom: "Rat de bibliothèque", rest: {pasRaces:["Orque","Demi-Orque","Ogre","Demi-Ogre"]}, mod: {IN:1}, desc: "Malus combat -1.", gold: 400 },
    { nom: "Sang elfique", rest: {races:["Humain","Gnome","Halfelin","Demi-Ogre"]}, mod: {}, desc: "Magie +, PM +1.", gold: 400 },
    { nom: "Top modèle", rest: {sexe:"F"}, mod: {CH:6, FO:-2, IN:-4}, desc: "Beauté fatale.", gold: 400 },
    { nom: "Technophobie", rest: {races:["Humain","Demi-Elfe","Demi-Orque","Halfelin"]}, mod: {FO:1, CN:1}, desc: "Objets tech interdits.", gold: 400 },
    { nom: "Fou échappé", rest: {races:["Humain"]}, mod: {}, desc: "Résistances +25.", gold: 0 },
    { nom: "Vendu ton âme", rest: {}, mod: {}, desc: "Magie +20. Réaction -20.", gold: 400 },
    { nom: "Vue sombre", rest: {}, mod: {}, desc: "Lumière -1 / Noir +1 stats.", gold: 400 },
    { nom: "Ogre des montagnes", rest: {races:["Ogre"]}, mod: {FO:4, CN:4, DX:4, CH:-1, IN:-1}, desc: "Mêlée/Esquive +1.", gold: 0 },
    { nom: "Ogre cultivé", rest: {races:["Ogre"]}, mod: {IN:4, CH:2, CN:-4, DX:-4}, desc: "Grand lecteur.", gold: 400 },
    { nom: "Gentil géant", rest: {races:["Ogre"]}, mod: {}, desc: "Réaction positive +10.", gold: 400 },
    { nom: "Orc psychopathe", rest: {races:["Orque","Demi-Orque"]}, mod: {}, desc: "Réaction -20. Vol/Disc/Sneak +4.", gold: 0 },
    { nom: "Orc humaniste", rest: {races:["Orque","Demi-Orque"]}, mod: {IN:2, CH:2, FO:-2, CN:-2}, desc: "Exilé lettré.", gold: 400 },
    { nom: "Orc shaman", rest: {races:["Orque","Demi-Orque"]}, mod: {IN:2, CN:2, FO:-2}, desc: "Magie +20%.", gold: 400 }
];

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

    // Gérer Backgrounds
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

    // Affichage
    for (let s in final) { document.getElementById('val-' + s).innerText = final[s]; }
    document.getElementById('pv-total').innerText = (final.FO * 2) + final.IN;
    document.getElementById('fatigue-total').innerText = (final.CN * 2) + final.IN;
    document.getElementById('desc-box').innerText = currentBg.desc;
    document.getElementById('raceTraits').innerText = "Capacités : " + race.spec;
    document.getElementById('bonus-xp').innerText = "Expérience : " + (currentBg.xp ? "+" + currentBg.xp + "%" : "Standard");
    document.getElementById('bonus-money').innerText = "Or de départ : " + currentBg.gold;
    document.getElementById('item-depart').innerText = "Équipement spécial : " + (currentBg.items || "Aucun");
}

init();