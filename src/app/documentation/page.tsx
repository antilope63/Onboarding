import NavBar from "@/components/NavBar";
import FAQSection from "@/components/Documentation/FAQSection";
import DocumentationSection from "@/components/Documentation/DocumentationSection";

export default function DocumentationPage() {
  return (
    <section className="flex gap-14 w-full min-h-screen relative bg-noir pt-36 px-20">
      <NavBar classname="absolute top-0 left-0" />
      <div className="flex flex-col gap-20 w-full max-w-[700px]">
        <div>
          <h1 className="text-8xl font-bold text-white">Des questions ?</h1>
          <p className="text-white/80 text-5xl">On a les réponses !</p>
        </div>
        <DocumentationSection />
      </div>
      <div className="w-[2px] h-[700px] bg-white/20" />
      <div className="flex-1 min-h-0">
        <FAQSection className="h-[calc(100vh-9rem)]" />
      </div>
    </section>
  );
}
