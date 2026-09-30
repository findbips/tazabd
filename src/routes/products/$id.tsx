import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Leaf, MapPin, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatPrice, getProductById, products } from "@/lib/products";

export const Route = createFileRoute("/products/$id")({
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const product = getProductById(id);
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);

  if (!product) {
    throw notFound();
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <Link
        to="/products"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Back to products
      </Link>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-bg">
          <img
            src={product.image}
            alt={product.name}
            className="size-full object-cover"
          />
          {product.isOrganic && (
            <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-primary-fg">
              <Leaf className="size-4" />
              Certified organic
            </span>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-sm">
            <Star className="size-4 fill-accent text-accent" />
            <span className="font-medium">{product.rating}</span>
            <span className="text-muted">· {product.reviews} reviews</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-1 text-lg text-muted">{product.nameBn}</p>
          <p className="mt-3 flex items-center gap-2 text-sm text-muted">
            <MapPin className="size-4" />
            Origin: {product.origin}
            <span aria-hidden>|</span>
            {product.unit}
          </p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-muted line-through tabular-nums">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="rounded-full bg-accent/15 px-2 py-1 text-xs font-bold text-accent">
                  Save {formatPrice(product.originalPrice - product.price)}
                </span>
              </>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-fg">{product.description}</p>
          <p className="mt-2 text-sm italic text-muted">
            {product.descriptionBn}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center overflow-hidden rounded-full border border-border">
              <button
                type="button"
                className="flex size-11 items-center justify-center hover:bg-bg"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center font-semibold tabular-nums">
                {qty}
              </span>
              <button
                type="button"
                className="flex size-11 items-center justify-center hover:bg-bg"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
              >
                <Plus className="size-4" />
              </button>
            </div>
            <Button
              size="lg"
              onClick={() => {
                add(product, qty);
                toast.success(`${product.name} added to cart`);
              }}
            >
              <ShoppingCart className="size-5" />
              Add to cart
            </Button>
          </div>

          <p className="mt-4 flex items-center gap-1.5 text-sm text-muted">
            <span className="size-2 rounded-full bg-leaf" />
            In stock — ready to ship · Cash on delivery
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display mb-6 text-2xl font-bold text-ink">
            You may also like
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
