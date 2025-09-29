import BackButton from "@/components/BackButton";
import OrgD3Tree from "@/components/Organigramme/Organigramme-d3-tree";
import { data } from "./data";

export default function OrganigrammePage() {
  return (
    <section className="flex flex-col justify-center items-center gap-8 w-full min-h-screen relative bg-noir">
      <div className="absolute top-6 left-6">
        <BackButton />
      </div>

      <h1 className="text-2xl font-bold text-white">Organigramme</h1>

      <OrgD3Tree data={data} />
    </section>
  );
}
