export type PeopleStatus = "Actif" | "Arrive bientôt" | "En onboarding";

export type PeopleCardMember = {
  id: string;
  name: string;
  role: string;
  team: string;
  email: string;
  avatar?: string;
  status?: PeopleStatus;
  createdAt?: string;
  updatedAt?: string;
};
