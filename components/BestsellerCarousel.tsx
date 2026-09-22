"use client";

import { useEffect, useState, useRef } from "react";
import { Product } from "@/lib/data";
import { useCart } from "@/lib/CartContext";

export default function BestsellerCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [current, setCurrent] = useState(0);
  const { addToCart, openCart } = useCart();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        const bestsellers = data.filter((p: Product) => p.badge === "best");
        setProducts(bestsellers);
      });
  }, []);

  useEffect(() => {
    if (products.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % products.length);
    }, 4000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [products]);

  function prev() {
    setCurrent((c) => (c - 1 + products.length) % products.length);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  function next() {
    setCurrent((c) => (c + 1) % products.length);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  if (products.length === 0) return null;

  const product = products[current];

  return (
    <section className="bg-[#1c1b19] py-20 px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <span className="w-10 h-px bg-bronze inline-block" />
          <span className="text-bronze text-xs tracking-[.2em]">BESTSELLERS</span>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Image */}
          <div className="flex-1 flex justify-center relative">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              {products.map((p, i) => (
                <div
                  key={p.id}
                  className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
                >
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-9xl">
                      {p.emoji}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Nav arrows */}
            {products.length > 1 && (
              <>
                <button onClick={prev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#2e2a24] text-ivory border-none cursor-pointer hover:bg-bronze transition-colors flex items-center justify-center">
                  ←
                </button>
                <button onClick={next}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#2e2a24] text-ivory border-none cursor-pointer hover:bg-bronze transition-colors flex items-center justify-center">
                  →
                </button>
              </>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <span className="text-bronze text-xs tracking-[.2em] mb-2 block">BESTSELLER</span>
            <h2 className="font-playfair text-ivory text-4xl md:text-5xl font-medium mb-4">
              {product.name}
            </h2>
            <p className="text-mist text-sm mb-2 capitalize">{product.family}</p>
            {product.notes && product.notes.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.notes.map((note) => (
                  <span key={note} className="text-[#9e9890] text-xs border border-[#2e2a24] px-3 py-1">
                    {note}
                  </span>
                ))}
              </div>
            )}
            <p className="font-playfair text-bronze text-3xl mb-8">
              ₵{Number(product.price).toFixed(2)}
            </p>
            <button
              onClick={() => { addToCart(product); openCart(); }}
              className="bg-bronze text-ivory text-xs tracking-widest px-10 py-4 border-none cursor-pointer hover:bg-bronze-light transition-colors"
            >
              ADD TO CART
            </button>
          </div>
        </div>

        {/* Dots */}
        {products.length > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {products.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full border-none cursor-pointer transition-colors ${i === current ? "bg-bronze" : "bg-[#2e2a24]"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}