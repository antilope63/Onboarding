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
  updatedAt: number;
};

type FormationScheduleContextValue = {
  scheduledSessions: ScheduledSession[];
  scheduleSession: (sessionId: string, slot: string) => void;
  cancelSession: (sessionId: string) => void;
};

const FormationScheduleContext = createContext<FormationScheduleContextValue | null>(
  null
);

const STORAGE_KEY = "formation-schedule";

export function FormationScheduleProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [scheduledSessions, setScheduledSessions] = useState<ScheduledSession[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      const safeSessions = parsed
        .filter((item: unknown): item is ScheduledSession => {
          if (!item || typeof item !== "object") return false;
          const candidate = item as Partial<ScheduledSession>;
          return (
            typeof candidate.sessionId === "string" &&
            typeof candidate.slot === "string" &&
            typeof candidate.updatedAt === "number"
          );
        })
        .sort((a, b) => b.updatedAt - a.updatedAt);

      setScheduledSessions(safeSessions);
    } catch (error) {
      console.warn("Impossible de charger les sessions programmées", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(scheduledSessions));
  }, [scheduledSessions]);

  const scheduleSession = useCallback((sessionId: string, slot: string) => {
    setScheduledSessions((previous) => {
      const next = previous.slice();
      const index = next.findIndex((item) => item.sessionId === sessionId);
      const payload: ScheduledSession = {
        sessionId,
        slot,
        updatedAt: Date.now(),
      };

      if (index >= 0) {
        next[index] = payload;
        return next
          .slice()
          .sort((a, b) => b.updatedAt - a.updatedAt);
      }

      return [payload, ...next];
    });
  }, []);

  const cancelSession = useCallback((sessionId: string) => {
    setScheduledSessions((previous) =>
      previous.filter((item) => item.sessionId !== sessionId)
    );
  }, []);

  const value = useMemo(
    () => ({ scheduledSessions, scheduleSession, cancelSession }),
    [scheduledSessions, scheduleSession, cancelSession]
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
