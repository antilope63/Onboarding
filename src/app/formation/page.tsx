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

const LOOP_MULTIPLIER = 7;
const BUFFER_CYCLES = 2;

export default function FormationPage() {
  const baseLength = sessions.length;
  const middleCycle = Math.floor(LOOP_MULTIPLIER / 2);
  const totalCards = baseLength * LOOP_MULTIPLIER;

  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cycleWidthRef = useRef(0);
  const isAdjustingRef = useRef(false);

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

  const centerCard = (loopIndex: number, behavior: ScrollBehavior = "smooth") => {
    const slider = sliderRef.current;
    const card = cardsRef.current[loopIndex];
    if (!slider || !card) return;

    const target = card.offsetLeft - slider.clientWidth / 2 + card.clientWidth / 2;
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

      const target = card.offsetLeft - slider.clientWidth / 2 + card.clientWidth / 2;
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

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, loopIndex: number) => {
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

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center gap-16 overflow-hidden bg-noir py-20">
      <NavBar classname="absolute top-0 left-0" />
      <NoScroll />

      <div className="flex flex-col items-center gap-4 text-center text-white">
        <h1 className="text-4xl font-semibold">Carrousel de tests</h1>
        <p className="text-white/70">
          Clique sur une carte pour la placer au centre. Utilise la molette verticale pour défiler.
        </p>
      </div>

      <div className="w-full">
        <div
          ref={sliderRef}
          className="no-scrollbar flex gap-6 overflow-x-auto overflow-y-hidden px-12 pb-6 pt-2 text-white scroll-smooth snap-x snap-mandatory"
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
                  image={session.image}
                  isActive={isActive}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-white/40">Carte active</p>
        <p className="text-2xl font-semibold">{sessions[currentIndex]?.title}</p>
        <p className="text-white/70">{sessions[currentIndex]?.subtitle}</p>
      </div>

      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
    </section>
  );
}
