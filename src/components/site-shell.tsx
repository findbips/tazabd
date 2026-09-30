import { Link, useRouterState } from "@tanstack/react-router";
import {
  Facebook,
  Instagram,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  X,
  Youtube,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cartTotals, useCart } from "@/lib/cart";
import { products } from "@/lib/products";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = useCart((s) => s.items);
  const { count } = cartTotals(items);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);

  const hits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 1) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameBn.includes(query.trim()) ||
          p.origin.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [query]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-fg shadow-sm">
              <Leaf className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="font-display block text-xl font-bold tracking-tight text-ink">
                Taza
              </span>
              <span className="hidden text-[0.65rem] font-medium tracking-wide text-muted sm:block">
                তাজা · Organic Bangladesh
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "text-sm font-medium text-muted transition-colors hover:text-primary",
                  pathname === item.to && "text-primary",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Search products"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <Search className="size-5" />
            </Button>
            <Link
              to="/cart"
              className="relative flex size-11 items-center justify-center rounded-full text-fg hover:bg-bg"
              aria-label="Cart"
            >
              <ShoppingCart className="size-5" />
              {count > 0 && (
                <span className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-primary text-[0.65rem] font-bold text-primary-fg">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-border bg-surface">
            <div className="mx-auto max-w-6xl px-4 py-4">
              <label className="sr-only" htmlFor="site-search">
                Search products
              </label>
              <input
                id="site-search"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search mango, honey, Rajshahi…"
                className="h-12 w-full rounded-xl border border-border bg-bg px-4 text-sm outline-none ring-primary/30 focus:ring-2"
              />
              {hits.length > 0 && (
                <ul className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
                  {hits.map((p) => (
                    <li key={p.id}>
                      <Link
                        to="/products/$id"
                        params={{ id: p.id }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-bg"
                      >
                        <img
                          src={p.image}
                          alt=""
                          className="size-10 rounded-lg object-cover"
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">
                            {p.name}
                          </span>
                          <span className="text-xs text-muted">{p.origin}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {open && (
          <nav className="border-t border-border bg-surface px-4 py-3 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block rounded-lg px-3 py-3 text-sm font-medium hover:bg-bg"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <SiteFooter
        onSubscribe={(email) => {
          toast.success(`Welcome to Taza — we'll write to ${email}`);
        }}
      />
    </div>
  );
}

function SiteFooter({ onSubscribe }: { onSubscribe: (email: string) => void }) {
  const [email, setEmail] = useState("");

  return (
    <footer className="mt-8 bg-ink text-primary-fg">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-leaf">
              <Leaf className="size-4" />
            </span>
            <span className="font-display text-xl font-bold">Taza</span>
          </div>
          <p className="text-sm leading-relaxed text-primary-fg/75">
            Pure organic & natural products from Bangladeshi farms. Fresh,
            chemical-free, and full of life.
          </p>
          <p className="font-display text-sm italic text-leaf">
            তাজা · খাঁটি · প্রাকৃতিক
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">
            Shop
          </h3>
          <ul className="space-y-2 text-sm text-primary-fg/75">
            <li>
              <Link to="/products" className="hover:text-primary-fg">
                All products
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                search={{ category: "fruits" }}
                className="hover:text-primary-fg"
              >
                Organic fruits
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                search={{ category: "honey" }}
                className="hover:text-primary-fg"
              >
                Pure honey
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                search={{ category: "spices" }}
                className="hover:text-primary-fg"
              >
                Natural spices
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">
            Visit
          </h3>
          <ul className="space-y-3 text-sm text-primary-fg/75">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-leaf" />
              House 12, Road 5, Dhanmondi, Dhaka 1205
            </li>
            <li className="flex gap-2">
              <Phone className="size-4 shrink-0 text-leaf" />
              +880 1712-345678
            </li>
            <li className="flex gap-2">
              <Mail className="size-4 shrink-0 text-leaf" />
              hello@taza.com.bd
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">
            Harvest notes
          </h3>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.trim()) return;
              onSubscribe(email.trim());
              setEmail("");
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              suppressHydrationWarning
              className="h-11 w-full rounded-full border border-primary-fg/15 bg-primary-fg/5 px-4 text-sm text-primary-fg outline-none placeholder:text-primary-fg/40"
            />
            <Button type="submit" className="w-full" variant="accent">
              Subscribe
            </Button>
          </form>
          <div className="mt-5 flex gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary-fg/10">
              <Facebook className="size-4" />
            </span>
            <span className="flex size-9 items-center justify-center rounded-full bg-primary-fg/10">
              <Instagram className="size-4" />
            </span>
            <span className="flex size-9 items-center justify-center rounded-full bg-primary-fg/10">
              <Youtube className="size-4" />
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-fg/10 px-4 py-5 text-center text-xs text-primary-fg/50">
        © {new Date().getFullYear()} Taza · Made for Bangladesh
      </div>
    </footer>
  );
}
