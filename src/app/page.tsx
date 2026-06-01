import { HelpCircle } from "lucide-react";
import { Hero } from "@/components/shop/Hero";
import { FeaturedProducts } from "@/components/shop/FeaturedProducts";
import { Testimonials } from "@/components/shop/Testimonials";
import { PromoPopup } from "@/components/shop/PromoPopup";
import { ReviewsSection } from "@/components/shop/ReviewsSection";
import { FaqAccordion } from "@/components/shop/FaqAccordion";

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
          <FaqAccordion />
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
