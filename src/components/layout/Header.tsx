"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Početna", href: "/" },
  { name: "Kolekcija", href: "/shop" },
  { name: "O nama", href: "/#about" },
  { name: "Kontakt", href: "/#contact" },
  { name: "FAQ", href: "/#faq" },
];

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/butik.venecija/?hl=en",
    icon: FaInstagram,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/p/Butik-Venecija-61561577972720/",
    icon: FaFacebookF,
  },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] border-b border-red-950/10 bg-[#fff7f4]/90 backdrop-blur-xl">
      <div className="border-b border-red-950/10 bg-[#7a1020] px-4 py-2 text-center text-xs font-medium tracking-[0.25em] text-white">
        VENECIJA BUTIK · ONLINE REZERVACIJE · NOVA KOLEKCIJA
      </div>

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-[#7a1020] shadow-lg shadow-red-950/20">
            <Image
              src="/boutique-logo.png"
              alt="Venecija butik"
              fill
              className="object-contain p-2"
              priority
            />
          </div>

          <div>
            <p className="text-xl font-black leading-none tracking-tight text-[#2a070d]">
              Venecija butik
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#a33a45]">
              Gračanica · Lukavac · Tuzla
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-[#4a1118] md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="transition hover:text-[#b0182f]"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {socialLinks.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.name}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-red-950/15 bg-white text-[#7a1020] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#7a1020] hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}

          <Button
            asChild
            className="rounded-full bg-[#7a1020] px-5 text-white shadow-lg shadow-red-950/20 transition hover:-translate-y-0.5 hover:bg-[#4b0711]"
          >
            <Link href="/shop">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Shop
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            asChild
            className="rounded-full bg-[#7a1020] px-4 text-white hover:bg-[#4b0711]"
          >
            <Link href="/shop">Shop</Link>
          </Button>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-red-950/15 bg-white text-[#7a1020]"
            onClick={() => setIsOpen((current) => !current)}
            aria-label="Otvori meni"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="border-t border-red-950/10 bg-white px-4 py-5 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-base font-bold text-[#4a1118]"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="flex gap-2 pt-2">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full border text-[#7a1020]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
      </header>
      <div className="VENECIJA_HEADER_SPACER h-[112px]" aria-hidden="true" />
    </>
  );
}
