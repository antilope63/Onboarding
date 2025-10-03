import type {
  DocumentLink,
  FaqItem,
  ProjectFolder,
  ProjectFolderDocument,
} from "@/types/documentation";
import { getSupabaseBrowserClient } from "../client";
import {
  mapDocumentLink,
  mapFaqItem,
  mapProjectFolder,
  mapProjectFolderDocument,
} from "../mappers";
import type {
  DbDocumentLinkRow,
  DbFaqItemRow,
  DbProjectFolderRow,
} from "../types";

export type DocumentLinkPayload = Omit<
  DocumentLink,
  "id" | "createdAt" | "updatedAt" | "iconComponent"
>;

export type DocumentLinkUpdatePayload = Partial<DocumentLinkPayload>;

function serializeDocumentPayload(payload: DocumentLinkPayload) {
  return {
    title: payload.title,
    description: payload.description,
    href: payload.href,
    icon_key: payload.iconKey,
    category: payload.category,
    external: Boolean(payload.external),
  } satisfies Partial<DbDocumentLinkRow>;
}

function serializeDocumentUpdate(payload: DocumentLinkUpdatePayload) {
  const result: Partial<DbDocumentLinkRow> = {};
  if (payload.title !== undefined) result.title = payload.title;
  if (payload.description !== undefined)
    result.description = payload.description;
  if (payload.href !== undefined) result.href = payload.href;
  if (payload.iconKey !== undefined) result.icon_key = payload.iconKey;
  if (payload.category !== undefined) result.category = payload.category;
  if (payload.external !== undefined)
    result.external = Boolean(payload.external);
  return result;
}

export async function listDocumentLinks(): Promise<DocumentLink[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("documentation_links")
    .select("*")
    .order("category", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    throw new Error(
      `Impossible de récupérer les ressources documentaires: ${error.message}`
    );
  }

  return ((data ?? []) as DbDocumentLinkRow[]).map(mapDocumentLink);
}

export async function createDocumentLink(
  payload: DocumentLinkPayload
): Promise<DocumentLink> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("documentation_links")
    .insert([serializeDocumentPayload(payload)])
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(
      `Impossible de créer la ressource documentaire: ${error?.message}`
    );
  }

  return mapDocumentLink(data as DbDocumentLinkRow);
}

export async function updateDocumentLink(
  id: string,
  payload: DocumentLinkUpdatePayload
): Promise<DocumentLink> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("documentation_links")
    .update(serializeDocumentUpdate(payload))
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(
      `Impossible de mettre à jour la ressource documentaire: ${error?.message}`
    );
  }

  return mapDocumentLink(data as DbDocumentLinkRow);
}

export async function deleteDocumentLink(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("documentation_links")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(
      `Impossible de supprimer la ressource documentaire: ${error.message}`
    );
  }
}

export async function listProjectFolders(): Promise<ProjectFolder[]> {
  const supabase = getSupabaseBrowserClient();
  const { data: folderRows, error: folderError } = await supabase
    .from("project_folders")
    .select("*")
    .order("name", { ascending: true });

  if (folderError) {
    throw new Error(
      `Impossible de récupérer les dossiers projet: ${folderError.message}`
    );
  }

  const { data: linkRows, error: linkError } = await supabase
    .from("project_folder_documents")
    .select("*");

  if (linkError) {
    throw new Error(
      `Impossible de récupérer les liens de dossiers: ${linkError.message}`
    );
  }

  const documentsByFolder = new Map<string, ProjectFolderDocument[]>();
  (linkRows ?? []).forEach((row) => {
    const entry = mapProjectFolderDocument(row);
    const bucket = documentsByFolder.get(entry.folderId) ?? [];
    bucket.push(entry);
    documentsByFolder.set(entry.folderId, bucket);
  });

  return ((folderRows ?? []) as DbProjectFolderRow[]).map((row) =>
    mapProjectFolder(row, documentsByFolder.get(row.id) ?? [])
  );
}

export async function listFaqItems(): Promise<FaqItem[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("faq_items")
    .select("*")
    .order("category", { ascending: true })
    .order("question", { ascending: true });

  if (error) {
    throw new Error(`Impossible de récupérer la FAQ: ${error.message}`);
  }

  return ((data ?? []) as DbFaqItemRow[]).map(mapFaqItem);
}
