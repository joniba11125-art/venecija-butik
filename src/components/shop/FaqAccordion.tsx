"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqItems = [
  {
    question: "Kako funkcioniše rezervacija?",
    answer:
      "Odaberete proizvod i veličinu, pošaljete rezervaciju, a butik vas kontaktira za potvrdu narudžbe putem telefona ili emaila.",
  },
  {
    question: "Kako se šalje roba?",
    answer:
      "Robu šaljemo brzom poštom. Nakon rezervacije dobijate potvrdu i sve detalje oko slanja.",
  },
  {
    question: "Koliko traje isporuka?",
    answer:
      "Vrijeme isporuke zavisi od lokacije i dogovora nakon potvrde rezervacije.",
  },
  {
    question: "Da li je dozvoljeno otvaranje paketa?",
    answer:
      "Da, dozvoljeno je otvaranje paketa pri dostavi.",
  },
  {
    question: "Da li radite povrat novca?",
    answer:
      "Povrate ne radimo. Zamjene su moguće u roku od 24h prema pravilima butika.",
  },
  {
    question: "Gdje se nalazi butik?",
    answer:
      "Venecija butik možete pronaći u Gračanici, Lukavcu i Tuzli.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function toggle(index: number) {
    setOpenIndex((current) => (current === index ? null : index));
  }

  return (
    <section className="bg-[#fff4f2] px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#a3152d]">
            FAQ
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-[#24060b] md:text-5xl">
            Pitanja prije rezervacije
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#6b3b3f]">
            Sve najvažnije informacije o rezervaciji, brzoj pošti i lokacijama butika.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.question}
                className={`overflow-hidden rounded-[1.8rem] border transition-all duration-300 ${
                  isOpen
                    ? "border-[#7a1020]/20 bg-[#4a0813] text-white shadow-[0_25px_60px_rgba(74,8,19,0.22)]"
                    : "border-[#7a1020]/10 bg-white text-[#24060b] shadow-[0_12px_30px_rgba(122,16,32,0.07)]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                        isOpen
                          ? "bg-white/10 text-white"
                          : "bg-[#fff1ee] text-[#a3152d]"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-lg font-black leading-6">
                      {item.question}
                    </span>
                  </div>

                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div
                      className={`px-6 pb-6 pl-[4.75rem] text-sm leading-7 ${
                        isOpen ? "text-white/80" : "text-[#6b3b3f]"
                      }`}
                    >
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
