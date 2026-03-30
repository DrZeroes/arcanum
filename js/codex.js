

// --- FONCTION MJ : OUVRIR LE CODEX ---
function ouvrirCodex() {
    cacherTout();
    document.getElementById('ecran-codex').style.display = 'block';
    genererListeCodex('items'); // Par défaut on affiche les objets
}

function genererListeCodex(type) {
    const tbody = document.getElementById('tbody-codex');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    console.log("Génération du Codex type :", type);

    if (type === 'items') {
        for (let id in itemsData) {
            ajouterLigneCodex(id, itemsData[id].nom, "Objet", `ramasserItem('${id}', 1)`, "🎁 +1");
        }
    } 
    else if (type === 'marchands') {
        if (typeof marchandsData !== 'undefined') {
            for (let id in marchandsData) {
                ajouterLigneCodex(id, marchandsData[id].nom, "Marchand", `forcerOuvertureMarchand('${id}')`, "💰 Voir");
            }
        }
    } 
    else if (type === 'coffres') {
        if (typeof coffresFixes !== 'undefined') {
            for (let id in coffresFixes) {
                ajouterLigneCodex(id, coffresFixes[id].nom, "Coffre", `forcerOuvertureCoffre('${id}')`, "🔍 Ouvrir");
            }
        }
    } 

else if (type === 'lieux') {
        if (typeof lieuxDecouverts !== 'undefined') {
            // J'ai renommé la variable en 'idLieu' pour que ce soit plus clair
            for (let idLieu in lieuxDecouverts) {
                let l = lieuxDecouverts[idLieu];
                
                tbody.innerHTML += `
                    <tr class="ligne-codex" style="border-bottom: 1px solid #333;">
                        <td style="padding: 10px; color: #ffb74d; font-family: monospace; font-size: 0.8em;">
                            ${idLieu}
                        </td>
                        
                        <td style="padding: 10px; color: #fff;">
                            ${l.nom} <br>
                            <span style="color: #aaa; font-size: 0.8em;">Pos: ${l.x}%, ${l.y}%</span>
                        </td>
                        
                        <td style="padding: 10px; text-align:right;">
                            <button onclick="forcerDecouverteLieu('${idLieu}')" style="background: #2196f3; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px; font-size:0.8em;">
                                📍 Révéler
                            </button>
                        </td>
                    </tr>`;
            }
        }
    }

}

// Vérifie que tu as bien cette fonction utilitaire aussi !
function ajouterLigneCodex(id, nom, categorie, actionFn, texteAction) {
    const tbody = document.getElementById('tbody-codex');
    tbody.innerHTML += `
        <tr class="ligne-codex" style="border-bottom: 1px solid #333;">
            <td style="padding: 10px; color: #ffb74d; font-family: monospace; font-size: 0.8em;">${id}</td>
            <td style="padding: 10px; color: #fff;">${nom}</td>
            <td style="padding: 10px; text-align:right;">
                <button onclick="${actionFn}" style="background: #4caf50; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px; white-space: nowrap;">${texteAction}</button>
            </td>
        </tr>
    `;
}



// --- FONCTION MJ : FILTRER LA LISTE ---
function filtrerCodex() {
    let input = document.getElementById('recherche-codex').value.toLowerCase();
    let lignes = document.querySelectorAll('.ligne-codex');

    lignes.forEach(ligne => {
        let texte = ligne.innerText.toLowerCase();
        ligne.style.display = texte.includes(input) ? "" : "none";
    });
}


function genererListeMusiquesMJ() {
    const tbody = document.getElementById('tbody-codex');
    tbody.innerHTML = ""; 

    playlistMJ.forEach(piste => {
        let tr = document.createElement('tr');
        tr.style.borderBottom = "1px solid #444";
        
        tr.innerHTML = `
            <td style="padding: 10px; color: #fff;">🎵 <b>${piste.nom}</b></td>
            <td style="padding: 10px; color: #aaa; font-size: 0.8em; font-family: monospace;">${piste.fichier}</td>
            <td style="padding: 10px; text-align: right;">
                <button onclick="AudioEngine.jouerMusique('${piste.fichier}')" 
                        style="padding: 5px 15px; cursor: pointer; background: #4caf50; color: white; border: none; border-radius: 3px; transition: 0.2s;">
                    ▶ Lancer
                </button>
            </td>
        `;
        
        // Petit effet au survol pour savoir quelle ligne on regarde
        tr.onmouseover = () => tr.style.background = "#333";
        tr.onmouseout = () => tr.style.background = "transparent";
        
        tbody.appendChild(tr);
    });

    // Bouton STOP global en bas de liste
    let trStop = document.createElement('tr');
    trStop.innerHTML = `
        <td colspan="3" style="padding:15px; text-align:center;">
            <button onclick="AudioEngine.stopMusique()" 
                    style="background:#8b0000; color:white; border:none; padding:10px 30px; cursor:pointer; font-weight:bold; border-radius:5px;">
                ⏹ ARRÊTER LE SON
            </button>
        </td>`;
    tbody.appendChild(trStop);
}


