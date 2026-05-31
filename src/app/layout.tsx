import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: {
    default: "Venecija Butik | Online kolekcija",
    template: "%s | Venecija Butik",
  },
  description:
    "Venecija Butik - online kolekcija odjeće, rezervacije proizvoda i kontakt informacije.",
  keywords: [
    "Venecija Butik",
    "butik",
    "ženska odjeća",
    "elegantna moda",
    "svečana moda",
    "haljine",
    "kompleti",
    "boutique",
  ],
  openGraph: {
    title: "Venecija Butik",
    description:
      "Online kolekcija odjeće, rezervacije proizvoda i informacije o butiku.",
    type: "website",
    locale: "bs_BA",
    siteName: "Venecija Butik",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bs">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
