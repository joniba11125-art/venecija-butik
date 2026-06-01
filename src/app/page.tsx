import { HelpCircle } from "lucide-react";
import { Hero } from "@/components/shop/Hero";
import { FeaturedProducts } from "@/components/shop/FeaturedProducts";
import { Testimonials } from "@/components/shop/Testimonials";
import { PromoPopup } from "@/components/shop/PromoPopup";

function GoldDivider() {
  return (
    <div className="bg-[#fff7f4] px-4">
      <div className="mx-auto max-w-7xl">
        <div className="h-px bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
      </div>
    </div>
  );
}

function FAQSection() {
  const questions = [
    {
      question: "Kako funkcioniše rezervacija?",
      answer:
        "Odaberete proizvod i veličinu, pošaljete rezervaciju, a butik vas kontaktira za potvrdu narudžbe putem telefona ili emaila.",
    },
    {
      question: "Kako se šalje roba?",
      answer: "Robu šaljemo brzom poštom. Za detalje i potvrdu kontaktiramo vas nakon rezervacije.",
    },
    {
      question: "Koliko traje isporuka?",
      answer: "Vrijeme isporuke zavisi od lokacije i dogovora nakon potvrde rezervacije.",
    },
    {
      question: "Da li je dozvoljeno otvaranje paketa?",
      answer: "Da, dozvoljeno je otvaranje paketa pri dostavi.",
    },
    {
      question: "Da li radite povrat novca?",
      answer:
        "Povrate ne radimo. Zamjene su moguće u roku od 24h prema pravilima butika.",
    },
    {
      question: "Gdje se nalazi butik?",
      answer: "Venecija butik možete pronaći u Gračanici, Lukavcu i Tuzli.",
    },
  ];

  return (
    <section id="faq" className="bg-[#fff7f4] px-4 py-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#3b0710] text-white">
            <HelpCircle className="h-5 w-5" />
          </div>

          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#b0182f]">
            FAQ
          </p>

          <h2 className="text-2xl font-semibold tracking-tight text-[#24060b] md:text-5xl">
            Pitanja prije rezervacije
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#6b3b3f] md:text-base">
            Sve najvažnije informacije o rezervaciji, slanju brzom poštom i lokacijama butika.
          </p>
        </div>

        <div className="grid gap-2.5 md:gap-4 md:grid-cols-2">
          {questions.map((item) => (
            <div
              key={item.question}
              className="rounded-2xl border border-[#7a1020]/10 bg-[#fff7f4] p-3.5 shadow-sm md:p-6"
            >
              <h3 className="text-sm font-semibold text-[#24060b] md:text-lg">
                {item.question}
              </h3>
              <p className="mt-1.5 text-xs leading-5 text-[#6b3b3f] md:text-sm md:leading-6">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main>
      <Hero />
      <GoldDivider />
      <FeaturedProducts />
      <GoldDivider />
      <Testimonials />
      <GoldDivider />
      <FAQSection />
      <PromoPopup />
    </main>
  );
}
