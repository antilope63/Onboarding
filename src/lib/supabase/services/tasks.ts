import type { Phase, Task, TaskStatus } from "@/types/tasks";
import { getSupabaseBrowserClient } from "../client";
import { mapPhase, mapTask } from "../mappers";
import type { DbTaskPhaseRow, DbTaskRow } from "../types";

export type PhasePayload = Omit<Phase, "id" | "tasks" | "createdAt" | "updatedAt">;
export type PhaseUpdatePayload = Partial<Omit<PhasePayload, never>>;

export type TaskPayload = Omit<
  Task,
  "id" | "createdAt" | "updatedAt" | "phaseId"
> & { phaseId: string };
export type TaskUpdatePayload = Partial<Omit<TaskPayload, "phaseId">> & {
  phaseId?: string;
};

function serializePhasePayload(payload: PhasePayload) {
  return {
    name: payload.name,
    position: payload.position,
  } satisfies Partial<DbTaskPhaseRow>;
}

function serializePhaseUpdate(payload: PhaseUpdatePayload) {
  const result: Partial<DbTaskPhaseRow> = {};
  if (payload.name !== undefined) result.name = payload.name;
  if (payload.position !== undefined) result.position = payload.position;
  return result;
}

function serializeTaskPayload(payload: TaskPayload) {
  return {
    phase_id: payload.phaseId,
    name: payload.name,
    description: payload.description,
    status: payload.status,
  } satisfies Partial<DbTaskRow>;
}

function serializeTaskUpdate(payload: TaskUpdatePayload) {
  const result: Partial<DbTaskRow> = {};
  if (payload.phaseId !== undefined) result.phase_id = payload.phaseId;
  if (payload.name !== undefined) result.name = payload.name;
  if (payload.description !== undefined) result.description = payload.description;
  if (payload.status !== undefined) result.status = payload.status;
  return result;
}

export async function listPhasesWithTasks(): Promise<Phase[]> {
  const supabase = getSupabaseBrowserClient();
  const { data: phaseRows, error: phaseError } = await supabase
    .from("task_phases")
    .select("*")
    .order("position", { ascending: true });

  if (phaseError) {
    throw new Error(`Impossible de récupérer les phases: ${phaseError.message}`);
  }

  const { data: taskRows, error: taskError } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: true });

  if (taskError) {
    throw new Error(`Impossible de récupérer les tâches: ${taskError.message}`);
  }

  const tasksByPhase = new Map<string, Task[]>();
  ((taskRows ?? []) as DbTaskRow[]).forEach((row) => {
    const task = mapTask(row);
    const bucket = tasksByPhase.get(task.phaseId) ?? [];
    bucket.push(task);
    tasksByPhase.set(task.phaseId, bucket);
  });

  return ((phaseRows ?? []) as DbTaskPhaseRow[]).map((row) =>
    mapPhase(
      row,
      (tasksByPhase.get(row.id) ?? []).sort((a, b) =>
        a.createdAt && b.createdAt
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : a.name.localeCompare(b.name)
      )
    )
  );
}

export async function createPhase(payload: PhasePayload): Promise<Phase> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("task_phases")
    .insert([serializePhasePayload(payload)])
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`Impossible de créer la phase: ${error?.message}`);
  }

  return mapPhase(data as DbTaskPhaseRow, []);
}

export async function updatePhase(
  id: string,
  payload: PhaseUpdatePayload
): Promise<Phase> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("task_phases")
    .update(serializePhaseUpdate(payload))
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`Impossible de mettre à jour la phase: ${error?.message}`);
  }

  return mapPhase(data as DbTaskPhaseRow, []);
}

export async function deletePhase(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("task_phases")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Impossible de supprimer la phase: ${error.message}`);
  }
}

export async function createTask(payload: TaskPayload): Promise<Task> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("tasks")
    .insert([serializeTaskPayload(payload)])
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`Impossible de créer la tâche: ${error?.message}`);
  }

  return mapTask(data as DbTaskRow);
}

export async function updateTask(
  id: string,
  payload: TaskUpdatePayload
): Promise<Task> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("tasks")
    .update(serializeTaskUpdate(payload))
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`Impossible de mettre à jour la tâche: ${error?.message}`);
  }

  return mapTask(data as DbTaskRow);
}

export async function deleteTask(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Impossible de supprimer la tâche: ${error.message}`);
  }
}

export async function updateTaskStatus(
  id: string,
  status: TaskStatus
): Promise<Task> {
  return updateTask(id, { status });
}
