"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Početna", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "O nama", href: "/#about" },
  { name: "Kontakt", href: "/#contact" },
  { name: "FAQ", href: "/#faq" },
];

const socialLinks = [
  {
    name: "Instagram",
    href: "#",
    icon: FaInstagram,
  },
  {
    name: "Facebook",
    href: "#",
    icon: FaFacebookF,
  },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showShopHint, setShowShopHint] = useState(false);
  const [showCollectionHint, setShowCollectionHint] = useState(false);

  useEffect(() => {
    const shopShowTimer = window.setTimeout(() => setShowShopHint(true), 900);
    const shopHideTimer = window.setTimeout(() => setShowShopHint(false), 5900);

    const collectionShowTimer = window.setTimeout(
      () => setShowCollectionHint(true),
      1200
    );
    const collectionHideTimer = window.setTimeout(
      () => setShowCollectionHint(false),
      6200
    );

    return () => {
      window.clearTimeout(shopShowTimer);
      window.clearTimeout(shopHideTimer);
      window.clearTimeout(collectionShowTimer);
      window.clearTimeout(collectionHideTimer);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#061537]/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="relative h-14 w-14">
            <Image
              src="/boutique-logo.png"
              alt="Venecija Butik"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div>
            <p className="text-xl font-semibold leading-none tracking-tight text-white">
              Venecija Butik
            </p>
            <p className="mt-1 text-xs text-amber-200/80">Boutique</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-white/85 md:flex">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className="hover:text-amber-200">
              {item.name}
            </Link>
          ))}

          <div className="h-5 w-px bg-white/15" />

          {socialLinks.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.name}
                className="flex h-9 w-9 items-center justify-center rounded-full border text-white/85 transition hover:border-amber-200 hover:bg-amber-100 hover:text-neutral-950"
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="relative">
            <Button
              asChild
              className="rounded-full bg-amber-100 text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
            >
              <Link href="/shop">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Kolekcija
              </Link>
            </Button>

            {showCollectionHint ? (
              <div className="pointer-events-none absolute right-0 top-full z-50 mt-3 hidden w-72 animate-[shopHintIn_0.45s_ease-out] rounded-2xl border border-[#d7b35a]/40 bg-white p-3 text-sm text-neutral-900 shadow-2xl md:block">
                <div className="absolute -top-2 right-8 h-4 w-4 rotate-45 border-l border-t border-[#d7b35a]/40 bg-white" />
                <p className="font-semibold">Pogledajte našu kolekciju</p>
                <p className="mt-1 text-xs leading-5 text-neutral-600">
                  Otvorite kolekciju, pogledajte proizvode i rezervišite direktno online.
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="relative ml-auto mr-3 md:hidden">
          <Link
            href="/shop"
            data-shop-cta="true"
            className="inline-flex items-center justify-center rounded-full border border-[#d7b35a]/60 bg-[#d7b35a] px-4 py-2 text-sm font-semibold text-[#071739] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#f0cf73]"
          >
            Shop
          </Link>

          {showShopHint ? (
            <div className="pointer-events-none absolute right-0 top-full z-50 mt-3 w-64 animate-[shopHintIn_0.45s_ease-out] rounded-2xl border border-[#d7b35a]/40 bg-white p-3 text-sm text-neutral-900 shadow-2xl">
              <div className="absolute -top-2 right-8 h-4 w-4 rotate-45 border-l border-t border-[#d7b35a]/40 bg-white" />
              <p className="font-semibold">Pogledajte cijelu kolekciju</p>
              <p className="mt-1 text-xs leading-5 text-neutral-600">
                Otvorite shop, pregledajte proizvode i rezervišite omiljeni komad.
              </p>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/20 md:hidden"
          onClick={() => setIsOpen((current) => !current)}
          aria-label="Otvori meni"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t bg-white px-4 py-5 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-base font-medium text-neutral-800"
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
                    className="flex h-10 w-10 items-center justify-center rounded-full border text-neutral-800"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>

            <Button asChild className="mt-2 rounded-full">
              <Link href="/shop" onClick={() => setIsOpen(false)}>
                Pogledaj kolekciju
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
