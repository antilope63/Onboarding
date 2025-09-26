import type { OrgNode } from "@/types/org";

export const data: OrgNode = {
  id: "ceo",
  title: "CEO",
  name: "Clémence Moreau",
  image: "/Organigramme/femme1.jpeg",
  children: [
    {
      id: "cto",
      title: "CTO",
      name: "Alexandre Martin",
      image: "/Organigramme/homme1.jpeg",
      children: [
        {
          id: "vp-data",
          title: "VP Data",
          name: "Hervé Adam",
          image: "/Organigramme/homme2.jpeg",
          children: [
            { id: "dir-data-a", title: "Director", name: "Sarah Colin",  image: "/Organigramme/femme7.jpeg", count: 8 },
            { id: "dir-data-b", title: "Director", name: "Nadia Lefèvre", image: "/Organigramme/femme8.jpeg", count: 7 },
          ],
        },
      ],
    },
    {
      id: "coo",
      title: "COO",
      name: "Emma Dubois",
      image: "/Organigramme/femme2.jpeg",
      children: [
        { id: "vp-ops",  title: "VP Ops", name: "Jean Wright",   image: "/Organigramme/homme3.jpeg", count: 18 },
        { id: "vp-hr",   title: "VP HR",  name: "Isabelle Leroy", image: "/Organigramme/femme4.jpeg", count: 10 },
        {
          id: "vp-eng",
          title: "VP Eng",
          name: "Sophie Clerc",
          image: "/Organigramme/femme3.jpeg",
          children: [
            { id: "dir-eng-a", title: "Director", name: "Marc Évrard",  image: "/Organigramme/homme4.jpeg", count: 14 },
            { id: "dir-eng-b", title: "Director", name: "Grace Millet", image: "/Organigramme/femme5.jpeg", count: 12 },
          ],
        },
      ],
    },
    {
      id: "cfo",
      title: "CFO",
      name: "Alexis Giraud",
      image: "/Organigramme/homme6.jpeg",
      children: [
        { id: "vp-fin-a",  title: "VP Finance", name: "Thérèse Vardon", image: "/Organigramme/femme6.jpeg", count: 9 },
        { id: "vp-sales",  title: "VP Sales",   name: "Victor Roussel", image: "/Organigramme/homme6.jpeg", children: [
          { id: "dir-sales-a", title: "Director", name: "Sabrina Colin", image: "/Organigramme/femme7.jpeg", count: 12 },
        ] },
        { id: "vp-fin-b",  title: "VP Finance", name: "Laurent Perrot", image: "/Organigramme/homme5.jpeg", count: 8 },
      ],
    },
  ],
};
