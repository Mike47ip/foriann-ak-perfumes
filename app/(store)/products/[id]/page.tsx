"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/lib/data";
import { useCart } from "@/lib/CartContext";
import StarRating from "@/components/StarRating";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, openCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        const found = data.find((p: Product) => String(p.id) === String(id));
        setProduct(found || null);
        if (found?.image) setSelectedImage(found.image);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/ratings?product_id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        setAverage(data.average || 0);
        setCount(data.count || 0);
      });
  }, [id]);

  function handleAdd() {
    if (!product) return;
    addToCart(product);
    openCart();
  }

  if (loading) return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <p className="text-mist text-sm tracking-widest">LOADING...</p>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center gap-4">
      <p className="font-playfair text-2xl text-charcoal">Product not found</p>
      <button onClick={() => router.back()}
        className="text-bronze text-xs tracking-widest bg-transparent border-none cursor-pointer hover:underline">
        ← Go back
      </button>
    </div>
  );

  const BADGE_STYLES: Record<string, string> = {
    new: "bg-charcoal text-ivory",
    best: "bg-bronze text-ivory",
    ltd: "bg-sage text-ivory",
  };

  const BADGE_LABELS: Record<string, string> = {
    new: "NEW",
    best: "BESTSELLER",
    ltd: "LIMITED",
  };

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8">

        {/* Back button */}
        <button onClick={() => router.back()}
          className="text-mist text-xs tracking-widest bg-transparent border-none cursor-pointer hover:text-charcoal mb-8 flex items-center gap-2 transition-colors">
          ← BACK
        </button>

        <div className="flex flex-col md:flex-row gap-12">

          {/* Image */}
          <div className="flex-1">
            <div className="relative bg-[#f0ebe0] overflow-hidden" style={{ height: "clamp(400px, 60vw, 600px)" }}>
              {product.badge && BADGE_LABELS[product.badge] && (
                <span className={`absolute top-4 left-4 z-10 text-[10px] font-semibold tracking-[.1em] px-2 py-1 ${BADGE_STYLES[product.badge]}`}>
                  {BADGE_LABELS[product.badge]}
                </span>
              )}
              {product.gender && (
                <span className="absolute top-4 right-4 z-10 text-[9px] tracking-[.1em] px-2 py-1 bg-white/80 text-charcoal capitalize">
                  {product.gender}
                </span>
              )}
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-9xl">{product.emoji}</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-bronze text-xs tracking-[.2em] mb-2 uppercase">{product.family}</p>
            <h1 className="font-playfair text-4xl md:text-5xl font-medium text-charcoal mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="mb-4">
              <StarRating
                productId={product.id}
                average={average}
                count={count}
                onRate={(newAvg, newCount) => { setAverage(newAvg); setCount(newCount); }}
              />
            </div>

            <p className="font-playfair text-bronze text-3xl mb-6">
              ₵{Number(product.price).toFixed(2)}
            </p>

            {product.notes && product.notes.length > 0 && (
              <div className="mb-8">
                <p className="text-mist text-xs tracking-widest mb-3">SCENT NOTES</p>
                <div className="flex flex-wrap gap-2">
                  {product.notes.map((note) => (
                    <span key={note}
                      className="border border-stone text-xs px-3 py-1.5 text-charcoal">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAdd}
              className="w-full md:w-auto bg-charcoal text-ivory text-xs tracking-widest px-12 py-4 border-none cursor-pointer hover:bg-bronze transition-colors"
            >
              ADD TO CART
            </button>

            <p className="text-mist text-xs mt-4">
              🔒 Secured payment via Paystack · MoMo, Card & Bank accepted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}