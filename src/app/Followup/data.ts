// app/followup/data.ts

export type Suivi = {
  id: string;
  titre: string;
  type: string;
  date: string;
  statut: "Obligatoire" | "Optionnel";
  couleur: "vert" | "violet" | "orange" | "gris";
};

export const prochainRdv = {
  date: "Demain, 10:00",
  titre: "Entretien avec le Manager",
  type: "1:1",
  statut: "Obligatoire",
  tempsRestant: "23h 15m",
  progression: 8, // en %
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBgJaWaQHzAym7Myj6nKZmel-OIlHObEqruU_aBZqtXAtAcMxuGHbPy2gBcN1f1Uj_8nptyYrgbc7OHu9XKpSzRO1XN2yDIuSuEMPdeQGB901zDrRSMg-zKWTk7mgFHzEzbbKhs-3299GMhVNQi6HjnixHg0SdYrNhranA3cuAc_hMLwYF3ZzP8_ZkpCS-MatoxKn1dNhFNMWjf2blA3Ia5Qdejov0fBaVdYlnFd9dX73gv4A8Sg8fSOsLS9fanBViht-k-TyAyajNy",
};

export const suivis: Suivi[] = [
  {
    id: "1",
    titre: "Entretien avec le Manager",
    type: "1:1",
    date: "Demain, 10:00",
    statut: "Obligatoire",
    couleur: "vert",
  },
  {
    id: "2",
    titre: "Point RH",
    type: "RH",
    date: "La semaine prochaine, 14:00",
    statut: "Obligatoire",
    couleur: "violet",
  },
  {
    id: "3",
    titre: "Synchronisation d'équipe",
    type: "Suivi de projet",
    date: "Dans 2 semaines, 11:00",
    statut: "Optionnel",
    couleur: "orange",
  },
];