"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/data";
import ProductCard from "./ProductCard";

export default function ShopSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeGender, setActiveGender] = useState("all");
  const [search, setSearch] = useState("");
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

  const filtered = products.filter((p) => {
    const categoryMatch = activeCategory === "all" || p.family === activeCategory;
    const genderMatch = activeGender === "all" || p.gender === activeGender;
    const searchMatch =
      search.trim() === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.family.toLowerCase().includes(search.toLowerCase()) ||
      (p.notes || []).some((n) => n.toLowerCase().includes(search.toLowerCase()));
    return categoryMatch && genderMatch && searchMatch;
  });

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

        {/* Search */}
        <div className="relative mb-5">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mist"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, category or notes..."
            className="w-full border border-stone pl-11 pr-4 py-3 text-sm outline-none focus:border-charcoal transition-colors bg-white placeholder-mist"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-mist hover:text-charcoal bg-transparent border-none cursor-pointer text-lg leading-none"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => setActiveCategory("all")}
            className={`border text-xs tracking-[.06em] px-4 py-1.5 transition-all cursor-pointer ${
              activeCategory === "all"
                ? "bg-charcoal border-charcoal text-ivory"
                : "bg-transparent border-stone text-charcoal hover:bg-charcoal hover:border-charcoal hover:text-ivory"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`border text-xs tracking-[.06em] px-4 py-1.5 transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-charcoal border-charcoal text-ivory"
                  : "bg-transparent border-stone text-charcoal hover:bg-charcoal hover:border-charcoal hover:text-ivory"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gender filters */}
        <div className="flex gap-2">
          {[
            { label: "All", value: "all" },
            { label: "Men", value: "men" },
            { label: "Women", value: "women" },
            { label: "Unisex", value: "unisex" },
          ].map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActiveGender(value)}
              className={`border text-xs tracking-[.06em] px-4 py-1.5 transition-all cursor-pointer ${
                activeGender === value
                  ? "bg-bronze border-bronze text-ivory"
                  : "bg-transparent border-stone text-charcoal hover:bg-bronze hover:border-bronze hover:text-ivory"
              }`}
            >
              {label}
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
            {search ? `No results for "${search}"` : "No products found"}
          </p>
          <p className="text-mist text-sm">Try a different search or filter.</p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mt-4 text-bronze text-xs tracking-widest bg-transparent border-none cursor-pointer hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          {search && (
            <p className="text-mist text-sm mb-6">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
            </p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}