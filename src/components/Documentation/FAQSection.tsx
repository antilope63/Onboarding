"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircleQuestionMark } from "lucide-react";
import { FAQ_ITEMS } from "@/app/documentation/data";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export type FAQSectionProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  fadeTop?: number;
  fadeBottom?: number;
  easing?: "linear" | "strong";
  perspective?: boolean;
  perspectiveScaleMin?: number; // 0-1, ex: 0.96
  perspectiveZone?: number; // px, ex: 140
  scrollMode?: "contained" | "page";
};

export default function FAQSection({
  className,
  fadeTop = 64,
  fadeBottom = 64,
  easing = "strong",
  perspective = true,
  perspectiveScaleMin = 0.96,
  perspectiveZone = 140,
  scrollMode = "contained",
  ...rest
}: FAQSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [fadeTopPx, setFadeTopPx] = useState(0);
  const [fadeBottomPx, setFadeBottomPx] = useState(0);

  useEffect(() => {
    if (scrollMode === "page") {
      return;
    }
    const el = containerRef.current;
    if (!el) return;

    const TOP_FADE = fadeTop;
    const BOTTOM_FADE = fadeBottom;
    const updateFades = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setFadeTopPx(scrollTop > 0 ? TOP_FADE : 0);
      setFadeBottomPx(
        scrollTop + clientHeight < scrollHeight - 1 ? BOTTOM_FADE : 0
      );

      if (perspective) {
        const items = el.querySelectorAll(
          ".js-faq-item"
        ) as NodeListOf<HTMLElement>;
        const viewTop = scrollTop;
        const viewBottom = scrollTop + clientHeight;
        items.forEach((item) => {
          const itemTop = item.offsetTop;
          const itemHeight = item.offsetHeight;
          const itemCenter = itemTop + itemHeight / 2;
          const distanceToTopEdge = itemCenter - viewTop;
          const distanceToBottomEdge = viewBottom - itemCenter;
          const edgeDistance = Math.min(
            distanceToTopEdge,
            distanceToBottomEdge
          );

          const clamped = Math.max(0, Math.min(edgeDistance, perspectiveZone));
          const t = perspectiveZone === 0 ? 1 : clamped / perspectiveZone;
          const scale = perspectiveScaleMin + (1 - perspectiveScaleMin) * t;
          const origin =
            distanceToTopEdge <= distanceToBottomEdge
              ? "top center"
              : "bottom center";

          item.style.transformOrigin = origin;
          item.style.transform = `scale(${scale})`;
          item.style.willChange = "transform";
        });
      }
    };

    updateFades();
    el.addEventListener("scroll", updateFades, { passive: true });
    window.addEventListener("resize", updateFades);
    return () => {
      el.removeEventListener("scroll", updateFades as EventListener);
      window.removeEventListener("resize", updateFades);
    };
  }, [
    fadeTop,
    fadeBottom,
    perspective,
    perspectiveScaleMin,
    perspectiveZone,
    scrollMode,
  ]);

  const topSoft = Math.max(0, Math.round(fadeTopPx * 0.6));
  const bottomSoft = Math.max(0, Math.round(fadeBottomPx * 0.6));
  const maskImage =
    easing === "strong"
      ? `linear-gradient(to bottom,
          rgba(0,0,0,0) 0px,
          rgba(0,0,0,0.35) ${topSoft}px,
          rgba(0,0,0,1) ${fadeTopPx}px,
          rgba(0,0,0,1) calc(100% - ${fadeBottomPx}px),
          rgba(0,0,0,0.35) calc(100% - ${bottomSoft}px),
          rgba(0,0,0,0) 100%)`
      : `linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,1) ${fadeTopPx}px, rgba(0,0,0,1) calc(100% - ${fadeBottomPx}px), rgba(0,0,0,0) 100%)`;

  const isContained = scrollMode === "contained";

  return (
    <section
      className={cn(
        "relative flex w-full flex-col",
        isContained ? "h-[700px]" : "h-auto",
        className
      )}
      {...rest}
    >
      <div
        ref={containerRef}
        className={cn(
          "flex-1",
          isContained ? "min-h-0 overflow-y-auto" : "min-h-fit overflow-visible"
        )}
        style={
          isContained ? { WebkitMaskImage: maskImage, maskImage } : undefined
        }
      >
        <div className="">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-4">
              <MessageCircleQuestionMark className="w-8 h-8 text-white" />
              <h1 className="text-3xl font-bold text-white text-nowrap">
                Foire Aux Questions
              </h1>
            </div>
            <p className="text-white/80 pl-12">
              Retrouvez ici les réponses aux questions les plus fréquentes.
            </p>
          </div>

          {/* <div className="flex items-center gap-4 shrink-0">
          <MessageCircleQuestionMark className="w-14 h-14 stroke-2 text-white" />
          <div className="flex flex-col">
            <h2 className="text-4xl font-bold text-white">FAQ</h2>
            <p className="text-white/80">
              Retrouvez ici les réponses aux questions les plus fréquentes.
            </p>
          </div>
        </div> */}

          <div className="mt-12 flex-1 min-h-0 pr-2">
            {Object.entries(
              FAQ_ITEMS.reduce<Record<string, typeof FAQ_ITEMS>>(
                (acc, item) => {
                  (acc[item.category] ||= []).push(item);
                  return acc;
                },
                {}
              )
            ).map(([category, items]) => (
              <section key={category} className="mb-16 p-4 rounded-lg">
                <h3 className="text-white font-semibold text-4xl mb-2">
                  {category}
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {items.map((item) => (
                    <AccordionItem
                      key={item.id}
                      value={item.id}
                      className="js-faq-item"
                    >
                      <AccordionTrigger className="text-white/80 text-lg font-bold">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-white/80 whitespace-pre-wrap">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
            <div className="h-24"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
