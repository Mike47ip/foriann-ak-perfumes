"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/CartContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { toggleCart, totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textColor = scrolled ? "text-ivory" : "text-ivory";
  const bg = scrolled ? "bg-charcoal" : "bg-transparent";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between transition-colors duration-300 ${bg}`}>
      {/* Logo */}
      <span className={`font-playfair text-xl tracking-widest font-medium transition-opacity duration-300 ${scrolled ? "opacity-100" : "opacity-0 md:opacity-100"} ${textColor}`}>
        FORIANN
      </span>

      {/* Links */}
      <div className="hidden md:flex gap-8">
        {["SHOP", "COLLECTIONS", "ABOUT", "JOURNAL"].map((link) => (
          <a
            key={link}
            href="#"
            className={`text-xs tracking-widest opacity-80 hover:opacity-100 transition-opacity no-underline ${textColor}`}
          >
            {link}
          </a>
        ))}
      </div>

      {/* Icons */}
      <div className="flex items-center gap-5">
        {/* Search */}
        <button className="bg-transparent border-none cursor-pointer p-0">
          <svg
            className="w-5 h-5"
            style={{ stroke: "#f7f2ea" }}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
        </button>

        {/* Cart */}
        <button
          onClick={toggleCart}
          className="relative flex items-center bg-transparent border-none cursor-pointer p-0"
          aria-label="Open cart"
        >
          <svg
            className="w-5 h-5"
            style={{ stroke: "#f7f2ea" }}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-bronze text-ivory text-[9px] font-semibold flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
