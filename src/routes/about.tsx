import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Leaf, Tractor, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return (
    <div>
      <section className="bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-bg px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-border">
            <Leaf className="size-4" />
            Our story
          </span>
          <h1 className="font-display mt-6 text-4xl font-bold text-ink md:text-5xl">
            Rooted in Bangladesh, grown with care
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Taza was born from a simple belief — every Bangladeshi family
            deserves chemical-free food grown by farmers who care for the land.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink">
              Why Taza?
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              &ldquo;Taza&rdquo; means fresh in Bangla. Freshness is everything
              we do — from harvest in Rajshahi, Gazipur, or the Sundarbans to
              the moment it reaches your kitchen.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              We work directly with small and medium organic farms. By skipping
              middlemen we keep farmer prices fair and the produce pure.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Tractor, label: "50+ partner farms", value: "Nationwide" },
              { icon: Users, label: "10,000+ families", value: "And growing" },
              { icon: Leaf, label: "100% organic", value: "No chemicals" },
              { icon: Heart, label: "Local first", value: "Supporting BD" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-border bg-surface p-5"
              >
                <item.icon className="mb-3 size-8 text-primary" />
                <p className="font-bold">{item.label}</p>
                <p className="text-sm text-muted">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 text-primary-fg">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display mb-12 text-center text-3xl font-bold">
            Our values
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Purity",
                desc: "Every product is verified. We never use synthetic pesticides or fertilizers.",
              },
              {
                title: "Fairness",
                desc: "We pay premium rates for organic harvests and keep long-term farm partnerships.",
              },
              {
                title: "Sustainability",
                desc: "Healthy soil, healthy food. Regenerative farming across Bangladesh.",
              },
            ].map((v) => (
              <div key={v.title} className="text-center">
                <h3 className="text-xl font-semibold text-leaf">{v.title}</h3>
                <p className="mt-3 leading-relaxed text-primary-fg/80">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold text-ink">
          Ready to taste the difference?
        </h2>
        <p className="mt-3 text-muted">Explore organic products today.</p>
        <Button asChild className="mt-6">
          <Link to="/products">Shop now</Link>
        </Button>
      </section>
    </div>
  );
}
