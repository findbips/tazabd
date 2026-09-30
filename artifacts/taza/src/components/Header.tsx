"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X, Search, Leaf } from "lucide-react";
import { useCart } from "./CartContext";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-taza-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-taza-500 to-taza-700 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-taza-800 tracking-tight">
                Taza
              </span>
              <span className="hidden sm:block text-[10px] text-taza-600 -mt-1 font-medium">
                তাজা · Organic Bangladesh
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-taza-800 hover:text-taza-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-taza-500 after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-full hover:bg-taza-50 text-taza-700 transition-colors hidden sm:flex"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-taza-50 text-taza-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-taza-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 rounded-full hover:bg-taza-50 text-taza-700"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-taza-100 bg-white">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-lg text-taza-800 font-medium hover:bg-taza-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
