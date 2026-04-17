export interface VideoItem {
  id: string;
  title: string;
  key: string;
  duration: string;
  description: string;
}

export interface Module {
  id: string;
  title: string;
  videos: VideoItem[];
}

export const MODULES: Module[] = [
  {
    id: "module-1",
    title: "MODULE 1 - LES BASES",
    videos: [
      {
        id: "v1",
        title: "LA BOUGIE JAPONAISE",
        key: "Q_FTmEKIWVM",
        duration: "12:45",
        description: "Comprendre l'anatomie d'une bougie et ce qu'elle raconte sur la psychologie du marché."
      },
      {
        id: "v2",
        title: "LES POINTS D'ENTRÉES",
        key: "FRE7ty0zu2Y",
        duration: "15:20",
        description: "Identifier les zones de haute probabilité pour placer ses ordres avec précision."
      },
      {
        id: "v3",
        title: "L'ANALYSE TECHNIQUE",
        key: "OdqiREurOHY",
        duration: "22:10",
        description: "Maîtriser les structures de marché, supports, résistances et lignes de tendance."
      },
      {
        id: "v4",
        title: "PSYCHOLOGIE INTRODUCTION",
        key: "4Om1ehHQP9w",
        duration: "18:30",
        description: "Pourquoi 90% des traders échouent et comment rejoindre les 10% restants."
      }
    ]
  },
  {
    id: "module-2",
    title: "MODULE 2 - LA DISCIPLINE",
    videos: [
      {
        id: "v5",
        title: "LA DISCIPLINE",
        key: "ap3WBj0Fq4k",
        duration: "20:15",
        description: "Le pilier central du trading rentable. Apprendre à respecter son plan sans déroger."
      },
      {
        id: "v6",
        title: "LA PATIENCE",
        key: "vFQiVyOb5hw",
        duration: "14:50",
        description: "Savoir attendre le setup parfait. Le trading est 90% d'attente et 10% d'exécution."
      },
      {
        id: "v7",
        title: "LE MONEY MANAGEMENT",
        key: "xl2PmrRnGqM",
        duration: "15:00",
        description: "Gérer son risque et son capital pour survivre et prospérer à long terme."
      },
      {
        id: "v8",
        title: "LE CALENDRIER ECONOMIQUE",
        key: "q8kgaFu2tnI",
        duration: "11:25",
        description: "Anticiper les annonces majeures pour éviter la volatilité destructrice."
      }
    ]
  },
  {
    id: "module-3",
    title: "MODULE 3 - LES OUTILS",
    videos: [
      {
        id: "v9",
        title: "LE CALENDRIER FOREX",
        key: "t8QrhXooQ40",
        duration: "13:40",
        description: "Comprendre les sessions de marché (Londres, New York) et leur impact sur les paires."
      },
      {
        id: "v10",
        title: "MT4 ET PLATEFORME WEB",
        key: "QQ1bLrFBoZw",
        duration: "25:00",
        description: "Configuration optimale de vos outils de travail pour une exécution rapide."
      },
      {
        id: "v11",
        title: "LA MANIPULATION DES MARCHES",
        key: "iGYgz7XzR8c",
        duration: "30:45",
        description: "Détecter les pièges des institutions (Smart Money) pour ne plus être la liquidité."
      },
      {
        id: "v12",
        title: "LA SYMBIOSE ROBOT HUMAIN",
        key: "fyL4PoudUsc",
        duration: "28:20",
        description: "Comment utiliser l'assistance algorithmique pour renforcer vos décisions discrétionnaires."
      }
    ]
  },
  {
    id: "module-4",
    title: "MODULE 4 - LA STRATÉGIE",
    videos: [
      {
        id: "v13",
        title: "PRESENTATION DU PLAN CAMELEON",
        key: "4yR_OZcILns",
        duration: "35:00",
        description: "Introduction à la stratégie phare de NGT Academy. S'adapter au marché comme un caméléon."
      },
      {
        id: "v14",
        title: "VERIFICATION ET PROBABILITE DE GAIN DU PLAN",
        key: "yGgafEhkeLU",
        duration: "42:15",
        description: "Analyse statistique et backtesting de la stratégie pour une confiance totale."
      },
      {
        id: "v15",
        title: "LE PLAN CAMELEON EN DAY TRADING",
        key: "AZLw_DdsZKs",
        duration: "38:50",
        description: "Application concrète de la méthode sur des horizons de temps intraday."
      },
      {
        id: "v16",
        title: "LE PÉTROLE ET L'OR",
        key: "IRuB6getihM",
        duration: "31:20",
        description: "Spécificités du trading sur les matières premières et les métaux précieux."
      },
      {
        id: "v17",
        title: "SCALPING AVEC LE CAMELEON",
        key: "Lyt-xUYmtf4",
        duration: "45:30",
        description: "Techniques d'entrées chirurgicales en M1/M5 pour des profits rapides."
      }
    ]
  }
];
