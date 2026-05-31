import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: {
    default: "Venecija butik | Online kolekcija",
    template: "%s | Venecija butik",
  },
  description:
    "Venecija butik - online kolekcija odjeće, rezervacije proizvoda i kontakt informacije.",
  keywords: [
    "Venecija butik",
    "butik",
    "ženska odjeća",
    "elegantna moda",
    "svečana moda",
    "haljine",
    "kompleti",
    "boutique",
  ],
  openGraph: {
    title: "Venecija butik",
    description:
      "Online kolekcija odjeće, rezervacije proizvoda i informacije o butiku.",
    type: "website",
    locale: "bs_BA",
    siteName: "Venecija butik",
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
