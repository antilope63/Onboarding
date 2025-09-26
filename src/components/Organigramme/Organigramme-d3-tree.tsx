// components/OrgD3Tree.tsx
"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { OrgNode } from "@/types/org";

// On charge react-d3-tree en client-only pour éviter tout souci SSR.
const Tree = dynamic(() => import("react-d3-tree"), { ssr: false });

// Conversion vers le format attendu par react-d3-tree
type RawNodeDatum = {
  name: string;
  attributes?: Record<string, string | number | boolean>;
  children?: RawNodeDatum[];
};

function toRaw(node: OrgNode): RawNodeDatum {
  return {
    name: node.name,
    attributes: {
      Rôle: node.title,
      ...(typeof node.count === "number" ? { Équipe: node.count } : {}),
    },
    children: node.children?.map(toRaw),
  };
}

type Props = {
  data: OrgNode;
  // largeur/hauteur du viewport “canvas”
  width?: number;
  height?: number;
};

export default function OrgD3Tree({ data }: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Translate pour centrer le root au démarrage
  const [translate, setTranslate] = useState<{ x: number; y: number }>({
    x: 0,
    y: 100,
  });

  useEffect(() => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    // centre horizontalement le root, laisse 100px de marge top
    // setTranslate({ x: rect.width / 5, y: 400 });
    setTranslate({ x: rect.width / 2, y: 100 });
  }, []);

  // Données au format react-d3-tree
  const treeData = useMemo(() => toRaw(data), [data]);

  return (
    <div ref={wrapperRef} className="w-full h-[80vh]">
      <Tree
        data={treeData}
        orientation="vertical" // arbre descendant
        pathFunc="elbow" // lignes orthogonales
        zoomable={false}
        draggable={false}
        translate={translate} // centre initial
        collapsible={false} // on garde tout ouvert
        // Espace entre nœuds (px) : X = horizontal, Y = vertical
        nodeSize={{ x: 430, y: 150 }}
        // Séparation relative des nœuds (affine l’espacement horizontal/vertical)
        separation={{ siblings: 0.6, nonSiblings: 0.6 }}
        // Styles gérés via renderCustomNodeElement et props par défaut
        // On rend un contenu HTML riche via foreignObject si tu veux une “card” Tailwind :
        renderCustomNodeElement={({ nodeDatum, toggleNode }) => {
          // on récupère les attributs injectés depuis OrgNode
          const role = nodeDatum.attributes?.["Rôle"];
          const equipe = nodeDatum.attributes?.["Équipe"];
          return (
            <g onClick={toggleNode} cursor="default">
              <foreignObject x={-110} y={-28} width={220} height={64}>
                <div className="relative z-10 flex items-center gap-3 px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-violet leading-tight">
                      {String(role ?? "")}
                    </span>
                    <span className="text-sm font-semibold leading-tight">
                      {nodeDatum.name}
                    </span>
                  </div>
                  {typeof equipe === "number" && (
                    <span className="ml-auto px-2 py-1 text-[11px] font-medium text-white bg-violet rounded-full">
                      Équipe : {String(equipe)}
                    </span>
                  )}
                </div>
              </foreignObject>
            </g>
          );
        }}
      />
    </div>
  );
}
