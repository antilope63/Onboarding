import BackButton from "@/components/BackButton";

export default function OrganigrammePage() {
  return (
    <section className="flex flex-col justify-center items-center gap-4 w-full h-screen relative">
      <div className="absolute top-6 left-6 bg-violet_fonce_1">
        <BackButton />
      </div>
      <p>Organigramme</p>
    </section>
  );
}
