// --- FONCTION MJ : OUVRIR LE CODEX ---

// Redirige les anciens appels DOM-based vers le nouveau moteur de rendu
function filtrerCodexMJ() { if (typeof _renderCodexEnemies === 'function') _renderCodexEnemies(); }
window._mjCatFilter = null;
window._mjCodexGroupBy = 'espece'; // 'espece' | 'zone'

function _buildCodexEnemyFilters() {
    const filterBar = document.getElementById('mj-codex-filterbar');
    if (!filterBar || typeof ennemisData === 'undefined') return;
    const isZone = window._mjCodexGroupBy === 'zone';
    const prevSearch = document.getElementById('mjf-search')?.value || '';
    let groupItems;
    if (isZone) {
        const zonesSet = new Set();
        Object.values(ennemisData).filter(e=>!e.unique).forEach(e=>(e.zones||[]).forEach(z=>zonesSet.add(z)));
        groupItems = [...zonesSet].sort((a,b)=>a.localeCompare(b,'fr'));
        if (groupItems.length === 0) groupItems = ['Sans zone'];
    } else {
        groupItems = [...new Set(Object.entries(ennemisData).filter(([,e])=>!e.unique).map(([id,e])=>_mjGetCat(id,e)))];
        groupItems.sort((a,b)=>(_MJ_CAT_ORDER.indexOf(a)<0?999:_MJ_CAT_ORDER.indexOf(a))-(_MJ_CAT_ORDER.indexOf(b)<0?999:_MJ_CAT_ORDER.indexOf(b)));
    }
    filterBar.innerHTML = `
        <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:5px;align-items:center;">
            <input id="mjf-search" type="text" placeholder="🔍 Nom / race / zone..." value="${prevSearch}" oninput="_renderCodexEnemies()"
                style="flex:1;min-width:130px;background:#111;color:#fff;border:1px solid #555;padding:3px 8px;border-radius:4px;font-size:0.8em;">
            <button id="mjf-uniq-btn" onclick="var cb=document.getElementById('mjf-uniq');cb.checked=!cb.checked;this.style.background=cb.checked?'#2a003a':'#1a0a0a';this.style.color=cb.checked?'#ce93d8':'#999';_renderCodexEnemies();"
                style="background:#1a0a0a;color:#999;border:1px solid #3a1a5a;padding:3px 9px;cursor:pointer;border-radius:4px;font-size:0.78em;">★ Uniques</button>
            <input id="mjf-uniq" type="checkbox" style="display:none;">
            <input id="mjf-niv-min" type="number" min="1" max="30" placeholder="Niv min"
                style="width:58px;background:#111;color:#fff;border:1px solid #444;padding:3px 5px;border-radius:4px;font-size:0.78em;" oninput="_renderCodexEnemies()">
            <input id="mjf-niv-max" type="number" min="1" max="30" placeholder="Niv max"
                style="width:58px;background:#111;color:#fff;border:1px solid #444;padding:3px 5px;border-radius:4px;font-size:0.78em;" oninput="_renderCodexEnemies()">
            <button onclick="window._mjCodexGroupBy='espece';_buildCodexEnemyFilters();_renderCodexEnemies();"
                style="background:${!isZone?'#1a1000':'#111'};color:${!isZone?'#ffb74d':'#666'};border:1px solid ${!isZone?'#8b5000':'#333'};padding:3px 7px;cursor:pointer;border-radius:4px;font-size:0.75em;">🐺 Espèce</button>
            <button onclick="window._mjCodexGroupBy='zone';_buildCodexEnemyFilters();_renderCodexEnemies();"
                style="background:${isZone?'#001520':'#111'};color:${isZone?'#4fc3f7':'#666'};border:1px solid ${isZone?'#0277bd':'#333'};padding:3px 7px;cursor:pointer;border-radius:4px;font-size:0.75em;">📍 Zone</button>
        </div>
        <div style="display:flex;gap:4px;margin-bottom:4px;align-items:center;">
            <button onclick="_mjRevelerTous()" style="background:#0a200a;color:#81c784;border:1px solid #2e7d32;padding:2px 8px;cursor:pointer;border-radius:4px;font-size:0.74em;">🔓 Révéler tous</button>
            <button onclick="_mjCacherTous()" style="background:#200a0a;color:#e57373;border:1px solid #8b0000;padding:2px 8px;cursor:pointer;border-radius:4px;font-size:0.74em;">🔒 Cacher tous</button>
        </div>
        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:4px;">
            <button onclick="window._mjCatFilter='';document.querySelectorAll('.mjf-cat-btn').forEach(b=>{b.style.background='#111';b.style.color='#999';b.style.borderColor='#333';});_renderCodexEnemies();"
                style="background:#111;color:#aaa;border:1px solid #333;padding:2px 8px;cursor:pointer;border-radius:4px;font-size:0.75em;">Tout</button>
            ${groupItems.map(item=>`<button class="mjf-cat-btn" onclick="
                var s=window._mjCatFilter==='${item.replace(/'/g,"\\'")}' ?null:'${item.replace(/'/g,"\\'")}';window._mjCatFilter=s;
                document.querySelectorAll('.mjf-cat-btn').forEach(b=>{b.style.background='#111';b.style.color='#999';b.style.borderColor='#333';});
                if(s){this.style.background='#2a1800';this.style.color='#ffb74d';this.style.borderColor='#8b5000';}
                _renderCodexEnemies();"
                style="background:#111;color:#999;border:1px solid #333;padding:2px 7px;cursor:pointer;border-radius:4px;font-size:0.74em;white-space:nowrap;">
                ${isZone?'📍':(_MJ_CAT_ICONS[item]||'❓')} ${item}</button>`).join('')}
        </div>`;
}

function _renderCodexEnemies() {
    const container = document.getElementById('tbody-codex-mj');
    if (!container || typeof ennemisData === 'undefined') return;
    // Section ennemis : remettre flex-wrap
    container.style.flexDirection = '';
    container.style.flexWrap = 'wrap';
    container.style.alignContent = 'flex-start';
    const search = (document.getElementById('mjf-search')?.value || '').toLowerCase();
    const uniqOnly = document.getElementById('mjf-uniq')?.checked;
    const minNiv = parseInt(document.getElementById('mjf-niv-min')?.value)||0;
    const maxNiv = parseInt(document.getElementById('mjf-niv-max')?.value)||999;
    const catSel = window._mjCatFilter;
    // null = état initial (rien sélectionné) → placeholder
    if (catSel === null && !uniqOnly && !search) {
        container.innerHTML = `<div style="padding:24px;text-align:center;color:#555;font-size:0.85em;width:100%;">Sélectionnez une catégorie ou utilisez la recherche.</div>`;
        return;
    }
    const isZone = window._mjCodexGroupBy === 'zone';
    const battuMap = window._mjCodexBattu || {};
    const killsMap = window._mjCodexKills || {};

    const renderCard = (id, def, isUniq) => {
        const fo=def.statsBase?.FO||0,ini=def.statsBase?.IN||0,cn=def.statsBase?.CN||0;
        const pvMax=(fo*2)+ini+(def.boostPV||0), ftMax=(cn*2)+ini+(def.boostFT||0);
        const lootStr=(def.lootDrop||[]).map(l=>{const it=typeof itemsData!=='undefined'?itemsData[l.id]:null;return it?it.nom:l.id;}).join(', ');
        const nomColor=isUniq?'#ce93d8':'#e57373';
        const nbKillsRaw = killsMap[id]?.nbKills || 0;
        const battuBadge = isUniq && battuMap[id] ? `<span style="color:#4caf50;font-size:0.62em;"> ✅</span>` : '';
        const killBadge = isUniq ? '' : (() => {
            const t = nbKillsRaw >= 5 ? 3 : nbKillsRaw >= 3 ? 2 : nbKillsRaw >= 1 ? 1 : 0;
            const next = [1, 3, 5][t];
            const col = t >= 3 ? '#81c784' : t >= 2 ? '#ffb74d' : t >= 1 ? '#80cbc4' : '#555';
            return `<span style="color:${col};font-size:0.62em;"> ⚔${nbKillsRaw}${next ? '/'+next : '✓'}</span>`;
        })();
        const zones=(def.zones||[]).slice(0,2).join(', ');
        return `<div style="flex:1;min-width:190px;max-width:calc(50% - 3px);box-sizing:border-box;padding:5px 7px;border:1px solid ${isUniq?'#3a1a5a':'#1e1410'};border-radius:3px;background:${isUniq?'rgba(80,0,120,0.07)':'#0c0c0c'};">
            <div style="display:flex;align-items:center;gap:4px;">
                <div style="flex:1;min-width:0;">
                    <span style="color:${nomColor};font-size:0.82em;font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;">${def.nom}${battuBadge}${killBadge}</span>
                    <span style="color:#555;font-size:0.64em;">Niv.${def.niveau} · ❤${pvMax} ⚡${ftMax} · XP ${def.xp||0}</span>
                </div>
                <button onclick="mjChargerEnnemi('${id}')" style="background:#2a0a0a;color:#e57373;border:1px solid #8b0000;padding:2px 6px;cursor:pointer;border-radius:3px;font-size:0.72em;flex-shrink:0;">⚔</button>
            </div>
            <div style="color:#3a3a3a;font-size:0.62em;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                <span style="color:#444;">${def.race||'—'}</span>${zones?`<span style="color:#333;"> · ${zones}</span>`:''}${lootStr?`<span style="color:#4a3800;"> · 💰${lootStr}</span>`:''}
            </div>
        </div>`;
    };

    let allEntries = Object.entries(ennemisData).filter(([id, def]) => {
        if (search) {
            const hay = (def.nom+' '+(def.race||'')+' '+(def.zones||[]).join(' ')).toLowerCase();
            if (!hay.includes(search)) return false;
        }
        if (def.niveau < minNiv || def.niveau > maxNiv) return false;
        return true;
    });
    const uniqueEntries = allEntries.filter(([,d])=>d.unique);
    const normalEntries = allEntries.filter(([,d])=>!d.unique);

    const grouped = {};
    for (const [id, def] of normalEntries) {
        const keys = isZone
            ? ((def.zones||[]).length ? def.zones.slice(0,1) : ['Sans zone'])
            : [_mjGetCat(id, def)];
        for (const k of keys) { if (!grouped[k]) grouped[k]=[]; grouped[k].push([id,def]); }
    }
    const sortedGroups = Object.keys(grouped).sort((a,b)=>
        isZone ? a.localeCompare(b,'fr') : ((_MJ_CAT_ORDER.indexOf(a)<0?999:_MJ_CAT_ORDER.indexOf(a))-(_MJ_CAT_ORDER.indexOf(b)<0?999:_MJ_CAT_ORDER.indexOf(b)))
    );
    const visibleGroups = catSel ? sortedGroups.filter(g=>g===catSel) : sortedGroups;

    let html = '';
    if (!catSel && !uniqOnly && uniqueEntries.length) {
        html += `<div style="width:100%;background:rgba(60,0,100,0.15);padding:4px 8px;color:#ce93d8;font-size:0.7em;font-weight:bold;letter-spacing:1px;border-bottom:1px solid #3a1a5a;margin-top:2px;">★ ENNEMIS UNIQUES (${uniqueEntries.length})</div>`;
        uniqueEntries.sort((a,b)=>a[1].niveau-b[1].niveau).forEach(([id,def])=>{html+=renderCard(id,def,true);});
    }
    if (!uniqOnly) {
        for (const group of visibleGroups) {
            const gEnt = grouped[group].sort((a,b)=>a[1].niveau-b[1].niveau);
            const icon = isZone?'📍':(_MJ_CAT_ICONS[group]||'❓');
            html += `<div style="width:100%;background:rgba(0,0,0,0.4);padding:4px 8px;color:#888;font-size:0.7em;font-weight:bold;letter-spacing:1px;border-bottom:1px solid #1e1410;margin-top:2px;">${icon} ${group.toUpperCase()} (${gEnt.length})</div>`;
            gEnt.forEach(([id,def])=>{html+=renderCard(id,def,false);});
        }
    }
    if (uniqOnly && uniqueEntries.length) {
        html += `<div style="width:100%;background:rgba(60,0,100,0.15);padding:4px 8px;color:#ce93d8;font-size:0.7em;font-weight:bold;letter-spacing:1px;border-bottom:1px solid #3a1a5a;margin-top:2px;">★ ENNEMIS UNIQUES (${uniqueEntries.length})</div>`;
        uniqueEntries.sort((a,b)=>a[1].niveau-b[1].niveau).forEach(([id,def])=>{html+=renderCard(id,def,true);});
    }
    if (!html) html = `<div style="padding:16px;text-align:center;color:#555;font-size:0.85em;width:100%;">Aucun ennemi trouvé</div>`;
    container.innerHTML = html;
}

// ── Constantes catégories MJ ──────────────────────────────────────────────────
const _MJ_RACE_TO_CAT = {
    'Bête':'Bêtes','Lycanthrope':'Bêtes','Singe':'Singes',
    'Mort-vivant':'Morts-vivants','Esprit':'Esprits','Démon':'Démons',
    'Élémentaire':'Élémentaires','Araignée':'Araignées','Dragon':'Dragons',
    'Golem':'Golems','Construct':'Constructs','Pestilentiel':'Pestilentiels',
    'Animal':'Animaux','Insectoïde':'Insectoïdes',
    'Plante':'Plantes','Artificiel':'Créatures Artificielles','Fée':'Fées',
    'Troll':'Trolls','Humanoïde':'Humanoïdes',
    'Araya':'Arayas','Kite':'Kites','Krag':'Krags','Reptilien':'Reptiliens',
    'Humain':'Humains','Nain':'Nains','Elfe':'Elfes','Elfe Noir':'Elfes',
    'Ork':'Orques','Orque':'Orques','Demi-Orc':'Orques',
    'Demi-Ogre':'Demi-Ogres','Gnome':'Gnomes','Halfelin':'Halfelins'
};
const _MJ_CAT_ICONS = {
    'Bêtes':'🐺','Singes':'🐒','Morts-vivants':'💀','Esprits':'👻','Démons':'😈',
    'Élémentaires':'⚡','Araignées':'🕸','Arayas':'🪼','Dragons':'🐉','Golems':'🗿',
    'Constructs':'⚙','Pestilentiels':'🦠','Animaux':'🐄','Insectoïdes':'🕷',
    'Plantes':'🌿','Créatures Artificielles':'🤖','Fées':'🧚','Trolls':'🪨',
    'Humanoïdes':'🧟','Kites':'🏹','Krags':'⛏','Reptiliens':'🦎',
    'Humains':'🧑','Nains':'⚒','Elfes':'🧝','Orques':'💢',
    'Demi-Ogres':'👊','Gnomes':'🔧','Halfelins':'🗡',
    'Assassins de la Main':'🔪','Autres':'❓'
};
const _MJ_CAT_ORDER = ['Bêtes','Singes','Morts-vivants','Esprits','Démons','Élémentaires',
    'Araignées','Arayas','Dragons','Golems','Constructs','Pestilentiels','Animaux','Insectoïdes',
    'Plantes','Créatures Artificielles','Fées','Trolls','Humanoïdes',
    'Kites','Krags','Reptiliens','Humains','Nains','Elfes','Orques',
    'Demi-Ogres','Gnomes','Halfelins','Assassins de la Main','Autres'];
function _mjGetCat(id, def) {
    if (id.startsWith('main_assassin_')) return 'Assassins de la Main';
    const r = def.race || '';
    if (r==='Araignée') return 'Araignées';
    if (r==='Dragon') return 'Dragons';
    if (r==='Golem') return 'Golems';
    if (r==='Construct') return 'Constructs';
    if (r==='Pestilentiel') return 'Pestilentiels';
    if (r==='Animal') return 'Animaux';
    if (r==='Insectoïde') return 'Insectoïdes';
    return _MJ_RACE_TO_CAT[r] || 'Autres';
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
            if (typeof _toast === 'function') _toast("Quantité invalide.", 'error'); else return;
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
                liste.innerHTML += `<button onclick="executerDonObjetMJ('${id}')" style="background:#4caf50; color:white; padding:10px; border:none; border-radius:5px; cursor:pointer; margin-bottom:5px; width:100%;">${joueurs[id].nom}</button>`;
            }
        }

        // Compagnons de tous les joueurs
        db.ref('parties/' + sessionActuelle + '/compagnons').once('value', snapComps => {
            const tousComps = snapComps.val() || {};
            let hasComps = false;
            for (let ownerID in tousComps) {
                const arr = tousComps[ownerID];
                const list = Array.isArray(arr) ? arr : Object.values(arr);
                list.forEach(c => {
                    if (!hasComps) {
                        liste.innerHTML += `<hr style="border:0;border-top:1px solid #444;margin:8px 0;"><div style="color:#888;font-size:0.8em;margin-bottom:4px;">Compagnons</div>`;
                        hasComps = true;
                    }
                    const nomSafe = c.nom.replace(/'/g, "\\'");
                    liste.innerHTML += `<button onclick="executerDonObjetMJ('comp_${ownerID}_${c.idx}')" style="background:#2e1f4d; color:#b39ddb; padding:10px; border:1px solid #7c4dff; border-radius:5px; cursor:pointer; margin-bottom:5px; width:100%;">🤝 ${c.nom} <span style="color:#888;font-size:0.8em;">(${joueurs?.[ownerID]?.nom || ownerID})</span></button>`;
                });
            }
            document.getElementById('modal-transfert').style.display = 'block';
        });
    });
}




// Fonction Musique intégrée (inspirée de ton codex.js)





function genererMusiquesMJ_Integrated() {
    const tbody = document.getElementById('tbody-codex-mj');
    tbody.innerHTML = '';
    tbody.style.flexDirection = '';
    tbody.style.flexWrap = 'wrap';

    const stopDiv = document.createElement('div');
    stopDiv.style.cssText = 'width:100%;padding:8px 4px 10px;box-sizing:border-box;';
    stopDiv.innerHTML = `<button onclick="mjArreterMusique()" style="background:#8b0000;color:white;border:none;padding:10px;cursor:pointer;font-weight:bold;border-radius:4px;width:100%;font-size:0.85em;">⏹ ARRÊTER LA MUSIQUE MJ (Tout le groupe)</button>`;
    tbody.appendChild(stopDiv);

    playlistMJ.forEach(piste => {
        const card = document.createElement('div');
        card.style.cssText = 'flex:1;min-width:180px;max-width:calc(50% - 3px);box-sizing:border-box;padding:6px 8px;border:1px solid #2a2a2a;border-radius:4px;background:#0c0c0c;display:flex;flex-direction:column;gap:4px;';
        card.innerHTML = `
            <div style="color:#fff;font-size:0.85em;flex:1;">🎵 ${piste.nom}</div>
            <button onclick="mjChangerMusique('${piste.fichier}')" style="background:#2e7d32;color:#fff;border:1px solid #4caf50;padding:4px 8px;cursor:pointer;border-radius:3px;font-size:0.78em;width:100%;">▶ Lancer</button>`;
        tbody.appendChild(card);
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
    // Reset layout — sections non-ennemis utilisent une colonne, ennemis utilise flex-wrap
    tbody.style.flexDirection = 'column';
    tbody.style.flexWrap = 'nowrap';
    tbody.style.alignContent = '';

    if (type === 'items') {
        const LABELS_TYPE = {
            arme_melee:    '⚔️ Armes de mêlée',
            arme_distance: '🏹 Armes à distance',
            arme_feu:      '🔫 Armes à feu',
            armure:        '🛡️ Armures, bijoux & équipements',
            consommable:   '🧪 Consommables',
            munition:      '🔋 Munitions & carburant',
            explosif:      '💣 Explosifs, grenades & pièges',
            divers:        '🔧 Divers',
            objet_quete:   '📜 Objets de quête',
            argent:        '💰 Argent',
        };
        const groupes = {};
        for (let id in itemsData) {
            const t = itemsData[id].type || 'divers';
            if (!groupes[t]) groupes[t] = [];
            groupes[t].push({ id, data: itemsData[id] });
        }
        const ordre = ['arme_melee','arme_distance','arme_feu','armure','consommable','explosif','munition','divers','objet_quete','argent'];
        const typesSorted = [...new Set([...ordre, ...Object.keys(groupes)])].filter(t => groupes[t]);
        typesSorted.forEach(t => {
            const items = groupes[t];
            const label = LABELS_TYPE[t] || t;
            const safeType = t.replace(/[^a-z0-9_]/g, '_');
            const hdr = document.createElement('div');
            hdr.style.cssText = 'cursor:pointer;background:#1a1200;border-bottom:1px solid #3a2a00;padding:8px 12px;color:#d4af37;font-weight:bold;font-size:0.85em;width:100%;box-sizing:border-box;';
            hdr.innerHTML = `${label} <span style="color:#888;font-size:0.8em;">(${items.length})</span><span style="float:right;color:#666;">▼</span>`;
            hdr.addEventListener('click', () => {
                tbody.querySelectorAll('[data-item-type="' + safeType + '"]').forEach(r => {
                    r.style.display = r.style.display === 'none' ? 'flex' : 'none';
                });
            });
            tbody.appendChild(hdr);
            items.forEach(({ id, data }) => {
                const row = document.createElement('div');
                row.dataset.itemType = safeType;
                row.style.cssText = 'display:none;align-items:center;border-bottom:1px solid #1a1a1a;width:100%;box-sizing:border-box;';
                row.innerHTML = `
                    <div style="padding:8px 10px;color:#ffb74d;font-family:monospace;font-size:0.8em;width:80px;flex-shrink:0;">${id}</div>
                    <div style="padding:8px 10px;color:#fff;flex:1;">${data.nom}</div>
                    <div style="padding:8px 10px;text-align:right;flex-shrink:0;">
                        <button style="background:#444;color:#ff9800;border:1px solid #ff9800;padding:5px 10px;cursor:pointer;border-radius:3px;font-size:0.8em;">🎁 Donner</button>
                    </div>`;
                row.querySelector('button').addEventListener('click', (e) => {
                    e.stopPropagation();
                    mjDonnerObjetDirect(id);
                });
                tbody.appendChild(row);
            });
        });
    }
    else if (type === 'marchands') {
        tbody.style.flexDirection = '';
        tbody.style.flexWrap = 'wrap';
        for (let id in marchandsData) {
            _mjCarteContenu(tbody, 'marchand', id, marchandsData[id].nom);
        }
    }
    else if (type === 'coffres') {
        tbody.style.flexDirection = '';
        tbody.style.flexWrap = 'wrap';
        for (let id in coffresFixes) {
            _mjCarteContenu(tbody, 'coffre', id, coffresFixes[id].nom);
        }
    }
    else if (type === 'lieux') {
        tbody.style.flexDirection = '';
        tbody.style.flexWrap = 'wrap';
        // Boutons utilitaires en tête, pleine largeur
        const bar = document.createElement('div');
        bar.style.cssText = 'width:100%;display:flex;gap:8px;padding:6px 4px 8px;box-sizing:border-box;';
        bar.innerHTML = `
            <button onclick="AllLieux()" style="flex:1;background:#2e7d32;color:white;border:none;padding:7px;cursor:pointer;border-radius:4px;font-size:0.8em;font-weight:bold;">🌐 ALL Lieux (Test)</button>
            <button onclick="RAZLieux()" style="flex:1;background:#c62828;color:white;border:none;padding:7px;cursor:pointer;border-radius:4px;font-size:0.8em;font-weight:bold;">♻️ RAZ Lieux (Reset)</button>`;
        tbody.appendChild(bar);
        for (let id in lieuxDecouverts) {
            ajouterCarteCodexMJ(tbody, id, lieuxDecouverts[id].nom, `mjDecouvrirLieu('${id}')`, "📍 Révéler");
        }
    }
}

function mjChargerEnnemi(idEnnemi) {
    const ennemi = (typeof ennemisData !== 'undefined') ? ennemisData[idEnnemi] : null;
    if (!ennemi) return;

    const panel = document.getElementById('codex-ennemi-detail');
    if (!panel) return;

    const stats = ennemi.statsBase || {};
    const fo = stats.FO || 0, ini = stats.IN || 0, cn = stats.CN || 0;
    const pvMax = (fo * 2) + ini + (ennemi.boostPV || 0);
    const ftMax = (cn * 2) + ini + (ennemi.boostFT || 0);

    const lootStr = (ennemi.lootDrop || []).map(l => {
        const item = (typeof itemsData !== 'undefined') ? itemsData[l.id] : null;
        const pct = l.proba < 1 ? ` <span style="color:#888;font-size:0.85em;">(${Math.round(l.proba*100)}%)</span>` : '';
        return `${item ? item.nom : l.id} ×${l.qte}${pct}`;
    }).join('<br>');

    const compEntries = Object.entries(ennemi.compInvesties || {});
    const compStr = compEntries.length ? compEntries.map(([k,v]) => `${k}: ${v}`).join(' · ') : '—';

    const magieEntries = Object.entries(ennemi.magieBase || {});
    const magieStr = magieEntries.length ? magieEntries.map(([k,v]) => `${k} niv.${v}`).join(', ') : null;

    const zonesStr = (ennemi.zones || []).join(', ') || null;

    const uniqueBadge = ennemi.unique
        ? `<span style="background:#4a1a7a;color:#ce93d8;border:1px solid #9c27b0;border-radius:3px;padding:1px 7px;font-size:0.75em;margin-left:8px;">★ UNIQUE</span>`
        : '';

    const res = ennemi.resistances || {};
    const resDefs = [
        { key: 'resPhys',   label: 'Physique', color: '#78909c' },
        { key: 'resMagie',  label: 'Magie',    color: '#9c27b0' },
        { key: 'resFeu',    label: 'Feu',       color: '#f44336' },
        { key: 'resPoison', label: 'Poison',    color: '#4caf50' },
        { key: 'resElec',   label: 'Électricité', color: '#ffc107' },
    ];

    const resHtml = Object.keys(res).length
        ? `<div style="margin-top:12px; border-top:1px solid #333; padding-top:10px;">
            <div style="color:#ff9800; font-size:0.75em; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">⚔ Résistances <span style="color:#555;font-size:0.85em;">(MJ uniquement)</span></div>
            ${resDefs.map(d => {
                const val = res[d.key] || 0;
                const barW = Math.min(val, 100);
                const textColor = val === 0 ? '#f44336' : val >= 75 ? '#a5d6a7' : '#ccc';
                return `<div style="display:flex; align-items:center; gap:8px; margin-bottom:5px;">
                    <span style="color:#aaa; font-size:0.78em; width:76px; flex-shrink:0;">${d.label}</span>
                    <div style="flex:1; background:#222; border-radius:3px; height:8px; overflow:hidden;">
                        <div style="width:${barW}%; background:${d.color}; height:100%; opacity:0.85;"></div>
                    </div>
                    <span style="color:${textColor}; font-size:0.82em; width:34px; text-align:right;">${val}%</span>
                </div>`;
            }).join('')}
           </div>`
        : '';

    panel.style.display = 'block';
    panel.innerHTML = `
        <button onclick="document.getElementById('codex-ennemi-detail').style.display='none'"
            style="position:absolute;top:8px;right:10px;background:none;border:none;color:#888;font-size:1.1em;cursor:pointer;">✕</button>
        <div style="display:flex; align-items:flex-start; gap:14px; flex-wrap:wrap;">
            ${ennemi.portrait ? `<img src="docs/img/portraits/${ennemi.portrait}" onerror="this.style.display='none'"
                style="width:64px;height:64px;object-fit:contain;border:1px solid #333;border-radius:4px;background:#0a0a0a;">` : ''}
            <div style="flex:1; min-width:180px;">
                <div style="font-size:1.05em; font-weight:bold; color:#e57373;">${ennemi.nom}${uniqueBadge}</div>
                <div style="color:#aaa; font-size:0.82em; margin-top:2px;">${ennemi.race || ''} · Niveau ${ennemi.niveau}</div>
                <div style="display:flex; gap:14px; margin-top:8px; flex-wrap:wrap;">
                    <span style="color:#ef9a9a;">❤ PV ${pvMax}</span>
                    <span style="color:#80cbc4;">✦ FT ${ftMax}</span>
                    <span style="color:#fff176;">✦ XP ${ennemi.xp}</span>
                    ${ennemi.argent ? `<span style="color:#ffd54f;">◈ ${ennemi.argent} or</span>` : ''}
                </div>
            </div>
        </div>
        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(120px,1fr)); gap:6px; margin-top:12px; background:#0d0d0d; border-radius:4px; padding:8px;">
            ${['FO','CN','DX','IN','CH'].map(s =>
                `<div style="text-align:center;">
                    <div style="color:#888; font-size:0.7em;">${s}</div>
                    <div style="color:#fff; font-size:1em; font-weight:bold;">${stats[s] || 0}</div>
                </div>`).join('')}
            ${stats.MA ? `<div style="text-align:center;"><div style="color:#888;font-size:0.7em;">MA</div><div style="color:#ce93d8;font-size:1em;font-weight:bold;">${stats.MA}</div></div>` : ''}
        </div>
        ${magieStr ? `<div style="margin-top:8px;color:#ce93d8;font-size:0.82em;">🔮 ${magieStr}</div>` : ''}
        ${compEntries.length ? `<div style="margin-top:6px;color:#aaa;font-size:0.82em;">Compétences : ${compStr}</div>` : ''}
        ${zonesStr ? `<div style="margin-top:6px;color:#80cbc4;font-size:0.8em;">📍 ${zonesStr}</div>` : ''}
        <div style="margin-top:10px; border-top:1px solid #333; padding-top:8px;">
            <div style="color:#ff9800; font-size:0.75em; text-transform:uppercase; letter-spacing:1px; margin-bottom:5px;">Butin</div>
            <div style="color:#ccc; font-size:0.85em; line-height:1.6;">${lootStr || '<span style="color:#555;">Aucun</span>'}</div>
        </div>
        ${resHtml}
        <div style="margin-top:12px;border-top:1px solid #333;padding-top:10px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <div style="color:#ff9800;font-size:0.75em;text-transform:uppercase;letter-spacing:1px;">🔓 Bestiaire joueurs</div>
                ${(() => {
                    const k = (window._mjCodexKills?.[idEnnemi]?.nbKills) || 0;
                    const vu = !!(window._mjCodexKills?.[idEnnemi]?.premierVu) || k > 0;
                    const label = k >= 5 ? '<span style="color:#81c784;">🔮 Tout révélé</span>'
                        : k >= 3 ? '<span style="color:#ffb74d;">🎒 Équipement (⚔'+k+'/5)</span>'
                        : k >= 1 ? '<span style="color:#80cbc4;">📜 Nom+infos (⚔'+k+'/3)</span>'
                        : vu ? '<span style="color:#9c27b0;">👁 Aperçu (0 kill)</span>'
                        : '<span style="color:#555;">🔒 Non découvert</span>';
                    return `<div style="font-size:0.72em;">${label}</div>`;
                })()}
            </div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;">
                <button onclick="_mjDeverrouillerBestiaire('${idEnnemi}','vu')" style="background:#1a0a2a;color:#ce93d8;border:1px solid #6a1a9a;padding:4px 8px;cursor:pointer;border-radius:3px;font-size:0.76em;">👁 Aperçu</button>
                ${ennemi.unique ? `
                <button onclick="_mjDeverrouillerBestiaire('${idEnnemi}',1)" style="background:#0d1f0d;color:#81c784;border:1px solid #2e7d32;padding:4px 8px;cursor:pointer;border-radius:3px;font-size:0.76em;">✅ Révéler</button>
                ` : `
                <button onclick="_mjDeverrouillerBestiaire('${idEnnemi}',1)" style="background:#0a1a1a;color:#80cbc4;border:1px solid #00695c;padding:4px 8px;cursor:pointer;border-radius:3px;font-size:0.76em;">📜 ×1 Nom</button>
                <button onclick="_mjDeverrouillerBestiaire('${idEnnemi}',3)" style="background:#1a1000;color:#ffb74d;border:1px solid #8b5000;padding:4px 8px;cursor:pointer;border-radius:3px;font-size:0.76em;">🎒 ×3 Équip.</button>
                <button onclick="_mjDeverrouillerBestiaire('${idEnnemi}',5)" style="background:#1a0a0a;color:#ef9a9a;border:1px solid #8b0000;padding:4px 8px;cursor:pointer;border-radius:3px;font-size:0.76em;">🔮 ×5 Tout</button>
                `}
                <button onclick="_mjAntiReveler('${idEnnemi}')" style="background:#1a1a1a;color:#666;border:1px solid #3a3a3a;padding:4px 8px;cursor:pointer;border-radius:3px;font-size:0.76em;">🔒 Masquer</button>
            </div>
        </div>
    `;
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function genererEnnemisCodexMJ() {
    if (typeof ennemisData === 'undefined') return;
    _buildCodexEnemyFilters();
    Promise.all([
        db.ref('parties/' + sessionActuelle + '/ennemis_uniques').once('value'),
        db.ref('parties/' + sessionActuelle + '/bestiaire').once('value')
    ]).then(([s1, s2]) => {
        window._mjCodexBattu = s1.val() || {};
        window._mjCodexKills = s2.val() || {};
        _renderCodexEnemies();
    });
}

function _mjDeverrouillerBestiaire(monsterId, cible) {
    const ref = db.ref('parties/' + sessionActuelle + '/bestiaire/' + monsterId);
    ref.once('value', snap => {
        const actuel = snap.val() || {};
        const updates = {};
        if (!actuel.premierVu) updates.premierVu = Date.now();
        if (cible !== 'vu') {
            const nbCible = parseInt(cible);
            if ((actuel.nbKills || 0) < nbCible) updates.nbKills = nbCible;
        }
        if (Object.keys(updates).length > 0) {
            ref.update(updates);
            // Mettre à jour le cache local MJ
            if (!window._mjCodexKills) window._mjCodexKills = {};
            window._mjCodexKills[monsterId] = Object.assign({}, actuel, updates);
        }
        const nom = (typeof ennemisData !== 'undefined') ? (ennemisData[monsterId]?.nom || monsterId) : monsterId;
        if (typeof _toast === 'function') _toast('🔓 ' + nom + ' déverrouillé.', 'success');
        // Rafraîchir le panneau détail pour mettre à jour l'état affiché
        mjChargerEnnemi(monsterId);
    });
}

function _mjAntiReveler(monsterId) {
    const def = (typeof ennemisData !== 'undefined') ? ennemisData[monsterId] : null;
    const isUniq = def?.unique;
    const refPath = isUniq
        ? 'parties/' + sessionActuelle + '/ennemis_uniques/' + monsterId
        : 'parties/' + sessionActuelle + '/bestiaire/' + monsterId;
    db.ref(refPath).remove().then(() => {
        if (!window._mjCodexKills) window._mjCodexKills = {};
        delete window._mjCodexKills[monsterId];
        if (!window._mjCodexBattu) window._mjCodexBattu = {};
        delete window._mjCodexBattu[monsterId];
        const nom = def?.nom || monsterId;
        if (typeof _toast === 'function') _toast('🔒 ' + nom + ' masqué du bestiaire.', 'info');
        mjChargerEnnemi(monsterId);
    });
}

function _mjRevelerTous() {
    if (!confirm('Révéler TOUS les monstres dans le bestiaire des joueurs (kills = 5) ?')) return;
    const updates = {};
    const now = Date.now();
    Object.entries(ennemisData).forEach(([id, def]) => {
        if (!def.unique) {
            updates['bestiaire/' + id + '/premierVu'] = now;
            updates['bestiaire/' + id + '/nbKills'] = 5;
        }
    });
    db.ref('parties/' + sessionActuelle).update(updates).then(() => {
        if (typeof _toast === 'function') _toast('✅ Tous les monstres révélés.', 'success');
        genererEnnemisCodexMJ();
    });
}

function _mjCacherTous() {
    if (!confirm('Masquer TOUS les monstres du bestiaire des joueurs ?')) return;
    db.ref('parties/' + sessionActuelle + '/bestiaire').remove().then(() => {
        window._mjCodexKills = {};
        if (typeof _toast === 'function') _toast('🔒 Bestiaire réinitialisé.', 'info');
        genererEnnemisCodexMJ();
    });
}

function genererNPCsMJ() {
    const tbody = document.getElementById('tbody-codex-mj');
    if (!tbody || typeof personnagesNPC === 'undefined') return;
    tbody.innerHTML = '';

    for (let id in personnagesNPC) {
        const npc = personnagesNPC[id];
        const stats = npc.statsBase;
        const inv = npc.statsInvesties;
        const fo = stats.FO + inv.FO;
        const ini = stats.IN + inv.IN;
        const cn = stats.CN + inv.CN;
        const pvMax = (fo * 2) + ini + (npc.boostPV || 0);
        const ftMax = (cn * 2) + ini + (npc.boostFT || 0);

        tbody.innerHTML += `
            <tr style="border-bottom: 1px solid #2a1d12;">
                <td style="padding:10px; color:#d4af37; font-variant:small-caps; font-size:0.95em;">
                    ${npc.nom}
                    <div style="color:#666; font-size:0.75em; font-variant:normal; margin-top:2px;">${npc.race} — Niv.${npc.niveau}</div>
                </td>
                <td style="padding:10px; font-size:0.8em; color:#888;">
                    <span style="color:#e57373;">❤ ${pvMax}</span> &nbsp;
                    <span style="color:#64b5f6;">⚡ ${ftMax}</span><br>
                    <span style="color:#aaa;">FO:${fo} IN:${ini} CN:${cn} DX:${stats.DX+inv.DX} CH:${stats.CH+inv.CH}</span>
                </td>
                <td style="padding:10px; text-align:right;">
                    <button onclick="mjChargerNPC('${id}')" style="background:#1a2e1a; color:#4caf50; border:1px solid #4caf50; padding:5px 10px; cursor:pointer; border-radius:3px; font-size:0.8em;">
                        📋 Stats
                    </button>
                </td>
            </tr>`;
    }
}

function rafraichirListeJoueursMJ() {
    const container = document.getElementById('mj-liste-joueurs');
    if (!container) return;

    console.log("👥 [LOG] Mise à jour de la liste des joueurs MJ...");

    db.ref('parties/' + sessionActuelle + '/joueurs').on('value', (snapshot) => {
        const joueurs = snapshot.val();

        if (!joueurs) { container.innerHTML = ""; return; }

        db.ref('parties/' + sessionActuelle + '/compagnons').once('value', snapComps => {
            const tousCompagnons = snapComps.val() || {};
            // Vider le container ICI (dans once) pour éviter les doublons si le on() se re-déclenche
            container.innerHTML = "";

        for (let id in joueurs) {
            const j = joueurs[id];
            if (j.estMJ) continue;
            const estMort = (j.pvActuel <= 0);

            // Section compagnons du joueur (depuis le nœud dédié)
            const compsRaw = tousCompagnons[id];
            const comps = compsRaw ? (Array.isArray(compsRaw) ? compsRaw : Object.values(compsRaw)) : [];
            const compsHtml = comps.length
                ? comps.map(c => {
                    const key = id + '-' + c.idx;
                    const nomSafe = c.nom.replace(/'/g, "\\'");
                    // Inventaire du compagnon
                    const invItems = c.inventaire || [];
                    const invHtml = invItems.length
                        ? invItems.map(it => {
                            const def = (typeof itemsData !== 'undefined') ? itemsData[it.id] : null;
                            return def ? `<span style="color:#ccc; font-size:10px; background:rgba(0,0,0,0.3); border-radius:2px; padding:1px 4px;">${def.nom} ×${it.quantite || 1}</span>` : '';
                        }).filter(Boolean).join(' ')
                        : '<span style="color:#555; font-size:10px;">Aucun objet</span>';
                    return `
                    <div data-comp-key="${key}" style="background:rgba(50,35,10,0.6); border:1px solid #5a4010; padding:4px 6px; border-radius:3px; margin-top:3px;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="color:#d4af37; font-size:11px;">🤝 ${c.nom} <span style="color:#888;">Niv.${c.niveau}</span></span>
                            <span style="display:flex; gap:3px;">
                                <button onclick="mjOuvrirFicheCompagnon('${id}', ${c.idx})" style="background:#1a1a2e; color:#9575cd; border:1px solid #4a3a7a; padding:2px 5px; cursor:pointer; font-size:10px; border-radius:2px;">📋 Fiche</button>
                                <button onclick="mjLevelUpCompagnon('${id}', ${c.idx}, '${nomSafe}')" style="background:#1a3a1a; color:#4caf50; border:1px solid #4caf50; padding:2px 5px; cursor:pointer; font-size:10px; border-radius:2px;">🌟 LvUp</button>
                                <button onclick="mjAjouterItemCompagnon('${id}', ${c.idx})" style="background:#1a1a3a; color:#9575cd; border:1px solid #7c4dff; padding:2px 5px; cursor:pointer; font-size:10px; border-radius:2px;">🎒 Item</button>
                                <button onclick="mjRazCompagnon('${id}', ${c.idx}, '${nomSafe}')" style="background:#2a1a00; color:#ff9800; border:1px solid #8b4500; padding:2px 5px; cursor:pointer; font-size:10px; border-radius:2px;" title="Remettre à zéro progression + inventaire">🔄 RAZ</button>
                                <button onclick="mjRenvoyerCompagnon('${id}', ${c.idx}, '${nomSafe}')" style="background:#3a1010; color:#ff6b6b; border:1px solid #8b0000; padding:2px 5px; cursor:pointer; font-size:10px; border-radius:2px;">✕</button>
                            </span>
                        </div>
                        <div style="margin-top:3px; display:flex; flex-wrap:wrap; gap:3px;">🎒 ${invHtml}</div>
                    </div>`;
                }).join('')
                : `<div style="color:#555; font-size:10px; margin-top:3px;">Aucun compagnon</div>`;

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
                        <button onclick="mjDonnerLevelUp('${j.nom}')" style="grid-column: span 2; background:#ff9800; color:black; border:none; padding:4px; cursor:pointer; font-size:11px; font-weight:bold;">🌟 LEVEL UP joueur</button>
                        <button onclick="mjDonnerCompagnon('${id}', '${j.nom}')" style="grid-column: span 2; background:#1a2e1a; color:#4caf50; border:1px solid #4caf50; padding:4px; cursor:pointer; font-size:11px;">🤝 Donner Compagnon</button>
                        <button onclick="mjKickJoueur('${id}', '${j.nom}')" style="grid-column: span 2; background:#5a0000; color:#ff6b6b; border:1px solid #8b0000; padding:4px; cursor:pointer; font-size:11px;">🚫 Expulser de la session</button>
                        <button onclick="mjAutoriserVolATire('${id}', '${j.nom}')" style="grid-column: span 2; background:#1a1030; color:#b39ddb; border:1px solid #7c4dff; padding:4px; cursor:pointer; font-size:11px;">🤏 Autoriser Vol à la tire</button>
                        <button onclick="mjOuvrirMarchand('${id}', '${j.nom}')" style="grid-column: span 2; background:#2a1800; color:#ff9800; border:1px solid #795548; padding:4px; cursor:pointer; font-size:11px;">⚖️ Ouvrir un marchand</button>
                        <button onclick="mjOuvrirFouille('${id}', '${j.nom}')" style="grid-column: span 2; background:#0d1a0d; color:#4caf50; border:1px solid #2a5a2a; padding:4px; cursor:pointer; font-size:11px;">🔍 Ouvrir une fouille</button>
                        <button onclick="mjGererEffets('${id}', '${j.nom}')" style="grid-column: span 2; background:#1a1008; color:#ffd700; border:1px solid #7a6000; padding:4px; cursor:pointer; font-size:11px;">✨ Bénédictions / Malédictions</button>
                        <button onclick="mjGererSucces('${id}', '${j.nom}')" style="grid-column: span 2; background:#0a1a0a; color:#d4af37; border:1px solid #4a3a00; padding:4px; cursor:pointer; font-size:11px;">🏆 Gérer les Succès</button>
                        <button onclick="mjGererMaitrises('${id}', '${j.nom}')" style="grid-column: span 2; background:#0a1020; color:#9575cd; border:1px solid #4a2a8a; padding:4px; cursor:pointer; font-size:11px;">🎓 Maîtrises de compétences</button>
                    </div>

                    <div style="margin-top:6px; border-top:1px solid #333; padding-top:5px;">
                        <div style="color:#777; font-size:10px; text-transform:uppercase; margin-bottom:2px;">Compagnons</div>
                        ${compsHtml}
                    </div>
                </div>
            `;
        }
        }); // fin once compagnons
    });
}


function mjChargerNPC(idNPC) {
    const npc = (typeof personnagesNPC !== 'undefined') ? personnagesNPC[idNPC] : null;
    if (!npc) return;

    const stats = npc.statsBase;
    const inv   = npc.statsInvesties;
    const fo = stats.FO + inv.FO, i = stats.IN + inv.IN;
    const cn = stats.CN + inv.CN;
    const pvMax = (fo * 2) + i + (npc.boostPV || 0);
    const ftMax = (cn * 2) + i + (npc.boostFT || 0);

    const equipStr = Object.entries(npc.equipement)
        .filter(([, v]) => v !== null)
        .map(([slot, v]) => {
            const item = (typeof itemsData !== 'undefined') ? itemsData[v.id] : null;
            return `${slot}: ${item ? item.nom : v.id}`;
        }).join('\n');

    const compStr = Object.entries(npc.compInvesties)
        .map(([k, v]) => `${k}: ${v}`).join(', ');

    alert(`📋 ${npc.nom} (${npc.race}, Niv.${npc.niveau})\n\n` +
          `FO:${fo} IN:${i} CN:${cn} DX:${stats.DX + inv.DX} CH:${stats.CH + inv.CH}\n` +
          `PV:${pvMax}  FT:${ftMax}  Or:${npc.argent}\n\n` +
          `Équipement:\n${equipStr}\n\n` +
          `Compétences: ${compStr}`);
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

// ── GESTION DES COMPAGNONS (MJ) ────────────────────────────────────────────

/**
 * Le MJ assigne un compagnon (depuis compagnonsData) à un joueur.
 * Affiche une modal avec portraits, nom, niveau, race, contrainte.
 */
function mjDonnerCompagnon(playerID, playerNom) {
    if (typeof compagnonsData === 'undefined') return;
    document.getElementById('mj-modal-compagnon')?.remove();

    // Lit tous les compagnons actifs de tous les joueurs pour griser les déjà assignés
    db.ref('parties/' + sessionActuelle + '/compagnons').once('value', snapComps => {
        const tousComps = snapComps.val() || {};
        // Ensemble des compagnonId déjà dans n'importe quel groupe
        const dejaAssignes = new Set();
        for (const uid in tousComps) {
            const liste = tousComps[uid];
            if (Array.isArray(liste)) {
                liste.forEach(c => { if (c?.compagnonId) dejaAssignes.add(c.compagnonId); });
            }
        }

        const overlay = document.createElement('div');
        overlay.id = 'mj-modal-compagnon';
        overlay.style.cssText = `
            position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.82);
            display:flex;flex-direction:column;align-items:center;justify-content:flex-start;
            padding:24px 12px;overflow-y:auto;
        `;

        const _fermer = () => overlay.remove();
        overlay.addEventListener('click', e => { if (e.target === overlay) _fermer(); });

        const _assigner = (id) => {
            if (dejaAssignes.has(id)) return; // sécurité côté client
            db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/compagnon_action').set({
                type: 'don', compagnonId: id, timestamp: Date.now()
            });
            if (typeof _toast === 'function') _toast(`🤝 Compagnon envoyé à ${playerNom} !`, 'success');
            _fermer();
        };

        let html = `
            <div style="width:100%;max-width:860px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                    <span style="color:#d4af37;font-size:1.1em;font-weight:bold;">🤝 Donner un compagnon à <em style="color:#fff;">${playerNom}</em></span>
                    <button onclick="document.getElementById('mj-modal-compagnon')?.remove()"
                        style="background:#3a1010;color:#ff6b6b;border:1px solid #8b0000;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:0.9em;">✕ Fermer</button>
                </div>
                <input id="mj-cmp-search" type="text" placeholder="Rechercher…"
                    style="width:100%;box-sizing:border-box;padding:7px 10px;background:#111;border:1px solid #444;color:#eee;border-radius:4px;margin-bottom:12px;font-size:0.9em;">
                <div id="mj-cmp-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;">
        `;

        for (const [id, cmp] of Object.entries(compagnonsData)) {
            const pris = dejaAssignes.has(id);
            const badgeTemp = cmp.temporaire    ? `<span style="color:#e57373;font-size:0.7em;"> [temp]</span>` : '';
            const badgeSlot = cmp.prndSlot === false ? `<span style="color:#9575cd;font-size:0.7em;"> [hors-slot]</span>` : '';
            const badgePris = pris               ? `<div style="color:#ef9a9a;font-size:0.7em;margin-top:2px;">✗ déjà assigné</div>` : '';
            html += `
                <div class="mj-cmp-card" data-nom="${cmp.nom.toLowerCase()}"
                    onclick="(function(){ document.getElementById('mj-modal-compagnon').__assign('${id}'); })()"
                    style="background:${pris ? '#111' : '#1a1a1a'};border:1px solid ${pris ? '#3a1010' : '#333'};
                           border-radius:6px;padding:8px;text-align:center;transition:border-color 0.15s;
                           cursor:${pris ? 'not-allowed' : 'pointer'};opacity:${pris ? '0.45' : '1'};"
                    ${!pris ? `onmouseover="this.style.borderColor='#d4af37'" onmouseout="this.style.borderColor='#333'"` : ''}>
                    <img src="${cmp.portrait}" alt="${cmp.nom}"
                        style="width:80px;height:80px;object-fit:cover;border-radius:4px;margin-bottom:5px;display:block;margin-left:auto;margin-right:auto;"
                        onerror="this.style.display='none'">
                    <div style="color:${pris ? '#666' : '#eee'};font-size:0.82em;font-weight:bold;line-height:1.2;">${cmp.nom}${badgeTemp}${badgeSlot}</div>
                    <div style="color:#888;font-size:0.72em;margin-top:2px;">Niv.${cmp.niveau} · ${cmp.race}</div>
                    <div style="color:#666;font-size:0.68em;margin-top:3px;line-height:1.2;">${cmp.lieu}</div>
                    ${badgePris}
                </div>
            `;
        }

        html += '</div></div>';
        overlay.innerHTML = html;
        overlay.__assign = _assigner;

        overlay.querySelector('#mj-cmp-search').addEventListener('input', e => {
            const q = e.target.value.toLowerCase();
            overlay.querySelectorAll('.mj-cmp-card').forEach(card => {
                card.style.display = card.dataset.nom.includes(q) ? '' : 'none';
            });
        });

        document.body.appendChild(overlay);
        overlay.querySelector('#mj-cmp-search').focus();
    });
}

/** Ouvre la fiche complète d'un compagnon depuis le codex MJ (lecture Firebase). */
function mjOuvrirFicheCompagnon(playerID, compIdx) {
    db.ref('parties/' + sessionActuelle + '/compagnons/' + playerID).once('value', snap => {
        const liste = snap.val();
        const arr = Array.isArray(liste) ? liste : (liste ? Object.values(liste) : []);
        const cmp = arr.find(c => c.idx === compIdx) || arr[compIdx];
        if (!cmp) return;
        if (typeof ouvrirFicheCompagnon === 'function') ouvrirFicheCompagnon(cmp);
    });
}

/**
 * Panel de level-up compagnon (MJ) — lit Firebase, affiche les valeurs actuelles,
 * désactive les boutons quand le cap est atteint.
 * Caps : stats investies ≤ 10, compétences ≤ 20, magie ≤ 5, tech ≤ 5.
 */
function mjLevelUpCompagnon(playerID, compIdx, compNom) {
    const containerId = 'lvup-panel-' + playerID + '-' + compIdx;
    const existing = document.getElementById(containerId);
    if (existing) { existing.remove(); return; }

    const parent = document.querySelector(`[data-comp-key="${playerID}-${compIdx}"]`);
    if (!parent) return;

    // Lit les données actuelles du compagnon pour afficher les valeurs et vérifier les caps
    db.ref('parties/' + sessionActuelle + '/compagnons/' + playerID).once('value', snap => {
        const liste = snap.val();
        const arr = Array.isArray(liste) ? liste : (liste ? Object.values(liste) : []);
        const comp = arr.find(c => c.idx === compIdx) || arr[compIdx] || {};

        const statsInv  = comp.statsInvesties  || {};
        const compInv   = comp.compInvesties   || {};
        const magieInv  = comp.magieInvesties  || {};
        const techInv   = comp.techInvesties   || {};

        const CAP_STAT  = 10;
        const CAP_COMP  = 20;
        const CAP_MAGIE = 5;
        const CAP_TECH  = 5;

        const _envoyer = (payload) => {
            payload.type = 'levelup';
            payload.compIdx = compIdx;
            payload.timestamp = Date.now();
            db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/compagnon_action').set(payload);
            document.getElementById(containerId)?.remove();
            if (typeof _toast === 'function') _toast('🌟 Level-up envoyé à ' + compNom + ' !', 'gold');
        };

        const _btn = (label, val, cap, action, extra = '') => {
            const atCap = val >= cap;
            const pct   = cap > 0 ? Math.round((val / cap) * 100) : 0;
            return `<button class="comp-levelup-btn${atCap ? ' lvup-disabled' : ''}"
                ${atCap ? 'disabled title="Maximum atteint"' : `data-action='${JSON.stringify(action)}'`}
                style="${atCap ? 'opacity:0.35;cursor:not-allowed;' : ''}">
                ${label} <span style="color:${atCap ? '#e57373' : '#4caf50'};font-size:0.8em;">${val}/${cap}</span>${extra}
            </button>`;
        };

        let html = `<div class="lvup-titre">🌟 ${compNom} — Améliorer :</div>`;

        // --- Stats ---
        html += '<div class="lvup-section-titre">📊 Stats</div>';
        ['FO','IN','CN','DX','CH'].forEach(s => {
            html += _btn(`+1 ${s}`, statsInv[s] || 0, CAP_STAT, { stat: s });
        });

        // --- Compétences ---
        html += '<div class="lvup-section-titre">⚔ Compétences</div>';
        if (typeof competencesData !== 'undefined') {
            for (const cat in competencesData) {
                competencesData[cat].forEach(skill => {
                    const cur = compInv[skill.id] || 0;
                    // Prérequis stat : la stat gouvernante doit être ≥ 7 (total base+investie)
                    const statTotale = (comp.statsBase?.[skill.stat] || 0) + (statsInv[skill.stat] || 0);
                    const prereqOk = statTotale >= 7;
                    const note = !prereqOk ? ` <span style="color:#ef9a9a;font-size:0.72em;">${skill.stat}&lt;7</span>` : '';
                    const atCap = cur >= CAP_COMP || !prereqOk;
                    html += `<button class="comp-levelup-btn${atCap ? ' lvup-disabled' : ''}"
                        ${atCap ? 'disabled' : `data-action='${JSON.stringify({stat:'comp', competence:skill.id})}'`}
                        style="${atCap ? 'opacity:0.35;cursor:not-allowed;' : ''}">
                        ${skill.nom}${note} <span style="color:${cur >= CAP_COMP ? '#e57373' : '#4caf50'};font-size:0.8em;">${cur}/${CAP_COMP}</span>
                    </button>`;
                });
            }
        }

        // --- Magie ---
        html += '<div class="lvup-section-titre">✨ Magie</div>';
        if (typeof magieData !== 'undefined') {
            Object.keys(magieData).forEach(ecole => {
                html += _btn(ecole, magieInv[ecole] || 0, CAP_MAGIE, { stat: 'magie', ecole });
            });
        }

        // --- Technologie ---
        html += '<div class="lvup-section-titre">⚙ Technologie</div>';
        if (typeof techData !== 'undefined') {
            Object.keys(techData).forEach(disc => {
                html += _btn(disc, techInv[disc] || 0, CAP_TECH, { stat: 'tech', discipline: disc });
            });
        }

        const panel = document.createElement('div');
        panel.id = containerId;
        panel.className = 'comp-levelup-panel';
        panel.innerHTML = html;

        panel.addEventListener('click', e => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            _envoyer(JSON.parse(btn.dataset.action));
        });

        parent.after(panel);
    });
}

/**
 * Le MJ renvoie un compagnon.
 */
function mjRenvoyerCompagnon(playerID, compIdx, compNom) {
    db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/compagnon_action').set({
        type: 'renvoi', compIdx: compIdx, timestamp: Date.now()
    });
    if (typeof _toast === 'function') _toast(compNom + ' renvoyé.', '');
}

/**
 * Le MJ remet à zéro la progression d'un compagnon.
 */
function mjRazCompagnon(playerID, compIdx, compNom) {
    if (!confirm(`Remettre ${compNom} à zéro ?\nCela efface toute sa progression, ses niveaux et son équipement acquis.`)) return;
    db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/compagnon_action').set({
        type: 'raz', compIdx: compIdx, timestamp: Date.now()
    });
    if (typeof _toast === 'function') _toast(`🔄 ${compNom} remis à zéro.`);
}

/**
 * Le MJ ajoute un item à l'inventaire d'un compagnon.
 */
function mjAjouterItemCompagnon(playerID, compIdx) {
    if (typeof itemsData === 'undefined') return;
    const liste = Object.entries(itemsData)
        .filter(([,v]) => v.lootable !== false)
        .map(([id,v]) => id + ' — ' + v.nom).join('\n');
    const choix = prompt('Ajouter un item à ce compagnon :\n\n' + liste + '\n\nID :');
    if (!choix) return;
    const id = choix.trim().toUpperCase();
    if (!itemsData[id]) { if (typeof _toast === 'function') _toast('ID inconnu.', 'error'); return; }
    const qte = parseInt(prompt('Quantité ?') || '1') || 1;
    db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/compagnon_action').set({
        type: 'item_add', compIdx: compIdx, itemId: id, quantite: qte, timestamp: Date.now()
    });
    if (typeof _toast === 'function') _toast(itemsData[id].nom + ' ajouté.', 'success');
}

// ── GESTION DU COMBAT (MJ) ─────────────────────────────────────────────────

function _mjActualiserBtnBestiaire() {
    const f = window._cbtBestFilter || 'tous';
    const map = { tous: 'cbt-best-tous', non_vus: 'cbt-best-non-vus', vus: 'cbt-best-vus', cent: 'cbt-best-cent' };
    Object.entries(map).forEach(([k, id]) => {
        const btn = document.getElementById(id);
        if (!btn) return;
        const active = k === f;
        btn.style.background = active ? '#0a1a20' : '#111';
        btn.style.color = active ? '#80cbc4' : '#999';
        btn.style.borderColor = active ? '#37474f' : '#333';
    });
}

/** Quantités choisies par le MJ par ID d'ennemi. */
let _combatSelection = {};

/**
 * Génère l'interface de lancement de combat dans le panneau MJ.
 * Appelée quand on switche vers l'onglet 'combat'.
 */
function mjAfficherInterfaceCombat() {
    const section = document.getElementById('mj-section-combat');
    if (!section || typeof ennemisData === 'undefined') return;
    _combatSelection = {};
    window._cbtCatFilter = null;
    window._cbtGroupBy = window._cbtGroupBy || 'espece';
    window._cbtBestFilter = window._cbtBestFilter || 'tous';

    // Contexte rencontre donjon (si vient d'une rencontre)
    const rencontreCtx = window._rencontreDonjonContexte || null;
    window._rencontreDonjonContexte = null;

    // Charger le bestiaire pour les filtres
    Promise.all([
        db.ref('parties/' + sessionActuelle + '/bestiaire').once('value'),
        db.ref('parties/' + sessionActuelle + '/ennemis_uniques').once('value')
    ]).then(([bSnap, uSnap]) => {
        window._mjCodexKills = bSnap.val() || {};
        window._mjCodexBattu = uSnap.val() || {};
        if (window._mjRafraichirCombatListe) window._mjRafraichirCombatListe();
    });

    window._mjRafraichirCombatListe = function() {
            const search = (document.getElementById('cbt-search')?.value || '').toLowerCase();
            const minNiv = parseInt(document.getElementById('cbt-niv-min')?.value) || 0;
            const maxNiv = parseInt(document.getElementById('cbt-niv-max')?.value) || 999;
            const uniqOnly = document.getElementById('cbt-uniq')?.checked;
            const catSel = window._cbtCatFilter;

            let liste = Object.entries(ennemisData).map(([id, e]) => ({ id, ...e }));
            const bestFilter = window._cbtBestFilter || 'tous';
            liste = liste.filter(e => {
                if (search && !e.nom.toLowerCase().includes(search) && !(e.race||'').toLowerCase().includes(search)) return false;
                if (uniqOnly && !e.unique) return false;
                if (catSel && _mjGetCat(e.id, e) !== catSel) return false;
                if (e.niveau < minNiv || e.niveau > maxNiv) return false;
                if (bestFilter !== 'tous') {
                    const kills = (window._mjCodexKills || {})[e.id];
                    const nbKills = kills?.nbKills || 0;
                    const vu = !!(kills?.premierVu) || nbKills > 0;
                    if (e.unique) {
                        const battu = !!(window._mjCodexBattu || {})[e.id];
                        if (bestFilter === 'non_vus' && (vu || battu)) return false;
                        if (bestFilter === 'vus' && !vu && !battu) return false;
                        if (bestFilter === 'cent' && !battu) return false;
                    } else {
                        if (bestFilter === 'non_vus' && vu) return false;
                        if (bestFilter === 'vus' && !vu) return false;
                        if (bestFilter === 'cent' && nbKills < 5) return false;
                    }
                }
                return true;
            });
            liste.sort((a,b) => {
                if (a.unique && !b.unique) return -1;
                if (!a.unique && b.unique) return 1;
                return a.niveau - b.niveau;
            });

            // Grouper par catégorie ou par zone
            const byZone = window._cbtGroupBy === 'zone';
            const grouped = {};
            for (const e of liste) {
                let cat;
                if (e.unique) cat = '★ Uniques';
                else if (byZone) cat = (e.zones||[])[0] || 'Sans zone';
                else cat = _mjGetCat(e.id, e);
                if (!grouped[cat]) grouped[cat] = [];
                grouped[cat].push(e);
            }
            const sortedCats = Object.keys(grouped).sort((a,b) => {
                if (a==='★ Uniques') return -1;
                if (b==='★ Uniques') return 1;
                if (byZone) return a.localeCompare(b, 'fr');
                const ia=_MJ_CAT_ORDER.indexOf(a),ib=_MJ_CAT_ORDER.indexOf(b);
                return (ia<0?999:ia)-(ib<0?999:ib);
            });

            let lignes = '';
            for (const cat of sortedCats) {
                const isUniq = cat === '★ Uniques';
                const icon = isUniq ? '★' : (_MJ_CAT_ICONS[cat]||'❓');
                const hdrColor = isUniq ? '#ce93d8' : '#888';
                const hdrBg = isUniq ? 'rgba(60,0,100,0.15)' : 'rgba(0,0,0,0.4)';
                const hdrBorder = isUniq ? '#3a1a5a' : '#1e1410';
                lignes += `<div style="width:100%;background:${hdrBg};padding:4px 8px;color:${hdrColor};font-size:0.7em;font-weight:bold;letter-spacing:1px;border-bottom:1px solid ${hdrBorder};border-top:1px solid ${hdrBorder};margin-top:3px;">${icon} ${cat.toUpperCase()} (${grouped[cat].length})</div>`;
                for (const e of grouped[cat]) {
                    const fo = (e.statsBase?.FO||0)+(e.statsInvesties?.FO||0);
                    const ini = (e.statsBase?.IN||0)+(e.statsInvesties?.IN||0);
                    const pvMax = (fo*2)+ini+(e.boostPV||0);
                    const nomColor = e.unique ? '#ce93d8' : '#ccc';
                    const zones = (e.zones||[]).slice(0,2).join(', ');
                    lignes += `<div style="flex:1;min-width:200px;max-width:calc(50% - 3px);box-sizing:border-box;padding:4px 6px;border:1px solid ${e.unique?'#3a1a5a':'#1e1410'};border-radius:3px;background:${e.unique?'rgba(80,0,120,0.06)':'#0c0c0c'};">
                        <div style="display:flex;align-items:center;gap:3px;">
                            <div style="flex:1;min-width:0;">
                                <span style="color:${nomColor};font-size:0.82em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;">${e.nom}</span>
                                <span style="color:#444;font-size:0.65em;">Niv.${e.niveau} ❤${pvMax}</span>
                            </div>
                            <button onclick="var v=Math.max(0,(parseInt(document.getElementById('qty-${e.id}').value)||0)-1);document.getElementById('qty-${e.id}').value=v;_combatSelection['${e.id}']=v;"
                                style="width:20px;height:20px;background:#2a0a0a;border:1px solid #5a2a2a;color:#ff8a80;border-radius:3px;cursor:pointer;font-size:0.85em;line-height:1;padding:0;flex-shrink:0;">−</button>
                            <input type="number" id="qty-${e.id}" min="0" max="20" value="${_combatSelection[e.id]||0}"
                                style="width:28px;background:#111;color:#fff;border:1px solid #444;padding:1px;text-align:center;border-radius:3px;font-size:0.8em;flex-shrink:0;"
                                onchange="_combatSelection['${e.id}']=parseInt(this.value)||0">
                            <button onclick="var v=Math.min(20,(parseInt(document.getElementById('qty-${e.id}').value)||0)+1);document.getElementById('qty-${e.id}').value=v;_combatSelection['${e.id}']=v;"
                                style="width:20px;height:20px;background:#0a2a0a;border:1px solid #2a5a2a;color:#a5d6a7;border-radius:3px;cursor:pointer;font-size:0.85em;line-height:1;padding:0;flex-shrink:0;">+</button>
                        </div>
                        <div style="color:#3a3a3a;font-size:0.63em;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${e.race||'—'}${zones?' · '+zones:''}</div>
                    </div>`;
                }
            }
            if (!lignes) lignes = `<div style="padding:16px;text-align:center;color:#555;font-size:0.85em;width:100%;">Aucun ennemi correspondant</div>`;
            const tbl = document.getElementById('tbl-combat-ennemis');
            if (tbl) tbl.innerHTML = lignes;
        };

        // Construire boutons catégories pour le combat
        const cbtCats = [...new Set(Object.entries(ennemisData).filter(([,e])=>!e.unique).map(([id,e])=>_mjGetCat(id,e)))];
        cbtCats.sort((a,b)=>(_MJ_CAT_ORDER.indexOf(a)<0?999:_MJ_CAT_ORDER.indexOf(a))-(_MJ_CAT_ORDER.indexOf(b)<0?999:_MJ_CAT_ORDER.indexOf(b)));
        const catBtns = cbtCats.map(cat=>`<button class="cbt-cat-btn" onclick="
            var sel=window._cbtCatFilter==='${cat}'?null:'${cat}';window._cbtCatFilter=sel;
            document.querySelectorAll('.cbt-cat-btn').forEach(b=>{b.style.background='#1a0808';b.style.color='#999';b.style.borderColor='#3a1a1a';});
            if(sel){this.style.background='#1a1000';this.style.color='#ffb74d';this.style.borderColor='#8b5000';}
            window._mjRafraichirCombatListe();"
            style="background:#1a0808;color:#999;border:1px solid #3a1a1a;padding:3px 7px;cursor:pointer;border-radius:3px;font-size:0.74em;white-space:nowrap;">
            ${_MJ_CAT_ICONS[cat]||'❓'} ${cat}</button>`).join('');

        const banniereRencontre = rencontreCtx
            ? `<div style="background:#2a1000;border:1px solid #ff6b6b;border-radius:6px;padding:8px 12px;margin-bottom:10px;color:#ff9966;font-size:0.88em;">👹 <strong>Rencontre :</strong> ${rencontreCtx}</div>`
            : '';

        section.innerHTML = `
            <div id="cbt-combat-actif-banner"></div>
            ${banniereRencontre}
            <div style="margin-bottom:6px;display:flex;gap:5px;flex-wrap:wrap;align-items:center;">
                <input id="cbt-search" type="text" placeholder="🔍 Nom / race..." oninput="window._mjRafraichirCombatListe()"
                    style="flex:1;min-width:120px;background:#111;color:#fff;border:1px solid #555;padding:4px 8px;border-radius:3px;font-size:0.8em;">
                <input id="cbt-niv-min" type="number" min="1" max="30" placeholder="Niv min"
                    style="width:65px;background:#111;color:#fff;border:1px solid #555;padding:4px 6px;border-radius:3px;font-size:0.78em;" oninput="window._mjRafraichirCombatListe()">
                <input id="cbt-niv-max" type="number" min="1" max="30" placeholder="Niv max"
                    style="width:65px;background:#111;color:#fff;border:1px solid #555;padding:4px 6px;border-radius:3px;font-size:0.78em;" oninput="window._mjRafraichirCombatListe()">
                <button id="cbt-uniq-btn" onclick="var cb=document.getElementById('cbt-uniq');cb.checked=!cb.checked;this.style.background=cb.checked?'#2a003a':'#1a0808';this.style.color=cb.checked?'#ce93d8':'#999';window._mjRafraichirCombatListe();"
                    style="background:#1a0808;color:#999;border:1px solid #3a1a5a;padding:4px 9px;cursor:pointer;border-radius:3px;font-size:0.78em;">★ Uniques</button>
                <input id="cbt-uniq" type="checkbox" style="display:none;">
            </div>
            <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:4px;align-items:center;">
                <button id="cbt-grp-espece" onclick="window._cbtGroupBy='espece';window._cbtCatFilter=null;document.querySelectorAll('.cbt-cat-btn').forEach(b=>{b.style.background='#1a0808';b.style.color='#999';b.style.borderColor='#3a1a1a';});document.getElementById('cbt-grp-espece').style.background='#1a100a';document.getElementById('cbt-grp-espece').style.color='#ffb74d';document.getElementById('cbt-grp-espece').style.borderColor='#8b5000';document.getElementById('cbt-grp-zone').style.background='#1a0808';document.getElementById('cbt-grp-zone').style.color='#999';document.getElementById('cbt-grp-zone').style.borderColor='#3a1a1a';window._mjRafraichirCombatListe();"
                    style="background:#1a100a;color:#ffb74d;border:1px solid #8b5000;padding:3px 8px;cursor:pointer;border-radius:3px;font-size:0.74em;">🐺 Espèce</button>
                <button id="cbt-grp-zone" onclick="window._cbtGroupBy='zone';window._cbtCatFilter=null;document.querySelectorAll('.cbt-cat-btn').forEach(b=>{b.style.background='#1a0808';b.style.color='#999';b.style.borderColor='#3a1a1a';});document.getElementById('cbt-grp-zone').style.background='#0a1a10';document.getElementById('cbt-grp-zone').style.color='#80cbc4';document.getElementById('cbt-grp-zone').style.borderColor='#006060';document.getElementById('cbt-grp-zone').style.color='#80cbc4';document.getElementById('cbt-grp-espece').style.background='#1a0808';document.getElementById('cbt-grp-espece').style.color='#999';document.getElementById('cbt-grp-espece').style.borderColor='#3a1a1a';window._mjRafraichirCombatListe();"
                    style="background:#1a0808;color:#999;border:1px solid #3a1a1a;padding:3px 8px;cursor:pointer;border-radius:3px;font-size:0.74em;">📍 Zone</button>
            </div>
            <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:7px;">
                <button onclick="window._cbtCatFilter=null;document.querySelectorAll('.cbt-cat-btn').forEach(b=>{b.style.background='#1a0808';b.style.color='#999';b.style.borderColor='#3a1a1a';});window._mjRafraichirCombatListe();"
                    style="background:#1a0808;color:#e57373;border:1px solid #8b0000;padding:3px 8px;cursor:pointer;border-radius:3px;font-size:0.74em;">Tout</button>
                ${catBtns}
            </div>
            <div style="display:flex;gap:3px;flex-wrap:wrap;margin-bottom:6px;align-items:center;">
                <span style="color:#555;font-size:0.7em;margin-right:2px;">Bestiaire :</span>
                <button id="cbt-best-tous" onclick="window._cbtBestFilter='tous';_mjActualiserBtnBestiaire();window._mjRafraichirCombatListe();"
                    style="background:#0a1a20;color:#80cbc4;border:1px solid #37474f;padding:2px 7px;cursor:pointer;border-radius:3px;font-size:0.72em;">Tous</button>
                <button id="cbt-best-non-vus" onclick="window._cbtBestFilter='non_vus';_mjActualiserBtnBestiaire();window._mjRafraichirCombatListe();"
                    style="background:#111;color:#999;border:1px solid #333;padding:2px 7px;cursor:pointer;border-radius:3px;font-size:0.72em;">Non rencontrés</button>
                <button id="cbt-best-vus" onclick="window._cbtBestFilter='vus';_mjActualiserBtnBestiaire();window._mjRafraichirCombatListe();"
                    style="background:#111;color:#999;border:1px solid #333;padding:2px 7px;cursor:pointer;border-radius:3px;font-size:0.72em;">Rencontrés</button>
                <button id="cbt-best-cent" onclick="window._cbtBestFilter='cent';_mjActualiserBtnBestiaire();window._mjRafraichirCombatListe();"
                    style="background:#111;color:#999;border:1px solid #333;padding:2px 7px;cursor:pointer;border-radius:3px;font-size:0.72em;">100% débloqués</button>
            </div>
            <div style="max-height:45vh;overflow-y:auto;border:1px solid #333;border-radius:4px;margin-bottom:10px;">
                <div id="tbl-combat-ennemis" style="display:flex;flex-wrap:wrap;gap:3px;padding:4px;align-content:flex-start;"></div>
            </div>
            <button onclick="mjLancerCombat()" style="width:100%;background:#8b0000;color:white;border:none;padding:12px;cursor:pointer;font-size:1em;font-weight:bold;border-radius:4px;letter-spacing:0.05em;">
                ⚔ LANCER LE COMBAT
            </button>
            <button onclick="ouvrirHistoriqueCombats()" style="width:100%;margin-top:6px;background:#0d1a1a;color:#80cbc4;border:1px solid #37474f;padding:8px;cursor:pointer;font-size:0.85em;border-radius:4px;">
                📜 Historique des combats
            </button>`;
        window._mjRafraichirCombatListe();
        _mjActualiserBtnBestiaire();

    // Vérifier si un combat est déjà en cours (asynchrone, après rendu de la liste)
    db.ref('parties/' + sessionActuelle + '/combat_actif').once('value', (snap) => {
        const enCours = snap.val();
        if (!enCours || !enCours.actif) return;

        const ordre      = enCours.ordre_jeu || [];
        const tourIdx    = (enCours.tour_actuel || 0) % (ordre.length || 1);
        const participant = ordre[tourIdx];
        const ordreHtml  = ordre.map((p, i) =>
            '<span style="color:' + (i === tourIdx ? '#ff6b6b' : '#555') + '; font-size:0.78em;">'
            + (i === tourIdx ? '▶ ' : '') + p.nom + ' ⚡' + p.vitesse + '</span>'
        ).join(' › ');
        const ennemisHtml = (enCours.ennemis || []).map(e =>
            (e.pvActuel <= 0 ? '☠ ' : '') + e.nom + ' — PV ' + e.pvActuel + '/' + e.pvMax
        ).join('<br>');

        const banner = document.getElementById('cbt-combat-actif-banner');
        if (banner) banner.innerHTML =
            '<div style="background:rgba(139,0,0,0.2); border:1px solid #8b0000; border-radius:6px; padding:16px; margin-bottom:12px;">'
            + '<div style="color:#ff6b6b; font-size:1.05em; font-weight:bold; margin-bottom:10px;">⚔ COMBAT EN COURS</div>'
            + '<div style="margin-bottom:10px; line-height:1.8;">' + ordreHtml + '</div>'
            + '<div style="color:#aaa; font-size:0.8em; margin-bottom:12px; border-top:1px solid #333; padding-top:8px;">' + ennemisHtml + '</div>'
            + '<div style="color:#888; font-size:0.8em; margin-bottom:12px;">Tour : <strong style="color:#d4af37;">'
            + (participant ? participant.nom : '?') + '</strong>'
            + (participant && participant.type === 'ennemi' ? ' (ennemi — vous jouez)' : '') + '</div>'
            + '<div style="display:flex; gap:8px;">'
            + '<button onclick="mjTourSuivant()" style="flex:1; background:#1a3a1a; color:#4caf50; border:1px solid #4caf50; padding:8px; cursor:pointer; border-radius:4px; font-weight:bold;">▶ Tour suivant</button>'
            + '<button onclick="ouvrirEcranCombat()" style="flex:1; background:#1a1a3a; color:#9575cd; border:1px solid #7c4dff; padding:8px; cursor:pointer; border-radius:4px;">👁 Voir combat</button>'
            + '<button onclick="mjTerminerCombat()" style="flex:1; background:#3a0000; color:#ff6b6b; border:1px solid #8b0000; padding:8px; cursor:pointer; border-radius:4px; font-weight:bold;">🛑 Terminer</button>'
            + '</div></div>';
    });
}

/**
 * Écrit le combat dans Firebase.
 * Tous les joueurs connectés basculent automatiquement sur ecran-combat.
 */
function mjLancerCombat() {
    const ennemisChoisis = [];
    let instanceIdx = 0;

    for (let id in _combatSelection) {
        const qte = _combatSelection[id];
        if (!qte || qte <= 0) continue;

        const e = ennemisData[id];
        if (!e) continue;

        const fo  = e.statsBase.FO + (e.statsInvesties?.FO || 0);
        const ini = e.statsBase.IN + (e.statsInvesties?.IN || 0);
        const cn  = e.statsBase.CN + (e.statsInvesties?.CN || 0);
        const pvMax = (fo * 2) + ini + (e.boostPV || 0);
        const ftMax = (cn * 2) + ini + (e.boostFT || 0);

        for (let i = 0; i < qte; i++) {
            ennemisChoisis.push({
                instanceId: instanceIdx++,
                id,
                nom: qte > 1 ? `${e.nom} ${i + 1}` : e.nom,
                race: e.race || null,
                niveau: e.niveau,
                pvActuel: e.pvActuel || pvMax,
                pvMax,
                ftActuel: e.ftActuel || ftMax,
                ftMax,
                xp: e.xp || 0,
                elementDegats: e.elementDegats || null,
                equipement: e.equipement || null,
                statsBase: e.statsBase || null,
                statsInvesties: e.statsInvesties || null,
                compInvesties: e.compInvesties || null,
                sortsConnus: (() => {
                    const mb = e.magieBase || {};
                    const sorts = [];
                    for (const [ecole, nb] of Object.entries(mb)) {
                        if (typeof magieData !== 'undefined' && magieData[ecole]?.sorts) {
                            for (let k = 0; k < nb && k < magieData[ecole].sorts.length; k++) {
                                sorts.push(magieData[ecole].sorts[k].nom);
                            }
                        }
                    }
                    return sorts;
                })()
            });
        }
    }

    if (ennemisChoisis.length === 0) {
        if (typeof _toast === 'function') _toast('Sélectionnez au moins un ennemi.', 'error');
        return;
    }

    // Récupère les joueurs + compagnons pour construire l'ordre de jeu
    db.ref('parties/' + sessionActuelle + '/joueurs').once('value', (snap) => {
        const joueurs = snap.val() || {};

        db.ref('parties/' + sessionActuelle + '/compagnons').once('value', (snapComps) => {
        db.ref('parties/' + sessionActuelle + '/familiers').once('value', (snapFam) => {
        db.ref('parties/' + sessionActuelle + '/animaux').once('value', (snapAnim) => {
        const tousCompagnons = snapComps.val() || {};
        const tousFamiliers  = snapFam.val()   || {};
        const tousAnimaux    = snapAnim.val()  || {};
        const participants = [];

        // Joueurs + leurs compagnons (le MJ est exclu)
        for (let id in joueurs) {
            const j = joueurs[id];
            if (j.estMJ) continue;
            // Bonus de vitesse selon le rang de compétence et l'arme équipée
            let vitesseJ = j.vitesse || j.niveau || 1;
            const eqJ = j.equipement || {};
            const armeSlotJ = eqJ.main_droite || eqJ.deux_mains || eqJ.main_gauche;
            const armeDefJ = (typeof itemsData !== 'undefined' && armeSlotJ?.id) ? itemsData[armeSlotJ.id] : null;
            const rangsJ = j.rangsComp || {};
            const estArcJ   = armeDefJ?.type === 'arme_distance' && armeDefJ?.soustype === 'arc';
            const estFeuJ   = armeDefJ?.type === 'arme_feu';
            const estLancerJ = armeDefJ?.type === 'arme_distance' && !estArcJ;
            const estMeleeJ = !armeSlotJ || armeDefJ?.type === 'arme_melee';
            if ((rangsJ.arc || 0) >= 1 && estArcJ)             vitesseJ += 5;
            else if ((rangsJ.melee || 0) >= 1 && estMeleeJ)    vitesseJ += 5;
            else if ((rangsJ.lancer || 0) >= 1 && estLancerJ)  vitesseJ += 5;
            else if ((rangsJ.armes_a_feu || 0) >= 1 && estFeuJ) vitesseJ += 5;
            participants.push({
                type: 'joueur',
                id,
                nom: j.nom,
                vitesse: vitesseJ
            });
            // Familier depuis le nœud dédié
            const familier = tousFamiliers[id];
            if (familier && (familier.pvActuel === undefined || familier.pvActuel > 0)) {
                const fPV = familier.pvActuel || familier.pv || 30;
                const fFT = familier.ftActuel || familier.ft || 20;
                participants.push({
                    type: 'invoque',
                    instanceId: Date.now() + Math.floor(Math.random() * 1000),
                    id: 'familier_' + id,
                    nom: familier.nom || 'Familier',
                    race: 'familier',
                    niveau: familier.niveau || 1,
                    invocateurId: id,
                    invocateurNom: j.nom,
                    vitesse: familier.stats ? familier.stats.DX || 5 : 5,
                    pvActuel: fPV, pvMax: fPV,
                    ftActuel: fFT, ftMax: fFT,
                    stats: familier.stats || { FO: 5, CN: 5, DX: 5, IN: 3, CH: 3 },
                    res:   familier.res   || {},
                    sortsConnus: familier.sortsConnus || [],
                    riposteFeu: false, soinsParTour: 0, esquiveInnee: 0, ko: false
                });
            }

            // Animal compagnon depuis le nœud dédié
            const animal = tousAnimaux[id];
            if (animal && (animal.pvActuel === undefined || animal.pvActuel > 0)) {
                const aPV = animal.pvActuel || animal.pv || 30;
                const aFT = animal.ftActuel || animal.ft || 20;
                participants.push({
                    type: 'invoque',
                    instanceId: Date.now() + Math.floor(Math.random() * 1000) + 1,
                    id: 'animal_' + id,
                    nom: animal.nom || 'Animal',
                    race: 'animal',
                    niveau: animal.niveau || 1,
                    invocateurId: id,
                    invocateurNom: j.nom,
                    vitesse: animal.stats ? animal.stats.DX || 5 : 5,
                    pvActuel: aPV, pvMax: aPV,
                    ftActuel: aFT, ftMax: aFT,
                    stats: animal.stats || { FO: 8, CN: 8, DX: 8, IN: 3, CH: 3 },
                    res:   animal.res   || {},
                    sortsConnus: animal.sortsConnus || [],
                    riposteFeu: false, soinsParTour: 0, esquiveInnee: 0, ko: false
                });
            }

            // Compagnons depuis le nœud dédié
            const compsRaw = tousCompagnons[id];
            const comps = compsRaw ? (Array.isArray(compsRaw) ? compsRaw : Object.values(compsRaw)) : [];
            comps.forEach(c => {
                const cFO = (c.statsBase?.FO || 5) + (c.statsInvesties?.FO || 0);
                const cIN = (c.statsBase?.IN || 5) + (c.statsInvesties?.IN || 0);
                const cCN = (c.statsBase?.CN || 5) + (c.statsInvesties?.CN || 0);
                const cPvMax = (cFO * 2) + cIN + (c.boostPV || 0);
                const cFtMax = (cCN * 2) + cIN + (c.boostFT || 0);
                participants.push({
                    type: 'compagnon',
                    nom: c.nom,
                    niveau: c.niveau || 1,
                    ownerNom: j.nom,
                    ownerID: id,
                    compIdx: c.idx,
                    vitesse: Math.max(1, (c.niveau || 1) * 2),
                    pvActuel: (c.pvActuel > 0) ? c.pvActuel : cPvMax,
                    pvMax: cPvMax,
                    ftActuel: (c.ftActuel > 0) ? c.ftActuel : cFtMax,
                    ftMax: cFtMax,
                    xp: c.xp || 0,
                    statsBase: c.statsBase || null,
                    statsInvesties: c.statsInvesties || null,
                    magieInvesties: c.magieInvesties || null,
                    inventaire: c.inventaire || null,
                    equipement: c.equipement || {}
                });
            });
        }

        // Ennemis (vitesse = DX de leur fiche)
        ennemisChoisis.forEach(e => {
            const orig = ennemisData[e.id];
            const dx = orig ? (orig.statsBase.DX + (orig.statsInvesties?.DX || 0)) : 5;
            participants.push({
                type: 'ennemi',
                instanceId: e.instanceId,
                nom: e.nom,
                vitesse: dx
            });
        });

        // Tri décroissant par vitesse (à égalité, les joueurs passent avant)
        participants.sort((a, b) => b.vitesse - a.vitesse || (a.type === 'joueur' ? -1 : 1));

        // Calcul de la discrétion : 2% par point → griser le bouton au 1er tour de chaque ennemi
        const joueurs_discrets = {};
        for (let id in joueurs) {
            if (joueurs[id].estMJ) continue;
            const discPts = joueurs[id].discretion || 0;
            if (discPts > 0) {
                const chance = discPts * 2; // 2% par point
                joueurs_discrets[id] = Math.floor(Math.random() * 100) < chance;
            } else {
                joueurs_discrets[id] = false;
            }
        }
        window._ennemisOntAttaque = new Set(); // reset pour le nouveau combat

        db.ref('parties/' + sessionActuelle + '/combat_log').remove();
        db.ref('parties/' + sessionActuelle + '/combat_actif').set({
            actif: true,
            ennemis: ennemisChoisis,
            ordre_jeu: participants,
            tour_actuel: 0,
            joueurs_discrets,
            timestamp: Date.now()
        }).then(() => {
            if (typeof _toast === 'function') _toast('⚔ Combat lancé !', 'gold');
            mjAfficherInterfaceCombat();
        });
        }); // fin once animaux
        }); // fin once familiers
        }); // fin once compagnons
    });
}

/** Le MJ passe au tour suivant (= passer le tour du participant courant + regen). */
function mjTourSuivant() {
    // Lire combat_actif ET joueurs en une seule requête pour avoir le flag empoisonne
    db.ref('parties/' + sessionActuelle).once('value', (snapRoot) => {
        const root = snapRoot.val() || {};
        const data = root.combat_actif;
        const joueursFB = root.joueurs || {};
        if (!data || !data.actif) return;
        const ordre = data.ordre_jeu || [];
        if (ordre.length === 0) return;

        const tourIdx = (data.tour_actuel || 0) % ordre.length;
        const participant = ordre[tourIdx];
        const prochainTour = (typeof _prochainTourVivant === 'function')
            ? _prochainTourVivant(ordre, data.tour_actuel || 0)
            : ((data.tour_actuel || 0) + 1) % ordre.length;

        if (participant && typeof _roleRecuperation === 'function') {
            if (participant.type === 'joueur') {
                // Lire le flag empoisonne depuis le nœud joueur Firebase (pas depuis ordre_jeu)
                const joueurData = joueursFB[participant.id] || {};
                const estEmpoisonne = !!joueurData.empoisonne;

                if (estEmpoisonne) {
                    // Joueur empoisonné : pas de regen, le joueur applique le tick de poison lui-même
                    db.ref('parties/' + sessionActuelle + '/joueurs/' + participant.id + '/modif_stat').set({
                        stat: 'passer_tour', pvGain: 0, ftGain: 0, poisonTick: true, timestamp: Date.now()
                    });
                    if (typeof _logCombat === 'function') {
                        _logCombat(`${participant.nom} passe son tour — ☠ poison actif`);
                    }
                } else {
                    // Regen normale
                    const guerison = Math.max(1, Math.floor(((participant.pvMax || 10) / 10)));
                    const recup = _roleRecuperation(guerison);
                    db.ref('parties/' + sessionActuelle + '/joueurs/' + participant.id + '/modif_stat').set({
                        stat: 'passer_tour', pvGain: recup.pv, ftGain: recup.ft, timestamp: Date.now()
                    });
                    if (typeof _logCombat === 'function') {
                        const msg = recup.pv > 0
                            ? `${participant.nom} passe son tour et récupère +${recup.pv} PV / +${recup.ft} FT.${recup.label}`
                            : `${participant.nom} passe son tour — rien récupéré.${recup.label}`;
                        _logCombat(msg);
                    }
                }
            } else if (participant.type === 'compagnon') {
                if (typeof mjPasserTourCompagnon === 'function') {
                    const cn = (participant.statsBase?.CN || 5) + (participant.statsInvesties?.CN || 0);
                    mjPasserTourCompagnon(participant.ownerID, participant.compIdx, Math.max(1, Math.floor(cn / 3)));
                    return; // mjPasserTourCompagnon avance le tour lui-même
                }
            } else if (participant.type === 'ennemi') {
                if (typeof mjPasserTourEnnemi === 'function') {
                    mjPasserTourEnnemi(participant.instanceId);
                    return; // mjPasserTourEnnemi avance le tour lui-même
                }
            }
        }

        db.ref('parties/' + sessionActuelle + '/combat_actif/tour_actuel').set(prochainTour);
    });
}

/**
 * Termine le combat côté Firebase → tous les joueurs retournent à l'accueil.
 */
function mjTerminerCombat() {
    db.ref('parties/' + sessionActuelle + '/combat_actif').remove();
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
    if (typeof _toast === 'function') _toast(`🎲 ${nbItems} objets envoyés !`, 'gold');
}



// Utilitaire pour créer les lignes avec un style uniforme
function ajouterLigneCodexMJ(id, nom, actionFn, texteAction) {
    const tbody = document.getElementById('tbody-codex-mj');
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;border-bottom:1px solid #333;width:100%;box-sizing:border-box;';
    row.innerHTML = `
        <div style="padding:10px;color:#ffb74d;font-family:monospace;font-size:0.8em;width:80px;flex-shrink:0;">${id}</div>
        <div style="padding:10px;color:#fff;flex:1;">${nom}</div>
        <div style="padding:10px;text-align:right;flex-shrink:0;">
            <button onclick="${actionFn}" style="background:#444;color:#ff9800;border:1px solid #ff9800;padding:5px 10px;cursor:pointer;border-radius:3px;font-size:0.8em;">
                ${texteAction}
            </button>
        </div>`;
    tbody.appendChild(row);
}


function ajouterCarteCodexMJ(container, id, nom, actionFn, texteAction) {
    const card = document.createElement('div');
    card.style.cssText = 'flex:1;min-width:180px;max-width:calc(50% - 3px);box-sizing:border-box;padding:6px 8px;border:1px solid #2a2a2a;border-radius:4px;background:#0c0c0c;display:flex;flex-direction:column;gap:4px;';
    card.innerHTML = `
        <div style="color:#ffb74d;font-family:monospace;font-size:0.72em;">${id}</div>
        <div style="color:#fff;font-size:0.85em;flex:1;">${nom}</div>
        <button onclick="${actionFn}" style="background:#444;color:#ff9800;border:1px solid #ff9800;padding:4px 8px;cursor:pointer;border-radius:3px;font-size:0.78em;width:100%;">${texteAction}</button>`;
    container.appendChild(card);
}

function _mjCarteContenu(container, type, id, nom) {
    const card = document.createElement('div');
    card.style.cssText = 'flex:1;min-width:180px;max-width:calc(50% - 3px);box-sizing:border-box;padding:6px 8px;border:1px solid #2a2a2a;border-radius:4px;background:#0c0c0c;display:flex;flex-direction:column;gap:4px;';
    const resetBtn = type === 'marchand'
        ? `<button onclick="_resetMarchandStock('${id}')" style="flex:0 0 auto;background:#1a0a00;color:#ff9800;border:1px solid #8b4000;padding:4px 6px;cursor:pointer;border-radius:3px;font-size:0.76em;" title="Réinitialiser le stock">♻️</button>`
        : '';
    card.innerHTML = `
        <div style="color:#ffb74d;font-family:monospace;font-size:0.72em;">${id}</div>
        <div style="color:#fff;font-size:0.85em;flex:1;">${nom}</div>
        <div style="display:flex;gap:4px;">
            <button onclick="_mjPreviewContenu('${type}','${id}')" style="flex:1;background:#0d1a0d;color:#81c784;border:1px solid #388e3c;padding:4px 6px;cursor:pointer;border-radius:3px;font-size:0.76em;">👁 Voir</button>
            <button onclick="_mjEnvoyerContenuModal('${type}','${id}')" style="flex:1;background:#0a1a2a;color:#64b5f6;border:1px solid #1565c0;padding:4px 6px;cursor:pointer;border-radius:3px;font-size:0.76em;">📤 Envoyer</button>
            ${resetBtn}
        </div>`;
    container.appendChild(card);
}

function _mjPreviewContenu(type, id) {
    // Ouvrir la modal immédiatement
    let modal = document.getElementById('_mj-preview-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = '_mj-preview-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }
    modal.innerHTML = `<div style="background:#111;border:1px solid #444;border-radius:6px;padding:24px;color:#888;font-size:0.9em;">⏳ Chargement…</div>`;
    modal.style.display = 'flex';
    modal.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

    if (type === 'marchand') {
        const base = marchandsData[id];
        if (!base) { modal.style.display = 'none'; return; }
        db.ref('parties/' + sessionActuelle + '/marchands_stock/' + id).once('value', snap => {
            const stock = snap.val();
            const itemsActuels = stock ? stock.inventaire : null;
            const argent = stock ? stock.argent : base.argent;
            _mjAfficherPreviewModal('marchand', id, base.nom, itemsActuels, base.inventaire || [], argent);
        });
    } else {
        const c = coffresFixes[id];
        if (!c) { modal.style.display = 'none'; return; }
        _mjAfficherPreviewModal('coffre', id, c.nom, c.items || [], null, null);
    }
}

function _mjAfficherPreviewModal(type, id, nom, items, itemsBase, argent) {
    let bodyHtml;
    if (type === 'marchand' && itemsBase) {
        // Tableau : item | stock actuel | inventaire full
        // Construire un map id → qte actuelle
        const stockMap = {};
        (items || itemsBase).forEach(it => { stockMap[it.id] = it.qte ?? it.quantite ?? 1; });
        const baseMap = {};
        itemsBase.forEach(it => { baseMap[it.id] = it.qte ?? it.quantite ?? 1; });
        // Union de tous les ids (base, même si actuel épuisé)
        const allIds = [...new Set([...itemsBase.map(i => i.id)])];

        const header = `<div style="display:grid;grid-template-columns:1fr 54px 54px;gap:2px;padding:3px 0;border-bottom:1px solid #333;margin-bottom:3px;">
            <span style="color:#666;font-size:0.68em;text-transform:uppercase;">Objet</span>
            <span style="color:#64b5f6;font-size:0.68em;text-align:center;">Actuel</span>
            <span style="color:#888;font-size:0.68em;text-align:center;">Full</span>
        </div>`;
        const rows = allIds.map(itemId => {
            const def = (typeof itemsData !== 'undefined') ? itemsData[itemId] : null;
            const label = def ? def.nom : itemId;
            const qteFull = baseMap[itemId] ?? 0;
            const qteActuel = stockMap[itemId] ?? 0;
            const epuise = qteActuel <= 0;
            const partiel = !epuise && qteActuel < qteFull;
            const couleurActuel = epuise ? '#e57373' : partiel ? '#ffb74d' : '#81c784';
            return `<div style="display:grid;grid-template-columns:1fr 54px 54px;gap:2px;padding:4px 0;border-bottom:1px solid #1a1a1a;opacity:${epuise ? '0.5' : '1'};">
                <span style="color:#ddd;font-size:0.82em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${label}</span>
                <span style="color:${couleurActuel};font-size:0.82em;text-align:center;font-weight:bold;">${epuise ? '❌' : '×' + qteActuel}</span>
                <span style="color:#555;font-size:0.82em;text-align:center;">×${qteFull}</span>
            </div>`;
        }).join('');
        bodyHtml = header + rows;
    } else {
        bodyHtml = (items || []).map(it => {
            const def = (typeof itemsData !== 'undefined') ? itemsData[it.id] : null;
            const label = def ? def.nom : it.id;
            return `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #1a1a1a;">
                <span style="color:#ddd;font-size:0.83em;">${label}</span>
                <span style="color:#aaa;font-size:0.83em;">×${it.qte || it.quantite || 1}</span></div>`;
        }).join('') || '<div style="color:#555;font-size:0.83em;">Vide</div>';
    }

    const resetRow = type === 'marchand'
        ? `<button onclick="_resetMarchandStock('${id}');document.getElementById('_mj-preview-modal').style.display='none';" style="width:100%;margin-top:12px;background:#1a0a00;color:#ff9800;border:1px solid #8b4000;padding:7px;cursor:pointer;border-radius:4px;font-size:0.82em;">♻️ Réinitialiser le stock</button>`
        : '';
    let modal = document.getElementById('_mj-preview-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = '_mj-preview-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }
    modal.innerHTML = `
        <div style="background:#111;border:1px solid #444;border-radius:6px;padding:16px;max-width:400px;width:90%;max-height:72vh;overflow-y:auto;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
                <div>
                    <div style="color:#ffb74d;font-family:monospace;font-size:0.7em;">${id}</div>
                    <div style="color:#fff;font-weight:bold;font-size:0.9em;">${nom}</div>
                </div>
                <button onclick="document.getElementById('_mj-preview-modal').style.display='none'" style="background:none;border:none;color:#888;font-size:1.1em;cursor:pointer;margin-left:8px;">✕</button>
            </div>
            ${argent !== null ? `<div style="color:#ffd54f;font-size:0.82em;margin-bottom:8px;">◈ ${argent} or disponible</div>` : ''}
            ${bodyHtml}
            ${resetRow}
        </div>`;
    modal.style.display = 'flex';
    modal.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };
}

function _mjEnvoyerContenuModal(type, id) {
    const nom = type === 'coffre' ? (coffresFixes[id]?.nom || id) : (marchandsData[id]?.nom || id);
    db.ref('parties/' + sessionActuelle + '/joueurs').once('value', snap => {
        const joueurs = snap.val() || {};
        const btns = Object.entries(joueurs)
            .filter(([, j]) => !j.estMJ)
            .map(([pid, j]) => `<button onclick="_mjEnvoyerContenuAJoueur('${type}','${id}','${pid}')"
                style="width:100%;background:#1a1a2a;color:#eee;border:1px solid #3a3a5a;padding:8px 10px;cursor:pointer;border-radius:4px;font-size:0.85em;margin-bottom:4px;text-align:left;">${j.nom}</button>`)
            .join('');
        let modal = document.getElementById('_mj-envoyer-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = '_mj-envoyer-modal';
            modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;';
            document.body.appendChild(modal);
        }
        modal.innerHTML = `
            <div style="background:#111;border:1px solid #444;border-radius:6px;padding:16px;max-width:320px;width:90%;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <div style="color:#fff;font-size:0.88em;">📤 Envoyer <strong style="color:#64b5f6;">${nom}</strong> à :</div>
                    <button onclick="document.getElementById('_mj-envoyer-modal').style.display='none'" style="background:none;border:none;color:#888;font-size:1.1em;cursor:pointer;">✕</button>
                </div>
                ${btns || '<div style="color:#666;font-size:0.83em;">Aucun joueur connecté.</div>'}
            </div>`;
        modal.style.display = 'flex';
        modal.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };
    });
}

function _mjEnvoyerContenuAJoueur(type, id, playerID) {
    let ref, data;
    if (type === 'coffre') {
        ref = db.ref('parties/' + sessionActuelle + '/fouille_active/' + playerID);
        data = { actif: true, type: 'predefini', id };
    } else {
        ref = db.ref('parties/' + sessionActuelle + '/marchand_actif/' + playerID);
        data = { actif: true, marchandId: id };
    }
    ref.set(data);
    const modal = document.getElementById('_mj-envoyer-modal');
    if (modal) modal.style.display = 'none';
    const nom = type === 'coffre' ? (coffresFixes[id]?.nom || id) : (marchandsData[id]?.nom || id);
    if (typeof _toast === 'function') _toast(`📤 ${nom} envoyé !`, 'success');
}

// ══════════════════════════════════════════════════════════════
// VOL À LA TIRE — Interface MJ
// ══════════════════════════════════════════════════════════════

/**
 * Ouvre la modal de configuration du vol à la tire pour un joueur spécifique.
 * Le MJ choisit : rareté globale OU objet précis.
 */
// Labels d'affichage par type d'item
const _VOL_TYPE_LABELS = {
    arme_melee:    '⚔️ Armes de mêlée',
    arme_distance: '🏹 Armes à distance',
    arme_feu:      '🔫 Armes à feu',
    armure:        '🛡️ Armures & bijoux',
    consommable:   '🧪 Consommables',
    munition:      '🔋 Munitions',
    explosif:      '💣 Explosifs & pièges',
    composant:     '🔩 Composants',
    divers:        '🔧 Divers',
    objet_quete:   '⭐ Objets de quête',
};

function mjAutoriserVolATire(playerID, playerNom) {
    let modal = document.getElementById('modal-vol-tire');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-vol-tire';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }

    const raretesOptions = [1,2,3,4,5,6,7,8,9,10]
        .map(r => `<option value="${r}">Rareté ${r}</option>`).join('');

    modal.innerHTML = `
        <div style="background:#1a120a;border:2px solid #7c4dff;border-radius:8px;padding:24px;max-width:460px;width:90%;max-height:85vh;overflow-y:auto;">
            <h3 style="color:#b39ddb;margin:0 0 16px;">🤏 Vol à la tire — ${playerNom}</h3>

            <div style="margin-bottom:14px;padding:10px;background:rgba(124,77,255,0.1);border:1px solid #5a3a9a;border-radius:6px;">
                <label style="color:#ccc;display:flex;align-items:center;gap:8px;cursor:pointer;margin-bottom:8px;">
                    <input type="radio" name="vol-type" value="rarete" checked style="accent-color:#7c4dff;">
                    <strong>Rareté globale du butin</strong>
                </label>
                <select id="vol-rarete-select" style="width:100%;background:#111;color:#eee;border:1px solid #555;padding:8px;border-radius:4px;">
                    ${raretesOptions}
                </select>
            </div>

            <div style="margin-bottom:18px;padding:10px;background:rgba(124,77,255,0.1);border:1px solid #5a3a9a;border-radius:6px;">
                <label style="color:#ccc;display:flex;align-items:center;gap:8px;cursor:pointer;margin-bottom:8px;">
                    <input type="radio" name="vol-type" value="objet" style="accent-color:#7c4dff;">
                    <strong>Objet précis</strong>
                </label>
                <input type="text" id="vol-objet-search" placeholder="🔍 Rechercher par nom…"
                    oninput="_volFiltrerItems()"
                    style="width:100%;box-sizing:border-box;background:#111;color:#eee;border:1px solid #555;padding:7px 10px;border-radius:4px;margin-bottom:8px;">
                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;" id="vol-cat-filtres"></div>
                <div onclick="_volSelectionnerItem('OR_PIECES')" id="vol-or-row"
                    style="padding:6px 10px;cursor:pointer;font-size:12px;border:1px solid #444;
                           border-radius:4px;background:#0d0d0d;margin-bottom:6px;
                           display:flex;align-items:center;justify-content:space-between;">
                    <span style="color:#ffd700;font-weight:bold;">💰 Or (quantité libre)</span>
                    <input type="number" id="vol-or-quantite" min="1" value="10"
                        onclick="event.stopPropagation();_volSelectionnerItem('OR_PIECES')"
                        style="width:70px;background:#111;color:#ffd700;border:1px solid #555;
                               padding:3px 6px;border-radius:4px;text-align:right;">
                </div>
                <div id="vol-objet-liste"
                    style="max-height:180px;overflow-y:auto;border:1px solid #444;border-radius:4px;background:#0d0d0d;"></div>
                <div id="vol-objet-selectionne"
                    style="margin-top:6px;font-size:12px;color:#b39ddb;min-height:16px;"></div>
            </div>

            <div style="display:flex;gap:8px;">
                <button onclick="_mjConfirmerVolATire('${playerID}','${playerNom}')"
                    style="flex:1;background:#7c4dff;color:white;border:none;padding:10px;border-radius:4px;cursor:pointer;font-weight:bold;">
                    ✅ Autoriser le vol
                </button>
                <button onclick="document.getElementById('modal-vol-tire').style.display='none'"
                    style="background:#333;color:#aaa;border:1px solid #555;padding:10px;border-radius:4px;cursor:pointer;">
                    Annuler
                </button>
            </div>
        </div>`;

    modal.style.display = 'flex';

    // Init picker items
    window._volObjetSelectionne = null;
    window._volCatActive = null;
    _volRenderCategories();
    _volFiltrerItems();

    // Sélectionner automatiquement le mode "objet" quand on clique sur la recherche
    document.getElementById('vol-objet-search').addEventListener('focus', () => {
        const radio = modal.querySelector('input[name="vol-type"][value="objet"]');
        if (radio) radio.checked = true;
    });
}

/** Construit les boutons de filtrage par catégorie. */
function _volRenderCategories() {
    const container = document.getElementById('vol-cat-filtres');
    if (!container || typeof itemsData === 'undefined') return;

    // Catégories présentes dans les items (tous sauf argent/or — géré séparément)
    const cats = [...new Set(
        Object.values(itemsData)
            .filter(d => d.type !== 'argent')
            .map(d => d.type)
    )].sort();

    container.innerHTML = cats.map(cat => {
        const label = _VOL_TYPE_LABELS[cat] || cat;
        return `<button onclick="_volToggleCat('${cat}')" data-cat="${cat}"
            style="font-size:11px;padding:3px 8px;border-radius:12px;border:1px solid #5a3a9a;
                   background:#1a120a;color:#ccc;cursor:pointer;white-space:nowrap;">
            ${label}
        </button>`;
    }).join('');
}

/** Active/désactive le filtre de catégorie. */
function _volToggleCat(cat) {
    window._volCatActive = (window._volCatActive === cat) ? null : cat;
    // Mise à jour visuels boutons
    document.querySelectorAll('#vol-cat-filtres button').forEach(btn => {
        const actif = btn.dataset.cat === window._volCatActive;
        btn.style.background  = actif ? '#7c4dff' : '#1a120a';
        btn.style.color       = actif ? '#fff'    : '#ccc';
        btn.style.borderColor = actif ? '#7c4dff' : '#5a3a9a';
    });
    _volFiltrerItems();
}

/** Filtre et affiche la liste d'items selon recherche + catégorie. */
function _volFiltrerItems() {
    const liste = document.getElementById('vol-objet-liste');
    if (!liste || typeof itemsData === 'undefined') return;

    const query = (document.getElementById('vol-objet-search')?.value || '').toLowerCase().trim();
    const catFiltree = window._volCatActive || null;

    // Grouper par type
    const groupes = {};
    Object.entries(itemsData).forEach(([id, d]) => {
        if (d.type === 'argent') return; // or géré séparément
        if (catFiltree && d.type !== catFiltree) return;
        if (query && !d.nom.toLowerCase().includes(query)) return;
        if (!groupes[d.type]) groupes[d.type] = [];
        groupes[d.type].push({ id, d });
    });

    if (Object.keys(groupes).length === 0) {
        liste.innerHTML = '<div style="color:#666;padding:8px;text-align:center;font-size:12px;">Aucun résultat</div>';
        return;
    }

    const typeOrder = Object.keys(_VOL_TYPE_LABELS);
    const html = Object.entries(groupes)
        .sort(([a], [b]) => typeOrder.indexOf(a) - typeOrder.indexOf(b))
        .map(([type, items]) => {
            const label = _VOL_TYPE_LABELS[type] || type;
            const lignes = items
                .sort((a, b) => parseInt(a.d.rarete) - parseInt(b.d.rarete))
                .map(({ id, d }) => {
                    const selectionne = window._volObjetSelectionne === id;
                    return `<div onclick="_volSelectionnerItem('${id}')"
                        style="padding:5px 10px;cursor:pointer;font-size:12px;
                               background:${selectionne ? 'rgba(124,77,255,0.3)' : 'transparent'};
                               border-left:3px solid ${selectionne ? '#7c4dff' : 'transparent'};
                               display:flex;justify-content:space-between;align-items:center;"
                        onmouseover="this.style.background='rgba(124,77,255,0.15)'"
                        onmouseout="this.style.background='${selectionne ? 'rgba(124,77,255,0.3)' : 'transparent'}'">
                        <span style="color:#eee;">${d.nom}</span>
                        <span style="color:#888;font-size:11px;">R${d.rarete} · ${d.prix}or</span>
                    </div>`;
                }).join('');
            return `<div>
                <div style="padding:4px 10px;font-size:11px;color:#7c4dff;background:#111;
                            border-bottom:1px solid #333;font-weight:bold;position:sticky;top:0;">
                    ${label}
                </div>
                ${lignes}
            </div>`;
        }).join('');

    liste.innerHTML = html;
}

/** Sélectionne un item dans le picker. */
function _volSelectionnerItem(id) {
    window._volObjetSelectionne = id;
    const info = document.getElementById('vol-objet-selectionne');
    // Surbrillance ligne Or
    const orRow = document.getElementById('vol-or-row');
    if (orRow) orRow.style.borderColor = id === 'OR_PIECES' ? '#ffd700' : '#444';
    if (info) {
        if (id === 'OR_PIECES') {
            const qte = parseInt(document.getElementById('vol-or-quantite')?.value) || 10;
            info.textContent = `✔ Sélectionné : Or × ${qte}`;
        } else {
            const d = itemsData[id];
            if (d) info.textContent = `✔ Sélectionné : ${d.nom} (R${d.rarete} · ${d.prix} or)`;
        }
    }
    // Sélectionner le mode "objet"
    const radio = document.querySelector('input[name="vol-type"][value="objet"]');
    if (radio) radio.checked = true;
    // Re-render pour mettre à jour la surbrillance
    _volFiltrerItems();
}

function _mjConfirmerVolATire(playerID, playerNom) {
    const typeVol = document.querySelector('input[name="vol-type"]:checked')?.value;
    let config;

    if (typeVol === 'rarete') {
        const rarete = parseInt(document.getElementById('vol-rarete-select').value);
        config = { actif: true, rarete: rarete, objetId: null, timestamp: Date.now() };
    } else {
        const objetId = window._volObjetSelectionne;
        if (!objetId) {
            if (typeof _toast === 'function') _toast('⚠️ Sélectionne un objet dans la liste.', 'error');
            return;
        }
        const quantite = objetId === 'OR_PIECES'
            ? (parseInt(document.getElementById('vol-or-quantite')?.value) || 10)
            : 1;
        config = { actif: true, rarete: null, objetId: objetId, quantite: quantite, timestamp: Date.now() };
    }

    db.ref('parties/' + sessionActuelle + '/vol_a_la_tire/' + playerID).set(config);
    document.getElementById('modal-vol-tire').style.display = 'none';
    window._volObjetSelectionne = null;
    window._volCatActive = null;
    if (typeof _toast === 'function') _toast(`🤏 Vol à la tire autorisé pour ${playerNom}.`, 'success');
}

// ── Marchand MJ ─────────────────────────────────────────────────────────────

function mjOuvrirMarchand(playerID, playerNom) {
    let modal = document.getElementById('modal-mj-marchand');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-mj-marchand';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }
    const options = Object.entries(marchandsData).map(([id, m]) =>
        `<option value="${id}">${m.nom}</option>`).join('');
    modal.innerHTML = `
        <div style="background:#1a120a;border:2px solid #795548;border-radius:8px;padding:24px;max-width:400px;width:90%;">
            <h3 style="color:#ff9800;margin:0 0 16px;">⚖️ Ouvrir un marchand — ${playerNom}</h3>
            <select id="mj-marchand-select" style="width:100%;background:#111;color:#eee;border:1px solid #555;padding:8px;border-radius:4px;margin-bottom:16px;">
                ${options}
            </select>
            <div style="display:flex;gap:8px;">
                <button onclick="_mjConfirmerMarchand('${playerID}','${playerNom}')"
                    style="flex:1;background:#795548;color:white;border:none;padding:10px;border-radius:4px;cursor:pointer;font-weight:bold;">
                    ✅ Ouvrir pour ce joueur
                </button>
                <button onclick="document.getElementById('modal-mj-marchand').style.display='none'"
                    style="background:#333;color:#aaa;border:1px solid #555;padding:10px;border-radius:4px;cursor:pointer;">
                    Annuler
                </button>
            </div>
        </div>`;
    modal.style.display = 'flex';
}

function _mjConfirmerMarchand(playerID, playerNom) {
    const marchandId = document.getElementById('mj-marchand-select').value;
    if (!marchandId) return;
    db.ref('parties/' + sessionActuelle + '/marchand_actif/' + playerID).set({ actif: true, marchandId, timestamp: Date.now() });
    document.getElementById('modal-mj-marchand').style.display = 'none';
    if (typeof _toast === 'function') _toast('⚖️ Marchand ouvert pour ' + playerNom + '.', 'success');
}

// ── Fouille MJ ───────────────────────────────────────────────────────────────

function mjOuvrirFouille(playerID, playerNom) {
    let modal = document.getElementById('modal-mj-fouille');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-mj-fouille';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }
    const coffresOptions = Object.entries(coffresFixes || {}).map(([id, c]) =>
        `<option value="${id}">${c.nom || id}</option>`).join('');
    const raretesOptions = [1,2,3,4,5,6,7,8,9,10].map(r => `<option value="${r}">Rareté ${r}</option>`).join('');
    modal.innerHTML = `
        <div style="background:#0d1a0d;border:2px solid #2a5a2a;border-radius:8px;padding:24px;max-width:420px;width:90%;">
            <h3 style="color:#4caf50;margin:0 0 16px;">🔍 Ouvrir une fouille — ${playerNom}</h3>

            <div style="margin-bottom:14px;padding:10px;background:rgba(76,175,80,0.07);border:1px solid #2a5a2a;border-radius:6px;">
                <label style="color:#ccc;display:flex;align-items:center;gap:8px;cursor:pointer;margin-bottom:8px;">
                    <input type="radio" name="fouille-type" value="predefini" checked style="accent-color:#4caf50;">
                    <strong>Coffre prédéfini</strong>
                </label>
                <select id="mj-fouille-coffre-select" style="width:100%;background:#111;color:#eee;border:1px solid #555;padding:8px;border-radius:4px;">
                    ${coffresOptions || '<option value="">Aucun coffre prédéfini</option>'}
                </select>
            </div>

            <div style="margin-bottom:18px;padding:10px;background:rgba(76,175,80,0.07);border:1px solid #2a5a2a;border-radius:6px;">
                <label style="color:#ccc;display:flex;align-items:center;gap:8px;cursor:pointer;margin-bottom:8px;">
                    <input type="radio" name="fouille-type" value="aleatoire" style="accent-color:#4caf50;">
                    <strong>Coffre aléatoire</strong>
                </label>
                <select id="mj-fouille-rarete-select" style="width:100%;background:#111;color:#eee;border:1px solid #555;padding:8px;border-radius:4px;">
                    ${raretesOptions}
                </select>
            </div>

            <div style="display:flex;gap:8px;">
                <button onclick="_mjConfirmerFouille('${playerID}','${playerNom}')"
                    style="flex:1;background:#2e7d32;color:white;border:none;padding:10px;border-radius:4px;cursor:pointer;font-weight:bold;">
                    ✅ Ouvrir pour ce joueur
                </button>
                <button onclick="document.getElementById('modal-mj-fouille').style.display='none'"
                    style="background:#333;color:#aaa;border:1px solid #555;padding:10px;border-radius:4px;cursor:pointer;">
                    Annuler
                </button>
            </div>
        </div>`;
    modal.style.display = 'flex';
}

function _mjConfirmerFouille(playerID, playerNom) {
    const type = document.querySelector('input[name="fouille-type"]:checked')?.value;
    let config;
    if (type === 'predefini') {
        const id = document.getElementById('mj-fouille-coffre-select').value;
        if (!id) { if (typeof _toast === 'function') _toast('Aucun coffre prédéfini disponible.', 'error'); return; }
        config = { actif: true, type: 'predefini', id, timestamp: Date.now() };
    } else {
        const rarete = parseInt(document.getElementById('mj-fouille-rarete-select').value);
        config = { actif: true, type: 'aleatoire', rarete, timestamp: Date.now() };
    }
    db.ref('parties/' + sessionActuelle + '/fouille_active/' + playerID).set(config);
    document.getElementById('modal-mj-fouille').style.display = 'none';
    if (typeof _toast === 'function') _toast('🔍 Fouille ouverte pour ' + playerNom + '.', 'success');
}

// ── Bénédictions / Malédictions ─────────────────────────────────────────────

function mjGererEffets(playerID, playerNom) {
    let modal = document.getElementById('modal-effets-mj');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-effets-mj';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }

    const statsKeys = ['FO', 'IN', 'CN', 'DX', 'CH'];

    const renderModal = () => {
        db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/effets_actifs').once('value', snap => {
            const effets = snap.val() || {};
            const listeHtml = Object.entries(effets).map(([key, e]) => {
                const estBened = e.type === 'benediction';
                const couleur  = estBened ? '#ffd700' : '#ce93d8';
                const statsStr = [
                    ...Object.entries(e.stats || {}).filter(([,v]) => v !== 0).map(([k,v]) => `${k}${v>0?'+'+v:v}`),
                    ...(e.pvBonus ? [`PV${e.pvBonus>0?'+'+e.pvBonus:e.pvBonus}`] : []),
                    ...(e.ftBonus ? [`FT${e.ftBonus>0?'+'+e.ftBonus:e.ftBonus}`] : []),
                    ...Object.entries(e.comps || {}).filter(([,v]) => v !== 0).map(([k,v]) => `${k}${v>0?'+'+v:v}`)
                ].join(' ');
                return `<div style="display:flex;align-items:center;justify-content:space-between;
                            padding:6px 10px;background:rgba(255,255,255,0.04);border-radius:4px;margin-bottom:4px;">
                    <span style="color:${couleur};">${e.icone || ''} <strong>${e.nom}</strong>
                        ${statsStr ? `<span style="font-size:11px;color:#aaa;margin-left:6px;">${statsStr}</span>` : ''}
                    </span>
                    <button onclick="_mjSupprimerEffet('${playerID}','${key}')"
                        style="background:#5a0000;color:#ff6b6b;border:1px solid #8b0000;
                               padding:2px 8px;border-radius:4px;cursor:pointer;font-size:12px;">✕</button>
                </div>`;
            }).join('') || '<div style="color:#555;font-size:12px;text-align:center;padding:8px;">Aucun effet actif</div>';

            const statsInputs = statsKeys.map(s =>
                `<div style="text-align:center;">
                    <div style="color:#aaa;font-size:11px;margin-bottom:2px;">${s}</div>
                    <input type="number" id="effet-stat-${s}" value="0"
                        style="width:48px;background:#111;color:#eee;border:1px solid #555;
                               padding:4px;border-radius:4px;text-align:center;">
                </div>`
            ).join('');

            modal.innerHTML = `
                <div style="background:#1a120a;border:2px solid #7a6000;border-radius:10px;padding:20px;
                             max-width:460px;width:92%;max-height:85vh;overflow-y:auto;">
                    <h3 style="color:#ffd700;margin:0 0 14px;">✨ Effets — ${playerNom}</h3>

                    <div style="margin-bottom:16px;">${listeHtml}</div>

                    <div style="border-top:1px solid #333;padding-top:14px;">
                        <div style="font-size:12px;color:#aaa;margin-bottom:8px;text-transform:uppercase;">Ajouter un effet</div>

                        <div style="display:flex;gap:8px;margin-bottom:8px;">
                            <input type="text" id="effet-icone" placeholder="🌟" maxlength="2"
                                style="width:44px;background:#111;color:#eee;border:1px solid #555;
                                       padding:6px;border-radius:4px;text-align:center;font-size:16px;">
                            <input type="text" id="effet-nom" placeholder="Nom de l'effet"
                                style="flex:1;background:#111;color:#eee;border:1px solid #555;
                                       padding:6px;border-radius:4px;">
                        </div>

                        <div style="display:flex;gap:8px;margin-bottom:10px;">
                            <label style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;
                                padding:7px;border-radius:4px;cursor:pointer;border:1px solid #7a6000;background:rgba(255,215,0,0.08);">
                                <input type="radio" name="effet-type" value="benediction" checked style="accent-color:#ffd700;">
                                <span style="color:#ffd700;font-size:13px;">✨ Bénédiction</span>
                            </label>
                            <label style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;
                                padding:7px;border-radius:4px;cursor:pointer;border:1px solid #6a1b8a;background:rgba(156,39,176,0.1);">
                                <input type="radio" name="effet-type" value="malediction" style="accent-color:#ce93d8;">
                                <span style="color:#ce93d8;font-size:13px;">💀 Malédiction</span>
                            </label>
                        </div>

                        <div style="margin-bottom:8px;">
                            <div style="color:#aaa;font-size:11px;margin-bottom:6px;text-transform:uppercase;">Stats</div>
                            <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;">
                                ${statsInputs}
                            </div>
                        </div>

                        <div style="margin-bottom:8px;">
                            <div style="color:#aaa;font-size:11px;margin-bottom:6px;text-transform:uppercase;">Ressources</div>
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                                <div style="text-align:center;">
                                    <div style="color:#4caf50;font-size:11px;margin-bottom:2px;">❤ PV max</div>
                                    <input type="number" id="effet-stat-pv" value="0"
                                        style="width:100%;background:#111;color:#eee;border:1px solid #555;
                                               padding:4px;border-radius:4px;text-align:center;">
                                </div>
                                <div style="text-align:center;">
                                    <div style="color:#2196f3;font-size:11px;margin-bottom:2px;">⚡ FT max</div>
                                    <input type="number" id="effet-stat-ft" value="0"
                                        style="width:100%;background:#111;color:#eee;border:1px solid #555;
                                               padding:4px;border-radius:4px;text-align:center;">
                                </div>
                            </div>
                        </div>

                        <details style="margin-bottom:10px;">
                            <summary style="color:#aaa;font-size:11px;text-transform:uppercase;cursor:pointer;padding:4px 0;">
                                Compétences (cliquer pour déplier)
                            </summary>
                            <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px;" id="effet-comps-grid">
                                ${_mjEffetCompsInputs()}
                            </div>
                        </details>

                        <div style="display:flex;gap:6px;margin-bottom:6px;">
                            <button onclick="_mjConfirmerEffet('${playerID}', '${playerNom}', false)"
                                style="flex:1;background:#7a6000;color:#ffd700;border:none;
                                       padding:9px;border-radius:4px;cursor:pointer;font-weight:bold;">
                                ✅ Appliquer
                            </button>
                            <button onclick="_mjConfirmerEffet('${playerID}', '${playerNom}', true)"
                                style="flex:1;background:#3a3000;color:#ffd700;border:1px solid #7a6000;
                                       padding:9px;border-radius:4px;cursor:pointer;font-weight:bold;">
                                👥 Appliquer à tous
                            </button>
                        </div>
                        <button onclick="document.getElementById('modal-effets-mj').style.display='none'"
                            style="width:100%;background:#222;color:#888;border:1px solid #444;
                                   padding:7px;border-radius:4px;cursor:pointer;">
                            Fermer
                        </button>
                    </div>
                </div>`;
            modal.style.display = 'flex';
        });
    };

    window._mjRenderEffetsModal = renderModal;
    renderModal();
}

/** Génère les inputs compétences pour le modal d'effet. */
function _mjEffetCompsInputs() {
    if (typeof competencesData === 'undefined') return '';
    return Object.values(competencesData).flat().map(c =>
        `<div style="display:flex;align-items:center;justify-content:space-between;
                     background:rgba(255,255,255,0.03);border-radius:3px;padding:3px 6px;">
            <span style="color:#ccc;font-size:11px;">${c.nom}</span>
            <input type="number" id="effet-comp-${c.id}" value="0"
                style="width:44px;background:#111;color:#eee;border:1px solid #444;
                       padding:2px 4px;border-radius:3px;text-align:center;font-size:11px;">
        </div>`
    ).join('');
}

function _mjConfirmerEffet(playerID, playerNom, tousLesJoueurs = false) {
    const nom = document.getElementById('effet-nom')?.value.trim();
    if (!nom) { if (typeof _toast === 'function') _toast('⚠️ Donne un nom à l\'effet.', 'error'); return; }

    const icone = document.getElementById('effet-icone')?.value.trim() || '';
    const type  = document.querySelector('input[name="effet-type"]:checked')?.value || 'benediction';

    const stats = {};
    ['FO','IN','CN','DX','CH'].forEach(s => {
        const v = parseInt(document.getElementById('effet-stat-' + s)?.value) || 0;
        if (v !== 0) stats[s] = v;
    });

    const pvBonus = parseInt(document.getElementById('effet-stat-pv')?.value) || 0;
    const ftBonus = parseInt(document.getElementById('effet-stat-ft')?.value) || 0;

    const comps = {};
    if (typeof competencesData !== 'undefined') {
        Object.values(competencesData).flat().forEach(c => {
            const v = parseInt(document.getElementById('effet-comp-' + c.id)?.value) || 0;
            if (v !== 0) comps[c.id] = v;
        });
    }

    const effet = { nom, icone, type, stats, pvBonus, ftBonus, comps, timestamp: Date.now() };

    if (tousLesJoueurs) {
        db.ref('parties/' + sessionActuelle + '/joueurs').once('value', snap => {
            const joueurs = snap.val() || {};
            const promises = Object.keys(joueurs)
                .filter(id => !joueurs[id].estMJ)
                .map(id => db.ref('parties/' + sessionActuelle + '/joueurs/' + id + '/effets_actifs').push(effet));
            Promise.all(promises).then(() => {
                if (typeof _toast === 'function') _toast(`✨ "${nom}" appliqué à tous les joueurs.`, 'success');
                if (window._mjRenderEffetsModal) window._mjRenderEffetsModal();
            });
        });
    } else {
        db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/effets_actifs').push(effet)
            .then(() => {
                if (typeof _toast === 'function') _toast(`✨ Effet "${nom}" appliqué à ${playerNom}.`, 'success');
                if (window._mjRenderEffetsModal) window._mjRenderEffetsModal();
            });
    }
}

function _mjSupprimerEffet(playerID, effectKey) {
    db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/effets_actifs/' + effectKey).remove()
        .then(() => {
            if (window._mjRenderEffetsModal) window._mjRenderEffetsModal();
        });
}

// ── Système de Quêtes MJ ─────────────────────────────────────────────────────

function mjGererQuetes() {
    const sec = document.getElementById('mj-section-quetes');
    if (!sec) return;

    // Lire les joueurs connectés + les quêtes actives en parallèle
    Promise.all([
        db.ref('parties/' + sessionActuelle + '/joueurs').once('value'),
        db.ref('parties/' + sessionActuelle + '/quetes').once('value')
    ]).then(([snapJ, snapQ]) => {
        const joueurs = snapJ.val() || {};
        const quetesActives = snapQ.val() || {};

        // ── Liste des joueurs (checkboxes) ──────────────────────
        const joueursNonMJ = Object.entries(joueurs).filter(([, j]) => !j.estMJ);
        const checkboxesHtml = joueursNonMJ.length > 0
            ? joueursNonMJ.map(([id, j]) =>
                `<label style="display:flex;align-items:center;gap:6px;color:#ccc;font-size:0.9em;cursor:pointer;">
                    <input type="checkbox" class="mj-quete-joueur-cb" value="${id}" style="accent-color:#4caf50;"> ${j.nom || id}
                </label>`).join('')
            : '<span style="color:#666;font-size:0.85em;">Aucun joueur connecté</span>';

        // ── Formulaire création quête ───────────────────────────
        const optionsQuetes = Object.entries(quetesData || {}).map(([k, q]) =>
            `<option value="${k}">${q.nom} — ${q.donneur}</option>`).join('');

        const formHtml = `
        <div style="background:#0d1a0d;border:1px solid #4caf50;border-radius:8px;padding:14px;margin-bottom:18px;">
            <h3 style="color:#4caf50;margin:0 0 12px;font-size:0.95em;">➕ Nouvelle quête</h3>
            <div style="margin-bottom:10px;">
                <label style="color:#aaa;font-size:0.82em;display:block;margin-bottom:4px;">Quête prédéfinie</label>
                <select id="mj-quete-select" onchange="mjPreRemplirQuete(this.value)"
                    style="width:100%;background:#111;color:#fff;border:1px solid #4caf50;padding:6px;border-radius:4px;">
                    <option value="">— Quête personnalisée —</option>
                    ${optionsQuetes}
                </select>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
                <div>
                    <label style="color:#aaa;font-size:0.82em;">Nom</label>
                    <input id="mj-quete-nom" type="text" placeholder="Nom de la quête"
                        style="width:100%;background:#111;color:#fff;border:1px solid #555;padding:5px;border-radius:4px;box-sizing:border-box;">
                </div>
                <div>
                    <label style="color:#aaa;font-size:0.82em;">Donneur</label>
                    <input id="mj-quete-donneur" type="text" placeholder="NPC donneur"
                        style="width:100%;background:#111;color:#fff;border:1px solid #555;padding:5px;border-radius:4px;box-sizing:border-box;">
                </div>
            </div>
            <div style="margin-bottom:8px;">
                <label style="color:#aaa;font-size:0.82em;">Résumé</label>
                <textarea id="mj-quete-resume" rows="2" placeholder="Résumé court affiché dans le journal joueur"
                    style="width:100%;background:#111;color:#fff;border:1px solid #555;padding:5px;border-radius:4px;box-sizing:border-box;resize:vertical;"></textarea>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
                <div>
                    <label style="color:#aaa;font-size:0.82em;">⭐ XP récompense</label>
                    <input id="mj-quete-xp" type="number" value="50" min="0"
                        style="width:100%;background:#111;color:#fff;border:1px solid #555;padding:5px;border-radius:4px;box-sizing:border-box;">
                </div>
                <div>
                    <label style="color:#aaa;font-size:0.82em;">💰 Or récompense</label>
                    <input id="mj-quete-or" type="number" value="100" min="0"
                        style="width:100%;background:#111;color:#fff;border:1px solid #555;padding:5px;border-radius:4px;box-sizing:border-box;">
                </div>
            </div>
            <div style="margin-bottom:10px;">
                <label style="color:#aaa;font-size:0.82em;display:block;margin-bottom:6px;">👥 Joueurs participants</label>
                <div style="display:flex;flex-direction:column;gap:4px;">${checkboxesHtml}</div>
            </div>
            <button onclick="mjActiverQuete()"
                style="width:100%;background:#2e7d32;color:#fff;border:none;padding:8px;border-radius:6px;cursor:pointer;font-weight:bold;">
                📜 Lancer la quête
            </button>
        </div>`;

        // ── Quêtes actives ──────────────────────────────────────
        const enCours = Object.entries(quetesActives).filter(([, q]) => q.statut === 'en_cours');
        const terminees = Object.entries(quetesActives).filter(([, q]) => q.statut === 'validee' || q.statut === 'echouee');

        const rendreCarte = ([fbKey, q]) => {
            const estValide = q.statut === 'validee';
            const estEchoue = q.statut === 'echouee';
            const couleur   = estValide ? '#4caf50' : estEchoue ? '#8b0000' : '#d4af37';
            const badge     = estValide ? '✅' : estEchoue ? '❌' : '🔵';
            const joueursList = (q.joueurs || []).join(', ') || '—';
            const btns = (!estValide && !estEchoue) ? `
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px;">
                    <button onclick="mjValiderQuete('${fbKey}')"
                        style="background:#1a3a1a;color:#4caf50;border:1px solid #4caf50;padding:5px;border-radius:4px;cursor:pointer;font-size:0.85em;">✅ Valider</button>
                    <button onclick="mjEchouerQuete('${fbKey}')"
                        style="background:#3a0000;color:#ff6b6b;border:1px solid #8b0000;padding:5px;border-radius:4px;cursor:pointer;font-size:0.85em;">❌ Échouer</button>
                </div>` : '';
            return `<div style="border:1px solid ${couleur};border-radius:6px;padding:10px;margin-bottom:8px;background:#0a0a0a;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <strong style="color:${couleur};">${badge} ${q.nom}</strong>
                    <button onclick="mjSupprimerQuete('${fbKey}')" style="background:transparent;border:none;color:#555;cursor:pointer;font-size:12px;">🗑</button>
                </div>
                <div style="font-size:0.8em;color:#888;margin-top:2px;">Donné par : ${q.donneur || '—'} · Participants : ${joueursList}</div>
                <div style="font-size:0.82em;color:#aaa;margin-top:4px;">${q.resume || ''}</div>
                <div style="font-size:0.8em;color:#666;margin-top:3px;">Récompense : ⭐ ${q.recompenses?.xp || 0} XP · 💰 ${q.recompenses?.or || 0} or</div>
                ${btns}
            </div>`;
        };

        const enCoursHtml = enCours.length > 0
            ? enCours.map(rendreCarte).join('')
            : '<p style="color:#666;font-size:0.85em;">Aucune quête en cours.</p>';

        const termineesHtml = terminees.length > 0
            ? `<details style="margin-top:10px;"><summary style="color:#666;cursor:pointer;font-size:0.85em;">Historique (${terminees.length})</summary><div style="margin-top:8px;">${terminees.map(rendreCarte).join('')}</div></details>`
            : '';

        sec.innerHTML = formHtml
            + `<h3 style="color:#d4af37;font-size:0.9em;margin:0 0 8px;">📋 Quêtes en cours</h3>`
            + enCoursHtml + termineesHtml;
    });
}

/** Pré-remplit le formulaire avec les données d'une quête prédéfinie. */
function mjPreRemplirQuete(key) {
    const q = (typeof quetesData !== 'undefined') ? quetesData[key] : null;
    if (!q) return;
    const f = id => document.getElementById(id);
    if (f('mj-quete-nom'))    f('mj-quete-nom').value    = q.nom    || '';
    if (f('mj-quete-donneur'))f('mj-quete-donneur').value = q.donneur || '';
    if (f('mj-quete-resume')) f('mj-quete-resume').value  = q.resume  || '';
    if (f('mj-quete-xp'))     f('mj-quete-xp').value      = q.recompenses?.xp  ?? 50;
    if (f('mj-quete-or'))     f('mj-quete-or').value      = q.recompenses?.or  ?? 100;
}

/** Lance une quête et la publie dans Firebase pour les joueurs sélectionnés. */
function mjActiverQuete() {
    const nom     = (document.getElementById('mj-quete-nom')?.value     || '').trim();
    const donneur = (document.getElementById('mj-quete-donneur')?.value || '').trim();
    const resume  = (document.getElementById('mj-quete-resume')?.value  || '').trim();
    const xp      = parseInt(document.getElementById('mj-quete-xp')?.value)  || 0;
    const or      = parseInt(document.getElementById('mj-quete-or')?.value)  || 0;

    if (!nom) { if (typeof _toast === 'function') _toast('❌ Nom de quête requis.', 'error'); return; }

    const joueursCB = Array.from(document.querySelectorAll('.mj-quete-joueur-cb:checked')).map(cb => cb.value);

    const queteData = {
        nom, donneur, resume,
        recompenses: { xp, or },
        statut: 'en_cours',
        joueurs: joueursCB,
        timestamp: Date.now()
    };

    // ── Vérification doublon : un joueur ne peut pas avoir deux fois la même quête en cours ──
    db.ref('parties/' + sessionActuelle + '/quetes').once('value', snap => {
        const existantes = snap.val() || {};
        const enDoublon = joueursCB.filter(playerID =>
            Object.values(existantes).some(q =>
                q.nom === nom &&
                q.statut === 'en_cours' &&
                (q.joueurs || []).includes(playerID)
            )
        );
        if (enDoublon.length > 0) {
            if (typeof _toast === 'function') _toast(`⚠ Certains joueurs ont déjà "${nom}" en cours.`, 'error');
            return;
        }
        db.ref('parties/' + sessionActuelle + '/quetes').push(queteData).then(() => {
            if (typeof _toast === 'function') _toast(`📜 Quête "${nom}" lancée !`, 'success');
            mjGererQuetes();
        });
    });
}

/** Valide une quête : distribue XP + or aux participants et met le statut à 'validee'. */
function mjValiderQuete(fbKey) {
    db.ref('parties/' + sessionActuelle + '/quetes/' + fbKey).once('value', snap => {
        const q = snap.val();
        if (!q) return;

        const xp = q.recompenses?.xp || 0;
        const or = q.recompenses?.or || 0;
        const joueurs = q.joueurs || [];

        joueurs.forEach(playerID => {
            if (xp > 0) {
                db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/modif_stat').set({
                    stat: 'XP', valeur: xp, timestamp: Date.now()
                });
            }
            if (or > 0) {
                db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/modif_argent').set({
                    valeur: or, timestamp: Date.now()
                });
            }
        });

        db.ref('parties/' + sessionActuelle + '/quetes/' + fbKey + '/statut').set('validee').then(() => {
            if (typeof _toast === 'function') {
                const recap = [xp ? `⭐ ${xp} XP` : '', or ? `💰 ${or} or` : ''].filter(Boolean).join(' + ');
                _toast(`✅ Quête "${q.nom}" validée !${recap ? ' Récompenses : ' + recap : ''}`, 'success');
            }
            mjGererQuetes();
        });
    });
}

/** Marque une quête comme échouée (pas de récompenses). */
function mjEchouerQuete(fbKey) {
    db.ref('parties/' + sessionActuelle + '/quetes/' + fbKey + '/statut').set('echouee').then(() => {
        if (typeof _toast === 'function') _toast('❌ Quête marquée comme échouée.', 'error');
        mjGererQuetes();
    });
}

/** Supprime définitivement une quête de Firebase. */
function mjSupprimerQuete(fbKey) {
    db.ref('parties/' + sessionActuelle + '/quetes/' + fbKey).remove().then(() => {
        mjGererQuetes();
    });
}

// ── Succès MJ ────────────────────────────────────────────────────────────────

function mjGererSucces(playerID, playerNom) {
    let modal = document.getElementById('modal-mj-succes');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-mj-succes';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }

    const render = () => {
        db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/succes').once('value', snap => {
            const debloquesDB = snap.val() || {};

            if (typeof succesData === 'undefined') {
                modal.innerHTML = `<div style="background:#1a120a;border:2px solid #4a3a00;border-radius:8px;padding:24px;color:#888;">succesData non chargé.</div>`;
                modal.style.display = 'flex';
                return;
            }

            // Construire la boîte avec createElement (évite les problèmes de guillemets)
            const box = document.createElement('div');
            box.style.cssText = 'background:#0d0a18;border:2px solid #4a3a00;border-radius:10px;padding:20px;max-width:480px;width:92%;max-height:85vh;overflow-y:auto;';

            // En-tête
            const header = document.createElement('div');
            header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;';
            const titre = document.createElement('h3');
            titre.style.cssText = 'color:#d4af37;margin:0;';
            titre.textContent = '🏆 Succès — ' + playerNom;
            const btnFermer = document.createElement('button');
            btnFermer.style.cssText = 'background:transparent;border:none;color:#888;font-size:20px;cursor:pointer;';
            btnFermer.textContent = '✕';
            btnFermer.onclick = () => { modal.style.display = 'none'; };
            header.appendChild(titre);
            header.appendChild(btnFermer);
            box.appendChild(header);

            const cats = [...new Set(succesData.map(s => s.categorie))];

            // Grille de pills
            const catGrid = document.createElement('div');
            catGrid.style.cssText = 'display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px;';

            // Panneau de détail
            const panel = document.createElement('div');
            let activeCat = null;

            const renderCat = (cat) => {
                if (activeCat === cat) {
                    panel.innerHTML = '';
                    activeCat = null;
                    catGrid.querySelectorAll('button').forEach(b => {
                        b.style.background = '#0d0d18';
                        b.style.borderColor = '#1a1a2a';
                        b.style.color = '#888';
                    });
                    return;
                }
                activeCat = cat;
                catGrid.querySelectorAll('button').forEach(b => {
                    const sel = b.dataset.cat === cat;
                    b.style.background = sel ? 'rgba(212,175,55,0.12)' : '#0d0d18';
                    b.style.borderColor = sel ? '#d4af37' : '#1a1a2a';
                    b.style.color = sel ? '#d4af37' : '#888';
                });
                panel.innerHTML = '';
                succesData.filter(s => s.categorie === cat).forEach(s => {
                    const debloque = !!debloquesDB[s.id];
                    const dateStr  = debloque && debloquesDB[s.id]?.date
                        ? new Date(debloquesDB[s.id].date).toLocaleDateString('fr-FR') : '';

                    const row = document.createElement('div');
                    row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:6px 4px;border-bottom:1px solid #111;';

                    const ico = document.createElement('span');
                    ico.style.fontSize = '1.1em';
                    ico.textContent = s.icone;

                    const info = document.createElement('div');
                    info.style.flex = '1';
                    info.innerHTML = `<span style="color:${debloque ? '#d4af37' : '#555'};font-size:0.83em;font-weight:${debloque ? 'bold' : 'normal'};">${s.nom}</span>`
                        + (dateStr ? `<span style="color:#666;font-size:0.72em;margin-left:6px;">🗓 ${dateStr}</span>` : '')
                        + `<div style="color:#666;font-size:0.75em;">${s.desc}</div>`;

                    const btn = document.createElement('button');
                    if (debloque) {
                        btn.style.cssText = 'background:#2a0a0a;color:#e57373;border:1px solid #5a1a1a;padding:3px 7px;border-radius:4px;cursor:pointer;font-size:0.75em;white-space:nowrap;';
                        btn.textContent = '✕ Révoquer';
                        btn.addEventListener('click', () => { mjRevoquerSucces(playerID, s.id); setTimeout(render, 500); });
                    } else {
                        btn.style.cssText = 'background:#0a1a0a;color:#d4af37;border:1px solid #4a3a00;padding:3px 7px;border-radius:4px;cursor:pointer;font-size:0.75em;white-space:nowrap;';
                        btn.textContent = '🏆 Débloquer';
                        btn.addEventListener('click', () => { mjDebloquerSucces(playerID, s.id); setTimeout(render, 500); });
                    }

                    row.appendChild(ico);
                    row.appendChild(info);
                    row.appendChild(btn);
                    panel.appendChild(row);
                });
            };

            cats.forEach(cat => {
                const items = succesData.filter(s => s.categorie === cat);
                const catDeb = items.filter(s => debloquesDB[s.id]).length;
                const btn = document.createElement('button');
                btn.dataset.cat = cat;
                btn.style.cssText = 'padding:4px 10px;border:1px solid #1a1a2a;border-radius:20px;background:#0d0d18;color:#888;font-size:0.75em;font-variant:small-caps;letter-spacing:0.5px;cursor:pointer;white-space:nowrap;';
                btn.innerHTML = `${cat} <span style="opacity:0.5;font-size:0.85em;">${catDeb}/${items.length}</span>`;
                btn.addEventListener('click', () => renderCat(cat));
                catGrid.appendChild(btn);
            });

            box.appendChild(catGrid);
            box.appendChild(panel);

            modal.innerHTML = '';
            modal.appendChild(box);
            modal.style.display = 'flex';
        });
    };

    render();
}

// ============================================================
// SYSTÈME DONJON — Interface MJ
// ============================================================

// Brouillon du donjon en cours d'édition
window._donjonBrouillon = null;
window._donjonModeEdit  = 'sol';    // 'sol' | 'mur' | 'coffre' | 'piege' | 'decouverte' | 'rencontre' | 'porte' | 'depart'

/** Génère le HTML du panneau "Donner une clef" pour la vue active MJ. */
function _mjBuilderDonnerClefHtml(data) {
    // Recenser toutes les clefs définies dans les événements de portes
    const clesConnues = [];
    Object.values(data.grille || {}).forEach(cell => {
        const c = cell.event?.data?.cleRequise;
        if (c && !clesConnues.includes(c)) clesConnues.push(c);
    });
    if (clesConnues.length === 0) return ''; // Aucune porte à clef

    // Liste des joueurs
    const joueurs = data.ordre_joueurs || [];
    if (joueurs.length === 0) return '';

    const selCles = clesConnues.map(c =>
        `<option value="${c}">${c}</option>`
    ).join('');
    const cbJoueurs = joueurs.map(j =>
        `<label style="display:flex;align-items:center;gap:6px;color:#ccc;font-size:0.85em;"><input type="checkbox" class="mj-cle-joueur-cb" value="${j}"> ${j}</label>`
    ).join('');

    return `
        <div style="background:#1a1408;border:1px solid #8b6914;border-radius:6px;padding:10px;margin-bottom:10px;">
            <strong style="color:#d4af37;font-size:0.9em;">🗝 Donner une clef</strong>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:6px;">
                <select id="mj-cle-select" style="background:#111;color:#d4af37;border:1px solid #8b6914;padding:4px 8px;border-radius:4px;font-size:0.85em;">${selCles}</select>
                <span style="color:#666;font-size:0.8em;">→ Joueurs :</span>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">${cbJoueurs}</div>
                <button onclick="mjDonnerClef()" style="background:#2a1a0a;color:#d4af37;border:1px solid #8b6914;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:0.85em;">Donner</button>
            </div>
        </div>`;
}

/** Écrit les clefs sélectionnées dans Firebase pour les joueurs cochés. */
function mjDonnerClef() {
    const cleId   = document.getElementById('mj-cle-select')?.value;
    if (!cleId) return;
    const cbs     = document.querySelectorAll('.mj-cle-joueur-cb:checked');
    const joueurs = Array.from(cbs).map(cb => cb.value);
    if (joueurs.length === 0) {
        if (typeof _toast === 'function') _toast('Sélectionne au moins un joueur.', 'error');
        return;
    }
    const promises = joueurs.map(j =>
        db.ref('parties/' + sessionActuelle + '/donjon_actif/cles_joueurs/' + j + '/' + cleId).set(true)
    );
    Promise.all(promises).then(() => {
        if (typeof _toast === 'function') _toast(`🗝 Clef "${cleId}" donnée à : ${joueurs.join(', ')}`, 'success');
    });
}

/** Point d'entrée de l'onglet MJ Donjon */
function mjGererDonjon() {
    const sec = document.getElementById('mj-section-donjon');
    if (!sec) return;

    // Vérifier si un donjon est actif en Firebase
    db.ref('parties/' + sessionActuelle + '/donjon_actif').once('value', snap => {
        const actif = snap.val();
        if (actif) {
            _mjAfficherDonjonActif(sec, actif);
        } else {
            _mjAfficherBuilderDonjon(sec);
        }
    });
}

// ── VUE ACTIVE (MJ voit tout) ────────────────────────────────

function _mjAfficherDonjonActif(sec, data) {
    const grille  = data.grille  || {};
    const largeur = data.largeur || 10;
    const hauteur = data.hauteur || 8;
    const cellPx  = Math.max(20, Math.min(32, Math.floor(460 / largeur)));

    // Rencontre en attente ?
    const rencontreHtml = data.rencontre_en_attente
        ? `<div style="background:#3a0000;border:1px solid #ff6b6b;padding:8px;border-radius:6px;margin-bottom:10px;">
            <strong style="color:#ff6b6b;">👹 Rencontre déclenchée !</strong>
            <div style="color:#ccc;font-size:0.85em;margin:4px 0;">${data.rencontre_en_attente.description} — par ${data.rencontre_en_attente.declenchePar}</div>
            <button onclick="mjLancerCombatRencontre()" style="background:#8b0000;color:#fff;border:none;padding:6px 14px;border-radius:4px;cursor:pointer;margin-top:4px;">⚔ Lancer le combat</button>
            <button onclick="mjIgnorerRencontre()" style="background:#222;color:#aaa;border:1px solid #555;padding:6px 14px;border-radius:4px;cursor:pointer;margin-top:4px;margin-left:6px;">Ignorer</button>
           </div>`
        : '';

    // Grille complète (sans brouillard)
    let grilleHtml = `<div style="display:grid;grid-template-columns:repeat(${largeur},${cellPx}px);gap:1px;background:#111;padding:4px;border:1px solid #333;border-radius:4px;width:fit-content;margin:0 auto 10px;">`;
    for (let y = 0; y < hauteur; y++) {
        for (let x = 0; x < largeur; x++) {
            const key  = `${x}_${y}`;
            const cell = grille[key] || { type: 'mur' };
            const isMur = cell.type === 'mur';
            const isEscalier = cell.type === 'escalier';
            let bg = isMur ? '#2a2a2a' : (isEscalier ? '#1a1a3a' : '#3a2e20');
            let content = isEscalier ? '🪜' : '';
            if (!isMur && !isEscalier && cell.event) {
                const etatCoffre = cell.event.type === 'coffre' ? (data.etats_coffres?.[key] || null) : null;
                let icone;
                if (etatCoffre) {
                    icone = etatCoffre.statut === 'casse' ? '💥' : etatCoffre.statut === 'ouvert' ? '📭' : '🔒';
                } else {
                    const icones = { porte: '🚪', piege: '🪤', coffre: '📦', rencontre: '👹', decouverte: '🔎', pnj: '🧙', autel: '⛩' };
                    icone = icones[cell.event.type] || '';
                }
                content = cell.event.declenche && !etatCoffre
                    ? '<span style="opacity:0.4">' + icone + '</span>'
                    : icone;
            }
            // Positions joueurs et compagnons
            Object.entries(data.positions || {}).forEach(([id, pos]) => {
                if (pos.x === x && pos.y === y) {
                    content += id.startsWith('cmp_') ? '🐾' : '👤';
                    bg = '#1a3a1a';
                }
            });
            grilleHtml += `<div style="width:${cellPx}px;height:${cellPx}px;background:${bg};display:flex;align-items:center;justify-content:center;font-size:${Math.max(9,cellPx-10)}px;border:1px solid #1a1a1a;">${content}</div>`;
        }
    }
    grilleHtml += '</div>';

    // Log récent
    const logEntries = Object.values(data.log || {})
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, 8)
        .map(e => `<div style="color:#aaa;font-size:0.8em;padding:2px 0;">${e.texte}</div>`)
        .join('') || '<span style="color:#555;font-size:0.8em;">Aucune action.</span>';

    // Ordre de jeu
    const ordre = data.ordre_joueurs || [];
    const tourIdx = Math.max(0, (data.tour_actuel || 0) % Math.max(1, ordre.length));
    const nomTour = ordre[tourIdx] || '?';
    const estTourCompagnon = nomTour.startsWith('cmp_');
    const ordreHtml = ordre.length > 0
        ? `<div style="margin-bottom:6px;font-size:0.85em;color:#888;">Ordre : ${ordre.map((n,i) => {
            const label = n.startsWith('cmp_') ? '🐾' + n.slice(4) : n;
            return `<span style="color:${i===tourIdx?'#4caf50':'#666'}">${label}</span>`;
          }).join(' → ')}</div>`
        : '';

    // Contrôles compagnon si c'est son tour
    const cmpId = estTourCompagnon ? nomTour.slice(4) : null;
    const cmpControlesHtml = estTourCompagnon ? `
        <div style="background:#1a1a0a;border:1px solid #8b6914;border-radius:6px;padding:10px;margin-bottom:10px;">
            <div style="color:#d4af37;font-size:0.85em;margin-bottom:6px;">🐾 Tour du compagnon de <strong>${cmpId}</strong></div>
            <div style="display:grid;grid-template-columns:repeat(3,42px);gap:4px;justify-content:center;">
                <div></div>
                <button onclick="mjDeplacerCompagnon('${cmpId}',0,-1)" style="width:42px;height:42px;background:#2a1a0a;color:#d4af37;border:1px solid #8b6914;border-radius:6px;cursor:pointer;font-size:1.2em;">↑</button>
                <div></div>
                <button onclick="mjDeplacerCompagnon('${cmpId}',-1,0)" style="width:42px;height:42px;background:#2a1a0a;color:#d4af37;border:1px solid #8b6914;border-radius:6px;cursor:pointer;font-size:1.2em;">←</button>
                <div style="width:42px;height:42px;display:flex;align-items:center;justify-content:center;color:#d4af37;font-size:1.3em;">🐾</div>
                <button onclick="mjDeplacerCompagnon('${cmpId}',1,0)"  style="width:42px;height:42px;background:#2a1a0a;color:#d4af37;border:1px solid #8b6914;border-radius:6px;cursor:pointer;font-size:1.2em;">→</button>
                <div></div>
                <button onclick="mjDeplacerCompagnon('${cmpId}',0,1)"  style="width:42px;height:42px;background:#2a1a0a;color:#d4af37;border:1px solid #8b6914;border-radius:6px;cursor:pointer;font-size:1.2em;">↓</button>
                <div></div>
            </div>
            <button onclick="mjPasserTourCompagnon()" style="background:#222;color:#666;border:1px solid #444;padding:5px 18px;border-radius:4px;cursor:pointer;font-size:0.82em;margin-top:8px;display:block;margin-left:auto;margin-right:auto;">⏭ Passer le tour</button>
        </div>` : '';

    sec.innerHTML = `
        <div style="color:#9c7fd4;font-size:1.1em;font-weight:bold;margin-bottom:10px;">🗺 Donjon actif${data.etages ? ` — Étage ${data.etage_actuel || 1}/${Object.keys(data.etages).length}` : ''}</div>
        ${rencontreHtml}
        ${ordreHtml}
        ${cmpControlesHtml}
        ${grilleHtml}
        <div style="border-top:1px solid #2a2010;padding-top:6px;margin-bottom:10px;">
            <div style="color:#666;font-size:0.75em;margin-bottom:4px;">Journal</div>
            <div style="max-height:120px;overflow-y:auto;">${logEntries}</div>
        </div>
        ${_mjBuilderDonnerClefHtml(data)}
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">
            <button onclick="mjGererDonjon()" style="background:#1a1a2a;color:#9c7fd4;border:1px solid #5c3a9d;padding:6px 14px;border-radius:4px;cursor:pointer;font-size:0.85em;">🔄 Rafraîchir</button>
            <button onclick="mjTogglePauseDonjon()" style="background:${data.pause ? '#2a1a00' : '#1a1a00'};color:${data.pause ? '#f0b429' : '#888'};border:1px solid ${data.pause ? '#8b6914' : '#444'};padding:6px 14px;border-radius:4px;cursor:pointer;font-size:0.85em;">${data.pause ? '▶ Reprendre' : '⏸ Pause'}</button>
            ${data.etages && (data.etages[(data.etage_actuel || 1) + 1]) ? `<button onclick="mjPasserEtageSuperieur()" style="background:#1a1a3a;color:#9090ff;border:1px solid #3a3a8a;padding:6px 14px;border-radius:4px;cursor:pointer;font-size:0.85em;">⬆ Étage suivant</button>` : ''}
            <button onclick="mjTerminerDonjon()" style="background:#3a0000;color:#ff6b6b;border:1px solid #8b0000;padding:6px 14px;border-radius:4px;cursor:pointer;font-size:0.85em;">🏁 Terminer le donjon</button>
        </div>
    `;
}

// ── BUILDER ──────────────────────────────────────────────────

function _mjAfficherBuilderDonjon(sec) {
    // Init brouillon si nécessaire
    if (!window._donjonBrouillon) {
        window._donjonBrouillon = _creerGrilleDonjon(10, 8);
    }
    // Init structure multi-étages si nécessaire
    if (!window._donjonBrouillonEtages) {
        window._donjonEtageEdite = 1;
        window._donjonBrouillonEtages = { 1: window._donjonBrouillon };
    }
    if (!window._donjonEtageEdite) window._donjonEtageEdite = 1;
    // Mode par défaut : sol (sinon le clic sur une cellule sans mode sélectionné crée un event invalide)
    if (!window._donjonModeEdit) window._donjonModeEdit = 'sol';

    sec.innerHTML = _mjBuilderDonjonHtml();
    _mjRendreGrilleBuilder();
}

function _creerGrilleDonjon(larg, haut) {
    const grille = {};
    for (let y = 0; y < haut; y++) {
        for (let x = 0; x < larg; x++) {
            // Bordure = mur, intérieur = mur par défaut (MJ peint en sol)
            grille[`${x}_${y}`] = { type: 'mur' };
        }
    }
    return { largeur: larg, hauteur: haut, grille, depart: { x: 1, y: 1 } };
}

function _mjBuilderDonjonHtml() {
    const b = window._donjonBrouillon;
    const modes = [
        { id: 'sol',        label: '🟫 Sol',        color: '#3a2e20' },
        { id: 'mur',        label: '🧱 Mur',        color: '#2a2a2a' },
        { id: 'porte',      label: '🚪 Porte',      color: '#5c3a00' },
        { id: 'coffre',     label: '📦 Coffre',     color: '#0d2a0d' },
        { id: 'piege',      label: '🪤 Piège',      color: '#2a0d0d' },
        { id: 'decouverte', label: '🔎 Découverte', color: '#0d1a2a' },
        { id: 'rencontre',  label: '👹 Rencontre',  color: '#2a0d0d' },
        { id: 'depart',        label: '📍 Départ',         color: '#1a3a1a' },
        { id: 'porte_secrete', label: '🔐 Porte secrète', color: '#3a2a00' },
        { id: 'pnj',           label: '🧙 PNJ errant',   color: '#0a180a' },
        { id: 'autel',         label: '⛩ Autel',         color: '#1a0d2a' },
        { id: 'escalier',      label: '🪜 Escalier',      color: '#1a1a3a' },
    ];
    const modeBtns = modes.map(m => {
        const actif = window._donjonModeEdit === m.id;
        return `<button onclick="mjSetModeDonjon('${m.id}')" style="background:${actif ? m.color : '#111'};color:${actif ? '#fff' : '#888'};border:1px solid ${actif ? '#9c7fd4' : '#333'};padding:4px 8px;border-radius:4px;cursor:pointer;font-size:0.78em;">${m.label}</button>`;
    }).join('');

    // Boutons présets
    const presetBtns = typeof DONJON_PRESETS !== 'undefined'
        ? Object.entries(DONJON_PRESETS).map(([id, p]) =>
            `<button onclick="mjChargerPreset('${id}')" style="background:#111;color:#9c7fd4;border:1px solid #5c3a9d;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:0.78em;">${p.nom}</button>`
          ).join('')
        : '';

    // Onglets étages
    const etages = window._donjonBrouillonEtages || { 1: b };
    const etageEdite = window._donjonEtageEdite || 1;
    const nbEtages = Object.keys(etages).length;
    const etageTabsHtml = Object.keys(etages).map(n => {
        const actif = parseInt(n) === etageEdite;
        return `<button onclick="mjBasculeEtageBuilder(${n})" style="background:${actif ? '#1a0d2a' : '#111'};color:${actif ? '#9c7fd4' : '#555'};border:1px solid ${actif ? '#5c3a9d' : '#333'};padding:3px 10px;border-radius:4px;cursor:pointer;font-size:0.8em;">Étage ${n}</button>`;
    }).join('');

    return `
        <div style="color:#9c7fd4;font-size:1.1em;font-weight:bold;margin-bottom:10px;">🗺 Éditeur de Donjon</div>

        <!-- Cartes préenregistrées -->
        ${presetBtns ? `<div style="margin-bottom:10px;"><div style="color:#666;font-size:0.75em;margin-bottom:4px;">Cartes préenregistrées :</div><div style="display:flex;gap:5px;flex-wrap:wrap;">${presetBtns}</div></div>` : ''}

        <!-- Onglets étages -->
        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px;align-items:center;">
            ${etageTabsHtml}
            <button onclick="mjAjouterEtage()" style="background:#111;color:#9c7fd4;border:1px dashed #5c3a9d;padding:3px 10px;border-radius:4px;cursor:pointer;font-size:0.8em;">➕ Étage</button>
            ${nbEtages > 1 ? `<button onclick="mjSupprimerEtage()" style="background:#111;color:#666;border:1px solid #333;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:0.78em;" title="Supprimer l'étage actuel">🗑</button>` : ''}
            <span style="color:#555;font-size:0.75em;margin-left:4px;">Étage ${etageEdite}/${nbEtages}</span>
        </div>

        <!-- Taille -->
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:10px;flex-wrap:wrap;">
            <label style="color:#aaa;font-size:0.85em;">Largeur</label>
            <input id="donjon-larg" type="number" min="5" max="20" value="${b.largeur}" style="width:50px;background:#111;color:#fff;border:1px solid #444;padding:3px 6px;border-radius:3px;">
            <label style="color:#aaa;font-size:0.85em;">Hauteur</label>
            <input id="donjon-haut" type="number" min="5" max="20" value="${b.hauteur}" style="width:50px;background:#111;color:#fff;border:1px solid #444;padding:3px 6px;border-radius:3px;">
            <button onclick="mjRedimensionnerDonjon()" style="background:#222;color:#9c7fd4;border:1px solid #5c3a9d;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:0.82em;">Créer</button>
            <button onclick="mjResetDonjon()" style="background:#222;color:#666;border:1px solid #444;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:0.82em;">🗑 Reset</button>
        </div>

        <!-- Modes de peinture -->
        <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px;">${modeBtns}</div>
        <div id="donjon-event-form" style="margin-bottom:8px;"></div>

        <!-- Grille éditable -->
        <div id="donjon-builder-grille" style="margin:0 auto 10px;cursor:crosshair;"></div>

        <!-- Lancer -->
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;">
            <button onclick="mjLancerDonjon()" style="background:#1a0d2a;color:#9c7fd4;border:1px solid #5c3a9d;padding:7px 18px;border-radius:4px;cursor:pointer;font-size:0.9em;">🚀 Lancer le donjon</button>
        </div>
    `;
}

function mjSetModeDonjon(mode) {
    window._donjonModeEdit = mode;
    const sec = document.getElementById('mj-section-donjon');
    if (sec) sec.innerHTML = _mjBuilderDonjonHtml();
    _mjRendreGrilleBuilder();
    // Formulaire événement si besoin
    if (['piege','decouverte','rencontre','porte','coffre','porte_secrete','pnj','autel'].includes(mode)) {
        _mjAfficherFormulaireEvent(mode);
    }
}

function _mjAfficherFormulaireEvent(mode) {
    const form = document.getElementById('donjon-event-form');
    if (!form) return;
    const styles = 'background:#111;color:#fff;border:1px solid #444;padding:3px 8px;border-radius:3px;font-size:0.82em;';
    let html = `<div style="background:#1a1a2a;border:1px solid #5c3a9d;padding:8px;border-radius:6px;font-size:0.82em;color:#aaa;">`;
    if (mode === 'piege') {
        html += `<strong style="color:#ff6b6b;">Piège</strong><br>
            <div style="margin-bottom:4px;">
                Description : <input id="ev-desc" type="text" placeholder="Dalle piégée…" style="${styles}width:160px;">
            </div>
            <div style="margin-bottom:4px;">
                Dégâts PV : <input id="ev-degats" type="number" value="8" min="1" max="99" style="${styles}width:50px;">
                &nbsp; Difficulté : <input id="ev-difficulte" type="number" value="50" min="1" max="100" style="${styles}width:50px;">
                <span style="color:#555;font-size:0.85em;">(1=facile, 100=très dur)</span>
            </div>
            <div>
                Type de dégât :
                <select id="ev-type-degat" style="${styles}">
                    <option value="normal">🪤 Normal</option>
                    <option value="poison">☠️ Poison</option>
                    <option value="feu">🔥 Feu</option>
                    <option value="elec">⚡ Électrique</option>
                </select>
                <span style="color:#555;font-size:0.85em;margin-left:4px;">Poison = effet/tour × 3, Élec = étourdi 1 tour, Feu = brûlure bonus</span>
            </div>`;
    } else if (mode === 'decouverte') {
        html += `<strong style="color:#2196f3;">Découverte</strong><br>
            Texte : <input id="ev-desc" type="text" placeholder="Une inscription sur le mur…" style="${styles}width:250px;">`;
    } else if (mode === 'rencontre') {
        html += `<strong style="color:#ff9800;">Rencontre</strong><br>
            Description : <input id="ev-desc" type="text" placeholder="Des gobelins surgissent !" style="${styles}width:220px;">`;
    } else if (mode === 'porte') {
        html += `<strong style="color:#d4af37;">Porte</strong><br>
            <div style="margin-top:4px;">
                Clef requise : <input id="ev-cle-requise" type="text" placeholder="cle_tour_nord (vide = aucune)" style="${styles}width:200px;">
                <span style="color:#555;font-size:0.85em;display:block;margin-top:2px;">Si rempli → porte toujours verrouillée, ouvrable uniquement avec cette clef (ou de force)</span>
            </div>
            <div style="margin-top:6px;">
                Prob. verrouillée <em style="color:#555;">(sans clef)</em> : <input id="ev-prob-verrou-porte" type="number" min="0" max="100" value="30" style="${styles}width:55px;"> %
                &nbsp; Durabilité : <input id="ev-durabilite-porte" type="number" min="10" max="100" value="30" style="${styles}width:50px;">
            </div>
            <div style="margin-top:8px;border-top:1px solid #333;padding-top:6px;">
                <label style="color:#ff6b6b;cursor:pointer;">
                    <input type="checkbox" id="ev-piege-actif-porte" style="margin-right:4px;">
                    🪤 Porte piégée
                </label>
                <div id="ev-piege-details-porte" style="display:none;margin-top:6px;">
                    Dégâts : <input id="ev-piege-degats-porte" type="number" value="8" min="1" max="99" style="${styles}width:45px;">
                    &nbsp; Diff. : <input id="ev-piege-diff-porte" type="number" value="50" min="1" max="100" style="${styles}width:45px;">
                    &nbsp; Type :
                    <select id="ev-piege-type-porte" style="${styles}">
                        <option value="normal">🪤 Normal</option>
                        <option value="poison">☠️ Poison</option>
                        <option value="feu">🔥 Feu</option>
                        <option value="elec">⚡ Élec</option>
                    </select>
                </div>
            </div>`;
        setTimeout(() => {
            const cb = document.getElementById('ev-piege-actif-porte');
            const det = document.getElementById('ev-piege-details-porte');
            if (cb && det) cb.addEventListener('change', () => { det.style.display = cb.checked ? 'block' : 'none'; });
        }, 0);
    } else if (mode === 'coffre') {
        html += `<strong style="color:#4caf50;">Coffre</strong><br>
            Probabilité verrouillé : <input id="ev-prob-verrou" type="number" min="0" max="100" value="30" style="${styles}width:55px;"> %
            &nbsp; Durabilité : <input id="ev-durabilite" type="number" min="10" max="100" value="20" style="${styles}width:50px;">
            <span style="color:#555;font-size:0.9em;margin-left:6px;">(si verrouillé)</span>
            <div style="margin-top:8px;border-top:1px solid #333;padding-top:6px;">
                <label style="color:#ff6b6b;cursor:pointer;">
                    <input type="checkbox" id="ev-piege-actif-coffre" style="margin-right:4px;">
                    🪤 Coffre piégé
                </label>
                <div id="ev-piege-details-coffre" style="display:none;margin-top:6px;">
                    Dégâts : <input id="ev-piege-degats-coffre" type="number" value="8" min="1" max="99" style="${styles}width:45px;">
                    &nbsp; Diff. : <input id="ev-piege-diff-coffre" type="number" value="50" min="1" max="100" style="${styles}width:45px;">
                    &nbsp; Type :
                    <select id="ev-piege-type-coffre" style="${styles}">
                        <option value="normal">🪤 Normal</option>
                        <option value="poison">☠️ Poison</option>
                        <option value="feu">🔥 Feu</option>
                        <option value="elec">⚡ Élec</option>
                    </select>
                </div>
            </div>`;
        setTimeout(() => {
            const cb = document.getElementById('ev-piege-actif-coffre');
            const det = document.getElementById('ev-piege-details-coffre');
            if (cb && det) cb.addEventListener('change', () => { det.style.display = cb.checked ? 'block' : 'none'; });
        }, 0);
    } else if (mode === 'porte_secrete') {
        html += `<strong style="color:#d4af37;">Porte secrète</strong>
            <span style="color:#555;font-size:0.85em;display:block;margin-top:2px;">Invisible dans la grille joueur jusqu'à détection ou fouille. Placée dans un mur.</span>
            <div style="margin-top:6px;">
                Durabilité : <input id="ev-durabilite-ps" type="number" value="25" min="5" max="100" style="${styles}width:50px;">
                <span style="color:#555;font-size:0.85em;">(résistance si enfoncée de force)</span>
            </div>`;
    } else if (mode === 'pnj') {
        html += `<strong style="color:#4caf50;">PNJ errant</strong><br>
            <div style="margin-bottom:4px;">Nom : <input id="ev-pnj-nom" type="text" placeholder="Marchand vagabond…" style="${styles}width:180px;"></div>
            <div style="margin-bottom:4px;">Emoji : <input id="ev-pnj-emoji" type="text" placeholder="🧙" maxlength="4" style="${styles}width:50px;"></div>
            <div>Dialogue : <textarea id="ev-pnj-dialogue" placeholder='"Je n\'ai pas grand chose à vendre…"' rows="3" style="${styles}width:100%;resize:vertical;"></textarea></div>`;
    } else if (mode === 'autel') {
        html += `<strong style="color:#9c7fd4;">Autel</strong><br>
            <div style="margin-bottom:4px;">Nom : <input id="ev-autel-nom" type="text" placeholder="Autel des Anciens…" style="${styles}width:180px;"></div>
            <div style="margin-bottom:4px;">Description : <input id="ev-autel-desc" type="text" placeholder="Une pierre gravée de runes…" style="${styles}width:240px;"></div>
            <div>Effet :
                <select id="ev-autel-effet" style="${styles}">
                    <option value="aleatoire">🎲 Aléatoire</option>
                    <option value="soin">✨ Soins (25% PV)</option>
                    <option value="energie">⚡ Énergie (20% FT)</option>
                    <option value="rien">🌀 Rien (silencieux)</option>
                </select>
            </div>`;
    }
    html += '</div>';
    form.innerHTML = html;
}

function _mjRendreGrilleBuilder() {
    const container = document.getElementById('donjon-builder-grille');
    if (!container || !window._donjonBrouillon) return;
    const b = window._donjonBrouillon;
    const cellPx = Math.max(18, Math.min(30, Math.floor(460 / b.largeur)));

    container.style.cssText = `display:grid;grid-template-columns:repeat(${b.largeur},${cellPx}px);gap:1px;background:#111;padding:4px;border:1px solid #333;border-radius:4px;width:fit-content;`;
    container.innerHTML = '';

    for (let y = 0; y < b.hauteur; y++) {
        for (let x = 0; x < b.largeur; x++) {
            const key  = `${x}_${y}`;
            const cell = b.grille[key] || { type: 'mur' };
            const isMur = cell.type === 'mur';
            const isDepart = b.depart?.x === x && b.depart?.y === y;

            const div = document.createElement('div');
            div.style.cssText = `width:${cellPx}px;height:${cellPx}px;display:flex;align-items:center;justify-content:center;font-size:${Math.max(8,cellPx-12)}px;box-sizing:border-box;`;

            if (isDepart) {
                div.style.background = '#1a3a1a';
                div.textContent = '📍';
            } else if (cell.type === 'escalier') {
                div.style.background = '#1a1a3a';
                div.style.border = '1px solid #3a3a8a';
                div.textContent = '🪜';
            } else if (isMur) {
                div.style.background = '#2a2a2a';
                div.style.border = '1px solid #1a1a1a';
                if (cell.event?.type === 'porte_secrete') {
                    div.style.background = '#3a2a00';
                    div.textContent = '🔐';
                }
            } else {
                div.style.background = '#3a2e20';
                div.style.border = '1px solid #4a3a28';
                if (cell.event) {
                    const icones = { porte: '🚪', piege: '🪤', coffre: '📦', rencontre: '👹', decouverte: '🔎', pnj: '🧙', autel: '⛩' };
                    div.textContent = icones[cell.event.type] || '';
                }
            }

            div.addEventListener('click', () => _mjCelluleCliquee(x, y));
            container.appendChild(div);
        }
    }
}

function _mjCelluleCliquee(x, y) {
    const b   = window._donjonBrouillon;
    if (!b) return;
    const key  = `${x}_${y}`;
    const mode = window._donjonModeEdit;
    if (!mode) return; // Aucun mode sélectionné

    if (mode === 'sol') {
        b.grille[key] = { type: 'sol' };
    } else if (mode === 'mur') {
        b.grille[key] = { type: 'mur' };
    } else if (mode === 'depart') {
        // Mettre la case en sol et définir le départ
        b.grille[key] = { type: 'sol' };
        b.depart = { x, y };
    } else if (mode === 'escalier') {
        b.grille[key] = { type: 'escalier' };
    } else if (mode === 'porte_secrete') {
        // Porte secrète : reste un mur avec event
        b.grille[key] = { type: 'mur', event: _mjLireFormulaireEvent(mode) };
    } else {
        // Event : la case devient sol + event
        b.grille[key] = { type: 'sol', event: _mjLireFormulaireEvent(mode) };
    }

    _mjRendreGrilleBuilder();
}

function _mjLireFormulaireEvent(mode) {
    const event = { type: mode, declenche: false, data: {} };
    const desc       = document.getElementById('ev-desc');
    const degats     = document.getElementById('ev-degats');
    const verrou     = document.getElementById('ev-verrou');
    const probVerrou = document.getElementById('ev-prob-verrou');
    const durabilite = document.getElementById('ev-durabilite');
    if (desc)       event.data.description = desc.value || '';
    if (desc && mode === 'decouverte') event.data.texte = desc.value || '';
    if (degats)     event.data.degats      = parseInt(degats.value) || 8;
    if (verrou)     event.data.verrouille  = verrou.checked; // legacy (non-porte)
    const typeDegat  = document.getElementById('ev-type-degat');
    const difficulte = document.getElementById('ev-difficulte');
    if (typeDegat)  event.data.type_degat  = typeDegat.value || 'normal';
    if (difficulte) event.data.difficulte  = Math.min(100, Math.max(1, parseInt(difficulte.value) || 50));
    const cleRequise      = document.getElementById('ev-cle-requise');
    const probVerrouPorte = document.getElementById('ev-prob-verrou-porte');
    const durabilitePorte = document.getElementById('ev-durabilite-porte');
    if (cleRequise)      event.data.cleRequise  = cleRequise.value.trim() || null;
    if (probVerrouPorte) event.data.probVerrou  = Math.min(100, Math.max(0, parseInt(probVerrouPorte.value) || 30));
    if (durabilitePorte) event.data.durabilite  = Math.min(100, Math.max(10, parseInt(durabilitePorte.value) || 30));
    if (probVerrou) event.data.probVerrou  = Math.min(100, Math.max(0, parseInt(probVerrou.value) || 30));
    if (durabilite) event.data.durabilite  = Math.min(100, Math.max(10, parseInt(durabilite.value) || 20));
    const durabilitePS = document.getElementById('ev-durabilite-ps');
    if (durabilitePS) event.data.durabilite = Math.min(100, Math.max(5, parseInt(durabilitePS.value) || 25));
    const pnjNom  = document.getElementById('ev-pnj-nom');
    const pnjDial = document.getElementById('ev-pnj-dialogue');
    const pnjEmoji = document.getElementById('ev-pnj-emoji');
    if (pnjNom)   event.data.nom      = pnjNom.value || 'Voyageur';
    if (pnjDial)  event.data.dialogue = pnjDial.value || '"…"';
    if (pnjEmoji) event.data.emoji    = pnjEmoji.value || '🧙';
    const autelNom  = document.getElementById('ev-autel-nom');
    const autelDesc = document.getElementById('ev-autel-desc');
    const autelEffet = document.getElementById('ev-autel-effet');
    if (autelNom)   event.data.nom         = autelNom.value || 'Autel Ancien';
    if (autelDesc)  event.data.description = autelDesc.value || '';
    if (autelEffet) event.data.effet       = autelEffet.value || 'aleatoire';

    // Piège sur coffre ou porte
    const suffix = mode === 'coffre' ? 'coffre' : mode === 'porte' ? 'porte' : null;
    if (suffix) {
        const cbPiege    = document.getElementById(`ev-piege-actif-${suffix}`);
        const piegeDegats = document.getElementById(`ev-piege-degats-${suffix}`);
        const piegeDiff   = document.getElementById(`ev-piege-diff-${suffix}`);
        const piegeType   = document.getElementById(`ev-piege-type-${suffix}`);
        if (cbPiege?.checked) {
            event.data.piege = {
                degats:     parseInt(piegeDegats?.value) || 8,
                difficulte: Math.min(100, Math.max(1, parseInt(piegeDiff?.value) || 50)),
                type_degat: piegeType?.value || 'normal',
                declenche:  false
            };
        }
    }

    return event;
}

function mjRedimensionnerDonjon() {
    const larg = Math.min(20, Math.max(5, parseInt(document.getElementById('donjon-larg')?.value) || 10));
    const haut = Math.min(20, Math.max(5, parseInt(document.getElementById('donjon-haut')?.value) || 8));
    window._donjonBrouillon = _creerGrilleDonjon(larg, haut);
    // Synchroniser dans la structure multi-étages
    if (!window._donjonBrouillonEtages) { window._donjonBrouillonEtages = {}; window._donjonEtageEdite = 1; }
    window._donjonBrouillonEtages[window._donjonEtageEdite || 1] = window._donjonBrouillon;
    const sec = document.getElementById('mj-section-donjon');
    if (sec) sec.innerHTML = _mjBuilderDonjonHtml();
    _mjRendreGrilleBuilder();
}

function mjResetDonjon() {
    window._donjonBrouillon = null;
    window._donjonBrouillonEtages = null;
    window._donjonEtageEdite = null;
    window._donjonModeEdit = 'sol';
    mjGererDonjon();
}

/** Charge une carte pré-enregistrée dans le brouillon (étage 1). */
function mjChargerPreset(nom) {
    if (typeof DONJON_PRESETS === 'undefined' || !DONJON_PRESETS[nom]) return;
    if (!confirm(`Charger la carte "${DONJON_PRESETS[nom].nom}" ? Le brouillon actuel sera remplacé.`)) return;
    window._donjonBrouillon = _parseDonjonPreset(DONJON_PRESETS[nom]);
    window._donjonEtageEdite = 1;
    window._donjonBrouillonEtages = { 1: window._donjonBrouillon };
    window._donjonModeEdit = 'sol';
    const sec = document.getElementById('mj-section-donjon');
    if (sec) sec.innerHTML = _mjBuilderDonjonHtml();
    _mjRendreGrilleBuilder();
}

/** Ajoute un nouvel étage vide au brouillon. */
function mjAjouterEtage() {
    if (!window._donjonBrouillonEtages) { window._donjonBrouillonEtages = { 1: window._donjonBrouillon }; }
    // Sauvegarder l'étage courant avant de changer
    const curN = window._donjonEtageEdite || 1;
    if (window._donjonBrouillon) window._donjonBrouillonEtages[curN] = window._donjonBrouillon;
    const keys = Object.keys(window._donjonBrouillonEtages).map(Number).sort((a,b) => a-b);
    const newN = keys[keys.length - 1] + 1;
    const newFloor = _creerGrilleDonjon(10, 8);
    window._donjonBrouillonEtages[newN] = newFloor;
    window._donjonEtageEdite = newN;
    window._donjonBrouillon  = newFloor;
    const sec = document.getElementById('mj-section-donjon');
    if (sec) sec.innerHTML = _mjBuilderDonjonHtml();
    _mjRendreGrilleBuilder();
}

/** Bascule vers un autre étage dans l'éditeur. */
function mjBasculeEtageBuilder(n) {
    n = parseInt(n);
    if (!window._donjonBrouillonEtages) return;
    // Sauvegarder l'étage courant
    const curN = window._donjonEtageEdite || 1;
    if (window._donjonBrouillon) window._donjonBrouillonEtages[curN] = window._donjonBrouillon;
    // Charger l'étage demandé
    window._donjonEtageEdite = n;
    window._donjonBrouillon  = window._donjonBrouillonEtages[n] || _creerGrilleDonjon(10, 8);
    window._donjonBrouillonEtages[n] = window._donjonBrouillon;
    const sec = document.getElementById('mj-section-donjon');
    if (sec) sec.innerHTML = _mjBuilderDonjonHtml();
    _mjRendreGrilleBuilder();
}

/** Supprime l'étage actuellement édité (impossible si c'est le seul). */
function mjSupprimerEtage() {
    const etages = window._donjonBrouillonEtages || {};
    const keys   = Object.keys(etages).map(Number).sort((a,b) => a-b);
    if (keys.length <= 1) { if (typeof _toast === 'function') _toast('Il faut au moins un étage.', 'error'); return; }
    const curN = window._donjonEtageEdite || 1;
    if (!confirm(`Supprimer l'étage ${curN} ?`)) return;
    delete etages[curN];
    // Renuméroter
    const sorted = Object.keys(etages).map(Number).sort((a,b) => a-b);
    const renamed = {};
    sorted.forEach((k, i) => { renamed[i+1] = etages[k]; });
    window._donjonBrouillonEtages = renamed;
    const newN = Math.min(curN, sorted.length);
    window._donjonEtageEdite = newN;
    window._donjonBrouillon  = renamed[newN];
    const sec = document.getElementById('mj-section-donjon');
    if (sec) sec.innerHTML = _mjBuilderDonjonHtml();
    _mjRendreGrilleBuilder();
}

/** MJ : passe manuellement au prochain étage. */
function mjPasserEtageSuperieur() {
    db.ref('parties/' + sessionActuelle + '/donjon_actif').once('value', snap => {
        const data = snap.val();
        if (!data) return;
        const etageActuel   = data.etage_actuel || 1;
        const prochainEtage = etageActuel + 1;
        const prochain      = (data.etages || {})[prochainEtage];
        if (!prochain) { if (typeof _toast === 'function') _toast('Aucun étage suivant.', 'error'); return; }

        const depart    = prochain.depart || { x: 1, y: 1 };
        const positions = {};
        Object.keys(data.positions || {}).forEach(id => { positions[id] = { ...depart }; });

        db.ref('parties/' + sessionActuelle + '/donjon_actif').update({
            grille:                    prochain.grille,
            largeur:                   prochain.largeur,
            hauteur:                   prochain.hauteur,
            etage_actuel:              prochainEtage,
            positions,
            tour_actuel:               0,
            log:                       {},
            cases_visitees:            null,
            pieges_detectes:           null,
            portes_secretes_detectees: null,
            autels_utilises:           null,
            etats_portes:              null,
            etats_coffres:             null,
            rencontre_en_attente:      null,
        }).then(() => {
            if (typeof _toast === 'function') _toast(`⬆ Étage ${prochainEtage} activé.`, 'success');
            mjGererDonjon();
        });
    });
}

/** Lance le donjon : écrit dans Firebase et initialise les positions des joueurs. */
function mjLancerDonjon() {
    const b = window._donjonBrouillon;
    if (!b) return;

    // Sauvegarder l'étage courant dans la structure multi-étages
    const curN = window._donjonEtageEdite || 1;
    if (!window._donjonBrouillonEtages) window._donjonBrouillonEtages = {};
    window._donjonBrouillonEtages[curN] = b;

    db.ref('parties/' + sessionActuelle + '/joueurs').once('value', snap => {
        const joueurs = snap.val() || {};
        const ids = Object.keys(joueurs);
        if (ids.length === 0) {
            if (typeof _toast === 'function') _toast('Aucun joueur connecté.', 'error');
            return;
        }

        // Filtrer le MJ (pas de perso jouable dans le donjon)
        const joueurIds = ids.filter(id => !joueurs[id]?.estMJ);

        // Positions initiales : tous au point de départ de l'étage 1
        const etage1 = (window._donjonBrouillonEtages[1]) || b;
        const positions = {};
        const depart = { x: etage1.depart?.x || 1, y: etage1.depart?.y || 1 };
        joueurIds.forEach(id => { positions[id] = { ...depart }; });
        joueurIds.forEach(id => {
            if (joueurs[id]?.compagnon?.nom) {
                positions[`cmp_${id}`] = { ...depart };
            }
        });

        // Ordre de jeu : joueurs + compagnons, tri par DX décroissant
        const getDX = (id) => {
            const j = joueurs[id];
            return (j?.statsBase?.DX || 8) + (j?.statsInvesties?.DX || 0);
        };
        const getDXCmp = (id) => {
            const cmp = joueurs[id]?.compagnon;
            return cmp?.DX || 8;
        };

        const entrees = [];
        joueurIds.forEach(id => {
            entrees.push({ id, dx: getDX(id) });
            if (joueurs[id]?.compagnon?.nom) {
                entrees.push({ id: `cmp_${id}`, dx: getDXCmp(id) });
            }
        });
        entrees.sort((a, b2) => b2.dx - a.dx);
        const ordre = entrees.map(e => e.id);

        // Construire la structure multi-étages pour Firebase (étage 1 au root)
        const etages = window._donjonBrouillonEtages || { 1: etage1 };
        const nbEtages = Object.keys(etages).length;

        const payload = {
            largeur:       etage1.largeur,
            hauteur:       etage1.hauteur,
            grille:        etage1.grille,
            positions,
            ordre_joueurs: ordre,
            tour_actuel:   0,
            log:           {},
            etage_actuel:  1,
            ...(nbEtages > 1 ? { etages } : {}),
        };

        db.ref('parties/' + sessionActuelle + '/donjon_actif').set(payload).then(() => {
            if (typeof _toast === 'function') _toast('🗺 Donjon lancé !', 'success');
            mjGererDonjon();
        });
    });
}

/** Bascule la pause du donjon. */
function mjTogglePauseDonjon() {
    db.ref('parties/' + sessionActuelle + '/donjon_actif/pause').once('value', snap => {
        const enPause = !!snap.val();
        db.ref('parties/' + sessionActuelle + '/donjon_actif/pause').set(!enPause).then(() => {
            if (typeof _toast === 'function') _toast(enPause ? '▶ Jeu repris.' : '⏸ Jeu en pause.', 'info');
            mjGererDonjon();
        });
    });
}

/** Termine le donjon : supprime la clé Firebase. */
function mjTerminerDonjon() {
    if (!confirm('Terminer le donjon ? Les joueurs seront renvoyés à l\'accueil.')) return;
    db.ref('parties/' + sessionActuelle + '/donjon_actif').remove().then(() => {
        window._donjonBrouillon = null;
        if (typeof _toast === 'function') _toast('🏁 Donjon terminé.', 'info');
        mjGererDonjon();
    });
}

/** Lance un combat depuis une rencontre en attente dans le donjon. */
function mjLancerCombatRencontre() {
    db.ref('parties/' + sessionActuelle + '/donjon_actif/rencontre_en_attente').once('value', snap => {
        const r = snap.val();
        if (!r) { if (typeof _toast === 'function') _toast('Aucune rencontre active.', 'error'); return; }
        // Stocker le contexte pour l'onglet combat
        window._rencontreDonjonContexte = r.description || 'Rencontre !';
        // Effacer la rencontre en attente ET lever la pause
        const refDonjon = db.ref('parties/' + sessionActuelle + '/donjon_actif');
        refDonjon.child('rencontre_en_attente').remove();
        refDonjon.child('pause').set(false);
        // Basculer sur l'onglet combat
        if (typeof switchOngletMJ === 'function') switchOngletMJ('combat');
    });
}

/** Ignore une rencontre en attente. */
function mjIgnorerRencontre() {
    const refDonjon = db.ref('parties/' + sessionActuelle + '/donjon_actif');
    refDonjon.child('rencontre_en_attente').remove();
    refDonjon.child('pause').set(false);
    refDonjon.once('value', () => mjGererDonjon());
}

/** Déplace un compagnon (MJ) dans le donjon. */
function mjDeplacerCompagnon(joueurId, dx, dy) {
    const ref = db.ref('parties/' + sessionActuelle + '/donjon_actif');
    ref.once('value', snap => {
        const data = snap.val();
        if (!data) return;
        const cmpKey = `cmp_${joueurId}`;
        const pos = data.positions?.[cmpKey] || { x: 1, y: 1 };
        const nx = pos.x + dx;
        const ny = pos.y + dy;

        if (nx < 0 || nx >= (data.largeur || 10) || ny < 0 || ny >= (data.hauteur || 8)) return;

        const cellKey = `${nx}_${ny}`;
        const cell = data.grille?.[cellKey];
        if (!cell || cell.type === 'mur') {
            if (typeof _toast === 'function') _toast('🧱 Passage bloqué.', 'error');
            return;
        }

        const ordre = data.ordre_joueurs || [];
        const tourIdx = Math.max(0, (data.tour_actuel || 0) % Math.max(1, ordre.length));
        const nextTour = (tourIdx + 1) % Math.max(1, ordre.length);

        const logKey = 'log_' + Date.now();
        const updates = {};
        updates[`positions/${cmpKey}`] = { x: nx, y: ny };
        updates['tour_actuel'] = nextTour;
        updates[`log/${logKey}`] = { texte: `🐾 Compagnon de ${joueurId} se déplace en (${nx},${ny}).`, timestamp: Date.now() };

        ref.update(updates).then(() => mjGererDonjon());
    });
}

/** Ouvre la modal MJ de gestion des maîtrises de compétences d'un joueur. */
function mjGererMaitrises(playerID, playerNom) {
    let modal = document.getElementById('modal-mj-maitrises');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-mj-maitrises';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }

    const render = () => {
        db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID).once('value', snap => {
            const j = snap.val();
            if (!j) return;
            const rangsComp    = j.rangsComp    || {};
            const compInvesties = j.compInvesties || {};

            const RANGS_NOM = { 0: '—', 1: 'Apprenti', 2: 'Expert', 3: 'Maître' };
            const RANGS_COLOR = { 0: '#555', 1: '#2a5fa5', 2: '#8a6d00', 3: '#7a1a1a' };
            const RANGS_TXT   = { 0: '#888', 1: '#c8dfff', 2: '#ffe896', 3: '#ffb3b3' };
            const SEUILS = { 1: 1, 2: 9, 3: 18 };

            const box = document.createElement('div');
            box.style.cssText = 'background:#0d0a18;border:2px solid #4a2a8a;border-radius:10px;padding:20px;max-width:520px;width:95%;max-height:88vh;overflow-y:auto;';

            const header = document.createElement('div');
            header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;';
            const titre = document.createElement('h3');
            titre.style.cssText = 'color:#9575cd;margin:0;';
            titre.textContent = '🎓 Maîtrises — ' + playerNom;
            const btnFermer = document.createElement('button');
            btnFermer.style.cssText = 'background:transparent;border:none;color:#888;font-size:20px;cursor:pointer;';
            btnFermer.textContent = '✕';
            btnFermer.onclick = () => { modal.style.display = 'none'; };
            header.appendChild(titre);
            header.appendChild(btnFermer);
            box.appendChild(header);

            const legende = document.createElement('div');
            legende.style.cssText = 'font-size:11px;color:#666;margin-bottom:12px;';
            legende.textContent = 'Seuils : Apprenti ≥1pt · Expert ≥9pts · Maître ≥18pts investis dans la compétence';
            box.appendChild(legende);

            if (typeof competencesData === 'undefined') {
                box.appendChild(Object.assign(document.createElement('div'), { textContent: 'competencesData non chargé.', style: 'color:#888;' }));
            } else {
                for (const [catNom, skills] of Object.entries(competencesData)) {
                    const catDiv = document.createElement('div');
                    catDiv.style.cssText = 'margin-bottom:10px;';
                    const catTitre = document.createElement('div');
                    catTitre.style.cssText = 'color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;border-bottom:1px solid #333;padding-bottom:2px;';
                    catTitre.textContent = catNom;
                    catDiv.appendChild(catTitre);

                    for (const skill of skills) {
                        const rang = rangsComp[skill.id] || 0;
                        const pts  = compInvesties[skill.id] || 0;

                        const row = document.createElement('div');
                        row.style.cssText = 'display:flex;align-items:center;gap:6px;padding:4px 0;border-bottom:1px solid #1a1a2a;';

                        const nomSpan = document.createElement('span');
                        nomSpan.style.cssText = 'flex:1;color:#ccc;font-size:12px;';
                        nomSpan.textContent = skill.nom;

                        const ptsSpan = document.createElement('span');
                        ptsSpan.style.cssText = 'color:#666;font-size:11px;min-width:42px;text-align:right;';
                        ptsSpan.textContent = pts + 'pts';

                        const badge = document.createElement('span');
                        badge.style.cssText = `background:${RANGS_COLOR[rang]};color:${RANGS_TXT[rang]};font-size:10px;padding:1px 6px;border-radius:3px;min-width:54px;text-align:center;`;
                        badge.textContent = RANGS_NOM[rang];

                        const setRang = (newRang) => {
                            db.ref('parties/' + sessionActuelle + '/joueurs/' + playerID + '/modif_rang').set({
                                skillId: skill.id,
                                rang: newRang,
                                timestamp: Date.now()
                            }).then(() => {
                                const label = newRang > rang ? `↑ ${RANGS_NOM[newRang]}` : `↓ ${RANGS_NOM[newRang]}`;
                                if (typeof _toast === 'function') _toast(`🎓 ${playerNom} — ${skill.nom} : ${label}`, 'success');
                                render();
                            });
                        };

                        const btnMoins = document.createElement('button');
                        btnMoins.textContent = '−';
                        btnMoins.style.cssText = 'background:#2a1a1a;color:#f44336;border:1px solid #5a1a1a;padding:1px 7px;cursor:pointer;border-radius:3px;font-size:13px;';
                        btnMoins.disabled = rang <= 0;
                        if (rang <= 0) btnMoins.style.opacity = '0.3';
                        btnMoins.onclick = () => setRang(rang - 1);

                        const btnPlus = document.createElement('button');
                        btnPlus.textContent = '+';
                        const nextRang = rang + 1;
                        const ptsOk = nextRang <= 3 && pts >= (SEUILS[nextRang] || 999);
                        btnPlus.disabled = rang >= 3 || !ptsOk;
                        btnPlus.style.cssText = 'background:#1a2a1a;color:#4caf50;border:1px solid #1a5a1a;padding:1px 7px;cursor:pointer;border-radius:3px;font-size:13px;';
                        if (btnPlus.disabled) { btnPlus.style.opacity = '0.3'; btnPlus.title = rang >= 3 ? 'Rang maximum' : `Requiert ${SEUILS[nextRang] || '?'}pts (actuellement ${pts})`; }
                        btnPlus.onclick = () => setRang(rang + 1);

                        row.appendChild(nomSpan);
                        row.appendChild(ptsSpan);
                        row.appendChild(badge);
                        row.appendChild(btnMoins);
                        row.appendChild(btnPlus);
                        catDiv.appendChild(row);
                    }
                    box.appendChild(catDiv);
                }
            }

            modal.innerHTML = '';
            modal.appendChild(box);
            modal.style.display = 'flex';
        });
    };

    render();
}

/** Passe le tour du compagnon actuel (MJ). */
function mjPasserTourCompagnon() {
    const ref = db.ref('parties/' + sessionActuelle + '/donjon_actif');
    ref.once('value', snap => {
        const data = snap.val();
        if (!data) return;
        const ordre = data.ordre_joueurs || [];
        const tourIdx = Math.max(0, (data.tour_actuel || 0) % Math.max(1, ordre.length));
        const nextTour = (tourIdx + 1) % Math.max(1, ordre.length);
        ref.update({ tour_actuel: nextTour }).then(() => mjGererDonjon());
    });
}
