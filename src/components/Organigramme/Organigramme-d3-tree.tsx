// components/OrgD3Tree.tsx
"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { OrgNode } from "@/types/org";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Tree = dynamic(() => import("react-d3-tree"), { ssr: false });

type RawNodeDatum = {
  name: string;
  attributes?: Record<string, string | number | boolean>;
  children?: RawNodeDatum[];
};

function toRaw(node: OrgNode): RawNodeDatum {
  const baseChildren = (node.children ?? []).map(toRaw);
  const syntheticTeamLeaf: RawNodeDatum[] =
    typeof node.count === "number"
      ? [
          {
            name: `Équipe : ${node.count}`,
            attributes: { type: "team-count" },
          },
        ]
      : [];

  return {
    name: node.name,
    attributes: {
      Rôle: node.title,
      Image: node.image ?? "",
    },
    children: [...baseChildren, ...syntheticTeamLeaf],
  };
}

type Props = {
  data: OrgNode;
  width?: number;
  height?: number;
};

export default function OrgD3Tree({ data }: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [translate, setTranslate] = useState<{ x: number; y: number }>({
    x: 0,
    y: 100,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<{
    name: string;
    role: string | undefined;
    image: string | undefined;
  } | null>(null);

  function toAsciiLetters(input: string): string {
    return input
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // retire les diacritiques
      .replace(/[^a-zA-Z\s'-]/g, ""); // garde lettres/espaces/apostrophes/traits d'union
  }

  function generateEmailFromName(fullName: string): string {
    const ascii = toAsciiLetters(fullName).trim();
    const parts = ascii.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "contact@pixelplay.com";
    const firstName = parts[0].toLowerCase().replace(/['-]/g, "");
    const lastName = (parts[parts.length - 1] || "")
      .toLowerCase()
      .replace(/['-]/g, "");
    if (lastName) return `${firstName}.${lastName}@pixelplay.com`;
    return `${firstName}@pixelplay.com`;
  }

  function generateOfficeNumber(
    name: string,
    role: string | undefined
  ): string {
    const roleText = (role || "").toLowerCase();
    const isFirstFloor =
      roleText.includes("ceo") ||
      roleText.includes("cto") ||
      roleText.includes("coo") ||
      roleText.includes("cfo") ||
      roleText.includes("vp");

    const base = isFirstFloor ? 100 : 0;
    const hash =
      Array.from(name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 100;
    const number = base + Math.max(1, hash); // évite 000/100 exact
    return String(number).padStart(3, "0"); // 0xx / 1xx
  }

  useEffect(() => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setTranslate({ x: rect.width / 2, y: 100 });
  }, []);

  const treeData = useMemo(() => toRaw(data), [data]);

  return (
    <section ref={wrapperRef} className="w-full h-screen">
      <Tree
        data={treeData}
        orientation="vertical"
        pathFunc="step" // "diagonal" ou "elbow" ou "straight" ou "step"
        zoomable
        draggable
        hasInteractiveNodes
        scaleExtent={{ min: 0.5, max: 2.5 }}
        translate={translate}
        collapsible={false}
        nodeSize={{ x: 220, y: 140 }}
        separation={{ siblings: 0.7, nonSiblings: 0.9 }}
        renderCustomNodeElement={({ nodeDatum, toggleNode }) => {
          const type = nodeDatum.attributes?.["type"] as string | undefined;
          const role = nodeDatum.attributes?.["Rôle"];
          const img = (nodeDatum.attributes?.["Image"] as string) || "";

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
                setSelectedPerson({
                  name: nodeDatum.name,
                  role: typeof role === "string" ? role : undefined,
                  image: img || undefined,
                });
                setIsDialogOpen(true);
              }}
              cursor="pointer"
            >
              {/* Card verticale compacte */}
              <foreignObject x={-80} y={-60} width={160} height={120}>
                <div className="relative z-10 flex flex-col items-center gap-2 px-3 py-3 bg-bleu_fonce_2 rounded-md shadow-sm w-[160px] cursor-pointer">
                  {/* Avatar */}
                  {img ? (
                    <img
                      src={img}
                      alt={nodeDatum.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-400" />
                  )}

                  {/* Texte */}
                  <div className="text-center leading-tight">
                    <div className="text-[11px] text-gray-400 font-bold truncate max-w-[140px] mx-auto">
                      {String(role ?? "")}
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
          // Récupère le rôle du parent (source)
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-bleu_fonce_2 text-white border-violet/30">
          <DialogHeader>
            <DialogTitle>{selectedPerson?.name}</DialogTitle>
            {selectedPerson?.role && (
              <DialogDescription className="text-violet-200">
                {selectedPerson.role}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="flex flex-col items-center gap-4">
            {selectedPerson?.image ? (
              <img
                src={selectedPerson.image}
                alt={selectedPerson.name}
                className="w-40 h-40 md:w-56 md:h-56 rounded-full object-cover shadow"
              />
            ) : (
              <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-gray-500" />
            )}

            <div className="text-center space-y-1">
              {selectedPerson?.name && (
                <p className="text-sm text-gray-200">
                  {generateEmailFromName(selectedPerson.name)}
                </p>
              )}
              <p className="text-sm text-gray-200">
                Bureau{" "}
                {generateOfficeNumber(
                  selectedPerson?.name || "",
                  selectedPerson?.role
                )}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
