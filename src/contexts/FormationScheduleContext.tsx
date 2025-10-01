"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ScheduledSession = {
  sessionId: string;
  slot: string;
  date: string;
  updatedAt: number;
};

type FormationScheduleContextValue = {
  scheduledSessions: ScheduledSession[];
  scheduleSession: (sessionId: string, slot: string, date: string) => void;
  cancelSession: (sessionId: string) => void;
  clearAll: () => void;
};

const FormationScheduleContext =
  createContext<FormationScheduleContextValue | null>(null);

const STORAGE_KEY = "formation-schedule";
const STORAGE_MODE =
  process.env.NEXT_PUBLIC_FORMATION_STORAGE === "session" ? "session" : "local";

export function FormationScheduleProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [scheduledSessions, setScheduledSessions] = useState<
    ScheduledSession[]
  >([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const storage =
        STORAGE_MODE === "session"
          ? window.sessionStorage
          : window.localStorage;
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      const safeSessions = parsed
        .map((item: unknown): ScheduledSession | null => {
          if (!item || typeof item !== "object") return null;
          const candidate = item as Partial<ScheduledSession> & {
            date?: unknown;
          };
          if (
            typeof candidate.sessionId !== "string" ||
            typeof candidate.slot !== "string"
          ) {
            return null;
          }

          const dateValue =
            typeof candidate.date === "string"
              ? candidate.date
              : new Date().toISOString();
          const parsedDate = new Date(dateValue);
          if (Number.isNaN(parsedDate.getTime())) {
            return null;
          }

          return {
            sessionId: candidate.sessionId,
            slot: candidate.slot,
            date: parsedDate.toISOString(),
            updatedAt:
              typeof candidate.updatedAt === "number"
                ? candidate.updatedAt
                : parsedDate.getTime(),
          };
        })
        .filter((value): value is ScheduledSession => value !== null)
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

      // Purge automatique des programmations passées (avant aujourd'hui)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const upcoming = safeSessions.filter(
        (s) => new Date(s.date).getTime() >= today.getTime()
      );

      setScheduledSessions(upcoming);
    } catch (error) {
      console.warn("Impossible de charger les sessions programmées", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storage =
      STORAGE_MODE === "session" ? window.sessionStorage : window.localStorage;
    storage.setItem(STORAGE_KEY, JSON.stringify(scheduledSessions));
  }, [scheduledSessions]);

  const scheduleSession = useCallback(
    (sessionId: string, slot: string, date: string) => {
      const safeDate = new Date(date);
      if (Number.isNaN(safeDate.getTime())) {
        return;
      }

      setScheduledSessions((previous) => {
        const next = previous.filter((item) => item.sessionId !== sessionId);
        const payload: ScheduledSession = {
          sessionId,
          slot,
          date: safeDate.toISOString(),
          updatedAt: Date.now(),
        };

        return [...next, payload].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      });
    },
    []
  );

  const cancelSession = useCallback((sessionId: string) => {
    setScheduledSessions((previous) =>
      previous.filter((item) => item.sessionId !== sessionId)
    );
  }, []);

  const clearAll = useCallback(() => {
    setScheduledSessions([]);
  }, []);

  const value = useMemo(
    () => ({ scheduledSessions, scheduleSession, cancelSession, clearAll }),
    [scheduledSessions, scheduleSession, cancelSession, clearAll]
  );

  return (
    <FormationScheduleContext.Provider value={value}>
      {children}
    </FormationScheduleContext.Provider>
  );
}

export function useFormationSchedule() {
  const context = useContext(FormationScheduleContext);
  if (!context) {
    throw new Error(
      "useFormationSchedule doit être utilisé dans un FormationScheduleProvider"
    );
  }
  return context;
}
