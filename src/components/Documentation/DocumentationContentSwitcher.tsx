"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import DocumentationSection from "@/components/Documentation/DocumentationSection";
import FAQSection from "@/components/Documentation/FAQSection";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "documentation" as const, label: "Documentation" },
  { id: "faq" as const, label: "FAQ" },
];

type TabId = (typeof tabs)[number]["id"];

export default function DocumentationContentSwitcher() {
  const [activeTab, setActiveTab] = useState<TabId>("documentation");

  const activeIndex = useMemo(
    () => tabs.findIndex((tab) => tab.id === activeTab),
    [activeTab]
  );

  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-center md:justify-start">
        <nav
          aria-label="Documentation et FAQ"
          className="relative grid h-12 w-full max-w-md grid-cols-2 overflow-hidden rounded-full border border-white/10 bg-white/5 p-[5px] text-sm font-semibold text-white/70 shadow-[0_25px_60px_-45px_rgba(4,6,29,0.95)] backdrop-blur-lg"
        >
          <motion.span
            layout
            layoutId="documentation-faq-toggle"
            initial={false}
            animate={{
              left:
                activeIndex <= 0
                  ? "0.35rem"
                  : `calc(${activeIndex * 50}% + 0.35rem)`,
            }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[5px] bottom-[5px] rounded-full bg-gradient-to-br from-white/20 via-white/15 to-white/5 shadow-[0_20px_50px_-25px_rgba(8,10,35,0.9)]"
            style={{ width: "calc(50% - 0.7rem)" }}
          />
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative z-10 flex items-center justify-center rounded-full transition-colors",
                  isActive
                    ? "text-[#04061D]"
                    : "text-white/60 hover:text-white/90"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            {activeTab === "documentation" ? (
              <DocumentationSection />
            ) : (
              <FAQSection className="w-full" scrollMode="page" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
