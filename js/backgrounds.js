const backgrounds = [
    { 
        nom: "Standard", 
        rest: {}, 
        mod: {}, 
        desc: "Aucun passé particulier.",
        effets: "-"
    },
    { 
        nom: "Affiche de Nietzsche Enfant", 
        rest: {pasRaces:["Ogre"]}, 
        mod: {}, 
        desc: "Nietzsche a dit un jour : « Ce qui ne me tue pas me rend plus fort », et il faisait peut-être référence à vous. Toute ta vie tu as fait des erreurs, mais tu sembles toujours t'en sortir mieux après. En d’autres termes, vous aurez plus échec critique que la normale mais vous gagnez plud rapidement del'expérience.",
        effets: "Bonus de points d'expérience +10 % / % de chances d'échec critique +20"
    },
    { 
        nom: "Agoraphobe", 
        rest: {races:["Humain", "Nain", "Gnome", "Halfelin"]}, 
        mod: {IN:2}, 
        desc: "Vous avez peur des espaces ouverts. Quand vous étiez enfant, vous sortiez rarement et passiez votre temps à lire et à étudier, ce qui vous rapportait un bonus Intelligence. Vous allez bien si vous êtes à l'intérieur ou même dans une zone densément boisée, mais si vous entrez dans un espace extérieur ouvert, vous souffrez d'une crise de panique, entraînant des pénalités en Dextérité Intelligence, mais vous gagnez un bonus à Force du à la peur.",
        effets: "À l'intérieur ou sous la couverture de l'arbre : IN +2 / Espace ouvert extérieur : IN -2, DX -2, FO +2"
    },
    { 
        nom: "Allergie à la magie", 
        rest: {pasRaces:["Elfe", "Demi-Elfe"]}, 
		mod: { align: -15 }, // Tire vers la techno       
		desc: "Vous êtes gravement allergique aux objets magiques, de sorte que les toucher vous cause de la douleur. C’est pourquoi vous vous consacrez à la technologie depuis votre plus jeune âge et avez développé un talent pour cela. Vous gagnez un bonus de +10 % à la Technologie mais vous ne pouvez manier AUCUN objet magique.",
        effets: "Impossible d'équiper votre personnage d'objets magiques."
    },
    { 
        nom: "Apprenti chez un commerçant", 
        rest: {pasRaces:["Ogre"]}, 
        mod: {DX:-1, bonusComp: { marchandage: 3 } }, 
        desc: "En passant toute votre enfance dans un magasin, vous bénéficiez d'un bonus exceptionnel pour Marchander, mais vous subissez une pénalité de Dextérité.",
        effets: "-"
    },
    { 
        nom: "Apprenti chez un forgeron", 
        rest: {pasRaces:["Ogre"]}, 
        mod: {FO:1, DX:-2, bonusComp: { reparation: 2 }}, 
        desc: "Votre maître est un homme dur. Vous gagnez un bonus de Force et un bonus à votre coméptence de Réparation, mais vous subissez une pénalité de Dextérité en raison du travail pénible et répétitif.",
        effets: "-"
    },
    { 
        nom: "Bandit", 
        rest: {races:["Humain", "Demi-Orque", "Orque", "Demi-Elfe"]}, 
		mod: { CH: -1, bonusComp: { armes_a_feu: 2 }, argent: 0, 
		items: [
                { id: "AF01", qte: 1 },
                { id: "MUN01", qte: 10 }
            ]
			},
        desc: "Vous êtes un bandit armé. Votre style de vie vous a valu un bonus en Armes à feu, ainsi qu'une pénalité de Charisme. Vous avez enfreint la loi et êtes arrivé à l'IFS Zephyr avec une longueur d'avance sur les autorités. Vous avez votre arme et quelques munitions, mais vous n'avez pas d'argent.",
        effets: "-"
    },
    { 
        nom: "Barbare", 
        rest: {pasRaces:["Elfe"]}, 
		mod: { FO: 2, CN: 1, IN: -1, CH: -2, bonusComp: { melee: 1, marchandage: -2 }, argent: 100, 		
		items: [
                { id: "DEF02", qte: 1 }
            ]
			},
		desc: "Vous avez été élevé au sein d’une tribu barbare sauvage dans un pays lointain. Personne ne sait comment ni pourquoi vous êtes devenu passager à bord de l'IFS Zephyr, mais compte tenu de votre comportement féroce, personne n'a essayé de le découvrir. Vous gagnez des bonus de Force et Constitution et un léger bonus en Mêlée, tout en subissant des sanctions en Intelligence, Charisme, et une pénalité à Marchander. Vous possédez également armure barbare mais moins d'argent que les autres personnages.",
        effets: "-"
    },
    { 
        nom: "Battu avec un bâton moche", 
        rest: {pasRaces:["Ogre"]}, 
        mod: {CH:-6, FO:2, DX:2, bonusCompCat: { cat: "Combat", val: 1 }}, 
        desc: "Tu es moche. Il n’y a tout simplement pas d’autre mot pour cela, à moins que vous ne considériez « hideux » comme un meilleur mot. Les enfants vous fuient terrorisés et même les âmes les plus gentilles ont du mal à supporter longtemps votre présence. En raison de votre visage, vous subissez une pénalité extrême en Charisme, mais comme vous avez dû vous défendre contre des attaques fréquentes, vous gagnez un bonus de Force, Dextérité, et un léger bonus à toutes vos Compétences de combat.",
        effets: "-"
    },
    { 
        nom: "Brute", 
        rest: {pasRaces:["Orque", "Demi-Orque", "Ogre", "Demi-Ogre"]}, 
        mod: {IN:-1, FO:1}, 
        desc: "Tu étais la brute de la classe, grand et stupide. L’extorsion et l’intimidation vous ont donné un bonus de Force, mais amener les gens à faire vos devoirs à votre place vous laisse avec un malus en Intelligence.",
        effets: "-"
    },
    { 
        nom: "Peau dure", 
        rest: {races:["Orque", "Demi-Orque", "Ogre", "Demi-Ogre"]}, 
        mod: {CH:-1, resPhys: 10}, 
        desc: "Tu es né avec une peau épaisse et brutale. Bien que votre résistance aux dégâts soit plus importants que la plupart, vous prenez malheureusement une pénalité en Charisme.",
        effets: "-"
    },
    { 
        nom: "Débutante", 
        rest: {sexe:"F"}, 
        mod: {CH:4, FO:-1, DX:-1, bonusCompCat: { cat: "Combat", val: -2 }}, 
        desc: "Votre famille est l’une des plus influentes de tout Arcanum. En tant que jeune débutante, vous avez des bonus en Charisme. Bien sûr, la vie facile vous a rendu doux d’esprit et de corps. Vous avez des pénalités en Force, Dextérité, et toutes vos Compétences de combat.",
        effets: "-"
    },
    { 
        nom: "Demi-ogre sauvage", 
        rest: {races:["Demi-Ogre"]}, 
        mod: {FO:1, CH:-1}, 
        desc: "Vous êtes né d'une mère ogre et avez vécu avec un clan ogre jusqu'à très récemment. Par rapport à vos frères plus civilisés, vous gagnez un bonus de Force, mais vous subissez une pénalité pour votre Charisme.",
        effets: "-"
    },
    { 
        nom: "Disciple elfe noir", 
        rest: {races:["Elfe"]}, 
        mod: {IN:2, CH:-2}, 
        desc: "Vous croyez en la philosophie des elfes noirs, selon laquelle la technologie doit être détruite à tout prix. Cette foi a renforcé votre détermination, inteligence, mais l’essor récent de la technologie vous a rendu amer, Charisme.",
        effets: "-"
    },
    { 
        nom: "Docteur fou", 
        rest: {pasRaces:["Ogre"]}, 
        mod: {IN:3, CH:-1, DX:-2, CN:-3, bonusComp: { soins: 4 }, resElec:20 , resPoison:20}, 
        desc: "Vous avez effectué de nombreuses expériences médicales dangereuses et non testées sur vous-même et souffrez des effets indésirables. Vous avez des bonus en Intelligence, résistance au Poison et électricité et un bonus à votre coméptence de soin, mais vous subissez des pénalités en Charisme, Dextérité, et Constitution.",
        effets: "-"
    },
    { 
        nom: "Élevé dans les fosses", 
        rest: {}, 
        mod: {IN:-6, FO:2, DX:2, bonusCompCat: { cat: "Combat", val: 1 }, argent :100, 
		items: [
                { id: "AM01", qte: 1 }
            ]
			}, 
        desc: "En tant que vétéran des combats locaux, vous gagnez un bonus en Force, Dextérité, et un bonus à toutes les Compétences de combat. Les combats acharnés ont également eu des conséquences néfastes. Un traumatisme crânien vous donne une lourde pénalité en Intelligence. En conséquence, vous n’êtes pas particulièrement doué avec l’argent. Toutes vos économies s'élèvent à seulement 100 pièces et votre arme de combat.",
        effets: "-"
    },
    { 
        nom: "Élevé par des elfes", 
        rest: {races:["Humain"]}, 
        mod: {bonusCompCat: { cat: "Technologie", val: -1 },
				items: [
                { id: "DEF03", qte: 1 }
            ]
			}, 
        desc: "Vous commencez avec un magnifique costume de cotte de mailles elfique magique, mais subir une légère pénalité pour tous Compétences technologiques.",
        effets: "-"
    },
    { 
        nom: "Élevé par des maîtres-serpents", 
        rest: {}, 
        mod: {CH:-1, resPoison :20}, 
        desc: "Vous recevez une augmentation de Résistances au poison, mais subissez une pénalité pour votre Charisme en raison du grand nombre de cicatrices de morsures sur vos bras et vos jambes.",
        effets: "-"
    },
    { 
        nom: "Élevé par des moines", 
        rest: {pasRaces:["Ogre"]}, 
        mod: {CN:1, argent: 100}, 
        desc: "La piété a ses avantages et ses inconvénients. Vous gagnez un bonus en Constitution, mais renoncer au monde matériel ne vous laisse qu’un quart de la richesse de départ normale.",
        effets: "-"
    },
    { 
        nom: "Élevé par des orcs", 
        rest: {races:["Humain", "Gnome", "Halfelin", "Demi-Orque", "Orque", "Demi-Ogre", "Ogre"]}, 
        mod: {CH:-6, FO:2, DX:1 , bonusCompCat: { cat: "Combat", val: 1 }}, 
        desc: "Vous étiez un orphelin en fuite, sans abri et affamé, lorsqu'une famille orque dans la nature vous a accueilli et élevé. Leurs manières brutales vous ont laissé avec une augmentation en Force et Dexterité, et vous a également accordé un léger bonus à toutes les Compétences de combat. Malheureusement, votre éducation a également eu des conséquences néfastes sur votre personnalité, et vous êtes passible d'une lourde sanction en Charisme.",
        effets: "-"
    },
    { 
        nom: "Elfe dandy", 
        rest: {races:["Elfe"]}, 
        mod: {DX:-1, bonusComp: { persuasion: 2 } }, 
        desc: "Élevé en ville, vous perdez le bonus elfique de dextérité mais gagnez un bonus à Persuasion.",
        effets: "-"
    },
    { 
        nom: "Enfance protégée", 
        rest: {pasRaces:["Nain", "Ogre", "Demi-Ogre"]}, 
        mod: {FO:-6, IN:4, CH:1}, 
        desc: "Vous étiez roucoulé et choyé sans cesse quand vous étiez enfant. En raison d’une parentalité surprotectrice, vous subissez une lourde sanction en Force, mais, étant plus sensible, vous avez des bonus en Intelligence, et Charisme.",
        effets: "-"
    },
    { 
        nom: "Enfant d'un héros", 
        rest: {}, 
        mod: {
				items: [
                { id: "AM03", qte: 1 }
            ]
		}, 
        desc: "Vous commencez avec l'épée de votre père et êtes connu dans tout le pays comme l'enfant d'un héros. Par conséquent, vous subirez une terrible réaction négative pour tout acte maléfique.",
        effets: "Mauvaise réaction x2"
    },
    { 
        nom: "Enfant sauvage", 
        rest: {races:["Humain", "Demi-Elfe", "Gnome", "Demi-Orque", "Orque", "Demi-Ogre", "Ogre"]}, 
        mod: {IN:-6, DX:3 , bonusComp: { persuasion: -1 , marchandage : -1, discretion: 1, vol_a_la_tire: 1 } , argent: 200}, 
        desc: "Enfant, tes parents t'ont abandonné au milieu de la forêt. Avoir été élevé par une meute de loups vous donne un bonus considérable en Dextérité ainsi que de légers bonus dans les compétences discretion et Pick Pocket. Mais, inconscient des bonnes manières à table et des règles de la bonne société, vous recevez une lourde pénalité en Intelligence ainsi que de légères pénalités dans les compétences de Persuasion et Marchandage. Vous commencez avec la moitié de la richesse de départ normale.",
        effets: "-"
    },
    { 
        nom: "Enfant unique", 
        rest: {pasRaces:["Ogre"]}, 
        mod: {IN:6, CH:-4 , bonusComp: { persuasion: -2 , marchandage : -2 } }, 
        desc: "Vous avez grandi en tant qu'enfant unique de parents très permissifs et vous avez toujours obtenu ce que vous vouliez. En tant qu'adulte, vous n'attendez rien de moins qu'une obéissance totale de ceux qui vous entourent, gagnant un bonus à Inelligence (+6), mais votre tempérament laisse beaucoup à désirer, ce qui entraîne des pénalités pour votre Charisme et vos coméptencves de Persuasion et Marchandage.",
        effets: "-"
    },
    { 
        nom: "Envoyé à l'école de charme", 
        rest: {sexe:"F", races:["Humain"]}, 
        mod: {CH:3, IN:-1, FO:-2}, 
        desc: "Au lieu d’une éducation générale, vous avez été envoyé dans une école de charme. Vous gagnez du Charisme, mais vous perdez des points en Intelligence et Force.",
        effets: "-"
    },
    { 
        nom: "Évadé d'usine", 
        rest: {races:["Orque", "Demi-Orque"]}, 
        mod: {FO:1, argent : 50}, 
        desc: "Vous étiez esclave dans une usine jusqu'à une récente évasion. Vous avez peu d'argent, mais vous gagnez un bonus en Force.",
        effets: ""
    },
    { 
        nom: "Formation militaire", 
        rest: {pasRaces:["Ogre", "Demi-Ogre"]}, 
        mod: {FO:1, DX:-1 , bonusComp: { arc: 1 , melee : 1 }}, 
        desc: "Vous avez reçu une formation militaire pendant votre jeunesse, mais vous avez été renvoyé pour avoir les pieds plats. Vous gagnez des bonus en Force, ainsi que de légers bonus en compétence d'Arc et Mêlée, mais vous avez une pénalit de Dextérité.",
        effets: "-"
    },
    { 
        nom: "Garçon Tomboy", 
        rest: {sexe:"F"}, 
        mod: {FO:1, CN:-1}, 
        desc: "Quand tu étais petite, tu jouais toujours à des jeux avec les garçons. En tant que femme, vous pouvez tenir tête à n’importe quel homme et vous avez évité le rôle féminin stéréotypé dans la société. Ce contexte annule l’effet de genre en augmentant la Force tout en diminuant Constitution.",
        effets: "-"
    },
    { 
        nom: "Garde du corps libéré", 
        rest: {races:["Demi-Ogre", "Ogre"]}, 
        mod: {IN:-1, argent : 500}, 
        desc: "Votre maître gnome est récemment décédé et, dans son testament, vous avez été libéré de la servitude et vous avez reçu un petit don monétaire. Cependant, vous n'êtes pas très intelligent.",
        effets: "-"
    },
    { 
        nom: "Gnome privé de ses droits", 
        rest: {races:["Gnome"]}, 
        mod: {FO:2  , bonusComp: { marchandage : -2 } }, 
        desc: "Vous ne faites pas partie de la bourgeoisie capitaliste gnome et avez plutôt grandi comme journalier. Vous subissez une pénalité pour Marchander, mais gagnez un bonus de Force.",
        effets: "-"
    },
    { 
        nom: "Héritage", 
        rest: {}, 
        mod: {IN:-1, argent : 900}, 
        desc: "Vous êtes devenu orphelin quand vous étiez jeune enfant et avez hérité de beaucoup d’argent. La vie facile vous a coûté une pénalité en intelligence. La majeure partie de l’argent a déjà été dépensée, mais vous commencez avec deux fois la richesse de départ normale.",
        effets: "-"
    },
    { 
        nom: "Hydrophobe", 
        rest: {races:["Humain", "Nain", "Gnome", "Halfelin", "Orque", "Demi-Orque"]}, 
        mod: {bonusComp: { persuasion : 2 }}, 
        desc: "Vous avez mortellement peur de l’eau et de la noyade. Enfant, vous inventiez constamment des raisons pour éviter d'entrer même dans des eaux peu profondes, gagnant ainsi un bonus de Persuasion. Si vous vous retrouvez dans l'eau, vous subissez une crise de panique, entraînant des pénalités en Dextérité, Intelligence mais vous gagnez un bonus à Force sous l'effet de la peur.",
        effets: "Dans l'eau : IN -2, DX -2, FO +2"
    },
    { 
        nom: "Hyperactif", 
        rest: {}, 
        mod: {CH:-1, vitesse : 3}, 
        desc: "Vous êtes constamment occupé. Votre Vitesse est plus élevé que la normale, mais la plupart des gens vous trouvent ennuyeux, et votre Charisme en souffre.",
        effets: "-"
    },
    { 
        nom: "Idiot Savant", 
        rest: {races:["Humain"]}, 
        mod: {IN:2, FO:-1, CN:-1, DX:-2, argent:0, bonusComp: { jeu : 3 } }, 
        desc: "Vous avez été interné très jeune et considéré comme handicapé mental. Après plusieurs années, l'institut a perdu son financement et vous avez été mis à la rue avec rien d'autre que des vêtements sur le dos. Vous êtes brillant et maîtrisez parfaitement les nombres et les mathématiques, mais vous êtes à peine capable de parler. Vous gagnez un bonus important à l'Intelligence et un bonus exceptionnel à votre coméptence de Jeu d'argent. Cependant, des années d’enfermement vous font souffrir physiquement et émotionnellement. Vous agissez comme si vous aviez une intelligence bien inférieure (Dialogue stupide et Manuels techniques pénalité), et vous subissez des pénalités en Force, Constitution, Dextérité.",
        effets: "Dialogue stupide"
    },
    { 
        nom: "Je me suis enfui avec le cirque", 
        rest: {}, 
        mod: {FO:6, DX:2, IN:-4, CH:-2, CN:-2}, 
        desc: "Après vous être enfui avec une troupe locale d'artistes de cirque, vous avez acquis des compétences physiques considérables en Force, Dexterité mais présentent de graves lacunes en Intelligence, Charisme, et cosntituion à cause de toute la scolarité que vous avez manquée.",
        effets: "-"
    },
    { 
        nom: "Mage de jour", 
        rest: {pasRaces:["Nain"]}, 
        mod: {magieInit: { "Nécromancie blanche": 1}}, 
        desc: "Tu es né avec une Aptitude magique qui a une affinité pour le soleil. Pendant la journée, vous possédez un bonus à votre Aptitude Magique, mais la nuit, vous subissez une pénalité à votre Aptitude Magique.",
        effets: "Aptitude magique +20% le Jour, -20% la Nuit"
    },
    { 
        nom: "Mage de la nuit", 
        rest: {pasRaces:["Nain"]}, 
        mod: {magieInit: { "Nécromancie noire": 1}}, 
        desc: "Tu es né avec une aptitude en magie qui a une affinité pour la nuit. La nuit, vous possédez un bonus à votre Aptitude Magique, mais pendant la journée, vous subissez une pénalité à votre Aptitude Magique.",
        effets: "Aptitude magique +20% la Nuit, -20% le Jour"
    },
    { 
        nom: "Mage du ciel", 
        rest: {pasRaces:["Nain"]}, 
        mod: {magieInit: { "Air": 1}}, 
        desc: "Tu es né avec une aptitude en magie qui a une affinité pour le ciel ouvert. À l'extérieur et à la vue dégagée sur le ciel, vous possédez un bonus en Aptitude Magique. Mais sous terre, à l'intérieur ou même sous une forte canopée forestière, vous subissez une pénalité sur votre aptitude magique.",
        effets: "Aptitude magique +20% si ciel visible , -20% sinon"
    },
    { 
        nom: "Mage de la nature", 
        rest: {pasRaces:["Nain"]}, 
        mod: {magieInit: { "Nature": 1}}, 
        desc: "Tu es né avec une aptitude en magie qui a une affinité avec la nature. En vous tenant sur une surface naturelle, vous possédez un bonus à l'aptitude magique. Mais sur une surface artificielle, vous subissez une pénalitéur votre aptitude magique.",
        effets: "Aptitude magique +20% si sur surface naturelle, -20% sinon"
    },
    { 
        nom: "L'homme de la dame", 
        rest: {sexe:"M", pasRaces:["Ogre"]}, 
        mod: {CH:6, CN:-2, FO:-2, DX:-2}, 
        desc: "Les femmes s’évanouissent chaque fois qu’elles sont près de vous. Étant inhabituellement beau, vous gagnez un gros bonus en Charisme. Malheureusement, tout ce pomponnage et ce poudrage vous font manquer les vertus les plus viriles... vous perdez de la Constitution, Force, et Dextérité.",
        effets: "-"
    },
    { 
        nom: "La fiancée de Frankenstein", 
        rest: {sexe:"F", races:["Humain", "Demi-Orque"]}, 
        mod: {CH:4, CN:4, DX:-4, argent : 0 , resElec:20 , resPoison: 20 , resFeu: -20}, 
        desc: "Vous avez été réanimée par un savant fou pour être l'épouse de son autre création, mais d'une manière ou d'une autre, vous avez réussi à vous échapper avant le mariage. Vous êtes très bien construit, gagnant des bonus en charisme, Constitution, Résistance à l'electricité et au poison, mais vous avez un très lent, une connexion cerveau-larynx endommagée (Dialogue stupide), et une fragilité au feu Vous commencez également sans aucun argent.",
        effets: "-"
    },
    { 
        nom: "Lanceur de couteaux professionnel", 
        rest: {pasRaces:["Ogre"]}, 
        mod: {DX:-1, bonusComp: { lancer : 3 } }, 
        desc: "Vous travailliez comme lanceur de couteaux dans un cirque, jusqu'à perdre un œil dans un accident étrange. Malheureusement, vous perdezen dexterité, mais vous gagnez un bonus exceptionnel en Lancer.",
        effets: "-"
    },
    { 
        nom: "Le protégé de Charlatan", 
        rest: {pasRaces:["Orque", "Demi-Orque", "Ogre", "Demi-Ogre"]}, 
        mod: {CH:6, FO:-2, CN:-2 , bonusCompCat: { cat: "Combat", val: -1 } }, 
        desc: "Convaincu par un voyageur de commerce de devenir son apprenti, vous avez abandonné votre vie dans l'académie militaire dans laquelle vous étiez inscrit. Vous gagnez un bonus majeur en Charisme, mais perdre un peu de Force et Constitution, en plus d'infliger de légères pénalités à tous vos Compétences de combat.",
        effets: "-"
    },
    { 
        nom: "Maladif", 
        rest: {}, 
        mod: {IN:6, FO:-2, CN:-4, DX:-1}, 
        desc: "Mère Nature peut être une maîtresse dure. Étant né avec un système immunitaire extrêmement faible, vous avez des pénalités en Force, Constitution, et Dextérité. Mais tout n’est pas perdu. Les après-midi passés avec de la fièvre et un bon livre vous ont donné des sensations anormalement élevées, créant un gros bonus en Intelligence.",
        effets: "-"
    },
    { 
        nom: "Monstre de Frankenstein", 
        rest: {sexe:"M", races:["Humain", "Demi-Orque"]}, 
        mod: {FO:4, CN:4, DX:-6, resElec:20 , resPoison: 20 , resFeu: -20, argent : 0}, 
        desc: "Vous avez été réanimé par un savant fou à partir de diverses parties du corps qu'il a trouvées sur des tombes, mais d'une manière ou d'une autre, vous vous êtes échappé du laboratoire. Vous êtes très bien construit, gagnant des bonus en Force, Constitution, et Résistance au poison/elec  mais vous avez une tres basse Dextérité, une connexion cerveau-larynx endommagée et une faiblesse au feu Vous commencez également sans aucun argent.",
        effets: "Dialogue stupide"
    },
    { 
        nom: "Nain sans clan", 
        rest: {races:["Nain"]}, 
        mod: {bonusCompCat: { cat: "Technologie", val: -2 }, align: 15,
		items: [
                { id: "AM02", qte: 1 }
            ]
			}, 
        desc: "Vos parents n’appartenaient pas à un clan et ne voulaient pas en discuter les raisons. Vous ne gagnez aucun bonus nain à Compétences technologiques, mais vous commencez avec un excellent marteau de guerre nain.",
        effets: "-"
    },
    { 
        nom: "Naissance rare d'un demi-ogre", 
        rest: {races:["Demi-Ogre"]}, 
        mod: {IN:2, FO:-1, CN:-1}, 
        desc: "Vous êtes né d’une mère humaine, qui a miraculeusement survécu à votre naissance. Ayant grandi dans la ville, vous gagnez un bonus considérable en Intelligence. La vie en ville a également diminué votre férocité, et vous perdez des points en Force et Constitution.",
        effets: "-"
    },
    { 
        nom: "Né sous la bonne étoile", 
        rest: {}, 
        mod: {}, 
        desc: "Vous êtes né lors d’un événement astronomique étonnant. En conséquence, vous en ressentez moins coups critiques et ratés critiques, mais lorsque vous les obtenez, leurs résultats ont tendance à être spectaculaires.",
        effets: "Chance critique -10 / Effet critique +10"
    },
    { 
        nom: "Opération Miracle", 
        rest: {}, 
        mod: {IN:3, CH:3, FO:-3, DX:-3, CN:-5, bonusComp: { lancer : 2, armes_a_feu:2, detection_piege: 2, jeu :2 }}, 
        desc: "Bien que né dans une famille riche alors que vous étiez jeune enfant, vous avez mystérieusement perdu la vue. On a découvert que vous aviez contracté une maladie dégénérative et toujours mortelle. En tant qu’enfant aveugle, votre développement précoce a favorisé les activités intérieures et un développement digne des plus riches de la société. Vous avez gagné des bonus en Intelligence et Charisme. Vos sens du toucher, de l'ouïe et de l'odorat ont augmenté pour compenser votre cécité, ce qui a donné lieu à un bonus en detection de pièges, lancer, arme a feu et jeu. Cependant, vous avez souffert physiquement, ce qui a entraîné des pénalités en Force, Dextérité, et Constitution. En tant que jeune adulte, vos parents, par désespoir, ont payé les services d’un médecin renommé, quoique peu orthodoxe, qui vous a miraculeusement rendu la vue. L’opération a coûté sa fortune à votre famille, alors vous avez décidé de créer la vôtre.",
        effets: "-"
    },
    { 
        nom: "Orphelin halfelin", 
        rest: {races:["Halfelin"]}, 
        mod: {IN:-1, bonusComp: { vol_a_la_tire : 2}}, 
        desc: "Abandonné dans une grande ville quand vous étiez enfant, vous avez survécu au vol et n'avez jamais reçu d'éducation. Vous gagnez un bonus à Pick Pocket, mais a perdu un point en Intelligence.",
        effets: "-"
    },
    { 
        nom: "Personnalité extrême", 
        rest: {}, 
        mod: {}, 
        desc: "Vous possédez une personnalité extrême. les gens réagissent plus fortement en votre présence et ont tendance à vous aimer ou à vous détester.",
        effets: "Réaction +/- 30"
    },
    { 
        nom: "Personne spéciale", 
        rest: {}, 
        mod: {IN:-2}, 
        desc: "Vous avez subi des lésions cérébrales congénitales. Tu manques d'Intelligence, mais vous recevez plus d'éloges lorsque vous faites de bonnes actions (ce qui se traduit par une meilleure réaction des gens).",
        effets: "Bonus de bonnes réactions x2"
    },
    { 
        nom: "Peur du noir", 
        rest: {races:["Humain", "Halfelin"]}, 
        mod: {CN:2}, 
        desc: "Vous ne supportez pas d’être dans le noir. Vous restez constamment conscient de votre environnement, regardant dans les coins sombres et les ombres sombres pour voir s'il y a quelque chose. Bien que cela ait soulevé votre Constitution, vous subirez une crise de panique si vous vous trouvez dans une zone trop sombre, entraînant des pénalités de Dextérité, Intelligence mais vous gagnez un bonus de Force sous l'effet de la peur.",
        effets: "Dans le noir : IN -3, DX -2, FO +2"
    },
    { 
        nom: "Progéniture de troll", 
        rest: {}, 
        mod: {CH:-6, FO:2, CN:2, DX:1}, 
        desc: "Les dieux vous désapprouvaient à votre naissance. Affublé d'une apparence de troll, vous recevez de lourdes sanctions en Beauté et Charisme. Comme tout le monde semble penser que vous êtes engendré par des monstres ou pire, vous vous retrouvez souvent à repousser les chasseurs et les saints hommes et à gagner des bonus en Force, Constitution, et Dextérité.",
        effets: "-"
    },
    { 
        nom: "Pyromane", 
        rest: {races:["Humain", "Gnome", "Demi-Orque"]}, 
        mod: {FO:-1, CN:-1, resFeu:30, bonusComp: { lancer : 2}, techInit: { "Explosifs": 1 },
		items: [
                { id: "CONS01", qte: 1 }
            ]
			}, 
        desc: "Tu aimes le feu. Non, tu aimes le feu ! Feu ! Feu ! FEU ! Enfant, on vous harcelait toujours parce que vous étiez maigre et que vous receviez des pénalités en Force et Constitution, mais tu leur as montré ! Tu as étudié Explosifs et vous avez brûlé leurs maisons ! Je les ai brûlés jusqu'au sol ! Ha ha! Ensuite, vous vous êtes enfui de chez vous et vous êtes faufilé à bord de l'IFS Zephyr, qui semblait hautement inflammable et une excellente cible. Vous auriez probablement incendié le zeppelin s'il n'avait pas été abattu.",
        effets: "-"
    },
    { 
        nom: "Rat de bibliothèque", 
        rest: {pasRaces:["Orque", "Demi-Orque", "Ogre", "Demi-Ogre"]}, 
        mod: {IN:1,  bonusCompCat: { cat: "Combat", val: -1 },
				items: [
                { id: "DEF23", qte: 1 }
            ]
			},		
        desc: "Vous avez passé la majeure partie de votre vie à lire. Vous gagnez un bonus en Intelligence. Malheureusement, la myopie s'est installée et vous perdez en compétence de combats.",
        effets: "-"
    },
    { 
        nom: "Orques BG", 
        rest: {races:["Orque", "Demi-Orque"]}, 
        mod: {CH:2, FO:-2}, 
        desc: "Vous n’avez pas vraiment l’air très orque, mais vous êtes exceptionnellement maussade. Vous avez un bonus en charisme, mais subissez une pénalité pour votre Force.",
        effets: "-"
    },
    { 
        nom: "Sang elfique", 
        rest: {races:["Humain", "Gnome", "Halfelin", "Demi-Orque", "Demi-Ogre"]}, 
		mod: {align: 10, bonusCompCat: { cat: "Technologie", val: -1 }},
        desc: "L'arrière-grand-mère de ton père était une elfe. Vous obtenez une augmentation en Aptitude magique, mais subissent une légère pénalité pour tous Compétences technologiques.",
        effets: "-"
    },
    { 
        nom: "Top modèle", 
        rest: {sexe:"F"}, 
        mod: {CH:6, FO:-2, IN:-4}, 
        desc: "Vous êtes une femme incroyablement magnifique, et vous avez été choyée et dorlotée toute votre vie. Vous gagnez un énorme bonus en Beauté, Charisme au prix de la Force et l'Intelligence.",
        effets: "-."
    },
    { 
        nom: "Technophobie", 
        rest: {races:["Humain", "Demi-Elfe", "Demi-Orque", "Halfelin"]}, 
        mod: {FO:1, CN:1}, 
        desc: "Vous avez grandi dans une ferme de pommes de terre dans les eaux rustiques d’un pays lointain. Vous avez travaillé dur, gagnant un bonus en Force et Constitution, mais vous n’avez jamais expérimenté aucune technologie d’aucune sorte. Par la suite, vous avez peur de technologique objets et ne peut même pas se résoudre à en ramasser un.",
        effets: "Interdiction d'objets technologiques"
    },
    { 
        nom: "Un fou échappé", 
        rest: {races:["Humain"]}, 
        mod: {resPhys:25, resMagie:25, argent:0}, 
        desc: "Vous vous êtes échappé d'un asile de fous et vous vous êtes caché à bord de l'IFS Zephyr. Vous êtes extrêmement résistant  mais vous n'avez pas d'argent, vous avez volé vêtements bon marché, et la plupart des gens sont effrayés ou repoussés par vous.",
        effets: "/ Réaction -25 / Robe rustique"
    },
    { 
        nom: "Vendu ton âme", 
        rest: {}, 
        mod: {align:40 }, 
        desc: "Vous avez fait un pacte avec un démon. En échange de plus de pouvoir magique, vous avez consacré votre vie à la poursuite du mal. Vous gagnez Aptitude, magique mais souffrez de réaction négatives des autre.",
        effets: " Réaction -20 "
    },
    { 
        nom: "Nyctalopie", 
        rest: {}, 
        mod: {}, 
        desc: "Vos yeux sont trop sensibles à la lumière. Vous êtes presque aveugle à la lumière du jour, mais vous pouvez voir parfaitement dans l’obscurité. Par conséquent, toutes les pénalités d’éclairage de compétence sont annulées pour vous.",
        effets: "Lumière : -1 stats / Noir : +1 stats"
    },
    { 
        nom: "Ogre des montagnes", 
        rest: {races:["Ogre"]}, 
        mod: {FO:4, CN:4, DX:4, CH:-1, IN:-1, argent:0 , bonusComp: { melee : 2, esquive:2}}, 
        desc: "Vous vivez dans votre grotte quand vous avez entendu un gros crash dehors.",
        effets: "-"
    },
    { 
        nom: "Ogre cultivé", 
        rest: {races:["Ogre"]}, 
        mod: {IN:4, CH:2, CN:-4, DX:-4}, 
        desc: "Un ogre pur sang employé par un membre de l'élite des gnomes, passant son temps à lire.",
        effets: "-"
    },
    { 
        nom: "Gentil géant", 
        rest: {races:["Ogre"]}, 
        mod: {}, 
        desc: "Tout le monde voit dans tes yeux que tu es bon.",
        effets: "Réaction positive +10"
    },
    { 
        nom: "Orc psychopathe", 
        rest: {races:["Orque"]}, 
        mod: {IN:2, CH:-3 , bonusComp: { vol_a_la_tire : 4, discretion:4, attaque_sournoise:4, persuasion: -20}}, 
        desc: "Le meurtre et le pillage, c'est ta vie. Cela se voit sur ton visage. Tout le monde le voit. Mais ironiquement, tu es doué pour le vol et est très intelligent.",
        effets: "Réaction -20 "
    },
    { 
        nom: "Orc humaniste", 
        rest: {races:["Orque"]}, 
        mod: {IN:2, CH:2, FO:-2, CN:-2}, 
        desc: "Mouton noir de la tribu, tu lis les livres au lieu de t'en servir pour allumer le feu. C'est pour ça que tu as été exilé.",
        effets: "-"
    },
    { 
        nom: "Orc shaman", 
        rest: {races:["Orque"]}, 
        mod: {IN:2, CN:2, FO:-2, align:20, bonusComp: { melee: -4 }}, 
        desc: "Tu étais le Shaman de la tribu avant qu'elle soit détruite. Tu as pu fuir grâce à tes arts magiques.",
        effets: "-"
    }
];