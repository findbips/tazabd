"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Leaf } from "lucide-react";
import { Product, formatPrice } from "@/lib/products";
import { useCart } from "./CartContext";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-2xl border border-taza-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-taza-200 transition-all duration-300">
      <Link href={`/products/${product.id}`} className="block relative">
        <div className="aspect-square relative overflow-hidden bg-taza-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {product.isOrganic && (
            <span className="absolute top-3 left-3 bg-taza-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
              <Leaf className="w-3 h-3" />
              Organic
            </span>
          )}
          {product.originalPrice && (
            <span className="absolute top-3 right-3 bg-earth-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-taza-700">
            {product.rating}
          </span>
          <span className="text-xs text-taza-400">({product.reviews})</span>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-taza-900 group-hover:text-taza-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-taza-500 mt-0.5">{product.nameBn}</p>
        </Link>

        <p className="text-xs text-taza-400 mt-1">{product.unit} · {product.origin}</p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-taza-800">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-taza-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="p-2.5 rounded-full bg-taza-100 text-taza-700 hover:bg-taza-600 hover:text-white transition-all duration-200 active:scale-95"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
