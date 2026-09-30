/**
 * Server-only order logic: pricing, persistence, notification emails, admin.
 * Import this ONLY from inside createServerFn handlers (see orders.functions.ts).
 */
import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { dbSource, getSql } from "@/lib/db";
import { env } from "@/lib/env.server";
import {
  checkoutSchema,
  ORDER_STATUSES,
  type OrderStatus,
} from "@/lib/checkout-schema";
import { DELIVERY_FEE, FREE_DELIVERY_MIN, getProductById } from "@/lib/products";

/* ------------------------------------------------------------------ types */

export type OrderItemView = {
  productId: string;
  name: string;
  unit: string;
  unitPrice: number;
  quantity: number;
};

export type OrderView = {
  code: string;
  status: OrderStatus;
  customerName: string;
  phone: string;
  email: string | null;
  district: string;
  address: string;
  note: string | null;
  paymentMethod: "cod";
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  items: OrderItemView[];
};

export type PlaceOrderResult =
  | { ok: true; code: string }
  | { ok: false; error: string };

type OrderRow = {
  id: number;
  code: string;
  status: OrderStatus;
  customer_name: string;
  phone: string;
  email: string | null;
  district: string;
  address: string;
  note: string | null;
  payment_method: "cod";
  subtotal: number;
  delivery_fee: number;
  total: number;
  created_at: Date | string;
};

type ItemRow = {
  order_id: number;
  product_id: string;
  name: string;
  unit: string;
  unit_price: number;
  quantity: number;
};

/* ---------------------------------------------------------------- helpers */

const ORDER_COLUMNS =
  "id, code, status, customer_name, phone, email, district, address, note, payment_method, subtotal, delivery_fee, total, created_at";

/**
 * Orders must never land in the throwaway in-memory PGLite fallback on a real
 * deployment — fail loudly instead of silently losing them.
 */
function assertDatabaseConfigured() {
  const deployed = Boolean(process.env.VERCEL) || process.env.NODE_ENV === "production";
  if (dbSource === "pglite" && deployed) {
    throw new Error(
      "The store database is not configured (DATABASE_URL is missing). Orders cannot be saved.",
    );
  }
}

// Unambiguous characters (no 0/O, 1/I/L) so codes survive being read over the phone.
const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function generateOrderCode(): string {
  const pick = () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  const part = () => Array.from({ length: 4 }, pick).join("");
  return `TZ-${part()}-${part()}`;
}

/** Codes are shown uppercase; accept lowercase / stray spaces from users. */
export function normalizeOrderCode(input: string): string {
  return input.trim().toUpperCase();
}

function toIso(v: Date | string): string {
  return v instanceof Date ? v.toISOString() : new Date(v).toISOString();
}

function maskPhone(phone: string): string {
  return phone.length >= 8 ? `${phone.slice(0, 3)}•••••${phone.slice(-3)}` : "•••";
}

function errorInfo(err: unknown): { code?: string; text: string } {
  const e = err as { code?: string; constraint?: string; detail?: string; message?: string };
  return {
    code: e?.code,
    text: `${e?.constraint ?? ""} ${e?.detail ?? ""} ${e?.message ?? ""}`,
  };
}

async function loadItems(orderIds: number[]): Promise<Map<number, OrderItemView[]>> {
  const map = new Map<number, OrderItemView[]>();
  if (orderIds.length === 0) return map;
  const sql = await getSql();
  const rows = await sql.query<ItemRow>(
    "select order_id, product_id, name, unit, unit_price, quantity from order_items where order_id = any($1::bigint[]) order by id",
    [orderIds],
  );
  for (const r of rows) {
    const list = map.get(r.order_id) ?? [];
    list.push({
      productId: r.product_id,
      name: r.name,
      unit: r.unit,
      unitPrice: r.unit_price,
      quantity: r.quantity,
    });
    map.set(r.order_id, list);
  }
  return map;
}

function toView(row: OrderRow, items: OrderItemView[]): OrderView {
  return {
    code: row.code,
    status: row.status,
    customerName: row.customer_name,
    phone: row.phone,
    email: row.email,
    district: row.district,
    address: row.address,
    note: row.note,
    paymentMethod: row.payment_method,
    subtotal: row.subtotal,
    deliveryFee: row.delivery_fee,
    total: row.total,
    createdAt: toIso(row.created_at),
    items,
  };
}

async function loadOrderByCode(code: string): Promise<OrderView | null> {
  const sql = await getSql();
  const rows = await sql.query<OrderRow>(
    `select ${ORDER_COLUMNS} from orders where code = $1`,
    [code],
  );
  const row = rows[0];
  if (!row) return null;
  const items = await loadItems([row.id]);
  return toView(row, items.get(row.id) ?? []);
}

/* ------------------------------------------------------------ place order */

export async function placeOrderImpl(raw: unknown): Promise<PlaceOrderResult> {
  assertDatabaseConfigured();

  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid order details" };
  }
  const input = parsed.data;
  // Honeypot tripped: pretend success-shaped failure without saving anything.
  if (input.fax) return { ok: false, error: "Could not place order. Please try again." };

  // Merge duplicate lines, then price everything from the server-side catalogue.
  // Client-sent prices are never read.
  const qtyByProduct = new Map<string, number>();
  for (const line of input.items) {
    qtyByProduct.set(line.productId, (qtyByProduct.get(line.productId) ?? 0) + line.quantity);
  }
  const lines: OrderItemView[] = [];
  for (const [productId, quantity] of qtyByProduct) {
    const product = getProductById(productId);
    if (!product) {
      return {
        ok: false,
        error: "An item in your basket is no longer available. Please review your cart.",
      };
    }
    if (!product.inStock) {
      return { ok: false, error: `${product.name} is currently out of stock.` };
    }
    if (quantity > 50) {
      return { ok: false, error: `Maximum 50 per item — please reduce ${product.name}.` };
    }
    lines.push({
      productId,
      name: product.name,
      unit: product.unit,
      unitPrice: Math.round(product.price),
      quantity,
    });
  }
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  const sql = await getSql();

  // Idempotent replay (double-click, retry after a network blip).
  const existing = await sql.query<{ code: string }>(
    "select code from orders where idempotency_key = $1",
    [input.idempotencyKey],
  );
  if (existing[0]) return { ok: true, code: existing[0].code };

  // Basic abuse guard: at most 3 orders per phone number per 10 minutes.
  const recent = await sql.query<{ n: number }>(
    "select count(*) as n from orders where phone = $1 and created_at > now() - interval '10 minutes'",
    [input.phone],
  );
  if ((recent[0]?.n ?? 0) >= 3) {
    return {
      ok: false,
      error: "Too many orders from this number just now. Please call us to add to your order.",
    };
  }

  // One atomic statement: the order row and all its items commit together.
  const insertSql = `
    with o as (
      insert into orders
        (code, idempotency_key, customer_name, phone, email, district, address, note,
         payment_method, subtotal, delivery_fee, total)
      values ($1, $2, $3, $4, $5, $6, $7, $8, 'cod', $9, $10, $11)
      returning id
    ), i as (
      insert into order_items (order_id, product_id, name, unit, unit_price, quantity)
      select o.id, x.product_id, x.name, x.unit, x.unit_price, x.quantity
      from o,
        unnest($12::text[], $13::text[], $14::text[], $15::int[], $16::int[])
          as x(product_id, name, unit, unit_price, quantity)
    )
    select id from o`;

  let code = "";
  for (let attempt = 0; attempt < 5; attempt += 1) {
    code = generateOrderCode();
    try {
      await sql.query(insertSql, [
        code,
        input.idempotencyKey,
        input.name,
        input.phone,
        input.email ?? null,
        input.district,
        input.address,
        input.note ?? null,
        subtotal,
        deliveryFee,
        total,
        lines.map((l) => l.productId),
        lines.map((l) => l.name),
        lines.map((l) => l.unit),
        lines.map((l) => l.unitPrice),
        lines.map((l) => l.quantity),
      ]);
      break;
    } catch (err) {
      const { code: pgCode, text } = errorInfo(err);
      if (pgCode === "23505") {
        if (text.includes("idempotency_key")) {
          // Lost a race with a concurrent identical submit — return that order.
          const again = await sql.query<{ code: string }>(
            "select code from orders where idempotency_key = $1",
            [input.idempotencyKey],
          );
          if (again[0]) return { ok: true, code: again[0].code };
        }
        code = ""; // order-code collision: retry with a fresh code
        continue;
      }
      console.error("[orders] insert failed:", err);
      return { ok: false, error: "We couldn't save your order. Please try again." };
    }
  }
  if (!code) return { ok: false, error: "We couldn't save your order. Please try again." };

  const order = await loadOrderByCode(code);
  if (order) await notifyNewOrder(order);
  return { ok: true, code };
}

/* -------------------------------------------------------- public lookups */

/** Customer-facing view: phone masked, email withheld. */
export async function getPublicOrder(rawCode: string): Promise<OrderView | null> {
  assertDatabaseConfigured();
  const order = await loadOrderByCode(normalizeOrderCode(rawCode));
  if (!order) return null;
  return { ...order, phone: maskPhone(order.phone), email: null };
}

/* ------------------------------------------------------------------ email */

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const taka = (n: number) => `৳${n.toLocaleString("en-US")}`;

function siteUrl(): string | undefined {
  const explicit = env("SITE_URL");
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercelHost = env("VERCEL_PROJECT_PRODUCTION_URL") ?? env("VERCEL_URL");
  return vercelHost ? `https://${vercelHost}` : undefined;
}

function orderEmailHtml(order: OrderView, audience: "customer" | "owner"): string {
  const link = siteUrl() ? `${siteUrl()}/order/${order.code}` : null;
  const rows = order.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0">${esc(i.name)} <span style="color:#5d6f62">(${esc(i.unit)}) × ${i.quantity}</span></td><td style="padding:6px 0;text-align:right">${taka(i.unitPrice * i.quantity)}</td></tr>`,
    )
    .join("");
  const heading =
    audience === "customer"
      ? `Thank you, ${esc(order.customerName)} — we've received your order`
      : `New order ${esc(order.code)}`;
  return `<!doctype html><html><body style="margin:0;background:#f4efe4;font-family:Arial,Helvetica,sans-serif;color:#1c3324">
<div style="max-width:560px;margin:0 auto;padding:24px">
<div style="background:#fffdf8;border-radius:16px;padding:28px">
<h2 style="margin:0 0 4px;font-size:20px">${heading}</h2>
<p style="margin:0 0 20px;color:#5d6f62">Order <strong>${esc(order.code)}</strong> · Cash on delivery</p>
<table style="width:100%;border-collapse:collapse;font-size:14px;border-top:1px solid #d4ddd4;border-bottom:1px solid #d4ddd4">${rows}</table>
<table style="width:100%;font-size:14px;margin-top:12px">
<tr><td>Subtotal</td><td style="text-align:right">${taka(order.subtotal)}</td></tr>
<tr><td>Delivery</td><td style="text-align:right">${order.deliveryFee === 0 ? "Free" : taka(order.deliveryFee)}</td></tr>
<tr><td style="padding-top:8px"><strong>Total to pay on delivery</strong></td><td style="text-align:right;padding-top:8px"><strong>${taka(order.total)}</strong></td></tr>
</table>
<p style="margin:20px 0 4px;font-size:14px"><strong>Deliver to</strong></p>
<p style="margin:0;font-size:14px;color:#5d6f62">${esc(order.customerName)}<br>${esc(order.address)}, ${esc(order.district)}<br>${esc(order.phone)}${order.note ? `<br><em>Note: ${esc(order.note)}</em>` : ""}</p>
${link ? `<p style="margin:24px 0 0"><a href="${esc(link)}" style="background:#1f6a46;color:#f6fbf7;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:bold;font-size:14px">View your order</a></p>` : ""}
</div></div></body></html>`;
}

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = env("RESEND_API_KEY");
  const from = env("RESEND_FROM");
  if (!apiKey || !from) return; // email is optional — orders work without it
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html }),
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

/**
 * Best-effort emails. Awaited (serverless may freeze un-awaited work after the
 * response) but never allowed to fail or delay the order for long.
 */
async function notifyNewOrder(order: OrderView): Promise<void> {
  const jobs: Promise<void>[] = [];
  if (order.email) {
    jobs.push(
      sendEmail(
        order.email,
        `Taza order ${order.code} confirmed`,
        orderEmailHtml(order, "customer"),
      ),
    );
  }
  const owner = env("ORDER_NOTIFY_EMAIL");
  if (owner) {
    jobs.push(
      sendEmail(
        owner,
        `New order ${order.code} — ${taka(order.total)} (${order.district})`,
        orderEmailHtml(order, "owner"),
      ),
    );
  }
  const results = await Promise.allSettled(jobs);
  for (const r of results) {
    if (r.status === "rejected") console.error("[orders] email failed:", r.reason);
  }
}

/* ------------------------------------------------------------------ admin */

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function assertAdmin(password: unknown): Promise<void> {
  const expected = env("ADMIN_PASSWORD");
  if (!expected) throw new Error("Admin is not configured. Set ADMIN_PASSWORD on the server.");
  const given = typeof password === "string" ? password : "";
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  if (!timingSafeEqual(a, b)) {
    await sleep(600); // slow down guessing
    throw new Error("Wrong password");
  }
}

export async function adminListOrders(password: unknown): Promise<OrderView[]> {
  await assertAdmin(password);
  assertDatabaseConfigured();
  const sql = await getSql();
  const rows = await sql.query<OrderRow>(
    `select ${ORDER_COLUMNS} from orders order by created_at desc limit 100`,
  );
  const items = await loadItems(rows.map((r) => r.id));
  return rows.map((r) => toView(r, items.get(r.id) ?? []));
}

export async function adminSetStatus(
  password: unknown,
  rawCode: unknown,
  status: unknown,
): Promise<{ ok: boolean }> {
  await assertAdmin(password);
  assertDatabaseConfigured();
  if (typeof rawCode !== "string" || !ORDER_STATUSES.includes(status as OrderStatus)) {
    throw new Error("Invalid request");
  }
  const sql = await getSql();
  const rows = await sql.query<{ code: string }>(
    "update orders set status = $1, updated_at = now() where code = $2 returning code",
    [status, normalizeOrderCode(rawCode)],
  );
  return { ok: rows.length > 0 };
}
