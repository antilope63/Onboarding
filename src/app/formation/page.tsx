import NavBar from "@/components/NavBar";
import SessionCard from "@/components/Formation/SessionCard";

export default function FormationPage() {
  return (
    <section className="flex flex-col justify-center items-center gap-20 w-full min-h-screen relative bg-noir">
      <NavBar classname="absolute top-0 left-0" />
      <div className="flex flex-col justify-center items-center gap-1">
        <p className="text-violet">Nos formations</p>
        <p className="text-white text-6xl font-bold">
          Tu as besoin d'un coup de boost ?
        </p>
        <p className="text-white/80 text-2xl">
          Tes collègues seront ravis de te rencontrer !
        </p>
      </div>
      <div className="flex flex-row gap-8">
        <SessionCard
          title="Session 1"
          description="Description de la session 1"
          image="/formation/femme1.jpeg"
          duration="1 heure"
          version="black_and_white"
        />
      </div>        
    </section>
  );
}
