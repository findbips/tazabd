import Link from "next/link";
import { Leaf, MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-taza-900 text-taza-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-taza-500 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Taza</span>
            </div>
            <p className="text-sm text-taza-200 leading-relaxed">
              Bringing the purest organic & natural products from Bangladeshi
              farms to your table. Fresh, chemical-free, and full of life.
            </p>
            <p className="text-sm text-taza-300 italic">
              তাজা · খাঁটি · প্রাকৃতিক
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-taza-300 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-taza-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-taza-300 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-taza-300 transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products?category=fruits" className="hover:text-taza-300 transition-colors">
                  Organic Fruits
                </Link>
              </li>
              <li>
                <Link href="/products?category=vegetables" className="hover:text-taza-300 transition-colors">
                  Fresh Vegetables
                </Link>
              </li>
              <li>
                <Link href="/products?category=honey" className="hover:text-taza-300 transition-colors">
                  Pure Honey
                </Link>
              </li>
              <li>
                <Link href="/products?category=spices" className="hover:text-taza-300 transition-colors">
                  Natural Spices
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-taza-400 shrink-0" />
                <span>House 12, Road 5, Dhanmondi, Dhaka 1205</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-taza-400 shrink-0" />
                <span>+880 1712-345678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-taza-400 shrink-0" />
                <span>hello@taza.com.bd</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-5">
              <a href="#" className="p-2 rounded-full bg-taza-800 hover:bg-taza-700 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-taza-800 hover:bg-taza-700 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-taza-800 hover:bg-taza-700 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-taza-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-taza-400">
          <p>© {new Date().getFullYear()} Taza. All rights reserved.</p>
          <p>Made with 💚 for Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}
