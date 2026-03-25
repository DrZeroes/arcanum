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
		{nom:"???", int:5, compo:"?", desc:"???"}, 
		{nom:"???", int:8, compo:"?", desc:"???"}, 
		{nom:"???", int:11, compo:"?", desc:"???"}, 
		{nom:"???", int:13, compo:"?", desc:"???"}, 
		{nom:"???", int:15, compo:"?", desc:"???"}, 
		{nom:"???", int:17, compo:"?", desc:"???"}, 
		{nom:"???", int:19, compo:"?", desc:"???"}
		] 
		},
	"Armurerie": { 
		desc: "Discipline couvrant tous les aspects de la conception et de la fabrication de nouvelles armes.", 
		schematics: [
			{nom:"???", int:5, compo:"?", desc:"???"}, 
			{nom:"???", int:8, compo:"?", desc:"???"}, 
			{nom:"???", int:11, compo:"?", desc:"???"}, 
			{nom:"???", int:13, compo:"?", desc:"???"}, 
			{nom:"???", int:15, compo:"?", desc:"???"}, 
			{nom:"???", int:17, compo:"?", desc:"???"}, 
			{nom:"???", int:19, compo:"?", desc:"???"}
			] 
			},
    "Electricité": { 
		desc: "Discipline explorant les mystères des particules électriques et du magnétisme.", 
		schematics: [
			{nom:"???", int:5, compo:"?", desc:"???"}, 
			{nom:"???", int:8, compo:"?", desc:"???"}, 
			{nom:"???", int:11, compo:"?", desc:"???"}, 
			{nom:"???", int:13, compo:"?", desc:"???"}, 
			{nom:"???", int:15, compo:"?", desc:"???"}, 
			{nom:"???", int:17, compo:"?", desc:"???"}, 
			{nom:"???", int:19, compo:"?", desc:"???"}
			] 
			},
    "Botanique": { 
		desc: "Discipline qui étudie les organismes vivants et les effets produits par les substances naturelles sur ces organismes.", 
		schematics: [
			{nom:"???", int:5, compo:"?", desc:"???"}, 
			{nom:"???", int:8, compo:"?", desc:"???"}, 
			{nom:"???", int:11, compo:"?", desc:"???"}, 
			{nom:"???", int:13, compo:"?", desc:"???"}, 
			{nom:"???", int:15, compo:"?", desc:"???"}, 
			{nom:"???", int:17, compo:"?", desc:"???"}, 
			{nom:"???", int:19, compo:"?", desc:"???"}
			] 
			},
    "Thérapeutique": { 
		desc: "Discipline qui étudie les effets bénéfiques sur le corps des matériaux créés par l'homme.", 
		schematics: [
			{nom:"???", int:5, compo:"?", desc:"???"}, 
			{nom:"???", int:8, compo:"?", desc:"???"}, 
			{nom:"???", int:11, compo:"?", desc:"???"},
			{nom:"???", int:13, compo:"?", desc:"???"}, 
			{nom:"???", int:15, compo:"?", desc:"???"}, 
			{nom:"???", int:17, compo:"?", desc:"???"}, 
			{nom:"???", int:19, compo:"?", desc:"???"}
			] 
			},
    "Chimie": { 
		desc: "Discipline qui étudie les substances élaborées par l'homme et leurs effets nuisibles.", 
		schematics: [
			{nom:"???", int:5, compo:"?", desc:"???"}, 
			{nom:"???", int:8, compo:"?", desc:"???"}, 
			{nom:"???", int:11, compo:"?", desc:"???"}, 
			{nom:"???", int:13, compo:"?", desc:"???"}, 
			{nom:"???", int:15, compo:"?", desc:"???"}, 
			{nom:"???", int:17, compo:"?", desc:"???"}, 
			{nom:"???", int:19, compo:"?", desc:"???"}
			] 
			},
    "Explosifs": { 
		desc: "Discipline de recherche et de développement des substances instables.", 
		schematics: [
			{nom:"???", int:5, compo:"?", desc:"???"}, 
			{nom:"???", int:8, compo:"?", desc:"???"}, 
			{nom:"???", int:11, compo:"?", desc:"???"}, 
			{nom:"???", int:13, compo:"?", desc:"???"}, 
			{nom:"???", int:15, compo:"?", desc:"???"}, 
			{nom:"???", int:17, compo:"?", desc:"???"}, 
			{nom:"???", int:19, compo:"?", desc:"???"}
			] 
			}
};