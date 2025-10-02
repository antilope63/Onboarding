export type PeopleCardMember = {
  id: string;
  name: string;
  role: string;
  team: string;
  email: string;
  avatar?: string;
  status?: "Actif" | "Arrive bientôt" | "En onboarding";
};

export const TEAM_MEMBERS: PeopleCardMember[] = [
  {
    id: "people-alexandre",
    name: "Alexandre Martin",
    role: "stagiaire",
    team: "Direction Technique",
    email: "alexandre.martin@pixelplay.com",
    avatar: "/Organigramme/homme1.jpeg",
    status: "En onboarding",
  },
  {
    id: "people-emma",
    name: "Emma Dubois",
    role: "Nouvelle recrue",
    team: "Opérations",
    email: "emma.dubois@pixelplay.com",
    avatar: "/Organigramme/femme2.jpeg",
    status: "Actif",
  },
  {
    id: "people-isabelle",
    name: "Isabelle Leroy",
    role: "Nouvelle recrue",
    team: "Ressources Humaines",
    email: "isabelle.leroy@pixelplay.com",
    avatar: "/Organigramme/femme4.jpeg",
    status: "Actif",
  },
];
