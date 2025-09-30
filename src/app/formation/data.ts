export type FormationSession = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  formatter: {
    name: string;
    role: string;
    image: string;
  };
};

export const sessions: FormationSession[] = [
  {
    id: "session-1",
    title: "Unity | Introduction à l'éditeur",
    subtitle: "Découvrir l'interface, projets et gestion des packages",
    description: "Tour d'horizon de l'Editor, organisation d'un projet, import d'assets, gestion via Package Manager et bonnes pratiques de structure.",
    image: "/Formation/Unity1.jpg",
    formatter:{
      name: "Alexis Caron",
      role: "Game Developer",
      image: "/Organigramme/homme5.jpeg",
    }
  },
  {
    id: "session-2",
    title: "Unity | Scenes & GameObjects",
    subtitle: "Composer une scène et manipuler les composants",
    description: "Création de scènes, hiérarchie, transforms, prefabs, matériaux et lights. Focus sur le workflow rapide et réutilisable.",
    image: "/Formation/Unity2.webp",
    formatter:{
      name: "Hugo Martin",
      role: "Technical Artist",
      image: "/Organigramme/homme2.jpeg",
    }
  },
  {
    id: "session-3",
    title: "Unity | Scripting C# (bases)",
    subtitle: "Cycle de vie MonoBehaviour et interactions simples",
    description: "Variables, Update/Start, input utilisateur, collisions et communication entre objets. Exemples concrets orientés gameplay.",
    image: "/Formation/Unity3.webp",
    formatter:{
      name: "Sophie Chamberlain",
      role: "Responsable Pédagogie",
      image: "/Organigramme/femme3.jpeg",
    }
  },
  {
    id: "session-4",
    title: "GitHub | Introduction et configuration",
    subtitle: "Repos, README, issues et collaboration",
    description: "Créer un dépôt, cloner, protections de branches, gestion des issues et règles de contribution pour un projet sain.",
    image: "/Formation/Github1.webp",
    formatter:{
      name: "Camille Bernard",
      role: "Product Owner",
      image: "/Organigramme/femme7.jpeg",
    }
  },
  {
    id: "session-5",
    title: "GitHub | Branches & Pull Requests",
    subtitle: "GitFlow simplifié et revues de code",
    description: "Créer des branches, ouvrir une PR, demander une review, résoudre les conflits et fusionner proprement (squash/merge).",
    image: "/Formation/Github2.png",
    formatter:{
      name: "Thomas Leroy",
      role: "Scrum Master",
      image: "/Organigramme/homme4.jpeg",
    }
  },
  {
    id: "session-6",
    title: "GitHub | Actions (CI/CD)",
    subtitle: "Automatiser tests, builds et déploiements",
    description: "Workflows YAML, déclencheurs, secrets, jobs et matrices. Mise en place d'une CI de base pour un projet web.",
    image: "/Formation/Github3.png",
    formatter:{
      name: "Lina Moretti",
      role: "Data Analyst",
      image: "/Organigramme/femme1.jpeg",
    }
  },
  {
    id: "session-7",
    title: "Trello | Introduction",
    subtitle: "Tableaux, listes et cartes pour s'organiser",
    description: "Créer un board, inviter des membres, structurer des listes, cartes, labels et checklists. Méthodes pour rester clair.",
    image: "/Formation/Trello1.png",
    formatter:{
      name: "Nadia Lopez",
      role: "Cheffe de projet",
      image: "/Organigramme/femme6.jpeg",
    }
  },
  {
    id: "session-8",
    title: "Trello | Power-Ups & automatisations",
    subtitle: "Butler, règles et intégrations utiles",
    description: "Configurer des règles automatiques, boutons, échéances, et connecter Trello à d'autres outils pour gagner du temps.",
    image: "/Formation/Trello2.webp",
    formatter:{
      name: "Ava Chen",
      role: "Admin Outils",
      image: "/Organigramme/femme2.jpeg",
    }
  },
  {
    id: "session-9",
    title: "Trello | Méthodes de travail",
    subtitle: "Kanban léger, priorisation et rituels",
    description: "Mettre en place un flux simple, définir les priorités, suivre l'avancement et partager l'information efficacement.",
    image: "/Formation/Trello3.webp",
    formatter:{
      name: "Orlando Diggs",
      role: "Customer Success Lead",
      image: "/Organigramme/homme4.jpeg",
    }
  },
  {
    id: "session-10",
    title: "Jira | Bonnes pratiques & templates",
    subtitle: "Standardiser, documenter et accélérer vos projets",
    description: "Naming, champs personnalisés, templates de projet, conventions d'équipe et astuces pour gagner en qualité et vitesse.",
    image: "/Formation/Jira1.png",
    formatter:{
      name: "Sarah Dupont",
      role: "Conceptrice de processus",
      image: "/Organigramme/femme5.jpeg",
    }
  },
  {
    id: "session-11",
    title: "Jira | Tableaux Scrum & Kanban",
    subtitle: "Configurer colonnes, WIP et quick filters",
    description: "Mise en place de boards adaptés, limites de travaux en cours, swimlanes et routines quotidiennes pour un flux maîtrisé.",
    image: "/Formation/Jira2.png",
    formatter:{
      name: "Noah Patel",
      role: "Responsable Formation",
      image: "/Organigramme/homme1.jpeg",
    }
  },
  {
    id: "session-12",
    title: "Jira | Automatisations avancées",
    subtitle: "Chainer triggers, conditions et actions",
    description: "Exemples concrets d'automatisation: assignations dynamiques, champs calculés, transitions conditionnelles et notifications ciblées.",
    image: "/Formation/Jira3.png",
    formatter:{
      name: "Ava Chen",
      role: "Admin Jira",
      image: "/Organigramme/femme2.jpeg",
    }
  },
];
