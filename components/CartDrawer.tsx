"use client";

import { useState } from "react";
import { useCart } from "@/lib/CartContext";
import CheckoutModal from "./CheckoutModal";

export default function CartDrawer() {
  const { cart, isOpen, closeCart, removeFromCart, changeQty, totalPrice } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  function handleCheckout() {
    closeCart();
    setCheckoutOpen(true);
  }

  return (
    <>
      <div onClick={closeCart} className={`fixed inset-0 bg-charcoal/40 z-[199] transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} />

      <div className={`fixed right-0 top-0 bottom-0 w-[360px] max-w-full bg-white z-[200] flex flex-col shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone">
          <h3 className="font-playfair text-lg">Your Cart</h3>
          <button onClick={closeCart} className="bg-transparent border-none cursor-pointer text-charcoal text-xl leading-none" aria-label="Close cart">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {cart.length === 0 ? (
            <p className="text-mist text-sm text-center mt-12">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 mb-6">
                <div className="w-16 h-16 bg-[#f0ebe0] flex items-center justify-center text-3xl flex-shrink-0">{item.emoji}</div>
                <div className="flex-1">
                  <p className="font-playfair text-sm font-medium mb-0.5">{item.name}</p>
                  <p className="text-bronze text-sm mb-2">₵{item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => changeQty(item.id, -1)} className="w-7 h-7 border border-stone bg-transparent cursor-pointer text-base flex items-center justify-center hover:bg-stone transition-colors">−</button>
                    <span className="text-sm w-5 text-center">{item.qty}</span>
                    <button onClick={() => changeQty(item.id, 1)} className="w-7 h-7 border border-stone bg-transparent cursor-pointer text-base flex items-center justify-center hover:bg-stone transition-colors">+</button>
                    <button onClick={() => removeFromCart(item.id)} className="ml-auto bg-transparent border-none cursor-pointer text-mist text-xs hover:text-red-400 transition-colors">Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="px-6 py-6 border-t border-stone">
            <div className="flex justify-between mb-4">
              <span className="text-sm font-medium">Total</span>
              <span className="font-playfair text-lg">₵{totalPrice.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} className="w-full bg-charcoal text-ivory text-xs tracking-widest font-medium py-4 border-none cursor-pointer hover:bg-bronze transition-colors">
              CHECKOUT
            </button>
            <p className="text-mist text-xs text-center mt-3">Free shipping on orders over ₵500</p>
          </div>
        )}
      </div>

      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  );
}