import BackButton from "@/components/BackButton";
import OrgChart from "@/components/Organigramme/Organigramme";
import OrgD3Tree from "@/components/Organigramme/Organigramme-d3-tree";
import { data } from "./data";

export default function OrganigrammePage() {
  return (
    <section className="flex flex-col justify-center items-center gap-8 w-full min-h-screen relative bg-gray-50">
      <div className="absolute top-6 left-6">
        <BackButton />
      </div>

      <h1 className="text-2xl font-bold">Organigramme</h1>

      {/* Composant organigramme */}
      {/* <div className="w-full max-w-5xl overflow-x-auto">
        <OrgChart root={data} />
      </div> */}
      <OrgD3Tree data={data} />
    </section>
  );
}
