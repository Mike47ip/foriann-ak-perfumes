"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/data";
import ProductCard from "./ProductCard";

export default function ShopSection() {
  const [active, setActive] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats.map((c: { name: string }) => c.name));
      setLoading(false);
    });
  }, []);

  const filtered =
    active === "all" ? products : products.filter((p) => p.family === active);

  return (
    <section id="shop" className="max-w-7xl mx-auto px-8 py-20">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="w-10 h-px bg-bronze inline-block" />
          <span className="text-bronze text-xs tracking-[.2em]">THE COLLECTION</span>
        </div>
        <h2 className="font-playfair text-4xl font-medium text-charcoal mb-6">
          Every scent, a story.
        </h2>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActive("all")}
            className={`border text-xs tracking-[.06em] px-4 py-1.5 transition-all cursor-pointer ${
              active === "all"
                ? "bg-charcoal border-charcoal text-ivory"
                : "bg-transparent border-stone text-charcoal hover:bg-charcoal hover:border-charcoal hover:text-ivory"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`border text-xs tracking-[.06em] px-4 py-1.5 transition-all cursor-pointer ${
                active === cat
                  ? "bg-charcoal border-charcoal text-ivory"
                  : "bg-transparent border-stone text-charcoal hover:bg-charcoal hover:border-charcoal hover:text-ivory"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-mist text-sm tracking-widest">LOADING...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🧴</p>
          <p className="font-playfair text-2xl text-charcoal mb-2">
            {active === "all" ? "No products yet" : `No ${active} products yet`}
          </p>
          <p className="text-mist text-sm">Check back soon or browse another category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}