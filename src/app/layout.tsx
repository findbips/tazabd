import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";

export const metadata: Metadata = {
  title: "Taza | Fresh Organic & Natural Products of Bangladesh",
  description:
    "Taza brings you the freshest organic fruits, vegetables, honey, spices and natural products straight from Bangladeshi farms. Pure, chemical-free, and delivered to your door.",
  keywords: "organic, natural, bangladesh, fruits, vegetables, honey, taza, fresh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
