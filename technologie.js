const techData = {
    "Forge": {
        desc: "Discipline ayant trait à la construction d'armures.",
        schematics: [
            { nom: "Pur Alliage", int: 5, compo: ["Acier", "Minerai de fer"], desc: "Amalgame de fer et d'acier plus léger et résistant." },
            { nom: "Épée équilibrée", int: 8, compo: ["Pur Alliage", "Garde d'épée"], desc: "Arme rapide et précise utilisant les propriétés du pur alliage." },
            { nom: "Hache ultralégère", int: 11, compo: ["Manche de hache", "Minerai de nain"], desc: "Arme mortelle en minerai nain pesant moitié moins." },
            { nom: "Gantelets de nain", int: 13, compo: ["Gants en tissu", "Plaque d'acier"], desc: "Gants métalliques boostant la puissance au corps à corps." },
            { nom: "Heaume de vision", int: 15, compo: ["Heaume de qualité", "Bandelette de cuir"], desc: "Casque de protection améliorant la visibilité." },
            { nom: "Cotte de mailles légère", int: 17, compo: ["Armure de cuir", "Bobine de fils"], desc: "Armure de mailles offrant une protection agile." },
            { nom: "Cuirasse d'élite", int: 19, compo: ["Cotte de mailles légère", "Acier de nains"], desc: "L'armure de plaques technologique la plus aboutie." }
        ]
    },
    "Mécanique": { 
        desc: "Discipline consistant à fabriquer des engins en utilisant des moyens mécaniques.", 
        schematics: [
            { nom: "Piège à piques", int: 5, compo: ["Barre de fer", "Gros ressort"], desc: "Dispositif simple blessant quiconque marche dessus." }, 
            { nom: "Passe-partout auto.", int: 8, compo: ["Petit ressort", "Outil de crochetage"], desc: "Outil facilitant grandement le crochetage des serrures." }, 
            { nom: "Déclencheur de piège", int: 11, compo: ["Boîte en métal", "Petit ressort"], desc: "Boîtier à ressort pour activer les pièges à distance." }, 
            { nom: "Piège à ours", int: 13, compo: ["Pince métallique", "Gros ressort"], desc: "Pince métallique immobilisant et blessant la proie." }, 
            { nom: "Leurre mécanique", int: 15, compo: ["Montre à goussets", "Petit ressort"], desc: "Dispositif à ressort créant une diversion sonore." }, 
            { nom: "Méca-lorgnon", int: 17, compo: ["Paire de lunettes", "Montre à goussets"], desc: "Lunettes augmentant la perception de jour comme de nuit." }, 
            { nom: "Méca-arachnide", int: 19, compo: ["Petite machine à vapeur", "Gros engrenage"], desc: "Automate de combat hydraulique à vapeur avec griffes." }
        ] 
    },
    "Armurerie": { 
        desc: "Discipline couvrant tous les aspects de la conception et de la fabrication de nouvelles armes.", 
        schematics: [
            { nom: "Pistolet à silex", int: 5, compo: ["Pistole cassé", "Petit tube en métal"], desc: "Arme à feu rudimentaire fabriquée avec des pièces de récupération." }, 
            { nom: "Revolver de choix", int: 8, compo: ["Pistolet cassé", "Chambre de revolver"], desc: "Pistolet bien équilibré destiné aux tireurs sérieux." }, 
            { nom: "Fusil à répétition", int: 11, compo: ["Fusil de chasse", "Chambre de revolver"], desc: "Fusil permettant de tirer plusieurs coups rapidement." }, 
            { nom: "Revolver silencieux", int: 13, compo: ["Revolver de choix", "Silencieux"], desc: "Arme à feu modifiée pour réduire le bruit de la détonation." }, 
            { nom: "Fusil à lunette", int: 15, compo: ["Fusil précis ", "Miroir"], desc: "Fusil de précision équipé d'un système de visée optique." }, 
            { nom: "Canon portable", int: 17, compo: ["Fusil Clarington", "Pistolet chic"], desc: "Arme lourde infligeant des dégâts massifs." }, 
            { nom: "Fusil éléphant", int: 19, compo: ["Fusil de chasse", "Gros tuyau"], desc: "Arme de très gros calibre pour les cibles les plus résistantes." }
        ] 
    },
    "Electricité": { 
        desc: "Discipline explorant les mystères des particules électriques et du magnétisme.", 
        schematics: [
            { nom: "Lampe électrique", int: 5, compo: ["lanterne", "Filament"], desc: "Lanterne à filament offrant un éclairage propre et constant." }, 
            { nom: "Anneau électroactif", int: 8, compo: ["Anneau de cuivre", "Petite batterie"], desc: "Anneau de cuivre boostant la puissance et les réflexes." }, 
            { nom: "Spectromètre de flux", int: 11, compo: ["Boussole", "Petit compsoant électrique"], desc: "Appareil sensible détectant les perturbations magiques." }, 
            { nom: "Bâton électrique", int: 13, compo: ["Bâton", "Grande batterie"], desc: "Bâton avec condensateur libérant un choc à l'impact." }, 
            { nom: "Chapeau d'inversion", int: 15, compo: ["Haut-de-forme", "Bobine électrique"], desc: "Haut-de-forme protégeant contre les balles et flèches par magnétisme." }, 
            { nom: "Veste de soins", int: 17, compo: ["Armure de cuir", "Harnais électrique"], desc: "Veste utilisant l'énergie bio-électrique pour régénérer le corps." }, 
            { nom: "Bâton Tesla", int: 19, compo: ["Bâton électrique", "Bonine tesla"], desc: "Arme avancée projetant des rayons d'énergie paralysants." }
        ] 
    },
    "Botanique": { 
        desc: "Discipline qui étudie les organismes vivants et les effets produits par les substances naturelles sur ces organismes.", 
        schematics: [
            { nom: "Elixir de soins légers", int: 5, compo: ["racine de ginka", "tige de kadura"], desc: "Médicament de base pour soigner les blessures légères." }, 
            { nom: "Stimulant", int: 8, compo: ["feuilles de coca", "feuilles de tabac"], desc: "Produit augmentant temporairement les capacités physiques." }, 
            { nom: "Antidote", int: 11, compo: ["Poison", "tige de kadura"], desc: "Substance permettant de neutraliser les effets du poison." }, 
            { nom: "Limiteur de fatigue", int: 13, compo: ["Stimulant", "herbe à sorcière"], desc: "Préparation réduisant la perte de points de fatigue." }, 
            { nom: "Accélérateur de guérison", int: 15, compo: ["Stimulant", "herbe à sorcière"], desc: "Accélère la régénération naturelle des tissus." }, 
            { nom: "Drogue merveilleuse", int: 17, compo: ["Elixir de soins légers", "feuilles de coca"], desc: "Elixir puissant aux propriétés curatives avancées." }, 
            { nom: "Soin universel", int: 19, compo: ["Accélérateur de guérison", "graisse de serpent"], desc: "Le remède technologique ultime pour tous les maux." }
        ] 
    },
    "Thérapeutique": { 
        desc: "Discipline qui étudie les effets bénéfiques sur le corps des matériaux créés par l'homme.", 
        schematics: [
            { nom: "Elixir de persuasion", int: 5, compo: ["Thermomètre", "Remède contre la migraine"], desc: "Améliore temporairement le charisme et l'élocution." }, 
            { nom: "Elixir de prouesse", int: 8, compo: ["Flacon de Camphre", "Pilule sanguie"], desc: "Augmente la force physique de l'utilisateur." }, 
            { nom: "Liquide de perception", int: 11, compo: ["Glycéride", "Remède contre la migraine"], desc: "Affûte les sens et la vigilance du sujet." },
            { nom: "Fortifiant réflexes", int: 13, compo: ["Teinture d'Arnica", "Remède contre les rhumatisme"], desc: "Améliore la dextérité et la vitesse de réaction." }, 
            { nom: "Concentré de neurones", int: 15, compo: ["Elixir de persuasion", "Pillule nerveuse"], desc: "Augmente temporairement l'intelligence." }, 
            { nom: "Energisant", int: 17, compo: ["Elixir de prouesse", "Bouteille de quinine"], desc: "Redonne de la vigueur et de l'énergie au corps." }, 
            { nom: "Revitalisant", int: 19, compo: ["Energisant", "Concentré de neurones"], desc: "Restaure l'ensemble des facultés physiques et mentales." }
        ] 
    },
    "Chimie": { 
        desc: "Discipline qui étudie les substances élaborées par l'homme et leurs effets nuisibles.", 
        schematics: [
            { nom: "Energie", int: 5, compo: ["Solution électrolyte", "Plaque métallique"], desc: "Une électrolyse active placée dans une boîte métallique permet, même à l'utilisateur le plus ignorant, de bénéficier des avantages d'une source énergétique portable." }, 
            { nom: "Poison virulent", int: 8, compo: ["Nettoyant", "Eau de vie"], desc: "Substance toxique pouvant être appliquée sur des armes." }, 
            { nom: "Carburant", int: 11, compo: ["Vin", "Levure de brasseur"], desc: "Liquide inflammable utilisé pour divers engins technologiques." }, 
            { nom: "Hallucinite", int: 13, compo: ["Champignon", "Remède contre la toux"], desc: "Produit chimique provoquant des hallucinations chez la victime." }, 
            { nom: "Acide corrosif", int: 15, compo: ["Flacon de phénol", "Pilule de souffre"], desc: "Composé (phénol et soufre) qui ronge immédiatement les surfaces." }, 
            { nom: "Senteur animale", int: 17, compo: ["Flacon de parfum", "Mixture de brimure"], desc: "Mélange permettant de circuler parmi les bêtes sans être attaqué." }, 
            { nom: "Paralysant", int: 19, compo: ["Champignon", "Poison virulent"], desc: "Liquide (champignons et eau de vie) rendant l'ennemi impuissant." }
        ] 
    },
    "Explosifs": { 
        desc: "Discipline de recherche et de développement des substances instables.", 
        schematics: [
            { nom: "Balles", int: 5, compo: ["Charbon", "Salpêtre"], desc: "Munitions produites à partir de salpêtre et de charbon." }, 
            { nom: "Grenade aveuglante", int: 8, compo: ["Vin", "Magnésium"], desc: "Gadget au magnésium pour désorienter les adversaires." }, 
            { nom: "Grenade fumigène", int: 11, compo: ["Sucre", "Engrais"], desc: "Mixture générant un nuage de fumée pour couvrir une fuite." }, 
            { nom: "Grenade étourdissante", int: 13, compo: ["Salpêtre", "Acide stéarique"], desc: "Explosion de salpêtre étourdissant temporairement les ennemis." }, 
            { nom: "Grenade offensive", int: 15, compo: ["Poudre noire", "Boîte de fer"], desc: "Arme de destruction puissante utilisant du TNT et de la poudre." }, 
            { nom: "Ecran de feu", int: 17, compo: ["Savon liquide", "Carburant"], desc: "Mixture inflammable créant un mur de flammes défensif." }, 
            { nom: "Dynamite", int: 19, compo: ["Salpêtre", "Nitroglycérine"], desc: "Explosif puissant pouvant être fixé sur des structures." }
        ] 
    }
};