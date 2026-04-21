import { memo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQ_ITEMS } from "@/data/civicContent";

const FAQSection = memo(function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = useCallback((i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  }, []);

  return (
    <section className="py-16 px-4" aria-labelledby="faq-heading">
      <div className="container max-w-3xl mx-auto">
        <h2 id="faq-heading" className="text-3xl font-bold text-foreground mb-2 text-center">
          Election FAQ
        </h2>
        <p className="text-muted-foreground text-center mb-10 font-sans">
          Common questions about the electoral process
        </p>

        <div className="space-y-3" role="list">
          {FAQ_ITEMS.map((item, i) => (
            <div key={item.question} className="civic-card overflow-hidden" role="listitem">
              <button
                className="w-full p-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-ring rounded-xl"
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
              >
                <div className="flex items-center gap-3">
                  <span className="civic-badge-info font-sans text-xs">{item.category}</span>
                  <span className="text-sm font-medium text-foreground font-sans">{item.question}</span>
                </div>
                <span className="text-muted-foreground text-lg" aria-hidden="true">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    id={`faq-answer-${i}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground font-sans leading-relaxed">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default FAQSection;
