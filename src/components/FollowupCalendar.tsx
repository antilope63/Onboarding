// components/FollowupCalendar.tsx
"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import { useMemo, useState } from "react";
import { add, startOfDay } from "date-fns";
import { suivis } from "@/app/Followup/data";
import { EventClickArg } from "@fullcalendar/core"; // <--- CORRECT

export default function FollowupCalendar() {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  // Conversion des dates
  function convertDate(label: string): Date {
    const now = new Date();
    const parts = label.split(",").map((s) => s.trim());
    const descriptor = parts[0] ?? "";
    const timePart = parts[1] ?? "09:00";
    const [hour = "9", minute = "0"] = timePart.split(":");

    if (descriptor.toLowerCase().includes("demain")) {
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, Number(hour), Number(minute));
    }
    if (descriptor.toLowerCase().includes("la semaine prochaine")) {
      return add(startOfDay(now), { weeks: 1, hours: Number(hour), minutes: Number(minute) });
    }
    if (descriptor.toLowerCase().includes("dans 2 semaines")) {
      return add(startOfDay(now), { weeks: 2, hours: Number(hour), minutes: Number(minute) });
    }
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(hour), Number(minute));
  }

  const events = useMemo(
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
            item.couleur === "vert" ? "#22c55e" : item.couleur === "violet" ? "#7D5AE0" : "#f97316",
          borderColor: "transparent",
          textColor: "#ffffff",
          extendedProps: { type: item.type, statut: item.statut },
        };
      }),
    []
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
            <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-white">
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
              <span className="inline-block px-2 py-0.5 rounded text-xs" style={{ background: "#222" }}>
                {selectedEvent.statut}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
