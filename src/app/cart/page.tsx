"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/components/CartContext";
import { formatPrice } from "@/lib/products";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-taza-50 flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-taza-400" />
        </div>
        <h1 className="text-2xl font-bold text-taza-900 mb-2">Your cart is empty</h1>
        <p className="text-taza-600 mb-8">
          Looks like you haven&apos;t added any organic goodness yet.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-taza-600 hover:bg-taza-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
        >
          Browse Products
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <h1 className="text-3xl font-bold text-taza-900 mb-2">Shopping Cart</h1>
      <p className="text-taza-600 mb-8">
        {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
      </p>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 bg-white rounded-2xl border border-taza-100 p-4 shadow-sm"
            >
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-taza-50 shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <div>
                    <Link
                      href={`/products/${product.id}`}
                      className="font-semibold text-taza-900 hover:text-taza-600 transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-taza-500 mt-0.5">
                      {product.unit} · {product.origin}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-1.5 text-taza-400 hover:text-red-500 transition-colors shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-taza-200 rounded-full overflow-hidden">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-2 hover:bg-taza-50 text-taza-700"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-2 hover:bg-taza-50 text-taza-700"
                      aria-label="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="font-bold text-taza-800">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm text-taza-500 hover:text-red-600 transition-colors"
          >
            Clear cart
          </button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-taza-50 rounded-2xl border border-taza-100 p-6 sticky top-24">
            <h2 className="font-bold text-taza-900 text-lg mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-taza-700">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-taza-700">
                <span>Delivery</span>
                <span className="text-taza-600 font-medium">
                  {totalPrice >= 1000 ? "Free" : "৳60"}
                </span>
              </div>
              <div className="border-t border-taza-200 pt-3 flex justify-between font-bold text-taza-900 text-base">
                <span>Total</span>
                <span>
                  {formatPrice(totalPrice + (totalPrice >= 1000 ? 0 : 60))}
                </span>
              </div>
            </div>

            {totalPrice < 1000 && (
              <p className="text-xs text-taza-500 mt-3">
                Add {formatPrice(1000 - totalPrice)} more for free delivery
              </p>
            )}

            <button className="w-full mt-6 bg-taza-600 hover:bg-taza-700 text-white font-semibold py-3.5 rounded-full transition-colors shadow-lg shadow-taza-200">
              Proceed to Checkout
            </button>

            <p className="text-xs text-center text-taza-400 mt-3">
              Cash on Delivery available across Bangladesh
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
