import { createFileRoute } from "@tanstack/react-router";
import { Loader2, LogOut, RefreshCw } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/checkout-schema";
import { adminOrders, adminUpdateStatus } from "@/lib/orders.functions";
import type { OrderView } from "@/lib/orders.server";
import { formatPrice } from "@/lib/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Orders · Taza admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminOrders,
});

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: "bg-accent/15 text-accent",
  confirmed: "bg-primary/15 text-primary",
  shipped: "bg-leaf/20 text-primary",
  delivered: "bg-primary text-primary-fg",
  cancelled: "bg-border text-muted",
};

function AdminOrders() {
  // Kept in memory only — never written to storage. Reload = sign in again.
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<OrderView[] | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (pw: string) => {
    setLoading(true);
    try {
      setOrders(await adminOrders({ data: { password: pw } }));
    } catch (err) {
      setOrders(null);
      toast.error(err instanceof Error ? err.message : "Could not load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  async function changeStatus(code: string, status: OrderStatus) {
    try {
      await adminUpdateStatus({ data: { password, code, status } });
      setOrders(
        (prev) => prev?.map((o) => (o.code === code ? { ...o, status } : o)) ?? prev,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update status");
    }
  }

  if (!orders) {
    return (
      <div className="mx-auto max-w-sm px-4 py-20">
        <h1 className="font-display text-2xl font-bold text-ink">Orders</h1>
        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void load(password);
          }}
        >
          <label htmlFor="admin-password" className="text-sm font-medium">
            Admin password
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-bg px-4 text-sm outline-none ring-primary/30 focus:ring-2"
          />
          <Button type="submit" className="w-full" disabled={loading || !password}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            Sign in
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink">
          Orders <span className="text-base font-normal text-muted">({orders.length})</span>
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => void load(password)} disabled={loading}>
            <RefreshCw className={cn("size-4", loading && "animate-spin")} />
            Refresh
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setOrders(null);
              setPassword("");
            }}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </div>

      {orders.length === 0 && <p className="mt-10 text-center text-muted">No orders yet.</p>}

      <ul className="mt-6 space-y-4">
        {orders.map((o) => (
          <li key={o.code} className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-sm font-semibold">{o.code}</p>
                <p className="text-xs text-muted">
                  {new Date(o.createdAt).toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold capitalize",
                    STATUS_STYLE[o.status],
                  )}
                >
                  {o.status}
                </span>
                <select
                  aria-label={`Status for ${o.code}`}
                  value={o.status}
                  onChange={(e) => void changeStatus(o.code, e.target.value as OrderStatus)}
                  className="h-9 rounded-lg border border-border bg-bg px-2 text-sm capitalize"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
              <div>
                <p className="font-medium">{o.customerName}</p>
                <p className="text-muted">
                  <a href={`tel:${o.phone}`} className="hover:text-primary">
                    {o.phone}
                  </a>
                  {o.email && <> · {o.email}</>}
                </p>
                <p className="mt-1 text-muted">
                  {o.address}, {o.district}
                </p>
                {o.note && <p className="mt-1 italic text-muted">“{o.note}”</p>}
              </div>
              <div>
                <ul className="space-y-1">
                  {o.items.map((i) => (
                    <li key={i.productId} className="flex justify-between gap-3">
                      <span>
                        {i.name} <span className="text-muted">({i.unit}) × {i.quantity}</span>
                      </span>
                      <span className="tabular-nums">{formatPrice(i.unitPrice * i.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 flex justify-between border-t border-border pt-2 font-bold">
                  <span>COD total</span>
                  <span className="tabular-nums">{formatPrice(o.total)}</span>
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
