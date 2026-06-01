import Link from "next/link";
import { MapPin, Phone, Truck } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

const facebookUrl = "https://www.facebook.com/p/Butik-Venecija-61561577972720/";
const instagramUrl = "https://www.instagram.com/butik.venecija/?hl=en";
const mapUrl = "https://www.google.com/maps?q=44.69381684341315,18.300427499999998";

export function Footer() {
  return (
    <footer className="bg-[#2a0308] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.1fr_1fr_0.8fr]">
        <div>
          <p className="text-3xl font-black tracking-tight">Venecija butik</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
            Robu šaljemo brzom poštom. Posjetite nas u Gračanici, Lukavcu i Tuzli ili nas kontaktirajte za rezervaciju.
          </p>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <Phone className="h-5 w-5 text-rose-200" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                Kontakt
              </p>
              <p className="font-bold">061/292-352</p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <Truck className="h-5 w-5 text-rose-200" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                Slanje
              </p>
              <p className="font-bold">Robu šaljemo brzom poštom</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.3em] text-rose-200">
            Lokacije
          </p>

          <div className="mt-5 space-y-4 text-sm text-white/75">
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
            >
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-rose-200" />
              <div>
                <p className="font-bold text-white">Gračanica</p>
                <p>Ul. Zlatnih ljiljana bb, 75320</p>
              </div>
            </a>

            <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-rose-200" />
              <div>
                <p className="font-bold text-white">Lukavac</p>
                <p>Ul. Patriotske Lige bb, 75300</p>
              </div>
            </div>

            <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-rose-200" />
              <div>
                <p className="font-bold text-white">Tuzla</p>
                <p>Poslovnica Venecija butik</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.3em] text-rose-200">
            Meni
          </p>

          <div className="mt-5 flex flex-col gap-3 text-sm text-white/70">
            <Link href="/shop" className="hover:text-white">
              Kolekcija
            </Link>
            <Link href="/#about" className="hover:text-white">
              O nama
            </Link>
            <Link href="/#contact" className="hover:text-white">
              Kontakt
            </Link>
            <Link href="/#faq" className="hover:text-white">
              FAQ
            </Link>
          </div>

          <p className="mt-8 text-sm font-black uppercase tracking-[0.3em] text-rose-200">
            Društvene mreže
          </p>

          <div className="mt-5 flex gap-3">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-[#7a1020]"
            >
              <FaInstagram className="h-4 w-4" />
            </a>

            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-[#7a1020]"
            >
              <FaFacebookF className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5">
        <div className="mx-auto max-w-7xl text-xs text-white/45">
          © {new Date().getFullYear()} Venecija butik. Sva prava zadržana.
        </div>
      </div>
    </footer>
  );
}
