export type FormationFormatter = {
  name: string;
  role: string;
  image: string;
};

export type FormationSession = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  formatter: FormationFormatter;
  done: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ScheduledSession = {
  id: string;
  sessionId: string;
  slot: string;
  date: string;
  updatedAt: number;
  createdAt?: string;
};
