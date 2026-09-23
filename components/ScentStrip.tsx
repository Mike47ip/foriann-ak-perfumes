"use client";

import { useEffect, useState } from "react";

export default function ScentStrip() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.map((c: { name: string }) => c.name)));
  }, []);

  if (categories.length === 0) return null;

  // Repeat enough times to always fill the screen regardless of category count
  const repeat = Math.max(8, Math.ceil(16 / categories.length));
  const items = Array(repeat).fill(categories).flat();

  return (
    <div className="bg-[#2e2a24] py-4 overflow-hidden">
      <div className="animate-marquee">
        {items.map((cat, i) => (
          <span key={i} className="flex items-center gap-6 flex-shrink-0">
            <span className="text-mist text-xs tracking-[.2em] whitespace-nowrap uppercase">{cat}</span>
            <span className="text-bronze text-xs">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}