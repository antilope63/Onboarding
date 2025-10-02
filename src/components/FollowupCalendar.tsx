// components/FollowupCalendar.tsx
"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import { useMemo, useState } from "react";
import { add, startOfDay } from "date-fns";
import { EventClickArg } from "@fullcalendar/core";
import type { FollowupMeeting } from "@/types/followup";

function convertDate(label: string): Date {
  const now = new Date();
  const commaParts = label
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
    let descriptor = commaParts[0] ?? label;
    let timePart = commaParts[1];

    if (!timePart && descriptor.includes("·")) {
      const dotParts = descriptor
        .split("·")
        .map((value) => value.trim())
        .filter(Boolean);
      descriptor = dotParts[0] ?? descriptor;
      timePart = dotParts[1];
    }

    const normalizedTime = (timePart ?? "09:00")
      .replace(/h/i, ":")
      .replace(/\s+/g, "");
    const [hourSource = "9", minuteSource = "0"] = normalizedTime
      .split(":")
      .map((value) => value.trim())
      .filter(Boolean);
    const hour = Number.parseInt(hourSource, 10);
    const minute = Number.parseInt(minuteSource, 10);

    const descriptorLower = descriptor.toLowerCase();

    if (descriptorLower.includes("demain")) {
      return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        Number.isNaN(hour) ? 9 : hour,
        Number.isNaN(minute) ? 0 : minute
      );
    }
    if (descriptorLower.includes("la semaine prochaine")) {
      return add(startOfDay(now), {
        weeks: 1,
        hours: Number.isNaN(hour) ? 9 : hour,
        minutes: Number.isNaN(minute) ? 0 : minute,
      });
    }
    if (descriptorLower.includes("dans 2 semaines")) {
      return add(startOfDay(now), {
        weeks: 2,
        hours: Number.isNaN(hour) ? 9 : hour,
        minutes: Number.isNaN(minute) ? 0 : minute,
      });
    }

    const dateMatch = descriptor.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
    if (dateMatch) {
      const [, dayStr, monthStr, yearStr] = dateMatch;
      const day = Number.parseInt(dayStr ?? "1", 10);
      const month = Number.parseInt(monthStr ?? "1", 10) - 1;
      const yearBase = yearStr ? Number.parseInt(yearStr, 10) : now.getFullYear();
      const year = yearStr && yearBase < 100 ? yearBase + 2000 : yearBase;
      return new Date(
        Number.isNaN(year) ? now.getFullYear() : year,
        Number.isNaN(month) ? now.getMonth() : month,
        Number.isNaN(day) ? now.getDate() : day,
        Number.isNaN(hour) ? 9 : hour,
        Number.isNaN(minute) ? 0 : minute
      );
    }

    const parsedDescriptor = new Date(descriptor);
    if (!Number.isNaN(parsedDescriptor.getTime())) {
      parsedDescriptor.setHours(
        Number.isNaN(hour) ? 9 : hour,
        Number.isNaN(minute) ? 0 : minute,
        0,
        0
      );
      return parsedDescriptor;
    }

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    Number.isNaN(hour) ? 9 : hour,
    Number.isNaN(minute) ? 0 : minute
  );
}

function resolveStartDate(entry: FollowupMeeting): Date {
  if (entry.startAt) {
    const parsed = new Date(entry.startAt);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return convertDate(entry.date);
}

function resolveEndDate(entry: FollowupMeeting, fallbackStart: Date): Date {
  if (entry.endAt) {
    const parsed = new Date(entry.endAt);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return add(fallbackStart, { hours: 1 });
}

type FollowupCalendarProps = {
  suivis: FollowupMeeting[];
};

type CalendarEventDetails = {
  id: string;
  title: string;
  start?: Date;
  end?: Date;
  type?: string;
  statut?: FollowupMeeting["statut"];
};

export default function FollowupCalendar({ suivis }: FollowupCalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventDetails | null>(
    null
  );

  const events = useMemo(
    () =>
      suivis.map((item) => {
        const start = resolveStartDate(item);
        const end = resolveEndDate(item, start);
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
    [suivis]
  );

  function handleEventClick(arg: EventClickArg) {
    const { type, statut } = arg.event.extendedProps as {
      type?: string;
      statut?: FollowupMeeting["statut"];
    };

    setSelectedEvent({
      id: arg.event.id,
      title: arg.event.title ?? "",
      start: arg.event.start ?? undefined,
      end: arg.event.end ?? undefined,
      type,
      statut,
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
