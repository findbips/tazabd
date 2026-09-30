import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf, Truck, Shield, Heart } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { getFeaturedProducts, categories } from "@/lib/products";

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-taza-50 via-white to-taza-100">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-taza-200 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-taza-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-taza-100 text-taza-800 text-sm font-medium px-4 py-1.5 rounded-full">
                <Leaf className="w-4 h-4" />
                100% Organic · Bangladesh
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-taza-900 leading-tight">
                Fresh from the{" "}
                <span className="text-taza-600">Farm</span>
                <br />
                to Your Table
              </h1>

              <p className="text-lg text-taza-700 max-w-lg leading-relaxed">
                Taza delivers pure organic fruits, vegetables, honey & natural
                products straight from trusted Bangladeshi farmers. No chemicals.
                Just nature&apos;s best.
              </p>

              <p className="text-taza-600 font-medium italic">
                তাজা · খাঁটি · প্রাকৃতিক — Fresh · Pure · Natural
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-taza-600 hover:bg-taza-700 text-white font-semibold px-6 py-3.5 rounded-full shadow-lg shadow-taza-200 transition-all hover:shadow-xl active:scale-[0.98]"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 bg-white hover:bg-taza-50 text-taza-800 font-semibold px-6 py-3.5 rounded-full border border-taza-200 transition-all"
                >
                  Our Story
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-taza-400 to-taza-600 rounded-[2.5rem] rotate-3 opacity-20" />
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=800&fit=crop"
                    alt="Fresh organic produce"
                    width={600}
                    height={600}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-white border-y border-taza-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Leaf, title: "100% Organic", desc: "Certified chemical-free" },
              { icon: Truck, title: "Fast Delivery", desc: "Across major cities" },
              { icon: Shield, title: "Farm Direct", desc: "From trusted growers" },
              { icon: Heart, title: "Bangladesh Made", desc: "Supporting local farmers" },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-taza-50 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-taza-600" />
                </div>
                <h3 className="font-semibold text-taza-900 text-sm">{item.title}</h3>
                <p className="text-xs text-taza-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-taza-900">Shop by Category</h2>
            <p className="text-taza-600 mt-2">Discover nature&apos;s finest from every corner of Bangladesh</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="group bg-white rounded-2xl border border-taza-100 p-6 text-center hover:border-taza-300 hover:shadow-md transition-all"
              >
                <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <h3 className="font-semibold text-taza-900 text-sm">{cat.name}</h3>
                <p className="text-xs text-taza-500 mt-0.5">{cat.nameBn}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-20 bg-taza-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-taza-900">Featured Products</h2>
              <p className="text-taza-600 mt-2">Handpicked organic goodness for you</p>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-1 text-taza-700 font-medium hover:text-taza-900 transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-10 sm:hidden">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-taza-700 font-medium"
            >
              View all products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-taza-700 to-taza-900 px-8 py-14 md:px-16 md:py-20 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-taza-300 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Join the Organic Revolution
              </h2>
              <p className="text-taza-100 max-w-xl mx-auto mb-8">
                Every purchase supports local farmers and brings pure, chemical-free
                food to your family. Start your healthy journey with Taza today.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-white text-taza-800 font-semibold px-8 py-3.5 rounded-full hover:bg-taza-50 transition-colors shadow-lg"
              >
                Explore Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
