"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function Hero() {
  const supabase = createClient();
  const [heroImageUrl, setHeroImageUrl] = useState("/placeholder.png");

  useEffect(() => {
    async function loadHeroImage() {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "hero_image_url")
        .maybeSingle();

      if (data?.value) {
        setHeroImageUrl(data.value);
      }
    }

    loadHeroImage();
  }, [supabase]);

  return (
    <section className="relative overflow-hidden bg-[#fff7f4]">
      <div className="absolute left-[-10rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-[#b0182f]/15 blur-3xl" />
      <div className="absolute bottom-[-12rem] right-[-8rem] h-[36rem] w-[36rem] rounded-full bg-[#e9a6a6]/30 blur-3xl" />

      <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:py-24">
        <div className="relative z-10 order-2 lg:order-1">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7a1020]/15 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.26em] text-[#7a1020] shadow-sm">
            <Sparkles className="h-4 w-4" />
            Venecija butik
          </div>

          <h1 className="max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.06em] text-[#24060b] md:text-7xl lg:text-8xl">
            Stil koji se primijeti odmah.
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-[#6b3b3f] md:text-lg">
            Pregledajte novu kolekciju, izaberite veličinu i rezervišite komad direktno online. Elegantno, brzo i jednostavno.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="h-12 rounded-full bg-[#7a1020] px-7 text-white shadow-xl shadow-red-950/20 transition hover:-translate-y-0.5 hover:bg-[#4b0711]"
            >
              <Link href="/shop">
                Pogledaj kolekciju
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-[#7a1020]/20 bg-white px-7 text-[#4a1118] hover:bg-[#fff0ee]"
            >
              <Link href="/#contact">
                <MapPin className="mr-2 h-4 w-4" />
                Lokacija butika
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 overflow-hidden rounded-[2rem] border border-[#7a1020]/10 bg-white shadow-sm">
            <div className="p-5">
              <p className="text-3xl font-black text-[#24060b]">50+</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#9c5b61]">
                proizvoda
              </p>
            </div>
            <div className="border-x border-[#7a1020]/10 p-5">
              <p className="text-3xl font-black text-[#24060b]">24h</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#9c5b61]">
                rezervacije
              </p>
            </div>
            <div className="p-5">
              <p className="text-3xl font-black text-[#24060b]">11 KM</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#9c5b61]">
                dostava
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 order-1 lg:order-2">
          <div className="absolute -right-5 -top-5 hidden h-40 w-40 rounded-full bg-[#7a1020] md:block" />
          <div className="absolute -bottom-8 -left-8 hidden h-48 w-48 rounded-full border border-[#7a1020]/20 md:block" />

          <div className="relative rotate-1 overflow-hidden rounded-[3rem] bg-[#7a1020] p-3 shadow-2xl shadow-red-950/25">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.4rem] bg-[#2a070d]">
              <Image
                src={heroImageUrl}
                alt="Venecija butik kolekcija"
                fill
                className="object-cover"
                priority
              />

              <div className="absolute inset-x-5 bottom-5 rounded-[2rem] border border-white/20 bg-white/90 p-5 backdrop-blur">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#b0182f]">
                  Nova kolekcija
                </p>
                <p className="mt-1 text-2xl font-black text-[#24060b]">
                  Rezervišite online
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
