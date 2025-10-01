export interface OrgNode {
  id: string;
  title: string;
  name: string;
  image?: string;
  count?: number;
  children?: OrgNode[];
}


