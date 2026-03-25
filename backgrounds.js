const backgrounds = [
    { 
        nom: "Standard", 
        rest: {}, 
        mod: {}, 
        desc: "Aucun passé particulier.",
        effets: "Équipement standard."
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
        mod: {}, 
        desc: "Vous êtes gravement allergique aux objets magiques, de sorte que les toucher vous cause de la douleur. C’est pourquoi vous vous consacrez à la technologie depuis votre plus jeune âge et avez développé un talent pour cela. Vous gagnez un bonus de +10 % à la Technologie mais vous ne pouvez manier AUCUN objet magique.",
        effets: "Points techniques +2 / Impossible d'équiper votre personnage d'objets magiques."
    },
    { 
        nom: "Apprenti chez un commerçant", 
        rest: {pasRaces:["Ogre"]}, 
        mod: {DX:-1}, 
        desc: "En passant toute votre enfance dans un magasin, vous bénéficiez d'un bonus exceptionnel pour Marchander, mais vous subissez une pénalité de Dextérité.",
        effets: "Marchander +3"
    },
    { 
        nom: "Apprenti chez un forgeron", 
        rest: {pasRaces:["Ogre"]}, 
        mod: {FO:1, DX:-2}, 
        desc: "Votre maître est un homme dur. Vous gagnez un bonus de Force et un bonus à votre coméptence de Réparation, mais vous subissez une pénalité de Dextérité en raison du travail pénible et répétitif.",
        effets: "Réparation +2"
    },
    { 
        nom: "Bandit", 
        rest: {races:["Humain", "Demi-Orque", "Orque", "Demi-Elfe"]}, 
        mod: {CH:-1}, 
        desc: "Vous êtes un bandit armé. Votre style de vie vous a valu un bonus en Armes à feu, ainsi qu'une pénalité de Charisme. Vous avez enfreint la loi et êtes arrivé à l'IFS Zephyr avec une longueur d'avance sur les autorités. Vous avez votre arme et quelques munitions, mais vous n'avez pas d'argent.",
        effets: "Armes à feu +2 / 0 Or / Revolver de qualité / 50 balles"
    },
    { 
        nom: "Barbare", 
        rest: {pasRaces:["Elfe"]}, 
        mod: {FO:2, CN:1, IN:-1, CH:-2}, 
        desc: "Vous avez été élevé au sein d’une tribu barbare sauvage dans un pays lointain. Personne ne sait comment ni pourquoi vous êtes devenu passager à bord de l'IFS Zephyr, mais compte tenu de votre comportement féroce, personne n'a essayé de le découvrir. Vous gagnez des bonus de Force et Constitution et un léger bonus en Mêlée, tout en subissant des sanctions en Intelligence, Charisme, et une pénalité à Marchander. Vous possédez également armure barbare mais moins d'argent que les autres personnages.",
        effets: "Mêlée +1 / Marchandage -2 / 100 or, vêtements barbares"
    },
    { 
        nom: "Battu avec un bâton moche", 
        rest: {pasRaces:["Ogre"]}, 
        mod: {CH:-6, FO:2, DX:2}, 
        desc: "Tu es moche. Il n’y a tout simplement pas d’autre mot pour cela, à moins que vous ne considériez « hideux » comme un meilleur mot. Les enfants vous fuient terrorisés et même les âmes les plus gentilles ont du mal à supporter longtemps votre présence. En raison de votre visage, vous subissez une pénalité extrême en Charisme, mais comme vous avez dû vous défendre contre des attaques fréquentes, vous gagnez un bonus de Force, Dextérité, et un léger bonus à toutes vos Compétences de combat.",
        effets: "Mêlée +1 / Esquive +1 / Arc +1 / Lancer +1"
    },
    { 
        nom: "Brute", 
        rest: {pasRaces:["Orque", "Demi-Orque", "Ogre", "Demi-Ogre"]}, 
        mod: {IN:-1, FO:1}, 
        desc: "Tu étais la brute de la classe, grand et stupide. L’extorsion et l’intimidation vous ont donné un bonus de Force, mais amener les gens à faire vos devoirs à votre place vous laisse avec un malus en Intelligence.",
        effets: "Extorsion / Intimidation"
    },
    { 
        nom: "Peau dure", 
        rest: {races:["Orque", "Demi-Orque", "Ogre", "Demi-Ogre"]}, 
        mod: {CH:-1}, 
        desc: "Tu es né avec une peau épaisse et brutale. Bien que votre résistance aux dégâts soit plus importants que la plupart, vous prenez malheureusement une pénalité en Charisme.",
        effets: "Résister aux dégâts +10"
    },
    { 
        nom: "Débutante", 
        rest: {sexe:"F"}, 
        mod: {CH:4, FO:-1, DX:-1}, 
        desc: "Votre famille est l’une des plus influentes de tout Arcanum. En tant que jeune débutante, vous avez des bonus en Charisme. Bien sûr, la vie facile vous a rendu doux d’esprit et de corps. Vous avez des pénalités en Force, Dextérité, et toutes vos Compétences de combat.",
        effets: "Mêlée -2 / Esquive -2 / Arc -2 / Lancer -2"
    },
    { 
        nom: "Demi-ogre sauvage", 
        rest: {races:["Demi-Ogre"]}, 
        mod: {FO:1, CH:-1}, 
        desc: "Vous êtes né d'une mère ogre et avez vécu avec un clan ogre jusqu'à très récemment. Par rapport à vos frères plus civilisés, vous gagnez un bonus de Force, mais vous subissez une pénalité pour votre Charisme.",
        effets: "Équipement standard."
    },
    { 
        nom: "Disciple elfe noir", 
        rest: {races:["Elfe"]}, 
        mod: {IN:2, CH:-2}, 
        desc: "Vous croyez en la philosophie des elfes noirs, selon laquelle la technologie doit être détruite à tout prix. Cette foi a renforcé votre détermination, inteligence, mais l’essor récent de la technologie vous a rendu amer, Charisme.",
        effets: "Équipement standard."
    },
    { 
        nom: "Docteur fou", 
        rest: {pasRaces:["Ogre"]}, 
        mod: {IN:3, CH:-1, DX:-2, CN:-3}, 
        desc: "Vous avez effectué de nombreuses expériences médicales dangereuses et non testées sur vous-même et souffrez des effets indésirables. Vous avez des bonus en Intelligence, résistance au Poison et électricité et un bonus à votre coméptence de soin, mais vous subissez des pénalités en Charisme, Dextérité, et Constitution.",
        effets: "Résistance électrique +20 / Résistance au poison +20 / soin +4"
    },
    { 
        nom: "Élevé dans les fosses", 
        rest: {}, 
        mod: {IN:-6, FO:2, DX:2}, 
        desc: "En tant que vétéran des combats locaux, vous gagnez un bonus en Force, Dextérité, et un bonus à toutes les Compétences de combat. Les combats acharnés ont également eu des conséquences néfastes. Un traumatisme crânien vous donne une lourde pénalité en Intelligence. En conséquence, vous n’êtes pas particulièrement doué avec l’argent. Toutes vos économies s'élèvent à seulement 100 pièces et votre arme de combat.",
        effets: "Mêlée +1 / Esquive +1 / Arc +1 / Lancer +1 / 100 Or / Hache rouillée"
    },
    { 
        nom: "Élevé par des elfes", 
        rest: {races:["Humain"]}, 
        mod: {}, 
        desc: "Vous commencez avec un magnifique costume de cotte de mailles elfique magique, mais subir une légère pénalité pour tous Compétences technologiques.",
        effets: "Réparation -1 / Armes à feu -1 / Crochets -1 / Désarmer les pièges -1 / Cotte de mailles elfique"
    },
    { 
        nom: "Élevé par des maîtres-serpents", 
        rest: {}, 
        mod: {CH:-1}, 
        desc: "Vous recevez une augmentation de Résistances au poison, mais subissez une pénalité pour votre Charisme en raison du grand nombre de cicatrices de morsures sur vos bras et vos jambes.",
        effets: "Résister au poison +20"
    },
    { 
        nom: "Élevé par des moines", 
        rest: {pasRaces:["Ogre"]}, 
        mod: {CN:1}, 
        desc: "La piété a ses avantages et ses inconvénients. Vous gagnez un bonus en Constitution, mais renoncer au monde matériel ne vous laisse qu’un quart de la richesse de départ normale.",
        effets: "100 Or"
    },
    { 
        nom: "Élevé par des orcs", 
        rest: {races:["Humain", "Gnome", "Halfelin", "Demi-Orque", "Orque", "Demi-Ogre", "Ogre"]}, 
        mod: {CH:-6, FO:2, DX:1}, 
        desc: "Vous étiez un orphelin en fuite, sans abri et affamé, lorsqu'une famille orque dans la nature vous a accueilli et élevé. Leurs manières brutales vous ont laissé avec une augmentation en Force et Dexterité, et vous a également accordé un léger bonus à toutexs les Compétences de combat. Malheureusement, votre éducation a également eu des conséquences néfastes sur votre personnalité, et vous êtes passible d'une lourde sanction en Charisme.",
        effets: "Mêlée +1 / Esquive +1 / Arc +1 / Lancer +1"
    },
    { 
        nom: "Elfe dandy", 
        rest: {races:["Elfe"]}, 
        mod: {DX:-1}, 
        desc: "Élevé en ville, vous perdez le bonus elfique de dextérité mais gagnez un bonus à Persuasion.",
        effets: "Persuasion +2"
    },
    { 
        nom: "Enfance protégée", 
        rest: {pasRaces:["Nain", "Ogre", "Demi-Ogre"]}, 
        mod: {FO:-6, IN:4, CH:1}, 
        desc: "Vous étiez roucoulé et choyé sans cesse quand vous étiez enfant. En raison d’une parentalité surprotectrice, vous subissez une lourde sanction en Force, mais, étant plus sensible, vous avez des bonus en Intelligence, et Charisme.",
        effets: "Équipement standard. (Bonus VO +2)"
    },
    { 
        nom: "Enfant d'un héros", 
        rest: {}, 
        mod: {}, 
        desc: "Vous commencez avec l'épée de votre père et êtes connu dans tout le pays comme l'enfant d'un héros. Par conséquent, vous subirez une terrible réaction négative pour tout acte maléfique.",
        effets: "Mauvaise réaction x2 / Épée enchantée"
    },
    { 
        nom: "Enfant sauvage", 
        rest: {races:["Humain", "Demi-Elfe", "Gnome", "Demi-Orque", "Orque", "Demi-Ogre", "Ogre"]}, 
        mod: {IN:-6, DX:3}, 
        desc: "Enfant, tes parents t'ont abandonné au milieu de la forêt. Avoir été élevé par une meute de loups vous donne un bonus considérable en Dextérité ainsi que de légers bonus dans les compétences discretion et Pick Pocket. Mais, inconscient des bonnes manières à table et des règles de la bonne société, vous recevez une lourde pénalité en Intelligence ainsi que de légères pénalités dans les compétences de Persuasion et Marchandage. Vous commencez avec la moitié de la richesse de départ normale.",
        effets: "Persuasion -1 / Marchandage -1 / discretion +1 / Pick Pocket +1 / 200 Or"
    },
    { 
        nom: "Enfant unique", 
        rest: {pasRaces:["Ogre"]}, 
        mod: {IN:6, CH:-4}, 
        desc: "Vous avez grandi en tant qu'enfant unique de parents très permissifs et vous avez toujours obtenu ce que vous vouliez. En tant qu'adulte, vous n'attendez rien de moins qu'une obéissance totale de ceux qui vous entourent, gagnant un bonus à Inelligence (+6), mais votre tempérament laisse beaucoup à désirer, ce qui entraîne des pénalités pour votre Charisme et vos coméptencves de Persuasion et Marchandage.",
        effets: "Marchandage -2 / Persuasion -2"
    },
    { 
        nom: "Envoyé à l'école de charme", 
        rest: {sexe:"F", races:["Humain"]}, 
        mod: {CH:3, IN:-1, FO:-2}, 
        desc: "Au lieu d’une éducation générale, vous avez été envoyé dans une école de charme. Vous gagnez du Charisme, mais vous perdez des points en Intelligence et Force.",
        effets: "Manières parfaites"
    },
    { 
        nom: "Évadé d'usine", 
        rest: {races:["Orque", "Demi-Orque"]}, 
        mod: {FO:1}, 
        desc: "Vous étiez esclave dans une usine jusqu'à une récente évasion. Vous avez peu d'argent, mais vous gagnez un bonus en Force.",
        effets: "50 Or"
    },
    { 
        nom: "Formation militaire", 
        rest: {pasRaces:["Ogre", "Demi-Ogre"]}, 
        mod: {FO:1, DX:-1}, 
        desc: "Vous avez reçu une formation militaire pendant votre jeunesse, mais vous avez été renvoyé pour avoir les pieds plats. Vous gagnez des bonus en Force, ainsi que de légers bonus en compétence d'Arc et Mêlée, mais vous avez une pénalit de Dextérité.",
        effets: "Arc +1 / Mêlée +1"
    },
    { 
        nom: "Garçon Tomboy", 
        rest: {sexe:"F"}, 
        mod: {FO:1, CN:-1}, 
        desc: "Quand tu étais petite, tu jouais toujours à des jeux avec les garçons. En tant que femme, vous pouvez tenir tête à n’importe quel homme et vous avez évité le rôle féminin stéréotypé dans la société. Ce contexte annule l’effet de genre en augmentant la Force tout en diminuant Constitution.",
        effets: "Équipement standard."
    },
    { 
        nom: "Garde du corps libéré", 
        rest: {races:["Demi-Ogre", "Ogre"]}, 
        mod: {IN:-1}, 
        desc: "Votre maître gnome est récemment décédé et, dans son testament, vous avez été libéré de la servitude et vous avez reçu un petit don monétaire. Cependant, vous n'êtes pas très intelligent.",
        effets: "500 Or"
    },
    { 
        nom: "Gnome privé de ses droits", 
        rest: {races:["Gnome"]}, 
        mod: {FO:1}, 
        desc: "Vous ne faites pas partie de la bourgeoisie capitaliste gnome et avez plutôt grandi comme journalier. Vous subissez une pénalité pour Marchander, mais gagnez un bonus de Force.",
        effets: "Marchander -2"
    },
    { 
        nom: "Héritage", 
        rest: {}, 
        mod: {IN:-1}, 
        desc: "Vous êtes devenu orphelin quand vous étiez jeune enfant et avez hérité de beaucoup d’argent. La vie facile vous a coûté une pénalité en intelligence. La majeure partie de l’argent a déjà été dépensée, mais vous commencez avec deux fois la richesse de départ normale.",
        effets: "800 Or"
    },
    { 
        nom: "Hydrophobe", 
        rest: {races:["Humain", "Nain", "Gnome", "Halfelin", "Orque", "Demi-Orque"]}, 
        mod: {}, 
        desc: "Vous avez mortellement peur de l’eau et de la noyade. Enfant, vous inventiez constamment des raisons pour éviter d'entrer même dans des eaux peu profondes, gagnant ainsi un bonus de Persuasion. Si vous vous retrouvez dans l'eau, vous subissez une crise de panique, entraînant des pénalités en Dextérité, Intelligence mais vous gagnez un bonus à Force sous l'effet de la peur.",
        effets: "Persuasion +2 / Dans l'eau : IN -2, DX -2, FO +2"
    },
    { 
        nom: "Hyperactif", 
        rest: {}, 
        mod: {DX:1, CH:-1}, 
        desc: "Vous êtes constamment occupé. Votre Vitesse est plus élevé que la normale, mais la plupart des gens vous trouvent ennuyeux, et votre Charisme en souffre.",
        effets: "Équipement standard."
    },
    { 
        nom: "Idiot Savant", 
        rest: {races:["Humain"]}, 
        mod: {IN:2, FO:-1, CN:-1, DX:-2}, 
        desc: "Vous avez été interné très jeune et considéré comme handicapé mental. Après plusieurs années, l'institut a perdu son financement et vous avez été mis à la rue avec rien d'autre que des vêtements sur le dos. Vous êtes brillant et maîtrisez parfaitement les nombres et les mathématiques, mais vous êtes à peine capable de parler. Vous gagnez un bonus important à l'Intelligence et un bonus exceptionnel à votre coméptence de Jeu d'argent. Cependant, des années d’enfermement vous font souffrir physiquement et émotionnellement. Vous agissez comme si vous aviez une intelligence bien inférieure (Dialogue stupide et Manuels techniques pénalité), et vous subissez des pénalités en Force, Constitution, Dextérité.",
        effets: "Jeux d'argent +3 / 0 Or / Dialogue stupide"
    },
    { 
        nom: "Je me suis enfui avec le cirque", 
        rest: {}, 
        mod: {FO:6, DX:2, IN:-4, CH:-2, CN:-2}, 
        desc: "Après vous être enfui avec une troupe locale d'artistes de cirque, vous avez acquis des compétences physiques considérables en Force, Dexterité mais présentent de graves lacunes en Intelligence, Charisme, et cosntituion à cause de toute la scolarité que vous avez manquée.",
        effets: "Équipement standard."
    },
    { 
        nom: "Mage de jour", 
        rest: {pasRaces:["Nain"]}, 
        mod: {}, 
        desc: "Tu es né avec une Aptitude magique qui a une affinité pour le soleil. Pendant la journée, vous possédez un bonus à votre Aptitude Magique, mais la nuit, vous subissez une pénalité à votre Aptitude Magique.",
        effets: "Aptitude magique +20% le Jour, -20% la Nuit"
    },
    { 
        nom: "Mage de la nuit", 
        rest: {pasRaces:["Nain"]}, 
        mod: {}, 
        desc: "Tu es né avec une aptitude en magie qui a une affinité pour la nuit. La nuit, vous possédez un bonus à votre Aptitude Magique, mais pendant la journée, vous subissez une pénalité à votre Aptitude Magique.",
        effets: "Aptitude magique +20% la Nuit, -20% le Jour"
    },
    { 
        nom: "Mage du ciel", 
        rest: {pasRaces:["Nain"]}, 
        mod: {}, 
        desc: "Tu es né avec une aptitude en magie qui a une affinité pour le ciel ouvert. À l'extérieur et à la vue dégagée sur le ciel, vous possédez un bonus en Aptitude Magique. Mais sous terre, à l'intérieur ou même sous une forte canopée forestière, vous subissez une pénalité sur votre aptitude magique.",
        effets: "Vue du ciel : Aptitude +2 / Sinon : Aptitude -2"
    },
    { 
        nom: "Mage de la nature", 
        rest: {pasRaces:["Nain"]}, 
        mod: {}, 
        desc: "Tu es né avec une aptitude en magie qui a une affinité avec la nature. En vous tenant sur une surface naturelle, vous possédez un bonus à l'aptitude magique. Mais sur une surface artificielle, vous subissez une pénalitéur votre aptitude magique.",
        effets: "Surface naturelle : Magie +2 / Artificielle : Magie -2"
    },
    { 
        nom: "L'homme de la dame", 
        rest: {sexe:"M", pasRaces:["Ogre"]}, 
        mod: {CH:6, CN:-2, FO:-2, DX:-2}, 
        desc: "Les femmes s’évanouissent chaque fois qu’elles sont près de vous. Étant inhabituellement beau, vous gagnez un gros bonus en Charisme. Malheureusement, tout ce pomponnage et ce poudrage vous font manquer les vertus les plus viriles... vous perdez de la Constitution, Force, et Dextérité.",
        effets: "Équipement standard."
    },
    { 
        nom: "La fiancée de Frankenstein", 
        rest: {sexe:"F", races:["Humain", "Demi-Orque"]}, 
        mod: {CH:4, CN:4, DX:-4}, 
        desc: "Vous avez été réanimée par un savant fou pour être l'épouse de son autre création, mais d'une manière ou d'une autre, vous avez réussi à vous échapper avant le mariage. Vous êtes très bien construit, gagnant des bonus en charisme, Constitution, Résistance à l'electricité et au poison, mais vous avez un très lent, une connexion cerveau-larynx endommagée (Dialogue stupide), et une fragilité au feu Vous commencez également sans aucun argent.",
        effets: "Résistances Elec & Poison / Faiblesse Feu / 0 Or / Dialogue stupide"
    },
    { 
        nom: "Lanceur de couteaux professionnel", 
        rest: {pasRaces:["Ogre"]}, 
        mod: {DX:-1}, 
        desc: "Vous travailliez comme lanceur de couteaux dans un cirque, jusqu'à perdre un œil dans un accident étrange. Malheureusement, vous perdezen dexterité, mais vous gagnez un bonus exceptionnel en Lancer.",
        effets: "Lancer +3"
    },
    { 
        nom: "Le protégé de Charlatan", 
        rest: {pasRaces:["Orque", "Demi-Orque", "Ogre", "Demi-Ogre"]}, 
        mod: {CH:6, FO:-2, CN:-2}, 
        desc: "Convaincu par un voyageur de commerce de devenir son apprenti, vous avez abandonné votre vie dans l'académie militaire dans laquelle vous étiez inscrit. Vous gagnez un bonus majeur en Charisme, mais perdre un peu de Force et Constitution, en plus d'infliger de légères pénalités à tous vos Compétences de combat.",
        effets: "Compétences de combat -1"
    },
    { 
        nom: "Maladif", 
        rest: {}, 
        mod: {IN:6, FO:-2, CN:-4, DX:-1}, 
        desc: "Mère Nature peut être une maîtresse dure. Étant né avec un système immunitaire extrêmement faible, vous avez des pénalités en Force, Constitution, et Dextérité. Mais tout n’est pas perdu. Les après-midi passés avec de la fièvre et un bon livre vous ont donné des sensations anormalement élevées, créant un gros bonus en Intelligence.",
        effets: "Équipement standard."
    },
    { 
        nom: "Monstre de Frankenstein", 
        rest: {sexe:"M", races:["Humain", "Demi-Orque"]}, 
        mod: {FO:4, CN:4, DX:-6}, 
        desc: "Vous avez été réanimé par un savant fou à partir de diverses parties du corps qu'il a trouvées sur des tombes, mais d'une manière ou d'une autre, vous vous êtes échappé du laboratoire. Vous êtes très bien construit, gagnant des bonus en Force, Constitution, et Résistance au poison + poison mais vous avez un e tres basse Dextérité, une connexion cerveau-larynx endommagée Dialogue stupide), et une faiblesse au feu Vous commencez également sans aucun argent.",
        effets: "Résistances Physiques / Malus Feu / 0 Or / Dialogue stupide"
    },
    { 
        nom: "Nain sans clan", 
        rest: {races:["Nain"]}, 
        mod: {}, 
        desc: "Vos parents n’appartenaient pas à un clan et ne voulaient pas en discuter les raisons. Vous ne gagnez aucun bonus nain à Compétences technologiques, mais vous commencez avec un excellent marteau de guerre nain.",
        effets: "Réparation -2 / Armes à feu -2 / Crochets -2 / Désarmer les pièges -2 / Marteau de qualité"
    },
    { 
        nom: "Naissance rare d'un demi-ogre", 
        rest: {races:["Demi-Ogre"]}, 
        mod: {IN:2, FO:-1, CN:-1}, 
        desc: "Vous êtes né d’une mère humaine, qui a miraculeusement survécu à votre naissance. Ayant grandi dans la ville, vous gagnez un bonus considérable en Intelligence. La vie en ville a également diminué votre férocité, et vous perdez des points en Force et Constitution.",
        effets: "Équipement standard."
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
        mod: {IN:3, CH:3, FO:-3, DX:-3, CN:-5}, 
        desc: "Bien que né dans une famille riche alors que vous étiez jeune enfant, vous avez mystérieusement perdu la vue. On a découvert que vous aviez contracté une maladie dégénérative et toujours mortelle. En tant qu’enfant aveugle, votre développement précoce a favorisé les activités intérieures et un développement digne des plus riches de la société. Vous avez gagné des bonus en Intelligence et Charisme. Vos sens du toucher, de l'ouïe et de l'odorat ont augmenté pour compenser votre cécité, ce qui a donné lieu à un bonus en detection de pièges. Cependant, vous avez souffert physiquement, ce qui a entraîné des pénalités en Force, Dextérité, et Constitution. En tant que jeune adulte, vos parents, par désespoir, ont payé les services d’un médecin renommé, quoique peu orthodoxe, qui vous a miraculeusement rendu la vue. L’opération a coûté sa fortune à votre famille, alors vous avez décidé de créer la vôtre.",
        effets: "Détection de pièges +2"
    },
    { 
        nom: "Orphelin halfelin", 
        rest: {races:["Halfelin"]}, 
        mod: {IN:-1}, 
        desc: "Abandonné dans une grande ville quand vous étiez enfant, vous avez survécu au vol et n'avez jamais reçu d'éducation. Vous gagnez un bonus à Pick Pocket, mais a perdu un point en Intelligence.",
        effets: "Vol à la tire (Pick Pocket) +2"
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
        effets: "Bonus de réaction x2"
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
        effets: "Équipement standard."
    },
    { 
        nom: "Pyromane", 
        rest: {races:["Humain", "Gnome", "Demi-Orque"]}, 
        mod: {FO:-1, CN:-1}, 
        desc: "Tu aimes le feu. Non, tu aimes le feu ! Feu ! Feu ! FEU ! Enfant, on vous harcelait toujours parce que vous étiez maigre et que vous receviez des pénalités en Force et Constitution, mais tu leur as montré ! Tu as étudié Explosifs et vous avez brûlé leurs maisons ! Je les ai brûlés jusqu'au sol ! Ha ha! Ensuite, vous vous êtes enfui de chez vous et vous êtes faufilé à bord de l'IFS Zephyr, qui semblait hautement inflammable et une excellente cible. Vous auriez probablement incendié le zeppelin s'il n'avait pas été abattu.",
        effets: "Expertise Explosifs +20"
    },
    { 
        nom: "Rat de bibliothèque", 
        rest: {pasRaces:["Orque", "Demi-Orque", "Ogre", "Demi-Ogre"]}, 
        mod: {IN:1}, 
        desc: "Vous avez passé la majeure partie de votre vie à lire. Vous gagnez un bonus en Intelligence. Malheureusement, la myopie s'est installée et vous perdez en compétence de combats.",
        effets: "Compétences de combat -1"
    },
    { 
        nom: "Orques BG", 
        rest: {races:["Orque", "Demi-Orque"]}, 
        mod: {CH:2, FO:-2}, 
        desc: "Vous n’avez pas vraiment l’air très orque, mais vous êtes exceptionnellement maussade. Vous avez un bonus en charisme, mais subissez une pénalité pour votre Force.",
        effets: "Apparence plus humaine"
    },
    { 
        nom: "Sang elfique", 
        rest: {races:["Humain", "Gnome", "Halfelin", "Demi-Orque", "Demi-Ogre"]}, 
        mod: {}, 
        desc: "L'arrière-grand-mère de ton père était une elfe. Vous obtenez une augmentation en Aptitude magique, mais subissent une légère pénalité pour tous Compétences technologiques.",
        effets: "Points de Magie +1 / Compétences Techno -1"
    },
    { 
        nom: "Top modèle", 
        rest: {sexe:"F"}, 
        mod: {CH:6, FO:-2, IN:-4}, 
        desc: "Vous êtes une femme incroyablement magnifique, et vous avez été choyée et dorlotée toute votre vie. Vous gagnez un énorme bonus en Beauté, Charisme au prix de la Force et l'Intelligence.",
        effets: "Équipement standard."
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
        mod: {}, 
        desc: "Vous vous êtes échappé d'un asile de fous et vous vous êtes caché à bord de l'IFS Zephyr. Vous êtes extrêmement résistant aux dégâts mais vous n'avez pas d'argent, vous avez volé vêtements bon marché, et la plupart des gens sont effrayés ou repoussés par vous.",
        effets: "Résistances +25 / Réaction -25 / 0 Or / Robe rustique"
    },
    { 
        nom: "Vendu ton âme", 
        rest: {}, 
        mod: {}, 
        desc: "Vous avez fait un pacte avec un démon. En échange de plus de pouvoir magique, vous avez consacré votre vie à la poursuite du mal. Vous gagnez Aptitude, magique mais souffrez de réaction négatives des autre.",
        effets: "Aptitude Magique +20 / Réaction -20 / Maléfique"
    },
    { 
        nom: "Vue sombre", 
        rest: {}, 
        mod: {}, 
        desc: "Vos yeux sont trop sensibles à la lumière. Vous êtes presque aveugle à la lumière du jour, mais vous pouvez voir parfaitement dans l’obscurité. Par conséquent, toutes les pénalités d’éclairage de compétence sont annulées pour vous.",
        effets: "Lumière : -1 stats / Noir : +1 stats"
    },
    { 
        nom: "Ogre des montagnes", 
        rest: {races:["Ogre"]}, 
        mod: {FO:4, CN:4, DX:4, CH:-1, IN:-1}, 
        desc: "Vous vivez dans votre grotte quand vous avez entendu un gros crash dehors.",
        effets: "Mêlée & Esquive +1 / 0 Argent / Vêtements en tissu"
    },
    { 
        nom: "Ogre cultivé", 
        rest: {races:["Ogre"]}, 
        mod: {IN:4, CH:2, CN:-4, DX:-4}, 
        desc: "Un ogre pur sang employé par un membre de l'élite des gnomes, passant son temps à lire.",
        effets: "Équipement standard."
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
        rest: {races:["Orque", "Demi-Orque"]}, 
        mod: {IN:2}, 
        desc: "Le meurtre et le pillage, c'est ta vie. Cela se voit sur ton visage. Tout le monde le voit. Mais ironiquement, tu es doué pour le vol et est très intelligent.",
        effets: "Réaction -20 / Vol, Discrétion, Attaque sournoise +4 / 0 Persuasion"
    },
    { 
        nom: "Orc humaniste", 
        rest: {races:["Orque", "Demi-Orque"]}, 
        mod: {IN:2, CH:2, FO:-2, CN:-2}, 
        desc: "Mouton noir de la tribu, tu lis les livres au lieu de t'en servir pour allumer le feu. C'est pour ça que tu as été exilé.",
        effets: "Aucun bonus de combat"
    },
    { 
        nom: "Orc shaman", 
        rest: {races:["Orque", "Demi-Orque"]}, 
        mod: {IN:2, CN:2, FO:-2}, 
        desc: "Tu étais le Shaman de la tribu avant qu'elle soit détruite. Tu as pu fuir grâce à tes arts magiques.",
        effets: "Aptitude magique +20% / Aucun bonus de combat"
    }
];