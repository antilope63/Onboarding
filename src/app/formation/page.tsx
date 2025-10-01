"use client";

import NavBar from "@/components/NavBar";
import SessionCard from "@/components/Formation/SessionCard";
import { sessions } from "./data";
import NoScroll from "@/components/NoScroll";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type WheelEventHandler,
} from "react";
import Avatar from "@/components/Formation/Avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const LOOP_MULTIPLIER = 7;
const BUFFER_CYCLES = 2;
const DEFAULT_TIME_SLOTS = [
  "09h00 - 10h30",
  "11h00 - 12h30",
  "14h00 - 15h30",
  "16h00 - 17h30",
];

export default function FormationPage() {
  const baseLength = sessions.length;
  const middleCycle = Math.floor(LOOP_MULTIPLIER / 2);
  const totalCards = baseLength * LOOP_MULTIPLIER;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cycleWidthRef = useRef(0);
  const isAdjustingRef = useRef(false);

  const currentSession = sessions[currentIndex];
  const timeSlots = currentSession ? DEFAULT_TIME_SLOTS : [];

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
    }
  }, [isDialogOpen, currentIndex]);

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

    setSelectedSlot(null);
    setSelectedDate(new Date());
    setIsDialogOpen(true);
  };

  const handleConfirmReservation = () => {
    if (!selectedSlot || !currentSession) return;

    console.log(
      `Réservation confirmée pour ${currentSession.title} - créneau ${selectedSlot}`
    );
    // Ferme le dialogue après la confirmation.
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
      <section className="flex min-h-screen items-center justify-center bg-noir text-white">
        <p>Aucune session disponible.</p>
      </section>
    );
  }

  const getNextDays = (count: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: count }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    });
  };

  const formatDayLabel = (d: Date) =>
    d.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });

  const upcomingDays = getNextDays(7);

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
      </div>

      <div className="w-full">
        <div
          ref={sliderRef}
          className="no-scrollbar flex gap-12 overflow-x-auto overflow-y-hidden text-white scroll-smooth snap-x snap-mandatory"
          onWheel={handleWheel}
        >
          {Array.from({ length: totalCards }, (_, idx) => {
            const baseIndex = idx % baseLength;
            const session = sessions[baseIndex];
            const cycle = Math.floor(idx / baseLength);
            const isActive = baseIndex === currentIndex;

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
                className={`shrink-0 snap-center outline-none transition-all duration-300 ease-out ${
                  isActive
                    ? "scale-100 opacity-100"
                    : "scale-[0.92] opacity-60 filter grayscale"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                <SessionCard
                  title={session.title}
                  subtitle={session.subtitle}
                  description={session.description}
                  image={session.image}
                  isActive={isActive}
                  formatter={session.formatter}
                  done={session.done}
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
              : "bg-violet_fonce_1 hover:bg-violet cursor-pointer"
          }`}
          disabled={currentSession?.done}
          onClick={handleOpenDialog}
        >
          Réserver une session 🤝
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
            <DialogTitle>
              Réserver {currentSession?.title}
            </DialogTitle>
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
            </div>

            {currentSession && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-left flex items-center gap-3">
                <Avatar
                  name={currentSession.formatter.name}
                  role={currentSession.formatter.role}
                  avatar={currentSession.formatter.image}
                />
                <div>
                  <p className="text-sm uppercase tracking-wide text-white/60">
                    Intervenant
                  </p>
                  <p className="mt-1 font-medium">
                    {currentSession.formatter.name} · {currentSession.formatter.role}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <p className="text-sm uppercase tracking-wide text-white/60">
                Choisis une date
              </p>
              <div className="grid gap-3 sm:grid-cols-4">
                {upcomingDays.map((day) => {
                  const isSelected = selectedDate?.toDateString() === day.toDateString();
                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => setSelectedDate(day)}
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
              className="bg-violet_fonce_1 hover:bg-violet"
              disabled={!selectedSlot || !selectedDate}
              onClick={handleConfirmReservation}
            >
              Valider ce créneau
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
