import type {
  FormationSession,
  ScheduledSession,
} from "@/types/formation";
import { getSupabaseBrowserClient } from "../client";
import {
  mapFormationSchedule,
  mapFormationSession,
} from "../mappers";
import type {
  DbFormationScheduleRow,
  DbFormationSessionRow,
} from "../types";

export type FormationSessionPayload = Omit<
  FormationSession,
  "id" | "createdAt" | "updatedAt"
>;

export type FormationSessionUpdatePayload = Partial<
  Omit<FormationSessionPayload, "formatter">
> & {
  formatter?: Partial<FormationSessionPayload["formatter"]>;
};

function serializeSessionPayload(payload: FormationSessionPayload) {
  return {
    title: payload.title,
    subtitle: payload.subtitle,
    description: payload.description,
    image: payload.image,
    formatter_name: payload.formatter.name,
    formatter_role: payload.formatter.role,
    formatter_image: payload.formatter.image,
    done: payload.done,
  } satisfies Partial<DbFormationSessionRow>;
}

function serializeSessionUpdate(payload: FormationSessionUpdatePayload) {
  const result: Partial<DbFormationSessionRow> = {};

  if (payload.title !== undefined) result.title = payload.title;
  if (payload.subtitle !== undefined) result.subtitle = payload.subtitle;
  if (payload.description !== undefined)
    result.description = payload.description;
  if (payload.image !== undefined) result.image = payload.image;
  if (payload.done !== undefined) result.done = payload.done;

  if (payload.formatter) {
    if (payload.formatter.name !== undefined)
      result.formatter_name = payload.formatter.name;
    if (payload.formatter.role !== undefined)
      result.formatter_role = payload.formatter.role;
    if (payload.formatter.image !== undefined)
      result.formatter_image = payload.formatter.image;
  }

  return result;
}

export async function listFormationSessions(): Promise<FormationSession[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from<DbFormationSessionRow>("formation_sessions")
    .select("*")
    .order("title", { ascending: true });

  if (error) {
    throw new Error(`Impossible de récupérer les formations: ${error.message}`);
  }

  return (data ?? []).map(mapFormationSession);
}

export async function createFormationSession(
  payload: FormationSessionPayload
): Promise<FormationSession> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from<DbFormationSessionRow>("formation_sessions")
    .insert([serializeSessionPayload(payload)])
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`Impossible de créer la formation: ${error?.message}`);
  }

  return mapFormationSession(data);
}

export async function updateFormationSession(
  id: string,
  payload: FormationSessionUpdatePayload
): Promise<FormationSession> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from<DbFormationSessionRow>("formation_sessions")
    .update(serializeSessionUpdate(payload))
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`Impossible de mettre à jour la formation: ${error?.message}`);
  }

  return mapFormationSession(data);
}

export async function deleteFormationSession(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from<DbFormationSessionRow>("formation_sessions")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Impossible de supprimer la formation: ${error.message}`);
  }
}

export async function listScheduledSessions(): Promise<ScheduledSession[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from<DbFormationScheduleRow>("formation_session_schedule")
    .select("*")
    .order("scheduled_date", { ascending: true });

  if (error) {
    throw new Error(
      `Impossible de récupérer les sessions programmées: ${error.message}`
    );
  }

  return (data ?? []).map(mapFormationSchedule);
}

export type ScheduleSessionPayload = {
  sessionId: string;
  slot: string;
  date: string;
};

export async function upsertScheduledSession(
  payload: ScheduleSessionPayload
): Promise<ScheduledSession> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from<DbFormationScheduleRow>("formation_session_schedule")
    .upsert(
      {
        session_id: payload.sessionId,
        slot: payload.slot,
        scheduled_date: payload.date,
      },
      { onConflict: "session_id" }
    )
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(
      `Impossible d'enregistrer la session programmée: ${error?.message}`
    );
  }

  return mapFormationSchedule(data);
}

export async function deleteScheduledSession(sessionId: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from<DbFormationScheduleRow>("formation_session_schedule")
    .delete()
    .eq("session_id", sessionId);

  if (error) {
    throw new Error(
      `Impossible de supprimer la session programmée: ${error.message}`
    );
  }
}

export async function clearScheduledSessions(): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from<DbFormationScheduleRow>("formation_session_schedule")
    .delete()
    .neq("session_id", "");

  if (error) {
    throw new Error(
      `Impossible de vider les sessions programmées: ${error.message}`
    );
  }
}
