export type TaskStatus = "todo" | "in-progress" | "done" | "verified";

export interface Task {
  name: string;
  description: string;
  status: TaskStatus;
}
export interface Phase {
  name: string;
  tasks: Task[];
}

export const phases: Phase[] = [
  {
    name: "Setup",
    tasks: [
      {
        name: "Init project",
        description: "Créer app Next.js",
        status: "verified",
      },
      {
        name: "Setup Tailwind",
        description: "Configurer TailwindCSS",
        status: "verified",
      },
      {
        name: "GitHub repo",
        description: "Mettre en place GitHub",
        status: "done",
      },
    ],
  },
  {
    name: "UI",
    tasks: [
      {
        name: "Design mockups",
        description: "Maquettes Figma",
        status: "in-progress",
      },
      {
        name: "Navbar component",
        description: "Créer une navbar responsive",
        status: "todo",
      },
      {
        name: "Hero section",
        description: "Construire le hero en Bento grid",
        status: "todo",
      },
    ],
  },
  {
    name: "Features",
    tasks: [
      {
        name: "Progress bar",
        description: "Connecter avec tasks",
        status: "todo",
      },
      {
        name: "Auth system",
        description: "Mettre en place Auth",
        status: "todo",
      },
    ],
  },
];

export function getActivePhaseIndex(phases: Phase[]): number | null {
  for (let i = 0; i < phases.length; i++) {
    const phase = phases[i];
    const allDone = phase.tasks.every((t) => t.status === "done");
    if (!allDone) {
      return i;
    }
  }
  return null; // toutes les phases sont finies
}
export function getPhaseStats(phases: Phase[]) {
  const activeIndex = getActivePhaseIndex(phases);

  if (activeIndex === null) {
    return {
      activeIndex: null,
      done: 0,
      total: 0,
      percent: 100, // tout terminé
    };
  }

  const activePhase = phases[activeIndex];
  const total = activePhase.tasks.length;
  const done = activePhase.tasks.filter((t) => t.status === "verified").length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return {
    activeIndex,
    done,
    total,
    percent,
  };
}
