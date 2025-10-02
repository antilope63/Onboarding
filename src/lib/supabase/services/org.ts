import type { OrgNode } from "@/types/org";
import { getSupabaseBrowserClient } from "../client";
import { mapOrgNode } from "../mappers";
import type { DbOrgNodeRow } from "../types";

export type OrgNodePayload = {
  name: string;
  title: string;
  image?: string;
  count?: number;
  parentId?: string | null;
  sortOrder?: number;
};

export type OrgNodeUpdatePayload = Partial<OrgNodePayload>;

function serializeNodePayload(payload: OrgNodePayload) {
  return {
    name: payload.name,
    title: payload.title,
    image: payload.image ?? null,
    team_size: payload.count ?? null,
    parent_id: payload.parentId ?? null,
    sort_order:
      payload.sortOrder ?? Math.floor(Date.now() / 1000),
  } satisfies Partial<DbOrgNodeRow>;
}

function serializeNodeUpdate(payload: OrgNodeUpdatePayload) {
  const result: Partial<DbOrgNodeRow> = {};
  if (payload.name !== undefined) result.name = payload.name;
  if (payload.title !== undefined) result.title = payload.title;
  if (payload.image !== undefined) result.image = payload.image;
  if (payload.count !== undefined) result.team_size = payload.count;
  if (payload.parentId !== undefined) result.parent_id = payload.parentId;
  if (payload.sortOrder !== undefined) result.sort_order = payload.sortOrder;
  return result;
}

export async function fetchOrgTree(): Promise<OrgNode | null> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from<DbOrgNodeRow>("org_nodes")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(
      `Impossible de récupérer l'organigramme: ${error.message}`
    );
  }

  if (!data?.length) {
    return null;
  }

  const registry = new Map<string, { row: DbOrgNodeRow; node: OrgNode }>();

  data.forEach((row) => {
    registry.set(row.id, { row, node: mapOrgNode(row, []) });
  });

  const roots: OrgNode[] = [];

  registry.forEach((entry) => {
    if (entry.row.parent_id) {
      const parent = registry.get(entry.row.parent_id);
      if (parent) {
        if (!parent.node.children) {
          parent.node.children = [];
        }
        parent.node.children.push(entry.node);
      } else {
        roots.push(entry.node);
      }
    } else {
      roots.push(entry.node);
    }
  });

  const sortRecursive = (node: OrgNode) => {
    if (!node.children) return;
    node.children.sort((a, b) => {
      const metaA = registry.get(a.id)?.row.sort_order ?? 0;
      const metaB = registry.get(b.id)?.row.sort_order ?? 0;
      return metaA - metaB;
    });
    node.children.forEach(sortRecursive);
  };

  roots.forEach(sortRecursive);

  return roots[0] ?? null;
}

export async function createOrgNode(
  payload: OrgNodePayload
): Promise<OrgNode> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from<DbOrgNodeRow>("org_nodes")
    .insert([serializeNodePayload(payload)])
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(
      `Impossible de créer le nœud d'organigramme: ${error?.message}`
    );
  }

  return mapOrgNode(data, []);
}

export async function updateOrgNode(
  id: string,
  payload: OrgNodeUpdatePayload
): Promise<OrgNode> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from<DbOrgNodeRow>("org_nodes")
    .update(serializeNodeUpdate(payload))
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(
      `Impossible de mettre à jour le nœud d'organigramme: ${error?.message}`
    );
  }

  return mapOrgNode(data, []);
}

export async function deleteOrgNode(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from<DbOrgNodeRow>("org_nodes")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(
      `Impossible de supprimer le nœud d'organigramme: ${error.message}`
    );
  }
}
