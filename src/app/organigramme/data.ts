import type { OrgNode } from "@/components/Organigramme";

export const data: OrgNode = {
  id: "ceo",
  title: "CEO",
  name: "Whitney Blessing",
  image: "/Organigramme/Luffy.jpeg",
  children: [
    {
      id: "cpo",
      title: "CPO",
      name: "Greg Wise",
      image: "/Organigramme/Shrek.jpg",
      children: [
        {
          id: "vp-design",
          title: "VP of Design",
          name: "Annie Bailey",
          image: "/Organigramme/Nami.jpeg",
          count: 8,
        },
        {
          id: "vp-marketing",
          title: "VP of Marketing",
          name: "Micheal Graves",
          image: "/Organigramme/Nami.jpeg",
          count: 12,
        },
      ],
    },
    {
      id: "cfo",
      title: "CFO",
      name: "Alexis Gibson",
      image: "/Organigramme/Shrek.jpg",
      children: [
        {
          id: "vp-finance",
          title: "VP of Finance",
          name: "Teresa Ward",
          image: "/Organigramme/Nami.jpeg",
          count: 6,
        },
        {
          id: "vp-sales",
          title: "VP of Sales",
          name: "Victor Rose",
          image: "/Organigramme/Nami.jpeg",
          count: 10,
        },
      ],
    },
  ],
};


