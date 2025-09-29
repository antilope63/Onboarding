"use client";
import { getPhaseStats, phases } from "@/app/Tâches/data";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { CircularProgress } from "@/components/ui/CircularProgress.tsx";
import {
  BellIcon,
  CalendarIcon,
  ClipboardIcon,
  FileTextIcon,
  GlobeIcon,
} from "@radix-ui/react-icons";

export default function Bento_Doug() {
  const { activeIndex, done, total, percent } = getPhaseStats(phases);
  const phaseNumber = activeIndex !== null ? activeIndex + 1 : phases.length;
  const Iconcolor = "text-white/90";
  const namecolor = "text-white/90";
  const descriptioncolor = "text-white/70";
  const ctacolor = "text-white/70";

  const features = [
    {
      Icon: ClipboardIcon,
      name: "Vos tâches",
      description: `vous etes a la phase n°${phaseNumber}`,
      href: "/",
      cta: "Go au tâches",
      iconColor: `${Iconcolor}`,
      nameColor: `${namecolor}`,
      ctaColor: `${ctacolor}`,
      descriptionColor: `${descriptioncolor}`,
      className:
        "rounded-2xl p-6 lg:col-span-3 lg:row-span-2 border border-white/20 bg-gradient-to-r from-[#1B1B37] via-[#1F2245] to-[#25284F]",
    },
    {
      name: "Hero",
      href: "/",
      cta: "",
      Icon: () => null,
      layout: "center", // NEW
      className:
        "rounded-[32px] lg:col-span-6 lg:row-span-2 border border-white/10 bg-[radial-gradient(ellipse_at_50%_100%,#805CE3_30%,#683DD9_60%,#663AD8_100%)]",
      children: (
        <div className="text-white text-8xl font-extrabold leading-[0.95] botom-4">
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
      iconColor: `${Iconcolor}`,
      nameColor: `${namecolor}`,
      ctaColor: `${ctacolor}`,
      descriptionColor: `${descriptioncolor}`,
      className:
        "rounded-2xl p-6 lg:col-span-3 lg:row-span-1 border border-white/7 bg-gradient-to-r from-[#25284F] via-[#1F2245] to-[#1B1B37]",
    },
    {
      Icon: CalendarIcon,
      name: "documentation",
      description: "Use the calendar to filter your files by date.",
      href: "/",
      cta: "Learn more",
      iconColor: `${Iconcolor}`,
      nameColor: `${namecolor}`,
      ctaColor: `${ctacolor}`,
      descriptionColor: `${descriptioncolor}`,
      className:
        "rounded-2xl p-6 lg:col-span-3 lg:row-span-1 border border-white/7 bg-gradient-to-r from-[#25284F] via-[#1F2245] to-[#1B1B37]",
    },
    {
      Icon: FileTextIcon,
      name: "mes acces",
      description:
        "Get notified when someone shares a file or mentions you in a comment.",
      href: "/",
      cta: "Learn more",
      iconColor: `${Iconcolor}`,
      nameColor: `${namecolor}`,
      ctaColor: `${ctacolor}`,
      descriptionColor: `${descriptioncolor}`,
      className:
        "rounded-2xl p-6 lg:col-span-3 lg:row-span-1 border border-white/7 bg-gradient-to-r from-[#1B1B37] via-[#1F2245] to-[#25284F]",
    },
    {
      Icon: BellIcon,
      name: "mes documents",
      description:
        "Get notified when someone shares a file or mentions you in a comment.",
      href: "/",
      cta: "Learn more",
      iconColor: `${Iconcolor}`,
      nameColor: `${namecolor}`,
      ctaColor: `${ctacolor}`,
      descriptionColor: `${descriptioncolor}`,
      className:
        "rounded-2xl p-6 lg:col-span-3 lg:row-span-2 border border-white/7 bg-gradient-to-tl from-[#1B1B37] via-[#1F2245] to-[#25284F]",
    },
    {
      Icon: BellIcon,
      name: "follow up / rdv",
      description:
        "Get notified when someone shares a file or mentions you in a comment.",
      href: "/",
      cta: "Learn more",
      iconColor: `${Iconcolor}`,
      nameColor: `${namecolor}`,
      ctaColor: `${ctacolor}`,
      descriptionColor: `${descriptioncolor}`,
      className:
        "rounded-2xl p-6 lg:col-span-3 lg:row-span-2 border border-white/7 bg-gradient-to-r from-[#25284F] via-[#1F2245] to-[#1B1B37]",
    },
    {
      Icon: BellIcon,
      name: "Mes formations",

      description:
        "Get notified when someone shares a file or mentions you in a comment.",
      href: "/",
      cta: "Learn more",
      iconColor: `${Iconcolor}`,
      nameColor: `${namecolor}`,
      ctaColor: `${ctacolor}`,
      descriptionColor: `${descriptioncolor}`,
      className:
        "rounded-2xl p-6 lg:col-span-3 lg:row-span-2 border border-white/7 bg-gradient-to-r from-[#1B1B37] via-[#1F2245] to-[#25284F]",
    },
    {
      Icon: FileTextIcon,
      name: "Notifications",
      description:
        "Get notified when someone shares a file or mentions you in a comment.",
      href: "/",
      cta: "Learn more",
      iconColor: `${Iconcolor}`,
      nameColor: `${namecolor}`,
      ctaColor: `${ctacolor}`,
      descriptionColor: `${descriptioncolor}`,
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

      {/* WRAPPER + MASQUE (les cards sont “creusées”) */}
      <div
        className={[
          "relative h-[100svh] p-8 z-10",
          "[--r:clamp(140px,22vmin,190px)]",
          "[mask-image:radial-gradient(circle_at_center,transparent_var(--r),#000_var(--r))]",
          "[-webkit-mask-image:radial-gradient(circle_at_center,transparent_var(--r),#000_var(--r))]",
          "[mask-repeat:no-repeat] [mask-position:center] [mask-size:100%_100%]",
        ].join(" ")}
      >
        {/* 👉 Le BentoGrid doit être DEDANS et prendre la hauteur */}
        <BentoGrid className="grid h-full grid-cols-12 grid-rows-4 gap-6">
          {features.map((f) => (
            <BentoCard key={f.name} {...f} />
          ))}
        </BentoGrid>
      </div>
    </div>
  );
}
