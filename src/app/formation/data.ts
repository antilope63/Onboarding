export type FormationSession = {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  version?: "color" | "black_and_white";
  speaker?: {
    name: string;
    role: string;
    avatar: string;
  };
};

export const sessions: FormationSession[] = [
  {
    id: "session-1",
    title: "Session 1",
    description: "Description de la session 1",
    image: "/Formation/Jira1.png",
    duration: "1 heure",
    version: "black_and_white",
    speaker: {
      name: "Sarah Colin",
      role: "Directrice",
      avatar: "/Organigramme/femme1.jpeg",
    },
  },
];


