import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cartTotals, useCart } from "@/lib/cart";
import { formatPrice, FREE_DELIVERY_MIN } from "@/lib/products";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const { count, subtotal, delivery, total } = cartTotals(items);
  const [placed, setPlaced] = useState(false);

  if (placed) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-surface text-primary shadow-card">
          <ShoppingBag className="size-10" />
        </div>
        <h1 className="font-display text-3xl font-bold text-ink">
          Order received
        </h1>
        <p className="mt-3 text-muted">
          Thank you. A Taza rider will confirm by phone. Pay cash on delivery.
        </p>
        <Button asChild className="mt-8">
          <Link to="/products">Continue shopping</Link>
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-surface text-muted">
          <ShoppingBag className="size-10" />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink">
          Your basket is empty
        </h1>
        <p className="mt-2 text-muted">
          Add some organic goodness from Bangladeshi farms.
        </p>
        <Button asChild className="mt-8">
          <Link to="/products">
            Browse products
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <h1 className="font-display text-3xl font-bold text-ink">Shopping cart</h1>
      <p className="mt-1 text-muted">
        {count} item{count === 1 ? "" : "s"}
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm"
            >
              <Link
                to="/products/$id"
                params={{ id: product.id }}
                className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-bg sm:size-28"
              >
                <img
                  src={product.image}
                  alt=""
                  className="size-full object-cover"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2">
                  <div>
                    <Link
                      to="/products/$id"
                      params={{ id: product.id }}
                      className="line-clamp-1 font-semibold hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted">
                      {product.unit} · {product.origin}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="size-11 text-muted hover:text-accent"
                    aria-label={`Remove ${product.name}`}
                    onClick={() => remove(product.id)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center overflow-hidden rounded-full border border-border">
                    <button
                      type="button"
                      className="flex size-9 items-center justify-center"
                      aria-label="Decrease"
                      onClick={() => setQty(product.id, quantity - 1)}
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      className="flex size-9 items-center justify-center"
                      aria-label="Increase"
                      onClick={() => setQty(product.id, quantity + 1)}
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <span className="font-bold tabular-nums">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="text-sm text-muted hover:text-accent"
            onClick={() => clear()}
          >
            Clear cart
          </button>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-surface p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold">Order summary</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd className="tabular-nums">
                {delivery === 0 ? "Free" : formatPrice(delivery)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatPrice(total)}</dd>
            </div>
          </dl>
          {subtotal < FREE_DELIVERY_MIN && (
            <p className="mt-3 text-xs text-muted">
              Add {formatPrice(FREE_DELIVERY_MIN - subtotal)} more for free
              delivery
            </p>
          )}
          <Button
            className="mt-6 w-full"
            size="lg"
            onClick={() => {
              clear();
              setPlaced(true);
              toast.success("Order placed — cash on delivery");
            }}
          >
            Place order (COD)
          </Button>
          <p className="mt-3 text-center text-xs text-muted">
            Cash on delivery across Bangladesh
          </p>
        </aside>
      </div>
    </div>
  );
}
