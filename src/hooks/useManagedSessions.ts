"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { FormationSession } from "@/types/formation";
import {
  createFormationSession,
  deleteFormationSession,
  listFormationSessions,
  type FormationSessionPayload,
  type FormationSessionUpdatePayload,
  updateFormationSession,
} from "@/lib/supabase/services/formation";

export type SessionPayload = FormationSessionPayload;
export type UpdatePayload = FormationSessionUpdatePayload;

function sortSessions(values: FormationSession[]): FormationSession[] {
  return [...values].sort((a, b) => a.title.localeCompare(b.title));
}

export function useManagedSessions() {
  const [sessionList, setSessionList] = useState<FormationSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await listFormationSessions();
      setSessionList(sortSessions(data));
      setError(null);
    } catch (err) {
      console.error("useManagedSessions: fetch failed", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const sessions = useMemo(() => sortSessions(sessionList), [sessionList]);

  const addSession = useCallback(async (payload: SessionPayload) => {
    const created = await createFormationSession(payload);
    setSessionList((previous) => sortSessions([...previous, created]));
    return created;
  }, []);

  const updateSession = useCallback(
    async (id: string, updates: UpdatePayload) => {
      const updated = await updateFormationSession(id, updates);
      setSessionList((previous) =>
        sortSessions(previous.map((session) => (session.id === id ? updated : session)))
      );
      return updated;
    },
    []
  );

  const removeSession = useCallback(async (id: string) => {
    await deleteFormationSession(id);
    setSessionList((previous) => previous.filter((session) => session.id !== id));
  }, []);

  return {
    sessions,
    isLoading,
    error,
    refresh,
    addSession,
    updateSession,
    removeSession,
  };
}
