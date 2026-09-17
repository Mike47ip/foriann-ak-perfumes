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
          className="bg-[#1c1b19] text-[#f7f2ea] text-xs tracking-widest px-6 py-3 no-underline hover:bg-[#b8916a] transition-colors"
        >
          + ADD PRODUCT
        </Link>
      </div>

      {loading ? (
        <p className="text-[#9e9890] text-sm">Loading...</p>
      ) : products.length === 0 ? (
        <div className="bg-white p-16 text-center">
          <p className="text-5xl mb-4">🧴</p>
          <p className="font-playfair text-xl text-[#1c1b19] mb-2">No products yet</p>
          <p className="text-[#9e9890] text-sm mb-6">Add your first product to get started</p>
          <Link href="/admin/products/new" className="bg-[#1c1b19] text-[#f7f2ea] text-xs tracking-widest px-6 py-3 no-underline hover:bg-[#b8916a] transition-colors">
            + ADD PRODUCT
          </Link>
        </div>
      ) : (
        <div className="bg-white overflow-hidden">
          <div className="grid grid-cols-[80px_1fr_120px_100px_100px_80px] gap-4 px-6 py-3 bg-[#f0ebe0] text-[#9e9890] text-xs tracking-widest border-b border-[#e8e2d9]">
            <span>IMAGE</span>
            <span>NAME</span>
            <span>FAMILY</span>
            <span>PRICE</span>
            <span>BADGE</span>
            <span></span>
          </div>

          {products.map((product) => (
            <div key={product.id} className="grid grid-cols-[80px_1fr_120px_100px_100px_80px] gap-4 px-6 py-4 border-b border-[#e8e2d9] items-center hover:bg-[#faf7f3] transition-colors">
              <div className="w-14 h-14 bg-[#f0ebe0] flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">{product.emoji}</span>
                )}
              </div>

              <div>
                <p className="font-playfair text-sm font-medium">{product.name}</p>
                <p className="text-[#9e9890] text-xs mt-0.5">{product.notes.join(" · ")}</p>
              </div>

              <span className="text-xs capitalize text-[#1c1b19]">{product.family}</span>
              <span className="font-playfair text-[#b8916a]">₵{product.price.toFixed(2)}</span>
              <span className="text-xs text-[#9e9890] capitalize">{product.badge || "—"}</span>

              <button
                onClick={() => handleDelete(product.id)}
                disabled={deleting === product.id}
                className="text-xs text-red-400 hover:text-red-600 bg-transparent border-none cursor-pointer disabled:opacity-40"
              >
                {deleting === product.id ? "..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}