"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/data";
import { useCart } from "@/lib/CartContext";
import StarRating from "./StarRating";

interface Props {
  product: Product;
}

const BADGE_STYLES: Record<string, string> = {
  new:  "bg-charcoal text-ivory",
  best: "bg-bronze text-ivory",
  ltd:  "bg-sage text-ivory",
};

const BADGE_LABELS: Record<string, string> = {
  new:  "NEW",
  best: "BESTSELLER",
  ltd:  "LIMITED",
};

export default function ProductCard({ product }: Props) {
  const { addToCart, openCart } = useCart();
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch(`/api/ratings?product_id=${product.id}`)
      .then((r) => r.json())
      .then((data) => {
        setAverage(data.average || 0);
        setCount(data.count || 0);
      });
  }, [product.id]);

  function handleAdd() {
    addToCart(product);
    openCart();
  }

  return (
    <div className="bg-white group transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col">
      {/* Image area */}
      <div className="relative bg-[#f0ebe0] flex items-center justify-center overflow-hidden" style={{ height: 300 }}>
        {product.badge && BADGE_LABELS[product.badge] && (
          <span className={`absolute top-3 left-3 z-10 text-[10px] font-semibold tracking-[.1em] px-2 py-1 ${BADGE_STYLES[product.badge]}`}>
            {BADGE_LABELS[product.badge]}
          </span>
        )}
        {product.gender && (
          <span className="absolute top-3 right-3 z-10 text-[9px] tracking-[.1em] px-2 py-1 bg-white/80 text-charcoal capitalize">
            {product.gender}
          </span>
        )}
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="text-8xl leading-none" style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,.08))" }}>
            {product.emoji}
          </span>
        )}
        {product.notes && product.notes.length > 0 && (
          <div className="absolute bottom-3 right-3 flex gap-1 flex-wrap justify-end z-10">
            {product.notes.map((note) => (
              <span key={note} className="bg-white/70 backdrop-blur-sm text-[9px] px-1.5 py-0.5 tracking-[.05em]">
                {note}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-playfair text-lg font-medium leading-snug flex-1 pr-2">{product.name}</h3>
          <span className="text-[9px] tracking-[.1em] pt-1.5 shrink-0 text-mist uppercase">
            {product.family}
          </span>
        </div>

        {/* Stars */}
        <div className="mb-3">
          <StarRating
            productId={product.id}
            average={average}
            count={count}
            onRate={(newAvg) => setAverage(newAvg)}
          />
        </div>

        <p className="font-playfair text-bronze text-xl mb-5">₵{Number(product.price).toFixed(2)}</p>
        <button
          onClick={handleAdd}
          className="w-full bg-charcoal text-ivory text-xs tracking-widest font-medium py-3 border-none cursor-pointer transition-colors hover:bg-bronze mt-auto"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}