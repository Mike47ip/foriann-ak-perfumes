"use client";

import { useState } from "react";

interface Props {
  productId: number;
  average: number;
  count: number;
  onRate?: (avg: number, count: number) => void;
}

export default function StarRating({ productId, average, count, onRate }: Props) {
  const [hover, setHover] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [localAvg, setLocalAvg] = useState(average);
  const [localCount, setLocalCount] = useState(count);

  // Check if already rated from localStorage
  const storageKey = `rated_${productId}`;
  const alreadyRated = typeof window !== "undefined" && !!localStorage.getItem(storageKey);
  const [rated, setRated] = useState(alreadyRated);

  const display = hover || userRating || localAvg;

  async function handleRate(score: number) {
    if (rated || loading) return;
    setUserRating(score);
    setLoading(true);

    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, score }),
      });

      if (res.ok) {
        const data = await res.json();
        setLocalAvg(data.average);
        setLocalCount(data.count);
        setRated(true);
        localStorage.setItem(storageKey, String(score));
        onRate && onRate(data.average, data.count);
      }
    } catch {
      setUserRating(0);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={loading}
            onMouseEnter={() => !rated && setHover(star)}
            onMouseLeave={() => !rated && setHover(0)}
            onClick={() => !rated && handleRate(star)}
            style={{ cursor: rated ? "default" : "pointer" }}
            className="bg-transparent border-none p-0 leading-none"
            aria-label={`Rate ${star} stars`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={star <= display ? "#b8916a" : "none"}
              stroke={star <= display ? "#b8916a" : "#d4cdc4"}
              strokeWidth="1.5"
              style={{ display: "block" }}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        ))}
      </div>
      <span className="text-[10px] text-mist">
        {rated
          ? `You rated ${userRating || localStorage.getItem(storageKey)}★`
          : localCount > 0
          ? `${localAvg.toFixed(1)} (${localCount})`
          : "Rate this"}
      </span>
    </div>
  );
}