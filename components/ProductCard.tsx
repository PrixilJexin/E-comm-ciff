"use client";

import { Product } from "@/lib/products";
import { useCart } from "./CartContext";
import TiltedCard from "@/components/TiltedCard";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    if (product.soldOut) return;
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
    });
  };

  return (
    <div
      className="
        bg-white shadow rounded-lg overflow-hidden flex flex-col 
        transform transition-all duration-300 hover:scale-105
      "
    >
      {/* IMAGE BOX – SAME HEIGHT & SIZE */}
      <div className="w-full h-48 bg-white flex items-center justify-center">
        
        {/* CENTERED TILTED IMAGE */}
        <div className="flex items-center justify-center w-full h-full">
          <TiltedCard
            imageSrc={product.imageUrl}
            altText={product.title}

            /* exact same size you used earlier */
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="70%"

            rotateAmplitude={50}
            scaleOnHover={1.07}
            showTooltip={false}
            showMobileWarning={false}
          />
        </div>

      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-lg mb-1">{product.title}</h3>

        <p className="text-sm text-slate-600 flex-1">{product.description}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-base">₹ {product.price}</span>

          {product.soldOut && (
            <span className="text-xs font-semibold text-red-600 border border-red-400 px-2 py-1 rounded">
              SOLD OUT
            </span>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={product.soldOut}
          className="
            mt-3 w-full py-2 text-sm font-medium rounded
            bg-blue-600 text-white 
            disabled:bg-gray-400 disabled:cursor-not-allowed
          "
        >
          {product.soldOut ? "Not Available" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
