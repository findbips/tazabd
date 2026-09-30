# Taza — Organic & Natural Products Ecommerce

**Taza** (তাজা) is a modern Next.js ecommerce website for organic and natural products targeted at the Bangladeshi market.

## Features

- 🌿 Green-themed branding with nature-inspired design
- 🛒 Full shopping cart with localStorage persistence
- 📦 Product catalog with categories (Fruits, Vegetables, Honey, Spices, Grains, Oils, Dairy, Beauty)
- 🇧🇩 Bangladesh-focused: BDT pricing (৳), local origins, Bengali product names
- 📱 Fully responsive design
- ⚡ Built with Next.js 15 (App Router), TypeScript & Tailwind CSS

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
taza/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Homepage
│   │   ├── products/         # Product listing & detail
│   │   ├── cart/             # Shopping cart
│   │   ├── about/            # About page
│   │   └── contact/          # Contact page
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   └── CartContext.tsx
│   └── lib/
│       └── products.ts       # Product data & helpers
├── public/
└── ...
```

## Tech Stack

- **Next.js 15** — React framework
- **TypeScript** — Type safety
- **Tailwind CSS** — Utility-first styling
- **Lucide React** — Icons
- **Unsplash** — Product images (demo)

## Brand Colors

| Name     | Hex       | Usage          |
|----------|-----------|----------------|
| Taza 600 | `#16a34a` | Primary green  |
| Taza 800 | `#166534` | Dark text      |
| Taza 50  | `#f0fdf4` | Light backgrounds |

## Notes

- This is a frontend demo. Checkout is simulated (no payment gateway).
- Cart data is stored in browser localStorage.
- Product images are from Unsplash for demonstration purposes.
- For production: connect a real backend, payment (bKash/Nagad), and inventory system.

---

Made with 💚 for Bangladesh
