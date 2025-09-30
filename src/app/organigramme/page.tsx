import NavBar from "@/components/NavBar";
import OrgD3Tree from "@/components/Organigramme/Organigramme-d3-tree";
import { data } from "./data";

export default function OrganigrammePage() {
  return (
    <section className="flex flex-col justify-center items-center gap-8 w-full min-h-screen relative bg-noir">
      <NavBar classname="absolute top-0 left-0" />
      <OrgD3Tree data={data} />
    </section>
  );
}
