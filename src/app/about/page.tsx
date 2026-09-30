import { Leaf, Users, Tractor, Heart } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-taza-50 to-taza-100 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 text-taza-800 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Leaf className="w-4 h-4" />
            Our Story
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-taza-900 mb-6">
            Rooted in Bangladesh,
            <br />
            Grown with Care
          </h1>
          <p className="text-lg text-taza-700 leading-relaxed max-w-2xl mx-auto">
            Taza was born from a simple belief — that every Bangladeshi family
            deserves access to pure, chemical-free food grown by the hands of
            local farmers who care for the land.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-taza-900 mb-4">
                Why Taza?
              </h2>
              <p className="text-taza-700 leading-relaxed mb-4">
                &ldquo;Taza&rdquo; means fresh in Bangla. We chose this name because
                freshness is at the heart of everything we do — from the moment
                produce is harvested in the fields of Rajshahi, Gazipur, or the
                Sundarbans, to the moment it reaches your kitchen.
              </p>
              <p className="text-taza-700 leading-relaxed">
                We work directly with small and medium-scale organic farmers
                across Bangladesh. By cutting out middlemen, we ensure fair
                prices for farmers and pure quality for you.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Tractor, label: "50+ Partner Farms", value: "Nationwide" },
                { icon: Users, label: "10,000+ Happy Families", value: "And growing" },
                { icon: Leaf, label: "100% Organic", value: "No chemicals" },
                { icon: Heart, label: "Local First", value: "Supporting BD" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-taza-50 rounded-2xl p-5 border border-taza-100"
                >
                  <item.icon className="w-8 h-8 text-taza-600 mb-3" />
                  <p className="font-bold text-taza-900">{item.label}</p>
                  <p className="text-sm text-taza-500">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 bg-taza-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Purity",
                desc: "Every product is tested and verified. We never compromise on quality or use synthetic pesticides and fertilizers.",
              },
              {
                title: "Fairness",
                desc: "Farmers deserve fair wages. We pay premium rates for organic produce and build long-term partnerships.",
              },
              {
                title: "Sustainability",
                desc: "Healthy soil, healthy food, healthy future. We promote regenerative farming practices across Bangladesh.",
              },
            ].map((v) => (
              <div key={v.title} className="text-center">
                <h3 className="text-xl font-semibold text-taza-300 mb-3">
                  {v.title}
                </h3>
                <p className="text-taza-100 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-taza-900 mb-4">
            Ready to taste the difference?
          </h2>
          <p className="text-taza-600 mb-6">
            Explore our range of organic and natural products today.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-taza-600 hover:bg-taza-700 text-white font-semibold px-8 py-3.5 rounded-full transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}
