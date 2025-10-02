// components/OrgD3Tree.tsx
"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { OrgNode } from "@/types/org";
import Image from "next/image";
import type { RawNodeDatum as D3RawNodeDatum } from "react-d3-tree";

const Tree = dynamic(() => import("react-d3-tree"), { ssr: false });

/**
 * Construit un index id -> OrgNode pour retrouver le nœud d’origine au clic,
 * sans violer le type de `attributes`.
 */
function buildIndex(root: OrgNode): Map<string, OrgNode> {
  const map = new Map<string, OrgNode>();
  const walk = (n: OrgNode) => {
    map.set(n.id, n);
    (n.children ?? []).forEach(walk);
  };
  walk(root);
  return map;
}

type Raw = D3RawNodeDatum;

/**
 * Convertit OrgNode -> RawNodeDatum pour react-d3-tree
 * en ne mettant dans `attributes` que des types primitifs.
 */
function toRaw(node: OrgNode): Raw {
  const baseChildren = (node.children ?? []).map(toRaw);

  const syntheticTeamLeaf: Raw[] =
    typeof node.count === "number"
      ? [
          {
            name: `Équipe : ${node.count}`,
            attributes: { type: "team-count" },
          },
        ]
      : [];

  const attrs: Record<string, string | number | boolean> = {
    Id: node.id,
    Rôle: node.title,
    Image: node.image ?? "",
  };

  return {
    name: node.name,
    attributes: attrs,
    children: [...baseChildren, ...syntheticTeamLeaf],
  };
}

type Props = {
  data: OrgNode;
  width?: number;
  height?: number;
  onSelectNode?: (node: OrgNode) => void;
};

export default function OrgD3Tree({ data, onSelectNode }: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [translate, setTranslate] = useState<{ x: number; y: number }>({
    x: 0,
    y: 100,
  });

  useEffect(() => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setTranslate({ x: rect.width / 2, y: 100 });
  }, []);

  const { treeData, indexById } = useMemo(() => {
    return { treeData: toRaw(data), indexById: buildIndex(data) };
  }, [data]);

  return (
    <section ref={wrapperRef} className="w-full h-screen">
      <Tree
        data={treeData as unknown as Raw} // sûr: notre structure respecte Raw
        orientation="vertical"
        pathFunc="step" // "diagonal" | "elbow" | "straight" | "step"
        zoomable
        draggable
        hasInteractiveNodes
        scaleExtent={{ min: 0.5, max: 2.5 }}
        translate={translate}
        collapsible={false}
        nodeSize={{ x: 220, y: 140 }}
        separation={{ siblings: 0.7, nonSiblings: 0.9 }}
        renderCustomNodeElement={({ nodeDatum }) => {
          const type = nodeDatum.attributes?.["type"] as string | undefined;
          const role = nodeDatum.attributes?.["Rôle"] as string | undefined;
          const img = (nodeDatum.attributes?.["Image"] as string) || "";
          const id = nodeDatum.attributes?.["Id"] as string | undefined;

          if (type === "team-count") {
            return (
              <g cursor="default">
                <foreignObject x={-50} y={-16} width={100} height={32}>
                  <div className="px-2 py-1 text-[11px] font-medium text-white bg-violet rounded-full w-fit mx-auto">
                    {nodeDatum.name}
                  </div>
                </foreignObject>
              </g>
            );
          }

          return (
            <g
              onClick={() => {
                if (id) {
                  const original = indexById.get(id);
                  if (original) onSelectNode?.(original);
                }
              }}
              cursor="pointer"
            >
              {/* Card verticale compacte */}
              <foreignObject x={-80} y={-60} width={160} height={120}>
                <div className="relative z-10 flex flex-col items-center gap-2 px-3 py-3 bg-bleu_fonce_2 rounded-md shadow-sm w-[160px] cursor-pointer">
                  {/* Avatar */}
                  {img ? (
                    <Image
                      src={img}
                      alt={nodeDatum.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-400" />
                  )}

                  {/* Texte */}
                  <div className="text-center leading-tight">
                    <div className="text-[11px] text-gray-400 font-bold truncate max-w-[140px] mx-auto">
                      {role ?? ""}
                    </div>
                    <div className="text-sm font-semibold text-white truncate max-w-[140px] mx-auto">
                      {nodeDatum.name}
                    </div>
                  </div>
                </div>
              </foreignObject>
            </g>
          );
        }}
        pathClassFunc={(linkDatum) => {
          const parentRole = linkDatum.source?.data?.attributes?.["Rôle"] as
            | string
            | undefined;

          if (!parentRole) return "branch-default";
          if (parentRole === "CEO") return "branch-ceo";
          if (parentRole === "CTO") return "branch-cto";
          if (parentRole === "COO") return "branch-coo";
          if (parentRole === "CFO") return "branch-cfo";
          if (parentRole?.includes("VP")) return "branch-vp";
          return "branch-default";
        }}
      />
    </section>
  );
}
