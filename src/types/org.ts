export type OrgNode = {
  id: string;
  name: string;
  title: string; // Rôle/position
  image?: string;
  count?: number; // Taille d'équipe optionnelle
  children?: OrgNode[];
};
