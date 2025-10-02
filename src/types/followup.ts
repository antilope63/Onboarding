export type FollowupStatus = "Obligatoire" | "Optionnel" | "Programmé";
export type FollowupColor = "vert" | "violet" | "orange" | "gris";

export type FollowupMeeting = {
  id: string;
  titre: string;
  type: string;
  date: string;
  statut: FollowupStatus;
  couleur: FollowupColor;
  startAt?: string | null;
  endAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type FollowupHighlight = {
  id: string;
  titre: string;
  type: string;
  statut: FollowupStatus;
  date: string;
  tempsRestant: string;
  progression: number;
  image: string;
  createdAt?: string;
  updatedAt?: string;
};

export type FollowupDateBadge = {
  id: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
};
