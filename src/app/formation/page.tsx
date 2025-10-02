"use client";

import NavBar from "@/components/NavBar";
import SessionCard from "@/components/Formation/SessionCard";
import NoScroll from "@/components/NoScroll";
import type { FormationSession } from "./data";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type WheelEventHandler,
} from "react";
import Avatar from "@/components/Formation/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useFormationSchedule } from "@/contexts/FormationScheduleContext";
import { useManagedSessions } from "@/hooks/useManagedSessions";
import { Edit, Plus, Trash2 } from "lucide-react";

const LOOP_MULTIPLIER = 7;
const BUFFER_CYCLES = 2;
const DEFAULT_TIME_SLOTS = [
  "09h00 - 10h30",
  "11h00 - 12h30",
  "14h00 - 15h30",
  "16h00 - 17h30",
];

export default function FormationPage() {
  const { sessions: sessionList, addSession, updateSession, removeSession } =
    useManagedSessions();
  const baseLength = sessionList.length;
  const middleCycle = Math.floor(LOOP_MULTIPLIER / 2);
  const totalCards = baseLength * LOOP_MULTIPLIER;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { scheduledSessions, scheduleSession, cancelSession } =
    useFormationSchedule();
  const { role } = useAuth();
  const canManageSessions = role === "manager";

  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [sessionForm, setSessionForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    image: "",
    formatterName: "",
    formatterRole: "",
    formatterImage: "",
    done: false,
  });

  useEffect(() => {
    if (baseLength === 0) {
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((prev) => Math.min(prev, baseLength - 1));
  }, [baseLength]);

  const openSessionDialog = useCallback(
    (sessionToEdit?: FormationSession) => {
      if (sessionToEdit) {
        setSessionForm({
          title: sessionToEdit.title,
          subtitle: sessionToEdit.subtitle,
          description: sessionToEdit.description,
          image: sessionToEdit.image,
          formatterName: sessionToEdit.formatter.name,
          formatterRole: sessionToEdit.formatter.role,
          formatterImage: sessionToEdit.formatter.image,
          done: sessionToEdit.done,
        });
        setEditingSessionId(sessionToEdit.id);
      } else {
        setSessionForm({
          title: "",
          subtitle: "",
          description: "",
          image: "",
          formatterName: "",
          formatterRole: "",
          formatterImage: "",
          done: false,
        });
        setEditingSessionId(null);
      }
      setIsSessionDialogOpen(true);
    },
    []
  );

  const closeSessionDialog = useCallback(() => {
    setIsSessionDialogOpen(false);
    setEditingSessionId(null);
    setSessionForm({
      title: "",
      subtitle: "",
      description: "",
      image: "",
      formatterName: "",
      formatterRole: "",
      formatterImage: "",
      done: false,
    });
  }, []);

  const handleSessionSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!sessionForm.title.trim() || !sessionForm.subtitle.trim()) {
        return;
      }

      const payload = {
        title: sessionForm.title,
        subtitle: sessionForm.subtitle,
        description: sessionForm.description,
        image: sessionForm.image || "/Formation/custom-session.jpg",
        formatter: {
          name: sessionForm.formatterName || "À définir",
          role: sessionForm.formatterRole || "Coach",
          image: sessionForm.formatterImage || "/Organigramme/homme1.jpeg",
        },
        done: sessionForm.done,
      };

      if (editingSessionId) {
        updateSession(editingSessionId, payload);
      } else {
        addSession(payload);
      }

      closeSessionDialog();
    },
    [addSession, closeSessionDialog, editingSessionId, sessionForm, updateSession]
  );

  const handleSessionDelete = useCallback(
    (id: string, title: string) => {
      if (!window.confirm(`Supprimer la formation "${title}" ?`)) {
        return;
      }
      removeSession(id);
      cancelSession(id);
    },
    [cancelSession, removeSession]
  );

  const scheduledById = useMemo(() => {
    return new Map(scheduledSessions.map((item) => [item.sessionId, item]));
  }, [scheduledSessions]);
  const sliderRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cycleWidthRef = useRef(0);
  const isAdjustingRef = useRef(false);

  const currentSession = sessionList[currentIndex];
  const currentScheduledSession = currentSession
    ? scheduledById.get(currentSession.id)
    : undefined;
  const currentScheduledDate = useMemo(() => {
    if (!currentScheduledSession?.date) return null;
    const parsed = new Date(currentScheduledSession.date);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [currentScheduledSession?.date]);
  const timeSlots = currentSession ? DEFAULT_TIME_SLOTS : [];
  const upcomingDays = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() + index);
      return day;
    });
  }, []);
  const formatDayLabel = useCallback((day: Date) => {
    return day.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });
  }, []);
  const formatFullDate = useCallback((day: Date) => {
    return day.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });
  }, []);

  if (cardsRef.current.length !== totalCards) {
    cardsRef.current = Array.from({ length: totalCards }, () => null);
  }

  const normalizeLoopIndex = useCallback(
    (baseIndex: number) =>
      baseLength === 0 ? 0 : middleCycle * baseLength + baseIndex,
    [baseLength, middleCycle]
  );

  const updateCycleWidth = useCallback(() => {
    if (baseLength === 0) return;
    const first = cardsRef.current[0];
    const nextCycleStart = cardsRef.current[baseLength];
    if (!first || !nextCycleStart) return;
    cycleWidthRef.current = nextCycleStart.offsetLeft - first.offsetLeft;
  }, [baseLength]);

  const scrollSliderTo = (
    slider: HTMLDivElement,
    left: number,
    behavior: ScrollBehavior
  ) => {
    if (behavior === "auto") {
      const previous = slider.style.scrollBehavior;
      slider.style.scrollBehavior = "auto";
      slider.scrollTo({ left });
      slider.style.scrollBehavior = previous;
      return;
    }

    slider.scrollTo({ left, behavior });
  };

  const centerCard = (
    loopIndex: number,
    behavior: ScrollBehavior = "smooth"
  ) => {
    const slider = sliderRef.current;
    const card = cardsRef.current[loopIndex];
    if (!slider || !card) return;

    const target =
      card.offsetLeft - slider.clientWidth / 2 + card.clientWidth / 2;
    scrollSliderTo(slider, target, behavior);
  };

  useEffect(() => {
    if (baseLength === 0) return;

    let frame = requestAnimationFrame(function ensureCentered() {
      const slider = sliderRef.current;
      const card = cardsRef.current[normalizeLoopIndex(0)];
      if (!slider || !card) {
        frame = requestAnimationFrame(ensureCentered);
        return;
      }

      const target =
        card.offsetLeft - slider.clientWidth / 2 + card.clientWidth / 2;
      scrollSliderTo(slider, target, "auto");
      updateCycleWidth();
    });

    const handleResize = () => {
      requestAnimationFrame(updateCycleWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
    };
  }, [baseLength, middleCycle, normalizeLoopIndex, updateCycleWidth]);

  useEffect(() => {
    if (!isDialogOpen) {
      setSelectedSlot(null);
      setSelectedDate(null);
      return;
    }

    setSelectedSlot(currentScheduledSession?.slot ?? null);

    const fallbackDate = upcomingDays[0] ?? null;
    const initialDate = currentScheduledDate ?? fallbackDate;
    setSelectedDate(initialDate ? new Date(initialDate) : null);
  }, [
    isDialogOpen,
    currentIndex,
    currentScheduledSession?.slot,
    currentScheduledDate,
    upcomingDays,
  ]);

  // Pas d'auto-défilement vertical
  const handleWheel: WheelEventHandler<HTMLDivElement> = (event) => {
    const slider = sliderRef.current;
    if (!slider) return;

    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

    event.preventDefault();
    slider.scrollBy({ left: event.deltaY, behavior: "smooth" });
  };

  const handleScrollBounds = useCallback(() => {
    if (isAdjustingRef.current) return;
    const slider = sliderRef.current;
    const width = cycleWidthRef.current;
    if (!slider || !width || baseLength === 0) return;

    const buffer = Math.min(BUFFER_CYCLES, middleCycle);
    const lowerBound = buffer;
    const upperBound = LOOP_MULTIPLIER - buffer;

    const scrollLeft = slider.scrollLeft;
    const cycleIndex = Math.floor(scrollLeft / width);
    const offsetWithinCycle = scrollLeft - cycleIndex * width;

    if (cycleIndex < lowerBound || cycleIndex >= upperBound) {
      isAdjustingRef.current = true;
      const target = offsetWithinCycle + middleCycle * width;
      scrollSliderTo(slider, target, "auto");
      requestAnimationFrame(() => {
        isAdjustingRef.current = false;
      });
    }
  }, [baseLength, middleCycle]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || baseLength === 0) return;

    const onScroll = () => handleScrollBounds();

    slider.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      slider.removeEventListener("scroll", onScroll);
    };
  }, [baseLength, handleScrollBounds]);

  const activateCard = (loopIndex: number) => {
    if (baseLength === 0) return;

    const baseIndex = ((loopIndex % baseLength) + baseLength) % baseLength;
    const slider = sliderRef.current;
    const canonicalIndex = normalizeLoopIndex(baseIndex);

    let targetIndex = canonicalIndex;

    if (slider) {
      const candidates = [canonicalIndex, loopIndex].filter(
        (idx, pos, arr) => arr.indexOf(idx) === pos
      );

      const viewportCenter = slider.scrollLeft + slider.clientWidth / 2;

      let shortestDistance = Number.POSITIVE_INFINITY;

      candidates.forEach((candidate) => {
        const card = cardsRef.current[candidate];
        if (!card) return;

        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const distance = Math.abs(cardCenter - viewportCenter);

        if (distance < shortestDistance) {
          shortestDistance = distance;
          targetIndex = candidate;
        }
      });
    }

    setCurrentIndex(baseIndex);
    requestAnimationFrame(() => {
      centerCard(targetIndex);
    });
  };

  const handleOpenDialog = () => {
    if (currentSession?.done) return;

    setIsDialogOpen(true);
  };

  const handleConfirmReservation = () => {
    if (!selectedSlot || !selectedDate || !currentSession) return;

    scheduleSession(
      currentSession.id,
      selectedSlot,
      selectedDate.toISOString()
    );
    setIsDialogOpen(false);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    loopIndex: number
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activateCard(loopIndex);
    }
  };

  if (baseLength === 0) {
    return (
      <section className="relative flex min-h-screen flex-col items-center justify-center gap-6 bg-noir text-white">
        <NavBar classname="absolute top-0 left-0" />
        <NoScroll />
        <h1 className="text-4xl font-semibold">Aucune formation disponible pour le moment</h1>
        {canManageSessions ? (
          <>
            <p className="text-white/70">
              Ajoute une première session pour lancer le parcours onboarding.
            </p>
            <Button
              type="button"
              onClick={() => openSessionDialog()}
              className="inline-flex items-center gap-2 rounded-full bg-violet_fonce_1 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet"
            >
              <Plus className="h-4 w-4" />
              Créer une formation
            </Button>
          </>
        ) : (
          <p className="text-white/60">
            Reviens bientôt, les responsables préparent de nouvelles sessions.
          </p>
        )}
      </section>
    );
  }

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center gap-16 overflow-hidden bg-noir py-20">
      <NavBar classname="absolute top-0 left-0" />
      <NoScroll />

      <div className="flex flex-col items-center gap-2 text-center text-white my-12">
        <h1 className="text-6xl font-semibold">
          Besoin d&apos;un coup de Boost ? ✊
        </h1>
        <p className="text-white/70 text-2xl">
          Tes collègues ont hâte de te rencontrer !
        </p>
        {canManageSessions && (
          <Button
            type="button"
            onClick={() => openSessionDialog()}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-violet_fonce_1 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet"
          >
            <Plus className="h-4 w-4" />
            Ajouter une formation
          </Button>
        )}
      </div>

      <div className="w-full">
        <div
          ref={sliderRef}
          className="no-scrollbar flex gap-12 overflow-x-auto overflow-y-hidden text-white scroll-smooth snap-x snap-mandatory"
          onWheel={handleWheel}
        >
          {Array.from({ length: totalCards }, (_, idx) => {
            const baseIndex = idx % baseLength;
            const session = sessionList[baseIndex];
            const cycle = Math.floor(idx / baseLength);
            const isActive = baseIndex === currentIndex;
            const scheduledSession = scheduledById.get(session.id);

            return (
              <div
                key={`${session.id}-cycle-${cycle}`}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                role="button"
                tabIndex={0}
                onClick={() => activateCard(idx)}
                onKeyDown={(event) => handleKeyDown(event, idx)}
                className={`relative shrink-0 snap-center outline-none transition-all duration-300 ease-out ${
                  isActive
                    ? "scale-100 opacity-100"
                    : "scale-[0.92] opacity-60 filter grayscale"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                {canManageSessions && (
                  <div className="absolute left-3 top-3 z-30 flex gap-2">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        openSessionDialog(session);
                      }}
                      className="flex items-center gap-1 rounded-full border border-white/30 bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur transition hover:bg-white/10"
                    >
                      <Edit className="h-4 w-4" />
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleSessionDelete(session.id, session.title);
                      }}
                      className="flex items-center gap-1 rounded-full border border-red-400/40 bg-red-900/40 px-3 py-1 text-xs text-red-200 backdrop-blur transition hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer
                    </button>
                  </div>
                )}
                <SessionCard
                  title={session.title}
                  subtitle={session.subtitle}
                  description={session.description}
                  image={session.image}
                  isActive={isActive}
                  formatter={session.formatter}
                  done={session.done}
                  scheduled={Boolean(scheduledSession)}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center text-white flex flex-col items-center gap-4 max-w-[600px]">
        <Button
          type="button"
          className={`rounded-full text-md p-6 ${
            currentSession?.done
              ? "bg-gray-500 cursor-not-allowed opacity-60"
              : currentScheduledSession
              ? "bg-red-600 hover:bg-red-700 cursor-pointer"
              : "bg-violet_fonce_1 hover:bg-violet cursor-pointer"
          }`}
          disabled={Boolean(currentSession?.done)}
          onClick={() => {
            if (currentSession?.done) return;
            if (currentScheduledSession) {
              setIsCancelDialogOpen(true);
            } else {
              handleOpenDialog();
            }
          }}
        >
          {currentSession?.done
            ? "Déjà fait ✅"
            : currentScheduledSession
            ? "Annuler la formation"
            : "Réserver une session 🤝"}
        </Button>
        <p className="text-white/70">{currentSession?.description}</p>
        <Avatar
          name={currentSession?.formatter.name}
          role={currentSession?.formatter.role}
          avatar={currentSession?.formatter.image}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black/70 text-white border-white/10 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle>Réserver {currentSession?.title}</DialogTitle>
            <DialogDescription className="text-white/70">
              {currentSession
                ? `Choisis le créneau qui te convient pour valider ta formation avec ${currentSession.formatter.name}.`
                : "Choisis le créneau qui te convient pour valider ta formation."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-left">
              <p className="text-sm uppercase tracking-wide text-white/60">
                Détails de la session
              </p>
              <p className="mt-2 text-lg font-semibold">
                {currentSession?.subtitle}
              </p>
              {currentSession && (
                <p className="mt-3 text-sm text-white/60">
                  Avec {currentSession.formatter.name} ·{" "}
                  {currentSession.formatter.role}
                </p>
              )}
              {currentScheduledDate && (
                <p className="mt-2 text-sm text-white/60">
                  Date programmée : {formatFullDate(currentScheduledDate)}
                </p>
              )}
              {currentScheduledSession?.slot && (
                <p className="mt-1 text-sm text-white/60">
                  Créneau actuel : {currentScheduledSession.slot}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm uppercase tracking-wide text-white/60">
                Choisis une date
              </p>
              <div className="grid gap-3 sm:grid-cols-4">
                {upcomingDays.map((day) => {
                  const isSelected =
                    selectedDate?.toDateString() === day.toDateString();
                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => setSelectedDate(new Date(day))}
                      className={`rounded-lg border p-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet_fonce_1 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D2A] cursor-pointer select-none ${
                        isSelected
                          ? "border-violet_fonce_1 bg-violet_fonce_1/20 text-white"
                          : "border-white/10 bg-white/5 text-white/80 hover:border-violet_fonce_1 hover:bg-violet_fonce_1/10 hover:text-white"
                      }`}
                    >
                      {formatDayLabel(day)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {timeSlots.map((slot) => {
                const isSelected = slot === selectedSlot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-lg border p-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet_fonce_1 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D2A] cursor-pointer select-none ${
                      isSelected
                        ? "border-violet_fonce_1 bg-violet_fonce_1/20 text-white"
                        : "border-white/10 bg-white/5 text-white/80 hover:border-violet_fonce_1 hover:bg-violet_fonce_1/10 hover:text-white"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border-white/20 bg-transparent text-white hover:bg-white/10"
              >
                Annuler
              </Button>
            </DialogClose>
            <Button
              className="bg-violet_fonce_1 hover:bg-violet cursor-pointer"
              disabled={!selectedSlot || !selectedDate}
              onClick={handleConfirmReservation}
            >
              Valider ce créneau
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation d'annulation */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="bg-black/70 text-white border-white/10 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle>Annuler la programmation ?</DialogTitle>
            <DialogDescription className="text-white/70">
              {currentSession
                ? `Tu es sur le point d’annuler la programmation de "${currentSession.title}".`
                : "Tu es sur le point d’annuler cette programmation."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border-white/20 bg-transparent text-white hover:bg-white/10"
              >
                Revenir
              </Button>
            </DialogClose>
            <Button
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
              onClick={() => {
                if (currentSession) {
                  cancelSession(currentSession.id);
                }
                setIsCancelDialogOpen(false);
              }}
            >
              Confirmer l’annulation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {canManageSessions && (
        <Dialog
          open={isSessionDialogOpen}
          onOpenChange={(open) => {
            if (!open) closeSessionDialog();
          }}
        >
          <DialogContent className="bg-[#13162F] text-white border-white/10">
            <DialogHeader>
              <DialogTitle>
                {editingSessionId
                  ? "Modifier la formation"
                  : "Nouvelle formation"}
              </DialogTitle>
              <DialogDescription className="text-white/70">
                Renseigne les détails de la formation disponible pour ton
                équipe.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSessionSubmit} className="space-y-4">
              <div className="grid gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                  Titre
                </label>
                <Input
                  value={sessionForm.title}
                  onChange={(event) =>
                    setSessionForm((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Ex: Unity | Introduction"
                  className="border-white/20 bg-white/10 text-white"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                  Sous-titre
                </label>
                <Input
                  value={sessionForm.subtitle}
                  onChange={(event) =>
                    setSessionForm((prev) => ({
                      ...prev,
                      subtitle: event.target.value,
                    }))
                  }
                  placeholder="Thème principal"
                  className="border-white/20 bg-white/10 text-white"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                  Description
                </label>
                <textarea
                  value={sessionForm.description}
                  onChange={(event) =>
                    setSessionForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Décris le contenu de la formation"
                  className="min-h-[140px] resize-y rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet_fonce_1"
                />
              </div>
              <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                    Illustration
                  </label>
                  <Input
                    value={sessionForm.image}
                    onChange={(event) =>
                      setSessionForm((prev) => ({
                        ...prev,
                        image: event.target.value,
                      }))
                    }
                    placeholder="/Formation/...jpg"
                    className="border-white/20 bg-white/10 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                    Formateur · Photo
                  </label>
                  <Input
                    value={sessionForm.formatterImage}
                    onChange={(event) =>
                      setSessionForm((prev) => ({
                        ...prev,
                        formatterImage: event.target.value,
                      }))
                    }
                    placeholder="/Organigramme/...jpeg"
                    className="border-white/20 bg-white/10 text-white"
                  />
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                    Formateur · Nom
                  </label>
                  <Input
                    value={sessionForm.formatterName}
                    onChange={(event) =>
                      setSessionForm((prev) => ({
                        ...prev,
                        formatterName: event.target.value,
                      }))
                    }
                    placeholder="Nom du formateur"
                    className="border-white/20 bg-white/10 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                    Formateur · Rôle
                  </label>
                  <Input
                    value={sessionForm.formatterRole}
                    onChange={(event) =>
                      setSessionForm((prev) => ({
                        ...prev,
                        formatterRole: event.target.value,
                      }))
                    }
                    placeholder="Rôle"
                    className="border-white/20 bg-white/10 text-white"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={sessionForm.done}
                  onChange={(event) =>
                    setSessionForm((prev) => ({
                      ...prev,
                      done: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border border-white/30 bg-white/10"
                />
                Formation déjà réalisée
              </label>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeSessionDialog}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-violet_fonce_1 hover:bg-violet"
                >
                  {editingSessionId ? "Enregistrer" : "Ajouter"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        :global([data-slot="dialog-overlay"]) {
          background: rgba(0, 0, 0, 0.7) !important;
          backdrop-filter: none;
        }
      `}</style>
    </section>
  );
}
