"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";

const ADMIN_KEY = "hw_admin_logged_in";
const ADMIN_PASSWORD = "supersecret123";

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [soldOut, setSoldOut] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_KEY);
    if (stored === "true") setIsAuthed(true);
  }, []);

  useEffect(() => {
    if (isAuthed) loadProducts();
  }, [isAuthed]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res.json();
      setProducts(data);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_KEY, "true");
      setIsAuthed(true);
    } else {
      alert("Wrong password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_KEY);
    setIsAuthed(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) {
      alert("Title and image URL are required");
      return;
    }

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        imageUrl,
        price: price === "" ? 0 : price,
        soldOut
      })
    });

    if (!res.ok) {
      alert("Failed to add product");
      return;
    }

    setTitle("");
    setDescription("");
    setImageUrl("");
    setPrice("");
    setSoldOut(false);

    await loadProducts();
  };

  const toggleSoldOut = async (product: Product) => {
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ soldOut: !product.soldOut })
    });

    if (!res.ok) {
      alert("Failed to update product");
      return;
    }

    await loadProducts();
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Delete this product?")) return;

    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      alert("Failed to delete");
      return;
    }

    await loadProducts();
  };

  // ----------------------------------------------
  // LOGIN UI
  // ----------------------------------------------
  if (!isAuthed) {
    return (
      <div className="max-w-sm mx-auto mt-10 bg-white shadow p-6 rounded">
        <h1 className="text-xl font-bold mb-4">Admin Login</h1>
        <input
          type="password"
          placeholder="Admin password"
          className="w-full border rounded px-3 py-2 text-sm mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full py-2 text-sm font-medium bg-blue-600 text-white rounded"
        >
          Login
        </button>

        <p className="mt-3 text-xs text-slate-500">
          Default password is <code>supersecret123</code>.
        </p>
      </div>
    );
  }

  // ----------------------------------------------
  // MAIN ADMIN UI
  // ----------------------------------------------
  return (
    <div className="space-y-6 mb-10 mt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="text-xs underline text-slate-600"
        >
          Logout
        </button>
      </div>

      {/* Add Product */}
      <section className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-3">Add New Car</h2>

        <form onSubmit={handleAddProduct} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium mb-1">Title</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-medium mb-1">
              Upload Image
            </label>

            <input
              type="file"
              accept="image/*"
              className="w-full border rounded px-3 py-2 text-sm"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                console.log("Selected file:", file);

                const formData = new FormData();
                formData.append("file", file);

                console.log("Uploading to /api/upload...");

                const res = await fetch("/api/upload", {
                  method: "POST",
                  body: formData,
                });

                let data;
                try {
                  data = await res.json();
                } catch (err) {
                  console.log("JSON Error:", err);
                  alert("Upload failed (JSON error)");
                  return;
                }

                console.log("Upload response:", data);

                if (data.url) {
                  setImageUrl(data.url);
                  alert("Image uploaded successfully!");
                } else {
                  alert("Failed to upload image");
                }
              }}
            />

            {imageUrl && (
              <img
                src={imageUrl}
                className="w-32 mt-2 rounded border"
                alt="Uploaded Preview"
              />
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-medium mb-1">Price (₹)</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 text-sm"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </div>

          {/* Sold Out */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="soldout"
              checked={soldOut}
              onChange={(e) => setSoldOut(e.target.checked)}
            />
            <label htmlFor="soldout" className="text-xs">
              Mark as sold out
            </label>
          </div>

          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded"
          >
            Add Product
          </button>
        </form>
      </section>

      {/* Product List */}
      <section className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-3">All Products</h2>

        {loadingProducts ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-slate-500">No products yet.</p>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between border rounded px-3 py-2"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    #{p.id} — {p.title}
                  </div>
                  <div className="text-xs text-slate-500">
                    ₹ {p.price} • {p.soldOut ? "Sold out" : "In stock"}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSoldOut(p)}
                    className="px-2 py-1 text-xs rounded border"
                  >
                    {p.soldOut ? "Mark in stock" : "Mark sold out"}
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="px-2 py-1 text-xs rounded border border-red-500 text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
