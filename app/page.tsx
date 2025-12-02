"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json();
        setProducts(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Loading cars...</p>;

  return (
    <div className="space-y-4 mt-4 mb-10">
      <h1 className="text-2xl font-bold mb-2">Available Hot Wheels</h1>
      {products.length === 0 ? (
        <p className="text-sm text-slate-600">
          No cars added yet. Check back later.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
