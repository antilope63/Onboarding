import NavBar from "@/components/NavBar";
import FAQSection from "@/components/Documentation/FAQSection";
import DocumentationSection from "@/components/Documentation/DocumentationSection";
import NoScroll from "@/components/NoScroll";

export default function DocumentationPage() {
  return (
    <section className="flex flex-row gap-24 w-full min-h-screen relative bg-noir pt-36 px-20">
      <NoScroll />
      <NavBar classname="absolute top-0 left-0" />
      <div className="flex flex-col gap-32 mt-12 w-[1400px]">
        <div>
          <h1 className="text-8xl font-bold text-white">Des questions ?</h1>
          <p className="text-white text-4xl">On a les réponses !</p>
        </div>
        <DocumentationSection className="max-w-[500px]" />
      </div>
      <FAQSection
        className="mt-12"
        easing="strong"
      />
    </section>
  );
}
