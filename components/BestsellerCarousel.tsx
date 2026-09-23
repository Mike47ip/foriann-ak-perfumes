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

  // Auto advance
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

  function handleAdd(product: Product) {
    addToCart(product);
    openCart();
  }

  if (products.length === 0) return null;

  // On desktop show 2 at a time, on mobile 1
  // We get the visible products based on current index
  const visibleDesktop = [
    products[current % products.length],
    products[(current + 1) % products.length],
  ];
  const visibleMobile = products[current % products.length];

  return (
    <section className="bg-[#1c1b19] py-20 px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <span className="w-10 h-px bg-bronze inline-block" />
            <span className="text-bronze text-xs tracking-[.2em]">BESTSELLERS</span>
          </div>
          {products.length > 1 && (
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="w-9 h-9 bg-[#2e2a24] text-ivory border-none cursor-pointer hover:bg-bronze transition-colors flex items-center justify-center text-sm"
              >
                ←
              </button>
              <button
                onClick={next}
                className="w-9 h-9 bg-[#2e2a24] text-ivory border-none cursor-pointer hover:bg-bronze transition-colors flex items-center justify-center text-sm"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Single product layout */}
        {products.length === 1 ? (
          <SingleProduct product={products[0]} onAdd={() => handleAdd(products[0])} />
        ) : (
          <>
            {/* Desktop — 2 at a time */}
            <div className="hidden md:grid grid-cols-2 gap-8">
              {visibleDesktop.map((product, i) => (
                <CarouselCard key={`${product.id}-${i}`} product={product} onAdd={() => handleAdd(product)} />
              ))}
            </div>

            {/* Mobile — 1 at a time */}
            <div className="md:hidden">
              <CarouselCard product={visibleMobile} onAdd={() => handleAdd(visibleMobile)} />
            </div>
          </>
        )}

        {/* Dots */}
        {products.length > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full border-none cursor-pointer transition-all ${
                  i === current ? "bg-bronze w-4" : "bg-[#2e2a24]"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CarouselCard({ product, onAdd }: { product: Product; onAdd: () => void }) {
  return (
    <div className="flex gap-6 items-center bg-[#2e2a24] p-6 transition-all duration-500">
      {/* Image */}
      <div className="w-40 h-40 flex-shrink-0 bg-[#1c1b19] flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl">{product.emoji}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <span className="text-bronze text-[10px] tracking-[.2em] block mb-1 uppercase">{product.family}</span>
        <h3 className="font-playfair text-ivory text-2xl font-medium mb-2">{product.name}</h3>
        {product.notes && product.notes.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.notes.slice(0, 3).map((note) => (
              <span key={note} className="text-[#9e9890] text-[10px] border border-[#3a3530] px-2 py-0.5">
                {note}
              </span>
            ))}
          </div>
        )}
        <p className="font-playfair text-bronze text-2xl mb-4">₵{Number(product.price).toFixed(2)}</p>
        <button
          onClick={onAdd}
          className="bg-bronze text-ivory text-xs tracking-widest px-6 py-2.5 border-none cursor-pointer hover:bg-[#d4aa88] transition-colors"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
}

function SingleProduct({ product, onAdd }: { product: Product; onAdd: () => void }) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-12">
      <div className="flex-1 flex justify-center">
        <div className="w-72 h-72 md:w-96 md:h-96 bg-[#2e2a24] flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-9xl">{product.emoji}</span>
          )}
        </div>
      </div>
      <div className="flex-1">
        <span className="text-bronze text-xs tracking-[.2em] mb-2 block uppercase">{product.family}</span>
        <h2 className="font-playfair text-ivory text-4xl md:text-5xl font-medium mb-4">{product.name}</h2>
        {product.notes && product.notes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {product.notes.map((note) => (
              <span key={note} className="text-[#9e9890] text-xs border border-[#2e2a24] px-3 py-1">
                {note}
              </span>
            ))}
          </div>
        )}
        <p className="font-playfair text-bronze text-3xl mb-8">₵{Number(product.price).toFixed(2)}</p>
        <button
          onClick={onAdd}
          className="bg-bronze text-ivory text-xs tracking-widest px-10 py-4 border-none cursor-pointer hover:bg-[#d4aa88] transition-colors"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
}