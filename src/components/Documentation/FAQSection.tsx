import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircleQuestionMark } from "lucide-react";
import { FAQ_ITEMS } from "@/app/documentation/data";
import { cn } from "@/lib/utils";

export type FAQSectionProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

export default function FAQSection({ className, ...rest }: FAQSectionProps) {
  return (
    <section className={cn("flex flex-col w-full h-full", className)} {...rest}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-4">
          <MessageCircleQuestionMark className="w-8 h-8 text-white" />
          <h1 className="text-3xl font-bold text-white text-nowrap">
            Foire Aux Questions
          </h1>
        </div>
        <p className="text-white/80 pl-12">
          Retrouvez ici les réponses aux questions les plus fréquentes.
        </p>
      </div>

      {/* <div className="flex items-center gap-4 shrink-0">
        <MessageCircleQuestionMark className="w-14 h-14 stroke-2 text-white" />
        <div className="flex flex-col">
          <h2 className="text-4xl font-bold text-white">FAQ</h2>
          <p className="text-white/80">
            Retrouvez ici les réponses aux questions les plus fréquentes.
          </p>
        </div>
      </div> */}

      <div className="mt-12 flex-1 min-h-0 overflow-y-auto pr-2">
        {Object.entries(
          FAQ_ITEMS.reduce<Record<string, typeof FAQ_ITEMS>>((acc, item) => {
            (acc[item.category] ||= []).push(item);
            return acc;
          }, {})
        ).map(([category, items]) => (
          <section key={category} className="mb-16 bg-bleu_fonce_2 p-4 rounded-lg">
            <h3 className="text-white font-semibold text-4xl mb-2">
              {category}
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {items.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="text-white/80 text-lg font-bold">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 whitespace-pre-wrap">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>
    </section>
  );
}
