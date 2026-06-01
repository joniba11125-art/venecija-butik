"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  ClipboardList,
  LogOut,
  MessageSquare,
  Package,
  RefreshCcw,
  Settings,
  ShoppingBag,
  User,
  ArrowUpRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { StaffSelector } from "@/components/admin/StaffSelector";
import { Button } from "@/components/ui/button";

type DashboardStats = {
  productsCount: number;
  reservationsCount: number;
  newReservationsCount: number;
  reviewsCount: number;
};

const quickLinks = [
  {
    title: "Proizvodi",
    description: "Dodavanje, uređivanje, slike, veličine i kategorije artikala.",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Rezervacije",
    description: "Pregled narudžbi, statusi, kontakt kupaca i artikli.",
    href: "/admin/reservations",
    icon: ShoppingBag,
  },
  {
    title: "Recenzije",
    description: "Pregled i upravljanje recenzijama kupaca.",
    href: "/admin/reviews",
    icon: MessageSquare,
  },
  {
    title: "Postavke",
    description: "Početna slika, radnice i osnovne postavke sajta.",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Dnevni izvještaj",
    description: "Aktivnosti radnica i dnevne napomene.",
    href: "/admin/daily-report",
    icon: ClipboardList,
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [adminEmail, setAdminEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [stats, setStats] = useState<DashboardStats>({
    productsCount: 0,
    reservationsCount: 0,
    newReservationsCount: 0,
    reviewsCount: 0,
  });

  async function checkAdmin() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.push("/admin/login");
      return false;
    }

    setAdminEmail(user.email ?? "");

    const { data: adminData, error: adminError } = await supabase
      .from("admins")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (adminError || !adminData) {
      router.push("/admin/login");
      return false;
    }

    return true;
  }

  async function loadStats() {
    setIsLoading(true);
    setErrorMessage("");

    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return;
    }

    const [
      productsResult,
      reservationsResult,
      newReservationsResult,
      reviewsResult,
    ] = await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("reservations").select("id", { count: "exact", head: true }),
      supabase
        .from("reservations")
        .select("id", { count: "exact", head: true })
        .eq("status", "novo"),
      supabase.from("reviews").select("id", { count: "exact", head: true }),
    ]);

    if (
      productsResult.error ||
      reservationsResult.error ||
      newReservationsResult.error ||
      reviewsResult.error
    ) {
      setErrorMessage("Statistika se nije učitala.");
      setIsLoading(false);
      return;
    }

    setStats({
      productsCount: productsResult.count ?? 0,
      reservationsCount: reservationsResult.count ?? 0,
      newReservationsCount: newReservationsResult.count ?? 0,
      reviewsCount: reviewsResult.count ?? 0,
    });

    setIsLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  useEffect(() => {
    loadStats();
  }, []);

  const statCards = [
    {
      label: "Proizvodi",
      value: stats.productsCount,
      helper: "Ukupno artikala",
    },
    {
      label: "Rezervacije",
      value: stats.reservationsCount,
      helper: "Sve narudžbe",
    },
    {
      label: "Nove",
      value: stats.newReservationsCount,
      helper: "Čekaju obradu",
      highlight: true,
    },
    {
      label: "Recenzije",
      value: stats.reviewsCount,
      helper: "Ukupno komentara",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fff7f4] text-[#24060b]">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(176,24,47,0.12),transparent_35%),linear-gradient(180deg,#fff7f4_0%,#fff0ee_100%)]" />
      <section className="relative z-10 border-b border-[#7a1020]/10 bg-white/80 px-4 py-5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#a3152d]">
              Venecija butik
            </p>

            <h1 className="mt-1 text-3xl font-black tracking-[-0.05em] text-[#24060b] md:text-4xl">
              Admin centar
            </h1>

            {adminEmail ? (
              <p className="mt-1 text-sm text-[#6b3b3f]">
                Prijavljen nalog: <span className="font-bold text-[#24060b]">{adminEmail}</span>
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-[#7a1020]/15 bg-white text-[#7a1020] hover:bg-[#fff0ee]"
              onClick={loadStats}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Osvježi
            </Button>

            <Button
              type="button"
              variant="outline"
              className="rounded-full border-[#7a1020]/15 bg-white text-[#7a1020] hover:bg-[#fff0ee]"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Odjava
            </Button>

            <Button
              asChild
              className="rounded-full bg-[#7a1020] px-5 font-bold text-white hover:bg-[#4b0711]"
            >
              <Link href="/" target="_blank">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Pogledaj sajt
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 py-6 md:py-8">
        <div className="mx-auto max-w-7xl">
          {errorMessage ? (
            <div className="mb-6 rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
            <div className="overflow-hidden rounded-[2rem] border border-[#7a1020]/10 bg-white/95 shadow-[0_20px_60px_rgba(122,16,32,0.10)]">
              <div className="border-b border-[#7a1020]/10 p-6 md:p-7">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7a1020] text-white shadow-lg shadow-red-950/15">
                      <BarChart3 className="h-6 w-6" />
                    </div>

                    <h2 className="text-2xl font-black tracking-[-0.03em] text-[#24060b]">
                      Pregled butika
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6b3b3f]">
                      Brzi pregled proizvoda, rezervacija, recenzija i dnevnih aktivnosti.
                    </p>
                  </div>

                  <Button
                    asChild
                    className="rounded-full bg-[#7a1020] text-white hover:bg-[#4b0711]"
                  >
                    <Link href="/admin/reservations">
                      Otvori rezervacije
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-px bg-[#7a1020]/10 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((item) => (
                  <div
                    key={item.label}
                    className={
                      item.highlight
                        ? "bg-[#fff0ee] p-6"
                        : "bg-white p-6"
                    }
                  >
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9c5b61]">
                      {item.label}
                    </p>

                    <p className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#24060b]">
                      {isLoading ? "..." : item.value}
                    </p>

                    <p className="mt-2 text-xs font-semibold text-[#7b5155]">
                      {item.helper}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#7a1020]/10 bg-[#3b0710] p-6 text-white shadow-[0_20px_60px_rgba(74,8,19,0.18)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <User className="h-6 w-6 text-rose-100" />
              </div>

              <p className="mt-5 text-xs font-black uppercase tracking-[0.3em] text-rose-200/70">
                Admin nalog
              </p>

              <p className="mt-3 break-all text-lg font-black">
                {adminEmail || "Učitavanje..."}
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-6 w-full rounded-full border-white/15 bg-white/10 text-white hover:bg-white hover:text-[#3b0710]"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Odjava
              </Button>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[1.6rem] border border-[#7a1020]/10 bg-white shadow-[0_14px_40px_rgba(122,16,32,0.07)]">
            <StaffSelector />
          </div>

          <div className="mt-7">
            <div className="mb-5">
              <p className="text-xs font-black uppercase tracking-[0.32em] text-[#a3152d]">
                Navigacija
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24060b]">
                Brzi pristup
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {quickLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group rounded-[1.6rem] border border-[#7a1020]/10 bg-white/95 p-4 shadow-[0_16px_45px_rgba(122,16,32,0.09)] transition hover:-translate-y-1 hover:border-[#7a1020]/25 hover:shadow-[0_24px_65px_rgba(122,16,32,0.14)]"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0ee] text-[#7a1020] transition group-hover:bg-[#7a1020] group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-black text-[#24060b]">
                        {item.title}
                      </h3>
                      <ArrowUpRight className="mt-1 h-4 w-4 text-[#b0182f] opacity-0 transition group-hover:opacity-100" />
                    </div>

                    <p className="mt-3 min-h-12 text-sm leading-6 text-[#6b3b3f]">
                      {item.description}
                    </p>

                    <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-[#a3152d]">
                      Otvori
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
