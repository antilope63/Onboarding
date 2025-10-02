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

import type { ScheduledSession } from "@/types/formation";
import {
  clearScheduledSessions,
  deleteScheduledSession,
  listScheduledSessions,
  upsertScheduledSession,
} from "@/lib/supabase/services/formation";

type FormationScheduleContextValue = {
  scheduledSessions: ScheduledSession[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  scheduleSession: (sessionId: string, slot: string, date: string) => Promise<void>;
  cancelSession: (sessionId: string) => Promise<void>;
  clearAll: () => Promise<void>;
};

const FormationScheduleContext =
  createContext<FormationScheduleContextValue | null>(null);

function sortSessions(values: ScheduledSession[]): ScheduledSession[] {
  return [...values].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function FormationScheduleProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [scheduledSessions, setScheduledSessions] = useState<
    ScheduledSession[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await listScheduledSessions();
      setScheduledSessions(sortSessions(data));
      setError(null);
    } catch (err) {
      console.error("FormationSchedule: fetch failed", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const scheduleSession = useCallback(
    async (sessionId: string, slot: string, date: string) => {
      const saved = await upsertScheduledSession({ sessionId, slot, date });
      setScheduledSessions((previous) =>
        sortSessions([
          ...previous.filter((session) => session.sessionId !== saved.sessionId),
          saved,
        ])
      );
    },
    []
  );

  const cancelSession = useCallback(async (sessionId: string) => {
    await deleteScheduledSession(sessionId);
    setScheduledSessions((previous) =>
      previous.filter((session) => session.sessionId !== sessionId)
    );
  }, []);

  const clearAll = useCallback(async () => {
    await clearScheduledSessions();
    setScheduledSessions([]);
  }, []);

  const value = useMemo(
    () => ({
      scheduledSessions,
      isLoading,
      error,
      refresh,
      scheduleSession,
      cancelSession,
      clearAll,
    }),
    [
      scheduledSessions,
      isLoading,
      error,
      refresh,
      scheduleSession,
      cancelSession,
      clearAll,
    ]
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
