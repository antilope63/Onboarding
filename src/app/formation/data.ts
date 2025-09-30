export type FormationSession = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  formatter: {
    name: string;
    role: string;
    image: string;
  };
};

export const sessions: FormationSession[] = [
  {
    id: "session-1",
    title: "Camila Wilson",
    subtitle: "Customer Support Lead",
    image: "/Formation/Jira1.png",
    formatter:{
      name: "Camila Wilson",
      role: "Customer Support Lead",
      image: "/Organigramme/femme7.jpeg",
    }
  },
  {
    id: "session-2",
    title: "Olive Nacolle",
    subtitle: "VP Customer Success",
    image: "/Formation/Jira1.png",
    formatter:{
      name: "Olive Nacolle",
      role: "VP Customer Success",
      image: "/Organigramme/femme6.jpeg",
    }
  },
  {
    id: "session-3",
    title: "Sophie Chamberlain",
    subtitle: "Specialized Support",
    image: "/Formation/Jira1.png",
    formatter:{
      name: "Sophie Chamberlain",
      role: "Specialized Support",
      image: "/Organigramme/femme3.jpeg",
    }
  },
  {
    id: "session-4",
    title: "Jessica Dobrev",
    subtitle: "Payments Support",
    image: "/Formation/Jira1.png",
    formatter:{
      name: "Jessica Dobrev",
      role: "Payments Support",
      image: "/Organigramme/femme5.jpeg",
    }
  },
  {
    id: "session-5",
    title: "Orlando Diggs",
    subtitle: "Customer Success Lead",
    image: "/Formation/Jira1.png",
    formatter:{
      name: "Orlando Diggs",
      role: "Customer Success Lead",
      image: "/Organigramme/homme4.jpeg",
    }
  },
  {
    id: "session-6",
    title: "Sasha Kramer",
    subtitle: "Onboarding Manager",
    image: "/Formation/Jira1.png",
    formatter:{
      name: "Sasha Kramer",
      role: "Onboarding Manager",
      image: "/Organigramme/homme3.jpeg",
    }
  },
  {
    id: "session-7",
    title: "Milo Duarte",
    subtitle: "Ops Specialist",
    image: "/Formation/Jira1.png",
    formatter:{
      name: "Milo Duarte",
      role: "Ops Specialist",
      image: "/Organigramme/homme2.jpeg",
    }
  },
  {
    id: "session-8",
    title: "Ava Chen",
    subtitle: "Product Advocate",
    image: "/Formation/Jira1.png",
    formatter:{
      name: "Ava Chen",
      role: "Product Advocate",
      image: "/Organigramme/femme2.jpeg",
    }
  },
  {
    id: "session-9",
    title: "Noah Patel",
    subtitle: "Training Lead",
    image: "/Formation/Jira1.png",
    formatter:{
      name: "Noah Patel",
      role: "Training Lead",
      image: "/Organigramme/homme1.jpeg",
    }
  },
  {
    id: "session-10",
    title: "Lina Moretti",
    subtitle: "Customer Education",
    image: "/Formation/Jira1.png",
    formatter:{
      name: "Lina Moretti",
      role: "Customer Education",
      image: "/Organigramme/femme1.jpeg",
    }
  },
];
