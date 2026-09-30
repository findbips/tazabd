# Deploying Taza to Vercel

## 1. Database (required)
Orders are stored in Postgres. Easiest: in Vercel, open your project → **Storage** →
add **Neon** (Marketplace). It sets `DATABASE_URL` for you.
Any Postgres works — for Supabase use the *pooler* connection string, and add
`?sslmode=no-verify` if you get a certificate error.

The tables (`orders`, `order_items`) are created automatically during each build
(`npm run build` runs `migrations/*.sql`). If `DATABASE_URL` is missing the build
**fails on purpose**, so you never launch a store that silently loses orders.

## 2. Environment variables
See `.env.example`. Minimum: `DATABASE_URL` and `ADMIN_PASSWORD`.
Emails (optional): `RESEND_API_KEY`, `RESEND_FROM`, `ORDER_NOTIFY_EMAIL`, `SITE_URL`.
Set them for Production (and Preview if you want previews to take test orders —
use a separate Neon branch so test orders don't mix with real ones).

## 3. Deploy
Push to GitHub → import the repo in Vercel → Deploy. No build settings to change.

## 4. Check it works
1. Add an item, go to **Checkout**, place an order → you land on `/order/TZ-XXXX-XXXX`.
2. Open `/admin/orders`, sign in with `ADMIN_PASSWORD`, change the order status.
3. Refresh the customer's order page — the progress bar follows the status.

## How it works
- Checkout sends only product ids + quantities. **Prices, stock and delivery fee are
  recalculated on the server** from `src/lib/products.ts` (client prices are ignored).
- Each checkout has an idempotency key, so double-clicks never create duplicate orders.
- Max 3 orders per phone number per 10 minutes; a hidden honeypot field catches bots.
- The order page shows the phone number masked; the full details are only in `/admin/orders`.
- The product catalogue lives in code: to change prices/stock, edit `src/lib/products.ts` and redeploy.
- Payment is cash on delivery only.
