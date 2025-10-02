"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import {
  sessions as baseSessions,
  type FormationSession,
} from "@/app/formation/data"

const STORAGE_KEY = "pixelplay:formation-sessions"

type SessionPayload = Omit<FormationSession, "id"> & { id?: string }

type UpdatePayload = Partial<FormationSession>

function cloneSession(session: FormationSession): FormationSession {
  return {
    ...session,
    formatter: { ...session.formatter },
  }
}

function parseStoredSessions(value: unknown): FormationSession[] {
  if (!Array.isArray(value)) return []
  const sessions: FormationSession[] = []
  value.forEach((item) => {
    if (!item || typeof item !== "object") return
    const candidate = item as Partial<FormationSession> & {
      formatter?: Partial<FormationSession["formatter"]>
    }
    if (typeof candidate.id !== "string") return
    if (typeof candidate.title !== "string") return
    if (typeof candidate.subtitle !== "string") return
    if (typeof candidate.description !== "string") return
    if (typeof candidate.image !== "string") return
    if (!candidate.formatter || typeof candidate.formatter !== "object") return
    if (typeof candidate.formatter.name !== "string") return
    if (typeof candidate.formatter.role !== "string") return
    if (typeof candidate.formatter.image !== "string") return
    sessions.push(
      cloneSession({
        id: candidate.id,
        title: candidate.title,
        subtitle: candidate.subtitle,
        description: candidate.description,
        image: candidate.image,
        formatter: {
          name: candidate.formatter.name,
          role: candidate.formatter.role,
          image: candidate.formatter.image,
        },
        done: Boolean(candidate.done),
      })
    )
  })
  return sessions
}

export function useManagedSessions() {
  const [sessionList, setSessionList] = useState<FormationSession[]>(() =>
    baseSessions.map(cloneSession)
  )

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as unknown
      const stored = parseStoredSessions(parsed)
      if (stored.length) {
        setSessionList(stored)
      }
    } catch (error) {
      console.warn("Impossible de charger les formations gérées", error)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionList))
    } catch (error) {
      console.warn("Impossible d'enregistrer les formations gérées", error)
    }
  }, [sessionList])

  const sessions = useMemo(() => sessionList.map(cloneSession), [sessionList])

  const addSession = useCallback((payload: SessionPayload) => {
    const id =
      payload.id && payload.id.trim().length > 0
        ? payload.id
        : typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `session-${Date.now()}`

    setSessionList((previous) => [
      ...previous,
      cloneSession({
        id,
        title: payload.title,
        subtitle: payload.subtitle,
        description: payload.description,
        image: payload.image,
        formatter: { ...payload.formatter },
        done: payload.done,
      }),
    ])
  }, [])

  const updateSession = useCallback((id: string, updates: UpdatePayload) => {
    setSessionList((previous) =>
      previous.map((session) => {
        if (session.id !== id) return session
        return cloneSession({
          ...session,
          ...updates,
          formatter: {
            ...session.formatter,
            ...(updates.formatter ?? {}),
          },
        })
      })
    )
  }, [])

  const removeSession = useCallback((id: string) => {
    setSessionList((previous) => previous.filter((session) => session.id !== id))
  }, [])

  return { sessions, addSession, updateSession, removeSession }
}
