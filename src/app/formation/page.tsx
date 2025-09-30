"use client";

import NavBar from "@/components/NavBar";
import SessionCard from "@/components/Formation/SessionCard";
import { sessions } from "./data";
import NoScroll from "@/components/NoScroll";
import { useRef, useState, type KeyboardEvent, type WheelEventHandler } from "react";

export default function FormationPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Pas d'auto-défilement vertical
  const handleWheel: WheelEventHandler<HTMLDivElement> = (event) => {
    const slider = sliderRef.current;
    if (!slider) return;

    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

    event.preventDefault();
    slider.scrollBy({ left: event.deltaY, behavior: "smooth" });
  };

  const centerCard = (index: number) => {
    const slider = sliderRef.current;
    const card = cardsRef.current[index];
    if (!slider || !card) return;

    const target = card.offsetLeft - slider.clientWidth / 2 + card.clientWidth / 2;
    slider.scrollTo({ left: target, behavior: "smooth" });
  };

  const activateCard = (index: number) => {
    setCurrentIndex(index);
    centerCard(index);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activateCard(index);
    }
  };

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

      <div className="w-full max-w-[1100px]">
        <div
          ref={sliderRef}
          className="no-scrollbar flex gap-6 overflow-x-auto overflow-y-hidden px-6 pb-6 pt-2 text-white scroll-smooth snap-x snap-mandatory"
          onWheel={handleWheel}
        >
          {sessions.map((session, idx) => {
            const isActive = idx === currentIndex;

            return (
              <div
                key={session.id}
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
