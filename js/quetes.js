// ============================================================
// SYSTÈME DE QUÊTES — Données statiques
// Chaque quête : nom, donneur, résumé, description, récompenses
// ============================================================

const quetesData = {
    "Q01": {
        nom: "Le Cristal Perdu",
        donneur: "Maître Aldric",
        resume: "Retrouvez le cristal magique dérobé par une bande de voleurs.",
        desc: "Le vieux mage Aldric a besoin de récupérer son cristal de téléportation, volé il y a trois jours par la bande de Scar. La dernière piste connue mène aux ruines de l'ancienne forteresse au nord.",
        recompenses: { xp: 50, or: 100 }
    },
    "Q02": {
        nom: "La Forêt Maudite",
        donneur: "Herbière Sylvaine",
        resume: "Éliminez les créatures corrompues qui infestent la forêt au nord du village.",
        desc: "Depuis quelques semaines, des créatures difformes sortent de la Forêt de Vael. Sylvaine pense qu'une source de corruption est nichée au cœur des bois.",
        recompenses: { xp: 75, or: 150 }
    },
    "Q03": {
        nom: "La Livraison",
        donneur: "Marchand Élovar",
        resume: "Livrez un colis scellé à l'auberge de Drakemoor avant la nuit.",
        desc: "Élovar ne peut pas se déplacer lui-même, mais son colis doit absolument arriver à Drakemoor avant la tombée de la nuit. Il préfère ne pas préciser ce qu'il contient.",
        recompenses: { xp: 20, or: 50 }
    },
    "Q04": {
        nom: "Disparitions à Drakemoor",
        donneur: "Shérif Goran",
        resume: "Enquêtez sur la disparition de trois habitants dans le quartier est.",
        desc: "Trois habitants ont disparu en l'espace de deux semaines. Le shérif est débordé. Les disparitions semblent concentrées dans le quartier est, près des entrepôts.",
        recompenses: { xp: 60, or: 80 }
    },
    "Q05": {
        nom: "L'Artefact Interdit",
        donneur: "Archiviste Telas",
        resume: "Récupérez le grimoire volé dans la bibliothèque centrale avant qu'il ne soit utilisé.",
        desc: "Un voleur masqué a dérobé un grimoire scellé contenant des invocations dangereuses. L'archiviste veut le récupérer avant qu'il ne tombe entre de mauvaises mains.",
        recompenses: { xp: 80, or: 200 }
    },
    "Q06": {
        nom: "Mines Infestées",
        donneur: "Chef de clan Brakk",
        resume: "Nettoyez les mines du clan des créatures qui en ont pris possession.",
        desc: "Des araignées géantes ont envahi les mines de minerai d'argent du clan Brakk. Sans les mines, le clan est ruiné et ne peut plus payer ses dettes.",
        recompenses: { xp: 90, or: 120 }
    },
    "Q07": {
        nom: "Le Passeur",
        donneur: "Exilé Varenn",
        resume: "Escortez l'exilé Varenn jusqu'à la frontière sans attirer l'attention des gardes.",
        desc: "Varenn est recherché pour un crime qu'il prétend ne pas avoir commis. Il doit fuir la région avant d'être arrêté. Les gardes patrouillent les routes principales.",
        recompenses: { xp: 40, or: 70 }
    },
    "Q08": {
        nom: "Le Dernier Témoin",
        donneur: "Avocat Millian",
        resume: "Retrouvez et protégez le seul témoin d'un meurtre avant qu'il soit réduit au silence.",
        desc: "Un procès important se tient dans trois jours. Le seul témoin à charge est introuvable depuis hier matin. Des hommes de main le cherchent également.",
        recompenses: { xp: 70, or: 130 }
    },
    "Q09": {
        nom: "Le Prix du Sang",
        donneur: "Noble Cassius",
        resume: "Vengez l'honneur de la famille Cassius en retrouvant l'assassin de son fils.",
        desc: "Le fils du noble Cassius a été tué lors d'une embuscade. Cassius veut que justice soit rendue — ou vengeance, selon votre interprétation.",
        recompenses: { xp: 100, or: 250 }
    },
    "Q10": {
        nom: "Rumeurs de la Crypte",
        donneur: "Prêtre Orlann",
        resume: "Explorez la crypte sous l'église et découvrez l'origine des bruits nocturnes.",
        desc: "Depuis une semaine, des bruits étranges montent de la crypte sous l'église. Le prêtre Orlann craint une profanation. Il faut descendre et faire la lumière sur ces événements.",
        recompenses: { xp: 55, or: 90 }
    }
};
