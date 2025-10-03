import type { PeopleCardMember } from "@/types/people";
import { getSupabaseBrowserClient } from "../client";
import { mapTeamMember } from "../mappers";
import type { DbTeamMemberRow } from "../types";

export type TeamMemberPayload = Omit<
  PeopleCardMember,
  "id" | "createdAt" | "updatedAt"
>;

export type TeamMemberUpdatePayload = Partial<TeamMemberPayload>;

function serializeTeamMember(payload: TeamMemberPayload) {
  return {
    name: payload.name,
    role: payload.role,
    team: payload.team,
    email: payload.email,
    avatar: payload.avatar ?? null,
    status: payload.status ?? null,
  } satisfies Partial<DbTeamMemberRow>;
}

function serializeTeamMemberUpdate(payload: TeamMemberUpdatePayload) {
  const result: Partial<DbTeamMemberRow> = {};
  if (payload.name !== undefined) result.name = payload.name;
  if (payload.role !== undefined) result.role = payload.role;
  if (payload.team !== undefined) result.team = payload.team;
  if (payload.email !== undefined) result.email = payload.email;
  if (payload.avatar !== undefined) result.avatar = payload.avatar;
  if (payload.status !== undefined) result.status = payload.status;
  return result;
}

export async function listTeamMembers(): Promise<PeopleCardMember[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(
      `Impossible de récupérer les membres d'équipe: ${error.message}`
    );
  }

  return ((data ?? []) as DbTeamMemberRow[]).map(mapTeamMember);
}

export async function createTeamMember(
  payload: TeamMemberPayload
): Promise<PeopleCardMember> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("team_members")
    .insert([serializeTeamMember(payload)])
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(
      `Impossible de créer le membre d'équipe: ${error?.message}`
    );
  }

  return mapTeamMember(data as DbTeamMemberRow);
}

export async function updateTeamMember(
  id: string,
  payload: TeamMemberUpdatePayload
): Promise<PeopleCardMember> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("team_members")
    .update(serializeTeamMemberUpdate(payload))
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(
      `Impossible de mettre à jour le membre d'équipe: ${error?.message}`
    );
  }

  return mapTeamMember(data as DbTeamMemberRow);
}

export async function deleteTeamMember(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(
      `Impossible de supprimer le membre d'équipe: ${error.message}`
    );
  }
}
