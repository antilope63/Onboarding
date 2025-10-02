import type {
  FollowupHighlight,
  FollowupMeeting,
} from "@/types/followup";
import { getSupabaseBrowserClient } from "../client";
import {
  mapFollowupHighlight,
  mapFollowupMeeting,
} from "../mappers";
import type {
  DbFollowupHighlightRow,
  DbFollowupMeetingRow,
} from "../types";

export type FollowupHighlightPayload = Omit<
  FollowupHighlight,
  "createdAt" | "updatedAt"
>;

export type FollowupHighlightUpdatePayload = Partial<FollowupHighlightPayload>;

function serializeHighlightPayload(
  payload: FollowupHighlightPayload
): Partial<DbFollowupHighlightRow> {
  return {
    id: payload.id ?? "default",
    titre: payload.titre,
    type: payload.type,
    statut: payload.statut,
    date_label: payload.date,
    temps_restant: payload.tempsRestant,
    progression: payload.progression,
    image_url: payload.image,
  };
}

function serializeHighlightUpdate(
  payload: FollowupHighlightUpdatePayload
): Partial<DbFollowupHighlightRow> {
  const result: Partial<DbFollowupHighlightRow> = {};
  if (payload.id !== undefined) result.id = payload.id;
  if (payload.titre !== undefined) result.titre = payload.titre;
  if (payload.type !== undefined) result.type = payload.type;
  if (payload.statut !== undefined) result.statut = payload.statut;
  if (payload.date !== undefined) result.date_label = payload.date;
  if (payload.tempsRestant !== undefined)
    result.temps_restant = payload.tempsRestant;
  if (payload.progression !== undefined) result.progression = payload.progression;
  if (payload.image !== undefined) result.image_url = payload.image;
  return result;
}

export async function fetchFollowupHighlight(): Promise<FollowupHighlight | null> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from<DbFollowupHighlightRow>("followup_highlights")
    .select("*")
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(
      `Impossible de récupérer le prochain rendez-vous: ${error.message}`
    );
  }

  if (!data) {
    return null;
  }

  return mapFollowupHighlight(data);
}

export async function saveFollowupHighlight(
  payload: FollowupHighlightPayload
): Promise<FollowupHighlight> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from<DbFollowupHighlightRow>("followup_highlights")
    .upsert(serializeHighlightPayload(payload), { onConflict: "id" })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(
      `Impossible d'enregistrer le prochain rendez-vous: ${error?.message}`
    );
  }

  return mapFollowupHighlight(data);
}

export async function updateFollowupHighlight(
  id: string,
  payload: FollowupHighlightUpdatePayload
): Promise<FollowupHighlight> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from<DbFollowupHighlightRow>("followup_highlights")
    .update(serializeHighlightUpdate(payload))
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(
      `Impossible de mettre à jour le prochain rendez-vous: ${error?.message}`
    );
  }

  return mapFollowupHighlight(data);
}

export type FollowupMeetingPayload = Omit<
  FollowupMeeting,
  "id" | "createdAt" | "updatedAt"
>;

export type FollowupMeetingUpdatePayload = Partial<FollowupMeetingPayload>;

function serializeMeetingPayload(
  payload: FollowupMeetingPayload
): Partial<DbFollowupMeetingRow> {
  return {
    titre: payload.titre,
    type: payload.type,
    date_label: payload.date,
    statut: payload.statut,
    couleur: payload.couleur,
    start_at: payload.startAt ?? null,
    end_at: payload.endAt ?? null,
  };
}

function serializeMeetingUpdate(
  payload: FollowupMeetingUpdatePayload
): Partial<DbFollowupMeetingRow> {
  const result: Partial<DbFollowupMeetingRow> = {};
  if (payload.titre !== undefined) result.titre = payload.titre;
  if (payload.type !== undefined) result.type = payload.type;
  if (payload.date !== undefined) result.date_label = payload.date;
  if (payload.statut !== undefined) result.statut = payload.statut;
  if (payload.couleur !== undefined) result.couleur = payload.couleur;
  if (payload.startAt !== undefined) result.start_at = payload.startAt;
  if (payload.endAt !== undefined) result.end_at = payload.endAt;
  return result;
}

export async function listFollowupMeetings(): Promise<FollowupMeeting[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from<DbFollowupMeetingRow>("followup_meetings")
    .select("*")
    .order("date_label", { ascending: true });

  if (error) {
    throw new Error(`Impossible de récupérer les suivis: ${error.message}`);
  }

  return (data ?? []).map(mapFollowupMeeting);
}

export async function createFollowupMeeting(
  payload: FollowupMeetingPayload
): Promise<FollowupMeeting> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from<DbFollowupMeetingRow>("followup_meetings")
    .insert([serializeMeetingPayload(payload)])
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`Impossible de créer le suivi: ${error?.message}`);
  }

  return mapFollowupMeeting(data);
}

export async function updateFollowupMeeting(
  id: string,
  payload: FollowupMeetingUpdatePayload
): Promise<FollowupMeeting> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from<DbFollowupMeetingRow>("followup_meetings")
    .update(serializeMeetingUpdate(payload))
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`Impossible de mettre à jour le suivi: ${error?.message}`);
  }

  return mapFollowupMeeting(data);
}

export async function deleteFollowupMeeting(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from<DbFollowupMeetingRow>("followup_meetings")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Impossible de supprimer le suivi: ${error.message}`);
  }
}
