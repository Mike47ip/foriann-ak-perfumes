"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/data";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  async function load() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: number) {
    if (!confirm("Delete this product?")) return;
    setDeleting(id);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    await load();
    setDeleting(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl text-[#1c1b19]">Products</h1>
          <p className="text-[#9e9890] text-sm mt-1">{products.length} items in collection</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-[#1c1b19] text-[#f7f2ea] text-xs tracking-widest px-4 py-3 no-underline hover:bg-[#b8916a] transition-colors whitespace-nowrap"
        >
          + ADD
        </Link>
      </div>

      {loading ? (
        <p className="text-[#9e9890] text-sm">Loading...</p>
      ) : products.length === 0 ? (
        <div className="bg-white p-16 text-center">
          <p className="text-5xl mb-4">🧴</p>
          <p className="font-playfair text-xl text-[#1c1b19] mb-2">No products yet</p>
          <p className="text-[#9e9890] text-sm mb-6">Add your first product to get started</p>
          <Link
            href="/admin/products/new"
            className="bg-[#1c1b19] text-[#f7f2ea] text-xs tracking-widest px-6 py-3 no-underline hover:bg-[#b8916a] transition-colors"
          >
            + ADD PRODUCT
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 flex items-center gap-4">
              {/* Image */}
              <div className="w-16 h-16 bg-[#f0ebe0] flex items-center justify-center overflow-hidden flex-shrink-0">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">{product.emoji}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-playfair text-sm font-medium truncate">{product.name}</p>
                <p className="text-[#9e9890] text-xs truncate">{product.notes?.join(" · ")}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-[#1c1b19] capitalize">{product.family}</span>
                  <span className="text-[#9e9890]">·</span>
                  <span className="font-playfair text-[#b8916a] text-sm">
                    ₵{Number(product.price).toFixed(2)}
                  </span>
                  {product.badge && (
                    <>
                      <span className="text-[#9e9890]">·</span>
                      <span className="text-xs text-[#9e9890] capitalize">{product.badge}</span>
                    </>
                  )}
                  {product.gender && (
                    <>
                      <span className="text-[#9e9890]">·</span>
                      <span className="text-xs text-[#9e9890] capitalize">{product.gender}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="text-xs text-[#b8916a] hover:text-[#1c1b19] no-underline transition-colors text-right"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={deleting === product.id}
                  className="text-xs text-red-400 hover:text-red-600 bg-transparent border-none cursor-pointer disabled:opacity-40 text-right"
                >
                  {deleting === product.id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}