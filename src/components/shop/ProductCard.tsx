"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

type ProductCardProps = {
  product: {
    id: string;
    slug?: string;
    product_code?: string | null;
    name: string;
    price: number;
    oldPrice?: number;
    category: string;
    categories?: string[] | null;
    description: string;
    sizes: string[];
    image: string;
    isNew: boolean;
  };
  onReserve: () => void;
};

function formatPrice(value: number) {
  return `${Number(value).toFixed(0)} KM`;
}

export function ProductCard({ product, onReserve }: ProductCardProps) {
  const detailHref = product.slug ? `/shop/${product.slug}` : `/shop/${product.id}`;
  const categories =
    product.categories && product.categories.length > 0
      ? product.categories
      : [product.category];

  return (
    <article className="group relative overflow-hidden rounded-[2.25rem] border border-[#7a1020]/10 bg-[#fff7f4] shadow-[0_18px_45px_rgba(122,16,32,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(122,16,32,0.18)]">
      <Link href={detailHref} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#2a0308]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 92vw, 420px"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#2a0308]/75 via-transparent to-transparent opacity-70" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {categories.slice(0, 2).map((category) => (
              <span
                key={category}
                className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#7a1020] backdrop-blur"
              >
                {category}
              </span>
            ))}
          </div>

          {product.isNew ? (
            <div className="absolute right-4 top-4 rounded-full bg-[#b0182f] px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white">
              Novo
            </div>
          ) : null}

          <div className="absolute bottom-4 left-4 right-4 rounded-[1.5rem] border border-white/20 bg-white/90 p-4 backdrop-blur">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h3 className="line-clamp-1 text-xl font-black tracking-[-0.03em] text-[#24060b]">
                  {product.name}
                </h3>
                <p className="mt-1 line-clamp-1 text-xs text-[#7b5155]">
                  {product.product_code || "Venecija butik"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-black text-[#24060b]">
                  {formatPrice(product.price)}
                </p>
                {product.oldPrice ? (
                  <p className="text-xs font-semibold text-neutral-400 line-through">
                    {formatPrice(product.oldPrice)}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <p className="line-clamp-2 min-h-10 text-sm leading-6 text-[#6b3b3f]">
          {product.description || "Dostupan komad iz Venecija butik kolekcije."}
        </p>

        <div className="flex flex-wrap gap-2">
          {product.sizes.length > 0 ? (
            product.sizes.slice(0, 6).map((size) => (
              <span
                key={size}
                className="rounded-full border border-[#7a1020]/15 bg-white px-3 py-1 text-xs font-bold text-[#4a1118]"
              >
                {size}
              </span>
            ))
          ) : (
            <span className="rounded-full border border-[#7a1020]/15 bg-white px-3 py-1 text-xs font-bold text-[#4a1118]">
              Dostupno
            </span>
          )}
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-3">
          <Button
            type="button"
            onClick={onReserve}
            className="rounded-full bg-[#7a1020] text-white shadow-lg shadow-red-950/10 hover:bg-[#4b0711]"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Rezerviši
          </Button>

          <Button
            asChild
            variant="outline"
            className="rounded-full border-[#7a1020]/15 bg-white px-4 text-[#4a1118] hover:bg-[#fff0ee]"
          >
            <Link href={detailHref}>
              <Tag className="mr-2 h-4 w-4" />
              Detalji
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
