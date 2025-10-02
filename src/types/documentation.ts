import type { LucideIcon } from "lucide-react";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
  category: string;
  createdAt?: string;
  updatedAt?: string;
};

export type DocumentLink = {
  id: string;
  title: string;
  description: string;
  href: string;
  iconKey: string;
  category: string;
  external?: boolean;
  iconComponent?: LucideIcon;
  createdAt?: string;
  updatedAt?: string;
};

export type ProjectFolderDocument = {
  id: string;
  folderId: string;
  documentId: string;
  note?: string;
};

export type ProjectFolder = {
  id: string;
  name: string;
  description: string;
  summary: string;
  driveUrl?: string;
  accentColor?: string;
  documents: ProjectFolderDocument[];
  createdAt?: string;
  updatedAt?: string;
};
