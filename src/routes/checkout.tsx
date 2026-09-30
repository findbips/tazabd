import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cartTotals, useCart } from "@/lib/cart";
import { checkoutSchema, DISTRICTS } from "@/lib/checkout-schema";
import { placeOrder } from "@/lib/orders.functions";
import { formatPrice, FREE_DELIVERY_MIN } from "@/lib/products";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout · Taza" }] }),
  component: CheckoutPage,
});

type FormState = {
  name: string;
  phone: string;
  email: string;
  district: string;
  address: string;
  note: string;
  fax: string; // honeypot
};

const EMPTY: FormState = {
  name: "",
  phone: "",
  email: "",
  district: "",
  address: "",
  note: "",
  fax: "",
};

const fieldClass =
  "w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none ring-primary/30 focus:ring-2 aria-[invalid=true]:border-accent";

function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const { subtotal, delivery, total, count } = cartTotals(items);

  // The cart store skips SSR hydration; wait for it so we don't flash "empty".
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (useCart.persist.hasHydrated()) setHydrated(true);
    return useCart.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  // One key per checkout attempt: a double-click or retry can never create two orders.
  const idempotencyKey = useRef<string>("");
  useEffect(() => {
    idempotencyKey.current = crypto.randomUUID();
  }, []);

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    const payload = {
      idempotencyKey: idempotencyKey.current || crypto.randomUUID(),
      name: form.name,
      phone: form.phone,
      email: form.email,
      district: form.district,
      address: form.address,
      note: form.note,
      fax: form.fax,
      // Only ids + quantities are sent. Prices are recalculated on the server.
      items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
    };

    const check = checkoutSchema.safeParse(payload);
    if (!check.success) {
      const next: Record<string, string> = {};
      for (const issue of check.error.issues) {
        const key = String(issue.path[0] ?? "form");
        next[key] ??= issue.message;
      }
      setErrors(next);
      const first = document.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const result = await placeOrder({ data: payload });
      if (!result.ok) {
        toast.error(result.error);
        setErrors({ form: result.error });
        return;
      }
      clear();
      await navigate({ to: "/order/$code", params: { code: result.code } });
    } catch {
      toast.error("We couldn't reach the store. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return <div className="mx-auto max-w-6xl px-4 py-20 text-center text-muted">Loading…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">Your basket is empty</h1>
        <p className="mt-2 text-muted">Add something from the shop before checking out.</p>
        <Button asChild className="mt-8">
          <Link to="/products">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <Link
        to="/cart"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Back to cart
      </Link>
      <h1 className="font-display text-3xl font-bold text-ink">Checkout</h1>
      <p className="mt-1 text-muted">Cash on delivery — pay when your order arrives.</p>

      <form onSubmit={onSubmit} noValidate className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="space-y-5 rounded-2xl border border-border bg-surface p-6 shadow-card lg:col-span-2 md:p-8">
          <h2 className="text-lg font-bold">Delivery details</h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" id="name" error={errors.name}>
              <input
                id="name"
                autoComplete="name"
                value={form.name}
                onChange={set("name")}
                aria-invalid={Boolean(errors.name)}
                className={fieldClass}
                placeholder="Your name"
              />
            </Field>
            <Field label="Mobile number" id="phone" error={errors.phone}>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={set("phone")}
                aria-invalid={Boolean(errors.phone)}
                className={fieldClass}
                placeholder="01XXXXXXXXX"
              />
            </Field>
          </div>

          <Field label="Email (optional — for your confirmation)" id="email" error={errors.email}>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={set("email")}
              aria-invalid={Boolean(errors.email)}
              className={fieldClass}
              placeholder="you@example.com"
            />
          </Field>

          <Field label="District" id="district" error={errors.district}>
            <select
              id="district"
              value={form.district}
              onChange={set("district")}
              aria-invalid={Boolean(errors.district)}
              className={fieldClass}
            >
              <option value="">Select your district</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Full address" id="address" error={errors.address}>
            <textarea
              id="address"
              rows={3}
              autoComplete="street-address"
              value={form.address}
              onChange={set("address")}
              aria-invalid={Boolean(errors.address)}
              className={`${fieldClass} resize-none`}
              placeholder="House, road, area / thana"
            />
          </Field>

          <Field label="Order note (optional)" id="note" error={errors.note}>
            <textarea
              id="note"
              rows={2}
              value={form.note}
              onChange={set("note")}
              className={`${fieldClass} resize-none`}
              placeholder="Delivery instructions, preferred time…"
            />
          </Field>

          {/* Honeypot: hidden from people, tempting to bots. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="fax">Fax</label>
            <input
              id="fax"
              name="fax"
              tabIndex={-1}
              autoComplete="off"
              value={form.fax}
              onChange={set("fax")}
            />
          </div>

          {errors.form && (
            <p role="alert" className="rounded-xl bg-accent/10 px-4 py-3 text-sm text-accent">
              {errors.form}
            </p>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-surface p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold">
            Your order · {count} item{count === 1 ? "" : "s"}
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate">{product.name}</span>
                  <span className="text-xs text-muted">
                    {product.unit} × {quantity}
                  </span>
                </span>
                <span className="tabular-nums">{formatPrice(product.price * quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-3 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd className="tabular-nums">{delivery === 0 ? "Free" : formatPrice(delivery)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatPrice(total)}</dd>
            </div>
          </dl>
          {subtotal < FREE_DELIVERY_MIN && (
            <p className="mt-3 text-xs text-muted">
              Add {formatPrice(FREE_DELIVERY_MIN - subtotal)} more for free delivery
            </p>
          )}
          <Button type="submit" className="mt-6 w-full" size="lg" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Placing order…
              </>
            ) : (
              `Place order · ${formatPrice(total)}`
            )}
          </Button>
          <ul className="mt-4 space-y-2 text-xs text-muted">
            <li className="flex items-center gap-2">
              <Truck className="size-4 text-primary" />
              Cash on delivery across Bangladesh
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              We'll call to confirm before dispatch
            </li>
          </ul>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-accent" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
