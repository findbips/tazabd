import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { CheckCircle2, Copy, PackageCheck, RefreshCw, Search, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getOrder } from "@/lib/orders.functions";
import { formatPrice } from "@/lib/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/order/$code")({
  loader: ({ params }) => getOrder({ data: { code: params.code } }),
  head: () => ({
    meta: [{ title: "Your order · Taza" }, { name: "robots", content: "noindex" }],
  }),
  component: OrderPage,
});

const STEPS = [
  { key: "pending", label: "Received" },
  { key: "confirmed", label: "Confirmed" },
  { key: "shipped", label: "On the way" },
  { key: "delivered", label: "Delivered" },
] as const;

function OrderPage() {
  const order = Route.useLoaderData();
  const { code } = Route.useParams();
  const router = useRouter();

  if (!order) return <NotFound code={code} />;

  const cancelled = order.status === "cancelled";
  const stepIndex = STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <div className="text-center">
        <div
          className={cn(
            "mx-auto mb-5 flex size-20 items-center justify-center rounded-full shadow-card",
            cancelled ? "bg-surface text-accent" : "bg-surface text-primary",
          )}
        >
          {cancelled ? <XCircle className="size-10" /> : <CheckCircle2 className="size-10" />}
        </div>
        <h1 className="font-display text-3xl font-bold text-ink">
          {cancelled ? "Order cancelled" : "Order confirmed"}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-muted">
          {cancelled
            ? "This order was cancelled. Call us if you think this is a mistake."
            : "Thank you! A Taza team member will call you to confirm before dispatch. Pay cash on delivery."}
        </p>
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard?.writeText(order.code);
            toast.success("Order number copied");
          }}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 font-mono text-lg font-semibold tracking-wider text-ink"
          aria-label={`Order number ${order.code}. Copy`}
        >
          {order.code}
          <Copy className="size-4 text-muted" />
        </button>
        <p className="mt-2 text-xs text-muted">Keep this number — you can use it to check your order.</p>
      </div>

      {!cancelled && (
        <ol className="mt-10 grid grid-cols-4 gap-2" aria-label="Order progress">
          {STEPS.map((s, i) => {
            const done = i <= stepIndex;
            return (
              <li key={s.key} className="text-center">
                <div
                  className={cn(
                    "mx-auto mb-2 h-1.5 rounded-full",
                    done ? "bg-primary" : "bg-border",
                  )}
                />
                <span className={cn("text-xs font-medium", done ? "text-ink" : "text-muted")}>
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-10 rounded-2xl border border-border bg-surface p-6 shadow-card">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <PackageCheck className="size-5 text-primary" />
          Order summary
        </h2>
        <ul className="mt-4 divide-y divide-border text-sm">
          {order.items.map((i) => (
            <li key={i.productId} className="flex justify-between gap-3 py-3">
              <span>
                {i.name}
                <span className="block text-xs text-muted">
                  {i.unit} × {i.quantity}
                </span>
              </span>
              <span className="tabular-nums">{formatPrice(i.unitPrice * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-2 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd className="tabular-nums">{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Delivery</dt>
            <dd className="tabular-nums">
              {order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}
            </dd>
          </div>
          <div className="flex justify-between text-base font-bold">
            <dt>Pay on delivery</dt>
            <dd className="tabular-nums">{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-bold">Delivery details</h2>
        <p className="mt-3 text-sm text-muted">
          <span className="font-medium text-fg">{order.customerName}</span>
          <br />
          {order.address}, {order.district}
          <br />
          {order.phone}
        </p>
        {order.note && <p className="mt-3 text-sm text-muted">Note: {order.note}</p>}
        <p className="mt-3 text-xs text-muted">
          Placed{" "}
          {new Date(order.createdAt).toLocaleString("en-GB", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button variant="outline" onClick={() => void router.invalidate()}>
          <RefreshCw className="size-4" />
          Refresh status
        </Button>
        <Button asChild>
          <Link to="/products">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}

function NotFound({ code }: { code: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-surface text-muted">
        <Search className="size-10" />
      </div>
      <h1 className="font-display text-2xl font-bold text-ink">Order not found</h1>
      <p className="mt-2 text-muted">
        We couldn't find an order with the number <span className="font-mono">{code}</span>. Check
        the number and try again.
      </p>
      <form
        className="mt-6 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const next = value.trim();
          if (next) void router.navigate({ to: "/order/$code", params: { code: next } });
        }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="TZ-XXXX-XXXX"
          aria-label="Order number"
          className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-bg px-4 font-mono text-sm uppercase outline-none ring-primary/30 focus:ring-2"
        />
        <Button type="submit">Find order</Button>
      </form>
    </div>
  );
}
