// ================= SYSTÈME DE SUCCÈS =================

const succesData = [

    // ── Combat ──────────────────────────────────────────────
    {
        id: 'premier_sang',
        nom: 'Premier Sang',
        desc: 'Porter votre première attaque en combat.',
        icone: '⚔️', categorie: 'Combat',
        type: 'seuil', cle: 'attaques', seuil: 1
    },
    {
        id: 'combattant',
        nom: 'Combattant',
        desc: 'Porter 50 attaques au total.',
        icone: '⚔️', categorie: 'Combat',
        type: 'seuil', cle: 'attaques', seuil: 50
    },
    {
        id: 'tueur',
        nom: 'Tueur',
        desc: 'Vaincre votre premier ennemi.',
        icone: '💀', categorie: 'Combat',
        type: 'seuil', cle: 'ennemis_tues', seuil: 1
    },
    {
        id: 'massacreur',
        nom: 'Massacreur',
        desc: 'Vaincre 10 ennemis.',
        icone: '💀', categorie: 'Combat',
        type: 'seuil', cle: 'ennemis_tues', seuil: 10
    },
    {
        id: 'exterminateur',
        nom: 'Exterminateur',
        desc: 'Vaincre 50 ennemis.',
        icone: '☠️', categorie: 'Combat',
        type: 'seuil', cle: 'ennemis_tues', seuil: 50
    },
    {
        id: 'berserk',
        nom: 'Berserker',
        desc: 'Infliger 500 points de dégâts à des ennemis.',
        icone: '🩸', categorie: 'Combat',
        type: 'seuil', cle: 'degats_ennemis', seuil: 500
    },

    // ── Magie ────────────────────────────────────────────────
    {
        id: 'apprenti_mage',
        nom: 'Apprenti Mage',
        desc: 'Lancer votre premier sort.',
        icone: '🔮', categorie: 'Magie',
        type: 'seuil', cle: 'sorts_lances', seuil: 1
    },
    {
        id: 'mage_confirme',
        nom: 'Mage Confirmé',
        desc: 'Lancer 25 sorts.',
        icone: '🔮', categorie: 'Magie',
        type: 'seuil', cle: 'sorts_lances', seuil: 25
    },
    {
        id: 'archimage',
        nom: 'Archimage',
        desc: 'Lancer 100 sorts.',
        icone: '✨', categorie: 'Magie',
        type: 'seuil', cle: 'sorts_lances', seuil: 100
    },

    // ── Soins ────────────────────────────────────────────────
    {
        id: 'aidant',
        nom: 'Aidant',
        desc: 'Soigner un allié pour la première fois.',
        icone: '💙', categorie: 'Soins',
        type: 'seuil', cle: 'soins_donnes', seuil: 1
    },
    {
        id: 'medecin',
        nom: 'Médecin de campagne',
        desc: 'Prodiguer 200 points de soins à vos alliés.',
        icone: '💙', categorie: 'Soins',
        type: 'seuil', cle: 'soins_donnes', seuil: 200
    },

    // ── Survie ───────────────────────────────────────────────
    {
        id: 'resilient',
        nom: 'Résilient',
        desc: 'Perdre 100 points de vie au total.',
        icone: '❤️', categorie: 'Survie',
        type: 'seuil', cle: 'pv_perdus', seuil: 100
    },
    {
        id: 'premiere_mort',
        nom: 'Première Mort',
        desc: 'Tomber au combat pour la première fois.',
        icone: '💀', categorie: 'Survie',
        type: 'seuil', cle: 'morts', seuil: 1
    },
    {
        id: 'neuf_vies',
        nom: '9 Vies',
        desc: 'Mourir 3 fois sans jamais abandonner.',
        icone: '🐱', categorie: 'Survie',
        type: 'seuil', cle: 'morts', seuil: 3
    },

    // ── Exploration ──────────────────────────────────────────
    {
        id: 'explorateur',
        nom: 'Explorateur',
        desc: 'Parcourir 100 cases dans un donjon.',
        icone: '🚶', categorie: 'Exploration',
        type: 'seuil', cle: 'cases_parcourues', seuil: 100
    },
    {
        id: 'grand_explorateur',
        nom: 'Grand Explorateur',
        desc: 'Parcourir 500 cases au total.',
        icone: '🗺️', categorie: 'Exploration',
        type: 'seuil', cle: 'cases_parcourues', seuil: 500
    },

    // ── Richesse ─────────────────────────────────────────────
    {
        id: 'Argent_poche',
        nom: 'Argent de poche',
        desc: 'Accumuler 500 pièces d\'or au cours de l\'aventure.',
        icone: '💰', categorie: 'Richesse',
        type: 'seuil', cle: 'or_cumule', seuil: 500
    },
    {
        id: 'avare',
        nom: 'Thésauriseur',
        desc: 'Accumuler 2 000 pièces d\'or au cours de l\'aventure.',
        icone: '💰', categorie: 'Richesse',
        type: 'seuil', cle: 'or_cumule', seuil: 2000
    },
    {
        id: 'riche',
        nom: 'Homme d\'Affaires',
        desc: 'Accumuler 20 000 pièces d\'or au cours de l\'aventure.',
        icone: '🤑', categorie: 'Richesse',
        type: 'seuil', cle: 'or_cumule', seuil: 20000
    },
    {
        id: 'client_fidele',
        nom: 'Client Fidèle',
        desc: 'Dépenser 200 pièces d\'or chez des marchands.',
        icone: '🛒', categorie: 'Richesse',
        type: 'seuil', cle: 'or_depense', seuil: 200
    },
    {
        id: 'grand_acheteur',
        nom: 'Grand Acheteur',
        desc: 'Dépenser 1 000 pièces d\'or chez des marchands.',
        icone: '💸', categorie: 'Richesse',
        type: 'seuil', cle: 'or_depense', seuil: 1000
    },
    {
        id: 'mecene',
        nom: 'Mécène',
        desc: 'Dépenser 5 000 pièces d\'or chez des marchands.',
        icone: '🏦', categorie: 'Richesse',
        type: 'seuil', cle: 'or_depense', seuil: 5000
    },

    // ── Exploration (villes) ─────────────────────────────────
    {
        id: 'premier_voyage',
        nom: 'Premier Voyage',
        desc: 'Découvrir votre première ville.',
        icone: '🏙️', categorie: 'Exploration',
        type: 'seuil', cle: 'villes_decouvertes', seuil: 1
    },
    {
        id: 'voyageur',
        nom: 'Voyageur',
        desc: 'Découvrir 3 villes différentes.',
        icone: '🗺️', categorie: 'Exploration',
        type: 'seuil', cle: 'villes_decouvertes', seuil: 3
    },
    {
        id: 'globe_trotteur',
        nom: 'Globe-Trotteur',
        desc: 'Découvrir 7 villes différentes.',
        icone: '✈️', categorie: 'Exploration',
        type: 'seuil', cle: 'villes_decouvertes', seuil: 7
    },

    // ── Compagnons ───────────────────────────────────────────
    {
        id: 'premier_compagnon',
        nom: 'Pas Seul',
        desc: 'Recruter votre premier compagnon.',
        icone: '🤝', categorie: 'Compagnons',
        type: 'seuil', cle: 'compagnons_debloques', seuil: 1
    },
    {
        id: 'chef_de_groupe',
        nom: 'Chef de Groupe',
        desc: 'Avoir eu 3 compagnons différents.',
        icone: '👥', categorie: 'Compagnons',
        type: 'seuil', cle: 'compagnons_debloques', seuil: 3
    },

    // ── Donjon ───────────────────────────────────────────────
    {
        id: 'depiegeur',
        nom: 'Dépiégeur',
        desc: 'Désamorcer votre premier piège.',
        icone: '🔧', categorie: 'Donjon',
        type: 'seuil', cle: 'pieges_desamorces', seuil: 1
    },
    {
        id: 'sapeur',
        nom: 'Sapeur',
        desc: 'Désamorcer 5 pièges.',
        icone: '🔩', categorie: 'Donjon',
        type: 'seuil', cle: 'pieges_desamorces', seuil: 5
    },

    // ── Spéciaux (déblocage manuel MJ) ───────────────────────
    {
        id: 'survivant_crash',
        nom: 'Survivant du Crash',
        desc: 'Avoir survécu au crash de l\'IFS Zephyr.',
        icone: '✈️', categorie: 'Histoire',
        type: 'manuel'
    },
    {
        id: 'heros',
        nom: 'Héros',
        desc: 'Accomplir un acte héroïque remarqué par tous.',
        icone: '🦸', categorie: 'Histoire',
        type: 'manuel'
    },
    {
        id: 'traitre',
        nom: 'Traître',
        desc: 'Attaquer un allié avec un sort offensif.',
        icone: '🗡️', categorie: 'Équipe',
        type: 'seuil', cle: 'attaques_allies', seuil: 1
    },
    {
        id: 'diplomate',
        nom: 'Diplomate',
        desc: 'Résoudre un conflit sans violence.',
        icone: '🕊️', categorie: 'Histoire',
        type: 'manuel'
    },
    {
        id: 'collectionneur',
        nom: 'Collectionneur',
        desc: 'Rassembler 10 objets différents dans son inventaire.',
        icone: '🎒', categorie: 'Histoire',
        type: 'manuel'
    },

    // ── Vol ──────────────────────────────────────────────────
    {
        id: 'vol_1',
        nom: 'Voleur',
        desc: 'Réussir votre premier vol à la tire.',
        icone: '🤏', categorie: 'Vol',
        type: 'seuil', cle: 'vols_reussis', seuil: 1
    },
    {
        id: 'vol_5',
        nom: 'Filou',
        desc: 'Réussir 5 vols à la tire.',
        icone: '🃏', categorie: 'Vol',
        type: 'seuil', cle: 'vols_reussis', seuil: 5
    },

    // ── Artisan ──────────────────────────────────────────────
    {
        id: 'craft_1',
        nom: 'Artisan',
        desc: 'Fabriquer votre premier objet.',
        icone: '🔨', categorie: 'Artisan',
        type: 'seuil', cle: 'objets_craftes', seuil: 1
    },
    {
        id: 'craft_10',
        nom: 'Maître Artisan',
        desc: 'Fabriquer 10 objets.',
        icone: '⚙️', categorie: 'Artisan',
        type: 'seuil', cle: 'objets_craftes', seuil: 10
    },

    // ── Équipe ───────────────────────────────────────────────
    {
        id: 'objet_donne_1',
        nom: 'Généreux',
        desc: 'Donner un objet à un allié.',
        icone: '🎁', categorie: 'Équipe',
        type: 'seuil', cle: 'objets_donnes', seuil: 1
    },
    {
        id: 'objet_donne_10',
        nom: 'Bienfaiteur',
        desc: 'Donner 10 objets à des alliés.',
        icone: '🎁', categorie: 'Équipe',
        type: 'seuil', cle: 'objets_donnes', seuil: 10
    },
    {
        id: 'objet_recu_1',
        nom: 'Bien Entouré',
        desc: 'Recevoir un objet d\'un allié (hors MJ).',
        icone: '🤲', categorie: 'Équipe',
        type: 'seuil', cle: 'objets_recus', seuil: 1
    },
    {
        id: 'objet_recu_10',
        nom: 'Chouchou',
        desc: 'Recevoir 10 objets d\'alliés (hors MJ).',
        icone: '🤲', categorie: 'Équipe',
        type: 'seuil', cle: 'objets_recus', seuil: 10
    },

    // ── Maîtrise (stats) ─────────────────────────────────────
    { id: 'stat_fo_20', nom: 'Force Absolue', desc: 'Atteindre 20 en Force.', icone: '💪', categorie: 'Maîtrise', type: 'custom' },
    { id: 'stat_in_20', nom: 'Génie', desc: 'Atteindre 20 en Intelligence.', icone: '🧠', categorie: 'Maîtrise', type: 'custom' },
    { id: 'stat_cn_20', nom: 'Constitution de Fer', desc: 'Atteindre 20 en Constitution.', icone: '🛡️', categorie: 'Maîtrise', type: 'custom' },
    { id: 'stat_dx_20', nom: 'Maître Acrobate', desc: 'Atteindre 20 en Dextérité.', icone: '🤸', categorie: 'Maîtrise', type: 'custom' },
    { id: 'stat_ch_20', nom: 'Magnétisme Naturel', desc: 'Atteindre 20 en Charisme.', icone: '✨', categorie: 'Maîtrise', type: 'custom' },

    // ── Maîtrise (magie) ─────────────────────────────────────
    { id: 'maitre_magie_deplacement', nom: 'Maître Déplacement', desc: 'Maîtriser tous les sorts de l\'école Déplacement.', icone: '🌀', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_magie_divination', nom: 'Maître Divination', desc: 'Maîtriser tous les sorts de l\'école Divination.', icone: '🔮', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_magie_air', nom: 'Maître Air', desc: 'Maîtriser tous les sorts de l\'école Air.', icone: '💨', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_magie_terre', nom: 'Maître Terre', desc: 'Maîtriser tous les sorts de l\'école Terre.', icone: '🌍', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_magie_feu', nom: 'Maître Feu', desc: 'Maîtriser tous les sorts de l\'école Feu.', icone: '🔥', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_magie_eau', nom: 'Maître Eau', desc: 'Maîtriser tous les sorts de l\'école Eau.', icone: '💧', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_magie_energie', nom: 'Maître Énergie', desc: 'Maîtriser tous les sorts de l\'école Énergie.', icone: '⚡', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_magie_mental', nom: 'Maître Mental', desc: 'Maîtriser tous les sorts de l\'école Mental.', icone: '🧿', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_magie_meta', nom: 'Maître Méta', desc: 'Maîtriser tous les sorts de l\'école Méta.', icone: '🌐', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_magie_transformation', nom: 'Maître Transformation', desc: 'Maîtriser tous les sorts de l\'école Transformation.', icone: '🦋', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_magie_nature', nom: 'Maître Nature', desc: 'Maîtriser tous les sorts de l\'école Nature.', icone: '🌿', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_magie_necromancie_noire', nom: 'Nécromancien Noir', desc: 'Maîtriser tous les sorts de Nécromancie noire.', icone: '💀', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_magie_necromancie_blanche', nom: 'Nécromancien Blanc', desc: 'Maîtriser tous les sorts de Nécromancie blanche.', icone: '👼', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_magie_illusion', nom: 'Maître Illusion', desc: 'Maîtriser tous les sorts de l\'école Illusion.', icone: '🪞', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_magie_invocation', nom: 'Grand Invocateur', desc: 'Maîtriser tous les sorts de l\'école Invocation.', icone: '🌟', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_magie_temporel', nom: 'Maître Temps', desc: 'Maîtriser tous les sorts de l\'école Temporel.', icone: '⏳', categorie: 'Maîtrise', type: 'custom' },

    // ── Maîtrise (tech) ──────────────────────────────────────
    { id: 'prof_tech_forge', nom: 'Professeur Forge', desc: 'Maîtriser tous les schémas de Forge.', icone: '⚒️', categorie: 'Maîtrise', type: 'custom' },
    { id: 'prof_tech_mecanique', nom: 'Professeur Mécanique', desc: 'Maîtriser tous les schémas de Mécanique.', icone: '⚙️', categorie: 'Maîtrise', type: 'custom' },
    { id: 'prof_tech_armurerie', nom: 'Professeur Armurerie', desc: 'Maîtriser tous les schémas d\'Armurerie.', icone: '🛡️', categorie: 'Maîtrise', type: 'custom' },
    { id: 'prof_tech_electricite', nom: 'Professeur Électricité', desc: 'Maîtriser tous les schémas d\'Électricité.', icone: '⚡', categorie: 'Maîtrise', type: 'custom' },
    { id: 'prof_tech_botanique', nom: 'Professeur Botanique', desc: 'Maîtriser tous les schémas de Botanique.', icone: '🌱', categorie: 'Maîtrise', type: 'custom' },
    { id: 'prof_tech_therapeutique', nom: 'Professeur Thérapeutique', desc: 'Maîtriser tous les schémas de Thérapeutique.', icone: '💊', categorie: 'Maîtrise', type: 'custom' },
    { id: 'prof_tech_chimie', nom: 'Professeur Chimie', desc: 'Maîtriser tous les schémas de Chimie.', icone: '⚗️', categorie: 'Maîtrise', type: 'custom' },
    { id: 'prof_tech_explosifs', nom: 'Professeur Explosifs', desc: 'Maîtriser tous les schémas d\'Explosifs.', icone: '💣', categorie: 'Maîtrise', type: 'custom' },

    // ── Maîtrise (skills) ────────────────────────────────────
    { id: 'maitre_skill_arc', nom: 'Maître Arc', desc: 'Atteindre 20 pts en Arc.', icone: '🏹', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_skill_esquive', nom: 'Maître Esquive', desc: 'Atteindre 20 pts en Esquive.', icone: '💃', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_skill_melee', nom: 'Maître Mêlée', desc: 'Atteindre 20 pts en Mêlée.', icone: '⚔️', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_skill_lancer', nom: 'Maître Lancer', desc: 'Atteindre 20 pts en Lancer.', icone: '🎯', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_skill_attaque_sournoise', nom: 'Maître Sournoiserie', desc: 'Atteindre 20 pts en Attaque sournoise.', icone: '🗡️', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_skill_vol_a_la_tire', nom: 'Maître Vol', desc: 'Atteindre 20 pts en Vol à la tire.', icone: '🤏', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_skill_discretion', nom: 'Maître Discrétion', desc: 'Atteindre 20 pts en Discrétion.', icone: '👤', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_skill_detection_piege', nom: 'Maître Détection', desc: 'Atteindre 20 pts en Détection de Piège.', icone: '🔍', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_skill_jeu', nom: 'Maître Joueur', desc: 'Atteindre 20 pts en Jeu.', icone: '🎲', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_skill_marchandage', nom: 'Maître Marchand', desc: 'Atteindre 20 pts en Marchandage.', icone: '💼', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_skill_soins', nom: 'Maître Soins', desc: 'Atteindre 20 pts en Soins.', icone: '💊', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_skill_persuasion', nom: 'Maître Persuasion', desc: 'Atteindre 20 pts en Persuasion.', icone: '🗣️', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_skill_reparation', nom: 'Maître Réparation', desc: 'Atteindre 20 pts en Réparation.', icone: '🔧', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_skill_armes_a_feu', nom: 'Maître Armes à Feu', desc: 'Atteindre 20 pts en Armes à feu.', icone: '🔫', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_skill_crochetage', nom: 'Maître Crochetage', desc: 'Atteindre 20 pts en Crochetage.', icone: '🔑', categorie: 'Maîtrise', type: 'custom' },
    { id: 'maitre_skill_desamorcage', nom: 'Maître Désamorçage', desc: 'Atteindre 20 pts en Désamorçage.', icone: '🧨', categorie: 'Maîtrise', type: 'custom' },
];

/**
 * Débloque un succès pour le joueur courant.
 * Ne fait rien si déjà débloqué.
 */
function _debloquerSucces(id) {
    if (!window.perso || typeof sessionActuelle === 'undefined' || !sessionActuelle) return;
    const myID = (window.perso.nom || '').replace(/\s+/g, '_');
    if (!myID) return;

    // Vérifier si déjà débloqué en local
    if (window.perso.succes?.[id]) return;

    const dateDeb = Date.now();

    // Sauvegarder localement
    if (!window.perso.succes) window.perso.succes = {};
    window.perso.succes[id] = { date: dateDeb };

    // Persister sur Firebase
    if (typeof db !== 'undefined' && db) {
        db.ref(`parties/${sessionActuelle}/joueurs/${myID}/succes/${id}`).set({ date: dateDeb });
    }

    // Notification toast (via file pour éviter l'empilement)
    const def = succesData.find(s => s.id === id);
    if (def) {
        _succesToastQueue.push({ icone: def.icone, nom: def.nom });
        if (!_succesToastTimer) _flushSuccesToasts();
    }
}

// File d'attente pour les toasts de succès (évite l'empilement simultané)
let _succesToastQueue = [];
let _succesToastTimer = null;
function _flushSuccesToasts() {
    if (_succesToastQueue.length === 0) { _succesToastTimer = null; return; }
    const { icone, nom } = _succesToastQueue.shift();
    if (typeof _toast === 'function') _toast(`🏆 Succès débloqué : ${icone} ${nom}`, 'gold');
    _succesToastTimer = setTimeout(_flushSuccesToasts, 2200);
}

/**
 * Vérifie uniquement les succès liés à la clé qui vient de changer.
 * @param {string} [cle] — si fourni, ne vérifie que les succès avec cette clé.
 */
function _verifierSucces(cle) {
    if (!window.perso) return;
    const sp = window.perso.stats_partie || {};
    const aVerifier = cle
        ? succesData.filter(s => s.type === 'seuil' && s.cle === cle)
        : succesData.filter(s => s.type === 'seuil');
    aVerifier.forEach(s => {
        if (window.perso.succes?.[s.id]) return;
        if ((sp[s.cle] || 0) >= s.seuil) _debloquerSucces(s.id);
    });
}

/**
 * MJ : débloque un succès pour n'importe quel joueur (via Firebase direct).
 */
function mjDebloquerSucces(joueurID, sucId) {
    if (typeof sessionActuelle === 'undefined' || !sessionActuelle) return;
    if (typeof db === 'undefined' || !db) return;
    const def = succesData.find(s => s.id === sucId);
    db.ref(`parties/${sessionActuelle}/joueurs/${joueurID}/succes/${sucId}`)
        .set({ date: Date.now() });
    if (typeof _toast === 'function') {
        _toast(`🏆 Succès « ${def?.nom || sucId} » attribué à ${joueurID}.`, 'gold');
    }
}

/**
 * MJ : révoque un succès pour un joueur.
 */
function mjRevoquerSucces(joueurID, sucId) {
    if (typeof sessionActuelle === 'undefined' || !sessionActuelle) return;
    if (typeof db === 'undefined' || !db) return;
    db.ref(`parties/${sessionActuelle}/joueurs/${joueurID}/succes/${sucId}`).remove();
    if (typeof _toast === 'function') _toast(`Succès révoqué.`, 'info');
}

function _slugifyEcole(s) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

/**
 * Vérifie les succès de type 'custom' (stats/magie/tech/skills).
 * À appeler après validation du level-up.
 */
function _verifierSuccesLevelUp() {
    if (!window.perso) return;

    // Stats à 20
    ['FO', 'IN', 'CN', 'DX', 'CH'].forEach(stat => {
        const total = (perso.statsBase?.[stat] || 0) + (perso.statsInvesties?.[stat] || 0);
        if (total >= 20) _debloquerSucces('stat_' + stat.toLowerCase() + '_20');
    });

    // Écoles de magie — tous les sorts accessibles (niveau >= niv max des sorts)
    if (typeof magieData !== 'undefined') {
        const niveauxParEcole = {};
        for (let e in (perso.magieBase || {})) niveauxParEcole[e] = Math.max(niveauxParEcole[e] || 0, parseInt(perso.magieBase[e]) || 0);
        for (let e in (perso.magieInvesties || {})) niveauxParEcole[e] = Math.max(niveauxParEcole[e] || 0, parseInt(perso.magieInvesties[e]) || 0);
        for (let ecole in niveauxParEcole) {
            if (!magieData[ecole]?.sorts?.length) continue;
            const maxNiv = Math.max(...magieData[ecole].sorts.map(s => s.niv || 0));
            if (niveauxParEcole[ecole] >= maxNiv) _debloquerSucces('maitre_magie_' + _slugifyEcole(ecole));
        }
    }

    // Écoles de tech — tous les schémas accessibles (points >= int max)
    if (typeof techData !== 'undefined') {
        for (let discipline in (perso.techInvesties || {})) {
            if (!techData[discipline]?.schematics?.length) continue;
            const maxInt = Math.max(...techData[discipline].schematics.map(s => s.int || 0));
            if ((perso.techInvesties[discipline] || 0) >= maxInt) _debloquerSucces('prof_tech_' + _slugifyEcole(discipline));
        }
    }

    // Skills à 20
    if (typeof competencesData !== 'undefined') {
        for (let cat in competencesData) {
            competencesData[cat].forEach(comp => {
                if ((perso.compInvesties?.[comp.id] || 0) >= 20) _debloquerSucces('maitre_skill_' + comp.id);
            });
        }
    }
}
