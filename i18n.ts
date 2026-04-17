export interface QuestionOption {
  text: string;
  points: number; // Higher points = higher psychological affectation (needs NGT more)
}

export interface Question {
  id: number;
  category: string;
  text: string;
  options: QuestionOption[];
}

export const psychologyTestQuestions: Question[] = [
  {
    id: 1,
    category: "Gestion des émotions",
    text: "Que faites-vous immédiatement après avoir subi 3 pertes consécutives ?",
    options: [
      { text: "Je m'arrête immédiatement et j'analyse mes erreurs à froid.", points: 0 },
      { text: "Je réduis ma taille de position pour le prochain trade.", points: 10 },
      { text: "Je cherche une nouvelle opportunité pour me refaire rapidement.", points: 25 },
      { text: "J'augmente mon levier pour récupérer mes pertes en un seul trade.", points: 40 }
    ]
  },
  {
    id: 2,
    category: "Discipline",
    text: "Respectez-vous systématiquement votre Stop Loss ?",
    options: [
      { text: "Toujours, c'est une règle absolue.", points: 0 },
      { text: "La plupart du temps, sauf si je suis sûr que le prix va se retourner.", points: 15 },
      { text: "Il m'arrive de l'éloigner pour laisser 'respirer' le trade.", points: 30 },
      { text: "Je n'en utilise pas toujours, je gère à la main.", points: 45 }
    ]
  },
  {
    id: 3,
    category: "Gestion du risque",
    text: "Quel pourcentage de votre capital risquez-vous par trade ?",
    options: [
      { text: "Moins de 1%", points: 0 },
      { text: "Entre 1% et 3%", points: 10 },
      { text: "Entre 3% et 10%", points: 25 },
      { text: "Plus de 10% ou je ne sais pas précisément.", points: 40 }
    ]
  },
  {
    id: 4,
    category: "Vie personnelle",
    text: "Votre sommeil est-il affecté par vos positions ouvertes ?",
    options: [
      { text: "Jamais, je dors parfaitement.", points: 0 },
      { text: "Rarement, seulement lors de grosses annonces.", points: 10 },
      { text: "Souvent, je vérifie mon téléphone la nuit.", points: 30 },
      { text: "Constamment, le trading me génère une insomnie chronique.", points: 50 }
    ]
  },
  {
    id: 5,
    category: "Habitudes de trading",
    text: "Ressentez-vous le besoin de trader même quand votre stratégie ne donne pas de signal ?",
    options: [
      { text: "Non, je sais rester patient.", points: 0 },
      { text: "Parfois, par peur de rater un mouvement (FOMO).", points: 20 },
      { text: "Souvent, j'ai besoin d'être dans l'action.", points: 35 },
      { text: "Toujours, je trade compulsivement toute la journée.", points: 50 }
    ]
  },
  {
    id: 6,
    category: "Objectifs",
    text: "Quelle est votre attente de rendement mensuel ?",
    options: [
      { text: "2% à 5%, de manière constante.", points: 0 },
      { text: "5% à 15%, c'est mon objectif.", points: 10 },
      { text: "Doubler mon capital chaque mois.", points: 30 },
      { text: "Devenir millionnaire en moins d'un an.", points: 45 }
    ]
  },
  {
    id: 7,
    category: "Gestion des émotions",
    text: "Comment vous sentez-vous après un trade gagnant ?",
    options: [
      { text: "Calme, c'est juste l'exécution de mon plan.", points: 0 },
      { text: "Content, mais je reste concentré.", points: 10 },
      { text: "Euphorique, j'ai l'impression d'être invincible.", points: 25 },
      { text: "Soulagé, j'avais peur de perdre.", points: 35 }
    ]
  },
  {
    id: 8,
    category: "Discipline",
    text: "Tenez-vous un journal de trading rigoureux ?",
    options: [
      { text: "Oui, chaque trade est documenté avec captures d'écran.", points: 0 },
      { text: "Oui, mais je ne le relis jamais.", points: 15 },
      { text: "De temps en temps, quand j'y pense.", points: 30 },
      { text: "Non, je n'en vois pas l'utilité.", points: 45 }
    ]
  },
  {
    id: 9,
    category: "Gestion du risque",
    text: "Que faites-vous si vous atteignez votre perte maximale journalière ?",
    options: [
      { text: "Je coupe tout et je reviens le lendemain.", points: 0 },
      { text: "Je fais une pause et je cherche un 'dernier' trade sûr.", points: 20 },
      { text: "Je continue pour essayer de finir la journée à l'équilibre.", points: 35 },
      { text: "Je m'énerve et je multiplie les positions.", points: 50 }
    ]
  },
  {
    id: 10,
    category: "Vie personnelle",
    text: "Le trading impacte-t-il vos relations avec vos proches ?",
    options: [
      { text: "Pas du tout, je sépare bien les deux.", points: 0 },
      { text: "Un peu, je suis parfois distrait.", points: 15 },
      { text: "Oui, je suis souvent irritable après une perte.", points: 35 },
      { text: "Totalement, mes proches se plaignent de mon obsession.", points: 50 }
    ]
  },
  {
    id: 11,
    category: "Habitudes de trading",
    text: "Pratiquez-vous le 'Revenge Trading' (trader par vengeance contre le marché) ?",
    options: [
      { text: "Jamais.", points: 0 },
      { text: "Rarement, j'essaie de me contrôler.", points: 20 },
      { text: "Souvent, je ne supporte pas d'avoir tort.", points: 40 },
      { text: "C'est ma réaction systématique après une perte.", points: 55 }
    ]
  },
  {
    id: 12,
    category: "Gestion des émotions",
    text: "Quelle est votre réaction face à une opportunité manquée ?",
    options: [
      { text: "C'est pas grave, il y en aura d'autres.", points: 0 },
      { text: "Un peu de frustration, mais je passe à autre chose.", points: 15 },
      { text: "Je rentre quand même dans le trade, même si le prix est déjà loin.", points: 35 },
      { text: "Je m'en veux pendant des heures.", points: 45 }
    ]
  },
  {
    id: 13,
    category: "Discipline",
    text: "Avez-vous un plan de trading écrit et détaillé ?",
    options: [
      { text: "Oui, et je le suis à la lettre.", points: 0 },
      { text: "Oui, mais je l'adapte souvent au feeling.", points: 20 },
      { text: "C'est dans ma tête, pas besoin d'écrire.", points: 35 },
      { text: "Non, je trade à l'instinct.", points: 50 }
    ]
  },
  {
    id: 14,
    category: "Gestion du risque",
    text: "Utilisez-vous le levier maximum proposé par votre broker ?",
    options: [
      { text: "Jamais, je calcule mon levier selon mon risque.", points: 0 },
      { text: "Rarement.", points: 15 },
      { text: "Souvent, pour maximiser les gains.", points: 35 },
      { text: "Toujours, c'est le seul moyen de gagner gros.", points: 50 }
    ]
  },
  {
    id: 15,
    category: "Vie personnelle",
    text: "Pouvez-vous passer une journée entière sans regarder les graphiques ?",
    options: [
      { text: "Oui, sans aucun problème.", points: 0 },
      { text: "Oui, mais j'y pense quand même.", points: 15 },
      { text: "Difficilement, je ressens un manque.", points: 35 },
      { text: "Impossible, je suis accro.", points: 55 }
    ]
  },
  {
    id: 16,
    category: "Habitudes de trading",
    text: "Coupez-vous vos trades gagnants trop tôt par peur qu'ils se retournent ?",
    options: [
      { text: "Non, je laisse courir mes profits selon mon plan.", points: 0 },
      { text: "Parfois, quand la volatilité est forte.", points: 20 },
      { text: "Souvent, je préfère encaisser un petit gain sûr.", points: 35 },
      { text: "Toujours, je ne supporte pas de voir un gain diminuer.", points: 50 }
    ]
  },
  {
    id: 17,
    category: "Gestion des émotions",
    text: "Comment gérez-vous une période de 'drawdown' (perte durable) ?",
    options: [
      { text: "Je réduis mon risque et je reste patient.", points: 0 },
      { text: "Je remets en question toute ma stratégie.", points: 20 },
      { text: "Je cherche une stratégie 'miracle' sur internet.", points: 40 },
      { text: "Je panique et je fais n'importe quoi.", points: 55 }
    ]
  },
  {
    id: 18,
    category: "Discipline",
    text: "Tradez-vous quand vous êtes fatigué ou stressé par votre travail ?",
    options: [
      { text: "Jamais, je sais que c'est dangereux.", points: 0 },
      { text: "Rarement.", points: 15 },
      { text: "Souvent, le trading est mon échappatoire.", points: 35 },
      { text: "Toujours, je n'ai pas d'autres moments pour trader.", points: 50 }
    ]
  },
  {
    id: 19,
    category: "Gestion du risque",
    text: "Savez-vous exactement combien vous allez perdre AVANT de cliquer sur 'Acheter' ?",
    options: [
      { text: "Oui, au centime près.", points: 0 },
      { text: "Environ, j'ai une idée globale.", points: 15 },
      { text: "Non, je verrai bien selon le mouvement.", points: 40 },
      { text: "Je ne pense qu'au gain potentiel.", points: 55 }
    ]
  },
  {
    id: 20,
    category: "Objectifs",
    text: "Considérez-vous le trading comme un casino ou un business ?",
    options: [
      { text: "Un business sérieux avec gestion rigoureuse.", points: 0 },
      { text: "Un mélange des deux.", points: 20 },
      { text: "Un moyen de gagner de l'argent facile.", points: 40 },
      { text: "Un jeu d'argent passionnant.", points: 55 }
    ]
  }
];
