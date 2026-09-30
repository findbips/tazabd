import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Heart,
  Leaf,
  Shield,
  Truck,
} from "lucide-react";
import { CategoryIcon } from "@/components/category-icon";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { categories, getFeaturedProducts } from "@/lib/products";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const featured = getFeaturedProducts();

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(61_139_100/0.18),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgb(196_92_38/0.12),transparent_45%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-sm font-medium text-primary shadow-sm ring-1 ring-border">
              <Leaf className="size-4" />
              100% Organic · Bangladesh
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight text-ink md:text-5xl lg:text-6xl">
              Fresh from the farm to your table
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-muted">
              Taza delivers organic fruits, vegetables, honey and natural
              products straight from trusted Bangladeshi farmers. No chemicals.
              Just nature's best.
            </p>
            <p className="font-display italic text-primary">
              তাজা · খাঁটি · প্রাকৃতিক — Fresh · Pure · Natural
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button asChild size="lg">
                <Link to="/products">
                  Shop now
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/about">Our story</Link>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto hidden max-w-md lg:block">
            <div className="absolute inset-3 rotate-3 rounded-3xl bg-primary/15" />
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&h=900&fit=crop"
              alt="Fresh organic produce from Bangladeshi farms"
              className="relative aspect-square w-full rounded-3xl object-cover shadow-card"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4">
          {[
            { icon: Leaf, title: "100% Organic", desc: "Certified chemical-free" },
            { icon: Truck, title: "Fast delivery", desc: "Across major cities" },
            { icon: Shield, title: "Farm direct", desc: "From trusted growers" },
            { icon: Heart, title: "Bangladesh made", desc: "Supporting local farms" },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center gap-2 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-bg text-primary">
                <item.icon className="size-6" />
              </span>
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <p className="text-xs text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-ink">
            Shop by category
          </h2>
          <p className="mt-2 text-muted">
            Nature's finest from every corner of Bangladesh
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to="/products"
              search={{ category: cat.id }}
              className="group rounded-2xl border border-border bg-surface p-6 text-center transition-shadow hover:shadow-card"
            >
              <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-bg text-primary transition-transform group-hover:scale-105">
                <CategoryIcon name={cat.icon} className="size-6" />
              </span>
              <h3 className="text-sm font-semibold">{cat.name}</h3>
              <p className="mt-0.5 text-xs text-muted">{cat.nameBn}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-surface/60 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold text-ink">
                Featured harvest
              </h2>
              <p className="mt-2 text-muted">Handpicked organic goodness</p>
            </div>
            <Link
              to="/products"
              className="hidden items-center gap-1 text-sm font-medium text-primary sm:inline-flex"
            >
              View all <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl bg-primary px-8 py-14 text-center text-primary-fg md:px-16">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Join the organic table
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-fg/80">
            Every order supports local farmers and brings chemical-free food to
            your family. Cash on delivery across Bangladesh.
          </p>
          <Button asChild size="lg" variant="outline" className="mt-8 border-0">
            <Link to="/products">Explore products</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
