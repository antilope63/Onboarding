import DocumentationContentSwitcher from "@/components/Documentation/DocumentationContentSwitcher";
import NavBar from "@/components/NavBar";

export default function DocumentationPage() {
  return (
    <section className="relative flex min-h-screen w-full justify-center bg-noir px-6 pb-16 pt-36 sm:px-12 lg:px-20">
      <NavBar classname="absolute top-0 left-0" />
      <div className="mt-12 flex w-full max-w-5xl flex-col gap-16">
        <header className="space-y-3">
          <h1 className="text-5xl font-bold leading-tight text-white sm:text-6xl">
            Des questions ?
          </h1>
          <p className="text-2xl text-white/80 sm:text-3xl">
            On a les réponses !
          </p>
        </header>
        <DocumentationContentSwitcher />
      </div>
    </section>
  );
}
