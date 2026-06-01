"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Home } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const showAdminHomeButton =
    isAdminPage && pathname !== "/admin" && pathname !== "/admin/login";
  const showPublicSiteButton = isAdminPage && pathname !== "/admin/login";

  return (
    <>
      {!isAdminPage ? <Header /> : null}

      {isAdminPage ? <div className="admin-shell">{children}</div> : children}

      {!isAdminPage ? <Footer /> : null}

      {showAdminHomeButton ? (
        <Link
          href="/admin"
          className="fixed left-4 top-1/2 z-[70] hidden -translate-y-1/2 items-center gap-2 rounded-full border bg-[#fff7f4] px-4 py-3 text-sm font-semibold text-white shadow-2xl transition hover:bg-neutral-800 md:flex"
        >
          <Home className="h-4 w-4" />
          Admin početna
        </Link>
      ) : null}

      {showAdminHomeButton ? (
        <Link
          href="/admin"
          className="fixed bottom-5 left-5 z-[70] flex h-12 w-12 items-center justify-center rounded-full bg-[#fff7f4] text-white shadow-2xl md:hidden"
          aria-label="Admin početna"
        >
          <Home className="h-5 w-5" />
        </Link>
      ) : null}

      {showPublicSiteButton ? (
        <Link
          href="/"
          target="_blank"
          className="fixed bottom-5 right-5 z-[70] hidden items-center gap-2 rounded-full border border-[#7a1020]/20 bg-[#7a1020] px-5 py-3 text-sm font-bold text-white shadow-2xl shadow-red-950/20 transition hover:-translate-y-0.5 hover:bg-[#4b0711] md:flex"
        >
          <ExternalLink className="h-4 w-4" />
          Pogledaj sajt
        </Link>
      ) : null}

      {showPublicSiteButton ? (
        <Link
          href="/"
          target="_blank"
          className="fixed bottom-5 right-5 z-[70] flex h-12 w-12 items-center justify-center rounded-full bg-[#7a1020] text-white shadow-2xl shadow-red-950/20 md:hidden"
          aria-label="Pogledaj sajt"
        >
          <ExternalLink className="h-5 w-5" />
        </Link>
      ) : null}
    </>
  );
}

