import type {
  FollowupHighlight,
  FollowupMeeting,
} from "@/types/followup";
import type {
  FormationSession,
  ScheduledSession,
} from "@/types/formation";
import type {
  DocumentLink,
  ProjectFolder,
  ProjectFolderDocument,
  FaqItem,
} from "@/types/documentation";
import type { Phase, Task } from "@/types/tasks";
import type { PeopleCardMember } from "@/types/people";
import type { OrgNode } from "@/types/org";

import type {
  DbDocumentLinkRow,
  DbFaqItemRow,
  DbFollowupHighlightRow,
  DbFollowupMeetingRow,
  DbFormationScheduleRow,
  DbFormationSessionRow,
  DbOrgNodeRow,
  DbProjectFolderDocumentRow,
  DbProjectFolderRow,
  DbTaskPhaseRow,
  DbTaskRow,
  DbTeamMemberRow,
} from "./types";

export function mapFormationSession(row: DbFormationSessionRow): FormationSession {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    image: row.image,
    done: row.done,
    formatter: {
      name: row.formatter_name,
      role: row.formatter_role,
      image: row.formatter_image,
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapFormationSchedule(
  row: DbFormationScheduleRow
): ScheduledSession {
  return {
    id: row.id,
    sessionId: row.session_id,
    slot: row.slot,
    date: row.scheduled_date,
    updatedAt: new Date(row.updated_at).getTime(),
    createdAt: row.created_at,
  };
}

export function mapFollowupMeeting(row: DbFollowupMeetingRow): FollowupMeeting {
  return {
    id: row.id,
    titre: row.titre,
    type: row.type,
    date: row.date_label,
    statut: row.statut as FollowupMeeting["statut"],
    couleur: row.couleur as FollowupMeeting["couleur"],
    startAt: row.start_at,
    endAt: row.end_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapFollowupHighlight(
  row: DbFollowupHighlightRow
): FollowupHighlight {
  return {
    id: row.id,
    titre: row.titre,
    type: row.type,
    statut: row.statut as FollowupHighlight["statut"],
    date: row.date_label,
    tempsRestant: row.temps_restant,
    progression: row.progression,
    image: row.image_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapTask(row: DbTaskRow): Task {
  return {
    id: row.id,
    phaseId: row.phase_id,
    name: row.name,
    description: row.description,
    status: row.status as Task["status"],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapPhase(
  row: DbTaskPhaseRow,
  tasks: Task[] = []
): Phase {
  return {
    id: row.id,
    name: row.name,
    position: row.position,
    tasks,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapTeamMember(row: DbTeamMemberRow): PeopleCardMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    team: row.team,
    email: row.email,
    avatar: row.avatar ?? undefined,
    status: (row.status ?? undefined) as PeopleCardMember["status"],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapDocumentLink(row: DbDocumentLinkRow): DocumentLink {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    href: row.href,
    iconKey: row.icon_key,
    category: row.category,
    external: row.external,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapProjectFolder(
  row: DbProjectFolderRow,
  documents: ProjectFolderDocument[] = []
): ProjectFolder {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    summary: row.summary,
    driveUrl: row.drive_url ?? undefined,
    accentColor: row.accent_color ?? undefined,
    documents,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapProjectFolderDocument(
  row: DbProjectFolderDocumentRow
): ProjectFolderDocument {
  return {
    id: row.id,
    folderId: row.folder_id,
    documentId: row.document_id,
    note: row.note ?? undefined,
  };
}

export function mapFaqItem(row: DbFaqItemRow): FaqItem {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    tags: row.tags ?? undefined,
    category: row.category,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapOrgNode(
  row: DbOrgNodeRow,
  children: OrgNode[] = []
): OrgNode {
  return {
    id: row.id,
    parentId: row.parent_id,
    name: row.name,
    title: row.title,
    image: row.image ?? undefined,
    count: row.team_size ?? undefined,
    children,
  };
}
