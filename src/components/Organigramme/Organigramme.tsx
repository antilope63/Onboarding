import React from "react";

export interface OrgNode {
  id: string;
  title: string;
  name: string;
  image?: string;
  count?: number;
  children?: OrgNode[];
}

// --- Une seule carte (personne) ---
function OrgChartNode({ node }: { node: OrgNode }) {
  return (
    <div className="relative z-10 flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-md shadow-sm">
      {node.image && (
        <img
          src={node.image}
          alt={node.name}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
      )}
      <div className="flex flex-col">
        <span className="text-xs text-violet leading-tight">{node.title}</span>
        <span className="text-sm font-semibold leading-tight">{node.name}</span>
      </div>

      {typeof node.count === "number" && (
        <span className="ml-auto px-2 py-1 text-xs font-medium text-white bg-violet_fonce_1 rounded-full">
          Équipe : {node.count}
        </span>
      )}
    </div>
  );
}

// --- Fonction utilitaire pour choisir l’espacement ---
function getSpacing(level: number) {
  if (level === 1) return "space-y-4"; // gros blocs (CPO / CFO)
  if (level === 2) return "space-y-2"; // VP
  return "space-y-2"; // encore plus bas (si tu descends plus loin)
}

// --- Les branches (enfants) ---
function OrgChartBranch({ nodes, level = 1 }: { nodes: OrgNode[]; level?: number }) {
  const spacing = getSpacing(level);

  return (
    <ul className={`mt-4 pl-8 border-l-2 border-violet_fonce_1 relative ${spacing}`}>
      {nodes.map((child) => (
        <li key={child.id} className="relative flex flex-col">
          {/* Ligne horizontale (sous la card) */}
          <div className="absolute left-[-2px] top-6 w-4 border-t-2 border-violet_fonce_1 z-0 pointer-events-none"></div>

          <OrgChartNode node={child} />

          {child.children && child.children.length > 0 && (
            <OrgChartBranch nodes={child.children} level={level + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}

// --- Composant principal ---
export default function OrgChart({ root }: { root: OrgNode }) {
  return (
    <div className="overflow-x-auto p-4 bg-gray-50 rounded-lg">
      <OrgChartNode node={root} />
      {root.children && root.children.length > 0 && (
        <OrgChartBranch nodes={root.children} level={1} />
      )}
    </div>
  );
}
