import { Link } from "@tanstack/react-router";
import { Leaf, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatPrice, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-shadow hover:shadow-md">
      <Link
        to="/products/$id"
        params={{ id: product.id }}
        className="relative block aspect-square overflow-hidden bg-bg"
      >
        <img
          src={product.image}
          alt={product.name}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.isOrganic && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-fg">
            <Leaf className="size-3" />
            Organic
          </span>
        )}
        {product.originalPrice && (
          <span className="absolute top-3 right-3 rounded-full bg-accent px-2 py-1 text-xs font-bold text-accent-fg">
            -
            {Math.round(
              ((product.originalPrice - product.price) / product.originalPrice) *
                100,
            )}
            %
          </span>
        )}
      </Link>
      <div className="p-4">
        <div className="mb-1 flex items-center gap-1 text-xs">
          <Star className="size-3.5 fill-accent text-accent" />
          <span className="font-medium">{product.rating}</span>
          <span className="text-muted">({product.reviews})</span>
        </div>
        <Link to="/products/$id" params={{ id: product.id }}>
          <h3 className="line-clamp-1 font-semibold text-ink group-hover:text-primary">
            {product.name}
          </h3>
          <p className="mt-0.5 text-xs text-muted">{product.nameBn}</p>
        </Link>
        <p className="mt-1 text-xs text-muted">
          {product.unit} · {product.origin}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted line-through tabular-nums">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <Button
            size="icon-sm"
            aria-label={`Add ${product.name} to cart`}
            onClick={() => {
              add(product);
              toast.success(`${product.name} added to cart`);
            }}
          >
            <ShoppingCart className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
