import Link from "next/link";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="border-t border-red-950/10 bg-[#24060b] px-4 py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="text-2xl font-black">Venecija butik</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-white/65">
            Robu šaljemo brzom poštom. Posjetite nas u Gračanici, Lukavcu i Tuzli ili nas kontaktirajte na 061/292-352.
          </p>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#f0b3b8]">
            Navigacija
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/70">
            <Link href="/shop" className="hover:text-white">
              Kolekcija
            </Link>
            <Link href="/#about" className="hover:text-white">
              O nama
            </Link>
            <Link href="/#contact" className="hover:text-white">
              Kontakt
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#f0b3b8]">
            Društvene mreže
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="https://www.instagram.com/butik.venecija/?hl=en"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-[#7a1020]"
            >
              <FaInstagram className="h-4 w-4" />
            </a>
            <a
              href="https://www.facebook.com/p/Butik-Venecija-61561577972720/"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-[#7a1020]"
            >
              <FaFacebookF className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs text-white/45">
        © {new Date().getFullYear()} Venecija butik. Sva prava zadržana.
      </div>
    </footer>
  );
}
