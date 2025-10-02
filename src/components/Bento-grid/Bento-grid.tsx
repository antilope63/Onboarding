// app/ton-chemin/Bento_Doug.tsx (ou components/Bento-grid/Bento-grid.tsx selon ton arbo)
"use client";

import { useMemo, useState } from "react";

import { prochainRdvDate } from "@/app/Reunion/data";
import { Task, getPhaseStats, phases } from "@/app/Taches/data";
import {
  BentoCard,
  BentoCardProps,
  BentoGrid,
} from "@/components/ui/bento-grid";
import { CircularProgress } from "@/components/ui/CircularProgress.tsx";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
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
import Link from "next/link";
import { AnimatedBeamBento } from "./animated_beam_bento";
import { TEAM_MEMBERS } from "./people.data";

export default function Bento_Doug() {
  const { activeIndex } = getPhaseStats(phases);
  const activePhase = activeIndex !== null ? phases[activeIndex] : null;

  const { role } = useAuth();
  const isManager = role === "manager";
  const isRh = role === "rh";
  const canManagePeople = isManager || isRh;

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(
    TEAM_MEMBERS[0]?.id ?? null
  );

  const selectedMember = useMemo(() => {
    if (!selectedMemberId) return TEAM_MEMBERS[0] ?? null;
    return TEAM_MEMBERS.find((member) => member.id === selectedMemberId) ?? null;
  }, [selectedMemberId]);

  const Iconcolor = "text-white/90";
  const namecolor = "text-white/90";
  const descriptioncolor = "text-white/70";
  const ctacolor = "text-white/70";

  const STATUS_LABEL: Record<Task["status"], string> = {
    todo: "À faire",
    "in-progress": "En cours",
    done: "Fait",
    verified: "Vérifié",
  };
  const STATUS_STYLE: Record<Task["status"], string> = {
    todo: "bg-white/5 text-white/70 border-white/15",
    "in-progress": "bg-blue-500/15 text-blue-200 border-blue-400/30",
    done: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
    verified: "bg-violet-500/15 text-violet-200 border-violet-400/30",
  };

  const files = [
    {
      name: "bitcoin.pdf",
      body: "Bitcoin is a cryptocurrency invented in 2008 by an unknown person or group of people using the name Satoshi Nakamoto.",
    },
    {
      name: "finances.xlsx",
      body: "A spreadsheet or worksheet is a file made of rows and columns that help sort data, arrange data easily, and calculate numerical data.",
    },
    {
      name: "logo.svg",
      body: "Scalable Vector Graphics is an Extensible Markup Language-based vector image format for two-dimensional graphics with support for interactivity and animation.",
    },
    {
      name: "keys.gpg",
      body: "GPG keys are used to encrypt and decrypt email, files, directories, and whole disk partitions and to authenticate messages.",
    },
    {
      name: "seed.txt",
      body: "A seed phrase, seed recovery phrase or backup seed phrase is a list of words which store all the information needed to recover Bitcoin funds on-chain.",
    },
  ];

  const features: BentoCardProps[] = [
    {
      Icon: ListBulletIcon,
      name: "Tâches",
      description: activePhase
        ? `Vous êtes à la phase ${activePhase.name} `
        : "Toutes les phases terminées 🎉",
      href: "/Taches",
      cta: "Go aux tâches",
      iconColor: Iconcolor,
      nameColor: namecolor,
      ctaColor: ctacolor,
      descriptionColor: descriptioncolor,
      className:
        "rounded-2xl p-6 lg:col-span-3 lg:row-span-2 border border-white/20 bg-gradient-to-r from-[#1B1B37] via-[#1F2245] to-[#25284F]",
      background: (
        <div className="absolute inset-0 p-6">
          {activePhase ? (
            <div className="flex h-full w-full flex-col">
              <div className="text-xs text-white/60 mb-2">
                {activePhase.name}
              </div>
              <ul
                role="list"
                className="mt-2 space-y-4 overflow-auto pr-1"
                style={{ maxHeight: "calc(100% - 2rem)" }}
              >
                {activePhase.tasks.map((t) => (
                  <li
                    key={t.name}
                    className={cn(
                      "flex items-start justify-between gap-3 rounded-lg border px-3 mx-auto mt-4 py-2 items-center",
                      "bg-white/[0.04] border-white/10",
                      // ✨ animation hover
                      "transition-all duration-300 cursor-pointer",
                      "opacity-80 hover:opacity-100",
                      "hover:-translate-y-1 hover:scale-105",
                      "w-[300] items-center"
                    )}
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-white/90 truncate">{t.name}</p>
                      <p className="text-[11px] text-white/60 truncate">
                        {t.description}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 border text-[10px] px-2 py-0.5 rounded-md leading-5",
                        STATUS_STYLE[t.status]
                      )}
                      title={STATUS_LABEL[t.status]}
                    >
<Link href="/Formulaire">
  {STATUS_LABEL[t.status]}
</Link>                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="h-full grid place-items-center text-white/80">
              🎉 Tout est validé !
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Hero",
      href: "/",
      cta: "",
      Icon: () => null,
      layout: "center" as const,
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
      description: "Presentation du personel",
      href: "/organigramme",
      cta: "Aller voir l'organigramme",
      iconColor: Iconcolor,
      nameColor: namecolor,
      ctaColor: ctacolor,
      descriptionColor: descriptioncolor,
      className:
        "rounded-2xl p-6 lg:col-span-3 lg:row-span-1 border border-white/7 bg-gradient-to-r from-[#25284F] via-[#1F2245] to-[#1B1B37]",
    },
    {
      Icon: CalendarIcon,
      name: "Réunion",
      description: "Votre prochaine Réunion est " + prochainRdvDate.date,
      href: "/Reunion",
      cta: "Aller au Réunion",
      iconColor: Iconcolor,
      nameColor: namecolor,
      ctaColor: ctacolor,
      descriptionColor: descriptioncolor,
      className:
        "rounded-2xl p-6 lg:col-span-3 lg:row-span-1 border border-white/7 bg-gradient-to-r from-[#25284F] via-[#1F2245] to-[#1B1B37]",
    },
    {
      Icon: LockClosedIcon,
      name: "Mes accès",
      description: "Gestion de vos accès",
      href: "/Acces",
      cta: "Gérer mes accès",
      iconColor: Iconcolor,
      nameColor: namecolor,
      ctaColor: ctacolor,
      descriptionColor: descriptioncolor,
      className:
        "rounded-2xl p-6 lg:col-span-3 lg:row-span-1 border border-white/7 bg-gradient-to-r from-[#1B1B37] via-[#1F2245] to-[#25284F]",
    },
    {
      Icon: IdCardIcon,
      name: "Mes documents",
      description: "Vos documents sont tous réunis ici.",
      href: "/Document",
      cta: "Voir mes documents",
      iconColor: Iconcolor,
      nameColor: namecolor,
      ctaColor: ctacolor,
      descriptionColor: descriptioncolor,
      className:
        "rounded-2xl p-6 lg:col-span-3 lg:row-span-2 border border-white/7 bg-[radial-gradient(ellipse_at_100%_0%,#25284F_30%,#1F2245_50%,#1B1B37_100%)]",
      background: (
        <Marquee
          pauseOnHover
          className="absolute top-10 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] [--duration:20s]"
        >
          {files.map((f, idx) => (
            <figure
              key={idx}
              className={cn(
                "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4 text-white",
                "border-white bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
                "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
              )}
            >
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-col">
                  <figcaption className="text-sm font-medium text-white">
                    {f.name}
                  </figcaption>
                </div>
              </div>
              <blockquote className="mt-2 text-xs">{f.body}</blockquote>
            </figure>
          ))}
        </Marquee>
      ),
    },
    {
      Icon: ReaderIcon,
      name: "Documentation",
      description: "Si tu à des questions c'est ici",
      href: "/documentation",
      cta: "J'ai une question",
      iconColor: Iconcolor,
      nameColor: namecolor,
      ctaColor: ctacolor,
      descriptionColor: descriptioncolor,
      className:
        "rounded-2xl p-6 lg:col-span-3 lg:row-span-2 border border-white/7 bg-[radial-gradient(ellipse_at_0%_0%,#25284F_30%,#1F2245_50%,#1B1B37_100%)]",
      background: <AnimatedBeamBento />,
    },
    {
      Icon: RocketIcon,
      name: "Mes formations",
      description: `Tu as besoin d'aide ? Forme-toi !`,
      href: "/formation",
      cta: "J'ai besoin d'aide",
      iconColor: Iconcolor,
      nameColor: namecolor,
      ctaColor: ctacolor,
      descriptionColor: descriptioncolor,
      className:
        "rounded-2xl p-6 lg:col-span-3 lg:row-span-1 border border-white/7 bg-gradient-to-r from-[#1B1B37] via-[#1F2245] to-[#25284F]",
    },
  ];

  const peopleCard: BentoCardProps = {
    Icon: () => null,
    name: " ",
    hideCta: true,
    className:
      "rounded-2xl lg:col-span-3 lg:row-span-2 border border-white/7",
    background: (
      <div className="absolute inset-0 flex flex-col gap-4 bg-gradient-to-br from-[#1B1B37] via-[#1F2245] to-[#25284F] p-6 text-white pointer-events-auto">
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4">
          {selectedMember?.avatar ? (
            <Image
              src={selectedMember.avatar}
              alt={selectedMember.name}
              width={72}
              height={72}
              className="h-16 w-16 rounded-2xl object-cover"
            />
          ) : (
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-lg font-semibold text-white/60">
              {selectedMember?.name
                ?.split(" ")
                .map((chunk) => chunk[0])
                .join("")
                .slice(0, 2) ?? "--"}
            </div>
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
              Profil sélectionné
            </span>
            <p className="truncate text-xl font-semibold">
              {selectedMember?.name ?? "Choisis un collaborateur"}
            </p>
            <p className="truncate text-sm text-white/70">
              {selectedMember
                ? `${selectedMember.role} · ${selectedMember.team}`
                : "Sélectionne une personne dans la liste"}
            </p>
          </div>
          {selectedMember && (
            <div className="flex flex-col items-end gap-1 text-right text-xs text-white/70">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase">
                {selectedMember.status ?? "Actif"}
              </span>
              <span className="truncate text-white/60">{selectedMember.email}</span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {TEAM_MEMBERS.map((member) => {
            const isActive = member.id === selectedMember?.id
            return (
              <button
                key={member.id}
                type="button"
                onClick={() => setSelectedMemberId(member.id)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition",
                  isActive
                    ? "border-white/40 bg-white/15 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white"
                )}
              >
                {member.avatar ? (
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold">
                    {member.name
                      .split(" ")
                      .map((chunk) => chunk[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-semibold">
                    {member.name}
                  </span>
                  <span className="truncate text-xs text-white/60">
                    {member.role}
                  </span>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
                  {member.status ?? "Actif"}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    ),
  }

  const toolboxCard: BentoCardProps = {
    Icon: BackpackIcon,
    name: "Boîte à Outils",
    description: "",
    cta: "Learn more",
    hideCta: true,
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
              href: "https://github.com/antilope63/Onboarding",
            },
            {
              src: "/Unity_B.svg",
              alt: "Unity",
              href: "https://unity.com",
            },
            {
              src: "/jira.svg",
              alt: "Jira",
              href: "https://www.atlassian.com/software/jira",
            },
            {
              src: "/unreal.png",
              alt: "Unreal",
              href: "https://www.unrealengine.com",
            },
          ].map((l) => (
            <Link
              key={l.alt}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "transition-all duration-300 cursor-pointer",
                "opacity-50 grayscale",
                "group-hover/logos:opacity-50 group-hover/logos:grayscale",
                "hover:opacity-100 hover:grayscale-0",
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
            </Link>
          ))}
        </div>
      </div>
    ),
    className: "rounded-2xl p-6 lg:col-span-3 lg:row-span-2 border border-white/7",
  };

  features.splice(
    -1,
    0,
    canManagePeople ? peopleCard : toolboxCard
  );

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
