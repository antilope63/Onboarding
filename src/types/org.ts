export type OrgNode = {
  id: string;
  name: string;
  title: string; // Rôle/position
  image?: string;
  count?: number; // Taille d'équipe optionnelle
  parentId?: string | null;
  children?: OrgNode[];
};
