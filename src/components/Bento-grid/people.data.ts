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
    status: "onboarder",
  },
  {
    id: "people-emma",
    name: "Emma Dubois",
    role: "",
    team: "Opérations",
    email: "emma.dubois@pixelplay.com",
    avatar: "/Organigramme/femme2.jpeg",
    status: "Actif",
  },
  {
    id: "people-isabelle",
    name: "Isabelle Leroy",
    role: "VP RH",
    team: "Ressources Humaines",
    email: "isabelle.leroy@pixelplay.com",
    avatar: "/Organigramme/femme4.jpeg",
    status: "Actif",
  },
  {
    id: "people-sophie",
    name: "Sophie Clerc",
    role: "VP Ingénierie",
    team: "Engineering",
    email: "sophie.clerc@pixelplay.com",
    avatar: "/Organigramme/femme3.jpeg",
    status: "En onboarding",
  },
  {
    id: "people-marc",
    name: "Marc Évrard",
    role: "Director Engineering",
    team: "Engineering",
    email: "marc.evrard@pixelplay.com",
    avatar: "/Organigramme/homme4.jpeg",
    status: "Actif",
  },
  {
    id: "people-nadia",
    name: "Nadia Lefèvre",
    role: "Director Data",
    team: "Data",
    email: "nadia.lefevre@pixelplay.com",
    avatar: "/Organigramme/femme8.jpeg",
    status: "Arrive bientôt",
  },
];
