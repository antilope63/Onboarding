// app/ton-chemin/Bento_Doug.tsx (ou components/Bento-grid/Bento-grid.tsx selon ton arbo)
"use client";

import { getPhaseStats, phases } from "@/app/Tâches/data";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { CircularProgress } from "@/components/ui/CircularProgress.tsx";
import { cn } from "@/lib/utils";
import {
  BackpackIcon,
  CalendarIcon,
  GlobeIcon,
  IdCardIcon,
  ListBulletIcon,
  LockClosedIcon,
  ReaderIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";

export default function Bento_Doug() {
  const { activeIndex } = getPhaseStats(phases);
  const phaseNumber = activeIndex !== null ? activeIndex + 1 : phases.length;

  const Iconcolor = "text-white/90";
  const namecolor = "text-white/90";
  const descriptioncolor = "text-white/70";
  const ctacolor = "text-white/70";

  const features = [
    {
      Icon: ListBulletIcon,
      name: "Vos tâches",
      description: `vous etes a la phase n°${phaseNumber}`,
      href: "/",
      cta: "Go au tâches",
      iconColor: Iconcolor,
      nameColor: namecolor,
      ctaColor: ctacolor,
      descriptionColor: descriptioncolor,
      className:
        "rounded-2xl p-6 lg:col-span-3 lg:row-span-2 border border-white/20 bg-gradient-to-r from-[#1B1B37] via-[#1F2245] to-[#25284F]",
    },
    // HERO CENTRE
    {
      name: "Hero",
      href: "/",
      cta: "",
      Icon: () => null,
      layout: "center",
      className:
        "rounded-[32px] lg:col-span-6 lg:row-span-2 border border-white/10 bg-[radial-gradient(ellipse_at_50%_100%,#805CE3_30%,#683DD9_60%,#663AD8_100%)]",
      children: (
        <div className="text-white text-8xl font-extrabold leading-[0.95] translate-y-[-5rem] ">
          Pixelpay <br /> Onboarding
        </div>
      ),
    },
    {
      Icon: GlobeIcon,
      name: "Organigramme",
      description: "Supports 100+ languages and counting.",
      href: "/",
      cta: "Learn more",
      iconColor: Iconcolor,
      nameColor: namecolor,
      ctaColor: ctacolor,
      descriptionColor: descriptioncolor,
      className:
        "rounded-2xl p-6 lg:col-span-3 lg:row-span-1 border border-white/7 bg-gradient-to-r from-[#25284F] via-[#1F2245] to-[#1B1B37]",
    },
    {
      Icon: CalendarIcon,
      name: "follow up",
      description: "Use the calendar to filter your files by date.",
      href: "/",
      cta: "Learn more",
      iconColor: Iconcolor,
      nameColor: namecolor,
      ctaColor: ctacolor,
      descriptionColor: descriptioncolor,
      className:
        "rounded-2xl p-6 lg:col-span-3 lg:row-span-1 border border-white/7 bg-gradient-to-r from-[#25284F] via-[#1F2245] to-[#1B1B37]",
    },
    {
      Icon: LockClosedIcon,
      name: "mes acces",
      description:
        "Get notified when someone shares a file or mentions you in a comment.",
      href: "/",
      cta: "Learn more",
      iconColor: Iconcolor,
      nameColor: namecolor,
      ctaColor: ctacolor,
      descriptionColor: descriptioncolor,
      className:
        "rounded-2xl p-6 lg:col-span-3 lg:row-span-1 border border-white/7 bg-gradient-to-r from-[#1B1B37] via-[#1F2245] to-[#25284F]",
    },
    {
      Icon: IdCardIcon,
      name: "mes documents",
      description:
        "Get notified when someone shares a file or mentions you in a comment.",
      href: "/",
      cta: "Learn more",
      iconColor: Iconcolor,
      nameColor: namecolor,
      ctaColor: ctacolor,
      descriptionColor: descriptioncolor,
      className:
        "rounded-2xl p-6 lg:col-span-3 lg:row-span-2 border border-white/7 bg-[radial-gradient(ellipse_at_100%_0%,#25284F_30%,#1F2245_50%,#1B1B37_100%)]",
    },
    {
      Icon: ReaderIcon,
      name: "documentation",
      description:
        "Get notified when someone shares a file or mentions you in a comment.",
      href: "/",
      cta: "Learn more",
      iconColor: Iconcolor,
      nameColor: namecolor,
      ctaColor: ctacolor,
      descriptionColor: descriptioncolor,
      className:
        "rounded-2xl p-6 lg:col-span-3 lg:row-span-2 border border-white/7 bg-[radial-gradient(ellipse_at_0%_0%,#25284F_30%,#1F2245_50%,#1B1B37_100%)]",
    },
    // BOÎTE À OUTILS (logos interactifs)
    {
      Icon: BackpackIcon,
      name: "Boîte à Outils",
      description: "", // pas de texte
      href: "/", // garde si tu veux, mais il ne s’affichera pas
      cta: "Learn more", // ignoré car hideCta=true
      hideCta: true, // <<— clé : masque CTA et donc aucune animation de CTA
      iconColor: Iconcolor,
      nameColor: namecolor,
      ctaColor: ctacolor,
      descriptionColor: descriptioncolor,
      background: (
        <div className="relative h-full w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-[#25284F] via-[#1F2245] to-[#1B1B37]" />
          <div
            className={cn(
              "absolute inset-0 z-0 grid grid-cols-2 place-items-center h-2/3"
            )}
          >
            {[
              {
                src: "/Github_b.svg",
                alt: "GitHub",
              },
              {
                src: "/Unity_B.svg",
                alt: "Unity",
              },
              { src: "/jira.svg", alt: "Jira" },
              {
                src: "/unreal.png",
                alt: "Unreal",
              },
            ].map((l) => (
              <div
                key={l.alt}
                className={cn(
                  // état par défaut : grisé + translucide
                  "transition-all duration-300 cursor-pointer",
                  "opacity-50 grayscale",
                  // quand la card est survolée : tout reste dim sauf l’élément hover
                  "group-hover/logos:opacity-50 group-hover/logos:grayscale",
                  // quand CE logo est survolé : revient en normal
                  "hover:opacity-100 hover:grayscale-0",
                  // micro-interactions
                  "hover:-translate-y-1 hover:scale-105"
                )}
                style={{ filter: "none" }}
              >
                <Image
                  src={l.src}
                  alt={l.alt}
                  width={64}
                  height={64}
                  draggable={false}
                  priority={false}
                />
              </div>
            ))}
          </div>
        </div>
      ),
      className:
        "rounded-2xl p-6 lg:col-span-3 lg:row-span-2 border border-white/7",
    },

    {
      Icon: RocketIcon,
      name: "Mes formations",
      description:
        "Get notified when someone shares a file or mentions you in a comment.",
      href: "/",
      cta: "Learn more",
      iconColor: Iconcolor,
      nameColor: namecolor,
      ctaColor: ctacolor,
      descriptionColor: descriptioncolor,
      className:
        "rounded-2xl p-6 lg:col-span-3 lg:row-span-1 border border-white/7 bg-gradient-to-r from-[#1B1B37] via-[#1F2245] to-[#25284F]",
    },
  ];

  return (
    <div className="relative min-h-[100svh] bg-[#02061B] overflow-hidden">
      {/* ORB au-dessus */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center z-20">
        <div className="w-[calc(2*var(--r)+40px)] h-[calc(2*var(--r)+40px)] rounded-full bg-black/60 blur-[24px] opacity-30" />
        <CircularProgress
          strokeWidth={18}
          size={350}
          from="#A855F7"
          to="#6366F1"
          trackColor="#02061B"
        />
        <div className="w-[calc(2*var(--r))] h-[calc(2*var(--r))] rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] opacity-90" />
      </div>

      {/* WRAPPER + MASQUE */}
      <div
        className={[
          "relative h-[100svh] p-8 z-10",
          "[--r:clamp(140px,22vmin,190px)]",
          "[mask-image:radial-gradient(circle_at_center,transparent_var(--r),#000_var(--r))]",
          "[-webkit-mask-image:radial-gradient(circle_at_center,transparent_var(--r),#000_var(--r))]",
          "[mask-repeat:no-repeat] [mask-position:center] [mask-size:100%_100%]",
        ].join(" ")}
      >
        <BentoGrid className="grid h-full grid-cols-12 grid-rows-4 gap-6">
          {features.map((f) => (
            <BentoCard key={f.name} {...f} />
          ))}
        </BentoGrid>
      </div>
    </div>
  );
}
