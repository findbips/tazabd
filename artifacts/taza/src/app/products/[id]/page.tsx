"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Leaf, MapPin, ShoppingCart, ArrowLeft, Minus, Plus } from "lucide-react";
import { getProductById, formatPrice, products } from "@/lib/products";
import { useCart } from "@/components/CartContext";
import { ProductCard } from "@/components/ProductCard";
import { useState } from "react";
import { notFound } from "next/navigation";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = getProductById(id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    notFound();
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-taza-600 hover:text-taza-800 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to products
      </Link>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-taza-50 border border-taza-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          {product.isOrganic && (
            <span className="absolute top-4 left-4 bg-taza-600 text-white text-sm font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <Leaf className="w-4 h-4" />
              Certified Organic
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-medium text-taza-800">{product.rating}</span>
            </div>
            <span className="text-taza-400">·</span>
            <span className="text-sm text-taza-500">{product.reviews} reviews</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-taza-900">
            {product.name}
          </h1>
          <p className="text-lg text-taza-600 mt-1">{product.nameBn}</p>

          <div className="flex items-center gap-2 mt-3 text-sm text-taza-500">
            <MapPin className="w-4 h-4" />
            <span>Origin: {product.origin}</span>
            <span className="text-taza-300">|</span>
            <span>{product.unit}</span>
          </div>

          <div className="flex items-baseline gap-3 mt-6">
            <span className="text-3xl font-bold text-taza-800">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-taza-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="bg-earth-100 text-earth-700 text-xs font-bold px-2 py-1 rounded-full">
                  Save {formatPrice(product.originalPrice - product.price)}
                </span>
              </>
            )}
          </div>

          <p className="mt-6 text-taza-700 leading-relaxed">
            {product.description}
          </p>
          <p className="mt-2 text-sm text-taza-500 italic">
            {product.descriptionBn}
          </p>

          {/* Quantity & Add */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-taza-200 rounded-full overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-taza-50 text-taza-700 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-semibold text-taza-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-taza-50 text-taza-700 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => addToCart(product, quantity)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-taza-600 hover:bg-taza-700 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg shadow-taza-200 transition-all active:scale-[0.98]"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
          </div>

          {product.inStock ? (
            <p className="mt-4 text-sm text-taza-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-taza-500" />
              In stock — Ready to ship
            </p>
          ) : (
            <p className="mt-4 text-sm text-red-600">Out of stock</p>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-taza-900 mb-6">
            You may also like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
