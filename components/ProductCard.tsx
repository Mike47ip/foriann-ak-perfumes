"use client";

import { Product, FAMILY_COLORS } from "@/lib/data";
import { useCart } from "@/lib/CartContext";

interface Props {
  product: Product;
}

const BADGE_STYLES = {
  new:  "bg-charcoal text-ivory",
  best: "bg-bronze text-ivory",
  ltd:  "bg-sage text-ivory",
};

const BADGE_LABELS = {
  new:  "NEW",
  best: "BESTSELLER",
  ltd:  "LIMITED",
};

export default function ProductCard({ product }: Props) {
  const { addToCart, openCart } = useCart();

  function handleAdd() {
    addToCart(product);
    openCart();
  }

  return (
    <div className="bg-white group transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative bg-[#f0ebe0] flex items-center justify-center h-[220px] overflow-hidden">
        {product.badge && (
          <span className={`absolute top-3 left-3 z-10 text-[10px] font-semibold tracking-[.1em] px-2 py-1 ${BADGE_STYLES[product.badge]}`}>
            {BADGE_LABELS[product.badge]}
          </span>
        )}

        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-7xl leading-none" style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,.08))" }}>
            {product.emoji}
          </span>
        )}

        {product.notes.length > 0 && (
          <div className="absolute bottom-3 right-3 flex gap-1 flex-wrap justify-end z-10">
            {product.notes.map((note) => (
              <span key={note} className="bg-white/70 backdrop-blur-sm text-[9px] px-1.5 py-0.5 tracking-[.05em]">
                {note}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-playfair text-base font-medium leading-snug">{product.name}</h3>
          <span className="text-[9px] tracking-[.1em] pt-1 shrink-0 ml-2" style={{ color: FAMILY_COLORS[product.family] }}>
            {product.family.toUpperCase()}
          </span>
        </div>
        <p className="font-playfair text-bronze text-base mb-4">₵{product.price.toFixed(2)}</p>
        <button
          onClick={handleAdd}
          className="w-full bg-charcoal text-ivory text-xs tracking-widest font-medium py-2.5 border-none cursor-pointer transition-colors hover:bg-bronze"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}