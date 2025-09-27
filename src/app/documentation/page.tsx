import NavBar from "@/components/NavBar";

export default function DocumentationPage() {
  return (
    <section className="flex flex-col justify-center items-center gap-8 w-full min-h-screen relative bg-noir">
      <NavBar classname="absolute top-0 left-0" />
      <h1 className="text-2xl font-bold text-white">Contenu de la page</h1>
    </section>
  );
}
