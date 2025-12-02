"use client";

import Link from "next/link";
import { useCart } from "./CartContext";
import Image from "next/image";

export default function Header() {
  const { items } = useCart();

  return (
    <header className="bg-white shadow-sm mb-6">
      <div className="container flex items-center justify-between py-4">

        {/* Logo */}
        <Link href="/" className="cursor-pointer flex items-center">
          <Image
            src="/cliffychrome.png"       // <-- Your logo path
            alt="HotWheels Logo"
            width={120}           // adjust size as needed
            height={20}
            priority
          />
        </Link>

        {/* Cart */}
        <nav className="flex items-center gap-4">
          <Link href="/cart" className="relative text-sm font-medium">
            Cart
            {items.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {items.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
