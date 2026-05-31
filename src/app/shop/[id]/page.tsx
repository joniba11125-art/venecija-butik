"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  PackageCheck,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Truck,
  ZoomIn,
  ZoomOut,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/shop/ProductCard";
import { ReservationModal } from "@/components/shop/ReservationModal";

type ProductImage = {
  image_url: string;
  alt_text: string | null;
  sort_order: number | null;
};

type Product = {
  id: string;
  product_code: string | null;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  categories: string[] | null;
  price: number;
  old_price: number | null;
  sizes: string[] | null;
  colors: string[] | null;
  is_featured: boolean | null;
  is_active: boolean | null;
  stock: number | null;
  product_images: ProductImage[];
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function mapProductForCard(product: Product) {
  const firstImage = product.product_images?.[0];

  return {
    id: product.id,
    product_code: product.product_code,
    name: product.name,
    category: product.category,
    categories: product.categories ?? [product.category],
    price: product.price,
    oldPrice: product.old_price ?? undefined,
    description: product.description ?? "",
    image: firstImage?.image_url ?? "/placeholder.png",
    sizes: product.sizes ?? [],
    isNew: false,
  };
}

function getLegacySlug(value: string) {
  if (value === "1") {
    return "elegantna-bez-haljina";
  }

  if (value === "2") {
    return "crni-oversized-sako";
  }

  if (value === "3") {
    return "bijela-basic-kosulja";
  }

  return value;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  );
}

export default function ProductDetailPage({ params }: PageProps) {
  const routeParams = useParams<{ id: string }>();
  const resolvedParams = {
    id: String(routeParams.id ?? ""),
  };
  const supabase = createClient();

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [selectedReservationProduct, setSelectedReservationProduct] =
    useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const lightboxFrameRef = useRef<HTMLDivElement | null>(null);
  const lightboxImageRef = useRef<HTMLImageElement | null>(null);
  const [imagePan, setImagePan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{
    x: number;
    y: number;
    panX: number;
    panY: number;
  } | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
const [selectedSize, setSelectedSize] = useState("");
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);

      const productKey = getLegacySlug(resolvedParams.id);

      const { data, error } = await supabase
        .from("products")
        .select(
          "id, product_code, name, slug, description, category, categories, price, old_price, sizes, colors, is_featured, is_active, stock, product_images(image_url, alt_text, sort_order)"
        )
        .eq("is_active", true)
        .or(`id.eq.${productKey},slug.eq.${productKey}`)
        .limit(1);

      if (error || !data || data.length === 0) {
        console.error("Greška pri učitavanju proizvoda:", error?.message);
        setProduct(null);
        setIsLoading(false);
        return;
      }

      const loadedProduct = data[0] as Product;

      setProduct(loadedProduct);
      setSelectedReservationProduct(loadedProduct);
      setSelectedImage(loadedProduct.product_images?.[0]?.image_url ?? "");
      setSelectedSize(loadedProduct.sizes?.[0] ?? "");

      const { data: similarData, error: similarError } = await supabase
        .from("products")
        .select(
          "id, product_code, name, slug, description, category, categories, price, old_price, sizes, colors, is_featured, is_active, stock, product_images(image_url, alt_text, sort_order)"
        )
        .eq("is_active", true)
        .eq("category", loadedProduct.category)
        .neq("id", loadedProduct.id)
        .limit(3);

      if (similarError) {
        console.error(
          "Greška pri učitavanju sličnih proizvoda:",
          similarError.message
        );
        setSimilarProducts([]);
      } else {
        setSimilarProducts((similarData as Product[]) ?? []);
      }

      setIsLoading(false);
    }

    loadProduct();
  }, [resolvedParams.id, supabase]);

  const images = useMemo(() => {
    if (!product) {
      return [];
    }

    return product.product_images
      .slice()
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }, [product]);

  function openReservation(targetProduct: Product) {
    setSelectedReservationProduct(targetProduct);
    setIsReservationOpen(true);
  }

  function openImagePreview() {
    setImageZoom(1);
    setImagePan({ x: 0, y: 0 });
    setIsImagePreviewOpen(true);
  }

  function closeImagePreview() {
    setIsImagePreviewOpen(false);
    setImageZoom(1);
    setImagePan({ x: 0, y: 0 });
    setIsPanning(false);
    setPanStart(null);
  }


  function showNextImage() {
    if (images.length <= 1) {
      return;
    }

    const currentIndex = images.findIndex((image) => image.image_url === selectedImage);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % images.length;

    setSelectedImage(images[nextIndex].image_url);
    setImageZoom(1);
    setImagePan({ x: 0, y: 0 });
  }

  function showPreviousImage() {
    if (images.length <= 1) {
      return;
    }

    const currentIndex = images.findIndex((image) => image.image_url === selectedImage);
    const previousIndex =
      currentIndex <= 0 ? images.length - 1 : currentIndex - 1;

    setSelectedImage(images[previousIndex].image_url);
    setImageZoom(1);
    setImagePan({ x: 0, y: 0 });
  }

  function handleLightboxTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (imageZoom > 1 || touchStartX === null) {
      return;
    }

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
    const distance = touchStartX - touchEndX;

    if (Math.abs(distance) > 45) {
      if (distance > 0) {
        showNextImage();
      } else {
        showPreviousImage();
      }
    }

    setTouchStartX(null);
  }


  function clampImagePan(nextPan: { x: number; y: number }) {
    const frame = lightboxFrameRef.current;
    const image = lightboxImageRef.current;

    if (!frame || !image || imageZoom <= 1) {
      return { x: 0, y: 0 };
    }

    const frameWidth = frame.clientWidth;
    const frameHeight = frame.clientHeight;

    const imageWidth = image.clientWidth * imageZoom;
    const imageHeight = image.clientHeight * imageZoom;

    const maxX = Math.max(0, (imageWidth - frameWidth) / 2);
    const maxY = Math.max(0, (imageHeight - frameHeight) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, nextPan.x)),
      y: Math.min(maxY, Math.max(-maxY, nextPan.y)),
    };
  }

  function getLightboxPoint(event: any) {
    if ("touches" in event && event.touches?.[0]) {
      return {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    }

    if ("changedTouches" in event && event.changedTouches?.[0]) {
      return {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY,
      };
    }

    return {
      x: event.clientX,
      y: event.clientY,
    };
  }

  function handlePanStart(event: any) {
    if (imageZoom <= 1) {
      return;
    }

    event.preventDefault?.();

    const point = getLightboxPoint(event);

    setIsPanning(true);
    setPanStart({
      x: point.x,
      y: point.y,
      panX: imagePan.x,
      panY: imagePan.y,
    });
  }

  function handlePanMove(event: any) {
    if (!isPanning || !panStart || imageZoom <= 1) {
      return;
    }

    event.preventDefault?.();

    const point = getLightboxPoint(event);

    const panSpeed = 1.7;

    setImagePan(
      clampImagePan({
        x: panStart.panX + (point.x - panStart.x) * panSpeed,
        y: panStart.panY + (point.y - panStart.y) * panSpeed,
      })
    );
  }

  function handlePanEnd() {
    setIsPanning(false);
    setPanStart(null);
  }

  function resetImageView() {
    setImageZoom(1);
    setImagePan({ x: 0, y: 0 });
    setIsPanning(false);
    setPanStart(null);
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#fffaf0] px-4 py-16">
        <div className="mx-auto max-w-7xl rounded-3xl border bg-white p-10 text-center text-neutral-600">
          Učitavanje proizvoda...
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#fffaf0] px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border bg-white p-10 text-center">
          <h1 className="text-3xl font-semibold text-neutral-950">
            Proizvod nije pronađen
          </h1>
          <p className="mt-3 text-neutral-600">
            Proizvod koji tražiš ne postoji ili više nije aktivan.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link href="/shop">Nazad na shop</Link>
          </Button>
        </div>
      </main>
    );
  }

  const cardProduct = mapProductForCard(product);
  const mainImage = selectedImage || cardProduct.image;

  return (
    <main className="min-h-screen bg-[#fffaf0]">
      <section className="relative overflow-hidden bg-[#061537] px-4 py-8 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-8%] top-[-30%] h-80 w-80 rounded-full bg-[#d4af37]/25 blur-3xl" />
          <div className="absolute right-[-10%] top-[10%] h-96 w-96 rounded-full bg-[#d4af37]/15 blur-3xl" />
          <div className="absolute left-10 top-12 h-32 w-32 rotate-45 border border-[#d4af37]/20" />
          <div className="absolute right-24 bottom-10 h-44 w-44 rotate-45 border border-[#d4af37]/15" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <Button asChild variant="ghost" className="mb-6 text-white hover:bg-white/10 hover:text-white">
            <Link href="/shop">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Nazad na shop
            </Link>
          </Button>

          <p className="text-sm uppercase tracking-[0.35em] text-amber-200/80">
            Venecija butik
          </p>

          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
            {product.name}
          </h1>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="relative overflow-hidden rounded-[2rem] border bg-white shadow-xl">
                <Image
                  src={mainImage}
                  alt={product.name}
                  width={1000}
                  height={1200}
                  className="h-[560px] w-full cursor-zoom-in object-cover md:h-[720px]"
                  onClick={openImagePreview}
                  priority
                />

                <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#b8912f] shadow-sm backdrop-blur">
                  {product.category}
                </div>

                <button
                  type="button"
                  onClick={openImagePreview}
                  className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-neutral-950 shadow-lg backdrop-blur transition hover:bg-white"
                >
                  <ZoomIn className="h-4 w-4" />
                  Uvećaj sliku
                </button>
              </div>

              {images.length > 1 ? (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {images.map((image) => (
                    <button
                      key={image.image_url}
                      type="button"
                      onClick={() => setSelectedImage(image.image_url)}
                      className={
                        selectedImage === image.image_url
                          ? "overflow-hidden rounded-2xl border-2 border-[#d4af37] bg-white p-1"
                          : "overflow-hidden rounded-2xl border bg-white p-1"
                      }
                    >
                      <Image
                        src={image.image_url}
                        alt={image.alt_text ?? product.name}
                        width={240}
                        height={280}
                        className="h-28 w-full rounded-xl object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-[2rem] border bg-white p-7 shadow-sm md:p-8">
                <Badge className="mb-4 w-fit bg-[#061537] text-white hover:bg-[#061537]">
                  {product.category}
                </Badge>

                <h2 className="text-3xl font-semibold tracking-tight text-neutral-950 md:text-5xl">
                  {product.name}
                </h2>

                <div className="mt-5 flex flex-wrap items-end gap-3">
                  <p className="text-4xl font-bold text-neutral-950">
                    {product.price.toFixed(0)} KM
                  </p>

                  {product.old_price ? (
                    <p className="pb-1 text-xl text-neutral-400 line-through">
                      {product.old_price.toFixed(0)} KM
                    </p>
                  ) : null}
                </div>

                <p className="mt-6 text-base leading-8 text-neutral-600">
                  {product.description ||
                    "Elegantni komad iz Venecija butik kolekcije, pažljivo odabran za moderan i svečan stil."}
                </p>

                <div className="mt-8">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    Veličina
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {(product.sizes ?? []).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={
                          selectedSize === size
                            ? "min-w-12 rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white"
                            : "min-w-12 rounded-full border bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                        }
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {product.colors && product.colors.length > 0 ? (
                  <div className="mt-8">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      Boje
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <span
                          key={color}
                          className="rounded-full border bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-700"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border bg-[#fffaf0] p-4">
                    <PackageCheck className="mb-3 h-5 w-5 text-[#b8912f]" />
                    <p className="text-sm font-semibold text-neutral-950">
                      Dostava 11,00 KM
                    </p>
                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      Isporuka 1-3 radna dana.
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-[#fffaf0] p-4">
                    <RotateCcw className="mb-3 h-5 w-5 text-[#b8912f]" />
                    <p className="text-sm font-semibold text-neutral-950">
                      Zamjena 24h
                    </p>
                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      Povrate ne radimo.
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-[#fffaf0] p-4">
                    <MapPin className="mb-3 h-5 w-5 text-[#b8912f]" />
                    <p className="text-sm font-semibold text-neutral-950">
                      Butik Tuzla
                    </p>
                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      Irac, Rudarska 50.
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-[#fffaf0] p-4">
                    <Sparkles className="mb-3 h-5 w-5 text-[#b8912f]" />
                    <p className="text-sm font-semibold text-neutral-950">
                      Premium stil
                    </p>
                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      Elegantno i svečano.
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-3 text-sm text-neutral-600">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#b8912f]" />
                    Nakon rezervacije butik vas kontaktira za potvrdu narudžbe.
                  </div>

                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#b8912f]" />
                    Dozvoljeno otvaranje paketa pri dostavi.
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    size="lg"
                    className="w-full rounded-full px-8"
                    onClick={() => openReservation(product)}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Rezerviši proizvod
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {similarProducts.length > 0 ? (
            <div className="mt-20">
              <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="mb-2 text-sm uppercase tracking-[0.3em] text-[#b8912f]">
                    Slično
                  </p>
                  <h2 className="text-3xl font-semibold text-neutral-950 md:text-4xl">
                    Možda ti se svidi
                  </h2>
                </div>

                <Button asChild variant="outline" className="rounded-full">
                  <Link href="/shop">Pogledaj sve</Link>
                </Button>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {similarProducts.map((similarProduct) => (
                  <ProductCard
                    key={similarProduct.id}
                    product={mapProductForCard(similarProduct)}
                    onReserve={() => openReservation(similarProduct)}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {isImagePreviewOpen ? (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-4"
          onTouchStart={(event) => setTouchStartX(event.touches[0]?.clientX ?? null)}
          onTouchEnd={handleLightboxTouchEnd}
        >
          <button
            type="button"
            onClick={closeImagePreview}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20"
            aria-label="Zatvori sliku"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="absolute left-1/2 top-4 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/10 p-2 backdrop-blur">
            <button
              type="button"
              onClick={() => {
                setImageZoom((value) => {
                  const nextZoom = Math.max(1, value - 0.25);

                  if (nextZoom === 1) {
                    setImagePan({ x: 0, y: 0 });
                  }

                  return nextZoom;
                });
              }}
              className="rounded-full bg-white px-3 py-2 text-neutral-950 shadow"
              aria-label="Smanji"
            >
              <ZoomOut className="h-4 w-4" />
            </button>

            <span className="min-w-14 text-center text-sm font-semibold text-white">
              {Math.round(imageZoom * 100)}%
            </span>

            <button
              type="button"
              onClick={() => setImageZoom((value) => {
                  const nextZoom = Math.min(3, value + 0.25);
                  setImagePan({ x: 0, y: 0 });
                  return nextZoom;
                })}
              className="rounded-full bg-white px-3 py-2 text-neutral-950 shadow"
              aria-label="Uvećaj"
            >
              <ZoomIn className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={resetImageView}
              className="rounded-full bg-white px-3 py-2 text-neutral-950 shadow"
              aria-label="Resetuj zoom"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>


          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={showPreviousImage}
                className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur transition hover:bg-white/25 md:inline-flex"
                aria-label="Prethodna slika"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>

              <button
                type="button"
                onClick={showNextImage}
                className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur transition hover:bg-white/25 md:inline-flex"
                aria-label="Sljedeća slika"
              >
                <ChevronRight className="h-7 w-7" />
              </button>

              <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur md:hidden">
                Prevuci lijevo/desno za slike • Zoom pa pomjeri prstom
              </div>
            </>
          ) : null}

          <div
            ref={lightboxFrameRef}
            className={
              imageZoom > 1
                ? "max-h-[88vh] max-w-[96vw] overflow-hidden rounded-2xl bg-black/20 cursor-grab touch-none active:cursor-grabbing"
                : "max-h-[88vh] max-w-[96vw] overflow-hidden rounded-2xl bg-black/20 touch-none"
            }
            onMouseDown={handlePanStart}
            onMouseMove={handlePanMove}
            onMouseUp={handlePanEnd}
            onMouseLeave={handlePanEnd}
            onTouchStart={imageZoom > 1 ? handlePanStart : undefined}
            onTouchMove={imageZoom > 1 ? handlePanMove : undefined}
            onTouchEnd={handlePanEnd}
          >
            <img
              ref={lightboxImageRef}
              src={mainImage}
              alt={product.name}
              className="block max-h-[88vh] max-w-[96vw] select-none object-contain transition-transform duration-200"
              style={{
                transform: `translate(${imagePan.x}px, ${imagePan.y}px) scale(${imageZoom})`,
                transformOrigin: "center center",
              }}
              draggable={false}
            />
          </div>
        </div>
      ) : null}

      {selectedReservationProduct ? (
        <ReservationModal
          product={mapProductForCard(selectedReservationProduct)}
          open={isReservationOpen}
          onOpenChange={setIsReservationOpen}
        />
      ) : null}
    </main>
  );
}



