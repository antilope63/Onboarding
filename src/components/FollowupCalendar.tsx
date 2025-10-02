// components/FollowupCalendar.tsx
"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import { useMemo, useState } from "react";
import { add, startOfDay } from "date-fns";
// Source de vérité des suivis statiques (renommé: Followup -> Reunion)
import { suivis } from "@/app/Reunion/data";
import { EventClickArg } from "@fullcalendar/core"; // <--- CORRECT
import { useFormationSchedule } from "@/contexts/FormationScheduleContext";
import { sessions as formationSessions } from "@/app/formation/data";

export default function FollowupCalendar() {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  // Lit les réservations de formation (persistées via le provider global)
  const { scheduledSessions } = useFormationSchedule();

  // Map sessionId -> métadonnées formation (titre, formateur, etc.)
  const idToFormation = useMemo(
    () => new Map(formationSessions.map((s) => [s.id, s])),
    []
  );

  // Conversion des dates
  function convertDate(label: string): Date {
    const now = new Date();
    const parts = label.split(",").map((s) => s.trim());
    const descriptor = parts[0] ?? "";
    const timePart = parts[1] ?? "09:00";
    const [hour = "9", minute = "0"] = timePart.split(":");

    if (descriptor.toLowerCase().includes("demain")) {
      return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        Number(hour),
        Number(minute)
      );
    }
    if (descriptor.toLowerCase().includes("la semaine prochaine")) {
      return add(startOfDay(now), {
        weeks: 1,
        hours: Number(hour),
        minutes: Number(minute),
      });
    }
    if (descriptor.toLowerCase().includes("dans 2 semaines")) {
      return add(startOfDay(now), {
        weeks: 2,
        hours: Number(hour),
        minutes: Number(minute),
      });
    }
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      Number(hour),
      Number(minute)
    );
  }

  // 1) Événements issus des suivis statiques (libellés en texte -> Date)
  const staticEvents = useMemo(
    () =>
      suivis.map((item) => {
        const start = convertDate(item.date);
        const end = add(start, { hours: 1 });
        return {
          id: item.id,
          title: item.titre,
          start,
          end,
          backgroundColor:
            item.couleur === "vert"
              ? "#22c55e"
              : item.couleur === "violet"
              ? "#7D5AE0"
              : "#f97316",
          borderColor: "transparent",
          textColor: "#ffffff",
          extendedProps: { type: item.type, statut: item.statut },
        };
      }),
    []
  );

  // 2) Événements issus des réservations de formation (dates ISO déjà fiables)
  const formationEvents = useMemo(
    () =>
      scheduledSessions.map((item) => {
        const meta = idToFormation.get(item.sessionId);
        const start = new Date(item.date);
        const end = add(start, { hours: 1 });
        return {
          id: `formation-${item.sessionId}`,
          title: meta?.title ?? "Formation programmée",
          start,
          end,
          backgroundColor: "#7D5AE0",
          borderColor: "transparent",
          textColor: "#ffffff",
          extendedProps: {
            type: meta ? `Avec ${meta.formatter.name}` : "Formation",
            statut: "Programmé",
          },
        };
      }),
    [scheduledSessions, idToFormation]
  );

  // 3) Fusion pour l'affichage du calendrier
  const events = useMemo(
    () => [...staticEvents, ...formationEvents],
    [staticEvents, formationEvents]
  );

  function handleEventClick(arg: EventClickArg) {
    setSelectedEvent({
      id: arg.event.id,
      title: arg.event.title,
      start: arg.event.start ?? undefined,
      end: arg.event.end ?? undefined,
      ...arg.event.extendedProps,
    });
  }

  return (
    <div className="bg-[#1D1E3B] p-4 rounded-xl border border-[#22254C] shadow-lg">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={frLocale}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        height="650px"
        eventDisplay="block"
        eventClick={handleEventClick}
        dayMaxEventRows={4}
      />

      {selectedEvent && (
        <div className="fixed right-6 bottom-6 z-50 w-80 bg-[#0b1020] border border-[#22254C] rounded-lg p-4 shadow-2xl text-white">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h3 className="text-lg font-bold">{selectedEvent.title}</h3>
              <p className="text-sm text-gray-300">{selectedEvent.type}</p>
            </div>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="mt-3 text-sm text-gray-300">
            <p>
              <strong>Début : </strong>
              {selectedEvent.start?.toLocaleString() ?? "N/A"}
            </p>
            <p>
              <strong>Fin : </strong>
              {selectedEvent.end?.toLocaleString() ?? "N/A"}
            </p>
            <p className="mt-2">
              <strong>Statut : </strong>
              <span
                className="inline-block px-2 py-0.5 rounded text-xs"
                style={{ background: "#222" }}
              >
                {selectedEvent.statut}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
