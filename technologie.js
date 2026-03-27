const techData = {
    "Forge": {
        desc: "Discipline ayant trait à la construction d'armures.",
        schematics: [
            { nom: "Pur Alliage", int: 5, compo: "Acier + Pierre ancienne", desc: "Les techniques de fonderie ont tellement progressé au cours du dernier siècle qu'il est possible de créer des alliages si purs que l'utilisation d'autres substances serait une disgrâce pour les arts de la forge. Telles sont les propriétés du pur alliage, un amalgame de fer et d'acier qui permet de bénéficier d'une résistance accrue ainsi que d'une plus grande légèreté." },
            { nom: "Épée équilibrée", int: 8, compo: "? + ?", desc: "Utilisant tous les avantages des propriétés du pur alliage, l'épée équilibrée permet de bénéficier d'une grande rapidité, d'une formidable précision et du confort offert par sa superbe garde. Vous avez l'assurance de pouvoir quitter un champ de bataille tandis que vos adversaires, blessés et défigurés, restent médusés devant votre arme." },
            { nom: "Hache ultralégère", int: 11, compo: "? + ?", desc: "Les technologistes nains nous fournissent souvent des objets particulièrement utiles et innovants. La hache ultralégère ne fait pas exception. En combinant du minerai de nain et un manche de hache en chêne, on obtient une arme mortelle ne pesant que la moitié du poids d'une hache normale ! Mutiler et décapiter n'a jamais été aussi facile." },
            { nom: "Gantelets de nain", int: 13, compo: "? + ?", desc: "Encore une fois, l'esprit des nains nous livre un objet technologique sans égal ! Les gantelets de nain, association d'une feuille métallique et d'une paire de gants de cuir, augmentent considérablement la puissance au corps à corps quand cela est nécessaire ! Quand votre vieille épée finit par se rompre, vos gantelets de nain sont là pour vous permettre de gagner." },
            { nom: "Heaume de vision", int: 15, compo: "? + ?", desc: "Les donjons ténébreux vous ont-ils été fatals ? Vous a-t-on déjà tendu une embuscade dans une forêt brumeuse ? Eh bien, ce temps-là est révolu ! Le heaume de vision, combinaison d'un heaume de qualité et de sangles de cuir, vous permet de bénéficier d'une vision inégalée, et surtout dégagée, en cas de besoin." },
            { nom: "Cotte de mailles légère", int: 17, compo: "? + ?", desc: "La cotte de mailles a toujours été le choix des aventuriers exigeants et privilégiant la mobilité. Désormais, avec la cotte de mailles légère, faite à partir d'une bobine de fil robuste et de sangles de cuir, ces mêmes aventuriers peuvent combattre avec une protection identique, mais avec un poids réduit de moitié ! Après avoir massacré vos adversaires les plus lents, vous ne pourrez plus vous en passer." },
            { nom: "Cuirasse d'élite", int: 19, compo: "? + ?", desc: "Les secrets des armuriers nains enfin dévoilés ! La cuirasse d'élite, composée d'une feuille de métal de nain et d'une armure de cuir, offre à son porteur une protection inégalée tout en lui permettant de se déplacer sans faire autant de bruit qu'une cuirasse normale. Jamais vous n'avez bénéficié d'une telle protection et d'autant de puissance de frappe." }
        ]
    },
    "Mécanique": { 
		desc: "Discipline consistant à fabriquer des engins en utilisant des moyens mécaniques.", 
		schematics: [
		{nom:"Piège à piques", int:5, compo:"?", desc:"Dispositif simple blessant quiconque marche dessus."}, 
		{nom:"Passe-partout auto.", int:8, compo:"?", desc:"Outil facilitant grandement le crochetage des serrures."}, 
		{nom:"Déclencheur de piège", int:11, compo:"?", desc:"Boîtier à ressort pour activer les pièges à distance."}, 
		{nom:"Piège à ours", int:13, compo:"?", desc:"Pince métallique immobilisant et blessant la proie."}, 
		{nom:"Leurre mécanique", int:15, compo:"?", desc:"Dispositif à ressort créant une diversion sonore."}, 
		{nom:"Méca-lorgnon", int:17, compo:"?", desc:"Lunettes augmentant la perception de jour comme de nuit."}, 
		{nom:"Méca-arachnide", int:19, compo:"?", desc:"Automate de combat hydraulique à vapeur avec griffes."}
		] 
		},
	"Armurerie": { 
		desc: "Discipline couvrant tous les aspects de la conception et de la fabrication de nouvelles armes.", 
		schematics: [
			{nom:"Pistolet à silex", int:5, compo:"?", desc:"Arme à feu rudimentaire fabriquée avec des pièces de récupération."}, 
			{nom:"Revolver de choix", int:8, compo:"?", desc:"Pistolet bien équilibré destiné aux tireurs sérieux."}, 
			{nom:"Fusil à répétition", int:11, compo:"?", desc:"Fusil permettant de tirer plusieurs coups rapidement."}, 
			{nom:"Revolver silencieux", int:13, compo:"?", desc:"Arme à feu modifiée pour réduire le bruit de la détonation."}, 
			{nom:"Fusil à lunette", int:15, compo:"?", desc:"Fusil de précision équipé d'un système de visée optique."}, 
			{nom:"Canon portable", int:17, compo:"?", desc:"Arme lourde infligeant des dégâts massifs."}, 
			{nom:"Fusil éléphant", int:19, compo:"?", desc:"Arme de très gros calibre pour les cibles les plus résistantes."}
			] 
			},
    "Electricité": { 
		desc: "Discipline explorant les mystères des particules électriques et du magnétisme.", 
		schematics: [
			{nom:"Lampe électrique", int:5, compo:"?", desc:"Lanterne à filament offrant un éclairage propre et constant."}, 
			{nom:"Anneau électroactif", int:8, compo:"?", desc:"Anneau de cuivre boostant la puissance et les réflexes."}, 
			{nom:"Spectromètre de flux", int:11, compo:"?", desc:"Appareil sensible détectant les perturbations magiques."}, 
			{nom:"Bâton électrique", int:13, compo:"?", desc:"Bâton avec condensateur libérant un choc à l'impact."}, 
			{nom:"Chapeau d'inversion", int:15, compo:"?", desc:"Haut-de-forme protégeant contre les balles et flèches par magnétisme."}, 
			{nom:"Veste de soins", int:17, compo:"?", desc:"Veste utilisant l'énergie bio-électrique pour régénérer le corps."}, 
			{nom:"Bâton Tesla", int:19, compo:"?", desc:"Arme avancée projetant des rayons d'énergie paralysants."}
			] 
			},
    "Botanique": { 
		desc: "Discipline qui étudie les organismes vivants et les effets produits par les substances naturelles sur ces organismes.", 
		schematics: [
			{nom:"Elixir de soins légers", int:5, compo:"?", desc:"Médicament de base pour soigner les blessures légères."}, 
			{nom:"Stimulant", int:8, compo:"?", desc:"Produit augmentant temporairement les capacités physiques."}, 
			{nom:"Antidote", int:11, compo:"?", desc:"Substance permettant de neutraliser les effets du poison."}, 
			{nom:"Limiteur de fatigue", int:13, compo:"?", desc:"Préparation réduisant la perte de points de fatigue."}, 
			{nom:"Accélérateur de guérison", int:15, compo:"?", desc:"Accélère la régénération naturelle des tissus."}, 
			{nom:"Drogue merveilleuse", int:17, compo:"?", desc:"Elixir puissant aux propriétés curatives avancées."}, 
			{nom:"Soin universel", int:19, compo:"?", desc:"Le remède technologique ultime pour tous les maux."}
			] 
			},
    "Thérapeutique": { 
		desc: "Discipline qui étudie les effets bénéfiques sur le corps des matériaux créés par l'homme.", 
		schematics: [
			{nom:"Elixir de persuasion", int:5, compo:"?", desc:"Améliore temporairement le charisme et l'élocution."}, 
			{nom:"Elixir de prouesse", int:8, compo:"?", desc:"Augmente la force physique de l'utilisateur."}, 
			{nom:"Liquide de perception", int:11, compo:"?", desc:"Affûte les sens et la vigilance du sujet."},
			{nom:"Fortifiant réflexes", int:13, compo:"?", desc:"Améliore la dextérité et la vitesse de réaction."}, 
			{nom:"Concentré de neurones", int:15, compo:"?", desc:"Augmente temporairement l'intelligence."}, 
			{nom:"Energisant", int:17, compo:"?", desc:"Redonne de la vigueur et de l'énergie au corps."}, 
			{nom:"Revitalisant", int:19, compo:"?", desc:"Restaure l'ensemble des facultés physiques et mentales."}
			] 
			},
    "Chimie": { 
		desc: "Discipline qui étudie les substances élaborées par l'homme et leurs effets nuisibles.", 
		schematics: [
			{nom:"Energie", int:5, compo:"?", desc:" Une électrolyse active placée dans une boîte métallique permet, même à l'utilisateur le plus ignorant, de bénéficier des avantagesd'une source énergétique portabl"}, 
			{nom:"Poison virulent", int:8, compo:"?", desc:"Substance toxique pouvant être appliquée sur des armes."}, 
			{nom:"Carburant", int:11, compo:"?", desc:"Liquide inflammable utilisé pour divers engins technologiques."}, 
			{nom:"Hallucinite", int:13, compo:"?", desc:"Produit chimique provoquant des hallucinations chez la victime."}, 
			{nom:"Acide corrosif", int:15, compo:"?", desc:"Composé (phénol et soufre) qui ronge immédiatement les surfaces."}, 
			{nom:"Senteur animale", int:17, compo:"?", desc:"Mélange permettant de circuler parmi les bêtes sans être attaqué."}, 
			{nom:"Paralysant", int:19, compo:"?", desc:"Liquide (champignons et eau de vie) rendant l'ennemi impuissant.
			
			"}
			] 
			},
    "Explosifs": { 
		desc: "Discipline de recherche et de développement des substances instables.", 
		schematics: [
			{nom:"Balles", int:5, compo:"?", desc:"Munitions produites à partir de salpêtre et de charbon."}, 
			{nom:"Grenade aveuglante", int:8, compo:"", desc:"Gadget au magnésium pour désorienter les adversaires."}, 
			{nom:"Grenade fumigène", int:11, compo:"?", desc:"Mixture générant un nuage de fumée pour couvrir une fuite."}, 
			{nom:"Grenade étourdissante", int:13, compo:"?", desc:"Explosion de salpêtre étourdissant temporairement les ennemis."}, 
			{nom:"Grenade offensive", int:15, compo:"?", desc:"Arme de destruction puissante utilisant du TNT et de la poudre."}, 
			{nom:"Ecran de feu", int:17, compo:"?", desc:"Mixture inflammable créant un mur de flammes défensif."}, 
			{nom:"Dynamite", int:19, compo:"?", desc:"Explosif puissant pouvant être fixé sur des structures."}
			] 
			}
};