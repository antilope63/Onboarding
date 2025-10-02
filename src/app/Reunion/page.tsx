// app/followup/page.tsx
"use client";


import { useState, useRef, useEffect, useMemo } from "react";
import { prochainRdv, suivis } from "./data";
import { CalendarClock, Users, Briefcase } from "lucide-react";
import BackButton from "@/components/BackButton";
import FollowupCalendar from "@/components/FollowupCalendar";
import { useFormationSchedule } from "@/contexts/FormationScheduleContext";
import { sessions as formationSessions } from "@/app/formation/data";

export default function FollowupPage() {
  const [activeTab, setActiveTab] = useState<"liste" | "calendrier">("liste");
  // Récupère les réservations de formation afin de les afficher comme réunions
  const { scheduledSessions } = useFormationSchedule();

  // Associe l'id de session formation -> métadonnées (titre, formateur, ...)
  const idToFormation = useMemo(
    () => new Map(formationSessions.map((s) => [s.id, s])),
    []
  );

  // Convertit les réservations en éléments compatibles avec la liste `suivis`
  const suivisFromFormation = useMemo(
    () =>
      scheduledSessions.map((item) => {
        const meta = idToFormation.get(item.sessionId);
        const dateObj = new Date(item.date);

        return {
          id: `formation-${item.sessionId}`,
          titre: meta?.title ?? "Formation programmée",
          type: meta ? meta.formatter.name : "Formation",
          date: dateObj.toLocaleString("fr-FR", {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          statut: "Programmé" as const,
          couleur: "violet" as const,
        };
      }),
    [scheduledSessions, idToFormation]
  );

  // Fusionne les suivis statiques et ceux issus des réservations formation
  const allSuivis = useMemo(
    () => [...suivis, ...suivisFromFormation],
    [suivisFromFormation]
    
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { prochainRdv, suivis, type Suivi } from "./data";
import {
  CalendarClock,
  Users,
  Briefcase,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import FollowupCalendar from "@/components/FollowupCalendar";
import { useFormationSchedule } from "@/contexts/FormationScheduleContext";
import { useManagedSessions } from "@/hooks/useManagedSessions";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function FollowupPage() {
  const { scheduledSessions } = useFormationSchedule();
  const { sessions: sessionList } = useManagedSessions();
  const { role } = useAuth();
  const canManageMeetings = role === "manager" || role === "rh";

  const [meetings, setMeetings] = useState<Suivi[]>(suivis);
  const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false);
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [meetingForm, setMeetingForm] = useState({
    titre: "",
    type: "",
    date: "",
    statut: "Programmé" as Suivi["statut"],
    couleur: "violet" as Suivi["couleur"],
  });

  const manualIds = useMemo(
    () => new Set(meetings.map((meeting) => meeting.id)),
    [meetings]

  );

  const [activeTab, setActiveTab] = useState<"liste" | "calendrier">("liste");
  const listeRef = useRef<HTMLButtonElement>(null);
  const calendrierRef = useRef<HTMLButtonElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeRef = activeTab === "liste" ? listeRef : calendrierRef;
    if (activeRef.current) {
      const { offsetLeft, offsetWidth } = activeRef.current;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeTab]);

  const resetMeetingForm = () => {
    setMeetingForm({
      titre: "",
      type: "",
      date: "",
      statut: "Programmé",
      couleur: "violet",
    });
    setEditingMeetingId(null);
  };

  const openMeetingDialog = (meeting?: Suivi) => {
    if (meeting) {
      setMeetingForm({
        titre: meeting.titre,
        type: meeting.type,
        date: meeting.date,
        statut: meeting.statut,
        couleur: meeting.couleur,
      });
      setEditingMeetingId(meeting.id);
    } else {
      resetMeetingForm();
    }
    setIsMeetingDialogOpen(true);
  };

  const closeMeetingDialog = () => {
    setIsMeetingDialogOpen(false);
    resetMeetingForm();
  };

  const handleMeetingSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!meetingForm.titre.trim() || !meetingForm.date.trim()) {
      return;
    }

    setMeetings((previous) => {
      if (editingMeetingId) {
        return previous.map((meeting) =>
          meeting.id === editingMeetingId
            ? { id: editingMeetingId, ...meetingForm }
            : meeting
        );
      }

      const newId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `meeting-${Date.now()}`;

      return [...previous, { id: newId, ...meetingForm }];
    });

    closeMeetingDialog();
  };

  const handleMeetingDelete = (meeting: Suivi) => {
    if (!window.confirm(`Supprimer la réunion "${meeting.titre}" ?`)) {
      return;
    }
    setMeetings((previous) =>
      previous.filter((item) => item.id !== meeting.id)
    );
  };

  const scheduledSuivis = useMemo(() => {
    return scheduledSessions
      .map((item) => {
        const session = sessionList.find(
          (current) => current.id === item.sessionId
        );
        if (!session) return null;

        const plannedDate = new Date(item.date);
        if (Number.isNaN(plannedDate.getTime())) return null;

        const dateLabel = plannedDate.toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "2-digit",
          month: "long",
        });

        const suivi: Suivi = {
          id: `formation-${session.id}`,
          titre: session.title,
          type: session.subtitle,
          date: `${dateLabel} · ${item.slot}`,
          statut: "Programmé",
          couleur: "violet",
          startAt: item.date,
          endAt: new Date(plannedDate.getTime() + 60 * 60 * 1000).toISOString(),
        };
        return { order: plannedDate.getTime(), suivi };
      })
      .filter(
        (value): value is { order: number; suivi: Suivi } => value !== null
      )
      .sort((a, b) => a.order - b.order)
      .map((entry) => entry.suivi);
  }, [scheduledSessions, sessionList]);

  const allSuivis = useMemo(
    () => [...scheduledSuivis, ...meetings],
    [scheduledSuivis, meetings]
  );

  return (
    <main className="min-h-screen w-full bg-[#04061D] font-display text-gray-200 px-4 py-10 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl flex flex-col gap-10 pt-30 relative">
        <NavBar classname="absolute top-0 left-0" />

        <div>
          <h1 className="text-5xl font-bold tracking-tighter text-white">

            Bienvenue dans votre suivi
          </h1>
          <p className="mt-3 text-lg text-gray-400">
            Voici un aperçu de vos prochains rendez-vous.

            Bienvenue dans ton suivi !
          </h1>
          <p className="mt-3 text-lg text-gray-400">
            Voici un aperçu de tes prochains rendez-vous.
          </p>
        </div>

        <div className="rounded-xl border border-[#22254C] shadow-xl overflow-hidden bg-[#1D1E3B] min-h-[250px]">
          <div className="md:flex md:items-stretch">
            <div className="p-8 flex flex-col justify-between flex-1">
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-[#7D5AE0]">
                  {prochainRdv.date}
                </p>
                <p className="text-2xl font-bold text-white">
                  {prochainRdv.titre}
                </p>
                <p className="text-base text-gray-400">
                  {prochainRdv.type} - Préparez vos notes et objectifs pour
                  cette session.
                </p>
                <span className="inline-flex items-center rounded-full bg-green-100/20 text-green-300 px-4 py-1.5 text-sm font-medium w-fit">
                  {prochainRdv.statut}
                </span>
              </div>

              <div className="mt-8">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-300">

                    Temps avant ton prochain rendez-vous :

                  </p>
                  <p className="text-sm font-bold text-[#663BD6]">
                    {prochainRdv.tempsRestant}
                  </p>
                </div>
                <div className="w-full bg-[#22254C] rounded-full h-3">
                  <div
                    className="bg-[#663BD6] h-3 rounded-full"
                    style={{ width: `${prochainRdv.progression}%` }}
                  />
                </div>
              </div>
            </div>

            <div
              className="w-full md:w-1/3 bg-cover bg-center min-h-[250px]"
              style={{ backgroundImage: `url(${prochainRdv.image})` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-5 p-6 rounded-lg bg-[#1D1E3B] border border-[#22254C] shadow-lg">
          <div className="flex justify-between items-center">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Suivis à venir
            </h2>

            {/* Switch Liste | Calendrier */}
            <div className="relative flex bg-[#22254C] rounded-lg p-1">
              <div
                className="absolute top-1 bottom-1 bg-[#7D5AE0] rounded-md transition-all duration-500 ease-in-out"
                style={{
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                }}
              />
              <button
                ref={listeRef}
                onClick={() => setActiveTab("liste")}
                className={`relative z-10 px-6 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === "liste"
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Liste
              </button>
              <button
                ref={calendrierRef}
                onClick={() => setActiveTab("calendrier")}
                className={`relative z-10 px-6 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === "calendrier"
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Calendrier
              </button>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
              <div className="relative flex bg-[#22254C] rounded-lg p-1 self-start">
                <div
                  className="absolute top-1 bottom-1 bg-[#7D5AE0] rounded-md transition-all duration-500 ease-in-out"
                  style={{
                    left: indicatorStyle.left,
                    width: indicatorStyle.width,
                  }}
                />
                <button
                  ref={listeRef}
                  onClick={() => setActiveTab("liste")}
                  className={`relative z-10 px-6 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === "liste"
                      ? "text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Liste
                </button>
                <button
                  ref={calendrierRef}
                  onClick={() => setActiveTab("calendrier")}
                  className={`relative z-10 px-6 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === "calendrier"
                      ? "text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Calendrier
                </button>
              </div>

              {canManageMeetings && (
                <Button
                  type="button"
                  onClick={() => openMeetingDialog()}
                  className="inline-flex items-center gap-2 rounded-full bg-violet_fonce_1 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet"
                >
                  <Plus className="h-4 w-4" />
                  Programmer un suivi
                </Button>
              )}
            </div>
          </div>

          {activeTab === "liste" ? (
            <div className="flex flex-col gap-4">
              {allSuivis.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-5 rounded-lg bg-[#22254C] hover:bg-[#663BD6]/20 transition-colors cursor-pointer"
                >
                  className="relative flex items-center gap-4 p-5 rounded-lg bg-[#22254C] hover:bg-[#663BD6]/20 transition-colors"
                >
                  {canManageMeetings && manualIds.has(item.id) && (
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openMeetingDialog(item)}
                        className="flex items-center gap-1 rounded-full border border-white/25 bg-black/30 px-3 py-1 text-xs text-white/80 transition hover:bg-white/10"
                      >
                        <Edit className="h-4 w-4" />
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMeetingDelete(item)}
                        className="flex items-center gap-1 rounded-full border border-red-400/40 bg-red-900/40 px-3 py-1 text-xs text-red-200 transition hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </button>
                    </div>
                  )}
                  <div
                    className={`flex items-center justify-center rounded-lg shrink-0 w-12 h-12 ${
                      item.couleur === "vert"
                        ? "bg-green-500/20 text-green-400"
                        : item.couleur === "violet"
                        ? "bg-[#7D5AE0]/20 text-[#7D5AE0]"
                        : item.couleur === "orange"
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {item.couleur === "vert" ? (
                      <CalendarClock className="w-6 h-6" />
                    ) : item.couleur === "violet" ? (
                      <Briefcase className="w-6 h-6" />
                    ) : (
                      <Users className="w-6 h-6" />
                    )}
                  </div>

                  <div className="flex flex-col justify-center flex-1">
                    <p className="font-bold text-white">{item.titre}</p>
                    <p className="text-sm text-gray-400">{item.type}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-300">
                      {item.date}
                    </p>
                    <span
                      className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.couleur === "vert"
                          ? "bg-green-100/20 text-green-300"
                          : item.couleur === "violet"
                          ? "bg-[#7D5AE0]/20 text-[#7D5AE0]"
                          : item.couleur === "orange"
                          ? "bg-orange-100/20 text-orange-400"
                          : "bg-gray-600 text-gray-300"
                      }`}
                    >
                      {item.statut}
                    </span>
                  </div>
                </div>
              ))}

              {allSuivis.length === 0 && (
                <p className="text-center text-sm text-gray-400">
                  Aucun suivi planifié pour le moment.
                </p>
              )}
            </div>
          ) : (
            <div className="h-[650px]">
              <FollowupCalendar suivis={allSuivis} />
            </div>
          )}
        </div>
      </div>

      {canManageMeetings && (
        <Dialog
          open={isMeetingDialogOpen}
          onOpenChange={(open) => {
            if (!open) closeMeetingDialog();
          }}
        >
          <DialogContent className="max-w-lg border-white/10 bg-[#1D1E3B] text-white">
            <DialogHeader>
              <DialogTitle>
                {editingMeetingId
                  ? "Modifier une réunion"
                  : "Programmer une réunion"}
              </DialogTitle>
              <DialogDescription className="text-white/70">
                Planifie un suivi personnalisé pour accompagner l&apos;arrivée
                de ton talent.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleMeetingSubmit} className="space-y-4">
              <div className="grid gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                  Titre
                </label>
                <Input
                  value={meetingForm.titre}
                  onChange={(event) =>
                    setMeetingForm((prev) => ({
                      ...prev,
                      titre: event.target.value,
                    }))
                  }
                  placeholder="Point Manager"
                  className="border-white/20 bg-white/10 text-white"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                  Type
                </label>
                <Input
                  value={meetingForm.type}
                  onChange={(event) =>
                    setMeetingForm((prev) => ({
                      ...prev,
                      type: event.target.value,
                    }))
                  }
                  placeholder="RH, Manager, Projet..."
                  className="border-white/20 bg-white/10 text-white"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                  Date / heure
                </label>
                <Input
                  value={meetingForm.date}
                  onChange={(event) =>
                    setMeetingForm((prev) => ({
                      ...prev,
                      date: event.target.value,
                    }))
                  }
                  placeholder="Ex: 12/04 · 14h00"
                  className="border-white/20 bg-white/10 text-white"
                  required
                />
              </div>
              <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                    Statut
                  </label>
                  <select
                    value={meetingForm.statut}
                    onChange={(event) =>
                      setMeetingForm((prev) => ({
                        ...prev,
                        statut: event.target.value as Suivi["statut"],
                      }))
                    }
                    className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet_fonce_1"
                  >
                    <option value="Obligatoire">Obligatoire</option>
                    <option value="Optionnel">Optionnel</option>
                    <option value="Programmé">Programmé</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                    Couleur
                  </label>
                  <select
                    value={meetingForm.couleur}
                    onChange={(event) =>
                      setMeetingForm((prev) => ({
                        ...prev,
                        couleur: event.target.value as Suivi["couleur"],
                      }))
                    }
                    className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet_fonce_1"
                  >
                    <option value="vert">Vert</option>
                    <option value="violet">Violet</option>
                    <option value="orange">Orange</option>
                    <option value="gris">Gris</option>
                  </select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeMeetingDialog}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-violet_fonce_1 hover:bg-violet"
                >
                  {editingMeetingId ? "Enregistrer" : "Programmer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
