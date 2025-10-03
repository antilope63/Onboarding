export type DbFormationSessionRow = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  formatter_name: string;
  formatter_role: string;
  formatter_image: string;
  done: boolean;
  created_at: string;
  updated_at: string;
};

export type DbFormationScheduleRow = {
  id: string;
  session_id: string;
  slot: string;
  scheduled_date: string;
  updated_at: string;
  created_at: string;
};

export type DbFollowupHighlightRow = {
  id: string;
  titre: string;
  type: string;
  statut: string;
  date_label: string;
  temps_restant: string;
  progression: number;
  image_url: string;
  created_at: string;
  updated_at: string;
};

export type DbFollowupMeetingRow = {
  id: string;
  titre: string;
  type: string;
  date_label: string;
  statut: string;
  couleur: string;
  start_at: string | null;
  end_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DbFollowupBadgeRow = {
  id: string;
  date_label: string;
  created_at: string;
  updated_at: string;
};

export type DbTaskPhaseRow = {
  id: string;
  name: string;
  position: number;
  created_at: string;
  updated_at: string;
};

export type DbTaskRow = {
  id: string;
  phase_id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type DbTeamMemberRow = {
  id: string;
  name: string;
  role: string;
  team: string;
  email: string;
  avatar: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
};

export type DbDocumentLinkRow = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon_key: string;
  category: string;
  external: boolean;
  created_at: string;
  updated_at: string;
};

export type DbProjectFolderRow = {
  id: string;
  name: string;
  description: string;
  summary: string;
  drive_url: string | null;
  accent_color: string | null;
  created_at: string;
  updated_at: string;
};

export type DbProjectFolderDocumentRow = {
  id: string;
  folder_id: string;
  document_id: string;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type DbFaqItemRow = {
  id: string;
  question: string;
  answer: string;
  tags: string[] | null;
  category: string;
  created_at: string;
  updated_at: string;
};

export type DbOrgNodeRow = {
  id: string;
  parent_id: string | null;
  name: string;
  title: string;
  image: string | null;
  team_size: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};
