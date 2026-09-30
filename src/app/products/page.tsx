"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { products, categories } from "@/lib/products";
import Link from "next/link";

function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const filtered = useMemo(() => {
    if (!category) return products;
    return products.filter((p) => p.category === category);
  }, [category]);

  const currentCategory = categories.find((c) => c.id === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-taza-900">
          {currentCategory ? currentCategory.name : "All Products"}
        </h1>
        <p className="text-taza-600 mt-1">
          {currentCategory
            ? currentCategory.nameBn
            : "Browse our full range of organic & natural products"}
        </p>
        <p className="text-sm text-taza-500 mt-2">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        <Link
          href="/products"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !category
              ? "bg-taza-600 text-white"
              : "bg-taza-50 text-taza-700 hover:bg-taza-100"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.id}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === cat.id
                ? "bg-taza-600 text-white"
                : "bg-taza-50 text-taza-700 hover:bg-taza-100"
            }`}
          >
            {cat.icon} {cat.name}
          </Link>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-taza-600 text-lg">No products found in this category.</p>
          <Link href="/products" className="text-taza-700 font-medium mt-4 inline-block hover:underline">
            View all products
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-taza-600">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
