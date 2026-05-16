// ============================================================
// SYSTÈME DE DONJON — Phase joueur
// Tour par tour, brouillard de guerre, événements
// ============================================================

window.donjonActif = null;

// ── Cartes pré-enregistrées ──────────────────────────────────
// Chaque carte est définie par un tableau de chaînes (ASCII map).
// '#' = mur, '.' = sol, 'S' = départ, 'P' = piège, 'C' = coffre, 'R' = rencontre, 'D' = porte, 'X' = découverte, 'V' = découverte visible, 'H' = porte secrète, 'N' = PNJ errant, 'A' = autel, 'E' = escalier (étage suivant)

const DONJON_PRESETS = {
    couloir: {
        nom: '🗺 Couloir en L',
        carte: [
            '##########',
            '#S........',
            '#.#######.',
            '#.......R.',
            '#C#######.',
            '#X......P.',
            '#.########',
            '##########',
        ]
    },

    Schuyler: {
        nom: '🏰 Schuyler et Fils',
        etages: {
            1: {
                nom: '🏰 Schuyler et Fils — Étage 1',
                carte: [
                    '########',
                    '#S...RC#',
                    '#......#',
                    '#C....E#',
                    '########',
                ],
                events: {
                    '6_1': { type: 'coffre', declenche: false, data: { probVerrou: 0, or: 50, variante: 'tonneau', piege: { declenche: false, degats: 12, type_degat: 'normal', description: 'Piège à ressort !', difficulte: 10 }}},
                    '1_3': { type: 'coffre', declenche: false, data: { probVerrou: 0, or: 15, variante: 'tonneau', items: [
                        { id: 'DEF11', nom: 'Casque de fer' },
                        { id: 'MUN02', nom: 'Flèche' },
                        { id: 'DIV14', nom: 'Chiffon' }
                    ]}},
                    '6_3': { type: 'escalier', declenche: false },
                },
                connexions: {
                    '6_3': { x: 12, y: 2 }, // escalier SE étage 1 → arrive juste sous l'escalier NE (12,1) de l'étage 2
                },
            },
            2: {
                nom: '🏰 Schuyler et Fils — Étage 2',
                carte: [
                    '###############',
                    '#S......R..#E#',
                    '#.#######..#.#',
                    '#D###C.##..#.#',
                    '#.###..##....#',
                    '#R.....#######',
                    '#.#####.....C#',
                    '#.#####.....E#',
                    '#...........C#',
                    '##############',
                ],
                events: {
                    '6_3': { type: 'coffre', declenche: false, data: { probVerrou: 0, or: 15, piege: { declenche: false, degats: 12, type_degat: 'normal', description: 'Piège à ressort !', difficulte: 5 }, items: [
                        { id: 'CONS03', nom: 'Potion de soin' },
                        { id: 'MUN02', nom: 'Flèche' }
                    ]}},
                    '12_8': { type: 'coffre', declenche: false, data: { probVerrou: 0, or: 20, variante: 'magique', items: [
                        { id: 'CONS04', nom: 'Potion d\'énergie' },
                        { id: 'CONS07', nom: 'Antidote' },
                        { id: 'AM68', nom: 'Hache mystique' }
                    ]}},
                    '12_6': { type: 'coffre', declenche: false, data: { probVerrou: 0, or: 20, variante: 'tonneau', items: [
                        { id: 'CONS04', nom: 'Potion d\'énergie' },
                        { id: 'CONS07', nom: 'Antidote' },
                        { id: 'AM68', nom: 'Hache mystique' }
                    ]}},
                    '12_1': { type: 'escalier', declenche: false },
                    '12_7': { type: 'escalier', declenche: false },
                },
                connexions: {
                    '12_7': { x: 7, y: 2 }, // escalier SE étage 2 → arrive juste sous l'escalier unique (7,1) de l'étage 3
                },
            },
            3: {
                nom: '🏰 Schuyler et Fils — Étage 3',
                carte: [
                    '###############',
                    '#######E#######',
                    '#######S#######',
                    '#######.#######',
                    '##.....X.....##',
                    '##...........##',
                    '#######D#######',
                    '####.......####',
                    '####...X...####',
                    '####.......D.C#',
                    '###############',
                ],
                events: {
                    '11_9': { type: 'porte', declenche: false, data: { probVerrou: 100, durabilite: 100, cleRequise: 'cle_schuyler', ouverteParDefaut: false } },
                    '13_9': { type: 'coffre', declenche: false, data: { probVerrou: 0, or: 140, items: [
                        { id: 'CONS23', nom: 'Liquide d\'épaississement' },
                        { id: 'AM33', nom: 'Dague des ombres' },
                        { id: 'XXX07', nom: 'Papier trouvé dans le sous-sol Schuyler et fils' }
                    ]}},
                    '7_1': { type: 'escalier', declenche: false },
                    '7_4': { type: 'decouverte', visible: true, declenche: false, data: {
                        emoji: '🧟',
                        texte: 'Vous arrivez dans une grande salle.\nAutour de vous, des nains semblent ne prêter aucune attention à vous — ils continuent de miner en boucle dans un silence de mort.'
                    }},
                    '7_8': { type: 'decouverte', visible: true, declenche: false, data: {
                        emoji: '🧛',
                        texte: 'Vous arrivez dans une pièce chaleureuse.\nDevant vous se tient une chaise ancienne avec un cadavre dessus. Autour de lui, deux jeunes hommes en costume sombre discutent entre eux.'
                    }},
                },
            },
        },
    },



    crypte: {
        nom: '⚰ Crypte',
        carte: [
            '############',
            '#S..#....C.#',
            '#...D......#',
            '#...H....R.#',
            '####.#####.#',
            '#P...#.....#',
            '#....D.....#',
            '#X...#.....#',
            '############',
        ]
    },
    grotte: {
        nom: '🪨 Grotte',
        carte: [
            '###########',
            '##S........',
            '#.#########',
            '#.#.......#',
            '#.#.C.R...#',
            '#.#.......#',
            '#.#########',
            '#.........#',
            '#P..D.....#',
            '###########',
        ]
    },
    forteresse: {
        nom: '🏰 Forteresse',
        carte: [
            '################',
            '#S.............#',
            '#.##.########.##',
            '#.#C.........D.#',
            '#.#.#########.##',
            '#.#.#R.......#.#',
            '#D#.#.#######.##',
            '#...#.........P#',
            '#.##########.###',
            '#X.N.....A.....#',
            '################',
        ]
    },
    cave_crash: {
        nom: '💀 Cave du Crash',
        carte: [
            '###############',
            '###.C.#CX...###',
            '###...##.....##',
            '###..........##',
            '###...R......##',
            '######.########',
            '######...######',
            '###S....C######',
            '###############',
        ],
        events: {
            '8_1': { type: 'decouverte', visible: true, declenche: false, data: { emoji: '🌫', texte: 'Un esprit translucide surgit des ténèbres.\n"Voyageurs… ce lieu a englouti bien des âmes. Méfiez-vous de ce qui rôde dans l\'obscurité."' } },
            '4_1': { type: 'coffre', declenche: false, data: { probVerrou: 0, durabilite: 20 } },
            '7_1': { type: 'coffre', declenche: false, data: { probVerrou: 0, durabilite: 20 } },
            '8_7': { type: 'coffre', declenche: false, data: { probVerrou: 0, durabilite: 20 } }
        }
    },
    mine_elisa: {
        nom: '⛏ Mine d\'Elisa Pionnier',
        carte: [
            '##########################',
            '##.6...R....##.....4..5..#',
            '##D#########.##D##########',
            '##....8#.3...R...D..2....#',
            '#V..7..D.R####.######.####',
            '#########...##.#####.S.###',
            '##########################',
        ],
        events: {
            '3_1':  { type: 'coffre', declenche: false, data: { probVerrou: 0, variante: 'magique', or: 225, items: [
                { id: 'MUN02', nom: 'Flèches', quantite: 10 },
                { id: 'CONS03', nom: 'Potion de soin' },
                { id: 'CONS04', nom: 'Potion d\'énergie' },
                { id: 'AM16', nom: 'Petite dague magique' },
            ]}},
            '19_1': { type: 'coffre', declenche: false, data: { probVerrou: 0, variante: 'tonneau', items: [
                { id: 'COMP26', nom: 'Vieux mécanisme' },
                { id: 'MUN01', nom: 'Dynamite' },
            ]}},
            '22_1': { type: 'coffre', declenche: false, data: { probVerrou: 0, variante: 'tonneau', piege: { declenche: false, degats: 12, type_degat: 'normal', description: 'Piège à ressort !', difficulte: 50 }, items: [
                { id: 'AM15', nom: 'Barre de fer' },
                { id: 'COMP05', nom: 'Racine de ginka' },
                { id: 'COMP28', nom: 'Petit tube en métal' },
                { id: 'COMP55', nom: 'Flacon de Camphre' },
                { id: 'COMP19', nom: 'Gros ressort' },
                { id: 'COMP20', nom: 'Petit ressort' },
                { id: 'COMP29', nom: 'Chambre de revolver' },
            ]}},
            '9_3':  { type: 'coffre', declenche: false, data: { probVerrou: 0, variante: 'tonneau', or: 21, items: [
                { id: 'CONS03', nom: 'Élixir de soins légers' },
            ]}},
            '20_3': { type: 'coffre', declenche: false, data: { probVerrou: 0, variante: 'tonneau', items: [
                { id: 'DEF25', nom: 'Lanterne' },
            ]}},
            '4_4':  { type: 'coffre', declenche: false, data: { probVerrou: 0, variante: 'coffre', items: [
                { id: 'XXX06', nom: 'Botte de Elisa Pionnier' },
            ]}},
            '6_3':  { type: 'coffre', declenche: false, data: { probVerrou: 0, variante: 'tonneau', items: [
                { id: 'COMP47', nom: 'Condensateur' },
                { id: 'COMP49', nom: 'Feuilles de tabac' },
            ]}},
            '2_2':  { type: 'porte', declenche: false, data: { probVerrou: 0, durabilite: 30, cleRequise: null, ouverteParDefaut: true } },
            '15_2': { type: 'porte', declenche: false, data: { probVerrou: 0, durabilite: 30, cleRequise: null, ouverteParDefaut: true } },
            '17_3': { type: 'porte', declenche: false, data: { probVerrou: 0, durabilite: 30, cleRequise: null, ouverteParDefaut: true } },
            '7_4':  { type: 'porte', declenche: false, data: { probVerrou: 0, durabilite: 30, cleRequise: null, ouverteParDefaut: true } },
            '1_4':  { type: 'decouverte', visible: true, declenche: false, data: {
                emoji: '👻',
                texte: 'L\'esprit d\'Elisa Pionnier vous apparaît, les traits rongés par la fatigue et le remords.\n"Ces galeries étaient les miennes. Je les ai creusées de mes propres mains… et elles m\'ont engloutie.\nPrenez ce que vous trouvez — vous l\'avez bien mérité."'
            }}
        }
    }
};

/** Convertit une carte ASCII en objet brouillon. */
function _parseDonjonPreset(preset) {
    const lignes = preset.carte;
    const hauteur = lignes.length;
    const largeur = Math.max(...lignes.map(l => l.length));
    const grille = {};
    let depart = { x: 1, y: 1 };

    for (let y = 0; y < hauteur; y++) {
        const ligne = lignes[y];
        for (let x = 0; x < largeur; x++) {
            const ch = (ligne[x] || '#');
            const key = `${x}_${y}`;
            if (ch === '#') {
                grille[key] = { type: 'mur' };
            } else if (ch === 'S') {
                grille[key] = { type: 'sol' };
                depart = { x, y };
            } else if (ch === 'P') {
                grille[key] = { type: 'sol', event: { type: 'piege', declenche: false, data: { description: 'Dalle piégée', degats: 8, type_degat: 'normal', difficulte: 50 } } };
            } else if (ch === 'C') {
                grille[key] = { type: 'sol', event: { type: 'coffre', declenche: false, data: { probVerrou: 50, durabilite: 20 } } };
            } else if (ch === 'R') {
                grille[key] = { type: 'sol', event: { type: 'rencontre', declenche: false, data: { description: 'Des ennemis surgissent !' } } };
            } else if (ch === 'D') {
                grille[key] = { type: 'sol', event: { type: 'porte', declenche: false, data: { probVerrou: 40, durabilite: 30, cleRequise: null } } };
            } else if (ch === '') {
                grille[key] = { type: 'sol', event: { type: 'decouverte', declenche: false, data: { texte: 'Une inscription mystérieuse…' } } };
            } else if (ch === 'V') {
                grille[key] = { type: 'sol', event: { type: 'decouverte', visible: true, declenche: false, data: { texte: '', emoji: '👻' } } };
            } else if (ch === 'H') {
                grille[key] = { type: 'mur', event: { type: 'porte_secrete', declenche: false, data: { durabilite: 25 } } };
            } else if (ch === 'N') {
                grille[key] = { type: 'sol', event: { type: 'pnj', declenche: false, data: { nom: 'Voyageur mystérieux', dialogue: '"Je n\'ai pas grand chose à dire… sinon que ces couloirs cachent plus d\'un secret."', emoji: '🧙' } } };
            } else if (ch === 'A') {
                grille[key] = { type: 'sol', event: { type: 'autel', declenche: false, data: { nom: 'Autel Ancien', description: 'Une pierre taillée couverte de runes. Une force y sommeille.', effet: 'aleatoire' } } };
            } else if (ch === 'E') {
                grille[key] = { type: 'escalier' };
            } else {
                grille[key] = { type: 'sol' };
            }
        }
    }
    if (preset.events) {
        Object.entries(preset.events).forEach(([key, eventData]) => {
            if (grille[key]) grille[key].event = eventData;
        });
    }
    return { largeur, hauteur, grille, depart, connexions: preset.connexions || {} };
}

// ── Navigation ───────────────────────────────────────────────

function ouvrirEcranDonjon() {
    if (typeof cacherTout === 'function') cacherTout();
    const ecran = document.getElementById('ecran-donjon');
    if (ecran) ecran.style.display = 'flex';
    _activerClavierDonjon();
    afficherEtatDonjon();
}

/** Active le listener clavier pour déplacer le joueur dans le donjon. */
function _activerClavierDonjon() {
    if (window._clavierDonjonActif) return; // déjà branché
    window._clavierDonjonActif = true;
    document.addEventListener('keydown', _handleClavierDonjon);
}

function _desactiverClavierDonjon() {
    window._clavierDonjonActif = false;
    document.removeEventListener('keydown', _handleClavierDonjon);
}

function _handleClavierDonjon(e) {
    // Ignorer si un champ de saisie est actif
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    // Ignorer si l'écran donjon n'est pas visible
    const ecran = document.getElementById('ecran-donjon');
    if (!ecran || ecran.style.display === 'none') return;

    const map = {
        'ArrowUp': [0, -1], 'z': [0, -1], 'Z': [0, -1],
        'ArrowDown': [0, 1], 's': [0, 1], 'S': [0, 1],
        'ArrowLeft': [-1, 0], 'q': [-1, 0], 'Q': [-1, 0],
        'ArrowRight': [1, 0], 'd': [1, 0], 'D': [1, 0],
    };
    const dir = map[e.key];
    if (!dir) return;
    e.preventDefault();
    if (!_estMonTourDonjon()) return;
    deplacerJoueur(dir[0], dir[1]);
}

function fermerEcranDonjon() {
    if (!window.estMJ) {
        if (typeof _toast === 'function') _toast('⛔ Seul le MJ peut terminer le donjon.', 'error');
        return;
    }
    _desactiverClavierDonjon();
    window.donjonActif = null;
    if (typeof allerAccueil === 'function') allerAccueil();
}

// ── Affichage principal ──────────────────────────────────────

function afficherEtatDonjon() {
    const data = window.donjonActif;
    if (!data) return;
    _afficherOrdreDonjon(data);
    _afficherStatsDonjon();
    _afficherGrilleDonjon(data);
    _afficherPanneauDonjon(data);
    _afficherActionsHorsCombatDonjon();
    _afficherLogDonjon(data);
    _afficherBandeauRencontre(data);
}

/** Affiche (ou cache) le bandeau "rencontre en attente du MJ" pour les joueurs. */
function _afficherBandeauRencontre(data) {
    if (window.estMJ) return;
    let el = document.getElementById('donjon-bandeau-rencontre');
    if (!el) {
        el = document.createElement('div');
        el.id = 'donjon-bandeau-rencontre';
        el.style.cssText = 'display:none;position:absolute;top:0;left:0;right:0;background:rgba(100,0,0,0.92);color:#ff8080;text-align:center;padding:10px;font-weight:bold;z-index:500;font-size:0.9em;border-bottom:2px solid #8b0000;';
        const ecran = document.getElementById('ecran-donjon');
        if (ecran) ecran.style.position = 'relative', ecran.appendChild(el);
    }
    if (data.rencontre_en_attente) {
        const desc = data.rencontre_en_attente.description || 'Des ennemis !';
        el.innerHTML = `👹 <strong>${desc}</strong> — En attente du MJ…`;
        el.style.display = 'block';
    } else {
        el.style.display = 'none';
    }
}

// ── Barre d'ordre d'actions ──────────────────────────────────

function _afficherOrdreDonjon(data) {
    const bar = document.getElementById('donjon-ordre-bar');
    if (!bar) return;
    const ordre   = data.ordre_joueurs || [];
    const tourIdx = Math.max(0, (data.tour_actuel || 0) % Math.max(1, ordre.length));
    const myID    = (window.perso?.nom || '').replace(/\s+/g, '_');

    bar.innerHTML = ordre.map((id, i) => {
        const actif  = i === tourIdx;
        const isMe   = id === myID;
        const isCmp  = id.startsWith('cmp_');
        const nomBrut = isCmp ? id.replace('cmp_', '').replace(/_/g, ' ') : id.replace(/_/g, ' ');
        const label  = isCmp ? `🐾 ${nomBrut}` : nomBrut;

        let portraitUrl = null;
        if (isCmp && typeof compagnonsData !== 'undefined') {
            const cmpEntry = Object.values(compagnonsData).find(c => c.nom === nomBrut);
            portraitUrl = cmpEntry?.portrait || null;
        } else if (isMe) {
            portraitUrl = (typeof getPortraitJoueur === 'function') ? getPortraitJoueur(window.perso) : null;
        }
        const imgHtml = portraitUrl
            ? `<img src="${portraitUrl}" alt="" style="width:36px;height:36px;object-fit:cover;border-radius:3px;display:block;margin:0 auto 2px;">`
            : '';

        return `<div style="
            display:inline-flex;flex-direction:column;align-items:center;
            padding:4px 8px;border-radius:4px;min-width:52px;
            white-space:nowrap;font-size:0.74em;
            background:${actif ? '#1a3a1a' : '#111'};
            border:1px solid ${actif ? '#4caf50' : '#2a2010'};
            color:${actif ? '#4caf50' : isMe ? '#d4af37' : '#666'};
            font-weight:${actif ? 'bold' : 'normal'};
        ">${imgHtml}${actif ? '▶ ' : ''}${label}</div>`;
    }).join('');
}

// ── Stats HP / FT ────────────────────────────────────────────

function _afficherStatsDonjon() {
    const el = document.getElementById('donjon-stats');
    if (!el || !window.perso) return;
    const p     = window.perso;
    const pvAct = p.pvActuel ?? 0;
    const pvMax = (p.statsBase?.FO || 0) * 2 + (p.statsBase?.IN || 0)
                + (p.statsInvesties?.FO || 0) * 2 + (p.statsInvesties?.IN || 0)
                + (p.boostPV || 0);
    const ftAct = p.ftActuel ?? 0;
    let bonusFTEquipDonjon = 0;
    if (p.equipement && typeof itemsData !== 'undefined') {
        for (const slot in p.equipement) {
            const itemEq = p.equipement[slot];
            if (itemEq?.identifie !== false && itemsData[itemEq?.id]?.stats?.FT) {
                bonusFTEquipDonjon += itemsData[itemEq.id].stats.FT;
            }
        }
    }
    const ftMax = (p.statsBase?.CN || 0) * 2 + (p.statsBase?.IN || 0)
                + (p.statsInvesties?.CN || 0) * 2 + (p.statsInvesties?.IN || 0)
                + (p.boostFT || 0) + bonusFTEquipDonjon;
    const pvPct = pvMax > 0 ? Math.round(pvAct / pvMax * 100) : 0;
    const ftPct = ftMax > 0 ? Math.round(ftAct / ftMax * 100) : 0;
    const pvCol = pvPct > 50 ? '#4caf50' : pvPct > 20 ? '#f0b429' : '#ff4444';

    el.innerHTML = `
        <div style="display:flex;gap:10px;background:#111;border-radius:5px;padding:6px 10px;">
            <div style="flex:1;">
                <div style="color:#888;font-size:0.72em;margin-bottom:2px;">❤ PV</div>
                <div style="height:5px;background:#222;border-radius:3px;overflow:hidden;margin-bottom:2px;">
                    <div style="height:100%;width:${pvPct}%;background:${pvCol};"></div>
                </div>
                <strong style="color:${pvCol};font-size:0.88em;">${pvAct} / ${pvMax}</strong>
            </div>
            <div style="flex:1;">
                <div style="color:#888;font-size:0.72em;margin-bottom:2px;">⚡ FT</div>
                <div style="height:5px;background:#222;border-radius:3px;overflow:hidden;margin-bottom:2px;">
                    <div style="height:100%;width:${ftPct}%;background:#2196f3;"></div>
                </div>
                <strong style="color:#2196f3;font-size:0.88em;">${ftAct} / ${ftMax}</strong>
            </div>
        </div>`;
}

// ── Soins & Consommables (hors combat) ───────────────────────

/** Retourne true si c'est le tour du joueur actuel dans le donjon. */
function _estMonTourDonjon() {
    const data = window.donjonActif;
    if (!data) return false;
    const ordre = data.ordre_joueurs || [];
    if (ordre.length === 0) return true; // pas de système de tour actif
    const myID   = (window.perso?.nom || '').replace(/\s+/g, '_');
    const tourIdx = (data.tour_actuel || 0) % ordre.length;
    return ordre[tourIdx] === myID;
}

function _afficherActionsHorsCombatDonjon() {
    const el = document.getElementById('donjon-actions-hc');
    if (!el || !window.perso) return;
    if (window.estMJ) { el.innerHTML = ''; return; }

    const p   = window.perso;
    const inv = p.inventaire || [];

    // Consommables utiles
    const conso = inv.filter(item => {
        if (!item || item.quantite <= 0) return false;
        const def = typeof itemsData !== 'undefined' ? itemsData[item.id] : null;
        return def && (def.soin || def.curePoison || def.resurrection);
    });

    // Sorts de soin connus
    const sortsHC = [];
    if (typeof magieData !== 'undefined') {
        const magieInv = p.magieInvesties || {};
        Object.entries(magieData).forEach(([ecole, ecoleData]) => {
            const niveauEcole = magieInv[ecole] || 0;
            if (!niveauEcole) return;
            (ecoleData.sorts || []).forEach(s => {
                if ((s.soin || s.curePoison) && s.niv <= niveauEcole) {
                    if (!sortsHC.find(x => x.nom === s.nom)) sortsHC.push(s);
                }
            });
        });
    }

    const btn = 'background:#1a1408;color:#d4af37;border:1px solid #4a3a1a;padding:5px 10px;border-radius:4px;cursor:pointer;font-size:0.78em;';
    const btnInv = 'background:#1a1208;color:#9c7fd4;border:1px solid #3a2060;padding:5px 10px;border-radius:4px;cursor:pointer;font-size:0.78em;';
    let html = '<div style="border-top:1px solid #2a2010;padding-top:6px;margin-top:4px;">';
    html += '<div style="display:flex;flex-wrap:wrap;gap:5px;">';

    if (conso.length > 0 || sortsHC.length > 0) {
        conso.forEach(item => {
            const def = itemsData[item.id];
            const ico = def.soin ? '💊' : def.curePoison ? '🧪' : '✨';
            html += `<button onclick="_utiliserItemDonjon('${item.id}')" style="${btn}">${ico} ${def.nom} ×${item.quantite}</button>`;
        });
        sortsHC.forEach(s => {
            html += `<button onclick="_choisirCibleSoinDonjon('${s.nom}')" style="${btn}">✨ ${s.nom}${s.cout ? ` (−${s.cout} FT)` : ''}</button>`;
        });
    }

    html += `<button onclick="_ouvrirInventaireDonjon()" style="${btnInv}">📦 Inventaire</button>`;
    html += '</div></div>';
    el.innerHTML = html;
}

/** Ouvre l'inventaire depuis le donjon — retour automatique au donjon en fermant. */
function _ouvrirInventaireDonjon() {
    window._retourDonjon = true;
    if (typeof allerInventaire === 'function') allerInventaire();
}

/** Utilise un consommable sur soi-même. */
function _utiliserItemDonjon(itemId) {
    if (!_estMonTourDonjon()) {
        if (typeof _toast === 'function') _toast("⏳ Ce n'est pas votre tour !", 'error');
        return;
    }
    const p   = window.perso;
    if (!p || typeof itemsData === 'undefined') return;
    const def = itemsData[itemId];
    if (!def) return;
    const idx = (p.inventaire || []).findIndex(i => i.id === itemId && i.quantite > 0);
    if (idx === -1) return;

    if (def.soin) {
        const parts  = String(def.soin).split('-').map(Number);
        const soinMn = parts[0] || 0;
        const soinMx = parts[parts.length - 1] || soinMn;
        const soin   = soinMn + Math.floor(Math.random() * (soinMx - soinMn + 1));
        const pvMax  = (p.statsBase?.FO || 0) * 2 + (p.statsBase?.IN || 0)
                     + (p.statsInvesties?.FO || 0) * 2 + (p.statsInvesties?.IN || 0) + (p.boostPV || 0);
        p.pvActuel = Math.min(pvMax, (p.pvActuel || 0) + soin);
        if (typeof _toast === 'function') _toast(`💊 ${def.nom} : +${soin} PV`, 'success');
        _logDonjon(`💊 ${p.nom} utilise ${def.nom} (+${soin} PV).`);
    }
    if (def.curePoison) {
        p.poison = null;
        if (typeof _toast === 'function') _toast(`🧪 ${def.nom} : poison soigné !`, 'success');
        _logDonjon(`🧪 ${p.nom} utilise ${def.nom} (poison soigné).`);
    }

    p.inventaire[idx].quantite--;
    if (p.inventaire[idx].quantite <= 0) p.inventaire.splice(idx, 1);
    if (typeof autoSave === 'function') autoSave();
    if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
    _avancerTourDonjon(window.donjonActif);
    afficherEtatDonjon();
}

/** Ouvre la sélection de cible pour un sort de soin. */
function _choisirCibleSoinDonjon(nomSort) {
    if (!_estMonTourDonjon()) {
        if (typeof _toast === 'function') _toast("⏳ Ce n'est pas votre tour !", 'error');
        return;
    }
    const data = window.donjonActif;
    if (!data) return;
    const joueurs = Object.keys(data.positions || {}).filter(id => !id.startsWith('cmp_'));

    let modal = document.getElementById('modal-donjon-soin');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-donjon-soin';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }
    const myID    = (window.perso?.nom || '').replace(/\s+/g, '_');
    const btnSyle = 'background:#0d1a0d;color:#4caf50;border:1px solid #2a5a2a;padding:8px 14px;border-radius:4px;cursor:pointer;width:100%;text-align:left;';
    const cibles  = joueurs.map(id =>
        `<button onclick="_lancerSoinDonjon('${nomSort}','${id}')" style="${btnSyle}">${id === myID ? '👤 ' : '🧑 '}${id.replace(/_/g, ' ')}</button>`
    ).join('');

    modal.innerHTML = `
        <div style="background:#1a120a;border:2px solid #4caf50;border-radius:10px;padding:20px;max-width:300px;width:90%;text-align:center;">
            <h3 style="color:#4caf50;margin:0 0 12px;">✨ ${nomSort}</h3>
            <div style="display:flex;flex-direction:column;gap:6px;">${cibles}</div>
            <button onclick="document.getElementById('modal-donjon-soin').remove()" style="margin-top:10px;width:100%;background:#333;color:#aaa;border:1px solid #555;padding:7px;border-radius:4px;cursor:pointer;">Annuler</button>
        </div>`;
    modal.style.display = 'flex';
}

/** Lance un sort de soin sur une cible (soi ou allié via Firebase). */
function _lancerSoinDonjon(nomSort, cibleId) {
    document.getElementById('modal-donjon-soin')?.remove();
    let sort = null;
    if (typeof magieData !== 'undefined') {
        Object.values(magieData).forEach(ec => { ec.sorts?.forEach(s => { if (s.nom === nomSort) sort = s; }); });
    }
    if (!sort) return;

    const p      = window.perso;
    const ftCost = sort.cout || 0;
    if (ftCost > 0 && (p.ftActuel || 0) < ftCost) {
        if (typeof _toast === 'function') _toast(`Pas assez de FT (${p.ftActuel} / ${ftCost}).`, 'error');
        return;
    }
    if (ftCost > 0) { p.ftActuel = Math.max(0, (p.ftActuel || 0) - ftCost); }

    const myID = (p.nom || '').replace(/\s+/g, '_');
    const soin = sort.soin || 0;

    if (cibleId === myID) {
        const pvMax = (p.statsBase?.FO || 0) * 2 + (p.statsBase?.IN || 0)
                    + (p.statsInvesties?.FO || 0) * 2 + (p.statsInvesties?.IN || 0) + (p.boostPV || 0);
        p.pvActuel = Math.min(pvMax, (p.pvActuel || 0) + soin);
        if (typeof _toast === 'function') _toast(`✨ ${sort.nom} : +${soin} PV`, 'success');
        _logDonjon(`✨ ${p.nom} se soigne avec ${sort.nom} (+${soin} PV).`);
    } else {
        db.ref('parties/' + sessionActuelle + '/joueurs/' + cibleId + '/modif_stat').set({
            stat: 'PV', valeur: soin, timestamp: Date.now()
        });
        if (typeof _toast === 'function') _toast(`✨ ${sort.nom} → ${cibleId.replace(/_/g, ' ')} (+${soin} PV)`, 'success');
        _logDonjon(`✨ ${p.nom} lance ${sort.nom} sur ${cibleId.replace(/_/g, ' ')} (+${soin} PV).`);
    }

    if (typeof autoSave === 'function') autoSave();
    if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
    _avancerTourDonjon(window.donjonActif);
    afficherEtatDonjon();
}

// ── Mini-carte mémorisée ─────────────────────────────────────

window._casesVisiteesDonjon = window._casesVisiteesDonjon || new Set();
let _casesVisiteesTimer = null;

function _chargerCasesVisitees(myID) {
    db.ref('parties/' + sessionActuelle + '/donjon_actif/cases_visitees/' + myID).once('value', snap => {
        const data = snap.val() || {};
        window._casesVisiteesDonjon = new Set(Object.keys(data));
    });
}

function _enregistrerCasesVisitees(visibleSet, myID) {
    let nouvelles = 0;
    visibleSet.forEach(key => {
        if (!window._casesVisiteesDonjon.has(key)) {
            window._casesVisiteesDonjon.add(key);
            nouvelles++;
        }
    });
    if (nouvelles === 0) return;
    // Écriture différée pour grouper les mises à jour
    clearTimeout(_casesVisiteesTimer);
    _casesVisiteesTimer = setTimeout(() => {
        const updates = {};
        window._casesVisiteesDonjon.forEach(k => { updates[k] = true; });
        db.ref('parties/' + sessionActuelle + '/donjon_actif/cases_visitees/' + myID).set(updates);
    }, 500);
}

// ── Grille avec brouillard ───────────────────────────────────

function _afficherGrilleDonjon(data) {
    const container = document.getElementById('donjon-grille');
    if (!container) return;

    const grille  = data.grille  || {};
    const largeur = data.largeur || 10;
    const hauteur = data.hauteur || 8;
    const myID    = (window.perso?.nom || '').replace(/\s+/g, '_');
    const maPos   = data.positions?.[myID] || { x: 1, y: 1 };

    // Calcul de la visibilité (flood-fill depuis la position du joueur)
    const visible = _calculerVisibilite(grille, largeur, hauteur, maPos.x, maPos.y, data.etats_portes);

    // Enregistrer les cases actuellement visibles dans la mémoire
    _enregistrerCasesVisitees(visible, myID);

    // Mini-carte mémorisée : cases déjà visitées (persistées dans window._casesVisiteesDonjon)
    const visitees = window._casesVisiteesDonjon || new Set();


    // Taille des cases : adapté à la largeur de l'écran (mobile-friendly)
    const availW = Math.max(200, Math.min(window.innerWidth > 0 ? window.innerWidth - 24 : 340, 340));
    const cellPx = Math.max(18, Math.min(36, Math.floor(availW / largeur)));
    container.style.cssText = `
        display:grid;
        grid-template-columns:repeat(${largeur},${cellPx}px);
        gap:1px; background:#111; padding:4px;
        border:1px solid #333; border-radius:4px;
        width:fit-content; margin:0 auto;
    `;
    container.innerHTML = '';

    for (let y = 0; y < hauteur; y++) {
        for (let x = 0; x < largeur; x++) {
            const key  = `${x}_${y}`;
            const cell = grille[key] || { type: 'mur' };
            const isVisible = visible.has(key);
            const isMyPos   = x === maPos.x && y === maPos.y;

            const isVisited = visitees.has(key);

            const div = document.createElement('div');
            div.style.cssText = `width:${cellPx}px;height:${cellPx}px;display:flex;align-items:center;justify-content:center;font-size:${Math.max(10,cellPx-8)}px;position:relative;`;

            if (!isVisible && !isVisited) {
                // Jamais vu : noir total
                div.style.background = '#000';
            } else if (!isVisible && isVisited) {
                // Vu avant mais hors de portée : brouillard mémorisé (layout visible, aucun événement)
                div.style.background = cell.type === 'mur' ? '#181818' : '#221c14';
                div.style.opacity = '0.6';
                if (cell.type !== 'mur') {
                    div.style.border = '1px solid #2a2218';
                }
            } else if (cell.type === 'escalier') {
                div.style.background = '#1a1a3a';
                div.style.border = '1px solid #3a3a8a';
                div.innerHTML = '🪜';
            } else if (cell.type === 'mur') {
                div.style.background = '#2a2a2a';
                div.style.border = '1px solid #1a1a1a';
                if (cell.event?.type === 'porte_secrete') {
                    const detectee = data.portes_secretes_detectees?.[key]?.[myID];
                    if (window.estMJ) {
                        div.innerHTML = '🔐';
                    } else if (detectee) {
                        div.style.background = '#332d18';
                        div.innerHTML = '🚪';
                    }
                }
            } else {
                div.style.background = '#3a2e20';
                div.style.border = '1px solid #4a3a28';

                // Événements
                if (cell.event) {
                    if (cell.event.type === 'porte') {
                        const etatPorte = data.etats_portes?.[key];
                        if (etatPorte?.statut === 'ouverte' || cell.event.data?.ouverteParDefaut) {
                            div.innerHTML = '🟫';
                        } else if (etatPorte?.statut === 'cassee') {
                            div.innerHTML = '💥';
                        } else {
                            div.innerHTML = '🚪';
                        }
                        if (cell.event.data?.piege && !cell.event.data.piege.declenche && data.pieges_detectes?.[key]?.[myID]) {
                            div.innerHTML += '<span style="font-size:0.55em;vertical-align:top;">⚠️</span>';
                        }
                    } else if (cell.event.type === 'coffre') {
                        const etatCoffre = data.etats_coffres?.[key];
                        const varianteEmoji = _emojicoffre(cell.event.data?.variante, false);
                        if (!etatCoffre) {
                            div.innerHTML = varianteEmoji;
                        } else if (etatCoffre.statut === 'casse') {
                            div.innerHTML = '💥';
                        } else if (etatCoffre.statut === 'ouvert' || etatCoffre.statut === 'verrouille') {
                            const slots = Object.values(etatCoffre.loot?.slots || {});
                            const toutSlotsPris = slots.length === 0 || slots.every(s => !!s.pris_par);
                            const orVal = etatCoffre.loot?.or || 0;
                            const orPris = orVal === 0 || Object.keys(etatCoffre.or_pris || {}).length > 0;
                            div.innerHTML = (toutSlotsPris && orPris) ? '📭' : varianteEmoji;
                        } else {
                            div.innerHTML = varianteEmoji;
                        }
                        if (cell.event.data?.piege && !cell.event.data.piege.declenche && data.pieges_detectes?.[key]?.[myID]) {
                            div.innerHTML += '<span style="font-size:0.55em;vertical-align:top;">⚠️</span>';
                        }
                    }
                    // Pièges : visibles seulement si détecté par ce joueur ou partagé
                    else if (cell.event.type === 'piege' && !cell.event.declenche) {
                        const detecte = data.pieges_detectes?.[key]?.[myID];
                        const partage = data.pieges_partages?.[key];
                        if (detecte || partage) div.innerHTML = '🪤';
                    }
                    // Rencontres : visibles si détectées via Détection de l'invisible
                    else if (cell.event.type === 'rencontre' && !cell.event.declenche) {
                        if (data.rencontres_detectees?.[key]?.[myID]) div.innerHTML = '👹';
                    }
                    // Découvertes visibles (ex: fantôme) : toujours affichées même après déclenchement
                    else if (cell.event.type === 'decouverte' && cell.event.visible) {
                        div.innerHTML = cell.event.data?.emoji || '👻';
                    }
                    // Découvertes normales : cachées jusqu'au déclenchement
                    else if (cell.event.type === 'pnj' && !cell.event.declenche) {
                        div.innerHTML = cell.event.data?.emoji || '🧙';
                    }
                    else if (cell.event.type === 'autel') {
                        const utilise = data.autels_utilises?.[key]?.[myID];
                        div.innerHTML = utilise ? '<span style="opacity:0.4;">⛩</span>' : '⛩';
                    }
                }
            }

            // Position du joueur
            if (isMyPos) {
                div.innerHTML = `<span style="position:absolute;font-size:${Math.max(12,cellPx-4)}px;">👤</span>`;
                div.style.background = '#1a3a1a';
            } else {
                // Autres joueurs dans la zone visible
                const autres = Object.entries(data.positions || {})
                    .filter(([id, pos]) => id !== myID && pos.x === x && pos.y === y);
                if (autres.length > 0 && isVisible) {
                    div.innerHTML = `<span style="font-size:${Math.max(10,cellPx-6)}px;">🧑</span>`;
                }
            }

            container.appendChild(div);
        }
    }
}

// ── Effets de statut (poison, étourdi…) ─────────────────────

/**
 * Appliqué une fois au début du tour du joueur.
 * Tick du poison — si duree tombe à 0, supprime l'effet.
 */
function _appliquerEffetsDebutTour(myID) {
    const p = window.perso;
    if (!p) return;

    // Poison : lire depuis Firebase, appliquer dégâts directement (bypass armure — c'est du poison interne)
    db.ref('parties/' + sessionActuelle + '/joueurs/' + myID + '/effets/poison').once('value', snap => {
        const poison = snap.val();
        if (!poison) return;
        const { degats, duree } = poison;

        // Résistance au poison (bonusInnes) — pas d'armure physique
        let dmg = degats;
        const resP = p.bonusInnes?.resPoison || 0;
        if (resP !== 0) dmg = Math.max(0, Math.round(dmg * (1 - resP / 100)));

        if (dmg > 0) {
            const pvAvant = p.pvActuel || 0;
            let msg;
            if (pvAvant - dmg <= 0) {
                // Le poison ne peut pas tuer : surplus sur la FT
                const pvAbsorbables = pvAvant - 1;
                const surplus = dmg - pvAbsorbables;
                p.pvActuel = 1;
                p.ftActuel = Math.max(0, (p.ftActuel || 0) - surplus);
                msg = `☠️ Poison : −${pvAbsorbables} PV, −${surplus} FT (${duree} tour(s) restant(s))`;
            } else {
                p.pvActuel = pvAvant - dmg;
                msg = `☠️ Poison : −${dmg} PV (${duree} tour(s) restant(s))`;
            }
            if (typeof _toast === 'function') _toast(msg, 'error');
            _logDonjon(`${msg} — ${p.nom}`);
            if (typeof autoSave === 'function') autoSave();
            if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
        }

        if (duree <= 1) {
            snap.ref.remove();
            if (typeof _toast === 'function') _toast('✅ L\'effet de poison est dissipé.', 'info');
        } else {
            snap.ref.update({ duree: duree - 1 });
        }
    });
}

// ── Panneau d'actions ────────────────────────────────────────

function _afficherPanneauDonjon(data) {
    const panel  = document.getElementById('donjon-actions');
    const statut = document.getElementById('donjon-statut');
    if (!panel) return;

    // Pause MJ
    if (data.pause) {
        if (statut) { statut.textContent = '⏸ En pause…'; statut.style.color = '#f0b429'; }
        panel.innerHTML = '<div style="text-align:center;color:#f0b429;font-size:0.88em;padding:8px;border:1px solid #5a4a00;border-radius:5px;background:#1a1400;">⏸ Le MJ a mis le jeu en pause.</div>';
        return;
    }

    const myID   = (window.perso?.nom || '').replace(/\s+/g, '_');
    const ordre  = data.ordre_joueurs || [];
    const tourIdx = Math.max(0, (data.tour_actuel || 0) % Math.max(1, ordre.length));
    const nomTour    = ordre[tourIdx] || '?';
    const estTourCompagnon = nomTour.startsWith('cmp_');
    const estMonTour = ordre[tourIdx] === myID;

    if (statut) {
        const _etageActuel = data.etage_actuel || 1;
        const _nbEtages    = Object.keys(data.etages || {}).length;
        const _etageStr    = _nbEtages > 1 ? ` — Étage ${_etageActuel}/${_nbEtages}` : '';
        if (estTourCompagnon) {
            statut.textContent = `🐾 Tour du compagnon de ${nomTour.slice(4)}…${_etageStr}`;
            statut.style.color = '#d4af37';
        } else {
            statut.textContent = (estMonTour ? "⚔ C'est votre tour !" : `Tour de ${nomTour}…`) + _etageStr;
            statut.style.color = estMonTour ? '#4caf50' : '#888';
        }
    }

    if (estTourCompagnon) {
        panel.innerHTML = '<div style="text-align:center;color:#888;font-size:0.85em;padding:8px;">Géré par le MJ.</div>';
        return;
    }

    if (!estMonTour) { panel.innerHTML = ''; return; }

    // Appliquer les effets de début de tour (poison, etc.) une seule fois par tour
    const tourActuel = data.tour_actuel || 0;
    if (window._dernierTourEffets !== tourActuel) {
        window._dernierTourEffets = tourActuel;
        _appliquerEffetsDebutTour(myID);
    }

    panel.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(3,46px);gap:6px;justify-content:center;margin:10px auto 6px;">
            <div></div>
            <button onclick="deplacerJoueur(0,-1)" style="${_styleBtnDonjon()}">↑</button>
            <div></div>
            <button onclick="deplacerJoueur(-1,0)" style="${_styleBtnDonjon()}">←</button>
            <div style="width:46px;height:46px;display:flex;align-items:center;justify-content:center;color:#d4af37;font-size:1.4em;">📍</div>
            <button onclick="deplacerJoueur(1,0)"  style="${_styleBtnDonjon()}">→</button>
            <div></div>
            <button onclick="deplacerJoueur(0,1)"  style="${_styleBtnDonjon()}">↓</button>
            <div></div>
        </div>
        <button onclick="passerTourDonjon()" style="background:#222;color:#666;border:1px solid #444;padding:5px 18px;border-radius:4px;cursor:pointer;font-size:0.82em;margin-top:4px;">⏭ Passer le tour</button>
    `;

    // Bouton "Interagir" si la case actuelle a un coffre ou une porte
    const maPos   = data.positions?.[myID];
    if (maPos) {
        const ck   = `${maPos.x}_${maPos.y}`;
        const cell = data.grille?.[ck];
        if (cell?.event?.type === 'coffre') {
            const _ev = _emojicoffre(cell.event.data?.variante, false);
            const _lbl = _labelcoffre(cell.event.data?.variante);
            panel.innerHTML += `<button onclick="_initCoffreDonjon('${ck}', ${JSON.stringify(cell.event).replace(/"/g, '&quot;')})" style="background:#2a1a0a;color:#d4af37;border:1px solid #8b6914;padding:5px 18px;border-radius:4px;cursor:pointer;font-size:0.82em;margin-top:4px;">${_ev} ${_lbl}</button>`;
        } else if (cell?.event?.type === 'porte' && !cell.event.declenche && !cell.event.data?.ouverteParDefaut) {
            panel.innerHTML += `<button onclick="_interagirPorteDonjon('${ck}', {x:${maPos.x},y:${maPos.y}}, ${JSON.stringify(cell.event).replace(/"/g, '&quot;')}, '${myID}', window.donjonActif)" style="background:#2a1a0a;color:#d4af37;border:1px solid #8b6914;padding:5px 18px;border-radius:4px;cursor:pointer;font-size:0.82em;margin-top:4px;">🚪 Interagir avec la porte</button>`;
        }
    }

    // Bouton Fouiller — détection active de portes secrètes adjacentes
    panel.innerHTML += `<button onclick="_fouillerCasesAdjacentes('${myID}')" style="background:#1a1a0a;color:#aaa;border:1px solid #444;padding:5px 18px;border-radius:4px;cursor:pointer;font-size:0.82em;margin-top:4px;">🔍 Fouiller</button>`;

    // Bouton Détection de l'invisible si le joueur a Divination >= 4 (sort niv 10)
    const _divInv = (window.perso?.magieInvesties?.Divination || 0);
    if (_divInv >= 4) {
        const _ftDetect = window.perso?.ftActuel || 0;
        const _disabledDetect = _ftDetect < 10 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : '';
        panel.innerHTML += `<button onclick="_detectionInvisibleDonjon()" ${_disabledDetect} style="background:#0d1a2a;color:#90caf9;border:1px solid #42a5f5;padding:5px 18px;border-radius:4px;cursor:pointer;font-size:0.82em;margin-top:4px;">👁 Détection (FT 10)</button>`;
    }
}

function _styleBtnDonjon() {
    return 'width:46px;height:46px;background:#2a1a0a;color:#d4af37;border:1px solid #8b6914;border-radius:6px;cursor:pointer;font-size:1.3em;';
}

// ── Log ──────────────────────────────────────────────────────

function _afficherLogDonjon(data) {
    const logEl = document.getElementById('donjon-log');
    if (!logEl) return;
    const entrees = Object.values(data.log || {})
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, 8);
    logEl.innerHTML = entrees.length === 0
        ? '<span style="color:#555;font-size:0.8em;">Aucune action.</span>'
        : entrees.map(e => `<div style="color:#aaa;font-size:0.8em;padding:2px 0;">${e.texte}</div>`).join('');
}

// ── Déplacement ──────────────────────────────────────────────

function deplacerJoueur(dx, dy) {
    const data = window.donjonActif;
    if (!data) return;
    if (data.pause) {
        if (typeof _toast === 'function') _toast('⏸ Le MJ a mis le jeu en pause.', 'info');
        return;
    }

    const myID  = (window.perso?.nom || '').replace(/\s+/g, '_');
    const maPos = data.positions?.[myID] || { x: 1, y: 1 };
    const nx = maPos.x + dx;
    const ny = maPos.y + dy;

    if (nx < 0 || nx >= (data.largeur || 10) || ny < 0 || ny >= (data.hauteur || 8)) return;

    const cellKey = `${nx}_${ny}`;
    const cell    = data.grille?.[cellKey];

    // Escalier vers l'étage suivant
    if (cell?.type === 'escalier') {
        _monterEtage(data, myID, cellKey);
        return;
    }

    if (!cell || cell.type === 'mur') {
        if (cell?.event?.type === 'porte_secrete') {
            const detectee = data.portes_secretes_detectees?.[cellKey]?.[myID];
            if (detectee) {
                db.ref('parties/' + sessionActuelle + '/donjon_actif/positions/' + myID).set({ x: nx, y: ny });
                if (typeof _toast === 'function') _toast('🔐 Vous franchissez la porte secrète.', 'info');
                _logDonjon(`🔐 ${window.perso?.nom || myID} franchit une porte secrète.`);
                _avancerTourDonjon(data);
                setTimeout(() => _verifierDetectionPieges(window.donjonActif, myID), 300);
                setTimeout(() => _verifierDetectionPortesSecretes(window.donjonActif, myID), 400);
                return;
            }
        }
        if (typeof _toast === 'function') _toast('🧱 Passage bloqué.', 'error');
        return;
    }

    // Porte non encore déclenchée : gestion async (verrou + clef + durabilité)
    if (cell.event?.type === 'porte' && !cell.event?.declenche) {
        if (cell.event?.data?.ouverteParDefaut) {
            // Passage libre mais on marque la porte ouverte pour débloquer la vision
            const refP = db.ref('parties/' + sessionActuelle + '/donjon_actif/etats_portes/' + cellKey);
            refP.once('value', sp => {
                if (!sp.val()) refP.set({ statut: 'ouverte', durabilite: 0, durabiliteMax: cell.event.data?.durabilite || 30 });
            });
        } else {
            _interagirPorteDonjon(cellKey, { x: nx, y: ny }, cell.event, myID, data);
            return;
        }
    }

    // Piège non déclenché : vérifier si détecté → modal de choix
    if (cell.event?.type === 'piege' && !cell.event?.declenche) {
        const detecte = data.pieges_detectes?.[cellKey]?.[myID];
        const partage = data.pieges_partages?.[cellKey];
        if (detecte || partage) {
            _afficherModalPiegeDetecte(cellKey, cell.event, { nx, ny, dx, dy }, myID, data);
            return;
        }
    }

    // Déplacement normal + déclenchement des autres événements
    db.ref('parties/' + sessionActuelle + '/donjon_actif/positions/' + myID).set({ x: nx, y: ny });
    if (typeof _incStatPartie === 'function') _incStatPartie('cases_parcourues', 1);
    if (cell.event) {
        if (cell.event.type === 'coffre') {
            _initCoffreDonjon(cellKey, cell.event);
        } else if (cell.event.type === 'decouverte' && cell.event.visible) {
            // Découvertes visibles (fantôme) : toujours re-déclenchables
            _declencherEvenementDonjon(cellKey, cell.event, myID);
        } else if (!cell.event.declenche) {
            _declencherEvenementDonjon(cellKey, cell.event, myID);
        }
    }
    _avancerTourDonjon(data);
    // Vérifier détection de pièges et portes secrètes dans la zone visible après déplacement
    setTimeout(() => _verifierDetectionPieges(window.donjonActif, myID), 300);
    setTimeout(() => _verifierDetectionPortesSecretes(window.donjonActif, myID), 400);
}

// ── Portes (verrou + clef + durabilité) ─────────────────────

/**
 * Contexte de la porte en cours d'interaction.
 * Stocké en window pour être accessible depuis les callbacks onclick.
 */
window._donjonPorteCtx = null;

function _interagirPorteDonjon(cellKey, pos, eventCell, myID, data) {
    // Vérifier piège non déclenché avant toute interaction
    const piege = eventCell.data?.piege;
    if (piege && !piege.declenche) {
        _verifierPiegeObjet(cellKey, piege, 'porte', () => _interagirPorteDonjon_suite(cellKey, pos, eventCell, myID, data));
        return;
    }
    _interagirPorteDonjon_suite(cellKey, pos, eventCell, myID, data);
}

function _interagirPorteDonjon_suite(cellKey, pos, eventCell, myID, data) {
    const ref = db.ref('parties/' + sessionActuelle + '/donjon_actif/etats_portes/' + cellKey);
    ref.once('value', snap => {
        let etat = snap.val();

        if (!etat) {
            // Initialiser l'état de la porte
            const cleRequise    = eventCell.data?.cleRequise || null;
            const verrouillée   = cleRequise ? true : (Math.random() * 100 < (eventCell.data?.probVerrou ?? 30));
            const durabiliteMax = Math.min(100, Math.max(10, eventCell.data?.durabilite || 30));
            etat = {
                statut:        verrouillée ? 'verrouillee' : 'ouverte',
                cleRequise:    cleRequise,
                durabilite:    verrouillée ? durabiliteMax : 0,
                durabiliteMax: durabiliteMax,
            };
            ref.set(etat);
        }

        if (etat.statut !== 'verrouillee') {
            // Porte ouverte ou cassée → passage libre
            _passerPorte(cellKey, pos, myID, data);
        } else {
            if (typeof _toast === 'function') _toast('🔒 Porte verrouillée !', 'error');
            window._donjonPorteCtx = { cellKey, pos, myID, data };
            _afficherModalPorte(cellKey, etat);
        }
    });
}

/** Le joueur franchit la porte : met à jour position + marque déclenché + avance le tour. */
function _passerPorte(cellKey, pos, myID, data) {
    _logDonjon(`🚪 ${window.perso?.nom} passe une porte.`);
    db.ref('parties/' + sessionActuelle + '/donjon_actif/grille/' + cellKey + '/event/declenche').set(true);
    db.ref('parties/' + sessionActuelle + '/donjon_actif/positions/' + myID).set(pos);
    _avancerTourDonjon(data);
}

/** Modal d'interaction avec une porte verrouillée. */
function _afficherModalPorte(cellKey, etat) {
    let modal = document.getElementById('modal-donjon-porte');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-donjon-porte';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }

    const DX          = (window.perso?.statsBase?.DX ?? 8) + (window.perso?.statsInvesties?.DX || 0);
    const crochetage  = window.perso?.compInvesties?.crochetage || 0;
    const _rangCrochDisplay = _getRang('crochetage', window.perso);
    const _bonusRangCroch = _rangCrochDisplay >= 3 ? 25 : (_rangCrochDisplay >= 2 ? 5 : 0);
    const chanceCroch = Math.min(95, DX * 3 + crochetage * 5 + _bonusRangCroch);
    const myID        = (window.perso?.nom || '').replace(/\s+/g, '_');
    const cleRequise  = etat.cleRequise;
    const aLaClef     = cleRequise && !!(window.donjonActif?.cles_joueurs?.[myID]?.[cleRequise]);

    const durCoul = etat.durabilite > etat.durabiliteMax * 0.5 ? '#4caf50'
                  : etat.durabilite > etat.durabiliteMax * 0.2 ? '#f0b429' : '#ff4444';

    // Bloc clef
    let clefHtml = '';
    if (cleRequise) {
        clefHtml = `<div style="background:#1a1408;border:1px solid #8b6914;padding:6px 10px;border-radius:5px;margin-bottom:10px;font-size:0.85em;">
            🗝 Nécessite : <strong style="color:#d4af37;">${cleRequise}</strong>
            ${aLaClef
                ? `<br><button onclick="_utiliserClefPorte('${cellKey}')" style="margin-top:6px;width:100%;background:#2a1a0a;color:#d4af37;border:1px solid #8b6914;padding:6px;border-radius:4px;cursor:pointer;">🗝 Utiliser la clef</button>`
                : `<div style="color:#666;margin-top:4px;">Vous n'avez pas cette clef.</div>`}
        </div>`;
    }

    // Bouton frapper
    const armeInfo = _getArmeEquipeeDonjon();
    let labelFrapper, sousTitreFrapper;
    if (armeInfo) {
        const dmgParts   = String(armeInfo.def.degats).split('-');
        const dmgMax     = parseInt(dmgParts[dmgParts.length - 1]) || 3;
        const durArme    = armeInfo.slotObj.durabilite ?? '?';
        labelFrapper     = `🪓 Enfoncer avec ${armeInfo.def.nom}`;
        sousTitreFrapper = `Porte −${dmgMax} dur. max · Arme −2 à 4 dur. (actuelle : ${durArme})`;
    } else {
        labelFrapper     = '🤛 Enfoncer à mains nues';
        sousTitreFrapper = 'Porte −1 à 3 dur. · Vous perdez 1 à 3 PV';
    }

    modal.innerHTML = `
        <div style="background:#1a120a;border:2px solid #d4af37;border-radius:10px;padding:20px;max-width:340px;width:90%;">
            <h3 style="color:#d4af37;margin:0 0 12px;">🔒 Porte verrouillée</h3>
            ${clefHtml}
            <div style="color:#aaa;font-size:0.85em;margin-bottom:12px;">
                Durabilité :
                <strong style="color:${durCoul};">${etat.durabilite} / ${etat.durabiliteMax}</strong>
                <div style="height:6px;background:#222;border-radius:3px;margin-top:4px;overflow:hidden;">
                    <div style="height:100%;width:${Math.round(etat.durabilite/etat.durabiliteMax*100)}%;background:${durCoul};"></div>
                </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px;">
                <button onclick="_crochetagePorte('${cellKey}')" style="background:#0d1a0d;color:#4caf50;border:1px solid #2a5a2a;padding:9px 12px;border-radius:5px;cursor:pointer;text-align:left;">
                    🔓 Crocheter
                    <span style="color:#666;font-size:0.8em;display:block;">Chance : ${chanceCroch}% (DX ${DX} + crochetage ${crochetage})</span>
                </button>
                <button onclick="_frapperPorte('${cellKey}')" style="background:#1a0d0d;color:#ff9800;border:1px solid #5a2a0d;padding:9px 12px;border-radius:5px;cursor:pointer;text-align:left;">
                    ${labelFrapper}
                    <span style="color:#666;font-size:0.8em;display:block;">${sousTitreFrapper}</span>
                </button>
                ${(_getItemsExplosifsDonjon().length > 0 || _getSortsOffensifsInvestis().length > 0) ? `<button onclick="_ouvrirModalExplosifSurTarget('${cellKey}','porte')" style="background:#1a0d00;color:#ff6b00;border:1px solid #5a3000;padding:9px 12px;border-radius:5px;cursor:pointer;text-align:left;">
                    💥 Utiliser item / sort
                    <span style="color:#666;font-size:0.8em;display:block;">Grenade, dynamite, boule de feu…</span>
                </button>` : ''}
                ${(function(){
                    const _connait = (window.perso?.magieInvesties?.['Déplacement']||0) >= 2;
                    if (!_connait) return '';
                    const _IN = (window.perso?.statsBase?.IN||0)+(window.perso?.statsInvesties?.IN||0);
                    const _ch = Math.min(95, _IN * 5);
                    const _ft = window.perso?.ftActuel || 0;
                    const _peutLancer = _ft >= 5;
                    return `<button onclick="_deverrouillagePorteDonjon('${cellKey}')" ${_peutLancer?'':'disabled'} style="background:#0d0d2a;color:#90caf9;border:1px solid #42a5f5;padding:9px 12px;border-radius:5px;cursor:pointer;text-align:left;${_peutLancer?'':'opacity:0.5;'}">
                        ✨ Déverrouillage
                        <span style="color:#666;font-size:0.8em;display:block;">Chance : ${_ch}% (IN ${_IN}) · Coût : 5 FT</span>
                    </button>`;
                })()}
            </div>
            <button onclick="document.getElementById('modal-donjon-porte').remove()" style="width:100%;background:#222;color:#666;border:1px solid #444;padding:7px;border-radius:4px;cursor:pointer;">Fermer (sans avancer le tour)</button>
        </div>`;
    modal.style.display = 'flex';
}

/** Utilise la clef requise pour ouvrir la porte et passer. */
function _utiliserClefPorte(cellKey) {
    const ctx = window._donjonPorteCtx;
    if (!ctx) return;
    const ref = db.ref('parties/' + sessionActuelle + '/donjon_actif/etats_portes/' + cellKey);
    document.getElementById('modal-donjon-porte')?.remove();
    _logDonjon(`🗝 ${window.perso?.nom} utilise une clef pour ouvrir la porte.`);
    if (typeof _toast === 'function') _toast('🗝 Porte ouverte !', 'success');
    ref.update({ statut: 'ouverte' }).then(() => {
        _passerPorte(cellKey, ctx.pos, ctx.myID, ctx.data);
    });
}

/** Tentative de crochetage de la porte. Succès → passage immédiat. */
function _deverrouillagePorteDonjon(cellKey) {
    const ctx = window._donjonPorteCtx;
    const IN  = (window.perso?.statsBase?.IN || 0) + (window.perso?.statsInvesties?.IN || 0);
    const chance = Math.min(95, IN * 5);
    const roll   = Math.floor(Math.random() * 100);
    const nom    = window.perso?.nom || '?';
    // Déduire le coût FT
    window.perso.ftActuel = Math.max(0, (window.perso.ftActuel || 0) - 5);
    if (typeof autoSave === 'function') autoSave();
    if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
    const ref = db.ref('parties/' + sessionActuelle + '/donjon_actif/etats_portes/' + cellKey);
    document.getElementById('modal-donjon-porte')?.remove();
    if (roll < chance) {
        if (typeof _toast === 'function') _toast(`✨ Porte déverrouillée magiquement ! (${roll}/${chance}%)`, 'success');
        _logDonjon(`✨ ${nom} déverrouille la porte (Déverrouillage, ${roll}/${chance}%).`);
        ref.update({ statut: 'ouverte' }).then(() => {
            if (ctx) _passerPorte(cellKey, ctx.pos, ctx.myID, ctx.data);
        });
    } else {
        if (typeof _toast === 'function') _toast(`❌ Déverrouillage échoué (${roll}/${chance}%).`, 'error');
        _logDonjon(`❌ ${nom} échoue à déverrouiller la porte (${roll}/${chance}%).`);
        if (ctx) _avancerTourDonjon(ctx.data);
    }
}

function _deverrouillageCofreDonjon(cellKey) {
    const ctx = window._donjonCoffreCtx;
    const IN  = (window.perso?.statsBase?.IN || 0) + (window.perso?.statsInvesties?.IN || 0);
    const chance = Math.min(95, IN * 5);
    const roll   = Math.floor(Math.random() * 100);
    const nom    = window.perso?.nom || '?';
    window.perso.ftActuel = Math.max(0, (window.perso.ftActuel || 0) - 5);
    if (typeof autoSave === 'function') autoSave();
    if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
    const ref = db.ref('parties/' + sessionActuelle + '/donjon_actif/etats_coffres/' + cellKey);
    document.getElementById('modal-donjon-coffre')?.remove();
    if (roll < chance) {
        if (typeof _toast === 'function') _toast(`✨ Coffre déverrouillé magiquement ! (${roll}/${chance}%)`, 'success');
        _logDonjon(`✨ ${nom} déverrouille un coffre (Déverrouillage, ${roll}/${chance}%).`);
        ref.update({ statut: 'ouvert' }).then(() => {
            ref.once('value', snap => { if (snap.val()) _afficherModalCoffre(cellKey, snap.val()); });
        });
    } else {
        if (typeof _toast === 'function') _toast(`❌ Déverrouillage échoué (${roll}/${chance}%).`, 'error');
        _logDonjon(`❌ ${nom} échoue à déverrouiller le coffre (${roll}/${chance}%).`);
        if (ctx) _avancerTourDonjon(ctx.data);
    }
}

function _detectionInvisibleDonjon() {
    const data  = window.donjonActif;
    const perso = window.perso;
    if (!data || !perso) return;
    const myID  = (perso.nom || '').replace(/\s+/g, '_');
    const maPos = data.positions?.[myID];
    if (!maPos) return;

    const coutFT = 10;
    if ((perso.ftActuel || 0) < coutFT) {
        if (typeof _toast === 'function') _toast('💥 Trop fatigué pour lancer ce sort !', 'error');
        return;
    }

    const grille = data.grille || {};
    const rayon  = 3;
    const updates = {};
    let nbPieges = 0, nbMonstres = 0;

    for (let dx = -rayon; dx <= rayon; dx++) {
        for (let dy = -rayon; dy <= rayon; dy++) {
            const cx = maPos.x + dx;
            const cy = maPos.y + dy;
            const key = cx + '_' + cy;
            const cell = grille[key];
            if (!cell || cell.type !== 'sol') continue;
            if (cell.event?.type === 'piege' && !cell.event.declenche) {
                if (!data.pieges_detectes?.[key]?.[myID]) {
                    updates['pieges_detectes/' + key + '/' + myID] = true;
                    nbPieges++;
                }
            } else if (cell.event?.type === 'rencontre' && !cell.event.declenche) {
                if (!data.rencontres_detectees?.[key]?.[myID]) {
                    updates['rencontres_detectees/' + key + '/' + myID] = true;
                    nbMonstres++;
                }
            }
        }
    }
    const nbTrouves = nbPieges + nbMonstres;

    perso.ftActuel -= coutFT;
    if (typeof autoSave === 'function') autoSave();
    if (typeof synchroniserJoueur === 'function') synchroniserJoueur();

    if (nbTrouves > 0) {
        const _details = [nbPieges > 0 ? nbPieges + ' piège(s)' : '', nbMonstres > 0 ? nbMonstres + ' rencontre(s)' : ''].filter(Boolean).join(' et ');
        db.ref('parties/' + sessionActuelle + '/donjon_actif').update(updates, function() {
            if (typeof _toast === 'function') _toast('👁 Détecté : ' + _details + ' !', 'success');
            _logDonjon('👁 ' + perso.nom + ' détecte ' + _details + ' (Détection de l\'invisible).');
            _avancerTourDonjon(data);
        });
    } else {
        if (typeof _toast === 'function') _toast('👁 Aucun piège détecté dans un rayon de ' + rayon + ' cases.', 'info');
        _logDonjon('👁 ' + perso.nom + ' utilise Détection de l\'invisible — rien à signaler.');
        _avancerTourDonjon(data);
    }
}

function _crochetagePorte(cellKey) {
    const ctx        = window._donjonPorteCtx;
    const DX         = (window.perso?.statsBase?.DX ?? 8) + (window.perso?.statsInvesties?.DX || 0);
    const crochetage = window.perso?.compInvesties?.crochetage || 0;
    const rangCroch  = _getRang('crochetage', window.perso);
    const bonusRang  = rangCroch >= 3 ? 25 : (rangCroch >= 2 ? 5 : 0);
    const chance     = Math.min(95, DX * 3 + crochetage * 5 + bonusRang);
    const roll       = Math.floor(Math.random() * 100);
    const ref        = db.ref('parties/' + sessionActuelle + '/donjon_actif/etats_portes/' + cellKey);
    const nom        = window.perso?.nom || '?';
    document.getElementById('modal-donjon-porte')?.remove();

    if (roll < chance) {
        if (typeof _toast === 'function') _toast(`🔓 Porte crochetée ! (${roll}/${chance}%)`, 'success');
        _logDonjon(`🔓 ${nom} crochète une porte (${roll}/${chance}%).`);
        ref.update({ statut: 'ouverte' }).then(() => {
            if (ctx) _passerPorte(cellKey, ctx.pos, ctx.myID, ctx.data);
        });
    } else {
        if (typeof _toast === 'function') _toast(`❌ Crochetage échoué (${roll}/${chance}%).`, 'error');
        _logDonjon(`❌ ${nom} échoue à crocheter une porte (${roll}/${chance}%).`);
        // Apprenti+ : pas de coût de tour sur un échec
        if (rangCroch >= 1) {
            if (typeof _toast === 'function') _toast('🔓 Apprenti — pas de coût de tour.', 'info');
        } else {
            if (ctx) _avancerTourDonjon(ctx.data);
        }
    }
}

/** Frappe la porte avec calcul de coup (crits inclus). */
function _frapperPorte(cellKey) {
    const ctx      = window._donjonPorteCtx;
    const armeInfo = _getArmeEquipeeDonjon();
    const nom      = window.perso?.nom || '?';
    const myID     = (window.perso?.nom || '').replace(/\s+/g, '_');
    const ref      = db.ref('parties/' + sessionActuelle + '/donjon_actif/etats_portes/' + cellKey);
    const coup     = _calculerCoupDonjon(armeInfo);
    const nomArme  = armeInfo ? armeInfo.def.nom : 'Poings';
    document.getElementById('modal-donjon-porte')?.remove();

    // Feedback selon le résultat
    if (coup.resultat === 'echec_critique') {
        const blessure = Math.floor(Math.random() * 4) + 1;
        if (typeof _toast === 'function') _toast(`💀 Échec critique ! Vous vous blessez (−${blessure} PV) !`, 'error');
        _logDonjon(`💀 ${nom} : échec critique sur la porte (−${blessure} PV).`);
        db.ref('parties/' + sessionActuelle + '/joueurs/' + myID + '/modif_stat').set({ stat: 'PV', valeur: -blessure, timestamp: Date.now() });
        if (ctx) _avancerTourDonjon(ctx.data);
        return;
    }
    if (coup.resultat === 'succes_critique') {
        if (typeof _toast === 'function') _toast(`🌟 Coup critique ! ${coup.dmg} dégâts !`, 'success');
    } else if (coup.resultat === 'echec') {
        if (typeof _toast === 'function') _toast(`❌ Coup manqué (${coup.roll}/${coup.baseChance}%).`, 'error');
        if (ctx) _avancerTourDonjon(ctx.data);
        return;
    }

    // Usure de l'arme
    if (armeInfo) {
        const perteArme = coup.resultat === 'succes_critique' ? Math.floor(Math.random() * 3) + 3 : Math.floor(Math.random() * 3) + 2;
        const slotObj   = armeInfo.slotObj;
        if (slotObj.durabilite !== undefined) {
            slotObj.durabilite = Math.max(0, (slotObj.durabilite || 0) - perteArme);
            if (typeof _toast === 'function') {
                slotObj.durabilite === 0
                    ? _toast(`🔨 ${nomArme} est brisée !`, 'error')
                    : _toast(`🔧 ${nomArme} : −${perteArme} dur. (reste ${slotObj.durabilite})`, 'info');
            }
            if (typeof autoSave === 'function') autoSave();
        }
    } else {
        const pertePV = Math.floor(Math.random() * 3) + 1;
        if (typeof _toast === 'function') _toast(`🤛 Vous vous blessez en enfonçant la porte (−${pertePV} PV) !`, 'error');
        _logDonjon(`🤛 ${nom} se blesse à mains nues (−${pertePV} PV).`);
        db.ref('parties/' + sessionActuelle + '/joueurs/' + myID + '/modif_stat').set({ stat: 'PV', valeur: -pertePV, timestamp: Date.now() });
    }

    ref.once('value', snap => {
        const etat = snap.val();
        if (!etat) return;
        const nouvDura = Math.max(0, etat.durabilite - coup.dmg);
        _logDonjon(`🪓 ${nom} frappe la porte avec ${nomArme} — ${coup.resultat} (${coup.roll}/${coup.baseChance}%) : −${coup.dmg} dur. → reste ${nouvDura}/${etat.durabiliteMax}.`);
        if (nouvDura <= 0) {
            if (typeof _toast === 'function') _toast('💥 La porte est enfoncée !', 'success');
            ref.update({ durabilite: 0, statut: 'cassee' });
        } else {
            if (typeof _toast === 'function') _toast(`🪓 Porte endommagée (${nouvDura}/${etat.durabiliteMax}).`, 'info');
            ref.update({ durabilite: nouvDura });
        }
    });
    if (ctx) _avancerTourDonjon(ctx.data);
}

function passerTourDonjon() {
    const data = window.donjonActif;
    if (!data) return;
    if (data.pause) {
        if (typeof _toast === 'function') _toast('⏸ Le MJ a mis le jeu en pause.', 'info');
        return;
    }
    _avancerTourDonjon(data);
}

function _avancerTourDonjon(data) {
    const ordre = data.ordre_joueurs || [];
    if (ordre.length === 0) return;
    let prochain = ((data.tour_actuel || 0) + 1) % ordre.length;

    // Vérifier si le prochain joueur est étourdi → sauter son tour et nettoyer l'effet
    const prochainID = ordre[prochain];
    if (prochainID && !prochainID.startsWith('cmp_')) {
        const effets = window.donjonActif?.joueurs?.[prochainID]?.effets;
        if (effets?.etourdi) {
            _logDonjon(`⚡ ${prochainID} est étourdi — son tour est sauté.`);
            db.ref('parties/' + sessionActuelle + '/joueurs/' + prochainID + '/effets/etourdi').remove();
            prochain = (prochain + 1) % ordre.length;
        }
    }

    db.ref('parties/' + sessionActuelle + '/donjon_actif/tour_actuel').set(prochain);
}

// ── Système de pièges ─────────────────────────────────────────

/**
 * Vérifie si le joueur détecte des pièges dans sa zone visible.
 * Appelé après chaque déplacement.
 */
function _verifierDetectionPieges(data, myID) {
    if (!data || !window.perso) return;
    const p         = window.perso;
    const detection = p.compInvesties?.detection_piege || 0;
    if (detection <= 0) return; // compétence requise pour détection passive
    const grille  = data.grille || {};
    const maPos   = data.positions?.[myID] || { x: 1, y: 1 };
    const visible = _calculerVisibilite(grille, data.largeur || 10, data.hauteur || 8, maPos.x, maPos.y, data.etats_portes);
    const range   = 4;

    visible.forEach(key => {
        const cell = grille[key];
        if (!cell?.event) return;
        // Piège au sol OU piège sur porte/coffre
        const estPiegesSol    = cell.event.type === 'piege' && !cell.event.declenche;
        const estPiegeObjet   = (cell.event.type === 'porte' || cell.event.type === 'coffre')
                                && cell.event.data?.piege && !cell.event.data.piege.declenche;
        if (!estPiegesSol && !estPiegeObjet) return;
        if (data.pieges_detectes?.[key]?.[myID]) return; // déjà détecté

        // Vérifier portée
        const [cx, cy] = key.split('_').map(Number);
        const dist = Math.abs(cx - maPos.x) + Math.abs(cy - maPos.y);
        if (dist > range) return;

        const piegeData    = estPiegesSol ? cell.event.data : cell.event.data.piege;
        const difficulte   = piegeData?.difficulte ?? 50;
        const rangDet      = _getRang('detection_piege', p);
        const bonusDet     = rangDet >= 2 ? 10 : (rangDet >= 1 ? 5 : 0);
        const chanceBase   = Math.min(95, detection * 5 + 10 + bonusDet);
        const chanceFinale = Math.max(5, chanceBase - Math.floor((difficulte - 50) / 2));
        const roll         = Math.floor(Math.random() * 100) + 1;

        const detecte = roll <= chanceFinale || (rangDet >= 3 && (Math.floor(Math.random() * 100) + 1) <= chanceFinale);
        if (detecte) {
            db.ref('parties/' + sessionActuelle + '/donjon_actif/pieges_detectes/' + key + '/' + myID).set(true);
            if (typeof _toast === 'function') _toast(`🔍 Vous repérez un piège à (${cx},${cy}) !`, 'warning');
            _logDonjon(`🔍 ${p.nom} détecte un piège en (${cx},${cy}).`);
        }
    });
}

/** Détection passive de portes secrètes dans les cases adjacentes. */
function _verifierDetectionPortesSecretes(data, myID) {
    if (!data || !window.perso) return;
    const p = window.perso;
    const detection = p.compInvesties?.detection_piege || 0;
    if (detection <= 0) return;
    const grille = data.grille || {};
    const maPos  = data.positions?.[myID] || { x: 1, y: 1 };

    Object.entries(grille).forEach(([key, cell]) => {
        if (cell?.event?.type !== 'porte_secrete') return;
        if (data.portes_secretes_detectees?.[key]?.[myID]) return;
        const [cx, cy] = key.split('_').map(Number);
        const dist = Math.abs(cx - maPos.x) + Math.abs(cy - maPos.y);
        if (dist > 2) return;
        const chance = Math.min(60, detection * 8 + 5);
        if (Math.floor(Math.random() * 100) + 1 <= chance) {
            db.ref('parties/' + sessionActuelle + '/donjon_actif/portes_secretes_detectees/' + key + '/' + myID).set(true);
            if (typeof _toast === 'function') _toast('🔐 Vous percevez quelque chose d\'étrange dans le mur…', 'warning');
            _logDonjon(`🔐 ${p.nom} détecte une porte secrète en (${cx},${cy}).`);
        }
    });
}

/** Fouille active : chance bien plus élevée, coûte 1 tour. */
function _fouillerCasesAdjacentes(myID) {
    const data = window.donjonActif;
    if (!data || !window.perso) return;
    const p = window.perso;
    const grille = data.grille || {};
    const maPos  = data.positions?.[myID] || { x: 1, y: 1 };
    const detection = p.compInvesties?.detection_piege || 0;
    const chance = Math.min(95, detection * 12 + 35);
    let trouve = false;

    for (const [adx, ady] of [[-1,0],[1,0],[0,-1],[0,1]]) {
        const key = `${maPos.x + adx}_${maPos.y + ady}`;
        const cell = grille[key];
        if (cell?.event?.type !== 'porte_secrete') continue;
        if (data.portes_secretes_detectees?.[key]?.[myID]) continue;
        if (Math.floor(Math.random() * 100) + 1 <= chance) {
            db.ref('parties/' + sessionActuelle + '/donjon_actif/portes_secretes_detectees/' + key + '/' + myID).set(true);
            if (typeof _toast === 'function') _toast('🔐 Vous trouvez une porte secrète !', 'success');
            _logDonjon(`🔐 ${p.nom} découvre une porte secrète par fouille.`);
            trouve = true;
        }
    }
    if (!trouve) {
        if (typeof _toast === 'function') _toast('🔍 Rien de remarquable ici.', 'info');
    }
    _avancerTourDonjon(data);
}

/** Modal quand le joueur essaie de marcher sur un piège détecté. */
function _afficherModalPiegeDetecte(cellKey, event, moveParams, myID, data) {
    let modal = document.getElementById('modal-donjon-piege');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-donjon-piege';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }
    const desc       = event.data?.description || 'Piège !';
    const desarm     = window.perso?.compInvesties?.desamorcage || 0;
    const aDeclencheurModal = (window.perso?.inventaire || []).some(i => i.id === 'TEC14');
    const chanceDesarm = Math.min(95, desarm * 15 + 10 + (aDeclencheurModal ? 15 : 0));
    const partage    = !!(data.pieges_partages?.[cellKey]);

    modal.innerHTML = `
        <div style="background:#1a0d0d;border:2px solid #ff4444;border-radius:10px;padding:20px;max-width:340px;width:90%;">
            <h3 style="color:#ff4444;margin:0 0 8px;">🪤 Piège détecté !</h3>
            <p style="color:#ccc;font-size:0.85em;margin:0 0 12px;">${desc}</p>
            <div style="display:flex;flex-direction:column;gap:8px;">
                <button onclick="_desarmorcer('${cellKey}')" style="background:#0d1a0d;color:#4caf50;border:1px solid #2a5a2a;padding:9px 12px;border-radius:5px;cursor:pointer;text-align:left;">
                    🔧 Tenter de désamorcer
                    <span style="color:#666;font-size:0.8em;display:block;">Chance : ${chanceDesarm}%${desarm === 0 ? ' (sans compétence)' : ''}${aDeclencheurModal ? ' · 🔩 +15 (déclencheur)' : ''} · Éch. crit. : explosion !</span>
                </button>
                <button onclick="_passerSurPiege('${cellKey}',${moveParams.nx},${moveParams.ny},'${myID}')" style="background:#2a0d0d;color:#ff9800;border:1px solid #5a2a0d;padding:9px 12px;border-radius:5px;cursor:pointer;text-align:left;">
                    ⚡ Traverser quand même
                    <span style="color:#666;font-size:0.8em;display:block;">Le piège se déclenchera !</span>
                </button>
                ${!partage ? `<button onclick="_partagerLocalisationPiege('${cellKey}')" style="background:#0d0d2a;color:#9c7fd4;border:1px solid #5c3a9d;padding:9px 12px;border-radius:5px;cursor:pointer;text-align:left;">
                    📍 Partager la localisation
                    <span style="color:#666;font-size:0.8em;display:block;">Tous les joueurs verront ce piège.</span>
                </button>` : '<div style="color:#666;font-size:0.8em;">📍 Localisation déjà partagée.</div>'}
            </div>
            <button onclick="document.getElementById('modal-donjon-piege').remove()" style="width:100%;background:#222;color:#666;border:1px solid #444;padding:7px;border-radius:4px;cursor:pointer;margin-top:10px;">Rester sur place</button>
        </div>`;
    modal.style.display = 'flex';
}

/** Passe sur le piège en sachant ce que c'est. */
function _passerSurPiege(cellKey, nx, ny, myID) {
    document.getElementById('modal-donjon-piege')?.remove();
    const data = window.donjonActif;
    if (!data) return;
    db.ref('parties/' + sessionActuelle + '/donjon_actif/positions/' + myID).set({ x: nx, y: ny });
    const cell = data.grille?.[cellKey];
    if (cell?.event) _declencherEvenementDonjon(cellKey, cell.event, myID);
    _avancerTourDonjon(data);
}

/** Tente de désamorcer un piège. */
function _desarmorcer(cellKey) {
    document.getElementById('modal-donjon-piege')?.remove();
    const p    = window.perso;
    const nom  = p?.nom || '?';
    const myID = (p?.nom || '').replace(/\s+/g, '_');
    const data = window.donjonActif;
    if (!data || !p) return;

    const desarm      = p.compInvesties?.desamorcage || 0;
    const rangDesarm  = _getRang('desamorcage', p);
    const bonusDesarm = rangDesarm >= 1 ? 5 : 0;
    const aDeclencheur = (p.inventaire || []).some(i => i.id === 'TEC14');
    const bonusTEC14   = aDeclencheur ? 15 : 0;
    const cell        = data.grille?.[cellKey];
    const difficulte  = cell?.event?.data?.difficulte ?? 50;
    const chanceBase  = Math.min(95, desarm * 15 + 10 + bonusTEC14 + bonusDesarm);
    const chanceFinale = Math.max(5, chanceBase - Math.floor((difficulte - 50) / 2));
    const roll        = Math.floor(Math.random() * 100) + 1;

    if (roll >= 96) {
        // Échec critique : le piège explose sur le joueur
        if (typeof _toast === 'function') _toast('💥 Échec critique ! Le piège explose !', 'error');
        _logDonjon(`💥 ${nom} : échec critique lors du désarmorcage — piège déclenché !`);
        if (cell?.event) _declencherEvenementDonjon(cellKey, cell.event, myID);
    } else if (roll <= Math.max(1, Math.floor(chanceFinale / (rangDesarm >= 2 ? 4 : 5)))) {
        // Succès critique : composants récupérés (réels IDs)
        const POOL_COMPOSANTS = ['COMP01','COMP26','COMP27'];
        if (aDeclencheur) POOL_COMPOSANTS.push('COMP26','COMP27'); // plus de chances avec déclencheur
        const itemsGagnes = POOL_COMPOSANTS.filter(() => Math.random() > 0.4);
        if (typeof _toast === 'function') _toast(`🌟 Désarmorcage parfait ! Vous récupérez des composants.`, 'success');
        _logDonjon(`🌟 ${nom} désamorce parfaitement le piège et récupère des composants.`);
        if (typeof _incStatPartie === 'function') _incStatPartie('pieges_desamorces', 1);
        itemsGagnes.forEach(id => {
            if (typeof itemsData !== 'undefined' && itemsData[id] && p.inventaire) {
                const idx = p.inventaire.findIndex(i => i.id === id);
                if (idx !== -1) p.inventaire[idx].quantite = (p.inventaire[idx].quantite || 1) + 1;
                else p.inventaire.push({ id, quantite: 1 });
            }
        });
        db.ref('parties/' + sessionActuelle + '/donjon_actif/grille/' + cellKey + '/event/declenche').set(true);
        if (typeof autoSave === 'function') autoSave();
    } else if (roll <= chanceFinale) {
        // Succès : piège désarmorcé
        if (typeof _toast === 'function') _toast(`✅ Piège désarmorcé ! (${roll}/${chanceFinale}%)`, 'success');
        _logDonjon(`✅ ${nom} désamorce le piège (${roll}/${chanceFinale}%).`);
        if (typeof _incStatPartie === 'function') _incStatPartie('pieges_desamorces', 1);
        db.ref('parties/' + sessionActuelle + '/donjon_actif/grille/' + cellKey + '/event/declenche').set(true);
    } else {
        // Maître : seconde chance
        if (rangDesarm >= 3) {
            const roll2 = Math.floor(Math.random() * 100) + 1;
            if (roll2 <= chanceFinale) {
                if (typeof _toast === 'function') _toast(`✅ Maître Désamorçage — 2e chance réussie ! (${roll2}/${chanceFinale}%)`, 'success');
                _logDonjon(`✅ ${nom} désamorce le piège à la 2e chance (${roll2}/${chanceFinale}%).`);
                if (typeof _incStatPartie === 'function') _incStatPartie('pieges_desamorces', 1);
                db.ref('parties/' + sessionActuelle + '/donjon_actif/grille/' + cellKey + '/event/declenche').set(true);
            } else {
                if (typeof _toast === 'function') _toast(`❌ Désarmorcage échoué (${roll}/${chanceFinale}%).`, 'error');
                _logDonjon(`❌ ${nom} échoue à désamorcer le piège (${roll}/${chanceFinale}%).`);
            }
        } else {
            // Échec : rien ne se passe, tour perdu
            if (typeof _toast === 'function') _toast(`❌ Désarmorcage échoué (${roll}/${chanceFinale}%).`, 'error');
            _logDonjon(`❌ ${nom} échoue à désamorcer le piège (${roll}/${chanceFinale}%).`);
        }
    }

    _avancerTourDonjon(data);
}

/** Partage la localisation d'un piège à tous les joueurs. */
function _partagerLocalisationPiege(cellKey) {
    document.getElementById('modal-donjon-piege')?.remove();
    db.ref('parties/' + sessionActuelle + '/donjon_actif/pieges_partages/' + cellKey).set(true);
    if (typeof _toast === 'function') _toast('📍 Localisation du piège partagée !', 'success');
    _logDonjon(`📍 ${window.perso?.nom} partage la localisation d'un piège.`);
}

// ── Événements ───────────────────────────────────────────────

function _declencherEvenementDonjon(cellKey, event, myID) {
    const type = event.type;
    const nom  = window.perso?.nom || '?';

    // Le coffre gère son propre cycle (verrouillé / cassé / ouvert)
    if (type === 'coffre') {
        _initCoffreDonjon(cellKey, event);
        return;
    }

    // Tous les autres types : marquer comme déclenché (sauf découvertes visibles → re-déclenchables)
    if (!(type === 'decouverte' && event.visible)) {
        db.ref('parties/' + sessionActuelle + '/donjon_actif/grille/' + cellKey + '/event/declenche').set(true);
    }

    if (type === 'piege') {
        const degats    = event.data?.degats    || 5;
        const typeDegat = event.data?.type_degat || 'normal';
        const desc      = event.data?.description || 'Piège !';

        const emojiDegat = { poison: '☠️', feu: '🔥', elec: '⚡', normal: '🪤' }[typeDegat] || '🪤';
        if (typeof _toast === 'function') _toast(`${emojiDegat} ${desc} — −${degats} PV !`, 'error');
        _logDonjon(`${emojiDegat} ${nom} déclenche un piège [${typeDegat}] — −${degats} PV.`);

        // Dégâts PV directs
        db.ref('parties/' + sessionActuelle + '/joueurs/' + myID + '/modif_stat').set({
            stat: 'PV', valeur: -degats, timestamp: Date.now()
        });

        // Effets secondaires selon le type
        if (typeDegat === 'poison') {
            const pvPoison = Math.max(1, Math.floor(degats / 2));
            db.ref('parties/' + sessionActuelle + '/joueurs/' + myID + '/effets/poison').set({
                degats: pvPoison,
                duree: 3,
                timestamp: Date.now()
            });
            if (typeof _toast === 'function') _toast('☠️ Vous êtes empoisonné ! (−' + pvPoison + ' PV/tour × 3 tours)', 'error');
            _logDonjon(`☠️ ${nom} est empoisonné (${pvPoison} PV/tour pendant 3 tours).`);

        } else if (typeDegat === 'elec') {
            db.ref('parties/' + sessionActuelle + '/joueurs/' + myID + '/effets/etourdi').set({
                duree: 1,
                timestamp: Date.now()
            });
            if (typeof _toast === 'function') _toast('⚡ Choc électrique ! Vous êtes étourdi pour 1 tour.', 'error');
            _logDonjon(`⚡ ${nom} est étourdi (saute le prochain tour).`);

        } else if (typeDegat === 'feu') {
            // Feu : dégâts majorés — les brûlures comptent double
            const brulures = Math.max(1, Math.floor(degats / 2));
            db.ref('parties/' + sessionActuelle + '/joueurs/' + myID + '/modif_stat').set({
                stat: 'PV', valeur: -brulures, timestamp: Date.now() + 1
            });
            if (typeof _toast === 'function') _toast('🔥 Vous brûlez ! Dégâts supplémentaires de brûlure (−' + brulures + ' PV).', 'error');
            _logDonjon(`🔥 ${nom} brûle — dégâts de brûlure supplémentaires (${brulures} PV).`);
        }

    } else if (type === 'coffre') {
        _initCoffreDonjon(cellKey, event);
        return; // gestion async, pas de marquage immédiat

    } else if (type === 'decouverte') {
        const texte = event.data?.texte || 'Découverte !';
        const emoji = event.data?.emoji || '🔎';
        if (typeof _toast === 'function') _toast(`${emoji} ${texte.split('\n')[0]}`, 'info');
        _logDonjon(`${emoji} ${nom} découvre : ${texte.split('\n')[0]}`);
        _afficherDecouverteDonjon(texte, emoji);

    } else if (type === 'rencontre') {
        const desc = event.data?.description || 'Des ennemis apparaissent !';
        if (typeof _toast === 'function') _toast(`👹 ${desc}`, 'error');
        _logDonjon(`👹 ${nom} déclenche une rencontre : ${desc}`);
        // Mettre le jeu en pause et notifier le MJ via Firebase
        const refDonjon = db.ref('parties/' + sessionActuelle + '/donjon_actif');
        refDonjon.child('pause').set(true);
        refDonjon.child('rencontre_en_attente').set({
            cellKey,
            ennemisKeys: event.data?.ennemisKeys || [],
            description: desc,
            declenchePar: nom,
            timestamp: Date.now()
        });

    } else if (type === 'porte') {
        _logDonjon(`🚪 ${nom} passe une porte.`);

    } else if (type === 'pnj') {
        const pnjNom = event.data?.nom || 'Personnage mystérieux';
        if (typeof _toast === 'function') _toast(`${event.data?.emoji || '🧙'} ${pnjNom} vous interpelle…`, 'info');
        _logDonjon(`🧙 ${nom} rencontre ${pnjNom}.`);
        _afficherModalPNJ(cellKey, event);

    } else if (type === 'autel') {
        const dejàUtilise = window.donjonActif?.autels_utilises?.[cellKey]?.[myID];
        if (dejàUtilise) {
            if (typeof _toast === 'function') _toast('⛩ L\'autel ne répond plus à votre prière.', 'info');
            return;
        }
        // Ne pas marquer declenche — l'autel reste actif pour les autres joueurs
        db.ref('parties/' + sessionActuelle + '/donjon_actif/grille/' + cellKey + '/event/declenche').set(false);
        _afficherModalAutel(cellKey, event, myID);
    }
}

// ── Piège sur coffre / porte ─────────────────────────────────

/**
 * Vérifie si un coffre ou une porte a un piège non déclenché.
 * Si oui, affiche un modal : désamorcer / ouvrir quand même.
 * Appelle onContinue() si le joueur choisit de continuer sans piège.
 */
function _verifierPiegeObjet(cellKey, piege, targetLabel, onContinue) {
    const p      = window.perso;
    const myID   = (p?.nom || '').replace(/\s+/g, '_');
    const desarm = p?.compInvesties?.desamorcage || 0;
    const detect = p?.compInvesties?.detection_piege || 0;

    // Si déjà détecté passivement → aller directement au modal
    const dejaDetecte = !!(window.donjonActif?.pieges_detectes?.[cellKey]?.[myID]);
    if (!dejaDetecte) {
        // Roll au moment de l'interaction si pas déjà détecté
        const chanceDetect = detect > 0
            ? Math.max(5, Math.min(95, detect * 5 + 10) - Math.floor((piege.difficulte - 50) / 2))
            : 10;
        const detecte = (Math.floor(Math.random() * 100) + 1) <= chanceDetect;
        if (!detecte) {
            _declencherPiegeObjet(cellKey, piege, myID);
            onContinue();
            return;
        }
    }

    // Détecté → modal
    const chanceDesarm = desarm > 0
        ? Math.max(5, Math.min(95, desarm * 15 + 10) - Math.floor((piege.difficulte - 50) / 2))
        : 0;

    let modal = document.getElementById('modal-donjon-piege-objet');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-donjon-piege-objet';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }

    const emojiTarget = targetLabel === 'coffre' ? '📦' : '🚪';
    modal.innerHTML = `
        <div style="background:#1a0d0d;border:2px solid #ff4444;border-radius:10px;padding:20px;max-width:340px;width:90%;">
            <h3 style="color:#ff4444;margin:0 0 8px;">🪤 ${emojiTarget} Piège détecté !</h3>
            <p style="color:#ccc;font-size:0.85em;margin:0 0 12px;">Ce ${targetLabel} est piégé (diff. ${piege.difficulte}).</p>
            <div style="display:flex;flex-direction:column;gap:8px;">
                ${desarm > 0 ? `<button onclick="_desarmorcer_objet('${cellKey}')" style="background:#0d1a0d;color:#4caf50;border:1px solid #2a5a2a;padding:9px 12px;border-radius:5px;cursor:pointer;text-align:left;">
                    🔧 Désamorcer
                    <span style="color:#666;font-size:0.8em;display:block;">Chance : ${chanceDesarm}% · Éch. crit. : explose !</span>
                </button>` : ''}
                <button onclick="_ouvrirMalgre_piege('${cellKey}')" style="background:#2a0d0d;color:#ff9800;border:1px solid #5a2a0d;padding:9px 12px;border-radius:5px;cursor:pointer;text-align:left;">
                    ⚡ Ouvrir quand même
                    <span style="color:#666;font-size:0.8em;display:block;">Le piège se déclenchera !</span>
                </button>
            </div>
            <button onclick="document.getElementById('modal-donjon-piege-objet').remove()" style="width:100%;background:#222;color:#666;border:1px solid #444;padding:7px;border-radius:4px;cursor:pointer;margin-top:10px;">Annuler</button>
        </div>`;
    modal.style.display = 'flex';

    // Stocker le callback pour "ouvrir quand même"
    window._piegeObjetCallback = { cellKey, piege, onContinue };
}

/** Déclenche les effets d'un piège sur coffre/porte. */
function _declencherPiegeObjet(cellKey, piege, myID) {
    const p         = window.perso;
    const nom       = p?.nom || '?';
    const degats    = piege.degats || 5;
    const typeDegat = piege.type_degat || 'normal';
    const emoji     = { poison: '☠️', feu: '🔥', elec: '⚡', normal: '🪤' }[typeDegat] || '🪤';

    if (typeof _toast === 'function') _toast(`${emoji} Piège ! −${degats} PV !`, 'error');
    _logDonjon(`${emoji} ${nom} déclenche un piège [${typeDegat}] sur un objet — −${degats} PV.`);

    db.ref('parties/' + sessionActuelle + '/joueurs/' + myID + '/modif_stat').set({
        stat: 'PV', valeur: -degats, timestamp: Date.now()
    });

    if (typeDegat === 'poison') {
        const pvP = Math.max(1, Math.floor(degats / 2));
        db.ref('parties/' + sessionActuelle + '/joueurs/' + myID + '/effets/poison').set({ degats: pvP, duree: 3, timestamp: Date.now() });
        if (typeof _toast === 'function') _toast(`☠️ Empoisonné ! (−${pvP} PV/tour × 3 tours)`, 'error');
    } else if (typeDegat === 'elec') {
        db.ref('parties/' + sessionActuelle + '/joueurs/' + myID + '/effets/etourdi').set({ duree: 1, timestamp: Date.now() });
        if (typeof _toast === 'function') _toast('⚡ Étourdi pour 1 tour !', 'error');
    } else if (typeDegat === 'feu') {
        const brulures = Math.max(1, Math.floor(degats / 2));
        db.ref('parties/' + sessionActuelle + '/joueurs/' + myID + '/modif_stat').set({ stat: 'PV', valeur: -brulures, timestamp: Date.now() + 1 });
        if (typeof _toast === 'function') _toast(`🔥 Brûlures ! −${brulures} PV supplémentaires.`, 'error');
    }

    // Marquer le piège comme déclenché dans Firebase
    db.ref('parties/' + sessionActuelle + '/donjon_actif/grille/' + cellKey + '/event/data/piege/declenche').set(true);
}

/** Tente de désamorcer le piège d'un coffre/porte. */
function _desarmorcer_objet(cellKey) {
    document.getElementById('modal-donjon-piege-objet')?.remove();
    const ctx  = window._piegeObjetCallback;
    if (!ctx) return;
    const p    = window.perso;
    const myID = (p?.nom || '').replace(/\s+/g, '_');
    const desarm      = p?.compInvesties?.desamorcage || 0;
    const rangDesarmO = _getRang('desamorcage', p);
    const bonusDesarmO = rangDesarmO >= 1 ? 5 : 0;
    const piege  = ctx.piege;
    const chanceBase   = Math.min(95, desarm * 15 + 10 + bonusDesarmO);
    const chanceFinale = Math.max(5, chanceBase - Math.floor((piege.difficulte - 50) / 2));
    const roll = Math.floor(Math.random() * 100) + 1;

    if (roll >= 96) {
        if (typeof _toast === 'function') _toast('💥 Échec critique ! Le piège explose !', 'error');
        _logDonjon(`💥 ${p.nom} : échec critique désarmorcage objet !`);
        _declencherPiegeObjet(cellKey, piege, myID);
        ctx.onContinue();
    } else if (roll <= chanceFinale) {
        if (typeof _toast === 'function') _toast(`✅ Piège désamorcé ! (${roll}/${chanceFinale}%)`, 'success');
        _logDonjon(`✅ ${p.nom} désamorce le piège sur un objet.`);
        db.ref('parties/' + sessionActuelle + '/donjon_actif/grille/' + cellKey + '/event/data/piege/declenche').set(true);
        ctx.onContinue();
    } else if (rangDesarmO >= 3) {
        // Maître : seconde chance
        const roll2 = Math.floor(Math.random() * 100) + 1;
        if (roll2 <= chanceFinale) {
            if (typeof _toast === 'function') _toast(`✅ Maître — 2e chance réussie ! (${roll2}/${chanceFinale}%)`, 'success');
            _logDonjon(`✅ ${p.nom} désamorce l'objet à la 2e chance.`);
            db.ref('parties/' + sessionActuelle + '/donjon_actif/grille/' + cellKey + '/event/data/piege/declenche').set(true);
            ctx.onContinue();
        } else {
            if (typeof _toast === 'function') _toast(`❌ Désarmorcage échoué (${roll}/${chanceFinale}%).`, 'error');
            _logDonjon(`❌ ${p.nom} échoue à désamorcer l'objet (${roll}/${chanceFinale}%).`);
        }
    } else {
        if (typeof _toast === 'function') _toast(`❌ Désarmorcage échoué (${roll}/${chanceFinale}%).`, 'error');
        _logDonjon(`❌ ${p.nom} échoue à désamorcer l'objet (${roll}/${chanceFinale}%).`);
    }
    _avancerTourDonjon(window.donjonActif);
}

/** Ouvre malgré le piège détecté (déclenche et continue). */
function _ouvrirMalgre_piege(cellKey) {
    document.getElementById('modal-donjon-piege-objet')?.remove();
    const ctx  = window._piegeObjetCallback;
    if (!ctx) return;
    const myID = (window.perso?.nom || '').replace(/\s+/g, '_');
    _declencherPiegeObjet(cellKey, ctx.piege, myID);
    ctx.onContinue();
}

// ── Coffre (verrou + durabilité) ─────────────────────────────

/**
 * Première interaction avec un coffre.
 * Initialise l'état dans Firebase si pas encore fait, puis ouvre le modal.
 */
function _initCoffreDonjon(cellKey, eventData) {
    // Vérifier piège non déclenché avant toute interaction
    const piege = eventData.data?.piege;
    if (piege && !piege.declenche) {
        _verifierPiegeObjet(cellKey, piege, 'coffre', () => _initCoffreDonjon_suite(cellKey, eventData));
        return;
    }
    _initCoffreDonjon_suite(cellKey, eventData);
}

function _initCoffreDonjon_suite(cellKey, eventData) {
    const ref = db.ref('parties/' + sessionActuelle + '/donjon_actif/etats_coffres/' + cellKey);
    ref.once('value', snap => {
        if (snap.val()) {
            window._donjonCoffreCtx = { data: window.donjonActif };
            _afficherModalCoffre(cellKey, snap.val());
            return;
        }
        // Première fois : rouler le verrou, générer le loot (1 slot par joueur)
        const probVerrou    = eventData.data?.probVerrou ?? 30;
        const durabiliteMax = Math.max(1, eventData.data?.durabilite || 20);
        const verrouille    = Math.random() * 100 < probVerrou;
        const positions     = window.donjonActif?.positions || {};
        const nbJoueurs     = Object.keys(positions).filter(id => !id.startsWith('cmp_')).length;
        const loot          = _genererLootCoffre(nbJoueurs, eventData.data?.items, eventData.data?.or);

        const etat = {
            verrouille,
            durabilite:    verrouille ? durabiliteMax : 0,
            durabiliteMax: durabiliteMax,
            statut:        verrouille ? 'verrouille' : 'ouvert',
            variante:      eventData.data?.variante || 'coffre',
            loot
        };

        window._donjonCoffreCtx = { data: window.donjonActif };
        ref.set(etat).then(() => {
            if (!verrouille) {
                _logDonjon(`📦 ${window.perso?.nom} ouvre un coffre.`);
                if (typeof _toast === 'function') _toast('📦 Coffre ouvert !', 'success');
            } else {
                _logDonjon(`🔒 ${window.perso?.nom} découvre un coffre verrouillé.`);
                if (typeof _toast === 'function') _toast('🔒 Coffre verrouillé !', 'error');
            }
            _afficherModalCoffre(cellKey, etat);
        });
    });
}

const _VARIANTES_COFFRE = {
    tonneau:  { emoji: '🪣', label: 'Tonneau' },
    coffre:   { emoji: '📦', label: 'Coffre' },
    magique:  { emoji: '✨', label: 'Coffre magique' },
};
function _emojicoffre(variante) {
    return (_VARIANTES_COFFRE[variante] || _VARIANTES_COFFRE.coffre).emoji;
}
function _labelcoffre(variante) {
    return (_VARIANTES_COFFRE[variante] || _VARIANTES_COFFRE.coffre).label;
}

/**
 * Génère le loot d'un coffre.
 * Si itemsFixe est fourni, utilise ces items (coffre pré-défini dans le preset).
 * Sinon, génère aléatoirement un slot par joueur.
 * Structure : { slots: { "0": {id,nom,pris_par:null}, ... }, or: N }
 */
function _genererLootCoffre(nbJoueurs, itemsFixe, orFixe) {
    const slots = {};
    if (itemsFixe && itemsFixe.length > 0) {
        itemsFixe.forEach((item, i) => {
            slots[String(i)] = { id: item.id, nom: item.nom, quantite: item.quantite || 1, pris_par: null };
        });
        return { slots, or: orFixe !== undefined ? orFixe : 0 };
    }
    if (typeof itemsData === 'undefined') return { slots: {}, or: 0 };
    const lootables = Object.entries(itemsData).filter(([, v]) => v.lootable);
    const nb = Math.max(1, nbJoueurs || 1);
    for (let i = 0; i < nb; i++) {
        if (lootables.length === 0) break;
        const [id, item] = lootables[Math.floor(Math.random() * lootables.length)];
        slots[String(i)] = { id, nom: item.nom, quantite: 1, pris_par: null };
    }
    const or = orFixe !== undefined ? orFixe : Math.floor(Math.random() * 50) + 10;
    return { slots, or };
}

/** Retourne l'arme équipée en mêlée (slot main_droite / deux_mains / main_gauche) ou null. */
/**
 * Retourne { slotNom, slotObj, def } pour l'arme équipée en mêlée,
 * ou null si aucune arme avec des dégâts n'est portée.
 */
function _getArmeEquipeeDonjon() {
    if (!window.perso || typeof itemsData === 'undefined') return null;
    const eq = window.perso.equipement || {};
    const slotNom = eq.main_droite ? 'main_droite' : eq.deux_mains ? 'deux_mains' : eq.main_gauche ? 'main_gauche' : null;
    if (!slotNom) return null;
    const slotObj = eq[slotNom];
    const def = itemsData[slotObj?.id];
    return (def && def.degats) ? { slotNom, slotObj, def } : null;
}

// ── Calcul de coup (crits) ───────────────────────────────────

/**
 * Calcule un coup sur coffre/porte.
 * Retourne { roll, baseChance, resultat, dmg }
 * resultat : 'succes_critique' | 'succes' | 'echec' | 'echec_critique'
 */
function _calculerCoupDonjon(armeInfo) {
    const p = window.perso;
    const FO = (p?.statsBase?.FO || 5) + (p?.statsInvesties?.FO || 0);
    const baseChance = Math.min(90, FO * 5);
    const roll = Math.floor(Math.random() * 100) + 1;
    let dmgBase;
    if (armeInfo) {
        const parts = String(armeInfo.def.degats).split('-');
        const dMin  = parseInt(parts[0]) || 1;
        const dMax  = parseInt(parts[parts.length - 1]) || 3;
        dmgBase = dMin + Math.floor(Math.random() * (dMax - dMin + 1));
    } else {
        dmgBase = Math.floor(Math.random() * 3) + 1;
    }
    let resultat, dmg;
    if (roll >= 96) {
        resultat = 'echec_critique'; dmg = 0;
    } else if (roll <= Math.max(1, Math.floor(baseChance / 5))) {
        resultat = 'succes_critique'; dmg = dmgBase * 2;
    } else if (roll <= baseChance) {
        resultat = 'succes'; dmg = dmgBase;
    } else {
        resultat = 'echec'; dmg = 0;
    }
    return { roll, baseChance, resultat, dmg };
}

// ── Items/sorts explosifs sur coffre/porte ───────────────────

/** Retourne les items de l'inventaire utilisables sur coffre/porte (explosifs, projectiles). */
function _getItemsExplosifsDonjon() {
    const p = window.perso;
    if (!p || typeof itemsData === 'undefined') return [];
    return (p.inventaire || []).filter(item => {
        if (!item || item.quantite <= 0) return false;
        const def = itemsData[item.id];
        return def && (def.explosion || def.degatsZone || (def.degats && !def.melee && def.consommable));
    }).map(item => ({ ...item, def: itemsData[item.id] }));
}

/** Retourne les sorts offensifs investis (avec dégâts). */
function _getSortsOffensifsInvestis() {
    const p = window.perso;
    if (!p || typeof magieData === 'undefined') return [];
    const magieInv = p.magieInvesties || {};
    const sorts = [];
    Object.entries(magieData).forEach(([ecole, ecoleData]) => {
        const niveauEcole = magieInv[ecole] || 0;
        if (!niveauEcole) return;
        (ecoleData.sorts || []).forEach(s => {
            if (s.degats && s.niv <= niveauEcole && !sorts.find(x => x.nom === s.nom)) {
                sorts.push({ ...s, ecole });
            }
        });
    });
    return sorts;
}

/**
 * Ouvre une modale pour choisir item/sort explosif, puis applique les dégâts à la cible.
 * targetType : 'coffre' | 'porte'
 */
function _ouvrirModalExplosifSurTarget(cellKey, targetType) {
    const SORTS_DESTRUCTEURS = ['Projectile de pierre', 'Boule de feu', 'Fureur de glace', 'Désintégration'];
    const items = _getItemsExplosifsDonjon();
    const sorts = _getSortsOffensifsInvestis().filter(s => SORTS_DESTRUCTEURS.includes(s.nom));
    if (items.length === 0 && sorts.length === 0) {
        if (typeof _toast === 'function') _toast('Aucun item ou sort offensif disponible.', 'error');
        return;
    }

    let modal = document.getElementById('modal-donjon-explosif');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-donjon-explosif';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:10000;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }
    const btn = 'width:100%;background:#1a0d0d;color:#ff9800;border:1px solid #5a2a0d;padding:8px 12px;border-radius:5px;cursor:pointer;text-align:left;margin-bottom:5px;';
    let corps = '<div style="display:flex;flex-direction:column;gap:5px;">';
    items.forEach(item => {
        const dmgStr = item.def.degatsZone || item.def.degats || '?';
        corps += `<button onclick="_appliquerExplosifSurTarget('${cellKey}','${targetType}','item','${item.id}')" style="${btn}">
            💣 ${item.def.nom} ×${item.quantite} <span style="color:#666;font-size:0.8em;">Dégâts : ${dmgStr}</span>
        </button>`;
    });
    sorts.forEach(s => {
        corps += `<button onclick="_appliquerExplosifSurTarget('${cellKey}','${targetType}','sort','${s.nom}')" style="${btn}">
            🔥 ${s.nom} <span style="color:#666;font-size:0.8em;">Dégâts : ${s.degats}${s.cout ? ` · −${s.cout} FT` : ''}</span>
        </button>`;
    });
    corps += '</div>';

    modal.innerHTML = `
        <div style="background:#1a0d0d;border:2px solid #ff6b00;border-radius:10px;padding:20px;max-width:340px;width:90%;">
            <h3 style="color:#ff9800;margin:0 0 12px;">💥 Utiliser sur la ${targetType}</h3>
            ${corps}
            <button onclick="document.getElementById('modal-donjon-explosif').remove()" style="width:100%;background:#222;color:#666;border:1px solid #444;padding:7px;border-radius:4px;cursor:pointer;margin-top:8px;">Annuler</button>
        </div>`;
    modal.style.display = 'flex';
}

/** Applique les dégâts d'un item/sort à un coffre ou une porte. */
function _appliquerExplosifSurTarget(cellKey, targetType, sourceType, sourceId) {
    document.getElementById('modal-donjon-explosif')?.remove();
    document.getElementById('modal-donjon-coffre')?.remove();
    document.getElementById('modal-donjon-porte')?.remove();

    const p   = window.perso;
    const nom = p?.nom || '?';
    let dmg   = 0;
    let label = '';

    if (sourceType === 'item') {
        const def = typeof itemsData !== 'undefined' ? itemsData[sourceId] : null;
        if (!def) return;
        const dmgStr = def.degatsZone || def.degats || '5';
        const parts  = String(dmgStr).split('-');
        const dMin   = parseInt(parts[0]) || 1;
        const dMax   = parseInt(parts[parts.length - 1]) || dMin;
        dmg = dMin + Math.floor(Math.random() * (dMax - dMin + 1));
        label = def.nom;
        // Consommer l'item
        const idx = (p?.inventaire || []).findIndex(i => i.id === sourceId && i.quantite > 0);
        if (idx !== -1) {
            p.inventaire[idx].quantite--;
            if (p.inventaire[idx].quantite <= 0) p.inventaire.splice(idx, 1);
            if (typeof autoSave === 'function') autoSave();
        }
    } else if (sourceType === 'sort') {
        let sort = null;
        if (typeof magieData !== 'undefined') {
            Object.values(magieData).forEach(ec => ec.sorts?.forEach(s => { if (s.nom === sourceId) sort = s; }));
        }
        if (!sort) return;
        const ftCost = sort.cout || 0;
        if (ftCost > 0 && (p?.ftActuel || 0) < ftCost) {
            if (typeof _toast === 'function') _toast(`Pas assez de FT (${p.ftActuel}/${ftCost}).`, 'error');
            return;
        }
        if (ftCost > 0 && p) p.ftActuel = Math.max(0, (p.ftActuel || 0) - ftCost);
        const parts = String(sort.degats).split('-');
        const dMin  = parseInt(parts[0]) || 1;
        const dMax  = parseInt(parts[parts.length - 1]) || dMin;
        dmg   = dMin + Math.floor(Math.random() * (dMax - dMin + 1));
        label = sort.nom;
        if (typeof autoSave === 'function') autoSave();
    }

    if (dmg <= 0) return;
    _logDonjon(`💥 ${nom} utilise ${label} sur la ${targetType} (−${dmg} durabilité).`);
    if (typeof _toast === 'function') _toast(`💥 ${label} : −${dmg} durabilité !`, 'success');

    const refPath = targetType === 'coffre'
        ? 'parties/' + sessionActuelle + '/donjon_actif/etats_coffres/' + cellKey
        : 'parties/' + sessionActuelle + '/donjon_actif/etats_portes/' + cellKey;

    const ref = db.ref(refPath);
    ref.once('value', snap => {
        const etat = snap.val();
        if (!etat) return;
        const nouvDura = Math.max(0, etat.durabilite - dmg);
        if (nouvDura <= 0) {
            const nouveauStatut = targetType === 'coffre' ? 'casse' : 'cassee';
            if (typeof _toast === 'function') _toast(`💥 La ${targetType} est détruite !`, 'success');
            ref.update({ durabilite: 0, statut: nouveauStatut }).then(() => {
                db.ref('parties/' + sessionActuelle + '/donjon_actif/grille/' + cellKey + '/event/declenche').set(true);
                ref.once('value', s => {
                    if (targetType === 'coffre') _afficherModalCoffre(cellKey, s.val());
                    // porte : passage libre au prochain tour
                });
            });
        } else {
            ref.update({ durabilite: nouvDura }).then(() => {
                ref.once('value', s => {
                    if (targetType === 'coffre') _afficherModalCoffre(cellKey, s.val());
                    else _afficherModalPorte(cellKey, s.val());
                });
            });
        }
    });

    const data = window.donjonActif;
    if (data) _avancerTourDonjon(data);
}

/** Affiche le modal d'interaction avec le coffre (ouvert, verrouillé, cassé). */
function _afficherModalCoffre(cellKey, etat) {
    let modal = document.getElementById('modal-donjon-coffre');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-donjon-coffre';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }

    const myID  = (window.perso?.nom || '').replace(/\s+/g, '_');
    const ouvert = etat.statut === 'ouvert' || etat.statut === 'casse';
    const variante = etat.variante;
    const emojiV = _emojicoffre(variante, false);
    const labelV = _labelcoffre(variante);
    let header, corps;

    if (ouvert) {
        header = etat.statut === 'casse' ? `${emojiV}💥 ${labelV} fracassé` : `${emojiV} ${labelV} ouvert`;

        // Round-robin : un joueur peut prendre son (N+1)ème objet seulement si
        // tous les autres ont déjà pris au moins N objets.
        const positions = window.donjonActif?.positions || {};
        const joueurs = Object.keys(positions).filter(id => !id.startsWith('cmp_'));
        const myCount = etat.pris_par?.[myID] || 0;
        const autresMin = joueurs.length <= 1
            ? myCount
            : joueurs.filter(id => id !== myID)
                     .reduce((min, id) => Math.min(min, etat.pris_par?.[id] || 0), Infinity);
        const peutPrendre = autresMin >= myCount;

        const slots  = etat.loot?.slots || {};
        const orVal  = etat.loot?.or || 0;
        const orPris = !!(etat.or_pris?.[myID]);
        const orHtml = orVal > 0 && !orPris
            ? `<div style="color:#f0b429;margin:8px 0;">💰 ${orVal} pièces d'or
                <button onclick="_prendreOrDonjon('${cellKey}')" style="margin-left:8px;background:#2a1a0a;color:#d4af37;border:1px solid #8b6914;padding:2px 8px;border-radius:3px;cursor:pointer;font-size:0.8em;">Prendre</button>
               </div>`
            : orVal > 0 && orPris ? `<div style="color:#555;font-size:0.85em;margin-top:4px;">💰 Or déjà récupéré.</div>` : '';

        const slotsLibres = Object.entries(slots).filter(([, s]) => !s.pris_par);

        if (slotsLibres.length === 0 && orVal === 0) {
            corps = `<div style="color:#666;font-size:0.9em;padding:10px 0;">Le coffre est vide.</div>`;
        } else if (!peutPrendre) {
            const retard = joueurs
                .filter(id => id !== myID && (etat.pris_par?.[id] || 0) < myCount)
                .map(id => id.replace(/_/g, ' ')).join(', ');
            corps = `<div style="color:#aaa;padding:8px 0;">⏳ En attente des autres joueurs pour le tour ${myCount + 1}…<br>
                <span style="color:#666;font-size:0.82em;">${retard} n'${retard.includes(',') ? 'ont' : 'a'} pas encore pris leur objet n° ${myCount}.</span>
            </div>${orHtml}`;
        } else {
            const slotsHtml = Object.entries(slots).map(([slotKey, slot]) => {
                if (slot.pris_par) {
                    return `<li style="color:#555;padding:3px 0;font-size:0.85em;">🎁 ${slot.nom} <em>(pris par ${slot.pris_par.replace(/_/g,' ')})</em></li>`;
                }
                const slotItemDef = typeof itemsData !== 'undefined' ? itemsData[slot.id] : null;
                const slotNonId = slotItemDef?.nonIdentifie;
                const slotNom = slotNonId
                    ? (typeof _nomInconnu === 'function' ? `❓ ${_nomInconnu(slotItemDef)}` : 'Dague non identifiée')
                    : slot.nom;
                const slotColor = slotNonId ? '#ce93d8' : '#ccc';
                const qLabel = (slot.quantite || 1) > 1 ? ` ×${slot.quantite}` : '';
                return `<li style="color:${slotColor};padding:3px 0;">🎁 ${slotNom}${qLabel}
                    <button onclick="_prendreItemDonjon('${cellKey}','${slotKey}')" style="margin-left:8px;background:#2a1a0a;color:#d4af37;border:1px solid #8b6914;padding:2px 8px;border-radius:3px;cursor:pointer;font-size:0.8em;">Prendre</button>
                </li>`;
            }).join('') || '<li style="color:#666;">Vide.</li>';
            corps = `<ul style="list-style:none;padding:0;margin:0 0 6px;">${slotsHtml}</ul>${orHtml}`;
        }

    } else {
        // Coffre verrouillé
        header = `🔒 ${labelV} verrouillé`;
        const DX         = (window.perso?.statsBase?.DX ?? 8) + (window.perso?.statsInvesties?.DX || 0);
        const crochetage = window.perso?.compInvesties?.crochetage || 0;
        const _rCroch = _getRang('crochetage', window.perso);
        const _bCroch = _rCroch >= 3 ? 25 : (_rCroch >= 2 ? 5 : 0);
        const chanceCroch = Math.min(95, DX * 3 + crochetage * 5 + _bCroch);
        const armeInfo   = _getArmeEquipeeDonjon();
        const durCoul    = etat.durabilite > etat.durabiliteMax * 0.5 ? '#4caf50'
                         : etat.durabilite > etat.durabiliteMax * 0.2 ? '#f0b429' : '#ff4444';
        const FO         = (window.perso?.statsBase?.FO || 5) + (window.perso?.statsInvesties?.FO || 0);

        let labelFrapper, sousTitreFrapper;
        if (armeInfo) {
            labelFrapper     = `🪓 Frapper avec ${armeInfo.def.nom}`;
            sousTitreFrapper = `Coup FO ${FO} (base ${Math.min(90,FO*5)}%) · Crit succès : ×2 dégâts · Crit échec : blessure`;
        } else {
            labelFrapper     = '🤛 Frapper à mains nues';
            sousTitreFrapper = `Coup FO ${FO} · Sans arme : vous perdez des PV en cas d'échec`;
        }

        const hasExplosifs = _getItemsExplosifsDonjon().length > 0 || _getSortsOffensifsInvestis().length > 0;

        corps = `
            <div style="color:#aaa;font-size:0.85em;margin-bottom:12px;">
                Durabilité : <strong style="color:${durCoul};">${etat.durabilite} / ${etat.durabiliteMax}</strong>
                <div style="height:6px;background:#222;border-radius:3px;margin-top:4px;overflow:hidden;">
                    <div style="height:100%;width:${Math.round(etat.durabilite/etat.durabiliteMax*100)}%;background:${durCoul};"></div>
                </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px;">
                <button onclick="_crochetageCoffre('${cellKey}')" style="background:#0d1a0d;color:#4caf50;border:1px solid #2a5a2a;padding:9px 12px;border-radius:5px;cursor:pointer;text-align:left;">
                    🔓 Crocheter
                    <span style="color:#666;font-size:0.8em;display:block;">Chance : ${chanceCroch}% (DX ${DX} + crochetage ${crochetage})</span>
                </button>
                <button onclick="_frapperCoffre('${cellKey}')" style="background:#1a0d0d;color:#ff9800;border:1px solid #5a2a0d;padding:9px 12px;border-radius:5px;cursor:pointer;text-align:left;">
                    ${labelFrapper}
                    <span style="color:#666;font-size:0.8em;display:block;">${sousTitreFrapper}</span>
                </button>
                ${hasExplosifs ? `<button onclick="_ouvrirModalExplosifSurTarget('${cellKey}','coffre')" style="background:#1a0d00;color:#ff6b00;border:1px solid #5a3000;padding:9px 12px;border-radius:5px;cursor:pointer;text-align:left;">
                    💥 Utiliser item / sort
                    <span style="color:#666;font-size:0.8em;display:block;">Grenade, dynamite, boule de feu…</span>
                </button>` : ''}
                ${(function(){
                    const _connait = (window.perso?.magieInvesties?.['Déplacement']||0) >= 2;
                    if (!_connait) return '';
                    const _IN = (window.perso?.statsBase?.IN||0)+(window.perso?.statsInvesties?.IN||0);
                    const _ch = Math.min(95, _IN * 5);
                    const _ft = window.perso?.ftActuel || 0;
                    const _peutLancer = _ft >= 5;
                    return `<button onclick="_deverrouillageCofreDonjon('${cellKey}')" ${_peutLancer?'':'disabled'} style="background:#0d0d2a;color:#90caf9;border:1px solid #42a5f5;padding:9px 12px;border-radius:5px;cursor:pointer;text-align:left;${_peutLancer?'':'opacity:0.5;'}">
                        ✨ Déverrouillage
                        <span style="color:#666;font-size:0.8em;display:block;">Chance : ${_ch}% (IN ${_IN}) · Coût : 5 FT</span>
                    </button>`;
                })()}
            </div>`;
    }

    modal.innerHTML = `
        <div style="background:#1a120a;border:2px solid #d4af37;border-radius:10px;padding:20px;max-width:340px;width:90%;">
            <h3 style="color:#d4af37;margin:0 0 12px;">${header}</h3>
            ${corps}
            <button onclick="document.getElementById('modal-donjon-coffre').remove()" style="width:100%;background:#333;color:#aaa;border:1px solid #555;padding:7px;border-radius:4px;cursor:pointer;margin-top:4px;">Fermer</button>
        </div>`;
    modal.style.display = 'flex';
}

/** Tentative de crochetage du coffre. */
function _crochetageCoffre(cellKey) {
    const DX         = (window.perso?.statsBase?.DX ?? 8) + (window.perso?.statsInvesties?.DX || 0);
    const crochetage = window.perso?.compInvesties?.crochetage || 0;
    const rangCroch  = _getRang('crochetage', window.perso);
    const bonusRang  = rangCroch >= 3 ? 25 : (rangCroch >= 2 ? 5 : 0);
    const chance     = Math.min(95, DX * 3 + crochetage * 5 + bonusRang);
    const roll       = Math.floor(Math.random() * 100);
    const ref        = db.ref('parties/' + sessionActuelle + '/donjon_actif/etats_coffres/' + cellKey);
    const nom        = window.perso?.nom || '?';

    document.getElementById('modal-donjon-coffre')?.remove();

    if (roll < chance) {
        if (typeof _toast === 'function') _toast(`🔓 Coffre crocheté ! (${roll}/${chance}%)`, 'success');
        _logDonjon(`🔓 ${nom} crochète un coffre (${roll}/${chance}%).`);
        ref.update({ statut: 'ouvert', verrouille: false }).then(() => {
            db.ref('parties/' + sessionActuelle + '/donjon_actif/grille/' + cellKey + '/event/declenche').set(true);
            ref.once('value', s => _afficherModalCoffre(cellKey, s.val()));
        });
    } else {
        if (typeof _toast === 'function') _toast(`❌ Crochetage échoué (${roll}/${chance}%).`, 'error');
        _logDonjon(`❌ ${nom} échoue à crocheter un coffre (${roll}/${chance}%).`);
    }
    // Apprenti+ : pas de coût de tour sur un échec; sinon avancer le tour
    const data = window.donjonActif;
    if (roll >= chance && rangCroch >= 1) {
        if (typeof _toast === 'function') _toast('🔓 Apprenti — pas de coût de tour.', 'info');
    } else if (data) {
        _avancerTourDonjon(data);
    }
}

/** Frappe le coffre avec calcul de coup (crits inclus). */
function _frapperCoffre(cellKey) {
    const armeInfo = _getArmeEquipeeDonjon();
    const nom      = window.perso?.nom || '?';
    const myID     = (window.perso?.nom || '').replace(/\s+/g, '_');
    const ref      = db.ref('parties/' + sessionActuelle + '/donjon_actif/etats_coffres/' + cellKey);
    const coup     = _calculerCoupDonjon(armeInfo);
    const nomArme  = armeInfo ? armeInfo.def.nom : 'Poings';
    document.getElementById('modal-donjon-coffre')?.remove();

    if (coup.resultat === 'echec_critique') {
        const blessure = Math.floor(Math.random() * 4) + 1;
        if (typeof _toast === 'function') _toast(`💀 Échec critique ! Vous vous blessez (−${blessure} PV) !`, 'error');
        _logDonjon(`💀 ${nom} : échec critique sur le coffre (−${blessure} PV).`);
        db.ref('parties/' + sessionActuelle + '/joueurs/' + myID + '/modif_stat').set({ stat: 'PV', valeur: -blessure, timestamp: Date.now() });
        const data = window.donjonActif;
        if (data) _avancerTourDonjon(data);
        return;
    }
    if (coup.resultat === 'succes_critique') {
        if (typeof _toast === 'function') _toast(`🌟 Coup critique ! ${coup.dmg} dégâts !`, 'success');
    } else if (coup.resultat === 'echec') {
        if (typeof _toast === 'function') _toast(`❌ Coup manqué (${coup.roll}/${coup.baseChance}%).`, 'error');
        const data = window.donjonActif;
        if (data) _avancerTourDonjon(data);
        return;
    }

    // Usure de l'arme / PV mains nues
    if (armeInfo) {
        const perteArme = coup.resultat === 'succes_critique' ? Math.floor(Math.random() * 3) + 3 : Math.floor(Math.random() * 3) + 2;
        const slotObj   = armeInfo.slotObj;
        if (slotObj.durabilite !== undefined) {
            slotObj.durabilite = Math.max(0, (slotObj.durabilite || 0) - perteArme);
            if (typeof _toast === 'function') {
                slotObj.durabilite === 0
                    ? _toast(`🔨 ${nomArme} est brisée !`, 'error')
                    : _toast(`🔧 ${nomArme} : −${perteArme} dur. (reste ${slotObj.durabilite})`, 'info');
            }
            if (typeof autoSave === 'function') autoSave();
        }
    } else {
        const pertePV = Math.floor(Math.random() * 3) + 1;
        if (typeof _toast === 'function') _toast(`🤛 Vous vous blessez en frappant le coffre (−${pertePV} PV) !`, 'error');
        _logDonjon(`🤛 ${nom} se blesse à mains nues (−${pertePV} PV).`);
        db.ref('parties/' + sessionActuelle + '/joueurs/' + myID + '/modif_stat').set({ stat: 'PV', valeur: -pertePV, timestamp: Date.now() });
    }

    ref.once('value', snap => {
        const etat = snap.val();
        if (!etat) return;
        const nouvDura = Math.max(0, etat.durabilite - coup.dmg);
        _logDonjon(`🪓 ${nom} frappe le coffre avec ${nomArme} — ${coup.resultat} (${coup.roll}/${coup.baseChance}%) : −${coup.dmg} dur. → reste ${nouvDura}/${etat.durabiliteMax}.`);
        if (nouvDura <= 0) {
            if (typeof _toast === 'function') _toast('💥 Le coffre est fracassé !', 'success');
            ref.update({ durabilite: 0, statut: 'casse' }).then(() => {
                db.ref('parties/' + sessionActuelle + '/donjon_actif/grille/' + cellKey + '/event/declenche').set(true);
                ref.once('value', s => _afficherModalCoffre(cellKey, s.val()));
            });
        } else {
            if (typeof _toast === 'function') _toast(`🪓 Coffre endommagé (${nouvDura}/${etat.durabiliteMax}).`, 'info');
            ref.update({ durabilite: nouvDura }).then(() => ref.once('value', s => _afficherModalCoffre(cellKey, s.val())));
        }
    });
    const data = window.donjonActif;
    if (data) _avancerTourDonjon(data);
}

/** Prend un item dans un slot de coffre. Un seul item par joueur par coffre. */
function _prendreItemDonjon(cellKey, slotKey) {
    if (!window.perso || typeof itemsData === 'undefined') return;
    const myID = (window.perso.nom || '').replace(/\s+/g, '_');
    const ref  = db.ref('parties/' + sessionActuelle + '/donjon_actif/etats_coffres/' + cellKey);
    ref.once('value', snap => {
        const etat = snap.val();
        if (!etat) return;

        // Check round-robin : peut prendre si tous les autres ont autant d'objets que moi
        const positions = window.donjonActif?.positions || {};
        const joueurs = Object.keys(positions).filter(id => !id.startsWith('cmp_'));
        const myCount = etat.pris_par?.[myID] || 0;
        const autresMin = joueurs.length <= 1
            ? myCount
            : joueurs.filter(id => id !== myID)
                     .reduce((min, id) => Math.min(min, etat.pris_par?.[id] || 0), Infinity);
        if (autresMin < myCount) {
            if (typeof _toast === 'function') _toast('En attente que les autres joueurs prennent leur objet.', 'error');
            return;
        }

        const slot = etat.loot?.slots?.[slotKey];
        if (!slot || slot.pris_par) {
            if (typeof _toast === 'function') _toast('Cet objet a déjà été pris.', 'error');
            ref.once('value', s => _afficherModalCoffre(cellKey, s.val()));
            return;
        }
        const itemDef = itemsData[slot.id];
        if (!itemDef) return;

        // Ajouter à l'inventaire
        const qte = slot.quantite || 1;
        if (!window.perso.inventaire) window.perso.inventaire = [];
        const idx = window.perso.inventaire.findIndex(i => i.id === slot.id && itemDef.stackable);
        if (idx !== -1) window.perso.inventaire[idx].quantite = (window.perso.inventaire[idx].quantite || 1) + qte;
        else {
            const entry = { id: slot.id, quantite: qte };
            if (itemDef.nonIdentifie) entry.identifie = false;
            window.perso.inventaire.push(entry);
        }
        if (typeof autoSave === 'function') autoSave();
        if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
        const label = qte > 1 ? `${itemDef.nom} ×${qte}` : itemDef.nom;
        if (typeof _toast === 'function') _toast(`✅ ${label} ramassé !`, 'success');
        _logDonjon(`🎁 ${window.perso.nom} ramasse : ${label}`);

        // Marquer dans Firebase — incrémenter le compteur du joueur
        const updates = {};
        updates[`loot/slots/${slotKey}/pris_par`] = myID;
        updates[`pris_par/${myID}`] = myCount + 1;
        ref.update(updates).then(() => {
            document.getElementById('modal-donjon-coffre')?.remove();
        });
    });
}

/** Prend l'or d'un coffre (une fois par joueur). */
function _prendreOrDonjon(cellKey) {
    if (!window.perso) return;
    const myID = (window.perso.nom || '').replace(/\s+/g, '_');
    const ref  = db.ref('parties/' + sessionActuelle + '/donjon_actif/etats_coffres/' + cellKey);
    ref.once('value', snap => {
        const etat = snap.val();
        if (!etat) return;
        if (etat.or_pris?.[myID]) {
            if (typeof _toast === 'function') _toast('Vous avez déjà pris l\'or de ce coffre.', 'error');
            return;
        }
        const montant = etat.loot?.or || 0;
        if (montant <= 0) return;
        window.perso.argent = (window.perso.argent || 0) + montant;
        if (typeof _incStatPartie === 'function') _incStatPartie('or_cumule', montant);
        if (typeof autoSave === 'function') autoSave();
        if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
        if (typeof _toast === 'function') _toast(`💰 +${montant} pièces d'or !`, 'success');
        _logDonjon(`💰 ${window.perso.nom} ramasse ${montant} pièces d'or.`);
        ref.update({ [`or_pris/${myID}`]: true }).then(() => {
            document.getElementById('modal-donjon-coffre')?.remove();
        });
    });
}

// ── Découverte ───────────────────────────────────────────────

function _afficherDecouverteDonjon(texte, emoji) {
    emoji = emoji || '🔎';
    const isGhost = emoji === '👻';
    const borderColor = isGhost ? '#9c27b0' : '#2196f3';
    const bgColor     = isGhost ? '#1a0d2a' : '#0d1a2a';
    let modal = document.getElementById('modal-donjon-decouverte');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-donjon-decouverte';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }
    const lignes = texte.split('\n').map(l => `<p style="color:#ccc;line-height:1.6;margin:4px 0;">${l}</p>`).join('');
    modal.innerHTML = `
        <div style="background:${bgColor};border:2px solid ${borderColor};border-radius:10px;padding:20px;max-width:380px;width:90%;text-align:center;">
            <div style="font-size:2.5em;margin-bottom:8px;">${emoji}</div>
            ${lignes}
            <button onclick="document.getElementById('modal-donjon-decouverte').remove()" style="background:#1a2a3a;color:${borderColor};border:1px solid ${borderColor};padding:7px 20px;border-radius:4px;cursor:pointer;margin-top:12px;">Fermer</button>
        </div>`;
    modal.style.display = 'flex';
}

function _afficherModalPNJ(cellKey, event) {
    const nom = event.data?.nom || 'Personnage mystérieux';
    const dialogue = event.data?.dialogue || '"Bonne route, voyageur…"';
    const emoji = event.data?.emoji || '🧙';
    let modal = document.getElementById('modal-donjon-pnj');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-donjon-pnj';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }
    const lignes = dialogue.split('\n').map(l => `<p style="color:#ccc;line-height:1.6;margin:4px 0;font-style:italic;">${l}</p>`).join('');
    modal.innerHTML = `
        <div style="background:#0a180a;border:2px solid #4caf50;border-radius:10px;padding:20px;max-width:360px;width:90%;text-align:center;">
            <div style="font-size:2.2em;margin-bottom:6px;">${emoji}</div>
            <h3 style="color:#4caf50;margin:0 0 10px;font-size:0.95em;">${nom}</h3>
            ${lignes}
            <button onclick="document.getElementById('modal-donjon-pnj').remove()" style="background:#1a2a1a;color:#4caf50;border:1px solid #4caf50;padding:7px 20px;border-radius:4px;cursor:pointer;margin-top:14px;">Continuer</button>
        </div>`;
    modal.style.display = 'flex';
}

function _afficherModalAutel(cellKey, event, myID) {
    const nom  = event.data?.nom || 'Autel Ancien';
    const desc = event.data?.description || 'Une pierre gravée de runes.';
    const effet = event.data?.effet || 'aleatoire';
    let modal = document.getElementById('modal-donjon-autel');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-donjon-autel';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }
    const lblEffet = { soin: '✨ Soins', energie: '⚡ Énergie', aleatoire: '🎲 Inconnu', rien: '🌀 Silence' }[effet] || '🎲 Inconnu';
    modal.innerHTML = `
        <div style="background:#1a0d2a;border:2px solid #9c7fd4;border-radius:10px;padding:20px;max-width:360px;width:90%;text-align:center;">
            <div style="font-size:2.2em;margin-bottom:6px;">⛩</div>
            <h3 style="color:#9c7fd4;margin:0 0 8px;font-size:0.95em;">${nom}</h3>
            <p style="color:#aaa;font-size:0.88em;line-height:1.5;margin:0 0 14px;">${desc}</p>
            <p style="color:#666;font-size:0.78em;margin:0 0 12px;">Effet potentiel : ${lblEffet}</p>
            <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
                <button onclick="_utiliserAutelDonjon('${cellKey}','${myID}','${effet}')" style="background:#2a1a3a;color:#9c7fd4;border:1px solid #9c7fd4;padding:7px 18px;border-radius:4px;cursor:pointer;">🙏 Prier</button>
                <button onclick="document.getElementById('modal-donjon-autel').remove()" style="background:#111;color:#666;border:1px solid #444;padding:7px 18px;border-radius:4px;cursor:pointer;">Ignorer</button>
            </div>
        </div>`;
    modal.style.display = 'flex';
}

function _utiliserAutelDonjon(cellKey, myID, effetType) {
    document.getElementById('modal-donjon-autel')?.remove();
    const p = window.perso;
    if (!p) return;
    let effet = effetType;
    if (effet === 'aleatoire') {
        const pool = ['soin', 'soin', 'energie', 'energie', 'rien'];
        effet = pool[Math.floor(Math.random() * pool.length)];
    }
    const pvMax = (p.statsBase?.FO||0)*2 + (p.statsBase?.IN||0) + ((p.statsInvesties?.FO||0)*2) + (p.statsInvesties?.IN||0) + (p.boostPV||0);
    const ftMax = (p.statsBase?.CN||0)*2 + (p.statsBase?.IN||0) + ((p.statsInvesties?.CN||0)*2) + (p.statsInvesties?.IN||0) + (p.boostFT||0);
    let gainPV = 0, gainFT = 0, msg = '';
    if (effet === 'soin') {
        gainPV = Math.max(3, Math.round(pvMax * 0.10));
        p.boostPV = (p.boostPV || 0) + gainPV;
        p.pvActuel = Math.min(pvMax + gainPV, (p.pvActuel || 0) + gainPV);
        msg = `✨ L'autel augmente vos PV max de +${gainPV} jusqu'à la fin du donjon.`;
    } else if (effet === 'energie') {
        gainFT = Math.max(2, Math.round(ftMax * 0.10));
        p.boostFT = (p.boostFT || 0) + gainFT;
        p.ftActuel = Math.min(ftMax + gainFT, (p.ftActuel || 0) + gainFT);
        msg = `⚡ L'autel augmente vos FT max de +${gainFT} jusqu'à la fin du donjon.`;
    } else {
        msg = '🌀 L\'autel reste silencieux…';
    }
    if (typeof _toast === 'function') _toast(msg, 'info');
    _logDonjon(`⛩ ${p.nom} prie à l'autel — ${msg}`);
    if (gainPV > 0 || gainFT > 0) {
        const refBuff = db.ref('parties/' + sessionActuelle + '/joueurs/' + myID + '/buff_donjon_autel');
        refBuff.once('value', snap => {
            const ex = snap.val() || { boostPV: 0, boostFT: 0 };
            refBuff.set({ boostPV: (ex.boostPV||0) + gainPV, boostFT: (ex.boostFT||0) + gainFT });
        });
        if (typeof autoSave === 'function') autoSave();
        if (typeof synchroniserJoueur === 'function') synchroniserJoueur();
    }
    db.ref('parties/' + sessionActuelle + '/donjon_actif/autels_utilises/' + cellKey + '/' + myID).set(true);
}

// ── Escalier / changement d'étage ───────────────────────────

/** Transition vers l'étage suivant quand un joueur marche sur un escalier. */
function _monterEtage(data, myID, staircaseKey) {
    const etageActuel  = data.etage_actuel || 1;
    const prochainEtage = etageActuel + 1;
    const etages       = data.etages || {};
    const prochain     = etages[prochainEtage];

    if (!prochain) {
        if (typeof _toast === 'function') _toast('🏁 Vous atteignez la sortie du donjon !', 'info');
        _logDonjon(`🏁 ${window.perso?.nom || myID} atteint la sortie.`);
        return;
    }

    // Repositionner tous les participants : utilise la connexion de l'escalier si définie, sinon le départ du nouvel étage
    const connexion = staircaseKey && etages[etageActuel]?.connexions?.[staircaseKey];
    const depart    = connexion || prochain.depart || { x: 1, y: 1 };
    const positions = {};
    Object.keys(data.positions || {}).forEach(id => { positions[id] = { ...depart }; });

    const ref = db.ref('parties/' + sessionActuelle + '/donjon_actif');
    ref.update({
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
        window._casesVisiteesDonjon = new Set();
        if (typeof _toast === 'function') _toast(`⬆ Étage ${prochainEtage} — En avant !`, 'success');
    });
}

// ── Brouillard de guerre ─────────────────────────────────────

/**
 * Flood-fill depuis (px, py) à travers les cases non-mur.
 * Les portes fermées (non ouvertes) bloquent la propagation (visibles mais opaques).
 * Renvoie un Set de clés "x_y" visibles (sol + murs bordants).
 */
function _calculerVisibilite(grille, largeur, hauteur, px, py, etats_portes) {
    const visible  = new Set();
    const visited  = new Set([`${px}_${py}`]);
    const queue    = [[px, py]];

    while (queue.length > 0) {
        const [cx, cy] = queue.shift();
        visible.add(`${cx}_${cy}`);

        for (const [nx, ny] of [[cx-1,cy],[cx+1,cy],[cx,cy-1],[cx,cy+1]]) {
            if (nx < 0 || nx >= largeur || ny < 0 || ny >= hauteur) continue;
            const key  = `${nx}_${ny}`;
            const cell = grille[key];
            visible.add(key); // Voir les murs / portes bordants
            if (!visited.has(key) && cell?.type !== 'mur') {
                // Les portes bloquent TOUJOURS la vision (seuls les murs + portes délimitent les salles)
                const estFermee = cell?.event?.type === 'porte';
                if (!estFermee) {
                    visited.add(key);
                    queue.push([nx, ny]);
                }
            }
        }
    }
    return visible;
}

// ── Utilitaires ──────────────────────────────────────────────

function _logDonjon(texte) {
    db.ref('parties/' + sessionActuelle + '/donjon_actif/log').push({ texte, timestamp: Date.now() });
}
