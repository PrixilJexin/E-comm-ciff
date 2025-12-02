"use client";

import { useCart } from "@/components/CartContext";
import { useState } from "react";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER || "919876543210";

export default function CartPage() {
  const { items, removeFromCart, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    if (!name || !phone) {
      alert("Please enter your name and phone number");
      return;
    }
    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    const lines = [
      "Order Request:",
      `Name: ${name}`,
      `Phone: ${phone}`,
      "",
      "Items:"
    ];

    items.forEach(i => {
      lines.push(`• ${i.title} – ₹${i.price}`);
    });

    lines.push("");
    lines.push(`Total: ₹${total}`);

    const message = encodeURIComponent(lines.join("\n"));
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    window.location.href = url;
  };

  return (
    <div className="mt-4 mb-10 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {items.length === 0 ? (
        <p className="text-sm text-slate-600">No items in cart.</p>
      ) : (
        <>
          <ul className="space-y-2 mb-4">
            {items.map((item, idx) => (
              <li
                key={`${item.id}-${idx}`}
                className="flex items-center justify-between bg-white border rounded px-3 py-2"
              >
                <div>
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="text-xs text-slate-500">
                    ₹ {item.price}
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-xs text-red-600 underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center mb-4">
            <div className="font-semibold">Total: ₹ {total}</div>
            <button
              onClick={clearCart}
              className="text-xs text-slate-600 underline"
            >
              Clear cart
            </button>
          </div>

          <div className="bg-white border rounded p-4 space-y-3 mb-4">
            <h2 className="text-sm font-semibold mb-1">
              Your details (for WhatsApp order)
            </h2>
            <div>
              <label className="block text-xs font-medium mb-1">Name</label>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Phone number
              </label>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Use the same number you use on WhatsApp.
              </p>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full py-2 text-sm font-medium bg-green-600 text-white rounded"
          >
            Proceed to Order via WhatsApp
          </button>
        </>
      )}
    </div>
  );
}
