import type { OrgNode } from "@/types/org";

export const data: OrgNode = {
  id: "ceo",
  title: "CEO",
  name: "Whitney Blessing",
  image: "/Organigramme/Luffy.jpeg",
  children: [
    
    {
      id: "cto",
      title: "CTO",
      name: "Alex Martin",
      image: "/Organigramme/Shrek.jpg",
      children: [
        
        {
          id: "vp-data",
          title: "VP Data",
          name: "Henry Adams",
          image: "/Organigramme/Nami.jpeg",
          children: [
            { id: "dir-data-a", title: "Director", name: "Sarah Collins", image: "/Organigramme/Nami.jpeg", children: [
              { id: "dir-data-a-a", title: "Director", name: "Sarah Collins", image: "/Organigramme/Nami.jpeg", count: 12 },
              { id: "dir-data-a-a", title: "Director", name: "Sarah Collins", image: "/Organigramme/Nami.jpeg", count: 12 },] },
          ],
        },
      ],
    },
    {
      id: "coo",
      title: "COO",
      name: "Emma Johnson",
      image: "/Organigramme/Shrek.jpg",
      children: [
        { id: "vp-ops", title: "VP Ops", name: "James Wright",  image: "/Organigramme/Nami.jpeg", count: 20 },
        { id: "vp-hr",  title: "VP HR",  name: "Isabella Lee",  image: "/Organigramme/Nami.jpeg", count: 15 },
        {
          id: "vp-eng",
          title: "VP Eng",
          name: "Sophia Clark",
          image: "/Organigramme/Nami.jpeg",
          // On répartit le 22 en 12 + 10
          children: [
            { id: "dir-eng-a", title: "Director", name: "Mark Evans",   image: "/Organigramme/Nami.jpeg", count: 12 },
            { id: "dir-eng-b", title: "Director", name: "Grace Miller", image: "/Organigramme/Nami.jpeg", count: 10 },
          ],
        },
      ],
    },
    {
      id: "cfo",
      title: "CFO",
      name: "Alexis Gibson",
      image: "/Organigramme/Shrek.jpg",
      children: [
        { id: "vp-fin",  title: "VP Finance", name: "Teresa Ward", image: "/Organigramme/Nami.jpeg", count: 15 },
        { id: "vp-sales",title: "VP Sales",   name: "Victor Rose", image: "/Organigramme/Nami.jpeg", children: [
          { id: "dir-sales-a", title: "Director", name: "Sarah Collins", image: "/Organigramme/Nami.jpeg", count: 12 },
        ] },
      ],
    },
  ],
};
