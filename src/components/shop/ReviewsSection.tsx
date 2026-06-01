"use client";

const reviews = [
  {
    name: "Amra K.",
    role: "Kupac",
    text: "Prezadovoljna sam. Rezervacija je bila brza, komunikacija lagana, a komad uživo još ljepši nego na slici.",
    rating: 5,
    highlight: true,
  },
  {
    name: "Lejla M.",
    role: "Kupac",
    text: "Sve preporuke za Venecija butik. Odgovorili su brzo i pomogli oko veličine.",
    rating: 5,
  },
  {
    name: "Selma H.",
    role: "Kupac",
    text: "Naručila sam nakon pregleda shopa i sve je prošlo jednostavno. Sigurno opet kupujem.",
    rating: 5,
  },
];

function Stars() {
  return <div className="text-[#ffcc66] text-sm tracking-[0.25em]">★★★★★</div>;
}

export function ReviewsSection() {
  const main = reviews[0];
  const side = reviews.slice(1);

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#a3152d]">
            ISKUSTVA KUPACA
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-[#24060b] md:text-5xl">
            Šta kupci kažu o nama
          </h2>
          <p className="mt-4 text-base leading-7 text-[#6b3b3f]">
            Kratki utisci kupaca koji su rezervisali komade iz Venecija butik kolekcije.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="relative overflow-hidden rounded-[2.2rem] bg-[#4a0813] p-8 text-white shadow-[0_25px_80px_rgba(74,8,19,0.30)]">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#ffffff14] blur-3xl" />
            <div className="absolute left-[-2rem] bottom-[-2rem] h-40 w-40 rounded-full bg-[#c1273d]/20 blur-3xl" />

            <div className="relative">
              <Stars />
              <p className="mt-6 max-w-2xl text-2xl font-semibold leading-[1.5] text-white md:text-3xl">
                “{main.text}”
              </p>

              <div className="mt-10 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-lg font-black">
                  {main.name.charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-black">{main.name}</p>
                  <p className="text-sm uppercase tracking-[0.25em] text-white/60">
                    {main.role}
                  </p>
                </div>
              </div>
            </div>
          </article>

          <div className="grid gap-6">
            {side.map((review) => (
              <article
                key={review.name}
                className="rounded-[2rem] border border-[#7a1020]/10 bg-[#fff7f4] p-6 shadow-[0_18px_45px_rgba(122,16,32,0.08)]"
              >
                <Stars />
                <p className="mt-5 text-base leading-7 text-[#3a1016]">
                  “{review.text}”
                </p>

                <div className="mt-6 border-t border-[#7a1020]/10 pt-4">
                  <p className="font-black text-[#24060b]">{review.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.25em] text-[#9c5b61]">
                    {review.role}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
