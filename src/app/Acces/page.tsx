"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Check, Clock, X, Send, Copy, Edit, Trash2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

export default function AccessDashboard() {
  const [activeTab, setActiveTab] = useState<"mesAcces" | "mesDemandes">(
    "mesAcces"
  );
  const accesRef = useRef<HTMLButtonElement>(null);
  const demandesRef = useRef<HTMLButtonElement>(null);

  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
  }>({
    left: 0,
    width: 0,
  });
  type AccessEntry = {
    id: number;
    outil: string;
    type: string;
    statut: string;
    login: string;
    password: string;
  };

  const [accessEntries, setAccessEntries] = useState<AccessEntry[]>([
    {
      id: 1,
      outil: "Outil de conception 3D",
      type: "Accès complet",
      statut: "Actif",
      login: "user1",
      password: "pass1",
    },
    {
      id: 2,
      outil: "Plateforme de test",
      type: "Accès en lecture seule",
      statut: "Actif",
      login: "user2",
      password: "pass2",
    },
    {
      id: 3,
      outil: "Outil d'analyse de données",
      type: "Accès complet",
      statut: "En attente",
      login: "user3",
      password: "pass3",
    },
    {
      id: 4,
      outil: "Système de gestion de projet",
      type: "Accès limité",
      statut: "Actif",
      login: "user4",
      password: "pass4",
    },
    {
      id: 5,
      outil: "Outil de communication interne",
      type: "Accès complet",
      statut: "Actif",
      login: "user5",
      password: "pass5",
    },
  ]);

  const countStatut = (statut: string) =>
    accessEntries.filter((a) => a.statut === statut).length;

  // Historique des demandes (onglet "Mes Demandes")
  type AccessRequest = {
    id: number;
    outil: string;
    type: string;
    statut: "Acceptée" | "En attente" | "Rejetée";
    date: string; // JJ/MM/AAAA
  };

  const [requests, setRequests] = useState<AccessRequest[]>([
    {
      id: 1,
      outil: "Game Engine X",
      type: "Lecture",
      statut: "Acceptée",
      date: "15/01/2024",
    },
    {
      id: 2,
      outil: "Analytics Dashboard",
      type: "Écriture",
      statut: "En attente",
      date: "20/02/2024",
    },
    {
      id: 3,
      outil: "Community Forum",
      type: "Admin",
      statut: "Rejetée",
      date: "05/03/2024",
    },
  ]);

  const { role } = useAuth();
  const canManageAccess = role === "manager" || role === "rh";
  const canAcceptRequests = role === "manager";

  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false);
  const [editingAccessId, setEditingAccessId] = useState<number | null>(null);
  const [accessForm, setAccessForm] = useState<Omit<AccessEntry, "id">>(
    () => ({
      outil: "",
      type: "Accès complet",
      statut: "Actif",
      login: "",
      password: "",
    })
  );

  // Etat du formulaire de demande
  const [formTool, setFormTool] = useState("Game Engine X");
  const [formType, setFormType] = useState("Lecture");
  const [formJustification, setFormJustification] = useState("");

  const handleSubmitRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newRequest: AccessRequest = {
      id: requests.length ? Math.max(...requests.map((r) => r.id)) + 1 : 1,
      outil: formTool,
      type: formType,
      statut: "En attente",
      date: new Date().toLocaleDateString("fr-FR"),
    };
    setRequests((prev) => [...prev, newRequest]);
    toast.success("Demande envoyée avec succès");
    setFormJustification("");
  };

  const openAccessDialog = (entry?: AccessEntry) => {
    if (entry) {
      const { id, ...rest } = entry;
      setAccessForm(rest);
      setEditingAccessId(id);
    } else {
      setAccessForm({
        outil: "",
        type: "Accès complet",
        statut: "Actif",
        login: "",
        password: "",
      });
      setEditingAccessId(null);
    }
    setIsAccessDialogOpen(true);
  };

  const handleAccessFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessForm.outil.trim() || !accessForm.login.trim()) {
      toast.error("Complétez au moins l'outil et l'identifiant");
      return;
    }

    setAccessEntries((prev) => {
      if (editingAccessId !== null) {
        return prev.map((entry) =>
          entry.id === editingAccessId ? { ...entry, ...accessForm } : entry
        );
      }

      const nextId = prev.length
        ? Math.max(...prev.map((entry) => entry.id)) + 1
        : 1;

      return [...prev, { id: nextId, ...accessForm }];
    });

    toast.success(
      editingAccessId ? "Accès mis à jour" : "Accès ajouté avec succès"
    );
    setIsAccessDialogOpen(false);
    setEditingAccessId(null);
  };

  const handleDeleteAccess = (id: number) => {
    const entry = accessEntries.find((item) => item.id === id);
    if (!entry) return;

    const confirmed = window.confirm(
      `Supprimer l'accès pour "${entry.outil}" (${entry.login}) ?`
    );
    if (!confirmed) return;

    setAccessEntries((prev) => prev.filter((item) => item.id !== id));
    toast.success("Accès supprimé");
  };

  const handleAcceptRequest = (id: number) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, statut: "Acceptée" } : request
      )
    );
    toast.success("Demande acceptée");
  };

  const closeAccessDialog = () => {
    setIsAccessDialogOpen(false);
    setEditingAccessId(null);
  };

  useEffect(() => {
    const updateIndicator = () => {
      const target =
        activeTab === "mesAcces" ? accesRef.current : demandesRef.current;
      if (target) {
        setIndicatorStyle({
          left: target.offsetLeft,
          width: target.offsetWidth,
        });
      }
    };
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab]);

  const copyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
    toast.success("Mot de passe copié avec succès");
  };

  return (
    <main className="min-h-screen bg-[#04061D] text-white font-display p-8">
      <NavBar classname="absolute top-0 left-0" />
      <Toaster position="bottom-right" />
      <div className="max-w-7xl mx-auto mt-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Vos accès et vos demandes d&apos;accès
          </h1>
          <p className="text-gray-300">
            Contrôlez vos accès et suivez vos demandes facilement
          </p>
        </div>

        {/* Switch */}
        <div className="flex justify-center mb-8">
          <div className="relative flex bg-[#1D1E3B] rounded-lg p-1">
            <div
              className="absolute top-1 bottom-1 bg-[#7D5AE0] rounded-md transition-all duration-500 ease-in-out"
              style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
            />
            <button
              ref={accesRef}
              onClick={() => setActiveTab("mesAcces")}
              className={`relative z-10 px-6 py-2 text-sm font-medium rounded-md transition-all duration-500 ${
                activeTab === "mesAcces"
                  ? "text-white"
                  : "text-gray-300 hover:text-white cursor-pointer"
              }`}
            >
              Mes Accès
            </button>
            <button
              ref={demandesRef}
              onClick={() => setActiveTab("mesDemandes")}
              className={`relative z-10 px-6 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                activeTab === "mesDemandes"
                  ? "text-white"
                  : "text-gray-300 hover:text-white cursor-pointer"
              }`}
            >
              Mes demandes d&apos;accès
            </button>
          </div>
        </div>

        {/* Mes Accès */}
        {activeTab === "mesAcces" && (
          <>
            {/* Cartes Statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="p-6 rounded-xl bg-[#1D1E3B] border border-[#22254C]">
                <p className="text-gray-400 text-sm">Accès actifs</p>
                <p className="text-3xl font-bold text-green-500">
                  {countStatut("Actif")}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-[#1D1E3B] border border-[#22254C]">
                <p className="text-gray-400 text-sm">Demandes en attente</p>
                <p className="text-3xl font-bold text-yellow-500">
                  {countStatut("En attente")}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-[#1D1E3B] border border-[#22254C]">
                <p className="text-gray-400 text-sm">Accès refusés</p>
                <p className="text-3xl font-bold text-red-500">
                  {countStatut("Rejeté")}
                </p>
              </div>
            </div>

            {canManageAccess && (
              <div className="flex justify-end mb-6">
                <Button
                  type="button"
                  onClick={() => openAccessDialog()}
                  className="rounded-full bg-violet_fonce_1 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet"
                >
                  Ajouter un accès
                </Button>
              </div>
            )}

            <div className="rounded-xl border border-[#22254C] bg-[#1D1E3B] p-6 overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-[#22254C]">
                  <tr>
                    <th className="px-6 py-3 text-sm font-medium text-gray-400">
                      Outil
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-400">
                      Type de droit
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-400">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-400">
                      Identifiant
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-400">
                      Mot de passe
                    </th>
                    {canManageAccess && (
                      <th className="px-6 py-3 text-sm font-medium text-gray-400">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#22254C]">
                  {accessEntries.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4">{item.outil}</td>
                      <td className="px-6 py-4">{item.type}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                            item.statut === "Actif"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                              : item.statut === "En attente"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                          }`}
                        >
                          {item.statut === "Actif" && (
                            <Check className="w-4 h-4" />
                          )}
                          {item.statut === "En attente" && (
                            <Clock className="w-4 h-4" />
                          )}
                          {item.statut === "Rejeté" && (
                            <X className="w-4 h-4" />
                          )}
                          {item.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4">{item.login}</td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <span className="select-none">••••••</span>
                        <button
                          className="p-1 bg-[#22254C]/50 rounded hover:bg-[#333558] transition cursor-pointer"
                          onClick={() => copyPassword(item.password)}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </td>
                      {canManageAccess && (
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              className="flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 transition hover:bg-white/10"
                              onClick={() => openAccessDialog(item)}
                            >
                              <Edit className="w-4 h-4" />
                              Modifier
                            </button>
                            <button
                              className="flex items-center gap-2 rounded-full border border-red-400/50 px-3 py-1 text-xs text-red-200 transition hover:bg-red-500/20"
                              onClick={() => handleDeleteAccess(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                              Supprimer
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Mes Demandes */}
        {activeTab === "mesDemandes" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-[#1D1E3B] p-6 rounded-xl border border-[#22254C] shadow-lg overflow-x-auto">
              <h3 className="text-xl font-semibold mb-6">
                Historique des demandes
              </h3>
              <table className="min-w-full text-left">
                <thead className="border-b border-[#22254C]">
                  <tr>
                    <th className="px-6 py-3 text-sm text-gray-400">
                      Outil/Plateforme
                    </th>
                    <th className="px-6 py-3 text-sm text-gray-400">Type</th>
                    <th className="px-6 py-3 text-sm text-gray-400">Statut</th>
                    <th className="px-6 py-3 text-sm text-gray-400">
                      Demandé le
                    </th>
                    {canAcceptRequests && (
                      <th className="px-6 py-3 text-sm text-gray-400">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#22254C]">
                  {requests.map((req) => (
                    <tr key={req.id}>
                      <td className="px-6 py-4">{req.outil}</td>
                      <td className="px-6 py-4">{req.type}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                            req.statut === "Acceptée"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                              : req.statut === "En attente"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                          }`}
                        >
                          {req.statut === "Acceptée" && (
                            <Check className="w-4 h-4" />
                          )}
                          {req.statut === "En attente" && (
                            <Clock className="w-4 h-4" />
                          )}
                          {req.statut === "Rejetée" && (
                            <X className="w-4 h-4" />
                          )}
                          {req.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{req.date}</td>
                      {canAcceptRequests && (
                        <td className="px-6 py-4">
                          {req.statut === "En attente" ? (
                            <button
                              className="flex items-center gap-2 rounded-full border border-green-400/50 px-3 py-1 text-xs text-green-200 transition hover:bg-green-500/20"
                              onClick={() => handleAcceptRequest(req.id)}
                            >
                              <Check className="w-4 h-4" />
                              Accepter
                            </button>
                          ) : (
                            <span className="text-xs text-gray-500">
                              Gestion terminée
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:col-span-2 bg-[#1D1E3B] p-6 rounded-xl border border-[#22254C] shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1.5 bg-[#7D5AE0] glow-border"></div>
              <h3 className="text-xl font-semibold mb-6">
                Nouvelle demande d&apos;accès
              </h3>
              <form className="space-y-6" onSubmit={handleSubmitRequest}>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Outil/Plateforme
                  </label>
                  <select
                    className="form-select w-full rounded-lg bg-[#22254C]/50 border border-[#22254C] p-2 text-white"
                    value={formTool}
                    onChange={(e) => setFormTool(e.target.value)}
                  >
                    <option value="Game Engine X">Game Engine X</option>
                    <option value="Analytics Dashboard">
                      Analytics Dashboard
                    </option>
                    <option value="Community Forum">Community Forum</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Type d&apos;accès
                  </label>
                  <select
                    className="form-select w-full rounded-lg bg-[#22254C]/50 border border-[#22254C] p-2 text-white"
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Écriture">Écriture</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Justification
                  </label>
                  <textarea
                    className="w-full rounded-lg bg-[#22254C]/50 border border-[#22254C] p-2 text-white"
                    rows={4}
                    value={formJustification}
                    onChange={(e) => setFormJustification(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-[#7D5AE0] px-4 py-2 rounded-lg hover:bg-[#663BD6] transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> Envoyer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={isAccessDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeAccessDialog();
        }}
      >
        <DialogContent className="bg-[#1D1E3B] text-white border-[#22254C]">
          <DialogHeader>
            <DialogTitle>
              {editingAccessId ? "Modifier l'accès" : "Nouvel accès"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAccessFormSubmit} className="space-y-4">
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                Outil / Plateforme
              </label>
              <Input
                value={accessForm.outil}
                onChange={(event) =>
                  setAccessForm((prev) => ({
                    ...prev,
                    outil: event.target.value,
                  }))
                }
                placeholder="Nom de l'outil"
                className="border-white/20 bg-white/5 text-white"
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                Type de droit
              </label>
              <select
                value={accessForm.type}
                onChange={(event) =>
                  setAccessForm((prev) => ({
                    ...prev,
                    type: event.target.value,
                  }))
                }
                className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet_fonce_1"
              >
                <option value="Accès complet">Accès complet</option>
                <option value="Accès en lecture seule">
                  Accès en lecture seule
                </option>
                <option value="Accès limité">Accès limité</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                Statut
              </label>
              <select
                value={accessForm.statut}
                onChange={(event) =>
                  setAccessForm((prev) => ({
                    ...prev,
                    statut: event.target.value,
                  }))
                }
                className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet_fonce_1"
              >
                <option value="Actif">Actif</option>
                <option value="En attente">En attente</option>
                <option value="Rejeté">Rejeté</option>
              </select>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
              <div className="grid gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                  Identifiant
                </label>
                <Input
                  value={accessForm.login}
                  onChange={(event) =>
                    setAccessForm((prev) => ({
                      ...prev,
                      login: event.target.value,
                    }))
                  }
                  placeholder="Identifiant"
                  className="border-white/20 bg-white/5 text-white"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                  Mot de passe
                </label>
                <Input
                  value={accessForm.password}
                  onChange={(event) =>
                    setAccessForm((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  placeholder="Mot de passe"
                  className="border-white/20 bg-white/5 text-white"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeAccessDialog}
                className="border-white/30 text-white hover:bg-white/10"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-violet_fonce_1 hover:bg-violet"
              >
                {editingAccessId ? "Enregistrer" : "Créer l'accès"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
