"use client";

import { useState, useRef, useEffect } from "react";
import { Check, Clock, X, Send, Copy } from "lucide-react";
import { toast, Toaster } from "sonner";

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

  const accessList = [
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
  ];

  const countStatut = (statut: string) =>
    accessList.filter((a) => a.statut === statut).length;

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
      <Toaster position="bottom-right" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Accès & Droits</h1>
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
              Mes demandes d'accès
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#22254C]">
                  {accessList.map((item) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:col-span-2 bg-[#1D1E3B] p-6 rounded-xl border border-[#22254C] shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1.5 bg-[#7D5AE0] glow-border"></div>
              <h3 className="text-xl font-semibold mb-6">
                Nouvelle demande d'accès
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
                    Type d'accès
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
    </main>
  );
}
