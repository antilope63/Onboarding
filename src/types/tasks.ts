export type TaskStatus = "todo" | "in-progress" | "done" | "verified";

export type Task = {
  id: string;
  phaseId: string;
  name: string;
  description: string;
  status: TaskStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type Phase = {
  id: string;
  name: string;
  position: number;
  tasks: Task[];
  createdAt?: string;
  updatedAt?: string;
};
